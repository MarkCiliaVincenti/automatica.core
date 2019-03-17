import { BaseModel, JsonFieldInfo, JsonProperty, Model, JsonPropertyName } from "./base-model"
import { NodeTemplate } from "./node-template";
import { PropertyInstance } from "./property-instance"
import { BoardInterface } from "./board-interface"
import { VirtualNamePropertyInstance } from "./virtual-props/virtual-name-property-instance"
import { VirtualDescriptionPropertyInstance } from "./virtual-props/virtual-description-property-instance"
import { VirtualReadablePropertyInstance } from "./virtual-props/virtual-readable-property-instance"
import { VirtualWriteablePropertyInstance } from "./virtual-props/virtual-writeable-property-instance"
import { ITreeNode } from "./ITreeNode";
import { INameModel } from "./INameModel";
import { IDescriptionModel } from "./IDescriptionModel";
import { VirtualPropertyInstance } from "./virtual-props/virtual-property-instance";
import { MetaHelper } from "../base/meta-helper";
import { IPropertyModel } from "./interfaces/ipropertyModel";
import { Guid } from "../utils/Guid";
import { CategoryInstance } from "./categories/category-instance";
import { AreaInstance } from "./areas/area-instance";
import { VirtualUseInVisuPropertyInstance } from "./virtual-props/virtual-use-in-visu-property-instance";
import { VirtualAreaPropertyInstance } from "./virtual-props/virtual-area-property-instance";
import { VirtualCategoryPropertyInstance } from "./virtual-props/virtual-category-property-instance";
import { IAreaInstanceModel } from "./IAreaInstanceModel";
import { ICategoryInstanceModel } from "./ICategoryInstanceModel";
import { VirtualUserGroupPropertyInstance } from "./virtual-props/virtual-usergroup-property-instance";
import { VirtualGenericPropertyInstance } from "./virtual-props/virtual-generic-property-instance";
import { NodeDataTypeEnum } from "./node-data-type";
import { PropertyTemplateType, EnumExtendedPropertyTemplate } from "./property-template";
import { VirtualGenericTrendingPropertyInstance } from "./virtual-props/node-instance/virtual-generic-trending-property";

class NodeInstanceMetaHelper {
    private static pad(num, size) {
        const s = "000000000" + num;
        return s.substr(s.length - size);
    }

    public static getName(nodeInstance: NodeInstance): string {

        const meta = nodeInstance.NodeTemplate.NameMeta;
        let addName = "";
        const matches = MetaHelper.checkMatches(meta);

        for (const ma of matches) {
            const wBraces = ma.substr(1, ma.length - 2);
            const split = wBraces.split(":");

            if (split && split.length >= 2) {
                const key = split[0];
                const value = split[1];
                let propValue = this.getValueForKey(key, value, nodeInstance);
                if (typeof propValue === "number") {
                    propValue = propValue.toString();
                    propValue = this.pad(propValue, 2);

                    addName += propValue;
                } else {
                    addName += propValue;
                }
            }
        }

        if (addName !== "") {
            return addName;
        }

        return nodeInstance.Name;
    }

    private static getValueForKey(key: string, value: string, nodeInstance: NodeInstance) {
        if (key === "PROPERTY") {
            return nodeInstance.getPropertyValue(value);
        } else if (key === "NODE") {
            return nodeInstance[value];
        } else if (key === "CONST") {
            return value;
        }
        return "";
    }

}

export enum NodeInstanceState {
    New,
    Saved,
    Loaded,
    Initialized,
    InUse,
    OutOfDatapoits,
    UnknownError,
    Unloaded,
    Unknown
}

export enum TrendingTypes {
    Average = 0,
    Raw = 1,
    Max = 2,
    Min = 3
}

@Model()
export class NodeInstance extends BaseModel implements ITreeNode, INameModel, IDescriptionModel, IPropertyModel, IAreaInstanceModel, ICategoryInstanceModel {

    @JsonProperty()
    ObjId: string;

    @JsonProperty()
    This2NodeTemplate?: string;

    @JsonProperty()
    This2ParentNodeInstance?: string;

    @JsonProperty()
    This2BoardInterface?: string;

