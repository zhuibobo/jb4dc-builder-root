let WorkFlowSendAction={
    acInterface:{
        resolveNextPossibleFlowNode:"/Rest/Workflow/RunTime/InstanceRuntime/ResolveNextPossibleFlowNode",
        completeTask:"/Rest/Workflow/RunTime/InstanceRuntime/CompleteTask"
    },
    _Prop:{

    },
    Instance:function (flowModelRuntimePO,flowModelRuntimePOCacheKey,jb4dcActions,formRuntimeInst,actionObj,isStartInstanceStatus,pageHostInstance) {
        console.log(actionObj);
        var htmlId = actionObj.actionHTMLId ? actionObj.actionHTMLId : actionObj.actionCode;
        var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');
        this._Prop = {
            "sender": this,
            "flowModelRuntimePO": flowModelRuntimePO,
            "flowModelRuntimePOCacheKey": flowModelRuntimePOCacheKey,
            "jb4dcActions": jb4dcActions,
            "formRuntimeInst": formRuntimeInst,
            "actionObj": actionObj,
            "isStartInstanceStatus": isStartInstanceStatus,
            "pageHostInstance": pageHostInstance
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
                flowModelRuntimePOCacheKey: sender.data.flowModelRuntimePOCacheKey,
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
                    UserTaskReceiverDialogUtility.ShowDialog(_prop.sender, result.data, _prop.sender.SelectReceiverCompleted);
                }, _prop.sender);
            }
        }
    },
    SelectReceiverCompleted:function (nextTaskEntityList,selectedReceiverData){
        console.log(selectedReceiverData);
        console.log(this._Prop.actionObj.actionCaption);

        var selectedReceiverVars=FlowRuntimeVarBuilder.BuilderSelectedReceiverToInstanceVar(nextTaskEntityList,selectedReceiverData);
        var sendData=this.BuildSendToServerData(this._Prop, {
            selectedReceiverVars:encodeURIComponent(JsonUtility.JsonToString(selectedReceiverVars))
        });

        if(sendData.success) {
            AjaxUtility.Post(this.acInterface.completeTask, sendData.data, function (result) {
                DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                console.log(result);
            }, this._Prop.sender);
        }
    },
    BuildSendToServerData:function (_prop,appendSendMap){
        var formDataComplexPO = _prop.formRuntimeInst.SerializationFormData();
        var result = {
            success: true,
            data: {
                isStartInstanceStatus: _prop.isStartInstanceStatus,
                actionCode: _prop.actionObj.actionCode,
                flowModelRuntimePOCacheKey: _prop.flowModelRuntimePOCacheKey,
                "formRecordComplexPOString": encodeURIComponent(JsonUtility.JsonToString(formDataComplexPO)),
            }
        }

        if(!appendSendMap){
            for (var key in appendSendMap) {
                result.data[key]=appendSendMap[key];
            }
        }

        return result;
    }
}