let InnerFormButtonRuntime= {

    RendererSingleInnerFormButton: function (innerButtonConfig,formRuntimeInstance,listButtonPO) {
        //console.log(formRuntimeInstance);
        console.log(innerButtonConfig);
        //console.log(listButtonPO);
        var InnerFormButton;
        var buttonElem;
        var formRuntimeCategory=formRuntimeInstance._Prop_Config.FormRuntimeCategory;

        if(innerButtonConfig.buttonType=="关闭按钮"){
            InnerFormButton=Object.create(InnerFormCloseButton);
            buttonElem=InnerFormButton.Instance(innerButtonConfig,formRuntimeInstance,listButtonPO,formRuntimeCategory).elem;
        }
        else if(innerButtonConfig.buttonType=="保存按钮"){
            InnerFormButton=Object.create(InnerFormSaveButton);
            buttonElem=InnerFormButton.Instance(innerButtonConfig,formRuntimeInstance,listButtonPO,formRuntimeCategory).elem;
        }
        else if(innerButtonConfig.buttonType=="脚本按钮"){
            InnerFormButton=Object.create(InnerFormJsClientButton);
            buttonElem=InnerFormButton.Instance(innerButtonConfig,formRuntimeInstance,listButtonPO,formRuntimeCategory).elem;
        }
        else{
            var errorText="不支持的按钮类型:InnerFormButtonRuntime.RendererSingleInnerFormButton";
            DialogUtility.AlertText(errorText);
            throw errorText;
        }
        return buttonElem;
        /*var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + innerButtonConfig.id + '"><span>' + innerButtonConfig.caption + '</span></button>');
        elem.bind("click", {
            "innerButtonConfig":innerButtonConfig,
            "formRuntimeInstance":formRuntimeInstance,
            "listButtonPO":listButtonPO
        },this.RendererSingleInnerFormButtonClick)
        return elem;*/
    },
    RendererSingleInnerFormButtonClick:function (sender) {
        /*var innerButtonConfig = sender.data.innerButtonConfig;
        var formRuntimeInstance = sender.data.formRuntimeInstance;
        var listButtonPO = sender.data.listButtonPO;
        var validateResult=ValidateRulesRuntime.ValidateSubmitEnable();
        console.log(innerButtonConfig);
        if(innerButtonConfig.buttonType=="关闭按钮"){
            DialogUtility.Frame_CloseDialog(window);
            return;
        }
        else {
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
                    }, this);
            }
        }*/
    }
}