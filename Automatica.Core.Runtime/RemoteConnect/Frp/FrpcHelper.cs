﻿using System.IO;
using System;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using Automatica.Core.Base.Common;
using Automatica.Core.Base.Tunneling;

namespace Automatica.Core.Runtime.RemoteConnect.Frp
{
    internal static class FrpcHelper
    {
        private const string FrpcTemplateFile = "frpc_template.ini";

        public static async Task CreateServiceFileFromTemplate(TunnelingProtocol tunnelingProtocol, string name,
            string address, int targetPort,
            int remotePort, CancellationToken token)
        {
            var currentDir = ServerInfo.GetBasePath();

            if (!Directory.Exists(Path.Combine(currentDir, "frp")))
            {
                throw new ArgumentException("Could not find configuration directory!");
            }

            if (!File.Exists(Path.Combine(currentDir, "frp", FrpcTemplateFile)))
            {
                throw new ArgumentException(
                    $"Could not find config file '{FrpcTemplateFile}' in {Directory.GetCurrentDirectory()}");
            }

            var templateFile = await File.ReadAllLinesAsync(Path.Combine(currentDir, "frp", FrpcTemplateFile), token);
            await using var newFile =
                new StreamWriter(Path.Combine(currentDir, "frp", "enabled",
                    $"{name}_{tunnelingProtocol.ToString().ToLowerInvariant()}.ini"));

            foreach (var line in templateFile)
            {
                var newLine = line.Replace("{{name}}", name)
                    .Replace("{{type}}", $"{tunnelingProtocol.ToString().ToLowerInvariant()}")
                    .Replace("{{local_ip}}", address)
                    .Replace("{{local_port}}", $"{targetPort}")
                    .Replace("{{remote_port}}", $"{remotePort}");
                await newFile.WriteLineAsync(newLine);
            }

            newFile.Close();

        }

    }
}
