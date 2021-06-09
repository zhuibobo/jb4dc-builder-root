let WorkFlowSendAction={
    acInterface:{
        resolveNextPossibleFlowNode:"/Rest/Workflow/RunTime/Client/InstanceRuntime/ResolveNextPossibleFlowNode",
        completeTask:"/Rest/Workflow/RunTime/Client/InstanceRuntime/CompleteTask"
    },
    _Prop:{

    },
    Instance:function (isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas,actionObj) {
        console.log(actionObj);
        var htmlId = actionObj.actionHTMLId ? actionObj.actionHTMLId : actionObj.actionCode;
        var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');
        this._Prop = {
            "sender": this,
            "flowInstanceRuntimePO": pageReadyInnerParas.flowInstanceRuntimePO,
            "flowInstanceRuntimePOCacheKey": pageReadyInnerParas.flowInstanceRuntimePOCacheKey,
            "jb4dcActions": pageReadyInnerParas.jb4dcActions,
            "formRuntimeInst": formRuntimeInst,
            "actionObj": actionObj,
            "isStartInstanceStatus": isStartInstanceStatus,
            "pageHostInstance": pageHostInstance,
            "currentNodeKey": pageReadyInnerParas.currentNodeKey,
            "currentNodeName": pageReadyInnerParas.currentNodeName,
            "recordId":pageReadyInnerParas.recordId,
            "modelId":pageReadyInnerParas.modelId,
            "modelReKey":pageReadyInnerParas.modelReKey,
            "currentTaskId":pageReadyInnerParas.currentTaskId
        }
        elem.bind("click", this._Prop, this.ButtonClickEvent);
        return {
            elem: elem
        }
    },
    ButtonClickEvent:function (sender) {
        //WorkFlowBaseAction.ResolveNextPossibleFlowNodeDialogAndCallSelectReceiverCompleted(sender.data);
        /*var validateResult = ValidateRulesRuntime.ValidateSubmitEnable();
        var _this = sender.data._this;
        if (ValidateRulesRuntime.AlertValidateErrors(validateResult)) {
            var formDataComplexPO = sender.data.formRuntimeInst.SerializationFormData();
            DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "");
            AjaxUtility.Post(WorkFlowBaseAction.acInterface.resolveNextPossibleFlowNode, {
                isStartInstanceStatus: sender.data.isStartInstanceStatus,
                actionCode: sender.data.actionObj.actionCode,
                flowInstanceRuntimePOCacheKey: sender.data.flowInstanceRuntimePOCacheKey,
                "formRecordComplexPOString": encodeURIComponent(JsonUtility.JsonToString(formDataComplexPO)),
            }, function (result) {
                DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                console.log(result);
                UserTaskReceiverDialogUtility.ShowDialog(_this, result.data, _this.SelectReceiverCompleted);
            }, _this);
        }*/

        var validateResult = ValidateRulesRuntime.ValidateSubmitEnable();

        if (ValidateRulesRuntime.AlertValidateErrors(validateResult)) {
            DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "");

            var _prop=sender.data;
            var _this = _prop.sender;

            var sendData=_this.BuildSendToServerData(_prop,null);
            if(sendData.success) {
                AjaxUtility.Post(_this.acInterface.resolveNextPossibleFlowNode, sendData.data, function (result) {
                    DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                    //DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                    console.log(result);
                    if(result.data.nextTaskIsEndEvent){
                        this.SelectReceiverCompleted(result.data.bpmnTaskList,[])
                    }
                    else if(result.data.currentTaskIsMultiInstance&&(result.data.currentTaskMultiCompletedInstances+1)<result.data.currentTaskMultiCountEngInstances){
                        this.SelectReceiverCompleted(result.data.bpmnTaskList,[])
                    }
                    else{
                        //单实例环节或者多实例环境的最后一人
                        UserTaskReceiverDialogUtility.ShowDialog(_prop.sender, result.data.bpmnTaskList, _prop.sender.SelectReceiverCompleted);
                    }

                }, _prop.sender);
            }
        }
    },
    SelectReceiverCompleted:function (nextTaskEntityList,selectedReceiverData){
        console.log(selectedReceiverData);
        console.log(this._Prop.actionObj.actionCaption);

        DialogUtility.Confirm(window,"确认执行发送?",function (){
            var selectedReceiverVars=FlowRuntimeVarBuilder.BuilderSelectedReceiverToInstanceVar(nextTaskEntityList,selectedReceiverData);
            var sendData=this.BuildSendToServerData(this._Prop, {
                selectedReceiverVars:encodeURIComponent(JsonUtility.JsonToString(selectedReceiverVars))
            });

            //console.log(sendData);
            if(sendData.success) {
                DialogUtility.AlertLoading(window,DialogUtility.DialogLoadingId,{},"系统处理中,请稍候!");

                AjaxUtility.Post(this.acInterface.completeTask, sendData.data, function (result) {
                    DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                    if(result.success) {
                        window.OpenerWindowObj.instanceMainTaskProcessList.reloadData();
                        DialogUtility.Alert(window,DialogUtility.DialogAlertId,{}, result.message, function () {
                            DialogUtility.Frame_CloseDialog(window);
                        }, this);
                    }
                    else {
                        DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, result.data.message);
                    }
                }, this._Prop.sender);
            }
        },this);
    },
    BuildSendToServerData:function (_prop,appendSendMap){
        var formDataComplexPO = _prop.formRuntimeInst.SerializationFormData();
        var result = {
            success: true,
            data: {
                isStartInstanceStatus: _prop.isStartInstanceStatus,
                actionCode: _prop.actionObj.actionCode,
                flowInstanceRuntimePOCacheKey: _prop.flowInstanceRuntimePOCacheKey,
                "formRecordComplexPOString": encodeURIComponent(JsonUtility.JsonToString(formDataComplexPO)),
                "currentNodeKey": _prop.currentNodeKey,
                "currentNodeName": _prop.currentNodeName,
                "recordId":_prop.recordId,
                "modelId":_prop.modelId,
                "modelReKey":_prop.modelReKey,
                "currentTaskId":_prop.currentTaskId
            }
        }

        if(appendSendMap){
            for (var key in appendSendMap) {
                result.data[key]=appendSendMap[key];
            }
        }

        return result;
    }
}