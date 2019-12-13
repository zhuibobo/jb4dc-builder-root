import BpmnModeler from 'bpmn-js/lib/Modeler';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import jb4dcModdleDescriptor from './JB4DCModdle.json';
import diagramXML from '../../Resources/newDiagram2.bpmn';
import CustomTranslate from './CustomTranslate';
import propertiesPadEntity from './AdditionalModules/PropertiesPadEntity';
import {BpmnJsUtility} from './BpmnJsUtility';

let modeler = null;
let eventBus = null;
var events = [
    //'element.hover',
    //'element.out',
    'element.click',
    //'element.dblclick',
    //'element.mousedown',
    //'element.mouseup'
];

// Our custom translation module
// We need to use the array syntax that is used by bpmn-js internally
// 'value' tells bmpn-js to use the function instead of trying to instanciate it
var customTranslateModule = {
    translate: [ 'value', CustomTranslate ]
};


class FlowBpmnJsExtendContainer {
    defaultSetting = {
        RendererToElemId:"",
        FlowBpmnJsContainer:""
    };
    setting={};
    modeler=null;
    constructor() {

    }

    Initialize (exConfig) {
        //debugger;
        exConfig = $.extend(true, {}, this.defaultSetting, exConfig);
        this.setting = exConfig;
        this.modeler = new BpmnModeler({
            "container": $("#" + exConfig.RendererToElemId)[0],
            "additionalModules": [
                customTranslateModule,
                propertiesPadEntity
            ],
            keyboard: {
                bindTo: document
            },
            // needed if you'd like to maintain camunda:XXX properties in the properties panel
            moddleExtensions: {
                camunda: camundaModdleDescriptor,
                jb4dc: jb4dcModdleDescriptor
            },
            va: "1"
        });
        //propertiesPadEntity.propertiesPadEntity.f1();
        //console.log(propertiesPadEntity.propertiesPadEntity);

        this.modeler.importXML(diagramXML, function (err) {
            if (err) {
                console.log(err);
            }
        });
        eventBus = this.modeler.get('eventBus');
        //eventBus.aaa="11111";
        console.log(eventBus);
        /*var _self=this;
        eventBus.on("ax",function (e) {
            //DialogUtility.AlertText("hello alex");
            console.log(e);
            console.log(_self.setting);
            _self.setting.FlowBpmnJsContainer.showProperties();
        });*/

        eventBus.on("propertiesPadEntity.click", (e) => {
            //console.log(e);
            //console.log(this);
            this.setting.FlowBpmnJsContainer.showProperties();
            this.ShowPropertiesWindow(e, e.element);
            //_self.setting.FlowBpmnJsContainer.showProperties();
        });

        eventBus.on("element.contextmenu", event => {
            event.preventDefault();
            event.stopPropagation();

            /*const { element } = event;

            if (!contextPad._overlayId) {
                contextPad.open(element);
            } else {
                contextPad.close();
            }*/
        });

        eventBus.on("element.click", event => {
            var clickEventName = event.element.type.replace("bpmn:", "BPMN_") + "ClickEvent";
            if (this[clickEventName] && typeof (this[clickEventName]) == "function") {
                this[clickEventName](event, event.element);
            } else {
                console.log("未定义:"+clickEventName)
            }
        });
        eventBus.on("element.dblclick", event => {
            var clickEventName = event.element.type.replace("bpmn:", "BPMN_") + "DBClickEvent";
            if (this[clickEventName] && typeof (this[clickEventName]) == "function") {
                this[clickEventName](event, event.element);
            } else {
                console.log("未定义:"+clickEventName)
            }
        });

        events.forEach(function (event) {
            eventBus.on(event, function (e) {
                /*console.log(event, 'on', e.element.id);

                var commentsElement=BpmnJsUtility.GetCommentsElement(e.element,true);
                var str = "hello";
                commentsElement.text = str;
                console.log(commentsElement);*/

                //var extensionElements=BpmnJsUtility.GetExtensionElements(e.element,true);
                //console.log(extensionElements);

                //console.log(event, 'on', e.element);
                //console.log(e.element.businessObject.get("camunda:versionTag"));
                //var bo = e.element.businessObject;
                //var e = bo.$model.create('camunda:ExecutionListener', {"class":"wwwwwwwwwwwwwwwwww"});
                //bo.get("extensionElements").values.push(e);
            });
        });

        console.log(modeler);
    }
    BPMN_ProcessClickEvent (event,element){
        return;
        console.log(element);
        console.log(element.businessObject);
        //let element=event.element;
        var value = BpmnJsUtility.BPMN_GetElementDocumentationText(element);
        console.log(value);
        BpmnJsUtility.BPMN_SetElementDocumentationText(element, "SetElementDocumentationText-" + value);
        value = BpmnJsUtility.BPMN_GetElementDocumentationText(element);
        console.log(value);

        var id = BpmnJsUtility.BPMN_Attr_GetName(element);
        console.log(id);
        BpmnJsUtility.BPMN_Attr_SetName(element, "SetElementName-" + id);
        id = BpmnJsUtility.BPMN_Attr_GetName(element);
        console.log(id);

        var code = BpmnJsUtility.JB4DC_Attr_GetCode(element);
        console.log(code);
        BpmnJsUtility.JB4DC_Attr_SetCode(element, "SetElementCode-" + code);
        code = BpmnJsUtility.JB4DC_Attr_GetCode(element);
        console.log(code);

        var versionTag=BpmnJsUtility.CAMUNDA_Attr_GetVersionTag(element);
        BpmnJsUtility.CAMUNDA_Attr_SetVersionTag(element, "SetElementCode-" + versionTag);
        versionTag=BpmnJsUtility.CAMUNDA_Attr_GetVersionTag(element);
        console.log(versionTag);

        var extensionElements=BpmnJsUtility.BPMN_Attr_GetExtensionElements(element);
        console.log(extensionElements);
        BpmnJsUtility.BPMN_Attr_CreateExtensionElements(element);

        BpmnJsUtility.CAMUNDA_SetExecutionListenerArray(element,[{className:"a",eventName:"start"},{className:"b",eventName:"start"}])
        var executionListener=BpmnJsUtility.CAMUNDA_GetExecutionListenerArray(element);
        console.log(executionListener);

        BpmnJsUtility.CAMUNDA_SetPropertiesArray(element,[{name:"a",value:"11111"},{name:"b",value:"22222"}])
        var propertyList=BpmnJsUtility.CAMUNDA_GetPropertiesArray(element);
        console.log(propertyList);
    }
    BPMN_ProcessDBClickEvent (event,element){
        this.ShowPropertiesWindow(event,element);
    }
    BPMN_UserTaskClickEvent (event,element){
        BpmnJsUtility.BPMN_GetIncomingSequenceFlowArray(element);
        BpmnJsUtility.BPMN_GetOutgoingSequenceFlowArray(element);
    }
    ShowPropertiesWindow (event,element) {
        var elementType = element.type;
        var componentName = "";
        var title = "";
        if (elementType == "bpmn:SequenceFlow") {
            componentName = "sequenceFlowProperties";
            title = "连线设置";
        } else if (elementType == "bpmn:UserTask") {
            componentName = "userTaskProperties";
            title = "用户环节设置";
        } else if (elementType == "bpmn:Process") {
            componentName = "processProperties";
            title = "流程设置";
        }
        console.log(event);
        console.log(element);
        this.setting.FlowBpmnJsContainer.showProperties(componentName, title, element);
        //alert("1");
    }
    ZoomAuto(){
        this.modeler.get('canvas').zoom('fit-viewport', 'auto');
    }
    LogXML(){
        console.log(this.GetXML());
    }
    GetXML(){
        var xml;
        this.modeler.saveXML(null,function (error,_xml) {
            xml=_xml;
        })
        return xml;
    }
    SetXML(xml){
        this.modeler.importXML(xml, function (err) {
            console.log(err);
        });
    }
}

//console.log(diagramXML);

export { FlowBpmnJsExtendContainer };