import $ from 'jquery';

import BpmnModeler from 'bpmn-js';

import customTranslate from './customTranslate';

import diagramXML from './newDiagram.bpmn';


// Our custom translation module
// We need to use the array syntax that is used by bpmn-js internally
// 'value' tells bmpn-js to use the function instead of trying to instanciate it
var customTranslateModule = {
  translate: [ 'value', customTranslate ]
};

// Spin up an instance of the modeler that uses our custom translation module
var modeler = new BpmnModeler({
  container: '#canvas',
  additionalModules: [
    customTranslateModule
  ]
});

// Import our diagram
modeler.importXML(diagramXML, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('Success!');
  }
});
