let WorkFlowSendActionObject={
    Instance:function (flowModelRuntimePO,jb4dcActions,formRuntimeInst,actionObj){
        console.log(actionObj);
        var htmlId= actionObj.actionHTMLId?actionObj.actionHTMLId:actionObj.actionCode;
        var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');
        elem.bind("click", {
            "flowModelRuntimePO": flowModelRuntimePO,
            "jb4dcActions": jb4dcActions,
            "formRuntimeInst": formRuntimeInst,
            "actionObj":actionObj,
            "_this": this
        }, this.ButtonClickEvent);
        return {
            elem:elem
        }
    },
    ButtonClickEvent:function (sender){
        var _prop = sender.data;
        console.log(_prop);
    }
}