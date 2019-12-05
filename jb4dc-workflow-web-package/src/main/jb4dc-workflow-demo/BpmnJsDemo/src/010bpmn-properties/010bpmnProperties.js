import $ from 'jquery';

import BpmnModeler from 'bpmn-js';

import diagramXML from './newDiagram.bpmn';

var bpmnModeler = new BpmnModeler({
    container: '#canvas',
});

bpmnModeler.importXML(diagramXML, function(err) {
    if (err) {
        console.error(err);
    } else {
        var elementRegistry = bpmnModeler.get('elementRegistry');

        var StartEvent_1 = elementRegistry.get('StartEvent_1');
        console.log(StartEvent_1);

        var sequenceFlowElement = elementRegistry.get('SequenceFlow_1');
        var sequenceFlow = sequenceFlowElement.businessObject;

        console.log(sequenceFlowElement);
        console.log(sequenceFlow);

        var moddle = bpmnModeler.get('moddle');
        var newCondition = moddle.create('bpmn:FormalExpression', {
            body: '${ value > 100 }'
        });
        sequenceFlow.conditionExpression = newCondition;
        sequenceFlow.name="你好啊!";

        var modeling = bpmnModeler.get('modeling');

        modeling.updateProperties(sequenceFlowElement, {
            conditionExpression: newCondition
        });
    }
});