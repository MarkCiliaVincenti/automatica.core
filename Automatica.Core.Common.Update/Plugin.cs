﻿using Automatica.Core.Base.Common;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading.Tasks;

namespace Automatica.Core.Common.Update
{
    public static class Plugin
    {
        public static async Task<bool> DownloadForUpdate(string downloadUrl, string fileName)
        {
            using (var webClient = new WebClient())
            {
                var automaticaPluginUpdateDir = Path.Combine(Path.GetTempPath(), ServerInfo.PluginUpdateDirectoryName);
                if (!Directory.Exists(automaticaPluginUpdateDir))
                {
                    Directory.CreateDirectory(automaticaPluginUpdateDir);
                }

                var tmpFile = Path.GetTempFileName();
                try
                {
                    await webClient.DownloadFileTaskAsync(downloadUrl, Path.Combine(automaticaPluginUpdateDir, fileName));
                    return true;
                }
                catch (Exception e)
                {
                    Console.Error.WriteLine($"Could not download file {e}");
                }
                finally
                {
                    File.Delete(tmpFile);
                }
                return false;
            }
        }

        public static void InstallPlugin(string pluginFile, string installDirectory)
        {
            ZipFile.ExtractToDirectory(pluginFile, installDirectory, true);
            File.Delete(Path.Combine(installDirectory, "automatica-manifest.json"));
        }

        public static PluginManifest GetEmbeddedPluginManifest(ILogger logger, Assembly assembly)
        {
            var resources = assembly.GetManifestResourceNames().SingleOrDefault(a => a.EndsWith("automatica-manifest.json"));
            if(resources == null)
            {
                logger.LogWarning($"{assembly} does not contain a manifest files");
                return null;
            }
            return LoadManifest(logger, assembly.GetManifestResourceStream(resources));
        }
        public static bool CheckPluginFile(ILogger logger, string fileName, bool checkVersion)
        {
            var tempPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
            var check = CheckPluginFileInternal(logger, tempPath, fileName, checkVersion);

            if (Directory.Exists(tempPath))
            {
                Directory.Delete(tempPath, true);
            }
            
            return check;
        }

        public static PluginManifest GetPluginManifest(ILogger logger, string fileName, string tempPath)
        {
            var manifest = GetPluginManifestInternal(logger, tempPath, fileName);
            return manifest;
        }

        private static PluginManifest GetPluginManifestInternal(ILogger logger, string tempPath, string fileName)
        {
            try
            {
                ZipFile.ExtractToDirectory(fileName, tempPath, true);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Could not unzip update file");
                return null;
            }

            var files = Directory.GetFiles(tempPath, "automatica-manifest.json");

            if (files.Length == 0)
            {
                logger.LogError("Could not find automatica-manifest.json file");
                return null;
            }

            var manifest = files[0];
            
            using (var reader = new StreamReader(manifest))
            {
                return LoadManifest(logger, reader.BaseStream);
            }
        }

        private static PluginManifest LoadManifest(ILogger logger, Stream stream)
        {
            var manifestStr = "";
            using (var reader = new StreamReader(stream))
            {
                manifestStr = reader.ReadToEnd();
            }
            try
            {
                var pluginManifest = JsonConvert.DeserializeObject<PluginManifest>(manifestStr);

                return pluginManifest;
            }
            catch (Exception e)
            {
                logger.LogError(e, "Exception occured while checking the update package");
                return null;
            }
        }

        private static bool CheckPluginFileInternal(ILogger logger, string tempPath, string fileName, bool checkVersion)
        {
            try
            {
                var pluginManifest = GetPluginManifestInternal(logger, tempPath, fileName);

                if(pluginManifest == null)
                {
                    return false;
                }

                if (checkVersion && new Version(ServerInfo.GetServerVersion()) <= pluginManifest.Automatica.MinCoreServerVersion)
                {
                    logger.LogError($"Core server version must be at least {pluginManifest.Automatica.MinCoreServerVersion}! Current version is {ServerInfo.GetServerVersion()}");
                    return false;
                }

                var pluginFiles = Directory.GetFiles(Path.Combine(tempPath, pluginManifest.Automatica.ComponentName), "*.dll");

                foreach (var dep in pluginManifest.Automatica.Dependencies)
                {
                    var found = false;

                    if (dep == pluginManifest.Automatica.Output)
                    {
                        continue;
                    }

                    foreach (var file in pluginFiles)
                    {
                        var fileInfo = new FileInfo(file);

                        if (fileInfo.Name == dep)
                        {
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                    {
                        logger.LogError($"Dependency {dep} is missing");
                        return false;
                    }
                }

                return true;
            }
            catch(Exception e)
            {
                logger.LogError(e, "Exception occured while checking the update package");
                return false;
            }
        }
    }
}
