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
        //console.log(innerButtonConfig);
        //console.log(listButtonPO);
        RuntimeGeneralInstance.SubmitFormDataComplexPOListToServer(formDataComplexPOList, innerButtonConfig.id, listButtonPO.buttonId);
        //debugger;
        //DialogUtility.AlertJsonCode(result,5);
        //console.log(innerButtonConfig);
    }
}