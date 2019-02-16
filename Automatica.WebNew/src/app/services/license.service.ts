import { Injectable } from "@angular/core";
import { BaseService } from "../services/base-service";
import { Router } from "@angular/router";
import { TranslationService } from "angular-l10n";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class LicenseService extends BaseService {
    constructor(http: HttpClient, pRouter: Router, translationService: TranslationService) {
        super(http, pRouter, translationService);
    }


    public getLicense(): Promise<any> {
        return super.getJson("license");
    }

    public saveLicense(license: string): Promise<any> {
        return super.postJson("license", { License: license });
    }
}
