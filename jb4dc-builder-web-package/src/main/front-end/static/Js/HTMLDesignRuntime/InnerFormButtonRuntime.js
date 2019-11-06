let InnerFormButtonRuntime= {

    RendererSingleInnerFormButton: function (innerButtonConfig,formRuntimeInstance,listButtonPO) {
        var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + innerButtonConfig.id + '"><span>' + innerButtonConfig.caption + '</span></button>');
        elem.bind("click", {
            "innerButtonConfig":innerButtonConfig,
            "formRuntimeInstance":formRuntimeInstance,
            "listButtonPO":listButtonPO
        },this.RendererSingleInnerFormButtonClick)
        //console.log(innerButtonConfig);
        return elem;
    },
    RendererSingleInnerFormButtonClick:function (sender) {
        var innerButtonConfig = sender.data.innerButtonConfig;
        var formRuntimeInstance = sender.data.formRuntimeInstance;
        var listButtonPO = sender.data.listButtonPO;
        var formDataComplexPOList = formRuntimeInstance.SerializationFormData();
        var operationType=formRuntimeInstance._Prop_Config.OperationType;
        //console.log(innerButtonConfig);
        //console.log(listButtonPO);
        DialogUtility.AlertLoading(window,DialogUtility.DialogLoadingId,{},"系统处理中,请稍候...");
        RuntimeGeneralInstance.SubmitFormDataComplexPOListToServer(
            formDataComplexPOList,
            formDataComplexPOList.recordId,
            innerButtonConfig.id,
            listButtonPO.buttonId,
            operationType,
            function (result) {
                console.log(result);
                if(result.success){
                    window.setTimeout(function () {
                        DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                    },500);
                }

            },this);
        //debugger;
        //DialogUtility.AlertJsonCode(result,5);
        //console.log(innerButtonConfig);
    }
}