﻿using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Automatica.Core.Base.IO;
using Automatica.Core.EF.Models;
using Automatica.Core.Internals;
using Automatica.Core.Internals.Cache.Common;
using Automatica.Core.Internals.Cache.Driver;
using Automatica.Core.Internals.Cache.Logic;
using Automatica.Core.Runtime.Abstraction.Plugins.Drivers;
using Automatica.Core.Runtime.Abstraction.Plugins.Logics;
using Microsoft.Extensions.Logging;

[assembly: InternalsVisibleTo("Automatica.Core.Tests")]

namespace Automatica.Core.Runtime.IO
{
    internal class RuleEngineDispatcher : IRuleEngineDispatcher
    {
        private readonly ILinkCache _linkCache;
        private readonly IDispatcher _dispatcher;
        private readonly ILogicInstancesStore _logicInstancesStore;
        private readonly IDriverNodesStore _driverNodesStore;
        private readonly INodeInstanceCache _nodeInstanceCache;
        private readonly ILogicInterfaceInstanceCache _logicInterfaceInstanceCache;
        private readonly object _lock = new object();

        public RuleEngineDispatcher(ILinkCache linkCache, 
            IDispatcher dispatcher, 
            ILogicInstancesStore logicInstancesStore, 
            IDriverNodesStore driverNodesStore,
            INodeInstanceCache nodeInstanceCache,
            ILogicInterfaceInstanceCache logicInterfaceInstanceCache)
        {
            _linkCache = linkCache;
            _dispatcher = dispatcher;
            _logicInstancesStore = logicInstancesStore;
            _driverNodesStore = driverNodesStore;
            _nodeInstanceCache = nodeInstanceCache;
            _logicInterfaceInstanceCache = logicInterfaceInstanceCache;
        }

        private void GetFullName(NodeInstance node, List<string> names)
        {
            if (node.This2ParentNodeInstanceNavigation == null)
            {
                return;
            }
            names.Add(node.This2ParentNodeInstanceNavigation.Name);
            GetFullName(node.This2ParentNodeInstanceNavigation, names);
        }

        private string GetFullName(NodeInstance node)
        {
            var list = new List<string>();
            list.Add(node.Name);
            GetFullName(node, list);
            list.Reverse();
            return String.Join("-", list);
        }

