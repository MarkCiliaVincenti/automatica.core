﻿using System;
using System.Collections.Generic;
using System.Linq;
using Automatica.Core.Base.Localization;
using Automatica.Core.EF.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Automatica.Core.Internals.Cache.Driver
{
    internal class NodeTemplateCache : AbstractCache<NodeTemplate>, INodeTemplateCache
    {
        private readonly ILocalizationProvider _localizationProvider;

        private readonly IDictionary<Guid, IList<NodeTemplate>> _neededTemplateKeyDictionary =
            new Dictionary<Guid, IList<NodeTemplate>>();

        public NodeTemplateCache(IConfiguration configuration, ILocalizationProvider localizationProvider) : base(configuration)
        {
            _localizationProvider = localizationProvider;
        }

        protected override IQueryable<NodeTemplate> GetAll(AutomaticaContext context)
        {
            var x = context.NodeTemplates.AsNoTracking()
                .Include(a => a.This2NodeDataTypeNavigation)
                .Include(a => a.NeedsInterface2InterfacesTypeNavigation)
                .Include(a => a.ProvidesInterface2InterfaceTypeNavigation)
                .Include(a => a.PropertyTemplate).ThenInclude(b => b.This2PropertyTypeNavigation)
                .Include(a => a.PropertyTemplate).ThenInclude(b => b.Constraints).ThenInclude(c => c.ConstraintData);

            return x;
        }

        public override void Add(Guid key, NodeTemplate value)
        {
            if (!_neededTemplateKeyDictionary.ContainsKey(value.NeedsInterface2InterfacesType))
            {
                _neededTemplateKeyDictionary.Add(value.NeedsInterface2InterfacesType, new List<NodeTemplate>());
            }

            _neededTemplateKeyDictionary[value.NeedsInterface2InterfacesType].Add(value);

            base.Add(key, value);
        }

        protected override Guid GetKey(NodeTemplate obj)
        {
            return obj.ObjId;
        }

        public ICollection<NodeTemplate> GetSupportedTemplates(NodeInstance targetNodeInstance, Guid neededInterfaceType)
        {
            Initialize();

            var toAdd = new List<NodeTemplate>();

            if (!_neededTemplateKeyDictionary.ContainsKey(neededInterfaceType))
            {
                return toAdd;
            }

            var templates = _neededTemplateKeyDictionary[neededInterfaceType];
            

            if (targetNodeInstance.InverseThis2ParentNodeInstanceNavigation.Count >= targetNodeInstance
                    .This2NodeTemplateNavigation.ProvidesInterface2InterfaceTypeNavigation.MaxChilds)
            {
                return toAdd;
            }

            foreach (var template in templates)
            {
                var existingNodes = targetNodeInstance.InverseThis2ParentNodeInstanceNavigation.Count(a =>
                    a.This2NodeTemplate == template.ObjId);
                
                if (template.MaxInstances > 0 && existingNodes >= template.MaxInstances)
                {
                    continue;
                }

                if (template.ProvidesInterface2InterfaceTypeNavigation.MaxInstances > 0)
                {
                    existingNodes = targetNodeInstance.InverseThis2ParentNodeInstanceNavigation.Count(a =>
                        a.This2NodeTemplate == template.ObjId);

                    if (existingNodes >= template.MaxInstances)
                    {
                        continue;
                    }
                }

                toAdd.Add(template);
            }

            return toAdd.GroupBy(a => a.ObjId).Select(g => g.First()).ToList();
        }
    }
}
