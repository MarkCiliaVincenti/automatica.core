import { EventEmitter } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { TranslationService } from "angular-l10n";
import { WebApiException, ExceptionSeverity } from "./model/web-api-exception";
import { NotifyService } from "../services/notify.service";
import { AppService } from "../services/app.service";

export class BaseComponent {

    private subscriptions: Subscription[] = [];
    private intervals: NodeJS.Timeout[] = [];
    private lastState: boolean = false;
    // gutterH = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");`;

    constructor(protected notifyService: NotifyService, protected translate: TranslationService, protected appService: AppService) {


    }

    protected baseOnInit() {
        this.registerEvent(this.appService.isStartingChanged, async (v) => {

            if (!v && this.lastState !== v) {
                await this.load();
            }
            this.lastState = v;
        });
    }

    protected load(): Promise<any> {
        return Promise.resolve();
    }

    protected handleError(error) {
        if (error instanceof WebApiException) {
            const errorText = this.translate.translate("ERROR." + error.ErrorText);
            switch (error.Severity) {
                case ExceptionSeverity.Warning:
                    this.notifyService.notifyWarning(errorText, 5000);
                    break;
                case ExceptionSeverity.Error:
                case ExceptionSeverity.Dead:
                    this.notifyService.notifyError(errorText);
                    break;
                case ExceptionSeverity.Info:
                    this.notifyService.notifyInfo(errorText);
                    break;
            }

        } else {
            this.notifyService.notifyError(error);
        }

        console.log(error);
    }

    protected baseOnDestroy() {
        this.unregisterAll();
    }
    protected registerEvent(event: EventEmitter<any>, callback: (any)) {
        const subscriber = event.subscribe((data) => callback(data), (error) => console.error(error));
        this.subscriptions.push(subscriber);
        return subscriber;
    }

    protected unregisterEvent(subscriber: any) {
        subscriber.unsubscribe();

        this.subscriptions = this.subscriptions.filter(a => a !== subscriber);
    }

    protected registerObservable(event: Observable<any>, callback: (any)) {
        const subscriber = event.subscribe((data) => callback(data));
        this.subscriptions.push(subscriber);
    }

    protected unregisterAll() {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
        this.subscriptions = [];

        this.intervals.forEach(sub => {
            clearInterval(sub);
        });
        this.intervals = [];
    }

    protected registerInterval(callback: (any), intervalInMs) {
        const interval = setInterval(callback, intervalInMs);
        this.intervals.push(interval);
    }
}
