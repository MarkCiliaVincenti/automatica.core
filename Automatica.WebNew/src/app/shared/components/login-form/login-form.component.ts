import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";

import { LoginService } from "src/app/services/login.service";
import { Router } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import { DxValidationGroupComponent } from "devextreme-angular";


@Component({
    selector: "app-login-form",
    templateUrl: "./login-form.component.html",
    styleUrls: ["./login-form.component.scss"]
})
export class LoginFormComponent implements OnInit {
    login = "";
    password = "";

    @ViewChild("validationGroup", { static: true })
    validationGroup: DxValidationGroupComponent;

    constructor(private loginService: LoginService,
        private router: Router,
        private appService: AppService,
        private changeRef: ChangeDetectorRef) {
        localStorage.removeItem("jwt");
    }

    ngOnInit() {
        this.appService.isLoading = true;
        this.changeRef.detectChanges();
        this.appService.isLoading = false;
    }

    async onEnterPressed($event) {
        await this.onLoginClick($event);
    }

    async onLoginClick(args) {
        this.appService.isLoading = true;
        if (!this.validationGroup.instance.validate().isValid) {
            return;
        }

        try {
            const value = await this.loginService.login(this.login, this.password);
            this.loginService.saveToLocalStorage(value);

            if (value) {
                this.router.navigate(["/"]);
            }
        } catch (error) {

        }

        this.appService.isLoading = false;
    }
}

