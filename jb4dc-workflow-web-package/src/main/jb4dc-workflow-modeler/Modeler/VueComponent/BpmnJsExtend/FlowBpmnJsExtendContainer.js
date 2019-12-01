import BpmnModeler from 'bpmn-js/lib/Modeler';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import diagramXML from '../../Resources/newDiagram1.bpmn';
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
        RendererToElemId:""
    };
    constructor() {

    }

    Initialize (exConfig) {
        //debugger;
        exConfig = $.extend(true, {}, this.defaultSetting, exConfig);
        modeler = new BpmnModeler({
            "container": $("#"+exConfig.RendererToElemId)[0],
            "additionalModules": [
                customTranslateModule,
                propertiesPadEntity
            ],
            // needed if you'd like to maintain camunda:XXX properties in the properties panel
            moddleExtensions: {
                camunda: camundaModdleDescriptor
            }
        });
        modeler.importXML(diagramXML, function (err) {
            console.log(err);
        });
        eventBus = modeler.get('eventBus');

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
}

//console.log(diagramXML);

export { FlowBpmnJsExtendContainer };