    @JsonProperty()
    State: NodeInstanceState;

    public get ParentId() {
        if (this.This2BoardInterface) {
            return this.This2BoardInterface;
        }
        return this.This2ParentNodeInstance;
    }

    public get Id() {
        return this.ObjId;
    }


    private _name: string;
    private _displayName: string;

    public set DisplayName(value: string) {
        this._displayName = value;
        this._name = value;
    }

    public get DisplayName() {
        if (this._displayName) {
            return `${this._displayName}`;
        }
        return this._name;
    }

    @JsonProperty()
    public get Name(): string {
        return this._name;
    }
    public set Name(v: string) {
        this._name = v;
        this.notifyChange("Name");
        this.updateDisplayName();
    }

    private _Description: string;
    @JsonProperty()

    public get Description(): string {
        return this._Description;
    }
    public set Description(v: string) {
        this._Description = v;
        this.notifyChange("Description");
    }

    private _DisplayDescription: string;
    public get DisplayDescription(): string {
        if (!this._DisplayDescription) {
            return this.Description;
        }
        return this._DisplayDescription;
    }
    public set DisplayDescription(v: string) {
        this._DisplayDescription = v;
    }



    private _Value: any;
    public get Value(): any {
        return this._Value;
    }
    public set Value(v: any) {
        this._Value = v;
    }


    @JsonPropertyName("This2NodeTemplateNavigation")
    NodeTemplate: NodeTemplate;

    @JsonPropertyName("PropertyInstance")
    Properties: PropertyInstance[] = [];

    @JsonPropertyName("InverseThis2ParentNodeInstanceNavigation")
    Children: NodeInstance[] = [];

    @JsonProperty()
    IsReadable: boolean;
    @JsonProperty()
    IsWriteable: boolean;

    @JsonProperty()
    UseInVisu: boolean;

    @JsonProperty()
    This2AreaInstance: string;

    @JsonProperty()
    This2CategoryInstance: string;


    @JsonProperty()
    IsFavorite: boolean;

    @JsonProperty()
    Rating: number;

    @JsonProperty()
    This2UserGroup: string;


    @JsonProperty()
    StateTextValueTrue: string;
    @JsonProperty()
    StateTextValueFalse: string;
    @JsonProperty()
    StateColorValueTrue: string;
    @JsonProperty()
    StateColorValueFalse: string;

    @JsonProperty()
    VisuName: string;

    @JsonProperty()
    Trending: boolean;

    @JsonProperty()
    TrendingInterval: number;

    @JsonProperty()
    TrendingType: TrendingTypes;

    @JsonProperty()
    TrendingToCloud: boolean;

    private _ValidationOk: boolean = true;
    public get ValidationOk(): boolean {
        return this._ValidationOk;
    }
    public set ValidationOk(v: boolean) {
        this._ValidationOk = v;
        if (this.Parent) {
            this.Parent.ValidationOk = v;
        }
    }


    private static createFromTemplate(template: NodeTemplate, parent: any): NodeInstance {
        const instance = new NodeInstance(parent);
        instance.Name = template.Name;
        instance.Description = template.Description;
        instance.NodeTemplate = template;
        instance.Properties = [];
        instance.This2BoardInterface = void 0;
        instance.This2ParentNodeInstance = void 0;
        instance.This2NodeTemplate = template.ObjId;

        instance.IsReadable = template.IsReadable;
        instance.IsWriteable = template.IsWriteable;
        instance.IsFavorite = false;

        for (const p of template.Properties) {
            const prop: PropertyInstance = PropertyInstance.createFromTemplate(instance, p);
            instance.Properties.push(prop);
        }
        instance.addVirtualProperties();
        return instance;
    }
    public static createForNodeInstanceFromTemplate(template: NodeTemplate, parent: NodeInstance): NodeInstance {
        const instance: NodeInstance = this.createFromTemplate(template, parent);

        instance.ObjId = Guid.MakeNew().ToString();

        if (parent) {
            instance.This2ParentNodeInstance = parent.ObjId;
        }
        return instance;
    }

