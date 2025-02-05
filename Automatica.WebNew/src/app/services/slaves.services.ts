import { Injectable } from "@angular/core";
import { BaseService } from "./base-service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { L10nTranslationService } from "angular-l10n";
import { DesignTimeDataService } from "./design-time-data.service";
import { Slave } from "../base/model/slaves/slave";

@Injectable()
export class SlavesService extends BaseService {

    constructor(http: HttpClient, pRouter: Router, translationService: L10nTranslationService, private designData: DesignTimeDataService) {
        super(http, pRouter, translationService);
    }


    getSlaves(): Promise<Slave[]> {
        return super.getMultiple<Slave>("slave");
    }

    saveSlaves(slaves: Slave[]) {
        const data = new Array<any>();
        for (const set of slaves) {
            data.push(set.toJson());
        }
        return super.postMultiple("slave", data);
    }


}
