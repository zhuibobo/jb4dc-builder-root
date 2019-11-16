import inherits from 'inherits';

import Viewer from 'bpmn-js';

import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';

import SketchyRendererModule from 'bpmn-js-sketchy';

import diagramXML from './pizza-collaboration.bpmn';
/**
 * A viewer that includes mouse navigation and a sketchy renderer.
 *
 * @param {Object} options
 */
export default function CustomViewer(options) {
  Viewer.call(this, options);
}

inherits(CustomViewer, Viewer);

CustomViewer.prototype._customModules = [
  ZoomScrollModule,
  MoveCanvasModule,
  SketchyRendererModule
];

CustomViewer.prototype._modules = [].concat(
  Viewer.prototype._modules,
  CustomViewer.prototype._customModules
);

function appendStylesheet(url, done) {
  var stylesheet = document.createElement('link');

  stylesheet.href = url;
  stylesheet.rel = 'stylesheet';
  stylesheet.type = 'text/css';
  stylesheet.onload = done;

  document.getElementsByTagName('head')[0].appendChild(stylesheet);
}


// viewer instance
var bpmnViewer = new Viewer({
  container: '#canvas',
  keyboard: {
    bindTo: document
  },
  bpmnRenderer: {
    defaultFillColor: '#333',
    defaultStrokeColor: '#fff'
  },
  textRenderer: {
    defaultStyle: {
      fontFamily: '"Nothing You Could Do"',
      fontWeight: 'bold',
      fontSize: 12,
      lineHeight: 16
    },
    externalStyle: {
      fontSize: 12,
      lineHeight: 16
    }
  }
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

    // zoom to fit full viewport
    canvas.zoom('fit-viewport');
  });
}


openDiagram(diagramXML);