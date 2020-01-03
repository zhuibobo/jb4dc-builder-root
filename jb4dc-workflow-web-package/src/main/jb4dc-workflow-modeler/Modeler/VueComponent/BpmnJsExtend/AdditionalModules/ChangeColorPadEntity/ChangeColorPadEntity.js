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
export default function ChangeColorPadEntity(eventBus, contextPad, commandStack,popupMenu) {

    contextPad.registerProvider(this);

    commandStack.registerHandler('shape.changeColor', ChangeColorHandler);

    function buildChangeColorItem(fill,stroke) {
        var divChangeColorItem=$("<div class='change-color-pad-item' />");
        divChangeColorItem.css("backgroundColor",fill);
        divChangeColorItem.css("borderColor",stroke);
        return divChangeColorItem;
    }
    function showChangeColorClick(event, element) {

        //var color = window.prompt('type a color code');
        //FlowBpmnJsExtendContainer.a1();
        //commandStack.execute('shape.updateColor', { element: element, color: "red" });
        /*console.log(contextPad);
        console.log(event);
        console.log(element);
        console.log(popupMenu);*/
        var changeColorPadWrap=$("<div class='change-color-pad-wrap'></div>");
        changeColorPadWrap.append(buildChangeColorItem("rgb(255, 255, 255)","rgb(0, 0, 0)"));
        changeColorPadWrap.append(buildChangeColorItem("rgb(187, 222, 251)","rgb(30, 136, 229)"));
        changeColorPadWrap.append(buildChangeColorItem("rgb(255, 224, 178)","rgb(251, 140, 0)"));
        changeColorPadWrap.append(buildChangeColorItem("rgb(200, 230, 201)","rgb(67, 160, 71)"));
        changeColorPadWrap.append(buildChangeColorItem("rgb(255, 205, 210)","rgb(229, 57, 53)"));
        changeColorPadWrap.append(buildChangeColorItem("rgb(225, 190, 231)","rgb(142, 36, 170)"));
        $("[data-overlay-id='"+contextPad._overlayId+"']").append(changeColorPadWrap);
    }

    this.getContextPadEntries = function(element) {
        //console.log(element);
        if (is(element, 'bpmn:UserTask')) {
            return {
                'changeColor': {
                    group: 'edit',
                    className: 'change-color-pad-entity',
                    title: '颜色设置',
                    action: {
                        click: showChangeColorClick
                    }
                }
            };
        }
    };
}



/**
 * A handler updating an elements color.
 */
function ChangeColorHandler() {

    this.execute = function(context) {
        //context.oldColor = context.element.color;
        //context.element.color = context.color;

        return context.element;
    };

    this.revert = function(context) {
        //context.element.color = context.oldColor;
        return context.element;
    };

}