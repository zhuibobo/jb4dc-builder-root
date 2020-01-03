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
export default function PropertiesPadEntity(eventBus, contextPad, commandStack,popupMenu) {

    contextPad.registerProvider(this);

    commandStack.registerHandler('shape.settingProperties', SettingPropertiesHandler);

    function settingPropertiesClick(event, element) {

        //var color = window.prompt('type a color code');
        //FlowBpmnJsExtendContainer.a1();
        //commandStack.execute('shape.updateColor', { element: element, color: "red" });
        eventBus.fire('propertiesPadEntity.click',   { element: element, eventBus: eventBus })
        /*console.log(contextPad);
        console.log(event);
        console.log(element);
        var tempElem=$("<div>11</div>");
        tempElem.css({
            "position":"absolute",
            "left":0,
            "top":100,
            "color":"red"
        })
        $("[data-overlay-id='"+contextPad._overlayId+"']").append(tempElem);
        console.log(popupMenu);*/
    }

    this.getContextPadEntries = function(element) {
        //console.log(element);
        if (is(element, 'bpmn:SequenceFlow')||is(element, 'bpmn:UserTask')) {
            return {
                'settingProperties': {
                    group: 'edit',
                    className: 'properties-pad-entity',
                    title: '属性设置',
                    action: {
                        click: settingPropertiesClick
                    }
                }
            };
        }
    };
}



/**
 * A handler updating an elements color.
 */
function SettingPropertiesHandler() {

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