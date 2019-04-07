import { Model, BaseModel, JsonFieldInfo, JsonProperty } from "../base-model";
import { Guid } from "../../utils/Guid";
import { IPropertyModel } from "../interfaces/ipropertyModel";
import { INameModel } from "../INameModel";
import { IDescriptionModel } from "../IDescriptionModel";
import { PropertyInstance } from "../property-instance";
import { VirtualNamePropertyInstance } from "../virtual-props/virtual-name-property-instance";
import { VirtualDescriptionPropertyInstance } from "../virtual-props/virtual-description-property-instance";
import { VirtualDisplayNamePropertyInstance } from "../virtual-props/virtual-display-name-property-instance";
import { VirtualDisplayDescriptionPropertyInstance } from "../virtual-props";
import { VirtualGenericPropertyInstance } from "../virtual-props/virtual-generic-property-instance";
import { PropertyTemplateType } from "../property-template";

@Model()
export class Slave extends BaseModel implements IPropertyModel, INameModel, IDescriptionModel {

    Properties: PropertyInstance[] = [];

    public get DisplayName(): string {

        return this.Name;
    }
    public set DisplayName(v: string) {
        this.Name = v;
    }

    public get DisplayDescription(): string {
        return this.Description;
    }
    public set DisplayDescription(v: string) {
        this.Description = v;
    }

    @JsonProperty()
    ObjId: string;

    @JsonProperty()
    Name: string;

    @JsonProperty()
    Description: string;

    @JsonProperty()
    ClientId: string;

    @JsonProperty()
    ClientKey: string;

    constructor() {
        super();


        this.Name = "";
        this.Description = "";
        this.ClientId = "";
        this.ClientKey = "";

    }

    addVirtualProperties() {
        this.Properties.push(new VirtualDisplayNamePropertyInstance(this, false));
        this.Properties.push(new VirtualDisplayDescriptionPropertyInstance(this, false));

        this.Properties.push(new VirtualGenericPropertyInstance("COMMON.SLAVE.CLIENTID", 3, this, () => this.ClientId, (v) => this.ClientId = v, false, PropertyTemplateType.Text));
        this.Properties.push(new VirtualGenericPropertyInstance("COMMON.SLAVE.CLIENTKEY", 3, this, () => this.ClientKey, (v) => this.ClientKey = v, false, PropertyTemplateType.Text));

    }

    afterFromJson() {
        this.addVirtualProperties();
    }

    public typeInfo(): string {
        return "Slave";
    }

    protected getJsonProperty(): Map<string, JsonFieldInfo> {
        return void 0;
    }

}
