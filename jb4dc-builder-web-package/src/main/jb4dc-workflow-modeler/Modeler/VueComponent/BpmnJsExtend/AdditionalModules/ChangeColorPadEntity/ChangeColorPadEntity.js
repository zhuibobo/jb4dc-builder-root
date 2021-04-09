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
export default function ChangeColorPadEntity(eventBus, contextPad, commandStack,popupMenu,modeling) {

    contextPad.registerProvider(this);

    commandStack.registerHandler('shape.updateColor', ChangeColorHandler);

    function buildChangeColorItem(fill,stroke,element) {
        var divChangeColorItem=$("<div class='change-color-pad-item' />");
        divChangeColorItem.css("backgroundColor",fill);
        divChangeColorItem.css("borderColor",stroke);
        divChangeColorItem.bind("click",{fill:fill,stroke:stroke,element:element},function (event) {
            var fill=event.data.fill;
            var stroke=event.data.stroke;
            var element=event.data.element;
            //element.color=fill;
            modeling.setColor(element,{fill:fill,stroke:stroke});
            //commandStack.execute('shape.updateColor', { element: element, color: fill });
        });
        return divChangeColorItem;
    }
    function showChangeColorClick(event, element) {

        //var color = window.prompt('type a color code');
        //FlowBpmnJsExtendContainer.a1();
        //commandStack.execute('shape.updateColor', { element: element, color: "red" });
        console.log(contextPad);
        console.log(event);
        console.log(element);
        console.log(popupMenu);
        console.log(modeling);
        //console.log(modeler);
        var changeColorPadWrap=$("<div class='change-color-pad-wrap'></div>");
        changeColorPadWrap.append(buildChangeColorItem("#ffffff","#000000",element));
        changeColorPadWrap.append(buildChangeColorItem("#bcdefb","#1e88e5",element));
        changeColorPadWrap.append(buildChangeColorItem("#ffe0b2","#fb8c00",element));
        changeColorPadWrap.append(buildChangeColorItem("#c8e6c9","#43a047",element));
        changeColorPadWrap.append(buildChangeColorItem("#ffcdd2","#e53935",element));
        changeColorPadWrap.append(buildChangeColorItem("#e1bee7","#8e24aa",element));
        $("[data-overlay-id='"+contextPad._overlayId+"']").append(changeColorPadWrap);
    }

    this.getContextPadEntries = function(element) {
        //console.log(element);
        if (is(element, 'bpmn:UserTask')||
            is(element, 'bpmn:ServiceTask')||
            is(element, 'bpmn:BoundaryEvent')||
            is(element, 'bpmn:IntermediateThrowEvent')||
            is(element, 'bpmn:IntermediateCatchEvent')||
            is(element, 'bpmn:StartEvent')||
            is(element, 'bpmn:EndEvent')
        ) {
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
        context.oldColor = context.element.color;
        context.element.color = context.color;

        return context.element;
    };

    this.revert = function(context) {
        context.element.color = context.oldColor;

        return context.element;
    };

}