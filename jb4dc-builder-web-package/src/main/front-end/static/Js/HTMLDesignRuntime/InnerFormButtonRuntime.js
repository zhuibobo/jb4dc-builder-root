let InnerFormButtonRuntime= {

    RendererSingleInnerFormButton: function (innerButtonConfig,formRuntimeInstance,listButtonPO) {
        var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + innerButtonConfig.id + '"><span>' + innerButtonConfig.caption + '</span></button>');
        elem.bind("click", {
            "innerButtonConfig":innerButtonConfig,
            "formRuntimeInstance":formRuntimeInstance,
            "listButtonPO":listButtonPO
        },this.RendererSingleInnerFormButtonClick)
        return elem;
    },
    RendererSingleInnerFormButtonClick:function (sender) {
        var innerButtonConfig = sender.data.innerButtonConfig;
        var formRuntimeInstance = sender.data.formRuntimeInstance;
        var listButtonPO = sender.data.listButtonPO;
        var formDataComplexPO = formRuntimeInstance.SerializationFormData();
        //console.log(formDataComplexPO);
        var operationType=formRuntimeInstance._Prop_Config.OperationType;
        DialogUtility.AlertLoading(window,DialogUtility.DialogLoadingId,{},"系统处理中,请稍候...");
        return;
        RuntimeGeneralInstance.SubmitFormDataComplexPOListToServer(
            formDataComplexPO,
            formDataComplexPO.recordId,
            innerButtonConfig.id,
            listButtonPO.buttonId,
            operationType,
            function (result) {
                if(result.success){
                    var listFormButtonElemId=formRuntimeInstance.GetOpenedListFormButtonId();
                    window.OpenerWindowObj.WLDCT_ListTableContainer.TryReloadForListFormButton(listFormButtonElemId);
                    //console.log(window);
                    window.setTimeout(function () {
                        DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);

                        DialogUtility.Alert(window,DialogUtility.DialogId02,{},result.message,function () {
                            DialogUtility.Frame_CloseDialog(window);
                        },this);
                    },500);
                }
            },this);
    }
}