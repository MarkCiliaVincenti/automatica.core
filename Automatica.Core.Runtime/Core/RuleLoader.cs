﻿using System.Collections.Generic;
using System.IO;
using System.Reflection;
using Automatica.Core.Base.Common;
using Automatica.Core.EF.Models;
using Automatica.Core.Rule;
using Automatica.Core.Runtime.Core.Plugins;
using Microsoft.Extensions.Logging;

namespace Automatica.Core.Runtime.Core
{
    public static class RuleLoader
    {
        public static IList<RuleFactory> LoadSingle(ILogger logger, Plugin plugin, AutomaticaContext database)
        {
            var fileInfo = new FileInfo(Assembly.GetEntryAssembly().Location);
            var dir = Path.Combine(fileInfo.DirectoryName, ServerInfo.LogicsDirectory, plugin.ComponentName);

            return Loader.Load<RuleFactory>(dir, "*.dll", logger, database, false);
        }

        public static IList<RuleFactory> GetRuleFactories(ILogger logger, string path, string searchPattern, AutomaticaContext database, bool isInDevMode)
        {
            var fileInfo = new FileInfo(path);
            string dir = fileInfo.DirectoryName;
            if (fileInfo.Attributes == FileAttributes.Directory)
            {
                dir = path;
            }

            var driverPath = Path.Combine(dir, ServerInfo.LogicsDirectory);

            if (!Directory.Exists(driverPath))
            {
                driverPath = dir;
            }
            return Loader.Load<RuleFactory>(dir, searchPattern, logger, database, isInDevMode);
        }
    }
}
