var WFDCT_SubFormListContainer={
    _AddButtonElem:null,
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem = _rendererChainParas.$singleControlElem;

        var sourceHTML = $singleControlElem.html();
        var sourceTable = $singleControlElem.find("table[is_template_table='true']");
        sourceTable.addClass("sub-form-list-table");

        $singleControlElem.html("");

        this._AddButtonElem = $("<div class='sflb-button sflb-add' title='新增'>新增</div>");
        $singleControlElem.prepend("<div class='sub-form-list-button-wrap'></div>").find("div").append(this._AddButtonElem);
        $singleControlElem.append(sourceTable);

        this._AddButtonElem.bind("click", {
            hostElem: $singleControlElem,
            _rendererChainParas:_rendererChainParas,
            selfObj:this
        }, this.AddEvent);
    },
    RendererDataChain:HTMLControl.RendererDataChain,
    AddEvent:function (sender) {
        var $hostElem=sender.data.hostElem;
        var editinrow=$hostElem.attr("editinrow");
        if(editinrow=="false"){
            sender.data.selfObj.AddEventNewDialog(sender,$hostElem,sender.data._rendererChainParas);
        }
        else {
            sender.data.selfObj.AddEventInnerRowEdit(sender,$hostElem,sender.data._rendererChainParas);
        }
        //console.log($hostElem);
        //alert("1");
    },
    AddEventNewDialog:function (sender,$hostElem,_rendererChainParas) {
        var formId=$hostElem.attr("formid");
        var windowHeight=$hostElem.attr("windowheight");
        var windowWidth=$hostElem.attr("windowwidth");
        var dialogWindowTitle=$hostElem.attr("dialogwindowtitle");
        if(!dialogWindowTitle){
            dialogWindowTitle="应用构建系统";
        }

        var isPreview=_rendererChainParas.formRuntimeInstance.IsPreview();
        if(isPreview) {
            var url=BaseUtility.BuildView("/HTML/Builder/Form/SubFormPreview.html", {
                "FormId": formId
            });
            DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
                title: dialogWindowTitle,
                width:windowWidth,
                height:windowHeight
            }, 1);
        }
        console.log(_rendererChainParas);
        console.log(windowHeight);
        console.log(windowWidth);
    },
    AddEventInnerRowEdit:function (sender,$hostElem,_rendererChainParas) {

    }
}