        public bool Load()
        {
            var data = _linkCache.All();

            foreach (var entry in data)
            {
                if (entry.This2NodeInstance2RulePageInput.HasValue && entry.This2NodeInstance2RulePageOutput.HasValue) // node 2 node
                {
                    var sourceNode = _nodeInstanceCache.Get(entry.This2NodeInstance2RulePageOutput.Value);
                    var targetNode = _nodeInstanceCache.Get(entry.This2NodeInstance2RulePageInput.Value);

                    if (sourceNode == null || targetNode == null)
                    {
                        throw new ArgumentException($"{nameof(sourceNode)} || {nameof(targetNode)} is empty - invalid configuration ");
                    }

                    var inputId = sourceNode;
                    SystemLogger.Instance.LogInformation($"Node2Node - \"{GetFullName(sourceNode)}\" is mapped to \"{GetFullName(targetNode)}\"");
                    _dispatcher.RegisterDispatch(DispatchableType.NodeInstance, sourceNode.ObjId, (dispatchable, o) =>
                    {
                        ValueDispatched(dispatchable, o, targetNode.ObjId);
                    });
                }
                else if (entry.This2RuleInterfaceInstanceInput.HasValue && entry.This2RuleInterfaceInstanceOutput.HasValue) // rule 2 rule
                {
                    var targetNode = _logicInterfaceInstanceCache.Get(entry.This2RuleInterfaceInstanceInput.Value);
                    var sourceNode = _logicInterfaceInstanceCache.Get(entry.This2RuleInterfaceInstanceOutput.Value);

                    if (sourceNode == null || targetNode == null)
                    {
                        throw new ArgumentException($"{nameof(sourceNode)} || {nameof(targetNode)} is empty - invalid configuration ");
                    }

                    var inputId = entry.This2RuleInterfaceInstanceOutput.Value;
                    SystemLogger.Instance.LogInformation($"Rule2Rule - {sourceNode.This2RuleInstanceNavigation.Name} is mapped to {targetNode.This2RuleInstanceNavigation.Name}");
                    _dispatcher.RegisterDispatch(DispatchableType.RuleInstance, inputId, (dispatchable, o) =>
                    {
                        ValueDispatchToRule(dispatchable, o, targetNode.This2RuleInstance, targetNode);
                    });
                }
                else if (entry.This2RuleInterfaceInstanceInput.HasValue && entry.This2NodeInstance2RulePageOutput.HasValue) // node 2 rule
                {
                    var sourceNode = _nodeInstanceCache.Get(entry.This2NodeInstance2RulePageOutput.Value);
                    var targetNode = _logicInterfaceInstanceCache.Get(entry.This2RuleInterfaceInstanceInput.Value);


                    if (sourceNode == null || targetNode == null)
                    {
                        throw new ArgumentException($"{nameof(sourceNode)} || {nameof(targetNode)} is empty - invalid configuration ");
                    }

                    SystemLogger.Instance.LogInformation($"Node2Rule - \"{GetFullName(sourceNode)}\" is mapped to {targetNode.This2RuleInstanceNavigation.Name}");
                    _dispatcher.RegisterDispatch(DispatchableType.NodeInstance, sourceNode.ObjId, (dispatchable, o) =>
                    {
                        ValueDispatchToRule(dispatchable, o, targetNode.This2RuleInstance, targetNode);
                    });
                }
                else if (entry.This2NodeInstance2RulePageInput.HasValue && entry.This2RuleInterfaceInstanceOutput.HasValue) // rule 2 node
                {
                    var targetNode = _nodeInstanceCache.Get(entry.This2NodeInstance2RulePageInput.Value);
                    var sourceNode= _logicInterfaceInstanceCache.Get(entry.This2RuleInterfaceInstanceOutput.Value);


                    if (sourceNode == null || targetNode == null)
                    {
                        throw new ArgumentException($"{nameof(sourceNode)} || {nameof(targetNode)} is empty - invalid configuration ");
                    }

                    var inputId = entry.This2RuleInterfaceInstanceOutput.Value;
                    SystemLogger.Instance.LogInformation($"Rule2Node - {sourceNode.This2RuleInstanceNavigation.Name} is mapped to \"{GetFullName(targetNode)}\"");
                    _dispatcher.RegisterDispatch(DispatchableType.RuleInstance, inputId, (dispatchable, o) =>
                    {
                        ValueDispatched(dispatchable, o, targetNode.ObjId);
                    });
                }
            }

            return true;
        }



        private void ValueDispatchToRule(IDispatchable dispatchable, object o, Guid toRule, RuleInterfaceInstance toInterface)
        {
            lock (_lock)
            {
                foreach (var rule in _logicInstancesStore.Dictionary())
                {
                    if (rule.Key.ObjId == toRule)
                    {
                        SystemLogger.Instance.LogDebug($"ValueDispatchToRule: {dispatchable.Name} write value {o} to {toInterface.This2RuleInterfaceTemplateNavigation.Name}");
                        var ruleResults = rule.Value.ValueChanged(toInterface, dispatchable, o);

                        foreach (var result in ruleResults)
                        {
                            _dispatcher.DispatchValue(result.Instance, result.Value);
                        }
                    }
                }
            }
        }

        private void ValueDispatched(IDispatchable dispatchable, object o, Guid to)
        {
            foreach (var node in _driverNodesStore.All())
            {
                if (node.Id == to)
                {
                    SystemLogger.Instance.LogDebug($"ValueDispatched: {dispatchable.Name} write value {o} to {node.Name}-{node.Id}");
                    node.WriteValue(dispatchable, o);
                }
            }
        }

        public void Dispose()
        {
            _dispatcher.ClearRegistrations();
        }
    }
}
