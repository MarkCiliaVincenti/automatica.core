﻿using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using Automatica.Core.Runtime.Abstraction.Plugins;

namespace Automatica.Core.Runtime.Core.Plugins
{
    internal class GuidStoreBase<T> : StoreBase<Guid, T>
    {

    }

    internal class StoreBase<T1, T2> : IStore<T1, T2>
    {
        private readonly IDictionary<T1, T2> _store = new ConcurrentDictionary<T1, T2>();

        public virtual void Add(T1 key, T2 value)
        {
            if (!Contains(key))
            {
                _store.Add(key, value);
            }
        }

        public virtual bool Contains(T1 key)
        {
            return _store.ContainsKey(key);
        }

        public T2 Get(T1 key)
        {
            return _store[key];
        }

        public ICollection<T2> All()
        {
            return _store.Values;
        }

        public IDictionary<T1, T2> Dictionary()
        {
            return _store;
        }

        public virtual void Clear()
        {
            _store.Clear();
        }
    }
}
