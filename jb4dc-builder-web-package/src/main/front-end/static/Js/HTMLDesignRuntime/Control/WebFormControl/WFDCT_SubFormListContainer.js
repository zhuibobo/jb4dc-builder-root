var WFDCT_SubFormListContainer={
    _AddButtonElem:null,
    _$TemplateTableRow:null,
    _$SingleControlElem:null,
    _$TableElem:null,
    _$TableBodyElem:null,
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem = _rendererChainParas.$singleControlElem;
        this._$SingleControlElem=$singleControlElem;
        this._$TableElem=this._$SingleControlElem.find("table");
        this._$TableBodyElem=this._$TableElem.find("tbody");
        var sourceHTML = $singleControlElem.html();
        var sourceTable = $singleControlElem.find("table[is_template_table='true']");
        sourceTable.addClass("sub-form-list-table");

        $singleControlElem.html("");

        this._AddButtonElem = $("<div class='sflb-button sflb-add' title='新增'>新增</div>");
        $singleControlElem.prepend("<div class='sub-form-list-button-wrap'></div>").find("div").append(this._AddButtonElem);
        $singleControlElem.append(sourceTable);

        var instanceName=HTMLControl.SaveControlNewInstanceToPool($singleControlElem,this);

        this._AddButtonElem.bind("click", {
            hostElem: $singleControlElem,
            _rendererChainParas:_rendererChainParas,
            selfObj:this,
            instanceName:instanceName
        }, this.AddEvent);

        this._$TemplateTableRow = $singleControlElem.find("table tbody tr").clone();
        $singleControlElem.find("table tbody tr").remove();
    },
    RendererDataChain:HTMLControl.RendererDataChain,

    AddEvent:function (sender) {
        var $hostElem=sender.data.hostElem;
        var editinrow=$hostElem.attr("editinrow");
        var instanceName=sender.data.instanceName;
        if(editinrow=="false"){
            sender.data.selfObj.AddEventNewDialog(sender,$hostElem,sender.data._rendererChainParas,instanceName);
        }
        else {
            sender.data.selfObj.AddEventInnerRowEdit(sender,$hostElem,sender.data._rendererChainParas,instanceName);
        }
        //console.log($hostElem);
        //alert("1");
    },
    AddEventNewDialog:function (sender,$hostElem,_rendererChainParas,instanceName) {
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
                "FormId": formId,
                "OperationType":"add",
                "InstanceName":instanceName
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
    CompletedNewDialogEdit:function(instanceName,operationType,serializationSubFormData){

        var oneDataRecord=ArrayUtility.WhereSingle(serializationSubFormData.formRecordDataRelationPOList,function (item) {
            return item.isMain==true;
        }).oneDataRecord;

        console.log(instanceName);
        console.log(serializationSubFormData);
        console.log(oneDataRecord);
        console.log(this._$TemplateTableRow);

        this._$TableBodyElem.append("<tr><td></td><td></td><td></td><td></td></tr>");
    },
    AddEventInnerRowEdit:function (sender,$hostElem,_rendererChainParas) {

    }
}