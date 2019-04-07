﻿
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Automatica.Core.Base.IO
{
    public interface IDispatcher
    {
        Task DispatchValue(IDispatchable self, object value);

        Task RegisterDispatch(DispatchableType type, Guid id, Action<IDispatchable, object> callback);

        IDictionary<Guid, object> GetValues(DispatchableType type);

        object GetValue(DispatchableType type, Guid id);

        Task ClearRegistrations();
    }
}
