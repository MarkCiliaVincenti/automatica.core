﻿using System;
using System.IO;
using System.Linq;
using Automatica.Core.Base.Common;

using Automatica.Core.EF.Models;
using Automatica.Discovery;
using ElectronNET.API;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Reflection;
using System.Runtime.Versioning;
using Automatica.Core.Runtime.Database;
using Serilog;
using Automatica.Core.Internals;
using MQTTnet.Diagnostics;
using System.Collections;

namespace Automatica.Core
{
    static class Program
    {
        static void Main(string[] args)
        {
            var configDir = new FileInfo(Assembly.GetEntryAssembly().Location).DirectoryName;

            if(Directory.Exists(Path.Combine(configDir, "config")))
            {
                configDir = Path.Combine(configDir, "config");
            }

            var config = new ConfigurationBuilder()
                .SetBasePath(configDir)
                .AddJsonFile("appsettings.json", true)
                .AddEnvironmentVariables()
                .Build();

            var logBuild = new LoggerConfiguration()
              .WriteTo.Console()
              .WriteTo.RollingFile(Path.Combine("logs", "dotnet.log"), retainedFileCountLimit: 10, fileSizeLimitBytes: 1024 * 30)
              .MinimumLevel.Verbose();

            Log.Logger = logBuild.CreateLogger();

            foreach (DictionaryEntry env in Environment.GetEnvironmentVariables())
            {
                var envVar = $"{env.Key}={env.Value}";


                Log.Logger.Debug($"Using env variable: {envVar}");
            }

            var logger = SystemLogger.Instance;
            logger.LogInformation($"Binding mqtt logger...");

            MqttNetGlobalLogger.LogMessagePublished += (s, e) =>
            {
                var trace = $"mqtt >> [{e.TraceMessage.ThreadId}] [{e.TraceMessage.Source}] [{e.TraceMessage.Level}]: {e.TraceMessage.Message}";
                if (e.TraceMessage.Exception != null)
                {
                    trace += Environment.NewLine + e.TraceMessage.Exception.ToString();
                }

                logger.LogDebug(trace);
            };

            var webHost = BuildWebHost(config["server:port"]);

            if (args.Length > 0 && args[0] == "develop")
            {
                ServerInfo.DriverDirectoy = args[1];
                ServerInfo.DriverPattern= args[2];
                ServerInfo.IsInDevelopmentMode = true;
            }
            else
            {
                ServerInfo.DriverDirectoy = new FileInfo(Assembly.GetExecutingAssembly().Location).DirectoryName;
            }

            logger.LogInformation($"Starting...Version {ServerInfo.GetServerVersion()}, Datetime {ServerInfo.StartupTime}. Running .NET Core Version {GetNetCoreVersion()}");

            var db = webHost.Services.GetRequiredService<AutomaticaContext>();
            DatabaseInit.EnusreDatabaseCreated(webHost.Services);

          

            var serverId = db.Settings.SingleOrDefault(a => a.ValueKey == "ServerUID");

            if (serverId == null)
            {
                var guid = Guid.NewGuid();
                db.Settings.Add(new Setting
                {
                    ValueKey = "ServerUID",
                    Value = guid,
                    Group = "SERVER.SETTINGS",
                    IsVisible = false,
                    Type = (long)PropertyTemplateType.Text
                });
                ServerInfo.ServerUid = guid;
                db.SaveChanges();
            }
            else
            {
                ServerInfo.ServerUid = new Guid(serverId.ValueText);
            }

            webHost.Services.GetService<DiscoveryService>();
            webHost.Run();

            logger.LogInformation("Stopped...");
        }

        public static IWebHost BuildWebHost(string port)
        {
            ServerInfo.WebPort = port;

            var webHost = WebHost.CreateDefaultBuilder()
                .UseStartup<Startup>().UseKestrel(o => {
                    o.ListenAnyIP(Convert.ToInt32(port)); 
                })
                //.UseElectron(new string[])
                .UseSerilog()
                .ConfigureLogging(logging => {
                    logging.AddFilter("Microsoft.AspNetCore.SignalR", LogLevel.Trace);
                    logging.AddFilter("Microsoft.AspNetCore.Http.Connections", LogLevel.Trace);
                });

            if (HybridSupport.IsElectronActive)
            {
                ServerInfo.WebPort = "80";
            }

            return webHost.Build();
        }

        public static string GetNetCoreVersion()
        {
            var framework = Assembly
                .GetEntryAssembly()?
                .GetCustomAttribute<TargetFrameworkAttribute>()?
                .FrameworkName;
            return framework;
        }
    }
}
