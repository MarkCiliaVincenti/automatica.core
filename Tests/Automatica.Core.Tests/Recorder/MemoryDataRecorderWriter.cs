﻿using Automatica.Core.Base.IO;
using Automatica.Core.EF.Models;
using Automatica.Core.EF.Models.Trendings;
using Automatica.Core.Internals.Cache.Driver;
using Automatica.Core.Runtime.Recorder;
using Microsoft.Extensions.Logging;

namespace Automatica.Core.Tests.Recorder
{
    internal class MemoryDataRecorderWriter : BaseDataRecorderWriter
    {
        public Trending LastTrending { get; private set; }

        public MemoryDataRecorderWriter(string recorderName, INodeInstanceCache nodeCache, IDispatcher dispatcher, ILoggerFactory factory) : base(recorderName, nodeCache, dispatcher, factory)
        {
        }

        internal override void Save(Trending trend, NodeInstance nodeInstance)
        {
            LastTrending = trend;
        }
    }
}
