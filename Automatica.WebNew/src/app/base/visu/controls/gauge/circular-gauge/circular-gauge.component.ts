import { Component, OnInit, OnDestroy } from "@angular/core";
import { DxCircularGaugeComponent } from "devextreme-angular";
import { NotifyService } from "src/app/services/notify.service";
import { TranslationService } from "angular-l10n";
import { BaseGaugeComponent } from "../base/base.gauge.component";
import { AppService } from "src/app/services/app.service";

@Component({
  selector: "app-circular-gauge",
  templateUrl: "./circular-gauge.component.html",
  styleUrls: ["./circular-gauge.component.scss"]
})
export class CircularGaugeComponent extends BaseGaugeComponent<DxCircularGaugeComponent> implements OnInit, OnDestroy {


  constructor(
    notifyService: NotifyService, 
    translate: TranslationService,
    appService: AppService) {
    super(notifyService, translate, appService)
  }

  ngOnInit() {
    this.initGauge();
  }

  ngOnDestroy(): void {
    this.destroyGauge();
  }


}
