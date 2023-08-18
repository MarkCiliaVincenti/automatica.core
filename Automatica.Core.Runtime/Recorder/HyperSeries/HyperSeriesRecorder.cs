﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Automatica.Core.Runtime.Recorder.Base;
using System.Threading.Tasks;
using Automatica.Core.Base.IO;
using Automatica.Core.EF.Models;
using Automatica.Core.EF.Models.Trendings;
using Automatica.Core.HyperSeries;
using Automatica.Core.HyperSeries.Model;
using Automatica.Core.Internals.Cache.Driver;
using Automatica.Core.Internals.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.DotNet.Scaffolding.Shared;

namespace Automatica.Core.Runtime.Recorder.HyperSeries
{
    internal class HyperSeriesRecorder : BaseDataRecorderWriter
    {
        private readonly IConfigurationRoot _config;
        private readonly HyperSeriesContext _context;

        private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(0);

        private readonly Queue<RecordValue> _queue = new Queue<RecordValue>();
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();

        public HyperSeriesRecorder(IConfigurationRoot config, INodeInstanceCache nodeCache, IDispatcher dispatcher, HyperSeriesContext context, ILoggerFactory factory) : base(config, DataRecorderType.HyperSeriesRecorder, nameof(HyperSeriesRecorder), nodeCache, dispatcher, factory)
        {
            _config = config;
            _context = context;
        }

        public override async Task Start()
        {
            try
            {
                _config.Providers.FirstOrDefault(p => p is DatabaseConfigurationProvider)!.Load();
                await using var hyperContext = new HyperSeriesContext(_config);
                await hyperContext.Database.MigrateAsync();

                _ = Task.Run(WorkerThread, _cancellationTokenSource.Token);

                await base.Start();
            }
            catch (Exception e)
            {
                Logger.LogError(e, $"Could not startup hyperseries recorder....{e}");
            }
        }

        public override Task Stop()
        {
            _cancellationTokenSource.Cancel(true);
            return base.Stop();
        }

        private async Task WorkerThread()
        {

            while (true)
            {
                try
                {
                    await _semaphore.WaitAsync(_cancellationTokenSource.Token);

                    var record = _queue.Dequeue();
                    await _context.AddRecordValue(record);
                }
                catch (TaskCanceledException)
                {
                    
                }
            }
        }

        internal override Task Save(Trending trend, NodeInstance nodeInstance)
        {
            _queue.Enqueue(new RecordValue
            {
                NodeInstanceId = nodeInstance.ObjId,
                Timestamp = trend.Timestamp,
                Value = trend.Value,
                TrendId = trend.ObjId
            });
            _semaphore.Release();
            return Task.CompletedTask;
        }
    }
}