    public static createForBoardInterfaceFromTemplate(template: NodeTemplate, parent: BoardInterface): NodeInstance {
        const instance: NodeInstance = this.createFromTemplate(template, parent);

        instance.ObjId = Guid.MakeNew().ToString();
        instance.This2BoardInterface = parent.ObjId;
        return instance;
    }

    public static getSupportedTemplates(treeNode: BoardInterface | NodeInstance, neededInterfaceKey: string, templates: NodeTemplate[]): NodeTemplate[] {
        const nodeTemplates: NodeTemplate[] = [];

        if (!templates) {
            return nodeTemplates;
        }

        for (const e of templates) {
            if (e.ProvidesInterface.Type === neededInterfaceKey) {
                continue;
            }
            if (e.NeedsInterface.Type === neededInterfaceKey) {
                if (treeNode instanceof NodeInstance) {
                    let instancesExist: number = 0;

                    for (const ch of treeNode.Children) {
                        if (ch instanceof NodeInstance) {
                            if (ch.NodeTemplate.ObjId === e.ObjId) {
                                instancesExist++;
                            }
                        }

                    }

                    if (e.MaxInstances > 0 && instancesExist >= e.MaxInstances) {
                        continue;
                    }
                }
                let addItem: boolean = true;
                let instances = 0;
                if (e.ProvidesInterface.MaxInstances > 0) {
                    for (const element of treeNode.Children) {
                        if (element instanceof NodeInstance) {
                            if (element.NodeTemplate.ObjId === e.ObjId) {
                                instances++;
                            }

                        }
                    }
                    if (instances >= e.MaxInstances) {
                        addItem = false;
                    }
                }
                if (addItem) {
                    nodeTemplates.push(e);
                }
            }
        }

        return nodeTemplates;
    }

    public static getSupportedTypes(node: ITreeNode, nodeTemplates: NodeTemplate[]) {
        if (node instanceof NodeInstance) {
            const ni: NodeInstance = node as NodeInstance;

            if (node.Children.length >= ni.NodeTemplate.ProvidesInterface.MaxChilds) {
                return void 0;
            }

            return NodeInstance.getSupportedTemplates(node, ni.NodeTemplate.ProvidesInterface2InterfaceType, nodeTemplates);

        } else if (node instanceof BoardInterface) {
            const bi: BoardInterface = node as BoardInterface;

            if (node.Children.length >= bi.InterfaceType.MaxChilds) {
                return void 0;
            }

            return NodeInstance.getSupportedTemplates(node, bi.InterfaceType.Type, nodeTemplates);
        }
        return void 0;
    }



    constructor(public Parent: ITreeNode) {
        super();
        this.This2ParentNodeInstance = null;
        this.This2BoardInterface = null;

        this.StateColorValueFalse = "rgba(255, 255, 255, 1)";
        this.StateColorValueTrue = "rgba(255, 255, 255, 1)";
        this.StateTextValueTrue = "1";
        this.StateTextValueFalse = "0";
        this.State = NodeInstanceState.New;
    }

