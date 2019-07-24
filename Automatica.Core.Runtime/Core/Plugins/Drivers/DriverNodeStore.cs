﻿using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Automatica.Core.Base.Cache;
using Automatica.Core.Driver;
using Automatica.Core.Runtime.Abstraction.Plugins.Drivers;

[assembly: InternalsVisibleTo("Automatica.Core.Tests")]

namespace Automatica.Core.Runtime.Core.Plugins.Drivers
{
    internal class DriverNodeStore : GuidStoreBase<IDriverNode>, IDriverNodesStore
    {
        public async Task ReInitialize()
        {
            foreach (var node in All())
            {
                await node.OnReinit();
            }
        }
    }
}
