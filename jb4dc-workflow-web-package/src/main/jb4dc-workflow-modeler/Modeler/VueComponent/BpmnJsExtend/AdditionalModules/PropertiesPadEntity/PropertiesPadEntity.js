import {
    is
} from 'bpmn-js/lib/util/ModelUtil';

//import { FlowBpmnJsExtendContainer } from '../../FlowBpmnJsExtendContainer.js';

/**
 * A basic color picker implementation.
 *
 * @param {EventBus} eventBus
 * @param {ContextPad} contextPad
 * @param {CommandStack} commandStack
 */
export default function PropertiesPadEntity(eventBus, contextPad, commandStack) {

    contextPad.registerProvider(this);

    commandStack.registerHandler('shape.updateColor', UpdateColorHandler);

    function changeColor(event, element) {

        //var color = window.prompt('type a color code');
        //FlowBpmnJsExtendContainer.a1();
        //commandStack.execute('shape.updateColor', { element: element, color: "red" });
        eventBus.fire('propertiesPadEntity.click',   { element: element, eventBus: eventBus })
        //console.log(contextPad);
    }

    this.getContextPadEntries = function(element) {
        console.log(element);
        if (is(element, 'bpmn:SequenceFlow')||is(element, 'bpmn:UserTask')) {
            return {
                'changeColor': {
                    group: 'edit',
                    className: 'properties-pad-entity',
                    title: 'Change element color',
                    action: {
                        click: changeColor
                    }
                }
            };
        }
    };
}



/**
 * A handler updating an elements color.
 */
function UpdateColorHandler() {

    this.execute = function(context) {
        context.oldColor = context.element.color;
        context.element.color = context.color;

        return context.element;
    };

    this.revert = function(context) {
        context.element.color = context.oldColor;

        return context.element;
    };

}