var WFDCT_SubFormListContainer={
    _AddButtonElem:null,
    _$TemplateTableRow:null,
    _$SingleControlElem:null,
    _$TableElem:null,
    _$TableHeadElem:null,
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
        this._$TableHeadElem=this._$TableElem.find("thead");

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
        if(this._Display_OPButtons_Del||this._Display_OPButtons_Update||this._Display_OPButtons_View){
            this._$TableHeadElem.find("tr").append("<th style='width: 120px'>操作</th>")
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

    //region 基础相关方法
    AddEvent:function (sender) {
        var $hostElem = sender.data.hostElem;
        var selfObj = sender.data.selfObj;
        var instanceName = sender.data.instanceName;
        //debugger;
        if (!selfObj._EditInRow) {
            sender.data.selfObj.Dialog_AddEventNew(sender, $hostElem, sender.data._rendererChainParas, instanceName);
        } else {
            sender.data.selfObj.InnerRow_AddEventEdit(sender, $hostElem, sender.data._rendererChainParas, instanceName);
        }
        //console.log($hostElem);
        //alert("1");
    },
    ValidateSerializationSubFormDataEnable:function(serializationSubFormData){
        //if(serializationSubFormData.formRecordDataRelationPOList.length>1){
        //DialogUtility.AlertText("子表暂时不支持数据关联！");
        //    return false;
        //}
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
        var $tr = this._$TemplateTableRow.clone();
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
        var lastOperationTd=$("<td><div class='sflt-td-operation-outer-wrap'></div></td>");
        var lastOperationOuterDiv=lastOperationTd.find("div");
        if(this._Display_OPButtons_View) {
            var btn_operation_view = $("<div title='查看' class='sflt-td-operation-view'></div>");
            lastOperationOuterDiv.append(btn_operation_view);
            btn_operation_view.bind("click", {
                "tr_elem": $tr,
                "id": idValue,
                "record_data": oneDataRecord
            }, this.Dialog_ViewRow);
        }
        if(this._Display_OPButtons_Update) {
            var btn_operation_update=$("<div title='编辑' class='sflt-td-operation-update'></div>");
            lastOperationOuterDiv.append(btn_operation_update);
            btn_operation_view.bind("click",{
                "tr_elem": $tr,
                "id": idValue,
                "record_data": oneDataRecord
            },this.Dialog_UpdateRow);
        }
        if(this._Display_OPButtons_Del) {
            var btn_operation_del=$("<div title='删除' class='sflt-td-operation-del'></div>");
            lastOperationOuterDiv.append(btn_operation_del);
            btn_operation_view.bind("click",{
                "tr_elem": $tr,
                "id": idValue,
                "record_data": oneDataRecord
            },this.Dialog_DelRow)
        }
        $tr.append(lastOperationTd);
        this._$TableBodyElem.append($tr);
    },
    //endregion

    //region 行内编辑相关方法
    InnerRow_AddEventEdit:function (sender,$hostElem,_rendererChainParas) {
        var $tr = this._$TemplateTableRow.clone();
        this._$TableBodyElem.append($tr);
    },
    //endregion

    //region 对话框编辑相关方法
    Dialog_AddEventNew:function (sender,$hostElem,_rendererChainParas,instanceName) {
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
    Dialog_CompletedEdit:function(instanceName,operationType,serializationSubFormData){

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
    Dialog_ViewRow:function (sender) {

    },
    Dialog_UpdateRow:function (sender) {

    },
    Dialog_DelRow:function (sender) {

    }
    //endregion
}