import BpmnModeler from 'bpmn-js/lib/Modeler';
import diagramXML from '../../Resources/newDiagram.bpmn';
import CustomTranslate from './CustomTranslate';
let modeler=null;

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
                customTranslateModule
            ]
        });
        modeler.importXML(diagramXML, function (err) {
            console.log(err);
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