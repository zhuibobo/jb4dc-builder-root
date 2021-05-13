var ActionsRuntimeObject={
    CreateALLActionButton:function (flowModelRuntimePO,flowModelRuntimePOCacheKey,jb4dcActions,formRuntimeInst) {
        if(jb4dcActions&&jb4dcActions.jb4dcActionList){
            var buttonElem;
            for (let i = 0; i < jb4dcActions.jb4dcActionList.length; i++) {
                let actionObj=jb4dcActions.jb4dcActionList[i];
                if(actionObj.juelRunResultPO.booleanResult) {
                    if (actionObj.actionType == "send") {
                        var sendActionObject = Object.create(WorkFlowSendActionObject);
                        buttonElem = sendActionObject.Instance(flowModelRuntimePO,flowModelRuntimePOCacheKey, jb4dcActions, formRuntimeInst, actionObj);
                    }
                    $("#flowWorkActionButtonWrapOuter").append(buttonElem.elem);
                }
            }
        }
    },
    GetActionObj:function () {
        return {
            actionAutoSend: "false",
            actionCCReceiveObjects: "[]",
            actionCallApis: "[]",
            actionCallComplete: "true",
            actionCallJsMethod: null,
            actionCaption: "草稿",
            actionCode: "action_516009775",
            actionConfirm: "false",
            actionDisplayConditionEditText: null,
            actionDisplayConditionEditValue: null,
            actionExecuteVariables: "[]",
            actionHTMLClass: null,
            actionHTMLId: null,
            actionMainReceiveObjects: "[]",
            actionRunSqls: "[]",
            actionSendMessageId: null,
            actionSendSignalId: null,
            actionShowOpinionDialog: "false",
            actionType: "send",
            actionUpdateFields: "[]",
            actionValidate: "无",
            actionsOpinionBindToElemId: null,
            actionsOpinionBindToField: null,
            juelRunResultPO: {
                booleanResult: true,
                message: "",
                stringResult: "",
                success: true
            }
        };
    }
}