﻿using System;
using System.Collections.Generic;
using System.Globalization;
using Automatica.Core.Base.Templates;
using Automatica.Core.EF.Models;
using RuleInterfaceDirection = Automatica.Core.Base.Templates.RuleInterfaceDirection;

namespace Automatica.Core.UnitTests.Rules
{
    public class RuleTemplateFactoryMock : IRuleTemplateFactory
    {
        private readonly Dictionary<Guid, RuleTemplate> _ruleTemplates = new Dictionary<Guid, RuleTemplate>();
        private readonly Dictionary<Guid, RuleInterfaceTemplate> _ruleInterfaceTemplates = new Dictionary<Guid, RuleInterfaceTemplate>();

        public RuleInstance CreateRuleInstanceFromTemplate(RuleTemplate template)
        {
            var rule = new RuleInstance();

            foreach (var i in template.RuleInterfaceTemplate)
            {
                var intInst = new RuleInterfaceInstance();

                intInst.This2RuleInstanceNavigation = rule;
                intInst.This2RuleInterfaceTemplateNavigation = i;
                intInst.This2RuleInterfaceTemplate = i.ObjId;
                intInst.Value = i.DefaultValue;

                rule.RuleInterfaceInstance.Add(intInst);
            }

            rule.Name = template.Name;
            rule.This2RuleTemplate = template.ObjId;
            rule.This2RuleTemplateNavigation = template;


            return rule;
        }

        public RuleInstance CreateRuleInstanceFromTemplate(Guid templateGuid)
        {
            return CreateRuleInstanceFromTemplate(_ruleTemplates[templateGuid]);
        }

        public CreateTemplateCode CreateRuleTemplate(Guid ui, string name, string description, string key, string group,
            double height, double width)
        {
            var interfaceType = new RuleTemplate();

            if (!_ruleTemplates.ContainsKey(ui))
            {
                _ruleTemplates.Add(ui, interfaceType);
            }

            var retValue = CreateTemplateCode.Created;

            interfaceType.ObjId = ui;
            interfaceType.Name = name;
            interfaceType.Description = description;
            interfaceType.Key = key;
            interfaceType.Group = group;
            interfaceType.Height = (float)height;
            interfaceType.Width = (float)width;


            _ruleTemplates[ui] = interfaceType;
            return retValue;
        }

        public CreateTemplateCode CreateRuleInterfaceTemplate(Guid ui, string name, string description,
            Guid ruleTemplate,
            RuleInterfaceDirection direction, int maxLinks, int sortOrder)
        {
            var interfaceType = new RuleInterfaceTemplate();

            if (!_ruleInterfaceTemplates.ContainsKey(ui))
            {
                _ruleInterfaceTemplates.Add(ui, interfaceType);
                _ruleTemplates[ruleTemplate].RuleInterfaceTemplate.Add(interfaceType);
            }

            interfaceType.ObjId = ui;
            var retValue = CreateTemplateCode.Created;


            interfaceType.Name = name;
            interfaceType.Description = description;
            interfaceType.This2RuleTemplate = ruleTemplate;
            interfaceType.This2RuleInterfaceDirection = (long) direction;
            interfaceType.MaxLinks = maxLinks;
            interfaceType.SortOrder = sortOrder;

            _ruleInterfaceTemplates[ui] = interfaceType;
            return retValue;
        }

        public CreateTemplateCode CreateParameterRuleInterfaceTemplate(Guid ui, string name, string description, Guid ruleTemplate,
             int sortOrder, RuleInterfaceParameterDataType dataType, object defaultValue)
        {
            return CreateParameterRuleInterfaceTemplate(ui, name, description, ruleTemplate, sortOrder, dataType,
                defaultValue, false);
        }

        public CreateTemplateCode CreateParameterRuleInterfaceTemplate(Guid id, string name, string description, Guid ruleTemplate,
            int sortOrder, RuleInterfaceParameterDataType dataType, object defaultValue, bool linkable)
        {
            var interfaceType = new RuleInterfaceTemplate();

            if (!_ruleInterfaceTemplates.ContainsKey(id))
            {
                _ruleInterfaceTemplates.Add(id, interfaceType);
                _ruleTemplates[ruleTemplate].RuleInterfaceTemplate.Add(interfaceType);
            }

            interfaceType.ObjId = id;
            var retValue = CreateTemplateCode.Created;

            interfaceType.Name = name;
            interfaceType.Description = description;
            interfaceType.This2RuleTemplate = ruleTemplate;
            interfaceType.This2RuleInterfaceDirection = (long)RuleInterfaceDirection.Param;
            interfaceType.MaxLinks = 0;
            interfaceType.SortOrder = sortOrder;
            interfaceType.ParameterDataType = dataType;
            interfaceType.DefaultValue = Convert.ToString(defaultValue, CultureInfo.InvariantCulture);

            _ruleInterfaceTemplates[id] = interfaceType;
            return retValue;
        }

        public CreateTemplateCode CreatePropertyTemplate(Guid uid, string name, string description, string key,
            PropertyTemplateType propertyType, Guid objectRef, string groupd, bool isVisible, bool isReadonly, string meta,
            object defaultValue, int groupOrder, int order)
        {
            throw new NotImplementedException();
        }

        public CreateTemplateCode CreatePropertyConstraint(Guid constraintId, string name, string descrption,
            PropertyConstraint constraintType, PropertyConstraintLevel level, Guid propertyTemplate)
        {
            throw new NotImplementedException();
        }

        public CreateTemplateCode CreatePropertyConstraint(Guid constraintId, string name, string descrption,
            PropertyConstraint constraintType, Guid propertyTemplate)
        {
            throw new NotImplementedException();
        }

        public CreateTemplateCode CreatePropertyConstraintData(Guid constraintData, double factor, double offset,
            Guid propertyTemplateConstraint, string propertyKey, PropertyConstraintConditionType conditionType)
        {
            throw new NotImplementedException();
        }

        public CreateTemplateCode CreatePropertyTemplate(Guid uid, string name, string description, string key,
            PropertyTemplateType propertyType, Guid nodeTemplate, string groupd, bool isVisible, bool isReadonly, string meta,
            object defaultValue, int groupOrder, int order, PropertyConstraint constraint,
            PropertyConstraintLevel constraintLevel, string constraintMeta="")
        {
            throw new NotImplementedException();
        }

        public void AddSettingsEntry(string key, object value, string group, PropertyTemplateType type, bool isVisible)
        {
            throw new NotImplementedException();
        }

        public Setting GetSetting(string key)
        {
            throw new NotImplementedException();
        }

        public CreateTemplateCode ChangeDefaultVisuTemplate(Guid uid, VisuMobileObjectTemplateTypes template)
        {
            return CreateTemplateCode.Updated;
        }
    }
}
