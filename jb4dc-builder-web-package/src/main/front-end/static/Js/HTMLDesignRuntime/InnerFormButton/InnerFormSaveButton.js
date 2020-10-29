var InnerFormSaveButton= {
    _prop:InnerFormButton._prop,
    Instance:InnerFormButton.Instance,
    GetButtonElem:InnerFormButton.GetButtonElem,
    ButtonClickEvent: function (sender) {
        var innerButtonConfig = sender.data.innerButtonConfig;
        var formRuntimeInstance = sender.data.formRuntimeInstance;
        var listButtonPO = sender.data.listButtonPO;
        var _this=sender.data._this;
        var saveAndClose=innerButtonConfig.saveAndClose;
        var validateResult=ValidateRulesRuntime.ValidateSubmitEnable();


        if (ValidateRulesRuntime.AlertValidateErrors(validateResult)) {
            var formDataComplexPO = formRuntimeInstance.SerializationFormData();
            var operationType = formRuntimeInstance._Prop_Config.OperationType;
            DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "系统处理中,请稍候...");
            RuntimeGeneralInstance.SubmitFormDataComplexPOListToServer(
                formDataComplexPO,
                formDataComplexPO.recordId,
                innerButtonConfig.id,
                listButtonPO.buttonId,
                operationType,
                function (result) {
                    if (result.success) {
                        if(this._prop.formRuntimeCategory==FormRuntimeSinglePageObject.FORM_RUNTIME_CATEGORY_LIST) {
                            var listFormButtonElemId = formRuntimeInstance.GetOpenedListFormButtonId();
                            window.OpenerWindowObj.WLDCT_ListTableContainer.TryReloadForListFormButton(listFormButtonElemId);
                            //console.log(window);
                            window.setTimeout(function () {
                                DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);

                                DialogUtility.Alert(window, DialogUtility.DialogId02, {}, result.message, function () {
                                    DialogUtility.Frame_CloseDialog(window);
                                }, this);
                            }, 500);
                        }
                        else if(this._prop.formRuntimeCategory==FormRuntimeSinglePageObject.FORM_RUNTIME_CATEGORY_INDEPENDENCE){
                            DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                            DialogUtility.Alert(window, DialogUtility.DialogId02, {}, result.message, function () {
                                if(saveAndClose){
                                    DialogUtility.AlertText("关闭窗口,未完成!");
                                }
                                window.location.href=window.location.href;
                            }, this);
                        }
                    }
                }, _this);
        }
    }
}

/*
var InnerFormSaveButton= {
    _prop: {
        elem: null,
        innerButtonConfig: null,
        formRuntimeInstance: null,
        listButtonPO: null,
        formRuntimeCategory: ""
    },
    Instance: function (innerButtonConfig, formRuntimeInstance, listButtonPO,formRuntimeCategory) {
        var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + innerButtonConfig.id + '"><span>' + innerButtonConfig.caption + '</span></button>');
        elem.bind("click", {
            "innerButtonConfig": innerButtonConfig,
            "formRuntimeInstance": formRuntimeInstance,
            "listButtonPO": listButtonPO,
            "_this":this
        }, this.ButtonClickEvent);
        this._prop.elem = elem;
        this._prop.formRuntimeCategory = formRuntimeCategory;
    },
    GetButtonElem: function () {
        return this._prop.elem;
    },
    ButtonClickEvent: function (sender) {
        var innerButtonConfig = sender.data.innerButtonConfig;
        var formRuntimeInstance = sender.data.formRuntimeInstance;
        var listButtonPO = sender.data.listButtonPO;
        var _this=sender.data._this;
        var validateResult=ValidateRulesRuntime.ValidateSubmitEnable();
        if (ValidateRulesRuntime.AlertValidateErrors(validateResult)) {
            var formDataComplexPO = formRuntimeInstance.SerializationFormData();
            var operationType = formRuntimeInstance._Prop_Config.OperationType;
            DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "系统处理中,请稍候...");
            RuntimeGeneralInstance.SubmitFormDataComplexPOListToServer(
                formDataComplexPO,
                formDataComplexPO.recordId,
                innerButtonConfig.id,
                listButtonPO.buttonId,
                operationType,
                function (result) {
                    if (result.success) {
                        if(this._prop.formRuntimeCategory==FormRuntimeSinglePageObject.FORM_RUNTIME_CATEGORY_LIST) {
                            var listFormButtonElemId = formRuntimeInstance.GetOpenedListFormButtonId();
                            window.OpenerWindowObj.WLDCT_ListTableContainer.TryReloadForListFormButton(listFormButtonElemId);
                            //console.log(window);
                            window.setTimeout(function () {
                                DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);

                                DialogUtility.Alert(window, DialogUtility.DialogId02, {}, result.message, function () {
                                    DialogUtility.Frame_CloseDialog(window);
                                }, this);
                            }, 500);
                        }
                        else if(this._prop.formRuntimeCategory==FormRuntimeSinglePageObject.FORM_RUNTIME_CATEGORY_INDEPENDENCE){
                            DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                            DialogUtility.Alert(window, DialogUtility.DialogId02, {}, result.message, function () {

                            }, this);
                        }
                    }
                }, _this);
        }
    }
}*/
