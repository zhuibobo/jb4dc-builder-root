import $ from 'jquery';

import BpmnModeler from 'bpmn-js';

import diagramXML from './qr-code.bpmn';

var bpmnModeler = new BpmnModeler({
    container: '#canvas',
});

bpmnModeler.importXML(diagramXML, function(err) {
    if (err) {
        console.error(err);
    } else {
        var elementRegistry = bpmnJS.get('elementRegistry');
        var sequenceFlowElement = elementRegistry.get('SequenceFlow_1');
        var sequenceFlow = sequenceFlowElement.businessObject;
    }
});