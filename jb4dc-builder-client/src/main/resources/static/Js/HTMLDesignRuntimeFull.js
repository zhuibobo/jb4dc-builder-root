"use strict";

var DataSetRuntime = {
  GetDataSetData: function GetDataSetData(config, func, sender) {
    var sendData = JSON.stringify(config);
    AjaxUtility.PostRequestBody("/Rest/Builder/RunTime/DataSetRuntime/GetDataSetData", sendData, function (getDataSetResult) {
      func.call(sender, getDataSetResult);
    }, sender);
  }
};
"use strict";

var FormRelationPOUtility = {
  _FieldPOCache: null,
  BuildRecord: function BuildRecord(fieldPOArray, desc) {
    return {
      "desc": desc,
      "recordFieldPOList": fieldPOArray
    };
  },
  FindRecordFieldPOArray: function FindRecordFieldPOArray(record) {
    return record.recordFieldPOList;
  },
  Add1To1DataRecordFieldPOList: function Add1To1DataRecordFieldPOList(relationPO, fieldPOList) {
    relationPO.oneDataRecord = this.BuildRecord(fieldPOList, "一对一数据");
    return relationPO;
  },
  Add1To1DataRecord: function Add1To1DataRecord(relationPO, recordPO) {
    relationPO.oneDataRecord = recordPO;
    return relationPO;
  },
  Get1To1DataRecord: function Get1To1DataRecord(relationPO) {
    return relationPO.oneDataRecord;
  },
  Get1To1DataRecordFieldPOArray: function Get1To1DataRecordFieldPOArray(relationPO) {
    if (relationPO.oneDataRecord) {
      return this.FindRecordFieldPOArray(relationPO.oneDataRecord);
    }

    return null;
  },
  Add1ToNDataRecord: function Add1ToNDataRecord(relationPO, arrayData) {
    relationPO.listDataRecord = arrayData;
    return relationPO;
  },
  Get1ToNDataRecord: function Get1ToNDataRecord(relationPO) {
    return relationPO.listDataRecord;
  },
  FindFieldPOInOneDataRecord: function FindFieldPOInOneDataRecord(oneDataRecord, fieldName) {
    var fieldPOArray = this.FindRecordFieldPOArray(oneDataRecord);
    var fieldPO = ArrayUtility.WhereSingle(fieldPOArray, function (item) {
      return item.fieldName == fieldName;
    });

    if (fieldPO) {
      return fieldPO;
    }

    throw "FormRuntime.FindFieldPOInOneDataRecord:找不到字段" + fieldName + "的数据值!";
  },
  FindFieldValueInOneDataRecord: function FindFieldValueInOneDataRecord(oneDataRecord, fieldName) {
    var recordFieldPOList = this.FindRecordFieldPOArray(oneDataRecord);
    var fieldPO = ArrayUtility.WhereSingle(recordFieldPOList, function (item) {
      return item.fieldName == fieldName;
    });

    if (fieldPO) {
      return fieldPO.value;
    }

    throw "FormRuntime.FindFieldPOByRelationPO:找不到字段" + fieldName + "的数据值!";
  },
  FindFieldPOInOneDataRecordByID: function FindFieldPOInOneDataRecordByID(oneDataRecord) {
    return this.FindFieldPOInOneDataRecord(oneDataRecord, "ID");
  },
  FindFieldPOByRelationPO: function FindFieldPOByRelationPO(relationPO, fieldName) {
    var recordFieldPOList = FormRelationPOUtility.Get1To1DataRecordFieldPOArray(relationPO);
    var fieldPO = ArrayUtility.WhereSingle(recordFieldPOList, function (item) {
      return item.fieldName == fieldName;
    });

    if (fieldPO) {
      return fieldPO;
    }

    throw "FormRuntime.FindFieldPOByRelationPO:找不到字段" + fieldName + "的数据值!";
  },
  FindIdFieldPOByRelationPO: function FindIdFieldPOByRelationPO(relationPO) {
    return this.FindFieldPOByRelationPO(relationPO, "ID");
  },
  FindMainRelationPO: function FindMainRelationPO(relationPOList) {
    return ArrayUtility.WhereSingle(relationPOList, function (item) {
      return item.isMain == true || item.parentId == "-1";
    });
  },
  FindNotMainRelationPO: function FindNotMainRelationPO(relationPOList) {
    return ArrayUtility.Where(relationPOList, function (item) {
      return item.isMain != true || item.parentId != "-1";
    });
  },
  FindRelationPOById: function FindRelationPOById(relationPOList, id) {
    return ArrayUtility.WhereSingle(relationPOList, function (po) {
      return po.id == id;
    });
  },
  FindRelationPOByTableName: function FindRelationPOByTableName(relationPOList, tableName) {
    return ArrayUtility.WhereSingle(relationPOList, function (po) {
      return po.tableName == tableName;
    });
  },
  FindRelationPOBySingleName: function FindRelationPOBySingleName(relationPOList, singleName) {
    return ArrayUtility.WhereSingle(relationPOList, function (po) {
      return po.singleName == singleName;
    });
  },
  FindFieldPOInRelationFormRecordComplexPoOneDataRecord: function FindFieldPOInRelationFormRecordComplexPoOneDataRecord(relationFormRecordComplexPo, relationId, tableName, fieldName) {
    if (this._FieldPOCache == null) {
      this._FieldPOCache = {};
      var formRecordDataRelationPOList = relationFormRecordComplexPo.formRecordDataRelationPOList;

      for (var i = 0; i < formRecordDataRelationPOList.length; i++) {
        var formRecordDataRelationPO = formRecordDataRelationPOList[i];
        var innerRelationId = formRecordDataRelationPO.id;
        var fieldPOList = this.Get1To1DataRecordFieldPOArray(formRecordDataRelationPO);

        if (fieldPOList) {
          for (var j = 0; j < fieldPOList.length; j++) {
            var fieldPO = fieldPOList[j];
            var innerFieldName = fieldPO.fieldName;
            this._FieldPOCache[innerRelationId + "_" + innerFieldName] = fieldPO;
          }
        }
      }
    }

    return this._FieldPOCache[relationId + "_" + fieldName];
  },
  FindRelationPOInRelationFormRecordComplexPo: function FindRelationPOInRelationFormRecordComplexPo(relationFormRecordComplexPo, relationId) {
    return ArrayUtility.WhereSingle(relationFormRecordComplexPo.formRecordDataRelationPOList, function (item) {
      return item.id == relationId;
    });
  },
  FindChildRelationPOList: function FindChildRelationPOList(relationPOList, parentRelationPO) {
    return ArrayUtility.Where(relationPOList, function (item) {
      return item.parentId = parentRelationPO.id;
    });
  },
  HasChildRelationPO: function HasChildRelationPO(relationPOList, parentPOId) {
    return ArrayUtility.Exist(relationPOList, function (item) {
      return item.parentId == parentPOId;
    });
  },
  CreateFieldInOneDataRecord: function CreateFieldInOneDataRecord(recordFieldPOArray, fieldName, fieldValue) {
    var fieldPO = JsonUtility.CloneSimple(recordFieldPOArray[0]);
    fieldPO.fieldName = fieldName;
    fieldPO.value = fieldValue;
    recordFieldPOArray.push(fieldPO);
  },
  CreateIdFieldInOneDataRecord: function CreateIdFieldInOneDataRecord(recordFieldPOArray, idValue) {
    if (!idValue) {
      idValue = StringUtility.Guid();
    }

    this.CreateFieldInOneDataRecord(recordFieldPOArray, "ID", idValue);
  }
};
"use strict";

var FormRuntime = {
  OperationAdd: "add",
  OperationUpdate: "update",
  OperationView: "view",
  OperationDel: "del",
  _Prop_Status: "Edit",
  _Prop_Config: {
    RendererToId: null,
    FormId: "",
    RecordId: "",
    ButtonId: "",
    IsPreview: false,
    OperationType: ""
  },
  _$RendererToElem: null,
  _FormPO: null,
  _FormDataRelationList: null,
  _RelationPOWithDynamicContainerControl: {},
  Initialization: function Initialization(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);
    this._$RendererToElem = $("#" + this._Prop_Config.RendererToId);

    this._LoadHTMLToEl();
  },
  _RendererChainIsCompleted: true,
  _RendererDataChainIsCompleted: true,
  _LoadHTMLToEl: function _LoadHTMLToEl() {
    var url = BaseUtility.BuildAction("/Rest/Builder/RunTime/FormRuntime/LoadHTML", {});

    if (this._Prop_Config.IsPreview) {
      url = BaseUtility.BuildAction("/Rest/Builder/RunTime/FormRuntime/LoadHTMLForPreView", {});
    }

    RuntimeGeneralInstance.LoadHtmlDesignContent(url, this._Prop_Config.RendererTo, {
      formId: this._Prop_Config.FormId,
      recordId: this._Prop_Config.RecordId,
      buttonId: this._Prop_Config.ButtonId
    }, function (result) {
      this._FormPO = result.data;
      this._FormDataRelationList = JsonUtility.StringToJson(this._FormPO.formDataRelation);

      this._$RendererToElem.append(result.data.formHtmlRuntime);

      VirtualBodyControl.RendererChain({
        po: result.data,
        sourceHTML: result.data.formHtmlRuntime,
        $rootElem: this._$RendererToElem,
        $parentControlElem: this._$RendererToElem,
        $singleControlElem: this._$RendererToElem,
        formRuntimeInstance: this
      });

      if (this.IsPreview()) {
        this.CallRendererChainCompletedFunc();
      } else {
        RuntimeGeneralInstance.LoadInnerFormButton(this._Prop_Config.ButtonId, {}, function (result) {
          console.log(result);

          if (result.data) {
            this.CreateALLInnerFormButton(result.data);
          }

          this.CallRendererChainCompletedFunc();
        }, this);
      }
    }, this);
  },
  CallRendererChainCompletedFunc: function CallRendererChainCompletedFunc() {
    if (typeof this._Prop_Config.RendererChainCompletedFunc == "function") {
      this._Prop_Config.RendererChainCompletedFunc.call(this);
    }
  },
  IsPreview: function IsPreview() {
    return this._Prop_Config.IsPreview;
  },
  GetOriginalFormDataRelation: function GetOriginalFormDataRelation() {
    return JsonUtility.StringToJson(this._FormPO.formDataRelation);
  },
  SerializationFormData: function SerializationFormData() {
    var formRecordComplexPo = {
      recordId: this._Prop_Config.RecordId,
      formId: this._Prop_Config.FormId,
      buttonId: this._Prop_Config.ButtonId,
      formRecordDataRelationPOList: null,
      exData: null
    };
    var originalFormDataRelation = this.GetOriginalFormDataRelation();

    for (var i = 0; i < originalFormDataRelation.length; i++) {
      var singleRelation = originalFormDataRelation[i];
      var relationSingleName = singleRelation.singleName;
      var tableName = singleRelation.tableName;
      var isMain = singleRelation.parentId == "-1";
      singleRelation.isMain = isMain;

      if (isMain) {
        singleRelation.relationType = "1To1";
      }

      var relationType = singleRelation.relationType;

      if (relationType == "1To1") {
        var controls = $("[tablename='" + tableName + "'][serialize='true']").not($("[control_category='DynamicContainer']").find("[jbuild4dc_custom='true']"));
        var oneRowRecord = [];

        for (var j = 0; j < controls.length; j++) {
          var $controlElem = $(controls[j]);
          var fieldTransferPO = HTMLControl.TryGetFieldTransferPO($controlElem, singleRelation.id, relationSingleName, relationType);
          oneRowRecord.push(fieldTransferPO);
        }

        if (isMain) {
          FormRelationPOUtility.CreateIdFieldInOneDataRecord(oneRowRecord, formRecordComplexPo.recordId);
        }

        FormRelationPOUtility.Add1To1DataRecordFieldPOList(singleRelation, oneRowRecord);
      } else {
        var control = $("[serialize='true'][control_category='DynamicContainer'][relation_po_id='" + singleRelation.id + "']");

        if (control.length > 0) {
          var controlInstance = HTMLControl.GetControlInstanceByElem(control);
          controlInstance.SerializationValue(originalFormDataRelation, singleRelation, control);
        }
      }
    }

    formRecordComplexPo.formRecordDataRelationPOList = originalFormDataRelation;
    return formRecordComplexPo;
  },
  DeSerializationFormData: function DeSerializationFormData(relationFormRecordComplexPo) {
    VirtualBodyControl.RendererDataChain({
      $rootElem: this._$RendererToElem,
      $parentControlElem: this._$RendererToElem,
      $singleControlElem: this._$RendererToElem,
      formRuntimeInstance: this,
      relationFormRecordComplexPo: relationFormRecordComplexPo
    });
  },
  CreateALLInnerFormButton: function CreateALLInnerFormButton(listButtonPO) {
    if (!StringUtility.IsNullOrEmpty(listButtonPO.buttonInnerConfig)) {
      var buttonInnerConfig = JsonUtility.StringToJson(listButtonPO.buttonInnerConfig);

      for (var i = 0; i < buttonInnerConfig.length; i++) {
        var innerButtonConfig = buttonInnerConfig[i];
        var buttonElem = InnerFormButtonRuntime.RendererSingleInnerFormButton(innerButtonConfig, this, listButtonPO);
        $("#innerButtonWrapOuter").append(buttonElem);
      }
    }
  }
};
var FormRuntimeMock = {
  GetMockData: function GetMockData() {
    return {
      "recordId": "",
      "formId": "34db0d6f-7978-4acf-8a45-13a6ee5f63e2",
      "buttonId": "",
      "formRecordDataRelationPOList": [{
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
        "oneDataRecord": {
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
            "value": "测试15",
            "success": true,
            "msg": ""
          }, {
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
            "value": "2019-10-31",
            "success": true,
            "msg": ""
          }, {
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
          }, {
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
          }, {
            "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_1",
            "tableCaption": "开发测试表1",
            "tableId": "TDEV_TEST_1",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_897949295",
            "defaultType": "Const",
            "defaultValue": "测试",
            "value": "0d561c0e-b83b-a9ff-c88a-652d4a4aa256",
            "success": true,
            "msg": ""
          }]
        }
      }, {
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
        "listDataRecord": [{
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
          }, {
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
            "value": "2019-10-30",
            "success": true,
            "msg": ""
          }, {
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
            "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
          }, {
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
            "value": "2019-10-30",
            "success": true,
            "msg": ""
          }, {
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
            "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
          }, {
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
            "value": "2019-10-30",
            "success": true,
            "msg": ""
          }, {
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
            "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
            "success": true,
            "msg": ""
          }]
        }]
      }, {
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
        "listDataRecord": [{
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
          }, {
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
            "value": "2019-10-30 20:59:32",
            "success": true,
            "msg": ""
          }, {
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
            "value": "8be67086-3f2e-9eb7-7b9d-f5350db9de92",
            "success": true,
            "msg": ""
          }, {
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
            "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
          }, {
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
            "value": "2019-10-30 20:59:32",
            "success": true,
            "msg": ""
          }, {
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
            "value": "3a4f512f-5fd5-2d8f-98a0-6e8aa0178999",
            "success": true,
            "msg": ""
          }, {
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
            "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
          }, {
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
            "value": "2019-10-30 20:59:32",
            "success": true,
            "msg": ""
          }, {
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
            "value": "85be9cb5-48bc-ec01-6f0c-7a634934f25e",
            "success": true,
            "msg": ""
          }, {
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
            "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
            "value": "1111",
            "success": true,
            "msg": ""
          }, {
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
            "value": "2019-10-30 20:59:32",
            "success": true,
            "msg": ""
          }, {
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
            "value": "8bd9b70b-7a03-5cbd-863f-bf994612647b",
            "success": true,
            "msg": ""
          }, {
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
            "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
          }, {
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
            "value": "2019-10-30 20:59:49",
            "success": true,
            "msg": ""
          }, {
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
            "value": "dbf46b13-3285-5891-ac50-ed783b8fbcda",
            "success": true,
            "msg": ""
          }, {
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
            "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
          }, {
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
            "value": "2019-10-30 20:59:49",
            "success": true,
            "msg": ""
          }, {
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
            "value": "dfeeeadc-3418-89b8-2fc3-98f9263900c4",
            "success": true,
            "msg": ""
          }, {
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
            "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
          }, {
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
            "value": "2019-10-30 20:59:49",
            "success": true,
            "msg": ""
          }, {
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
            "value": "005d1265-f165-34f9-dfc7-1e700ba7ffa4",
            "success": true,
            "msg": ""
          }, {
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
            "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
            "value": "2222",
            "success": true,
            "msg": ""
          }, {
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
            "value": "2019-10-30 20:59:49",
            "success": true,
            "msg": ""
          }, {
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
            "value": "058e8563-adc1-7c3d-417f-783fe19dd936",
            "success": true,
            "msg": ""
          }, {
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
            "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
          }, {
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
            "value": "2019-10-30 21:00:12",
            "success": true,
            "msg": ""
          }, {
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
            "value": "82842a88-279e-4599-0f57-0b94c65b5a4c",
            "success": true,
            "msg": ""
          }, {
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
            "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
          }, {
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
            "value": "2019-10-30 21:00:12",
            "success": true,
            "msg": ""
          }, {
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
            "value": "c2b3b86b-d6c3-cb4b-b215-6db99152b56e",
            "success": true,
            "msg": ""
          }, {
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
            "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
          }, {
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
            "value": "2019-10-30 21:00:12",
            "success": true,
            "msg": ""
          }, {
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
            "value": "b06fc984-4548-0914-b041-e8c982151b86",
            "success": true,
            "msg": ""
          }, {
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
            "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
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
            "value": "3333",
            "success": true,
            "msg": ""
          }, {
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
            "value": "2019-10-30 21:00:12",
            "success": true,
            "msg": ""
          }, {
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
            "value": "1a648882-ce4b-af88-5471-8846962414aa",
            "success": true,
            "msg": ""
          }, {
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
            "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
            "success": true,
            "msg": ""
          }]
        }],
        "isMain": false
      }],
      "exData": null
    };
  }
};
"use strict";

var InnerFormButtonRuntime = {
  RendererSingleInnerFormButton: function RendererSingleInnerFormButton(innerButtonConfig, formRuntimeInstance, listButtonPO) {
    var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + innerButtonConfig.id + '"><span>' + innerButtonConfig.caption + '</span></button>');
    elem.bind("click", {
      "innerButtonConfig": innerButtonConfig,
      "formRuntimeInstance": formRuntimeInstance,
      "listButtonPO": listButtonPO
    }, this.RendererSingleInnerFormButtonClick);
    return elem;
  },
  RendererSingleInnerFormButtonClick: function RendererSingleInnerFormButtonClick(sender) {
    var innerButtonConfig = sender.data.innerButtonConfig;
    var formRuntimeInstance = sender.data.formRuntimeInstance;
    var listButtonPO = sender.data.listButtonPO;
    var formDataComplexPOList = formRuntimeInstance.SerializationFormData();
    var operationType = formRuntimeInstance._Prop_Config.OperationType;
    DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "系统处理中,请稍候...");
    RuntimeGeneralInstance.SubmitFormDataComplexPOListToServer(formDataComplexPOList, formDataComplexPOList.recordId, innerButtonConfig.id, listButtonPO.buttonId, operationType, function (result) {
      console.log(result);
      window.setTimeout(function () {
        DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
      }, 1000);
    }, this);
  }
};
"use strict";

var ListRuntime = {
  _Prop_Status: "Edit",
  _Prop_Config: {
    RendererToId: null,
    ListId: "",
    IsPreview: false
  },
  _$RendererToElem: null,
  Initialization: function Initialization(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);
    this._$RendererToElem = $("#" + this._Prop_Config.RendererToId);

    this._LoadHTMLToEl();
  },
  _RendererChainIsCompleted: true,
  _RendererDataChainIsCompleted: true,
  _LoadHTMLToEl: function _LoadHTMLToEl() {
    RuntimeGeneralInstance.LoadHtmlDesignContent(BaseUtility.GetRootPath() + "/Rest/Builder/RunTime/ListRuntime/LoadHTML?listId=" + this._Prop_Config.ListId, this._Prop_Config.RendererTo, {}, function (result) {
      var _self = this;

      this._$RendererToElem.append(result.data.listHtmlRuntime);

      this._$RendererToElem.append(result.data.listJsRuntime);

      if (typeof BuilderListPageRuntimeInstance.PageReady == "function") {
        BuilderListPageRuntimeInstance.PageReady();
      }

      VirtualBodyControl.RendererChain({
        po: result.data,
        sourceHTML: result.data.listHtmlRuntime,
        $rootElem: this._$RendererToElem,
        $parentControlElem: this._$RendererToElem,
        $singleControlElem: this._$RendererToElem,
        listRuntimeInstance: this
      });
      var RendererChainCompleteObj = window.setInterval(function () {
        if (_self._RendererChainIsCompleted) {
          window.clearInterval(RendererChainCompleteObj);

          if (typeof BuilderListPageRuntimeInstance.RendererChainCompleted == "function") {
            BuilderListPageRuntimeInstance.RendererChainCompleted();
          }
        }
      }, 500);
      var topDataSetId = result.data.listDatasetId;
      VirtualBodyControl.RendererDataChain({
        po: result.data,
        sourceHTML: result.data.listHtmlRuntime,
        $rootElem: this._$RendererToElem,
        $parentControlElem: this._$RendererToElem,
        $singleControlElem: this._$RendererToElem,
        topDataSetId: topDataSetId,
        listRuntimeInstance: this
      });
      var RendererDataChainCompleteObj = window.setInterval(function () {
        if (_self._RendererDataChainIsCompleted) {
          window.clearInterval(RendererDataChainCompleteObj);

          if (typeof BuilderListPageRuntimeInstance.RendererDataChainCompleted == "function") {
            BuilderListPageRuntimeInstance.RendererDataChainCompleted();
          }
        }
      }, 700);
    }, this);
  },
  IsPreview: function IsPreview() {
    return this._Prop_Config.IsPreview;
  }
};
var BuilderListPageRuntimeInstance = {
  PageReady: function PageReady() {
    console.log("页面加载html完成1");
  },
  RendererChainCompleted: function RendererChainCompleted() {
    console.log("客户端控件渲染完成");
  },
  RendererDataChainCompleted: function RendererDataChainCompleted() {
    console.log("客户端控件渲染并绑定完数据");
  }
};
"use strict";

var RuntimeGeneralInstance = {
  _Ajax: function _Ajax(url, params, callback, sender) {
    jQuery.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: params
    }).done(function (result) {
      callback.call(sender, result);

      if (!result.success) {
        DialogUtility.AlertText(result.message, sender, 5);
      }
    }).always(callback && function (jqXHR, status) {});
  },
  LoadHtmlDesignContent: function LoadHtmlDesignContent(url, appendToElemId, params, callback, sender) {
    this._Ajax(url, params, callback, sender);
  },
  LoadInnerFormButton: function LoadInnerFormButton(listFormButtonId, params, callback, sender) {
    var url = BaseUtility.BuildAction("/Rest/Builder/RunTime/ListButtonRuntime/GetButtonPO", {
      buttonId: listFormButtonId
    });

    this._Ajax(url, params, callback, sender);
  },
  SubmitFormDataComplexPOListToServer: function SubmitFormDataComplexPOListToServer(formDataComplexPOList, recordId, innerFormButtonId, listButtonId, operationType, callback, sender) {
    var url = BaseUtility.BuildAction("/Rest/Builder/RunTime/InnerFormButtonRuntime/ReceiveHandler", {});
    var params = {
      "formRecordComplexPOString": encodeURIComponent(JsonUtility.JsonToString(formDataComplexPOList)),
      "innerFormButtonId": innerFormButtonId,
      "listButtonId": listButtonId,
      "recordId": recordId,
      "operationType": operationType
    };

    this._Ajax(url, params, callback, sender);

    console.log(formDataComplexPOList);
  }
};
"use strict";

var HTMLControlAttrs = {
  JBUILD4DC_CUSTOM: "jbuild4dc_custom",
  SELECTED_JBUILD4DC_CUSTOM: "[jbuild4dc_custom=true]",
  CLIENT_RESOLVE: "client_resolve"
};
var HTMLControl = {
  _InstanceMap: {},
  _GetInstance: function _GetInstance(name) {
    for (var key in this._InstanceMap) {
      if (key == name) {
        return this._InstanceMap[key];
      }
    }

    var instance = eval(name);
    this._InstanceMap[name] = instance;
    return instance;
  },
  GetInstance: function GetInstance(name) {
    return this._GetInstance(name);
  },
  SaveControlNewInstanceToPool: function SaveControlNewInstanceToPool($elem, instance) {
    alert("改方法已经废弃,改为服务端创建初始化脚本1!");
    return null;
    var instanceName = $elem.attr("client_resolve") + "_" + StringUtility.GuidSplit("");
    $elem.attr("client_instance_name", instanceName);
    this._InstanceMap[instanceName] = instance;
    return instanceName;
  },
  _SaveControlNewInstanceToPool: function _SaveControlNewInstanceToPool(instanceName, instance) {
    this._InstanceMap[instanceName] = instance;
    return instanceName;
  },
  GetControlInstanceByElem: function GetControlInstanceByElem($elem) {
    return this._GetInstance(this.GetControlInstanceNameByElem($elem));
  },
  GetControlInstanceNameByElem: function GetControlInstanceNameByElem($elem) {
    var instanceName = "";

    if ($elem.attr("client_instance_name") && $elem.attr("client_instance_name").length > 0) {
      instanceName = $elem.attr("client_instance_name");
    } else {
      instanceName = $elem.attr("client_resolve");
    }

    return instanceName;
  },
  RendererChainParas: {
    listEntity: null,
    sourceHTML: null,
    $rootElem: null,
    $parentControlElem: null,
    $singleControlElem: null
  },
  RendererDataChainParas: {
    listEntity: null,
    sourceHTML: null,
    $rootElem: null,
    $parentControlElem: null,
    $singleControlElem: null,
    topDataSet: null
  },
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;

    for (var i = 0; i < $singleControlElem.children().length; i++) {
      var $childSingleElem = $($singleControlElem.children()[i]);
      var _cloneRendererDataChainParas = {};
      JsonUtility.SimpleCloneAttr(_cloneRendererDataChainParas, _rendererChainParas);
      _cloneRendererDataChainParas.$singleControlElem = $childSingleElem;

      if ($childSingleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM) == "true" && $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE)) {
        var instance = HTMLControl.GetControlInstanceByElem($childSingleElem);

        if (typeof instance.Initialize == "function") {
          instance.Initialize();
        }

        instance.RendererChain(_cloneRendererDataChainParas);
      } else {
        HTMLControl.RendererChain(_cloneRendererDataChainParas);
      }
    }
  },
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var $singleControlElem = _rendererDataChainParas.$singleControlElem;

    for (var i = 0; i < $singleControlElem.children().length; i++) {
      var $childSingleElem = $($singleControlElem.children()[i]);
      var _cloneRendererDataChainParas = {};
      JsonUtility.SimpleCloneAttr(_cloneRendererDataChainParas, _rendererDataChainParas);
      _cloneRendererDataChainParas.$singleControlElem = $childSingleElem;

      if ($childSingleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM) == "true" && $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE)) {
        var instance = HTMLControl.GetControlInstanceByElem($childSingleElem);
        instance.RendererDataChain(_cloneRendererDataChainParas);

        if (typeof instance.SetValue == "function") {
          var fieldPO = HTMLControl.TryGetFieldPOInRelationFormRecordComplexPo($childSingleElem, _rendererDataChainParas.relationFormRecordComplexPo);
          instance.SetValue($childSingleElem, fieldPO, _rendererDataChainParas.relationFormRecordComplexPo, _rendererDataChainParas);
        }
      } else {
        HTMLControl.RendererDataChain(_cloneRendererDataChainParas);
      }
    }
  },
  GetValue: function GetValue($elem, originalData, paras) {
    originalData.value = $elem.val();
    return originalData;
  },
  SetValue: function SetValue($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    if (fieldPO) {
      $elem.val(fieldPO.value);
      $elem.attr("control_value", fieldPO.value);
    }
  },
  TryGetFieldPOInRelationFormRecordComplexPo: function TryGetFieldPOInRelationFormRecordComplexPo($elem, relationFormRecordComplexPo) {
    var relationId = HTMLControl.GetControlBindRelationId($elem);
    var bindTableName = HTMLControl.GetControlBindTableName($elem);
    var bindFieldName = HTMLControl.GetControlBindFieldName($elem);

    if (relationId && bindFieldName) {
      var fieldPO = FormRelationPOUtility.FindFieldPOInRelationFormRecordComplexPoOneDataRecord(relationFormRecordComplexPo, relationId, bindTableName, bindFieldName);
      return fieldPO;
    } else {
      return null;
    }
  },
  FindALLControls: function FindALLControls($parent) {
    if ($parent) {
      return $parent.find("[jbuild4dc_custom='true']");
    }

    return $("[jbuild4dc_custom='true']");
  },
  GetControlBindTableName: function GetControlBindTableName($controlElem) {
    return $controlElem.attr("tablename");
  },
  GetControlBindFieldName: function GetControlBindFieldName($controlElem) {
    return $controlElem.attr("fieldname");
  },
  GetControlBindRelationId: function GetControlBindRelationId($controlElem) {
    return $controlElem.attr("relationid");
  },
  GetControlProp: function GetControlProp($controlElem) {
    var props = {
      singleName: "",
      tableName: "",
      tableCaption: "",
      tableId: "",
      fieldTableId: "",
      fieldName: "",
      fieldDataType: "",
      fieldDataLength: "",
      defaultType: "",
      defaultValue: "",
      id: "",
      serialize: "",
      value: ""
    };

    for (var key in props) {
      var propValue = $controlElem.attr(StringUtility.ToLowerCase(key));

      if (!StringUtility.IsNullOrEmpty(propValue)) {
        props[key] = propValue;
      }
    }

    props.fieldDataLength = $controlElem.attr("fieldlength");
    return props;
  },
  BuildSerializationOriginalData: function BuildSerializationOriginalData(props, relationId, relationSingleName, relationType) {
    var originalData = {
      relationId: relationId,
      relationSingleName: relationSingleName,
      relationType: relationType,
      singleName: props.singleName,
      tableName: props.tableName,
      tableCaption: props.tableCaption,
      tableId: props.tableId,
      fieldTableId: props.fieldTableId,
      fieldName: props.fieldName,
      fieldDataType: props.fieldDataType,
      fieldDataLength: props.fieldDataLength,
      serialize: props.serialize,
      id: props.id,
      defaultType: props.defaultType,
      defaultValue: props.defaultValue,
      value: "",
      success: true,
      msg: ""
    };
    return originalData;
  },
  GetSerializationOneDataRecordFieldValue: function GetSerializationOneDataRecordFieldValue(oneDataRecord, tableName, fieldName) {
    for (var i = 0; i < oneDataRecord.length; i++) {
      if (oneDataRecord[i].tableName == tableName && oneDataRecord[i].fieldName == fieldName) {
        return oneDataRecord[i].value;
      }
    }

    return "";
  },
  TryGetFieldTransferPO: function TryGetFieldTransferPO($controlElem, relationId, relationSingleName, relationType) {
    var props = HTMLControl.GetControlProp($controlElem);
    var originalData = HTMLControl.BuildSerializationOriginalData(props, relationId, relationSingleName, relationType);
    var controlInstance = HTMLControl.GetControlInstanceByElem($controlElem);

    if (BaseUtility.IsFunction(controlInstance.GetValue)) {
      var fieldTransferPO = controlInstance.GetValue($controlElem, originalData, {});

      if (fieldTransferPO.success) {
        return fieldTransferPO;
      } else {
        return null;
      }
    } else {
      DialogUtility.AlertText("控件:" + $controlElem.attr("singlename") + "未包含GetValue的方法!");
    }
  }
};
"use strict";

var VirtualBodyControl = {
  RendererChain: HTMLControl.RendererChain,
  RendererDataChain: HTMLControl.RendererDataChain
};
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  "use strict";

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], function ($) {
      return factory($, window, document);
    });
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = function (root, $) {
      if (!root) {
        root = window;
      }

      if (!$) {
        $ = typeof window !== 'undefined' ? require('jquery') : require('jquery')(root);
      }

      return factory($, root, root.document);
    };
  } else {
    factory(jQuery, window, document);
  }
})(function ($, window, document, undefined) {
  "use strict";

  var DataTable = function DataTable(options) {
    this.$ = function (sSelector, oOpts) {
      return this.api(true).$(sSelector, oOpts);
    };

    this._ = function (sSelector, oOpts) {
      return this.api(true).rows(sSelector, oOpts).data();
    };

    this.api = function (traditional) {
      return traditional ? new _Api2(_fnSettingsFromNode(this[_ext.iApiIndex])) : new _Api2(this);
    };

    this.fnAddData = function (data, redraw) {
      var api = this.api(true);
      var rows = $.isArray(data) && ($.isArray(data[0]) || $.isPlainObject(data[0])) ? api.rows.add(data) : api.row.add(data);

      if (redraw === undefined || redraw) {
        api.draw();
      }

      return rows.flatten().toArray();
    };

    this.fnAdjustColumnSizing = function (bRedraw) {
      var api = this.api(true).columns.adjust();
      var settings = api.settings()[0];
      var scroll = settings.oScroll;

      if (bRedraw === undefined || bRedraw) {
        api.draw(false);
      } else if (scroll.sX !== "" || scroll.sY !== "") {
        _fnScrollDraw(settings);
      }
    };

    this.fnClearTable = function (bRedraw) {
      var api = this.api(true).clear();

      if (bRedraw === undefined || bRedraw) {
        api.draw();
      }
    };

    this.fnClose = function (nTr) {
      this.api(true).row(nTr).child.hide();
    };

    this.fnDeleteRow = function (target, callback, redraw) {
      var api = this.api(true);
      var rows = api.rows(target);
      var settings = rows.settings()[0];
      var data = settings.aoData[rows[0][0]];
      rows.remove();

      if (callback) {
        callback.call(this, settings, data);
      }

      if (redraw === undefined || redraw) {
        api.draw();
      }

      return data;
    };

    this.fnDestroy = function (remove) {
      this.api(true).destroy(remove);
    };

    this.fnDraw = function (complete) {
      this.api(true).draw(complete);
    };

    this.fnFilter = function (sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive) {
      var api = this.api(true);

      if (iColumn === null || iColumn === undefined) {
        api.search(sInput, bRegex, bSmart, bCaseInsensitive);
      } else {
        api.column(iColumn).search(sInput, bRegex, bSmart, bCaseInsensitive);
      }

      api.draw();
    };

    this.fnGetData = function (src, col) {
      var api = this.api(true);

      if (src !== undefined) {
        var type = src.nodeName ? src.nodeName.toLowerCase() : '';
        return col !== undefined || type == 'td' || type == 'th' ? api.cell(src, col).data() : api.row(src).data() || null;
      }

      return api.data().toArray();
    };

    this.fnGetNodes = function (iRow) {
      var api = this.api(true);
      return iRow !== undefined ? api.row(iRow).node() : api.rows().nodes().flatten().toArray();
    };

    this.fnGetPosition = function (node) {
      var api = this.api(true);
      var nodeName = node.nodeName.toUpperCase();

      if (nodeName == 'TR') {
        return api.row(node).index();
      } else if (nodeName == 'TD' || nodeName == 'TH') {
        var cell = api.cell(node).index();
        return [cell.row, cell.columnVisible, cell.column];
      }

      return null;
    };

    this.fnIsOpen = function (nTr) {
      return this.api(true).row(nTr).child.isShown();
    };

    this.fnOpen = function (nTr, mHtml, sClass) {
      return this.api(true).row(nTr).child(mHtml, sClass).show().child()[0];
    };

    this.fnPageChange = function (mAction, bRedraw) {
      var api = this.api(true).page(mAction);

      if (bRedraw === undefined || bRedraw) {
        api.draw(false);
      }
    };

    this.fnSetColumnVis = function (iCol, bShow, bRedraw) {
      var api = this.api(true).column(iCol).visible(bShow);

      if (bRedraw === undefined || bRedraw) {
        api.columns.adjust().draw();
      }
    };

    this.fnSettings = function () {
      return _fnSettingsFromNode(this[_ext.iApiIndex]);
    };

    this.fnSort = function (aaSort) {
      this.api(true).order(aaSort).draw();
    };

    this.fnSortListener = function (nNode, iColumn, fnCallback) {
      this.api(true).order.listener(nNode, iColumn, fnCallback);
    };

    this.fnUpdate = function (mData, mRow, iColumn, bRedraw, bAction) {
      var api = this.api(true);

      if (iColumn === undefined || iColumn === null) {
        api.row(mRow).data(mData);
      } else {
        api.cell(mRow, iColumn).data(mData);
      }

      if (bAction === undefined || bAction) {
        api.columns.adjust();
      }

      if (bRedraw === undefined || bRedraw) {
        api.draw();
      }

      return 0;
    };

    this.fnVersionCheck = _ext.fnVersionCheck;

    var _that = this;

    var emptyInit = options === undefined;
    var len = this.length;

    if (emptyInit) {
      options = {};
    }

    this.oApi = this.internal = _ext.internal;

    for (var fn in DataTable.ext.internal) {
      if (fn) {
        this[fn] = _fnExternApiFunc(fn);
      }
    }

    this.each(function () {
      var o = {};
      var oInit = len > 1 ? _fnExtend(o, options, true) : options;
      var i = 0,
          iLen,
          j,
          jLen,
          k,
          kLen;
      var sId = this.getAttribute('id');
      var bInitHandedOff = false;
      var defaults = DataTable.defaults;
      var $this = $(this);

      if (this.nodeName.toLowerCase() != 'table') {
        _fnLog(null, 0, 'Non-table node initialisation (' + this.nodeName + ')', 2);

        return;
      }

      _fnCompatOpts(defaults);

      _fnCompatCols(defaults.column);

      _fnCamelToHungarian(defaults, defaults, true);

      _fnCamelToHungarian(defaults.column, defaults.column, true);

      _fnCamelToHungarian(defaults, $.extend(oInit, $this.data()));

      var allSettings = DataTable.settings;

      for (i = 0, iLen = allSettings.length; i < iLen; i++) {
        var s = allSettings[i];

        if (s.nTable == this || s.nTHead && s.nTHead.parentNode == this || s.nTFoot && s.nTFoot.parentNode == this) {
          var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
          var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;

          if (emptyInit || bRetrieve) {
            return s.oInstance;
          } else if (bDestroy) {
            s.oInstance.fnDestroy();
            break;
          } else {
            _fnLog(s, 0, 'Cannot reinitialise DataTable', 3);

            return;
          }
        }

        if (s.sTableId == this.id) {
          allSettings.splice(i, 1);
          break;
        }
      }

      if (sId === null || sId === "") {
        sId = "DataTables_Table_" + DataTable.ext._unique++;
        this.id = sId;
      }

      var oSettings = $.extend(true, {}, DataTable.models.oSettings, {
        "sDestroyWidth": $this[0].style.width,
        "sInstance": sId,
        "sTableId": sId
      });
      oSettings.nTable = this;
      oSettings.oApi = _that.internal;
      oSettings.oInit = oInit;
      allSettings.push(oSettings);
      oSettings.oInstance = _that.length === 1 ? _that : $this.dataTable();

      _fnCompatOpts(oInit);

      _fnLanguageCompat(oInit.oLanguage);

      if (oInit.aLengthMenu && !oInit.iDisplayLength) {
        oInit.iDisplayLength = $.isArray(oInit.aLengthMenu[0]) ? oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
      }

      oInit = _fnExtend($.extend(true, {}, defaults), oInit);

      _fnMap(oSettings.oFeatures, oInit, ["bPaginate", "bLengthChange", "bFilter", "bSort", "bSortMulti", "bInfo", "bProcessing", "bAutoWidth", "bSortClasses", "bServerSide", "bDeferRender"]);

      _fnMap(oSettings, oInit, ["asStripeClasses", "ajax", "fnServerData", "fnFormatNumber", "sServerMethod", "aaSorting", "aaSortingFixed", "aLengthMenu", "sPaginationType", "sAjaxSource", "sAjaxDataProp", "iStateDuration", "sDom", "bSortCellsTop", "iTabIndex", "fnStateLoadCallback", "fnStateSaveCallback", "renderer", "searchDelay", "rowId", ["iCookieDuration", "iStateDuration"], ["oSearch", "oPreviousSearch"], ["aoSearchCols", "aoPreSearchCols"], ["iDisplayLength", "_iDisplayLength"]]);

      _fnMap(oSettings.oScroll, oInit, [["sScrollX", "sX"], ["sScrollXInner", "sXInner"], ["sScrollY", "sY"], ["bScrollCollapse", "bCollapse"]]);

      _fnMap(oSettings.oLanguage, oInit, "fnInfoCallback");

      _fnCallbackReg(oSettings, 'aoDrawCallback', oInit.fnDrawCallback, 'user');

      _fnCallbackReg(oSettings, 'aoServerParams', oInit.fnServerParams, 'user');

      _fnCallbackReg(oSettings, 'aoStateSaveParams', oInit.fnStateSaveParams, 'user');

      _fnCallbackReg(oSettings, 'aoStateLoadParams', oInit.fnStateLoadParams, 'user');

      _fnCallbackReg(oSettings, 'aoStateLoaded', oInit.fnStateLoaded, 'user');

      _fnCallbackReg(oSettings, 'aoRowCallback', oInit.fnRowCallback, 'user');

      _fnCallbackReg(oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow, 'user');

      _fnCallbackReg(oSettings, 'aoHeaderCallback', oInit.fnHeaderCallback, 'user');

      _fnCallbackReg(oSettings, 'aoFooterCallback', oInit.fnFooterCallback, 'user');

      _fnCallbackReg(oSettings, 'aoInitComplete', oInit.fnInitComplete, 'user');

      _fnCallbackReg(oSettings, 'aoPreDrawCallback', oInit.fnPreDrawCallback, 'user');

      oSettings.rowIdFn = _fnGetObjectDataFn(oInit.rowId);

      _fnBrowserDetect(oSettings);

      var oClasses = oSettings.oClasses;
      $.extend(oClasses, DataTable.ext.classes, oInit.oClasses);
      $this.addClass(oClasses.sTable);

      if (oSettings.iInitDisplayStart === undefined) {
        oSettings.iInitDisplayStart = oInit.iDisplayStart;
        oSettings._iDisplayStart = oInit.iDisplayStart;
      }

      if (oInit.iDeferLoading !== null) {
        oSettings.bDeferLoading = true;
        var tmp = $.isArray(oInit.iDeferLoading);
        oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
        oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
      }

      var oLanguage = oSettings.oLanguage;
      $.extend(true, oLanguage, oInit.oLanguage);

      if (oLanguage.sUrl) {
        $.ajax({
          dataType: 'json',
          url: oLanguage.sUrl,
          success: function success(json) {
            _fnLanguageCompat(json);

            _fnCamelToHungarian(defaults.oLanguage, json);

            $.extend(true, oLanguage, json);

            _fnInitialise(oSettings);
          },
          error: function error() {
            _fnInitialise(oSettings);
          }
        });
        bInitHandedOff = true;
      }

      if (oInit.asStripeClasses === null) {
        oSettings.asStripeClasses = [oClasses.sStripeOdd, oClasses.sStripeEven];
      }

      var stripeClasses = oSettings.asStripeClasses;
      var rowOne = $this.children('tbody').find('tr').eq(0);

      if ($.inArray(true, $.map(stripeClasses, function (el, i) {
        return rowOne.hasClass(el);
      })) !== -1) {
        $('tbody tr', this).removeClass(stripeClasses.join(' '));
        oSettings.asDestroyStripes = stripeClasses.slice();
      }

      var anThs = [];
      var aoColumnsInit;
      var nThead = this.getElementsByTagName('thead');

      if (nThead.length !== 0) {
        _fnDetectHeader(oSettings.aoHeader, nThead[0]);

        anThs = _fnGetUniqueThs(oSettings);
      }

      if (oInit.aoColumns === null) {
        aoColumnsInit = [];

        for (i = 0, iLen = anThs.length; i < iLen; i++) {
          aoColumnsInit.push(null);
        }
      } else {
        aoColumnsInit = oInit.aoColumns;
      }

      for (i = 0, iLen = aoColumnsInit.length; i < iLen; i++) {
        _fnAddColumn(oSettings, anThs ? anThs[i] : null);
      }

      _fnApplyColumnDefs(oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
        _fnColumnOptions(oSettings, iCol, oDef);
      });

      if (rowOne.length) {
        var a = function a(cell, name) {
          return cell.getAttribute('data-' + name) !== null ? name : null;
        };

        $(rowOne[0]).children('th, td').each(function (i, cell) {
          var col = oSettings.aoColumns[i];

          if (col.mData === i) {
            var sort = a(cell, 'sort') || a(cell, 'order');
            var filter = a(cell, 'filter') || a(cell, 'search');

            if (sort !== null || filter !== null) {
              col.mData = {
                _: i + '.display',
                sort: sort !== null ? i + '.@data-' + sort : undefined,
                type: sort !== null ? i + '.@data-' + sort : undefined,
                filter: filter !== null ? i + '.@data-' + filter : undefined
              };

              _fnColumnOptions(oSettings, i);
            }
          }
        });
      }

      var features = oSettings.oFeatures;

      var loadedInit = function loadedInit() {
        if (oInit.aaSorting === undefined) {
          var sorting = oSettings.aaSorting;

          for (i = 0, iLen = sorting.length; i < iLen; i++) {
            sorting[i][1] = oSettings.aoColumns[i].asSorting[0];
          }
        }

        _fnSortingClasses(oSettings);

        if (features.bSort) {
          _fnCallbackReg(oSettings, 'aoDrawCallback', function () {
            if (oSettings.bSorted) {
              var aSort = _fnSortFlatten(oSettings);

              var sortedColumns = {};
              $.each(aSort, function (i, val) {
                sortedColumns[val.src] = val.dir;
              });

              _fnCallbackFire(oSettings, null, 'order', [oSettings, aSort, sortedColumns]);

              _fnSortAria(oSettings);
            }
          });
        }

        _fnCallbackReg(oSettings, 'aoDrawCallback', function () {
          if (oSettings.bSorted || _fnDataSource(oSettings) === 'ssp' || features.bDeferRender) {
            _fnSortingClasses(oSettings);
          }
        }, 'sc');

        var captions = $this.children('caption').each(function () {
          this._captionSide = $(this).css('caption-side');
        });
        var thead = $this.children('thead');

        if (thead.length === 0) {
          thead = $('<thead/>').appendTo($this);
        }

        oSettings.nTHead = thead[0];
        var tbody = $this.children('tbody');

        if (tbody.length === 0) {
          tbody = $('<tbody/>').appendTo($this);
        }

        oSettings.nTBody = tbody[0];
        var tfoot = $this.children('tfoot');

        if (tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "")) {
          tfoot = $('<tfoot/>').appendTo($this);
        }

        if (tfoot.length === 0 || tfoot.children().length === 0) {
          $this.addClass(oClasses.sNoFooter);
        } else if (tfoot.length > 0) {
          oSettings.nTFoot = tfoot[0];

          _fnDetectHeader(oSettings.aoFooter, oSettings.nTFoot);
        }

        if (oInit.aaData) {
          for (i = 0; i < oInit.aaData.length; i++) {
            _fnAddData(oSettings, oInit.aaData[i]);
          }
        } else if (oSettings.bDeferLoading || _fnDataSource(oSettings) == 'dom') {
          _fnAddTr(oSettings, $(oSettings.nTBody).children('tr'));
        }

        oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
        oSettings.bInitialised = true;

        if (bInitHandedOff === false) {
          _fnInitialise(oSettings);
        }
      };

      if (oInit.bStateSave) {
        features.bStateSave = true;

        _fnCallbackReg(oSettings, 'aoDrawCallback', _fnSaveState, 'state_save');

        _fnLoadState(oSettings, oInit, loadedInit);
      } else {
        loadedInit();
      }
    });
    _that = null;
    return this;
  };

  var _ext;

  var _Api2;

  var _api_register;

  var _api_registerPlural;

  var _re_dic = {};
  var _re_new_lines = /[\r\n]/g;
  var _re_html = /<.*?>/g;
  var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;

  var _re_escape_regex = new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-'].join('|\\') + ')', 'g');

  var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;

  var _empty = function _empty(d) {
    return !d || d === true || d === '-' ? true : false;
  };

  var _intVal = function _intVal(s) {
    var integer = parseInt(s, 10);
    return !isNaN(integer) && isFinite(s) ? integer : null;
  };

  var _numToDecimal = function _numToDecimal(num, decimalPoint) {
    if (!_re_dic[decimalPoint]) {
      _re_dic[decimalPoint] = new RegExp(_fnEscapeRegex(decimalPoint), 'g');
    }

    return typeof num === 'string' && decimalPoint !== '.' ? num.replace(/\./g, '').replace(_re_dic[decimalPoint], '.') : num;
  };

  var _isNumber = function _isNumber(d, decimalPoint, formatted) {
    var strType = typeof d === 'string';

    if (_empty(d)) {
      return true;
    }

    if (decimalPoint && strType) {
      d = _numToDecimal(d, decimalPoint);
    }

    if (formatted && strType) {
      d = d.replace(_re_formatted_numeric, '');
    }

    return !isNaN(parseFloat(d)) && isFinite(d);
  };

  var _isHtml = function _isHtml(d) {
    return _empty(d) || typeof d === 'string';
  };

  var _htmlNumeric = function _htmlNumeric(d, decimalPoint, formatted) {
    if (_empty(d)) {
      return true;
    }

    var html = _isHtml(d);

    return !html ? null : _isNumber(_stripHtml(d), decimalPoint, formatted) ? true : null;
  };

  var _pluck = function _pluck(a, prop, prop2) {
    var out = [];
    var i = 0,
        ien = a.length;

    if (prop2 !== undefined) {
      for (; i < ien; i++) {
        if (a[i] && a[i][prop]) {
          out.push(a[i][prop][prop2]);
        }
      }
    } else {
      for (; i < ien; i++) {
        if (a[i]) {
          out.push(a[i][prop]);
        }
      }
    }

    return out;
  };

  var _pluck_order = function _pluck_order(a, order, prop, prop2) {
    var out = [];
    var i = 0,
        ien = order.length;

    if (prop2 !== undefined) {
      for (; i < ien; i++) {
        if (a[order[i]][prop]) {
          out.push(a[order[i]][prop][prop2]);
        }
      }
    } else {
      for (; i < ien; i++) {
        out.push(a[order[i]][prop]);
      }
    }

    return out;
  };

  var _range = function _range(len, start) {
    var out = [];
    var end;

    if (start === undefined) {
      start = 0;
      end = len;
    } else {
      end = start;
      start = len;
    }

    for (var i = start; i < end; i++) {
      out.push(i);
    }

    return out;
  };

  var _removeEmpty = function _removeEmpty(a) {
    var out = [];

    for (var i = 0, ien = a.length; i < ien; i++) {
      if (a[i]) {
        out.push(a[i]);
      }
    }

    return out;
  };

  var _stripHtml = function _stripHtml(d) {
    return d.replace(_re_html, '');
  };

  var _areAllUnique = function _areAllUnique(src) {
    if (src.length < 2) {
      return true;
    }

    var sorted = src.slice().sort();
    var last = sorted[0];

    for (var i = 1, ien = sorted.length; i < ien; i++) {
      if (sorted[i] === last) {
        return false;
      }

      last = sorted[i];
    }

    return true;
  };

  var _unique = function _unique(src) {
    if (_areAllUnique(src)) {
      return src.slice();
    }

    var out = [],
        val,
        i,
        ien = src.length,
        j,
        k = 0;

    again: for (i = 0; i < ien; i++) {
      val = src[i];

      for (j = 0; j < k; j++) {
        if (out[j] === val) {
          continue again;
        }
      }

      out.push(val);
      k++;
    }

    return out;
  };

  DataTable.util = {
    throttle: function throttle(fn, freq) {
      var frequency = freq !== undefined ? freq : 200,
          last,
          timer;
      return function () {
        var that = this,
            now = +new Date(),
            args = arguments;

        if (last && now < last + frequency) {
          clearTimeout(timer);
          timer = setTimeout(function () {
            last = undefined;
            fn.apply(that, args);
          }, frequency);
        } else {
          last = now;
          fn.apply(that, args);
        }
      };
    },
    escapeRegex: function escapeRegex(val) {
      return val.replace(_re_escape_regex, '\\$1');
    }
  };

  function _fnHungarianMap(o) {
    var hungarian = 'a aa ai ao as b fn i m o s ',
        match,
        newKey,
        map = {};
    $.each(o, function (key, val) {
      match = key.match(/^([^A-Z]+?)([A-Z])/);

      if (match && hungarian.indexOf(match[1] + ' ') !== -1) {
        newKey = key.replace(match[0], match[2].toLowerCase());
        map[newKey] = key;

        if (match[1] === 'o') {
          _fnHungarianMap(o[key]);
        }
      }
    });
    o._hungarianMap = map;
  }

  function _fnCamelToHungarian(src, user, force) {
    if (!src._hungarianMap) {
      _fnHungarianMap(src);
    }

    var hungarianKey;
    $.each(user, function (key, val) {
      hungarianKey = src._hungarianMap[key];

      if (hungarianKey !== undefined && (force || user[hungarianKey] === undefined)) {
        if (hungarianKey.charAt(0) === 'o') {
          if (!user[hungarianKey]) {
            user[hungarianKey] = {};
          }

          $.extend(true, user[hungarianKey], user[key]);

          _fnCamelToHungarian(src[hungarianKey], user[hungarianKey], force);
        } else {
          user[hungarianKey] = user[key];
        }
      }
    });
  }

  function _fnLanguageCompat(lang) {
    var defaults = DataTable.defaults.oLanguage;
    var defaultDecimal = defaults.sDecimal;

    if (defaultDecimal) {
      _addNumericSort(defaultDecimal);
    }

    if (lang) {
      var zeroRecords = lang.sZeroRecords;

      if (!lang.sEmptyTable && zeroRecords && defaults.sEmptyTable === "No data available in table") {
        _fnMap(lang, lang, 'sZeroRecords', 'sEmptyTable');
      }

      if (!lang.sLoadingRecords && zeroRecords && defaults.sLoadingRecords === "Loading...") {
        _fnMap(lang, lang, 'sZeroRecords', 'sLoadingRecords');
      }

      if (lang.sInfoThousands) {
        lang.sThousands = lang.sInfoThousands;
      }

      var decimal = lang.sDecimal;

      if (decimal && defaultDecimal !== decimal) {
        _addNumericSort(decimal);
      }
    }
  }

  var _fnCompatMap = function _fnCompatMap(o, knew, old) {
    if (o[knew] !== undefined) {
      o[old] = o[knew];
    }
  };

  function _fnCompatOpts(init) {
    _fnCompatMap(init, 'ordering', 'bSort');

    _fnCompatMap(init, 'orderMulti', 'bSortMulti');

    _fnCompatMap(init, 'orderClasses', 'bSortClasses');

    _fnCompatMap(init, 'orderCellsTop', 'bSortCellsTop');

    _fnCompatMap(init, 'order', 'aaSorting');

    _fnCompatMap(init, 'orderFixed', 'aaSortingFixed');

    _fnCompatMap(init, 'paging', 'bPaginate');

    _fnCompatMap(init, 'pagingType', 'sPaginationType');

    _fnCompatMap(init, 'pageLength', 'iDisplayLength');

    _fnCompatMap(init, 'searching', 'bFilter');

    if (typeof init.sScrollX === 'boolean') {
      init.sScrollX = init.sScrollX ? '100%' : '';
    }

    if (typeof init.scrollX === 'boolean') {
      init.scrollX = init.scrollX ? '100%' : '';
    }

    var searchCols = init.aoSearchCols;

    if (searchCols) {
      for (var i = 0, ien = searchCols.length; i < ien; i++) {
        if (searchCols[i]) {
          _fnCamelToHungarian(DataTable.models.oSearch, searchCols[i]);
        }
      }
    }
  }

  function _fnCompatCols(init) {
    _fnCompatMap(init, 'orderable', 'bSortable');

    _fnCompatMap(init, 'orderData', 'aDataSort');

    _fnCompatMap(init, 'orderSequence', 'asSorting');

    _fnCompatMap(init, 'orderDataType', 'sortDataType');

    var dataSort = init.aDataSort;

    if (typeof dataSort === 'number' && !$.isArray(dataSort)) {
      init.aDataSort = [dataSort];
    }
  }

  function _fnBrowserDetect(settings) {
    if (!DataTable.__browser) {
      var browser = {};
      DataTable.__browser = browser;
      var n = $('<div/>').css({
        position: 'fixed',
        top: 0,
        left: $(window).scrollLeft() * -1,
        height: 1,
        width: 1,
        overflow: 'hidden'
      }).append($('<div/>').css({
        position: 'absolute',
        top: 1,
        left: 1,
        width: 100,
        overflow: 'scroll'
      }).append($('<div/>').css({
        width: '100%',
        height: 10
      }))).appendTo('body');
      var outer = n.children();
      var inner = outer.children();
      browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
      browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
      browser.bScrollbarLeft = Math.round(inner.offset().left) !== 1;
      browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
      n.remove();
    }

    $.extend(settings.oBrowser, DataTable.__browser);
    settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
  }

  function _fnReduce(that, fn, init, start, end, inc) {
    var i = start,
        value,
        isSet = false;

    if (init !== undefined) {
      value = init;
      isSet = true;
    }

    while (i !== end) {
      if (!that.hasOwnProperty(i)) {
        continue;
      }

      value = isSet ? fn(value, that[i], i, that) : that[i];
      isSet = true;
      i += inc;
    }

    return value;
  }

  function _fnAddColumn(oSettings, nTh) {
    var oDefaults = DataTable.defaults.column;
    var iCol = oSettings.aoColumns.length;
    var oCol = $.extend({}, DataTable.models.oColumn, oDefaults, {
      "nTh": nTh ? nTh : document.createElement('th'),
      "sTitle": oDefaults.sTitle ? oDefaults.sTitle : nTh ? nTh.innerHTML : '',
      "aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
      "mData": oDefaults.mData ? oDefaults.mData : iCol,
      idx: iCol
    });
    oSettings.aoColumns.push(oCol);
    var searchCols = oSettings.aoPreSearchCols;
    searchCols[iCol] = $.extend({}, DataTable.models.oSearch, searchCols[iCol]);

    _fnColumnOptions(oSettings, iCol, $(nTh).data());
  }

  function _fnColumnOptions(oSettings, iCol, oOptions) {
    var oCol = oSettings.aoColumns[iCol];
    var oClasses = oSettings.oClasses;
    var th = $(oCol.nTh);

    if (!oCol.sWidthOrig) {
      oCol.sWidthOrig = th.attr('width') || null;
      var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);

      if (t) {
        oCol.sWidthOrig = t[1];
      }
    }

    if (oOptions !== undefined && oOptions !== null) {
      _fnCompatCols(oOptions);

      _fnCamelToHungarian(DataTable.defaults.column, oOptions);

      if (oOptions.mDataProp !== undefined && !oOptions.mData) {
        oOptions.mData = oOptions.mDataProp;
      }

      if (oOptions.sType) {
        oCol._sManualType = oOptions.sType;
      }

      if (oOptions.className && !oOptions.sClass) {
        oOptions.sClass = oOptions.className;
      }

      if (oOptions.sClass) {
        th.addClass(oOptions.sClass);
      }

      $.extend(oCol, oOptions);

      _fnMap(oCol, oOptions, "sWidth", "sWidthOrig");

      if (oOptions.iDataSort !== undefined) {
        oCol.aDataSort = [oOptions.iDataSort];
      }

      _fnMap(oCol, oOptions, "aDataSort");
    }

    var mDataSrc = oCol.mData;

    var mData = _fnGetObjectDataFn(mDataSrc);

    var mRender = oCol.mRender ? _fnGetObjectDataFn(oCol.mRender) : null;

    var attrTest = function attrTest(src) {
      return typeof src === 'string' && src.indexOf('@') !== -1;
    };

    oCol._bAttrSrc = $.isPlainObject(mDataSrc) && (attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter));
    oCol._setter = null;

    oCol.fnGetData = function (rowData, type, meta) {
      var innerData = mData(rowData, type, undefined, meta);
      return mRender && type ? mRender(innerData, type, rowData, meta) : innerData;
    };

    oCol.fnSetData = function (rowData, val, meta) {
      return _fnSetObjectDataFn(mDataSrc)(rowData, val, meta);
    };

    if (typeof mDataSrc !== 'number') {
      oSettings._rowReadObject = true;
    }

    if (!oSettings.oFeatures.bSort) {
      oCol.bSortable = false;
      th.addClass(oClasses.sSortableNone);
    }

    var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
    var bDesc = $.inArray('desc', oCol.asSorting) !== -1;

    if (!oCol.bSortable || !bAsc && !bDesc) {
      oCol.sSortingClass = oClasses.sSortableNone;
      oCol.sSortingClassJUI = "";
    } else if (bAsc && !bDesc) {
      oCol.sSortingClass = oClasses.sSortableAsc;
      oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
    } else if (!bAsc && bDesc) {
      oCol.sSortingClass = oClasses.sSortableDesc;
      oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
    } else {
      oCol.sSortingClass = oClasses.sSortable;
      oCol.sSortingClassJUI = oClasses.sSortJUI;
    }
  }

  function _fnAdjustColumnSizing(settings) {
    if (settings.oFeatures.bAutoWidth !== false) {
      var columns = settings.aoColumns;

      _fnCalculateColumnWidths(settings);

      for (var i = 0, iLen = columns.length; i < iLen; i++) {
        columns[i].nTh.style.width = columns[i].sWidth;
      }
    }

    var scroll = settings.oScroll;

    if (scroll.sY !== '' || scroll.sX !== '') {
      _fnScrollDraw(settings);
    }

    _fnCallbackFire(settings, null, 'column-sizing', [settings]);
  }

  function _fnVisibleToColumnIndex(oSettings, iMatch) {
    var aiVis = _fnGetColumns(oSettings, 'bVisible');

    return typeof aiVis[iMatch] === 'number' ? aiVis[iMatch] : null;
  }

  function _fnColumnIndexToVisible(oSettings, iMatch) {
    var aiVis = _fnGetColumns(oSettings, 'bVisible');

    var iPos = $.inArray(iMatch, aiVis);
    return iPos !== -1 ? iPos : null;
  }

  function _fnVisbleColumns(oSettings) {
    var vis = 0;
    $.each(oSettings.aoColumns, function (i, col) {
      if (col.bVisible && $(col.nTh).css('display') !== 'none') {
        vis++;
      }
    });
    return vis;
  }

  function _fnGetColumns(oSettings, sParam) {
    var a = [];
    $.map(oSettings.aoColumns, function (val, i) {
      if (val[sParam]) {
        a.push(i);
      }
    });
    return a;
  }

  function _fnColumnTypes(settings) {
    var columns = settings.aoColumns;
    var data = settings.aoData;
    var types = DataTable.ext.type.detect;
    var i, ien, j, jen, k, ken;
    var col, cell, detectedType, cache;

    for (i = 0, ien = columns.length; i < ien; i++) {
      col = columns[i];
      cache = [];

      if (!col.sType && col._sManualType) {
        col.sType = col._sManualType;
      } else if (!col.sType) {
        for (j = 0, jen = types.length; j < jen; j++) {
          for (k = 0, ken = data.length; k < ken; k++) {
            if (cache[k] === undefined) {
              cache[k] = _fnGetCellData(settings, k, i, 'type');
            }

            detectedType = types[j](cache[k], settings);

            if (!detectedType && j !== types.length - 1) {
              break;
            }

            if (detectedType === 'html') {
              break;
            }
          }

          if (detectedType) {
            col.sType = detectedType;
            break;
          }
        }

        if (!col.sType) {
          col.sType = 'string';
        }
      }
    }
  }

  function _fnApplyColumnDefs(oSettings, aoColDefs, aoCols, fn) {
    var i, iLen, j, jLen, k, kLen, def;
    var columns = oSettings.aoColumns;

    if (aoColDefs) {
      for (i = aoColDefs.length - 1; i >= 0; i--) {
        def = aoColDefs[i];
        var aTargets = def.targets !== undefined ? def.targets : def.aTargets;

        if (!$.isArray(aTargets)) {
          aTargets = [aTargets];
        }

        for (j = 0, jLen = aTargets.length; j < jLen; j++) {
          if (typeof aTargets[j] === 'number' && aTargets[j] >= 0) {
            while (columns.length <= aTargets[j]) {
              _fnAddColumn(oSettings);
            }

            fn(aTargets[j], def);
          } else if (typeof aTargets[j] === 'number' && aTargets[j] < 0) {
            fn(columns.length + aTargets[j], def);
          } else if (typeof aTargets[j] === 'string') {
            for (k = 0, kLen = columns.length; k < kLen; k++) {
              if (aTargets[j] == "_all" || $(columns[k].nTh).hasClass(aTargets[j])) {
                fn(k, def);
              }
            }
          }
        }
      }
    }

    if (aoCols) {
      for (i = 0, iLen = aoCols.length; i < iLen; i++) {
        fn(i, aoCols[i]);
      }
    }
  }

  function _fnAddData(oSettings, aDataIn, nTr, anTds) {
    var iRow = oSettings.aoData.length;
    var oData = $.extend(true, {}, DataTable.models.oRow, {
      src: nTr ? 'dom' : 'data',
      idx: iRow
    });
    oData._aData = aDataIn;
    oSettings.aoData.push(oData);
    var nTd, sThisType;
    var columns = oSettings.aoColumns;

    for (var i = 0, iLen = columns.length; i < iLen; i++) {
      columns[i].sType = null;
    }

    oSettings.aiDisplayMaster.push(iRow);
    var id = oSettings.rowIdFn(aDataIn);

    if (id !== undefined) {
      oSettings.aIds[id] = oData;
    }

    if (nTr || !oSettings.oFeatures.bDeferRender) {
      _fnCreateTr(oSettings, iRow, nTr, anTds);
    }

    return iRow;
  }

  function _fnAddTr(settings, trs) {
    var row;

    if (!(trs instanceof $)) {
      trs = $(trs);
    }

    return trs.map(function (i, el) {
      row = _fnGetRowElements(settings, el);
      return _fnAddData(settings, row.data, el, row.cells);
    });
  }

  function _fnNodeToDataIndex(oSettings, n) {
    return n._DT_RowIndex !== undefined ? n._DT_RowIndex : null;
  }

  function _fnNodeToColumnIndex(oSettings, iRow, n) {
    return $.inArray(n, oSettings.aoData[iRow].anCells);
  }

  function _fnGetCellData(settings, rowIdx, colIdx, type) {
    var draw = settings.iDraw;
    var col = settings.aoColumns[colIdx];
    var rowData = settings.aoData[rowIdx]._aData;
    var defaultContent = col.sDefaultContent;
    var cellData = col.fnGetData(rowData, type, {
      settings: settings,
      row: rowIdx,
      col: colIdx
    });

    if (cellData === undefined) {
      if (settings.iDrawError != draw && defaultContent === null) {
        _fnLog(settings, 0, "Requested unknown parameter " + (typeof col.mData == 'function' ? '{function}' : "'" + col.mData + "'") + " for row " + rowIdx + ", column " + colIdx, 4);

        settings.iDrawError = draw;
      }

      return defaultContent;
    }

    if ((cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined) {
      cellData = defaultContent;
    } else if (typeof cellData === 'function') {
      return cellData.call(rowData);
    }

    if (cellData === null && type == 'display') {
      return '';
    }

    return cellData;
  }

  function _fnSetCellData(settings, rowIdx, colIdx, val) {
    var col = settings.aoColumns[colIdx];
    var rowData = settings.aoData[rowIdx]._aData;
    col.fnSetData(rowData, val, {
      settings: settings,
      row: rowIdx,
      col: colIdx
    });
  }

  var __reArray = /\[.*?\]$/;
  var __reFn = /\(\)$/;

  function _fnSplitObjNotation(str) {
    return $.map(str.match(/(\\.|[^\.])+/g) || [''], function (s) {
      return s.replace(/\\\./g, '.');
    });
  }

  function _fnGetObjectDataFn(mSource) {
    if ($.isPlainObject(mSource)) {
      var o = {};
      $.each(mSource, function (key, val) {
        if (val) {
          o[key] = _fnGetObjectDataFn(val);
        }
      });
      return function (data, type, row, meta) {
        var t = o[type] || o._;
        return t !== undefined ? t(data, type, row, meta) : data;
      };
    } else if (mSource === null) {
      return function (data) {
        return data;
      };
    } else if (typeof mSource === 'function') {
      return function (data, type, row, meta) {
        return mSource(data, type, row, meta);
      };
    } else if (typeof mSource === 'string' && (mSource.indexOf('.') !== -1 || mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1)) {
      var fetchData = function fetchData(data, type, src) {
        var arrayNotation, funcNotation, out, innerSrc;

        if (src !== "") {
          var a = _fnSplitObjNotation(src);

          for (var i = 0, iLen = a.length; i < iLen; i++) {
            arrayNotation = a[i].match(__reArray);
            funcNotation = a[i].match(__reFn);

            if (arrayNotation) {
              a[i] = a[i].replace(__reArray, '');

              if (a[i] !== "") {
                data = data[a[i]];
              }

              out = [];
              a.splice(0, i + 1);
              innerSrc = a.join('.');

              if ($.isArray(data)) {
                for (var j = 0, jLen = data.length; j < jLen; j++) {
                  out.push(fetchData(data[j], type, innerSrc));
                }
              }

              var join = arrayNotation[0].substring(1, arrayNotation[0].length - 1);
              data = join === "" ? out : out.join(join);
              break;
            } else if (funcNotation) {
              a[i] = a[i].replace(__reFn, '');
              data = data[a[i]]();
              continue;
            }

            if (data === null || data[a[i]] === undefined) {
              return undefined;
            }

            data = data[a[i]];
          }
        }

        return data;
      };

      return function (data, type) {
        return fetchData(data, type, mSource);
      };
    } else {
      return function (data, type) {
        return data[mSource];
      };
    }
  }

  function _fnSetObjectDataFn(mSource) {
    if ($.isPlainObject(mSource)) {
      return _fnSetObjectDataFn(mSource._);
    } else if (mSource === null) {
      return function () {};
    } else if (typeof mSource === 'function') {
      return function (data, val, meta) {
        mSource(data, 'set', val, meta);
      };
    } else if (typeof mSource === 'string' && (mSource.indexOf('.') !== -1 || mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1)) {
      var setData = function setData(data, val, src) {
        var a = _fnSplitObjNotation(src),
            b;

        var aLast = a[a.length - 1];
        var arrayNotation, funcNotation, o, innerSrc;

        for (var i = 0, iLen = a.length - 1; i < iLen; i++) {
          arrayNotation = a[i].match(__reArray);
          funcNotation = a[i].match(__reFn);

          if (arrayNotation) {
            a[i] = a[i].replace(__reArray, '');
            data[a[i]] = [];
            b = a.slice();
            b.splice(0, i + 1);
            innerSrc = b.join('.');

            if ($.isArray(val)) {
              for (var j = 0, jLen = val.length; j < jLen; j++) {
                o = {};
                setData(o, val[j], innerSrc);
                data[a[i]].push(o);
              }
            } else {
              data[a[i]] = val;
            }

            return;
          } else if (funcNotation) {
            a[i] = a[i].replace(__reFn, '');
            data = data[a[i]](val);
          }

          if (data[a[i]] === null || data[a[i]] === undefined) {
            data[a[i]] = {};
          }

          data = data[a[i]];
        }

        if (aLast.match(__reFn)) {
          data = data[aLast.replace(__reFn, '')](val);
        } else {
          data[aLast.replace(__reArray, '')] = val;
        }
      };

      return function (data, val) {
        return setData(data, val, mSource);
      };
    } else {
      return function (data, val) {
        data[mSource] = val;
      };
    }
  }

  function _fnGetDataMaster(settings) {
    return _pluck(settings.aoData, '_aData');
  }

  function _fnClearTable(settings) {
    settings.aoData.length = 0;
    settings.aiDisplayMaster.length = 0;
    settings.aiDisplay.length = 0;
    settings.aIds = {};
  }

  function _fnDeleteIndex(a, iTarget, splice) {
    var iTargetIndex = -1;

    for (var i = 0, iLen = a.length; i < iLen; i++) {
      if (a[i] == iTarget) {
        iTargetIndex = i;
      } else if (a[i] > iTarget) {
        a[i]--;
      }
    }

    if (iTargetIndex != -1 && splice === undefined) {
      a.splice(iTargetIndex, 1);
    }
  }

  function _fnInvalidate(settings, rowIdx, src, colIdx) {
    var row = settings.aoData[rowIdx];
    var i, ien;

    var cellWrite = function cellWrite(cell, col) {
      while (cell.childNodes.length) {
        cell.removeChild(cell.firstChild);
      }

      cell.innerHTML = _fnGetCellData(settings, rowIdx, col, 'display');
    };

    if (src === 'dom' || (!src || src === 'auto') && row.src === 'dom') {
      row._aData = _fnGetRowElements(settings, row, colIdx, colIdx === undefined ? undefined : row._aData).data;
    } else {
      var cells = row.anCells;

      if (cells) {
        if (colIdx !== undefined) {
          cellWrite(cells[colIdx], colIdx);
        } else {
          for (i = 0, ien = cells.length; i < ien; i++) {
            cellWrite(cells[i], i);
          }
        }
      }
    }

    row._aSortData = null;
    row._aFilterData = null;
    var cols = settings.aoColumns;

    if (colIdx !== undefined) {
      cols[colIdx].sType = null;
    } else {
      for (i = 0, ien = cols.length; i < ien; i++) {
        cols[i].sType = null;
      }

      _fnRowAttributes(settings, row);
    }
  }

  function _fnGetRowElements(settings, row, colIdx, d) {
    var tds = [],
        td = row.firstChild,
        name,
        col,
        o,
        i = 0,
        contents,
        columns = settings.aoColumns,
        objectRead = settings._rowReadObject;
    d = d !== undefined ? d : objectRead ? {} : [];

    var attr = function attr(str, td) {
      if (typeof str === 'string') {
        var idx = str.indexOf('@');

        if (idx !== -1) {
          var attr = str.substring(idx + 1);

          var setter = _fnSetObjectDataFn(str);

          setter(d, td.getAttribute(attr));
        }
      }
    };

    var cellProcess = function cellProcess(cell) {
      if (colIdx === undefined || colIdx === i) {
        col = columns[i];
        contents = $.trim(cell.innerHTML);

        if (col && col._bAttrSrc) {
          var setter = _fnSetObjectDataFn(col.mData._);

          setter(d, contents);
          attr(col.mData.sort, cell);
          attr(col.mData.type, cell);
          attr(col.mData.filter, cell);
        } else {
          if (objectRead) {
            if (!col._setter) {
              col._setter = _fnSetObjectDataFn(col.mData);
            }

            col._setter(d, contents);
          } else {
            d[i] = contents;
          }
        }
      }

      i++;
    };

    if (td) {
      while (td) {
        name = td.nodeName.toUpperCase();

        if (name == "TD" || name == "TH") {
          cellProcess(td);
          tds.push(td);
        }

        td = td.nextSibling;
      }
    } else {
      tds = row.anCells;

      for (var j = 0, jen = tds.length; j < jen; j++) {
        cellProcess(tds[j]);
      }
    }

    var rowNode = row.firstChild ? row : row.nTr;

    if (rowNode) {
      var id = rowNode.getAttribute('id');

      if (id) {
        _fnSetObjectDataFn(settings.rowId)(d, id);
      }
    }

    return {
      data: d,
      cells: tds
    };
  }

  function _fnCreateTr(oSettings, iRow, nTrIn, anTds) {
    var row = oSettings.aoData[iRow],
        rowData = row._aData,
        cells = [],
        nTr,
        nTd,
        oCol,
        i,
        iLen;

    if (row.nTr === null) {
      nTr = nTrIn || document.createElement('tr');
      row.nTr = nTr;
      row.anCells = cells;
      nTr._DT_RowIndex = iRow;

      _fnRowAttributes(oSettings, row);

      for (i = 0, iLen = oSettings.aoColumns.length; i < iLen; i++) {
        oCol = oSettings.aoColumns[i];
        nTd = nTrIn ? anTds[i] : document.createElement(oCol.sCellType);
        nTd._DT_CellIndex = {
          row: iRow,
          column: i
        };
        cells.push(nTd);

        if ((!nTrIn || oCol.mRender || oCol.mData !== i) && (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i + '.display')) {
          nTd.innerHTML = _fnGetCellData(oSettings, iRow, i, 'display');
        }

        if (oCol.sClass) {
          nTd.className += ' ' + oCol.sClass;
        }

        if (oCol.bVisible && !nTrIn) {
          nTr.appendChild(nTd);
        } else if (!oCol.bVisible && nTrIn) {
          nTd.parentNode.removeChild(nTd);
        }

        if (oCol.fnCreatedCell) {
          oCol.fnCreatedCell.call(oSettings.oInstance, nTd, _fnGetCellData(oSettings, iRow, i), rowData, iRow, i);
        }
      }

      _fnCallbackFire(oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells]);
    }

    row.nTr.setAttribute('role', 'row');
  }

  function _fnRowAttributes(settings, row) {
    var tr = row.nTr;
    var data = row._aData;

    if (tr) {
      var id = settings.rowIdFn(data);

      if (id) {
        tr.id = id;
      }

      if (data.DT_RowClass) {
        var a = data.DT_RowClass.split(' ');
        row.__rowc = row.__rowc ? _unique(row.__rowc.concat(a)) : a;
        $(tr).removeClass(row.__rowc.join(' ')).addClass(data.DT_RowClass);
      }

      if (data.DT_RowAttr) {
        $(tr).attr(data.DT_RowAttr);
      }

      if (data.DT_RowData) {
        $(tr).data(data.DT_RowData);
      }
    }
  }

  function _fnBuildHead(oSettings) {
    var i, ien, cell, row, column;
    var thead = oSettings.nTHead;
    var tfoot = oSettings.nTFoot;
    var createHeader = $('th, td', thead).length === 0;
    var classes = oSettings.oClasses;
    var columns = oSettings.aoColumns;

    if (createHeader) {
      row = $('<tr/>').appendTo(thead);
    }

    for (i = 0, ien = columns.length; i < ien; i++) {
      column = columns[i];
      cell = $(column.nTh).addClass(column.sClass);

      if (createHeader) {
        cell.appendTo(row);
      }

      if (oSettings.oFeatures.bSort) {
        cell.addClass(column.sSortingClass);

        if (column.bSortable !== false) {
          cell.attr('tabindex', oSettings.iTabIndex).attr('aria-controls', oSettings.sTableId);

          _fnSortAttachListener(oSettings, column.nTh, i);
        }
      }

      if (column.sTitle != cell[0].innerHTML) {
        cell.html(column.sTitle);
      }

      _fnRenderer(oSettings, 'header')(oSettings, cell, column, classes);
    }

    if (createHeader) {
      _fnDetectHeader(oSettings.aoHeader, thead);
    }

    $(thead).find('>tr').attr('role', 'row');
    $(thead).find('>tr>th, >tr>td').addClass(classes.sHeaderTH);
    $(tfoot).find('>tr>th, >tr>td').addClass(classes.sFooterTH);

    if (tfoot !== null) {
      var cells = oSettings.aoFooter[0];

      for (i = 0, ien = cells.length; i < ien; i++) {
        column = columns[i];
        column.nTf = cells[i].cell;

        if (column.sClass) {
          $(column.nTf).addClass(column.sClass);
        }
      }
    }
  }

  function _fnDrawHead(oSettings, aoSource, bIncludeHidden) {
    var i, iLen, j, jLen, k, kLen, n, nLocalTr;
    var aoLocal = [];
    var aApplied = [];
    var iColumns = oSettings.aoColumns.length;
    var iRowspan, iColspan;

    if (!aoSource) {
      return;
    }

    if (bIncludeHidden === undefined) {
      bIncludeHidden = false;
    }

    for (i = 0, iLen = aoSource.length; i < iLen; i++) {
      aoLocal[i] = aoSource[i].slice();
      aoLocal[i].nTr = aoSource[i].nTr;

      for (j = iColumns - 1; j >= 0; j--) {
        if (!oSettings.aoColumns[j].bVisible && !bIncludeHidden) {
          aoLocal[i].splice(j, 1);
        }
      }

      aApplied.push([]);
    }

    for (i = 0, iLen = aoLocal.length; i < iLen; i++) {
      nLocalTr = aoLocal[i].nTr;

      if (nLocalTr) {
        while (n = nLocalTr.firstChild) {
          nLocalTr.removeChild(n);
        }
      }

      for (j = 0, jLen = aoLocal[i].length; j < jLen; j++) {
        iRowspan = 1;
        iColspan = 1;

        if (aApplied[i][j] === undefined) {
          nLocalTr.appendChild(aoLocal[i][j].cell);
          aApplied[i][j] = 1;

          while (aoLocal[i + iRowspan] !== undefined && aoLocal[i][j].cell == aoLocal[i + iRowspan][j].cell) {
            aApplied[i + iRowspan][j] = 1;
            iRowspan++;
          }

          while (aoLocal[i][j + iColspan] !== undefined && aoLocal[i][j].cell == aoLocal[i][j + iColspan].cell) {
            for (k = 0; k < iRowspan; k++) {
              aApplied[i + k][j + iColspan] = 1;
            }

            iColspan++;
          }

          $(aoLocal[i][j].cell).attr('rowspan', iRowspan).attr('colspan', iColspan);
        }
      }
    }
  }

  function _fnDraw(oSettings) {
    var aPreDraw = _fnCallbackFire(oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings]);

    if ($.inArray(false, aPreDraw) !== -1) {
      _fnProcessingDisplay(oSettings, false);

      return;
    }

    var i, iLen, n;
    var anRows = [];
    var iRowCount = 0;
    var asStripeClasses = oSettings.asStripeClasses;
    var iStripes = asStripeClasses.length;
    var iOpenRows = oSettings.aoOpenRows.length;
    var oLang = oSettings.oLanguage;
    var iInitDisplayStart = oSettings.iInitDisplayStart;
    var bServerSide = _fnDataSource(oSettings) == 'ssp';
    var aiDisplay = oSettings.aiDisplay;
    oSettings.bDrawing = true;

    if (iInitDisplayStart !== undefined && iInitDisplayStart !== -1) {
      oSettings._iDisplayStart = bServerSide ? iInitDisplayStart : iInitDisplayStart >= oSettings.fnRecordsDisplay() ? 0 : iInitDisplayStart;
      oSettings.iInitDisplayStart = -1;
    }

    var iDisplayStart = oSettings._iDisplayStart;
    var iDisplayEnd = oSettings.fnDisplayEnd();

    if (oSettings.bDeferLoading) {
      oSettings.bDeferLoading = false;
      oSettings.iDraw++;

      _fnProcessingDisplay(oSettings, false);
    } else if (!bServerSide) {
      oSettings.iDraw++;
    } else if (!oSettings.bDestroying && !_fnAjaxUpdate(oSettings)) {
      return;
    }

    if (aiDisplay.length !== 0) {
      var iStart = bServerSide ? 0 : iDisplayStart;
      var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;

      for (var j = iStart; j < iEnd; j++) {
        var iDataIndex = aiDisplay[j];
        var aoData = oSettings.aoData[iDataIndex];

        if (aoData.nTr === null) {
          _fnCreateTr(oSettings, iDataIndex);
        }

        var nRow = aoData.nTr;

        if (iStripes !== 0) {
          var sStripe = asStripeClasses[iRowCount % iStripes];

          if (aoData._sRowStripe != sStripe) {
            $(nRow).removeClass(aoData._sRowStripe).addClass(sStripe);
            aoData._sRowStripe = sStripe;
          }
        }

        _fnCallbackFire(oSettings, 'aoRowCallback', null, [nRow, aoData._aData, iRowCount, j, iDataIndex]);

        anRows.push(nRow);
        iRowCount++;
      }
    } else {
      var sZero = oLang.sZeroRecords;

      if (oSettings.iDraw == 1 && _fnDataSource(oSettings) == 'ajax') {
        sZero = oLang.sLoadingRecords;
      } else if (oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0) {
        sZero = oLang.sEmptyTable;
      }

      anRows[0] = $('<tr/>', {
        'class': iStripes ? asStripeClasses[0] : ''
      }).append($('<td />', {
        'valign': 'top',
        'colSpan': _fnVisbleColumns(oSettings),
        'class': oSettings.oClasses.sRowEmpty
      }).html(sZero))[0];
    }

    _fnCallbackFire(oSettings, 'aoHeaderCallback', 'header', [$(oSettings.nTHead).children('tr')[0], _fnGetDataMaster(oSettings), iDisplayStart, iDisplayEnd, aiDisplay]);

    _fnCallbackFire(oSettings, 'aoFooterCallback', 'footer', [$(oSettings.nTFoot).children('tr')[0], _fnGetDataMaster(oSettings), iDisplayStart, iDisplayEnd, aiDisplay]);

    var body = $(oSettings.nTBody);
    body.children().detach();
    body.append($(anRows));

    _fnCallbackFire(oSettings, 'aoDrawCallback', 'draw', [oSettings]);

    oSettings.bSorted = false;
    oSettings.bFiltered = false;
    oSettings.bDrawing = false;
  }

  function _fnReDraw(settings, holdPosition) {
    var features = settings.oFeatures,
        sort = features.bSort,
        filter = features.bFilter;

    if (sort) {
      _fnSort(settings);
    }

    if (filter) {
      _fnFilterComplete(settings, settings.oPreviousSearch);
    } else {
      settings.aiDisplay = settings.aiDisplayMaster.slice();
    }

    if (holdPosition !== true) {
      settings._iDisplayStart = 0;
    }

    settings._drawHold = holdPosition;

    _fnDraw(settings);

    settings._drawHold = false;
  }

  function _fnAddOptionsHtml(oSettings) {
    var classes = oSettings.oClasses;
    var table = $(oSettings.nTable);
    var holding = $('<div/>').insertBefore(table);
    var features = oSettings.oFeatures;
    var insert = $('<div/>', {
      id: oSettings.sTableId + '_wrapper',
      'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' ' + classes.sNoFooter)
    });
    oSettings.nHolding = holding[0];
    oSettings.nTableWrapper = insert[0];
    oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
    var aDom = oSettings.sDom.split('');
    var featureNode, cOption, nNewNode, cNext, sAttr, j;

    for (var i = 0; i < aDom.length; i++) {
      featureNode = null;
      cOption = aDom[i];

      if (cOption == '<') {
        nNewNode = $('<div/>')[0];
        cNext = aDom[i + 1];

        if (cNext == "'" || cNext == '"') {
          sAttr = "";
          j = 2;

          while (aDom[i + j] != cNext) {
            sAttr += aDom[i + j];
            j++;
          }

          if (sAttr == "H") {
            sAttr = classes.sJUIHeader;
          } else if (sAttr == "F") {
            sAttr = classes.sJUIFooter;
          }

          if (sAttr.indexOf('.') != -1) {
            var aSplit = sAttr.split('.');
            nNewNode.id = aSplit[0].substr(1, aSplit[0].length - 1);
            nNewNode.className = aSplit[1];
          } else if (sAttr.charAt(0) == "#") {
            nNewNode.id = sAttr.substr(1, sAttr.length - 1);
          } else {
            nNewNode.className = sAttr;
          }

          i += j;
        }

        insert.append(nNewNode);
        insert = $(nNewNode);
      } else if (cOption == '>') {
        insert = insert.parent();
      } else if (cOption == 'l' && features.bPaginate && features.bLengthChange) {
          featureNode = _fnFeatureHtmlLength(oSettings);
        } else if (cOption == 'f' && features.bFilter) {
          featureNode = _fnFeatureHtmlFilter(oSettings);
        } else if (cOption == 'r' && features.bProcessing) {
          featureNode = _fnFeatureHtmlProcessing(oSettings);
        } else if (cOption == 't') {
          featureNode = _fnFeatureHtmlTable(oSettings);
        } else if (cOption == 'i' && features.bInfo) {
          featureNode = _fnFeatureHtmlInfo(oSettings);
        } else if (cOption == 'p' && features.bPaginate) {
          featureNode = _fnFeatureHtmlPaginate(oSettings);
        } else if (DataTable.ext.feature.length !== 0) {
          var aoFeatures = DataTable.ext.feature;

          for (var k = 0, kLen = aoFeatures.length; k < kLen; k++) {
            if (cOption == aoFeatures[k].cFeature) {
              featureNode = aoFeatures[k].fnInit(oSettings);
              break;
            }
          }
        }

      if (featureNode) {
        var aanFeatures = oSettings.aanFeatures;

        if (!aanFeatures[cOption]) {
          aanFeatures[cOption] = [];
        }

        aanFeatures[cOption].push(featureNode);
        insert.append(featureNode);
      }
    }

    holding.replaceWith(insert);
    oSettings.nHolding = null;
  }

  function _fnDetectHeader(aLayout, nThead) {
    var nTrs = $(nThead).children('tr');
    var nTr, nCell;
    var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
    var bUnique;

    var fnShiftCol = function fnShiftCol(a, i, j) {
      var k = a[i];

      while (k[j]) {
        j++;
      }

      return j;
    };

    aLayout.splice(0, aLayout.length);

    for (i = 0, iLen = nTrs.length; i < iLen; i++) {
      aLayout.push([]);
    }

    for (i = 0, iLen = nTrs.length; i < iLen; i++) {
      nTr = nTrs[i];
      iColumn = 0;
      nCell = nTr.firstChild;

      while (nCell) {
        if (nCell.nodeName.toUpperCase() == "TD" || nCell.nodeName.toUpperCase() == "TH") {
          iColspan = nCell.getAttribute('colspan') * 1;
          iRowspan = nCell.getAttribute('rowspan') * 1;
          iColspan = !iColspan || iColspan === 0 || iColspan === 1 ? 1 : iColspan;
          iRowspan = !iRowspan || iRowspan === 0 || iRowspan === 1 ? 1 : iRowspan;
          iColShifted = fnShiftCol(aLayout, i, iColumn);
          bUnique = iColspan === 1 ? true : false;

          for (l = 0; l < iColspan; l++) {
            for (k = 0; k < iRowspan; k++) {
              aLayout[i + k][iColShifted + l] = {
                "cell": nCell,
                "unique": bUnique
              };
              aLayout[i + k].nTr = nTr;
            }
          }
        }

        nCell = nCell.nextSibling;
      }
    }
  }

  function _fnGetUniqueThs(oSettings, nHeader, aLayout) {
    var aReturn = [];

    if (!aLayout) {
      aLayout = oSettings.aoHeader;

      if (nHeader) {
        aLayout = [];

        _fnDetectHeader(aLayout, nHeader);
      }
    }

    for (var i = 0, iLen = aLayout.length; i < iLen; i++) {
      for (var j = 0, jLen = aLayout[i].length; j < jLen; j++) {
        if (aLayout[i][j].unique && (!aReturn[j] || !oSettings.bSortCellsTop)) {
          aReturn[j] = aLayout[i][j].cell;
        }
      }
    }

    return aReturn;
  }

  function _fnBuildAjax(oSettings, data, fn) {
    _fnCallbackFire(oSettings, 'aoServerParams', 'serverParams', [data]);

    if (data && $.isArray(data)) {
      var tmp = {};
      var rbracket = /(.*?)\[\]$/;
      $.each(data, function (key, val) {
        var match = val.name.match(rbracket);

        if (match) {
          var name = match[0];

          if (!tmp[name]) {
            tmp[name] = [];
          }

          tmp[name].push(val.value);
        } else {
          tmp[val.name] = val.value;
        }
      });
      data = tmp;
    }

    var ajaxData;
    var ajax = oSettings.ajax;
    var instance = oSettings.oInstance;

    var callback = function callback(json) {
      _fnCallbackFire(oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR]);

      fn(json);
    };

    if ($.isPlainObject(ajax) && ajax.data) {
      ajaxData = ajax.data;
      var newData = typeof ajaxData === 'function' ? ajaxData(data, oSettings) : ajaxData;
      data = typeof ajaxData === 'function' && newData ? newData : $.extend(true, data, newData);
      delete ajax.data;
    }

    var baseAjax = {
      "data": data,
      "success": function success(json) {
        var error = json.error || json.sError;

        if (error) {
          _fnLog(oSettings, 0, error);
        }

        oSettings.json = json;
        callback(json);
      },
      "dataType": "json",
      "cache": false,
      "type": oSettings.sServerMethod,
      "error": function error(xhr, _error, thrown) {
        var ret = _fnCallbackFire(oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR]);

        if ($.inArray(true, ret) === -1) {
          if (_error == "parsererror") {
            _fnLog(oSettings, 0, 'Invalid JSON response', 1);
          } else if (xhr.readyState === 4) {
            _fnLog(oSettings, 0, 'Ajax error', 7);
          }
        }

        _fnProcessingDisplay(oSettings, false);
      }
    };
    oSettings.oAjaxData = data;

    _fnCallbackFire(oSettings, null, 'preXhr', [oSettings, data]);

    if (oSettings.fnServerData) {
      oSettings.fnServerData.call(instance, oSettings.sAjaxSource, $.map(data, function (val, key) {
        return {
          name: key,
          value: val
        };
      }), callback, oSettings);
    } else if (oSettings.sAjaxSource || typeof ajax === 'string') {
      oSettings.jqXHR = $.ajax($.extend(baseAjax, {
        url: ajax || oSettings.sAjaxSource
      }));
    } else if (typeof ajax === 'function') {
      oSettings.jqXHR = ajax.call(instance, data, callback, oSettings);
    } else {
      oSettings.jqXHR = $.ajax($.extend(baseAjax, ajax));
      ajax.data = ajaxData;
    }
  }

  function _fnAjaxUpdate(settings) {
    if (settings.bAjaxDataGet) {
      settings.iDraw++;

      _fnProcessingDisplay(settings, true);

      _fnBuildAjax(settings, _fnAjaxParameters(settings), function (json) {
        _fnAjaxUpdateDraw(settings, json);
      });

      return false;
    }

    return true;
  }

  function _fnAjaxParameters(settings) {
    var columns = settings.aoColumns,
        columnCount = columns.length,
        features = settings.oFeatures,
        preSearch = settings.oPreviousSearch,
        preColSearch = settings.aoPreSearchCols,
        i,
        data = [],
        dataProp,
        column,
        columnSearch,
        sort = _fnSortFlatten(settings),
        displayStart = settings._iDisplayStart,
        displayLength = features.bPaginate !== false ? settings._iDisplayLength : -1;

    var param = function param(name, value) {
      data.push({
        'name': name,
        'value': value
      });
    };

    param('sEcho', settings.iDraw);
    param('iColumns', columnCount);
    param('sColumns', _pluck(columns, 'sName').join(','));
    param('iDisplayStart', displayStart);
    param('iDisplayLength', displayLength);
    var d = {
      draw: settings.iDraw,
      columns: [],
      order: [],
      start: displayStart,
      length: displayLength,
      search: {
        value: preSearch.sSearch,
        regex: preSearch.bRegex
      }
    };

    for (i = 0; i < columnCount; i++) {
      column = columns[i];
      columnSearch = preColSearch[i];
      dataProp = typeof column.mData == "function" ? 'function' : column.mData;
      d.columns.push({
        data: dataProp,
        name: column.sName,
        searchable: column.bSearchable,
        orderable: column.bSortable,
        search: {
          value: columnSearch.sSearch,
          regex: columnSearch.bRegex
        }
      });
      param("mDataProp_" + i, dataProp);

      if (features.bFilter) {
        param('sSearch_' + i, columnSearch.sSearch);
        param('bRegex_' + i, columnSearch.bRegex);
        param('bSearchable_' + i, column.bSearchable);
      }

      if (features.bSort) {
        param('bSortable_' + i, column.bSortable);
      }
    }

    if (features.bFilter) {
      param('sSearch', preSearch.sSearch);
      param('bRegex', preSearch.bRegex);
    }

    if (features.bSort) {
      $.each(sort, function (i, val) {
        d.order.push({
          column: val.col,
          dir: val.dir
        });
        param('iSortCol_' + i, val.col);
        param('sSortDir_' + i, val.dir);
      });
      param('iSortingCols', sort.length);
    }

    var legacy = DataTable.ext.legacy.ajax;

    if (legacy === null) {
      return settings.sAjaxSource ? data : d;
    }

    return legacy ? data : d;
  }

  function _fnAjaxUpdateDraw(settings, json) {
    var compat = function compat(old, modern) {
      return json[old] !== undefined ? json[old] : json[modern];
    };

    var data = _fnAjaxDataSrc(settings, json);

    var draw = compat('sEcho', 'draw');
    var recordsTotal = compat('iTotalRecords', 'recordsTotal');
    var recordsFiltered = compat('iTotalDisplayRecords', 'recordsFiltered');

    if (draw) {
      if (draw * 1 < settings.iDraw) {
        return;
      }

      settings.iDraw = draw * 1;
    }

    _fnClearTable(settings);

    settings._iRecordsTotal = parseInt(recordsTotal, 10);
    settings._iRecordsDisplay = parseInt(recordsFiltered, 10);

    for (var i = 0, ien = data.length; i < ien; i++) {
      _fnAddData(settings, data[i]);
    }

    settings.aiDisplay = settings.aiDisplayMaster.slice();
    settings.bAjaxDataGet = false;

    _fnDraw(settings);

    if (!settings._bInitComplete) {
      _fnInitComplete(settings, json);
    }

    settings.bAjaxDataGet = true;

    _fnProcessingDisplay(settings, false);
  }

  function _fnAjaxDataSrc(oSettings, json) {
    var dataSrc = $.isPlainObject(oSettings.ajax) && oSettings.ajax.dataSrc !== undefined ? oSettings.ajax.dataSrc : oSettings.sAjaxDataProp;

    if (dataSrc === 'data') {
      return json.aaData || json[dataSrc];
    }

    return dataSrc !== "" ? _fnGetObjectDataFn(dataSrc)(json) : json;
  }

  function _fnFeatureHtmlFilter(settings) {
    var classes = settings.oClasses;
    var tableId = settings.sTableId;
    var language = settings.oLanguage;
    var previousSearch = settings.oPreviousSearch;
    var features = settings.aanFeatures;
    var input = '<input type="search" class="' + classes.sFilterInput + '"/>';
    var str = language.sSearch;
    str = str.match(/_INPUT_/) ? str.replace('_INPUT_', input) : str + input;
    var filter = $('<div/>', {
      'id': !features.f ? tableId + '_filter' : null,
      'class': classes.sFilter
    }).append($('<label/>').append(str));

    var searchFn = function searchFn() {
      var n = features.f;
      var val = !this.value ? "" : this.value;

      if (val != previousSearch.sSearch) {
        _fnFilterComplete(settings, {
          "sSearch": val,
          "bRegex": previousSearch.bRegex,
          "bSmart": previousSearch.bSmart,
          "bCaseInsensitive": previousSearch.bCaseInsensitive
        });

        settings._iDisplayStart = 0;

        _fnDraw(settings);
      }
    };

    var searchDelay = settings.searchDelay !== null ? settings.searchDelay : _fnDataSource(settings) === 'ssp' ? 400 : 0;
    var jqFilter = $('input', filter).val(previousSearch.sSearch).attr('placeholder', language.sSearchPlaceholder).on('keyup.DT search.DT input.DT paste.DT cut.DT', searchDelay ? _fnThrottle(searchFn, searchDelay) : searchFn).on('keypress.DT', function (e) {
      if (e.keyCode == 13) {
        return false;
      }
    }).attr('aria-controls', tableId);
    $(settings.nTable).on('search.dt.DT', function (ev, s) {
      if (settings === s) {
        try {
          if (jqFilter[0] !== document.activeElement) {
            jqFilter.val(previousSearch.sSearch);
          }
        } catch (e) {}
      }
    });
    return filter[0];
  }

  function _fnFilterComplete(oSettings, oInput, iForce) {
    var oPrevSearch = oSettings.oPreviousSearch;
    var aoPrevSearch = oSettings.aoPreSearchCols;

    var fnSaveFilter = function fnSaveFilter(oFilter) {
      oPrevSearch.sSearch = oFilter.sSearch;
      oPrevSearch.bRegex = oFilter.bRegex;
      oPrevSearch.bSmart = oFilter.bSmart;
      oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
    };

    var fnRegex = function fnRegex(o) {
      return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
    };

    _fnColumnTypes(oSettings);

    if (_fnDataSource(oSettings) != 'ssp') {
      _fnFilter(oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive);

      fnSaveFilter(oInput);

      for (var i = 0; i < aoPrevSearch.length; i++) {
        _fnFilterColumn(oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]), aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive);
      }

      _fnFilterCustom(oSettings);
    } else {
      fnSaveFilter(oInput);
    }

    oSettings.bFiltered = true;

    _fnCallbackFire(oSettings, null, 'search', [oSettings]);
  }

  function _fnFilterCustom(settings) {
    var filters = DataTable.ext.search;
    var displayRows = settings.aiDisplay;
    var row, rowIdx;

    for (var i = 0, ien = filters.length; i < ien; i++) {
      var rows = [];

      for (var j = 0, jen = displayRows.length; j < jen; j++) {
        rowIdx = displayRows[j];
        row = settings.aoData[rowIdx];

        if (filters[i](settings, row._aFilterData, rowIdx, row._aData, j)) {
          rows.push(rowIdx);
        }
      }

      displayRows.length = 0;
      $.merge(displayRows, rows);
    }
  }

  function _fnFilterColumn(settings, searchStr, colIdx, regex, smart, caseInsensitive) {
    if (searchStr === '') {
      return;
    }

    var data;
    var out = [];
    var display = settings.aiDisplay;

    var rpSearch = _fnFilterCreateSearch(searchStr, regex, smart, caseInsensitive);

    for (var i = 0; i < display.length; i++) {
      data = settings.aoData[display[i]]._aFilterData[colIdx];

      if (rpSearch.test(data)) {
        out.push(display[i]);
      }
    }

    settings.aiDisplay = out;
  }

  function _fnFilter(settings, input, force, regex, smart, caseInsensitive) {
    var rpSearch = _fnFilterCreateSearch(input, regex, smart, caseInsensitive);

    var prevSearch = settings.oPreviousSearch.sSearch;
    var displayMaster = settings.aiDisplayMaster;
    var display, invalidated, i;
    var filtered = [];

    if (DataTable.ext.search.length !== 0) {
      force = true;
    }

    invalidated = _fnFilterData(settings);

    if (input.length <= 0) {
      settings.aiDisplay = displayMaster.slice();
    } else {
      if (invalidated || force || prevSearch.length > input.length || input.indexOf(prevSearch) !== 0 || settings.bSorted) {
          settings.aiDisplay = displayMaster.slice();
        }

      display = settings.aiDisplay;

      for (i = 0; i < display.length; i++) {
        if (rpSearch.test(settings.aoData[display[i]]._sFilterRow)) {
          filtered.push(display[i]);
        }
      }

      settings.aiDisplay = filtered;
    }
  }

  function _fnFilterCreateSearch(search, regex, smart, caseInsensitive) {
    search = regex ? search : _fnEscapeRegex(search);

    if (smart) {
      var a = $.map(search.match(/"[^"]+"|[^ ]+/g) || [''], function (word) {
        if (word.charAt(0) === '"') {
          var m = word.match(/^"(.*)"$/);
          word = m ? m[1] : word;
        }

        return word.replace('"', '');
      });
      search = '^(?=.*?' + a.join(')(?=.*?') + ').*$';
    }

    return new RegExp(search, caseInsensitive ? 'i' : '');
  }

  var _fnEscapeRegex = DataTable.util.escapeRegex;
  var __filter_div = $('<div>')[0];

  var __filter_div_textContent = __filter_div.textContent !== undefined;

  function _fnFilterData(settings) {
    var columns = settings.aoColumns;
    var column;
    var i, j, ien, jen, filterData, cellData, row;
    var fomatters = DataTable.ext.type.search;
    var wasInvalidated = false;

    for (i = 0, ien = settings.aoData.length; i < ien; i++) {
      row = settings.aoData[i];

      if (!row._aFilterData) {
        filterData = [];

        for (j = 0, jen = columns.length; j < jen; j++) {
          column = columns[j];

          if (column.bSearchable) {
            cellData = _fnGetCellData(settings, i, j, 'filter');

            if (fomatters[column.sType]) {
              cellData = fomatters[column.sType](cellData);
            }

            if (cellData === null) {
              cellData = '';
            }

            if (typeof cellData !== 'string' && cellData.toString) {
              cellData = cellData.toString();
            }
          } else {
            cellData = '';
          }

          if (cellData.indexOf && cellData.indexOf('&') !== -1) {
            __filter_div.innerHTML = cellData;
            cellData = __filter_div_textContent ? __filter_div.textContent : __filter_div.innerText;
          }

          if (cellData.replace) {
            cellData = cellData.replace(/[\r\n]/g, '');
          }

          filterData.push(cellData);
        }

        row._aFilterData = filterData;
        row._sFilterRow = filterData.join('  ');
        wasInvalidated = true;
      }
    }

    return wasInvalidated;
  }

  function _fnSearchToCamel(obj) {
    return {
      search: obj.sSearch,
      smart: obj.bSmart,
      regex: obj.bRegex,
      caseInsensitive: obj.bCaseInsensitive
    };
  }

  function _fnSearchToHung(obj) {
    return {
      sSearch: obj.search,
      bSmart: obj.smart,
      bRegex: obj.regex,
      bCaseInsensitive: obj.caseInsensitive
    };
  }

  function _fnFeatureHtmlInfo(settings) {
    var tid = settings.sTableId,
        nodes = settings.aanFeatures.i,
        n = $('<div/>', {
      'class': settings.oClasses.sInfo,
      'id': !nodes ? tid + '_info' : null
    });

    if (!nodes) {
      settings.aoDrawCallback.push({
        "fn": _fnUpdateInfo,
        "sName": "information"
      });
      n.attr('role', 'status').attr('aria-live', 'polite');
      $(settings.nTable).attr('aria-describedby', tid + '_info');
    }

    return n[0];
  }

  function _fnUpdateInfo(settings) {
    var nodes = settings.aanFeatures.i;

    if (nodes.length === 0) {
      return;
    }

    var lang = settings.oLanguage,
        start = settings._iDisplayStart + 1,
        end = settings.fnDisplayEnd(),
        max = settings.fnRecordsTotal(),
        total = settings.fnRecordsDisplay(),
        out = total ? lang.sInfo : lang.sInfoEmpty;

    if (total !== max) {
      out += ' ' + lang.sInfoFiltered;
    }

    out += lang.sInfoPostFix;
    out = _fnInfoMacros(settings, out);
    var callback = lang.fnInfoCallback;

    if (callback !== null) {
      out = callback.call(settings.oInstance, settings, start, end, max, total, out);
    }

    $(nodes).html(out);
  }

  function _fnInfoMacros(settings, str) {
    var formatter = settings.fnFormatNumber,
        start = settings._iDisplayStart + 1,
        len = settings._iDisplayLength,
        vis = settings.fnRecordsDisplay(),
        all = len === -1;
    return str.replace(/_START_/g, formatter.call(settings, start)).replace(/_END_/g, formatter.call(settings, settings.fnDisplayEnd())).replace(/_MAX_/g, formatter.call(settings, settings.fnRecordsTotal())).replace(/_TOTAL_/g, formatter.call(settings, vis)).replace(/_PAGE_/g, formatter.call(settings, all ? 1 : Math.ceil(start / len))).replace(/_PAGES_/g, formatter.call(settings, all ? 1 : Math.ceil(vis / len)));
  }

  function _fnInitialise(settings) {
    var i,
        iLen,
        iAjaxStart = settings.iInitDisplayStart;
    var columns = settings.aoColumns,
        column;
    var features = settings.oFeatures;
    var deferLoading = settings.bDeferLoading;

    if (!settings.bInitialised) {
      setTimeout(function () {
        _fnInitialise(settings);
      }, 200);
      return;
    }

    _fnAddOptionsHtml(settings);

    _fnBuildHead(settings);

    _fnDrawHead(settings, settings.aoHeader);

    _fnDrawHead(settings, settings.aoFooter);

    _fnProcessingDisplay(settings, true);

    if (features.bAutoWidth) {
      _fnCalculateColumnWidths(settings);
    }

    for (i = 0, iLen = columns.length; i < iLen; i++) {
      column = columns[i];

      if (column.sWidth) {
        column.nTh.style.width = _fnStringToCss(column.sWidth);
      }
    }

    _fnCallbackFire(settings, null, 'preInit', [settings]);

    _fnReDraw(settings);

    var dataSrc = _fnDataSource(settings);

    if (dataSrc != 'ssp' || deferLoading) {
      if (dataSrc == 'ajax') {
        _fnBuildAjax(settings, [], function (json) {
          var aData = _fnAjaxDataSrc(settings, json);

          for (i = 0; i < aData.length; i++) {
            _fnAddData(settings, aData[i]);
          }

          settings.iInitDisplayStart = iAjaxStart;

          _fnReDraw(settings);

          _fnProcessingDisplay(settings, false);

          _fnInitComplete(settings, json);
        }, settings);
      } else {
        _fnProcessingDisplay(settings, false);

        _fnInitComplete(settings);
      }
    }
  }

  function _fnInitComplete(settings, json) {
    settings._bInitComplete = true;

    if (json || settings.oInit.aaData) {
      _fnAdjustColumnSizing(settings);
    }

    _fnCallbackFire(settings, null, 'plugin-init', [settings, json]);

    _fnCallbackFire(settings, 'aoInitComplete', 'init', [settings, json]);
  }

  function _fnLengthChange(settings, val) {
    var len = parseInt(val, 10);
    settings._iDisplayLength = len;

    _fnLengthOverflow(settings);

    _fnCallbackFire(settings, null, 'length', [settings, len]);
  }

  function _fnFeatureHtmlLength(settings) {
    var classes = settings.oClasses,
        tableId = settings.sTableId,
        menu = settings.aLengthMenu,
        d2 = $.isArray(menu[0]),
        lengths = d2 ? menu[0] : menu,
        language = d2 ? menu[1] : menu;
    var select = $('<select/>', {
      'name': tableId + '_length',
      'aria-controls': tableId,
      'class': classes.sLengthSelect
    });

    for (var i = 0, ien = lengths.length; i < ien; i++) {
      select[0][i] = new Option(typeof language[i] === 'number' ? settings.fnFormatNumber(language[i]) : language[i], lengths[i]);
    }

    var div = $('<div><label/></div>').addClass(classes.sLength);

    if (!settings.aanFeatures.l) {
      div[0].id = tableId + '_length';
    }

    div.children().append(settings.oLanguage.sLengthMenu.replace('_MENU_', select[0].outerHTML));
    $('select', div).val(settings._iDisplayLength).on('change.DT', function (e) {
      _fnLengthChange(settings, $(this).val());

      _fnDraw(settings);
    });
    $(settings.nTable).on('length.dt.DT', function (e, s, len) {
      if (settings === s) {
        $('select', div).val(len);
      }
    });
    return div[0];
  }

  function _fnFeatureHtmlPaginate(settings) {
    var type = settings.sPaginationType,
        plugin = DataTable.ext.pager[type],
        modern = typeof plugin === 'function',
        redraw = function redraw(settings) {
      _fnDraw(settings);
    },
        node = $('<div/>').addClass(settings.oClasses.sPaging + type)[0],
        features = settings.aanFeatures;

    if (!modern) {
      plugin.fnInit(settings, node, redraw);
    }

    if (!features.p) {
      node.id = settings.sTableId + '_paginate';
      settings.aoDrawCallback.push({
        "fn": function fn(settings) {
          if (modern) {
            var start = settings._iDisplayStart,
                len = settings._iDisplayLength,
                visRecords = settings.fnRecordsDisplay(),
                all = len === -1,
                page = all ? 0 : Math.ceil(start / len),
                pages = all ? 1 : Math.ceil(visRecords / len),
                buttons = plugin(page, pages),
                i,
                ien;

            for (i = 0, ien = features.p.length; i < ien; i++) {
              _fnRenderer(settings, 'pageButton')(settings, features.p[i], i, buttons, page, pages);
            }
          } else {
            plugin.fnUpdate(settings, redraw);
          }
        },
        "sName": "pagination"
      });
    }

    return node;
  }

  function _fnPageChange(settings, action, redraw) {
    var start = settings._iDisplayStart,
        len = settings._iDisplayLength,
        records = settings.fnRecordsDisplay();

    if (records === 0 || len === -1) {
      start = 0;
    } else if (typeof action === "number") {
      start = action * len;

      if (start > records) {
        start = 0;
      }
    } else if (action == "first") {
      start = 0;
    } else if (action == "previous") {
      start = len >= 0 ? start - len : 0;

      if (start < 0) {
        start = 0;
      }
    } else if (action == "next") {
      if (start + len < records) {
        start += len;
      }
    } else if (action == "last") {
      start = Math.floor((records - 1) / len) * len;
    } else {
      _fnLog(settings, 0, "Unknown paging action: " + action, 5);
    }

    var changed = settings._iDisplayStart !== start;
    settings._iDisplayStart = start;

    if (changed) {
      _fnCallbackFire(settings, null, 'page', [settings]);

      if (redraw) {
        _fnDraw(settings);
      }
    }

    return changed;
  }

  function _fnFeatureHtmlProcessing(settings) {
    return $('<div/>', {
      'id': !settings.aanFeatures.r ? settings.sTableId + '_processing' : null,
      'class': settings.oClasses.sProcessing
    }).html(settings.oLanguage.sProcessing).insertBefore(settings.nTable)[0];
  }

  function _fnProcessingDisplay(settings, show) {
    if (settings.oFeatures.bProcessing) {
      $(settings.aanFeatures.r).css('display', show ? 'block' : 'none');
    }

    _fnCallbackFire(settings, null, 'processing', [settings, show]);
  }

  function _fnFeatureHtmlTable(settings) {
    var table = $(settings.nTable);
    table.attr('role', 'grid');
    var scroll = settings.oScroll;

    if (scroll.sX === '' && scroll.sY === '') {
      return settings.nTable;
    }

    var scrollX = scroll.sX;
    var scrollY = scroll.sY;
    var classes = settings.oClasses;
    var caption = table.children('caption');
    var captionSide = caption.length ? caption[0]._captionSide : null;
    var headerClone = $(table[0].cloneNode(false));
    var footerClone = $(table[0].cloneNode(false));
    var footer = table.children('tfoot');
    var _div = '<div/>';

    var size = function size(s) {
      return !s ? null : _fnStringToCss(s);
    };

    if (!footer.length) {
      footer = null;
    }

    var scroller = $(_div, {
      'class': classes.sScrollWrapper
    }).append($(_div, {
      'class': classes.sScrollHead
    }).css({
      overflow: 'hidden',
      position: 'relative',
      border: 0,
      width: scrollX ? size(scrollX) : '100%'
    }).append($(_div, {
      'class': classes.sScrollHeadInner
    }).css({
      'box-sizing': 'content-box',
      width: scroll.sXInner || '100%'
    }).append(headerClone.removeAttr('id').css('margin-left', 0).append(captionSide === 'top' ? caption : null).append(table.children('thead'))))).append($(_div, {
      'class': classes.sScrollBody
    }).css({
      position: 'relative',
      overflow: 'auto',
      width: size(scrollX)
    }).append(table));

    if (footer) {
      scroller.append($(_div, {
        'class': classes.sScrollFoot
      }).css({
        overflow: 'hidden',
        border: 0,
        width: scrollX ? size(scrollX) : '100%'
      }).append($(_div, {
        'class': classes.sScrollFootInner
      }).append(footerClone.removeAttr('id').css('margin-left', 0).append(captionSide === 'bottom' ? caption : null).append(table.children('tfoot')))));
    }

    var children = scroller.children();
    var scrollHead = children[0];
    var scrollBody = children[1];
    var scrollFoot = footer ? children[2] : null;

    if (scrollX) {
      $(scrollBody).on('scroll.DT', function (e) {
        var scrollLeft = this.scrollLeft;
        scrollHead.scrollLeft = scrollLeft;

        if (footer) {
          scrollFoot.scrollLeft = scrollLeft;
        }
      });
    }

    $(scrollBody).css(scrollY && scroll.bCollapse ? 'max-height' : 'height', scrollY);
    settings.nScrollHead = scrollHead;
    settings.nScrollBody = scrollBody;
    settings.nScrollFoot = scrollFoot;
    settings.aoDrawCallback.push({
      "fn": _fnScrollDraw,
      "sName": "scrolling"
    });
    return scroller[0];
  }

  function _fnScrollDraw(settings) {
    var scroll = settings.oScroll,
        scrollX = scroll.sX,
        scrollXInner = scroll.sXInner,
        scrollY = scroll.sY,
        barWidth = scroll.iBarWidth,
        divHeader = $(settings.nScrollHead),
        divHeaderStyle = divHeader[0].style,
        divHeaderInner = divHeader.children('div'),
        divHeaderInnerStyle = divHeaderInner[0].style,
        divHeaderTable = divHeaderInner.children('table'),
        divBodyEl = settings.nScrollBody,
        divBody = $(divBodyEl),
        divBodyStyle = divBodyEl.style,
        divFooter = $(settings.nScrollFoot),
        divFooterInner = divFooter.children('div'),
        divFooterTable = divFooterInner.children('table'),
        header = $(settings.nTHead),
        table = $(settings.nTable),
        tableEl = table[0],
        tableStyle = tableEl.style,
        footer = settings.nTFoot ? $(settings.nTFoot) : null,
        browser = settings.oBrowser,
        ie67 = browser.bScrollOversize,
        dtHeaderCells = _pluck(settings.aoColumns, 'nTh'),
        headerTrgEls,
        footerTrgEls,
        headerSrcEls,
        footerSrcEls,
        headerCopy,
        footerCopy,
        headerWidths = [],
        footerWidths = [],
        headerContent = [],
        footerContent = [],
        idx,
        correction,
        sanityWidth,
        zeroOut = function zeroOut(nSizer) {
      var style = nSizer.style;
      style.paddingTop = "0";
      style.paddingBottom = "0";
      style.borderTopWidth = "0";
      style.borderBottomWidth = "0";
      style.height = 0;
    };

    var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;

    if (settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined) {
      settings.scrollBarVis = scrollBarVis;

      _fnAdjustColumnSizing(settings);

      return;
    } else {
      settings.scrollBarVis = scrollBarVis;
    }

    table.children('thead, tfoot').remove();

    if (footer) {
      footerCopy = footer.clone().prependTo(table);
      footerTrgEls = footer.find('tr');
      footerSrcEls = footerCopy.find('tr');
    }

    headerCopy = header.clone().prependTo(table);
    headerTrgEls = header.find('tr');
    headerSrcEls = headerCopy.find('tr');
    headerCopy.find('th, td').removeAttr('tabindex');

    if (!scrollX) {
      divBodyStyle.width = '100%';
      divHeader[0].style.width = '100%';
    }

    $.each(_fnGetUniqueThs(settings, headerCopy), function (i, el) {
      idx = _fnVisibleToColumnIndex(settings, i);
      el.style.width = settings.aoColumns[idx].sWidth;
    });

    if (footer) {
      _fnApplyToChildren(function (n) {
        n.style.width = "";
      }, footerSrcEls);
    }

    sanityWidth = table.outerWidth();

    if (scrollX === "") {
      tableStyle.width = "100%";

      if (ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")) {
        tableStyle.width = _fnStringToCss(table.outerWidth() - barWidth);
      }

      sanityWidth = table.outerWidth();
    } else if (scrollXInner !== "") {
      tableStyle.width = _fnStringToCss(scrollXInner);
      sanityWidth = table.outerWidth();
    }

    _fnApplyToChildren(zeroOut, headerSrcEls);

    _fnApplyToChildren(function (nSizer) {
      headerContent.push(nSizer.innerHTML);
      headerWidths.push(_fnStringToCss($(nSizer).css('width')));
    }, headerSrcEls);

    _fnApplyToChildren(function (nToSize, i) {
      if ($.inArray(nToSize, dtHeaderCells) !== -1) {
        nToSize.style.width = headerWidths[i];
      }
    }, headerTrgEls);

    $(headerSrcEls).height(0);

    if (footer) {
      _fnApplyToChildren(zeroOut, footerSrcEls);

      _fnApplyToChildren(function (nSizer) {
        footerContent.push(nSizer.innerHTML);
        footerWidths.push(_fnStringToCss($(nSizer).css('width')));
      }, footerSrcEls);

      _fnApplyToChildren(function (nToSize, i) {
        nToSize.style.width = footerWidths[i];
      }, footerTrgEls);

      $(footerSrcEls).height(0);
    }

    _fnApplyToChildren(function (nSizer, i) {
      nSizer.innerHTML = '<div class="dataTables_sizing">' + headerContent[i] + '</div>';
      nSizer.childNodes[0].style.height = "0";
      nSizer.childNodes[0].style.overflow = "hidden";
      nSizer.style.width = headerWidths[i];
    }, headerSrcEls);

    if (footer) {
      _fnApplyToChildren(function (nSizer, i) {
        nSizer.innerHTML = '<div class="dataTables_sizing">' + footerContent[i] + '</div>';
        nSizer.childNodes[0].style.height = "0";
        nSizer.childNodes[0].style.overflow = "hidden";
        nSizer.style.width = footerWidths[i];
      }, footerSrcEls);
    }

    if (table.outerWidth() < sanityWidth) {
      correction = divBodyEl.scrollHeight > divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll" ? sanityWidth + barWidth : sanityWidth;

      if (ie67 && (divBodyEl.scrollHeight > divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")) {
        tableStyle.width = _fnStringToCss(correction - barWidth);
      }

      if (scrollX === "" || scrollXInner !== "") {
        _fnLog(settings, 1, 'Possible column misalignment', 6);
      }
    } else {
      correction = '100%';
    }

    divBodyStyle.width = _fnStringToCss(correction);
    divHeaderStyle.width = _fnStringToCss(correction);

    if (footer) {
      settings.nScrollFoot.style.width = _fnStringToCss(correction);
    }

    if (!scrollY) {
      if (ie67) {
        divBodyStyle.height = _fnStringToCss(tableEl.offsetHeight + barWidth);
      }
    }

    var iOuterWidth = table.outerWidth();
    divHeaderTable[0].style.width = _fnStringToCss(iOuterWidth);
    divHeaderInnerStyle.width = _fnStringToCss(iOuterWidth);
    var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
    var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right');
    divHeaderInnerStyle[padding] = bScrolling ? barWidth + "px" : "0px";

    if (footer) {
      divFooterTable[0].style.width = _fnStringToCss(iOuterWidth);
      divFooterInner[0].style.width = _fnStringToCss(iOuterWidth);
      divFooterInner[0].style[padding] = bScrolling ? barWidth + "px" : "0px";
    }

    table.children('colgroup').insertBefore(table.children('thead'));
    divBody.scroll();

    if ((settings.bSorted || settings.bFiltered) && !settings._drawHold) {
      divBodyEl.scrollTop = 0;
    }
  }

  function _fnApplyToChildren(fn, an1, an2) {
    var index = 0,
        i = 0,
        iLen = an1.length;
    var nNode1, nNode2;

    while (i < iLen) {
      nNode1 = an1[i].firstChild;
      nNode2 = an2 ? an2[i].firstChild : null;

      while (nNode1) {
        if (nNode1.nodeType === 1) {
          if (an2) {
            fn(nNode1, nNode2, index);
          } else {
            fn(nNode1, index);
          }

          index++;
        }

        nNode1 = nNode1.nextSibling;
        nNode2 = an2 ? nNode2.nextSibling : null;
      }

      i++;
    }
  }

  var __re_html_remove = /<.*?>/g;

  function _fnCalculateColumnWidths(oSettings) {
    var table = oSettings.nTable,
        columns = oSettings.aoColumns,
        scroll = oSettings.oScroll,
        scrollY = scroll.sY,
        scrollX = scroll.sX,
        scrollXInner = scroll.sXInner,
        columnCount = columns.length,
        visibleColumns = _fnGetColumns(oSettings, 'bVisible'),
        headerCells = $('th', oSettings.nTHead),
        tableWidthAttr = table.getAttribute('width'),
        tableContainer = table.parentNode,
        userInputs = false,
        i,
        column,
        columnIdx,
        width,
        outerWidth,
        browser = oSettings.oBrowser,
        ie67 = browser.bScrollOversize;

    var styleWidth = table.style.width;

    if (styleWidth && styleWidth.indexOf('%') !== -1) {
      tableWidthAttr = styleWidth;
    }

    for (i = 0; i < visibleColumns.length; i++) {
      column = columns[visibleColumns[i]];

      if (column.sWidth !== null) {
        column.sWidth = _fnConvertToWidth(column.sWidthOrig, tableContainer);
        userInputs = true;
      }
    }

    if (ie67 || !userInputs && !scrollX && !scrollY && columnCount == _fnVisbleColumns(oSettings) && columnCount == headerCells.length) {
      for (i = 0; i < columnCount; i++) {
        var colIdx = _fnVisibleToColumnIndex(oSettings, i);

        if (colIdx !== null) {
          columns[colIdx].sWidth = _fnStringToCss(headerCells.eq(i).width());
        }
      }
    } else {
      var tmpTable = $(table).clone().css('visibility', 'hidden').removeAttr('id');
      tmpTable.find('tbody tr').remove();
      var tr = $('<tr/>').appendTo(tmpTable.find('tbody'));
      tmpTable.find('thead, tfoot').remove();
      tmpTable.append($(oSettings.nTHead).clone()).append($(oSettings.nTFoot).clone());
      tmpTable.find('tfoot th, tfoot td').css('width', '');
      headerCells = _fnGetUniqueThs(oSettings, tmpTable.find('thead')[0]);

      for (i = 0; i < visibleColumns.length; i++) {
        column = columns[visibleColumns[i]];
        headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ? _fnStringToCss(column.sWidthOrig) : '';

        if (column.sWidthOrig && scrollX) {
          $(headerCells[i]).append($('<div/>').css({
            width: column.sWidthOrig,
            margin: 0,
            padding: 0,
            border: 0,
            height: 1
          }));
        }
      }

      if (oSettings.aoData.length) {
        for (i = 0; i < visibleColumns.length; i++) {
          columnIdx = visibleColumns[i];
          column = columns[columnIdx];
          $(_fnGetWidestNode(oSettings, columnIdx)).clone(false).append(column.sContentPadding).appendTo(tr);
        }
      }

      $('[name]', tmpTable).removeAttr('name');
      var holder = $('<div/>').css(scrollX || scrollY ? {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 1,
        right: 0,
        overflow: 'hidden'
      } : {}).append(tmpTable).appendTo(tableContainer);

      if (scrollX && scrollXInner) {
        tmpTable.width(scrollXInner);
      } else if (scrollX) {
        tmpTable.css('width', 'auto');
        tmpTable.removeAttr('width');

        if (tmpTable.width() < tableContainer.clientWidth && tableWidthAttr) {
          tmpTable.width(tableContainer.clientWidth);
        }
      } else if (scrollY) {
        tmpTable.width(tableContainer.clientWidth);
      } else if (tableWidthAttr) {
        tmpTable.width(tableWidthAttr);
      }

      var total = 0;

      for (i = 0; i < visibleColumns.length; i++) {
        var cell = $(headerCells[i]);
        var border = cell.outerWidth() - cell.width();
        var bounding = browser.bBounding ? Math.ceil(headerCells[i].getBoundingClientRect().width) : cell.outerWidth();
        total += bounding;
        columns[visibleColumns[i]].sWidth = _fnStringToCss(bounding - border);
      }

      table.style.width = _fnStringToCss(total);
      holder.remove();
    }

    if (tableWidthAttr) {
      table.style.width = _fnStringToCss(tableWidthAttr);
    }

    if ((tableWidthAttr || scrollX) && !oSettings._reszEvt) {
      var bindResize = function bindResize() {
        $(window).on('resize.DT-' + oSettings.sInstance, _fnThrottle(function () {
          _fnAdjustColumnSizing(oSettings);
        }));
      };

      if (ie67) {
        setTimeout(bindResize, 1000);
      } else {
        bindResize();
      }

      oSettings._reszEvt = true;
    }
  }

  var _fnThrottle = DataTable.util.throttle;

  function _fnConvertToWidth(width, parent) {
    if (!width) {
      return 0;
    }

    var n = $('<div/>').css('width', _fnStringToCss(width)).appendTo(parent || document.body);
    var val = n[0].offsetWidth;
    n.remove();
    return val;
  }

  function _fnGetWidestNode(settings, colIdx) {
    var idx = _fnGetMaxLenString(settings, colIdx);

    if (idx < 0) {
      return null;
    }

    var data = settings.aoData[idx];
    return !data.nTr ? $('<td/>').html(_fnGetCellData(settings, idx, colIdx, 'display'))[0] : data.anCells[colIdx];
  }

  function _fnGetMaxLenString(settings, colIdx) {
    var s,
        max = -1,
        maxIdx = -1;

    for (var i = 0, ien = settings.aoData.length; i < ien; i++) {
      s = _fnGetCellData(settings, i, colIdx, 'display') + '';
      s = s.replace(__re_html_remove, '');
      s = s.replace(/&nbsp;/g, ' ');

      if (s.length > max) {
        max = s.length;
        maxIdx = i;
      }
    }

    return maxIdx;
  }

  function _fnStringToCss(s) {
    if (s === null) {
      return '0px';
    }

    if (typeof s == 'number') {
      return s < 0 ? '0px' : s + 'px';
    }

    return s.match(/\d$/) ? s + 'px' : s;
  }

  function _fnSortFlatten(settings) {
    var i,
        iLen,
        k,
        kLen,
        aSort = [],
        aiOrig = [],
        aoColumns = settings.aoColumns,
        aDataSort,
        iCol,
        sType,
        srcCol,
        fixed = settings.aaSortingFixed,
        fixedObj = $.isPlainObject(fixed),
        nestedSort = [],
        add = function add(a) {
      if (a.length && !$.isArray(a[0])) {
        nestedSort.push(a);
      } else {
        $.merge(nestedSort, a);
      }
    };

    if ($.isArray(fixed)) {
      add(fixed);
    }

    if (fixedObj && fixed.pre) {
      add(fixed.pre);
    }

    add(settings.aaSorting);

    if (fixedObj && fixed.post) {
      add(fixed.post);
    }

    for (i = 0; i < nestedSort.length; i++) {
      srcCol = nestedSort[i][0];
      aDataSort = aoColumns[srcCol].aDataSort;

      for (k = 0, kLen = aDataSort.length; k < kLen; k++) {
        iCol = aDataSort[k];
        sType = aoColumns[iCol].sType || 'string';

        if (nestedSort[i]._idx === undefined) {
          nestedSort[i]._idx = $.inArray(nestedSort[i][1], aoColumns[iCol].asSorting);
        }

        aSort.push({
          src: srcCol,
          col: iCol,
          dir: nestedSort[i][1],
          index: nestedSort[i]._idx,
          type: sType,
          formatter: DataTable.ext.type.order[sType + "-pre"]
        });
      }
    }

    return aSort;
  }

  function _fnSort(oSettings) {
    var i,
        ien,
        iLen,
        j,
        jLen,
        k,
        kLen,
        sDataType,
        nTh,
        aiOrig = [],
        oExtSort = DataTable.ext.type.order,
        aoData = oSettings.aoData,
        aoColumns = oSettings.aoColumns,
        aDataSort,
        data,
        iCol,
        sType,
        oSort,
        formatters = 0,
        sortCol,
        displayMaster = oSettings.aiDisplayMaster,
        aSort;

    _fnColumnTypes(oSettings);

    aSort = _fnSortFlatten(oSettings);

    for (i = 0, ien = aSort.length; i < ien; i++) {
      sortCol = aSort[i];

      if (sortCol.formatter) {
        formatters++;
      }

      _fnSortData(oSettings, sortCol.col);
    }

    if (_fnDataSource(oSettings) != 'ssp' && aSort.length !== 0) {
      for (i = 0, iLen = displayMaster.length; i < iLen; i++) {
        aiOrig[displayMaster[i]] = i;
      }

      if (formatters === aSort.length) {
        displayMaster.sort(function (a, b) {
          var x,
              y,
              k,
              test,
              sort,
              len = aSort.length,
              dataA = aoData[a]._aSortData,
              dataB = aoData[b]._aSortData;

          for (k = 0; k < len; k++) {
            sort = aSort[k];
            x = dataA[sort.col];
            y = dataB[sort.col];
            test = x < y ? -1 : x > y ? 1 : 0;

            if (test !== 0) {
              return sort.dir === 'asc' ? test : -test;
            }
          }

          x = aiOrig[a];
          y = aiOrig[b];
          return x < y ? -1 : x > y ? 1 : 0;
        });
      } else {
        displayMaster.sort(function (a, b) {
          var x,
              y,
              k,
              l,
              test,
              sort,
              fn,
              len = aSort.length,
              dataA = aoData[a]._aSortData,
              dataB = aoData[b]._aSortData;

          for (k = 0; k < len; k++) {
            sort = aSort[k];
            x = dataA[sort.col];
            y = dataB[sort.col];
            fn = oExtSort[sort.type + "-" + sort.dir] || oExtSort["string-" + sort.dir];
            test = fn(x, y);

            if (test !== 0) {
              return test;
            }
          }

          x = aiOrig[a];
          y = aiOrig[b];
          return x < y ? -1 : x > y ? 1 : 0;
        });
      }
    }

    oSettings.bSorted = true;
  }

  function _fnSortAria(settings) {
    var label;
    var nextSort;
    var columns = settings.aoColumns;

    var aSort = _fnSortFlatten(settings);

    var oAria = settings.oLanguage.oAria;

    for (var i = 0, iLen = columns.length; i < iLen; i++) {
      var col = columns[i];
      var asSorting = col.asSorting;
      var sTitle = col.sTitle.replace(/<.*?>/g, "");
      var th = col.nTh;
      th.removeAttribute('aria-sort');

      if (col.bSortable) {
        if (aSort.length > 0 && aSort[0].col == i) {
          th.setAttribute('aria-sort', aSort[0].dir == "asc" ? "ascending" : "descending");
          nextSort = asSorting[aSort[0].index + 1] || asSorting[0];
        } else {
          nextSort = asSorting[0];
        }

        label = sTitle + (nextSort === "asc" ? oAria.sSortAscending : oAria.sSortDescending);
      } else {
        label = sTitle;
      }

      th.setAttribute('aria-label', label);
    }
  }

  function _fnSortListener(settings, colIdx, append, callback) {
    var col = settings.aoColumns[colIdx];
    var sorting = settings.aaSorting;
    var asSorting = col.asSorting;
    var nextSortIdx;

    var next = function next(a, overflow) {
      var idx = a._idx;

      if (idx === undefined) {
        idx = $.inArray(a[1], asSorting);
      }

      return idx + 1 < asSorting.length ? idx + 1 : overflow ? null : 0;
    };

    if (typeof sorting[0] === 'number') {
      sorting = settings.aaSorting = [sorting];
    }

    if (append && settings.oFeatures.bSortMulti) {
      var sortIdx = $.inArray(colIdx, _pluck(sorting, '0'));

      if (sortIdx !== -1) {
        nextSortIdx = next(sorting[sortIdx], true);

        if (nextSortIdx === null && sorting.length === 1) {
          nextSortIdx = 0;
        }

        if (nextSortIdx === null) {
          sorting.splice(sortIdx, 1);
        } else {
          sorting[sortIdx][1] = asSorting[nextSortIdx];
          sorting[sortIdx]._idx = nextSortIdx;
        }
      } else {
        sorting.push([colIdx, asSorting[0], 0]);
        sorting[sorting.length - 1]._idx = 0;
      }
    } else if (sorting.length && sorting[0][0] == colIdx) {
      nextSortIdx = next(sorting[0]);
      sorting.length = 1;
      sorting[0][1] = asSorting[nextSortIdx];
      sorting[0]._idx = nextSortIdx;
    } else {
      sorting.length = 0;
      sorting.push([colIdx, asSorting[0]]);
      sorting[0]._idx = 0;
    }

    _fnReDraw(settings);

    if (typeof callback == 'function') {
      callback(settings);
    }
  }

  function _fnSortAttachListener(settings, attachTo, colIdx, callback) {
    var col = settings.aoColumns[colIdx];

    _fnBindAction(attachTo, {}, function (e) {
      if (col.bSortable === false) {
        return;
      }

      if (settings.oFeatures.bProcessing) {
        _fnProcessingDisplay(settings, true);

        setTimeout(function () {
          _fnSortListener(settings, colIdx, e.shiftKey, callback);

          if (_fnDataSource(settings) !== 'ssp') {
            _fnProcessingDisplay(settings, false);
          }
        }, 0);
      } else {
        _fnSortListener(settings, colIdx, e.shiftKey, callback);
      }
    });
  }

  function _fnSortingClasses(settings) {
    var oldSort = settings.aLastSort;
    var sortClass = settings.oClasses.sSortColumn;

    var sort = _fnSortFlatten(settings);

    var features = settings.oFeatures;
    var i, ien, colIdx;

    if (features.bSort && features.bSortClasses) {
      for (i = 0, ien = oldSort.length; i < ien; i++) {
        colIdx = oldSort[i].src;
        $(_pluck(settings.aoData, 'anCells', colIdx)).removeClass(sortClass + (i < 2 ? i + 1 : 3));
      }

      for (i = 0, ien = sort.length; i < ien; i++) {
        colIdx = sort[i].src;
        $(_pluck(settings.aoData, 'anCells', colIdx)).addClass(sortClass + (i < 2 ? i + 1 : 3));
      }
    }

    settings.aLastSort = sort;
  }

  function _fnSortData(settings, idx) {
    var column = settings.aoColumns[idx];
    var customSort = DataTable.ext.order[column.sSortDataType];
    var customData;

    if (customSort) {
      customData = customSort.call(settings.oInstance, settings, idx, _fnColumnIndexToVisible(settings, idx));
    }

    var row, cellData;
    var formatter = DataTable.ext.type.order[column.sType + "-pre"];

    for (var i = 0, ien = settings.aoData.length; i < ien; i++) {
      row = settings.aoData[i];

      if (!row._aSortData) {
        row._aSortData = [];
      }

      if (!row._aSortData[idx] || customSort) {
        cellData = customSort ? customData[i] : _fnGetCellData(settings, i, idx, 'sort');
        row._aSortData[idx] = formatter ? formatter(cellData) : cellData;
      }
    }
  }

  function _fnSaveState(settings) {
    if (!settings.oFeatures.bStateSave || settings.bDestroying) {
      return;
    }

    var state = {
      time: +new Date(),
      start: settings._iDisplayStart,
      length: settings._iDisplayLength,
      order: $.extend(true, [], settings.aaSorting),
      search: _fnSearchToCamel(settings.oPreviousSearch),
      columns: $.map(settings.aoColumns, function (col, i) {
        return {
          visible: col.bVisible,
          search: _fnSearchToCamel(settings.aoPreSearchCols[i])
        };
      })
    };

    _fnCallbackFire(settings, "aoStateSaveParams", 'stateSaveParams', [settings, state]);

    settings.oSavedState = state;
    settings.fnStateSaveCallback.call(settings.oInstance, settings, state);
  }

  function _fnLoadState(settings, oInit, callback) {
    var i, ien;
    var columns = settings.aoColumns;

    var loaded = function loaded(s) {
      if (!s || !s.time) {
        callback();
        return;
      }

      var abStateLoad = _fnCallbackFire(settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s]);

      if ($.inArray(false, abStateLoad) !== -1) {
        callback();
        return;
      }

      var duration = settings.iStateDuration;

      if (duration > 0 && s.time < +new Date() - duration * 1000) {
        callback();
        return;
      }

      if (s.columns && columns.length !== s.columns.length) {
        callback();
        return;
      }

      settings.oLoadedState = $.extend(true, {}, s);

      if (s.start !== undefined) {
        settings._iDisplayStart = s.start;
        settings.iInitDisplayStart = s.start;
      }

      if (s.length !== undefined) {
        settings._iDisplayLength = s.length;
      }

      if (s.order !== undefined) {
        settings.aaSorting = [];
        $.each(s.order, function (i, col) {
          settings.aaSorting.push(col[0] >= columns.length ? [0, col[1]] : col);
        });
      }

      if (s.search !== undefined) {
        $.extend(settings.oPreviousSearch, _fnSearchToHung(s.search));
      }

      if (s.columns) {
        for (i = 0, ien = s.columns.length; i < ien; i++) {
          var col = s.columns[i];

          if (col.visible !== undefined) {
            columns[i].bVisible = col.visible;
          }

          if (col.search !== undefined) {
            $.extend(settings.aoPreSearchCols[i], _fnSearchToHung(col.search));
          }
        }
      }

      _fnCallbackFire(settings, 'aoStateLoaded', 'stateLoaded', [settings, s]);

      callback();
    };

    if (!settings.oFeatures.bStateSave) {
      callback();
      return;
    }

    var state = settings.fnStateLoadCallback.call(settings.oInstance, settings, loaded);

    if (state !== undefined) {
      loaded(state);
    }
  }

  function _fnSettingsFromNode(table) {
    var settings = DataTable.settings;
    var idx = $.inArray(table, _pluck(settings, 'nTable'));
    return idx !== -1 ? settings[idx] : null;
  }

  function _fnLog(settings, level, msg, tn) {
    msg = 'DataTables warning: ' + (settings ? 'table id=' + settings.sTableId + ' - ' : '') + msg;

    if (tn) {
      msg += '. For more information about this error, please see ' + 'http://datatables.net/tn/' + tn;
    }

    if (!level) {
      var ext = DataTable.ext;
      var type = ext.sErrMode || ext.errMode;

      if (settings) {
        _fnCallbackFire(settings, null, 'error', [settings, tn, msg]);
      }

      if (type == 'alert') {
        alert(msg);
      } else if (type == 'throw') {
        throw new Error(msg);
      } else if (typeof type == 'function') {
        type(settings, tn, msg);
      }
    } else if (window.console && console.log) {
      console.log(msg);
    }
  }

  function _fnMap(ret, src, name, mappedName) {
    if ($.isArray(name)) {
      $.each(name, function (i, val) {
        if ($.isArray(val)) {
          _fnMap(ret, src, val[0], val[1]);
        } else {
          _fnMap(ret, src, val);
        }
      });
      return;
    }

    if (mappedName === undefined) {
      mappedName = name;
    }

    if (src[name] !== undefined) {
      ret[mappedName] = src[name];
    }
  }

  function _fnExtend(out, extender, breakRefs) {
    var val;

    for (var prop in extender) {
      if (extender.hasOwnProperty(prop)) {
        val = extender[prop];

        if ($.isPlainObject(val)) {
          if (!$.isPlainObject(out[prop])) {
            out[prop] = {};
          }

          $.extend(true, out[prop], val);
        } else if (breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val)) {
          out[prop] = val.slice();
        } else {
          out[prop] = val;
        }
      }
    }

    return out;
  }

  function _fnBindAction(n, oData, fn) {
    $(n).on('click.DT', oData, function (e) {
      $(n).blur();
      fn(e);
    }).on('keypress.DT', oData, function (e) {
      if (e.which === 13) {
        e.preventDefault();
        fn(e);
      }
    }).on('selectstart.DT', function () {
      return false;
    });
  }

  function _fnCallbackReg(oSettings, sStore, fn, sName) {
    if (fn) {
      oSettings[sStore].push({
        "fn": fn,
        "sName": sName
      });
    }
  }

  function _fnCallbackFire(settings, callbackArr, eventName, args) {
    var ret = [];

    if (callbackArr) {
      ret = $.map(settings[callbackArr].slice().reverse(), function (val, i) {
        return val.fn.apply(settings.oInstance, args);
      });
    }

    if (eventName !== null) {
      var e = $.Event(eventName + '.dt');
      $(settings.nTable).trigger(e, args);
      ret.push(e.result);
    }

    return ret;
  }

  function _fnLengthOverflow(settings) {
    var start = settings._iDisplayStart,
        end = settings.fnDisplayEnd(),
        len = settings._iDisplayLength;

    if (start >= end) {
      start = end - len;
    }

    start -= start % len;

    if (len === -1 || start < 0) {
      start = 0;
    }

    settings._iDisplayStart = start;
  }

  function _fnRenderer(settings, type) {
    var renderer = settings.renderer;
    var host = DataTable.ext.renderer[type];

    if ($.isPlainObject(renderer) && renderer[type]) {
      return host[renderer[type]] || host._;
    } else if (typeof renderer === 'string') {
      return host[renderer] || host._;
    }

    return host._;
  }

  function _fnDataSource(settings) {
    if (settings.oFeatures.bServerSide) {
      return 'ssp';
    } else if (settings.ajax || settings.sAjaxSource) {
      return 'ajax';
    }

    return 'dom';
  }

  var __apiStruct = [];
  var __arrayProto = Array.prototype;

  var _toSettings = function _toSettings(mixed) {
    var idx, jq;
    var settings = DataTable.settings;
    var tables = $.map(settings, function (el, i) {
      return el.nTable;
    });

    if (!mixed) {
      return [];
    } else if (mixed.nTable && mixed.oApi) {
      return [mixed];
    } else if (mixed.nodeName && mixed.nodeName.toLowerCase() === 'table') {
      idx = $.inArray(mixed, tables);
      return idx !== -1 ? [settings[idx]] : null;
    } else if (mixed && typeof mixed.settings === 'function') {
      return mixed.settings().toArray();
    } else if (typeof mixed === 'string') {
      jq = $(mixed);
    } else if (mixed instanceof $) {
      jq = mixed;
    }

    if (jq) {
      return jq.map(function (i) {
        idx = $.inArray(this, tables);
        return idx !== -1 ? settings[idx] : null;
      }).toArray();
    }
  };

  _Api2 = function _Api(context, data) {
    if (!(this instanceof _Api2)) {
      return new _Api2(context, data);
    }

    var settings = [];

    var ctxSettings = function ctxSettings(o) {
      var a = _toSettings(o);

      if (a) {
        settings = settings.concat(a);
      }
    };

    if ($.isArray(context)) {
      for (var i = 0, ien = context.length; i < ien; i++) {
        ctxSettings(context[i]);
      }
    } else {
      ctxSettings(context);
    }

    this.context = _unique(settings);

    if (data) {
      $.merge(this, data);
    }

    this.selector = {
      rows: null,
      cols: null,
      opts: null
    };

    _Api2.extend(this, this, __apiStruct);
  };

  DataTable.Api = _Api2;
  $.extend(_Api2.prototype, {
    any: function any() {
      return this.count() !== 0;
    },
    concat: __arrayProto.concat,
    context: [],
    count: function count() {
      return this.flatten().length;
    },
    each: function each(fn) {
      for (var i = 0, ien = this.length; i < ien; i++) {
        fn.call(this, this[i], i, this);
      }

      return this;
    },
    eq: function eq(idx) {
      var ctx = this.context;
      return ctx.length > idx ? new _Api2(ctx[idx], this[idx]) : null;
    },
    filter: function filter(fn) {
      var a = [];

      if (__arrayProto.filter) {
        a = __arrayProto.filter.call(this, fn, this);
      } else {
        for (var i = 0, ien = this.length; i < ien; i++) {
          if (fn.call(this, this[i], i, this)) {
            a.push(this[i]);
          }
        }
      }

      return new _Api2(this.context, a);
    },
    flatten: function flatten() {
      var a = [];
      return new _Api2(this.context, a.concat.apply(a, this.toArray()));
    },
    join: __arrayProto.join,
    indexOf: __arrayProto.indexOf || function (obj, start) {
      for (var i = start || 0, ien = this.length; i < ien; i++) {
        if (this[i] === obj) {
          return i;
        }
      }

      return -1;
    },
    iterator: function iterator(flatten, type, fn, alwaysNew) {
      var a = [],
          ret,
          i,
          ien,
          j,
          jen,
          context = this.context,
          rows,
          items,
          item,
          selector = this.selector;

      if (typeof flatten === 'string') {
        alwaysNew = fn;
        fn = type;
        type = flatten;
        flatten = false;
      }

      for (i = 0, ien = context.length; i < ien; i++) {
        var apiInst = new _Api2(context[i]);

        if (type === 'table') {
          ret = fn.call(apiInst, context[i], i);

          if (ret !== undefined) {
            a.push(ret);
          }
        } else if (type === 'columns' || type === 'rows') {
          ret = fn.call(apiInst, context[i], this[i], i);

          if (ret !== undefined) {
            a.push(ret);
          }
        } else if (type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell') {
          items = this[i];

          if (type === 'column-rows') {
            rows = _selector_row_indexes(context[i], selector.opts);
          }

          for (j = 0, jen = items.length; j < jen; j++) {
            item = items[j];

            if (type === 'cell') {
              ret = fn.call(apiInst, context[i], item.row, item.column, i, j);
            } else {
              ret = fn.call(apiInst, context[i], item, i, j, rows);
            }

            if (ret !== undefined) {
              a.push(ret);
            }
          }
        }
      }

      if (a.length || alwaysNew) {
        var api = new _Api2(context, flatten ? a.concat.apply([], a) : a);
        var apiSelector = api.selector;
        apiSelector.rows = selector.rows;
        apiSelector.cols = selector.cols;
        apiSelector.opts = selector.opts;
        return api;
      }

      return this;
    },
    lastIndexOf: __arrayProto.lastIndexOf || function (obj, start) {
      return this.indexOf.apply(this.toArray.reverse(), arguments);
    },
    length: 0,
    map: function map(fn) {
      var a = [];

      if (__arrayProto.map) {
        a = __arrayProto.map.call(this, fn, this);
      } else {
        for (var i = 0, ien = this.length; i < ien; i++) {
          a.push(fn.call(this, this[i], i));
        }
      }

      return new _Api2(this.context, a);
    },
    pluck: function pluck(prop) {
      return this.map(function (el) {
        return el[prop];
      });
    },
    pop: __arrayProto.pop,
    push: __arrayProto.push,
    reduce: __arrayProto.reduce || function (fn, init) {
      return _fnReduce(this, fn, init, 0, this.length, 1);
    },
    reduceRight: __arrayProto.reduceRight || function (fn, init) {
      return _fnReduce(this, fn, init, this.length - 1, -1, -1);
    },
    reverse: __arrayProto.reverse,
    selector: null,
    shift: __arrayProto.shift,
    slice: function slice() {
      return new _Api2(this.context, this);
    },
    sort: __arrayProto.sort,
    splice: __arrayProto.splice,
    toArray: function toArray() {
      return __arrayProto.slice.call(this);
    },
    to$: function to$() {
      return $(this);
    },
    toJQuery: function toJQuery() {
      return $(this);
    },
    unique: function unique() {
      return new _Api2(this.context, _unique(this));
    },
    unshift: __arrayProto.unshift
  });

  _Api2.extend = function (scope, obj, ext) {
    if (!ext.length || !obj || !(obj instanceof _Api2) && !obj.__dt_wrapper) {
      return;
    }

    var i,
        ien,
        j,
        jen,
        struct,
        inner,
        methodScoping = function methodScoping(scope, fn, struc) {
      return function () {
        var ret = fn.apply(scope, arguments);

        _Api2.extend(ret, ret, struc.methodExt);

        return ret;
      };
    };

    for (i = 0, ien = ext.length; i < ien; i++) {
      struct = ext[i];
      obj[struct.name] = typeof struct.val === 'function' ? methodScoping(scope, struct.val, struct) : $.isPlainObject(struct.val) ? {} : struct.val;
      obj[struct.name].__dt_wrapper = true;

      _Api2.extend(scope, obj[struct.name], struct.propExt);
    }
  };

  _Api2.register = _api_register = function _api_register(name, val) {
    if ($.isArray(name)) {
      for (var j = 0, jen = name.length; j < jen; j++) {
        _Api2.register(name[j], val);
      }

      return;
    }

    var i,
        ien,
        heir = name.split('.'),
        struct = __apiStruct,
        key,
        method;

    var find = function find(src, name) {
      for (var i = 0, ien = src.length; i < ien; i++) {
        if (src[i].name === name) {
          return src[i];
        }
      }

      return null;
    };

    for (i = 0, ien = heir.length; i < ien; i++) {
      method = heir[i].indexOf('()') !== -1;
      key = method ? heir[i].replace('()', '') : heir[i];
      var src = find(struct, key);

      if (!src) {
        src = {
          name: key,
          val: {},
          methodExt: [],
          propExt: []
        };
        struct.push(src);
      }

      if (i === ien - 1) {
        src.val = val;
      } else {
        struct = method ? src.methodExt : src.propExt;
      }
    }
  };

  _Api2.registerPlural = _api_registerPlural = function _api_registerPlural(pluralName, singularName, val) {
    _Api2.register(pluralName, val);

    _Api2.register(singularName, function () {
      var ret = val.apply(this, arguments);

      if (ret === this) {
        return this;
      } else if (ret instanceof _Api2) {
        return ret.length ? $.isArray(ret[0]) ? new _Api2(ret.context, ret[0]) : ret[0] : undefined;
      }

      return ret;
    });
  };

  var __table_selector = function __table_selector(selector, a) {
    if (typeof selector === 'number') {
      return [a[selector]];
    }

    var nodes = $.map(a, function (el, i) {
      return el.nTable;
    });
    return $(nodes).filter(selector).map(function (i) {
      var idx = $.inArray(this, nodes);
      return a[idx];
    }).toArray();
  };

  _api_register('tables()', function (selector) {
    return selector ? new _Api2(__table_selector(selector, this.context)) : this;
  });

  _api_register('table()', function (selector) {
    var tables = this.tables(selector);
    var ctx = tables.context;
    return ctx.length ? new _Api2(ctx[0]) : tables;
  });

  _api_registerPlural('tables().nodes()', 'table().node()', function () {
    return this.iterator('table', function (ctx) {
      return ctx.nTable;
    }, 1);
  });

  _api_registerPlural('tables().body()', 'table().body()', function () {
    return this.iterator('table', function (ctx) {
      return ctx.nTBody;
    }, 1);
  });

  _api_registerPlural('tables().header()', 'table().header()', function () {
    return this.iterator('table', function (ctx) {
      return ctx.nTHead;
    }, 1);
  });

  _api_registerPlural('tables().footer()', 'table().footer()', function () {
    return this.iterator('table', function (ctx) {
      return ctx.nTFoot;
    }, 1);
  });

  _api_registerPlural('tables().containers()', 'table().container()', function () {
    return this.iterator('table', function (ctx) {
      return ctx.nTableWrapper;
    }, 1);
  });

  _api_register('draw()', function (paging) {
    return this.iterator('table', function (settings) {
      if (paging === 'page') {
        _fnDraw(settings);
      } else {
        if (typeof paging === 'string') {
          paging = paging === 'full-hold' ? false : true;
        }

        _fnReDraw(settings, paging === false);
      }
    });
  });

  _api_register('page()', function (action) {
    if (action === undefined) {
      return this.page.info().page;
    }

    return this.iterator('table', function (settings) {
      _fnPageChange(settings, action);
    });
  });

  _api_register('page.info()', function (action) {
    if (this.context.length === 0) {
      return undefined;
    }

    var settings = this.context[0],
        start = settings._iDisplayStart,
        len = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
        visRecords = settings.fnRecordsDisplay(),
        all = len === -1;
    return {
      "page": all ? 0 : Math.floor(start / len),
      "pages": all ? 1 : Math.ceil(visRecords / len),
      "start": start,
      "end": settings.fnDisplayEnd(),
      "length": len,
      "recordsTotal": settings.fnRecordsTotal(),
      "recordsDisplay": visRecords,
      "serverSide": _fnDataSource(settings) === 'ssp'
    };
  });

  _api_register('page.len()', function (len) {
    if (len === undefined) {
      return this.context.length !== 0 ? this.context[0]._iDisplayLength : undefined;
    }

    return this.iterator('table', function (settings) {
      _fnLengthChange(settings, len);
    });
  });

  var __reload = function __reload(settings, holdPosition, callback) {
    if (callback) {
      var api = new _Api2(settings);
      api.one('draw', function () {
        callback(api.ajax.json());
      });
    }

    if (_fnDataSource(settings) == 'ssp') {
      _fnReDraw(settings, holdPosition);
    } else {
      _fnProcessingDisplay(settings, true);

      var xhr = settings.jqXHR;

      if (xhr && xhr.readyState !== 4) {
        xhr.abort();
      }

      _fnBuildAjax(settings, [], function (json) {
        _fnClearTable(settings);

        var data = _fnAjaxDataSrc(settings, json);

        for (var i = 0, ien = data.length; i < ien; i++) {
          _fnAddData(settings, data[i]);
        }

        _fnReDraw(settings, holdPosition);

        _fnProcessingDisplay(settings, false);
      });
    }
  };

  _api_register('ajax.json()', function () {
    var ctx = this.context;

    if (ctx.length > 0) {
      return ctx[0].json;
    }
  });

  _api_register('ajax.params()', function () {
    var ctx = this.context;

    if (ctx.length > 0) {
      return ctx[0].oAjaxData;
    }
  });

  _api_register('ajax.reload()', function (callback, resetPaging) {
    return this.iterator('table', function (settings) {
      __reload(settings, resetPaging === false, callback);
    });
  });

  _api_register('ajax.url()', function (url) {
    var ctx = this.context;

    if (url === undefined) {
      if (ctx.length === 0) {
        return undefined;
      }

      ctx = ctx[0];
      return ctx.ajax ? $.isPlainObject(ctx.ajax) ? ctx.ajax.url : ctx.ajax : ctx.sAjaxSource;
    }

    return this.iterator('table', function (settings) {
      if ($.isPlainObject(settings.ajax)) {
        settings.ajax.url = url;
      } else {
        settings.ajax = url;
      }
    });
  });

  _api_register('ajax.url().load()', function (callback, resetPaging) {
    return this.iterator('table', function (ctx) {
      __reload(ctx, resetPaging === false, callback);
    });
  });

  var _selector_run = function _selector_run(type, selector, selectFn, settings, opts) {
    var out = [],
        res,
        a,
        i,
        ien,
        j,
        jen,
        selectorType = _typeof(selector);

    if (!selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined) {
      selector = [selector];
    }

    for (i = 0, ien = selector.length; i < ien; i++) {
      a = selector[i] && selector[i].split && !selector[i].match(/[\[\(:]/) ? selector[i].split(',') : [selector[i]];

      for (j = 0, jen = a.length; j < jen; j++) {
        res = selectFn(typeof a[j] === 'string' ? $.trim(a[j]) : a[j]);

        if (res && res.length) {
          out = out.concat(res);
        }
      }
    }

    var ext = _ext.selector[type];

    if (ext.length) {
      for (i = 0, ien = ext.length; i < ien; i++) {
        out = ext[i](settings, opts, out);
      }
    }

    return _unique(out);
  };

  var _selector_opts = function _selector_opts(opts) {
    if (!opts) {
      opts = {};
    }

    if (opts.filter && opts.search === undefined) {
      opts.search = opts.filter;
    }

    return $.extend({
      search: 'none',
      order: 'current',
      page: 'all'
    }, opts);
  };

  var _selector_first = function _selector_first(inst) {
    for (var i = 0, ien = inst.length; i < ien; i++) {
      if (inst[i].length > 0) {
        inst[0] = inst[i];
        inst[0].length = 1;
        inst.length = 1;
        inst.context = [inst.context[i]];
        return inst;
      }
    }

    inst.length = 0;
    return inst;
  };

  var _selector_row_indexes = function _selector_row_indexes(settings, opts) {
    var i,
        ien,
        tmp,
        a = [],
        displayFiltered = settings.aiDisplay,
        displayMaster = settings.aiDisplayMaster;
    var search = opts.search,
        order = opts.order,
        page = opts.page;

    if (_fnDataSource(settings) == 'ssp') {
      return search === 'removed' ? [] : _range(0, displayMaster.length);
    } else if (page == 'current') {
      for (i = settings._iDisplayStart, ien = settings.fnDisplayEnd(); i < ien; i++) {
        a.push(displayFiltered[i]);
      }
    } else if (order == 'current' || order == 'applied') {
      if (search == 'none') {
        a = displayMaster.slice();
      } else if (search == 'applied') {
        a = displayFiltered.slice();
      } else if (search == 'removed') {
        var displayFilteredMap = {};

        for (var i = 0, ien = displayFiltered.length; i < ien; i++) {
          displayFilteredMap[displayFiltered[i]] = null;
        }

        a = $.map(displayMaster, function (el) {
          return !displayFilteredMap.hasOwnProperty(el) ? el : null;
        });
      }
    } else if (order == 'index' || order == 'original') {
      for (i = 0, ien = settings.aoData.length; i < ien; i++) {
        if (search == 'none') {
          a.push(i);
        } else {
          tmp = $.inArray(i, displayFiltered);

          if (tmp === -1 && search == 'removed' || tmp >= 0 && search == 'applied') {
            a.push(i);
          }
        }
      }
    }

    return a;
  };

  var __row_selector = function __row_selector(settings, selector, opts) {
    var rows;

    var run = function run(sel) {
      var selInt = _intVal(sel);

      var i, ien;
      var aoData = settings.aoData;

      if (selInt !== null && !opts) {
        return [selInt];
      }

      if (!rows) {
        rows = _selector_row_indexes(settings, opts);
      }

      if (selInt !== null && $.inArray(selInt, rows) !== -1) {
        return [selInt];
      } else if (sel === null || sel === undefined || sel === '') {
        return rows;
      }

      if (typeof sel === 'function') {
        return $.map(rows, function (idx) {
          var row = aoData[idx];
          return sel(idx, row._aData, row.nTr) ? idx : null;
        });
      }

      if (sel.nodeName) {
        var rowIdx = sel._DT_RowIndex;
        var cellIdx = sel._DT_CellIndex;

        if (rowIdx !== undefined) {
          return aoData[rowIdx] && aoData[rowIdx].nTr === sel ? [rowIdx] : [];
        } else if (cellIdx) {
          return aoData[cellIdx.row] && aoData[cellIdx.row].nTr === sel ? [cellIdx.row] : [];
        } else {
          var host = $(sel).closest('*[data-dt-row]');
          return host.length ? [host.data('dt-row')] : [];
        }
      }

      if (typeof sel === 'string' && sel.charAt(0) === '#') {
        var rowObj = settings.aIds[sel.replace(/^#/, '')];

        if (rowObj !== undefined) {
          return [rowObj.idx];
        }
      }

      var nodes = _removeEmpty(_pluck_order(settings.aoData, rows, 'nTr'));

      return $(nodes).filter(sel).map(function () {
        return this._DT_RowIndex;
      }).toArray();
    };

    return _selector_run('row', selector, run, settings, opts);
  };

  _api_register('rows()', function (selector, opts) {
    if (selector === undefined) {
      selector = '';
    } else if ($.isPlainObject(selector)) {
      opts = selector;
      selector = '';
    }

    opts = _selector_opts(opts);
    var inst = this.iterator('table', function (settings) {
      return __row_selector(settings, selector, opts);
    }, 1);
    inst.selector.rows = selector;
    inst.selector.opts = opts;
    return inst;
  });

  _api_register('rows().nodes()', function () {
    return this.iterator('row', function (settings, row) {
      return settings.aoData[row].nTr || undefined;
    }, 1);
  });

  _api_register('rows().data()', function () {
    return this.iterator(true, 'rows', function (settings, rows) {
      return _pluck_order(settings.aoData, rows, '_aData');
    }, 1);
  });

  _api_registerPlural('rows().cache()', 'row().cache()', function (type) {
    return this.iterator('row', function (settings, row) {
      var r = settings.aoData[row];
      return type === 'search' ? r._aFilterData : r._aSortData;
    }, 1);
  });

  _api_registerPlural('rows().invalidate()', 'row().invalidate()', function (src) {
    return this.iterator('row', function (settings, row) {
      _fnInvalidate(settings, row, src);
    });
  });

  _api_registerPlural('rows().indexes()', 'row().index()', function () {
    return this.iterator('row', function (settings, row) {
      return row;
    }, 1);
  });

  _api_registerPlural('rows().ids()', 'row().id()', function (hash) {
    var a = [];
    var context = this.context;

    for (var i = 0, ien = context.length; i < ien; i++) {
      for (var j = 0, jen = this[i].length; j < jen; j++) {
        var id = context[i].rowIdFn(context[i].aoData[this[i][j]]._aData);
        a.push((hash === true ? '#' : '') + id);
      }
    }

    return new _Api2(context, a);
  });

  _api_registerPlural('rows().remove()', 'row().remove()', function () {
    var that = this;
    this.iterator('row', function (settings, row, thatIdx) {
      var data = settings.aoData;
      var rowData = data[row];
      var i, ien, j, jen;
      var loopRow, loopCells;
      data.splice(row, 1);

      for (i = 0, ien = data.length; i < ien; i++) {
        loopRow = data[i];
        loopCells = loopRow.anCells;

        if (loopRow.nTr !== null) {
          loopRow.nTr._DT_RowIndex = i;
        }

        if (loopCells !== null) {
          for (j = 0, jen = loopCells.length; j < jen; j++) {
            loopCells[j]._DT_CellIndex.row = i;
          }
        }
      }

      _fnDeleteIndex(settings.aiDisplayMaster, row);

      _fnDeleteIndex(settings.aiDisplay, row);

      _fnDeleteIndex(that[thatIdx], row, false);

      if (settings._iRecordsDisplay > 0) {
        settings._iRecordsDisplay--;
      }

      _fnLengthOverflow(settings);

      var id = settings.rowIdFn(rowData._aData);

      if (id !== undefined) {
        delete settings.aIds[id];
      }
    });
    this.iterator('table', function (settings) {
      for (var i = 0, ien = settings.aoData.length; i < ien; i++) {
        settings.aoData[i].idx = i;
      }
    });
    return this;
  });

  _api_register('rows.add()', function (rows) {
    var newRows = this.iterator('table', function (settings) {
      var row, i, ien;
      var out = [];

      for (i = 0, ien = rows.length; i < ien; i++) {
        row = rows[i];

        if (row.nodeName && row.nodeName.toUpperCase() === 'TR') {
          out.push(_fnAddTr(settings, row)[0]);
        } else {
          out.push(_fnAddData(settings, row));
        }
      }

      return out;
    }, 1);
    var modRows = this.rows(-1);
    modRows.pop();
    $.merge(modRows, newRows);
    return modRows;
  });

  _api_register('row()', function (selector, opts) {
    return _selector_first(this.rows(selector, opts));
  });

  _api_register('row().data()', function (data) {
    var ctx = this.context;

    if (data === undefined) {
      return ctx.length && this.length ? ctx[0].aoData[this[0]]._aData : undefined;
    }

    var row = ctx[0].aoData[this[0]];
    row._aData = data;

    if ($.isArray(data) && row.nTr.id) {
      _fnSetObjectDataFn(ctx[0].rowId)(data, row.nTr.id);
    }

    _fnInvalidate(ctx[0], this[0], 'data');

    return this;
  });

  _api_register('row().node()', function () {
    var ctx = this.context;
    return ctx.length && this.length ? ctx[0].aoData[this[0]].nTr || null : null;
  });

  _api_register('row.add()', function (row) {
    if (row instanceof $ && row.length) {
      row = row[0];
    }

    var rows = this.iterator('table', function (settings) {
      if (row.nodeName && row.nodeName.toUpperCase() === 'TR') {
        return _fnAddTr(settings, row)[0];
      }

      return _fnAddData(settings, row);
    });
    return this.row(rows[0]);
  });

  var __details_add = function __details_add(ctx, row, data, klass) {
    var rows = [];

    var addRow = function addRow(r, k) {
      if ($.isArray(r) || r instanceof $) {
        for (var i = 0, ien = r.length; i < ien; i++) {
          addRow(r[i], k);
        }

        return;
      }

      if (r.nodeName && r.nodeName.toLowerCase() === 'tr') {
        rows.push(r);
      } else {
        var created = $('<tr><td/></tr>').addClass(k);
        $('td', created).addClass(k).html(r)[0].colSpan = _fnVisbleColumns(ctx);
        rows.push(created[0]);
      }
    };

    addRow(data, klass);

    if (row._details) {
      row._details.detach();
    }

    row._details = $(rows);

    if (row._detailsShow) {
      row._details.insertAfter(row.nTr);
    }
  };

  var __details_remove = function __details_remove(api, idx) {
    var ctx = api.context;

    if (ctx.length) {
      var row = ctx[0].aoData[idx !== undefined ? idx : api[0]];

      if (row && row._details) {
        row._details.remove();

        row._detailsShow = undefined;
        row._details = undefined;
      }
    }
  };

  var __details_display = function __details_display(api, show) {
    var ctx = api.context;

    if (ctx.length && api.length) {
      var row = ctx[0].aoData[api[0]];

      if (row._details) {
        row._detailsShow = show;

        if (show) {
          row._details.insertAfter(row.nTr);
        } else {
          row._details.detach();
        }

        __details_events(ctx[0]);
      }
    }
  };

  var __details_events = function __details_events(settings) {
    var api = new _Api2(settings);
    var namespace = '.dt.DT_details';
    var drawEvent = 'draw' + namespace;
    var colvisEvent = 'column-visibility' + namespace;
    var destroyEvent = 'destroy' + namespace;
    var data = settings.aoData;
    api.off(drawEvent + ' ' + colvisEvent + ' ' + destroyEvent);

    if (_pluck(data, '_details').length > 0) {
      api.on(drawEvent, function (e, ctx) {
        if (settings !== ctx) {
          return;
        }

        api.rows({
          page: 'current'
        }).eq(0).each(function (idx) {
          var row = data[idx];

          if (row._detailsShow) {
            row._details.insertAfter(row.nTr);
          }
        });
      });
      api.on(colvisEvent, function (e, ctx, idx, vis) {
        if (settings !== ctx) {
          return;
        }

        var row,
            visible = _fnVisbleColumns(ctx);

        for (var i = 0, ien = data.length; i < ien; i++) {
          row = data[i];

          if (row._details) {
            row._details.children('td[colspan]').attr('colspan', visible);
          }
        }
      });
      api.on(destroyEvent, function (e, ctx) {
        if (settings !== ctx) {
          return;
        }

        for (var i = 0, ien = data.length; i < ien; i++) {
          if (data[i]._details) {
            __details_remove(api, i);
          }
        }
      });
    }
  };

  var _emp = '';

  var _child_obj = _emp + 'row().child';

  var _child_mth = _child_obj + '()';

  _api_register(_child_mth, function (data, klass) {
    var ctx = this.context;

    if (data === undefined) {
      return ctx.length && this.length ? ctx[0].aoData[this[0]]._details : undefined;
    } else if (data === true) {
      this.child.show();
    } else if (data === false) {
      __details_remove(this);
    } else if (ctx.length && this.length) {
      __details_add(ctx[0], ctx[0].aoData[this[0]], data, klass);
    }

    return this;
  });

  _api_register([_child_obj + '.show()', _child_mth + '.show()'], function (show) {
    __details_display(this, true);

    return this;
  });

  _api_register([_child_obj + '.hide()', _child_mth + '.hide()'], function () {
    __details_display(this, false);

    return this;
  });

  _api_register([_child_obj + '.remove()', _child_mth + '.remove()'], function () {
    __details_remove(this);

    return this;
  });

  _api_register(_child_obj + '.isShown()', function () {
    var ctx = this.context;

    if (ctx.length && this.length) {
      return ctx[0].aoData[this[0]]._detailsShow || false;
    }

    return false;
  });

  var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;

  var __columnData = function __columnData(settings, column, r1, r2, rows) {
    var a = [];

    for (var row = 0, ien = rows.length; row < ien; row++) {
      a.push(_fnGetCellData(settings, rows[row], column));
    }

    return a;
  };

  var __column_selector = function __column_selector(settings, selector, opts) {
    var columns = settings.aoColumns,
        names = _pluck(columns, 'sName'),
        nodes = _pluck(columns, 'nTh');

    var run = function run(s) {
      var selInt = _intVal(s);

      if (s === '') {
        return _range(columns.length);
      }

      if (selInt !== null) {
        return [selInt >= 0 ? selInt : columns.length + selInt];
      }

      if (typeof s === 'function') {
        var rows = _selector_row_indexes(settings, opts);

        return $.map(columns, function (col, idx) {
          return s(idx, __columnData(settings, idx, 0, 0, rows), nodes[idx]) ? idx : null;
        });
      }

      var match = typeof s === 'string' ? s.match(__re_column_selector) : '';

      if (match) {
        switch (match[2]) {
          case 'visIdx':
          case 'visible':
            var idx = parseInt(match[1], 10);

            if (idx < 0) {
              var visColumns = $.map(columns, function (col, i) {
                return col.bVisible ? i : null;
              });
              return [visColumns[visColumns.length + idx]];
            }

            return [_fnVisibleToColumnIndex(settings, idx)];

          case 'name':
            return $.map(names, function (name, i) {
              return name === match[1] ? i : null;
            });

          default:
            return [];
        }
      }

      if (s.nodeName && s._DT_CellIndex) {
        return [s._DT_CellIndex.column];
      }

      var jqResult = $(nodes).filter(s).map(function () {
        return $.inArray(this, nodes);
      }).toArray();

      if (jqResult.length || !s.nodeName) {
        return jqResult;
      }

      var host = $(s).closest('*[data-dt-column]');
      return host.length ? [host.data('dt-column')] : [];
    };

    return _selector_run('column', selector, run, settings, opts);
  };

  var __setColumnVis = function __setColumnVis(settings, column, vis) {
    var cols = settings.aoColumns,
        col = cols[column],
        data = settings.aoData,
        row,
        cells,
        i,
        ien,
        tr;

    if (vis === undefined) {
      return col.bVisible;
    }

    if (col.bVisible === vis) {
      return;
    }

    if (vis) {
      var insertBefore = $.inArray(true, _pluck(cols, 'bVisible'), column + 1);

      for (i = 0, ien = data.length; i < ien; i++) {
        tr = data[i].nTr;
        cells = data[i].anCells;

        if (tr) {
          tr.insertBefore(cells[column], cells[insertBefore] || null);
        }
      }
    } else {
      $(_pluck(settings.aoData, 'anCells', column)).detach();
    }

    col.bVisible = vis;

    _fnDrawHead(settings, settings.aoHeader);

    _fnDrawHead(settings, settings.aoFooter);

    if (!settings.aiDisplay.length) {
      $(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
    }

    _fnSaveState(settings);
  };

  _api_register('columns()', function (selector, opts) {
    if (selector === undefined) {
      selector = '';
    } else if ($.isPlainObject(selector)) {
      opts = selector;
      selector = '';
    }

    opts = _selector_opts(opts);
    var inst = this.iterator('table', function (settings) {
      return __column_selector(settings, selector, opts);
    }, 1);
    inst.selector.cols = selector;
    inst.selector.opts = opts;
    return inst;
  });

  _api_registerPlural('columns().header()', 'column().header()', function (selector, opts) {
    return this.iterator('column', function (settings, column) {
      return settings.aoColumns[column].nTh;
    }, 1);
  });

  _api_registerPlural('columns().footer()', 'column().footer()', function (selector, opts) {
    return this.iterator('column', function (settings, column) {
      return settings.aoColumns[column].nTf;
    }, 1);
  });

  _api_registerPlural('columns().data()', 'column().data()', function () {
    return this.iterator('column-rows', __columnData, 1);
  });

  _api_registerPlural('columns().dataSrc()', 'column().dataSrc()', function () {
    return this.iterator('column', function (settings, column) {
      return settings.aoColumns[column].mData;
    }, 1);
  });

  _api_registerPlural('columns().cache()', 'column().cache()', function (type) {
    return this.iterator('column-rows', function (settings, column, i, j, rows) {
      return _pluck_order(settings.aoData, rows, type === 'search' ? '_aFilterData' : '_aSortData', column);
    }, 1);
  });

  _api_registerPlural('columns().nodes()', 'column().nodes()', function () {
    return this.iterator('column-rows', function (settings, column, i, j, rows) {
      return _pluck_order(settings.aoData, rows, 'anCells', column);
    }, 1);
  });

  _api_registerPlural('columns().visible()', 'column().visible()', function (vis, calc) {
    var ret = this.iterator('column', function (settings, column) {
      if (vis === undefined) {
        return settings.aoColumns[column].bVisible;
      }

      __setColumnVis(settings, column, vis);
    });

    if (vis !== undefined) {
      this.iterator('column', function (settings, column) {
        _fnCallbackFire(settings, null, 'column-visibility', [settings, column, vis, calc]);
      });

      if (calc === undefined || calc) {
        this.columns.adjust();
      }
    }

    return ret;
  });

  _api_registerPlural('columns().indexes()', 'column().index()', function (type) {
    return this.iterator('column', function (settings, column) {
      return type === 'visible' ? _fnColumnIndexToVisible(settings, column) : column;
    }, 1);
  });

  _api_register('columns.adjust()', function () {
    return this.iterator('table', function (settings) {
      _fnAdjustColumnSizing(settings);
    }, 1);
  });

  _api_register('column.index()', function (type, idx) {
    if (this.context.length !== 0) {
      var ctx = this.context[0];

      if (type === 'fromVisible' || type === 'toData') {
        return _fnVisibleToColumnIndex(ctx, idx);
      } else if (type === 'fromData' || type === 'toVisible') {
        return _fnColumnIndexToVisible(ctx, idx);
      }
    }
  });

  _api_register('column()', function (selector, opts) {
    return _selector_first(this.columns(selector, opts));
  });

  var __cell_selector = function __cell_selector(settings, selector, opts) {
    var data = settings.aoData;

    var rows = _selector_row_indexes(settings, opts);

    var cells = _removeEmpty(_pluck_order(data, rows, 'anCells'));

    var allCells = $([].concat.apply([], cells));
    var row;
    var columns = settings.aoColumns.length;
    var a, i, ien, j, o, host;

    var run = function run(s) {
      var fnSelector = typeof s === 'function';

      if (s === null || s === undefined || fnSelector) {
        a = [];

        for (i = 0, ien = rows.length; i < ien; i++) {
          row = rows[i];

          for (j = 0; j < columns; j++) {
            o = {
              row: row,
              column: j
            };

            if (fnSelector) {
              host = data[row];

              if (s(o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null)) {
                a.push(o);
              }
            } else {
              a.push(o);
            }
          }
        }

        return a;
      }

      if ($.isPlainObject(s)) {
        return s.column !== undefined && s.row !== undefined && $.inArray(s.row, rows) !== -1 ? [s] : [];
      }

      var jqResult = allCells.filter(s).map(function (i, el) {
        return {
          row: el._DT_CellIndex.row,
          column: el._DT_CellIndex.column
        };
      }).toArray();

      if (jqResult.length || !s.nodeName) {
        return jqResult;
      }

      host = $(s).closest('*[data-dt-row]');
      return host.length ? [{
        row: host.data('dt-row'),
        column: host.data('dt-column')
      }] : [];
    };

    return _selector_run('cell', selector, run, settings, opts);
  };

  _api_register('cells()', function (rowSelector, columnSelector, opts) {
    if ($.isPlainObject(rowSelector)) {
      if (rowSelector.row === undefined) {
        opts = rowSelector;
        rowSelector = null;
      } else {
        opts = columnSelector;
        columnSelector = null;
      }
    }

    if ($.isPlainObject(columnSelector)) {
      opts = columnSelector;
      columnSelector = null;
    }

    if (columnSelector === null || columnSelector === undefined) {
      return this.iterator('table', function (settings) {
        return __cell_selector(settings, rowSelector, _selector_opts(opts));
      });
    }

    var columns = this.columns(columnSelector);
    var rows = this.rows(rowSelector);
    var a, i, ien, j, jen;
    this.iterator('table', function (settings, idx) {
      a = [];

      for (i = 0, ien = rows[idx].length; i < ien; i++) {
        for (j = 0, jen = columns[idx].length; j < jen; j++) {
          a.push({
            row: rows[idx][i],
            column: columns[idx][j]
          });
        }
      }
    }, 1);
    var cells = this.cells(a, opts);
    $.extend(cells.selector, {
      cols: columnSelector,
      rows: rowSelector,
      opts: opts
    });
    return cells;
  });

  _api_registerPlural('cells().nodes()', 'cell().node()', function () {
    return this.iterator('cell', function (settings, row, column) {
      var data = settings.aoData[row];
      return data && data.anCells ? data.anCells[column] : undefined;
    }, 1);
  });

  _api_register('cells().data()', function () {
    return this.iterator('cell', function (settings, row, column) {
      return _fnGetCellData(settings, row, column);
    }, 1);
  });

  _api_registerPlural('cells().cache()', 'cell().cache()', function (type) {
    type = type === 'search' ? '_aFilterData' : '_aSortData';
    return this.iterator('cell', function (settings, row, column) {
      return settings.aoData[row][type][column];
    }, 1);
  });

  _api_registerPlural('cells().render()', 'cell().render()', function (type) {
    return this.iterator('cell', function (settings, row, column) {
      return _fnGetCellData(settings, row, column, type);
    }, 1);
  });

  _api_registerPlural('cells().indexes()', 'cell().index()', function () {
    return this.iterator('cell', function (settings, row, column) {
      return {
        row: row,
        column: column,
        columnVisible: _fnColumnIndexToVisible(settings, column)
      };
    }, 1);
  });

  _api_registerPlural('cells().invalidate()', 'cell().invalidate()', function (src) {
    return this.iterator('cell', function (settings, row, column) {
      _fnInvalidate(settings, row, src, column);
    });
  });

  _api_register('cell()', function (rowSelector, columnSelector, opts) {
    return _selector_first(this.cells(rowSelector, columnSelector, opts));
  });

  _api_register('cell().data()', function (data) {
    var ctx = this.context;
    var cell = this[0];

    if (data === undefined) {
      return ctx.length && cell.length ? _fnGetCellData(ctx[0], cell[0].row, cell[0].column) : undefined;
    }

    _fnSetCellData(ctx[0], cell[0].row, cell[0].column, data);

    _fnInvalidate(ctx[0], cell[0].row, 'data', cell[0].column);

    return this;
  });

  _api_register('order()', function (order, dir) {
    var ctx = this.context;

    if (order === undefined) {
      return ctx.length !== 0 ? ctx[0].aaSorting : undefined;
    }

    if (typeof order === 'number') {
      order = [[order, dir]];
    } else if (order.length && !$.isArray(order[0])) {
      order = Array.prototype.slice.call(arguments);
    }

    return this.iterator('table', function (settings) {
      settings.aaSorting = order.slice();
    });
  });

  _api_register('order.listener()', function (node, column, callback) {
    return this.iterator('table', function (settings) {
      _fnSortAttachListener(settings, node, column, callback);
    });
  });

  _api_register('order.fixed()', function (set) {
    if (!set) {
      var ctx = this.context;
      var fixed = ctx.length ? ctx[0].aaSortingFixed : undefined;
      return $.isArray(fixed) ? {
        pre: fixed
      } : fixed;
    }

    return this.iterator('table', function (settings) {
      settings.aaSortingFixed = $.extend(true, {}, set);
    });
  });

  _api_register(['columns().order()', 'column().order()'], function (dir) {
    var that = this;
    return this.iterator('table', function (settings, i) {
      var sort = [];
      $.each(that[i], function (j, col) {
        sort.push([col, dir]);
      });
      settings.aaSorting = sort;
    });
  });

  _api_register('search()', function (input, regex, smart, caseInsen) {
    var ctx = this.context;

    if (input === undefined) {
      return ctx.length !== 0 ? ctx[0].oPreviousSearch.sSearch : undefined;
    }

    return this.iterator('table', function (settings) {
      if (!settings.oFeatures.bFilter) {
        return;
      }

      _fnFilterComplete(settings, $.extend({}, settings.oPreviousSearch, {
        "sSearch": input + "",
        "bRegex": regex === null ? false : regex,
        "bSmart": smart === null ? true : smart,
        "bCaseInsensitive": caseInsen === null ? true : caseInsen
      }), 1);
    });
  });

  _api_registerPlural('columns().search()', 'column().search()', function (input, regex, smart, caseInsen) {
    return this.iterator('column', function (settings, column) {
      var preSearch = settings.aoPreSearchCols;

      if (input === undefined) {
        return preSearch[column].sSearch;
      }

      if (!settings.oFeatures.bFilter) {
        return;
      }

      $.extend(preSearch[column], {
        "sSearch": input + "",
        "bRegex": regex === null ? false : regex,
        "bSmart": smart === null ? true : smart,
        "bCaseInsensitive": caseInsen === null ? true : caseInsen
      });

      _fnFilterComplete(settings, settings.oPreviousSearch, 1);
    });
  });

  _api_register('state()', function () {
    return this.context.length ? this.context[0].oSavedState : null;
  });

  _api_register('state.clear()', function () {
    return this.iterator('table', function (settings) {
      settings.fnStateSaveCallback.call(settings.oInstance, settings, {});
    });
  });

  _api_register('state.loaded()', function () {
    return this.context.length ? this.context[0].oLoadedState : null;
  });

  _api_register('state.save()', function () {
    return this.iterator('table', function (settings) {
      _fnSaveState(settings);
    });
  });

  DataTable.versionCheck = DataTable.fnVersionCheck = function (version) {
    var aThis = DataTable.version.split('.');
    var aThat = version.split('.');
    var iThis, iThat;

    for (var i = 0, iLen = aThat.length; i < iLen; i++) {
      iThis = parseInt(aThis[i], 10) || 0;
      iThat = parseInt(aThat[i], 10) || 0;

      if (iThis === iThat) {
        continue;
      }

      return iThis > iThat;
    }

    return true;
  };

  DataTable.isDataTable = DataTable.fnIsDataTable = function (table) {
    var t = $(table).get(0);
    var is = false;

    if (table instanceof DataTable.Api) {
      return true;
    }

    $.each(DataTable.settings, function (i, o) {
      var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
      var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;

      if (o.nTable === t || head === t || foot === t) {
        is = true;
      }
    });
    return is;
  };

  DataTable.tables = DataTable.fnTables = function (visible) {
    var api = false;

    if ($.isPlainObject(visible)) {
      api = visible.api;
      visible = visible.visible;
    }

    var a = $.map(DataTable.settings, function (o) {
      if (!visible || visible && $(o.nTable).is(':visible')) {
        return o.nTable;
      }
    });
    return api ? new _Api2(a) : a;
  };

  DataTable.camelToHungarian = _fnCamelToHungarian;

  _api_register('$()', function (selector, opts) {
    var rows = this.rows(opts).nodes(),
        jqRows = $(rows);
    return $([].concat(jqRows.filter(selector).toArray(), jqRows.find(selector).toArray()));
  });

  $.each(['on', 'one', 'off'], function (i, key) {
    _api_register(key + '()', function () {
      var args = Array.prototype.slice.call(arguments);
      args[0] = $.map(args[0].split(/\s/), function (e) {
        return !e.match(/\.dt\b/) ? e + '.dt' : e;
      }).join(' ');
      var inst = $(this.tables().nodes());
      inst[key].apply(inst, args);
      return this;
    });
  });

  _api_register('clear()', function () {
    return this.iterator('table', function (settings) {
      _fnClearTable(settings);
    });
  });

  _api_register('settings()', function () {
    return new _Api2(this.context, this.context);
  });

  _api_register('init()', function () {
    var ctx = this.context;
    return ctx.length ? ctx[0].oInit : null;
  });

  _api_register('data()', function () {
    return this.iterator('table', function (settings) {
      return _pluck(settings.aoData, '_aData');
    }).flatten();
  });

  _api_register('destroy()', function (remove) {
    remove = remove || false;
    return this.iterator('table', function (settings) {
      var orig = settings.nTableWrapper.parentNode;
      var classes = settings.oClasses;
      var table = settings.nTable;
      var tbody = settings.nTBody;
      var thead = settings.nTHead;
      var tfoot = settings.nTFoot;
      var jqTable = $(table);
      var jqTbody = $(tbody);
      var jqWrapper = $(settings.nTableWrapper);
      var rows = $.map(settings.aoData, function (r) {
        return r.nTr;
      });
      var i, ien;
      settings.bDestroying = true;

      _fnCallbackFire(settings, "aoDestroyCallback", "destroy", [settings]);

      if (!remove) {
        new _Api2(settings).columns().visible(true);
      }

      jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
      $(window).off('.DT-' + settings.sInstance);

      if (table != thead.parentNode) {
        jqTable.children('thead').detach();
        jqTable.append(thead);
      }

      if (tfoot && table != tfoot.parentNode) {
        jqTable.children('tfoot').detach();
        jqTable.append(tfoot);
      }

      settings.aaSorting = [];
      settings.aaSortingFixed = [];

      _fnSortingClasses(settings);

      $(rows).removeClass(settings.asStripeClasses.join(' '));
      $('th, td', thead).removeClass(classes.sSortable + ' ' + classes.sSortableAsc + ' ' + classes.sSortableDesc + ' ' + classes.sSortableNone);
      jqTbody.children().detach();
      jqTbody.append(rows);
      var removedMethod = remove ? 'remove' : 'detach';
      jqTable[removedMethod]();
      jqWrapper[removedMethod]();

      if (!remove && orig) {
        orig.insertBefore(table, settings.nTableReinsertBefore);
        jqTable.css('width', settings.sDestroyWidth).removeClass(classes.sTable);
        ien = settings.asDestroyStripes.length;

        if (ien) {
          jqTbody.children().each(function (i) {
            $(this).addClass(settings.asDestroyStripes[i % ien]);
          });
        }
      }

      var idx = $.inArray(settings, DataTable.settings);

      if (idx !== -1) {
        DataTable.settings.splice(idx, 1);
      }
    });
  });

  $.each(['column', 'row', 'cell'], function (i, type) {
    _api_register(type + 's().every()', function (fn) {
      var opts = this.selector.opts;
      var api = this;
      return this.iterator(type, function (settings, arg1, arg2, arg3, arg4) {
        fn.call(api[type](arg1, type === 'cell' ? arg2 : opts, type === 'cell' ? opts : undefined), arg1, arg2, arg3, arg4);
      });
    });
  });

  _api_register('i18n()', function (token, def, plural) {
    var ctx = this.context[0];

    var resolved = _fnGetObjectDataFn(token)(ctx.oLanguage);

    if (resolved === undefined) {
      resolved = def;
    }

    if (plural !== undefined && $.isPlainObject(resolved)) {
      resolved = resolved[plural] !== undefined ? resolved[plural] : resolved._;
    }

    return resolved.replace('%d', plural);
  });

  DataTable.version = "1.10.18";
  DataTable.settings = [];
  DataTable.models = {};
  DataTable.models.oSearch = {
    "bCaseInsensitive": true,
    "sSearch": "",
    "bRegex": false,
    "bSmart": true
  };
  DataTable.models.oRow = {
    "nTr": null,
    "anCells": null,
    "_aData": [],
    "_aSortData": null,
    "_aFilterData": null,
    "_sFilterRow": null,
    "_sRowStripe": "",
    "src": null,
    "idx": -1
  };
  DataTable.models.oColumn = {
    "idx": null,
    "aDataSort": null,
    "asSorting": null,
    "bSearchable": null,
    "bSortable": null,
    "bVisible": null,
    "_sManualType": null,
    "_bAttrSrc": false,
    "fnCreatedCell": null,
    "fnGetData": null,
    "fnSetData": null,
    "mData": null,
    "mRender": null,
    "nTh": null,
    "nTf": null,
    "sClass": null,
    "sContentPadding": null,
    "sDefaultContent": null,
    "sName": null,
    "sSortDataType": 'std',
    "sSortingClass": null,
    "sSortingClassJUI": null,
    "sTitle": null,
    "sType": null,
    "sWidth": null,
    "sWidthOrig": null
  };
  DataTable.defaults = {
    "aaData": null,
    "aaSorting": [[0, 'asc']],
    "aaSortingFixed": [],
    "ajax": null,
    "aLengthMenu": [10, 25, 50, 100],
    "aoColumns": null,
    "aoColumnDefs": null,
    "aoSearchCols": [],
    "asStripeClasses": null,
    "bAutoWidth": true,
    "bDeferRender": false,
    "bDestroy": false,
    "bFilter": true,
    "bInfo": true,
    "bLengthChange": true,
    "bPaginate": true,
    "bProcessing": false,
    "bRetrieve": false,
    "bScrollCollapse": false,
    "bServerSide": false,
    "bSort": true,
    "bSortMulti": true,
    "bSortCellsTop": false,
    "bSortClasses": true,
    "bStateSave": false,
    "fnCreatedRow": null,
    "fnDrawCallback": null,
    "fnFooterCallback": null,
    "fnFormatNumber": function fnFormatNumber(toFormat) {
      return toFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.oLanguage.sThousands);
    },
    "fnHeaderCallback": null,
    "fnInfoCallback": null,
    "fnInitComplete": null,
    "fnPreDrawCallback": null,
    "fnRowCallback": null,
    "fnServerData": null,
    "fnServerParams": null,
    "fnStateLoadCallback": function fnStateLoadCallback(settings) {
      try {
        return JSON.parse((settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem('DataTables_' + settings.sInstance + '_' + location.pathname));
      } catch (e) {}
    },
    "fnStateLoadParams": null,
    "fnStateLoaded": null,
    "fnStateSaveCallback": function fnStateSaveCallback(settings, data) {
      try {
        (settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem('DataTables_' + settings.sInstance + '_' + location.pathname, JSON.stringify(data));
      } catch (e) {}
    },
    "fnStateSaveParams": null,
    "iStateDuration": 7200,
    "iDeferLoading": null,
    "iDisplayLength": 10,
    "iDisplayStart": 0,
    "iTabIndex": 0,
    "oClasses": {},
    "oLanguage": {
      "oAria": {
        "sSortAscending": ": activate to sort column ascending",
        "sSortDescending": ": activate to sort column descending"
      },
      "oPaginate": {
        "sFirst": "First",
        "sLast": "Last",
        "sNext": "Next",
        "sPrevious": "Previous"
      },
      "sEmptyTable": "No data available in table",
      "sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
      "sInfoEmpty": "Showing 0 to 0 of 0 entries",
      "sInfoFiltered": "(filtered from _MAX_ total entries)",
      "sInfoPostFix": "",
      "sDecimal": "",
      "sThousands": ",",
      "sLengthMenu": "Show _MENU_ entries",
      "sLoadingRecords": "Loading...",
      "sProcessing": "Processing...",
      "sSearch": "Search:",
      "sSearchPlaceholder": "",
      "sUrl": "",
      "sZeroRecords": "No matching records found"
    },
    "oSearch": $.extend({}, DataTable.models.oSearch),
    "sAjaxDataProp": "data",
    "sAjaxSource": null,
    "sDom": "lfrtip",
    "searchDelay": null,
    "sPaginationType": "simple_numbers",
    "sScrollX": "",
    "sScrollXInner": "",
    "sScrollY": "",
    "sServerMethod": "GET",
    "renderer": null,
    "rowId": "DT_RowId"
  };

  _fnHungarianMap(DataTable.defaults);

  DataTable.defaults.column = {
    "aDataSort": null,
    "iDataSort": -1,
    "asSorting": ['asc', 'desc'],
    "bSearchable": true,
    "bSortable": true,
    "bVisible": true,
    "fnCreatedCell": null,
    "mData": null,
    "mRender": null,
    "sCellType": "td",
    "sClass": "",
    "sContentPadding": "",
    "sDefaultContent": null,
    "sName": "",
    "sSortDataType": "std",
    "sTitle": null,
    "sType": null,
    "sWidth": null
  };

  _fnHungarianMap(DataTable.defaults.column);

  DataTable.models.oSettings = {
    "oFeatures": {
      "bAutoWidth": null,
      "bDeferRender": null,
      "bFilter": null,
      "bInfo": null,
      "bLengthChange": null,
      "bPaginate": null,
      "bProcessing": null,
      "bServerSide": null,
      "bSort": null,
      "bSortMulti": null,
      "bSortClasses": null,
      "bStateSave": null
    },
    "oScroll": {
      "bCollapse": null,
      "iBarWidth": 0,
      "sX": null,
      "sXInner": null,
      "sY": null
    },
    "oLanguage": {
      "fnInfoCallback": null
    },
    "oBrowser": {
      "bScrollOversize": false,
      "bScrollbarLeft": false,
      "bBounding": false,
      "barWidth": 0
    },
    "ajax": null,
    "aanFeatures": [],
    "aoData": [],
    "aiDisplay": [],
    "aiDisplayMaster": [],
    "aIds": {},
    "aoColumns": [],
    "aoHeader": [],
    "aoFooter": [],
    "oPreviousSearch": {},
    "aoPreSearchCols": [],
    "aaSorting": null,
    "aaSortingFixed": [],
    "asStripeClasses": null,
    "asDestroyStripes": [],
    "sDestroyWidth": 0,
    "aoRowCallback": [],
    "aoHeaderCallback": [],
    "aoFooterCallback": [],
    "aoDrawCallback": [],
    "aoRowCreatedCallback": [],
    "aoPreDrawCallback": [],
    "aoInitComplete": [],
    "aoStateSaveParams": [],
    "aoStateLoadParams": [],
    "aoStateLoaded": [],
    "sTableId": "",
    "nTable": null,
    "nTHead": null,
    "nTFoot": null,
    "nTBody": null,
    "nTableWrapper": null,
    "bDeferLoading": false,
    "bInitialised": false,
    "aoOpenRows": [],
    "sDom": null,
    "searchDelay": null,
    "sPaginationType": "two_button",
    "iStateDuration": 0,
    "aoStateSave": [],
    "aoStateLoad": [],
    "oSavedState": null,
    "oLoadedState": null,
    "sAjaxSource": null,
    "sAjaxDataProp": null,
    "bAjaxDataGet": true,
    "jqXHR": null,
    "json": undefined,
    "oAjaxData": undefined,
    "fnServerData": null,
    "aoServerParams": [],
    "sServerMethod": null,
    "fnFormatNumber": null,
    "aLengthMenu": null,
    "iDraw": 0,
    "bDrawing": false,
    "iDrawError": -1,
    "_iDisplayLength": 10,
    "_iDisplayStart": 0,
    "_iRecordsTotal": 0,
    "_iRecordsDisplay": 0,
    "oClasses": {},
    "bFiltered": false,
    "bSorted": false,
    "bSortCellsTop": null,
    "oInit": null,
    "aoDestroyCallback": [],
    "fnRecordsTotal": function fnRecordsTotal() {
      return _fnDataSource(this) == 'ssp' ? this._iRecordsTotal * 1 : this.aiDisplayMaster.length;
    },
    "fnRecordsDisplay": function fnRecordsDisplay() {
      return _fnDataSource(this) == 'ssp' ? this._iRecordsDisplay * 1 : this.aiDisplay.length;
    },
    "fnDisplayEnd": function fnDisplayEnd() {
      var len = this._iDisplayLength,
          start = this._iDisplayStart,
          calc = start + len,
          records = this.aiDisplay.length,
          features = this.oFeatures,
          paginate = features.bPaginate;

      if (features.bServerSide) {
        return paginate === false || len === -1 ? start + records : Math.min(start + len, this._iRecordsDisplay);
      } else {
        return !paginate || calc > records || len === -1 ? records : calc;
      }
    },
    "oInstance": null,
    "sInstance": null,
    "iTabIndex": 0,
    "nScrollHead": null,
    "nScrollFoot": null,
    "aLastSort": [],
    "oPlugins": {},
    "rowIdFn": null,
    "rowId": null
  };
  DataTable.ext = _ext = {
    buttons: {},
    classes: {},
    build: "dt/dt-1.10.18",
    errMode: "alert",
    feature: [],
    search: [],
    selector: {
      cell: [],
      column: [],
      row: []
    },
    internal: {},
    legacy: {
      ajax: null
    },
    pager: {},
    renderer: {
      pageButton: {},
      header: {}
    },
    order: {},
    type: {
      detect: [],
      search: {},
      order: {}
    },
    _unique: 0,
    fnVersionCheck: DataTable.fnVersionCheck,
    iApiIndex: 0,
    oJUIClasses: {},
    sVersion: DataTable.version
  };
  $.extend(_ext, {
    afnFiltering: _ext.search,
    aTypes: _ext.type.detect,
    ofnSearch: _ext.type.search,
    oSort: _ext.type.order,
    afnSortData: _ext.order,
    aoFeatures: _ext.feature,
    oApi: _ext.internal,
    oStdClasses: _ext.classes,
    oPagination: _ext.pager
  });
  $.extend(DataTable.ext.classes, {
    "sTable": "dataTable",
    "sNoFooter": "no-footer",
    "sPageButton": "paginate_button",
    "sPageButtonActive": "current",
    "sPageButtonDisabled": "disabled",
    "sStripeOdd": "odd",
    "sStripeEven": "even",
    "sRowEmpty": "dataTables_empty",
    "sWrapper": "dataTables_wrapper",
    "sFilter": "dataTables_filter",
    "sInfo": "dataTables_info",
    "sPaging": "dataTables_paginate paging_",
    "sLength": "dataTables_length",
    "sProcessing": "dataTables_processing",
    "sSortAsc": "sorting_asc",
    "sSortDesc": "sorting_desc",
    "sSortable": "sorting",
    "sSortableAsc": "sorting_asc_disabled",
    "sSortableDesc": "sorting_desc_disabled",
    "sSortableNone": "sorting_disabled",
    "sSortColumn": "sorting_",
    "sFilterInput": "",
    "sLengthSelect": "",
    "sScrollWrapper": "dataTables_scroll",
    "sScrollHead": "dataTables_scrollHead",
    "sScrollHeadInner": "dataTables_scrollHeadInner",
    "sScrollBody": "dataTables_scrollBody",
    "sScrollFoot": "dataTables_scrollFoot",
    "sScrollFootInner": "dataTables_scrollFootInner",
    "sHeaderTH": "",
    "sFooterTH": "",
    "sSortJUIAsc": "",
    "sSortJUIDesc": "",
    "sSortJUI": "",
    "sSortJUIAscAllowed": "",
    "sSortJUIDescAllowed": "",
    "sSortJUIWrapper": "",
    "sSortIcon": "",
    "sJUIHeader": "",
    "sJUIFooter": ""
  });
  var extPagination = DataTable.ext.pager;

  function _numbers(page, pages) {
    var numbers = [],
        buttons = extPagination.numbers_length,
        half = Math.floor(buttons / 2),
        i = 1;

    if (pages <= buttons) {
      numbers = _range(0, pages);
    } else if (page <= half) {
      numbers = _range(0, buttons - 2);
      numbers.push('ellipsis');
      numbers.push(pages - 1);
    } else if (page >= pages - 1 - half) {
      numbers = _range(pages - (buttons - 2), pages);
      numbers.splice(0, 0, 'ellipsis');
      numbers.splice(0, 0, 0);
    } else {
      numbers = _range(page - half + 2, page + half - 1);
      numbers.push('ellipsis');
      numbers.push(pages - 1);
      numbers.splice(0, 0, 'ellipsis');
      numbers.splice(0, 0, 0);
    }

    numbers.DT_el = 'span';
    return numbers;
  }

  $.extend(extPagination, {
    simple: function simple(page, pages) {
      return ['previous', 'next'];
    },
    full: function full(page, pages) {
      return ['first', 'previous', 'next', 'last'];
    },
    numbers: function numbers(page, pages) {
      return [_numbers(page, pages)];
    },
    simple_numbers: function simple_numbers(page, pages) {
      return ['previous', _numbers(page, pages), 'next'];
    },
    full_numbers: function full_numbers(page, pages) {
      return ['first', 'previous', _numbers(page, pages), 'next', 'last'];
    },
    first_last_numbers: function first_last_numbers(page, pages) {
      return ['first', _numbers(page, pages), 'last'];
    },
    _numbers: _numbers,
    numbers_length: 7
  });
  $.extend(true, DataTable.ext.renderer, {
    pageButton: {
      _: function _(settings, host, idx, buttons, page, pages) {
        var classes = settings.oClasses;
        var lang = settings.oLanguage.oPaginate;
        var aria = settings.oLanguage.oAria.paginate || {};
        var btnDisplay,
            btnClass,
            counter = 0;

        var attach = function attach(container, buttons) {
          var i, ien, node, button;

          var clickHandler = function clickHandler(e) {
            _fnPageChange(settings, e.data.action, true);
          };

          for (i = 0, ien = buttons.length; i < ien; i++) {
            button = buttons[i];

            if ($.isArray(button)) {
              var inner = $('<' + (button.DT_el || 'div') + '/>').appendTo(container);
              attach(inner, button);
            } else {
              btnDisplay = null;
              btnClass = '';

              switch (button) {
                case 'ellipsis':
                  container.append('<span class="ellipsis">&#x2026;</span>');
                  break;

                case 'first':
                  btnDisplay = lang.sFirst;
                  btnClass = button + (page > 0 ? '' : ' ' + classes.sPageButtonDisabled);
                  break;

                case 'previous':
                  btnDisplay = lang.sPrevious;
                  btnClass = button + (page > 0 ? '' : ' ' + classes.sPageButtonDisabled);
                  break;

                case 'next':
                  btnDisplay = lang.sNext;
                  btnClass = button + (page < pages - 1 ? '' : ' ' + classes.sPageButtonDisabled);
                  break;

                case 'last':
                  btnDisplay = lang.sLast;
                  btnClass = button + (page < pages - 1 ? '' : ' ' + classes.sPageButtonDisabled);
                  break;

                default:
                  btnDisplay = button + 1;
                  btnClass = page === button ? classes.sPageButtonActive : '';
                  break;
              }

              if (btnDisplay !== null) {
                node = $('<a>', {
                  'class': classes.sPageButton + ' ' + btnClass,
                  'aria-controls': settings.sTableId,
                  'aria-label': aria[button],
                  'data-dt-idx': counter,
                  'tabindex': settings.iTabIndex,
                  'id': idx === 0 && typeof button === 'string' ? settings.sTableId + '_' + button : null
                }).html(btnDisplay).appendTo(container);

                _fnBindAction(node, {
                  action: button
                }, clickHandler);

                counter++;
              }
            }
          }
        };

        var activeEl;

        try {
          activeEl = $(host).find(document.activeElement).data('dt-idx');
        } catch (e) {}

        attach($(host).empty(), buttons);

        if (activeEl !== undefined) {
          $(host).find('[data-dt-idx=' + activeEl + ']').focus();
        }
      }
    }
  });
  $.extend(DataTable.ext.type.detect, [function (d, settings) {
    var decimal = settings.oLanguage.sDecimal;
    return _isNumber(d, decimal) ? 'num' + decimal : null;
  }, function (d, settings) {
    if (d && !(d instanceof Date) && !_re_date.test(d)) {
      return null;
    }

    var parsed = Date.parse(d);
    return parsed !== null && !isNaN(parsed) || _empty(d) ? 'date' : null;
  }, function (d, settings) {
    var decimal = settings.oLanguage.sDecimal;
    return _isNumber(d, decimal, true) ? 'num-fmt' + decimal : null;
  }, function (d, settings) {
    var decimal = settings.oLanguage.sDecimal;
    return _htmlNumeric(d, decimal) ? 'html-num' + decimal : null;
  }, function (d, settings) {
    var decimal = settings.oLanguage.sDecimal;
    return _htmlNumeric(d, decimal, true) ? 'html-num-fmt' + decimal : null;
  }, function (d, settings) {
    return _empty(d) || typeof d === 'string' && d.indexOf('<') !== -1 ? 'html' : null;
  }]);
  $.extend(DataTable.ext.type.search, {
    html: function html(data) {
      return _empty(data) ? data : typeof data === 'string' ? data.replace(_re_new_lines, " ").replace(_re_html, "") : '';
    },
    string: function string(data) {
      return _empty(data) ? data : typeof data === 'string' ? data.replace(_re_new_lines, " ") : data;
    }
  });

  var __numericReplace = function __numericReplace(d, decimalPlace, re1, re2) {
    if (d !== 0 && (!d || d === '-')) {
      return -Infinity;
    }

    if (decimalPlace) {
      d = _numToDecimal(d, decimalPlace);
    }

    if (d.replace) {
      if (re1) {
        d = d.replace(re1, '');
      }

      if (re2) {
        d = d.replace(re2, '');
      }
    }

    return d * 1;
  };

  function _addNumericSort(decimalPlace) {
    $.each({
      "num": function num(d) {
        return __numericReplace(d, decimalPlace);
      },
      "num-fmt": function numFmt(d) {
        return __numericReplace(d, decimalPlace, _re_formatted_numeric);
      },
      "html-num": function htmlNum(d) {
        return __numericReplace(d, decimalPlace, _re_html);
      },
      "html-num-fmt": function htmlNumFmt(d) {
        return __numericReplace(d, decimalPlace, _re_html, _re_formatted_numeric);
      }
    }, function (key, fn) {
      _ext.type.order[key + decimalPlace + '-pre'] = fn;

      if (key.match(/^html\-/)) {
        _ext.type.search[key + decimalPlace] = _ext.type.search.html;
      }
    });
  }

  $.extend(_ext.type.order, {
    "date-pre": function datePre(d) {
      var ts = Date.parse(d);
      return isNaN(ts) ? -Infinity : ts;
    },
    "html-pre": function htmlPre(a) {
      return _empty(a) ? '' : a.replace ? a.replace(/<.*?>/g, "").toLowerCase() : a + '';
    },
    "string-pre": function stringPre(a) {
      return _empty(a) ? '' : typeof a === 'string' ? a.toLowerCase() : !a.toString ? '' : a.toString();
    },
    "string-asc": function stringAsc(x, y) {
      return x < y ? -1 : x > y ? 1 : 0;
    },
    "string-desc": function stringDesc(x, y) {
      return x < y ? 1 : x > y ? -1 : 0;
    }
  });

  _addNumericSort('');

  $.extend(true, DataTable.ext.renderer, {
    header: {
      _: function _(settings, cell, column, classes) {
        $(settings.nTable).on('order.dt.DT', function (e, ctx, sorting, columns) {
          if (settings !== ctx) {
            return;
          }

          var colIdx = column.idx;
          cell.removeClass(column.sSortingClass + ' ' + classes.sSortAsc + ' ' + classes.sSortDesc).addClass(columns[colIdx] == 'asc' ? classes.sSortAsc : columns[colIdx] == 'desc' ? classes.sSortDesc : column.sSortingClass);
        });
      },
      jqueryui: function jqueryui(settings, cell, column, classes) {
        $('<div/>').addClass(classes.sSortJUIWrapper).append(cell.contents()).append($('<span/>').addClass(classes.sSortIcon + ' ' + column.sSortingClassJUI)).appendTo(cell);
        $(settings.nTable).on('order.dt.DT', function (e, ctx, sorting, columns) {
          if (settings !== ctx) {
            return;
          }

          var colIdx = column.idx;
          cell.removeClass(classes.sSortAsc + " " + classes.sSortDesc).addClass(columns[colIdx] == 'asc' ? classes.sSortAsc : columns[colIdx] == 'desc' ? classes.sSortDesc : column.sSortingClass);
          cell.find('span.' + classes.sSortIcon).removeClass(classes.sSortJUIAsc + " " + classes.sSortJUIDesc + " " + classes.sSortJUI + " " + classes.sSortJUIAscAllowed + " " + classes.sSortJUIDescAllowed).addClass(columns[colIdx] == 'asc' ? classes.sSortJUIAsc : columns[colIdx] == 'desc' ? classes.sSortJUIDesc : column.sSortingClassJUI);
        });
      }
    }
  });

  var __htmlEscapeEntities = function __htmlEscapeEntities(d) {
    return typeof d === 'string' ? d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : d;
  };

  DataTable.render = {
    number: function number(thousands, decimal, precision, prefix, postfix) {
      return {
        display: function display(d) {
          if (typeof d !== 'number' && typeof d !== 'string') {
            return d;
          }

          var negative = d < 0 ? '-' : '';
          var flo = parseFloat(d);

          if (isNaN(flo)) {
            return __htmlEscapeEntities(d);
          }

          flo = flo.toFixed(precision);
          d = Math.abs(flo);
          var intPart = parseInt(d, 10);
          var floatPart = precision ? decimal + (d - intPart).toFixed(precision).substring(2) : '';
          return negative + (prefix || '') + intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands) + floatPart + (postfix || '');
        }
      };
    },
    text: function text() {
      return {
        display: __htmlEscapeEntities
      };
    }
  };

  function _fnExternApiFunc(fn) {
    return function () {
      var args = [_fnSettingsFromNode(this[DataTable.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));
      return DataTable.ext.internal[fn].apply(this, args);
    };
  }

  $.extend(DataTable.ext.internal, {
    _fnExternApiFunc: _fnExternApiFunc,
    _fnBuildAjax: _fnBuildAjax,
    _fnAjaxUpdate: _fnAjaxUpdate,
    _fnAjaxParameters: _fnAjaxParameters,
    _fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
    _fnAjaxDataSrc: _fnAjaxDataSrc,
    _fnAddColumn: _fnAddColumn,
    _fnColumnOptions: _fnColumnOptions,
    _fnAdjustColumnSizing: _fnAdjustColumnSizing,
    _fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
    _fnColumnIndexToVisible: _fnColumnIndexToVisible,
    _fnVisbleColumns: _fnVisbleColumns,
    _fnGetColumns: _fnGetColumns,
    _fnColumnTypes: _fnColumnTypes,
    _fnApplyColumnDefs: _fnApplyColumnDefs,
    _fnHungarianMap: _fnHungarianMap,
    _fnCamelToHungarian: _fnCamelToHungarian,
    _fnLanguageCompat: _fnLanguageCompat,
    _fnBrowserDetect: _fnBrowserDetect,
    _fnAddData: _fnAddData,
    _fnAddTr: _fnAddTr,
    _fnNodeToDataIndex: _fnNodeToDataIndex,
    _fnNodeToColumnIndex: _fnNodeToColumnIndex,
    _fnGetCellData: _fnGetCellData,
    _fnSetCellData: _fnSetCellData,
    _fnSplitObjNotation: _fnSplitObjNotation,
    _fnGetObjectDataFn: _fnGetObjectDataFn,
    _fnSetObjectDataFn: _fnSetObjectDataFn,
    _fnGetDataMaster: _fnGetDataMaster,
    _fnClearTable: _fnClearTable,
    _fnDeleteIndex: _fnDeleteIndex,
    _fnInvalidate: _fnInvalidate,
    _fnGetRowElements: _fnGetRowElements,
    _fnCreateTr: _fnCreateTr,
    _fnBuildHead: _fnBuildHead,
    _fnDrawHead: _fnDrawHead,
    _fnDraw: _fnDraw,
    _fnReDraw: _fnReDraw,
    _fnAddOptionsHtml: _fnAddOptionsHtml,
    _fnDetectHeader: _fnDetectHeader,
    _fnGetUniqueThs: _fnGetUniqueThs,
    _fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
    _fnFilterComplete: _fnFilterComplete,
    _fnFilterCustom: _fnFilterCustom,
    _fnFilterColumn: _fnFilterColumn,
    _fnFilter: _fnFilter,
    _fnFilterCreateSearch: _fnFilterCreateSearch,
    _fnEscapeRegex: _fnEscapeRegex,
    _fnFilterData: _fnFilterData,
    _fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
    _fnUpdateInfo: _fnUpdateInfo,
    _fnInfoMacros: _fnInfoMacros,
    _fnInitialise: _fnInitialise,
    _fnInitComplete: _fnInitComplete,
    _fnLengthChange: _fnLengthChange,
    _fnFeatureHtmlLength: _fnFeatureHtmlLength,
    _fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
    _fnPageChange: _fnPageChange,
    _fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
    _fnProcessingDisplay: _fnProcessingDisplay,
    _fnFeatureHtmlTable: _fnFeatureHtmlTable,
    _fnScrollDraw: _fnScrollDraw,
    _fnApplyToChildren: _fnApplyToChildren,
    _fnCalculateColumnWidths: _fnCalculateColumnWidths,
    _fnThrottle: _fnThrottle,
    _fnConvertToWidth: _fnConvertToWidth,
    _fnGetWidestNode: _fnGetWidestNode,
    _fnGetMaxLenString: _fnGetMaxLenString,
    _fnStringToCss: _fnStringToCss,
    _fnSortFlatten: _fnSortFlatten,
    _fnSort: _fnSort,
    _fnSortAria: _fnSortAria,
    _fnSortListener: _fnSortListener,
    _fnSortAttachListener: _fnSortAttachListener,
    _fnSortingClasses: _fnSortingClasses,
    _fnSortData: _fnSortData,
    _fnSaveState: _fnSaveState,
    _fnLoadState: _fnLoadState,
    _fnSettingsFromNode: _fnSettingsFromNode,
    _fnLog: _fnLog,
    _fnMap: _fnMap,
    _fnBindAction: _fnBindAction,
    _fnCallbackReg: _fnCallbackReg,
    _fnCallbackFire: _fnCallbackFire,
    _fnLengthOverflow: _fnLengthOverflow,
    _fnRenderer: _fnRenderer,
    _fnDataSource: _fnDataSource,
    _fnRowAttributes: _fnRowAttributes,
    _fnExtend: _fnExtend,
    _fnCalculateEnd: function _fnCalculateEnd() {}
  });
  $.fn.dataTable = DataTable;
  DataTable.$ = $;
  $.fn.dataTableSettings = DataTable.settings;
  $.fn.dataTableExt = DataTable.ext;

  $.fn.DataTable = function (opts) {
    return $(this).dataTable(opts).api();
  };

  $.each(DataTable, function (prop, val) {
    $.fn.DataTable[prop] = val;
  });
  return $.fn.dataTable;
});
"use strict";

var WFDCT_DropDownSelect = {
  RendererChain: function RendererChain(_rendererChainParas) {},
  RendererDataChain: HTMLControl.RendererDataChain,
  GetValue: HTMLControl.GetValue,
  SetValue: HTMLControl.SetValue
};
"use strict";

var WFDCT_SimpleLabel = {
  RendererChain: HTMLControl.RendererChain,
  RendererDataChain: HTMLControl.RendererDataChain,
  GetValue: HTMLControl.GetValue,
  SetValue: function SetValue($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    if (fieldPO) {
      $elem.text(fieldPO.value);
      $elem.attr("control_value", fieldPO.value);
    }
  }
};
"use strict";

var WFDCT_SubFormListContainer = {
  _AddButtonElem: null,
  _$TemplateTableRow: null,
  _$SingleControlElem: null,
  _$TableElem: null,
  _$TableHeadElem: null,
  _$TableBodyElem: null,
  _EditInRow: true,
  _Display_OPButtons_Add: true,
  _Display_OPButtons_Update: true,
  _Display_OPButtons_Del: true,
  _Display_OPButtons_View: true,
  _FormRuntimeHost: null,
  _FormDataRelationList: null,
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    this._$SingleControlElem = $singleControlElem;
    this._$TableElem = this._$SingleControlElem.find("table");
    this._$TableBodyElem = this._$TableElem.find("tbody");
    this._$TableHeadElem = this._$TableElem.find("thead");
    this._EditInRow = $singleControlElem.attr("editinrow") == "false" ? false : true;
    this._FormRuntimeHost = _rendererChainParas.formRuntimeInstance;
    this._FormDataRelationList = this._FormRuntimeHost._FormDataRelationList;
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

    if (this._Display_OPButtons_Add) {
      $singleControlElem.prepend("<div class='sub-form-list-button-wrap'></div>").find("div").append(this._AddButtonElem);
    }

    if (this._Display_OPButtons_Del || this._Display_OPButtons_Update || this._Display_OPButtons_View) {
      this._$TableHeadElem.find("tr").append("<th style='width: 120px'>操作</th>");
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

    var relationPO = this.TryGetRelationPOClone();
    $singleControlElem.attr("relation_po_id", relationPO.id);
  },
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var $singleControlElem = _rendererDataChainParas.$singleControlElem;
    var relationFormRecordComplexPo = _rendererDataChainParas.relationFormRecordComplexPo;
    var relation_po_id = $singleControlElem.attr("relation_po_id");
    var relationPO = FormRelationPOUtility.FindRelationPOInRelationFormRecordComplexPo(relationFormRecordComplexPo, relation_po_id);
    var listDataRecord = FormRelationPOUtility.Get1ToNDataRecord(relationPO);

    for (var i = 0; i < listDataRecord.length; i++) {
      var oneDataRecord = listDataRecord[i];

      if (this._EditInRow) {
        this.InnerRow_AddRowToContainer(oneDataRecord);
      } else {
        var childRelationPOArray = [];
        var subRelationPO = ArrayUtility.WhereSingle(relationFormRecordComplexPo.formRecordDataRelationPOList, function (item) {
          return item.parentId == relation_po_id;
        });
        var cloneSubRelationPO = ArrayUtility.WhereSingle(this._FormDataRelationList, function (item) {
          return item.parentId == relation_po_id;
        });

        if (subRelationPO) {
          var selfKeyFieldName = subRelationPO.selfKeyFieldName;
          var outerKeyFieldName = subRelationPO.outerKeyFieldName;
          var outerKeyFieldValue = FormRelationPOUtility.FindFieldValueInOneDataRecord(oneDataRecord, outerKeyFieldName);
          var tempPO = JsonUtility.CloneSimple(cloneSubRelationPO);
          var allRecordList = FormRelationPOUtility.Get1ToNDataRecord(subRelationPO);
          var thisPOListDataRecord = [];

          for (var j = 0; j < allRecordList.length; j++) {
            var oneRecord = allRecordList[j];
            var fieldPOArray = FormRelationPOUtility.FindRecordFieldPOArray(oneRecord);

            if (ArrayUtility.True(fieldPOArray, function (fieldItem) {
              return fieldItem.fieldName == selfKeyFieldName && fieldItem.value == outerKeyFieldValue;
            })) {
              thisPOListDataRecord.push(oneRecord);
            }
          }

          FormRelationPOUtility.Add1ToNDataRecord(tempPO, thisPOListDataRecord);
          childRelationPOArray.push(tempPO);
        }

        this.Dialog_AddRowToContainer(oneDataRecord, childRelationPOArray, true);
      }
    }

    this.InnerRow_CompletedLastEdit();
  },
  SerializationValue: function SerializationValue(originalFormDataRelation, relationPO, control) {
    this.InnerRow_CompletedLastEdit();
    var allData = [];
    var all$TrAttrChildRelationPoArray = [];

    var trs = this._$SingleControlElem.find("tr[is_sub_list_tr='true']");

    for (var i = 0; i < trs.length; i++) {
      var $tr = $(trs[i]);
      var singleRelationPO = this.GetRowData($tr);
      allData.push(FormRelationPOUtility.Get1To1DataRecord(singleRelationPO));
      var trChildRelationPOArray = this.GetChildRelationPOArray($tr);

      if (trChildRelationPOArray) {
        all$TrAttrChildRelationPoArray = all$TrAttrChildRelationPoArray.concat(trChildRelationPOArray);
      }
    }

    FormRelationPOUtility.Add1ToNDataRecord(relationPO, allData);
    var childRelationArray = ArrayUtility.Where(originalFormDataRelation, function (item) {
      return item.parentId == relationPO.id;
    });

    for (var i = 0; i < childRelationArray.length; i++) {
      var childRelationPO = childRelationArray[i];
      var inTrChildRelationPoArray = ArrayUtility.Where(all$TrAttrChildRelationPoArray, function (item) {
        return item.id == childRelationPO.id;
      });
      var allChildData = [];

      if (inTrChildRelationPoArray) {
        for (var j = 0; j < inTrChildRelationPoArray.length; j++) {
          allChildData = allChildData.concat(inTrChildRelationPoArray[j].listDataRecord);
        }
      }

      FormRelationPOUtility.Add1ToNDataRecord(childRelationPO, allChildData);
    }
  },
  GetValue: function GetValue($elem, originalData, paras) {
    DialogUtility.AlertText("DynamicContainer类型的控件的序列化交由SerializationValue方法自行完成!");
  },
  SetValue: function SetValue($elem, relationFormRecordComplexPo, _rendererDataChainParas) {},
  AddEvent: function AddEvent(sender) {
    var $hostElem = sender.data.hostElem;
    var selfObj = sender.data.selfObj;
    var instanceName = sender.data.instanceName;
    var rendererChainParas = sender.data._rendererChainParas;

    if (selfObj._EditInRow) {
      selfObj.InnerRow_AddRowToContainer(null);
    } else {
      selfObj.Dialog_ShowAddRowSubFormDialog(sender, $hostElem, rendererChainParas, instanceName);
    }
  },
  ValidateSerializationSubFormDataEnable: function ValidateSerializationSubFormDataEnable(serializationSubFormData) {
    return true;
  },
  ValidateRendererChainEnable: function ValidateRendererChainEnable() {
    return {
      success: true,
      msg: ""
    };
  },
  GetRowId: function GetRowId($tr) {
    var id = $tr.attr("tr_record_id");
    return id;
  },
  GetRowData: function GetRowData($tr) {
    var json = $tr.attr("tr_record_data");
    return JsonUtility.StringToJson(json);
  },
  GetChildRelationPOArray: function GetChildRelationPOArray($tr) {
    var json = $tr.attr("child_relation_po_array");

    if (!StringUtility.IsNullOrEmpty(json)) {
      return JsonUtility.StringToJson(json);
    }

    return null;
  },
  SaveDataToRowAttr: function SaveDataToRowAttr(relationPO, $tr, aboutRelationPOArray) {
    $tr.attr("is_sub_list_tr", "true");
    $tr.attr("tr_record_id", FormRelationPOUtility.FindIdFieldPOByRelationPO(relationPO).value);
    $tr.attr("tr_record_data", JsonUtility.JsonToString(relationPO));

    if (aboutRelationPOArray && aboutRelationPOArray.length > 0) {
      $tr.attr("child_relation_po_array", JsonUtility.JsonToString(aboutRelationPOArray));
    }
  },
  TryGetChildRelationPOArrayClone: function TryGetChildRelationPOArrayClone(relationPO) {
    var childRelation = ArrayUtility.Where(this._FormDataRelationList, function (item) {
      return item.parentId == relationPO.id;
    });
    return JsonUtility.CloneArraySimple(childRelation);
  },
  TryGetRelationPOClone: function TryGetRelationPOClone() {
    if (this._po) {
      return JsonUtility.CloneSimple(this._po);
    }

    var bindDataSource = this.TryGetBindDataSourceAttr();
    var po = null;

    if (bindDataSource == "autoTesting") {
      var bindTableName = this.TryGetInnerControlBindTableName();
      po = FormRelationPOUtility.FindRelationPOByTableName(this._FormDataRelationList, bindTableName);

      if (po == null) {
        DialogUtility.AlertText("WFDCT_SubFormListContainer.TryGetRelationPO:通过内部控件绑定的表找不到具体的数据关联实体！");
      }
    } else {
      po = FormRelationPOUtility.FindRelationPOById(this._FormDataRelationList, bindDataSource);

      if (po == null) {
        DialogUtility.AlertText("WFDCT_SubFormListContainer.TryGetRelationPO:通过ID" + bindDataSource + "找不到具体的数据关联实体！");
      }
    }

    this._po = po;
    return JsonUtility.CloneSimple(this._po);
  },
  TryGetInnerControlBindTableName: function TryGetInnerControlBindTableName() {
    var controls = HTMLControl.FindALLControls(this._$TemplateTableRow);
    var tableName = null;
    controls.each(function () {
      if (!tableName) {
        tableName = HTMLControl.GetControlBindTableName($(this));
      } else {
        if (tableName != HTMLControl.GetControlBindTableName($(this))) {
          DialogUtility.AlertText("子表区域中的控件绑定了多个表!");
        }
      }
    });
    return tableName;
  },
  TryGetBindDataSourceAttr: function TryGetBindDataSourceAttr() {
    return this._$SingleControlElem.attr("binddatasource");
  },
  _$LastEditRow: null,
  InnerRow_AddRowToContainer: function InnerRow_AddRowToContainer(oneDataRecord) {
    this.InnerRow_CompletedLastEdit();

    var $tr = this._$TemplateTableRow.clone();

    var lastOperationTd = $("<td><div class='sflt-td-operation-outer-wrap'></div></td>");
    var lastOperationOuterDiv = lastOperationTd.find("div");
    var btn_operation_del = $("<div title='删除' class='sflt-td-operation-del'></div>");
    btn_operation_del.bind("click", {
      selfObj: this
    }, function (btn_del_sender) {
      var selfObj = btn_del_sender.data.selfObj;
      selfObj.InnerRow_Delete($(this).parent().parent().parent());
    });
    lastOperationOuterDiv.append(btn_operation_del);
    var btn_operation_update = $("<div title='编辑' class='sflt-td-operation-update'></div>");
    btn_operation_update.bind("click", {
      selfObj: this
    }, function (btn_update_sender) {
      var selfObj = btn_update_sender.data.selfObj;
      selfObj.InnerRow_ToEditStatus($(this).parent().parent().parent());
    });
    lastOperationOuterDiv.append(btn_operation_update);
    $tr.append(lastOperationTd);

    this._$TableBodyElem.append($tr);

    this._$LastEditRow = $tr;

    if (oneDataRecord) {
      var controls = HTMLControl.FindALLControls(this._$LastEditRow);

      for (var i = 0; i < controls.length; i++) {
        var control = $(controls[i]);
        var controlInstance = HTMLControl.GetControlInstanceByElem(control);
        var fieldName = HTMLControl.GetControlBindFieldName(control);
        var fieldPO = FormRelationPOUtility.FindFieldPOInOneDataRecord(oneDataRecord, fieldName);
        controlInstance.SetValue(control, fieldPO, null, null);
      }
    }
  },
  InnerRow_ToEditStatus: function InnerRow_ToEditStatus($tr) {
    this.InnerRow_CompletedLastEdit();
    var rowRelationPO = this.GetRowData($tr);
    var rowSpanControls = $tr.find("[is_inner_row_span='true']");

    for (var i = 0; i < rowSpanControls.length; i++) {
      var spanControl = $(rowSpanControls[i]);
      var controlId = spanControl.attr("edit_control_id");

      var editControl = this._$TemplateTableRow.find("#" + controlId).clone();

      var fieldName = HTMLControl.GetControlBindFieldName(editControl);
      var fieldPO = FormRelationPOUtility.FindFieldPOByRelationPO(rowRelationPO, fieldName);
      var editControlInstance = HTMLControl.GetControlInstanceByElem(editControl);
      editControlInstance.SetValue(editControl, fieldPO, {});
      spanControl.parent().append(editControl);
      spanControl.remove();
    }

    this._$LastEditRow = $tr;
  },
  InnerRow_ToViewStatus: function InnerRow_ToViewStatus(relationPO, $tr) {
    if (this._$LastEditRow) {
      var controls = HTMLControl.FindALLControls(this._$LastEditRow);

      for (var i = 0; i < controls.length; i++) {
        var singleControl = $(controls[i]);
        var fieldName = HTMLControl.GetControlBindFieldName(singleControl);
        var fieldValue = FormRelationPOUtility.FindFieldPOByRelationPO(relationPO, fieldName).value;
        var txtSpan = $("<span is_inner_row_span='true' edit_control_id='" + singleControl.attr("id") + "'>" + fieldValue + "</span>");
        singleControl.before(txtSpan);
        singleControl.remove();
      }
    }

    this._$LastEditRow = null;
  },
  InnerRow_Delete: function InnerRow_Delete($tr) {
    this.InnerRow_CompletedLastEdit();
    $tr.remove();
  },
  InnerRow_CompletedLastEdit: function InnerRow_CompletedLastEdit() {
    if (this._$LastEditRow) {
      var controls = HTMLControl.FindALLControls(this._$LastEditRow);
      var relationPO = this.TryGetRelationPOClone();
      var oneRowRecord = [];

      for (var i = 0; i < controls.length; i++) {
        var singleControl = $(controls[i]);
        var fieldTransferPO = HTMLControl.TryGetFieldTransferPO(singleControl, relationPO.id, relationPO.singleName, relationPO.relationType);
        oneRowRecord.push(fieldTransferPO);
      }

      var idValue = this.GetRowId(this._$LastEditRow);
      FormRelationPOUtility.CreateIdFieldInOneDataRecord(oneRowRecord, idValue);
      relationPO = FormRelationPOUtility.Add1To1DataRecordFieldPOList(relationPO, oneRowRecord);
      this.SaveDataToRowAttr(relationPO, this._$LastEditRow);
      this.InnerRow_ToViewStatus(relationPO, this._$LastEditRow);
    }
  },
  Dialog_SubFormDialogCompletedEdit: function Dialog_SubFormDialogCompletedEdit(instanceName, operationType, serializationSubFormData) {
    var thisInstance = HTMLControl.GetInstance(instanceName);
    (function (operationType, serializationSubFormData) {
      var selfRelationPO = this.TryGetRelationPOClone();
      var selfChildRelationPOArray = this.TryGetChildRelationPOArrayClone(selfRelationPO);
      var subFormMainRelationPO = FormRelationPOUtility.FindMainRelationPO(serializationSubFormData.formRecordDataRelationPOList);
      var subFormNotMainRelationPO = FormRelationPOUtility.FindNotMainRelationPO(serializationSubFormData.formRecordDataRelationPOList);
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

      for (var i = 0; i < childRelationPOArray.length; i++) {
        var subRelationPO = childRelationPOArray[i];
        var selfKeyFieldName = subRelationPO.selfKeyFieldName;
        var outerKeyFieldName = subRelationPO.outerKeyFieldName;
        var outerKeyFieldValue = FormRelationPOUtility.FindFieldValueInOneDataRecord(oneDataRecord, outerKeyFieldName);

        for (var j = 0; j < subRelationPO.listDataRecord.length; j++) {
          var recordFieldPOList = FormRelationPOUtility.FindRecordFieldPOArray(subRelationPO.listDataRecord[j]);
          FormRelationPOUtility.CreateFieldInOneDataRecord(recordFieldPOList, selfKeyFieldName, outerKeyFieldValue);
        }
      }

      this.Dialog_AddRowToContainer(oneDataRecord, childRelationPOArray, false);
    }).call(thisInstance, operationType, serializationSubFormData);
  },
  Dialog_AddRowToContainer: function Dialog_AddRowToContainer(oneDataRecord, childRelationPOArray, dataIsFromServer) {
    if (oneDataRecord) {
      var $tr = this._$TemplateTableRow.clone();

      var controls = HTMLControl.FindALLControls($tr);

      for (var i = 0; i < controls.length; i++) {
        var control = $(controls[i]);
        var controlInstance = HTMLControl.GetControlInstanceByElem(control);
        var fieldName = HTMLControl.GetControlBindFieldName(control);
        var fieldPO = FormRelationPOUtility.FindFieldPOInOneDataRecord(oneDataRecord, fieldName);
        controlInstance.SetValue(control, fieldPO, null, null);
      }

      var idFieldPO = FormRelationPOUtility.FindFieldPOInOneDataRecordByID(oneDataRecord);
      var lastOperationTd = $("<td><div class='sflt-td-operation-outer-wrap'></div></td>");
      var lastOperationOuterDiv = lastOperationTd.find("div");

      if (dataIsFromServer) {
        if (this._Display_OPButtons_View) {
          this.Dialog_AddRow_AddViewButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
        }

        if (this._Display_OPButtons_Update) {
          this.Dialog_AddRow_AddUpdateButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
        }

        if (this._Display_OPButtons_Del) {
          this.Dialog_AddRow_AddDeleteButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
        }
      } else {
        this.Dialog_AddRow_AddViewButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
        this.Dialog_AddRow_AddUpdateButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
        this.Dialog_AddRow_AddDeleteButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
      }

      $tr.append(lastOperationTd);
      var idValue = idFieldPO.value;

      var $oldTrElem = this._$SingleControlElem.find("tr[tr_record_id='" + idValue + "']");

      if ($oldTrElem.length == 0) {
        this._$TableBodyElem.append($tr);
      } else {
        $oldTrElem.after($tr);
        $oldTrElem.remove();
      }

      var relationPO = this.TryGetRelationPOClone();
      relationPO = FormRelationPOUtility.Add1To1DataRecord(relationPO, oneDataRecord);
      this.SaveDataToRowAttr(relationPO, $tr, childRelationPOArray);
    }
  },
  Dialog_ShowAddRowSubFormDialog: function Dialog_ShowAddRowSubFormDialog(sender, $singleControlElem, _rendererChainParas, instanceName) {
    var dialogWindowPara = this.Dialog_Get_Button_Click_Para($singleControlElem);

    if (!dialogWindowPara.DialogWindowTitle) {
      dialogWindowPara.DialogWindowTitle = "应用构建系统";
    }

    dialogWindowPara.OperationType = "add";
    dialogWindowPara.RecordId = StringUtility.Guid();

    var isPreview = this._FormRuntimeHost.IsPreview();

    var url;

    if (isPreview) {
      url = BaseUtility.BuildView("/HTML/Builder/Form/SubFormPreview.html", dialogWindowPara);
    } else {
      url = BaseUtility.BuildView("/HTML/Builder/Runtime/WebFormSubRuntime.html", dialogWindowPara);
    }

    DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
      title: dialogWindowPara.DialogWindowTitle,
      width: dialogWindowPara.WindowWidth,
      height: dialogWindowPara.WindowHeight
    }, 1);
  },
  Dialog_AddRow_AddViewButton: function Dialog_AddRow_AddViewButton(operationOuterDiv, $tr, idValue, oneDataRecord, $singleControlElem, isPreview) {
    var btn_operation_view = $("<div title='查看' class='sflt-td-operation-view'></div>");
    var dialogWindowPara = this.Dialog_Get_Button_Click_Para($singleControlElem);
    btn_operation_view.bind("click", {
      "$tr": $tr,
      "idValue": idValue,
      "oneDataRecord": oneDataRecord,
      "dialogWindowPara": dialogWindowPara,
      "isPreview": isPreview
    }, function (sender) {
      var dialogWindowPara = sender.data.dialogWindowPara;
      dialogWindowPara.OperationType = "view";
      dialogWindowPara.RecordId = sender.data.idValue;
      var url;

      if (isPreview) {
        url = BaseUtility.BuildView("/HTML/Builder/Form/SubFormPreview.html", dialogWindowPara);
      } else {
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
  Dialog_AddRow_AddUpdateButton: function Dialog_AddRow_AddUpdateButton(operationOuterDiv, $tr, idValue, oneDataRecord, $singleControlElem, isPreview) {
    var btn_operation_view = $("<div title='编辑' class='sflt-td-operation-update'></div>");
    var dialogWindowPara = this.Dialog_Get_Button_Click_Para($singleControlElem);
    btn_operation_view.bind("click", {
      "$tr": $tr,
      "idValue": idValue,
      "oneDataRecord": oneDataRecord,
      "dialogWindowPara": dialogWindowPara,
      "isPreview": isPreview
    }, function (sender) {
      var dialogWindowPara = sender.data.dialogWindowPara;
      dialogWindowPara.OperationType = "update";
      dialogWindowPara.RecordId = sender.data.idValue;
      var url;

      if (isPreview) {
        url = BaseUtility.BuildView("/HTML/Builder/Form/SubFormPreview.html", dialogWindowPara);
      } else {
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
  Dialog_AddRow_AddDeleteButton: function Dialog_AddRow_AddDeleteButton(operationOuterDiv, $tr, idValue, oneDataRecord, $singleControlElem, isPreview) {
    var btn_operation_view = $("<div title='删除' class='sflt-td-operation-del'></div>");
    btn_operation_view.bind("click", {
      "$tr": $tr,
      "idValue": idValue,
      "oneDataRecord": oneDataRecord,
      "isPreview": isPreview
    }, function (sender) {
      sender.data.$tr.remove();
    });
    operationOuterDiv.append(btn_operation_view);
  },
  Dialog_Get_Button_Click_Para: function Dialog_Get_Button_Click_Para($singleControlElem) {
    var para = {
      FormId: $singleControlElem.attr("formid"),
      WindowHeight: $singleControlElem.attr("windowheight"),
      WindowWidth: $singleControlElem.attr("windowwidth"),
      InstanceName: $singleControlElem.attr("client_instance_name"),
      DialogWindowTitle: $singleControlElem.attr("dialogwindowtitle")
    };
    return para;
  },
  Dialog_Get_SubForm_RecordComplexPo: function Dialog_Get_SubForm_RecordComplexPo(instanceName, subFormDataRelationList, idValue) {
    var thisInstance = HTMLControl.GetInstance(instanceName);
    (function (subFormDataRelationList, idValue) {
      var $trElem = this._$SingleControlElem.find("tr[tr_record_id='" + idValue + "']");

      var tr_record_data = this.GetRowData($trElem);
      var child_relation_po_array = this.GetChildRelationPOArray($trElem);
      var mainPO = FormRelationPOUtility.FindMainRelationPO(subFormDataRelationList);
      FormRelationPOUtility.Add1To1DataRecordFieldPOList(mainPO, FormRelationPOUtility.Get1To1DataRecordFieldPOArray(tr_record_data));
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
    return {
      formRecordDataRelationPOList: subFormDataRelationList
    };
  }
};
"use strict";

var WFDCT_TextBox = {
  RendererChain: function RendererChain(_rendererChainParas) {},
  RendererDataChain: function RendererDataChain() {},
  GetValue: HTMLControl.GetValue,
  SetValue: HTMLControl.SetValue
};
"use strict";

var WFDCT_TextDateTime = {
  RendererChain: function RendererChain(_rendererChainParas) {},
  RendererDataChain: HTMLControl.RendererDataChain,
  GetValue: HTMLControl.GetValue,
  SetValue: HTMLControl.SetValue
};
"use strict";

var WLDCT_FormButton = {
  _ListTableContainerInstance: null,
  RendererChain: HTMLControl.RendererChain,
  ResolveSelf: function ResolveSelf(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var caption = $singleControlElem.attr("buttoncaption");
    var $button = $("<button class='wldct-list-button'>" + caption + "</button>");
    var attributes = $singleControlElem.prop("attributes");
    $.each(attributes, function () {
      $button.attr(this.name, this.value);
    });
    $button.bind("click", {
      "buttonElem": $button,
      "selfInstance": this
    }, this.ClickEvent);
    return $button;
  },
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var $singleControlElem = _rendererDataChainParas.$singleControlElem;
    var $WLDCT_ListButtonContainer = $singleControlElem.parents("[singlename='WLDCT_ListButtonContainer']");
    var $WLDCT_ListTableContainerElem = $WLDCT_ListButtonContainer.nextAll("[client_resolve='WLDCT_ListTableContainer']");
    this._ListTableContainerInstance = HTMLControl.GetControlInstanceByElem($WLDCT_ListTableContainerElem);
  },
  ClickEvent: function ClickEvent(sender) {
    var $button = sender.data.buttonElem;
    var _self = sender.data.selfInstance;
    console.log($button);
    var bindauthority = $button.attr("bindauthority");
    var buttoncaption = $button.attr("buttoncaption");
    var buttontype = $button.attr("buttontype");
    var custclientclickbeforemethod = $button.attr("custclientclickbeforemethod");
    var custclientclickbeforemethodpara = $button.attr("custclientclickbeforemethodpara");
    var custclientrendereraftermethodpara = $button.attr("custclientrendereraftermethodpara");
    var custclientrendereraftermethodparapara = $button.attr("custclientrendereraftermethodparapara");
    var custclientrenderermethod = $button.attr("custclientrenderermethod");
    var custclientrenderermethodpara = $button.attr("custclientrenderermethodpara");
    var custserverresolvemethod = $button.attr("custserverresolvemethod");
    var custserverresolvemethodpara = $button.attr("custserverresolvemethodpara");
    var formcode = $button.attr("formcode");
    var formid = $button.attr("formid");
    var formmoduleid = $button.attr("formmoduleid");
    var formmodulename = $button.attr("formmodulename");
    var formname = $button.attr("formname");
    var elemid = $button.attr("id");
    var buttonid = $button.attr("buttonid");
    var innerbuttonjsonstring = $button.attr("innerbuttonjsonstring");
    var opentype = $button.attr("opentype");
    var operation = $button.attr("operation");
    var singlename = $button.attr("singlename");
    var windowcaption = $button.attr("windowcaption");
    var windowheight = $button.attr("windowheight");
    var windowwidth = $button.attr("windowwidth");
    var client_resolve = $button.attr("client_resolve");
    var recordId = "";

    if (operation == "update" || operation == "view") {
      var checkedRecordObjs = _self._ListTableContainerInstance.GetCheckedRecord();

      if (checkedRecordObjs.length == 0) {
        DialogUtility.AlertText("请选择需要进行操作的记录!");
        return;
      } else if (checkedRecordObjs.length > 1) {
        DialogUtility.AlertText("一次只能操作一条记录!");
        return;
      } else {
        recordId = checkedRecordObjs[0].Id;
      }
    }

    DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView("/HTML/Builder/Runtime/WebFormRuntime.html", {
      FormId: formid,
      ButtonId: buttonid,
      ElemId: elemid,
      RecordId: recordId,
      OperationType: operation
    }), {
      width: windowwidth,
      height: windowheight,
      title: windowcaption
    }, 1, true);
  }
};
"use strict";

var WLDCT_ListButtonContainer = {
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var $buttonDivElemList = $singleControlElem.find("div" + HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);
    $singleControlElem.find("[is-op-button-wrap-table='true']").hide();
    var innerWrap = $singleControlElem.find(".wldct-list-button-inner-wrap");
    var innerInsideWrapDiv = $("<div class='wldct-list-button-inner-inside-wrap' />");

    for (var i = 0; i < $buttonDivElemList.length; i++) {
      var $buttonElem = $($buttonDivElemList[i]);
      var clientResolveName = $buttonElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
      var clientResolveObject = Object.create(eval(clientResolveName));
      var $resolvedElem = clientResolveObject.ResolveSelf({
        sourceHTML: _rendererChainParas.sourceHTML,
        $rootElem: _rendererChainParas.$rootElem,
        $parentControlElem: $singleControlElem,
        $singleControlElem: $buttonElem,
        allData: _rendererChainParas.allData
      });
      innerInsideWrapDiv.append($resolvedElem);
    }

    innerWrap.append(innerInsideWrapDiv);
    innerWrap.append("<div style=\"clear: both;\"></div>");
  },
  RendererDataChain: HTMLControl.RendererDataChain
};
"use strict";

var WLDCT_ListComplexSearchContainer = {
  _$SingleControlElem: null,
  _$ComplexSearchButton: null,
  _$ClearButton: null,
  _$CloseButton: null,
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    this._$SingleControlElem = $singleControlElem;
    $singleControlElem.hide();
    $singleControlElem.find(".wldct-list-complex-search-inner-wrap").height("305px");
    $singleControlElem.find(".wldct-list-complex-search-inner-wrap").css("overflow", "auto");
    $singleControlElem.find(".wldct-list-complex-search-inner-wrap").addClass("div-custom-scroll");
    var $searchButtonsWrap = $("<div class='wldct-list-complex-search-button-inner-wrap'><div class='button-inner-wrap'></div></div>");
    this._$ComplexSearchButton = $("<button>查询</button>");
    this._$ClearButton = $("<button>清空</button>");
    this._$CloseButton = $("<button>关闭</button>");
    $searchButtonsWrap.find(".button-inner-wrap").append(this._$ComplexSearchButton).append(this._$ClearButton).append(this._$CloseButton);
    $singleControlElem.append($searchButtonsWrap);
  },
  RendererDataChain: HTMLControl.RendererDataChain,
  BuilderSearchCondition: function BuilderSearchCondition() {
    var result = [];

    var allControls = this._$SingleControlElem.find(HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);

    for (var i = 0; i < allControls.length; i++) {
      var $elem = $(allControls[i]);
      var instance = HTMLControl.GetControlInstanceByElem($elem);
      var valObj = instance.GetValue($elem, {});
      var value = valObj.value;

      if (value) {
        result.push({
          operator: $elem.attr("columnoperator"),
          value: value,
          tableName: $elem.attr("columntablename"),
          fieldName: $elem.attr("columnname")
        });
      }
    }

    return result;
  },
  GetStatus: function GetStatus() {
    var status = this._$SingleControlElem.attr("status");

    if (status == "") {
      status = "enable";
    }

    return status;
  },
  Hide: function Hide() {
    this._$SingleControlElem.hide();
  }
};
"use strict";

var WLDCT_ListSimpleSearchContainer = {
  _$SimpleSearchButton: null,
  _$ShowComplexSearchButton: null,
  _$SingleControlElem: null,
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    this._$SingleControlElem = $singleControlElem;
    var pageWidth = PageStyleUtility.GetPageWidth();
    var buttonWrapWidth = 200;
    $singleControlElem.find("table:first").width(pageWidth - buttonWrapWidth);
    var $searchButtonsWrap = $("<div class='wldct-list-simple-search-button-inner-wrap' />");
    $searchButtonsWrap.width(buttonWrapWidth - 40);
    this._$SimpleSearchButton = $("<button>查询</button>");
    this._$ShowComplexSearchButton = $("<button>高级查询</button>");
    $searchButtonsWrap.append(this._$SimpleSearchButton);
    $searchButtonsWrap.append(this._$ShowComplexSearchButton);
    $singleControlElem.append($searchButtonsWrap);
    HTMLControl.RendererChain(_rendererChainParas);
  },
  RendererDataChain: HTMLControl.RendererDataChain,
  BuilderSearchCondition: function BuilderSearchCondition() {
    var result = [];

    var allControls = this._$SingleControlElem.find(HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);

    for (var i = 0; i < allControls.length; i++) {
      var $elem = $(allControls[i]);
      var instance = HTMLControl.GetControlInstanceByElem($elem);
      var valObj = instance.GetValue($elem, {});
      var value = valObj.value;

      if (value) {
        result.push({
          operator: $elem.attr("columnoperator"),
          value: value,
          tableName: $elem.attr("columntablename"),
          fieldName: $elem.attr("columnname")
        });
      }
    }

    return result;
  },
  GetStatus: function GetStatus() {
    var status = this._$SingleControlElem.attr("status");

    if (status == "") {
      status = "enable";
    }

    return status;
  },
  Hide: function Hide() {
    this._$SingleControlElem.hide();
  },
  HideComplexButton: function HideComplexButton() {
    this._$ShowComplexSearchButton.remove();

    this._$SimpleSearchButton.parent().width("80px");

    var pageWidth = PageStyleUtility.GetPageWidth();

    this._$SingleControlElem.find("table:first").width(pageWidth - 120);
  }
};
"use strict";

var WLDCT_ListTableCheckBox = {
  RendererChain: HTMLControl.RendererChain,
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var value = _rendererDataChainParas.val;
    var $td = _rendererDataChainParas.$td;
    $td.css("textAlign", "center");
    var $checkbox = $("<input isrow_checkbox=\"true\" type=\"checkbox\" class=\"list-checkbox-c\" value=\"" + value + "\" row_checkbox_record_id=\"" + value + "\">");
    $checkbox.bind("click", {
      "selfInstance": this,
      "$elem": $checkbox
    }, this.ClickEvent);
    $td.html("");
    $td.append($checkbox);
  },
  ClickEvent: function ClickEvent(sender) {
    var $elem = sender.data.$elem;

    var listTableContainerInstance = WLDCT_ListTableContainer.__InnerElemGetInstance($elem);

    if ($elem.prop("checked")) {
      listTableContainerInstance.SaveCheckedRowData($elem.val());
    } else {
      listTableContainerInstance.DeleteCheckedRowData($elem.val());
    }
  }
};
"use strict";

var WLDCT_ListTableContainer = {
  GetHTML: function GetHTML() {
    return "<table id=\"example\" class=\"stripe row-border order-column\" style=\"width:100%\">\n" + "        <thead>\n" + "            <tr>\n" + "                <th colspan='2'>First name</th>\n" + "                <th>Position</th>\n" + "                <th>Office</th>\n" + "                <th colspan='2'>Age</th>\n" + "                <th>Salary</th>\n" + "                <th>Extn.</th>\n" + "                <th>E-mail</th>\n" + "            </tr>\n" + "            <tr>\n" + "                <th>First name</th>\n" + "                <th>Last name</th>\n" + "                <th>Position</th>\n" + "                <th>Office</th>\n" + "                <th>Age</th>\n" + "                <th>Start date</th>\n" + "                <th>Salary</th>\n" + "                <th>Extn.</th>\n" + "                <th>E-mail</th>\n" + "            </tr>\n" + "        </thead>\n" + "        <tbody>\n" + "            <tr>\n" + "                <td><a onclick='alert(1)'>Tiger</a></td>\n" + "                <td>Nixon</td>\n" + "                <td>System Architect</td>\n" + "                <td>Edinburgh</td>\n" + "                <td>61</td>\n" + "                <td>2011/04/25</td>\n" + "                <td>$320,800</td>\n" + "                <td>5421</td>\n" + "                <td>t.nixon@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Garrett</td>\n" + "                <td>Winters</td>\n" + "                <td>Accountant</td>\n" + "                <td>Tokyo</td>\n" + "                <td>63</td>\n" + "                <td>2011/07/25</td>\n" + "                <td>$170,750</td>\n" + "                <td>8422</td>\n" + "                <td>g.winters@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Ashton</td>\n" + "                <td>Cox</td>\n" + "                <td>Junior Technical Author</td>\n" + "                <td>San Francisco</td>\n" + "                <td>66</td>\n" + "                <td>2009/01/12</td>\n" + "                <td>$86,000</td>\n" + "                <td>1562</td>\n" + "                <td>a.cox@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Cedric</td>\n" + "                <td>Kelly</td>\n" + "                <td>Senior Javascript Developer</td>\n" + "                <td>Edinburgh</td>\n" + "                <td>22</td>\n" + "                <td>2012/03/29</td>\n" + "                <td>$433,060</td>\n" + "                <td>6224</td>\n" + "                <td>c.kelly@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Airi</td>\n" + "                <td>Satou</td>\n" + "                <td>Accountant</td>\n" + "                <td>Tokyo</td>\n" + "                <td>33</td>\n" + "                <td>2008/11/28</td>\n" + "                <td>$162,700</td>\n" + "                <td>5407</td>\n" + "                <td>a.satou@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Brielle</td>\n" + "                <td>Williamson</td>\n" + "                <td>Integration Specialist</td>\n" + "                <td>New York</td>\n" + "                <td>61</td>\n" + "                <td>2012/12/02</td>\n" + "                <td>$372,000</td>\n" + "                <td>4804</td>\n" + "                <td>b.williamson@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Herrod</td>\n" + "                <td>Chandler</td>\n" + "                <td>Sales Assistant</td>\n" + "                <td>San Francisco</td>\n" + "                <td>59</td>\n" + "                <td>2012/08/06</td>\n" + "                <td>$137,500</td>\n" + "                <td>9608</td>\n" + "                <td>h.chandler@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Rhona</td>\n" + "                <td>Davidson</td>\n" + "                <td>Integration Specialist</td>\n" + "                <td>Tokyo</td>\n" + "                <td>55</td>\n" + "                <td>2010/10/14</td>\n" + "                <td>$327,900</td>\n" + "                <td>6200</td>\n" + "                <td>r.davidson@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Colleen</td>\n" + "                <td>Hurst</td>\n" + "                <td>Javascript Developer</td>\n" + "                <td>San Francisco</td>\n" + "                <td>39</td>\n" + "                <td>2009/09/15</td>\n" + "                <td>$205,500</td>\n" + "                <td>2360</td>\n" + "                <td>c.hurst@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Sonya</td>\n" + "                <td>Frost</td>\n" + "                <td>Software Engineer</td>\n" + "                <td>Edinburgh</td>\n" + "                <td>23</td>\n" + "                <td>2008/12/13</td>\n" + "                <td>$103,600</td>\n" + "                <td>1667</td>\n" + "                <td>s.frost@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Jena</td>\n" + "                <td>Gaines</td>\n" + "                <td>Office Manager</td>\n" + "                <td>London</td>\n" + "                <td>30</td>\n" + "                <td>2008/12/19</td>\n" + "                <td>$90,560</td>\n" + "                <td>3814</td>\n" + "                <td>j.gaines@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Quinn</td>\n" + "                <td>Flynn</td>\n" + "                <td>Support Lead</td>\n" + "                <td>Edinburgh</td>\n" + "                <td>22</td>\n" + "                <td>2013/03/03</td>\n" + "                <td>$342,000</td>\n" + "                <td>9497</td>\n" + "                <td>q.flynn@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Charde</td>\n" + "                <td>Marshall</td>\n" + "                <td>Regional Director</td>\n" + "                <td>San Francisco</td>\n" + "                <td>36</td>\n" + "                <td>2008/10/16</td>\n" + "                <td>$470,600</td>\n" + "                <td>6741</td>\n" + "                <td>c.marshall@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Haley</td>\n" + "                <td>Kennedy</td>\n" + "                <td>Senior Marketing Designer</td>\n" + "                <td>London</td>\n" + "                <td>43</td>\n" + "                <td>2012/12/18</td>\n" + "                <td>$313,500</td>\n" + "                <td>3597</td>\n" + "                <td>h.kennedy@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Tatyana</td>\n" + "                <td>Fitzpatrick</td>\n" + "                <td>Regional Director</td>\n" + "                <td>London</td>\n" + "                <td>19</td>\n" + "                <td>2010/03/17</td>\n" + "                <td>$385,750</td>\n" + "                <td>1965</td>\n" + "                <td>t.fitzpatrick@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Michael</td>\n" + "                <td>Silva</td>\n" + "                <td>Marketing Designer</td>\n" + "                <td>London</td>\n" + "                <td>66</td>\n" + "                <td>2012/11/27</td>\n" + "                <td>$198,500</td>\n" + "                <td>1581</td>\n" + "                <td>m.silva@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Charde</td>\n" + "                <td>Marshall</td>\n" + "                <td>Regional Director</td>\n" + "                <td>San Francisco</td>\n" + "                <td>36</td>\n" + "                <td>2008/10/16</td>\n" + "                <td>$470,600</td>\n" + "                <td>6741</td>\n" + "                <td>c.marshall@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Haley</td>\n" + "                <td>Kennedy</td>\n" + "                <td>Senior Marketing Designer</td>\n" + "                <td>London</td>\n" + "                <td>43</td>\n" + "                <td>2012/12/18</td>\n" + "                <td>$313,500</td>\n" + "                <td>3597</td>\n" + "                <td>h.kennedy@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Tatyana</td>\n" + "                <td>Fitzpatrick</td>\n" + "                <td>Regional Director</td>\n" + "                <td>London</td>\n" + "                <td>19</td>\n" + "                <td>2010/03/17</td>\n" + "                <td>$385,750</td>\n" + "                <td>1965</td>\n" + "                <td>t.fitzpatrick@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Michael</td>\n" + "                <td>Silva</td>\n" + "                <td>Marketing Designer</td>\n" + "                <td>London</td>\n" + "                <td>66</td>\n" + "                <td>2012/11/27</td>\n" + "                <td>$198,500</td>\n" + "                <td>1581</td>\n" + "                <td>m.silva@datatables.net</td>\n" + "            </tr>\n" + "        </tbody>\n" + "    </table>";
  },
  _InstanceMap: {},
  _CurrentPageNum: 1,
  _DataSet: null,
  _DataSetRuntimeInstance: null,
  _Cache$SingleControlElem: null,
  _CacheRendererDataChainParas: null,
  _SimpleSearchContainerInstance: null,
  _ComplexSearchContainerInstance: null,
  _QueryPOList: [],
  _CheckedRecordArray: [],
  _$Elem: null,
  GetInstance: function GetInstance(name) {
    for (var key in this._InstanceMap) {
      if (key == name) {
        return this._InstanceMap[key];
      }
    }

    var instance = eval(name);
    this._InstanceMap[name] = instance;
    return instance;
  },
  Initialize: function Initialize() {
    this._DataSetRuntimeInstance = Object.create(DataSetRuntime);
  },
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    this._$Elem = $singleControlElem;
    var $simpleSearchContainerElem = $singleControlElem.prevAll("[client_resolve='WLDCT_ListSimpleSearchContainer']");
    var $complexSearchContainerElem = $singleControlElem.prevAll("[client_resolve='WLDCT_ListComplexSearchContainer']");
    this._SimpleSearchContainerInstance = HTMLControl.GetControlInstanceByElem($simpleSearchContainerElem);
    this._ComplexSearchContainerInstance = HTMLControl.GetControlInstanceByElem($complexSearchContainerElem);

    this._SimpleSearchContainerInstance._$SimpleSearchButton.bind("click", {
      "listInstance": this
    }, this.SimpleSearchClickEvent);

    this._SimpleSearchContainerInstance._$ShowComplexSearchButton.bind("click", {
      "listInstance": this
    }, this.ShowComplexSearchClickEvent);

    this._ComplexSearchContainerInstance._$ComplexSearchButton.bind("click", {
      "listInstance": this
    }, this.ComplexSearchClickEvent);

    this._ComplexSearchContainerInstance._$ClearButton.bind("click", {
      "listInstance": this
    }, this.ComplexSearchClearClickEvent);

    this._ComplexSearchContainerInstance._$CloseButton.bind("click", {
      "listInstance": this
    }, this.ComplexSearchCloseClickEvent);

    if (this._SimpleSearchContainerInstance.GetStatus() == "disable") {
      this._SimpleSearchContainerInstance.Hide();
    }

    if (this._ComplexSearchContainerInstance.GetStatus() == "disable") {
      this._SimpleSearchContainerInstance.HideComplexButton();
    }

    var $templateTable = $singleControlElem.find("table");
    var $templateTableRow = $singleControlElem.find("table tbody tr");
    var $templateTableHeaderRows = $singleControlElem.find("table thead tr");
    this.AppendCheckBoxColumnTemplate($templateTable, $templateTableHeaderRows, $templateTableRow);
    HTMLControl.RendererChain(_rendererChainParas);
  },
  RendererDataChain: function RendererDataChain(_rendererDataChainParas, isReRenderer) {
    var usedTopDataSet = true;
    var dataSetId;
    var pageSize;

    if (usedTopDataSet) {
      dataSetId = _rendererDataChainParas.topDataSetId;
      pageSize = _rendererDataChainParas.po.listDatasetPageSize;
    }

    if (!this._CacheRendererDataChainParas) {
      this._CacheRendererDataChainParas = _rendererDataChainParas;
      this._Cache$SingleControlElem = _rendererDataChainParas.$singleControlElem.clone();
    }

    if (isReRenderer) {
      _rendererDataChainParas.$singleControlElem.html(this._Cache$SingleControlElem.html());
    }

    if (_rendererDataChainParas.listRuntimeInstance.IsPreview()) {
      var mockDataSet = {
        "total": 1000,
        "list": [],
        "pageNum": 1,
        "pageSize": 5,
        "size": 5,
        "startRow": 1,
        "endRow": 5,
        "pages": 200,
        "prePage": 0,
        "nextPage": 2,
        "isFirstPage": true,
        "isLastPage": false,
        "hasPreviousPage": false,
        "hasNextPage": true,
        "navigatePages": 8,
        "navigatepageNums": [1, 2, 3, 4, 5, 6, 7, 8],
        "navigateFirstPage": 1,
        "navigateLastPage": 8,
        "firstPage": 1,
        "lastPage": 8
      };
      this._DataSet = mockDataSet;
      this.CreateTable(_rendererDataChainParas.$singleControlElem, mockDataSet, true);
    } else {
      DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {
        title: "系统提示",
        hide: {
          effect: "fade",
          duration: 500
        }
      }, "数据加载中,请稍候....");

      this._DataSetRuntimeInstance.GetDataSetData({
        dataSetId: dataSetId,
        pageSize: pageSize,
        pageNum: this._CurrentPageNum,
        listQueryPOList: this._QueryPOList,
        exValue1: "",
        exValue2: "",
        exValue3: ""
      }, function (result) {
        _rendererDataChainParas.dataSet = result.data;
        this._DataSet = result.data;
        this.CreateTable(_rendererDataChainParas.$singleControlElem, this._DataSet, false);
        window.setTimeout(function () {
          DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
        }, 500);
      }, this);
    }
  },
  CreateTable: function CreateTable($singleControlElem, dataSet, isPreview) {
    var $templateTable = $singleControlElem.find("table");
    var $templateTableRow = $singleControlElem.find("table tbody tr");
    var $templateTableHeaderRows = $singleControlElem.find("table thead tr");

    if ($templateTableRow.length > 0) {
      var $templateTableBody = $singleControlElem.find("table tbody");

      for (var i = 0; i < dataSet.list.length; i++) {
        $templateTableBody.append(this.RendererSingleRow($templateTable, $templateTableRow, dataSet, dataSet.list[i]));
      }

      $templateTableRow.remove();

      if (isPreview) {
        $templateTable.find("[singlename='WLDCT_ListTableInnerButtonContainer']").remove();
      }
    }

    $singleControlElem.find(".wldct-list-table-inner-wrap").append(this.CreatePaging());
    $singleControlElem.find(".wldct-list-table-inner-wrap").width(PageStyleUtility.GetWindowWidth() - 20);
    $templateTable.addClass("stripe row-border order-column");
    $templateTable.width("100%");
    var scrollY = PageStyleUtility.GetWindowHeight() - $(".wldct-list-simple-search-outer-wrap").height() - $(".wldct-list-button-outer-wrap").height() - 160;
    var table = $templateTable.DataTable({
      scrollY: scrollY,
      scrollX: true,
      paging: false,
      "ordering": false,
      "searching": false,
      "info": false
    });
  },
  AppendCheckBoxColumnTemplate: function AppendCheckBoxColumnTemplate($templateTable, $templateTableHeaderRows, $templateTableRow) {
    var $th = $("<th style='width: 50px'>选择</th>");

    if ($templateTableHeaderRows.length > 1) {
      $th.attr("rowspan", $templateTableHeaderRows.length);
    }

    $($templateTableHeaderRows[0]).prepend($th);
    $($templateTableRow.eq(0)).prepend("<td>\n                                    <div \n                                    columnalign=\"\u5C45\u4E2D\u5BF9\u9F50\" \n                                    columncaption=\"ID\" \n                                    columndatatypename=\"\u5B57\u7B26\u4E32\" \n                                    columnname=\"ID\" \n                                    columntablename=\"\" \n                                    control_category=\"InputControl\" \n                                    custclientrenderermethod=\"\" \n                                    custclientrenderermethodpara=\"\" \n                                    custserverresolvemethod=\"\" \n                                    custserverresolvemethodpara=\"\" \n                                    defaulttext=\"\" \n                                    defaulttype=\"\" \n                                    defaultvalue=\"\" \n                                    desc=\"\" \n                                    id=\"check_box_template\" \n                                    is_jbuild4dc_data=\"true\" \n                                    jbuild4dc_custom=\"true\" \n                                    name=\"check_box_template\" \n                                    placeholder=\"\" \n                                    serialize=\"true\" \n                                    show_remove_button=\"true\" \n                                    singlename=\"WLDCT_ListTableCheckBox\" \n                                    style=\"\" \n                                    targetbuttonid=\"\" \n                                    client_resolve=\"WLDCT_ListTableCheckBox\">\n                                        ID\n                                    </div>\n                                  </td>");
  },
  RendererSingleRow: function RendererSingleRow($templateTable, $templateTableRow, dataSet, rowData) {
    var $cloneRow = $templateTableRow.clone();
    var $tds = $cloneRow.find("td");

    for (var i = 0; i < $tds.length; i++) {
      var $td = $($tds[i]);
      var $divCTElem = $td.find("div" + HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);

      if ($divCTElem.length > 0) {
        var bindToField = $divCTElem.attr("columnname");
        var val = rowData[bindToField];
        var clientResolveInstanceName = $divCTElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
        var instance = WLDCT_ListTableContainer.GetInstance(clientResolveInstanceName);
        instance.RendererDataChain({
          $templateTable: $templateTable,
          $templateTableRow: $templateTableRow,
          $singleControlElem: $divCTElem,
          dataSet: dataSet,
          rowData: rowData,
          $cloneRow: $cloneRow,
          $td: $td,
          val: val
        });
      }
    }

    return $cloneRow;
  },
  CreatePaging: function CreatePaging($templateTable, $templateTableRow, dataSet, rowData, $row, $td, value) {
    var _self = this;

    var pagingOuterElem = $("<div class='table-paging-outer'><div class='table-paging-inner'></div></div>");
    var pagingInnerElem = pagingOuterElem.find("div");
    var firstPage = $("<div class='table-paging-button'>第一页</div>");
    firstPage.click(function () {
      _self.ChangePageNum(1);
    });
    var prePage = $("<div class='table-paging-button'>上一页</div>");
    prePage.click(function () {
      if (_self._CurrentPageNum > 1) {
        _self.ChangePageNum(_self._CurrentPageNum - 1);
      } else {
        DialogUtility.AlertText("已经到达第一页!");
      }
    });
    var lastPage = $("<div class='table-paging-button'>末页</div>");
    lastPage.click(function () {
      _self.ChangePageNum(_self._DataSet.pages);
    });
    var nextPage = $("<div class='table-paging-button'>下一页</div>");
    nextPage.click(function () {
      if (_self._CurrentPageNum < _self._DataSet.pages) {
        _self.ChangePageNum(_self._CurrentPageNum + 1);
      } else {
        DialogUtility.AlertText("已经到达最末页!");
      }
    });
    var info = $("<div class='table-paging-info'>总条数【" + _self._DataSet.total + "】&nbsp;&nbsp;页数【" + _self._CurrentPageNum + "/" + _self._DataSet.pages + "】</div>");
    pagingInnerElem.append(firstPage).append(prePage).append(nextPage).append(lastPage).append(info);
    return pagingOuterElem;
  },
  ChangePageNum: function ChangePageNum(pageNum) {
    this._CurrentPageNum = pageNum;
    this.RendererDataChain(this._CacheRendererDataChainParas, true);
  },
  SimpleSearchClickEvent: function SimpleSearchClickEvent(sender) {
    var _self = sender.data.listInstance;

    var conditions = _self._SimpleSearchContainerInstance.BuilderSearchCondition();

    _self._QueryPOList = conditions;

    _self.RendererDataChain(_self._CacheRendererDataChainParas, true);
  },
  ShowComplexSearchClickEvent: function ShowComplexSearchClickEvent(sender) {
    var _self = sender.data.listInstance;
    DialogUtility.DialogElemObj(_self._ComplexSearchContainerInstance._$SingleControlElem, {
      title: "高级查询",
      height: 410,
      width: 800,
      modal: true
    });
  },
  ComplexSearchClickEvent: function ComplexSearchClickEvent(sender) {
    console.log("高级查询.");
    var _self = sender.data.listInstance;

    var simpleConditions = _self._SimpleSearchContainerInstance.BuilderSearchCondition();

    var complexConditions = _self._ComplexSearchContainerInstance.BuilderSearchCondition();

    _self._QueryPOList = complexConditions.concat(simpleConditions);

    _self.RendererDataChain(_self._CacheRendererDataChainParas, true);

    DialogUtility.CloseDialogElem(_self._ComplexSearchContainerInstance._$SingleControlElem);
  },
  ComplexSearchCloseClickEvent: function ComplexSearchCloseClickEvent(sender) {
    var _self = sender.data.listInstance;
    DialogUtility.CloseDialogElem(_self._ComplexSearchContainerInstance._$SingleControlElem);
  },
  ComplexSearchClearClickEvent: function ComplexSearchClearClickEvent(sender) {
    var _self = sender.data.listInstance;
    DialogUtility.AlertText("未实现!");
  },
  GetRecordData: function GetRecordData(id) {
    console.log(this._DataSet);

    for (var i = 0; i < this._DataSet.list.length; i++) {
      var recordData = this._DataSet.list[i];

      if (recordData.ID == id) {
        return recordData;
      }
    }

    DialogUtility.AlertText("找不到ID为:" + id + "的记录!");
    return null;
  },
  SaveCheckedRowData: function SaveCheckedRowData(id) {
    var record = this.GetRecordData(id);

    if (record != null) {
      this._CheckedRecordArray.push({
        "Id": id,
        "Record": record
      });
    }
  },
  DeleteCheckedRowData: function DeleteCheckedRowData(id) {
    for (var i = 0; i < this._CheckedRecordArray.length; i++) {
      if (this._CheckedRecordArray[i].Id == id) {
        ArrayUtility.Delete(this._CheckedRecordArray, i);
      }
    }
  },
  GetCheckedRecord: function GetCheckedRecord() {
    return this._CheckedRecordArray;
  },
  GetLastCheckedRecord: function GetLastCheckedRecord() {
    if (this._CheckedRecordArray.length > 0) {
      return this._CheckedRecordArray[this._CheckedRecordArray.length - 1];
    }

    return null;
  },
  ClearAllCheckBox: function ClearAllCheckBox() {
    this._$Elem.find(":checkbox").prop('checked', false);

    this._CheckedRecordArray = [];
  },
  SetCheckBoxToCheckedStatus: function SetCheckBoxToCheckedStatus(id) {
    this._$Elem.find("[row_checkbox_record_id='" + id + "']:checkbox").prop('checked', true);

    this.SaveCheckedRowData(id);
  },
  __InnerElemGetInstance: function __InnerElemGetInstance($innerElem) {
    var $WLDCT_ListTableContainer = $innerElem.parents("[singlename='WLDCT_ListTableContainer']");
    var listTableContainerInstance = HTMLControl.GetControlInstanceByElem($WLDCT_ListTableContainer);
    return listTableContainerInstance;
  }
};
"use strict";

var WLDCT_ListTableInnerButtonContainer = {
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var $divCTElem = $singleControlElem.find("div" + HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);
    $singleControlElem.html("");
    $singleControlElem.append($divCTElem);
  },
  RendererDataChain: HTMLControl.RendererDataChain
};
"use strict";

var WLDCT_ListTableInnerButtonSingle = {
  RendererChain: HTMLControl.RendererChain,
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var $singleControlElem = _rendererDataChainParas.$singleControlElem;
    $singleControlElem.bind("click", {
      "selfInstance": this,
      "$elem": $singleControlElem,
      rowData: _rendererDataChainParas.rowData
    }, this.ClickEvent);
    $singleControlElem.html("");
    $singleControlElem.attr("title", $singleControlElem.attr("caption"));
  },
  ClickEvent: function ClickEvent(sender) {
    console.log(sender.data.rowData.ID);
    var $elem = sender.data.$elem;
    console.log($elem);
    var targetbuttonid = $elem.attr("targetbuttonid");

    var listTableContainerInstance = WLDCT_ListTableContainer.__InnerElemGetInstance($elem);

    listTableContainerInstance.ClearAllCheckBox();
    listTableContainerInstance.SetCheckBoxToCheckedStatus(sender.data.rowData.ID);
    console.log(targetbuttonid);
    $("button#" + targetbuttonid).trigger("click");
    console.log(listTableContainerInstance);
  }
};
"use strict";

var WLDCT_ListTableLabel = {
  RendererChain: HTMLControl.RendererChain,
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var value = _rendererDataChainParas.val;
    var $td = _rendererDataChainParas.$td;
    $td.css("textAlign", "center");
    $td.html(value);
  }
};
"use strict";

var WLDCT_Search_TextBox = {
  RendererChain: HTMLControl.RendererChain,
  RendererDataChain: HTMLControl.RendererDataChain,
  GetValue: HTMLControl.GetValue
};
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'datatables.net'], function ($) {
      return factory($, window, document);
    });
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = function (root, $) {
      if (!root) {
        root = window;
      }

      if (!$ || !$.fn.dataTable) {
        $ = require('datatables.net')(root, $).$;
      }

      return factory($, root, root.document);
    };
  } else {
    factory(jQuery, window, document);
  }
})(function ($, window, document, undefined) {
  'use strict';

  var DataTable = $.fn.dataTable;

  var _firefoxScroll;

  var FixedColumns = function FixedColumns(dt, init) {
    var that = this;

    if (!(this instanceof FixedColumns)) {
      alert("FixedColumns warning: FixedColumns must be initialised with the 'new' keyword.");
      return;
    }

    if (init === undefined || init === true) {
      init = {};
    }

    var camelToHungarian = $.fn.dataTable.camelToHungarian;

    if (camelToHungarian) {
      camelToHungarian(FixedColumns.defaults, FixedColumns.defaults, true);
      camelToHungarian(FixedColumns.defaults, init);
    }

    var dtSettings = new $.fn.dataTable.Api(dt).settings()[0];
    this.s = {
      "dt": dtSettings,
      "iTableColumns": dtSettings.aoColumns.length,
      "aiOuterWidths": [],
      "aiInnerWidths": [],
      rtl: $(dtSettings.nTable).css('direction') === 'rtl'
    };
    this.dom = {
      "scroller": null,
      "header": null,
      "body": null,
      "footer": null,
      "grid": {
        "wrapper": null,
        "dt": null,
        "left": {
          "wrapper": null,
          "head": null,
          "body": null,
          "foot": null
        },
        "right": {
          "wrapper": null,
          "head": null,
          "body": null,
          "foot": null
        }
      },
      "clone": {
        "left": {
          "header": null,
          "body": null,
          "footer": null
        },
        "right": {
          "header": null,
          "body": null,
          "footer": null
        }
      }
    };

    if (dtSettings._oFixedColumns) {
      throw 'FixedColumns already initialised on this table';
    }

    dtSettings._oFixedColumns = this;

    if (!dtSettings._bInitComplete) {
      dtSettings.oApi._fnCallbackReg(dtSettings, 'aoInitComplete', function () {
        that._fnConstruct(init);
      }, 'FixedColumns');
    } else {
      this._fnConstruct(init);
    }
  };

  $.extend(FixedColumns.prototype, {
    "fnUpdate": function fnUpdate() {
      this._fnDraw(true);
    },
    "fnRedrawLayout": function fnRedrawLayout() {
      this._fnColCalc();

      this._fnGridLayout();

      this.fnUpdate();
    },
    "fnRecalculateHeight": function fnRecalculateHeight(nTr) {
      delete nTr._DTTC_iHeight;
      nTr.style.height = 'auto';
    },
    "fnSetRowHeight": function fnSetRowHeight(nTarget, iHeight) {
      nTarget.style.height = iHeight + "px";
    },
    "fnGetPosition": function fnGetPosition(node) {
      var idx;
      var inst = this.s.dt.oInstance;

      if (!$(node).parents('.DTFC_Cloned').length) {
        return inst.fnGetPosition(node);
      } else {
        if (node.nodeName.toLowerCase() === 'tr') {
          idx = $(node).index();
          return inst.fnGetPosition($('tr', this.s.dt.nTBody)[idx]);
        } else {
          var colIdx = $(node).index();
          idx = $(node.parentNode).index();
          var row = inst.fnGetPosition($('tr', this.s.dt.nTBody)[idx]);
          return [row, colIdx, inst.oApi._fnVisibleToColumnIndex(this.s.dt, colIdx)];
        }
      }
    },
    "_fnConstruct": function _fnConstruct(oInit) {
      var i,
          iLen,
          iWidth,
          that = this;

      if (typeof this.s.dt.oInstance.fnVersionCheck != 'function' || this.s.dt.oInstance.fnVersionCheck('1.8.0') !== true) {
        alert("FixedColumns " + FixedColumns.VERSION + " required DataTables 1.8.0 or later. " + "Please upgrade your DataTables installation");
        return;
      }

      if (this.s.dt.oScroll.sX === "") {
        this.s.dt.oInstance.oApi._fnLog(this.s.dt, 1, "FixedColumns is not needed (no " + "x-scrolling in DataTables enabled), so no action will be taken. Use 'FixedHeader' for " + "column fixing when scrolling is not enabled");

        return;
      }

      this.s = $.extend(true, this.s, FixedColumns.defaults, oInit);
      var classes = this.s.dt.oClasses;
      this.dom.grid.dt = $(this.s.dt.nTable).parents('div.' + classes.sScrollWrapper)[0];
      this.dom.scroller = $('div.' + classes.sScrollBody, this.dom.grid.dt)[0];

      this._fnColCalc();

      this._fnGridSetup();

      var mouseController;
      var mouseDown = false;
      $(this.s.dt.nTableWrapper).on('mousedown.DTFC', function (e) {
        if (e.button === 0) {
          mouseDown = true;
          $(document).one('mouseup', function () {
            mouseDown = false;
          });
        }
      });
      $(this.dom.scroller).on('mouseover.DTFC touchstart.DTFC', function () {
        if (!mouseDown) {
          mouseController = 'main';
        }
      }).on('scroll.DTFC', function (e) {
        if (!mouseController && e.originalEvent) {
          mouseController = 'main';
        }

        if (mouseController === 'main') {
          if (that.s.iLeftColumns > 0) {
            that.dom.grid.left.liner.scrollTop = that.dom.scroller.scrollTop;
          }

          if (that.s.iRightColumns > 0) {
            that.dom.grid.right.liner.scrollTop = that.dom.scroller.scrollTop;
          }
        }
      });
      var wheelType = 'onwheel' in document.createElement('div') ? 'wheel.DTFC' : 'mousewheel.DTFC';

      if (that.s.iLeftColumns > 0) {
        $(that.dom.grid.left.liner).on('mouseover.DTFC touchstart.DTFC', function () {
          if (!mouseDown) {
            mouseController = 'left';
          }
        }).on('scroll.DTFC', function (e) {
          if (!mouseController && e.originalEvent) {
            mouseController = 'left';
          }

          if (mouseController === 'left') {
            that.dom.scroller.scrollTop = that.dom.grid.left.liner.scrollTop;

            if (that.s.iRightColumns > 0) {
              that.dom.grid.right.liner.scrollTop = that.dom.grid.left.liner.scrollTop;
            }
          }
        }).on(wheelType, function (e) {
          var xDelta = e.type === 'wheel' ? -e.originalEvent.deltaX : e.originalEvent.wheelDeltaX;
          that.dom.scroller.scrollLeft -= xDelta;
        });
      }

      if (that.s.iRightColumns > 0) {
        $(that.dom.grid.right.liner).on('mouseover.DTFC touchstart.DTFC', function () {
          if (!mouseDown) {
            mouseController = 'right';
          }
        }).on('scroll.DTFC', function (e) {
          if (!mouseController && e.originalEvent) {
            mouseController = 'right';
          }

          if (mouseController === 'right') {
            that.dom.scroller.scrollTop = that.dom.grid.right.liner.scrollTop;

            if (that.s.iLeftColumns > 0) {
              that.dom.grid.left.liner.scrollTop = that.dom.grid.right.liner.scrollTop;
            }
          }
        }).on(wheelType, function (e) {
          var xDelta = e.type === 'wheel' ? -e.originalEvent.deltaX : e.originalEvent.wheelDeltaX;
          that.dom.scroller.scrollLeft -= xDelta;
        });
      }

      $(window).on('resize.DTFC', function () {
        that._fnGridLayout.call(that);
      });
      var bFirstDraw = true;
      var jqTable = $(this.s.dt.nTable);
      jqTable.on('draw.dt.DTFC', function () {
        that._fnColCalc();

        that._fnDraw.call(that, bFirstDraw);

        bFirstDraw = false;
      }).on('column-sizing.dt.DTFC', function () {
        that._fnColCalc();

        that._fnGridLayout(that);
      }).on('column-visibility.dt.DTFC', function (e, settings, column, vis, recalc) {
        if (recalc === undefined || recalc) {
          that._fnColCalc();

          that._fnGridLayout(that);

          that._fnDraw(true);
        }
      }).on('select.dt.DTFC deselect.dt.DTFC', function (e, dt, type, indexes) {
        if (e.namespace === 'dt') {
          that._fnDraw(false);
        }
      }).on('destroy.dt.DTFC', function () {
        jqTable.off('.DTFC');
        $(that.dom.scroller).off('.DTFC');
        $(window).off('.DTFC');
        $(that.s.dt.nTableWrapper).off('.DTFC');
        $(that.dom.grid.left.liner).off('.DTFC ' + wheelType);
        $(that.dom.grid.left.wrapper).remove();
        $(that.dom.grid.right.liner).off('.DTFC ' + wheelType);
        $(that.dom.grid.right.wrapper).remove();
      });

      this._fnGridLayout();

      this.s.dt.oInstance.fnDraw(false);
    },
    "_fnColCalc": function _fnColCalc() {
      var that = this;
      var iLeftWidth = 0;
      var iRightWidth = 0;
      this.s.aiInnerWidths = [];
      this.s.aiOuterWidths = [];
      $.each(this.s.dt.aoColumns, function (i, col) {
        var th = $(col.nTh);
        var border;

        if (!th.filter(':visible').length) {
          that.s.aiInnerWidths.push(0);
          that.s.aiOuterWidths.push(0);
        } else {
          var iWidth = th.outerWidth();

          if (that.s.aiOuterWidths.length === 0) {
            border = $(that.s.dt.nTable).css('border-left-width');
            iWidth += typeof border === 'string' && border.indexOf('px') === -1 ? 1 : parseInt(border, 10);
          }

          if (that.s.aiOuterWidths.length === that.s.dt.aoColumns.length - 1) {
            border = $(that.s.dt.nTable).css('border-right-width');
            iWidth += typeof border === 'string' && border.indexOf('px') === -1 ? 1 : parseInt(border, 10);
          }

          that.s.aiOuterWidths.push(iWidth);
          that.s.aiInnerWidths.push(th.width());

          if (i < that.s.iLeftColumns) {
            iLeftWidth += iWidth;
          }

          if (that.s.iTableColumns - that.s.iRightColumns <= i) {
            iRightWidth += iWidth;
          }
        }
      });
      this.s.iLeftWidth = iLeftWidth;
      this.s.iRightWidth = iRightWidth;
    },
    "_fnGridSetup": function _fnGridSetup() {
      var that = this;

      var oOverflow = this._fnDTOverflow();

      var block;
      this.dom.body = this.s.dt.nTable;
      this.dom.header = this.s.dt.nTHead.parentNode;
      this.dom.header.parentNode.parentNode.style.position = "relative";
      var nSWrapper = $('<div class="DTFC_ScrollWrapper" style="position:relative; clear:both;">' + '<div class="DTFC_LeftWrapper" style="position:absolute; top:0; left:0;" aria-hidden="true">' + '<div class="DTFC_LeftHeadWrapper" style="position:relative; top:0; left:0; overflow:hidden;"></div>' + '<div class="DTFC_LeftBodyWrapper" style="position:relative; top:0; left:0; overflow:hidden;">' + '<div class="DTFC_LeftBodyLiner" style="position:relative; top:0; left:0; overflow-y:scroll;"></div>' + '</div>' + '<div class="DTFC_LeftFootWrapper" style="position:relative; top:0; left:0; overflow:hidden;"></div>' + '</div>' + '<div class="DTFC_RightWrapper" style="position:absolute; top:0; right:0;" aria-hidden="true">' + '<div class="DTFC_RightHeadWrapper" style="position:relative; top:0; left:0;">' + '<div class="DTFC_RightHeadBlocker DTFC_Blocker" style="position:absolute; top:0; bottom:0;"></div>' + '</div>' + '<div class="DTFC_RightBodyWrapper" style="position:relative; top:0; left:0; overflow:hidden;">' + '<div class="DTFC_RightBodyLiner" style="position:relative; top:0; left:0; overflow-y:scroll;"></div>' + '</div>' + '<div class="DTFC_RightFootWrapper" style="position:relative; top:0; left:0;">' + '<div class="DTFC_RightFootBlocker DTFC_Blocker" style="position:absolute; top:0; bottom:0;"></div>' + '</div>' + '</div>' + '</div>')[0];
      var nLeft = nSWrapper.childNodes[0];
      var nRight = nSWrapper.childNodes[1];
      this.dom.grid.dt.parentNode.insertBefore(nSWrapper, this.dom.grid.dt);
      nSWrapper.appendChild(this.dom.grid.dt);
      this.dom.grid.wrapper = nSWrapper;

      if (this.s.iLeftColumns > 0) {
        this.dom.grid.left.wrapper = nLeft;
        this.dom.grid.left.head = nLeft.childNodes[0];
        this.dom.grid.left.body = nLeft.childNodes[1];
        this.dom.grid.left.liner = $('div.DTFC_LeftBodyLiner', nSWrapper)[0];
        nSWrapper.appendChild(nLeft);
      }

      if (this.s.iRightColumns > 0) {
        this.dom.grid.right.wrapper = nRight;
        this.dom.grid.right.head = nRight.childNodes[0];
        this.dom.grid.right.body = nRight.childNodes[1];
        this.dom.grid.right.liner = $('div.DTFC_RightBodyLiner', nSWrapper)[0];
        nRight.style.right = oOverflow.bar + "px";
        block = $('div.DTFC_RightHeadBlocker', nSWrapper)[0];
        block.style.width = oOverflow.bar + "px";
        block.style.right = -oOverflow.bar + "px";
        this.dom.grid.right.headBlock = block;
        block = $('div.DTFC_RightFootBlocker', nSWrapper)[0];
        block.style.width = oOverflow.bar + "px";
        block.style.right = -oOverflow.bar + "px";
        this.dom.grid.right.footBlock = block;
        nSWrapper.appendChild(nRight);
      }

      if (this.s.dt.nTFoot) {
        this.dom.footer = this.s.dt.nTFoot.parentNode;

        if (this.s.iLeftColumns > 0) {
          this.dom.grid.left.foot = nLeft.childNodes[2];
        }

        if (this.s.iRightColumns > 0) {
          this.dom.grid.right.foot = nRight.childNodes[2];
        }
      }

      if (this.s.rtl) {
        $('div.DTFC_RightHeadBlocker', nSWrapper).css({
          left: -oOverflow.bar + 'px',
          right: ''
        });
      }
    },
    "_fnGridLayout": function _fnGridLayout() {
      var that = this;
      var oGrid = this.dom.grid;
      var iWidth = $(oGrid.wrapper).width();
      var iBodyHeight = this.s.dt.nTable.parentNode.offsetHeight;
      var iFullHeight = this.s.dt.nTable.parentNode.parentNode.offsetHeight;

      var oOverflow = this._fnDTOverflow();

      var iLeftWidth = this.s.iLeftWidth;
      var iRightWidth = this.s.iRightWidth;
      var rtl = $(this.dom.body).css('direction') === 'rtl';
      var wrapper;

      var scrollbarAdjust = function scrollbarAdjust(node, width) {
        if (!oOverflow.bar) {
          node.style.width = width + 20 + "px";
          node.style.paddingRight = "20px";
          node.style.boxSizing = "border-box";
        } else if (that._firefoxScrollError()) {
          if ($(node).height() > 34) {
            node.style.width = width + oOverflow.bar + "px";
          }
        } else {
          node.style.width = width + oOverflow.bar + "px";
        }
      };

      if (oOverflow.x) {
        iBodyHeight -= oOverflow.bar;
      }

      oGrid.wrapper.style.height = iFullHeight + "px";

      if (this.s.iLeftColumns > 0) {
        wrapper = oGrid.left.wrapper;
        wrapper.style.width = iLeftWidth + 'px';
        wrapper.style.height = '1px';

        if (rtl) {
          wrapper.style.left = '';
          wrapper.style.right = 0;
        } else {
          wrapper.style.left = 0;
          wrapper.style.right = '';
        }

        oGrid.left.body.style.height = iBodyHeight + "px";

        if (oGrid.left.foot) {
          oGrid.left.foot.style.top = (oOverflow.x ? oOverflow.bar : 0) + "px";
        }

        scrollbarAdjust(oGrid.left.liner, iLeftWidth);
        oGrid.left.liner.style.height = iBodyHeight + "px";
        oGrid.left.liner.style.maxHeight = iBodyHeight + "px";
      }

      if (this.s.iRightColumns > 0) {
        wrapper = oGrid.right.wrapper;
        wrapper.style.width = iRightWidth + 'px';
        wrapper.style.height = '1px';

        if (this.s.rtl) {
          wrapper.style.left = oOverflow.y ? oOverflow.bar + 'px' : 0;
          wrapper.style.right = '';
        } else {
          wrapper.style.left = '';
          wrapper.style.right = oOverflow.y ? oOverflow.bar + 'px' : 0;
        }

        oGrid.right.body.style.height = iBodyHeight + "px";

        if (oGrid.right.foot) {
          oGrid.right.foot.style.top = (oOverflow.x ? oOverflow.bar : 0) + "px";
        }

        scrollbarAdjust(oGrid.right.liner, iRightWidth);
        oGrid.right.liner.style.height = iBodyHeight + "px";
        oGrid.right.liner.style.maxHeight = iBodyHeight + "px";
        oGrid.right.headBlock.style.display = oOverflow.y ? 'block' : 'none';
        oGrid.right.footBlock.style.display = oOverflow.y ? 'block' : 'none';
      }
    },
    "_fnDTOverflow": function _fnDTOverflow() {
      var nTable = this.s.dt.nTable;
      var nTableScrollBody = nTable.parentNode;
      var out = {
        "x": false,
        "y": false,
        "bar": this.s.dt.oScroll.iBarWidth
      };

      if (nTable.offsetWidth > nTableScrollBody.clientWidth) {
        out.x = true;
      }

      if (nTable.offsetHeight > nTableScrollBody.clientHeight) {
        out.y = true;
      }

      return out;
    },
    "_fnDraw": function _fnDraw(bAll) {
      this._fnGridLayout();

      this._fnCloneLeft(bAll);

      this._fnCloneRight(bAll);

      if (this.s.fnDrawCallback !== null) {
        this.s.fnDrawCallback.call(this, this.dom.clone.left, this.dom.clone.right);
      }

      $(this).trigger('draw.dtfc', {
        "leftClone": this.dom.clone.left,
        "rightClone": this.dom.clone.right
      });
    },
    "_fnCloneRight": function _fnCloneRight(bAll) {
      if (this.s.iRightColumns <= 0) {
        return;
      }

      var that = this,
          i,
          jq,
          aiColumns = [];

      for (i = this.s.iTableColumns - this.s.iRightColumns; i < this.s.iTableColumns; i++) {
        if (this.s.dt.aoColumns[i].bVisible) {
          aiColumns.push(i);
        }
      }

      this._fnClone(this.dom.clone.right, this.dom.grid.right, aiColumns, bAll);
    },
    "_fnCloneLeft": function _fnCloneLeft(bAll) {
      if (this.s.iLeftColumns <= 0) {
        return;
      }

      var that = this,
          i,
          jq,
          aiColumns = [];

      for (i = 0; i < this.s.iLeftColumns; i++) {
        if (this.s.dt.aoColumns[i].bVisible) {
          aiColumns.push(i);
        }
      }

      this._fnClone(this.dom.clone.left, this.dom.grid.left, aiColumns, bAll);
    },
    "_fnCopyLayout": function _fnCopyLayout(aoOriginal, aiColumns, events) {
      var aReturn = [];
      var aClones = [];
      var aCloned = [];

      for (var i = 0, iLen = aoOriginal.length; i < iLen; i++) {
        var aRow = [];
        aRow.nTr = $(aoOriginal[i].nTr).clone(events, false)[0];

        for (var j = 0, jLen = this.s.iTableColumns; j < jLen; j++) {
          if ($.inArray(j, aiColumns) === -1) {
            continue;
          }

          var iCloned = $.inArray(aoOriginal[i][j].cell, aCloned);

          if (iCloned === -1) {
            var nClone = $(aoOriginal[i][j].cell).clone(events, false)[0];
            aClones.push(nClone);
            aCloned.push(aoOriginal[i][j].cell);
            aRow.push({
              "cell": nClone,
              "unique": aoOriginal[i][j].unique
            });
          } else {
            aRow.push({
              "cell": aClones[iCloned],
              "unique": aoOriginal[i][j].unique
            });
          }
        }

        aReturn.push(aRow);
      }

      return aReturn;
    },
    "_fnClone": function _fnClone(oClone, oGrid, aiColumns, bAll) {
      var that = this,
          i,
          iLen,
          j,
          jLen,
          jq,
          nTarget,
          iColumn,
          nClone,
          iIndex,
          aoCloneLayout,
          jqCloneThead,
          aoFixedHeader,
          dt = this.s.dt;

      if (bAll) {
        $(oClone.header).remove();
        oClone.header = $(this.dom.header).clone(true, false)[0];
        oClone.header.className += " DTFC_Cloned";
        oClone.header.style.width = "100%";
        oGrid.head.appendChild(oClone.header);
        aoCloneLayout = this._fnCopyLayout(dt.aoHeader, aiColumns, true);
        jqCloneThead = $('>thead', oClone.header);
        jqCloneThead.empty();

        for (i = 0, iLen = aoCloneLayout.length; i < iLen; i++) {
          jqCloneThead[0].appendChild(aoCloneLayout[i].nTr);
        }

        dt.oApi._fnDrawHead(dt, aoCloneLayout, true);
      } else {
        aoCloneLayout = this._fnCopyLayout(dt.aoHeader, aiColumns, false);
        aoFixedHeader = [];

        dt.oApi._fnDetectHeader(aoFixedHeader, $('>thead', oClone.header)[0]);

        for (i = 0, iLen = aoCloneLayout.length; i < iLen; i++) {
          for (j = 0, jLen = aoCloneLayout[i].length; j < jLen; j++) {
            aoFixedHeader[i][j].cell.className = aoCloneLayout[i][j].cell.className;
            $('span.DataTables_sort_icon', aoFixedHeader[i][j].cell).each(function () {
              this.className = $('span.DataTables_sort_icon', aoCloneLayout[i][j].cell)[0].className;
            });
          }
        }
      }

      this._fnEqualiseHeights('thead', this.dom.header, oClone.header);

      if (this.s.sHeightMatch == 'auto') {
        $('>tbody>tr', that.dom.body).css('height', 'auto');
      }

      if (oClone.body !== null) {
        $(oClone.body).remove();
        oClone.body = null;
      }

      oClone.body = $(this.dom.body).clone(true)[0];
      oClone.body.className += " DTFC_Cloned";
      oClone.body.style.paddingBottom = dt.oScroll.iBarWidth + "px";
      oClone.body.style.marginBottom = dt.oScroll.iBarWidth * 2 + "px";

      if (oClone.body.getAttribute('id') !== null) {
        oClone.body.removeAttribute('id');
      }

      $('>thead>tr', oClone.body).empty();
      $('>tfoot', oClone.body).remove();
      var nBody = $('tbody', oClone.body)[0];
      $(nBody).empty();

      if (dt.aiDisplay.length > 0) {
        var nInnerThead = $('>thead>tr', oClone.body)[0];

        for (iIndex = 0; iIndex < aiColumns.length; iIndex++) {
          iColumn = aiColumns[iIndex];
          nClone = $(dt.aoColumns[iColumn].nTh).clone(true)[0];
          nClone.innerHTML = "";
          var oStyle = nClone.style;
          oStyle.paddingTop = "0";
          oStyle.paddingBottom = "0";
          oStyle.borderTopWidth = "0";
          oStyle.borderBottomWidth = "0";
          oStyle.height = 0;
          oStyle.width = that.s.aiInnerWidths[iColumn] + "px";
          nInnerThead.appendChild(nClone);
        }

        $('>tbody>tr', that.dom.body).each(function (z) {
          var i = that.s.dt.oFeatures.bServerSide === false ? that.s.dt.aiDisplay[that.s.dt._iDisplayStart + z] : z;
          var aTds = that.s.dt.aoData[i].anCells || $(this).children('td, th');
          var n = this.cloneNode(false);
          n.removeAttribute('id');
          n.setAttribute('data-dt-row', i);

          for (iIndex = 0; iIndex < aiColumns.length; iIndex++) {
            iColumn = aiColumns[iIndex];

            if (aTds.length > 0) {
              nClone = $(aTds[iColumn]).clone(true, true)[0];
              nClone.removeAttribute('id');
              nClone.setAttribute('data-dt-row', i);
              nClone.setAttribute('data-dt-column', iColumn);
              n.appendChild(nClone);
            }
          }

          nBody.appendChild(n);
        });
      } else {
        $('>tbody>tr', that.dom.body).each(function (z) {
          nClone = this.cloneNode(true);
          nClone.className += ' DTFC_NoData';
          $('td', nClone).html('');
          nBody.appendChild(nClone);
        });
      }

      oClone.body.style.width = "100%";
      oClone.body.style.margin = "0";
      oClone.body.style.padding = "0";

      if (dt.oScroller !== undefined) {
        var scrollerForcer = dt.oScroller.dom.force;

        if (!oGrid.forcer) {
          oGrid.forcer = scrollerForcer.cloneNode(true);
          oGrid.liner.appendChild(oGrid.forcer);
        } else {
          oGrid.forcer.style.height = scrollerForcer.style.height;
        }
      }

      oGrid.liner.appendChild(oClone.body);

      this._fnEqualiseHeights('tbody', that.dom.body, oClone.body);

      if (dt.nTFoot !== null) {
        if (bAll) {
          if (oClone.footer !== null) {
            oClone.footer.parentNode.removeChild(oClone.footer);
          }

          oClone.footer = $(this.dom.footer).clone(true, true)[0];
          oClone.footer.className += " DTFC_Cloned";
          oClone.footer.style.width = "100%";
          oGrid.foot.appendChild(oClone.footer);
          aoCloneLayout = this._fnCopyLayout(dt.aoFooter, aiColumns, true);
          var jqCloneTfoot = $('>tfoot', oClone.footer);
          jqCloneTfoot.empty();

          for (i = 0, iLen = aoCloneLayout.length; i < iLen; i++) {
            jqCloneTfoot[0].appendChild(aoCloneLayout[i].nTr);
          }

          dt.oApi._fnDrawHead(dt, aoCloneLayout, true);
        } else {
          aoCloneLayout = this._fnCopyLayout(dt.aoFooter, aiColumns, false);
          var aoCurrFooter = [];

          dt.oApi._fnDetectHeader(aoCurrFooter, $('>tfoot', oClone.footer)[0]);

          for (i = 0, iLen = aoCloneLayout.length; i < iLen; i++) {
            for (j = 0, jLen = aoCloneLayout[i].length; j < jLen; j++) {
              aoCurrFooter[i][j].cell.className = aoCloneLayout[i][j].cell.className;
            }
          }
        }

        this._fnEqualiseHeights('tfoot', this.dom.footer, oClone.footer);
      }

      var anUnique = dt.oApi._fnGetUniqueThs(dt, $('>thead', oClone.header)[0]);

      $(anUnique).each(function (i) {
        iColumn = aiColumns[i];
        this.style.width = that.s.aiInnerWidths[iColumn] + "px";
      });

      if (that.s.dt.nTFoot !== null) {
        anUnique = dt.oApi._fnGetUniqueThs(dt, $('>tfoot', oClone.footer)[0]);
        $(anUnique).each(function (i) {
          iColumn = aiColumns[i];
          this.style.width = that.s.aiInnerWidths[iColumn] + "px";
        });
      }
    },
    "_fnGetTrNodes": function _fnGetTrNodes(nIn) {
      var aOut = [];

      for (var i = 0, iLen = nIn.childNodes.length; i < iLen; i++) {
        if (nIn.childNodes[i].nodeName.toUpperCase() == "TR") {
          aOut.push(nIn.childNodes[i]);
        }
      }

      return aOut;
    },
    "_fnEqualiseHeights": function _fnEqualiseHeights(nodeName, original, clone) {
      if (this.s.sHeightMatch == 'none' && nodeName !== 'thead' && nodeName !== 'tfoot') {
        return;
      }

      var that = this,
          i,
          iLen,
          iHeight,
          iHeight2,
          iHeightOriginal,
          iHeightClone,
          rootOriginal = original.getElementsByTagName(nodeName)[0],
          rootClone = clone.getElementsByTagName(nodeName)[0],
          jqBoxHack = $('>' + nodeName + '>tr:eq(0)', original).children(':first'),
          iBoxHack = jqBoxHack.outerHeight() - jqBoxHack.height(),
          anOriginal = this._fnGetTrNodes(rootOriginal),
          anClone = this._fnGetTrNodes(rootClone),
          heights = [];

      for (i = 0, iLen = anClone.length; i < iLen; i++) {
        iHeightOriginal = anOriginal[i].offsetHeight;
        iHeightClone = anClone[i].offsetHeight;
        iHeight = iHeightClone > iHeightOriginal ? iHeightClone : iHeightOriginal;

        if (this.s.sHeightMatch == 'semiauto') {
          anOriginal[i]._DTTC_iHeight = iHeight;
        }

        heights.push(iHeight);
      }

      for (i = 0, iLen = anClone.length; i < iLen; i++) {
        anClone[i].style.height = heights[i] + "px";
        anOriginal[i].style.height = heights[i] + "px";
      }
    },
    _firefoxScrollError: function _firefoxScrollError() {
      if (_firefoxScroll === undefined) {
        var test = $('<div/>').css({
          position: 'absolute',
          top: 0,
          left: 0,
          height: 10,
          width: 50,
          overflow: 'scroll'
        }).appendTo('body');
        _firefoxScroll = test[0].clientWidth === test[0].offsetWidth && this._fnDTOverflow().bar !== 0;
        test.remove();
      }

      return _firefoxScroll;
    }
  });
  FixedColumns.defaults = {
    "iLeftColumns": 1,
    "iRightColumns": 0,
    "fnDrawCallback": null,
    "sHeightMatch": "semiauto"
  };
  FixedColumns.version = "3.2.5";
  DataTable.Api.register('fixedColumns()', function () {
    return this;
  });
  DataTable.Api.register('fixedColumns().update()', function () {
    return this.iterator('table', function (ctx) {
      if (ctx._oFixedColumns) {
        ctx._oFixedColumns.fnUpdate();
      }
    });
  });
  DataTable.Api.register('fixedColumns().relayout()', function () {
    return this.iterator('table', function (ctx) {
      if (ctx._oFixedColumns) {
        ctx._oFixedColumns.fnRedrawLayout();
      }
    });
  });
  DataTable.Api.register('rows().recalcHeight()', function () {
    return this.iterator('row', function (ctx, idx) {
      if (ctx._oFixedColumns) {
        ctx._oFixedColumns.fnRecalculateHeight(this.row(idx).node());
      }
    });
  });
  DataTable.Api.register('fixedColumns().rowIndex()', function (row) {
    row = $(row);
    return row.parents('.DTFC_Cloned').length ? this.rows({
      page: 'current'
    }).indexes()[row.index()] : this.row(row).index();
  });
  DataTable.Api.register('fixedColumns().cellIndex()', function (cell) {
    cell = $(cell);

    if (cell.parents('.DTFC_Cloned').length) {
      var rowClonedIdx = cell.parent().index();
      var rowIdx = this.rows({
        page: 'current'
      }).indexes()[rowClonedIdx];
      var columnIdx;

      if (cell.parents('.DTFC_LeftWrapper').length) {
        columnIdx = cell.index();
      } else {
        var columns = this.columns().flatten().length;
        columnIdx = columns - this.context[0]._oFixedColumns.s.iRightColumns + cell.index();
      }

      return {
        row: rowIdx,
        column: this.column.index('toData', columnIdx),
        columnVisible: columnIdx
      };
    } else {
      return this.cell(cell).index();
    }
  });
  $(document).on('init.dt.fixedColumns', function (e, settings) {
    if (e.namespace !== 'dt') {
      return;
    }

    var init = settings.oInit.fixedColumns;
    var defaults = DataTable.defaults.fixedColumns;

    if (init || defaults) {
      var opts = $.extend({}, init, defaults);

      if (init !== false) {
        new FixedColumns(settings, opts);
      }
    }
  });
  $.fn.dataTable.FixedColumns = FixedColumns;
  $.fn.DataTable.FixedColumns = FixedColumns;
  return FixedColumns;
});
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'datatables.net'], function ($) {
      return factory($, window, document);
    });
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = function (root, $) {
      if (!root) {
        root = window;
      }

      if (!$ || !$.fn.dataTable) {
        $ = require('datatables.net')(root, $).$;
      }

      return factory($, root, root.document);
    };
  } else {
    factory(jQuery, window, document);
  }
})(function ($, window, document, undefined) {
  'use strict';

  var DataTable = $.fn.dataTable;
  var _instCounter = 0;

  var FixedHeader = function FixedHeader(dt, config) {
    if (!(this instanceof FixedHeader)) {
      throw "FixedHeader must be initialised with the 'new' keyword.";
    }

    if (config === true) {
      config = {};
    }

    dt = new DataTable.Api(dt);
    this.c = $.extend(true, {}, FixedHeader.defaults, config);
    this.s = {
      dt: dt,
      position: {
        theadTop: 0,
        tbodyTop: 0,
        tfootTop: 0,
        tfootBottom: 0,
        width: 0,
        left: 0,
        tfootHeight: 0,
        theadHeight: 0,
        windowHeight: $(window).height(),
        visible: true
      },
      headerMode: null,
      footerMode: null,
      autoWidth: dt.settings()[0].oFeatures.bAutoWidth,
      namespace: '.dtfc' + _instCounter++,
      scrollLeft: {
        header: -1,
        footer: -1
      },
      enable: true
    };
    this.dom = {
      floatingHeader: null,
      thead: $(dt.table().header()),
      tbody: $(dt.table().body()),
      tfoot: $(dt.table().footer()),
      header: {
        host: null,
        floating: null,
        placeholder: null
      },
      footer: {
        host: null,
        floating: null,
        placeholder: null
      }
    };
    this.dom.header.host = this.dom.thead.parent();
    this.dom.footer.host = this.dom.tfoot.parent();
    var dtSettings = dt.settings()[0];

    if (dtSettings._fixedHeader) {
      throw "FixedHeader already initialised on table " + dtSettings.nTable.id;
    }

    dtSettings._fixedHeader = this;

    this._constructor();
  };

  $.extend(FixedHeader.prototype, {
    enable: function enable(_enable) {
      this.s.enable = _enable;

      if (this.c.header) {
        this._modeChange('in-place', 'header', true);
      }

      if (this.c.footer && this.dom.tfoot.length) {
        this._modeChange('in-place', 'footer', true);
      }

      this.update();
    },
    headerOffset: function headerOffset(offset) {
      if (offset !== undefined) {
        this.c.headerOffset = offset;
        this.update();
      }

      return this.c.headerOffset;
    },
    footerOffset: function footerOffset(offset) {
      if (offset !== undefined) {
        this.c.footerOffset = offset;
        this.update();
      }

      return this.c.footerOffset;
    },
    update: function update() {
      this._positions();

      this._scroll(true);
    },
    _constructor: function _constructor() {
      var that = this;
      var dt = this.s.dt;
      $(window).on('scroll' + this.s.namespace, function () {
        that._scroll();
      }).on('resize' + this.s.namespace, DataTable.util.throttle(function () {
        that.s.position.windowHeight = $(window).height();
        that.update();
      }, 50));
      var autoHeader = $('.fh-fixedHeader');

      if (!this.c.headerOffset && autoHeader.length) {
        this.c.headerOffset = autoHeader.outerHeight();
      }

      var autoFooter = $('.fh-fixedFooter');

      if (!this.c.footerOffset && autoFooter.length) {
        this.c.footerOffset = autoFooter.outerHeight();
      }

      dt.on('column-reorder.dt.dtfc column-visibility.dt.dtfc draw.dt.dtfc column-sizing.dt.dtfc responsive-display.dt.dtfc', function () {
        that.update();
      });
      dt.on('destroy.dtfc', function () {
        if (that.c.header) {
          that._modeChange('in-place', 'header', true);
        }

        if (that.c.footer && that.dom.tfoot.length) {
          that._modeChange('in-place', 'footer', true);
        }

        dt.off('.dtfc');
        $(window).off(that.s.namespace);
      });

      this._positions();

      this._scroll();
    },
    _clone: function _clone(item, force) {
      var dt = this.s.dt;
      var itemDom = this.dom[item];
      var itemElement = item === 'header' ? this.dom.thead : this.dom.tfoot;

      if (!force && itemDom.floating) {
        itemDom.floating.removeClass('fixedHeader-floating fixedHeader-locked');
      } else {
        if (itemDom.floating) {
          itemDom.placeholder.remove();

          this._unsize(item);

          itemDom.floating.children().detach();
          itemDom.floating.remove();
        }

        itemDom.floating = $(dt.table().node().cloneNode(false)).css('table-layout', 'fixed').attr('aria-hidden', 'true').removeAttr('id').append(itemElement).appendTo('body');
        itemDom.placeholder = itemElement.clone(false);
        itemDom.placeholder.find('*[id]').removeAttr('id');
        itemDom.host.prepend(itemDom.placeholder);

        this._matchWidths(itemDom.placeholder, itemDom.floating);
      }
    },
    _matchWidths: function _matchWidths(from, to) {
      var get = function get(name) {
        return $(name, from).map(function () {
          return $(this).width();
        }).toArray();
      };

      var set = function set(name, toWidths) {
        $(name, to).each(function (i) {
          $(this).css({
            width: toWidths[i],
            minWidth: toWidths[i]
          });
        });
      };

      var thWidths = get('th');
      var tdWidths = get('td');
      set('th', thWidths);
      set('td', tdWidths);
    },
    _unsize: function _unsize(item) {
      var el = this.dom[item].floating;

      if (el && (item === 'footer' || item === 'header' && !this.s.autoWidth)) {
        $('th, td', el).css({
          width: '',
          minWidth: ''
        });
      } else if (el && item === 'header') {
        $('th, td', el).css('min-width', '');
      }
    },
    _horizontal: function _horizontal(item, scrollLeft) {
      var itemDom = this.dom[item];
      var position = this.s.position;
      var lastScrollLeft = this.s.scrollLeft;

      if (itemDom.floating && lastScrollLeft[item] !== scrollLeft) {
        itemDom.floating.css('left', position.left - scrollLeft);
        lastScrollLeft[item] = scrollLeft;
      }
    },
    _modeChange: function _modeChange(mode, item, forceChange) {
      var dt = this.s.dt;
      var itemDom = this.dom[item];
      var position = this.s.position;
      var tablePart = this.dom[item === 'footer' ? 'tfoot' : 'thead'];
      var focus = $.contains(tablePart[0], document.activeElement) ? document.activeElement : null;

      if (focus) {
        focus.blur();
      }

      if (mode === 'in-place') {
        if (itemDom.placeholder) {
          itemDom.placeholder.remove();
          itemDom.placeholder = null;
        }

        this._unsize(item);

        if (item === 'header') {
          itemDom.host.prepend(tablePart);
        } else {
          itemDom.host.append(tablePart);
        }

        if (itemDom.floating) {
          itemDom.floating.remove();
          itemDom.floating = null;
        }
      } else if (mode === 'in') {
        this._clone(item, forceChange);

        itemDom.floating.addClass('fixedHeader-floating').css(item === 'header' ? 'top' : 'bottom', this.c[item + 'Offset']).css('left', position.left + 'px').css('width', position.width + 'px');

        if (item === 'footer') {
          itemDom.floating.css('top', '');
        }
      } else if (mode === 'below') {
        this._clone(item, forceChange);

        itemDom.floating.addClass('fixedHeader-locked').css('top', position.tfootTop - position.theadHeight).css('left', position.left + 'px').css('width', position.width + 'px');
      } else if (mode === 'above') {
        this._clone(item, forceChange);

        itemDom.floating.addClass('fixedHeader-locked').css('top', position.tbodyTop).css('left', position.left + 'px').css('width', position.width + 'px');
      }

      if (focus && focus !== document.activeElement) {
        setTimeout(function () {
          focus.focus();
        }, 10);
      }

      this.s.scrollLeft.header = -1;
      this.s.scrollLeft.footer = -1;
      this.s[item + 'Mode'] = mode;
    },
    _positions: function _positions() {
      var dt = this.s.dt;
      var table = dt.table();
      var position = this.s.position;
      var dom = this.dom;
      var tableNode = $(table.node());
      var thead = tableNode.children('thead');
      var tfoot = tableNode.children('tfoot');
      var tbody = dom.tbody;
      position.visible = tableNode.is(':visible');
      position.width = tableNode.outerWidth();
      position.left = tableNode.offset().left;
      position.theadTop = thead.offset().top;
      position.tbodyTop = tbody.offset().top;
      position.theadHeight = position.tbodyTop - position.theadTop;

      if (tfoot.length) {
        position.tfootTop = tfoot.offset().top;
        position.tfootBottom = position.tfootTop + tfoot.outerHeight();
        position.tfootHeight = position.tfootBottom - position.tfootTop;
      } else {
        position.tfootTop = position.tbodyTop + tbody.outerHeight();
        position.tfootBottom = position.tfootTop;
        position.tfootHeight = position.tfootTop;
      }
    },
    _scroll: function _scroll(forceChange) {
      var windowTop = $(document).scrollTop();
      var windowLeft = $(document).scrollLeft();
      var position = this.s.position;
      var headerMode, footerMode;

      if (!this.s.enable) {
        return;
      }

      if (this.c.header) {
        if (!position.visible || windowTop <= position.theadTop - this.c.headerOffset) {
          headerMode = 'in-place';
        } else if (windowTop <= position.tfootTop - position.theadHeight - this.c.headerOffset) {
          headerMode = 'in';
        } else {
          headerMode = 'below';
        }

        if (forceChange || headerMode !== this.s.headerMode) {
          this._modeChange(headerMode, 'header', forceChange);
        }

        this._horizontal('header', windowLeft);
      }

      if (this.c.footer && this.dom.tfoot.length) {
        if (!position.visible || windowTop + position.windowHeight >= position.tfootBottom + this.c.footerOffset) {
          footerMode = 'in-place';
        } else if (position.windowHeight + windowTop > position.tbodyTop + position.tfootHeight + this.c.footerOffset) {
          footerMode = 'in';
        } else {
          footerMode = 'above';
        }

        if (forceChange || footerMode !== this.s.footerMode) {
          this._modeChange(footerMode, 'footer', forceChange);
        }

        this._horizontal('footer', windowLeft);
      }
    }
  });
  FixedHeader.version = "3.1.4";
  FixedHeader.defaults = {
    header: true,
    footer: false,
    headerOffset: 0,
    footerOffset: 0
  };
  $.fn.dataTable.FixedHeader = FixedHeader;
  $.fn.DataTable.FixedHeader = FixedHeader;
  $(document).on('init.dt.dtfh', function (e, settings, json) {
    if (e.namespace !== 'dt') {
      return;
    }

    var init = settings.oInit.fixedHeader;
    var defaults = DataTable.defaults.fixedHeader;

    if ((init || defaults) && !settings._fixedHeader) {
      var opts = $.extend({}, defaults, init);

      if (init !== false) {
        new FixedHeader(settings, opts);
      }
    }
  });
  DataTable.Api.register('fixedHeader()', function () {});
  DataTable.Api.register('fixedHeader.adjust()', function () {
    return this.iterator('table', function (ctx) {
      var fh = ctx._fixedHeader;

      if (fh) {
        fh.update();
      }
    });
  });
  DataTable.Api.register('fixedHeader.enable()', function (flag) {
    return this.iterator('table', function (ctx) {
      var fh = ctx._fixedHeader;
      flag = flag !== undefined ? flag : true;

      if (fh && flag !== fh.s.enable) {
        fh.enable(flag);
      }
    });
  });
  DataTable.Api.register('fixedHeader.disable()', function () {
    return this.iterator('table', function (ctx) {
      var fh = ctx._fixedHeader;

      if (fh && fh.s.enable) {
        fh.enable(false);
      }
    });
  });
  $.each(['header', 'footer'], function (i, el) {
    DataTable.Api.register('fixedHeader.' + el + 'Offset()', function (offset) {
      var ctx = this.context;

      if (offset === undefined) {
        return ctx.length && ctx[0]._fixedHeader ? ctx[0]._fixedHeader[el + 'Offset']() : undefined;
      }

      return this.iterator('table', function (ctx) {
        var fh = ctx._fixedHeader;

        if (fh) {
          fh[el + 'Offset'](offset);
        }
      });
    });
  });
  return FixedHeader;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhdGFTZXRSdW50aW1lLmpzIiwiRm9ybVJlbGF0aW9uUE9VdGlsaXR5LmpzIiwiRm9ybVJ1bnRpbWUuanMiLCJJbm5lckZvcm1CdXR0b25SdW50aW1lLmpzIiwiTGlzdFJ1bnRpbWUuanMiLCJSdW50aW1lR2VuZXJhbC5qcyIsIkNvbnRyb2wvSFRNTENvbnRyb2wuanMiLCJDb250cm9sL1ZpcnR1YWxCb2R5Q29udHJvbC5qcyIsIkV4dGVybmFsL2RhdGF0YWJsZXMuanMiLCJDb250cm9sL1dlYkZvcm1Db250cm9sL1dGRENUX0Ryb3BEb3duU2VsZWN0LmpzIiwiQ29udHJvbC9XZWJGb3JtQ29udHJvbC9XRkRDVF9TaW1wbGVMYWJlbC5qcyIsIkNvbnRyb2wvV2ViRm9ybUNvbnRyb2wvV0ZEQ1RfU3ViRm9ybUxpc3RDb250YWluZXIuanMiLCJDb250cm9sL1dlYkZvcm1Db250cm9sL1dGRENUX1RleHRCb3guanMiLCJDb250cm9sL1dlYkZvcm1Db250cm9sL1dGRENUX1RleHREYXRlVGltZS5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfRm9ybUJ1dHRvbi5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdEJ1dHRvbkNvbnRhaW5lci5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdENvbXBsZXhTZWFyY2hDb250YWluZXIuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RTaW1wbGVTZWFyY2hDb250YWluZXIuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RUYWJsZUNoZWNrQm94LmpzIiwiQ29udHJvbC9XZWJMaXN0Q29udHJvbC9XTERDVF9MaXN0VGFibGVDb250YWluZXIuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RUYWJsZUlubmVyQnV0dG9uQ29udGFpbmVyLmpzIiwiQ29udHJvbC9XZWJMaXN0Q29udHJvbC9XTERDVF9MaXN0VGFibGVJbm5lckJ1dHRvblNpbmdsZS5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdFRhYmxlTGFiZWwuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX1NlYXJjaF9UZXh0Qm94LmpzIiwiRXh0ZXJuYWwvRml4ZWRDb2x1bW5zLTMuMi41L2RhdGFUYWJsZXMuZml4ZWRDb2x1bW5zLmpzIiwiRXh0ZXJuYWwvRml4ZWRIZWFkZXItMy4xLjQvZGF0YVRhYmxlcy5maXhlZEhlYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyNkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDejdNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25rQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiSFRNTERlc2lnblJ1bnRpbWVGdWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEYXRhU2V0UnVudGltZSA9IHtcbiAgR2V0RGF0YVNldERhdGE6IGZ1bmN0aW9uIEdldERhdGFTZXREYXRhKGNvbmZpZywgZnVuYywgc2VuZGVyKSB7XG4gICAgdmFyIHNlbmREYXRhID0gSlNPTi5zdHJpbmdpZnkoY29uZmlnKTtcbiAgICBBamF4VXRpbGl0eS5Qb3N0UmVxdWVzdEJvZHkoXCIvUmVzdC9CdWlsZGVyL1J1blRpbWUvRGF0YVNldFJ1bnRpbWUvR2V0RGF0YVNldERhdGFcIiwgc2VuZERhdGEsIGZ1bmN0aW9uIChnZXREYXRhU2V0UmVzdWx0KSB7XG4gICAgICBmdW5jLmNhbGwoc2VuZGVyLCBnZXREYXRhU2V0UmVzdWx0KTtcbiAgICB9LCBzZW5kZXIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRm9ybVJlbGF0aW9uUE9VdGlsaXR5ID0ge1xuICBfRmllbGRQT0NhY2hlOiBudWxsLFxuICBCdWlsZFJlY29yZDogZnVuY3Rpb24gQnVpbGRSZWNvcmQoZmllbGRQT0FycmF5LCBkZXNjKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFwiZGVzY1wiOiBkZXNjLFxuICAgICAgXCJyZWNvcmRGaWVsZFBPTGlzdFwiOiBmaWVsZFBPQXJyYXlcbiAgICB9O1xuICB9LFxuICBGaW5kUmVjb3JkRmllbGRQT0FycmF5OiBmdW5jdGlvbiBGaW5kUmVjb3JkRmllbGRQT0FycmF5KHJlY29yZCkge1xuICAgIHJldHVybiByZWNvcmQucmVjb3JkRmllbGRQT0xpc3Q7XG4gIH0sXG4gIEFkZDFUbzFEYXRhUmVjb3JkRmllbGRQT0xpc3Q6IGZ1bmN0aW9uIEFkZDFUbzFEYXRhUmVjb3JkRmllbGRQT0xpc3QocmVsYXRpb25QTywgZmllbGRQT0xpc3QpIHtcbiAgICByZWxhdGlvblBPLm9uZURhdGFSZWNvcmQgPSB0aGlzLkJ1aWxkUmVjb3JkKGZpZWxkUE9MaXN0LCBcIuS4gOWvueS4gOaVsOaNrlwiKTtcbiAgICByZXR1cm4gcmVsYXRpb25QTztcbiAgfSxcbiAgQWRkMVRvMURhdGFSZWNvcmQ6IGZ1bmN0aW9uIEFkZDFUbzFEYXRhUmVjb3JkKHJlbGF0aW9uUE8sIHJlY29yZFBPKSB7XG4gICAgcmVsYXRpb25QTy5vbmVEYXRhUmVjb3JkID0gcmVjb3JkUE87XG4gICAgcmV0dXJuIHJlbGF0aW9uUE87XG4gIH0sXG4gIEdldDFUbzFEYXRhUmVjb3JkOiBmdW5jdGlvbiBHZXQxVG8xRGF0YVJlY29yZChyZWxhdGlvblBPKSB7XG4gICAgcmV0dXJuIHJlbGF0aW9uUE8ub25lRGF0YVJlY29yZDtcbiAgfSxcbiAgR2V0MVRvMURhdGFSZWNvcmRGaWVsZFBPQXJyYXk6IGZ1bmN0aW9uIEdldDFUbzFEYXRhUmVjb3JkRmllbGRQT0FycmF5KHJlbGF0aW9uUE8pIHtcbiAgICBpZiAocmVsYXRpb25QTy5vbmVEYXRhUmVjb3JkKSB7XG4gICAgICByZXR1cm4gdGhpcy5GaW5kUmVjb3JkRmllbGRQT0FycmF5KHJlbGF0aW9uUE8ub25lRGF0YVJlY29yZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIEFkZDFUb05EYXRhUmVjb3JkOiBmdW5jdGlvbiBBZGQxVG9ORGF0YVJlY29yZChyZWxhdGlvblBPLCBhcnJheURhdGEpIHtcbiAgICByZWxhdGlvblBPLmxpc3REYXRhUmVjb3JkID0gYXJyYXlEYXRhO1xuICAgIHJldHVybiByZWxhdGlvblBPO1xuICB9LFxuICBHZXQxVG9ORGF0YVJlY29yZDogZnVuY3Rpb24gR2V0MVRvTkRhdGFSZWNvcmQocmVsYXRpb25QTykge1xuICAgIHJldHVybiByZWxhdGlvblBPLmxpc3REYXRhUmVjb3JkO1xuICB9LFxuICBGaW5kRmllbGRQT0luT25lRGF0YVJlY29yZDogZnVuY3Rpb24gRmluZEZpZWxkUE9Jbk9uZURhdGFSZWNvcmQob25lRGF0YVJlY29yZCwgZmllbGROYW1lKSB7XG4gICAgdmFyIGZpZWxkUE9BcnJheSA9IHRoaXMuRmluZFJlY29yZEZpZWxkUE9BcnJheShvbmVEYXRhUmVjb3JkKTtcbiAgICB2YXIgZmllbGRQTyA9IEFycmF5VXRpbGl0eS5XaGVyZVNpbmdsZShmaWVsZFBPQXJyYXksIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5maWVsZE5hbWUgPT0gZmllbGROYW1lO1xuICAgIH0pO1xuXG4gICAgaWYgKGZpZWxkUE8pIHtcbiAgICAgIHJldHVybiBmaWVsZFBPO1xuICAgIH1cblxuICAgIHRocm93IFwiRm9ybVJ1bnRpbWUuRmluZEZpZWxkUE9Jbk9uZURhdGFSZWNvcmQ65om+5LiN5Yiw5a2X5q61XCIgKyBmaWVsZE5hbWUgKyBcIueahOaVsOaNruWAvCFcIjtcbiAgfSxcbiAgRmluZEZpZWxkVmFsdWVJbk9uZURhdGFSZWNvcmQ6IGZ1bmN0aW9uIEZpbmRGaWVsZFZhbHVlSW5PbmVEYXRhUmVjb3JkKG9uZURhdGFSZWNvcmQsIGZpZWxkTmFtZSkge1xuICAgIHZhciByZWNvcmRGaWVsZFBPTGlzdCA9IHRoaXMuRmluZFJlY29yZEZpZWxkUE9BcnJheShvbmVEYXRhUmVjb3JkKTtcbiAgICB2YXIgZmllbGRQTyA9IEFycmF5VXRpbGl0eS5XaGVyZVNpbmdsZShyZWNvcmRGaWVsZFBPTGlzdCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLmZpZWxkTmFtZSA9PSBmaWVsZE5hbWU7XG4gICAgfSk7XG5cbiAgICBpZiAoZmllbGRQTykge1xuICAgICAgcmV0dXJuIGZpZWxkUE8udmFsdWU7XG4gICAgfVxuXG4gICAgdGhyb3cgXCJGb3JtUnVudGltZS5GaW5kRmllbGRQT0J5UmVsYXRpb25QTzrmib7kuI3liLDlrZfmrrVcIiArIGZpZWxkTmFtZSArIFwi55qE5pWw5o2u5YC8IVwiO1xuICB9LFxuICBGaW5kRmllbGRQT0luT25lRGF0YVJlY29yZEJ5SUQ6IGZ1bmN0aW9uIEZpbmRGaWVsZFBPSW5PbmVEYXRhUmVjb3JkQnlJRChvbmVEYXRhUmVjb3JkKSB7XG4gICAgcmV0dXJuIHRoaXMuRmluZEZpZWxkUE9Jbk9uZURhdGFSZWNvcmQob25lRGF0YVJlY29yZCwgXCJJRFwiKTtcbiAgfSxcbiAgRmluZEZpZWxkUE9CeVJlbGF0aW9uUE86IGZ1bmN0aW9uIEZpbmRGaWVsZFBPQnlSZWxhdGlvblBPKHJlbGF0aW9uUE8sIGZpZWxkTmFtZSkge1xuICAgIHZhciByZWNvcmRGaWVsZFBPTGlzdCA9IEZvcm1SZWxhdGlvblBPVXRpbGl0eS5HZXQxVG8xRGF0YVJlY29yZEZpZWxkUE9BcnJheShyZWxhdGlvblBPKTtcbiAgICB2YXIgZmllbGRQTyA9IEFycmF5VXRpbGl0eS5XaGVyZVNpbmdsZShyZWNvcmRGaWVsZFBPTGlzdCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLmZpZWxkTmFtZSA9PSBmaWVsZE5hbWU7XG4gICAgfSk7XG5cbiAgICBpZiAoZmllbGRQTykge1xuICAgICAgcmV0dXJuIGZpZWxkUE87XG4gICAgfVxuXG4gICAgdGhyb3cgXCJGb3JtUnVudGltZS5GaW5kRmllbGRQT0J5UmVsYXRpb25QTzrmib7kuI3liLDlrZfmrrVcIiArIGZpZWxkTmFtZSArIFwi55qE5pWw5o2u5YC8IVwiO1xuICB9LFxuICBGaW5kSWRGaWVsZFBPQnlSZWxhdGlvblBPOiBmdW5jdGlvbiBGaW5kSWRGaWVsZFBPQnlSZWxhdGlvblBPKHJlbGF0aW9uUE8pIHtcbiAgICByZXR1cm4gdGhpcy5GaW5kRmllbGRQT0J5UmVsYXRpb25QTyhyZWxhdGlvblBPLCBcIklEXCIpO1xuICB9LFxuICBGaW5kTWFpblJlbGF0aW9uUE86IGZ1bmN0aW9uIEZpbmRNYWluUmVsYXRpb25QTyhyZWxhdGlvblBPTGlzdCkge1xuICAgIHJldHVybiBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUocmVsYXRpb25QT0xpc3QsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5pc01haW4gPT0gdHJ1ZSB8fCBpdGVtLnBhcmVudElkID09IFwiLTFcIjtcbiAgICB9KTtcbiAgfSxcbiAgRmluZE5vdE1haW5SZWxhdGlvblBPOiBmdW5jdGlvbiBGaW5kTm90TWFpblJlbGF0aW9uUE8ocmVsYXRpb25QT0xpc3QpIHtcbiAgICByZXR1cm4gQXJyYXlVdGlsaXR5LldoZXJlKHJlbGF0aW9uUE9MaXN0LCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0uaXNNYWluICE9IHRydWUgfHwgaXRlbS5wYXJlbnRJZCAhPSBcIi0xXCI7XG4gICAgfSk7XG4gIH0sXG4gIEZpbmRSZWxhdGlvblBPQnlJZDogZnVuY3Rpb24gRmluZFJlbGF0aW9uUE9CeUlkKHJlbGF0aW9uUE9MaXN0LCBpZCkge1xuICAgIHJldHVybiBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUocmVsYXRpb25QT0xpc3QsIGZ1bmN0aW9uIChwbykge1xuICAgICAgcmV0dXJuIHBvLmlkID09IGlkO1xuICAgIH0pO1xuICB9LFxuICBGaW5kUmVsYXRpb25QT0J5VGFibGVOYW1lOiBmdW5jdGlvbiBGaW5kUmVsYXRpb25QT0J5VGFibGVOYW1lKHJlbGF0aW9uUE9MaXN0LCB0YWJsZU5hbWUpIHtcbiAgICByZXR1cm4gQXJyYXlVdGlsaXR5LldoZXJlU2luZ2xlKHJlbGF0aW9uUE9MaXN0LCBmdW5jdGlvbiAocG8pIHtcbiAgICAgIHJldHVybiBwby50YWJsZU5hbWUgPT0gdGFibGVOYW1lO1xuICAgIH0pO1xuICB9LFxuICBGaW5kUmVsYXRpb25QT0J5U2luZ2xlTmFtZTogZnVuY3Rpb24gRmluZFJlbGF0aW9uUE9CeVNpbmdsZU5hbWUocmVsYXRpb25QT0xpc3QsIHNpbmdsZU5hbWUpIHtcbiAgICByZXR1cm4gQXJyYXlVdGlsaXR5LldoZXJlU2luZ2xlKHJlbGF0aW9uUE9MaXN0LCBmdW5jdGlvbiAocG8pIHtcbiAgICAgIHJldHVybiBwby5zaW5nbGVOYW1lID09IHNpbmdsZU5hbWU7XG4gICAgfSk7XG4gIH0sXG4gIEZpbmRGaWVsZFBPSW5SZWxhdGlvbkZvcm1SZWNvcmRDb21wbGV4UG9PbmVEYXRhUmVjb3JkOiBmdW5jdGlvbiBGaW5kRmllbGRQT0luUmVsYXRpb25Gb3JtUmVjb3JkQ29tcGxleFBvT25lRGF0YVJlY29yZChyZWxhdGlvbkZvcm1SZWNvcmRDb21wbGV4UG8sIHJlbGF0aW9uSWQsIHRhYmxlTmFtZSwgZmllbGROYW1lKSB7XG4gICAgaWYgKHRoaXMuX0ZpZWxkUE9DYWNoZSA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9GaWVsZFBPQ2FjaGUgPSB7fTtcbiAgICAgIHZhciBmb3JtUmVjb3JkRGF0YVJlbGF0aW9uUE9MaXN0ID0gcmVsYXRpb25Gb3JtUmVjb3JkQ29tcGxleFBvLmZvcm1SZWNvcmREYXRhUmVsYXRpb25QT0xpc3Q7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZm9ybVJlY29yZERhdGFSZWxhdGlvblBPTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZm9ybVJlY29yZERhdGFSZWxhdGlvblBPID0gZm9ybVJlY29yZERhdGFSZWxhdGlvblBPTGlzdFtpXTtcbiAgICAgICAgdmFyIGlubmVyUmVsYXRpb25JZCA9IGZvcm1SZWNvcmREYXRhUmVsYXRpb25QTy5pZDtcbiAgICAgICAgdmFyIGZpZWxkUE9MaXN0ID0gdGhpcy5HZXQxVG8xRGF0YVJlY29yZEZpZWxkUE9BcnJheShmb3JtUmVjb3JkRGF0YVJlbGF0aW9uUE8pO1xuXG4gICAgICAgIGlmIChmaWVsZFBPTGlzdCkge1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZmllbGRQT0xpc3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHZhciBmaWVsZFBPID0gZmllbGRQT0xpc3Rbal07XG4gICAgICAgICAgICB2YXIgaW5uZXJGaWVsZE5hbWUgPSBmaWVsZFBPLmZpZWxkTmFtZTtcbiAgICAgICAgICAgIHRoaXMuX0ZpZWxkUE9DYWNoZVtpbm5lclJlbGF0aW9uSWQgKyBcIl9cIiArIGlubmVyRmllbGROYW1lXSA9IGZpZWxkUE87XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX0ZpZWxkUE9DYWNoZVtyZWxhdGlvbklkICsgXCJfXCIgKyBmaWVsZE5hbWVdO1xuICB9LFxuICBGaW5kUmVsYXRpb25QT0luUmVsYXRpb25Gb3JtUmVjb3JkQ29tcGxleFBvOiBmdW5jdGlvbiBGaW5kUmVsYXRpb25QT0luUmVsYXRpb25Gb3JtUmVjb3JkQ29tcGxleFBvKHJlbGF0aW9uRm9ybVJlY29yZENvbXBsZXhQbywgcmVsYXRpb25JZCkge1xuICAgIHJldHVybiBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUocmVsYXRpb25Gb3JtUmVjb3JkQ29tcGxleFBvLmZvcm1SZWNvcmREYXRhUmVsYXRpb25QT0xpc3QsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5pZCA9PSByZWxhdGlvbklkO1xuICAgIH0pO1xuICB9LFxuICBGaW5kQ2hpbGRSZWxhdGlvblBPTGlzdDogZnVuY3Rpb24gRmluZENoaWxkUmVsYXRpb25QT0xpc3QocmVsYXRpb25QT0xpc3QsIHBhcmVudFJlbGF0aW9uUE8pIHtcbiAgICByZXR1cm4gQXJyYXlVdGlsaXR5LldoZXJlKHJlbGF0aW9uUE9MaXN0LCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0ucGFyZW50SWQgPSBwYXJlbnRSZWxhdGlvblBPLmlkO1xuICAgIH0pO1xuICB9LFxuICBIYXNDaGlsZFJlbGF0aW9uUE86IGZ1bmN0aW9uIEhhc0NoaWxkUmVsYXRpb25QTyhyZWxhdGlvblBPTGlzdCwgcGFyZW50UE9JZCkge1xuICAgIHJldHVybiBBcnJheVV0aWxpdHkuRXhpc3QocmVsYXRpb25QT0xpc3QsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5wYXJlbnRJZCA9PSBwYXJlbnRQT0lkO1xuICAgIH0pO1xuICB9LFxuICBDcmVhdGVGaWVsZEluT25lRGF0YVJlY29yZDogZnVuY3Rpb24gQ3JlYXRlRmllbGRJbk9uZURhdGFSZWNvcmQocmVjb3JkRmllbGRQT0FycmF5LCBmaWVsZE5hbWUsIGZpZWxkVmFsdWUpIHtcbiAgICB2YXIgZmllbGRQTyA9IEpzb25VdGlsaXR5LkNsb25lU2ltcGxlKHJlY29yZEZpZWxkUE9BcnJheVswXSk7XG4gICAgZmllbGRQTy5maWVsZE5hbWUgPSBmaWVsZE5hbWU7XG4gICAgZmllbGRQTy52YWx1ZSA9IGZpZWxkVmFsdWU7XG4gICAgcmVjb3JkRmllbGRQT0FycmF5LnB1c2goZmllbGRQTyk7XG4gIH0sXG4gIENyZWF0ZUlkRmllbGRJbk9uZURhdGFSZWNvcmQ6IGZ1bmN0aW9uIENyZWF0ZUlkRmllbGRJbk9uZURhdGFSZWNvcmQocmVjb3JkRmllbGRQT0FycmF5LCBpZFZhbHVlKSB7XG4gICAgaWYgKCFpZFZhbHVlKSB7XG4gICAgICBpZFZhbHVlID0gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgfVxuXG4gICAgdGhpcy5DcmVhdGVGaWVsZEluT25lRGF0YVJlY29yZChyZWNvcmRGaWVsZFBPQXJyYXksIFwiSURcIiwgaWRWYWx1ZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBGb3JtUnVudGltZSA9IHtcbiAgT3BlcmF0aW9uQWRkOiBcImFkZFwiLFxuICBPcGVyYXRpb25VcGRhdGU6IFwidXBkYXRlXCIsXG4gIE9wZXJhdGlvblZpZXc6IFwidmlld1wiLFxuICBPcGVyYXRpb25EZWw6IFwiZGVsXCIsXG4gIF9Qcm9wX1N0YXR1czogXCJFZGl0XCIsXG4gIF9Qcm9wX0NvbmZpZzoge1xuICAgIFJlbmRlcmVyVG9JZDogbnVsbCxcbiAgICBGb3JtSWQ6IFwiXCIsXG4gICAgUmVjb3JkSWQ6IFwiXCIsXG4gICAgQnV0dG9uSWQ6IFwiXCIsXG4gICAgSXNQcmV2aWV3OiBmYWxzZSxcbiAgICBPcGVyYXRpb25UeXBlOiBcIlwiXG4gIH0sXG4gIF8kUmVuZGVyZXJUb0VsZW06IG51bGwsXG4gIF9Gb3JtUE86IG51bGwsXG4gIF9Gb3JtRGF0YVJlbGF0aW9uTGlzdDogbnVsbCxcbiAgX1JlbGF0aW9uUE9XaXRoRHluYW1pY0NvbnRhaW5lckNvbnRyb2w6IHt9LFxuICBJbml0aWFsaXphdGlvbjogZnVuY3Rpb24gSW5pdGlhbGl6YXRpb24oX2NvbmZpZykge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuX1Byb3BfQ29uZmlnLCBfY29uZmlnKTtcbiAgICB0aGlzLl8kUmVuZGVyZXJUb0VsZW0gPSAkKFwiI1wiICsgdGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUb0lkKTtcblxuICAgIHRoaXMuX0xvYWRIVE1MVG9FbCgpO1xuICB9LFxuICBfUmVuZGVyZXJDaGFpbklzQ29tcGxldGVkOiB0cnVlLFxuICBfUmVuZGVyZXJEYXRhQ2hhaW5Jc0NvbXBsZXRlZDogdHJ1ZSxcbiAgX0xvYWRIVE1MVG9FbDogZnVuY3Rpb24gX0xvYWRIVE1MVG9FbCgpIHtcbiAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24oXCIvUmVzdC9CdWlsZGVyL1J1blRpbWUvRm9ybVJ1bnRpbWUvTG9hZEhUTUxcIiwge30pO1xuXG4gICAgaWYgKHRoaXMuX1Byb3BfQ29uZmlnLklzUHJldmlldykge1xuICAgICAgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24oXCIvUmVzdC9CdWlsZGVyL1J1blRpbWUvRm9ybVJ1bnRpbWUvTG9hZEhUTUxGb3JQcmVWaWV3XCIsIHt9KTtcbiAgICB9XG5cbiAgICBSdW50aW1lR2VuZXJhbEluc3RhbmNlLkxvYWRIdG1sRGVzaWduQ29udGVudCh1cmwsIHRoaXMuX1Byb3BfQ29uZmlnLlJlbmRlcmVyVG8sIHtcbiAgICAgIGZvcm1JZDogdGhpcy5fUHJvcF9Db25maWcuRm9ybUlkLFxuICAgICAgcmVjb3JkSWQ6IHRoaXMuX1Byb3BfQ29uZmlnLlJlY29yZElkLFxuICAgICAgYnV0dG9uSWQ6IHRoaXMuX1Byb3BfQ29uZmlnLkJ1dHRvbklkXG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgdGhpcy5fRm9ybVBPID0gcmVzdWx0LmRhdGE7XG4gICAgICB0aGlzLl9Gb3JtRGF0YVJlbGF0aW9uTGlzdCA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbih0aGlzLl9Gb3JtUE8uZm9ybURhdGFSZWxhdGlvbik7XG5cbiAgICAgIHRoaXMuXyRSZW5kZXJlclRvRWxlbS5hcHBlbmQocmVzdWx0LmRhdGEuZm9ybUh0bWxSdW50aW1lKTtcblxuICAgICAgVmlydHVhbEJvZHlDb250cm9sLlJlbmRlcmVyQ2hhaW4oe1xuICAgICAgICBwbzogcmVzdWx0LmRhdGEsXG4gICAgICAgIHNvdXJjZUhUTUw6IHJlc3VsdC5kYXRhLmZvcm1IdG1sUnVudGltZSxcbiAgICAgICAgJHJvb3RFbGVtOiB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sXG4gICAgICAgICRwYXJlbnRDb250cm9sRWxlbTogdGhpcy5fJFJlbmRlcmVyVG9FbGVtLFxuICAgICAgICAkc2luZ2xlQ29udHJvbEVsZW06IHRoaXMuXyRSZW5kZXJlclRvRWxlbSxcbiAgICAgICAgZm9ybVJ1bnRpbWVJbnN0YW5jZTogdGhpc1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLklzUHJldmlldygpKSB7XG4gICAgICAgIHRoaXMuQ2FsbFJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBSdW50aW1lR2VuZXJhbEluc3RhbmNlLkxvYWRJbm5lckZvcm1CdXR0b24odGhpcy5fUHJvcF9Db25maWcuQnV0dG9uSWQsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgICAgIGlmIChyZXN1bHQuZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5DcmVhdGVBTExJbm5lckZvcm1CdXR0b24ocmVzdWx0LmRhdGEpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuQ2FsbFJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9LFxuICBDYWxsUmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmM6IGZ1bmN0aW9uIENhbGxSZW5kZXJlckNoYWluQ29tcGxldGVkRnVuYygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX1Byb3BfQ29uZmlnLlJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmMuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH0sXG4gIElzUHJldmlldzogZnVuY3Rpb24gSXNQcmV2aWV3KCkge1xuICAgIHJldHVybiB0aGlzLl9Qcm9wX0NvbmZpZy5Jc1ByZXZpZXc7XG4gIH0sXG4gIEdldE9yaWdpbmFsRm9ybURhdGFSZWxhdGlvbjogZnVuY3Rpb24gR2V0T3JpZ2luYWxGb3JtRGF0YVJlbGF0aW9uKCkge1xuICAgIHJldHVybiBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24odGhpcy5fRm9ybVBPLmZvcm1EYXRhUmVsYXRpb24pO1xuICB9LFxuICBTZXJpYWxpemF0aW9uRm9ybURhdGE6IGZ1bmN0aW9uIFNlcmlhbGl6YXRpb25Gb3JtRGF0YSgpIHtcbiAgICB2YXIgZm9ybVJlY29yZENvbXBsZXhQbyA9IHtcbiAgICAgIHJlY29yZElkOiB0aGlzLl9Qcm9wX0NvbmZpZy5SZWNvcmRJZCxcbiAgICAgIGZvcm1JZDogdGhpcy5fUHJvcF9Db25maWcuRm9ybUlkLFxuICAgICAgYnV0dG9uSWQ6IHRoaXMuX1Byb3BfQ29uZmlnLkJ1dHRvbklkLFxuICAgICAgZm9ybVJlY29yZERhdGFSZWxhdGlvblBPTGlzdDogbnVsbCxcbiAgICAgIGV4RGF0YTogbnVsbFxuICAgIH07XG4gICAgdmFyIG9yaWdpbmFsRm9ybURhdGFSZWxhdGlvbiA9IHRoaXMuR2V0T3JpZ2luYWxGb3JtRGF0YVJlbGF0aW9uKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9yaWdpbmFsRm9ybURhdGFSZWxhdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNpbmdsZVJlbGF0aW9uID0gb3JpZ2luYWxGb3JtRGF0YVJlbGF0aW9uW2ldO1xuICAgICAgdmFyIHJlbGF0aW9uU2luZ2xlTmFtZSA9IHNpbmdsZVJlbGF0aW9uLnNpbmdsZU5hbWU7XG4gICAgICB2YXIgdGFibGVOYW1lID0gc2luZ2xlUmVsYXRpb24udGFibGVOYW1lO1xuICAgICAgdmFyIGlzTWFpbiA9IHNpbmdsZVJlbGF0aW9uLnBhcmVudElkID09IFwiLTFcIjtcbiAgICAgIHNpbmdsZVJlbGF0aW9uLmlzTWFpbiA9IGlzTWFpbjtcblxuICAgICAgaWYgKGlzTWFpbikge1xuICAgICAgICBzaW5nbGVSZWxhdGlvbi5yZWxhdGlvblR5cGUgPSBcIjFUbzFcIjtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlbGF0aW9uVHlwZSA9IHNpbmdsZVJlbGF0aW9uLnJlbGF0aW9uVHlwZTtcblxuICAgICAgaWYgKHJlbGF0aW9uVHlwZSA9PSBcIjFUbzFcIikge1xuICAgICAgICB2YXIgY29udHJvbHMgPSAkKFwiW3RhYmxlbmFtZT0nXCIgKyB0YWJsZU5hbWUgKyBcIiddW3NlcmlhbGl6ZT0ndHJ1ZSddXCIpLm5vdCgkKFwiW2NvbnRyb2xfY2F0ZWdvcnk9J0R5bmFtaWNDb250YWluZXInXVwiKS5maW5kKFwiW2pidWlsZDRkY19jdXN0b209J3RydWUnXVwiKSk7XG4gICAgICAgIHZhciBvbmVSb3dSZWNvcmQgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbnRyb2xzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgdmFyICRjb250cm9sRWxlbSA9ICQoY29udHJvbHNbal0pO1xuICAgICAgICAgIHZhciBmaWVsZFRyYW5zZmVyUE8gPSBIVE1MQ29udHJvbC5UcnlHZXRGaWVsZFRyYW5zZmVyUE8oJGNvbnRyb2xFbGVtLCBzaW5nbGVSZWxhdGlvbi5pZCwgcmVsYXRpb25TaW5nbGVOYW1lLCByZWxhdGlvblR5cGUpO1xuICAgICAgICAgIG9uZVJvd1JlY29yZC5wdXNoKGZpZWxkVHJhbnNmZXJQTyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNNYWluKSB7XG4gICAgICAgICAgRm9ybVJlbGF0aW9uUE9VdGlsaXR5LkNyZWF0ZUlkRmllbGRJbk9uZURhdGFSZWNvcmQob25lUm93UmVjb3JkLCBmb3JtUmVjb3JkQ29tcGxleFBvLnJlY29yZElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIEZvcm1SZWxhdGlvblBPVXRpbGl0eS5BZGQxVG8xRGF0YVJlY29yZEZpZWxkUE9MaXN0KHNpbmdsZVJlbGF0aW9uLCBvbmVSb3dSZWNvcmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGNvbnRyb2wgPSAkKFwiW3NlcmlhbGl6ZT0ndHJ1ZSddW2NvbnRyb2xfY2F0ZWdvcnk9J0R5bmFtaWNDb250YWluZXInXVtyZWxhdGlvbl9wb19pZD0nXCIgKyBzaW5nbGVSZWxhdGlvbi5pZCArIFwiJ11cIik7XG5cbiAgICAgICAgaWYgKGNvbnRyb2wubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHZhciBjb250cm9sSW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sSW5zdGFuY2VCeUVsZW0oY29udHJvbCk7XG4gICAgICAgICAgY29udHJvbEluc3RhbmNlLlNlcmlhbGl6YXRpb25WYWx1ZShvcmlnaW5hbEZvcm1EYXRhUmVsYXRpb24sIHNpbmdsZVJlbGF0aW9uLCBjb250cm9sKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvcm1SZWNvcmRDb21wbGV4UG8uZm9ybVJlY29yZERhdGFSZWxhdGlvblBPTGlzdCA9IG9yaWdpbmFsRm9ybURhdGFSZWxhdGlvbjtcbiAgICByZXR1cm4gZm9ybVJlY29yZENvbXBsZXhQbztcbiAgfSxcbiAgRGVTZXJpYWxpemF0aW9uRm9ybURhdGE6IGZ1bmN0aW9uIERlU2VyaWFsaXphdGlvbkZvcm1EYXRhKHJlbGF0aW9uRm9ybVJlY29yZENvbXBsZXhQbykge1xuICAgIFZpcnR1YWxCb2R5Q29udHJvbC5SZW5kZXJlckRhdGFDaGFpbih7XG4gICAgICAkcm9vdEVsZW06IHRoaXMuXyRSZW5kZXJlclRvRWxlbSxcbiAgICAgICRwYXJlbnRDb250cm9sRWxlbTogdGhpcy5fJFJlbmRlcmVyVG9FbGVtLFxuICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtOiB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sXG4gICAgICBmb3JtUnVudGltZUluc3RhbmNlOiB0aGlzLFxuICAgICAgcmVsYXRpb25Gb3JtUmVjb3JkQ29tcGxleFBvOiByZWxhdGlvbkZvcm1SZWNvcmRDb21wbGV4UG9cbiAgICB9KTtcbiAgfSxcbiAgQ3JlYXRlQUxMSW5uZXJGb3JtQnV0dG9uOiBmdW5jdGlvbiBDcmVhdGVBTExJbm5lckZvcm1CdXR0b24obGlzdEJ1dHRvblBPKSB7XG4gICAgaWYgKCFTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkobGlzdEJ1dHRvblBPLmJ1dHRvbklubmVyQ29uZmlnKSkge1xuICAgICAgdmFyIGJ1dHRvbklubmVyQ29uZmlnID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKGxpc3RCdXR0b25QTy5idXR0b25Jbm5lckNvbmZpZyk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnV0dG9uSW5uZXJDb25maWcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGlubmVyQnV0dG9uQ29uZmlnID0gYnV0dG9uSW5uZXJDb25maWdbaV07XG4gICAgICAgIHZhciBidXR0b25FbGVtID0gSW5uZXJGb3JtQnV0dG9uUnVudGltZS5SZW5kZXJlclNpbmdsZUlubmVyRm9ybUJ1dHRvbihpbm5lckJ1dHRvbkNvbmZpZywgdGhpcywgbGlzdEJ1dHRvblBPKTtcbiAgICAgICAgJChcIiNpbm5lckJ1dHRvbldyYXBPdXRlclwiKS5hcHBlbmQoYnV0dG9uRWxlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xudmFyIEZvcm1SdW50aW1lTW9jayA9IHtcbiAgR2V0TW9ja0RhdGE6IGZ1bmN0aW9uIEdldE1vY2tEYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBcInJlY29yZElkXCI6IFwiXCIsXG4gICAgICBcImZvcm1JZFwiOiBcIjM0ZGIwZDZmLTc5NzgtNGFjZi04YTQ1LTEzYTZlZTVmNjNlMlwiLFxuICAgICAgXCJidXR0b25JZFwiOiBcIlwiLFxuICAgICAgXCJmb3JtUmVjb3JkRGF0YVJlbGF0aW9uUE9MaXN0XCI6IFt7XG4gICAgICAgIFwiaWRcIjogXCJkOWJjOTMzMi0zYzk0LTI4YmItMWMxMS0wNDk3NjRjNjllYjVcIixcbiAgICAgICAgXCJwYXJlbnRJZFwiOiBcIi0xXCIsXG4gICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICBcInBrRmllbGROYW1lXCI6IFwiXCIsXG4gICAgICAgIFwiZGVzY1wiOiBcIlwiLFxuICAgICAgICBcInNlbGZLZXlGaWVsZE5hbWVcIjogXCJcIixcbiAgICAgICAgXCJvdXRlcktleUZpZWxkTmFtZVwiOiBcIlwiLFxuICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUbzFcIixcbiAgICAgICAgXCJpc1NhdmVcIjogXCJ0cnVlXCIsXG4gICAgICAgIFwiY29uZGl0aW9uXCI6IFwiXCIsXG4gICAgICAgIFwidGFibGVJZFwiOiBcIlRERVZfVEVTVF8xXCIsXG4gICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzFcIixcbiAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCLlvIDlj5HmtYvor5XooagxXCIsXG4gICAgICAgIFwidGFibGVDb2RlXCI6IFwiVF8xMDQzN1wiLFxuICAgICAgICBcImRpc3BsYXlUZXh0XCI6IFwiVERFVl9URVNUXzFb5byA5Y+R5rWL6K+V6KGoMV1cIixcbiAgICAgICAgXCJpY29uXCI6IFwiLi4vLi4vLi4vVGhlbWVzL1BuZzE2WDE2L3RhYmxlLnBuZ1wiLFxuICAgICAgICBcImlzTWFpblwiOiB0cnVlLFxuICAgICAgICBcIm9uZURhdGFSZWNvcmRcIjoge1xuICAgICAgICAgIFwiZGVzY1wiOiBcIuS4gOWvueS4gOaVsOaNrlwiLFxuICAgICAgICAgIFwicmVjb3JkRmllbGRQT0xpc3RcIjogW3tcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImQ5YmM5MzMyLTNjOTQtMjhiYi0xYzExLTA0OTc2NGM2OWViNVwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvMVwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfMVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCLlvIDlj5HmtYvor5XooagxXCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJUREVWX1RFU1RfMVwiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiRl9USVRMRVwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0Xzg5Nzk0OTI5NVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIua1i+ivlVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIua1i+ivlTE1XCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJkOWJjOTMzMi0zYzk0LTI4YmItMWMxMS0wNDk3NjRjNjllYjVcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUbzFcIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHREYXRlVGltZVwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfMVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCLlvIDlj5HmtYvor5XooagxXCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJUREVWX1RFU1RfMVwiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiRl9QVUJMSUNfVElNRVwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5pel5pyf5pe26Ze0XCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfZHRfMzc1MTg2ODkxXCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiRW52VmFyXCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIkVOVl9EQVRFVElNRV9ZWVlZX01NX0REXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiMjAxOS0xMC0zMVwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZDliYzkzMzItM2M5NC0yOGJiLTFjMTEtMDQ5NzY0YzY5ZWI1XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG8xXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9Ecm9wRG93blNlbGVjdFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfMVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCLlvIDlj5HmtYvor5XooagxXCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJUREVWX1RFU1RfMVwiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiRl9QVUJMSUNfU1RBVFVTXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiNTBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInNlbF8yNDY0MTA2ODhcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiNFwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZDliYzkzMzItM2M5NC0yOGJiLTFjMTEtMDQ5NzY0YzY5ZWI1XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG8xXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF8xXCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIuW8gOWPkea1i+ivleihqDFcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcIlRERVZfVEVTVF8xXCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJGX09SR0FOX0lEXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiNTBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF84OTc5MDk3NTVcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJFbnZWYXJcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiRU5WX1NZU1RFTV9DVVJSRU5UX1VTRVJfT1JHQU5fSURcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCIxMDAwMVwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZDliYzkzMzItM2M5NC0yOGJiLTFjMTEtMDQ5NzY0YzY5ZWI1XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG8xXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF8xXCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIuW8gOWPkea1i+ivleihqDFcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcIlRERVZfVEVTVF8xXCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJJRFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0Xzg5Nzk0OTI5NVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIua1i+ivlVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjBkNTYxYzBlLWI4M2ItYTlmZi1jODhhLTY1MmQ0YTRhYTI1NlwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfV1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBcImlkXCI6IFwiMmQ3ZGVmNzUtMTQzOC03NjE0LWFmN2QtNjBjZTA2NTBlYmE2XCIsXG4gICAgICAgIFwicGFyZW50SWRcIjogXCJkOWJjOTMzMi0zYzk0LTI4YmItMWMxMS0wNDk3NjRjNjllYjVcIixcbiAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgIFwicGtGaWVsZE5hbWVcIjogXCJcIixcbiAgICAgICAgXCJkZXNjXCI6IFwiXCIsXG4gICAgICAgIFwic2VsZktleUZpZWxkTmFtZVwiOiBcIlwiLFxuICAgICAgICBcIm91dGVyS2V5RmllbGROYW1lXCI6IFwiXCIsXG4gICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICBcImlzU2F2ZVwiOiBcInRydWVcIixcbiAgICAgICAgXCJjb25kaXRpb25cIjogXCJcIixcbiAgICAgICAgXCJ0YWJsZUlkXCI6IFwiVERFVl9URVNUXzJcIixcbiAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfMlwiLFxuICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIuW8gOWPkea1i+ivleihqDJcIixcbiAgICAgICAgXCJ0YWJsZUNvZGVcIjogXCJUXzEwNDM4XCIsXG4gICAgICAgIFwiZGlzcGxheVRleHRcIjogXCJUREVWX1RFU1RfMlvlvIDlj5HmtYvor5XooagyXSgxVG9OKVwiLFxuICAgICAgICBcImljb25cIjogXCIuLi8uLi8uLi9UaGVtZXMvUG5nMTZYMTYvdGFibGUucG5nXCIsXG4gICAgICAgIFwiaXNNYWluXCI6IGZhbHNlLFxuICAgICAgICBcImxpc3REYXRhUmVjb3JkXCI6IFt7XG4gICAgICAgICAgXCJkZXNjXCI6IFwi5LiA5a+55LiA5pWw5o2uXCIsXG4gICAgICAgICAgXCJyZWNvcmRGaWVsZFBPTGlzdFwiOiBbe1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiMTllNWY0ZWEtNGZiYS00ZjRiLTBkM2ItOGI2ZjU2ZGRlZGExXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG8xXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF8yXCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIuW8gOWPkea1i+ivleihqDJcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcIlRERVZfVEVTVF8yXCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJGX1RJVExFXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjAwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfNjk4MDM1MDgyXCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcIjE5ZTVmNGVhLTRmYmEtNGY0Yi0wZDNiLThiNmY1NmRkZWRhMVwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvMVwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dERhdGVUaW1lXCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF8yXCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIuW8gOWPkea1i+ivleihqDJcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcIlRERVZfVEVTVF8yXCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJGX1BVQkxJQ19USU1FXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLml6XmnJ/ml7bpl7RcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF9kdF82OTgwNjAyODFcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJFbnZWYXJcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiRU5WX0RBVEVUSU1FX1lZWVlfTU1fRERcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCIyMDE5LTEwLTMwXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCIxOWU1ZjRlYS00ZmJhLTRmNGItMGQzYi04YjZmNTZkZGVkYTFcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUbzFcIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHRCb3hcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzJcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwi5byA5Y+R5rWL6K+V6KGoMlwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiVERFVl9URVNUXzJcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIklEXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjAwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfNjk4MDM1MDgyXCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImYxODcwNmI5LWM4YTUtOTNjYi04YmUwLWY3ZmNhMmQ3NzcwMlwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfV1cbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiZGVzY1wiOiBcIuS4gOWvueS4gOaVsOaNrlwiLFxuICAgICAgICAgIFwicmVjb3JkRmllbGRQT0xpc3RcIjogW3tcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcIjE5ZTVmNGVhLTRmYmEtNGY0Yi0wZDNiLThiNmY1NmRkZWRhMVwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvMVwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfMlwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCLlvIDlj5HmtYvor5XooagyXCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJUREVWX1RFU1RfMlwiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiRl9USVRMRVwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0XzY5ODAzNTA4MlwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCIyXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCIxOWU1ZjRlYS00ZmJhLTRmNGItMGQzYi04YjZmNTZkZGVkYTFcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUbzFcIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHREYXRlVGltZVwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfMlwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCLlvIDlj5HmtYvor5XooagyXCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJUREVWX1RFU1RfMlwiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiRl9QVUJMSUNfVElNRVwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5pel5pyf5pe26Ze0XCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfZHRfNjk4MDYwMjgxXCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiRW52VmFyXCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIkVOVl9EQVRFVElNRV9ZWVlZX01NX0REXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiMjAxOS0xMC0zMFwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiMTllNWY0ZWEtNGZiYS00ZjRiLTBkM2ItOGI2ZjU2ZGRlZGExXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG8xXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF8yXCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIuW8gOWPkea1i+ivleihqDJcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcIlRERVZfVEVTVF8yXCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJJRFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0XzY5ODAzNTA4MlwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJlNjg4MTc3OS1lY2QyLTgzNDUtMDNmMS03YzhlZjA2NWRjY2JcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH1dXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImRlc2NcIjogXCLkuIDlr7nkuIDmlbDmja5cIixcbiAgICAgICAgICBcInJlY29yZEZpZWxkUE9MaXN0XCI6IFt7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCIxOWU1ZjRlYS00ZmJhLTRmNGItMGQzYi04YjZmNTZkZGVkYTFcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUbzFcIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHRCb3hcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzJcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwi5byA5Y+R5rWL6K+V6KGoMlwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiVERFVl9URVNUXzJcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIkZfVElUTEVcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuWtl+espuS4slwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMDBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF82OTgwMzUwODJcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJDb25zdFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCIxXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiM1wiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiMTllNWY0ZWEtNGZiYS00ZjRiLTBkM2ItOGI2ZjU2ZGRlZGExXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG8xXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0RGF0ZVRpbWVcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzJcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwi5byA5Y+R5rWL6K+V6KGoMlwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiVERFVl9URVNUXzJcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIkZfUFVCTElDX1RJTUVcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuaXpeacn+aXtumXtFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0X2R0XzY5ODA2MDI4MVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkVudlZhclwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCJFTlZfREFURVRJTUVfWVlZWV9NTV9ERFwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjIwMTktMTAtMzBcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcIjE5ZTVmNGVhLTRmYmEtNGY0Yi0wZDNiLThiNmY1NmRkZWRhMVwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvMVwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfMlwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCLlvIDlj5HmtYvor5XooagyXCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJUREVWX1RFU1RfMlwiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiSURcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuWtl+espuS4slwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMDBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF82OTgwMzUwODJcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJDb25zdFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCIxXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZDlmZTJmMTAtZTVlYi1mNTlhLTU4ZWUtNzg3ZmRjZTc1MWYxXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9XVxuICAgICAgICB9XVxuICAgICAgfSwge1xuICAgICAgICBcImlkXCI6IFwiNDMxMzM2NmItY2FhMC00MjcyLTI2OTAtMTIzNzc1MDY1MWY2XCIsXG4gICAgICAgIFwicGFyZW50SWRcIjogXCIyZDdkZWY3NS0xNDM4LTc2MTQtYWY3ZC02MGNlMDY1MGViYTZcIixcbiAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgIFwicGtGaWVsZE5hbWVcIjogXCJcIixcbiAgICAgICAgXCJkZXNjXCI6IFwiXCIsXG4gICAgICAgIFwic2VsZktleUZpZWxkTmFtZVwiOiBcIlRERVZfVEVTVF8yX0lEXCIsXG4gICAgICAgIFwib3V0ZXJLZXlGaWVsZE5hbWVcIjogXCJJRFwiLFxuICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgXCJpc1NhdmVcIjogXCJ0cnVlXCIsXG4gICAgICAgIFwiY29uZGl0aW9uXCI6IFwiXCIsXG4gICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgXCJ0YWJsZUNvZGVcIjogXCJUXzEwODcxXCIsXG4gICAgICAgIFwiZGlzcGxheVRleHRcIjogXCJUREVWX1RFU1RfNVtUREVWX1RFU1RfNV0oMVRvTilcIixcbiAgICAgICAgXCJpY29uXCI6IFwiLi4vLi4vLi4vVGhlbWVzL1BuZzE2WDE2L3RhYmxlLnBuZ1wiLFxuICAgICAgICBcImxpc3REYXRhUmVjb3JkXCI6IFt7XG4gICAgICAgICAgXCJkZXNjXCI6IFwi5LiA5a+55LiA5pWw5o2uXCIsXG4gICAgICAgICAgXCJyZWNvcmRGaWVsZFBPTGlzdFwiOiBbe1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIkZfVElUTEVcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuWtl+espuS4slwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMDBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF83Njg2NTk2ODVcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJDb25zdFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCIxXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0RGF0ZVRpbWVcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiRl9QVUJMSUNfVElNRVwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5pel5pyf5pe26Ze0XCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfZHRfNzY4NzI5MzE3XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiRW52VmFyXCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIkVOVl9EQVRFVElNRV9ZWVlZX01NX0REX0hIX01NX1NTXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiMjAxOS0xMC0zMCAyMDo1OTozMlwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIklEXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjAwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfNzY4NjU5Njg1XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjhiZTY3MDg2LTNmMmUtOWViNy03YjlkLWY1MzUwZGI5ZGU5MlwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIlRERVZfVEVTVF8yX0lEXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjAwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfNzY4NjU5Njg1XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImYxODcwNmI5LWM4YTUtOTNjYi04YmUwLWY3ZmNhMmQ3NzcwMlwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfV1cbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiZGVzY1wiOiBcIuS4gOWvueS4gOaVsOaNrlwiLFxuICAgICAgICAgIFwicmVjb3JkRmllbGRQT0xpc3RcIjogW3tcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJGX1RJVExFXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjAwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfNzY4NjU5Njg1XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjExXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHREYXRlVGltZVwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJGX1BVQkxJQ19USU1FXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLml6XmnJ/ml7bpl7RcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF9kdF83Njg3MjkzMTdcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJFbnZWYXJcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiRU5WX0RBVEVUSU1FX1lZWVlfTU1fRERfSEhfTU1fU1NcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCIyMDE5LTEwLTMwIDIwOjU5OjMyXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHRCb3hcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiSURcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuWtl+espuS4slwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMDBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF83Njg2NTk2ODVcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJDb25zdFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCIxXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiM2E0ZjUxMmYtNWZkNS0yZDhmLTk4YTAtNmU4YWEwMTc4OTk5XCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHRCb3hcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiVERFVl9URVNUXzJfSURcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuWtl+espuS4slwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMDBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF83Njg2NTk2ODVcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJDb25zdFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCIxXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZjE4NzA2YjktYzhhNS05M2NiLThiZTAtZjdmY2EyZDc3NzAyXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9XVxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJkZXNjXCI6IFwi5LiA5a+55LiA5pWw5o2uXCIsXG4gICAgICAgICAgXCJyZWNvcmRGaWVsZFBPTGlzdFwiOiBbe1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIkZfVElUTEVcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuWtl+espuS4slwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMDBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF83Njg2NTk2ODVcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJDb25zdFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCIxXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiMTExXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHREYXRlVGltZVwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJGX1BVQkxJQ19USU1FXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLml6XmnJ/ml7bpl7RcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF9kdF83Njg3MjkzMTdcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJFbnZWYXJcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiRU5WX0RBVEVUSU1FX1lZWVlfTU1fRERfSEhfTU1fU1NcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCIyMDE5LTEwLTMwIDIwOjU5OjMyXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHRCb3hcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiSURcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuWtl+espuS4slwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMDBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF83Njg2NTk2ODVcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJDb25zdFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCIxXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiODViZTljYjUtNDhiYy1lYzAxLTZmMGMtN2E2MzQ5MzRmMjVlXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHRCb3hcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiVERFVl9URVNUXzJfSURcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuWtl+espuS4slwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMDBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF83Njg2NTk2ODVcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJDb25zdFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCIxXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZjE4NzA2YjktYzhhNS05M2NiLThiZTAtZjdmY2EyZDc3NzAyXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9XVxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJkZXNjXCI6IFwi5LiA5a+55LiA5pWw5o2uXCIsXG4gICAgICAgICAgXCJyZWNvcmRGaWVsZFBPTGlzdFwiOiBbe1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIkZfVElUTEVcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuWtl+espuS4slwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMDBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF83Njg2NTk2ODVcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJDb25zdFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCIxXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiMTExMVwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0RGF0ZVRpbWVcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiRl9QVUJMSUNfVElNRVwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5pel5pyf5pe26Ze0XCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfZHRfNzY4NzI5MzE3XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiRW52VmFyXCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIkVOVl9EQVRFVElNRV9ZWVlZX01NX0REX0hIX01NX1NTXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiMjAxOS0xMC0zMCAyMDo1OTozMlwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIklEXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjAwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfNzY4NjU5Njg1XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjhiZDliNzBiLTdhMDMtNWNiZC04NjNmLWJmOTk0NjEyNjQ3YlwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIlRERVZfVEVTVF8yX0lEXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjAwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfNzY4NjU5Njg1XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImYxODcwNmI5LWM4YTUtOTNjYi04YmUwLWY3ZmNhMmQ3NzcwMlwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfV1cbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiZGVzY1wiOiBcIuS4gOWvueS4gOaVsOaNrlwiLFxuICAgICAgICAgIFwicmVjb3JkRmllbGRQT0xpc3RcIjogW3tcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJGX1RJVExFXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjAwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfNzY4NjU5Njg1XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjJcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dERhdGVUaW1lXCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIkZfUFVCTElDX1RJTUVcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuaXpeacn+aXtumXtFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0X2R0Xzc2ODcyOTMxN1wiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkVudlZhclwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCJFTlZfREFURVRJTUVfWVlZWV9NTV9ERF9ISF9NTV9TU1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjIwMTktMTAtMzAgMjA6NTk6NDlcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJJRFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0Xzc2ODY1OTY4NVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJkYmY0NmIxMy0zMjg1LTU4OTEtYWM1MC1lZDc4M2I4ZmJjZGFcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJUREVWX1RFU1RfMl9JRFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0Xzc2ODY1OTY4NVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJlNjg4MTc3OS1lY2QyLTgzNDUtMDNmMS03YzhlZjA2NWRjY2JcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH1dXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImRlc2NcIjogXCLkuIDlr7nkuIDmlbDmja5cIixcbiAgICAgICAgICBcInJlY29yZEZpZWxkUE9MaXN0XCI6IFt7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHRCb3hcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiRl9USVRMRVwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0Xzc2ODY1OTY4NVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCIyMlwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0RGF0ZVRpbWVcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiRl9QVUJMSUNfVElNRVwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5pel5pyf5pe26Ze0XCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfZHRfNzY4NzI5MzE3XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiRW52VmFyXCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIkVOVl9EQVRFVElNRV9ZWVlZX01NX0REX0hIX01NX1NTXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiMjAxOS0xMC0zMCAyMDo1OTo0OVwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIklEXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjAwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfNzY4NjU5Njg1XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImRmZWVlYWRjLTM0MTgtODliOC0yZmMzLTk4ZjkyNjM5MDBjNFwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIlRERVZfVEVTVF8yX0lEXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjAwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfNzY4NjU5Njg1XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImU2ODgxNzc5LWVjZDItODM0NS0wM2YxLTdjOGVmMDY1ZGNjYlwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfV1cbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiZGVzY1wiOiBcIuS4gOWvueS4gOaVsOaNrlwiLFxuICAgICAgICAgIFwicmVjb3JkRmllbGRQT0xpc3RcIjogW3tcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJGX1RJVExFXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjAwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfNzY4NjU5Njg1XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjIyMlwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0RGF0ZVRpbWVcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiRl9QVUJMSUNfVElNRVwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5pel5pyf5pe26Ze0XCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfZHRfNzY4NzI5MzE3XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiRW52VmFyXCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIkVOVl9EQVRFVElNRV9ZWVlZX01NX0REX0hIX01NX1NTXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiMjAxOS0xMC0zMCAyMDo1OTo0OVwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIklEXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjAwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfNzY4NjU5Njg1XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjAwNWQxMjY1LWYxNjUtMzRmOS1kZmM3LTFlNzAwYmE3ZmZhNFwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIlRERVZfVEVTVF8yX0lEXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjAwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfNzY4NjU5Njg1XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImU2ODgxNzc5LWVjZDItODM0NS0wM2YxLTdjOGVmMDY1ZGNjYlwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1zZ1wiOiBcIlwiXG4gICAgICAgICAgfV1cbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiZGVzY1wiOiBcIuS4gOWvueS4gOaVsOaNrlwiLFxuICAgICAgICAgIFwicmVjb3JkRmllbGRQT0xpc3RcIjogW3tcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJGX1RJVExFXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLlrZfnrKbkuLJcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjAwXCIsXG4gICAgICAgICAgICBcInNlcmlhbGl6ZVwiOiBcInRydWVcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJ0eHRfNzY4NjU5Njg1XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRUeXBlXCI6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiMVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjIyMjJcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dERhdGVUaW1lXCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIkZfUFVCTElDX1RJTUVcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuaXpeacn+aXtumXtFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0X2R0Xzc2ODcyOTMxN1wiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkVudlZhclwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCJFTlZfREFURVRJTUVfWVlZWV9NTV9ERF9ISF9NTV9TU1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjIwMTktMTAtMzAgMjA6NTk6NDlcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJJRFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0Xzc2ODY1OTY4NVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCIwNThlODU2My1hZGMxLTdjM2QtNDE3Zi03ODNmZTE5ZGQ5MzZcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJUREVWX1RFU1RfMl9JRFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0Xzc2ODY1OTY4NVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJlNjg4MTc3OS1lY2QyLTgzNDUtMDNmMS03YzhlZjA2NWRjY2JcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH1dXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImRlc2NcIjogXCLkuIDlr7nkuIDmlbDmja5cIixcbiAgICAgICAgICBcInJlY29yZEZpZWxkUE9MaXN0XCI6IFt7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHRCb3hcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiRl9USVRMRVwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0Xzc2ODY1OTY4NVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCIzXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHREYXRlVGltZVwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJGX1BVQkxJQ19USU1FXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLml6XmnJ/ml7bpl7RcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF9kdF83Njg3MjkzMTdcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJFbnZWYXJcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiRU5WX0RBVEVUSU1FX1lZWVlfTU1fRERfSEhfTU1fU1NcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCIyMDE5LTEwLTMwIDIxOjAwOjEyXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHRCb3hcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiSURcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuWtl+espuS4slwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMDBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF83Njg2NTk2ODVcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJDb25zdFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCIxXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiODI4NDJhODgtMjc5ZS00NTk5LTBmNTctMGI5NGM2NWI1YTRjXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHRCb3hcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiVERFVl9URVNUXzJfSURcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuWtl+espuS4slwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMDBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF83Njg2NTk2ODVcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJDb25zdFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCIxXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZDlmZTJmMTAtZTVlYi1mNTlhLTU4ZWUtNzg3ZmRjZTc1MWYxXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9XVxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJkZXNjXCI6IFwi5LiA5a+55LiA5pWw5o2uXCIsXG4gICAgICAgICAgXCJyZWNvcmRGaWVsZFBPTGlzdFwiOiBbe1xuICAgICAgICAgICAgXCJyZWxhdGlvbklkXCI6IFwiZmQ2Y2MxYTEtODIyYi03YTZjLTllZTQtZjBlNmQzNmJkNTM4XCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uU2luZ2xlTmFtZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblR5cGVcIjogXCIxVG9OXCIsXG4gICAgICAgICAgICBcInNpbmdsZU5hbWVcIjogXCJXRkRDVF9UZXh0Qm94XCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIkZfVElUTEVcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuWtl+espuS4slwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMDBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF83Njg2NTk2ODVcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJDb25zdFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCIxXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiMzNcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dERhdGVUaW1lXCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIkZfUFVCTElDX1RJTUVcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuaXpeacn+aXtumXtFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0X2R0Xzc2ODcyOTMxN1wiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkVudlZhclwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCJFTlZfREFURVRJTUVfWVlZWV9NTV9ERF9ISF9NTV9TU1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjIwMTktMTAtMzAgMjE6MDA6MTJcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJJRFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0Xzc2ODY1OTY4NVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJjMmIzYjg2Yi1kNmMzLWNiNGItYjIxNS02ZGI5OTE1MmI1NmVcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJUREVWX1RFU1RfMl9JRFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0Xzc2ODY1OTY4NVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJkOWZlMmYxMC1lNWViLWY1OWEtNThlZS03ODdmZGNlNzUxZjFcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH1dXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImRlc2NcIjogXCLkuIDlr7nkuIDmlbDmja5cIixcbiAgICAgICAgICBcInJlY29yZEZpZWxkUE9MaXN0XCI6IFt7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHRCb3hcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiRl9USVRMRVwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0Xzc2ODY1OTY4NVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCIzMzNcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dERhdGVUaW1lXCIsXG4gICAgICAgICAgICBcInRhYmxlTmFtZVwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlQ2FwdGlvblwiOiBcIlRERVZfVEVTVF81XCIsXG4gICAgICAgICAgICBcInRhYmxlSWRcIjogXCJlMTU1NDljYi1lMDc0LTQ4YTMtODkzOS00NDM0MGUzODdmMTdcIixcbiAgICAgICAgICAgIFwiZmllbGRUYWJsZUlkXCI6IFwiXCIsXG4gICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBcIkZfUFVCTElDX1RJTUVcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuaXpeacn+aXtumXtFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0X2R0Xzc2ODcyOTMxN1wiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkVudlZhclwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCJFTlZfREFURVRJTUVfWVlZWV9NTV9ERF9ISF9NTV9TU1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjIwMTktMTAtMzAgMjE6MDA6MTJcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJJRFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0Xzc2ODY1OTY4NVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJiMDZmYzk4NC00NTQ4LTA5MTQtYjA0MS1lOGM5ODIxNTFiODZcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFwicmVsYXRpb25JZFwiOiBcImZkNmNjMWExLTgyMmItN2E2Yy05ZWU0LWYwZTZkMzZiZDUzOFwiLFxuICAgICAgICAgICAgXCJyZWxhdGlvblNpbmdsZU5hbWVcIjogXCJcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25UeXBlXCI6IFwiMVRvTlwiLFxuICAgICAgICAgICAgXCJzaW5nbGVOYW1lXCI6IFwiV0ZEQ1RfVGV4dEJveFwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJUREVWX1RFU1RfMl9JRFwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0Xzc2ODY1OTY4NVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJkOWZlMmYxMC1lNWViLWY1OWEtNThlZS03ODdmZGNlNzUxZjFcIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJtc2dcIjogXCJcIlxuICAgICAgICAgIH1dXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImRlc2NcIjogXCLkuIDlr7nkuIDmlbDmja5cIixcbiAgICAgICAgICBcInJlY29yZEZpZWxkUE9MaXN0XCI6IFt7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHRCb3hcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiRl9USVRMRVwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFUeXBlXCI6IFwi5a2X56ym5LiyXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YUxlbmd0aFwiOiBcIjIwMFwiLFxuICAgICAgICAgICAgXCJzZXJpYWxpemVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwidHh0Xzc2ODY1OTY4NVwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VHlwZVwiOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRWYWx1ZVwiOiBcIjFcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCIzMzMzXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHREYXRlVGltZVwiLFxuICAgICAgICAgICAgXCJ0YWJsZU5hbWVcIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogXCJUREVWX1RFU1RfNVwiLFxuICAgICAgICAgICAgXCJ0YWJsZUlkXCI6IFwiZTE1NTQ5Y2ItZTA3NC00OGEzLTg5MzktNDQzNDBlMzg3ZjE3XCIsXG4gICAgICAgICAgICBcImZpZWxkVGFibGVJZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJmaWVsZE5hbWVcIjogXCJGX1BVQkxJQ19USU1FXCIsXG4gICAgICAgICAgICBcImZpZWxkRGF0YVR5cGVcIjogXCLml6XmnJ/ml7bpl7RcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhTGVuZ3RoXCI6IFwiMjBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF9kdF83Njg3MjkzMTdcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJFbnZWYXJcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IFwiRU5WX0RBVEVUSU1FX1lZWVlfTU1fRERfSEhfTU1fU1NcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCIyMDE5LTEwLTMwIDIxOjAwOjEyXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHRCb3hcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiSURcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuWtl+espuS4slwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMDBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF83Njg2NTk2ODVcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJDb25zdFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCIxXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiMWE2NDg4ODItY2U0Yi1hZjg4LTU0NzEtODg0Njk2MjQxNGFhXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBcInJlbGF0aW9uSWRcIjogXCJmZDZjYzFhMS04MjJiLTdhNmMtOWVlNC1mMGU2ZDM2YmQ1MzhcIixcbiAgICAgICAgICAgIFwicmVsYXRpb25TaW5nbGVOYW1lXCI6IFwiXCIsXG4gICAgICAgICAgICBcInJlbGF0aW9uVHlwZVwiOiBcIjFUb05cIixcbiAgICAgICAgICAgIFwic2luZ2xlTmFtZVwiOiBcIldGRENUX1RleHRCb3hcIixcbiAgICAgICAgICAgIFwidGFibGVOYW1lXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IFwiVERFVl9URVNUXzVcIixcbiAgICAgICAgICAgIFwidGFibGVJZFwiOiBcImUxNTU0OWNiLWUwNzQtNDhhMy04OTM5LTQ0MzQwZTM4N2YxN1wiLFxuICAgICAgICAgICAgXCJmaWVsZFRhYmxlSWRcIjogXCJcIixcbiAgICAgICAgICAgIFwiZmllbGROYW1lXCI6IFwiVERFVl9URVNUXzJfSURcIixcbiAgICAgICAgICAgIFwiZmllbGREYXRhVHlwZVwiOiBcIuWtl+espuS4slwiLFxuICAgICAgICAgICAgXCJmaWVsZERhdGFMZW5ndGhcIjogXCIyMDBcIixcbiAgICAgICAgICAgIFwic2VyaWFsaXplXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInR4dF83Njg2NTk2ODVcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFR5cGVcIjogXCJDb25zdFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0VmFsdWVcIjogXCIxXCIsXG4gICAgICAgICAgICBcInZhbHVlXCI6IFwiZDlmZTJmMTAtZTVlYi1mNTlhLTU4ZWUtNzg3ZmRjZTc1MWYxXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibXNnXCI6IFwiXCJcbiAgICAgICAgICB9XVxuICAgICAgICB9XSxcbiAgICAgICAgXCJpc01haW5cIjogZmFsc2VcbiAgICAgIH1dLFxuICAgICAgXCJleERhdGFcIjogbnVsbFxuICAgIH07XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBJbm5lckZvcm1CdXR0b25SdW50aW1lID0ge1xuICBSZW5kZXJlclNpbmdsZUlubmVyRm9ybUJ1dHRvbjogZnVuY3Rpb24gUmVuZGVyZXJTaW5nbGVJbm5lckZvcm1CdXR0b24oaW5uZXJCdXR0b25Db25maWcsIGZvcm1SdW50aW1lSW5zdGFuY2UsIGxpc3RCdXR0b25QTykge1xuICAgIHZhciBlbGVtID0gJCgnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJvcGVyYXRpb24tYnV0dG9uIG9wZXJhdGlvbi1idXR0b24tcHJpbWFyeVwiIGlkPVwiJyArIGlubmVyQnV0dG9uQ29uZmlnLmlkICsgJ1wiPjxzcGFuPicgKyBpbm5lckJ1dHRvbkNvbmZpZy5jYXB0aW9uICsgJzwvc3Bhbj48L2J1dHRvbj4nKTtcbiAgICBlbGVtLmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBcImlubmVyQnV0dG9uQ29uZmlnXCI6IGlubmVyQnV0dG9uQ29uZmlnLFxuICAgICAgXCJmb3JtUnVudGltZUluc3RhbmNlXCI6IGZvcm1SdW50aW1lSW5zdGFuY2UsXG4gICAgICBcImxpc3RCdXR0b25QT1wiOiBsaXN0QnV0dG9uUE9cbiAgICB9LCB0aGlzLlJlbmRlcmVyU2luZ2xlSW5uZXJGb3JtQnV0dG9uQ2xpY2spO1xuICAgIHJldHVybiBlbGVtO1xuICB9LFxuICBSZW5kZXJlclNpbmdsZUlubmVyRm9ybUJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBSZW5kZXJlclNpbmdsZUlubmVyRm9ybUJ1dHRvbkNsaWNrKHNlbmRlcikge1xuICAgIHZhciBpbm5lckJ1dHRvbkNvbmZpZyA9IHNlbmRlci5kYXRhLmlubmVyQnV0dG9uQ29uZmlnO1xuICAgIHZhciBmb3JtUnVudGltZUluc3RhbmNlID0gc2VuZGVyLmRhdGEuZm9ybVJ1bnRpbWVJbnN0YW5jZTtcbiAgICB2YXIgbGlzdEJ1dHRvblBPID0gc2VuZGVyLmRhdGEubGlzdEJ1dHRvblBPO1xuICAgIHZhciBmb3JtRGF0YUNvbXBsZXhQT0xpc3QgPSBmb3JtUnVudGltZUluc3RhbmNlLlNlcmlhbGl6YXRpb25Gb3JtRGF0YSgpO1xuICAgIHZhciBvcGVyYXRpb25UeXBlID0gZm9ybVJ1bnRpbWVJbnN0YW5jZS5fUHJvcF9Db25maWcuT3BlcmF0aW9uVHlwZTtcbiAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0TG9hZGluZyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkLCB7fSwgXCLns7vnu5/lpITnkIbkuK0s6K+356iN5YCZLi4uXCIpO1xuICAgIFJ1bnRpbWVHZW5lcmFsSW5zdGFuY2UuU3VibWl0Rm9ybURhdGFDb21wbGV4UE9MaXN0VG9TZXJ2ZXIoZm9ybURhdGFDb21wbGV4UE9MaXN0LCBmb3JtRGF0YUNvbXBsZXhQT0xpc3QucmVjb3JkSWQsIGlubmVyQnV0dG9uQ29uZmlnLmlkLCBsaXN0QnV0dG9uUE8uYnV0dG9uSWQsIG9wZXJhdGlvblR5cGUsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQpO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfSwgdGhpcyk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBMaXN0UnVudGltZSA9IHtcbiAgX1Byb3BfU3RhdHVzOiBcIkVkaXRcIixcbiAgX1Byb3BfQ29uZmlnOiB7XG4gICAgUmVuZGVyZXJUb0lkOiBudWxsLFxuICAgIExpc3RJZDogXCJcIixcbiAgICBJc1ByZXZpZXc6IGZhbHNlXG4gIH0sXG4gIF8kUmVuZGVyZXJUb0VsZW06IG51bGwsXG4gIEluaXRpYWxpemF0aW9uOiBmdW5jdGlvbiBJbml0aWFsaXphdGlvbihfY29uZmlnKSB7XG4gICAgdGhpcy5fUHJvcF9Db25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5fUHJvcF9Db25maWcsIF9jb25maWcpO1xuICAgIHRoaXMuXyRSZW5kZXJlclRvRWxlbSA9ICQoXCIjXCIgKyB0aGlzLl9Qcm9wX0NvbmZpZy5SZW5kZXJlclRvSWQpO1xuXG4gICAgdGhpcy5fTG9hZEhUTUxUb0VsKCk7XG4gIH0sXG4gIF9SZW5kZXJlckNoYWluSXNDb21wbGV0ZWQ6IHRydWUsXG4gIF9SZW5kZXJlckRhdGFDaGFpbklzQ29tcGxldGVkOiB0cnVlLFxuICBfTG9hZEhUTUxUb0VsOiBmdW5jdGlvbiBfTG9hZEhUTUxUb0VsKCkge1xuICAgIFJ1bnRpbWVHZW5lcmFsSW5zdGFuY2UuTG9hZEh0bWxEZXNpZ25Db250ZW50KEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9SZXN0L0J1aWxkZXIvUnVuVGltZS9MaXN0UnVudGltZS9Mb2FkSFRNTD9saXN0SWQ9XCIgKyB0aGlzLl9Qcm9wX0NvbmZpZy5MaXN0SWQsIHRoaXMuX1Byb3BfQ29uZmlnLlJlbmRlcmVyVG8sIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICB0aGlzLl8kUmVuZGVyZXJUb0VsZW0uYXBwZW5kKHJlc3VsdC5kYXRhLmxpc3RIdG1sUnVudGltZSk7XG5cbiAgICAgIHRoaXMuXyRSZW5kZXJlclRvRWxlbS5hcHBlbmQocmVzdWx0LmRhdGEubGlzdEpzUnVudGltZSk7XG5cbiAgICAgIGlmICh0eXBlb2YgQnVpbGRlckxpc3RQYWdlUnVudGltZUluc3RhbmNlLlBhZ2VSZWFkeSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgQnVpbGRlckxpc3RQYWdlUnVudGltZUluc3RhbmNlLlBhZ2VSZWFkeSgpO1xuICAgICAgfVxuXG4gICAgICBWaXJ0dWFsQm9keUNvbnRyb2wuUmVuZGVyZXJDaGFpbih7XG4gICAgICAgIHBvOiByZXN1bHQuZGF0YSxcbiAgICAgICAgc291cmNlSFRNTDogcmVzdWx0LmRhdGEubGlzdEh0bWxSdW50aW1lLFxuICAgICAgICAkcm9vdEVsZW06IHRoaXMuXyRSZW5kZXJlclRvRWxlbSxcbiAgICAgICAgJHBhcmVudENvbnRyb2xFbGVtOiB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sXG4gICAgICAgICRzaW5nbGVDb250cm9sRWxlbTogdGhpcy5fJFJlbmRlcmVyVG9FbGVtLFxuICAgICAgICBsaXN0UnVudGltZUluc3RhbmNlOiB0aGlzXG4gICAgICB9KTtcbiAgICAgIHZhciBSZW5kZXJlckNoYWluQ29tcGxldGVPYmogPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoX3NlbGYuX1JlbmRlcmVyQ2hhaW5Jc0NvbXBsZXRlZCkge1xuICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKFJlbmRlcmVyQ2hhaW5Db21wbGV0ZU9iaik7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIEJ1aWxkZXJMaXN0UGFnZVJ1bnRpbWVJbnN0YW5jZS5SZW5kZXJlckNoYWluQ29tcGxldGVkID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgQnVpbGRlckxpc3RQYWdlUnVudGltZUluc3RhbmNlLlJlbmRlcmVyQ2hhaW5Db21wbGV0ZWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIDUwMCk7XG4gICAgICB2YXIgdG9wRGF0YVNldElkID0gcmVzdWx0LmRhdGEubGlzdERhdGFzZXRJZDtcbiAgICAgIFZpcnR1YWxCb2R5Q29udHJvbC5SZW5kZXJlckRhdGFDaGFpbih7XG4gICAgICAgIHBvOiByZXN1bHQuZGF0YSxcbiAgICAgICAgc291cmNlSFRNTDogcmVzdWx0LmRhdGEubGlzdEh0bWxSdW50aW1lLFxuICAgICAgICAkcm9vdEVsZW06IHRoaXMuXyRSZW5kZXJlclRvRWxlbSxcbiAgICAgICAgJHBhcmVudENvbnRyb2xFbGVtOiB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sXG4gICAgICAgICRzaW5nbGVDb250cm9sRWxlbTogdGhpcy5fJFJlbmRlcmVyVG9FbGVtLFxuICAgICAgICB0b3BEYXRhU2V0SWQ6IHRvcERhdGFTZXRJZCxcbiAgICAgICAgbGlzdFJ1bnRpbWVJbnN0YW5jZTogdGhpc1xuICAgICAgfSk7XG4gICAgICB2YXIgUmVuZGVyZXJEYXRhQ2hhaW5Db21wbGV0ZU9iaiA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChfc2VsZi5fUmVuZGVyZXJEYXRhQ2hhaW5Jc0NvbXBsZXRlZCkge1xuICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKFJlbmRlcmVyRGF0YUNoYWluQ29tcGxldGVPYmopO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBCdWlsZGVyTGlzdFBhZ2VSdW50aW1lSW5zdGFuY2UuUmVuZGVyZXJEYXRhQ2hhaW5Db21wbGV0ZWQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBCdWlsZGVyTGlzdFBhZ2VSdW50aW1lSW5zdGFuY2UuUmVuZGVyZXJEYXRhQ2hhaW5Db21wbGV0ZWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIDcwMCk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIElzUHJldmlldzogZnVuY3Rpb24gSXNQcmV2aWV3KCkge1xuICAgIHJldHVybiB0aGlzLl9Qcm9wX0NvbmZpZy5Jc1ByZXZpZXc7XG4gIH1cbn07XG52YXIgQnVpbGRlckxpc3RQYWdlUnVudGltZUluc3RhbmNlID0ge1xuICBQYWdlUmVhZHk6IGZ1bmN0aW9uIFBhZ2VSZWFkeSgpIHtcbiAgICBjb25zb2xlLmxvZyhcIumhtemdouWKoOi9vWh0bWzlrozmiJAxXCIpO1xuICB9LFxuICBSZW5kZXJlckNoYWluQ29tcGxldGVkOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluQ29tcGxldGVkKCkge1xuICAgIGNvbnNvbGUubG9nKFwi5a6i5oi356uv5o6n5Lu25riy5p+T5a6M5oiQXCIpO1xuICB9LFxuICBSZW5kZXJlckRhdGFDaGFpbkNvbXBsZXRlZDogZnVuY3Rpb24gUmVuZGVyZXJEYXRhQ2hhaW5Db21wbGV0ZWQoKSB7XG4gICAgY29uc29sZS5sb2coXCLlrqLmiLfnq6/mjqfku7bmuLLmn5Plubbnu5HlrprlrozmlbDmja5cIik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBSdW50aW1lR2VuZXJhbEluc3RhbmNlID0ge1xuICBfQWpheDogZnVuY3Rpb24gX0FqYXgodXJsLCBwYXJhbXMsIGNhbGxiYWNrLCBzZW5kZXIpIHtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgZGF0YTogcGFyYW1zXG4gICAgfSkuZG9uZShmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBjYWxsYmFjay5jYWxsKHNlbmRlciwgcmVzdWx0KTtcblxuICAgICAgaWYgKCFyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChyZXN1bHQubWVzc2FnZSwgc2VuZGVyLCA1KTtcbiAgICAgIH1cbiAgICB9KS5hbHdheXMoY2FsbGJhY2sgJiYgZnVuY3Rpb24gKGpxWEhSLCBzdGF0dXMpIHt9KTtcbiAgfSxcbiAgTG9hZEh0bWxEZXNpZ25Db250ZW50OiBmdW5jdGlvbiBMb2FkSHRtbERlc2lnbkNvbnRlbnQodXJsLCBhcHBlbmRUb0VsZW1JZCwgcGFyYW1zLCBjYWxsYmFjaywgc2VuZGVyKSB7XG4gICAgdGhpcy5fQWpheCh1cmwsIHBhcmFtcywgY2FsbGJhY2ssIHNlbmRlcik7XG4gIH0sXG4gIExvYWRJbm5lckZvcm1CdXR0b246IGZ1bmN0aW9uIExvYWRJbm5lckZvcm1CdXR0b24obGlzdEZvcm1CdXR0b25JZCwgcGFyYW1zLCBjYWxsYmFjaywgc2VuZGVyKSB7XG4gICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKFwiL1Jlc3QvQnVpbGRlci9SdW5UaW1lL0xpc3RCdXR0b25SdW50aW1lL0dldEJ1dHRvblBPXCIsIHtcbiAgICAgIGJ1dHRvbklkOiBsaXN0Rm9ybUJ1dHRvbklkXG4gICAgfSk7XG5cbiAgICB0aGlzLl9BamF4KHVybCwgcGFyYW1zLCBjYWxsYmFjaywgc2VuZGVyKTtcbiAgfSxcbiAgU3VibWl0Rm9ybURhdGFDb21wbGV4UE9MaXN0VG9TZXJ2ZXI6IGZ1bmN0aW9uIFN1Ym1pdEZvcm1EYXRhQ29tcGxleFBPTGlzdFRvU2VydmVyKGZvcm1EYXRhQ29tcGxleFBPTGlzdCwgcmVjb3JkSWQsIGlubmVyRm9ybUJ1dHRvbklkLCBsaXN0QnV0dG9uSWQsIG9wZXJhdGlvblR5cGUsIGNhbGxiYWNrLCBzZW5kZXIpIHtcbiAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24oXCIvUmVzdC9CdWlsZGVyL1J1blRpbWUvSW5uZXJGb3JtQnV0dG9uUnVudGltZS9SZWNlaXZlSGFuZGxlclwiLCB7fSk7XG4gICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgIFwiZm9ybVJlY29yZENvbXBsZXhQT1N0cmluZ1wiOiBlbmNvZGVVUklDb21wb25lbnQoSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKGZvcm1EYXRhQ29tcGxleFBPTGlzdCkpLFxuICAgICAgXCJpbm5lckZvcm1CdXR0b25JZFwiOiBpbm5lckZvcm1CdXR0b25JZCxcbiAgICAgIFwibGlzdEJ1dHRvbklkXCI6IGxpc3RCdXR0b25JZCxcbiAgICAgIFwicmVjb3JkSWRcIjogcmVjb3JkSWQsXG4gICAgICBcIm9wZXJhdGlvblR5cGVcIjogb3BlcmF0aW9uVHlwZVxuICAgIH07XG5cbiAgICB0aGlzLl9BamF4KHVybCwgcGFyYW1zLCBjYWxsYmFjaywgc2VuZGVyKTtcblxuICAgIGNvbnNvbGUubG9nKGZvcm1EYXRhQ29tcGxleFBPTGlzdCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBIVE1MQ29udHJvbEF0dHJzID0ge1xuICBKQlVJTEQ0RENfQ1VTVE9NOiBcImpidWlsZDRkY19jdXN0b21cIixcbiAgU0VMRUNURURfSkJVSUxENERDX0NVU1RPTTogXCJbamJ1aWxkNGRjX2N1c3RvbT10cnVlXVwiLFxuICBDTElFTlRfUkVTT0xWRTogXCJjbGllbnRfcmVzb2x2ZVwiXG59O1xudmFyIEhUTUxDb250cm9sID0ge1xuICBfSW5zdGFuY2VNYXA6IHt9LFxuICBfR2V0SW5zdGFuY2U6IGZ1bmN0aW9uIF9HZXRJbnN0YW5jZShuYW1lKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuX0luc3RhbmNlTWFwKSB7XG4gICAgICBpZiAoa2V5ID09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0luc3RhbmNlTWFwW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGluc3RhbmNlID0gZXZhbChuYW1lKTtcbiAgICB0aGlzLl9JbnN0YW5jZU1hcFtuYW1lXSA9IGluc3RhbmNlO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSxcbiAgR2V0SW5zdGFuY2U6IGZ1bmN0aW9uIEdldEluc3RhbmNlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fR2V0SW5zdGFuY2UobmFtZSk7XG4gIH0sXG4gIFNhdmVDb250cm9sTmV3SW5zdGFuY2VUb1Bvb2w6IGZ1bmN0aW9uIFNhdmVDb250cm9sTmV3SW5zdGFuY2VUb1Bvb2woJGVsZW0sIGluc3RhbmNlKSB7XG4gICAgYWxlcnQoXCLmlLnmlrnms5Xlt7Lnu4/lup/lvIMs5pS55Li65pyN5Yqh56uv5Yib5bu65Yid5aeL5YyW6ISa5pysMSFcIik7XG4gICAgcmV0dXJuIG51bGw7XG4gICAgdmFyIGluc3RhbmNlTmFtZSA9ICRlbGVtLmF0dHIoXCJjbGllbnRfcmVzb2x2ZVwiKSArIFwiX1wiICsgU3RyaW5nVXRpbGl0eS5HdWlkU3BsaXQoXCJcIik7XG4gICAgJGVsZW0uYXR0cihcImNsaWVudF9pbnN0YW5jZV9uYW1lXCIsIGluc3RhbmNlTmFtZSk7XG4gICAgdGhpcy5fSW5zdGFuY2VNYXBbaW5zdGFuY2VOYW1lXSA9IGluc3RhbmNlO1xuICAgIHJldHVybiBpbnN0YW5jZU5hbWU7XG4gIH0sXG4gIF9TYXZlQ29udHJvbE5ld0luc3RhbmNlVG9Qb29sOiBmdW5jdGlvbiBfU2F2ZUNvbnRyb2xOZXdJbnN0YW5jZVRvUG9vbChpbnN0YW5jZU5hbWUsIGluc3RhbmNlKSB7XG4gICAgdGhpcy5fSW5zdGFuY2VNYXBbaW5zdGFuY2VOYW1lXSA9IGluc3RhbmNlO1xuICAgIHJldHVybiBpbnN0YW5jZU5hbWU7XG4gIH0sXG4gIEdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbTogZnVuY3Rpb24gR2V0Q29udHJvbEluc3RhbmNlQnlFbGVtKCRlbGVtKSB7XG4gICAgcmV0dXJuIHRoaXMuX0dldEluc3RhbmNlKHRoaXMuR2V0Q29udHJvbEluc3RhbmNlTmFtZUJ5RWxlbSgkZWxlbSkpO1xuICB9LFxuICBHZXRDb250cm9sSW5zdGFuY2VOYW1lQnlFbGVtOiBmdW5jdGlvbiBHZXRDb250cm9sSW5zdGFuY2VOYW1lQnlFbGVtKCRlbGVtKSB7XG4gICAgdmFyIGluc3RhbmNlTmFtZSA9IFwiXCI7XG5cbiAgICBpZiAoJGVsZW0uYXR0cihcImNsaWVudF9pbnN0YW5jZV9uYW1lXCIpICYmICRlbGVtLmF0dHIoXCJjbGllbnRfaW5zdGFuY2VfbmFtZVwiKS5sZW5ndGggPiAwKSB7XG4gICAgICBpbnN0YW5jZU5hbWUgPSAkZWxlbS5hdHRyKFwiY2xpZW50X2luc3RhbmNlX25hbWVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluc3RhbmNlTmFtZSA9ICRlbGVtLmF0dHIoXCJjbGllbnRfcmVzb2x2ZVwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdGFuY2VOYW1lO1xuICB9LFxuICBSZW5kZXJlckNoYWluUGFyYXM6IHtcbiAgICBsaXN0RW50aXR5OiBudWxsLFxuICAgIHNvdXJjZUhUTUw6IG51bGwsXG4gICAgJHJvb3RFbGVtOiBudWxsLFxuICAgICRwYXJlbnRDb250cm9sRWxlbTogbnVsbCxcbiAgICAkc2luZ2xlQ29udHJvbEVsZW06IG51bGxcbiAgfSxcbiAgUmVuZGVyZXJEYXRhQ2hhaW5QYXJhczoge1xuICAgIGxpc3RFbnRpdHk6IG51bGwsXG4gICAgc291cmNlSFRNTDogbnVsbCxcbiAgICAkcm9vdEVsZW06IG51bGwsXG4gICAgJHBhcmVudENvbnRyb2xFbGVtOiBudWxsLFxuICAgICRzaW5nbGVDb250cm9sRWxlbTogbnVsbCxcbiAgICB0b3BEYXRhU2V0OiBudWxsXG4gIH0sXG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNpbmdsZUNvbnRyb2xFbGVtLmNoaWxkcmVuKCkubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciAkY2hpbGRTaW5nbGVFbGVtID0gJCgkc2luZ2xlQ29udHJvbEVsZW0uY2hpbGRyZW4oKVtpXSk7XG4gICAgICB2YXIgX2Nsb25lUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcyA9IHt9O1xuICAgICAgSnNvblV0aWxpdHkuU2ltcGxlQ2xvbmVBdHRyKF9jbG9uZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMsIF9yZW5kZXJlckNoYWluUGFyYXMpO1xuICAgICAgX2Nsb25lUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW0gPSAkY2hpbGRTaW5nbGVFbGVtO1xuXG4gICAgICBpZiAoJGNoaWxkU2luZ2xlRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuSkJVSUxENERDX0NVU1RPTSkgPT0gXCJ0cnVlXCIgJiYgJGNoaWxkU2luZ2xlRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuQ0xJRU5UX1JFU09MVkUpKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbSgkY2hpbGRTaW5nbGVFbGVtKTtcblxuICAgICAgICBpZiAodHlwZW9mIGluc3RhbmNlLkluaXRpYWxpemUgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgaW5zdGFuY2UuSW5pdGlhbGl6ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5zdGFuY2UuUmVuZGVyZXJDaGFpbihfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4oX2Nsb25lUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcyk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBSZW5kZXJlckRhdGFDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJEYXRhQ2hhaW4oX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2luZ2xlQ29udHJvbEVsZW0uY2hpbGRyZW4oKS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyICRjaGlsZFNpbmdsZUVsZW0gPSAkKCRzaW5nbGVDb250cm9sRWxlbS5jaGlsZHJlbigpW2ldKTtcbiAgICAgIHZhciBfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzID0ge307XG4gICAgICBKc29uVXRpbGl0eS5TaW1wbGVDbG9uZUF0dHIoX2Nsb25lUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcywgX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMpO1xuICAgICAgX2Nsb25lUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW0gPSAkY2hpbGRTaW5nbGVFbGVtO1xuXG4gICAgICBpZiAoJGNoaWxkU2luZ2xlRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuSkJVSUxENERDX0NVU1RPTSkgPT0gXCJ0cnVlXCIgJiYgJGNoaWxkU2luZ2xlRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuQ0xJRU5UX1JFU09MVkUpKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbSgkY2hpbGRTaW5nbGVFbGVtKTtcbiAgICAgICAgaW5zdGFuY2UuUmVuZGVyZXJEYXRhQ2hhaW4oX2Nsb25lUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcyk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZS5TZXRWYWx1ZSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICB2YXIgZmllbGRQTyA9IEhUTUxDb250cm9sLlRyeUdldEZpZWxkUE9JblJlbGF0aW9uRm9ybVJlY29yZENvbXBsZXhQbygkY2hpbGRTaW5nbGVFbGVtLCBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy5yZWxhdGlvbkZvcm1SZWNvcmRDb21wbGV4UG8pO1xuICAgICAgICAgIGluc3RhbmNlLlNldFZhbHVlKCRjaGlsZFNpbmdsZUVsZW0sIGZpZWxkUE8sIF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLnJlbGF0aW9uRm9ybVJlY29yZENvbXBsZXhQbywgX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBIVE1MQ29udHJvbC5SZW5kZXJlckRhdGFDaGFpbihfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIEdldFZhbHVlOiBmdW5jdGlvbiBHZXRWYWx1ZSgkZWxlbSwgb3JpZ2luYWxEYXRhLCBwYXJhcykge1xuICAgIG9yaWdpbmFsRGF0YS52YWx1ZSA9ICRlbGVtLnZhbCgpO1xuICAgIHJldHVybiBvcmlnaW5hbERhdGE7XG4gIH0sXG4gIFNldFZhbHVlOiBmdW5jdGlvbiBTZXRWYWx1ZSgkZWxlbSwgZmllbGRQTywgcmVsYXRpb25Gb3JtUmVjb3JkQ29tcGxleFBvLCBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcykge1xuICAgIGlmIChmaWVsZFBPKSB7XG4gICAgICAkZWxlbS52YWwoZmllbGRQTy52YWx1ZSk7XG4gICAgICAkZWxlbS5hdHRyKFwiY29udHJvbF92YWx1ZVwiLCBmaWVsZFBPLnZhbHVlKTtcbiAgICB9XG4gIH0sXG4gIFRyeUdldEZpZWxkUE9JblJlbGF0aW9uRm9ybVJlY29yZENvbXBsZXhQbzogZnVuY3Rpb24gVHJ5R2V0RmllbGRQT0luUmVsYXRpb25Gb3JtUmVjb3JkQ29tcGxleFBvKCRlbGVtLCByZWxhdGlvbkZvcm1SZWNvcmRDb21wbGV4UG8pIHtcbiAgICB2YXIgcmVsYXRpb25JZCA9IEhUTUxDb250cm9sLkdldENvbnRyb2xCaW5kUmVsYXRpb25JZCgkZWxlbSk7XG4gICAgdmFyIGJpbmRUYWJsZU5hbWUgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sQmluZFRhYmxlTmFtZSgkZWxlbSk7XG4gICAgdmFyIGJpbmRGaWVsZE5hbWUgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sQmluZEZpZWxkTmFtZSgkZWxlbSk7XG5cbiAgICBpZiAocmVsYXRpb25JZCAmJiBiaW5kRmllbGROYW1lKSB7XG4gICAgICB2YXIgZmllbGRQTyA9IEZvcm1SZWxhdGlvblBPVXRpbGl0eS5GaW5kRmllbGRQT0luUmVsYXRpb25Gb3JtUmVjb3JkQ29tcGxleFBvT25lRGF0YVJlY29yZChyZWxhdGlvbkZvcm1SZWNvcmRDb21wbGV4UG8sIHJlbGF0aW9uSWQsIGJpbmRUYWJsZU5hbWUsIGJpbmRGaWVsZE5hbWUpO1xuICAgICAgcmV0dXJuIGZpZWxkUE87XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSxcbiAgRmluZEFMTENvbnRyb2xzOiBmdW5jdGlvbiBGaW5kQUxMQ29udHJvbHMoJHBhcmVudCkge1xuICAgIGlmICgkcGFyZW50KSB7XG4gICAgICByZXR1cm4gJHBhcmVudC5maW5kKFwiW2pidWlsZDRkY19jdXN0b209J3RydWUnXVwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJChcIltqYnVpbGQ0ZGNfY3VzdG9tPSd0cnVlJ11cIik7XG4gIH0sXG4gIEdldENvbnRyb2xCaW5kVGFibGVOYW1lOiBmdW5jdGlvbiBHZXRDb250cm9sQmluZFRhYmxlTmFtZSgkY29udHJvbEVsZW0pIHtcbiAgICByZXR1cm4gJGNvbnRyb2xFbGVtLmF0dHIoXCJ0YWJsZW5hbWVcIik7XG4gIH0sXG4gIEdldENvbnRyb2xCaW5kRmllbGROYW1lOiBmdW5jdGlvbiBHZXRDb250cm9sQmluZEZpZWxkTmFtZSgkY29udHJvbEVsZW0pIHtcbiAgICByZXR1cm4gJGNvbnRyb2xFbGVtLmF0dHIoXCJmaWVsZG5hbWVcIik7XG4gIH0sXG4gIEdldENvbnRyb2xCaW5kUmVsYXRpb25JZDogZnVuY3Rpb24gR2V0Q29udHJvbEJpbmRSZWxhdGlvbklkKCRjb250cm9sRWxlbSkge1xuICAgIHJldHVybiAkY29udHJvbEVsZW0uYXR0cihcInJlbGF0aW9uaWRcIik7XG4gIH0sXG4gIEdldENvbnRyb2xQcm9wOiBmdW5jdGlvbiBHZXRDb250cm9sUHJvcCgkY29udHJvbEVsZW0pIHtcbiAgICB2YXIgcHJvcHMgPSB7XG4gICAgICBzaW5nbGVOYW1lOiBcIlwiLFxuICAgICAgdGFibGVOYW1lOiBcIlwiLFxuICAgICAgdGFibGVDYXB0aW9uOiBcIlwiLFxuICAgICAgdGFibGVJZDogXCJcIixcbiAgICAgIGZpZWxkVGFibGVJZDogXCJcIixcbiAgICAgIGZpZWxkTmFtZTogXCJcIixcbiAgICAgIGZpZWxkRGF0YVR5cGU6IFwiXCIsXG4gICAgICBmaWVsZERhdGFMZW5ndGg6IFwiXCIsXG4gICAgICBkZWZhdWx0VHlwZTogXCJcIixcbiAgICAgIGRlZmF1bHRWYWx1ZTogXCJcIixcbiAgICAgIGlkOiBcIlwiLFxuICAgICAgc2VyaWFsaXplOiBcIlwiLFxuICAgICAgdmFsdWU6IFwiXCJcbiAgICB9O1xuXG4gICAgZm9yICh2YXIga2V5IGluIHByb3BzKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gJGNvbnRyb2xFbGVtLmF0dHIoU3RyaW5nVXRpbGl0eS5Ub0xvd2VyQ2FzZShrZXkpKTtcblxuICAgICAgaWYgKCFTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkocHJvcFZhbHVlKSkge1xuICAgICAgICBwcm9wc1trZXldID0gcHJvcFZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByb3BzLmZpZWxkRGF0YUxlbmd0aCA9ICRjb250cm9sRWxlbS5hdHRyKFwiZmllbGRsZW5ndGhcIik7XG4gICAgcmV0dXJuIHByb3BzO1xuICB9LFxuICBCdWlsZFNlcmlhbGl6YXRpb25PcmlnaW5hbERhdGE6IGZ1bmN0aW9uIEJ1aWxkU2VyaWFsaXphdGlvbk9yaWdpbmFsRGF0YShwcm9wcywgcmVsYXRpb25JZCwgcmVsYXRpb25TaW5nbGVOYW1lLCByZWxhdGlvblR5cGUpIHtcbiAgICB2YXIgb3JpZ2luYWxEYXRhID0ge1xuICAgICAgcmVsYXRpb25JZDogcmVsYXRpb25JZCxcbiAgICAgIHJlbGF0aW9uU2luZ2xlTmFtZTogcmVsYXRpb25TaW5nbGVOYW1lLFxuICAgICAgcmVsYXRpb25UeXBlOiByZWxhdGlvblR5cGUsXG4gICAgICBzaW5nbGVOYW1lOiBwcm9wcy5zaW5nbGVOYW1lLFxuICAgICAgdGFibGVOYW1lOiBwcm9wcy50YWJsZU5hbWUsXG4gICAgICB0YWJsZUNhcHRpb246IHByb3BzLnRhYmxlQ2FwdGlvbixcbiAgICAgIHRhYmxlSWQ6IHByb3BzLnRhYmxlSWQsXG4gICAgICBmaWVsZFRhYmxlSWQ6IHByb3BzLmZpZWxkVGFibGVJZCxcbiAgICAgIGZpZWxkTmFtZTogcHJvcHMuZmllbGROYW1lLFxuICAgICAgZmllbGREYXRhVHlwZTogcHJvcHMuZmllbGREYXRhVHlwZSxcbiAgICAgIGZpZWxkRGF0YUxlbmd0aDogcHJvcHMuZmllbGREYXRhTGVuZ3RoLFxuICAgICAgc2VyaWFsaXplOiBwcm9wcy5zZXJpYWxpemUsXG4gICAgICBpZDogcHJvcHMuaWQsXG4gICAgICBkZWZhdWx0VHlwZTogcHJvcHMuZGVmYXVsdFR5cGUsXG4gICAgICBkZWZhdWx0VmFsdWU6IHByb3BzLmRlZmF1bHRWYWx1ZSxcbiAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIG1zZzogXCJcIlxuICAgIH07XG4gICAgcmV0dXJuIG9yaWdpbmFsRGF0YTtcbiAgfSxcbiAgR2V0U2VyaWFsaXphdGlvbk9uZURhdGFSZWNvcmRGaWVsZFZhbHVlOiBmdW5jdGlvbiBHZXRTZXJpYWxpemF0aW9uT25lRGF0YVJlY29yZEZpZWxkVmFsdWUob25lRGF0YVJlY29yZCwgdGFibGVOYW1lLCBmaWVsZE5hbWUpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9uZURhdGFSZWNvcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChvbmVEYXRhUmVjb3JkW2ldLnRhYmxlTmFtZSA9PSB0YWJsZU5hbWUgJiYgb25lRGF0YVJlY29yZFtpXS5maWVsZE5hbWUgPT0gZmllbGROYW1lKSB7XG4gICAgICAgIHJldHVybiBvbmVEYXRhUmVjb3JkW2ldLnZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBcIlwiO1xuICB9LFxuICBUcnlHZXRGaWVsZFRyYW5zZmVyUE86IGZ1bmN0aW9uIFRyeUdldEZpZWxkVHJhbnNmZXJQTygkY29udHJvbEVsZW0sIHJlbGF0aW9uSWQsIHJlbGF0aW9uU2luZ2xlTmFtZSwgcmVsYXRpb25UeXBlKSB7XG4gICAgdmFyIHByb3BzID0gSFRNTENvbnRyb2wuR2V0Q29udHJvbFByb3AoJGNvbnRyb2xFbGVtKTtcbiAgICB2YXIgb3JpZ2luYWxEYXRhID0gSFRNTENvbnRyb2wuQnVpbGRTZXJpYWxpemF0aW9uT3JpZ2luYWxEYXRhKHByb3BzLCByZWxhdGlvbklkLCByZWxhdGlvblNpbmdsZU5hbWUsIHJlbGF0aW9uVHlwZSk7XG4gICAgdmFyIGNvbnRyb2xJbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbSgkY29udHJvbEVsZW0pO1xuXG4gICAgaWYgKEJhc2VVdGlsaXR5LklzRnVuY3Rpb24oY29udHJvbEluc3RhbmNlLkdldFZhbHVlKSkge1xuICAgICAgdmFyIGZpZWxkVHJhbnNmZXJQTyA9IGNvbnRyb2xJbnN0YW5jZS5HZXRWYWx1ZSgkY29udHJvbEVsZW0sIG9yaWdpbmFsRGF0YSwge30pO1xuXG4gICAgICBpZiAoZmllbGRUcmFuc2ZlclBPLnN1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkVHJhbnNmZXJQTztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuaOp+S7tjpcIiArICRjb250cm9sRWxlbS5hdHRyKFwic2luZ2xlbmFtZVwiKSArIFwi5pyq5YyF5ZCrR2V0VmFsdWXnmoTmlrnms5UhXCIpO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFZpcnR1YWxCb2R5Q29udHJvbCA9IHtcbiAgUmVuZGVyZXJDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpbixcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyRGF0YUNoYWluXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ2pxdWVyeSddLCBmdW5jdGlvbiAoJCkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoJCwgd2luZG93LCBkb2N1bWVudCk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoKHR5cGVvZiBleHBvcnRzID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YoZXhwb3J0cykpID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvb3QsICQpIHtcbiAgICAgIGlmICghcm9vdCkge1xuICAgICAgICByb290ID0gd2luZG93O1xuICAgICAgfVxuXG4gICAgICBpZiAoISQpIHtcbiAgICAgICAgJCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gcmVxdWlyZSgnanF1ZXJ5JykgOiByZXF1aXJlKCdqcXVlcnknKShyb290KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhY3RvcnkoJCwgcm9vdCwgcm9vdC5kb2N1bWVudCk7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBmYWN0b3J5KGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG4gIH1cbn0pKGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIERhdGFUYWJsZSA9IGZ1bmN0aW9uIERhdGFUYWJsZShvcHRpb25zKSB7XG4gICAgdGhpcy4kID0gZnVuY3Rpb24gKHNTZWxlY3Rvciwgb09wdHMpIHtcbiAgICAgIHJldHVybiB0aGlzLmFwaSh0cnVlKS4kKHNTZWxlY3Rvciwgb09wdHMpO1xuICAgIH07XG5cbiAgICB0aGlzLl8gPSBmdW5jdGlvbiAoc1NlbGVjdG9yLCBvT3B0cykge1xuICAgICAgcmV0dXJuIHRoaXMuYXBpKHRydWUpLnJvd3Moc1NlbGVjdG9yLCBvT3B0cykuZGF0YSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmFwaSA9IGZ1bmN0aW9uICh0cmFkaXRpb25hbCkge1xuICAgICAgcmV0dXJuIHRyYWRpdGlvbmFsID8gbmV3IF9BcGkyKF9mblNldHRpbmdzRnJvbU5vZGUodGhpc1tfZXh0LmlBcGlJbmRleF0pKSA6IG5ldyBfQXBpMih0aGlzKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mbkFkZERhdGEgPSBmdW5jdGlvbiAoZGF0YSwgcmVkcmF3KSB7XG4gICAgICB2YXIgYXBpID0gdGhpcy5hcGkodHJ1ZSk7XG4gICAgICB2YXIgcm93cyA9ICQuaXNBcnJheShkYXRhKSAmJiAoJC5pc0FycmF5KGRhdGFbMF0pIHx8ICQuaXNQbGFpbk9iamVjdChkYXRhWzBdKSkgPyBhcGkucm93cy5hZGQoZGF0YSkgOiBhcGkucm93LmFkZChkYXRhKTtcblxuICAgICAgaWYgKHJlZHJhdyA9PT0gdW5kZWZpbmVkIHx8IHJlZHJhdykge1xuICAgICAgICBhcGkuZHJhdygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcm93cy5mbGF0dGVuKCkudG9BcnJheSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmZuQWRqdXN0Q29sdW1uU2l6aW5nID0gZnVuY3Rpb24gKGJSZWRyYXcpIHtcbiAgICAgIHZhciBhcGkgPSB0aGlzLmFwaSh0cnVlKS5jb2x1bW5zLmFkanVzdCgpO1xuICAgICAgdmFyIHNldHRpbmdzID0gYXBpLnNldHRpbmdzKClbMF07XG4gICAgICB2YXIgc2Nyb2xsID0gc2V0dGluZ3Mub1Njcm9sbDtcblxuICAgICAgaWYgKGJSZWRyYXcgPT09IHVuZGVmaW5lZCB8fCBiUmVkcmF3KSB7XG4gICAgICAgIGFwaS5kcmF3KGZhbHNlKTtcbiAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsLnNYICE9PSBcIlwiIHx8IHNjcm9sbC5zWSAhPT0gXCJcIikge1xuICAgICAgICBfZm5TY3JvbGxEcmF3KHNldHRpbmdzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5mbkNsZWFyVGFibGUgPSBmdW5jdGlvbiAoYlJlZHJhdykge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpLmNsZWFyKCk7XG5cbiAgICAgIGlmIChiUmVkcmF3ID09PSB1bmRlZmluZWQgfHwgYlJlZHJhdykge1xuICAgICAgICBhcGkuZHJhdygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmZuQ2xvc2UgPSBmdW5jdGlvbiAoblRyKSB7XG4gICAgICB0aGlzLmFwaSh0cnVlKS5yb3coblRyKS5jaGlsZC5oaWRlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuZm5EZWxldGVSb3cgPSBmdW5jdGlvbiAodGFyZ2V0LCBjYWxsYmFjaywgcmVkcmF3KSB7XG4gICAgICB2YXIgYXBpID0gdGhpcy5hcGkodHJ1ZSk7XG4gICAgICB2YXIgcm93cyA9IGFwaS5yb3dzKHRhcmdldCk7XG4gICAgICB2YXIgc2V0dGluZ3MgPSByb3dzLnNldHRpbmdzKClbMF07XG4gICAgICB2YXIgZGF0YSA9IHNldHRpbmdzLmFvRGF0YVtyb3dzWzBdWzBdXTtcbiAgICAgIHJvd3MucmVtb3ZlKCk7XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIHNldHRpbmdzLCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlZHJhdyA9PT0gdW5kZWZpbmVkIHx8IHJlZHJhdykge1xuICAgICAgICBhcGkuZHJhdygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9O1xuXG4gICAgdGhpcy5mbkRlc3Ryb3kgPSBmdW5jdGlvbiAocmVtb3ZlKSB7XG4gICAgICB0aGlzLmFwaSh0cnVlKS5kZXN0cm95KHJlbW92ZSk7XG4gICAgfTtcblxuICAgIHRoaXMuZm5EcmF3ID0gZnVuY3Rpb24gKGNvbXBsZXRlKSB7XG4gICAgICB0aGlzLmFwaSh0cnVlKS5kcmF3KGNvbXBsZXRlKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mbkZpbHRlciA9IGZ1bmN0aW9uIChzSW5wdXQsIGlDb2x1bW4sIGJSZWdleCwgYlNtYXJ0LCBiU2hvd0dsb2JhbCwgYkNhc2VJbnNlbnNpdGl2ZSkge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpO1xuXG4gICAgICBpZiAoaUNvbHVtbiA9PT0gbnVsbCB8fCBpQ29sdW1uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXBpLnNlYXJjaChzSW5wdXQsIGJSZWdleCwgYlNtYXJ0LCBiQ2FzZUluc2Vuc2l0aXZlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwaS5jb2x1bW4oaUNvbHVtbikuc2VhcmNoKHNJbnB1dCwgYlJlZ2V4LCBiU21hcnQsIGJDYXNlSW5zZW5zaXRpdmUpO1xuICAgICAgfVxuXG4gICAgICBhcGkuZHJhdygpO1xuICAgIH07XG5cbiAgICB0aGlzLmZuR2V0RGF0YSA9IGZ1bmN0aW9uIChzcmMsIGNvbCkge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpO1xuXG4gICAgICBpZiAoc3JjICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBzcmMubm9kZU5hbWUgPyBzcmMubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA6ICcnO1xuICAgICAgICByZXR1cm4gY29sICE9PSB1bmRlZmluZWQgfHwgdHlwZSA9PSAndGQnIHx8IHR5cGUgPT0gJ3RoJyA/IGFwaS5jZWxsKHNyYywgY29sKS5kYXRhKCkgOiBhcGkucm93KHNyYykuZGF0YSgpIHx8IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhcGkuZGF0YSgpLnRvQXJyYXkoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mbkdldE5vZGVzID0gZnVuY3Rpb24gKGlSb3cpIHtcbiAgICAgIHZhciBhcGkgPSB0aGlzLmFwaSh0cnVlKTtcbiAgICAgIHJldHVybiBpUm93ICE9PSB1bmRlZmluZWQgPyBhcGkucm93KGlSb3cpLm5vZGUoKSA6IGFwaS5yb3dzKCkubm9kZXMoKS5mbGF0dGVuKCkudG9BcnJheSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmZuR2V0UG9zaXRpb24gPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpO1xuICAgICAgdmFyIG5vZGVOYW1lID0gbm9kZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICBpZiAobm9kZU5hbWUgPT0gJ1RSJykge1xuICAgICAgICByZXR1cm4gYXBpLnJvdyhub2RlKS5pbmRleCgpO1xuICAgICAgfSBlbHNlIGlmIChub2RlTmFtZSA9PSAnVEQnIHx8IG5vZGVOYW1lID09ICdUSCcpIHtcbiAgICAgICAgdmFyIGNlbGwgPSBhcGkuY2VsbChub2RlKS5pbmRleCgpO1xuICAgICAgICByZXR1cm4gW2NlbGwucm93LCBjZWxsLmNvbHVtblZpc2libGUsIGNlbGwuY29sdW1uXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIHRoaXMuZm5Jc09wZW4gPSBmdW5jdGlvbiAoblRyKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcGkodHJ1ZSkucm93KG5UcikuY2hpbGQuaXNTaG93bigpO1xuICAgIH07XG5cbiAgICB0aGlzLmZuT3BlbiA9IGZ1bmN0aW9uIChuVHIsIG1IdG1sLCBzQ2xhc3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmFwaSh0cnVlKS5yb3coblRyKS5jaGlsZChtSHRtbCwgc0NsYXNzKS5zaG93KCkuY2hpbGQoKVswXTtcbiAgICB9O1xuXG4gICAgdGhpcy5mblBhZ2VDaGFuZ2UgPSBmdW5jdGlvbiAobUFjdGlvbiwgYlJlZHJhdykge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpLnBhZ2UobUFjdGlvbik7XG5cbiAgICAgIGlmIChiUmVkcmF3ID09PSB1bmRlZmluZWQgfHwgYlJlZHJhdykge1xuICAgICAgICBhcGkuZHJhdyhmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuZm5TZXRDb2x1bW5WaXMgPSBmdW5jdGlvbiAoaUNvbCwgYlNob3csIGJSZWRyYXcpIHtcbiAgICAgIHZhciBhcGkgPSB0aGlzLmFwaSh0cnVlKS5jb2x1bW4oaUNvbCkudmlzaWJsZShiU2hvdyk7XG5cbiAgICAgIGlmIChiUmVkcmF3ID09PSB1bmRlZmluZWQgfHwgYlJlZHJhdykge1xuICAgICAgICBhcGkuY29sdW1ucy5hZGp1c3QoKS5kcmF3KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuZm5TZXR0aW5ncyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBfZm5TZXR0aW5nc0Zyb21Ob2RlKHRoaXNbX2V4dC5pQXBpSW5kZXhdKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mblNvcnQgPSBmdW5jdGlvbiAoYWFTb3J0KSB7XG4gICAgICB0aGlzLmFwaSh0cnVlKS5vcmRlcihhYVNvcnQpLmRyYXcoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mblNvcnRMaXN0ZW5lciA9IGZ1bmN0aW9uIChuTm9kZSwgaUNvbHVtbiwgZm5DYWxsYmFjaykge1xuICAgICAgdGhpcy5hcGkodHJ1ZSkub3JkZXIubGlzdGVuZXIobk5vZGUsIGlDb2x1bW4sIGZuQ2FsbGJhY2spO1xuICAgIH07XG5cbiAgICB0aGlzLmZuVXBkYXRlID0gZnVuY3Rpb24gKG1EYXRhLCBtUm93LCBpQ29sdW1uLCBiUmVkcmF3LCBiQWN0aW9uKSB7XG4gICAgICB2YXIgYXBpID0gdGhpcy5hcGkodHJ1ZSk7XG5cbiAgICAgIGlmIChpQ29sdW1uID09PSB1bmRlZmluZWQgfHwgaUNvbHVtbiA9PT0gbnVsbCkge1xuICAgICAgICBhcGkucm93KG1Sb3cpLmRhdGEobURhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBpLmNlbGwobVJvdywgaUNvbHVtbikuZGF0YShtRGF0YSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChiQWN0aW9uID09PSB1bmRlZmluZWQgfHwgYkFjdGlvbikge1xuICAgICAgICBhcGkuY29sdW1ucy5hZGp1c3QoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGJSZWRyYXcgPT09IHVuZGVmaW5lZCB8fCBiUmVkcmF3KSB7XG4gICAgICAgIGFwaS5kcmF3KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAwO1xuICAgIH07XG5cbiAgICB0aGlzLmZuVmVyc2lvbkNoZWNrID0gX2V4dC5mblZlcnNpb25DaGVjaztcblxuICAgIHZhciBfdGhhdCA9IHRoaXM7XG5cbiAgICB2YXIgZW1wdHlJbml0ID0gb3B0aW9ucyA9PT0gdW5kZWZpbmVkO1xuICAgIHZhciBsZW4gPSB0aGlzLmxlbmd0aDtcblxuICAgIGlmIChlbXB0eUluaXQpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLm9BcGkgPSB0aGlzLmludGVybmFsID0gX2V4dC5pbnRlcm5hbDtcblxuICAgIGZvciAodmFyIGZuIGluIERhdGFUYWJsZS5leHQuaW50ZXJuYWwpIHtcbiAgICAgIGlmIChmbikge1xuICAgICAgICB0aGlzW2ZuXSA9IF9mbkV4dGVybkFwaUZ1bmMoZm4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbyA9IHt9O1xuICAgICAgdmFyIG9Jbml0ID0gbGVuID4gMSA/IF9mbkV4dGVuZChvLCBvcHRpb25zLCB0cnVlKSA6IG9wdGlvbnM7XG4gICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgaUxlbixcbiAgICAgICAgICBqLFxuICAgICAgICAgIGpMZW4sXG4gICAgICAgICAgayxcbiAgICAgICAgICBrTGVuO1xuICAgICAgdmFyIHNJZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgdmFyIGJJbml0SGFuZGVkT2ZmID0gZmFsc2U7XG4gICAgICB2YXIgZGVmYXVsdHMgPSBEYXRhVGFibGUuZGVmYXVsdHM7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICBpZiAodGhpcy5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9ICd0YWJsZScpIHtcbiAgICAgICAgX2ZuTG9nKG51bGwsIDAsICdOb24tdGFibGUgbm9kZSBpbml0aWFsaXNhdGlvbiAoJyArIHRoaXMubm9kZU5hbWUgKyAnKScsIDIpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgX2ZuQ29tcGF0T3B0cyhkZWZhdWx0cyk7XG5cbiAgICAgIF9mbkNvbXBhdENvbHMoZGVmYXVsdHMuY29sdW1uKTtcblxuICAgICAgX2ZuQ2FtZWxUb0h1bmdhcmlhbihkZWZhdWx0cywgZGVmYXVsdHMsIHRydWUpO1xuXG4gICAgICBfZm5DYW1lbFRvSHVuZ2FyaWFuKGRlZmF1bHRzLmNvbHVtbiwgZGVmYXVsdHMuY29sdW1uLCB0cnVlKTtcblxuICAgICAgX2ZuQ2FtZWxUb0h1bmdhcmlhbihkZWZhdWx0cywgJC5leHRlbmQob0luaXQsICR0aGlzLmRhdGEoKSkpO1xuXG4gICAgICB2YXIgYWxsU2V0dGluZ3MgPSBEYXRhVGFibGUuc2V0dGluZ3M7XG5cbiAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhbGxTZXR0aW5ncy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgdmFyIHMgPSBhbGxTZXR0aW5nc1tpXTtcblxuICAgICAgICBpZiAocy5uVGFibGUgPT0gdGhpcyB8fCBzLm5USGVhZCAmJiBzLm5USGVhZC5wYXJlbnROb2RlID09IHRoaXMgfHwgcy5uVEZvb3QgJiYgcy5uVEZvb3QucGFyZW50Tm9kZSA9PSB0aGlzKSB7XG4gICAgICAgICAgdmFyIGJSZXRyaWV2ZSA9IG9Jbml0LmJSZXRyaWV2ZSAhPT0gdW5kZWZpbmVkID8gb0luaXQuYlJldHJpZXZlIDogZGVmYXVsdHMuYlJldHJpZXZlO1xuICAgICAgICAgIHZhciBiRGVzdHJveSA9IG9Jbml0LmJEZXN0cm95ICE9PSB1bmRlZmluZWQgPyBvSW5pdC5iRGVzdHJveSA6IGRlZmF1bHRzLmJEZXN0cm95O1xuXG4gICAgICAgICAgaWYgKGVtcHR5SW5pdCB8fCBiUmV0cmlldmUpIHtcbiAgICAgICAgICAgIHJldHVybiBzLm9JbnN0YW5jZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGJEZXN0cm95KSB7XG4gICAgICAgICAgICBzLm9JbnN0YW5jZS5mbkRlc3Ryb3koKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfZm5Mb2cocywgMCwgJ0Nhbm5vdCByZWluaXRpYWxpc2UgRGF0YVRhYmxlJywgMyk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocy5zVGFibGVJZCA9PSB0aGlzLmlkKSB7XG4gICAgICAgICAgYWxsU2V0dGluZ3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzSWQgPT09IG51bGwgfHwgc0lkID09PSBcIlwiKSB7XG4gICAgICAgIHNJZCA9IFwiRGF0YVRhYmxlc19UYWJsZV9cIiArIERhdGFUYWJsZS5leHQuX3VuaXF1ZSsrO1xuICAgICAgICB0aGlzLmlkID0gc0lkO1xuICAgICAgfVxuXG4gICAgICB2YXIgb1NldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwge30sIERhdGFUYWJsZS5tb2RlbHMub1NldHRpbmdzLCB7XG4gICAgICAgIFwic0Rlc3Ryb3lXaWR0aFwiOiAkdGhpc1swXS5zdHlsZS53aWR0aCxcbiAgICAgICAgXCJzSW5zdGFuY2VcIjogc0lkLFxuICAgICAgICBcInNUYWJsZUlkXCI6IHNJZFxuICAgICAgfSk7XG4gICAgICBvU2V0dGluZ3MublRhYmxlID0gdGhpcztcbiAgICAgIG9TZXR0aW5ncy5vQXBpID0gX3RoYXQuaW50ZXJuYWw7XG4gICAgICBvU2V0dGluZ3Mub0luaXQgPSBvSW5pdDtcbiAgICAgIGFsbFNldHRpbmdzLnB1c2gob1NldHRpbmdzKTtcbiAgICAgIG9TZXR0aW5ncy5vSW5zdGFuY2UgPSBfdGhhdC5sZW5ndGggPT09IDEgPyBfdGhhdCA6ICR0aGlzLmRhdGFUYWJsZSgpO1xuXG4gICAgICBfZm5Db21wYXRPcHRzKG9Jbml0KTtcblxuICAgICAgX2ZuTGFuZ3VhZ2VDb21wYXQob0luaXQub0xhbmd1YWdlKTtcblxuICAgICAgaWYgKG9Jbml0LmFMZW5ndGhNZW51ICYmICFvSW5pdC5pRGlzcGxheUxlbmd0aCkge1xuICAgICAgICBvSW5pdC5pRGlzcGxheUxlbmd0aCA9ICQuaXNBcnJheShvSW5pdC5hTGVuZ3RoTWVudVswXSkgPyBvSW5pdC5hTGVuZ3RoTWVudVswXVswXSA6IG9Jbml0LmFMZW5ndGhNZW51WzBdO1xuICAgICAgfVxuXG4gICAgICBvSW5pdCA9IF9mbkV4dGVuZCgkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMpLCBvSW5pdCk7XG5cbiAgICAgIF9mbk1hcChvU2V0dGluZ3Mub0ZlYXR1cmVzLCBvSW5pdCwgW1wiYlBhZ2luYXRlXCIsIFwiYkxlbmd0aENoYW5nZVwiLCBcImJGaWx0ZXJcIiwgXCJiU29ydFwiLCBcImJTb3J0TXVsdGlcIiwgXCJiSW5mb1wiLCBcImJQcm9jZXNzaW5nXCIsIFwiYkF1dG9XaWR0aFwiLCBcImJTb3J0Q2xhc3Nlc1wiLCBcImJTZXJ2ZXJTaWRlXCIsIFwiYkRlZmVyUmVuZGVyXCJdKTtcblxuICAgICAgX2ZuTWFwKG9TZXR0aW5ncywgb0luaXQsIFtcImFzU3RyaXBlQ2xhc3Nlc1wiLCBcImFqYXhcIiwgXCJmblNlcnZlckRhdGFcIiwgXCJmbkZvcm1hdE51bWJlclwiLCBcInNTZXJ2ZXJNZXRob2RcIiwgXCJhYVNvcnRpbmdcIiwgXCJhYVNvcnRpbmdGaXhlZFwiLCBcImFMZW5ndGhNZW51XCIsIFwic1BhZ2luYXRpb25UeXBlXCIsIFwic0FqYXhTb3VyY2VcIiwgXCJzQWpheERhdGFQcm9wXCIsIFwiaVN0YXRlRHVyYXRpb25cIiwgXCJzRG9tXCIsIFwiYlNvcnRDZWxsc1RvcFwiLCBcImlUYWJJbmRleFwiLCBcImZuU3RhdGVMb2FkQ2FsbGJhY2tcIiwgXCJmblN0YXRlU2F2ZUNhbGxiYWNrXCIsIFwicmVuZGVyZXJcIiwgXCJzZWFyY2hEZWxheVwiLCBcInJvd0lkXCIsIFtcImlDb29raWVEdXJhdGlvblwiLCBcImlTdGF0ZUR1cmF0aW9uXCJdLCBbXCJvU2VhcmNoXCIsIFwib1ByZXZpb3VzU2VhcmNoXCJdLCBbXCJhb1NlYXJjaENvbHNcIiwgXCJhb1ByZVNlYXJjaENvbHNcIl0sIFtcImlEaXNwbGF5TGVuZ3RoXCIsIFwiX2lEaXNwbGF5TGVuZ3RoXCJdXSk7XG5cbiAgICAgIF9mbk1hcChvU2V0dGluZ3Mub1Njcm9sbCwgb0luaXQsIFtbXCJzU2Nyb2xsWFwiLCBcInNYXCJdLCBbXCJzU2Nyb2xsWElubmVyXCIsIFwic1hJbm5lclwiXSwgW1wic1Njcm9sbFlcIiwgXCJzWVwiXSwgW1wiYlNjcm9sbENvbGxhcHNlXCIsIFwiYkNvbGxhcHNlXCJdXSk7XG5cbiAgICAgIF9mbk1hcChvU2V0dGluZ3Mub0xhbmd1YWdlLCBvSW5pdCwgXCJmbkluZm9DYWxsYmFja1wiKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9EcmF3Q2FsbGJhY2snLCBvSW5pdC5mbkRyYXdDYWxsYmFjaywgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9TZXJ2ZXJQYXJhbXMnLCBvSW5pdC5mblNlcnZlclBhcmFtcywgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9TdGF0ZVNhdmVQYXJhbXMnLCBvSW5pdC5mblN0YXRlU2F2ZVBhcmFtcywgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9TdGF0ZUxvYWRQYXJhbXMnLCBvSW5pdC5mblN0YXRlTG9hZFBhcmFtcywgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9TdGF0ZUxvYWRlZCcsIG9Jbml0LmZuU3RhdGVMb2FkZWQsICd1c2VyJyk7XG5cbiAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvUm93Q2FsbGJhY2snLCBvSW5pdC5mblJvd0NhbGxiYWNrLCAndXNlcicpO1xuXG4gICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb1Jvd0NyZWF0ZWRDYWxsYmFjaycsIG9Jbml0LmZuQ3JlYXRlZFJvdywgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9IZWFkZXJDYWxsYmFjaycsIG9Jbml0LmZuSGVhZGVyQ2FsbGJhY2ssICd1c2VyJyk7XG5cbiAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvRm9vdGVyQ2FsbGJhY2snLCBvSW5pdC5mbkZvb3RlckNhbGxiYWNrLCAndXNlcicpO1xuXG4gICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb0luaXRDb21wbGV0ZScsIG9Jbml0LmZuSW5pdENvbXBsZXRlLCAndXNlcicpO1xuXG4gICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb1ByZURyYXdDYWxsYmFjaycsIG9Jbml0LmZuUHJlRHJhd0NhbGxiYWNrLCAndXNlcicpO1xuXG4gICAgICBvU2V0dGluZ3Mucm93SWRGbiA9IF9mbkdldE9iamVjdERhdGFGbihvSW5pdC5yb3dJZCk7XG5cbiAgICAgIF9mbkJyb3dzZXJEZXRlY3Qob1NldHRpbmdzKTtcblxuICAgICAgdmFyIG9DbGFzc2VzID0gb1NldHRpbmdzLm9DbGFzc2VzO1xuICAgICAgJC5leHRlbmQob0NsYXNzZXMsIERhdGFUYWJsZS5leHQuY2xhc3Nlcywgb0luaXQub0NsYXNzZXMpO1xuICAgICAgJHRoaXMuYWRkQ2xhc3Mob0NsYXNzZXMuc1RhYmxlKTtcblxuICAgICAgaWYgKG9TZXR0aW5ncy5pSW5pdERpc3BsYXlTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9TZXR0aW5ncy5pSW5pdERpc3BsYXlTdGFydCA9IG9Jbml0LmlEaXNwbGF5U3RhcnQ7XG4gICAgICAgIG9TZXR0aW5ncy5faURpc3BsYXlTdGFydCA9IG9Jbml0LmlEaXNwbGF5U3RhcnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChvSW5pdC5pRGVmZXJMb2FkaW5nICE9PSBudWxsKSB7XG4gICAgICAgIG9TZXR0aW5ncy5iRGVmZXJMb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgdmFyIHRtcCA9ICQuaXNBcnJheShvSW5pdC5pRGVmZXJMb2FkaW5nKTtcbiAgICAgICAgb1NldHRpbmdzLl9pUmVjb3Jkc0Rpc3BsYXkgPSB0bXAgPyBvSW5pdC5pRGVmZXJMb2FkaW5nWzBdIDogb0luaXQuaURlZmVyTG9hZGluZztcbiAgICAgICAgb1NldHRpbmdzLl9pUmVjb3Jkc1RvdGFsID0gdG1wID8gb0luaXQuaURlZmVyTG9hZGluZ1sxXSA6IG9Jbml0LmlEZWZlckxvYWRpbmc7XG4gICAgICB9XG5cbiAgICAgIHZhciBvTGFuZ3VhZ2UgPSBvU2V0dGluZ3Mub0xhbmd1YWdlO1xuICAgICAgJC5leHRlbmQodHJ1ZSwgb0xhbmd1YWdlLCBvSW5pdC5vTGFuZ3VhZ2UpO1xuXG4gICAgICBpZiAob0xhbmd1YWdlLnNVcmwpIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgIHVybDogb0xhbmd1YWdlLnNVcmwsXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2Vzcyhqc29uKSB7XG4gICAgICAgICAgICBfZm5MYW5ndWFnZUNvbXBhdChqc29uKTtcblxuICAgICAgICAgICAgX2ZuQ2FtZWxUb0h1bmdhcmlhbihkZWZhdWx0cy5vTGFuZ3VhZ2UsIGpzb24pO1xuXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBvTGFuZ3VhZ2UsIGpzb24pO1xuXG4gICAgICAgICAgICBfZm5Jbml0aWFsaXNlKG9TZXR0aW5ncyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgICAgICAgICBfZm5Jbml0aWFsaXNlKG9TZXR0aW5ncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYkluaXRIYW5kZWRPZmYgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAob0luaXQuYXNTdHJpcGVDbGFzc2VzID09PSBudWxsKSB7XG4gICAgICAgIG9TZXR0aW5ncy5hc1N0cmlwZUNsYXNzZXMgPSBbb0NsYXNzZXMuc1N0cmlwZU9kZCwgb0NsYXNzZXMuc1N0cmlwZUV2ZW5dO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3RyaXBlQ2xhc3NlcyA9IG9TZXR0aW5ncy5hc1N0cmlwZUNsYXNzZXM7XG4gICAgICB2YXIgcm93T25lID0gJHRoaXMuY2hpbGRyZW4oJ3Rib2R5JykuZmluZCgndHInKS5lcSgwKTtcblxuICAgICAgaWYgKCQuaW5BcnJheSh0cnVlLCAkLm1hcChzdHJpcGVDbGFzc2VzLCBmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgcmV0dXJuIHJvd09uZS5oYXNDbGFzcyhlbCk7XG4gICAgICB9KSkgIT09IC0xKSB7XG4gICAgICAgICQoJ3Rib2R5IHRyJywgdGhpcykucmVtb3ZlQ2xhc3Moc3RyaXBlQ2xhc3Nlcy5qb2luKCcgJykpO1xuICAgICAgICBvU2V0dGluZ3MuYXNEZXN0cm95U3RyaXBlcyA9IHN0cmlwZUNsYXNzZXMuc2xpY2UoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGFuVGhzID0gW107XG4gICAgICB2YXIgYW9Db2x1bW5zSW5pdDtcbiAgICAgIHZhciBuVGhlYWQgPSB0aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aGVhZCcpO1xuXG4gICAgICBpZiAoblRoZWFkLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICBfZm5EZXRlY3RIZWFkZXIob1NldHRpbmdzLmFvSGVhZGVyLCBuVGhlYWRbMF0pO1xuXG4gICAgICAgIGFuVGhzID0gX2ZuR2V0VW5pcXVlVGhzKG9TZXR0aW5ncyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvSW5pdC5hb0NvbHVtbnMgPT09IG51bGwpIHtcbiAgICAgICAgYW9Db2x1bW5zSW5pdCA9IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhblRocy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgICBhb0NvbHVtbnNJbml0LnB1c2gobnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFvQ29sdW1uc0luaXQgPSBvSW5pdC5hb0NvbHVtbnM7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhb0NvbHVtbnNJbml0Lmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICBfZm5BZGRDb2x1bW4ob1NldHRpbmdzLCBhblRocyA/IGFuVGhzW2ldIDogbnVsbCk7XG4gICAgICB9XG5cbiAgICAgIF9mbkFwcGx5Q29sdW1uRGVmcyhvU2V0dGluZ3MsIG9Jbml0LmFvQ29sdW1uRGVmcywgYW9Db2x1bW5zSW5pdCwgZnVuY3Rpb24gKGlDb2wsIG9EZWYpIHtcbiAgICAgICAgX2ZuQ29sdW1uT3B0aW9ucyhvU2V0dGluZ3MsIGlDb2wsIG9EZWYpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChyb3dPbmUubGVuZ3RoKSB7XG4gICAgICAgIHZhciBhID0gZnVuY3Rpb24gYShjZWxsLCBuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLScgKyBuYW1lKSAhPT0gbnVsbCA/IG5hbWUgOiBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgICQocm93T25lWzBdKS5jaGlsZHJlbigndGgsIHRkJykuZWFjaChmdW5jdGlvbiAoaSwgY2VsbCkge1xuICAgICAgICAgIHZhciBjb2wgPSBvU2V0dGluZ3MuYW9Db2x1bW5zW2ldO1xuXG4gICAgICAgICAgaWYgKGNvbC5tRGF0YSA9PT0gaSkge1xuICAgICAgICAgICAgdmFyIHNvcnQgPSBhKGNlbGwsICdzb3J0JykgfHwgYShjZWxsLCAnb3JkZXInKTtcbiAgICAgICAgICAgIHZhciBmaWx0ZXIgPSBhKGNlbGwsICdmaWx0ZXInKSB8fCBhKGNlbGwsICdzZWFyY2gnKTtcblxuICAgICAgICAgICAgaWYgKHNvcnQgIT09IG51bGwgfHwgZmlsdGVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIGNvbC5tRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBfOiBpICsgJy5kaXNwbGF5JyxcbiAgICAgICAgICAgICAgICBzb3J0OiBzb3J0ICE9PSBudWxsID8gaSArICcuQGRhdGEtJyArIHNvcnQgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHlwZTogc29ydCAhPT0gbnVsbCA/IGkgKyAnLkBkYXRhLScgKyBzb3J0IDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogZmlsdGVyICE9PSBudWxsID8gaSArICcuQGRhdGEtJyArIGZpbHRlciA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIF9mbkNvbHVtbk9wdGlvbnMob1NldHRpbmdzLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmVhdHVyZXMgPSBvU2V0dGluZ3Mub0ZlYXR1cmVzO1xuXG4gICAgICB2YXIgbG9hZGVkSW5pdCA9IGZ1bmN0aW9uIGxvYWRlZEluaXQoKSB7XG4gICAgICAgIGlmIChvSW5pdC5hYVNvcnRpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBzb3J0aW5nID0gb1NldHRpbmdzLmFhU29ydGluZztcblxuICAgICAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBzb3J0aW5nLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICAgICAgc29ydGluZ1tpXVsxXSA9IG9TZXR0aW5ncy5hb0NvbHVtbnNbaV0uYXNTb3J0aW5nWzBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9mblNvcnRpbmdDbGFzc2VzKG9TZXR0aW5ncyk7XG5cbiAgICAgICAgaWYgKGZlYXR1cmVzLmJTb3J0KSB7XG4gICAgICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9EcmF3Q2FsbGJhY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAob1NldHRpbmdzLmJTb3J0ZWQpIHtcbiAgICAgICAgICAgICAgdmFyIGFTb3J0ID0gX2ZuU29ydEZsYXR0ZW4ob1NldHRpbmdzKTtcblxuICAgICAgICAgICAgICB2YXIgc29ydGVkQ29sdW1ucyA9IHt9O1xuICAgICAgICAgICAgICAkLmVhY2goYVNvcnQsIGZ1bmN0aW9uIChpLCB2YWwpIHtcbiAgICAgICAgICAgICAgICBzb3J0ZWRDb2x1bW5zW3ZhbC5zcmNdID0gdmFsLmRpcjtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgbnVsbCwgJ29yZGVyJywgW29TZXR0aW5ncywgYVNvcnQsIHNvcnRlZENvbHVtbnNdKTtcblxuICAgICAgICAgICAgICBfZm5Tb3J0QXJpYShvU2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9EcmF3Q2FsbGJhY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKG9TZXR0aW5ncy5iU29ydGVkIHx8IF9mbkRhdGFTb3VyY2Uob1NldHRpbmdzKSA9PT0gJ3NzcCcgfHwgZmVhdHVyZXMuYkRlZmVyUmVuZGVyKSB7XG4gICAgICAgICAgICBfZm5Tb3J0aW5nQ2xhc3NlcyhvU2V0dGluZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgJ3NjJyk7XG5cbiAgICAgICAgdmFyIGNhcHRpb25zID0gJHRoaXMuY2hpbGRyZW4oJ2NhcHRpb24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLl9jYXB0aW9uU2lkZSA9ICQodGhpcykuY3NzKCdjYXB0aW9uLXNpZGUnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciB0aGVhZCA9ICR0aGlzLmNoaWxkcmVuKCd0aGVhZCcpO1xuXG4gICAgICAgIGlmICh0aGVhZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGVhZCA9ICQoJzx0aGVhZC8+JykuYXBwZW5kVG8oJHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgb1NldHRpbmdzLm5USGVhZCA9IHRoZWFkWzBdO1xuICAgICAgICB2YXIgdGJvZHkgPSAkdGhpcy5jaGlsZHJlbigndGJvZHknKTtcblxuICAgICAgICBpZiAodGJvZHkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGJvZHkgPSAkKCc8dGJvZHkvPicpLmFwcGVuZFRvKCR0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9TZXR0aW5ncy5uVEJvZHkgPSB0Ym9keVswXTtcbiAgICAgICAgdmFyIHRmb290ID0gJHRoaXMuY2hpbGRyZW4oJ3Rmb290Jyk7XG5cbiAgICAgICAgaWYgKHRmb290Lmxlbmd0aCA9PT0gMCAmJiBjYXB0aW9ucy5sZW5ndGggPiAwICYmIChvU2V0dGluZ3Mub1Njcm9sbC5zWCAhPT0gXCJcIiB8fCBvU2V0dGluZ3Mub1Njcm9sbC5zWSAhPT0gXCJcIikpIHtcbiAgICAgICAgICB0Zm9vdCA9ICQoJzx0Zm9vdC8+JykuYXBwZW5kVG8oJHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRmb290Lmxlbmd0aCA9PT0gMCB8fCB0Zm9vdC5jaGlsZHJlbigpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICR0aGlzLmFkZENsYXNzKG9DbGFzc2VzLnNOb0Zvb3Rlcik7XG4gICAgICAgIH0gZWxzZSBpZiAodGZvb3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgIG9TZXR0aW5ncy5uVEZvb3QgPSB0Zm9vdFswXTtcblxuICAgICAgICAgIF9mbkRldGVjdEhlYWRlcihvU2V0dGluZ3MuYW9Gb290ZXIsIG9TZXR0aW5ncy5uVEZvb3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9Jbml0LmFhRGF0YSkge1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvSW5pdC5hYURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIF9mbkFkZERhdGEob1NldHRpbmdzLCBvSW5pdC5hYURhdGFbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvU2V0dGluZ3MuYkRlZmVyTG9hZGluZyB8fCBfZm5EYXRhU291cmNlKG9TZXR0aW5ncykgPT0gJ2RvbScpIHtcbiAgICAgICAgICBfZm5BZGRUcihvU2V0dGluZ3MsICQob1NldHRpbmdzLm5UQm9keSkuY2hpbGRyZW4oJ3RyJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgb1NldHRpbmdzLmFpRGlzcGxheSA9IG9TZXR0aW5ncy5haURpc3BsYXlNYXN0ZXIuc2xpY2UoKTtcbiAgICAgICAgb1NldHRpbmdzLmJJbml0aWFsaXNlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGJJbml0SGFuZGVkT2ZmID09PSBmYWxzZSkge1xuICAgICAgICAgIF9mbkluaXRpYWxpc2Uob1NldHRpbmdzKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKG9Jbml0LmJTdGF0ZVNhdmUpIHtcbiAgICAgICAgZmVhdHVyZXMuYlN0YXRlU2F2ZSA9IHRydWU7XG5cbiAgICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9EcmF3Q2FsbGJhY2snLCBfZm5TYXZlU3RhdGUsICdzdGF0ZV9zYXZlJyk7XG5cbiAgICAgICAgX2ZuTG9hZFN0YXRlKG9TZXR0aW5ncywgb0luaXQsIGxvYWRlZEluaXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9hZGVkSW5pdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIF90aGF0ID0gbnVsbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgX2V4dDtcblxuICB2YXIgX0FwaTI7XG5cbiAgdmFyIF9hcGlfcmVnaXN0ZXI7XG5cbiAgdmFyIF9hcGlfcmVnaXN0ZXJQbHVyYWw7XG5cbiAgdmFyIF9yZV9kaWMgPSB7fTtcbiAgdmFyIF9yZV9uZXdfbGluZXMgPSAvW1xcclxcbl0vZztcbiAgdmFyIF9yZV9odG1sID0gLzwuKj8+L2c7XG4gIHZhciBfcmVfZGF0ZSA9IC9eXFxkezIsNH1bXFwuXFwvXFwtXVxcZHsxLDJ9W1xcLlxcL1xcLV1cXGR7MSwyfShbVCBdezF9XFxkezEsMn1bOlxcLl1cXGR7Mn0oW1xcLjpdXFxkezJ9KT8pPyQvO1xuXG4gIHZhciBfcmVfZXNjYXBlX3JlZ2V4ID0gbmV3IFJlZ0V4cCgnKFxcXFwnICsgWycvJywgJy4nLCAnKicsICcrJywgJz8nLCAnfCcsICcoJywgJyknLCAnWycsICddJywgJ3snLCAnfScsICdcXFxcJywgJyQnLCAnXicsICctJ10uam9pbignfFxcXFwnKSArICcpJywgJ2cnKTtcblxuICB2YXIgX3JlX2Zvcm1hdHRlZF9udW1lcmljID0gL1snLCTCo+KCrMKlJVxcdTIwMDlcXHUyMDJGXFx1MjBCRFxcdTIwYTlcXHUyMEJBcmZryYPOnl0vZ2k7XG5cbiAgdmFyIF9lbXB0eSA9IGZ1bmN0aW9uIF9lbXB0eShkKSB7XG4gICAgcmV0dXJuICFkIHx8IGQgPT09IHRydWUgfHwgZCA9PT0gJy0nID8gdHJ1ZSA6IGZhbHNlO1xuICB9O1xuXG4gIHZhciBfaW50VmFsID0gZnVuY3Rpb24gX2ludFZhbChzKSB7XG4gICAgdmFyIGludGVnZXIgPSBwYXJzZUludChzLCAxMCk7XG4gICAgcmV0dXJuICFpc05hTihpbnRlZ2VyKSAmJiBpc0Zpbml0ZShzKSA/IGludGVnZXIgOiBudWxsO1xuICB9O1xuXG4gIHZhciBfbnVtVG9EZWNpbWFsID0gZnVuY3Rpb24gX251bVRvRGVjaW1hbChudW0sIGRlY2ltYWxQb2ludCkge1xuICAgIGlmICghX3JlX2RpY1tkZWNpbWFsUG9pbnRdKSB7XG4gICAgICBfcmVfZGljW2RlY2ltYWxQb2ludF0gPSBuZXcgUmVnRXhwKF9mbkVzY2FwZVJlZ2V4KGRlY2ltYWxQb2ludCksICdnJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHR5cGVvZiBudW0gPT09ICdzdHJpbmcnICYmIGRlY2ltYWxQb2ludCAhPT0gJy4nID8gbnVtLnJlcGxhY2UoL1xcLi9nLCAnJykucmVwbGFjZShfcmVfZGljW2RlY2ltYWxQb2ludF0sICcuJykgOiBudW07XG4gIH07XG5cbiAgdmFyIF9pc051bWJlciA9IGZ1bmN0aW9uIF9pc051bWJlcihkLCBkZWNpbWFsUG9pbnQsIGZvcm1hdHRlZCkge1xuICAgIHZhciBzdHJUeXBlID0gdHlwZW9mIGQgPT09ICdzdHJpbmcnO1xuXG4gICAgaWYgKF9lbXB0eShkKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRlY2ltYWxQb2ludCAmJiBzdHJUeXBlKSB7XG4gICAgICBkID0gX251bVRvRGVjaW1hbChkLCBkZWNpbWFsUG9pbnQpO1xuICAgIH1cblxuICAgIGlmIChmb3JtYXR0ZWQgJiYgc3RyVHlwZSkge1xuICAgICAgZCA9IGQucmVwbGFjZShfcmVfZm9ybWF0dGVkX251bWVyaWMsICcnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQoZCkpICYmIGlzRmluaXRlKGQpO1xuICB9O1xuXG4gIHZhciBfaXNIdG1sID0gZnVuY3Rpb24gX2lzSHRtbChkKSB7XG4gICAgcmV0dXJuIF9lbXB0eShkKSB8fCB0eXBlb2YgZCA9PT0gJ3N0cmluZyc7XG4gIH07XG5cbiAgdmFyIF9odG1sTnVtZXJpYyA9IGZ1bmN0aW9uIF9odG1sTnVtZXJpYyhkLCBkZWNpbWFsUG9pbnQsIGZvcm1hdHRlZCkge1xuICAgIGlmIChfZW1wdHkoZCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciBodG1sID0gX2lzSHRtbChkKTtcblxuICAgIHJldHVybiAhaHRtbCA/IG51bGwgOiBfaXNOdW1iZXIoX3N0cmlwSHRtbChkKSwgZGVjaW1hbFBvaW50LCBmb3JtYXR0ZWQpID8gdHJ1ZSA6IG51bGw7XG4gIH07XG5cbiAgdmFyIF9wbHVjayA9IGZ1bmN0aW9uIF9wbHVjayhhLCBwcm9wLCBwcm9wMikge1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGllbiA9IGEubGVuZ3RoO1xuXG4gICAgaWYgKHByb3AyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgaWYgKGFbaV0gJiYgYVtpXVtwcm9wXSkge1xuICAgICAgICAgIG91dC5wdXNoKGFbaV1bcHJvcF1bcHJvcDJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGlmIChhW2ldKSB7XG4gICAgICAgICAgb3V0LnB1c2goYVtpXVtwcm9wXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIHZhciBfcGx1Y2tfb3JkZXIgPSBmdW5jdGlvbiBfcGx1Y2tfb3JkZXIoYSwgb3JkZXIsIHByb3AsIHByb3AyKSB7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgaWVuID0gb3JkZXIubGVuZ3RoO1xuXG4gICAgaWYgKHByb3AyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgaWYgKGFbb3JkZXJbaV1dW3Byb3BdKSB7XG4gICAgICAgICAgb3V0LnB1c2goYVtvcmRlcltpXV1bcHJvcF1bcHJvcDJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIG91dC5wdXNoKGFbb3JkZXJbaV1dW3Byb3BdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIHZhciBfcmFuZ2UgPSBmdW5jdGlvbiBfcmFuZ2UobGVuLCBzdGFydCkge1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICB2YXIgZW5kO1xuXG4gICAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICAgIGVuZCA9IGxlbjtcbiAgICB9IGVsc2Uge1xuICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICBzdGFydCA9IGxlbjtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgb3V0LnB1c2goaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICB2YXIgX3JlbW92ZUVtcHR5ID0gZnVuY3Rpb24gX3JlbW92ZUVtcHR5KGEpIHtcbiAgICB2YXIgb3V0ID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gYS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgaWYgKGFbaV0pIHtcbiAgICAgICAgb3V0LnB1c2goYVtpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICB2YXIgX3N0cmlwSHRtbCA9IGZ1bmN0aW9uIF9zdHJpcEh0bWwoZCkge1xuICAgIHJldHVybiBkLnJlcGxhY2UoX3JlX2h0bWwsICcnKTtcbiAgfTtcblxuICB2YXIgX2FyZUFsbFVuaXF1ZSA9IGZ1bmN0aW9uIF9hcmVBbGxVbmlxdWUoc3JjKSB7XG4gICAgaWYgKHNyYy5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgc29ydGVkID0gc3JjLnNsaWNlKCkuc29ydCgpO1xuICAgIHZhciBsYXN0ID0gc29ydGVkWzBdO1xuXG4gICAgZm9yICh2YXIgaSA9IDEsIGllbiA9IHNvcnRlZC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgaWYgKHNvcnRlZFtpXSA9PT0gbGFzdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGxhc3QgPSBzb3J0ZWRbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgdmFyIF91bmlxdWUgPSBmdW5jdGlvbiBfdW5pcXVlKHNyYykge1xuICAgIGlmIChfYXJlQWxsVW5pcXVlKHNyYykpIHtcbiAgICAgIHJldHVybiBzcmMuc2xpY2UoKTtcbiAgICB9XG5cbiAgICB2YXIgb3V0ID0gW10sXG4gICAgICAgIHZhbCxcbiAgICAgICAgaSxcbiAgICAgICAgaWVuID0gc3JjLmxlbmd0aCxcbiAgICAgICAgaixcbiAgICAgICAgayA9IDA7XG5cbiAgICBhZ2FpbjogZm9yIChpID0gMDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICB2YWwgPSBzcmNbaV07XG5cbiAgICAgIGZvciAoaiA9IDA7IGogPCBrOyBqKyspIHtcbiAgICAgICAgaWYgKG91dFtqXSA9PT0gdmFsKSB7XG4gICAgICAgICAgY29udGludWUgYWdhaW47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgb3V0LnB1c2godmFsKTtcbiAgICAgIGsrKztcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIERhdGFUYWJsZS51dGlsID0ge1xuICAgIHRocm90dGxlOiBmdW5jdGlvbiB0aHJvdHRsZShmbiwgZnJlcSkge1xuICAgICAgdmFyIGZyZXF1ZW5jeSA9IGZyZXEgIT09IHVuZGVmaW5lZCA/IGZyZXEgOiAyMDAsXG4gICAgICAgICAgbGFzdCxcbiAgICAgICAgICB0aW1lcjtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIG5vdyA9ICtuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBpZiAobGFzdCAmJiBub3cgPCBsYXN0ICsgZnJlcXVlbmN5KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGFzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICAgICAgICAgIH0sIGZyZXF1ZW5jeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGFzdCA9IG5vdztcbiAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGVzY2FwZVJlZ2V4OiBmdW5jdGlvbiBlc2NhcGVSZWdleCh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwucmVwbGFjZShfcmVfZXNjYXBlX3JlZ2V4LCAnXFxcXCQxJyk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIF9mbkh1bmdhcmlhbk1hcChvKSB7XG4gICAgdmFyIGh1bmdhcmlhbiA9ICdhIGFhIGFpIGFvIGFzIGIgZm4gaSBtIG8gcyAnLFxuICAgICAgICBtYXRjaCxcbiAgICAgICAgbmV3S2V5LFxuICAgICAgICBtYXAgPSB7fTtcbiAgICAkLmVhY2gobywgZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgICBtYXRjaCA9IGtleS5tYXRjaCgvXihbXkEtWl0rPykoW0EtWl0pLyk7XG5cbiAgICAgIGlmIChtYXRjaCAmJiBodW5nYXJpYW4uaW5kZXhPZihtYXRjaFsxXSArICcgJykgIT09IC0xKSB7XG4gICAgICAgIG5ld0tleSA9IGtleS5yZXBsYWNlKG1hdGNoWzBdLCBtYXRjaFsyXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgbWFwW25ld0tleV0gPSBrZXk7XG5cbiAgICAgICAgaWYgKG1hdGNoWzFdID09PSAnbycpIHtcbiAgICAgICAgICBfZm5IdW5nYXJpYW5NYXAob1trZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIG8uX2h1bmdhcmlhbk1hcCA9IG1hcDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNhbWVsVG9IdW5nYXJpYW4oc3JjLCB1c2VyLCBmb3JjZSkge1xuICAgIGlmICghc3JjLl9odW5nYXJpYW5NYXApIHtcbiAgICAgIF9mbkh1bmdhcmlhbk1hcChzcmMpO1xuICAgIH1cblxuICAgIHZhciBodW5nYXJpYW5LZXk7XG4gICAgJC5lYWNoKHVzZXIsIGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgICAgaHVuZ2FyaWFuS2V5ID0gc3JjLl9odW5nYXJpYW5NYXBba2V5XTtcblxuICAgICAgaWYgKGh1bmdhcmlhbktleSAhPT0gdW5kZWZpbmVkICYmIChmb3JjZSB8fCB1c2VyW2h1bmdhcmlhbktleV0gPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgaWYgKGh1bmdhcmlhbktleS5jaGFyQXQoMCkgPT09ICdvJykge1xuICAgICAgICAgIGlmICghdXNlcltodW5nYXJpYW5LZXldKSB7XG4gICAgICAgICAgICB1c2VyW2h1bmdhcmlhbktleV0gPSB7fTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkLmV4dGVuZCh0cnVlLCB1c2VyW2h1bmdhcmlhbktleV0sIHVzZXJba2V5XSk7XG5cbiAgICAgICAgICBfZm5DYW1lbFRvSHVuZ2FyaWFuKHNyY1todW5nYXJpYW5LZXldLCB1c2VyW2h1bmdhcmlhbktleV0sIGZvcmNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1c2VyW2h1bmdhcmlhbktleV0gPSB1c2VyW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkxhbmd1YWdlQ29tcGF0KGxhbmcpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSBEYXRhVGFibGUuZGVmYXVsdHMub0xhbmd1YWdlO1xuICAgIHZhciBkZWZhdWx0RGVjaW1hbCA9IGRlZmF1bHRzLnNEZWNpbWFsO1xuXG4gICAgaWYgKGRlZmF1bHREZWNpbWFsKSB7XG4gICAgICBfYWRkTnVtZXJpY1NvcnQoZGVmYXVsdERlY2ltYWwpO1xuICAgIH1cblxuICAgIGlmIChsYW5nKSB7XG4gICAgICB2YXIgemVyb1JlY29yZHMgPSBsYW5nLnNaZXJvUmVjb3JkcztcblxuICAgICAgaWYgKCFsYW5nLnNFbXB0eVRhYmxlICYmIHplcm9SZWNvcmRzICYmIGRlZmF1bHRzLnNFbXB0eVRhYmxlID09PSBcIk5vIGRhdGEgYXZhaWxhYmxlIGluIHRhYmxlXCIpIHtcbiAgICAgICAgX2ZuTWFwKGxhbmcsIGxhbmcsICdzWmVyb1JlY29yZHMnLCAnc0VtcHR5VGFibGUnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFsYW5nLnNMb2FkaW5nUmVjb3JkcyAmJiB6ZXJvUmVjb3JkcyAmJiBkZWZhdWx0cy5zTG9hZGluZ1JlY29yZHMgPT09IFwiTG9hZGluZy4uLlwiKSB7XG4gICAgICAgIF9mbk1hcChsYW5nLCBsYW5nLCAnc1plcm9SZWNvcmRzJywgJ3NMb2FkaW5nUmVjb3JkcycpO1xuICAgICAgfVxuXG4gICAgICBpZiAobGFuZy5zSW5mb1Rob3VzYW5kcykge1xuICAgICAgICBsYW5nLnNUaG91c2FuZHMgPSBsYW5nLnNJbmZvVGhvdXNhbmRzO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGVjaW1hbCA9IGxhbmcuc0RlY2ltYWw7XG5cbiAgICAgIGlmIChkZWNpbWFsICYmIGRlZmF1bHREZWNpbWFsICE9PSBkZWNpbWFsKSB7XG4gICAgICAgIF9hZGROdW1lcmljU29ydChkZWNpbWFsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgX2ZuQ29tcGF0TWFwID0gZnVuY3Rpb24gX2ZuQ29tcGF0TWFwKG8sIGtuZXcsIG9sZCkge1xuICAgIGlmIChvW2tuZXddICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG9bb2xkXSA9IG9ba25ld107XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIF9mbkNvbXBhdE9wdHMoaW5pdCkge1xuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnb3JkZXJpbmcnLCAnYlNvcnQnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnb3JkZXJNdWx0aScsICdiU29ydE11bHRpJyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ29yZGVyQ2xhc3NlcycsICdiU29ydENsYXNzZXMnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnb3JkZXJDZWxsc1RvcCcsICdiU29ydENlbGxzVG9wJyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ29yZGVyJywgJ2FhU29ydGluZycpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdvcmRlckZpeGVkJywgJ2FhU29ydGluZ0ZpeGVkJyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ3BhZ2luZycsICdiUGFnaW5hdGUnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAncGFnaW5nVHlwZScsICdzUGFnaW5hdGlvblR5cGUnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAncGFnZUxlbmd0aCcsICdpRGlzcGxheUxlbmd0aCcpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdzZWFyY2hpbmcnLCAnYkZpbHRlcicpO1xuXG4gICAgaWYgKHR5cGVvZiBpbml0LnNTY3JvbGxYID09PSAnYm9vbGVhbicpIHtcbiAgICAgIGluaXQuc1Njcm9sbFggPSBpbml0LnNTY3JvbGxYID8gJzEwMCUnIDogJyc7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBpbml0LnNjcm9sbFggPT09ICdib29sZWFuJykge1xuICAgICAgaW5pdC5zY3JvbGxYID0gaW5pdC5zY3JvbGxYID8gJzEwMCUnIDogJyc7XG4gICAgfVxuXG4gICAgdmFyIHNlYXJjaENvbHMgPSBpbml0LmFvU2VhcmNoQ29scztcblxuICAgIGlmIChzZWFyY2hDb2xzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gc2VhcmNoQ29scy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBpZiAoc2VhcmNoQ29sc1tpXSkge1xuICAgICAgICAgIF9mbkNhbWVsVG9IdW5nYXJpYW4oRGF0YVRhYmxlLm1vZGVscy5vU2VhcmNoLCBzZWFyY2hDb2xzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNvbXBhdENvbHMoaW5pdCkge1xuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnb3JkZXJhYmxlJywgJ2JTb3J0YWJsZScpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdvcmRlckRhdGEnLCAnYURhdGFTb3J0Jyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ29yZGVyU2VxdWVuY2UnLCAnYXNTb3J0aW5nJyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ29yZGVyRGF0YVR5cGUnLCAnc29ydERhdGFUeXBlJyk7XG5cbiAgICB2YXIgZGF0YVNvcnQgPSBpbml0LmFEYXRhU29ydDtcblxuICAgIGlmICh0eXBlb2YgZGF0YVNvcnQgPT09ICdudW1iZXInICYmICEkLmlzQXJyYXkoZGF0YVNvcnQpKSB7XG4gICAgICBpbml0LmFEYXRhU29ydCA9IFtkYXRhU29ydF07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQnJvd3NlckRldGVjdChzZXR0aW5ncykge1xuICAgIGlmICghRGF0YVRhYmxlLl9fYnJvd3Nlcikge1xuICAgICAgdmFyIGJyb3dzZXIgPSB7fTtcbiAgICAgIERhdGFUYWJsZS5fX2Jyb3dzZXIgPSBicm93c2VyO1xuICAgICAgdmFyIG4gPSAkKCc8ZGl2Lz4nKS5jc3Moe1xuICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBsZWZ0OiAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpICogLTEsXG4gICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICAgICAgfSkuYXBwZW5kKCQoJzxkaXYvPicpLmNzcyh7XG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICB0b3A6IDEsXG4gICAgICAgIGxlZnQ6IDEsXG4gICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgIG92ZXJmbG93OiAnc2Nyb2xsJ1xuICAgICAgfSkuYXBwZW5kKCQoJzxkaXYvPicpLmNzcyh7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGhlaWdodDogMTBcbiAgICAgIH0pKSkuYXBwZW5kVG8oJ2JvZHknKTtcbiAgICAgIHZhciBvdXRlciA9IG4uY2hpbGRyZW4oKTtcbiAgICAgIHZhciBpbm5lciA9IG91dGVyLmNoaWxkcmVuKCk7XG4gICAgICBicm93c2VyLmJhcldpZHRoID0gb3V0ZXJbMF0ub2Zmc2V0V2lkdGggLSBvdXRlclswXS5jbGllbnRXaWR0aDtcbiAgICAgIGJyb3dzZXIuYlNjcm9sbE92ZXJzaXplID0gaW5uZXJbMF0ub2Zmc2V0V2lkdGggPT09IDEwMCAmJiBvdXRlclswXS5jbGllbnRXaWR0aCAhPT0gMTAwO1xuICAgICAgYnJvd3Nlci5iU2Nyb2xsYmFyTGVmdCA9IE1hdGgucm91bmQoaW5uZXIub2Zmc2V0KCkubGVmdCkgIT09IDE7XG4gICAgICBicm93c2VyLmJCb3VuZGluZyA9IG5bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggPyB0cnVlIDogZmFsc2U7XG4gICAgICBuLnJlbW92ZSgpO1xuICAgIH1cblxuICAgICQuZXh0ZW5kKHNldHRpbmdzLm9Ccm93c2VyLCBEYXRhVGFibGUuX19icm93c2VyKTtcbiAgICBzZXR0aW5ncy5vU2Nyb2xsLmlCYXJXaWR0aCA9IERhdGFUYWJsZS5fX2Jyb3dzZXIuYmFyV2lkdGg7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5SZWR1Y2UodGhhdCwgZm4sIGluaXQsIHN0YXJ0LCBlbmQsIGluYykge1xuICAgIHZhciBpID0gc3RhcnQsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBpc1NldCA9IGZhbHNlO1xuXG4gICAgaWYgKGluaXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBpbml0O1xuICAgICAgaXNTZXQgPSB0cnVlO1xuICAgIH1cblxuICAgIHdoaWxlIChpICE9PSBlbmQpIHtcbiAgICAgIGlmICghdGhhdC5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFsdWUgPSBpc1NldCA/IGZuKHZhbHVlLCB0aGF0W2ldLCBpLCB0aGF0KSA6IHRoYXRbaV07XG4gICAgICBpc1NldCA9IHRydWU7XG4gICAgICBpICs9IGluYztcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5BZGRDb2x1bW4ob1NldHRpbmdzLCBuVGgpIHtcbiAgICB2YXIgb0RlZmF1bHRzID0gRGF0YVRhYmxlLmRlZmF1bHRzLmNvbHVtbjtcbiAgICB2YXIgaUNvbCA9IG9TZXR0aW5ncy5hb0NvbHVtbnMubGVuZ3RoO1xuICAgIHZhciBvQ29sID0gJC5leHRlbmQoe30sIERhdGFUYWJsZS5tb2RlbHMub0NvbHVtbiwgb0RlZmF1bHRzLCB7XG4gICAgICBcIm5UaFwiOiBuVGggPyBuVGggOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0aCcpLFxuICAgICAgXCJzVGl0bGVcIjogb0RlZmF1bHRzLnNUaXRsZSA/IG9EZWZhdWx0cy5zVGl0bGUgOiBuVGggPyBuVGguaW5uZXJIVE1MIDogJycsXG4gICAgICBcImFEYXRhU29ydFwiOiBvRGVmYXVsdHMuYURhdGFTb3J0ID8gb0RlZmF1bHRzLmFEYXRhU29ydCA6IFtpQ29sXSxcbiAgICAgIFwibURhdGFcIjogb0RlZmF1bHRzLm1EYXRhID8gb0RlZmF1bHRzLm1EYXRhIDogaUNvbCxcbiAgICAgIGlkeDogaUNvbFxuICAgIH0pO1xuICAgIG9TZXR0aW5ncy5hb0NvbHVtbnMucHVzaChvQ29sKTtcbiAgICB2YXIgc2VhcmNoQ29scyA9IG9TZXR0aW5ncy5hb1ByZVNlYXJjaENvbHM7XG4gICAgc2VhcmNoQ29sc1tpQ29sXSA9ICQuZXh0ZW5kKHt9LCBEYXRhVGFibGUubW9kZWxzLm9TZWFyY2gsIHNlYXJjaENvbHNbaUNvbF0pO1xuXG4gICAgX2ZuQ29sdW1uT3B0aW9ucyhvU2V0dGluZ3MsIGlDb2wsICQoblRoKS5kYXRhKCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQ29sdW1uT3B0aW9ucyhvU2V0dGluZ3MsIGlDb2wsIG9PcHRpb25zKSB7XG4gICAgdmFyIG9Db2wgPSBvU2V0dGluZ3MuYW9Db2x1bW5zW2lDb2xdO1xuICAgIHZhciBvQ2xhc3NlcyA9IG9TZXR0aW5ncy5vQ2xhc3NlcztcbiAgICB2YXIgdGggPSAkKG9Db2wublRoKTtcblxuICAgIGlmICghb0NvbC5zV2lkdGhPcmlnKSB7XG4gICAgICBvQ29sLnNXaWR0aE9yaWcgPSB0aC5hdHRyKCd3aWR0aCcpIHx8IG51bGw7XG4gICAgICB2YXIgdCA9ICh0aC5hdHRyKCdzdHlsZScpIHx8ICcnKS5tYXRjaCgvd2lkdGg6XFxzKihcXGQrW3B4ZW0lXSspLyk7XG5cbiAgICAgIGlmICh0KSB7XG4gICAgICAgIG9Db2wuc1dpZHRoT3JpZyA9IHRbMV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9PcHRpb25zICE9PSB1bmRlZmluZWQgJiYgb09wdGlvbnMgIT09IG51bGwpIHtcbiAgICAgIF9mbkNvbXBhdENvbHMob09wdGlvbnMpO1xuXG4gICAgICBfZm5DYW1lbFRvSHVuZ2FyaWFuKERhdGFUYWJsZS5kZWZhdWx0cy5jb2x1bW4sIG9PcHRpb25zKTtcblxuICAgICAgaWYgKG9PcHRpb25zLm1EYXRhUHJvcCAhPT0gdW5kZWZpbmVkICYmICFvT3B0aW9ucy5tRGF0YSkge1xuICAgICAgICBvT3B0aW9ucy5tRGF0YSA9IG9PcHRpb25zLm1EYXRhUHJvcDtcbiAgICAgIH1cblxuICAgICAgaWYgKG9PcHRpb25zLnNUeXBlKSB7XG4gICAgICAgIG9Db2wuX3NNYW51YWxUeXBlID0gb09wdGlvbnMuc1R5cGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChvT3B0aW9ucy5jbGFzc05hbWUgJiYgIW9PcHRpb25zLnNDbGFzcykge1xuICAgICAgICBvT3B0aW9ucy5zQ2xhc3MgPSBvT3B0aW9ucy5jbGFzc05hbWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChvT3B0aW9ucy5zQ2xhc3MpIHtcbiAgICAgICAgdGguYWRkQ2xhc3Mob09wdGlvbnMuc0NsYXNzKTtcbiAgICAgIH1cblxuICAgICAgJC5leHRlbmQob0NvbCwgb09wdGlvbnMpO1xuXG4gICAgICBfZm5NYXAob0NvbCwgb09wdGlvbnMsIFwic1dpZHRoXCIsIFwic1dpZHRoT3JpZ1wiKTtcblxuICAgICAgaWYgKG9PcHRpb25zLmlEYXRhU29ydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9Db2wuYURhdGFTb3J0ID0gW29PcHRpb25zLmlEYXRhU29ydF07XG4gICAgICB9XG5cbiAgICAgIF9mbk1hcChvQ29sLCBvT3B0aW9ucywgXCJhRGF0YVNvcnRcIik7XG4gICAgfVxuXG4gICAgdmFyIG1EYXRhU3JjID0gb0NvbC5tRGF0YTtcblxuICAgIHZhciBtRGF0YSA9IF9mbkdldE9iamVjdERhdGFGbihtRGF0YVNyYyk7XG5cbiAgICB2YXIgbVJlbmRlciA9IG9Db2wubVJlbmRlciA/IF9mbkdldE9iamVjdERhdGFGbihvQ29sLm1SZW5kZXIpIDogbnVsbDtcblxuICAgIHZhciBhdHRyVGVzdCA9IGZ1bmN0aW9uIGF0dHJUZXN0KHNyYykge1xuICAgICAgcmV0dXJuIHR5cGVvZiBzcmMgPT09ICdzdHJpbmcnICYmIHNyYy5pbmRleE9mKCdAJykgIT09IC0xO1xuICAgIH07XG5cbiAgICBvQ29sLl9iQXR0clNyYyA9ICQuaXNQbGFpbk9iamVjdChtRGF0YVNyYykgJiYgKGF0dHJUZXN0KG1EYXRhU3JjLnNvcnQpIHx8IGF0dHJUZXN0KG1EYXRhU3JjLnR5cGUpIHx8IGF0dHJUZXN0KG1EYXRhU3JjLmZpbHRlcikpO1xuICAgIG9Db2wuX3NldHRlciA9IG51bGw7XG5cbiAgICBvQ29sLmZuR2V0RGF0YSA9IGZ1bmN0aW9uIChyb3dEYXRhLCB0eXBlLCBtZXRhKSB7XG4gICAgICB2YXIgaW5uZXJEYXRhID0gbURhdGEocm93RGF0YSwgdHlwZSwgdW5kZWZpbmVkLCBtZXRhKTtcbiAgICAgIHJldHVybiBtUmVuZGVyICYmIHR5cGUgPyBtUmVuZGVyKGlubmVyRGF0YSwgdHlwZSwgcm93RGF0YSwgbWV0YSkgOiBpbm5lckRhdGE7XG4gICAgfTtcblxuICAgIG9Db2wuZm5TZXREYXRhID0gZnVuY3Rpb24gKHJvd0RhdGEsIHZhbCwgbWV0YSkge1xuICAgICAgcmV0dXJuIF9mblNldE9iamVjdERhdGFGbihtRGF0YVNyYykocm93RGF0YSwgdmFsLCBtZXRhKTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBtRGF0YVNyYyAhPT0gJ251bWJlcicpIHtcbiAgICAgIG9TZXR0aW5ncy5fcm93UmVhZE9iamVjdCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFvU2V0dGluZ3Mub0ZlYXR1cmVzLmJTb3J0KSB7XG4gICAgICBvQ29sLmJTb3J0YWJsZSA9IGZhbHNlO1xuICAgICAgdGguYWRkQ2xhc3Mob0NsYXNzZXMuc1NvcnRhYmxlTm9uZSk7XG4gICAgfVxuXG4gICAgdmFyIGJBc2MgPSAkLmluQXJyYXkoJ2FzYycsIG9Db2wuYXNTb3J0aW5nKSAhPT0gLTE7XG4gICAgdmFyIGJEZXNjID0gJC5pbkFycmF5KCdkZXNjJywgb0NvbC5hc1NvcnRpbmcpICE9PSAtMTtcblxuICAgIGlmICghb0NvbC5iU29ydGFibGUgfHwgIWJBc2MgJiYgIWJEZXNjKSB7XG4gICAgICBvQ29sLnNTb3J0aW5nQ2xhc3MgPSBvQ2xhc3Nlcy5zU29ydGFibGVOb25lO1xuICAgICAgb0NvbC5zU29ydGluZ0NsYXNzSlVJID0gXCJcIjtcbiAgICB9IGVsc2UgaWYgKGJBc2MgJiYgIWJEZXNjKSB7XG4gICAgICBvQ29sLnNTb3J0aW5nQ2xhc3MgPSBvQ2xhc3Nlcy5zU29ydGFibGVBc2M7XG4gICAgICBvQ29sLnNTb3J0aW5nQ2xhc3NKVUkgPSBvQ2xhc3Nlcy5zU29ydEpVSUFzY0FsbG93ZWQ7XG4gICAgfSBlbHNlIGlmICghYkFzYyAmJiBiRGVzYykge1xuICAgICAgb0NvbC5zU29ydGluZ0NsYXNzID0gb0NsYXNzZXMuc1NvcnRhYmxlRGVzYztcbiAgICAgIG9Db2wuc1NvcnRpbmdDbGFzc0pVSSA9IG9DbGFzc2VzLnNTb3J0SlVJRGVzY0FsbG93ZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9Db2wuc1NvcnRpbmdDbGFzcyA9IG9DbGFzc2VzLnNTb3J0YWJsZTtcbiAgICAgIG9Db2wuc1NvcnRpbmdDbGFzc0pVSSA9IG9DbGFzc2VzLnNTb3J0SlVJO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFkanVzdENvbHVtblNpemluZyhzZXR0aW5ncykge1xuICAgIGlmIChzZXR0aW5ncy5vRmVhdHVyZXMuYkF1dG9XaWR0aCAhPT0gZmFsc2UpIHtcbiAgICAgIHZhciBjb2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zO1xuXG4gICAgICBfZm5DYWxjdWxhdGVDb2x1bW5XaWR0aHMoc2V0dGluZ3MpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGNvbHVtbnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgIGNvbHVtbnNbaV0ublRoLnN0eWxlLndpZHRoID0gY29sdW1uc1tpXS5zV2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHNjcm9sbCA9IHNldHRpbmdzLm9TY3JvbGw7XG5cbiAgICBpZiAoc2Nyb2xsLnNZICE9PSAnJyB8fCBzY3JvbGwuc1ggIT09ICcnKSB7XG4gICAgICBfZm5TY3JvbGxEcmF3KHNldHRpbmdzKTtcbiAgICB9XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIG51bGwsICdjb2x1bW4tc2l6aW5nJywgW3NldHRpbmdzXSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5WaXNpYmxlVG9Db2x1bW5JbmRleChvU2V0dGluZ3MsIGlNYXRjaCkge1xuICAgIHZhciBhaVZpcyA9IF9mbkdldENvbHVtbnMob1NldHRpbmdzLCAnYlZpc2libGUnKTtcblxuICAgIHJldHVybiB0eXBlb2YgYWlWaXNbaU1hdGNoXSA9PT0gJ251bWJlcicgPyBhaVZpc1tpTWF0Y2hdIDogbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNvbHVtbkluZGV4VG9WaXNpYmxlKG9TZXR0aW5ncywgaU1hdGNoKSB7XG4gICAgdmFyIGFpVmlzID0gX2ZuR2V0Q29sdW1ucyhvU2V0dGluZ3MsICdiVmlzaWJsZScpO1xuXG4gICAgdmFyIGlQb3MgPSAkLmluQXJyYXkoaU1hdGNoLCBhaVZpcyk7XG4gICAgcmV0dXJuIGlQb3MgIT09IC0xID8gaVBvcyA6IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5WaXNibGVDb2x1bW5zKG9TZXR0aW5ncykge1xuICAgIHZhciB2aXMgPSAwO1xuICAgICQuZWFjaChvU2V0dGluZ3MuYW9Db2x1bW5zLCBmdW5jdGlvbiAoaSwgY29sKSB7XG4gICAgICBpZiAoY29sLmJWaXNpYmxlICYmICQoY29sLm5UaCkuY3NzKCdkaXNwbGF5JykgIT09ICdub25lJykge1xuICAgICAgICB2aXMrKztcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdmlzO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuR2V0Q29sdW1ucyhvU2V0dGluZ3MsIHNQYXJhbSkge1xuICAgIHZhciBhID0gW107XG4gICAgJC5tYXAob1NldHRpbmdzLmFvQ29sdW1ucywgZnVuY3Rpb24gKHZhbCwgaSkge1xuICAgICAgaWYgKHZhbFtzUGFyYW1dKSB7XG4gICAgICAgIGEucHVzaChpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNvbHVtblR5cGVzKHNldHRpbmdzKSB7XG4gICAgdmFyIGNvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnM7XG4gICAgdmFyIGRhdGEgPSBzZXR0aW5ncy5hb0RhdGE7XG4gICAgdmFyIHR5cGVzID0gRGF0YVRhYmxlLmV4dC50eXBlLmRldGVjdDtcbiAgICB2YXIgaSwgaWVuLCBqLCBqZW4sIGssIGtlbjtcbiAgICB2YXIgY29sLCBjZWxsLCBkZXRlY3RlZFR5cGUsIGNhY2hlO1xuXG4gICAgZm9yIChpID0gMCwgaWVuID0gY29sdW1ucy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgY29sID0gY29sdW1uc1tpXTtcbiAgICAgIGNhY2hlID0gW107XG5cbiAgICAgIGlmICghY29sLnNUeXBlICYmIGNvbC5fc01hbnVhbFR5cGUpIHtcbiAgICAgICAgY29sLnNUeXBlID0gY29sLl9zTWFudWFsVHlwZTtcbiAgICAgIH0gZWxzZSBpZiAoIWNvbC5zVHlwZSkge1xuICAgICAgICBmb3IgKGogPSAwLCBqZW4gPSB0eXBlcy5sZW5ndGg7IGogPCBqZW47IGorKykge1xuICAgICAgICAgIGZvciAoayA9IDAsIGtlbiA9IGRhdGEubGVuZ3RoOyBrIDwga2VuOyBrKyspIHtcbiAgICAgICAgICAgIGlmIChjYWNoZVtrXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGNhY2hlW2tdID0gX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIGssIGksICd0eXBlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRldGVjdGVkVHlwZSA9IHR5cGVzW2pdKGNhY2hlW2tdLCBzZXR0aW5ncyk7XG5cbiAgICAgICAgICAgIGlmICghZGV0ZWN0ZWRUeXBlICYmIGogIT09IHR5cGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkZXRlY3RlZFR5cGUgPT09ICdodG1sJykge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZGV0ZWN0ZWRUeXBlKSB7XG4gICAgICAgICAgICBjb2wuc1R5cGUgPSBkZXRlY3RlZFR5cGU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNvbC5zVHlwZSkge1xuICAgICAgICAgIGNvbC5zVHlwZSA9ICdzdHJpbmcnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQXBwbHlDb2x1bW5EZWZzKG9TZXR0aW5ncywgYW9Db2xEZWZzLCBhb0NvbHMsIGZuKSB7XG4gICAgdmFyIGksIGlMZW4sIGosIGpMZW4sIGssIGtMZW4sIGRlZjtcbiAgICB2YXIgY29sdW1ucyA9IG9TZXR0aW5ncy5hb0NvbHVtbnM7XG5cbiAgICBpZiAoYW9Db2xEZWZzKSB7XG4gICAgICBmb3IgKGkgPSBhb0NvbERlZnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgZGVmID0gYW9Db2xEZWZzW2ldO1xuICAgICAgICB2YXIgYVRhcmdldHMgPSBkZWYudGFyZ2V0cyAhPT0gdW5kZWZpbmVkID8gZGVmLnRhcmdldHMgOiBkZWYuYVRhcmdldHM7XG5cbiAgICAgICAgaWYgKCEkLmlzQXJyYXkoYVRhcmdldHMpKSB7XG4gICAgICAgICAgYVRhcmdldHMgPSBbYVRhcmdldHNdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChqID0gMCwgakxlbiA9IGFUYXJnZXRzLmxlbmd0aDsgaiA8IGpMZW47IGorKykge1xuICAgICAgICAgIGlmICh0eXBlb2YgYVRhcmdldHNbal0gPT09ICdudW1iZXInICYmIGFUYXJnZXRzW2pdID49IDApIHtcbiAgICAgICAgICAgIHdoaWxlIChjb2x1bW5zLmxlbmd0aCA8PSBhVGFyZ2V0c1tqXSkge1xuICAgICAgICAgICAgICBfZm5BZGRDb2x1bW4ob1NldHRpbmdzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm4oYVRhcmdldHNbal0sIGRlZik7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYVRhcmdldHNbal0gPT09ICdudW1iZXInICYmIGFUYXJnZXRzW2pdIDwgMCkge1xuICAgICAgICAgICAgZm4oY29sdW1ucy5sZW5ndGggKyBhVGFyZ2V0c1tqXSwgZGVmKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhVGFyZ2V0c1tqXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGZvciAoayA9IDAsIGtMZW4gPSBjb2x1bW5zLmxlbmd0aDsgayA8IGtMZW47IGsrKykge1xuICAgICAgICAgICAgICBpZiAoYVRhcmdldHNbal0gPT0gXCJfYWxsXCIgfHwgJChjb2x1bW5zW2tdLm5UaCkuaGFzQ2xhc3MoYVRhcmdldHNbal0pKSB7XG4gICAgICAgICAgICAgICAgZm4oaywgZGVmKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhb0NvbHMpIHtcbiAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhb0NvbHMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgIGZuKGksIGFvQ29sc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQWRkRGF0YShvU2V0dGluZ3MsIGFEYXRhSW4sIG5UciwgYW5UZHMpIHtcbiAgICB2YXIgaVJvdyA9IG9TZXR0aW5ncy5hb0RhdGEubGVuZ3RoO1xuICAgIHZhciBvRGF0YSA9ICQuZXh0ZW5kKHRydWUsIHt9LCBEYXRhVGFibGUubW9kZWxzLm9Sb3csIHtcbiAgICAgIHNyYzogblRyID8gJ2RvbScgOiAnZGF0YScsXG4gICAgICBpZHg6IGlSb3dcbiAgICB9KTtcbiAgICBvRGF0YS5fYURhdGEgPSBhRGF0YUluO1xuICAgIG9TZXR0aW5ncy5hb0RhdGEucHVzaChvRGF0YSk7XG4gICAgdmFyIG5UZCwgc1RoaXNUeXBlO1xuICAgIHZhciBjb2x1bW5zID0gb1NldHRpbmdzLmFvQ29sdW1ucztcblxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gY29sdW1ucy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIGNvbHVtbnNbaV0uc1R5cGUgPSBudWxsO1xuICAgIH1cblxuICAgIG9TZXR0aW5ncy5haURpc3BsYXlNYXN0ZXIucHVzaChpUm93KTtcbiAgICB2YXIgaWQgPSBvU2V0dGluZ3Mucm93SWRGbihhRGF0YUluKTtcblxuICAgIGlmIChpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvU2V0dGluZ3MuYUlkc1tpZF0gPSBvRGF0YTtcbiAgICB9XG5cbiAgICBpZiAoblRyIHx8ICFvU2V0dGluZ3Mub0ZlYXR1cmVzLmJEZWZlclJlbmRlcikge1xuICAgICAgX2ZuQ3JlYXRlVHIob1NldHRpbmdzLCBpUm93LCBuVHIsIGFuVGRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaVJvdztcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFkZFRyKHNldHRpbmdzLCB0cnMpIHtcbiAgICB2YXIgcm93O1xuXG4gICAgaWYgKCEodHJzIGluc3RhbmNlb2YgJCkpIHtcbiAgICAgIHRycyA9ICQodHJzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJzLm1hcChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgIHJvdyA9IF9mbkdldFJvd0VsZW1lbnRzKHNldHRpbmdzLCBlbCk7XG4gICAgICByZXR1cm4gX2ZuQWRkRGF0YShzZXR0aW5ncywgcm93LmRhdGEsIGVsLCByb3cuY2VsbHMpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuTm9kZVRvRGF0YUluZGV4KG9TZXR0aW5ncywgbikge1xuICAgIHJldHVybiBuLl9EVF9Sb3dJbmRleCAhPT0gdW5kZWZpbmVkID8gbi5fRFRfUm93SW5kZXggOiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuTm9kZVRvQ29sdW1uSW5kZXgob1NldHRpbmdzLCBpUm93LCBuKSB7XG4gICAgcmV0dXJuICQuaW5BcnJheShuLCBvU2V0dGluZ3MuYW9EYXRhW2lSb3ddLmFuQ2VsbHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIHJvd0lkeCwgY29sSWR4LCB0eXBlKSB7XG4gICAgdmFyIGRyYXcgPSBzZXR0aW5ncy5pRHJhdztcbiAgICB2YXIgY29sID0gc2V0dGluZ3MuYW9Db2x1bW5zW2NvbElkeF07XG4gICAgdmFyIHJvd0RhdGEgPSBzZXR0aW5ncy5hb0RhdGFbcm93SWR4XS5fYURhdGE7XG4gICAgdmFyIGRlZmF1bHRDb250ZW50ID0gY29sLnNEZWZhdWx0Q29udGVudDtcbiAgICB2YXIgY2VsbERhdGEgPSBjb2wuZm5HZXREYXRhKHJvd0RhdGEsIHR5cGUsIHtcbiAgICAgIHNldHRpbmdzOiBzZXR0aW5ncyxcbiAgICAgIHJvdzogcm93SWR4LFxuICAgICAgY29sOiBjb2xJZHhcbiAgICB9KTtcblxuICAgIGlmIChjZWxsRGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoc2V0dGluZ3MuaURyYXdFcnJvciAhPSBkcmF3ICYmIGRlZmF1bHRDb250ZW50ID09PSBudWxsKSB7XG4gICAgICAgIF9mbkxvZyhzZXR0aW5ncywgMCwgXCJSZXF1ZXN0ZWQgdW5rbm93biBwYXJhbWV0ZXIgXCIgKyAodHlwZW9mIGNvbC5tRGF0YSA9PSAnZnVuY3Rpb24nID8gJ3tmdW5jdGlvbn0nIDogXCInXCIgKyBjb2wubURhdGEgKyBcIidcIikgKyBcIiBmb3Igcm93IFwiICsgcm93SWR4ICsgXCIsIGNvbHVtbiBcIiArIGNvbElkeCwgNCk7XG5cbiAgICAgICAgc2V0dGluZ3MuaURyYXdFcnJvciA9IGRyYXc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZWZhdWx0Q29udGVudDtcbiAgICB9XG5cbiAgICBpZiAoKGNlbGxEYXRhID09PSByb3dEYXRhIHx8IGNlbGxEYXRhID09PSBudWxsKSAmJiBkZWZhdWx0Q29udGVudCAhPT0gbnVsbCAmJiB0eXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNlbGxEYXRhID0gZGVmYXVsdENvbnRlbnQ7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY2VsbERhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBjZWxsRGF0YS5jYWxsKHJvd0RhdGEpO1xuICAgIH1cblxuICAgIGlmIChjZWxsRGF0YSA9PT0gbnVsbCAmJiB0eXBlID09ICdkaXNwbGF5Jykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiBjZWxsRGF0YTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNldENlbGxEYXRhKHNldHRpbmdzLCByb3dJZHgsIGNvbElkeCwgdmFsKSB7XG4gICAgdmFyIGNvbCA9IHNldHRpbmdzLmFvQ29sdW1uc1tjb2xJZHhdO1xuICAgIHZhciByb3dEYXRhID0gc2V0dGluZ3MuYW9EYXRhW3Jvd0lkeF0uX2FEYXRhO1xuICAgIGNvbC5mblNldERhdGEocm93RGF0YSwgdmFsLCB7XG4gICAgICBzZXR0aW5nczogc2V0dGluZ3MsXG4gICAgICByb3c6IHJvd0lkeCxcbiAgICAgIGNvbDogY29sSWR4XG4gICAgfSk7XG4gIH1cblxuICB2YXIgX19yZUFycmF5ID0gL1xcWy4qP1xcXSQvO1xuICB2YXIgX19yZUZuID0gL1xcKFxcKSQvO1xuXG4gIGZ1bmN0aW9uIF9mblNwbGl0T2JqTm90YXRpb24oc3RyKSB7XG4gICAgcmV0dXJuICQubWFwKHN0ci5tYXRjaCgvKFxcXFwufFteXFwuXSkrL2cpIHx8IFsnJ10sIGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gcy5yZXBsYWNlKC9cXFxcXFwuL2csICcuJyk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5HZXRPYmplY3REYXRhRm4obVNvdXJjZSkge1xuICAgIGlmICgkLmlzUGxhaW5PYmplY3QobVNvdXJjZSkpIHtcbiAgICAgIHZhciBvID0ge307XG4gICAgICAkLmVhY2gobVNvdXJjZSwgZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICBvW2tleV0gPSBfZm5HZXRPYmplY3REYXRhRm4odmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIHR5cGUsIHJvdywgbWV0YSkge1xuICAgICAgICB2YXIgdCA9IG9bdHlwZV0gfHwgby5fO1xuICAgICAgICByZXR1cm4gdCAhPT0gdW5kZWZpbmVkID8gdChkYXRhLCB0eXBlLCByb3csIG1ldGEpIDogZGF0YTtcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtU291cmNlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1Tb3VyY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSwgdHlwZSwgcm93LCBtZXRhKSB7XG4gICAgICAgIHJldHVybiBtU291cmNlKGRhdGEsIHR5cGUsIHJvdywgbWV0YSk7XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1Tb3VyY2UgPT09ICdzdHJpbmcnICYmIChtU291cmNlLmluZGV4T2YoJy4nKSAhPT0gLTEgfHwgbVNvdXJjZS5pbmRleE9mKCdbJykgIT09IC0xIHx8IG1Tb3VyY2UuaW5kZXhPZignKCcpICE9PSAtMSkpIHtcbiAgICAgIHZhciBmZXRjaERhdGEgPSBmdW5jdGlvbiBmZXRjaERhdGEoZGF0YSwgdHlwZSwgc3JjKSB7XG4gICAgICAgIHZhciBhcnJheU5vdGF0aW9uLCBmdW5jTm90YXRpb24sIG91dCwgaW5uZXJTcmM7XG5cbiAgICAgICAgaWYgKHNyYyAhPT0gXCJcIikge1xuICAgICAgICAgIHZhciBhID0gX2ZuU3BsaXRPYmpOb3RhdGlvbihzcmMpO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSBhLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICAgICAgYXJyYXlOb3RhdGlvbiA9IGFbaV0ubWF0Y2goX19yZUFycmF5KTtcbiAgICAgICAgICAgIGZ1bmNOb3RhdGlvbiA9IGFbaV0ubWF0Y2goX19yZUZuKTtcblxuICAgICAgICAgICAgaWYgKGFycmF5Tm90YXRpb24pIHtcbiAgICAgICAgICAgICAgYVtpXSA9IGFbaV0ucmVwbGFjZShfX3JlQXJyYXksICcnKTtcblxuICAgICAgICAgICAgICBpZiAoYVtpXSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhW2FbaV1dO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgb3V0ID0gW107XG4gICAgICAgICAgICAgIGEuc3BsaWNlKDAsIGkgKyAxKTtcbiAgICAgICAgICAgICAgaW5uZXJTcmMgPSBhLmpvaW4oJy4nKTtcblxuICAgICAgICAgICAgICBpZiAoJC5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpMZW4gPSBkYXRhLmxlbmd0aDsgaiA8IGpMZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgb3V0LnB1c2goZmV0Y2hEYXRhKGRhdGFbal0sIHR5cGUsIGlubmVyU3JjKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIGpvaW4gPSBhcnJheU5vdGF0aW9uWzBdLnN1YnN0cmluZygxLCBhcnJheU5vdGF0aW9uWzBdLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICBkYXRhID0gam9pbiA9PT0gXCJcIiA/IG91dCA6IG91dC5qb2luKGpvaW4pO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZnVuY05vdGF0aW9uKSB7XG4gICAgICAgICAgICAgIGFbaV0gPSBhW2ldLnJlcGxhY2UoX19yZUZuLCAnJyk7XG4gICAgICAgICAgICAgIGRhdGEgPSBkYXRhW2FbaV1dKCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCB8fCBkYXRhW2FbaV1dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0YSA9IGRhdGFbYVtpXV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoRGF0YShkYXRhLCB0eXBlLCBtU291cmNlKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSwgdHlwZSkge1xuICAgICAgICByZXR1cm4gZGF0YVttU291cmNlXTtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU2V0T2JqZWN0RGF0YUZuKG1Tb3VyY2UpIHtcbiAgICBpZiAoJC5pc1BsYWluT2JqZWN0KG1Tb3VyY2UpKSB7XG4gICAgICByZXR1cm4gX2ZuU2V0T2JqZWN0RGF0YUZuKG1Tb3VyY2UuXyk7XG4gICAgfSBlbHNlIGlmIChtU291cmNlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge307XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbVNvdXJjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhLCB2YWwsIG1ldGEpIHtcbiAgICAgICAgbVNvdXJjZShkYXRhLCAnc2V0JywgdmFsLCBtZXRhKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbVNvdXJjZSA9PT0gJ3N0cmluZycgJiYgKG1Tb3VyY2UuaW5kZXhPZignLicpICE9PSAtMSB8fCBtU291cmNlLmluZGV4T2YoJ1snKSAhPT0gLTEgfHwgbVNvdXJjZS5pbmRleE9mKCcoJykgIT09IC0xKSkge1xuICAgICAgdmFyIHNldERhdGEgPSBmdW5jdGlvbiBzZXREYXRhKGRhdGEsIHZhbCwgc3JjKSB7XG4gICAgICAgIHZhciBhID0gX2ZuU3BsaXRPYmpOb3RhdGlvbihzcmMpLFxuICAgICAgICAgICAgYjtcblxuICAgICAgICB2YXIgYUxhc3QgPSBhW2EubGVuZ3RoIC0gMV07XG4gICAgICAgIHZhciBhcnJheU5vdGF0aW9uLCBmdW5jTm90YXRpb24sIG8sIGlubmVyU3JjO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gYS5sZW5ndGggLSAxOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgICAgYXJyYXlOb3RhdGlvbiA9IGFbaV0ubWF0Y2goX19yZUFycmF5KTtcbiAgICAgICAgICBmdW5jTm90YXRpb24gPSBhW2ldLm1hdGNoKF9fcmVGbik7XG5cbiAgICAgICAgICBpZiAoYXJyYXlOb3RhdGlvbikge1xuICAgICAgICAgICAgYVtpXSA9IGFbaV0ucmVwbGFjZShfX3JlQXJyYXksICcnKTtcbiAgICAgICAgICAgIGRhdGFbYVtpXV0gPSBbXTtcbiAgICAgICAgICAgIGIgPSBhLnNsaWNlKCk7XG4gICAgICAgICAgICBiLnNwbGljZSgwLCBpICsgMSk7XG4gICAgICAgICAgICBpbm5lclNyYyA9IGIuam9pbignLicpO1xuXG4gICAgICAgICAgICBpZiAoJC5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpMZW4gPSB2YWwubGVuZ3RoOyBqIDwgakxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgbyA9IHt9O1xuICAgICAgICAgICAgICAgIHNldERhdGEobywgdmFsW2pdLCBpbm5lclNyYyk7XG4gICAgICAgICAgICAgICAgZGF0YVthW2ldXS5wdXNoKG8pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBkYXRhW2FbaV1dID0gdmFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIGlmIChmdW5jTm90YXRpb24pIHtcbiAgICAgICAgICAgIGFbaV0gPSBhW2ldLnJlcGxhY2UoX19yZUZuLCAnJyk7XG4gICAgICAgICAgICBkYXRhID0gZGF0YVthW2ldXSh2YWwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkYXRhW2FbaV1dID09PSBudWxsIHx8IGRhdGFbYVtpXV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGF0YVthW2ldXSA9IHt9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRhdGEgPSBkYXRhW2FbaV1dO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFMYXN0Lm1hdGNoKF9fcmVGbikpIHtcbiAgICAgICAgICBkYXRhID0gZGF0YVthTGFzdC5yZXBsYWNlKF9fcmVGbiwgJycpXSh2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGFbYUxhc3QucmVwbGFjZShfX3JlQXJyYXksICcnKV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSwgdmFsKSB7XG4gICAgICAgIHJldHVybiBzZXREYXRhKGRhdGEsIHZhbCwgbVNvdXJjZSk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIHZhbCkge1xuICAgICAgICBkYXRhW21Tb3VyY2VdID0gdmFsO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5HZXREYXRhTWFzdGVyKHNldHRpbmdzKSB7XG4gICAgcmV0dXJuIF9wbHVjayhzZXR0aW5ncy5hb0RhdGEsICdfYURhdGEnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNsZWFyVGFibGUoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncy5hb0RhdGEubGVuZ3RoID0gMDtcbiAgICBzZXR0aW5ncy5haURpc3BsYXlNYXN0ZXIubGVuZ3RoID0gMDtcbiAgICBzZXR0aW5ncy5haURpc3BsYXkubGVuZ3RoID0gMDtcbiAgICBzZXR0aW5ncy5hSWRzID0ge307XG4gIH1cblxuICBmdW5jdGlvbiBfZm5EZWxldGVJbmRleChhLCBpVGFyZ2V0LCBzcGxpY2UpIHtcbiAgICB2YXIgaVRhcmdldEluZGV4ID0gLTE7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGEubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICBpZiAoYVtpXSA9PSBpVGFyZ2V0KSB7XG4gICAgICAgIGlUYXJnZXRJbmRleCA9IGk7XG4gICAgICB9IGVsc2UgaWYgKGFbaV0gPiBpVGFyZ2V0KSB7XG4gICAgICAgIGFbaV0tLTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaVRhcmdldEluZGV4ICE9IC0xICYmIHNwbGljZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhLnNwbGljZShpVGFyZ2V0SW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkludmFsaWRhdGUoc2V0dGluZ3MsIHJvd0lkeCwgc3JjLCBjb2xJZHgpIHtcbiAgICB2YXIgcm93ID0gc2V0dGluZ3MuYW9EYXRhW3Jvd0lkeF07XG4gICAgdmFyIGksIGllbjtcblxuICAgIHZhciBjZWxsV3JpdGUgPSBmdW5jdGlvbiBjZWxsV3JpdGUoY2VsbCwgY29sKSB7XG4gICAgICB3aGlsZSAoY2VsbC5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBjZWxsLnJlbW92ZUNoaWxkKGNlbGwuZmlyc3RDaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIGNlbGwuaW5uZXJIVE1MID0gX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIHJvd0lkeCwgY29sLCAnZGlzcGxheScpO1xuICAgIH07XG5cbiAgICBpZiAoc3JjID09PSAnZG9tJyB8fCAoIXNyYyB8fCBzcmMgPT09ICdhdXRvJykgJiYgcm93LnNyYyA9PT0gJ2RvbScpIHtcbiAgICAgIHJvdy5fYURhdGEgPSBfZm5HZXRSb3dFbGVtZW50cyhzZXR0aW5ncywgcm93LCBjb2xJZHgsIGNvbElkeCA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogcm93Ll9hRGF0YSkuZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNlbGxzID0gcm93LmFuQ2VsbHM7XG5cbiAgICAgIGlmIChjZWxscykge1xuICAgICAgICBpZiAoY29sSWR4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjZWxsV3JpdGUoY2VsbHNbY29sSWR4XSwgY29sSWR4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGkgPSAwLCBpZW4gPSBjZWxscy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgICAgY2VsbFdyaXRlKGNlbGxzW2ldLCBpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByb3cuX2FTb3J0RGF0YSA9IG51bGw7XG4gICAgcm93Ll9hRmlsdGVyRGF0YSA9IG51bGw7XG4gICAgdmFyIGNvbHMgPSBzZXR0aW5ncy5hb0NvbHVtbnM7XG5cbiAgICBpZiAoY29sSWR4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbHNbY29sSWR4XS5zVHlwZSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IGNvbHMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgY29sc1tpXS5zVHlwZSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIF9mblJvd0F0dHJpYnV0ZXMoc2V0dGluZ3MsIHJvdyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuR2V0Um93RWxlbWVudHMoc2V0dGluZ3MsIHJvdywgY29sSWR4LCBkKSB7XG4gICAgdmFyIHRkcyA9IFtdLFxuICAgICAgICB0ZCA9IHJvdy5maXJzdENoaWxkLFxuICAgICAgICBuYW1lLFxuICAgICAgICBjb2wsXG4gICAgICAgIG8sXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBjb250ZW50cyxcbiAgICAgICAgY29sdW1ucyA9IHNldHRpbmdzLmFvQ29sdW1ucyxcbiAgICAgICAgb2JqZWN0UmVhZCA9IHNldHRpbmdzLl9yb3dSZWFkT2JqZWN0O1xuICAgIGQgPSBkICE9PSB1bmRlZmluZWQgPyBkIDogb2JqZWN0UmVhZCA/IHt9IDogW107XG5cbiAgICB2YXIgYXR0ciA9IGZ1bmN0aW9uIGF0dHIoc3RyLCB0ZCkge1xuICAgICAgaWYgKHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhciBpZHggPSBzdHIuaW5kZXhPZignQCcpO1xuXG4gICAgICAgIGlmIChpZHggIT09IC0xKSB7XG4gICAgICAgICAgdmFyIGF0dHIgPSBzdHIuc3Vic3RyaW5nKGlkeCArIDEpO1xuXG4gICAgICAgICAgdmFyIHNldHRlciA9IF9mblNldE9iamVjdERhdGFGbihzdHIpO1xuXG4gICAgICAgICAgc2V0dGVyKGQsIHRkLmdldEF0dHJpYnV0ZShhdHRyKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGNlbGxQcm9jZXNzID0gZnVuY3Rpb24gY2VsbFByb2Nlc3MoY2VsbCkge1xuICAgICAgaWYgKGNvbElkeCA9PT0gdW5kZWZpbmVkIHx8IGNvbElkeCA9PT0gaSkge1xuICAgICAgICBjb2wgPSBjb2x1bW5zW2ldO1xuICAgICAgICBjb250ZW50cyA9ICQudHJpbShjZWxsLmlubmVySFRNTCk7XG5cbiAgICAgICAgaWYgKGNvbCAmJiBjb2wuX2JBdHRyU3JjKSB7XG4gICAgICAgICAgdmFyIHNldHRlciA9IF9mblNldE9iamVjdERhdGFGbihjb2wubURhdGEuXyk7XG5cbiAgICAgICAgICBzZXR0ZXIoZCwgY29udGVudHMpO1xuICAgICAgICAgIGF0dHIoY29sLm1EYXRhLnNvcnQsIGNlbGwpO1xuICAgICAgICAgIGF0dHIoY29sLm1EYXRhLnR5cGUsIGNlbGwpO1xuICAgICAgICAgIGF0dHIoY29sLm1EYXRhLmZpbHRlciwgY2VsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9iamVjdFJlYWQpIHtcbiAgICAgICAgICAgIGlmICghY29sLl9zZXR0ZXIpIHtcbiAgICAgICAgICAgICAgY29sLl9zZXR0ZXIgPSBfZm5TZXRPYmplY3REYXRhRm4oY29sLm1EYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sLl9zZXR0ZXIoZCwgY29udGVudHMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkW2ldID0gY29udGVudHM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGkrKztcbiAgICB9O1xuXG4gICAgaWYgKHRkKSB7XG4gICAgICB3aGlsZSAodGQpIHtcbiAgICAgICAgbmFtZSA9IHRkLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgaWYgKG5hbWUgPT0gXCJURFwiIHx8IG5hbWUgPT0gXCJUSFwiKSB7XG4gICAgICAgICAgY2VsbFByb2Nlc3ModGQpO1xuICAgICAgICAgIHRkcy5wdXNoKHRkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRkID0gdGQubmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRkcyA9IHJvdy5hbkNlbGxzO1xuXG4gICAgICBmb3IgKHZhciBqID0gMCwgamVuID0gdGRzLmxlbmd0aDsgaiA8IGplbjsgaisrKSB7XG4gICAgICAgIGNlbGxQcm9jZXNzKHRkc1tqXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHJvd05vZGUgPSByb3cuZmlyc3RDaGlsZCA/IHJvdyA6IHJvdy5uVHI7XG5cbiAgICBpZiAocm93Tm9kZSkge1xuICAgICAgdmFyIGlkID0gcm93Tm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgICAgIGlmIChpZCkge1xuICAgICAgICBfZm5TZXRPYmplY3REYXRhRm4oc2V0dGluZ3Mucm93SWQpKGQsIGlkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogZCxcbiAgICAgIGNlbGxzOiB0ZHNcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQ3JlYXRlVHIob1NldHRpbmdzLCBpUm93LCBuVHJJbiwgYW5UZHMpIHtcbiAgICB2YXIgcm93ID0gb1NldHRpbmdzLmFvRGF0YVtpUm93XSxcbiAgICAgICAgcm93RGF0YSA9IHJvdy5fYURhdGEsXG4gICAgICAgIGNlbGxzID0gW10sXG4gICAgICAgIG5UcixcbiAgICAgICAgblRkLFxuICAgICAgICBvQ29sLFxuICAgICAgICBpLFxuICAgICAgICBpTGVuO1xuXG4gICAgaWYgKHJvdy5uVHIgPT09IG51bGwpIHtcbiAgICAgIG5UciA9IG5UckluIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICByb3cublRyID0gblRyO1xuICAgICAgcm93LmFuQ2VsbHMgPSBjZWxscztcbiAgICAgIG5Uci5fRFRfUm93SW5kZXggPSBpUm93O1xuXG4gICAgICBfZm5Sb3dBdHRyaWJ1dGVzKG9TZXR0aW5ncywgcm93KTtcblxuICAgICAgZm9yIChpID0gMCwgaUxlbiA9IG9TZXR0aW5ncy5hb0NvbHVtbnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgIG9Db2wgPSBvU2V0dGluZ3MuYW9Db2x1bW5zW2ldO1xuICAgICAgICBuVGQgPSBuVHJJbiA/IGFuVGRzW2ldIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChvQ29sLnNDZWxsVHlwZSk7XG4gICAgICAgIG5UZC5fRFRfQ2VsbEluZGV4ID0ge1xuICAgICAgICAgIHJvdzogaVJvdyxcbiAgICAgICAgICBjb2x1bW46IGlcbiAgICAgICAgfTtcbiAgICAgICAgY2VsbHMucHVzaChuVGQpO1xuXG4gICAgICAgIGlmICgoIW5UckluIHx8IG9Db2wubVJlbmRlciB8fCBvQ29sLm1EYXRhICE9PSBpKSAmJiAoISQuaXNQbGFpbk9iamVjdChvQ29sLm1EYXRhKSB8fCBvQ29sLm1EYXRhLl8gIT09IGkgKyAnLmRpc3BsYXknKSkge1xuICAgICAgICAgIG5UZC5pbm5lckhUTUwgPSBfZm5HZXRDZWxsRGF0YShvU2V0dGluZ3MsIGlSb3csIGksICdkaXNwbGF5Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob0NvbC5zQ2xhc3MpIHtcbiAgICAgICAgICBuVGQuY2xhc3NOYW1lICs9ICcgJyArIG9Db2wuc0NsYXNzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9Db2wuYlZpc2libGUgJiYgIW5UckluKSB7XG4gICAgICAgICAgblRyLmFwcGVuZENoaWxkKG5UZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIW9Db2wuYlZpc2libGUgJiYgblRySW4pIHtcbiAgICAgICAgICBuVGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChuVGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9Db2wuZm5DcmVhdGVkQ2VsbCkge1xuICAgICAgICAgIG9Db2wuZm5DcmVhdGVkQ2VsbC5jYWxsKG9TZXR0aW5ncy5vSW5zdGFuY2UsIG5UZCwgX2ZuR2V0Q2VsbERhdGEob1NldHRpbmdzLCBpUm93LCBpKSwgcm93RGF0YSwgaVJvdywgaSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgJ2FvUm93Q3JlYXRlZENhbGxiYWNrJywgbnVsbCwgW25Uciwgcm93RGF0YSwgaVJvdywgY2VsbHNdKTtcbiAgICB9XG5cbiAgICByb3cublRyLnNldEF0dHJpYnV0ZSgncm9sZScsICdyb3cnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblJvd0F0dHJpYnV0ZXMoc2V0dGluZ3MsIHJvdykge1xuICAgIHZhciB0ciA9IHJvdy5uVHI7XG4gICAgdmFyIGRhdGEgPSByb3cuX2FEYXRhO1xuXG4gICAgaWYgKHRyKSB7XG4gICAgICB2YXIgaWQgPSBzZXR0aW5ncy5yb3dJZEZuKGRhdGEpO1xuXG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgdHIuaWQgPSBpZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEuRFRfUm93Q2xhc3MpIHtcbiAgICAgICAgdmFyIGEgPSBkYXRhLkRUX1Jvd0NsYXNzLnNwbGl0KCcgJyk7XG4gICAgICAgIHJvdy5fX3Jvd2MgPSByb3cuX19yb3djID8gX3VuaXF1ZShyb3cuX19yb3djLmNvbmNhdChhKSkgOiBhO1xuICAgICAgICAkKHRyKS5yZW1vdmVDbGFzcyhyb3cuX19yb3djLmpvaW4oJyAnKSkuYWRkQ2xhc3MoZGF0YS5EVF9Sb3dDbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhLkRUX1Jvd0F0dHIpIHtcbiAgICAgICAgJCh0cikuYXR0cihkYXRhLkRUX1Jvd0F0dHIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YS5EVF9Sb3dEYXRhKSB7XG4gICAgICAgICQodHIpLmRhdGEoZGF0YS5EVF9Sb3dEYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5CdWlsZEhlYWQob1NldHRpbmdzKSB7XG4gICAgdmFyIGksIGllbiwgY2VsbCwgcm93LCBjb2x1bW47XG4gICAgdmFyIHRoZWFkID0gb1NldHRpbmdzLm5USGVhZDtcbiAgICB2YXIgdGZvb3QgPSBvU2V0dGluZ3MublRGb290O1xuICAgIHZhciBjcmVhdGVIZWFkZXIgPSAkKCd0aCwgdGQnLCB0aGVhZCkubGVuZ3RoID09PSAwO1xuICAgIHZhciBjbGFzc2VzID0gb1NldHRpbmdzLm9DbGFzc2VzO1xuICAgIHZhciBjb2x1bW5zID0gb1NldHRpbmdzLmFvQ29sdW1ucztcblxuICAgIGlmIChjcmVhdGVIZWFkZXIpIHtcbiAgICAgIHJvdyA9ICQoJzx0ci8+JykuYXBwZW5kVG8odGhlYWQpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGllbiA9IGNvbHVtbnMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIGNvbHVtbiA9IGNvbHVtbnNbaV07XG4gICAgICBjZWxsID0gJChjb2x1bW4ublRoKS5hZGRDbGFzcyhjb2x1bW4uc0NsYXNzKTtcblxuICAgICAgaWYgKGNyZWF0ZUhlYWRlcikge1xuICAgICAgICBjZWxsLmFwcGVuZFRvKHJvdyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvU2V0dGluZ3Mub0ZlYXR1cmVzLmJTb3J0KSB7XG4gICAgICAgIGNlbGwuYWRkQ2xhc3MoY29sdW1uLnNTb3J0aW5nQ2xhc3MpO1xuXG4gICAgICAgIGlmIChjb2x1bW4uYlNvcnRhYmxlICE9PSBmYWxzZSkge1xuICAgICAgICAgIGNlbGwuYXR0cigndGFiaW5kZXgnLCBvU2V0dGluZ3MuaVRhYkluZGV4KS5hdHRyKCdhcmlhLWNvbnRyb2xzJywgb1NldHRpbmdzLnNUYWJsZUlkKTtcblxuICAgICAgICAgIF9mblNvcnRBdHRhY2hMaXN0ZW5lcihvU2V0dGluZ3MsIGNvbHVtbi5uVGgsIGkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjb2x1bW4uc1RpdGxlICE9IGNlbGxbMF0uaW5uZXJIVE1MKSB7XG4gICAgICAgIGNlbGwuaHRtbChjb2x1bW4uc1RpdGxlKTtcbiAgICAgIH1cblxuICAgICAgX2ZuUmVuZGVyZXIob1NldHRpbmdzLCAnaGVhZGVyJykob1NldHRpbmdzLCBjZWxsLCBjb2x1bW4sIGNsYXNzZXMpO1xuICAgIH1cblxuICAgIGlmIChjcmVhdGVIZWFkZXIpIHtcbiAgICAgIF9mbkRldGVjdEhlYWRlcihvU2V0dGluZ3MuYW9IZWFkZXIsIHRoZWFkKTtcbiAgICB9XG5cbiAgICAkKHRoZWFkKS5maW5kKCc+dHInKS5hdHRyKCdyb2xlJywgJ3JvdycpO1xuICAgICQodGhlYWQpLmZpbmQoJz50cj50aCwgPnRyPnRkJykuYWRkQ2xhc3MoY2xhc3Nlcy5zSGVhZGVyVEgpO1xuICAgICQodGZvb3QpLmZpbmQoJz50cj50aCwgPnRyPnRkJykuYWRkQ2xhc3MoY2xhc3Nlcy5zRm9vdGVyVEgpO1xuXG4gICAgaWYgKHRmb290ICE9PSBudWxsKSB7XG4gICAgICB2YXIgY2VsbHMgPSBvU2V0dGluZ3MuYW9Gb290ZXJbMF07XG5cbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IGNlbGxzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGNvbHVtbiA9IGNvbHVtbnNbaV07XG4gICAgICAgIGNvbHVtbi5uVGYgPSBjZWxsc1tpXS5jZWxsO1xuXG4gICAgICAgIGlmIChjb2x1bW4uc0NsYXNzKSB7XG4gICAgICAgICAgJChjb2x1bW4ublRmKS5hZGRDbGFzcyhjb2x1bW4uc0NsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkRyYXdIZWFkKG9TZXR0aW5ncywgYW9Tb3VyY2UsIGJJbmNsdWRlSGlkZGVuKSB7XG4gICAgdmFyIGksIGlMZW4sIGosIGpMZW4sIGssIGtMZW4sIG4sIG5Mb2NhbFRyO1xuICAgIHZhciBhb0xvY2FsID0gW107XG4gICAgdmFyIGFBcHBsaWVkID0gW107XG4gICAgdmFyIGlDb2x1bW5zID0gb1NldHRpbmdzLmFvQ29sdW1ucy5sZW5ndGg7XG4gICAgdmFyIGlSb3dzcGFuLCBpQ29sc3BhbjtcblxuICAgIGlmICghYW9Tb3VyY2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoYkluY2x1ZGVIaWRkZW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgYkluY2x1ZGVIaWRkZW4gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW9Tb3VyY2UubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICBhb0xvY2FsW2ldID0gYW9Tb3VyY2VbaV0uc2xpY2UoKTtcbiAgICAgIGFvTG9jYWxbaV0ublRyID0gYW9Tb3VyY2VbaV0ublRyO1xuXG4gICAgICBmb3IgKGogPSBpQ29sdW1ucyAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICAgIGlmICghb1NldHRpbmdzLmFvQ29sdW1uc1tqXS5iVmlzaWJsZSAmJiAhYkluY2x1ZGVIaWRkZW4pIHtcbiAgICAgICAgICBhb0xvY2FsW2ldLnNwbGljZShqLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhQXBwbGllZC5wdXNoKFtdKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW9Mb2NhbC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIG5Mb2NhbFRyID0gYW9Mb2NhbFtpXS5uVHI7XG5cbiAgICAgIGlmIChuTG9jYWxUcikge1xuICAgICAgICB3aGlsZSAobiA9IG5Mb2NhbFRyLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICBuTG9jYWxUci5yZW1vdmVDaGlsZChuKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGogPSAwLCBqTGVuID0gYW9Mb2NhbFtpXS5sZW5ndGg7IGogPCBqTGVuOyBqKyspIHtcbiAgICAgICAgaVJvd3NwYW4gPSAxO1xuICAgICAgICBpQ29sc3BhbiA9IDE7XG5cbiAgICAgICAgaWYgKGFBcHBsaWVkW2ldW2pdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBuTG9jYWxUci5hcHBlbmRDaGlsZChhb0xvY2FsW2ldW2pdLmNlbGwpO1xuICAgICAgICAgIGFBcHBsaWVkW2ldW2pdID0gMTtcblxuICAgICAgICAgIHdoaWxlIChhb0xvY2FsW2kgKyBpUm93c3Bhbl0gIT09IHVuZGVmaW5lZCAmJiBhb0xvY2FsW2ldW2pdLmNlbGwgPT0gYW9Mb2NhbFtpICsgaVJvd3NwYW5dW2pdLmNlbGwpIHtcbiAgICAgICAgICAgIGFBcHBsaWVkW2kgKyBpUm93c3Bhbl1bal0gPSAxO1xuICAgICAgICAgICAgaVJvd3NwYW4rKztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB3aGlsZSAoYW9Mb2NhbFtpXVtqICsgaUNvbHNwYW5dICE9PSB1bmRlZmluZWQgJiYgYW9Mb2NhbFtpXVtqXS5jZWxsID09IGFvTG9jYWxbaV1baiArIGlDb2xzcGFuXS5jZWxsKSB7XG4gICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgaVJvd3NwYW47IGsrKykge1xuICAgICAgICAgICAgICBhQXBwbGllZFtpICsga11baiArIGlDb2xzcGFuXSA9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlDb2xzcGFuKys7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJChhb0xvY2FsW2ldW2pdLmNlbGwpLmF0dHIoJ3Jvd3NwYW4nLCBpUm93c3BhbikuYXR0cignY29sc3BhbicsIGlDb2xzcGFuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkRyYXcob1NldHRpbmdzKSB7XG4gICAgdmFyIGFQcmVEcmF3ID0gX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgJ2FvUHJlRHJhd0NhbGxiYWNrJywgJ3ByZURyYXcnLCBbb1NldHRpbmdzXSk7XG5cbiAgICBpZiAoJC5pbkFycmF5KGZhbHNlLCBhUHJlRHJhdykgIT09IC0xKSB7XG4gICAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShvU2V0dGluZ3MsIGZhbHNlKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBpLCBpTGVuLCBuO1xuICAgIHZhciBhblJvd3MgPSBbXTtcbiAgICB2YXIgaVJvd0NvdW50ID0gMDtcbiAgICB2YXIgYXNTdHJpcGVDbGFzc2VzID0gb1NldHRpbmdzLmFzU3RyaXBlQ2xhc3NlcztcbiAgICB2YXIgaVN0cmlwZXMgPSBhc1N0cmlwZUNsYXNzZXMubGVuZ3RoO1xuICAgIHZhciBpT3BlblJvd3MgPSBvU2V0dGluZ3MuYW9PcGVuUm93cy5sZW5ndGg7XG4gICAgdmFyIG9MYW5nID0gb1NldHRpbmdzLm9MYW5ndWFnZTtcbiAgICB2YXIgaUluaXREaXNwbGF5U3RhcnQgPSBvU2V0dGluZ3MuaUluaXREaXNwbGF5U3RhcnQ7XG4gICAgdmFyIGJTZXJ2ZXJTaWRlID0gX2ZuRGF0YVNvdXJjZShvU2V0dGluZ3MpID09ICdzc3AnO1xuICAgIHZhciBhaURpc3BsYXkgPSBvU2V0dGluZ3MuYWlEaXNwbGF5O1xuICAgIG9TZXR0aW5ncy5iRHJhd2luZyA9IHRydWU7XG5cbiAgICBpZiAoaUluaXREaXNwbGF5U3RhcnQgIT09IHVuZGVmaW5lZCAmJiBpSW5pdERpc3BsYXlTdGFydCAhPT0gLTEpIHtcbiAgICAgIG9TZXR0aW5ncy5faURpc3BsYXlTdGFydCA9IGJTZXJ2ZXJTaWRlID8gaUluaXREaXNwbGF5U3RhcnQgOiBpSW5pdERpc3BsYXlTdGFydCA+PSBvU2V0dGluZ3MuZm5SZWNvcmRzRGlzcGxheSgpID8gMCA6IGlJbml0RGlzcGxheVN0YXJ0O1xuICAgICAgb1NldHRpbmdzLmlJbml0RGlzcGxheVN0YXJ0ID0gLTE7XG4gICAgfVxuXG4gICAgdmFyIGlEaXNwbGF5U3RhcnQgPSBvU2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQ7XG4gICAgdmFyIGlEaXNwbGF5RW5kID0gb1NldHRpbmdzLmZuRGlzcGxheUVuZCgpO1xuXG4gICAgaWYgKG9TZXR0aW5ncy5iRGVmZXJMb2FkaW5nKSB7XG4gICAgICBvU2V0dGluZ3MuYkRlZmVyTG9hZGluZyA9IGZhbHNlO1xuICAgICAgb1NldHRpbmdzLmlEcmF3Kys7XG5cbiAgICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KG9TZXR0aW5ncywgZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAoIWJTZXJ2ZXJTaWRlKSB7XG4gICAgICBvU2V0dGluZ3MuaURyYXcrKztcbiAgICB9IGVsc2UgaWYgKCFvU2V0dGluZ3MuYkRlc3Ryb3lpbmcgJiYgIV9mbkFqYXhVcGRhdGUob1NldHRpbmdzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChhaURpc3BsYXkubGVuZ3RoICE9PSAwKSB7XG4gICAgICB2YXIgaVN0YXJ0ID0gYlNlcnZlclNpZGUgPyAwIDogaURpc3BsYXlTdGFydDtcbiAgICAgIHZhciBpRW5kID0gYlNlcnZlclNpZGUgPyBvU2V0dGluZ3MuYW9EYXRhLmxlbmd0aCA6IGlEaXNwbGF5RW5kO1xuXG4gICAgICBmb3IgKHZhciBqID0gaVN0YXJ0OyBqIDwgaUVuZDsgaisrKSB7XG4gICAgICAgIHZhciBpRGF0YUluZGV4ID0gYWlEaXNwbGF5W2pdO1xuICAgICAgICB2YXIgYW9EYXRhID0gb1NldHRpbmdzLmFvRGF0YVtpRGF0YUluZGV4XTtcblxuICAgICAgICBpZiAoYW9EYXRhLm5UciA9PT0gbnVsbCkge1xuICAgICAgICAgIF9mbkNyZWF0ZVRyKG9TZXR0aW5ncywgaURhdGFJbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgblJvdyA9IGFvRGF0YS5uVHI7XG5cbiAgICAgICAgaWYgKGlTdHJpcGVzICE9PSAwKSB7XG4gICAgICAgICAgdmFyIHNTdHJpcGUgPSBhc1N0cmlwZUNsYXNzZXNbaVJvd0NvdW50ICUgaVN0cmlwZXNdO1xuXG4gICAgICAgICAgaWYgKGFvRGF0YS5fc1Jvd1N0cmlwZSAhPSBzU3RyaXBlKSB7XG4gICAgICAgICAgICAkKG5Sb3cpLnJlbW92ZUNsYXNzKGFvRGF0YS5fc1Jvd1N0cmlwZSkuYWRkQ2xhc3Moc1N0cmlwZSk7XG4gICAgICAgICAgICBhb0RhdGEuX3NSb3dTdHJpcGUgPSBzU3RyaXBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9mbkNhbGxiYWNrRmlyZShvU2V0dGluZ3MsICdhb1Jvd0NhbGxiYWNrJywgbnVsbCwgW25Sb3csIGFvRGF0YS5fYURhdGEsIGlSb3dDb3VudCwgaiwgaURhdGFJbmRleF0pO1xuXG4gICAgICAgIGFuUm93cy5wdXNoKG5Sb3cpO1xuICAgICAgICBpUm93Q291bnQrKztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHNaZXJvID0gb0xhbmcuc1plcm9SZWNvcmRzO1xuXG4gICAgICBpZiAob1NldHRpbmdzLmlEcmF3ID09IDEgJiYgX2ZuRGF0YVNvdXJjZShvU2V0dGluZ3MpID09ICdhamF4Jykge1xuICAgICAgICBzWmVybyA9IG9MYW5nLnNMb2FkaW5nUmVjb3JkcztcbiAgICAgIH0gZWxzZSBpZiAob0xhbmcuc0VtcHR5VGFibGUgJiYgb1NldHRpbmdzLmZuUmVjb3Jkc1RvdGFsKCkgPT09IDApIHtcbiAgICAgICAgc1plcm8gPSBvTGFuZy5zRW1wdHlUYWJsZTtcbiAgICAgIH1cblxuICAgICAgYW5Sb3dzWzBdID0gJCgnPHRyLz4nLCB7XG4gICAgICAgICdjbGFzcyc6IGlTdHJpcGVzID8gYXNTdHJpcGVDbGFzc2VzWzBdIDogJydcbiAgICAgIH0pLmFwcGVuZCgkKCc8dGQgLz4nLCB7XG4gICAgICAgICd2YWxpZ24nOiAndG9wJyxcbiAgICAgICAgJ2NvbFNwYW4nOiBfZm5WaXNibGVDb2x1bW5zKG9TZXR0aW5ncyksXG4gICAgICAgICdjbGFzcyc6IG9TZXR0aW5ncy5vQ2xhc3Nlcy5zUm93RW1wdHlcbiAgICAgIH0pLmh0bWwoc1plcm8pKVswXTtcbiAgICB9XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCAnYW9IZWFkZXJDYWxsYmFjaycsICdoZWFkZXInLCBbJChvU2V0dGluZ3MublRIZWFkKS5jaGlsZHJlbigndHInKVswXSwgX2ZuR2V0RGF0YU1hc3RlcihvU2V0dGluZ3MpLCBpRGlzcGxheVN0YXJ0LCBpRGlzcGxheUVuZCwgYWlEaXNwbGF5XSk7XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCAnYW9Gb290ZXJDYWxsYmFjaycsICdmb290ZXInLCBbJChvU2V0dGluZ3MublRGb290KS5jaGlsZHJlbigndHInKVswXSwgX2ZuR2V0RGF0YU1hc3RlcihvU2V0dGluZ3MpLCBpRGlzcGxheVN0YXJ0LCBpRGlzcGxheUVuZCwgYWlEaXNwbGF5XSk7XG5cbiAgICB2YXIgYm9keSA9ICQob1NldHRpbmdzLm5UQm9keSk7XG4gICAgYm9keS5jaGlsZHJlbigpLmRldGFjaCgpO1xuICAgIGJvZHkuYXBwZW5kKCQoYW5Sb3dzKSk7XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCAnYW9EcmF3Q2FsbGJhY2snLCAnZHJhdycsIFtvU2V0dGluZ3NdKTtcblxuICAgIG9TZXR0aW5ncy5iU29ydGVkID0gZmFsc2U7XG4gICAgb1NldHRpbmdzLmJGaWx0ZXJlZCA9IGZhbHNlO1xuICAgIG9TZXR0aW5ncy5iRHJhd2luZyA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuUmVEcmF3KHNldHRpbmdzLCBob2xkUG9zaXRpb24pIHtcbiAgICB2YXIgZmVhdHVyZXMgPSBzZXR0aW5ncy5vRmVhdHVyZXMsXG4gICAgICAgIHNvcnQgPSBmZWF0dXJlcy5iU29ydCxcbiAgICAgICAgZmlsdGVyID0gZmVhdHVyZXMuYkZpbHRlcjtcblxuICAgIGlmIChzb3J0KSB7XG4gICAgICBfZm5Tb3J0KHNldHRpbmdzKTtcbiAgICB9XG5cbiAgICBpZiAoZmlsdGVyKSB7XG4gICAgICBfZm5GaWx0ZXJDb21wbGV0ZShzZXR0aW5ncywgc2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0dGluZ3MuYWlEaXNwbGF5ID0gc2V0dGluZ3MuYWlEaXNwbGF5TWFzdGVyLnNsaWNlKCk7XG4gICAgfVxuXG4gICAgaWYgKGhvbGRQb3NpdGlvbiAhPT0gdHJ1ZSkge1xuICAgICAgc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQgPSAwO1xuICAgIH1cblxuICAgIHNldHRpbmdzLl9kcmF3SG9sZCA9IGhvbGRQb3NpdGlvbjtcblxuICAgIF9mbkRyYXcoc2V0dGluZ3MpO1xuXG4gICAgc2V0dGluZ3MuX2RyYXdIb2xkID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5BZGRPcHRpb25zSHRtbChvU2V0dGluZ3MpIHtcbiAgICB2YXIgY2xhc3NlcyA9IG9TZXR0aW5ncy5vQ2xhc3NlcztcbiAgICB2YXIgdGFibGUgPSAkKG9TZXR0aW5ncy5uVGFibGUpO1xuICAgIHZhciBob2xkaW5nID0gJCgnPGRpdi8+JykuaW5zZXJ0QmVmb3JlKHRhYmxlKTtcbiAgICB2YXIgZmVhdHVyZXMgPSBvU2V0dGluZ3Mub0ZlYXR1cmVzO1xuICAgIHZhciBpbnNlcnQgPSAkKCc8ZGl2Lz4nLCB7XG4gICAgICBpZDogb1NldHRpbmdzLnNUYWJsZUlkICsgJ193cmFwcGVyJyxcbiAgICAgICdjbGFzcyc6IGNsYXNzZXMuc1dyYXBwZXIgKyAob1NldHRpbmdzLm5URm9vdCA/ICcnIDogJyAnICsgY2xhc3Nlcy5zTm9Gb290ZXIpXG4gICAgfSk7XG4gICAgb1NldHRpbmdzLm5Ib2xkaW5nID0gaG9sZGluZ1swXTtcbiAgICBvU2V0dGluZ3MublRhYmxlV3JhcHBlciA9IGluc2VydFswXTtcbiAgICBvU2V0dGluZ3MublRhYmxlUmVpbnNlcnRCZWZvcmUgPSBvU2V0dGluZ3MublRhYmxlLm5leHRTaWJsaW5nO1xuICAgIHZhciBhRG9tID0gb1NldHRpbmdzLnNEb20uc3BsaXQoJycpO1xuICAgIHZhciBmZWF0dXJlTm9kZSwgY09wdGlvbiwgbk5ld05vZGUsIGNOZXh0LCBzQXR0ciwgajtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYURvbS5sZW5ndGg7IGkrKykge1xuICAgICAgZmVhdHVyZU5vZGUgPSBudWxsO1xuICAgICAgY09wdGlvbiA9IGFEb21baV07XG5cbiAgICAgIGlmIChjT3B0aW9uID09ICc8Jykge1xuICAgICAgICBuTmV3Tm9kZSA9ICQoJzxkaXYvPicpWzBdO1xuICAgICAgICBjTmV4dCA9IGFEb21baSArIDFdO1xuXG4gICAgICAgIGlmIChjTmV4dCA9PSBcIidcIiB8fCBjTmV4dCA9PSAnXCInKSB7XG4gICAgICAgICAgc0F0dHIgPSBcIlwiO1xuICAgICAgICAgIGogPSAyO1xuXG4gICAgICAgICAgd2hpbGUgKGFEb21baSArIGpdICE9IGNOZXh0KSB7XG4gICAgICAgICAgICBzQXR0ciArPSBhRG9tW2kgKyBqXTtcbiAgICAgICAgICAgIGorKztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc0F0dHIgPT0gXCJIXCIpIHtcbiAgICAgICAgICAgIHNBdHRyID0gY2xhc3Nlcy5zSlVJSGVhZGVyO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc0F0dHIgPT0gXCJGXCIpIHtcbiAgICAgICAgICAgIHNBdHRyID0gY2xhc3Nlcy5zSlVJRm9vdGVyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzQXR0ci5pbmRleE9mKCcuJykgIT0gLTEpIHtcbiAgICAgICAgICAgIHZhciBhU3BsaXQgPSBzQXR0ci5zcGxpdCgnLicpO1xuICAgICAgICAgICAgbk5ld05vZGUuaWQgPSBhU3BsaXRbMF0uc3Vic3RyKDEsIGFTcGxpdFswXS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIG5OZXdOb2RlLmNsYXNzTmFtZSA9IGFTcGxpdFsxXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNBdHRyLmNoYXJBdCgwKSA9PSBcIiNcIikge1xuICAgICAgICAgICAgbk5ld05vZGUuaWQgPSBzQXR0ci5zdWJzdHIoMSwgc0F0dHIubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5OZXdOb2RlLmNsYXNzTmFtZSA9IHNBdHRyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGkgKz0gajtcbiAgICAgICAgfVxuXG4gICAgICAgIGluc2VydC5hcHBlbmQobk5ld05vZGUpO1xuICAgICAgICBpbnNlcnQgPSAkKG5OZXdOb2RlKTtcbiAgICAgIH0gZWxzZSBpZiAoY09wdGlvbiA9PSAnPicpIHtcbiAgICAgICAgaW5zZXJ0ID0gaW5zZXJ0LnBhcmVudCgpO1xuICAgICAgfSBlbHNlIGlmIChjT3B0aW9uID09ICdsJyAmJiBmZWF0dXJlcy5iUGFnaW5hdGUgJiYgZmVhdHVyZXMuYkxlbmd0aENoYW5nZSkge1xuICAgICAgICAgIGZlYXR1cmVOb2RlID0gX2ZuRmVhdHVyZUh0bWxMZW5ndGgob1NldHRpbmdzKTtcbiAgICAgICAgfSBlbHNlIGlmIChjT3B0aW9uID09ICdmJyAmJiBmZWF0dXJlcy5iRmlsdGVyKSB7XG4gICAgICAgICAgZmVhdHVyZU5vZGUgPSBfZm5GZWF0dXJlSHRtbEZpbHRlcihvU2V0dGluZ3MpO1xuICAgICAgICB9IGVsc2UgaWYgKGNPcHRpb24gPT0gJ3InICYmIGZlYXR1cmVzLmJQcm9jZXNzaW5nKSB7XG4gICAgICAgICAgZmVhdHVyZU5vZGUgPSBfZm5GZWF0dXJlSHRtbFByb2Nlc3Npbmcob1NldHRpbmdzKTtcbiAgICAgICAgfSBlbHNlIGlmIChjT3B0aW9uID09ICd0Jykge1xuICAgICAgICAgIGZlYXR1cmVOb2RlID0gX2ZuRmVhdHVyZUh0bWxUYWJsZShvU2V0dGluZ3MpO1xuICAgICAgICB9IGVsc2UgaWYgKGNPcHRpb24gPT0gJ2knICYmIGZlYXR1cmVzLmJJbmZvKSB7XG4gICAgICAgICAgZmVhdHVyZU5vZGUgPSBfZm5GZWF0dXJlSHRtbEluZm8ob1NldHRpbmdzKTtcbiAgICAgICAgfSBlbHNlIGlmIChjT3B0aW9uID09ICdwJyAmJiBmZWF0dXJlcy5iUGFnaW5hdGUpIHtcbiAgICAgICAgICBmZWF0dXJlTm9kZSA9IF9mbkZlYXR1cmVIdG1sUGFnaW5hdGUob1NldHRpbmdzKTtcbiAgICAgICAgfSBlbHNlIGlmIChEYXRhVGFibGUuZXh0LmZlYXR1cmUubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgdmFyIGFvRmVhdHVyZXMgPSBEYXRhVGFibGUuZXh0LmZlYXR1cmU7XG5cbiAgICAgICAgICBmb3IgKHZhciBrID0gMCwga0xlbiA9IGFvRmVhdHVyZXMubGVuZ3RoOyBrIDwga0xlbjsgaysrKSB7XG4gICAgICAgICAgICBpZiAoY09wdGlvbiA9PSBhb0ZlYXR1cmVzW2tdLmNGZWF0dXJlKSB7XG4gICAgICAgICAgICAgIGZlYXR1cmVOb2RlID0gYW9GZWF0dXJlc1trXS5mbkluaXQob1NldHRpbmdzKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIGlmIChmZWF0dXJlTm9kZSkge1xuICAgICAgICB2YXIgYWFuRmVhdHVyZXMgPSBvU2V0dGluZ3MuYWFuRmVhdHVyZXM7XG5cbiAgICAgICAgaWYgKCFhYW5GZWF0dXJlc1tjT3B0aW9uXSkge1xuICAgICAgICAgIGFhbkZlYXR1cmVzW2NPcHRpb25dID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBhYW5GZWF0dXJlc1tjT3B0aW9uXS5wdXNoKGZlYXR1cmVOb2RlKTtcbiAgICAgICAgaW5zZXJ0LmFwcGVuZChmZWF0dXJlTm9kZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaG9sZGluZy5yZXBsYWNlV2l0aChpbnNlcnQpO1xuICAgIG9TZXR0aW5ncy5uSG9sZGluZyA9IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5EZXRlY3RIZWFkZXIoYUxheW91dCwgblRoZWFkKSB7XG4gICAgdmFyIG5UcnMgPSAkKG5UaGVhZCkuY2hpbGRyZW4oJ3RyJyk7XG4gICAgdmFyIG5UciwgbkNlbGw7XG4gICAgdmFyIGksIGssIGwsIGlMZW4sIGpMZW4sIGlDb2xTaGlmdGVkLCBpQ29sdW1uLCBpQ29sc3BhbiwgaVJvd3NwYW47XG4gICAgdmFyIGJVbmlxdWU7XG5cbiAgICB2YXIgZm5TaGlmdENvbCA9IGZ1bmN0aW9uIGZuU2hpZnRDb2woYSwgaSwgaikge1xuICAgICAgdmFyIGsgPSBhW2ldO1xuXG4gICAgICB3aGlsZSAoa1tqXSkge1xuICAgICAgICBqKys7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBqO1xuICAgIH07XG5cbiAgICBhTGF5b3V0LnNwbGljZSgwLCBhTGF5b3V0Lmxlbmd0aCk7XG5cbiAgICBmb3IgKGkgPSAwLCBpTGVuID0gblRycy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIGFMYXlvdXQucHVzaChbXSk7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMCwgaUxlbiA9IG5UcnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICBuVHIgPSBuVHJzW2ldO1xuICAgICAgaUNvbHVtbiA9IDA7XG4gICAgICBuQ2VsbCA9IG5Uci5maXJzdENoaWxkO1xuXG4gICAgICB3aGlsZSAobkNlbGwpIHtcbiAgICAgICAgaWYgKG5DZWxsLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT0gXCJURFwiIHx8IG5DZWxsLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT0gXCJUSFwiKSB7XG4gICAgICAgICAgaUNvbHNwYW4gPSBuQ2VsbC5nZXRBdHRyaWJ1dGUoJ2NvbHNwYW4nKSAqIDE7XG4gICAgICAgICAgaVJvd3NwYW4gPSBuQ2VsbC5nZXRBdHRyaWJ1dGUoJ3Jvd3NwYW4nKSAqIDE7XG4gICAgICAgICAgaUNvbHNwYW4gPSAhaUNvbHNwYW4gfHwgaUNvbHNwYW4gPT09IDAgfHwgaUNvbHNwYW4gPT09IDEgPyAxIDogaUNvbHNwYW47XG4gICAgICAgICAgaVJvd3NwYW4gPSAhaVJvd3NwYW4gfHwgaVJvd3NwYW4gPT09IDAgfHwgaVJvd3NwYW4gPT09IDEgPyAxIDogaVJvd3NwYW47XG4gICAgICAgICAgaUNvbFNoaWZ0ZWQgPSBmblNoaWZ0Q29sKGFMYXlvdXQsIGksIGlDb2x1bW4pO1xuICAgICAgICAgIGJVbmlxdWUgPSBpQ29sc3BhbiA9PT0gMSA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgICAgIGZvciAobCA9IDA7IGwgPCBpQ29sc3BhbjsgbCsrKSB7XG4gICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgaVJvd3NwYW47IGsrKykge1xuICAgICAgICAgICAgICBhTGF5b3V0W2kgKyBrXVtpQ29sU2hpZnRlZCArIGxdID0ge1xuICAgICAgICAgICAgICAgIFwiY2VsbFwiOiBuQ2VsbCxcbiAgICAgICAgICAgICAgICBcInVuaXF1ZVwiOiBiVW5pcXVlXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGFMYXlvdXRbaSArIGtdLm5UciA9IG5UcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBuQ2VsbCA9IG5DZWxsLm5leHRTaWJsaW5nO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkdldFVuaXF1ZVRocyhvU2V0dGluZ3MsIG5IZWFkZXIsIGFMYXlvdXQpIHtcbiAgICB2YXIgYVJldHVybiA9IFtdO1xuXG4gICAgaWYgKCFhTGF5b3V0KSB7XG4gICAgICBhTGF5b3V0ID0gb1NldHRpbmdzLmFvSGVhZGVyO1xuXG4gICAgICBpZiAobkhlYWRlcikge1xuICAgICAgICBhTGF5b3V0ID0gW107XG5cbiAgICAgICAgX2ZuRGV0ZWN0SGVhZGVyKGFMYXlvdXQsIG5IZWFkZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gYUxheW91dC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwLCBqTGVuID0gYUxheW91dFtpXS5sZW5ndGg7IGogPCBqTGVuOyBqKyspIHtcbiAgICAgICAgaWYgKGFMYXlvdXRbaV1bal0udW5pcXVlICYmICghYVJldHVybltqXSB8fCAhb1NldHRpbmdzLmJTb3J0Q2VsbHNUb3ApKSB7XG4gICAgICAgICAgYVJldHVybltqXSA9IGFMYXlvdXRbaV1bal0uY2VsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhUmV0dXJuO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQnVpbGRBamF4KG9TZXR0aW5ncywgZGF0YSwgZm4pIHtcbiAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCAnYW9TZXJ2ZXJQYXJhbXMnLCAnc2VydmVyUGFyYW1zJywgW2RhdGFdKTtcblxuICAgIGlmIChkYXRhICYmICQuaXNBcnJheShkYXRhKSkge1xuICAgICAgdmFyIHRtcCA9IHt9O1xuICAgICAgdmFyIHJicmFja2V0ID0gLyguKj8pXFxbXFxdJC87XG4gICAgICAkLmVhY2goZGF0YSwgZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHZhbC5uYW1lLm1hdGNoKHJicmFja2V0KTtcblxuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICB2YXIgbmFtZSA9IG1hdGNoWzBdO1xuXG4gICAgICAgICAgaWYgKCF0bXBbbmFtZV0pIHtcbiAgICAgICAgICAgIHRtcFtuYW1lXSA9IFtdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRtcFtuYW1lXS5wdXNoKHZhbC52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG1wW3ZhbC5uYW1lXSA9IHZhbC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYXRhID0gdG1wO1xuICAgIH1cblxuICAgIHZhciBhamF4RGF0YTtcbiAgICB2YXIgYWpheCA9IG9TZXR0aW5ncy5hamF4O1xuICAgIHZhciBpbnN0YW5jZSA9IG9TZXR0aW5ncy5vSW5zdGFuY2U7XG5cbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiBjYWxsYmFjayhqc29uKSB7XG4gICAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCBudWxsLCAneGhyJywgW29TZXR0aW5ncywganNvbiwgb1NldHRpbmdzLmpxWEhSXSk7XG5cbiAgICAgIGZuKGpzb24pO1xuICAgIH07XG5cbiAgICBpZiAoJC5pc1BsYWluT2JqZWN0KGFqYXgpICYmIGFqYXguZGF0YSkge1xuICAgICAgYWpheERhdGEgPSBhamF4LmRhdGE7XG4gICAgICB2YXIgbmV3RGF0YSA9IHR5cGVvZiBhamF4RGF0YSA9PT0gJ2Z1bmN0aW9uJyA/IGFqYXhEYXRhKGRhdGEsIG9TZXR0aW5ncykgOiBhamF4RGF0YTtcbiAgICAgIGRhdGEgPSB0eXBlb2YgYWpheERhdGEgPT09ICdmdW5jdGlvbicgJiYgbmV3RGF0YSA/IG5ld0RhdGEgOiAkLmV4dGVuZCh0cnVlLCBkYXRhLCBuZXdEYXRhKTtcbiAgICAgIGRlbGV0ZSBhamF4LmRhdGE7XG4gICAgfVxuXG4gICAgdmFyIGJhc2VBamF4ID0ge1xuICAgICAgXCJkYXRhXCI6IGRhdGEsXG4gICAgICBcInN1Y2Nlc3NcIjogZnVuY3Rpb24gc3VjY2Vzcyhqc29uKSB7XG4gICAgICAgIHZhciBlcnJvciA9IGpzb24uZXJyb3IgfHwganNvbi5zRXJyb3I7XG5cbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgX2ZuTG9nKG9TZXR0aW5ncywgMCwgZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgb1NldHRpbmdzLmpzb24gPSBqc29uO1xuICAgICAgICBjYWxsYmFjayhqc29uKTtcbiAgICAgIH0sXG4gICAgICBcImRhdGFUeXBlXCI6IFwianNvblwiLFxuICAgICAgXCJjYWNoZVwiOiBmYWxzZSxcbiAgICAgIFwidHlwZVwiOiBvU2V0dGluZ3Muc1NlcnZlck1ldGhvZCxcbiAgICAgIFwiZXJyb3JcIjogZnVuY3Rpb24gZXJyb3IoeGhyLCBfZXJyb3IsIHRocm93bikge1xuICAgICAgICB2YXIgcmV0ID0gX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgbnVsbCwgJ3hocicsIFtvU2V0dGluZ3MsIG51bGwsIG9TZXR0aW5ncy5qcVhIUl0pO1xuXG4gICAgICAgIGlmICgkLmluQXJyYXkodHJ1ZSwgcmV0KSA9PT0gLTEpIHtcbiAgICAgICAgICBpZiAoX2Vycm9yID09IFwicGFyc2VyZXJyb3JcIikge1xuICAgICAgICAgICAgX2ZuTG9nKG9TZXR0aW5ncywgMCwgJ0ludmFsaWQgSlNPTiByZXNwb25zZScsIDEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgIF9mbkxvZyhvU2V0dGluZ3MsIDAsICdBamF4IGVycm9yJywgNyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkob1NldHRpbmdzLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBvU2V0dGluZ3Mub0FqYXhEYXRhID0gZGF0YTtcblxuICAgIF9mbkNhbGxiYWNrRmlyZShvU2V0dGluZ3MsIG51bGwsICdwcmVYaHInLCBbb1NldHRpbmdzLCBkYXRhXSk7XG5cbiAgICBpZiAob1NldHRpbmdzLmZuU2VydmVyRGF0YSkge1xuICAgICAgb1NldHRpbmdzLmZuU2VydmVyRGF0YS5jYWxsKGluc3RhbmNlLCBvU2V0dGluZ3Muc0FqYXhTb3VyY2UsICQubWFwKGRhdGEsIGZ1bmN0aW9uICh2YWwsIGtleSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdmFsXG4gICAgICAgIH07XG4gICAgICB9KSwgY2FsbGJhY2ssIG9TZXR0aW5ncyk7XG4gICAgfSBlbHNlIGlmIChvU2V0dGluZ3Muc0FqYXhTb3VyY2UgfHwgdHlwZW9mIGFqYXggPT09ICdzdHJpbmcnKSB7XG4gICAgICBvU2V0dGluZ3MuanFYSFIgPSAkLmFqYXgoJC5leHRlbmQoYmFzZUFqYXgsIHtcbiAgICAgICAgdXJsOiBhamF4IHx8IG9TZXR0aW5ncy5zQWpheFNvdXJjZVxuICAgICAgfSkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFqYXggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG9TZXR0aW5ncy5qcVhIUiA9IGFqYXguY2FsbChpbnN0YW5jZSwgZGF0YSwgY2FsbGJhY2ssIG9TZXR0aW5ncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9TZXR0aW5ncy5qcVhIUiA9ICQuYWpheCgkLmV4dGVuZChiYXNlQWpheCwgYWpheCkpO1xuICAgICAgYWpheC5kYXRhID0gYWpheERhdGE7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQWpheFVwZGF0ZShzZXR0aW5ncykge1xuICAgIGlmIChzZXR0aW5ncy5iQWpheERhdGFHZXQpIHtcbiAgICAgIHNldHRpbmdzLmlEcmF3Kys7XG5cbiAgICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KHNldHRpbmdzLCB0cnVlKTtcblxuICAgICAgX2ZuQnVpbGRBamF4KHNldHRpbmdzLCBfZm5BamF4UGFyYW1ldGVycyhzZXR0aW5ncyksIGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgIF9mbkFqYXhVcGRhdGVEcmF3KHNldHRpbmdzLCBqc29uKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5BamF4UGFyYW1ldGVycyhzZXR0aW5ncykge1xuICAgIHZhciBjb2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zLFxuICAgICAgICBjb2x1bW5Db3VudCA9IGNvbHVtbnMubGVuZ3RoLFxuICAgICAgICBmZWF0dXJlcyA9IHNldHRpbmdzLm9GZWF0dXJlcyxcbiAgICAgICAgcHJlU2VhcmNoID0gc2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoLFxuICAgICAgICBwcmVDb2xTZWFyY2ggPSBzZXR0aW5ncy5hb1ByZVNlYXJjaENvbHMsXG4gICAgICAgIGksXG4gICAgICAgIGRhdGEgPSBbXSxcbiAgICAgICAgZGF0YVByb3AsXG4gICAgICAgIGNvbHVtbixcbiAgICAgICAgY29sdW1uU2VhcmNoLFxuICAgICAgICBzb3J0ID0gX2ZuU29ydEZsYXR0ZW4oc2V0dGluZ3MpLFxuICAgICAgICBkaXNwbGF5U3RhcnQgPSBzZXR0aW5ncy5faURpc3BsYXlTdGFydCxcbiAgICAgICAgZGlzcGxheUxlbmd0aCA9IGZlYXR1cmVzLmJQYWdpbmF0ZSAhPT0gZmFsc2UgPyBzZXR0aW5ncy5faURpc3BsYXlMZW5ndGggOiAtMTtcblxuICAgIHZhciBwYXJhbSA9IGZ1bmN0aW9uIHBhcmFtKG5hbWUsIHZhbHVlKSB7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICAnbmFtZSc6IG5hbWUsXG4gICAgICAgICd2YWx1ZSc6IHZhbHVlXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcGFyYW0oJ3NFY2hvJywgc2V0dGluZ3MuaURyYXcpO1xuICAgIHBhcmFtKCdpQ29sdW1ucycsIGNvbHVtbkNvdW50KTtcbiAgICBwYXJhbSgnc0NvbHVtbnMnLCBfcGx1Y2soY29sdW1ucywgJ3NOYW1lJykuam9pbignLCcpKTtcbiAgICBwYXJhbSgnaURpc3BsYXlTdGFydCcsIGRpc3BsYXlTdGFydCk7XG4gICAgcGFyYW0oJ2lEaXNwbGF5TGVuZ3RoJywgZGlzcGxheUxlbmd0aCk7XG4gICAgdmFyIGQgPSB7XG4gICAgICBkcmF3OiBzZXR0aW5ncy5pRHJhdyxcbiAgICAgIGNvbHVtbnM6IFtdLFxuICAgICAgb3JkZXI6IFtdLFxuICAgICAgc3RhcnQ6IGRpc3BsYXlTdGFydCxcbiAgICAgIGxlbmd0aDogZGlzcGxheUxlbmd0aCxcbiAgICAgIHNlYXJjaDoge1xuICAgICAgICB2YWx1ZTogcHJlU2VhcmNoLnNTZWFyY2gsXG4gICAgICAgIHJlZ2V4OiBwcmVTZWFyY2guYlJlZ2V4XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBjb2x1bW5Db3VudDsgaSsrKSB7XG4gICAgICBjb2x1bW4gPSBjb2x1bW5zW2ldO1xuICAgICAgY29sdW1uU2VhcmNoID0gcHJlQ29sU2VhcmNoW2ldO1xuICAgICAgZGF0YVByb3AgPSB0eXBlb2YgY29sdW1uLm1EYXRhID09IFwiZnVuY3Rpb25cIiA/ICdmdW5jdGlvbicgOiBjb2x1bW4ubURhdGE7XG4gICAgICBkLmNvbHVtbnMucHVzaCh7XG4gICAgICAgIGRhdGE6IGRhdGFQcm9wLFxuICAgICAgICBuYW1lOiBjb2x1bW4uc05hbWUsXG4gICAgICAgIHNlYXJjaGFibGU6IGNvbHVtbi5iU2VhcmNoYWJsZSxcbiAgICAgICAgb3JkZXJhYmxlOiBjb2x1bW4uYlNvcnRhYmxlLFxuICAgICAgICBzZWFyY2g6IHtcbiAgICAgICAgICB2YWx1ZTogY29sdW1uU2VhcmNoLnNTZWFyY2gsXG4gICAgICAgICAgcmVnZXg6IGNvbHVtblNlYXJjaC5iUmVnZXhcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBwYXJhbShcIm1EYXRhUHJvcF9cIiArIGksIGRhdGFQcm9wKTtcblxuICAgICAgaWYgKGZlYXR1cmVzLmJGaWx0ZXIpIHtcbiAgICAgICAgcGFyYW0oJ3NTZWFyY2hfJyArIGksIGNvbHVtblNlYXJjaC5zU2VhcmNoKTtcbiAgICAgICAgcGFyYW0oJ2JSZWdleF8nICsgaSwgY29sdW1uU2VhcmNoLmJSZWdleCk7XG4gICAgICAgIHBhcmFtKCdiU2VhcmNoYWJsZV8nICsgaSwgY29sdW1uLmJTZWFyY2hhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZlYXR1cmVzLmJTb3J0KSB7XG4gICAgICAgIHBhcmFtKCdiU29ydGFibGVfJyArIGksIGNvbHVtbi5iU29ydGFibGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmZWF0dXJlcy5iRmlsdGVyKSB7XG4gICAgICBwYXJhbSgnc1NlYXJjaCcsIHByZVNlYXJjaC5zU2VhcmNoKTtcbiAgICAgIHBhcmFtKCdiUmVnZXgnLCBwcmVTZWFyY2guYlJlZ2V4KTtcbiAgICB9XG5cbiAgICBpZiAoZmVhdHVyZXMuYlNvcnQpIHtcbiAgICAgICQuZWFjaChzb3J0LCBmdW5jdGlvbiAoaSwgdmFsKSB7XG4gICAgICAgIGQub3JkZXIucHVzaCh7XG4gICAgICAgICAgY29sdW1uOiB2YWwuY29sLFxuICAgICAgICAgIGRpcjogdmFsLmRpclxuICAgICAgICB9KTtcbiAgICAgICAgcGFyYW0oJ2lTb3J0Q29sXycgKyBpLCB2YWwuY29sKTtcbiAgICAgICAgcGFyYW0oJ3NTb3J0RGlyXycgKyBpLCB2YWwuZGlyKTtcbiAgICAgIH0pO1xuICAgICAgcGFyYW0oJ2lTb3J0aW5nQ29scycsIHNvcnQubGVuZ3RoKTtcbiAgICB9XG5cbiAgICB2YXIgbGVnYWN5ID0gRGF0YVRhYmxlLmV4dC5sZWdhY3kuYWpheDtcblxuICAgIGlmIChsZWdhY3kgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBzZXR0aW5ncy5zQWpheFNvdXJjZSA/IGRhdGEgOiBkO1xuICAgIH1cblxuICAgIHJldHVybiBsZWdhY3kgPyBkYXRhIDogZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFqYXhVcGRhdGVEcmF3KHNldHRpbmdzLCBqc29uKSB7XG4gICAgdmFyIGNvbXBhdCA9IGZ1bmN0aW9uIGNvbXBhdChvbGQsIG1vZGVybikge1xuICAgICAgcmV0dXJuIGpzb25bb2xkXSAhPT0gdW5kZWZpbmVkID8ganNvbltvbGRdIDoganNvblttb2Rlcm5dO1xuICAgIH07XG5cbiAgICB2YXIgZGF0YSA9IF9mbkFqYXhEYXRhU3JjKHNldHRpbmdzLCBqc29uKTtcblxuICAgIHZhciBkcmF3ID0gY29tcGF0KCdzRWNobycsICdkcmF3Jyk7XG4gICAgdmFyIHJlY29yZHNUb3RhbCA9IGNvbXBhdCgnaVRvdGFsUmVjb3JkcycsICdyZWNvcmRzVG90YWwnKTtcbiAgICB2YXIgcmVjb3Jkc0ZpbHRlcmVkID0gY29tcGF0KCdpVG90YWxEaXNwbGF5UmVjb3JkcycsICdyZWNvcmRzRmlsdGVyZWQnKTtcblxuICAgIGlmIChkcmF3KSB7XG4gICAgICBpZiAoZHJhdyAqIDEgPCBzZXR0aW5ncy5pRHJhdykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNldHRpbmdzLmlEcmF3ID0gZHJhdyAqIDE7XG4gICAgfVxuXG4gICAgX2ZuQ2xlYXJUYWJsZShzZXR0aW5ncyk7XG5cbiAgICBzZXR0aW5ncy5faVJlY29yZHNUb3RhbCA9IHBhcnNlSW50KHJlY29yZHNUb3RhbCwgMTApO1xuICAgIHNldHRpbmdzLl9pUmVjb3Jkc0Rpc3BsYXkgPSBwYXJzZUludChyZWNvcmRzRmlsdGVyZWQsIDEwKTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBfZm5BZGREYXRhKHNldHRpbmdzLCBkYXRhW2ldKTtcbiAgICB9XG5cbiAgICBzZXR0aW5ncy5haURpc3BsYXkgPSBzZXR0aW5ncy5haURpc3BsYXlNYXN0ZXIuc2xpY2UoKTtcbiAgICBzZXR0aW5ncy5iQWpheERhdGFHZXQgPSBmYWxzZTtcblxuICAgIF9mbkRyYXcoc2V0dGluZ3MpO1xuXG4gICAgaWYgKCFzZXR0aW5ncy5fYkluaXRDb21wbGV0ZSkge1xuICAgICAgX2ZuSW5pdENvbXBsZXRlKHNldHRpbmdzLCBqc29uKTtcbiAgICB9XG5cbiAgICBzZXR0aW5ncy5iQWpheERhdGFHZXQgPSB0cnVlO1xuXG4gICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkoc2V0dGluZ3MsIGZhbHNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFqYXhEYXRhU3JjKG9TZXR0aW5ncywganNvbikge1xuICAgIHZhciBkYXRhU3JjID0gJC5pc1BsYWluT2JqZWN0KG9TZXR0aW5ncy5hamF4KSAmJiBvU2V0dGluZ3MuYWpheC5kYXRhU3JjICE9PSB1bmRlZmluZWQgPyBvU2V0dGluZ3MuYWpheC5kYXRhU3JjIDogb1NldHRpbmdzLnNBamF4RGF0YVByb3A7XG5cbiAgICBpZiAoZGF0YVNyYyA9PT0gJ2RhdGEnKSB7XG4gICAgICByZXR1cm4ganNvbi5hYURhdGEgfHwganNvbltkYXRhU3JjXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YVNyYyAhPT0gXCJcIiA/IF9mbkdldE9iamVjdERhdGFGbihkYXRhU3JjKShqc29uKSA6IGpzb247XG4gIH1cblxuICBmdW5jdGlvbiBfZm5GZWF0dXJlSHRtbEZpbHRlcihzZXR0aW5ncykge1xuICAgIHZhciBjbGFzc2VzID0gc2V0dGluZ3Mub0NsYXNzZXM7XG4gICAgdmFyIHRhYmxlSWQgPSBzZXR0aW5ncy5zVGFibGVJZDtcbiAgICB2YXIgbGFuZ3VhZ2UgPSBzZXR0aW5ncy5vTGFuZ3VhZ2U7XG4gICAgdmFyIHByZXZpb3VzU2VhcmNoID0gc2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoO1xuICAgIHZhciBmZWF0dXJlcyA9IHNldHRpbmdzLmFhbkZlYXR1cmVzO1xuICAgIHZhciBpbnB1dCA9ICc8aW5wdXQgdHlwZT1cInNlYXJjaFwiIGNsYXNzPVwiJyArIGNsYXNzZXMuc0ZpbHRlcklucHV0ICsgJ1wiLz4nO1xuICAgIHZhciBzdHIgPSBsYW5ndWFnZS5zU2VhcmNoO1xuICAgIHN0ciA9IHN0ci5tYXRjaCgvX0lOUFVUXy8pID8gc3RyLnJlcGxhY2UoJ19JTlBVVF8nLCBpbnB1dCkgOiBzdHIgKyBpbnB1dDtcbiAgICB2YXIgZmlsdGVyID0gJCgnPGRpdi8+Jywge1xuICAgICAgJ2lkJzogIWZlYXR1cmVzLmYgPyB0YWJsZUlkICsgJ19maWx0ZXInIDogbnVsbCxcbiAgICAgICdjbGFzcyc6IGNsYXNzZXMuc0ZpbHRlclxuICAgIH0pLmFwcGVuZCgkKCc8bGFiZWwvPicpLmFwcGVuZChzdHIpKTtcblxuICAgIHZhciBzZWFyY2hGbiA9IGZ1bmN0aW9uIHNlYXJjaEZuKCkge1xuICAgICAgdmFyIG4gPSBmZWF0dXJlcy5mO1xuICAgICAgdmFyIHZhbCA9ICF0aGlzLnZhbHVlID8gXCJcIiA6IHRoaXMudmFsdWU7XG5cbiAgICAgIGlmICh2YWwgIT0gcHJldmlvdXNTZWFyY2guc1NlYXJjaCkge1xuICAgICAgICBfZm5GaWx0ZXJDb21wbGV0ZShzZXR0aW5ncywge1xuICAgICAgICAgIFwic1NlYXJjaFwiOiB2YWwsXG4gICAgICAgICAgXCJiUmVnZXhcIjogcHJldmlvdXNTZWFyY2guYlJlZ2V4LFxuICAgICAgICAgIFwiYlNtYXJ0XCI6IHByZXZpb3VzU2VhcmNoLmJTbWFydCxcbiAgICAgICAgICBcImJDYXNlSW5zZW5zaXRpdmVcIjogcHJldmlvdXNTZWFyY2guYkNhc2VJbnNlbnNpdGl2ZVxuICAgICAgICB9KTtcblxuICAgICAgICBzZXR0aW5ncy5faURpc3BsYXlTdGFydCA9IDA7XG5cbiAgICAgICAgX2ZuRHJhdyhzZXR0aW5ncyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBzZWFyY2hEZWxheSA9IHNldHRpbmdzLnNlYXJjaERlbGF5ICE9PSBudWxsID8gc2V0dGluZ3Muc2VhcmNoRGVsYXkgOiBfZm5EYXRhU291cmNlKHNldHRpbmdzKSA9PT0gJ3NzcCcgPyA0MDAgOiAwO1xuICAgIHZhciBqcUZpbHRlciA9ICQoJ2lucHV0JywgZmlsdGVyKS52YWwocHJldmlvdXNTZWFyY2guc1NlYXJjaCkuYXR0cigncGxhY2Vob2xkZXInLCBsYW5ndWFnZS5zU2VhcmNoUGxhY2Vob2xkZXIpLm9uKCdrZXl1cC5EVCBzZWFyY2guRFQgaW5wdXQuRFQgcGFzdGUuRFQgY3V0LkRUJywgc2VhcmNoRGVsYXkgPyBfZm5UaHJvdHRsZShzZWFyY2hGbiwgc2VhcmNoRGVsYXkpIDogc2VhcmNoRm4pLm9uKCdrZXlwcmVzcy5EVCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KS5hdHRyKCdhcmlhLWNvbnRyb2xzJywgdGFibGVJZCk7XG4gICAgJChzZXR0aW5ncy5uVGFibGUpLm9uKCdzZWFyY2guZHQuRFQnLCBmdW5jdGlvbiAoZXYsIHMpIHtcbiAgICAgIGlmIChzZXR0aW5ncyA9PT0gcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChqcUZpbHRlclswXSAhPT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAganFGaWx0ZXIudmFsKHByZXZpb3VzU2VhcmNoLnNTZWFyY2gpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZmlsdGVyWzBdO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmlsdGVyQ29tcGxldGUob1NldHRpbmdzLCBvSW5wdXQsIGlGb3JjZSkge1xuICAgIHZhciBvUHJldlNlYXJjaCA9IG9TZXR0aW5ncy5vUHJldmlvdXNTZWFyY2g7XG4gICAgdmFyIGFvUHJldlNlYXJjaCA9IG9TZXR0aW5ncy5hb1ByZVNlYXJjaENvbHM7XG5cbiAgICB2YXIgZm5TYXZlRmlsdGVyID0gZnVuY3Rpb24gZm5TYXZlRmlsdGVyKG9GaWx0ZXIpIHtcbiAgICAgIG9QcmV2U2VhcmNoLnNTZWFyY2ggPSBvRmlsdGVyLnNTZWFyY2g7XG4gICAgICBvUHJldlNlYXJjaC5iUmVnZXggPSBvRmlsdGVyLmJSZWdleDtcbiAgICAgIG9QcmV2U2VhcmNoLmJTbWFydCA9IG9GaWx0ZXIuYlNtYXJ0O1xuICAgICAgb1ByZXZTZWFyY2guYkNhc2VJbnNlbnNpdGl2ZSA9IG9GaWx0ZXIuYkNhc2VJbnNlbnNpdGl2ZTtcbiAgICB9O1xuXG4gICAgdmFyIGZuUmVnZXggPSBmdW5jdGlvbiBmblJlZ2V4KG8pIHtcbiAgICAgIHJldHVybiBvLmJFc2NhcGVSZWdleCAhPT0gdW5kZWZpbmVkID8gIW8uYkVzY2FwZVJlZ2V4IDogby5iUmVnZXg7XG4gICAgfTtcblxuICAgIF9mbkNvbHVtblR5cGVzKG9TZXR0aW5ncyk7XG5cbiAgICBpZiAoX2ZuRGF0YVNvdXJjZShvU2V0dGluZ3MpICE9ICdzc3AnKSB7XG4gICAgICBfZm5GaWx0ZXIob1NldHRpbmdzLCBvSW5wdXQuc1NlYXJjaCwgaUZvcmNlLCBmblJlZ2V4KG9JbnB1dCksIG9JbnB1dC5iU21hcnQsIG9JbnB1dC5iQ2FzZUluc2Vuc2l0aXZlKTtcblxuICAgICAgZm5TYXZlRmlsdGVyKG9JbnB1dCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW9QcmV2U2VhcmNoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIF9mbkZpbHRlckNvbHVtbihvU2V0dGluZ3MsIGFvUHJldlNlYXJjaFtpXS5zU2VhcmNoLCBpLCBmblJlZ2V4KGFvUHJldlNlYXJjaFtpXSksIGFvUHJldlNlYXJjaFtpXS5iU21hcnQsIGFvUHJldlNlYXJjaFtpXS5iQ2FzZUluc2Vuc2l0aXZlKTtcbiAgICAgIH1cblxuICAgICAgX2ZuRmlsdGVyQ3VzdG9tKG9TZXR0aW5ncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZuU2F2ZUZpbHRlcihvSW5wdXQpO1xuICAgIH1cblxuICAgIG9TZXR0aW5ncy5iRmlsdGVyZWQgPSB0cnVlO1xuXG4gICAgX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgbnVsbCwgJ3NlYXJjaCcsIFtvU2V0dGluZ3NdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZpbHRlckN1c3RvbShzZXR0aW5ncykge1xuICAgIHZhciBmaWx0ZXJzID0gRGF0YVRhYmxlLmV4dC5zZWFyY2g7XG4gICAgdmFyIGRpc3BsYXlSb3dzID0gc2V0dGluZ3MuYWlEaXNwbGF5O1xuICAgIHZhciByb3csIHJvd0lkeDtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICB2YXIgcm93cyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBqID0gMCwgamVuID0gZGlzcGxheVJvd3MubGVuZ3RoOyBqIDwgamVuOyBqKyspIHtcbiAgICAgICAgcm93SWR4ID0gZGlzcGxheVJvd3Nbal07XG4gICAgICAgIHJvdyA9IHNldHRpbmdzLmFvRGF0YVtyb3dJZHhdO1xuXG4gICAgICAgIGlmIChmaWx0ZXJzW2ldKHNldHRpbmdzLCByb3cuX2FGaWx0ZXJEYXRhLCByb3dJZHgsIHJvdy5fYURhdGEsIGopKSB7XG4gICAgICAgICAgcm93cy5wdXNoKHJvd0lkeCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZGlzcGxheVJvd3MubGVuZ3RoID0gMDtcbiAgICAgICQubWVyZ2UoZGlzcGxheVJvd3MsIHJvd3MpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZpbHRlckNvbHVtbihzZXR0aW5ncywgc2VhcmNoU3RyLCBjb2xJZHgsIHJlZ2V4LCBzbWFydCwgY2FzZUluc2Vuc2l0aXZlKSB7XG4gICAgaWYgKHNlYXJjaFN0ciA9PT0gJycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZGF0YTtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIGRpc3BsYXkgPSBzZXR0aW5ncy5haURpc3BsYXk7XG5cbiAgICB2YXIgcnBTZWFyY2ggPSBfZm5GaWx0ZXJDcmVhdGVTZWFyY2goc2VhcmNoU3RyLCByZWdleCwgc21hcnQsIGNhc2VJbnNlbnNpdGl2ZSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpc3BsYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGRhdGEgPSBzZXR0aW5ncy5hb0RhdGFbZGlzcGxheVtpXV0uX2FGaWx0ZXJEYXRhW2NvbElkeF07XG5cbiAgICAgIGlmIChycFNlYXJjaC50ZXN0KGRhdGEpKSB7XG4gICAgICAgIG91dC5wdXNoKGRpc3BsYXlbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldHRpbmdzLmFpRGlzcGxheSA9IG91dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZpbHRlcihzZXR0aW5ncywgaW5wdXQsIGZvcmNlLCByZWdleCwgc21hcnQsIGNhc2VJbnNlbnNpdGl2ZSkge1xuICAgIHZhciBycFNlYXJjaCA9IF9mbkZpbHRlckNyZWF0ZVNlYXJjaChpbnB1dCwgcmVnZXgsIHNtYXJ0LCBjYXNlSW5zZW5zaXRpdmUpO1xuXG4gICAgdmFyIHByZXZTZWFyY2ggPSBzZXR0aW5ncy5vUHJldmlvdXNTZWFyY2guc1NlYXJjaDtcbiAgICB2YXIgZGlzcGxheU1hc3RlciA9IHNldHRpbmdzLmFpRGlzcGxheU1hc3RlcjtcbiAgICB2YXIgZGlzcGxheSwgaW52YWxpZGF0ZWQsIGk7XG4gICAgdmFyIGZpbHRlcmVkID0gW107XG5cbiAgICBpZiAoRGF0YVRhYmxlLmV4dC5zZWFyY2gubGVuZ3RoICE9PSAwKSB7XG4gICAgICBmb3JjZSA9IHRydWU7XG4gICAgfVxuXG4gICAgaW52YWxpZGF0ZWQgPSBfZm5GaWx0ZXJEYXRhKHNldHRpbmdzKTtcblxuICAgIGlmIChpbnB1dC5sZW5ndGggPD0gMCkge1xuICAgICAgc2V0dGluZ3MuYWlEaXNwbGF5ID0gZGlzcGxheU1hc3Rlci5zbGljZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW52YWxpZGF0ZWQgfHwgZm9yY2UgfHwgcHJldlNlYXJjaC5sZW5ndGggPiBpbnB1dC5sZW5ndGggfHwgaW5wdXQuaW5kZXhPZihwcmV2U2VhcmNoKSAhPT0gMCB8fCBzZXR0aW5ncy5iU29ydGVkKSB7XG4gICAgICAgICAgc2V0dGluZ3MuYWlEaXNwbGF5ID0gZGlzcGxheU1hc3Rlci5zbGljZSgpO1xuICAgICAgICB9XG5cbiAgICAgIGRpc3BsYXkgPSBzZXR0aW5ncy5haURpc3BsYXk7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBkaXNwbGF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChycFNlYXJjaC50ZXN0KHNldHRpbmdzLmFvRGF0YVtkaXNwbGF5W2ldXS5fc0ZpbHRlclJvdykpIHtcbiAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGRpc3BsYXlbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNldHRpbmdzLmFpRGlzcGxheSA9IGZpbHRlcmVkO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZpbHRlckNyZWF0ZVNlYXJjaChzZWFyY2gsIHJlZ2V4LCBzbWFydCwgY2FzZUluc2Vuc2l0aXZlKSB7XG4gICAgc2VhcmNoID0gcmVnZXggPyBzZWFyY2ggOiBfZm5Fc2NhcGVSZWdleChzZWFyY2gpO1xuXG4gICAgaWYgKHNtYXJ0KSB7XG4gICAgICB2YXIgYSA9ICQubWFwKHNlYXJjaC5tYXRjaCgvXCJbXlwiXStcInxbXiBdKy9nKSB8fCBbJyddLCBmdW5jdGlvbiAod29yZCkge1xuICAgICAgICBpZiAod29yZC5jaGFyQXQoMCkgPT09ICdcIicpIHtcbiAgICAgICAgICB2YXIgbSA9IHdvcmQubWF0Y2goL15cIiguKilcIiQvKTtcbiAgICAgICAgICB3b3JkID0gbSA/IG1bMV0gOiB3b3JkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdvcmQucmVwbGFjZSgnXCInLCAnJyk7XG4gICAgICB9KTtcbiAgICAgIHNlYXJjaCA9ICdeKD89Lio/JyArIGEuam9pbignKSg/PS4qPycpICsgJykuKiQnO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVnRXhwKHNlYXJjaCwgY2FzZUluc2Vuc2l0aXZlID8gJ2knIDogJycpO1xuICB9XG5cbiAgdmFyIF9mbkVzY2FwZVJlZ2V4ID0gRGF0YVRhYmxlLnV0aWwuZXNjYXBlUmVnZXg7XG4gIHZhciBfX2ZpbHRlcl9kaXYgPSAkKCc8ZGl2PicpWzBdO1xuXG4gIHZhciBfX2ZpbHRlcl9kaXZfdGV4dENvbnRlbnQgPSBfX2ZpbHRlcl9kaXYudGV4dENvbnRlbnQgIT09IHVuZGVmaW5lZDtcblxuICBmdW5jdGlvbiBfZm5GaWx0ZXJEYXRhKHNldHRpbmdzKSB7XG4gICAgdmFyIGNvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnM7XG4gICAgdmFyIGNvbHVtbjtcbiAgICB2YXIgaSwgaiwgaWVuLCBqZW4sIGZpbHRlckRhdGEsIGNlbGxEYXRhLCByb3c7XG4gICAgdmFyIGZvbWF0dGVycyA9IERhdGFUYWJsZS5leHQudHlwZS5zZWFyY2g7XG4gICAgdmFyIHdhc0ludmFsaWRhdGVkID0gZmFsc2U7XG5cbiAgICBmb3IgKGkgPSAwLCBpZW4gPSBzZXR0aW5ncy5hb0RhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIHJvdyA9IHNldHRpbmdzLmFvRGF0YVtpXTtcblxuICAgICAgaWYgKCFyb3cuX2FGaWx0ZXJEYXRhKSB7XG4gICAgICAgIGZpbHRlckRhdGEgPSBbXTtcblxuICAgICAgICBmb3IgKGogPSAwLCBqZW4gPSBjb2x1bW5zLmxlbmd0aDsgaiA8IGplbjsgaisrKSB7XG4gICAgICAgICAgY29sdW1uID0gY29sdW1uc1tqXTtcblxuICAgICAgICAgIGlmIChjb2x1bW4uYlNlYXJjaGFibGUpIHtcbiAgICAgICAgICAgIGNlbGxEYXRhID0gX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIGksIGosICdmaWx0ZXInKTtcblxuICAgICAgICAgICAgaWYgKGZvbWF0dGVyc1tjb2x1bW4uc1R5cGVdKSB7XG4gICAgICAgICAgICAgIGNlbGxEYXRhID0gZm9tYXR0ZXJzW2NvbHVtbi5zVHlwZV0oY2VsbERhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2VsbERhdGEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgY2VsbERhdGEgPSAnJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjZWxsRGF0YSAhPT0gJ3N0cmluZycgJiYgY2VsbERhdGEudG9TdHJpbmcpIHtcbiAgICAgICAgICAgICAgY2VsbERhdGEgPSBjZWxsRGF0YS50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjZWxsRGF0YSA9ICcnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjZWxsRGF0YS5pbmRleE9mICYmIGNlbGxEYXRhLmluZGV4T2YoJyYnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIF9fZmlsdGVyX2Rpdi5pbm5lckhUTUwgPSBjZWxsRGF0YTtcbiAgICAgICAgICAgIGNlbGxEYXRhID0gX19maWx0ZXJfZGl2X3RleHRDb250ZW50ID8gX19maWx0ZXJfZGl2LnRleHRDb250ZW50IDogX19maWx0ZXJfZGl2LmlubmVyVGV4dDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY2VsbERhdGEucmVwbGFjZSkge1xuICAgICAgICAgICAgY2VsbERhdGEgPSBjZWxsRGF0YS5yZXBsYWNlKC9bXFxyXFxuXS9nLCAnJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZmlsdGVyRGF0YS5wdXNoKGNlbGxEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdy5fYUZpbHRlckRhdGEgPSBmaWx0ZXJEYXRhO1xuICAgICAgICByb3cuX3NGaWx0ZXJSb3cgPSBmaWx0ZXJEYXRhLmpvaW4oJyAgJyk7XG4gICAgICAgIHdhc0ludmFsaWRhdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gd2FzSW52YWxpZGF0ZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5TZWFyY2hUb0NhbWVsKG9iaikge1xuICAgIHJldHVybiB7XG4gICAgICBzZWFyY2g6IG9iai5zU2VhcmNoLFxuICAgICAgc21hcnQ6IG9iai5iU21hcnQsXG4gICAgICByZWdleDogb2JqLmJSZWdleCxcbiAgICAgIGNhc2VJbnNlbnNpdGl2ZTogb2JqLmJDYXNlSW5zZW5zaXRpdmVcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU2VhcmNoVG9IdW5nKG9iaikge1xuICAgIHJldHVybiB7XG4gICAgICBzU2VhcmNoOiBvYmouc2VhcmNoLFxuICAgICAgYlNtYXJ0OiBvYmouc21hcnQsXG4gICAgICBiUmVnZXg6IG9iai5yZWdleCxcbiAgICAgIGJDYXNlSW5zZW5zaXRpdmU6IG9iai5jYXNlSW5zZW5zaXRpdmVcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmVhdHVyZUh0bWxJbmZvKHNldHRpbmdzKSB7XG4gICAgdmFyIHRpZCA9IHNldHRpbmdzLnNUYWJsZUlkLFxuICAgICAgICBub2RlcyA9IHNldHRpbmdzLmFhbkZlYXR1cmVzLmksXG4gICAgICAgIG4gPSAkKCc8ZGl2Lz4nLCB7XG4gICAgICAnY2xhc3MnOiBzZXR0aW5ncy5vQ2xhc3Nlcy5zSW5mbyxcbiAgICAgICdpZCc6ICFub2RlcyA/IHRpZCArICdfaW5mbycgOiBudWxsXG4gICAgfSk7XG5cbiAgICBpZiAoIW5vZGVzKSB7XG4gICAgICBzZXR0aW5ncy5hb0RyYXdDYWxsYmFjay5wdXNoKHtcbiAgICAgICAgXCJmblwiOiBfZm5VcGRhdGVJbmZvLFxuICAgICAgICBcInNOYW1lXCI6IFwiaW5mb3JtYXRpb25cIlxuICAgICAgfSk7XG4gICAgICBuLmF0dHIoJ3JvbGUnLCAnc3RhdHVzJykuYXR0cignYXJpYS1saXZlJywgJ3BvbGl0ZScpO1xuICAgICAgJChzZXR0aW5ncy5uVGFibGUpLmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCB0aWQgKyAnX2luZm8nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gblswXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblVwZGF0ZUluZm8oc2V0dGluZ3MpIHtcbiAgICB2YXIgbm9kZXMgPSBzZXR0aW5ncy5hYW5GZWF0dXJlcy5pO1xuXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBsYW5nID0gc2V0dGluZ3Mub0xhbmd1YWdlLFxuICAgICAgICBzdGFydCA9IHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0ICsgMSxcbiAgICAgICAgZW5kID0gc2V0dGluZ3MuZm5EaXNwbGF5RW5kKCksXG4gICAgICAgIG1heCA9IHNldHRpbmdzLmZuUmVjb3Jkc1RvdGFsKCksXG4gICAgICAgIHRvdGFsID0gc2V0dGluZ3MuZm5SZWNvcmRzRGlzcGxheSgpLFxuICAgICAgICBvdXQgPSB0b3RhbCA/IGxhbmcuc0luZm8gOiBsYW5nLnNJbmZvRW1wdHk7XG5cbiAgICBpZiAodG90YWwgIT09IG1heCkge1xuICAgICAgb3V0ICs9ICcgJyArIGxhbmcuc0luZm9GaWx0ZXJlZDtcbiAgICB9XG5cbiAgICBvdXQgKz0gbGFuZy5zSW5mb1Bvc3RGaXg7XG4gICAgb3V0ID0gX2ZuSW5mb01hY3JvcyhzZXR0aW5ncywgb3V0KTtcbiAgICB2YXIgY2FsbGJhY2sgPSBsYW5nLmZuSW5mb0NhbGxiYWNrO1xuXG4gICAgaWYgKGNhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICBvdXQgPSBjYWxsYmFjay5jYWxsKHNldHRpbmdzLm9JbnN0YW5jZSwgc2V0dGluZ3MsIHN0YXJ0LCBlbmQsIG1heCwgdG90YWwsIG91dCk7XG4gICAgfVxuXG4gICAgJChub2RlcykuaHRtbChvdXQpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuSW5mb01hY3JvcyhzZXR0aW5ncywgc3RyKSB7XG4gICAgdmFyIGZvcm1hdHRlciA9IHNldHRpbmdzLmZuRm9ybWF0TnVtYmVyLFxuICAgICAgICBzdGFydCA9IHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0ICsgMSxcbiAgICAgICAgbGVuID0gc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoLFxuICAgICAgICB2aXMgPSBzZXR0aW5ncy5mblJlY29yZHNEaXNwbGF5KCksXG4gICAgICAgIGFsbCA9IGxlbiA9PT0gLTE7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9fU1RBUlRfL2csIGZvcm1hdHRlci5jYWxsKHNldHRpbmdzLCBzdGFydCkpLnJlcGxhY2UoL19FTkRfL2csIGZvcm1hdHRlci5jYWxsKHNldHRpbmdzLCBzZXR0aW5ncy5mbkRpc3BsYXlFbmQoKSkpLnJlcGxhY2UoL19NQVhfL2csIGZvcm1hdHRlci5jYWxsKHNldHRpbmdzLCBzZXR0aW5ncy5mblJlY29yZHNUb3RhbCgpKSkucmVwbGFjZSgvX1RPVEFMXy9nLCBmb3JtYXR0ZXIuY2FsbChzZXR0aW5ncywgdmlzKSkucmVwbGFjZSgvX1BBR0VfL2csIGZvcm1hdHRlci5jYWxsKHNldHRpbmdzLCBhbGwgPyAxIDogTWF0aC5jZWlsKHN0YXJ0IC8gbGVuKSkpLnJlcGxhY2UoL19QQUdFU18vZywgZm9ybWF0dGVyLmNhbGwoc2V0dGluZ3MsIGFsbCA/IDEgOiBNYXRoLmNlaWwodmlzIC8gbGVuKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuSW5pdGlhbGlzZShzZXR0aW5ncykge1xuICAgIHZhciBpLFxuICAgICAgICBpTGVuLFxuICAgICAgICBpQWpheFN0YXJ0ID0gc2V0dGluZ3MuaUluaXREaXNwbGF5U3RhcnQ7XG4gICAgdmFyIGNvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnMsXG4gICAgICAgIGNvbHVtbjtcbiAgICB2YXIgZmVhdHVyZXMgPSBzZXR0aW5ncy5vRmVhdHVyZXM7XG4gICAgdmFyIGRlZmVyTG9hZGluZyA9IHNldHRpbmdzLmJEZWZlckxvYWRpbmc7XG5cbiAgICBpZiAoIXNldHRpbmdzLmJJbml0aWFsaXNlZCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIF9mbkluaXRpYWxpc2Uoc2V0dGluZ3MpO1xuICAgICAgfSwgMjAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBfZm5BZGRPcHRpb25zSHRtbChzZXR0aW5ncyk7XG5cbiAgICBfZm5CdWlsZEhlYWQoc2V0dGluZ3MpO1xuXG4gICAgX2ZuRHJhd0hlYWQoc2V0dGluZ3MsIHNldHRpbmdzLmFvSGVhZGVyKTtcblxuICAgIF9mbkRyYXdIZWFkKHNldHRpbmdzLCBzZXR0aW5ncy5hb0Zvb3Rlcik7XG5cbiAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShzZXR0aW5ncywgdHJ1ZSk7XG5cbiAgICBpZiAoZmVhdHVyZXMuYkF1dG9XaWR0aCkge1xuICAgICAgX2ZuQ2FsY3VsYXRlQ29sdW1uV2lkdGhzKHNldHRpbmdzKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBpTGVuID0gY29sdW1ucy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIGNvbHVtbiA9IGNvbHVtbnNbaV07XG5cbiAgICAgIGlmIChjb2x1bW4uc1dpZHRoKSB7XG4gICAgICAgIGNvbHVtbi5uVGguc3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0Nzcyhjb2x1bW4uc1dpZHRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIG51bGwsICdwcmVJbml0JywgW3NldHRpbmdzXSk7XG5cbiAgICBfZm5SZURyYXcoc2V0dGluZ3MpO1xuXG4gICAgdmFyIGRhdGFTcmMgPSBfZm5EYXRhU291cmNlKHNldHRpbmdzKTtcblxuICAgIGlmIChkYXRhU3JjICE9ICdzc3AnIHx8IGRlZmVyTG9hZGluZykge1xuICAgICAgaWYgKGRhdGFTcmMgPT0gJ2FqYXgnKSB7XG4gICAgICAgIF9mbkJ1aWxkQWpheChzZXR0aW5ncywgW10sIGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgdmFyIGFEYXRhID0gX2ZuQWpheERhdGFTcmMoc2V0dGluZ3MsIGpzb24pO1xuXG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGFEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBfZm5BZGREYXRhKHNldHRpbmdzLCBhRGF0YVtpXSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2V0dGluZ3MuaUluaXREaXNwbGF5U3RhcnQgPSBpQWpheFN0YXJ0O1xuXG4gICAgICAgICAgX2ZuUmVEcmF3KHNldHRpbmdzKTtcblxuICAgICAgICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KHNldHRpbmdzLCBmYWxzZSk7XG5cbiAgICAgICAgICBfZm5Jbml0Q29tcGxldGUoc2V0dGluZ3MsIGpzb24pO1xuICAgICAgICB9LCBzZXR0aW5ncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShzZXR0aW5ncywgZmFsc2UpO1xuXG4gICAgICAgIF9mbkluaXRDb21wbGV0ZShzZXR0aW5ncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuSW5pdENvbXBsZXRlKHNldHRpbmdzLCBqc29uKSB7XG4gICAgc2V0dGluZ3MuX2JJbml0Q29tcGxldGUgPSB0cnVlO1xuXG4gICAgaWYgKGpzb24gfHwgc2V0dGluZ3Mub0luaXQuYWFEYXRhKSB7XG4gICAgICBfZm5BZGp1c3RDb2x1bW5TaXppbmcoc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgbnVsbCwgJ3BsdWdpbi1pbml0JywgW3NldHRpbmdzLCBqc29uXSk7XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsICdhb0luaXRDb21wbGV0ZScsICdpbml0JywgW3NldHRpbmdzLCBqc29uXSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5MZW5ndGhDaGFuZ2Uoc2V0dGluZ3MsIHZhbCkge1xuICAgIHZhciBsZW4gPSBwYXJzZUludCh2YWwsIDEwKTtcbiAgICBzZXR0aW5ncy5faURpc3BsYXlMZW5ndGggPSBsZW47XG5cbiAgICBfZm5MZW5ndGhPdmVyZmxvdyhzZXR0aW5ncyk7XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIG51bGwsICdsZW5ndGgnLCBbc2V0dGluZ3MsIGxlbl0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmVhdHVyZUh0bWxMZW5ndGgoc2V0dGluZ3MpIHtcbiAgICB2YXIgY2xhc3NlcyA9IHNldHRpbmdzLm9DbGFzc2VzLFxuICAgICAgICB0YWJsZUlkID0gc2V0dGluZ3Muc1RhYmxlSWQsXG4gICAgICAgIG1lbnUgPSBzZXR0aW5ncy5hTGVuZ3RoTWVudSxcbiAgICAgICAgZDIgPSAkLmlzQXJyYXkobWVudVswXSksXG4gICAgICAgIGxlbmd0aHMgPSBkMiA/IG1lbnVbMF0gOiBtZW51LFxuICAgICAgICBsYW5ndWFnZSA9IGQyID8gbWVudVsxXSA6IG1lbnU7XG4gICAgdmFyIHNlbGVjdCA9ICQoJzxzZWxlY3QvPicsIHtcbiAgICAgICduYW1lJzogdGFibGVJZCArICdfbGVuZ3RoJyxcbiAgICAgICdhcmlhLWNvbnRyb2xzJzogdGFibGVJZCxcbiAgICAgICdjbGFzcyc6IGNsYXNzZXMuc0xlbmd0aFNlbGVjdFxuICAgIH0pO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGxlbmd0aHMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIHNlbGVjdFswXVtpXSA9IG5ldyBPcHRpb24odHlwZW9mIGxhbmd1YWdlW2ldID09PSAnbnVtYmVyJyA/IHNldHRpbmdzLmZuRm9ybWF0TnVtYmVyKGxhbmd1YWdlW2ldKSA6IGxhbmd1YWdlW2ldLCBsZW5ndGhzW2ldKTtcbiAgICB9XG5cbiAgICB2YXIgZGl2ID0gJCgnPGRpdj48bGFiZWwvPjwvZGl2PicpLmFkZENsYXNzKGNsYXNzZXMuc0xlbmd0aCk7XG5cbiAgICBpZiAoIXNldHRpbmdzLmFhbkZlYXR1cmVzLmwpIHtcbiAgICAgIGRpdlswXS5pZCA9IHRhYmxlSWQgKyAnX2xlbmd0aCc7XG4gICAgfVxuXG4gICAgZGl2LmNoaWxkcmVuKCkuYXBwZW5kKHNldHRpbmdzLm9MYW5ndWFnZS5zTGVuZ3RoTWVudS5yZXBsYWNlKCdfTUVOVV8nLCBzZWxlY3RbMF0ub3V0ZXJIVE1MKSk7XG4gICAgJCgnc2VsZWN0JywgZGl2KS52YWwoc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoKS5vbignY2hhbmdlLkRUJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIF9mbkxlbmd0aENoYW5nZShzZXR0aW5ncywgJCh0aGlzKS52YWwoKSk7XG5cbiAgICAgIF9mbkRyYXcoc2V0dGluZ3MpO1xuICAgIH0pO1xuICAgICQoc2V0dGluZ3MublRhYmxlKS5vbignbGVuZ3RoLmR0LkRUJywgZnVuY3Rpb24gKGUsIHMsIGxlbikge1xuICAgICAgaWYgKHNldHRpbmdzID09PSBzKSB7XG4gICAgICAgICQoJ3NlbGVjdCcsIGRpdikudmFsKGxlbik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRpdlswXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZlYXR1cmVIdG1sUGFnaW5hdGUoc2V0dGluZ3MpIHtcbiAgICB2YXIgdHlwZSA9IHNldHRpbmdzLnNQYWdpbmF0aW9uVHlwZSxcbiAgICAgICAgcGx1Z2luID0gRGF0YVRhYmxlLmV4dC5wYWdlclt0eXBlXSxcbiAgICAgICAgbW9kZXJuID0gdHlwZW9mIHBsdWdpbiA9PT0gJ2Z1bmN0aW9uJyxcbiAgICAgICAgcmVkcmF3ID0gZnVuY3Rpb24gcmVkcmF3KHNldHRpbmdzKSB7XG4gICAgICBfZm5EcmF3KHNldHRpbmdzKTtcbiAgICB9LFxuICAgICAgICBub2RlID0gJCgnPGRpdi8+JykuYWRkQ2xhc3Moc2V0dGluZ3Mub0NsYXNzZXMuc1BhZ2luZyArIHR5cGUpWzBdLFxuICAgICAgICBmZWF0dXJlcyA9IHNldHRpbmdzLmFhbkZlYXR1cmVzO1xuXG4gICAgaWYgKCFtb2Rlcm4pIHtcbiAgICAgIHBsdWdpbi5mbkluaXQoc2V0dGluZ3MsIG5vZGUsIHJlZHJhdyk7XG4gICAgfVxuXG4gICAgaWYgKCFmZWF0dXJlcy5wKSB7XG4gICAgICBub2RlLmlkID0gc2V0dGluZ3Muc1RhYmxlSWQgKyAnX3BhZ2luYXRlJztcbiAgICAgIHNldHRpbmdzLmFvRHJhd0NhbGxiYWNrLnB1c2goe1xuICAgICAgICBcImZuXCI6IGZ1bmN0aW9uIGZuKHNldHRpbmdzKSB7XG4gICAgICAgICAgaWYgKG1vZGVybikge1xuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQsXG4gICAgICAgICAgICAgICAgbGVuID0gc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoLFxuICAgICAgICAgICAgICAgIHZpc1JlY29yZHMgPSBzZXR0aW5ncy5mblJlY29yZHNEaXNwbGF5KCksXG4gICAgICAgICAgICAgICAgYWxsID0gbGVuID09PSAtMSxcbiAgICAgICAgICAgICAgICBwYWdlID0gYWxsID8gMCA6IE1hdGguY2VpbChzdGFydCAvIGxlbiksXG4gICAgICAgICAgICAgICAgcGFnZXMgPSBhbGwgPyAxIDogTWF0aC5jZWlsKHZpc1JlY29yZHMgLyBsZW4pLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnMgPSBwbHVnaW4ocGFnZSwgcGFnZXMpLFxuICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgaWVuO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBpZW4gPSBmZWF0dXJlcy5wLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgICAgIF9mblJlbmRlcmVyKHNldHRpbmdzLCAncGFnZUJ1dHRvbicpKHNldHRpbmdzLCBmZWF0dXJlcy5wW2ldLCBpLCBidXR0b25zLCBwYWdlLCBwYWdlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsdWdpbi5mblVwZGF0ZShzZXR0aW5ncywgcmVkcmF3KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic05hbWVcIjogXCJwYWdpbmF0aW9uXCJcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuUGFnZUNoYW5nZShzZXR0aW5ncywgYWN0aW9uLCByZWRyYXcpIHtcbiAgICB2YXIgc3RhcnQgPSBzZXR0aW5ncy5faURpc3BsYXlTdGFydCxcbiAgICAgICAgbGVuID0gc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoLFxuICAgICAgICByZWNvcmRzID0gc2V0dGluZ3MuZm5SZWNvcmRzRGlzcGxheSgpO1xuXG4gICAgaWYgKHJlY29yZHMgPT09IDAgfHwgbGVuID09PSAtMSkge1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbiA9PT0gXCJudW1iZXJcIikge1xuICAgICAgc3RhcnQgPSBhY3Rpb24gKiBsZW47XG5cbiAgICAgIGlmIChzdGFydCA+IHJlY29yZHMpIHtcbiAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYWN0aW9uID09IFwiZmlyc3RcIikge1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH0gZWxzZSBpZiAoYWN0aW9uID09IFwicHJldmlvdXNcIikge1xuICAgICAgc3RhcnQgPSBsZW4gPj0gMCA/IHN0YXJ0IC0gbGVuIDogMDtcblxuICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICBzdGFydCA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhY3Rpb24gPT0gXCJuZXh0XCIpIHtcbiAgICAgIGlmIChzdGFydCArIGxlbiA8IHJlY29yZHMpIHtcbiAgICAgICAgc3RhcnQgKz0gbGVuO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYWN0aW9uID09IFwibGFzdFwiKSB7XG4gICAgICBzdGFydCA9IE1hdGguZmxvb3IoKHJlY29yZHMgLSAxKSAvIGxlbikgKiBsZW47XG4gICAgfSBlbHNlIHtcbiAgICAgIF9mbkxvZyhzZXR0aW5ncywgMCwgXCJVbmtub3duIHBhZ2luZyBhY3Rpb246IFwiICsgYWN0aW9uLCA1KTtcbiAgICB9XG5cbiAgICB2YXIgY2hhbmdlZCA9IHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0ICE9PSBzdGFydDtcbiAgICBzZXR0aW5ncy5faURpc3BsYXlTdGFydCA9IHN0YXJ0O1xuXG4gICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgbnVsbCwgJ3BhZ2UnLCBbc2V0dGluZ3NdKTtcblxuICAgICAgaWYgKHJlZHJhdykge1xuICAgICAgICBfZm5EcmF3KHNldHRpbmdzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hhbmdlZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZlYXR1cmVIdG1sUHJvY2Vzc2luZyhzZXR0aW5ncykge1xuICAgIHJldHVybiAkKCc8ZGl2Lz4nLCB7XG4gICAgICAnaWQnOiAhc2V0dGluZ3MuYWFuRmVhdHVyZXMuciA/IHNldHRpbmdzLnNUYWJsZUlkICsgJ19wcm9jZXNzaW5nJyA6IG51bGwsXG4gICAgICAnY2xhc3MnOiBzZXR0aW5ncy5vQ2xhc3Nlcy5zUHJvY2Vzc2luZ1xuICAgIH0pLmh0bWwoc2V0dGluZ3Mub0xhbmd1YWdlLnNQcm9jZXNzaW5nKS5pbnNlcnRCZWZvcmUoc2V0dGluZ3MublRhYmxlKVswXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblByb2Nlc3NpbmdEaXNwbGF5KHNldHRpbmdzLCBzaG93KSB7XG4gICAgaWYgKHNldHRpbmdzLm9GZWF0dXJlcy5iUHJvY2Vzc2luZykge1xuICAgICAgJChzZXR0aW5ncy5hYW5GZWF0dXJlcy5yKS5jc3MoJ2Rpc3BsYXknLCBzaG93ID8gJ2Jsb2NrJyA6ICdub25lJyk7XG4gICAgfVxuXG4gICAgX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCBudWxsLCAncHJvY2Vzc2luZycsIFtzZXR0aW5ncywgc2hvd10pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmVhdHVyZUh0bWxUYWJsZShzZXR0aW5ncykge1xuICAgIHZhciB0YWJsZSA9ICQoc2V0dGluZ3MublRhYmxlKTtcbiAgICB0YWJsZS5hdHRyKCdyb2xlJywgJ2dyaWQnKTtcbiAgICB2YXIgc2Nyb2xsID0gc2V0dGluZ3Mub1Njcm9sbDtcblxuICAgIGlmIChzY3JvbGwuc1ggPT09ICcnICYmIHNjcm9sbC5zWSA9PT0gJycpIHtcbiAgICAgIHJldHVybiBzZXR0aW5ncy5uVGFibGU7XG4gICAgfVxuXG4gICAgdmFyIHNjcm9sbFggPSBzY3JvbGwuc1g7XG4gICAgdmFyIHNjcm9sbFkgPSBzY3JvbGwuc1k7XG4gICAgdmFyIGNsYXNzZXMgPSBzZXR0aW5ncy5vQ2xhc3NlcztcbiAgICB2YXIgY2FwdGlvbiA9IHRhYmxlLmNoaWxkcmVuKCdjYXB0aW9uJyk7XG4gICAgdmFyIGNhcHRpb25TaWRlID0gY2FwdGlvbi5sZW5ndGggPyBjYXB0aW9uWzBdLl9jYXB0aW9uU2lkZSA6IG51bGw7XG4gICAgdmFyIGhlYWRlckNsb25lID0gJCh0YWJsZVswXS5jbG9uZU5vZGUoZmFsc2UpKTtcbiAgICB2YXIgZm9vdGVyQ2xvbmUgPSAkKHRhYmxlWzBdLmNsb25lTm9kZShmYWxzZSkpO1xuICAgIHZhciBmb290ZXIgPSB0YWJsZS5jaGlsZHJlbigndGZvb3QnKTtcbiAgICB2YXIgX2RpdiA9ICc8ZGl2Lz4nO1xuXG4gICAgdmFyIHNpemUgPSBmdW5jdGlvbiBzaXplKHMpIHtcbiAgICAgIHJldHVybiAhcyA/IG51bGwgOiBfZm5TdHJpbmdUb0NzcyhzKTtcbiAgICB9O1xuXG4gICAgaWYgKCFmb290ZXIubGVuZ3RoKSB7XG4gICAgICBmb290ZXIgPSBudWxsO1xuICAgIH1cblxuICAgIHZhciBzY3JvbGxlciA9ICQoX2Rpdiwge1xuICAgICAgJ2NsYXNzJzogY2xhc3Nlcy5zU2Nyb2xsV3JhcHBlclxuICAgIH0pLmFwcGVuZCgkKF9kaXYsIHtcbiAgICAgICdjbGFzcyc6IGNsYXNzZXMuc1Njcm9sbEhlYWRcbiAgICB9KS5jc3Moe1xuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICBib3JkZXI6IDAsXG4gICAgICB3aWR0aDogc2Nyb2xsWCA/IHNpemUoc2Nyb2xsWCkgOiAnMTAwJSdcbiAgICB9KS5hcHBlbmQoJChfZGl2LCB7XG4gICAgICAnY2xhc3MnOiBjbGFzc2VzLnNTY3JvbGxIZWFkSW5uZXJcbiAgICB9KS5jc3Moe1xuICAgICAgJ2JveC1zaXppbmcnOiAnY29udGVudC1ib3gnLFxuICAgICAgd2lkdGg6IHNjcm9sbC5zWElubmVyIHx8ICcxMDAlJ1xuICAgIH0pLmFwcGVuZChoZWFkZXJDbG9uZS5yZW1vdmVBdHRyKCdpZCcpLmNzcygnbWFyZ2luLWxlZnQnLCAwKS5hcHBlbmQoY2FwdGlvblNpZGUgPT09ICd0b3AnID8gY2FwdGlvbiA6IG51bGwpLmFwcGVuZCh0YWJsZS5jaGlsZHJlbigndGhlYWQnKSkpKSkuYXBwZW5kKCQoX2Rpdiwge1xuICAgICAgJ2NsYXNzJzogY2xhc3Nlcy5zU2Nyb2xsQm9keVxuICAgIH0pLmNzcyh7XG4gICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgIG92ZXJmbG93OiAnYXV0bycsXG4gICAgICB3aWR0aDogc2l6ZShzY3JvbGxYKVxuICAgIH0pLmFwcGVuZCh0YWJsZSkpO1xuXG4gICAgaWYgKGZvb3Rlcikge1xuICAgICAgc2Nyb2xsZXIuYXBwZW5kKCQoX2Rpdiwge1xuICAgICAgICAnY2xhc3MnOiBjbGFzc2VzLnNTY3JvbGxGb290XG4gICAgICB9KS5jc3Moe1xuICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgd2lkdGg6IHNjcm9sbFggPyBzaXplKHNjcm9sbFgpIDogJzEwMCUnXG4gICAgICB9KS5hcHBlbmQoJChfZGl2LCB7XG4gICAgICAgICdjbGFzcyc6IGNsYXNzZXMuc1Njcm9sbEZvb3RJbm5lclxuICAgICAgfSkuYXBwZW5kKGZvb3RlckNsb25lLnJlbW92ZUF0dHIoJ2lkJykuY3NzKCdtYXJnaW4tbGVmdCcsIDApLmFwcGVuZChjYXB0aW9uU2lkZSA9PT0gJ2JvdHRvbScgPyBjYXB0aW9uIDogbnVsbCkuYXBwZW5kKHRhYmxlLmNoaWxkcmVuKCd0Zm9vdCcpKSkpKTtcbiAgICB9XG5cbiAgICB2YXIgY2hpbGRyZW4gPSBzY3JvbGxlci5jaGlsZHJlbigpO1xuICAgIHZhciBzY3JvbGxIZWFkID0gY2hpbGRyZW5bMF07XG4gICAgdmFyIHNjcm9sbEJvZHkgPSBjaGlsZHJlblsxXTtcbiAgICB2YXIgc2Nyb2xsRm9vdCA9IGZvb3RlciA/IGNoaWxkcmVuWzJdIDogbnVsbDtcblxuICAgIGlmIChzY3JvbGxYKSB7XG4gICAgICAkKHNjcm9sbEJvZHkpLm9uKCdzY3JvbGwuRFQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgc2Nyb2xsTGVmdCA9IHRoaXMuc2Nyb2xsTGVmdDtcbiAgICAgICAgc2Nyb2xsSGVhZC5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcblxuICAgICAgICBpZiAoZm9vdGVyKSB7XG4gICAgICAgICAgc2Nyb2xsRm9vdC5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgJChzY3JvbGxCb2R5KS5jc3Moc2Nyb2xsWSAmJiBzY3JvbGwuYkNvbGxhcHNlID8gJ21heC1oZWlnaHQnIDogJ2hlaWdodCcsIHNjcm9sbFkpO1xuICAgIHNldHRpbmdzLm5TY3JvbGxIZWFkID0gc2Nyb2xsSGVhZDtcbiAgICBzZXR0aW5ncy5uU2Nyb2xsQm9keSA9IHNjcm9sbEJvZHk7XG4gICAgc2V0dGluZ3MublNjcm9sbEZvb3QgPSBzY3JvbGxGb290O1xuICAgIHNldHRpbmdzLmFvRHJhd0NhbGxiYWNrLnB1c2goe1xuICAgICAgXCJmblwiOiBfZm5TY3JvbGxEcmF3LFxuICAgICAgXCJzTmFtZVwiOiBcInNjcm9sbGluZ1wiXG4gICAgfSk7XG4gICAgcmV0dXJuIHNjcm9sbGVyWzBdO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU2Nyb2xsRHJhdyhzZXR0aW5ncykge1xuICAgIHZhciBzY3JvbGwgPSBzZXR0aW5ncy5vU2Nyb2xsLFxuICAgICAgICBzY3JvbGxYID0gc2Nyb2xsLnNYLFxuICAgICAgICBzY3JvbGxYSW5uZXIgPSBzY3JvbGwuc1hJbm5lcixcbiAgICAgICAgc2Nyb2xsWSA9IHNjcm9sbC5zWSxcbiAgICAgICAgYmFyV2lkdGggPSBzY3JvbGwuaUJhcldpZHRoLFxuICAgICAgICBkaXZIZWFkZXIgPSAkKHNldHRpbmdzLm5TY3JvbGxIZWFkKSxcbiAgICAgICAgZGl2SGVhZGVyU3R5bGUgPSBkaXZIZWFkZXJbMF0uc3R5bGUsXG4gICAgICAgIGRpdkhlYWRlcklubmVyID0gZGl2SGVhZGVyLmNoaWxkcmVuKCdkaXYnKSxcbiAgICAgICAgZGl2SGVhZGVySW5uZXJTdHlsZSA9IGRpdkhlYWRlcklubmVyWzBdLnN0eWxlLFxuICAgICAgICBkaXZIZWFkZXJUYWJsZSA9IGRpdkhlYWRlcklubmVyLmNoaWxkcmVuKCd0YWJsZScpLFxuICAgICAgICBkaXZCb2R5RWwgPSBzZXR0aW5ncy5uU2Nyb2xsQm9keSxcbiAgICAgICAgZGl2Qm9keSA9ICQoZGl2Qm9keUVsKSxcbiAgICAgICAgZGl2Qm9keVN0eWxlID0gZGl2Qm9keUVsLnN0eWxlLFxuICAgICAgICBkaXZGb290ZXIgPSAkKHNldHRpbmdzLm5TY3JvbGxGb290KSxcbiAgICAgICAgZGl2Rm9vdGVySW5uZXIgPSBkaXZGb290ZXIuY2hpbGRyZW4oJ2RpdicpLFxuICAgICAgICBkaXZGb290ZXJUYWJsZSA9IGRpdkZvb3RlcklubmVyLmNoaWxkcmVuKCd0YWJsZScpLFxuICAgICAgICBoZWFkZXIgPSAkKHNldHRpbmdzLm5USGVhZCksXG4gICAgICAgIHRhYmxlID0gJChzZXR0aW5ncy5uVGFibGUpLFxuICAgICAgICB0YWJsZUVsID0gdGFibGVbMF0sXG4gICAgICAgIHRhYmxlU3R5bGUgPSB0YWJsZUVsLnN0eWxlLFxuICAgICAgICBmb290ZXIgPSBzZXR0aW5ncy5uVEZvb3QgPyAkKHNldHRpbmdzLm5URm9vdCkgOiBudWxsLFxuICAgICAgICBicm93c2VyID0gc2V0dGluZ3Mub0Jyb3dzZXIsXG4gICAgICAgIGllNjcgPSBicm93c2VyLmJTY3JvbGxPdmVyc2l6ZSxcbiAgICAgICAgZHRIZWFkZXJDZWxscyA9IF9wbHVjayhzZXR0aW5ncy5hb0NvbHVtbnMsICduVGgnKSxcbiAgICAgICAgaGVhZGVyVHJnRWxzLFxuICAgICAgICBmb290ZXJUcmdFbHMsXG4gICAgICAgIGhlYWRlclNyY0VscyxcbiAgICAgICAgZm9vdGVyU3JjRWxzLFxuICAgICAgICBoZWFkZXJDb3B5LFxuICAgICAgICBmb290ZXJDb3B5LFxuICAgICAgICBoZWFkZXJXaWR0aHMgPSBbXSxcbiAgICAgICAgZm9vdGVyV2lkdGhzID0gW10sXG4gICAgICAgIGhlYWRlckNvbnRlbnQgPSBbXSxcbiAgICAgICAgZm9vdGVyQ29udGVudCA9IFtdLFxuICAgICAgICBpZHgsXG4gICAgICAgIGNvcnJlY3Rpb24sXG4gICAgICAgIHNhbml0eVdpZHRoLFxuICAgICAgICB6ZXJvT3V0ID0gZnVuY3Rpb24gemVyb091dChuU2l6ZXIpIHtcbiAgICAgIHZhciBzdHlsZSA9IG5TaXplci5zdHlsZTtcbiAgICAgIHN0eWxlLnBhZGRpbmdUb3AgPSBcIjBcIjtcbiAgICAgIHN0eWxlLnBhZGRpbmdCb3R0b20gPSBcIjBcIjtcbiAgICAgIHN0eWxlLmJvcmRlclRvcFdpZHRoID0gXCIwXCI7XG4gICAgICBzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCA9IFwiMFwiO1xuICAgICAgc3R5bGUuaGVpZ2h0ID0gMDtcbiAgICB9O1xuXG4gICAgdmFyIHNjcm9sbEJhclZpcyA9IGRpdkJvZHlFbC5zY3JvbGxIZWlnaHQgPiBkaXZCb2R5RWwuY2xpZW50SGVpZ2h0O1xuXG4gICAgaWYgKHNldHRpbmdzLnNjcm9sbEJhclZpcyAhPT0gc2Nyb2xsQmFyVmlzICYmIHNldHRpbmdzLnNjcm9sbEJhclZpcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzZXR0aW5ncy5zY3JvbGxCYXJWaXMgPSBzY3JvbGxCYXJWaXM7XG5cbiAgICAgIF9mbkFkanVzdENvbHVtblNpemluZyhzZXR0aW5ncyk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0dGluZ3Muc2Nyb2xsQmFyVmlzID0gc2Nyb2xsQmFyVmlzO1xuICAgIH1cblxuICAgIHRhYmxlLmNoaWxkcmVuKCd0aGVhZCwgdGZvb3QnKS5yZW1vdmUoKTtcblxuICAgIGlmIChmb290ZXIpIHtcbiAgICAgIGZvb3RlckNvcHkgPSBmb290ZXIuY2xvbmUoKS5wcmVwZW5kVG8odGFibGUpO1xuICAgICAgZm9vdGVyVHJnRWxzID0gZm9vdGVyLmZpbmQoJ3RyJyk7XG4gICAgICBmb290ZXJTcmNFbHMgPSBmb290ZXJDb3B5LmZpbmQoJ3RyJyk7XG4gICAgfVxuXG4gICAgaGVhZGVyQ29weSA9IGhlYWRlci5jbG9uZSgpLnByZXBlbmRUbyh0YWJsZSk7XG4gICAgaGVhZGVyVHJnRWxzID0gaGVhZGVyLmZpbmQoJ3RyJyk7XG4gICAgaGVhZGVyU3JjRWxzID0gaGVhZGVyQ29weS5maW5kKCd0cicpO1xuICAgIGhlYWRlckNvcHkuZmluZCgndGgsIHRkJykucmVtb3ZlQXR0cigndGFiaW5kZXgnKTtcblxuICAgIGlmICghc2Nyb2xsWCkge1xuICAgICAgZGl2Qm9keVN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgZGl2SGVhZGVyWzBdLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIH1cblxuICAgICQuZWFjaChfZm5HZXRVbmlxdWVUaHMoc2V0dGluZ3MsIGhlYWRlckNvcHkpLCBmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgIGlkeCA9IF9mblZpc2libGVUb0NvbHVtbkluZGV4KHNldHRpbmdzLCBpKTtcbiAgICAgIGVsLnN0eWxlLndpZHRoID0gc2V0dGluZ3MuYW9Db2x1bW5zW2lkeF0uc1dpZHRoO1xuICAgIH0pO1xuXG4gICAgaWYgKGZvb3Rlcikge1xuICAgICAgX2ZuQXBwbHlUb0NoaWxkcmVuKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIG4uc3R5bGUud2lkdGggPSBcIlwiO1xuICAgICAgfSwgZm9vdGVyU3JjRWxzKTtcbiAgICB9XG5cbiAgICBzYW5pdHlXaWR0aCA9IHRhYmxlLm91dGVyV2lkdGgoKTtcblxuICAgIGlmIChzY3JvbGxYID09PSBcIlwiKSB7XG4gICAgICB0YWJsZVN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG5cbiAgICAgIGlmIChpZTY3ICYmICh0YWJsZS5maW5kKCd0Ym9keScpLmhlaWdodCgpID4gZGl2Qm9keUVsLm9mZnNldEhlaWdodCB8fCBkaXZCb2R5LmNzcygnb3ZlcmZsb3cteScpID09IFwic2Nyb2xsXCIpKSB7XG4gICAgICAgIHRhYmxlU3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0Nzcyh0YWJsZS5vdXRlcldpZHRoKCkgLSBiYXJXaWR0aCk7XG4gICAgICB9XG5cbiAgICAgIHNhbml0eVdpZHRoID0gdGFibGUub3V0ZXJXaWR0aCgpO1xuICAgIH0gZWxzZSBpZiAoc2Nyb2xsWElubmVyICE9PSBcIlwiKSB7XG4gICAgICB0YWJsZVN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3Moc2Nyb2xsWElubmVyKTtcbiAgICAgIHNhbml0eVdpZHRoID0gdGFibGUub3V0ZXJXaWR0aCgpO1xuICAgIH1cblxuICAgIF9mbkFwcGx5VG9DaGlsZHJlbih6ZXJvT3V0LCBoZWFkZXJTcmNFbHMpO1xuXG4gICAgX2ZuQXBwbHlUb0NoaWxkcmVuKGZ1bmN0aW9uIChuU2l6ZXIpIHtcbiAgICAgIGhlYWRlckNvbnRlbnQucHVzaChuU2l6ZXIuaW5uZXJIVE1MKTtcbiAgICAgIGhlYWRlcldpZHRocy5wdXNoKF9mblN0cmluZ1RvQ3NzKCQoblNpemVyKS5jc3MoJ3dpZHRoJykpKTtcbiAgICB9LCBoZWFkZXJTcmNFbHMpO1xuXG4gICAgX2ZuQXBwbHlUb0NoaWxkcmVuKGZ1bmN0aW9uIChuVG9TaXplLCBpKSB7XG4gICAgICBpZiAoJC5pbkFycmF5KG5Ub1NpemUsIGR0SGVhZGVyQ2VsbHMpICE9PSAtMSkge1xuICAgICAgICBuVG9TaXplLnN0eWxlLndpZHRoID0gaGVhZGVyV2lkdGhzW2ldO1xuICAgICAgfVxuICAgIH0sIGhlYWRlclRyZ0Vscyk7XG5cbiAgICAkKGhlYWRlclNyY0VscykuaGVpZ2h0KDApO1xuXG4gICAgaWYgKGZvb3Rlcikge1xuICAgICAgX2ZuQXBwbHlUb0NoaWxkcmVuKHplcm9PdXQsIGZvb3RlclNyY0Vscyk7XG5cbiAgICAgIF9mbkFwcGx5VG9DaGlsZHJlbihmdW5jdGlvbiAoblNpemVyKSB7XG4gICAgICAgIGZvb3RlckNvbnRlbnQucHVzaChuU2l6ZXIuaW5uZXJIVE1MKTtcbiAgICAgICAgZm9vdGVyV2lkdGhzLnB1c2goX2ZuU3RyaW5nVG9Dc3MoJChuU2l6ZXIpLmNzcygnd2lkdGgnKSkpO1xuICAgICAgfSwgZm9vdGVyU3JjRWxzKTtcblxuICAgICAgX2ZuQXBwbHlUb0NoaWxkcmVuKGZ1bmN0aW9uIChuVG9TaXplLCBpKSB7XG4gICAgICAgIG5Ub1NpemUuc3R5bGUud2lkdGggPSBmb290ZXJXaWR0aHNbaV07XG4gICAgICB9LCBmb290ZXJUcmdFbHMpO1xuXG4gICAgICAkKGZvb3RlclNyY0VscykuaGVpZ2h0KDApO1xuICAgIH1cblxuICAgIF9mbkFwcGx5VG9DaGlsZHJlbihmdW5jdGlvbiAoblNpemVyLCBpKSB7XG4gICAgICBuU2l6ZXIuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJkYXRhVGFibGVzX3NpemluZ1wiPicgKyBoZWFkZXJDb250ZW50W2ldICsgJzwvZGl2Pic7XG4gICAgICBuU2l6ZXIuY2hpbGROb2Rlc1swXS5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcbiAgICAgIG5TaXplci5jaGlsZE5vZGVzWzBdLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgIG5TaXplci5zdHlsZS53aWR0aCA9IGhlYWRlcldpZHRoc1tpXTtcbiAgICB9LCBoZWFkZXJTcmNFbHMpO1xuXG4gICAgaWYgKGZvb3Rlcikge1xuICAgICAgX2ZuQXBwbHlUb0NoaWxkcmVuKGZ1bmN0aW9uIChuU2l6ZXIsIGkpIHtcbiAgICAgICAgblNpemVyLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiZGF0YVRhYmxlc19zaXppbmdcIj4nICsgZm9vdGVyQ29udGVudFtpXSArICc8L2Rpdj4nO1xuICAgICAgICBuU2l6ZXIuY2hpbGROb2Rlc1swXS5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcbiAgICAgICAgblNpemVyLmNoaWxkTm9kZXNbMF0uc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICBuU2l6ZXIuc3R5bGUud2lkdGggPSBmb290ZXJXaWR0aHNbaV07XG4gICAgICB9LCBmb290ZXJTcmNFbHMpO1xuICAgIH1cblxuICAgIGlmICh0YWJsZS5vdXRlcldpZHRoKCkgPCBzYW5pdHlXaWR0aCkge1xuICAgICAgY29ycmVjdGlvbiA9IGRpdkJvZHlFbC5zY3JvbGxIZWlnaHQgPiBkaXZCb2R5RWwub2Zmc2V0SGVpZ2h0IHx8IGRpdkJvZHkuY3NzKCdvdmVyZmxvdy15JykgPT0gXCJzY3JvbGxcIiA/IHNhbml0eVdpZHRoICsgYmFyV2lkdGggOiBzYW5pdHlXaWR0aDtcblxuICAgICAgaWYgKGllNjcgJiYgKGRpdkJvZHlFbC5zY3JvbGxIZWlnaHQgPiBkaXZCb2R5RWwub2Zmc2V0SGVpZ2h0IHx8IGRpdkJvZHkuY3NzKCdvdmVyZmxvdy15JykgPT0gXCJzY3JvbGxcIikpIHtcbiAgICAgICAgdGFibGVTdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKGNvcnJlY3Rpb24gLSBiYXJXaWR0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzY3JvbGxYID09PSBcIlwiIHx8IHNjcm9sbFhJbm5lciAhPT0gXCJcIikge1xuICAgICAgICBfZm5Mb2coc2V0dGluZ3MsIDEsICdQb3NzaWJsZSBjb2x1bW4gbWlzYWxpZ25tZW50JywgNik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvcnJlY3Rpb24gPSAnMTAwJSc7XG4gICAgfVxuXG4gICAgZGl2Qm9keVN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoY29ycmVjdGlvbik7XG4gICAgZGl2SGVhZGVyU3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0Nzcyhjb3JyZWN0aW9uKTtcblxuICAgIGlmIChmb290ZXIpIHtcbiAgICAgIHNldHRpbmdzLm5TY3JvbGxGb290LnN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoY29ycmVjdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKCFzY3JvbGxZKSB7XG4gICAgICBpZiAoaWU2Nykge1xuICAgICAgICBkaXZCb2R5U3R5bGUuaGVpZ2h0ID0gX2ZuU3RyaW5nVG9Dc3ModGFibGVFbC5vZmZzZXRIZWlnaHQgKyBiYXJXaWR0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGlPdXRlcldpZHRoID0gdGFibGUub3V0ZXJXaWR0aCgpO1xuICAgIGRpdkhlYWRlclRhYmxlWzBdLnN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoaU91dGVyV2lkdGgpO1xuICAgIGRpdkhlYWRlcklubmVyU3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0NzcyhpT3V0ZXJXaWR0aCk7XG4gICAgdmFyIGJTY3JvbGxpbmcgPSB0YWJsZS5oZWlnaHQoKSA+IGRpdkJvZHlFbC5jbGllbnRIZWlnaHQgfHwgZGl2Qm9keS5jc3MoJ292ZXJmbG93LXknKSA9PSBcInNjcm9sbFwiO1xuICAgIHZhciBwYWRkaW5nID0gJ3BhZGRpbmcnICsgKGJyb3dzZXIuYlNjcm9sbGJhckxlZnQgPyAnTGVmdCcgOiAnUmlnaHQnKTtcbiAgICBkaXZIZWFkZXJJbm5lclN0eWxlW3BhZGRpbmddID0gYlNjcm9sbGluZyA/IGJhcldpZHRoICsgXCJweFwiIDogXCIwcHhcIjtcblxuICAgIGlmIChmb290ZXIpIHtcbiAgICAgIGRpdkZvb3RlclRhYmxlWzBdLnN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoaU91dGVyV2lkdGgpO1xuICAgICAgZGl2Rm9vdGVySW5uZXJbMF0uc3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0NzcyhpT3V0ZXJXaWR0aCk7XG4gICAgICBkaXZGb290ZXJJbm5lclswXS5zdHlsZVtwYWRkaW5nXSA9IGJTY3JvbGxpbmcgPyBiYXJXaWR0aCArIFwicHhcIiA6IFwiMHB4XCI7XG4gICAgfVxuXG4gICAgdGFibGUuY2hpbGRyZW4oJ2NvbGdyb3VwJykuaW5zZXJ0QmVmb3JlKHRhYmxlLmNoaWxkcmVuKCd0aGVhZCcpKTtcbiAgICBkaXZCb2R5LnNjcm9sbCgpO1xuXG4gICAgaWYgKChzZXR0aW5ncy5iU29ydGVkIHx8IHNldHRpbmdzLmJGaWx0ZXJlZCkgJiYgIXNldHRpbmdzLl9kcmF3SG9sZCkge1xuICAgICAgZGl2Qm9keUVsLnNjcm9sbFRvcCA9IDA7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQXBwbHlUb0NoaWxkcmVuKGZuLCBhbjEsIGFuMikge1xuICAgIHZhciBpbmRleCA9IDAsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBpTGVuID0gYW4xLmxlbmd0aDtcbiAgICB2YXIgbk5vZGUxLCBuTm9kZTI7XG5cbiAgICB3aGlsZSAoaSA8IGlMZW4pIHtcbiAgICAgIG5Ob2RlMSA9IGFuMVtpXS5maXJzdENoaWxkO1xuICAgICAgbk5vZGUyID0gYW4yID8gYW4yW2ldLmZpcnN0Q2hpbGQgOiBudWxsO1xuXG4gICAgICB3aGlsZSAobk5vZGUxKSB7XG4gICAgICAgIGlmIChuTm9kZTEubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICBpZiAoYW4yKSB7XG4gICAgICAgICAgICBmbihuTm9kZTEsIG5Ob2RlMiwgaW5kZXgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmbihuTm9kZTEsIGluZGV4KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgbk5vZGUxID0gbk5vZGUxLm5leHRTaWJsaW5nO1xuICAgICAgICBuTm9kZTIgPSBhbjIgPyBuTm9kZTIubmV4dFNpYmxpbmcgOiBudWxsO1xuICAgICAgfVxuXG4gICAgICBpKys7XG4gICAgfVxuICB9XG5cbiAgdmFyIF9fcmVfaHRtbF9yZW1vdmUgPSAvPC4qPz4vZztcblxuICBmdW5jdGlvbiBfZm5DYWxjdWxhdGVDb2x1bW5XaWR0aHMob1NldHRpbmdzKSB7XG4gICAgdmFyIHRhYmxlID0gb1NldHRpbmdzLm5UYWJsZSxcbiAgICAgICAgY29sdW1ucyA9IG9TZXR0aW5ncy5hb0NvbHVtbnMsXG4gICAgICAgIHNjcm9sbCA9IG9TZXR0aW5ncy5vU2Nyb2xsLFxuICAgICAgICBzY3JvbGxZID0gc2Nyb2xsLnNZLFxuICAgICAgICBzY3JvbGxYID0gc2Nyb2xsLnNYLFxuICAgICAgICBzY3JvbGxYSW5uZXIgPSBzY3JvbGwuc1hJbm5lcixcbiAgICAgICAgY29sdW1uQ291bnQgPSBjb2x1bW5zLmxlbmd0aCxcbiAgICAgICAgdmlzaWJsZUNvbHVtbnMgPSBfZm5HZXRDb2x1bW5zKG9TZXR0aW5ncywgJ2JWaXNpYmxlJyksXG4gICAgICAgIGhlYWRlckNlbGxzID0gJCgndGgnLCBvU2V0dGluZ3MublRIZWFkKSxcbiAgICAgICAgdGFibGVXaWR0aEF0dHIgPSB0YWJsZS5nZXRBdHRyaWJ1dGUoJ3dpZHRoJyksXG4gICAgICAgIHRhYmxlQ29udGFpbmVyID0gdGFibGUucGFyZW50Tm9kZSxcbiAgICAgICAgdXNlcklucHV0cyA9IGZhbHNlLFxuICAgICAgICBpLFxuICAgICAgICBjb2x1bW4sXG4gICAgICAgIGNvbHVtbklkeCxcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIG91dGVyV2lkdGgsXG4gICAgICAgIGJyb3dzZXIgPSBvU2V0dGluZ3Mub0Jyb3dzZXIsXG4gICAgICAgIGllNjcgPSBicm93c2VyLmJTY3JvbGxPdmVyc2l6ZTtcblxuICAgIHZhciBzdHlsZVdpZHRoID0gdGFibGUuc3R5bGUud2lkdGg7XG5cbiAgICBpZiAoc3R5bGVXaWR0aCAmJiBzdHlsZVdpZHRoLmluZGV4T2YoJyUnKSAhPT0gLTEpIHtcbiAgICAgIHRhYmxlV2lkdGhBdHRyID0gc3R5bGVXaWR0aDtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgdmlzaWJsZUNvbHVtbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbHVtbiA9IGNvbHVtbnNbdmlzaWJsZUNvbHVtbnNbaV1dO1xuXG4gICAgICBpZiAoY29sdW1uLnNXaWR0aCAhPT0gbnVsbCkge1xuICAgICAgICBjb2x1bW4uc1dpZHRoID0gX2ZuQ29udmVydFRvV2lkdGgoY29sdW1uLnNXaWR0aE9yaWcsIHRhYmxlQ29udGFpbmVyKTtcbiAgICAgICAgdXNlcklucHV0cyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGllNjcgfHwgIXVzZXJJbnB1dHMgJiYgIXNjcm9sbFggJiYgIXNjcm9sbFkgJiYgY29sdW1uQ291bnQgPT0gX2ZuVmlzYmxlQ29sdW1ucyhvU2V0dGluZ3MpICYmIGNvbHVtbkNvdW50ID09IGhlYWRlckNlbGxzLmxlbmd0aCkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGNvbHVtbkNvdW50OyBpKyspIHtcbiAgICAgICAgdmFyIGNvbElkeCA9IF9mblZpc2libGVUb0NvbHVtbkluZGV4KG9TZXR0aW5ncywgaSk7XG5cbiAgICAgICAgaWYgKGNvbElkeCAhPT0gbnVsbCkge1xuICAgICAgICAgIGNvbHVtbnNbY29sSWR4XS5zV2lkdGggPSBfZm5TdHJpbmdUb0NzcyhoZWFkZXJDZWxscy5lcShpKS53aWR0aCgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdG1wVGFibGUgPSAkKHRhYmxlKS5jbG9uZSgpLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKS5yZW1vdmVBdHRyKCdpZCcpO1xuICAgICAgdG1wVGFibGUuZmluZCgndGJvZHkgdHInKS5yZW1vdmUoKTtcbiAgICAgIHZhciB0ciA9ICQoJzx0ci8+JykuYXBwZW5kVG8odG1wVGFibGUuZmluZCgndGJvZHknKSk7XG4gICAgICB0bXBUYWJsZS5maW5kKCd0aGVhZCwgdGZvb3QnKS5yZW1vdmUoKTtcbiAgICAgIHRtcFRhYmxlLmFwcGVuZCgkKG9TZXR0aW5ncy5uVEhlYWQpLmNsb25lKCkpLmFwcGVuZCgkKG9TZXR0aW5ncy5uVEZvb3QpLmNsb25lKCkpO1xuICAgICAgdG1wVGFibGUuZmluZCgndGZvb3QgdGgsIHRmb290IHRkJykuY3NzKCd3aWR0aCcsICcnKTtcbiAgICAgIGhlYWRlckNlbGxzID0gX2ZuR2V0VW5pcXVlVGhzKG9TZXR0aW5ncywgdG1wVGFibGUuZmluZCgndGhlYWQnKVswXSk7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCB2aXNpYmxlQ29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb2x1bW4gPSBjb2x1bW5zW3Zpc2libGVDb2x1bW5zW2ldXTtcbiAgICAgICAgaGVhZGVyQ2VsbHNbaV0uc3R5bGUud2lkdGggPSBjb2x1bW4uc1dpZHRoT3JpZyAhPT0gbnVsbCAmJiBjb2x1bW4uc1dpZHRoT3JpZyAhPT0gJycgPyBfZm5TdHJpbmdUb0Nzcyhjb2x1bW4uc1dpZHRoT3JpZykgOiAnJztcblxuICAgICAgICBpZiAoY29sdW1uLnNXaWR0aE9yaWcgJiYgc2Nyb2xsWCkge1xuICAgICAgICAgICQoaGVhZGVyQ2VsbHNbaV0pLmFwcGVuZCgkKCc8ZGl2Lz4nKS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IGNvbHVtbi5zV2lkdGhPcmlnLFxuICAgICAgICAgICAgbWFyZ2luOiAwLFxuICAgICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgICAgIGhlaWdodDogMVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob1NldHRpbmdzLmFvRGF0YS5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHZpc2libGVDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29sdW1uSWR4ID0gdmlzaWJsZUNvbHVtbnNbaV07XG4gICAgICAgICAgY29sdW1uID0gY29sdW1uc1tjb2x1bW5JZHhdO1xuICAgICAgICAgICQoX2ZuR2V0V2lkZXN0Tm9kZShvU2V0dGluZ3MsIGNvbHVtbklkeCkpLmNsb25lKGZhbHNlKS5hcHBlbmQoY29sdW1uLnNDb250ZW50UGFkZGluZykuYXBwZW5kVG8odHIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICQoJ1tuYW1lXScsIHRtcFRhYmxlKS5yZW1vdmVBdHRyKCduYW1lJyk7XG4gICAgICB2YXIgaG9sZGVyID0gJCgnPGRpdi8+JykuY3NzKHNjcm9sbFggfHwgc2Nyb2xsWSA/IHtcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gICAgICB9IDoge30pLmFwcGVuZCh0bXBUYWJsZSkuYXBwZW5kVG8odGFibGVDb250YWluZXIpO1xuXG4gICAgICBpZiAoc2Nyb2xsWCAmJiBzY3JvbGxYSW5uZXIpIHtcbiAgICAgICAgdG1wVGFibGUud2lkdGgoc2Nyb2xsWElubmVyKTtcbiAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsWCkge1xuICAgICAgICB0bXBUYWJsZS5jc3MoJ3dpZHRoJywgJ2F1dG8nKTtcbiAgICAgICAgdG1wVGFibGUucmVtb3ZlQXR0cignd2lkdGgnKTtcblxuICAgICAgICBpZiAodG1wVGFibGUud2lkdGgoKSA8IHRhYmxlQ29udGFpbmVyLmNsaWVudFdpZHRoICYmIHRhYmxlV2lkdGhBdHRyKSB7XG4gICAgICAgICAgdG1wVGFibGUud2lkdGgodGFibGVDb250YWluZXIuY2xpZW50V2lkdGgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHNjcm9sbFkpIHtcbiAgICAgICAgdG1wVGFibGUud2lkdGgodGFibGVDb250YWluZXIuY2xpZW50V2lkdGgpO1xuICAgICAgfSBlbHNlIGlmICh0YWJsZVdpZHRoQXR0cikge1xuICAgICAgICB0bXBUYWJsZS53aWR0aCh0YWJsZVdpZHRoQXR0cik7XG4gICAgICB9XG5cbiAgICAgIHZhciB0b3RhbCA9IDA7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCB2aXNpYmxlQ29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2VsbCA9ICQoaGVhZGVyQ2VsbHNbaV0pO1xuICAgICAgICB2YXIgYm9yZGVyID0gY2VsbC5vdXRlcldpZHRoKCkgLSBjZWxsLndpZHRoKCk7XG4gICAgICAgIHZhciBib3VuZGluZyA9IGJyb3dzZXIuYkJvdW5kaW5nID8gTWF0aC5jZWlsKGhlYWRlckNlbGxzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoKSA6IGNlbGwub3V0ZXJXaWR0aCgpO1xuICAgICAgICB0b3RhbCArPSBib3VuZGluZztcbiAgICAgICAgY29sdW1uc1t2aXNpYmxlQ29sdW1uc1tpXV0uc1dpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoYm91bmRpbmcgLSBib3JkZXIpO1xuICAgICAgfVxuXG4gICAgICB0YWJsZS5zdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKHRvdGFsKTtcbiAgICAgIGhvbGRlci5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBpZiAodGFibGVXaWR0aEF0dHIpIHtcbiAgICAgIHRhYmxlLnN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3ModGFibGVXaWR0aEF0dHIpO1xuICAgIH1cblxuICAgIGlmICgodGFibGVXaWR0aEF0dHIgfHwgc2Nyb2xsWCkgJiYgIW9TZXR0aW5ncy5fcmVzekV2dCkge1xuICAgICAgdmFyIGJpbmRSZXNpemUgPSBmdW5jdGlvbiBiaW5kUmVzaXplKCkge1xuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS5EVC0nICsgb1NldHRpbmdzLnNJbnN0YW5jZSwgX2ZuVGhyb3R0bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF9mbkFkanVzdENvbHVtblNpemluZyhvU2V0dGluZ3MpO1xuICAgICAgICB9KSk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoaWU2Nykge1xuICAgICAgICBzZXRUaW1lb3V0KGJpbmRSZXNpemUsIDEwMDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmluZFJlc2l6ZSgpO1xuICAgICAgfVxuXG4gICAgICBvU2V0dGluZ3MuX3Jlc3pFdnQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHZhciBfZm5UaHJvdHRsZSA9IERhdGFUYWJsZS51dGlsLnRocm90dGxlO1xuXG4gIGZ1bmN0aW9uIF9mbkNvbnZlcnRUb1dpZHRoKHdpZHRoLCBwYXJlbnQpIHtcbiAgICBpZiAoIXdpZHRoKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICB2YXIgbiA9ICQoJzxkaXYvPicpLmNzcygnd2lkdGgnLCBfZm5TdHJpbmdUb0Nzcyh3aWR0aCkpLmFwcGVuZFRvKHBhcmVudCB8fCBkb2N1bWVudC5ib2R5KTtcbiAgICB2YXIgdmFsID0gblswXS5vZmZzZXRXaWR0aDtcbiAgICBuLnJlbW92ZSgpO1xuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5HZXRXaWRlc3ROb2RlKHNldHRpbmdzLCBjb2xJZHgpIHtcbiAgICB2YXIgaWR4ID0gX2ZuR2V0TWF4TGVuU3RyaW5nKHNldHRpbmdzLCBjb2xJZHgpO1xuXG4gICAgaWYgKGlkeCA8IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBkYXRhID0gc2V0dGluZ3MuYW9EYXRhW2lkeF07XG4gICAgcmV0dXJuICFkYXRhLm5UciA/ICQoJzx0ZC8+JykuaHRtbChfZm5HZXRDZWxsRGF0YShzZXR0aW5ncywgaWR4LCBjb2xJZHgsICdkaXNwbGF5JykpWzBdIDogZGF0YS5hbkNlbGxzW2NvbElkeF07XG4gIH1cblxuICBmdW5jdGlvbiBfZm5HZXRNYXhMZW5TdHJpbmcoc2V0dGluZ3MsIGNvbElkeCkge1xuICAgIHZhciBzLFxuICAgICAgICBtYXggPSAtMSxcbiAgICAgICAgbWF4SWR4ID0gLTE7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gc2V0dGluZ3MuYW9EYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBzID0gX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIGksIGNvbElkeCwgJ2Rpc3BsYXknKSArICcnO1xuICAgICAgcyA9IHMucmVwbGFjZShfX3JlX2h0bWxfcmVtb3ZlLCAnJyk7XG4gICAgICBzID0gcy5yZXBsYWNlKC8mbmJzcDsvZywgJyAnKTtcblxuICAgICAgaWYgKHMubGVuZ3RoID4gbWF4KSB7XG4gICAgICAgIG1heCA9IHMubGVuZ3RoO1xuICAgICAgICBtYXhJZHggPSBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtYXhJZHg7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5TdHJpbmdUb0NzcyhzKSB7XG4gICAgaWYgKHMgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnMHB4JztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHMgPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBzIDwgMCA/ICcwcHgnIDogcyArICdweCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHMubWF0Y2goL1xcZCQvKSA/IHMgKyAncHgnIDogcztcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNvcnRGbGF0dGVuKHNldHRpbmdzKSB7XG4gICAgdmFyIGksXG4gICAgICAgIGlMZW4sXG4gICAgICAgIGssXG4gICAgICAgIGtMZW4sXG4gICAgICAgIGFTb3J0ID0gW10sXG4gICAgICAgIGFpT3JpZyA9IFtdLFxuICAgICAgICBhb0NvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnMsXG4gICAgICAgIGFEYXRhU29ydCxcbiAgICAgICAgaUNvbCxcbiAgICAgICAgc1R5cGUsXG4gICAgICAgIHNyY0NvbCxcbiAgICAgICAgZml4ZWQgPSBzZXR0aW5ncy5hYVNvcnRpbmdGaXhlZCxcbiAgICAgICAgZml4ZWRPYmogPSAkLmlzUGxhaW5PYmplY3QoZml4ZWQpLFxuICAgICAgICBuZXN0ZWRTb3J0ID0gW10sXG4gICAgICAgIGFkZCA9IGZ1bmN0aW9uIGFkZChhKSB7XG4gICAgICBpZiAoYS5sZW5ndGggJiYgISQuaXNBcnJheShhWzBdKSkge1xuICAgICAgICBuZXN0ZWRTb3J0LnB1c2goYSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkLm1lcmdlKG5lc3RlZFNvcnQsIGEpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoJC5pc0FycmF5KGZpeGVkKSkge1xuICAgICAgYWRkKGZpeGVkKTtcbiAgICB9XG5cbiAgICBpZiAoZml4ZWRPYmogJiYgZml4ZWQucHJlKSB7XG4gICAgICBhZGQoZml4ZWQucHJlKTtcbiAgICB9XG5cbiAgICBhZGQoc2V0dGluZ3MuYWFTb3J0aW5nKTtcblxuICAgIGlmIChmaXhlZE9iaiAmJiBmaXhlZC5wb3N0KSB7XG4gICAgICBhZGQoZml4ZWQucG9zdCk7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IG5lc3RlZFNvcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHNyY0NvbCA9IG5lc3RlZFNvcnRbaV1bMF07XG4gICAgICBhRGF0YVNvcnQgPSBhb0NvbHVtbnNbc3JjQ29sXS5hRGF0YVNvcnQ7XG5cbiAgICAgIGZvciAoayA9IDAsIGtMZW4gPSBhRGF0YVNvcnQubGVuZ3RoOyBrIDwga0xlbjsgaysrKSB7XG4gICAgICAgIGlDb2wgPSBhRGF0YVNvcnRba107XG4gICAgICAgIHNUeXBlID0gYW9Db2x1bW5zW2lDb2xdLnNUeXBlIHx8ICdzdHJpbmcnO1xuXG4gICAgICAgIGlmIChuZXN0ZWRTb3J0W2ldLl9pZHggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG5lc3RlZFNvcnRbaV0uX2lkeCA9ICQuaW5BcnJheShuZXN0ZWRTb3J0W2ldWzFdLCBhb0NvbHVtbnNbaUNvbF0uYXNTb3J0aW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFTb3J0LnB1c2goe1xuICAgICAgICAgIHNyYzogc3JjQ29sLFxuICAgICAgICAgIGNvbDogaUNvbCxcbiAgICAgICAgICBkaXI6IG5lc3RlZFNvcnRbaV1bMV0sXG4gICAgICAgICAgaW5kZXg6IG5lc3RlZFNvcnRbaV0uX2lkeCxcbiAgICAgICAgICB0eXBlOiBzVHlwZSxcbiAgICAgICAgICBmb3JtYXR0ZXI6IERhdGFUYWJsZS5leHQudHlwZS5vcmRlcltzVHlwZSArIFwiLXByZVwiXVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYVNvcnQ7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Tb3J0KG9TZXR0aW5ncykge1xuICAgIHZhciBpLFxuICAgICAgICBpZW4sXG4gICAgICAgIGlMZW4sXG4gICAgICAgIGosXG4gICAgICAgIGpMZW4sXG4gICAgICAgIGssXG4gICAgICAgIGtMZW4sXG4gICAgICAgIHNEYXRhVHlwZSxcbiAgICAgICAgblRoLFxuICAgICAgICBhaU9yaWcgPSBbXSxcbiAgICAgICAgb0V4dFNvcnQgPSBEYXRhVGFibGUuZXh0LnR5cGUub3JkZXIsXG4gICAgICAgIGFvRGF0YSA9IG9TZXR0aW5ncy5hb0RhdGEsXG4gICAgICAgIGFvQ29sdW1ucyA9IG9TZXR0aW5ncy5hb0NvbHVtbnMsXG4gICAgICAgIGFEYXRhU29ydCxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgaUNvbCxcbiAgICAgICAgc1R5cGUsXG4gICAgICAgIG9Tb3J0LFxuICAgICAgICBmb3JtYXR0ZXJzID0gMCxcbiAgICAgICAgc29ydENvbCxcbiAgICAgICAgZGlzcGxheU1hc3RlciA9IG9TZXR0aW5ncy5haURpc3BsYXlNYXN0ZXIsXG4gICAgICAgIGFTb3J0O1xuXG4gICAgX2ZuQ29sdW1uVHlwZXMob1NldHRpbmdzKTtcblxuICAgIGFTb3J0ID0gX2ZuU29ydEZsYXR0ZW4ob1NldHRpbmdzKTtcblxuICAgIGZvciAoaSA9IDAsIGllbiA9IGFTb3J0Lmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBzb3J0Q29sID0gYVNvcnRbaV07XG5cbiAgICAgIGlmIChzb3J0Q29sLmZvcm1hdHRlcikge1xuICAgICAgICBmb3JtYXR0ZXJzKys7XG4gICAgICB9XG5cbiAgICAgIF9mblNvcnREYXRhKG9TZXR0aW5ncywgc29ydENvbC5jb2wpO1xuICAgIH1cblxuICAgIGlmIChfZm5EYXRhU291cmNlKG9TZXR0aW5ncykgIT0gJ3NzcCcgJiYgYVNvcnQubGVuZ3RoICE9PSAwKSB7XG4gICAgICBmb3IgKGkgPSAwLCBpTGVuID0gZGlzcGxheU1hc3Rlci5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgYWlPcmlnW2Rpc3BsYXlNYXN0ZXJbaV1dID0gaTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZvcm1hdHRlcnMgPT09IGFTb3J0Lmxlbmd0aCkge1xuICAgICAgICBkaXNwbGF5TWFzdGVyLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICB2YXIgeCxcbiAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgayxcbiAgICAgICAgICAgICAgdGVzdCxcbiAgICAgICAgICAgICAgc29ydCxcbiAgICAgICAgICAgICAgbGVuID0gYVNvcnQubGVuZ3RoLFxuICAgICAgICAgICAgICBkYXRhQSA9IGFvRGF0YVthXS5fYVNvcnREYXRhLFxuICAgICAgICAgICAgICBkYXRhQiA9IGFvRGF0YVtiXS5fYVNvcnREYXRhO1xuXG4gICAgICAgICAgZm9yIChrID0gMDsgayA8IGxlbjsgaysrKSB7XG4gICAgICAgICAgICBzb3J0ID0gYVNvcnRba107XG4gICAgICAgICAgICB4ID0gZGF0YUFbc29ydC5jb2xdO1xuICAgICAgICAgICAgeSA9IGRhdGFCW3NvcnQuY29sXTtcbiAgICAgICAgICAgIHRlc3QgPSB4IDwgeSA/IC0xIDogeCA+IHkgPyAxIDogMDtcblxuICAgICAgICAgICAgaWYgKHRlc3QgIT09IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNvcnQuZGlyID09PSAnYXNjJyA/IHRlc3QgOiAtdGVzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB4ID0gYWlPcmlnW2FdO1xuICAgICAgICAgIHkgPSBhaU9yaWdbYl07XG4gICAgICAgICAgcmV0dXJuIHggPCB5ID8gLTEgOiB4ID4geSA/IDEgOiAwO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3BsYXlNYXN0ZXIuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgIHZhciB4LFxuICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICBrLFxuICAgICAgICAgICAgICBsLFxuICAgICAgICAgICAgICB0ZXN0LFxuICAgICAgICAgICAgICBzb3J0LFxuICAgICAgICAgICAgICBmbixcbiAgICAgICAgICAgICAgbGVuID0gYVNvcnQubGVuZ3RoLFxuICAgICAgICAgICAgICBkYXRhQSA9IGFvRGF0YVthXS5fYVNvcnREYXRhLFxuICAgICAgICAgICAgICBkYXRhQiA9IGFvRGF0YVtiXS5fYVNvcnREYXRhO1xuXG4gICAgICAgICAgZm9yIChrID0gMDsgayA8IGxlbjsgaysrKSB7XG4gICAgICAgICAgICBzb3J0ID0gYVNvcnRba107XG4gICAgICAgICAgICB4ID0gZGF0YUFbc29ydC5jb2xdO1xuICAgICAgICAgICAgeSA9IGRhdGFCW3NvcnQuY29sXTtcbiAgICAgICAgICAgIGZuID0gb0V4dFNvcnRbc29ydC50eXBlICsgXCItXCIgKyBzb3J0LmRpcl0gfHwgb0V4dFNvcnRbXCJzdHJpbmctXCIgKyBzb3J0LmRpcl07XG4gICAgICAgICAgICB0ZXN0ID0gZm4oeCwgeSk7XG5cbiAgICAgICAgICAgIGlmICh0ZXN0ICE9PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0ZXN0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHggPSBhaU9yaWdbYV07XG4gICAgICAgICAgeSA9IGFpT3JpZ1tiXTtcbiAgICAgICAgICByZXR1cm4geCA8IHkgPyAtMSA6IHggPiB5ID8gMSA6IDA7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIG9TZXR0aW5ncy5iU29ydGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNvcnRBcmlhKHNldHRpbmdzKSB7XG4gICAgdmFyIGxhYmVsO1xuICAgIHZhciBuZXh0U29ydDtcbiAgICB2YXIgY29sdW1ucyA9IHNldHRpbmdzLmFvQ29sdW1ucztcblxuICAgIHZhciBhU29ydCA9IF9mblNvcnRGbGF0dGVuKHNldHRpbmdzKTtcblxuICAgIHZhciBvQXJpYSA9IHNldHRpbmdzLm9MYW5ndWFnZS5vQXJpYTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gY29sdW1ucy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIHZhciBjb2wgPSBjb2x1bW5zW2ldO1xuICAgICAgdmFyIGFzU29ydGluZyA9IGNvbC5hc1NvcnRpbmc7XG4gICAgICB2YXIgc1RpdGxlID0gY29sLnNUaXRsZS5yZXBsYWNlKC88Lio/Pi9nLCBcIlwiKTtcbiAgICAgIHZhciB0aCA9IGNvbC5uVGg7XG4gICAgICB0aC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtc29ydCcpO1xuXG4gICAgICBpZiAoY29sLmJTb3J0YWJsZSkge1xuICAgICAgICBpZiAoYVNvcnQubGVuZ3RoID4gMCAmJiBhU29ydFswXS5jb2wgPT0gaSkge1xuICAgICAgICAgIHRoLnNldEF0dHJpYnV0ZSgnYXJpYS1zb3J0JywgYVNvcnRbMF0uZGlyID09IFwiYXNjXCIgPyBcImFzY2VuZGluZ1wiIDogXCJkZXNjZW5kaW5nXCIpO1xuICAgICAgICAgIG5leHRTb3J0ID0gYXNTb3J0aW5nW2FTb3J0WzBdLmluZGV4ICsgMV0gfHwgYXNTb3J0aW5nWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5leHRTb3J0ID0gYXNTb3J0aW5nWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFiZWwgPSBzVGl0bGUgKyAobmV4dFNvcnQgPT09IFwiYXNjXCIgPyBvQXJpYS5zU29ydEFzY2VuZGluZyA6IG9BcmlhLnNTb3J0RGVzY2VuZGluZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYWJlbCA9IHNUaXRsZTtcbiAgICAgIH1cblxuICAgICAgdGguc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgbGFiZWwpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNvcnRMaXN0ZW5lcihzZXR0aW5ncywgY29sSWR4LCBhcHBlbmQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGNvbCA9IHNldHRpbmdzLmFvQ29sdW1uc1tjb2xJZHhdO1xuICAgIHZhciBzb3J0aW5nID0gc2V0dGluZ3MuYWFTb3J0aW5nO1xuICAgIHZhciBhc1NvcnRpbmcgPSBjb2wuYXNTb3J0aW5nO1xuICAgIHZhciBuZXh0U29ydElkeDtcblxuICAgIHZhciBuZXh0ID0gZnVuY3Rpb24gbmV4dChhLCBvdmVyZmxvdykge1xuICAgICAgdmFyIGlkeCA9IGEuX2lkeDtcblxuICAgICAgaWYgKGlkeCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlkeCA9ICQuaW5BcnJheShhWzFdLCBhc1NvcnRpbmcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaWR4ICsgMSA8IGFzU29ydGluZy5sZW5ndGggPyBpZHggKyAxIDogb3ZlcmZsb3cgPyBudWxsIDogMDtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBzb3J0aW5nWzBdID09PSAnbnVtYmVyJykge1xuICAgICAgc29ydGluZyA9IHNldHRpbmdzLmFhU29ydGluZyA9IFtzb3J0aW5nXTtcbiAgICB9XG5cbiAgICBpZiAoYXBwZW5kICYmIHNldHRpbmdzLm9GZWF0dXJlcy5iU29ydE11bHRpKSB7XG4gICAgICB2YXIgc29ydElkeCA9ICQuaW5BcnJheShjb2xJZHgsIF9wbHVjayhzb3J0aW5nLCAnMCcpKTtcblxuICAgICAgaWYgKHNvcnRJZHggIT09IC0xKSB7XG4gICAgICAgIG5leHRTb3J0SWR4ID0gbmV4dChzb3J0aW5nW3NvcnRJZHhdLCB0cnVlKTtcblxuICAgICAgICBpZiAobmV4dFNvcnRJZHggPT09IG51bGwgJiYgc29ydGluZy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBuZXh0U29ydElkeCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV4dFNvcnRJZHggPT09IG51bGwpIHtcbiAgICAgICAgICBzb3J0aW5nLnNwbGljZShzb3J0SWR4LCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzb3J0aW5nW3NvcnRJZHhdWzFdID0gYXNTb3J0aW5nW25leHRTb3J0SWR4XTtcbiAgICAgICAgICBzb3J0aW5nW3NvcnRJZHhdLl9pZHggPSBuZXh0U29ydElkeDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc29ydGluZy5wdXNoKFtjb2xJZHgsIGFzU29ydGluZ1swXSwgMF0pO1xuICAgICAgICBzb3J0aW5nW3NvcnRpbmcubGVuZ3RoIC0gMV0uX2lkeCA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzb3J0aW5nLmxlbmd0aCAmJiBzb3J0aW5nWzBdWzBdID09IGNvbElkeCkge1xuICAgICAgbmV4dFNvcnRJZHggPSBuZXh0KHNvcnRpbmdbMF0pO1xuICAgICAgc29ydGluZy5sZW5ndGggPSAxO1xuICAgICAgc29ydGluZ1swXVsxXSA9IGFzU29ydGluZ1tuZXh0U29ydElkeF07XG4gICAgICBzb3J0aW5nWzBdLl9pZHggPSBuZXh0U29ydElkeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc29ydGluZy5sZW5ndGggPSAwO1xuICAgICAgc29ydGluZy5wdXNoKFtjb2xJZHgsIGFzU29ydGluZ1swXV0pO1xuICAgICAgc29ydGluZ1swXS5faWR4ID0gMDtcbiAgICB9XG5cbiAgICBfZm5SZURyYXcoc2V0dGluZ3MpO1xuXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayhzZXR0aW5ncyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU29ydEF0dGFjaExpc3RlbmVyKHNldHRpbmdzLCBhdHRhY2hUbywgY29sSWR4LCBjYWxsYmFjaykge1xuICAgIHZhciBjb2wgPSBzZXR0aW5ncy5hb0NvbHVtbnNbY29sSWR4XTtcblxuICAgIF9mbkJpbmRBY3Rpb24oYXR0YWNoVG8sIHt9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKGNvbC5iU29ydGFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHNldHRpbmdzLm9GZWF0dXJlcy5iUHJvY2Vzc2luZykge1xuICAgICAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShzZXR0aW5ncywgdHJ1ZSk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX2ZuU29ydExpc3RlbmVyKHNldHRpbmdzLCBjb2xJZHgsIGUuc2hpZnRLZXksIGNhbGxiYWNrKTtcblxuICAgICAgICAgIGlmIChfZm5EYXRhU291cmNlKHNldHRpbmdzKSAhPT0gJ3NzcCcpIHtcbiAgICAgICAgICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KHNldHRpbmdzLCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9mblNvcnRMaXN0ZW5lcihzZXR0aW5ncywgY29sSWR4LCBlLnNoaWZ0S2V5LCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Tb3J0aW5nQ2xhc3NlcyhzZXR0aW5ncykge1xuICAgIHZhciBvbGRTb3J0ID0gc2V0dGluZ3MuYUxhc3RTb3J0O1xuICAgIHZhciBzb3J0Q2xhc3MgPSBzZXR0aW5ncy5vQ2xhc3Nlcy5zU29ydENvbHVtbjtcblxuICAgIHZhciBzb3J0ID0gX2ZuU29ydEZsYXR0ZW4oc2V0dGluZ3MpO1xuXG4gICAgdmFyIGZlYXR1cmVzID0gc2V0dGluZ3Mub0ZlYXR1cmVzO1xuICAgIHZhciBpLCBpZW4sIGNvbElkeDtcblxuICAgIGlmIChmZWF0dXJlcy5iU29ydCAmJiBmZWF0dXJlcy5iU29ydENsYXNzZXMpIHtcbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IG9sZFNvcnQubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgY29sSWR4ID0gb2xkU29ydFtpXS5zcmM7XG4gICAgICAgICQoX3BsdWNrKHNldHRpbmdzLmFvRGF0YSwgJ2FuQ2VsbHMnLCBjb2xJZHgpKS5yZW1vdmVDbGFzcyhzb3J0Q2xhc3MgKyAoaSA8IDIgPyBpICsgMSA6IDMpKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMCwgaWVuID0gc29ydC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBjb2xJZHggPSBzb3J0W2ldLnNyYztcbiAgICAgICAgJChfcGx1Y2soc2V0dGluZ3MuYW9EYXRhLCAnYW5DZWxscycsIGNvbElkeCkpLmFkZENsYXNzKHNvcnRDbGFzcyArIChpIDwgMiA/IGkgKyAxIDogMykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldHRpbmdzLmFMYXN0U29ydCA9IHNvcnQ7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Tb3J0RGF0YShzZXR0aW5ncywgaWR4KSB7XG4gICAgdmFyIGNvbHVtbiA9IHNldHRpbmdzLmFvQ29sdW1uc1tpZHhdO1xuICAgIHZhciBjdXN0b21Tb3J0ID0gRGF0YVRhYmxlLmV4dC5vcmRlcltjb2x1bW4uc1NvcnREYXRhVHlwZV07XG4gICAgdmFyIGN1c3RvbURhdGE7XG5cbiAgICBpZiAoY3VzdG9tU29ydCkge1xuICAgICAgY3VzdG9tRGF0YSA9IGN1c3RvbVNvcnQuY2FsbChzZXR0aW5ncy5vSW5zdGFuY2UsIHNldHRpbmdzLCBpZHgsIF9mbkNvbHVtbkluZGV4VG9WaXNpYmxlKHNldHRpbmdzLCBpZHgpKTtcbiAgICB9XG5cbiAgICB2YXIgcm93LCBjZWxsRGF0YTtcbiAgICB2YXIgZm9ybWF0dGVyID0gRGF0YVRhYmxlLmV4dC50eXBlLm9yZGVyW2NvbHVtbi5zVHlwZSArIFwiLXByZVwiXTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBzZXR0aW5ncy5hb0RhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIHJvdyA9IHNldHRpbmdzLmFvRGF0YVtpXTtcblxuICAgICAgaWYgKCFyb3cuX2FTb3J0RGF0YSkge1xuICAgICAgICByb3cuX2FTb3J0RGF0YSA9IFtdO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJvdy5fYVNvcnREYXRhW2lkeF0gfHwgY3VzdG9tU29ydCkge1xuICAgICAgICBjZWxsRGF0YSA9IGN1c3RvbVNvcnQgPyBjdXN0b21EYXRhW2ldIDogX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIGksIGlkeCwgJ3NvcnQnKTtcbiAgICAgICAgcm93Ll9hU29ydERhdGFbaWR4XSA9IGZvcm1hdHRlciA/IGZvcm1hdHRlcihjZWxsRGF0YSkgOiBjZWxsRGF0YTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5TYXZlU3RhdGUoc2V0dGluZ3MpIHtcbiAgICBpZiAoIXNldHRpbmdzLm9GZWF0dXJlcy5iU3RhdGVTYXZlIHx8IHNldHRpbmdzLmJEZXN0cm95aW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlID0ge1xuICAgICAgdGltZTogK25ldyBEYXRlKCksXG4gICAgICBzdGFydDogc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQsXG4gICAgICBsZW5ndGg6IHNldHRpbmdzLl9pRGlzcGxheUxlbmd0aCxcbiAgICAgIG9yZGVyOiAkLmV4dGVuZCh0cnVlLCBbXSwgc2V0dGluZ3MuYWFTb3J0aW5nKSxcbiAgICAgIHNlYXJjaDogX2ZuU2VhcmNoVG9DYW1lbChzZXR0aW5ncy5vUHJldmlvdXNTZWFyY2gpLFxuICAgICAgY29sdW1uczogJC5tYXAoc2V0dGluZ3MuYW9Db2x1bW5zLCBmdW5jdGlvbiAoY29sLCBpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmlzaWJsZTogY29sLmJWaXNpYmxlLFxuICAgICAgICAgIHNlYXJjaDogX2ZuU2VhcmNoVG9DYW1lbChzZXR0aW5ncy5hb1ByZVNlYXJjaENvbHNbaV0pXG4gICAgICAgIH07XG4gICAgICB9KVxuICAgIH07XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIFwiYW9TdGF0ZVNhdmVQYXJhbXNcIiwgJ3N0YXRlU2F2ZVBhcmFtcycsIFtzZXR0aW5ncywgc3RhdGVdKTtcblxuICAgIHNldHRpbmdzLm9TYXZlZFN0YXRlID0gc3RhdGU7XG4gICAgc2V0dGluZ3MuZm5TdGF0ZVNhdmVDYWxsYmFjay5jYWxsKHNldHRpbmdzLm9JbnN0YW5jZSwgc2V0dGluZ3MsIHN0YXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkxvYWRTdGF0ZShzZXR0aW5ncywgb0luaXQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGksIGllbjtcbiAgICB2YXIgY29sdW1ucyA9IHNldHRpbmdzLmFvQ29sdW1ucztcblxuICAgIHZhciBsb2FkZWQgPSBmdW5jdGlvbiBsb2FkZWQocykge1xuICAgICAgaWYgKCFzIHx8ICFzLnRpbWUpIHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgYWJTdGF0ZUxvYWQgPSBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsICdhb1N0YXRlTG9hZFBhcmFtcycsICdzdGF0ZUxvYWRQYXJhbXMnLCBbc2V0dGluZ3MsIHNdKTtcblxuICAgICAgaWYgKCQuaW5BcnJheShmYWxzZSwgYWJTdGF0ZUxvYWQpICE9PSAtMSkge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBkdXJhdGlvbiA9IHNldHRpbmdzLmlTdGF0ZUR1cmF0aW9uO1xuXG4gICAgICBpZiAoZHVyYXRpb24gPiAwICYmIHMudGltZSA8ICtuZXcgRGF0ZSgpIC0gZHVyYXRpb24gKiAxMDAwKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHMuY29sdW1ucyAmJiBjb2x1bW5zLmxlbmd0aCAhPT0gcy5jb2x1bW5zLmxlbmd0aCkge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNldHRpbmdzLm9Mb2FkZWRTdGF0ZSA9ICQuZXh0ZW5kKHRydWUsIHt9LCBzKTtcblxuICAgICAgaWYgKHMuc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzZXR0aW5ncy5faURpc3BsYXlTdGFydCA9IHMuc3RhcnQ7XG4gICAgICAgIHNldHRpbmdzLmlJbml0RGlzcGxheVN0YXJ0ID0gcy5zdGFydDtcbiAgICAgIH1cblxuICAgICAgaWYgKHMubGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoID0gcy5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIGlmIChzLm9yZGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2V0dGluZ3MuYWFTb3J0aW5nID0gW107XG4gICAgICAgICQuZWFjaChzLm9yZGVyLCBmdW5jdGlvbiAoaSwgY29sKSB7XG4gICAgICAgICAgc2V0dGluZ3MuYWFTb3J0aW5nLnB1c2goY29sWzBdID49IGNvbHVtbnMubGVuZ3RoID8gWzAsIGNvbFsxXV0gOiBjb2wpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHMuc2VhcmNoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgJC5leHRlbmQoc2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoLCBfZm5TZWFyY2hUb0h1bmcocy5zZWFyY2gpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHMuY29sdW1ucykge1xuICAgICAgICBmb3IgKGkgPSAwLCBpZW4gPSBzLmNvbHVtbnMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICB2YXIgY29sID0gcy5jb2x1bW5zW2ldO1xuXG4gICAgICAgICAgaWYgKGNvbC52aXNpYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbHVtbnNbaV0uYlZpc2libGUgPSBjb2wudmlzaWJsZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY29sLnNlYXJjaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChzZXR0aW5ncy5hb1ByZVNlYXJjaENvbHNbaV0sIF9mblNlYXJjaFRvSHVuZyhjb2wuc2VhcmNoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgJ2FvU3RhdGVMb2FkZWQnLCAnc3RhdGVMb2FkZWQnLCBbc2V0dGluZ3MsIHNdKTtcblxuICAgICAgY2FsbGJhY2soKTtcbiAgICB9O1xuXG4gICAgaWYgKCFzZXR0aW5ncy5vRmVhdHVyZXMuYlN0YXRlU2F2ZSkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgc3RhdGUgPSBzZXR0aW5ncy5mblN0YXRlTG9hZENhbGxiYWNrLmNhbGwoc2V0dGluZ3Mub0luc3RhbmNlLCBzZXR0aW5ncywgbG9hZGVkKTtcblxuICAgIGlmIChzdGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBsb2FkZWQoc3RhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNldHRpbmdzRnJvbU5vZGUodGFibGUpIHtcbiAgICB2YXIgc2V0dGluZ3MgPSBEYXRhVGFibGUuc2V0dGluZ3M7XG4gICAgdmFyIGlkeCA9ICQuaW5BcnJheSh0YWJsZSwgX3BsdWNrKHNldHRpbmdzLCAnblRhYmxlJykpO1xuICAgIHJldHVybiBpZHggIT09IC0xID8gc2V0dGluZ3NbaWR4XSA6IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Mb2coc2V0dGluZ3MsIGxldmVsLCBtc2csIHRuKSB7XG4gICAgbXNnID0gJ0RhdGFUYWJsZXMgd2FybmluZzogJyArIChzZXR0aW5ncyA/ICd0YWJsZSBpZD0nICsgc2V0dGluZ3Muc1RhYmxlSWQgKyAnIC0gJyA6ICcnKSArIG1zZztcblxuICAgIGlmICh0bikge1xuICAgICAgbXNnICs9ICcuIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoaXMgZXJyb3IsIHBsZWFzZSBzZWUgJyArICdodHRwOi8vZGF0YXRhYmxlcy5uZXQvdG4vJyArIHRuO1xuICAgIH1cblxuICAgIGlmICghbGV2ZWwpIHtcbiAgICAgIHZhciBleHQgPSBEYXRhVGFibGUuZXh0O1xuICAgICAgdmFyIHR5cGUgPSBleHQuc0Vyck1vZGUgfHwgZXh0LmVyck1vZGU7XG5cbiAgICAgIGlmIChzZXR0aW5ncykge1xuICAgICAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIG51bGwsICdlcnJvcicsIFtzZXR0aW5ncywgdG4sIG1zZ10pO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZSA9PSAnYWxlcnQnKSB7XG4gICAgICAgIGFsZXJ0KG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ3Rocm93Jykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHR5cGUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0eXBlKHNldHRpbmdzLCB0biwgbXNnKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUubG9nKSB7XG4gICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbk1hcChyZXQsIHNyYywgbmFtZSwgbWFwcGVkTmFtZSkge1xuICAgIGlmICgkLmlzQXJyYXkobmFtZSkpIHtcbiAgICAgICQuZWFjaChuYW1lLCBmdW5jdGlvbiAoaSwgdmFsKSB7XG4gICAgICAgIGlmICgkLmlzQXJyYXkodmFsKSkge1xuICAgICAgICAgIF9mbk1hcChyZXQsIHNyYywgdmFsWzBdLCB2YWxbMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9mbk1hcChyZXQsIHNyYywgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG1hcHBlZE5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbWFwcGVkTmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgaWYgKHNyY1tuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXRbbWFwcGVkTmFtZV0gPSBzcmNbbmFtZV07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRXh0ZW5kKG91dCwgZXh0ZW5kZXIsIGJyZWFrUmVmcykge1xuICAgIHZhciB2YWw7XG5cbiAgICBmb3IgKHZhciBwcm9wIGluIGV4dGVuZGVyKSB7XG4gICAgICBpZiAoZXh0ZW5kZXIuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgdmFsID0gZXh0ZW5kZXJbcHJvcF07XG5cbiAgICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICAgICAgaWYgKCEkLmlzUGxhaW5PYmplY3Qob3V0W3Byb3BdKSkge1xuICAgICAgICAgICAgb3V0W3Byb3BdID0ge307XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJC5leHRlbmQodHJ1ZSwgb3V0W3Byb3BdLCB2YWwpO1xuICAgICAgICB9IGVsc2UgaWYgKGJyZWFrUmVmcyAmJiBwcm9wICE9PSAnZGF0YScgJiYgcHJvcCAhPT0gJ2FhRGF0YScgJiYgJC5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICBvdXRbcHJvcF0gPSB2YWwuc2xpY2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXRbcHJvcF0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQmluZEFjdGlvbihuLCBvRGF0YSwgZm4pIHtcbiAgICAkKG4pLm9uKCdjbGljay5EVCcsIG9EYXRhLCBmdW5jdGlvbiAoZSkge1xuICAgICAgJChuKS5ibHVyKCk7XG4gICAgICBmbihlKTtcbiAgICB9KS5vbigna2V5cHJlc3MuRFQnLCBvRGF0YSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChlLndoaWNoID09PSAxMykge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGZuKGUpO1xuICAgICAgfVxuICAgIH0pLm9uKCdzZWxlY3RzdGFydC5EVCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgc1N0b3JlLCBmbiwgc05hbWUpIHtcbiAgICBpZiAoZm4pIHtcbiAgICAgIG9TZXR0aW5nc1tzU3RvcmVdLnB1c2goe1xuICAgICAgICBcImZuXCI6IGZuLFxuICAgICAgICBcInNOYW1lXCI6IHNOYW1lXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIGNhbGxiYWNrQXJyLCBldmVudE5hbWUsIGFyZ3MpIHtcbiAgICB2YXIgcmV0ID0gW107XG5cbiAgICBpZiAoY2FsbGJhY2tBcnIpIHtcbiAgICAgIHJldCA9ICQubWFwKHNldHRpbmdzW2NhbGxiYWNrQXJyXS5zbGljZSgpLnJldmVyc2UoKSwgZnVuY3Rpb24gKHZhbCwgaSkge1xuICAgICAgICByZXR1cm4gdmFsLmZuLmFwcGx5KHNldHRpbmdzLm9JbnN0YW5jZSwgYXJncyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnROYW1lICE9PSBudWxsKSB7XG4gICAgICB2YXIgZSA9ICQuRXZlbnQoZXZlbnROYW1lICsgJy5kdCcpO1xuICAgICAgJChzZXR0aW5ncy5uVGFibGUpLnRyaWdnZXIoZSwgYXJncyk7XG4gICAgICByZXQucHVzaChlLnJlc3VsdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkxlbmd0aE92ZXJmbG93KHNldHRpbmdzKSB7XG4gICAgdmFyIHN0YXJ0ID0gc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQsXG4gICAgICAgIGVuZCA9IHNldHRpbmdzLmZuRGlzcGxheUVuZCgpLFxuICAgICAgICBsZW4gPSBzZXR0aW5ncy5faURpc3BsYXlMZW5ndGg7XG5cbiAgICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgICBzdGFydCA9IGVuZCAtIGxlbjtcbiAgICB9XG5cbiAgICBzdGFydCAtPSBzdGFydCAlIGxlbjtcblxuICAgIGlmIChsZW4gPT09IC0xIHx8IHN0YXJ0IDwgMCkge1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cblxuICAgIHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0ID0gc3RhcnQ7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5SZW5kZXJlcihzZXR0aW5ncywgdHlwZSkge1xuICAgIHZhciByZW5kZXJlciA9IHNldHRpbmdzLnJlbmRlcmVyO1xuICAgIHZhciBob3N0ID0gRGF0YVRhYmxlLmV4dC5yZW5kZXJlclt0eXBlXTtcblxuICAgIGlmICgkLmlzUGxhaW5PYmplY3QocmVuZGVyZXIpICYmIHJlbmRlcmVyW3R5cGVdKSB7XG4gICAgICByZXR1cm4gaG9zdFtyZW5kZXJlclt0eXBlXV0gfHwgaG9zdC5fO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlbmRlcmVyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGhvc3RbcmVuZGVyZXJdIHx8IGhvc3QuXztcbiAgICB9XG5cbiAgICByZXR1cm4gaG9zdC5fO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRGF0YVNvdXJjZShzZXR0aW5ncykge1xuICAgIGlmIChzZXR0aW5ncy5vRmVhdHVyZXMuYlNlcnZlclNpZGUpIHtcbiAgICAgIHJldHVybiAnc3NwJztcbiAgICB9IGVsc2UgaWYgKHNldHRpbmdzLmFqYXggfHwgc2V0dGluZ3Muc0FqYXhTb3VyY2UpIHtcbiAgICAgIHJldHVybiAnYWpheCc7XG4gICAgfVxuXG4gICAgcmV0dXJuICdkb20nO1xuICB9XG5cbiAgdmFyIF9fYXBpU3RydWN0ID0gW107XG4gIHZhciBfX2FycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbiAgdmFyIF90b1NldHRpbmdzID0gZnVuY3Rpb24gX3RvU2V0dGluZ3MobWl4ZWQpIHtcbiAgICB2YXIgaWR4LCBqcTtcbiAgICB2YXIgc2V0dGluZ3MgPSBEYXRhVGFibGUuc2V0dGluZ3M7XG4gICAgdmFyIHRhYmxlcyA9ICQubWFwKHNldHRpbmdzLCBmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgIHJldHVybiBlbC5uVGFibGU7XG4gICAgfSk7XG5cbiAgICBpZiAoIW1peGVkKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIGlmIChtaXhlZC5uVGFibGUgJiYgbWl4ZWQub0FwaSkge1xuICAgICAgcmV0dXJuIFttaXhlZF07XG4gICAgfSBlbHNlIGlmIChtaXhlZC5ub2RlTmFtZSAmJiBtaXhlZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAndGFibGUnKSB7XG4gICAgICBpZHggPSAkLmluQXJyYXkobWl4ZWQsIHRhYmxlcyk7XG4gICAgICByZXR1cm4gaWR4ICE9PSAtMSA/IFtzZXR0aW5nc1tpZHhdXSA6IG51bGw7XG4gICAgfSBlbHNlIGlmIChtaXhlZCAmJiB0eXBlb2YgbWl4ZWQuc2V0dGluZ3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBtaXhlZC5zZXR0aW5ncygpLnRvQXJyYXkoKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtaXhlZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGpxID0gJChtaXhlZCk7XG4gICAgfSBlbHNlIGlmIChtaXhlZCBpbnN0YW5jZW9mICQpIHtcbiAgICAgIGpxID0gbWl4ZWQ7XG4gICAgfVxuXG4gICAgaWYgKGpxKSB7XG4gICAgICByZXR1cm4ganEubWFwKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIGlkeCA9ICQuaW5BcnJheSh0aGlzLCB0YWJsZXMpO1xuICAgICAgICByZXR1cm4gaWR4ICE9PSAtMSA/IHNldHRpbmdzW2lkeF0gOiBudWxsO1xuICAgICAgfSkudG9BcnJheSgpO1xuICAgIH1cbiAgfTtcblxuICBfQXBpMiA9IGZ1bmN0aW9uIF9BcGkoY29udGV4dCwgZGF0YSkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfQXBpMikpIHtcbiAgICAgIHJldHVybiBuZXcgX0FwaTIoY29udGV4dCwgZGF0YSk7XG4gICAgfVxuXG4gICAgdmFyIHNldHRpbmdzID0gW107XG5cbiAgICB2YXIgY3R4U2V0dGluZ3MgPSBmdW5jdGlvbiBjdHhTZXR0aW5ncyhvKSB7XG4gICAgICB2YXIgYSA9IF90b1NldHRpbmdzKG8pO1xuXG4gICAgICBpZiAoYSkge1xuICAgICAgICBzZXR0aW5ncyA9IHNldHRpbmdzLmNvbmNhdChhKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCQuaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGNvbnRleHQubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgY3R4U2V0dGluZ3MoY29udGV4dFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eFNldHRpbmdzKGNvbnRleHQpO1xuICAgIH1cblxuICAgIHRoaXMuY29udGV4dCA9IF91bmlxdWUoc2V0dGluZ3MpO1xuXG4gICAgaWYgKGRhdGEpIHtcbiAgICAgICQubWVyZ2UodGhpcywgZGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RvciA9IHtcbiAgICAgIHJvd3M6IG51bGwsXG4gICAgICBjb2xzOiBudWxsLFxuICAgICAgb3B0czogbnVsbFxuICAgIH07XG5cbiAgICBfQXBpMi5leHRlbmQodGhpcywgdGhpcywgX19hcGlTdHJ1Y3QpO1xuICB9O1xuXG4gIERhdGFUYWJsZS5BcGkgPSBfQXBpMjtcbiAgJC5leHRlbmQoX0FwaTIucHJvdG90eXBlLCB7XG4gICAgYW55OiBmdW5jdGlvbiBhbnkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb3VudCgpICE9PSAwO1xuICAgIH0sXG4gICAgY29uY2F0OiBfX2FycmF5UHJvdG8uY29uY2F0LFxuICAgIGNvbnRleHQ6IFtdLFxuICAgIGNvdW50OiBmdW5jdGlvbiBjb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZsYXR0ZW4oKS5sZW5ndGg7XG4gICAgfSxcbiAgICBlYWNoOiBmdW5jdGlvbiBlYWNoKGZuKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gdGhpcy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBmbi5jYWxsKHRoaXMsIHRoaXNbaV0sIGksIHRoaXMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGVxOiBmdW5jdGlvbiBlcShpZHgpIHtcbiAgICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG4gICAgICByZXR1cm4gY3R4Lmxlbmd0aCA+IGlkeCA/IG5ldyBfQXBpMihjdHhbaWR4XSwgdGhpc1tpZHhdKSA6IG51bGw7XG4gICAgfSxcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uIGZpbHRlcihmbikge1xuICAgICAgdmFyIGEgPSBbXTtcblxuICAgICAgaWYgKF9fYXJyYXlQcm90by5maWx0ZXIpIHtcbiAgICAgICAgYSA9IF9fYXJyYXlQcm90by5maWx0ZXIuY2FsbCh0aGlzLCBmbiwgdGhpcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gdGhpcy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgIGlmIChmbi5jYWxsKHRoaXMsIHRoaXNbaV0sIGksIHRoaXMpKSB7XG4gICAgICAgICAgICBhLnB1c2godGhpc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgX0FwaTIodGhpcy5jb250ZXh0LCBhKTtcbiAgICB9LFxuICAgIGZsYXR0ZW46IGZ1bmN0aW9uIGZsYXR0ZW4oKSB7XG4gICAgICB2YXIgYSA9IFtdO1xuICAgICAgcmV0dXJuIG5ldyBfQXBpMih0aGlzLmNvbnRleHQsIGEuY29uY2F0LmFwcGx5KGEsIHRoaXMudG9BcnJheSgpKSk7XG4gICAgfSxcbiAgICBqb2luOiBfX2FycmF5UHJvdG8uam9pbixcbiAgICBpbmRleE9mOiBfX2FycmF5UHJvdG8uaW5kZXhPZiB8fCBmdW5jdGlvbiAob2JqLCBzdGFydCkge1xuICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0IHx8IDAsIGllbiA9IHRoaXMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXNbaV0gPT09IG9iaikge1xuICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAtMTtcbiAgICB9LFxuICAgIGl0ZXJhdG9yOiBmdW5jdGlvbiBpdGVyYXRvcihmbGF0dGVuLCB0eXBlLCBmbiwgYWx3YXlzTmV3KSB7XG4gICAgICB2YXIgYSA9IFtdLFxuICAgICAgICAgIHJldCxcbiAgICAgICAgICBpLFxuICAgICAgICAgIGllbixcbiAgICAgICAgICBqLFxuICAgICAgICAgIGplbixcbiAgICAgICAgICBjb250ZXh0ID0gdGhpcy5jb250ZXh0LFxuICAgICAgICAgIHJvd3MsXG4gICAgICAgICAgaXRlbXMsXG4gICAgICAgICAgaXRlbSxcbiAgICAgICAgICBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3I7XG5cbiAgICAgIGlmICh0eXBlb2YgZmxhdHRlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgYWx3YXlzTmV3ID0gZm47XG4gICAgICAgIGZuID0gdHlwZTtcbiAgICAgICAgdHlwZSA9IGZsYXR0ZW47XG4gICAgICAgIGZsYXR0ZW4gPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMCwgaWVuID0gY29udGV4dC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICB2YXIgYXBpSW5zdCA9IG5ldyBfQXBpMihjb250ZXh0W2ldKTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ3RhYmxlJykge1xuICAgICAgICAgIHJldCA9IGZuLmNhbGwoYXBpSW5zdCwgY29udGV4dFtpXSwgaSk7XG5cbiAgICAgICAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGEucHVzaChyZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnY29sdW1ucycgfHwgdHlwZSA9PT0gJ3Jvd3MnKSB7XG4gICAgICAgICAgcmV0ID0gZm4uY2FsbChhcGlJbnN0LCBjb250ZXh0W2ldLCB0aGlzW2ldLCBpKTtcblxuICAgICAgICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYS5wdXNoKHJldCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdjb2x1bW4nIHx8IHR5cGUgPT09ICdjb2x1bW4tcm93cycgfHwgdHlwZSA9PT0gJ3JvdycgfHwgdHlwZSA9PT0gJ2NlbGwnKSB7XG4gICAgICAgICAgaXRlbXMgPSB0aGlzW2ldO1xuXG4gICAgICAgICAgaWYgKHR5cGUgPT09ICdjb2x1bW4tcm93cycpIHtcbiAgICAgICAgICAgIHJvd3MgPSBfc2VsZWN0b3Jfcm93X2luZGV4ZXMoY29udGV4dFtpXSwgc2VsZWN0b3Iub3B0cyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChqID0gMCwgamVuID0gaXRlbXMubGVuZ3RoOyBqIDwgamVuOyBqKyspIHtcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtc1tqXTtcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdjZWxsJykge1xuICAgICAgICAgICAgICByZXQgPSBmbi5jYWxsKGFwaUluc3QsIGNvbnRleHRbaV0sIGl0ZW0ucm93LCBpdGVtLmNvbHVtbiwgaSwgaik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXQgPSBmbi5jYWxsKGFwaUluc3QsIGNvbnRleHRbaV0sIGl0ZW0sIGksIGosIHJvd3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgYS5wdXNoKHJldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChhLmxlbmd0aCB8fCBhbHdheXNOZXcpIHtcbiAgICAgICAgdmFyIGFwaSA9IG5ldyBfQXBpMihjb250ZXh0LCBmbGF0dGVuID8gYS5jb25jYXQuYXBwbHkoW10sIGEpIDogYSk7XG4gICAgICAgIHZhciBhcGlTZWxlY3RvciA9IGFwaS5zZWxlY3RvcjtcbiAgICAgICAgYXBpU2VsZWN0b3Iucm93cyA9IHNlbGVjdG9yLnJvd3M7XG4gICAgICAgIGFwaVNlbGVjdG9yLmNvbHMgPSBzZWxlY3Rvci5jb2xzO1xuICAgICAgICBhcGlTZWxlY3Rvci5vcHRzID0gc2VsZWN0b3Iub3B0cztcbiAgICAgICAgcmV0dXJuIGFwaTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBsYXN0SW5kZXhPZjogX19hcnJheVByb3RvLmxhc3RJbmRleE9mIHx8IGZ1bmN0aW9uIChvYmosIHN0YXJ0KSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmRleE9mLmFwcGx5KHRoaXMudG9BcnJheS5yZXZlcnNlKCksIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBsZW5ndGg6IDAsXG4gICAgbWFwOiBmdW5jdGlvbiBtYXAoZm4pIHtcbiAgICAgIHZhciBhID0gW107XG5cbiAgICAgIGlmIChfX2FycmF5UHJvdG8ubWFwKSB7XG4gICAgICAgIGEgPSBfX2FycmF5UHJvdG8ubWFwLmNhbGwodGhpcywgZm4sIHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IHRoaXMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICBhLnB1c2goZm4uY2FsbCh0aGlzLCB0aGlzW2ldLCBpKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBfQXBpMih0aGlzLmNvbnRleHQsIGEpO1xuICAgIH0sXG4gICAgcGx1Y2s6IGZ1bmN0aW9uIHBsdWNrKHByb3ApIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIGVsW3Byb3BdO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBwb3A6IF9fYXJyYXlQcm90by5wb3AsXG4gICAgcHVzaDogX19hcnJheVByb3RvLnB1c2gsXG4gICAgcmVkdWNlOiBfX2FycmF5UHJvdG8ucmVkdWNlIHx8IGZ1bmN0aW9uIChmbiwgaW5pdCkge1xuICAgICAgcmV0dXJuIF9mblJlZHVjZSh0aGlzLCBmbiwgaW5pdCwgMCwgdGhpcy5sZW5ndGgsIDEpO1xuICAgIH0sXG4gICAgcmVkdWNlUmlnaHQ6IF9fYXJyYXlQcm90by5yZWR1Y2VSaWdodCB8fCBmdW5jdGlvbiAoZm4sIGluaXQpIHtcbiAgICAgIHJldHVybiBfZm5SZWR1Y2UodGhpcywgZm4sIGluaXQsIHRoaXMubGVuZ3RoIC0gMSwgLTEsIC0xKTtcbiAgICB9LFxuICAgIHJldmVyc2U6IF9fYXJyYXlQcm90by5yZXZlcnNlLFxuICAgIHNlbGVjdG9yOiBudWxsLFxuICAgIHNoaWZ0OiBfX2FycmF5UHJvdG8uc2hpZnQsXG4gICAgc2xpY2U6IGZ1bmN0aW9uIHNsaWNlKCkge1xuICAgICAgcmV0dXJuIG5ldyBfQXBpMih0aGlzLmNvbnRleHQsIHRoaXMpO1xuICAgIH0sXG4gICAgc29ydDogX19hcnJheVByb3RvLnNvcnQsXG4gICAgc3BsaWNlOiBfX2FycmF5UHJvdG8uc3BsaWNlLFxuICAgIHRvQXJyYXk6IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgICByZXR1cm4gX19hcnJheVByb3RvLnNsaWNlLmNhbGwodGhpcyk7XG4gICAgfSxcbiAgICB0byQ6IGZ1bmN0aW9uIHRvJCgpIHtcbiAgICAgIHJldHVybiAkKHRoaXMpO1xuICAgIH0sXG4gICAgdG9KUXVlcnk6IGZ1bmN0aW9uIHRvSlF1ZXJ5KCkge1xuICAgICAgcmV0dXJuICQodGhpcyk7XG4gICAgfSxcbiAgICB1bmlxdWU6IGZ1bmN0aW9uIHVuaXF1ZSgpIHtcbiAgICAgIHJldHVybiBuZXcgX0FwaTIodGhpcy5jb250ZXh0LCBfdW5pcXVlKHRoaXMpKTtcbiAgICB9LFxuICAgIHVuc2hpZnQ6IF9fYXJyYXlQcm90by51bnNoaWZ0XG4gIH0pO1xuXG4gIF9BcGkyLmV4dGVuZCA9IGZ1bmN0aW9uIChzY29wZSwgb2JqLCBleHQpIHtcbiAgICBpZiAoIWV4dC5sZW5ndGggfHwgIW9iaiB8fCAhKG9iaiBpbnN0YW5jZW9mIF9BcGkyKSAmJiAhb2JqLl9fZHRfd3JhcHBlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBpLFxuICAgICAgICBpZW4sXG4gICAgICAgIGosXG4gICAgICAgIGplbixcbiAgICAgICAgc3RydWN0LFxuICAgICAgICBpbm5lcixcbiAgICAgICAgbWV0aG9kU2NvcGluZyA9IGZ1bmN0aW9uIG1ldGhvZFNjb3Bpbmcoc2NvcGUsIGZuLCBzdHJ1Yykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJldCA9IGZuLmFwcGx5KHNjb3BlLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIF9BcGkyLmV4dGVuZChyZXQsIHJldCwgc3RydWMubWV0aG9kRXh0KTtcblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZm9yIChpID0gMCwgaWVuID0gZXh0Lmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBzdHJ1Y3QgPSBleHRbaV07XG4gICAgICBvYmpbc3RydWN0Lm5hbWVdID0gdHlwZW9mIHN0cnVjdC52YWwgPT09ICdmdW5jdGlvbicgPyBtZXRob2RTY29waW5nKHNjb3BlLCBzdHJ1Y3QudmFsLCBzdHJ1Y3QpIDogJC5pc1BsYWluT2JqZWN0KHN0cnVjdC52YWwpID8ge30gOiBzdHJ1Y3QudmFsO1xuICAgICAgb2JqW3N0cnVjdC5uYW1lXS5fX2R0X3dyYXBwZXIgPSB0cnVlO1xuXG4gICAgICBfQXBpMi5leHRlbmQoc2NvcGUsIG9ialtzdHJ1Y3QubmFtZV0sIHN0cnVjdC5wcm9wRXh0KTtcbiAgICB9XG4gIH07XG5cbiAgX0FwaTIucmVnaXN0ZXIgPSBfYXBpX3JlZ2lzdGVyID0gZnVuY3Rpb24gX2FwaV9yZWdpc3RlcihuYW1lLCB2YWwpIHtcbiAgICBpZiAoJC5pc0FycmF5KG5hbWUpKSB7XG4gICAgICBmb3IgKHZhciBqID0gMCwgamVuID0gbmFtZS5sZW5ndGg7IGogPCBqZW47IGorKykge1xuICAgICAgICBfQXBpMi5yZWdpc3RlcihuYW1lW2pdLCB2YWwpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGksXG4gICAgICAgIGllbixcbiAgICAgICAgaGVpciA9IG5hbWUuc3BsaXQoJy4nKSxcbiAgICAgICAgc3RydWN0ID0gX19hcGlTdHJ1Y3QsXG4gICAgICAgIGtleSxcbiAgICAgICAgbWV0aG9kO1xuXG4gICAgdmFyIGZpbmQgPSBmdW5jdGlvbiBmaW5kKHNyYywgbmFtZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IHNyYy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBpZiAoc3JjW2ldLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gc3JjW2ldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBmb3IgKGkgPSAwLCBpZW4gPSBoZWlyLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBtZXRob2QgPSBoZWlyW2ldLmluZGV4T2YoJygpJykgIT09IC0xO1xuICAgICAga2V5ID0gbWV0aG9kID8gaGVpcltpXS5yZXBsYWNlKCcoKScsICcnKSA6IGhlaXJbaV07XG4gICAgICB2YXIgc3JjID0gZmluZChzdHJ1Y3QsIGtleSk7XG5cbiAgICAgIGlmICghc3JjKSB7XG4gICAgICAgIHNyYyA9IHtcbiAgICAgICAgICBuYW1lOiBrZXksXG4gICAgICAgICAgdmFsOiB7fSxcbiAgICAgICAgICBtZXRob2RFeHQ6IFtdLFxuICAgICAgICAgIHByb3BFeHQ6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHN0cnVjdC5wdXNoKHNyYyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpID09PSBpZW4gLSAxKSB7XG4gICAgICAgIHNyYy52YWwgPSB2YWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHJ1Y3QgPSBtZXRob2QgPyBzcmMubWV0aG9kRXh0IDogc3JjLnByb3BFeHQ7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIF9BcGkyLnJlZ2lzdGVyUGx1cmFsID0gX2FwaV9yZWdpc3RlclBsdXJhbCA9IGZ1bmN0aW9uIF9hcGlfcmVnaXN0ZXJQbHVyYWwocGx1cmFsTmFtZSwgc2luZ3VsYXJOYW1lLCB2YWwpIHtcbiAgICBfQXBpMi5yZWdpc3RlcihwbHVyYWxOYW1lLCB2YWwpO1xuXG4gICAgX0FwaTIucmVnaXN0ZXIoc2luZ3VsYXJOYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmV0ID0gdmFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgIGlmIChyZXQgPT09IHRoaXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2UgaWYgKHJldCBpbnN0YW5jZW9mIF9BcGkyKSB7XG4gICAgICAgIHJldHVybiByZXQubGVuZ3RoID8gJC5pc0FycmF5KHJldFswXSkgPyBuZXcgX0FwaTIocmV0LmNvbnRleHQsIHJldFswXSkgOiByZXRbMF0gOiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIF9fdGFibGVfc2VsZWN0b3IgPSBmdW5jdGlvbiBfX3RhYmxlX3NlbGVjdG9yKHNlbGVjdG9yLCBhKSB7XG4gICAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBbYVtzZWxlY3Rvcl1dO1xuICAgIH1cblxuICAgIHZhciBub2RlcyA9ICQubWFwKGEsIGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgcmV0dXJuIGVsLm5UYWJsZTtcbiAgICB9KTtcbiAgICByZXR1cm4gJChub2RlcykuZmlsdGVyKHNlbGVjdG9yKS5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICAgIHZhciBpZHggPSAkLmluQXJyYXkodGhpcywgbm9kZXMpO1xuICAgICAgcmV0dXJuIGFbaWR4XTtcbiAgICB9KS50b0FycmF5KCk7XG4gIH07XG5cbiAgX2FwaV9yZWdpc3RlcigndGFibGVzKCknLCBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gc2VsZWN0b3IgPyBuZXcgX0FwaTIoX190YWJsZV9zZWxlY3RvcihzZWxlY3RvciwgdGhpcy5jb250ZXh0KSkgOiB0aGlzO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCd0YWJsZSgpJywgZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gICAgdmFyIHRhYmxlcyA9IHRoaXMudGFibGVzKHNlbGVjdG9yKTtcbiAgICB2YXIgY3R4ID0gdGFibGVzLmNvbnRleHQ7XG4gICAgcmV0dXJuIGN0eC5sZW5ndGggPyBuZXcgX0FwaTIoY3R4WzBdKSA6IHRhYmxlcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgndGFibGVzKCkubm9kZXMoKScsICd0YWJsZSgpLm5vZGUoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICByZXR1cm4gY3R4Lm5UYWJsZTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgndGFibGVzKCkuYm9keSgpJywgJ3RhYmxlKCkuYm9keSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIHJldHVybiBjdHgublRCb2R5O1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCd0YWJsZXMoKS5oZWFkZXIoKScsICd0YWJsZSgpLmhlYWRlcigpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIHJldHVybiBjdHgublRIZWFkO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCd0YWJsZXMoKS5mb290ZXIoKScsICd0YWJsZSgpLmZvb3RlcigpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIHJldHVybiBjdHgublRGb290O1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCd0YWJsZXMoKS5jb250YWluZXJzKCknLCAndGFibGUoKS5jb250YWluZXIoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICByZXR1cm4gY3R4Lm5UYWJsZVdyYXBwZXI7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2RyYXcoKScsIGZ1bmN0aW9uIChwYWdpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIGlmIChwYWdpbmcgPT09ICdwYWdlJykge1xuICAgICAgICBfZm5EcmF3KHNldHRpbmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGFnaW5nID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHBhZ2luZyA9IHBhZ2luZyA9PT0gJ2Z1bGwtaG9sZCcgPyBmYWxzZSA6IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBfZm5SZURyYXcoc2V0dGluZ3MsIHBhZ2luZyA9PT0gZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdwYWdlKCknLCBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgaWYgKGFjdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWdlLmluZm8oKS5wYWdlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgX2ZuUGFnZUNoYW5nZShzZXR0aW5ncywgYWN0aW9uKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcigncGFnZS5pbmZvKCknLCBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgaWYgKHRoaXMuY29udGV4dC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIHNldHRpbmdzID0gdGhpcy5jb250ZXh0WzBdLFxuICAgICAgICBzdGFydCA9IHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0LFxuICAgICAgICBsZW4gPSBzZXR0aW5ncy5vRmVhdHVyZXMuYlBhZ2luYXRlID8gc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoIDogLTEsXG4gICAgICAgIHZpc1JlY29yZHMgPSBzZXR0aW5ncy5mblJlY29yZHNEaXNwbGF5KCksXG4gICAgICAgIGFsbCA9IGxlbiA9PT0gLTE7XG4gICAgcmV0dXJuIHtcbiAgICAgIFwicGFnZVwiOiBhbGwgPyAwIDogTWF0aC5mbG9vcihzdGFydCAvIGxlbiksXG4gICAgICBcInBhZ2VzXCI6IGFsbCA/IDEgOiBNYXRoLmNlaWwodmlzUmVjb3JkcyAvIGxlbiksXG4gICAgICBcInN0YXJ0XCI6IHN0YXJ0LFxuICAgICAgXCJlbmRcIjogc2V0dGluZ3MuZm5EaXNwbGF5RW5kKCksXG4gICAgICBcImxlbmd0aFwiOiBsZW4sXG4gICAgICBcInJlY29yZHNUb3RhbFwiOiBzZXR0aW5ncy5mblJlY29yZHNUb3RhbCgpLFxuICAgICAgXCJyZWNvcmRzRGlzcGxheVwiOiB2aXNSZWNvcmRzLFxuICAgICAgXCJzZXJ2ZXJTaWRlXCI6IF9mbkRhdGFTb3VyY2Uoc2V0dGluZ3MpID09PSAnc3NwJ1xuICAgIH07XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3BhZ2UubGVuKCknLCBmdW5jdGlvbiAobGVuKSB7XG4gICAgaWYgKGxlbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0Lmxlbmd0aCAhPT0gMCA/IHRoaXMuY29udGV4dFswXS5faURpc3BsYXlMZW5ndGggOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBfZm5MZW5ndGhDaGFuZ2Uoc2V0dGluZ3MsIGxlbik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHZhciBfX3JlbG9hZCA9IGZ1bmN0aW9uIF9fcmVsb2FkKHNldHRpbmdzLCBob2xkUG9zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgYXBpID0gbmV3IF9BcGkyKHNldHRpbmdzKTtcbiAgICAgIGFwaS5vbmUoJ2RyYXcnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhbGxiYWNrKGFwaS5hamF4Lmpzb24oKSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoX2ZuRGF0YVNvdXJjZShzZXR0aW5ncykgPT0gJ3NzcCcpIHtcbiAgICAgIF9mblJlRHJhdyhzZXR0aW5ncywgaG9sZFBvc2l0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkoc2V0dGluZ3MsIHRydWUpO1xuXG4gICAgICB2YXIgeGhyID0gc2V0dGluZ3MuanFYSFI7XG5cbiAgICAgIGlmICh4aHIgJiYgeGhyLnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICB9XG5cbiAgICAgIF9mbkJ1aWxkQWpheChzZXR0aW5ncywgW10sIGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgIF9mbkNsZWFyVGFibGUoc2V0dGluZ3MpO1xuXG4gICAgICAgIHZhciBkYXRhID0gX2ZuQWpheERhdGFTcmMoc2V0dGluZ3MsIGpzb24pO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgX2ZuQWRkRGF0YShzZXR0aW5ncywgZGF0YVtpXSk7XG4gICAgICAgIH1cblxuICAgICAgICBfZm5SZURyYXcoc2V0dGluZ3MsIGhvbGRQb3NpdGlvbik7XG5cbiAgICAgICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkoc2V0dGluZ3MsIGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBfYXBpX3JlZ2lzdGVyKCdhamF4Lmpzb24oKScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKGN0eC5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gY3R4WzBdLmpzb247XG4gICAgfVxuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdhamF4LnBhcmFtcygpJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAoY3R4Lmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBjdHhbMF0ub0FqYXhEYXRhO1xuICAgIH1cbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignYWpheC5yZWxvYWQoKScsIGZ1bmN0aW9uIChjYWxsYmFjaywgcmVzZXRQYWdpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIF9fcmVsb2FkKHNldHRpbmdzLCByZXNldFBhZ2luZyA9PT0gZmFsc2UsIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignYWpheC51cmwoKScsIGZ1bmN0aW9uICh1cmwpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKHVybCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoY3R4Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBjdHggPSBjdHhbMF07XG4gICAgICByZXR1cm4gY3R4LmFqYXggPyAkLmlzUGxhaW5PYmplY3QoY3R4LmFqYXgpID8gY3R4LmFqYXgudXJsIDogY3R4LmFqYXggOiBjdHguc0FqYXhTb3VyY2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHNldHRpbmdzLmFqYXgpKSB7XG4gICAgICAgIHNldHRpbmdzLmFqYXgudXJsID0gdXJsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0dGluZ3MuYWpheCA9IHVybDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignYWpheC51cmwoKS5sb2FkKCknLCBmdW5jdGlvbiAoY2FsbGJhY2ssIHJlc2V0UGFnaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgX19yZWxvYWQoY3R4LCByZXNldFBhZ2luZyA9PT0gZmFsc2UsIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdmFyIF9zZWxlY3Rvcl9ydW4gPSBmdW5jdGlvbiBfc2VsZWN0b3JfcnVuKHR5cGUsIHNlbGVjdG9yLCBzZWxlY3RGbiwgc2V0dGluZ3MsIG9wdHMpIHtcbiAgICB2YXIgb3V0ID0gW10sXG4gICAgICAgIHJlcyxcbiAgICAgICAgYSxcbiAgICAgICAgaSxcbiAgICAgICAgaWVuLFxuICAgICAgICBqLFxuICAgICAgICBqZW4sXG4gICAgICAgIHNlbGVjdG9yVHlwZSA9IF90eXBlb2Yoc2VsZWN0b3IpO1xuXG4gICAgaWYgKCFzZWxlY3RvciB8fCBzZWxlY3RvclR5cGUgPT09ICdzdHJpbmcnIHx8IHNlbGVjdG9yVHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCBzZWxlY3Rvci5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgc2VsZWN0b3IgPSBbc2VsZWN0b3JdO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGllbiA9IHNlbGVjdG9yLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBhID0gc2VsZWN0b3JbaV0gJiYgc2VsZWN0b3JbaV0uc3BsaXQgJiYgIXNlbGVjdG9yW2ldLm1hdGNoKC9bXFxbXFwoOl0vKSA/IHNlbGVjdG9yW2ldLnNwbGl0KCcsJykgOiBbc2VsZWN0b3JbaV1dO1xuXG4gICAgICBmb3IgKGogPSAwLCBqZW4gPSBhLmxlbmd0aDsgaiA8IGplbjsgaisrKSB7XG4gICAgICAgIHJlcyA9IHNlbGVjdEZuKHR5cGVvZiBhW2pdID09PSAnc3RyaW5nJyA/ICQudHJpbShhW2pdKSA6IGFbal0pO1xuXG4gICAgICAgIGlmIChyZXMgJiYgcmVzLmxlbmd0aCkge1xuICAgICAgICAgIG91dCA9IG91dC5jb25jYXQocmVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBleHQgPSBfZXh0LnNlbGVjdG9yW3R5cGVdO1xuXG4gICAgaWYgKGV4dC5sZW5ndGgpIHtcbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IGV4dC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBvdXQgPSBleHRbaV0oc2V0dGluZ3MsIG9wdHMsIG91dCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF91bmlxdWUob3V0KTtcbiAgfTtcblxuICB2YXIgX3NlbGVjdG9yX29wdHMgPSBmdW5jdGlvbiBfc2VsZWN0b3Jfb3B0cyhvcHRzKSB7XG4gICAgaWYgKCFvcHRzKSB7XG4gICAgICBvcHRzID0ge307XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuZmlsdGVyICYmIG9wdHMuc2VhcmNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdHMuc2VhcmNoID0gb3B0cy5maWx0ZXI7XG4gICAgfVxuXG4gICAgcmV0dXJuICQuZXh0ZW5kKHtcbiAgICAgIHNlYXJjaDogJ25vbmUnLFxuICAgICAgb3JkZXI6ICdjdXJyZW50JyxcbiAgICAgIHBhZ2U6ICdhbGwnXG4gICAgfSwgb3B0cyk7XG4gIH07XG5cbiAgdmFyIF9zZWxlY3Rvcl9maXJzdCA9IGZ1bmN0aW9uIF9zZWxlY3Rvcl9maXJzdChpbnN0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGluc3QubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIGlmIChpbnN0W2ldLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5zdFswXSA9IGluc3RbaV07XG4gICAgICAgIGluc3RbMF0ubGVuZ3RoID0gMTtcbiAgICAgICAgaW5zdC5sZW5ndGggPSAxO1xuICAgICAgICBpbnN0LmNvbnRleHQgPSBbaW5zdC5jb250ZXh0W2ldXTtcbiAgICAgICAgcmV0dXJuIGluc3Q7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5zdC5sZW5ndGggPSAwO1xuICAgIHJldHVybiBpbnN0O1xuICB9O1xuXG4gIHZhciBfc2VsZWN0b3Jfcm93X2luZGV4ZXMgPSBmdW5jdGlvbiBfc2VsZWN0b3Jfcm93X2luZGV4ZXMoc2V0dGluZ3MsIG9wdHMpIHtcbiAgICB2YXIgaSxcbiAgICAgICAgaWVuLFxuICAgICAgICB0bXAsXG4gICAgICAgIGEgPSBbXSxcbiAgICAgICAgZGlzcGxheUZpbHRlcmVkID0gc2V0dGluZ3MuYWlEaXNwbGF5LFxuICAgICAgICBkaXNwbGF5TWFzdGVyID0gc2V0dGluZ3MuYWlEaXNwbGF5TWFzdGVyO1xuICAgIHZhciBzZWFyY2ggPSBvcHRzLnNlYXJjaCxcbiAgICAgICAgb3JkZXIgPSBvcHRzLm9yZGVyLFxuICAgICAgICBwYWdlID0gb3B0cy5wYWdlO1xuXG4gICAgaWYgKF9mbkRhdGFTb3VyY2Uoc2V0dGluZ3MpID09ICdzc3AnKSB7XG4gICAgICByZXR1cm4gc2VhcmNoID09PSAncmVtb3ZlZCcgPyBbXSA6IF9yYW5nZSgwLCBkaXNwbGF5TWFzdGVyLmxlbmd0aCk7XG4gICAgfSBlbHNlIGlmIChwYWdlID09ICdjdXJyZW50Jykge1xuICAgICAgZm9yIChpID0gc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQsIGllbiA9IHNldHRpbmdzLmZuRGlzcGxheUVuZCgpOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgYS5wdXNoKGRpc3BsYXlGaWx0ZXJlZFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmRlciA9PSAnY3VycmVudCcgfHwgb3JkZXIgPT0gJ2FwcGxpZWQnKSB7XG4gICAgICBpZiAoc2VhcmNoID09ICdub25lJykge1xuICAgICAgICBhID0gZGlzcGxheU1hc3Rlci5zbGljZSgpO1xuICAgICAgfSBlbHNlIGlmIChzZWFyY2ggPT0gJ2FwcGxpZWQnKSB7XG4gICAgICAgIGEgPSBkaXNwbGF5RmlsdGVyZWQuc2xpY2UoKTtcbiAgICAgIH0gZWxzZSBpZiAoc2VhcmNoID09ICdyZW1vdmVkJykge1xuICAgICAgICB2YXIgZGlzcGxheUZpbHRlcmVkTWFwID0ge307XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGRpc3BsYXlGaWx0ZXJlZC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgIGRpc3BsYXlGaWx0ZXJlZE1hcFtkaXNwbGF5RmlsdGVyZWRbaV1dID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGEgPSAkLm1hcChkaXNwbGF5TWFzdGVyLCBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICByZXR1cm4gIWRpc3BsYXlGaWx0ZXJlZE1hcC5oYXNPd25Qcm9wZXJ0eShlbCkgPyBlbCA6IG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3JkZXIgPT0gJ2luZGV4JyB8fCBvcmRlciA9PSAnb3JpZ2luYWwnKSB7XG4gICAgICBmb3IgKGkgPSAwLCBpZW4gPSBzZXR0aW5ncy5hb0RhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgaWYgKHNlYXJjaCA9PSAnbm9uZScpIHtcbiAgICAgICAgICBhLnB1c2goaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG1wID0gJC5pbkFycmF5KGksIGRpc3BsYXlGaWx0ZXJlZCk7XG5cbiAgICAgICAgICBpZiAodG1wID09PSAtMSAmJiBzZWFyY2ggPT0gJ3JlbW92ZWQnIHx8IHRtcCA+PSAwICYmIHNlYXJjaCA9PSAnYXBwbGllZCcpIHtcbiAgICAgICAgICAgIGEucHVzaChpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYTtcbiAgfTtcblxuICB2YXIgX19yb3dfc2VsZWN0b3IgPSBmdW5jdGlvbiBfX3Jvd19zZWxlY3RvcihzZXR0aW5ncywgc2VsZWN0b3IsIG9wdHMpIHtcbiAgICB2YXIgcm93cztcblxuICAgIHZhciBydW4gPSBmdW5jdGlvbiBydW4oc2VsKSB7XG4gICAgICB2YXIgc2VsSW50ID0gX2ludFZhbChzZWwpO1xuXG4gICAgICB2YXIgaSwgaWVuO1xuICAgICAgdmFyIGFvRGF0YSA9IHNldHRpbmdzLmFvRGF0YTtcblxuICAgICAgaWYgKHNlbEludCAhPT0gbnVsbCAmJiAhb3B0cykge1xuICAgICAgICByZXR1cm4gW3NlbEludF07XG4gICAgICB9XG5cbiAgICAgIGlmICghcm93cykge1xuICAgICAgICByb3dzID0gX3NlbGVjdG9yX3Jvd19pbmRleGVzKHNldHRpbmdzLCBvcHRzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbEludCAhPT0gbnVsbCAmJiAkLmluQXJyYXkoc2VsSW50LCByb3dzKSAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIFtzZWxJbnRdO1xuICAgICAgfSBlbHNlIGlmIChzZWwgPT09IG51bGwgfHwgc2VsID09PSB1bmRlZmluZWQgfHwgc2VsID09PSAnJykge1xuICAgICAgICByZXR1cm4gcm93cztcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBzZWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuICQubWFwKHJvd3MsIGZ1bmN0aW9uIChpZHgpIHtcbiAgICAgICAgICB2YXIgcm93ID0gYW9EYXRhW2lkeF07XG4gICAgICAgICAgcmV0dXJuIHNlbChpZHgsIHJvdy5fYURhdGEsIHJvdy5uVHIpID8gaWR4IDogbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWwubm9kZU5hbWUpIHtcbiAgICAgICAgdmFyIHJvd0lkeCA9IHNlbC5fRFRfUm93SW5kZXg7XG4gICAgICAgIHZhciBjZWxsSWR4ID0gc2VsLl9EVF9DZWxsSW5kZXg7XG5cbiAgICAgICAgaWYgKHJvd0lkeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIGFvRGF0YVtyb3dJZHhdICYmIGFvRGF0YVtyb3dJZHhdLm5UciA9PT0gc2VsID8gW3Jvd0lkeF0gOiBbXTtcbiAgICAgICAgfSBlbHNlIGlmIChjZWxsSWR4KSB7XG4gICAgICAgICAgcmV0dXJuIGFvRGF0YVtjZWxsSWR4LnJvd10gJiYgYW9EYXRhW2NlbGxJZHgucm93XS5uVHIgPT09IHNlbCA/IFtjZWxsSWR4LnJvd10gOiBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgaG9zdCA9ICQoc2VsKS5jbG9zZXN0KCcqW2RhdGEtZHQtcm93XScpO1xuICAgICAgICAgIHJldHVybiBob3N0Lmxlbmd0aCA/IFtob3N0LmRhdGEoJ2R0LXJvdycpXSA6IFtdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygc2VsID09PSAnc3RyaW5nJyAmJiBzZWwuY2hhckF0KDApID09PSAnIycpIHtcbiAgICAgICAgdmFyIHJvd09iaiA9IHNldHRpbmdzLmFJZHNbc2VsLnJlcGxhY2UoL14jLywgJycpXTtcblxuICAgICAgICBpZiAocm93T2JqICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gW3Jvd09iai5pZHhdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBub2RlcyA9IF9yZW1vdmVFbXB0eShfcGx1Y2tfb3JkZXIoc2V0dGluZ3MuYW9EYXRhLCByb3dzLCAnblRyJykpO1xuXG4gICAgICByZXR1cm4gJChub2RlcykuZmlsdGVyKHNlbCkubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0RUX1Jvd0luZGV4O1xuICAgICAgfSkudG9BcnJheSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gX3NlbGVjdG9yX3J1bigncm93Jywgc2VsZWN0b3IsIHJ1biwgc2V0dGluZ3MsIG9wdHMpO1xuICB9O1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3Jvd3MoKScsIGZ1bmN0aW9uIChzZWxlY3Rvciwgb3B0cykge1xuICAgIGlmIChzZWxlY3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzZWxlY3RvciA9ICcnO1xuICAgIH0gZWxzZSBpZiAoJC5pc1BsYWluT2JqZWN0KHNlbGVjdG9yKSkge1xuICAgICAgb3B0cyA9IHNlbGVjdG9yO1xuICAgICAgc2VsZWN0b3IgPSAnJztcbiAgICB9XG5cbiAgICBvcHRzID0gX3NlbGVjdG9yX29wdHMob3B0cyk7XG4gICAgdmFyIGluc3QgPSB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgcmV0dXJuIF9fcm93X3NlbGVjdG9yKHNldHRpbmdzLCBzZWxlY3Rvciwgb3B0cyk7XG4gICAgfSwgMSk7XG4gICAgaW5zdC5zZWxlY3Rvci5yb3dzID0gc2VsZWN0b3I7XG4gICAgaW5zdC5zZWxlY3Rvci5vcHRzID0gb3B0cztcbiAgICByZXR1cm4gaW5zdDtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcigncm93cygpLm5vZGVzKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3JvdycsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93KSB7XG4gICAgICByZXR1cm4gc2V0dGluZ3MuYW9EYXRhW3Jvd10ublRyIHx8IHVuZGVmaW5lZDtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcigncm93cygpLmRhdGEoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcih0cnVlLCAncm93cycsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93cykge1xuICAgICAgcmV0dXJuIF9wbHVja19vcmRlcihzZXR0aW5ncy5hb0RhdGEsIHJvd3MsICdfYURhdGEnKTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgncm93cygpLmNhY2hlKCknLCAncm93KCkuY2FjaGUoKScsIGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3JvdycsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93KSB7XG4gICAgICB2YXIgciA9IHNldHRpbmdzLmFvRGF0YVtyb3ddO1xuICAgICAgcmV0dXJuIHR5cGUgPT09ICdzZWFyY2gnID8gci5fYUZpbHRlckRhdGEgOiByLl9hU29ydERhdGE7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ3Jvd3MoKS5pbnZhbGlkYXRlKCknLCAncm93KCkuaW52YWxpZGF0ZSgpJywgZnVuY3Rpb24gKHNyYykge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdyb3cnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIHJvdykge1xuICAgICAgX2ZuSW52YWxpZGF0ZShzZXR0aW5ncywgcm93LCBzcmMpO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdyb3dzKCkuaW5kZXhlcygpJywgJ3JvdygpLmluZGV4KCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3JvdycsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93KSB7XG4gICAgICByZXR1cm4gcm93O1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdyb3dzKCkuaWRzKCknLCAncm93KCkuaWQoKScsIGZ1bmN0aW9uIChoYXNoKSB7XG4gICAgdmFyIGEgPSBbXTtcbiAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udGV4dDtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBjb250ZXh0Lmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMCwgamVuID0gdGhpc1tpXS5sZW5ndGg7IGogPCBqZW47IGorKykge1xuICAgICAgICB2YXIgaWQgPSBjb250ZXh0W2ldLnJvd0lkRm4oY29udGV4dFtpXS5hb0RhdGFbdGhpc1tpXVtqXV0uX2FEYXRhKTtcbiAgICAgICAgYS5wdXNoKChoYXNoID09PSB0cnVlID8gJyMnIDogJycpICsgaWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgX0FwaTIoY29udGV4dCwgYSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ3Jvd3MoKS5yZW1vdmUoKScsICdyb3coKS5yZW1vdmUoKScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5pdGVyYXRvcigncm93JywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3csIHRoYXRJZHgpIHtcbiAgICAgIHZhciBkYXRhID0gc2V0dGluZ3MuYW9EYXRhO1xuICAgICAgdmFyIHJvd0RhdGEgPSBkYXRhW3Jvd107XG4gICAgICB2YXIgaSwgaWVuLCBqLCBqZW47XG4gICAgICB2YXIgbG9vcFJvdywgbG9vcENlbGxzO1xuICAgICAgZGF0YS5zcGxpY2Uocm93LCAxKTtcblxuICAgICAgZm9yIChpID0gMCwgaWVuID0gZGF0YS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBsb29wUm93ID0gZGF0YVtpXTtcbiAgICAgICAgbG9vcENlbGxzID0gbG9vcFJvdy5hbkNlbGxzO1xuXG4gICAgICAgIGlmIChsb29wUm93Lm5UciAhPT0gbnVsbCkge1xuICAgICAgICAgIGxvb3BSb3cublRyLl9EVF9Sb3dJbmRleCA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobG9vcENlbGxzICE9PSBudWxsKSB7XG4gICAgICAgICAgZm9yIChqID0gMCwgamVuID0gbG9vcENlbGxzLmxlbmd0aDsgaiA8IGplbjsgaisrKSB7XG4gICAgICAgICAgICBsb29wQ2VsbHNbal0uX0RUX0NlbGxJbmRleC5yb3cgPSBpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfZm5EZWxldGVJbmRleChzZXR0aW5ncy5haURpc3BsYXlNYXN0ZXIsIHJvdyk7XG5cbiAgICAgIF9mbkRlbGV0ZUluZGV4KHNldHRpbmdzLmFpRGlzcGxheSwgcm93KTtcblxuICAgICAgX2ZuRGVsZXRlSW5kZXgodGhhdFt0aGF0SWR4XSwgcm93LCBmYWxzZSk7XG5cbiAgICAgIGlmIChzZXR0aW5ncy5faVJlY29yZHNEaXNwbGF5ID4gMCkge1xuICAgICAgICBzZXR0aW5ncy5faVJlY29yZHNEaXNwbGF5LS07XG4gICAgICB9XG5cbiAgICAgIF9mbkxlbmd0aE92ZXJmbG93KHNldHRpbmdzKTtcblxuICAgICAgdmFyIGlkID0gc2V0dGluZ3Mucm93SWRGbihyb3dEYXRhLl9hRGF0YSk7XG5cbiAgICAgIGlmIChpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRlbGV0ZSBzZXR0aW5ncy5hSWRzW2lkXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IHNldHRpbmdzLmFvRGF0YS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBzZXR0aW5ncy5hb0RhdGFbaV0uaWR4ID0gaTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcigncm93cy5hZGQoKScsIGZ1bmN0aW9uIChyb3dzKSB7XG4gICAgdmFyIG5ld1Jvd3MgPSB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgdmFyIHJvdywgaSwgaWVuO1xuICAgICAgdmFyIG91dCA9IFtdO1xuXG4gICAgICBmb3IgKGkgPSAwLCBpZW4gPSByb3dzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIHJvdyA9IHJvd3NbaV07XG5cbiAgICAgICAgaWYgKHJvdy5ub2RlTmFtZSAmJiByb3cubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1RSJykge1xuICAgICAgICAgIG91dC5wdXNoKF9mbkFkZFRyKHNldHRpbmdzLCByb3cpWzBdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQucHVzaChfZm5BZGREYXRhKHNldHRpbmdzLCByb3cpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0O1xuICAgIH0sIDEpO1xuICAgIHZhciBtb2RSb3dzID0gdGhpcy5yb3dzKC0xKTtcbiAgICBtb2RSb3dzLnBvcCgpO1xuICAgICQubWVyZ2UobW9kUm93cywgbmV3Um93cyk7XG4gICAgcmV0dXJuIG1vZFJvd3M7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3JvdygpJywgZnVuY3Rpb24gKHNlbGVjdG9yLCBvcHRzKSB7XG4gICAgcmV0dXJuIF9zZWxlY3Rvcl9maXJzdCh0aGlzLnJvd3Moc2VsZWN0b3IsIG9wdHMpKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcigncm93KCkuZGF0YSgpJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGN0eC5sZW5ndGggJiYgdGhpcy5sZW5ndGggPyBjdHhbMF0uYW9EYXRhW3RoaXNbMF1dLl9hRGF0YSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgcm93ID0gY3R4WzBdLmFvRGF0YVt0aGlzWzBdXTtcbiAgICByb3cuX2FEYXRhID0gZGF0YTtcblxuICAgIGlmICgkLmlzQXJyYXkoZGF0YSkgJiYgcm93Lm5Uci5pZCkge1xuICAgICAgX2ZuU2V0T2JqZWN0RGF0YUZuKGN0eFswXS5yb3dJZCkoZGF0YSwgcm93Lm5Uci5pZCk7XG4gICAgfVxuXG4gICAgX2ZuSW52YWxpZGF0ZShjdHhbMF0sIHRoaXNbMF0sICdkYXRhJyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcigncm93KCkubm9kZSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG4gICAgcmV0dXJuIGN0eC5sZW5ndGggJiYgdGhpcy5sZW5ndGggPyBjdHhbMF0uYW9EYXRhW3RoaXNbMF1dLm5UciB8fCBudWxsIDogbnVsbDtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcigncm93LmFkZCgpJywgZnVuY3Rpb24gKHJvdykge1xuICAgIGlmIChyb3cgaW5zdGFuY2VvZiAkICYmIHJvdy5sZW5ndGgpIHtcbiAgICAgIHJvdyA9IHJvd1swXTtcbiAgICB9XG5cbiAgICB2YXIgcm93cyA9IHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBpZiAocm93Lm5vZGVOYW1lICYmIHJvdy5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09PSAnVFInKSB7XG4gICAgICAgIHJldHVybiBfZm5BZGRUcihzZXR0aW5ncywgcm93KVswXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9mbkFkZERhdGEoc2V0dGluZ3MsIHJvdyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMucm93KHJvd3NbMF0pO1xuICB9KTtcblxuICB2YXIgX19kZXRhaWxzX2FkZCA9IGZ1bmN0aW9uIF9fZGV0YWlsc19hZGQoY3R4LCByb3csIGRhdGEsIGtsYXNzKSB7XG4gICAgdmFyIHJvd3MgPSBbXTtcblxuICAgIHZhciBhZGRSb3cgPSBmdW5jdGlvbiBhZGRSb3cociwgaykge1xuICAgICAgaWYgKCQuaXNBcnJheShyKSB8fCByIGluc3RhbmNlb2YgJCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gci5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgIGFkZFJvdyhyW2ldLCBrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHIubm9kZU5hbWUgJiYgci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAndHInKSB7XG4gICAgICAgIHJvd3MucHVzaChyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjcmVhdGVkID0gJCgnPHRyPjx0ZC8+PC90cj4nKS5hZGRDbGFzcyhrKTtcbiAgICAgICAgJCgndGQnLCBjcmVhdGVkKS5hZGRDbGFzcyhrKS5odG1sKHIpWzBdLmNvbFNwYW4gPSBfZm5WaXNibGVDb2x1bW5zKGN0eCk7XG4gICAgICAgIHJvd3MucHVzaChjcmVhdGVkWzBdKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYWRkUm93KGRhdGEsIGtsYXNzKTtcblxuICAgIGlmIChyb3cuX2RldGFpbHMpIHtcbiAgICAgIHJvdy5fZGV0YWlscy5kZXRhY2goKTtcbiAgICB9XG5cbiAgICByb3cuX2RldGFpbHMgPSAkKHJvd3MpO1xuXG4gICAgaWYgKHJvdy5fZGV0YWlsc1Nob3cpIHtcbiAgICAgIHJvdy5fZGV0YWlscy5pbnNlcnRBZnRlcihyb3cublRyKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9fZGV0YWlsc19yZW1vdmUgPSBmdW5jdGlvbiBfX2RldGFpbHNfcmVtb3ZlKGFwaSwgaWR4KSB7XG4gICAgdmFyIGN0eCA9IGFwaS5jb250ZXh0O1xuXG4gICAgaWYgKGN0eC5sZW5ndGgpIHtcbiAgICAgIHZhciByb3cgPSBjdHhbMF0uYW9EYXRhW2lkeCAhPT0gdW5kZWZpbmVkID8gaWR4IDogYXBpWzBdXTtcblxuICAgICAgaWYgKHJvdyAmJiByb3cuX2RldGFpbHMpIHtcbiAgICAgICAgcm93Ll9kZXRhaWxzLnJlbW92ZSgpO1xuXG4gICAgICAgIHJvdy5fZGV0YWlsc1Nob3cgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJvdy5fZGV0YWlscyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIF9fZGV0YWlsc19kaXNwbGF5ID0gZnVuY3Rpb24gX19kZXRhaWxzX2Rpc3BsYXkoYXBpLCBzaG93KSB7XG4gICAgdmFyIGN0eCA9IGFwaS5jb250ZXh0O1xuXG4gICAgaWYgKGN0eC5sZW5ndGggJiYgYXBpLmxlbmd0aCkge1xuICAgICAgdmFyIHJvdyA9IGN0eFswXS5hb0RhdGFbYXBpWzBdXTtcblxuICAgICAgaWYgKHJvdy5fZGV0YWlscykge1xuICAgICAgICByb3cuX2RldGFpbHNTaG93ID0gc2hvdztcblxuICAgICAgICBpZiAoc2hvdykge1xuICAgICAgICAgIHJvdy5fZGV0YWlscy5pbnNlcnRBZnRlcihyb3cublRyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByb3cuX2RldGFpbHMuZGV0YWNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBfX2RldGFpbHNfZXZlbnRzKGN0eFswXSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHZhciBfX2RldGFpbHNfZXZlbnRzID0gZnVuY3Rpb24gX19kZXRhaWxzX2V2ZW50cyhzZXR0aW5ncykge1xuICAgIHZhciBhcGkgPSBuZXcgX0FwaTIoc2V0dGluZ3MpO1xuICAgIHZhciBuYW1lc3BhY2UgPSAnLmR0LkRUX2RldGFpbHMnO1xuICAgIHZhciBkcmF3RXZlbnQgPSAnZHJhdycgKyBuYW1lc3BhY2U7XG4gICAgdmFyIGNvbHZpc0V2ZW50ID0gJ2NvbHVtbi12aXNpYmlsaXR5JyArIG5hbWVzcGFjZTtcbiAgICB2YXIgZGVzdHJveUV2ZW50ID0gJ2Rlc3Ryb3knICsgbmFtZXNwYWNlO1xuICAgIHZhciBkYXRhID0gc2V0dGluZ3MuYW9EYXRhO1xuICAgIGFwaS5vZmYoZHJhd0V2ZW50ICsgJyAnICsgY29sdmlzRXZlbnQgKyAnICcgKyBkZXN0cm95RXZlbnQpO1xuXG4gICAgaWYgKF9wbHVjayhkYXRhLCAnX2RldGFpbHMnKS5sZW5ndGggPiAwKSB7XG4gICAgICBhcGkub24oZHJhd0V2ZW50LCBmdW5jdGlvbiAoZSwgY3R4KSB7XG4gICAgICAgIGlmIChzZXR0aW5ncyAhPT0gY3R4KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBpLnJvd3Moe1xuICAgICAgICAgIHBhZ2U6ICdjdXJyZW50J1xuICAgICAgICB9KS5lcSgwKS5lYWNoKGZ1bmN0aW9uIChpZHgpIHtcbiAgICAgICAgICB2YXIgcm93ID0gZGF0YVtpZHhdO1xuXG4gICAgICAgICAgaWYgKHJvdy5fZGV0YWlsc1Nob3cpIHtcbiAgICAgICAgICAgIHJvdy5fZGV0YWlscy5pbnNlcnRBZnRlcihyb3cublRyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBhcGkub24oY29sdmlzRXZlbnQsIGZ1bmN0aW9uIChlLCBjdHgsIGlkeCwgdmlzKSB7XG4gICAgICAgIGlmIChzZXR0aW5ncyAhPT0gY3R4KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJvdyxcbiAgICAgICAgICAgIHZpc2libGUgPSBfZm5WaXNibGVDb2x1bW5zKGN0eCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGRhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICByb3cgPSBkYXRhW2ldO1xuXG4gICAgICAgICAgaWYgKHJvdy5fZGV0YWlscykge1xuICAgICAgICAgICAgcm93Ll9kZXRhaWxzLmNoaWxkcmVuKCd0ZFtjb2xzcGFuXScpLmF0dHIoJ2NvbHNwYW4nLCB2aXNpYmxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXBpLm9uKGRlc3Ryb3lFdmVudCwgZnVuY3Rpb24gKGUsIGN0eCkge1xuICAgICAgICBpZiAoc2V0dGluZ3MgIT09IGN0eCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRhdGFbaV0uX2RldGFpbHMpIHtcbiAgICAgICAgICAgIF9fZGV0YWlsc19yZW1vdmUoYXBpLCBpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX2VtcCA9ICcnO1xuXG4gIHZhciBfY2hpbGRfb2JqID0gX2VtcCArICdyb3coKS5jaGlsZCc7XG5cbiAgdmFyIF9jaGlsZF9tdGggPSBfY2hpbGRfb2JqICsgJygpJztcblxuICBfYXBpX3JlZ2lzdGVyKF9jaGlsZF9tdGgsIGZ1bmN0aW9uIChkYXRhLCBrbGFzcykge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gY3R4Lmxlbmd0aCAmJiB0aGlzLmxlbmd0aCA/IGN0eFswXS5hb0RhdGFbdGhpc1swXV0uX2RldGFpbHMgOiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmIChkYXRhID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmNoaWxkLnNob3coKTtcbiAgICB9IGVsc2UgaWYgKGRhdGEgPT09IGZhbHNlKSB7XG4gICAgICBfX2RldGFpbHNfcmVtb3ZlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoY3R4Lmxlbmd0aCAmJiB0aGlzLmxlbmd0aCkge1xuICAgICAgX19kZXRhaWxzX2FkZChjdHhbMF0sIGN0eFswXS5hb0RhdGFbdGhpc1swXV0sIGRhdGEsIGtsYXNzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcihbX2NoaWxkX29iaiArICcuc2hvdygpJywgX2NoaWxkX210aCArICcuc2hvdygpJ10sIGZ1bmN0aW9uIChzaG93KSB7XG4gICAgX19kZXRhaWxzX2Rpc3BsYXkodGhpcywgdHJ1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcihbX2NoaWxkX29iaiArICcuaGlkZSgpJywgX2NoaWxkX210aCArICcuaGlkZSgpJ10sIGZ1bmN0aW9uICgpIHtcbiAgICBfX2RldGFpbHNfZGlzcGxheSh0aGlzLCBmYWxzZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcihbX2NoaWxkX29iaiArICcucmVtb3ZlKCknLCBfY2hpbGRfbXRoICsgJy5yZW1vdmUoKSddLCBmdW5jdGlvbiAoKSB7XG4gICAgX19kZXRhaWxzX3JlbW92ZSh0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKF9jaGlsZF9vYmogKyAnLmlzU2hvd24oKScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKGN0eC5sZW5ndGggJiYgdGhpcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBjdHhbMF0uYW9EYXRhW3RoaXNbMF1dLl9kZXRhaWxzU2hvdyB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gIHZhciBfX3JlX2NvbHVtbl9zZWxlY3RvciA9IC9eKFteOl0rKToobmFtZXx2aXNJZHh8dmlzaWJsZSkkLztcblxuICB2YXIgX19jb2x1bW5EYXRhID0gZnVuY3Rpb24gX19jb2x1bW5EYXRhKHNldHRpbmdzLCBjb2x1bW4sIHIxLCByMiwgcm93cykge1xuICAgIHZhciBhID0gW107XG5cbiAgICBmb3IgKHZhciByb3cgPSAwLCBpZW4gPSByb3dzLmxlbmd0aDsgcm93IDwgaWVuOyByb3crKykge1xuICAgICAgYS5wdXNoKF9mbkdldENlbGxEYXRhKHNldHRpbmdzLCByb3dzW3Jvd10sIGNvbHVtbikpO1xuICAgIH1cblxuICAgIHJldHVybiBhO1xuICB9O1xuXG4gIHZhciBfX2NvbHVtbl9zZWxlY3RvciA9IGZ1bmN0aW9uIF9fY29sdW1uX3NlbGVjdG9yKHNldHRpbmdzLCBzZWxlY3Rvciwgb3B0cykge1xuICAgIHZhciBjb2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zLFxuICAgICAgICBuYW1lcyA9IF9wbHVjayhjb2x1bW5zLCAnc05hbWUnKSxcbiAgICAgICAgbm9kZXMgPSBfcGx1Y2soY29sdW1ucywgJ25UaCcpO1xuXG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uIHJ1bihzKSB7XG4gICAgICB2YXIgc2VsSW50ID0gX2ludFZhbChzKTtcblxuICAgICAgaWYgKHMgPT09ICcnKSB7XG4gICAgICAgIHJldHVybiBfcmFuZ2UoY29sdW1ucy5sZW5ndGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsSW50ICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbc2VsSW50ID49IDAgPyBzZWxJbnQgOiBjb2x1bW5zLmxlbmd0aCArIHNlbEludF07XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgcm93cyA9IF9zZWxlY3Rvcl9yb3dfaW5kZXhlcyhzZXR0aW5ncywgb3B0cyk7XG5cbiAgICAgICAgcmV0dXJuICQubWFwKGNvbHVtbnMsIGZ1bmN0aW9uIChjb2wsIGlkeCkge1xuICAgICAgICAgIHJldHVybiBzKGlkeCwgX19jb2x1bW5EYXRhKHNldHRpbmdzLCBpZHgsIDAsIDAsIHJvd3MpLCBub2Rlc1tpZHhdKSA/IGlkeCA6IG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWF0Y2ggPSB0eXBlb2YgcyA9PT0gJ3N0cmluZycgPyBzLm1hdGNoKF9fcmVfY29sdW1uX3NlbGVjdG9yKSA6ICcnO1xuXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgc3dpdGNoIChtYXRjaFsyXSkge1xuICAgICAgICAgIGNhc2UgJ3Zpc0lkeCc6XG4gICAgICAgICAgY2FzZSAndmlzaWJsZSc6XG4gICAgICAgICAgICB2YXIgaWR4ID0gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKTtcblxuICAgICAgICAgICAgaWYgKGlkeCA8IDApIHtcbiAgICAgICAgICAgICAgdmFyIHZpc0NvbHVtbnMgPSAkLm1hcChjb2x1bW5zLCBmdW5jdGlvbiAoY29sLCBpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbC5iVmlzaWJsZSA/IGkgOiBudWxsO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIFt2aXNDb2x1bW5zW3Zpc0NvbHVtbnMubGVuZ3RoICsgaWR4XV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBbX2ZuVmlzaWJsZVRvQ29sdW1uSW5kZXgoc2V0dGluZ3MsIGlkeCldO1xuXG4gICAgICAgICAgY2FzZSAnbmFtZSc6XG4gICAgICAgICAgICByZXR1cm4gJC5tYXAobmFtZXMsIGZ1bmN0aW9uIChuYW1lLCBpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBuYW1lID09PSBtYXRjaFsxXSA/IGkgOiBudWxsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzLm5vZGVOYW1lICYmIHMuX0RUX0NlbGxJbmRleCkge1xuICAgICAgICByZXR1cm4gW3MuX0RUX0NlbGxJbmRleC5jb2x1bW5dO1xuICAgICAgfVxuXG4gICAgICB2YXIganFSZXN1bHQgPSAkKG5vZGVzKS5maWx0ZXIocykubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICQuaW5BcnJheSh0aGlzLCBub2Rlcyk7XG4gICAgICB9KS50b0FycmF5KCk7XG5cbiAgICAgIGlmIChqcVJlc3VsdC5sZW5ndGggfHwgIXMubm9kZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGpxUmVzdWx0O1xuICAgICAgfVxuXG4gICAgICB2YXIgaG9zdCA9ICQocykuY2xvc2VzdCgnKltkYXRhLWR0LWNvbHVtbl0nKTtcbiAgICAgIHJldHVybiBob3N0Lmxlbmd0aCA/IFtob3N0LmRhdGEoJ2R0LWNvbHVtbicpXSA6IFtdO1xuICAgIH07XG5cbiAgICByZXR1cm4gX3NlbGVjdG9yX3J1bignY29sdW1uJywgc2VsZWN0b3IsIHJ1biwgc2V0dGluZ3MsIG9wdHMpO1xuICB9O1xuXG4gIHZhciBfX3NldENvbHVtblZpcyA9IGZ1bmN0aW9uIF9fc2V0Q29sdW1uVmlzKHNldHRpbmdzLCBjb2x1bW4sIHZpcykge1xuICAgIHZhciBjb2xzID0gc2V0dGluZ3MuYW9Db2x1bW5zLFxuICAgICAgICBjb2wgPSBjb2xzW2NvbHVtbl0sXG4gICAgICAgIGRhdGEgPSBzZXR0aW5ncy5hb0RhdGEsXG4gICAgICAgIHJvdyxcbiAgICAgICAgY2VsbHMsXG4gICAgICAgIGksXG4gICAgICAgIGllbixcbiAgICAgICAgdHI7XG5cbiAgICBpZiAodmlzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBjb2wuYlZpc2libGU7XG4gICAgfVxuXG4gICAgaWYgKGNvbC5iVmlzaWJsZSA9PT0gdmlzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHZpcykge1xuICAgICAgdmFyIGluc2VydEJlZm9yZSA9ICQuaW5BcnJheSh0cnVlLCBfcGx1Y2soY29scywgJ2JWaXNpYmxlJyksIGNvbHVtbiArIDEpO1xuXG4gICAgICBmb3IgKGkgPSAwLCBpZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIHRyID0gZGF0YVtpXS5uVHI7XG4gICAgICAgIGNlbGxzID0gZGF0YVtpXS5hbkNlbGxzO1xuXG4gICAgICAgIGlmICh0cikge1xuICAgICAgICAgIHRyLmluc2VydEJlZm9yZShjZWxsc1tjb2x1bW5dLCBjZWxsc1tpbnNlcnRCZWZvcmVdIHx8IG51bGwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICQoX3BsdWNrKHNldHRpbmdzLmFvRGF0YSwgJ2FuQ2VsbHMnLCBjb2x1bW4pKS5kZXRhY2goKTtcbiAgICB9XG5cbiAgICBjb2wuYlZpc2libGUgPSB2aXM7XG5cbiAgICBfZm5EcmF3SGVhZChzZXR0aW5ncywgc2V0dGluZ3MuYW9IZWFkZXIpO1xuXG4gICAgX2ZuRHJhd0hlYWQoc2V0dGluZ3MsIHNldHRpbmdzLmFvRm9vdGVyKTtcblxuICAgIGlmICghc2V0dGluZ3MuYWlEaXNwbGF5Lmxlbmd0aCkge1xuICAgICAgJChzZXR0aW5ncy5uVEJvZHkpLmZpbmQoJ3RkW2NvbHNwYW5dJykuYXR0cignY29sc3BhbicsIF9mblZpc2JsZUNvbHVtbnMoc2V0dGluZ3MpKTtcbiAgICB9XG5cbiAgICBfZm5TYXZlU3RhdGUoc2V0dGluZ3MpO1xuICB9O1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2NvbHVtbnMoKScsIGZ1bmN0aW9uIChzZWxlY3Rvciwgb3B0cykge1xuICAgIGlmIChzZWxlY3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzZWxlY3RvciA9ICcnO1xuICAgIH0gZWxzZSBpZiAoJC5pc1BsYWluT2JqZWN0KHNlbGVjdG9yKSkge1xuICAgICAgb3B0cyA9IHNlbGVjdG9yO1xuICAgICAgc2VsZWN0b3IgPSAnJztcbiAgICB9XG5cbiAgICBvcHRzID0gX3NlbGVjdG9yX29wdHMob3B0cyk7XG4gICAgdmFyIGluc3QgPSB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgcmV0dXJuIF9fY29sdW1uX3NlbGVjdG9yKHNldHRpbmdzLCBzZWxlY3Rvciwgb3B0cyk7XG4gICAgfSwgMSk7XG4gICAgaW5zdC5zZWxlY3Rvci5jb2xzID0gc2VsZWN0b3I7XG4gICAgaW5zdC5zZWxlY3Rvci5vcHRzID0gb3B0cztcbiAgICByZXR1cm4gaW5zdDtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY29sdW1ucygpLmhlYWRlcigpJywgJ2NvbHVtbigpLmhlYWRlcigpJywgZnVuY3Rpb24gKHNlbGVjdG9yLCBvcHRzKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NvbHVtbicsIGZ1bmN0aW9uIChzZXR0aW5ncywgY29sdW1uKSB7XG4gICAgICByZXR1cm4gc2V0dGluZ3MuYW9Db2x1bW5zW2NvbHVtbl0ublRoO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjb2x1bW5zKCkuZm9vdGVyKCknLCAnY29sdW1uKCkuZm9vdGVyKCknLCBmdW5jdGlvbiAoc2VsZWN0b3IsIG9wdHMpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY29sdW1uJywgZnVuY3Rpb24gKHNldHRpbmdzLCBjb2x1bW4pIHtcbiAgICAgIHJldHVybiBzZXR0aW5ncy5hb0NvbHVtbnNbY29sdW1uXS5uVGY7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NvbHVtbnMoKS5kYXRhKCknLCAnY29sdW1uKCkuZGF0YSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjb2x1bW4tcm93cycsIF9fY29sdW1uRGF0YSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NvbHVtbnMoKS5kYXRhU3JjKCknLCAnY29sdW1uKCkuZGF0YVNyYygpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjb2x1bW4nLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbHVtbikge1xuICAgICAgcmV0dXJuIHNldHRpbmdzLmFvQ29sdW1uc1tjb2x1bW5dLm1EYXRhO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjb2x1bW5zKCkuY2FjaGUoKScsICdjb2x1bW4oKS5jYWNoZSgpJywgZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY29sdW1uLXJvd3MnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbHVtbiwgaSwgaiwgcm93cykge1xuICAgICAgcmV0dXJuIF9wbHVja19vcmRlcihzZXR0aW5ncy5hb0RhdGEsIHJvd3MsIHR5cGUgPT09ICdzZWFyY2gnID8gJ19hRmlsdGVyRGF0YScgOiAnX2FTb3J0RGF0YScsIGNvbHVtbik7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NvbHVtbnMoKS5ub2RlcygpJywgJ2NvbHVtbigpLm5vZGVzKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NvbHVtbi1yb3dzJywgZnVuY3Rpb24gKHNldHRpbmdzLCBjb2x1bW4sIGksIGosIHJvd3MpIHtcbiAgICAgIHJldHVybiBfcGx1Y2tfb3JkZXIoc2V0dGluZ3MuYW9EYXRhLCByb3dzLCAnYW5DZWxscycsIGNvbHVtbik7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NvbHVtbnMoKS52aXNpYmxlKCknLCAnY29sdW1uKCkudmlzaWJsZSgpJywgZnVuY3Rpb24gKHZpcywgY2FsYykge1xuICAgIHZhciByZXQgPSB0aGlzLml0ZXJhdG9yKCdjb2x1bW4nLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbHVtbikge1xuICAgICAgaWYgKHZpcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBzZXR0aW5ncy5hb0NvbHVtbnNbY29sdW1uXS5iVmlzaWJsZTtcbiAgICAgIH1cblxuICAgICAgX19zZXRDb2x1bW5WaXMoc2V0dGluZ3MsIGNvbHVtbiwgdmlzKTtcbiAgICB9KTtcblxuICAgIGlmICh2aXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5pdGVyYXRvcignY29sdW1uJywgZnVuY3Rpb24gKHNldHRpbmdzLCBjb2x1bW4pIHtcbiAgICAgICAgX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCBudWxsLCAnY29sdW1uLXZpc2liaWxpdHknLCBbc2V0dGluZ3MsIGNvbHVtbiwgdmlzLCBjYWxjXSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGNhbGMgPT09IHVuZGVmaW5lZCB8fCBjYWxjKSB7XG4gICAgICAgIHRoaXMuY29sdW1ucy5hZGp1c3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjb2x1bW5zKCkuaW5kZXhlcygpJywgJ2NvbHVtbigpLmluZGV4KCknLCBmdW5jdGlvbiAodHlwZSkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjb2x1bW4nLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbHVtbikge1xuICAgICAgcmV0dXJuIHR5cGUgPT09ICd2aXNpYmxlJyA/IF9mbkNvbHVtbkluZGV4VG9WaXNpYmxlKHNldHRpbmdzLCBjb2x1bW4pIDogY29sdW1uO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdjb2x1bW5zLmFkanVzdCgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgX2ZuQWRqdXN0Q29sdW1uU2l6aW5nKHNldHRpbmdzKTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignY29sdW1uLmluZGV4KCknLCBmdW5jdGlvbiAodHlwZSwgaWR4KSB7XG4gICAgaWYgKHRoaXMuY29udGV4dC5sZW5ndGggIT09IDApIHtcbiAgICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHRbMF07XG5cbiAgICAgIGlmICh0eXBlID09PSAnZnJvbVZpc2libGUnIHx8IHR5cGUgPT09ICd0b0RhdGEnKSB7XG4gICAgICAgIHJldHVybiBfZm5WaXNpYmxlVG9Db2x1bW5JbmRleChjdHgsIGlkeCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdmcm9tRGF0YScgfHwgdHlwZSA9PT0gJ3RvVmlzaWJsZScpIHtcbiAgICAgICAgcmV0dXJuIF9mbkNvbHVtbkluZGV4VG9WaXNpYmxlKGN0eCwgaWR4KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2NvbHVtbigpJywgZnVuY3Rpb24gKHNlbGVjdG9yLCBvcHRzKSB7XG4gICAgcmV0dXJuIF9zZWxlY3Rvcl9maXJzdCh0aGlzLmNvbHVtbnMoc2VsZWN0b3IsIG9wdHMpKTtcbiAgfSk7XG5cbiAgdmFyIF9fY2VsbF9zZWxlY3RvciA9IGZ1bmN0aW9uIF9fY2VsbF9zZWxlY3RvcihzZXR0aW5ncywgc2VsZWN0b3IsIG9wdHMpIHtcbiAgICB2YXIgZGF0YSA9IHNldHRpbmdzLmFvRGF0YTtcblxuICAgIHZhciByb3dzID0gX3NlbGVjdG9yX3Jvd19pbmRleGVzKHNldHRpbmdzLCBvcHRzKTtcblxuICAgIHZhciBjZWxscyA9IF9yZW1vdmVFbXB0eShfcGx1Y2tfb3JkZXIoZGF0YSwgcm93cywgJ2FuQ2VsbHMnKSk7XG5cbiAgICB2YXIgYWxsQ2VsbHMgPSAkKFtdLmNvbmNhdC5hcHBseShbXSwgY2VsbHMpKTtcbiAgICB2YXIgcm93O1xuICAgIHZhciBjb2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zLmxlbmd0aDtcbiAgICB2YXIgYSwgaSwgaWVuLCBqLCBvLCBob3N0O1xuXG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uIHJ1bihzKSB7XG4gICAgICB2YXIgZm5TZWxlY3RvciA9IHR5cGVvZiBzID09PSAnZnVuY3Rpb24nO1xuXG4gICAgICBpZiAocyA9PT0gbnVsbCB8fCBzID09PSB1bmRlZmluZWQgfHwgZm5TZWxlY3Rvcikge1xuICAgICAgICBhID0gW107XG5cbiAgICAgICAgZm9yIChpID0gMCwgaWVuID0gcm93cy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgIHJvdyA9IHJvd3NbaV07XG5cbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgY29sdW1uczsgaisrKSB7XG4gICAgICAgICAgICBvID0ge1xuICAgICAgICAgICAgICByb3c6IHJvdyxcbiAgICAgICAgICAgICAgY29sdW1uOiBqXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoZm5TZWxlY3Rvcikge1xuICAgICAgICAgICAgICBob3N0ID0gZGF0YVtyb3ddO1xuXG4gICAgICAgICAgICAgIGlmIChzKG8sIF9mbkdldENlbGxEYXRhKHNldHRpbmdzLCByb3csIGopLCBob3N0LmFuQ2VsbHMgPyBob3N0LmFuQ2VsbHNbal0gOiBudWxsKSkge1xuICAgICAgICAgICAgICAgIGEucHVzaChvKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYS5wdXNoKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgICAgfVxuXG4gICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHMpKSB7XG4gICAgICAgIHJldHVybiBzLmNvbHVtbiAhPT0gdW5kZWZpbmVkICYmIHMucm93ICE9PSB1bmRlZmluZWQgJiYgJC5pbkFycmF5KHMucm93LCByb3dzKSAhPT0gLTEgPyBbc10gOiBbXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGpxUmVzdWx0ID0gYWxsQ2VsbHMuZmlsdGVyKHMpLm1hcChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByb3c6IGVsLl9EVF9DZWxsSW5kZXgucm93LFxuICAgICAgICAgIGNvbHVtbjogZWwuX0RUX0NlbGxJbmRleC5jb2x1bW5cbiAgICAgICAgfTtcbiAgICAgIH0pLnRvQXJyYXkoKTtcblxuICAgICAgaWYgKGpxUmVzdWx0Lmxlbmd0aCB8fCAhcy5ub2RlTmFtZSkge1xuICAgICAgICByZXR1cm4ganFSZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGhvc3QgPSAkKHMpLmNsb3Nlc3QoJypbZGF0YS1kdC1yb3ddJyk7XG4gICAgICByZXR1cm4gaG9zdC5sZW5ndGggPyBbe1xuICAgICAgICByb3c6IGhvc3QuZGF0YSgnZHQtcm93JyksXG4gICAgICAgIGNvbHVtbjogaG9zdC5kYXRhKCdkdC1jb2x1bW4nKVxuICAgICAgfV0gOiBbXTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF9zZWxlY3Rvcl9ydW4oJ2NlbGwnLCBzZWxlY3RvciwgcnVuLCBzZXR0aW5ncywgb3B0cyk7XG4gIH07XG5cbiAgX2FwaV9yZWdpc3RlcignY2VsbHMoKScsIGZ1bmN0aW9uIChyb3dTZWxlY3RvciwgY29sdW1uU2VsZWN0b3IsIG9wdHMpIHtcbiAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHJvd1NlbGVjdG9yKSkge1xuICAgICAgaWYgKHJvd1NlbGVjdG9yLnJvdyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9wdHMgPSByb3dTZWxlY3RvcjtcbiAgICAgICAgcm93U2VsZWN0b3IgPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0cyA9IGNvbHVtblNlbGVjdG9yO1xuICAgICAgICBjb2x1bW5TZWxlY3RvciA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCQuaXNQbGFpbk9iamVjdChjb2x1bW5TZWxlY3RvcikpIHtcbiAgICAgIG9wdHMgPSBjb2x1bW5TZWxlY3RvcjtcbiAgICAgIGNvbHVtblNlbGVjdG9yID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoY29sdW1uU2VsZWN0b3IgPT09IG51bGwgfHwgY29sdW1uU2VsZWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICAgIHJldHVybiBfX2NlbGxfc2VsZWN0b3Ioc2V0dGluZ3MsIHJvd1NlbGVjdG9yLCBfc2VsZWN0b3Jfb3B0cyhvcHRzKSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgY29sdW1ucyA9IHRoaXMuY29sdW1ucyhjb2x1bW5TZWxlY3Rvcik7XG4gICAgdmFyIHJvd3MgPSB0aGlzLnJvd3Mocm93U2VsZWN0b3IpO1xuICAgIHZhciBhLCBpLCBpZW4sIGosIGplbjtcbiAgICB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncywgaWR4KSB7XG4gICAgICBhID0gW107XG5cbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IHJvd3NbaWR4XS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBmb3IgKGogPSAwLCBqZW4gPSBjb2x1bW5zW2lkeF0ubGVuZ3RoOyBqIDwgamVuOyBqKyspIHtcbiAgICAgICAgICBhLnB1c2goe1xuICAgICAgICAgICAgcm93OiByb3dzW2lkeF1baV0sXG4gICAgICAgICAgICBjb2x1bW46IGNvbHVtbnNbaWR4XVtqXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgMSk7XG4gICAgdmFyIGNlbGxzID0gdGhpcy5jZWxscyhhLCBvcHRzKTtcbiAgICAkLmV4dGVuZChjZWxscy5zZWxlY3Rvciwge1xuICAgICAgY29sczogY29sdW1uU2VsZWN0b3IsXG4gICAgICByb3dzOiByb3dTZWxlY3RvcixcbiAgICAgIG9wdHM6IG9wdHNcbiAgICB9KTtcbiAgICByZXR1cm4gY2VsbHM7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NlbGxzKCkubm9kZXMoKScsICdjZWxsKCkubm9kZSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjZWxsJywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3csIGNvbHVtbikge1xuICAgICAgdmFyIGRhdGEgPSBzZXR0aW5ncy5hb0RhdGFbcm93XTtcbiAgICAgIHJldHVybiBkYXRhICYmIGRhdGEuYW5DZWxscyA/IGRhdGEuYW5DZWxsc1tjb2x1bW5dIDogdW5kZWZpbmVkO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdjZWxscygpLmRhdGEoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY2VsbCcsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93LCBjb2x1bW4pIHtcbiAgICAgIHJldHVybiBfZm5HZXRDZWxsRGF0YShzZXR0aW5ncywgcm93LCBjb2x1bW4pO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjZWxscygpLmNhY2hlKCknLCAnY2VsbCgpLmNhY2hlKCknLCBmdW5jdGlvbiAodHlwZSkge1xuICAgIHR5cGUgPSB0eXBlID09PSAnc2VhcmNoJyA/ICdfYUZpbHRlckRhdGEnIDogJ19hU29ydERhdGEnO1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjZWxsJywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3csIGNvbHVtbikge1xuICAgICAgcmV0dXJuIHNldHRpbmdzLmFvRGF0YVtyb3ddW3R5cGVdW2NvbHVtbl07XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NlbGxzKCkucmVuZGVyKCknLCAnY2VsbCgpLnJlbmRlcigpJywgZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY2VsbCcsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93LCBjb2x1bW4pIHtcbiAgICAgIHJldHVybiBfZm5HZXRDZWxsRGF0YShzZXR0aW5ncywgcm93LCBjb2x1bW4sIHR5cGUpO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjZWxscygpLmluZGV4ZXMoKScsICdjZWxsKCkuaW5kZXgoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY2VsbCcsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93LCBjb2x1bW4pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJvdzogcm93LFxuICAgICAgICBjb2x1bW46IGNvbHVtbixcbiAgICAgICAgY29sdW1uVmlzaWJsZTogX2ZuQ29sdW1uSW5kZXhUb1Zpc2libGUoc2V0dGluZ3MsIGNvbHVtbilcbiAgICAgIH07XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NlbGxzKCkuaW52YWxpZGF0ZSgpJywgJ2NlbGwoKS5pbnZhbGlkYXRlKCknLCBmdW5jdGlvbiAoc3JjKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NlbGwnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIHJvdywgY29sdW1uKSB7XG4gICAgICBfZm5JbnZhbGlkYXRlKHNldHRpbmdzLCByb3csIHNyYywgY29sdW1uKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignY2VsbCgpJywgZnVuY3Rpb24gKHJvd1NlbGVjdG9yLCBjb2x1bW5TZWxlY3Rvciwgb3B0cykge1xuICAgIHJldHVybiBfc2VsZWN0b3JfZmlyc3QodGhpcy5jZWxscyhyb3dTZWxlY3RvciwgY29sdW1uU2VsZWN0b3IsIG9wdHMpKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignY2VsbCgpLmRhdGEoKScsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcbiAgICB2YXIgY2VsbCA9IHRoaXNbMF07XG5cbiAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gY3R4Lmxlbmd0aCAmJiBjZWxsLmxlbmd0aCA/IF9mbkdldENlbGxEYXRhKGN0eFswXSwgY2VsbFswXS5yb3csIGNlbGxbMF0uY29sdW1uKSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBfZm5TZXRDZWxsRGF0YShjdHhbMF0sIGNlbGxbMF0ucm93LCBjZWxsWzBdLmNvbHVtbiwgZGF0YSk7XG5cbiAgICBfZm5JbnZhbGlkYXRlKGN0eFswXSwgY2VsbFswXS5yb3csICdkYXRhJywgY2VsbFswXS5jb2x1bW4pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ29yZGVyKCknLCBmdW5jdGlvbiAob3JkZXIsIGRpcikge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAob3JkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGN0eC5sZW5ndGggIT09IDAgPyBjdHhbMF0uYWFTb3J0aW5nIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3JkZXIgPT09ICdudW1iZXInKSB7XG4gICAgICBvcmRlciA9IFtbb3JkZXIsIGRpcl1dO1xuICAgIH0gZWxzZSBpZiAob3JkZXIubGVuZ3RoICYmICEkLmlzQXJyYXkob3JkZXJbMF0pKSB7XG4gICAgICBvcmRlciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBzZXR0aW5ncy5hYVNvcnRpbmcgPSBvcmRlci5zbGljZSgpO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdvcmRlci5saXN0ZW5lcigpJywgZnVuY3Rpb24gKG5vZGUsIGNvbHVtbiwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIF9mblNvcnRBdHRhY2hMaXN0ZW5lcihzZXR0aW5ncywgbm9kZSwgY29sdW1uLCBjYWxsYmFjayk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ29yZGVyLmZpeGVkKCknLCBmdW5jdGlvbiAoc2V0KSB7XG4gICAgaWYgKCFzZXQpIHtcbiAgICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG4gICAgICB2YXIgZml4ZWQgPSBjdHgubGVuZ3RoID8gY3R4WzBdLmFhU29ydGluZ0ZpeGVkIDogdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuICQuaXNBcnJheShmaXhlZCkgPyB7XG4gICAgICAgIHByZTogZml4ZWRcbiAgICAgIH0gOiBmaXhlZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIHNldHRpbmdzLmFhU29ydGluZ0ZpeGVkID0gJC5leHRlbmQodHJ1ZSwge30sIHNldCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoWydjb2x1bW5zKCkub3JkZXIoKScsICdjb2x1bW4oKS5vcmRlcigpJ10sIGZ1bmN0aW9uIChkaXIpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzLCBpKSB7XG4gICAgICB2YXIgc29ydCA9IFtdO1xuICAgICAgJC5lYWNoKHRoYXRbaV0sIGZ1bmN0aW9uIChqLCBjb2wpIHtcbiAgICAgICAgc29ydC5wdXNoKFtjb2wsIGRpcl0pO1xuICAgICAgfSk7XG4gICAgICBzZXR0aW5ncy5hYVNvcnRpbmcgPSBzb3J0O1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdzZWFyY2goKScsIGZ1bmN0aW9uIChpbnB1dCwgcmVnZXgsIHNtYXJ0LCBjYXNlSW5zZW4pIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKGlucHV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBjdHgubGVuZ3RoICE9PSAwID8gY3R4WzBdLm9QcmV2aW91c1NlYXJjaC5zU2VhcmNoIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgaWYgKCFzZXR0aW5ncy5vRmVhdHVyZXMuYkZpbHRlcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF9mbkZpbHRlckNvbXBsZXRlKHNldHRpbmdzLCAkLmV4dGVuZCh7fSwgc2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoLCB7XG4gICAgICAgIFwic1NlYXJjaFwiOiBpbnB1dCArIFwiXCIsXG4gICAgICAgIFwiYlJlZ2V4XCI6IHJlZ2V4ID09PSBudWxsID8gZmFsc2UgOiByZWdleCxcbiAgICAgICAgXCJiU21hcnRcIjogc21hcnQgPT09IG51bGwgPyB0cnVlIDogc21hcnQsXG4gICAgICAgIFwiYkNhc2VJbnNlbnNpdGl2ZVwiOiBjYXNlSW5zZW4gPT09IG51bGwgPyB0cnVlIDogY2FzZUluc2VuXG4gICAgICB9KSwgMSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NvbHVtbnMoKS5zZWFyY2goKScsICdjb2x1bW4oKS5zZWFyY2goKScsIGZ1bmN0aW9uIChpbnB1dCwgcmVnZXgsIHNtYXJ0LCBjYXNlSW5zZW4pIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY29sdW1uJywgZnVuY3Rpb24gKHNldHRpbmdzLCBjb2x1bW4pIHtcbiAgICAgIHZhciBwcmVTZWFyY2ggPSBzZXR0aW5ncy5hb1ByZVNlYXJjaENvbHM7XG5cbiAgICAgIGlmIChpbnB1dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBwcmVTZWFyY2hbY29sdW1uXS5zU2VhcmNoO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXNldHRpbmdzLm9GZWF0dXJlcy5iRmlsdGVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJC5leHRlbmQocHJlU2VhcmNoW2NvbHVtbl0sIHtcbiAgICAgICAgXCJzU2VhcmNoXCI6IGlucHV0ICsgXCJcIixcbiAgICAgICAgXCJiUmVnZXhcIjogcmVnZXggPT09IG51bGwgPyBmYWxzZSA6IHJlZ2V4LFxuICAgICAgICBcImJTbWFydFwiOiBzbWFydCA9PT0gbnVsbCA/IHRydWUgOiBzbWFydCxcbiAgICAgICAgXCJiQ2FzZUluc2Vuc2l0aXZlXCI6IGNhc2VJbnNlbiA9PT0gbnVsbCA/IHRydWUgOiBjYXNlSW5zZW5cbiAgICAgIH0pO1xuXG4gICAgICBfZm5GaWx0ZXJDb21wbGV0ZShzZXR0aW5ncywgc2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoLCAxKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcignc3RhdGUoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0Lmxlbmd0aCA/IHRoaXMuY29udGV4dFswXS5vU2F2ZWRTdGF0ZSA6IG51bGw7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3N0YXRlLmNsZWFyKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBzZXR0aW5ncy5mblN0YXRlU2F2ZUNhbGxiYWNrLmNhbGwoc2V0dGluZ3Mub0luc3RhbmNlLCBzZXR0aW5ncywge30pO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdzdGF0ZS5sb2FkZWQoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0Lmxlbmd0aCA/IHRoaXMuY29udGV4dFswXS5vTG9hZGVkU3RhdGUgOiBudWxsO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdzdGF0ZS5zYXZlKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBfZm5TYXZlU3RhdGUoc2V0dGluZ3MpO1xuICAgIH0pO1xuICB9KTtcblxuICBEYXRhVGFibGUudmVyc2lvbkNoZWNrID0gRGF0YVRhYmxlLmZuVmVyc2lvbkNoZWNrID0gZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgICB2YXIgYVRoaXMgPSBEYXRhVGFibGUudmVyc2lvbi5zcGxpdCgnLicpO1xuICAgIHZhciBhVGhhdCA9IHZlcnNpb24uc3BsaXQoJy4nKTtcbiAgICB2YXIgaVRoaXMsIGlUaGF0O1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSBhVGhhdC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIGlUaGlzID0gcGFyc2VJbnQoYVRoaXNbaV0sIDEwKSB8fCAwO1xuICAgICAgaVRoYXQgPSBwYXJzZUludChhVGhhdFtpXSwgMTApIHx8IDA7XG5cbiAgICAgIGlmIChpVGhpcyA9PT0gaVRoYXQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpVGhpcyA+IGlUaGF0O1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIERhdGFUYWJsZS5pc0RhdGFUYWJsZSA9IERhdGFUYWJsZS5mbklzRGF0YVRhYmxlID0gZnVuY3Rpb24gKHRhYmxlKSB7XG4gICAgdmFyIHQgPSAkKHRhYmxlKS5nZXQoMCk7XG4gICAgdmFyIGlzID0gZmFsc2U7XG5cbiAgICBpZiAodGFibGUgaW5zdGFuY2VvZiBEYXRhVGFibGUuQXBpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAkLmVhY2goRGF0YVRhYmxlLnNldHRpbmdzLCBmdW5jdGlvbiAoaSwgbykge1xuICAgICAgdmFyIGhlYWQgPSBvLm5TY3JvbGxIZWFkID8gJCgndGFibGUnLCBvLm5TY3JvbGxIZWFkKVswXSA6IG51bGw7XG4gICAgICB2YXIgZm9vdCA9IG8ublNjcm9sbEZvb3QgPyAkKCd0YWJsZScsIG8ublNjcm9sbEZvb3QpWzBdIDogbnVsbDtcblxuICAgICAgaWYgKG8ublRhYmxlID09PSB0IHx8IGhlYWQgPT09IHQgfHwgZm9vdCA9PT0gdCkge1xuICAgICAgICBpcyA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGlzO1xuICB9O1xuXG4gIERhdGFUYWJsZS50YWJsZXMgPSBEYXRhVGFibGUuZm5UYWJsZXMgPSBmdW5jdGlvbiAodmlzaWJsZSkge1xuICAgIHZhciBhcGkgPSBmYWxzZTtcblxuICAgIGlmICgkLmlzUGxhaW5PYmplY3QodmlzaWJsZSkpIHtcbiAgICAgIGFwaSA9IHZpc2libGUuYXBpO1xuICAgICAgdmlzaWJsZSA9IHZpc2libGUudmlzaWJsZTtcbiAgICB9XG5cbiAgICB2YXIgYSA9ICQubWFwKERhdGFUYWJsZS5zZXR0aW5ncywgZnVuY3Rpb24gKG8pIHtcbiAgICAgIGlmICghdmlzaWJsZSB8fCB2aXNpYmxlICYmICQoby5uVGFibGUpLmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgIHJldHVybiBvLm5UYWJsZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYXBpID8gbmV3IF9BcGkyKGEpIDogYTtcbiAgfTtcblxuICBEYXRhVGFibGUuY2FtZWxUb0h1bmdhcmlhbiA9IF9mbkNhbWVsVG9IdW5nYXJpYW47XG5cbiAgX2FwaV9yZWdpc3RlcignJCgpJywgZnVuY3Rpb24gKHNlbGVjdG9yLCBvcHRzKSB7XG4gICAgdmFyIHJvd3MgPSB0aGlzLnJvd3Mob3B0cykubm9kZXMoKSxcbiAgICAgICAganFSb3dzID0gJChyb3dzKTtcbiAgICByZXR1cm4gJChbXS5jb25jYXQoanFSb3dzLmZpbHRlcihzZWxlY3RvcikudG9BcnJheSgpLCBqcVJvd3MuZmluZChzZWxlY3RvcikudG9BcnJheSgpKSk7XG4gIH0pO1xuXG4gICQuZWFjaChbJ29uJywgJ29uZScsICdvZmYnXSwgZnVuY3Rpb24gKGksIGtleSkge1xuICAgIF9hcGlfcmVnaXN0ZXIoa2V5ICsgJygpJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgYXJnc1swXSA9ICQubWFwKGFyZ3NbMF0uc3BsaXQoL1xccy8pLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICByZXR1cm4gIWUubWF0Y2goL1xcLmR0XFxiLykgPyBlICsgJy5kdCcgOiBlO1xuICAgICAgfSkuam9pbignICcpO1xuICAgICAgdmFyIGluc3QgPSAkKHRoaXMudGFibGVzKCkubm9kZXMoKSk7XG4gICAgICBpbnN0W2tleV0uYXBwbHkoaW5zdCwgYXJncyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignY2xlYXIoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIF9mbkNsZWFyVGFibGUoc2V0dGluZ3MpO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdzZXR0aW5ncygpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgX0FwaTIodGhpcy5jb250ZXh0LCB0aGlzLmNvbnRleHQpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdpbml0KCknLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcbiAgICByZXR1cm4gY3R4Lmxlbmd0aCA/IGN0eFswXS5vSW5pdCA6IG51bGw7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2RhdGEoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIHJldHVybiBfcGx1Y2soc2V0dGluZ3MuYW9EYXRhLCAnX2FEYXRhJyk7XG4gICAgfSkuZmxhdHRlbigpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdkZXN0cm95KCknLCBmdW5jdGlvbiAocmVtb3ZlKSB7XG4gICAgcmVtb3ZlID0gcmVtb3ZlIHx8IGZhbHNlO1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgdmFyIG9yaWcgPSBzZXR0aW5ncy5uVGFibGVXcmFwcGVyLnBhcmVudE5vZGU7XG4gICAgICB2YXIgY2xhc3NlcyA9IHNldHRpbmdzLm9DbGFzc2VzO1xuICAgICAgdmFyIHRhYmxlID0gc2V0dGluZ3MublRhYmxlO1xuICAgICAgdmFyIHRib2R5ID0gc2V0dGluZ3MublRCb2R5O1xuICAgICAgdmFyIHRoZWFkID0gc2V0dGluZ3MublRIZWFkO1xuICAgICAgdmFyIHRmb290ID0gc2V0dGluZ3MublRGb290O1xuICAgICAgdmFyIGpxVGFibGUgPSAkKHRhYmxlKTtcbiAgICAgIHZhciBqcVRib2R5ID0gJCh0Ym9keSk7XG4gICAgICB2YXIganFXcmFwcGVyID0gJChzZXR0aW5ncy5uVGFibGVXcmFwcGVyKTtcbiAgICAgIHZhciByb3dzID0gJC5tYXAoc2V0dGluZ3MuYW9EYXRhLCBmdW5jdGlvbiAocikge1xuICAgICAgICByZXR1cm4gci5uVHI7XG4gICAgICB9KTtcbiAgICAgIHZhciBpLCBpZW47XG4gICAgICBzZXR0aW5ncy5iRGVzdHJveWluZyA9IHRydWU7XG5cbiAgICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgXCJhb0Rlc3Ryb3lDYWxsYmFja1wiLCBcImRlc3Ryb3lcIiwgW3NldHRpbmdzXSk7XG5cbiAgICAgIGlmICghcmVtb3ZlKSB7XG4gICAgICAgIG5ldyBfQXBpMihzZXR0aW5ncykuY29sdW1ucygpLnZpc2libGUodHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGpxV3JhcHBlci5vZmYoJy5EVCcpLmZpbmQoJzpub3QodGJvZHkgKiknKS5vZmYoJy5EVCcpO1xuICAgICAgJCh3aW5kb3cpLm9mZignLkRULScgKyBzZXR0aW5ncy5zSW5zdGFuY2UpO1xuXG4gICAgICBpZiAodGFibGUgIT0gdGhlYWQucGFyZW50Tm9kZSkge1xuICAgICAgICBqcVRhYmxlLmNoaWxkcmVuKCd0aGVhZCcpLmRldGFjaCgpO1xuICAgICAgICBqcVRhYmxlLmFwcGVuZCh0aGVhZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0Zm9vdCAmJiB0YWJsZSAhPSB0Zm9vdC5wYXJlbnROb2RlKSB7XG4gICAgICAgIGpxVGFibGUuY2hpbGRyZW4oJ3Rmb290JykuZGV0YWNoKCk7XG4gICAgICAgIGpxVGFibGUuYXBwZW5kKHRmb290KTtcbiAgICAgIH1cblxuICAgICAgc2V0dGluZ3MuYWFTb3J0aW5nID0gW107XG4gICAgICBzZXR0aW5ncy5hYVNvcnRpbmdGaXhlZCA9IFtdO1xuXG4gICAgICBfZm5Tb3J0aW5nQ2xhc3NlcyhzZXR0aW5ncyk7XG5cbiAgICAgICQocm93cykucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYXNTdHJpcGVDbGFzc2VzLmpvaW4oJyAnKSk7XG4gICAgICAkKCd0aCwgdGQnLCB0aGVhZCkucmVtb3ZlQ2xhc3MoY2xhc3Nlcy5zU29ydGFibGUgKyAnICcgKyBjbGFzc2VzLnNTb3J0YWJsZUFzYyArICcgJyArIGNsYXNzZXMuc1NvcnRhYmxlRGVzYyArICcgJyArIGNsYXNzZXMuc1NvcnRhYmxlTm9uZSk7XG4gICAgICBqcVRib2R5LmNoaWxkcmVuKCkuZGV0YWNoKCk7XG4gICAgICBqcVRib2R5LmFwcGVuZChyb3dzKTtcbiAgICAgIHZhciByZW1vdmVkTWV0aG9kID0gcmVtb3ZlID8gJ3JlbW92ZScgOiAnZGV0YWNoJztcbiAgICAgIGpxVGFibGVbcmVtb3ZlZE1ldGhvZF0oKTtcbiAgICAgIGpxV3JhcHBlcltyZW1vdmVkTWV0aG9kXSgpO1xuXG4gICAgICBpZiAoIXJlbW92ZSAmJiBvcmlnKSB7XG4gICAgICAgIG9yaWcuaW5zZXJ0QmVmb3JlKHRhYmxlLCBzZXR0aW5ncy5uVGFibGVSZWluc2VydEJlZm9yZSk7XG4gICAgICAgIGpxVGFibGUuY3NzKCd3aWR0aCcsIHNldHRpbmdzLnNEZXN0cm95V2lkdGgpLnJlbW92ZUNsYXNzKGNsYXNzZXMuc1RhYmxlKTtcbiAgICAgICAgaWVuID0gc2V0dGluZ3MuYXNEZXN0cm95U3RyaXBlcy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGllbikge1xuICAgICAgICAgIGpxVGJvZHkuY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKHNldHRpbmdzLmFzRGVzdHJveVN0cmlwZXNbaSAlIGllbl0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBpZHggPSAkLmluQXJyYXkoc2V0dGluZ3MsIERhdGFUYWJsZS5zZXR0aW5ncyk7XG5cbiAgICAgIGlmIChpZHggIT09IC0xKSB7XG4gICAgICAgIERhdGFUYWJsZS5zZXR0aW5ncy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgJC5lYWNoKFsnY29sdW1uJywgJ3JvdycsICdjZWxsJ10sIGZ1bmN0aW9uIChpLCB0eXBlKSB7XG4gICAgX2FwaV9yZWdpc3Rlcih0eXBlICsgJ3MoKS5ldmVyeSgpJywgZnVuY3Rpb24gKGZuKSB7XG4gICAgICB2YXIgb3B0cyA9IHRoaXMuc2VsZWN0b3Iub3B0cztcbiAgICAgIHZhciBhcGkgPSB0aGlzO1xuICAgICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IodHlwZSwgZnVuY3Rpb24gKHNldHRpbmdzLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0KSB7XG4gICAgICAgIGZuLmNhbGwoYXBpW3R5cGVdKGFyZzEsIHR5cGUgPT09ICdjZWxsJyA/IGFyZzIgOiBvcHRzLCB0eXBlID09PSAnY2VsbCcgPyBvcHRzIDogdW5kZWZpbmVkKSwgYXJnMSwgYXJnMiwgYXJnMywgYXJnNCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignaTE4bigpJywgZnVuY3Rpb24gKHRva2VuLCBkZWYsIHBsdXJhbCkge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHRbMF07XG5cbiAgICB2YXIgcmVzb2x2ZWQgPSBfZm5HZXRPYmplY3REYXRhRm4odG9rZW4pKGN0eC5vTGFuZ3VhZ2UpO1xuXG4gICAgaWYgKHJlc29sdmVkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc29sdmVkID0gZGVmO1xuICAgIH1cblxuICAgIGlmIChwbHVyYWwgIT09IHVuZGVmaW5lZCAmJiAkLmlzUGxhaW5PYmplY3QocmVzb2x2ZWQpKSB7XG4gICAgICByZXNvbHZlZCA9IHJlc29sdmVkW3BsdXJhbF0gIT09IHVuZGVmaW5lZCA/IHJlc29sdmVkW3BsdXJhbF0gOiByZXNvbHZlZC5fO1xuICAgIH1cblxuICAgIHJldHVybiByZXNvbHZlZC5yZXBsYWNlKCclZCcsIHBsdXJhbCk7XG4gIH0pO1xuXG4gIERhdGFUYWJsZS52ZXJzaW9uID0gXCIxLjEwLjE4XCI7XG4gIERhdGFUYWJsZS5zZXR0aW5ncyA9IFtdO1xuICBEYXRhVGFibGUubW9kZWxzID0ge307XG4gIERhdGFUYWJsZS5tb2RlbHMub1NlYXJjaCA9IHtcbiAgICBcImJDYXNlSW5zZW5zaXRpdmVcIjogdHJ1ZSxcbiAgICBcInNTZWFyY2hcIjogXCJcIixcbiAgICBcImJSZWdleFwiOiBmYWxzZSxcbiAgICBcImJTbWFydFwiOiB0cnVlXG4gIH07XG4gIERhdGFUYWJsZS5tb2RlbHMub1JvdyA9IHtcbiAgICBcIm5UclwiOiBudWxsLFxuICAgIFwiYW5DZWxsc1wiOiBudWxsLFxuICAgIFwiX2FEYXRhXCI6IFtdLFxuICAgIFwiX2FTb3J0RGF0YVwiOiBudWxsLFxuICAgIFwiX2FGaWx0ZXJEYXRhXCI6IG51bGwsXG4gICAgXCJfc0ZpbHRlclJvd1wiOiBudWxsLFxuICAgIFwiX3NSb3dTdHJpcGVcIjogXCJcIixcbiAgICBcInNyY1wiOiBudWxsLFxuICAgIFwiaWR4XCI6IC0xXG4gIH07XG4gIERhdGFUYWJsZS5tb2RlbHMub0NvbHVtbiA9IHtcbiAgICBcImlkeFwiOiBudWxsLFxuICAgIFwiYURhdGFTb3J0XCI6IG51bGwsXG4gICAgXCJhc1NvcnRpbmdcIjogbnVsbCxcbiAgICBcImJTZWFyY2hhYmxlXCI6IG51bGwsXG4gICAgXCJiU29ydGFibGVcIjogbnVsbCxcbiAgICBcImJWaXNpYmxlXCI6IG51bGwsXG4gICAgXCJfc01hbnVhbFR5cGVcIjogbnVsbCxcbiAgICBcIl9iQXR0clNyY1wiOiBmYWxzZSxcbiAgICBcImZuQ3JlYXRlZENlbGxcIjogbnVsbCxcbiAgICBcImZuR2V0RGF0YVwiOiBudWxsLFxuICAgIFwiZm5TZXREYXRhXCI6IG51bGwsXG4gICAgXCJtRGF0YVwiOiBudWxsLFxuICAgIFwibVJlbmRlclwiOiBudWxsLFxuICAgIFwiblRoXCI6IG51bGwsXG4gICAgXCJuVGZcIjogbnVsbCxcbiAgICBcInNDbGFzc1wiOiBudWxsLFxuICAgIFwic0NvbnRlbnRQYWRkaW5nXCI6IG51bGwsXG4gICAgXCJzRGVmYXVsdENvbnRlbnRcIjogbnVsbCxcbiAgICBcInNOYW1lXCI6IG51bGwsXG4gICAgXCJzU29ydERhdGFUeXBlXCI6ICdzdGQnLFxuICAgIFwic1NvcnRpbmdDbGFzc1wiOiBudWxsLFxuICAgIFwic1NvcnRpbmdDbGFzc0pVSVwiOiBudWxsLFxuICAgIFwic1RpdGxlXCI6IG51bGwsXG4gICAgXCJzVHlwZVwiOiBudWxsLFxuICAgIFwic1dpZHRoXCI6IG51bGwsXG4gICAgXCJzV2lkdGhPcmlnXCI6IG51bGxcbiAgfTtcbiAgRGF0YVRhYmxlLmRlZmF1bHRzID0ge1xuICAgIFwiYWFEYXRhXCI6IG51bGwsXG4gICAgXCJhYVNvcnRpbmdcIjogW1swLCAnYXNjJ11dLFxuICAgIFwiYWFTb3J0aW5nRml4ZWRcIjogW10sXG4gICAgXCJhamF4XCI6IG51bGwsXG4gICAgXCJhTGVuZ3RoTWVudVwiOiBbMTAsIDI1LCA1MCwgMTAwXSxcbiAgICBcImFvQ29sdW1uc1wiOiBudWxsLFxuICAgIFwiYW9Db2x1bW5EZWZzXCI6IG51bGwsXG4gICAgXCJhb1NlYXJjaENvbHNcIjogW10sXG4gICAgXCJhc1N0cmlwZUNsYXNzZXNcIjogbnVsbCxcbiAgICBcImJBdXRvV2lkdGhcIjogdHJ1ZSxcbiAgICBcImJEZWZlclJlbmRlclwiOiBmYWxzZSxcbiAgICBcImJEZXN0cm95XCI6IGZhbHNlLFxuICAgIFwiYkZpbHRlclwiOiB0cnVlLFxuICAgIFwiYkluZm9cIjogdHJ1ZSxcbiAgICBcImJMZW5ndGhDaGFuZ2VcIjogdHJ1ZSxcbiAgICBcImJQYWdpbmF0ZVwiOiB0cnVlLFxuICAgIFwiYlByb2Nlc3NpbmdcIjogZmFsc2UsXG4gICAgXCJiUmV0cmlldmVcIjogZmFsc2UsXG4gICAgXCJiU2Nyb2xsQ29sbGFwc2VcIjogZmFsc2UsXG4gICAgXCJiU2VydmVyU2lkZVwiOiBmYWxzZSxcbiAgICBcImJTb3J0XCI6IHRydWUsXG4gICAgXCJiU29ydE11bHRpXCI6IHRydWUsXG4gICAgXCJiU29ydENlbGxzVG9wXCI6IGZhbHNlLFxuICAgIFwiYlNvcnRDbGFzc2VzXCI6IHRydWUsXG4gICAgXCJiU3RhdGVTYXZlXCI6IGZhbHNlLFxuICAgIFwiZm5DcmVhdGVkUm93XCI6IG51bGwsXG4gICAgXCJmbkRyYXdDYWxsYmFja1wiOiBudWxsLFxuICAgIFwiZm5Gb290ZXJDYWxsYmFja1wiOiBudWxsLFxuICAgIFwiZm5Gb3JtYXROdW1iZXJcIjogZnVuY3Rpb24gZm5Gb3JtYXROdW1iZXIodG9Gb3JtYXQpIHtcbiAgICAgIHJldHVybiB0b0Zvcm1hdC50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIHRoaXMub0xhbmd1YWdlLnNUaG91c2FuZHMpO1xuICAgIH0sXG4gICAgXCJmbkhlYWRlckNhbGxiYWNrXCI6IG51bGwsXG4gICAgXCJmbkluZm9DYWxsYmFja1wiOiBudWxsLFxuICAgIFwiZm5Jbml0Q29tcGxldGVcIjogbnVsbCxcbiAgICBcImZuUHJlRHJhd0NhbGxiYWNrXCI6IG51bGwsXG4gICAgXCJmblJvd0NhbGxiYWNrXCI6IG51bGwsXG4gICAgXCJmblNlcnZlckRhdGFcIjogbnVsbCxcbiAgICBcImZuU2VydmVyUGFyYW1zXCI6IG51bGwsXG4gICAgXCJmblN0YXRlTG9hZENhbGxiYWNrXCI6IGZ1bmN0aW9uIGZuU3RhdGVMb2FkQ2FsbGJhY2soc2V0dGluZ3MpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKChzZXR0aW5ncy5pU3RhdGVEdXJhdGlvbiA9PT0gLTEgPyBzZXNzaW9uU3RvcmFnZSA6IGxvY2FsU3RvcmFnZSkuZ2V0SXRlbSgnRGF0YVRhYmxlc18nICsgc2V0dGluZ3Muc0luc3RhbmNlICsgJ18nICsgbG9jYXRpb24ucGF0aG5hbWUpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfSxcbiAgICBcImZuU3RhdGVMb2FkUGFyYW1zXCI6IG51bGwsXG4gICAgXCJmblN0YXRlTG9hZGVkXCI6IG51bGwsXG4gICAgXCJmblN0YXRlU2F2ZUNhbGxiYWNrXCI6IGZ1bmN0aW9uIGZuU3RhdGVTYXZlQ2FsbGJhY2soc2V0dGluZ3MsIGRhdGEpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIChzZXR0aW5ncy5pU3RhdGVEdXJhdGlvbiA9PT0gLTEgPyBzZXNzaW9uU3RvcmFnZSA6IGxvY2FsU3RvcmFnZSkuc2V0SXRlbSgnRGF0YVRhYmxlc18nICsgc2V0dGluZ3Muc0luc3RhbmNlICsgJ18nICsgbG9jYXRpb24ucGF0aG5hbWUsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfSxcbiAgICBcImZuU3RhdGVTYXZlUGFyYW1zXCI6IG51bGwsXG4gICAgXCJpU3RhdGVEdXJhdGlvblwiOiA3MjAwLFxuICAgIFwiaURlZmVyTG9hZGluZ1wiOiBudWxsLFxuICAgIFwiaURpc3BsYXlMZW5ndGhcIjogMTAsXG4gICAgXCJpRGlzcGxheVN0YXJ0XCI6IDAsXG4gICAgXCJpVGFiSW5kZXhcIjogMCxcbiAgICBcIm9DbGFzc2VzXCI6IHt9LFxuICAgIFwib0xhbmd1YWdlXCI6IHtcbiAgICAgIFwib0FyaWFcIjoge1xuICAgICAgICBcInNTb3J0QXNjZW5kaW5nXCI6IFwiOiBhY3RpdmF0ZSB0byBzb3J0IGNvbHVtbiBhc2NlbmRpbmdcIixcbiAgICAgICAgXCJzU29ydERlc2NlbmRpbmdcIjogXCI6IGFjdGl2YXRlIHRvIHNvcnQgY29sdW1uIGRlc2NlbmRpbmdcIlxuICAgICAgfSxcbiAgICAgIFwib1BhZ2luYXRlXCI6IHtcbiAgICAgICAgXCJzRmlyc3RcIjogXCJGaXJzdFwiLFxuICAgICAgICBcInNMYXN0XCI6IFwiTGFzdFwiLFxuICAgICAgICBcInNOZXh0XCI6IFwiTmV4dFwiLFxuICAgICAgICBcInNQcmV2aW91c1wiOiBcIlByZXZpb3VzXCJcbiAgICAgIH0sXG4gICAgICBcInNFbXB0eVRhYmxlXCI6IFwiTm8gZGF0YSBhdmFpbGFibGUgaW4gdGFibGVcIixcbiAgICAgIFwic0luZm9cIjogXCJTaG93aW5nIF9TVEFSVF8gdG8gX0VORF8gb2YgX1RPVEFMXyBlbnRyaWVzXCIsXG4gICAgICBcInNJbmZvRW1wdHlcIjogXCJTaG93aW5nIDAgdG8gMCBvZiAwIGVudHJpZXNcIixcbiAgICAgIFwic0luZm9GaWx0ZXJlZFwiOiBcIihmaWx0ZXJlZCBmcm9tIF9NQVhfIHRvdGFsIGVudHJpZXMpXCIsXG4gICAgICBcInNJbmZvUG9zdEZpeFwiOiBcIlwiLFxuICAgICAgXCJzRGVjaW1hbFwiOiBcIlwiLFxuICAgICAgXCJzVGhvdXNhbmRzXCI6IFwiLFwiLFxuICAgICAgXCJzTGVuZ3RoTWVudVwiOiBcIlNob3cgX01FTlVfIGVudHJpZXNcIixcbiAgICAgIFwic0xvYWRpbmdSZWNvcmRzXCI6IFwiTG9hZGluZy4uLlwiLFxuICAgICAgXCJzUHJvY2Vzc2luZ1wiOiBcIlByb2Nlc3NpbmcuLi5cIixcbiAgICAgIFwic1NlYXJjaFwiOiBcIlNlYXJjaDpcIixcbiAgICAgIFwic1NlYXJjaFBsYWNlaG9sZGVyXCI6IFwiXCIsXG4gICAgICBcInNVcmxcIjogXCJcIixcbiAgICAgIFwic1plcm9SZWNvcmRzXCI6IFwiTm8gbWF0Y2hpbmcgcmVjb3JkcyBmb3VuZFwiXG4gICAgfSxcbiAgICBcIm9TZWFyY2hcIjogJC5leHRlbmQoe30sIERhdGFUYWJsZS5tb2RlbHMub1NlYXJjaCksXG4gICAgXCJzQWpheERhdGFQcm9wXCI6IFwiZGF0YVwiLFxuICAgIFwic0FqYXhTb3VyY2VcIjogbnVsbCxcbiAgICBcInNEb21cIjogXCJsZnJ0aXBcIixcbiAgICBcInNlYXJjaERlbGF5XCI6IG51bGwsXG4gICAgXCJzUGFnaW5hdGlvblR5cGVcIjogXCJzaW1wbGVfbnVtYmVyc1wiLFxuICAgIFwic1Njcm9sbFhcIjogXCJcIixcbiAgICBcInNTY3JvbGxYSW5uZXJcIjogXCJcIixcbiAgICBcInNTY3JvbGxZXCI6IFwiXCIsXG4gICAgXCJzU2VydmVyTWV0aG9kXCI6IFwiR0VUXCIsXG4gICAgXCJyZW5kZXJlclwiOiBudWxsLFxuICAgIFwicm93SWRcIjogXCJEVF9Sb3dJZFwiXG4gIH07XG5cbiAgX2ZuSHVuZ2FyaWFuTWFwKERhdGFUYWJsZS5kZWZhdWx0cyk7XG5cbiAgRGF0YVRhYmxlLmRlZmF1bHRzLmNvbHVtbiA9IHtcbiAgICBcImFEYXRhU29ydFwiOiBudWxsLFxuICAgIFwiaURhdGFTb3J0XCI6IC0xLFxuICAgIFwiYXNTb3J0aW5nXCI6IFsnYXNjJywgJ2Rlc2MnXSxcbiAgICBcImJTZWFyY2hhYmxlXCI6IHRydWUsXG4gICAgXCJiU29ydGFibGVcIjogdHJ1ZSxcbiAgICBcImJWaXNpYmxlXCI6IHRydWUsXG4gICAgXCJmbkNyZWF0ZWRDZWxsXCI6IG51bGwsXG4gICAgXCJtRGF0YVwiOiBudWxsLFxuICAgIFwibVJlbmRlclwiOiBudWxsLFxuICAgIFwic0NlbGxUeXBlXCI6IFwidGRcIixcbiAgICBcInNDbGFzc1wiOiBcIlwiLFxuICAgIFwic0NvbnRlbnRQYWRkaW5nXCI6IFwiXCIsXG4gICAgXCJzRGVmYXVsdENvbnRlbnRcIjogbnVsbCxcbiAgICBcInNOYW1lXCI6IFwiXCIsXG4gICAgXCJzU29ydERhdGFUeXBlXCI6IFwic3RkXCIsXG4gICAgXCJzVGl0bGVcIjogbnVsbCxcbiAgICBcInNUeXBlXCI6IG51bGwsXG4gICAgXCJzV2lkdGhcIjogbnVsbFxuICB9O1xuXG4gIF9mbkh1bmdhcmlhbk1hcChEYXRhVGFibGUuZGVmYXVsdHMuY29sdW1uKTtcblxuICBEYXRhVGFibGUubW9kZWxzLm9TZXR0aW5ncyA9IHtcbiAgICBcIm9GZWF0dXJlc1wiOiB7XG4gICAgICBcImJBdXRvV2lkdGhcIjogbnVsbCxcbiAgICAgIFwiYkRlZmVyUmVuZGVyXCI6IG51bGwsXG4gICAgICBcImJGaWx0ZXJcIjogbnVsbCxcbiAgICAgIFwiYkluZm9cIjogbnVsbCxcbiAgICAgIFwiYkxlbmd0aENoYW5nZVwiOiBudWxsLFxuICAgICAgXCJiUGFnaW5hdGVcIjogbnVsbCxcbiAgICAgIFwiYlByb2Nlc3NpbmdcIjogbnVsbCxcbiAgICAgIFwiYlNlcnZlclNpZGVcIjogbnVsbCxcbiAgICAgIFwiYlNvcnRcIjogbnVsbCxcbiAgICAgIFwiYlNvcnRNdWx0aVwiOiBudWxsLFxuICAgICAgXCJiU29ydENsYXNzZXNcIjogbnVsbCxcbiAgICAgIFwiYlN0YXRlU2F2ZVwiOiBudWxsXG4gICAgfSxcbiAgICBcIm9TY3JvbGxcIjoge1xuICAgICAgXCJiQ29sbGFwc2VcIjogbnVsbCxcbiAgICAgIFwiaUJhcldpZHRoXCI6IDAsXG4gICAgICBcInNYXCI6IG51bGwsXG4gICAgICBcInNYSW5uZXJcIjogbnVsbCxcbiAgICAgIFwic1lcIjogbnVsbFxuICAgIH0sXG4gICAgXCJvTGFuZ3VhZ2VcIjoge1xuICAgICAgXCJmbkluZm9DYWxsYmFja1wiOiBudWxsXG4gICAgfSxcbiAgICBcIm9Ccm93c2VyXCI6IHtcbiAgICAgIFwiYlNjcm9sbE92ZXJzaXplXCI6IGZhbHNlLFxuICAgICAgXCJiU2Nyb2xsYmFyTGVmdFwiOiBmYWxzZSxcbiAgICAgIFwiYkJvdW5kaW5nXCI6IGZhbHNlLFxuICAgICAgXCJiYXJXaWR0aFwiOiAwXG4gICAgfSxcbiAgICBcImFqYXhcIjogbnVsbCxcbiAgICBcImFhbkZlYXR1cmVzXCI6IFtdLFxuICAgIFwiYW9EYXRhXCI6IFtdLFxuICAgIFwiYWlEaXNwbGF5XCI6IFtdLFxuICAgIFwiYWlEaXNwbGF5TWFzdGVyXCI6IFtdLFxuICAgIFwiYUlkc1wiOiB7fSxcbiAgICBcImFvQ29sdW1uc1wiOiBbXSxcbiAgICBcImFvSGVhZGVyXCI6IFtdLFxuICAgIFwiYW9Gb290ZXJcIjogW10sXG4gICAgXCJvUHJldmlvdXNTZWFyY2hcIjoge30sXG4gICAgXCJhb1ByZVNlYXJjaENvbHNcIjogW10sXG4gICAgXCJhYVNvcnRpbmdcIjogbnVsbCxcbiAgICBcImFhU29ydGluZ0ZpeGVkXCI6IFtdLFxuICAgIFwiYXNTdHJpcGVDbGFzc2VzXCI6IG51bGwsXG4gICAgXCJhc0Rlc3Ryb3lTdHJpcGVzXCI6IFtdLFxuICAgIFwic0Rlc3Ryb3lXaWR0aFwiOiAwLFxuICAgIFwiYW9Sb3dDYWxsYmFja1wiOiBbXSxcbiAgICBcImFvSGVhZGVyQ2FsbGJhY2tcIjogW10sXG4gICAgXCJhb0Zvb3RlckNhbGxiYWNrXCI6IFtdLFxuICAgIFwiYW9EcmF3Q2FsbGJhY2tcIjogW10sXG4gICAgXCJhb1Jvd0NyZWF0ZWRDYWxsYmFja1wiOiBbXSxcbiAgICBcImFvUHJlRHJhd0NhbGxiYWNrXCI6IFtdLFxuICAgIFwiYW9Jbml0Q29tcGxldGVcIjogW10sXG4gICAgXCJhb1N0YXRlU2F2ZVBhcmFtc1wiOiBbXSxcbiAgICBcImFvU3RhdGVMb2FkUGFyYW1zXCI6IFtdLFxuICAgIFwiYW9TdGF0ZUxvYWRlZFwiOiBbXSxcbiAgICBcInNUYWJsZUlkXCI6IFwiXCIsXG4gICAgXCJuVGFibGVcIjogbnVsbCxcbiAgICBcIm5USGVhZFwiOiBudWxsLFxuICAgIFwiblRGb290XCI6IG51bGwsXG4gICAgXCJuVEJvZHlcIjogbnVsbCxcbiAgICBcIm5UYWJsZVdyYXBwZXJcIjogbnVsbCxcbiAgICBcImJEZWZlckxvYWRpbmdcIjogZmFsc2UsXG4gICAgXCJiSW5pdGlhbGlzZWRcIjogZmFsc2UsXG4gICAgXCJhb09wZW5Sb3dzXCI6IFtdLFxuICAgIFwic0RvbVwiOiBudWxsLFxuICAgIFwic2VhcmNoRGVsYXlcIjogbnVsbCxcbiAgICBcInNQYWdpbmF0aW9uVHlwZVwiOiBcInR3b19idXR0b25cIixcbiAgICBcImlTdGF0ZUR1cmF0aW9uXCI6IDAsXG4gICAgXCJhb1N0YXRlU2F2ZVwiOiBbXSxcbiAgICBcImFvU3RhdGVMb2FkXCI6IFtdLFxuICAgIFwib1NhdmVkU3RhdGVcIjogbnVsbCxcbiAgICBcIm9Mb2FkZWRTdGF0ZVwiOiBudWxsLFxuICAgIFwic0FqYXhTb3VyY2VcIjogbnVsbCxcbiAgICBcInNBamF4RGF0YVByb3BcIjogbnVsbCxcbiAgICBcImJBamF4RGF0YUdldFwiOiB0cnVlLFxuICAgIFwianFYSFJcIjogbnVsbCxcbiAgICBcImpzb25cIjogdW5kZWZpbmVkLFxuICAgIFwib0FqYXhEYXRhXCI6IHVuZGVmaW5lZCxcbiAgICBcImZuU2VydmVyRGF0YVwiOiBudWxsLFxuICAgIFwiYW9TZXJ2ZXJQYXJhbXNcIjogW10sXG4gICAgXCJzU2VydmVyTWV0aG9kXCI6IG51bGwsXG4gICAgXCJmbkZvcm1hdE51bWJlclwiOiBudWxsLFxuICAgIFwiYUxlbmd0aE1lbnVcIjogbnVsbCxcbiAgICBcImlEcmF3XCI6IDAsXG4gICAgXCJiRHJhd2luZ1wiOiBmYWxzZSxcbiAgICBcImlEcmF3RXJyb3JcIjogLTEsXG4gICAgXCJfaURpc3BsYXlMZW5ndGhcIjogMTAsXG4gICAgXCJfaURpc3BsYXlTdGFydFwiOiAwLFxuICAgIFwiX2lSZWNvcmRzVG90YWxcIjogMCxcbiAgICBcIl9pUmVjb3Jkc0Rpc3BsYXlcIjogMCxcbiAgICBcIm9DbGFzc2VzXCI6IHt9LFxuICAgIFwiYkZpbHRlcmVkXCI6IGZhbHNlLFxuICAgIFwiYlNvcnRlZFwiOiBmYWxzZSxcbiAgICBcImJTb3J0Q2VsbHNUb3BcIjogbnVsbCxcbiAgICBcIm9Jbml0XCI6IG51bGwsXG4gICAgXCJhb0Rlc3Ryb3lDYWxsYmFja1wiOiBbXSxcbiAgICBcImZuUmVjb3Jkc1RvdGFsXCI6IGZ1bmN0aW9uIGZuUmVjb3Jkc1RvdGFsKCkge1xuICAgICAgcmV0dXJuIF9mbkRhdGFTb3VyY2UodGhpcykgPT0gJ3NzcCcgPyB0aGlzLl9pUmVjb3Jkc1RvdGFsICogMSA6IHRoaXMuYWlEaXNwbGF5TWFzdGVyLmxlbmd0aDtcbiAgICB9LFxuICAgIFwiZm5SZWNvcmRzRGlzcGxheVwiOiBmdW5jdGlvbiBmblJlY29yZHNEaXNwbGF5KCkge1xuICAgICAgcmV0dXJuIF9mbkRhdGFTb3VyY2UodGhpcykgPT0gJ3NzcCcgPyB0aGlzLl9pUmVjb3Jkc0Rpc3BsYXkgKiAxIDogdGhpcy5haURpc3BsYXkubGVuZ3RoO1xuICAgIH0sXG4gICAgXCJmbkRpc3BsYXlFbmRcIjogZnVuY3Rpb24gZm5EaXNwbGF5RW5kKCkge1xuICAgICAgdmFyIGxlbiA9IHRoaXMuX2lEaXNwbGF5TGVuZ3RoLFxuICAgICAgICAgIHN0YXJ0ID0gdGhpcy5faURpc3BsYXlTdGFydCxcbiAgICAgICAgICBjYWxjID0gc3RhcnQgKyBsZW4sXG4gICAgICAgICAgcmVjb3JkcyA9IHRoaXMuYWlEaXNwbGF5Lmxlbmd0aCxcbiAgICAgICAgICBmZWF0dXJlcyA9IHRoaXMub0ZlYXR1cmVzLFxuICAgICAgICAgIHBhZ2luYXRlID0gZmVhdHVyZXMuYlBhZ2luYXRlO1xuXG4gICAgICBpZiAoZmVhdHVyZXMuYlNlcnZlclNpZGUpIHtcbiAgICAgICAgcmV0dXJuIHBhZ2luYXRlID09PSBmYWxzZSB8fCBsZW4gPT09IC0xID8gc3RhcnQgKyByZWNvcmRzIDogTWF0aC5taW4oc3RhcnQgKyBsZW4sIHRoaXMuX2lSZWNvcmRzRGlzcGxheSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gIXBhZ2luYXRlIHx8IGNhbGMgPiByZWNvcmRzIHx8IGxlbiA9PT0gLTEgPyByZWNvcmRzIDogY2FsYztcbiAgICAgIH1cbiAgICB9LFxuICAgIFwib0luc3RhbmNlXCI6IG51bGwsXG4gICAgXCJzSW5zdGFuY2VcIjogbnVsbCxcbiAgICBcImlUYWJJbmRleFwiOiAwLFxuICAgIFwiblNjcm9sbEhlYWRcIjogbnVsbCxcbiAgICBcIm5TY3JvbGxGb290XCI6IG51bGwsXG4gICAgXCJhTGFzdFNvcnRcIjogW10sXG4gICAgXCJvUGx1Z2luc1wiOiB7fSxcbiAgICBcInJvd0lkRm5cIjogbnVsbCxcbiAgICBcInJvd0lkXCI6IG51bGxcbiAgfTtcbiAgRGF0YVRhYmxlLmV4dCA9IF9leHQgPSB7XG4gICAgYnV0dG9uczoge30sXG4gICAgY2xhc3Nlczoge30sXG4gICAgYnVpbGQ6IFwiZHQvZHQtMS4xMC4xOFwiLFxuICAgIGVyck1vZGU6IFwiYWxlcnRcIixcbiAgICBmZWF0dXJlOiBbXSxcbiAgICBzZWFyY2g6IFtdLFxuICAgIHNlbGVjdG9yOiB7XG4gICAgICBjZWxsOiBbXSxcbiAgICAgIGNvbHVtbjogW10sXG4gICAgICByb3c6IFtdXG4gICAgfSxcbiAgICBpbnRlcm5hbDoge30sXG4gICAgbGVnYWN5OiB7XG4gICAgICBhamF4OiBudWxsXG4gICAgfSxcbiAgICBwYWdlcjoge30sXG4gICAgcmVuZGVyZXI6IHtcbiAgICAgIHBhZ2VCdXR0b246IHt9LFxuICAgICAgaGVhZGVyOiB7fVxuICAgIH0sXG4gICAgb3JkZXI6IHt9LFxuICAgIHR5cGU6IHtcbiAgICAgIGRldGVjdDogW10sXG4gICAgICBzZWFyY2g6IHt9LFxuICAgICAgb3JkZXI6IHt9XG4gICAgfSxcbiAgICBfdW5pcXVlOiAwLFxuICAgIGZuVmVyc2lvbkNoZWNrOiBEYXRhVGFibGUuZm5WZXJzaW9uQ2hlY2ssXG4gICAgaUFwaUluZGV4OiAwLFxuICAgIG9KVUlDbGFzc2VzOiB7fSxcbiAgICBzVmVyc2lvbjogRGF0YVRhYmxlLnZlcnNpb25cbiAgfTtcbiAgJC5leHRlbmQoX2V4dCwge1xuICAgIGFmbkZpbHRlcmluZzogX2V4dC5zZWFyY2gsXG4gICAgYVR5cGVzOiBfZXh0LnR5cGUuZGV0ZWN0LFxuICAgIG9mblNlYXJjaDogX2V4dC50eXBlLnNlYXJjaCxcbiAgICBvU29ydDogX2V4dC50eXBlLm9yZGVyLFxuICAgIGFmblNvcnREYXRhOiBfZXh0Lm9yZGVyLFxuICAgIGFvRmVhdHVyZXM6IF9leHQuZmVhdHVyZSxcbiAgICBvQXBpOiBfZXh0LmludGVybmFsLFxuICAgIG9TdGRDbGFzc2VzOiBfZXh0LmNsYXNzZXMsXG4gICAgb1BhZ2luYXRpb246IF9leHQucGFnZXJcbiAgfSk7XG4gICQuZXh0ZW5kKERhdGFUYWJsZS5leHQuY2xhc3Nlcywge1xuICAgIFwic1RhYmxlXCI6IFwiZGF0YVRhYmxlXCIsXG4gICAgXCJzTm9Gb290ZXJcIjogXCJuby1mb290ZXJcIixcbiAgICBcInNQYWdlQnV0dG9uXCI6IFwicGFnaW5hdGVfYnV0dG9uXCIsXG4gICAgXCJzUGFnZUJ1dHRvbkFjdGl2ZVwiOiBcImN1cnJlbnRcIixcbiAgICBcInNQYWdlQnV0dG9uRGlzYWJsZWRcIjogXCJkaXNhYmxlZFwiLFxuICAgIFwic1N0cmlwZU9kZFwiOiBcIm9kZFwiLFxuICAgIFwic1N0cmlwZUV2ZW5cIjogXCJldmVuXCIsXG4gICAgXCJzUm93RW1wdHlcIjogXCJkYXRhVGFibGVzX2VtcHR5XCIsXG4gICAgXCJzV3JhcHBlclwiOiBcImRhdGFUYWJsZXNfd3JhcHBlclwiLFxuICAgIFwic0ZpbHRlclwiOiBcImRhdGFUYWJsZXNfZmlsdGVyXCIsXG4gICAgXCJzSW5mb1wiOiBcImRhdGFUYWJsZXNfaW5mb1wiLFxuICAgIFwic1BhZ2luZ1wiOiBcImRhdGFUYWJsZXNfcGFnaW5hdGUgcGFnaW5nX1wiLFxuICAgIFwic0xlbmd0aFwiOiBcImRhdGFUYWJsZXNfbGVuZ3RoXCIsXG4gICAgXCJzUHJvY2Vzc2luZ1wiOiBcImRhdGFUYWJsZXNfcHJvY2Vzc2luZ1wiLFxuICAgIFwic1NvcnRBc2NcIjogXCJzb3J0aW5nX2FzY1wiLFxuICAgIFwic1NvcnREZXNjXCI6IFwic29ydGluZ19kZXNjXCIsXG4gICAgXCJzU29ydGFibGVcIjogXCJzb3J0aW5nXCIsXG4gICAgXCJzU29ydGFibGVBc2NcIjogXCJzb3J0aW5nX2FzY19kaXNhYmxlZFwiLFxuICAgIFwic1NvcnRhYmxlRGVzY1wiOiBcInNvcnRpbmdfZGVzY19kaXNhYmxlZFwiLFxuICAgIFwic1NvcnRhYmxlTm9uZVwiOiBcInNvcnRpbmdfZGlzYWJsZWRcIixcbiAgICBcInNTb3J0Q29sdW1uXCI6IFwic29ydGluZ19cIixcbiAgICBcInNGaWx0ZXJJbnB1dFwiOiBcIlwiLFxuICAgIFwic0xlbmd0aFNlbGVjdFwiOiBcIlwiLFxuICAgIFwic1Njcm9sbFdyYXBwZXJcIjogXCJkYXRhVGFibGVzX3Njcm9sbFwiLFxuICAgIFwic1Njcm9sbEhlYWRcIjogXCJkYXRhVGFibGVzX3Njcm9sbEhlYWRcIixcbiAgICBcInNTY3JvbGxIZWFkSW5uZXJcIjogXCJkYXRhVGFibGVzX3Njcm9sbEhlYWRJbm5lclwiLFxuICAgIFwic1Njcm9sbEJvZHlcIjogXCJkYXRhVGFibGVzX3Njcm9sbEJvZHlcIixcbiAgICBcInNTY3JvbGxGb290XCI6IFwiZGF0YVRhYmxlc19zY3JvbGxGb290XCIsXG4gICAgXCJzU2Nyb2xsRm9vdElubmVyXCI6IFwiZGF0YVRhYmxlc19zY3JvbGxGb290SW5uZXJcIixcbiAgICBcInNIZWFkZXJUSFwiOiBcIlwiLFxuICAgIFwic0Zvb3RlclRIXCI6IFwiXCIsXG4gICAgXCJzU29ydEpVSUFzY1wiOiBcIlwiLFxuICAgIFwic1NvcnRKVUlEZXNjXCI6IFwiXCIsXG4gICAgXCJzU29ydEpVSVwiOiBcIlwiLFxuICAgIFwic1NvcnRKVUlBc2NBbGxvd2VkXCI6IFwiXCIsXG4gICAgXCJzU29ydEpVSURlc2NBbGxvd2VkXCI6IFwiXCIsXG4gICAgXCJzU29ydEpVSVdyYXBwZXJcIjogXCJcIixcbiAgICBcInNTb3J0SWNvblwiOiBcIlwiLFxuICAgIFwic0pVSUhlYWRlclwiOiBcIlwiLFxuICAgIFwic0pVSUZvb3RlclwiOiBcIlwiXG4gIH0pO1xuICB2YXIgZXh0UGFnaW5hdGlvbiA9IERhdGFUYWJsZS5leHQucGFnZXI7XG5cbiAgZnVuY3Rpb24gX251bWJlcnMocGFnZSwgcGFnZXMpIHtcbiAgICB2YXIgbnVtYmVycyA9IFtdLFxuICAgICAgICBidXR0b25zID0gZXh0UGFnaW5hdGlvbi5udW1iZXJzX2xlbmd0aCxcbiAgICAgICAgaGFsZiA9IE1hdGguZmxvb3IoYnV0dG9ucyAvIDIpLFxuICAgICAgICBpID0gMTtcblxuICAgIGlmIChwYWdlcyA8PSBidXR0b25zKSB7XG4gICAgICBudW1iZXJzID0gX3JhbmdlKDAsIHBhZ2VzKTtcbiAgICB9IGVsc2UgaWYgKHBhZ2UgPD0gaGFsZikge1xuICAgICAgbnVtYmVycyA9IF9yYW5nZSgwLCBidXR0b25zIC0gMik7XG4gICAgICBudW1iZXJzLnB1c2goJ2VsbGlwc2lzJyk7XG4gICAgICBudW1iZXJzLnB1c2gocGFnZXMgLSAxKTtcbiAgICB9IGVsc2UgaWYgKHBhZ2UgPj0gcGFnZXMgLSAxIC0gaGFsZikge1xuICAgICAgbnVtYmVycyA9IF9yYW5nZShwYWdlcyAtIChidXR0b25zIC0gMiksIHBhZ2VzKTtcbiAgICAgIG51bWJlcnMuc3BsaWNlKDAsIDAsICdlbGxpcHNpcycpO1xuICAgICAgbnVtYmVycy5zcGxpY2UoMCwgMCwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG51bWJlcnMgPSBfcmFuZ2UocGFnZSAtIGhhbGYgKyAyLCBwYWdlICsgaGFsZiAtIDEpO1xuICAgICAgbnVtYmVycy5wdXNoKCdlbGxpcHNpcycpO1xuICAgICAgbnVtYmVycy5wdXNoKHBhZ2VzIC0gMSk7XG4gICAgICBudW1iZXJzLnNwbGljZSgwLCAwLCAnZWxsaXBzaXMnKTtcbiAgICAgIG51bWJlcnMuc3BsaWNlKDAsIDAsIDApO1xuICAgIH1cblxuICAgIG51bWJlcnMuRFRfZWwgPSAnc3Bhbic7XG4gICAgcmV0dXJuIG51bWJlcnM7XG4gIH1cblxuICAkLmV4dGVuZChleHRQYWdpbmF0aW9uLCB7XG4gICAgc2ltcGxlOiBmdW5jdGlvbiBzaW1wbGUocGFnZSwgcGFnZXMpIHtcbiAgICAgIHJldHVybiBbJ3ByZXZpb3VzJywgJ25leHQnXTtcbiAgICB9LFxuICAgIGZ1bGw6IGZ1bmN0aW9uIGZ1bGwocGFnZSwgcGFnZXMpIHtcbiAgICAgIHJldHVybiBbJ2ZpcnN0JywgJ3ByZXZpb3VzJywgJ25leHQnLCAnbGFzdCddO1xuICAgIH0sXG4gICAgbnVtYmVyczogZnVuY3Rpb24gbnVtYmVycyhwYWdlLCBwYWdlcykge1xuICAgICAgcmV0dXJuIFtfbnVtYmVycyhwYWdlLCBwYWdlcyldO1xuICAgIH0sXG4gICAgc2ltcGxlX251bWJlcnM6IGZ1bmN0aW9uIHNpbXBsZV9udW1iZXJzKHBhZ2UsIHBhZ2VzKSB7XG4gICAgICByZXR1cm4gWydwcmV2aW91cycsIF9udW1iZXJzKHBhZ2UsIHBhZ2VzKSwgJ25leHQnXTtcbiAgICB9LFxuICAgIGZ1bGxfbnVtYmVyczogZnVuY3Rpb24gZnVsbF9udW1iZXJzKHBhZ2UsIHBhZ2VzKSB7XG4gICAgICByZXR1cm4gWydmaXJzdCcsICdwcmV2aW91cycsIF9udW1iZXJzKHBhZ2UsIHBhZ2VzKSwgJ25leHQnLCAnbGFzdCddO1xuICAgIH0sXG4gICAgZmlyc3RfbGFzdF9udW1iZXJzOiBmdW5jdGlvbiBmaXJzdF9sYXN0X251bWJlcnMocGFnZSwgcGFnZXMpIHtcbiAgICAgIHJldHVybiBbJ2ZpcnN0JywgX251bWJlcnMocGFnZSwgcGFnZXMpLCAnbGFzdCddO1xuICAgIH0sXG4gICAgX251bWJlcnM6IF9udW1iZXJzLFxuICAgIG51bWJlcnNfbGVuZ3RoOiA3XG4gIH0pO1xuICAkLmV4dGVuZCh0cnVlLCBEYXRhVGFibGUuZXh0LnJlbmRlcmVyLCB7XG4gICAgcGFnZUJ1dHRvbjoge1xuICAgICAgXzogZnVuY3Rpb24gXyhzZXR0aW5ncywgaG9zdCwgaWR4LCBidXR0b25zLCBwYWdlLCBwYWdlcykge1xuICAgICAgICB2YXIgY2xhc3NlcyA9IHNldHRpbmdzLm9DbGFzc2VzO1xuICAgICAgICB2YXIgbGFuZyA9IHNldHRpbmdzLm9MYW5ndWFnZS5vUGFnaW5hdGU7XG4gICAgICAgIHZhciBhcmlhID0gc2V0dGluZ3Mub0xhbmd1YWdlLm9BcmlhLnBhZ2luYXRlIHx8IHt9O1xuICAgICAgICB2YXIgYnRuRGlzcGxheSxcbiAgICAgICAgICAgIGJ0bkNsYXNzLFxuICAgICAgICAgICAgY291bnRlciA9IDA7XG5cbiAgICAgICAgdmFyIGF0dGFjaCA9IGZ1bmN0aW9uIGF0dGFjaChjb250YWluZXIsIGJ1dHRvbnMpIHtcbiAgICAgICAgICB2YXIgaSwgaWVuLCBub2RlLCBidXR0b247XG5cbiAgICAgICAgICB2YXIgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gY2xpY2tIYW5kbGVyKGUpIHtcbiAgICAgICAgICAgIF9mblBhZ2VDaGFuZ2Uoc2V0dGluZ3MsIGUuZGF0YS5hY3Rpb24sIHRydWUpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBmb3IgKGkgPSAwLCBpZW4gPSBidXR0b25zLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgICBidXR0b24gPSBidXR0b25zW2ldO1xuXG4gICAgICAgICAgICBpZiAoJC5pc0FycmF5KGJ1dHRvbikpIHtcbiAgICAgICAgICAgICAgdmFyIGlubmVyID0gJCgnPCcgKyAoYnV0dG9uLkRUX2VsIHx8ICdkaXYnKSArICcvPicpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gICAgICAgICAgICAgIGF0dGFjaChpbm5lciwgYnV0dG9uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJ0bkRpc3BsYXkgPSBudWxsO1xuICAgICAgICAgICAgICBidG5DbGFzcyA9ICcnO1xuXG4gICAgICAgICAgICAgIHN3aXRjaCAoYnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZWxsaXBzaXMnOlxuICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJlbGxpcHNpc1wiPiYjeDIwMjY7PC9zcGFuPicpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdmaXJzdCc6XG4gICAgICAgICAgICAgICAgICBidG5EaXNwbGF5ID0gbGFuZy5zRmlyc3Q7XG4gICAgICAgICAgICAgICAgICBidG5DbGFzcyA9IGJ1dHRvbiArIChwYWdlID4gMCA/ICcnIDogJyAnICsgY2xhc3Nlcy5zUGFnZUJ1dHRvbkRpc2FibGVkKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAncHJldmlvdXMnOlxuICAgICAgICAgICAgICAgICAgYnRuRGlzcGxheSA9IGxhbmcuc1ByZXZpb3VzO1xuICAgICAgICAgICAgICAgICAgYnRuQ2xhc3MgPSBidXR0b24gKyAocGFnZSA+IDAgPyAnJyA6ICcgJyArIGNsYXNzZXMuc1BhZ2VCdXR0b25EaXNhYmxlZCk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ25leHQnOlxuICAgICAgICAgICAgICAgICAgYnRuRGlzcGxheSA9IGxhbmcuc05leHQ7XG4gICAgICAgICAgICAgICAgICBidG5DbGFzcyA9IGJ1dHRvbiArIChwYWdlIDwgcGFnZXMgLSAxID8gJycgOiAnICcgKyBjbGFzc2VzLnNQYWdlQnV0dG9uRGlzYWJsZWQpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdsYXN0JzpcbiAgICAgICAgICAgICAgICAgIGJ0bkRpc3BsYXkgPSBsYW5nLnNMYXN0O1xuICAgICAgICAgICAgICAgICAgYnRuQ2xhc3MgPSBidXR0b24gKyAocGFnZSA8IHBhZ2VzIC0gMSA/ICcnIDogJyAnICsgY2xhc3Nlcy5zUGFnZUJ1dHRvbkRpc2FibGVkKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgIGJ0bkRpc3BsYXkgPSBidXR0b24gKyAxO1xuICAgICAgICAgICAgICAgICAgYnRuQ2xhc3MgPSBwYWdlID09PSBidXR0b24gPyBjbGFzc2VzLnNQYWdlQnV0dG9uQWN0aXZlIDogJyc7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChidG5EaXNwbGF5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9ICQoJzxhPicsIHtcbiAgICAgICAgICAgICAgICAgICdjbGFzcyc6IGNsYXNzZXMuc1BhZ2VCdXR0b24gKyAnICcgKyBidG5DbGFzcyxcbiAgICAgICAgICAgICAgICAgICdhcmlhLWNvbnRyb2xzJzogc2V0dGluZ3Muc1RhYmxlSWQsXG4gICAgICAgICAgICAgICAgICAnYXJpYS1sYWJlbCc6IGFyaWFbYnV0dG9uXSxcbiAgICAgICAgICAgICAgICAgICdkYXRhLWR0LWlkeCc6IGNvdW50ZXIsXG4gICAgICAgICAgICAgICAgICAndGFiaW5kZXgnOiBzZXR0aW5ncy5pVGFiSW5kZXgsXG4gICAgICAgICAgICAgICAgICAnaWQnOiBpZHggPT09IDAgJiYgdHlwZW9mIGJ1dHRvbiA9PT0gJ3N0cmluZycgPyBzZXR0aW5ncy5zVGFibGVJZCArICdfJyArIGJ1dHRvbiA6IG51bGxcbiAgICAgICAgICAgICAgICB9KS5odG1sKGJ0bkRpc3BsYXkpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgICAgICBfZm5CaW5kQWN0aW9uKG5vZGUsIHtcbiAgICAgICAgICAgICAgICAgIGFjdGlvbjogYnV0dG9uXG4gICAgICAgICAgICAgICAgfSwgY2xpY2tIYW5kbGVyKTtcblxuICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgYWN0aXZlRWw7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhY3RpdmVFbCA9ICQoaG9zdCkuZmluZChkb2N1bWVudC5hY3RpdmVFbGVtZW50KS5kYXRhKCdkdC1pZHgnKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cblxuICAgICAgICBhdHRhY2goJChob3N0KS5lbXB0eSgpLCBidXR0b25zKTtcblxuICAgICAgICBpZiAoYWN0aXZlRWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICQoaG9zdCkuZmluZCgnW2RhdGEtZHQtaWR4PScgKyBhY3RpdmVFbCArICddJykuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gICQuZXh0ZW5kKERhdGFUYWJsZS5leHQudHlwZS5kZXRlY3QsIFtmdW5jdGlvbiAoZCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgZGVjaW1hbCA9IHNldHRpbmdzLm9MYW5ndWFnZS5zRGVjaW1hbDtcbiAgICByZXR1cm4gX2lzTnVtYmVyKGQsIGRlY2ltYWwpID8gJ251bScgKyBkZWNpbWFsIDogbnVsbDtcbiAgfSwgZnVuY3Rpb24gKGQsIHNldHRpbmdzKSB7XG4gICAgaWYgKGQgJiYgIShkIGluc3RhbmNlb2YgRGF0ZSkgJiYgIV9yZV9kYXRlLnRlc3QoZCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBwYXJzZWQgPSBEYXRlLnBhcnNlKGQpO1xuICAgIHJldHVybiBwYXJzZWQgIT09IG51bGwgJiYgIWlzTmFOKHBhcnNlZCkgfHwgX2VtcHR5KGQpID8gJ2RhdGUnIDogbnVsbDtcbiAgfSwgZnVuY3Rpb24gKGQsIHNldHRpbmdzKSB7XG4gICAgdmFyIGRlY2ltYWwgPSBzZXR0aW5ncy5vTGFuZ3VhZ2Uuc0RlY2ltYWw7XG4gICAgcmV0dXJuIF9pc051bWJlcihkLCBkZWNpbWFsLCB0cnVlKSA/ICdudW0tZm10JyArIGRlY2ltYWwgOiBudWxsO1xuICB9LCBmdW5jdGlvbiAoZCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgZGVjaW1hbCA9IHNldHRpbmdzLm9MYW5ndWFnZS5zRGVjaW1hbDtcbiAgICByZXR1cm4gX2h0bWxOdW1lcmljKGQsIGRlY2ltYWwpID8gJ2h0bWwtbnVtJyArIGRlY2ltYWwgOiBudWxsO1xuICB9LCBmdW5jdGlvbiAoZCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgZGVjaW1hbCA9IHNldHRpbmdzLm9MYW5ndWFnZS5zRGVjaW1hbDtcbiAgICByZXR1cm4gX2h0bWxOdW1lcmljKGQsIGRlY2ltYWwsIHRydWUpID8gJ2h0bWwtbnVtLWZtdCcgKyBkZWNpbWFsIDogbnVsbDtcbiAgfSwgZnVuY3Rpb24gKGQsIHNldHRpbmdzKSB7XG4gICAgcmV0dXJuIF9lbXB0eShkKSB8fCB0eXBlb2YgZCA9PT0gJ3N0cmluZycgJiYgZC5pbmRleE9mKCc8JykgIT09IC0xID8gJ2h0bWwnIDogbnVsbDtcbiAgfV0pO1xuICAkLmV4dGVuZChEYXRhVGFibGUuZXh0LnR5cGUuc2VhcmNoLCB7XG4gICAgaHRtbDogZnVuY3Rpb24gaHRtbChkYXRhKSB7XG4gICAgICByZXR1cm4gX2VtcHR5KGRhdGEpID8gZGF0YSA6IHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyA/IGRhdGEucmVwbGFjZShfcmVfbmV3X2xpbmVzLCBcIiBcIikucmVwbGFjZShfcmVfaHRtbCwgXCJcIikgOiAnJztcbiAgICB9LFxuICAgIHN0cmluZzogZnVuY3Rpb24gc3RyaW5nKGRhdGEpIHtcbiAgICAgIHJldHVybiBfZW1wdHkoZGF0YSkgPyBkYXRhIDogdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnID8gZGF0YS5yZXBsYWNlKF9yZV9uZXdfbGluZXMsIFwiIFwiKSA6IGRhdGE7XG4gICAgfVxuICB9KTtcblxuICB2YXIgX19udW1lcmljUmVwbGFjZSA9IGZ1bmN0aW9uIF9fbnVtZXJpY1JlcGxhY2UoZCwgZGVjaW1hbFBsYWNlLCByZTEsIHJlMikge1xuICAgIGlmIChkICE9PSAwICYmICghZCB8fCBkID09PSAnLScpKSB7XG4gICAgICByZXR1cm4gLUluZmluaXR5O1xuICAgIH1cblxuICAgIGlmIChkZWNpbWFsUGxhY2UpIHtcbiAgICAgIGQgPSBfbnVtVG9EZWNpbWFsKGQsIGRlY2ltYWxQbGFjZSk7XG4gICAgfVxuXG4gICAgaWYgKGQucmVwbGFjZSkge1xuICAgICAgaWYgKHJlMSkge1xuICAgICAgICBkID0gZC5yZXBsYWNlKHJlMSwgJycpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmUyKSB7XG4gICAgICAgIGQgPSBkLnJlcGxhY2UocmUyLCAnJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGQgKiAxO1xuICB9O1xuXG4gIGZ1bmN0aW9uIF9hZGROdW1lcmljU29ydChkZWNpbWFsUGxhY2UpIHtcbiAgICAkLmVhY2goe1xuICAgICAgXCJudW1cIjogZnVuY3Rpb24gbnVtKGQpIHtcbiAgICAgICAgcmV0dXJuIF9fbnVtZXJpY1JlcGxhY2UoZCwgZGVjaW1hbFBsYWNlKTtcbiAgICAgIH0sXG4gICAgICBcIm51bS1mbXRcIjogZnVuY3Rpb24gbnVtRm10KGQpIHtcbiAgICAgICAgcmV0dXJuIF9fbnVtZXJpY1JlcGxhY2UoZCwgZGVjaW1hbFBsYWNlLCBfcmVfZm9ybWF0dGVkX251bWVyaWMpO1xuICAgICAgfSxcbiAgICAgIFwiaHRtbC1udW1cIjogZnVuY3Rpb24gaHRtbE51bShkKSB7XG4gICAgICAgIHJldHVybiBfX251bWVyaWNSZXBsYWNlKGQsIGRlY2ltYWxQbGFjZSwgX3JlX2h0bWwpO1xuICAgICAgfSxcbiAgICAgIFwiaHRtbC1udW0tZm10XCI6IGZ1bmN0aW9uIGh0bWxOdW1GbXQoZCkge1xuICAgICAgICByZXR1cm4gX19udW1lcmljUmVwbGFjZShkLCBkZWNpbWFsUGxhY2UsIF9yZV9odG1sLCBfcmVfZm9ybWF0dGVkX251bWVyaWMpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChrZXksIGZuKSB7XG4gICAgICBfZXh0LnR5cGUub3JkZXJba2V5ICsgZGVjaW1hbFBsYWNlICsgJy1wcmUnXSA9IGZuO1xuXG4gICAgICBpZiAoa2V5Lm1hdGNoKC9eaHRtbFxcLS8pKSB7XG4gICAgICAgIF9leHQudHlwZS5zZWFyY2hba2V5ICsgZGVjaW1hbFBsYWNlXSA9IF9leHQudHlwZS5zZWFyY2guaHRtbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gICQuZXh0ZW5kKF9leHQudHlwZS5vcmRlciwge1xuICAgIFwiZGF0ZS1wcmVcIjogZnVuY3Rpb24gZGF0ZVByZShkKSB7XG4gICAgICB2YXIgdHMgPSBEYXRlLnBhcnNlKGQpO1xuICAgICAgcmV0dXJuIGlzTmFOKHRzKSA/IC1JbmZpbml0eSA6IHRzO1xuICAgIH0sXG4gICAgXCJodG1sLXByZVwiOiBmdW5jdGlvbiBodG1sUHJlKGEpIHtcbiAgICAgIHJldHVybiBfZW1wdHkoYSkgPyAnJyA6IGEucmVwbGFjZSA/IGEucmVwbGFjZSgvPC4qPz4vZywgXCJcIikudG9Mb3dlckNhc2UoKSA6IGEgKyAnJztcbiAgICB9LFxuICAgIFwic3RyaW5nLXByZVwiOiBmdW5jdGlvbiBzdHJpbmdQcmUoYSkge1xuICAgICAgcmV0dXJuIF9lbXB0eShhKSA/ICcnIDogdHlwZW9mIGEgPT09ICdzdHJpbmcnID8gYS50b0xvd2VyQ2FzZSgpIDogIWEudG9TdHJpbmcgPyAnJyA6IGEudG9TdHJpbmcoKTtcbiAgICB9LFxuICAgIFwic3RyaW5nLWFzY1wiOiBmdW5jdGlvbiBzdHJpbmdBc2MoeCwgeSkge1xuICAgICAgcmV0dXJuIHggPCB5ID8gLTEgOiB4ID4geSA/IDEgOiAwO1xuICAgIH0sXG4gICAgXCJzdHJpbmctZGVzY1wiOiBmdW5jdGlvbiBzdHJpbmdEZXNjKHgsIHkpIHtcbiAgICAgIHJldHVybiB4IDwgeSA/IDEgOiB4ID4geSA/IC0xIDogMDtcbiAgICB9XG4gIH0pO1xuXG4gIF9hZGROdW1lcmljU29ydCgnJyk7XG5cbiAgJC5leHRlbmQodHJ1ZSwgRGF0YVRhYmxlLmV4dC5yZW5kZXJlciwge1xuICAgIGhlYWRlcjoge1xuICAgICAgXzogZnVuY3Rpb24gXyhzZXR0aW5ncywgY2VsbCwgY29sdW1uLCBjbGFzc2VzKSB7XG4gICAgICAgICQoc2V0dGluZ3MublRhYmxlKS5vbignb3JkZXIuZHQuRFQnLCBmdW5jdGlvbiAoZSwgY3R4LCBzb3J0aW5nLCBjb2x1bW5zKSB7XG4gICAgICAgICAgaWYgKHNldHRpbmdzICE9PSBjdHgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgY29sSWR4ID0gY29sdW1uLmlkeDtcbiAgICAgICAgICBjZWxsLnJlbW92ZUNsYXNzKGNvbHVtbi5zU29ydGluZ0NsYXNzICsgJyAnICsgY2xhc3Nlcy5zU29ydEFzYyArICcgJyArIGNsYXNzZXMuc1NvcnREZXNjKS5hZGRDbGFzcyhjb2x1bW5zW2NvbElkeF0gPT0gJ2FzYycgPyBjbGFzc2VzLnNTb3J0QXNjIDogY29sdW1uc1tjb2xJZHhdID09ICdkZXNjJyA/IGNsYXNzZXMuc1NvcnREZXNjIDogY29sdW1uLnNTb3J0aW5nQ2xhc3MpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBqcXVlcnl1aTogZnVuY3Rpb24ganF1ZXJ5dWkoc2V0dGluZ3MsIGNlbGwsIGNvbHVtbiwgY2xhc3Nlcykge1xuICAgICAgICAkKCc8ZGl2Lz4nKS5hZGRDbGFzcyhjbGFzc2VzLnNTb3J0SlVJV3JhcHBlcikuYXBwZW5kKGNlbGwuY29udGVudHMoKSkuYXBwZW5kKCQoJzxzcGFuLz4nKS5hZGRDbGFzcyhjbGFzc2VzLnNTb3J0SWNvbiArICcgJyArIGNvbHVtbi5zU29ydGluZ0NsYXNzSlVJKSkuYXBwZW5kVG8oY2VsbCk7XG4gICAgICAgICQoc2V0dGluZ3MublRhYmxlKS5vbignb3JkZXIuZHQuRFQnLCBmdW5jdGlvbiAoZSwgY3R4LCBzb3J0aW5nLCBjb2x1bW5zKSB7XG4gICAgICAgICAgaWYgKHNldHRpbmdzICE9PSBjdHgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgY29sSWR4ID0gY29sdW1uLmlkeDtcbiAgICAgICAgICBjZWxsLnJlbW92ZUNsYXNzKGNsYXNzZXMuc1NvcnRBc2MgKyBcIiBcIiArIGNsYXNzZXMuc1NvcnREZXNjKS5hZGRDbGFzcyhjb2x1bW5zW2NvbElkeF0gPT0gJ2FzYycgPyBjbGFzc2VzLnNTb3J0QXNjIDogY29sdW1uc1tjb2xJZHhdID09ICdkZXNjJyA/IGNsYXNzZXMuc1NvcnREZXNjIDogY29sdW1uLnNTb3J0aW5nQ2xhc3MpO1xuICAgICAgICAgIGNlbGwuZmluZCgnc3Bhbi4nICsgY2xhc3Nlcy5zU29ydEljb24pLnJlbW92ZUNsYXNzKGNsYXNzZXMuc1NvcnRKVUlBc2MgKyBcIiBcIiArIGNsYXNzZXMuc1NvcnRKVUlEZXNjICsgXCIgXCIgKyBjbGFzc2VzLnNTb3J0SlVJICsgXCIgXCIgKyBjbGFzc2VzLnNTb3J0SlVJQXNjQWxsb3dlZCArIFwiIFwiICsgY2xhc3Nlcy5zU29ydEpVSURlc2NBbGxvd2VkKS5hZGRDbGFzcyhjb2x1bW5zW2NvbElkeF0gPT0gJ2FzYycgPyBjbGFzc2VzLnNTb3J0SlVJQXNjIDogY29sdW1uc1tjb2xJZHhdID09ICdkZXNjJyA/IGNsYXNzZXMuc1NvcnRKVUlEZXNjIDogY29sdW1uLnNTb3J0aW5nQ2xhc3NKVUkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHZhciBfX2h0bWxFc2NhcGVFbnRpdGllcyA9IGZ1bmN0aW9uIF9faHRtbEVzY2FwZUVudGl0aWVzKGQpIHtcbiAgICByZXR1cm4gdHlwZW9mIGQgPT09ICdzdHJpbmcnID8gZC5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKSA6IGQ7XG4gIH07XG5cbiAgRGF0YVRhYmxlLnJlbmRlciA9IHtcbiAgICBudW1iZXI6IGZ1bmN0aW9uIG51bWJlcih0aG91c2FuZHMsIGRlY2ltYWwsIHByZWNpc2lvbiwgcHJlZml4LCBwb3N0Zml4KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkaXNwbGF5OiBmdW5jdGlvbiBkaXNwbGF5KGQpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGQgIT09ICdudW1iZXInICYmIHR5cGVvZiBkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIGQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIG5lZ2F0aXZlID0gZCA8IDAgPyAnLScgOiAnJztcbiAgICAgICAgICB2YXIgZmxvID0gcGFyc2VGbG9hdChkKTtcblxuICAgICAgICAgIGlmIChpc05hTihmbG8pKSB7XG4gICAgICAgICAgICByZXR1cm4gX19odG1sRXNjYXBlRW50aXRpZXMoZCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZmxvID0gZmxvLnRvRml4ZWQocHJlY2lzaW9uKTtcbiAgICAgICAgICBkID0gTWF0aC5hYnMoZmxvKTtcbiAgICAgICAgICB2YXIgaW50UGFydCA9IHBhcnNlSW50KGQsIDEwKTtcbiAgICAgICAgICB2YXIgZmxvYXRQYXJ0ID0gcHJlY2lzaW9uID8gZGVjaW1hbCArIChkIC0gaW50UGFydCkudG9GaXhlZChwcmVjaXNpb24pLnN1YnN0cmluZygyKSA6ICcnO1xuICAgICAgICAgIHJldHVybiBuZWdhdGl2ZSArIChwcmVmaXggfHwgJycpICsgaW50UGFydC50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIHRob3VzYW5kcykgKyBmbG9hdFBhcnQgKyAocG9zdGZpeCB8fCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICB0ZXh0OiBmdW5jdGlvbiB0ZXh0KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGlzcGxheTogX19odG1sRXNjYXBlRW50aXRpZXNcbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIF9mbkV4dGVybkFwaUZ1bmMoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbX2ZuU2V0dGluZ3NGcm9tTm9kZSh0aGlzW0RhdGFUYWJsZS5leHQuaUFwaUluZGV4XSldLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICAgIHJldHVybiBEYXRhVGFibGUuZXh0LmludGVybmFsW2ZuXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9O1xuICB9XG5cbiAgJC5leHRlbmQoRGF0YVRhYmxlLmV4dC5pbnRlcm5hbCwge1xuICAgIF9mbkV4dGVybkFwaUZ1bmM6IF9mbkV4dGVybkFwaUZ1bmMsXG4gICAgX2ZuQnVpbGRBamF4OiBfZm5CdWlsZEFqYXgsXG4gICAgX2ZuQWpheFVwZGF0ZTogX2ZuQWpheFVwZGF0ZSxcbiAgICBfZm5BamF4UGFyYW1ldGVyczogX2ZuQWpheFBhcmFtZXRlcnMsXG4gICAgX2ZuQWpheFVwZGF0ZURyYXc6IF9mbkFqYXhVcGRhdGVEcmF3LFxuICAgIF9mbkFqYXhEYXRhU3JjOiBfZm5BamF4RGF0YVNyYyxcbiAgICBfZm5BZGRDb2x1bW46IF9mbkFkZENvbHVtbixcbiAgICBfZm5Db2x1bW5PcHRpb25zOiBfZm5Db2x1bW5PcHRpb25zLFxuICAgIF9mbkFkanVzdENvbHVtblNpemluZzogX2ZuQWRqdXN0Q29sdW1uU2l6aW5nLFxuICAgIF9mblZpc2libGVUb0NvbHVtbkluZGV4OiBfZm5WaXNpYmxlVG9Db2x1bW5JbmRleCxcbiAgICBfZm5Db2x1bW5JbmRleFRvVmlzaWJsZTogX2ZuQ29sdW1uSW5kZXhUb1Zpc2libGUsXG4gICAgX2ZuVmlzYmxlQ29sdW1uczogX2ZuVmlzYmxlQ29sdW1ucyxcbiAgICBfZm5HZXRDb2x1bW5zOiBfZm5HZXRDb2x1bW5zLFxuICAgIF9mbkNvbHVtblR5cGVzOiBfZm5Db2x1bW5UeXBlcyxcbiAgICBfZm5BcHBseUNvbHVtbkRlZnM6IF9mbkFwcGx5Q29sdW1uRGVmcyxcbiAgICBfZm5IdW5nYXJpYW5NYXA6IF9mbkh1bmdhcmlhbk1hcCxcbiAgICBfZm5DYW1lbFRvSHVuZ2FyaWFuOiBfZm5DYW1lbFRvSHVuZ2FyaWFuLFxuICAgIF9mbkxhbmd1YWdlQ29tcGF0OiBfZm5MYW5ndWFnZUNvbXBhdCxcbiAgICBfZm5Ccm93c2VyRGV0ZWN0OiBfZm5Ccm93c2VyRGV0ZWN0LFxuICAgIF9mbkFkZERhdGE6IF9mbkFkZERhdGEsXG4gICAgX2ZuQWRkVHI6IF9mbkFkZFRyLFxuICAgIF9mbk5vZGVUb0RhdGFJbmRleDogX2ZuTm9kZVRvRGF0YUluZGV4LFxuICAgIF9mbk5vZGVUb0NvbHVtbkluZGV4OiBfZm5Ob2RlVG9Db2x1bW5JbmRleCxcbiAgICBfZm5HZXRDZWxsRGF0YTogX2ZuR2V0Q2VsbERhdGEsXG4gICAgX2ZuU2V0Q2VsbERhdGE6IF9mblNldENlbGxEYXRhLFxuICAgIF9mblNwbGl0T2JqTm90YXRpb246IF9mblNwbGl0T2JqTm90YXRpb24sXG4gICAgX2ZuR2V0T2JqZWN0RGF0YUZuOiBfZm5HZXRPYmplY3REYXRhRm4sXG4gICAgX2ZuU2V0T2JqZWN0RGF0YUZuOiBfZm5TZXRPYmplY3REYXRhRm4sXG4gICAgX2ZuR2V0RGF0YU1hc3RlcjogX2ZuR2V0RGF0YU1hc3RlcixcbiAgICBfZm5DbGVhclRhYmxlOiBfZm5DbGVhclRhYmxlLFxuICAgIF9mbkRlbGV0ZUluZGV4OiBfZm5EZWxldGVJbmRleCxcbiAgICBfZm5JbnZhbGlkYXRlOiBfZm5JbnZhbGlkYXRlLFxuICAgIF9mbkdldFJvd0VsZW1lbnRzOiBfZm5HZXRSb3dFbGVtZW50cyxcbiAgICBfZm5DcmVhdGVUcjogX2ZuQ3JlYXRlVHIsXG4gICAgX2ZuQnVpbGRIZWFkOiBfZm5CdWlsZEhlYWQsXG4gICAgX2ZuRHJhd0hlYWQ6IF9mbkRyYXdIZWFkLFxuICAgIF9mbkRyYXc6IF9mbkRyYXcsXG4gICAgX2ZuUmVEcmF3OiBfZm5SZURyYXcsXG4gICAgX2ZuQWRkT3B0aW9uc0h0bWw6IF9mbkFkZE9wdGlvbnNIdG1sLFxuICAgIF9mbkRldGVjdEhlYWRlcjogX2ZuRGV0ZWN0SGVhZGVyLFxuICAgIF9mbkdldFVuaXF1ZVRoczogX2ZuR2V0VW5pcXVlVGhzLFxuICAgIF9mbkZlYXR1cmVIdG1sRmlsdGVyOiBfZm5GZWF0dXJlSHRtbEZpbHRlcixcbiAgICBfZm5GaWx0ZXJDb21wbGV0ZTogX2ZuRmlsdGVyQ29tcGxldGUsXG4gICAgX2ZuRmlsdGVyQ3VzdG9tOiBfZm5GaWx0ZXJDdXN0b20sXG4gICAgX2ZuRmlsdGVyQ29sdW1uOiBfZm5GaWx0ZXJDb2x1bW4sXG4gICAgX2ZuRmlsdGVyOiBfZm5GaWx0ZXIsXG4gICAgX2ZuRmlsdGVyQ3JlYXRlU2VhcmNoOiBfZm5GaWx0ZXJDcmVhdGVTZWFyY2gsXG4gICAgX2ZuRXNjYXBlUmVnZXg6IF9mbkVzY2FwZVJlZ2V4LFxuICAgIF9mbkZpbHRlckRhdGE6IF9mbkZpbHRlckRhdGEsXG4gICAgX2ZuRmVhdHVyZUh0bWxJbmZvOiBfZm5GZWF0dXJlSHRtbEluZm8sXG4gICAgX2ZuVXBkYXRlSW5mbzogX2ZuVXBkYXRlSW5mbyxcbiAgICBfZm5JbmZvTWFjcm9zOiBfZm5JbmZvTWFjcm9zLFxuICAgIF9mbkluaXRpYWxpc2U6IF9mbkluaXRpYWxpc2UsXG4gICAgX2ZuSW5pdENvbXBsZXRlOiBfZm5Jbml0Q29tcGxldGUsXG4gICAgX2ZuTGVuZ3RoQ2hhbmdlOiBfZm5MZW5ndGhDaGFuZ2UsXG4gICAgX2ZuRmVhdHVyZUh0bWxMZW5ndGg6IF9mbkZlYXR1cmVIdG1sTGVuZ3RoLFxuICAgIF9mbkZlYXR1cmVIdG1sUGFnaW5hdGU6IF9mbkZlYXR1cmVIdG1sUGFnaW5hdGUsXG4gICAgX2ZuUGFnZUNoYW5nZTogX2ZuUGFnZUNoYW5nZSxcbiAgICBfZm5GZWF0dXJlSHRtbFByb2Nlc3Npbmc6IF9mbkZlYXR1cmVIdG1sUHJvY2Vzc2luZyxcbiAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheTogX2ZuUHJvY2Vzc2luZ0Rpc3BsYXksXG4gICAgX2ZuRmVhdHVyZUh0bWxUYWJsZTogX2ZuRmVhdHVyZUh0bWxUYWJsZSxcbiAgICBfZm5TY3JvbGxEcmF3OiBfZm5TY3JvbGxEcmF3LFxuICAgIF9mbkFwcGx5VG9DaGlsZHJlbjogX2ZuQXBwbHlUb0NoaWxkcmVuLFxuICAgIF9mbkNhbGN1bGF0ZUNvbHVtbldpZHRoczogX2ZuQ2FsY3VsYXRlQ29sdW1uV2lkdGhzLFxuICAgIF9mblRocm90dGxlOiBfZm5UaHJvdHRsZSxcbiAgICBfZm5Db252ZXJ0VG9XaWR0aDogX2ZuQ29udmVydFRvV2lkdGgsXG4gICAgX2ZuR2V0V2lkZXN0Tm9kZTogX2ZuR2V0V2lkZXN0Tm9kZSxcbiAgICBfZm5HZXRNYXhMZW5TdHJpbmc6IF9mbkdldE1heExlblN0cmluZyxcbiAgICBfZm5TdHJpbmdUb0NzczogX2ZuU3RyaW5nVG9Dc3MsXG4gICAgX2ZuU29ydEZsYXR0ZW46IF9mblNvcnRGbGF0dGVuLFxuICAgIF9mblNvcnQ6IF9mblNvcnQsXG4gICAgX2ZuU29ydEFyaWE6IF9mblNvcnRBcmlhLFxuICAgIF9mblNvcnRMaXN0ZW5lcjogX2ZuU29ydExpc3RlbmVyLFxuICAgIF9mblNvcnRBdHRhY2hMaXN0ZW5lcjogX2ZuU29ydEF0dGFjaExpc3RlbmVyLFxuICAgIF9mblNvcnRpbmdDbGFzc2VzOiBfZm5Tb3J0aW5nQ2xhc3NlcyxcbiAgICBfZm5Tb3J0RGF0YTogX2ZuU29ydERhdGEsXG4gICAgX2ZuU2F2ZVN0YXRlOiBfZm5TYXZlU3RhdGUsXG4gICAgX2ZuTG9hZFN0YXRlOiBfZm5Mb2FkU3RhdGUsXG4gICAgX2ZuU2V0dGluZ3NGcm9tTm9kZTogX2ZuU2V0dGluZ3NGcm9tTm9kZSxcbiAgICBfZm5Mb2c6IF9mbkxvZyxcbiAgICBfZm5NYXA6IF9mbk1hcCxcbiAgICBfZm5CaW5kQWN0aW9uOiBfZm5CaW5kQWN0aW9uLFxuICAgIF9mbkNhbGxiYWNrUmVnOiBfZm5DYWxsYmFja1JlZyxcbiAgICBfZm5DYWxsYmFja0ZpcmU6IF9mbkNhbGxiYWNrRmlyZSxcbiAgICBfZm5MZW5ndGhPdmVyZmxvdzogX2ZuTGVuZ3RoT3ZlcmZsb3csXG4gICAgX2ZuUmVuZGVyZXI6IF9mblJlbmRlcmVyLFxuICAgIF9mbkRhdGFTb3VyY2U6IF9mbkRhdGFTb3VyY2UsXG4gICAgX2ZuUm93QXR0cmlidXRlczogX2ZuUm93QXR0cmlidXRlcyxcbiAgICBfZm5FeHRlbmQ6IF9mbkV4dGVuZCxcbiAgICBfZm5DYWxjdWxhdGVFbmQ6IGZ1bmN0aW9uIF9mbkNhbGN1bGF0ZUVuZCgpIHt9XG4gIH0pO1xuICAkLmZuLmRhdGFUYWJsZSA9IERhdGFUYWJsZTtcbiAgRGF0YVRhYmxlLiQgPSAkO1xuICAkLmZuLmRhdGFUYWJsZVNldHRpbmdzID0gRGF0YVRhYmxlLnNldHRpbmdzO1xuICAkLmZuLmRhdGFUYWJsZUV4dCA9IERhdGFUYWJsZS5leHQ7XG5cbiAgJC5mbi5EYXRhVGFibGUgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiAkKHRoaXMpLmRhdGFUYWJsZShvcHRzKS5hcGkoKTtcbiAgfTtcblxuICAkLmVhY2goRGF0YVRhYmxlLCBmdW5jdGlvbiAocHJvcCwgdmFsKSB7XG4gICAgJC5mbi5EYXRhVGFibGVbcHJvcF0gPSB2YWw7XG4gIH0pO1xuICByZXR1cm4gJC5mbi5kYXRhVGFibGU7XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdGRENUX0Ryb3BEb3duU2VsZWN0ID0ge1xuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKF9yZW5kZXJlckNoYWluUGFyYXMpIHt9LFxuICBSZW5kZXJlckRhdGFDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJEYXRhQ2hhaW4sXG4gIEdldFZhbHVlOiBIVE1MQ29udHJvbC5HZXRWYWx1ZSxcbiAgU2V0VmFsdWU6IEhUTUxDb250cm9sLlNldFZhbHVlXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0ZEQ1RfU2ltcGxlTGFiZWwgPSB7XG4gIFJlbmRlcmVyQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckRhdGFDaGFpbixcbiAgR2V0VmFsdWU6IEhUTUxDb250cm9sLkdldFZhbHVlLFxuICBTZXRWYWx1ZTogZnVuY3Rpb24gU2V0VmFsdWUoJGVsZW0sIGZpZWxkUE8sIHJlbGF0aW9uRm9ybVJlY29yZENvbXBsZXhQbywgX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMpIHtcbiAgICBpZiAoZmllbGRQTykge1xuICAgICAgJGVsZW0udGV4dChmaWVsZFBPLnZhbHVlKTtcbiAgICAgICRlbGVtLmF0dHIoXCJjb250cm9sX3ZhbHVlXCIsIGZpZWxkUE8udmFsdWUpO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdGRENUX1N1YkZvcm1MaXN0Q29udGFpbmVyID0ge1xuICBfQWRkQnV0dG9uRWxlbTogbnVsbCxcbiAgXyRUZW1wbGF0ZVRhYmxlUm93OiBudWxsLFxuICBfJFNpbmdsZUNvbnRyb2xFbGVtOiBudWxsLFxuICBfJFRhYmxlRWxlbTogbnVsbCxcbiAgXyRUYWJsZUhlYWRFbGVtOiBudWxsLFxuICBfJFRhYmxlQm9keUVsZW06IG51bGwsXG4gIF9FZGl0SW5Sb3c6IHRydWUsXG4gIF9EaXNwbGF5X09QQnV0dG9uc19BZGQ6IHRydWUsXG4gIF9EaXNwbGF5X09QQnV0dG9uc19VcGRhdGU6IHRydWUsXG4gIF9EaXNwbGF5X09QQnV0dG9uc19EZWw6IHRydWUsXG4gIF9EaXNwbGF5X09QQnV0dG9uc19WaWV3OiB0cnVlLFxuICBfRm9ybVJ1bnRpbWVIb3N0OiBudWxsLFxuICBfRm9ybURhdGFSZWxhdGlvbkxpc3Q6IG51bGwsXG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0gPSAkc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdGhpcy5fJFRhYmxlRWxlbSA9IHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGVcIik7XG4gICAgdGhpcy5fJFRhYmxlQm9keUVsZW0gPSB0aGlzLl8kVGFibGVFbGVtLmZpbmQoXCJ0Ym9keVwiKTtcbiAgICB0aGlzLl8kVGFibGVIZWFkRWxlbSA9IHRoaXMuXyRUYWJsZUVsZW0uZmluZChcInRoZWFkXCIpO1xuICAgIHRoaXMuX0VkaXRJblJvdyA9ICRzaW5nbGVDb250cm9sRWxlbS5hdHRyKFwiZWRpdGlucm93XCIpID09IFwiZmFsc2VcIiA/IGZhbHNlIDogdHJ1ZTtcbiAgICB0aGlzLl9Gb3JtUnVudGltZUhvc3QgPSBfcmVuZGVyZXJDaGFpblBhcmFzLmZvcm1SdW50aW1lSW5zdGFuY2U7XG4gICAgdGhpcy5fRm9ybURhdGFSZWxhdGlvbkxpc3QgPSB0aGlzLl9Gb3JtUnVudGltZUhvc3QuX0Zvcm1EYXRhUmVsYXRpb25MaXN0O1xuICAgIHZhciBvcGJ1dHRvbnMgPSAkc2luZ2xlQ29udHJvbEVsZW0uYXR0cihcIm9wYnV0dG9uc1wiKTtcbiAgICB0aGlzLl9EaXNwbGF5X09QQnV0dG9uc19BZGQgPSBvcGJ1dHRvbnMuaW5kZXhPZihcImFkZFwiKSA+PSAwO1xuICAgIHRoaXMuX0Rpc3BsYXlfT1BCdXR0b25zX1VwZGF0ZSA9IG9wYnV0dG9ucy5pbmRleE9mKFwidXBkYXRlXCIpID49IDA7XG4gICAgdGhpcy5fRGlzcGxheV9PUEJ1dHRvbnNfRGVsID0gb3BidXR0b25zLmluZGV4T2YoXCJkZWxldGVcIikgPj0gMDtcbiAgICB0aGlzLl9EaXNwbGF5X09QQnV0dG9uc19WaWV3ID0gb3BidXR0b25zLmluZGV4T2YoXCJ2aWV3XCIpID49IDA7XG4gICAgdmFyIHNvdXJjZUhUTUwgPSAkc2luZ2xlQ29udHJvbEVsZW0uaHRtbCgpO1xuICAgIHZhciBzb3VyY2VUYWJsZSA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGVbaXNfdGVtcGxhdGVfdGFibGU9J3RydWUnXVwiKTtcbiAgICBzb3VyY2VUYWJsZS5hZGRDbGFzcyhcInN1Yi1mb3JtLWxpc3QtdGFibGVcIik7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmh0bWwoXCJcIik7XG4gICAgdGhpcy5fQWRkQnV0dG9uRWxlbSA9ICQoXCI8ZGl2IGNsYXNzPSdzZmxiLWJ1dHRvbiBzZmxiLWFkZCcgdGl0bGU9J+aWsOWinic+5paw5aKePC9kaXY+XCIpO1xuXG4gICAgaWYgKHRoaXMuX0Rpc3BsYXlfT1BCdXR0b25zX0FkZCkge1xuICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtLnByZXBlbmQoXCI8ZGl2IGNsYXNzPSdzdWItZm9ybS1saXN0LWJ1dHRvbi13cmFwJz48L2Rpdj5cIikuZmluZChcImRpdlwiKS5hcHBlbmQodGhpcy5fQWRkQnV0dG9uRWxlbSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX0Rpc3BsYXlfT1BCdXR0b25zX0RlbCB8fCB0aGlzLl9EaXNwbGF5X09QQnV0dG9uc19VcGRhdGUgfHwgdGhpcy5fRGlzcGxheV9PUEJ1dHRvbnNfVmlldykge1xuICAgICAgdGhpcy5fJFRhYmxlSGVhZEVsZW0uZmluZChcInRyXCIpLmFwcGVuZChcIjx0aCBzdHlsZT0nd2lkdGg6IDEyMHB4Jz7mk43kvZw8L3RoPlwiKTtcbiAgICB9XG5cbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uYXBwZW5kKHNvdXJjZVRhYmxlKTtcbiAgICB2YXIgaW5zdGFuY2VOYW1lID0gSFRNTENvbnRyb2wuR2V0Q29udHJvbEluc3RhbmNlTmFtZUJ5RWxlbSgkc2luZ2xlQ29udHJvbEVsZW0pO1xuXG4gICAgdGhpcy5fQWRkQnV0dG9uRWxlbS5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgaG9zdEVsZW06ICRzaW5nbGVDb250cm9sRWxlbSxcbiAgICAgIF9yZW5kZXJlckNoYWluUGFyYXM6IF9yZW5kZXJlckNoYWluUGFyYXMsXG4gICAgICBzZWxmT2JqOiB0aGlzLFxuICAgICAgaW5zdGFuY2VOYW1lOiBpbnN0YW5jZU5hbWVcbiAgICB9LCB0aGlzLkFkZEV2ZW50KTtcblxuICAgIHRoaXMuXyRUZW1wbGF0ZVRhYmxlUm93ID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZSB0Ym9keSB0clwiKS5jbG9uZSgpO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGUgdGJvZHkgdHJcIikucmVtb3ZlKCk7XG4gICAgdmFyIHZhbGlkYXRlUmVuZGVyZXJDaGFpbkVuYWJsZSA9IHRoaXMuVmFsaWRhdGVSZW5kZXJlckNoYWluRW5hYmxlKCk7XG5cbiAgICBpZiAoIXZhbGlkYXRlUmVuZGVyZXJDaGFpbkVuYWJsZS5zdWNjZXNzKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dCh2YWxpZGF0ZVJlbmRlcmVyQ2hhaW5FbmFibGUubXNnKTtcbiAgICB9XG5cbiAgICB2YXIgcmVsYXRpb25QTyA9IHRoaXMuVHJ5R2V0UmVsYXRpb25QT0Nsb25lKCk7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmF0dHIoXCJyZWxhdGlvbl9wb19pZFwiLCByZWxhdGlvblBPLmlkKTtcbiAgfSxcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyRGF0YUNoYWluKF9yZW5kZXJlckRhdGFDaGFpblBhcmFzKSB7XG4gICAgdmFyICRzaW5nbGVDb250cm9sRWxlbSA9IF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB2YXIgcmVsYXRpb25Gb3JtUmVjb3JkQ29tcGxleFBvID0gX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMucmVsYXRpb25Gb3JtUmVjb3JkQ29tcGxleFBvO1xuICAgIHZhciByZWxhdGlvbl9wb19pZCA9ICRzaW5nbGVDb250cm9sRWxlbS5hdHRyKFwicmVsYXRpb25fcG9faWRcIik7XG4gICAgdmFyIHJlbGF0aW9uUE8gPSBGb3JtUmVsYXRpb25QT1V0aWxpdHkuRmluZFJlbGF0aW9uUE9JblJlbGF0aW9uRm9ybVJlY29yZENvbXBsZXhQbyhyZWxhdGlvbkZvcm1SZWNvcmRDb21wbGV4UG8sIHJlbGF0aW9uX3BvX2lkKTtcbiAgICB2YXIgbGlzdERhdGFSZWNvcmQgPSBGb3JtUmVsYXRpb25QT1V0aWxpdHkuR2V0MVRvTkRhdGFSZWNvcmQocmVsYXRpb25QTyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3REYXRhUmVjb3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb25lRGF0YVJlY29yZCA9IGxpc3REYXRhUmVjb3JkW2ldO1xuXG4gICAgICBpZiAodGhpcy5fRWRpdEluUm93KSB7XG4gICAgICAgIHRoaXMuSW5uZXJSb3dfQWRkUm93VG9Db250YWluZXIob25lRGF0YVJlY29yZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgY2hpbGRSZWxhdGlvblBPQXJyYXkgPSBbXTtcbiAgICAgICAgdmFyIHN1YlJlbGF0aW9uUE8gPSBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUocmVsYXRpb25Gb3JtUmVjb3JkQ29tcGxleFBvLmZvcm1SZWNvcmREYXRhUmVsYXRpb25QT0xpc3QsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ucGFyZW50SWQgPT0gcmVsYXRpb25fcG9faWQ7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgY2xvbmVTdWJSZWxhdGlvblBPID0gQXJyYXlVdGlsaXR5LldoZXJlU2luZ2xlKHRoaXMuX0Zvcm1EYXRhUmVsYXRpb25MaXN0LCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLnBhcmVudElkID09IHJlbGF0aW9uX3BvX2lkO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoc3ViUmVsYXRpb25QTykge1xuICAgICAgICAgIHZhciBzZWxmS2V5RmllbGROYW1lID0gc3ViUmVsYXRpb25QTy5zZWxmS2V5RmllbGROYW1lO1xuICAgICAgICAgIHZhciBvdXRlcktleUZpZWxkTmFtZSA9IHN1YlJlbGF0aW9uUE8ub3V0ZXJLZXlGaWVsZE5hbWU7XG4gICAgICAgICAgdmFyIG91dGVyS2V5RmllbGRWYWx1ZSA9IEZvcm1SZWxhdGlvblBPVXRpbGl0eS5GaW5kRmllbGRWYWx1ZUluT25lRGF0YVJlY29yZChvbmVEYXRhUmVjb3JkLCBvdXRlcktleUZpZWxkTmFtZSk7XG4gICAgICAgICAgdmFyIHRlbXBQTyA9IEpzb25VdGlsaXR5LkNsb25lU2ltcGxlKGNsb25lU3ViUmVsYXRpb25QTyk7XG4gICAgICAgICAgdmFyIGFsbFJlY29yZExpc3QgPSBGb3JtUmVsYXRpb25QT1V0aWxpdHkuR2V0MVRvTkRhdGFSZWNvcmQoc3ViUmVsYXRpb25QTyk7XG4gICAgICAgICAgdmFyIHRoaXNQT0xpc3REYXRhUmVjb3JkID0gW107XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFsbFJlY29yZExpc3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHZhciBvbmVSZWNvcmQgPSBhbGxSZWNvcmRMaXN0W2pdO1xuICAgICAgICAgICAgdmFyIGZpZWxkUE9BcnJheSA9IEZvcm1SZWxhdGlvblBPVXRpbGl0eS5GaW5kUmVjb3JkRmllbGRQT0FycmF5KG9uZVJlY29yZCk7XG5cbiAgICAgICAgICAgIGlmIChBcnJheVV0aWxpdHkuVHJ1ZShmaWVsZFBPQXJyYXksIGZ1bmN0aW9uIChmaWVsZEl0ZW0pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpZWxkSXRlbS5maWVsZE5hbWUgPT0gc2VsZktleUZpZWxkTmFtZSAmJiBmaWVsZEl0ZW0udmFsdWUgPT0gb3V0ZXJLZXlGaWVsZFZhbHVlO1xuICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgICAgdGhpc1BPTGlzdERhdGFSZWNvcmQucHVzaChvbmVSZWNvcmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIEZvcm1SZWxhdGlvblBPVXRpbGl0eS5BZGQxVG9ORGF0YVJlY29yZCh0ZW1wUE8sIHRoaXNQT0xpc3REYXRhUmVjb3JkKTtcbiAgICAgICAgICBjaGlsZFJlbGF0aW9uUE9BcnJheS5wdXNoKHRlbXBQTyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkRpYWxvZ19BZGRSb3dUb0NvbnRhaW5lcihvbmVEYXRhUmVjb3JkLCBjaGlsZFJlbGF0aW9uUE9BcnJheSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5Jbm5lclJvd19Db21wbGV0ZWRMYXN0RWRpdCgpO1xuICB9LFxuICBTZXJpYWxpemF0aW9uVmFsdWU6IGZ1bmN0aW9uIFNlcmlhbGl6YXRpb25WYWx1ZShvcmlnaW5hbEZvcm1EYXRhUmVsYXRpb24sIHJlbGF0aW9uUE8sIGNvbnRyb2wpIHtcbiAgICB0aGlzLklubmVyUm93X0NvbXBsZXRlZExhc3RFZGl0KCk7XG4gICAgdmFyIGFsbERhdGEgPSBbXTtcbiAgICB2YXIgYWxsJFRyQXR0ckNoaWxkUmVsYXRpb25Qb0FycmF5ID0gW107XG5cbiAgICB2YXIgdHJzID0gdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0cltpc19zdWJfbGlzdF90cj0ndHJ1ZSddXCIpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciAkdHIgPSAkKHRyc1tpXSk7XG4gICAgICB2YXIgc2luZ2xlUmVsYXRpb25QTyA9IHRoaXMuR2V0Um93RGF0YSgkdHIpO1xuICAgICAgYWxsRGF0YS5wdXNoKEZvcm1SZWxhdGlvblBPVXRpbGl0eS5HZXQxVG8xRGF0YVJlY29yZChzaW5nbGVSZWxhdGlvblBPKSk7XG4gICAgICB2YXIgdHJDaGlsZFJlbGF0aW9uUE9BcnJheSA9IHRoaXMuR2V0Q2hpbGRSZWxhdGlvblBPQXJyYXkoJHRyKTtcblxuICAgICAgaWYgKHRyQ2hpbGRSZWxhdGlvblBPQXJyYXkpIHtcbiAgICAgICAgYWxsJFRyQXR0ckNoaWxkUmVsYXRpb25Qb0FycmF5ID0gYWxsJFRyQXR0ckNoaWxkUmVsYXRpb25Qb0FycmF5LmNvbmNhdCh0ckNoaWxkUmVsYXRpb25QT0FycmF5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBGb3JtUmVsYXRpb25QT1V0aWxpdHkuQWRkMVRvTkRhdGFSZWNvcmQocmVsYXRpb25QTywgYWxsRGF0YSk7XG4gICAgdmFyIGNoaWxkUmVsYXRpb25BcnJheSA9IEFycmF5VXRpbGl0eS5XaGVyZShvcmlnaW5hbEZvcm1EYXRhUmVsYXRpb24sIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5wYXJlbnRJZCA9PSByZWxhdGlvblBPLmlkO1xuICAgIH0pO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZFJlbGF0aW9uQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZFJlbGF0aW9uUE8gPSBjaGlsZFJlbGF0aW9uQXJyYXlbaV07XG4gICAgICB2YXIgaW5UckNoaWxkUmVsYXRpb25Qb0FycmF5ID0gQXJyYXlVdGlsaXR5LldoZXJlKGFsbCRUckF0dHJDaGlsZFJlbGF0aW9uUG9BcnJheSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uaWQgPT0gY2hpbGRSZWxhdGlvblBPLmlkO1xuICAgICAgfSk7XG4gICAgICB2YXIgYWxsQ2hpbGREYXRhID0gW107XG5cbiAgICAgIGlmIChpblRyQ2hpbGRSZWxhdGlvblBvQXJyYXkpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpblRyQ2hpbGRSZWxhdGlvblBvQXJyYXkubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBhbGxDaGlsZERhdGEgPSBhbGxDaGlsZERhdGEuY29uY2F0KGluVHJDaGlsZFJlbGF0aW9uUG9BcnJheVtqXS5saXN0RGF0YVJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgRm9ybVJlbGF0aW9uUE9VdGlsaXR5LkFkZDFUb05EYXRhUmVjb3JkKGNoaWxkUmVsYXRpb25QTywgYWxsQ2hpbGREYXRhKTtcbiAgICB9XG4gIH0sXG4gIEdldFZhbHVlOiBmdW5jdGlvbiBHZXRWYWx1ZSgkZWxlbSwgb3JpZ2luYWxEYXRhLCBwYXJhcykge1xuICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwiRHluYW1pY0NvbnRhaW5lcuexu+Wei+eahOaOp+S7tueahOW6j+WIl+WMluS6pOeUsVNlcmlhbGl6YXRpb25WYWx1ZeaWueazleiHquihjOWujOaIkCFcIik7XG4gIH0sXG4gIFNldFZhbHVlOiBmdW5jdGlvbiBTZXRWYWx1ZSgkZWxlbSwgcmVsYXRpb25Gb3JtUmVjb3JkQ29tcGxleFBvLCBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcykge30sXG4gIEFkZEV2ZW50OiBmdW5jdGlvbiBBZGRFdmVudChzZW5kZXIpIHtcbiAgICB2YXIgJGhvc3RFbGVtID0gc2VuZGVyLmRhdGEuaG9zdEVsZW07XG4gICAgdmFyIHNlbGZPYmogPSBzZW5kZXIuZGF0YS5zZWxmT2JqO1xuICAgIHZhciBpbnN0YW5jZU5hbWUgPSBzZW5kZXIuZGF0YS5pbnN0YW5jZU5hbWU7XG4gICAgdmFyIHJlbmRlcmVyQ2hhaW5QYXJhcyA9IHNlbmRlci5kYXRhLl9yZW5kZXJlckNoYWluUGFyYXM7XG5cbiAgICBpZiAoc2VsZk9iai5fRWRpdEluUm93KSB7XG4gICAgICBzZWxmT2JqLklubmVyUm93X0FkZFJvd1RvQ29udGFpbmVyKG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmT2JqLkRpYWxvZ19TaG93QWRkUm93U3ViRm9ybURpYWxvZyhzZW5kZXIsICRob3N0RWxlbSwgcmVuZGVyZXJDaGFpblBhcmFzLCBpbnN0YW5jZU5hbWUpO1xuICAgIH1cbiAgfSxcbiAgVmFsaWRhdGVTZXJpYWxpemF0aW9uU3ViRm9ybURhdGFFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlU2VyaWFsaXphdGlvblN1YkZvcm1EYXRhRW5hYmxlKHNlcmlhbGl6YXRpb25TdWJGb3JtRGF0YSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBWYWxpZGF0ZVJlbmRlcmVyQ2hhaW5FbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlUmVuZGVyZXJDaGFpbkVuYWJsZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIG1zZzogXCJcIlxuICAgIH07XG4gIH0sXG4gIEdldFJvd0lkOiBmdW5jdGlvbiBHZXRSb3dJZCgkdHIpIHtcbiAgICB2YXIgaWQgPSAkdHIuYXR0cihcInRyX3JlY29yZF9pZFwiKTtcbiAgICByZXR1cm4gaWQ7XG4gIH0sXG4gIEdldFJvd0RhdGE6IGZ1bmN0aW9uIEdldFJvd0RhdGEoJHRyKSB7XG4gICAgdmFyIGpzb24gPSAkdHIuYXR0cihcInRyX3JlY29yZF9kYXRhXCIpO1xuICAgIHJldHVybiBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24oanNvbik7XG4gIH0sXG4gIEdldENoaWxkUmVsYXRpb25QT0FycmF5OiBmdW5jdGlvbiBHZXRDaGlsZFJlbGF0aW9uUE9BcnJheSgkdHIpIHtcbiAgICB2YXIganNvbiA9ICR0ci5hdHRyKFwiY2hpbGRfcmVsYXRpb25fcG9fYXJyYXlcIik7XG5cbiAgICBpZiAoIVN0cmluZ1V0aWxpdHkuSXNOdWxsT3JFbXB0eShqc29uKSkge1xuICAgICAgcmV0dXJuIEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbihqc29uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgU2F2ZURhdGFUb1Jvd0F0dHI6IGZ1bmN0aW9uIFNhdmVEYXRhVG9Sb3dBdHRyKHJlbGF0aW9uUE8sICR0ciwgYWJvdXRSZWxhdGlvblBPQXJyYXkpIHtcbiAgICAkdHIuYXR0cihcImlzX3N1Yl9saXN0X3RyXCIsIFwidHJ1ZVwiKTtcbiAgICAkdHIuYXR0cihcInRyX3JlY29yZF9pZFwiLCBGb3JtUmVsYXRpb25QT1V0aWxpdHkuRmluZElkRmllbGRQT0J5UmVsYXRpb25QTyhyZWxhdGlvblBPKS52YWx1ZSk7XG4gICAgJHRyLmF0dHIoXCJ0cl9yZWNvcmRfZGF0YVwiLCBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcocmVsYXRpb25QTykpO1xuXG4gICAgaWYgKGFib3V0UmVsYXRpb25QT0FycmF5ICYmIGFib3V0UmVsYXRpb25QT0FycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICR0ci5hdHRyKFwiY2hpbGRfcmVsYXRpb25fcG9fYXJyYXlcIiwgSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKGFib3V0UmVsYXRpb25QT0FycmF5KSk7XG4gICAgfVxuICB9LFxuICBUcnlHZXRDaGlsZFJlbGF0aW9uUE9BcnJheUNsb25lOiBmdW5jdGlvbiBUcnlHZXRDaGlsZFJlbGF0aW9uUE9BcnJheUNsb25lKHJlbGF0aW9uUE8pIHtcbiAgICB2YXIgY2hpbGRSZWxhdGlvbiA9IEFycmF5VXRpbGl0eS5XaGVyZSh0aGlzLl9Gb3JtRGF0YVJlbGF0aW9uTGlzdCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLnBhcmVudElkID09IHJlbGF0aW9uUE8uaWQ7XG4gICAgfSk7XG4gICAgcmV0dXJuIEpzb25VdGlsaXR5LkNsb25lQXJyYXlTaW1wbGUoY2hpbGRSZWxhdGlvbik7XG4gIH0sXG4gIFRyeUdldFJlbGF0aW9uUE9DbG9uZTogZnVuY3Rpb24gVHJ5R2V0UmVsYXRpb25QT0Nsb25lKCkge1xuICAgIGlmICh0aGlzLl9wbykge1xuICAgICAgcmV0dXJuIEpzb25VdGlsaXR5LkNsb25lU2ltcGxlKHRoaXMuX3BvKTtcbiAgICB9XG5cbiAgICB2YXIgYmluZERhdGFTb3VyY2UgPSB0aGlzLlRyeUdldEJpbmREYXRhU291cmNlQXR0cigpO1xuICAgIHZhciBwbyA9IG51bGw7XG5cbiAgICBpZiAoYmluZERhdGFTb3VyY2UgPT0gXCJhdXRvVGVzdGluZ1wiKSB7XG4gICAgICB2YXIgYmluZFRhYmxlTmFtZSA9IHRoaXMuVHJ5R2V0SW5uZXJDb250cm9sQmluZFRhYmxlTmFtZSgpO1xuICAgICAgcG8gPSBGb3JtUmVsYXRpb25QT1V0aWxpdHkuRmluZFJlbGF0aW9uUE9CeVRhYmxlTmFtZSh0aGlzLl9Gb3JtRGF0YVJlbGF0aW9uTGlzdCwgYmluZFRhYmxlTmFtZSk7XG5cbiAgICAgIGlmIChwbyA9PSBudWxsKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwiV0ZEQ1RfU3ViRm9ybUxpc3RDb250YWluZXIuVHJ5R2V0UmVsYXRpb25QTzrpgJrov4flhoXpg6jmjqfku7bnu5HlrprnmoTooajmib7kuI3liLDlhbfkvZPnmoTmlbDmja7lhbPogZTlrp7kvZPvvIFcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvID0gRm9ybVJlbGF0aW9uUE9VdGlsaXR5LkZpbmRSZWxhdGlvblBPQnlJZCh0aGlzLl9Gb3JtRGF0YVJlbGF0aW9uTGlzdCwgYmluZERhdGFTb3VyY2UpO1xuXG4gICAgICBpZiAocG8gPT0gbnVsbCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIldGRENUX1N1YkZvcm1MaXN0Q29udGFpbmVyLlRyeUdldFJlbGF0aW9uUE866YCa6L+HSURcIiArIGJpbmREYXRhU291cmNlICsgXCLmib7kuI3liLDlhbfkvZPnmoTmlbDmja7lhbPogZTlrp7kvZPvvIFcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fcG8gPSBwbztcbiAgICByZXR1cm4gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUodGhpcy5fcG8pO1xuICB9LFxuICBUcnlHZXRJbm5lckNvbnRyb2xCaW5kVGFibGVOYW1lOiBmdW5jdGlvbiBUcnlHZXRJbm5lckNvbnRyb2xCaW5kVGFibGVOYW1lKCkge1xuICAgIHZhciBjb250cm9scyA9IEhUTUxDb250cm9sLkZpbmRBTExDb250cm9scyh0aGlzLl8kVGVtcGxhdGVUYWJsZVJvdyk7XG4gICAgdmFyIHRhYmxlTmFtZSA9IG51bGw7XG4gICAgY29udHJvbHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRhYmxlTmFtZSkge1xuICAgICAgICB0YWJsZU5hbWUgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sQmluZFRhYmxlTmFtZSgkKHRoaXMpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0YWJsZU5hbWUgIT0gSFRNTENvbnRyb2wuR2V0Q29udHJvbEJpbmRUYWJsZU5hbWUoJCh0aGlzKSkpIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuWtkOihqOWMuuWfn+S4reeahOaOp+S7tue7keWumuS6huWkmuS4quihqCFcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGFibGVOYW1lO1xuICB9LFxuICBUcnlHZXRCaW5kRGF0YVNvdXJjZUF0dHI6IGZ1bmN0aW9uIFRyeUdldEJpbmREYXRhU291cmNlQXR0cigpIHtcbiAgICByZXR1cm4gdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtLmF0dHIoXCJiaW5kZGF0YXNvdXJjZVwiKTtcbiAgfSxcbiAgXyRMYXN0RWRpdFJvdzogbnVsbCxcbiAgSW5uZXJSb3dfQWRkUm93VG9Db250YWluZXI6IGZ1bmN0aW9uIElubmVyUm93X0FkZFJvd1RvQ29udGFpbmVyKG9uZURhdGFSZWNvcmQpIHtcbiAgICB0aGlzLklubmVyUm93X0NvbXBsZXRlZExhc3RFZGl0KCk7XG5cbiAgICB2YXIgJHRyID0gdGhpcy5fJFRlbXBsYXRlVGFibGVSb3cuY2xvbmUoKTtcblxuICAgIHZhciBsYXN0T3BlcmF0aW9uVGQgPSAkKFwiPHRkPjxkaXYgY2xhc3M9J3NmbHQtdGQtb3BlcmF0aW9uLW91dGVyLXdyYXAnPjwvZGl2PjwvdGQ+XCIpO1xuICAgIHZhciBsYXN0T3BlcmF0aW9uT3V0ZXJEaXYgPSBsYXN0T3BlcmF0aW9uVGQuZmluZChcImRpdlwiKTtcbiAgICB2YXIgYnRuX29wZXJhdGlvbl9kZWwgPSAkKFwiPGRpdiB0aXRsZT0n5Yig6ZmkJyBjbGFzcz0nc2ZsdC10ZC1vcGVyYXRpb24tZGVsJz48L2Rpdj5cIik7XG4gICAgYnRuX29wZXJhdGlvbl9kZWwuYmluZChcImNsaWNrXCIsIHtcbiAgICAgIHNlbGZPYmo6IHRoaXNcbiAgICB9LCBmdW5jdGlvbiAoYnRuX2RlbF9zZW5kZXIpIHtcbiAgICAgIHZhciBzZWxmT2JqID0gYnRuX2RlbF9zZW5kZXIuZGF0YS5zZWxmT2JqO1xuICAgICAgc2VsZk9iai5Jbm5lclJvd19EZWxldGUoJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKSk7XG4gICAgfSk7XG4gICAgbGFzdE9wZXJhdGlvbk91dGVyRGl2LmFwcGVuZChidG5fb3BlcmF0aW9uX2RlbCk7XG4gICAgdmFyIGJ0bl9vcGVyYXRpb25fdXBkYXRlID0gJChcIjxkaXYgdGl0bGU9J+e8lui+kScgY2xhc3M9J3NmbHQtdGQtb3BlcmF0aW9uLXVwZGF0ZSc+PC9kaXY+XCIpO1xuICAgIGJ0bl9vcGVyYXRpb25fdXBkYXRlLmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBzZWxmT2JqOiB0aGlzXG4gICAgfSwgZnVuY3Rpb24gKGJ0bl91cGRhdGVfc2VuZGVyKSB7XG4gICAgICB2YXIgc2VsZk9iaiA9IGJ0bl91cGRhdGVfc2VuZGVyLmRhdGEuc2VsZk9iajtcbiAgICAgIHNlbGZPYmouSW5uZXJSb3dfVG9FZGl0U3RhdHVzKCQodGhpcykucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkpO1xuICAgIH0pO1xuICAgIGxhc3RPcGVyYXRpb25PdXRlckRpdi5hcHBlbmQoYnRuX29wZXJhdGlvbl91cGRhdGUpO1xuICAgICR0ci5hcHBlbmQobGFzdE9wZXJhdGlvblRkKTtcblxuICAgIHRoaXMuXyRUYWJsZUJvZHlFbGVtLmFwcGVuZCgkdHIpO1xuXG4gICAgdGhpcy5fJExhc3RFZGl0Um93ID0gJHRyO1xuXG4gICAgaWYgKG9uZURhdGFSZWNvcmQpIHtcbiAgICAgIHZhciBjb250cm9scyA9IEhUTUxDb250cm9sLkZpbmRBTExDb250cm9scyh0aGlzLl8kTGFzdEVkaXRSb3cpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbnRyb2xzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjb250cm9sID0gJChjb250cm9sc1tpXSk7XG4gICAgICAgIHZhciBjb250cm9sSW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sSW5zdGFuY2VCeUVsZW0oY29udHJvbCk7XG4gICAgICAgIHZhciBmaWVsZE5hbWUgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sQmluZEZpZWxkTmFtZShjb250cm9sKTtcbiAgICAgICAgdmFyIGZpZWxkUE8gPSBGb3JtUmVsYXRpb25QT1V0aWxpdHkuRmluZEZpZWxkUE9Jbk9uZURhdGFSZWNvcmQob25lRGF0YVJlY29yZCwgZmllbGROYW1lKTtcbiAgICAgICAgY29udHJvbEluc3RhbmNlLlNldFZhbHVlKGNvbnRyb2wsIGZpZWxkUE8sIG51bGwsIG51bGwpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgSW5uZXJSb3dfVG9FZGl0U3RhdHVzOiBmdW5jdGlvbiBJbm5lclJvd19Ub0VkaXRTdGF0dXMoJHRyKSB7XG4gICAgdGhpcy5Jbm5lclJvd19Db21wbGV0ZWRMYXN0RWRpdCgpO1xuICAgIHZhciByb3dSZWxhdGlvblBPID0gdGhpcy5HZXRSb3dEYXRhKCR0cik7XG4gICAgdmFyIHJvd1NwYW5Db250cm9scyA9ICR0ci5maW5kKFwiW2lzX2lubmVyX3Jvd19zcGFuPSd0cnVlJ11cIik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvd1NwYW5Db250cm9scy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNwYW5Db250cm9sID0gJChyb3dTcGFuQ29udHJvbHNbaV0pO1xuICAgICAgdmFyIGNvbnRyb2xJZCA9IHNwYW5Db250cm9sLmF0dHIoXCJlZGl0X2NvbnRyb2xfaWRcIik7XG5cbiAgICAgIHZhciBlZGl0Q29udHJvbCA9IHRoaXMuXyRUZW1wbGF0ZVRhYmxlUm93LmZpbmQoXCIjXCIgKyBjb250cm9sSWQpLmNsb25lKCk7XG5cbiAgICAgIHZhciBmaWVsZE5hbWUgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sQmluZEZpZWxkTmFtZShlZGl0Q29udHJvbCk7XG4gICAgICB2YXIgZmllbGRQTyA9IEZvcm1SZWxhdGlvblBPVXRpbGl0eS5GaW5kRmllbGRQT0J5UmVsYXRpb25QTyhyb3dSZWxhdGlvblBPLCBmaWVsZE5hbWUpO1xuICAgICAgdmFyIGVkaXRDb250cm9sSW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sSW5zdGFuY2VCeUVsZW0oZWRpdENvbnRyb2wpO1xuICAgICAgZWRpdENvbnRyb2xJbnN0YW5jZS5TZXRWYWx1ZShlZGl0Q29udHJvbCwgZmllbGRQTywge30pO1xuICAgICAgc3BhbkNvbnRyb2wucGFyZW50KCkuYXBwZW5kKGVkaXRDb250cm9sKTtcbiAgICAgIHNwYW5Db250cm9sLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHRoaXMuXyRMYXN0RWRpdFJvdyA9ICR0cjtcbiAgfSxcbiAgSW5uZXJSb3dfVG9WaWV3U3RhdHVzOiBmdW5jdGlvbiBJbm5lclJvd19Ub1ZpZXdTdGF0dXMocmVsYXRpb25QTywgJHRyKSB7XG4gICAgaWYgKHRoaXMuXyRMYXN0RWRpdFJvdykge1xuICAgICAgdmFyIGNvbnRyb2xzID0gSFRNTENvbnRyb2wuRmluZEFMTENvbnRyb2xzKHRoaXMuXyRMYXN0RWRpdFJvdyk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29udHJvbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHNpbmdsZUNvbnRyb2wgPSAkKGNvbnRyb2xzW2ldKTtcbiAgICAgICAgdmFyIGZpZWxkTmFtZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xCaW5kRmllbGROYW1lKHNpbmdsZUNvbnRyb2wpO1xuICAgICAgICB2YXIgZmllbGRWYWx1ZSA9IEZvcm1SZWxhdGlvblBPVXRpbGl0eS5GaW5kRmllbGRQT0J5UmVsYXRpb25QTyhyZWxhdGlvblBPLCBmaWVsZE5hbWUpLnZhbHVlO1xuICAgICAgICB2YXIgdHh0U3BhbiA9ICQoXCI8c3BhbiBpc19pbm5lcl9yb3dfc3Bhbj0ndHJ1ZScgZWRpdF9jb250cm9sX2lkPSdcIiArIHNpbmdsZUNvbnRyb2wuYXR0cihcImlkXCIpICsgXCInPlwiICsgZmllbGRWYWx1ZSArIFwiPC9zcGFuPlwiKTtcbiAgICAgICAgc2luZ2xlQ29udHJvbC5iZWZvcmUodHh0U3Bhbik7XG4gICAgICAgIHNpbmdsZUNvbnRyb2wucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fJExhc3RFZGl0Um93ID0gbnVsbDtcbiAgfSxcbiAgSW5uZXJSb3dfRGVsZXRlOiBmdW5jdGlvbiBJbm5lclJvd19EZWxldGUoJHRyKSB7XG4gICAgdGhpcy5Jbm5lclJvd19Db21wbGV0ZWRMYXN0RWRpdCgpO1xuICAgICR0ci5yZW1vdmUoKTtcbiAgfSxcbiAgSW5uZXJSb3dfQ29tcGxldGVkTGFzdEVkaXQ6IGZ1bmN0aW9uIElubmVyUm93X0NvbXBsZXRlZExhc3RFZGl0KCkge1xuICAgIGlmICh0aGlzLl8kTGFzdEVkaXRSb3cpIHtcbiAgICAgIHZhciBjb250cm9scyA9IEhUTUxDb250cm9sLkZpbmRBTExDb250cm9scyh0aGlzLl8kTGFzdEVkaXRSb3cpO1xuICAgICAgdmFyIHJlbGF0aW9uUE8gPSB0aGlzLlRyeUdldFJlbGF0aW9uUE9DbG9uZSgpO1xuICAgICAgdmFyIG9uZVJvd1JlY29yZCA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbnRyb2xzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzaW5nbGVDb250cm9sID0gJChjb250cm9sc1tpXSk7XG4gICAgICAgIHZhciBmaWVsZFRyYW5zZmVyUE8gPSBIVE1MQ29udHJvbC5UcnlHZXRGaWVsZFRyYW5zZmVyUE8oc2luZ2xlQ29udHJvbCwgcmVsYXRpb25QTy5pZCwgcmVsYXRpb25QTy5zaW5nbGVOYW1lLCByZWxhdGlvblBPLnJlbGF0aW9uVHlwZSk7XG4gICAgICAgIG9uZVJvd1JlY29yZC5wdXNoKGZpZWxkVHJhbnNmZXJQTyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBpZFZhbHVlID0gdGhpcy5HZXRSb3dJZCh0aGlzLl8kTGFzdEVkaXRSb3cpO1xuICAgICAgRm9ybVJlbGF0aW9uUE9VdGlsaXR5LkNyZWF0ZUlkRmllbGRJbk9uZURhdGFSZWNvcmQob25lUm93UmVjb3JkLCBpZFZhbHVlKTtcbiAgICAgIHJlbGF0aW9uUE8gPSBGb3JtUmVsYXRpb25QT1V0aWxpdHkuQWRkMVRvMURhdGFSZWNvcmRGaWVsZFBPTGlzdChyZWxhdGlvblBPLCBvbmVSb3dSZWNvcmQpO1xuICAgICAgdGhpcy5TYXZlRGF0YVRvUm93QXR0cihyZWxhdGlvblBPLCB0aGlzLl8kTGFzdEVkaXRSb3cpO1xuICAgICAgdGhpcy5Jbm5lclJvd19Ub1ZpZXdTdGF0dXMocmVsYXRpb25QTywgdGhpcy5fJExhc3RFZGl0Um93KTtcbiAgICB9XG4gIH0sXG4gIERpYWxvZ19TdWJGb3JtRGlhbG9nQ29tcGxldGVkRWRpdDogZnVuY3Rpb24gRGlhbG9nX1N1YkZvcm1EaWFsb2dDb21wbGV0ZWRFZGl0KGluc3RhbmNlTmFtZSwgb3BlcmF0aW9uVHlwZSwgc2VyaWFsaXphdGlvblN1YkZvcm1EYXRhKSB7XG4gICAgdmFyIHRoaXNJbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldEluc3RhbmNlKGluc3RhbmNlTmFtZSk7XG4gICAgKGZ1bmN0aW9uIChvcGVyYXRpb25UeXBlLCBzZXJpYWxpemF0aW9uU3ViRm9ybURhdGEpIHtcbiAgICAgIHZhciBzZWxmUmVsYXRpb25QTyA9IHRoaXMuVHJ5R2V0UmVsYXRpb25QT0Nsb25lKCk7XG4gICAgICB2YXIgc2VsZkNoaWxkUmVsYXRpb25QT0FycmF5ID0gdGhpcy5UcnlHZXRDaGlsZFJlbGF0aW9uUE9BcnJheUNsb25lKHNlbGZSZWxhdGlvblBPKTtcbiAgICAgIHZhciBzdWJGb3JtTWFpblJlbGF0aW9uUE8gPSBGb3JtUmVsYXRpb25QT1V0aWxpdHkuRmluZE1haW5SZWxhdGlvblBPKHNlcmlhbGl6YXRpb25TdWJGb3JtRGF0YS5mb3JtUmVjb3JkRGF0YVJlbGF0aW9uUE9MaXN0KTtcbiAgICAgIHZhciBzdWJGb3JtTm90TWFpblJlbGF0aW9uUE8gPSBGb3JtUmVsYXRpb25QT1V0aWxpdHkuRmluZE5vdE1haW5SZWxhdGlvblBPKHNlcmlhbGl6YXRpb25TdWJGb3JtRGF0YS5mb3JtUmVjb3JkRGF0YVJlbGF0aW9uUE9MaXN0KTtcbiAgICAgIHZhciBjaGlsZFJlbGF0aW9uUE9BcnJheSA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGZDaGlsZFJlbGF0aW9uUE9BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdGFibGVOYW1lID0gc2VsZkNoaWxkUmVsYXRpb25QT0FycmF5W2ldLnRhYmxlTmFtZTtcbiAgICAgICAgdmFyIHN1YlJlbGF0aW9uUE8gPSBGb3JtUmVsYXRpb25QT1V0aWxpdHkuRmluZFJlbGF0aW9uUE9CeVRhYmxlTmFtZShzdWJGb3JtTm90TWFpblJlbGF0aW9uUE8sIHRhYmxlTmFtZSk7XG5cbiAgICAgICAgaWYgKHN1YlJlbGF0aW9uUE8pIHtcbiAgICAgICAgICBzdWJSZWxhdGlvblBPLmlkID0gc2VsZkNoaWxkUmVsYXRpb25QT0FycmF5W2ldLmlkO1xuICAgICAgICAgIHN1YlJlbGF0aW9uUE8ucGFyZW50SWQgPSBzZWxmQ2hpbGRSZWxhdGlvblBPQXJyYXlbaV0ucGFyZW50SWQ7XG4gICAgICAgICAgY2hpbGRSZWxhdGlvblBPQXJyYXkucHVzaChzdWJSZWxhdGlvblBPKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgb25lRGF0YVJlY29yZCA9IEZvcm1SZWxhdGlvblBPVXRpbGl0eS5HZXQxVG8xRGF0YVJlY29yZChzdWJGb3JtTWFpblJlbGF0aW9uUE8pO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkUmVsYXRpb25QT0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzdWJSZWxhdGlvblBPID0gY2hpbGRSZWxhdGlvblBPQXJyYXlbaV07XG4gICAgICAgIHZhciBzZWxmS2V5RmllbGROYW1lID0gc3ViUmVsYXRpb25QTy5zZWxmS2V5RmllbGROYW1lO1xuICAgICAgICB2YXIgb3V0ZXJLZXlGaWVsZE5hbWUgPSBzdWJSZWxhdGlvblBPLm91dGVyS2V5RmllbGROYW1lO1xuICAgICAgICB2YXIgb3V0ZXJLZXlGaWVsZFZhbHVlID0gRm9ybVJlbGF0aW9uUE9VdGlsaXR5LkZpbmRGaWVsZFZhbHVlSW5PbmVEYXRhUmVjb3JkKG9uZURhdGFSZWNvcmQsIG91dGVyS2V5RmllbGROYW1lKTtcblxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN1YlJlbGF0aW9uUE8ubGlzdERhdGFSZWNvcmQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICB2YXIgcmVjb3JkRmllbGRQT0xpc3QgPSBGb3JtUmVsYXRpb25QT1V0aWxpdHkuRmluZFJlY29yZEZpZWxkUE9BcnJheShzdWJSZWxhdGlvblBPLmxpc3REYXRhUmVjb3JkW2pdKTtcbiAgICAgICAgICBGb3JtUmVsYXRpb25QT1V0aWxpdHkuQ3JlYXRlRmllbGRJbk9uZURhdGFSZWNvcmQocmVjb3JkRmllbGRQT0xpc3QsIHNlbGZLZXlGaWVsZE5hbWUsIG91dGVyS2V5RmllbGRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5EaWFsb2dfQWRkUm93VG9Db250YWluZXIob25lRGF0YVJlY29yZCwgY2hpbGRSZWxhdGlvblBPQXJyYXksIGZhbHNlKTtcbiAgICB9KS5jYWxsKHRoaXNJbnN0YW5jZSwgb3BlcmF0aW9uVHlwZSwgc2VyaWFsaXphdGlvblN1YkZvcm1EYXRhKTtcbiAgfSxcbiAgRGlhbG9nX0FkZFJvd1RvQ29udGFpbmVyOiBmdW5jdGlvbiBEaWFsb2dfQWRkUm93VG9Db250YWluZXIob25lRGF0YVJlY29yZCwgY2hpbGRSZWxhdGlvblBPQXJyYXksIGRhdGFJc0Zyb21TZXJ2ZXIpIHtcbiAgICBpZiAob25lRGF0YVJlY29yZCkge1xuICAgICAgdmFyICR0ciA9IHRoaXMuXyRUZW1wbGF0ZVRhYmxlUm93LmNsb25lKCk7XG5cbiAgICAgIHZhciBjb250cm9scyA9IEhUTUxDb250cm9sLkZpbmRBTExDb250cm9scygkdHIpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbnRyb2xzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjb250cm9sID0gJChjb250cm9sc1tpXSk7XG4gICAgICAgIHZhciBjb250cm9sSW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sSW5zdGFuY2VCeUVsZW0oY29udHJvbCk7XG4gICAgICAgIHZhciBmaWVsZE5hbWUgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sQmluZEZpZWxkTmFtZShjb250cm9sKTtcbiAgICAgICAgdmFyIGZpZWxkUE8gPSBGb3JtUmVsYXRpb25QT1V0aWxpdHkuRmluZEZpZWxkUE9Jbk9uZURhdGFSZWNvcmQob25lRGF0YVJlY29yZCwgZmllbGROYW1lKTtcbiAgICAgICAgY29udHJvbEluc3RhbmNlLlNldFZhbHVlKGNvbnRyb2wsIGZpZWxkUE8sIG51bGwsIG51bGwpO1xuICAgICAgfVxuXG4gICAgICB2YXIgaWRGaWVsZFBPID0gRm9ybVJlbGF0aW9uUE9VdGlsaXR5LkZpbmRGaWVsZFBPSW5PbmVEYXRhUmVjb3JkQnlJRChvbmVEYXRhUmVjb3JkKTtcbiAgICAgIHZhciBsYXN0T3BlcmF0aW9uVGQgPSAkKFwiPHRkPjxkaXYgY2xhc3M9J3NmbHQtdGQtb3BlcmF0aW9uLW91dGVyLXdyYXAnPjwvZGl2PjwvdGQ+XCIpO1xuICAgICAgdmFyIGxhc3RPcGVyYXRpb25PdXRlckRpdiA9IGxhc3RPcGVyYXRpb25UZC5maW5kKFwiZGl2XCIpO1xuXG4gICAgICBpZiAoZGF0YUlzRnJvbVNlcnZlcikge1xuICAgICAgICBpZiAodGhpcy5fRGlzcGxheV9PUEJ1dHRvbnNfVmlldykge1xuICAgICAgICAgIHRoaXMuRGlhbG9nX0FkZFJvd19BZGRWaWV3QnV0dG9uKGxhc3RPcGVyYXRpb25PdXRlckRpdiwgJHRyLCBpZEZpZWxkUE8udmFsdWUsIG9uZURhdGFSZWNvcmQsIHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbSwgdGhpcy5fRm9ybVJ1bnRpbWVIb3N0LklzUHJldmlldygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9EaXNwbGF5X09QQnV0dG9uc19VcGRhdGUpIHtcbiAgICAgICAgICB0aGlzLkRpYWxvZ19BZGRSb3dfQWRkVXBkYXRlQnV0dG9uKGxhc3RPcGVyYXRpb25PdXRlckRpdiwgJHRyLCBpZEZpZWxkUE8udmFsdWUsIG9uZURhdGFSZWNvcmQsIHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbSwgdGhpcy5fRm9ybVJ1bnRpbWVIb3N0LklzUHJldmlldygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9EaXNwbGF5X09QQnV0dG9uc19EZWwpIHtcbiAgICAgICAgICB0aGlzLkRpYWxvZ19BZGRSb3dfQWRkRGVsZXRlQnV0dG9uKGxhc3RPcGVyYXRpb25PdXRlckRpdiwgJHRyLCBpZEZpZWxkUE8udmFsdWUsIG9uZURhdGFSZWNvcmQsIHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbSwgdGhpcy5fRm9ybVJ1bnRpbWVIb3N0LklzUHJldmlldygpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5EaWFsb2dfQWRkUm93X0FkZFZpZXdCdXR0b24obGFzdE9wZXJhdGlvbk91dGVyRGl2LCAkdHIsIGlkRmllbGRQTy52YWx1ZSwgb25lRGF0YVJlY29yZCwgdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtLCB0aGlzLl9Gb3JtUnVudGltZUhvc3QuSXNQcmV2aWV3KCkpO1xuICAgICAgICB0aGlzLkRpYWxvZ19BZGRSb3dfQWRkVXBkYXRlQnV0dG9uKGxhc3RPcGVyYXRpb25PdXRlckRpdiwgJHRyLCBpZEZpZWxkUE8udmFsdWUsIG9uZURhdGFSZWNvcmQsIHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbSwgdGhpcy5fRm9ybVJ1bnRpbWVIb3N0LklzUHJldmlldygpKTtcbiAgICAgICAgdGhpcy5EaWFsb2dfQWRkUm93X0FkZERlbGV0ZUJ1dHRvbihsYXN0T3BlcmF0aW9uT3V0ZXJEaXYsICR0ciwgaWRGaWVsZFBPLnZhbHVlLCBvbmVEYXRhUmVjb3JkLCB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0sIHRoaXMuX0Zvcm1SdW50aW1lSG9zdC5Jc1ByZXZpZXcoKSk7XG4gICAgICB9XG5cbiAgICAgICR0ci5hcHBlbmQobGFzdE9wZXJhdGlvblRkKTtcbiAgICAgIHZhciBpZFZhbHVlID0gaWRGaWVsZFBPLnZhbHVlO1xuXG4gICAgICB2YXIgJG9sZFRyRWxlbSA9IHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbS5maW5kKFwidHJbdHJfcmVjb3JkX2lkPSdcIiArIGlkVmFsdWUgKyBcIiddXCIpO1xuXG4gICAgICBpZiAoJG9sZFRyRWxlbS5sZW5ndGggPT0gMCkge1xuICAgICAgICB0aGlzLl8kVGFibGVCb2R5RWxlbS5hcHBlbmQoJHRyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRvbGRUckVsZW0uYWZ0ZXIoJHRyKTtcbiAgICAgICAgJG9sZFRyRWxlbS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlbGF0aW9uUE8gPSB0aGlzLlRyeUdldFJlbGF0aW9uUE9DbG9uZSgpO1xuICAgICAgcmVsYXRpb25QTyA9IEZvcm1SZWxhdGlvblBPVXRpbGl0eS5BZGQxVG8xRGF0YVJlY29yZChyZWxhdGlvblBPLCBvbmVEYXRhUmVjb3JkKTtcbiAgICAgIHRoaXMuU2F2ZURhdGFUb1Jvd0F0dHIocmVsYXRpb25QTywgJHRyLCBjaGlsZFJlbGF0aW9uUE9BcnJheSk7XG4gICAgfVxuICB9LFxuICBEaWFsb2dfU2hvd0FkZFJvd1N1YkZvcm1EaWFsb2c6IGZ1bmN0aW9uIERpYWxvZ19TaG93QWRkUm93U3ViRm9ybURpYWxvZyhzZW5kZXIsICRzaW5nbGVDb250cm9sRWxlbSwgX3JlbmRlcmVyQ2hhaW5QYXJhcywgaW5zdGFuY2VOYW1lKSB7XG4gICAgdmFyIGRpYWxvZ1dpbmRvd1BhcmEgPSB0aGlzLkRpYWxvZ19HZXRfQnV0dG9uX0NsaWNrX1BhcmEoJHNpbmdsZUNvbnRyb2xFbGVtKTtcblxuICAgIGlmICghZGlhbG9nV2luZG93UGFyYS5EaWFsb2dXaW5kb3dUaXRsZSkge1xuICAgICAgZGlhbG9nV2luZG93UGFyYS5EaWFsb2dXaW5kb3dUaXRsZSA9IFwi5bqU55So5p6E5bu657O757ufXCI7XG4gICAgfVxuXG4gICAgZGlhbG9nV2luZG93UGFyYS5PcGVyYXRpb25UeXBlID0gXCJhZGRcIjtcbiAgICBkaWFsb2dXaW5kb3dQYXJhLlJlY29yZElkID0gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG5cbiAgICB2YXIgaXNQcmV2aWV3ID0gdGhpcy5fRm9ybVJ1bnRpbWVIb3N0LklzUHJldmlldygpO1xuXG4gICAgdmFyIHVybDtcblxuICAgIGlmIChpc1ByZXZpZXcpIHtcbiAgICAgIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyhcIi9IVE1ML0J1aWxkZXIvRm9ybS9TdWJGb3JtUHJldmlldy5odG1sXCIsIGRpYWxvZ1dpbmRvd1BhcmEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcoXCIvSFRNTC9CdWlsZGVyL1J1bnRpbWUvV2ViRm9ybVN1YlJ1bnRpbWUuaHRtbFwiLCBkaWFsb2dXaW5kb3dQYXJhKTtcbiAgICB9XG5cbiAgICBEaWFsb2dVdGlsaXR5Lk9wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgIHRpdGxlOiBkaWFsb2dXaW5kb3dQYXJhLkRpYWxvZ1dpbmRvd1RpdGxlLFxuICAgICAgd2lkdGg6IGRpYWxvZ1dpbmRvd1BhcmEuV2luZG93V2lkdGgsXG4gICAgICBoZWlnaHQ6IGRpYWxvZ1dpbmRvd1BhcmEuV2luZG93SGVpZ2h0XG4gICAgfSwgMSk7XG4gIH0sXG4gIERpYWxvZ19BZGRSb3dfQWRkVmlld0J1dHRvbjogZnVuY3Rpb24gRGlhbG9nX0FkZFJvd19BZGRWaWV3QnV0dG9uKG9wZXJhdGlvbk91dGVyRGl2LCAkdHIsIGlkVmFsdWUsIG9uZURhdGFSZWNvcmQsICRzaW5nbGVDb250cm9sRWxlbSwgaXNQcmV2aWV3KSB7XG4gICAgdmFyIGJ0bl9vcGVyYXRpb25fdmlldyA9ICQoXCI8ZGl2IHRpdGxlPSfmn6XnnIsnIGNsYXNzPSdzZmx0LXRkLW9wZXJhdGlvbi12aWV3Jz48L2Rpdj5cIik7XG4gICAgdmFyIGRpYWxvZ1dpbmRvd1BhcmEgPSB0aGlzLkRpYWxvZ19HZXRfQnV0dG9uX0NsaWNrX1BhcmEoJHNpbmdsZUNvbnRyb2xFbGVtKTtcbiAgICBidG5fb3BlcmF0aW9uX3ZpZXcuYmluZChcImNsaWNrXCIsIHtcbiAgICAgIFwiJHRyXCI6ICR0cixcbiAgICAgIFwiaWRWYWx1ZVwiOiBpZFZhbHVlLFxuICAgICAgXCJvbmVEYXRhUmVjb3JkXCI6IG9uZURhdGFSZWNvcmQsXG4gICAgICBcImRpYWxvZ1dpbmRvd1BhcmFcIjogZGlhbG9nV2luZG93UGFyYSxcbiAgICAgIFwiaXNQcmV2aWV3XCI6IGlzUHJldmlld1xuICAgIH0sIGZ1bmN0aW9uIChzZW5kZXIpIHtcbiAgICAgIHZhciBkaWFsb2dXaW5kb3dQYXJhID0gc2VuZGVyLmRhdGEuZGlhbG9nV2luZG93UGFyYTtcbiAgICAgIGRpYWxvZ1dpbmRvd1BhcmEuT3BlcmF0aW9uVHlwZSA9IFwidmlld1wiO1xuICAgICAgZGlhbG9nV2luZG93UGFyYS5SZWNvcmRJZCA9IHNlbmRlci5kYXRhLmlkVmFsdWU7XG4gICAgICB2YXIgdXJsO1xuXG4gICAgICBpZiAoaXNQcmV2aWV3KSB7XG4gICAgICAgIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyhcIi9IVE1ML0J1aWxkZXIvRm9ybS9TdWJGb3JtUHJldmlldy5odG1sXCIsIGRpYWxvZ1dpbmRvd1BhcmEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KFwiL0hUTUwvQnVpbGRlci9SdW50aW1lL1dlYkZvcm1TdWJSdW50aW1lLmh0bWxcIiwgZGlhbG9nV2luZG93UGFyYSk7XG4gICAgICB9XG5cbiAgICAgIERpYWxvZ1V0aWxpdHkuT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICB0aXRsZTogZGlhbG9nV2luZG93UGFyYS5EaWFsb2dXaW5kb3dUaXRsZSxcbiAgICAgICAgd2lkdGg6IGRpYWxvZ1dpbmRvd1BhcmEuV2luZG93V2lkdGgsXG4gICAgICAgIGhlaWdodDogZGlhbG9nV2luZG93UGFyYS5XaW5kb3dIZWlnaHRcbiAgICAgIH0sIDEpO1xuICAgIH0pO1xuICAgIG9wZXJhdGlvbk91dGVyRGl2LmFwcGVuZChidG5fb3BlcmF0aW9uX3ZpZXcpO1xuICB9LFxuICBEaWFsb2dfQWRkUm93X0FkZFVwZGF0ZUJ1dHRvbjogZnVuY3Rpb24gRGlhbG9nX0FkZFJvd19BZGRVcGRhdGVCdXR0b24ob3BlcmF0aW9uT3V0ZXJEaXYsICR0ciwgaWRWYWx1ZSwgb25lRGF0YVJlY29yZCwgJHNpbmdsZUNvbnRyb2xFbGVtLCBpc1ByZXZpZXcpIHtcbiAgICB2YXIgYnRuX29wZXJhdGlvbl92aWV3ID0gJChcIjxkaXYgdGl0bGU9J+e8lui+kScgY2xhc3M9J3NmbHQtdGQtb3BlcmF0aW9uLXVwZGF0ZSc+PC9kaXY+XCIpO1xuICAgIHZhciBkaWFsb2dXaW5kb3dQYXJhID0gdGhpcy5EaWFsb2dfR2V0X0J1dHRvbl9DbGlja19QYXJhKCRzaW5nbGVDb250cm9sRWxlbSk7XG4gICAgYnRuX29wZXJhdGlvbl92aWV3LmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBcIiR0clwiOiAkdHIsXG4gICAgICBcImlkVmFsdWVcIjogaWRWYWx1ZSxcbiAgICAgIFwib25lRGF0YVJlY29yZFwiOiBvbmVEYXRhUmVjb3JkLFxuICAgICAgXCJkaWFsb2dXaW5kb3dQYXJhXCI6IGRpYWxvZ1dpbmRvd1BhcmEsXG4gICAgICBcImlzUHJldmlld1wiOiBpc1ByZXZpZXdcbiAgICB9LCBmdW5jdGlvbiAoc2VuZGVyKSB7XG4gICAgICB2YXIgZGlhbG9nV2luZG93UGFyYSA9IHNlbmRlci5kYXRhLmRpYWxvZ1dpbmRvd1BhcmE7XG4gICAgICBkaWFsb2dXaW5kb3dQYXJhLk9wZXJhdGlvblR5cGUgPSBcInVwZGF0ZVwiO1xuICAgICAgZGlhbG9nV2luZG93UGFyYS5SZWNvcmRJZCA9IHNlbmRlci5kYXRhLmlkVmFsdWU7XG4gICAgICB2YXIgdXJsO1xuXG4gICAgICBpZiAoaXNQcmV2aWV3KSB7XG4gICAgICAgIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyhcIi9IVE1ML0J1aWxkZXIvRm9ybS9TdWJGb3JtUHJldmlldy5odG1sXCIsIGRpYWxvZ1dpbmRvd1BhcmEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KFwiL0hUTUwvQnVpbGRlci9SdW50aW1lL1dlYkZvcm1TdWJSdW50aW1lLmh0bWxcIiwgZGlhbG9nV2luZG93UGFyYSk7XG4gICAgICB9XG5cbiAgICAgIERpYWxvZ1V0aWxpdHkuT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICB0aXRsZTogZGlhbG9nV2luZG93UGFyYS5EaWFsb2dXaW5kb3dUaXRsZSxcbiAgICAgICAgd2lkdGg6IGRpYWxvZ1dpbmRvd1BhcmEuV2luZG93V2lkdGgsXG4gICAgICAgIGhlaWdodDogZGlhbG9nV2luZG93UGFyYS5XaW5kb3dIZWlnaHRcbiAgICAgIH0sIDEpO1xuICAgIH0pO1xuICAgIG9wZXJhdGlvbk91dGVyRGl2LmFwcGVuZChidG5fb3BlcmF0aW9uX3ZpZXcpO1xuICB9LFxuICBEaWFsb2dfQWRkUm93X0FkZERlbGV0ZUJ1dHRvbjogZnVuY3Rpb24gRGlhbG9nX0FkZFJvd19BZGREZWxldGVCdXR0b24ob3BlcmF0aW9uT3V0ZXJEaXYsICR0ciwgaWRWYWx1ZSwgb25lRGF0YVJlY29yZCwgJHNpbmdsZUNvbnRyb2xFbGVtLCBpc1ByZXZpZXcpIHtcbiAgICB2YXIgYnRuX29wZXJhdGlvbl92aWV3ID0gJChcIjxkaXYgdGl0bGU9J+WIoOmZpCcgY2xhc3M9J3NmbHQtdGQtb3BlcmF0aW9uLWRlbCc+PC9kaXY+XCIpO1xuICAgIGJ0bl9vcGVyYXRpb25fdmlldy5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgXCIkdHJcIjogJHRyLFxuICAgICAgXCJpZFZhbHVlXCI6IGlkVmFsdWUsXG4gICAgICBcIm9uZURhdGFSZWNvcmRcIjogb25lRGF0YVJlY29yZCxcbiAgICAgIFwiaXNQcmV2aWV3XCI6IGlzUHJldmlld1xuICAgIH0sIGZ1bmN0aW9uIChzZW5kZXIpIHtcbiAgICAgIHNlbmRlci5kYXRhLiR0ci5yZW1vdmUoKTtcbiAgICB9KTtcbiAgICBvcGVyYXRpb25PdXRlckRpdi5hcHBlbmQoYnRuX29wZXJhdGlvbl92aWV3KTtcbiAgfSxcbiAgRGlhbG9nX0dldF9CdXR0b25fQ2xpY2tfUGFyYTogZnVuY3Rpb24gRGlhbG9nX0dldF9CdXR0b25fQ2xpY2tfUGFyYSgkc2luZ2xlQ29udHJvbEVsZW0pIHtcbiAgICB2YXIgcGFyYSA9IHtcbiAgICAgIEZvcm1JZDogJHNpbmdsZUNvbnRyb2xFbGVtLmF0dHIoXCJmb3JtaWRcIiksXG4gICAgICBXaW5kb3dIZWlnaHQ6ICRzaW5nbGVDb250cm9sRWxlbS5hdHRyKFwid2luZG93aGVpZ2h0XCIpLFxuICAgICAgV2luZG93V2lkdGg6ICRzaW5nbGVDb250cm9sRWxlbS5hdHRyKFwid2luZG93d2lkdGhcIiksXG4gICAgICBJbnN0YW5jZU5hbWU6ICRzaW5nbGVDb250cm9sRWxlbS5hdHRyKFwiY2xpZW50X2luc3RhbmNlX25hbWVcIiksXG4gICAgICBEaWFsb2dXaW5kb3dUaXRsZTogJHNpbmdsZUNvbnRyb2xFbGVtLmF0dHIoXCJkaWFsb2d3aW5kb3d0aXRsZVwiKVxuICAgIH07XG4gICAgcmV0dXJuIHBhcmE7XG4gIH0sXG4gIERpYWxvZ19HZXRfU3ViRm9ybV9SZWNvcmRDb21wbGV4UG86IGZ1bmN0aW9uIERpYWxvZ19HZXRfU3ViRm9ybV9SZWNvcmRDb21wbGV4UG8oaW5zdGFuY2VOYW1lLCBzdWJGb3JtRGF0YVJlbGF0aW9uTGlzdCwgaWRWYWx1ZSkge1xuICAgIHZhciB0aGlzSW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRJbnN0YW5jZShpbnN0YW5jZU5hbWUpO1xuICAgIChmdW5jdGlvbiAoc3ViRm9ybURhdGFSZWxhdGlvbkxpc3QsIGlkVmFsdWUpIHtcbiAgICAgIHZhciAkdHJFbGVtID0gdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0clt0cl9yZWNvcmRfaWQ9J1wiICsgaWRWYWx1ZSArIFwiJ11cIik7XG5cbiAgICAgIHZhciB0cl9yZWNvcmRfZGF0YSA9IHRoaXMuR2V0Um93RGF0YSgkdHJFbGVtKTtcbiAgICAgIHZhciBjaGlsZF9yZWxhdGlvbl9wb19hcnJheSA9IHRoaXMuR2V0Q2hpbGRSZWxhdGlvblBPQXJyYXkoJHRyRWxlbSk7XG4gICAgICB2YXIgbWFpblBPID0gRm9ybVJlbGF0aW9uUE9VdGlsaXR5LkZpbmRNYWluUmVsYXRpb25QTyhzdWJGb3JtRGF0YVJlbGF0aW9uTGlzdCk7XG4gICAgICBGb3JtUmVsYXRpb25QT1V0aWxpdHkuQWRkMVRvMURhdGFSZWNvcmRGaWVsZFBPTGlzdChtYWluUE8sIEZvcm1SZWxhdGlvblBPVXRpbGl0eS5HZXQxVG8xRGF0YVJlY29yZEZpZWxkUE9BcnJheSh0cl9yZWNvcmRfZGF0YSkpO1xuICAgICAgdmFyIGNoaWxkUE9MaXN0ID0gRm9ybVJlbGF0aW9uUE9VdGlsaXR5LkZpbmROb3RNYWluUmVsYXRpb25QTyhzdWJGb3JtRGF0YVJlbGF0aW9uTGlzdCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRQT0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkUE8gPSBjaGlsZFBPTGlzdFtpXTtcbiAgICAgICAgdmFyIHRhYmxlTmFtZSA9IGNoaWxkUE8udGFibGVOYW1lO1xuICAgICAgICB2YXIgY2hpbGRfcmVsYXRpb25fcG8gPSBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUoY2hpbGRfcmVsYXRpb25fcG9fYXJyYXksIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0udGFibGVOYW1lID09IHRhYmxlTmFtZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGNoaWxkX3JlbGF0aW9uX3BvKSB7XG4gICAgICAgICAgRm9ybVJlbGF0aW9uUE9VdGlsaXR5LkFkZDFUb05EYXRhUmVjb3JkKGNoaWxkUE8sIEZvcm1SZWxhdGlvblBPVXRpbGl0eS5HZXQxVG9ORGF0YVJlY29yZChjaGlsZF9yZWxhdGlvbl9wbykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkuY2FsbCh0aGlzSW5zdGFuY2UsIHN1YkZvcm1EYXRhUmVsYXRpb25MaXN0LCBpZFZhbHVlKTtcbiAgICByZXR1cm4ge1xuICAgICAgZm9ybVJlY29yZERhdGFSZWxhdGlvblBPTGlzdDogc3ViRm9ybURhdGFSZWxhdGlvbkxpc3RcbiAgICB9O1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0ZEQ1RfVGV4dEJveCA9IHtcbiAgUmVuZGVyZXJDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJDaGFpbihfcmVuZGVyZXJDaGFpblBhcmFzKSB7fSxcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyRGF0YUNoYWluKCkge30sXG4gIEdldFZhbHVlOiBIVE1MQ29udHJvbC5HZXRWYWx1ZSxcbiAgU2V0VmFsdWU6IEhUTUxDb250cm9sLlNldFZhbHVlXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0ZEQ1RfVGV4dERhdGVUaW1lID0ge1xuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKF9yZW5kZXJlckNoYWluUGFyYXMpIHt9LFxuICBSZW5kZXJlckRhdGFDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJEYXRhQ2hhaW4sXG4gIEdldFZhbHVlOiBIVE1MQ29udHJvbC5HZXRWYWx1ZSxcbiAgU2V0VmFsdWU6IEhUTUxDb250cm9sLlNldFZhbHVlXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfRm9ybUJ1dHRvbiA9IHtcbiAgX0xpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlOiBudWxsLFxuICBSZW5kZXJlckNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckNoYWluLFxuICBSZXNvbHZlU2VsZjogZnVuY3Rpb24gUmVzb2x2ZVNlbGYoX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB2YXIgY2FwdGlvbiA9ICRzaW5nbGVDb250cm9sRWxlbS5hdHRyKFwiYnV0dG9uY2FwdGlvblwiKTtcbiAgICB2YXIgJGJ1dHRvbiA9ICQoXCI8YnV0dG9uIGNsYXNzPSd3bGRjdC1saXN0LWJ1dHRvbic+XCIgKyBjYXB0aW9uICsgXCI8L2J1dHRvbj5cIik7XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSAkc2luZ2xlQ29udHJvbEVsZW0ucHJvcChcImF0dHJpYnV0ZXNcIik7XG4gICAgJC5lYWNoKGF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICRidXR0b24uYXR0cih0aGlzLm5hbWUsIHRoaXMudmFsdWUpO1xuICAgIH0pO1xuICAgICRidXR0b24uYmluZChcImNsaWNrXCIsIHtcbiAgICAgIFwiYnV0dG9uRWxlbVwiOiAkYnV0dG9uLFxuICAgICAgXCJzZWxmSW5zdGFuY2VcIjogdGhpc1xuICAgIH0sIHRoaXMuQ2xpY2tFdmVudCk7XG4gICAgcmV0dXJuICRidXR0b247XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbihfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdmFyICRXTERDVF9MaXN0QnV0dG9uQ29udGFpbmVyID0gJHNpbmdsZUNvbnRyb2xFbGVtLnBhcmVudHMoXCJbc2luZ2xlbmFtZT0nV0xEQ1RfTGlzdEJ1dHRvbkNvbnRhaW5lciddXCIpO1xuICAgIHZhciAkV0xEQ1RfTGlzdFRhYmxlQ29udGFpbmVyRWxlbSA9ICRXTERDVF9MaXN0QnV0dG9uQ29udGFpbmVyLm5leHRBbGwoXCJbY2xpZW50X3Jlc29sdmU9J1dMRENUX0xpc3RUYWJsZUNvbnRhaW5lciddXCIpO1xuICAgIHRoaXMuX0xpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlID0gSFRNTENvbnRyb2wuR2V0Q29udHJvbEluc3RhbmNlQnlFbGVtKCRXTERDVF9MaXN0VGFibGVDb250YWluZXJFbGVtKTtcbiAgfSxcbiAgQ2xpY2tFdmVudDogZnVuY3Rpb24gQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICB2YXIgJGJ1dHRvbiA9IHNlbmRlci5kYXRhLmJ1dHRvbkVsZW07XG4gICAgdmFyIF9zZWxmID0gc2VuZGVyLmRhdGEuc2VsZkluc3RhbmNlO1xuICAgIGNvbnNvbGUubG9nKCRidXR0b24pO1xuICAgIHZhciBiaW5kYXV0aG9yaXR5ID0gJGJ1dHRvbi5hdHRyKFwiYmluZGF1dGhvcml0eVwiKTtcbiAgICB2YXIgYnV0dG9uY2FwdGlvbiA9ICRidXR0b24uYXR0cihcImJ1dHRvbmNhcHRpb25cIik7XG4gICAgdmFyIGJ1dHRvbnR5cGUgPSAkYnV0dG9uLmF0dHIoXCJidXR0b250eXBlXCIpO1xuICAgIHZhciBjdXN0Y2xpZW50Y2xpY2tiZWZvcmVtZXRob2QgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50Y2xpY2tiZWZvcmVtZXRob2RcIik7XG4gICAgdmFyIGN1c3RjbGllbnRjbGlja2JlZm9yZW1ldGhvZHBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50Y2xpY2tiZWZvcmVtZXRob2RwYXJhXCIpO1xuICAgIHZhciBjdXN0Y2xpZW50cmVuZGVyZXJhZnRlcm1ldGhvZHBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50cmVuZGVyZXJhZnRlcm1ldGhvZHBhcmFcIik7XG4gICAgdmFyIGN1c3RjbGllbnRyZW5kZXJlcmFmdGVybWV0aG9kcGFyYXBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50cmVuZGVyZXJhZnRlcm1ldGhvZHBhcmFwYXJhXCIpO1xuICAgIHZhciBjdXN0Y2xpZW50cmVuZGVyZXJtZXRob2QgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50cmVuZGVyZXJtZXRob2RcIik7XG4gICAgdmFyIGN1c3RjbGllbnRyZW5kZXJlcm1ldGhvZHBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50cmVuZGVyZXJtZXRob2RwYXJhXCIpO1xuICAgIHZhciBjdXN0c2VydmVycmVzb2x2ZW1ldGhvZCA9ICRidXR0b24uYXR0cihcImN1c3RzZXJ2ZXJyZXNvbHZlbWV0aG9kXCIpO1xuICAgIHZhciBjdXN0c2VydmVycmVzb2x2ZW1ldGhvZHBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0c2VydmVycmVzb2x2ZW1ldGhvZHBhcmFcIik7XG4gICAgdmFyIGZvcm1jb2RlID0gJGJ1dHRvbi5hdHRyKFwiZm9ybWNvZGVcIik7XG4gICAgdmFyIGZvcm1pZCA9ICRidXR0b24uYXR0cihcImZvcm1pZFwiKTtcbiAgICB2YXIgZm9ybW1vZHVsZWlkID0gJGJ1dHRvbi5hdHRyKFwiZm9ybW1vZHVsZWlkXCIpO1xuICAgIHZhciBmb3JtbW9kdWxlbmFtZSA9ICRidXR0b24uYXR0cihcImZvcm1tb2R1bGVuYW1lXCIpO1xuICAgIHZhciBmb3JtbmFtZSA9ICRidXR0b24uYXR0cihcImZvcm1uYW1lXCIpO1xuICAgIHZhciBlbGVtaWQgPSAkYnV0dG9uLmF0dHIoXCJpZFwiKTtcbiAgICB2YXIgYnV0dG9uaWQgPSAkYnV0dG9uLmF0dHIoXCJidXR0b25pZFwiKTtcbiAgICB2YXIgaW5uZXJidXR0b25qc29uc3RyaW5nID0gJGJ1dHRvbi5hdHRyKFwiaW5uZXJidXR0b25qc29uc3RyaW5nXCIpO1xuICAgIHZhciBvcGVudHlwZSA9ICRidXR0b24uYXR0cihcIm9wZW50eXBlXCIpO1xuICAgIHZhciBvcGVyYXRpb24gPSAkYnV0dG9uLmF0dHIoXCJvcGVyYXRpb25cIik7XG4gICAgdmFyIHNpbmdsZW5hbWUgPSAkYnV0dG9uLmF0dHIoXCJzaW5nbGVuYW1lXCIpO1xuICAgIHZhciB3aW5kb3djYXB0aW9uID0gJGJ1dHRvbi5hdHRyKFwid2luZG93Y2FwdGlvblwiKTtcbiAgICB2YXIgd2luZG93aGVpZ2h0ID0gJGJ1dHRvbi5hdHRyKFwid2luZG93aGVpZ2h0XCIpO1xuICAgIHZhciB3aW5kb3d3aWR0aCA9ICRidXR0b24uYXR0cihcIndpbmRvd3dpZHRoXCIpO1xuICAgIHZhciBjbGllbnRfcmVzb2x2ZSA9ICRidXR0b24uYXR0cihcImNsaWVudF9yZXNvbHZlXCIpO1xuICAgIHZhciByZWNvcmRJZCA9IFwiXCI7XG5cbiAgICBpZiAob3BlcmF0aW9uID09IFwidXBkYXRlXCIgfHwgb3BlcmF0aW9uID09IFwidmlld1wiKSB7XG4gICAgICB2YXIgY2hlY2tlZFJlY29yZE9ianMgPSBfc2VsZi5fTGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UuR2V0Q2hlY2tlZFJlY29yZCgpO1xuXG4gICAgICBpZiAoY2hlY2tlZFJlY29yZE9ianMubGVuZ3RoID09IDApIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7fpgInmi6npnIDopoHov5vooYzmk43kvZznmoTorrDlvZUhXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKGNoZWNrZWRSZWNvcmRPYmpzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLkuIDmrKHlj6rog73mk43kvZzkuIDmnaHorrDlvZUhXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWNvcmRJZCA9IGNoZWNrZWRSZWNvcmRPYmpzWzBdLklkO1xuICAgICAgfVxuICAgIH1cblxuICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIEJhc2VVdGlsaXR5LkJ1aWxkVmlldyhcIi9IVE1ML0J1aWxkZXIvUnVudGltZS9XZWJGb3JtUnVudGltZS5odG1sXCIsIHtcbiAgICAgIEZvcm1JZDogZm9ybWlkLFxuICAgICAgQnV0dG9uSWQ6IGJ1dHRvbmlkLFxuICAgICAgRWxlbUlkOiBlbGVtaWQsXG4gICAgICBSZWNvcmRJZDogcmVjb3JkSWQsXG4gICAgICBPcGVyYXRpb25UeXBlOiBvcGVyYXRpb25cbiAgICB9KSwge1xuICAgICAgd2lkdGg6IHdpbmRvd3dpZHRoLFxuICAgICAgaGVpZ2h0OiB3aW5kb3doZWlnaHQsXG4gICAgICB0aXRsZTogd2luZG93Y2FwdGlvblxuICAgIH0sIDEsIHRydWUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdEJ1dHRvbkNvbnRhaW5lciA9IHtcbiAgUmVuZGVyZXJDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJDaGFpbihfcmVuZGVyZXJDaGFpblBhcmFzKSB7XG4gICAgdmFyICRzaW5nbGVDb250cm9sRWxlbSA9IF9yZW5kZXJlckNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtO1xuICAgIHZhciAkYnV0dG9uRGl2RWxlbUxpc3QgPSAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcImRpdlwiICsgSFRNTENvbnRyb2xBdHRycy5TRUxFQ1RFRF9KQlVJTEQ0RENfQ1VTVE9NKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcIltpcy1vcC1idXR0b24td3JhcC10YWJsZT0ndHJ1ZSddXCIpLmhpZGUoKTtcbiAgICB2YXIgaW5uZXJXcmFwID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCIud2xkY3QtbGlzdC1idXR0b24taW5uZXItd3JhcFwiKTtcbiAgICB2YXIgaW5uZXJJbnNpZGVXcmFwRGl2ID0gJChcIjxkaXYgY2xhc3M9J3dsZGN0LWxpc3QtYnV0dG9uLWlubmVyLWluc2lkZS13cmFwJyAvPlwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJGJ1dHRvbkRpdkVsZW1MaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJGJ1dHRvbkVsZW0gPSAkKCRidXR0b25EaXZFbGVtTGlzdFtpXSk7XG4gICAgICB2YXIgY2xpZW50UmVzb2x2ZU5hbWUgPSAkYnV0dG9uRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuQ0xJRU5UX1JFU09MVkUpO1xuICAgICAgdmFyIGNsaWVudFJlc29sdmVPYmplY3QgPSBPYmplY3QuY3JlYXRlKGV2YWwoY2xpZW50UmVzb2x2ZU5hbWUpKTtcbiAgICAgIHZhciAkcmVzb2x2ZWRFbGVtID0gY2xpZW50UmVzb2x2ZU9iamVjdC5SZXNvbHZlU2VsZih7XG4gICAgICAgIHNvdXJjZUhUTUw6IF9yZW5kZXJlckNoYWluUGFyYXMuc291cmNlSFRNTCxcbiAgICAgICAgJHJvb3RFbGVtOiBfcmVuZGVyZXJDaGFpblBhcmFzLiRyb290RWxlbSxcbiAgICAgICAgJHBhcmVudENvbnRyb2xFbGVtOiAkc2luZ2xlQ29udHJvbEVsZW0sXG4gICAgICAgICRzaW5nbGVDb250cm9sRWxlbTogJGJ1dHRvbkVsZW0sXG4gICAgICAgIGFsbERhdGE6IF9yZW5kZXJlckNoYWluUGFyYXMuYWxsRGF0YVxuICAgICAgfSk7XG4gICAgICBpbm5lckluc2lkZVdyYXBEaXYuYXBwZW5kKCRyZXNvbHZlZEVsZW0pO1xuICAgIH1cblxuICAgIGlubmVyV3JhcC5hcHBlbmQoaW5uZXJJbnNpZGVXcmFwRGl2KTtcbiAgICBpbm5lcldyYXAuYXBwZW5kKFwiPGRpdiBzdHlsZT1cXFwiY2xlYXI6IGJvdGg7XFxcIj48L2Rpdj5cIik7XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckRhdGFDaGFpblxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RDb21wbGV4U2VhcmNoQ29udGFpbmVyID0ge1xuICBfJFNpbmdsZUNvbnRyb2xFbGVtOiBudWxsLFxuICBfJENvbXBsZXhTZWFyY2hCdXR0b246IG51bGwsXG4gIF8kQ2xlYXJCdXR0b246IG51bGwsXG4gIF8kQ2xvc2VCdXR0b246IG51bGwsXG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0gPSAkc2luZ2xlQ29udHJvbEVsZW07XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmhpZGUoKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcIi53bGRjdC1saXN0LWNvbXBsZXgtc2VhcmNoLWlubmVyLXdyYXBcIikuaGVpZ2h0KFwiMzA1cHhcIik7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCIud2xkY3QtbGlzdC1jb21wbGV4LXNlYXJjaC1pbm5lci13cmFwXCIpLmNzcyhcIm92ZXJmbG93XCIsIFwiYXV0b1wiKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcIi53bGRjdC1saXN0LWNvbXBsZXgtc2VhcmNoLWlubmVyLXdyYXBcIikuYWRkQ2xhc3MoXCJkaXYtY3VzdG9tLXNjcm9sbFwiKTtcbiAgICB2YXIgJHNlYXJjaEJ1dHRvbnNXcmFwID0gJChcIjxkaXYgY2xhc3M9J3dsZGN0LWxpc3QtY29tcGxleC1zZWFyY2gtYnV0dG9uLWlubmVyLXdyYXAnPjxkaXYgY2xhc3M9J2J1dHRvbi1pbm5lci13cmFwJz48L2Rpdj48L2Rpdj5cIik7XG4gICAgdGhpcy5fJENvbXBsZXhTZWFyY2hCdXR0b24gPSAkKFwiPGJ1dHRvbj7mn6Xor6I8L2J1dHRvbj5cIik7XG4gICAgdGhpcy5fJENsZWFyQnV0dG9uID0gJChcIjxidXR0b24+5riF56m6PC9idXR0b24+XCIpO1xuICAgIHRoaXMuXyRDbG9zZUJ1dHRvbiA9ICQoXCI8YnV0dG9uPuWFs+mXrTwvYnV0dG9uPlwiKTtcbiAgICAkc2VhcmNoQnV0dG9uc1dyYXAuZmluZChcIi5idXR0b24taW5uZXItd3JhcFwiKS5hcHBlbmQodGhpcy5fJENvbXBsZXhTZWFyY2hCdXR0b24pLmFwcGVuZCh0aGlzLl8kQ2xlYXJCdXR0b24pLmFwcGVuZCh0aGlzLl8kQ2xvc2VCdXR0b24pO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5hcHBlbmQoJHNlYXJjaEJ1dHRvbnNXcmFwKTtcbiAgfSxcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyRGF0YUNoYWluLFxuICBCdWlsZGVyU2VhcmNoQ29uZGl0aW9uOiBmdW5jdGlvbiBCdWlsZGVyU2VhcmNoQ29uZGl0aW9uKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgIHZhciBhbGxDb250cm9scyA9IHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbS5maW5kKEhUTUxDb250cm9sQXR0cnMuU0VMRUNURURfSkJVSUxENERDX0NVU1RPTSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbENvbnRyb2xzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJGVsZW0gPSAkKGFsbENvbnRyb2xzW2ldKTtcbiAgICAgIHZhciBpbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbSgkZWxlbSk7XG4gICAgICB2YXIgdmFsT2JqID0gaW5zdGFuY2UuR2V0VmFsdWUoJGVsZW0sIHt9KTtcbiAgICAgIHZhciB2YWx1ZSA9IHZhbE9iai52YWx1ZTtcblxuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBvcGVyYXRvcjogJGVsZW0uYXR0cihcImNvbHVtbm9wZXJhdG9yXCIpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICB0YWJsZU5hbWU6ICRlbGVtLmF0dHIoXCJjb2x1bW50YWJsZW5hbWVcIiksXG4gICAgICAgICAgZmllbGROYW1lOiAkZWxlbS5hdHRyKFwiY29sdW1ubmFtZVwiKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBHZXRTdGF0dXM6IGZ1bmN0aW9uIEdldFN0YXR1cygpIHtcbiAgICB2YXIgc3RhdHVzID0gdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtLmF0dHIoXCJzdGF0dXNcIik7XG5cbiAgICBpZiAoc3RhdHVzID09IFwiXCIpIHtcbiAgICAgIHN0YXR1cyA9IFwiZW5hYmxlXCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfSxcbiAgSGlkZTogZnVuY3Rpb24gSGlkZSgpIHtcbiAgICB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0uaGlkZSgpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdFNpbXBsZVNlYXJjaENvbnRhaW5lciA9IHtcbiAgXyRTaW1wbGVTZWFyY2hCdXR0b246IG51bGwsXG4gIF8kU2hvd0NvbXBsZXhTZWFyY2hCdXR0b246IG51bGwsXG4gIF8kU2luZ2xlQ29udHJvbEVsZW06IG51bGwsXG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0gPSAkc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdmFyIHBhZ2VXaWR0aCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZVdpZHRoKCk7XG4gICAgdmFyIGJ1dHRvbldyYXBXaWR0aCA9IDIwMDtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcInRhYmxlOmZpcnN0XCIpLndpZHRoKHBhZ2VXaWR0aCAtIGJ1dHRvbldyYXBXaWR0aCk7XG4gICAgdmFyICRzZWFyY2hCdXR0b25zV3JhcCA9ICQoXCI8ZGl2IGNsYXNzPSd3bGRjdC1saXN0LXNpbXBsZS1zZWFyY2gtYnV0dG9uLWlubmVyLXdyYXAnIC8+XCIpO1xuICAgICRzZWFyY2hCdXR0b25zV3JhcC53aWR0aChidXR0b25XcmFwV2lkdGggLSA0MCk7XG4gICAgdGhpcy5fJFNpbXBsZVNlYXJjaEJ1dHRvbiA9ICQoXCI8YnV0dG9uPuafpeivojwvYnV0dG9uPlwiKTtcbiAgICB0aGlzLl8kU2hvd0NvbXBsZXhTZWFyY2hCdXR0b24gPSAkKFwiPGJ1dHRvbj7pq5jnuqfmn6Xor6I8L2J1dHRvbj5cIik7XG4gICAgJHNlYXJjaEJ1dHRvbnNXcmFwLmFwcGVuZCh0aGlzLl8kU2ltcGxlU2VhcmNoQnV0dG9uKTtcbiAgICAkc2VhcmNoQnV0dG9uc1dyYXAuYXBwZW5kKHRoaXMuXyRTaG93Q29tcGxleFNlYXJjaEJ1dHRvbik7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmFwcGVuZCgkc2VhcmNoQnV0dG9uc1dyYXApO1xuICAgIEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcyk7XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckRhdGFDaGFpbixcbiAgQnVpbGRlclNlYXJjaENvbmRpdGlvbjogZnVuY3Rpb24gQnVpbGRlclNlYXJjaENvbmRpdGlvbigpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICB2YXIgYWxsQ29udHJvbHMgPSB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0uZmluZChIVE1MQ29udHJvbEF0dHJzLlNFTEVDVEVEX0pCVUlMRDREQ19DVVNUT00pO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxDb250cm9scy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyICRlbGVtID0gJChhbGxDb250cm9sc1tpXSk7XG4gICAgICB2YXIgaW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sSW5zdGFuY2VCeUVsZW0oJGVsZW0pO1xuICAgICAgdmFyIHZhbE9iaiA9IGluc3RhbmNlLkdldFZhbHVlKCRlbGVtLCB7fSk7XG4gICAgICB2YXIgdmFsdWUgPSB2YWxPYmoudmFsdWU7XG5cbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgb3BlcmF0b3I6ICRlbGVtLmF0dHIoXCJjb2x1bW5vcGVyYXRvclwiKSxcbiAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgdGFibGVOYW1lOiAkZWxlbS5hdHRyKFwiY29sdW1udGFibGVuYW1lXCIpLFxuICAgICAgICAgIGZpZWxkTmFtZTogJGVsZW0uYXR0cihcImNvbHVtbm5hbWVcIilcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgR2V0U3RhdHVzOiBmdW5jdGlvbiBHZXRTdGF0dXMoKSB7XG4gICAgdmFyIHN0YXR1cyA9IHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbS5hdHRyKFwic3RhdHVzXCIpO1xuXG4gICAgaWYgKHN0YXR1cyA9PSBcIlwiKSB7XG4gICAgICBzdGF0dXMgPSBcImVuYWJsZVwiO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0dXM7XG4gIH0sXG4gIEhpZGU6IGZ1bmN0aW9uIEhpZGUoKSB7XG4gICAgdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtLmhpZGUoKTtcbiAgfSxcbiAgSGlkZUNvbXBsZXhCdXR0b246IGZ1bmN0aW9uIEhpZGVDb21wbGV4QnV0dG9uKCkge1xuICAgIHRoaXMuXyRTaG93Q29tcGxleFNlYXJjaEJ1dHRvbi5yZW1vdmUoKTtcblxuICAgIHRoaXMuXyRTaW1wbGVTZWFyY2hCdXR0b24ucGFyZW50KCkud2lkdGgoXCI4MHB4XCIpO1xuXG4gICAgdmFyIHBhZ2VXaWR0aCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZVdpZHRoKCk7XG5cbiAgICB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0uZmluZChcInRhYmxlOmZpcnN0XCIpLndpZHRoKHBhZ2VXaWR0aCAtIDEyMCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXTERDVF9MaXN0VGFibGVDaGVja0JveCA9IHtcbiAgUmVuZGVyZXJDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpbixcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyRGF0YUNoYWluKF9yZW5kZXJlckRhdGFDaGFpblBhcmFzKSB7XG4gICAgdmFyIHZhbHVlID0gX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMudmFsO1xuICAgIHZhciAkdGQgPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kdGQ7XG4gICAgJHRkLmNzcyhcInRleHRBbGlnblwiLCBcImNlbnRlclwiKTtcbiAgICB2YXIgJGNoZWNrYm94ID0gJChcIjxpbnB1dCBpc3Jvd19jaGVja2JveD1cXFwidHJ1ZVxcXCIgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGNsYXNzPVxcXCJsaXN0LWNoZWNrYm94LWNcXFwiIHZhbHVlPVxcXCJcIiArIHZhbHVlICsgXCJcXFwiIHJvd19jaGVja2JveF9yZWNvcmRfaWQ9XFxcIlwiICsgdmFsdWUgKyBcIlxcXCI+XCIpO1xuICAgICRjaGVja2JveC5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgXCJzZWxmSW5zdGFuY2VcIjogdGhpcyxcbiAgICAgIFwiJGVsZW1cIjogJGNoZWNrYm94XG4gICAgfSwgdGhpcy5DbGlja0V2ZW50KTtcbiAgICAkdGQuaHRtbChcIlwiKTtcbiAgICAkdGQuYXBwZW5kKCRjaGVja2JveCk7XG4gIH0sXG4gIENsaWNrRXZlbnQ6IGZ1bmN0aW9uIENsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgdmFyICRlbGVtID0gc2VuZGVyLmRhdGEuJGVsZW07XG5cbiAgICB2YXIgbGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UgPSBXTERDVF9MaXN0VGFibGVDb250YWluZXIuX19Jbm5lckVsZW1HZXRJbnN0YW5jZSgkZWxlbSk7XG5cbiAgICBpZiAoJGVsZW0ucHJvcChcImNoZWNrZWRcIikpIHtcbiAgICAgIGxpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlLlNhdmVDaGVja2VkUm93RGF0YSgkZWxlbS52YWwoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlLkRlbGV0ZUNoZWNrZWRSb3dEYXRhKCRlbGVtLnZhbCgpKTtcbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXTERDVF9MaXN0VGFibGVDb250YWluZXIgPSB7XG4gIEdldEhUTUw6IGZ1bmN0aW9uIEdldEhUTUwoKSB7XG4gICAgcmV0dXJuIFwiPHRhYmxlIGlkPVxcXCJleGFtcGxlXFxcIiBjbGFzcz1cXFwic3RyaXBlIHJvdy1ib3JkZXIgb3JkZXItY29sdW1uXFxcIiBzdHlsZT1cXFwid2lkdGg6MTAwJVxcXCI+XFxuXCIgKyBcIiAgICAgICAgPHRoZWFkPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGggY29sc3Bhbj0nMic+Rmlyc3QgbmFtZTwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+UG9zaXRpb248L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPk9mZmljZTwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGggY29sc3Bhbj0nMic+QWdlPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5TYWxhcnk8L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPkV4dG4uPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5FLW1haWw8L3RoPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+Rmlyc3QgbmFtZTwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+TGFzdCBuYW1lPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5Qb3NpdGlvbjwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+T2ZmaWNlPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5BZ2U8L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPlN0YXJ0IGRhdGU8L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPlNhbGFyeTwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+RXh0bi48L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPkUtbWFpbDwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgPC90aGVhZD5cXG5cIiArIFwiICAgICAgICA8dGJvZHk+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD48YSBvbmNsaWNrPSdhbGVydCgxKSc+VGlnZXI8L2E+PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5OaXhvbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U3lzdGVtIEFyY2hpdGVjdDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+RWRpbmJ1cmdoPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD42MTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMS8wNC8yNTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDMyMCw4MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjU0MjE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPnQubml4b25AZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+R2FycmV0dDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+V2ludGVyczwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+QWNjb3VudGFudDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+VG9reW88L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjYzPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDExLzA3LzI1PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMTcwLDc1MDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+ODQyMjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Zy53aW50ZXJzQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkFzaHRvbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Q294PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5KdW5pb3IgVGVjaG5pY2FsIEF1dGhvcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2FuIEZyYW5jaXNjbzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NjY8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMDkvMDEvMTI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQ4NiwwMDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjE1NjI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmEuY294QGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkNlZHJpYzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+S2VsbHk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNlbmlvciBKYXZhc2NyaXB0IERldmVsb3BlcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+RWRpbmJ1cmdoPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMi8wMy8yOTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDQzMywwNjA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjYyMjQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmMua2VsbHlAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+QWlyaTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2F0b3U8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkFjY291bnRhbnQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlRva3lvPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4zMzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAwOC8xMS8yODwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDE2Miw3MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjU0MDc8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmEuc2F0b3VAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+QnJpZWxsZTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+V2lsbGlhbXNvbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+SW50ZWdyYXRpb24gU3BlY2lhbGlzdDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TmV3IFlvcms8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjYxPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDEyLzEyLzAyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMzcyLDAwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NDgwNDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Yi53aWxsaWFtc29uQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkhlcnJvZDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Q2hhbmRsZXI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNhbGVzIEFzc2lzdGFudDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2FuIEZyYW5jaXNjbzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NTk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTIvMDgvMDY8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQxMzcsNTAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD45NjA4PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5oLmNoYW5kbGVyQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlJob25hPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5EYXZpZHNvbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+SW50ZWdyYXRpb24gU3BlY2lhbGlzdDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+VG9reW88L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjU1PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDEwLzEwLzE0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMzI3LDkwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NjIwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+ci5kYXZpZHNvbkBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Db2xsZWVuPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5IdXJzdDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+SmF2YXNjcmlwdCBEZXZlbG9wZXI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNhbiBGcmFuY2lzY288L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjM5PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDA5LzA5LzE1PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMjA1LDUwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjM2MDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Yy5odXJzdEBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Tb255YTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+RnJvc3Q8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNvZnR3YXJlIEVuZ2luZWVyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5FZGluYnVyZ2g8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIzPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDA4LzEyLzEzPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMTAzLDYwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MTY2NzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+cy5mcm9zdEBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5KZW5hPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5HYWluZXM8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPk9mZmljZSBNYW5hZ2VyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Mb25kb248L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjMwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDA4LzEyLzE5PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kOTAsNTYwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4zODE0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5qLmdhaW5lc0BkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5RdWlubjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Rmx5bm48L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlN1cHBvcnQgTGVhZDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+RWRpbmJ1cmdoPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMy8wMy8wMzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDM0MiwwMDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjk0OTc8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPnEuZmx5bm5AZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Q2hhcmRlPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5NYXJzaGFsbDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+UmVnaW9uYWwgRGlyZWN0b3I8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNhbiBGcmFuY2lzY288L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjM2PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDA4LzEwLzE2PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kNDcwLDYwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Njc0MTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Yy5tYXJzaGFsbEBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5IYWxleTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+S2VubmVkeTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2VuaW9yIE1hcmtldGluZyBEZXNpZ25lcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TG9uZG9uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD40MzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMi8xMi8xODwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDMxMyw1MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjM1OTc8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmgua2VubmVkeUBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5UYXR5YW5hPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5GaXR6cGF0cmljazwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+UmVnaW9uYWwgRGlyZWN0b3I8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkxvbmRvbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MTk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTAvMDMvMTc8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQzODUsNzUwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4xOTY1PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD50LmZpdHpwYXRyaWNrQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPk1pY2hhZWw8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNpbHZhPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5NYXJrZXRpbmcgRGVzaWduZXI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkxvbmRvbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NjY8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTIvMTEvMjc8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQxOTgsNTAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4xNTgxPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5tLnNpbHZhQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkNoYXJkZTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TWFyc2hhbGw8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlJlZ2lvbmFsIERpcmVjdG9yPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TYW4gRnJhbmNpc2NvPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4zNjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAwOC8xMC8xNjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDQ3MCw2MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjY3NDE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmMubWFyc2hhbGxAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+SGFsZXk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPktlbm5lZHk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNlbmlvciBNYXJrZXRpbmcgRGVzaWduZXI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkxvbmRvbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NDM8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTIvMTIvMTg8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQzMTMsNTAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4zNTk3PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5oLmtlbm5lZHlAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+VGF0eWFuYTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Rml0enBhdHJpY2s8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlJlZ2lvbmFsIERpcmVjdG9yPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Mb25kb248L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjE5PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDEwLzAzLzE3PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMzg1LDc1MDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MTk2NTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+dC5maXR6cGF0cmlja0BkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5NaWNoYWVsPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TaWx2YTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TWFya2V0aW5nIERlc2lnbmVyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Mb25kb248L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjY2PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDEyLzExLzI3PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMTk4LDUwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MTU4MTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+bS5zaWx2YUBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgPC90Ym9keT5cXG5cIiArIFwiICAgIDwvdGFibGU+XCI7XG4gIH0sXG4gIF9JbnN0YW5jZU1hcDoge30sXG4gIF9DdXJyZW50UGFnZU51bTogMSxcbiAgX0RhdGFTZXQ6IG51bGwsXG4gIF9EYXRhU2V0UnVudGltZUluc3RhbmNlOiBudWxsLFxuICBfQ2FjaGUkU2luZ2xlQ29udHJvbEVsZW06IG51bGwsXG4gIF9DYWNoZVJlbmRlcmVyRGF0YUNoYWluUGFyYXM6IG51bGwsXG4gIF9TaW1wbGVTZWFyY2hDb250YWluZXJJbnN0YW5jZTogbnVsbCxcbiAgX0NvbXBsZXhTZWFyY2hDb250YWluZXJJbnN0YW5jZTogbnVsbCxcbiAgX1F1ZXJ5UE9MaXN0OiBbXSxcbiAgX0NoZWNrZWRSZWNvcmRBcnJheTogW10sXG4gIF8kRWxlbTogbnVsbCxcbiAgR2V0SW5zdGFuY2U6IGZ1bmN0aW9uIEdldEluc3RhbmNlKG5hbWUpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fSW5zdGFuY2VNYXApIHtcbiAgICAgIGlmIChrZXkgPT0gbmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fSW5zdGFuY2VNYXBba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaW5zdGFuY2UgPSBldmFsKG5hbWUpO1xuICAgIHRoaXMuX0luc3RhbmNlTWFwW25hbWVdID0gaW5zdGFuY2U7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9LFxuICBJbml0aWFsaXplOiBmdW5jdGlvbiBJbml0aWFsaXplKCkge1xuICAgIHRoaXMuX0RhdGFTZXRSdW50aW1lSW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKERhdGFTZXRSdW50aW1lKTtcbiAgfSxcbiAgUmVuZGVyZXJDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJDaGFpbihfcmVuZGVyZXJDaGFpblBhcmFzKSB7XG4gICAgdmFyICRzaW5nbGVDb250cm9sRWxlbSA9IF9yZW5kZXJlckNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtO1xuICAgIHRoaXMuXyRFbGVtID0gJHNpbmdsZUNvbnRyb2xFbGVtO1xuICAgIHZhciAkc2ltcGxlU2VhcmNoQ29udGFpbmVyRWxlbSA9ICRzaW5nbGVDb250cm9sRWxlbS5wcmV2QWxsKFwiW2NsaWVudF9yZXNvbHZlPSdXTERDVF9MaXN0U2ltcGxlU2VhcmNoQ29udGFpbmVyJ11cIik7XG4gICAgdmFyICRjb21wbGV4U2VhcmNoQ29udGFpbmVyRWxlbSA9ICRzaW5nbGVDb250cm9sRWxlbS5wcmV2QWxsKFwiW2NsaWVudF9yZXNvbHZlPSdXTERDVF9MaXN0Q29tcGxleFNlYXJjaENvbnRhaW5lciddXCIpO1xuICAgIHRoaXMuX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlID0gSFRNTENvbnRyb2wuR2V0Q29udHJvbEluc3RhbmNlQnlFbGVtKCRzaW1wbGVTZWFyY2hDb250YWluZXJFbGVtKTtcbiAgICB0aGlzLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sSW5zdGFuY2VCeUVsZW0oJGNvbXBsZXhTZWFyY2hDb250YWluZXJFbGVtKTtcblxuICAgIHRoaXMuX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlLl8kU2ltcGxlU2VhcmNoQnV0dG9uLmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBcImxpc3RJbnN0YW5jZVwiOiB0aGlzXG4gICAgfSwgdGhpcy5TaW1wbGVTZWFyY2hDbGlja0V2ZW50KTtcblxuICAgIHRoaXMuX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlLl8kU2hvd0NvbXBsZXhTZWFyY2hCdXR0b24uYmluZChcImNsaWNrXCIsIHtcbiAgICAgIFwibGlzdEluc3RhbmNlXCI6IHRoaXNcbiAgICB9LCB0aGlzLlNob3dDb21wbGV4U2VhcmNoQ2xpY2tFdmVudCk7XG5cbiAgICB0aGlzLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UuXyRDb21wbGV4U2VhcmNoQnV0dG9uLmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBcImxpc3RJbnN0YW5jZVwiOiB0aGlzXG4gICAgfSwgdGhpcy5Db21wbGV4U2VhcmNoQ2xpY2tFdmVudCk7XG5cbiAgICB0aGlzLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UuXyRDbGVhckJ1dHRvbi5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgXCJsaXN0SW5zdGFuY2VcIjogdGhpc1xuICAgIH0sIHRoaXMuQ29tcGxleFNlYXJjaENsZWFyQ2xpY2tFdmVudCk7XG5cbiAgICB0aGlzLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UuXyRDbG9zZUJ1dHRvbi5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgXCJsaXN0SW5zdGFuY2VcIjogdGhpc1xuICAgIH0sIHRoaXMuQ29tcGxleFNlYXJjaENsb3NlQ2xpY2tFdmVudCk7XG5cbiAgICBpZiAodGhpcy5fU2ltcGxlU2VhcmNoQ29udGFpbmVySW5zdGFuY2UuR2V0U3RhdHVzKCkgPT0gXCJkaXNhYmxlXCIpIHtcbiAgICAgIHRoaXMuX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlLkhpZGUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fQ29tcGxleFNlYXJjaENvbnRhaW5lckluc3RhbmNlLkdldFN0YXR1cygpID09IFwiZGlzYWJsZVwiKSB7XG4gICAgICB0aGlzLl9TaW1wbGVTZWFyY2hDb250YWluZXJJbnN0YW5jZS5IaWRlQ29tcGxleEJ1dHRvbigpO1xuICAgIH1cblxuICAgIHZhciAkdGVtcGxhdGVUYWJsZSA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGVcIik7XG4gICAgdmFyICR0ZW1wbGF0ZVRhYmxlUm93ID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZSB0Ym9keSB0clwiKTtcbiAgICB2YXIgJHRlbXBsYXRlVGFibGVIZWFkZXJSb3dzID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZSB0aGVhZCB0clwiKTtcbiAgICB0aGlzLkFwcGVuZENoZWNrQm94Q29sdW1uVGVtcGxhdGUoJHRlbXBsYXRlVGFibGUsICR0ZW1wbGF0ZVRhYmxlSGVhZGVyUm93cywgJHRlbXBsYXRlVGFibGVSb3cpO1xuICAgIEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcyk7XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbihfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcywgaXNSZVJlbmRlcmVyKSB7XG4gICAgdmFyIHVzZWRUb3BEYXRhU2V0ID0gdHJ1ZTtcbiAgICB2YXIgZGF0YVNldElkO1xuICAgIHZhciBwYWdlU2l6ZTtcblxuICAgIGlmICh1c2VkVG9wRGF0YVNldCkge1xuICAgICAgZGF0YVNldElkID0gX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMudG9wRGF0YVNldElkO1xuICAgICAgcGFnZVNpemUgPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy5wby5saXN0RGF0YXNldFBhZ2VTaXplO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fQ2FjaGVSZW5kZXJlckRhdGFDaGFpblBhcmFzKSB7XG4gICAgICB0aGlzLl9DYWNoZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMgPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcztcbiAgICAgIHRoaXMuX0NhY2hlJFNpbmdsZUNvbnRyb2xFbGVtID0gX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtLmNsb25lKCk7XG4gICAgfVxuXG4gICAgaWYgKGlzUmVSZW5kZXJlcikge1xuICAgICAgX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtLmh0bWwodGhpcy5fQ2FjaGUkU2luZ2xlQ29udHJvbEVsZW0uaHRtbCgpKTtcbiAgICB9XG5cbiAgICBpZiAoX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMubGlzdFJ1bnRpbWVJbnN0YW5jZS5Jc1ByZXZpZXcoKSkge1xuICAgICAgdmFyIG1vY2tEYXRhU2V0ID0ge1xuICAgICAgICBcInRvdGFsXCI6IDEwMDAsXG4gICAgICAgIFwibGlzdFwiOiBbXSxcbiAgICAgICAgXCJwYWdlTnVtXCI6IDEsXG4gICAgICAgIFwicGFnZVNpemVcIjogNSxcbiAgICAgICAgXCJzaXplXCI6IDUsXG4gICAgICAgIFwic3RhcnRSb3dcIjogMSxcbiAgICAgICAgXCJlbmRSb3dcIjogNSxcbiAgICAgICAgXCJwYWdlc1wiOiAyMDAsXG4gICAgICAgIFwicHJlUGFnZVwiOiAwLFxuICAgICAgICBcIm5leHRQYWdlXCI6IDIsXG4gICAgICAgIFwiaXNGaXJzdFBhZ2VcIjogdHJ1ZSxcbiAgICAgICAgXCJpc0xhc3RQYWdlXCI6IGZhbHNlLFxuICAgICAgICBcImhhc1ByZXZpb3VzUGFnZVwiOiBmYWxzZSxcbiAgICAgICAgXCJoYXNOZXh0UGFnZVwiOiB0cnVlLFxuICAgICAgICBcIm5hdmlnYXRlUGFnZXNcIjogOCxcbiAgICAgICAgXCJuYXZpZ2F0ZXBhZ2VOdW1zXCI6IFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4XSxcbiAgICAgICAgXCJuYXZpZ2F0ZUZpcnN0UGFnZVwiOiAxLFxuICAgICAgICBcIm5hdmlnYXRlTGFzdFBhZ2VcIjogOCxcbiAgICAgICAgXCJmaXJzdFBhZ2VcIjogMSxcbiAgICAgICAgXCJsYXN0UGFnZVwiOiA4XG4gICAgICB9O1xuICAgICAgdGhpcy5fRGF0YVNldCA9IG1vY2tEYXRhU2V0O1xuICAgICAgdGhpcy5DcmVhdGVUYWJsZShfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW0sIG1vY2tEYXRhU2V0LCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydExvYWRpbmcod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCwge1xuICAgICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgICAgaGlkZToge1xuICAgICAgICAgIGVmZmVjdDogXCJmYWRlXCIsXG4gICAgICAgICAgZHVyYXRpb246IDUwMFxuICAgICAgICB9XG4gICAgICB9LCBcIuaVsOaNruWKoOi9veS4rSzor7fnqI3lgJkuLi4uXCIpO1xuXG4gICAgICB0aGlzLl9EYXRhU2V0UnVudGltZUluc3RhbmNlLkdldERhdGFTZXREYXRhKHtcbiAgICAgICAgZGF0YVNldElkOiBkYXRhU2V0SWQsXG4gICAgICAgIHBhZ2VTaXplOiBwYWdlU2l6ZSxcbiAgICAgICAgcGFnZU51bTogdGhpcy5fQ3VycmVudFBhZ2VOdW0sXG4gICAgICAgIGxpc3RRdWVyeVBPTGlzdDogdGhpcy5fUXVlcnlQT0xpc3QsXG4gICAgICAgIGV4VmFsdWUxOiBcIlwiLFxuICAgICAgICBleFZhbHVlMjogXCJcIixcbiAgICAgICAgZXhWYWx1ZTM6IFwiXCJcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMuZGF0YVNldCA9IHJlc3VsdC5kYXRhO1xuICAgICAgICB0aGlzLl9EYXRhU2V0ID0gcmVzdWx0LmRhdGE7XG4gICAgICAgIHRoaXMuQ3JlYXRlVGFibGUoX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtLCB0aGlzLl9EYXRhU2V0LCBmYWxzZSk7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkKTtcbiAgICAgICAgfSwgNTAwKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgfSxcbiAgQ3JlYXRlVGFibGU6IGZ1bmN0aW9uIENyZWF0ZVRhYmxlKCRzaW5nbGVDb250cm9sRWxlbSwgZGF0YVNldCwgaXNQcmV2aWV3KSB7XG4gICAgdmFyICR0ZW1wbGF0ZVRhYmxlID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZVwiKTtcbiAgICB2YXIgJHRlbXBsYXRlVGFibGVSb3cgPSAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcInRhYmxlIHRib2R5IHRyXCIpO1xuICAgIHZhciAkdGVtcGxhdGVUYWJsZUhlYWRlclJvd3MgPSAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcInRhYmxlIHRoZWFkIHRyXCIpO1xuXG4gICAgaWYgKCR0ZW1wbGF0ZVRhYmxlUm93Lmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciAkdGVtcGxhdGVUYWJsZUJvZHkgPSAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcInRhYmxlIHRib2R5XCIpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFTZXQubGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAkdGVtcGxhdGVUYWJsZUJvZHkuYXBwZW5kKHRoaXMuUmVuZGVyZXJTaW5nbGVSb3coJHRlbXBsYXRlVGFibGUsICR0ZW1wbGF0ZVRhYmxlUm93LCBkYXRhU2V0LCBkYXRhU2V0Lmxpc3RbaV0pKTtcbiAgICAgIH1cblxuICAgICAgJHRlbXBsYXRlVGFibGVSb3cucmVtb3ZlKCk7XG5cbiAgICAgIGlmIChpc1ByZXZpZXcpIHtcbiAgICAgICAgJHRlbXBsYXRlVGFibGUuZmluZChcIltzaW5nbGVuYW1lPSdXTERDVF9MaXN0VGFibGVJbm5lckJ1dHRvbkNvbnRhaW5lciddXCIpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwiLndsZGN0LWxpc3QtdGFibGUtaW5uZXItd3JhcFwiKS5hcHBlbmQodGhpcy5DcmVhdGVQYWdpbmcoKSk7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCIud2xkY3QtbGlzdC10YWJsZS1pbm5lci13cmFwXCIpLndpZHRoKFBhZ2VTdHlsZVV0aWxpdHkuR2V0V2luZG93V2lkdGgoKSAtIDIwKTtcbiAgICAkdGVtcGxhdGVUYWJsZS5hZGRDbGFzcyhcInN0cmlwZSByb3ctYm9yZGVyIG9yZGVyLWNvbHVtblwiKTtcbiAgICAkdGVtcGxhdGVUYWJsZS53aWR0aChcIjEwMCVcIik7XG4gICAgdmFyIHNjcm9sbFkgPSBQYWdlU3R5bGVVdGlsaXR5LkdldFdpbmRvd0hlaWdodCgpIC0gJChcIi53bGRjdC1saXN0LXNpbXBsZS1zZWFyY2gtb3V0ZXItd3JhcFwiKS5oZWlnaHQoKSAtICQoXCIud2xkY3QtbGlzdC1idXR0b24tb3V0ZXItd3JhcFwiKS5oZWlnaHQoKSAtIDE2MDtcbiAgICB2YXIgdGFibGUgPSAkdGVtcGxhdGVUYWJsZS5EYXRhVGFibGUoe1xuICAgICAgc2Nyb2xsWTogc2Nyb2xsWSxcbiAgICAgIHNjcm9sbFg6IHRydWUsXG4gICAgICBwYWdpbmc6IGZhbHNlLFxuICAgICAgXCJvcmRlcmluZ1wiOiBmYWxzZSxcbiAgICAgIFwic2VhcmNoaW5nXCI6IGZhbHNlLFxuICAgICAgXCJpbmZvXCI6IGZhbHNlXG4gICAgfSk7XG4gIH0sXG4gIEFwcGVuZENoZWNrQm94Q29sdW1uVGVtcGxhdGU6IGZ1bmN0aW9uIEFwcGVuZENoZWNrQm94Q29sdW1uVGVtcGxhdGUoJHRlbXBsYXRlVGFibGUsICR0ZW1wbGF0ZVRhYmxlSGVhZGVyUm93cywgJHRlbXBsYXRlVGFibGVSb3cpIHtcbiAgICB2YXIgJHRoID0gJChcIjx0aCBzdHlsZT0nd2lkdGg6IDUwcHgnPumAieaLqTwvdGg+XCIpO1xuXG4gICAgaWYgKCR0ZW1wbGF0ZVRhYmxlSGVhZGVyUm93cy5sZW5ndGggPiAxKSB7XG4gICAgICAkdGguYXR0cihcInJvd3NwYW5cIiwgJHRlbXBsYXRlVGFibGVIZWFkZXJSb3dzLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgJCgkdGVtcGxhdGVUYWJsZUhlYWRlclJvd3NbMF0pLnByZXBlbmQoJHRoKTtcbiAgICAkKCR0ZW1wbGF0ZVRhYmxlUm93LmVxKDApKS5wcmVwZW5kKFwiPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uYWxpZ249XFxcIlxcdTVDNDVcXHU0RTJEXFx1NUJGOVxcdTlGNTBcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbmNhcHRpb249XFxcIklEXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5kYXRhdHlwZW5hbWU9XFxcIlxcdTVCNTdcXHU3QjI2XFx1NEUzMlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1ubmFtZT1cXFwiSURcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnRhYmxlbmFtZT1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sX2NhdGVnb3J5PVxcXCJJbnB1dENvbnRyb2xcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RjbGllbnRyZW5kZXJlcm1ldGhvZD1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0Y2xpZW50cmVuZGVyZXJtZXRob2RwYXJhPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RzZXJ2ZXJyZXNvbHZlbWV0aG9kPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RzZXJ2ZXJyZXNvbHZlbWV0aG9kcGFyYT1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0dGV4dD1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0dHlwZT1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0dmFsdWU9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzYz1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cXFwiY2hlY2tfYm94X3RlbXBsYXRlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19qYnVpbGQ0ZGNfZGF0YT1cXFwidHJ1ZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgamJ1aWxkNGRjX2N1c3RvbT1cXFwidHJ1ZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT1cXFwiY2hlY2tfYm94X3RlbXBsYXRlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemU9XFxcInRydWVcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dfcmVtb3ZlX2J1dHRvbj1cXFwidHJ1ZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2luZ2xlbmFtZT1cXFwiV0xEQ1RfTGlzdFRhYmxlQ2hlY2tCb3hcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldGJ1dHRvbmlkPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudF9yZXNvbHZlPVxcXCJXTERDVF9MaXN0VGFibGVDaGVja0JveFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIElEXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XCIpO1xuICB9LFxuICBSZW5kZXJlclNpbmdsZVJvdzogZnVuY3Rpb24gUmVuZGVyZXJTaW5nbGVSb3coJHRlbXBsYXRlVGFibGUsICR0ZW1wbGF0ZVRhYmxlUm93LCBkYXRhU2V0LCByb3dEYXRhKSB7XG4gICAgdmFyICRjbG9uZVJvdyA9ICR0ZW1wbGF0ZVRhYmxlUm93LmNsb25lKCk7XG4gICAgdmFyICR0ZHMgPSAkY2xvbmVSb3cuZmluZChcInRkXCIpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkdGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJHRkID0gJCgkdGRzW2ldKTtcbiAgICAgIHZhciAkZGl2Q1RFbGVtID0gJHRkLmZpbmQoXCJkaXZcIiArIEhUTUxDb250cm9sQXR0cnMuU0VMRUNURURfSkJVSUxENERDX0NVU1RPTSk7XG5cbiAgICAgIGlmICgkZGl2Q1RFbGVtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGJpbmRUb0ZpZWxkID0gJGRpdkNURWxlbS5hdHRyKFwiY29sdW1ubmFtZVwiKTtcbiAgICAgICAgdmFyIHZhbCA9IHJvd0RhdGFbYmluZFRvRmllbGRdO1xuICAgICAgICB2YXIgY2xpZW50UmVzb2x2ZUluc3RhbmNlTmFtZSA9ICRkaXZDVEVsZW0uYXR0cihIVE1MQ29udHJvbEF0dHJzLkNMSUVOVF9SRVNPTFZFKTtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gV0xEQ1RfTGlzdFRhYmxlQ29udGFpbmVyLkdldEluc3RhbmNlKGNsaWVudFJlc29sdmVJbnN0YW5jZU5hbWUpO1xuICAgICAgICBpbnN0YW5jZS5SZW5kZXJlckRhdGFDaGFpbih7XG4gICAgICAgICAgJHRlbXBsYXRlVGFibGU6ICR0ZW1wbGF0ZVRhYmxlLFxuICAgICAgICAgICR0ZW1wbGF0ZVRhYmxlUm93OiAkdGVtcGxhdGVUYWJsZVJvdyxcbiAgICAgICAgICAkc2luZ2xlQ29udHJvbEVsZW06ICRkaXZDVEVsZW0sXG4gICAgICAgICAgZGF0YVNldDogZGF0YVNldCxcbiAgICAgICAgICByb3dEYXRhOiByb3dEYXRhLFxuICAgICAgICAgICRjbG9uZVJvdzogJGNsb25lUm93LFxuICAgICAgICAgICR0ZDogJHRkLFxuICAgICAgICAgIHZhbDogdmFsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAkY2xvbmVSb3c7XG4gIH0sXG4gIENyZWF0ZVBhZ2luZzogZnVuY3Rpb24gQ3JlYXRlUGFnaW5nKCR0ZW1wbGF0ZVRhYmxlLCAkdGVtcGxhdGVUYWJsZVJvdywgZGF0YVNldCwgcm93RGF0YSwgJHJvdywgJHRkLCB2YWx1ZSkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgcGFnaW5nT3V0ZXJFbGVtID0gJChcIjxkaXYgY2xhc3M9J3RhYmxlLXBhZ2luZy1vdXRlcic+PGRpdiBjbGFzcz0ndGFibGUtcGFnaW5nLWlubmVyJz48L2Rpdj48L2Rpdj5cIik7XG4gICAgdmFyIHBhZ2luZ0lubmVyRWxlbSA9IHBhZ2luZ091dGVyRWxlbS5maW5kKFwiZGl2XCIpO1xuICAgIHZhciBmaXJzdFBhZ2UgPSAkKFwiPGRpdiBjbGFzcz0ndGFibGUtcGFnaW5nLWJ1dHRvbic+56ys5LiA6aG1PC9kaXY+XCIpO1xuICAgIGZpcnN0UGFnZS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBfc2VsZi5DaGFuZ2VQYWdlTnVtKDEpO1xuICAgIH0pO1xuICAgIHZhciBwcmVQYWdlID0gJChcIjxkaXYgY2xhc3M9J3RhYmxlLXBhZ2luZy1idXR0b24nPuS4iuS4gOmhtTwvZGl2PlwiKTtcbiAgICBwcmVQYWdlLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChfc2VsZi5fQ3VycmVudFBhZ2VOdW0gPiAxKSB7XG4gICAgICAgIF9zZWxmLkNoYW5nZVBhZ2VOdW0oX3NlbGYuX0N1cnJlbnRQYWdlTnVtIC0gMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuW3sue7j+WIsOi+vuesrOS4gOmhtSFcIik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGxhc3RQYWdlID0gJChcIjxkaXYgY2xhc3M9J3RhYmxlLXBhZ2luZy1idXR0b24nPuacq+mhtTwvZGl2PlwiKTtcbiAgICBsYXN0UGFnZS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBfc2VsZi5DaGFuZ2VQYWdlTnVtKF9zZWxmLl9EYXRhU2V0LnBhZ2VzKTtcbiAgICB9KTtcbiAgICB2YXIgbmV4dFBhZ2UgPSAkKFwiPGRpdiBjbGFzcz0ndGFibGUtcGFnaW5nLWJ1dHRvbic+5LiL5LiA6aG1PC9kaXY+XCIpO1xuICAgIG5leHRQYWdlLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChfc2VsZi5fQ3VycmVudFBhZ2VOdW0gPCBfc2VsZi5fRGF0YVNldC5wYWdlcykge1xuICAgICAgICBfc2VsZi5DaGFuZ2VQYWdlTnVtKF9zZWxmLl9DdXJyZW50UGFnZU51bSArIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLlt7Lnu4/liLDovr7mnIDmnKvpobUhXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBpbmZvID0gJChcIjxkaXYgY2xhc3M9J3RhYmxlLXBhZ2luZy1pbmZvJz7mgLvmnaHmlbDjgJBcIiArIF9zZWxmLl9EYXRhU2V0LnRvdGFsICsgXCLjgJEmbmJzcDsmbmJzcDvpobXmlbDjgJBcIiArIF9zZWxmLl9DdXJyZW50UGFnZU51bSArIFwiL1wiICsgX3NlbGYuX0RhdGFTZXQucGFnZXMgKyBcIuOAkTwvZGl2PlwiKTtcbiAgICBwYWdpbmdJbm5lckVsZW0uYXBwZW5kKGZpcnN0UGFnZSkuYXBwZW5kKHByZVBhZ2UpLmFwcGVuZChuZXh0UGFnZSkuYXBwZW5kKGxhc3RQYWdlKS5hcHBlbmQoaW5mbyk7XG4gICAgcmV0dXJuIHBhZ2luZ091dGVyRWxlbTtcbiAgfSxcbiAgQ2hhbmdlUGFnZU51bTogZnVuY3Rpb24gQ2hhbmdlUGFnZU51bShwYWdlTnVtKSB7XG4gICAgdGhpcy5fQ3VycmVudFBhZ2VOdW0gPSBwYWdlTnVtO1xuICAgIHRoaXMuUmVuZGVyZXJEYXRhQ2hhaW4odGhpcy5fQ2FjaGVSZW5kZXJlckRhdGFDaGFpblBhcmFzLCB0cnVlKTtcbiAgfSxcbiAgU2ltcGxlU2VhcmNoQ2xpY2tFdmVudDogZnVuY3Rpb24gU2ltcGxlU2VhcmNoQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICB2YXIgX3NlbGYgPSBzZW5kZXIuZGF0YS5saXN0SW5zdGFuY2U7XG5cbiAgICB2YXIgY29uZGl0aW9ucyA9IF9zZWxmLl9TaW1wbGVTZWFyY2hDb250YWluZXJJbnN0YW5jZS5CdWlsZGVyU2VhcmNoQ29uZGl0aW9uKCk7XG5cbiAgICBfc2VsZi5fUXVlcnlQT0xpc3QgPSBjb25kaXRpb25zO1xuXG4gICAgX3NlbGYuUmVuZGVyZXJEYXRhQ2hhaW4oX3NlbGYuX0NhY2hlUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcywgdHJ1ZSk7XG4gIH0sXG4gIFNob3dDb21wbGV4U2VhcmNoQ2xpY2tFdmVudDogZnVuY3Rpb24gU2hvd0NvbXBsZXhTZWFyY2hDbGlja0V2ZW50KHNlbmRlcikge1xuICAgIHZhciBfc2VsZiA9IHNlbmRlci5kYXRhLmxpc3RJbnN0YW5jZTtcbiAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooX3NlbGYuX0NvbXBsZXhTZWFyY2hDb250YWluZXJJbnN0YW5jZS5fJFNpbmdsZUNvbnRyb2xFbGVtLCB7XG4gICAgICB0aXRsZTogXCLpq5jnuqfmn6Xor6JcIixcbiAgICAgIGhlaWdodDogNDEwLFxuICAgICAgd2lkdGg6IDgwMCxcbiAgICAgIG1vZGFsOiB0cnVlXG4gICAgfSk7XG4gIH0sXG4gIENvbXBsZXhTZWFyY2hDbGlja0V2ZW50OiBmdW5jdGlvbiBDb21wbGV4U2VhcmNoQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICBjb25zb2xlLmxvZyhcIumrmOe6p+afpeivoi5cIik7XG4gICAgdmFyIF9zZWxmID0gc2VuZGVyLmRhdGEubGlzdEluc3RhbmNlO1xuXG4gICAgdmFyIHNpbXBsZUNvbmRpdGlvbnMgPSBfc2VsZi5fU2ltcGxlU2VhcmNoQ29udGFpbmVySW5zdGFuY2UuQnVpbGRlclNlYXJjaENvbmRpdGlvbigpO1xuXG4gICAgdmFyIGNvbXBsZXhDb25kaXRpb25zID0gX3NlbGYuX0NvbXBsZXhTZWFyY2hDb250YWluZXJJbnN0YW5jZS5CdWlsZGVyU2VhcmNoQ29uZGl0aW9uKCk7XG5cbiAgICBfc2VsZi5fUXVlcnlQT0xpc3QgPSBjb21wbGV4Q29uZGl0aW9ucy5jb25jYXQoc2ltcGxlQ29uZGl0aW9ucyk7XG5cbiAgICBfc2VsZi5SZW5kZXJlckRhdGFDaGFpbihfc2VsZi5fQ2FjaGVSZW5kZXJlckRhdGFDaGFpblBhcmFzLCB0cnVlKTtcblxuICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKF9zZWxmLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UuXyRTaW5nbGVDb250cm9sRWxlbSk7XG4gIH0sXG4gIENvbXBsZXhTZWFyY2hDbG9zZUNsaWNrRXZlbnQ6IGZ1bmN0aW9uIENvbXBsZXhTZWFyY2hDbG9zZUNsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgdmFyIF9zZWxmID0gc2VuZGVyLmRhdGEubGlzdEluc3RhbmNlO1xuICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKF9zZWxmLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UuXyRTaW5nbGVDb250cm9sRWxlbSk7XG4gIH0sXG4gIENvbXBsZXhTZWFyY2hDbGVhckNsaWNrRXZlbnQ6IGZ1bmN0aW9uIENvbXBsZXhTZWFyY2hDbGVhckNsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgdmFyIF9zZWxmID0gc2VuZGVyLmRhdGEubGlzdEluc3RhbmNlO1xuICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5pyq5a6e546wIVwiKTtcbiAgfSxcbiAgR2V0UmVjb3JkRGF0YTogZnVuY3Rpb24gR2V0UmVjb3JkRGF0YShpZCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMuX0RhdGFTZXQpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9EYXRhU2V0Lmxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciByZWNvcmREYXRhID0gdGhpcy5fRGF0YVNldC5saXN0W2ldO1xuXG4gICAgICBpZiAocmVjb3JkRGF0YS5JRCA9PSBpZCkge1xuICAgICAgICByZXR1cm4gcmVjb3JkRGF0YTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuaJvuS4jeWIsElE5Li6OlwiICsgaWQgKyBcIueahOiusOW9lSFcIik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIFNhdmVDaGVja2VkUm93RGF0YTogZnVuY3Rpb24gU2F2ZUNoZWNrZWRSb3dEYXRhKGlkKSB7XG4gICAgdmFyIHJlY29yZCA9IHRoaXMuR2V0UmVjb3JkRGF0YShpZCk7XG5cbiAgICBpZiAocmVjb3JkICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX0NoZWNrZWRSZWNvcmRBcnJheS5wdXNoKHtcbiAgICAgICAgXCJJZFwiOiBpZCxcbiAgICAgICAgXCJSZWNvcmRcIjogcmVjb3JkXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIERlbGV0ZUNoZWNrZWRSb3dEYXRhOiBmdW5jdGlvbiBEZWxldGVDaGVja2VkUm93RGF0YShpZCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fQ2hlY2tlZFJlY29yZEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5fQ2hlY2tlZFJlY29yZEFycmF5W2ldLklkID09IGlkKSB7XG4gICAgICAgIEFycmF5VXRpbGl0eS5EZWxldGUodGhpcy5fQ2hlY2tlZFJlY29yZEFycmF5LCBpKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIEdldENoZWNrZWRSZWNvcmQ6IGZ1bmN0aW9uIEdldENoZWNrZWRSZWNvcmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX0NoZWNrZWRSZWNvcmRBcnJheTtcbiAgfSxcbiAgR2V0TGFzdENoZWNrZWRSZWNvcmQ6IGZ1bmN0aW9uIEdldExhc3RDaGVja2VkUmVjb3JkKCkge1xuICAgIGlmICh0aGlzLl9DaGVja2VkUmVjb3JkQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuX0NoZWNrZWRSZWNvcmRBcnJheVt0aGlzLl9DaGVja2VkUmVjb3JkQXJyYXkubGVuZ3RoIC0gMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIENsZWFyQWxsQ2hlY2tCb3g6IGZ1bmN0aW9uIENsZWFyQWxsQ2hlY2tCb3goKSB7XG4gICAgdGhpcy5fJEVsZW0uZmluZChcIjpjaGVja2JveFwiKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuXG4gICAgdGhpcy5fQ2hlY2tlZFJlY29yZEFycmF5ID0gW107XG4gIH0sXG4gIFNldENoZWNrQm94VG9DaGVja2VkU3RhdHVzOiBmdW5jdGlvbiBTZXRDaGVja0JveFRvQ2hlY2tlZFN0YXR1cyhpZCkge1xuICAgIHRoaXMuXyRFbGVtLmZpbmQoXCJbcm93X2NoZWNrYm94X3JlY29yZF9pZD0nXCIgKyBpZCArIFwiJ106Y2hlY2tib3hcIikucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuXG4gICAgdGhpcy5TYXZlQ2hlY2tlZFJvd0RhdGEoaWQpO1xuICB9LFxuICBfX0lubmVyRWxlbUdldEluc3RhbmNlOiBmdW5jdGlvbiBfX0lubmVyRWxlbUdldEluc3RhbmNlKCRpbm5lckVsZW0pIHtcbiAgICB2YXIgJFdMRENUX0xpc3RUYWJsZUNvbnRhaW5lciA9ICRpbm5lckVsZW0ucGFyZW50cyhcIltzaW5nbGVuYW1lPSdXTERDVF9MaXN0VGFibGVDb250YWluZXInXVwiKTtcbiAgICB2YXIgbGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sSW5zdGFuY2VCeUVsZW0oJFdMRENUX0xpc3RUYWJsZUNvbnRhaW5lcik7XG4gICAgcmV0dXJuIGxpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdFRhYmxlSW5uZXJCdXR0b25Db250YWluZXIgPSB7XG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB2YXIgJGRpdkNURWxlbSA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwiZGl2XCIgKyBIVE1MQ29udHJvbEF0dHJzLlNFTEVDVEVEX0pCVUlMRDREQ19DVVNUT00pO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5odG1sKFwiXCIpO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5hcHBlbmQoJGRpdkNURWxlbSk7XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckRhdGFDaGFpblxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RUYWJsZUlubmVyQnV0dG9uU2luZ2xlID0ge1xuICBSZW5kZXJlckNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckNoYWluLFxuICBSZW5kZXJlckRhdGFDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJEYXRhQ2hhaW4oX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgXCJzZWxmSW5zdGFuY2VcIjogdGhpcyxcbiAgICAgIFwiJGVsZW1cIjogJHNpbmdsZUNvbnRyb2xFbGVtLFxuICAgICAgcm93RGF0YTogX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMucm93RGF0YVxuICAgIH0sIHRoaXMuQ2xpY2tFdmVudCk7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmh0bWwoXCJcIik7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmF0dHIoXCJ0aXRsZVwiLCAkc2luZ2xlQ29udHJvbEVsZW0uYXR0cihcImNhcHRpb25cIikpO1xuICB9LFxuICBDbGlja0V2ZW50OiBmdW5jdGlvbiBDbGlja0V2ZW50KHNlbmRlcikge1xuICAgIGNvbnNvbGUubG9nKHNlbmRlci5kYXRhLnJvd0RhdGEuSUQpO1xuICAgIHZhciAkZWxlbSA9IHNlbmRlci5kYXRhLiRlbGVtO1xuICAgIGNvbnNvbGUubG9nKCRlbGVtKTtcbiAgICB2YXIgdGFyZ2V0YnV0dG9uaWQgPSAkZWxlbS5hdHRyKFwidGFyZ2V0YnV0dG9uaWRcIik7XG5cbiAgICB2YXIgbGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UgPSBXTERDVF9MaXN0VGFibGVDb250YWluZXIuX19Jbm5lckVsZW1HZXRJbnN0YW5jZSgkZWxlbSk7XG5cbiAgICBsaXN0VGFibGVDb250YWluZXJJbnN0YW5jZS5DbGVhckFsbENoZWNrQm94KCk7XG4gICAgbGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UuU2V0Q2hlY2tCb3hUb0NoZWNrZWRTdGF0dXMoc2VuZGVyLmRhdGEucm93RGF0YS5JRCk7XG4gICAgY29uc29sZS5sb2codGFyZ2V0YnV0dG9uaWQpO1xuICAgICQoXCJidXR0b24jXCIgKyB0YXJnZXRidXR0b25pZCkudHJpZ2dlcihcImNsaWNrXCIpO1xuICAgIGNvbnNvbGUubG9nKGxpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RUYWJsZUxhYmVsID0ge1xuICBSZW5kZXJlckNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckNoYWluLFxuICBSZW5kZXJlckRhdGFDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJEYXRhQ2hhaW4oX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMpIHtcbiAgICB2YXIgdmFsdWUgPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy52YWw7XG4gICAgdmFyICR0ZCA9IF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLiR0ZDtcbiAgICAkdGQuY3NzKFwidGV4dEFsaWduXCIsIFwiY2VudGVyXCIpO1xuICAgICR0ZC5odG1sKHZhbHVlKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX1NlYXJjaF9UZXh0Qm94ID0ge1xuICBSZW5kZXJlckNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckNoYWluLFxuICBSZW5kZXJlckRhdGFDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJEYXRhQ2hhaW4sXG4gIEdldFZhbHVlOiBIVE1MQ29udHJvbC5HZXRWYWx1ZVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydqcXVlcnknLCAnZGF0YXRhYmxlcy5uZXQnXSwgZnVuY3Rpb24gKCQpIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KCQsIHdpbmRvdywgZG9jdW1lbnQpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCh0eXBlb2YgZXhwb3J0cyA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKGV4cG9ydHMpKSA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb290LCAkKSB7XG4gICAgICBpZiAoIXJvb3QpIHtcbiAgICAgICAgcm9vdCA9IHdpbmRvdztcbiAgICAgIH1cblxuICAgICAgaWYgKCEkIHx8ICEkLmZuLmRhdGFUYWJsZSkge1xuICAgICAgICAkID0gcmVxdWlyZSgnZGF0YXRhYmxlcy5uZXQnKShyb290LCAkKS4kO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFjdG9yeSgkLCByb290LCByb290LmRvY3VtZW50KTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGZhY3RvcnkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcbiAgfVxufSkoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIERhdGFUYWJsZSA9ICQuZm4uZGF0YVRhYmxlO1xuXG4gIHZhciBfZmlyZWZveFNjcm9sbDtcblxuICB2YXIgRml4ZWRDb2x1bW5zID0gZnVuY3Rpb24gRml4ZWRDb2x1bW5zKGR0LCBpbml0KSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEZpeGVkQ29sdW1ucykpIHtcbiAgICAgIGFsZXJ0KFwiRml4ZWRDb2x1bW5zIHdhcm5pbmc6IEZpeGVkQ29sdW1ucyBtdXN0IGJlIGluaXRpYWxpc2VkIHdpdGggdGhlICduZXcnIGtleXdvcmQuXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpbml0ID09PSB1bmRlZmluZWQgfHwgaW5pdCA9PT0gdHJ1ZSkge1xuICAgICAgaW5pdCA9IHt9O1xuICAgIH1cblxuICAgIHZhciBjYW1lbFRvSHVuZ2FyaWFuID0gJC5mbi5kYXRhVGFibGUuY2FtZWxUb0h1bmdhcmlhbjtcblxuICAgIGlmIChjYW1lbFRvSHVuZ2FyaWFuKSB7XG4gICAgICBjYW1lbFRvSHVuZ2FyaWFuKEZpeGVkQ29sdW1ucy5kZWZhdWx0cywgRml4ZWRDb2x1bW5zLmRlZmF1bHRzLCB0cnVlKTtcbiAgICAgIGNhbWVsVG9IdW5nYXJpYW4oRml4ZWRDb2x1bW5zLmRlZmF1bHRzLCBpbml0KTtcbiAgICB9XG5cbiAgICB2YXIgZHRTZXR0aW5ncyA9IG5ldyAkLmZuLmRhdGFUYWJsZS5BcGkoZHQpLnNldHRpbmdzKClbMF07XG4gICAgdGhpcy5zID0ge1xuICAgICAgXCJkdFwiOiBkdFNldHRpbmdzLFxuICAgICAgXCJpVGFibGVDb2x1bW5zXCI6IGR0U2V0dGluZ3MuYW9Db2x1bW5zLmxlbmd0aCxcbiAgICAgIFwiYWlPdXRlcldpZHRoc1wiOiBbXSxcbiAgICAgIFwiYWlJbm5lcldpZHRoc1wiOiBbXSxcbiAgICAgIHJ0bDogJChkdFNldHRpbmdzLm5UYWJsZSkuY3NzKCdkaXJlY3Rpb24nKSA9PT0gJ3J0bCdcbiAgICB9O1xuICAgIHRoaXMuZG9tID0ge1xuICAgICAgXCJzY3JvbGxlclwiOiBudWxsLFxuICAgICAgXCJoZWFkZXJcIjogbnVsbCxcbiAgICAgIFwiYm9keVwiOiBudWxsLFxuICAgICAgXCJmb290ZXJcIjogbnVsbCxcbiAgICAgIFwiZ3JpZFwiOiB7XG4gICAgICAgIFwid3JhcHBlclwiOiBudWxsLFxuICAgICAgICBcImR0XCI6IG51bGwsXG4gICAgICAgIFwibGVmdFwiOiB7XG4gICAgICAgICAgXCJ3cmFwcGVyXCI6IG51bGwsXG4gICAgICAgICAgXCJoZWFkXCI6IG51bGwsXG4gICAgICAgICAgXCJib2R5XCI6IG51bGwsXG4gICAgICAgICAgXCJmb290XCI6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgXCJyaWdodFwiOiB7XG4gICAgICAgICAgXCJ3cmFwcGVyXCI6IG51bGwsXG4gICAgICAgICAgXCJoZWFkXCI6IG51bGwsXG4gICAgICAgICAgXCJib2R5XCI6IG51bGwsXG4gICAgICAgICAgXCJmb290XCI6IG51bGxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwiY2xvbmVcIjoge1xuICAgICAgICBcImxlZnRcIjoge1xuICAgICAgICAgIFwiaGVhZGVyXCI6IG51bGwsXG4gICAgICAgICAgXCJib2R5XCI6IG51bGwsXG4gICAgICAgICAgXCJmb290ZXJcIjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBcInJpZ2h0XCI6IHtcbiAgICAgICAgICBcImhlYWRlclwiOiBudWxsLFxuICAgICAgICAgIFwiYm9keVwiOiBudWxsLFxuICAgICAgICAgIFwiZm9vdGVyXCI6IG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoZHRTZXR0aW5ncy5fb0ZpeGVkQ29sdW1ucykge1xuICAgICAgdGhyb3cgJ0ZpeGVkQ29sdW1ucyBhbHJlYWR5IGluaXRpYWxpc2VkIG9uIHRoaXMgdGFibGUnO1xuICAgIH1cblxuICAgIGR0U2V0dGluZ3MuX29GaXhlZENvbHVtbnMgPSB0aGlzO1xuXG4gICAgaWYgKCFkdFNldHRpbmdzLl9iSW5pdENvbXBsZXRlKSB7XG4gICAgICBkdFNldHRpbmdzLm9BcGkuX2ZuQ2FsbGJhY2tSZWcoZHRTZXR0aW5ncywgJ2FvSW5pdENvbXBsZXRlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0Ll9mbkNvbnN0cnVjdChpbml0KTtcbiAgICAgIH0sICdGaXhlZENvbHVtbnMnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZm5Db25zdHJ1Y3QoaW5pdCk7XG4gICAgfVxuICB9O1xuXG4gICQuZXh0ZW5kKEZpeGVkQ29sdW1ucy5wcm90b3R5cGUsIHtcbiAgICBcImZuVXBkYXRlXCI6IGZ1bmN0aW9uIGZuVXBkYXRlKCkge1xuICAgICAgdGhpcy5fZm5EcmF3KHRydWUpO1xuICAgIH0sXG4gICAgXCJmblJlZHJhd0xheW91dFwiOiBmdW5jdGlvbiBmblJlZHJhd0xheW91dCgpIHtcbiAgICAgIHRoaXMuX2ZuQ29sQ2FsYygpO1xuXG4gICAgICB0aGlzLl9mbkdyaWRMYXlvdXQoKTtcblxuICAgICAgdGhpcy5mblVwZGF0ZSgpO1xuICAgIH0sXG4gICAgXCJmblJlY2FsY3VsYXRlSGVpZ2h0XCI6IGZ1bmN0aW9uIGZuUmVjYWxjdWxhdGVIZWlnaHQoblRyKSB7XG4gICAgICBkZWxldGUgblRyLl9EVFRDX2lIZWlnaHQ7XG4gICAgICBuVHIuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuICAgIH0sXG4gICAgXCJmblNldFJvd0hlaWdodFwiOiBmdW5jdGlvbiBmblNldFJvd0hlaWdodChuVGFyZ2V0LCBpSGVpZ2h0KSB7XG4gICAgICBuVGFyZ2V0LnN0eWxlLmhlaWdodCA9IGlIZWlnaHQgKyBcInB4XCI7XG4gICAgfSxcbiAgICBcImZuR2V0UG9zaXRpb25cIjogZnVuY3Rpb24gZm5HZXRQb3NpdGlvbihub2RlKSB7XG4gICAgICB2YXIgaWR4O1xuICAgICAgdmFyIGluc3QgPSB0aGlzLnMuZHQub0luc3RhbmNlO1xuXG4gICAgICBpZiAoISQobm9kZSkucGFyZW50cygnLkRURkNfQ2xvbmVkJykubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBpbnN0LmZuR2V0UG9zaXRpb24obm9kZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAndHInKSB7XG4gICAgICAgICAgaWR4ID0gJChub2RlKS5pbmRleCgpO1xuICAgICAgICAgIHJldHVybiBpbnN0LmZuR2V0UG9zaXRpb24oJCgndHInLCB0aGlzLnMuZHQublRCb2R5KVtpZHhdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgY29sSWR4ID0gJChub2RlKS5pbmRleCgpO1xuICAgICAgICAgIGlkeCA9ICQobm9kZS5wYXJlbnROb2RlKS5pbmRleCgpO1xuICAgICAgICAgIHZhciByb3cgPSBpbnN0LmZuR2V0UG9zaXRpb24oJCgndHInLCB0aGlzLnMuZHQublRCb2R5KVtpZHhdKTtcbiAgICAgICAgICByZXR1cm4gW3JvdywgY29sSWR4LCBpbnN0Lm9BcGkuX2ZuVmlzaWJsZVRvQ29sdW1uSW5kZXgodGhpcy5zLmR0LCBjb2xJZHgpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJfZm5Db25zdHJ1Y3RcIjogZnVuY3Rpb24gX2ZuQ29uc3RydWN0KG9Jbml0KSB7XG4gICAgICB2YXIgaSxcbiAgICAgICAgICBpTGVuLFxuICAgICAgICAgIGlXaWR0aCxcbiAgICAgICAgICB0aGF0ID0gdGhpcztcblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLnMuZHQub0luc3RhbmNlLmZuVmVyc2lvbkNoZWNrICE9ICdmdW5jdGlvbicgfHwgdGhpcy5zLmR0Lm9JbnN0YW5jZS5mblZlcnNpb25DaGVjaygnMS44LjAnKSAhPT0gdHJ1ZSkge1xuICAgICAgICBhbGVydChcIkZpeGVkQ29sdW1ucyBcIiArIEZpeGVkQ29sdW1ucy5WRVJTSU9OICsgXCIgcmVxdWlyZWQgRGF0YVRhYmxlcyAxLjguMCBvciBsYXRlci4gXCIgKyBcIlBsZWFzZSB1cGdyYWRlIHlvdXIgRGF0YVRhYmxlcyBpbnN0YWxsYXRpb25cIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucy5kdC5vU2Nyb2xsLnNYID09PSBcIlwiKSB7XG4gICAgICAgIHRoaXMucy5kdC5vSW5zdGFuY2Uub0FwaS5fZm5Mb2codGhpcy5zLmR0LCAxLCBcIkZpeGVkQ29sdW1ucyBpcyBub3QgbmVlZGVkIChubyBcIiArIFwieC1zY3JvbGxpbmcgaW4gRGF0YVRhYmxlcyBlbmFibGVkKSwgc28gbm8gYWN0aW9uIHdpbGwgYmUgdGFrZW4uIFVzZSAnRml4ZWRIZWFkZXInIGZvciBcIiArIFwiY29sdW1uIGZpeGluZyB3aGVuIHNjcm9sbGluZyBpcyBub3QgZW5hYmxlZFwiKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucyA9ICQuZXh0ZW5kKHRydWUsIHRoaXMucywgRml4ZWRDb2x1bW5zLmRlZmF1bHRzLCBvSW5pdCk7XG4gICAgICB2YXIgY2xhc3NlcyA9IHRoaXMucy5kdC5vQ2xhc3NlcztcbiAgICAgIHRoaXMuZG9tLmdyaWQuZHQgPSAkKHRoaXMucy5kdC5uVGFibGUpLnBhcmVudHMoJ2Rpdi4nICsgY2xhc3Nlcy5zU2Nyb2xsV3JhcHBlcilbMF07XG4gICAgICB0aGlzLmRvbS5zY3JvbGxlciA9ICQoJ2Rpdi4nICsgY2xhc3Nlcy5zU2Nyb2xsQm9keSwgdGhpcy5kb20uZ3JpZC5kdClbMF07XG5cbiAgICAgIHRoaXMuX2ZuQ29sQ2FsYygpO1xuXG4gICAgICB0aGlzLl9mbkdyaWRTZXR1cCgpO1xuXG4gICAgICB2YXIgbW91c2VDb250cm9sbGVyO1xuICAgICAgdmFyIG1vdXNlRG93biA9IGZhbHNlO1xuICAgICAgJCh0aGlzLnMuZHQublRhYmxlV3JhcHBlcikub24oJ21vdXNlZG93bi5EVEZDJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGUuYnV0dG9uID09PSAwKSB7XG4gICAgICAgICAgbW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgICAkKGRvY3VtZW50KS5vbmUoJ21vdXNldXAnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAkKHRoaXMuZG9tLnNjcm9sbGVyKS5vbignbW91c2VvdmVyLkRURkMgdG91Y2hzdGFydC5EVEZDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIW1vdXNlRG93bikge1xuICAgICAgICAgIG1vdXNlQ29udHJvbGxlciA9ICdtYWluJztcbiAgICAgICAgfVxuICAgICAgfSkub24oJ3Njcm9sbC5EVEZDJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCFtb3VzZUNvbnRyb2xsZXIgJiYgZS5vcmlnaW5hbEV2ZW50KSB7XG4gICAgICAgICAgbW91c2VDb250cm9sbGVyID0gJ21haW4nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vdXNlQ29udHJvbGxlciA9PT0gJ21haW4nKSB7XG4gICAgICAgICAgaWYgKHRoYXQucy5pTGVmdENvbHVtbnMgPiAwKSB7XG4gICAgICAgICAgICB0aGF0LmRvbS5ncmlkLmxlZnQubGluZXIuc2Nyb2xsVG9wID0gdGhhdC5kb20uc2Nyb2xsZXIuc2Nyb2xsVG9wO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGF0LnMuaVJpZ2h0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgICAgIHRoYXQuZG9tLmdyaWQucmlnaHQubGluZXIuc2Nyb2xsVG9wID0gdGhhdC5kb20uc2Nyb2xsZXIuc2Nyb2xsVG9wO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgd2hlZWxUeXBlID0gJ29ud2hlZWwnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpID8gJ3doZWVsLkRURkMnIDogJ21vdXNld2hlZWwuRFRGQyc7XG5cbiAgICAgIGlmICh0aGF0LnMuaUxlZnRDb2x1bW5zID4gMCkge1xuICAgICAgICAkKHRoYXQuZG9tLmdyaWQubGVmdC5saW5lcikub24oJ21vdXNlb3Zlci5EVEZDIHRvdWNoc3RhcnQuRFRGQycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIW1vdXNlRG93bikge1xuICAgICAgICAgICAgbW91c2VDb250cm9sbGVyID0gJ2xlZnQnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkub24oJ3Njcm9sbC5EVEZDJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBpZiAoIW1vdXNlQ29udHJvbGxlciAmJiBlLm9yaWdpbmFsRXZlbnQpIHtcbiAgICAgICAgICAgIG1vdXNlQ29udHJvbGxlciA9ICdsZWZ0JztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobW91c2VDb250cm9sbGVyID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgIHRoYXQuZG9tLnNjcm9sbGVyLnNjcm9sbFRvcCA9IHRoYXQuZG9tLmdyaWQubGVmdC5saW5lci5zY3JvbGxUb3A7XG5cbiAgICAgICAgICAgIGlmICh0aGF0LnMuaVJpZ2h0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgICAgICAgdGhhdC5kb20uZ3JpZC5yaWdodC5saW5lci5zY3JvbGxUb3AgPSB0aGF0LmRvbS5ncmlkLmxlZnQubGluZXIuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkub24od2hlZWxUeXBlLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHZhciB4RGVsdGEgPSBlLnR5cGUgPT09ICd3aGVlbCcgPyAtZS5vcmlnaW5hbEV2ZW50LmRlbHRhWCA6IGUub3JpZ2luYWxFdmVudC53aGVlbERlbHRhWDtcbiAgICAgICAgICB0aGF0LmRvbS5zY3JvbGxlci5zY3JvbGxMZWZ0IC09IHhEZWx0YTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGF0LnMuaVJpZ2h0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgJCh0aGF0LmRvbS5ncmlkLnJpZ2h0LmxpbmVyKS5vbignbW91c2VvdmVyLkRURkMgdG91Y2hzdGFydC5EVEZDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghbW91c2VEb3duKSB7XG4gICAgICAgICAgICBtb3VzZUNvbnRyb2xsZXIgPSAncmlnaHQnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkub24oJ3Njcm9sbC5EVEZDJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBpZiAoIW1vdXNlQ29udHJvbGxlciAmJiBlLm9yaWdpbmFsRXZlbnQpIHtcbiAgICAgICAgICAgIG1vdXNlQ29udHJvbGxlciA9ICdyaWdodCc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG1vdXNlQ29udHJvbGxlciA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgdGhhdC5kb20uc2Nyb2xsZXIuc2Nyb2xsVG9wID0gdGhhdC5kb20uZ3JpZC5yaWdodC5saW5lci5zY3JvbGxUb3A7XG5cbiAgICAgICAgICAgIGlmICh0aGF0LnMuaUxlZnRDb2x1bW5zID4gMCkge1xuICAgICAgICAgICAgICB0aGF0LmRvbS5ncmlkLmxlZnQubGluZXIuc2Nyb2xsVG9wID0gdGhhdC5kb20uZ3JpZC5yaWdodC5saW5lci5zY3JvbGxUb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS5vbih3aGVlbFR5cGUsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyIHhEZWx0YSA9IGUudHlwZSA9PT0gJ3doZWVsJyA/IC1lLm9yaWdpbmFsRXZlbnQuZGVsdGFYIDogZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGFYO1xuICAgICAgICAgIHRoYXQuZG9tLnNjcm9sbGVyLnNjcm9sbExlZnQgLT0geERlbHRhO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuRFRGQycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5fZm5HcmlkTGF5b3V0LmNhbGwodGhhdCk7XG4gICAgICB9KTtcbiAgICAgIHZhciBiRmlyc3REcmF3ID0gdHJ1ZTtcbiAgICAgIHZhciBqcVRhYmxlID0gJCh0aGlzLnMuZHQublRhYmxlKTtcbiAgICAgIGpxVGFibGUub24oJ2RyYXcuZHQuRFRGQycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5fZm5Db2xDYWxjKCk7XG5cbiAgICAgICAgdGhhdC5fZm5EcmF3LmNhbGwodGhhdCwgYkZpcnN0RHJhdyk7XG5cbiAgICAgICAgYkZpcnN0RHJhdyA9IGZhbHNlO1xuICAgICAgfSkub24oJ2NvbHVtbi1zaXppbmcuZHQuRFRGQycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5fZm5Db2xDYWxjKCk7XG5cbiAgICAgICAgdGhhdC5fZm5HcmlkTGF5b3V0KHRoYXQpO1xuICAgICAgfSkub24oJ2NvbHVtbi12aXNpYmlsaXR5LmR0LkRURkMnLCBmdW5jdGlvbiAoZSwgc2V0dGluZ3MsIGNvbHVtbiwgdmlzLCByZWNhbGMpIHtcbiAgICAgICAgaWYgKHJlY2FsYyA9PT0gdW5kZWZpbmVkIHx8IHJlY2FsYykge1xuICAgICAgICAgIHRoYXQuX2ZuQ29sQ2FsYygpO1xuXG4gICAgICAgICAgdGhhdC5fZm5HcmlkTGF5b3V0KHRoYXQpO1xuXG4gICAgICAgICAgdGhhdC5fZm5EcmF3KHRydWUpO1xuICAgICAgICB9XG4gICAgICB9KS5vbignc2VsZWN0LmR0LkRURkMgZGVzZWxlY3QuZHQuRFRGQycsIGZ1bmN0aW9uIChlLCBkdCwgdHlwZSwgaW5kZXhlcykge1xuICAgICAgICBpZiAoZS5uYW1lc3BhY2UgPT09ICdkdCcpIHtcbiAgICAgICAgICB0aGF0Ll9mbkRyYXcoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9KS5vbignZGVzdHJveS5kdC5EVEZDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBqcVRhYmxlLm9mZignLkRURkMnKTtcbiAgICAgICAgJCh0aGF0LmRvbS5zY3JvbGxlcikub2ZmKCcuRFRGQycpO1xuICAgICAgICAkKHdpbmRvdykub2ZmKCcuRFRGQycpO1xuICAgICAgICAkKHRoYXQucy5kdC5uVGFibGVXcmFwcGVyKS5vZmYoJy5EVEZDJyk7XG4gICAgICAgICQodGhhdC5kb20uZ3JpZC5sZWZ0LmxpbmVyKS5vZmYoJy5EVEZDICcgKyB3aGVlbFR5cGUpO1xuICAgICAgICAkKHRoYXQuZG9tLmdyaWQubGVmdC53cmFwcGVyKS5yZW1vdmUoKTtcbiAgICAgICAgJCh0aGF0LmRvbS5ncmlkLnJpZ2h0LmxpbmVyKS5vZmYoJy5EVEZDICcgKyB3aGVlbFR5cGUpO1xuICAgICAgICAkKHRoYXQuZG9tLmdyaWQucmlnaHQud3JhcHBlcikucmVtb3ZlKCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fZm5HcmlkTGF5b3V0KCk7XG5cbiAgICAgIHRoaXMucy5kdC5vSW5zdGFuY2UuZm5EcmF3KGZhbHNlKTtcbiAgICB9LFxuICAgIFwiX2ZuQ29sQ2FsY1wiOiBmdW5jdGlvbiBfZm5Db2xDYWxjKCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgdmFyIGlMZWZ0V2lkdGggPSAwO1xuICAgICAgdmFyIGlSaWdodFdpZHRoID0gMDtcbiAgICAgIHRoaXMucy5haUlubmVyV2lkdGhzID0gW107XG4gICAgICB0aGlzLnMuYWlPdXRlcldpZHRocyA9IFtdO1xuICAgICAgJC5lYWNoKHRoaXMucy5kdC5hb0NvbHVtbnMsIGZ1bmN0aW9uIChpLCBjb2wpIHtcbiAgICAgICAgdmFyIHRoID0gJChjb2wublRoKTtcbiAgICAgICAgdmFyIGJvcmRlcjtcblxuICAgICAgICBpZiAoIXRoLmZpbHRlcignOnZpc2libGUnKS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGF0LnMuYWlJbm5lcldpZHRocy5wdXNoKDApO1xuICAgICAgICAgIHRoYXQucy5haU91dGVyV2lkdGhzLnB1c2goMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGlXaWR0aCA9IHRoLm91dGVyV2lkdGgoKTtcblxuICAgICAgICAgIGlmICh0aGF0LnMuYWlPdXRlcldpZHRocy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGJvcmRlciA9ICQodGhhdC5zLmR0Lm5UYWJsZSkuY3NzKCdib3JkZXItbGVmdC13aWR0aCcpO1xuICAgICAgICAgICAgaVdpZHRoICs9IHR5cGVvZiBib3JkZXIgPT09ICdzdHJpbmcnICYmIGJvcmRlci5pbmRleE9mKCdweCcpID09PSAtMSA/IDEgOiBwYXJzZUludChib3JkZXIsIDEwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhhdC5zLmFpT3V0ZXJXaWR0aHMubGVuZ3RoID09PSB0aGF0LnMuZHQuYW9Db2x1bW5zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGJvcmRlciA9ICQodGhhdC5zLmR0Lm5UYWJsZSkuY3NzKCdib3JkZXItcmlnaHQtd2lkdGgnKTtcbiAgICAgICAgICAgIGlXaWR0aCArPSB0eXBlb2YgYm9yZGVyID09PSAnc3RyaW5nJyAmJiBib3JkZXIuaW5kZXhPZigncHgnKSA9PT0gLTEgPyAxIDogcGFyc2VJbnQoYm9yZGVyLCAxMCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhhdC5zLmFpT3V0ZXJXaWR0aHMucHVzaChpV2lkdGgpO1xuICAgICAgICAgIHRoYXQucy5haUlubmVyV2lkdGhzLnB1c2godGgud2lkdGgoKSk7XG5cbiAgICAgICAgICBpZiAoaSA8IHRoYXQucy5pTGVmdENvbHVtbnMpIHtcbiAgICAgICAgICAgIGlMZWZ0V2lkdGggKz0gaVdpZHRoO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGF0LnMuaVRhYmxlQ29sdW1ucyAtIHRoYXQucy5pUmlnaHRDb2x1bW5zIDw9IGkpIHtcbiAgICAgICAgICAgIGlSaWdodFdpZHRoICs9IGlXaWR0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5zLmlMZWZ0V2lkdGggPSBpTGVmdFdpZHRoO1xuICAgICAgdGhpcy5zLmlSaWdodFdpZHRoID0gaVJpZ2h0V2lkdGg7XG4gICAgfSxcbiAgICBcIl9mbkdyaWRTZXR1cFwiOiBmdW5jdGlvbiBfZm5HcmlkU2V0dXAoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgIHZhciBvT3ZlcmZsb3cgPSB0aGlzLl9mbkRUT3ZlcmZsb3coKTtcblxuICAgICAgdmFyIGJsb2NrO1xuICAgICAgdGhpcy5kb20uYm9keSA9IHRoaXMucy5kdC5uVGFibGU7XG4gICAgICB0aGlzLmRvbS5oZWFkZXIgPSB0aGlzLnMuZHQublRIZWFkLnBhcmVudE5vZGU7XG4gICAgICB0aGlzLmRvbS5oZWFkZXIucGFyZW50Tm9kZS5wYXJlbnROb2RlLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xuICAgICAgdmFyIG5TV3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJEVEZDX1Njcm9sbFdyYXBwZXJcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlOyBjbGVhcjpib3RoO1wiPicgKyAnPGRpdiBjbGFzcz1cIkRURkNfTGVmdFdyYXBwZXJcIiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlOyB0b3A6MDsgbGVmdDowO1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPicgKyAnPGRpdiBjbGFzcz1cIkRURkNfTGVmdEhlYWRXcmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTsgdG9wOjA7IGxlZnQ6MDsgb3ZlcmZsb3c6aGlkZGVuO1wiPjwvZGl2PicgKyAnPGRpdiBjbGFzcz1cIkRURkNfTGVmdEJvZHlXcmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTsgdG9wOjA7IGxlZnQ6MDsgb3ZlcmZsb3c6aGlkZGVuO1wiPicgKyAnPGRpdiBjbGFzcz1cIkRURkNfTGVmdEJvZHlMaW5lclwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7IHRvcDowOyBsZWZ0OjA7IG92ZXJmbG93LXk6c2Nyb2xsO1wiPjwvZGl2PicgKyAnPC9kaXY+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19MZWZ0Rm9vdFdyYXBwZXJcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlOyB0b3A6MDsgbGVmdDowOyBvdmVyZmxvdzpoaWRkZW47XCI+PC9kaXY+JyArICc8L2Rpdj4nICsgJzxkaXYgY2xhc3M9XCJEVEZDX1JpZ2h0V3JhcHBlclwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHRvcDowOyByaWdodDowO1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPicgKyAnPGRpdiBjbGFzcz1cIkRURkNfUmlnaHRIZWFkV3JhcHBlclwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7IHRvcDowOyBsZWZ0OjA7XCI+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19SaWdodEhlYWRCbG9ja2VyIERURkNfQmxvY2tlclwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHRvcDowOyBib3R0b206MDtcIj48L2Rpdj4nICsgJzwvZGl2PicgKyAnPGRpdiBjbGFzcz1cIkRURkNfUmlnaHRCb2R5V3JhcHBlclwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7IHRvcDowOyBsZWZ0OjA7IG92ZXJmbG93OmhpZGRlbjtcIj4nICsgJzxkaXYgY2xhc3M9XCJEVEZDX1JpZ2h0Qm9keUxpbmVyXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTsgdG9wOjA7IGxlZnQ6MDsgb3ZlcmZsb3cteTpzY3JvbGw7XCI+PC9kaXY+JyArICc8L2Rpdj4nICsgJzxkaXYgY2xhc3M9XCJEVEZDX1JpZ2h0Rm9vdFdyYXBwZXJcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlOyB0b3A6MDsgbGVmdDowO1wiPicgKyAnPGRpdiBjbGFzcz1cIkRURkNfUmlnaHRGb290QmxvY2tlciBEVEZDX0Jsb2NrZXJcIiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlOyB0b3A6MDsgYm90dG9tOjA7XCI+PC9kaXY+JyArICc8L2Rpdj4nICsgJzwvZGl2PicgKyAnPC9kaXY+JylbMF07XG4gICAgICB2YXIgbkxlZnQgPSBuU1dyYXBwZXIuY2hpbGROb2Rlc1swXTtcbiAgICAgIHZhciBuUmlnaHQgPSBuU1dyYXBwZXIuY2hpbGROb2Rlc1sxXTtcbiAgICAgIHRoaXMuZG9tLmdyaWQuZHQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoblNXcmFwcGVyLCB0aGlzLmRvbS5ncmlkLmR0KTtcbiAgICAgIG5TV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmRvbS5ncmlkLmR0KTtcbiAgICAgIHRoaXMuZG9tLmdyaWQud3JhcHBlciA9IG5TV3JhcHBlcjtcblxuICAgICAgaWYgKHRoaXMucy5pTGVmdENvbHVtbnMgPiAwKSB7XG4gICAgICAgIHRoaXMuZG9tLmdyaWQubGVmdC53cmFwcGVyID0gbkxlZnQ7XG4gICAgICAgIHRoaXMuZG9tLmdyaWQubGVmdC5oZWFkID0gbkxlZnQuY2hpbGROb2Rlc1swXTtcbiAgICAgICAgdGhpcy5kb20uZ3JpZC5sZWZ0LmJvZHkgPSBuTGVmdC5jaGlsZE5vZGVzWzFdO1xuICAgICAgICB0aGlzLmRvbS5ncmlkLmxlZnQubGluZXIgPSAkKCdkaXYuRFRGQ19MZWZ0Qm9keUxpbmVyJywgblNXcmFwcGVyKVswXTtcbiAgICAgICAgblNXcmFwcGVyLmFwcGVuZENoaWxkKG5MZWZ0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucy5pUmlnaHRDb2x1bW5zID4gMCkge1xuICAgICAgICB0aGlzLmRvbS5ncmlkLnJpZ2h0LndyYXBwZXIgPSBuUmlnaHQ7XG4gICAgICAgIHRoaXMuZG9tLmdyaWQucmlnaHQuaGVhZCA9IG5SaWdodC5jaGlsZE5vZGVzWzBdO1xuICAgICAgICB0aGlzLmRvbS5ncmlkLnJpZ2h0LmJvZHkgPSBuUmlnaHQuY2hpbGROb2Rlc1sxXTtcbiAgICAgICAgdGhpcy5kb20uZ3JpZC5yaWdodC5saW5lciA9ICQoJ2Rpdi5EVEZDX1JpZ2h0Qm9keUxpbmVyJywgblNXcmFwcGVyKVswXTtcbiAgICAgICAgblJpZ2h0LnN0eWxlLnJpZ2h0ID0gb092ZXJmbG93LmJhciArIFwicHhcIjtcbiAgICAgICAgYmxvY2sgPSAkKCdkaXYuRFRGQ19SaWdodEhlYWRCbG9ja2VyJywgblNXcmFwcGVyKVswXTtcbiAgICAgICAgYmxvY2suc3R5bGUud2lkdGggPSBvT3ZlcmZsb3cuYmFyICsgXCJweFwiO1xuICAgICAgICBibG9jay5zdHlsZS5yaWdodCA9IC1vT3ZlcmZsb3cuYmFyICsgXCJweFwiO1xuICAgICAgICB0aGlzLmRvbS5ncmlkLnJpZ2h0LmhlYWRCbG9jayA9IGJsb2NrO1xuICAgICAgICBibG9jayA9ICQoJ2Rpdi5EVEZDX1JpZ2h0Rm9vdEJsb2NrZXInLCBuU1dyYXBwZXIpWzBdO1xuICAgICAgICBibG9jay5zdHlsZS53aWR0aCA9IG9PdmVyZmxvdy5iYXIgKyBcInB4XCI7XG4gICAgICAgIGJsb2NrLnN0eWxlLnJpZ2h0ID0gLW9PdmVyZmxvdy5iYXIgKyBcInB4XCI7XG4gICAgICAgIHRoaXMuZG9tLmdyaWQucmlnaHQuZm9vdEJsb2NrID0gYmxvY2s7XG4gICAgICAgIG5TV3JhcHBlci5hcHBlbmRDaGlsZChuUmlnaHQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zLmR0Lm5URm9vdCkge1xuICAgICAgICB0aGlzLmRvbS5mb290ZXIgPSB0aGlzLnMuZHQublRGb290LnBhcmVudE5vZGU7XG5cbiAgICAgICAgaWYgKHRoaXMucy5pTGVmdENvbHVtbnMgPiAwKSB7XG4gICAgICAgICAgdGhpcy5kb20uZ3JpZC5sZWZ0LmZvb3QgPSBuTGVmdC5jaGlsZE5vZGVzWzJdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucy5pUmlnaHRDb2x1bW5zID4gMCkge1xuICAgICAgICAgIHRoaXMuZG9tLmdyaWQucmlnaHQuZm9vdCA9IG5SaWdodC5jaGlsZE5vZGVzWzJdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnMucnRsKSB7XG4gICAgICAgICQoJ2Rpdi5EVEZDX1JpZ2h0SGVhZEJsb2NrZXInLCBuU1dyYXBwZXIpLmNzcyh7XG4gICAgICAgICAgbGVmdDogLW9PdmVyZmxvdy5iYXIgKyAncHgnLFxuICAgICAgICAgIHJpZ2h0OiAnJ1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiX2ZuR3JpZExheW91dFwiOiBmdW5jdGlvbiBfZm5HcmlkTGF5b3V0KCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgdmFyIG9HcmlkID0gdGhpcy5kb20uZ3JpZDtcbiAgICAgIHZhciBpV2lkdGggPSAkKG9HcmlkLndyYXBwZXIpLndpZHRoKCk7XG4gICAgICB2YXIgaUJvZHlIZWlnaHQgPSB0aGlzLnMuZHQublRhYmxlLnBhcmVudE5vZGUub2Zmc2V0SGVpZ2h0O1xuICAgICAgdmFyIGlGdWxsSGVpZ2h0ID0gdGhpcy5zLmR0Lm5UYWJsZS5wYXJlbnROb2RlLnBhcmVudE5vZGUub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICB2YXIgb092ZXJmbG93ID0gdGhpcy5fZm5EVE92ZXJmbG93KCk7XG5cbiAgICAgIHZhciBpTGVmdFdpZHRoID0gdGhpcy5zLmlMZWZ0V2lkdGg7XG4gICAgICB2YXIgaVJpZ2h0V2lkdGggPSB0aGlzLnMuaVJpZ2h0V2lkdGg7XG4gICAgICB2YXIgcnRsID0gJCh0aGlzLmRvbS5ib2R5KS5jc3MoJ2RpcmVjdGlvbicpID09PSAncnRsJztcbiAgICAgIHZhciB3cmFwcGVyO1xuXG4gICAgICB2YXIgc2Nyb2xsYmFyQWRqdXN0ID0gZnVuY3Rpb24gc2Nyb2xsYmFyQWRqdXN0KG5vZGUsIHdpZHRoKSB7XG4gICAgICAgIGlmICghb092ZXJmbG93LmJhcikge1xuICAgICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aCArIDIwICsgXCJweFwiO1xuICAgICAgICAgIG5vZGUuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCIyMHB4XCI7XG4gICAgICAgICAgbm9kZS5zdHlsZS5ib3hTaXppbmcgPSBcImJvcmRlci1ib3hcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGF0Ll9maXJlZm94U2Nyb2xsRXJyb3IoKSkge1xuICAgICAgICAgIGlmICgkKG5vZGUpLmhlaWdodCgpID4gMzQpIHtcbiAgICAgICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aCArIG9PdmVyZmxvdy5iYXIgKyBcInB4XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aCArIG9PdmVyZmxvdy5iYXIgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChvT3ZlcmZsb3cueCkge1xuICAgICAgICBpQm9keUhlaWdodCAtPSBvT3ZlcmZsb3cuYmFyO1xuICAgICAgfVxuXG4gICAgICBvR3JpZC53cmFwcGVyLnN0eWxlLmhlaWdodCA9IGlGdWxsSGVpZ2h0ICsgXCJweFwiO1xuXG4gICAgICBpZiAodGhpcy5zLmlMZWZ0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgd3JhcHBlciA9IG9HcmlkLmxlZnQud3JhcHBlcjtcbiAgICAgICAgd3JhcHBlci5zdHlsZS53aWR0aCA9IGlMZWZ0V2lkdGggKyAncHgnO1xuICAgICAgICB3cmFwcGVyLnN0eWxlLmhlaWdodCA9ICcxcHgnO1xuXG4gICAgICAgIGlmIChydGwpIHtcbiAgICAgICAgICB3cmFwcGVyLnN0eWxlLmxlZnQgPSAnJztcbiAgICAgICAgICB3cmFwcGVyLnN0eWxlLnJpZ2h0ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3cmFwcGVyLnN0eWxlLmxlZnQgPSAwO1xuICAgICAgICAgIHdyYXBwZXIuc3R5bGUucmlnaHQgPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIG9HcmlkLmxlZnQuYm9keS5zdHlsZS5oZWlnaHQgPSBpQm9keUhlaWdodCArIFwicHhcIjtcblxuICAgICAgICBpZiAob0dyaWQubGVmdC5mb290KSB7XG4gICAgICAgICAgb0dyaWQubGVmdC5mb290LnN0eWxlLnRvcCA9IChvT3ZlcmZsb3cueCA/IG9PdmVyZmxvdy5iYXIgOiAwKSArIFwicHhcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjcm9sbGJhckFkanVzdChvR3JpZC5sZWZ0LmxpbmVyLCBpTGVmdFdpZHRoKTtcbiAgICAgICAgb0dyaWQubGVmdC5saW5lci5zdHlsZS5oZWlnaHQgPSBpQm9keUhlaWdodCArIFwicHhcIjtcbiAgICAgICAgb0dyaWQubGVmdC5saW5lci5zdHlsZS5tYXhIZWlnaHQgPSBpQm9keUhlaWdodCArIFwicHhcIjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucy5pUmlnaHRDb2x1bW5zID4gMCkge1xuICAgICAgICB3cmFwcGVyID0gb0dyaWQucmlnaHQud3JhcHBlcjtcbiAgICAgICAgd3JhcHBlci5zdHlsZS53aWR0aCA9IGlSaWdodFdpZHRoICsgJ3B4JztcbiAgICAgICAgd3JhcHBlci5zdHlsZS5oZWlnaHQgPSAnMXB4JztcblxuICAgICAgICBpZiAodGhpcy5zLnJ0bCkge1xuICAgICAgICAgIHdyYXBwZXIuc3R5bGUubGVmdCA9IG9PdmVyZmxvdy55ID8gb092ZXJmbG93LmJhciArICdweCcgOiAwO1xuICAgICAgICAgIHdyYXBwZXIuc3R5bGUucmlnaHQgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3cmFwcGVyLnN0eWxlLmxlZnQgPSAnJztcbiAgICAgICAgICB3cmFwcGVyLnN0eWxlLnJpZ2h0ID0gb092ZXJmbG93LnkgPyBvT3ZlcmZsb3cuYmFyICsgJ3B4JyA6IDA7XG4gICAgICAgIH1cblxuICAgICAgICBvR3JpZC5yaWdodC5ib2R5LnN0eWxlLmhlaWdodCA9IGlCb2R5SGVpZ2h0ICsgXCJweFwiO1xuXG4gICAgICAgIGlmIChvR3JpZC5yaWdodC5mb290KSB7XG4gICAgICAgICAgb0dyaWQucmlnaHQuZm9vdC5zdHlsZS50b3AgPSAob092ZXJmbG93LnggPyBvT3ZlcmZsb3cuYmFyIDogMCkgKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgICAgICBzY3JvbGxiYXJBZGp1c3Qob0dyaWQucmlnaHQubGluZXIsIGlSaWdodFdpZHRoKTtcbiAgICAgICAgb0dyaWQucmlnaHQubGluZXIuc3R5bGUuaGVpZ2h0ID0gaUJvZHlIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIG9HcmlkLnJpZ2h0LmxpbmVyLnN0eWxlLm1heEhlaWdodCA9IGlCb2R5SGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICBvR3JpZC5yaWdodC5oZWFkQmxvY2suc3R5bGUuZGlzcGxheSA9IG9PdmVyZmxvdy55ID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICAgICAgb0dyaWQucmlnaHQuZm9vdEJsb2NrLnN0eWxlLmRpc3BsYXkgPSBvT3ZlcmZsb3cueSA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgICB9XG4gICAgfSxcbiAgICBcIl9mbkRUT3ZlcmZsb3dcIjogZnVuY3Rpb24gX2ZuRFRPdmVyZmxvdygpIHtcbiAgICAgIHZhciBuVGFibGUgPSB0aGlzLnMuZHQublRhYmxlO1xuICAgICAgdmFyIG5UYWJsZVNjcm9sbEJvZHkgPSBuVGFibGUucGFyZW50Tm9kZTtcbiAgICAgIHZhciBvdXQgPSB7XG4gICAgICAgIFwieFwiOiBmYWxzZSxcbiAgICAgICAgXCJ5XCI6IGZhbHNlLFxuICAgICAgICBcImJhclwiOiB0aGlzLnMuZHQub1Njcm9sbC5pQmFyV2lkdGhcbiAgICAgIH07XG5cbiAgICAgIGlmIChuVGFibGUub2Zmc2V0V2lkdGggPiBuVGFibGVTY3JvbGxCb2R5LmNsaWVudFdpZHRoKSB7XG4gICAgICAgIG91dC54ID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5UYWJsZS5vZmZzZXRIZWlnaHQgPiBuVGFibGVTY3JvbGxCb2R5LmNsaWVudEhlaWdodCkge1xuICAgICAgICBvdXQueSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfSxcbiAgICBcIl9mbkRyYXdcIjogZnVuY3Rpb24gX2ZuRHJhdyhiQWxsKSB7XG4gICAgICB0aGlzLl9mbkdyaWRMYXlvdXQoKTtcblxuICAgICAgdGhpcy5fZm5DbG9uZUxlZnQoYkFsbCk7XG5cbiAgICAgIHRoaXMuX2ZuQ2xvbmVSaWdodChiQWxsKTtcblxuICAgICAgaWYgKHRoaXMucy5mbkRyYXdDYWxsYmFjayAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnMuZm5EcmF3Q2FsbGJhY2suY2FsbCh0aGlzLCB0aGlzLmRvbS5jbG9uZS5sZWZ0LCB0aGlzLmRvbS5jbG9uZS5yaWdodCk7XG4gICAgICB9XG5cbiAgICAgICQodGhpcykudHJpZ2dlcignZHJhdy5kdGZjJywge1xuICAgICAgICBcImxlZnRDbG9uZVwiOiB0aGlzLmRvbS5jbG9uZS5sZWZ0LFxuICAgICAgICBcInJpZ2h0Q2xvbmVcIjogdGhpcy5kb20uY2xvbmUucmlnaHRcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgXCJfZm5DbG9uZVJpZ2h0XCI6IGZ1bmN0aW9uIF9mbkNsb25lUmlnaHQoYkFsbCkge1xuICAgICAgaWYgKHRoaXMucy5pUmlnaHRDb2x1bW5zIDw9IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgaSxcbiAgICAgICAgICBqcSxcbiAgICAgICAgICBhaUNvbHVtbnMgPSBbXTtcblxuICAgICAgZm9yIChpID0gdGhpcy5zLmlUYWJsZUNvbHVtbnMgLSB0aGlzLnMuaVJpZ2h0Q29sdW1uczsgaSA8IHRoaXMucy5pVGFibGVDb2x1bW5zOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMucy5kdC5hb0NvbHVtbnNbaV0uYlZpc2libGUpIHtcbiAgICAgICAgICBhaUNvbHVtbnMucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9mbkNsb25lKHRoaXMuZG9tLmNsb25lLnJpZ2h0LCB0aGlzLmRvbS5ncmlkLnJpZ2h0LCBhaUNvbHVtbnMsIGJBbGwpO1xuICAgIH0sXG4gICAgXCJfZm5DbG9uZUxlZnRcIjogZnVuY3Rpb24gX2ZuQ2xvbmVMZWZ0KGJBbGwpIHtcbiAgICAgIGlmICh0aGlzLnMuaUxlZnRDb2x1bW5zIDw9IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgaSxcbiAgICAgICAgICBqcSxcbiAgICAgICAgICBhaUNvbHVtbnMgPSBbXTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMucy5pTGVmdENvbHVtbnM7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5zLmR0LmFvQ29sdW1uc1tpXS5iVmlzaWJsZSkge1xuICAgICAgICAgIGFpQ29sdW1ucy5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2ZuQ2xvbmUodGhpcy5kb20uY2xvbmUubGVmdCwgdGhpcy5kb20uZ3JpZC5sZWZ0LCBhaUNvbHVtbnMsIGJBbGwpO1xuICAgIH0sXG4gICAgXCJfZm5Db3B5TGF5b3V0XCI6IGZ1bmN0aW9uIF9mbkNvcHlMYXlvdXQoYW9PcmlnaW5hbCwgYWlDb2x1bW5zLCBldmVudHMpIHtcbiAgICAgIHZhciBhUmV0dXJuID0gW107XG4gICAgICB2YXIgYUNsb25lcyA9IFtdO1xuICAgICAgdmFyIGFDbG9uZWQgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSBhb09yaWdpbmFsLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICB2YXIgYVJvdyA9IFtdO1xuICAgICAgICBhUm93Lm5UciA9ICQoYW9PcmlnaW5hbFtpXS5uVHIpLmNsb25lKGV2ZW50cywgZmFsc2UpWzBdO1xuXG4gICAgICAgIGZvciAodmFyIGogPSAwLCBqTGVuID0gdGhpcy5zLmlUYWJsZUNvbHVtbnM7IGogPCBqTGVuOyBqKyspIHtcbiAgICAgICAgICBpZiAoJC5pbkFycmF5KGosIGFpQ29sdW1ucykgPT09IC0xKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgaUNsb25lZCA9ICQuaW5BcnJheShhb09yaWdpbmFsW2ldW2pdLmNlbGwsIGFDbG9uZWQpO1xuXG4gICAgICAgICAgaWYgKGlDbG9uZWQgPT09IC0xKSB7XG4gICAgICAgICAgICB2YXIgbkNsb25lID0gJChhb09yaWdpbmFsW2ldW2pdLmNlbGwpLmNsb25lKGV2ZW50cywgZmFsc2UpWzBdO1xuICAgICAgICAgICAgYUNsb25lcy5wdXNoKG5DbG9uZSk7XG4gICAgICAgICAgICBhQ2xvbmVkLnB1c2goYW9PcmlnaW5hbFtpXVtqXS5jZWxsKTtcbiAgICAgICAgICAgIGFSb3cucHVzaCh7XG4gICAgICAgICAgICAgIFwiY2VsbFwiOiBuQ2xvbmUsXG4gICAgICAgICAgICAgIFwidW5pcXVlXCI6IGFvT3JpZ2luYWxbaV1bal0udW5pcXVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYVJvdy5wdXNoKHtcbiAgICAgICAgICAgICAgXCJjZWxsXCI6IGFDbG9uZXNbaUNsb25lZF0sXG4gICAgICAgICAgICAgIFwidW5pcXVlXCI6IGFvT3JpZ2luYWxbaV1bal0udW5pcXVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhUmV0dXJuLnB1c2goYVJvdyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhUmV0dXJuO1xuICAgIH0sXG4gICAgXCJfZm5DbG9uZVwiOiBmdW5jdGlvbiBfZm5DbG9uZShvQ2xvbmUsIG9HcmlkLCBhaUNvbHVtbnMsIGJBbGwpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICBpLFxuICAgICAgICAgIGlMZW4sXG4gICAgICAgICAgaixcbiAgICAgICAgICBqTGVuLFxuICAgICAgICAgIGpxLFxuICAgICAgICAgIG5UYXJnZXQsXG4gICAgICAgICAgaUNvbHVtbixcbiAgICAgICAgICBuQ2xvbmUsXG4gICAgICAgICAgaUluZGV4LFxuICAgICAgICAgIGFvQ2xvbmVMYXlvdXQsXG4gICAgICAgICAganFDbG9uZVRoZWFkLFxuICAgICAgICAgIGFvRml4ZWRIZWFkZXIsXG4gICAgICAgICAgZHQgPSB0aGlzLnMuZHQ7XG5cbiAgICAgIGlmIChiQWxsKSB7XG4gICAgICAgICQob0Nsb25lLmhlYWRlcikucmVtb3ZlKCk7XG4gICAgICAgIG9DbG9uZS5oZWFkZXIgPSAkKHRoaXMuZG9tLmhlYWRlcikuY2xvbmUodHJ1ZSwgZmFsc2UpWzBdO1xuICAgICAgICBvQ2xvbmUuaGVhZGVyLmNsYXNzTmFtZSArPSBcIiBEVEZDX0Nsb25lZFwiO1xuICAgICAgICBvQ2xvbmUuaGVhZGVyLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgIG9HcmlkLmhlYWQuYXBwZW5kQ2hpbGQob0Nsb25lLmhlYWRlcik7XG4gICAgICAgIGFvQ2xvbmVMYXlvdXQgPSB0aGlzLl9mbkNvcHlMYXlvdXQoZHQuYW9IZWFkZXIsIGFpQ29sdW1ucywgdHJ1ZSk7XG4gICAgICAgIGpxQ2xvbmVUaGVhZCA9ICQoJz50aGVhZCcsIG9DbG9uZS5oZWFkZXIpO1xuICAgICAgICBqcUNsb25lVGhlYWQuZW1wdHkoKTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW9DbG9uZUxheW91dC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgICBqcUNsb25lVGhlYWRbMF0uYXBwZW5kQ2hpbGQoYW9DbG9uZUxheW91dFtpXS5uVHIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZHQub0FwaS5fZm5EcmF3SGVhZChkdCwgYW9DbG9uZUxheW91dCwgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhb0Nsb25lTGF5b3V0ID0gdGhpcy5fZm5Db3B5TGF5b3V0KGR0LmFvSGVhZGVyLCBhaUNvbHVtbnMsIGZhbHNlKTtcbiAgICAgICAgYW9GaXhlZEhlYWRlciA9IFtdO1xuXG4gICAgICAgIGR0Lm9BcGkuX2ZuRGV0ZWN0SGVhZGVyKGFvRml4ZWRIZWFkZXIsICQoJz50aGVhZCcsIG9DbG9uZS5oZWFkZXIpWzBdKTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW9DbG9uZUxheW91dC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgICBmb3IgKGogPSAwLCBqTGVuID0gYW9DbG9uZUxheW91dFtpXS5sZW5ndGg7IGogPCBqTGVuOyBqKyspIHtcbiAgICAgICAgICAgIGFvRml4ZWRIZWFkZXJbaV1bal0uY2VsbC5jbGFzc05hbWUgPSBhb0Nsb25lTGF5b3V0W2ldW2pdLmNlbGwuY2xhc3NOYW1lO1xuICAgICAgICAgICAgJCgnc3Bhbi5EYXRhVGFibGVzX3NvcnRfaWNvbicsIGFvRml4ZWRIZWFkZXJbaV1bal0uY2VsbCkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gJCgnc3Bhbi5EYXRhVGFibGVzX3NvcnRfaWNvbicsIGFvQ2xvbmVMYXlvdXRbaV1bal0uY2VsbClbMF0uY2xhc3NOYW1lO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2ZuRXF1YWxpc2VIZWlnaHRzKCd0aGVhZCcsIHRoaXMuZG9tLmhlYWRlciwgb0Nsb25lLmhlYWRlcik7XG5cbiAgICAgIGlmICh0aGlzLnMuc0hlaWdodE1hdGNoID09ICdhdXRvJykge1xuICAgICAgICAkKCc+dGJvZHk+dHInLCB0aGF0LmRvbS5ib2R5KS5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvQ2xvbmUuYm9keSAhPT0gbnVsbCkge1xuICAgICAgICAkKG9DbG9uZS5ib2R5KS5yZW1vdmUoKTtcbiAgICAgICAgb0Nsb25lLmJvZHkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBvQ2xvbmUuYm9keSA9ICQodGhpcy5kb20uYm9keSkuY2xvbmUodHJ1ZSlbMF07XG4gICAgICBvQ2xvbmUuYm9keS5jbGFzc05hbWUgKz0gXCIgRFRGQ19DbG9uZWRcIjtcbiAgICAgIG9DbG9uZS5ib2R5LnN0eWxlLnBhZGRpbmdCb3R0b20gPSBkdC5vU2Nyb2xsLmlCYXJXaWR0aCArIFwicHhcIjtcbiAgICAgIG9DbG9uZS5ib2R5LnN0eWxlLm1hcmdpbkJvdHRvbSA9IGR0Lm9TY3JvbGwuaUJhcldpZHRoICogMiArIFwicHhcIjtcblxuICAgICAgaWYgKG9DbG9uZS5ib2R5LmdldEF0dHJpYnV0ZSgnaWQnKSAhPT0gbnVsbCkge1xuICAgICAgICBvQ2xvbmUuYm9keS5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICB9XG5cbiAgICAgICQoJz50aGVhZD50cicsIG9DbG9uZS5ib2R5KS5lbXB0eSgpO1xuICAgICAgJCgnPnRmb290Jywgb0Nsb25lLmJvZHkpLnJlbW92ZSgpO1xuICAgICAgdmFyIG5Cb2R5ID0gJCgndGJvZHknLCBvQ2xvbmUuYm9keSlbMF07XG4gICAgICAkKG5Cb2R5KS5lbXB0eSgpO1xuXG4gICAgICBpZiAoZHQuYWlEaXNwbGF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIG5Jbm5lclRoZWFkID0gJCgnPnRoZWFkPnRyJywgb0Nsb25lLmJvZHkpWzBdO1xuXG4gICAgICAgIGZvciAoaUluZGV4ID0gMDsgaUluZGV4IDwgYWlDb2x1bW5zLmxlbmd0aDsgaUluZGV4KyspIHtcbiAgICAgICAgICBpQ29sdW1uID0gYWlDb2x1bW5zW2lJbmRleF07XG4gICAgICAgICAgbkNsb25lID0gJChkdC5hb0NvbHVtbnNbaUNvbHVtbl0ublRoKS5jbG9uZSh0cnVlKVswXTtcbiAgICAgICAgICBuQ2xvbmUuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICB2YXIgb1N0eWxlID0gbkNsb25lLnN0eWxlO1xuICAgICAgICAgIG9TdHlsZS5wYWRkaW5nVG9wID0gXCIwXCI7XG4gICAgICAgICAgb1N0eWxlLnBhZGRpbmdCb3R0b20gPSBcIjBcIjtcbiAgICAgICAgICBvU3R5bGUuYm9yZGVyVG9wV2lkdGggPSBcIjBcIjtcbiAgICAgICAgICBvU3R5bGUuYm9yZGVyQm90dG9tV2lkdGggPSBcIjBcIjtcbiAgICAgICAgICBvU3R5bGUuaGVpZ2h0ID0gMDtcbiAgICAgICAgICBvU3R5bGUud2lkdGggPSB0aGF0LnMuYWlJbm5lcldpZHRoc1tpQ29sdW1uXSArIFwicHhcIjtcbiAgICAgICAgICBuSW5uZXJUaGVhZC5hcHBlbmRDaGlsZChuQ2xvbmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnPnRib2R5PnRyJywgdGhhdC5kb20uYm9keSkuZWFjaChmdW5jdGlvbiAoeikge1xuICAgICAgICAgIHZhciBpID0gdGhhdC5zLmR0Lm9GZWF0dXJlcy5iU2VydmVyU2lkZSA9PT0gZmFsc2UgPyB0aGF0LnMuZHQuYWlEaXNwbGF5W3RoYXQucy5kdC5faURpc3BsYXlTdGFydCArIHpdIDogejtcbiAgICAgICAgICB2YXIgYVRkcyA9IHRoYXQucy5kdC5hb0RhdGFbaV0uYW5DZWxscyB8fCAkKHRoaXMpLmNoaWxkcmVuKCd0ZCwgdGgnKTtcbiAgICAgICAgICB2YXIgbiA9IHRoaXMuY2xvbmVOb2RlKGZhbHNlKTtcbiAgICAgICAgICBuLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgICBuLnNldEF0dHJpYnV0ZSgnZGF0YS1kdC1yb3cnLCBpKTtcblxuICAgICAgICAgIGZvciAoaUluZGV4ID0gMDsgaUluZGV4IDwgYWlDb2x1bW5zLmxlbmd0aDsgaUluZGV4KyspIHtcbiAgICAgICAgICAgIGlDb2x1bW4gPSBhaUNvbHVtbnNbaUluZGV4XTtcblxuICAgICAgICAgICAgaWYgKGFUZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBuQ2xvbmUgPSAkKGFUZHNbaUNvbHVtbl0pLmNsb25lKHRydWUsIHRydWUpWzBdO1xuICAgICAgICAgICAgICBuQ2xvbmUucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuICAgICAgICAgICAgICBuQ2xvbmUuc2V0QXR0cmlidXRlKCdkYXRhLWR0LXJvdycsIGkpO1xuICAgICAgICAgICAgICBuQ2xvbmUuc2V0QXR0cmlidXRlKCdkYXRhLWR0LWNvbHVtbicsIGlDb2x1bW4pO1xuICAgICAgICAgICAgICBuLmFwcGVuZENoaWxkKG5DbG9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbkJvZHkuYXBwZW5kQ2hpbGQobik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCgnPnRib2R5PnRyJywgdGhhdC5kb20uYm9keSkuZWFjaChmdW5jdGlvbiAoeikge1xuICAgICAgICAgIG5DbG9uZSA9IHRoaXMuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgIG5DbG9uZS5jbGFzc05hbWUgKz0gJyBEVEZDX05vRGF0YSc7XG4gICAgICAgICAgJCgndGQnLCBuQ2xvbmUpLmh0bWwoJycpO1xuICAgICAgICAgIG5Cb2R5LmFwcGVuZENoaWxkKG5DbG9uZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBvQ2xvbmUuYm9keS5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgb0Nsb25lLmJvZHkuc3R5bGUubWFyZ2luID0gXCIwXCI7XG4gICAgICBvQ2xvbmUuYm9keS5zdHlsZS5wYWRkaW5nID0gXCIwXCI7XG5cbiAgICAgIGlmIChkdC5vU2Nyb2xsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgc2Nyb2xsZXJGb3JjZXIgPSBkdC5vU2Nyb2xsZXIuZG9tLmZvcmNlO1xuXG4gICAgICAgIGlmICghb0dyaWQuZm9yY2VyKSB7XG4gICAgICAgICAgb0dyaWQuZm9yY2VyID0gc2Nyb2xsZXJGb3JjZXIuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgIG9HcmlkLmxpbmVyLmFwcGVuZENoaWxkKG9HcmlkLmZvcmNlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb0dyaWQuZm9yY2VyLnN0eWxlLmhlaWdodCA9IHNjcm9sbGVyRm9yY2VyLnN0eWxlLmhlaWdodDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBvR3JpZC5saW5lci5hcHBlbmRDaGlsZChvQ2xvbmUuYm9keSk7XG5cbiAgICAgIHRoaXMuX2ZuRXF1YWxpc2VIZWlnaHRzKCd0Ym9keScsIHRoYXQuZG9tLmJvZHksIG9DbG9uZS5ib2R5KTtcblxuICAgICAgaWYgKGR0Lm5URm9vdCAhPT0gbnVsbCkge1xuICAgICAgICBpZiAoYkFsbCkge1xuICAgICAgICAgIGlmIChvQ2xvbmUuZm9vdGVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICBvQ2xvbmUuZm9vdGVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob0Nsb25lLmZvb3Rlcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb0Nsb25lLmZvb3RlciA9ICQodGhpcy5kb20uZm9vdGVyKS5jbG9uZSh0cnVlLCB0cnVlKVswXTtcbiAgICAgICAgICBvQ2xvbmUuZm9vdGVyLmNsYXNzTmFtZSArPSBcIiBEVEZDX0Nsb25lZFwiO1xuICAgICAgICAgIG9DbG9uZS5mb290ZXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgICAgICBvR3JpZC5mb290LmFwcGVuZENoaWxkKG9DbG9uZS5mb290ZXIpO1xuICAgICAgICAgIGFvQ2xvbmVMYXlvdXQgPSB0aGlzLl9mbkNvcHlMYXlvdXQoZHQuYW9Gb290ZXIsIGFpQ29sdW1ucywgdHJ1ZSk7XG4gICAgICAgICAgdmFyIGpxQ2xvbmVUZm9vdCA9ICQoJz50Zm9vdCcsIG9DbG9uZS5mb290ZXIpO1xuICAgICAgICAgIGpxQ2xvbmVUZm9vdC5lbXB0eSgpO1xuXG4gICAgICAgICAgZm9yIChpID0gMCwgaUxlbiA9IGFvQ2xvbmVMYXlvdXQubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgICAgICBqcUNsb25lVGZvb3RbMF0uYXBwZW5kQ2hpbGQoYW9DbG9uZUxheW91dFtpXS5uVHIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGR0Lm9BcGkuX2ZuRHJhd0hlYWQoZHQsIGFvQ2xvbmVMYXlvdXQsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFvQ2xvbmVMYXlvdXQgPSB0aGlzLl9mbkNvcHlMYXlvdXQoZHQuYW9Gb290ZXIsIGFpQ29sdW1ucywgZmFsc2UpO1xuICAgICAgICAgIHZhciBhb0N1cnJGb290ZXIgPSBbXTtcblxuICAgICAgICAgIGR0Lm9BcGkuX2ZuRGV0ZWN0SGVhZGVyKGFvQ3VyckZvb3RlciwgJCgnPnRmb290Jywgb0Nsb25lLmZvb3RlcilbMF0pO1xuXG4gICAgICAgICAgZm9yIChpID0gMCwgaUxlbiA9IGFvQ2xvbmVMYXlvdXQubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqTGVuID0gYW9DbG9uZUxheW91dFtpXS5sZW5ndGg7IGogPCBqTGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgYW9DdXJyRm9vdGVyW2ldW2pdLmNlbGwuY2xhc3NOYW1lID0gYW9DbG9uZUxheW91dFtpXVtqXS5jZWxsLmNsYXNzTmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9mbkVxdWFsaXNlSGVpZ2h0cygndGZvb3QnLCB0aGlzLmRvbS5mb290ZXIsIG9DbG9uZS5mb290ZXIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgYW5VbmlxdWUgPSBkdC5vQXBpLl9mbkdldFVuaXF1ZVRocyhkdCwgJCgnPnRoZWFkJywgb0Nsb25lLmhlYWRlcilbMF0pO1xuXG4gICAgICAkKGFuVW5pcXVlKS5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIGlDb2x1bW4gPSBhaUNvbHVtbnNbaV07XG4gICAgICAgIHRoaXMuc3R5bGUud2lkdGggPSB0aGF0LnMuYWlJbm5lcldpZHRoc1tpQ29sdW1uXSArIFwicHhcIjtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhhdC5zLmR0Lm5URm9vdCAhPT0gbnVsbCkge1xuICAgICAgICBhblVuaXF1ZSA9IGR0Lm9BcGkuX2ZuR2V0VW5pcXVlVGhzKGR0LCAkKCc+dGZvb3QnLCBvQ2xvbmUuZm9vdGVyKVswXSk7XG4gICAgICAgICQoYW5VbmlxdWUpLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICBpQ29sdW1uID0gYWlDb2x1bW5zW2ldO1xuICAgICAgICAgIHRoaXMuc3R5bGUud2lkdGggPSB0aGF0LnMuYWlJbm5lcldpZHRoc1tpQ29sdW1uXSArIFwicHhcIjtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcIl9mbkdldFRyTm9kZXNcIjogZnVuY3Rpb24gX2ZuR2V0VHJOb2RlcyhuSW4pIHtcbiAgICAgIHZhciBhT3V0ID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gbkluLmNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChuSW4uY2hpbGROb2Rlc1tpXS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09IFwiVFJcIikge1xuICAgICAgICAgIGFPdXQucHVzaChuSW4uY2hpbGROb2Rlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFPdXQ7XG4gICAgfSxcbiAgICBcIl9mbkVxdWFsaXNlSGVpZ2h0c1wiOiBmdW5jdGlvbiBfZm5FcXVhbGlzZUhlaWdodHMobm9kZU5hbWUsIG9yaWdpbmFsLCBjbG9uZSkge1xuICAgICAgaWYgKHRoaXMucy5zSGVpZ2h0TWF0Y2ggPT0gJ25vbmUnICYmIG5vZGVOYW1lICE9PSAndGhlYWQnICYmIG5vZGVOYW1lICE9PSAndGZvb3QnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgIGksXG4gICAgICAgICAgaUxlbixcbiAgICAgICAgICBpSGVpZ2h0LFxuICAgICAgICAgIGlIZWlnaHQyLFxuICAgICAgICAgIGlIZWlnaHRPcmlnaW5hbCxcbiAgICAgICAgICBpSGVpZ2h0Q2xvbmUsXG4gICAgICAgICAgcm9vdE9yaWdpbmFsID0gb3JpZ2luYWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUobm9kZU5hbWUpWzBdLFxuICAgICAgICAgIHJvb3RDbG9uZSA9IGNsb25lLmdldEVsZW1lbnRzQnlUYWdOYW1lKG5vZGVOYW1lKVswXSxcbiAgICAgICAgICBqcUJveEhhY2sgPSAkKCc+JyArIG5vZGVOYW1lICsgJz50cjplcSgwKScsIG9yaWdpbmFsKS5jaGlsZHJlbignOmZpcnN0JyksXG4gICAgICAgICAgaUJveEhhY2sgPSBqcUJveEhhY2sub3V0ZXJIZWlnaHQoKSAtIGpxQm94SGFjay5oZWlnaHQoKSxcbiAgICAgICAgICBhbk9yaWdpbmFsID0gdGhpcy5fZm5HZXRUck5vZGVzKHJvb3RPcmlnaW5hbCksXG4gICAgICAgICAgYW5DbG9uZSA9IHRoaXMuX2ZuR2V0VHJOb2Rlcyhyb290Q2xvbmUpLFxuICAgICAgICAgIGhlaWdodHMgPSBbXTtcblxuICAgICAgZm9yIChpID0gMCwgaUxlbiA9IGFuQ2xvbmUubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgIGlIZWlnaHRPcmlnaW5hbCA9IGFuT3JpZ2luYWxbaV0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBpSGVpZ2h0Q2xvbmUgPSBhbkNsb25lW2ldLm9mZnNldEhlaWdodDtcbiAgICAgICAgaUhlaWdodCA9IGlIZWlnaHRDbG9uZSA+IGlIZWlnaHRPcmlnaW5hbCA/IGlIZWlnaHRDbG9uZSA6IGlIZWlnaHRPcmlnaW5hbDtcblxuICAgICAgICBpZiAodGhpcy5zLnNIZWlnaHRNYXRjaCA9PSAnc2VtaWF1dG8nKSB7XG4gICAgICAgICAgYW5PcmlnaW5hbFtpXS5fRFRUQ19pSGVpZ2h0ID0gaUhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIGhlaWdodHMucHVzaChpSGVpZ2h0KTtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMCwgaUxlbiA9IGFuQ2xvbmUubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgIGFuQ2xvbmVbaV0uc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0c1tpXSArIFwicHhcIjtcbiAgICAgICAgYW5PcmlnaW5hbFtpXS5zdHlsZS5oZWlnaHQgPSBoZWlnaHRzW2ldICsgXCJweFwiO1xuICAgICAgfVxuICAgIH0sXG4gICAgX2ZpcmVmb3hTY3JvbGxFcnJvcjogZnVuY3Rpb24gX2ZpcmVmb3hTY3JvbGxFcnJvcigpIHtcbiAgICAgIGlmIChfZmlyZWZveFNjcm9sbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciB0ZXN0ID0gJCgnPGRpdi8+JykuY3NzKHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBoZWlnaHQ6IDEwLFxuICAgICAgICAgIHdpZHRoOiA1MCxcbiAgICAgICAgICBvdmVyZmxvdzogJ3Njcm9sbCdcbiAgICAgICAgfSkuYXBwZW5kVG8oJ2JvZHknKTtcbiAgICAgICAgX2ZpcmVmb3hTY3JvbGwgPSB0ZXN0WzBdLmNsaWVudFdpZHRoID09PSB0ZXN0WzBdLm9mZnNldFdpZHRoICYmIHRoaXMuX2ZuRFRPdmVyZmxvdygpLmJhciAhPT0gMDtcbiAgICAgICAgdGVzdC5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9maXJlZm94U2Nyb2xsO1xuICAgIH1cbiAgfSk7XG4gIEZpeGVkQ29sdW1ucy5kZWZhdWx0cyA9IHtcbiAgICBcImlMZWZ0Q29sdW1uc1wiOiAxLFxuICAgIFwiaVJpZ2h0Q29sdW1uc1wiOiAwLFxuICAgIFwiZm5EcmF3Q2FsbGJhY2tcIjogbnVsbCxcbiAgICBcInNIZWlnaHRNYXRjaFwiOiBcInNlbWlhdXRvXCJcbiAgfTtcbiAgRml4ZWRDb2x1bW5zLnZlcnNpb24gPSBcIjMuMi41XCI7XG4gIERhdGFUYWJsZS5BcGkucmVnaXN0ZXIoJ2ZpeGVkQ29sdW1ucygpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRDb2x1bW5zKCkudXBkYXRlKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgaWYgKGN0eC5fb0ZpeGVkQ29sdW1ucykge1xuICAgICAgICBjdHguX29GaXhlZENvbHVtbnMuZm5VcGRhdGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIERhdGFUYWJsZS5BcGkucmVnaXN0ZXIoJ2ZpeGVkQ29sdW1ucygpLnJlbGF5b3V0KCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgaWYgKGN0eC5fb0ZpeGVkQ29sdW1ucykge1xuICAgICAgICBjdHguX29GaXhlZENvbHVtbnMuZm5SZWRyYXdMYXlvdXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIERhdGFUYWJsZS5BcGkucmVnaXN0ZXIoJ3Jvd3MoKS5yZWNhbGNIZWlnaHQoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigncm93JywgZnVuY3Rpb24gKGN0eCwgaWR4KSB7XG4gICAgICBpZiAoY3R4Ll9vRml4ZWRDb2x1bW5zKSB7XG4gICAgICAgIGN0eC5fb0ZpeGVkQ29sdW1ucy5mblJlY2FsY3VsYXRlSGVpZ2h0KHRoaXMucm93KGlkeCkubm9kZSgpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIERhdGFUYWJsZS5BcGkucmVnaXN0ZXIoJ2ZpeGVkQ29sdW1ucygpLnJvd0luZGV4KCknLCBmdW5jdGlvbiAocm93KSB7XG4gICAgcm93ID0gJChyb3cpO1xuICAgIHJldHVybiByb3cucGFyZW50cygnLkRURkNfQ2xvbmVkJykubGVuZ3RoID8gdGhpcy5yb3dzKHtcbiAgICAgIHBhZ2U6ICdjdXJyZW50J1xuICAgIH0pLmluZGV4ZXMoKVtyb3cuaW5kZXgoKV0gOiB0aGlzLnJvdyhyb3cpLmluZGV4KCk7XG4gIH0pO1xuICBEYXRhVGFibGUuQXBpLnJlZ2lzdGVyKCdmaXhlZENvbHVtbnMoKS5jZWxsSW5kZXgoKScsIGZ1bmN0aW9uIChjZWxsKSB7XG4gICAgY2VsbCA9ICQoY2VsbCk7XG5cbiAgICBpZiAoY2VsbC5wYXJlbnRzKCcuRFRGQ19DbG9uZWQnKS5sZW5ndGgpIHtcbiAgICAgIHZhciByb3dDbG9uZWRJZHggPSBjZWxsLnBhcmVudCgpLmluZGV4KCk7XG4gICAgICB2YXIgcm93SWR4ID0gdGhpcy5yb3dzKHtcbiAgICAgICAgcGFnZTogJ2N1cnJlbnQnXG4gICAgICB9KS5pbmRleGVzKClbcm93Q2xvbmVkSWR4XTtcbiAgICAgIHZhciBjb2x1bW5JZHg7XG5cbiAgICAgIGlmIChjZWxsLnBhcmVudHMoJy5EVEZDX0xlZnRXcmFwcGVyJykubGVuZ3RoKSB7XG4gICAgICAgIGNvbHVtbklkeCA9IGNlbGwuaW5kZXgoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjb2x1bW5zID0gdGhpcy5jb2x1bW5zKCkuZmxhdHRlbigpLmxlbmd0aDtcbiAgICAgICAgY29sdW1uSWR4ID0gY29sdW1ucyAtIHRoaXMuY29udGV4dFswXS5fb0ZpeGVkQ29sdW1ucy5zLmlSaWdodENvbHVtbnMgKyBjZWxsLmluZGV4KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJvdzogcm93SWR4LFxuICAgICAgICBjb2x1bW46IHRoaXMuY29sdW1uLmluZGV4KCd0b0RhdGEnLCBjb2x1bW5JZHgpLFxuICAgICAgICBjb2x1bW5WaXNpYmxlOiBjb2x1bW5JZHhcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNlbGwoY2VsbCkuaW5kZXgoKTtcbiAgICB9XG4gIH0pO1xuICAkKGRvY3VtZW50KS5vbignaW5pdC5kdC5maXhlZENvbHVtbnMnLCBmdW5jdGlvbiAoZSwgc2V0dGluZ3MpIHtcbiAgICBpZiAoZS5uYW1lc3BhY2UgIT09ICdkdCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaW5pdCA9IHNldHRpbmdzLm9Jbml0LmZpeGVkQ29sdW1ucztcbiAgICB2YXIgZGVmYXVsdHMgPSBEYXRhVGFibGUuZGVmYXVsdHMuZml4ZWRDb2x1bW5zO1xuXG4gICAgaWYgKGluaXQgfHwgZGVmYXVsdHMpIHtcbiAgICAgIHZhciBvcHRzID0gJC5leHRlbmQoe30sIGluaXQsIGRlZmF1bHRzKTtcblxuICAgICAgaWYgKGluaXQgIT09IGZhbHNlKSB7XG4gICAgICAgIG5ldyBGaXhlZENvbHVtbnMoc2V0dGluZ3MsIG9wdHMpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gICQuZm4uZGF0YVRhYmxlLkZpeGVkQ29sdW1ucyA9IEZpeGVkQ29sdW1ucztcbiAgJC5mbi5EYXRhVGFibGUuRml4ZWRDb2x1bW5zID0gRml4ZWRDb2x1bW5zO1xuICByZXR1cm4gRml4ZWRDb2x1bW5zO1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFsnanF1ZXJ5JywgJ2RhdGF0YWJsZXMubmV0J10sIGZ1bmN0aW9uICgkKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeSgkLCB3aW5kb3csIGRvY3VtZW50KTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICgodHlwZW9mIGV4cG9ydHMgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihleHBvcnRzKSkgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm9vdCwgJCkge1xuICAgICAgaWYgKCFyb290KSB7XG4gICAgICAgIHJvb3QgPSB3aW5kb3c7XG4gICAgICB9XG5cbiAgICAgIGlmICghJCB8fCAhJC5mbi5kYXRhVGFibGUpIHtcbiAgICAgICAgJCA9IHJlcXVpcmUoJ2RhdGF0YWJsZXMubmV0Jykocm9vdCwgJCkuJDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhY3RvcnkoJCwgcm9vdCwgcm9vdC5kb2N1bWVudCk7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBmYWN0b3J5KGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG4gIH1cbn0pKGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBEYXRhVGFibGUgPSAkLmZuLmRhdGFUYWJsZTtcbiAgdmFyIF9pbnN0Q291bnRlciA9IDA7XG5cbiAgdmFyIEZpeGVkSGVhZGVyID0gZnVuY3Rpb24gRml4ZWRIZWFkZXIoZHQsIGNvbmZpZykge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBGaXhlZEhlYWRlcikpIHtcbiAgICAgIHRocm93IFwiRml4ZWRIZWFkZXIgbXVzdCBiZSBpbml0aWFsaXNlZCB3aXRoIHRoZSAnbmV3JyBrZXl3b3JkLlwiO1xuICAgIH1cblxuICAgIGlmIChjb25maWcgPT09IHRydWUpIHtcbiAgICAgIGNvbmZpZyA9IHt9O1xuICAgIH1cblxuICAgIGR0ID0gbmV3IERhdGFUYWJsZS5BcGkoZHQpO1xuICAgIHRoaXMuYyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBGaXhlZEhlYWRlci5kZWZhdWx0cywgY29uZmlnKTtcbiAgICB0aGlzLnMgPSB7XG4gICAgICBkdDogZHQsXG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICB0aGVhZFRvcDogMCxcbiAgICAgICAgdGJvZHlUb3A6IDAsXG4gICAgICAgIHRmb290VG9wOiAwLFxuICAgICAgICB0Zm9vdEJvdHRvbTogMCxcbiAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHRmb290SGVpZ2h0OiAwLFxuICAgICAgICB0aGVhZEhlaWdodDogMCxcbiAgICAgICAgd2luZG93SGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCksXG4gICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgIH0sXG4gICAgICBoZWFkZXJNb2RlOiBudWxsLFxuICAgICAgZm9vdGVyTW9kZTogbnVsbCxcbiAgICAgIGF1dG9XaWR0aDogZHQuc2V0dGluZ3MoKVswXS5vRmVhdHVyZXMuYkF1dG9XaWR0aCxcbiAgICAgIG5hbWVzcGFjZTogJy5kdGZjJyArIF9pbnN0Q291bnRlcisrLFxuICAgICAgc2Nyb2xsTGVmdDoge1xuICAgICAgICBoZWFkZXI6IC0xLFxuICAgICAgICBmb290ZXI6IC0xXG4gICAgICB9LFxuICAgICAgZW5hYmxlOiB0cnVlXG4gICAgfTtcbiAgICB0aGlzLmRvbSA9IHtcbiAgICAgIGZsb2F0aW5nSGVhZGVyOiBudWxsLFxuICAgICAgdGhlYWQ6ICQoZHQudGFibGUoKS5oZWFkZXIoKSksXG4gICAgICB0Ym9keTogJChkdC50YWJsZSgpLmJvZHkoKSksXG4gICAgICB0Zm9vdDogJChkdC50YWJsZSgpLmZvb3RlcigpKSxcbiAgICAgIGhlYWRlcjoge1xuICAgICAgICBob3N0OiBudWxsLFxuICAgICAgICBmbG9hdGluZzogbnVsbCxcbiAgICAgICAgcGxhY2Vob2xkZXI6IG51bGxcbiAgICAgIH0sXG4gICAgICBmb290ZXI6IHtcbiAgICAgICAgaG9zdDogbnVsbCxcbiAgICAgICAgZmxvYXRpbmc6IG51bGwsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBudWxsXG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmRvbS5oZWFkZXIuaG9zdCA9IHRoaXMuZG9tLnRoZWFkLnBhcmVudCgpO1xuICAgIHRoaXMuZG9tLmZvb3Rlci5ob3N0ID0gdGhpcy5kb20udGZvb3QucGFyZW50KCk7XG4gICAgdmFyIGR0U2V0dGluZ3MgPSBkdC5zZXR0aW5ncygpWzBdO1xuXG4gICAgaWYgKGR0U2V0dGluZ3MuX2ZpeGVkSGVhZGVyKSB7XG4gICAgICB0aHJvdyBcIkZpeGVkSGVhZGVyIGFscmVhZHkgaW5pdGlhbGlzZWQgb24gdGFibGUgXCIgKyBkdFNldHRpbmdzLm5UYWJsZS5pZDtcbiAgICB9XG5cbiAgICBkdFNldHRpbmdzLl9maXhlZEhlYWRlciA9IHRoaXM7XG5cbiAgICB0aGlzLl9jb25zdHJ1Y3RvcigpO1xuICB9O1xuXG4gICQuZXh0ZW5kKEZpeGVkSGVhZGVyLnByb3RvdHlwZSwge1xuICAgIGVuYWJsZTogZnVuY3Rpb24gZW5hYmxlKF9lbmFibGUpIHtcbiAgICAgIHRoaXMucy5lbmFibGUgPSBfZW5hYmxlO1xuXG4gICAgICBpZiAodGhpcy5jLmhlYWRlcikge1xuICAgICAgICB0aGlzLl9tb2RlQ2hhbmdlKCdpbi1wbGFjZScsICdoZWFkZXInLCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYy5mb290ZXIgJiYgdGhpcy5kb20udGZvb3QubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX21vZGVDaGFuZ2UoJ2luLXBsYWNlJywgJ2Zvb3RlcicsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgIH0sXG4gICAgaGVhZGVyT2Zmc2V0OiBmdW5jdGlvbiBoZWFkZXJPZmZzZXQob2Zmc2V0KSB7XG4gICAgICBpZiAob2Zmc2V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5jLmhlYWRlck9mZnNldCA9IG9mZnNldDtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuYy5oZWFkZXJPZmZzZXQ7XG4gICAgfSxcbiAgICBmb290ZXJPZmZzZXQ6IGZ1bmN0aW9uIGZvb3Rlck9mZnNldChvZmZzZXQpIHtcbiAgICAgIGlmIChvZmZzZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmMuZm9vdGVyT2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jLmZvb3Rlck9mZnNldDtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgdGhpcy5fcG9zaXRpb25zKCk7XG5cbiAgICAgIHRoaXMuX3Njcm9sbCh0cnVlKTtcbiAgICB9LFxuICAgIF9jb25zdHJ1Y3RvcjogZnVuY3Rpb24gX2NvbnN0cnVjdG9yKCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgdmFyIGR0ID0gdGhpcy5zLmR0O1xuICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnICsgdGhpcy5zLm5hbWVzcGFjZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0Ll9zY3JvbGwoKTtcbiAgICAgIH0pLm9uKCdyZXNpemUnICsgdGhpcy5zLm5hbWVzcGFjZSwgRGF0YVRhYmxlLnV0aWwudGhyb3R0bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0LnMucG9zaXRpb24ud2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuICAgICAgICB0aGF0LnVwZGF0ZSgpO1xuICAgICAgfSwgNTApKTtcbiAgICAgIHZhciBhdXRvSGVhZGVyID0gJCgnLmZoLWZpeGVkSGVhZGVyJyk7XG5cbiAgICAgIGlmICghdGhpcy5jLmhlYWRlck9mZnNldCAmJiBhdXRvSGVhZGVyLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmMuaGVhZGVyT2Zmc2V0ID0gYXV0b0hlYWRlci5vdXRlckhlaWdodCgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgYXV0b0Zvb3RlciA9ICQoJy5maC1maXhlZEZvb3RlcicpO1xuXG4gICAgICBpZiAoIXRoaXMuYy5mb290ZXJPZmZzZXQgJiYgYXV0b0Zvb3Rlci5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jLmZvb3Rlck9mZnNldCA9IGF1dG9Gb290ZXIub3V0ZXJIZWlnaHQoKTtcbiAgICAgIH1cblxuICAgICAgZHQub24oJ2NvbHVtbi1yZW9yZGVyLmR0LmR0ZmMgY29sdW1uLXZpc2liaWxpdHkuZHQuZHRmYyBkcmF3LmR0LmR0ZmMgY29sdW1uLXNpemluZy5kdC5kdGZjIHJlc3BvbnNpdmUtZGlzcGxheS5kdC5kdGZjJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0LnVwZGF0ZSgpO1xuICAgICAgfSk7XG4gICAgICBkdC5vbignZGVzdHJveS5kdGZjJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhhdC5jLmhlYWRlcikge1xuICAgICAgICAgIHRoYXQuX21vZGVDaGFuZ2UoJ2luLXBsYWNlJywgJ2hlYWRlcicsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoYXQuYy5mb290ZXIgJiYgdGhhdC5kb20udGZvb3QubGVuZ3RoKSB7XG4gICAgICAgICAgdGhhdC5fbW9kZUNoYW5nZSgnaW4tcGxhY2UnLCAnZm9vdGVyJywgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBkdC5vZmYoJy5kdGZjJyk7XG4gICAgICAgICQod2luZG93KS5vZmYodGhhdC5zLm5hbWVzcGFjZSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fcG9zaXRpb25zKCk7XG5cbiAgICAgIHRoaXMuX3Njcm9sbCgpO1xuICAgIH0sXG4gICAgX2Nsb25lOiBmdW5jdGlvbiBfY2xvbmUoaXRlbSwgZm9yY2UpIHtcbiAgICAgIHZhciBkdCA9IHRoaXMucy5kdDtcbiAgICAgIHZhciBpdGVtRG9tID0gdGhpcy5kb21baXRlbV07XG4gICAgICB2YXIgaXRlbUVsZW1lbnQgPSBpdGVtID09PSAnaGVhZGVyJyA/IHRoaXMuZG9tLnRoZWFkIDogdGhpcy5kb20udGZvb3Q7XG5cbiAgICAgIGlmICghZm9yY2UgJiYgaXRlbURvbS5mbG9hdGluZykge1xuICAgICAgICBpdGVtRG9tLmZsb2F0aW5nLnJlbW92ZUNsYXNzKCdmaXhlZEhlYWRlci1mbG9hdGluZyBmaXhlZEhlYWRlci1sb2NrZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpdGVtRG9tLmZsb2F0aW5nKSB7XG4gICAgICAgICAgaXRlbURvbS5wbGFjZWhvbGRlci5yZW1vdmUoKTtcblxuICAgICAgICAgIHRoaXMuX3Vuc2l6ZShpdGVtKTtcblxuICAgICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcuY2hpbGRyZW4oKS5kZXRhY2goKTtcbiAgICAgICAgICBpdGVtRG9tLmZsb2F0aW5nLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaXRlbURvbS5mbG9hdGluZyA9ICQoZHQudGFibGUoKS5ub2RlKCkuY2xvbmVOb2RlKGZhbHNlKSkuY3NzKCd0YWJsZS1sYXlvdXQnLCAnZml4ZWQnKS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJykucmVtb3ZlQXR0cignaWQnKS5hcHBlbmQoaXRlbUVsZW1lbnQpLmFwcGVuZFRvKCdib2R5Jyk7XG4gICAgICAgIGl0ZW1Eb20ucGxhY2Vob2xkZXIgPSBpdGVtRWxlbWVudC5jbG9uZShmYWxzZSk7XG4gICAgICAgIGl0ZW1Eb20ucGxhY2Vob2xkZXIuZmluZCgnKltpZF0nKS5yZW1vdmVBdHRyKCdpZCcpO1xuICAgICAgICBpdGVtRG9tLmhvc3QucHJlcGVuZChpdGVtRG9tLnBsYWNlaG9sZGVyKTtcblxuICAgICAgICB0aGlzLl9tYXRjaFdpZHRocyhpdGVtRG9tLnBsYWNlaG9sZGVyLCBpdGVtRG9tLmZsb2F0aW5nKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9tYXRjaFdpZHRoczogZnVuY3Rpb24gX21hdGNoV2lkdGhzKGZyb20sIHRvKSB7XG4gICAgICB2YXIgZ2V0ID0gZnVuY3Rpb24gZ2V0KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuICQobmFtZSwgZnJvbSkubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gJCh0aGlzKS53aWR0aCgpO1xuICAgICAgICB9KS50b0FycmF5KCk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgc2V0ID0gZnVuY3Rpb24gc2V0KG5hbWUsIHRvV2lkdGhzKSB7XG4gICAgICAgICQobmFtZSwgdG8pLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAkKHRoaXMpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdG9XaWR0aHNbaV0sXG4gICAgICAgICAgICBtaW5XaWR0aDogdG9XaWR0aHNbaV1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgdGhXaWR0aHMgPSBnZXQoJ3RoJyk7XG4gICAgICB2YXIgdGRXaWR0aHMgPSBnZXQoJ3RkJyk7XG4gICAgICBzZXQoJ3RoJywgdGhXaWR0aHMpO1xuICAgICAgc2V0KCd0ZCcsIHRkV2lkdGhzKTtcbiAgICB9LFxuICAgIF91bnNpemU6IGZ1bmN0aW9uIF91bnNpemUoaXRlbSkge1xuICAgICAgdmFyIGVsID0gdGhpcy5kb21baXRlbV0uZmxvYXRpbmc7XG5cbiAgICAgIGlmIChlbCAmJiAoaXRlbSA9PT0gJ2Zvb3RlcicgfHwgaXRlbSA9PT0gJ2hlYWRlcicgJiYgIXRoaXMucy5hdXRvV2lkdGgpKSB7XG4gICAgICAgICQoJ3RoLCB0ZCcsIGVsKS5jc3Moe1xuICAgICAgICAgIHdpZHRoOiAnJyxcbiAgICAgICAgICBtaW5XaWR0aDogJydcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGVsICYmIGl0ZW0gPT09ICdoZWFkZXInKSB7XG4gICAgICAgICQoJ3RoLCB0ZCcsIGVsKS5jc3MoJ21pbi13aWR0aCcsICcnKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9ob3Jpem9udGFsOiBmdW5jdGlvbiBfaG9yaXpvbnRhbChpdGVtLCBzY3JvbGxMZWZ0KSB7XG4gICAgICB2YXIgaXRlbURvbSA9IHRoaXMuZG9tW2l0ZW1dO1xuICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5zLnBvc2l0aW9uO1xuICAgICAgdmFyIGxhc3RTY3JvbGxMZWZ0ID0gdGhpcy5zLnNjcm9sbExlZnQ7XG5cbiAgICAgIGlmIChpdGVtRG9tLmZsb2F0aW5nICYmIGxhc3RTY3JvbGxMZWZ0W2l0ZW1dICE9PSBzY3JvbGxMZWZ0KSB7XG4gICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcuY3NzKCdsZWZ0JywgcG9zaXRpb24ubGVmdCAtIHNjcm9sbExlZnQpO1xuICAgICAgICBsYXN0U2Nyb2xsTGVmdFtpdGVtXSA9IHNjcm9sbExlZnQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBfbW9kZUNoYW5nZTogZnVuY3Rpb24gX21vZGVDaGFuZ2UobW9kZSwgaXRlbSwgZm9yY2VDaGFuZ2UpIHtcbiAgICAgIHZhciBkdCA9IHRoaXMucy5kdDtcbiAgICAgIHZhciBpdGVtRG9tID0gdGhpcy5kb21baXRlbV07XG4gICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLnMucG9zaXRpb247XG4gICAgICB2YXIgdGFibGVQYXJ0ID0gdGhpcy5kb21baXRlbSA9PT0gJ2Zvb3RlcicgPyAndGZvb3QnIDogJ3RoZWFkJ107XG4gICAgICB2YXIgZm9jdXMgPSAkLmNvbnRhaW5zKHRhYmxlUGFydFswXSwgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgPyBkb2N1bWVudC5hY3RpdmVFbGVtZW50IDogbnVsbDtcblxuICAgICAgaWYgKGZvY3VzKSB7XG4gICAgICAgIGZvY3VzLmJsdXIoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1vZGUgPT09ICdpbi1wbGFjZScpIHtcbiAgICAgICAgaWYgKGl0ZW1Eb20ucGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICBpdGVtRG9tLnBsYWNlaG9sZGVyLnJlbW92ZSgpO1xuICAgICAgICAgIGl0ZW1Eb20ucGxhY2Vob2xkZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdW5zaXplKGl0ZW0pO1xuXG4gICAgICAgIGlmIChpdGVtID09PSAnaGVhZGVyJykge1xuICAgICAgICAgIGl0ZW1Eb20uaG9zdC5wcmVwZW5kKHRhYmxlUGFydCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbURvbS5ob3N0LmFwcGVuZCh0YWJsZVBhcnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW1Eb20uZmxvYXRpbmcpIHtcbiAgICAgICAgICBpdGVtRG9tLmZsb2F0aW5nLnJlbW92ZSgpO1xuICAgICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT09ICdpbicpIHtcbiAgICAgICAgdGhpcy5fY2xvbmUoaXRlbSwgZm9yY2VDaGFuZ2UpO1xuXG4gICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcuYWRkQ2xhc3MoJ2ZpeGVkSGVhZGVyLWZsb2F0aW5nJykuY3NzKGl0ZW0gPT09ICdoZWFkZXInID8gJ3RvcCcgOiAnYm90dG9tJywgdGhpcy5jW2l0ZW0gKyAnT2Zmc2V0J10pLmNzcygnbGVmdCcsIHBvc2l0aW9uLmxlZnQgKyAncHgnKS5jc3MoJ3dpZHRoJywgcG9zaXRpb24ud2lkdGggKyAncHgnKTtcblxuICAgICAgICBpZiAoaXRlbSA9PT0gJ2Zvb3RlcicpIHtcbiAgICAgICAgICBpdGVtRG9tLmZsb2F0aW5nLmNzcygndG9wJywgJycpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT09ICdiZWxvdycpIHtcbiAgICAgICAgdGhpcy5fY2xvbmUoaXRlbSwgZm9yY2VDaGFuZ2UpO1xuXG4gICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcuYWRkQ2xhc3MoJ2ZpeGVkSGVhZGVyLWxvY2tlZCcpLmNzcygndG9wJywgcG9zaXRpb24udGZvb3RUb3AgLSBwb3NpdGlvbi50aGVhZEhlaWdodCkuY3NzKCdsZWZ0JywgcG9zaXRpb24ubGVmdCArICdweCcpLmNzcygnd2lkdGgnLCBwb3NpdGlvbi53aWR0aCArICdweCcpO1xuICAgICAgfSBlbHNlIGlmIChtb2RlID09PSAnYWJvdmUnKSB7XG4gICAgICAgIHRoaXMuX2Nsb25lKGl0ZW0sIGZvcmNlQ2hhbmdlKTtcblxuICAgICAgICBpdGVtRG9tLmZsb2F0aW5nLmFkZENsYXNzKCdmaXhlZEhlYWRlci1sb2NrZWQnKS5jc3MoJ3RvcCcsIHBvc2l0aW9uLnRib2R5VG9wKS5jc3MoJ2xlZnQnLCBwb3NpdGlvbi5sZWZ0ICsgJ3B4JykuY3NzKCd3aWR0aCcsIHBvc2l0aW9uLndpZHRoICsgJ3B4Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChmb2N1cyAmJiBmb2N1cyAhPT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmb2N1cy5mb2N1cygpO1xuICAgICAgICB9LCAxMCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucy5zY3JvbGxMZWZ0LmhlYWRlciA9IC0xO1xuICAgICAgdGhpcy5zLnNjcm9sbExlZnQuZm9vdGVyID0gLTE7XG4gICAgICB0aGlzLnNbaXRlbSArICdNb2RlJ10gPSBtb2RlO1xuICAgIH0sXG4gICAgX3Bvc2l0aW9uczogZnVuY3Rpb24gX3Bvc2l0aW9ucygpIHtcbiAgICAgIHZhciBkdCA9IHRoaXMucy5kdDtcbiAgICAgIHZhciB0YWJsZSA9IGR0LnRhYmxlKCk7XG4gICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLnMucG9zaXRpb247XG4gICAgICB2YXIgZG9tID0gdGhpcy5kb207XG4gICAgICB2YXIgdGFibGVOb2RlID0gJCh0YWJsZS5ub2RlKCkpO1xuICAgICAgdmFyIHRoZWFkID0gdGFibGVOb2RlLmNoaWxkcmVuKCd0aGVhZCcpO1xuICAgICAgdmFyIHRmb290ID0gdGFibGVOb2RlLmNoaWxkcmVuKCd0Zm9vdCcpO1xuICAgICAgdmFyIHRib2R5ID0gZG9tLnRib2R5O1xuICAgICAgcG9zaXRpb24udmlzaWJsZSA9IHRhYmxlTm9kZS5pcygnOnZpc2libGUnKTtcbiAgICAgIHBvc2l0aW9uLndpZHRoID0gdGFibGVOb2RlLm91dGVyV2lkdGgoKTtcbiAgICAgIHBvc2l0aW9uLmxlZnQgPSB0YWJsZU5vZGUub2Zmc2V0KCkubGVmdDtcbiAgICAgIHBvc2l0aW9uLnRoZWFkVG9wID0gdGhlYWQub2Zmc2V0KCkudG9wO1xuICAgICAgcG9zaXRpb24udGJvZHlUb3AgPSB0Ym9keS5vZmZzZXQoKS50b3A7XG4gICAgICBwb3NpdGlvbi50aGVhZEhlaWdodCA9IHBvc2l0aW9uLnRib2R5VG9wIC0gcG9zaXRpb24udGhlYWRUb3A7XG5cbiAgICAgIGlmICh0Zm9vdC5sZW5ndGgpIHtcbiAgICAgICAgcG9zaXRpb24udGZvb3RUb3AgPSB0Zm9vdC5vZmZzZXQoKS50b3A7XG4gICAgICAgIHBvc2l0aW9uLnRmb290Qm90dG9tID0gcG9zaXRpb24udGZvb3RUb3AgKyB0Zm9vdC5vdXRlckhlaWdodCgpO1xuICAgICAgICBwb3NpdGlvbi50Zm9vdEhlaWdodCA9IHBvc2l0aW9uLnRmb290Qm90dG9tIC0gcG9zaXRpb24udGZvb3RUb3A7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwb3NpdGlvbi50Zm9vdFRvcCA9IHBvc2l0aW9uLnRib2R5VG9wICsgdGJvZHkub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgcG9zaXRpb24udGZvb3RCb3R0b20gPSBwb3NpdGlvbi50Zm9vdFRvcDtcbiAgICAgICAgcG9zaXRpb24udGZvb3RIZWlnaHQgPSBwb3NpdGlvbi50Zm9vdFRvcDtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9zY3JvbGw6IGZ1bmN0aW9uIF9zY3JvbGwoZm9yY2VDaGFuZ2UpIHtcbiAgICAgIHZhciB3aW5kb3dUb3AgPSAkKGRvY3VtZW50KS5zY3JvbGxUb3AoKTtcbiAgICAgIHZhciB3aW5kb3dMZWZ0ID0gJChkb2N1bWVudCkuc2Nyb2xsTGVmdCgpO1xuICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5zLnBvc2l0aW9uO1xuICAgICAgdmFyIGhlYWRlck1vZGUsIGZvb3Rlck1vZGU7XG5cbiAgICAgIGlmICghdGhpcy5zLmVuYWJsZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmMuaGVhZGVyKSB7XG4gICAgICAgIGlmICghcG9zaXRpb24udmlzaWJsZSB8fCB3aW5kb3dUb3AgPD0gcG9zaXRpb24udGhlYWRUb3AgLSB0aGlzLmMuaGVhZGVyT2Zmc2V0KSB7XG4gICAgICAgICAgaGVhZGVyTW9kZSA9ICdpbi1wbGFjZSc7XG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93VG9wIDw9IHBvc2l0aW9uLnRmb290VG9wIC0gcG9zaXRpb24udGhlYWRIZWlnaHQgLSB0aGlzLmMuaGVhZGVyT2Zmc2V0KSB7XG4gICAgICAgICAgaGVhZGVyTW9kZSA9ICdpbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGVhZGVyTW9kZSA9ICdiZWxvdyc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZm9yY2VDaGFuZ2UgfHwgaGVhZGVyTW9kZSAhPT0gdGhpcy5zLmhlYWRlck1vZGUpIHtcbiAgICAgICAgICB0aGlzLl9tb2RlQ2hhbmdlKGhlYWRlck1vZGUsICdoZWFkZXInLCBmb3JjZUNoYW5nZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9ob3Jpem9udGFsKCdoZWFkZXInLCB3aW5kb3dMZWZ0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYy5mb290ZXIgJiYgdGhpcy5kb20udGZvb3QubGVuZ3RoKSB7XG4gICAgICAgIGlmICghcG9zaXRpb24udmlzaWJsZSB8fCB3aW5kb3dUb3AgKyBwb3NpdGlvbi53aW5kb3dIZWlnaHQgPj0gcG9zaXRpb24udGZvb3RCb3R0b20gKyB0aGlzLmMuZm9vdGVyT2Zmc2V0KSB7XG4gICAgICAgICAgZm9vdGVyTW9kZSA9ICdpbi1wbGFjZSc7XG4gICAgICAgIH0gZWxzZSBpZiAocG9zaXRpb24ud2luZG93SGVpZ2h0ICsgd2luZG93VG9wID4gcG9zaXRpb24udGJvZHlUb3AgKyBwb3NpdGlvbi50Zm9vdEhlaWdodCArIHRoaXMuYy5mb290ZXJPZmZzZXQpIHtcbiAgICAgICAgICBmb290ZXJNb2RlID0gJ2luJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb290ZXJNb2RlID0gJ2Fib3ZlJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmb3JjZUNoYW5nZSB8fCBmb290ZXJNb2RlICE9PSB0aGlzLnMuZm9vdGVyTW9kZSkge1xuICAgICAgICAgIHRoaXMuX21vZGVDaGFuZ2UoZm9vdGVyTW9kZSwgJ2Zvb3RlcicsIGZvcmNlQ2hhbmdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2hvcml6b250YWwoJ2Zvb3RlcicsIHdpbmRvd0xlZnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIEZpeGVkSGVhZGVyLnZlcnNpb24gPSBcIjMuMS40XCI7XG4gIEZpeGVkSGVhZGVyLmRlZmF1bHRzID0ge1xuICAgIGhlYWRlcjogdHJ1ZSxcbiAgICBmb290ZXI6IGZhbHNlLFxuICAgIGhlYWRlck9mZnNldDogMCxcbiAgICBmb290ZXJPZmZzZXQ6IDBcbiAgfTtcbiAgJC5mbi5kYXRhVGFibGUuRml4ZWRIZWFkZXIgPSBGaXhlZEhlYWRlcjtcbiAgJC5mbi5EYXRhVGFibGUuRml4ZWRIZWFkZXIgPSBGaXhlZEhlYWRlcjtcbiAgJChkb2N1bWVudCkub24oJ2luaXQuZHQuZHRmaCcsIGZ1bmN0aW9uIChlLCBzZXR0aW5ncywganNvbikge1xuICAgIGlmIChlLm5hbWVzcGFjZSAhPT0gJ2R0Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBpbml0ID0gc2V0dGluZ3Mub0luaXQuZml4ZWRIZWFkZXI7XG4gICAgdmFyIGRlZmF1bHRzID0gRGF0YVRhYmxlLmRlZmF1bHRzLmZpeGVkSGVhZGVyO1xuXG4gICAgaWYgKChpbml0IHx8IGRlZmF1bHRzKSAmJiAhc2V0dGluZ3MuX2ZpeGVkSGVhZGVyKSB7XG4gICAgICB2YXIgb3B0cyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgaW5pdCk7XG5cbiAgICAgIGlmIChpbml0ICE9PSBmYWxzZSkge1xuICAgICAgICBuZXcgRml4ZWRIZWFkZXIoc2V0dGluZ3MsIG9wdHMpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIERhdGFUYWJsZS5BcGkucmVnaXN0ZXIoJ2ZpeGVkSGVhZGVyKCknLCBmdW5jdGlvbiAoKSB7fSk7XG4gIERhdGFUYWJsZS5BcGkucmVnaXN0ZXIoJ2ZpeGVkSGVhZGVyLmFkanVzdCgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIHZhciBmaCA9IGN0eC5fZml4ZWRIZWFkZXI7XG5cbiAgICAgIGlmIChmaCkge1xuICAgICAgICBmaC51cGRhdGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIERhdGFUYWJsZS5BcGkucmVnaXN0ZXIoJ2ZpeGVkSGVhZGVyLmVuYWJsZSgpJywgZnVuY3Rpb24gKGZsYWcpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICB2YXIgZmggPSBjdHguX2ZpeGVkSGVhZGVyO1xuICAgICAgZmxhZyA9IGZsYWcgIT09IHVuZGVmaW5lZCA/IGZsYWcgOiB0cnVlO1xuXG4gICAgICBpZiAoZmggJiYgZmxhZyAhPT0gZmgucy5lbmFibGUpIHtcbiAgICAgICAgZmguZW5hYmxlKGZsYWcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRIZWFkZXIuZGlzYWJsZSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIHZhciBmaCA9IGN0eC5fZml4ZWRIZWFkZXI7XG5cbiAgICAgIGlmIChmaCAmJiBmaC5zLmVuYWJsZSkge1xuICAgICAgICBmaC5lbmFibGUoZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgJC5lYWNoKFsnaGVhZGVyJywgJ2Zvb3RlciddLCBmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICBEYXRhVGFibGUuQXBpLnJlZ2lzdGVyKCdmaXhlZEhlYWRlci4nICsgZWwgKyAnT2Zmc2V0KCknLCBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gICAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGN0eC5sZW5ndGggJiYgY3R4WzBdLl9maXhlZEhlYWRlciA/IGN0eFswXS5fZml4ZWRIZWFkZXJbZWwgKyAnT2Zmc2V0J10oKSA6IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgICB2YXIgZmggPSBjdHguX2ZpeGVkSGVhZGVyO1xuXG4gICAgICAgIGlmIChmaCkge1xuICAgICAgICAgIGZoW2VsICsgJ09mZnNldCddKG9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIEZpeGVkSGVhZGVyO1xufSk7Il19
