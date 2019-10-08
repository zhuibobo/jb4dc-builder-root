var WFDCT_SubFormListContainer={
    _AddButtonElem:null,
    _$TemplateTableRow:null,
    _$SingleControlElem:null,
    _$TableElem:null,
    _$TableBodyElem:null,
    _EditInRow:true,
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem = _rendererChainParas.$singleControlElem;
        this._$SingleControlElem = $singleControlElem;
        this._$TableElem = this._$SingleControlElem.find("table");
        this._$TableBodyElem = this._$TableElem.find("tbody");

        this._EditInRow = $singleControlElem.attr("editinrow") == "false" ? false : true;

        var sourceHTML = $singleControlElem.html();
        var sourceTable = $singleControlElem.find("table[is_template_table='true']");
        sourceTable.addClass("sub-form-list-table");

        $singleControlElem.html("");

        this._AddButtonElem = $("<div class='sflb-button sflb-add' title='新增'>新增</div>");
        $singleControlElem.prepend("<div class='sub-form-list-button-wrap'></div>").find("div").append(this._AddButtonElem);
        $singleControlElem.append(sourceTable);

        var instanceName = HTMLControl.SaveControlNewInstanceToPool($singleControlElem, this);

        this._AddButtonElem.bind("click", {
            hostElem: $singleControlElem,
            _rendererChainParas: _rendererChainParas,
            selfObj: this,
            instanceName: instanceName
        }, this.AddEvent);

        this._$TemplateTableRow = $singleControlElem.find("table tbody tr").clone();
        $singleControlElem.find("table tbody tr").remove();

        var validateRendererChainEnable=this.ValidateRendererChainEnable();
        if(!validateRendererChainEnable.success){
            DialogUtility.AlertText(validateRendererChainEnable.msg);
        }
    },
    RendererDataChain:HTMLControl.RendererDataChain,

    AddEvent:function (sender) {
        var $hostElem = sender.data.hostElem;
        var selfObj = sender.data.selfObj;
        var instanceName = sender.data.instanceName;
        if (selfObj._EditInRow == "false") {
            sender.data.selfObj.AddEventNewDialog(sender, $hostElem, sender.data._rendererChainParas, instanceName);
        } else {
            sender.data.selfObj.AddEventInnerRowEdit(sender, $hostElem, sender.data._rendererChainParas, instanceName);
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

        if(this.ValidateSerializationSubFormDataEnable(serializationSubFormData)) {

            var oneDataRecord = ArrayUtility.WhereSingle(serializationSubFormData.formRecordDataRelationPOList, function (item) {
                return item.isMain == true;
            }).oneDataRecord;

            console.log(instanceName);
            console.log(serializationSubFormData);
            console.log(oneDataRecord);
            console.log(this._$TemplateTableRow);
            this._$TableBodyElem.append("<tr><td></td><td></td><td></td><td></td></tr>");

        }
    },
    AddEventInnerRowEdit:function (sender,$hostElem,_rendererChainParas) {

    },
    ValidateSerializationSubFormDataEnable:function(serializationSubFormData){
        if(serializationSubFormData.formRecordDataRelationPOList.length>1){
            DialogUtility.AlertText("子表暂时不支持数据关联！");
            return false;
        }
        return true;
    },
    ValidateRendererChainEnable:function () {
        //如果不是行内编辑，则只能放置文本标签的内部控件
        return {
            success:false,
            msg:"11111"
        }
    }
}