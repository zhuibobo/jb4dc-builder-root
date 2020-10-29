var InnerFormJsClientButton= {
    _prop:InnerFormButton._prop,
    Instance:InnerFormButton.Instance,
    GetButtonElem:InnerFormButton.GetButtonElem,
    ButtonClickEvent: function (sender) {
        var innerButtonConfig = sender.data.innerButtonConfig;
        var actionType = innerButtonConfig.actionType;
        if(actionType=="reloadData"){
            window.location.href=window.location.href;
        }
        else{
            DialogUtility.AlertText("未实现!");
        }
    }
}