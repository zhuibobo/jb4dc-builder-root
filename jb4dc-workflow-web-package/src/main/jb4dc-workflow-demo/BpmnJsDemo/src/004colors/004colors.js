import $ from "jquery";
import BpmnViewer from 'bpmn-js';
import pizzaDiagram from './pizza-collaboration.bpmn';

// viewer instance
var viewer = new BpmnViewer({
    container: '#diagram'
});


/**
 * Open diagram in our viewer instance.
 *
 * @param {String} bpmnXML diagram to display
 */
function showDiagram(diagramXML) {

    viewer.importXML(diagramXML, function() {

        var overlays = viewer.get('overlays'),
            canvas = viewer.get('canvas'),
            elementRegistry = viewer.get('elementRegistry'),
            modeling = viewer.get('modeling');

        // Option 1: Color via Overlay
        var shape = elementRegistry.get('CalmCustomerTask');

        var $overlayHtml = $('<div class="highlight-overlay">')
            .css({
                width: shape.width,
                height: shape.height
            });

        overlays.add('CalmCustomerTask', {
            position: {
                top: 0,
                left: 0
            },
            html: $overlayHtml
        });

        // Option 2: Color via BPMN 2.0 Extension
        var elementToColor = elementRegistry.get('SelectAPizzaTask');

        modeling.setColor([ elementToColor ], {
            stroke: 'green',
            fill: 'rgba(0, 80, 0, 0.4)'
        });

        // Option 3: Color via Marker + CSS Styling
        canvas.addMarker('OrderReceivedEvent', 'highlight');
    });
}


showDiagram(pizzaDiagram);