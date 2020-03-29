import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-visualization-control",
  templateUrl: "./base-control.component.html",
  styleUrls: ["./base-control.component.scss"]
})
export class BaseControlComponent implements OnInit {

  @Input()
  icon: string = "question";

  @Input()
  iconColor: string = "white";

  @Input()
  location: string;

  @Input()
  hint: string;

  @Input()
  value: string;

  @Input()
  subValue: string;

  @Input()
  hasPopup: boolean = false;

  popupVisible = false;

  public get valueHidden(): boolean {
    return this.value === void 0 || this.value === null;
  }


  constructor() { }

  ngOnInit() {
  }

  preventDefault($event) {
    $event.stopPropagation()
  }

  onCellClick($event) {
    this.popupVisible = true;
  }

  onPopupHiding($event) {
    this.popupVisible = false;
  }

}
