import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild } from "@angular/core";
import { faClock, far, IconDefinition } from "@fortawesome/free-regular-svg-icons";
import { fad } from "@fortawesome/pro-duotone-svg-icons";
import { faAirConditioner, faAppleCore, faBedBunk, faBedFront, faBoothCurtain, faDryerHeat, faFireplace, faForkKnife, faHeat, faOutlet, faTemperatureHot, faTemperatureSnow, faTemperatureSun, faToiletPaperBlank } from "@fortawesome/pro-solid-svg-icons";
import { fas, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { AppService } from "./services/app.service";
import { NotifyService } from "./services/notify.service";
import { L10nTranslationService, L10nLocale } from "angular-l10n";
import { BaseComponent } from "./base/base-component";
import { FaIconLibrary, FaConfig } from "@fortawesome/angular-fontawesome";
import { DxLoadPanelComponent } from "devextreme-angular";
import { ThemeService } from "./services/theme.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent extends BaseComponent implements OnInit {

  title = "automatica-web";

  @ViewChild("loadPanel", { static: true })
  dxLoadPanel: DxLoadPanelComponent;

  constructor(appService: AppService,
    notify: NotifyService,
    translate: L10nTranslationService,
    private changeDet: ChangeDetectorRef,
    private library: FaIconLibrary,
    private ngZone: NgZone,
    private iconConfig: FaConfig,
    private themeService: ThemeService) {
    super(notify, translate, appService);

    const automaticaLogo = {
      prefix: "fas",
      iconName: "automatica-logo",
      icon: [256, 256, [], "e001",
        "M129.485,299.932c2.266-0.309,5.332-1.19,8.91-3.402c2.046-1.279,4.84-4.396,4.331-6.753 c-0.143-0.649-0.425-1.312-0.931-1.899c-1.559-1.867-5.468-1.35-7.46,0.019c-2.555,1.735-5.79,4.442-7.722,7.836 C125.434,297.836,127.095,300.254,129.485,299.932z M117.453,289.898c2.275-0.308,5.337-1.194,8.907-3.402c2.058-1.274,4.84-4.387,4.34-6.758 c-0.145-0.64-0.427-1.307-0.952-1.899c-1.54-1.862-5.453-1.363-7.439,0.004c-2.557,1.751-5.801,4.462-7.722,7.855 C113.412,287.816,115.059,290.215,117.453,289.898z M94.603,259.898c2.105,0.924,5.176,1.722,9.393,1.68c2.411-0.032,6.408-1.288,7.188-3.579c0.208-0.616,0.296-1.326,0.161-2.124c-0.362-2.38-3.988-3.957-6.39-3.799c-3.097,0.187-7.278,0.85-10.657,2.763 C92.197,256.034,92.368,258.946,94.603,259.898z M105.417,278.235c2.285-0.309,5.327-1.195,8.9-3.402c2.065-1.279,4.847-4.392,4.34-6.776c-0.147-0.626-0.434-1.284-0.94-1.899c-1.542-1.862-5.458-1.345-7.441,0.023c-2.546,1.764-5.808,4.447-7.722,7.85 C101.366,276.139,103.025,278.552,105.417,278.235z M174.779,256.864c1.36-2.002,2.646-6.001,1.226-7.938c-0.383-0.541-0.906-1.013-1.631-1.358c-2.168-1.071-5.54,0.98-6.807,3.057c-1.612,2.637-3.481,6.431-3.859,10.318c-0.22,2.399,2.272,3.935,4.321,2.646 C169.995,262.395,172.415,260.336,174.779,256.864z M177.806,275.822c1.958-1.194,4.396-3.248,6.763-6.734c1.349-1.993,2.644-5.97,1.213-7.935c-0.39-0.531-0.915-0.994-1.641-1.349c-2.168-1.063-5.538,0.994-6.798,3.043c-1.622,2.642-3.486,6.432-3.85,10.324 C173.257,275.551,175.75,277.083,177.806,275.822z M193.791,280.2c1.948-1.195,4.387-3.244,6.753-6.716c1.349-2.002,2.646-5.993,1.223-7.935c-0.39-0.541-0.924-1.003-1.64-1.349c-2.175-1.063-5.547,0.994-6.807,3.034c-1.612,2.632-3.477,6.422-3.859,10.31 C189.233,279.938,191.737,281.488,193.791,280.2z M152.06,252.505c2.278-0.299,5.33-1.186,8.91-3.394c2.056-1.292,4.84-4.389,4.343-6.765c-0.147-0.632-0.439-1.295-0.945-1.911c-1.538-1.857-5.454-1.342-7.449,0.019c-2.537,1.748-5.79,4.459-7.703,7.859 C148.018,250.423,149.687,252.823,152.06,252.505z M148.942,239.066c2.04-1.267,4.84-4.392,4.333-6.749c-0.135-0.644-0.427-1.295-0.933-1.904c-1.55-1.86-5.475-1.349-7.451,0.025c-2.555,1.75-5.799,4.45-7.722,7.848c-1.195,2.102,0.48,4.534,2.865,4.198 C142.301,242.177,145.362,241.288,148.942,239.066z M125.147,226.607c-1.188,2.093,0.471,4.522,2.854,4.196c2.273-0.308,5.32-1.188,8.9-3.407c2.056-1.267,4.845-4.387,4.338-6.744c-0.126-0.644-0.415-1.316-0.931-1.92c-1.552-1.857-5.468-1.333-7.449,0.03 C130.292,220.51,127.042,223.217,125.147,226.607z M127.518,204.646c-3.087,0.194-7.255,0.847-10.648,2.765c-2.1,1.197-1.927,4.117,0.292,5.078c2.112,0.905,5.194,1.701,9.397,1.647c2.411-0.035,6.408-1.267,7.178-3.561c0.217-0.616,0.306-1.333,0.189-2.121 C133.545,206.072,129.938,204.495,127.518,204.646z M169.433,148.481c-3.099,0.191-7.267,0.845-10.655,2.768c-2.104,1.192-1.914,4.123,0.306,5.073c2.103,0.906,5.183,1.713,9.378,1.659c2.429-0.037,6.417-1.288,7.197-3.573c0.198-0.623,0.299-1.323,0.18-2.109 C175.458,149.914,171.841,148.336,169.433,148.481z M173.131,172.714c2.084,0.905,5.167,1.715,9.379,1.65c2.41-0.038,6.408-1.279,7.196-3.563c0.208-0.623,0.296-1.333,0.18-2.122c-0.371-2.382-3.988-3.96-6.408-3.804c-3.092,0.189-7.269,0.842-10.657,2.765 C170.728,168.834,170.901,171.762,173.131,172.714z M205.773,180.48c0.224-0.627,0.317-1.323,0.189-2.121c-0.373-2.382-3.995-3.96-6.415-3.804c-3.083,0.189-7.25,0.842-10.639,2.77c-2.105,1.197-1.923,4.114,0.289,5.075c2.119,0.915,5.183,1.713,9.388,1.659 C201.015,184.023,205.01,182.774,205.773,180.48z M202.457,200.591c2.11,0.915,5.181,1.713,9.388,1.657c2.419-0.025,6.424-1.276,7.191-3.57c0.21-0.618,0.292-1.323,0.175-2.119c-0.364-2.385-3.998-3.962-6.398-3.806c-3.081,0.189-7.26,0.831-10.648,2.763 C200.054,196.71,200.243,199.636,202.457,200.591z M232.802,291.382c3.563,2.207,6.637,3.104,8.9,3.402c2.392,0.321,4.051-2.087,2.863-4.201c-1.918-3.379-5.155-6.095-7.712-7.836c-2.002-1.367-5.897-1.876-7.456-0.019c-0.509,0.607-0.798,1.265-0.943,1.904 C227.958,287.004,230.747,290.126,232.802,291.382z M256.6,280.564c-1.918-3.397-5.162-6.096-7.729-7.859c-1.984-1.349-5.888-1.872-7.439-0.019c-0.527,0.63-0.796,1.27-0.943,1.923c-0.516,2.356,2.293,5.47,4.34,6.753c3.589,2.207,6.646,3.09,8.904,3.421 C256.138,285.067,257.791,282.664,256.6,280.564z M268.636,268.882c-1.928-3.397-5.157-6.101-7.724-7.817c-1.988-1.368-5.899-1.896-7.449-0.037c-0.518,0.625-0.803,1.265-0.938,1.898c-0.519,2.376,2.272,5.484,4.34,6.772c3.57,2.188,6.613,3.099,8.905,3.402 C268.165,273.405,269.827,271,268.636,268.882z M276.902,249.701c-3.389-1.923-7.565-2.567-10.655-2.766c-2.432-0.156-6.029,1.412-6.398,3.802c-0.14,0.798-0.037,1.507,0.178,2.118c0.779,2.292,4.77,3.538,7.191,3.562c4.21,0.047,7.285-0.742,9.386-1.657 C278.82,253.821,278.993,250.895,276.902,249.701z M208.771,285.585c2.002,1.367,5.972,2.655,7.939,1.223c0.534-0.392,1.006-0.905,1.358-1.624c1.062-2.166-0.978-5.554-3.052-6.8c-2.639-1.624-6.434-3.486-10.314-3.855c-2.398-0.229-3.943,2.245-2.662,4.304 C203.244,280.783,205.302,283.229,208.771,285.585z M225.202,275.164c1.848-1.54,1.339-5.46-0.03-7.448c-1.748-2.558-4.446-5.792-7.845-7.705c-2.112-1.19-4.513,0.467-4.187,2.847c0.289,2.272,1.188,5.339,3.397,8.9c1.279,2.053,4.385,4.844,6.751,4.35 C223.926,275.961,224.577,275.677,225.202,275.164z M233.323,264.08c0.632-0.136,1.295-0.438,1.899-0.934c1.86-1.559,1.344-5.46-0.016-7.448c-1.75-2.567-4.459-5.807-7.848-7.729c-2.103-1.19-4.522,0.471-4.205,2.871c0.31,2.272,1.197,5.306,3.407,8.899 C227.839,261.784,230.957,264.598,233.323,264.08z M234.833,238.798c0.292,2.273,1.197,5.328,3.4,8.905c1.279,2.067,4.396,4.84,6.76,4.341c0.625-0.136,1.298-0.425,1.904-0.943c1.857-1.545,1.33-5.451-0.028-7.448c-1.748-2.555-4.45-5.799-7.829-7.722 C236.912,234.747,234.506,236.413,234.833,238.798z M255.06,244.56c0.635,0.189,1.334,0.301,2.114,0.17c2.39-0.371,3.967-3.986,3.822-6.403c-0.191-3.083-0.845-7.26-2.768-10.65c-1.2-2.084-4.126-1.914-5.083,0.308c-0.924,2.112-1.717,5.185-1.666,9.397 C251.517,239.783,252.778,243.78,255.06,244.56z M155.705,294.948c1.962,1.433,5.951,0.149,7.937-1.209c3.472-2.371,5.521-4.803,6.734-6.748c1.267-2.072-0.273-4.561-2.674-4.327c-3.879,0.354-7.678,2.231-10.312,3.851c-2.058,1.256-4.114,4.625-3.052,6.8 C154.697,294.028,155.18,294.565,155.705,294.948z M149.133,284.242c2.354,0.541,5.472-2.259,6.751-4.341c2.212-3.57,3.092-6.623,3.4-8.9c0.315-2.394-2.075-4.041-4.198-2.855c-3.398,1.927-6.091,5.171-7.848,7.714c-1.368,1.998-1.876,5.913-0.017,7.454 C147.827,283.835,148.489,284.111,149.133,284.242z M145.859,267.888c2.196-3.594,3.092-6.613,3.4-8.9c0.327-2.403-2.093-4.051-4.193-2.865c-3.397,1.918-6.1,5.157-7.838,7.724c-1.379,1.979-1.895,5.908-0.03,7.453c0.609,0.519,1.262,0.794,1.895,0.938 C141.458,272.728,144.574,269.946,145.859,267.888z M133.391,244.081c-3.395,1.918-6.097,5.176-7.845,7.719c-1.358,1.993-1.878,5.886-0.019,7.453c0.607,0.505,1.27,0.789,1.902,0.929c2.364,0.514,5.484-2.272,6.76-4.331c2.201-3.589,3.101-6.632,3.388-8.907 C137.904,244.539,135.503,242.903,133.391,244.081z M111.417,246.471c-0.145,2.413,1.421,6.016,3.822,6.389c0.789,0.145,1.498,0.056,2.114-0.173c2.292-0.779,3.542-4.765,3.568-7.194c0.058-4.205-0.74-7.278-1.657-9.388c-0.952-2.21-3.878-2.401-5.073-0.301 C112.268,239.204,111.617,243.39,111.417,246.471z M152.079,161.793c-1.93,3.391-2.572,7.568-2.772,10.648c-0.164,2.411,1.414,6.04,3.804,6.408c0.798,0.117,1.505,0.026,2.124-0.18c2.292-0.779,3.535-4.776,3.568-7.196c0.065-4.205-0.749-7.288-1.654-9.388 C156.192,159.882,153.275,159.7,152.079,161.793z M186.498,148.779c0.789,0.131,1.494,0.038,2.112-0.17c2.28-0.779,3.531-4.776,3.561-7.187c0.054-4.203-0.756-7.286-1.666-9.388c-0.945-2.219-3.881-2.401-5.078-0.298c-1.911,3.381-2.571,7.558-2.753,10.65 C182.538,144.792,184.106,148.408,186.498,148.779z M200.758,162.295c2.294-0.784,3.535-4.777,3.575-7.197c0.054-4.205-0.756-7.288-1.671-9.388c-0.94-2.224-3.867-2.404-5.073-0.301c-1.923,3.389-2.576,7.565-2.774,10.648c-0.133,2.411,1.435,6.044,3.824,6.408 C199.438,162.591,200.126,162.5,200.758,162.295z M215.921,176.338c2.282-0.779,3.536-4.768,3.554-7.188c0.054-4.202-0.745-7.285-1.671-9.397c-0.94-2.209-3.867-2.392-5.064-0.296c-1.932,3.397-2.583,7.565-2.774,10.648c-0.151,2.411,1.424,6.032,3.827,6.408 C214.596,176.64,215.287,176.548,215.921,176.338z M228.854,190.531c0.789,0.117,1.494,0.035,2.112-0.175c2.285-0.779,3.536-4.772,3.57-7.192c0.054-4.208-0.744-7.288-1.65-9.388c-0.961-2.222-3.888-2.394-5.075-0.301c-1.93,3.397-2.581,7.568-2.782,10.648 C224.894,186.543,226.462,190.16,228.854,190.531z M171.354,185.71c0.053-4.205-0.754-7.288-1.659-9.388c-0.959-2.219-3.885-2.394-5.083-0.301c-1.92,3.389-2.572,7.559-2.763,10.648c-0.154,2.411,1.414,6.028,3.803,6.399c0.798,0.128,1.505,0.035,2.124-0.171 C170.075,192.125,171.309,188.13,171.354,185.71z M181.122,206.56c2.285-0.779,3.544-4.777,3.573-7.194c0.053-4.195-0.754-7.276-1.668-9.39c-0.94-2.219-3.876-2.389-5.064-0.296c-1.941,3.379-2.576,7.565-2.765,10.639c-0.173,2.42,1.412,6.044,3.806,6.408 C179.801,206.861,180.508,206.77,181.122,206.56z M199.827,204.199c-0.968-2.224-3.897-2.395-5.092-0.301c-1.923,3.388-2.576,7.575-2.765,10.648c-0.154,2.411,1.412,6.027,3.817,6.398c0.794,0.136,1.503,0.035,2.11-0.172c2.292-0.772,3.533-4.765,3.561-7.194 C201.514,209.379,200.716,206.308,199.827,204.199z M214.734,222.881c0.054-4.203-0.751-7.273-1.676-9.388c-0.945-2.229-3.871-2.399-5.063-0.296c-1.914,3.379-2.567,7.556-2.756,10.639c-0.156,2.42,1.412,6.044,3.806,6.413c0.787,0.121,1.487,0.021,2.11-0.18 C213.458,229.298,214.699,225.301,214.734,222.881z M227.466,224.123c0.798,0.138,1.505,0.03,2.133-0.18c2.273-0.771,3.514-4.768,3.559-7.178c0.063-4.205-0.749-7.283-1.659-9.388c-0.959-2.229-3.885-2.411-5.073-0.311c-1.92,3.393-2.574,7.57-2.772,10.644 C223.508,220.129,225.083,223.763,227.466,224.123z M242.039,230.257c0.789,0.119,1.477,0.021,2.112-0.18c2.294-0.789,3.533-4.786,3.561-7.197c0.044-4.203-0.742-7.273-1.659-9.388c-0.94-2.229-3.869-2.399-5.075-0.296c-1.918,3.379-2.572,7.556-2.77,10.639 C238.069,226.262,239.637,229.889,242.039,230.257z M244.15,204.395c2.294-0.77,3.533-4.763,3.561-7.185c0.044-4.205-0.742-7.288-1.659-9.39c-0.94-2.209-3.869-2.401-5.075-0.298c-1.918,3.381-2.572,7.567-2.77,10.65c-0.147,2.42,1.421,6.044,3.822,6.408 C242.827,204.705,243.516,204.612,244.15,204.395z M139.136,180.38c-1.92,3.388-2.562,7.565-2.772,10.647c-0.145,2.411,1.433,6.028,3.815,6.408c0.798,0.117,1.498,0.037,2.112-0.17c2.303-0.779,3.535-4.767,3.568-7.197c0.068-4.207-0.74-7.288-1.645-9.397 C143.269,178.459,140.343,178.29,139.136,180.38z M144.55,205.256c-0.166,2.411,1.412,6.037,3.804,6.417c0.789,0.117,1.493,0.028,2.112-0.182c2.294-0.777,3.535-4.765,3.57-7.185c0.054-4.217-0.751-7.295-1.666-9.397c-0.945-2.222-3.872-2.394-5.069-0.301 C145.383,197.996,144.739,202.178,144.55,205.256z M164.938,207.377c-0.952-2.229-3.878-2.411-5.085-0.311c-1.914,3.393-2.555,7.57-2.747,10.644c-0.17,2.419,1.414,6.043,3.809,6.403c0.798,0.138,1.503,0.03,2.119-0.18c2.282-0.77,3.533-4.767,3.563-7.178 C166.642,212.56,165.844,209.482,164.938,207.377z M172.541,233.431c0.789,0.128,1.505,0.025,2.119-0.183c2.294-0.786,3.526-4.783,3.563-7.194c0.063-4.214-0.753-7.292-1.659-9.397c-0.942-2.209-3.869-2.394-5.082-0.301c-1.914,3.4-2.558,7.567-2.756,10.66 C168.588,229.417,170.156,233.043,172.541,233.431z M189.443,237.727c0.063-4.208-0.744-7.278-1.659-9.388c-0.971-2.222-3.888-2.404-5.075-0.301c-1.923,3.379-2.574,7.551-2.775,10.639c-0.151,2.411,1.426,6.046,3.818,6.408c0.789,0.135,1.484,0.047,2.121-0.17 C188.173,244.135,189.406,240.137,189.443,237.727z M194.735,241.288c-1.923,3.382-2.576,7.568-2.765,10.648c-0.154,2.432,1.412,6.025,3.817,6.417c0.794,0.107,1.503,0.023,2.11-0.191c2.292-0.779,3.533-4.774,3.561-7.196c0.044-4.205-0.754-7.278-1.65-9.376 C198.85,239.376,195.93,239.192,194.735,241.288z M214.68,250.037c0.789,0.126,1.493,0.032,2.103-0.187c2.294-0.771,3.545-4.766,3.561-7.186c0.065-4.212-0.742-7.285-1.647-9.397c-0.964-2.212-3.89-2.392-5.078-0.299c-1.93,3.391-2.581,7.577-2.772,10.65 C210.702,246.027,212.279,249.654,214.68,250.037z M98.937,246.527c1.806,1.61,5.601,3.384,7.722,2.188c0.581-0.294,1.116-0.765,1.549-1.43c1.342-2.03-0.287-5.624-2.172-7.138c-2.42-1.923-5.939-4.252-9.743-5.122c-2.356-0.525-4.177,1.769-3.183,3.962 C94.043,241.087,95.782,243.745,98.937,246.527z M291.491,365.99c-0.009,0-0.009,0-0.019,0c-1.54,0-2.991,0.309-4.368,0.794c-1.377-0.485-2.823-0.794-4.368-0.794h-68.217c-4.179-4.363-10.025-8.172-18.071-9.534c-0.535-12.63,0.516-38.182,10.31-48.809c3.029-3.286,6.646-4.9,11.077-4.9 c1.167,0,2.201-0.472,2.989-1.209c1.748,2.067,3.482,3.435,4.921,4.336c2.056,1.278,4.558-0.267,4.322-2.675 c-0.362-3.873-2.229-7.677-3.843-10.305c-1.267-2.054-4.639-4.111-6.812-3.057c-0.716,0.359-1.241,0.826-1.622,1.367c-0.546,0.714-0.7,1.745-0.609,2.856c-6.606,0.173-12.297,2.697-16.855,7.654c-13.693,14.864-13.021,47.576-12.543,56.686h-5.98c0.751-5.302,1.295-16.876-4.333-31.349c0.408-0.761,0.663-1.624,0.546-2.553c-0.147-1.152-3.227-28.203,22.908-36.487c2.303-0.737,3.57-3.201,2.845-5.479c-0.723-2.334-3.199-3.594-5.493-2.856c-18.722,5.913-26.187,20.362-28.416,32.646c-3.573-5.525-8.058-11.233-13.847-17.039c-1.47-1.466-3.662-1.592-5.346-0.546c-2.077-0.122-4.606,1.577-5.647,3.295c-1.622,2.642-3.489,6.431-3.853,10.3c-0.245,2.418,2.25,3.948,4.324,2.68c1.937-1.219,4.378-3.249,6.732-6.735 c0.025-0.042,0.074-0.098,0.098-0.145c22.505,24.059,21.833,45.835,20.874,52.799c-3.281,1.186-8.818,3.813-14.139,9.054H86.242c-3.89,0-7.05-3.173-7.05-7.07V181.143c0-7.512-6.09-13.593-13.595-13.593H54.298L178.497,29.097 c1.11-1.241,2.455-1.895,3.848-1.914c0.009,0,0.019,0,0.04,0c1.376,0,2.709,0.644,3.822,1.851l42.617,46.174 c3.809,4.114,9.764,5.481,14.937,3.433c5.21-2.04,8.643-7.059,8.643-12.659V39.519c0-4.705,3.827-8.536,8.527-8.536 c4.714,0,8.541,3.822,8.541,8.536v74.393c0,3.414,1.283,6.704,3.598,9.222l40.981,44.405h-10.692c-7.5,0-13.59,6.081-13.59,13.595c0,7.512,6.09,13.593,13.59,13.593h21.082c15.732,0,21.3-8.802,22.943-12.59c1.661-3.778,4.358-13.829-6.306-25.407 l-44.431-48.129V39.528c0-19.693-16.021-35.724-35.722-35.724c-17.149,0-31.503,12.134-34.936,28.264l-19.828-21.476C199.853,3.759,191.41,0,182.363,0c-0.072,0-0.151,0-0.214,0c-9.129,0.063-17.6,3.939-23.891,10.935L27.519,156.692 c-10.475,11.67-7.684,21.713-6,25.482c1.685,3.78,7.304,12.559,22.98,12.559h7.479v164.181c0,18.883,15.357,34.257,34.235,34.257h196.502c1.545,0,2.997-0.309,4.369-0.794c1.372,0.477,2.818,0.794,4.34,0.794c1.382,0,138.039,1.241,149.706,78.257c1.027,6.734,6.828,11.556,13.423,11.556c0.686,0,1.362-0.051,2.058-0.153c7.426-1.135,12.536-8.065,11.411-15.477 C452.87,367.315,298.072,366.004,291.491,365.99z M82.751,408.007c-2.493,0.159-4.385,2.319-4.231,4.808c0.161,2.497,2.275,4.48,4.812,4.232c2.03-0.126,202.492-12.545,257.046,38.578c8.756,8.2,13.021,17.329,13.021,27.896c0,2.501,2.025,4.532,4.527,4.532 c2.501,0,4.531-2.031,4.531-4.532c0-13.03-5.349-24.643-15.877-34.509C289.171,395.224,91.152,407.461,82.751,408.007z"]
    }

    const boothCurtain = {
      prefix: "fas",
      iconName: "booth-curtain",
      icon: faBoothCurtain.icon
    };

    library.addIconPacks(fas);
    library.addIconPacks(far);
    library.addIconPacks(fad);

    this.addIcon(faTemperatureHot);
    this.addIcon(faTemperatureSun);
    this.addIcon(faTemperatureSnow);
    this.addIcon(faForkKnife);
    this.addIcon(faAppleCore);
    this.addIcon(faHeat);
    this.addIcon(faToiletPaperBlank);
    this.addIcon(faBedFront);
    this.addIcon(faBedBunk);
    this.addIcon(faDryerHeat);
    this.addIcon(faFireplace);
    this.addIcon(faAirConditioner);
    this.addIcon(faOutlet);


    library.addIcons(<IconDefinition>{
      prefix: "fas",
      iconName: "alarm-clock",
      icon: faClock.icon
    });

    library.addIcons(<IconDefinition>automaticaLogo);
    library.addIcons(<IconDefinition>boothCurtain);

    translate.onError().subscribe({
      next: (error: any) => {
        if (error) {
          console.log(error);
        }
      }
    });

    iconConfig.fallbackIcon = faQuestion;

    document.title = this.title;

    this.dogeLog();
  }

  private addIcon(icon: IconDefinition) {
    const iconDef = <IconDefinition>{
      prefix: "fas",
      iconName: icon.iconName,
      icon: icon.icon
    };
    this.library.addIcons(iconDef);
  }

  private dogeLog() {
    console.log("                   ▄              ▄");
    console.log("                  ▌▒█           ▄▀▒▌");
    console.log("                  ▌▒▒█        ▄▀▒▒▒▐");
    console.log("                 ▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐");
    console.log("               ▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐");
    console.log("             ▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌");
    console.log("            ▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒▌");
    console.log("            ▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐");
    console.log("           ▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄▌");
    console.log("           ▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▌");
    console.log("          ▌▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒▐");
    console.log("          ▐▒▒▐▀▐▀▒░▄▄▒▄▒▒▒▒▒▒░▒░▒░▒▒▒▒▌");
    console.log("          ▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▒▒▒▒░▒░▒░▒▒▐");
    console.log("           ▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒░▒░▒░▒░▒▒▒▌");
    console.log("           ▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▒▄▒▒▐");
    console.log("            ▀▄▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▄▒▒▒▒▌");
    console.log("              ▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀");
    console.log("                ▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄▀");
    console.log("                   ▒▒▒▒▒▒▒▒▒▒▀▀");
    console.log("");
    console.log("");
    console.log("          MUCH WOW, MUCH COOL, MUCH N1");
    console.log("           MUCH LOVE AUTOMATICA.CORE");
    console.log("            DONATE MUCH DOGE TO");
    console.log("              DPVz6RSAJrXZqTF4sGXpS1dqwvU36hSaAQ");
    console.log("");
    console.log("            DONATE MUCH BITCOIN TO");
    console.log("              1Ck4XgAxys3aBjdesKQQ62zx7m4vozUest");
    console.log("");
    console.log("");
    console.log("");

  }

  ngOnInit() {
    this.themeService.applyTheme();
    super.registerEvent(this.appService.isLoadingChanged, (v) => {
      if (v) {
        this.dxLoadPanel.instance.show();
      } else {
        this.dxLoadPanel.instance.hide();
      }
    });
  }

}