    private addVirtualProperties() {
        this.Properties.push(new VirtualNamePropertyInstance(this));
        this.Properties.push(new VirtualDescriptionPropertyInstance(this));

        if (this.NodeTemplate && this.NodeTemplate.This2NodeDataType > 0) {
            this.Properties.push(new VirtualReadablePropertyInstance(this));
            this.Properties.push(new VirtualWriteablePropertyInstance(this));

            this.Properties.push(new VirtualUseInVisuPropertyInstance(this));
            this.Properties.push(new VirtualAreaPropertyInstance(this));
            this.Properties.push(new VirtualCategoryPropertyInstance(this));

            this.Properties.push(new VirtualUserGroupPropertyInstance(this));
            this.Properties.push(new VirtualGenericPropertyInstance("VISU_NAME", 5, this, () => this.VisuName, (value) => this.VisuName = value, false, PropertyTemplateType.Text, "COMMON.CATEGORY.VISU"));

            if (this.NodeTemplate.This2NodeDataType === NodeDataTypeEnum.Boolean) {

                this.Properties.push(new VirtualGenericPropertyInstance("STATUS_TEXT_TRUE", 6, this, () => this.StateTextValueTrue, (value) => this.StateTextValueTrue = value, false, PropertyTemplateType.Text, "COMMON.CATEGORY.VISU"));
                this.Properties.push(new VirtualGenericPropertyInstance("STATUS_TEXT_FALSE", 7, this, () => this.StateTextValueFalse, (value) => this.StateTextValueFalse = value, false, PropertyTemplateType.Text, "COMMON.CATEGORY.VISU"));

                this.Properties.push(new VirtualGenericPropertyInstance("STATUS_COLOR_TRUE", 8, this, () => this.StateColorValueTrue, (value) => this.StateColorValueTrue = value, false, PropertyTemplateType.Color, "COMMON.CATEGORY.VISU"));
                this.Properties.push(new VirtualGenericPropertyInstance("STATUS_COLOR_FALSE", 9, this, () => this.StateColorValueFalse, (value) => this.StateColorValueFalse = value, false, PropertyTemplateType.Color, "COMMON.CATEGORY.VISU"));
            }
            this.Properties.push(new VirtualGenericPropertyInstance("TRENDING", 10, this, () => this.Trending, (value) => this.Trending = value, false, PropertyTemplateType.Bool, "COMMON.CATEGORY.TRENDING"));
            this.Properties.push(new VirtualGenericTrendingPropertyInstance(this, "TRENDING_TYPE", 11, this, () => this.TrendingType, (value) => this.TrendingType = value, false, PropertyTemplateType.Enum, EnumExtendedPropertyTemplate.createFromEnum(TrendingTypes)));
            this.Properties.push(new VirtualGenericTrendingPropertyInstance(this, "TRENDING_INTERVAL", 12, this, () => this.TrendingInterval, (value) => this.TrendingInterval = value, false, PropertyTemplateType.Numeric));

        }


        this.updateDisplayName();

        for (const x of this.Properties) {
            x.propertyChanged.subscribe((property) => {
                this.updateDisplayName();
                this.notifyChange("Properties");
            });
        }
    }

    public setParent(parent: ITreeNode) {
        if (parent instanceof NodeInstance) {
            this.This2BoardInterface = void 0;
            this.This2ParentNodeInstance = parent.Id;
        } else if (parent instanceof BoardInterface) {
            this.This2BoardInterface = parent.ObjId;
            this.This2ParentNodeInstance = void 0;
        }
        this.Parent = parent;
    }


    useBaseModelInstanceForJson(baseModel: BaseModel) {
        if (baseModel instanceof VirtualPropertyInstance) {
            return false;
        }
        if (baseModel instanceof NodeTemplate) {
            return false;
        }
        return true;
    }

    protected afterFromJson() {
        super.afterFromJson();

        this.addVirtualProperties();

        for (const x of this.Properties) {
            x.notifyChangeEvent.subscribe((n) => {
                this.notifyChange("Property" + n);
            });
        }

    }
    public updateDisplayName() {
        if (this.NodeTemplate && this.NodeTemplate.NameMeta) {
            this._displayName = NodeInstanceMetaHelper.getName(this);
        }
    }

    protected getJsonProperty(): Map<string, JsonFieldInfo> {
        return void 0;
    }



    public setPropertyValueIfPresent(property: string, value: any) {
        for (const e of this.Properties) {
            if (e.PropertyTemplate.Key === property) {
                e.Value = value;
            }
        }
    }
    public getPropertyValue(property: string): any {
        for (const e of this.Properties) {
            if (e.PropertyTemplate && e.PropertyTemplate.Key === property) {
                return e.Value;
            }
        }
        return void 0;
    }
    getPropertyValueById(id: string) {
        for (const e of this.Properties) {
            if (e.PropertyTemplate.ObjId === id) {
                return e.Value;
            }
        }
        return void 0;
    }

    validate(): boolean {
        let result = false;

        for (const x of this.Properties) {
            result = result || x.validate();
        }
        return result;
    }


    public hasPropertyValue(property: string): boolean {
        for (const e of this.Properties) {
            if (e.PropertyTemplate.Key === property) {
                return true;
            }
        }
        return false;
    }

    public typeInfo(): string {
        return "NodeInstance";
    }
}
