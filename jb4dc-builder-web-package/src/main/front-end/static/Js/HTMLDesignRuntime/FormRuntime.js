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

            if(typeof(this._Prop_Config.RendererChainCompletedFunc)=="function") {
                this._Prop_Config.RendererChainCompletedFunc.call(this);
            }
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
                            "value": "测试1",
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
                            "value": "2019-12-11",
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
                            "fieldDataLength": "50",
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
                            "value": "10001",
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
                                "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                "relationSingleName": "",
                                "relationType": "1To1",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_698035082",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "1",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                "relationSingleName": "",
                                "relationType": "1To1",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_698060281",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD",
                                "value": "2019-10-27",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                "relationSingleName": "",
                                "relationType": "1To1",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_698035082",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "ccadc3fe-fb6f-bbf1-d14c-79adf2f22435",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                "relationSingleName": "",
                                "relationType": "1To1",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_698035082",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "2",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                "relationSingleName": "",
                                "relationType": "1To1",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_698060281",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD",
                                "value": "2019-10-27",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                "relationSingleName": "",
                                "relationType": "1To1",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_698035082",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "f07723c5-c5c7-f97a-9cec-f6ba148370b6",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                "relationSingleName": "",
                                "relationType": "1To1",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_698035082",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "3",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                "relationSingleName": "",
                                "relationType": "1To1",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_698060281",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD",
                                "value": "2019-10-27",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                "relationSingleName": "",
                                "relationType": "1To1",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_2",
                                "tableCaption": "开发测试表2",
                                "tableId": "TDEV_TEST_2",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_698035082",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "15967107-e2d2-2323-d45f-18a71451656b",
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
                    "listDataRecord": [
                        [
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "1",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_768729317",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-27 16:45:00",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "864cb2f6-b53b-877b-eae9-3d5064b89155",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "TDEV_TEST_2_ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "ccadc3fe-fb6f-bbf1-d14c-79adf2f22435",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "11",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_768729317",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-27 16:45:00",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "6964cd1b-4657-8fea-0f75-1e9a386721d7",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "TDEV_TEST_2_ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "ccadc3fe-fb6f-bbf1-d14c-79adf2f22435",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "111",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_768729317",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-27 16:45:00",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "6d251d38-96a0-2e8e-7032-40a21be27498",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "TDEV_TEST_2_ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "ccadc3fe-fb6f-bbf1-d14c-79adf2f22435",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "2",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_768729317",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-27 16:45:14",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "8cb13f36-2475-5545-ba55-cdc9c147c6be",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "TDEV_TEST_2_ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "f07723c5-c5c7-f97a-9cec-f6ba148370b6",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "22",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_768729317",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-27 16:45:14",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "14b031dd-cba1-a88f-ed41-04d4c3e555f8",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "TDEV_TEST_2_ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "f07723c5-c5c7-f97a-9cec-f6ba148370b6",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "222",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_768729317",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-27 16:45:14",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "248570f1-439e-bfe1-af8c-335345b75a00",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "TDEV_TEST_2_ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "f07723c5-c5c7-f97a-9cec-f6ba148370b6",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "3",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_768729317",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-27 16:45:26",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "07e82204-5010-d2a7-b89b-04671bc466c4",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "TDEV_TEST_2_ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "15967107-e2d2-2323-d45f-18a71451656b",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "33",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_768729317",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-27 16:45:26",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "2e2090eb-5dfb-2f9b-fe1f-161a1e3bc5cc",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "TDEV_TEST_2_ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "15967107-e2d2-2323-d45f-18a71451656b",
                                "success": true,
                                "msg": ""
                            }
                        ],
                        [
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "333",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "日期时间",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_768729317",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                "value": "2019-10-27 16:45:26",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "7d9623a9-1984-0701-fa58-20dd29affe51",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                "relationSingleName": "",
                                "relationType": "1ToN",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_5",
                                "tableCaption": "TDEV_TEST_5",
                                "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                "fieldTableId": "",
                                "fieldName": "TDEV_TEST_2_ID",
                                "fieldDataType": "字符串",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_768659685",
                                "defaultType": "Const",
                                "defaultValue": "1",
                                "value": "15967107-e2d2-2323-d45f-18a71451656b",
                                "success": true,
                                "msg": ""
                            }
                        ]
                    ],
                    "isMain": false
                }
            ],
            "exData": null
        }
    }
}