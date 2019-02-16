import { Injectable } from "@angular/core";
import { BaseService } from "./base-service";
import { Router } from "@angular/router";
import { TranslationService } from "angular-l10n";
import { HttpClient } from "@angular/common/http";
import { NodeTemplate } from "../base/model/node-template";
import { AreaTemplate } from "../base/model/areas";
import { RuleTemplate } from "../base/model/rule-template";
import { CategoryGroup } from "../base/model/categories";

@Injectable()
export class DesignTimeDataService extends BaseService {

    private _nodeTemplates: NodeTemplate[];
    private _areaTemplates: AreaTemplate[];
    private _ruleTemplates: RuleTemplate[];
    private _categoryGroups: CategoryGroup[];

    constructor(http: HttpClient, pRouter: Router, translationService: TranslationService) {
        super(http, pRouter, translationService);
    }

    async getNodeTemplates(): Promise<NodeTemplate[]> {
        if (!this._nodeTemplates) {
            this._nodeTemplates = await super.getMultiple<NodeTemplate>("nodeTemplates");
        }

        return Promise.resolve(this._nodeTemplates);
    }
    async getAreaTemplates(): Promise<AreaTemplate[]> {
        if (!this._areaTemplates) {
            this._areaTemplates = await super.getMultiple<AreaTemplate>("areas/templates");
        }

        return Promise.resolve(this._areaTemplates);
    }

    async getCategoryGroups(): Promise<CategoryGroup[]> {
        if (!this._categoryGroups) {
            this._categoryGroups = await super.getMultiple<CategoryGroup>("categories/groups");
        }

        return Promise.resolve(this._categoryGroups);
    }

    async getRuleTemplates(): Promise<RuleTemplate[]> {
        if (!this._ruleTemplates) {
            this._ruleTemplates = await super.getMultiple<RuleTemplate>("rules/templates");
        }

        return Promise.resolve(this._ruleTemplates);
    }

}
