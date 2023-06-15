﻿using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Automatica.Core.Base.Common;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Automatica.Core.Runtime.RemoteConnect.Frp
{
    internal class FrpProcess : IFrpProcess
    {
        private readonly IFrpcApiClient _apiClient;
        private readonly IOptionsMonitor<FrpcOptions> _settings;
        private readonly IConfiguration _config;
        private readonly ILogger _logger;

        private readonly string _processName = "frpc";

        public FrpProcess(IFrpcApiClient apiClient, IOptionsMonitor<FrpcOptions> settings, IConfiguration config, ILogger<FrpProcess> logger)
        {
            _apiClient = apiClient;
            _settings = settings;
            _config = config;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken token = default)
        {
            await KillExistingProcessesAsync();

            var processInformation = GetProcessStartInfo();
            using var process =
                Process.Start(processInformation) ??
                throw new InvalidOperationException("Could not start process");

            var error = await process.StandardError.ReadToEndAsync(token);
            var stdout= await process.StandardOutput.ReadToEndAsync(token);

            _logger.LogInformation(stdout);
            _logger.LogError(error);


            var cancellationToken = new CancellationTokenSource(TimeSpan.FromSeconds(30)).Token;
            while (!await _apiClient.IsReady(cancellationToken))
            {
                await Task.Delay(100, cancellationToken);
            }
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            await KillExistingProcessesAsync();
        }

        private async Task KillExistingProcessesAsync()
        {
            var existingProcesses = Process
                .GetProcessesByName(_processName)
                .ToArray();
            if (!existingProcesses.Any())
                return;

            try
            {
                _logger.LogDebug("Killing existing frpc processes");

                foreach (var existingProcess in existingProcesses)
                {
                    existingProcess.Kill();
                    await existingProcess.WaitForExitAsync();
                }
            }
            finally
            {
                foreach (var existingProcess in existingProcesses)
                {
                    existingProcess.Dispose();
                }
            }
        }

        private ProcessStartInfo GetProcessStartInfo()
        {
            var processStartInfo = new ProcessStartInfo(
                GetExecutableFileName(), $"-c {"frpc.ini"}")
            {
                CreateNoWindow = true,
                WindowStyle = ProcessWindowStyle.Hidden,
                UseShellExecute = false, //RuntimeInformation.IsOSPlatform(OSPlatform.Windows),
                WorkingDirectory = Path.Combine(Environment.CurrentDirectory, "frp"),
                RedirectStandardError = true,
                RedirectStandardOutput = true,
                RedirectStandardInput = false,
                EnvironmentVariables =
                {
                    {"ADMIN_PORT", $"{_settings.CurrentValue.AdminPort}"},
                    {"REMOTE_URL", $"{_settings.CurrentValue.ServerAddress}"},
                    {"REMOTE_PORT", $"{_settings.CurrentValue.ServerPort}"},
                    {"LOG_FILE", $"{_settings.CurrentValue.LogFile}"},
                    {"LOG_LEVEL", $"{_settings.CurrentValue.LogLevel}"},
                    
                    {"LOCAL_IP", $"{_settings.CurrentValue.LocalIp}"},
                    {"LOCAL_PORT", $"{ServerInfo.SslWebPort}"},
                    {"SUB_DOMAIN", $"{_settings.CurrentValue.SubDomain ?? _config["db:remoteDomain"]}"}
                }
            };
            return processStartInfo;
        }
        private string GetExecutableFileName()
        {
            if (File.Exists(Path.Combine("frp", "frpc.exe")))
            {
                return Path.Combine("frp", "frpc.exe");
            }

            return RuntimeInformation.IsOSPlatform(OSPlatform.Windows) ? $"{_processName}.exe" : $"{_processName}";
        }
    }
}
