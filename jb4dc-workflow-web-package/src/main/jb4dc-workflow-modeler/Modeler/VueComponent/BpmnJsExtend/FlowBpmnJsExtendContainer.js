import BpmnModeler from 'bpmn-js/lib/Modeler';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import jb4dcModdleDescriptor from './JB4DCModdle.json';
import diagramXML from '../../Resources/newDiagram.bpmn';
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
    constructor() {

    }

    Initialize (exConfig) {
        //debugger;
        exConfig = $.extend(true, {}, this.defaultSetting, exConfig);
        this.setting=exConfig;
        modeler = new BpmnModeler({
            "container": $("#"+exConfig.RendererToElemId)[0],
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
                jb4dc:jb4dcModdleDescriptor
            },
            va:"1"
        });
        //propertiesPadEntity.propertiesPadEntity.f1();
        //console.log(propertiesPadEntity.propertiesPadEntity);

        modeler.importXML(diagramXML, function (err) {
            if(err) {
                console.log(err);
            }
        });
        eventBus = modeler.get('eventBus');
        //eventBus.aaa="11111";
        console.log(eventBus);
        /*var _self=this;
        eventBus.on("ax",function (e) {
            //DialogUtility.AlertText("hello alex");
            console.log(e);
            console.log(_self.setting);
            _self.setting.FlowBpmnJsContainer.showProperties();
        });*/

        eventBus.on("propertiesPadEntity.click",(e)=>{
            //console.log(e);
            //console.log(this);
            this.setting.FlowBpmnJsContainer.showProperties();
            this.ShowPropertiesWindow(e,e.element);
            //_self.setting.FlowBpmnJsContainer.showProperties();
            modeler.get('canvas').zoom('fit-viewport','auto');
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

        eventBus.on("element.click",event=>{
            if(event.element.type=="bpmn:Process"){
                this.ProcessClickEvent(event,event.element);
            }
            console.log(event.element);
        });

        events.forEach(function(event) {
            eventBus.on(event, function(e) {
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
    ProcessClickEvent (event,element) {
        //let element=event.element;
        var value = BpmnJsUtility.GetElementDocumentationText(element);
        console.log(value);
        BpmnJsUtility.SetElementDocumentationText(element, "SetElementDocumentationText-" + value);
        value = BpmnJsUtility.GetElementDocumentationText(element);
        console.log(value);

        var id = BpmnJsUtility.GetElementName(element);
        console.log(id);
        BpmnJsUtility.SetElementName(element, "SetElementName-" + id);
        id = BpmnJsUtility.GetElementName(element);
        console.log(id);

        var code = BpmnJsUtility.GetElementCode(element);
        console.log(code);
        BpmnJsUtility.SetElementCode(element, "SetElementCode-" + code);
        code = BpmnJsUtility.GetElementCode(element);
        console.log(code);
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
        }
        console.log(event);
        console.log(element);
        this.setting.FlowBpmnJsContainer.showProperties(componentName, title, element);
        //alert("1");
    }
    LogXML(){
        console.log(this.GetXML());
    }
    GetXML(){
        var xml;
        modeler.saveXML(null,function (error,_xml) {
            xml=_xml;
        })
        return xml;
    }
    SetXML(xml){
        modeler.importXML(xml, function (err) {
            console.log(err);
        });
    }
}

//console.log(diagramXML);

export { FlowBpmnJsExtendContainer };