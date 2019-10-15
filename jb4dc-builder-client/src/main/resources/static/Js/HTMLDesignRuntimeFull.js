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
  Initialization: function Initialization(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);
    this._$RendererToElem = $("#" + this._Prop_Config.RendererToId);

    this._LoadHTMLToEl();
  },
  _RendererChainIsCompleted: true,
  _RendererDataChainIsCompleted: true,
  _LoadHTMLToEl: function _LoadHTMLToEl() {
    var url = BaseUtility.GetRootPath() + "/Rest/Builder/RunTime/FormRuntime/LoadHTML";

    if (this._Prop_Config.IsPreview) {
      url = BaseUtility.GetRootPath() + "/Rest/Builder/RunTime/FormRuntime/LoadHTMLForPreView";
    }

    RuntimeGeneralInstance.LoadHtmlDesignContent(url, this._Prop_Config.RendererTo, {
      formId: this._Prop_Config.FormId,
      recordId: this._Prop_Config.RecordId,
      buttonId: this._Prop_Config.ButtonId
    }, function (result) {
      console.log("加载预览窗体成功!!");
      console.log(result);
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
    }, this);
  },
  IsPreview: function IsPreview() {
    return this._Prop_Config.IsPreview;
  },
  GetOriginalFormDataRelation: function GetOriginalFormDataRelation() {
    return JsonUtility.StringToJson(this._FormPO.formDataRelation);
  },
  GetOperationType: function GetOperationType() {
    return this._Prop_Config.OperationType;
  },
  IsAddOperation: function IsAddOperation() {
    return this.GetOperationType() == this.OperationAdd;
  },
  IsUpdateOperation: function IsUpdateOperation() {
    return this.GetOperationType() == this.OperationUpdate;
  },
  IsViewOperation: function IsViewOperation() {
    return this.GetOperationType() == this.OperationView;
  },
  SerializationFormData: function SerializationFormData() {
    var formRecordComplexPo = {
      id: this._Prop_Config.RecordId,
      formId: this._Prop_Config.FormId,
      buttonId: this._Prop_Config.ButtonId,
      formRecordDataRelationPOList: null,
      exData: null
    };
    var originalFormDataRelation = this.GetOriginalFormDataRelation();
    console.log(originalFormDataRelation);

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

        singleRelation.oneDataRecord = oneRowRecord;
      } else {}
    }

    formRecordComplexPo.formRecordDataRelationPOList = originalFormDataRelation;
    return formRecordComplexPo;
  },
  DeSerializationFormData: function DeSerializationFormData(formRecordComplexPo) {
    VirtualBodyControl.RendererDataChain({
      listEntity: result.data,
      sourceHTML: result.data.formHtmlRuntime,
      $rootElem: this._$RendererToElem,
      $parentControlElem: this._$RendererToElem,
      $singleControlElem: this._$RendererToElem,
      formRuntimeInstance: this
    });
  },
  GetRelationPOById: function GetRelationPOById(id) {
    return ArrayUtility.WhereSingle(this._FormDataRelationList, function (po) {
      return po.id == id;
    });
  },
  GetRelationPOByTableName: function GetRelationPOByTableName(tableName) {
    return ArrayUtility.WhereSingle(this._FormDataRelationList, function (po) {
      return po.tableName == tableName;
    });
  },
  GetRelationPOBySingleName: function GetRelationPOBySingleName(singleName) {
    return ArrayUtility.WhereSingle(this._FormDataRelationList, function (po) {
      return po.singleName == singleName;
    });
  },
  Set1To1DataRecord: function Set1To1DataRecord(po, data) {
    po.oneDataRecord = data;
    return po;
  },
  Get1To1DataRecord: function Get1To1DataRecord(po) {
    return po.oneDataRecord;
  },
  Set1ToNDataRecord: function Set1ToNDataRecord(po, arrayData) {
    po.listDataRecord = arrayData;
    return po;
  },
  Get1ToNDataRecord: function Get1ToNDataRecord(po) {
    return po.listDataRecord;
  },
  FindFieldPOByRelationPO: function FindFieldPOByRelationPO(relationPO, fieldName) {
    var oneDataRecord = FormRuntime.Get1To1DataRecord(relationPO);
    var fieldPO = ArrayUtility.WhereSingle(oneDataRecord, function (item) {
      return item.fieldName == fieldName;
    });

    if (fieldPO) {
      return fieldPO;
    } else {
      DialogUtility.AlertText("FormRuntime.FindFieldPOByRelationPO:找不到字段" + fieldName + "的数据值!");
    }
  },
  FindIdFieldPOByRelationPO: function FindIdFieldPOByRelationPO(relationPO) {
    return this.FindFieldPOByRelationPO(relationPO, "ID");
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
  LoadHtmlDesignContent: function LoadHtmlDesignContent(url, appendToElemId, params, callback, sender) {
    jQuery.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: params
    }).done(function (result) {
      callback.call(sender, result);
    }).always(callback && function (jqXHR, status) {});
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
  SaveControlNewInstanceToPool: function SaveControlNewInstanceToPool($elem, instance) {
    var instanceName = $elem.attr("client_resolve") + "_" + StringUtility.GuidSplit("");
    $elem.attr("client_instance_name", instanceName);
    this._InstanceMap[instanceName] = instance;
    return instanceName;
  },
  ElemIsInstance: function ElemIsInstance($elem) {
    if (this.GetElemInstance($elem)) {
      return true;
    }

    return false;
  },
  GetControlInstanceByElem: function GetControlInstanceByElem($elem) {
    var instanceName = "";

    if ($elem.attr("client_instance_name") && $elem.attr("client_instance_name").length > 0) {
      instanceName = $elem.attr("client_instance_name");
    } else {
      instanceName = $elem.attr("client_resolve");
    }

    return this.GetInstance(instanceName);
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
        var clientResolveName = $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
        var instance = HTMLControl.GetInstance(clientResolveName);

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
        var clientResolveInstanceName = $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
        var instance = HTMLControl.GetInstance(clientResolveInstanceName);
        instance.RendererDataChain(_cloneRendererDataChainParas);
      } else {
        HTMLControl.RendererDataChain(_cloneRendererDataChainParas);
      }
    }
  },
  GetValue: function GetValue($elem, originalData, paras) {
    originalData.value = $elem.val();
    return originalData;
  },
  SetValue: function SetValue($elem, originalData, paras) {
    $elem.val(originalData.value);
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
  GetValue: HTMLControl.GetValue,
  SetValue: HTMLControl.SetValue
};
"use strict";

var WFDCT_SimpleLabel = {
  RendererChain: HTMLControl.RendererChain,
  RendererDataChain: HTMLControl.RendererDataChain
};
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var WFDCT_SubFormListContainer = _defineProperty({
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
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    this._$SingleControlElem = $singleControlElem;
    this._$TableElem = this._$SingleControlElem.find("table");
    this._$TableBodyElem = this._$TableElem.find("tbody");
    this._$TableHeadElem = this._$TableElem.find("thead");
    this._EditInRow = $singleControlElem.attr("editinrow") == "false" ? false : true;
    this._FormRuntimeHost = _rendererChainParas.formRuntimeInstance;
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
  RendererDataChain: HTMLControl.RendererDataChain,
  AddEvent: function AddEvent(sender) {
    var $hostElem = sender.data.hostElem;
    var selfObj = sender.data.selfObj;
    var instanceName = sender.data.instanceName;

    if (!selfObj._EditInRow) {
      selfObj.Dialog_Add(sender, $hostElem, sender.data._rendererChainParas, instanceName);
    } else {
      selfObj.InnerRow_Add(sender, $hostElem, sender.data._rendererChainParas, instanceName);
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
  CreateIdFieldInOneDataRecord: function CreateIdFieldInOneDataRecord(oneDataRecord, idValue) {
    var idField = JsonUtility.CloneSimple(oneDataRecord[0]);
    idField.fieldName = "ID";

    if (idValue) {
      idField.value = idValue;
    } else {
      idField.value = StringUtility.Guid();
    }

    oneDataRecord.push(idField);
  },
  GetRowId: function GetRowId($tr) {
    var id = $tr.attr("tr_record_id");
    return id;
  },
  SetRowId: function SetRowId($tr, relationPO) {
    $tr.attr("tr_record_id", FormRuntime.FindIdFieldPOByRelationPO(relationPO).value);
  },
  SetRowData: function SetRowData($tr, relationPO) {
    $tr.attr("tr_record_data", JsonUtility.JsonToString(relationPO));
  },
  GetRowData: function GetRowData($tr) {
    var json = $tr.attr("tr_record_data");
    return JsonUtility.StringToJson(json);
  },
  RendererRow: function RendererRow(relationPO, $tr) {
    if (this._EditInRow) {
      this.InnerRow_ToViewStatus(relationPO, $tr);
    } else {}

    this.SetRowId($tr, relationPO);
    this.SetRowData($tr, relationPO);
  },
  TryGetRelationPO: function TryGetRelationPO() {
    var bindDataSource = this.TryGetBindDataSourceAttr();

    if (this._po) {
      return JsonUtility.CloneSimple(this._po);
    }

    var po = null;

    if (bindDataSource == "autoTesting") {
      var bindTableName = this.TryGetInnerControlBindTableName();
      po = this._FormRuntimeHost.GetRelationPOByTableName(bindTableName);

      if (po == null) {
        DialogUtility.AlertText("WFDCT_SubFormListContainer.TryGetRelationPO:通过内部控件绑定的表找不到具体的数据关联实体！");
      }
    } else {
      po = this._FormRuntimeHost.GetRelationPOById(bindDataSource);

      if (po == null) {
        DialogUtility.AlertText("WFDCT_SubFormListContainer.TryGetRelationPO:通过ID" + bindDataSource + "找不到具体的数据关联实体！");
      }
    }

    this._po = po;
    return JsonUtility.CloneSimple(this._po);
  },
  TryGetInnerControlBindTableName: function TryGetInnerControlBindTableName() {
    var controls = HTMLControl.FindALLControls(this._$SingleControlElem);
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
  InnerRow_Add: function InnerRow_Add(sender, $hostElem, _rendererChainParas, instanceName) {
    this.InnerRow_CompletedLastEdit();

    var $tr = this._$TemplateTableRow.clone();

    var lastOperationTd = $("<td><div class='sflt-td-operation-outer-wrap'></div></td>");
    var lastOperationOuterDiv = lastOperationTd.find("div");
    var btn_operation_del = $("<div title='删除' class='sflt-td-operation-del'></div>");
    btn_operation_del.bind("click", {
      hostElem: $hostElem,
      selfObj: this
    }, function (sender) {
      var $hostElem = sender.data.hostElem;
      var selfObj = sender.data.selfObj;
      selfObj.InnerRow_Delete(sender, $hostElem, $(this), $(this).parent().parent().parent());
    });
    lastOperationOuterDiv.append(btn_operation_del);
    var btn_operation_update = $("<div title='编辑' class='sflt-td-operation-update'></div>");
    btn_operation_update.bind("click", {
      hostElem: $hostElem,
      selfObj: this
    }, function (sender) {
      var $hostElem = sender.data.hostElem;
      var selfObj = sender.data.selfObj;
      selfObj.InnerRow_ToEditStatus(sender, $hostElem, $(this), $(this).parent().parent().parent());
    });
    lastOperationOuterDiv.append(btn_operation_update);
    $tr.append(lastOperationTd);

    this._$TableBodyElem.append($tr);

    this._$LastEditRow = $tr;
  },
  InnerRow_ToEditStatus: function InnerRow_ToEditStatus(sender, $hostElem, $elem, $tr) {
    console.log(this._$SingleControlElem);
    this.InnerRow_CompletedLastEdit();
    var rowRelationPO = this.GetRowData($tr);
    var rowSpanControls = $tr.find("[is_inner_row_span='true']");

    for (var i = 0; i < rowSpanControls.length; i++) {
      var spanControl = $(rowSpanControls[i]);
      var controlId = spanControl.attr("edit_control_id");

      var editControl = this._$TemplateTableRow.find("#" + controlId).clone();

      var fieldName = HTMLControl.GetControlBindFieldName(editControl);
      var fieldPO = FormRuntime.FindFieldPOByRelationPO(rowRelationPO, fieldName);
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
        var fieldValue = FormRuntime.FindFieldPOByRelationPO(relationPO, fieldName).value;
        var txtSpan = $("<span is_inner_row_span='true' edit_control_id='" + singleControl.attr("id") + "'>" + fieldValue + "</span>");
        singleControl.before(txtSpan);
        singleControl.remove();
      }
    }

    this._$LastEditRow = null;
  },
  InnerRow_Delete: function InnerRow_Delete(sender, $hostElem, $elem, $tr) {
    this.InnerRow_CompletedLastEdit();
    $tr.remove();
  },
  InnerRow_CompletedLastEdit: function InnerRow_CompletedLastEdit() {
    if (this._$LastEditRow) {
      var controls = HTMLControl.FindALLControls(this._$LastEditRow);
      var relationPO = this.TryGetRelationPO();
      console.log(relationPO);
      var oneRowRecord = [];

      for (var i = 0; i < controls.length; i++) {
        var singleControl = $(controls[i]);
        var fieldTransferPO = HTMLControl.TryGetFieldTransferPO(singleControl, relationPO.id, relationPO.singleName, relationPO.relationType);
        oneRowRecord.push(fieldTransferPO);
      }

      var idValue = this.GetRowId(this._$LastEditRow);
      this.CreateIdFieldInOneDataRecord(oneRowRecord, idValue);
      relationPO = FormRuntime.Set1To1DataRecord(relationPO, oneRowRecord);
      this.RendererRow(relationPO, this._$LastEditRow);
      console.log(oneRowRecord);
    }
  },
  Dialog_Add: function Dialog_Add(sender, $hostElem, _rendererChainParas, instanceName) {
    var formId = $hostElem.attr("formid");
    var windowHeight = $hostElem.attr("windowheight");
    var windowWidth = $hostElem.attr("windowwidth");
    var dialogWindowTitle = $hostElem.attr("dialogwindowtitle");

    if (!dialogWindowTitle) {
      dialogWindowTitle = "应用构建系统";
    }

    var isPreview = _rendererChainParas.formRuntimeInstance.IsPreview();

    if (isPreview) {
      var url = BaseUtility.BuildView("/HTML/Builder/Form/SubFormPreview.html", {
        "FormId": formId,
        "OperationType": "add",
        "InstanceName": instanceName
      });
      DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
        title: dialogWindowTitle,
        width: windowWidth,
        height: windowHeight
      }, 1);
    }
  },
  Dialog_CompletedEdit: function Dialog_CompletedEdit(instanceName, operationType, serializationSubFormData) {
    if (this.ValidateSerializationSubFormDataEnable(serializationSubFormData)) {
      var oneDataRecord = ArrayUtility.WhereSingle(serializationSubFormData.formRecordDataRelationPOList, function (item) {
        return item.isMain == true;
      }).oneDataRecord;

      if (operationType == FormRuntime.OperationAdd) {
        console.log("如果是新产生的记录，则生成随机的主键");
        this.CreateIdFieldInOneDataRecord(oneDataRecord);
      }

      console.log(oneDataRecord);
      this.UpdateRow(oneDataRecord);
    }
  },
  Dialog_ViewRow: function Dialog_ViewRow(sender) {},
  Dialog_UpdateRow: function Dialog_UpdateRow(sender) {},
  Dialog_DelRow: function Dialog_DelRow(sender) {}
}, "Dialog_UpdateRow", function Dialog_UpdateRow() {
  var $tr = this._$TemplateTableRow.clone();

  var controls = HTMLControl.FindALLControls($tr);
  controls.each(function (i) {
    var prop = HTMLControl.GetControlProp($(this));
    var cellValue = HTMLControl.GetSerializationOneDataRecordFieldValue(oneDataRecord, prop.tableName, prop.fieldName);
    $(this).html(cellValue);
  });
  var idField = this.FindIdFieldByOneDataRecord(oneDataRecord);

  if (idField == null) {
    DialogUtility.AlertText("WFDCT_SubFormListContainer.NewRow:查找不到ID的字段！");
  }

  console.log("绑定的记录ID:" + idField.value);
  var idValue = idField.value;
  $tr.attr("record_id", idValue);
  $tr.attr("record_data", JsonUtility.JsonToString(oneDataRecord));
  var lastOperationTd = $("<td><div class='sflt-td-operation-outer-wrap'></div></td>");
  var lastOperationOuterDiv = lastOperationTd.find("div");

  if (this._Display_OPButtons_View) {
    var btn_operation_view = $("<div title='查看' class='sflt-td-operation-view'></div>");
    lastOperationOuterDiv.append(btn_operation_view);
    btn_operation_view.bind("click", {
      "tr_elem": $tr,
      "id": idValue,
      "record_data": oneDataRecord
    }, this.Dialog_ViewRow);
  }

  if (this._Display_OPButtons_Update) {
    var btn_operation_update = $("<div title='编辑' class='sflt-td-operation-update'></div>");
    lastOperationOuterDiv.append(btn_operation_update);
    btn_operation_view.bind("click", {
      "tr_elem": $tr,
      "id": idValue,
      "record_data": oneDataRecord
    }, this.Dialog_UpdateRow);
  }

  if (this._Display_OPButtons_Del) {
    var btn_operation_del = $("<div title='删除' class='sflt-td-operation-del'></div>");
    lastOperationOuterDiv.append(btn_operation_del);
    btn_operation_view.bind("click", {
      "tr_elem": $tr,
      "id": idValue,
      "record_data": oneDataRecord
    }, this.Dialog_DelRow);
  }

  $tr.append(lastOperationTd);

  this._$TableBodyElem.append($tr);
});
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
    HTMLControl.SaveControlNewInstanceToPool($singleControlElem, this);
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
    HTMLControl.SaveControlNewInstanceToPool($singleControlElem, this);
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
    HTMLControl.SaveControlNewInstanceToPool($singleControlElem, this);

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
      pageSize = _rendererDataChainParas.listEntity.listDatasetPageSize;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhdGFTZXRSdW50aW1lLmpzIiwiRm9ybVJ1bnRpbWUuanMiLCJMaXN0UnVudGltZS5qcyIsIlJ1bnRpbWVHZW5lcmFsLmpzIiwiQ29udHJvbC9IVE1MQ29udHJvbC5qcyIsIkNvbnRyb2wvVmlydHVhbEJvZHlDb250cm9sLmpzIiwiRXh0ZXJuYWwvZGF0YXRhYmxlcy5qcyIsIkNvbnRyb2wvV2ViRm9ybUNvbnRyb2wvV0ZEQ1RfRHJvcERvd25TZWxlY3QuanMiLCJDb250cm9sL1dlYkZvcm1Db250cm9sL1dGRENUX1NpbXBsZUxhYmVsLmpzIiwiQ29udHJvbC9XZWJGb3JtQ29udHJvbC9XRkRDVF9TdWJGb3JtTGlzdENvbnRhaW5lci5qcyIsIkNvbnRyb2wvV2ViRm9ybUNvbnRyb2wvV0ZEQ1RfVGV4dEJveC5qcyIsIkNvbnRyb2wvV2ViRm9ybUNvbnRyb2wvV0ZEQ1RfVGV4dERhdGVUaW1lLmpzIiwiQ29udHJvbC9XZWJMaXN0Q29udHJvbC9XTERDVF9Gb3JtQnV0dG9uLmpzIiwiQ29udHJvbC9XZWJMaXN0Q29udHJvbC9XTERDVF9MaXN0QnV0dG9uQ29udGFpbmVyLmpzIiwiQ29udHJvbC9XZWJMaXN0Q29udHJvbC9XTERDVF9MaXN0Q29tcGxleFNlYXJjaENvbnRhaW5lci5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdFNpbXBsZVNlYXJjaENvbnRhaW5lci5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdFRhYmxlQ2hlY2tCb3guanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RUYWJsZUNvbnRhaW5lci5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdFRhYmxlSW5uZXJCdXR0b25Db250YWluZXIuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RUYWJsZUlubmVyQnV0dG9uU2luZ2xlLmpzIiwiQ29udHJvbC9XZWJMaXN0Q29udHJvbC9XTERDVF9MaXN0VGFibGVMYWJlbC5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfU2VhcmNoX1RleHRCb3guanMiLCJFeHRlcm5hbC9GaXhlZENvbHVtbnMtMy4yLjUvZGF0YVRhYmxlcy5maXhlZENvbHVtbnMuanMiLCJFeHRlcm5hbC9GaXhlZEhlYWRlci0zLjEuNC9kYXRhVGFibGVzLmZpeGVkSGVhZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6N01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25XQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiSFRNTERlc2lnblJ1bnRpbWVGdWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEYXRhU2V0UnVudGltZSA9IHtcbiAgR2V0RGF0YVNldERhdGE6IGZ1bmN0aW9uIEdldERhdGFTZXREYXRhKGNvbmZpZywgZnVuYywgc2VuZGVyKSB7XG4gICAgdmFyIHNlbmREYXRhID0gSlNPTi5zdHJpbmdpZnkoY29uZmlnKTtcbiAgICBBamF4VXRpbGl0eS5Qb3N0UmVxdWVzdEJvZHkoXCIvUmVzdC9CdWlsZGVyL1J1blRpbWUvRGF0YVNldFJ1bnRpbWUvR2V0RGF0YVNldERhdGFcIiwgc2VuZERhdGEsIGZ1bmN0aW9uIChnZXREYXRhU2V0UmVzdWx0KSB7XG4gICAgICBmdW5jLmNhbGwoc2VuZGVyLCBnZXREYXRhU2V0UmVzdWx0KTtcbiAgICB9LCBzZW5kZXIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRm9ybVJ1bnRpbWUgPSB7XG4gIE9wZXJhdGlvbkFkZDogXCJhZGRcIixcbiAgT3BlcmF0aW9uVXBkYXRlOiBcInVwZGF0ZVwiLFxuICBPcGVyYXRpb25WaWV3OiBcInZpZXdcIixcbiAgT3BlcmF0aW9uRGVsOiBcImRlbFwiLFxuICBfUHJvcF9TdGF0dXM6IFwiRWRpdFwiLFxuICBfUHJvcF9Db25maWc6IHtcbiAgICBSZW5kZXJlclRvSWQ6IG51bGwsXG4gICAgRm9ybUlkOiBcIlwiLFxuICAgIFJlY29yZElkOiBcIlwiLFxuICAgIEJ1dHRvbklkOiBcIlwiLFxuICAgIElzUHJldmlldzogZmFsc2UsXG4gICAgT3BlcmF0aW9uVHlwZTogXCJcIlxuICB9LFxuICBfJFJlbmRlcmVyVG9FbGVtOiBudWxsLFxuICBfRm9ybVBPOiBudWxsLFxuICBfRm9ybURhdGFSZWxhdGlvbkxpc3Q6IG51bGwsXG4gIEluaXRpYWxpemF0aW9uOiBmdW5jdGlvbiBJbml0aWFsaXphdGlvbihfY29uZmlnKSB7XG4gICAgdGhpcy5fUHJvcF9Db25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5fUHJvcF9Db25maWcsIF9jb25maWcpO1xuICAgIHRoaXMuXyRSZW5kZXJlclRvRWxlbSA9ICQoXCIjXCIgKyB0aGlzLl9Qcm9wX0NvbmZpZy5SZW5kZXJlclRvSWQpO1xuXG4gICAgdGhpcy5fTG9hZEhUTUxUb0VsKCk7XG4gIH0sXG4gIF9SZW5kZXJlckNoYWluSXNDb21wbGV0ZWQ6IHRydWUsXG4gIF9SZW5kZXJlckRhdGFDaGFpbklzQ29tcGxldGVkOiB0cnVlLFxuICBfTG9hZEhUTUxUb0VsOiBmdW5jdGlvbiBfTG9hZEhUTUxUb0VsKCkge1xuICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvUmVzdC9CdWlsZGVyL1J1blRpbWUvRm9ybVJ1bnRpbWUvTG9hZEhUTUxcIjtcblxuICAgIGlmICh0aGlzLl9Qcm9wX0NvbmZpZy5Jc1ByZXZpZXcpIHtcbiAgICAgIHVybCA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9SZXN0L0J1aWxkZXIvUnVuVGltZS9Gb3JtUnVudGltZS9Mb2FkSFRNTEZvclByZVZpZXdcIjtcbiAgICB9XG5cbiAgICBSdW50aW1lR2VuZXJhbEluc3RhbmNlLkxvYWRIdG1sRGVzaWduQ29udGVudCh1cmwsIHRoaXMuX1Byb3BfQ29uZmlnLlJlbmRlcmVyVG8sIHtcbiAgICAgIGZvcm1JZDogdGhpcy5fUHJvcF9Db25maWcuRm9ybUlkLFxuICAgICAgcmVjb3JkSWQ6IHRoaXMuX1Byb3BfQ29uZmlnLlJlY29yZElkLFxuICAgICAgYnV0dG9uSWQ6IHRoaXMuX1Byb3BfQ29uZmlnLkJ1dHRvbklkXG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgY29uc29sZS5sb2coXCLliqDovb3pooTop4jnqpfkvZPmiJDlip8hIVwiKTtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICB0aGlzLl9Gb3JtUE8gPSByZXN1bHQuZGF0YTtcbiAgICAgIHRoaXMuX0Zvcm1EYXRhUmVsYXRpb25MaXN0ID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHRoaXMuX0Zvcm1QTy5mb3JtRGF0YVJlbGF0aW9uKTtcblxuICAgICAgdGhpcy5fJFJlbmRlcmVyVG9FbGVtLmFwcGVuZChyZXN1bHQuZGF0YS5mb3JtSHRtbFJ1bnRpbWUpO1xuXG4gICAgICBWaXJ0dWFsQm9keUNvbnRyb2wuUmVuZGVyZXJDaGFpbih7XG4gICAgICAgIHBvOiByZXN1bHQuZGF0YSxcbiAgICAgICAgc291cmNlSFRNTDogcmVzdWx0LmRhdGEuZm9ybUh0bWxSdW50aW1lLFxuICAgICAgICAkcm9vdEVsZW06IHRoaXMuXyRSZW5kZXJlclRvRWxlbSxcbiAgICAgICAgJHBhcmVudENvbnRyb2xFbGVtOiB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sXG4gICAgICAgICRzaW5nbGVDb250cm9sRWxlbTogdGhpcy5fJFJlbmRlcmVyVG9FbGVtLFxuICAgICAgICBmb3JtUnVudGltZUluc3RhbmNlOiB0aGlzXG4gICAgICB9KTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgSXNQcmV2aWV3OiBmdW5jdGlvbiBJc1ByZXZpZXcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX1Byb3BfQ29uZmlnLklzUHJldmlldztcbiAgfSxcbiAgR2V0T3JpZ2luYWxGb3JtRGF0YVJlbGF0aW9uOiBmdW5jdGlvbiBHZXRPcmlnaW5hbEZvcm1EYXRhUmVsYXRpb24oKSB7XG4gICAgcmV0dXJuIEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbih0aGlzLl9Gb3JtUE8uZm9ybURhdGFSZWxhdGlvbik7XG4gIH0sXG4gIEdldE9wZXJhdGlvblR5cGU6IGZ1bmN0aW9uIEdldE9wZXJhdGlvblR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX1Byb3BfQ29uZmlnLk9wZXJhdGlvblR5cGU7XG4gIH0sXG4gIElzQWRkT3BlcmF0aW9uOiBmdW5jdGlvbiBJc0FkZE9wZXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5HZXRPcGVyYXRpb25UeXBlKCkgPT0gdGhpcy5PcGVyYXRpb25BZGQ7XG4gIH0sXG4gIElzVXBkYXRlT3BlcmF0aW9uOiBmdW5jdGlvbiBJc1VwZGF0ZU9wZXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5HZXRPcGVyYXRpb25UeXBlKCkgPT0gdGhpcy5PcGVyYXRpb25VcGRhdGU7XG4gIH0sXG4gIElzVmlld09wZXJhdGlvbjogZnVuY3Rpb24gSXNWaWV3T3BlcmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLkdldE9wZXJhdGlvblR5cGUoKSA9PSB0aGlzLk9wZXJhdGlvblZpZXc7XG4gIH0sXG4gIFNlcmlhbGl6YXRpb25Gb3JtRGF0YTogZnVuY3Rpb24gU2VyaWFsaXphdGlvbkZvcm1EYXRhKCkge1xuICAgIHZhciBmb3JtUmVjb3JkQ29tcGxleFBvID0ge1xuICAgICAgaWQ6IHRoaXMuX1Byb3BfQ29uZmlnLlJlY29yZElkLFxuICAgICAgZm9ybUlkOiB0aGlzLl9Qcm9wX0NvbmZpZy5Gb3JtSWQsXG4gICAgICBidXR0b25JZDogdGhpcy5fUHJvcF9Db25maWcuQnV0dG9uSWQsXG4gICAgICBmb3JtUmVjb3JkRGF0YVJlbGF0aW9uUE9MaXN0OiBudWxsLFxuICAgICAgZXhEYXRhOiBudWxsXG4gICAgfTtcbiAgICB2YXIgb3JpZ2luYWxGb3JtRGF0YVJlbGF0aW9uID0gdGhpcy5HZXRPcmlnaW5hbEZvcm1EYXRhUmVsYXRpb24oKTtcbiAgICBjb25zb2xlLmxvZyhvcmlnaW5hbEZvcm1EYXRhUmVsYXRpb24pO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmlnaW5hbEZvcm1EYXRhUmVsYXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzaW5nbGVSZWxhdGlvbiA9IG9yaWdpbmFsRm9ybURhdGFSZWxhdGlvbltpXTtcbiAgICAgIHZhciByZWxhdGlvblNpbmdsZU5hbWUgPSBzaW5nbGVSZWxhdGlvbi5zaW5nbGVOYW1lO1xuICAgICAgdmFyIHRhYmxlTmFtZSA9IHNpbmdsZVJlbGF0aW9uLnRhYmxlTmFtZTtcbiAgICAgIHZhciBpc01haW4gPSBzaW5nbGVSZWxhdGlvbi5wYXJlbnRJZCA9PSBcIi0xXCI7XG4gICAgICBzaW5nbGVSZWxhdGlvbi5pc01haW4gPSBpc01haW47XG5cbiAgICAgIGlmIChpc01haW4pIHtcbiAgICAgICAgc2luZ2xlUmVsYXRpb24ucmVsYXRpb25UeXBlID0gXCIxVG8xXCI7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWxhdGlvblR5cGUgPSBzaW5nbGVSZWxhdGlvbi5yZWxhdGlvblR5cGU7XG5cbiAgICAgIGlmIChyZWxhdGlvblR5cGUgPT0gXCIxVG8xXCIpIHtcbiAgICAgICAgdmFyIGNvbnRyb2xzID0gJChcIlt0YWJsZW5hbWU9J1wiICsgdGFibGVOYW1lICsgXCInXVtzZXJpYWxpemU9J3RydWUnXVwiKS5ub3QoJChcIltjb250cm9sX2NhdGVnb3J5PSdEeW5hbWljQ29udGFpbmVyJ11cIikuZmluZChcIltqYnVpbGQ0ZGNfY3VzdG9tPSd0cnVlJ11cIikpO1xuICAgICAgICB2YXIgb25lUm93UmVjb3JkID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb250cm9scy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHZhciAkY29udHJvbEVsZW0gPSAkKGNvbnRyb2xzW2pdKTtcbiAgICAgICAgICB2YXIgZmllbGRUcmFuc2ZlclBPID0gSFRNTENvbnRyb2wuVHJ5R2V0RmllbGRUcmFuc2ZlclBPKCRjb250cm9sRWxlbSwgc2luZ2xlUmVsYXRpb24uaWQsIHJlbGF0aW9uU2luZ2xlTmFtZSwgcmVsYXRpb25UeXBlKTtcbiAgICAgICAgICBvbmVSb3dSZWNvcmQucHVzaChmaWVsZFRyYW5zZmVyUE8pO1xuICAgICAgICB9XG5cbiAgICAgICAgc2luZ2xlUmVsYXRpb24ub25lRGF0YVJlY29yZCA9IG9uZVJvd1JlY29yZDtcbiAgICAgIH0gZWxzZSB7fVxuICAgIH1cblxuICAgIGZvcm1SZWNvcmRDb21wbGV4UG8uZm9ybVJlY29yZERhdGFSZWxhdGlvblBPTGlzdCA9IG9yaWdpbmFsRm9ybURhdGFSZWxhdGlvbjtcbiAgICByZXR1cm4gZm9ybVJlY29yZENvbXBsZXhQbztcbiAgfSxcbiAgRGVTZXJpYWxpemF0aW9uRm9ybURhdGE6IGZ1bmN0aW9uIERlU2VyaWFsaXphdGlvbkZvcm1EYXRhKGZvcm1SZWNvcmRDb21wbGV4UG8pIHtcbiAgICBWaXJ0dWFsQm9keUNvbnRyb2wuUmVuZGVyZXJEYXRhQ2hhaW4oe1xuICAgICAgbGlzdEVudGl0eTogcmVzdWx0LmRhdGEsXG4gICAgICBzb3VyY2VIVE1MOiByZXN1bHQuZGF0YS5mb3JtSHRtbFJ1bnRpbWUsXG4gICAgICAkcm9vdEVsZW06IHRoaXMuXyRSZW5kZXJlclRvRWxlbSxcbiAgICAgICRwYXJlbnRDb250cm9sRWxlbTogdGhpcy5fJFJlbmRlcmVyVG9FbGVtLFxuICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtOiB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sXG4gICAgICBmb3JtUnVudGltZUluc3RhbmNlOiB0aGlzXG4gICAgfSk7XG4gIH0sXG4gIEdldFJlbGF0aW9uUE9CeUlkOiBmdW5jdGlvbiBHZXRSZWxhdGlvblBPQnlJZChpZCkge1xuICAgIHJldHVybiBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUodGhpcy5fRm9ybURhdGFSZWxhdGlvbkxpc3QsIGZ1bmN0aW9uIChwbykge1xuICAgICAgcmV0dXJuIHBvLmlkID09IGlkO1xuICAgIH0pO1xuICB9LFxuICBHZXRSZWxhdGlvblBPQnlUYWJsZU5hbWU6IGZ1bmN0aW9uIEdldFJlbGF0aW9uUE9CeVRhYmxlTmFtZSh0YWJsZU5hbWUpIHtcbiAgICByZXR1cm4gQXJyYXlVdGlsaXR5LldoZXJlU2luZ2xlKHRoaXMuX0Zvcm1EYXRhUmVsYXRpb25MaXN0LCBmdW5jdGlvbiAocG8pIHtcbiAgICAgIHJldHVybiBwby50YWJsZU5hbWUgPT0gdGFibGVOYW1lO1xuICAgIH0pO1xuICB9LFxuICBHZXRSZWxhdGlvblBPQnlTaW5nbGVOYW1lOiBmdW5jdGlvbiBHZXRSZWxhdGlvblBPQnlTaW5nbGVOYW1lKHNpbmdsZU5hbWUpIHtcbiAgICByZXR1cm4gQXJyYXlVdGlsaXR5LldoZXJlU2luZ2xlKHRoaXMuX0Zvcm1EYXRhUmVsYXRpb25MaXN0LCBmdW5jdGlvbiAocG8pIHtcbiAgICAgIHJldHVybiBwby5zaW5nbGVOYW1lID09IHNpbmdsZU5hbWU7XG4gICAgfSk7XG4gIH0sXG4gIFNldDFUbzFEYXRhUmVjb3JkOiBmdW5jdGlvbiBTZXQxVG8xRGF0YVJlY29yZChwbywgZGF0YSkge1xuICAgIHBvLm9uZURhdGFSZWNvcmQgPSBkYXRhO1xuICAgIHJldHVybiBwbztcbiAgfSxcbiAgR2V0MVRvMURhdGFSZWNvcmQ6IGZ1bmN0aW9uIEdldDFUbzFEYXRhUmVjb3JkKHBvKSB7XG4gICAgcmV0dXJuIHBvLm9uZURhdGFSZWNvcmQ7XG4gIH0sXG4gIFNldDFUb05EYXRhUmVjb3JkOiBmdW5jdGlvbiBTZXQxVG9ORGF0YVJlY29yZChwbywgYXJyYXlEYXRhKSB7XG4gICAgcG8ubGlzdERhdGFSZWNvcmQgPSBhcnJheURhdGE7XG4gICAgcmV0dXJuIHBvO1xuICB9LFxuICBHZXQxVG9ORGF0YVJlY29yZDogZnVuY3Rpb24gR2V0MVRvTkRhdGFSZWNvcmQocG8pIHtcbiAgICByZXR1cm4gcG8ubGlzdERhdGFSZWNvcmQ7XG4gIH0sXG4gIEZpbmRGaWVsZFBPQnlSZWxhdGlvblBPOiBmdW5jdGlvbiBGaW5kRmllbGRQT0J5UmVsYXRpb25QTyhyZWxhdGlvblBPLCBmaWVsZE5hbWUpIHtcbiAgICB2YXIgb25lRGF0YVJlY29yZCA9IEZvcm1SdW50aW1lLkdldDFUbzFEYXRhUmVjb3JkKHJlbGF0aW9uUE8pO1xuICAgIHZhciBmaWVsZFBPID0gQXJyYXlVdGlsaXR5LldoZXJlU2luZ2xlKG9uZURhdGFSZWNvcmQsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5maWVsZE5hbWUgPT0gZmllbGROYW1lO1xuICAgIH0pO1xuXG4gICAgaWYgKGZpZWxkUE8pIHtcbiAgICAgIHJldHVybiBmaWVsZFBPO1xuICAgIH0gZWxzZSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIkZvcm1SdW50aW1lLkZpbmRGaWVsZFBPQnlSZWxhdGlvblBPOuaJvuS4jeWIsOWtl+autVwiICsgZmllbGROYW1lICsgXCLnmoTmlbDmja7lgLwhXCIpO1xuICAgIH1cbiAgfSxcbiAgRmluZElkRmllbGRQT0J5UmVsYXRpb25QTzogZnVuY3Rpb24gRmluZElkRmllbGRQT0J5UmVsYXRpb25QTyhyZWxhdGlvblBPKSB7XG4gICAgcmV0dXJuIHRoaXMuRmluZEZpZWxkUE9CeVJlbGF0aW9uUE8ocmVsYXRpb25QTywgXCJJRFwiKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIExpc3RSdW50aW1lID0ge1xuICBfUHJvcF9TdGF0dXM6IFwiRWRpdFwiLFxuICBfUHJvcF9Db25maWc6IHtcbiAgICBSZW5kZXJlclRvSWQ6IG51bGwsXG4gICAgTGlzdElkOiBcIlwiLFxuICAgIElzUHJldmlldzogZmFsc2VcbiAgfSxcbiAgXyRSZW5kZXJlclRvRWxlbTogbnVsbCxcbiAgSW5pdGlhbGl6YXRpb246IGZ1bmN0aW9uIEluaXRpYWxpemF0aW9uKF9jb25maWcpIHtcbiAgICB0aGlzLl9Qcm9wX0NvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLl9Qcm9wX0NvbmZpZywgX2NvbmZpZyk7XG4gICAgdGhpcy5fJFJlbmRlcmVyVG9FbGVtID0gJChcIiNcIiArIHRoaXMuX1Byb3BfQ29uZmlnLlJlbmRlcmVyVG9JZCk7XG5cbiAgICB0aGlzLl9Mb2FkSFRNTFRvRWwoKTtcbiAgfSxcbiAgX1JlbmRlcmVyQ2hhaW5Jc0NvbXBsZXRlZDogdHJ1ZSxcbiAgX1JlbmRlcmVyRGF0YUNoYWluSXNDb21wbGV0ZWQ6IHRydWUsXG4gIF9Mb2FkSFRNTFRvRWw6IGZ1bmN0aW9uIF9Mb2FkSFRNTFRvRWwoKSB7XG4gICAgUnVudGltZUdlbmVyYWxJbnN0YW5jZS5Mb2FkSHRtbERlc2lnbkNvbnRlbnQoQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1Jlc3QvQnVpbGRlci9SdW5UaW1lL0xpc3RSdW50aW1lL0xvYWRIVE1MP2xpc3RJZD1cIiArIHRoaXMuX1Byb3BfQ29uZmlnLkxpc3RJZCwgdGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUbywge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIHRoaXMuXyRSZW5kZXJlclRvRWxlbS5hcHBlbmQocmVzdWx0LmRhdGEubGlzdEh0bWxSdW50aW1lKTtcblxuICAgICAgdGhpcy5fJFJlbmRlcmVyVG9FbGVtLmFwcGVuZChyZXN1bHQuZGF0YS5saXN0SnNSdW50aW1lKTtcblxuICAgICAgaWYgKHR5cGVvZiBCdWlsZGVyTGlzdFBhZ2VSdW50aW1lSW5zdGFuY2UuUGFnZVJlYWR5ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBCdWlsZGVyTGlzdFBhZ2VSdW50aW1lSW5zdGFuY2UuUGFnZVJlYWR5KCk7XG4gICAgICB9XG5cbiAgICAgIFZpcnR1YWxCb2R5Q29udHJvbC5SZW5kZXJlckNoYWluKHtcbiAgICAgICAgcG86IHJlc3VsdC5kYXRhLFxuICAgICAgICBzb3VyY2VIVE1MOiByZXN1bHQuZGF0YS5saXN0SHRtbFJ1bnRpbWUsXG4gICAgICAgICRyb290RWxlbTogdGhpcy5fJFJlbmRlcmVyVG9FbGVtLFxuICAgICAgICAkcGFyZW50Q29udHJvbEVsZW06IHRoaXMuXyRSZW5kZXJlclRvRWxlbSxcbiAgICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtOiB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sXG4gICAgICAgIGxpc3RSdW50aW1lSW5zdGFuY2U6IHRoaXNcbiAgICAgIH0pO1xuICAgICAgdmFyIFJlbmRlcmVyQ2hhaW5Db21wbGV0ZU9iaiA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChfc2VsZi5fUmVuZGVyZXJDaGFpbklzQ29tcGxldGVkKSB7XG4gICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwoUmVuZGVyZXJDaGFpbkNvbXBsZXRlT2JqKTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgQnVpbGRlckxpc3RQYWdlUnVudGltZUluc3RhbmNlLlJlbmRlcmVyQ2hhaW5Db21wbGV0ZWQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBCdWlsZGVyTGlzdFBhZ2VSdW50aW1lSW5zdGFuY2UuUmVuZGVyZXJDaGFpbkNvbXBsZXRlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgNTAwKTtcbiAgICAgIHZhciB0b3BEYXRhU2V0SWQgPSByZXN1bHQuZGF0YS5saXN0RGF0YXNldElkO1xuICAgICAgVmlydHVhbEJvZHlDb250cm9sLlJlbmRlcmVyRGF0YUNoYWluKHtcbiAgICAgICAgcG86IHJlc3VsdC5kYXRhLFxuICAgICAgICBzb3VyY2VIVE1MOiByZXN1bHQuZGF0YS5saXN0SHRtbFJ1bnRpbWUsXG4gICAgICAgICRyb290RWxlbTogdGhpcy5fJFJlbmRlcmVyVG9FbGVtLFxuICAgICAgICAkcGFyZW50Q29udHJvbEVsZW06IHRoaXMuXyRSZW5kZXJlclRvRWxlbSxcbiAgICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtOiB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sXG4gICAgICAgIHRvcERhdGFTZXRJZDogdG9wRGF0YVNldElkLFxuICAgICAgICBsaXN0UnVudGltZUluc3RhbmNlOiB0aGlzXG4gICAgICB9KTtcbiAgICAgIHZhciBSZW5kZXJlckRhdGFDaGFpbkNvbXBsZXRlT2JqID0gd2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKF9zZWxmLl9SZW5kZXJlckRhdGFDaGFpbklzQ29tcGxldGVkKSB7XG4gICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwoUmVuZGVyZXJEYXRhQ2hhaW5Db21wbGV0ZU9iaik7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIEJ1aWxkZXJMaXN0UGFnZVJ1bnRpbWVJbnN0YW5jZS5SZW5kZXJlckRhdGFDaGFpbkNvbXBsZXRlZCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIEJ1aWxkZXJMaXN0UGFnZVJ1bnRpbWVJbnN0YW5jZS5SZW5kZXJlckRhdGFDaGFpbkNvbXBsZXRlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgNzAwKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgSXNQcmV2aWV3OiBmdW5jdGlvbiBJc1ByZXZpZXcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX1Byb3BfQ29uZmlnLklzUHJldmlldztcbiAgfVxufTtcbnZhciBCdWlsZGVyTGlzdFBhZ2VSdW50aW1lSW5zdGFuY2UgPSB7XG4gIFBhZ2VSZWFkeTogZnVuY3Rpb24gUGFnZVJlYWR5KCkge1xuICAgIGNvbnNvbGUubG9nKFwi6aG16Z2i5Yqg6L29aHRtbOWujOaIkDFcIik7XG4gIH0sXG4gIFJlbmRlcmVyQ2hhaW5Db21wbGV0ZWQ6IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW5Db21wbGV0ZWQoKSB7XG4gICAgY29uc29sZS5sb2coXCLlrqLmiLfnq6/mjqfku7bmuLLmn5PlrozmiJBcIik7XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluQ29tcGxldGVkOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbkNvbXBsZXRlZCgpIHtcbiAgICBjb25zb2xlLmxvZyhcIuWuouaIt+err+aOp+S7tua4suafk+W5tue7keWumuWujOaVsOaNrlwiKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFJ1bnRpbWVHZW5lcmFsSW5zdGFuY2UgPSB7XG4gIExvYWRIdG1sRGVzaWduQ29udGVudDogZnVuY3Rpb24gTG9hZEh0bWxEZXNpZ25Db250ZW50KHVybCwgYXBwZW5kVG9FbGVtSWQsIHBhcmFtcywgY2FsbGJhY2ssIHNlbmRlcikge1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICBkYXRhOiBwYXJhbXNcbiAgICB9KS5kb25lKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwoc2VuZGVyLCByZXN1bHQpO1xuICAgIH0pLmFsd2F5cyhjYWxsYmFjayAmJiBmdW5jdGlvbiAoanFYSFIsIHN0YXR1cykge30pO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgSFRNTENvbnRyb2xBdHRycyA9IHtcbiAgSkJVSUxENERDX0NVU1RPTTogXCJqYnVpbGQ0ZGNfY3VzdG9tXCIsXG4gIFNFTEVDVEVEX0pCVUlMRDREQ19DVVNUT006IFwiW2pidWlsZDRkY19jdXN0b209dHJ1ZV1cIixcbiAgQ0xJRU5UX1JFU09MVkU6IFwiY2xpZW50X3Jlc29sdmVcIlxufTtcbnZhciBIVE1MQ29udHJvbCA9IHtcbiAgX0luc3RhbmNlTWFwOiB7fSxcbiAgR2V0SW5zdGFuY2U6IGZ1bmN0aW9uIEdldEluc3RhbmNlKG5hbWUpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fSW5zdGFuY2VNYXApIHtcbiAgICAgIGlmIChrZXkgPT0gbmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fSW5zdGFuY2VNYXBba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaW5zdGFuY2UgPSBldmFsKG5hbWUpO1xuICAgIHRoaXMuX0luc3RhbmNlTWFwW25hbWVdID0gaW5zdGFuY2U7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9LFxuICBTYXZlQ29udHJvbE5ld0luc3RhbmNlVG9Qb29sOiBmdW5jdGlvbiBTYXZlQ29udHJvbE5ld0luc3RhbmNlVG9Qb29sKCRlbGVtLCBpbnN0YW5jZSkge1xuICAgIHZhciBpbnN0YW5jZU5hbWUgPSAkZWxlbS5hdHRyKFwiY2xpZW50X3Jlc29sdmVcIikgKyBcIl9cIiArIFN0cmluZ1V0aWxpdHkuR3VpZFNwbGl0KFwiXCIpO1xuICAgICRlbGVtLmF0dHIoXCJjbGllbnRfaW5zdGFuY2VfbmFtZVwiLCBpbnN0YW5jZU5hbWUpO1xuICAgIHRoaXMuX0luc3RhbmNlTWFwW2luc3RhbmNlTmFtZV0gPSBpbnN0YW5jZTtcbiAgICByZXR1cm4gaW5zdGFuY2VOYW1lO1xuICB9LFxuICBFbGVtSXNJbnN0YW5jZTogZnVuY3Rpb24gRWxlbUlzSW5zdGFuY2UoJGVsZW0pIHtcbiAgICBpZiAodGhpcy5HZXRFbGVtSW5zdGFuY2UoJGVsZW0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIEdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbTogZnVuY3Rpb24gR2V0Q29udHJvbEluc3RhbmNlQnlFbGVtKCRlbGVtKSB7XG4gICAgdmFyIGluc3RhbmNlTmFtZSA9IFwiXCI7XG5cbiAgICBpZiAoJGVsZW0uYXR0cihcImNsaWVudF9pbnN0YW5jZV9uYW1lXCIpICYmICRlbGVtLmF0dHIoXCJjbGllbnRfaW5zdGFuY2VfbmFtZVwiKS5sZW5ndGggPiAwKSB7XG4gICAgICBpbnN0YW5jZU5hbWUgPSAkZWxlbS5hdHRyKFwiY2xpZW50X2luc3RhbmNlX25hbWVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluc3RhbmNlTmFtZSA9ICRlbGVtLmF0dHIoXCJjbGllbnRfcmVzb2x2ZVwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5HZXRJbnN0YW5jZShpbnN0YW5jZU5hbWUpO1xuICB9LFxuICBSZW5kZXJlckNoYWluUGFyYXM6IHtcbiAgICBsaXN0RW50aXR5OiBudWxsLFxuICAgIHNvdXJjZUhUTUw6IG51bGwsXG4gICAgJHJvb3RFbGVtOiBudWxsLFxuICAgICRwYXJlbnRDb250cm9sRWxlbTogbnVsbCxcbiAgICAkc2luZ2xlQ29udHJvbEVsZW06IG51bGxcbiAgfSxcbiAgUmVuZGVyZXJEYXRhQ2hhaW5QYXJhczoge1xuICAgIGxpc3RFbnRpdHk6IG51bGwsXG4gICAgc291cmNlSFRNTDogbnVsbCxcbiAgICAkcm9vdEVsZW06IG51bGwsXG4gICAgJHBhcmVudENvbnRyb2xFbGVtOiBudWxsLFxuICAgICRzaW5nbGVDb250cm9sRWxlbTogbnVsbCxcbiAgICB0b3BEYXRhU2V0OiBudWxsXG4gIH0sXG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNpbmdsZUNvbnRyb2xFbGVtLmNoaWxkcmVuKCkubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciAkY2hpbGRTaW5nbGVFbGVtID0gJCgkc2luZ2xlQ29udHJvbEVsZW0uY2hpbGRyZW4oKVtpXSk7XG4gICAgICB2YXIgX2Nsb25lUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcyA9IHt9O1xuICAgICAgSnNvblV0aWxpdHkuU2ltcGxlQ2xvbmVBdHRyKF9jbG9uZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMsIF9yZW5kZXJlckNoYWluUGFyYXMpO1xuICAgICAgX2Nsb25lUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW0gPSAkY2hpbGRTaW5nbGVFbGVtO1xuXG4gICAgICBpZiAoJGNoaWxkU2luZ2xlRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuSkJVSUxENERDX0NVU1RPTSkgPT0gXCJ0cnVlXCIgJiYgJGNoaWxkU2luZ2xlRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuQ0xJRU5UX1JFU09MVkUpKSB7XG4gICAgICAgIHZhciBjbGllbnRSZXNvbHZlTmFtZSA9ICRjaGlsZFNpbmdsZUVsZW0uYXR0cihIVE1MQ29udHJvbEF0dHJzLkNMSUVOVF9SRVNPTFZFKTtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gSFRNTENvbnRyb2wuR2V0SW5zdGFuY2UoY2xpZW50UmVzb2x2ZU5hbWUpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2UuSW5pdGlhbGl6ZSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBpbnN0YW5jZS5Jbml0aWFsaXplKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnN0YW5jZS5SZW5kZXJlckNoYWluKF9jbG9uZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpbihfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbihfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzaW5nbGVDb250cm9sRWxlbS5jaGlsZHJlbigpLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJGNoaWxkU2luZ2xlRWxlbSA9ICQoJHNpbmdsZUNvbnRyb2xFbGVtLmNoaWxkcmVuKClbaV0pO1xuICAgICAgdmFyIF9jbG9uZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMgPSB7fTtcbiAgICAgIEpzb25VdGlsaXR5LlNpbXBsZUNsb25lQXR0cihfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzLCBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcyk7XG4gICAgICBfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbSA9ICRjaGlsZFNpbmdsZUVsZW07XG5cbiAgICAgIGlmICgkY2hpbGRTaW5nbGVFbGVtLmF0dHIoSFRNTENvbnRyb2xBdHRycy5KQlVJTEQ0RENfQ1VTVE9NKSA9PSBcInRydWVcIiAmJiAkY2hpbGRTaW5nbGVFbGVtLmF0dHIoSFRNTENvbnRyb2xBdHRycy5DTElFTlRfUkVTT0xWRSkpIHtcbiAgICAgICAgdmFyIGNsaWVudFJlc29sdmVJbnN0YW5jZU5hbWUgPSAkY2hpbGRTaW5nbGVFbGVtLmF0dHIoSFRNTENvbnRyb2xBdHRycy5DTElFTlRfUkVTT0xWRSk7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldEluc3RhbmNlKGNsaWVudFJlc29sdmVJbnN0YW5jZU5hbWUpO1xuICAgICAgICBpbnN0YW5jZS5SZW5kZXJlckRhdGFDaGFpbihfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEhUTUxDb250cm9sLlJlbmRlcmVyRGF0YUNoYWluKF9jbG9uZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgR2V0VmFsdWU6IGZ1bmN0aW9uIEdldFZhbHVlKCRlbGVtLCBvcmlnaW5hbERhdGEsIHBhcmFzKSB7XG4gICAgb3JpZ2luYWxEYXRhLnZhbHVlID0gJGVsZW0udmFsKCk7XG4gICAgcmV0dXJuIG9yaWdpbmFsRGF0YTtcbiAgfSxcbiAgU2V0VmFsdWU6IGZ1bmN0aW9uIFNldFZhbHVlKCRlbGVtLCBvcmlnaW5hbERhdGEsIHBhcmFzKSB7XG4gICAgJGVsZW0udmFsKG9yaWdpbmFsRGF0YS52YWx1ZSk7XG4gIH0sXG4gIEZpbmRBTExDb250cm9sczogZnVuY3Rpb24gRmluZEFMTENvbnRyb2xzKCRwYXJlbnQpIHtcbiAgICBpZiAoJHBhcmVudCkge1xuICAgICAgcmV0dXJuICRwYXJlbnQuZmluZChcIltqYnVpbGQ0ZGNfY3VzdG9tPSd0cnVlJ11cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuICQoXCJbamJ1aWxkNGRjX2N1c3RvbT0ndHJ1ZSddXCIpO1xuICB9LFxuICBHZXRDb250cm9sQmluZFRhYmxlTmFtZTogZnVuY3Rpb24gR2V0Q29udHJvbEJpbmRUYWJsZU5hbWUoJGNvbnRyb2xFbGVtKSB7XG4gICAgcmV0dXJuICRjb250cm9sRWxlbS5hdHRyKFwidGFibGVuYW1lXCIpO1xuICB9LFxuICBHZXRDb250cm9sQmluZEZpZWxkTmFtZTogZnVuY3Rpb24gR2V0Q29udHJvbEJpbmRGaWVsZE5hbWUoJGNvbnRyb2xFbGVtKSB7XG4gICAgcmV0dXJuICRjb250cm9sRWxlbS5hdHRyKFwiZmllbGRuYW1lXCIpO1xuICB9LFxuICBHZXRDb250cm9sUHJvcDogZnVuY3Rpb24gR2V0Q29udHJvbFByb3AoJGNvbnRyb2xFbGVtKSB7XG4gICAgdmFyIHByb3BzID0ge1xuICAgICAgc2luZ2xlTmFtZTogXCJcIixcbiAgICAgIHRhYmxlTmFtZTogXCJcIixcbiAgICAgIHRhYmxlQ2FwdGlvbjogXCJcIixcbiAgICAgIHRhYmxlSWQ6IFwiXCIsXG4gICAgICBmaWVsZFRhYmxlSWQ6IFwiXCIsXG4gICAgICBmaWVsZE5hbWU6IFwiXCIsXG4gICAgICBmaWVsZERhdGFUeXBlOiBcIlwiLFxuICAgICAgZmllbGREYXRhTGVuZ3RoOiBcIlwiLFxuICAgICAgZGVmYXVsdFR5cGU6IFwiXCIsXG4gICAgICBkZWZhdWx0VmFsdWU6IFwiXCIsXG4gICAgICBpZDogXCJcIixcbiAgICAgIHNlcmlhbGl6ZTogXCJcIixcbiAgICAgIHZhbHVlOiBcIlwiXG4gICAgfTtcblxuICAgIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9ICRjb250cm9sRWxlbS5hdHRyKFN0cmluZ1V0aWxpdHkuVG9Mb3dlckNhc2Uoa2V5KSk7XG5cbiAgICAgIGlmICghU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgcHJvcHNba2V5XSA9IHByb3BWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9wcy5maWVsZERhdGFMZW5ndGggPSAkY29udHJvbEVsZW0uYXR0cihcImZpZWxkbGVuZ3RoXCIpO1xuICAgIHJldHVybiBwcm9wcztcbiAgfSxcbiAgQnVpbGRTZXJpYWxpemF0aW9uT3JpZ2luYWxEYXRhOiBmdW5jdGlvbiBCdWlsZFNlcmlhbGl6YXRpb25PcmlnaW5hbERhdGEocHJvcHMsIHJlbGF0aW9uSWQsIHJlbGF0aW9uU2luZ2xlTmFtZSwgcmVsYXRpb25UeXBlKSB7XG4gICAgdmFyIG9yaWdpbmFsRGF0YSA9IHtcbiAgICAgIHJlbGF0aW9uSWQ6IHJlbGF0aW9uSWQsXG4gICAgICByZWxhdGlvblNpbmdsZU5hbWU6IHJlbGF0aW9uU2luZ2xlTmFtZSxcbiAgICAgIHJlbGF0aW9uVHlwZTogcmVsYXRpb25UeXBlLFxuICAgICAgc2luZ2xlTmFtZTogcHJvcHMuc2luZ2xlTmFtZSxcbiAgICAgIHRhYmxlTmFtZTogcHJvcHMudGFibGVOYW1lLFxuICAgICAgdGFibGVDYXB0aW9uOiBwcm9wcy50YWJsZUNhcHRpb24sXG4gICAgICB0YWJsZUlkOiBwcm9wcy50YWJsZUlkLFxuICAgICAgZmllbGRUYWJsZUlkOiBwcm9wcy5maWVsZFRhYmxlSWQsXG4gICAgICBmaWVsZE5hbWU6IHByb3BzLmZpZWxkTmFtZSxcbiAgICAgIGZpZWxkRGF0YVR5cGU6IHByb3BzLmZpZWxkRGF0YVR5cGUsXG4gICAgICBmaWVsZERhdGFMZW5ndGg6IHByb3BzLmZpZWxkRGF0YUxlbmd0aCxcbiAgICAgIHNlcmlhbGl6ZTogcHJvcHMuc2VyaWFsaXplLFxuICAgICAgaWQ6IHByb3BzLmlkLFxuICAgICAgZGVmYXVsdFR5cGU6IHByb3BzLmRlZmF1bHRUeXBlLFxuICAgICAgZGVmYXVsdFZhbHVlOiBwcm9wcy5kZWZhdWx0VmFsdWUsXG4gICAgICB2YWx1ZTogXCJcIixcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBtc2c6IFwiXCJcbiAgICB9O1xuICAgIHJldHVybiBvcmlnaW5hbERhdGE7XG4gIH0sXG4gIEdldFNlcmlhbGl6YXRpb25PbmVEYXRhUmVjb3JkRmllbGRWYWx1ZTogZnVuY3Rpb24gR2V0U2VyaWFsaXphdGlvbk9uZURhdGFSZWNvcmRGaWVsZFZhbHVlKG9uZURhdGFSZWNvcmQsIHRhYmxlTmFtZSwgZmllbGROYW1lKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvbmVEYXRhUmVjb3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAob25lRGF0YVJlY29yZFtpXS50YWJsZU5hbWUgPT0gdGFibGVOYW1lICYmIG9uZURhdGFSZWNvcmRbaV0uZmllbGROYW1lID09IGZpZWxkTmFtZSkge1xuICAgICAgICByZXR1cm4gb25lRGF0YVJlY29yZFtpXS52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gXCJcIjtcbiAgfSxcbiAgVHJ5R2V0RmllbGRUcmFuc2ZlclBPOiBmdW5jdGlvbiBUcnlHZXRGaWVsZFRyYW5zZmVyUE8oJGNvbnRyb2xFbGVtLCByZWxhdGlvbklkLCByZWxhdGlvblNpbmdsZU5hbWUsIHJlbGF0aW9uVHlwZSkge1xuICAgIHZhciBwcm9wcyA9IEhUTUxDb250cm9sLkdldENvbnRyb2xQcm9wKCRjb250cm9sRWxlbSk7XG4gICAgdmFyIG9yaWdpbmFsRGF0YSA9IEhUTUxDb250cm9sLkJ1aWxkU2VyaWFsaXphdGlvbk9yaWdpbmFsRGF0YShwcm9wcywgcmVsYXRpb25JZCwgcmVsYXRpb25TaW5nbGVOYW1lLCByZWxhdGlvblR5cGUpO1xuICAgIHZhciBjb250cm9sSW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sSW5zdGFuY2VCeUVsZW0oJGNvbnRyb2xFbGVtKTtcblxuICAgIGlmIChCYXNlVXRpbGl0eS5Jc0Z1bmN0aW9uKGNvbnRyb2xJbnN0YW5jZS5HZXRWYWx1ZSkpIHtcbiAgICAgIHZhciBmaWVsZFRyYW5zZmVyUE8gPSBjb250cm9sSW5zdGFuY2UuR2V0VmFsdWUoJGNvbnRyb2xFbGVtLCBvcmlnaW5hbERhdGEsIHt9KTtcblxuICAgICAgaWYgKGZpZWxkVHJhbnNmZXJQTy5zdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiBmaWVsZFRyYW5zZmVyUE87XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLmjqfku7Y6XCIgKyAkY29udHJvbEVsZW0uYXR0cihcInNpbmdsZW5hbWVcIikgKyBcIuacquWMheWQq0dldFZhbHVl55qE5pa55rOVIVwiKTtcbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBWaXJ0dWFsQm9keUNvbnRyb2wgPSB7XG4gIFJlbmRlcmVyQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckRhdGFDaGFpblxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydqcXVlcnknXSwgZnVuY3Rpb24gKCQpIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KCQsIHdpbmRvdywgZG9jdW1lbnQpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCh0eXBlb2YgZXhwb3J0cyA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKGV4cG9ydHMpKSA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb290LCAkKSB7XG4gICAgICBpZiAoIXJvb3QpIHtcbiAgICAgICAgcm9vdCA9IHdpbmRvdztcbiAgICAgIH1cblxuICAgICAgaWYgKCEkKSB7XG4gICAgICAgICQgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHJlcXVpcmUoJ2pxdWVyeScpIDogcmVxdWlyZSgnanF1ZXJ5Jykocm9vdCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWN0b3J5KCQsIHJvb3QsIHJvb3QuZG9jdW1lbnQpO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgZmFjdG9yeShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuICB9XG59KShmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBEYXRhVGFibGUgPSBmdW5jdGlvbiBEYXRhVGFibGUob3B0aW9ucykge1xuICAgIHRoaXMuJCA9IGZ1bmN0aW9uIChzU2VsZWN0b3IsIG9PcHRzKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcGkodHJ1ZSkuJChzU2VsZWN0b3IsIG9PcHRzKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fID0gZnVuY3Rpb24gKHNTZWxlY3Rvciwgb09wdHMpIHtcbiAgICAgIHJldHVybiB0aGlzLmFwaSh0cnVlKS5yb3dzKHNTZWxlY3Rvciwgb09wdHMpLmRhdGEoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5hcGkgPSBmdW5jdGlvbiAodHJhZGl0aW9uYWwpIHtcbiAgICAgIHJldHVybiB0cmFkaXRpb25hbCA/IG5ldyBfQXBpMihfZm5TZXR0aW5nc0Zyb21Ob2RlKHRoaXNbX2V4dC5pQXBpSW5kZXhdKSkgOiBuZXcgX0FwaTIodGhpcyk7XG4gICAgfTtcblxuICAgIHRoaXMuZm5BZGREYXRhID0gZnVuY3Rpb24gKGRhdGEsIHJlZHJhdykge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpO1xuICAgICAgdmFyIHJvd3MgPSAkLmlzQXJyYXkoZGF0YSkgJiYgKCQuaXNBcnJheShkYXRhWzBdKSB8fCAkLmlzUGxhaW5PYmplY3QoZGF0YVswXSkpID8gYXBpLnJvd3MuYWRkKGRhdGEpIDogYXBpLnJvdy5hZGQoZGF0YSk7XG5cbiAgICAgIGlmIChyZWRyYXcgPT09IHVuZGVmaW5lZCB8fCByZWRyYXcpIHtcbiAgICAgICAgYXBpLmRyYXcoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJvd3MuZmxhdHRlbigpLnRvQXJyYXkoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mbkFkanVzdENvbHVtblNpemluZyA9IGZ1bmN0aW9uIChiUmVkcmF3KSB7XG4gICAgICB2YXIgYXBpID0gdGhpcy5hcGkodHJ1ZSkuY29sdW1ucy5hZGp1c3QoKTtcbiAgICAgIHZhciBzZXR0aW5ncyA9IGFwaS5zZXR0aW5ncygpWzBdO1xuICAgICAgdmFyIHNjcm9sbCA9IHNldHRpbmdzLm9TY3JvbGw7XG5cbiAgICAgIGlmIChiUmVkcmF3ID09PSB1bmRlZmluZWQgfHwgYlJlZHJhdykge1xuICAgICAgICBhcGkuZHJhdyhmYWxzZSk7XG4gICAgICB9IGVsc2UgaWYgKHNjcm9sbC5zWCAhPT0gXCJcIiB8fCBzY3JvbGwuc1kgIT09IFwiXCIpIHtcbiAgICAgICAgX2ZuU2Nyb2xsRHJhdyhzZXR0aW5ncyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuZm5DbGVhclRhYmxlID0gZnVuY3Rpb24gKGJSZWRyYXcpIHtcbiAgICAgIHZhciBhcGkgPSB0aGlzLmFwaSh0cnVlKS5jbGVhcigpO1xuXG4gICAgICBpZiAoYlJlZHJhdyA9PT0gdW5kZWZpbmVkIHx8IGJSZWRyYXcpIHtcbiAgICAgICAgYXBpLmRyYXcoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5mbkNsb3NlID0gZnVuY3Rpb24gKG5Ucikge1xuICAgICAgdGhpcy5hcGkodHJ1ZSkucm93KG5UcikuY2hpbGQuaGlkZSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmZuRGVsZXRlUm93ID0gZnVuY3Rpb24gKHRhcmdldCwgY2FsbGJhY2ssIHJlZHJhdykge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpO1xuICAgICAgdmFyIHJvd3MgPSBhcGkucm93cyh0YXJnZXQpO1xuICAgICAgdmFyIHNldHRpbmdzID0gcm93cy5zZXR0aW5ncygpWzBdO1xuICAgICAgdmFyIGRhdGEgPSBzZXR0aW5ncy5hb0RhdGFbcm93c1swXVswXV07XG4gICAgICByb3dzLnJlbW92ZSgpO1xuXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBzZXR0aW5ncywgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWRyYXcgPT09IHVuZGVmaW5lZCB8fCByZWRyYXcpIHtcbiAgICAgICAgYXBpLmRyYXcoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfTtcblxuICAgIHRoaXMuZm5EZXN0cm95ID0gZnVuY3Rpb24gKHJlbW92ZSkge1xuICAgICAgdGhpcy5hcGkodHJ1ZSkuZGVzdHJveShyZW1vdmUpO1xuICAgIH07XG5cbiAgICB0aGlzLmZuRHJhdyA9IGZ1bmN0aW9uIChjb21wbGV0ZSkge1xuICAgICAgdGhpcy5hcGkodHJ1ZSkuZHJhdyhjb21wbGV0ZSk7XG4gICAgfTtcblxuICAgIHRoaXMuZm5GaWx0ZXIgPSBmdW5jdGlvbiAoc0lucHV0LCBpQ29sdW1uLCBiUmVnZXgsIGJTbWFydCwgYlNob3dHbG9iYWwsIGJDYXNlSW5zZW5zaXRpdmUpIHtcbiAgICAgIHZhciBhcGkgPSB0aGlzLmFwaSh0cnVlKTtcblxuICAgICAgaWYgKGlDb2x1bW4gPT09IG51bGwgfHwgaUNvbHVtbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGFwaS5zZWFyY2goc0lucHV0LCBiUmVnZXgsIGJTbWFydCwgYkNhc2VJbnNlbnNpdGl2ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcGkuY29sdW1uKGlDb2x1bW4pLnNlYXJjaChzSW5wdXQsIGJSZWdleCwgYlNtYXJ0LCBiQ2FzZUluc2Vuc2l0aXZlKTtcbiAgICAgIH1cblxuICAgICAgYXBpLmRyYXcoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mbkdldERhdGEgPSBmdW5jdGlvbiAoc3JjLCBjb2wpIHtcbiAgICAgIHZhciBhcGkgPSB0aGlzLmFwaSh0cnVlKTtcblxuICAgICAgaWYgKHNyYyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciB0eXBlID0gc3JjLm5vZGVOYW1lID8gc3JjLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgOiAnJztcbiAgICAgICAgcmV0dXJuIGNvbCAhPT0gdW5kZWZpbmVkIHx8IHR5cGUgPT0gJ3RkJyB8fCB0eXBlID09ICd0aCcgPyBhcGkuY2VsbChzcmMsIGNvbCkuZGF0YSgpIDogYXBpLnJvdyhzcmMpLmRhdGEoKSB8fCBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYXBpLmRhdGEoKS50b0FycmF5KCk7XG4gICAgfTtcblxuICAgIHRoaXMuZm5HZXROb2RlcyA9IGZ1bmN0aW9uIChpUm93KSB7XG4gICAgICB2YXIgYXBpID0gdGhpcy5hcGkodHJ1ZSk7XG4gICAgICByZXR1cm4gaVJvdyAhPT0gdW5kZWZpbmVkID8gYXBpLnJvdyhpUm93KS5ub2RlKCkgOiBhcGkucm93cygpLm5vZGVzKCkuZmxhdHRlbigpLnRvQXJyYXkoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mbkdldFBvc2l0aW9uID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIHZhciBhcGkgPSB0aGlzLmFwaSh0cnVlKTtcbiAgICAgIHZhciBub2RlTmFtZSA9IG5vZGUubm9kZU5hbWUudG9VcHBlckNhc2UoKTtcblxuICAgICAgaWYgKG5vZGVOYW1lID09ICdUUicpIHtcbiAgICAgICAgcmV0dXJuIGFwaS5yb3cobm9kZSkuaW5kZXgoKTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZU5hbWUgPT0gJ1REJyB8fCBub2RlTmFtZSA9PSAnVEgnKSB7XG4gICAgICAgIHZhciBjZWxsID0gYXBpLmNlbGwobm9kZSkuaW5kZXgoKTtcbiAgICAgICAgcmV0dXJuIFtjZWxsLnJvdywgY2VsbC5jb2x1bW5WaXNpYmxlLCBjZWxsLmNvbHVtbl07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICB0aGlzLmZuSXNPcGVuID0gZnVuY3Rpb24gKG5Ucikge1xuICAgICAgcmV0dXJuIHRoaXMuYXBpKHRydWUpLnJvdyhuVHIpLmNoaWxkLmlzU2hvd24oKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mbk9wZW4gPSBmdW5jdGlvbiAoblRyLCBtSHRtbCwgc0NsYXNzKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcGkodHJ1ZSkucm93KG5UcikuY2hpbGQobUh0bWwsIHNDbGFzcykuc2hvdygpLmNoaWxkKClbMF07XG4gICAgfTtcblxuICAgIHRoaXMuZm5QYWdlQ2hhbmdlID0gZnVuY3Rpb24gKG1BY3Rpb24sIGJSZWRyYXcpIHtcbiAgICAgIHZhciBhcGkgPSB0aGlzLmFwaSh0cnVlKS5wYWdlKG1BY3Rpb24pO1xuXG4gICAgICBpZiAoYlJlZHJhdyA9PT0gdW5kZWZpbmVkIHx8IGJSZWRyYXcpIHtcbiAgICAgICAgYXBpLmRyYXcoZmFsc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmZuU2V0Q29sdW1uVmlzID0gZnVuY3Rpb24gKGlDb2wsIGJTaG93LCBiUmVkcmF3KSB7XG4gICAgICB2YXIgYXBpID0gdGhpcy5hcGkodHJ1ZSkuY29sdW1uKGlDb2wpLnZpc2libGUoYlNob3cpO1xuXG4gICAgICBpZiAoYlJlZHJhdyA9PT0gdW5kZWZpbmVkIHx8IGJSZWRyYXcpIHtcbiAgICAgICAgYXBpLmNvbHVtbnMuYWRqdXN0KCkuZHJhdygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmZuU2V0dGluZ3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gX2ZuU2V0dGluZ3NGcm9tTm9kZSh0aGlzW19leHQuaUFwaUluZGV4XSk7XG4gICAgfTtcblxuICAgIHRoaXMuZm5Tb3J0ID0gZnVuY3Rpb24gKGFhU29ydCkge1xuICAgICAgdGhpcy5hcGkodHJ1ZSkub3JkZXIoYWFTb3J0KS5kcmF3KCk7XG4gICAgfTtcblxuICAgIHRoaXMuZm5Tb3J0TGlzdGVuZXIgPSBmdW5jdGlvbiAobk5vZGUsIGlDb2x1bW4sIGZuQ2FsbGJhY2spIHtcbiAgICAgIHRoaXMuYXBpKHRydWUpLm9yZGVyLmxpc3RlbmVyKG5Ob2RlLCBpQ29sdW1uLCBmbkNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mblVwZGF0ZSA9IGZ1bmN0aW9uIChtRGF0YSwgbVJvdywgaUNvbHVtbiwgYlJlZHJhdywgYkFjdGlvbikge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpO1xuXG4gICAgICBpZiAoaUNvbHVtbiA9PT0gdW5kZWZpbmVkIHx8IGlDb2x1bW4gPT09IG51bGwpIHtcbiAgICAgICAgYXBpLnJvdyhtUm93KS5kYXRhKG1EYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwaS5jZWxsKG1Sb3csIGlDb2x1bW4pLmRhdGEobURhdGEpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYkFjdGlvbiA9PT0gdW5kZWZpbmVkIHx8IGJBY3Rpb24pIHtcbiAgICAgICAgYXBpLmNvbHVtbnMuYWRqdXN0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChiUmVkcmF3ID09PSB1bmRlZmluZWQgfHwgYlJlZHJhdykge1xuICAgICAgICBhcGkuZHJhdygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gMDtcbiAgICB9O1xuXG4gICAgdGhpcy5mblZlcnNpb25DaGVjayA9IF9leHQuZm5WZXJzaW9uQ2hlY2s7XG5cbiAgICB2YXIgX3RoYXQgPSB0aGlzO1xuXG4gICAgdmFyIGVtcHR5SW5pdCA9IG9wdGlvbnMgPT09IHVuZGVmaW5lZDtcbiAgICB2YXIgbGVuID0gdGhpcy5sZW5ndGg7XG5cbiAgICBpZiAoZW1wdHlJbml0KSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgdGhpcy5vQXBpID0gdGhpcy5pbnRlcm5hbCA9IF9leHQuaW50ZXJuYWw7XG5cbiAgICBmb3IgKHZhciBmbiBpbiBEYXRhVGFibGUuZXh0LmludGVybmFsKSB7XG4gICAgICBpZiAoZm4pIHtcbiAgICAgICAgdGhpc1tmbl0gPSBfZm5FeHRlcm5BcGlGdW5jKGZuKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG8gPSB7fTtcbiAgICAgIHZhciBvSW5pdCA9IGxlbiA+IDEgPyBfZm5FeHRlbmQobywgb3B0aW9ucywgdHJ1ZSkgOiBvcHRpb25zO1xuICAgICAgdmFyIGkgPSAwLFxuICAgICAgICAgIGlMZW4sXG4gICAgICAgICAgaixcbiAgICAgICAgICBqTGVuLFxuICAgICAgICAgIGssXG4gICAgICAgICAga0xlbjtcbiAgICAgIHZhciBzSWQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgIHZhciBiSW5pdEhhbmRlZE9mZiA9IGZhbHNlO1xuICAgICAgdmFyIGRlZmF1bHRzID0gRGF0YVRhYmxlLmRlZmF1bHRzO1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgaWYgKHRoaXMubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPSAndGFibGUnKSB7XG4gICAgICAgIF9mbkxvZyhudWxsLCAwLCAnTm9uLXRhYmxlIG5vZGUgaW5pdGlhbGlzYXRpb24gKCcgKyB0aGlzLm5vZGVOYW1lICsgJyknLCAyKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF9mbkNvbXBhdE9wdHMoZGVmYXVsdHMpO1xuXG4gICAgICBfZm5Db21wYXRDb2xzKGRlZmF1bHRzLmNvbHVtbik7XG5cbiAgICAgIF9mbkNhbWVsVG9IdW5nYXJpYW4oZGVmYXVsdHMsIGRlZmF1bHRzLCB0cnVlKTtcblxuICAgICAgX2ZuQ2FtZWxUb0h1bmdhcmlhbihkZWZhdWx0cy5jb2x1bW4sIGRlZmF1bHRzLmNvbHVtbiwgdHJ1ZSk7XG5cbiAgICAgIF9mbkNhbWVsVG9IdW5nYXJpYW4oZGVmYXVsdHMsICQuZXh0ZW5kKG9Jbml0LCAkdGhpcy5kYXRhKCkpKTtcblxuICAgICAgdmFyIGFsbFNldHRpbmdzID0gRGF0YVRhYmxlLnNldHRpbmdzO1xuXG4gICAgICBmb3IgKGkgPSAwLCBpTGVuID0gYWxsU2V0dGluZ3MubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgIHZhciBzID0gYWxsU2V0dGluZ3NbaV07XG5cbiAgICAgICAgaWYgKHMublRhYmxlID09IHRoaXMgfHwgcy5uVEhlYWQgJiYgcy5uVEhlYWQucGFyZW50Tm9kZSA9PSB0aGlzIHx8IHMublRGb290ICYmIHMublRGb290LnBhcmVudE5vZGUgPT0gdGhpcykge1xuICAgICAgICAgIHZhciBiUmV0cmlldmUgPSBvSW5pdC5iUmV0cmlldmUgIT09IHVuZGVmaW5lZCA/IG9Jbml0LmJSZXRyaWV2ZSA6IGRlZmF1bHRzLmJSZXRyaWV2ZTtcbiAgICAgICAgICB2YXIgYkRlc3Ryb3kgPSBvSW5pdC5iRGVzdHJveSAhPT0gdW5kZWZpbmVkID8gb0luaXQuYkRlc3Ryb3kgOiBkZWZhdWx0cy5iRGVzdHJveTtcblxuICAgICAgICAgIGlmIChlbXB0eUluaXQgfHwgYlJldHJpZXZlKSB7XG4gICAgICAgICAgICByZXR1cm4gcy5vSW5zdGFuY2U7XG4gICAgICAgICAgfSBlbHNlIGlmIChiRGVzdHJveSkge1xuICAgICAgICAgICAgcy5vSW5zdGFuY2UuZm5EZXN0cm95KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2ZuTG9nKHMsIDAsICdDYW5ub3QgcmVpbml0aWFsaXNlIERhdGFUYWJsZScsIDMpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHMuc1RhYmxlSWQgPT0gdGhpcy5pZCkge1xuICAgICAgICAgIGFsbFNldHRpbmdzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc0lkID09PSBudWxsIHx8IHNJZCA9PT0gXCJcIikge1xuICAgICAgICBzSWQgPSBcIkRhdGFUYWJsZXNfVGFibGVfXCIgKyBEYXRhVGFibGUuZXh0Ll91bmlxdWUrKztcbiAgICAgICAgdGhpcy5pZCA9IHNJZDtcbiAgICAgIH1cblxuICAgICAgdmFyIG9TZXR0aW5ncyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBEYXRhVGFibGUubW9kZWxzLm9TZXR0aW5ncywge1xuICAgICAgICBcInNEZXN0cm95V2lkdGhcIjogJHRoaXNbMF0uc3R5bGUud2lkdGgsXG4gICAgICAgIFwic0luc3RhbmNlXCI6IHNJZCxcbiAgICAgICAgXCJzVGFibGVJZFwiOiBzSWRcbiAgICAgIH0pO1xuICAgICAgb1NldHRpbmdzLm5UYWJsZSA9IHRoaXM7XG4gICAgICBvU2V0dGluZ3Mub0FwaSA9IF90aGF0LmludGVybmFsO1xuICAgICAgb1NldHRpbmdzLm9Jbml0ID0gb0luaXQ7XG4gICAgICBhbGxTZXR0aW5ncy5wdXNoKG9TZXR0aW5ncyk7XG4gICAgICBvU2V0dGluZ3Mub0luc3RhbmNlID0gX3RoYXQubGVuZ3RoID09PSAxID8gX3RoYXQgOiAkdGhpcy5kYXRhVGFibGUoKTtcblxuICAgICAgX2ZuQ29tcGF0T3B0cyhvSW5pdCk7XG5cbiAgICAgIF9mbkxhbmd1YWdlQ29tcGF0KG9Jbml0Lm9MYW5ndWFnZSk7XG5cbiAgICAgIGlmIChvSW5pdC5hTGVuZ3RoTWVudSAmJiAhb0luaXQuaURpc3BsYXlMZW5ndGgpIHtcbiAgICAgICAgb0luaXQuaURpc3BsYXlMZW5ndGggPSAkLmlzQXJyYXkob0luaXQuYUxlbmd0aE1lbnVbMF0pID8gb0luaXQuYUxlbmd0aE1lbnVbMF1bMF0gOiBvSW5pdC5hTGVuZ3RoTWVudVswXTtcbiAgICAgIH1cblxuICAgICAgb0luaXQgPSBfZm5FeHRlbmQoJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzKSwgb0luaXQpO1xuXG4gICAgICBfZm5NYXAob1NldHRpbmdzLm9GZWF0dXJlcywgb0luaXQsIFtcImJQYWdpbmF0ZVwiLCBcImJMZW5ndGhDaGFuZ2VcIiwgXCJiRmlsdGVyXCIsIFwiYlNvcnRcIiwgXCJiU29ydE11bHRpXCIsIFwiYkluZm9cIiwgXCJiUHJvY2Vzc2luZ1wiLCBcImJBdXRvV2lkdGhcIiwgXCJiU29ydENsYXNzZXNcIiwgXCJiU2VydmVyU2lkZVwiLCBcImJEZWZlclJlbmRlclwiXSk7XG5cbiAgICAgIF9mbk1hcChvU2V0dGluZ3MsIG9Jbml0LCBbXCJhc1N0cmlwZUNsYXNzZXNcIiwgXCJhamF4XCIsIFwiZm5TZXJ2ZXJEYXRhXCIsIFwiZm5Gb3JtYXROdW1iZXJcIiwgXCJzU2VydmVyTWV0aG9kXCIsIFwiYWFTb3J0aW5nXCIsIFwiYWFTb3J0aW5nRml4ZWRcIiwgXCJhTGVuZ3RoTWVudVwiLCBcInNQYWdpbmF0aW9uVHlwZVwiLCBcInNBamF4U291cmNlXCIsIFwic0FqYXhEYXRhUHJvcFwiLCBcImlTdGF0ZUR1cmF0aW9uXCIsIFwic0RvbVwiLCBcImJTb3J0Q2VsbHNUb3BcIiwgXCJpVGFiSW5kZXhcIiwgXCJmblN0YXRlTG9hZENhbGxiYWNrXCIsIFwiZm5TdGF0ZVNhdmVDYWxsYmFja1wiLCBcInJlbmRlcmVyXCIsIFwic2VhcmNoRGVsYXlcIiwgXCJyb3dJZFwiLCBbXCJpQ29va2llRHVyYXRpb25cIiwgXCJpU3RhdGVEdXJhdGlvblwiXSwgW1wib1NlYXJjaFwiLCBcIm9QcmV2aW91c1NlYXJjaFwiXSwgW1wiYW9TZWFyY2hDb2xzXCIsIFwiYW9QcmVTZWFyY2hDb2xzXCJdLCBbXCJpRGlzcGxheUxlbmd0aFwiLCBcIl9pRGlzcGxheUxlbmd0aFwiXV0pO1xuXG4gICAgICBfZm5NYXAob1NldHRpbmdzLm9TY3JvbGwsIG9Jbml0LCBbW1wic1Njcm9sbFhcIiwgXCJzWFwiXSwgW1wic1Njcm9sbFhJbm5lclwiLCBcInNYSW5uZXJcIl0sIFtcInNTY3JvbGxZXCIsIFwic1lcIl0sIFtcImJTY3JvbGxDb2xsYXBzZVwiLCBcImJDb2xsYXBzZVwiXV0pO1xuXG4gICAgICBfZm5NYXAob1NldHRpbmdzLm9MYW5ndWFnZSwgb0luaXQsIFwiZm5JbmZvQ2FsbGJhY2tcIik7XG5cbiAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvRHJhd0NhbGxiYWNrJywgb0luaXQuZm5EcmF3Q2FsbGJhY2ssICd1c2VyJyk7XG5cbiAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvU2VydmVyUGFyYW1zJywgb0luaXQuZm5TZXJ2ZXJQYXJhbXMsICd1c2VyJyk7XG5cbiAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvU3RhdGVTYXZlUGFyYW1zJywgb0luaXQuZm5TdGF0ZVNhdmVQYXJhbXMsICd1c2VyJyk7XG5cbiAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvU3RhdGVMb2FkUGFyYW1zJywgb0luaXQuZm5TdGF0ZUxvYWRQYXJhbXMsICd1c2VyJyk7XG5cbiAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvU3RhdGVMb2FkZWQnLCBvSW5pdC5mblN0YXRlTG9hZGVkLCAndXNlcicpO1xuXG4gICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb1Jvd0NhbGxiYWNrJywgb0luaXQuZm5Sb3dDYWxsYmFjaywgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9Sb3dDcmVhdGVkQ2FsbGJhY2snLCBvSW5pdC5mbkNyZWF0ZWRSb3csICd1c2VyJyk7XG5cbiAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvSGVhZGVyQ2FsbGJhY2snLCBvSW5pdC5mbkhlYWRlckNhbGxiYWNrLCAndXNlcicpO1xuXG4gICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb0Zvb3RlckNhbGxiYWNrJywgb0luaXQuZm5Gb290ZXJDYWxsYmFjaywgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9Jbml0Q29tcGxldGUnLCBvSW5pdC5mbkluaXRDb21wbGV0ZSwgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9QcmVEcmF3Q2FsbGJhY2snLCBvSW5pdC5mblByZURyYXdDYWxsYmFjaywgJ3VzZXInKTtcblxuICAgICAgb1NldHRpbmdzLnJvd0lkRm4gPSBfZm5HZXRPYmplY3REYXRhRm4ob0luaXQucm93SWQpO1xuXG4gICAgICBfZm5Ccm93c2VyRGV0ZWN0KG9TZXR0aW5ncyk7XG5cbiAgICAgIHZhciBvQ2xhc3NlcyA9IG9TZXR0aW5ncy5vQ2xhc3NlcztcbiAgICAgICQuZXh0ZW5kKG9DbGFzc2VzLCBEYXRhVGFibGUuZXh0LmNsYXNzZXMsIG9Jbml0Lm9DbGFzc2VzKTtcbiAgICAgICR0aGlzLmFkZENsYXNzKG9DbGFzc2VzLnNUYWJsZSk7XG5cbiAgICAgIGlmIChvU2V0dGluZ3MuaUluaXREaXNwbGF5U3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvU2V0dGluZ3MuaUluaXREaXNwbGF5U3RhcnQgPSBvSW5pdC5pRGlzcGxheVN0YXJ0O1xuICAgICAgICBvU2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQgPSBvSW5pdC5pRGlzcGxheVN0YXJ0O1xuICAgICAgfVxuXG4gICAgICBpZiAob0luaXQuaURlZmVyTG9hZGluZyAhPT0gbnVsbCkge1xuICAgICAgICBvU2V0dGluZ3MuYkRlZmVyTG9hZGluZyA9IHRydWU7XG4gICAgICAgIHZhciB0bXAgPSAkLmlzQXJyYXkob0luaXQuaURlZmVyTG9hZGluZyk7XG4gICAgICAgIG9TZXR0aW5ncy5faVJlY29yZHNEaXNwbGF5ID0gdG1wID8gb0luaXQuaURlZmVyTG9hZGluZ1swXSA6IG9Jbml0LmlEZWZlckxvYWRpbmc7XG4gICAgICAgIG9TZXR0aW5ncy5faVJlY29yZHNUb3RhbCA9IHRtcCA/IG9Jbml0LmlEZWZlckxvYWRpbmdbMV0gOiBvSW5pdC5pRGVmZXJMb2FkaW5nO1xuICAgICAgfVxuXG4gICAgICB2YXIgb0xhbmd1YWdlID0gb1NldHRpbmdzLm9MYW5ndWFnZTtcbiAgICAgICQuZXh0ZW5kKHRydWUsIG9MYW5ndWFnZSwgb0luaXQub0xhbmd1YWdlKTtcblxuICAgICAgaWYgKG9MYW5ndWFnZS5zVXJsKSB7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICB1cmw6IG9MYW5ndWFnZS5zVXJsLFxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MoanNvbikge1xuICAgICAgICAgICAgX2ZuTGFuZ3VhZ2VDb21wYXQoanNvbik7XG5cbiAgICAgICAgICAgIF9mbkNhbWVsVG9IdW5nYXJpYW4oZGVmYXVsdHMub0xhbmd1YWdlLCBqc29uKTtcblxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgb0xhbmd1YWdlLCBqc29uKTtcblxuICAgICAgICAgICAgX2ZuSW5pdGlhbGlzZShvU2V0dGluZ3MpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIGVycm9yKCkge1xuICAgICAgICAgICAgX2ZuSW5pdGlhbGlzZShvU2V0dGluZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGJJbml0SGFuZGVkT2ZmID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9Jbml0LmFzU3RyaXBlQ2xhc3NlcyA9PT0gbnVsbCkge1xuICAgICAgICBvU2V0dGluZ3MuYXNTdHJpcGVDbGFzc2VzID0gW29DbGFzc2VzLnNTdHJpcGVPZGQsIG9DbGFzc2VzLnNTdHJpcGVFdmVuXTtcbiAgICAgIH1cblxuICAgICAgdmFyIHN0cmlwZUNsYXNzZXMgPSBvU2V0dGluZ3MuYXNTdHJpcGVDbGFzc2VzO1xuICAgICAgdmFyIHJvd09uZSA9ICR0aGlzLmNoaWxkcmVuKCd0Ym9keScpLmZpbmQoJ3RyJykuZXEoMCk7XG5cbiAgICAgIGlmICgkLmluQXJyYXkodHJ1ZSwgJC5tYXAoc3RyaXBlQ2xhc3NlcywgZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgIHJldHVybiByb3dPbmUuaGFzQ2xhc3MoZWwpO1xuICAgICAgfSkpICE9PSAtMSkge1xuICAgICAgICAkKCd0Ym9keSB0cicsIHRoaXMpLnJlbW92ZUNsYXNzKHN0cmlwZUNsYXNzZXMuam9pbignICcpKTtcbiAgICAgICAgb1NldHRpbmdzLmFzRGVzdHJveVN0cmlwZXMgPSBzdHJpcGVDbGFzc2VzLnNsaWNlKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBhblRocyA9IFtdO1xuICAgICAgdmFyIGFvQ29sdW1uc0luaXQ7XG4gICAgICB2YXIgblRoZWFkID0gdGhpcy5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGhlYWQnKTtcblxuICAgICAgaWYgKG5UaGVhZC5sZW5ndGggIT09IDApIHtcbiAgICAgICAgX2ZuRGV0ZWN0SGVhZGVyKG9TZXR0aW5ncy5hb0hlYWRlciwgblRoZWFkWzBdKTtcblxuICAgICAgICBhblRocyA9IF9mbkdldFVuaXF1ZVRocyhvU2V0dGluZ3MpO1xuICAgICAgfVxuXG4gICAgICBpZiAob0luaXQuYW9Db2x1bW5zID09PSBudWxsKSB7XG4gICAgICAgIGFvQ29sdW1uc0luaXQgPSBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW5UaHMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgICAgYW9Db2x1bW5zSW5pdC5wdXNoKG51bGwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhb0NvbHVtbnNJbml0ID0gb0luaXQuYW9Db2x1bW5zO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW9Db2x1bW5zSW5pdC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgX2ZuQWRkQ29sdW1uKG9TZXR0aW5ncywgYW5UaHMgPyBhblRoc1tpXSA6IG51bGwpO1xuICAgICAgfVxuXG4gICAgICBfZm5BcHBseUNvbHVtbkRlZnMob1NldHRpbmdzLCBvSW5pdC5hb0NvbHVtbkRlZnMsIGFvQ29sdW1uc0luaXQsIGZ1bmN0aW9uIChpQ29sLCBvRGVmKSB7XG4gICAgICAgIF9mbkNvbHVtbk9wdGlvbnMob1NldHRpbmdzLCBpQ29sLCBvRGVmKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocm93T25lLmxlbmd0aCkge1xuICAgICAgICB2YXIgYSA9IGZ1bmN0aW9uIGEoY2VsbCwgbmFtZSkge1xuICAgICAgICAgIHJldHVybiBjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS0nICsgbmFtZSkgIT09IG51bGwgPyBuYW1lIDogbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICAkKHJvd09uZVswXSkuY2hpbGRyZW4oJ3RoLCB0ZCcpLmVhY2goZnVuY3Rpb24gKGksIGNlbGwpIHtcbiAgICAgICAgICB2YXIgY29sID0gb1NldHRpbmdzLmFvQ29sdW1uc1tpXTtcblxuICAgICAgICAgIGlmIChjb2wubURhdGEgPT09IGkpIHtcbiAgICAgICAgICAgIHZhciBzb3J0ID0gYShjZWxsLCAnc29ydCcpIHx8IGEoY2VsbCwgJ29yZGVyJyk7XG4gICAgICAgICAgICB2YXIgZmlsdGVyID0gYShjZWxsLCAnZmlsdGVyJykgfHwgYShjZWxsLCAnc2VhcmNoJyk7XG5cbiAgICAgICAgICAgIGlmIChzb3J0ICE9PSBudWxsIHx8IGZpbHRlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBjb2wubURhdGEgPSB7XG4gICAgICAgICAgICAgICAgXzogaSArICcuZGlzcGxheScsXG4gICAgICAgICAgICAgICAgc29ydDogc29ydCAhPT0gbnVsbCA/IGkgKyAnLkBkYXRhLScgKyBzb3J0IDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHR5cGU6IHNvcnQgIT09IG51bGwgPyBpICsgJy5AZGF0YS0nICsgc29ydCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6IGZpbHRlciAhPT0gbnVsbCA/IGkgKyAnLkBkYXRhLScgKyBmaWx0ZXIgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICBfZm5Db2x1bW5PcHRpb25zKG9TZXR0aW5ncywgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdmFyIGZlYXR1cmVzID0gb1NldHRpbmdzLm9GZWF0dXJlcztcblxuICAgICAgdmFyIGxvYWRlZEluaXQgPSBmdW5jdGlvbiBsb2FkZWRJbml0KCkge1xuICAgICAgICBpZiAob0luaXQuYWFTb3J0aW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgc29ydGluZyA9IG9TZXR0aW5ncy5hYVNvcnRpbmc7XG5cbiAgICAgICAgICBmb3IgKGkgPSAwLCBpTGVuID0gc29ydGluZy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgICAgIHNvcnRpbmdbaV1bMV0gPSBvU2V0dGluZ3MuYW9Db2x1bW5zW2ldLmFzU29ydGluZ1swXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfZm5Tb3J0aW5nQ2xhc3NlcyhvU2V0dGluZ3MpO1xuXG4gICAgICAgIGlmIChmZWF0dXJlcy5iU29ydCkge1xuICAgICAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvRHJhd0NhbGxiYWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG9TZXR0aW5ncy5iU29ydGVkKSB7XG4gICAgICAgICAgICAgIHZhciBhU29ydCA9IF9mblNvcnRGbGF0dGVuKG9TZXR0aW5ncyk7XG5cbiAgICAgICAgICAgICAgdmFyIHNvcnRlZENvbHVtbnMgPSB7fTtcbiAgICAgICAgICAgICAgJC5lYWNoKGFTb3J0LCBmdW5jdGlvbiAoaSwgdmFsKSB7XG4gICAgICAgICAgICAgICAgc29ydGVkQ29sdW1uc1t2YWwuc3JjXSA9IHZhbC5kaXI7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIF9mbkNhbGxiYWNrRmlyZShvU2V0dGluZ3MsIG51bGwsICdvcmRlcicsIFtvU2V0dGluZ3MsIGFTb3J0LCBzb3J0ZWRDb2x1bW5zXSk7XG5cbiAgICAgICAgICAgICAgX2ZuU29ydEFyaWEob1NldHRpbmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvRHJhd0NhbGxiYWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChvU2V0dGluZ3MuYlNvcnRlZCB8fCBfZm5EYXRhU291cmNlKG9TZXR0aW5ncykgPT09ICdzc3AnIHx8IGZlYXR1cmVzLmJEZWZlclJlbmRlcikge1xuICAgICAgICAgICAgX2ZuU29ydGluZ0NsYXNzZXMob1NldHRpbmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sICdzYycpO1xuXG4gICAgICAgIHZhciBjYXB0aW9ucyA9ICR0aGlzLmNoaWxkcmVuKCdjYXB0aW9uJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5fY2FwdGlvblNpZGUgPSAkKHRoaXMpLmNzcygnY2FwdGlvbi1zaWRlJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgdGhlYWQgPSAkdGhpcy5jaGlsZHJlbigndGhlYWQnKTtcblxuICAgICAgICBpZiAodGhlYWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhlYWQgPSAkKCc8dGhlYWQvPicpLmFwcGVuZFRvKCR0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9TZXR0aW5ncy5uVEhlYWQgPSB0aGVhZFswXTtcbiAgICAgICAgdmFyIHRib2R5ID0gJHRoaXMuY2hpbGRyZW4oJ3Rib2R5Jyk7XG5cbiAgICAgICAgaWYgKHRib2R5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRib2R5ID0gJCgnPHRib2R5Lz4nKS5hcHBlbmRUbygkdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBvU2V0dGluZ3MublRCb2R5ID0gdGJvZHlbMF07XG4gICAgICAgIHZhciB0Zm9vdCA9ICR0aGlzLmNoaWxkcmVuKCd0Zm9vdCcpO1xuXG4gICAgICAgIGlmICh0Zm9vdC5sZW5ndGggPT09IDAgJiYgY2FwdGlvbnMubGVuZ3RoID4gMCAmJiAob1NldHRpbmdzLm9TY3JvbGwuc1ggIT09IFwiXCIgfHwgb1NldHRpbmdzLm9TY3JvbGwuc1kgIT09IFwiXCIpKSB7XG4gICAgICAgICAgdGZvb3QgPSAkKCc8dGZvb3QvPicpLmFwcGVuZFRvKCR0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0Zm9vdC5sZW5ndGggPT09IDAgfHwgdGZvb3QuY2hpbGRyZW4oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAkdGhpcy5hZGRDbGFzcyhvQ2xhc3Nlcy5zTm9Gb290ZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRmb290Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBvU2V0dGluZ3MublRGb290ID0gdGZvb3RbMF07XG5cbiAgICAgICAgICBfZm5EZXRlY3RIZWFkZXIob1NldHRpbmdzLmFvRm9vdGVyLCBvU2V0dGluZ3MublRGb290KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvSW5pdC5hYURhdGEpIHtcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb0luaXQuYWFEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBfZm5BZGREYXRhKG9TZXR0aW5ncywgb0luaXQuYWFEYXRhW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob1NldHRpbmdzLmJEZWZlckxvYWRpbmcgfHwgX2ZuRGF0YVNvdXJjZShvU2V0dGluZ3MpID09ICdkb20nKSB7XG4gICAgICAgICAgX2ZuQWRkVHIob1NldHRpbmdzLCAkKG9TZXR0aW5ncy5uVEJvZHkpLmNoaWxkcmVuKCd0cicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9TZXR0aW5ncy5haURpc3BsYXkgPSBvU2V0dGluZ3MuYWlEaXNwbGF5TWFzdGVyLnNsaWNlKCk7XG4gICAgICAgIG9TZXR0aW5ncy5iSW5pdGlhbGlzZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChiSW5pdEhhbmRlZE9mZiA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBfZm5Jbml0aWFsaXNlKG9TZXR0aW5ncyk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChvSW5pdC5iU3RhdGVTYXZlKSB7XG4gICAgICAgIGZlYXR1cmVzLmJTdGF0ZVNhdmUgPSB0cnVlO1xuXG4gICAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvRHJhd0NhbGxiYWNrJywgX2ZuU2F2ZVN0YXRlLCAnc3RhdGVfc2F2ZScpO1xuXG4gICAgICAgIF9mbkxvYWRTdGF0ZShvU2V0dGluZ3MsIG9Jbml0LCBsb2FkZWRJbml0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvYWRlZEluaXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfdGhhdCA9IG51bGw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIF9leHQ7XG5cbiAgdmFyIF9BcGkyO1xuXG4gIHZhciBfYXBpX3JlZ2lzdGVyO1xuXG4gIHZhciBfYXBpX3JlZ2lzdGVyUGx1cmFsO1xuXG4gIHZhciBfcmVfZGljID0ge307XG4gIHZhciBfcmVfbmV3X2xpbmVzID0gL1tcXHJcXG5dL2c7XG4gIHZhciBfcmVfaHRtbCA9IC88Lio/Pi9nO1xuICB2YXIgX3JlX2RhdGUgPSAvXlxcZHsyLDR9W1xcLlxcL1xcLV1cXGR7MSwyfVtcXC5cXC9cXC1dXFxkezEsMn0oW1QgXXsxfVxcZHsxLDJ9WzpcXC5dXFxkezJ9KFtcXC46XVxcZHsyfSk/KT8kLztcblxuICB2YXIgX3JlX2VzY2FwZV9yZWdleCA9IG5ldyBSZWdFeHAoJyhcXFxcJyArIFsnLycsICcuJywgJyonLCAnKycsICc/JywgJ3wnLCAnKCcsICcpJywgJ1snLCAnXScsICd7JywgJ30nLCAnXFxcXCcsICckJywgJ14nLCAnLSddLmpvaW4oJ3xcXFxcJykgKyAnKScsICdnJyk7XG5cbiAgdmFyIF9yZV9mb3JtYXR0ZWRfbnVtZXJpYyA9IC9bJywkwqPigqzCpSVcXHUyMDA5XFx1MjAyRlxcdTIwQkRcXHUyMGE5XFx1MjBCQXJma8mDzp5dL2dpO1xuXG4gIHZhciBfZW1wdHkgPSBmdW5jdGlvbiBfZW1wdHkoZCkge1xuICAgIHJldHVybiAhZCB8fCBkID09PSB0cnVlIHx8IGQgPT09ICctJyA/IHRydWUgOiBmYWxzZTtcbiAgfTtcblxuICB2YXIgX2ludFZhbCA9IGZ1bmN0aW9uIF9pbnRWYWwocykge1xuICAgIHZhciBpbnRlZ2VyID0gcGFyc2VJbnQocywgMTApO1xuICAgIHJldHVybiAhaXNOYU4oaW50ZWdlcikgJiYgaXNGaW5pdGUocykgPyBpbnRlZ2VyIDogbnVsbDtcbiAgfTtcblxuICB2YXIgX251bVRvRGVjaW1hbCA9IGZ1bmN0aW9uIF9udW1Ub0RlY2ltYWwobnVtLCBkZWNpbWFsUG9pbnQpIHtcbiAgICBpZiAoIV9yZV9kaWNbZGVjaW1hbFBvaW50XSkge1xuICAgICAgX3JlX2RpY1tkZWNpbWFsUG9pbnRdID0gbmV3IFJlZ0V4cChfZm5Fc2NhcGVSZWdleChkZWNpbWFsUG9pbnQpLCAnZycpO1xuICAgIH1cblxuICAgIHJldHVybiB0eXBlb2YgbnVtID09PSAnc3RyaW5nJyAmJiBkZWNpbWFsUG9pbnQgIT09ICcuJyA/IG51bS5yZXBsYWNlKC9cXC4vZywgJycpLnJlcGxhY2UoX3JlX2RpY1tkZWNpbWFsUG9pbnRdLCAnLicpIDogbnVtO1xuICB9O1xuXG4gIHZhciBfaXNOdW1iZXIgPSBmdW5jdGlvbiBfaXNOdW1iZXIoZCwgZGVjaW1hbFBvaW50LCBmb3JtYXR0ZWQpIHtcbiAgICB2YXIgc3RyVHlwZSA9IHR5cGVvZiBkID09PSAnc3RyaW5nJztcblxuICAgIGlmIChfZW1wdHkoZCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkZWNpbWFsUG9pbnQgJiYgc3RyVHlwZSkge1xuICAgICAgZCA9IF9udW1Ub0RlY2ltYWwoZCwgZGVjaW1hbFBvaW50KTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybWF0dGVkICYmIHN0clR5cGUpIHtcbiAgICAgIGQgPSBkLnJlcGxhY2UoX3JlX2Zvcm1hdHRlZF9udW1lcmljLCAnJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KGQpKSAmJiBpc0Zpbml0ZShkKTtcbiAgfTtcblxuICB2YXIgX2lzSHRtbCA9IGZ1bmN0aW9uIF9pc0h0bWwoZCkge1xuICAgIHJldHVybiBfZW1wdHkoZCkgfHwgdHlwZW9mIGQgPT09ICdzdHJpbmcnO1xuICB9O1xuXG4gIHZhciBfaHRtbE51bWVyaWMgPSBmdW5jdGlvbiBfaHRtbE51bWVyaWMoZCwgZGVjaW1hbFBvaW50LCBmb3JtYXR0ZWQpIHtcbiAgICBpZiAoX2VtcHR5KGQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgaHRtbCA9IF9pc0h0bWwoZCk7XG5cbiAgICByZXR1cm4gIWh0bWwgPyBudWxsIDogX2lzTnVtYmVyKF9zdHJpcEh0bWwoZCksIGRlY2ltYWxQb2ludCwgZm9ybWF0dGVkKSA/IHRydWUgOiBudWxsO1xuICB9O1xuXG4gIHZhciBfcGx1Y2sgPSBmdW5jdGlvbiBfcGx1Y2soYSwgcHJvcCwgcHJvcDIpIHtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBpZW4gPSBhLmxlbmd0aDtcblxuICAgIGlmIChwcm9wMiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGlmIChhW2ldICYmIGFbaV1bcHJvcF0pIHtcbiAgICAgICAgICBvdXQucHVzaChhW2ldW3Byb3BdW3Byb3AyXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBpZiAoYVtpXSkge1xuICAgICAgICAgIG91dC5wdXNoKGFbaV1bcHJvcF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICB2YXIgX3BsdWNrX29yZGVyID0gZnVuY3Rpb24gX3BsdWNrX29yZGVyKGEsIG9yZGVyLCBwcm9wLCBwcm9wMikge1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGllbiA9IG9yZGVyLmxlbmd0aDtcblxuICAgIGlmIChwcm9wMiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGlmIChhW29yZGVyW2ldXVtwcm9wXSkge1xuICAgICAgICAgIG91dC5wdXNoKGFbb3JkZXJbaV1dW3Byb3BdW3Byb3AyXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBvdXQucHVzaChhW29yZGVyW2ldXVtwcm9wXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICB2YXIgX3JhbmdlID0gZnVuY3Rpb24gX3JhbmdlKGxlbiwgc3RhcnQpIHtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIGVuZDtcblxuICAgIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdGFydCA9IDA7XG4gICAgICBlbmQgPSBsZW47XG4gICAgfSBlbHNlIHtcbiAgICAgIGVuZCA9IHN0YXJ0O1xuICAgICAgc3RhcnQgPSBsZW47XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIG91dC5wdXNoKGkpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgdmFyIF9yZW1vdmVFbXB0eSA9IGZ1bmN0aW9uIF9yZW1vdmVFbXB0eShhKSB7XG4gICAgdmFyIG91dCA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIGlmIChhW2ldKSB7XG4gICAgICAgIG91dC5wdXNoKGFbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgdmFyIF9zdHJpcEh0bWwgPSBmdW5jdGlvbiBfc3RyaXBIdG1sKGQpIHtcbiAgICByZXR1cm4gZC5yZXBsYWNlKF9yZV9odG1sLCAnJyk7XG4gIH07XG5cbiAgdmFyIF9hcmVBbGxVbmlxdWUgPSBmdW5jdGlvbiBfYXJlQWxsVW5pcXVlKHNyYykge1xuICAgIGlmIChzcmMubGVuZ3RoIDwgMikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIHNvcnRlZCA9IHNyYy5zbGljZSgpLnNvcnQoKTtcbiAgICB2YXIgbGFzdCA9IHNvcnRlZFswXTtcblxuICAgIGZvciAodmFyIGkgPSAxLCBpZW4gPSBzb3J0ZWQubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIGlmIChzb3J0ZWRbaV0gPT09IGxhc3QpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBsYXN0ID0gc29ydGVkW2ldO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIHZhciBfdW5pcXVlID0gZnVuY3Rpb24gX3VuaXF1ZShzcmMpIHtcbiAgICBpZiAoX2FyZUFsbFVuaXF1ZShzcmMpKSB7XG4gICAgICByZXR1cm4gc3JjLnNsaWNlKCk7XG4gICAgfVxuXG4gICAgdmFyIG91dCA9IFtdLFxuICAgICAgICB2YWwsXG4gICAgICAgIGksXG4gICAgICAgIGllbiA9IHNyYy5sZW5ndGgsXG4gICAgICAgIGosXG4gICAgICAgIGsgPSAwO1xuXG4gICAgYWdhaW46IGZvciAoaSA9IDA7IGkgPCBpZW47IGkrKykge1xuICAgICAgdmFsID0gc3JjW2ldO1xuXG4gICAgICBmb3IgKGogPSAwOyBqIDwgazsgaisrKSB7XG4gICAgICAgIGlmIChvdXRbal0gPT09IHZhbCkge1xuICAgICAgICAgIGNvbnRpbnVlIGFnYWluO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG91dC5wdXNoKHZhbCk7XG4gICAgICBrKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICBEYXRhVGFibGUudXRpbCA9IHtcbiAgICB0aHJvdHRsZTogZnVuY3Rpb24gdGhyb3R0bGUoZm4sIGZyZXEpIHtcbiAgICAgIHZhciBmcmVxdWVuY3kgPSBmcmVxICE9PSB1bmRlZmluZWQgPyBmcmVxIDogMjAwLFxuICAgICAgICAgIGxhc3QsXG4gICAgICAgICAgdGltZXI7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBub3cgPSArbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgaWYgKGxhc3QgJiYgbm93IDwgbGFzdCArIGZyZXF1ZW5jeSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbiAgICAgICAgICB9LCBmcmVxdWVuY3kpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxhc3QgPSBub3c7XG4gICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBlc2NhcGVSZWdleDogZnVuY3Rpb24gZXNjYXBlUmVnZXgodmFsKSB7XG4gICAgICByZXR1cm4gdmFsLnJlcGxhY2UoX3JlX2VzY2FwZV9yZWdleCwgJ1xcXFwkMScpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBfZm5IdW5nYXJpYW5NYXAobykge1xuICAgIHZhciBodW5nYXJpYW4gPSAnYSBhYSBhaSBhbyBhcyBiIGZuIGkgbSBvIHMgJyxcbiAgICAgICAgbWF0Y2gsXG4gICAgICAgIG5ld0tleSxcbiAgICAgICAgbWFwID0ge307XG4gICAgJC5lYWNoKG8sIGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgICAgbWF0Y2ggPSBrZXkubWF0Y2goL14oW15BLVpdKz8pKFtBLVpdKS8pO1xuXG4gICAgICBpZiAobWF0Y2ggJiYgaHVuZ2FyaWFuLmluZGV4T2YobWF0Y2hbMV0gKyAnICcpICE9PSAtMSkge1xuICAgICAgICBuZXdLZXkgPSBrZXkucmVwbGFjZShtYXRjaFswXSwgbWF0Y2hbMl0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIG1hcFtuZXdLZXldID0ga2V5O1xuXG4gICAgICAgIGlmIChtYXRjaFsxXSA9PT0gJ28nKSB7XG4gICAgICAgICAgX2ZuSHVuZ2FyaWFuTWFwKG9ba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBvLl9odW5nYXJpYW5NYXAgPSBtYXA7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5DYW1lbFRvSHVuZ2FyaWFuKHNyYywgdXNlciwgZm9yY2UpIHtcbiAgICBpZiAoIXNyYy5faHVuZ2FyaWFuTWFwKSB7XG4gICAgICBfZm5IdW5nYXJpYW5NYXAoc3JjKTtcbiAgICB9XG5cbiAgICB2YXIgaHVuZ2FyaWFuS2V5O1xuICAgICQuZWFjaCh1c2VyLCBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICAgIGh1bmdhcmlhbktleSA9IHNyYy5faHVuZ2FyaWFuTWFwW2tleV07XG5cbiAgICAgIGlmIChodW5nYXJpYW5LZXkgIT09IHVuZGVmaW5lZCAmJiAoZm9yY2UgfHwgdXNlcltodW5nYXJpYW5LZXldID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgIGlmIChodW5nYXJpYW5LZXkuY2hhckF0KDApID09PSAnbycpIHtcbiAgICAgICAgICBpZiAoIXVzZXJbaHVuZ2FyaWFuS2V5XSkge1xuICAgICAgICAgICAgdXNlcltodW5nYXJpYW5LZXldID0ge307XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJC5leHRlbmQodHJ1ZSwgdXNlcltodW5nYXJpYW5LZXldLCB1c2VyW2tleV0pO1xuXG4gICAgICAgICAgX2ZuQ2FtZWxUb0h1bmdhcmlhbihzcmNbaHVuZ2FyaWFuS2V5XSwgdXNlcltodW5nYXJpYW5LZXldLCBmb3JjZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXNlcltodW5nYXJpYW5LZXldID0gdXNlcltrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5MYW5ndWFnZUNvbXBhdChsYW5nKSB7XG4gICAgdmFyIGRlZmF1bHRzID0gRGF0YVRhYmxlLmRlZmF1bHRzLm9MYW5ndWFnZTtcbiAgICB2YXIgZGVmYXVsdERlY2ltYWwgPSBkZWZhdWx0cy5zRGVjaW1hbDtcblxuICAgIGlmIChkZWZhdWx0RGVjaW1hbCkge1xuICAgICAgX2FkZE51bWVyaWNTb3J0KGRlZmF1bHREZWNpbWFsKTtcbiAgICB9XG5cbiAgICBpZiAobGFuZykge1xuICAgICAgdmFyIHplcm9SZWNvcmRzID0gbGFuZy5zWmVyb1JlY29yZHM7XG5cbiAgICAgIGlmICghbGFuZy5zRW1wdHlUYWJsZSAmJiB6ZXJvUmVjb3JkcyAmJiBkZWZhdWx0cy5zRW1wdHlUYWJsZSA9PT0gXCJObyBkYXRhIGF2YWlsYWJsZSBpbiB0YWJsZVwiKSB7XG4gICAgICAgIF9mbk1hcChsYW5nLCBsYW5nLCAnc1plcm9SZWNvcmRzJywgJ3NFbXB0eVRhYmxlJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghbGFuZy5zTG9hZGluZ1JlY29yZHMgJiYgemVyb1JlY29yZHMgJiYgZGVmYXVsdHMuc0xvYWRpbmdSZWNvcmRzID09PSBcIkxvYWRpbmcuLi5cIikge1xuICAgICAgICBfZm5NYXAobGFuZywgbGFuZywgJ3NaZXJvUmVjb3JkcycsICdzTG9hZGluZ1JlY29yZHMnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxhbmcuc0luZm9UaG91c2FuZHMpIHtcbiAgICAgICAgbGFuZy5zVGhvdXNhbmRzID0gbGFuZy5zSW5mb1Rob3VzYW5kcztcbiAgICAgIH1cblxuICAgICAgdmFyIGRlY2ltYWwgPSBsYW5nLnNEZWNpbWFsO1xuXG4gICAgICBpZiAoZGVjaW1hbCAmJiBkZWZhdWx0RGVjaW1hbCAhPT0gZGVjaW1hbCkge1xuICAgICAgICBfYWRkTnVtZXJpY1NvcnQoZGVjaW1hbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIF9mbkNvbXBhdE1hcCA9IGZ1bmN0aW9uIF9mbkNvbXBhdE1hcChvLCBrbmV3LCBvbGQpIHtcbiAgICBpZiAob1trbmV3XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvW29sZF0gPSBvW2tuZXddO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBfZm5Db21wYXRPcHRzKGluaXQpIHtcbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ29yZGVyaW5nJywgJ2JTb3J0Jyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ29yZGVyTXVsdGknLCAnYlNvcnRNdWx0aScpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdvcmRlckNsYXNzZXMnLCAnYlNvcnRDbGFzc2VzJyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ29yZGVyQ2VsbHNUb3AnLCAnYlNvcnRDZWxsc1RvcCcpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdvcmRlcicsICdhYVNvcnRpbmcnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnb3JkZXJGaXhlZCcsICdhYVNvcnRpbmdGaXhlZCcpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdwYWdpbmcnLCAnYlBhZ2luYXRlJyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ3BhZ2luZ1R5cGUnLCAnc1BhZ2luYXRpb25UeXBlJyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ3BhZ2VMZW5ndGgnLCAnaURpc3BsYXlMZW5ndGgnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnc2VhcmNoaW5nJywgJ2JGaWx0ZXInKTtcblxuICAgIGlmICh0eXBlb2YgaW5pdC5zU2Nyb2xsWCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBpbml0LnNTY3JvbGxYID0gaW5pdC5zU2Nyb2xsWCA/ICcxMDAlJyA6ICcnO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgaW5pdC5zY3JvbGxYID09PSAnYm9vbGVhbicpIHtcbiAgICAgIGluaXQuc2Nyb2xsWCA9IGluaXQuc2Nyb2xsWCA/ICcxMDAlJyA6ICcnO1xuICAgIH1cblxuICAgIHZhciBzZWFyY2hDb2xzID0gaW5pdC5hb1NlYXJjaENvbHM7XG5cbiAgICBpZiAoc2VhcmNoQ29scykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IHNlYXJjaENvbHMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgaWYgKHNlYXJjaENvbHNbaV0pIHtcbiAgICAgICAgICBfZm5DYW1lbFRvSHVuZ2FyaWFuKERhdGFUYWJsZS5tb2RlbHMub1NlYXJjaCwgc2VhcmNoQ29sc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Db21wYXRDb2xzKGluaXQpIHtcbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ29yZGVyYWJsZScsICdiU29ydGFibGUnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnb3JkZXJEYXRhJywgJ2FEYXRhU29ydCcpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdvcmRlclNlcXVlbmNlJywgJ2FzU29ydGluZycpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdvcmRlckRhdGFUeXBlJywgJ3NvcnREYXRhVHlwZScpO1xuXG4gICAgdmFyIGRhdGFTb3J0ID0gaW5pdC5hRGF0YVNvcnQ7XG5cbiAgICBpZiAodHlwZW9mIGRhdGFTb3J0ID09PSAnbnVtYmVyJyAmJiAhJC5pc0FycmF5KGRhdGFTb3J0KSkge1xuICAgICAgaW5pdC5hRGF0YVNvcnQgPSBbZGF0YVNvcnRdO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkJyb3dzZXJEZXRlY3Qoc2V0dGluZ3MpIHtcbiAgICBpZiAoIURhdGFUYWJsZS5fX2Jyb3dzZXIpIHtcbiAgICAgIHZhciBicm93c2VyID0ge307XG4gICAgICBEYXRhVGFibGUuX19icm93c2VyID0gYnJvd3NlcjtcbiAgICAgIHZhciBuID0gJCgnPGRpdi8+JykuY3NzKHtcbiAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgbGVmdDogJCh3aW5kb3cpLnNjcm9sbExlZnQoKSAqIC0xLFxuICAgICAgICBoZWlnaHQ6IDEsXG4gICAgICAgIHdpZHRoOiAxLFxuICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgICAgIH0pLmFwcGVuZCgkKCc8ZGl2Lz4nKS5jc3Moe1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgdG9wOiAxLFxuICAgICAgICBsZWZ0OiAxLFxuICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICBvdmVyZmxvdzogJ3Njcm9sbCdcbiAgICAgIH0pLmFwcGVuZCgkKCc8ZGl2Lz4nKS5jc3Moe1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBoZWlnaHQ6IDEwXG4gICAgICB9KSkpLmFwcGVuZFRvKCdib2R5Jyk7XG4gICAgICB2YXIgb3V0ZXIgPSBuLmNoaWxkcmVuKCk7XG4gICAgICB2YXIgaW5uZXIgPSBvdXRlci5jaGlsZHJlbigpO1xuICAgICAgYnJvd3Nlci5iYXJXaWR0aCA9IG91dGVyWzBdLm9mZnNldFdpZHRoIC0gb3V0ZXJbMF0uY2xpZW50V2lkdGg7XG4gICAgICBicm93c2VyLmJTY3JvbGxPdmVyc2l6ZSA9IGlubmVyWzBdLm9mZnNldFdpZHRoID09PSAxMDAgJiYgb3V0ZXJbMF0uY2xpZW50V2lkdGggIT09IDEwMDtcbiAgICAgIGJyb3dzZXIuYlNjcm9sbGJhckxlZnQgPSBNYXRoLnJvdW5kKGlubmVyLm9mZnNldCgpLmxlZnQpICE9PSAxO1xuICAgICAgYnJvd3Nlci5iQm91bmRpbmcgPSBuWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgbi5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICAkLmV4dGVuZChzZXR0aW5ncy5vQnJvd3NlciwgRGF0YVRhYmxlLl9fYnJvd3Nlcik7XG4gICAgc2V0dGluZ3Mub1Njcm9sbC5pQmFyV2lkdGggPSBEYXRhVGFibGUuX19icm93c2VyLmJhcldpZHRoO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuUmVkdWNlKHRoYXQsIGZuLCBpbml0LCBzdGFydCwgZW5kLCBpbmMpIHtcbiAgICB2YXIgaSA9IHN0YXJ0LFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgaXNTZXQgPSBmYWxzZTtcblxuICAgIGlmIChpbml0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbHVlID0gaW5pdDtcbiAgICAgIGlzU2V0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB3aGlsZSAoaSAhPT0gZW5kKSB7XG4gICAgICBpZiAoIXRoYXQuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlID0gaXNTZXQgPyBmbih2YWx1ZSwgdGhhdFtpXSwgaSwgdGhhdCkgOiB0aGF0W2ldO1xuICAgICAgaXNTZXQgPSB0cnVlO1xuICAgICAgaSArPSBpbmM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQWRkQ29sdW1uKG9TZXR0aW5ncywgblRoKSB7XG4gICAgdmFyIG9EZWZhdWx0cyA9IERhdGFUYWJsZS5kZWZhdWx0cy5jb2x1bW47XG4gICAgdmFyIGlDb2wgPSBvU2V0dGluZ3MuYW9Db2x1bW5zLmxlbmd0aDtcbiAgICB2YXIgb0NvbCA9ICQuZXh0ZW5kKHt9LCBEYXRhVGFibGUubW9kZWxzLm9Db2x1bW4sIG9EZWZhdWx0cywge1xuICAgICAgXCJuVGhcIjogblRoID8gblRoIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKSxcbiAgICAgIFwic1RpdGxlXCI6IG9EZWZhdWx0cy5zVGl0bGUgPyBvRGVmYXVsdHMuc1RpdGxlIDogblRoID8gblRoLmlubmVySFRNTCA6ICcnLFxuICAgICAgXCJhRGF0YVNvcnRcIjogb0RlZmF1bHRzLmFEYXRhU29ydCA/IG9EZWZhdWx0cy5hRGF0YVNvcnQgOiBbaUNvbF0sXG4gICAgICBcIm1EYXRhXCI6IG9EZWZhdWx0cy5tRGF0YSA/IG9EZWZhdWx0cy5tRGF0YSA6IGlDb2wsXG4gICAgICBpZHg6IGlDb2xcbiAgICB9KTtcbiAgICBvU2V0dGluZ3MuYW9Db2x1bW5zLnB1c2gob0NvbCk7XG4gICAgdmFyIHNlYXJjaENvbHMgPSBvU2V0dGluZ3MuYW9QcmVTZWFyY2hDb2xzO1xuICAgIHNlYXJjaENvbHNbaUNvbF0gPSAkLmV4dGVuZCh7fSwgRGF0YVRhYmxlLm1vZGVscy5vU2VhcmNoLCBzZWFyY2hDb2xzW2lDb2xdKTtcblxuICAgIF9mbkNvbHVtbk9wdGlvbnMob1NldHRpbmdzLCBpQ29sLCAkKG5UaCkuZGF0YSgpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNvbHVtbk9wdGlvbnMob1NldHRpbmdzLCBpQ29sLCBvT3B0aW9ucykge1xuICAgIHZhciBvQ29sID0gb1NldHRpbmdzLmFvQ29sdW1uc1tpQ29sXTtcbiAgICB2YXIgb0NsYXNzZXMgPSBvU2V0dGluZ3Mub0NsYXNzZXM7XG4gICAgdmFyIHRoID0gJChvQ29sLm5UaCk7XG5cbiAgICBpZiAoIW9Db2wuc1dpZHRoT3JpZykge1xuICAgICAgb0NvbC5zV2lkdGhPcmlnID0gdGguYXR0cignd2lkdGgnKSB8fCBudWxsO1xuICAgICAgdmFyIHQgPSAodGguYXR0cignc3R5bGUnKSB8fCAnJykubWF0Y2goL3dpZHRoOlxccyooXFxkK1tweGVtJV0rKS8pO1xuXG4gICAgICBpZiAodCkge1xuICAgICAgICBvQ29sLnNXaWR0aE9yaWcgPSB0WzFdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvT3B0aW9ucyAhPT0gdW5kZWZpbmVkICYmIG9PcHRpb25zICE9PSBudWxsKSB7XG4gICAgICBfZm5Db21wYXRDb2xzKG9PcHRpb25zKTtcblxuICAgICAgX2ZuQ2FtZWxUb0h1bmdhcmlhbihEYXRhVGFibGUuZGVmYXVsdHMuY29sdW1uLCBvT3B0aW9ucyk7XG5cbiAgICAgIGlmIChvT3B0aW9ucy5tRGF0YVByb3AgIT09IHVuZGVmaW5lZCAmJiAhb09wdGlvbnMubURhdGEpIHtcbiAgICAgICAgb09wdGlvbnMubURhdGEgPSBvT3B0aW9ucy5tRGF0YVByb3A7XG4gICAgICB9XG5cbiAgICAgIGlmIChvT3B0aW9ucy5zVHlwZSkge1xuICAgICAgICBvQ29sLl9zTWFudWFsVHlwZSA9IG9PcHRpb25zLnNUeXBlO1xuICAgICAgfVxuXG4gICAgICBpZiAob09wdGlvbnMuY2xhc3NOYW1lICYmICFvT3B0aW9ucy5zQ2xhc3MpIHtcbiAgICAgICAgb09wdGlvbnMuc0NsYXNzID0gb09wdGlvbnMuY2xhc3NOYW1lO1xuICAgICAgfVxuXG4gICAgICBpZiAob09wdGlvbnMuc0NsYXNzKSB7XG4gICAgICAgIHRoLmFkZENsYXNzKG9PcHRpb25zLnNDbGFzcyk7XG4gICAgICB9XG5cbiAgICAgICQuZXh0ZW5kKG9Db2wsIG9PcHRpb25zKTtcblxuICAgICAgX2ZuTWFwKG9Db2wsIG9PcHRpb25zLCBcInNXaWR0aFwiLCBcInNXaWR0aE9yaWdcIik7XG5cbiAgICAgIGlmIChvT3B0aW9ucy5pRGF0YVNvcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvQ29sLmFEYXRhU29ydCA9IFtvT3B0aW9ucy5pRGF0YVNvcnRdO1xuICAgICAgfVxuXG4gICAgICBfZm5NYXAob0NvbCwgb09wdGlvbnMsIFwiYURhdGFTb3J0XCIpO1xuICAgIH1cblxuICAgIHZhciBtRGF0YVNyYyA9IG9Db2wubURhdGE7XG5cbiAgICB2YXIgbURhdGEgPSBfZm5HZXRPYmplY3REYXRhRm4obURhdGFTcmMpO1xuXG4gICAgdmFyIG1SZW5kZXIgPSBvQ29sLm1SZW5kZXIgPyBfZm5HZXRPYmplY3REYXRhRm4ob0NvbC5tUmVuZGVyKSA6IG51bGw7XG5cbiAgICB2YXIgYXR0clRlc3QgPSBmdW5jdGlvbiBhdHRyVGVzdChzcmMpIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygc3JjID09PSAnc3RyaW5nJyAmJiBzcmMuaW5kZXhPZignQCcpICE9PSAtMTtcbiAgICB9O1xuXG4gICAgb0NvbC5fYkF0dHJTcmMgPSAkLmlzUGxhaW5PYmplY3QobURhdGFTcmMpICYmIChhdHRyVGVzdChtRGF0YVNyYy5zb3J0KSB8fCBhdHRyVGVzdChtRGF0YVNyYy50eXBlKSB8fCBhdHRyVGVzdChtRGF0YVNyYy5maWx0ZXIpKTtcbiAgICBvQ29sLl9zZXR0ZXIgPSBudWxsO1xuXG4gICAgb0NvbC5mbkdldERhdGEgPSBmdW5jdGlvbiAocm93RGF0YSwgdHlwZSwgbWV0YSkge1xuICAgICAgdmFyIGlubmVyRGF0YSA9IG1EYXRhKHJvd0RhdGEsIHR5cGUsIHVuZGVmaW5lZCwgbWV0YSk7XG4gICAgICByZXR1cm4gbVJlbmRlciAmJiB0eXBlID8gbVJlbmRlcihpbm5lckRhdGEsIHR5cGUsIHJvd0RhdGEsIG1ldGEpIDogaW5uZXJEYXRhO1xuICAgIH07XG5cbiAgICBvQ29sLmZuU2V0RGF0YSA9IGZ1bmN0aW9uIChyb3dEYXRhLCB2YWwsIG1ldGEpIHtcbiAgICAgIHJldHVybiBfZm5TZXRPYmplY3REYXRhRm4obURhdGFTcmMpKHJvd0RhdGEsIHZhbCwgbWV0YSk7XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgbURhdGFTcmMgIT09ICdudW1iZXInKSB7XG4gICAgICBvU2V0dGluZ3MuX3Jvd1JlYWRPYmplY3QgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghb1NldHRpbmdzLm9GZWF0dXJlcy5iU29ydCkge1xuICAgICAgb0NvbC5iU29ydGFibGUgPSBmYWxzZTtcbiAgICAgIHRoLmFkZENsYXNzKG9DbGFzc2VzLnNTb3J0YWJsZU5vbmUpO1xuICAgIH1cblxuICAgIHZhciBiQXNjID0gJC5pbkFycmF5KCdhc2MnLCBvQ29sLmFzU29ydGluZykgIT09IC0xO1xuICAgIHZhciBiRGVzYyA9ICQuaW5BcnJheSgnZGVzYycsIG9Db2wuYXNTb3J0aW5nKSAhPT0gLTE7XG5cbiAgICBpZiAoIW9Db2wuYlNvcnRhYmxlIHx8ICFiQXNjICYmICFiRGVzYykge1xuICAgICAgb0NvbC5zU29ydGluZ0NsYXNzID0gb0NsYXNzZXMuc1NvcnRhYmxlTm9uZTtcbiAgICAgIG9Db2wuc1NvcnRpbmdDbGFzc0pVSSA9IFwiXCI7XG4gICAgfSBlbHNlIGlmIChiQXNjICYmICFiRGVzYykge1xuICAgICAgb0NvbC5zU29ydGluZ0NsYXNzID0gb0NsYXNzZXMuc1NvcnRhYmxlQXNjO1xuICAgICAgb0NvbC5zU29ydGluZ0NsYXNzSlVJID0gb0NsYXNzZXMuc1NvcnRKVUlBc2NBbGxvd2VkO1xuICAgIH0gZWxzZSBpZiAoIWJBc2MgJiYgYkRlc2MpIHtcbiAgICAgIG9Db2wuc1NvcnRpbmdDbGFzcyA9IG9DbGFzc2VzLnNTb3J0YWJsZURlc2M7XG4gICAgICBvQ29sLnNTb3J0aW5nQ2xhc3NKVUkgPSBvQ2xhc3Nlcy5zU29ydEpVSURlc2NBbGxvd2VkO1xuICAgIH0gZWxzZSB7XG4gICAgICBvQ29sLnNTb3J0aW5nQ2xhc3MgPSBvQ2xhc3Nlcy5zU29ydGFibGU7XG4gICAgICBvQ29sLnNTb3J0aW5nQ2xhc3NKVUkgPSBvQ2xhc3Nlcy5zU29ydEpVSTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5BZGp1c3RDb2x1bW5TaXppbmcoc2V0dGluZ3MpIHtcbiAgICBpZiAoc2V0dGluZ3Mub0ZlYXR1cmVzLmJBdXRvV2lkdGggIT09IGZhbHNlKSB7XG4gICAgICB2YXIgY29sdW1ucyA9IHNldHRpbmdzLmFvQ29sdW1ucztcblxuICAgICAgX2ZuQ2FsY3VsYXRlQ29sdW1uV2lkdGhzKHNldHRpbmdzKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSBjb2x1bW5zLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICBjb2x1bW5zW2ldLm5UaC5zdHlsZS53aWR0aCA9IGNvbHVtbnNbaV0uc1dpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzY3JvbGwgPSBzZXR0aW5ncy5vU2Nyb2xsO1xuXG4gICAgaWYgKHNjcm9sbC5zWSAhPT0gJycgfHwgc2Nyb2xsLnNYICE9PSAnJykge1xuICAgICAgX2ZuU2Nyb2xsRHJhdyhzZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCBudWxsLCAnY29sdW1uLXNpemluZycsIFtzZXR0aW5nc10pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuVmlzaWJsZVRvQ29sdW1uSW5kZXgob1NldHRpbmdzLCBpTWF0Y2gpIHtcbiAgICB2YXIgYWlWaXMgPSBfZm5HZXRDb2x1bW5zKG9TZXR0aW5ncywgJ2JWaXNpYmxlJyk7XG5cbiAgICByZXR1cm4gdHlwZW9mIGFpVmlzW2lNYXRjaF0gPT09ICdudW1iZXInID8gYWlWaXNbaU1hdGNoXSA6IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Db2x1bW5JbmRleFRvVmlzaWJsZShvU2V0dGluZ3MsIGlNYXRjaCkge1xuICAgIHZhciBhaVZpcyA9IF9mbkdldENvbHVtbnMob1NldHRpbmdzLCAnYlZpc2libGUnKTtcblxuICAgIHZhciBpUG9zID0gJC5pbkFycmF5KGlNYXRjaCwgYWlWaXMpO1xuICAgIHJldHVybiBpUG9zICE9PSAtMSA/IGlQb3MgOiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuVmlzYmxlQ29sdW1ucyhvU2V0dGluZ3MpIHtcbiAgICB2YXIgdmlzID0gMDtcbiAgICAkLmVhY2gob1NldHRpbmdzLmFvQ29sdW1ucywgZnVuY3Rpb24gKGksIGNvbCkge1xuICAgICAgaWYgKGNvbC5iVmlzaWJsZSAmJiAkKGNvbC5uVGgpLmNzcygnZGlzcGxheScpICE9PSAnbm9uZScpIHtcbiAgICAgICAgdmlzKys7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHZpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkdldENvbHVtbnMob1NldHRpbmdzLCBzUGFyYW0pIHtcbiAgICB2YXIgYSA9IFtdO1xuICAgICQubWFwKG9TZXR0aW5ncy5hb0NvbHVtbnMsIGZ1bmN0aW9uICh2YWwsIGkpIHtcbiAgICAgIGlmICh2YWxbc1BhcmFtXSkge1xuICAgICAgICBhLnB1c2goaSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGE7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Db2x1bW5UeXBlcyhzZXR0aW5ncykge1xuICAgIHZhciBjb2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zO1xuICAgIHZhciBkYXRhID0gc2V0dGluZ3MuYW9EYXRhO1xuICAgIHZhciB0eXBlcyA9IERhdGFUYWJsZS5leHQudHlwZS5kZXRlY3Q7XG4gICAgdmFyIGksIGllbiwgaiwgamVuLCBrLCBrZW47XG4gICAgdmFyIGNvbCwgY2VsbCwgZGV0ZWN0ZWRUeXBlLCBjYWNoZTtcblxuICAgIGZvciAoaSA9IDAsIGllbiA9IGNvbHVtbnMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIGNvbCA9IGNvbHVtbnNbaV07XG4gICAgICBjYWNoZSA9IFtdO1xuXG4gICAgICBpZiAoIWNvbC5zVHlwZSAmJiBjb2wuX3NNYW51YWxUeXBlKSB7XG4gICAgICAgIGNvbC5zVHlwZSA9IGNvbC5fc01hbnVhbFR5cGU7XG4gICAgICB9IGVsc2UgaWYgKCFjb2wuc1R5cGUpIHtcbiAgICAgICAgZm9yIChqID0gMCwgamVuID0gdHlwZXMubGVuZ3RoOyBqIDwgamVuOyBqKyspIHtcbiAgICAgICAgICBmb3IgKGsgPSAwLCBrZW4gPSBkYXRhLmxlbmd0aDsgayA8IGtlbjsgaysrKSB7XG4gICAgICAgICAgICBpZiAoY2FjaGVba10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBjYWNoZVtrXSA9IF9mbkdldENlbGxEYXRhKHNldHRpbmdzLCBrLCBpLCAndHlwZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZXRlY3RlZFR5cGUgPSB0eXBlc1tqXShjYWNoZVtrXSwgc2V0dGluZ3MpO1xuXG4gICAgICAgICAgICBpZiAoIWRldGVjdGVkVHlwZSAmJiBqICE9PSB0eXBlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGV0ZWN0ZWRUeXBlID09PSAnaHRtbCcpIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGRldGVjdGVkVHlwZSkge1xuICAgICAgICAgICAgY29sLnNUeXBlID0gZGV0ZWN0ZWRUeXBlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb2wuc1R5cGUpIHtcbiAgICAgICAgICBjb2wuc1R5cGUgPSAnc3RyaW5nJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFwcGx5Q29sdW1uRGVmcyhvU2V0dGluZ3MsIGFvQ29sRGVmcywgYW9Db2xzLCBmbikge1xuICAgIHZhciBpLCBpTGVuLCBqLCBqTGVuLCBrLCBrTGVuLCBkZWY7XG4gICAgdmFyIGNvbHVtbnMgPSBvU2V0dGluZ3MuYW9Db2x1bW5zO1xuXG4gICAgaWYgKGFvQ29sRGVmcykge1xuICAgICAgZm9yIChpID0gYW9Db2xEZWZzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGRlZiA9IGFvQ29sRGVmc1tpXTtcbiAgICAgICAgdmFyIGFUYXJnZXRzID0gZGVmLnRhcmdldHMgIT09IHVuZGVmaW5lZCA/IGRlZi50YXJnZXRzIDogZGVmLmFUYXJnZXRzO1xuXG4gICAgICAgIGlmICghJC5pc0FycmF5KGFUYXJnZXRzKSkge1xuICAgICAgICAgIGFUYXJnZXRzID0gW2FUYXJnZXRzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaiA9IDAsIGpMZW4gPSBhVGFyZ2V0cy5sZW5ndGg7IGogPCBqTGVuOyBqKyspIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGFUYXJnZXRzW2pdID09PSAnbnVtYmVyJyAmJiBhVGFyZ2V0c1tqXSA+PSAwKSB7XG4gICAgICAgICAgICB3aGlsZSAoY29sdW1ucy5sZW5ndGggPD0gYVRhcmdldHNbal0pIHtcbiAgICAgICAgICAgICAgX2ZuQWRkQ29sdW1uKG9TZXR0aW5ncyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZuKGFUYXJnZXRzW2pdLCBkZWYpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFUYXJnZXRzW2pdID09PSAnbnVtYmVyJyAmJiBhVGFyZ2V0c1tqXSA8IDApIHtcbiAgICAgICAgICAgIGZuKGNvbHVtbnMubGVuZ3RoICsgYVRhcmdldHNbal0sIGRlZik7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYVRhcmdldHNbal0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmb3IgKGsgPSAwLCBrTGVuID0gY29sdW1ucy5sZW5ndGg7IGsgPCBrTGVuOyBrKyspIHtcbiAgICAgICAgICAgICAgaWYgKGFUYXJnZXRzW2pdID09IFwiX2FsbFwiIHx8ICQoY29sdW1uc1trXS5uVGgpLmhhc0NsYXNzKGFUYXJnZXRzW2pdKSkge1xuICAgICAgICAgICAgICAgIGZuKGssIGRlZik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYW9Db2xzKSB7XG4gICAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW9Db2xzLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICBmbihpLCBhb0NvbHNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFkZERhdGEob1NldHRpbmdzLCBhRGF0YUluLCBuVHIsIGFuVGRzKSB7XG4gICAgdmFyIGlSb3cgPSBvU2V0dGluZ3MuYW9EYXRhLmxlbmd0aDtcbiAgICB2YXIgb0RhdGEgPSAkLmV4dGVuZCh0cnVlLCB7fSwgRGF0YVRhYmxlLm1vZGVscy5vUm93LCB7XG4gICAgICBzcmM6IG5UciA/ICdkb20nIDogJ2RhdGEnLFxuICAgICAgaWR4OiBpUm93XG4gICAgfSk7XG4gICAgb0RhdGEuX2FEYXRhID0gYURhdGFJbjtcbiAgICBvU2V0dGluZ3MuYW9EYXRhLnB1c2gob0RhdGEpO1xuICAgIHZhciBuVGQsIHNUaGlzVHlwZTtcbiAgICB2YXIgY29sdW1ucyA9IG9TZXR0aW5ncy5hb0NvbHVtbnM7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGNvbHVtbnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICBjb2x1bW5zW2ldLnNUeXBlID0gbnVsbDtcbiAgICB9XG5cbiAgICBvU2V0dGluZ3MuYWlEaXNwbGF5TWFzdGVyLnB1c2goaVJvdyk7XG4gICAgdmFyIGlkID0gb1NldHRpbmdzLnJvd0lkRm4oYURhdGFJbik7XG5cbiAgICBpZiAoaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgb1NldHRpbmdzLmFJZHNbaWRdID0gb0RhdGE7XG4gICAgfVxuXG4gICAgaWYgKG5UciB8fCAhb1NldHRpbmdzLm9GZWF0dXJlcy5iRGVmZXJSZW5kZXIpIHtcbiAgICAgIF9mbkNyZWF0ZVRyKG9TZXR0aW5ncywgaVJvdywgblRyLCBhblRkcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlSb3c7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5BZGRUcihzZXR0aW5ncywgdHJzKSB7XG4gICAgdmFyIHJvdztcblxuICAgIGlmICghKHRycyBpbnN0YW5jZW9mICQpKSB7XG4gICAgICB0cnMgPSAkKHRycyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRycy5tYXAoZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICByb3cgPSBfZm5HZXRSb3dFbGVtZW50cyhzZXR0aW5ncywgZWwpO1xuICAgICAgcmV0dXJuIF9mbkFkZERhdGEoc2V0dGluZ3MsIHJvdy5kYXRhLCBlbCwgcm93LmNlbGxzKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbk5vZGVUb0RhdGFJbmRleChvU2V0dGluZ3MsIG4pIHtcbiAgICByZXR1cm4gbi5fRFRfUm93SW5kZXggIT09IHVuZGVmaW5lZCA/IG4uX0RUX1Jvd0luZGV4IDogbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbk5vZGVUb0NvbHVtbkluZGV4KG9TZXR0aW5ncywgaVJvdywgbikge1xuICAgIHJldHVybiAkLmluQXJyYXkobiwgb1NldHRpbmdzLmFvRGF0YVtpUm93XS5hbkNlbGxzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkdldENlbGxEYXRhKHNldHRpbmdzLCByb3dJZHgsIGNvbElkeCwgdHlwZSkge1xuICAgIHZhciBkcmF3ID0gc2V0dGluZ3MuaURyYXc7XG4gICAgdmFyIGNvbCA9IHNldHRpbmdzLmFvQ29sdW1uc1tjb2xJZHhdO1xuICAgIHZhciByb3dEYXRhID0gc2V0dGluZ3MuYW9EYXRhW3Jvd0lkeF0uX2FEYXRhO1xuICAgIHZhciBkZWZhdWx0Q29udGVudCA9IGNvbC5zRGVmYXVsdENvbnRlbnQ7XG4gICAgdmFyIGNlbGxEYXRhID0gY29sLmZuR2V0RGF0YShyb3dEYXRhLCB0eXBlLCB7XG4gICAgICBzZXR0aW5nczogc2V0dGluZ3MsXG4gICAgICByb3c6IHJvd0lkeCxcbiAgICAgIGNvbDogY29sSWR4XG4gICAgfSk7XG5cbiAgICBpZiAoY2VsbERhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHNldHRpbmdzLmlEcmF3RXJyb3IgIT0gZHJhdyAmJiBkZWZhdWx0Q29udGVudCA9PT0gbnVsbCkge1xuICAgICAgICBfZm5Mb2coc2V0dGluZ3MsIDAsIFwiUmVxdWVzdGVkIHVua25vd24gcGFyYW1ldGVyIFwiICsgKHR5cGVvZiBjb2wubURhdGEgPT0gJ2Z1bmN0aW9uJyA/ICd7ZnVuY3Rpb259JyA6IFwiJ1wiICsgY29sLm1EYXRhICsgXCInXCIpICsgXCIgZm9yIHJvdyBcIiArIHJvd0lkeCArIFwiLCBjb2x1bW4gXCIgKyBjb2xJZHgsIDQpO1xuXG4gICAgICAgIHNldHRpbmdzLmlEcmF3RXJyb3IgPSBkcmF3O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGVmYXVsdENvbnRlbnQ7XG4gICAgfVxuXG4gICAgaWYgKChjZWxsRGF0YSA9PT0gcm93RGF0YSB8fCBjZWxsRGF0YSA9PT0gbnVsbCkgJiYgZGVmYXVsdENvbnRlbnQgIT09IG51bGwgJiYgdHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjZWxsRGF0YSA9IGRlZmF1bHRDb250ZW50O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNlbGxEYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gY2VsbERhdGEuY2FsbChyb3dEYXRhKTtcbiAgICB9XG5cbiAgICBpZiAoY2VsbERhdGEgPT09IG51bGwgJiYgdHlwZSA9PSAnZGlzcGxheScpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gY2VsbERhdGE7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5TZXRDZWxsRGF0YShzZXR0aW5ncywgcm93SWR4LCBjb2xJZHgsIHZhbCkge1xuICAgIHZhciBjb2wgPSBzZXR0aW5ncy5hb0NvbHVtbnNbY29sSWR4XTtcbiAgICB2YXIgcm93RGF0YSA9IHNldHRpbmdzLmFvRGF0YVtyb3dJZHhdLl9hRGF0YTtcbiAgICBjb2wuZm5TZXREYXRhKHJvd0RhdGEsIHZhbCwge1xuICAgICAgc2V0dGluZ3M6IHNldHRpbmdzLFxuICAgICAgcm93OiByb3dJZHgsXG4gICAgICBjb2w6IGNvbElkeFxuICAgIH0pO1xuICB9XG5cbiAgdmFyIF9fcmVBcnJheSA9IC9cXFsuKj9cXF0kLztcbiAgdmFyIF9fcmVGbiA9IC9cXChcXCkkLztcblxuICBmdW5jdGlvbiBfZm5TcGxpdE9iak5vdGF0aW9uKHN0cikge1xuICAgIHJldHVybiAkLm1hcChzdHIubWF0Y2goLyhcXFxcLnxbXlxcLl0pKy9nKSB8fCBbJyddLCBmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIHMucmVwbGFjZSgvXFxcXFxcLi9nLCAnLicpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuR2V0T2JqZWN0RGF0YUZuKG1Tb3VyY2UpIHtcbiAgICBpZiAoJC5pc1BsYWluT2JqZWN0KG1Tb3VyY2UpKSB7XG4gICAgICB2YXIgbyA9IHt9O1xuICAgICAgJC5lYWNoKG1Tb3VyY2UsIGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgb1trZXldID0gX2ZuR2V0T2JqZWN0RGF0YUZuKHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhLCB0eXBlLCByb3csIG1ldGEpIHtcbiAgICAgICAgdmFyIHQgPSBvW3R5cGVdIHx8IG8uXztcbiAgICAgICAgcmV0dXJuIHQgIT09IHVuZGVmaW5lZCA/IHQoZGF0YSwgdHlwZSwgcm93LCBtZXRhKSA6IGRhdGE7XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobVNvdXJjZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtU291cmNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIHR5cGUsIHJvdywgbWV0YSkge1xuICAgICAgICByZXR1cm4gbVNvdXJjZShkYXRhLCB0eXBlLCByb3csIG1ldGEpO1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtU291cmNlID09PSAnc3RyaW5nJyAmJiAobVNvdXJjZS5pbmRleE9mKCcuJykgIT09IC0xIHx8IG1Tb3VyY2UuaW5kZXhPZignWycpICE9PSAtMSB8fCBtU291cmNlLmluZGV4T2YoJygnKSAhPT0gLTEpKSB7XG4gICAgICB2YXIgZmV0Y2hEYXRhID0gZnVuY3Rpb24gZmV0Y2hEYXRhKGRhdGEsIHR5cGUsIHNyYykge1xuICAgICAgICB2YXIgYXJyYXlOb3RhdGlvbiwgZnVuY05vdGF0aW9uLCBvdXQsIGlubmVyU3JjO1xuXG4gICAgICAgIGlmIChzcmMgIT09IFwiXCIpIHtcbiAgICAgICAgICB2YXIgYSA9IF9mblNwbGl0T2JqTm90YXRpb24oc3JjKTtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gYS5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgICAgIGFycmF5Tm90YXRpb24gPSBhW2ldLm1hdGNoKF9fcmVBcnJheSk7XG4gICAgICAgICAgICBmdW5jTm90YXRpb24gPSBhW2ldLm1hdGNoKF9fcmVGbik7XG5cbiAgICAgICAgICAgIGlmIChhcnJheU5vdGF0aW9uKSB7XG4gICAgICAgICAgICAgIGFbaV0gPSBhW2ldLnJlcGxhY2UoX19yZUFycmF5LCAnJyk7XG5cbiAgICAgICAgICAgICAgaWYgKGFbaV0gIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YVthW2ldXTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIG91dCA9IFtdO1xuICAgICAgICAgICAgICBhLnNwbGljZSgwLCBpICsgMSk7XG4gICAgICAgICAgICAgIGlubmVyU3JjID0gYS5qb2luKCcuJyk7XG5cbiAgICAgICAgICAgICAgaWYgKCQuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqTGVuID0gZGF0YS5sZW5ndGg7IGogPCBqTGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgIG91dC5wdXNoKGZldGNoRGF0YShkYXRhW2pdLCB0eXBlLCBpbm5lclNyYykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBqb2luID0gYXJyYXlOb3RhdGlvblswXS5zdWJzdHJpbmcoMSwgYXJyYXlOb3RhdGlvblswXS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgZGF0YSA9IGpvaW4gPT09IFwiXCIgPyBvdXQgOiBvdXQuam9pbihqb2luKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZ1bmNOb3RhdGlvbikge1xuICAgICAgICAgICAgICBhW2ldID0gYVtpXS5yZXBsYWNlKF9fcmVGbiwgJycpO1xuICAgICAgICAgICAgICBkYXRhID0gZGF0YVthW2ldXSgpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRhdGEgPT09IG51bGwgfHwgZGF0YVthW2ldXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGEgPSBkYXRhW2FbaV1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhLCB0eXBlKSB7XG4gICAgICAgIHJldHVybiBmZXRjaERhdGEoZGF0YSwgdHlwZSwgbVNvdXJjZSk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGRhdGFbbVNvdXJjZV07XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNldE9iamVjdERhdGFGbihtU291cmNlKSB7XG4gICAgaWYgKCQuaXNQbGFpbk9iamVjdChtU291cmNlKSkge1xuICAgICAgcmV0dXJuIF9mblNldE9iamVjdERhdGFGbihtU291cmNlLl8pO1xuICAgIH0gZWxzZSBpZiAobVNvdXJjZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHt9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1Tb3VyY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSwgdmFsLCBtZXRhKSB7XG4gICAgICAgIG1Tb3VyY2UoZGF0YSwgJ3NldCcsIHZhbCwgbWV0YSk7XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1Tb3VyY2UgPT09ICdzdHJpbmcnICYmIChtU291cmNlLmluZGV4T2YoJy4nKSAhPT0gLTEgfHwgbVNvdXJjZS5pbmRleE9mKCdbJykgIT09IC0xIHx8IG1Tb3VyY2UuaW5kZXhPZignKCcpICE9PSAtMSkpIHtcbiAgICAgIHZhciBzZXREYXRhID0gZnVuY3Rpb24gc2V0RGF0YShkYXRhLCB2YWwsIHNyYykge1xuICAgICAgICB2YXIgYSA9IF9mblNwbGl0T2JqTm90YXRpb24oc3JjKSxcbiAgICAgICAgICAgIGI7XG5cbiAgICAgICAgdmFyIGFMYXN0ID0gYVthLmxlbmd0aCAtIDFdO1xuICAgICAgICB2YXIgYXJyYXlOb3RhdGlvbiwgZnVuY05vdGF0aW9uLCBvLCBpbm5lclNyYztcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGEubGVuZ3RoIC0gMTsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICAgIGFycmF5Tm90YXRpb24gPSBhW2ldLm1hdGNoKF9fcmVBcnJheSk7XG4gICAgICAgICAgZnVuY05vdGF0aW9uID0gYVtpXS5tYXRjaChfX3JlRm4pO1xuXG4gICAgICAgICAgaWYgKGFycmF5Tm90YXRpb24pIHtcbiAgICAgICAgICAgIGFbaV0gPSBhW2ldLnJlcGxhY2UoX19yZUFycmF5LCAnJyk7XG4gICAgICAgICAgICBkYXRhW2FbaV1dID0gW107XG4gICAgICAgICAgICBiID0gYS5zbGljZSgpO1xuICAgICAgICAgICAgYi5zcGxpY2UoMCwgaSArIDEpO1xuICAgICAgICAgICAgaW5uZXJTcmMgPSBiLmpvaW4oJy4nKTtcblxuICAgICAgICAgICAgaWYgKCQuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqTGVuID0gdmFsLmxlbmd0aDsgaiA8IGpMZW47IGorKykge1xuICAgICAgICAgICAgICAgIG8gPSB7fTtcbiAgICAgICAgICAgICAgICBzZXREYXRhKG8sIHZhbFtqXSwgaW5uZXJTcmMpO1xuICAgICAgICAgICAgICAgIGRhdGFbYVtpXV0ucHVzaChvKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZGF0YVthW2ldXSA9IHZhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZnVuY05vdGF0aW9uKSB7XG4gICAgICAgICAgICBhW2ldID0gYVtpXS5yZXBsYWNlKF9fcmVGbiwgJycpO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGFbYVtpXV0odmFsKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZGF0YVthW2ldXSA9PT0gbnVsbCB8fCBkYXRhW2FbaV1dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRhdGFbYVtpXV0gPSB7fTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkYXRhID0gZGF0YVthW2ldXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhTGFzdC5tYXRjaChfX3JlRm4pKSB7XG4gICAgICAgICAgZGF0YSA9IGRhdGFbYUxhc3QucmVwbGFjZShfX3JlRm4sICcnKV0odmFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRhW2FMYXN0LnJlcGxhY2UoX19yZUFycmF5LCAnJyldID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIHZhbCkge1xuICAgICAgICByZXR1cm4gc2V0RGF0YShkYXRhLCB2YWwsIG1Tb3VyY2UpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhLCB2YWwpIHtcbiAgICAgICAgZGF0YVttU291cmNlXSA9IHZhbDtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuR2V0RGF0YU1hc3RlcihzZXR0aW5ncykge1xuICAgIHJldHVybiBfcGx1Y2soc2V0dGluZ3MuYW9EYXRhLCAnX2FEYXRhJyk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5DbGVhclRhYmxlKHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MuYW9EYXRhLmxlbmd0aCA9IDA7XG4gICAgc2V0dGluZ3MuYWlEaXNwbGF5TWFzdGVyLmxlbmd0aCA9IDA7XG4gICAgc2V0dGluZ3MuYWlEaXNwbGF5Lmxlbmd0aCA9IDA7XG4gICAgc2V0dGluZ3MuYUlkcyA9IHt9O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRGVsZXRlSW5kZXgoYSwgaVRhcmdldCwgc3BsaWNlKSB7XG4gICAgdmFyIGlUYXJnZXRJbmRleCA9IC0xO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSBhLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgaWYgKGFbaV0gPT0gaVRhcmdldCkge1xuICAgICAgICBpVGFyZ2V0SW5kZXggPSBpO1xuICAgICAgfSBlbHNlIGlmIChhW2ldID4gaVRhcmdldCkge1xuICAgICAgICBhW2ldLS07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlUYXJnZXRJbmRleCAhPSAtMSAmJiBzcGxpY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYS5zcGxpY2UoaVRhcmdldEluZGV4LCAxKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5JbnZhbGlkYXRlKHNldHRpbmdzLCByb3dJZHgsIHNyYywgY29sSWR4KSB7XG4gICAgdmFyIHJvdyA9IHNldHRpbmdzLmFvRGF0YVtyb3dJZHhdO1xuICAgIHZhciBpLCBpZW47XG5cbiAgICB2YXIgY2VsbFdyaXRlID0gZnVuY3Rpb24gY2VsbFdyaXRlKGNlbGwsIGNvbCkge1xuICAgICAgd2hpbGUgKGNlbGwuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgY2VsbC5yZW1vdmVDaGlsZChjZWxsLmZpcnN0Q2hpbGQpO1xuICAgICAgfVxuXG4gICAgICBjZWxsLmlubmVySFRNTCA9IF9mbkdldENlbGxEYXRhKHNldHRpbmdzLCByb3dJZHgsIGNvbCwgJ2Rpc3BsYXknKTtcbiAgICB9O1xuXG4gICAgaWYgKHNyYyA9PT0gJ2RvbScgfHwgKCFzcmMgfHwgc3JjID09PSAnYXV0bycpICYmIHJvdy5zcmMgPT09ICdkb20nKSB7XG4gICAgICByb3cuX2FEYXRhID0gX2ZuR2V0Um93RWxlbWVudHMoc2V0dGluZ3MsIHJvdywgY29sSWR4LCBjb2xJZHggPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHJvdy5fYURhdGEpLmRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBjZWxscyA9IHJvdy5hbkNlbGxzO1xuXG4gICAgICBpZiAoY2VsbHMpIHtcbiAgICAgICAgaWYgKGNvbElkeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY2VsbFdyaXRlKGNlbGxzW2NvbElkeF0sIGNvbElkeCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChpID0gMCwgaWVuID0gY2VsbHMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICAgIGNlbGxXcml0ZShjZWxsc1tpXSwgaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcm93Ll9hU29ydERhdGEgPSBudWxsO1xuICAgIHJvdy5fYUZpbHRlckRhdGEgPSBudWxsO1xuICAgIHZhciBjb2xzID0gc2V0dGluZ3MuYW9Db2x1bW5zO1xuXG4gICAgaWYgKGNvbElkeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb2xzW2NvbElkeF0uc1R5cGUgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSAwLCBpZW4gPSBjb2xzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGNvbHNbaV0uc1R5cGUgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBfZm5Sb3dBdHRyaWJ1dGVzKHNldHRpbmdzLCByb3cpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkdldFJvd0VsZW1lbnRzKHNldHRpbmdzLCByb3csIGNvbElkeCwgZCkge1xuICAgIHZhciB0ZHMgPSBbXSxcbiAgICAgICAgdGQgPSByb3cuZmlyc3RDaGlsZCxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgY29sLFxuICAgICAgICBvLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgY29udGVudHMsXG4gICAgICAgIGNvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnMsXG4gICAgICAgIG9iamVjdFJlYWQgPSBzZXR0aW5ncy5fcm93UmVhZE9iamVjdDtcbiAgICBkID0gZCAhPT0gdW5kZWZpbmVkID8gZCA6IG9iamVjdFJlYWQgPyB7fSA6IFtdO1xuXG4gICAgdmFyIGF0dHIgPSBmdW5jdGlvbiBhdHRyKHN0ciwgdGQpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3RyID09PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgaWR4ID0gc3RyLmluZGV4T2YoJ0AnKTtcblxuICAgICAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgICAgIHZhciBhdHRyID0gc3RyLnN1YnN0cmluZyhpZHggKyAxKTtcblxuICAgICAgICAgIHZhciBzZXR0ZXIgPSBfZm5TZXRPYmplY3REYXRhRm4oc3RyKTtcblxuICAgICAgICAgIHNldHRlcihkLCB0ZC5nZXRBdHRyaWJ1dGUoYXR0cikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBjZWxsUHJvY2VzcyA9IGZ1bmN0aW9uIGNlbGxQcm9jZXNzKGNlbGwpIHtcbiAgICAgIGlmIChjb2xJZHggPT09IHVuZGVmaW5lZCB8fCBjb2xJZHggPT09IGkpIHtcbiAgICAgICAgY29sID0gY29sdW1uc1tpXTtcbiAgICAgICAgY29udGVudHMgPSAkLnRyaW0oY2VsbC5pbm5lckhUTUwpO1xuXG4gICAgICAgIGlmIChjb2wgJiYgY29sLl9iQXR0clNyYykge1xuICAgICAgICAgIHZhciBzZXR0ZXIgPSBfZm5TZXRPYmplY3REYXRhRm4oY29sLm1EYXRhLl8pO1xuXG4gICAgICAgICAgc2V0dGVyKGQsIGNvbnRlbnRzKTtcbiAgICAgICAgICBhdHRyKGNvbC5tRGF0YS5zb3J0LCBjZWxsKTtcbiAgICAgICAgICBhdHRyKGNvbC5tRGF0YS50eXBlLCBjZWxsKTtcbiAgICAgICAgICBhdHRyKGNvbC5tRGF0YS5maWx0ZXIsIGNlbGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvYmplY3RSZWFkKSB7XG4gICAgICAgICAgICBpZiAoIWNvbC5fc2V0dGVyKSB7XG4gICAgICAgICAgICAgIGNvbC5fc2V0dGVyID0gX2ZuU2V0T2JqZWN0RGF0YUZuKGNvbC5tRGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbC5fc2V0dGVyKGQsIGNvbnRlbnRzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZFtpXSA9IGNvbnRlbnRzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpKys7XG4gICAgfTtcblxuICAgIGlmICh0ZCkge1xuICAgICAgd2hpbGUgKHRkKSB7XG4gICAgICAgIG5hbWUgPSB0ZC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgIGlmIChuYW1lID09IFwiVERcIiB8fCBuYW1lID09IFwiVEhcIikge1xuICAgICAgICAgIGNlbGxQcm9jZXNzKHRkKTtcbiAgICAgICAgICB0ZHMucHVzaCh0ZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0ZCA9IHRkLm5leHRTaWJsaW5nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0ZHMgPSByb3cuYW5DZWxscztcblxuICAgICAgZm9yICh2YXIgaiA9IDAsIGplbiA9IHRkcy5sZW5ndGg7IGogPCBqZW47IGorKykge1xuICAgICAgICBjZWxsUHJvY2Vzcyh0ZHNbal0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciByb3dOb2RlID0gcm93LmZpcnN0Q2hpbGQgPyByb3cgOiByb3cublRyO1xuXG4gICAgaWYgKHJvd05vZGUpIHtcbiAgICAgIHZhciBpZCA9IHJvd05vZGUuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgX2ZuU2V0T2JqZWN0RGF0YUZuKHNldHRpbmdzLnJvd0lkKShkLCBpZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IGQsXG4gICAgICBjZWxsczogdGRzXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNyZWF0ZVRyKG9TZXR0aW5ncywgaVJvdywgblRySW4sIGFuVGRzKSB7XG4gICAgdmFyIHJvdyA9IG9TZXR0aW5ncy5hb0RhdGFbaVJvd10sXG4gICAgICAgIHJvd0RhdGEgPSByb3cuX2FEYXRhLFxuICAgICAgICBjZWxscyA9IFtdLFxuICAgICAgICBuVHIsXG4gICAgICAgIG5UZCxcbiAgICAgICAgb0NvbCxcbiAgICAgICAgaSxcbiAgICAgICAgaUxlbjtcblxuICAgIGlmIChyb3cublRyID09PSBudWxsKSB7XG4gICAgICBuVHIgPSBuVHJJbiB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgICAgcm93Lm5UciA9IG5UcjtcbiAgICAgIHJvdy5hbkNlbGxzID0gY2VsbHM7XG4gICAgICBuVHIuX0RUX1Jvd0luZGV4ID0gaVJvdztcblxuICAgICAgX2ZuUm93QXR0cmlidXRlcyhvU2V0dGluZ3MsIHJvdyk7XG5cbiAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBvU2V0dGluZ3MuYW9Db2x1bW5zLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICBvQ29sID0gb1NldHRpbmdzLmFvQ29sdW1uc1tpXTtcbiAgICAgICAgblRkID0gblRySW4gPyBhblRkc1tpXSA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQob0NvbC5zQ2VsbFR5cGUpO1xuICAgICAgICBuVGQuX0RUX0NlbGxJbmRleCA9IHtcbiAgICAgICAgICByb3c6IGlSb3csXG4gICAgICAgICAgY29sdW1uOiBpXG4gICAgICAgIH07XG4gICAgICAgIGNlbGxzLnB1c2goblRkKTtcblxuICAgICAgICBpZiAoKCFuVHJJbiB8fCBvQ29sLm1SZW5kZXIgfHwgb0NvbC5tRGF0YSAhPT0gaSkgJiYgKCEkLmlzUGxhaW5PYmplY3Qob0NvbC5tRGF0YSkgfHwgb0NvbC5tRGF0YS5fICE9PSBpICsgJy5kaXNwbGF5JykpIHtcbiAgICAgICAgICBuVGQuaW5uZXJIVE1MID0gX2ZuR2V0Q2VsbERhdGEob1NldHRpbmdzLCBpUm93LCBpLCAnZGlzcGxheScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9Db2wuc0NsYXNzKSB7XG4gICAgICAgICAgblRkLmNsYXNzTmFtZSArPSAnICcgKyBvQ29sLnNDbGFzcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvQ29sLmJWaXNpYmxlICYmICFuVHJJbikge1xuICAgICAgICAgIG5Uci5hcHBlbmRDaGlsZChuVGQpO1xuICAgICAgICB9IGVsc2UgaWYgKCFvQ29sLmJWaXNpYmxlICYmIG5UckluKSB7XG4gICAgICAgICAgblRkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoblRkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvQ29sLmZuQ3JlYXRlZENlbGwpIHtcbiAgICAgICAgICBvQ29sLmZuQ3JlYXRlZENlbGwuY2FsbChvU2V0dGluZ3Mub0luc3RhbmNlLCBuVGQsIF9mbkdldENlbGxEYXRhKG9TZXR0aW5ncywgaVJvdywgaSksIHJvd0RhdGEsIGlSb3csIGkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9mbkNhbGxiYWNrRmlyZShvU2V0dGluZ3MsICdhb1Jvd0NyZWF0ZWRDYWxsYmFjaycsIG51bGwsIFtuVHIsIHJvd0RhdGEsIGlSb3csIGNlbGxzXSk7XG4gICAgfVxuXG4gICAgcm93Lm5Uci5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncm93Jyk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Sb3dBdHRyaWJ1dGVzKHNldHRpbmdzLCByb3cpIHtcbiAgICB2YXIgdHIgPSByb3cublRyO1xuICAgIHZhciBkYXRhID0gcm93Ll9hRGF0YTtcblxuICAgIGlmICh0cikge1xuICAgICAgdmFyIGlkID0gc2V0dGluZ3Mucm93SWRGbihkYXRhKTtcblxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHRyLmlkID0gaWQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhLkRUX1Jvd0NsYXNzKSB7XG4gICAgICAgIHZhciBhID0gZGF0YS5EVF9Sb3dDbGFzcy5zcGxpdCgnICcpO1xuICAgICAgICByb3cuX19yb3djID0gcm93Ll9fcm93YyA/IF91bmlxdWUocm93Ll9fcm93Yy5jb25jYXQoYSkpIDogYTtcbiAgICAgICAgJCh0cikucmVtb3ZlQ2xhc3Mocm93Ll9fcm93Yy5qb2luKCcgJykpLmFkZENsYXNzKGRhdGEuRFRfUm93Q2xhc3MpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YS5EVF9Sb3dBdHRyKSB7XG4gICAgICAgICQodHIpLmF0dHIoZGF0YS5EVF9Sb3dBdHRyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEuRFRfUm93RGF0YSkge1xuICAgICAgICAkKHRyKS5kYXRhKGRhdGEuRFRfUm93RGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQnVpbGRIZWFkKG9TZXR0aW5ncykge1xuICAgIHZhciBpLCBpZW4sIGNlbGwsIHJvdywgY29sdW1uO1xuICAgIHZhciB0aGVhZCA9IG9TZXR0aW5ncy5uVEhlYWQ7XG4gICAgdmFyIHRmb290ID0gb1NldHRpbmdzLm5URm9vdDtcbiAgICB2YXIgY3JlYXRlSGVhZGVyID0gJCgndGgsIHRkJywgdGhlYWQpLmxlbmd0aCA9PT0gMDtcbiAgICB2YXIgY2xhc3NlcyA9IG9TZXR0aW5ncy5vQ2xhc3NlcztcbiAgICB2YXIgY29sdW1ucyA9IG9TZXR0aW5ncy5hb0NvbHVtbnM7XG5cbiAgICBpZiAoY3JlYXRlSGVhZGVyKSB7XG4gICAgICByb3cgPSAkKCc8dHIvPicpLmFwcGVuZFRvKHRoZWFkKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBpZW4gPSBjb2x1bW5zLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBjb2x1bW4gPSBjb2x1bW5zW2ldO1xuICAgICAgY2VsbCA9ICQoY29sdW1uLm5UaCkuYWRkQ2xhc3MoY29sdW1uLnNDbGFzcyk7XG5cbiAgICAgIGlmIChjcmVhdGVIZWFkZXIpIHtcbiAgICAgICAgY2VsbC5hcHBlbmRUbyhyb3cpO1xuICAgICAgfVxuXG4gICAgICBpZiAob1NldHRpbmdzLm9GZWF0dXJlcy5iU29ydCkge1xuICAgICAgICBjZWxsLmFkZENsYXNzKGNvbHVtbi5zU29ydGluZ0NsYXNzKTtcblxuICAgICAgICBpZiAoY29sdW1uLmJTb3J0YWJsZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBjZWxsLmF0dHIoJ3RhYmluZGV4Jywgb1NldHRpbmdzLmlUYWJJbmRleCkuYXR0cignYXJpYS1jb250cm9scycsIG9TZXR0aW5ncy5zVGFibGVJZCk7XG5cbiAgICAgICAgICBfZm5Tb3J0QXR0YWNoTGlzdGVuZXIob1NldHRpbmdzLCBjb2x1bW4ublRoLCBpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY29sdW1uLnNUaXRsZSAhPSBjZWxsWzBdLmlubmVySFRNTCkge1xuICAgICAgICBjZWxsLmh0bWwoY29sdW1uLnNUaXRsZSk7XG4gICAgICB9XG5cbiAgICAgIF9mblJlbmRlcmVyKG9TZXR0aW5ncywgJ2hlYWRlcicpKG9TZXR0aW5ncywgY2VsbCwgY29sdW1uLCBjbGFzc2VzKTtcbiAgICB9XG5cbiAgICBpZiAoY3JlYXRlSGVhZGVyKSB7XG4gICAgICBfZm5EZXRlY3RIZWFkZXIob1NldHRpbmdzLmFvSGVhZGVyLCB0aGVhZCk7XG4gICAgfVxuXG4gICAgJCh0aGVhZCkuZmluZCgnPnRyJykuYXR0cigncm9sZScsICdyb3cnKTtcbiAgICAkKHRoZWFkKS5maW5kKCc+dHI+dGgsID50cj50ZCcpLmFkZENsYXNzKGNsYXNzZXMuc0hlYWRlclRIKTtcbiAgICAkKHRmb290KS5maW5kKCc+dHI+dGgsID50cj50ZCcpLmFkZENsYXNzKGNsYXNzZXMuc0Zvb3RlclRIKTtcblxuICAgIGlmICh0Zm9vdCAhPT0gbnVsbCkge1xuICAgICAgdmFyIGNlbGxzID0gb1NldHRpbmdzLmFvRm9vdGVyWzBdO1xuXG4gICAgICBmb3IgKGkgPSAwLCBpZW4gPSBjZWxscy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBjb2x1bW4gPSBjb2x1bW5zW2ldO1xuICAgICAgICBjb2x1bW4ublRmID0gY2VsbHNbaV0uY2VsbDtcblxuICAgICAgICBpZiAoY29sdW1uLnNDbGFzcykge1xuICAgICAgICAgICQoY29sdW1uLm5UZikuYWRkQ2xhc3MoY29sdW1uLnNDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5EcmF3SGVhZChvU2V0dGluZ3MsIGFvU291cmNlLCBiSW5jbHVkZUhpZGRlbikge1xuICAgIHZhciBpLCBpTGVuLCBqLCBqTGVuLCBrLCBrTGVuLCBuLCBuTG9jYWxUcjtcbiAgICB2YXIgYW9Mb2NhbCA9IFtdO1xuICAgIHZhciBhQXBwbGllZCA9IFtdO1xuICAgIHZhciBpQ29sdW1ucyA9IG9TZXR0aW5ncy5hb0NvbHVtbnMubGVuZ3RoO1xuICAgIHZhciBpUm93c3BhbiwgaUNvbHNwYW47XG5cbiAgICBpZiAoIWFvU291cmNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGJJbmNsdWRlSGlkZGVuID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGJJbmNsdWRlSGlkZGVuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMCwgaUxlbiA9IGFvU291cmNlLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgYW9Mb2NhbFtpXSA9IGFvU291cmNlW2ldLnNsaWNlKCk7XG4gICAgICBhb0xvY2FsW2ldLm5UciA9IGFvU291cmNlW2ldLm5UcjtcblxuICAgICAgZm9yIChqID0gaUNvbHVtbnMgLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICBpZiAoIW9TZXR0aW5ncy5hb0NvbHVtbnNbal0uYlZpc2libGUgJiYgIWJJbmNsdWRlSGlkZGVuKSB7XG4gICAgICAgICAgYW9Mb2NhbFtpXS5zcGxpY2UoaiwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYUFwcGxpZWQucHVzaChbXSk7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMCwgaUxlbiA9IGFvTG9jYWwubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICBuTG9jYWxUciA9IGFvTG9jYWxbaV0ublRyO1xuXG4gICAgICBpZiAobkxvY2FsVHIpIHtcbiAgICAgICAgd2hpbGUgKG4gPSBuTG9jYWxUci5maXJzdENoaWxkKSB7XG4gICAgICAgICAgbkxvY2FsVHIucmVtb3ZlQ2hpbGQobik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChqID0gMCwgakxlbiA9IGFvTG9jYWxbaV0ubGVuZ3RoOyBqIDwgakxlbjsgaisrKSB7XG4gICAgICAgIGlSb3dzcGFuID0gMTtcbiAgICAgICAgaUNvbHNwYW4gPSAxO1xuXG4gICAgICAgIGlmIChhQXBwbGllZFtpXVtqXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbkxvY2FsVHIuYXBwZW5kQ2hpbGQoYW9Mb2NhbFtpXVtqXS5jZWxsKTtcbiAgICAgICAgICBhQXBwbGllZFtpXVtqXSA9IDE7XG5cbiAgICAgICAgICB3aGlsZSAoYW9Mb2NhbFtpICsgaVJvd3NwYW5dICE9PSB1bmRlZmluZWQgJiYgYW9Mb2NhbFtpXVtqXS5jZWxsID09IGFvTG9jYWxbaSArIGlSb3dzcGFuXVtqXS5jZWxsKSB7XG4gICAgICAgICAgICBhQXBwbGllZFtpICsgaVJvd3NwYW5dW2pdID0gMTtcbiAgICAgICAgICAgIGlSb3dzcGFuKys7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgd2hpbGUgKGFvTG9jYWxbaV1baiArIGlDb2xzcGFuXSAhPT0gdW5kZWZpbmVkICYmIGFvTG9jYWxbaV1bal0uY2VsbCA9PSBhb0xvY2FsW2ldW2ogKyBpQ29sc3Bhbl0uY2VsbCkge1xuICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IGlSb3dzcGFuOyBrKyspIHtcbiAgICAgICAgICAgICAgYUFwcGxpZWRbaSArIGtdW2ogKyBpQ29sc3Bhbl0gPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpQ29sc3BhbisrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQoYW9Mb2NhbFtpXVtqXS5jZWxsKS5hdHRyKCdyb3dzcGFuJywgaVJvd3NwYW4pLmF0dHIoJ2NvbHNwYW4nLCBpQ29sc3Bhbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5EcmF3KG9TZXR0aW5ncykge1xuICAgIHZhciBhUHJlRHJhdyA9IF9mbkNhbGxiYWNrRmlyZShvU2V0dGluZ3MsICdhb1ByZURyYXdDYWxsYmFjaycsICdwcmVEcmF3JywgW29TZXR0aW5nc10pO1xuXG4gICAgaWYgKCQuaW5BcnJheShmYWxzZSwgYVByZURyYXcpICE9PSAtMSkge1xuICAgICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkob1NldHRpbmdzLCBmYWxzZSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaSwgaUxlbiwgbjtcbiAgICB2YXIgYW5Sb3dzID0gW107XG4gICAgdmFyIGlSb3dDb3VudCA9IDA7XG4gICAgdmFyIGFzU3RyaXBlQ2xhc3NlcyA9IG9TZXR0aW5ncy5hc1N0cmlwZUNsYXNzZXM7XG4gICAgdmFyIGlTdHJpcGVzID0gYXNTdHJpcGVDbGFzc2VzLmxlbmd0aDtcbiAgICB2YXIgaU9wZW5Sb3dzID0gb1NldHRpbmdzLmFvT3BlblJvd3MubGVuZ3RoO1xuICAgIHZhciBvTGFuZyA9IG9TZXR0aW5ncy5vTGFuZ3VhZ2U7XG4gICAgdmFyIGlJbml0RGlzcGxheVN0YXJ0ID0gb1NldHRpbmdzLmlJbml0RGlzcGxheVN0YXJ0O1xuICAgIHZhciBiU2VydmVyU2lkZSA9IF9mbkRhdGFTb3VyY2Uob1NldHRpbmdzKSA9PSAnc3NwJztcbiAgICB2YXIgYWlEaXNwbGF5ID0gb1NldHRpbmdzLmFpRGlzcGxheTtcbiAgICBvU2V0dGluZ3MuYkRyYXdpbmcgPSB0cnVlO1xuXG4gICAgaWYgKGlJbml0RGlzcGxheVN0YXJ0ICE9PSB1bmRlZmluZWQgJiYgaUluaXREaXNwbGF5U3RhcnQgIT09IC0xKSB7XG4gICAgICBvU2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQgPSBiU2VydmVyU2lkZSA/IGlJbml0RGlzcGxheVN0YXJ0IDogaUluaXREaXNwbGF5U3RhcnQgPj0gb1NldHRpbmdzLmZuUmVjb3Jkc0Rpc3BsYXkoKSA/IDAgOiBpSW5pdERpc3BsYXlTdGFydDtcbiAgICAgIG9TZXR0aW5ncy5pSW5pdERpc3BsYXlTdGFydCA9IC0xO1xuICAgIH1cblxuICAgIHZhciBpRGlzcGxheVN0YXJ0ID0gb1NldHRpbmdzLl9pRGlzcGxheVN0YXJ0O1xuICAgIHZhciBpRGlzcGxheUVuZCA9IG9TZXR0aW5ncy5mbkRpc3BsYXlFbmQoKTtcblxuICAgIGlmIChvU2V0dGluZ3MuYkRlZmVyTG9hZGluZykge1xuICAgICAgb1NldHRpbmdzLmJEZWZlckxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIG9TZXR0aW5ncy5pRHJhdysrO1xuXG4gICAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShvU2V0dGluZ3MsIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKCFiU2VydmVyU2lkZSkge1xuICAgICAgb1NldHRpbmdzLmlEcmF3Kys7XG4gICAgfSBlbHNlIGlmICghb1NldHRpbmdzLmJEZXN0cm95aW5nICYmICFfZm5BamF4VXBkYXRlKG9TZXR0aW5ncykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoYWlEaXNwbGF5Lmxlbmd0aCAhPT0gMCkge1xuICAgICAgdmFyIGlTdGFydCA9IGJTZXJ2ZXJTaWRlID8gMCA6IGlEaXNwbGF5U3RhcnQ7XG4gICAgICB2YXIgaUVuZCA9IGJTZXJ2ZXJTaWRlID8gb1NldHRpbmdzLmFvRGF0YS5sZW5ndGggOiBpRGlzcGxheUVuZDtcblxuICAgICAgZm9yICh2YXIgaiA9IGlTdGFydDsgaiA8IGlFbmQ7IGorKykge1xuICAgICAgICB2YXIgaURhdGFJbmRleCA9IGFpRGlzcGxheVtqXTtcbiAgICAgICAgdmFyIGFvRGF0YSA9IG9TZXR0aW5ncy5hb0RhdGFbaURhdGFJbmRleF07XG5cbiAgICAgICAgaWYgKGFvRGF0YS5uVHIgPT09IG51bGwpIHtcbiAgICAgICAgICBfZm5DcmVhdGVUcihvU2V0dGluZ3MsIGlEYXRhSW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5Sb3cgPSBhb0RhdGEublRyO1xuXG4gICAgICAgIGlmIChpU3RyaXBlcyAhPT0gMCkge1xuICAgICAgICAgIHZhciBzU3RyaXBlID0gYXNTdHJpcGVDbGFzc2VzW2lSb3dDb3VudCAlIGlTdHJpcGVzXTtcblxuICAgICAgICAgIGlmIChhb0RhdGEuX3NSb3dTdHJpcGUgIT0gc1N0cmlwZSkge1xuICAgICAgICAgICAgJChuUm93KS5yZW1vdmVDbGFzcyhhb0RhdGEuX3NSb3dTdHJpcGUpLmFkZENsYXNzKHNTdHJpcGUpO1xuICAgICAgICAgICAgYW9EYXRhLl9zUm93U3RyaXBlID0gc1N0cmlwZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCAnYW9Sb3dDYWxsYmFjaycsIG51bGwsIFtuUm93LCBhb0RhdGEuX2FEYXRhLCBpUm93Q291bnQsIGosIGlEYXRhSW5kZXhdKTtcblxuICAgICAgICBhblJvd3MucHVzaChuUm93KTtcbiAgICAgICAgaVJvd0NvdW50Kys7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzWmVybyA9IG9MYW5nLnNaZXJvUmVjb3JkcztcblxuICAgICAgaWYgKG9TZXR0aW5ncy5pRHJhdyA9PSAxICYmIF9mbkRhdGFTb3VyY2Uob1NldHRpbmdzKSA9PSAnYWpheCcpIHtcbiAgICAgICAgc1plcm8gPSBvTGFuZy5zTG9hZGluZ1JlY29yZHM7XG4gICAgICB9IGVsc2UgaWYgKG9MYW5nLnNFbXB0eVRhYmxlICYmIG9TZXR0aW5ncy5mblJlY29yZHNUb3RhbCgpID09PSAwKSB7XG4gICAgICAgIHNaZXJvID0gb0xhbmcuc0VtcHR5VGFibGU7XG4gICAgICB9XG5cbiAgICAgIGFuUm93c1swXSA9ICQoJzx0ci8+Jywge1xuICAgICAgICAnY2xhc3MnOiBpU3RyaXBlcyA/IGFzU3RyaXBlQ2xhc3Nlc1swXSA6ICcnXG4gICAgICB9KS5hcHBlbmQoJCgnPHRkIC8+Jywge1xuICAgICAgICAndmFsaWduJzogJ3RvcCcsXG4gICAgICAgICdjb2xTcGFuJzogX2ZuVmlzYmxlQ29sdW1ucyhvU2V0dGluZ3MpLFxuICAgICAgICAnY2xhc3MnOiBvU2V0dGluZ3Mub0NsYXNzZXMuc1Jvd0VtcHR5XG4gICAgICB9KS5odG1sKHNaZXJvKSlbMF07XG4gICAgfVxuXG4gICAgX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgJ2FvSGVhZGVyQ2FsbGJhY2snLCAnaGVhZGVyJywgWyQob1NldHRpbmdzLm5USGVhZCkuY2hpbGRyZW4oJ3RyJylbMF0sIF9mbkdldERhdGFNYXN0ZXIob1NldHRpbmdzKSwgaURpc3BsYXlTdGFydCwgaURpc3BsYXlFbmQsIGFpRGlzcGxheV0pO1xuXG4gICAgX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgJ2FvRm9vdGVyQ2FsbGJhY2snLCAnZm9vdGVyJywgWyQob1NldHRpbmdzLm5URm9vdCkuY2hpbGRyZW4oJ3RyJylbMF0sIF9mbkdldERhdGFNYXN0ZXIob1NldHRpbmdzKSwgaURpc3BsYXlTdGFydCwgaURpc3BsYXlFbmQsIGFpRGlzcGxheV0pO1xuXG4gICAgdmFyIGJvZHkgPSAkKG9TZXR0aW5ncy5uVEJvZHkpO1xuICAgIGJvZHkuY2hpbGRyZW4oKS5kZXRhY2goKTtcbiAgICBib2R5LmFwcGVuZCgkKGFuUm93cykpO1xuXG4gICAgX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgJ2FvRHJhd0NhbGxiYWNrJywgJ2RyYXcnLCBbb1NldHRpbmdzXSk7XG5cbiAgICBvU2V0dGluZ3MuYlNvcnRlZCA9IGZhbHNlO1xuICAgIG9TZXR0aW5ncy5iRmlsdGVyZWQgPSBmYWxzZTtcbiAgICBvU2V0dGluZ3MuYkRyYXdpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblJlRHJhdyhzZXR0aW5ncywgaG9sZFBvc2l0aW9uKSB7XG4gICAgdmFyIGZlYXR1cmVzID0gc2V0dGluZ3Mub0ZlYXR1cmVzLFxuICAgICAgICBzb3J0ID0gZmVhdHVyZXMuYlNvcnQsXG4gICAgICAgIGZpbHRlciA9IGZlYXR1cmVzLmJGaWx0ZXI7XG5cbiAgICBpZiAoc29ydCkge1xuICAgICAgX2ZuU29ydChzZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgaWYgKGZpbHRlcikge1xuICAgICAgX2ZuRmlsdGVyQ29tcGxldGUoc2V0dGluZ3MsIHNldHRpbmdzLm9QcmV2aW91c1NlYXJjaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldHRpbmdzLmFpRGlzcGxheSA9IHNldHRpbmdzLmFpRGlzcGxheU1hc3Rlci5zbGljZSgpO1xuICAgIH1cblxuICAgIGlmIChob2xkUG9zaXRpb24gIT09IHRydWUpIHtcbiAgICAgIHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0ID0gMDtcbiAgICB9XG5cbiAgICBzZXR0aW5ncy5fZHJhd0hvbGQgPSBob2xkUG9zaXRpb247XG5cbiAgICBfZm5EcmF3KHNldHRpbmdzKTtcblxuICAgIHNldHRpbmdzLl9kcmF3SG9sZCA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQWRkT3B0aW9uc0h0bWwob1NldHRpbmdzKSB7XG4gICAgdmFyIGNsYXNzZXMgPSBvU2V0dGluZ3Mub0NsYXNzZXM7XG4gICAgdmFyIHRhYmxlID0gJChvU2V0dGluZ3MublRhYmxlKTtcbiAgICB2YXIgaG9sZGluZyA9ICQoJzxkaXYvPicpLmluc2VydEJlZm9yZSh0YWJsZSk7XG4gICAgdmFyIGZlYXR1cmVzID0gb1NldHRpbmdzLm9GZWF0dXJlcztcbiAgICB2YXIgaW5zZXJ0ID0gJCgnPGRpdi8+Jywge1xuICAgICAgaWQ6IG9TZXR0aW5ncy5zVGFibGVJZCArICdfd3JhcHBlcicsXG4gICAgICAnY2xhc3MnOiBjbGFzc2VzLnNXcmFwcGVyICsgKG9TZXR0aW5ncy5uVEZvb3QgPyAnJyA6ICcgJyArIGNsYXNzZXMuc05vRm9vdGVyKVxuICAgIH0pO1xuICAgIG9TZXR0aW5ncy5uSG9sZGluZyA9IGhvbGRpbmdbMF07XG4gICAgb1NldHRpbmdzLm5UYWJsZVdyYXBwZXIgPSBpbnNlcnRbMF07XG4gICAgb1NldHRpbmdzLm5UYWJsZVJlaW5zZXJ0QmVmb3JlID0gb1NldHRpbmdzLm5UYWJsZS5uZXh0U2libGluZztcbiAgICB2YXIgYURvbSA9IG9TZXR0aW5ncy5zRG9tLnNwbGl0KCcnKTtcbiAgICB2YXIgZmVhdHVyZU5vZGUsIGNPcHRpb24sIG5OZXdOb2RlLCBjTmV4dCwgc0F0dHIsIGo7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFEb20ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZlYXR1cmVOb2RlID0gbnVsbDtcbiAgICAgIGNPcHRpb24gPSBhRG9tW2ldO1xuXG4gICAgICBpZiAoY09wdGlvbiA9PSAnPCcpIHtcbiAgICAgICAgbk5ld05vZGUgPSAkKCc8ZGl2Lz4nKVswXTtcbiAgICAgICAgY05leHQgPSBhRG9tW2kgKyAxXTtcblxuICAgICAgICBpZiAoY05leHQgPT0gXCInXCIgfHwgY05leHQgPT0gJ1wiJykge1xuICAgICAgICAgIHNBdHRyID0gXCJcIjtcbiAgICAgICAgICBqID0gMjtcblxuICAgICAgICAgIHdoaWxlIChhRG9tW2kgKyBqXSAhPSBjTmV4dCkge1xuICAgICAgICAgICAgc0F0dHIgKz0gYURvbVtpICsgal07XG4gICAgICAgICAgICBqKys7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNBdHRyID09IFwiSFwiKSB7XG4gICAgICAgICAgICBzQXR0ciA9IGNsYXNzZXMuc0pVSUhlYWRlcjtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNBdHRyID09IFwiRlwiKSB7XG4gICAgICAgICAgICBzQXR0ciA9IGNsYXNzZXMuc0pVSUZvb3RlcjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc0F0dHIuaW5kZXhPZignLicpICE9IC0xKSB7XG4gICAgICAgICAgICB2YXIgYVNwbGl0ID0gc0F0dHIuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIG5OZXdOb2RlLmlkID0gYVNwbGl0WzBdLnN1YnN0cigxLCBhU3BsaXRbMF0ubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICBuTmV3Tm9kZS5jbGFzc05hbWUgPSBhU3BsaXRbMV07XG4gICAgICAgICAgfSBlbHNlIGlmIChzQXR0ci5jaGFyQXQoMCkgPT0gXCIjXCIpIHtcbiAgICAgICAgICAgIG5OZXdOb2RlLmlkID0gc0F0dHIuc3Vic3RyKDEsIHNBdHRyLmxlbmd0aCAtIDEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuTmV3Tm9kZS5jbGFzc05hbWUgPSBzQXR0cjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpICs9IGo7XG4gICAgICAgIH1cblxuICAgICAgICBpbnNlcnQuYXBwZW5kKG5OZXdOb2RlKTtcbiAgICAgICAgaW5zZXJ0ID0gJChuTmV3Tm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKGNPcHRpb24gPT0gJz4nKSB7XG4gICAgICAgIGluc2VydCA9IGluc2VydC5wYXJlbnQoKTtcbiAgICAgIH0gZWxzZSBpZiAoY09wdGlvbiA9PSAnbCcgJiYgZmVhdHVyZXMuYlBhZ2luYXRlICYmIGZlYXR1cmVzLmJMZW5ndGhDaGFuZ2UpIHtcbiAgICAgICAgICBmZWF0dXJlTm9kZSA9IF9mbkZlYXR1cmVIdG1sTGVuZ3RoKG9TZXR0aW5ncyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY09wdGlvbiA9PSAnZicgJiYgZmVhdHVyZXMuYkZpbHRlcikge1xuICAgICAgICAgIGZlYXR1cmVOb2RlID0gX2ZuRmVhdHVyZUh0bWxGaWx0ZXIob1NldHRpbmdzKTtcbiAgICAgICAgfSBlbHNlIGlmIChjT3B0aW9uID09ICdyJyAmJiBmZWF0dXJlcy5iUHJvY2Vzc2luZykge1xuICAgICAgICAgIGZlYXR1cmVOb2RlID0gX2ZuRmVhdHVyZUh0bWxQcm9jZXNzaW5nKG9TZXR0aW5ncyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY09wdGlvbiA9PSAndCcpIHtcbiAgICAgICAgICBmZWF0dXJlTm9kZSA9IF9mbkZlYXR1cmVIdG1sVGFibGUob1NldHRpbmdzKTtcbiAgICAgICAgfSBlbHNlIGlmIChjT3B0aW9uID09ICdpJyAmJiBmZWF0dXJlcy5iSW5mbykge1xuICAgICAgICAgIGZlYXR1cmVOb2RlID0gX2ZuRmVhdHVyZUh0bWxJbmZvKG9TZXR0aW5ncyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY09wdGlvbiA9PSAncCcgJiYgZmVhdHVyZXMuYlBhZ2luYXRlKSB7XG4gICAgICAgICAgZmVhdHVyZU5vZGUgPSBfZm5GZWF0dXJlSHRtbFBhZ2luYXRlKG9TZXR0aW5ncyk7XG4gICAgICAgIH0gZWxzZSBpZiAoRGF0YVRhYmxlLmV4dC5mZWF0dXJlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgIHZhciBhb0ZlYXR1cmVzID0gRGF0YVRhYmxlLmV4dC5mZWF0dXJlO1xuXG4gICAgICAgICAgZm9yICh2YXIgayA9IDAsIGtMZW4gPSBhb0ZlYXR1cmVzLmxlbmd0aDsgayA8IGtMZW47IGsrKykge1xuICAgICAgICAgICAgaWYgKGNPcHRpb24gPT0gYW9GZWF0dXJlc1trXS5jRmVhdHVyZSkge1xuICAgICAgICAgICAgICBmZWF0dXJlTm9kZSA9IGFvRmVhdHVyZXNba10uZm5Jbml0KG9TZXR0aW5ncyk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICBpZiAoZmVhdHVyZU5vZGUpIHtcbiAgICAgICAgdmFyIGFhbkZlYXR1cmVzID0gb1NldHRpbmdzLmFhbkZlYXR1cmVzO1xuXG4gICAgICAgIGlmICghYWFuRmVhdHVyZXNbY09wdGlvbl0pIHtcbiAgICAgICAgICBhYW5GZWF0dXJlc1tjT3B0aW9uXSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgYWFuRmVhdHVyZXNbY09wdGlvbl0ucHVzaChmZWF0dXJlTm9kZSk7XG4gICAgICAgIGluc2VydC5hcHBlbmQoZmVhdHVyZU5vZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhvbGRpbmcucmVwbGFjZVdpdGgoaW5zZXJ0KTtcbiAgICBvU2V0dGluZ3MubkhvbGRpbmcgPSBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRGV0ZWN0SGVhZGVyKGFMYXlvdXQsIG5UaGVhZCkge1xuICAgIHZhciBuVHJzID0gJChuVGhlYWQpLmNoaWxkcmVuKCd0cicpO1xuICAgIHZhciBuVHIsIG5DZWxsO1xuICAgIHZhciBpLCBrLCBsLCBpTGVuLCBqTGVuLCBpQ29sU2hpZnRlZCwgaUNvbHVtbiwgaUNvbHNwYW4sIGlSb3dzcGFuO1xuICAgIHZhciBiVW5pcXVlO1xuXG4gICAgdmFyIGZuU2hpZnRDb2wgPSBmdW5jdGlvbiBmblNoaWZ0Q29sKGEsIGksIGopIHtcbiAgICAgIHZhciBrID0gYVtpXTtcblxuICAgICAgd2hpbGUgKGtbal0pIHtcbiAgICAgICAgaisrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gajtcbiAgICB9O1xuXG4gICAgYUxheW91dC5zcGxpY2UoMCwgYUxheW91dC5sZW5ndGgpO1xuXG4gICAgZm9yIChpID0gMCwgaUxlbiA9IG5UcnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICBhTGF5b3V0LnB1c2goW10pO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGlMZW4gPSBuVHJzLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgblRyID0gblRyc1tpXTtcbiAgICAgIGlDb2x1bW4gPSAwO1xuICAgICAgbkNlbGwgPSBuVHIuZmlyc3RDaGlsZDtcblxuICAgICAgd2hpbGUgKG5DZWxsKSB7XG4gICAgICAgIGlmIChuQ2VsbC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09IFwiVERcIiB8fCBuQ2VsbC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09IFwiVEhcIikge1xuICAgICAgICAgIGlDb2xzcGFuID0gbkNlbGwuZ2V0QXR0cmlidXRlKCdjb2xzcGFuJykgKiAxO1xuICAgICAgICAgIGlSb3dzcGFuID0gbkNlbGwuZ2V0QXR0cmlidXRlKCdyb3dzcGFuJykgKiAxO1xuICAgICAgICAgIGlDb2xzcGFuID0gIWlDb2xzcGFuIHx8IGlDb2xzcGFuID09PSAwIHx8IGlDb2xzcGFuID09PSAxID8gMSA6IGlDb2xzcGFuO1xuICAgICAgICAgIGlSb3dzcGFuID0gIWlSb3dzcGFuIHx8IGlSb3dzcGFuID09PSAwIHx8IGlSb3dzcGFuID09PSAxID8gMSA6IGlSb3dzcGFuO1xuICAgICAgICAgIGlDb2xTaGlmdGVkID0gZm5TaGlmdENvbChhTGF5b3V0LCBpLCBpQ29sdW1uKTtcbiAgICAgICAgICBiVW5pcXVlID0gaUNvbHNwYW4gPT09IDEgPyB0cnVlIDogZmFsc2U7XG5cbiAgICAgICAgICBmb3IgKGwgPSAwOyBsIDwgaUNvbHNwYW47IGwrKykge1xuICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IGlSb3dzcGFuOyBrKyspIHtcbiAgICAgICAgICAgICAgYUxheW91dFtpICsga11baUNvbFNoaWZ0ZWQgKyBsXSA9IHtcbiAgICAgICAgICAgICAgICBcImNlbGxcIjogbkNlbGwsXG4gICAgICAgICAgICAgICAgXCJ1bmlxdWVcIjogYlVuaXF1ZVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBhTGF5b3V0W2kgKyBrXS5uVHIgPSBuVHI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbkNlbGwgPSBuQ2VsbC5uZXh0U2libGluZztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5HZXRVbmlxdWVUaHMob1NldHRpbmdzLCBuSGVhZGVyLCBhTGF5b3V0KSB7XG4gICAgdmFyIGFSZXR1cm4gPSBbXTtcblxuICAgIGlmICghYUxheW91dCkge1xuICAgICAgYUxheW91dCA9IG9TZXR0aW5ncy5hb0hlYWRlcjtcblxuICAgICAgaWYgKG5IZWFkZXIpIHtcbiAgICAgICAgYUxheW91dCA9IFtdO1xuXG4gICAgICAgIF9mbkRldGVjdEhlYWRlcihhTGF5b3V0LCBuSGVhZGVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGFMYXlvdXQubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMCwgakxlbiA9IGFMYXlvdXRbaV0ubGVuZ3RoOyBqIDwgakxlbjsgaisrKSB7XG4gICAgICAgIGlmIChhTGF5b3V0W2ldW2pdLnVuaXF1ZSAmJiAoIWFSZXR1cm5bal0gfHwgIW9TZXR0aW5ncy5iU29ydENlbGxzVG9wKSkge1xuICAgICAgICAgIGFSZXR1cm5bal0gPSBhTGF5b3V0W2ldW2pdLmNlbGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYVJldHVybjtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkJ1aWxkQWpheChvU2V0dGluZ3MsIGRhdGEsIGZuKSB7XG4gICAgX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgJ2FvU2VydmVyUGFyYW1zJywgJ3NlcnZlclBhcmFtcycsIFtkYXRhXSk7XG5cbiAgICBpZiAoZGF0YSAmJiAkLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHZhciB0bXAgPSB7fTtcbiAgICAgIHZhciByYnJhY2tldCA9IC8oLio/KVxcW1xcXSQvO1xuICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgICAgICB2YXIgbWF0Y2ggPSB2YWwubmFtZS5tYXRjaChyYnJhY2tldCk7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgdmFyIG5hbWUgPSBtYXRjaFswXTtcblxuICAgICAgICAgIGlmICghdG1wW25hbWVdKSB7XG4gICAgICAgICAgICB0bXBbbmFtZV0gPSBbXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0bXBbbmFtZV0ucHVzaCh2YWwudmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRtcFt2YWwubmFtZV0gPSB2YWwudmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZGF0YSA9IHRtcDtcbiAgICB9XG5cbiAgICB2YXIgYWpheERhdGE7XG4gICAgdmFyIGFqYXggPSBvU2V0dGluZ3MuYWpheDtcbiAgICB2YXIgaW5zdGFuY2UgPSBvU2V0dGluZ3Mub0luc3RhbmNlO1xuXG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gY2FsbGJhY2soanNvbikge1xuICAgICAgX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgbnVsbCwgJ3hocicsIFtvU2V0dGluZ3MsIGpzb24sIG9TZXR0aW5ncy5qcVhIUl0pO1xuXG4gICAgICBmbihqc29uKTtcbiAgICB9O1xuXG4gICAgaWYgKCQuaXNQbGFpbk9iamVjdChhamF4KSAmJiBhamF4LmRhdGEpIHtcbiAgICAgIGFqYXhEYXRhID0gYWpheC5kYXRhO1xuICAgICAgdmFyIG5ld0RhdGEgPSB0eXBlb2YgYWpheERhdGEgPT09ICdmdW5jdGlvbicgPyBhamF4RGF0YShkYXRhLCBvU2V0dGluZ3MpIDogYWpheERhdGE7XG4gICAgICBkYXRhID0gdHlwZW9mIGFqYXhEYXRhID09PSAnZnVuY3Rpb24nICYmIG5ld0RhdGEgPyBuZXdEYXRhIDogJC5leHRlbmQodHJ1ZSwgZGF0YSwgbmV3RGF0YSk7XG4gICAgICBkZWxldGUgYWpheC5kYXRhO1xuICAgIH1cblxuICAgIHZhciBiYXNlQWpheCA9IHtcbiAgICAgIFwiZGF0YVwiOiBkYXRhLFxuICAgICAgXCJzdWNjZXNzXCI6IGZ1bmN0aW9uIHN1Y2Nlc3MoanNvbikge1xuICAgICAgICB2YXIgZXJyb3IgPSBqc29uLmVycm9yIHx8IGpzb24uc0Vycm9yO1xuXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIF9mbkxvZyhvU2V0dGluZ3MsIDAsIGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9TZXR0aW5ncy5qc29uID0ganNvbjtcbiAgICAgICAgY2FsbGJhY2soanNvbik7XG4gICAgICB9LFxuICAgICAgXCJkYXRhVHlwZVwiOiBcImpzb25cIixcbiAgICAgIFwiY2FjaGVcIjogZmFsc2UsXG4gICAgICBcInR5cGVcIjogb1NldHRpbmdzLnNTZXJ2ZXJNZXRob2QsXG4gICAgICBcImVycm9yXCI6IGZ1bmN0aW9uIGVycm9yKHhociwgX2Vycm9yLCB0aHJvd24pIHtcbiAgICAgICAgdmFyIHJldCA9IF9mbkNhbGxiYWNrRmlyZShvU2V0dGluZ3MsIG51bGwsICd4aHInLCBbb1NldHRpbmdzLCBudWxsLCBvU2V0dGluZ3MuanFYSFJdKTtcblxuICAgICAgICBpZiAoJC5pbkFycmF5KHRydWUsIHJldCkgPT09IC0xKSB7XG4gICAgICAgICAgaWYgKF9lcnJvciA9PSBcInBhcnNlcmVycm9yXCIpIHtcbiAgICAgICAgICAgIF9mbkxvZyhvU2V0dGluZ3MsIDAsICdJbnZhbGlkIEpTT04gcmVzcG9uc2UnLCAxKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICBfZm5Mb2cob1NldHRpbmdzLCAwLCAnQWpheCBlcnJvcicsIDcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KG9TZXR0aW5ncywgZmFsc2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgb1NldHRpbmdzLm9BamF4RGF0YSA9IGRhdGE7XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCBudWxsLCAncHJlWGhyJywgW29TZXR0aW5ncywgZGF0YV0pO1xuXG4gICAgaWYgKG9TZXR0aW5ncy5mblNlcnZlckRhdGEpIHtcbiAgICAgIG9TZXR0aW5ncy5mblNlcnZlckRhdGEuY2FsbChpbnN0YW5jZSwgb1NldHRpbmdzLnNBamF4U291cmNlLCAkLm1hcChkYXRhLCBmdW5jdGlvbiAodmFsLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiBrZXksXG4gICAgICAgICAgdmFsdWU6IHZhbFxuICAgICAgICB9O1xuICAgICAgfSksIGNhbGxiYWNrLCBvU2V0dGluZ3MpO1xuICAgIH0gZWxzZSBpZiAob1NldHRpbmdzLnNBamF4U291cmNlIHx8IHR5cGVvZiBhamF4ID09PSAnc3RyaW5nJykge1xuICAgICAgb1NldHRpbmdzLmpxWEhSID0gJC5hamF4KCQuZXh0ZW5kKGJhc2VBamF4LCB7XG4gICAgICAgIHVybDogYWpheCB8fCBvU2V0dGluZ3Muc0FqYXhTb3VyY2VcbiAgICAgIH0pKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBhamF4ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvU2V0dGluZ3MuanFYSFIgPSBhamF4LmNhbGwoaW5zdGFuY2UsIGRhdGEsIGNhbGxiYWNrLCBvU2V0dGluZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvU2V0dGluZ3MuanFYSFIgPSAkLmFqYXgoJC5leHRlbmQoYmFzZUFqYXgsIGFqYXgpKTtcbiAgICAgIGFqYXguZGF0YSA9IGFqYXhEYXRhO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFqYXhVcGRhdGUoc2V0dGluZ3MpIHtcbiAgICBpZiAoc2V0dGluZ3MuYkFqYXhEYXRhR2V0KSB7XG4gICAgICBzZXR0aW5ncy5pRHJhdysrO1xuXG4gICAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShzZXR0aW5ncywgdHJ1ZSk7XG5cbiAgICAgIF9mbkJ1aWxkQWpheChzZXR0aW5ncywgX2ZuQWpheFBhcmFtZXRlcnMoc2V0dGluZ3MpLCBmdW5jdGlvbiAoanNvbikge1xuICAgICAgICBfZm5BamF4VXBkYXRlRHJhdyhzZXR0aW5ncywganNvbik7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQWpheFBhcmFtZXRlcnMoc2V0dGluZ3MpIHtcbiAgICB2YXIgY29sdW1ucyA9IHNldHRpbmdzLmFvQ29sdW1ucyxcbiAgICAgICAgY29sdW1uQ291bnQgPSBjb2x1bW5zLmxlbmd0aCxcbiAgICAgICAgZmVhdHVyZXMgPSBzZXR0aW5ncy5vRmVhdHVyZXMsXG4gICAgICAgIHByZVNlYXJjaCA9IHNldHRpbmdzLm9QcmV2aW91c1NlYXJjaCxcbiAgICAgICAgcHJlQ29sU2VhcmNoID0gc2V0dGluZ3MuYW9QcmVTZWFyY2hDb2xzLFxuICAgICAgICBpLFxuICAgICAgICBkYXRhID0gW10sXG4gICAgICAgIGRhdGFQcm9wLFxuICAgICAgICBjb2x1bW4sXG4gICAgICAgIGNvbHVtblNlYXJjaCxcbiAgICAgICAgc29ydCA9IF9mblNvcnRGbGF0dGVuKHNldHRpbmdzKSxcbiAgICAgICAgZGlzcGxheVN0YXJ0ID0gc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQsXG4gICAgICAgIGRpc3BsYXlMZW5ndGggPSBmZWF0dXJlcy5iUGFnaW5hdGUgIT09IGZhbHNlID8gc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoIDogLTE7XG5cbiAgICB2YXIgcGFyYW0gPSBmdW5jdGlvbiBwYXJhbShuYW1lLCB2YWx1ZSkge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgJ25hbWUnOiBuYW1lLFxuICAgICAgICAndmFsdWUnOiB2YWx1ZVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHBhcmFtKCdzRWNobycsIHNldHRpbmdzLmlEcmF3KTtcbiAgICBwYXJhbSgnaUNvbHVtbnMnLCBjb2x1bW5Db3VudCk7XG4gICAgcGFyYW0oJ3NDb2x1bW5zJywgX3BsdWNrKGNvbHVtbnMsICdzTmFtZScpLmpvaW4oJywnKSk7XG4gICAgcGFyYW0oJ2lEaXNwbGF5U3RhcnQnLCBkaXNwbGF5U3RhcnQpO1xuICAgIHBhcmFtKCdpRGlzcGxheUxlbmd0aCcsIGRpc3BsYXlMZW5ndGgpO1xuICAgIHZhciBkID0ge1xuICAgICAgZHJhdzogc2V0dGluZ3MuaURyYXcsXG4gICAgICBjb2x1bW5zOiBbXSxcbiAgICAgIG9yZGVyOiBbXSxcbiAgICAgIHN0YXJ0OiBkaXNwbGF5U3RhcnQsXG4gICAgICBsZW5ndGg6IGRpc3BsYXlMZW5ndGgsXG4gICAgICBzZWFyY2g6IHtcbiAgICAgICAgdmFsdWU6IHByZVNlYXJjaC5zU2VhcmNoLFxuICAgICAgICByZWdleDogcHJlU2VhcmNoLmJSZWdleFxuICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgY29sdW1uQ291bnQ7IGkrKykge1xuICAgICAgY29sdW1uID0gY29sdW1uc1tpXTtcbiAgICAgIGNvbHVtblNlYXJjaCA9IHByZUNvbFNlYXJjaFtpXTtcbiAgICAgIGRhdGFQcm9wID0gdHlwZW9mIGNvbHVtbi5tRGF0YSA9PSBcImZ1bmN0aW9uXCIgPyAnZnVuY3Rpb24nIDogY29sdW1uLm1EYXRhO1xuICAgICAgZC5jb2x1bW5zLnB1c2goe1xuICAgICAgICBkYXRhOiBkYXRhUHJvcCxcbiAgICAgICAgbmFtZTogY29sdW1uLnNOYW1lLFxuICAgICAgICBzZWFyY2hhYmxlOiBjb2x1bW4uYlNlYXJjaGFibGUsXG4gICAgICAgIG9yZGVyYWJsZTogY29sdW1uLmJTb3J0YWJsZSxcbiAgICAgICAgc2VhcmNoOiB7XG4gICAgICAgICAgdmFsdWU6IGNvbHVtblNlYXJjaC5zU2VhcmNoLFxuICAgICAgICAgIHJlZ2V4OiBjb2x1bW5TZWFyY2guYlJlZ2V4XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcGFyYW0oXCJtRGF0YVByb3BfXCIgKyBpLCBkYXRhUHJvcCk7XG5cbiAgICAgIGlmIChmZWF0dXJlcy5iRmlsdGVyKSB7XG4gICAgICAgIHBhcmFtKCdzU2VhcmNoXycgKyBpLCBjb2x1bW5TZWFyY2guc1NlYXJjaCk7XG4gICAgICAgIHBhcmFtKCdiUmVnZXhfJyArIGksIGNvbHVtblNlYXJjaC5iUmVnZXgpO1xuICAgICAgICBwYXJhbSgnYlNlYXJjaGFibGVfJyArIGksIGNvbHVtbi5iU2VhcmNoYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChmZWF0dXJlcy5iU29ydCkge1xuICAgICAgICBwYXJhbSgnYlNvcnRhYmxlXycgKyBpLCBjb2x1bW4uYlNvcnRhYmxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZmVhdHVyZXMuYkZpbHRlcikge1xuICAgICAgcGFyYW0oJ3NTZWFyY2gnLCBwcmVTZWFyY2guc1NlYXJjaCk7XG4gICAgICBwYXJhbSgnYlJlZ2V4JywgcHJlU2VhcmNoLmJSZWdleCk7XG4gICAgfVxuXG4gICAgaWYgKGZlYXR1cmVzLmJTb3J0KSB7XG4gICAgICAkLmVhY2goc29ydCwgZnVuY3Rpb24gKGksIHZhbCkge1xuICAgICAgICBkLm9yZGVyLnB1c2goe1xuICAgICAgICAgIGNvbHVtbjogdmFsLmNvbCxcbiAgICAgICAgICBkaXI6IHZhbC5kaXJcbiAgICAgICAgfSk7XG4gICAgICAgIHBhcmFtKCdpU29ydENvbF8nICsgaSwgdmFsLmNvbCk7XG4gICAgICAgIHBhcmFtKCdzU29ydERpcl8nICsgaSwgdmFsLmRpcik7XG4gICAgICB9KTtcbiAgICAgIHBhcmFtKCdpU29ydGluZ0NvbHMnLCBzb3J0Lmxlbmd0aCk7XG4gICAgfVxuXG4gICAgdmFyIGxlZ2FjeSA9IERhdGFUYWJsZS5leHQubGVnYWN5LmFqYXg7XG5cbiAgICBpZiAobGVnYWN5ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gc2V0dGluZ3Muc0FqYXhTb3VyY2UgPyBkYXRhIDogZDtcbiAgICB9XG5cbiAgICByZXR1cm4gbGVnYWN5ID8gZGF0YSA6IGQ7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5BamF4VXBkYXRlRHJhdyhzZXR0aW5ncywganNvbikge1xuICAgIHZhciBjb21wYXQgPSBmdW5jdGlvbiBjb21wYXQob2xkLCBtb2Rlcm4pIHtcbiAgICAgIHJldHVybiBqc29uW29sZF0gIT09IHVuZGVmaW5lZCA/IGpzb25bb2xkXSA6IGpzb25bbW9kZXJuXTtcbiAgICB9O1xuXG4gICAgdmFyIGRhdGEgPSBfZm5BamF4RGF0YVNyYyhzZXR0aW5ncywganNvbik7XG5cbiAgICB2YXIgZHJhdyA9IGNvbXBhdCgnc0VjaG8nLCAnZHJhdycpO1xuICAgIHZhciByZWNvcmRzVG90YWwgPSBjb21wYXQoJ2lUb3RhbFJlY29yZHMnLCAncmVjb3Jkc1RvdGFsJyk7XG4gICAgdmFyIHJlY29yZHNGaWx0ZXJlZCA9IGNvbXBhdCgnaVRvdGFsRGlzcGxheVJlY29yZHMnLCAncmVjb3Jkc0ZpbHRlcmVkJyk7XG5cbiAgICBpZiAoZHJhdykge1xuICAgICAgaWYgKGRyYXcgKiAxIDwgc2V0dGluZ3MuaURyYXcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZXR0aW5ncy5pRHJhdyA9IGRyYXcgKiAxO1xuICAgIH1cblxuICAgIF9mbkNsZWFyVGFibGUoc2V0dGluZ3MpO1xuXG4gICAgc2V0dGluZ3MuX2lSZWNvcmRzVG90YWwgPSBwYXJzZUludChyZWNvcmRzVG90YWwsIDEwKTtcbiAgICBzZXR0aW5ncy5faVJlY29yZHNEaXNwbGF5ID0gcGFyc2VJbnQocmVjb3Jkc0ZpbHRlcmVkLCAxMCk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gZGF0YS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgX2ZuQWRkRGF0YShzZXR0aW5ncywgZGF0YVtpXSk7XG4gICAgfVxuXG4gICAgc2V0dGluZ3MuYWlEaXNwbGF5ID0gc2V0dGluZ3MuYWlEaXNwbGF5TWFzdGVyLnNsaWNlKCk7XG4gICAgc2V0dGluZ3MuYkFqYXhEYXRhR2V0ID0gZmFsc2U7XG5cbiAgICBfZm5EcmF3KHNldHRpbmdzKTtcblxuICAgIGlmICghc2V0dGluZ3MuX2JJbml0Q29tcGxldGUpIHtcbiAgICAgIF9mbkluaXRDb21wbGV0ZShzZXR0aW5ncywganNvbik7XG4gICAgfVxuXG4gICAgc2V0dGluZ3MuYkFqYXhEYXRhR2V0ID0gdHJ1ZTtcblxuICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KHNldHRpbmdzLCBmYWxzZSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5BamF4RGF0YVNyYyhvU2V0dGluZ3MsIGpzb24pIHtcbiAgICB2YXIgZGF0YVNyYyA9ICQuaXNQbGFpbk9iamVjdChvU2V0dGluZ3MuYWpheCkgJiYgb1NldHRpbmdzLmFqYXguZGF0YVNyYyAhPT0gdW5kZWZpbmVkID8gb1NldHRpbmdzLmFqYXguZGF0YVNyYyA6IG9TZXR0aW5ncy5zQWpheERhdGFQcm9wO1xuXG4gICAgaWYgKGRhdGFTcmMgPT09ICdkYXRhJykge1xuICAgICAgcmV0dXJuIGpzb24uYWFEYXRhIHx8IGpzb25bZGF0YVNyY107XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGFTcmMgIT09IFwiXCIgPyBfZm5HZXRPYmplY3REYXRhRm4oZGF0YVNyYykoanNvbikgOiBqc29uO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmVhdHVyZUh0bWxGaWx0ZXIoc2V0dGluZ3MpIHtcbiAgICB2YXIgY2xhc3NlcyA9IHNldHRpbmdzLm9DbGFzc2VzO1xuICAgIHZhciB0YWJsZUlkID0gc2V0dGluZ3Muc1RhYmxlSWQ7XG4gICAgdmFyIGxhbmd1YWdlID0gc2V0dGluZ3Mub0xhbmd1YWdlO1xuICAgIHZhciBwcmV2aW91c1NlYXJjaCA9IHNldHRpbmdzLm9QcmV2aW91c1NlYXJjaDtcbiAgICB2YXIgZmVhdHVyZXMgPSBzZXR0aW5ncy5hYW5GZWF0dXJlcztcbiAgICB2YXIgaW5wdXQgPSAnPGlucHV0IHR5cGU9XCJzZWFyY2hcIiBjbGFzcz1cIicgKyBjbGFzc2VzLnNGaWx0ZXJJbnB1dCArICdcIi8+JztcbiAgICB2YXIgc3RyID0gbGFuZ3VhZ2Uuc1NlYXJjaDtcbiAgICBzdHIgPSBzdHIubWF0Y2goL19JTlBVVF8vKSA/IHN0ci5yZXBsYWNlKCdfSU5QVVRfJywgaW5wdXQpIDogc3RyICsgaW5wdXQ7XG4gICAgdmFyIGZpbHRlciA9ICQoJzxkaXYvPicsIHtcbiAgICAgICdpZCc6ICFmZWF0dXJlcy5mID8gdGFibGVJZCArICdfZmlsdGVyJyA6IG51bGwsXG4gICAgICAnY2xhc3MnOiBjbGFzc2VzLnNGaWx0ZXJcbiAgICB9KS5hcHBlbmQoJCgnPGxhYmVsLz4nKS5hcHBlbmQoc3RyKSk7XG5cbiAgICB2YXIgc2VhcmNoRm4gPSBmdW5jdGlvbiBzZWFyY2hGbigpIHtcbiAgICAgIHZhciBuID0gZmVhdHVyZXMuZjtcbiAgICAgIHZhciB2YWwgPSAhdGhpcy52YWx1ZSA/IFwiXCIgOiB0aGlzLnZhbHVlO1xuXG4gICAgICBpZiAodmFsICE9IHByZXZpb3VzU2VhcmNoLnNTZWFyY2gpIHtcbiAgICAgICAgX2ZuRmlsdGVyQ29tcGxldGUoc2V0dGluZ3MsIHtcbiAgICAgICAgICBcInNTZWFyY2hcIjogdmFsLFxuICAgICAgICAgIFwiYlJlZ2V4XCI6IHByZXZpb3VzU2VhcmNoLmJSZWdleCxcbiAgICAgICAgICBcImJTbWFydFwiOiBwcmV2aW91c1NlYXJjaC5iU21hcnQsXG4gICAgICAgICAgXCJiQ2FzZUluc2Vuc2l0aXZlXCI6IHByZXZpb3VzU2VhcmNoLmJDYXNlSW5zZW5zaXRpdmVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQgPSAwO1xuXG4gICAgICAgIF9mbkRyYXcoc2V0dGluZ3MpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgc2VhcmNoRGVsYXkgPSBzZXR0aW5ncy5zZWFyY2hEZWxheSAhPT0gbnVsbCA/IHNldHRpbmdzLnNlYXJjaERlbGF5IDogX2ZuRGF0YVNvdXJjZShzZXR0aW5ncykgPT09ICdzc3AnID8gNDAwIDogMDtcbiAgICB2YXIganFGaWx0ZXIgPSAkKCdpbnB1dCcsIGZpbHRlcikudmFsKHByZXZpb3VzU2VhcmNoLnNTZWFyY2gpLmF0dHIoJ3BsYWNlaG9sZGVyJywgbGFuZ3VhZ2Uuc1NlYXJjaFBsYWNlaG9sZGVyKS5vbigna2V5dXAuRFQgc2VhcmNoLkRUIGlucHV0LkRUIHBhc3RlLkRUIGN1dC5EVCcsIHNlYXJjaERlbGF5ID8gX2ZuVGhyb3R0bGUoc2VhcmNoRm4sIHNlYXJjaERlbGF5KSA6IHNlYXJjaEZuKS5vbigna2V5cHJlc3MuRFQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSkuYXR0cignYXJpYS1jb250cm9scycsIHRhYmxlSWQpO1xuICAgICQoc2V0dGluZ3MublRhYmxlKS5vbignc2VhcmNoLmR0LkRUJywgZnVuY3Rpb24gKGV2LCBzKSB7XG4gICAgICBpZiAoc2V0dGluZ3MgPT09IHMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoanFGaWx0ZXJbMF0gIT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGpxRmlsdGVyLnZhbChwcmV2aW91c1NlYXJjaC5zU2VhcmNoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZpbHRlclswXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZpbHRlckNvbXBsZXRlKG9TZXR0aW5ncywgb0lucHV0LCBpRm9yY2UpIHtcbiAgICB2YXIgb1ByZXZTZWFyY2ggPSBvU2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoO1xuICAgIHZhciBhb1ByZXZTZWFyY2ggPSBvU2V0dGluZ3MuYW9QcmVTZWFyY2hDb2xzO1xuXG4gICAgdmFyIGZuU2F2ZUZpbHRlciA9IGZ1bmN0aW9uIGZuU2F2ZUZpbHRlcihvRmlsdGVyKSB7XG4gICAgICBvUHJldlNlYXJjaC5zU2VhcmNoID0gb0ZpbHRlci5zU2VhcmNoO1xuICAgICAgb1ByZXZTZWFyY2guYlJlZ2V4ID0gb0ZpbHRlci5iUmVnZXg7XG4gICAgICBvUHJldlNlYXJjaC5iU21hcnQgPSBvRmlsdGVyLmJTbWFydDtcbiAgICAgIG9QcmV2U2VhcmNoLmJDYXNlSW5zZW5zaXRpdmUgPSBvRmlsdGVyLmJDYXNlSW5zZW5zaXRpdmU7XG4gICAgfTtcblxuICAgIHZhciBmblJlZ2V4ID0gZnVuY3Rpb24gZm5SZWdleChvKSB7XG4gICAgICByZXR1cm4gby5iRXNjYXBlUmVnZXggIT09IHVuZGVmaW5lZCA/ICFvLmJFc2NhcGVSZWdleCA6IG8uYlJlZ2V4O1xuICAgIH07XG5cbiAgICBfZm5Db2x1bW5UeXBlcyhvU2V0dGluZ3MpO1xuXG4gICAgaWYgKF9mbkRhdGFTb3VyY2Uob1NldHRpbmdzKSAhPSAnc3NwJykge1xuICAgICAgX2ZuRmlsdGVyKG9TZXR0aW5ncywgb0lucHV0LnNTZWFyY2gsIGlGb3JjZSwgZm5SZWdleChvSW5wdXQpLCBvSW5wdXQuYlNtYXJ0LCBvSW5wdXQuYkNhc2VJbnNlbnNpdGl2ZSk7XG5cbiAgICAgIGZuU2F2ZUZpbHRlcihvSW5wdXQpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFvUHJldlNlYXJjaC5sZW5ndGg7IGkrKykge1xuICAgICAgICBfZm5GaWx0ZXJDb2x1bW4ob1NldHRpbmdzLCBhb1ByZXZTZWFyY2hbaV0uc1NlYXJjaCwgaSwgZm5SZWdleChhb1ByZXZTZWFyY2hbaV0pLCBhb1ByZXZTZWFyY2hbaV0uYlNtYXJ0LCBhb1ByZXZTZWFyY2hbaV0uYkNhc2VJbnNlbnNpdGl2ZSk7XG4gICAgICB9XG5cbiAgICAgIF9mbkZpbHRlckN1c3RvbShvU2V0dGluZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmblNhdmVGaWx0ZXIob0lucHV0KTtcbiAgICB9XG5cbiAgICBvU2V0dGluZ3MuYkZpbHRlcmVkID0gdHJ1ZTtcblxuICAgIF9mbkNhbGxiYWNrRmlyZShvU2V0dGluZ3MsIG51bGwsICdzZWFyY2gnLCBbb1NldHRpbmdzXSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5GaWx0ZXJDdXN0b20oc2V0dGluZ3MpIHtcbiAgICB2YXIgZmlsdGVycyA9IERhdGFUYWJsZS5leHQuc2VhcmNoO1xuICAgIHZhciBkaXNwbGF5Um93cyA9IHNldHRpbmdzLmFpRGlzcGxheTtcbiAgICB2YXIgcm93LCByb3dJZHg7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gZmlsdGVycy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgdmFyIHJvd3MgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaiA9IDAsIGplbiA9IGRpc3BsYXlSb3dzLmxlbmd0aDsgaiA8IGplbjsgaisrKSB7XG4gICAgICAgIHJvd0lkeCA9IGRpc3BsYXlSb3dzW2pdO1xuICAgICAgICByb3cgPSBzZXR0aW5ncy5hb0RhdGFbcm93SWR4XTtcblxuICAgICAgICBpZiAoZmlsdGVyc1tpXShzZXR0aW5ncywgcm93Ll9hRmlsdGVyRGF0YSwgcm93SWR4LCByb3cuX2FEYXRhLCBqKSkge1xuICAgICAgICAgIHJvd3MucHVzaChyb3dJZHgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGRpc3BsYXlSb3dzLmxlbmd0aCA9IDA7XG4gICAgICAkLm1lcmdlKGRpc3BsYXlSb3dzLCByb3dzKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5GaWx0ZXJDb2x1bW4oc2V0dGluZ3MsIHNlYXJjaFN0ciwgY29sSWR4LCByZWdleCwgc21hcnQsIGNhc2VJbnNlbnNpdGl2ZSkge1xuICAgIGlmIChzZWFyY2hTdHIgPT09ICcnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRhdGE7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIHZhciBkaXNwbGF5ID0gc2V0dGluZ3MuYWlEaXNwbGF5O1xuXG4gICAgdmFyIHJwU2VhcmNoID0gX2ZuRmlsdGVyQ3JlYXRlU2VhcmNoKHNlYXJjaFN0ciwgcmVnZXgsIHNtYXJ0LCBjYXNlSW5zZW5zaXRpdmUpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXNwbGF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBkYXRhID0gc2V0dGluZ3MuYW9EYXRhW2Rpc3BsYXlbaV1dLl9hRmlsdGVyRGF0YVtjb2xJZHhdO1xuXG4gICAgICBpZiAocnBTZWFyY2gudGVzdChkYXRhKSkge1xuICAgICAgICBvdXQucHVzaChkaXNwbGF5W2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR0aW5ncy5haURpc3BsYXkgPSBvdXQ7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5GaWx0ZXIoc2V0dGluZ3MsIGlucHV0LCBmb3JjZSwgcmVnZXgsIHNtYXJ0LCBjYXNlSW5zZW5zaXRpdmUpIHtcbiAgICB2YXIgcnBTZWFyY2ggPSBfZm5GaWx0ZXJDcmVhdGVTZWFyY2goaW5wdXQsIHJlZ2V4LCBzbWFydCwgY2FzZUluc2Vuc2l0aXZlKTtcblxuICAgIHZhciBwcmV2U2VhcmNoID0gc2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoLnNTZWFyY2g7XG4gICAgdmFyIGRpc3BsYXlNYXN0ZXIgPSBzZXR0aW5ncy5haURpc3BsYXlNYXN0ZXI7XG4gICAgdmFyIGRpc3BsYXksIGludmFsaWRhdGVkLCBpO1xuICAgIHZhciBmaWx0ZXJlZCA9IFtdO1xuXG4gICAgaWYgKERhdGFUYWJsZS5leHQuc2VhcmNoLmxlbmd0aCAhPT0gMCkge1xuICAgICAgZm9yY2UgPSB0cnVlO1xuICAgIH1cblxuICAgIGludmFsaWRhdGVkID0gX2ZuRmlsdGVyRGF0YShzZXR0aW5ncyk7XG5cbiAgICBpZiAoaW5wdXQubGVuZ3RoIDw9IDApIHtcbiAgICAgIHNldHRpbmdzLmFpRGlzcGxheSA9IGRpc3BsYXlNYXN0ZXIuc2xpY2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGludmFsaWRhdGVkIHx8IGZvcmNlIHx8IHByZXZTZWFyY2gubGVuZ3RoID4gaW5wdXQubGVuZ3RoIHx8IGlucHV0LmluZGV4T2YocHJldlNlYXJjaCkgIT09IDAgfHwgc2V0dGluZ3MuYlNvcnRlZCkge1xuICAgICAgICAgIHNldHRpbmdzLmFpRGlzcGxheSA9IGRpc3BsYXlNYXN0ZXIuc2xpY2UoKTtcbiAgICAgICAgfVxuXG4gICAgICBkaXNwbGF5ID0gc2V0dGluZ3MuYWlEaXNwbGF5O1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZGlzcGxheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocnBTZWFyY2gudGVzdChzZXR0aW5ncy5hb0RhdGFbZGlzcGxheVtpXV0uX3NGaWx0ZXJSb3cpKSB7XG4gICAgICAgICAgZmlsdGVyZWQucHVzaChkaXNwbGF5W2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZXR0aW5ncy5haURpc3BsYXkgPSBmaWx0ZXJlZDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5GaWx0ZXJDcmVhdGVTZWFyY2goc2VhcmNoLCByZWdleCwgc21hcnQsIGNhc2VJbnNlbnNpdGl2ZSkge1xuICAgIHNlYXJjaCA9IHJlZ2V4ID8gc2VhcmNoIDogX2ZuRXNjYXBlUmVnZXgoc2VhcmNoKTtcblxuICAgIGlmIChzbWFydCkge1xuICAgICAgdmFyIGEgPSAkLm1hcChzZWFyY2gubWF0Y2goL1wiW15cIl0rXCJ8W14gXSsvZykgfHwgWycnXSwgZnVuY3Rpb24gKHdvcmQpIHtcbiAgICAgICAgaWYgKHdvcmQuY2hhckF0KDApID09PSAnXCInKSB7XG4gICAgICAgICAgdmFyIG0gPSB3b3JkLm1hdGNoKC9eXCIoLiopXCIkLyk7XG4gICAgICAgICAgd29yZCA9IG0gPyBtWzFdIDogd29yZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3b3JkLnJlcGxhY2UoJ1wiJywgJycpO1xuICAgICAgfSk7XG4gICAgICBzZWFyY2ggPSAnXig/PS4qPycgKyBhLmpvaW4oJykoPz0uKj8nKSArICcpLiokJztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChzZWFyY2gsIGNhc2VJbnNlbnNpdGl2ZSA/ICdpJyA6ICcnKTtcbiAgfVxuXG4gIHZhciBfZm5Fc2NhcGVSZWdleCA9IERhdGFUYWJsZS51dGlsLmVzY2FwZVJlZ2V4O1xuICB2YXIgX19maWx0ZXJfZGl2ID0gJCgnPGRpdj4nKVswXTtcblxuICB2YXIgX19maWx0ZXJfZGl2X3RleHRDb250ZW50ID0gX19maWx0ZXJfZGl2LnRleHRDb250ZW50ICE9PSB1bmRlZmluZWQ7XG5cbiAgZnVuY3Rpb24gX2ZuRmlsdGVyRGF0YShzZXR0aW5ncykge1xuICAgIHZhciBjb2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zO1xuICAgIHZhciBjb2x1bW47XG4gICAgdmFyIGksIGosIGllbiwgamVuLCBmaWx0ZXJEYXRhLCBjZWxsRGF0YSwgcm93O1xuICAgIHZhciBmb21hdHRlcnMgPSBEYXRhVGFibGUuZXh0LnR5cGUuc2VhcmNoO1xuICAgIHZhciB3YXNJbnZhbGlkYXRlZCA9IGZhbHNlO1xuXG4gICAgZm9yIChpID0gMCwgaWVuID0gc2V0dGluZ3MuYW9EYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICByb3cgPSBzZXR0aW5ncy5hb0RhdGFbaV07XG5cbiAgICAgIGlmICghcm93Ll9hRmlsdGVyRGF0YSkge1xuICAgICAgICBmaWx0ZXJEYXRhID0gW107XG5cbiAgICAgICAgZm9yIChqID0gMCwgamVuID0gY29sdW1ucy5sZW5ndGg7IGogPCBqZW47IGorKykge1xuICAgICAgICAgIGNvbHVtbiA9IGNvbHVtbnNbal07XG5cbiAgICAgICAgICBpZiAoY29sdW1uLmJTZWFyY2hhYmxlKSB7XG4gICAgICAgICAgICBjZWxsRGF0YSA9IF9mbkdldENlbGxEYXRhKHNldHRpbmdzLCBpLCBqLCAnZmlsdGVyJyk7XG5cbiAgICAgICAgICAgIGlmIChmb21hdHRlcnNbY29sdW1uLnNUeXBlXSkge1xuICAgICAgICAgICAgICBjZWxsRGF0YSA9IGZvbWF0dGVyc1tjb2x1bW4uc1R5cGVdKGNlbGxEYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNlbGxEYXRhID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIGNlbGxEYXRhID0gJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2VsbERhdGEgIT09ICdzdHJpbmcnICYmIGNlbGxEYXRhLnRvU3RyaW5nKSB7XG4gICAgICAgICAgICAgIGNlbGxEYXRhID0gY2VsbERhdGEudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2VsbERhdGEgPSAnJztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY2VsbERhdGEuaW5kZXhPZiAmJiBjZWxsRGF0YS5pbmRleE9mKCcmJykgIT09IC0xKSB7XG4gICAgICAgICAgICBfX2ZpbHRlcl9kaXYuaW5uZXJIVE1MID0gY2VsbERhdGE7XG4gICAgICAgICAgICBjZWxsRGF0YSA9IF9fZmlsdGVyX2Rpdl90ZXh0Q29udGVudCA/IF9fZmlsdGVyX2Rpdi50ZXh0Q29udGVudCA6IF9fZmlsdGVyX2Rpdi5pbm5lclRleHQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNlbGxEYXRhLnJlcGxhY2UpIHtcbiAgICAgICAgICAgIGNlbGxEYXRhID0gY2VsbERhdGEucmVwbGFjZSgvW1xcclxcbl0vZywgJycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZpbHRlckRhdGEucHVzaChjZWxsRGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByb3cuX2FGaWx0ZXJEYXRhID0gZmlsdGVyRGF0YTtcbiAgICAgICAgcm93Ll9zRmlsdGVyUm93ID0gZmlsdGVyRGF0YS5qb2luKCcgICcpO1xuICAgICAgICB3YXNJbnZhbGlkYXRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHdhc0ludmFsaWRhdGVkO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU2VhcmNoVG9DYW1lbChvYmopIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2VhcmNoOiBvYmouc1NlYXJjaCxcbiAgICAgIHNtYXJ0OiBvYmouYlNtYXJ0LFxuICAgICAgcmVnZXg6IG9iai5iUmVnZXgsXG4gICAgICBjYXNlSW5zZW5zaXRpdmU6IG9iai5iQ2FzZUluc2Vuc2l0aXZlXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNlYXJjaFRvSHVuZyhvYmopIHtcbiAgICByZXR1cm4ge1xuICAgICAgc1NlYXJjaDogb2JqLnNlYXJjaCxcbiAgICAgIGJTbWFydDogb2JqLnNtYXJ0LFxuICAgICAgYlJlZ2V4OiBvYmoucmVnZXgsXG4gICAgICBiQ2FzZUluc2Vuc2l0aXZlOiBvYmouY2FzZUluc2Vuc2l0aXZlXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZlYXR1cmVIdG1sSW5mbyhzZXR0aW5ncykge1xuICAgIHZhciB0aWQgPSBzZXR0aW5ncy5zVGFibGVJZCxcbiAgICAgICAgbm9kZXMgPSBzZXR0aW5ncy5hYW5GZWF0dXJlcy5pLFxuICAgICAgICBuID0gJCgnPGRpdi8+Jywge1xuICAgICAgJ2NsYXNzJzogc2V0dGluZ3Mub0NsYXNzZXMuc0luZm8sXG4gICAgICAnaWQnOiAhbm9kZXMgPyB0aWQgKyAnX2luZm8nIDogbnVsbFxuICAgIH0pO1xuXG4gICAgaWYgKCFub2Rlcykge1xuICAgICAgc2V0dGluZ3MuYW9EcmF3Q2FsbGJhY2sucHVzaCh7XG4gICAgICAgIFwiZm5cIjogX2ZuVXBkYXRlSW5mbyxcbiAgICAgICAgXCJzTmFtZVwiOiBcImluZm9ybWF0aW9uXCJcbiAgICAgIH0pO1xuICAgICAgbi5hdHRyKCdyb2xlJywgJ3N0YXR1cycpLmF0dHIoJ2FyaWEtbGl2ZScsICdwb2xpdGUnKTtcbiAgICAgICQoc2V0dGluZ3MublRhYmxlKS5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgdGlkICsgJ19pbmZvJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5bMF07XG4gIH1cblxuICBmdW5jdGlvbiBfZm5VcGRhdGVJbmZvKHNldHRpbmdzKSB7XG4gICAgdmFyIG5vZGVzID0gc2V0dGluZ3MuYWFuRmVhdHVyZXMuaTtcblxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbGFuZyA9IHNldHRpbmdzLm9MYW5ndWFnZSxcbiAgICAgICAgc3RhcnQgPSBzZXR0aW5ncy5faURpc3BsYXlTdGFydCArIDEsXG4gICAgICAgIGVuZCA9IHNldHRpbmdzLmZuRGlzcGxheUVuZCgpLFxuICAgICAgICBtYXggPSBzZXR0aW5ncy5mblJlY29yZHNUb3RhbCgpLFxuICAgICAgICB0b3RhbCA9IHNldHRpbmdzLmZuUmVjb3Jkc0Rpc3BsYXkoKSxcbiAgICAgICAgb3V0ID0gdG90YWwgPyBsYW5nLnNJbmZvIDogbGFuZy5zSW5mb0VtcHR5O1xuXG4gICAgaWYgKHRvdGFsICE9PSBtYXgpIHtcbiAgICAgIG91dCArPSAnICcgKyBsYW5nLnNJbmZvRmlsdGVyZWQ7XG4gICAgfVxuXG4gICAgb3V0ICs9IGxhbmcuc0luZm9Qb3N0Rml4O1xuICAgIG91dCA9IF9mbkluZm9NYWNyb3Moc2V0dGluZ3MsIG91dCk7XG4gICAgdmFyIGNhbGxiYWNrID0gbGFuZy5mbkluZm9DYWxsYmFjaztcblxuICAgIGlmIChjYWxsYmFjayAhPT0gbnVsbCkge1xuICAgICAgb3V0ID0gY2FsbGJhY2suY2FsbChzZXR0aW5ncy5vSW5zdGFuY2UsIHNldHRpbmdzLCBzdGFydCwgZW5kLCBtYXgsIHRvdGFsLCBvdXQpO1xuICAgIH1cblxuICAgICQobm9kZXMpLmh0bWwob3V0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkluZm9NYWNyb3Moc2V0dGluZ3MsIHN0cikge1xuICAgIHZhciBmb3JtYXR0ZXIgPSBzZXR0aW5ncy5mbkZvcm1hdE51bWJlcixcbiAgICAgICAgc3RhcnQgPSBzZXR0aW5ncy5faURpc3BsYXlTdGFydCArIDEsXG4gICAgICAgIGxlbiA9IHNldHRpbmdzLl9pRGlzcGxheUxlbmd0aCxcbiAgICAgICAgdmlzID0gc2V0dGluZ3MuZm5SZWNvcmRzRGlzcGxheSgpLFxuICAgICAgICBhbGwgPSBsZW4gPT09IC0xO1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvX1NUQVJUXy9nLCBmb3JtYXR0ZXIuY2FsbChzZXR0aW5ncywgc3RhcnQpKS5yZXBsYWNlKC9fRU5EXy9nLCBmb3JtYXR0ZXIuY2FsbChzZXR0aW5ncywgc2V0dGluZ3MuZm5EaXNwbGF5RW5kKCkpKS5yZXBsYWNlKC9fTUFYXy9nLCBmb3JtYXR0ZXIuY2FsbChzZXR0aW5ncywgc2V0dGluZ3MuZm5SZWNvcmRzVG90YWwoKSkpLnJlcGxhY2UoL19UT1RBTF8vZywgZm9ybWF0dGVyLmNhbGwoc2V0dGluZ3MsIHZpcykpLnJlcGxhY2UoL19QQUdFXy9nLCBmb3JtYXR0ZXIuY2FsbChzZXR0aW5ncywgYWxsID8gMSA6IE1hdGguY2VpbChzdGFydCAvIGxlbikpKS5yZXBsYWNlKC9fUEFHRVNfL2csIGZvcm1hdHRlci5jYWxsKHNldHRpbmdzLCBhbGwgPyAxIDogTWF0aC5jZWlsKHZpcyAvIGxlbikpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkluaXRpYWxpc2Uoc2V0dGluZ3MpIHtcbiAgICB2YXIgaSxcbiAgICAgICAgaUxlbixcbiAgICAgICAgaUFqYXhTdGFydCA9IHNldHRpbmdzLmlJbml0RGlzcGxheVN0YXJ0O1xuICAgIHZhciBjb2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zLFxuICAgICAgICBjb2x1bW47XG4gICAgdmFyIGZlYXR1cmVzID0gc2V0dGluZ3Mub0ZlYXR1cmVzO1xuICAgIHZhciBkZWZlckxvYWRpbmcgPSBzZXR0aW5ncy5iRGVmZXJMb2FkaW5nO1xuXG4gICAgaWYgKCFzZXR0aW5ncy5iSW5pdGlhbGlzZWQpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBfZm5Jbml0aWFsaXNlKHNldHRpbmdzKTtcbiAgICAgIH0sIDIwMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgX2ZuQWRkT3B0aW9uc0h0bWwoc2V0dGluZ3MpO1xuXG4gICAgX2ZuQnVpbGRIZWFkKHNldHRpbmdzKTtcblxuICAgIF9mbkRyYXdIZWFkKHNldHRpbmdzLCBzZXR0aW5ncy5hb0hlYWRlcik7XG5cbiAgICBfZm5EcmF3SGVhZChzZXR0aW5ncywgc2V0dGluZ3MuYW9Gb290ZXIpO1xuXG4gICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkoc2V0dGluZ3MsIHRydWUpO1xuXG4gICAgaWYgKGZlYXR1cmVzLmJBdXRvV2lkdGgpIHtcbiAgICAgIF9mbkNhbGN1bGF0ZUNvbHVtbldpZHRocyhzZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMCwgaUxlbiA9IGNvbHVtbnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICBjb2x1bW4gPSBjb2x1bW5zW2ldO1xuXG4gICAgICBpZiAoY29sdW1uLnNXaWR0aCkge1xuICAgICAgICBjb2x1bW4ublRoLnN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoY29sdW1uLnNXaWR0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCBudWxsLCAncHJlSW5pdCcsIFtzZXR0aW5nc10pO1xuXG4gICAgX2ZuUmVEcmF3KHNldHRpbmdzKTtcblxuICAgIHZhciBkYXRhU3JjID0gX2ZuRGF0YVNvdXJjZShzZXR0aW5ncyk7XG5cbiAgICBpZiAoZGF0YVNyYyAhPSAnc3NwJyB8fCBkZWZlckxvYWRpbmcpIHtcbiAgICAgIGlmIChkYXRhU3JjID09ICdhamF4Jykge1xuICAgICAgICBfZm5CdWlsZEFqYXgoc2V0dGluZ3MsIFtdLCBmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgIHZhciBhRGF0YSA9IF9mbkFqYXhEYXRhU3JjKHNldHRpbmdzLCBqc29uKTtcblxuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgX2ZuQWRkRGF0YShzZXR0aW5ncywgYURhdGFbaV0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHNldHRpbmdzLmlJbml0RGlzcGxheVN0YXJ0ID0gaUFqYXhTdGFydDtcblxuICAgICAgICAgIF9mblJlRHJhdyhzZXR0aW5ncyk7XG5cbiAgICAgICAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShzZXR0aW5ncywgZmFsc2UpO1xuXG4gICAgICAgICAgX2ZuSW5pdENvbXBsZXRlKHNldHRpbmdzLCBqc29uKTtcbiAgICAgICAgfSwgc2V0dGluZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkoc2V0dGluZ3MsIGZhbHNlKTtcblxuICAgICAgICBfZm5Jbml0Q29tcGxldGUoc2V0dGluZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkluaXRDb21wbGV0ZShzZXR0aW5ncywganNvbikge1xuICAgIHNldHRpbmdzLl9iSW5pdENvbXBsZXRlID0gdHJ1ZTtcblxuICAgIGlmIChqc29uIHx8IHNldHRpbmdzLm9Jbml0LmFhRGF0YSkge1xuICAgICAgX2ZuQWRqdXN0Q29sdW1uU2l6aW5nKHNldHRpbmdzKTtcbiAgICB9XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIG51bGwsICdwbHVnaW4taW5pdCcsIFtzZXR0aW5ncywganNvbl0pO1xuXG4gICAgX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCAnYW9Jbml0Q29tcGxldGUnLCAnaW5pdCcsIFtzZXR0aW5ncywganNvbl0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuTGVuZ3RoQ2hhbmdlKHNldHRpbmdzLCB2YWwpIHtcbiAgICB2YXIgbGVuID0gcGFyc2VJbnQodmFsLCAxMCk7XG4gICAgc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoID0gbGVuO1xuXG4gICAgX2ZuTGVuZ3RoT3ZlcmZsb3coc2V0dGluZ3MpO1xuXG4gICAgX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCBudWxsLCAnbGVuZ3RoJywgW3NldHRpbmdzLCBsZW5dKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZlYXR1cmVIdG1sTGVuZ3RoKHNldHRpbmdzKSB7XG4gICAgdmFyIGNsYXNzZXMgPSBzZXR0aW5ncy5vQ2xhc3NlcyxcbiAgICAgICAgdGFibGVJZCA9IHNldHRpbmdzLnNUYWJsZUlkLFxuICAgICAgICBtZW51ID0gc2V0dGluZ3MuYUxlbmd0aE1lbnUsXG4gICAgICAgIGQyID0gJC5pc0FycmF5KG1lbnVbMF0pLFxuICAgICAgICBsZW5ndGhzID0gZDIgPyBtZW51WzBdIDogbWVudSxcbiAgICAgICAgbGFuZ3VhZ2UgPSBkMiA/IG1lbnVbMV0gOiBtZW51O1xuICAgIHZhciBzZWxlY3QgPSAkKCc8c2VsZWN0Lz4nLCB7XG4gICAgICAnbmFtZSc6IHRhYmxlSWQgKyAnX2xlbmd0aCcsXG4gICAgICAnYXJpYS1jb250cm9scyc6IHRhYmxlSWQsXG4gICAgICAnY2xhc3MnOiBjbGFzc2VzLnNMZW5ndGhTZWxlY3RcbiAgICB9KTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBsZW5ndGhzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBzZWxlY3RbMF1baV0gPSBuZXcgT3B0aW9uKHR5cGVvZiBsYW5ndWFnZVtpXSA9PT0gJ251bWJlcicgPyBzZXR0aW5ncy5mbkZvcm1hdE51bWJlcihsYW5ndWFnZVtpXSkgOiBsYW5ndWFnZVtpXSwgbGVuZ3Roc1tpXSk7XG4gICAgfVxuXG4gICAgdmFyIGRpdiA9ICQoJzxkaXY+PGxhYmVsLz48L2Rpdj4nKS5hZGRDbGFzcyhjbGFzc2VzLnNMZW5ndGgpO1xuXG4gICAgaWYgKCFzZXR0aW5ncy5hYW5GZWF0dXJlcy5sKSB7XG4gICAgICBkaXZbMF0uaWQgPSB0YWJsZUlkICsgJ19sZW5ndGgnO1xuICAgIH1cblxuICAgIGRpdi5jaGlsZHJlbigpLmFwcGVuZChzZXR0aW5ncy5vTGFuZ3VhZ2Uuc0xlbmd0aE1lbnUucmVwbGFjZSgnX01FTlVfJywgc2VsZWN0WzBdLm91dGVySFRNTCkpO1xuICAgICQoJ3NlbGVjdCcsIGRpdikudmFsKHNldHRpbmdzLl9pRGlzcGxheUxlbmd0aCkub24oJ2NoYW5nZS5EVCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBfZm5MZW5ndGhDaGFuZ2Uoc2V0dGluZ3MsICQodGhpcykudmFsKCkpO1xuXG4gICAgICBfZm5EcmF3KHNldHRpbmdzKTtcbiAgICB9KTtcbiAgICAkKHNldHRpbmdzLm5UYWJsZSkub24oJ2xlbmd0aC5kdC5EVCcsIGZ1bmN0aW9uIChlLCBzLCBsZW4pIHtcbiAgICAgIGlmIChzZXR0aW5ncyA9PT0gcykge1xuICAgICAgICAkKCdzZWxlY3QnLCBkaXYpLnZhbChsZW4pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkaXZbMF07XG4gIH1cblxuICBmdW5jdGlvbiBfZm5GZWF0dXJlSHRtbFBhZ2luYXRlKHNldHRpbmdzKSB7XG4gICAgdmFyIHR5cGUgPSBzZXR0aW5ncy5zUGFnaW5hdGlvblR5cGUsXG4gICAgICAgIHBsdWdpbiA9IERhdGFUYWJsZS5leHQucGFnZXJbdHlwZV0sXG4gICAgICAgIG1vZGVybiA9IHR5cGVvZiBwbHVnaW4gPT09ICdmdW5jdGlvbicsXG4gICAgICAgIHJlZHJhdyA9IGZ1bmN0aW9uIHJlZHJhdyhzZXR0aW5ncykge1xuICAgICAgX2ZuRHJhdyhzZXR0aW5ncyk7XG4gICAgfSxcbiAgICAgICAgbm9kZSA9ICQoJzxkaXYvPicpLmFkZENsYXNzKHNldHRpbmdzLm9DbGFzc2VzLnNQYWdpbmcgKyB0eXBlKVswXSxcbiAgICAgICAgZmVhdHVyZXMgPSBzZXR0aW5ncy5hYW5GZWF0dXJlcztcblxuICAgIGlmICghbW9kZXJuKSB7XG4gICAgICBwbHVnaW4uZm5Jbml0KHNldHRpbmdzLCBub2RlLCByZWRyYXcpO1xuICAgIH1cblxuICAgIGlmICghZmVhdHVyZXMucCkge1xuICAgICAgbm9kZS5pZCA9IHNldHRpbmdzLnNUYWJsZUlkICsgJ19wYWdpbmF0ZSc7XG4gICAgICBzZXR0aW5ncy5hb0RyYXdDYWxsYmFjay5wdXNoKHtcbiAgICAgICAgXCJmblwiOiBmdW5jdGlvbiBmbihzZXR0aW5ncykge1xuICAgICAgICAgIGlmIChtb2Rlcm4pIHtcbiAgICAgICAgICAgIHZhciBzdGFydCA9IHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0LFxuICAgICAgICAgICAgICAgIGxlbiA9IHNldHRpbmdzLl9pRGlzcGxheUxlbmd0aCxcbiAgICAgICAgICAgICAgICB2aXNSZWNvcmRzID0gc2V0dGluZ3MuZm5SZWNvcmRzRGlzcGxheSgpLFxuICAgICAgICAgICAgICAgIGFsbCA9IGxlbiA9PT0gLTEsXG4gICAgICAgICAgICAgICAgcGFnZSA9IGFsbCA/IDAgOiBNYXRoLmNlaWwoc3RhcnQgLyBsZW4pLFxuICAgICAgICAgICAgICAgIHBhZ2VzID0gYWxsID8gMSA6IE1hdGguY2VpbCh2aXNSZWNvcmRzIC8gbGVuKSxcbiAgICAgICAgICAgICAgICBidXR0b25zID0gcGx1Z2luKHBhZ2UsIHBhZ2VzKSxcbiAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgIGllbjtcblxuICAgICAgICAgICAgZm9yIChpID0gMCwgaWVuID0gZmVhdHVyZXMucC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgICAgICBfZm5SZW5kZXJlcihzZXR0aW5ncywgJ3BhZ2VCdXR0b24nKShzZXR0aW5ncywgZmVhdHVyZXMucFtpXSwgaSwgYnV0dG9ucywgcGFnZSwgcGFnZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbHVnaW4uZm5VcGRhdGUoc2V0dGluZ3MsIHJlZHJhdyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInNOYW1lXCI6IFwicGFnaW5hdGlvblwiXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblBhZ2VDaGFuZ2Uoc2V0dGluZ3MsIGFjdGlvbiwgcmVkcmF3KSB7XG4gICAgdmFyIHN0YXJ0ID0gc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQsXG4gICAgICAgIGxlbiA9IHNldHRpbmdzLl9pRGlzcGxheUxlbmd0aCxcbiAgICAgICAgcmVjb3JkcyA9IHNldHRpbmdzLmZuUmVjb3Jkc0Rpc3BsYXkoKTtcblxuICAgIGlmIChyZWNvcmRzID09PSAwIHx8IGxlbiA9PT0gLTEpIHtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBhY3Rpb24gPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHN0YXJ0ID0gYWN0aW9uICogbGVuO1xuXG4gICAgICBpZiAoc3RhcnQgPiByZWNvcmRzKSB7XG4gICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PSBcImZpcnN0XCIpIHtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PSBcInByZXZpb3VzXCIpIHtcbiAgICAgIHN0YXJ0ID0gbGVuID49IDAgPyBzdGFydCAtIGxlbiA6IDA7XG5cbiAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYWN0aW9uID09IFwibmV4dFwiKSB7XG4gICAgICBpZiAoc3RhcnQgKyBsZW4gPCByZWNvcmRzKSB7XG4gICAgICAgIHN0YXJ0ICs9IGxlbjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PSBcImxhc3RcIikge1xuICAgICAgc3RhcnQgPSBNYXRoLmZsb29yKChyZWNvcmRzIC0gMSkgLyBsZW4pICogbGVuO1xuICAgIH0gZWxzZSB7XG4gICAgICBfZm5Mb2coc2V0dGluZ3MsIDAsIFwiVW5rbm93biBwYWdpbmcgYWN0aW9uOiBcIiArIGFjdGlvbiwgNSk7XG4gICAgfVxuXG4gICAgdmFyIGNoYW5nZWQgPSBzZXR0aW5ncy5faURpc3BsYXlTdGFydCAhPT0gc3RhcnQ7XG4gICAgc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQgPSBzdGFydDtcblxuICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIG51bGwsICdwYWdlJywgW3NldHRpbmdzXSk7XG5cbiAgICAgIGlmIChyZWRyYXcpIHtcbiAgICAgICAgX2ZuRHJhdyhzZXR0aW5ncyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYW5nZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5GZWF0dXJlSHRtbFByb2Nlc3Npbmcoc2V0dGluZ3MpIHtcbiAgICByZXR1cm4gJCgnPGRpdi8+Jywge1xuICAgICAgJ2lkJzogIXNldHRpbmdzLmFhbkZlYXR1cmVzLnIgPyBzZXR0aW5ncy5zVGFibGVJZCArICdfcHJvY2Vzc2luZycgOiBudWxsLFxuICAgICAgJ2NsYXNzJzogc2V0dGluZ3Mub0NsYXNzZXMuc1Byb2Nlc3NpbmdcbiAgICB9KS5odG1sKHNldHRpbmdzLm9MYW5ndWFnZS5zUHJvY2Vzc2luZykuaW5zZXJ0QmVmb3JlKHNldHRpbmdzLm5UYWJsZSlbMF07XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Qcm9jZXNzaW5nRGlzcGxheShzZXR0aW5ncywgc2hvdykge1xuICAgIGlmIChzZXR0aW5ncy5vRmVhdHVyZXMuYlByb2Nlc3NpbmcpIHtcbiAgICAgICQoc2V0dGluZ3MuYWFuRmVhdHVyZXMucikuY3NzKCdkaXNwbGF5Jywgc2hvdyA/ICdibG9jaycgOiAnbm9uZScpO1xuICAgIH1cblxuICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgbnVsbCwgJ3Byb2Nlc3NpbmcnLCBbc2V0dGluZ3MsIHNob3ddKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZlYXR1cmVIdG1sVGFibGUoc2V0dGluZ3MpIHtcbiAgICB2YXIgdGFibGUgPSAkKHNldHRpbmdzLm5UYWJsZSk7XG4gICAgdGFibGUuYXR0cigncm9sZScsICdncmlkJyk7XG4gICAgdmFyIHNjcm9sbCA9IHNldHRpbmdzLm9TY3JvbGw7XG5cbiAgICBpZiAoc2Nyb2xsLnNYID09PSAnJyAmJiBzY3JvbGwuc1kgPT09ICcnKSB7XG4gICAgICByZXR1cm4gc2V0dGluZ3MublRhYmxlO1xuICAgIH1cblxuICAgIHZhciBzY3JvbGxYID0gc2Nyb2xsLnNYO1xuICAgIHZhciBzY3JvbGxZID0gc2Nyb2xsLnNZO1xuICAgIHZhciBjbGFzc2VzID0gc2V0dGluZ3Mub0NsYXNzZXM7XG4gICAgdmFyIGNhcHRpb24gPSB0YWJsZS5jaGlsZHJlbignY2FwdGlvbicpO1xuICAgIHZhciBjYXB0aW9uU2lkZSA9IGNhcHRpb24ubGVuZ3RoID8gY2FwdGlvblswXS5fY2FwdGlvblNpZGUgOiBudWxsO1xuICAgIHZhciBoZWFkZXJDbG9uZSA9ICQodGFibGVbMF0uY2xvbmVOb2RlKGZhbHNlKSk7XG4gICAgdmFyIGZvb3RlckNsb25lID0gJCh0YWJsZVswXS5jbG9uZU5vZGUoZmFsc2UpKTtcbiAgICB2YXIgZm9vdGVyID0gdGFibGUuY2hpbGRyZW4oJ3Rmb290Jyk7XG4gICAgdmFyIF9kaXYgPSAnPGRpdi8+JztcblxuICAgIHZhciBzaXplID0gZnVuY3Rpb24gc2l6ZShzKSB7XG4gICAgICByZXR1cm4gIXMgPyBudWxsIDogX2ZuU3RyaW5nVG9Dc3Mocyk7XG4gICAgfTtcblxuICAgIGlmICghZm9vdGVyLmxlbmd0aCkge1xuICAgICAgZm9vdGVyID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgc2Nyb2xsZXIgPSAkKF9kaXYsIHtcbiAgICAgICdjbGFzcyc6IGNsYXNzZXMuc1Njcm9sbFdyYXBwZXJcbiAgICB9KS5hcHBlbmQoJChfZGl2LCB7XG4gICAgICAnY2xhc3MnOiBjbGFzc2VzLnNTY3JvbGxIZWFkXG4gICAgfSkuY3NzKHtcbiAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgYm9yZGVyOiAwLFxuICAgICAgd2lkdGg6IHNjcm9sbFggPyBzaXplKHNjcm9sbFgpIDogJzEwMCUnXG4gICAgfSkuYXBwZW5kKCQoX2Rpdiwge1xuICAgICAgJ2NsYXNzJzogY2xhc3Nlcy5zU2Nyb2xsSGVhZElubmVyXG4gICAgfSkuY3NzKHtcbiAgICAgICdib3gtc2l6aW5nJzogJ2NvbnRlbnQtYm94JyxcbiAgICAgIHdpZHRoOiBzY3JvbGwuc1hJbm5lciB8fCAnMTAwJSdcbiAgICB9KS5hcHBlbmQoaGVhZGVyQ2xvbmUucmVtb3ZlQXR0cignaWQnKS5jc3MoJ21hcmdpbi1sZWZ0JywgMCkuYXBwZW5kKGNhcHRpb25TaWRlID09PSAndG9wJyA/IGNhcHRpb24gOiBudWxsKS5hcHBlbmQodGFibGUuY2hpbGRyZW4oJ3RoZWFkJykpKSkpLmFwcGVuZCgkKF9kaXYsIHtcbiAgICAgICdjbGFzcyc6IGNsYXNzZXMuc1Njcm9sbEJvZHlcbiAgICB9KS5jc3Moe1xuICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICBvdmVyZmxvdzogJ2F1dG8nLFxuICAgICAgd2lkdGg6IHNpemUoc2Nyb2xsWClcbiAgICB9KS5hcHBlbmQodGFibGUpKTtcblxuICAgIGlmIChmb290ZXIpIHtcbiAgICAgIHNjcm9sbGVyLmFwcGVuZCgkKF9kaXYsIHtcbiAgICAgICAgJ2NsYXNzJzogY2xhc3Nlcy5zU2Nyb2xsRm9vdFxuICAgICAgfSkuY3NzKHtcbiAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICBib3JkZXI6IDAsXG4gICAgICAgIHdpZHRoOiBzY3JvbGxYID8gc2l6ZShzY3JvbGxYKSA6ICcxMDAlJ1xuICAgICAgfSkuYXBwZW5kKCQoX2Rpdiwge1xuICAgICAgICAnY2xhc3MnOiBjbGFzc2VzLnNTY3JvbGxGb290SW5uZXJcbiAgICAgIH0pLmFwcGVuZChmb290ZXJDbG9uZS5yZW1vdmVBdHRyKCdpZCcpLmNzcygnbWFyZ2luLWxlZnQnLCAwKS5hcHBlbmQoY2FwdGlvblNpZGUgPT09ICdib3R0b20nID8gY2FwdGlvbiA6IG51bGwpLmFwcGVuZCh0YWJsZS5jaGlsZHJlbigndGZvb3QnKSkpKSk7XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkcmVuID0gc2Nyb2xsZXIuY2hpbGRyZW4oKTtcbiAgICB2YXIgc2Nyb2xsSGVhZCA9IGNoaWxkcmVuWzBdO1xuICAgIHZhciBzY3JvbGxCb2R5ID0gY2hpbGRyZW5bMV07XG4gICAgdmFyIHNjcm9sbEZvb3QgPSBmb290ZXIgPyBjaGlsZHJlblsyXSA6IG51bGw7XG5cbiAgICBpZiAoc2Nyb2xsWCkge1xuICAgICAgJChzY3JvbGxCb2R5KS5vbignc2Nyb2xsLkRUJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHNjcm9sbExlZnQgPSB0aGlzLnNjcm9sbExlZnQ7XG4gICAgICAgIHNjcm9sbEhlYWQuc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQ7XG5cbiAgICAgICAgaWYgKGZvb3Rlcikge1xuICAgICAgICAgIHNjcm9sbEZvb3Quc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgICQoc2Nyb2xsQm9keSkuY3NzKHNjcm9sbFkgJiYgc2Nyb2xsLmJDb2xsYXBzZSA/ICdtYXgtaGVpZ2h0JyA6ICdoZWlnaHQnLCBzY3JvbGxZKTtcbiAgICBzZXR0aW5ncy5uU2Nyb2xsSGVhZCA9IHNjcm9sbEhlYWQ7XG4gICAgc2V0dGluZ3MublNjcm9sbEJvZHkgPSBzY3JvbGxCb2R5O1xuICAgIHNldHRpbmdzLm5TY3JvbGxGb290ID0gc2Nyb2xsRm9vdDtcbiAgICBzZXR0aW5ncy5hb0RyYXdDYWxsYmFjay5wdXNoKHtcbiAgICAgIFwiZm5cIjogX2ZuU2Nyb2xsRHJhdyxcbiAgICAgIFwic05hbWVcIjogXCJzY3JvbGxpbmdcIlxuICAgIH0pO1xuICAgIHJldHVybiBzY3JvbGxlclswXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNjcm9sbERyYXcoc2V0dGluZ3MpIHtcbiAgICB2YXIgc2Nyb2xsID0gc2V0dGluZ3Mub1Njcm9sbCxcbiAgICAgICAgc2Nyb2xsWCA9IHNjcm9sbC5zWCxcbiAgICAgICAgc2Nyb2xsWElubmVyID0gc2Nyb2xsLnNYSW5uZXIsXG4gICAgICAgIHNjcm9sbFkgPSBzY3JvbGwuc1ksXG4gICAgICAgIGJhcldpZHRoID0gc2Nyb2xsLmlCYXJXaWR0aCxcbiAgICAgICAgZGl2SGVhZGVyID0gJChzZXR0aW5ncy5uU2Nyb2xsSGVhZCksXG4gICAgICAgIGRpdkhlYWRlclN0eWxlID0gZGl2SGVhZGVyWzBdLnN0eWxlLFxuICAgICAgICBkaXZIZWFkZXJJbm5lciA9IGRpdkhlYWRlci5jaGlsZHJlbignZGl2JyksXG4gICAgICAgIGRpdkhlYWRlcklubmVyU3R5bGUgPSBkaXZIZWFkZXJJbm5lclswXS5zdHlsZSxcbiAgICAgICAgZGl2SGVhZGVyVGFibGUgPSBkaXZIZWFkZXJJbm5lci5jaGlsZHJlbigndGFibGUnKSxcbiAgICAgICAgZGl2Qm9keUVsID0gc2V0dGluZ3MublNjcm9sbEJvZHksXG4gICAgICAgIGRpdkJvZHkgPSAkKGRpdkJvZHlFbCksXG4gICAgICAgIGRpdkJvZHlTdHlsZSA9IGRpdkJvZHlFbC5zdHlsZSxcbiAgICAgICAgZGl2Rm9vdGVyID0gJChzZXR0aW5ncy5uU2Nyb2xsRm9vdCksXG4gICAgICAgIGRpdkZvb3RlcklubmVyID0gZGl2Rm9vdGVyLmNoaWxkcmVuKCdkaXYnKSxcbiAgICAgICAgZGl2Rm9vdGVyVGFibGUgPSBkaXZGb290ZXJJbm5lci5jaGlsZHJlbigndGFibGUnKSxcbiAgICAgICAgaGVhZGVyID0gJChzZXR0aW5ncy5uVEhlYWQpLFxuICAgICAgICB0YWJsZSA9ICQoc2V0dGluZ3MublRhYmxlKSxcbiAgICAgICAgdGFibGVFbCA9IHRhYmxlWzBdLFxuICAgICAgICB0YWJsZVN0eWxlID0gdGFibGVFbC5zdHlsZSxcbiAgICAgICAgZm9vdGVyID0gc2V0dGluZ3MublRGb290ID8gJChzZXR0aW5ncy5uVEZvb3QpIDogbnVsbCxcbiAgICAgICAgYnJvd3NlciA9IHNldHRpbmdzLm9Ccm93c2VyLFxuICAgICAgICBpZTY3ID0gYnJvd3Nlci5iU2Nyb2xsT3ZlcnNpemUsXG4gICAgICAgIGR0SGVhZGVyQ2VsbHMgPSBfcGx1Y2soc2V0dGluZ3MuYW9Db2x1bW5zLCAnblRoJyksXG4gICAgICAgIGhlYWRlclRyZ0VscyxcbiAgICAgICAgZm9vdGVyVHJnRWxzLFxuICAgICAgICBoZWFkZXJTcmNFbHMsXG4gICAgICAgIGZvb3RlclNyY0VscyxcbiAgICAgICAgaGVhZGVyQ29weSxcbiAgICAgICAgZm9vdGVyQ29weSxcbiAgICAgICAgaGVhZGVyV2lkdGhzID0gW10sXG4gICAgICAgIGZvb3RlcldpZHRocyA9IFtdLFxuICAgICAgICBoZWFkZXJDb250ZW50ID0gW10sXG4gICAgICAgIGZvb3RlckNvbnRlbnQgPSBbXSxcbiAgICAgICAgaWR4LFxuICAgICAgICBjb3JyZWN0aW9uLFxuICAgICAgICBzYW5pdHlXaWR0aCxcbiAgICAgICAgemVyb091dCA9IGZ1bmN0aW9uIHplcm9PdXQoblNpemVyKSB7XG4gICAgICB2YXIgc3R5bGUgPSBuU2l6ZXIuc3R5bGU7XG4gICAgICBzdHlsZS5wYWRkaW5nVG9wID0gXCIwXCI7XG4gICAgICBzdHlsZS5wYWRkaW5nQm90dG9tID0gXCIwXCI7XG4gICAgICBzdHlsZS5ib3JkZXJUb3BXaWR0aCA9IFwiMFwiO1xuICAgICAgc3R5bGUuYm9yZGVyQm90dG9tV2lkdGggPSBcIjBcIjtcbiAgICAgIHN0eWxlLmhlaWdodCA9IDA7XG4gICAgfTtcblxuICAgIHZhciBzY3JvbGxCYXJWaXMgPSBkaXZCb2R5RWwuc2Nyb2xsSGVpZ2h0ID4gZGl2Qm9keUVsLmNsaWVudEhlaWdodDtcblxuICAgIGlmIChzZXR0aW5ncy5zY3JvbGxCYXJWaXMgIT09IHNjcm9sbEJhclZpcyAmJiBzZXR0aW5ncy5zY3JvbGxCYXJWaXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc2V0dGluZ3Muc2Nyb2xsQmFyVmlzID0gc2Nyb2xsQmFyVmlzO1xuXG4gICAgICBfZm5BZGp1c3RDb2x1bW5TaXppbmcoc2V0dGluZ3MpO1xuXG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldHRpbmdzLnNjcm9sbEJhclZpcyA9IHNjcm9sbEJhclZpcztcbiAgICB9XG5cbiAgICB0YWJsZS5jaGlsZHJlbigndGhlYWQsIHRmb290JykucmVtb3ZlKCk7XG5cbiAgICBpZiAoZm9vdGVyKSB7XG4gICAgICBmb290ZXJDb3B5ID0gZm9vdGVyLmNsb25lKCkucHJlcGVuZFRvKHRhYmxlKTtcbiAgICAgIGZvb3RlclRyZ0VscyA9IGZvb3Rlci5maW5kKCd0cicpO1xuICAgICAgZm9vdGVyU3JjRWxzID0gZm9vdGVyQ29weS5maW5kKCd0cicpO1xuICAgIH1cblxuICAgIGhlYWRlckNvcHkgPSBoZWFkZXIuY2xvbmUoKS5wcmVwZW5kVG8odGFibGUpO1xuICAgIGhlYWRlclRyZ0VscyA9IGhlYWRlci5maW5kKCd0cicpO1xuICAgIGhlYWRlclNyY0VscyA9IGhlYWRlckNvcHkuZmluZCgndHInKTtcbiAgICBoZWFkZXJDb3B5LmZpbmQoJ3RoLCB0ZCcpLnJlbW92ZUF0dHIoJ3RhYmluZGV4Jyk7XG5cbiAgICBpZiAoIXNjcm9sbFgpIHtcbiAgICAgIGRpdkJvZHlTdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgIGRpdkhlYWRlclswXS5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICB9XG5cbiAgICAkLmVhY2goX2ZuR2V0VW5pcXVlVGhzKHNldHRpbmdzLCBoZWFkZXJDb3B5KSwgZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICBpZHggPSBfZm5WaXNpYmxlVG9Db2x1bW5JbmRleChzZXR0aW5ncywgaSk7XG4gICAgICBlbC5zdHlsZS53aWR0aCA9IHNldHRpbmdzLmFvQ29sdW1uc1tpZHhdLnNXaWR0aDtcbiAgICB9KTtcblxuICAgIGlmIChmb290ZXIpIHtcbiAgICAgIF9mbkFwcGx5VG9DaGlsZHJlbihmdW5jdGlvbiAobikge1xuICAgICAgICBuLnN0eWxlLndpZHRoID0gXCJcIjtcbiAgICAgIH0sIGZvb3RlclNyY0Vscyk7XG4gICAgfVxuXG4gICAgc2FuaXR5V2lkdGggPSB0YWJsZS5vdXRlcldpZHRoKCk7XG5cbiAgICBpZiAoc2Nyb2xsWCA9PT0gXCJcIikge1xuICAgICAgdGFibGVTdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuXG4gICAgICBpZiAoaWU2NyAmJiAodGFibGUuZmluZCgndGJvZHknKS5oZWlnaHQoKSA+IGRpdkJvZHlFbC5vZmZzZXRIZWlnaHQgfHwgZGl2Qm9keS5jc3MoJ292ZXJmbG93LXknKSA9PSBcInNjcm9sbFwiKSkge1xuICAgICAgICB0YWJsZVN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3ModGFibGUub3V0ZXJXaWR0aCgpIC0gYmFyV2lkdGgpO1xuICAgICAgfVxuXG4gICAgICBzYW5pdHlXaWR0aCA9IHRhYmxlLm91dGVyV2lkdGgoKTtcbiAgICB9IGVsc2UgaWYgKHNjcm9sbFhJbm5lciAhPT0gXCJcIikge1xuICAgICAgdGFibGVTdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKHNjcm9sbFhJbm5lcik7XG4gICAgICBzYW5pdHlXaWR0aCA9IHRhYmxlLm91dGVyV2lkdGgoKTtcbiAgICB9XG5cbiAgICBfZm5BcHBseVRvQ2hpbGRyZW4oemVyb091dCwgaGVhZGVyU3JjRWxzKTtcblxuICAgIF9mbkFwcGx5VG9DaGlsZHJlbihmdW5jdGlvbiAoblNpemVyKSB7XG4gICAgICBoZWFkZXJDb250ZW50LnB1c2goblNpemVyLmlubmVySFRNTCk7XG4gICAgICBoZWFkZXJXaWR0aHMucHVzaChfZm5TdHJpbmdUb0NzcygkKG5TaXplcikuY3NzKCd3aWR0aCcpKSk7XG4gICAgfSwgaGVhZGVyU3JjRWxzKTtcblxuICAgIF9mbkFwcGx5VG9DaGlsZHJlbihmdW5jdGlvbiAoblRvU2l6ZSwgaSkge1xuICAgICAgaWYgKCQuaW5BcnJheShuVG9TaXplLCBkdEhlYWRlckNlbGxzKSAhPT0gLTEpIHtcbiAgICAgICAgblRvU2l6ZS5zdHlsZS53aWR0aCA9IGhlYWRlcldpZHRoc1tpXTtcbiAgICAgIH1cbiAgICB9LCBoZWFkZXJUcmdFbHMpO1xuXG4gICAgJChoZWFkZXJTcmNFbHMpLmhlaWdodCgwKTtcblxuICAgIGlmIChmb290ZXIpIHtcbiAgICAgIF9mbkFwcGx5VG9DaGlsZHJlbih6ZXJvT3V0LCBmb290ZXJTcmNFbHMpO1xuXG4gICAgICBfZm5BcHBseVRvQ2hpbGRyZW4oZnVuY3Rpb24gKG5TaXplcikge1xuICAgICAgICBmb290ZXJDb250ZW50LnB1c2goblNpemVyLmlubmVySFRNTCk7XG4gICAgICAgIGZvb3RlcldpZHRocy5wdXNoKF9mblN0cmluZ1RvQ3NzKCQoblNpemVyKS5jc3MoJ3dpZHRoJykpKTtcbiAgICAgIH0sIGZvb3RlclNyY0Vscyk7XG5cbiAgICAgIF9mbkFwcGx5VG9DaGlsZHJlbihmdW5jdGlvbiAoblRvU2l6ZSwgaSkge1xuICAgICAgICBuVG9TaXplLnN0eWxlLndpZHRoID0gZm9vdGVyV2lkdGhzW2ldO1xuICAgICAgfSwgZm9vdGVyVHJnRWxzKTtcblxuICAgICAgJChmb290ZXJTcmNFbHMpLmhlaWdodCgwKTtcbiAgICB9XG5cbiAgICBfZm5BcHBseVRvQ2hpbGRyZW4oZnVuY3Rpb24gKG5TaXplciwgaSkge1xuICAgICAgblNpemVyLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiZGF0YVRhYmxlc19zaXppbmdcIj4nICsgaGVhZGVyQ29udGVudFtpXSArICc8L2Rpdj4nO1xuICAgICAgblNpemVyLmNoaWxkTm9kZXNbMF0uc3R5bGUuaGVpZ2h0ID0gXCIwXCI7XG4gICAgICBuU2l6ZXIuY2hpbGROb2Rlc1swXS5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICBuU2l6ZXIuc3R5bGUud2lkdGggPSBoZWFkZXJXaWR0aHNbaV07XG4gICAgfSwgaGVhZGVyU3JjRWxzKTtcblxuICAgIGlmIChmb290ZXIpIHtcbiAgICAgIF9mbkFwcGx5VG9DaGlsZHJlbihmdW5jdGlvbiAoblNpemVyLCBpKSB7XG4gICAgICAgIG5TaXplci5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImRhdGFUYWJsZXNfc2l6aW5nXCI+JyArIGZvb3RlckNvbnRlbnRbaV0gKyAnPC9kaXY+JztcbiAgICAgICAgblNpemVyLmNoaWxkTm9kZXNbMF0uc3R5bGUuaGVpZ2h0ID0gXCIwXCI7XG4gICAgICAgIG5TaXplci5jaGlsZE5vZGVzWzBdLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgblNpemVyLnN0eWxlLndpZHRoID0gZm9vdGVyV2lkdGhzW2ldO1xuICAgICAgfSwgZm9vdGVyU3JjRWxzKTtcbiAgICB9XG5cbiAgICBpZiAodGFibGUub3V0ZXJXaWR0aCgpIDwgc2FuaXR5V2lkdGgpIHtcbiAgICAgIGNvcnJlY3Rpb24gPSBkaXZCb2R5RWwuc2Nyb2xsSGVpZ2h0ID4gZGl2Qm9keUVsLm9mZnNldEhlaWdodCB8fCBkaXZCb2R5LmNzcygnb3ZlcmZsb3cteScpID09IFwic2Nyb2xsXCIgPyBzYW5pdHlXaWR0aCArIGJhcldpZHRoIDogc2FuaXR5V2lkdGg7XG5cbiAgICAgIGlmIChpZTY3ICYmIChkaXZCb2R5RWwuc2Nyb2xsSGVpZ2h0ID4gZGl2Qm9keUVsLm9mZnNldEhlaWdodCB8fCBkaXZCb2R5LmNzcygnb3ZlcmZsb3cteScpID09IFwic2Nyb2xsXCIpKSB7XG4gICAgICAgIHRhYmxlU3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0Nzcyhjb3JyZWN0aW9uIC0gYmFyV2lkdGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2Nyb2xsWCA9PT0gXCJcIiB8fCBzY3JvbGxYSW5uZXIgIT09IFwiXCIpIHtcbiAgICAgICAgX2ZuTG9nKHNldHRpbmdzLCAxLCAnUG9zc2libGUgY29sdW1uIG1pc2FsaWdubWVudCcsIDYpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3JyZWN0aW9uID0gJzEwMCUnO1xuICAgIH1cblxuICAgIGRpdkJvZHlTdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKGNvcnJlY3Rpb24pO1xuICAgIGRpdkhlYWRlclN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoY29ycmVjdGlvbik7XG5cbiAgICBpZiAoZm9vdGVyKSB7XG4gICAgICBzZXR0aW5ncy5uU2Nyb2xsRm9vdC5zdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKGNvcnJlY3Rpb24pO1xuICAgIH1cblxuICAgIGlmICghc2Nyb2xsWSkge1xuICAgICAgaWYgKGllNjcpIHtcbiAgICAgICAgZGl2Qm9keVN0eWxlLmhlaWdodCA9IF9mblN0cmluZ1RvQ3NzKHRhYmxlRWwub2Zmc2V0SGVpZ2h0ICsgYmFyV2lkdGgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBpT3V0ZXJXaWR0aCA9IHRhYmxlLm91dGVyV2lkdGgoKTtcbiAgICBkaXZIZWFkZXJUYWJsZVswXS5zdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKGlPdXRlcldpZHRoKTtcbiAgICBkaXZIZWFkZXJJbm5lclN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoaU91dGVyV2lkdGgpO1xuICAgIHZhciBiU2Nyb2xsaW5nID0gdGFibGUuaGVpZ2h0KCkgPiBkaXZCb2R5RWwuY2xpZW50SGVpZ2h0IHx8IGRpdkJvZHkuY3NzKCdvdmVyZmxvdy15JykgPT0gXCJzY3JvbGxcIjtcbiAgICB2YXIgcGFkZGluZyA9ICdwYWRkaW5nJyArIChicm93c2VyLmJTY3JvbGxiYXJMZWZ0ID8gJ0xlZnQnIDogJ1JpZ2h0Jyk7XG4gICAgZGl2SGVhZGVySW5uZXJTdHlsZVtwYWRkaW5nXSA9IGJTY3JvbGxpbmcgPyBiYXJXaWR0aCArIFwicHhcIiA6IFwiMHB4XCI7XG5cbiAgICBpZiAoZm9vdGVyKSB7XG4gICAgICBkaXZGb290ZXJUYWJsZVswXS5zdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKGlPdXRlcldpZHRoKTtcbiAgICAgIGRpdkZvb3RlcklubmVyWzBdLnN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoaU91dGVyV2lkdGgpO1xuICAgICAgZGl2Rm9vdGVySW5uZXJbMF0uc3R5bGVbcGFkZGluZ10gPSBiU2Nyb2xsaW5nID8gYmFyV2lkdGggKyBcInB4XCIgOiBcIjBweFwiO1xuICAgIH1cblxuICAgIHRhYmxlLmNoaWxkcmVuKCdjb2xncm91cCcpLmluc2VydEJlZm9yZSh0YWJsZS5jaGlsZHJlbigndGhlYWQnKSk7XG4gICAgZGl2Qm9keS5zY3JvbGwoKTtcblxuICAgIGlmICgoc2V0dGluZ3MuYlNvcnRlZCB8fCBzZXR0aW5ncy5iRmlsdGVyZWQpICYmICFzZXR0aW5ncy5fZHJhd0hvbGQpIHtcbiAgICAgIGRpdkJvZHlFbC5zY3JvbGxUb3AgPSAwO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFwcGx5VG9DaGlsZHJlbihmbiwgYW4xLCBhbjIpIHtcbiAgICB2YXIgaW5kZXggPSAwLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgaUxlbiA9IGFuMS5sZW5ndGg7XG4gICAgdmFyIG5Ob2RlMSwgbk5vZGUyO1xuXG4gICAgd2hpbGUgKGkgPCBpTGVuKSB7XG4gICAgICBuTm9kZTEgPSBhbjFbaV0uZmlyc3RDaGlsZDtcbiAgICAgIG5Ob2RlMiA9IGFuMiA/IGFuMltpXS5maXJzdENoaWxkIDogbnVsbDtcblxuICAgICAgd2hpbGUgKG5Ob2RlMSkge1xuICAgICAgICBpZiAobk5vZGUxLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgaWYgKGFuMikge1xuICAgICAgICAgICAgZm4obk5vZGUxLCBuTm9kZTIsIGluZGV4KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm4obk5vZGUxLCBpbmRleCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIG5Ob2RlMSA9IG5Ob2RlMS5uZXh0U2libGluZztcbiAgICAgICAgbk5vZGUyID0gYW4yID8gbk5vZGUyLm5leHRTaWJsaW5nIDogbnVsbDtcbiAgICAgIH1cblxuICAgICAgaSsrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBfX3JlX2h0bWxfcmVtb3ZlID0gLzwuKj8+L2c7XG5cbiAgZnVuY3Rpb24gX2ZuQ2FsY3VsYXRlQ29sdW1uV2lkdGhzKG9TZXR0aW5ncykge1xuICAgIHZhciB0YWJsZSA9IG9TZXR0aW5ncy5uVGFibGUsXG4gICAgICAgIGNvbHVtbnMgPSBvU2V0dGluZ3MuYW9Db2x1bW5zLFxuICAgICAgICBzY3JvbGwgPSBvU2V0dGluZ3Mub1Njcm9sbCxcbiAgICAgICAgc2Nyb2xsWSA9IHNjcm9sbC5zWSxcbiAgICAgICAgc2Nyb2xsWCA9IHNjcm9sbC5zWCxcbiAgICAgICAgc2Nyb2xsWElubmVyID0gc2Nyb2xsLnNYSW5uZXIsXG4gICAgICAgIGNvbHVtbkNvdW50ID0gY29sdW1ucy5sZW5ndGgsXG4gICAgICAgIHZpc2libGVDb2x1bW5zID0gX2ZuR2V0Q29sdW1ucyhvU2V0dGluZ3MsICdiVmlzaWJsZScpLFxuICAgICAgICBoZWFkZXJDZWxscyA9ICQoJ3RoJywgb1NldHRpbmdzLm5USGVhZCksXG4gICAgICAgIHRhYmxlV2lkdGhBdHRyID0gdGFibGUuZ2V0QXR0cmlidXRlKCd3aWR0aCcpLFxuICAgICAgICB0YWJsZUNvbnRhaW5lciA9IHRhYmxlLnBhcmVudE5vZGUsXG4gICAgICAgIHVzZXJJbnB1dHMgPSBmYWxzZSxcbiAgICAgICAgaSxcbiAgICAgICAgY29sdW1uLFxuICAgICAgICBjb2x1bW5JZHgsXG4gICAgICAgIHdpZHRoLFxuICAgICAgICBvdXRlcldpZHRoLFxuICAgICAgICBicm93c2VyID0gb1NldHRpbmdzLm9Ccm93c2VyLFxuICAgICAgICBpZTY3ID0gYnJvd3Nlci5iU2Nyb2xsT3ZlcnNpemU7XG5cbiAgICB2YXIgc3R5bGVXaWR0aCA9IHRhYmxlLnN0eWxlLndpZHRoO1xuXG4gICAgaWYgKHN0eWxlV2lkdGggJiYgc3R5bGVXaWR0aC5pbmRleE9mKCclJykgIT09IC0xKSB7XG4gICAgICB0YWJsZVdpZHRoQXR0ciA9IHN0eWxlV2lkdGg7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IHZpc2libGVDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb2x1bW4gPSBjb2x1bW5zW3Zpc2libGVDb2x1bW5zW2ldXTtcblxuICAgICAgaWYgKGNvbHVtbi5zV2lkdGggIT09IG51bGwpIHtcbiAgICAgICAgY29sdW1uLnNXaWR0aCA9IF9mbkNvbnZlcnRUb1dpZHRoKGNvbHVtbi5zV2lkdGhPcmlnLCB0YWJsZUNvbnRhaW5lcik7XG4gICAgICAgIHVzZXJJbnB1dHMgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpZTY3IHx8ICF1c2VySW5wdXRzICYmICFzY3JvbGxYICYmICFzY3JvbGxZICYmIGNvbHVtbkNvdW50ID09IF9mblZpc2JsZUNvbHVtbnMob1NldHRpbmdzKSAmJiBjb2x1bW5Db3VudCA9PSBoZWFkZXJDZWxscy5sZW5ndGgpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjb2x1bW5Db3VudDsgaSsrKSB7XG4gICAgICAgIHZhciBjb2xJZHggPSBfZm5WaXNpYmxlVG9Db2x1bW5JbmRleChvU2V0dGluZ3MsIGkpO1xuXG4gICAgICAgIGlmIChjb2xJZHggIT09IG51bGwpIHtcbiAgICAgICAgICBjb2x1bW5zW2NvbElkeF0uc1dpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoaGVhZGVyQ2VsbHMuZXEoaSkud2lkdGgoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHRtcFRhYmxlID0gJCh0YWJsZSkuY2xvbmUoKS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJykucmVtb3ZlQXR0cignaWQnKTtcbiAgICAgIHRtcFRhYmxlLmZpbmQoJ3Rib2R5IHRyJykucmVtb3ZlKCk7XG4gICAgICB2YXIgdHIgPSAkKCc8dHIvPicpLmFwcGVuZFRvKHRtcFRhYmxlLmZpbmQoJ3Rib2R5JykpO1xuICAgICAgdG1wVGFibGUuZmluZCgndGhlYWQsIHRmb290JykucmVtb3ZlKCk7XG4gICAgICB0bXBUYWJsZS5hcHBlbmQoJChvU2V0dGluZ3MublRIZWFkKS5jbG9uZSgpKS5hcHBlbmQoJChvU2V0dGluZ3MublRGb290KS5jbG9uZSgpKTtcbiAgICAgIHRtcFRhYmxlLmZpbmQoJ3Rmb290IHRoLCB0Zm9vdCB0ZCcpLmNzcygnd2lkdGgnLCAnJyk7XG4gICAgICBoZWFkZXJDZWxscyA9IF9mbkdldFVuaXF1ZVRocyhvU2V0dGluZ3MsIHRtcFRhYmxlLmZpbmQoJ3RoZWFkJylbMF0pO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdmlzaWJsZUNvbHVtbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29sdW1uID0gY29sdW1uc1t2aXNpYmxlQ29sdW1uc1tpXV07XG4gICAgICAgIGhlYWRlckNlbGxzW2ldLnN0eWxlLndpZHRoID0gY29sdW1uLnNXaWR0aE9yaWcgIT09IG51bGwgJiYgY29sdW1uLnNXaWR0aE9yaWcgIT09ICcnID8gX2ZuU3RyaW5nVG9Dc3MoY29sdW1uLnNXaWR0aE9yaWcpIDogJyc7XG5cbiAgICAgICAgaWYgKGNvbHVtbi5zV2lkdGhPcmlnICYmIHNjcm9sbFgpIHtcbiAgICAgICAgICAkKGhlYWRlckNlbGxzW2ldKS5hcHBlbmQoJCgnPGRpdi8+JykuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiBjb2x1bW4uc1dpZHRoT3JpZyxcbiAgICAgICAgICAgIG1hcmdpbjogMCxcbiAgICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgICBib3JkZXI6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDFcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9TZXR0aW5ncy5hb0RhdGEubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB2aXNpYmxlQ29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbHVtbklkeCA9IHZpc2libGVDb2x1bW5zW2ldO1xuICAgICAgICAgIGNvbHVtbiA9IGNvbHVtbnNbY29sdW1uSWR4XTtcbiAgICAgICAgICAkKF9mbkdldFdpZGVzdE5vZGUob1NldHRpbmdzLCBjb2x1bW5JZHgpKS5jbG9uZShmYWxzZSkuYXBwZW5kKGNvbHVtbi5zQ29udGVudFBhZGRpbmcpLmFwcGVuZFRvKHRyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAkKCdbbmFtZV0nLCB0bXBUYWJsZSkucmVtb3ZlQXR0cignbmFtZScpO1xuICAgICAgdmFyIGhvbGRlciA9ICQoJzxkaXYvPicpLmNzcyhzY3JvbGxYIHx8IHNjcm9sbFkgPyB7XG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICAgICAgfSA6IHt9KS5hcHBlbmQodG1wVGFibGUpLmFwcGVuZFRvKHRhYmxlQ29udGFpbmVyKTtcblxuICAgICAgaWYgKHNjcm9sbFggJiYgc2Nyb2xsWElubmVyKSB7XG4gICAgICAgIHRtcFRhYmxlLndpZHRoKHNjcm9sbFhJbm5lcik7XG4gICAgICB9IGVsc2UgaWYgKHNjcm9sbFgpIHtcbiAgICAgICAgdG1wVGFibGUuY3NzKCd3aWR0aCcsICdhdXRvJyk7XG4gICAgICAgIHRtcFRhYmxlLnJlbW92ZUF0dHIoJ3dpZHRoJyk7XG5cbiAgICAgICAgaWYgKHRtcFRhYmxlLndpZHRoKCkgPCB0YWJsZUNvbnRhaW5lci5jbGllbnRXaWR0aCAmJiB0YWJsZVdpZHRoQXR0cikge1xuICAgICAgICAgIHRtcFRhYmxlLndpZHRoKHRhYmxlQ29udGFpbmVyLmNsaWVudFdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzY3JvbGxZKSB7XG4gICAgICAgIHRtcFRhYmxlLndpZHRoKHRhYmxlQ29udGFpbmVyLmNsaWVudFdpZHRoKTtcbiAgICAgIH0gZWxzZSBpZiAodGFibGVXaWR0aEF0dHIpIHtcbiAgICAgICAgdG1wVGFibGUud2lkdGgodGFibGVXaWR0aEF0dHIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdG90YWwgPSAwO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdmlzaWJsZUNvbHVtbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNlbGwgPSAkKGhlYWRlckNlbGxzW2ldKTtcbiAgICAgICAgdmFyIGJvcmRlciA9IGNlbGwub3V0ZXJXaWR0aCgpIC0gY2VsbC53aWR0aCgpO1xuICAgICAgICB2YXIgYm91bmRpbmcgPSBicm93c2VyLmJCb3VuZGluZyA/IE1hdGguY2VpbChoZWFkZXJDZWxsc1tpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCkgOiBjZWxsLm91dGVyV2lkdGgoKTtcbiAgICAgICAgdG90YWwgKz0gYm91bmRpbmc7XG4gICAgICAgIGNvbHVtbnNbdmlzaWJsZUNvbHVtbnNbaV1dLnNXaWR0aCA9IF9mblN0cmluZ1RvQ3NzKGJvdW5kaW5nIC0gYm9yZGVyKTtcbiAgICAgIH1cblxuICAgICAgdGFibGUuc3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0Nzcyh0b3RhbCk7XG4gICAgICBob2xkZXIucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRhYmxlV2lkdGhBdHRyKSB7XG4gICAgICB0YWJsZS5zdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKHRhYmxlV2lkdGhBdHRyKTtcbiAgICB9XG5cbiAgICBpZiAoKHRhYmxlV2lkdGhBdHRyIHx8IHNjcm9sbFgpICYmICFvU2V0dGluZ3MuX3Jlc3pFdnQpIHtcbiAgICAgIHZhciBiaW5kUmVzaXplID0gZnVuY3Rpb24gYmluZFJlc2l6ZSgpIHtcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuRFQtJyArIG9TZXR0aW5ncy5zSW5zdGFuY2UsIF9mblRocm90dGxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfZm5BZGp1c3RDb2x1bW5TaXppbmcob1NldHRpbmdzKTtcbiAgICAgICAgfSkpO1xuICAgICAgfTtcblxuICAgICAgaWYgKGllNjcpIHtcbiAgICAgICAgc2V0VGltZW91dChiaW5kUmVzaXplLCAxMDAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJpbmRSZXNpemUoKTtcbiAgICAgIH1cblxuICAgICAgb1NldHRpbmdzLl9yZXN6RXZ0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICB2YXIgX2ZuVGhyb3R0bGUgPSBEYXRhVGFibGUudXRpbC50aHJvdHRsZTtcblxuICBmdW5jdGlvbiBfZm5Db252ZXJ0VG9XaWR0aCh3aWR0aCwgcGFyZW50KSB7XG4gICAgaWYgKCF3aWR0aCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgdmFyIG4gPSAkKCc8ZGl2Lz4nKS5jc3MoJ3dpZHRoJywgX2ZuU3RyaW5nVG9Dc3Mod2lkdGgpKS5hcHBlbmRUbyhwYXJlbnQgfHwgZG9jdW1lbnQuYm9keSk7XG4gICAgdmFyIHZhbCA9IG5bMF0ub2Zmc2V0V2lkdGg7XG4gICAgbi5yZW1vdmUoKTtcbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuR2V0V2lkZXN0Tm9kZShzZXR0aW5ncywgY29sSWR4KSB7XG4gICAgdmFyIGlkeCA9IF9mbkdldE1heExlblN0cmluZyhzZXR0aW5ncywgY29sSWR4KTtcblxuICAgIGlmIChpZHggPCAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IHNldHRpbmdzLmFvRGF0YVtpZHhdO1xuICAgIHJldHVybiAhZGF0YS5uVHIgPyAkKCc8dGQvPicpLmh0bWwoX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIGlkeCwgY29sSWR4LCAnZGlzcGxheScpKVswXSA6IGRhdGEuYW5DZWxsc1tjb2xJZHhdO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuR2V0TWF4TGVuU3RyaW5nKHNldHRpbmdzLCBjb2xJZHgpIHtcbiAgICB2YXIgcyxcbiAgICAgICAgbWF4ID0gLTEsXG4gICAgICAgIG1heElkeCA9IC0xO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IHNldHRpbmdzLmFvRGF0YS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgcyA9IF9mbkdldENlbGxEYXRhKHNldHRpbmdzLCBpLCBjb2xJZHgsICdkaXNwbGF5JykgKyAnJztcbiAgICAgIHMgPSBzLnJlcGxhY2UoX19yZV9odG1sX3JlbW92ZSwgJycpO1xuICAgICAgcyA9IHMucmVwbGFjZSgvJm5ic3A7L2csICcgJyk7XG5cbiAgICAgIGlmIChzLmxlbmd0aCA+IG1heCkge1xuICAgICAgICBtYXggPSBzLmxlbmd0aDtcbiAgICAgICAgbWF4SWR4ID0gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWF4SWR4O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU3RyaW5nVG9Dc3Mocykge1xuICAgIGlmIChzID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJzBweCc7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzID09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gcyA8IDAgPyAnMHB4JyA6IHMgKyAncHgnO1xuICAgIH1cblxuICAgIHJldHVybiBzLm1hdGNoKC9cXGQkLykgPyBzICsgJ3B4JyA6IHM7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Tb3J0RmxhdHRlbihzZXR0aW5ncykge1xuICAgIHZhciBpLFxuICAgICAgICBpTGVuLFxuICAgICAgICBrLFxuICAgICAgICBrTGVuLFxuICAgICAgICBhU29ydCA9IFtdLFxuICAgICAgICBhaU9yaWcgPSBbXSxcbiAgICAgICAgYW9Db2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zLFxuICAgICAgICBhRGF0YVNvcnQsXG4gICAgICAgIGlDb2wsXG4gICAgICAgIHNUeXBlLFxuICAgICAgICBzcmNDb2wsXG4gICAgICAgIGZpeGVkID0gc2V0dGluZ3MuYWFTb3J0aW5nRml4ZWQsXG4gICAgICAgIGZpeGVkT2JqID0gJC5pc1BsYWluT2JqZWN0KGZpeGVkKSxcbiAgICAgICAgbmVzdGVkU29ydCA9IFtdLFxuICAgICAgICBhZGQgPSBmdW5jdGlvbiBhZGQoYSkge1xuICAgICAgaWYgKGEubGVuZ3RoICYmICEkLmlzQXJyYXkoYVswXSkpIHtcbiAgICAgICAgbmVzdGVkU29ydC5wdXNoKGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJC5tZXJnZShuZXN0ZWRTb3J0LCBhKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCQuaXNBcnJheShmaXhlZCkpIHtcbiAgICAgIGFkZChmaXhlZCk7XG4gICAgfVxuXG4gICAgaWYgKGZpeGVkT2JqICYmIGZpeGVkLnByZSkge1xuICAgICAgYWRkKGZpeGVkLnByZSk7XG4gICAgfVxuXG4gICAgYWRkKHNldHRpbmdzLmFhU29ydGluZyk7XG5cbiAgICBpZiAoZml4ZWRPYmogJiYgZml4ZWQucG9zdCkge1xuICAgICAgYWRkKGZpeGVkLnBvc3QpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBuZXN0ZWRTb3J0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBzcmNDb2wgPSBuZXN0ZWRTb3J0W2ldWzBdO1xuICAgICAgYURhdGFTb3J0ID0gYW9Db2x1bW5zW3NyY0NvbF0uYURhdGFTb3J0O1xuXG4gICAgICBmb3IgKGsgPSAwLCBrTGVuID0gYURhdGFTb3J0Lmxlbmd0aDsgayA8IGtMZW47IGsrKykge1xuICAgICAgICBpQ29sID0gYURhdGFTb3J0W2tdO1xuICAgICAgICBzVHlwZSA9IGFvQ29sdW1uc1tpQ29sXS5zVHlwZSB8fCAnc3RyaW5nJztcblxuICAgICAgICBpZiAobmVzdGVkU29ydFtpXS5faWR4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBuZXN0ZWRTb3J0W2ldLl9pZHggPSAkLmluQXJyYXkobmVzdGVkU29ydFtpXVsxXSwgYW9Db2x1bW5zW2lDb2xdLmFzU29ydGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICBhU29ydC5wdXNoKHtcbiAgICAgICAgICBzcmM6IHNyY0NvbCxcbiAgICAgICAgICBjb2w6IGlDb2wsXG4gICAgICAgICAgZGlyOiBuZXN0ZWRTb3J0W2ldWzFdLFxuICAgICAgICAgIGluZGV4OiBuZXN0ZWRTb3J0W2ldLl9pZHgsXG4gICAgICAgICAgdHlwZTogc1R5cGUsXG4gICAgICAgICAgZm9ybWF0dGVyOiBEYXRhVGFibGUuZXh0LnR5cGUub3JkZXJbc1R5cGUgKyBcIi1wcmVcIl1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFTb3J0O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU29ydChvU2V0dGluZ3MpIHtcbiAgICB2YXIgaSxcbiAgICAgICAgaWVuLFxuICAgICAgICBpTGVuLFxuICAgICAgICBqLFxuICAgICAgICBqTGVuLFxuICAgICAgICBrLFxuICAgICAgICBrTGVuLFxuICAgICAgICBzRGF0YVR5cGUsXG4gICAgICAgIG5UaCxcbiAgICAgICAgYWlPcmlnID0gW10sXG4gICAgICAgIG9FeHRTb3J0ID0gRGF0YVRhYmxlLmV4dC50eXBlLm9yZGVyLFxuICAgICAgICBhb0RhdGEgPSBvU2V0dGluZ3MuYW9EYXRhLFxuICAgICAgICBhb0NvbHVtbnMgPSBvU2V0dGluZ3MuYW9Db2x1bW5zLFxuICAgICAgICBhRGF0YVNvcnQsXG4gICAgICAgIGRhdGEsXG4gICAgICAgIGlDb2wsXG4gICAgICAgIHNUeXBlLFxuICAgICAgICBvU29ydCxcbiAgICAgICAgZm9ybWF0dGVycyA9IDAsXG4gICAgICAgIHNvcnRDb2wsXG4gICAgICAgIGRpc3BsYXlNYXN0ZXIgPSBvU2V0dGluZ3MuYWlEaXNwbGF5TWFzdGVyLFxuICAgICAgICBhU29ydDtcblxuICAgIF9mbkNvbHVtblR5cGVzKG9TZXR0aW5ncyk7XG5cbiAgICBhU29ydCA9IF9mblNvcnRGbGF0dGVuKG9TZXR0aW5ncyk7XG5cbiAgICBmb3IgKGkgPSAwLCBpZW4gPSBhU29ydC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgc29ydENvbCA9IGFTb3J0W2ldO1xuXG4gICAgICBpZiAoc29ydENvbC5mb3JtYXR0ZXIpIHtcbiAgICAgICAgZm9ybWF0dGVycysrO1xuICAgICAgfVxuXG4gICAgICBfZm5Tb3J0RGF0YShvU2V0dGluZ3MsIHNvcnRDb2wuY29sKTtcbiAgICB9XG5cbiAgICBpZiAoX2ZuRGF0YVNvdXJjZShvU2V0dGluZ3MpICE9ICdzc3AnICYmIGFTb3J0Lmxlbmd0aCAhPT0gMCkge1xuICAgICAgZm9yIChpID0gMCwgaUxlbiA9IGRpc3BsYXlNYXN0ZXIubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgIGFpT3JpZ1tkaXNwbGF5TWFzdGVyW2ldXSA9IGk7XG4gICAgICB9XG5cbiAgICAgIGlmIChmb3JtYXR0ZXJzID09PSBhU29ydC5sZW5ndGgpIHtcbiAgICAgICAgZGlzcGxheU1hc3Rlci5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgdmFyIHgsXG4gICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgIGssXG4gICAgICAgICAgICAgIHRlc3QsXG4gICAgICAgICAgICAgIHNvcnQsXG4gICAgICAgICAgICAgIGxlbiA9IGFTb3J0Lmxlbmd0aCxcbiAgICAgICAgICAgICAgZGF0YUEgPSBhb0RhdGFbYV0uX2FTb3J0RGF0YSxcbiAgICAgICAgICAgICAgZGF0YUIgPSBhb0RhdGFbYl0uX2FTb3J0RGF0YTtcblxuICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBsZW47IGsrKykge1xuICAgICAgICAgICAgc29ydCA9IGFTb3J0W2tdO1xuICAgICAgICAgICAgeCA9IGRhdGFBW3NvcnQuY29sXTtcbiAgICAgICAgICAgIHkgPSBkYXRhQltzb3J0LmNvbF07XG4gICAgICAgICAgICB0ZXN0ID0geCA8IHkgPyAtMSA6IHggPiB5ID8gMSA6IDA7XG5cbiAgICAgICAgICAgIGlmICh0ZXN0ICE9PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzb3J0LmRpciA9PT0gJ2FzYycgPyB0ZXN0IDogLXRlc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgeCA9IGFpT3JpZ1thXTtcbiAgICAgICAgICB5ID0gYWlPcmlnW2JdO1xuICAgICAgICAgIHJldHVybiB4IDwgeSA/IC0xIDogeCA+IHkgPyAxIDogMDtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXNwbGF5TWFzdGVyLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICB2YXIgeCxcbiAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgayxcbiAgICAgICAgICAgICAgbCxcbiAgICAgICAgICAgICAgdGVzdCxcbiAgICAgICAgICAgICAgc29ydCxcbiAgICAgICAgICAgICAgZm4sXG4gICAgICAgICAgICAgIGxlbiA9IGFTb3J0Lmxlbmd0aCxcbiAgICAgICAgICAgICAgZGF0YUEgPSBhb0RhdGFbYV0uX2FTb3J0RGF0YSxcbiAgICAgICAgICAgICAgZGF0YUIgPSBhb0RhdGFbYl0uX2FTb3J0RGF0YTtcblxuICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBsZW47IGsrKykge1xuICAgICAgICAgICAgc29ydCA9IGFTb3J0W2tdO1xuICAgICAgICAgICAgeCA9IGRhdGFBW3NvcnQuY29sXTtcbiAgICAgICAgICAgIHkgPSBkYXRhQltzb3J0LmNvbF07XG4gICAgICAgICAgICBmbiA9IG9FeHRTb3J0W3NvcnQudHlwZSArIFwiLVwiICsgc29ydC5kaXJdIHx8IG9FeHRTb3J0W1wic3RyaW5nLVwiICsgc29ydC5kaXJdO1xuICAgICAgICAgICAgdGVzdCA9IGZuKHgsIHkpO1xuXG4gICAgICAgICAgICBpZiAodGVzdCAhPT0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGVzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB4ID0gYWlPcmlnW2FdO1xuICAgICAgICAgIHkgPSBhaU9yaWdbYl07XG4gICAgICAgICAgcmV0dXJuIHggPCB5ID8gLTEgOiB4ID4geSA/IDEgOiAwO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvU2V0dGluZ3MuYlNvcnRlZCA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Tb3J0QXJpYShzZXR0aW5ncykge1xuICAgIHZhciBsYWJlbDtcbiAgICB2YXIgbmV4dFNvcnQ7XG4gICAgdmFyIGNvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnM7XG5cbiAgICB2YXIgYVNvcnQgPSBfZm5Tb3J0RmxhdHRlbihzZXR0aW5ncyk7XG5cbiAgICB2YXIgb0FyaWEgPSBzZXR0aW5ncy5vTGFuZ3VhZ2Uub0FyaWE7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGNvbHVtbnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICB2YXIgY29sID0gY29sdW1uc1tpXTtcbiAgICAgIHZhciBhc1NvcnRpbmcgPSBjb2wuYXNTb3J0aW5nO1xuICAgICAgdmFyIHNUaXRsZSA9IGNvbC5zVGl0bGUucmVwbGFjZSgvPC4qPz4vZywgXCJcIik7XG4gICAgICB2YXIgdGggPSBjb2wublRoO1xuICAgICAgdGgucmVtb3ZlQXR0cmlidXRlKCdhcmlhLXNvcnQnKTtcblxuICAgICAgaWYgKGNvbC5iU29ydGFibGUpIHtcbiAgICAgICAgaWYgKGFTb3J0Lmxlbmd0aCA+IDAgJiYgYVNvcnRbMF0uY29sID09IGkpIHtcbiAgICAgICAgICB0aC5zZXRBdHRyaWJ1dGUoJ2FyaWEtc29ydCcsIGFTb3J0WzBdLmRpciA9PSBcImFzY1wiID8gXCJhc2NlbmRpbmdcIiA6IFwiZGVzY2VuZGluZ1wiKTtcbiAgICAgICAgICBuZXh0U29ydCA9IGFzU29ydGluZ1thU29ydFswXS5pbmRleCArIDFdIHx8IGFzU29ydGluZ1swXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXh0U29ydCA9IGFzU29ydGluZ1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxhYmVsID0gc1RpdGxlICsgKG5leHRTb3J0ID09PSBcImFzY1wiID8gb0FyaWEuc1NvcnRBc2NlbmRpbmcgOiBvQXJpYS5zU29ydERlc2NlbmRpbmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGFiZWwgPSBzVGl0bGU7XG4gICAgICB9XG5cbiAgICAgIHRoLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGxhYmVsKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Tb3J0TGlzdGVuZXIoc2V0dGluZ3MsIGNvbElkeCwgYXBwZW5kLCBjYWxsYmFjaykge1xuICAgIHZhciBjb2wgPSBzZXR0aW5ncy5hb0NvbHVtbnNbY29sSWR4XTtcbiAgICB2YXIgc29ydGluZyA9IHNldHRpbmdzLmFhU29ydGluZztcbiAgICB2YXIgYXNTb3J0aW5nID0gY29sLmFzU29ydGluZztcbiAgICB2YXIgbmV4dFNvcnRJZHg7XG5cbiAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uIG5leHQoYSwgb3ZlcmZsb3cpIHtcbiAgICAgIHZhciBpZHggPSBhLl9pZHg7XG5cbiAgICAgIGlmIChpZHggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZHggPSAkLmluQXJyYXkoYVsxXSwgYXNTb3J0aW5nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlkeCArIDEgPCBhc1NvcnRpbmcubGVuZ3RoID8gaWR4ICsgMSA6IG92ZXJmbG93ID8gbnVsbCA6IDA7XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2Ygc29ydGluZ1swXSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHNvcnRpbmcgPSBzZXR0aW5ncy5hYVNvcnRpbmcgPSBbc29ydGluZ107XG4gICAgfVxuXG4gICAgaWYgKGFwcGVuZCAmJiBzZXR0aW5ncy5vRmVhdHVyZXMuYlNvcnRNdWx0aSkge1xuICAgICAgdmFyIHNvcnRJZHggPSAkLmluQXJyYXkoY29sSWR4LCBfcGx1Y2soc29ydGluZywgJzAnKSk7XG5cbiAgICAgIGlmIChzb3J0SWR4ICE9PSAtMSkge1xuICAgICAgICBuZXh0U29ydElkeCA9IG5leHQoc29ydGluZ1tzb3J0SWR4XSwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKG5leHRTb3J0SWR4ID09PSBudWxsICYmIHNvcnRpbmcubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgbmV4dFNvcnRJZHggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHRTb3J0SWR4ID09PSBudWxsKSB7XG4gICAgICAgICAgc29ydGluZy5zcGxpY2Uoc29ydElkeCwgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc29ydGluZ1tzb3J0SWR4XVsxXSA9IGFzU29ydGluZ1tuZXh0U29ydElkeF07XG4gICAgICAgICAgc29ydGluZ1tzb3J0SWR4XS5faWR4ID0gbmV4dFNvcnRJZHg7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNvcnRpbmcucHVzaChbY29sSWR4LCBhc1NvcnRpbmdbMF0sIDBdKTtcbiAgICAgICAgc29ydGluZ1tzb3J0aW5nLmxlbmd0aCAtIDFdLl9pZHggPSAwO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc29ydGluZy5sZW5ndGggJiYgc29ydGluZ1swXVswXSA9PSBjb2xJZHgpIHtcbiAgICAgIG5leHRTb3J0SWR4ID0gbmV4dChzb3J0aW5nWzBdKTtcbiAgICAgIHNvcnRpbmcubGVuZ3RoID0gMTtcbiAgICAgIHNvcnRpbmdbMF1bMV0gPSBhc1NvcnRpbmdbbmV4dFNvcnRJZHhdO1xuICAgICAgc29ydGluZ1swXS5faWR4ID0gbmV4dFNvcnRJZHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNvcnRpbmcubGVuZ3RoID0gMDtcbiAgICAgIHNvcnRpbmcucHVzaChbY29sSWR4LCBhc1NvcnRpbmdbMF1dKTtcbiAgICAgIHNvcnRpbmdbMF0uX2lkeCA9IDA7XG4gICAgfVxuXG4gICAgX2ZuUmVEcmF3KHNldHRpbmdzKTtcblxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2soc2V0dGluZ3MpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNvcnRBdHRhY2hMaXN0ZW5lcihzZXR0aW5ncywgYXR0YWNoVG8sIGNvbElkeCwgY2FsbGJhY2spIHtcbiAgICB2YXIgY29sID0gc2V0dGluZ3MuYW9Db2x1bW5zW2NvbElkeF07XG5cbiAgICBfZm5CaW5kQWN0aW9uKGF0dGFjaFRvLCB7fSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChjb2wuYlNvcnRhYmxlID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXR0aW5ncy5vRmVhdHVyZXMuYlByb2Nlc3NpbmcpIHtcbiAgICAgICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkoc2V0dGluZ3MsIHRydWUpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF9mblNvcnRMaXN0ZW5lcihzZXR0aW5ncywgY29sSWR4LCBlLnNoaWZ0S2V5LCBjYWxsYmFjayk7XG5cbiAgICAgICAgICBpZiAoX2ZuRGF0YVNvdXJjZShzZXR0aW5ncykgIT09ICdzc3AnKSB7XG4gICAgICAgICAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShzZXR0aW5ncywgZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfZm5Tb3J0TGlzdGVuZXIoc2V0dGluZ3MsIGNvbElkeCwgZS5zaGlmdEtleSwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU29ydGluZ0NsYXNzZXMoc2V0dGluZ3MpIHtcbiAgICB2YXIgb2xkU29ydCA9IHNldHRpbmdzLmFMYXN0U29ydDtcbiAgICB2YXIgc29ydENsYXNzID0gc2V0dGluZ3Mub0NsYXNzZXMuc1NvcnRDb2x1bW47XG5cbiAgICB2YXIgc29ydCA9IF9mblNvcnRGbGF0dGVuKHNldHRpbmdzKTtcblxuICAgIHZhciBmZWF0dXJlcyA9IHNldHRpbmdzLm9GZWF0dXJlcztcbiAgICB2YXIgaSwgaWVuLCBjb2xJZHg7XG5cbiAgICBpZiAoZmVhdHVyZXMuYlNvcnQgJiYgZmVhdHVyZXMuYlNvcnRDbGFzc2VzKSB7XG4gICAgICBmb3IgKGkgPSAwLCBpZW4gPSBvbGRTb3J0Lmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGNvbElkeCA9IG9sZFNvcnRbaV0uc3JjO1xuICAgICAgICAkKF9wbHVjayhzZXR0aW5ncy5hb0RhdGEsICdhbkNlbGxzJywgY29sSWR4KSkucmVtb3ZlQ2xhc3Moc29ydENsYXNzICsgKGkgPCAyID8gaSArIDEgOiAzKSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IHNvcnQubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgY29sSWR4ID0gc29ydFtpXS5zcmM7XG4gICAgICAgICQoX3BsdWNrKHNldHRpbmdzLmFvRGF0YSwgJ2FuQ2VsbHMnLCBjb2xJZHgpKS5hZGRDbGFzcyhzb3J0Q2xhc3MgKyAoaSA8IDIgPyBpICsgMSA6IDMpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR0aW5ncy5hTGFzdFNvcnQgPSBzb3J0O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU29ydERhdGEoc2V0dGluZ3MsIGlkeCkge1xuICAgIHZhciBjb2x1bW4gPSBzZXR0aW5ncy5hb0NvbHVtbnNbaWR4XTtcbiAgICB2YXIgY3VzdG9tU29ydCA9IERhdGFUYWJsZS5leHQub3JkZXJbY29sdW1uLnNTb3J0RGF0YVR5cGVdO1xuICAgIHZhciBjdXN0b21EYXRhO1xuXG4gICAgaWYgKGN1c3RvbVNvcnQpIHtcbiAgICAgIGN1c3RvbURhdGEgPSBjdXN0b21Tb3J0LmNhbGwoc2V0dGluZ3Mub0luc3RhbmNlLCBzZXR0aW5ncywgaWR4LCBfZm5Db2x1bW5JbmRleFRvVmlzaWJsZShzZXR0aW5ncywgaWR4KSk7XG4gICAgfVxuXG4gICAgdmFyIHJvdywgY2VsbERhdGE7XG4gICAgdmFyIGZvcm1hdHRlciA9IERhdGFUYWJsZS5leHQudHlwZS5vcmRlcltjb2x1bW4uc1R5cGUgKyBcIi1wcmVcIl07XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gc2V0dGluZ3MuYW9EYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICByb3cgPSBzZXR0aW5ncy5hb0RhdGFbaV07XG5cbiAgICAgIGlmICghcm93Ll9hU29ydERhdGEpIHtcbiAgICAgICAgcm93Ll9hU29ydERhdGEgPSBbXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyb3cuX2FTb3J0RGF0YVtpZHhdIHx8IGN1c3RvbVNvcnQpIHtcbiAgICAgICAgY2VsbERhdGEgPSBjdXN0b21Tb3J0ID8gY3VzdG9tRGF0YVtpXSA6IF9mbkdldENlbGxEYXRhKHNldHRpbmdzLCBpLCBpZHgsICdzb3J0Jyk7XG4gICAgICAgIHJvdy5fYVNvcnREYXRhW2lkeF0gPSBmb3JtYXR0ZXIgPyBmb3JtYXR0ZXIoY2VsbERhdGEpIDogY2VsbERhdGE7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU2F2ZVN0YXRlKHNldHRpbmdzKSB7XG4gICAgaWYgKCFzZXR0aW5ncy5vRmVhdHVyZXMuYlN0YXRlU2F2ZSB8fCBzZXR0aW5ncy5iRGVzdHJveWluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBzdGF0ZSA9IHtcbiAgICAgIHRpbWU6ICtuZXcgRGF0ZSgpLFxuICAgICAgc3RhcnQ6IHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0LFxuICAgICAgbGVuZ3RoOiBzZXR0aW5ncy5faURpc3BsYXlMZW5ndGgsXG4gICAgICBvcmRlcjogJC5leHRlbmQodHJ1ZSwgW10sIHNldHRpbmdzLmFhU29ydGluZyksXG4gICAgICBzZWFyY2g6IF9mblNlYXJjaFRvQ2FtZWwoc2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoKSxcbiAgICAgIGNvbHVtbnM6ICQubWFwKHNldHRpbmdzLmFvQ29sdW1ucywgZnVuY3Rpb24gKGNvbCwgaSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHZpc2libGU6IGNvbC5iVmlzaWJsZSxcbiAgICAgICAgICBzZWFyY2g6IF9mblNlYXJjaFRvQ2FtZWwoc2V0dGluZ3MuYW9QcmVTZWFyY2hDb2xzW2ldKVxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICB9O1xuXG4gICAgX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCBcImFvU3RhdGVTYXZlUGFyYW1zXCIsICdzdGF0ZVNhdmVQYXJhbXMnLCBbc2V0dGluZ3MsIHN0YXRlXSk7XG5cbiAgICBzZXR0aW5ncy5vU2F2ZWRTdGF0ZSA9IHN0YXRlO1xuICAgIHNldHRpbmdzLmZuU3RhdGVTYXZlQ2FsbGJhY2suY2FsbChzZXR0aW5ncy5vSW5zdGFuY2UsIHNldHRpbmdzLCBzdGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Mb2FkU3RhdGUoc2V0dGluZ3MsIG9Jbml0LCBjYWxsYmFjaykge1xuICAgIHZhciBpLCBpZW47XG4gICAgdmFyIGNvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnM7XG5cbiAgICB2YXIgbG9hZGVkID0gZnVuY3Rpb24gbG9hZGVkKHMpIHtcbiAgICAgIGlmICghcyB8fCAhcy50aW1lKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGFiU3RhdGVMb2FkID0gX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCAnYW9TdGF0ZUxvYWRQYXJhbXMnLCAnc3RhdGVMb2FkUGFyYW1zJywgW3NldHRpbmdzLCBzXSk7XG5cbiAgICAgIGlmICgkLmluQXJyYXkoZmFsc2UsIGFiU3RhdGVMb2FkKSAhPT0gLTEpIHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZHVyYXRpb24gPSBzZXR0aW5ncy5pU3RhdGVEdXJhdGlvbjtcblxuICAgICAgaWYgKGR1cmF0aW9uID4gMCAmJiBzLnRpbWUgPCArbmV3IERhdGUoKSAtIGR1cmF0aW9uICogMTAwMCkge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChzLmNvbHVtbnMgJiYgY29sdW1ucy5sZW5ndGggIT09IHMuY29sdW1ucy5sZW5ndGgpIHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZXR0aW5ncy5vTG9hZGVkU3RhdGUgPSAkLmV4dGVuZCh0cnVlLCB7fSwgcyk7XG5cbiAgICAgIGlmIChzLnN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQgPSBzLnN0YXJ0O1xuICAgICAgICBzZXR0aW5ncy5pSW5pdERpc3BsYXlTdGFydCA9IHMuc3RhcnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChzLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNldHRpbmdzLl9pRGlzcGxheUxlbmd0aCA9IHMubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBpZiAocy5vcmRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNldHRpbmdzLmFhU29ydGluZyA9IFtdO1xuICAgICAgICAkLmVhY2gocy5vcmRlciwgZnVuY3Rpb24gKGksIGNvbCkge1xuICAgICAgICAgIHNldHRpbmdzLmFhU29ydGluZy5wdXNoKGNvbFswXSA+PSBjb2x1bW5zLmxlbmd0aCA/IFswLCBjb2xbMV1dIDogY29sKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzLnNlYXJjaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICQuZXh0ZW5kKHNldHRpbmdzLm9QcmV2aW91c1NlYXJjaCwgX2ZuU2VhcmNoVG9IdW5nKHMuc2VhcmNoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzLmNvbHVtbnMpIHtcbiAgICAgICAgZm9yIChpID0gMCwgaWVuID0gcy5jb2x1bW5zLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgdmFyIGNvbCA9IHMuY29sdW1uc1tpXTtcblxuICAgICAgICAgIGlmIChjb2wudmlzaWJsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb2x1bW5zW2ldLmJWaXNpYmxlID0gY29sLnZpc2libGU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvbC5zZWFyY2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgJC5leHRlbmQoc2V0dGluZ3MuYW9QcmVTZWFyY2hDb2xzW2ldLCBfZm5TZWFyY2hUb0h1bmcoY29sLnNlYXJjaCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsICdhb1N0YXRlTG9hZGVkJywgJ3N0YXRlTG9hZGVkJywgW3NldHRpbmdzLCBzXSk7XG5cbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfTtcblxuICAgIGlmICghc2V0dGluZ3Mub0ZlYXR1cmVzLmJTdGF0ZVNhdmUpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlID0gc2V0dGluZ3MuZm5TdGF0ZUxvYWRDYWxsYmFjay5jYWxsKHNldHRpbmdzLm9JbnN0YW5jZSwgc2V0dGluZ3MsIGxvYWRlZCk7XG5cbiAgICBpZiAoc3RhdGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbG9hZGVkKHN0YXRlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5TZXR0aW5nc0Zyb21Ob2RlKHRhYmxlKSB7XG4gICAgdmFyIHNldHRpbmdzID0gRGF0YVRhYmxlLnNldHRpbmdzO1xuICAgIHZhciBpZHggPSAkLmluQXJyYXkodGFibGUsIF9wbHVjayhzZXR0aW5ncywgJ25UYWJsZScpKTtcbiAgICByZXR1cm4gaWR4ICE9PSAtMSA/IHNldHRpbmdzW2lkeF0gOiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuTG9nKHNldHRpbmdzLCBsZXZlbCwgbXNnLCB0bikge1xuICAgIG1zZyA9ICdEYXRhVGFibGVzIHdhcm5pbmc6ICcgKyAoc2V0dGluZ3MgPyAndGFibGUgaWQ9JyArIHNldHRpbmdzLnNUYWJsZUlkICsgJyAtICcgOiAnJykgKyBtc2c7XG5cbiAgICBpZiAodG4pIHtcbiAgICAgIG1zZyArPSAnLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGlzIGVycm9yLCBwbGVhc2Ugc2VlICcgKyAnaHR0cDovL2RhdGF0YWJsZXMubmV0L3RuLycgKyB0bjtcbiAgICB9XG5cbiAgICBpZiAoIWxldmVsKSB7XG4gICAgICB2YXIgZXh0ID0gRGF0YVRhYmxlLmV4dDtcbiAgICAgIHZhciB0eXBlID0gZXh0LnNFcnJNb2RlIHx8IGV4dC5lcnJNb2RlO1xuXG4gICAgICBpZiAoc2V0dGluZ3MpIHtcbiAgICAgICAgX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCBudWxsLCAnZXJyb3InLCBbc2V0dGluZ3MsIHRuLCBtc2ddKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUgPT0gJ2FsZXJ0Jykge1xuICAgICAgICBhbGVydChtc2cpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09ICd0aHJvdycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0eXBlID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdHlwZShzZXR0aW5ncywgdG4sIG1zZyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLmxvZykge1xuICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5NYXAocmV0LCBzcmMsIG5hbWUsIG1hcHBlZE5hbWUpIHtcbiAgICBpZiAoJC5pc0FycmF5KG5hbWUpKSB7XG4gICAgICAkLmVhY2gobmFtZSwgZnVuY3Rpb24gKGksIHZhbCkge1xuICAgICAgICBpZiAoJC5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICBfZm5NYXAocmV0LCBzcmMsIHZhbFswXSwgdmFsWzFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfZm5NYXAocmV0LCBzcmMsIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChtYXBwZWROYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG1hcHBlZE5hbWUgPSBuYW1lO1xuICAgIH1cblxuICAgIGlmIChzcmNbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0W21hcHBlZE5hbWVdID0gc3JjW25hbWVdO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkV4dGVuZChvdXQsIGV4dGVuZGVyLCBicmVha1JlZnMpIHtcbiAgICB2YXIgdmFsO1xuXG4gICAgZm9yICh2YXIgcHJvcCBpbiBleHRlbmRlcikge1xuICAgICAgaWYgKGV4dGVuZGVyLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgIHZhbCA9IGV4dGVuZGVyW3Byb3BdO1xuXG4gICAgICAgIGlmICgkLmlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgICAgIGlmICghJC5pc1BsYWluT2JqZWN0KG91dFtwcm9wXSkpIHtcbiAgICAgICAgICAgIG91dFtwcm9wXSA9IHt9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQuZXh0ZW5kKHRydWUsIG91dFtwcm9wXSwgdmFsKTtcbiAgICAgICAgfSBlbHNlIGlmIChicmVha1JlZnMgJiYgcHJvcCAhPT0gJ2RhdGEnICYmIHByb3AgIT09ICdhYURhdGEnICYmICQuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgb3V0W3Byb3BdID0gdmFsLnNsaWNlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0W3Byb3BdID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkJpbmRBY3Rpb24obiwgb0RhdGEsIGZuKSB7XG4gICAgJChuKS5vbignY2xpY2suRFQnLCBvRGF0YSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQobikuYmx1cigpO1xuICAgICAgZm4oZSk7XG4gICAgfSkub24oJ2tleXByZXNzLkRUJywgb0RhdGEsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZS53aGljaCA9PT0gMTMpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBmbihlKTtcbiAgICAgIH1cbiAgICB9KS5vbignc2VsZWN0c3RhcnQuRFQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsIHNTdG9yZSwgZm4sIHNOYW1lKSB7XG4gICAgaWYgKGZuKSB7XG4gICAgICBvU2V0dGluZ3Nbc1N0b3JlXS5wdXNoKHtcbiAgICAgICAgXCJmblwiOiBmbixcbiAgICAgICAgXCJzTmFtZVwiOiBzTmFtZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCBjYWxsYmFja0FyciwgZXZlbnROYW1lLCBhcmdzKSB7XG4gICAgdmFyIHJldCA9IFtdO1xuXG4gICAgaWYgKGNhbGxiYWNrQXJyKSB7XG4gICAgICByZXQgPSAkLm1hcChzZXR0aW5nc1tjYWxsYmFja0Fycl0uc2xpY2UoKS5yZXZlcnNlKCksIGZ1bmN0aW9uICh2YWwsIGkpIHtcbiAgICAgICAgcmV0dXJuIHZhbC5mbi5hcHBseShzZXR0aW5ncy5vSW5zdGFuY2UsIGFyZ3MpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50TmFtZSAhPT0gbnVsbCkge1xuICAgICAgdmFyIGUgPSAkLkV2ZW50KGV2ZW50TmFtZSArICcuZHQnKTtcbiAgICAgICQoc2V0dGluZ3MublRhYmxlKS50cmlnZ2VyKGUsIGFyZ3MpO1xuICAgICAgcmV0LnB1c2goZS5yZXN1bHQpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5MZW5ndGhPdmVyZmxvdyhzZXR0aW5ncykge1xuICAgIHZhciBzdGFydCA9IHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0LFxuICAgICAgICBlbmQgPSBzZXR0aW5ncy5mbkRpc3BsYXlFbmQoKSxcbiAgICAgICAgbGVuID0gc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoO1xuXG4gICAgaWYgKHN0YXJ0ID49IGVuZCkge1xuICAgICAgc3RhcnQgPSBlbmQgLSBsZW47XG4gICAgfVxuXG4gICAgc3RhcnQgLT0gc3RhcnQgJSBsZW47XG5cbiAgICBpZiAobGVuID09PSAtMSB8fCBzdGFydCA8IDApIHtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG5cbiAgICBzZXR0aW5ncy5faURpc3BsYXlTdGFydCA9IHN0YXJ0O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuUmVuZGVyZXIoc2V0dGluZ3MsIHR5cGUpIHtcbiAgICB2YXIgcmVuZGVyZXIgPSBzZXR0aW5ncy5yZW5kZXJlcjtcbiAgICB2YXIgaG9zdCA9IERhdGFUYWJsZS5leHQucmVuZGVyZXJbdHlwZV07XG5cbiAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHJlbmRlcmVyKSAmJiByZW5kZXJlclt0eXBlXSkge1xuICAgICAgcmV0dXJuIGhvc3RbcmVuZGVyZXJbdHlwZV1dIHx8IGhvc3QuXztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByZW5kZXJlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBob3N0W3JlbmRlcmVyXSB8fCBob3N0Ll87XG4gICAgfVxuXG4gICAgcmV0dXJuIGhvc3QuXztcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkRhdGFTb3VyY2Uoc2V0dGluZ3MpIHtcbiAgICBpZiAoc2V0dGluZ3Mub0ZlYXR1cmVzLmJTZXJ2ZXJTaWRlKSB7XG4gICAgICByZXR1cm4gJ3NzcCc7XG4gICAgfSBlbHNlIGlmIChzZXR0aW5ncy5hamF4IHx8IHNldHRpbmdzLnNBamF4U291cmNlKSB7XG4gICAgICByZXR1cm4gJ2FqYXgnO1xuICAgIH1cblxuICAgIHJldHVybiAnZG9tJztcbiAgfVxuXG4gIHZhciBfX2FwaVN0cnVjdCA9IFtdO1xuICB2YXIgX19hcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4gIHZhciBfdG9TZXR0aW5ncyA9IGZ1bmN0aW9uIF90b1NldHRpbmdzKG1peGVkKSB7XG4gICAgdmFyIGlkeCwganE7XG4gICAgdmFyIHNldHRpbmdzID0gRGF0YVRhYmxlLnNldHRpbmdzO1xuICAgIHZhciB0YWJsZXMgPSAkLm1hcChzZXR0aW5ncywgZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICByZXR1cm4gZWwublRhYmxlO1xuICAgIH0pO1xuXG4gICAgaWYgKCFtaXhlZCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSBpZiAobWl4ZWQublRhYmxlICYmIG1peGVkLm9BcGkpIHtcbiAgICAgIHJldHVybiBbbWl4ZWRdO1xuICAgIH0gZWxzZSBpZiAobWl4ZWQubm9kZU5hbWUgJiYgbWl4ZWQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RhYmxlJykge1xuICAgICAgaWR4ID0gJC5pbkFycmF5KG1peGVkLCB0YWJsZXMpO1xuICAgICAgcmV0dXJuIGlkeCAhPT0gLTEgPyBbc2V0dGluZ3NbaWR4XV0gOiBudWxsO1xuICAgIH0gZWxzZSBpZiAobWl4ZWQgJiYgdHlwZW9mIG1peGVkLnNldHRpbmdzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gbWl4ZWQuc2V0dGluZ3MoKS50b0FycmF5KCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbWl4ZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBqcSA9ICQobWl4ZWQpO1xuICAgIH0gZWxzZSBpZiAobWl4ZWQgaW5zdGFuY2VvZiAkKSB7XG4gICAgICBqcSA9IG1peGVkO1xuICAgIH1cblxuICAgIGlmIChqcSkge1xuICAgICAgcmV0dXJuIGpxLm1hcChmdW5jdGlvbiAoaSkge1xuICAgICAgICBpZHggPSAkLmluQXJyYXkodGhpcywgdGFibGVzKTtcbiAgICAgICAgcmV0dXJuIGlkeCAhPT0gLTEgPyBzZXR0aW5nc1tpZHhdIDogbnVsbDtcbiAgICAgIH0pLnRvQXJyYXkoKTtcbiAgICB9XG4gIH07XG5cbiAgX0FwaTIgPSBmdW5jdGlvbiBfQXBpKGNvbnRleHQsIGRhdGEpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgX0FwaTIpKSB7XG4gICAgICByZXR1cm4gbmV3IF9BcGkyKGNvbnRleHQsIGRhdGEpO1xuICAgIH1cblxuICAgIHZhciBzZXR0aW5ncyA9IFtdO1xuXG4gICAgdmFyIGN0eFNldHRpbmdzID0gZnVuY3Rpb24gY3R4U2V0dGluZ3Mobykge1xuICAgICAgdmFyIGEgPSBfdG9TZXR0aW5ncyhvKTtcblxuICAgICAgaWYgKGEpIHtcbiAgICAgICAgc2V0dGluZ3MgPSBzZXR0aW5ncy5jb25jYXQoYSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICgkLmlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBjb250ZXh0Lmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGN0eFNldHRpbmdzKGNvbnRleHRbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjdHhTZXR0aW5ncyhjb250ZXh0KTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRleHQgPSBfdW5pcXVlKHNldHRpbmdzKTtcblxuICAgIGlmIChkYXRhKSB7XG4gICAgICAkLm1lcmdlKHRoaXMsIGRhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0b3IgPSB7XG4gICAgICByb3dzOiBudWxsLFxuICAgICAgY29sczogbnVsbCxcbiAgICAgIG9wdHM6IG51bGxcbiAgICB9O1xuXG4gICAgX0FwaTIuZXh0ZW5kKHRoaXMsIHRoaXMsIF9fYXBpU3RydWN0KTtcbiAgfTtcblxuICBEYXRhVGFibGUuQXBpID0gX0FwaTI7XG4gICQuZXh0ZW5kKF9BcGkyLnByb3RvdHlwZSwge1xuICAgIGFueTogZnVuY3Rpb24gYW55KCkge1xuICAgICAgcmV0dXJuIHRoaXMuY291bnQoKSAhPT0gMDtcbiAgICB9LFxuICAgIGNvbmNhdDogX19hcnJheVByb3RvLmNvbmNhdCxcbiAgICBjb250ZXh0OiBbXSxcbiAgICBjb3VudDogZnVuY3Rpb24gY291bnQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5mbGF0dGVuKCkubGVuZ3RoO1xuICAgIH0sXG4gICAgZWFjaDogZnVuY3Rpb24gZWFjaChmbikge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IHRoaXMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgZm4uY2FsbCh0aGlzLCB0aGlzW2ldLCBpLCB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBlcTogZnVuY3Rpb24gZXEoaWR4KSB7XG4gICAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuICAgICAgcmV0dXJuIGN0eC5sZW5ndGggPiBpZHggPyBuZXcgX0FwaTIoY3R4W2lkeF0sIHRoaXNbaWR4XSkgOiBudWxsO1xuICAgIH0sXG4gICAgZmlsdGVyOiBmdW5jdGlvbiBmaWx0ZXIoZm4pIHtcbiAgICAgIHZhciBhID0gW107XG5cbiAgICAgIGlmIChfX2FycmF5UHJvdG8uZmlsdGVyKSB7XG4gICAgICAgIGEgPSBfX2FycmF5UHJvdG8uZmlsdGVyLmNhbGwodGhpcywgZm4sIHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IHRoaXMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICBpZiAoZm4uY2FsbCh0aGlzLCB0aGlzW2ldLCBpLCB0aGlzKSkge1xuICAgICAgICAgICAgYS5wdXNoKHRoaXNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IF9BcGkyKHRoaXMuY29udGV4dCwgYSk7XG4gICAgfSxcbiAgICBmbGF0dGVuOiBmdW5jdGlvbiBmbGF0dGVuKCkge1xuICAgICAgdmFyIGEgPSBbXTtcbiAgICAgIHJldHVybiBuZXcgX0FwaTIodGhpcy5jb250ZXh0LCBhLmNvbmNhdC5hcHBseShhLCB0aGlzLnRvQXJyYXkoKSkpO1xuICAgIH0sXG4gICAgam9pbjogX19hcnJheVByb3RvLmpvaW4sXG4gICAgaW5kZXhPZjogX19hcnJheVByb3RvLmluZGV4T2YgfHwgZnVuY3Rpb24gKG9iaiwgc3RhcnQpIHtcbiAgICAgIGZvciAodmFyIGkgPSBzdGFydCB8fCAwLCBpZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzW2ldID09PSBvYmopIHtcbiAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gLTE7XG4gICAgfSxcbiAgICBpdGVyYXRvcjogZnVuY3Rpb24gaXRlcmF0b3IoZmxhdHRlbiwgdHlwZSwgZm4sIGFsd2F5c05ldykge1xuICAgICAgdmFyIGEgPSBbXSxcbiAgICAgICAgICByZXQsXG4gICAgICAgICAgaSxcbiAgICAgICAgICBpZW4sXG4gICAgICAgICAgaixcbiAgICAgICAgICBqZW4sXG4gICAgICAgICAgY29udGV4dCA9IHRoaXMuY29udGV4dCxcbiAgICAgICAgICByb3dzLFxuICAgICAgICAgIGl0ZW1zLFxuICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgc2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yO1xuXG4gICAgICBpZiAodHlwZW9mIGZsYXR0ZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGFsd2F5c05ldyA9IGZuO1xuICAgICAgICBmbiA9IHR5cGU7XG4gICAgICAgIHR5cGUgPSBmbGF0dGVuO1xuICAgICAgICBmbGF0dGVuID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IGNvbnRleHQubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgdmFyIGFwaUluc3QgPSBuZXcgX0FwaTIoY29udGV4dFtpXSk7XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICd0YWJsZScpIHtcbiAgICAgICAgICByZXQgPSBmbi5jYWxsKGFwaUluc3QsIGNvbnRleHRbaV0sIGkpO1xuXG4gICAgICAgICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhLnB1c2gocmV0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2NvbHVtbnMnIHx8IHR5cGUgPT09ICdyb3dzJykge1xuICAgICAgICAgIHJldCA9IGZuLmNhbGwoYXBpSW5zdCwgY29udGV4dFtpXSwgdGhpc1tpXSwgaSk7XG5cbiAgICAgICAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGEucHVzaChyZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnY29sdW1uJyB8fCB0eXBlID09PSAnY29sdW1uLXJvd3MnIHx8IHR5cGUgPT09ICdyb3cnIHx8IHR5cGUgPT09ICdjZWxsJykge1xuICAgICAgICAgIGl0ZW1zID0gdGhpc1tpXTtcblxuICAgICAgICAgIGlmICh0eXBlID09PSAnY29sdW1uLXJvd3MnKSB7XG4gICAgICAgICAgICByb3dzID0gX3NlbGVjdG9yX3Jvd19pbmRleGVzKGNvbnRleHRbaV0sIHNlbGVjdG9yLm9wdHMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAoaiA9IDAsIGplbiA9IGl0ZW1zLmxlbmd0aDsgaiA8IGplbjsgaisrKSB7XG4gICAgICAgICAgICBpdGVtID0gaXRlbXNbal07XG5cbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnY2VsbCcpIHtcbiAgICAgICAgICAgICAgcmV0ID0gZm4uY2FsbChhcGlJbnN0LCBjb250ZXh0W2ldLCBpdGVtLnJvdywgaXRlbS5jb2x1bW4sIGksIGopO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0ID0gZm4uY2FsbChhcGlJbnN0LCBjb250ZXh0W2ldLCBpdGVtLCBpLCBqLCByb3dzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGEucHVzaChyZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYS5sZW5ndGggfHwgYWx3YXlzTmV3KSB7XG4gICAgICAgIHZhciBhcGkgPSBuZXcgX0FwaTIoY29udGV4dCwgZmxhdHRlbiA/IGEuY29uY2F0LmFwcGx5KFtdLCBhKSA6IGEpO1xuICAgICAgICB2YXIgYXBpU2VsZWN0b3IgPSBhcGkuc2VsZWN0b3I7XG4gICAgICAgIGFwaVNlbGVjdG9yLnJvd3MgPSBzZWxlY3Rvci5yb3dzO1xuICAgICAgICBhcGlTZWxlY3Rvci5jb2xzID0gc2VsZWN0b3IuY29scztcbiAgICAgICAgYXBpU2VsZWN0b3Iub3B0cyA9IHNlbGVjdG9yLm9wdHM7XG4gICAgICAgIHJldHVybiBhcGk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgbGFzdEluZGV4T2Y6IF9fYXJyYXlQcm90by5sYXN0SW5kZXhPZiB8fCBmdW5jdGlvbiAob2JqLCBzdGFydCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZi5hcHBseSh0aGlzLnRvQXJyYXkucmV2ZXJzZSgpLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgbGVuZ3RoOiAwLFxuICAgIG1hcDogZnVuY3Rpb24gbWFwKGZuKSB7XG4gICAgICB2YXIgYSA9IFtdO1xuXG4gICAgICBpZiAoX19hcnJheVByb3RvLm1hcCkge1xuICAgICAgICBhID0gX19hcnJheVByb3RvLm1hcC5jYWxsKHRoaXMsIGZuLCB0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgYS5wdXNoKGZuLmNhbGwodGhpcywgdGhpc1tpXSwgaSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgX0FwaTIodGhpcy5jb250ZXh0LCBhKTtcbiAgICB9LFxuICAgIHBsdWNrOiBmdW5jdGlvbiBwbHVjayhwcm9wKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBlbFtwcm9wXTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgcG9wOiBfX2FycmF5UHJvdG8ucG9wLFxuICAgIHB1c2g6IF9fYXJyYXlQcm90by5wdXNoLFxuICAgIHJlZHVjZTogX19hcnJheVByb3RvLnJlZHVjZSB8fCBmdW5jdGlvbiAoZm4sIGluaXQpIHtcbiAgICAgIHJldHVybiBfZm5SZWR1Y2UodGhpcywgZm4sIGluaXQsIDAsIHRoaXMubGVuZ3RoLCAxKTtcbiAgICB9LFxuICAgIHJlZHVjZVJpZ2h0OiBfX2FycmF5UHJvdG8ucmVkdWNlUmlnaHQgfHwgZnVuY3Rpb24gKGZuLCBpbml0KSB7XG4gICAgICByZXR1cm4gX2ZuUmVkdWNlKHRoaXMsIGZuLCBpbml0LCB0aGlzLmxlbmd0aCAtIDEsIC0xLCAtMSk7XG4gICAgfSxcbiAgICByZXZlcnNlOiBfX2FycmF5UHJvdG8ucmV2ZXJzZSxcbiAgICBzZWxlY3RvcjogbnVsbCxcbiAgICBzaGlmdDogX19hcnJheVByb3RvLnNoaWZ0LFxuICAgIHNsaWNlOiBmdW5jdGlvbiBzbGljZSgpIHtcbiAgICAgIHJldHVybiBuZXcgX0FwaTIodGhpcy5jb250ZXh0LCB0aGlzKTtcbiAgICB9LFxuICAgIHNvcnQ6IF9fYXJyYXlQcm90by5zb3J0LFxuICAgIHNwbGljZTogX19hcnJheVByb3RvLnNwbGljZSxcbiAgICB0b0FycmF5OiBmdW5jdGlvbiB0b0FycmF5KCkge1xuICAgICAgcmV0dXJuIF9fYXJyYXlQcm90by5zbGljZS5jYWxsKHRoaXMpO1xuICAgIH0sXG4gICAgdG8kOiBmdW5jdGlvbiB0byQoKSB7XG4gICAgICByZXR1cm4gJCh0aGlzKTtcbiAgICB9LFxuICAgIHRvSlF1ZXJ5OiBmdW5jdGlvbiB0b0pRdWVyeSgpIHtcbiAgICAgIHJldHVybiAkKHRoaXMpO1xuICAgIH0sXG4gICAgdW5pcXVlOiBmdW5jdGlvbiB1bmlxdWUoKSB7XG4gICAgICByZXR1cm4gbmV3IF9BcGkyKHRoaXMuY29udGV4dCwgX3VuaXF1ZSh0aGlzKSk7XG4gICAgfSxcbiAgICB1bnNoaWZ0OiBfX2FycmF5UHJvdG8udW5zaGlmdFxuICB9KTtcblxuICBfQXBpMi5leHRlbmQgPSBmdW5jdGlvbiAoc2NvcGUsIG9iaiwgZXh0KSB7XG4gICAgaWYgKCFleHQubGVuZ3RoIHx8ICFvYmogfHwgIShvYmogaW5zdGFuY2VvZiBfQXBpMikgJiYgIW9iai5fX2R0X3dyYXBwZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaSxcbiAgICAgICAgaWVuLFxuICAgICAgICBqLFxuICAgICAgICBqZW4sXG4gICAgICAgIHN0cnVjdCxcbiAgICAgICAgaW5uZXIsXG4gICAgICAgIG1ldGhvZFNjb3BpbmcgPSBmdW5jdGlvbiBtZXRob2RTY29waW5nKHNjb3BlLCBmbiwgc3RydWMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZXQgPSBmbi5hcHBseShzY29wZSwgYXJndW1lbnRzKTtcblxuICAgICAgICBfQXBpMi5leHRlbmQocmV0LCByZXQsIHN0cnVjLm1ldGhvZEV4dCk7XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGZvciAoaSA9IDAsIGllbiA9IGV4dC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgc3RydWN0ID0gZXh0W2ldO1xuICAgICAgb2JqW3N0cnVjdC5uYW1lXSA9IHR5cGVvZiBzdHJ1Y3QudmFsID09PSAnZnVuY3Rpb24nID8gbWV0aG9kU2NvcGluZyhzY29wZSwgc3RydWN0LnZhbCwgc3RydWN0KSA6ICQuaXNQbGFpbk9iamVjdChzdHJ1Y3QudmFsKSA/IHt9IDogc3RydWN0LnZhbDtcbiAgICAgIG9ialtzdHJ1Y3QubmFtZV0uX19kdF93cmFwcGVyID0gdHJ1ZTtcblxuICAgICAgX0FwaTIuZXh0ZW5kKHNjb3BlLCBvYmpbc3RydWN0Lm5hbWVdLCBzdHJ1Y3QucHJvcEV4dCk7XG4gICAgfVxuICB9O1xuXG4gIF9BcGkyLnJlZ2lzdGVyID0gX2FwaV9yZWdpc3RlciA9IGZ1bmN0aW9uIF9hcGlfcmVnaXN0ZXIobmFtZSwgdmFsKSB7XG4gICAgaWYgKCQuaXNBcnJheShuYW1lKSkge1xuICAgICAgZm9yICh2YXIgaiA9IDAsIGplbiA9IG5hbWUubGVuZ3RoOyBqIDwgamVuOyBqKyspIHtcbiAgICAgICAgX0FwaTIucmVnaXN0ZXIobmFtZVtqXSwgdmFsKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBpLFxuICAgICAgICBpZW4sXG4gICAgICAgIGhlaXIgPSBuYW1lLnNwbGl0KCcuJyksXG4gICAgICAgIHN0cnVjdCA9IF9fYXBpU3RydWN0LFxuICAgICAgICBrZXksXG4gICAgICAgIG1ldGhvZDtcblxuICAgIHZhciBmaW5kID0gZnVuY3Rpb24gZmluZChzcmMsIG5hbWUpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBzcmMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgaWYgKHNyY1tpXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHNyY1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgZm9yIChpID0gMCwgaWVuID0gaGVpci5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgbWV0aG9kID0gaGVpcltpXS5pbmRleE9mKCcoKScpICE9PSAtMTtcbiAgICAgIGtleSA9IG1ldGhvZCA/IGhlaXJbaV0ucmVwbGFjZSgnKCknLCAnJykgOiBoZWlyW2ldO1xuICAgICAgdmFyIHNyYyA9IGZpbmQoc3RydWN0LCBrZXkpO1xuXG4gICAgICBpZiAoIXNyYykge1xuICAgICAgICBzcmMgPSB7XG4gICAgICAgICAgbmFtZToga2V5LFxuICAgICAgICAgIHZhbDoge30sXG4gICAgICAgICAgbWV0aG9kRXh0OiBbXSxcbiAgICAgICAgICBwcm9wRXh0OiBbXVxuICAgICAgICB9O1xuICAgICAgICBzdHJ1Y3QucHVzaChzcmMpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaSA9PT0gaWVuIC0gMSkge1xuICAgICAgICBzcmMudmFsID0gdmFsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RydWN0ID0gbWV0aG9kID8gc3JjLm1ldGhvZEV4dCA6IHNyYy5wcm9wRXh0O1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBfQXBpMi5yZWdpc3RlclBsdXJhbCA9IF9hcGlfcmVnaXN0ZXJQbHVyYWwgPSBmdW5jdGlvbiBfYXBpX3JlZ2lzdGVyUGx1cmFsKHBsdXJhbE5hbWUsIHNpbmd1bGFyTmFtZSwgdmFsKSB7XG4gICAgX0FwaTIucmVnaXN0ZXIocGx1cmFsTmFtZSwgdmFsKTtcblxuICAgIF9BcGkyLnJlZ2lzdGVyKHNpbmd1bGFyTmFtZSwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHJldCA9IHZhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICBpZiAocmV0ID09PSB0aGlzKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIGlmIChyZXQgaW5zdGFuY2VvZiBfQXBpMikge1xuICAgICAgICByZXR1cm4gcmV0Lmxlbmd0aCA/ICQuaXNBcnJheShyZXRbMF0pID8gbmV3IF9BcGkyKHJldC5jb250ZXh0LCByZXRbMF0pIDogcmV0WzBdIDogdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0pO1xuICB9O1xuXG4gIHZhciBfX3RhYmxlX3NlbGVjdG9yID0gZnVuY3Rpb24gX190YWJsZV9zZWxlY3RvcihzZWxlY3RvciwgYSkge1xuICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gW2Fbc2VsZWN0b3JdXTtcbiAgICB9XG5cbiAgICB2YXIgbm9kZXMgPSAkLm1hcChhLCBmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgIHJldHVybiBlbC5uVGFibGU7XG4gICAgfSk7XG4gICAgcmV0dXJuICQobm9kZXMpLmZpbHRlcihzZWxlY3RvcikubWFwKGZ1bmN0aW9uIChpKSB7XG4gICAgICB2YXIgaWR4ID0gJC5pbkFycmF5KHRoaXMsIG5vZGVzKTtcbiAgICAgIHJldHVybiBhW2lkeF07XG4gICAgfSkudG9BcnJheSgpO1xuICB9O1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3RhYmxlcygpJywgZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHNlbGVjdG9yID8gbmV3IF9BcGkyKF9fdGFibGVfc2VsZWN0b3Ioc2VsZWN0b3IsIHRoaXMuY29udGV4dCkpIDogdGhpcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcigndGFibGUoKScsIGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgIHZhciB0YWJsZXMgPSB0aGlzLnRhYmxlcyhzZWxlY3Rvcik7XG4gICAgdmFyIGN0eCA9IHRhYmxlcy5jb250ZXh0O1xuICAgIHJldHVybiBjdHgubGVuZ3RoID8gbmV3IF9BcGkyKGN0eFswXSkgOiB0YWJsZXM7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ3RhYmxlcygpLm5vZGVzKCknLCAndGFibGUoKS5ub2RlKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgcmV0dXJuIGN0eC5uVGFibGU7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ3RhYmxlcygpLmJvZHkoKScsICd0YWJsZSgpLmJvZHkoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICByZXR1cm4gY3R4Lm5UQm9keTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgndGFibGVzKCkuaGVhZGVyKCknLCAndGFibGUoKS5oZWFkZXIoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICByZXR1cm4gY3R4Lm5USGVhZDtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgndGFibGVzKCkuZm9vdGVyKCknLCAndGFibGUoKS5mb290ZXIoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICByZXR1cm4gY3R4Lm5URm9vdDtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgndGFibGVzKCkuY29udGFpbmVycygpJywgJ3RhYmxlKCkuY29udGFpbmVyKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgcmV0dXJuIGN0eC5uVGFibGVXcmFwcGVyO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdkcmF3KCknLCBmdW5jdGlvbiAocGFnaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBpZiAocGFnaW5nID09PSAncGFnZScpIHtcbiAgICAgICAgX2ZuRHJhdyhzZXR0aW5ncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHBhZ2luZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBwYWdpbmcgPSBwYWdpbmcgPT09ICdmdWxsLWhvbGQnID8gZmFsc2UgOiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgX2ZuUmVEcmF3KHNldHRpbmdzLCBwYWdpbmcgPT09IGZhbHNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcigncGFnZSgpJywgZnVuY3Rpb24gKGFjdGlvbikge1xuICAgIGlmIChhY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFnZS5pbmZvKCkucGFnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIF9mblBhZ2VDaGFuZ2Uoc2V0dGluZ3MsIGFjdGlvbik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3BhZ2UuaW5mbygpJywgZnVuY3Rpb24gKGFjdGlvbikge1xuICAgIGlmICh0aGlzLmNvbnRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZhciBzZXR0aW5ncyA9IHRoaXMuY29udGV4dFswXSxcbiAgICAgICAgc3RhcnQgPSBzZXR0aW5ncy5faURpc3BsYXlTdGFydCxcbiAgICAgICAgbGVuID0gc2V0dGluZ3Mub0ZlYXR1cmVzLmJQYWdpbmF0ZSA/IHNldHRpbmdzLl9pRGlzcGxheUxlbmd0aCA6IC0xLFxuICAgICAgICB2aXNSZWNvcmRzID0gc2V0dGluZ3MuZm5SZWNvcmRzRGlzcGxheSgpLFxuICAgICAgICBhbGwgPSBsZW4gPT09IC0xO1xuICAgIHJldHVybiB7XG4gICAgICBcInBhZ2VcIjogYWxsID8gMCA6IE1hdGguZmxvb3Ioc3RhcnQgLyBsZW4pLFxuICAgICAgXCJwYWdlc1wiOiBhbGwgPyAxIDogTWF0aC5jZWlsKHZpc1JlY29yZHMgLyBsZW4pLFxuICAgICAgXCJzdGFydFwiOiBzdGFydCxcbiAgICAgIFwiZW5kXCI6IHNldHRpbmdzLmZuRGlzcGxheUVuZCgpLFxuICAgICAgXCJsZW5ndGhcIjogbGVuLFxuICAgICAgXCJyZWNvcmRzVG90YWxcIjogc2V0dGluZ3MuZm5SZWNvcmRzVG90YWwoKSxcbiAgICAgIFwicmVjb3Jkc0Rpc3BsYXlcIjogdmlzUmVjb3JkcyxcbiAgICAgIFwic2VydmVyU2lkZVwiOiBfZm5EYXRhU291cmNlKHNldHRpbmdzKSA9PT0gJ3NzcCdcbiAgICB9O1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdwYWdlLmxlbigpJywgZnVuY3Rpb24gKGxlbikge1xuICAgIGlmIChsZW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5sZW5ndGggIT09IDAgPyB0aGlzLmNvbnRleHRbMF0uX2lEaXNwbGF5TGVuZ3RoIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgX2ZuTGVuZ3RoQ2hhbmdlKHNldHRpbmdzLCBsZW4pO1xuICAgIH0pO1xuICB9KTtcblxuICB2YXIgX19yZWxvYWQgPSBmdW5jdGlvbiBfX3JlbG9hZChzZXR0aW5ncywgaG9sZFBvc2l0aW9uLCBjYWxsYmFjaykge1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdmFyIGFwaSA9IG5ldyBfQXBpMihzZXR0aW5ncyk7XG4gICAgICBhcGkub25lKCdkcmF3JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYWxsYmFjayhhcGkuYWpheC5qc29uKCkpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKF9mbkRhdGFTb3VyY2Uoc2V0dGluZ3MpID09ICdzc3AnKSB7XG4gICAgICBfZm5SZURyYXcoc2V0dGluZ3MsIGhvbGRQb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KHNldHRpbmdzLCB0cnVlKTtcblxuICAgICAgdmFyIHhociA9IHNldHRpbmdzLmpxWEhSO1xuXG4gICAgICBpZiAoeGhyICYmIHhoci5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgfVxuXG4gICAgICBfZm5CdWlsZEFqYXgoc2V0dGluZ3MsIFtdLCBmdW5jdGlvbiAoanNvbikge1xuICAgICAgICBfZm5DbGVhclRhYmxlKHNldHRpbmdzKTtcblxuICAgICAgICB2YXIgZGF0YSA9IF9mbkFqYXhEYXRhU3JjKHNldHRpbmdzLCBqc29uKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gZGF0YS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgIF9mbkFkZERhdGEoc2V0dGluZ3MsIGRhdGFbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2ZuUmVEcmF3KHNldHRpbmdzLCBob2xkUG9zaXRpb24pO1xuXG4gICAgICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KHNldHRpbmdzLCBmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgX2FwaV9yZWdpc3RlcignYWpheC5qc29uKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcblxuICAgIGlmIChjdHgubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGN0eFswXS5qc29uO1xuICAgIH1cbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignYWpheC5wYXJhbXMoKScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKGN0eC5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gY3R4WzBdLm9BamF4RGF0YTtcbiAgICB9XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2FqYXgucmVsb2FkKCknLCBmdW5jdGlvbiAoY2FsbGJhY2ssIHJlc2V0UGFnaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBfX3JlbG9hZChzZXR0aW5ncywgcmVzZXRQYWdpbmcgPT09IGZhbHNlLCBjYWxsYmFjayk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2FqYXgudXJsKCknLCBmdW5jdGlvbiAodXJsKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcblxuICAgIGlmICh1cmwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGN0eC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgY3R4ID0gY3R4WzBdO1xuICAgICAgcmV0dXJuIGN0eC5hamF4ID8gJC5pc1BsYWluT2JqZWN0KGN0eC5hamF4KSA/IGN0eC5hamF4LnVybCA6IGN0eC5hamF4IDogY3R4LnNBamF4U291cmNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdChzZXR0aW5ncy5hamF4KSkge1xuICAgICAgICBzZXR0aW5ncy5hamF4LnVybCA9IHVybDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldHRpbmdzLmFqYXggPSB1cmw7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2FqYXgudXJsKCkubG9hZCgpJywgZnVuY3Rpb24gKGNhbGxiYWNrLCByZXNldFBhZ2luZykge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIF9fcmVsb2FkKGN0eCwgcmVzZXRQYWdpbmcgPT09IGZhbHNlLCBjYWxsYmFjayk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHZhciBfc2VsZWN0b3JfcnVuID0gZnVuY3Rpb24gX3NlbGVjdG9yX3J1bih0eXBlLCBzZWxlY3Rvciwgc2VsZWN0Rm4sIHNldHRpbmdzLCBvcHRzKSB7XG4gICAgdmFyIG91dCA9IFtdLFxuICAgICAgICByZXMsXG4gICAgICAgIGEsXG4gICAgICAgIGksXG4gICAgICAgIGllbixcbiAgICAgICAgaixcbiAgICAgICAgamVuLFxuICAgICAgICBzZWxlY3RvclR5cGUgPSBfdHlwZW9mKHNlbGVjdG9yKTtcblxuICAgIGlmICghc2VsZWN0b3IgfHwgc2VsZWN0b3JUeXBlID09PSAnc3RyaW5nJyB8fCBzZWxlY3RvclR5cGUgPT09ICdmdW5jdGlvbicgfHwgc2VsZWN0b3IubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHNlbGVjdG9yID0gW3NlbGVjdG9yXTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBpZW4gPSBzZWxlY3Rvci5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgYSA9IHNlbGVjdG9yW2ldICYmIHNlbGVjdG9yW2ldLnNwbGl0ICYmICFzZWxlY3RvcltpXS5tYXRjaCgvW1xcW1xcKDpdLykgPyBzZWxlY3RvcltpXS5zcGxpdCgnLCcpIDogW3NlbGVjdG9yW2ldXTtcblxuICAgICAgZm9yIChqID0gMCwgamVuID0gYS5sZW5ndGg7IGogPCBqZW47IGorKykge1xuICAgICAgICByZXMgPSBzZWxlY3RGbih0eXBlb2YgYVtqXSA9PT0gJ3N0cmluZycgPyAkLnRyaW0oYVtqXSkgOiBhW2pdKTtcblxuICAgICAgICBpZiAocmVzICYmIHJlcy5sZW5ndGgpIHtcbiAgICAgICAgICBvdXQgPSBvdXQuY29uY2F0KHJlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZXh0ID0gX2V4dC5zZWxlY3Rvclt0eXBlXTtcblxuICAgIGlmIChleHQubGVuZ3RoKSB7XG4gICAgICBmb3IgKGkgPSAwLCBpZW4gPSBleHQubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgb3V0ID0gZXh0W2ldKHNldHRpbmdzLCBvcHRzLCBvdXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBfdW5pcXVlKG91dCk7XG4gIH07XG5cbiAgdmFyIF9zZWxlY3Rvcl9vcHRzID0gZnVuY3Rpb24gX3NlbGVjdG9yX29wdHMob3B0cykge1xuICAgIGlmICghb3B0cykge1xuICAgICAgb3B0cyA9IHt9O1xuICAgIH1cblxuICAgIGlmIChvcHRzLmZpbHRlciAmJiBvcHRzLnNlYXJjaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRzLnNlYXJjaCA9IG9wdHMuZmlsdGVyO1xuICAgIH1cblxuICAgIHJldHVybiAkLmV4dGVuZCh7XG4gICAgICBzZWFyY2g6ICdub25lJyxcbiAgICAgIG9yZGVyOiAnY3VycmVudCcsXG4gICAgICBwYWdlOiAnYWxsJ1xuICAgIH0sIG9wdHMpO1xuICB9O1xuXG4gIHZhciBfc2VsZWN0b3JfZmlyc3QgPSBmdW5jdGlvbiBfc2VsZWN0b3JfZmlyc3QoaW5zdCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBpbnN0Lmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBpZiAoaW5zdFtpXS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGluc3RbMF0gPSBpbnN0W2ldO1xuICAgICAgICBpbnN0WzBdLmxlbmd0aCA9IDE7XG4gICAgICAgIGluc3QubGVuZ3RoID0gMTtcbiAgICAgICAgaW5zdC5jb250ZXh0ID0gW2luc3QuY29udGV4dFtpXV07XG4gICAgICAgIHJldHVybiBpbnN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGluc3QubGVuZ3RoID0gMDtcbiAgICByZXR1cm4gaW5zdDtcbiAgfTtcblxuICB2YXIgX3NlbGVjdG9yX3Jvd19pbmRleGVzID0gZnVuY3Rpb24gX3NlbGVjdG9yX3Jvd19pbmRleGVzKHNldHRpbmdzLCBvcHRzKSB7XG4gICAgdmFyIGksXG4gICAgICAgIGllbixcbiAgICAgICAgdG1wLFxuICAgICAgICBhID0gW10sXG4gICAgICAgIGRpc3BsYXlGaWx0ZXJlZCA9IHNldHRpbmdzLmFpRGlzcGxheSxcbiAgICAgICAgZGlzcGxheU1hc3RlciA9IHNldHRpbmdzLmFpRGlzcGxheU1hc3RlcjtcbiAgICB2YXIgc2VhcmNoID0gb3B0cy5zZWFyY2gsXG4gICAgICAgIG9yZGVyID0gb3B0cy5vcmRlcixcbiAgICAgICAgcGFnZSA9IG9wdHMucGFnZTtcblxuICAgIGlmIChfZm5EYXRhU291cmNlKHNldHRpbmdzKSA9PSAnc3NwJykge1xuICAgICAgcmV0dXJuIHNlYXJjaCA9PT0gJ3JlbW92ZWQnID8gW10gOiBfcmFuZ2UoMCwgZGlzcGxheU1hc3Rlci5sZW5ndGgpO1xuICAgIH0gZWxzZSBpZiAocGFnZSA9PSAnY3VycmVudCcpIHtcbiAgICAgIGZvciAoaSA9IHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0LCBpZW4gPSBzZXR0aW5ncy5mbkRpc3BsYXlFbmQoKTsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGEucHVzaChkaXNwbGF5RmlsdGVyZWRbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3JkZXIgPT0gJ2N1cnJlbnQnIHx8IG9yZGVyID09ICdhcHBsaWVkJykge1xuICAgICAgaWYgKHNlYXJjaCA9PSAnbm9uZScpIHtcbiAgICAgICAgYSA9IGRpc3BsYXlNYXN0ZXIuc2xpY2UoKTtcbiAgICAgIH0gZWxzZSBpZiAoc2VhcmNoID09ICdhcHBsaWVkJykge1xuICAgICAgICBhID0gZGlzcGxheUZpbHRlcmVkLnNsaWNlKCk7XG4gICAgICB9IGVsc2UgaWYgKHNlYXJjaCA9PSAncmVtb3ZlZCcpIHtcbiAgICAgICAgdmFyIGRpc3BsYXlGaWx0ZXJlZE1hcCA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBkaXNwbGF5RmlsdGVyZWQubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICBkaXNwbGF5RmlsdGVyZWRNYXBbZGlzcGxheUZpbHRlcmVkW2ldXSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBhID0gJC5tYXAoZGlzcGxheU1hc3RlciwgZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgcmV0dXJuICFkaXNwbGF5RmlsdGVyZWRNYXAuaGFzT3duUHJvcGVydHkoZWwpID8gZWwgOiBudWxsO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yZGVyID09ICdpbmRleCcgfHwgb3JkZXIgPT0gJ29yaWdpbmFsJykge1xuICAgICAgZm9yIChpID0gMCwgaWVuID0gc2V0dGluZ3MuYW9EYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGlmIChzZWFyY2ggPT0gJ25vbmUnKSB7XG4gICAgICAgICAgYS5wdXNoKGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRtcCA9ICQuaW5BcnJheShpLCBkaXNwbGF5RmlsdGVyZWQpO1xuXG4gICAgICAgICAgaWYgKHRtcCA9PT0gLTEgJiYgc2VhcmNoID09ICdyZW1vdmVkJyB8fCB0bXAgPj0gMCAmJiBzZWFyY2ggPT0gJ2FwcGxpZWQnKSB7XG4gICAgICAgICAgICBhLnB1c2goaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGE7XG4gIH07XG5cbiAgdmFyIF9fcm93X3NlbGVjdG9yID0gZnVuY3Rpb24gX19yb3dfc2VsZWN0b3Ioc2V0dGluZ3MsIHNlbGVjdG9yLCBvcHRzKSB7XG4gICAgdmFyIHJvd3M7XG5cbiAgICB2YXIgcnVuID0gZnVuY3Rpb24gcnVuKHNlbCkge1xuICAgICAgdmFyIHNlbEludCA9IF9pbnRWYWwoc2VsKTtcblxuICAgICAgdmFyIGksIGllbjtcbiAgICAgIHZhciBhb0RhdGEgPSBzZXR0aW5ncy5hb0RhdGE7XG5cbiAgICAgIGlmIChzZWxJbnQgIT09IG51bGwgJiYgIW9wdHMpIHtcbiAgICAgICAgcmV0dXJuIFtzZWxJbnRdO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJvd3MpIHtcbiAgICAgICAgcm93cyA9IF9zZWxlY3Rvcl9yb3dfaW5kZXhlcyhzZXR0aW5ncywgb3B0cyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWxJbnQgIT09IG51bGwgJiYgJC5pbkFycmF5KHNlbEludCwgcm93cykgIT09IC0xKSB7XG4gICAgICAgIHJldHVybiBbc2VsSW50XTtcbiAgICAgIH0gZWxzZSBpZiAoc2VsID09PSBudWxsIHx8IHNlbCA9PT0gdW5kZWZpbmVkIHx8IHNlbCA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygc2VsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiAkLm1hcChyb3dzLCBmdW5jdGlvbiAoaWR4KSB7XG4gICAgICAgICAgdmFyIHJvdyA9IGFvRGF0YVtpZHhdO1xuICAgICAgICAgIHJldHVybiBzZWwoaWR4LCByb3cuX2FEYXRhLCByb3cublRyKSA/IGlkeCA6IG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsLm5vZGVOYW1lKSB7XG4gICAgICAgIHZhciByb3dJZHggPSBzZWwuX0RUX1Jvd0luZGV4O1xuICAgICAgICB2YXIgY2VsbElkeCA9IHNlbC5fRFRfQ2VsbEluZGV4O1xuXG4gICAgICAgIGlmIChyb3dJZHggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiBhb0RhdGFbcm93SWR4XSAmJiBhb0RhdGFbcm93SWR4XS5uVHIgPT09IHNlbCA/IFtyb3dJZHhdIDogW107XG4gICAgICAgIH0gZWxzZSBpZiAoY2VsbElkeCkge1xuICAgICAgICAgIHJldHVybiBhb0RhdGFbY2VsbElkeC5yb3ddICYmIGFvRGF0YVtjZWxsSWR4LnJvd10ublRyID09PSBzZWwgPyBbY2VsbElkeC5yb3ddIDogW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGhvc3QgPSAkKHNlbCkuY2xvc2VzdCgnKltkYXRhLWR0LXJvd10nKTtcbiAgICAgICAgICByZXR1cm4gaG9zdC5sZW5ndGggPyBbaG9zdC5kYXRhKCdkdC1yb3cnKV0gOiBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHNlbCA9PT0gJ3N0cmluZycgJiYgc2VsLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICAgIHZhciByb3dPYmogPSBzZXR0aW5ncy5hSWRzW3NlbC5yZXBsYWNlKC9eIy8sICcnKV07XG5cbiAgICAgICAgaWYgKHJvd09iaiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIFtyb3dPYmouaWR4XTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgbm9kZXMgPSBfcmVtb3ZlRW1wdHkoX3BsdWNrX29yZGVyKHNldHRpbmdzLmFvRGF0YSwgcm93cywgJ25UcicpKTtcblxuICAgICAgcmV0dXJuICQobm9kZXMpLmZpbHRlcihzZWwpLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9EVF9Sb3dJbmRleDtcbiAgICAgIH0pLnRvQXJyYXkoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF9zZWxlY3Rvcl9ydW4oJ3JvdycsIHNlbGVjdG9yLCBydW4sIHNldHRpbmdzLCBvcHRzKTtcbiAgfTtcblxuICBfYXBpX3JlZ2lzdGVyKCdyb3dzKCknLCBmdW5jdGlvbiAoc2VsZWN0b3IsIG9wdHMpIHtcbiAgICBpZiAoc2VsZWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc2VsZWN0b3IgPSAnJztcbiAgICB9IGVsc2UgaWYgKCQuaXNQbGFpbk9iamVjdChzZWxlY3RvcikpIHtcbiAgICAgIG9wdHMgPSBzZWxlY3RvcjtcbiAgICAgIHNlbGVjdG9yID0gJyc7XG4gICAgfVxuXG4gICAgb3B0cyA9IF9zZWxlY3Rvcl9vcHRzKG9wdHMpO1xuICAgIHZhciBpbnN0ID0gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIHJldHVybiBfX3Jvd19zZWxlY3RvcihzZXR0aW5ncywgc2VsZWN0b3IsIG9wdHMpO1xuICAgIH0sIDEpO1xuICAgIGluc3Quc2VsZWN0b3Iucm93cyA9IHNlbGVjdG9yO1xuICAgIGluc3Quc2VsZWN0b3Iub3B0cyA9IG9wdHM7XG4gICAgcmV0dXJuIGluc3Q7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3Jvd3MoKS5ub2RlcygpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdyb3cnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIHJvdykge1xuICAgICAgcmV0dXJuIHNldHRpbmdzLmFvRGF0YVtyb3ddLm5UciB8fCB1bmRlZmluZWQ7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3Jvd3MoKS5kYXRhKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IodHJ1ZSwgJ3Jvd3MnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIHJvd3MpIHtcbiAgICAgIHJldHVybiBfcGx1Y2tfb3JkZXIoc2V0dGluZ3MuYW9EYXRhLCByb3dzLCAnX2FEYXRhJyk7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ3Jvd3MoKS5jYWNoZSgpJywgJ3JvdygpLmNhY2hlKCknLCBmdW5jdGlvbiAodHlwZSkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdyb3cnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIHJvdykge1xuICAgICAgdmFyIHIgPSBzZXR0aW5ncy5hb0RhdGFbcm93XTtcbiAgICAgIHJldHVybiB0eXBlID09PSAnc2VhcmNoJyA/IHIuX2FGaWx0ZXJEYXRhIDogci5fYVNvcnREYXRhO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdyb3dzKCkuaW52YWxpZGF0ZSgpJywgJ3JvdygpLmludmFsaWRhdGUoKScsIGZ1bmN0aW9uIChzcmMpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigncm93JywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3cpIHtcbiAgICAgIF9mbkludmFsaWRhdGUoc2V0dGluZ3MsIHJvdywgc3JjKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgncm93cygpLmluZGV4ZXMoKScsICdyb3coKS5pbmRleCgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdyb3cnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIHJvdykge1xuICAgICAgcmV0dXJuIHJvdztcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgncm93cygpLmlkcygpJywgJ3JvdygpLmlkKCknLCBmdW5jdGlvbiAoaGFzaCkge1xuICAgIHZhciBhID0gW107XG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gY29udGV4dC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDAsIGplbiA9IHRoaXNbaV0ubGVuZ3RoOyBqIDwgamVuOyBqKyspIHtcbiAgICAgICAgdmFyIGlkID0gY29udGV4dFtpXS5yb3dJZEZuKGNvbnRleHRbaV0uYW9EYXRhW3RoaXNbaV1bal1dLl9hRGF0YSk7XG4gICAgICAgIGEucHVzaCgoaGFzaCA9PT0gdHJ1ZSA/ICcjJyA6ICcnKSArIGlkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IF9BcGkyKGNvbnRleHQsIGEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdyb3dzKCkucmVtb3ZlKCknLCAncm93KCkucmVtb3ZlKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuaXRlcmF0b3IoJ3JvdycsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93LCB0aGF0SWR4KSB7XG4gICAgICB2YXIgZGF0YSA9IHNldHRpbmdzLmFvRGF0YTtcbiAgICAgIHZhciByb3dEYXRhID0gZGF0YVtyb3ddO1xuICAgICAgdmFyIGksIGllbiwgaiwgamVuO1xuICAgICAgdmFyIGxvb3BSb3csIGxvb3BDZWxscztcbiAgICAgIGRhdGEuc3BsaWNlKHJvdywgMSk7XG5cbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IGRhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgbG9vcFJvdyA9IGRhdGFbaV07XG4gICAgICAgIGxvb3BDZWxscyA9IGxvb3BSb3cuYW5DZWxscztcblxuICAgICAgICBpZiAobG9vcFJvdy5uVHIgIT09IG51bGwpIHtcbiAgICAgICAgICBsb29wUm93Lm5Uci5fRFRfUm93SW5kZXggPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxvb3BDZWxscyAhPT0gbnVsbCkge1xuICAgICAgICAgIGZvciAoaiA9IDAsIGplbiA9IGxvb3BDZWxscy5sZW5ndGg7IGogPCBqZW47IGorKykge1xuICAgICAgICAgICAgbG9vcENlbGxzW2pdLl9EVF9DZWxsSW5kZXgucm93ID0gaTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2ZuRGVsZXRlSW5kZXgoc2V0dGluZ3MuYWlEaXNwbGF5TWFzdGVyLCByb3cpO1xuXG4gICAgICBfZm5EZWxldGVJbmRleChzZXR0aW5ncy5haURpc3BsYXksIHJvdyk7XG5cbiAgICAgIF9mbkRlbGV0ZUluZGV4KHRoYXRbdGhhdElkeF0sIHJvdywgZmFsc2UpO1xuXG4gICAgICBpZiAoc2V0dGluZ3MuX2lSZWNvcmRzRGlzcGxheSA+IDApIHtcbiAgICAgICAgc2V0dGluZ3MuX2lSZWNvcmRzRGlzcGxheS0tO1xuICAgICAgfVxuXG4gICAgICBfZm5MZW5ndGhPdmVyZmxvdyhzZXR0aW5ncyk7XG5cbiAgICAgIHZhciBpZCA9IHNldHRpbmdzLnJvd0lkRm4ocm93RGF0YS5fYURhdGEpO1xuXG4gICAgICBpZiAoaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBkZWxldGUgc2V0dGluZ3MuYUlkc1tpZF07XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBzZXR0aW5ncy5hb0RhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgc2V0dGluZ3MuYW9EYXRhW2ldLmlkeCA9IGk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3Jvd3MuYWRkKCknLCBmdW5jdGlvbiAocm93cykge1xuICAgIHZhciBuZXdSb3dzID0gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIHZhciByb3csIGksIGllbjtcbiAgICAgIHZhciBvdXQgPSBbXTtcblxuICAgICAgZm9yIChpID0gMCwgaWVuID0gcm93cy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICByb3cgPSByb3dzW2ldO1xuXG4gICAgICAgIGlmIChyb3cubm9kZU5hbWUgJiYgcm93Lm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdUUicpIHtcbiAgICAgICAgICBvdXQucHVzaChfZm5BZGRUcihzZXR0aW5ncywgcm93KVswXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0LnB1c2goX2ZuQWRkRGF0YShzZXR0aW5ncywgcm93KSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9LCAxKTtcbiAgICB2YXIgbW9kUm93cyA9IHRoaXMucm93cygtMSk7XG4gICAgbW9kUm93cy5wb3AoKTtcbiAgICAkLm1lcmdlKG1vZFJvd3MsIG5ld1Jvd3MpO1xuICAgIHJldHVybiBtb2RSb3dzO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdyb3coKScsIGZ1bmN0aW9uIChzZWxlY3Rvciwgb3B0cykge1xuICAgIHJldHVybiBfc2VsZWN0b3JfZmlyc3QodGhpcy5yb3dzKHNlbGVjdG9yLCBvcHRzKSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3JvdygpLmRhdGEoKScsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcblxuICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBjdHgubGVuZ3RoICYmIHRoaXMubGVuZ3RoID8gY3R4WzBdLmFvRGF0YVt0aGlzWzBdXS5fYURhdGEgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIHJvdyA9IGN0eFswXS5hb0RhdGFbdGhpc1swXV07XG4gICAgcm93Ll9hRGF0YSA9IGRhdGE7XG5cbiAgICBpZiAoJC5pc0FycmF5KGRhdGEpICYmIHJvdy5uVHIuaWQpIHtcbiAgICAgIF9mblNldE9iamVjdERhdGFGbihjdHhbMF0ucm93SWQpKGRhdGEsIHJvdy5uVHIuaWQpO1xuICAgIH1cblxuICAgIF9mbkludmFsaWRhdGUoY3R4WzBdLCB0aGlzWzBdLCAnZGF0YScpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3JvdygpLm5vZGUoKScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuICAgIHJldHVybiBjdHgubGVuZ3RoICYmIHRoaXMubGVuZ3RoID8gY3R4WzBdLmFvRGF0YVt0aGlzWzBdXS5uVHIgfHwgbnVsbCA6IG51bGw7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3Jvdy5hZGQoKScsIGZ1bmN0aW9uIChyb3cpIHtcbiAgICBpZiAocm93IGluc3RhbmNlb2YgJCAmJiByb3cubGVuZ3RoKSB7XG4gICAgICByb3cgPSByb3dbMF07XG4gICAgfVxuXG4gICAgdmFyIHJvd3MgPSB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgaWYgKHJvdy5ub2RlTmFtZSAmJiByb3cubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1RSJykge1xuICAgICAgICByZXR1cm4gX2ZuQWRkVHIoc2V0dGluZ3MsIHJvdylbMF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfZm5BZGREYXRhKHNldHRpbmdzLCByb3cpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLnJvdyhyb3dzWzBdKTtcbiAgfSk7XG5cbiAgdmFyIF9fZGV0YWlsc19hZGQgPSBmdW5jdGlvbiBfX2RldGFpbHNfYWRkKGN0eCwgcm93LCBkYXRhLCBrbGFzcykge1xuICAgIHZhciByb3dzID0gW107XG5cbiAgICB2YXIgYWRkUm93ID0gZnVuY3Rpb24gYWRkUm93KHIsIGspIHtcbiAgICAgIGlmICgkLmlzQXJyYXkocikgfHwgciBpbnN0YW5jZW9mICQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IHIubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICBhZGRSb3cocltpXSwgayk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChyLm5vZGVOYW1lICYmIHIubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RyJykge1xuICAgICAgICByb3dzLnB1c2gocik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgY3JlYXRlZCA9ICQoJzx0cj48dGQvPjwvdHI+JykuYWRkQ2xhc3Moayk7XG4gICAgICAgICQoJ3RkJywgY3JlYXRlZCkuYWRkQ2xhc3MoaykuaHRtbChyKVswXS5jb2xTcGFuID0gX2ZuVmlzYmxlQ29sdW1ucyhjdHgpO1xuICAgICAgICByb3dzLnB1c2goY3JlYXRlZFswXSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGFkZFJvdyhkYXRhLCBrbGFzcyk7XG5cbiAgICBpZiAocm93Ll9kZXRhaWxzKSB7XG4gICAgICByb3cuX2RldGFpbHMuZGV0YWNoKCk7XG4gICAgfVxuXG4gICAgcm93Ll9kZXRhaWxzID0gJChyb3dzKTtcblxuICAgIGlmIChyb3cuX2RldGFpbHNTaG93KSB7XG4gICAgICByb3cuX2RldGFpbHMuaW5zZXJ0QWZ0ZXIocm93Lm5Ucik7XG4gICAgfVxuICB9O1xuXG4gIHZhciBfX2RldGFpbHNfcmVtb3ZlID0gZnVuY3Rpb24gX19kZXRhaWxzX3JlbW92ZShhcGksIGlkeCkge1xuICAgIHZhciBjdHggPSBhcGkuY29udGV4dDtcblxuICAgIGlmIChjdHgubGVuZ3RoKSB7XG4gICAgICB2YXIgcm93ID0gY3R4WzBdLmFvRGF0YVtpZHggIT09IHVuZGVmaW5lZCA/IGlkeCA6IGFwaVswXV07XG5cbiAgICAgIGlmIChyb3cgJiYgcm93Ll9kZXRhaWxzKSB7XG4gICAgICAgIHJvdy5fZGV0YWlscy5yZW1vdmUoKTtcblxuICAgICAgICByb3cuX2RldGFpbHNTaG93ID0gdW5kZWZpbmVkO1xuICAgICAgICByb3cuX2RldGFpbHMgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHZhciBfX2RldGFpbHNfZGlzcGxheSA9IGZ1bmN0aW9uIF9fZGV0YWlsc19kaXNwbGF5KGFwaSwgc2hvdykge1xuICAgIHZhciBjdHggPSBhcGkuY29udGV4dDtcblxuICAgIGlmIChjdHgubGVuZ3RoICYmIGFwaS5sZW5ndGgpIHtcbiAgICAgIHZhciByb3cgPSBjdHhbMF0uYW9EYXRhW2FwaVswXV07XG5cbiAgICAgIGlmIChyb3cuX2RldGFpbHMpIHtcbiAgICAgICAgcm93Ll9kZXRhaWxzU2hvdyA9IHNob3c7XG5cbiAgICAgICAgaWYgKHNob3cpIHtcbiAgICAgICAgICByb3cuX2RldGFpbHMuaW5zZXJ0QWZ0ZXIocm93Lm5Ucik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcm93Ll9kZXRhaWxzLmRldGFjaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgX19kZXRhaWxzX2V2ZW50cyhjdHhbMF0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YXIgX19kZXRhaWxzX2V2ZW50cyA9IGZ1bmN0aW9uIF9fZGV0YWlsc19ldmVudHMoc2V0dGluZ3MpIHtcbiAgICB2YXIgYXBpID0gbmV3IF9BcGkyKHNldHRpbmdzKTtcbiAgICB2YXIgbmFtZXNwYWNlID0gJy5kdC5EVF9kZXRhaWxzJztcbiAgICB2YXIgZHJhd0V2ZW50ID0gJ2RyYXcnICsgbmFtZXNwYWNlO1xuICAgIHZhciBjb2x2aXNFdmVudCA9ICdjb2x1bW4tdmlzaWJpbGl0eScgKyBuYW1lc3BhY2U7XG4gICAgdmFyIGRlc3Ryb3lFdmVudCA9ICdkZXN0cm95JyArIG5hbWVzcGFjZTtcbiAgICB2YXIgZGF0YSA9IHNldHRpbmdzLmFvRGF0YTtcbiAgICBhcGkub2ZmKGRyYXdFdmVudCArICcgJyArIGNvbHZpc0V2ZW50ICsgJyAnICsgZGVzdHJveUV2ZW50KTtcblxuICAgIGlmIChfcGx1Y2soZGF0YSwgJ19kZXRhaWxzJykubGVuZ3RoID4gMCkge1xuICAgICAgYXBpLm9uKGRyYXdFdmVudCwgZnVuY3Rpb24gKGUsIGN0eCkge1xuICAgICAgICBpZiAoc2V0dGluZ3MgIT09IGN0eCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwaS5yb3dzKHtcbiAgICAgICAgICBwYWdlOiAnY3VycmVudCdcbiAgICAgICAgfSkuZXEoMCkuZWFjaChmdW5jdGlvbiAoaWR4KSB7XG4gICAgICAgICAgdmFyIHJvdyA9IGRhdGFbaWR4XTtcblxuICAgICAgICAgIGlmIChyb3cuX2RldGFpbHNTaG93KSB7XG4gICAgICAgICAgICByb3cuX2RldGFpbHMuaW5zZXJ0QWZ0ZXIocm93Lm5Ucik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgYXBpLm9uKGNvbHZpc0V2ZW50LCBmdW5jdGlvbiAoZSwgY3R4LCBpZHgsIHZpcykge1xuICAgICAgICBpZiAoc2V0dGluZ3MgIT09IGN0eCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByb3csXG4gICAgICAgICAgICB2aXNpYmxlID0gX2ZuVmlzYmxlQ29sdW1ucyhjdHgpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgcm93ID0gZGF0YVtpXTtcblxuICAgICAgICAgIGlmIChyb3cuX2RldGFpbHMpIHtcbiAgICAgICAgICAgIHJvdy5fZGV0YWlscy5jaGlsZHJlbigndGRbY29sc3Bhbl0nKS5hdHRyKCdjb2xzcGFuJywgdmlzaWJsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFwaS5vbihkZXN0cm95RXZlbnQsIGZ1bmN0aW9uIChlLCBjdHgpIHtcbiAgICAgICAgaWYgKHNldHRpbmdzICE9PSBjdHgpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gZGF0YS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgIGlmIChkYXRhW2ldLl9kZXRhaWxzKSB7XG4gICAgICAgICAgICBfX2RldGFpbHNfcmVtb3ZlKGFwaSwgaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9lbXAgPSAnJztcblxuICB2YXIgX2NoaWxkX29iaiA9IF9lbXAgKyAncm93KCkuY2hpbGQnO1xuXG4gIHZhciBfY2hpbGRfbXRoID0gX2NoaWxkX29iaiArICcoKSc7XG5cbiAgX2FwaV9yZWdpc3RlcihfY2hpbGRfbXRoLCBmdW5jdGlvbiAoZGF0YSwga2xhc3MpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGN0eC5sZW5ndGggJiYgdGhpcy5sZW5ndGggPyBjdHhbMF0uYW9EYXRhW3RoaXNbMF1dLl9kZXRhaWxzIDogdW5kZWZpbmVkO1xuICAgIH0gZWxzZSBpZiAoZGF0YSA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5jaGlsZC5zaG93KCk7XG4gICAgfSBlbHNlIGlmIChkYXRhID09PSBmYWxzZSkge1xuICAgICAgX19kZXRhaWxzX3JlbW92ZSh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKGN0eC5sZW5ndGggJiYgdGhpcy5sZW5ndGgpIHtcbiAgICAgIF9fZGV0YWlsc19hZGQoY3R4WzBdLCBjdHhbMF0uYW9EYXRhW3RoaXNbMF1dLCBkYXRhLCBrbGFzcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoW19jaGlsZF9vYmogKyAnLnNob3coKScsIF9jaGlsZF9tdGggKyAnLnNob3coKSddLCBmdW5jdGlvbiAoc2hvdykge1xuICAgIF9fZGV0YWlsc19kaXNwbGF5KHRoaXMsIHRydWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoW19jaGlsZF9vYmogKyAnLmhpZGUoKScsIF9jaGlsZF9tdGggKyAnLmhpZGUoKSddLCBmdW5jdGlvbiAoKSB7XG4gICAgX19kZXRhaWxzX2Rpc3BsYXkodGhpcywgZmFsc2UpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoW19jaGlsZF9vYmogKyAnLnJlbW92ZSgpJywgX2NoaWxkX210aCArICcucmVtb3ZlKCknXSwgZnVuY3Rpb24gKCkge1xuICAgIF9fZGV0YWlsc19yZW1vdmUodGhpcyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcihfY2hpbGRfb2JqICsgJy5pc1Nob3duKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcblxuICAgIGlmIChjdHgubGVuZ3RoICYmIHRoaXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gY3R4WzBdLmFvRGF0YVt0aGlzWzBdXS5fZGV0YWlsc1Nob3cgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICB2YXIgX19yZV9jb2x1bW5fc2VsZWN0b3IgPSAvXihbXjpdKyk6KG5hbWV8dmlzSWR4fHZpc2libGUpJC87XG5cbiAgdmFyIF9fY29sdW1uRGF0YSA9IGZ1bmN0aW9uIF9fY29sdW1uRGF0YShzZXR0aW5ncywgY29sdW1uLCByMSwgcjIsIHJvd3MpIHtcbiAgICB2YXIgYSA9IFtdO1xuXG4gICAgZm9yICh2YXIgcm93ID0gMCwgaWVuID0gcm93cy5sZW5ndGg7IHJvdyA8IGllbjsgcm93KyspIHtcbiAgICAgIGEucHVzaChfZm5HZXRDZWxsRGF0YShzZXR0aW5ncywgcm93c1tyb3ddLCBjb2x1bW4pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYTtcbiAgfTtcblxuICB2YXIgX19jb2x1bW5fc2VsZWN0b3IgPSBmdW5jdGlvbiBfX2NvbHVtbl9zZWxlY3RvcihzZXR0aW5ncywgc2VsZWN0b3IsIG9wdHMpIHtcbiAgICB2YXIgY29sdW1ucyA9IHNldHRpbmdzLmFvQ29sdW1ucyxcbiAgICAgICAgbmFtZXMgPSBfcGx1Y2soY29sdW1ucywgJ3NOYW1lJyksXG4gICAgICAgIG5vZGVzID0gX3BsdWNrKGNvbHVtbnMsICduVGgnKTtcblxuICAgIHZhciBydW4gPSBmdW5jdGlvbiBydW4ocykge1xuICAgICAgdmFyIHNlbEludCA9IF9pbnRWYWwocyk7XG5cbiAgICAgIGlmIChzID09PSAnJykge1xuICAgICAgICByZXR1cm4gX3JhbmdlKGNvbHVtbnMubGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbEludCAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gW3NlbEludCA+PSAwID8gc2VsSW50IDogY29sdW1ucy5sZW5ndGggKyBzZWxJbnRdO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIHJvd3MgPSBfc2VsZWN0b3Jfcm93X2luZGV4ZXMoc2V0dGluZ3MsIG9wdHMpO1xuXG4gICAgICAgIHJldHVybiAkLm1hcChjb2x1bW5zLCBmdW5jdGlvbiAoY29sLCBpZHgpIHtcbiAgICAgICAgICByZXR1cm4gcyhpZHgsIF9fY29sdW1uRGF0YShzZXR0aW5ncywgaWR4LCAwLCAwLCByb3dzKSwgbm9kZXNbaWR4XSkgPyBpZHggOiBudWxsO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdmFyIG1hdGNoID0gdHlwZW9mIHMgPT09ICdzdHJpbmcnID8gcy5tYXRjaChfX3JlX2NvbHVtbl9zZWxlY3RvcikgOiAnJztcblxuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHN3aXRjaCAobWF0Y2hbMl0pIHtcbiAgICAgICAgICBjYXNlICd2aXNJZHgnOlxuICAgICAgICAgIGNhc2UgJ3Zpc2libGUnOlxuICAgICAgICAgICAgdmFyIGlkeCA9IHBhcnNlSW50KG1hdGNoWzFdLCAxMCk7XG5cbiAgICAgICAgICAgIGlmIChpZHggPCAwKSB7XG4gICAgICAgICAgICAgIHZhciB2aXNDb2x1bW5zID0gJC5tYXAoY29sdW1ucywgZnVuY3Rpb24gKGNvbCwgaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2wuYlZpc2libGUgPyBpIDogbnVsbDtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiBbdmlzQ29sdW1uc1t2aXNDb2x1bW5zLmxlbmd0aCArIGlkeF1dO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW19mblZpc2libGVUb0NvbHVtbkluZGV4KHNldHRpbmdzLCBpZHgpXTtcblxuICAgICAgICAgIGNhc2UgJ25hbWUnOlxuICAgICAgICAgICAgcmV0dXJuICQubWFwKG5hbWVzLCBmdW5jdGlvbiAobmFtZSwgaSkge1xuICAgICAgICAgICAgICByZXR1cm4gbmFtZSA9PT0gbWF0Y2hbMV0gPyBpIDogbnVsbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocy5ub2RlTmFtZSAmJiBzLl9EVF9DZWxsSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIFtzLl9EVF9DZWxsSW5kZXguY29sdW1uXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGpxUmVzdWx0ID0gJChub2RlcykuZmlsdGVyKHMpLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkLmluQXJyYXkodGhpcywgbm9kZXMpO1xuICAgICAgfSkudG9BcnJheSgpO1xuXG4gICAgICBpZiAoanFSZXN1bHQubGVuZ3RoIHx8ICFzLm5vZGVOYW1lKSB7XG4gICAgICAgIHJldHVybiBqcVJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgdmFyIGhvc3QgPSAkKHMpLmNsb3Nlc3QoJypbZGF0YS1kdC1jb2x1bW5dJyk7XG4gICAgICByZXR1cm4gaG9zdC5sZW5ndGggPyBbaG9zdC5kYXRhKCdkdC1jb2x1bW4nKV0gOiBbXTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF9zZWxlY3Rvcl9ydW4oJ2NvbHVtbicsIHNlbGVjdG9yLCBydW4sIHNldHRpbmdzLCBvcHRzKTtcbiAgfTtcblxuICB2YXIgX19zZXRDb2x1bW5WaXMgPSBmdW5jdGlvbiBfX3NldENvbHVtblZpcyhzZXR0aW5ncywgY29sdW1uLCB2aXMpIHtcbiAgICB2YXIgY29scyA9IHNldHRpbmdzLmFvQ29sdW1ucyxcbiAgICAgICAgY29sID0gY29sc1tjb2x1bW5dLFxuICAgICAgICBkYXRhID0gc2V0dGluZ3MuYW9EYXRhLFxuICAgICAgICByb3csXG4gICAgICAgIGNlbGxzLFxuICAgICAgICBpLFxuICAgICAgICBpZW4sXG4gICAgICAgIHRyO1xuXG4gICAgaWYgKHZpcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gY29sLmJWaXNpYmxlO1xuICAgIH1cblxuICAgIGlmIChjb2wuYlZpc2libGUgPT09IHZpcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh2aXMpIHtcbiAgICAgIHZhciBpbnNlcnRCZWZvcmUgPSAkLmluQXJyYXkodHJ1ZSwgX3BsdWNrKGNvbHMsICdiVmlzaWJsZScpLCBjb2x1bW4gKyAxKTtcblxuICAgICAgZm9yIChpID0gMCwgaWVuID0gZGF0YS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICB0ciA9IGRhdGFbaV0ublRyO1xuICAgICAgICBjZWxscyA9IGRhdGFbaV0uYW5DZWxscztcblxuICAgICAgICBpZiAodHIpIHtcbiAgICAgICAgICB0ci5pbnNlcnRCZWZvcmUoY2VsbHNbY29sdW1uXSwgY2VsbHNbaW5zZXJ0QmVmb3JlXSB8fCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAkKF9wbHVjayhzZXR0aW5ncy5hb0RhdGEsICdhbkNlbGxzJywgY29sdW1uKSkuZGV0YWNoKCk7XG4gICAgfVxuXG4gICAgY29sLmJWaXNpYmxlID0gdmlzO1xuXG4gICAgX2ZuRHJhd0hlYWQoc2V0dGluZ3MsIHNldHRpbmdzLmFvSGVhZGVyKTtcblxuICAgIF9mbkRyYXdIZWFkKHNldHRpbmdzLCBzZXR0aW5ncy5hb0Zvb3Rlcik7XG5cbiAgICBpZiAoIXNldHRpbmdzLmFpRGlzcGxheS5sZW5ndGgpIHtcbiAgICAgICQoc2V0dGluZ3MublRCb2R5KS5maW5kKCd0ZFtjb2xzcGFuXScpLmF0dHIoJ2NvbHNwYW4nLCBfZm5WaXNibGVDb2x1bW5zKHNldHRpbmdzKSk7XG4gICAgfVxuXG4gICAgX2ZuU2F2ZVN0YXRlKHNldHRpbmdzKTtcbiAgfTtcblxuICBfYXBpX3JlZ2lzdGVyKCdjb2x1bW5zKCknLCBmdW5jdGlvbiAoc2VsZWN0b3IsIG9wdHMpIHtcbiAgICBpZiAoc2VsZWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc2VsZWN0b3IgPSAnJztcbiAgICB9IGVsc2UgaWYgKCQuaXNQbGFpbk9iamVjdChzZWxlY3RvcikpIHtcbiAgICAgIG9wdHMgPSBzZWxlY3RvcjtcbiAgICAgIHNlbGVjdG9yID0gJyc7XG4gICAgfVxuXG4gICAgb3B0cyA9IF9zZWxlY3Rvcl9vcHRzKG9wdHMpO1xuICAgIHZhciBpbnN0ID0gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIHJldHVybiBfX2NvbHVtbl9zZWxlY3RvcihzZXR0aW5ncywgc2VsZWN0b3IsIG9wdHMpO1xuICAgIH0sIDEpO1xuICAgIGluc3Quc2VsZWN0b3IuY29scyA9IHNlbGVjdG9yO1xuICAgIGluc3Quc2VsZWN0b3Iub3B0cyA9IG9wdHM7XG4gICAgcmV0dXJuIGluc3Q7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NvbHVtbnMoKS5oZWFkZXIoKScsICdjb2x1bW4oKS5oZWFkZXIoKScsIGZ1bmN0aW9uIChzZWxlY3Rvciwgb3B0cykge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjb2x1bW4nLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbHVtbikge1xuICAgICAgcmV0dXJuIHNldHRpbmdzLmFvQ29sdW1uc1tjb2x1bW5dLm5UaDtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY29sdW1ucygpLmZvb3RlcigpJywgJ2NvbHVtbigpLmZvb3RlcigpJywgZnVuY3Rpb24gKHNlbGVjdG9yLCBvcHRzKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NvbHVtbicsIGZ1bmN0aW9uIChzZXR0aW5ncywgY29sdW1uKSB7XG4gICAgICByZXR1cm4gc2V0dGluZ3MuYW9Db2x1bW5zW2NvbHVtbl0ublRmO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjb2x1bW5zKCkuZGF0YSgpJywgJ2NvbHVtbigpLmRhdGEoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY29sdW1uLXJvd3MnLCBfX2NvbHVtbkRhdGEsIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjb2x1bW5zKCkuZGF0YVNyYygpJywgJ2NvbHVtbigpLmRhdGFTcmMoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY29sdW1uJywgZnVuY3Rpb24gKHNldHRpbmdzLCBjb2x1bW4pIHtcbiAgICAgIHJldHVybiBzZXR0aW5ncy5hb0NvbHVtbnNbY29sdW1uXS5tRGF0YTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY29sdW1ucygpLmNhY2hlKCknLCAnY29sdW1uKCkuY2FjaGUoKScsIGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NvbHVtbi1yb3dzJywgZnVuY3Rpb24gKHNldHRpbmdzLCBjb2x1bW4sIGksIGosIHJvd3MpIHtcbiAgICAgIHJldHVybiBfcGx1Y2tfb3JkZXIoc2V0dGluZ3MuYW9EYXRhLCByb3dzLCB0eXBlID09PSAnc2VhcmNoJyA/ICdfYUZpbHRlckRhdGEnIDogJ19hU29ydERhdGEnLCBjb2x1bW4pO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjb2x1bW5zKCkubm9kZXMoKScsICdjb2x1bW4oKS5ub2RlcygpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjb2x1bW4tcm93cycsIGZ1bmN0aW9uIChzZXR0aW5ncywgY29sdW1uLCBpLCBqLCByb3dzKSB7XG4gICAgICByZXR1cm4gX3BsdWNrX29yZGVyKHNldHRpbmdzLmFvRGF0YSwgcm93cywgJ2FuQ2VsbHMnLCBjb2x1bW4pO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjb2x1bW5zKCkudmlzaWJsZSgpJywgJ2NvbHVtbigpLnZpc2libGUoKScsIGZ1bmN0aW9uICh2aXMsIGNhbGMpIHtcbiAgICB2YXIgcmV0ID0gdGhpcy5pdGVyYXRvcignY29sdW1uJywgZnVuY3Rpb24gKHNldHRpbmdzLCBjb2x1bW4pIHtcbiAgICAgIGlmICh2aXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gc2V0dGluZ3MuYW9Db2x1bW5zW2NvbHVtbl0uYlZpc2libGU7XG4gICAgICB9XG5cbiAgICAgIF9fc2V0Q29sdW1uVmlzKHNldHRpbmdzLCBjb2x1bW4sIHZpcyk7XG4gICAgfSk7XG5cbiAgICBpZiAodmlzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuaXRlcmF0b3IoJ2NvbHVtbicsIGZ1bmN0aW9uIChzZXR0aW5ncywgY29sdW1uKSB7XG4gICAgICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgbnVsbCwgJ2NvbHVtbi12aXNpYmlsaXR5JywgW3NldHRpbmdzLCBjb2x1bW4sIHZpcywgY2FsY10pO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjYWxjID09PSB1bmRlZmluZWQgfHwgY2FsYykge1xuICAgICAgICB0aGlzLmNvbHVtbnMuYWRqdXN0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY29sdW1ucygpLmluZGV4ZXMoKScsICdjb2x1bW4oKS5pbmRleCgpJywgZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY29sdW1uJywgZnVuY3Rpb24gKHNldHRpbmdzLCBjb2x1bW4pIHtcbiAgICAgIHJldHVybiB0eXBlID09PSAndmlzaWJsZScgPyBfZm5Db2x1bW5JbmRleFRvVmlzaWJsZShzZXR0aW5ncywgY29sdW1uKSA6IGNvbHVtbjtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignY29sdW1ucy5hZGp1c3QoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIF9mbkFkanVzdENvbHVtblNpemluZyhzZXR0aW5ncyk7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2NvbHVtbi5pbmRleCgpJywgZnVuY3Rpb24gKHR5cGUsIGlkeCkge1xuICAgIGlmICh0aGlzLmNvbnRleHQubGVuZ3RoICE9PSAwKSB7XG4gICAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0WzBdO1xuXG4gICAgICBpZiAodHlwZSA9PT0gJ2Zyb21WaXNpYmxlJyB8fCB0eXBlID09PSAndG9EYXRhJykge1xuICAgICAgICByZXR1cm4gX2ZuVmlzaWJsZVRvQ29sdW1uSW5kZXgoY3R4LCBpZHgpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnZnJvbURhdGEnIHx8IHR5cGUgPT09ICd0b1Zpc2libGUnKSB7XG4gICAgICAgIHJldHVybiBfZm5Db2x1bW5JbmRleFRvVmlzaWJsZShjdHgsIGlkeCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdjb2x1bW4oKScsIGZ1bmN0aW9uIChzZWxlY3Rvciwgb3B0cykge1xuICAgIHJldHVybiBfc2VsZWN0b3JfZmlyc3QodGhpcy5jb2x1bW5zKHNlbGVjdG9yLCBvcHRzKSk7XG4gIH0pO1xuXG4gIHZhciBfX2NlbGxfc2VsZWN0b3IgPSBmdW5jdGlvbiBfX2NlbGxfc2VsZWN0b3Ioc2V0dGluZ3MsIHNlbGVjdG9yLCBvcHRzKSB7XG4gICAgdmFyIGRhdGEgPSBzZXR0aW5ncy5hb0RhdGE7XG5cbiAgICB2YXIgcm93cyA9IF9zZWxlY3Rvcl9yb3dfaW5kZXhlcyhzZXR0aW5ncywgb3B0cyk7XG5cbiAgICB2YXIgY2VsbHMgPSBfcmVtb3ZlRW1wdHkoX3BsdWNrX29yZGVyKGRhdGEsIHJvd3MsICdhbkNlbGxzJykpO1xuXG4gICAgdmFyIGFsbENlbGxzID0gJChbXS5jb25jYXQuYXBwbHkoW10sIGNlbGxzKSk7XG4gICAgdmFyIHJvdztcbiAgICB2YXIgY29sdW1ucyA9IHNldHRpbmdzLmFvQ29sdW1ucy5sZW5ndGg7XG4gICAgdmFyIGEsIGksIGllbiwgaiwgbywgaG9zdDtcblxuICAgIHZhciBydW4gPSBmdW5jdGlvbiBydW4ocykge1xuICAgICAgdmFyIGZuU2VsZWN0b3IgPSB0eXBlb2YgcyA9PT0gJ2Z1bmN0aW9uJztcblxuICAgICAgaWYgKHMgPT09IG51bGwgfHwgcyA9PT0gdW5kZWZpbmVkIHx8IGZuU2VsZWN0b3IpIHtcbiAgICAgICAgYSA9IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGllbiA9IHJvd3MubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICByb3cgPSByb3dzW2ldO1xuXG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IGNvbHVtbnM7IGorKykge1xuICAgICAgICAgICAgbyA9IHtcbiAgICAgICAgICAgICAgcm93OiByb3csXG4gICAgICAgICAgICAgIGNvbHVtbjogalxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGZuU2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgaG9zdCA9IGRhdGFbcm93XTtcblxuICAgICAgICAgICAgICBpZiAocyhvLCBfZm5HZXRDZWxsRGF0YShzZXR0aW5ncywgcm93LCBqKSwgaG9zdC5hbkNlbGxzID8gaG9zdC5hbkNlbGxzW2pdIDogbnVsbCkpIHtcbiAgICAgICAgICAgICAgICBhLnB1c2gobyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGEucHVzaChvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYTtcbiAgICAgIH1cblxuICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdChzKSkge1xuICAgICAgICByZXR1cm4gcy5jb2x1bW4gIT09IHVuZGVmaW5lZCAmJiBzLnJvdyAhPT0gdW5kZWZpbmVkICYmICQuaW5BcnJheShzLnJvdywgcm93cykgIT09IC0xID8gW3NdIDogW107XG4gICAgICB9XG5cbiAgICAgIHZhciBqcVJlc3VsdCA9IGFsbENlbGxzLmZpbHRlcihzKS5tYXAoZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcm93OiBlbC5fRFRfQ2VsbEluZGV4LnJvdyxcbiAgICAgICAgICBjb2x1bW46IGVsLl9EVF9DZWxsSW5kZXguY29sdW1uXG4gICAgICAgIH07XG4gICAgICB9KS50b0FycmF5KCk7XG5cbiAgICAgIGlmIChqcVJlc3VsdC5sZW5ndGggfHwgIXMubm9kZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGpxUmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBob3N0ID0gJChzKS5jbG9zZXN0KCcqW2RhdGEtZHQtcm93XScpO1xuICAgICAgcmV0dXJuIGhvc3QubGVuZ3RoID8gW3tcbiAgICAgICAgcm93OiBob3N0LmRhdGEoJ2R0LXJvdycpLFxuICAgICAgICBjb2x1bW46IGhvc3QuZGF0YSgnZHQtY29sdW1uJylcbiAgICAgIH1dIDogW107XG4gICAgfTtcblxuICAgIHJldHVybiBfc2VsZWN0b3JfcnVuKCdjZWxsJywgc2VsZWN0b3IsIHJ1biwgc2V0dGluZ3MsIG9wdHMpO1xuICB9O1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2NlbGxzKCknLCBmdW5jdGlvbiAocm93U2VsZWN0b3IsIGNvbHVtblNlbGVjdG9yLCBvcHRzKSB7XG4gICAgaWYgKCQuaXNQbGFpbk9iamVjdChyb3dTZWxlY3RvcikpIHtcbiAgICAgIGlmIChyb3dTZWxlY3Rvci5yb3cgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvcHRzID0gcm93U2VsZWN0b3I7XG4gICAgICAgIHJvd1NlbGVjdG9yID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdHMgPSBjb2x1bW5TZWxlY3RvcjtcbiAgICAgICAgY29sdW1uU2VsZWN0b3IgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICgkLmlzUGxhaW5PYmplY3QoY29sdW1uU2VsZWN0b3IpKSB7XG4gICAgICBvcHRzID0gY29sdW1uU2VsZWN0b3I7XG4gICAgICBjb2x1bW5TZWxlY3RvciA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGNvbHVtblNlbGVjdG9yID09PSBudWxsIHx8IGNvbHVtblNlbGVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgICByZXR1cm4gX19jZWxsX3NlbGVjdG9yKHNldHRpbmdzLCByb3dTZWxlY3RvciwgX3NlbGVjdG9yX29wdHMob3B0cykpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIGNvbHVtbnMgPSB0aGlzLmNvbHVtbnMoY29sdW1uU2VsZWN0b3IpO1xuICAgIHZhciByb3dzID0gdGhpcy5yb3dzKHJvd1NlbGVjdG9yKTtcbiAgICB2YXIgYSwgaSwgaWVuLCBqLCBqZW47XG4gICAgdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGlkeCkge1xuICAgICAgYSA9IFtdO1xuXG4gICAgICBmb3IgKGkgPSAwLCBpZW4gPSByb3dzW2lkeF0ubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgZm9yIChqID0gMCwgamVuID0gY29sdW1uc1tpZHhdLmxlbmd0aDsgaiA8IGplbjsgaisrKSB7XG4gICAgICAgICAgYS5wdXNoKHtcbiAgICAgICAgICAgIHJvdzogcm93c1tpZHhdW2ldLFxuICAgICAgICAgICAgY29sdW1uOiBjb2x1bW5zW2lkeF1bal1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIDEpO1xuICAgIHZhciBjZWxscyA9IHRoaXMuY2VsbHMoYSwgb3B0cyk7XG4gICAgJC5leHRlbmQoY2VsbHMuc2VsZWN0b3IsIHtcbiAgICAgIGNvbHM6IGNvbHVtblNlbGVjdG9yLFxuICAgICAgcm93czogcm93U2VsZWN0b3IsXG4gICAgICBvcHRzOiBvcHRzXG4gICAgfSk7XG4gICAgcmV0dXJuIGNlbGxzO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjZWxscygpLm5vZGVzKCknLCAnY2VsbCgpLm5vZGUoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY2VsbCcsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93LCBjb2x1bW4pIHtcbiAgICAgIHZhciBkYXRhID0gc2V0dGluZ3MuYW9EYXRhW3Jvd107XG4gICAgICByZXR1cm4gZGF0YSAmJiBkYXRhLmFuQ2VsbHMgPyBkYXRhLmFuQ2VsbHNbY29sdW1uXSA6IHVuZGVmaW5lZDtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignY2VsbHMoKS5kYXRhKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NlbGwnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIHJvdywgY29sdW1uKSB7XG4gICAgICByZXR1cm4gX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIHJvdywgY29sdW1uKTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY2VsbHMoKS5jYWNoZSgpJywgJ2NlbGwoKS5jYWNoZSgpJywgZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB0eXBlID0gdHlwZSA9PT0gJ3NlYXJjaCcgPyAnX2FGaWx0ZXJEYXRhJyA6ICdfYVNvcnREYXRhJztcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY2VsbCcsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93LCBjb2x1bW4pIHtcbiAgICAgIHJldHVybiBzZXR0aW5ncy5hb0RhdGFbcm93XVt0eXBlXVtjb2x1bW5dO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjZWxscygpLnJlbmRlcigpJywgJ2NlbGwoKS5yZW5kZXIoKScsIGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NlbGwnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIHJvdywgY29sdW1uKSB7XG4gICAgICByZXR1cm4gX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIHJvdywgY29sdW1uLCB0eXBlKTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY2VsbHMoKS5pbmRleGVzKCknLCAnY2VsbCgpLmluZGV4KCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NlbGwnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIHJvdywgY29sdW1uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByb3c6IHJvdyxcbiAgICAgICAgY29sdW1uOiBjb2x1bW4sXG4gICAgICAgIGNvbHVtblZpc2libGU6IF9mbkNvbHVtbkluZGV4VG9WaXNpYmxlKHNldHRpbmdzLCBjb2x1bW4pXG4gICAgICB9O1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjZWxscygpLmludmFsaWRhdGUoKScsICdjZWxsKCkuaW52YWxpZGF0ZSgpJywgZnVuY3Rpb24gKHNyYykge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjZWxsJywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3csIGNvbHVtbikge1xuICAgICAgX2ZuSW52YWxpZGF0ZShzZXR0aW5ncywgcm93LCBzcmMsIGNvbHVtbik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2NlbGwoKScsIGZ1bmN0aW9uIChyb3dTZWxlY3RvciwgY29sdW1uU2VsZWN0b3IsIG9wdHMpIHtcbiAgICByZXR1cm4gX3NlbGVjdG9yX2ZpcnN0KHRoaXMuY2VsbHMocm93U2VsZWN0b3IsIGNvbHVtblNlbGVjdG9yLCBvcHRzKSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2NlbGwoKS5kYXRhKCknLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG4gICAgdmFyIGNlbGwgPSB0aGlzWzBdO1xuXG4gICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGN0eC5sZW5ndGggJiYgY2VsbC5sZW5ndGggPyBfZm5HZXRDZWxsRGF0YShjdHhbMF0sIGNlbGxbMF0ucm93LCBjZWxsWzBdLmNvbHVtbikgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgX2ZuU2V0Q2VsbERhdGEoY3R4WzBdLCBjZWxsWzBdLnJvdywgY2VsbFswXS5jb2x1bW4sIGRhdGEpO1xuXG4gICAgX2ZuSW52YWxpZGF0ZShjdHhbMF0sIGNlbGxbMF0ucm93LCAnZGF0YScsIGNlbGxbMF0uY29sdW1uKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdvcmRlcigpJywgZnVuY3Rpb24gKG9yZGVyLCBkaXIpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKG9yZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBjdHgubGVuZ3RoICE9PSAwID8gY3R4WzBdLmFhU29ydGluZyA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9yZGVyID09PSAnbnVtYmVyJykge1xuICAgICAgb3JkZXIgPSBbW29yZGVyLCBkaXJdXTtcbiAgICB9IGVsc2UgaWYgKG9yZGVyLmxlbmd0aCAmJiAhJC5pc0FycmF5KG9yZGVyWzBdKSkge1xuICAgICAgb3JkZXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgc2V0dGluZ3MuYWFTb3J0aW5nID0gb3JkZXIuc2xpY2UoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcignb3JkZXIubGlzdGVuZXIoKScsIGZ1bmN0aW9uIChub2RlLCBjb2x1bW4sIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBfZm5Tb3J0QXR0YWNoTGlzdGVuZXIoc2V0dGluZ3MsIG5vZGUsIGNvbHVtbiwgY2FsbGJhY2spO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdvcmRlci5maXhlZCgpJywgZnVuY3Rpb24gKHNldCkge1xuICAgIGlmICghc2V0KSB7XG4gICAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuICAgICAgdmFyIGZpeGVkID0gY3R4Lmxlbmd0aCA/IGN0eFswXS5hYVNvcnRpbmdGaXhlZCA6IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiAkLmlzQXJyYXkoZml4ZWQpID8ge1xuICAgICAgICBwcmU6IGZpeGVkXG4gICAgICB9IDogZml4ZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBzZXR0aW5ncy5hYVNvcnRpbmdGaXhlZCA9ICQuZXh0ZW5kKHRydWUsIHt9LCBzZXQpO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKFsnY29sdW1ucygpLm9yZGVyKCknLCAnY29sdW1uKCkub3JkZXIoKSddLCBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncywgaSkge1xuICAgICAgdmFyIHNvcnQgPSBbXTtcbiAgICAgICQuZWFjaCh0aGF0W2ldLCBmdW5jdGlvbiAoaiwgY29sKSB7XG4gICAgICAgIHNvcnQucHVzaChbY29sLCBkaXJdKTtcbiAgICAgIH0pO1xuICAgICAgc2V0dGluZ3MuYWFTb3J0aW5nID0gc29ydDtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcignc2VhcmNoKCknLCBmdW5jdGlvbiAoaW5wdXQsIHJlZ2V4LCBzbWFydCwgY2FzZUluc2VuKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcblxuICAgIGlmIChpbnB1dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gY3R4Lmxlbmd0aCAhPT0gMCA/IGN0eFswXS5vUHJldmlvdXNTZWFyY2guc1NlYXJjaCA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIGlmICghc2V0dGluZ3Mub0ZlYXR1cmVzLmJGaWx0ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBfZm5GaWx0ZXJDb21wbGV0ZShzZXR0aW5ncywgJC5leHRlbmQoe30sIHNldHRpbmdzLm9QcmV2aW91c1NlYXJjaCwge1xuICAgICAgICBcInNTZWFyY2hcIjogaW5wdXQgKyBcIlwiLFxuICAgICAgICBcImJSZWdleFwiOiByZWdleCA9PT0gbnVsbCA/IGZhbHNlIDogcmVnZXgsXG4gICAgICAgIFwiYlNtYXJ0XCI6IHNtYXJ0ID09PSBudWxsID8gdHJ1ZSA6IHNtYXJ0LFxuICAgICAgICBcImJDYXNlSW5zZW5zaXRpdmVcIjogY2FzZUluc2VuID09PSBudWxsID8gdHJ1ZSA6IGNhc2VJbnNlblxuICAgICAgfSksIDEpO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjb2x1bW5zKCkuc2VhcmNoKCknLCAnY29sdW1uKCkuc2VhcmNoKCknLCBmdW5jdGlvbiAoaW5wdXQsIHJlZ2V4LCBzbWFydCwgY2FzZUluc2VuKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NvbHVtbicsIGZ1bmN0aW9uIChzZXR0aW5ncywgY29sdW1uKSB7XG4gICAgICB2YXIgcHJlU2VhcmNoID0gc2V0dGluZ3MuYW9QcmVTZWFyY2hDb2xzO1xuXG4gICAgICBpZiAoaW5wdXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gcHJlU2VhcmNoW2NvbHVtbl0uc1NlYXJjaDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFzZXR0aW5ncy5vRmVhdHVyZXMuYkZpbHRlcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICQuZXh0ZW5kKHByZVNlYXJjaFtjb2x1bW5dLCB7XG4gICAgICAgIFwic1NlYXJjaFwiOiBpbnB1dCArIFwiXCIsXG4gICAgICAgIFwiYlJlZ2V4XCI6IHJlZ2V4ID09PSBudWxsID8gZmFsc2UgOiByZWdleCxcbiAgICAgICAgXCJiU21hcnRcIjogc21hcnQgPT09IG51bGwgPyB0cnVlIDogc21hcnQsXG4gICAgICAgIFwiYkNhc2VJbnNlbnNpdGl2ZVwiOiBjYXNlSW5zZW4gPT09IG51bGwgPyB0cnVlIDogY2FzZUluc2VuXG4gICAgICB9KTtcblxuICAgICAgX2ZuRmlsdGVyQ29tcGxldGUoc2V0dGluZ3MsIHNldHRpbmdzLm9QcmV2aW91c1NlYXJjaCwgMSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3N0YXRlKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5sZW5ndGggPyB0aGlzLmNvbnRleHRbMF0ub1NhdmVkU3RhdGUgOiBudWxsO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdzdGF0ZS5jbGVhcigpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgc2V0dGluZ3MuZm5TdGF0ZVNhdmVDYWxsYmFjay5jYWxsKHNldHRpbmdzLm9JbnN0YW5jZSwgc2V0dGluZ3MsIHt9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcignc3RhdGUubG9hZGVkKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5sZW5ndGggPyB0aGlzLmNvbnRleHRbMF0ub0xvYWRlZFN0YXRlIDogbnVsbDtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcignc3RhdGUuc2F2ZSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgX2ZuU2F2ZVN0YXRlKHNldHRpbmdzKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgRGF0YVRhYmxlLnZlcnNpb25DaGVjayA9IERhdGFUYWJsZS5mblZlcnNpb25DaGVjayA9IGZ1bmN0aW9uICh2ZXJzaW9uKSB7XG4gICAgdmFyIGFUaGlzID0gRGF0YVRhYmxlLnZlcnNpb24uc3BsaXQoJy4nKTtcbiAgICB2YXIgYVRoYXQgPSB2ZXJzaW9uLnNwbGl0KCcuJyk7XG4gICAgdmFyIGlUaGlzLCBpVGhhdDtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gYVRoYXQubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICBpVGhpcyA9IHBhcnNlSW50KGFUaGlzW2ldLCAxMCkgfHwgMDtcbiAgICAgIGlUaGF0ID0gcGFyc2VJbnQoYVRoYXRbaV0sIDEwKSB8fCAwO1xuXG4gICAgICBpZiAoaVRoaXMgPT09IGlUaGF0KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaVRoaXMgPiBpVGhhdDtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBEYXRhVGFibGUuaXNEYXRhVGFibGUgPSBEYXRhVGFibGUuZm5Jc0RhdGFUYWJsZSA9IGZ1bmN0aW9uICh0YWJsZSkge1xuICAgIHZhciB0ID0gJCh0YWJsZSkuZ2V0KDApO1xuICAgIHZhciBpcyA9IGZhbHNlO1xuXG4gICAgaWYgKHRhYmxlIGluc3RhbmNlb2YgRGF0YVRhYmxlLkFwaSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgJC5lYWNoKERhdGFUYWJsZS5zZXR0aW5ncywgZnVuY3Rpb24gKGksIG8pIHtcbiAgICAgIHZhciBoZWFkID0gby5uU2Nyb2xsSGVhZCA/ICQoJ3RhYmxlJywgby5uU2Nyb2xsSGVhZClbMF0gOiBudWxsO1xuICAgICAgdmFyIGZvb3QgPSBvLm5TY3JvbGxGb290ID8gJCgndGFibGUnLCBvLm5TY3JvbGxGb290KVswXSA6IG51bGw7XG5cbiAgICAgIGlmIChvLm5UYWJsZSA9PT0gdCB8fCBoZWFkID09PSB0IHx8IGZvb3QgPT09IHQpIHtcbiAgICAgICAgaXMgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpcztcbiAgfTtcblxuICBEYXRhVGFibGUudGFibGVzID0gRGF0YVRhYmxlLmZuVGFibGVzID0gZnVuY3Rpb24gKHZpc2libGUpIHtcbiAgICB2YXIgYXBpID0gZmFsc2U7XG5cbiAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHZpc2libGUpKSB7XG4gICAgICBhcGkgPSB2aXNpYmxlLmFwaTtcbiAgICAgIHZpc2libGUgPSB2aXNpYmxlLnZpc2libGU7XG4gICAgfVxuXG4gICAgdmFyIGEgPSAkLm1hcChEYXRhVGFibGUuc2V0dGluZ3MsIGZ1bmN0aW9uIChvKSB7XG4gICAgICBpZiAoIXZpc2libGUgfHwgdmlzaWJsZSAmJiAkKG8ublRhYmxlKS5pcygnOnZpc2libGUnKSkge1xuICAgICAgICByZXR1cm4gby5uVGFibGU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGFwaSA/IG5ldyBfQXBpMihhKSA6IGE7XG4gIH07XG5cbiAgRGF0YVRhYmxlLmNhbWVsVG9IdW5nYXJpYW4gPSBfZm5DYW1lbFRvSHVuZ2FyaWFuO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJyQoKScsIGZ1bmN0aW9uIChzZWxlY3Rvciwgb3B0cykge1xuICAgIHZhciByb3dzID0gdGhpcy5yb3dzKG9wdHMpLm5vZGVzKCksXG4gICAgICAgIGpxUm93cyA9ICQocm93cyk7XG4gICAgcmV0dXJuICQoW10uY29uY2F0KGpxUm93cy5maWx0ZXIoc2VsZWN0b3IpLnRvQXJyYXkoKSwganFSb3dzLmZpbmQoc2VsZWN0b3IpLnRvQXJyYXkoKSkpO1xuICB9KTtcblxuICAkLmVhY2goWydvbicsICdvbmUnLCAnb2ZmJ10sIGZ1bmN0aW9uIChpLCBrZXkpIHtcbiAgICBfYXBpX3JlZ2lzdGVyKGtleSArICcoKScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIGFyZ3NbMF0gPSAkLm1hcChhcmdzWzBdLnNwbGl0KC9cXHMvKSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuICFlLm1hdGNoKC9cXC5kdFxcYi8pID8gZSArICcuZHQnIDogZTtcbiAgICAgIH0pLmpvaW4oJyAnKTtcbiAgICAgIHZhciBpbnN0ID0gJCh0aGlzLnRhYmxlcygpLm5vZGVzKCkpO1xuICAgICAgaW5zdFtrZXldLmFwcGx5KGluc3QsIGFyZ3MpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2NsZWFyKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBfZm5DbGVhclRhYmxlKHNldHRpbmdzKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcignc2V0dGluZ3MoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IF9BcGkyKHRoaXMuY29udGV4dCwgdGhpcy5jb250ZXh0KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignaW5pdCgpJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG4gICAgcmV0dXJuIGN0eC5sZW5ndGggPyBjdHhbMF0ub0luaXQgOiBudWxsO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdkYXRhKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICByZXR1cm4gX3BsdWNrKHNldHRpbmdzLmFvRGF0YSwgJ19hRGF0YScpO1xuICAgIH0pLmZsYXR0ZW4oKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignZGVzdHJveSgpJywgZnVuY3Rpb24gKHJlbW92ZSkge1xuICAgIHJlbW92ZSA9IHJlbW92ZSB8fCBmYWxzZTtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIHZhciBvcmlnID0gc2V0dGluZ3MublRhYmxlV3JhcHBlci5wYXJlbnROb2RlO1xuICAgICAgdmFyIGNsYXNzZXMgPSBzZXR0aW5ncy5vQ2xhc3NlcztcbiAgICAgIHZhciB0YWJsZSA9IHNldHRpbmdzLm5UYWJsZTtcbiAgICAgIHZhciB0Ym9keSA9IHNldHRpbmdzLm5UQm9keTtcbiAgICAgIHZhciB0aGVhZCA9IHNldHRpbmdzLm5USGVhZDtcbiAgICAgIHZhciB0Zm9vdCA9IHNldHRpbmdzLm5URm9vdDtcbiAgICAgIHZhciBqcVRhYmxlID0gJCh0YWJsZSk7XG4gICAgICB2YXIganFUYm9keSA9ICQodGJvZHkpO1xuICAgICAgdmFyIGpxV3JhcHBlciA9ICQoc2V0dGluZ3MublRhYmxlV3JhcHBlcik7XG4gICAgICB2YXIgcm93cyA9ICQubWFwKHNldHRpbmdzLmFvRGF0YSwgZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgcmV0dXJuIHIublRyO1xuICAgICAgfSk7XG4gICAgICB2YXIgaSwgaWVuO1xuICAgICAgc2V0dGluZ3MuYkRlc3Ryb3lpbmcgPSB0cnVlO1xuXG4gICAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIFwiYW9EZXN0cm95Q2FsbGJhY2tcIiwgXCJkZXN0cm95XCIsIFtzZXR0aW5nc10pO1xuXG4gICAgICBpZiAoIXJlbW92ZSkge1xuICAgICAgICBuZXcgX0FwaTIoc2V0dGluZ3MpLmNvbHVtbnMoKS52aXNpYmxlKHRydWUpO1xuICAgICAgfVxuXG4gICAgICBqcVdyYXBwZXIub2ZmKCcuRFQnKS5maW5kKCc6bm90KHRib2R5ICopJykub2ZmKCcuRFQnKTtcbiAgICAgICQod2luZG93KS5vZmYoJy5EVC0nICsgc2V0dGluZ3Muc0luc3RhbmNlKTtcblxuICAgICAgaWYgKHRhYmxlICE9IHRoZWFkLnBhcmVudE5vZGUpIHtcbiAgICAgICAganFUYWJsZS5jaGlsZHJlbigndGhlYWQnKS5kZXRhY2goKTtcbiAgICAgICAganFUYWJsZS5hcHBlbmQodGhlYWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGZvb3QgJiYgdGFibGUgIT0gdGZvb3QucGFyZW50Tm9kZSkge1xuICAgICAgICBqcVRhYmxlLmNoaWxkcmVuKCd0Zm9vdCcpLmRldGFjaCgpO1xuICAgICAgICBqcVRhYmxlLmFwcGVuZCh0Zm9vdCk7XG4gICAgICB9XG5cbiAgICAgIHNldHRpbmdzLmFhU29ydGluZyA9IFtdO1xuICAgICAgc2V0dGluZ3MuYWFTb3J0aW5nRml4ZWQgPSBbXTtcblxuICAgICAgX2ZuU29ydGluZ0NsYXNzZXMoc2V0dGluZ3MpO1xuXG4gICAgICAkKHJvd3MpLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFzU3RyaXBlQ2xhc3Nlcy5qb2luKCcgJykpO1xuICAgICAgJCgndGgsIHRkJywgdGhlYWQpLnJlbW92ZUNsYXNzKGNsYXNzZXMuc1NvcnRhYmxlICsgJyAnICsgY2xhc3Nlcy5zU29ydGFibGVBc2MgKyAnICcgKyBjbGFzc2VzLnNTb3J0YWJsZURlc2MgKyAnICcgKyBjbGFzc2VzLnNTb3J0YWJsZU5vbmUpO1xuICAgICAganFUYm9keS5jaGlsZHJlbigpLmRldGFjaCgpO1xuICAgICAganFUYm9keS5hcHBlbmQocm93cyk7XG4gICAgICB2YXIgcmVtb3ZlZE1ldGhvZCA9IHJlbW92ZSA/ICdyZW1vdmUnIDogJ2RldGFjaCc7XG4gICAgICBqcVRhYmxlW3JlbW92ZWRNZXRob2RdKCk7XG4gICAgICBqcVdyYXBwZXJbcmVtb3ZlZE1ldGhvZF0oKTtcblxuICAgICAgaWYgKCFyZW1vdmUgJiYgb3JpZykge1xuICAgICAgICBvcmlnLmluc2VydEJlZm9yZSh0YWJsZSwgc2V0dGluZ3MublRhYmxlUmVpbnNlcnRCZWZvcmUpO1xuICAgICAgICBqcVRhYmxlLmNzcygnd2lkdGgnLCBzZXR0aW5ncy5zRGVzdHJveVdpZHRoKS5yZW1vdmVDbGFzcyhjbGFzc2VzLnNUYWJsZSk7XG4gICAgICAgIGllbiA9IHNldHRpbmdzLmFzRGVzdHJveVN0cmlwZXMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChpZW4pIHtcbiAgICAgICAgICBqcVRib2R5LmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhzZXR0aW5ncy5hc0Rlc3Ryb3lTdHJpcGVzW2kgJSBpZW5dKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgaWR4ID0gJC5pbkFycmF5KHNldHRpbmdzLCBEYXRhVGFibGUuc2V0dGluZ3MpO1xuXG4gICAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgICBEYXRhVGFibGUuc2V0dGluZ3Muc3BsaWNlKGlkeCwgMSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gICQuZWFjaChbJ2NvbHVtbicsICdyb3cnLCAnY2VsbCddLCBmdW5jdGlvbiAoaSwgdHlwZSkge1xuICAgIF9hcGlfcmVnaXN0ZXIodHlwZSArICdzKCkuZXZlcnkoKScsIGZ1bmN0aW9uIChmbikge1xuICAgICAgdmFyIG9wdHMgPSB0aGlzLnNlbGVjdG9yLm9wdHM7XG4gICAgICB2YXIgYXBpID0gdGhpcztcbiAgICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKHR5cGUsIGZ1bmN0aW9uIChzZXR0aW5ncywgYXJnMSwgYXJnMiwgYXJnMywgYXJnNCkge1xuICAgICAgICBmbi5jYWxsKGFwaVt0eXBlXShhcmcxLCB0eXBlID09PSAnY2VsbCcgPyBhcmcyIDogb3B0cywgdHlwZSA9PT0gJ2NlbGwnID8gb3B0cyA6IHVuZGVmaW5lZCksIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2kxOG4oKScsIGZ1bmN0aW9uICh0b2tlbiwgZGVmLCBwbHVyYWwpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0WzBdO1xuXG4gICAgdmFyIHJlc29sdmVkID0gX2ZuR2V0T2JqZWN0RGF0YUZuKHRva2VuKShjdHgub0xhbmd1YWdlKTtcblxuICAgIGlmIChyZXNvbHZlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXNvbHZlZCA9IGRlZjtcbiAgICB9XG5cbiAgICBpZiAocGx1cmFsICE9PSB1bmRlZmluZWQgJiYgJC5pc1BsYWluT2JqZWN0KHJlc29sdmVkKSkge1xuICAgICAgcmVzb2x2ZWQgPSByZXNvbHZlZFtwbHVyYWxdICE9PSB1bmRlZmluZWQgPyByZXNvbHZlZFtwbHVyYWxdIDogcmVzb2x2ZWQuXztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzb2x2ZWQucmVwbGFjZSgnJWQnLCBwbHVyYWwpO1xuICB9KTtcblxuICBEYXRhVGFibGUudmVyc2lvbiA9IFwiMS4xMC4xOFwiO1xuICBEYXRhVGFibGUuc2V0dGluZ3MgPSBbXTtcbiAgRGF0YVRhYmxlLm1vZGVscyA9IHt9O1xuICBEYXRhVGFibGUubW9kZWxzLm9TZWFyY2ggPSB7XG4gICAgXCJiQ2FzZUluc2Vuc2l0aXZlXCI6IHRydWUsXG4gICAgXCJzU2VhcmNoXCI6IFwiXCIsXG4gICAgXCJiUmVnZXhcIjogZmFsc2UsXG4gICAgXCJiU21hcnRcIjogdHJ1ZVxuICB9O1xuICBEYXRhVGFibGUubW9kZWxzLm9Sb3cgPSB7XG4gICAgXCJuVHJcIjogbnVsbCxcbiAgICBcImFuQ2VsbHNcIjogbnVsbCxcbiAgICBcIl9hRGF0YVwiOiBbXSxcbiAgICBcIl9hU29ydERhdGFcIjogbnVsbCxcbiAgICBcIl9hRmlsdGVyRGF0YVwiOiBudWxsLFxuICAgIFwiX3NGaWx0ZXJSb3dcIjogbnVsbCxcbiAgICBcIl9zUm93U3RyaXBlXCI6IFwiXCIsXG4gICAgXCJzcmNcIjogbnVsbCxcbiAgICBcImlkeFwiOiAtMVxuICB9O1xuICBEYXRhVGFibGUubW9kZWxzLm9Db2x1bW4gPSB7XG4gICAgXCJpZHhcIjogbnVsbCxcbiAgICBcImFEYXRhU29ydFwiOiBudWxsLFxuICAgIFwiYXNTb3J0aW5nXCI6IG51bGwsXG4gICAgXCJiU2VhcmNoYWJsZVwiOiBudWxsLFxuICAgIFwiYlNvcnRhYmxlXCI6IG51bGwsXG4gICAgXCJiVmlzaWJsZVwiOiBudWxsLFxuICAgIFwiX3NNYW51YWxUeXBlXCI6IG51bGwsXG4gICAgXCJfYkF0dHJTcmNcIjogZmFsc2UsXG4gICAgXCJmbkNyZWF0ZWRDZWxsXCI6IG51bGwsXG4gICAgXCJmbkdldERhdGFcIjogbnVsbCxcbiAgICBcImZuU2V0RGF0YVwiOiBudWxsLFxuICAgIFwibURhdGFcIjogbnVsbCxcbiAgICBcIm1SZW5kZXJcIjogbnVsbCxcbiAgICBcIm5UaFwiOiBudWxsLFxuICAgIFwiblRmXCI6IG51bGwsXG4gICAgXCJzQ2xhc3NcIjogbnVsbCxcbiAgICBcInNDb250ZW50UGFkZGluZ1wiOiBudWxsLFxuICAgIFwic0RlZmF1bHRDb250ZW50XCI6IG51bGwsXG4gICAgXCJzTmFtZVwiOiBudWxsLFxuICAgIFwic1NvcnREYXRhVHlwZVwiOiAnc3RkJyxcbiAgICBcInNTb3J0aW5nQ2xhc3NcIjogbnVsbCxcbiAgICBcInNTb3J0aW5nQ2xhc3NKVUlcIjogbnVsbCxcbiAgICBcInNUaXRsZVwiOiBudWxsLFxuICAgIFwic1R5cGVcIjogbnVsbCxcbiAgICBcInNXaWR0aFwiOiBudWxsLFxuICAgIFwic1dpZHRoT3JpZ1wiOiBudWxsXG4gIH07XG4gIERhdGFUYWJsZS5kZWZhdWx0cyA9IHtcbiAgICBcImFhRGF0YVwiOiBudWxsLFxuICAgIFwiYWFTb3J0aW5nXCI6IFtbMCwgJ2FzYyddXSxcbiAgICBcImFhU29ydGluZ0ZpeGVkXCI6IFtdLFxuICAgIFwiYWpheFwiOiBudWxsLFxuICAgIFwiYUxlbmd0aE1lbnVcIjogWzEwLCAyNSwgNTAsIDEwMF0sXG4gICAgXCJhb0NvbHVtbnNcIjogbnVsbCxcbiAgICBcImFvQ29sdW1uRGVmc1wiOiBudWxsLFxuICAgIFwiYW9TZWFyY2hDb2xzXCI6IFtdLFxuICAgIFwiYXNTdHJpcGVDbGFzc2VzXCI6IG51bGwsXG4gICAgXCJiQXV0b1dpZHRoXCI6IHRydWUsXG4gICAgXCJiRGVmZXJSZW5kZXJcIjogZmFsc2UsXG4gICAgXCJiRGVzdHJveVwiOiBmYWxzZSxcbiAgICBcImJGaWx0ZXJcIjogdHJ1ZSxcbiAgICBcImJJbmZvXCI6IHRydWUsXG4gICAgXCJiTGVuZ3RoQ2hhbmdlXCI6IHRydWUsXG4gICAgXCJiUGFnaW5hdGVcIjogdHJ1ZSxcbiAgICBcImJQcm9jZXNzaW5nXCI6IGZhbHNlLFxuICAgIFwiYlJldHJpZXZlXCI6IGZhbHNlLFxuICAgIFwiYlNjcm9sbENvbGxhcHNlXCI6IGZhbHNlLFxuICAgIFwiYlNlcnZlclNpZGVcIjogZmFsc2UsXG4gICAgXCJiU29ydFwiOiB0cnVlLFxuICAgIFwiYlNvcnRNdWx0aVwiOiB0cnVlLFxuICAgIFwiYlNvcnRDZWxsc1RvcFwiOiBmYWxzZSxcbiAgICBcImJTb3J0Q2xhc3Nlc1wiOiB0cnVlLFxuICAgIFwiYlN0YXRlU2F2ZVwiOiBmYWxzZSxcbiAgICBcImZuQ3JlYXRlZFJvd1wiOiBudWxsLFxuICAgIFwiZm5EcmF3Q2FsbGJhY2tcIjogbnVsbCxcbiAgICBcImZuRm9vdGVyQ2FsbGJhY2tcIjogbnVsbCxcbiAgICBcImZuRm9ybWF0TnVtYmVyXCI6IGZ1bmN0aW9uIGZuRm9ybWF0TnVtYmVyKHRvRm9ybWF0KSB7XG4gICAgICByZXR1cm4gdG9Gb3JtYXQudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCB0aGlzLm9MYW5ndWFnZS5zVGhvdXNhbmRzKTtcbiAgICB9LFxuICAgIFwiZm5IZWFkZXJDYWxsYmFja1wiOiBudWxsLFxuICAgIFwiZm5JbmZvQ2FsbGJhY2tcIjogbnVsbCxcbiAgICBcImZuSW5pdENvbXBsZXRlXCI6IG51bGwsXG4gICAgXCJmblByZURyYXdDYWxsYmFja1wiOiBudWxsLFxuICAgIFwiZm5Sb3dDYWxsYmFja1wiOiBudWxsLFxuICAgIFwiZm5TZXJ2ZXJEYXRhXCI6IG51bGwsXG4gICAgXCJmblNlcnZlclBhcmFtc1wiOiBudWxsLFxuICAgIFwiZm5TdGF0ZUxvYWRDYWxsYmFja1wiOiBmdW5jdGlvbiBmblN0YXRlTG9hZENhbGxiYWNrKHNldHRpbmdzKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSgoc2V0dGluZ3MuaVN0YXRlRHVyYXRpb24gPT09IC0xID8gc2Vzc2lvblN0b3JhZ2UgOiBsb2NhbFN0b3JhZ2UpLmdldEl0ZW0oJ0RhdGFUYWJsZXNfJyArIHNldHRpbmdzLnNJbnN0YW5jZSArICdfJyArIGxvY2F0aW9uLnBhdGhuYW1lKSk7XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH0sXG4gICAgXCJmblN0YXRlTG9hZFBhcmFtc1wiOiBudWxsLFxuICAgIFwiZm5TdGF0ZUxvYWRlZFwiOiBudWxsLFxuICAgIFwiZm5TdGF0ZVNhdmVDYWxsYmFja1wiOiBmdW5jdGlvbiBmblN0YXRlU2F2ZUNhbGxiYWNrKHNldHRpbmdzLCBkYXRhKSB7XG4gICAgICB0cnkge1xuICAgICAgICAoc2V0dGluZ3MuaVN0YXRlRHVyYXRpb24gPT09IC0xID8gc2Vzc2lvblN0b3JhZ2UgOiBsb2NhbFN0b3JhZ2UpLnNldEl0ZW0oJ0RhdGFUYWJsZXNfJyArIHNldHRpbmdzLnNJbnN0YW5jZSArICdfJyArIGxvY2F0aW9uLnBhdGhuYW1lLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH0sXG4gICAgXCJmblN0YXRlU2F2ZVBhcmFtc1wiOiBudWxsLFxuICAgIFwiaVN0YXRlRHVyYXRpb25cIjogNzIwMCxcbiAgICBcImlEZWZlckxvYWRpbmdcIjogbnVsbCxcbiAgICBcImlEaXNwbGF5TGVuZ3RoXCI6IDEwLFxuICAgIFwiaURpc3BsYXlTdGFydFwiOiAwLFxuICAgIFwiaVRhYkluZGV4XCI6IDAsXG4gICAgXCJvQ2xhc3Nlc1wiOiB7fSxcbiAgICBcIm9MYW5ndWFnZVwiOiB7XG4gICAgICBcIm9BcmlhXCI6IHtcbiAgICAgICAgXCJzU29ydEFzY2VuZGluZ1wiOiBcIjogYWN0aXZhdGUgdG8gc29ydCBjb2x1bW4gYXNjZW5kaW5nXCIsXG4gICAgICAgIFwic1NvcnREZXNjZW5kaW5nXCI6IFwiOiBhY3RpdmF0ZSB0byBzb3J0IGNvbHVtbiBkZXNjZW5kaW5nXCJcbiAgICAgIH0sXG4gICAgICBcIm9QYWdpbmF0ZVwiOiB7XG4gICAgICAgIFwic0ZpcnN0XCI6IFwiRmlyc3RcIixcbiAgICAgICAgXCJzTGFzdFwiOiBcIkxhc3RcIixcbiAgICAgICAgXCJzTmV4dFwiOiBcIk5leHRcIixcbiAgICAgICAgXCJzUHJldmlvdXNcIjogXCJQcmV2aW91c1wiXG4gICAgICB9LFxuICAgICAgXCJzRW1wdHlUYWJsZVwiOiBcIk5vIGRhdGEgYXZhaWxhYmxlIGluIHRhYmxlXCIsXG4gICAgICBcInNJbmZvXCI6IFwiU2hvd2luZyBfU1RBUlRfIHRvIF9FTkRfIG9mIF9UT1RBTF8gZW50cmllc1wiLFxuICAgICAgXCJzSW5mb0VtcHR5XCI6IFwiU2hvd2luZyAwIHRvIDAgb2YgMCBlbnRyaWVzXCIsXG4gICAgICBcInNJbmZvRmlsdGVyZWRcIjogXCIoZmlsdGVyZWQgZnJvbSBfTUFYXyB0b3RhbCBlbnRyaWVzKVwiLFxuICAgICAgXCJzSW5mb1Bvc3RGaXhcIjogXCJcIixcbiAgICAgIFwic0RlY2ltYWxcIjogXCJcIixcbiAgICAgIFwic1Rob3VzYW5kc1wiOiBcIixcIixcbiAgICAgIFwic0xlbmd0aE1lbnVcIjogXCJTaG93IF9NRU5VXyBlbnRyaWVzXCIsXG4gICAgICBcInNMb2FkaW5nUmVjb3Jkc1wiOiBcIkxvYWRpbmcuLi5cIixcbiAgICAgIFwic1Byb2Nlc3NpbmdcIjogXCJQcm9jZXNzaW5nLi4uXCIsXG4gICAgICBcInNTZWFyY2hcIjogXCJTZWFyY2g6XCIsXG4gICAgICBcInNTZWFyY2hQbGFjZWhvbGRlclwiOiBcIlwiLFxuICAgICAgXCJzVXJsXCI6IFwiXCIsXG4gICAgICBcInNaZXJvUmVjb3Jkc1wiOiBcIk5vIG1hdGNoaW5nIHJlY29yZHMgZm91bmRcIlxuICAgIH0sXG4gICAgXCJvU2VhcmNoXCI6ICQuZXh0ZW5kKHt9LCBEYXRhVGFibGUubW9kZWxzLm9TZWFyY2gpLFxuICAgIFwic0FqYXhEYXRhUHJvcFwiOiBcImRhdGFcIixcbiAgICBcInNBamF4U291cmNlXCI6IG51bGwsXG4gICAgXCJzRG9tXCI6IFwibGZydGlwXCIsXG4gICAgXCJzZWFyY2hEZWxheVwiOiBudWxsLFxuICAgIFwic1BhZ2luYXRpb25UeXBlXCI6IFwic2ltcGxlX251bWJlcnNcIixcbiAgICBcInNTY3JvbGxYXCI6IFwiXCIsXG4gICAgXCJzU2Nyb2xsWElubmVyXCI6IFwiXCIsXG4gICAgXCJzU2Nyb2xsWVwiOiBcIlwiLFxuICAgIFwic1NlcnZlck1ldGhvZFwiOiBcIkdFVFwiLFxuICAgIFwicmVuZGVyZXJcIjogbnVsbCxcbiAgICBcInJvd0lkXCI6IFwiRFRfUm93SWRcIlxuICB9O1xuXG4gIF9mbkh1bmdhcmlhbk1hcChEYXRhVGFibGUuZGVmYXVsdHMpO1xuXG4gIERhdGFUYWJsZS5kZWZhdWx0cy5jb2x1bW4gPSB7XG4gICAgXCJhRGF0YVNvcnRcIjogbnVsbCxcbiAgICBcImlEYXRhU29ydFwiOiAtMSxcbiAgICBcImFzU29ydGluZ1wiOiBbJ2FzYycsICdkZXNjJ10sXG4gICAgXCJiU2VhcmNoYWJsZVwiOiB0cnVlLFxuICAgIFwiYlNvcnRhYmxlXCI6IHRydWUsXG4gICAgXCJiVmlzaWJsZVwiOiB0cnVlLFxuICAgIFwiZm5DcmVhdGVkQ2VsbFwiOiBudWxsLFxuICAgIFwibURhdGFcIjogbnVsbCxcbiAgICBcIm1SZW5kZXJcIjogbnVsbCxcbiAgICBcInNDZWxsVHlwZVwiOiBcInRkXCIsXG4gICAgXCJzQ2xhc3NcIjogXCJcIixcbiAgICBcInNDb250ZW50UGFkZGluZ1wiOiBcIlwiLFxuICAgIFwic0RlZmF1bHRDb250ZW50XCI6IG51bGwsXG4gICAgXCJzTmFtZVwiOiBcIlwiLFxuICAgIFwic1NvcnREYXRhVHlwZVwiOiBcInN0ZFwiLFxuICAgIFwic1RpdGxlXCI6IG51bGwsXG4gICAgXCJzVHlwZVwiOiBudWxsLFxuICAgIFwic1dpZHRoXCI6IG51bGxcbiAgfTtcblxuICBfZm5IdW5nYXJpYW5NYXAoRGF0YVRhYmxlLmRlZmF1bHRzLmNvbHVtbik7XG5cbiAgRGF0YVRhYmxlLm1vZGVscy5vU2V0dGluZ3MgPSB7XG4gICAgXCJvRmVhdHVyZXNcIjoge1xuICAgICAgXCJiQXV0b1dpZHRoXCI6IG51bGwsXG4gICAgICBcImJEZWZlclJlbmRlclwiOiBudWxsLFxuICAgICAgXCJiRmlsdGVyXCI6IG51bGwsXG4gICAgICBcImJJbmZvXCI6IG51bGwsXG4gICAgICBcImJMZW5ndGhDaGFuZ2VcIjogbnVsbCxcbiAgICAgIFwiYlBhZ2luYXRlXCI6IG51bGwsXG4gICAgICBcImJQcm9jZXNzaW5nXCI6IG51bGwsXG4gICAgICBcImJTZXJ2ZXJTaWRlXCI6IG51bGwsXG4gICAgICBcImJTb3J0XCI6IG51bGwsXG4gICAgICBcImJTb3J0TXVsdGlcIjogbnVsbCxcbiAgICAgIFwiYlNvcnRDbGFzc2VzXCI6IG51bGwsXG4gICAgICBcImJTdGF0ZVNhdmVcIjogbnVsbFxuICAgIH0sXG4gICAgXCJvU2Nyb2xsXCI6IHtcbiAgICAgIFwiYkNvbGxhcHNlXCI6IG51bGwsXG4gICAgICBcImlCYXJXaWR0aFwiOiAwLFxuICAgICAgXCJzWFwiOiBudWxsLFxuICAgICAgXCJzWElubmVyXCI6IG51bGwsXG4gICAgICBcInNZXCI6IG51bGxcbiAgICB9LFxuICAgIFwib0xhbmd1YWdlXCI6IHtcbiAgICAgIFwiZm5JbmZvQ2FsbGJhY2tcIjogbnVsbFxuICAgIH0sXG4gICAgXCJvQnJvd3NlclwiOiB7XG4gICAgICBcImJTY3JvbGxPdmVyc2l6ZVwiOiBmYWxzZSxcbiAgICAgIFwiYlNjcm9sbGJhckxlZnRcIjogZmFsc2UsXG4gICAgICBcImJCb3VuZGluZ1wiOiBmYWxzZSxcbiAgICAgIFwiYmFyV2lkdGhcIjogMFxuICAgIH0sXG4gICAgXCJhamF4XCI6IG51bGwsXG4gICAgXCJhYW5GZWF0dXJlc1wiOiBbXSxcbiAgICBcImFvRGF0YVwiOiBbXSxcbiAgICBcImFpRGlzcGxheVwiOiBbXSxcbiAgICBcImFpRGlzcGxheU1hc3RlclwiOiBbXSxcbiAgICBcImFJZHNcIjoge30sXG4gICAgXCJhb0NvbHVtbnNcIjogW10sXG4gICAgXCJhb0hlYWRlclwiOiBbXSxcbiAgICBcImFvRm9vdGVyXCI6IFtdLFxuICAgIFwib1ByZXZpb3VzU2VhcmNoXCI6IHt9LFxuICAgIFwiYW9QcmVTZWFyY2hDb2xzXCI6IFtdLFxuICAgIFwiYWFTb3J0aW5nXCI6IG51bGwsXG4gICAgXCJhYVNvcnRpbmdGaXhlZFwiOiBbXSxcbiAgICBcImFzU3RyaXBlQ2xhc3Nlc1wiOiBudWxsLFxuICAgIFwiYXNEZXN0cm95U3RyaXBlc1wiOiBbXSxcbiAgICBcInNEZXN0cm95V2lkdGhcIjogMCxcbiAgICBcImFvUm93Q2FsbGJhY2tcIjogW10sXG4gICAgXCJhb0hlYWRlckNhbGxiYWNrXCI6IFtdLFxuICAgIFwiYW9Gb290ZXJDYWxsYmFja1wiOiBbXSxcbiAgICBcImFvRHJhd0NhbGxiYWNrXCI6IFtdLFxuICAgIFwiYW9Sb3dDcmVhdGVkQ2FsbGJhY2tcIjogW10sXG4gICAgXCJhb1ByZURyYXdDYWxsYmFja1wiOiBbXSxcbiAgICBcImFvSW5pdENvbXBsZXRlXCI6IFtdLFxuICAgIFwiYW9TdGF0ZVNhdmVQYXJhbXNcIjogW10sXG4gICAgXCJhb1N0YXRlTG9hZFBhcmFtc1wiOiBbXSxcbiAgICBcImFvU3RhdGVMb2FkZWRcIjogW10sXG4gICAgXCJzVGFibGVJZFwiOiBcIlwiLFxuICAgIFwiblRhYmxlXCI6IG51bGwsXG4gICAgXCJuVEhlYWRcIjogbnVsbCxcbiAgICBcIm5URm9vdFwiOiBudWxsLFxuICAgIFwiblRCb2R5XCI6IG51bGwsXG4gICAgXCJuVGFibGVXcmFwcGVyXCI6IG51bGwsXG4gICAgXCJiRGVmZXJMb2FkaW5nXCI6IGZhbHNlLFxuICAgIFwiYkluaXRpYWxpc2VkXCI6IGZhbHNlLFxuICAgIFwiYW9PcGVuUm93c1wiOiBbXSxcbiAgICBcInNEb21cIjogbnVsbCxcbiAgICBcInNlYXJjaERlbGF5XCI6IG51bGwsXG4gICAgXCJzUGFnaW5hdGlvblR5cGVcIjogXCJ0d29fYnV0dG9uXCIsXG4gICAgXCJpU3RhdGVEdXJhdGlvblwiOiAwLFxuICAgIFwiYW9TdGF0ZVNhdmVcIjogW10sXG4gICAgXCJhb1N0YXRlTG9hZFwiOiBbXSxcbiAgICBcIm9TYXZlZFN0YXRlXCI6IG51bGwsXG4gICAgXCJvTG9hZGVkU3RhdGVcIjogbnVsbCxcbiAgICBcInNBamF4U291cmNlXCI6IG51bGwsXG4gICAgXCJzQWpheERhdGFQcm9wXCI6IG51bGwsXG4gICAgXCJiQWpheERhdGFHZXRcIjogdHJ1ZSxcbiAgICBcImpxWEhSXCI6IG51bGwsXG4gICAgXCJqc29uXCI6IHVuZGVmaW5lZCxcbiAgICBcIm9BamF4RGF0YVwiOiB1bmRlZmluZWQsXG4gICAgXCJmblNlcnZlckRhdGFcIjogbnVsbCxcbiAgICBcImFvU2VydmVyUGFyYW1zXCI6IFtdLFxuICAgIFwic1NlcnZlck1ldGhvZFwiOiBudWxsLFxuICAgIFwiZm5Gb3JtYXROdW1iZXJcIjogbnVsbCxcbiAgICBcImFMZW5ndGhNZW51XCI6IG51bGwsXG4gICAgXCJpRHJhd1wiOiAwLFxuICAgIFwiYkRyYXdpbmdcIjogZmFsc2UsXG4gICAgXCJpRHJhd0Vycm9yXCI6IC0xLFxuICAgIFwiX2lEaXNwbGF5TGVuZ3RoXCI6IDEwLFxuICAgIFwiX2lEaXNwbGF5U3RhcnRcIjogMCxcbiAgICBcIl9pUmVjb3Jkc1RvdGFsXCI6IDAsXG4gICAgXCJfaVJlY29yZHNEaXNwbGF5XCI6IDAsXG4gICAgXCJvQ2xhc3Nlc1wiOiB7fSxcbiAgICBcImJGaWx0ZXJlZFwiOiBmYWxzZSxcbiAgICBcImJTb3J0ZWRcIjogZmFsc2UsXG4gICAgXCJiU29ydENlbGxzVG9wXCI6IG51bGwsXG4gICAgXCJvSW5pdFwiOiBudWxsLFxuICAgIFwiYW9EZXN0cm95Q2FsbGJhY2tcIjogW10sXG4gICAgXCJmblJlY29yZHNUb3RhbFwiOiBmdW5jdGlvbiBmblJlY29yZHNUb3RhbCgpIHtcbiAgICAgIHJldHVybiBfZm5EYXRhU291cmNlKHRoaXMpID09ICdzc3AnID8gdGhpcy5faVJlY29yZHNUb3RhbCAqIDEgOiB0aGlzLmFpRGlzcGxheU1hc3Rlci5sZW5ndGg7XG4gICAgfSxcbiAgICBcImZuUmVjb3Jkc0Rpc3BsYXlcIjogZnVuY3Rpb24gZm5SZWNvcmRzRGlzcGxheSgpIHtcbiAgICAgIHJldHVybiBfZm5EYXRhU291cmNlKHRoaXMpID09ICdzc3AnID8gdGhpcy5faVJlY29yZHNEaXNwbGF5ICogMSA6IHRoaXMuYWlEaXNwbGF5Lmxlbmd0aDtcbiAgICB9LFxuICAgIFwiZm5EaXNwbGF5RW5kXCI6IGZ1bmN0aW9uIGZuRGlzcGxheUVuZCgpIHtcbiAgICAgIHZhciBsZW4gPSB0aGlzLl9pRGlzcGxheUxlbmd0aCxcbiAgICAgICAgICBzdGFydCA9IHRoaXMuX2lEaXNwbGF5U3RhcnQsXG4gICAgICAgICAgY2FsYyA9IHN0YXJ0ICsgbGVuLFxuICAgICAgICAgIHJlY29yZHMgPSB0aGlzLmFpRGlzcGxheS5sZW5ndGgsXG4gICAgICAgICAgZmVhdHVyZXMgPSB0aGlzLm9GZWF0dXJlcyxcbiAgICAgICAgICBwYWdpbmF0ZSA9IGZlYXR1cmVzLmJQYWdpbmF0ZTtcblxuICAgICAgaWYgKGZlYXR1cmVzLmJTZXJ2ZXJTaWRlKSB7XG4gICAgICAgIHJldHVybiBwYWdpbmF0ZSA9PT0gZmFsc2UgfHwgbGVuID09PSAtMSA/IHN0YXJ0ICsgcmVjb3JkcyA6IE1hdGgubWluKHN0YXJ0ICsgbGVuLCB0aGlzLl9pUmVjb3Jkc0Rpc3BsYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICFwYWdpbmF0ZSB8fCBjYWxjID4gcmVjb3JkcyB8fCBsZW4gPT09IC0xID8gcmVjb3JkcyA6IGNhbGM7XG4gICAgICB9XG4gICAgfSxcbiAgICBcIm9JbnN0YW5jZVwiOiBudWxsLFxuICAgIFwic0luc3RhbmNlXCI6IG51bGwsXG4gICAgXCJpVGFiSW5kZXhcIjogMCxcbiAgICBcIm5TY3JvbGxIZWFkXCI6IG51bGwsXG4gICAgXCJuU2Nyb2xsRm9vdFwiOiBudWxsLFxuICAgIFwiYUxhc3RTb3J0XCI6IFtdLFxuICAgIFwib1BsdWdpbnNcIjoge30sXG4gICAgXCJyb3dJZEZuXCI6IG51bGwsXG4gICAgXCJyb3dJZFwiOiBudWxsXG4gIH07XG4gIERhdGFUYWJsZS5leHQgPSBfZXh0ID0ge1xuICAgIGJ1dHRvbnM6IHt9LFxuICAgIGNsYXNzZXM6IHt9LFxuICAgIGJ1aWxkOiBcImR0L2R0LTEuMTAuMThcIixcbiAgICBlcnJNb2RlOiBcImFsZXJ0XCIsXG4gICAgZmVhdHVyZTogW10sXG4gICAgc2VhcmNoOiBbXSxcbiAgICBzZWxlY3Rvcjoge1xuICAgICAgY2VsbDogW10sXG4gICAgICBjb2x1bW46IFtdLFxuICAgICAgcm93OiBbXVxuICAgIH0sXG4gICAgaW50ZXJuYWw6IHt9LFxuICAgIGxlZ2FjeToge1xuICAgICAgYWpheDogbnVsbFxuICAgIH0sXG4gICAgcGFnZXI6IHt9LFxuICAgIHJlbmRlcmVyOiB7XG4gICAgICBwYWdlQnV0dG9uOiB7fSxcbiAgICAgIGhlYWRlcjoge31cbiAgICB9LFxuICAgIG9yZGVyOiB7fSxcbiAgICB0eXBlOiB7XG4gICAgICBkZXRlY3Q6IFtdLFxuICAgICAgc2VhcmNoOiB7fSxcbiAgICAgIG9yZGVyOiB7fVxuICAgIH0sXG4gICAgX3VuaXF1ZTogMCxcbiAgICBmblZlcnNpb25DaGVjazogRGF0YVRhYmxlLmZuVmVyc2lvbkNoZWNrLFxuICAgIGlBcGlJbmRleDogMCxcbiAgICBvSlVJQ2xhc3Nlczoge30sXG4gICAgc1ZlcnNpb246IERhdGFUYWJsZS52ZXJzaW9uXG4gIH07XG4gICQuZXh0ZW5kKF9leHQsIHtcbiAgICBhZm5GaWx0ZXJpbmc6IF9leHQuc2VhcmNoLFxuICAgIGFUeXBlczogX2V4dC50eXBlLmRldGVjdCxcbiAgICBvZm5TZWFyY2g6IF9leHQudHlwZS5zZWFyY2gsXG4gICAgb1NvcnQ6IF9leHQudHlwZS5vcmRlcixcbiAgICBhZm5Tb3J0RGF0YTogX2V4dC5vcmRlcixcbiAgICBhb0ZlYXR1cmVzOiBfZXh0LmZlYXR1cmUsXG4gICAgb0FwaTogX2V4dC5pbnRlcm5hbCxcbiAgICBvU3RkQ2xhc3NlczogX2V4dC5jbGFzc2VzLFxuICAgIG9QYWdpbmF0aW9uOiBfZXh0LnBhZ2VyXG4gIH0pO1xuICAkLmV4dGVuZChEYXRhVGFibGUuZXh0LmNsYXNzZXMsIHtcbiAgICBcInNUYWJsZVwiOiBcImRhdGFUYWJsZVwiLFxuICAgIFwic05vRm9vdGVyXCI6IFwibm8tZm9vdGVyXCIsXG4gICAgXCJzUGFnZUJ1dHRvblwiOiBcInBhZ2luYXRlX2J1dHRvblwiLFxuICAgIFwic1BhZ2VCdXR0b25BY3RpdmVcIjogXCJjdXJyZW50XCIsXG4gICAgXCJzUGFnZUJ1dHRvbkRpc2FibGVkXCI6IFwiZGlzYWJsZWRcIixcbiAgICBcInNTdHJpcGVPZGRcIjogXCJvZGRcIixcbiAgICBcInNTdHJpcGVFdmVuXCI6IFwiZXZlblwiLFxuICAgIFwic1Jvd0VtcHR5XCI6IFwiZGF0YVRhYmxlc19lbXB0eVwiLFxuICAgIFwic1dyYXBwZXJcIjogXCJkYXRhVGFibGVzX3dyYXBwZXJcIixcbiAgICBcInNGaWx0ZXJcIjogXCJkYXRhVGFibGVzX2ZpbHRlclwiLFxuICAgIFwic0luZm9cIjogXCJkYXRhVGFibGVzX2luZm9cIixcbiAgICBcInNQYWdpbmdcIjogXCJkYXRhVGFibGVzX3BhZ2luYXRlIHBhZ2luZ19cIixcbiAgICBcInNMZW5ndGhcIjogXCJkYXRhVGFibGVzX2xlbmd0aFwiLFxuICAgIFwic1Byb2Nlc3NpbmdcIjogXCJkYXRhVGFibGVzX3Byb2Nlc3NpbmdcIixcbiAgICBcInNTb3J0QXNjXCI6IFwic29ydGluZ19hc2NcIixcbiAgICBcInNTb3J0RGVzY1wiOiBcInNvcnRpbmdfZGVzY1wiLFxuICAgIFwic1NvcnRhYmxlXCI6IFwic29ydGluZ1wiLFxuICAgIFwic1NvcnRhYmxlQXNjXCI6IFwic29ydGluZ19hc2NfZGlzYWJsZWRcIixcbiAgICBcInNTb3J0YWJsZURlc2NcIjogXCJzb3J0aW5nX2Rlc2NfZGlzYWJsZWRcIixcbiAgICBcInNTb3J0YWJsZU5vbmVcIjogXCJzb3J0aW5nX2Rpc2FibGVkXCIsXG4gICAgXCJzU29ydENvbHVtblwiOiBcInNvcnRpbmdfXCIsXG4gICAgXCJzRmlsdGVySW5wdXRcIjogXCJcIixcbiAgICBcInNMZW5ndGhTZWxlY3RcIjogXCJcIixcbiAgICBcInNTY3JvbGxXcmFwcGVyXCI6IFwiZGF0YVRhYmxlc19zY3JvbGxcIixcbiAgICBcInNTY3JvbGxIZWFkXCI6IFwiZGF0YVRhYmxlc19zY3JvbGxIZWFkXCIsXG4gICAgXCJzU2Nyb2xsSGVhZElubmVyXCI6IFwiZGF0YVRhYmxlc19zY3JvbGxIZWFkSW5uZXJcIixcbiAgICBcInNTY3JvbGxCb2R5XCI6IFwiZGF0YVRhYmxlc19zY3JvbGxCb2R5XCIsXG4gICAgXCJzU2Nyb2xsRm9vdFwiOiBcImRhdGFUYWJsZXNfc2Nyb2xsRm9vdFwiLFxuICAgIFwic1Njcm9sbEZvb3RJbm5lclwiOiBcImRhdGFUYWJsZXNfc2Nyb2xsRm9vdElubmVyXCIsXG4gICAgXCJzSGVhZGVyVEhcIjogXCJcIixcbiAgICBcInNGb290ZXJUSFwiOiBcIlwiLFxuICAgIFwic1NvcnRKVUlBc2NcIjogXCJcIixcbiAgICBcInNTb3J0SlVJRGVzY1wiOiBcIlwiLFxuICAgIFwic1NvcnRKVUlcIjogXCJcIixcbiAgICBcInNTb3J0SlVJQXNjQWxsb3dlZFwiOiBcIlwiLFxuICAgIFwic1NvcnRKVUlEZXNjQWxsb3dlZFwiOiBcIlwiLFxuICAgIFwic1NvcnRKVUlXcmFwcGVyXCI6IFwiXCIsXG4gICAgXCJzU29ydEljb25cIjogXCJcIixcbiAgICBcInNKVUlIZWFkZXJcIjogXCJcIixcbiAgICBcInNKVUlGb290ZXJcIjogXCJcIlxuICB9KTtcbiAgdmFyIGV4dFBhZ2luYXRpb24gPSBEYXRhVGFibGUuZXh0LnBhZ2VyO1xuXG4gIGZ1bmN0aW9uIF9udW1iZXJzKHBhZ2UsIHBhZ2VzKSB7XG4gICAgdmFyIG51bWJlcnMgPSBbXSxcbiAgICAgICAgYnV0dG9ucyA9IGV4dFBhZ2luYXRpb24ubnVtYmVyc19sZW5ndGgsXG4gICAgICAgIGhhbGYgPSBNYXRoLmZsb29yKGJ1dHRvbnMgLyAyKSxcbiAgICAgICAgaSA9IDE7XG5cbiAgICBpZiAocGFnZXMgPD0gYnV0dG9ucykge1xuICAgICAgbnVtYmVycyA9IF9yYW5nZSgwLCBwYWdlcyk7XG4gICAgfSBlbHNlIGlmIChwYWdlIDw9IGhhbGYpIHtcbiAgICAgIG51bWJlcnMgPSBfcmFuZ2UoMCwgYnV0dG9ucyAtIDIpO1xuICAgICAgbnVtYmVycy5wdXNoKCdlbGxpcHNpcycpO1xuICAgICAgbnVtYmVycy5wdXNoKHBhZ2VzIC0gMSk7XG4gICAgfSBlbHNlIGlmIChwYWdlID49IHBhZ2VzIC0gMSAtIGhhbGYpIHtcbiAgICAgIG51bWJlcnMgPSBfcmFuZ2UocGFnZXMgLSAoYnV0dG9ucyAtIDIpLCBwYWdlcyk7XG4gICAgICBudW1iZXJzLnNwbGljZSgwLCAwLCAnZWxsaXBzaXMnKTtcbiAgICAgIG51bWJlcnMuc3BsaWNlKDAsIDAsIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBudW1iZXJzID0gX3JhbmdlKHBhZ2UgLSBoYWxmICsgMiwgcGFnZSArIGhhbGYgLSAxKTtcbiAgICAgIG51bWJlcnMucHVzaCgnZWxsaXBzaXMnKTtcbiAgICAgIG51bWJlcnMucHVzaChwYWdlcyAtIDEpO1xuICAgICAgbnVtYmVycy5zcGxpY2UoMCwgMCwgJ2VsbGlwc2lzJyk7XG4gICAgICBudW1iZXJzLnNwbGljZSgwLCAwLCAwKTtcbiAgICB9XG5cbiAgICBudW1iZXJzLkRUX2VsID0gJ3NwYW4nO1xuICAgIHJldHVybiBudW1iZXJzO1xuICB9XG5cbiAgJC5leHRlbmQoZXh0UGFnaW5hdGlvbiwge1xuICAgIHNpbXBsZTogZnVuY3Rpb24gc2ltcGxlKHBhZ2UsIHBhZ2VzKSB7XG4gICAgICByZXR1cm4gWydwcmV2aW91cycsICduZXh0J107XG4gICAgfSxcbiAgICBmdWxsOiBmdW5jdGlvbiBmdWxsKHBhZ2UsIHBhZ2VzKSB7XG4gICAgICByZXR1cm4gWydmaXJzdCcsICdwcmV2aW91cycsICduZXh0JywgJ2xhc3QnXTtcbiAgICB9LFxuICAgIG51bWJlcnM6IGZ1bmN0aW9uIG51bWJlcnMocGFnZSwgcGFnZXMpIHtcbiAgICAgIHJldHVybiBbX251bWJlcnMocGFnZSwgcGFnZXMpXTtcbiAgICB9LFxuICAgIHNpbXBsZV9udW1iZXJzOiBmdW5jdGlvbiBzaW1wbGVfbnVtYmVycyhwYWdlLCBwYWdlcykge1xuICAgICAgcmV0dXJuIFsncHJldmlvdXMnLCBfbnVtYmVycyhwYWdlLCBwYWdlcyksICduZXh0J107XG4gICAgfSxcbiAgICBmdWxsX251bWJlcnM6IGZ1bmN0aW9uIGZ1bGxfbnVtYmVycyhwYWdlLCBwYWdlcykge1xuICAgICAgcmV0dXJuIFsnZmlyc3QnLCAncHJldmlvdXMnLCBfbnVtYmVycyhwYWdlLCBwYWdlcyksICduZXh0JywgJ2xhc3QnXTtcbiAgICB9LFxuICAgIGZpcnN0X2xhc3RfbnVtYmVyczogZnVuY3Rpb24gZmlyc3RfbGFzdF9udW1iZXJzKHBhZ2UsIHBhZ2VzKSB7XG4gICAgICByZXR1cm4gWydmaXJzdCcsIF9udW1iZXJzKHBhZ2UsIHBhZ2VzKSwgJ2xhc3QnXTtcbiAgICB9LFxuICAgIF9udW1iZXJzOiBfbnVtYmVycyxcbiAgICBudW1iZXJzX2xlbmd0aDogN1xuICB9KTtcbiAgJC5leHRlbmQodHJ1ZSwgRGF0YVRhYmxlLmV4dC5yZW5kZXJlciwge1xuICAgIHBhZ2VCdXR0b246IHtcbiAgICAgIF86IGZ1bmN0aW9uIF8oc2V0dGluZ3MsIGhvc3QsIGlkeCwgYnV0dG9ucywgcGFnZSwgcGFnZXMpIHtcbiAgICAgICAgdmFyIGNsYXNzZXMgPSBzZXR0aW5ncy5vQ2xhc3NlcztcbiAgICAgICAgdmFyIGxhbmcgPSBzZXR0aW5ncy5vTGFuZ3VhZ2Uub1BhZ2luYXRlO1xuICAgICAgICB2YXIgYXJpYSA9IHNldHRpbmdzLm9MYW5ndWFnZS5vQXJpYS5wYWdpbmF0ZSB8fCB7fTtcbiAgICAgICAgdmFyIGJ0bkRpc3BsYXksXG4gICAgICAgICAgICBidG5DbGFzcyxcbiAgICAgICAgICAgIGNvdW50ZXIgPSAwO1xuXG4gICAgICAgIHZhciBhdHRhY2ggPSBmdW5jdGlvbiBhdHRhY2goY29udGFpbmVyLCBidXR0b25zKSB7XG4gICAgICAgICAgdmFyIGksIGllbiwgbm9kZSwgYnV0dG9uO1xuXG4gICAgICAgICAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIGNsaWNrSGFuZGxlcihlKSB7XG4gICAgICAgICAgICBfZm5QYWdlQ2hhbmdlKHNldHRpbmdzLCBlLmRhdGEuYWN0aW9uLCB0cnVlKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgZm9yIChpID0gMCwgaWVuID0gYnV0dG9ucy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgICAgYnV0dG9uID0gYnV0dG9uc1tpXTtcblxuICAgICAgICAgICAgaWYgKCQuaXNBcnJheShidXR0b24pKSB7XG4gICAgICAgICAgICAgIHZhciBpbm5lciA9ICQoJzwnICsgKGJ1dHRvbi5EVF9lbCB8fCAnZGl2JykgKyAnLz4nKS5hcHBlbmRUbyhjb250YWluZXIpO1xuICAgICAgICAgICAgICBhdHRhY2goaW5uZXIsIGJ1dHRvbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBidG5EaXNwbGF5ID0gbnVsbDtcbiAgICAgICAgICAgICAgYnRuQ2xhc3MgPSAnJztcblxuICAgICAgICAgICAgICBzd2l0Y2ggKGJ1dHRvbikge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2VsbGlwc2lzJzpcbiAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmQoJzxzcGFuIGNsYXNzPVwiZWxsaXBzaXNcIj4mI3gyMDI2Ozwvc3Bhbj4nKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZmlyc3QnOlxuICAgICAgICAgICAgICAgICAgYnRuRGlzcGxheSA9IGxhbmcuc0ZpcnN0O1xuICAgICAgICAgICAgICAgICAgYnRuQ2xhc3MgPSBidXR0b24gKyAocGFnZSA+IDAgPyAnJyA6ICcgJyArIGNsYXNzZXMuc1BhZ2VCdXR0b25EaXNhYmxlZCk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3ByZXZpb3VzJzpcbiAgICAgICAgICAgICAgICAgIGJ0bkRpc3BsYXkgPSBsYW5nLnNQcmV2aW91cztcbiAgICAgICAgICAgICAgICAgIGJ0bkNsYXNzID0gYnV0dG9uICsgKHBhZ2UgPiAwID8gJycgOiAnICcgKyBjbGFzc2VzLnNQYWdlQnV0dG9uRGlzYWJsZWQpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICduZXh0JzpcbiAgICAgICAgICAgICAgICAgIGJ0bkRpc3BsYXkgPSBsYW5nLnNOZXh0O1xuICAgICAgICAgICAgICAgICAgYnRuQ2xhc3MgPSBidXR0b24gKyAocGFnZSA8IHBhZ2VzIC0gMSA/ICcnIDogJyAnICsgY2xhc3Nlcy5zUGFnZUJ1dHRvbkRpc2FibGVkKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbGFzdCc6XG4gICAgICAgICAgICAgICAgICBidG5EaXNwbGF5ID0gbGFuZy5zTGFzdDtcbiAgICAgICAgICAgICAgICAgIGJ0bkNsYXNzID0gYnV0dG9uICsgKHBhZ2UgPCBwYWdlcyAtIDEgPyAnJyA6ICcgJyArIGNsYXNzZXMuc1BhZ2VCdXR0b25EaXNhYmxlZCk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICBidG5EaXNwbGF5ID0gYnV0dG9uICsgMTtcbiAgICAgICAgICAgICAgICAgIGJ0bkNsYXNzID0gcGFnZSA9PT0gYnV0dG9uID8gY2xhc3Nlcy5zUGFnZUJ1dHRvbkFjdGl2ZSA6ICcnO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoYnRuRGlzcGxheSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSAkKCc8YT4nLCB7XG4gICAgICAgICAgICAgICAgICAnY2xhc3MnOiBjbGFzc2VzLnNQYWdlQnV0dG9uICsgJyAnICsgYnRuQ2xhc3MsXG4gICAgICAgICAgICAgICAgICAnYXJpYS1jb250cm9scyc6IHNldHRpbmdzLnNUYWJsZUlkLFxuICAgICAgICAgICAgICAgICAgJ2FyaWEtbGFiZWwnOiBhcmlhW2J1dHRvbl0sXG4gICAgICAgICAgICAgICAgICAnZGF0YS1kdC1pZHgnOiBjb3VudGVyLFxuICAgICAgICAgICAgICAgICAgJ3RhYmluZGV4Jzogc2V0dGluZ3MuaVRhYkluZGV4LFxuICAgICAgICAgICAgICAgICAgJ2lkJzogaWR4ID09PSAwICYmIHR5cGVvZiBidXR0b24gPT09ICdzdHJpbmcnID8gc2V0dGluZ3Muc1RhYmxlSWQgKyAnXycgKyBidXR0b24gOiBudWxsXG4gICAgICAgICAgICAgICAgfSkuaHRtbChidG5EaXNwbGF5KS5hcHBlbmRUbyhjb250YWluZXIpO1xuXG4gICAgICAgICAgICAgICAgX2ZuQmluZEFjdGlvbihub2RlLCB7XG4gICAgICAgICAgICAgICAgICBhY3Rpb246IGJ1dHRvblxuICAgICAgICAgICAgICAgIH0sIGNsaWNrSGFuZGxlcik7XG5cbiAgICAgICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGFjdGl2ZUVsO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYWN0aXZlRWwgPSAkKGhvc3QpLmZpbmQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuZGF0YSgnZHQtaWR4Jyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICAgICAgYXR0YWNoKCQoaG9zdCkuZW1wdHkoKSwgYnV0dG9ucyk7XG5cbiAgICAgICAgaWYgKGFjdGl2ZUVsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAkKGhvc3QpLmZpbmQoJ1tkYXRhLWR0LWlkeD0nICsgYWN0aXZlRWwgKyAnXScpLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICAkLmV4dGVuZChEYXRhVGFibGUuZXh0LnR5cGUuZGV0ZWN0LCBbZnVuY3Rpb24gKGQsIHNldHRpbmdzKSB7XG4gICAgdmFyIGRlY2ltYWwgPSBzZXR0aW5ncy5vTGFuZ3VhZ2Uuc0RlY2ltYWw7XG4gICAgcmV0dXJuIF9pc051bWJlcihkLCBkZWNpbWFsKSA/ICdudW0nICsgZGVjaW1hbCA6IG51bGw7XG4gIH0sIGZ1bmN0aW9uIChkLCBzZXR0aW5ncykge1xuICAgIGlmIChkICYmICEoZCBpbnN0YW5jZW9mIERhdGUpICYmICFfcmVfZGF0ZS50ZXN0KGQpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgcGFyc2VkID0gRGF0ZS5wYXJzZShkKTtcbiAgICByZXR1cm4gcGFyc2VkICE9PSBudWxsICYmICFpc05hTihwYXJzZWQpIHx8IF9lbXB0eShkKSA/ICdkYXRlJyA6IG51bGw7XG4gIH0sIGZ1bmN0aW9uIChkLCBzZXR0aW5ncykge1xuICAgIHZhciBkZWNpbWFsID0gc2V0dGluZ3Mub0xhbmd1YWdlLnNEZWNpbWFsO1xuICAgIHJldHVybiBfaXNOdW1iZXIoZCwgZGVjaW1hbCwgdHJ1ZSkgPyAnbnVtLWZtdCcgKyBkZWNpbWFsIDogbnVsbDtcbiAgfSwgZnVuY3Rpb24gKGQsIHNldHRpbmdzKSB7XG4gICAgdmFyIGRlY2ltYWwgPSBzZXR0aW5ncy5vTGFuZ3VhZ2Uuc0RlY2ltYWw7XG4gICAgcmV0dXJuIF9odG1sTnVtZXJpYyhkLCBkZWNpbWFsKSA/ICdodG1sLW51bScgKyBkZWNpbWFsIDogbnVsbDtcbiAgfSwgZnVuY3Rpb24gKGQsIHNldHRpbmdzKSB7XG4gICAgdmFyIGRlY2ltYWwgPSBzZXR0aW5ncy5vTGFuZ3VhZ2Uuc0RlY2ltYWw7XG4gICAgcmV0dXJuIF9odG1sTnVtZXJpYyhkLCBkZWNpbWFsLCB0cnVlKSA/ICdodG1sLW51bS1mbXQnICsgZGVjaW1hbCA6IG51bGw7XG4gIH0sIGZ1bmN0aW9uIChkLCBzZXR0aW5ncykge1xuICAgIHJldHVybiBfZW1wdHkoZCkgfHwgdHlwZW9mIGQgPT09ICdzdHJpbmcnICYmIGQuaW5kZXhPZignPCcpICE9PSAtMSA/ICdodG1sJyA6IG51bGw7XG4gIH1dKTtcbiAgJC5leHRlbmQoRGF0YVRhYmxlLmV4dC50eXBlLnNlYXJjaCwge1xuICAgIGh0bWw6IGZ1bmN0aW9uIGh0bWwoZGF0YSkge1xuICAgICAgcmV0dXJuIF9lbXB0eShkYXRhKSA/IGRhdGEgOiB0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgPyBkYXRhLnJlcGxhY2UoX3JlX25ld19saW5lcywgXCIgXCIpLnJlcGxhY2UoX3JlX2h0bWwsIFwiXCIpIDogJyc7XG4gICAgfSxcbiAgICBzdHJpbmc6IGZ1bmN0aW9uIHN0cmluZyhkYXRhKSB7XG4gICAgICByZXR1cm4gX2VtcHR5KGRhdGEpID8gZGF0YSA6IHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyA/IGRhdGEucmVwbGFjZShfcmVfbmV3X2xpbmVzLCBcIiBcIikgOiBkYXRhO1xuICAgIH1cbiAgfSk7XG5cbiAgdmFyIF9fbnVtZXJpY1JlcGxhY2UgPSBmdW5jdGlvbiBfX251bWVyaWNSZXBsYWNlKGQsIGRlY2ltYWxQbGFjZSwgcmUxLCByZTIpIHtcbiAgICBpZiAoZCAhPT0gMCAmJiAoIWQgfHwgZCA9PT0gJy0nKSkge1xuICAgICAgcmV0dXJuIC1JbmZpbml0eTtcbiAgICB9XG5cbiAgICBpZiAoZGVjaW1hbFBsYWNlKSB7XG4gICAgICBkID0gX251bVRvRGVjaW1hbChkLCBkZWNpbWFsUGxhY2UpO1xuICAgIH1cblxuICAgIGlmIChkLnJlcGxhY2UpIHtcbiAgICAgIGlmIChyZTEpIHtcbiAgICAgICAgZCA9IGQucmVwbGFjZShyZTEsICcnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlMikge1xuICAgICAgICBkID0gZC5yZXBsYWNlKHJlMiwgJycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkICogMTtcbiAgfTtcblxuICBmdW5jdGlvbiBfYWRkTnVtZXJpY1NvcnQoZGVjaW1hbFBsYWNlKSB7XG4gICAgJC5lYWNoKHtcbiAgICAgIFwibnVtXCI6IGZ1bmN0aW9uIG51bShkKSB7XG4gICAgICAgIHJldHVybiBfX251bWVyaWNSZXBsYWNlKGQsIGRlY2ltYWxQbGFjZSk7XG4gICAgICB9LFxuICAgICAgXCJudW0tZm10XCI6IGZ1bmN0aW9uIG51bUZtdChkKSB7XG4gICAgICAgIHJldHVybiBfX251bWVyaWNSZXBsYWNlKGQsIGRlY2ltYWxQbGFjZSwgX3JlX2Zvcm1hdHRlZF9udW1lcmljKTtcbiAgICAgIH0sXG4gICAgICBcImh0bWwtbnVtXCI6IGZ1bmN0aW9uIGh0bWxOdW0oZCkge1xuICAgICAgICByZXR1cm4gX19udW1lcmljUmVwbGFjZShkLCBkZWNpbWFsUGxhY2UsIF9yZV9odG1sKTtcbiAgICAgIH0sXG4gICAgICBcImh0bWwtbnVtLWZtdFwiOiBmdW5jdGlvbiBodG1sTnVtRm10KGQpIHtcbiAgICAgICAgcmV0dXJuIF9fbnVtZXJpY1JlcGxhY2UoZCwgZGVjaW1hbFBsYWNlLCBfcmVfaHRtbCwgX3JlX2Zvcm1hdHRlZF9udW1lcmljKTtcbiAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiAoa2V5LCBmbikge1xuICAgICAgX2V4dC50eXBlLm9yZGVyW2tleSArIGRlY2ltYWxQbGFjZSArICctcHJlJ10gPSBmbjtcblxuICAgICAgaWYgKGtleS5tYXRjaCgvXmh0bWxcXC0vKSkge1xuICAgICAgICBfZXh0LnR5cGUuc2VhcmNoW2tleSArIGRlY2ltYWxQbGFjZV0gPSBfZXh0LnR5cGUuc2VhcmNoLmh0bWw7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAkLmV4dGVuZChfZXh0LnR5cGUub3JkZXIsIHtcbiAgICBcImRhdGUtcHJlXCI6IGZ1bmN0aW9uIGRhdGVQcmUoZCkge1xuICAgICAgdmFyIHRzID0gRGF0ZS5wYXJzZShkKTtcbiAgICAgIHJldHVybiBpc05hTih0cykgPyAtSW5maW5pdHkgOiB0cztcbiAgICB9LFxuICAgIFwiaHRtbC1wcmVcIjogZnVuY3Rpb24gaHRtbFByZShhKSB7XG4gICAgICByZXR1cm4gX2VtcHR5KGEpID8gJycgOiBhLnJlcGxhY2UgPyBhLnJlcGxhY2UoLzwuKj8+L2csIFwiXCIpLnRvTG93ZXJDYXNlKCkgOiBhICsgJyc7XG4gICAgfSxcbiAgICBcInN0cmluZy1wcmVcIjogZnVuY3Rpb24gc3RyaW5nUHJlKGEpIHtcbiAgICAgIHJldHVybiBfZW1wdHkoYSkgPyAnJyA6IHR5cGVvZiBhID09PSAnc3RyaW5nJyA/IGEudG9Mb3dlckNhc2UoKSA6ICFhLnRvU3RyaW5nID8gJycgOiBhLnRvU3RyaW5nKCk7XG4gICAgfSxcbiAgICBcInN0cmluZy1hc2NcIjogZnVuY3Rpb24gc3RyaW5nQXNjKHgsIHkpIHtcbiAgICAgIHJldHVybiB4IDwgeSA/IC0xIDogeCA+IHkgPyAxIDogMDtcbiAgICB9LFxuICAgIFwic3RyaW5nLWRlc2NcIjogZnVuY3Rpb24gc3RyaW5nRGVzYyh4LCB5KSB7XG4gICAgICByZXR1cm4geCA8IHkgPyAxIDogeCA+IHkgPyAtMSA6IDA7XG4gICAgfVxuICB9KTtcblxuICBfYWRkTnVtZXJpY1NvcnQoJycpO1xuXG4gICQuZXh0ZW5kKHRydWUsIERhdGFUYWJsZS5leHQucmVuZGVyZXIsIHtcbiAgICBoZWFkZXI6IHtcbiAgICAgIF86IGZ1bmN0aW9uIF8oc2V0dGluZ3MsIGNlbGwsIGNvbHVtbiwgY2xhc3Nlcykge1xuICAgICAgICAkKHNldHRpbmdzLm5UYWJsZSkub24oJ29yZGVyLmR0LkRUJywgZnVuY3Rpb24gKGUsIGN0eCwgc29ydGluZywgY29sdW1ucykge1xuICAgICAgICAgIGlmIChzZXR0aW5ncyAhPT0gY3R4KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGNvbElkeCA9IGNvbHVtbi5pZHg7XG4gICAgICAgICAgY2VsbC5yZW1vdmVDbGFzcyhjb2x1bW4uc1NvcnRpbmdDbGFzcyArICcgJyArIGNsYXNzZXMuc1NvcnRBc2MgKyAnICcgKyBjbGFzc2VzLnNTb3J0RGVzYykuYWRkQ2xhc3MoY29sdW1uc1tjb2xJZHhdID09ICdhc2MnID8gY2xhc3Nlcy5zU29ydEFzYyA6IGNvbHVtbnNbY29sSWR4XSA9PSAnZGVzYycgPyBjbGFzc2VzLnNTb3J0RGVzYyA6IGNvbHVtbi5zU29ydGluZ0NsYXNzKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAganF1ZXJ5dWk6IGZ1bmN0aW9uIGpxdWVyeXVpKHNldHRpbmdzLCBjZWxsLCBjb2x1bW4sIGNsYXNzZXMpIHtcbiAgICAgICAgJCgnPGRpdi8+JykuYWRkQ2xhc3MoY2xhc3Nlcy5zU29ydEpVSVdyYXBwZXIpLmFwcGVuZChjZWxsLmNvbnRlbnRzKCkpLmFwcGVuZCgkKCc8c3Bhbi8+JykuYWRkQ2xhc3MoY2xhc3Nlcy5zU29ydEljb24gKyAnICcgKyBjb2x1bW4uc1NvcnRpbmdDbGFzc0pVSSkpLmFwcGVuZFRvKGNlbGwpO1xuICAgICAgICAkKHNldHRpbmdzLm5UYWJsZSkub24oJ29yZGVyLmR0LkRUJywgZnVuY3Rpb24gKGUsIGN0eCwgc29ydGluZywgY29sdW1ucykge1xuICAgICAgICAgIGlmIChzZXR0aW5ncyAhPT0gY3R4KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGNvbElkeCA9IGNvbHVtbi5pZHg7XG4gICAgICAgICAgY2VsbC5yZW1vdmVDbGFzcyhjbGFzc2VzLnNTb3J0QXNjICsgXCIgXCIgKyBjbGFzc2VzLnNTb3J0RGVzYykuYWRkQ2xhc3MoY29sdW1uc1tjb2xJZHhdID09ICdhc2MnID8gY2xhc3Nlcy5zU29ydEFzYyA6IGNvbHVtbnNbY29sSWR4XSA9PSAnZGVzYycgPyBjbGFzc2VzLnNTb3J0RGVzYyA6IGNvbHVtbi5zU29ydGluZ0NsYXNzKTtcbiAgICAgICAgICBjZWxsLmZpbmQoJ3NwYW4uJyArIGNsYXNzZXMuc1NvcnRJY29uKS5yZW1vdmVDbGFzcyhjbGFzc2VzLnNTb3J0SlVJQXNjICsgXCIgXCIgKyBjbGFzc2VzLnNTb3J0SlVJRGVzYyArIFwiIFwiICsgY2xhc3Nlcy5zU29ydEpVSSArIFwiIFwiICsgY2xhc3Nlcy5zU29ydEpVSUFzY0FsbG93ZWQgKyBcIiBcIiArIGNsYXNzZXMuc1NvcnRKVUlEZXNjQWxsb3dlZCkuYWRkQ2xhc3MoY29sdW1uc1tjb2xJZHhdID09ICdhc2MnID8gY2xhc3Nlcy5zU29ydEpVSUFzYyA6IGNvbHVtbnNbY29sSWR4XSA9PSAnZGVzYycgPyBjbGFzc2VzLnNTb3J0SlVJRGVzYyA6IGNvbHVtbi5zU29ydGluZ0NsYXNzSlVJKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB2YXIgX19odG1sRXNjYXBlRW50aXRpZXMgPSBmdW5jdGlvbiBfX2h0bWxFc2NhcGVFbnRpdGllcyhkKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBkID09PSAnc3RyaW5nJyA/IGQucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKS5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JykgOiBkO1xuICB9O1xuXG4gIERhdGFUYWJsZS5yZW5kZXIgPSB7XG4gICAgbnVtYmVyOiBmdW5jdGlvbiBudW1iZXIodGhvdXNhbmRzLCBkZWNpbWFsLCBwcmVjaXNpb24sIHByZWZpeCwgcG9zdGZpeCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGlzcGxheTogZnVuY3Rpb24gZGlzcGxheShkKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBkICE9PSAnbnVtYmVyJyAmJiB0eXBlb2YgZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBuZWdhdGl2ZSA9IGQgPCAwID8gJy0nIDogJyc7XG4gICAgICAgICAgdmFyIGZsbyA9IHBhcnNlRmxvYXQoZCk7XG5cbiAgICAgICAgICBpZiAoaXNOYU4oZmxvKSkge1xuICAgICAgICAgICAgcmV0dXJuIF9faHRtbEVzY2FwZUVudGl0aWVzKGQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZsbyA9IGZsby50b0ZpeGVkKHByZWNpc2lvbik7XG4gICAgICAgICAgZCA9IE1hdGguYWJzKGZsbyk7XG4gICAgICAgICAgdmFyIGludFBhcnQgPSBwYXJzZUludChkLCAxMCk7XG4gICAgICAgICAgdmFyIGZsb2F0UGFydCA9IHByZWNpc2lvbiA/IGRlY2ltYWwgKyAoZCAtIGludFBhcnQpLnRvRml4ZWQocHJlY2lzaW9uKS5zdWJzdHJpbmcoMikgOiAnJztcbiAgICAgICAgICByZXR1cm4gbmVnYXRpdmUgKyAocHJlZml4IHx8ICcnKSArIGludFBhcnQudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCB0aG91c2FuZHMpICsgZmxvYXRQYXJ0ICsgKHBvc3RmaXggfHwgJycpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgdGV4dDogZnVuY3Rpb24gdGV4dCgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRpc3BsYXk6IF9faHRtbEVzY2FwZUVudGl0aWVzXG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBfZm5FeHRlcm5BcGlGdW5jKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhcmdzID0gW19mblNldHRpbmdzRnJvbU5vZGUodGhpc1tEYXRhVGFibGUuZXh0LmlBcGlJbmRleF0pXS5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgICByZXR1cm4gRGF0YVRhYmxlLmV4dC5pbnRlcm5hbFtmbl0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfTtcbiAgfVxuXG4gICQuZXh0ZW5kKERhdGFUYWJsZS5leHQuaW50ZXJuYWwsIHtcbiAgICBfZm5FeHRlcm5BcGlGdW5jOiBfZm5FeHRlcm5BcGlGdW5jLFxuICAgIF9mbkJ1aWxkQWpheDogX2ZuQnVpbGRBamF4LFxuICAgIF9mbkFqYXhVcGRhdGU6IF9mbkFqYXhVcGRhdGUsXG4gICAgX2ZuQWpheFBhcmFtZXRlcnM6IF9mbkFqYXhQYXJhbWV0ZXJzLFxuICAgIF9mbkFqYXhVcGRhdGVEcmF3OiBfZm5BamF4VXBkYXRlRHJhdyxcbiAgICBfZm5BamF4RGF0YVNyYzogX2ZuQWpheERhdGFTcmMsXG4gICAgX2ZuQWRkQ29sdW1uOiBfZm5BZGRDb2x1bW4sXG4gICAgX2ZuQ29sdW1uT3B0aW9uczogX2ZuQ29sdW1uT3B0aW9ucyxcbiAgICBfZm5BZGp1c3RDb2x1bW5TaXppbmc6IF9mbkFkanVzdENvbHVtblNpemluZyxcbiAgICBfZm5WaXNpYmxlVG9Db2x1bW5JbmRleDogX2ZuVmlzaWJsZVRvQ29sdW1uSW5kZXgsXG4gICAgX2ZuQ29sdW1uSW5kZXhUb1Zpc2libGU6IF9mbkNvbHVtbkluZGV4VG9WaXNpYmxlLFxuICAgIF9mblZpc2JsZUNvbHVtbnM6IF9mblZpc2JsZUNvbHVtbnMsXG4gICAgX2ZuR2V0Q29sdW1uczogX2ZuR2V0Q29sdW1ucyxcbiAgICBfZm5Db2x1bW5UeXBlczogX2ZuQ29sdW1uVHlwZXMsXG4gICAgX2ZuQXBwbHlDb2x1bW5EZWZzOiBfZm5BcHBseUNvbHVtbkRlZnMsXG4gICAgX2ZuSHVuZ2FyaWFuTWFwOiBfZm5IdW5nYXJpYW5NYXAsXG4gICAgX2ZuQ2FtZWxUb0h1bmdhcmlhbjogX2ZuQ2FtZWxUb0h1bmdhcmlhbixcbiAgICBfZm5MYW5ndWFnZUNvbXBhdDogX2ZuTGFuZ3VhZ2VDb21wYXQsXG4gICAgX2ZuQnJvd3NlckRldGVjdDogX2ZuQnJvd3NlckRldGVjdCxcbiAgICBfZm5BZGREYXRhOiBfZm5BZGREYXRhLFxuICAgIF9mbkFkZFRyOiBfZm5BZGRUcixcbiAgICBfZm5Ob2RlVG9EYXRhSW5kZXg6IF9mbk5vZGVUb0RhdGFJbmRleCxcbiAgICBfZm5Ob2RlVG9Db2x1bW5JbmRleDogX2ZuTm9kZVRvQ29sdW1uSW5kZXgsXG4gICAgX2ZuR2V0Q2VsbERhdGE6IF9mbkdldENlbGxEYXRhLFxuICAgIF9mblNldENlbGxEYXRhOiBfZm5TZXRDZWxsRGF0YSxcbiAgICBfZm5TcGxpdE9iak5vdGF0aW9uOiBfZm5TcGxpdE9iak5vdGF0aW9uLFxuICAgIF9mbkdldE9iamVjdERhdGFGbjogX2ZuR2V0T2JqZWN0RGF0YUZuLFxuICAgIF9mblNldE9iamVjdERhdGFGbjogX2ZuU2V0T2JqZWN0RGF0YUZuLFxuICAgIF9mbkdldERhdGFNYXN0ZXI6IF9mbkdldERhdGFNYXN0ZXIsXG4gICAgX2ZuQ2xlYXJUYWJsZTogX2ZuQ2xlYXJUYWJsZSxcbiAgICBfZm5EZWxldGVJbmRleDogX2ZuRGVsZXRlSW5kZXgsXG4gICAgX2ZuSW52YWxpZGF0ZTogX2ZuSW52YWxpZGF0ZSxcbiAgICBfZm5HZXRSb3dFbGVtZW50czogX2ZuR2V0Um93RWxlbWVudHMsXG4gICAgX2ZuQ3JlYXRlVHI6IF9mbkNyZWF0ZVRyLFxuICAgIF9mbkJ1aWxkSGVhZDogX2ZuQnVpbGRIZWFkLFxuICAgIF9mbkRyYXdIZWFkOiBfZm5EcmF3SGVhZCxcbiAgICBfZm5EcmF3OiBfZm5EcmF3LFxuICAgIF9mblJlRHJhdzogX2ZuUmVEcmF3LFxuICAgIF9mbkFkZE9wdGlvbnNIdG1sOiBfZm5BZGRPcHRpb25zSHRtbCxcbiAgICBfZm5EZXRlY3RIZWFkZXI6IF9mbkRldGVjdEhlYWRlcixcbiAgICBfZm5HZXRVbmlxdWVUaHM6IF9mbkdldFVuaXF1ZVRocyxcbiAgICBfZm5GZWF0dXJlSHRtbEZpbHRlcjogX2ZuRmVhdHVyZUh0bWxGaWx0ZXIsXG4gICAgX2ZuRmlsdGVyQ29tcGxldGU6IF9mbkZpbHRlckNvbXBsZXRlLFxuICAgIF9mbkZpbHRlckN1c3RvbTogX2ZuRmlsdGVyQ3VzdG9tLFxuICAgIF9mbkZpbHRlckNvbHVtbjogX2ZuRmlsdGVyQ29sdW1uLFxuICAgIF9mbkZpbHRlcjogX2ZuRmlsdGVyLFxuICAgIF9mbkZpbHRlckNyZWF0ZVNlYXJjaDogX2ZuRmlsdGVyQ3JlYXRlU2VhcmNoLFxuICAgIF9mbkVzY2FwZVJlZ2V4OiBfZm5Fc2NhcGVSZWdleCxcbiAgICBfZm5GaWx0ZXJEYXRhOiBfZm5GaWx0ZXJEYXRhLFxuICAgIF9mbkZlYXR1cmVIdG1sSW5mbzogX2ZuRmVhdHVyZUh0bWxJbmZvLFxuICAgIF9mblVwZGF0ZUluZm86IF9mblVwZGF0ZUluZm8sXG4gICAgX2ZuSW5mb01hY3JvczogX2ZuSW5mb01hY3JvcyxcbiAgICBfZm5Jbml0aWFsaXNlOiBfZm5Jbml0aWFsaXNlLFxuICAgIF9mbkluaXRDb21wbGV0ZTogX2ZuSW5pdENvbXBsZXRlLFxuICAgIF9mbkxlbmd0aENoYW5nZTogX2ZuTGVuZ3RoQ2hhbmdlLFxuICAgIF9mbkZlYXR1cmVIdG1sTGVuZ3RoOiBfZm5GZWF0dXJlSHRtbExlbmd0aCxcbiAgICBfZm5GZWF0dXJlSHRtbFBhZ2luYXRlOiBfZm5GZWF0dXJlSHRtbFBhZ2luYXRlLFxuICAgIF9mblBhZ2VDaGFuZ2U6IF9mblBhZ2VDaGFuZ2UsXG4gICAgX2ZuRmVhdHVyZUh0bWxQcm9jZXNzaW5nOiBfZm5GZWF0dXJlSHRtbFByb2Nlc3NpbmcsXG4gICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXk6IF9mblByb2Nlc3NpbmdEaXNwbGF5LFxuICAgIF9mbkZlYXR1cmVIdG1sVGFibGU6IF9mbkZlYXR1cmVIdG1sVGFibGUsXG4gICAgX2ZuU2Nyb2xsRHJhdzogX2ZuU2Nyb2xsRHJhdyxcbiAgICBfZm5BcHBseVRvQ2hpbGRyZW46IF9mbkFwcGx5VG9DaGlsZHJlbixcbiAgICBfZm5DYWxjdWxhdGVDb2x1bW5XaWR0aHM6IF9mbkNhbGN1bGF0ZUNvbHVtbldpZHRocyxcbiAgICBfZm5UaHJvdHRsZTogX2ZuVGhyb3R0bGUsXG4gICAgX2ZuQ29udmVydFRvV2lkdGg6IF9mbkNvbnZlcnRUb1dpZHRoLFxuICAgIF9mbkdldFdpZGVzdE5vZGU6IF9mbkdldFdpZGVzdE5vZGUsXG4gICAgX2ZuR2V0TWF4TGVuU3RyaW5nOiBfZm5HZXRNYXhMZW5TdHJpbmcsXG4gICAgX2ZuU3RyaW5nVG9Dc3M6IF9mblN0cmluZ1RvQ3NzLFxuICAgIF9mblNvcnRGbGF0dGVuOiBfZm5Tb3J0RmxhdHRlbixcbiAgICBfZm5Tb3J0OiBfZm5Tb3J0LFxuICAgIF9mblNvcnRBcmlhOiBfZm5Tb3J0QXJpYSxcbiAgICBfZm5Tb3J0TGlzdGVuZXI6IF9mblNvcnRMaXN0ZW5lcixcbiAgICBfZm5Tb3J0QXR0YWNoTGlzdGVuZXI6IF9mblNvcnRBdHRhY2hMaXN0ZW5lcixcbiAgICBfZm5Tb3J0aW5nQ2xhc3NlczogX2ZuU29ydGluZ0NsYXNzZXMsXG4gICAgX2ZuU29ydERhdGE6IF9mblNvcnREYXRhLFxuICAgIF9mblNhdmVTdGF0ZTogX2ZuU2F2ZVN0YXRlLFxuICAgIF9mbkxvYWRTdGF0ZTogX2ZuTG9hZFN0YXRlLFxuICAgIF9mblNldHRpbmdzRnJvbU5vZGU6IF9mblNldHRpbmdzRnJvbU5vZGUsXG4gICAgX2ZuTG9nOiBfZm5Mb2csXG4gICAgX2ZuTWFwOiBfZm5NYXAsXG4gICAgX2ZuQmluZEFjdGlvbjogX2ZuQmluZEFjdGlvbixcbiAgICBfZm5DYWxsYmFja1JlZzogX2ZuQ2FsbGJhY2tSZWcsXG4gICAgX2ZuQ2FsbGJhY2tGaXJlOiBfZm5DYWxsYmFja0ZpcmUsXG4gICAgX2ZuTGVuZ3RoT3ZlcmZsb3c6IF9mbkxlbmd0aE92ZXJmbG93LFxuICAgIF9mblJlbmRlcmVyOiBfZm5SZW5kZXJlcixcbiAgICBfZm5EYXRhU291cmNlOiBfZm5EYXRhU291cmNlLFxuICAgIF9mblJvd0F0dHJpYnV0ZXM6IF9mblJvd0F0dHJpYnV0ZXMsXG4gICAgX2ZuRXh0ZW5kOiBfZm5FeHRlbmQsXG4gICAgX2ZuQ2FsY3VsYXRlRW5kOiBmdW5jdGlvbiBfZm5DYWxjdWxhdGVFbmQoKSB7fVxuICB9KTtcbiAgJC5mbi5kYXRhVGFibGUgPSBEYXRhVGFibGU7XG4gIERhdGFUYWJsZS4kID0gJDtcbiAgJC5mbi5kYXRhVGFibGVTZXR0aW5ncyA9IERhdGFUYWJsZS5zZXR0aW5ncztcbiAgJC5mbi5kYXRhVGFibGVFeHQgPSBEYXRhVGFibGUuZXh0O1xuXG4gICQuZm4uRGF0YVRhYmxlID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICByZXR1cm4gJCh0aGlzKS5kYXRhVGFibGUob3B0cykuYXBpKCk7XG4gIH07XG5cbiAgJC5lYWNoKERhdGFUYWJsZSwgZnVuY3Rpb24gKHByb3AsIHZhbCkge1xuICAgICQuZm4uRGF0YVRhYmxlW3Byb3BdID0gdmFsO1xuICB9KTtcbiAgcmV0dXJuICQuZm4uZGF0YVRhYmxlO1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXRkRDVF9Ecm9wRG93blNlbGVjdCA9IHtcbiAgUmVuZGVyZXJDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJDaGFpbihfcmVuZGVyZXJDaGFpblBhcmFzKSB7fSxcbiAgR2V0VmFsdWU6IEhUTUxDb250cm9sLkdldFZhbHVlLFxuICBTZXRWYWx1ZTogSFRNTENvbnRyb2wuU2V0VmFsdWVcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXRkRDVF9TaW1wbGVMYWJlbCA9IHtcbiAgUmVuZGVyZXJDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpbixcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyRGF0YUNoYWluXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgV0ZEQ1RfU3ViRm9ybUxpc3RDb250YWluZXIgPSBfZGVmaW5lUHJvcGVydHkoe1xuICBfQWRkQnV0dG9uRWxlbTogbnVsbCxcbiAgXyRUZW1wbGF0ZVRhYmxlUm93OiBudWxsLFxuICBfJFNpbmdsZUNvbnRyb2xFbGVtOiBudWxsLFxuICBfJFRhYmxlRWxlbTogbnVsbCxcbiAgXyRUYWJsZUhlYWRFbGVtOiBudWxsLFxuICBfJFRhYmxlQm9keUVsZW06IG51bGwsXG4gIF9FZGl0SW5Sb3c6IHRydWUsXG4gIF9EaXNwbGF5X09QQnV0dG9uc19BZGQ6IHRydWUsXG4gIF9EaXNwbGF5X09QQnV0dG9uc19VcGRhdGU6IHRydWUsXG4gIF9EaXNwbGF5X09QQnV0dG9uc19EZWw6IHRydWUsXG4gIF9EaXNwbGF5X09QQnV0dG9uc19WaWV3OiB0cnVlLFxuICBfRm9ybVJ1bnRpbWVIb3N0OiBudWxsLFxuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKF9yZW5kZXJlckNoYWluUGFyYXMpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gX3JlbmRlcmVyQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtID0gJHNpbmdsZUNvbnRyb2xFbGVtO1xuICAgIHRoaXMuXyRUYWJsZUVsZW0gPSB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0uZmluZChcInRhYmxlXCIpO1xuICAgIHRoaXMuXyRUYWJsZUJvZHlFbGVtID0gdGhpcy5fJFRhYmxlRWxlbS5maW5kKFwidGJvZHlcIik7XG4gICAgdGhpcy5fJFRhYmxlSGVhZEVsZW0gPSB0aGlzLl8kVGFibGVFbGVtLmZpbmQoXCJ0aGVhZFwiKTtcbiAgICB0aGlzLl9FZGl0SW5Sb3cgPSAkc2luZ2xlQ29udHJvbEVsZW0uYXR0cihcImVkaXRpbnJvd1wiKSA9PSBcImZhbHNlXCIgPyBmYWxzZSA6IHRydWU7XG4gICAgdGhpcy5fRm9ybVJ1bnRpbWVIb3N0ID0gX3JlbmRlcmVyQ2hhaW5QYXJhcy5mb3JtUnVudGltZUluc3RhbmNlO1xuICAgIHZhciBvcGJ1dHRvbnMgPSAkc2luZ2xlQ29udHJvbEVsZW0uYXR0cihcIm9wYnV0dG9uc1wiKTtcbiAgICB0aGlzLl9EaXNwbGF5X09QQnV0dG9uc19BZGQgPSBvcGJ1dHRvbnMuaW5kZXhPZihcImFkZFwiKSA+PSAwO1xuICAgIHRoaXMuX0Rpc3BsYXlfT1BCdXR0b25zX1VwZGF0ZSA9IG9wYnV0dG9ucy5pbmRleE9mKFwidXBkYXRlXCIpID49IDA7XG4gICAgdGhpcy5fRGlzcGxheV9PUEJ1dHRvbnNfRGVsID0gb3BidXR0b25zLmluZGV4T2YoXCJkZWxldGVcIikgPj0gMDtcbiAgICB0aGlzLl9EaXNwbGF5X09QQnV0dG9uc19WaWV3ID0gb3BidXR0b25zLmluZGV4T2YoXCJ2aWV3XCIpID49IDA7XG4gICAgdmFyIHNvdXJjZUhUTUwgPSAkc2luZ2xlQ29udHJvbEVsZW0uaHRtbCgpO1xuICAgIHZhciBzb3VyY2VUYWJsZSA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGVbaXNfdGVtcGxhdGVfdGFibGU9J3RydWUnXVwiKTtcbiAgICBzb3VyY2VUYWJsZS5hZGRDbGFzcyhcInN1Yi1mb3JtLWxpc3QtdGFibGVcIik7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmh0bWwoXCJcIik7XG4gICAgdGhpcy5fQWRkQnV0dG9uRWxlbSA9ICQoXCI8ZGl2IGNsYXNzPSdzZmxiLWJ1dHRvbiBzZmxiLWFkZCcgdGl0bGU9J+aWsOWinic+5paw5aKePC9kaXY+XCIpO1xuXG4gICAgaWYgKHRoaXMuX0Rpc3BsYXlfT1BCdXR0b25zX0FkZCkge1xuICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtLnByZXBlbmQoXCI8ZGl2IGNsYXNzPSdzdWItZm9ybS1saXN0LWJ1dHRvbi13cmFwJz48L2Rpdj5cIikuZmluZChcImRpdlwiKS5hcHBlbmQodGhpcy5fQWRkQnV0dG9uRWxlbSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX0Rpc3BsYXlfT1BCdXR0b25zX0RlbCB8fCB0aGlzLl9EaXNwbGF5X09QQnV0dG9uc19VcGRhdGUgfHwgdGhpcy5fRGlzcGxheV9PUEJ1dHRvbnNfVmlldykge1xuICAgICAgdGhpcy5fJFRhYmxlSGVhZEVsZW0uZmluZChcInRyXCIpLmFwcGVuZChcIjx0aCBzdHlsZT0nd2lkdGg6IDEyMHB4Jz7mk43kvZw8L3RoPlwiKTtcbiAgICB9XG5cbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uYXBwZW5kKHNvdXJjZVRhYmxlKTtcbiAgICB2YXIgaW5zdGFuY2VOYW1lID0gSFRNTENvbnRyb2wuU2F2ZUNvbnRyb2xOZXdJbnN0YW5jZVRvUG9vbCgkc2luZ2xlQ29udHJvbEVsZW0sIHRoaXMpO1xuXG4gICAgdGhpcy5fQWRkQnV0dG9uRWxlbS5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgaG9zdEVsZW06ICRzaW5nbGVDb250cm9sRWxlbSxcbiAgICAgIF9yZW5kZXJlckNoYWluUGFyYXM6IF9yZW5kZXJlckNoYWluUGFyYXMsXG4gICAgICBzZWxmT2JqOiB0aGlzLFxuICAgICAgaW5zdGFuY2VOYW1lOiBpbnN0YW5jZU5hbWVcbiAgICB9LCB0aGlzLkFkZEV2ZW50KTtcblxuICAgIHRoaXMuXyRUZW1wbGF0ZVRhYmxlUm93ID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZSB0Ym9keSB0clwiKS5jbG9uZSgpO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGUgdGJvZHkgdHJcIikucmVtb3ZlKCk7XG4gICAgdmFyIHZhbGlkYXRlUmVuZGVyZXJDaGFpbkVuYWJsZSA9IHRoaXMuVmFsaWRhdGVSZW5kZXJlckNoYWluRW5hYmxlKCk7XG5cbiAgICBpZiAoIXZhbGlkYXRlUmVuZGVyZXJDaGFpbkVuYWJsZS5zdWNjZXNzKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dCh2YWxpZGF0ZVJlbmRlcmVyQ2hhaW5FbmFibGUubXNnKTtcbiAgICB9XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckRhdGFDaGFpbixcbiAgQWRkRXZlbnQ6IGZ1bmN0aW9uIEFkZEV2ZW50KHNlbmRlcikge1xuICAgIHZhciAkaG9zdEVsZW0gPSBzZW5kZXIuZGF0YS5ob3N0RWxlbTtcbiAgICB2YXIgc2VsZk9iaiA9IHNlbmRlci5kYXRhLnNlbGZPYmo7XG4gICAgdmFyIGluc3RhbmNlTmFtZSA9IHNlbmRlci5kYXRhLmluc3RhbmNlTmFtZTtcblxuICAgIGlmICghc2VsZk9iai5fRWRpdEluUm93KSB7XG4gICAgICBzZWxmT2JqLkRpYWxvZ19BZGQoc2VuZGVyLCAkaG9zdEVsZW0sIHNlbmRlci5kYXRhLl9yZW5kZXJlckNoYWluUGFyYXMsIGluc3RhbmNlTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGZPYmouSW5uZXJSb3dfQWRkKHNlbmRlciwgJGhvc3RFbGVtLCBzZW5kZXIuZGF0YS5fcmVuZGVyZXJDaGFpblBhcmFzLCBpbnN0YW5jZU5hbWUpO1xuICAgIH1cbiAgfSxcbiAgVmFsaWRhdGVTZXJpYWxpemF0aW9uU3ViRm9ybURhdGFFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlU2VyaWFsaXphdGlvblN1YkZvcm1EYXRhRW5hYmxlKHNlcmlhbGl6YXRpb25TdWJGb3JtRGF0YSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBWYWxpZGF0ZVJlbmRlcmVyQ2hhaW5FbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlUmVuZGVyZXJDaGFpbkVuYWJsZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIG1zZzogXCJcIlxuICAgIH07XG4gIH0sXG4gIENyZWF0ZUlkRmllbGRJbk9uZURhdGFSZWNvcmQ6IGZ1bmN0aW9uIENyZWF0ZUlkRmllbGRJbk9uZURhdGFSZWNvcmQob25lRGF0YVJlY29yZCwgaWRWYWx1ZSkge1xuICAgIHZhciBpZEZpZWxkID0gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUob25lRGF0YVJlY29yZFswXSk7XG4gICAgaWRGaWVsZC5maWVsZE5hbWUgPSBcIklEXCI7XG5cbiAgICBpZiAoaWRWYWx1ZSkge1xuICAgICAgaWRGaWVsZC52YWx1ZSA9IGlkVmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkRmllbGQudmFsdWUgPSBTdHJpbmdVdGlsaXR5Lkd1aWQoKTtcbiAgICB9XG5cbiAgICBvbmVEYXRhUmVjb3JkLnB1c2goaWRGaWVsZCk7XG4gIH0sXG4gIEdldFJvd0lkOiBmdW5jdGlvbiBHZXRSb3dJZCgkdHIpIHtcbiAgICB2YXIgaWQgPSAkdHIuYXR0cihcInRyX3JlY29yZF9pZFwiKTtcbiAgICByZXR1cm4gaWQ7XG4gIH0sXG4gIFNldFJvd0lkOiBmdW5jdGlvbiBTZXRSb3dJZCgkdHIsIHJlbGF0aW9uUE8pIHtcbiAgICAkdHIuYXR0cihcInRyX3JlY29yZF9pZFwiLCBGb3JtUnVudGltZS5GaW5kSWRGaWVsZFBPQnlSZWxhdGlvblBPKHJlbGF0aW9uUE8pLnZhbHVlKTtcbiAgfSxcbiAgU2V0Um93RGF0YTogZnVuY3Rpb24gU2V0Um93RGF0YSgkdHIsIHJlbGF0aW9uUE8pIHtcbiAgICAkdHIuYXR0cihcInRyX3JlY29yZF9kYXRhXCIsIEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyhyZWxhdGlvblBPKSk7XG4gIH0sXG4gIEdldFJvd0RhdGE6IGZ1bmN0aW9uIEdldFJvd0RhdGEoJHRyKSB7XG4gICAgdmFyIGpzb24gPSAkdHIuYXR0cihcInRyX3JlY29yZF9kYXRhXCIpO1xuICAgIHJldHVybiBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24oanNvbik7XG4gIH0sXG4gIFJlbmRlcmVyUm93OiBmdW5jdGlvbiBSZW5kZXJlclJvdyhyZWxhdGlvblBPLCAkdHIpIHtcbiAgICBpZiAodGhpcy5fRWRpdEluUm93KSB7XG4gICAgICB0aGlzLklubmVyUm93X1RvVmlld1N0YXR1cyhyZWxhdGlvblBPLCAkdHIpO1xuICAgIH0gZWxzZSB7fVxuXG4gICAgdGhpcy5TZXRSb3dJZCgkdHIsIHJlbGF0aW9uUE8pO1xuICAgIHRoaXMuU2V0Um93RGF0YSgkdHIsIHJlbGF0aW9uUE8pO1xuICB9LFxuICBUcnlHZXRSZWxhdGlvblBPOiBmdW5jdGlvbiBUcnlHZXRSZWxhdGlvblBPKCkge1xuICAgIHZhciBiaW5kRGF0YVNvdXJjZSA9IHRoaXMuVHJ5R2V0QmluZERhdGFTb3VyY2VBdHRyKCk7XG5cbiAgICBpZiAodGhpcy5fcG8pIHtcbiAgICAgIHJldHVybiBKc29uVXRpbGl0eS5DbG9uZVNpbXBsZSh0aGlzLl9wbyk7XG4gICAgfVxuXG4gICAgdmFyIHBvID0gbnVsbDtcblxuICAgIGlmIChiaW5kRGF0YVNvdXJjZSA9PSBcImF1dG9UZXN0aW5nXCIpIHtcbiAgICAgIHZhciBiaW5kVGFibGVOYW1lID0gdGhpcy5UcnlHZXRJbm5lckNvbnRyb2xCaW5kVGFibGVOYW1lKCk7XG4gICAgICBwbyA9IHRoaXMuX0Zvcm1SdW50aW1lSG9zdC5HZXRSZWxhdGlvblBPQnlUYWJsZU5hbWUoYmluZFRhYmxlTmFtZSk7XG5cbiAgICAgIGlmIChwbyA9PSBudWxsKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwiV0ZEQ1RfU3ViRm9ybUxpc3RDb250YWluZXIuVHJ5R2V0UmVsYXRpb25QTzrpgJrov4flhoXpg6jmjqfku7bnu5HlrprnmoTooajmib7kuI3liLDlhbfkvZPnmoTmlbDmja7lhbPogZTlrp7kvZPvvIFcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvID0gdGhpcy5fRm9ybVJ1bnRpbWVIb3N0LkdldFJlbGF0aW9uUE9CeUlkKGJpbmREYXRhU291cmNlKTtcblxuICAgICAgaWYgKHBvID09IG51bGwpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCJXRkRDVF9TdWJGb3JtTGlzdENvbnRhaW5lci5UcnlHZXRSZWxhdGlvblBPOumAmui/h0lEXCIgKyBiaW5kRGF0YVNvdXJjZSArIFwi5om+5LiN5Yiw5YW35L2T55qE5pWw5o2u5YWz6IGU5a6e5L2T77yBXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3BvID0gcG87XG4gICAgcmV0dXJuIEpzb25VdGlsaXR5LkNsb25lU2ltcGxlKHRoaXMuX3BvKTtcbiAgfSxcbiAgVHJ5R2V0SW5uZXJDb250cm9sQmluZFRhYmxlTmFtZTogZnVuY3Rpb24gVHJ5R2V0SW5uZXJDb250cm9sQmluZFRhYmxlTmFtZSgpIHtcbiAgICB2YXIgY29udHJvbHMgPSBIVE1MQ29udHJvbC5GaW5kQUxMQ29udHJvbHModGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtKTtcbiAgICB2YXIgdGFibGVOYW1lID0gbnVsbDtcbiAgICBjb250cm9scy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGFibGVOYW1lKSB7XG4gICAgICAgIHRhYmxlTmFtZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xCaW5kVGFibGVOYW1lKCQodGhpcykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRhYmxlTmFtZSAhPSBIVE1MQ29udHJvbC5HZXRDb250cm9sQmluZFRhYmxlTmFtZSgkKHRoaXMpKSkge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5a2Q6KGo5Yy65Z+f5Lit55qE5o6n5Lu257uR5a6a5LqG5aSa5Liq6KGoIVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0YWJsZU5hbWU7XG4gIH0sXG4gIFRyeUdldEJpbmREYXRhU291cmNlQXR0cjogZnVuY3Rpb24gVHJ5R2V0QmluZERhdGFTb3VyY2VBdHRyKCkge1xuICAgIHJldHVybiB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0uYXR0cihcImJpbmRkYXRhc291cmNlXCIpO1xuICB9LFxuICBfJExhc3RFZGl0Um93OiBudWxsLFxuICBJbm5lclJvd19BZGQ6IGZ1bmN0aW9uIElubmVyUm93X0FkZChzZW5kZXIsICRob3N0RWxlbSwgX3JlbmRlcmVyQ2hhaW5QYXJhcywgaW5zdGFuY2VOYW1lKSB7XG4gICAgdGhpcy5Jbm5lclJvd19Db21wbGV0ZWRMYXN0RWRpdCgpO1xuXG4gICAgdmFyICR0ciA9IHRoaXMuXyRUZW1wbGF0ZVRhYmxlUm93LmNsb25lKCk7XG5cbiAgICB2YXIgbGFzdE9wZXJhdGlvblRkID0gJChcIjx0ZD48ZGl2IGNsYXNzPSdzZmx0LXRkLW9wZXJhdGlvbi1vdXRlci13cmFwJz48L2Rpdj48L3RkPlwiKTtcbiAgICB2YXIgbGFzdE9wZXJhdGlvbk91dGVyRGl2ID0gbGFzdE9wZXJhdGlvblRkLmZpbmQoXCJkaXZcIik7XG4gICAgdmFyIGJ0bl9vcGVyYXRpb25fZGVsID0gJChcIjxkaXYgdGl0bGU9J+WIoOmZpCcgY2xhc3M9J3NmbHQtdGQtb3BlcmF0aW9uLWRlbCc+PC9kaXY+XCIpO1xuICAgIGJ0bl9vcGVyYXRpb25fZGVsLmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBob3N0RWxlbTogJGhvc3RFbGVtLFxuICAgICAgc2VsZk9iajogdGhpc1xuICAgIH0sIGZ1bmN0aW9uIChzZW5kZXIpIHtcbiAgICAgIHZhciAkaG9zdEVsZW0gPSBzZW5kZXIuZGF0YS5ob3N0RWxlbTtcbiAgICAgIHZhciBzZWxmT2JqID0gc2VuZGVyLmRhdGEuc2VsZk9iajtcbiAgICAgIHNlbGZPYmouSW5uZXJSb3dfRGVsZXRlKHNlbmRlciwgJGhvc3RFbGVtLCAkKHRoaXMpLCAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpKTtcbiAgICB9KTtcbiAgICBsYXN0T3BlcmF0aW9uT3V0ZXJEaXYuYXBwZW5kKGJ0bl9vcGVyYXRpb25fZGVsKTtcbiAgICB2YXIgYnRuX29wZXJhdGlvbl91cGRhdGUgPSAkKFwiPGRpdiB0aXRsZT0n57yW6L6RJyBjbGFzcz0nc2ZsdC10ZC1vcGVyYXRpb24tdXBkYXRlJz48L2Rpdj5cIik7XG4gICAgYnRuX29wZXJhdGlvbl91cGRhdGUuYmluZChcImNsaWNrXCIsIHtcbiAgICAgIGhvc3RFbGVtOiAkaG9zdEVsZW0sXG4gICAgICBzZWxmT2JqOiB0aGlzXG4gICAgfSwgZnVuY3Rpb24gKHNlbmRlcikge1xuICAgICAgdmFyICRob3N0RWxlbSA9IHNlbmRlci5kYXRhLmhvc3RFbGVtO1xuICAgICAgdmFyIHNlbGZPYmogPSBzZW5kZXIuZGF0YS5zZWxmT2JqO1xuICAgICAgc2VsZk9iai5Jbm5lclJvd19Ub0VkaXRTdGF0dXMoc2VuZGVyLCAkaG9zdEVsZW0sICQodGhpcyksICQodGhpcykucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkpO1xuICAgIH0pO1xuICAgIGxhc3RPcGVyYXRpb25PdXRlckRpdi5hcHBlbmQoYnRuX29wZXJhdGlvbl91cGRhdGUpO1xuICAgICR0ci5hcHBlbmQobGFzdE9wZXJhdGlvblRkKTtcblxuICAgIHRoaXMuXyRUYWJsZUJvZHlFbGVtLmFwcGVuZCgkdHIpO1xuXG4gICAgdGhpcy5fJExhc3RFZGl0Um93ID0gJHRyO1xuICB9LFxuICBJbm5lclJvd19Ub0VkaXRTdGF0dXM6IGZ1bmN0aW9uIElubmVyUm93X1RvRWRpdFN0YXR1cyhzZW5kZXIsICRob3N0RWxlbSwgJGVsZW0sICR0cikge1xuICAgIGNvbnNvbGUubG9nKHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbSk7XG4gICAgdGhpcy5Jbm5lclJvd19Db21wbGV0ZWRMYXN0RWRpdCgpO1xuICAgIHZhciByb3dSZWxhdGlvblBPID0gdGhpcy5HZXRSb3dEYXRhKCR0cik7XG4gICAgdmFyIHJvd1NwYW5Db250cm9scyA9ICR0ci5maW5kKFwiW2lzX2lubmVyX3Jvd19zcGFuPSd0cnVlJ11cIik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvd1NwYW5Db250cm9scy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNwYW5Db250cm9sID0gJChyb3dTcGFuQ29udHJvbHNbaV0pO1xuICAgICAgdmFyIGNvbnRyb2xJZCA9IHNwYW5Db250cm9sLmF0dHIoXCJlZGl0X2NvbnRyb2xfaWRcIik7XG5cbiAgICAgIHZhciBlZGl0Q29udHJvbCA9IHRoaXMuXyRUZW1wbGF0ZVRhYmxlUm93LmZpbmQoXCIjXCIgKyBjb250cm9sSWQpLmNsb25lKCk7XG5cbiAgICAgIHZhciBmaWVsZE5hbWUgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sQmluZEZpZWxkTmFtZShlZGl0Q29udHJvbCk7XG4gICAgICB2YXIgZmllbGRQTyA9IEZvcm1SdW50aW1lLkZpbmRGaWVsZFBPQnlSZWxhdGlvblBPKHJvd1JlbGF0aW9uUE8sIGZpZWxkTmFtZSk7XG4gICAgICB2YXIgZWRpdENvbnRyb2xJbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbShlZGl0Q29udHJvbCk7XG4gICAgICBlZGl0Q29udHJvbEluc3RhbmNlLlNldFZhbHVlKGVkaXRDb250cm9sLCBmaWVsZFBPLCB7fSk7XG4gICAgICBzcGFuQ29udHJvbC5wYXJlbnQoKS5hcHBlbmQoZWRpdENvbnRyb2wpO1xuICAgICAgc3BhbkNvbnRyb2wucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fJExhc3RFZGl0Um93ID0gJHRyO1xuICB9LFxuICBJbm5lclJvd19Ub1ZpZXdTdGF0dXM6IGZ1bmN0aW9uIElubmVyUm93X1RvVmlld1N0YXR1cyhyZWxhdGlvblBPLCAkdHIpIHtcbiAgICBpZiAodGhpcy5fJExhc3RFZGl0Um93KSB7XG4gICAgICB2YXIgY29udHJvbHMgPSBIVE1MQ29udHJvbC5GaW5kQUxMQ29udHJvbHModGhpcy5fJExhc3RFZGl0Um93KTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb250cm9scy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc2luZ2xlQ29udHJvbCA9ICQoY29udHJvbHNbaV0pO1xuICAgICAgICB2YXIgZmllbGROYW1lID0gSFRNTENvbnRyb2wuR2V0Q29udHJvbEJpbmRGaWVsZE5hbWUoc2luZ2xlQ29udHJvbCk7XG4gICAgICAgIHZhciBmaWVsZFZhbHVlID0gRm9ybVJ1bnRpbWUuRmluZEZpZWxkUE9CeVJlbGF0aW9uUE8ocmVsYXRpb25QTywgZmllbGROYW1lKS52YWx1ZTtcbiAgICAgICAgdmFyIHR4dFNwYW4gPSAkKFwiPHNwYW4gaXNfaW5uZXJfcm93X3NwYW49J3RydWUnIGVkaXRfY29udHJvbF9pZD0nXCIgKyBzaW5nbGVDb250cm9sLmF0dHIoXCJpZFwiKSArIFwiJz5cIiArIGZpZWxkVmFsdWUgKyBcIjwvc3Bhbj5cIik7XG4gICAgICAgIHNpbmdsZUNvbnRyb2wuYmVmb3JlKHR4dFNwYW4pO1xuICAgICAgICBzaW5nbGVDb250cm9sLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuXyRMYXN0RWRpdFJvdyA9IG51bGw7XG4gIH0sXG4gIElubmVyUm93X0RlbGV0ZTogZnVuY3Rpb24gSW5uZXJSb3dfRGVsZXRlKHNlbmRlciwgJGhvc3RFbGVtLCAkZWxlbSwgJHRyKSB7XG4gICAgdGhpcy5Jbm5lclJvd19Db21wbGV0ZWRMYXN0RWRpdCgpO1xuICAgICR0ci5yZW1vdmUoKTtcbiAgfSxcbiAgSW5uZXJSb3dfQ29tcGxldGVkTGFzdEVkaXQ6IGZ1bmN0aW9uIElubmVyUm93X0NvbXBsZXRlZExhc3RFZGl0KCkge1xuICAgIGlmICh0aGlzLl8kTGFzdEVkaXRSb3cpIHtcbiAgICAgIHZhciBjb250cm9scyA9IEhUTUxDb250cm9sLkZpbmRBTExDb250cm9scyh0aGlzLl8kTGFzdEVkaXRSb3cpO1xuICAgICAgdmFyIHJlbGF0aW9uUE8gPSB0aGlzLlRyeUdldFJlbGF0aW9uUE8oKTtcbiAgICAgIGNvbnNvbGUubG9nKHJlbGF0aW9uUE8pO1xuICAgICAgdmFyIG9uZVJvd1JlY29yZCA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbnRyb2xzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzaW5nbGVDb250cm9sID0gJChjb250cm9sc1tpXSk7XG4gICAgICAgIHZhciBmaWVsZFRyYW5zZmVyUE8gPSBIVE1MQ29udHJvbC5UcnlHZXRGaWVsZFRyYW5zZmVyUE8oc2luZ2xlQ29udHJvbCwgcmVsYXRpb25QTy5pZCwgcmVsYXRpb25QTy5zaW5nbGVOYW1lLCByZWxhdGlvblBPLnJlbGF0aW9uVHlwZSk7XG4gICAgICAgIG9uZVJvd1JlY29yZC5wdXNoKGZpZWxkVHJhbnNmZXJQTyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBpZFZhbHVlID0gdGhpcy5HZXRSb3dJZCh0aGlzLl8kTGFzdEVkaXRSb3cpO1xuICAgICAgdGhpcy5DcmVhdGVJZEZpZWxkSW5PbmVEYXRhUmVjb3JkKG9uZVJvd1JlY29yZCwgaWRWYWx1ZSk7XG4gICAgICByZWxhdGlvblBPID0gRm9ybVJ1bnRpbWUuU2V0MVRvMURhdGFSZWNvcmQocmVsYXRpb25QTywgb25lUm93UmVjb3JkKTtcbiAgICAgIHRoaXMuUmVuZGVyZXJSb3cocmVsYXRpb25QTywgdGhpcy5fJExhc3RFZGl0Um93KTtcbiAgICAgIGNvbnNvbGUubG9nKG9uZVJvd1JlY29yZCk7XG4gICAgfVxuICB9LFxuICBEaWFsb2dfQWRkOiBmdW5jdGlvbiBEaWFsb2dfQWRkKHNlbmRlciwgJGhvc3RFbGVtLCBfcmVuZGVyZXJDaGFpblBhcmFzLCBpbnN0YW5jZU5hbWUpIHtcbiAgICB2YXIgZm9ybUlkID0gJGhvc3RFbGVtLmF0dHIoXCJmb3JtaWRcIik7XG4gICAgdmFyIHdpbmRvd0hlaWdodCA9ICRob3N0RWxlbS5hdHRyKFwid2luZG93aGVpZ2h0XCIpO1xuICAgIHZhciB3aW5kb3dXaWR0aCA9ICRob3N0RWxlbS5hdHRyKFwid2luZG93d2lkdGhcIik7XG4gICAgdmFyIGRpYWxvZ1dpbmRvd1RpdGxlID0gJGhvc3RFbGVtLmF0dHIoXCJkaWFsb2d3aW5kb3d0aXRsZVwiKTtcblxuICAgIGlmICghZGlhbG9nV2luZG93VGl0bGUpIHtcbiAgICAgIGRpYWxvZ1dpbmRvd1RpdGxlID0gXCLlupTnlKjmnoTlu7rns7vnu59cIjtcbiAgICB9XG5cbiAgICB2YXIgaXNQcmV2aWV3ID0gX3JlbmRlcmVyQ2hhaW5QYXJhcy5mb3JtUnVudGltZUluc3RhbmNlLklzUHJldmlldygpO1xuXG4gICAgaWYgKGlzUHJldmlldykge1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyhcIi9IVE1ML0J1aWxkZXIvRm9ybS9TdWJGb3JtUHJldmlldy5odG1sXCIsIHtcbiAgICAgICAgXCJGb3JtSWRcIjogZm9ybUlkLFxuICAgICAgICBcIk9wZXJhdGlvblR5cGVcIjogXCJhZGRcIixcbiAgICAgICAgXCJJbnN0YW5jZU5hbWVcIjogaW5zdGFuY2VOYW1lXG4gICAgICB9KTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICB0aXRsZTogZGlhbG9nV2luZG93VGl0bGUsXG4gICAgICAgIHdpZHRoOiB3aW5kb3dXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiB3aW5kb3dIZWlnaHRcbiAgICAgIH0sIDEpO1xuICAgIH1cbiAgfSxcbiAgRGlhbG9nX0NvbXBsZXRlZEVkaXQ6IGZ1bmN0aW9uIERpYWxvZ19Db21wbGV0ZWRFZGl0KGluc3RhbmNlTmFtZSwgb3BlcmF0aW9uVHlwZSwgc2VyaWFsaXphdGlvblN1YkZvcm1EYXRhKSB7XG4gICAgaWYgKHRoaXMuVmFsaWRhdGVTZXJpYWxpemF0aW9uU3ViRm9ybURhdGFFbmFibGUoc2VyaWFsaXphdGlvblN1YkZvcm1EYXRhKSkge1xuICAgICAgdmFyIG9uZURhdGFSZWNvcmQgPSBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUoc2VyaWFsaXphdGlvblN1YkZvcm1EYXRhLmZvcm1SZWNvcmREYXRhUmVsYXRpb25QT0xpc3QsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLmlzTWFpbiA9PSB0cnVlO1xuICAgICAgfSkub25lRGF0YVJlY29yZDtcblxuICAgICAgaWYgKG9wZXJhdGlvblR5cGUgPT0gRm9ybVJ1bnRpbWUuT3BlcmF0aW9uQWRkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwi5aaC5p6c5piv5paw5Lqn55Sf55qE6K6w5b2V77yM5YiZ55Sf5oiQ6ZqP5py655qE5Li76ZSuXCIpO1xuICAgICAgICB0aGlzLkNyZWF0ZUlkRmllbGRJbk9uZURhdGFSZWNvcmQob25lRGF0YVJlY29yZCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKG9uZURhdGFSZWNvcmQpO1xuICAgICAgdGhpcy5VcGRhdGVSb3cob25lRGF0YVJlY29yZCk7XG4gICAgfVxuICB9LFxuICBEaWFsb2dfVmlld1JvdzogZnVuY3Rpb24gRGlhbG9nX1ZpZXdSb3coc2VuZGVyKSB7fSxcbiAgRGlhbG9nX1VwZGF0ZVJvdzogZnVuY3Rpb24gRGlhbG9nX1VwZGF0ZVJvdyhzZW5kZXIpIHt9LFxuICBEaWFsb2dfRGVsUm93OiBmdW5jdGlvbiBEaWFsb2dfRGVsUm93KHNlbmRlcikge31cbn0sIFwiRGlhbG9nX1VwZGF0ZVJvd1wiLCBmdW5jdGlvbiBEaWFsb2dfVXBkYXRlUm93KCkge1xuICB2YXIgJHRyID0gdGhpcy5fJFRlbXBsYXRlVGFibGVSb3cuY2xvbmUoKTtcblxuICB2YXIgY29udHJvbHMgPSBIVE1MQ29udHJvbC5GaW5kQUxMQ29udHJvbHMoJHRyKTtcbiAgY29udHJvbHMuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgIHZhciBwcm9wID0gSFRNTENvbnRyb2wuR2V0Q29udHJvbFByb3AoJCh0aGlzKSk7XG4gICAgdmFyIGNlbGxWYWx1ZSA9IEhUTUxDb250cm9sLkdldFNlcmlhbGl6YXRpb25PbmVEYXRhUmVjb3JkRmllbGRWYWx1ZShvbmVEYXRhUmVjb3JkLCBwcm9wLnRhYmxlTmFtZSwgcHJvcC5maWVsZE5hbWUpO1xuICAgICQodGhpcykuaHRtbChjZWxsVmFsdWUpO1xuICB9KTtcbiAgdmFyIGlkRmllbGQgPSB0aGlzLkZpbmRJZEZpZWxkQnlPbmVEYXRhUmVjb3JkKG9uZURhdGFSZWNvcmQpO1xuXG4gIGlmIChpZEZpZWxkID09IG51bGwpIHtcbiAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIldGRENUX1N1YkZvcm1MaXN0Q29udGFpbmVyLk5ld1Jvdzrmn6Xmib7kuI3liLBJROeahOWtl+aute+8gVwiKTtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwi57uR5a6a55qE6K6w5b2VSUQ6XCIgKyBpZEZpZWxkLnZhbHVlKTtcbiAgdmFyIGlkVmFsdWUgPSBpZEZpZWxkLnZhbHVlO1xuICAkdHIuYXR0cihcInJlY29yZF9pZFwiLCBpZFZhbHVlKTtcbiAgJHRyLmF0dHIoXCJyZWNvcmRfZGF0YVwiLCBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcob25lRGF0YVJlY29yZCkpO1xuICB2YXIgbGFzdE9wZXJhdGlvblRkID0gJChcIjx0ZD48ZGl2IGNsYXNzPSdzZmx0LXRkLW9wZXJhdGlvbi1vdXRlci13cmFwJz48L2Rpdj48L3RkPlwiKTtcbiAgdmFyIGxhc3RPcGVyYXRpb25PdXRlckRpdiA9IGxhc3RPcGVyYXRpb25UZC5maW5kKFwiZGl2XCIpO1xuXG4gIGlmICh0aGlzLl9EaXNwbGF5X09QQnV0dG9uc19WaWV3KSB7XG4gICAgdmFyIGJ0bl9vcGVyYXRpb25fdmlldyA9ICQoXCI8ZGl2IHRpdGxlPSfmn6XnnIsnIGNsYXNzPSdzZmx0LXRkLW9wZXJhdGlvbi12aWV3Jz48L2Rpdj5cIik7XG4gICAgbGFzdE9wZXJhdGlvbk91dGVyRGl2LmFwcGVuZChidG5fb3BlcmF0aW9uX3ZpZXcpO1xuICAgIGJ0bl9vcGVyYXRpb25fdmlldy5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgXCJ0cl9lbGVtXCI6ICR0cixcbiAgICAgIFwiaWRcIjogaWRWYWx1ZSxcbiAgICAgIFwicmVjb3JkX2RhdGFcIjogb25lRGF0YVJlY29yZFxuICAgIH0sIHRoaXMuRGlhbG9nX1ZpZXdSb3cpO1xuICB9XG5cbiAgaWYgKHRoaXMuX0Rpc3BsYXlfT1BCdXR0b25zX1VwZGF0ZSkge1xuICAgIHZhciBidG5fb3BlcmF0aW9uX3VwZGF0ZSA9ICQoXCI8ZGl2IHRpdGxlPSfnvJbovpEnIGNsYXNzPSdzZmx0LXRkLW9wZXJhdGlvbi11cGRhdGUnPjwvZGl2PlwiKTtcbiAgICBsYXN0T3BlcmF0aW9uT3V0ZXJEaXYuYXBwZW5kKGJ0bl9vcGVyYXRpb25fdXBkYXRlKTtcbiAgICBidG5fb3BlcmF0aW9uX3ZpZXcuYmluZChcImNsaWNrXCIsIHtcbiAgICAgIFwidHJfZWxlbVwiOiAkdHIsXG4gICAgICBcImlkXCI6IGlkVmFsdWUsXG4gICAgICBcInJlY29yZF9kYXRhXCI6IG9uZURhdGFSZWNvcmRcbiAgICB9LCB0aGlzLkRpYWxvZ19VcGRhdGVSb3cpO1xuICB9XG5cbiAgaWYgKHRoaXMuX0Rpc3BsYXlfT1BCdXR0b25zX0RlbCkge1xuICAgIHZhciBidG5fb3BlcmF0aW9uX2RlbCA9ICQoXCI8ZGl2IHRpdGxlPSfliKDpmaQnIGNsYXNzPSdzZmx0LXRkLW9wZXJhdGlvbi1kZWwnPjwvZGl2PlwiKTtcbiAgICBsYXN0T3BlcmF0aW9uT3V0ZXJEaXYuYXBwZW5kKGJ0bl9vcGVyYXRpb25fZGVsKTtcbiAgICBidG5fb3BlcmF0aW9uX3ZpZXcuYmluZChcImNsaWNrXCIsIHtcbiAgICAgIFwidHJfZWxlbVwiOiAkdHIsXG4gICAgICBcImlkXCI6IGlkVmFsdWUsXG4gICAgICBcInJlY29yZF9kYXRhXCI6IG9uZURhdGFSZWNvcmRcbiAgICB9LCB0aGlzLkRpYWxvZ19EZWxSb3cpO1xuICB9XG5cbiAgJHRyLmFwcGVuZChsYXN0T3BlcmF0aW9uVGQpO1xuXG4gIHRoaXMuXyRUYWJsZUJvZHlFbGVtLmFwcGVuZCgkdHIpO1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXRkRDVF9UZXh0Qm94ID0ge1xuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKF9yZW5kZXJlckNoYWluUGFyYXMpIHt9LFxuICBSZW5kZXJlckRhdGFDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJEYXRhQ2hhaW4oKSB7fSxcbiAgR2V0VmFsdWU6IEhUTUxDb250cm9sLkdldFZhbHVlLFxuICBTZXRWYWx1ZTogSFRNTENvbnRyb2wuU2V0VmFsdWVcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXRkRDVF9UZXh0RGF0ZVRpbWUgPSB7XG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge30sXG4gIEdldFZhbHVlOiBIVE1MQ29udHJvbC5HZXRWYWx1ZSxcbiAgU2V0VmFsdWU6IEhUTUxDb250cm9sLlNldFZhbHVlXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfRm9ybUJ1dHRvbiA9IHtcbiAgX0xpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlOiBudWxsLFxuICBSZW5kZXJlckNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckNoYWluLFxuICBSZXNvbHZlU2VsZjogZnVuY3Rpb24gUmVzb2x2ZVNlbGYoX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB2YXIgY2FwdGlvbiA9ICRzaW5nbGVDb250cm9sRWxlbS5hdHRyKFwiYnV0dG9uY2FwdGlvblwiKTtcbiAgICB2YXIgJGJ1dHRvbiA9ICQoXCI8YnV0dG9uIGNsYXNzPSd3bGRjdC1saXN0LWJ1dHRvbic+XCIgKyBjYXB0aW9uICsgXCI8L2J1dHRvbj5cIik7XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSAkc2luZ2xlQ29udHJvbEVsZW0ucHJvcChcImF0dHJpYnV0ZXNcIik7XG4gICAgJC5lYWNoKGF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICRidXR0b24uYXR0cih0aGlzLm5hbWUsIHRoaXMudmFsdWUpO1xuICAgIH0pO1xuICAgICRidXR0b24uYmluZChcImNsaWNrXCIsIHtcbiAgICAgIFwiYnV0dG9uRWxlbVwiOiAkYnV0dG9uLFxuICAgICAgXCJzZWxmSW5zdGFuY2VcIjogdGhpc1xuICAgIH0sIHRoaXMuQ2xpY2tFdmVudCk7XG4gICAgcmV0dXJuICRidXR0b247XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbihfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdmFyICRXTERDVF9MaXN0QnV0dG9uQ29udGFpbmVyID0gJHNpbmdsZUNvbnRyb2xFbGVtLnBhcmVudHMoXCJbc2luZ2xlbmFtZT0nV0xEQ1RfTGlzdEJ1dHRvbkNvbnRhaW5lciddXCIpO1xuICAgIHZhciAkV0xEQ1RfTGlzdFRhYmxlQ29udGFpbmVyRWxlbSA9ICRXTERDVF9MaXN0QnV0dG9uQ29udGFpbmVyLm5leHRBbGwoXCJbY2xpZW50X3Jlc29sdmU9J1dMRENUX0xpc3RUYWJsZUNvbnRhaW5lciddXCIpO1xuICAgIHRoaXMuX0xpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlID0gSFRNTENvbnRyb2wuR2V0Q29udHJvbEluc3RhbmNlQnlFbGVtKCRXTERDVF9MaXN0VGFibGVDb250YWluZXJFbGVtKTtcbiAgfSxcbiAgQ2xpY2tFdmVudDogZnVuY3Rpb24gQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICB2YXIgJGJ1dHRvbiA9IHNlbmRlci5kYXRhLmJ1dHRvbkVsZW07XG4gICAgdmFyIF9zZWxmID0gc2VuZGVyLmRhdGEuc2VsZkluc3RhbmNlO1xuICAgIGNvbnNvbGUubG9nKCRidXR0b24pO1xuICAgIHZhciBiaW5kYXV0aG9yaXR5ID0gJGJ1dHRvbi5hdHRyKFwiYmluZGF1dGhvcml0eVwiKTtcbiAgICB2YXIgYnV0dG9uY2FwdGlvbiA9ICRidXR0b24uYXR0cihcImJ1dHRvbmNhcHRpb25cIik7XG4gICAgdmFyIGJ1dHRvbnR5cGUgPSAkYnV0dG9uLmF0dHIoXCJidXR0b250eXBlXCIpO1xuICAgIHZhciBjdXN0Y2xpZW50Y2xpY2tiZWZvcmVtZXRob2QgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50Y2xpY2tiZWZvcmVtZXRob2RcIik7XG4gICAgdmFyIGN1c3RjbGllbnRjbGlja2JlZm9yZW1ldGhvZHBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50Y2xpY2tiZWZvcmVtZXRob2RwYXJhXCIpO1xuICAgIHZhciBjdXN0Y2xpZW50cmVuZGVyZXJhZnRlcm1ldGhvZHBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50cmVuZGVyZXJhZnRlcm1ldGhvZHBhcmFcIik7XG4gICAgdmFyIGN1c3RjbGllbnRyZW5kZXJlcmFmdGVybWV0aG9kcGFyYXBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50cmVuZGVyZXJhZnRlcm1ldGhvZHBhcmFwYXJhXCIpO1xuICAgIHZhciBjdXN0Y2xpZW50cmVuZGVyZXJtZXRob2QgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50cmVuZGVyZXJtZXRob2RcIik7XG4gICAgdmFyIGN1c3RjbGllbnRyZW5kZXJlcm1ldGhvZHBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50cmVuZGVyZXJtZXRob2RwYXJhXCIpO1xuICAgIHZhciBjdXN0c2VydmVycmVzb2x2ZW1ldGhvZCA9ICRidXR0b24uYXR0cihcImN1c3RzZXJ2ZXJyZXNvbHZlbWV0aG9kXCIpO1xuICAgIHZhciBjdXN0c2VydmVycmVzb2x2ZW1ldGhvZHBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0c2VydmVycmVzb2x2ZW1ldGhvZHBhcmFcIik7XG4gICAgdmFyIGZvcm1jb2RlID0gJGJ1dHRvbi5hdHRyKFwiZm9ybWNvZGVcIik7XG4gICAgdmFyIGZvcm1pZCA9ICRidXR0b24uYXR0cihcImZvcm1pZFwiKTtcbiAgICB2YXIgZm9ybW1vZHVsZWlkID0gJGJ1dHRvbi5hdHRyKFwiZm9ybW1vZHVsZWlkXCIpO1xuICAgIHZhciBmb3JtbW9kdWxlbmFtZSA9ICRidXR0b24uYXR0cihcImZvcm1tb2R1bGVuYW1lXCIpO1xuICAgIHZhciBmb3JtbmFtZSA9ICRidXR0b24uYXR0cihcImZvcm1uYW1lXCIpO1xuICAgIHZhciBlbGVtaWQgPSAkYnV0dG9uLmF0dHIoXCJpZFwiKTtcbiAgICB2YXIgYnV0dG9uaWQgPSAkYnV0dG9uLmF0dHIoXCJidXR0b25pZFwiKTtcbiAgICB2YXIgaW5uZXJidXR0b25qc29uc3RyaW5nID0gJGJ1dHRvbi5hdHRyKFwiaW5uZXJidXR0b25qc29uc3RyaW5nXCIpO1xuICAgIHZhciBvcGVudHlwZSA9ICRidXR0b24uYXR0cihcIm9wZW50eXBlXCIpO1xuICAgIHZhciBvcGVyYXRpb24gPSAkYnV0dG9uLmF0dHIoXCJvcGVyYXRpb25cIik7XG4gICAgdmFyIHNpbmdsZW5hbWUgPSAkYnV0dG9uLmF0dHIoXCJzaW5nbGVuYW1lXCIpO1xuICAgIHZhciB3aW5kb3djYXB0aW9uID0gJGJ1dHRvbi5hdHRyKFwid2luZG93Y2FwdGlvblwiKTtcbiAgICB2YXIgd2luZG93aGVpZ2h0ID0gJGJ1dHRvbi5hdHRyKFwid2luZG93aGVpZ2h0XCIpO1xuICAgIHZhciB3aW5kb3d3aWR0aCA9ICRidXR0b24uYXR0cihcIndpbmRvd3dpZHRoXCIpO1xuICAgIHZhciBjbGllbnRfcmVzb2x2ZSA9ICRidXR0b24uYXR0cihcImNsaWVudF9yZXNvbHZlXCIpO1xuICAgIHZhciByZWNvcmRJZCA9IFwiXCI7XG5cbiAgICBpZiAob3BlcmF0aW9uID09IFwidXBkYXRlXCIgfHwgb3BlcmF0aW9uID09IFwidmlld1wiKSB7XG4gICAgICB2YXIgY2hlY2tlZFJlY29yZE9ianMgPSBfc2VsZi5fTGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UuR2V0Q2hlY2tlZFJlY29yZCgpO1xuXG4gICAgICBpZiAoY2hlY2tlZFJlY29yZE9ianMubGVuZ3RoID09IDApIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7fpgInmi6npnIDopoHov5vooYzmk43kvZznmoTorrDlvZUhXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKGNoZWNrZWRSZWNvcmRPYmpzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLkuIDmrKHlj6rog73mk43kvZzkuIDmnaHorrDlvZUhXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWNvcmRJZCA9IGNoZWNrZWRSZWNvcmRPYmpzWzBdLklkO1xuICAgICAgfVxuICAgIH1cblxuICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIEJhc2VVdGlsaXR5LkJ1aWxkVmlldyhcIi9IVE1ML0J1aWxkZXIvUnVudGltZS9XZWJGb3JtUnVudGltZS5odG1sXCIsIHtcbiAgICAgIEZvcm1JZDogZm9ybWlkLFxuICAgICAgQnV0dG9uSWQ6IGJ1dHRvbmlkLFxuICAgICAgRWxlbUlkOiBlbGVtaWQsXG4gICAgICBSZWNvcmRJZDogcmVjb3JkSWQsXG4gICAgICBPcGVyYXRpb25UeXBlOiBvcGVyYXRpb25cbiAgICB9KSwge1xuICAgICAgd2lkdGg6IHdpbmRvd3dpZHRoLFxuICAgICAgaGVpZ2h0OiB3aW5kb3doZWlnaHQsXG4gICAgICB0aXRsZTogd2luZG93Y2FwdGlvblxuICAgIH0sIDEsIHRydWUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdEJ1dHRvbkNvbnRhaW5lciA9IHtcbiAgUmVuZGVyZXJDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJDaGFpbihfcmVuZGVyZXJDaGFpblBhcmFzKSB7XG4gICAgdmFyICRzaW5nbGVDb250cm9sRWxlbSA9IF9yZW5kZXJlckNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtO1xuICAgIHZhciAkYnV0dG9uRGl2RWxlbUxpc3QgPSAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcImRpdlwiICsgSFRNTENvbnRyb2xBdHRycy5TRUxFQ1RFRF9KQlVJTEQ0RENfQ1VTVE9NKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcIltpcy1vcC1idXR0b24td3JhcC10YWJsZT0ndHJ1ZSddXCIpLmhpZGUoKTtcbiAgICB2YXIgaW5uZXJXcmFwID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCIud2xkY3QtbGlzdC1idXR0b24taW5uZXItd3JhcFwiKTtcbiAgICB2YXIgaW5uZXJJbnNpZGVXcmFwRGl2ID0gJChcIjxkaXYgY2xhc3M9J3dsZGN0LWxpc3QtYnV0dG9uLWlubmVyLWluc2lkZS13cmFwJyAvPlwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJGJ1dHRvbkRpdkVsZW1MaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJGJ1dHRvbkVsZW0gPSAkKCRidXR0b25EaXZFbGVtTGlzdFtpXSk7XG4gICAgICB2YXIgY2xpZW50UmVzb2x2ZU5hbWUgPSAkYnV0dG9uRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuQ0xJRU5UX1JFU09MVkUpO1xuICAgICAgdmFyIGNsaWVudFJlc29sdmVPYmplY3QgPSBPYmplY3QuY3JlYXRlKGV2YWwoY2xpZW50UmVzb2x2ZU5hbWUpKTtcbiAgICAgIHZhciAkcmVzb2x2ZWRFbGVtID0gY2xpZW50UmVzb2x2ZU9iamVjdC5SZXNvbHZlU2VsZih7XG4gICAgICAgIHNvdXJjZUhUTUw6IF9yZW5kZXJlckNoYWluUGFyYXMuc291cmNlSFRNTCxcbiAgICAgICAgJHJvb3RFbGVtOiBfcmVuZGVyZXJDaGFpblBhcmFzLiRyb290RWxlbSxcbiAgICAgICAgJHBhcmVudENvbnRyb2xFbGVtOiAkc2luZ2xlQ29udHJvbEVsZW0sXG4gICAgICAgICRzaW5nbGVDb250cm9sRWxlbTogJGJ1dHRvbkVsZW0sXG4gICAgICAgIGFsbERhdGE6IF9yZW5kZXJlckNoYWluUGFyYXMuYWxsRGF0YVxuICAgICAgfSk7XG4gICAgICBpbm5lckluc2lkZVdyYXBEaXYuYXBwZW5kKCRyZXNvbHZlZEVsZW0pO1xuICAgIH1cblxuICAgIGlubmVyV3JhcC5hcHBlbmQoaW5uZXJJbnNpZGVXcmFwRGl2KTtcbiAgICBpbm5lcldyYXAuYXBwZW5kKFwiPGRpdiBzdHlsZT1cXFwiY2xlYXI6IGJvdGg7XFxcIj48L2Rpdj5cIik7XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckRhdGFDaGFpblxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RDb21wbGV4U2VhcmNoQ29udGFpbmVyID0ge1xuICBfJFNpbmdsZUNvbnRyb2xFbGVtOiBudWxsLFxuICBfJENvbXBsZXhTZWFyY2hCdXR0b246IG51bGwsXG4gIF8kQ2xlYXJCdXR0b246IG51bGwsXG4gIF8kQ2xvc2VCdXR0b246IG51bGwsXG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0gPSAkc2luZ2xlQ29udHJvbEVsZW07XG4gICAgSFRNTENvbnRyb2wuU2F2ZUNvbnRyb2xOZXdJbnN0YW5jZVRvUG9vbCgkc2luZ2xlQ29udHJvbEVsZW0sIHRoaXMpO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5oaWRlKCk7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCIud2xkY3QtbGlzdC1jb21wbGV4LXNlYXJjaC1pbm5lci13cmFwXCIpLmhlaWdodChcIjMwNXB4XCIpO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwiLndsZGN0LWxpc3QtY29tcGxleC1zZWFyY2gtaW5uZXItd3JhcFwiKS5jc3MoXCJvdmVyZmxvd1wiLCBcImF1dG9cIik7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCIud2xkY3QtbGlzdC1jb21wbGV4LXNlYXJjaC1pbm5lci13cmFwXCIpLmFkZENsYXNzKFwiZGl2LWN1c3RvbS1zY3JvbGxcIik7XG4gICAgdmFyICRzZWFyY2hCdXR0b25zV3JhcCA9ICQoXCI8ZGl2IGNsYXNzPSd3bGRjdC1saXN0LWNvbXBsZXgtc2VhcmNoLWJ1dHRvbi1pbm5lci13cmFwJz48ZGl2IGNsYXNzPSdidXR0b24taW5uZXItd3JhcCc+PC9kaXY+PC9kaXY+XCIpO1xuICAgIHRoaXMuXyRDb21wbGV4U2VhcmNoQnV0dG9uID0gJChcIjxidXR0b24+5p+l6K+iPC9idXR0b24+XCIpO1xuICAgIHRoaXMuXyRDbGVhckJ1dHRvbiA9ICQoXCI8YnV0dG9uPua4heepujwvYnV0dG9uPlwiKTtcbiAgICB0aGlzLl8kQ2xvc2VCdXR0b24gPSAkKFwiPGJ1dHRvbj7lhbPpl608L2J1dHRvbj5cIik7XG4gICAgJHNlYXJjaEJ1dHRvbnNXcmFwLmZpbmQoXCIuYnV0dG9uLWlubmVyLXdyYXBcIikuYXBwZW5kKHRoaXMuXyRDb21wbGV4U2VhcmNoQnV0dG9uKS5hcHBlbmQodGhpcy5fJENsZWFyQnV0dG9uKS5hcHBlbmQodGhpcy5fJENsb3NlQnV0dG9uKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uYXBwZW5kKCRzZWFyY2hCdXR0b25zV3JhcCk7XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckRhdGFDaGFpbixcbiAgQnVpbGRlclNlYXJjaENvbmRpdGlvbjogZnVuY3Rpb24gQnVpbGRlclNlYXJjaENvbmRpdGlvbigpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICB2YXIgYWxsQ29udHJvbHMgPSB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0uZmluZChIVE1MQ29udHJvbEF0dHJzLlNFTEVDVEVEX0pCVUlMRDREQ19DVVNUT00pO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxDb250cm9scy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyICRlbGVtID0gJChhbGxDb250cm9sc1tpXSk7XG4gICAgICB2YXIgaW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sSW5zdGFuY2VCeUVsZW0oJGVsZW0pO1xuICAgICAgdmFyIHZhbE9iaiA9IGluc3RhbmNlLkdldFZhbHVlKCRlbGVtLCB7fSk7XG4gICAgICB2YXIgdmFsdWUgPSB2YWxPYmoudmFsdWU7XG5cbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgb3BlcmF0b3I6ICRlbGVtLmF0dHIoXCJjb2x1bW5vcGVyYXRvclwiKSxcbiAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgdGFibGVOYW1lOiAkZWxlbS5hdHRyKFwiY29sdW1udGFibGVuYW1lXCIpLFxuICAgICAgICAgIGZpZWxkTmFtZTogJGVsZW0uYXR0cihcImNvbHVtbm5hbWVcIilcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgR2V0U3RhdHVzOiBmdW5jdGlvbiBHZXRTdGF0dXMoKSB7XG4gICAgdmFyIHN0YXR1cyA9IHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbS5hdHRyKFwic3RhdHVzXCIpO1xuXG4gICAgaWYgKHN0YXR1cyA9PSBcIlwiKSB7XG4gICAgICBzdGF0dXMgPSBcImVuYWJsZVwiO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0dXM7XG4gIH0sXG4gIEhpZGU6IGZ1bmN0aW9uIEhpZGUoKSB7XG4gICAgdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtLmhpZGUoKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RTaW1wbGVTZWFyY2hDb250YWluZXIgPSB7XG4gIF8kU2ltcGxlU2VhcmNoQnV0dG9uOiBudWxsLFxuICBfJFNob3dDb21wbGV4U2VhcmNoQnV0dG9uOiBudWxsLFxuICBfJFNpbmdsZUNvbnRyb2xFbGVtOiBudWxsLFxuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKF9yZW5kZXJlckNoYWluUGFyYXMpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gX3JlbmRlcmVyQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtID0gJHNpbmdsZUNvbnRyb2xFbGVtO1xuICAgIHZhciBwYWdlV2lkdGggPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VXaWR0aCgpO1xuICAgIHZhciBidXR0b25XcmFwV2lkdGggPSAyMDA7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZTpmaXJzdFwiKS53aWR0aChwYWdlV2lkdGggLSBidXR0b25XcmFwV2lkdGgpO1xuICAgIEhUTUxDb250cm9sLlNhdmVDb250cm9sTmV3SW5zdGFuY2VUb1Bvb2woJHNpbmdsZUNvbnRyb2xFbGVtLCB0aGlzKTtcbiAgICB2YXIgJHNlYXJjaEJ1dHRvbnNXcmFwID0gJChcIjxkaXYgY2xhc3M9J3dsZGN0LWxpc3Qtc2ltcGxlLXNlYXJjaC1idXR0b24taW5uZXItd3JhcCcgLz5cIik7XG4gICAgJHNlYXJjaEJ1dHRvbnNXcmFwLndpZHRoKGJ1dHRvbldyYXBXaWR0aCAtIDQwKTtcbiAgICB0aGlzLl8kU2ltcGxlU2VhcmNoQnV0dG9uID0gJChcIjxidXR0b24+5p+l6K+iPC9idXR0b24+XCIpO1xuICAgIHRoaXMuXyRTaG93Q29tcGxleFNlYXJjaEJ1dHRvbiA9ICQoXCI8YnV0dG9uPumrmOe6p+afpeivojwvYnV0dG9uPlwiKTtcbiAgICAkc2VhcmNoQnV0dG9uc1dyYXAuYXBwZW5kKHRoaXMuXyRTaW1wbGVTZWFyY2hCdXR0b24pO1xuICAgICRzZWFyY2hCdXR0b25zV3JhcC5hcHBlbmQodGhpcy5fJFNob3dDb21wbGV4U2VhcmNoQnV0dG9uKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uYXBwZW5kKCRzZWFyY2hCdXR0b25zV3JhcCk7XG4gICAgSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpbihfcmVuZGVyZXJDaGFpblBhcmFzKTtcbiAgfSxcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyRGF0YUNoYWluLFxuICBCdWlsZGVyU2VhcmNoQ29uZGl0aW9uOiBmdW5jdGlvbiBCdWlsZGVyU2VhcmNoQ29uZGl0aW9uKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgIHZhciBhbGxDb250cm9scyA9IHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbS5maW5kKEhUTUxDb250cm9sQXR0cnMuU0VMRUNURURfSkJVSUxENERDX0NVU1RPTSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbENvbnRyb2xzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJGVsZW0gPSAkKGFsbENvbnRyb2xzW2ldKTtcbiAgICAgIHZhciBpbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbSgkZWxlbSk7XG4gICAgICB2YXIgdmFsT2JqID0gaW5zdGFuY2UuR2V0VmFsdWUoJGVsZW0sIHt9KTtcbiAgICAgIHZhciB2YWx1ZSA9IHZhbE9iai52YWx1ZTtcblxuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBvcGVyYXRvcjogJGVsZW0uYXR0cihcImNvbHVtbm9wZXJhdG9yXCIpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICB0YWJsZU5hbWU6ICRlbGVtLmF0dHIoXCJjb2x1bW50YWJsZW5hbWVcIiksXG4gICAgICAgICAgZmllbGROYW1lOiAkZWxlbS5hdHRyKFwiY29sdW1ubmFtZVwiKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBHZXRTdGF0dXM6IGZ1bmN0aW9uIEdldFN0YXR1cygpIHtcbiAgICB2YXIgc3RhdHVzID0gdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtLmF0dHIoXCJzdGF0dXNcIik7XG5cbiAgICBpZiAoc3RhdHVzID09IFwiXCIpIHtcbiAgICAgIHN0YXR1cyA9IFwiZW5hYmxlXCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfSxcbiAgSGlkZTogZnVuY3Rpb24gSGlkZSgpIHtcbiAgICB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0uaGlkZSgpO1xuICB9LFxuICBIaWRlQ29tcGxleEJ1dHRvbjogZnVuY3Rpb24gSGlkZUNvbXBsZXhCdXR0b24oKSB7XG4gICAgdGhpcy5fJFNob3dDb21wbGV4U2VhcmNoQnV0dG9uLnJlbW92ZSgpO1xuXG4gICAgdGhpcy5fJFNpbXBsZVNlYXJjaEJ1dHRvbi5wYXJlbnQoKS53aWR0aChcIjgwcHhcIik7XG5cbiAgICB2YXIgcGFnZVdpZHRoID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKTtcblxuICAgIHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGU6Zmlyc3RcIikud2lkdGgocGFnZVdpZHRoIC0gMTIwKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RUYWJsZUNoZWNrQm94ID0ge1xuICBSZW5kZXJlckNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckNoYWluLFxuICBSZW5kZXJlckRhdGFDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJEYXRhQ2hhaW4oX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMpIHtcbiAgICB2YXIgdmFsdWUgPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy52YWw7XG4gICAgdmFyICR0ZCA9IF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLiR0ZDtcbiAgICAkdGQuY3NzKFwidGV4dEFsaWduXCIsIFwiY2VudGVyXCIpO1xuICAgIHZhciAkY2hlY2tib3ggPSAkKFwiPGlucHV0IGlzcm93X2NoZWNrYm94PVxcXCJ0cnVlXFxcIiB0eXBlPVxcXCJjaGVja2JveFxcXCIgY2xhc3M9XFxcImxpc3QtY2hlY2tib3gtY1xcXCIgdmFsdWU9XFxcIlwiICsgdmFsdWUgKyBcIlxcXCIgcm93X2NoZWNrYm94X3JlY29yZF9pZD1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIj5cIik7XG4gICAgJGNoZWNrYm94LmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBcInNlbGZJbnN0YW5jZVwiOiB0aGlzLFxuICAgICAgXCIkZWxlbVwiOiAkY2hlY2tib3hcbiAgICB9LCB0aGlzLkNsaWNrRXZlbnQpO1xuICAgICR0ZC5odG1sKFwiXCIpO1xuICAgICR0ZC5hcHBlbmQoJGNoZWNrYm94KTtcbiAgfSxcbiAgQ2xpY2tFdmVudDogZnVuY3Rpb24gQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICB2YXIgJGVsZW0gPSBzZW5kZXIuZGF0YS4kZWxlbTtcblxuICAgIHZhciBsaXN0VGFibGVDb250YWluZXJJbnN0YW5jZSA9IFdMRENUX0xpc3RUYWJsZUNvbnRhaW5lci5fX0lubmVyRWxlbUdldEluc3RhbmNlKCRlbGVtKTtcblxuICAgIGlmICgkZWxlbS5wcm9wKFwiY2hlY2tlZFwiKSkge1xuICAgICAgbGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UuU2F2ZUNoZWNrZWRSb3dEYXRhKCRlbGVtLnZhbCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UuRGVsZXRlQ2hlY2tlZFJvd0RhdGEoJGVsZW0udmFsKCkpO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RUYWJsZUNvbnRhaW5lciA9IHtcbiAgR2V0SFRNTDogZnVuY3Rpb24gR2V0SFRNTCgpIHtcbiAgICByZXR1cm4gXCI8dGFibGUgaWQ9XFxcImV4YW1wbGVcXFwiIGNsYXNzPVxcXCJzdHJpcGUgcm93LWJvcmRlciBvcmRlci1jb2x1bW5cXFwiIHN0eWxlPVxcXCJ3aWR0aDoxMDAlXFxcIj5cXG5cIiArIFwiICAgICAgICA8dGhlYWQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aCBjb2xzcGFuPScyJz5GaXJzdCBuYW1lPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5Qb3NpdGlvbjwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+T2ZmaWNlPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aCBjb2xzcGFuPScyJz5BZ2U8L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPlNhbGFyeTwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+RXh0bi48L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPkUtbWFpbDwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5GaXJzdCBuYW1lPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5MYXN0IG5hbWU8L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPlBvc2l0aW9uPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5PZmZpY2U8L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPkFnZTwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+U3RhcnQgZGF0ZTwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+U2FsYXJ5PC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5FeHRuLjwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+RS1tYWlsPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICA8L3RoZWFkPlxcblwiICsgXCIgICAgICAgIDx0Ym9keT5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjxhIG9uY2xpY2s9J2FsZXJ0KDEpJz5UaWdlcjwvYT48L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPk5peG9uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TeXN0ZW0gQXJjaGl0ZWN0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5FZGluYnVyZ2g8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjYxPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDExLzA0LzI1PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMzIwLDgwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NTQyMTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+dC5uaXhvbkBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5HYXJyZXR0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5XaW50ZXJzPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5BY2NvdW50YW50PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Ub2t5bzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NjM8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTEvMDcvMjU8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQxNzAsNzUwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD44NDIyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5nLndpbnRlcnNAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+QXNodG9uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Db3g8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkp1bmlvciBUZWNobmljYWwgQXV0aG9yPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TYW4gRnJhbmNpc2NvPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD42NjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAwOS8wMS8xMjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDg2LDAwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MTU2MjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+YS5jb3hAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Q2VkcmljPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5LZWxseTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2VuaW9yIEphdmFzY3JpcHQgRGV2ZWxvcGVyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5FZGluYnVyZ2g8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDEyLzAzLzI5PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kNDMzLDA2MDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NjIyNDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Yy5rZWxseUBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5BaXJpPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TYXRvdTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+QWNjb3VudGFudDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+VG9reW88L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjMzPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDA4LzExLzI4PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMTYyLDcwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NTQwNzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+YS5zYXRvdUBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5CcmllbGxlPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5XaWxsaWFtc29uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5JbnRlZ3JhdGlvbiBTcGVjaWFsaXN0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5OZXcgWW9yazwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NjE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTIvMTIvMDI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQzNzIsMDAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD40ODA0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5iLndpbGxpYW1zb25AZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+SGVycm9kPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5DaGFuZGxlcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2FsZXMgQXNzaXN0YW50PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TYW4gRnJhbmNpc2NvPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD41OTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMi8wOC8wNjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDEzNyw1MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjk2MDg8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmguY2hhbmRsZXJAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+UmhvbmE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkRhdmlkc29uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5JbnRlZ3JhdGlvbiBTcGVjaWFsaXN0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Ub2t5bzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NTU8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTAvMTAvMTQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQzMjcsOTAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD42MjAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5yLmRhdmlkc29uQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkNvbGxlZW48L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkh1cnN0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5KYXZhc2NyaXB0IERldmVsb3BlcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2FuIEZyYW5jaXNjbzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Mzk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMDkvMDkvMTU8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQyMDUsNTAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMzYwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5jLmh1cnN0QGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNvbnlhPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Gcm9zdDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U29mdHdhcmUgRW5naW5lZXI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkVkaW5idXJnaDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjM8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMDgvMTIvMTM8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQxMDMsNjAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4xNjY3PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5zLmZyb3N0QGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkplbmE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkdhaW5lczwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+T2ZmaWNlIE1hbmFnZXI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkxvbmRvbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MzA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMDgvMTIvMTk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQ5MCw1NjA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjM4MTQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmouZ2FpbmVzQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlF1aW5uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5GbHlubjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U3VwcG9ydCBMZWFkPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5FZGluYnVyZ2g8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDEzLzAzLzAzPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMzQyLDAwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+OTQ5NzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+cS5mbHlubkBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5DaGFyZGU8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPk1hcnNoYWxsPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5SZWdpb25hbCBEaXJlY3RvcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2FuIEZyYW5jaXNjbzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MzY8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMDgvMTAvMTY8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQ0NzAsNjAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD42NzQxPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5jLm1hcnNoYWxsQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkhhbGV5PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5LZW5uZWR5PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TZW5pb3IgTWFya2V0aW5nIERlc2lnbmVyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Mb25kb248L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjQzPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDEyLzEyLzE4PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMzEzLDUwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MzU5NzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+aC5rZW5uZWR5QGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlRhdHlhbmE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkZpdHpwYXRyaWNrPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5SZWdpb25hbCBEaXJlY3RvcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TG9uZG9uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4xOTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMC8wMy8xNzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDM4NSw3NTA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjE5NjU8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPnQuZml0enBhdHJpY2tAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TWljaGFlbDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2lsdmE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPk1hcmtldGluZyBEZXNpZ25lcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TG9uZG9uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD42NjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMi8xMS8yNzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDE5OCw1MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjE1ODE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPm0uc2lsdmFAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Q2hhcmRlPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5NYXJzaGFsbDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+UmVnaW9uYWwgRGlyZWN0b3I8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNhbiBGcmFuY2lzY288L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjM2PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDA4LzEwLzE2PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kNDcwLDYwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Njc0MTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Yy5tYXJzaGFsbEBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5IYWxleTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+S2VubmVkeTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2VuaW9yIE1hcmtldGluZyBEZXNpZ25lcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TG9uZG9uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD40MzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMi8xMi8xODwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDMxMyw1MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjM1OTc8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmgua2VubmVkeUBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5UYXR5YW5hPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5GaXR6cGF0cmljazwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+UmVnaW9uYWwgRGlyZWN0b3I8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkxvbmRvbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MTk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTAvMDMvMTc8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQzODUsNzUwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4xOTY1PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD50LmZpdHpwYXRyaWNrQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPk1pY2hhZWw8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNpbHZhPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5NYXJrZXRpbmcgRGVzaWduZXI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkxvbmRvbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NjY8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTIvMTEvMjc8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQxOTgsNTAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4xNTgxPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5tLnNpbHZhQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICA8L3Rib2R5PlxcblwiICsgXCIgICAgPC90YWJsZT5cIjtcbiAgfSxcbiAgX0luc3RhbmNlTWFwOiB7fSxcbiAgX0N1cnJlbnRQYWdlTnVtOiAxLFxuICBfRGF0YVNldDogbnVsbCxcbiAgX0RhdGFTZXRSdW50aW1lSW5zdGFuY2U6IG51bGwsXG4gIF9DYWNoZSRTaW5nbGVDb250cm9sRWxlbTogbnVsbCxcbiAgX0NhY2hlUmVuZGVyZXJEYXRhQ2hhaW5QYXJhczogbnVsbCxcbiAgX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlOiBudWxsLFxuICBfQ29tcGxleFNlYXJjaENvbnRhaW5lckluc3RhbmNlOiBudWxsLFxuICBfUXVlcnlQT0xpc3Q6IFtdLFxuICBfQ2hlY2tlZFJlY29yZEFycmF5OiBbXSxcbiAgXyRFbGVtOiBudWxsLFxuICBHZXRJbnN0YW5jZTogZnVuY3Rpb24gR2V0SW5zdGFuY2UobmFtZSkge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9JbnN0YW5jZU1hcCkge1xuICAgICAgaWYgKGtleSA9PSBuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9JbnN0YW5jZU1hcFtrZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBpbnN0YW5jZSA9IGV2YWwobmFtZSk7XG4gICAgdGhpcy5fSW5zdGFuY2VNYXBbbmFtZV0gPSBpbnN0YW5jZTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0sXG4gIEluaXRpYWxpemU6IGZ1bmN0aW9uIEluaXRpYWxpemUoKSB7XG4gICAgdGhpcy5fRGF0YVNldFJ1bnRpbWVJbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoRGF0YVNldFJ1bnRpbWUpO1xuICB9LFxuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKF9yZW5kZXJlckNoYWluUGFyYXMpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gX3JlbmRlcmVyQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdGhpcy5fJEVsZW0gPSAkc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdmFyICRzaW1wbGVTZWFyY2hDb250YWluZXJFbGVtID0gJHNpbmdsZUNvbnRyb2xFbGVtLnByZXZBbGwoXCJbY2xpZW50X3Jlc29sdmU9J1dMRENUX0xpc3RTaW1wbGVTZWFyY2hDb250YWluZXInXVwiKTtcbiAgICB2YXIgJGNvbXBsZXhTZWFyY2hDb250YWluZXJFbGVtID0gJHNpbmdsZUNvbnRyb2xFbGVtLnByZXZBbGwoXCJbY2xpZW50X3Jlc29sdmU9J1dMRENUX0xpc3RDb21wbGV4U2VhcmNoQ29udGFpbmVyJ11cIik7XG4gICAgdGhpcy5fU2ltcGxlU2VhcmNoQ29udGFpbmVySW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sSW5zdGFuY2VCeUVsZW0oJHNpbXBsZVNlYXJjaENvbnRhaW5lckVsZW0pO1xuICAgIHRoaXMuX0NvbXBsZXhTZWFyY2hDb250YWluZXJJbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbSgkY29tcGxleFNlYXJjaENvbnRhaW5lckVsZW0pO1xuICAgIEhUTUxDb250cm9sLlNhdmVDb250cm9sTmV3SW5zdGFuY2VUb1Bvb2woJHNpbmdsZUNvbnRyb2xFbGVtLCB0aGlzKTtcblxuICAgIHRoaXMuX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlLl8kU2ltcGxlU2VhcmNoQnV0dG9uLmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBcImxpc3RJbnN0YW5jZVwiOiB0aGlzXG4gICAgfSwgdGhpcy5TaW1wbGVTZWFyY2hDbGlja0V2ZW50KTtcblxuICAgIHRoaXMuX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlLl8kU2hvd0NvbXBsZXhTZWFyY2hCdXR0b24uYmluZChcImNsaWNrXCIsIHtcbiAgICAgIFwibGlzdEluc3RhbmNlXCI6IHRoaXNcbiAgICB9LCB0aGlzLlNob3dDb21wbGV4U2VhcmNoQ2xpY2tFdmVudCk7XG5cbiAgICB0aGlzLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UuXyRDb21wbGV4U2VhcmNoQnV0dG9uLmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBcImxpc3RJbnN0YW5jZVwiOiB0aGlzXG4gICAgfSwgdGhpcy5Db21wbGV4U2VhcmNoQ2xpY2tFdmVudCk7XG5cbiAgICB0aGlzLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UuXyRDbGVhckJ1dHRvbi5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgXCJsaXN0SW5zdGFuY2VcIjogdGhpc1xuICAgIH0sIHRoaXMuQ29tcGxleFNlYXJjaENsZWFyQ2xpY2tFdmVudCk7XG5cbiAgICB0aGlzLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UuXyRDbG9zZUJ1dHRvbi5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgXCJsaXN0SW5zdGFuY2VcIjogdGhpc1xuICAgIH0sIHRoaXMuQ29tcGxleFNlYXJjaENsb3NlQ2xpY2tFdmVudCk7XG5cbiAgICBpZiAodGhpcy5fU2ltcGxlU2VhcmNoQ29udGFpbmVySW5zdGFuY2UuR2V0U3RhdHVzKCkgPT0gXCJkaXNhYmxlXCIpIHtcbiAgICAgIHRoaXMuX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlLkhpZGUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fQ29tcGxleFNlYXJjaENvbnRhaW5lckluc3RhbmNlLkdldFN0YXR1cygpID09IFwiZGlzYWJsZVwiKSB7XG4gICAgICB0aGlzLl9TaW1wbGVTZWFyY2hDb250YWluZXJJbnN0YW5jZS5IaWRlQ29tcGxleEJ1dHRvbigpO1xuICAgIH1cblxuICAgIHZhciAkdGVtcGxhdGVUYWJsZSA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGVcIik7XG4gICAgdmFyICR0ZW1wbGF0ZVRhYmxlUm93ID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZSB0Ym9keSB0clwiKTtcbiAgICB2YXIgJHRlbXBsYXRlVGFibGVIZWFkZXJSb3dzID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZSB0aGVhZCB0clwiKTtcbiAgICB0aGlzLkFwcGVuZENoZWNrQm94Q29sdW1uVGVtcGxhdGUoJHRlbXBsYXRlVGFibGUsICR0ZW1wbGF0ZVRhYmxlSGVhZGVyUm93cywgJHRlbXBsYXRlVGFibGVSb3cpO1xuICAgIEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcyk7XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbihfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcywgaXNSZVJlbmRlcmVyKSB7XG4gICAgdmFyIHVzZWRUb3BEYXRhU2V0ID0gdHJ1ZTtcbiAgICB2YXIgZGF0YVNldElkO1xuICAgIHZhciBwYWdlU2l6ZTtcblxuICAgIGlmICh1c2VkVG9wRGF0YVNldCkge1xuICAgICAgZGF0YVNldElkID0gX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMudG9wRGF0YVNldElkO1xuICAgICAgcGFnZVNpemUgPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy5saXN0RW50aXR5Lmxpc3REYXRhc2V0UGFnZVNpemU7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9DYWNoZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMpIHtcbiAgICAgIHRoaXMuX0NhY2hlUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcyA9IF9yZW5kZXJlckRhdGFDaGFpblBhcmFzO1xuICAgICAgdGhpcy5fQ2FjaGUkU2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW0uY2xvbmUoKTtcbiAgICB9XG5cbiAgICBpZiAoaXNSZVJlbmRlcmVyKSB7XG4gICAgICBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW0uaHRtbCh0aGlzLl9DYWNoZSRTaW5nbGVDb250cm9sRWxlbS5odG1sKCkpO1xuICAgIH1cblxuICAgIGlmIChfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy5saXN0UnVudGltZUluc3RhbmNlLklzUHJldmlldygpKSB7XG4gICAgICB2YXIgbW9ja0RhdGFTZXQgPSB7XG4gICAgICAgIFwidG90YWxcIjogMTAwMCxcbiAgICAgICAgXCJsaXN0XCI6IFtdLFxuICAgICAgICBcInBhZ2VOdW1cIjogMSxcbiAgICAgICAgXCJwYWdlU2l6ZVwiOiA1LFxuICAgICAgICBcInNpemVcIjogNSxcbiAgICAgICAgXCJzdGFydFJvd1wiOiAxLFxuICAgICAgICBcImVuZFJvd1wiOiA1LFxuICAgICAgICBcInBhZ2VzXCI6IDIwMCxcbiAgICAgICAgXCJwcmVQYWdlXCI6IDAsXG4gICAgICAgIFwibmV4dFBhZ2VcIjogMixcbiAgICAgICAgXCJpc0ZpcnN0UGFnZVwiOiB0cnVlLFxuICAgICAgICBcImlzTGFzdFBhZ2VcIjogZmFsc2UsXG4gICAgICAgIFwiaGFzUHJldmlvdXNQYWdlXCI6IGZhbHNlLFxuICAgICAgICBcImhhc05leHRQYWdlXCI6IHRydWUsXG4gICAgICAgIFwibmF2aWdhdGVQYWdlc1wiOiA4LFxuICAgICAgICBcIm5hdmlnYXRlcGFnZU51bXNcIjogWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdLFxuICAgICAgICBcIm5hdmlnYXRlRmlyc3RQYWdlXCI6IDEsXG4gICAgICAgIFwibmF2aWdhdGVMYXN0UGFnZVwiOiA4LFxuICAgICAgICBcImZpcnN0UGFnZVwiOiAxLFxuICAgICAgICBcImxhc3RQYWdlXCI6IDhcbiAgICAgIH07XG4gICAgICB0aGlzLl9EYXRhU2V0ID0gbW9ja0RhdGFTZXQ7XG4gICAgICB0aGlzLkNyZWF0ZVRhYmxlKF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbSwgbW9ja0RhdGFTZXQsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0TG9hZGluZyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkLCB7XG4gICAgICAgIHRpdGxlOiBcIuezu+e7n+aPkOekulwiLFxuICAgICAgICBoaWRlOiB7XG4gICAgICAgICAgZWZmZWN0OiBcImZhZGVcIixcbiAgICAgICAgICBkdXJhdGlvbjogNTAwXG4gICAgICAgIH1cbiAgICAgIH0sIFwi5pWw5o2u5Yqg6L295LitLOivt+eojeWAmS4uLi5cIik7XG5cbiAgICAgIHRoaXMuX0RhdGFTZXRSdW50aW1lSW5zdGFuY2UuR2V0RGF0YVNldERhdGEoe1xuICAgICAgICBkYXRhU2V0SWQ6IGRhdGFTZXRJZCxcbiAgICAgICAgcGFnZVNpemU6IHBhZ2VTaXplLFxuICAgICAgICBwYWdlTnVtOiB0aGlzLl9DdXJyZW50UGFnZU51bSxcbiAgICAgICAgbGlzdFF1ZXJ5UE9MaXN0OiB0aGlzLl9RdWVyeVBPTGlzdCxcbiAgICAgICAgZXhWYWx1ZTE6IFwiXCIsXG4gICAgICAgIGV4VmFsdWUyOiBcIlwiLFxuICAgICAgICBleFZhbHVlMzogXCJcIlxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy5kYXRhU2V0ID0gcmVzdWx0LmRhdGE7XG4gICAgICAgIHRoaXMuX0RhdGFTZXQgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgdGhpcy5DcmVhdGVUYWJsZShfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW0sIHRoaXMuX0RhdGFTZXQsIGZhbHNlKTtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQpO1xuICAgICAgICB9LCA1MDApO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9LFxuICBDcmVhdGVUYWJsZTogZnVuY3Rpb24gQ3JlYXRlVGFibGUoJHNpbmdsZUNvbnRyb2xFbGVtLCBkYXRhU2V0LCBpc1ByZXZpZXcpIHtcbiAgICB2YXIgJHRlbXBsYXRlVGFibGUgPSAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcInRhYmxlXCIpO1xuICAgIHZhciAkdGVtcGxhdGVUYWJsZVJvdyA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGUgdGJvZHkgdHJcIik7XG4gICAgdmFyICR0ZW1wbGF0ZVRhYmxlSGVhZGVyUm93cyA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGUgdGhlYWQgdHJcIik7XG5cbiAgICBpZiAoJHRlbXBsYXRlVGFibGVSb3cubGVuZ3RoID4gMCkge1xuICAgICAgdmFyICR0ZW1wbGF0ZVRhYmxlQm9keSA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGUgdGJvZHlcIik7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YVNldC5saXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICR0ZW1wbGF0ZVRhYmxlQm9keS5hcHBlbmQodGhpcy5SZW5kZXJlclNpbmdsZVJvdygkdGVtcGxhdGVUYWJsZSwgJHRlbXBsYXRlVGFibGVSb3csIGRhdGFTZXQsIGRhdGFTZXQubGlzdFtpXSkpO1xuICAgICAgfVxuXG4gICAgICAkdGVtcGxhdGVUYWJsZVJvdy5yZW1vdmUoKTtcblxuICAgICAgaWYgKGlzUHJldmlldykge1xuICAgICAgICAkdGVtcGxhdGVUYWJsZS5maW5kKFwiW3NpbmdsZW5hbWU9J1dMRENUX0xpc3RUYWJsZUlubmVyQnV0dG9uQ29udGFpbmVyJ11cIikucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCIud2xkY3QtbGlzdC10YWJsZS1pbm5lci13cmFwXCIpLmFwcGVuZCh0aGlzLkNyZWF0ZVBhZ2luZygpKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcIi53bGRjdC1saXN0LXRhYmxlLWlubmVyLXdyYXBcIikud2lkdGgoUGFnZVN0eWxlVXRpbGl0eS5HZXRXaW5kb3dXaWR0aCgpIC0gMjApO1xuICAgICR0ZW1wbGF0ZVRhYmxlLmFkZENsYXNzKFwic3RyaXBlIHJvdy1ib3JkZXIgb3JkZXItY29sdW1uXCIpO1xuICAgICR0ZW1wbGF0ZVRhYmxlLndpZHRoKFwiMTAwJVwiKTtcbiAgICB2YXIgc2Nyb2xsWSA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0V2luZG93SGVpZ2h0KCkgLSAkKFwiLndsZGN0LWxpc3Qtc2ltcGxlLXNlYXJjaC1vdXRlci13cmFwXCIpLmhlaWdodCgpIC0gJChcIi53bGRjdC1saXN0LWJ1dHRvbi1vdXRlci13cmFwXCIpLmhlaWdodCgpIC0gMTYwO1xuICAgIHZhciB0YWJsZSA9ICR0ZW1wbGF0ZVRhYmxlLkRhdGFUYWJsZSh7XG4gICAgICBzY3JvbGxZOiBzY3JvbGxZLFxuICAgICAgc2Nyb2xsWDogdHJ1ZSxcbiAgICAgIHBhZ2luZzogZmFsc2UsXG4gICAgICBcIm9yZGVyaW5nXCI6IGZhbHNlLFxuICAgICAgXCJzZWFyY2hpbmdcIjogZmFsc2UsXG4gICAgICBcImluZm9cIjogZmFsc2VcbiAgICB9KTtcbiAgfSxcbiAgQXBwZW5kQ2hlY2tCb3hDb2x1bW5UZW1wbGF0ZTogZnVuY3Rpb24gQXBwZW5kQ2hlY2tCb3hDb2x1bW5UZW1wbGF0ZSgkdGVtcGxhdGVUYWJsZSwgJHRlbXBsYXRlVGFibGVIZWFkZXJSb3dzLCAkdGVtcGxhdGVUYWJsZVJvdykge1xuICAgIHZhciAkdGggPSAkKFwiPHRoIHN0eWxlPSd3aWR0aDogNTBweCc+6YCJ5oupPC90aD5cIik7XG5cbiAgICBpZiAoJHRlbXBsYXRlVGFibGVIZWFkZXJSb3dzLmxlbmd0aCA+IDEpIHtcbiAgICAgICR0aC5hdHRyKFwicm93c3BhblwiLCAkdGVtcGxhdGVUYWJsZUhlYWRlclJvd3MubGVuZ3RoKTtcbiAgICB9XG5cbiAgICAkKCR0ZW1wbGF0ZVRhYmxlSGVhZGVyUm93c1swXSkucHJlcGVuZCgkdGgpO1xuICAgICQoJHRlbXBsYXRlVGFibGVSb3cuZXEoMCkpLnByZXBlbmQoXCI8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5hbGlnbj1cXFwiXFx1NUM0NVxcdTRFMkRcXHU1QkY5XFx1OUY1MFxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uY2FwdGlvbj1cXFwiSURcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbmRhdGF0eXBlbmFtZT1cXFwiXFx1NUI1N1xcdTdCMjZcXHU0RTMyXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5uYW1lPVxcXCJJRFxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1udGFibGVuYW1lPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xfY2F0ZWdvcnk9XFxcIklucHV0Q29udHJvbFxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdGNsaWVudHJlbmRlcmVybWV0aG9kPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RjbGllbnRyZW5kZXJlcm1ldGhvZHBhcmE9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdHNlcnZlcnJlc29sdmVtZXRob2Q9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdHNlcnZlcnJlc29sdmVtZXRob2RwYXJhPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHR0ZXh0PVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHR0eXBlPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHR2YWx1ZT1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVxcXCJjaGVja19ib3hfdGVtcGxhdGVcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX2pidWlsZDRkY19kYXRhPVxcXCJ0cnVlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqYnVpbGQ0ZGNfY3VzdG9tPVxcXCJ0cnVlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPVxcXCJjaGVja19ib3hfdGVtcGxhdGVcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmlhbGl6ZT1cXFwidHJ1ZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd19yZW1vdmVfYnV0dG9uPVxcXCJ0cnVlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW5nbGVuYW1lPVxcXCJXTERDVF9MaXN0VGFibGVDaGVja0JveFxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0YnV0dG9uaWQ9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50X3Jlc29sdmU9XFxcIldMRENUX0xpc3RUYWJsZUNoZWNrQm94XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSURcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cIik7XG4gIH0sXG4gIFJlbmRlcmVyU2luZ2xlUm93OiBmdW5jdGlvbiBSZW5kZXJlclNpbmdsZVJvdygkdGVtcGxhdGVUYWJsZSwgJHRlbXBsYXRlVGFibGVSb3csIGRhdGFTZXQsIHJvd0RhdGEpIHtcbiAgICB2YXIgJGNsb25lUm93ID0gJHRlbXBsYXRlVGFibGVSb3cuY2xvbmUoKTtcbiAgICB2YXIgJHRkcyA9ICRjbG9uZVJvdy5maW5kKFwidGRcIik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8ICR0ZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciAkdGQgPSAkKCR0ZHNbaV0pO1xuICAgICAgdmFyICRkaXZDVEVsZW0gPSAkdGQuZmluZChcImRpdlwiICsgSFRNTENvbnRyb2xBdHRycy5TRUxFQ1RFRF9KQlVJTEQ0RENfQ1VTVE9NKTtcblxuICAgICAgaWYgKCRkaXZDVEVsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgYmluZFRvRmllbGQgPSAkZGl2Q1RFbGVtLmF0dHIoXCJjb2x1bW5uYW1lXCIpO1xuICAgICAgICB2YXIgdmFsID0gcm93RGF0YVtiaW5kVG9GaWVsZF07XG4gICAgICAgIHZhciBjbGllbnRSZXNvbHZlSW5zdGFuY2VOYW1lID0gJGRpdkNURWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuQ0xJRU5UX1JFU09MVkUpO1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBXTERDVF9MaXN0VGFibGVDb250YWluZXIuR2V0SW5zdGFuY2UoY2xpZW50UmVzb2x2ZUluc3RhbmNlTmFtZSk7XG4gICAgICAgIGluc3RhbmNlLlJlbmRlcmVyRGF0YUNoYWluKHtcbiAgICAgICAgICAkdGVtcGxhdGVUYWJsZTogJHRlbXBsYXRlVGFibGUsXG4gICAgICAgICAgJHRlbXBsYXRlVGFibGVSb3c6ICR0ZW1wbGF0ZVRhYmxlUm93LFxuICAgICAgICAgICRzaW5nbGVDb250cm9sRWxlbTogJGRpdkNURWxlbSxcbiAgICAgICAgICBkYXRhU2V0OiBkYXRhU2V0LFxuICAgICAgICAgIHJvd0RhdGE6IHJvd0RhdGEsXG4gICAgICAgICAgJGNsb25lUm93OiAkY2xvbmVSb3csXG4gICAgICAgICAgJHRkOiAkdGQsXG4gICAgICAgICAgdmFsOiB2YWxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICRjbG9uZVJvdztcbiAgfSxcbiAgQ3JlYXRlUGFnaW5nOiBmdW5jdGlvbiBDcmVhdGVQYWdpbmcoJHRlbXBsYXRlVGFibGUsICR0ZW1wbGF0ZVRhYmxlUm93LCBkYXRhU2V0LCByb3dEYXRhLCAkcm93LCAkdGQsIHZhbHVlKSB7XG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHZhciBwYWdpbmdPdXRlckVsZW0gPSAkKFwiPGRpdiBjbGFzcz0ndGFibGUtcGFnaW5nLW91dGVyJz48ZGl2IGNsYXNzPSd0YWJsZS1wYWdpbmctaW5uZXInPjwvZGl2PjwvZGl2PlwiKTtcbiAgICB2YXIgcGFnaW5nSW5uZXJFbGVtID0gcGFnaW5nT3V0ZXJFbGVtLmZpbmQoXCJkaXZcIik7XG4gICAgdmFyIGZpcnN0UGFnZSA9ICQoXCI8ZGl2IGNsYXNzPSd0YWJsZS1wYWdpbmctYnV0dG9uJz7nrKzkuIDpobU8L2Rpdj5cIik7XG4gICAgZmlyc3RQYWdlLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIF9zZWxmLkNoYW5nZVBhZ2VOdW0oMSk7XG4gICAgfSk7XG4gICAgdmFyIHByZVBhZ2UgPSAkKFwiPGRpdiBjbGFzcz0ndGFibGUtcGFnaW5nLWJ1dHRvbic+5LiK5LiA6aG1PC9kaXY+XCIpO1xuICAgIHByZVBhZ2UuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKF9zZWxmLl9DdXJyZW50UGFnZU51bSA+IDEpIHtcbiAgICAgICAgX3NlbGYuQ2hhbmdlUGFnZU51bShfc2VsZi5fQ3VycmVudFBhZ2VOdW0gLSAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5bey57uP5Yiw6L6+56ys5LiA6aG1IVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgbGFzdFBhZ2UgPSAkKFwiPGRpdiBjbGFzcz0ndGFibGUtcGFnaW5nLWJ1dHRvbic+5pyr6aG1PC9kaXY+XCIpO1xuICAgIGxhc3RQYWdlLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIF9zZWxmLkNoYW5nZVBhZ2VOdW0oX3NlbGYuX0RhdGFTZXQucGFnZXMpO1xuICAgIH0pO1xuICAgIHZhciBuZXh0UGFnZSA9ICQoXCI8ZGl2IGNsYXNzPSd0YWJsZS1wYWdpbmctYnV0dG9uJz7kuIvkuIDpobU8L2Rpdj5cIik7XG4gICAgbmV4dFBhZ2UuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKF9zZWxmLl9DdXJyZW50UGFnZU51bSA8IF9zZWxmLl9EYXRhU2V0LnBhZ2VzKSB7XG4gICAgICAgIF9zZWxmLkNoYW5nZVBhZ2VOdW0oX3NlbGYuX0N1cnJlbnRQYWdlTnVtICsgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuW3sue7j+WIsOi+vuacgOacq+mhtSFcIik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGluZm8gPSAkKFwiPGRpdiBjbGFzcz0ndGFibGUtcGFnaW5nLWluZm8nPuaAu+adoeaVsOOAkFwiICsgX3NlbGYuX0RhdGFTZXQudG90YWwgKyBcIuOAkSZuYnNwOyZuYnNwO+mhteaVsOOAkFwiICsgX3NlbGYuX0N1cnJlbnRQYWdlTnVtICsgXCIvXCIgKyBfc2VsZi5fRGF0YVNldC5wYWdlcyArIFwi44CRPC9kaXY+XCIpO1xuICAgIHBhZ2luZ0lubmVyRWxlbS5hcHBlbmQoZmlyc3RQYWdlKS5hcHBlbmQocHJlUGFnZSkuYXBwZW5kKG5leHRQYWdlKS5hcHBlbmQobGFzdFBhZ2UpLmFwcGVuZChpbmZvKTtcbiAgICByZXR1cm4gcGFnaW5nT3V0ZXJFbGVtO1xuICB9LFxuICBDaGFuZ2VQYWdlTnVtOiBmdW5jdGlvbiBDaGFuZ2VQYWdlTnVtKHBhZ2VOdW0pIHtcbiAgICB0aGlzLl9DdXJyZW50UGFnZU51bSA9IHBhZ2VOdW07XG4gICAgdGhpcy5SZW5kZXJlckRhdGFDaGFpbih0aGlzLl9DYWNoZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMsIHRydWUpO1xuICB9LFxuICBTaW1wbGVTZWFyY2hDbGlja0V2ZW50OiBmdW5jdGlvbiBTaW1wbGVTZWFyY2hDbGlja0V2ZW50KHNlbmRlcikge1xuICAgIHZhciBfc2VsZiA9IHNlbmRlci5kYXRhLmxpc3RJbnN0YW5jZTtcblxuICAgIHZhciBjb25kaXRpb25zID0gX3NlbGYuX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlLkJ1aWxkZXJTZWFyY2hDb25kaXRpb24oKTtcblxuICAgIF9zZWxmLl9RdWVyeVBPTGlzdCA9IGNvbmRpdGlvbnM7XG5cbiAgICBfc2VsZi5SZW5kZXJlckRhdGFDaGFpbihfc2VsZi5fQ2FjaGVSZW5kZXJlckRhdGFDaGFpblBhcmFzLCB0cnVlKTtcbiAgfSxcbiAgU2hvd0NvbXBsZXhTZWFyY2hDbGlja0V2ZW50OiBmdW5jdGlvbiBTaG93Q29tcGxleFNlYXJjaENsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgdmFyIF9zZWxmID0gc2VuZGVyLmRhdGEubGlzdEluc3RhbmNlO1xuICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihfc2VsZi5fQ29tcGxleFNlYXJjaENvbnRhaW5lckluc3RhbmNlLl8kU2luZ2xlQ29udHJvbEVsZW0sIHtcbiAgICAgIHRpdGxlOiBcIumrmOe6p+afpeivolwiLFxuICAgICAgaGVpZ2h0OiA0MTAsXG4gICAgICB3aWR0aDogODAwLFxuICAgICAgbW9kYWw6IHRydWVcbiAgICB9KTtcbiAgfSxcbiAgQ29tcGxleFNlYXJjaENsaWNrRXZlbnQ6IGZ1bmN0aW9uIENvbXBsZXhTZWFyY2hDbGlja0V2ZW50KHNlbmRlcikge1xuICAgIGNvbnNvbGUubG9nKFwi6auY57qn5p+l6K+iLlwiKTtcbiAgICB2YXIgX3NlbGYgPSBzZW5kZXIuZGF0YS5saXN0SW5zdGFuY2U7XG5cbiAgICB2YXIgc2ltcGxlQ29uZGl0aW9ucyA9IF9zZWxmLl9TaW1wbGVTZWFyY2hDb250YWluZXJJbnN0YW5jZS5CdWlsZGVyU2VhcmNoQ29uZGl0aW9uKCk7XG5cbiAgICB2YXIgY29tcGxleENvbmRpdGlvbnMgPSBfc2VsZi5fQ29tcGxleFNlYXJjaENvbnRhaW5lckluc3RhbmNlLkJ1aWxkZXJTZWFyY2hDb25kaXRpb24oKTtcblxuICAgIF9zZWxmLl9RdWVyeVBPTGlzdCA9IGNvbXBsZXhDb25kaXRpb25zLmNvbmNhdChzaW1wbGVDb25kaXRpb25zKTtcblxuICAgIF9zZWxmLlJlbmRlcmVyRGF0YUNoYWluKF9zZWxmLl9DYWNoZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMsIHRydWUpO1xuXG4gICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0oX3NlbGYuX0NvbXBsZXhTZWFyY2hDb250YWluZXJJbnN0YW5jZS5fJFNpbmdsZUNvbnRyb2xFbGVtKTtcbiAgfSxcbiAgQ29tcGxleFNlYXJjaENsb3NlQ2xpY2tFdmVudDogZnVuY3Rpb24gQ29tcGxleFNlYXJjaENsb3NlQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICB2YXIgX3NlbGYgPSBzZW5kZXIuZGF0YS5saXN0SW5zdGFuY2U7XG4gICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0oX3NlbGYuX0NvbXBsZXhTZWFyY2hDb250YWluZXJJbnN0YW5jZS5fJFNpbmdsZUNvbnRyb2xFbGVtKTtcbiAgfSxcbiAgQ29tcGxleFNlYXJjaENsZWFyQ2xpY2tFdmVudDogZnVuY3Rpb24gQ29tcGxleFNlYXJjaENsZWFyQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICB2YXIgX3NlbGYgPSBzZW5kZXIuZGF0YS5saXN0SW5zdGFuY2U7XG4gICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLmnKrlrp7njrAhXCIpO1xuICB9LFxuICBHZXRSZWNvcmREYXRhOiBmdW5jdGlvbiBHZXRSZWNvcmREYXRhKGlkKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5fRGF0YVNldCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX0RhdGFTZXQubGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJlY29yZERhdGEgPSB0aGlzLl9EYXRhU2V0Lmxpc3RbaV07XG5cbiAgICAgIGlmIChyZWNvcmREYXRhLklEID09IGlkKSB7XG4gICAgICAgIHJldHVybiByZWNvcmREYXRhO1xuICAgICAgfVxuICAgIH1cblxuICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5om+5LiN5YiwSUTkuLo6XCIgKyBpZCArIFwi55qE6K6w5b2VIVwiKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgU2F2ZUNoZWNrZWRSb3dEYXRhOiBmdW5jdGlvbiBTYXZlQ2hlY2tlZFJvd0RhdGEoaWQpIHtcbiAgICB2YXIgcmVjb3JkID0gdGhpcy5HZXRSZWNvcmREYXRhKGlkKTtcblxuICAgIGlmIChyZWNvcmQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fQ2hlY2tlZFJlY29yZEFycmF5LnB1c2goe1xuICAgICAgICBcIklkXCI6IGlkLFxuICAgICAgICBcIlJlY29yZFwiOiByZWNvcmRcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgRGVsZXRlQ2hlY2tlZFJvd0RhdGE6IGZ1bmN0aW9uIERlbGV0ZUNoZWNrZWRSb3dEYXRhKGlkKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9DaGVja2VkUmVjb3JkQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLl9DaGVja2VkUmVjb3JkQXJyYXlbaV0uSWQgPT0gaWQpIHtcbiAgICAgICAgQXJyYXlVdGlsaXR5LkRlbGV0ZSh0aGlzLl9DaGVja2VkUmVjb3JkQXJyYXksIGkpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgR2V0Q2hlY2tlZFJlY29yZDogZnVuY3Rpb24gR2V0Q2hlY2tlZFJlY29yZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fQ2hlY2tlZFJlY29yZEFycmF5O1xuICB9LFxuICBHZXRMYXN0Q2hlY2tlZFJlY29yZDogZnVuY3Rpb24gR2V0TGFzdENoZWNrZWRSZWNvcmQoKSB7XG4gICAgaWYgKHRoaXMuX0NoZWNrZWRSZWNvcmRBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5fQ2hlY2tlZFJlY29yZEFycmF5W3RoaXMuX0NoZWNrZWRSZWNvcmRBcnJheS5sZW5ndGggLSAxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgQ2xlYXJBbGxDaGVja0JveDogZnVuY3Rpb24gQ2xlYXJBbGxDaGVja0JveCgpIHtcbiAgICB0aGlzLl8kRWxlbS5maW5kKFwiOmNoZWNrYm94XCIpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG5cbiAgICB0aGlzLl9DaGVja2VkUmVjb3JkQXJyYXkgPSBbXTtcbiAgfSxcbiAgU2V0Q2hlY2tCb3hUb0NoZWNrZWRTdGF0dXM6IGZ1bmN0aW9uIFNldENoZWNrQm94VG9DaGVja2VkU3RhdHVzKGlkKSB7XG4gICAgdGhpcy5fJEVsZW0uZmluZChcIltyb3dfY2hlY2tib3hfcmVjb3JkX2lkPSdcIiArIGlkICsgXCInXTpjaGVja2JveFwiKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG5cbiAgICB0aGlzLlNhdmVDaGVja2VkUm93RGF0YShpZCk7XG4gIH0sXG4gIF9fSW5uZXJFbGVtR2V0SW5zdGFuY2U6IGZ1bmN0aW9uIF9fSW5uZXJFbGVtR2V0SW5zdGFuY2UoJGlubmVyRWxlbSkge1xuICAgIHZhciAkV0xEQ1RfTGlzdFRhYmxlQ29udGFpbmVyID0gJGlubmVyRWxlbS5wYXJlbnRzKFwiW3NpbmdsZW5hbWU9J1dMRENUX0xpc3RUYWJsZUNvbnRhaW5lciddXCIpO1xuICAgIHZhciBsaXN0VGFibGVDb250YWluZXJJbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbSgkV0xEQ1RfTGlzdFRhYmxlQ29udGFpbmVyKTtcbiAgICByZXR1cm4gbGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2U7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXTERDVF9MaXN0VGFibGVJbm5lckJ1dHRvbkNvbnRhaW5lciA9IHtcbiAgUmVuZGVyZXJDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJDaGFpbihfcmVuZGVyZXJDaGFpblBhcmFzKSB7XG4gICAgdmFyICRzaW5nbGVDb250cm9sRWxlbSA9IF9yZW5kZXJlckNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtO1xuICAgIHZhciAkZGl2Q1RFbGVtID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJkaXZcIiArIEhUTUxDb250cm9sQXR0cnMuU0VMRUNURURfSkJVSUxENERDX0NVU1RPTSk7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmh0bWwoXCJcIik7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmFwcGVuZCgkZGl2Q1RFbGVtKTtcbiAgfSxcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyRGF0YUNoYWluXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdFRhYmxlSW5uZXJCdXR0b25TaW5nbGUgPSB7XG4gIFJlbmRlcmVyQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbihfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBcInNlbGZJbnN0YW5jZVwiOiB0aGlzLFxuICAgICAgXCIkZWxlbVwiOiAkc2luZ2xlQ29udHJvbEVsZW0sXG4gICAgICByb3dEYXRhOiBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy5yb3dEYXRhXG4gICAgfSwgdGhpcy5DbGlja0V2ZW50KTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uaHRtbChcIlwiKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uYXR0cihcInRpdGxlXCIsICRzaW5nbGVDb250cm9sRWxlbS5hdHRyKFwiY2FwdGlvblwiKSk7XG4gIH0sXG4gIENsaWNrRXZlbnQ6IGZ1bmN0aW9uIENsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgY29uc29sZS5sb2coc2VuZGVyLmRhdGEucm93RGF0YS5JRCk7XG4gICAgdmFyICRlbGVtID0gc2VuZGVyLmRhdGEuJGVsZW07XG4gICAgY29uc29sZS5sb2coJGVsZW0pO1xuICAgIHZhciB0YXJnZXRidXR0b25pZCA9ICRlbGVtLmF0dHIoXCJ0YXJnZXRidXR0b25pZFwiKTtcblxuICAgIHZhciBsaXN0VGFibGVDb250YWluZXJJbnN0YW5jZSA9IFdMRENUX0xpc3RUYWJsZUNvbnRhaW5lci5fX0lubmVyRWxlbUdldEluc3RhbmNlKCRlbGVtKTtcblxuICAgIGxpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlLkNsZWFyQWxsQ2hlY2tCb3goKTtcbiAgICBsaXN0VGFibGVDb250YWluZXJJbnN0YW5jZS5TZXRDaGVja0JveFRvQ2hlY2tlZFN0YXR1cyhzZW5kZXIuZGF0YS5yb3dEYXRhLklEKTtcbiAgICBjb25zb2xlLmxvZyh0YXJnZXRidXR0b25pZCk7XG4gICAgJChcImJ1dHRvbiNcIiArIHRhcmdldGJ1dHRvbmlkKS50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgY29uc29sZS5sb2cobGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdFRhYmxlTGFiZWwgPSB7XG4gIFJlbmRlcmVyQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbihfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcykge1xuICAgIHZhciB2YWx1ZSA9IF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLnZhbDtcbiAgICB2YXIgJHRkID0gX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMuJHRkO1xuICAgICR0ZC5jc3MoXCJ0ZXh0QWxpZ25cIiwgXCJjZW50ZXJcIik7XG4gICAgJHRkLmh0bWwodmFsdWUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfU2VhcmNoX1RleHRCb3ggPSB7XG4gIFJlbmRlcmVyQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckRhdGFDaGFpbixcbiAgR2V0VmFsdWU6IEhUTUxDb250cm9sLkdldFZhbHVlXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ2pxdWVyeScsICdkYXRhdGFibGVzLm5ldCddLCBmdW5jdGlvbiAoJCkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoJCwgd2luZG93LCBkb2N1bWVudCk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoKHR5cGVvZiBleHBvcnRzID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YoZXhwb3J0cykpID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvb3QsICQpIHtcbiAgICAgIGlmICghcm9vdCkge1xuICAgICAgICByb290ID0gd2luZG93O1xuICAgICAgfVxuXG4gICAgICBpZiAoISQgfHwgISQuZm4uZGF0YVRhYmxlKSB7XG4gICAgICAgICQgPSByZXF1aXJlKCdkYXRhdGFibGVzLm5ldCcpKHJvb3QsICQpLiQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWN0b3J5KCQsIHJvb3QsIHJvb3QuZG9jdW1lbnQpO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgZmFjdG9yeShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuICB9XG59KShmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgRGF0YVRhYmxlID0gJC5mbi5kYXRhVGFibGU7XG5cbiAgdmFyIF9maXJlZm94U2Nyb2xsO1xuXG4gIHZhciBGaXhlZENvbHVtbnMgPSBmdW5jdGlvbiBGaXhlZENvbHVtbnMoZHQsIGluaXQpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRml4ZWRDb2x1bW5zKSkge1xuICAgICAgYWxlcnQoXCJGaXhlZENvbHVtbnMgd2FybmluZzogRml4ZWRDb2x1bW5zIG11c3QgYmUgaW5pdGlhbGlzZWQgd2l0aCB0aGUgJ25ldycga2V5d29yZC5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGluaXQgPT09IHVuZGVmaW5lZCB8fCBpbml0ID09PSB0cnVlKSB7XG4gICAgICBpbml0ID0ge307XG4gICAgfVxuXG4gICAgdmFyIGNhbWVsVG9IdW5nYXJpYW4gPSAkLmZuLmRhdGFUYWJsZS5jYW1lbFRvSHVuZ2FyaWFuO1xuXG4gICAgaWYgKGNhbWVsVG9IdW5nYXJpYW4pIHtcbiAgICAgIGNhbWVsVG9IdW5nYXJpYW4oRml4ZWRDb2x1bW5zLmRlZmF1bHRzLCBGaXhlZENvbHVtbnMuZGVmYXVsdHMsIHRydWUpO1xuICAgICAgY2FtZWxUb0h1bmdhcmlhbihGaXhlZENvbHVtbnMuZGVmYXVsdHMsIGluaXQpO1xuICAgIH1cblxuICAgIHZhciBkdFNldHRpbmdzID0gbmV3ICQuZm4uZGF0YVRhYmxlLkFwaShkdCkuc2V0dGluZ3MoKVswXTtcbiAgICB0aGlzLnMgPSB7XG4gICAgICBcImR0XCI6IGR0U2V0dGluZ3MsXG4gICAgICBcImlUYWJsZUNvbHVtbnNcIjogZHRTZXR0aW5ncy5hb0NvbHVtbnMubGVuZ3RoLFxuICAgICAgXCJhaU91dGVyV2lkdGhzXCI6IFtdLFxuICAgICAgXCJhaUlubmVyV2lkdGhzXCI6IFtdLFxuICAgICAgcnRsOiAkKGR0U2V0dGluZ3MublRhYmxlKS5jc3MoJ2RpcmVjdGlvbicpID09PSAncnRsJ1xuICAgIH07XG4gICAgdGhpcy5kb20gPSB7XG4gICAgICBcInNjcm9sbGVyXCI6IG51bGwsXG4gICAgICBcImhlYWRlclwiOiBudWxsLFxuICAgICAgXCJib2R5XCI6IG51bGwsXG4gICAgICBcImZvb3RlclwiOiBudWxsLFxuICAgICAgXCJncmlkXCI6IHtcbiAgICAgICAgXCJ3cmFwcGVyXCI6IG51bGwsXG4gICAgICAgIFwiZHRcIjogbnVsbCxcbiAgICAgICAgXCJsZWZ0XCI6IHtcbiAgICAgICAgICBcIndyYXBwZXJcIjogbnVsbCxcbiAgICAgICAgICBcImhlYWRcIjogbnVsbCxcbiAgICAgICAgICBcImJvZHlcIjogbnVsbCxcbiAgICAgICAgICBcImZvb3RcIjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBcInJpZ2h0XCI6IHtcbiAgICAgICAgICBcIndyYXBwZXJcIjogbnVsbCxcbiAgICAgICAgICBcImhlYWRcIjogbnVsbCxcbiAgICAgICAgICBcImJvZHlcIjogbnVsbCxcbiAgICAgICAgICBcImZvb3RcIjogbnVsbFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJjbG9uZVwiOiB7XG4gICAgICAgIFwibGVmdFwiOiB7XG4gICAgICAgICAgXCJoZWFkZXJcIjogbnVsbCxcbiAgICAgICAgICBcImJvZHlcIjogbnVsbCxcbiAgICAgICAgICBcImZvb3RlclwiOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIFwicmlnaHRcIjoge1xuICAgICAgICAgIFwiaGVhZGVyXCI6IG51bGwsXG4gICAgICAgICAgXCJib2R5XCI6IG51bGwsXG4gICAgICAgICAgXCJmb290ZXJcIjogbnVsbFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChkdFNldHRpbmdzLl9vRml4ZWRDb2x1bW5zKSB7XG4gICAgICB0aHJvdyAnRml4ZWRDb2x1bW5zIGFscmVhZHkgaW5pdGlhbGlzZWQgb24gdGhpcyB0YWJsZSc7XG4gICAgfVxuXG4gICAgZHRTZXR0aW5ncy5fb0ZpeGVkQ29sdW1ucyA9IHRoaXM7XG5cbiAgICBpZiAoIWR0U2V0dGluZ3MuX2JJbml0Q29tcGxldGUpIHtcbiAgICAgIGR0U2V0dGluZ3Mub0FwaS5fZm5DYWxsYmFja1JlZyhkdFNldHRpbmdzLCAnYW9Jbml0Q29tcGxldGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQuX2ZuQ29uc3RydWN0KGluaXQpO1xuICAgICAgfSwgJ0ZpeGVkQ29sdW1ucycpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9mbkNvbnN0cnVjdChpbml0KTtcbiAgICB9XG4gIH07XG5cbiAgJC5leHRlbmQoRml4ZWRDb2x1bW5zLnByb3RvdHlwZSwge1xuICAgIFwiZm5VcGRhdGVcIjogZnVuY3Rpb24gZm5VcGRhdGUoKSB7XG4gICAgICB0aGlzLl9mbkRyYXcodHJ1ZSk7XG4gICAgfSxcbiAgICBcImZuUmVkcmF3TGF5b3V0XCI6IGZ1bmN0aW9uIGZuUmVkcmF3TGF5b3V0KCkge1xuICAgICAgdGhpcy5fZm5Db2xDYWxjKCk7XG5cbiAgICAgIHRoaXMuX2ZuR3JpZExheW91dCgpO1xuXG4gICAgICB0aGlzLmZuVXBkYXRlKCk7XG4gICAgfSxcbiAgICBcImZuUmVjYWxjdWxhdGVIZWlnaHRcIjogZnVuY3Rpb24gZm5SZWNhbGN1bGF0ZUhlaWdodChuVHIpIHtcbiAgICAgIGRlbGV0ZSBuVHIuX0RUVENfaUhlaWdodDtcbiAgICAgIG5Uci5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgfSxcbiAgICBcImZuU2V0Um93SGVpZ2h0XCI6IGZ1bmN0aW9uIGZuU2V0Um93SGVpZ2h0KG5UYXJnZXQsIGlIZWlnaHQpIHtcbiAgICAgIG5UYXJnZXQuc3R5bGUuaGVpZ2h0ID0gaUhlaWdodCArIFwicHhcIjtcbiAgICB9LFxuICAgIFwiZm5HZXRQb3NpdGlvblwiOiBmdW5jdGlvbiBmbkdldFBvc2l0aW9uKG5vZGUpIHtcbiAgICAgIHZhciBpZHg7XG4gICAgICB2YXIgaW5zdCA9IHRoaXMucy5kdC5vSW5zdGFuY2U7XG5cbiAgICAgIGlmICghJChub2RlKS5wYXJlbnRzKCcuRFRGQ19DbG9uZWQnKS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGluc3QuZm5HZXRQb3NpdGlvbihub2RlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICd0cicpIHtcbiAgICAgICAgICBpZHggPSAkKG5vZGUpLmluZGV4KCk7XG4gICAgICAgICAgcmV0dXJuIGluc3QuZm5HZXRQb3NpdGlvbigkKCd0cicsIHRoaXMucy5kdC5uVEJvZHkpW2lkeF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBjb2xJZHggPSAkKG5vZGUpLmluZGV4KCk7XG4gICAgICAgICAgaWR4ID0gJChub2RlLnBhcmVudE5vZGUpLmluZGV4KCk7XG4gICAgICAgICAgdmFyIHJvdyA9IGluc3QuZm5HZXRQb3NpdGlvbigkKCd0cicsIHRoaXMucy5kdC5uVEJvZHkpW2lkeF0pO1xuICAgICAgICAgIHJldHVybiBbcm93LCBjb2xJZHgsIGluc3Qub0FwaS5fZm5WaXNpYmxlVG9Db2x1bW5JbmRleCh0aGlzLnMuZHQsIGNvbElkeCldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcIl9mbkNvbnN0cnVjdFwiOiBmdW5jdGlvbiBfZm5Db25zdHJ1Y3Qob0luaXQpIHtcbiAgICAgIHZhciBpLFxuICAgICAgICAgIGlMZW4sXG4gICAgICAgICAgaVdpZHRoLFxuICAgICAgICAgIHRoYXQgPSB0aGlzO1xuXG4gICAgICBpZiAodHlwZW9mIHRoaXMucy5kdC5vSW5zdGFuY2UuZm5WZXJzaW9uQ2hlY2sgIT0gJ2Z1bmN0aW9uJyB8fCB0aGlzLnMuZHQub0luc3RhbmNlLmZuVmVyc2lvbkNoZWNrKCcxLjguMCcpICE9PSB0cnVlKSB7XG4gICAgICAgIGFsZXJ0KFwiRml4ZWRDb2x1bW5zIFwiICsgRml4ZWRDb2x1bW5zLlZFUlNJT04gKyBcIiByZXF1aXJlZCBEYXRhVGFibGVzIDEuOC4wIG9yIGxhdGVyLiBcIiArIFwiUGxlYXNlIHVwZ3JhZGUgeW91ciBEYXRhVGFibGVzIGluc3RhbGxhdGlvblwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zLmR0Lm9TY3JvbGwuc1ggPT09IFwiXCIpIHtcbiAgICAgICAgdGhpcy5zLmR0Lm9JbnN0YW5jZS5vQXBpLl9mbkxvZyh0aGlzLnMuZHQsIDEsIFwiRml4ZWRDb2x1bW5zIGlzIG5vdCBuZWVkZWQgKG5vIFwiICsgXCJ4LXNjcm9sbGluZyBpbiBEYXRhVGFibGVzIGVuYWJsZWQpLCBzbyBubyBhY3Rpb24gd2lsbCBiZSB0YWtlbi4gVXNlICdGaXhlZEhlYWRlcicgZm9yIFwiICsgXCJjb2x1bW4gZml4aW5nIHdoZW4gc2Nyb2xsaW5nIGlzIG5vdCBlbmFibGVkXCIpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zID0gJC5leHRlbmQodHJ1ZSwgdGhpcy5zLCBGaXhlZENvbHVtbnMuZGVmYXVsdHMsIG9Jbml0KTtcbiAgICAgIHZhciBjbGFzc2VzID0gdGhpcy5zLmR0Lm9DbGFzc2VzO1xuICAgICAgdGhpcy5kb20uZ3JpZC5kdCA9ICQodGhpcy5zLmR0Lm5UYWJsZSkucGFyZW50cygnZGl2LicgKyBjbGFzc2VzLnNTY3JvbGxXcmFwcGVyKVswXTtcbiAgICAgIHRoaXMuZG9tLnNjcm9sbGVyID0gJCgnZGl2LicgKyBjbGFzc2VzLnNTY3JvbGxCb2R5LCB0aGlzLmRvbS5ncmlkLmR0KVswXTtcblxuICAgICAgdGhpcy5fZm5Db2xDYWxjKCk7XG5cbiAgICAgIHRoaXMuX2ZuR3JpZFNldHVwKCk7XG5cbiAgICAgIHZhciBtb3VzZUNvbnRyb2xsZXI7XG4gICAgICB2YXIgbW91c2VEb3duID0gZmFsc2U7XG4gICAgICAkKHRoaXMucy5kdC5uVGFibGVXcmFwcGVyKS5vbignbW91c2Vkb3duLkRURkMnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZS5idXR0b24gPT09IDApIHtcbiAgICAgICAgICBtb3VzZURvd24gPSB0cnVlO1xuICAgICAgICAgICQoZG9jdW1lbnQpLm9uZSgnbW91c2V1cCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgICQodGhpcy5kb20uc2Nyb2xsZXIpLm9uKCdtb3VzZW92ZXIuRFRGQyB0b3VjaHN0YXJ0LkRURkMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghbW91c2VEb3duKSB7XG4gICAgICAgICAgbW91c2VDb250cm9sbGVyID0gJ21haW4nO1xuICAgICAgICB9XG4gICAgICB9KS5vbignc2Nyb2xsLkRURkMnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoIW1vdXNlQ29udHJvbGxlciAmJiBlLm9yaWdpbmFsRXZlbnQpIHtcbiAgICAgICAgICBtb3VzZUNvbnRyb2xsZXIgPSAnbWFpbic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW91c2VDb250cm9sbGVyID09PSAnbWFpbicpIHtcbiAgICAgICAgICBpZiAodGhhdC5zLmlMZWZ0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgICAgIHRoYXQuZG9tLmdyaWQubGVmdC5saW5lci5zY3JvbGxUb3AgPSB0aGF0LmRvbS5zY3JvbGxlci5zY3JvbGxUb3A7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoYXQucy5pUmlnaHRDb2x1bW5zID4gMCkge1xuICAgICAgICAgICAgdGhhdC5kb20uZ3JpZC5yaWdodC5saW5lci5zY3JvbGxUb3AgPSB0aGF0LmRvbS5zY3JvbGxlci5zY3JvbGxUb3A7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHZhciB3aGVlbFR5cGUgPSAnb253aGVlbCcgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykgPyAnd2hlZWwuRFRGQycgOiAnbW91c2V3aGVlbC5EVEZDJztcblxuICAgICAgaWYgKHRoYXQucy5pTGVmdENvbHVtbnMgPiAwKSB7XG4gICAgICAgICQodGhhdC5kb20uZ3JpZC5sZWZ0LmxpbmVyKS5vbignbW91c2VvdmVyLkRURkMgdG91Y2hzdGFydC5EVEZDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghbW91c2VEb3duKSB7XG4gICAgICAgICAgICBtb3VzZUNvbnRyb2xsZXIgPSAnbGVmdCc7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5vbignc2Nyb2xsLkRURkMnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmICghbW91c2VDb250cm9sbGVyICYmIGUub3JpZ2luYWxFdmVudCkge1xuICAgICAgICAgICAgbW91c2VDb250cm9sbGVyID0gJ2xlZnQnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChtb3VzZUNvbnRyb2xsZXIgPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgdGhhdC5kb20uc2Nyb2xsZXIuc2Nyb2xsVG9wID0gdGhhdC5kb20uZ3JpZC5sZWZ0LmxpbmVyLnNjcm9sbFRvcDtcblxuICAgICAgICAgICAgaWYgKHRoYXQucy5pUmlnaHRDb2x1bW5zID4gMCkge1xuICAgICAgICAgICAgICB0aGF0LmRvbS5ncmlkLnJpZ2h0LmxpbmVyLnNjcm9sbFRvcCA9IHRoYXQuZG9tLmdyaWQubGVmdC5saW5lci5zY3JvbGxUb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS5vbih3aGVlbFR5cGUsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyIHhEZWx0YSA9IGUudHlwZSA9PT0gJ3doZWVsJyA/IC1lLm9yaWdpbmFsRXZlbnQuZGVsdGFYIDogZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGFYO1xuICAgICAgICAgIHRoYXQuZG9tLnNjcm9sbGVyLnNjcm9sbExlZnQgLT0geERlbHRhO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoYXQucy5pUmlnaHRDb2x1bW5zID4gMCkge1xuICAgICAgICAkKHRoYXQuZG9tLmdyaWQucmlnaHQubGluZXIpLm9uKCdtb3VzZW92ZXIuRFRGQyB0b3VjaHN0YXJ0LkRURkMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFtb3VzZURvd24pIHtcbiAgICAgICAgICAgIG1vdXNlQ29udHJvbGxlciA9ICdyaWdodCc7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5vbignc2Nyb2xsLkRURkMnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmICghbW91c2VDb250cm9sbGVyICYmIGUub3JpZ2luYWxFdmVudCkge1xuICAgICAgICAgICAgbW91c2VDb250cm9sbGVyID0gJ3JpZ2h0JztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobW91c2VDb250cm9sbGVyID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICB0aGF0LmRvbS5zY3JvbGxlci5zY3JvbGxUb3AgPSB0aGF0LmRvbS5ncmlkLnJpZ2h0LmxpbmVyLnNjcm9sbFRvcDtcblxuICAgICAgICAgICAgaWYgKHRoYXQucy5pTGVmdENvbHVtbnMgPiAwKSB7XG4gICAgICAgICAgICAgIHRoYXQuZG9tLmdyaWQubGVmdC5saW5lci5zY3JvbGxUb3AgPSB0aGF0LmRvbS5ncmlkLnJpZ2h0LmxpbmVyLnNjcm9sbFRvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pLm9uKHdoZWVsVHlwZSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgeERlbHRhID0gZS50eXBlID09PSAnd2hlZWwnID8gLWUub3JpZ2luYWxFdmVudC5kZWx0YVggOiBlLm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YVg7XG4gICAgICAgICAgdGhhdC5kb20uc2Nyb2xsZXIuc2Nyb2xsTGVmdCAtPSB4RGVsdGE7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS5EVEZDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0Ll9mbkdyaWRMYXlvdXQuY2FsbCh0aGF0KTtcbiAgICAgIH0pO1xuICAgICAgdmFyIGJGaXJzdERyYXcgPSB0cnVlO1xuICAgICAgdmFyIGpxVGFibGUgPSAkKHRoaXMucy5kdC5uVGFibGUpO1xuICAgICAganFUYWJsZS5vbignZHJhdy5kdC5EVEZDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0Ll9mbkNvbENhbGMoKTtcblxuICAgICAgICB0aGF0Ll9mbkRyYXcuY2FsbCh0aGF0LCBiRmlyc3REcmF3KTtcblxuICAgICAgICBiRmlyc3REcmF3ID0gZmFsc2U7XG4gICAgICB9KS5vbignY29sdW1uLXNpemluZy5kdC5EVEZDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0Ll9mbkNvbENhbGMoKTtcblxuICAgICAgICB0aGF0Ll9mbkdyaWRMYXlvdXQodGhhdCk7XG4gICAgICB9KS5vbignY29sdW1uLXZpc2liaWxpdHkuZHQuRFRGQycsIGZ1bmN0aW9uIChlLCBzZXR0aW5ncywgY29sdW1uLCB2aXMsIHJlY2FsYykge1xuICAgICAgICBpZiAocmVjYWxjID09PSB1bmRlZmluZWQgfHwgcmVjYWxjKSB7XG4gICAgICAgICAgdGhhdC5fZm5Db2xDYWxjKCk7XG5cbiAgICAgICAgICB0aGF0Ll9mbkdyaWRMYXlvdXQodGhhdCk7XG5cbiAgICAgICAgICB0aGF0Ll9mbkRyYXcodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLm9uKCdzZWxlY3QuZHQuRFRGQyBkZXNlbGVjdC5kdC5EVEZDJywgZnVuY3Rpb24gKGUsIGR0LCB0eXBlLCBpbmRleGVzKSB7XG4gICAgICAgIGlmIChlLm5hbWVzcGFjZSA9PT0gJ2R0Jykge1xuICAgICAgICAgIHRoYXQuX2ZuRHJhdyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLm9uKCdkZXN0cm95LmR0LkRURkMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGpxVGFibGUub2ZmKCcuRFRGQycpO1xuICAgICAgICAkKHRoYXQuZG9tLnNjcm9sbGVyKS5vZmYoJy5EVEZDJyk7XG4gICAgICAgICQod2luZG93KS5vZmYoJy5EVEZDJyk7XG4gICAgICAgICQodGhhdC5zLmR0Lm5UYWJsZVdyYXBwZXIpLm9mZignLkRURkMnKTtcbiAgICAgICAgJCh0aGF0LmRvbS5ncmlkLmxlZnQubGluZXIpLm9mZignLkRURkMgJyArIHdoZWVsVHlwZSk7XG4gICAgICAgICQodGhhdC5kb20uZ3JpZC5sZWZ0LndyYXBwZXIpLnJlbW92ZSgpO1xuICAgICAgICAkKHRoYXQuZG9tLmdyaWQucmlnaHQubGluZXIpLm9mZignLkRURkMgJyArIHdoZWVsVHlwZSk7XG4gICAgICAgICQodGhhdC5kb20uZ3JpZC5yaWdodC53cmFwcGVyKS5yZW1vdmUoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9mbkdyaWRMYXlvdXQoKTtcblxuICAgICAgdGhpcy5zLmR0Lm9JbnN0YW5jZS5mbkRyYXcoZmFsc2UpO1xuICAgIH0sXG4gICAgXCJfZm5Db2xDYWxjXCI6IGZ1bmN0aW9uIF9mbkNvbENhbGMoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICB2YXIgaUxlZnRXaWR0aCA9IDA7XG4gICAgICB2YXIgaVJpZ2h0V2lkdGggPSAwO1xuICAgICAgdGhpcy5zLmFpSW5uZXJXaWR0aHMgPSBbXTtcbiAgICAgIHRoaXMucy5haU91dGVyV2lkdGhzID0gW107XG4gICAgICAkLmVhY2godGhpcy5zLmR0LmFvQ29sdW1ucywgZnVuY3Rpb24gKGksIGNvbCkge1xuICAgICAgICB2YXIgdGggPSAkKGNvbC5uVGgpO1xuICAgICAgICB2YXIgYm9yZGVyO1xuXG4gICAgICAgIGlmICghdGguZmlsdGVyKCc6dmlzaWJsZScpLmxlbmd0aCkge1xuICAgICAgICAgIHRoYXQucy5haUlubmVyV2lkdGhzLnB1c2goMCk7XG4gICAgICAgICAgdGhhdC5zLmFpT3V0ZXJXaWR0aHMucHVzaCgwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgaVdpZHRoID0gdGgub3V0ZXJXaWR0aCgpO1xuXG4gICAgICAgICAgaWYgKHRoYXQucy5haU91dGVyV2lkdGhzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgYm9yZGVyID0gJCh0aGF0LnMuZHQublRhYmxlKS5jc3MoJ2JvcmRlci1sZWZ0LXdpZHRoJyk7XG4gICAgICAgICAgICBpV2lkdGggKz0gdHlwZW9mIGJvcmRlciA9PT0gJ3N0cmluZycgJiYgYm9yZGVyLmluZGV4T2YoJ3B4JykgPT09IC0xID8gMSA6IHBhcnNlSW50KGJvcmRlciwgMTApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGF0LnMuYWlPdXRlcldpZHRocy5sZW5ndGggPT09IHRoYXQucy5kdC5hb0NvbHVtbnMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgYm9yZGVyID0gJCh0aGF0LnMuZHQublRhYmxlKS5jc3MoJ2JvcmRlci1yaWdodC13aWR0aCcpO1xuICAgICAgICAgICAgaVdpZHRoICs9IHR5cGVvZiBib3JkZXIgPT09ICdzdHJpbmcnICYmIGJvcmRlci5pbmRleE9mKCdweCcpID09PSAtMSA/IDEgOiBwYXJzZUludChib3JkZXIsIDEwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGF0LnMuYWlPdXRlcldpZHRocy5wdXNoKGlXaWR0aCk7XG4gICAgICAgICAgdGhhdC5zLmFpSW5uZXJXaWR0aHMucHVzaCh0aC53aWR0aCgpKTtcblxuICAgICAgICAgIGlmIChpIDwgdGhhdC5zLmlMZWZ0Q29sdW1ucykge1xuICAgICAgICAgICAgaUxlZnRXaWR0aCArPSBpV2lkdGg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoYXQucy5pVGFibGVDb2x1bW5zIC0gdGhhdC5zLmlSaWdodENvbHVtbnMgPD0gaSkge1xuICAgICAgICAgICAgaVJpZ2h0V2lkdGggKz0gaVdpZHRoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnMuaUxlZnRXaWR0aCA9IGlMZWZ0V2lkdGg7XG4gICAgICB0aGlzLnMuaVJpZ2h0V2lkdGggPSBpUmlnaHRXaWR0aDtcbiAgICB9LFxuICAgIFwiX2ZuR3JpZFNldHVwXCI6IGZ1bmN0aW9uIF9mbkdyaWRTZXR1cCgpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgdmFyIG9PdmVyZmxvdyA9IHRoaXMuX2ZuRFRPdmVyZmxvdygpO1xuXG4gICAgICB2YXIgYmxvY2s7XG4gICAgICB0aGlzLmRvbS5ib2R5ID0gdGhpcy5zLmR0Lm5UYWJsZTtcbiAgICAgIHRoaXMuZG9tLmhlYWRlciA9IHRoaXMucy5kdC5uVEhlYWQucGFyZW50Tm9kZTtcbiAgICAgIHRoaXMuZG9tLmhlYWRlci5wYXJlbnROb2RlLnBhcmVudE5vZGUuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG4gICAgICB2YXIgblNXcmFwcGVyID0gJCgnPGRpdiBjbGFzcz1cIkRURkNfU2Nyb2xsV3JhcHBlclwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7IGNsZWFyOmJvdGg7XCI+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19MZWZ0V3JhcHBlclwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHRvcDowOyBsZWZ0OjA7XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19MZWZ0SGVhZFdyYXBwZXJcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlOyB0b3A6MDsgbGVmdDowOyBvdmVyZmxvdzpoaWRkZW47XCI+PC9kaXY+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19MZWZ0Qm9keVdyYXBwZXJcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlOyB0b3A6MDsgbGVmdDowOyBvdmVyZmxvdzpoaWRkZW47XCI+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19MZWZ0Qm9keUxpbmVyXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTsgdG9wOjA7IGxlZnQ6MDsgb3ZlcmZsb3cteTpzY3JvbGw7XCI+PC9kaXY+JyArICc8L2Rpdj4nICsgJzxkaXYgY2xhc3M9XCJEVEZDX0xlZnRGb290V3JhcHBlclwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7IHRvcDowOyBsZWZ0OjA7IG92ZXJmbG93OmhpZGRlbjtcIj48L2Rpdj4nICsgJzwvZGl2PicgKyAnPGRpdiBjbGFzcz1cIkRURkNfUmlnaHRXcmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTsgdG9wOjA7IHJpZ2h0OjA7XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19SaWdodEhlYWRXcmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTsgdG9wOjA7IGxlZnQ6MDtcIj4nICsgJzxkaXYgY2xhc3M9XCJEVEZDX1JpZ2h0SGVhZEJsb2NrZXIgRFRGQ19CbG9ja2VyXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTsgdG9wOjA7IGJvdHRvbTowO1wiPjwvZGl2PicgKyAnPC9kaXY+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19SaWdodEJvZHlXcmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTsgdG9wOjA7IGxlZnQ6MDsgb3ZlcmZsb3c6aGlkZGVuO1wiPicgKyAnPGRpdiBjbGFzcz1cIkRURkNfUmlnaHRCb2R5TGluZXJcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlOyB0b3A6MDsgbGVmdDowOyBvdmVyZmxvdy15OnNjcm9sbDtcIj48L2Rpdj4nICsgJzwvZGl2PicgKyAnPGRpdiBjbGFzcz1cIkRURkNfUmlnaHRGb290V3JhcHBlclwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7IHRvcDowOyBsZWZ0OjA7XCI+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19SaWdodEZvb3RCbG9ja2VyIERURkNfQmxvY2tlclwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHRvcDowOyBib3R0b206MDtcIj48L2Rpdj4nICsgJzwvZGl2PicgKyAnPC9kaXY+JyArICc8L2Rpdj4nKVswXTtcbiAgICAgIHZhciBuTGVmdCA9IG5TV3JhcHBlci5jaGlsZE5vZGVzWzBdO1xuICAgICAgdmFyIG5SaWdodCA9IG5TV3JhcHBlci5jaGlsZE5vZGVzWzFdO1xuICAgICAgdGhpcy5kb20uZ3JpZC5kdC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuU1dyYXBwZXIsIHRoaXMuZG9tLmdyaWQuZHQpO1xuICAgICAgblNXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZG9tLmdyaWQuZHQpO1xuICAgICAgdGhpcy5kb20uZ3JpZC53cmFwcGVyID0gblNXcmFwcGVyO1xuXG4gICAgICBpZiAodGhpcy5zLmlMZWZ0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgdGhpcy5kb20uZ3JpZC5sZWZ0LndyYXBwZXIgPSBuTGVmdDtcbiAgICAgICAgdGhpcy5kb20uZ3JpZC5sZWZ0LmhlYWQgPSBuTGVmdC5jaGlsZE5vZGVzWzBdO1xuICAgICAgICB0aGlzLmRvbS5ncmlkLmxlZnQuYm9keSA9IG5MZWZ0LmNoaWxkTm9kZXNbMV07XG4gICAgICAgIHRoaXMuZG9tLmdyaWQubGVmdC5saW5lciA9ICQoJ2Rpdi5EVEZDX0xlZnRCb2R5TGluZXInLCBuU1dyYXBwZXIpWzBdO1xuICAgICAgICBuU1dyYXBwZXIuYXBwZW5kQ2hpbGQobkxlZnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zLmlSaWdodENvbHVtbnMgPiAwKSB7XG4gICAgICAgIHRoaXMuZG9tLmdyaWQucmlnaHQud3JhcHBlciA9IG5SaWdodDtcbiAgICAgICAgdGhpcy5kb20uZ3JpZC5yaWdodC5oZWFkID0gblJpZ2h0LmNoaWxkTm9kZXNbMF07XG4gICAgICAgIHRoaXMuZG9tLmdyaWQucmlnaHQuYm9keSA9IG5SaWdodC5jaGlsZE5vZGVzWzFdO1xuICAgICAgICB0aGlzLmRvbS5ncmlkLnJpZ2h0LmxpbmVyID0gJCgnZGl2LkRURkNfUmlnaHRCb2R5TGluZXInLCBuU1dyYXBwZXIpWzBdO1xuICAgICAgICBuUmlnaHQuc3R5bGUucmlnaHQgPSBvT3ZlcmZsb3cuYmFyICsgXCJweFwiO1xuICAgICAgICBibG9jayA9ICQoJ2Rpdi5EVEZDX1JpZ2h0SGVhZEJsb2NrZXInLCBuU1dyYXBwZXIpWzBdO1xuICAgICAgICBibG9jay5zdHlsZS53aWR0aCA9IG9PdmVyZmxvdy5iYXIgKyBcInB4XCI7XG4gICAgICAgIGJsb2NrLnN0eWxlLnJpZ2h0ID0gLW9PdmVyZmxvdy5iYXIgKyBcInB4XCI7XG4gICAgICAgIHRoaXMuZG9tLmdyaWQucmlnaHQuaGVhZEJsb2NrID0gYmxvY2s7XG4gICAgICAgIGJsb2NrID0gJCgnZGl2LkRURkNfUmlnaHRGb290QmxvY2tlcicsIG5TV3JhcHBlcilbMF07XG4gICAgICAgIGJsb2NrLnN0eWxlLndpZHRoID0gb092ZXJmbG93LmJhciArIFwicHhcIjtcbiAgICAgICAgYmxvY2suc3R5bGUucmlnaHQgPSAtb092ZXJmbG93LmJhciArIFwicHhcIjtcbiAgICAgICAgdGhpcy5kb20uZ3JpZC5yaWdodC5mb290QmxvY2sgPSBibG9jaztcbiAgICAgICAgblNXcmFwcGVyLmFwcGVuZENoaWxkKG5SaWdodCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnMuZHQublRGb290KSB7XG4gICAgICAgIHRoaXMuZG9tLmZvb3RlciA9IHRoaXMucy5kdC5uVEZvb3QucGFyZW50Tm9kZTtcblxuICAgICAgICBpZiAodGhpcy5zLmlMZWZ0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgICB0aGlzLmRvbS5ncmlkLmxlZnQuZm9vdCA9IG5MZWZ0LmNoaWxkTm9kZXNbMl07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zLmlSaWdodENvbHVtbnMgPiAwKSB7XG4gICAgICAgICAgdGhpcy5kb20uZ3JpZC5yaWdodC5mb290ID0gblJpZ2h0LmNoaWxkTm9kZXNbMl07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucy5ydGwpIHtcbiAgICAgICAgJCgnZGl2LkRURkNfUmlnaHRIZWFkQmxvY2tlcicsIG5TV3JhcHBlcikuY3NzKHtcbiAgICAgICAgICBsZWZ0OiAtb092ZXJmbG93LmJhciArICdweCcsXG4gICAgICAgICAgcmlnaHQ6ICcnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJfZm5HcmlkTGF5b3V0XCI6IGZ1bmN0aW9uIF9mbkdyaWRMYXlvdXQoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICB2YXIgb0dyaWQgPSB0aGlzLmRvbS5ncmlkO1xuICAgICAgdmFyIGlXaWR0aCA9ICQob0dyaWQud3JhcHBlcikud2lkdGgoKTtcbiAgICAgIHZhciBpQm9keUhlaWdodCA9IHRoaXMucy5kdC5uVGFibGUucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQ7XG4gICAgICB2YXIgaUZ1bGxIZWlnaHQgPSB0aGlzLnMuZHQublRhYmxlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIHZhciBvT3ZlcmZsb3cgPSB0aGlzLl9mbkRUT3ZlcmZsb3coKTtcblxuICAgICAgdmFyIGlMZWZ0V2lkdGggPSB0aGlzLnMuaUxlZnRXaWR0aDtcbiAgICAgIHZhciBpUmlnaHRXaWR0aCA9IHRoaXMucy5pUmlnaHRXaWR0aDtcbiAgICAgIHZhciBydGwgPSAkKHRoaXMuZG9tLmJvZHkpLmNzcygnZGlyZWN0aW9uJykgPT09ICdydGwnO1xuICAgICAgdmFyIHdyYXBwZXI7XG5cbiAgICAgIHZhciBzY3JvbGxiYXJBZGp1c3QgPSBmdW5jdGlvbiBzY3JvbGxiYXJBZGp1c3Qobm9kZSwgd2lkdGgpIHtcbiAgICAgICAgaWYgKCFvT3ZlcmZsb3cuYmFyKSB7XG4gICAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoICsgMjAgKyBcInB4XCI7XG4gICAgICAgICAgbm9kZS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIjIwcHhcIjtcbiAgICAgICAgICBub2RlLnN0eWxlLmJveFNpemluZyA9IFwiYm9yZGVyLWJveFwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoYXQuX2ZpcmVmb3hTY3JvbGxFcnJvcigpKSB7XG4gICAgICAgICAgaWYgKCQobm9kZSkuaGVpZ2h0KCkgPiAzNCkge1xuICAgICAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoICsgb092ZXJmbG93LmJhciArIFwicHhcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoICsgb092ZXJmbG93LmJhciArIFwicHhcIjtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKG9PdmVyZmxvdy54KSB7XG4gICAgICAgIGlCb2R5SGVpZ2h0IC09IG9PdmVyZmxvdy5iYXI7XG4gICAgICB9XG5cbiAgICAgIG9HcmlkLndyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gaUZ1bGxIZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgIGlmICh0aGlzLnMuaUxlZnRDb2x1bW5zID4gMCkge1xuICAgICAgICB3cmFwcGVyID0gb0dyaWQubGVmdC53cmFwcGVyO1xuICAgICAgICB3cmFwcGVyLnN0eWxlLndpZHRoID0gaUxlZnRXaWR0aCArICdweCc7XG4gICAgICAgIHdyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gJzFweCc7XG5cbiAgICAgICAgaWYgKHJ0bCkge1xuICAgICAgICAgIHdyYXBwZXIuc3R5bGUubGVmdCA9ICcnO1xuICAgICAgICAgIHdyYXBwZXIuc3R5bGUucmlnaHQgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdyYXBwZXIuc3R5bGUubGVmdCA9IDA7XG4gICAgICAgICAgd3JhcHBlci5zdHlsZS5yaWdodCA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgb0dyaWQubGVmdC5ib2R5LnN0eWxlLmhlaWdodCA9IGlCb2R5SGVpZ2h0ICsgXCJweFwiO1xuXG4gICAgICAgIGlmIChvR3JpZC5sZWZ0LmZvb3QpIHtcbiAgICAgICAgICBvR3JpZC5sZWZ0LmZvb3Quc3R5bGUudG9wID0gKG9PdmVyZmxvdy54ID8gb092ZXJmbG93LmJhciA6IDApICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgc2Nyb2xsYmFyQWRqdXN0KG9HcmlkLmxlZnQubGluZXIsIGlMZWZ0V2lkdGgpO1xuICAgICAgICBvR3JpZC5sZWZ0LmxpbmVyLnN0eWxlLmhlaWdodCA9IGlCb2R5SGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICBvR3JpZC5sZWZ0LmxpbmVyLnN0eWxlLm1heEhlaWdodCA9IGlCb2R5SGVpZ2h0ICsgXCJweFwiO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zLmlSaWdodENvbHVtbnMgPiAwKSB7XG4gICAgICAgIHdyYXBwZXIgPSBvR3JpZC5yaWdodC53cmFwcGVyO1xuICAgICAgICB3cmFwcGVyLnN0eWxlLndpZHRoID0gaVJpZ2h0V2lkdGggKyAncHgnO1xuICAgICAgICB3cmFwcGVyLnN0eWxlLmhlaWdodCA9ICcxcHgnO1xuXG4gICAgICAgIGlmICh0aGlzLnMucnRsKSB7XG4gICAgICAgICAgd3JhcHBlci5zdHlsZS5sZWZ0ID0gb092ZXJmbG93LnkgPyBvT3ZlcmZsb3cuYmFyICsgJ3B4JyA6IDA7XG4gICAgICAgICAgd3JhcHBlci5zdHlsZS5yaWdodCA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdyYXBwZXIuc3R5bGUubGVmdCA9ICcnO1xuICAgICAgICAgIHdyYXBwZXIuc3R5bGUucmlnaHQgPSBvT3ZlcmZsb3cueSA/IG9PdmVyZmxvdy5iYXIgKyAncHgnIDogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIG9HcmlkLnJpZ2h0LmJvZHkuc3R5bGUuaGVpZ2h0ID0gaUJvZHlIZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgICAgaWYgKG9HcmlkLnJpZ2h0LmZvb3QpIHtcbiAgICAgICAgICBvR3JpZC5yaWdodC5mb290LnN0eWxlLnRvcCA9IChvT3ZlcmZsb3cueCA/IG9PdmVyZmxvdy5iYXIgOiAwKSArIFwicHhcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjcm9sbGJhckFkanVzdChvR3JpZC5yaWdodC5saW5lciwgaVJpZ2h0V2lkdGgpO1xuICAgICAgICBvR3JpZC5yaWdodC5saW5lci5zdHlsZS5oZWlnaHQgPSBpQm9keUhlaWdodCArIFwicHhcIjtcbiAgICAgICAgb0dyaWQucmlnaHQubGluZXIuc3R5bGUubWF4SGVpZ2h0ID0gaUJvZHlIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIG9HcmlkLnJpZ2h0LmhlYWRCbG9jay5zdHlsZS5kaXNwbGF5ID0gb092ZXJmbG93LnkgPyAnYmxvY2snIDogJ25vbmUnO1xuICAgICAgICBvR3JpZC5yaWdodC5mb290QmxvY2suc3R5bGUuZGlzcGxheSA9IG9PdmVyZmxvdy55ID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiX2ZuRFRPdmVyZmxvd1wiOiBmdW5jdGlvbiBfZm5EVE92ZXJmbG93KCkge1xuICAgICAgdmFyIG5UYWJsZSA9IHRoaXMucy5kdC5uVGFibGU7XG4gICAgICB2YXIgblRhYmxlU2Nyb2xsQm9keSA9IG5UYWJsZS5wYXJlbnROb2RlO1xuICAgICAgdmFyIG91dCA9IHtcbiAgICAgICAgXCJ4XCI6IGZhbHNlLFxuICAgICAgICBcInlcIjogZmFsc2UsXG4gICAgICAgIFwiYmFyXCI6IHRoaXMucy5kdC5vU2Nyb2xsLmlCYXJXaWR0aFxuICAgICAgfTtcblxuICAgICAgaWYgKG5UYWJsZS5vZmZzZXRXaWR0aCA+IG5UYWJsZVNjcm9sbEJvZHkuY2xpZW50V2lkdGgpIHtcbiAgICAgICAgb3V0LnggPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoblRhYmxlLm9mZnNldEhlaWdodCA+IG5UYWJsZVNjcm9sbEJvZHkuY2xpZW50SGVpZ2h0KSB7XG4gICAgICAgIG91dC55ID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9LFxuICAgIFwiX2ZuRHJhd1wiOiBmdW5jdGlvbiBfZm5EcmF3KGJBbGwpIHtcbiAgICAgIHRoaXMuX2ZuR3JpZExheW91dCgpO1xuXG4gICAgICB0aGlzLl9mbkNsb25lTGVmdChiQWxsKTtcblxuICAgICAgdGhpcy5fZm5DbG9uZVJpZ2h0KGJBbGwpO1xuXG4gICAgICBpZiAodGhpcy5zLmZuRHJhd0NhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMucy5mbkRyYXdDYWxsYmFjay5jYWxsKHRoaXMsIHRoaXMuZG9tLmNsb25lLmxlZnQsIHRoaXMuZG9tLmNsb25lLnJpZ2h0KTtcbiAgICAgIH1cblxuICAgICAgJCh0aGlzKS50cmlnZ2VyKCdkcmF3LmR0ZmMnLCB7XG4gICAgICAgIFwibGVmdENsb25lXCI6IHRoaXMuZG9tLmNsb25lLmxlZnQsXG4gICAgICAgIFwicmlnaHRDbG9uZVwiOiB0aGlzLmRvbS5jbG9uZS5yaWdodFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBcIl9mbkNsb25lUmlnaHRcIjogZnVuY3Rpb24gX2ZuQ2xvbmVSaWdodChiQWxsKSB7XG4gICAgICBpZiAodGhpcy5zLmlSaWdodENvbHVtbnMgPD0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICBpLFxuICAgICAgICAgIGpxLFxuICAgICAgICAgIGFpQ29sdW1ucyA9IFtdO1xuXG4gICAgICBmb3IgKGkgPSB0aGlzLnMuaVRhYmxlQ29sdW1ucyAtIHRoaXMucy5pUmlnaHRDb2x1bW5zOyBpIDwgdGhpcy5zLmlUYWJsZUNvbHVtbnM7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5zLmR0LmFvQ29sdW1uc1tpXS5iVmlzaWJsZSkge1xuICAgICAgICAgIGFpQ29sdW1ucy5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2ZuQ2xvbmUodGhpcy5kb20uY2xvbmUucmlnaHQsIHRoaXMuZG9tLmdyaWQucmlnaHQsIGFpQ29sdW1ucywgYkFsbCk7XG4gICAgfSxcbiAgICBcIl9mbkNsb25lTGVmdFwiOiBmdW5jdGlvbiBfZm5DbG9uZUxlZnQoYkFsbCkge1xuICAgICAgaWYgKHRoaXMucy5pTGVmdENvbHVtbnMgPD0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICBpLFxuICAgICAgICAgIGpxLFxuICAgICAgICAgIGFpQ29sdW1ucyA9IFtdO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5zLmlMZWZ0Q29sdW1uczsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLnMuZHQuYW9Db2x1bW5zW2ldLmJWaXNpYmxlKSB7XG4gICAgICAgICAgYWlDb2x1bW5zLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fZm5DbG9uZSh0aGlzLmRvbS5jbG9uZS5sZWZ0LCB0aGlzLmRvbS5ncmlkLmxlZnQsIGFpQ29sdW1ucywgYkFsbCk7XG4gICAgfSxcbiAgICBcIl9mbkNvcHlMYXlvdXRcIjogZnVuY3Rpb24gX2ZuQ29weUxheW91dChhb09yaWdpbmFsLCBhaUNvbHVtbnMsIGV2ZW50cykge1xuICAgICAgdmFyIGFSZXR1cm4gPSBbXTtcbiAgICAgIHZhciBhQ2xvbmVzID0gW107XG4gICAgICB2YXIgYUNsb25lZCA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGFvT3JpZ2luYWwubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgIHZhciBhUm93ID0gW107XG4gICAgICAgIGFSb3cublRyID0gJChhb09yaWdpbmFsW2ldLm5UcikuY2xvbmUoZXZlbnRzLCBmYWxzZSlbMF07XG5cbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpMZW4gPSB0aGlzLnMuaVRhYmxlQ29sdW1uczsgaiA8IGpMZW47IGorKykge1xuICAgICAgICAgIGlmICgkLmluQXJyYXkoaiwgYWlDb2x1bW5zKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBpQ2xvbmVkID0gJC5pbkFycmF5KGFvT3JpZ2luYWxbaV1bal0uY2VsbCwgYUNsb25lZCk7XG5cbiAgICAgICAgICBpZiAoaUNsb25lZCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHZhciBuQ2xvbmUgPSAkKGFvT3JpZ2luYWxbaV1bal0uY2VsbCkuY2xvbmUoZXZlbnRzLCBmYWxzZSlbMF07XG4gICAgICAgICAgICBhQ2xvbmVzLnB1c2gobkNsb25lKTtcbiAgICAgICAgICAgIGFDbG9uZWQucHVzaChhb09yaWdpbmFsW2ldW2pdLmNlbGwpO1xuICAgICAgICAgICAgYVJvdy5wdXNoKHtcbiAgICAgICAgICAgICAgXCJjZWxsXCI6IG5DbG9uZSxcbiAgICAgICAgICAgICAgXCJ1bmlxdWVcIjogYW9PcmlnaW5hbFtpXVtqXS51bmlxdWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhUm93LnB1c2goe1xuICAgICAgICAgICAgICBcImNlbGxcIjogYUNsb25lc1tpQ2xvbmVkXSxcbiAgICAgICAgICAgICAgXCJ1bmlxdWVcIjogYW9PcmlnaW5hbFtpXVtqXS51bmlxdWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFSZXR1cm4ucHVzaChhUm93KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFSZXR1cm47XG4gICAgfSxcbiAgICBcIl9mbkNsb25lXCI6IGZ1bmN0aW9uIF9mbkNsb25lKG9DbG9uZSwgb0dyaWQsIGFpQ29sdW1ucywgYkFsbCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgIGksXG4gICAgICAgICAgaUxlbixcbiAgICAgICAgICBqLFxuICAgICAgICAgIGpMZW4sXG4gICAgICAgICAganEsXG4gICAgICAgICAgblRhcmdldCxcbiAgICAgICAgICBpQ29sdW1uLFxuICAgICAgICAgIG5DbG9uZSxcbiAgICAgICAgICBpSW5kZXgsXG4gICAgICAgICAgYW9DbG9uZUxheW91dCxcbiAgICAgICAgICBqcUNsb25lVGhlYWQsXG4gICAgICAgICAgYW9GaXhlZEhlYWRlcixcbiAgICAgICAgICBkdCA9IHRoaXMucy5kdDtcblxuICAgICAgaWYgKGJBbGwpIHtcbiAgICAgICAgJChvQ2xvbmUuaGVhZGVyKS5yZW1vdmUoKTtcbiAgICAgICAgb0Nsb25lLmhlYWRlciA9ICQodGhpcy5kb20uaGVhZGVyKS5jbG9uZSh0cnVlLCBmYWxzZSlbMF07XG4gICAgICAgIG9DbG9uZS5oZWFkZXIuY2xhc3NOYW1lICs9IFwiIERURkNfQ2xvbmVkXCI7XG4gICAgICAgIG9DbG9uZS5oZWFkZXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgICAgb0dyaWQuaGVhZC5hcHBlbmRDaGlsZChvQ2xvbmUuaGVhZGVyKTtcbiAgICAgICAgYW9DbG9uZUxheW91dCA9IHRoaXMuX2ZuQ29weUxheW91dChkdC5hb0hlYWRlciwgYWlDb2x1bW5zLCB0cnVlKTtcbiAgICAgICAganFDbG9uZVRoZWFkID0gJCgnPnRoZWFkJywgb0Nsb25lLmhlYWRlcik7XG4gICAgICAgIGpxQ2xvbmVUaGVhZC5lbXB0eSgpO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhb0Nsb25lTGF5b3V0Lmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICAgIGpxQ2xvbmVUaGVhZFswXS5hcHBlbmRDaGlsZChhb0Nsb25lTGF5b3V0W2ldLm5Ucik7XG4gICAgICAgIH1cblxuICAgICAgICBkdC5vQXBpLl9mbkRyYXdIZWFkKGR0LCBhb0Nsb25lTGF5b3V0LCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFvQ2xvbmVMYXlvdXQgPSB0aGlzLl9mbkNvcHlMYXlvdXQoZHQuYW9IZWFkZXIsIGFpQ29sdW1ucywgZmFsc2UpO1xuICAgICAgICBhb0ZpeGVkSGVhZGVyID0gW107XG5cbiAgICAgICAgZHQub0FwaS5fZm5EZXRlY3RIZWFkZXIoYW9GaXhlZEhlYWRlciwgJCgnPnRoZWFkJywgb0Nsb25lLmhlYWRlcilbMF0pO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhb0Nsb25lTGF5b3V0Lmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICAgIGZvciAoaiA9IDAsIGpMZW4gPSBhb0Nsb25lTGF5b3V0W2ldLmxlbmd0aDsgaiA8IGpMZW47IGorKykge1xuICAgICAgICAgICAgYW9GaXhlZEhlYWRlcltpXVtqXS5jZWxsLmNsYXNzTmFtZSA9IGFvQ2xvbmVMYXlvdXRbaV1bal0uY2VsbC5jbGFzc05hbWU7XG4gICAgICAgICAgICAkKCdzcGFuLkRhdGFUYWJsZXNfc29ydF9pY29uJywgYW9GaXhlZEhlYWRlcltpXVtqXS5jZWxsKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSAkKCdzcGFuLkRhdGFUYWJsZXNfc29ydF9pY29uJywgYW9DbG9uZUxheW91dFtpXVtqXS5jZWxsKVswXS5jbGFzc05hbWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fZm5FcXVhbGlzZUhlaWdodHMoJ3RoZWFkJywgdGhpcy5kb20uaGVhZGVyLCBvQ2xvbmUuaGVhZGVyKTtcblxuICAgICAgaWYgKHRoaXMucy5zSGVpZ2h0TWF0Y2ggPT0gJ2F1dG8nKSB7XG4gICAgICAgICQoJz50Ym9keT50cicsIHRoYXQuZG9tLmJvZHkpLmNzcygnaGVpZ2h0JywgJ2F1dG8nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9DbG9uZS5ib2R5ICE9PSBudWxsKSB7XG4gICAgICAgICQob0Nsb25lLmJvZHkpLnJlbW92ZSgpO1xuICAgICAgICBvQ2xvbmUuYm9keSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIG9DbG9uZS5ib2R5ID0gJCh0aGlzLmRvbS5ib2R5KS5jbG9uZSh0cnVlKVswXTtcbiAgICAgIG9DbG9uZS5ib2R5LmNsYXNzTmFtZSArPSBcIiBEVEZDX0Nsb25lZFwiO1xuICAgICAgb0Nsb25lLmJvZHkuc3R5bGUucGFkZGluZ0JvdHRvbSA9IGR0Lm9TY3JvbGwuaUJhcldpZHRoICsgXCJweFwiO1xuICAgICAgb0Nsb25lLmJvZHkuc3R5bGUubWFyZ2luQm90dG9tID0gZHQub1Njcm9sbC5pQmFyV2lkdGggKiAyICsgXCJweFwiO1xuXG4gICAgICBpZiAob0Nsb25lLmJvZHkuZ2V0QXR0cmlidXRlKCdpZCcpICE9PSBudWxsKSB7XG4gICAgICAgIG9DbG9uZS5ib2R5LnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgIH1cblxuICAgICAgJCgnPnRoZWFkPnRyJywgb0Nsb25lLmJvZHkpLmVtcHR5KCk7XG4gICAgICAkKCc+dGZvb3QnLCBvQ2xvbmUuYm9keSkucmVtb3ZlKCk7XG4gICAgICB2YXIgbkJvZHkgPSAkKCd0Ym9keScsIG9DbG9uZS5ib2R5KVswXTtcbiAgICAgICQobkJvZHkpLmVtcHR5KCk7XG5cbiAgICAgIGlmIChkdC5haURpc3BsYXkubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgbklubmVyVGhlYWQgPSAkKCc+dGhlYWQ+dHInLCBvQ2xvbmUuYm9keSlbMF07XG5cbiAgICAgICAgZm9yIChpSW5kZXggPSAwOyBpSW5kZXggPCBhaUNvbHVtbnMubGVuZ3RoOyBpSW5kZXgrKykge1xuICAgICAgICAgIGlDb2x1bW4gPSBhaUNvbHVtbnNbaUluZGV4XTtcbiAgICAgICAgICBuQ2xvbmUgPSAkKGR0LmFvQ29sdW1uc1tpQ29sdW1uXS5uVGgpLmNsb25lKHRydWUpWzBdO1xuICAgICAgICAgIG5DbG9uZS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgIHZhciBvU3R5bGUgPSBuQ2xvbmUuc3R5bGU7XG4gICAgICAgICAgb1N0eWxlLnBhZGRpbmdUb3AgPSBcIjBcIjtcbiAgICAgICAgICBvU3R5bGUucGFkZGluZ0JvdHRvbSA9IFwiMFwiO1xuICAgICAgICAgIG9TdHlsZS5ib3JkZXJUb3BXaWR0aCA9IFwiMFwiO1xuICAgICAgICAgIG9TdHlsZS5ib3JkZXJCb3R0b21XaWR0aCA9IFwiMFwiO1xuICAgICAgICAgIG9TdHlsZS5oZWlnaHQgPSAwO1xuICAgICAgICAgIG9TdHlsZS53aWR0aCA9IHRoYXQucy5haUlubmVyV2lkdGhzW2lDb2x1bW5dICsgXCJweFwiO1xuICAgICAgICAgIG5Jbm5lclRoZWFkLmFwcGVuZENoaWxkKG5DbG9uZSk7XG4gICAgICAgIH1cblxuICAgICAgICAkKCc+dGJvZHk+dHInLCB0aGF0LmRvbS5ib2R5KS5lYWNoKGZ1bmN0aW9uICh6KSB7XG4gICAgICAgICAgdmFyIGkgPSB0aGF0LnMuZHQub0ZlYXR1cmVzLmJTZXJ2ZXJTaWRlID09PSBmYWxzZSA/IHRoYXQucy5kdC5haURpc3BsYXlbdGhhdC5zLmR0Ll9pRGlzcGxheVN0YXJ0ICsgel0gOiB6O1xuICAgICAgICAgIHZhciBhVGRzID0gdGhhdC5zLmR0LmFvRGF0YVtpXS5hbkNlbGxzIHx8ICQodGhpcykuY2hpbGRyZW4oJ3RkLCB0aCcpO1xuICAgICAgICAgIHZhciBuID0gdGhpcy5jbG9uZU5vZGUoZmFsc2UpO1xuICAgICAgICAgIG4ucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuICAgICAgICAgIG4uc2V0QXR0cmlidXRlKCdkYXRhLWR0LXJvdycsIGkpO1xuXG4gICAgICAgICAgZm9yIChpSW5kZXggPSAwOyBpSW5kZXggPCBhaUNvbHVtbnMubGVuZ3RoOyBpSW5kZXgrKykge1xuICAgICAgICAgICAgaUNvbHVtbiA9IGFpQ29sdW1uc1tpSW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAoYVRkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIG5DbG9uZSA9ICQoYVRkc1tpQ29sdW1uXSkuY2xvbmUodHJ1ZSwgdHJ1ZSlbMF07XG4gICAgICAgICAgICAgIG5DbG9uZS5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgICAgICAgIG5DbG9uZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZHQtcm93JywgaSk7XG4gICAgICAgICAgICAgIG5DbG9uZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZHQtY29sdW1uJywgaUNvbHVtbik7XG4gICAgICAgICAgICAgIG4uYXBwZW5kQ2hpbGQobkNsb25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuQm9keS5hcHBlbmRDaGlsZChuKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCc+dGJvZHk+dHInLCB0aGF0LmRvbS5ib2R5KS5lYWNoKGZ1bmN0aW9uICh6KSB7XG4gICAgICAgICAgbkNsb25lID0gdGhpcy5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgbkNsb25lLmNsYXNzTmFtZSArPSAnIERURkNfTm9EYXRhJztcbiAgICAgICAgICAkKCd0ZCcsIG5DbG9uZSkuaHRtbCgnJyk7XG4gICAgICAgICAgbkJvZHkuYXBwZW5kQ2hpbGQobkNsb25lKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIG9DbG9uZS5ib2R5LnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICBvQ2xvbmUuYm9keS5zdHlsZS5tYXJnaW4gPSBcIjBcIjtcbiAgICAgIG9DbG9uZS5ib2R5LnN0eWxlLnBhZGRpbmcgPSBcIjBcIjtcblxuICAgICAgaWYgKGR0Lm9TY3JvbGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciBzY3JvbGxlckZvcmNlciA9IGR0Lm9TY3JvbGxlci5kb20uZm9yY2U7XG5cbiAgICAgICAgaWYgKCFvR3JpZC5mb3JjZXIpIHtcbiAgICAgICAgICBvR3JpZC5mb3JjZXIgPSBzY3JvbGxlckZvcmNlci5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgb0dyaWQubGluZXIuYXBwZW5kQ2hpbGQob0dyaWQuZm9yY2VyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvR3JpZC5mb3JjZXIuc3R5bGUuaGVpZ2h0ID0gc2Nyb2xsZXJGb3JjZXIuc3R5bGUuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG9HcmlkLmxpbmVyLmFwcGVuZENoaWxkKG9DbG9uZS5ib2R5KTtcblxuICAgICAgdGhpcy5fZm5FcXVhbGlzZUhlaWdodHMoJ3Rib2R5JywgdGhhdC5kb20uYm9keSwgb0Nsb25lLmJvZHkpO1xuXG4gICAgICBpZiAoZHQublRGb290ICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChiQWxsKSB7XG4gICAgICAgICAgaWYgKG9DbG9uZS5mb290ZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIG9DbG9uZS5mb290ZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvQ2xvbmUuZm9vdGVyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvQ2xvbmUuZm9vdGVyID0gJCh0aGlzLmRvbS5mb290ZXIpLmNsb25lKHRydWUsIHRydWUpWzBdO1xuICAgICAgICAgIG9DbG9uZS5mb290ZXIuY2xhc3NOYW1lICs9IFwiIERURkNfQ2xvbmVkXCI7XG4gICAgICAgICAgb0Nsb25lLmZvb3Rlci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICAgIG9HcmlkLmZvb3QuYXBwZW5kQ2hpbGQob0Nsb25lLmZvb3Rlcik7XG4gICAgICAgICAgYW9DbG9uZUxheW91dCA9IHRoaXMuX2ZuQ29weUxheW91dChkdC5hb0Zvb3RlciwgYWlDb2x1bW5zLCB0cnVlKTtcbiAgICAgICAgICB2YXIganFDbG9uZVRmb290ID0gJCgnPnRmb290Jywgb0Nsb25lLmZvb3Rlcik7XG4gICAgICAgICAganFDbG9uZVRmb290LmVtcHR5KCk7XG5cbiAgICAgICAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW9DbG9uZUxheW91dC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgICAgIGpxQ2xvbmVUZm9vdFswXS5hcHBlbmRDaGlsZChhb0Nsb25lTGF5b3V0W2ldLm5Ucik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZHQub0FwaS5fZm5EcmF3SGVhZChkdCwgYW9DbG9uZUxheW91dCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYW9DbG9uZUxheW91dCA9IHRoaXMuX2ZuQ29weUxheW91dChkdC5hb0Zvb3RlciwgYWlDb2x1bW5zLCBmYWxzZSk7XG4gICAgICAgICAgdmFyIGFvQ3VyckZvb3RlciA9IFtdO1xuXG4gICAgICAgICAgZHQub0FwaS5fZm5EZXRlY3RIZWFkZXIoYW9DdXJyRm9vdGVyLCAkKCc+dGZvb3QnLCBvQ2xvbmUuZm9vdGVyKVswXSk7XG5cbiAgICAgICAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW9DbG9uZUxheW91dC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpMZW4gPSBhb0Nsb25lTGF5b3V0W2ldLmxlbmd0aDsgaiA8IGpMZW47IGorKykge1xuICAgICAgICAgICAgICBhb0N1cnJGb290ZXJbaV1bal0uY2VsbC5jbGFzc05hbWUgPSBhb0Nsb25lTGF5b3V0W2ldW2pdLmNlbGwuY2xhc3NOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2ZuRXF1YWxpc2VIZWlnaHRzKCd0Zm9vdCcsIHRoaXMuZG9tLmZvb3Rlciwgb0Nsb25lLmZvb3Rlcik7XG4gICAgICB9XG5cbiAgICAgIHZhciBhblVuaXF1ZSA9IGR0Lm9BcGkuX2ZuR2V0VW5pcXVlVGhzKGR0LCAkKCc+dGhlYWQnLCBvQ2xvbmUuaGVhZGVyKVswXSk7XG5cbiAgICAgICQoYW5VbmlxdWUpLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgaUNvbHVtbiA9IGFpQ29sdW1uc1tpXTtcbiAgICAgICAgdGhpcy5zdHlsZS53aWR0aCA9IHRoYXQucy5haUlubmVyV2lkdGhzW2lDb2x1bW5dICsgXCJweFwiO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGF0LnMuZHQublRGb290ICE9PSBudWxsKSB7XG4gICAgICAgIGFuVW5pcXVlID0gZHQub0FwaS5fZm5HZXRVbmlxdWVUaHMoZHQsICQoJz50Zm9vdCcsIG9DbG9uZS5mb290ZXIpWzBdKTtcbiAgICAgICAgJChhblVuaXF1ZSkuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAgIGlDb2x1bW4gPSBhaUNvbHVtbnNbaV07XG4gICAgICAgICAgdGhpcy5zdHlsZS53aWR0aCA9IHRoYXQucy5haUlubmVyV2lkdGhzW2lDb2x1bW5dICsgXCJweFwiO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiX2ZuR2V0VHJOb2Rlc1wiOiBmdW5jdGlvbiBfZm5HZXRUck5vZGVzKG5Jbikge1xuICAgICAgdmFyIGFPdXQgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSBuSW4uY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgaWYgKG5Jbi5jaGlsZE5vZGVzW2ldLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT0gXCJUUlwiKSB7XG4gICAgICAgICAgYU91dC5wdXNoKG5Jbi5jaGlsZE5vZGVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYU91dDtcbiAgICB9LFxuICAgIFwiX2ZuRXF1YWxpc2VIZWlnaHRzXCI6IGZ1bmN0aW9uIF9mbkVxdWFsaXNlSGVpZ2h0cyhub2RlTmFtZSwgb3JpZ2luYWwsIGNsb25lKSB7XG4gICAgICBpZiAodGhpcy5zLnNIZWlnaHRNYXRjaCA9PSAnbm9uZScgJiYgbm9kZU5hbWUgIT09ICd0aGVhZCcgJiYgbm9kZU5hbWUgIT09ICd0Zm9vdCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgaSxcbiAgICAgICAgICBpTGVuLFxuICAgICAgICAgIGlIZWlnaHQsXG4gICAgICAgICAgaUhlaWdodDIsXG4gICAgICAgICAgaUhlaWdodE9yaWdpbmFsLFxuICAgICAgICAgIGlIZWlnaHRDbG9uZSxcbiAgICAgICAgICByb290T3JpZ2luYWwgPSBvcmlnaW5hbC5nZXRFbGVtZW50c0J5VGFnTmFtZShub2RlTmFtZSlbMF0sXG4gICAgICAgICAgcm9vdENsb25lID0gY2xvbmUuZ2V0RWxlbWVudHNCeVRhZ05hbWUobm9kZU5hbWUpWzBdLFxuICAgICAgICAgIGpxQm94SGFjayA9ICQoJz4nICsgbm9kZU5hbWUgKyAnPnRyOmVxKDApJywgb3JpZ2luYWwpLmNoaWxkcmVuKCc6Zmlyc3QnKSxcbiAgICAgICAgICBpQm94SGFjayA9IGpxQm94SGFjay5vdXRlckhlaWdodCgpIC0ganFCb3hIYWNrLmhlaWdodCgpLFxuICAgICAgICAgIGFuT3JpZ2luYWwgPSB0aGlzLl9mbkdldFRyTm9kZXMocm9vdE9yaWdpbmFsKSxcbiAgICAgICAgICBhbkNsb25lID0gdGhpcy5fZm5HZXRUck5vZGVzKHJvb3RDbG9uZSksXG4gICAgICAgICAgaGVpZ2h0cyA9IFtdO1xuXG4gICAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW5DbG9uZS5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgaUhlaWdodE9yaWdpbmFsID0gYW5PcmlnaW5hbFtpXS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGlIZWlnaHRDbG9uZSA9IGFuQ2xvbmVbaV0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBpSGVpZ2h0ID0gaUhlaWdodENsb25lID4gaUhlaWdodE9yaWdpbmFsID8gaUhlaWdodENsb25lIDogaUhlaWdodE9yaWdpbmFsO1xuXG4gICAgICAgIGlmICh0aGlzLnMuc0hlaWdodE1hdGNoID09ICdzZW1pYXV0bycpIHtcbiAgICAgICAgICBhbk9yaWdpbmFsW2ldLl9EVFRDX2lIZWlnaHQgPSBpSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgaGVpZ2h0cy5wdXNoKGlIZWlnaHQpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW5DbG9uZS5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgYW5DbG9uZVtpXS5zdHlsZS5oZWlnaHQgPSBoZWlnaHRzW2ldICsgXCJweFwiO1xuICAgICAgICBhbk9yaWdpbmFsW2ldLnN0eWxlLmhlaWdodCA9IGhlaWdodHNbaV0gKyBcInB4XCI7XG4gICAgICB9XG4gICAgfSxcbiAgICBfZmlyZWZveFNjcm9sbEVycm9yOiBmdW5jdGlvbiBfZmlyZWZveFNjcm9sbEVycm9yKCkge1xuICAgICAgaWYgKF9maXJlZm94U2Nyb2xsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIHRlc3QgPSAkKCc8ZGl2Lz4nKS5jc3Moe1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIGhlaWdodDogMTAsXG4gICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgIG92ZXJmbG93OiAnc2Nyb2xsJ1xuICAgICAgICB9KS5hcHBlbmRUbygnYm9keScpO1xuICAgICAgICBfZmlyZWZveFNjcm9sbCA9IHRlc3RbMF0uY2xpZW50V2lkdGggPT09IHRlc3RbMF0ub2Zmc2V0V2lkdGggJiYgdGhpcy5fZm5EVE92ZXJmbG93KCkuYmFyICE9PSAwO1xuICAgICAgICB0ZXN0LnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX2ZpcmVmb3hTY3JvbGw7XG4gICAgfVxuICB9KTtcbiAgRml4ZWRDb2x1bW5zLmRlZmF1bHRzID0ge1xuICAgIFwiaUxlZnRDb2x1bW5zXCI6IDEsXG4gICAgXCJpUmlnaHRDb2x1bW5zXCI6IDAsXG4gICAgXCJmbkRyYXdDYWxsYmFja1wiOiBudWxsLFxuICAgIFwic0hlaWdodE1hdGNoXCI6IFwic2VtaWF1dG9cIlxuICB9O1xuICBGaXhlZENvbHVtbnMudmVyc2lvbiA9IFwiMy4yLjVcIjtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRDb2x1bW5zKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuICBEYXRhVGFibGUuQXBpLnJlZ2lzdGVyKCdmaXhlZENvbHVtbnMoKS51cGRhdGUoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICBpZiAoY3R4Ll9vRml4ZWRDb2x1bW5zKSB7XG4gICAgICAgIGN0eC5fb0ZpeGVkQ29sdW1ucy5mblVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRDb2x1bW5zKCkucmVsYXlvdXQoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICBpZiAoY3R4Ll9vRml4ZWRDb2x1bW5zKSB7XG4gICAgICAgIGN0eC5fb0ZpeGVkQ29sdW1ucy5mblJlZHJhd0xheW91dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3Rlcigncm93cygpLnJlY2FsY0hlaWdodCgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdyb3cnLCBmdW5jdGlvbiAoY3R4LCBpZHgpIHtcbiAgICAgIGlmIChjdHguX29GaXhlZENvbHVtbnMpIHtcbiAgICAgICAgY3R4Ll9vRml4ZWRDb2x1bW5zLmZuUmVjYWxjdWxhdGVIZWlnaHQodGhpcy5yb3coaWR4KS5ub2RlKCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRDb2x1bW5zKCkucm93SW5kZXgoKScsIGZ1bmN0aW9uIChyb3cpIHtcbiAgICByb3cgPSAkKHJvdyk7XG4gICAgcmV0dXJuIHJvdy5wYXJlbnRzKCcuRFRGQ19DbG9uZWQnKS5sZW5ndGggPyB0aGlzLnJvd3Moe1xuICAgICAgcGFnZTogJ2N1cnJlbnQnXG4gICAgfSkuaW5kZXhlcygpW3Jvdy5pbmRleCgpXSA6IHRoaXMucm93KHJvdykuaW5kZXgoKTtcbiAgfSk7XG4gIERhdGFUYWJsZS5BcGkucmVnaXN0ZXIoJ2ZpeGVkQ29sdW1ucygpLmNlbGxJbmRleCgpJywgZnVuY3Rpb24gKGNlbGwpIHtcbiAgICBjZWxsID0gJChjZWxsKTtcblxuICAgIGlmIChjZWxsLnBhcmVudHMoJy5EVEZDX0Nsb25lZCcpLmxlbmd0aCkge1xuICAgICAgdmFyIHJvd0Nsb25lZElkeCA9IGNlbGwucGFyZW50KCkuaW5kZXgoKTtcbiAgICAgIHZhciByb3dJZHggPSB0aGlzLnJvd3Moe1xuICAgICAgICBwYWdlOiAnY3VycmVudCdcbiAgICAgIH0pLmluZGV4ZXMoKVtyb3dDbG9uZWRJZHhdO1xuICAgICAgdmFyIGNvbHVtbklkeDtcblxuICAgICAgaWYgKGNlbGwucGFyZW50cygnLkRURkNfTGVmdFdyYXBwZXInKS5sZW5ndGgpIHtcbiAgICAgICAgY29sdW1uSWR4ID0gY2VsbC5pbmRleCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGNvbHVtbnMgPSB0aGlzLmNvbHVtbnMoKS5mbGF0dGVuKCkubGVuZ3RoO1xuICAgICAgICBjb2x1bW5JZHggPSBjb2x1bW5zIC0gdGhpcy5jb250ZXh0WzBdLl9vRml4ZWRDb2x1bW5zLnMuaVJpZ2h0Q29sdW1ucyArIGNlbGwuaW5kZXgoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcm93OiByb3dJZHgsXG4gICAgICAgIGNvbHVtbjogdGhpcy5jb2x1bW4uaW5kZXgoJ3RvRGF0YScsIGNvbHVtbklkeCksXG4gICAgICAgIGNvbHVtblZpc2libGU6IGNvbHVtbklkeFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY2VsbChjZWxsKS5pbmRleCgpO1xuICAgIH1cbiAgfSk7XG4gICQoZG9jdW1lbnQpLm9uKCdpbml0LmR0LmZpeGVkQ29sdW1ucycsIGZ1bmN0aW9uIChlLCBzZXR0aW5ncykge1xuICAgIGlmIChlLm5hbWVzcGFjZSAhPT0gJ2R0Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBpbml0ID0gc2V0dGluZ3Mub0luaXQuZml4ZWRDb2x1bW5zO1xuICAgIHZhciBkZWZhdWx0cyA9IERhdGFUYWJsZS5kZWZhdWx0cy5maXhlZENvbHVtbnM7XG5cbiAgICBpZiAoaW5pdCB8fCBkZWZhdWx0cykge1xuICAgICAgdmFyIG9wdHMgPSAkLmV4dGVuZCh7fSwgaW5pdCwgZGVmYXVsdHMpO1xuXG4gICAgICBpZiAoaW5pdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgbmV3IEZpeGVkQ29sdW1ucyhzZXR0aW5ncywgb3B0cyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgJC5mbi5kYXRhVGFibGUuRml4ZWRDb2x1bW5zID0gRml4ZWRDb2x1bW5zO1xuICAkLmZuLkRhdGFUYWJsZS5GaXhlZENvbHVtbnMgPSBGaXhlZENvbHVtbnM7XG4gIHJldHVybiBGaXhlZENvbHVtbnM7XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydqcXVlcnknLCAnZGF0YXRhYmxlcy5uZXQnXSwgZnVuY3Rpb24gKCQpIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KCQsIHdpbmRvdywgZG9jdW1lbnQpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCh0eXBlb2YgZXhwb3J0cyA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKGV4cG9ydHMpKSA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb290LCAkKSB7XG4gICAgICBpZiAoIXJvb3QpIHtcbiAgICAgICAgcm9vdCA9IHdpbmRvdztcbiAgICAgIH1cblxuICAgICAgaWYgKCEkIHx8ICEkLmZuLmRhdGFUYWJsZSkge1xuICAgICAgICAkID0gcmVxdWlyZSgnZGF0YXRhYmxlcy5uZXQnKShyb290LCAkKS4kO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFjdG9yeSgkLCByb290LCByb290LmRvY3VtZW50KTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGZhY3RvcnkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcbiAgfVxufSkoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIERhdGFUYWJsZSA9ICQuZm4uZGF0YVRhYmxlO1xuICB2YXIgX2luc3RDb3VudGVyID0gMDtcblxuICB2YXIgRml4ZWRIZWFkZXIgPSBmdW5jdGlvbiBGaXhlZEhlYWRlcihkdCwgY29uZmlnKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEZpeGVkSGVhZGVyKSkge1xuICAgICAgdGhyb3cgXCJGaXhlZEhlYWRlciBtdXN0IGJlIGluaXRpYWxpc2VkIHdpdGggdGhlICduZXcnIGtleXdvcmQuXCI7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZyA9PT0gdHJ1ZSkge1xuICAgICAgY29uZmlnID0ge307XG4gICAgfVxuXG4gICAgZHQgPSBuZXcgRGF0YVRhYmxlLkFwaShkdCk7XG4gICAgdGhpcy5jID0gJC5leHRlbmQodHJ1ZSwge30sIEZpeGVkSGVhZGVyLmRlZmF1bHRzLCBjb25maWcpO1xuICAgIHRoaXMucyA9IHtcbiAgICAgIGR0OiBkdCxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHRoZWFkVG9wOiAwLFxuICAgICAgICB0Ym9keVRvcDogMCxcbiAgICAgICAgdGZvb3RUb3A6IDAsXG4gICAgICAgIHRmb290Qm90dG9tOiAwLFxuICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdGZvb3RIZWlnaHQ6IDAsXG4gICAgICAgIHRoZWFkSGVpZ2h0OiAwLFxuICAgICAgICB3aW5kb3dIZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSxcbiAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGhlYWRlck1vZGU6IG51bGwsXG4gICAgICBmb290ZXJNb2RlOiBudWxsLFxuICAgICAgYXV0b1dpZHRoOiBkdC5zZXR0aW5ncygpWzBdLm9GZWF0dXJlcy5iQXV0b1dpZHRoLFxuICAgICAgbmFtZXNwYWNlOiAnLmR0ZmMnICsgX2luc3RDb3VudGVyKyssXG4gICAgICBzY3JvbGxMZWZ0OiB7XG4gICAgICAgIGhlYWRlcjogLTEsXG4gICAgICAgIGZvb3RlcjogLTFcbiAgICAgIH0sXG4gICAgICBlbmFibGU6IHRydWVcbiAgICB9O1xuICAgIHRoaXMuZG9tID0ge1xuICAgICAgZmxvYXRpbmdIZWFkZXI6IG51bGwsXG4gICAgICB0aGVhZDogJChkdC50YWJsZSgpLmhlYWRlcigpKSxcbiAgICAgIHRib2R5OiAkKGR0LnRhYmxlKCkuYm9keSgpKSxcbiAgICAgIHRmb290OiAkKGR0LnRhYmxlKCkuZm9vdGVyKCkpLFxuICAgICAgaGVhZGVyOiB7XG4gICAgICAgIGhvc3Q6IG51bGwsXG4gICAgICAgIGZsb2F0aW5nOiBudWxsLFxuICAgICAgICBwbGFjZWhvbGRlcjogbnVsbFxuICAgICAgfSxcbiAgICAgIGZvb3Rlcjoge1xuICAgICAgICBob3N0OiBudWxsLFxuICAgICAgICBmbG9hdGluZzogbnVsbCxcbiAgICAgICAgcGxhY2Vob2xkZXI6IG51bGxcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuZG9tLmhlYWRlci5ob3N0ID0gdGhpcy5kb20udGhlYWQucGFyZW50KCk7XG4gICAgdGhpcy5kb20uZm9vdGVyLmhvc3QgPSB0aGlzLmRvbS50Zm9vdC5wYXJlbnQoKTtcbiAgICB2YXIgZHRTZXR0aW5ncyA9IGR0LnNldHRpbmdzKClbMF07XG5cbiAgICBpZiAoZHRTZXR0aW5ncy5fZml4ZWRIZWFkZXIpIHtcbiAgICAgIHRocm93IFwiRml4ZWRIZWFkZXIgYWxyZWFkeSBpbml0aWFsaXNlZCBvbiB0YWJsZSBcIiArIGR0U2V0dGluZ3MublRhYmxlLmlkO1xuICAgIH1cblxuICAgIGR0U2V0dGluZ3MuX2ZpeGVkSGVhZGVyID0gdGhpcztcblxuICAgIHRoaXMuX2NvbnN0cnVjdG9yKCk7XG4gIH07XG5cbiAgJC5leHRlbmQoRml4ZWRIZWFkZXIucHJvdG90eXBlLCB7XG4gICAgZW5hYmxlOiBmdW5jdGlvbiBlbmFibGUoX2VuYWJsZSkge1xuICAgICAgdGhpcy5zLmVuYWJsZSA9IF9lbmFibGU7XG5cbiAgICAgIGlmICh0aGlzLmMuaGVhZGVyKSB7XG4gICAgICAgIHRoaXMuX21vZGVDaGFuZ2UoJ2luLXBsYWNlJywgJ2hlYWRlcicsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jLmZvb3RlciAmJiB0aGlzLmRvbS50Zm9vdC5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fbW9kZUNoYW5nZSgnaW4tcGxhY2UnLCAnZm9vdGVyJywgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfSxcbiAgICBoZWFkZXJPZmZzZXQ6IGZ1bmN0aW9uIGhlYWRlck9mZnNldChvZmZzZXQpIHtcbiAgICAgIGlmIChvZmZzZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmMuaGVhZGVyT2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jLmhlYWRlck9mZnNldDtcbiAgICB9LFxuICAgIGZvb3Rlck9mZnNldDogZnVuY3Rpb24gZm9vdGVyT2Zmc2V0KG9mZnNldCkge1xuICAgICAgaWYgKG9mZnNldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuYy5mb290ZXJPZmZzZXQgPSBvZmZzZXQ7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmMuZm9vdGVyT2Zmc2V0O1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbnMoKTtcblxuICAgICAgdGhpcy5fc2Nyb2xsKHRydWUpO1xuICAgIH0sXG4gICAgX2NvbnN0cnVjdG9yOiBmdW5jdGlvbiBfY29uc3RydWN0b3IoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICB2YXIgZHQgPSB0aGlzLnMuZHQ7XG4gICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcgKyB0aGlzLnMubmFtZXNwYWNlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQuX3Njcm9sbCgpO1xuICAgICAgfSkub24oJ3Jlc2l6ZScgKyB0aGlzLnMubmFtZXNwYWNlLCBEYXRhVGFibGUudXRpbC50aHJvdHRsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQucy5wb3NpdGlvbi53aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgICAgIHRoYXQudXBkYXRlKCk7XG4gICAgICB9LCA1MCkpO1xuICAgICAgdmFyIGF1dG9IZWFkZXIgPSAkKCcuZmgtZml4ZWRIZWFkZXInKTtcblxuICAgICAgaWYgKCF0aGlzLmMuaGVhZGVyT2Zmc2V0ICYmIGF1dG9IZWFkZXIubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuYy5oZWFkZXJPZmZzZXQgPSBhdXRvSGVhZGVyLm91dGVySGVpZ2h0KCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBhdXRvRm9vdGVyID0gJCgnLmZoLWZpeGVkRm9vdGVyJyk7XG5cbiAgICAgIGlmICghdGhpcy5jLmZvb3Rlck9mZnNldCAmJiBhdXRvRm9vdGVyLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmMuZm9vdGVyT2Zmc2V0ID0gYXV0b0Zvb3Rlci5vdXRlckhlaWdodCgpO1xuICAgICAgfVxuXG4gICAgICBkdC5vbignY29sdW1uLXJlb3JkZXIuZHQuZHRmYyBjb2x1bW4tdmlzaWJpbGl0eS5kdC5kdGZjIGRyYXcuZHQuZHRmYyBjb2x1bW4tc2l6aW5nLmR0LmR0ZmMgcmVzcG9uc2l2ZS1kaXNwbGF5LmR0LmR0ZmMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQudXBkYXRlKCk7XG4gICAgICB9KTtcbiAgICAgIGR0Lm9uKCdkZXN0cm95LmR0ZmMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGF0LmMuaGVhZGVyKSB7XG4gICAgICAgICAgdGhhdC5fbW9kZUNoYW5nZSgnaW4tcGxhY2UnLCAnaGVhZGVyJywgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhhdC5jLmZvb3RlciAmJiB0aGF0LmRvbS50Zm9vdC5sZW5ndGgpIHtcbiAgICAgICAgICB0aGF0Ll9tb2RlQ2hhbmdlKCdpbi1wbGFjZScsICdmb290ZXInLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGR0Lm9mZignLmR0ZmMnKTtcbiAgICAgICAgJCh3aW5kb3cpLm9mZih0aGF0LnMubmFtZXNwYWNlKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9wb3NpdGlvbnMoKTtcblxuICAgICAgdGhpcy5fc2Nyb2xsKCk7XG4gICAgfSxcbiAgICBfY2xvbmU6IGZ1bmN0aW9uIF9jbG9uZShpdGVtLCBmb3JjZSkge1xuICAgICAgdmFyIGR0ID0gdGhpcy5zLmR0O1xuICAgICAgdmFyIGl0ZW1Eb20gPSB0aGlzLmRvbVtpdGVtXTtcbiAgICAgIHZhciBpdGVtRWxlbWVudCA9IGl0ZW0gPT09ICdoZWFkZXInID8gdGhpcy5kb20udGhlYWQgOiB0aGlzLmRvbS50Zm9vdDtcblxuICAgICAgaWYgKCFmb3JjZSAmJiBpdGVtRG9tLmZsb2F0aW5nKSB7XG4gICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcucmVtb3ZlQ2xhc3MoJ2ZpeGVkSGVhZGVyLWZsb2F0aW5nIGZpeGVkSGVhZGVyLWxvY2tlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGl0ZW1Eb20uZmxvYXRpbmcpIHtcbiAgICAgICAgICBpdGVtRG9tLnBsYWNlaG9sZGVyLnJlbW92ZSgpO1xuXG4gICAgICAgICAgdGhpcy5fdW5zaXplKGl0ZW0pO1xuXG4gICAgICAgICAgaXRlbURvbS5mbG9hdGluZy5jaGlsZHJlbigpLmRldGFjaCgpO1xuICAgICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpdGVtRG9tLmZsb2F0aW5nID0gJChkdC50YWJsZSgpLm5vZGUoKS5jbG9uZU5vZGUoZmFsc2UpKS5jc3MoJ3RhYmxlLWxheW91dCcsICdmaXhlZCcpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKS5yZW1vdmVBdHRyKCdpZCcpLmFwcGVuZChpdGVtRWxlbWVudCkuYXBwZW5kVG8oJ2JvZHknKTtcbiAgICAgICAgaXRlbURvbS5wbGFjZWhvbGRlciA9IGl0ZW1FbGVtZW50LmNsb25lKGZhbHNlKTtcbiAgICAgICAgaXRlbURvbS5wbGFjZWhvbGRlci5maW5kKCcqW2lkXScpLnJlbW92ZUF0dHIoJ2lkJyk7XG4gICAgICAgIGl0ZW1Eb20uaG9zdC5wcmVwZW5kKGl0ZW1Eb20ucGxhY2Vob2xkZXIpO1xuXG4gICAgICAgIHRoaXMuX21hdGNoV2lkdGhzKGl0ZW1Eb20ucGxhY2Vob2xkZXIsIGl0ZW1Eb20uZmxvYXRpbmcpO1xuICAgICAgfVxuICAgIH0sXG4gICAgX21hdGNoV2lkdGhzOiBmdW5jdGlvbiBfbWF0Y2hXaWR0aHMoZnJvbSwgdG8pIHtcbiAgICAgIHZhciBnZXQgPSBmdW5jdGlvbiBnZXQobmFtZSkge1xuICAgICAgICByZXR1cm4gJChuYW1lLCBmcm9tKS5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAkKHRoaXMpLndpZHRoKCk7XG4gICAgICAgIH0pLnRvQXJyYXkoKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBzZXQgPSBmdW5jdGlvbiBzZXQobmFtZSwgdG9XaWR0aHMpIHtcbiAgICAgICAgJChuYW1lLCB0bykuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICQodGhpcykuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0b1dpZHRoc1tpXSxcbiAgICAgICAgICAgIG1pbldpZHRoOiB0b1dpZHRoc1tpXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHZhciB0aFdpZHRocyA9IGdldCgndGgnKTtcbiAgICAgIHZhciB0ZFdpZHRocyA9IGdldCgndGQnKTtcbiAgICAgIHNldCgndGgnLCB0aFdpZHRocyk7XG4gICAgICBzZXQoJ3RkJywgdGRXaWR0aHMpO1xuICAgIH0sXG4gICAgX3Vuc2l6ZTogZnVuY3Rpb24gX3Vuc2l6ZShpdGVtKSB7XG4gICAgICB2YXIgZWwgPSB0aGlzLmRvbVtpdGVtXS5mbG9hdGluZztcblxuICAgICAgaWYgKGVsICYmIChpdGVtID09PSAnZm9vdGVyJyB8fCBpdGVtID09PSAnaGVhZGVyJyAmJiAhdGhpcy5zLmF1dG9XaWR0aCkpIHtcbiAgICAgICAgJCgndGgsIHRkJywgZWwpLmNzcyh7XG4gICAgICAgICAgd2lkdGg6ICcnLFxuICAgICAgICAgIG1pbldpZHRoOiAnJ1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoZWwgJiYgaXRlbSA9PT0gJ2hlYWRlcicpIHtcbiAgICAgICAgJCgndGgsIHRkJywgZWwpLmNzcygnbWluLXdpZHRoJywgJycpO1xuICAgICAgfVxuICAgIH0sXG4gICAgX2hvcml6b250YWw6IGZ1bmN0aW9uIF9ob3Jpem9udGFsKGl0ZW0sIHNjcm9sbExlZnQpIHtcbiAgICAgIHZhciBpdGVtRG9tID0gdGhpcy5kb21baXRlbV07XG4gICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLnMucG9zaXRpb247XG4gICAgICB2YXIgbGFzdFNjcm9sbExlZnQgPSB0aGlzLnMuc2Nyb2xsTGVmdDtcblxuICAgICAgaWYgKGl0ZW1Eb20uZmxvYXRpbmcgJiYgbGFzdFNjcm9sbExlZnRbaXRlbV0gIT09IHNjcm9sbExlZnQpIHtcbiAgICAgICAgaXRlbURvbS5mbG9hdGluZy5jc3MoJ2xlZnQnLCBwb3NpdGlvbi5sZWZ0IC0gc2Nyb2xsTGVmdCk7XG4gICAgICAgIGxhc3RTY3JvbGxMZWZ0W2l0ZW1dID0gc2Nyb2xsTGVmdDtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9tb2RlQ2hhbmdlOiBmdW5jdGlvbiBfbW9kZUNoYW5nZShtb2RlLCBpdGVtLCBmb3JjZUNoYW5nZSkge1xuICAgICAgdmFyIGR0ID0gdGhpcy5zLmR0O1xuICAgICAgdmFyIGl0ZW1Eb20gPSB0aGlzLmRvbVtpdGVtXTtcbiAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMucy5wb3NpdGlvbjtcbiAgICAgIHZhciB0YWJsZVBhcnQgPSB0aGlzLmRvbVtpdGVtID09PSAnZm9vdGVyJyA/ICd0Zm9vdCcgOiAndGhlYWQnXTtcbiAgICAgIHZhciBmb2N1cyA9ICQuY29udGFpbnModGFibGVQYXJ0WzBdLCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSA/IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgOiBudWxsO1xuXG4gICAgICBpZiAoZm9jdXMpIHtcbiAgICAgICAgZm9jdXMuYmx1cigpO1xuICAgICAgfVxuXG4gICAgICBpZiAobW9kZSA9PT0gJ2luLXBsYWNlJykge1xuICAgICAgICBpZiAoaXRlbURvbS5wbGFjZWhvbGRlcikge1xuICAgICAgICAgIGl0ZW1Eb20ucGxhY2Vob2xkZXIucmVtb3ZlKCk7XG4gICAgICAgICAgaXRlbURvbS5wbGFjZWhvbGRlciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91bnNpemUoaXRlbSk7XG5cbiAgICAgICAgaWYgKGl0ZW0gPT09ICdoZWFkZXInKSB7XG4gICAgICAgICAgaXRlbURvbS5ob3N0LnByZXBlbmQodGFibGVQYXJ0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtRG9tLmhvc3QuYXBwZW5kKHRhYmxlUGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbURvbS5mbG9hdGluZykge1xuICAgICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcucmVtb3ZlKCk7XG4gICAgICAgICAgaXRlbURvbS5mbG9hdGluZyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ2luJykge1xuICAgICAgICB0aGlzLl9jbG9uZShpdGVtLCBmb3JjZUNoYW5nZSk7XG5cbiAgICAgICAgaXRlbURvbS5mbG9hdGluZy5hZGRDbGFzcygnZml4ZWRIZWFkZXItZmxvYXRpbmcnKS5jc3MoaXRlbSA9PT0gJ2hlYWRlcicgPyAndG9wJyA6ICdib3R0b20nLCB0aGlzLmNbaXRlbSArICdPZmZzZXQnXSkuY3NzKCdsZWZ0JywgcG9zaXRpb24ubGVmdCArICdweCcpLmNzcygnd2lkdGgnLCBwb3NpdGlvbi53aWR0aCArICdweCcpO1xuXG4gICAgICAgIGlmIChpdGVtID09PSAnZm9vdGVyJykge1xuICAgICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcuY3NzKCd0b3AnLCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ2JlbG93Jykge1xuICAgICAgICB0aGlzLl9jbG9uZShpdGVtLCBmb3JjZUNoYW5nZSk7XG5cbiAgICAgICAgaXRlbURvbS5mbG9hdGluZy5hZGRDbGFzcygnZml4ZWRIZWFkZXItbG9ja2VkJykuY3NzKCd0b3AnLCBwb3NpdGlvbi50Zm9vdFRvcCAtIHBvc2l0aW9uLnRoZWFkSGVpZ2h0KS5jc3MoJ2xlZnQnLCBwb3NpdGlvbi5sZWZ0ICsgJ3B4JykuY3NzKCd3aWR0aCcsIHBvc2l0aW9uLndpZHRoICsgJ3B4Jyk7XG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT09ICdhYm92ZScpIHtcbiAgICAgICAgdGhpcy5fY2xvbmUoaXRlbSwgZm9yY2VDaGFuZ2UpO1xuXG4gICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcuYWRkQ2xhc3MoJ2ZpeGVkSGVhZGVyLWxvY2tlZCcpLmNzcygndG9wJywgcG9zaXRpb24udGJvZHlUb3ApLmNzcygnbGVmdCcsIHBvc2l0aW9uLmxlZnQgKyAncHgnKS5jc3MoJ3dpZHRoJywgcG9zaXRpb24ud2lkdGggKyAncHgnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZvY3VzICYmIGZvY3VzICE9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZvY3VzLmZvY3VzKCk7XG4gICAgICAgIH0sIDEwKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zLnNjcm9sbExlZnQuaGVhZGVyID0gLTE7XG4gICAgICB0aGlzLnMuc2Nyb2xsTGVmdC5mb290ZXIgPSAtMTtcbiAgICAgIHRoaXMuc1tpdGVtICsgJ01vZGUnXSA9IG1vZGU7XG4gICAgfSxcbiAgICBfcG9zaXRpb25zOiBmdW5jdGlvbiBfcG9zaXRpb25zKCkge1xuICAgICAgdmFyIGR0ID0gdGhpcy5zLmR0O1xuICAgICAgdmFyIHRhYmxlID0gZHQudGFibGUoKTtcbiAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMucy5wb3NpdGlvbjtcbiAgICAgIHZhciBkb20gPSB0aGlzLmRvbTtcbiAgICAgIHZhciB0YWJsZU5vZGUgPSAkKHRhYmxlLm5vZGUoKSk7XG4gICAgICB2YXIgdGhlYWQgPSB0YWJsZU5vZGUuY2hpbGRyZW4oJ3RoZWFkJyk7XG4gICAgICB2YXIgdGZvb3QgPSB0YWJsZU5vZGUuY2hpbGRyZW4oJ3Rmb290Jyk7XG4gICAgICB2YXIgdGJvZHkgPSBkb20udGJvZHk7XG4gICAgICBwb3NpdGlvbi52aXNpYmxlID0gdGFibGVOb2RlLmlzKCc6dmlzaWJsZScpO1xuICAgICAgcG9zaXRpb24ud2lkdGggPSB0YWJsZU5vZGUub3V0ZXJXaWR0aCgpO1xuICAgICAgcG9zaXRpb24ubGVmdCA9IHRhYmxlTm9kZS5vZmZzZXQoKS5sZWZ0O1xuICAgICAgcG9zaXRpb24udGhlYWRUb3AgPSB0aGVhZC5vZmZzZXQoKS50b3A7XG4gICAgICBwb3NpdGlvbi50Ym9keVRvcCA9IHRib2R5Lm9mZnNldCgpLnRvcDtcbiAgICAgIHBvc2l0aW9uLnRoZWFkSGVpZ2h0ID0gcG9zaXRpb24udGJvZHlUb3AgLSBwb3NpdGlvbi50aGVhZFRvcDtcblxuICAgICAgaWYgKHRmb290Lmxlbmd0aCkge1xuICAgICAgICBwb3NpdGlvbi50Zm9vdFRvcCA9IHRmb290Lm9mZnNldCgpLnRvcDtcbiAgICAgICAgcG9zaXRpb24udGZvb3RCb3R0b20gPSBwb3NpdGlvbi50Zm9vdFRvcCArIHRmb290Lm91dGVySGVpZ2h0KCk7XG4gICAgICAgIHBvc2l0aW9uLnRmb290SGVpZ2h0ID0gcG9zaXRpb24udGZvb3RCb3R0b20gLSBwb3NpdGlvbi50Zm9vdFRvcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvc2l0aW9uLnRmb290VG9wID0gcG9zaXRpb24udGJvZHlUb3AgKyB0Ym9keS5vdXRlckhlaWdodCgpO1xuICAgICAgICBwb3NpdGlvbi50Zm9vdEJvdHRvbSA9IHBvc2l0aW9uLnRmb290VG9wO1xuICAgICAgICBwb3NpdGlvbi50Zm9vdEhlaWdodCA9IHBvc2l0aW9uLnRmb290VG9wO1xuICAgICAgfVxuICAgIH0sXG4gICAgX3Njcm9sbDogZnVuY3Rpb24gX3Njcm9sbChmb3JjZUNoYW5nZSkge1xuICAgICAgdmFyIHdpbmRvd1RvcCA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpO1xuICAgICAgdmFyIHdpbmRvd0xlZnQgPSAkKGRvY3VtZW50KS5zY3JvbGxMZWZ0KCk7XG4gICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLnMucG9zaXRpb247XG4gICAgICB2YXIgaGVhZGVyTW9kZSwgZm9vdGVyTW9kZTtcblxuICAgICAgaWYgKCF0aGlzLnMuZW5hYmxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYy5oZWFkZXIpIHtcbiAgICAgICAgaWYgKCFwb3NpdGlvbi52aXNpYmxlIHx8IHdpbmRvd1RvcCA8PSBwb3NpdGlvbi50aGVhZFRvcCAtIHRoaXMuYy5oZWFkZXJPZmZzZXQpIHtcbiAgICAgICAgICBoZWFkZXJNb2RlID0gJ2luLXBsYWNlJztcbiAgICAgICAgfSBlbHNlIGlmICh3aW5kb3dUb3AgPD0gcG9zaXRpb24udGZvb3RUb3AgLSBwb3NpdGlvbi50aGVhZEhlaWdodCAtIHRoaXMuYy5oZWFkZXJPZmZzZXQpIHtcbiAgICAgICAgICBoZWFkZXJNb2RlID0gJ2luJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoZWFkZXJNb2RlID0gJ2JlbG93JztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmb3JjZUNoYW5nZSB8fCBoZWFkZXJNb2RlICE9PSB0aGlzLnMuaGVhZGVyTW9kZSkge1xuICAgICAgICAgIHRoaXMuX21vZGVDaGFuZ2UoaGVhZGVyTW9kZSwgJ2hlYWRlcicsIGZvcmNlQ2hhbmdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2hvcml6b250YWwoJ2hlYWRlcicsIHdpbmRvd0xlZnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jLmZvb3RlciAmJiB0aGlzLmRvbS50Zm9vdC5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFwb3NpdGlvbi52aXNpYmxlIHx8IHdpbmRvd1RvcCArIHBvc2l0aW9uLndpbmRvd0hlaWdodCA+PSBwb3NpdGlvbi50Zm9vdEJvdHRvbSArIHRoaXMuYy5mb290ZXJPZmZzZXQpIHtcbiAgICAgICAgICBmb290ZXJNb2RlID0gJ2luLXBsYWNlJztcbiAgICAgICAgfSBlbHNlIGlmIChwb3NpdGlvbi53aW5kb3dIZWlnaHQgKyB3aW5kb3dUb3AgPiBwb3NpdGlvbi50Ym9keVRvcCArIHBvc2l0aW9uLnRmb290SGVpZ2h0ICsgdGhpcy5jLmZvb3Rlck9mZnNldCkge1xuICAgICAgICAgIGZvb3Rlck1vZGUgPSAnaW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvb3Rlck1vZGUgPSAnYWJvdmUnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZvcmNlQ2hhbmdlIHx8IGZvb3Rlck1vZGUgIT09IHRoaXMucy5mb290ZXJNb2RlKSB7XG4gICAgICAgICAgdGhpcy5fbW9kZUNoYW5nZShmb290ZXJNb2RlLCAnZm9vdGVyJywgZm9yY2VDaGFuZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faG9yaXpvbnRhbCgnZm9vdGVyJywgd2luZG93TGVmdCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgRml4ZWRIZWFkZXIudmVyc2lvbiA9IFwiMy4xLjRcIjtcbiAgRml4ZWRIZWFkZXIuZGVmYXVsdHMgPSB7XG4gICAgaGVhZGVyOiB0cnVlLFxuICAgIGZvb3RlcjogZmFsc2UsXG4gICAgaGVhZGVyT2Zmc2V0OiAwLFxuICAgIGZvb3Rlck9mZnNldDogMFxuICB9O1xuICAkLmZuLmRhdGFUYWJsZS5GaXhlZEhlYWRlciA9IEZpeGVkSGVhZGVyO1xuICAkLmZuLkRhdGFUYWJsZS5GaXhlZEhlYWRlciA9IEZpeGVkSGVhZGVyO1xuICAkKGRvY3VtZW50KS5vbignaW5pdC5kdC5kdGZoJywgZnVuY3Rpb24gKGUsIHNldHRpbmdzLCBqc29uKSB7XG4gICAgaWYgKGUubmFtZXNwYWNlICE9PSAnZHQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGluaXQgPSBzZXR0aW5ncy5vSW5pdC5maXhlZEhlYWRlcjtcbiAgICB2YXIgZGVmYXVsdHMgPSBEYXRhVGFibGUuZGVmYXVsdHMuZml4ZWRIZWFkZXI7XG5cbiAgICBpZiAoKGluaXQgfHwgZGVmYXVsdHMpICYmICFzZXR0aW5ncy5fZml4ZWRIZWFkZXIpIHtcbiAgICAgIHZhciBvcHRzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBpbml0KTtcblxuICAgICAgaWYgKGluaXQgIT09IGZhbHNlKSB7XG4gICAgICAgIG5ldyBGaXhlZEhlYWRlcihzZXR0aW5ncywgb3B0cyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRIZWFkZXIoKScsIGZ1bmN0aW9uICgpIHt9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRIZWFkZXIuYWRqdXN0KCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgdmFyIGZoID0gY3R4Ll9maXhlZEhlYWRlcjtcblxuICAgICAgaWYgKGZoKSB7XG4gICAgICAgIGZoLnVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRIZWFkZXIuZW5hYmxlKCknLCBmdW5jdGlvbiAoZmxhZykge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIHZhciBmaCA9IGN0eC5fZml4ZWRIZWFkZXI7XG4gICAgICBmbGFnID0gZmxhZyAhPT0gdW5kZWZpbmVkID8gZmxhZyA6IHRydWU7XG5cbiAgICAgIGlmIChmaCAmJiBmbGFnICE9PSBmaC5zLmVuYWJsZSkge1xuICAgICAgICBmaC5lbmFibGUoZmxhZyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBEYXRhVGFibGUuQXBpLnJlZ2lzdGVyKCdmaXhlZEhlYWRlci5kaXNhYmxlKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgdmFyIGZoID0gY3R4Ll9maXhlZEhlYWRlcjtcblxuICAgICAgaWYgKGZoICYmIGZoLnMuZW5hYmxlKSB7XG4gICAgICAgIGZoLmVuYWJsZShmYWxzZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICAkLmVhY2goWydoZWFkZXInLCAnZm9vdGVyJ10sIGZ1bmN0aW9uIChpLCBlbCkge1xuICAgIERhdGFUYWJsZS5BcGkucmVnaXN0ZXIoJ2ZpeGVkSGVhZGVyLicgKyBlbCArICdPZmZzZXQoKScsIGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICAgIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gY3R4Lmxlbmd0aCAmJiBjdHhbMF0uX2ZpeGVkSGVhZGVyID8gY3R4WzBdLl9maXhlZEhlYWRlcltlbCArICdPZmZzZXQnXSgpIDogdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICAgIHZhciBmaCA9IGN0eC5fZml4ZWRIZWFkZXI7XG5cbiAgICAgICAgaWYgKGZoKSB7XG4gICAgICAgICAgZmhbZWwgKyAnT2Zmc2V0J10ob2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gRml4ZWRIZWFkZXI7XG59KTsiXX0=
