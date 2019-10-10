var WFDCT_SubFormListContainer={
    _AddButtonElem:null,
    _$TemplateTableRow:null,
    _$SingleControlElem:null,
    _$TableElem:null,
    _$TableBodyElem:null,
    _EditInRow:true,
    _Display_OPButtons_Add:true,
    _Display_OPButtons_Update:true,
    _Display_OPButtons_Del:true,
    _Display_OPButtons_View:true,
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem = _rendererChainParas.$singleControlElem;
        this._$SingleControlElem = $singleControlElem;
        this._$TableElem = this._$SingleControlElem.find("table");
        this._$TableBodyElem = this._$TableElem.find("tbody");

        this._EditInRow = $singleControlElem.attr("editinrow") == "false" ? false : true;

        var opbuttons = $singleControlElem.attr("opbuttons");
        this._Display_OPButtons_Add = opbuttons.indexOf("add") >= 0;
        this._Display_OPButtons_Update = opbuttons.indexOf("update") >= 0;
        this._Display_OPButtons_Del = opbuttons.indexOf("delete") >= 0;
        this._Display_OPButtons_View = opbuttons.indexOf("view") >= 0;

        var sourceHTML = $singleControlElem.html();
        var sourceTable = $singleControlElem.find("table[is_template_table='true']");
        sourceTable.addClass("sub-form-list-table");

        $singleControlElem.html("");

        this._AddButtonElem = $("<div class='sflb-button sflb-add' title='新增'>新增</div>");

        if(this._Display_OPButtons_Add) {
            $singleControlElem.prepend("<div class='sub-form-list-button-wrap'></div>").find("div").append(this._AddButtonElem);
        }

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

        var validateRendererChainEnable = this.ValidateRendererChainEnable();
        if (!validateRendererChainEnable.success) {
            DialogUtility.AlertText(validateRendererChainEnable.msg);
        }


    },
    RendererDataChain:HTMLControl.RendererDataChain,

    AddEvent:function (sender) {
        var $hostElem = sender.data.hostElem;
        var selfObj = sender.data.selfObj;
        var instanceName = sender.data.instanceName;
        //debugger;
        if (!selfObj._EditInRow) {
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
        //console.log(_rendererChainParas);
        //console.log(windowHeight);
        //console.log(windowWidth);
    },
    CompletedNewDialogEdit:function(instanceName,operationType,serializationSubFormData){

        if(this.ValidateSerializationSubFormDataEnable(serializationSubFormData)) {

            var oneDataRecord = ArrayUtility.WhereSingle(serializationSubFormData.formRecordDataRelationPOList, function (item) {
                return item.isMain == true;
            }).oneDataRecord;

            if (operationType == FormRuntime.OperationAdd) {
                //如果是新产生的记录，则生成随机的主键
                console.log("如果是新产生的记录，则生成随机的主键");
                this.CreateIdFieldInOneDataRecord(oneDataRecord);
            }

            //console.log(instanceName);
            console.log(oneDataRecord);
            //console.log(oneDataRecord);
            //console.log(this._$TemplateTableRow);
            //this._$TableBodyElem.append("<tr><td></td><td></td><td></td><td></td></tr>");
            this.NewRow(oneDataRecord);

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
        //如果不是行内编辑，则只能放置文本标签的内部控件1
        return {
            success:true,
            msg:""
        }
    },
    CreateIdFieldInOneDataRecord:function(oneDataRecord){
        var idField=JsonUtility.CloneSimple(oneDataRecord[0]);
        idField.fieldName="ID";
        idField.value=StringUtility.Guid();
        oneDataRecord.push(idField);
    },
    FindIdFieldByOneDataRecord:function(oneDataRecord){
        return ArrayUtility.WhereSingle(oneDataRecord,function (item) {
            return item.fieldName=="ID"
        });
    },
    NewRow:function (oneDataRecord) {
        var $tr = this._$TemplateTableRow;
        var controls = HTMLControl.FindALLControls($tr);
        controls.each(function (i) {
            var prop=HTMLControl.GetControlProp($(this));
            //debugger;
            var cellValue=HTMLControl.GetSerializationOneDataRecordFieldValue(oneDataRecord,prop.tableName,prop.fieldName);
            $(this).html(cellValue);
        });
        var idField=this.FindIdFieldByOneDataRecord(oneDataRecord);
        if(idField==null){
            DialogUtility.AlertText("WFDCT_SubFormListContainer.NewRow:查找不到ID的字段！");
        }
        console.log("绑定的记录ID:"+idField.value);
        var idValue=idField.value;
        $tr.attr("record_id",idValue);
        $tr.attr("record_data",JsonUtility.JsonToString(oneDataRecord));
        this._$TableBodyElem.append($tr);
    }
}