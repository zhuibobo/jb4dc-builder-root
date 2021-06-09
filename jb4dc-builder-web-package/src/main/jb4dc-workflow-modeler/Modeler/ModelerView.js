import { FlowBpmnJsModelerView } from './VueComponent/BpmnJsExtend/FlowBpmnJsModelerView.js';

import flowInstanceRuntimePO from './VueComponent/BpmnJsExtend/ModelerViewData.json';


//window.ExFlowBpmnJsModelerView=FlowBpmnJsModelerView;

window.CreateModelerView=function (flowInstanceRuntimePO){

    console.log("CreateModelerView.ExFlowBpmnJsModelerView33333");
    var flowBpmnJsModelerView=FlowBpmnJsModelerView.CreateInstance({
        RendererToElemId: "flow-canvas",
        FlowBpmnJsContainer: null,
        ChangeSelectedElemCB: null,
        Op: BaseUtility.GetViewOperationName(),
        TemplateName: ""
    }, flowInstanceRuntimePO);

}