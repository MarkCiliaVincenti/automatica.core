import { Component, OnInit } from "@angular/core";
import { CategoryService } from "src/app/services/categories.service";
import { TranslationService } from "angular-l10n";
import { Guid } from "src/app/base/utils/Guid";
import { NotifyService } from "src/app/services/notify.service";
import { AppService } from "src/app/services/app.service";
import { BaseComponent } from "src/app/base/base-component";
import { CategoryGroup, CategoryInstance } from "src/app/base/model/categories";
import { CustomMenuItem } from "src/app/base/model/custom-menu-item";

@Component({
  selector: "app-category-config",
  templateUrl: "./category-config.component.html",
  styleUrls: ["./category-config.component.scss"]
})
export class CategoryConfigComponent  extends BaseComponent implements OnInit {
  groups: CategoryGroup[] = [];
  categories: CategoryInstance[] = [];
  selectedNode: CategoryInstance = void 0;


  menuItems: CustomMenuItem[] = [];

  menuSave: CustomMenuItem = {
    id: "save",
    label: "Save",
    icon: "fa-save",
    items: undefined,
    command: (event) => { this.save(); }
  }

  constructor(private catService: CategoryService, translate: TranslationService, private notify: NotifyService, private appService: AppService) {
    super(notify, translate);
    appService.setAppTitle("CATEGORIES.NAME");


    this.menuItems.push(this.menuSave);
    this.menuSave.label = translate.translate("COMMON.SAVE");
  }

  async ngOnInit() {
    this.appService.isLoading = true;

    try {
      this.groups = await this.catService.getCategoryGroups();
      this.categories = await this.catService.getCategoryInstances();

    } catch (error) {
      this.handleError(error);
    }

    this.appService.isLoading = false;
  }
  save(): any {
    this.appService.isLoading = true;

    try {
      this.catService.saveAreaInstance(this.categories);
      this.notify.notifySuccess("COMMON.SAVED");
    } catch (error) {
      super.handleError(error);
    }

    this.appService.isLoading = false;
  }

  colorBoxOnValueChanged($event, cell) {
    cell.setValue($event.value);
  }
  onRowRemoving($event) {
    const data: CategoryInstance = $event.data;

    if (!data.IsDeleteable) {
      $event.cancel = true;
    }
  }

  itemClick($event) {
    const item: CustomMenuItem = $event.itemData;

    if (item && item.command) {
      item.command($event);
    }
  }

  onRowUpdating($event) {
    const oldData: CategoryInstance = $event.oldData;

    if ($event.newData.DisplayName || $event.newData.DisplayDescription) {
      $event.newData.DisplayName = this.translate.translate(oldData.Name);
      $event.newData.DisplayDescription = ""; // oldData.Description;
    }
  }

  onInitNewRow($event) {
    const newObject = new CategoryInstance();
    newObject.ObjId = Guid.MakeNew().ToString();
    newObject.addVirtualProperties();

    $event.data = newObject;

  }

  onRowInserting($event) {
    const newObject = new CategoryInstance();
    newObject.addVirtualProperties();

    Object.assign(newObject, $event.data);
    $event.data = newObject;
  }

  onRowClicked($event) {
    this.selectedNode = $event.data;
  }

  onInitialized($event) {
    $event.component.columnOption("command:edit", "width", 150);
  }
}
