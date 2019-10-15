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
    _FormRuntimeHost:null,

    RendererChain:function (_rendererChainParas) {
        var $singleControlElem = _rendererChainParas.$singleControlElem;
        this._$SingleControlElem = $singleControlElem;
        this._$TableElem = this._$SingleControlElem.find("table");
        this._$TableBodyElem = this._$TableElem.find("tbody");
        this._$TableHeadElem=this._$TableElem.find("thead");

        this._EditInRow = $singleControlElem.attr("editinrow") == "false" ? false : true;

        this._FormRuntimeHost=_rendererChainParas.formRuntimeInstance;

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
            selfObj.Dialog_Add(sender, $hostElem, sender.data._rendererChainParas, instanceName);
        } else {
            selfObj.InnerRow_Add(sender, $hostElem, sender.data._rendererChainParas, instanceName);
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
    CreateIdFieldInOneDataRecord:function(oneDataRecord,idValue){
        var idField=JsonUtility.CloneSimple(oneDataRecord[0]);
        idField.fieldName="ID";
        if(idValue){
            idField.value=idValue;
        }
        else {
            idField.value = StringUtility.Guid();
        }
        oneDataRecord.push(idField);
    },
    GetRowId:function($tr) {
        var id = $tr.attr("tr_record_id");
        return id;
    },
    SetRowId:function($tr,relationPO){
        $tr.attr("tr_record_id",FormRuntime.FindIdFieldPOByRelationPO(relationPO).value);
    },
    SetRowData:function($tr,relationPO){
        $tr.attr("tr_record_data",JsonUtility.JsonToString(relationPO));
    },
    GetRowData:function($tr){
        var json=$tr.attr("tr_record_data");
        return JsonUtility.StringToJson(json);
    },
    RendererRow:function (relationPO,$tr) {
        if (this._EditInRow) {
            this.InnerRow_ToViewStatus(relationPO, $tr);
        } else {

        }
        this.SetRowId($tr, relationPO);
        this.SetRowData($tr, relationPO);
    },
    TryGetRelationPO:function(){
        //debugger;
        var bindDataSource=this.TryGetBindDataSourceAttr();
        if(this._po){
            return JsonUtility.CloneSimple(this._po);
        }
        var po=null;
        if(bindDataSource=="autoTesting"){
            var bindTableName=this.TryGetInnerControlBindTableName();
            po=this._FormRuntimeHost.GetRelationPOByTableName(bindTableName);
            if(po==null){
                DialogUtility.AlertText("WFDCT_SubFormListContainer.TryGetRelationPO:通过内部控件绑定的表找不到具体的数据关联实体！");
            }
        }
        else {
            po=this._FormRuntimeHost.GetRelationPOById(bindDataSource);
            if(po==null){
                DialogUtility.AlertText("WFDCT_SubFormListContainer.TryGetRelationPO:通过ID"+bindDataSource+"找不到具体的数据关联实体！");
            }
        }
        this._po=po;
        return JsonUtility.CloneSimple(this._po);
    },
    TryGetInnerControlBindTableName:function(){
        var controls = HTMLControl.FindALLControls(this._$SingleControlElem);
        var tableName=null;
        controls.each(function () {
            if(!tableName) {
                tableName = HTMLControl.GetControlBindTableName($(this));
            }
            else{
                if(tableName!=HTMLControl.GetControlBindTableName($(this))){
                    DialogUtility.AlertText("子表区域中的控件绑定了多个表!");
                }
            }
        });
        return tableName;
    },
    TryGetBindDataSourceAttr:function(){
        return this._$SingleControlElem.attr("binddatasource");
    },
    //endregion

    //region 行内编辑相关方法1
    _$LastEditRow:null,
    InnerRow_Add:function (sender,$hostElem,_rendererChainParas,instanceName) {
        this.InnerRow_CompletedLastEdit();
        var $tr = this._$TemplateTableRow.clone();
        var lastOperationTd = $("<td><div class='sflt-td-operation-outer-wrap'></div></td>");
        var lastOperationOuterDiv = lastOperationTd.find("div");

        //region 删除按钮
        var btn_operation_del = $("<div title='删除' class='sflt-td-operation-del'></div>");
        btn_operation_del.bind("click",{
            hostElem:$hostElem,
            selfObj:this,
        },function (sender) {
            var $hostElem = sender.data.hostElem;
            var selfObj = sender.data.selfObj;
            selfObj.InnerRow_Delete(sender, $hostElem, $(this),$(this).parent().parent().parent());
        });
        lastOperationOuterDiv.append(btn_operation_del);
        //endregion

        //region 编辑按钮
        var btn_operation_update = $("<div title='编辑' class='sflt-td-operation-update'></div>");
        btn_operation_update.bind("click",{
            hostElem:$hostElem,
            selfObj:this,
        },function (sender) {
            var $hostElem = sender.data.hostElem;
            var selfObj = sender.data.selfObj;
            selfObj.InnerRow_ToEditStatus(sender, $hostElem, $(this),$(this).parent().parent().parent());
        });
        lastOperationOuterDiv.append(btn_operation_update);
        //endregion

        $tr.append(lastOperationTd);

        this._$TableBodyElem.append($tr);
        this._$LastEditRow = $tr;
    },
    InnerRow_ToEditStatus:function(sender,$hostElem,$elem,$tr){
        console.log(this._$SingleControlElem);
        this.InnerRow_CompletedLastEdit();
        var rowRelationPO=this.GetRowData($tr);
        var rowSpanControls=$tr.find("[is_inner_row_span='true']");
        for (var i = 0; i < rowSpanControls.length; i++) {
            var spanControl = $(rowSpanControls[i]);
            var controlId = spanControl.attr("edit_control_id");
            var editControl = this._$TemplateTableRow.find("#" + controlId).clone();
            var fieldName = HTMLControl.GetControlBindFieldName(editControl);
            var fieldPO = FormRuntime.FindFieldPOByRelationPO(rowRelationPO, fieldName);
            var editControlInstance = HTMLControl.GetControlInstanceByElem(editControl);
            //debugger;
            editControlInstance.SetValue(editControl, fieldPO, {});
            spanControl.parent().append(editControl);
            spanControl.remove();
        }
        this._$LastEditRow=$tr;
        //$tr.replaceWith(this._$TemplateTableRow);
    },
    InnerRow_ToViewStatus:function(relationPO,$tr) {
        if(this._$LastEditRow){
            var controls = HTMLControl.FindALLControls(this._$LastEditRow);
            var oneRowRecord = FormRuntime.Get1To1DataRecord(relationPO);
            for (var i = 0; i < controls.length; i++) {
                var singleControl=$(controls[i]);
                var fieldName=HTMLControl.GetControlBindFieldName(singleControl);
                var fieldValue=FormRuntime.FindFieldPOByRelationPO(relationPO,fieldName).value;
                var txtSpan=$("<span is_inner_row_span='true' edit_control_id='"+singleControl.attr("id")+"'>"+fieldValue+"</span>");
                singleControl.before(txtSpan);
                singleControl.remove();
            }
        }
        this._$LastEditRow = null;
    },
    InnerRow_Delete:function(sender,$hostElem,$elem,$tr){
        this.InnerRow_CompletedLastEdit();
        $tr.remove();
    },
    InnerRow_CompletedLastEdit:function(){
        if(this._$LastEditRow){
            var controls = HTMLControl.FindALLControls(this._$LastEditRow);

            var relationPO=this.TryGetRelationPO();
            console.log(relationPO);
            var oneRowRecord = [];
            for (var i = 0; i < controls.length; i++) {
                var singleControl=$(controls[i]);
                var fieldTransferPO = HTMLControl.TryGetFieldTransferPO(singleControl, relationPO.id, relationPO.singleName, relationPO.relationType);
                oneRowRecord.push(fieldTransferPO);
            }
            var idValue=this.GetRowId(this._$LastEditRow);
            //if(!id){
                this.CreateIdFieldInOneDataRecord(oneRowRecord,idValue);
            //}

            relationPO=FormRuntime.Set1To1DataRecord(relationPO,oneRowRecord);
            this.RendererRow(relationPO,this._$LastEditRow);
            console.log(oneRowRecord);
        }
    },
    //endregion

    //region 对话框编辑相关方法
    Dialog_Add:function (sender,$hostElem,_rendererChainParas,instanceName) {
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
            this.UpdateRow(oneDataRecord);

        }
    },
    Dialog_ViewRow:function (sender) {

    },
    Dialog_UpdateRow:function (sender) {

    },
    Dialog_DelRow:function (sender) {

    },
    Dialog_UpdateRow:function () {
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
    }
    //endregion
}