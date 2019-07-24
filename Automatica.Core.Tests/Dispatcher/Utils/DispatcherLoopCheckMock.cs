﻿using System;
using System.Threading.Tasks;
using Automatica.Core.Base.IO;
using Automatica.Core.UnitTests.Base.Common;

namespace Automatica.Core.Tests.Dispatcher.Utils
{
    internal class DispatcherLoopCheckMock : DispatcherMock
    {
        protected override Task DispatchValueInternal(IDispatchable self, object value, Action<IDispatchable, object> dis)
        {
            dis.Invoke(self, value);
            return Task.CompletedTask;
        }
    }
}
