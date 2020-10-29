var InnerFormButton= {
    _prop: {
        elem: null,
        innerButtonConfig: null,
        formRuntimeInstance: null,
        listButtonPO: null,
        formRuntimeCategory: ""
    },
    Instance: function (innerButtonConfig, formRuntimeInstance, listButtonPO, formRuntimeCategory) {
        var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + innerButtonConfig.id + '"><span>' + innerButtonConfig.caption + '</span></button>');
        elem.bind("click", {
            "innerButtonConfig": innerButtonConfig,
            "formRuntimeInstance": formRuntimeInstance,
            "listButtonPO": listButtonPO,
            "_this": this
        }, this.ButtonClickEvent);
        this._prop.elem = elem;
        this._prop.innerButtonConfig = innerButtonConfig;
        this._prop.formRuntimeInstance = formRuntimeInstance;
        this._prop.listButtonPO = listButtonPO;
        this._prop.formRuntimeCategory = formRuntimeCategory;
    },
    GetButtonElem: function () {
        return this._prop.elem;
    },
    ButtonClickEvent: function (sender) {
        DialogUtility.Frame_CloseDialog(window);
    }
}