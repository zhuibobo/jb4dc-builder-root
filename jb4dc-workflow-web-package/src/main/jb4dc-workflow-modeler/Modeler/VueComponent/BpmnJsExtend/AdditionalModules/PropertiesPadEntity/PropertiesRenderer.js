import inherits from 'inherits';

import {
  attr as svgAttr
} from 'tiny-svg';

import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';


export default function PropertiesRenderer(
    config, eventBus, styles,
    pathMap, canvas, textRenderer) {

  BpmnRenderer.call(
      this,
      config, eventBus, styles,
      pathMap, canvas, textRenderer,
      1400
  );

  this.canRender = function (element) {
    return is(element, 'bpmn:BaseElement') && element.color;
  };

  this.drawShape = function (parent, shape) {

    var bpmnShape = this.drawBpmnShape(parent, shape);

    svgAttr(bpmnShape, {fill: shape.color});

    return bpmnShape;
  };
}

inherits(PropertiesRenderer, BpmnRenderer);

PropertiesRenderer.prototype.drawBpmnShape = BpmnRenderer.prototype.drawShape;


PropertiesRenderer.$inject = [
  'config.bpmnRenderer',
  'eventBus',
  'styles',
  'pathMap',
  'canvas',
  'textRenderer'
];