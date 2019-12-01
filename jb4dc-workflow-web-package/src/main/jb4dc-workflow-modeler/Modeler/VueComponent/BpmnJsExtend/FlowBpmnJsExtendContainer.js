import BpmnModeler from 'bpmn-js/lib/Modeler';
import diagramXML from '../../Resources/newDiagram.bpmn';
let modeler=null;
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
            "container": $("#"+exConfig.RendererToElemId)[0]
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