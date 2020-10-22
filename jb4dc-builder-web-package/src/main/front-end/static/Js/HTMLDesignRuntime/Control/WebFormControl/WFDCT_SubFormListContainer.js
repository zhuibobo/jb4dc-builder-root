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
    _FormDataRelationList:null,

    RendererChain:function (_rendererChainParas) {
        //debugger;
        var $singleControlElem = _rendererChainParas.$singleControlElem;
        this._$SingleControlElem = $singleControlElem;
        this._$TableElem = this._$SingleControlElem.find("table");
        this._$TableBodyElem = this._$TableElem.find("tbody");
        this._$TableHeadElem=this._$TableElem.find("thead");

        this._EditInRow = $singleControlElem.attr("editinrow") == "false" ? false : true;

        this._FormRuntimeHost=_rendererChainParas.formRuntimeInstance;
        this._FormDataRelationList=this._FormRuntimeHost._FormDataRelationList;

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

        var instanceName = HTMLControl.GetControlInstanceNameByElem($singleControlElem);

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

        //debugger;
        var relationPO=this.TryGetRelationPOClone();
        $singleControlElem.attr("relation_po_id",relationPO.id);

        //this._FormRuntimeHost.ConnectRelationPOToDynamicContainerControl(relationPO,this);
    },
    RendererDataChain:function(_rendererDataChainParas){
        //console.log("111111111111111111111");
        //debugger;
        var $singleControlElem = _rendererDataChainParas.$singleControlElem;
        var relationFormRecordComplexPo = _rendererDataChainParas.relationFormRecordComplexPo;
        var relation_po_id=$singleControlElem.attr("relation_po_id");
        var relationPO=FormRelationPOUtility.FindRelationPOInRelationFormRecordComplexPo(relationFormRecordComplexPo,relation_po_id);
        var listDataRecord=FormRelationPOUtility.Get1ToNDataRecord(relationPO);
        for (var i = 0; i < listDataRecord.length; i++) {
            var oneDataRecord = listDataRecord[i];
            if(this._EditInRow){
                this.InnerRow_AddRowToContainer(oneDataRecord);
            }
            else {
                //console.log(relationFormRecordComplexPo);
                //if(this._HasChildRelationPO==null){
                //    this._HasChildRelationPO=FormRelationPOUtility.HasChildRelationPO(relationFormRecordComplexPo.formRecordDataRelationPOList,relation_po_id);
                //}
                //debugger;

                //处理一对多 下一级别.
                var childRelationPOArray=[];

                var subRelationPO=ArrayUtility.WhereSingle(relationFormRecordComplexPo.formRecordDataRelationPOList,function (item) {
                    return item.parentId == relation_po_id;
                });
                var cloneSubRelationPO=ArrayUtility.WhereSingle(this._FormDataRelationList,function (item) {
                    return item.parentId == relation_po_id;
                });
                if(subRelationPO){
                    var selfKeyFieldName=subRelationPO.selfKeyFieldName;
                    var outerKeyFieldName=subRelationPO.outerKeyFieldName;
                    var outerKeyFieldValue=FormRelationPOUtility.FindFieldValueInOneDataRecord(oneDataRecord,outerKeyFieldName);
                    var tempPO=JsonUtility.CloneSimple(cloneSubRelationPO);
                    var allRecordList=FormRelationPOUtility.Get1ToNDataRecord(subRelationPO);

                    var thisPOListDataRecord=[];
                    for (var j = 0; j < allRecordList.length; j++) {
                        var oneRecord=allRecordList[j];
                        var fieldPOArray=FormRelationPOUtility.FindRecordFieldPOArray(oneRecord);
                        if(ArrayUtility.True(fieldPOArray,function (fieldItem) {
                            return fieldItem.fieldName==selfKeyFieldName&&fieldItem.value==outerKeyFieldValue;
                        })) {
                            thisPOListDataRecord.push(oneRecord);
                        }
                    }
                    FormRelationPOUtility.Add1ToNDataRecord(tempPO,thisPOListDataRecord);
                    childRelationPOArray.push(tempPO);
                }

                this.Dialog_AddRowToContainer(oneDataRecord,true,relationPO.pkFieldName);
            }
        }
        this.InnerRow_CompletedLastEdit();
        //console.log(relationPO);
    },

    SerializationValue:function(originalFormDataRelation,relationPO,control){

        this.InnerRow_CompletedLastEdit();
        var allData=[];
        var all$TrAttrChildRelationPoArray=[];
        var trs=this._$SingleControlElem.find("tr[is_sub_list_tr='true']");
        var selfPO=this.TryGetRelationPOClone();
        //debugger;
        for (var i = 0; i < trs.length; i++) {
            var $tr = $(trs[i]);
            var singleRelationPO=this.GetRowData($tr);
            var tempRecord=FormRelationPOUtility.Get1To1DataRecord(singleRelationPO);
            //var idValue=FormRelationPOUtility.FindIDFieldPOInOneDataRecord(tempRecord).value;
            var idValue=FormRelationPOUtility.FindFieldPOInOneDataRecord(tempRecord,selfPO.pkFieldName).value;
            var tempSelfRecord=this.TryBuildRecord(singleRelationPO,idValue,tempRecord.recordFieldPOList);
            allData.push(tempSelfRecord);
            //console.log(singleJsonData);
            //var trChildRelationPOArray=this.GetChildRelationPOArray($tr);
            //if(trChildRelationPOArray) {
            //    all$TrAttrChildRelationPoArray = all$TrAttrChildRelationPoArray.concat(trChildRelationPOArray)
            //}
        }
        console.log(allData);
        if(!this._EditInRow){
            relationPO.isSave=false;
        }

        FormRelationPOUtility.Add1ToNDataRecord(relationPO,allData);

        //debugger;
        //尝试处理子表记录
        /*var childRelationArray=ArrayUtility.Where(originalFormDataRelation,function(item){
            return item.parentId==relationPO.id;
        });

        for (var i = 0; i < childRelationArray.length; i++) {
            var childRelationPO=childRelationArray[i];
            var inTrChildRelationPoArray=ArrayUtility.Where(all$TrAttrChildRelationPoArray,function (item) {
                return item.id==childRelationPO.id;
            });
            var allChildData=[];
            if(inTrChildRelationPoArray) {
                for (var j = 0; j < inTrChildRelationPoArray.length; j++) {
                    allChildData = allChildData.concat(inTrChildRelationPoArray[j].listDataRecord);
                }
            }
            FormRelationPOUtility.Add1ToNDataRecord(childRelationPO,allChildData);
        }*/
    },
    GetValue:function ($elem,originalData, paras) {
        DialogUtility.AlertText("DynamicContainer类型的控件的序列化交由SerializationValue方法自行完成!");
    },
    SetValue:function ($elem,relationFormRecordComplexPo,_rendererDataChainParas) {

    },
    ToViewStatus:function($elem,relationFormRecordComplexPo,_rendererDataChainParas){
        $elem.find(".sub-form-list-button-wrap").hide();
        $elem.find(".sflt-td-operation-update").hide();
        $elem.find(".sflt-td-operation-del").hide();
    },
    //region 基础相关方法
    AddEvent:function (sender) {
        var $hostElem = sender.data.hostElem;
        var selfObj = sender.data.selfObj;
        var instanceName = sender.data.instanceName;
        var rendererChainParas = sender.data._rendererChainParas;
        //debugger;
        if (selfObj._EditInRow) {
            selfObj.InnerRow_AddRowToContainer(null);
        } else {
            selfObj.Dialog_ShowAddRowSubFormDialog(sender, $hostElem, rendererChainParas, instanceName);
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

    GetRowId:function($tr) {
        var id = $tr.attr("tr_record_id");
        return id;
    },
    SetRowId:function($tr,idValue) {
        $tr.attr("tr_record_id", idValue);
    },
    GetRowData:function($tr){
        var json=$tr.attr("tr_record_data");
        return JsonUtility.StringToJson(json);
    },
    GetChildRelationPOArray:function($tr){
        var json=$tr.attr("child_relation_po_array");
        if(!StringUtility.IsNullOrEmpty(json)){
            return JsonUtility.StringToJson(json);
        }
        return null;
    },
    SaveDataToRowAttr:function (relationPO,$tr,aboutRelationPOArray) {
        $tr.attr("is_sub_list_tr","true");
        //debugger;
        //$tr.attr("tr_record_id",FormRelationPOUtility.FindIdFieldPOByRelationPO(relationPO).value);
        $tr.attr("tr_record_id",FormRelationPOUtility.FindFieldPOByRelationPO(relationPO,relationPO.pkFieldName).value);
        $tr.attr("tr_record_data",JsonUtility.JsonToString(relationPO));
        if(aboutRelationPOArray&&aboutRelationPOArray.length>0){
            $tr.attr("child_relation_po_array",JsonUtility.JsonToString(aboutRelationPOArray));
        }
    },
    TryGetChildRelationPOArrayClone:function(relationPO){
        var childRelation=ArrayUtility.Where(this._FormDataRelationList,function(item){
            return item.parentId==relationPO.id;
        });
        return JsonUtility.CloneArraySimple(childRelation);
    },
    TryGetRelationPOClone:function(){
        //debugger;
        //console.log(this._FormDataRelationList);
        if(this._po){
            return JsonUtility.CloneSimple(this._po);
        }
        var bindDataSource=this.TryGetBindDataSourceAttr();
        var po=null;
        if(bindDataSource=="autoTesting") {
            var bindTableName = this.TryGetInnerControlBindTableName();
            //po=this._FormRuntimeHost.FindRelationPOByTableName(bindTableName);
            po = FormRelationPOUtility.FindRelationPOByTableName(this._FormDataRelationList, bindTableName);
            if (po == null) {
                DialogUtility.AlertText("WFDCT_SubFormListContainer.TryGetRelationPO:通过内部控件绑定的表找不到具体的数据关联实体！");
            }
        }
        else {
            //po=this._FormRuntimeHost.FindRelationPOById(bindDataSource);
            po = FormRelationPOUtility.FindRelationPOById(this._FormDataRelationList, bindDataSource);
            if (po == null) {
                DialogUtility.AlertText("WFDCT_SubFormListContainer.TryGetRelationPO:通过ID" + bindDataSource + "找不到具体的数据关联实体！");
            }
        }
        this._po=po;
        return JsonUtility.CloneSimple(this._po);
    },
    TryGetInnerControlBindTableName:function(){
        var controls = HTMLControl.FindALLControls(this._$TemplateTableRow);
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
    TryBuildRecord:function(relationPO,recordId,fieldPOArray) {
        var outerFieldName = relationPO.outerKeyFieldName;
        var selfKeyFieldName = relationPO.selfKeyFieldName;
        var outerFieldValue = "";
        var parentRelationPO = ArrayUtility.WhereSingle(this._FormDataRelationList, function (item) {
            return item.id == relationPO.parentId;
        });
        if(StringUtility.IsNullOrEmpty(outerFieldName)){
            var errorMessage = "数据源未设置外键关联字段!";
            DialogUtility.AlertText(errorMessage);
            throw errorMessage;
        }
        if(StringUtility.IsNullOrEmpty(selfKeyFieldName)){
            var errorMessage = "数据源未设置本身关联字段!";
            DialogUtility.AlertText(errorMessage);
            throw errorMessage;
        }
        //debugger;
        if (FormRelationPOUtility.IsMainRelationPO(parentRelationPO)) {
            outerFieldValue = this._FormRuntimeHost.GetRecordId();
        } else {
            var tableId = parentRelationPO.tableId;
            var fieldValue = HTMLControl.GetSimpleControlValue(tableId, outerFieldName);
            if (StringUtility.IsNullOrEmpty(fieldValue)) {
                var errorMessage = "找不到绑定了表:" + tableId + ",字段:" + outerFieldName + "的控件,请确认页面放置了该控件,并存在值!";
                DialogUtility.AlertText(errorMessage);
                throw errorMessage;
            }
        }
        return FormRelationPOUtility.BuildRecord(fieldPOArray,"",recordId,outerFieldName,outerFieldValue,selfKeyFieldName);
    },
    //endregion

    //region 行内编辑相关方法
    _$LastEditRow:null,
    InnerRow_AddRowToContainer:function (oneDataRecord) {
        this.InnerRow_CompletedLastEdit();
        var $tr = this._$TemplateTableRow.clone();
        var lastOperationTd = $("<td><div class='sflt-td-operation-outer-wrap'></div></td>");
        var lastOperationOuterDiv = lastOperationTd.find("div");

        //region 删除按钮
        var btn_operation_del = $("<div title='删除' class='sflt-td-operation-del'></div>");
        btn_operation_del.bind("click",{
            selfObj:this,
        },function (btn_del_sender) {
            var selfObj = btn_del_sender.data.selfObj;
            selfObj.InnerRow_Delete($(this).parent().parent().parent());
        });
        lastOperationOuterDiv.append(btn_operation_del);
        //endregion

        //region 编辑按钮
        var btn_operation_update = $("<div title='编辑' class='sflt-td-operation-update'></div>");
        btn_operation_update.bind("click",{
            selfObj:this,
        },function (btn_update_sender) {
            var selfObj = btn_update_sender.data.selfObj;
            selfObj.InnerRow_ToEditStatus($(this).parent().parent().parent());
        });
        lastOperationOuterDiv.append(btn_operation_update);
        //endregion

        $tr.append(lastOperationTd);

        this._$TableBodyElem.append($tr);
        this._$LastEditRow = $tr;

        if(oneDataRecord){
            var controls = HTMLControl.FindALLControls(this._$LastEditRow);
            for (var i = 0; i < controls.length; i++) {
                var control = $(controls[i]);
                var controlInstance = HTMLControl.GetControlInstanceByElem(control);
                var fieldName = HTMLControl.GetControlBindFieldName(control);
                //debugger;
                var fieldPO = FormRelationPOUtility.FindFieldPOInOneDataRecord(oneDataRecord, fieldName)
                controlInstance.SetValue(control,fieldPO, null, null);
            }
            var idValue=FormRelationPOUtility.FindIDFieldPOInOneDataRecord(oneDataRecord).value;
            this.SetRowId($tr,idValue);
            //$tr.attr("tr_record_id",idValue);
        }
    },
    InnerRow_ToEditStatus:function($tr){
        //console.log(this._$SingleControlElem);
        this.InnerRow_CompletedLastEdit();
        var rowRelationPO=this.GetRowData($tr);
        var rowSpanControls=$tr.find("[is_inner_row_span='true']");
        for (var i = 0; i < rowSpanControls.length; i++) {
            var spanControl = $(rowSpanControls[i]);
            var controlId = spanControl.attr("edit_control_id");
            var editControl = this._$TemplateTableRow.find("#" + controlId).clone();
            var fieldName = HTMLControl.GetControlBindFieldName(editControl);
            var fieldPO = FormRelationPOUtility.FindFieldPOByRelationPO(rowRelationPO, fieldName);
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
            //var oneRowRecord = FormRuntime.Get1To1DataRecordFieldPOArray(relationPO);
            for (var i = 0; i < controls.length; i++) {
                var singleControl=$(controls[i]);
                var fieldName=HTMLControl.GetControlBindFieldName(singleControl);
                var fieldValue=FormRelationPOUtility.FindFieldPOByRelationPO(relationPO,fieldName).value;
                var txtSpan=$("<span is_inner_row_span='true' edit_control_id='"+singleControl.attr("id")+"'>"+fieldValue+"</span>");
                singleControl.before(txtSpan);
                singleControl.remove();
            }
        }
        this._$LastEditRow = null;
    },
    InnerRow_Delete:function($tr){
        this.InnerRow_CompletedLastEdit();
        $tr.remove();
    },
    InnerRow_CompletedLastEdit:function(){
        if(this._$LastEditRow){
            var controls = HTMLControl.FindALLControls(this._$LastEditRow);

            var relationPO=this.TryGetRelationPOClone();
            //console.log(relationPO);
            var recordFieldPOList = [];
            for (var i = 0; i < controls.length; i++) {
                var singleControl=$(controls[i]);
                var fieldTransferPO = HTMLControl.TryGetFieldTransferPO(singleControl, relationPO.id, relationPO.singleName, relationPO.relationType);
                recordFieldPOList.push(fieldTransferPO);
            }
            var idValue=this.GetRowId(this._$LastEditRow);
            if(!idValue){
                idValue=StringUtility.Guid();
            }
            //if(!id){
            FormRelationPOUtility.CreateIdFieldInRecordFieldPOArray(recordFieldPOList,idValue);
            //}

            //console.log(relationPO);
            var tempRecord=this.TryBuildRecord(relationPO,idValue,recordFieldPOList);
            relationPO=FormRelationPOUtility.Add1To1DataRecordFieldPOList(relationPO,recordFieldPOList,"",tempRecord.recordId,tempRecord.outerFieldName,tempRecord.outerFieldValue,tempRecord.selfFieldName);
            this.SaveDataToRowAttr(relationPO,this._$LastEditRow);
            this.InnerRow_ToViewStatus(relationPO, this._$LastEditRow);
            //console.log(recordFieldPOList);
        }
    },
    //endregion

    //region 对话框编辑相关方法
    Dialog_Get_Button_Click_Para:function ($singleControlElem) {
        //console.log(BaseUtility.GetElemAllAttr($singleControlElem));
        /*
                        "FormId": BaseUtility.GetUrlParaValue("FormId"),
                "ButtonId": BaseUtility.GetUrlParaValue("ButtonId"),
                "OperationType": BaseUtility.GetUrlParaValue("OperationType"),
                "ElemId": BaseUtility.GetUrlParaValue("ElemId"),
                "RecordId": BaseUtility.GetUrlParaValue("RecordId")
         */
        var relationPO=this.TryGetRelationPOClone();
        console.log("子表外键:"+relationPO.outerKeyFieldName);
        /*if(relationPO.outerKeyFieldName!="ID"){
            var errMessage="暂时只支持关联父记录的ID字段!";
            DialogUtility.AlertText(errMessage);
            throw errMessage;
        }*/
        var para={
            formId:$singleControlElem.attr("formid"),
            buttonId:"",
            elemId:"",
            recordId:"",
            windowHeight:$singleControlElem.attr("windowheight"),
            windowWidth:$singleControlElem.attr("windowwidth"),
            instanceName:$singleControlElem.attr("client_instance_name"),
            dialogWindowTitle:$singleControlElem.attr("dialogwindowtitle"),
            parentRecordId:this._FormRuntimeHost.GetRecordId(),
            selfKeyFieldName:relationPO.selfKeyFieldName,
            outerKeyFieldName:relationPO.outerKeyFieldName
        };
        return para;
    },
    Dialog_AddRow_AddViewButton:function (operationOuterDiv,$tr,idValue,oneDataRecord,$singleControlElem,isPreview) {
        var btn_operation_view = $("<div title='查看' class='sflt-td-operation-view'></div>");
        var dialogWindowPara=this.Dialog_Get_Button_Click_Para($singleControlElem);
        btn_operation_view.bind("click", {
            "$tr": $tr,
            "idValue": idValue,
            "oneDataRecord": oneDataRecord,
            "dialogWindowPara": dialogWindowPara,
            "isPreview":isPreview
        }, function (sender) {
            var dialogWindowPara = sender.data.dialogWindowPara;
            dialogWindowPara.OperationType="view";
            dialogWindowPara.recordId=sender.data.idValue;
            var url;
            if (isPreview) {
                url = BaseUtility.BuildView("/HTML/Builder/Form/SubFormPreview.html", dialogWindowPara);
            }
            else{
                url = BaseUtility.BuildView("/HTML/Builder/Runtime/WebFormSubRuntime.html", dialogWindowPara);
            }

            DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
                title: dialogWindowPara.dialogWindowTitle,
                width: dialogWindowPara.windowWidth,
                height: dialogWindowPara.windowHeight
            }, 1);
        });

        operationOuterDiv.append(btn_operation_view);
    },
    Dialog_AddRow_AddUpdateButton:function (operationOuterDiv,$tr,idValue,oneDataRecord,$singleControlElem,isPreview) {
        var btn_operation_view = $("<div title='编辑' class='sflt-td-operation-update'></div>");
        var dialogWindowPara=this.Dialog_Get_Button_Click_Para($singleControlElem);
        btn_operation_view.bind("click", {
            "$tr": $tr,
            "idValue": idValue,
            "oneDataRecord": oneDataRecord,
            "dialogWindowPara": dialogWindowPara,
            "isPreview":isPreview
        }, function (sender) {
            var dialogWindowPara = sender.data.dialogWindowPara;
            dialogWindowPara.operationType="update";
            dialogWindowPara.recordId=sender.data.idValue;
            var url;
            if (isPreview) {
                url = BaseUtility.BuildView("/HTML/Builder/Form/SubFormPreview.html", dialogWindowPara);
            }
            else{
                url = BaseUtility.BuildView("/HTML/Builder/Runtime/WebFormSubRuntime.html", dialogWindowPara);
            }

            DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
                title: dialogWindowPara.dialogWindowTitle,
                width: dialogWindowPara.windowWidth,
                height: dialogWindowPara.windowHeight
            }, 1);
        });

        operationOuterDiv.append(btn_operation_view);
    },
    Dialog_AddRow_AddDeleteButton:function (operationOuterDiv,$tr,idValue,oneDataRecord,$singleControlElem,isPreview) {
        var btn_operation_view = $("<div title='删除' class='sflt-td-operation-del'></div>");

        btn_operation_view.bind("click", {
            "$tr": $tr,
            "idValue": idValue,
            "oneDataRecord": oneDataRecord,
            "isPreview":isPreview
        }, function (sender) {
            sender.data.$tr.remove();
        });

        operationOuterDiv.append(btn_operation_view);
    },
    Dialog_ShowAddRowSubFormDialog:function(sender,$singleControlElem,_rendererChainParas,instanceName) {
        var dialogWindowPara=this.Dialog_Get_Button_Click_Para($singleControlElem);
        if (!dialogWindowPara.dialogWindowTitle) {
            dialogWindowPara.dialogWindowTitle = "应用构建系统";
        }

        dialogWindowPara.operationType="add";
        dialogWindowPara.recordId=StringUtility.Guid();

        var isPreview = this._FormRuntimeHost.IsPreview();
        var url;
        if (isPreview) {
            url = BaseUtility.BuildView("/HTML/Builder/Form/SubFormPreview.html", dialogWindowPara);
        }
        else{
            url = BaseUtility.BuildView("/HTML/Builder/Runtime/WebFormSubRuntime.html", dialogWindowPara);
        }

        DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
            title: dialogWindowPara.dialogWindowTitle,
            width: dialogWindowPara.windowWidth,
            height: dialogWindowPara.windowHeight
        }, 1);
    },
    Dialog_SubFormDialogCompletedEdit:function(instanceName,operationType,serializationSubFormData) {
        //对于对话框类型的编辑,子表确实时,将直接存入数据库,所以这边只要呈现.
        var thisInstance = HTMLControl.GetInstance(instanceName);
        (function (operationType, serializationSubFormData) {

            //父窗体的相关的关联设置
            //var selfRelationPO = this.TryGetRelationPOClone();
            //子窗体相关的关联设置
            var subFormMainRelationPO = FormRelationPOUtility.FindMainRelationPO(serializationSubFormData.formRecordDataRelationPOList);

            var oneDataRecord = FormRelationPOUtility.Get1To1DataRecord(subFormMainRelationPO);
            //
            this.Dialog_AddRowToContainer(oneDataRecord, false,subFormMainRelationPO.pkFieldName);

        }).call(thisInstance, operationType, serializationSubFormData)
    },
    Dialog_AddRowToContainer:function(oneDataRecord,dataIsFromServer,subTablePKFieldName){
        if(oneDataRecord) {
            var $tr = this._$TemplateTableRow.clone();
            var controls = HTMLControl.FindALLControls($tr);
            for (var i = 0; i < controls.length; i++) {
                var control = $(controls[i]);
                var controlInstance = HTMLControl.GetControlInstanceByElem(control);
                var fieldName = HTMLControl.GetControlBindFieldName(control);
                var fieldPO = FormRelationPOUtility.FindFieldPOInOneDataRecord(oneDataRecord, fieldName)
                controlInstance.SetValue(control, fieldPO, null, null);
            }
            console.log(subTablePKFieldName);
            //var idFieldPO=FormRelationPOUtility.FindIDFieldPOInOneDataRecord(oneDataRecord);
            var idFieldPO=FormRelationPOUtility.FindFieldPOInOneDataRecord(oneDataRecord,subTablePKFieldName);
            //console.log(idFieldPO);
            var lastOperationTd = $("<td><div class='sflt-td-operation-outer-wrap'></div></td>");
            var lastOperationOuterDiv = lastOperationTd.find("div");
            if(dataIsFromServer) {
                if (this._Display_OPButtons_View) {
                    this.Dialog_AddRow_AddViewButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
                }
                if (this._Display_OPButtons_Update) {
                    this.Dialog_AddRow_AddUpdateButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
                }
                if (this._Display_OPButtons_Del) {
                    this.Dialog_AddRow_AddDeleteButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
                }
            }
            else {
                this.Dialog_AddRow_AddViewButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
                this.Dialog_AddRow_AddUpdateButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
                this.Dialog_AddRow_AddDeleteButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
            }

            $tr.append(lastOperationTd);

            var idValue=idFieldPO.value;
            var $oldTrElem = this._$SingleControlElem.find("tr[tr_record_id='" + idValue + "']");
            if($oldTrElem.length==0) {
                this._$TableBodyElem.append($tr);
            }
            else{
                $oldTrElem.after($tr);
                $oldTrElem.remove();
            }

            //构建本身数据关联PO
            //debugger;
            var relationPO = this.TryGetRelationPOClone();
            relationPO = FormRelationPOUtility.Add1To1DataRecord(relationPO, oneDataRecord);

            this.SaveDataToRowAttr(relationPO, $tr);
            //console.log(childRelationPOArray);
        }
    }
    //endregion
}