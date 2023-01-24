import { RuleInstance } from "src/app/base/model/rule-instance";
import { RuleInterfaceInstance } from "src/app/base/model/rule-interface-instance";
import { NodeInstance2RulePage } from "src/app/base/model/node-instance-2-rule-page";
import { LinkService } from "../link.service";
import { RuleEngineService } from "src/app/services/ruleengine.service";

declare var draw2d: any;
declare var $: any;

export class LogicShapes {
    public static addShape(logic, ruleEngineService: RuleEngineService) {

        logic.LogicShape = draw2d.shape.layout.VerticalLayout.extend({
            init: function (attr, element: RuleInstance, linkService: LinkService) {
                if (element.Y < 0) {
                    element.Y *= -1;
                } if (element.X < 0) {
                    element.X *= -1;
                }
                this._super($.extend({ id: element.key, bgColor: "#d7d7d7", alpha: 1, color: "#325862", stroke: 0, radius: 0, x: element.X, y: element.Y, keepAspectRatio: false }, attr));

                this.setUserData(element);

                this.classLabel = new logic.Label({
                    text: element.Name,
                    stroke: 0,
                    fontColor: "#000000",
                    bgColor: "#457987",
                    radius: this.getRadius(),
                    padding: 10,
                    resizeable: true,
                    minWidth: 150
                });

                element.onNameChanged.subscribe((v) => {
                    this.classLabel.setText(v);
                });

                const translatedName = linkService.translate.translate(element.RuleTemplateName);
                this.logicName = new logic.Label({
                    text: translatedName,
                    stroke: 0,
                    fontColor: "#000000",
                    bgColor: "#d7d7d7",
                    radius: this.getRadius(),
                    padding: 10,
                    resizeable: true,
                    minWidth: 150
                });


                this.on("move", (context) => {
                    element.X = context.x;
                    element.Y = context.y;
                });

                this.on("dragEnd", async (context, data) => {
                    await ruleEngineService.updateItem(element);
                });

                this.add(this.classLabel);
                this.add(this.logicName);

                this.add(new logic.PortShape({}, element, this, linkService));
            },
            getMinWidth() {
                if (this.classLabel) {
                    if (this.classLabel.cachedMinWidth > 150) {
                        return this.classLabel.cachedMinWidth;
                    }
                }
                return 150;
            },
            onDragEnd(x, y, shiftKey, ctrlKey) {
                this._super();

                this.fireEvent("dragEnd", { x: x, y: y });

            }
        });

        logic.PortShape = draw2d.shape.layout.TableLayout.extend({

            NAME: "LogicShape",
            realParent: void 0,
            linkService: void 0,

            init: function (attr, element: RuleInstance, realParent, linkService: LinkService) {
                this._super($.extend(
                    {
                        bgColor: "#dbddde",
                        color: "#d7d7d7",
                        stroke: 0,
                        radius: 0,
                        padding: 0,
                        x: element.X,
                        y: element.Y,
                        keepAspectRatio: false,
                        width: realParent.width,
                        id: element.key,
                        minWidth: realParent.minWidth
                    }, attr));
                this.realParent = realParent;
                this.linkService = linkService;

                const totalRows = Math.max(element.Inputs.length, element.Outputs.length);
                const list = [];

                for (let i = 0; i < totalRows; i++) {
                    list.push({ items: [] });
                }

                for (let i = 0; i < element.Inputs.length; i++) {
                    list[i].items.push(element.Inputs[i]);
                }
                for (let i = 0; i < element.Outputs.length; i++) {
                    list[i].items.push(element.Outputs[i]);
                }

                for (const x of list) {
                    this.createPortInstances(x.items, linkService);
                }
            },


            createPortInstances: function (portInstances: RuleInterfaceInstance[], linkService: LinkService) {
                const data = [];
                for (const portInstance of portInstances) {
                    const isInput = portInstance.Template.InterfaceDirection.Key === "I" || portInstance.Template.InterfaceDirection.Key === "P";
                    const label = new logic.LogicText({
                        text: portInstance.Name,
                        stroke: 0,
                        radius: 0,
                        bgColor: null,
                        fontColor: "#4a4a4a",
                        resizeable: true,
                        padding: 5
                    }, isInput ? 0 : 1, this.realParent);

                    let port = void 0;

                    if (isInput) {
                        port = this.createPort("input", new logic.LogicInputPortLocator(this.realParent, label));
                        port.setName(portInstance.PortId);
                        port.setConnectionDirection(3);
                    } else {
                        port = this.createPort("output", new logic.LogicOutputPortLocator(this.realParent, label));
                        port.setName(portInstance.PortId);
                        port.setConnectionDirection(1);
                    }

                    port.setMaxFanOut(portInstance.FromMaxLinks);
                    port.setUserData(portInstance);

                    port.on("connect", async function (emitterPort, connection) {
                        await LinkService.handleOnConnection(linkService, port, connection, isInput, portInstance, ruleEngineService);

                    });

                    port.on("disconnect", async function (emitterPort, connection) {
                        await LinkService.handleOnDisconnection(linkService, connection, isInput);
                    });

                    data.push(label);
                }

                this.addRow(...data);
            }
        });



        logic.ItemShape = draw2d.shape.layout.VerticalLayout.extend({


            init: function (attr, element: NodeInstance2RulePage, linkService: LinkService) {
                if (element.Y < 0) {
                    element.Y *= -1;
                } if (element.X < 0) {
                    element.X *= -1;
                }
                this._super($.extend({ id: element.key, bgColor: "#EEEEEE", alpha: 1, color: "#000000", stroke: 1, radius: 0, x: element.X, y: element.Y, keepAspectRatio: false, minWidth: 150 }, attr));

                this.setMinWidth(100);

                this.setUserData(element);
                this.label = new draw2d.shape.basic.Label({
                    text: element.Name,
                    textLength: "100%",
                    stroke: 0,
                    radius: 0,
                    bgColor: null,
                    padding: 5,
                    paddingLeft: 10,
                    paddingRight: 10,
                    fontColor: "#4a4a4a",
                    resizeable: true
                });

                element.NodeInstance.notifyChangeEvent.subscribe((v) =>{
                    if(v.propertyName === "Name") {
                        this.label.setText((<any>v.object).Name);
                    }
                });

                this.label.setMinWidth(100);

                if (element.Inputs.length > 0) {
                    const input = this.createPort("input");
                    input.setName(element.Inputs[0].PortId);
                    input.setId(element.Inputs[0].PortId);

                    input.on("connect", async function (emitterPort, connection) {
                        await LinkService.handleOnConnection(linkService, input, connection, true, element, ruleEngineService);

                    });

                    input.on("disconnect", async function (emitterPort, connection) {
                        await LinkService.handleOnDisconnection(linkService, connection, true);
                    });
                }
                if (element.Outputs.length > 0) {

                    const output = this.createPort("output");
                    output.setName(element.Outputs[0].PortId);
                    output.setId(element.Outputs[0].PortId);

                    output.on("connect", async function (emitterPort, connection) {
                        await LinkService.handleOnConnection(linkService, output, connection, false, element, ruleEngineService);
                    });

                    output.on("disconnect", async function (emitterPort, connection) {
                        await LinkService.handleOnDisconnection(linkService, connection, false);
                    });
                }

                this.on("move", (context) => {
                    element.X = context.x;
                    element.Y = context.y;
                });


                this.on("dragEnd", async (context, data) => {
                    try {
                        await ruleEngineService.updateItem(element);
                    } catch (error) {

                    }
                });



                this.add(this.label);
            },
            getMinWidth() {
                if (this.label) {
                    return Math.max(this.label.cachedMinWidth, 100);;
                }
                return 100;
            },
            onDragEnd(x, y, shiftKey, ctrlKey) {
                this._super();

                this.fireEvent("dragEnd", { x: x, y: y });

            }
        });

    }
}
