import $ from 'jquery';

import resizeAllModule from './lib/resize-all-rules';
import colorPickerModule from './lib/color-picker';
import nyanDrawModule from './lib/nyan/draw';
import nyanPaletteModule from './lib/nyan/palette';

import BpmnModeler from 'bpmn-js';
import diagramXML from './newDiagram.bpmn';

var modeler = new BpmnModeler({
    container: '#canvas',
    additionalModules: [
        resizeAllModule,
        colorPickerModule,
        nyanDrawModule,
        nyanPaletteModule
    ]
});

function openDiagram(xml) {
    modeler.importXML(xml, function(err) {
        if (err) {
            console.error(err);
        } else {
        }
    });
}

openDiagram(diagramXML);