let FormRuntime={
    OperationAdd:"add",
    OperationUpdate:"update",
    OperationView:"view",
    OperationDel:"del",
    _Prop_Status:"Edit",
    _Prop_Config:{
        RendererToId:null,
        FormId:"",
        RecordId:"",
        ButtonId:"",
        IsPreview:false,
        OperationType:""
    },
    _$RendererToElem:null,
    _FormPO:null,
    _FormDataRelationList:null,
    _RelationPOWithDynamicContainerControl:{},
    Initialization:function (_config) {
        this._Prop_Config= $.extend(true,{},this._Prop_Config,_config);
        this._$RendererToElem=$("#"+this._Prop_Config.RendererToId);
        this._LoadHTMLToEl();
    },
    //用于控制BuilderListPageRuntimeInstance.RendererChainComplete的调用时间
    _RendererChainIsCompleted:true,
    _RendererDataChainIsCompleted:true,
    _LoadHTMLToEl:function () {
        //debugger;
        /*$(this._Prop_Config.RendererTo).loadHtmlDesignContent(BaseUtility.GetRootPath()+"/Rest/Builder/FormRuntime/FormPreview?formId="+this._Prop_Config.FormId, function() {
            //alert( "Load was performed." );
            console.log("加载预览窗体成功!!");
        });*/
        var url = BaseUtility.GetRootPath() + "/Rest/Builder/RunTime/FormRuntime/LoadHTML";
        if (this._Prop_Config.IsPreview) {
            url = BaseUtility.GetRootPath() + "/Rest/Builder/RunTime/FormRuntime/LoadHTMLForPreView";
        }

        RuntimeGeneralInstance.LoadHtmlDesignContent(url, this._Prop_Config.RendererTo, {
            formId: this._Prop_Config.FormId,
            recordId: this._Prop_Config.RecordId,
            buttonId: this._Prop_Config.ButtonId
        }, function (result) {
            //alert( "Load was performed.");
            //console.log("加载预览窗体成功!!");
            //console.log(result);
            //console.log(result.data.formHtmlRuntime);
            //var $rootElem=$(result.data.formHtmlRuntime);
            //if($rootElem.)
            //console.log(result);
            this._FormPO=result.data;
            this._FormDataRelationList=JsonUtility.StringToJson(this._FormPO.formDataRelation);

            this._$RendererToElem.append(result.data.formHtmlRuntime);

            VirtualBodyControl.RendererChain({
                po:result.data,
                sourceHTML:result.data.formHtmlRuntime,
                $rootElem: this._$RendererToElem,
                $parentControlElem: this._$RendererToElem,
                $singleControlElem: this._$RendererToElem,
                formRuntimeInstance: this
            });

            //var relationFormRecordComplexPo=FormRuntimeMock.GetMockData();
            //this.DeSerializationFormData(relationFormRecordComplexPo);

        }, this);
    },
    IsPreview: function () {
        return this._Prop_Config.IsPreview
    },
    GetOriginalFormDataRelation:function() {
        return JsonUtility.StringToJson(this._FormPO.formDataRelation);
    },
    GetOperationType:function(){
        return this._Prop_Config.OperationType;
    },
    IsAddOperation:function(){
        return this.GetOperationType()==this.OperationAdd;
    },
    IsUpdateOperation:function(){
        return this.GetOperationType()==this.OperationUpdate;
    },
    IsViewOperation:function(){
        return this.GetOperationType()==this.OperationView;
    },
    SerializationFormData:function () {
        var formRecordComplexPo = {
            id: this._Prop_Config.RecordId,
            formId: this._Prop_Config.FormId,
            buttonId: this._Prop_Config.ButtonId,
            formRecordDataRelationPOList: null,
            exData: null
        };

        var originalFormDataRelation = this.GetOriginalFormDataRelation();
        //console.log(originalFormDataRelation);

        for (var i = 0; i < originalFormDataRelation.length; i++) {
            var singleRelation = originalFormDataRelation[i];
            var relationSingleName = singleRelation.singleName;
            var tableName = singleRelation.tableName;
            var isMain = (singleRelation.parentId == "-1");
            singleRelation.isMain = isMain;
            if (isMain) {
                singleRelation.relationType = "1To1";
            }
            var relationType = singleRelation.relationType;

            if (relationType == "1To1") {
                //获取不在动态DynamicContainer中的并且绑定到了当前表的控件
                var controls = $("[tablename='" + tableName + "'][serialize='true']").not($("[control_category='DynamicContainer']").find("[jbuild4dc_custom='true']"));
                var oneRowRecord = [];
                for (var j = 0; j < controls.length; j++) {
                    var $controlElem = $(controls[j]);
                    //var controlInstance = HTMLControl.GetControlInstanceByElem($controlElem);
                    //console.log($controlElem.attr("singlename") + "||" + controlInstance);
                    /*var originalData = {
                        relationId: singleRelation.id,
                        relationSingleName: singleName,
                        relationType: relationType,
                        singleName: $controlElem.attr("singlename"),
                        tableName: $controlElem.attr("tablename"),
                        tableCaption: $controlElem.attr("tablecaption"),
                        tableId: $controlElem.attr("tableid"),
                        fieldTableId: $controlElem.attr("tableid"),
                        fieldName: $controlElem.attr("fieldname"),
                        fieldDataType: $controlElem.attr("fielddatatype"),
                        fieldDataLength: $controlElem.attr("fieldlength"),
                        serialize: $controlElem.attr("serialize"),
                        id: $controlElem.attr("id"),
                        defaulttype: $controlElem.attr("defaulttype"),
                        defaultvalue: $controlElem.attr("defaultvalue"),
                        value: "",
                        success: true,
                        msg: ""
                    };*/
                    /*var props=HTMLControl.GetControlProp($controlElem);
                    var originalData=HTMLControl.BuildSerializationOriginalData(props,singleRelation.id,relationSingleName,relationType);
                    if (BaseUtility.IsFunction(controlInstance.GetValue)) {
                        var controlResultValue = controlInstance.GetValue($controlElem, originalData, {});
                        if (controlResultValue.success) {
                            oneRowRecord.push(controlResultValue);
                        } else {

                        }
                    } else {
                        DialogUtility.AlertText("控件:" + $controlElem.attr("singlename") + "未包含GetValue的方法!");
                    }*/
                    var fieldTransferPO = HTMLControl.TryGetFieldTransferPO($controlElem, singleRelation.id, relationSingleName, relationType);
                    oneRowRecord.push(fieldTransferPO);
                }
                //allRowRecord.push(oneRowRecord);
                //singleRelation.oneDataRecord = oneRowRecord;
                FormRelationPOUtility.Add1To1DataRecord(singleRelation,oneRowRecord);
            } else {
                //var relationPOId=singleRelation.id;
                //var dynamicContainerControlInstance=this._RelationPOWithDynamicContainerControl[relationPOId];
                //var dynamicContainerControlInstance.Get
                //debugger;
                var control = $("[serialize='true'][control_category='DynamicContainer'][relation_po_id='"+singleRelation.id+"']");
                if(control.length>0) {
                    var controlInstance = HTMLControl.GetControlInstanceByElem(control);
                    //debugger;
                    controlInstance.SerializationValue(originalFormDataRelation,singleRelation,control);
                }
            }
            //singleRelation.dataRecordList=allRowRecord;
        }
        formRecordComplexPo.formRecordDataRelationPOList = originalFormDataRelation;
        //console.log(formRecordComplexPo);
        //console.log(JsonUtility.JsonToString(formRecordComplexPo))
        //console.log(JsonUtility.JsonToString(formRecordComplexPo))
        return formRecordComplexPo;
    },
    DeSerializationFormData:function (relationFormRecordComplexPo) {
        //绑定数据并进行二次渲染绑定数据。
        VirtualBodyControl.RendererDataChain({
            $rootElem: this._$RendererToElem,
            $parentControlElem: this._$RendererToElem,
            $singleControlElem: this._$RendererToElem,
            formRuntimeInstance: this,
            relationFormRecordComplexPo:relationFormRecordComplexPo
        });
    }
    /*FindRelationPOById:function (id) {
        return ArrayUtility.WhereSingle(this._FormDataRelationList,function (po) {
            return po.id==id;
        })
    },
    FindRelationPOByTableName:function (tableName) {
        return ArrayUtility.WhereSingle(this._FormDataRelationList,function (po) {
            return po.tableName==tableName;
        })
    },
    FindRelationPOBySingleName:function (singleName) {
        return ArrayUtility.WhereSingle(this._FormDataRelationList,function (po) {
            return po.singleName==singleName;
        })
    }*/
}

