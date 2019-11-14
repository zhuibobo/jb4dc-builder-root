// we use stringify to inline an example XML document
import pizzaDiagram from './bpmn03-44.bpmn';


// make sure you added bpmn-js to your your project
// dependencies via npm install --save bpmn-js
import BpmnViewer from 'bpmn-js';

// viewer instance
var bpmnViewer = new BpmnViewer({
    container: '#canvas'
});


/**
 * Open diagram in our viewer instance.
 *
 * @param {String} bpmnXML diagram to display
 */
function openDiagram(bpmnXML) {

    // import diagram
    bpmnViewer.importXML(bpmnXML, function(err) {

        if (err) {
            return console.error('could not import BPMN 2.0 diagram', err);
        }

        // access viewer components
        var canvas = bpmnViewer.get('canvas');
        var overlays = bpmnViewer.get('overlays');


        // zoom to fit full viewport
        canvas.zoom('fit-viewport');

        // attach an overlay to a node
        overlays.add('endevent1', 'note', {
            position: {
                bottom: 0,
                right: 0
            },
            html: '<div class="diagram-note">Mixed up the labels?</div>'
        });

        // add marker
        canvas.addMarker('endevent1', 'needs-discussion');
    });
}

openDiagram(pizzaDiagram);