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

                this.Dialog_AddRowToContainer(oneDataRecord,childRelationPOArray,true);
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
        for (var i = 0; i < trs.length; i++) {
            var $tr = $(trs[i]);
            var singleRelationPO=this.GetRowData($tr);
            allData.push(FormRelationPOUtility.Get1To1DataRecord(singleRelationPO));
            //console.log(singleJsonData);
            var trChildRelationPOArray=this.GetChildRelationPOArray($tr);
            if(trChildRelationPOArray) {
                all$TrAttrChildRelationPoArray = all$TrAttrChildRelationPoArray.concat(trChildRelationPOArray)
            }
        }
        FormRelationPOUtility.Add1ToNDataRecord(relationPO,allData);

        //debugger;
        //尝试处理子表记录
        var childRelationArray=ArrayUtility.Where(originalFormDataRelation,function(item){
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
        }
    },
    GetValue:function ($elem,originalData, paras) {
        DialogUtility.AlertText("DynamicContainer类型的控件的序列化交由SerializationValue方法自行完成!");
    },
    SetValue:function ($elem,relationFormRecordComplexPo,_rendererDataChainParas) {

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
        $tr.attr("tr_record_id",FormRelationPOUtility.FindIdFieldPOByRelationPO(relationPO).value);
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
            var oneRowRecord = [];
            for (var i = 0; i < controls.length; i++) {
                var singleControl=$(controls[i]);
                var fieldTransferPO = HTMLControl.TryGetFieldTransferPO(singleControl, relationPO.id, relationPO.singleName, relationPO.relationType);
                oneRowRecord.push(fieldTransferPO);
            }
            var idValue=this.GetRowId(this._$LastEditRow);
            //if(!id){
            FormRelationPOUtility.CreateIdFieldInOneDataRecord(oneRowRecord,idValue);
            //}

            relationPO=FormRelationPOUtility.Add1To1DataRecordFieldPOList(relationPO,oneRowRecord);
            this.SaveDataToRowAttr(relationPO,this._$LastEditRow);
            this.InnerRow_ToViewStatus(relationPO, this._$LastEditRow);
            //console.log(oneRowRecord);
        }
    },
    //endregion

    //region 对话框编辑相关方法

    Dialog_SubFormDialogCompletedEdit:function(instanceName,operationType,serializationSubFormData) {
        var thisInstance = HTMLControl.GetInstance(instanceName);
        (function (operationType, serializationSubFormData) {
            //console.log(serializationSubFormData);
            //debugger;
            //父窗体的相关的关联设置
            var selfRelationPO = this.TryGetRelationPOClone();
            var selfChildRelationPOArray = this.TryGetChildRelationPOArrayClone(selfRelationPO);

            //子窗体相关的关联设置
            var subFormMainRelationPO = FormRelationPOUtility.FindMainRelationPO(serializationSubFormData.formRecordDataRelationPOList);
            var subFormNotMainRelationPO = FormRelationPOUtility.FindNotMainRelationPO(serializationSubFormData.formRecordDataRelationPOList);

            //将子窗体的关联实体装换为主窗体的实体关联.
            var childRelationPOArray = [];
            for (var i = 0; i < selfChildRelationPOArray.length; i++) {
                var tableName = selfChildRelationPOArray[i].tableName;
                var subRelationPO = FormRelationPOUtility.FindRelationPOByTableName(subFormNotMainRelationPO, tableName);
                if (subRelationPO) {
                    subRelationPO.id = selfChildRelationPOArray[i].id;
                    subRelationPO.parentId = selfChildRelationPOArray[i].parentId;
                    childRelationPOArray.push(subRelationPO);
                }
            }

            var oneDataRecord = FormRelationPOUtility.Get1To1DataRecord(subFormMainRelationPO);

            //debugger;
            //生成从记录的外键字段
            for (var i = 0; i < childRelationPOArray.length; i++) {
                var subRelationPO=childRelationPOArray[i];
                var selfKeyFieldName=subRelationPO.selfKeyFieldName;
                var outerKeyFieldName=subRelationPO.outerKeyFieldName;
                var outerKeyFieldValue=FormRelationPOUtility.FindFieldValueInOneDataRecord(oneDataRecord,outerKeyFieldName);

                for (var j = 0; j < subRelationPO.listDataRecord.length; j++) {
                    var recordFieldPOList=FormRelationPOUtility.FindRecordFieldPOArray(subRelationPO.listDataRecord[j]);
                    FormRelationPOUtility.CreateFieldInOneDataRecord(recordFieldPOList,selfKeyFieldName,outerKeyFieldValue);
                }

            }

            this.Dialog_AddRowToContainer(oneDataRecord, childRelationPOArray, false);

        }).call(thisInstance, operationType, serializationSubFormData);
    },
    Dialog_AddRowToContainer:function(oneDataRecord,childRelationPOArray,dataIsFromServer){
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

            var idFieldPO=FormRelationPOUtility.FindFieldPOInOneDataRecordByID(oneDataRecord);
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

            this.SaveDataToRowAttr(relationPO, $tr, childRelationPOArray);
            //console.log(childRelationPOArray);
        }
    },
    Dialog_ShowAddRowSubFormDialog:function(sender,$singleControlElem,_rendererChainParas,instanceName) {
        //var formId = $hostElem.attr("formid");
        //var windowHeight = $hostElem.attr("windowheight");
        //var windowWidth = $hostElem.attr("windowwidth");
        //var dialogWindowTitle = $hostElem.attr("dialogwindowtitle");

        var dialogWindowPara=this.Dialog_Get_Button_Click_Para($singleControlElem);
        if (!dialogWindowPara.DialogWindowTitle) {
            dialogWindowPara.DialogWindowTitle = "应用构建系统";
        }

        dialogWindowPara.OperationType="add";
        dialogWindowPara.RecordId=StringUtility.Guid();

        var isPreview = this._FormRuntimeHost.IsPreview();
        var url;
        if (isPreview) {
            url = BaseUtility.BuildView("/HTML/Builder/Form/SubFormPreview.html", dialogWindowPara);
        }
        else{
            url = BaseUtility.BuildView("/HTML/Builder/Runtime/WebFormSubRuntime.html", dialogWindowPara);
        }

        DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
            title: dialogWindowPara.DialogWindowTitle,
            width: dialogWindowPara.WindowWidth,
            height: dialogWindowPara.WindowHeight
        }, 1);
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
            dialogWindowPara.RecordId=sender.data.idValue;
            var url;
            if (isPreview) {
                url = BaseUtility.BuildView("/HTML/Builder/Form/SubFormPreview.html", dialogWindowPara);
            }
            else{
                url = BaseUtility.BuildView("/HTML/Builder/Runtime/WebFormSubRuntime.html", dialogWindowPara);
            }

            DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
                title: dialogWindowPara.DialogWindowTitle,
                width: dialogWindowPara.WindowWidth,
                height: dialogWindowPara.WindowHeight
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
            dialogWindowPara.OperationType="update";
            dialogWindowPara.RecordId=sender.data.idValue;
            var url;
            if (isPreview) {
                url = BaseUtility.BuildView("/HTML/Builder/Form/SubFormPreview.html", dialogWindowPara);
            }
            else{
                url = BaseUtility.BuildView("/HTML/Builder/Runtime/WebFormSubRuntime.html", dialogWindowPara);
            }

            DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
                title: dialogWindowPara.DialogWindowTitle,
                width: dialogWindowPara.WindowWidth,
                height: dialogWindowPara.WindowHeight
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
    Dialog_Get_Button_Click_Para:function ($singleControlElem) {
        //console.log(BaseUtility.GetElemAllAttr($singleControlElem));
        var para={
            FormId:$singleControlElem.attr("formid"),
            WindowHeight:$singleControlElem.attr("windowheight"),
            WindowWidth:$singleControlElem.attr("windowwidth"),
            InstanceName:$singleControlElem.attr("client_instance_name"),
            DialogWindowTitle:$singleControlElem.attr("dialogwindowtitle")
        };
        return para;
    },
    Dialog_Get_SubForm_RecordComplexPo:function (instanceName,subFormDataRelationList,idValue) {
        var thisInstance = HTMLControl.GetInstance(instanceName);
        (function (subFormDataRelationList, idValue) {
            //console.log(subFormDataRelationList);
            //console.log(idValue);
            var $trElem = this._$SingleControlElem.find("tr[tr_record_id='" + idValue + "']");
            var tr_record_data = this.GetRowData($trElem);
            var child_relation_po_array = this.GetChildRelationPOArray($trElem);

            var mainPO = FormRelationPOUtility.FindMainRelationPO(subFormDataRelationList);
            FormRelationPOUtility.Add1To1DataRecordFieldPOList(mainPO, FormRelationPOUtility.Get1To1DataRecordFieldPOArray(tr_record_data));
            //console.log(child_relation_po_array);
            var childPOList = FormRelationPOUtility.FindNotMainRelationPO(subFormDataRelationList);

            for (var i = 0; i < childPOList.length; i++) {
                var childPO = childPOList[i];
                var tableName = childPO.tableName;
                var child_relation_po = ArrayUtility.WhereSingle(child_relation_po_array, function (item) {
                    return item.tableName == tableName;
                });
                if (child_relation_po) {
                    FormRelationPOUtility.Add1ToNDataRecord(childPO, FormRelationPOUtility.Get1ToNDataRecord(child_relation_po));
                }
            }

        }).call(thisInstance, subFormDataRelationList, idValue);
        //console.log(subFormDataRelationList);
        return {
            formRecordDataRelationPOList: subFormDataRelationList
        };
    }
    /*,
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
    }*/
    //endregion
}