let FormRuntimeMock={
    GetMockData:function () {
        return {
            "id": "",
            "formId": "34db0d6f-7978-4acf-8a45-13a6ee5f63e2",
            "buttonId": "",
            "formRecordDataRelationPOList": [
                {
                    "id": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
                    "parentId": "-1",
                    "singleName": "",
                    "pkFieldName": "",
                    "desc": "",
                    "selfKeyFieldName": "",
                    "outerKeyFieldName": "",
                    "relationType": "1To1",
                    "isSave": "true",
                    "condition": "",
                    "tableId": "TDEV_TEST_1",
                    "tableName": "TDEV_TEST_1",
                    "tableCaption": "开发测试表1",
                    "tableCode": "T_10437",
                    "displayText": "TDEV_TEST_1[开发测试表1]",
                    "icon": "../../../Themes/Png16X16/table.png",
                    "isMain": true,
                    "oneDataRecord": [
                        {
                            "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
                            "relationSingleName": "",
                            "relationType": "1To1",
                            "singleName": "WFDCT_TextBox",
                            "tableName": "TDEV_TEST_1",
                            "tableCaption": "开发测试表1",
                            "tableId": "TDEV_TEST_1",
                            "fieldTableId": "",
                            "fieldName": "F_TITLE",
                            "fieldDataType": "字符串",
                            "fieldDataLength": "200",
                            "serialize": "true",
                            "id": "txt_897949295",
                            "defaultType": "Const",
                            "defaultValue": "测试",
                            "value": "测试",
                            "success": true,
                            "msg": ""
                        },
                        {
                            "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
                            "relationSingleName": "",
                            "relationType": "1To1",
                            "singleName": "WFDCT_TextDateTime",
                            "tableName": "TDEV_TEST_1",
                            "tableCaption": "开发测试表1",
                            "tableId": "TDEV_TEST_1",
                            "fieldTableId": "",
                            "fieldName": "F_PUBLIC_TIME",
                            "fieldDataType": "日期时间",
                            "fieldDataLength": "20",
                            "serialize": "true",
                            "id": "txt_dt_375186891",
                            "defaultType": "EnvVar",
                            "defaultValue": "ENV_DATETIME_YYYY_MM_DD",
                            "value": "2019-11-16",
                            "success": true,
                            "msg": ""
                        },
                        {
                            "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
                            "relationSingleName": "",
                            "relationType": "1To1",
                            "singleName": "WFDCT_DropDownSelect",
                            "tableName": "TDEV_TEST_1",
                            "tableCaption": "开发测试表1",
                            "tableId": "TDEV_TEST_1",
                            "fieldTableId": "",
                            "fieldName": "F_PUBLIC_STATUS",
                            "fieldDataType": "字符串",
                            "fieldDataLength": "20",
                            "serialize": "true",
                            "id": "sel_246410688",
                            "defaultType": "",
                            "defaultValue": "",
                            "value": "4",
                            "success": true,
                            "msg": ""
                        },
                        {
                            "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
                            "relationSingleName": "",
                            "relationType": "1To1",
                            "singleName": "WFDCT_TextBox",
                            "tableName": "TDEV_TEST_1",
                            "tableCaption": "开发测试表1",
                            "tableId": "TDEV_TEST_1",
                            "fieldTableId": "",
                            "fieldName": "F_ORGAN_ID",
                            "fieldDataType": "字符串",
                            "fieldDataLength": "50",
                            "serialize": "true",
                            "id": "txt_897909755",
                            "defaultType": "EnvVar",
                            "defaultValue": "ENV_SYSTEM_CURRENT_USER_ORGAN_ID",
                            "value": "11111",
                            "success": true,
                            "msg": ""
                        }
                    ]
                },
                {
                    "id": "2d7def75-1438-7614-af7d-60ce0650eba6",
                    "parentId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
                    "singleName": "",
                    "pkFieldName": "",
                    "desc": "",
                    "selfKeyFieldName": "",
                    "outerKeyFieldName": "",
                    "relationType": "1ToN",
                    "isSave": "true",
                    "condition": "",
                    "tableId": "TDEV_TEST_2",
                    "tableName": "TDEV_TEST_2",
                    "tableCaption": "开发测试表2",
                    "tableCode": "T_10438",
                    "displayText": "TDEV_TEST_2[开发测试表2](1ToN)",
                    "icon": "../../../Themes/Png16X16/table.png",
                    "isMain": false,
                    "listDataRecord": [
                        [
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "测试1",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_871007926",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-16 16:30:31",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "2e60db0c-a0df-15f2-ea4c-6b01ec8dbd1f",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "测试2",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_871007926",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-16 16:30:31",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "acc5abe5-cad5-5efe-0f22-ab31d0a9e8c7",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "测试3",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_871007926",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-16 16:30:31",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "1438a63e-c83a-ad1c-add8-dd3fd0cf0c43",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "测试4",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_871007926",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-16 16:30:31",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "294add15-0c63-ca50-39ee-be490b879706",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "测试5",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_871007926",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-16 16:30:31",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "24573440-80f4-a539-578b-232ce53acaf6",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "测试6",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_871007926",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-16 16:30:31",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "cae8ea8d-b3b7-3d53-6621-9ccf59d38ef8",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "测试7",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_871007926",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-16 16:30:31",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "1cc27ceb-f9a9-4f2b-5525-79eaf550d99d",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "测试8",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_871007926",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-16 16:30:31",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "cb2ec29b-4480-a70e-6414-7e158bc758ac",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "测试9",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_871007926",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-16 16:30:31",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "f4beaaf3-6318-48cc-e476-f3877f774682",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "测试10",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_871007926",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-16 16:30:31",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_870999084",
                                "defaultType": "Const",
                                "defaultValue": "测试",
                                "value": "9402c909-a3a6-e509-6266-0414d3f09fcd",
                                "success": true,
                                "msg": ""
                            }
                        ]
                    ]
                },
                {
                    "id": "4313366b-caa0-4272-2690-1237750651f6",
                    "parentId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                    "singleName": "",
                    "pkFieldName": "",
                    "desc": "",
                    "selfKeyFieldName": "TDEV_TEST_2_ID",
                    "outerKeyFieldName": "ID",
                    "relationType": "1ToN",
                    "isSave": "true",
                    "condition": "",
                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                    "tableName": "TDEV_TEST_5",
                    "tableCaption": "TDEV_TEST_5",
                    "tableCode": "T_10871",
                    "displayText": "TDEV_TEST_5[TDEV_TEST_5](1ToN)",
                    "icon": "../../../Themes/Png16X16/table.png",
                    "isMain": false
                }
            ],
            "exData": null
        }
    }
}