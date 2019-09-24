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
  _Prop_Status: "Edit",
  _Prop_Config: {
    RendererToId: null,
    FormId: "",
    RecordId: "",
    ButtonId: "",
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

      this._$RendererToElem.append(result.data.formHtmlRuntime);

      VirtualBodyControl.RendererChain({
        listEntity: result.data,
        sourceHTML: result.data.formHtmlRuntime,
        $rootElem: this._$RendererToElem,
        $parentControlElem: this._$RendererToElem,
        $singleControlElem: this._$RendererToElem,
        listRuntimeInstance: this
      });
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
        listEntity: result.data,
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
        listEntity: result.data,
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
  },
  GetControlInstance: function GetControlInstance(name) {
    return this._InstanceMap[name];
  },
  GetControlInstanceByElem: function GetControlInstanceByElem($elem) {
    var instanceName = "";

    if ($elem.attr("client_instance_name") && $elem.attr("client_instance_name").length > 0) {
      instanceName = $elem.attr("client_instance_name");
    } else {
      instanceName = $elem.attr("client_resolve");
    }

    return this._InstanceMap[instanceName];
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
  GetValue: function GetValue($elem, paras) {
    var result = {};
    result.result = true;
    result.message = "";
    result.value = $elem.val();
    result.text = $elem.val();
    return result;
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
  RendererChain: function RendererChain(_rendererChainParas) {}
};
"use strict";

var WFDCT_TextBox = {
  RendererChain: function RendererChain(_rendererChainParas) {}
};
"use strict";

var WFDCT_TextDateTime = {
  RendererChain: function RendererChain(_rendererChainParas) {}
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
      formId: formid,
      buttonId: buttonid,
      elemId: elemid,
      recordId: recordId
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhdGFTZXRSdW50aW1lLmpzIiwiRm9ybVJ1bnRpbWUuanMiLCJMaXN0UnVudGltZS5qcyIsIlJ1bnRpbWVHZW5lcmFsLmpzIiwiQ29udHJvbC9IVE1MQ29udHJvbC5qcyIsIkNvbnRyb2wvVmlydHVhbEJvZHlDb250cm9sLmpzIiwiRXh0ZXJuYWwvZGF0YXRhYmxlcy5qcyIsIkNvbnRyb2wvV2ViRm9ybUNvbnRyb2wvV0ZEQ1RfRHJvcERvd25TZWxlY3QuanMiLCJDb250cm9sL1dlYkZvcm1Db250cm9sL1dGRENUX1RleHRCb3guanMiLCJDb250cm9sL1dlYkZvcm1Db250cm9sL1dGRENUX1RleHREYXRlVGltZS5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfRm9ybUJ1dHRvbi5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdEJ1dHRvbkNvbnRhaW5lci5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdENvbXBsZXhTZWFyY2hDb250YWluZXIuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RTaW1wbGVTZWFyY2hDb250YWluZXIuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RUYWJsZUNoZWNrQm94LmpzIiwiQ29udHJvbC9XZWJMaXN0Q29udHJvbC9XTERDVF9MaXN0VGFibGVDb250YWluZXIuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RUYWJsZUlubmVyQnV0dG9uQ29udGFpbmVyLmpzIiwiQ29udHJvbC9XZWJMaXN0Q29udHJvbC9XTERDVF9MaXN0VGFibGVJbm5lckJ1dHRvblNpbmdsZS5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdFRhYmxlTGFiZWwuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX1NlYXJjaF9UZXh0Qm94LmpzIiwiRXh0ZXJuYWwvRml4ZWRDb2x1bW5zLTMuMi41L2RhdGFUYWJsZXMuZml4ZWRDb2x1bW5zLmpzIiwiRXh0ZXJuYWwvRml4ZWRIZWFkZXItMy4xLjQvZGF0YVRhYmxlcy5maXhlZEhlYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDejdNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcjVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IkhUTUxEZXNpZ25SdW50aW1lRnVsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGF0YVNldFJ1bnRpbWUgPSB7XG4gIEdldERhdGFTZXREYXRhOiBmdW5jdGlvbiBHZXREYXRhU2V0RGF0YShjb25maWcsIGZ1bmMsIHNlbmRlcikge1xuICAgIHZhciBzZW5kRGF0YSA9IEpTT04uc3RyaW5naWZ5KGNvbmZpZyk7XG4gICAgQWpheFV0aWxpdHkuUG9zdFJlcXVlc3RCb2R5KFwiL1Jlc3QvQnVpbGRlci9SdW5UaW1lL0RhdGFTZXRSdW50aW1lL0dldERhdGFTZXREYXRhXCIsIHNlbmREYXRhLCBmdW5jdGlvbiAoZ2V0RGF0YVNldFJlc3VsdCkge1xuICAgICAgZnVuYy5jYWxsKHNlbmRlciwgZ2V0RGF0YVNldFJlc3VsdCk7XG4gICAgfSwgc2VuZGVyKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEZvcm1SdW50aW1lID0ge1xuICBfUHJvcF9TdGF0dXM6IFwiRWRpdFwiLFxuICBfUHJvcF9Db25maWc6IHtcbiAgICBSZW5kZXJlclRvSWQ6IG51bGwsXG4gICAgRm9ybUlkOiBcIlwiLFxuICAgIFJlY29yZElkOiBcIlwiLFxuICAgIEJ1dHRvbklkOiBcIlwiLFxuICAgIElzUHJldmlldzogZmFsc2VcbiAgfSxcbiAgXyRSZW5kZXJlclRvRWxlbTogbnVsbCxcbiAgSW5pdGlhbGl6YXRpb246IGZ1bmN0aW9uIEluaXRpYWxpemF0aW9uKF9jb25maWcpIHtcbiAgICB0aGlzLl9Qcm9wX0NvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLl9Qcm9wX0NvbmZpZywgX2NvbmZpZyk7XG4gICAgdGhpcy5fJFJlbmRlcmVyVG9FbGVtID0gJChcIiNcIiArIHRoaXMuX1Byb3BfQ29uZmlnLlJlbmRlcmVyVG9JZCk7XG5cbiAgICB0aGlzLl9Mb2FkSFRNTFRvRWwoKTtcbiAgfSxcbiAgX1JlbmRlcmVyQ2hhaW5Jc0NvbXBsZXRlZDogdHJ1ZSxcbiAgX1JlbmRlcmVyRGF0YUNoYWluSXNDb21wbGV0ZWQ6IHRydWUsXG4gIF9Mb2FkSFRNTFRvRWw6IGZ1bmN0aW9uIF9Mb2FkSFRNTFRvRWwoKSB7XG4gICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9SZXN0L0J1aWxkZXIvUnVuVGltZS9Gb3JtUnVudGltZS9Mb2FkSFRNTFwiO1xuXG4gICAgaWYgKHRoaXMuX1Byb3BfQ29uZmlnLklzUHJldmlldykge1xuICAgICAgdXJsID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1Jlc3QvQnVpbGRlci9SdW5UaW1lL0Zvcm1SdW50aW1lL0xvYWRIVE1MRm9yUHJlVmlld1wiO1xuICAgIH1cblxuICAgIFJ1bnRpbWVHZW5lcmFsSW5zdGFuY2UuTG9hZEh0bWxEZXNpZ25Db250ZW50KHVybCwgdGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUbywge1xuICAgICAgZm9ybUlkOiB0aGlzLl9Qcm9wX0NvbmZpZy5Gb3JtSWQsXG4gICAgICByZWNvcmRJZDogdGhpcy5fUHJvcF9Db25maWcuUmVjb3JkSWQsXG4gICAgICBidXR0b25JZDogdGhpcy5fUHJvcF9Db25maWcuQnV0dG9uSWRcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBjb25zb2xlLmxvZyhcIuWKoOi9vemihOiniOeql+S9k+aIkOWKnyEhXCIpO1xuICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgdGhpcy5fJFJlbmRlcmVyVG9FbGVtLmFwcGVuZChyZXN1bHQuZGF0YS5mb3JtSHRtbFJ1bnRpbWUpO1xuXG4gICAgICBWaXJ0dWFsQm9keUNvbnRyb2wuUmVuZGVyZXJDaGFpbih7XG4gICAgICAgIGxpc3RFbnRpdHk6IHJlc3VsdC5kYXRhLFxuICAgICAgICBzb3VyY2VIVE1MOiByZXN1bHQuZGF0YS5mb3JtSHRtbFJ1bnRpbWUsXG4gICAgICAgICRyb290RWxlbTogdGhpcy5fJFJlbmRlcmVyVG9FbGVtLFxuICAgICAgICAkcGFyZW50Q29udHJvbEVsZW06IHRoaXMuXyRSZW5kZXJlclRvRWxlbSxcbiAgICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtOiB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sXG4gICAgICAgIGxpc3RSdW50aW1lSW5zdGFuY2U6IHRoaXNcbiAgICAgIH0pO1xuICAgIH0sIHRoaXMpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgTGlzdFJ1bnRpbWUgPSB7XG4gIF9Qcm9wX1N0YXR1czogXCJFZGl0XCIsXG4gIF9Qcm9wX0NvbmZpZzoge1xuICAgIFJlbmRlcmVyVG9JZDogbnVsbCxcbiAgICBMaXN0SWQ6IFwiXCIsXG4gICAgSXNQcmV2aWV3OiBmYWxzZVxuICB9LFxuICBfJFJlbmRlcmVyVG9FbGVtOiBudWxsLFxuICBJbml0aWFsaXphdGlvbjogZnVuY3Rpb24gSW5pdGlhbGl6YXRpb24oX2NvbmZpZykge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuX1Byb3BfQ29uZmlnLCBfY29uZmlnKTtcbiAgICB0aGlzLl8kUmVuZGVyZXJUb0VsZW0gPSAkKFwiI1wiICsgdGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUb0lkKTtcblxuICAgIHRoaXMuX0xvYWRIVE1MVG9FbCgpO1xuICB9LFxuICBfUmVuZGVyZXJDaGFpbklzQ29tcGxldGVkOiB0cnVlLFxuICBfUmVuZGVyZXJEYXRhQ2hhaW5Jc0NvbXBsZXRlZDogdHJ1ZSxcbiAgX0xvYWRIVE1MVG9FbDogZnVuY3Rpb24gX0xvYWRIVE1MVG9FbCgpIHtcbiAgICBSdW50aW1lR2VuZXJhbEluc3RhbmNlLkxvYWRIdG1sRGVzaWduQ29udGVudChCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvUmVzdC9CdWlsZGVyL1J1blRpbWUvTGlzdFJ1bnRpbWUvTG9hZEhUTUw/bGlzdElkPVwiICsgdGhpcy5fUHJvcF9Db25maWcuTGlzdElkLCB0aGlzLl9Qcm9wX0NvbmZpZy5SZW5kZXJlclRvLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgdGhpcy5fJFJlbmRlcmVyVG9FbGVtLmFwcGVuZChyZXN1bHQuZGF0YS5saXN0SHRtbFJ1bnRpbWUpO1xuXG4gICAgICB0aGlzLl8kUmVuZGVyZXJUb0VsZW0uYXBwZW5kKHJlc3VsdC5kYXRhLmxpc3RKc1J1bnRpbWUpO1xuXG4gICAgICBpZiAodHlwZW9mIEJ1aWxkZXJMaXN0UGFnZVJ1bnRpbWVJbnN0YW5jZS5QYWdlUmVhZHkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIEJ1aWxkZXJMaXN0UGFnZVJ1bnRpbWVJbnN0YW5jZS5QYWdlUmVhZHkoKTtcbiAgICAgIH1cblxuICAgICAgVmlydHVhbEJvZHlDb250cm9sLlJlbmRlcmVyQ2hhaW4oe1xuICAgICAgICBsaXN0RW50aXR5OiByZXN1bHQuZGF0YSxcbiAgICAgICAgc291cmNlSFRNTDogcmVzdWx0LmRhdGEubGlzdEh0bWxSdW50aW1lLFxuICAgICAgICAkcm9vdEVsZW06IHRoaXMuXyRSZW5kZXJlclRvRWxlbSxcbiAgICAgICAgJHBhcmVudENvbnRyb2xFbGVtOiB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sXG4gICAgICAgICRzaW5nbGVDb250cm9sRWxlbTogdGhpcy5fJFJlbmRlcmVyVG9FbGVtLFxuICAgICAgICBsaXN0UnVudGltZUluc3RhbmNlOiB0aGlzXG4gICAgICB9KTtcbiAgICAgIHZhciBSZW5kZXJlckNoYWluQ29tcGxldGVPYmogPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoX3NlbGYuX1JlbmRlcmVyQ2hhaW5Jc0NvbXBsZXRlZCkge1xuICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKFJlbmRlcmVyQ2hhaW5Db21wbGV0ZU9iaik7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIEJ1aWxkZXJMaXN0UGFnZVJ1bnRpbWVJbnN0YW5jZS5SZW5kZXJlckNoYWluQ29tcGxldGVkID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgQnVpbGRlckxpc3RQYWdlUnVudGltZUluc3RhbmNlLlJlbmRlcmVyQ2hhaW5Db21wbGV0ZWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIDUwMCk7XG4gICAgICB2YXIgdG9wRGF0YVNldElkID0gcmVzdWx0LmRhdGEubGlzdERhdGFzZXRJZDtcbiAgICAgIFZpcnR1YWxCb2R5Q29udHJvbC5SZW5kZXJlckRhdGFDaGFpbih7XG4gICAgICAgIGxpc3RFbnRpdHk6IHJlc3VsdC5kYXRhLFxuICAgICAgICBzb3VyY2VIVE1MOiByZXN1bHQuZGF0YS5saXN0SHRtbFJ1bnRpbWUsXG4gICAgICAgICRyb290RWxlbTogdGhpcy5fJFJlbmRlcmVyVG9FbGVtLFxuICAgICAgICAkcGFyZW50Q29udHJvbEVsZW06IHRoaXMuXyRSZW5kZXJlclRvRWxlbSxcbiAgICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtOiB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sXG4gICAgICAgIHRvcERhdGFTZXRJZDogdG9wRGF0YVNldElkLFxuICAgICAgICBsaXN0UnVudGltZUluc3RhbmNlOiB0aGlzXG4gICAgICB9KTtcbiAgICAgIHZhciBSZW5kZXJlckRhdGFDaGFpbkNvbXBsZXRlT2JqID0gd2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKF9zZWxmLl9SZW5kZXJlckRhdGFDaGFpbklzQ29tcGxldGVkKSB7XG4gICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwoUmVuZGVyZXJEYXRhQ2hhaW5Db21wbGV0ZU9iaik7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIEJ1aWxkZXJMaXN0UGFnZVJ1bnRpbWVJbnN0YW5jZS5SZW5kZXJlckRhdGFDaGFpbkNvbXBsZXRlZCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIEJ1aWxkZXJMaXN0UGFnZVJ1bnRpbWVJbnN0YW5jZS5SZW5kZXJlckRhdGFDaGFpbkNvbXBsZXRlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgNzAwKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgSXNQcmV2aWV3OiBmdW5jdGlvbiBJc1ByZXZpZXcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX1Byb3BfQ29uZmlnLklzUHJldmlldztcbiAgfVxufTtcbnZhciBCdWlsZGVyTGlzdFBhZ2VSdW50aW1lSW5zdGFuY2UgPSB7XG4gIFBhZ2VSZWFkeTogZnVuY3Rpb24gUGFnZVJlYWR5KCkge1xuICAgIGNvbnNvbGUubG9nKFwi6aG16Z2i5Yqg6L29aHRtbOWujOaIkDFcIik7XG4gIH0sXG4gIFJlbmRlcmVyQ2hhaW5Db21wbGV0ZWQ6IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW5Db21wbGV0ZWQoKSB7XG4gICAgY29uc29sZS5sb2coXCLlrqLmiLfnq6/mjqfku7bmuLLmn5PlrozmiJBcIik7XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluQ29tcGxldGVkOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbkNvbXBsZXRlZCgpIHtcbiAgICBjb25zb2xlLmxvZyhcIuWuouaIt+err+aOp+S7tua4suafk+W5tue7keWumuWujOaVsOaNrlwiKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFJ1bnRpbWVHZW5lcmFsSW5zdGFuY2UgPSB7XG4gIExvYWRIdG1sRGVzaWduQ29udGVudDogZnVuY3Rpb24gTG9hZEh0bWxEZXNpZ25Db250ZW50KHVybCwgYXBwZW5kVG9FbGVtSWQsIHBhcmFtcywgY2FsbGJhY2ssIHNlbmRlcikge1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICBkYXRhOiBwYXJhbXNcbiAgICB9KS5kb25lKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwoc2VuZGVyLCByZXN1bHQpO1xuICAgIH0pLmFsd2F5cyhjYWxsYmFjayAmJiBmdW5jdGlvbiAoanFYSFIsIHN0YXR1cykge30pO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgSFRNTENvbnRyb2xBdHRycyA9IHtcbiAgSkJVSUxENERDX0NVU1RPTTogXCJqYnVpbGQ0ZGNfY3VzdG9tXCIsXG4gIFNFTEVDVEVEX0pCVUlMRDREQ19DVVNUT006IFwiW2pidWlsZDRkY19jdXN0b209dHJ1ZV1cIixcbiAgQ0xJRU5UX1JFU09MVkU6IFwiY2xpZW50X3Jlc29sdmVcIlxufTtcbnZhciBIVE1MQ29udHJvbCA9IHtcbiAgX0luc3RhbmNlTWFwOiB7fSxcbiAgR2V0SW5zdGFuY2U6IGZ1bmN0aW9uIEdldEluc3RhbmNlKG5hbWUpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fSW5zdGFuY2VNYXApIHtcbiAgICAgIGlmIChrZXkgPT0gbmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fSW5zdGFuY2VNYXBba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaW5zdGFuY2UgPSBldmFsKG5hbWUpO1xuICAgIHRoaXMuX0luc3RhbmNlTWFwW25hbWVdID0gaW5zdGFuY2U7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9LFxuICBTYXZlQ29udHJvbE5ld0luc3RhbmNlVG9Qb29sOiBmdW5jdGlvbiBTYXZlQ29udHJvbE5ld0luc3RhbmNlVG9Qb29sKCRlbGVtLCBpbnN0YW5jZSkge1xuICAgIHZhciBpbnN0YW5jZU5hbWUgPSAkZWxlbS5hdHRyKFwiY2xpZW50X3Jlc29sdmVcIikgKyBcIl9cIiArIFN0cmluZ1V0aWxpdHkuR3VpZFNwbGl0KFwiXCIpO1xuICAgICRlbGVtLmF0dHIoXCJjbGllbnRfaW5zdGFuY2VfbmFtZVwiLCBpbnN0YW5jZU5hbWUpO1xuICAgIHRoaXMuX0luc3RhbmNlTWFwW2luc3RhbmNlTmFtZV0gPSBpbnN0YW5jZTtcbiAgfSxcbiAgR2V0Q29udHJvbEluc3RhbmNlOiBmdW5jdGlvbiBHZXRDb250cm9sSW5zdGFuY2UobmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9JbnN0YW5jZU1hcFtuYW1lXTtcbiAgfSxcbiAgR2V0Q29udHJvbEluc3RhbmNlQnlFbGVtOiBmdW5jdGlvbiBHZXRDb250cm9sSW5zdGFuY2VCeUVsZW0oJGVsZW0pIHtcbiAgICB2YXIgaW5zdGFuY2VOYW1lID0gXCJcIjtcblxuICAgIGlmICgkZWxlbS5hdHRyKFwiY2xpZW50X2luc3RhbmNlX25hbWVcIikgJiYgJGVsZW0uYXR0cihcImNsaWVudF9pbnN0YW5jZV9uYW1lXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgIGluc3RhbmNlTmFtZSA9ICRlbGVtLmF0dHIoXCJjbGllbnRfaW5zdGFuY2VfbmFtZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5zdGFuY2VOYW1lID0gJGVsZW0uYXR0cihcImNsaWVudF9yZXNvbHZlXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9JbnN0YW5jZU1hcFtpbnN0YW5jZU5hbWVdO1xuICB9LFxuICBSZW5kZXJlckNoYWluUGFyYXM6IHtcbiAgICBsaXN0RW50aXR5OiBudWxsLFxuICAgIHNvdXJjZUhUTUw6IG51bGwsXG4gICAgJHJvb3RFbGVtOiBudWxsLFxuICAgICRwYXJlbnRDb250cm9sRWxlbTogbnVsbCxcbiAgICAkc2luZ2xlQ29udHJvbEVsZW06IG51bGxcbiAgfSxcbiAgUmVuZGVyZXJEYXRhQ2hhaW5QYXJhczoge1xuICAgIGxpc3RFbnRpdHk6IG51bGwsXG4gICAgc291cmNlSFRNTDogbnVsbCxcbiAgICAkcm9vdEVsZW06IG51bGwsXG4gICAgJHBhcmVudENvbnRyb2xFbGVtOiBudWxsLFxuICAgICRzaW5nbGVDb250cm9sRWxlbTogbnVsbCxcbiAgICB0b3BEYXRhU2V0OiBudWxsXG4gIH0sXG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNpbmdsZUNvbnRyb2xFbGVtLmNoaWxkcmVuKCkubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciAkY2hpbGRTaW5nbGVFbGVtID0gJCgkc2luZ2xlQ29udHJvbEVsZW0uY2hpbGRyZW4oKVtpXSk7XG4gICAgICB2YXIgX2Nsb25lUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcyA9IHt9O1xuICAgICAgSnNvblV0aWxpdHkuU2ltcGxlQ2xvbmVBdHRyKF9jbG9uZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMsIF9yZW5kZXJlckNoYWluUGFyYXMpO1xuICAgICAgX2Nsb25lUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW0gPSAkY2hpbGRTaW5nbGVFbGVtO1xuXG4gICAgICBpZiAoJGNoaWxkU2luZ2xlRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuSkJVSUxENERDX0NVU1RPTSkgPT0gXCJ0cnVlXCIgJiYgJGNoaWxkU2luZ2xlRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuQ0xJRU5UX1JFU09MVkUpKSB7XG4gICAgICAgIHZhciBjbGllbnRSZXNvbHZlTmFtZSA9ICRjaGlsZFNpbmdsZUVsZW0uYXR0cihIVE1MQ29udHJvbEF0dHJzLkNMSUVOVF9SRVNPTFZFKTtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gSFRNTENvbnRyb2wuR2V0SW5zdGFuY2UoY2xpZW50UmVzb2x2ZU5hbWUpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2UuSW5pdGlhbGl6ZSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBpbnN0YW5jZS5Jbml0aWFsaXplKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnN0YW5jZS5SZW5kZXJlckNoYWluKF9jbG9uZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpbihfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbihfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzaW5nbGVDb250cm9sRWxlbS5jaGlsZHJlbigpLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJGNoaWxkU2luZ2xlRWxlbSA9ICQoJHNpbmdsZUNvbnRyb2xFbGVtLmNoaWxkcmVuKClbaV0pO1xuICAgICAgdmFyIF9jbG9uZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMgPSB7fTtcbiAgICAgIEpzb25VdGlsaXR5LlNpbXBsZUNsb25lQXR0cihfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzLCBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcyk7XG4gICAgICBfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbSA9ICRjaGlsZFNpbmdsZUVsZW07XG5cbiAgICAgIGlmICgkY2hpbGRTaW5nbGVFbGVtLmF0dHIoSFRNTENvbnRyb2xBdHRycy5KQlVJTEQ0RENfQ1VTVE9NKSA9PSBcInRydWVcIiAmJiAkY2hpbGRTaW5nbGVFbGVtLmF0dHIoSFRNTENvbnRyb2xBdHRycy5DTElFTlRfUkVTT0xWRSkpIHtcbiAgICAgICAgdmFyIGNsaWVudFJlc29sdmVJbnN0YW5jZU5hbWUgPSAkY2hpbGRTaW5nbGVFbGVtLmF0dHIoSFRNTENvbnRyb2xBdHRycy5DTElFTlRfUkVTT0xWRSk7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldEluc3RhbmNlKGNsaWVudFJlc29sdmVJbnN0YW5jZU5hbWUpO1xuICAgICAgICBpbnN0YW5jZS5SZW5kZXJlckRhdGFDaGFpbihfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEhUTUxDb250cm9sLlJlbmRlcmVyRGF0YUNoYWluKF9jbG9uZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgR2V0VmFsdWU6IGZ1bmN0aW9uIEdldFZhbHVlKCRlbGVtLCBwYXJhcykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICByZXN1bHQucmVzdWx0ID0gdHJ1ZTtcbiAgICByZXN1bHQubWVzc2FnZSA9IFwiXCI7XG4gICAgcmVzdWx0LnZhbHVlID0gJGVsZW0udmFsKCk7XG4gICAgcmVzdWx0LnRleHQgPSAkZWxlbS52YWwoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgVmlydHVhbEJvZHlDb250cm9sID0ge1xuICBSZW5kZXJlckNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckNoYWluLFxuICBSZW5kZXJlckRhdGFDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJEYXRhQ2hhaW5cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZ1bmN0aW9uICgkKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeSgkLCB3aW5kb3csIGRvY3VtZW50KTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICgodHlwZW9mIGV4cG9ydHMgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihleHBvcnRzKSkgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm9vdCwgJCkge1xuICAgICAgaWYgKCFyb290KSB7XG4gICAgICAgIHJvb3QgPSB3aW5kb3c7XG4gICAgICB9XG5cbiAgICAgIGlmICghJCkge1xuICAgICAgICAkID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyByZXF1aXJlKCdqcXVlcnknKSA6IHJlcXVpcmUoJ2pxdWVyeScpKHJvb3QpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFjdG9yeSgkLCByb290LCByb290LmRvY3VtZW50KTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGZhY3RvcnkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcbiAgfVxufSkoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgRGF0YVRhYmxlID0gZnVuY3Rpb24gRGF0YVRhYmxlKG9wdGlvbnMpIHtcbiAgICB0aGlzLiQgPSBmdW5jdGlvbiAoc1NlbGVjdG9yLCBvT3B0cykge1xuICAgICAgcmV0dXJuIHRoaXMuYXBpKHRydWUpLiQoc1NlbGVjdG9yLCBvT3B0cyk7XG4gICAgfTtcblxuICAgIHRoaXMuXyA9IGZ1bmN0aW9uIChzU2VsZWN0b3IsIG9PcHRzKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcGkodHJ1ZSkucm93cyhzU2VsZWN0b3IsIG9PcHRzKS5kYXRhKCk7XG4gICAgfTtcblxuICAgIHRoaXMuYXBpID0gZnVuY3Rpb24gKHRyYWRpdGlvbmFsKSB7XG4gICAgICByZXR1cm4gdHJhZGl0aW9uYWwgPyBuZXcgX0FwaTIoX2ZuU2V0dGluZ3NGcm9tTm9kZSh0aGlzW19leHQuaUFwaUluZGV4XSkpIDogbmV3IF9BcGkyKHRoaXMpO1xuICAgIH07XG5cbiAgICB0aGlzLmZuQWRkRGF0YSA9IGZ1bmN0aW9uIChkYXRhLCByZWRyYXcpIHtcbiAgICAgIHZhciBhcGkgPSB0aGlzLmFwaSh0cnVlKTtcbiAgICAgIHZhciByb3dzID0gJC5pc0FycmF5KGRhdGEpICYmICgkLmlzQXJyYXkoZGF0YVswXSkgfHwgJC5pc1BsYWluT2JqZWN0KGRhdGFbMF0pKSA/IGFwaS5yb3dzLmFkZChkYXRhKSA6IGFwaS5yb3cuYWRkKGRhdGEpO1xuXG4gICAgICBpZiAocmVkcmF3ID09PSB1bmRlZmluZWQgfHwgcmVkcmF3KSB7XG4gICAgICAgIGFwaS5kcmF3KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByb3dzLmZsYXR0ZW4oKS50b0FycmF5KCk7XG4gICAgfTtcblxuICAgIHRoaXMuZm5BZGp1c3RDb2x1bW5TaXppbmcgPSBmdW5jdGlvbiAoYlJlZHJhdykge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpLmNvbHVtbnMuYWRqdXN0KCk7XG4gICAgICB2YXIgc2V0dGluZ3MgPSBhcGkuc2V0dGluZ3MoKVswXTtcbiAgICAgIHZhciBzY3JvbGwgPSBzZXR0aW5ncy5vU2Nyb2xsO1xuXG4gICAgICBpZiAoYlJlZHJhdyA9PT0gdW5kZWZpbmVkIHx8IGJSZWRyYXcpIHtcbiAgICAgICAgYXBpLmRyYXcoZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmIChzY3JvbGwuc1ggIT09IFwiXCIgfHwgc2Nyb2xsLnNZICE9PSBcIlwiKSB7XG4gICAgICAgIF9mblNjcm9sbERyYXcoc2V0dGluZ3MpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmZuQ2xlYXJUYWJsZSA9IGZ1bmN0aW9uIChiUmVkcmF3KSB7XG4gICAgICB2YXIgYXBpID0gdGhpcy5hcGkodHJ1ZSkuY2xlYXIoKTtcblxuICAgICAgaWYgKGJSZWRyYXcgPT09IHVuZGVmaW5lZCB8fCBiUmVkcmF3KSB7XG4gICAgICAgIGFwaS5kcmF3KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuZm5DbG9zZSA9IGZ1bmN0aW9uIChuVHIpIHtcbiAgICAgIHRoaXMuYXBpKHRydWUpLnJvdyhuVHIpLmNoaWxkLmhpZGUoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mbkRlbGV0ZVJvdyA9IGZ1bmN0aW9uICh0YXJnZXQsIGNhbGxiYWNrLCByZWRyYXcpIHtcbiAgICAgIHZhciBhcGkgPSB0aGlzLmFwaSh0cnVlKTtcbiAgICAgIHZhciByb3dzID0gYXBpLnJvd3ModGFyZ2V0KTtcbiAgICAgIHZhciBzZXR0aW5ncyA9IHJvd3Muc2V0dGluZ3MoKVswXTtcbiAgICAgIHZhciBkYXRhID0gc2V0dGluZ3MuYW9EYXRhW3Jvd3NbMF1bMF1dO1xuICAgICAgcm93cy5yZW1vdmUoKTtcblxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgc2V0dGluZ3MsIGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVkcmF3ID09PSB1bmRlZmluZWQgfHwgcmVkcmF3KSB7XG4gICAgICAgIGFwaS5kcmF3KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH07XG5cbiAgICB0aGlzLmZuRGVzdHJveSA9IGZ1bmN0aW9uIChyZW1vdmUpIHtcbiAgICAgIHRoaXMuYXBpKHRydWUpLmRlc3Ryb3kocmVtb3ZlKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mbkRyYXcgPSBmdW5jdGlvbiAoY29tcGxldGUpIHtcbiAgICAgIHRoaXMuYXBpKHRydWUpLmRyYXcoY29tcGxldGUpO1xuICAgIH07XG5cbiAgICB0aGlzLmZuRmlsdGVyID0gZnVuY3Rpb24gKHNJbnB1dCwgaUNvbHVtbiwgYlJlZ2V4LCBiU21hcnQsIGJTaG93R2xvYmFsLCBiQ2FzZUluc2Vuc2l0aXZlKSB7XG4gICAgICB2YXIgYXBpID0gdGhpcy5hcGkodHJ1ZSk7XG5cbiAgICAgIGlmIChpQ29sdW1uID09PSBudWxsIHx8IGlDb2x1bW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhcGkuc2VhcmNoKHNJbnB1dCwgYlJlZ2V4LCBiU21hcnQsIGJDYXNlSW5zZW5zaXRpdmUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBpLmNvbHVtbihpQ29sdW1uKS5zZWFyY2goc0lucHV0LCBiUmVnZXgsIGJTbWFydCwgYkNhc2VJbnNlbnNpdGl2ZSk7XG4gICAgICB9XG5cbiAgICAgIGFwaS5kcmF3KCk7XG4gICAgfTtcblxuICAgIHRoaXMuZm5HZXREYXRhID0gZnVuY3Rpb24gKHNyYywgY29sKSB7XG4gICAgICB2YXIgYXBpID0gdGhpcy5hcGkodHJ1ZSk7XG5cbiAgICAgIGlmIChzcmMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgdHlwZSA9IHNyYy5ub2RlTmFtZSA/IHNyYy5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpIDogJyc7XG4gICAgICAgIHJldHVybiBjb2wgIT09IHVuZGVmaW5lZCB8fCB0eXBlID09ICd0ZCcgfHwgdHlwZSA9PSAndGgnID8gYXBpLmNlbGwoc3JjLCBjb2wpLmRhdGEoKSA6IGFwaS5yb3coc3JjKS5kYXRhKCkgfHwgbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFwaS5kYXRhKCkudG9BcnJheSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmZuR2V0Tm9kZXMgPSBmdW5jdGlvbiAoaVJvdykge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpO1xuICAgICAgcmV0dXJuIGlSb3cgIT09IHVuZGVmaW5lZCA/IGFwaS5yb3coaVJvdykubm9kZSgpIDogYXBpLnJvd3MoKS5ub2RlcygpLmZsYXR0ZW4oKS50b0FycmF5KCk7XG4gICAgfTtcblxuICAgIHRoaXMuZm5HZXRQb3NpdGlvbiA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICB2YXIgYXBpID0gdGhpcy5hcGkodHJ1ZSk7XG4gICAgICB2YXIgbm9kZU5hbWUgPSBub2RlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgIGlmIChub2RlTmFtZSA9PSAnVFInKSB7XG4gICAgICAgIHJldHVybiBhcGkucm93KG5vZGUpLmluZGV4KCk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGVOYW1lID09ICdURCcgfHwgbm9kZU5hbWUgPT0gJ1RIJykge1xuICAgICAgICB2YXIgY2VsbCA9IGFwaS5jZWxsKG5vZGUpLmluZGV4KCk7XG4gICAgICAgIHJldHVybiBbY2VsbC5yb3csIGNlbGwuY29sdW1uVmlzaWJsZSwgY2VsbC5jb2x1bW5dO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgdGhpcy5mbklzT3BlbiA9IGZ1bmN0aW9uIChuVHIpIHtcbiAgICAgIHJldHVybiB0aGlzLmFwaSh0cnVlKS5yb3coblRyKS5jaGlsZC5pc1Nob3duKCk7XG4gICAgfTtcblxuICAgIHRoaXMuZm5PcGVuID0gZnVuY3Rpb24gKG5UciwgbUh0bWwsIHNDbGFzcykge1xuICAgICAgcmV0dXJuIHRoaXMuYXBpKHRydWUpLnJvdyhuVHIpLmNoaWxkKG1IdG1sLCBzQ2xhc3MpLnNob3coKS5jaGlsZCgpWzBdO1xuICAgIH07XG5cbiAgICB0aGlzLmZuUGFnZUNoYW5nZSA9IGZ1bmN0aW9uIChtQWN0aW9uLCBiUmVkcmF3KSB7XG4gICAgICB2YXIgYXBpID0gdGhpcy5hcGkodHJ1ZSkucGFnZShtQWN0aW9uKTtcblxuICAgICAgaWYgKGJSZWRyYXcgPT09IHVuZGVmaW5lZCB8fCBiUmVkcmF3KSB7XG4gICAgICAgIGFwaS5kcmF3KGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5mblNldENvbHVtblZpcyA9IGZ1bmN0aW9uIChpQ29sLCBiU2hvdywgYlJlZHJhdykge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpLmNvbHVtbihpQ29sKS52aXNpYmxlKGJTaG93KTtcblxuICAgICAgaWYgKGJSZWRyYXcgPT09IHVuZGVmaW5lZCB8fCBiUmVkcmF3KSB7XG4gICAgICAgIGFwaS5jb2x1bW5zLmFkanVzdCgpLmRyYXcoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5mblNldHRpbmdzID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF9mblNldHRpbmdzRnJvbU5vZGUodGhpc1tfZXh0LmlBcGlJbmRleF0pO1xuICAgIH07XG5cbiAgICB0aGlzLmZuU29ydCA9IGZ1bmN0aW9uIChhYVNvcnQpIHtcbiAgICAgIHRoaXMuYXBpKHRydWUpLm9yZGVyKGFhU29ydCkuZHJhdygpO1xuICAgIH07XG5cbiAgICB0aGlzLmZuU29ydExpc3RlbmVyID0gZnVuY3Rpb24gKG5Ob2RlLCBpQ29sdW1uLCBmbkNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmFwaSh0cnVlKS5vcmRlci5saXN0ZW5lcihuTm9kZSwgaUNvbHVtbiwgZm5DYWxsYmFjayk7XG4gICAgfTtcblxuICAgIHRoaXMuZm5VcGRhdGUgPSBmdW5jdGlvbiAobURhdGEsIG1Sb3csIGlDb2x1bW4sIGJSZWRyYXcsIGJBY3Rpb24pIHtcbiAgICAgIHZhciBhcGkgPSB0aGlzLmFwaSh0cnVlKTtcblxuICAgICAgaWYgKGlDb2x1bW4gPT09IHVuZGVmaW5lZCB8fCBpQ29sdW1uID09PSBudWxsKSB7XG4gICAgICAgIGFwaS5yb3cobVJvdykuZGF0YShtRGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcGkuY2VsbChtUm93LCBpQ29sdW1uKS5kYXRhKG1EYXRhKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGJBY3Rpb24gPT09IHVuZGVmaW5lZCB8fCBiQWN0aW9uKSB7XG4gICAgICAgIGFwaS5jb2x1bW5zLmFkanVzdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYlJlZHJhdyA9PT0gdW5kZWZpbmVkIHx8IGJSZWRyYXcpIHtcbiAgICAgICAgYXBpLmRyYXcoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIDA7XG4gICAgfTtcblxuICAgIHRoaXMuZm5WZXJzaW9uQ2hlY2sgPSBfZXh0LmZuVmVyc2lvbkNoZWNrO1xuXG4gICAgdmFyIF90aGF0ID0gdGhpcztcblxuICAgIHZhciBlbXB0eUluaXQgPSBvcHRpb25zID09PSB1bmRlZmluZWQ7XG4gICAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoO1xuXG4gICAgaWYgKGVtcHR5SW5pdCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIHRoaXMub0FwaSA9IHRoaXMuaW50ZXJuYWwgPSBfZXh0LmludGVybmFsO1xuXG4gICAgZm9yICh2YXIgZm4gaW4gRGF0YVRhYmxlLmV4dC5pbnRlcm5hbCkge1xuICAgICAgaWYgKGZuKSB7XG4gICAgICAgIHRoaXNbZm5dID0gX2ZuRXh0ZXJuQXBpRnVuYyhmbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvID0ge307XG4gICAgICB2YXIgb0luaXQgPSBsZW4gPiAxID8gX2ZuRXh0ZW5kKG8sIG9wdGlvbnMsIHRydWUpIDogb3B0aW9ucztcbiAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICBpTGVuLFxuICAgICAgICAgIGosXG4gICAgICAgICAgakxlbixcbiAgICAgICAgICBrLFxuICAgICAgICAgIGtMZW47XG4gICAgICB2YXIgc0lkID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICB2YXIgYkluaXRIYW5kZWRPZmYgPSBmYWxzZTtcbiAgICAgIHZhciBkZWZhdWx0cyA9IERhdGFUYWJsZS5kZWZhdWx0cztcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgIGlmICh0aGlzLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT0gJ3RhYmxlJykge1xuICAgICAgICBfZm5Mb2cobnVsbCwgMCwgJ05vbi10YWJsZSBub2RlIGluaXRpYWxpc2F0aW9uICgnICsgdGhpcy5ub2RlTmFtZSArICcpJywgMik7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBfZm5Db21wYXRPcHRzKGRlZmF1bHRzKTtcblxuICAgICAgX2ZuQ29tcGF0Q29scyhkZWZhdWx0cy5jb2x1bW4pO1xuXG4gICAgICBfZm5DYW1lbFRvSHVuZ2FyaWFuKGRlZmF1bHRzLCBkZWZhdWx0cywgdHJ1ZSk7XG5cbiAgICAgIF9mbkNhbWVsVG9IdW5nYXJpYW4oZGVmYXVsdHMuY29sdW1uLCBkZWZhdWx0cy5jb2x1bW4sIHRydWUpO1xuXG4gICAgICBfZm5DYW1lbFRvSHVuZ2FyaWFuKGRlZmF1bHRzLCAkLmV4dGVuZChvSW5pdCwgJHRoaXMuZGF0YSgpKSk7XG5cbiAgICAgIHZhciBhbGxTZXR0aW5ncyA9IERhdGFUYWJsZS5zZXR0aW5ncztcblxuICAgICAgZm9yIChpID0gMCwgaUxlbiA9IGFsbFNldHRpbmdzLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICB2YXIgcyA9IGFsbFNldHRpbmdzW2ldO1xuXG4gICAgICAgIGlmIChzLm5UYWJsZSA9PSB0aGlzIHx8IHMublRIZWFkICYmIHMublRIZWFkLnBhcmVudE5vZGUgPT0gdGhpcyB8fCBzLm5URm9vdCAmJiBzLm5URm9vdC5wYXJlbnROb2RlID09IHRoaXMpIHtcbiAgICAgICAgICB2YXIgYlJldHJpZXZlID0gb0luaXQuYlJldHJpZXZlICE9PSB1bmRlZmluZWQgPyBvSW5pdC5iUmV0cmlldmUgOiBkZWZhdWx0cy5iUmV0cmlldmU7XG4gICAgICAgICAgdmFyIGJEZXN0cm95ID0gb0luaXQuYkRlc3Ryb3kgIT09IHVuZGVmaW5lZCA/IG9Jbml0LmJEZXN0cm95IDogZGVmYXVsdHMuYkRlc3Ryb3k7XG5cbiAgICAgICAgICBpZiAoZW1wdHlJbml0IHx8IGJSZXRyaWV2ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHMub0luc3RhbmNlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYkRlc3Ryb3kpIHtcbiAgICAgICAgICAgIHMub0luc3RhbmNlLmZuRGVzdHJveSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9mbkxvZyhzLCAwLCAnQ2Fubm90IHJlaW5pdGlhbGlzZSBEYXRhVGFibGUnLCAzKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzLnNUYWJsZUlkID09IHRoaXMuaWQpIHtcbiAgICAgICAgICBhbGxTZXR0aW5ncy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNJZCA9PT0gbnVsbCB8fCBzSWQgPT09IFwiXCIpIHtcbiAgICAgICAgc0lkID0gXCJEYXRhVGFibGVzX1RhYmxlX1wiICsgRGF0YVRhYmxlLmV4dC5fdW5pcXVlKys7XG4gICAgICAgIHRoaXMuaWQgPSBzSWQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBvU2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCB7fSwgRGF0YVRhYmxlLm1vZGVscy5vU2V0dGluZ3MsIHtcbiAgICAgICAgXCJzRGVzdHJveVdpZHRoXCI6ICR0aGlzWzBdLnN0eWxlLndpZHRoLFxuICAgICAgICBcInNJbnN0YW5jZVwiOiBzSWQsXG4gICAgICAgIFwic1RhYmxlSWRcIjogc0lkXG4gICAgICB9KTtcbiAgICAgIG9TZXR0aW5ncy5uVGFibGUgPSB0aGlzO1xuICAgICAgb1NldHRpbmdzLm9BcGkgPSBfdGhhdC5pbnRlcm5hbDtcbiAgICAgIG9TZXR0aW5ncy5vSW5pdCA9IG9Jbml0O1xuICAgICAgYWxsU2V0dGluZ3MucHVzaChvU2V0dGluZ3MpO1xuICAgICAgb1NldHRpbmdzLm9JbnN0YW5jZSA9IF90aGF0Lmxlbmd0aCA9PT0gMSA/IF90aGF0IDogJHRoaXMuZGF0YVRhYmxlKCk7XG5cbiAgICAgIF9mbkNvbXBhdE9wdHMob0luaXQpO1xuXG4gICAgICBfZm5MYW5ndWFnZUNvbXBhdChvSW5pdC5vTGFuZ3VhZ2UpO1xuXG4gICAgICBpZiAob0luaXQuYUxlbmd0aE1lbnUgJiYgIW9Jbml0LmlEaXNwbGF5TGVuZ3RoKSB7XG4gICAgICAgIG9Jbml0LmlEaXNwbGF5TGVuZ3RoID0gJC5pc0FycmF5KG9Jbml0LmFMZW5ndGhNZW51WzBdKSA/IG9Jbml0LmFMZW5ndGhNZW51WzBdWzBdIDogb0luaXQuYUxlbmd0aE1lbnVbMF07XG4gICAgICB9XG5cbiAgICAgIG9Jbml0ID0gX2ZuRXh0ZW5kKCQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cyksIG9Jbml0KTtcblxuICAgICAgX2ZuTWFwKG9TZXR0aW5ncy5vRmVhdHVyZXMsIG9Jbml0LCBbXCJiUGFnaW5hdGVcIiwgXCJiTGVuZ3RoQ2hhbmdlXCIsIFwiYkZpbHRlclwiLCBcImJTb3J0XCIsIFwiYlNvcnRNdWx0aVwiLCBcImJJbmZvXCIsIFwiYlByb2Nlc3NpbmdcIiwgXCJiQXV0b1dpZHRoXCIsIFwiYlNvcnRDbGFzc2VzXCIsIFwiYlNlcnZlclNpZGVcIiwgXCJiRGVmZXJSZW5kZXJcIl0pO1xuXG4gICAgICBfZm5NYXAob1NldHRpbmdzLCBvSW5pdCwgW1wiYXNTdHJpcGVDbGFzc2VzXCIsIFwiYWpheFwiLCBcImZuU2VydmVyRGF0YVwiLCBcImZuRm9ybWF0TnVtYmVyXCIsIFwic1NlcnZlck1ldGhvZFwiLCBcImFhU29ydGluZ1wiLCBcImFhU29ydGluZ0ZpeGVkXCIsIFwiYUxlbmd0aE1lbnVcIiwgXCJzUGFnaW5hdGlvblR5cGVcIiwgXCJzQWpheFNvdXJjZVwiLCBcInNBamF4RGF0YVByb3BcIiwgXCJpU3RhdGVEdXJhdGlvblwiLCBcInNEb21cIiwgXCJiU29ydENlbGxzVG9wXCIsIFwiaVRhYkluZGV4XCIsIFwiZm5TdGF0ZUxvYWRDYWxsYmFja1wiLCBcImZuU3RhdGVTYXZlQ2FsbGJhY2tcIiwgXCJyZW5kZXJlclwiLCBcInNlYXJjaERlbGF5XCIsIFwicm93SWRcIiwgW1wiaUNvb2tpZUR1cmF0aW9uXCIsIFwiaVN0YXRlRHVyYXRpb25cIl0sIFtcIm9TZWFyY2hcIiwgXCJvUHJldmlvdXNTZWFyY2hcIl0sIFtcImFvU2VhcmNoQ29sc1wiLCBcImFvUHJlU2VhcmNoQ29sc1wiXSwgW1wiaURpc3BsYXlMZW5ndGhcIiwgXCJfaURpc3BsYXlMZW5ndGhcIl1dKTtcblxuICAgICAgX2ZuTWFwKG9TZXR0aW5ncy5vU2Nyb2xsLCBvSW5pdCwgW1tcInNTY3JvbGxYXCIsIFwic1hcIl0sIFtcInNTY3JvbGxYSW5uZXJcIiwgXCJzWElubmVyXCJdLCBbXCJzU2Nyb2xsWVwiLCBcInNZXCJdLCBbXCJiU2Nyb2xsQ29sbGFwc2VcIiwgXCJiQ29sbGFwc2VcIl1dKTtcblxuICAgICAgX2ZuTWFwKG9TZXR0aW5ncy5vTGFuZ3VhZ2UsIG9Jbml0LCBcImZuSW5mb0NhbGxiYWNrXCIpO1xuXG4gICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb0RyYXdDYWxsYmFjaycsIG9Jbml0LmZuRHJhd0NhbGxiYWNrLCAndXNlcicpO1xuXG4gICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb1NlcnZlclBhcmFtcycsIG9Jbml0LmZuU2VydmVyUGFyYW1zLCAndXNlcicpO1xuXG4gICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb1N0YXRlU2F2ZVBhcmFtcycsIG9Jbml0LmZuU3RhdGVTYXZlUGFyYW1zLCAndXNlcicpO1xuXG4gICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb1N0YXRlTG9hZFBhcmFtcycsIG9Jbml0LmZuU3RhdGVMb2FkUGFyYW1zLCAndXNlcicpO1xuXG4gICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb1N0YXRlTG9hZGVkJywgb0luaXQuZm5TdGF0ZUxvYWRlZCwgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9Sb3dDYWxsYmFjaycsIG9Jbml0LmZuUm93Q2FsbGJhY2ssICd1c2VyJyk7XG5cbiAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvUm93Q3JlYXRlZENhbGxiYWNrJywgb0luaXQuZm5DcmVhdGVkUm93LCAndXNlcicpO1xuXG4gICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb0hlYWRlckNhbGxiYWNrJywgb0luaXQuZm5IZWFkZXJDYWxsYmFjaywgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9Gb290ZXJDYWxsYmFjaycsIG9Jbml0LmZuRm9vdGVyQ2FsbGJhY2ssICd1c2VyJyk7XG5cbiAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvSW5pdENvbXBsZXRlJywgb0luaXQuZm5Jbml0Q29tcGxldGUsICd1c2VyJyk7XG5cbiAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvUHJlRHJhd0NhbGxiYWNrJywgb0luaXQuZm5QcmVEcmF3Q2FsbGJhY2ssICd1c2VyJyk7XG5cbiAgICAgIG9TZXR0aW5ncy5yb3dJZEZuID0gX2ZuR2V0T2JqZWN0RGF0YUZuKG9Jbml0LnJvd0lkKTtcblxuICAgICAgX2ZuQnJvd3NlckRldGVjdChvU2V0dGluZ3MpO1xuXG4gICAgICB2YXIgb0NsYXNzZXMgPSBvU2V0dGluZ3Mub0NsYXNzZXM7XG4gICAgICAkLmV4dGVuZChvQ2xhc3NlcywgRGF0YVRhYmxlLmV4dC5jbGFzc2VzLCBvSW5pdC5vQ2xhc3Nlcyk7XG4gICAgICAkdGhpcy5hZGRDbGFzcyhvQ2xhc3Nlcy5zVGFibGUpO1xuXG4gICAgICBpZiAob1NldHRpbmdzLmlJbml0RGlzcGxheVN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb1NldHRpbmdzLmlJbml0RGlzcGxheVN0YXJ0ID0gb0luaXQuaURpc3BsYXlTdGFydDtcbiAgICAgICAgb1NldHRpbmdzLl9pRGlzcGxheVN0YXJ0ID0gb0luaXQuaURpc3BsYXlTdGFydDtcbiAgICAgIH1cblxuICAgICAgaWYgKG9Jbml0LmlEZWZlckxvYWRpbmcgIT09IG51bGwpIHtcbiAgICAgICAgb1NldHRpbmdzLmJEZWZlckxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB2YXIgdG1wID0gJC5pc0FycmF5KG9Jbml0LmlEZWZlckxvYWRpbmcpO1xuICAgICAgICBvU2V0dGluZ3MuX2lSZWNvcmRzRGlzcGxheSA9IHRtcCA/IG9Jbml0LmlEZWZlckxvYWRpbmdbMF0gOiBvSW5pdC5pRGVmZXJMb2FkaW5nO1xuICAgICAgICBvU2V0dGluZ3MuX2lSZWNvcmRzVG90YWwgPSB0bXAgPyBvSW5pdC5pRGVmZXJMb2FkaW5nWzFdIDogb0luaXQuaURlZmVyTG9hZGluZztcbiAgICAgIH1cblxuICAgICAgdmFyIG9MYW5ndWFnZSA9IG9TZXR0aW5ncy5vTGFuZ3VhZ2U7XG4gICAgICAkLmV4dGVuZCh0cnVlLCBvTGFuZ3VhZ2UsIG9Jbml0Lm9MYW5ndWFnZSk7XG5cbiAgICAgIGlmIChvTGFuZ3VhZ2Uuc1VybCkge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgdXJsOiBvTGFuZ3VhZ2Uuc1VybCxcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKGpzb24pIHtcbiAgICAgICAgICAgIF9mbkxhbmd1YWdlQ29tcGF0KGpzb24pO1xuXG4gICAgICAgICAgICBfZm5DYW1lbFRvSHVuZ2FyaWFuKGRlZmF1bHRzLm9MYW5ndWFnZSwganNvbik7XG5cbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIG9MYW5ndWFnZSwganNvbik7XG5cbiAgICAgICAgICAgIF9mbkluaXRpYWxpc2Uob1NldHRpbmdzKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcigpIHtcbiAgICAgICAgICAgIF9mbkluaXRpYWxpc2Uob1NldHRpbmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBiSW5pdEhhbmRlZE9mZiA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChvSW5pdC5hc1N0cmlwZUNsYXNzZXMgPT09IG51bGwpIHtcbiAgICAgICAgb1NldHRpbmdzLmFzU3RyaXBlQ2xhc3NlcyA9IFtvQ2xhc3Nlcy5zU3RyaXBlT2RkLCBvQ2xhc3Nlcy5zU3RyaXBlRXZlbl07XG4gICAgICB9XG5cbiAgICAgIHZhciBzdHJpcGVDbGFzc2VzID0gb1NldHRpbmdzLmFzU3RyaXBlQ2xhc3NlcztcbiAgICAgIHZhciByb3dPbmUgPSAkdGhpcy5jaGlsZHJlbigndGJvZHknKS5maW5kKCd0cicpLmVxKDApO1xuXG4gICAgICBpZiAoJC5pbkFycmF5KHRydWUsICQubWFwKHN0cmlwZUNsYXNzZXMsIGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgICByZXR1cm4gcm93T25lLmhhc0NsYXNzKGVsKTtcbiAgICAgIH0pKSAhPT0gLTEpIHtcbiAgICAgICAgJCgndGJvZHkgdHInLCB0aGlzKS5yZW1vdmVDbGFzcyhzdHJpcGVDbGFzc2VzLmpvaW4oJyAnKSk7XG4gICAgICAgIG9TZXR0aW5ncy5hc0Rlc3Ryb3lTdHJpcGVzID0gc3RyaXBlQ2xhc3Nlcy5zbGljZSgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgYW5UaHMgPSBbXTtcbiAgICAgIHZhciBhb0NvbHVtbnNJbml0O1xuICAgICAgdmFyIG5UaGVhZCA9IHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoZWFkJyk7XG5cbiAgICAgIGlmIChuVGhlYWQubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIF9mbkRldGVjdEhlYWRlcihvU2V0dGluZ3MuYW9IZWFkZXIsIG5UaGVhZFswXSk7XG5cbiAgICAgICAgYW5UaHMgPSBfZm5HZXRVbmlxdWVUaHMob1NldHRpbmdzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9Jbml0LmFvQ29sdW1ucyA9PT0gbnVsbCkge1xuICAgICAgICBhb0NvbHVtbnNJbml0ID0gW107XG5cbiAgICAgICAgZm9yIChpID0gMCwgaUxlbiA9IGFuVGhzLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICAgIGFvQ29sdW1uc0luaXQucHVzaChudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYW9Db2x1bW5zSW5pdCA9IG9Jbml0LmFvQ29sdW1ucztcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMCwgaUxlbiA9IGFvQ29sdW1uc0luaXQubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgIF9mbkFkZENvbHVtbihvU2V0dGluZ3MsIGFuVGhzID8gYW5UaHNbaV0gOiBudWxsKTtcbiAgICAgIH1cblxuICAgICAgX2ZuQXBwbHlDb2x1bW5EZWZzKG9TZXR0aW5ncywgb0luaXQuYW9Db2x1bW5EZWZzLCBhb0NvbHVtbnNJbml0LCBmdW5jdGlvbiAoaUNvbCwgb0RlZikge1xuICAgICAgICBfZm5Db2x1bW5PcHRpb25zKG9TZXR0aW5ncywgaUNvbCwgb0RlZik7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHJvd09uZS5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGEgPSBmdW5jdGlvbiBhKGNlbGwsIG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIG5hbWUpICE9PSBudWxsID8gbmFtZSA6IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgJChyb3dPbmVbMF0pLmNoaWxkcmVuKCd0aCwgdGQnKS5lYWNoKGZ1bmN0aW9uIChpLCBjZWxsKSB7XG4gICAgICAgICAgdmFyIGNvbCA9IG9TZXR0aW5ncy5hb0NvbHVtbnNbaV07XG5cbiAgICAgICAgICBpZiAoY29sLm1EYXRhID09PSBpKSB7XG4gICAgICAgICAgICB2YXIgc29ydCA9IGEoY2VsbCwgJ3NvcnQnKSB8fCBhKGNlbGwsICdvcmRlcicpO1xuICAgICAgICAgICAgdmFyIGZpbHRlciA9IGEoY2VsbCwgJ2ZpbHRlcicpIHx8IGEoY2VsbCwgJ3NlYXJjaCcpO1xuXG4gICAgICAgICAgICBpZiAoc29ydCAhPT0gbnVsbCB8fCBmaWx0ZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgY29sLm1EYXRhID0ge1xuICAgICAgICAgICAgICAgIF86IGkgKyAnLmRpc3BsYXknLFxuICAgICAgICAgICAgICAgIHNvcnQ6IHNvcnQgIT09IG51bGwgPyBpICsgJy5AZGF0YS0nICsgc29ydCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0eXBlOiBzb3J0ICE9PSBudWxsID8gaSArICcuQGRhdGEtJyArIHNvcnQgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZmlsdGVyOiBmaWx0ZXIgIT09IG51bGwgPyBpICsgJy5AZGF0YS0nICsgZmlsdGVyIDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgX2ZuQ29sdW1uT3B0aW9ucyhvU2V0dGluZ3MsIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBmZWF0dXJlcyA9IG9TZXR0aW5ncy5vRmVhdHVyZXM7XG5cbiAgICAgIHZhciBsb2FkZWRJbml0ID0gZnVuY3Rpb24gbG9hZGVkSW5pdCgpIHtcbiAgICAgICAgaWYgKG9Jbml0LmFhU29ydGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIHNvcnRpbmcgPSBvU2V0dGluZ3MuYWFTb3J0aW5nO1xuXG4gICAgICAgICAgZm9yIChpID0gMCwgaUxlbiA9IHNvcnRpbmcubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgICAgICBzb3J0aW5nW2ldWzFdID0gb1NldHRpbmdzLmFvQ29sdW1uc1tpXS5hc1NvcnRpbmdbMF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2ZuU29ydGluZ0NsYXNzZXMob1NldHRpbmdzKTtcblxuICAgICAgICBpZiAoZmVhdHVyZXMuYlNvcnQpIHtcbiAgICAgICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb0RyYXdDYWxsYmFjaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChvU2V0dGluZ3MuYlNvcnRlZCkge1xuICAgICAgICAgICAgICB2YXIgYVNvcnQgPSBfZm5Tb3J0RmxhdHRlbihvU2V0dGluZ3MpO1xuXG4gICAgICAgICAgICAgIHZhciBzb3J0ZWRDb2x1bW5zID0ge307XG4gICAgICAgICAgICAgICQuZWFjaChhU29ydCwgZnVuY3Rpb24gKGksIHZhbCkge1xuICAgICAgICAgICAgICAgIHNvcnRlZENvbHVtbnNbdmFsLnNyY10gPSB2YWwuZGlyO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCBudWxsLCAnb3JkZXInLCBbb1NldHRpbmdzLCBhU29ydCwgc29ydGVkQ29sdW1uc10pO1xuXG4gICAgICAgICAgICAgIF9mblNvcnRBcmlhKG9TZXR0aW5ncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb0RyYXdDYWxsYmFjaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAob1NldHRpbmdzLmJTb3J0ZWQgfHwgX2ZuRGF0YVNvdXJjZShvU2V0dGluZ3MpID09PSAnc3NwJyB8fCBmZWF0dXJlcy5iRGVmZXJSZW5kZXIpIHtcbiAgICAgICAgICAgIF9mblNvcnRpbmdDbGFzc2VzKG9TZXR0aW5ncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAnc2MnKTtcblxuICAgICAgICB2YXIgY2FwdGlvbnMgPSAkdGhpcy5jaGlsZHJlbignY2FwdGlvbicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMuX2NhcHRpb25TaWRlID0gJCh0aGlzKS5jc3MoJ2NhcHRpb24tc2lkZScpO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHRoZWFkID0gJHRoaXMuY2hpbGRyZW4oJ3RoZWFkJyk7XG5cbiAgICAgICAgaWYgKHRoZWFkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRoZWFkID0gJCgnPHRoZWFkLz4nKS5hcHBlbmRUbygkdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBvU2V0dGluZ3MublRIZWFkID0gdGhlYWRbMF07XG4gICAgICAgIHZhciB0Ym9keSA9ICR0aGlzLmNoaWxkcmVuKCd0Ym9keScpO1xuXG4gICAgICAgIGlmICh0Ym9keS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0Ym9keSA9ICQoJzx0Ym9keS8+JykuYXBwZW5kVG8oJHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgb1NldHRpbmdzLm5UQm9keSA9IHRib2R5WzBdO1xuICAgICAgICB2YXIgdGZvb3QgPSAkdGhpcy5jaGlsZHJlbigndGZvb3QnKTtcblxuICAgICAgICBpZiAodGZvb3QubGVuZ3RoID09PSAwICYmIGNhcHRpb25zLmxlbmd0aCA+IDAgJiYgKG9TZXR0aW5ncy5vU2Nyb2xsLnNYICE9PSBcIlwiIHx8IG9TZXR0aW5ncy5vU2Nyb2xsLnNZICE9PSBcIlwiKSkge1xuICAgICAgICAgIHRmb290ID0gJCgnPHRmb290Lz4nKS5hcHBlbmRUbygkdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGZvb3QubGVuZ3RoID09PSAwIHx8IHRmb290LmNoaWxkcmVuKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgJHRoaXMuYWRkQ2xhc3Mob0NsYXNzZXMuc05vRm9vdGVyKTtcbiAgICAgICAgfSBlbHNlIGlmICh0Zm9vdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgb1NldHRpbmdzLm5URm9vdCA9IHRmb290WzBdO1xuXG4gICAgICAgICAgX2ZuRGV0ZWN0SGVhZGVyKG9TZXR0aW5ncy5hb0Zvb3Rlciwgb1NldHRpbmdzLm5URm9vdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob0luaXQuYWFEYXRhKSB7XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9Jbml0LmFhRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgX2ZuQWRkRGF0YShvU2V0dGluZ3MsIG9Jbml0LmFhRGF0YVtpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9TZXR0aW5ncy5iRGVmZXJMb2FkaW5nIHx8IF9mbkRhdGFTb3VyY2Uob1NldHRpbmdzKSA9PSAnZG9tJykge1xuICAgICAgICAgIF9mbkFkZFRyKG9TZXR0aW5ncywgJChvU2V0dGluZ3MublRCb2R5KS5jaGlsZHJlbigndHInKSk7XG4gICAgICAgIH1cblxuICAgICAgICBvU2V0dGluZ3MuYWlEaXNwbGF5ID0gb1NldHRpbmdzLmFpRGlzcGxheU1hc3Rlci5zbGljZSgpO1xuICAgICAgICBvU2V0dGluZ3MuYkluaXRpYWxpc2VkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoYkluaXRIYW5kZWRPZmYgPT09IGZhbHNlKSB7XG4gICAgICAgICAgX2ZuSW5pdGlhbGlzZShvU2V0dGluZ3MpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBpZiAob0luaXQuYlN0YXRlU2F2ZSkge1xuICAgICAgICBmZWF0dXJlcy5iU3RhdGVTYXZlID0gdHJ1ZTtcblxuICAgICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb0RyYXdDYWxsYmFjaycsIF9mblNhdmVTdGF0ZSwgJ3N0YXRlX3NhdmUnKTtcblxuICAgICAgICBfZm5Mb2FkU3RhdGUob1NldHRpbmdzLCBvSW5pdCwgbG9hZGVkSW5pdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2FkZWRJbml0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgX3RoYXQgPSBudWxsO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBfZXh0O1xuXG4gIHZhciBfQXBpMjtcblxuICB2YXIgX2FwaV9yZWdpc3RlcjtcblxuICB2YXIgX2FwaV9yZWdpc3RlclBsdXJhbDtcblxuICB2YXIgX3JlX2RpYyA9IHt9O1xuICB2YXIgX3JlX25ld19saW5lcyA9IC9bXFxyXFxuXS9nO1xuICB2YXIgX3JlX2h0bWwgPSAvPC4qPz4vZztcbiAgdmFyIF9yZV9kYXRlID0gL15cXGR7Miw0fVtcXC5cXC9cXC1dXFxkezEsMn1bXFwuXFwvXFwtXVxcZHsxLDJ9KFtUIF17MX1cXGR7MSwyfVs6XFwuXVxcZHsyfShbXFwuOl1cXGR7Mn0pPyk/JC87XG5cbiAgdmFyIF9yZV9lc2NhcGVfcmVnZXggPSBuZXcgUmVnRXhwKCcoXFxcXCcgKyBbJy8nLCAnLicsICcqJywgJysnLCAnPycsICd8JywgJygnLCAnKScsICdbJywgJ10nLCAneycsICd9JywgJ1xcXFwnLCAnJCcsICdeJywgJy0nXS5qb2luKCd8XFxcXCcpICsgJyknLCAnZycpO1xuXG4gIHZhciBfcmVfZm9ybWF0dGVkX251bWVyaWMgPSAvWycsJMKj4oKswqUlXFx1MjAwOVxcdTIwMkZcXHUyMEJEXFx1MjBhOVxcdTIwQkFyZmvJg86eXS9naTtcblxuICB2YXIgX2VtcHR5ID0gZnVuY3Rpb24gX2VtcHR5KGQpIHtcbiAgICByZXR1cm4gIWQgfHwgZCA9PT0gdHJ1ZSB8fCBkID09PSAnLScgPyB0cnVlIDogZmFsc2U7XG4gIH07XG5cbiAgdmFyIF9pbnRWYWwgPSBmdW5jdGlvbiBfaW50VmFsKHMpIHtcbiAgICB2YXIgaW50ZWdlciA9IHBhcnNlSW50KHMsIDEwKTtcbiAgICByZXR1cm4gIWlzTmFOKGludGVnZXIpICYmIGlzRmluaXRlKHMpID8gaW50ZWdlciA6IG51bGw7XG4gIH07XG5cbiAgdmFyIF9udW1Ub0RlY2ltYWwgPSBmdW5jdGlvbiBfbnVtVG9EZWNpbWFsKG51bSwgZGVjaW1hbFBvaW50KSB7XG4gICAgaWYgKCFfcmVfZGljW2RlY2ltYWxQb2ludF0pIHtcbiAgICAgIF9yZV9kaWNbZGVjaW1hbFBvaW50XSA9IG5ldyBSZWdFeHAoX2ZuRXNjYXBlUmVnZXgoZGVjaW1hbFBvaW50KSwgJ2cnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHlwZW9mIG51bSA9PT0gJ3N0cmluZycgJiYgZGVjaW1hbFBvaW50ICE9PSAnLicgPyBudW0ucmVwbGFjZSgvXFwuL2csICcnKS5yZXBsYWNlKF9yZV9kaWNbZGVjaW1hbFBvaW50XSwgJy4nKSA6IG51bTtcbiAgfTtcblxuICB2YXIgX2lzTnVtYmVyID0gZnVuY3Rpb24gX2lzTnVtYmVyKGQsIGRlY2ltYWxQb2ludCwgZm9ybWF0dGVkKSB7XG4gICAgdmFyIHN0clR5cGUgPSB0eXBlb2YgZCA9PT0gJ3N0cmluZyc7XG5cbiAgICBpZiAoX2VtcHR5KGQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZGVjaW1hbFBvaW50ICYmIHN0clR5cGUpIHtcbiAgICAgIGQgPSBfbnVtVG9EZWNpbWFsKGQsIGRlY2ltYWxQb2ludCk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1hdHRlZCAmJiBzdHJUeXBlKSB7XG4gICAgICBkID0gZC5yZXBsYWNlKF9yZV9mb3JtYXR0ZWRfbnVtZXJpYywgJycpO1xuICAgIH1cblxuICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChkKSkgJiYgaXNGaW5pdGUoZCk7XG4gIH07XG5cbiAgdmFyIF9pc0h0bWwgPSBmdW5jdGlvbiBfaXNIdG1sKGQpIHtcbiAgICByZXR1cm4gX2VtcHR5KGQpIHx8IHR5cGVvZiBkID09PSAnc3RyaW5nJztcbiAgfTtcblxuICB2YXIgX2h0bWxOdW1lcmljID0gZnVuY3Rpb24gX2h0bWxOdW1lcmljKGQsIGRlY2ltYWxQb2ludCwgZm9ybWF0dGVkKSB7XG4gICAgaWYgKF9lbXB0eShkKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIGh0bWwgPSBfaXNIdG1sKGQpO1xuXG4gICAgcmV0dXJuICFodG1sID8gbnVsbCA6IF9pc051bWJlcihfc3RyaXBIdG1sKGQpLCBkZWNpbWFsUG9pbnQsIGZvcm1hdHRlZCkgPyB0cnVlIDogbnVsbDtcbiAgfTtcblxuICB2YXIgX3BsdWNrID0gZnVuY3Rpb24gX3BsdWNrKGEsIHByb3AsIHByb3AyKSB7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgaWVuID0gYS5sZW5ndGg7XG5cbiAgICBpZiAocHJvcDIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZm9yICg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBpZiAoYVtpXSAmJiBhW2ldW3Byb3BdKSB7XG4gICAgICAgICAgb3V0LnB1c2goYVtpXVtwcm9wXVtwcm9wMl0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgaWYgKGFbaV0pIHtcbiAgICAgICAgICBvdXQucHVzaChhW2ldW3Byb3BdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgdmFyIF9wbHVja19vcmRlciA9IGZ1bmN0aW9uIF9wbHVja19vcmRlcihhLCBvcmRlciwgcHJvcCwgcHJvcDIpIHtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBpZW4gPSBvcmRlci5sZW5ndGg7XG5cbiAgICBpZiAocHJvcDIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZm9yICg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBpZiAoYVtvcmRlcltpXV1bcHJvcF0pIHtcbiAgICAgICAgICBvdXQucHVzaChhW29yZGVyW2ldXVtwcm9wXVtwcm9wMl0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgb3V0LnB1c2goYVtvcmRlcltpXV1bcHJvcF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgdmFyIF9yYW5nZSA9IGZ1bmN0aW9uIF9yYW5nZShsZW4sIHN0YXJ0KSB7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIHZhciBlbmQ7XG5cbiAgICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3RhcnQgPSAwO1xuICAgICAgZW5kID0gbGVuO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmQgPSBzdGFydDtcbiAgICAgIHN0YXJ0ID0gbGVuO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICBvdXQucHVzaChpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIHZhciBfcmVtb3ZlRW1wdHkgPSBmdW5jdGlvbiBfcmVtb3ZlRW1wdHkoYSkge1xuICAgIHZhciBvdXQgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBpZiAoYVtpXSkge1xuICAgICAgICBvdXQucHVzaChhW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIHZhciBfc3RyaXBIdG1sID0gZnVuY3Rpb24gX3N0cmlwSHRtbChkKSB7XG4gICAgcmV0dXJuIGQucmVwbGFjZShfcmVfaHRtbCwgJycpO1xuICB9O1xuXG4gIHZhciBfYXJlQWxsVW5pcXVlID0gZnVuY3Rpb24gX2FyZUFsbFVuaXF1ZShzcmMpIHtcbiAgICBpZiAoc3JjLmxlbmd0aCA8IDIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciBzb3J0ZWQgPSBzcmMuc2xpY2UoKS5zb3J0KCk7XG4gICAgdmFyIGxhc3QgPSBzb3J0ZWRbMF07XG5cbiAgICBmb3IgKHZhciBpID0gMSwgaWVuID0gc29ydGVkLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBpZiAoc29ydGVkW2ldID09PSBsYXN0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgbGFzdCA9IHNvcnRlZFtpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICB2YXIgX3VuaXF1ZSA9IGZ1bmN0aW9uIF91bmlxdWUoc3JjKSB7XG4gICAgaWYgKF9hcmVBbGxVbmlxdWUoc3JjKSkge1xuICAgICAgcmV0dXJuIHNyYy5zbGljZSgpO1xuICAgIH1cblxuICAgIHZhciBvdXQgPSBbXSxcbiAgICAgICAgdmFsLFxuICAgICAgICBpLFxuICAgICAgICBpZW4gPSBzcmMubGVuZ3RoLFxuICAgICAgICBqLFxuICAgICAgICBrID0gMDtcblxuICAgIGFnYWluOiBmb3IgKGkgPSAwOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIHZhbCA9IHNyY1tpXTtcblxuICAgICAgZm9yIChqID0gMDsgaiA8IGs7IGorKykge1xuICAgICAgICBpZiAob3V0W2pdID09PSB2YWwpIHtcbiAgICAgICAgICBjb250aW51ZSBhZ2FpbjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBvdXQucHVzaCh2YWwpO1xuICAgICAgaysrO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgRGF0YVRhYmxlLnV0aWwgPSB7XG4gICAgdGhyb3R0bGU6IGZ1bmN0aW9uIHRocm90dGxlKGZuLCBmcmVxKSB7XG4gICAgICB2YXIgZnJlcXVlbmN5ID0gZnJlcSAhPT0gdW5kZWZpbmVkID8gZnJlcSA6IDIwMCxcbiAgICAgICAgICBsYXN0LFxuICAgICAgICAgIHRpbWVyO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgbm93ID0gK25ldyBEYXRlKCksXG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGlmIChsYXN0ICYmIG5vdyA8IGxhc3QgKyBmcmVxdWVuY3kpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsYXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XG4gICAgICAgICAgfSwgZnJlcXVlbmN5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsYXN0ID0gbm93O1xuICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZXNjYXBlUmVnZXg6IGZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHZhbCkge1xuICAgICAgcmV0dXJuIHZhbC5yZXBsYWNlKF9yZV9lc2NhcGVfcmVnZXgsICdcXFxcJDEnKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gX2ZuSHVuZ2FyaWFuTWFwKG8pIHtcbiAgICB2YXIgaHVuZ2FyaWFuID0gJ2EgYWEgYWkgYW8gYXMgYiBmbiBpIG0gbyBzICcsXG4gICAgICAgIG1hdGNoLFxuICAgICAgICBuZXdLZXksXG4gICAgICAgIG1hcCA9IHt9O1xuICAgICQuZWFjaChvLCBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICAgIG1hdGNoID0ga2V5Lm1hdGNoKC9eKFteQS1aXSs/KShbQS1aXSkvKTtcblxuICAgICAgaWYgKG1hdGNoICYmIGh1bmdhcmlhbi5pbmRleE9mKG1hdGNoWzFdICsgJyAnKSAhPT0gLTEpIHtcbiAgICAgICAgbmV3S2V5ID0ga2V5LnJlcGxhY2UobWF0Y2hbMF0sIG1hdGNoWzJdLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICBtYXBbbmV3S2V5XSA9IGtleTtcblxuICAgICAgICBpZiAobWF0Y2hbMV0gPT09ICdvJykge1xuICAgICAgICAgIF9mbkh1bmdhcmlhbk1hcChvW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgby5faHVuZ2FyaWFuTWFwID0gbWFwO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQ2FtZWxUb0h1bmdhcmlhbihzcmMsIHVzZXIsIGZvcmNlKSB7XG4gICAgaWYgKCFzcmMuX2h1bmdhcmlhbk1hcCkge1xuICAgICAgX2ZuSHVuZ2FyaWFuTWFwKHNyYyk7XG4gICAgfVxuXG4gICAgdmFyIGh1bmdhcmlhbktleTtcbiAgICAkLmVhY2godXNlciwgZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgICBodW5nYXJpYW5LZXkgPSBzcmMuX2h1bmdhcmlhbk1hcFtrZXldO1xuXG4gICAgICBpZiAoaHVuZ2FyaWFuS2V5ICE9PSB1bmRlZmluZWQgJiYgKGZvcmNlIHx8IHVzZXJbaHVuZ2FyaWFuS2V5XSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICBpZiAoaHVuZ2FyaWFuS2V5LmNoYXJBdCgwKSA9PT0gJ28nKSB7XG4gICAgICAgICAgaWYgKCF1c2VyW2h1bmdhcmlhbktleV0pIHtcbiAgICAgICAgICAgIHVzZXJbaHVuZ2FyaWFuS2V5XSA9IHt9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQuZXh0ZW5kKHRydWUsIHVzZXJbaHVuZ2FyaWFuS2V5XSwgdXNlcltrZXldKTtcblxuICAgICAgICAgIF9mbkNhbWVsVG9IdW5nYXJpYW4oc3JjW2h1bmdhcmlhbktleV0sIHVzZXJbaHVuZ2FyaWFuS2V5XSwgZm9yY2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVzZXJbaHVuZ2FyaWFuS2V5XSA9IHVzZXJba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuTGFuZ3VhZ2VDb21wYXQobGFuZykge1xuICAgIHZhciBkZWZhdWx0cyA9IERhdGFUYWJsZS5kZWZhdWx0cy5vTGFuZ3VhZ2U7XG4gICAgdmFyIGRlZmF1bHREZWNpbWFsID0gZGVmYXVsdHMuc0RlY2ltYWw7XG5cbiAgICBpZiAoZGVmYXVsdERlY2ltYWwpIHtcbiAgICAgIF9hZGROdW1lcmljU29ydChkZWZhdWx0RGVjaW1hbCk7XG4gICAgfVxuXG4gICAgaWYgKGxhbmcpIHtcbiAgICAgIHZhciB6ZXJvUmVjb3JkcyA9IGxhbmcuc1plcm9SZWNvcmRzO1xuXG4gICAgICBpZiAoIWxhbmcuc0VtcHR5VGFibGUgJiYgemVyb1JlY29yZHMgJiYgZGVmYXVsdHMuc0VtcHR5VGFibGUgPT09IFwiTm8gZGF0YSBhdmFpbGFibGUgaW4gdGFibGVcIikge1xuICAgICAgICBfZm5NYXAobGFuZywgbGFuZywgJ3NaZXJvUmVjb3JkcycsICdzRW1wdHlUYWJsZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWxhbmcuc0xvYWRpbmdSZWNvcmRzICYmIHplcm9SZWNvcmRzICYmIGRlZmF1bHRzLnNMb2FkaW5nUmVjb3JkcyA9PT0gXCJMb2FkaW5nLi4uXCIpIHtcbiAgICAgICAgX2ZuTWFwKGxhbmcsIGxhbmcsICdzWmVyb1JlY29yZHMnLCAnc0xvYWRpbmdSZWNvcmRzJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChsYW5nLnNJbmZvVGhvdXNhbmRzKSB7XG4gICAgICAgIGxhbmcuc1Rob3VzYW5kcyA9IGxhbmcuc0luZm9UaG91c2FuZHM7XG4gICAgICB9XG5cbiAgICAgIHZhciBkZWNpbWFsID0gbGFuZy5zRGVjaW1hbDtcblxuICAgICAgaWYgKGRlY2ltYWwgJiYgZGVmYXVsdERlY2ltYWwgIT09IGRlY2ltYWwpIHtcbiAgICAgICAgX2FkZE51bWVyaWNTb3J0KGRlY2ltYWwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBfZm5Db21wYXRNYXAgPSBmdW5jdGlvbiBfZm5Db21wYXRNYXAobywga25ldywgb2xkKSB7XG4gICAgaWYgKG9ba25ld10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgb1tvbGRdID0gb1trbmV3XTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gX2ZuQ29tcGF0T3B0cyhpbml0KSB7XG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdvcmRlcmluZycsICdiU29ydCcpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdvcmRlck11bHRpJywgJ2JTb3J0TXVsdGknKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnb3JkZXJDbGFzc2VzJywgJ2JTb3J0Q2xhc3NlcycpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdvcmRlckNlbGxzVG9wJywgJ2JTb3J0Q2VsbHNUb3AnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnb3JkZXInLCAnYWFTb3J0aW5nJyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ29yZGVyRml4ZWQnLCAnYWFTb3J0aW5nRml4ZWQnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAncGFnaW5nJywgJ2JQYWdpbmF0ZScpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdwYWdpbmdUeXBlJywgJ3NQYWdpbmF0aW9uVHlwZScpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdwYWdlTGVuZ3RoJywgJ2lEaXNwbGF5TGVuZ3RoJyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ3NlYXJjaGluZycsICdiRmlsdGVyJyk7XG5cbiAgICBpZiAodHlwZW9mIGluaXQuc1Njcm9sbFggPT09ICdib29sZWFuJykge1xuICAgICAgaW5pdC5zU2Nyb2xsWCA9IGluaXQuc1Njcm9sbFggPyAnMTAwJScgOiAnJztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGluaXQuc2Nyb2xsWCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBpbml0LnNjcm9sbFggPSBpbml0LnNjcm9sbFggPyAnMTAwJScgOiAnJztcbiAgICB9XG5cbiAgICB2YXIgc2VhcmNoQ29scyA9IGluaXQuYW9TZWFyY2hDb2xzO1xuXG4gICAgaWYgKHNlYXJjaENvbHMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBzZWFyY2hDb2xzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGlmIChzZWFyY2hDb2xzW2ldKSB7XG4gICAgICAgICAgX2ZuQ2FtZWxUb0h1bmdhcmlhbihEYXRhVGFibGUubW9kZWxzLm9TZWFyY2gsIHNlYXJjaENvbHNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQ29tcGF0Q29scyhpbml0KSB7XG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdvcmRlcmFibGUnLCAnYlNvcnRhYmxlJyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ29yZGVyRGF0YScsICdhRGF0YVNvcnQnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnb3JkZXJTZXF1ZW5jZScsICdhc1NvcnRpbmcnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnb3JkZXJEYXRhVHlwZScsICdzb3J0RGF0YVR5cGUnKTtcblxuICAgIHZhciBkYXRhU29ydCA9IGluaXQuYURhdGFTb3J0O1xuXG4gICAgaWYgKHR5cGVvZiBkYXRhU29ydCA9PT0gJ251bWJlcicgJiYgISQuaXNBcnJheShkYXRhU29ydCkpIHtcbiAgICAgIGluaXQuYURhdGFTb3J0ID0gW2RhdGFTb3J0XTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Ccm93c2VyRGV0ZWN0KHNldHRpbmdzKSB7XG4gICAgaWYgKCFEYXRhVGFibGUuX19icm93c2VyKSB7XG4gICAgICB2YXIgYnJvd3NlciA9IHt9O1xuICAgICAgRGF0YVRhYmxlLl9fYnJvd3NlciA9IGJyb3dzZXI7XG4gICAgICB2YXIgbiA9ICQoJzxkaXYvPicpLmNzcyh7XG4gICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGxlZnQ6ICQod2luZG93KS5zY3JvbGxMZWZ0KCkgKiAtMSxcbiAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gICAgICB9KS5hcHBlbmQoJCgnPGRpdi8+JykuY3NzKHtcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgIHRvcDogMSxcbiAgICAgICAgbGVmdDogMSxcbiAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgb3ZlcmZsb3c6ICdzY3JvbGwnXG4gICAgICB9KS5hcHBlbmQoJCgnPGRpdi8+JykuY3NzKHtcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgaGVpZ2h0OiAxMFxuICAgICAgfSkpKS5hcHBlbmRUbygnYm9keScpO1xuICAgICAgdmFyIG91dGVyID0gbi5jaGlsZHJlbigpO1xuICAgICAgdmFyIGlubmVyID0gb3V0ZXIuY2hpbGRyZW4oKTtcbiAgICAgIGJyb3dzZXIuYmFyV2lkdGggPSBvdXRlclswXS5vZmZzZXRXaWR0aCAtIG91dGVyWzBdLmNsaWVudFdpZHRoO1xuICAgICAgYnJvd3Nlci5iU2Nyb2xsT3ZlcnNpemUgPSBpbm5lclswXS5vZmZzZXRXaWR0aCA9PT0gMTAwICYmIG91dGVyWzBdLmNsaWVudFdpZHRoICE9PSAxMDA7XG4gICAgICBicm93c2VyLmJTY3JvbGxiYXJMZWZ0ID0gTWF0aC5yb3VuZChpbm5lci5vZmZzZXQoKS5sZWZ0KSAhPT0gMTtcbiAgICAgIGJyb3dzZXIuYkJvdW5kaW5nID0gblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIG4ucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgJC5leHRlbmQoc2V0dGluZ3Mub0Jyb3dzZXIsIERhdGFUYWJsZS5fX2Jyb3dzZXIpO1xuICAgIHNldHRpbmdzLm9TY3JvbGwuaUJhcldpZHRoID0gRGF0YVRhYmxlLl9fYnJvd3Nlci5iYXJXaWR0aDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblJlZHVjZSh0aGF0LCBmbiwgaW5pdCwgc3RhcnQsIGVuZCwgaW5jKSB7XG4gICAgdmFyIGkgPSBzdGFydCxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGlzU2V0ID0gZmFsc2U7XG5cbiAgICBpZiAoaW5pdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWx1ZSA9IGluaXQ7XG4gICAgICBpc1NldCA9IHRydWU7XG4gICAgfVxuXG4gICAgd2hpbGUgKGkgIT09IGVuZCkge1xuICAgICAgaWYgKCF0aGF0Lmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2YWx1ZSA9IGlzU2V0ID8gZm4odmFsdWUsIHRoYXRbaV0sIGksIHRoYXQpIDogdGhhdFtpXTtcbiAgICAgIGlzU2V0ID0gdHJ1ZTtcbiAgICAgIGkgKz0gaW5jO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFkZENvbHVtbihvU2V0dGluZ3MsIG5UaCkge1xuICAgIHZhciBvRGVmYXVsdHMgPSBEYXRhVGFibGUuZGVmYXVsdHMuY29sdW1uO1xuICAgIHZhciBpQ29sID0gb1NldHRpbmdzLmFvQ29sdW1ucy5sZW5ndGg7XG4gICAgdmFyIG9Db2wgPSAkLmV4dGVuZCh7fSwgRGF0YVRhYmxlLm1vZGVscy5vQ29sdW1uLCBvRGVmYXVsdHMsIHtcbiAgICAgIFwiblRoXCI6IG5UaCA/IG5UaCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RoJyksXG4gICAgICBcInNUaXRsZVwiOiBvRGVmYXVsdHMuc1RpdGxlID8gb0RlZmF1bHRzLnNUaXRsZSA6IG5UaCA/IG5UaC5pbm5lckhUTUwgOiAnJyxcbiAgICAgIFwiYURhdGFTb3J0XCI6IG9EZWZhdWx0cy5hRGF0YVNvcnQgPyBvRGVmYXVsdHMuYURhdGFTb3J0IDogW2lDb2xdLFxuICAgICAgXCJtRGF0YVwiOiBvRGVmYXVsdHMubURhdGEgPyBvRGVmYXVsdHMubURhdGEgOiBpQ29sLFxuICAgICAgaWR4OiBpQ29sXG4gICAgfSk7XG4gICAgb1NldHRpbmdzLmFvQ29sdW1ucy5wdXNoKG9Db2wpO1xuICAgIHZhciBzZWFyY2hDb2xzID0gb1NldHRpbmdzLmFvUHJlU2VhcmNoQ29scztcbiAgICBzZWFyY2hDb2xzW2lDb2xdID0gJC5leHRlbmQoe30sIERhdGFUYWJsZS5tb2RlbHMub1NlYXJjaCwgc2VhcmNoQ29sc1tpQ29sXSk7XG5cbiAgICBfZm5Db2x1bW5PcHRpb25zKG9TZXR0aW5ncywgaUNvbCwgJChuVGgpLmRhdGEoKSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Db2x1bW5PcHRpb25zKG9TZXR0aW5ncywgaUNvbCwgb09wdGlvbnMpIHtcbiAgICB2YXIgb0NvbCA9IG9TZXR0aW5ncy5hb0NvbHVtbnNbaUNvbF07XG4gICAgdmFyIG9DbGFzc2VzID0gb1NldHRpbmdzLm9DbGFzc2VzO1xuICAgIHZhciB0aCA9ICQob0NvbC5uVGgpO1xuXG4gICAgaWYgKCFvQ29sLnNXaWR0aE9yaWcpIHtcbiAgICAgIG9Db2wuc1dpZHRoT3JpZyA9IHRoLmF0dHIoJ3dpZHRoJykgfHwgbnVsbDtcbiAgICAgIHZhciB0ID0gKHRoLmF0dHIoJ3N0eWxlJykgfHwgJycpLm1hdGNoKC93aWR0aDpcXHMqKFxcZCtbcHhlbSVdKykvKTtcblxuICAgICAgaWYgKHQpIHtcbiAgICAgICAgb0NvbC5zV2lkdGhPcmlnID0gdFsxXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob09wdGlvbnMgIT09IHVuZGVmaW5lZCAmJiBvT3B0aW9ucyAhPT0gbnVsbCkge1xuICAgICAgX2ZuQ29tcGF0Q29scyhvT3B0aW9ucyk7XG5cbiAgICAgIF9mbkNhbWVsVG9IdW5nYXJpYW4oRGF0YVRhYmxlLmRlZmF1bHRzLmNvbHVtbiwgb09wdGlvbnMpO1xuXG4gICAgICBpZiAob09wdGlvbnMubURhdGFQcm9wICE9PSB1bmRlZmluZWQgJiYgIW9PcHRpb25zLm1EYXRhKSB7XG4gICAgICAgIG9PcHRpb25zLm1EYXRhID0gb09wdGlvbnMubURhdGFQcm9wO1xuICAgICAgfVxuXG4gICAgICBpZiAob09wdGlvbnMuc1R5cGUpIHtcbiAgICAgICAgb0NvbC5fc01hbnVhbFR5cGUgPSBvT3B0aW9ucy5zVHlwZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9PcHRpb25zLmNsYXNzTmFtZSAmJiAhb09wdGlvbnMuc0NsYXNzKSB7XG4gICAgICAgIG9PcHRpb25zLnNDbGFzcyA9IG9PcHRpb25zLmNsYXNzTmFtZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9PcHRpb25zLnNDbGFzcykge1xuICAgICAgICB0aC5hZGRDbGFzcyhvT3B0aW9ucy5zQ2xhc3MpO1xuICAgICAgfVxuXG4gICAgICAkLmV4dGVuZChvQ29sLCBvT3B0aW9ucyk7XG5cbiAgICAgIF9mbk1hcChvQ29sLCBvT3B0aW9ucywgXCJzV2lkdGhcIiwgXCJzV2lkdGhPcmlnXCIpO1xuXG4gICAgICBpZiAob09wdGlvbnMuaURhdGFTb3J0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb0NvbC5hRGF0YVNvcnQgPSBbb09wdGlvbnMuaURhdGFTb3J0XTtcbiAgICAgIH1cblxuICAgICAgX2ZuTWFwKG9Db2wsIG9PcHRpb25zLCBcImFEYXRhU29ydFwiKTtcbiAgICB9XG5cbiAgICB2YXIgbURhdGFTcmMgPSBvQ29sLm1EYXRhO1xuXG4gICAgdmFyIG1EYXRhID0gX2ZuR2V0T2JqZWN0RGF0YUZuKG1EYXRhU3JjKTtcblxuICAgIHZhciBtUmVuZGVyID0gb0NvbC5tUmVuZGVyID8gX2ZuR2V0T2JqZWN0RGF0YUZuKG9Db2wubVJlbmRlcikgOiBudWxsO1xuXG4gICAgdmFyIGF0dHJUZXN0ID0gZnVuY3Rpb24gYXR0clRlc3Qoc3JjKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHNyYyA9PT0gJ3N0cmluZycgJiYgc3JjLmluZGV4T2YoJ0AnKSAhPT0gLTE7XG4gICAgfTtcblxuICAgIG9Db2wuX2JBdHRyU3JjID0gJC5pc1BsYWluT2JqZWN0KG1EYXRhU3JjKSAmJiAoYXR0clRlc3QobURhdGFTcmMuc29ydCkgfHwgYXR0clRlc3QobURhdGFTcmMudHlwZSkgfHwgYXR0clRlc3QobURhdGFTcmMuZmlsdGVyKSk7XG4gICAgb0NvbC5fc2V0dGVyID0gbnVsbDtcblxuICAgIG9Db2wuZm5HZXREYXRhID0gZnVuY3Rpb24gKHJvd0RhdGEsIHR5cGUsIG1ldGEpIHtcbiAgICAgIHZhciBpbm5lckRhdGEgPSBtRGF0YShyb3dEYXRhLCB0eXBlLCB1bmRlZmluZWQsIG1ldGEpO1xuICAgICAgcmV0dXJuIG1SZW5kZXIgJiYgdHlwZSA/IG1SZW5kZXIoaW5uZXJEYXRhLCB0eXBlLCByb3dEYXRhLCBtZXRhKSA6IGlubmVyRGF0YTtcbiAgICB9O1xuXG4gICAgb0NvbC5mblNldERhdGEgPSBmdW5jdGlvbiAocm93RGF0YSwgdmFsLCBtZXRhKSB7XG4gICAgICByZXR1cm4gX2ZuU2V0T2JqZWN0RGF0YUZuKG1EYXRhU3JjKShyb3dEYXRhLCB2YWwsIG1ldGEpO1xuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIG1EYXRhU3JjICE9PSAnbnVtYmVyJykge1xuICAgICAgb1NldHRpbmdzLl9yb3dSZWFkT2JqZWN0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIW9TZXR0aW5ncy5vRmVhdHVyZXMuYlNvcnQpIHtcbiAgICAgIG9Db2wuYlNvcnRhYmxlID0gZmFsc2U7XG4gICAgICB0aC5hZGRDbGFzcyhvQ2xhc3Nlcy5zU29ydGFibGVOb25lKTtcbiAgICB9XG5cbiAgICB2YXIgYkFzYyA9ICQuaW5BcnJheSgnYXNjJywgb0NvbC5hc1NvcnRpbmcpICE9PSAtMTtcbiAgICB2YXIgYkRlc2MgPSAkLmluQXJyYXkoJ2Rlc2MnLCBvQ29sLmFzU29ydGluZykgIT09IC0xO1xuXG4gICAgaWYgKCFvQ29sLmJTb3J0YWJsZSB8fCAhYkFzYyAmJiAhYkRlc2MpIHtcbiAgICAgIG9Db2wuc1NvcnRpbmdDbGFzcyA9IG9DbGFzc2VzLnNTb3J0YWJsZU5vbmU7XG4gICAgICBvQ29sLnNTb3J0aW5nQ2xhc3NKVUkgPSBcIlwiO1xuICAgIH0gZWxzZSBpZiAoYkFzYyAmJiAhYkRlc2MpIHtcbiAgICAgIG9Db2wuc1NvcnRpbmdDbGFzcyA9IG9DbGFzc2VzLnNTb3J0YWJsZUFzYztcbiAgICAgIG9Db2wuc1NvcnRpbmdDbGFzc0pVSSA9IG9DbGFzc2VzLnNTb3J0SlVJQXNjQWxsb3dlZDtcbiAgICB9IGVsc2UgaWYgKCFiQXNjICYmIGJEZXNjKSB7XG4gICAgICBvQ29sLnNTb3J0aW5nQ2xhc3MgPSBvQ2xhc3Nlcy5zU29ydGFibGVEZXNjO1xuICAgICAgb0NvbC5zU29ydGluZ0NsYXNzSlVJID0gb0NsYXNzZXMuc1NvcnRKVUlEZXNjQWxsb3dlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgb0NvbC5zU29ydGluZ0NsYXNzID0gb0NsYXNzZXMuc1NvcnRhYmxlO1xuICAgICAgb0NvbC5zU29ydGluZ0NsYXNzSlVJID0gb0NsYXNzZXMuc1NvcnRKVUk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQWRqdXN0Q29sdW1uU2l6aW5nKHNldHRpbmdzKSB7XG4gICAgaWYgKHNldHRpbmdzLm9GZWF0dXJlcy5iQXV0b1dpZHRoICE9PSBmYWxzZSkge1xuICAgICAgdmFyIGNvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnM7XG5cbiAgICAgIF9mbkNhbGN1bGF0ZUNvbHVtbldpZHRocyhzZXR0aW5ncyk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gY29sdW1ucy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgY29sdW1uc1tpXS5uVGguc3R5bGUud2lkdGggPSBjb2x1bW5zW2ldLnNXaWR0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc2Nyb2xsID0gc2V0dGluZ3Mub1Njcm9sbDtcblxuICAgIGlmIChzY3JvbGwuc1kgIT09ICcnIHx8IHNjcm9sbC5zWCAhPT0gJycpIHtcbiAgICAgIF9mblNjcm9sbERyYXcoc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgbnVsbCwgJ2NvbHVtbi1zaXppbmcnLCBbc2V0dGluZ3NdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblZpc2libGVUb0NvbHVtbkluZGV4KG9TZXR0aW5ncywgaU1hdGNoKSB7XG4gICAgdmFyIGFpVmlzID0gX2ZuR2V0Q29sdW1ucyhvU2V0dGluZ3MsICdiVmlzaWJsZScpO1xuXG4gICAgcmV0dXJuIHR5cGVvZiBhaVZpc1tpTWF0Y2hdID09PSAnbnVtYmVyJyA/IGFpVmlzW2lNYXRjaF0gOiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQ29sdW1uSW5kZXhUb1Zpc2libGUob1NldHRpbmdzLCBpTWF0Y2gpIHtcbiAgICB2YXIgYWlWaXMgPSBfZm5HZXRDb2x1bW5zKG9TZXR0aW5ncywgJ2JWaXNpYmxlJyk7XG5cbiAgICB2YXIgaVBvcyA9ICQuaW5BcnJheShpTWF0Y2gsIGFpVmlzKTtcbiAgICByZXR1cm4gaVBvcyAhPT0gLTEgPyBpUG9zIDogbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblZpc2JsZUNvbHVtbnMob1NldHRpbmdzKSB7XG4gICAgdmFyIHZpcyA9IDA7XG4gICAgJC5lYWNoKG9TZXR0aW5ncy5hb0NvbHVtbnMsIGZ1bmN0aW9uIChpLCBjb2wpIHtcbiAgICAgIGlmIChjb2wuYlZpc2libGUgJiYgJChjb2wublRoKS5jc3MoJ2Rpc3BsYXknKSAhPT0gJ25vbmUnKSB7XG4gICAgICAgIHZpcysrO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB2aXM7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5HZXRDb2x1bW5zKG9TZXR0aW5ncywgc1BhcmFtKSB7XG4gICAgdmFyIGEgPSBbXTtcbiAgICAkLm1hcChvU2V0dGluZ3MuYW9Db2x1bW5zLCBmdW5jdGlvbiAodmFsLCBpKSB7XG4gICAgICBpZiAodmFsW3NQYXJhbV0pIHtcbiAgICAgICAgYS5wdXNoKGkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBhO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQ29sdW1uVHlwZXMoc2V0dGluZ3MpIHtcbiAgICB2YXIgY29sdW1ucyA9IHNldHRpbmdzLmFvQ29sdW1ucztcbiAgICB2YXIgZGF0YSA9IHNldHRpbmdzLmFvRGF0YTtcbiAgICB2YXIgdHlwZXMgPSBEYXRhVGFibGUuZXh0LnR5cGUuZGV0ZWN0O1xuICAgIHZhciBpLCBpZW4sIGosIGplbiwgaywga2VuO1xuICAgIHZhciBjb2wsIGNlbGwsIGRldGVjdGVkVHlwZSwgY2FjaGU7XG5cbiAgICBmb3IgKGkgPSAwLCBpZW4gPSBjb2x1bW5zLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBjb2wgPSBjb2x1bW5zW2ldO1xuICAgICAgY2FjaGUgPSBbXTtcblxuICAgICAgaWYgKCFjb2wuc1R5cGUgJiYgY29sLl9zTWFudWFsVHlwZSkge1xuICAgICAgICBjb2wuc1R5cGUgPSBjb2wuX3NNYW51YWxUeXBlO1xuICAgICAgfSBlbHNlIGlmICghY29sLnNUeXBlKSB7XG4gICAgICAgIGZvciAoaiA9IDAsIGplbiA9IHR5cGVzLmxlbmd0aDsgaiA8IGplbjsgaisrKSB7XG4gICAgICAgICAgZm9yIChrID0gMCwga2VuID0gZGF0YS5sZW5ndGg7IGsgPCBrZW47IGsrKykge1xuICAgICAgICAgICAgaWYgKGNhY2hlW2tdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgY2FjaGVba10gPSBfZm5HZXRDZWxsRGF0YShzZXR0aW5ncywgaywgaSwgJ3R5cGUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGV0ZWN0ZWRUeXBlID0gdHlwZXNbal0oY2FjaGVba10sIHNldHRpbmdzKTtcblxuICAgICAgICAgICAgaWYgKCFkZXRlY3RlZFR5cGUgJiYgaiAhPT0gdHlwZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRldGVjdGVkVHlwZSA9PT0gJ2h0bWwnKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkZXRlY3RlZFR5cGUpIHtcbiAgICAgICAgICAgIGNvbC5zVHlwZSA9IGRldGVjdGVkVHlwZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY29sLnNUeXBlKSB7XG4gICAgICAgICAgY29sLnNUeXBlID0gJ3N0cmluZyc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5BcHBseUNvbHVtbkRlZnMob1NldHRpbmdzLCBhb0NvbERlZnMsIGFvQ29scywgZm4pIHtcbiAgICB2YXIgaSwgaUxlbiwgaiwgakxlbiwgaywga0xlbiwgZGVmO1xuICAgIHZhciBjb2x1bW5zID0gb1NldHRpbmdzLmFvQ29sdW1ucztcblxuICAgIGlmIChhb0NvbERlZnMpIHtcbiAgICAgIGZvciAoaSA9IGFvQ29sRGVmcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBkZWYgPSBhb0NvbERlZnNbaV07XG4gICAgICAgIHZhciBhVGFyZ2V0cyA9IGRlZi50YXJnZXRzICE9PSB1bmRlZmluZWQgPyBkZWYudGFyZ2V0cyA6IGRlZi5hVGFyZ2V0cztcblxuICAgICAgICBpZiAoISQuaXNBcnJheShhVGFyZ2V0cykpIHtcbiAgICAgICAgICBhVGFyZ2V0cyA9IFthVGFyZ2V0c107XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGogPSAwLCBqTGVuID0gYVRhcmdldHMubGVuZ3RoOyBqIDwgakxlbjsgaisrKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBhVGFyZ2V0c1tqXSA9PT0gJ251bWJlcicgJiYgYVRhcmdldHNbal0gPj0gMCkge1xuICAgICAgICAgICAgd2hpbGUgKGNvbHVtbnMubGVuZ3RoIDw9IGFUYXJnZXRzW2pdKSB7XG4gICAgICAgICAgICAgIF9mbkFkZENvbHVtbihvU2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmbihhVGFyZ2V0c1tqXSwgZGVmKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhVGFyZ2V0c1tqXSA9PT0gJ251bWJlcicgJiYgYVRhcmdldHNbal0gPCAwKSB7XG4gICAgICAgICAgICBmbihjb2x1bW5zLmxlbmd0aCArIGFUYXJnZXRzW2pdLCBkZWYpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFUYXJnZXRzW2pdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZm9yIChrID0gMCwga0xlbiA9IGNvbHVtbnMubGVuZ3RoOyBrIDwga0xlbjsgaysrKSB7XG4gICAgICAgICAgICAgIGlmIChhVGFyZ2V0c1tqXSA9PSBcIl9hbGxcIiB8fCAkKGNvbHVtbnNba10ublRoKS5oYXNDbGFzcyhhVGFyZ2V0c1tqXSkpIHtcbiAgICAgICAgICAgICAgICBmbihrLCBkZWYpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFvQ29scykge1xuICAgICAgZm9yIChpID0gMCwgaUxlbiA9IGFvQ29scy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgZm4oaSwgYW9Db2xzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5BZGREYXRhKG9TZXR0aW5ncywgYURhdGFJbiwgblRyLCBhblRkcykge1xuICAgIHZhciBpUm93ID0gb1NldHRpbmdzLmFvRGF0YS5sZW5ndGg7XG4gICAgdmFyIG9EYXRhID0gJC5leHRlbmQodHJ1ZSwge30sIERhdGFUYWJsZS5tb2RlbHMub1Jvdywge1xuICAgICAgc3JjOiBuVHIgPyAnZG9tJyA6ICdkYXRhJyxcbiAgICAgIGlkeDogaVJvd1xuICAgIH0pO1xuICAgIG9EYXRhLl9hRGF0YSA9IGFEYXRhSW47XG4gICAgb1NldHRpbmdzLmFvRGF0YS5wdXNoKG9EYXRhKTtcbiAgICB2YXIgblRkLCBzVGhpc1R5cGU7XG4gICAgdmFyIGNvbHVtbnMgPSBvU2V0dGluZ3MuYW9Db2x1bW5zO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSBjb2x1bW5zLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgY29sdW1uc1tpXS5zVHlwZSA9IG51bGw7XG4gICAgfVxuXG4gICAgb1NldHRpbmdzLmFpRGlzcGxheU1hc3Rlci5wdXNoKGlSb3cpO1xuICAgIHZhciBpZCA9IG9TZXR0aW5ncy5yb3dJZEZuKGFEYXRhSW4pO1xuXG4gICAgaWYgKGlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG9TZXR0aW5ncy5hSWRzW2lkXSA9IG9EYXRhO1xuICAgIH1cblxuICAgIGlmIChuVHIgfHwgIW9TZXR0aW5ncy5vRmVhdHVyZXMuYkRlZmVyUmVuZGVyKSB7XG4gICAgICBfZm5DcmVhdGVUcihvU2V0dGluZ3MsIGlSb3csIG5UciwgYW5UZHMpO1xuICAgIH1cblxuICAgIHJldHVybiBpUm93O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQWRkVHIoc2V0dGluZ3MsIHRycykge1xuICAgIHZhciByb3c7XG5cbiAgICBpZiAoISh0cnMgaW5zdGFuY2VvZiAkKSkge1xuICAgICAgdHJzID0gJCh0cnMpO1xuICAgIH1cblxuICAgIHJldHVybiB0cnMubWFwKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgcm93ID0gX2ZuR2V0Um93RWxlbWVudHMoc2V0dGluZ3MsIGVsKTtcbiAgICAgIHJldHVybiBfZm5BZGREYXRhKHNldHRpbmdzLCByb3cuZGF0YSwgZWwsIHJvdy5jZWxscyk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Ob2RlVG9EYXRhSW5kZXgob1NldHRpbmdzLCBuKSB7XG4gICAgcmV0dXJuIG4uX0RUX1Jvd0luZGV4ICE9PSB1bmRlZmluZWQgPyBuLl9EVF9Sb3dJbmRleCA6IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Ob2RlVG9Db2x1bW5JbmRleChvU2V0dGluZ3MsIGlSb3csIG4pIHtcbiAgICByZXR1cm4gJC5pbkFycmF5KG4sIG9TZXR0aW5ncy5hb0RhdGFbaVJvd10uYW5DZWxscyk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5HZXRDZWxsRGF0YShzZXR0aW5ncywgcm93SWR4LCBjb2xJZHgsIHR5cGUpIHtcbiAgICB2YXIgZHJhdyA9IHNldHRpbmdzLmlEcmF3O1xuICAgIHZhciBjb2wgPSBzZXR0aW5ncy5hb0NvbHVtbnNbY29sSWR4XTtcbiAgICB2YXIgcm93RGF0YSA9IHNldHRpbmdzLmFvRGF0YVtyb3dJZHhdLl9hRGF0YTtcbiAgICB2YXIgZGVmYXVsdENvbnRlbnQgPSBjb2wuc0RlZmF1bHRDb250ZW50O1xuICAgIHZhciBjZWxsRGF0YSA9IGNvbC5mbkdldERhdGEocm93RGF0YSwgdHlwZSwge1xuICAgICAgc2V0dGluZ3M6IHNldHRpbmdzLFxuICAgICAgcm93OiByb3dJZHgsXG4gICAgICBjb2w6IGNvbElkeFxuICAgIH0pO1xuXG4gICAgaWYgKGNlbGxEYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChzZXR0aW5ncy5pRHJhd0Vycm9yICE9IGRyYXcgJiYgZGVmYXVsdENvbnRlbnQgPT09IG51bGwpIHtcbiAgICAgICAgX2ZuTG9nKHNldHRpbmdzLCAwLCBcIlJlcXVlc3RlZCB1bmtub3duIHBhcmFtZXRlciBcIiArICh0eXBlb2YgY29sLm1EYXRhID09ICdmdW5jdGlvbicgPyAne2Z1bmN0aW9ufScgOiBcIidcIiArIGNvbC5tRGF0YSArIFwiJ1wiKSArIFwiIGZvciByb3cgXCIgKyByb3dJZHggKyBcIiwgY29sdW1uIFwiICsgY29sSWR4LCA0KTtcblxuICAgICAgICBzZXR0aW5ncy5pRHJhd0Vycm9yID0gZHJhdztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlZmF1bHRDb250ZW50O1xuICAgIH1cblxuICAgIGlmICgoY2VsbERhdGEgPT09IHJvd0RhdGEgfHwgY2VsbERhdGEgPT09IG51bGwpICYmIGRlZmF1bHRDb250ZW50ICE9PSBudWxsICYmIHR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2VsbERhdGEgPSBkZWZhdWx0Q29udGVudDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjZWxsRGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGNlbGxEYXRhLmNhbGwocm93RGF0YSk7XG4gICAgfVxuXG4gICAgaWYgKGNlbGxEYXRhID09PSBudWxsICYmIHR5cGUgPT0gJ2Rpc3BsYXknKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNlbGxEYXRhO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU2V0Q2VsbERhdGEoc2V0dGluZ3MsIHJvd0lkeCwgY29sSWR4LCB2YWwpIHtcbiAgICB2YXIgY29sID0gc2V0dGluZ3MuYW9Db2x1bW5zW2NvbElkeF07XG4gICAgdmFyIHJvd0RhdGEgPSBzZXR0aW5ncy5hb0RhdGFbcm93SWR4XS5fYURhdGE7XG4gICAgY29sLmZuU2V0RGF0YShyb3dEYXRhLCB2YWwsIHtcbiAgICAgIHNldHRpbmdzOiBzZXR0aW5ncyxcbiAgICAgIHJvdzogcm93SWR4LFxuICAgICAgY29sOiBjb2xJZHhcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBfX3JlQXJyYXkgPSAvXFxbLio/XFxdJC87XG4gIHZhciBfX3JlRm4gPSAvXFwoXFwpJC87XG5cbiAgZnVuY3Rpb24gX2ZuU3BsaXRPYmpOb3RhdGlvbihzdHIpIHtcbiAgICByZXR1cm4gJC5tYXAoc3RyLm1hdGNoKC8oXFxcXC58W15cXC5dKSsvZykgfHwgWycnXSwgZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBzLnJlcGxhY2UoL1xcXFxcXC4vZywgJy4nKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkdldE9iamVjdERhdGFGbihtU291cmNlKSB7XG4gICAgaWYgKCQuaXNQbGFpbk9iamVjdChtU291cmNlKSkge1xuICAgICAgdmFyIG8gPSB7fTtcbiAgICAgICQuZWFjaChtU291cmNlLCBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgIG9ba2V5XSA9IF9mbkdldE9iamVjdERhdGFGbih2YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSwgdHlwZSwgcm93LCBtZXRhKSB7XG4gICAgICAgIHZhciB0ID0gb1t0eXBlXSB8fCBvLl87XG4gICAgICAgIHJldHVybiB0ICE9PSB1bmRlZmluZWQgPyB0KGRhdGEsIHR5cGUsIHJvdywgbWV0YSkgOiBkYXRhO1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG1Tb3VyY2UgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbVNvdXJjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhLCB0eXBlLCByb3csIG1ldGEpIHtcbiAgICAgICAgcmV0dXJuIG1Tb3VyY2UoZGF0YSwgdHlwZSwgcm93LCBtZXRhKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbVNvdXJjZSA9PT0gJ3N0cmluZycgJiYgKG1Tb3VyY2UuaW5kZXhPZignLicpICE9PSAtMSB8fCBtU291cmNlLmluZGV4T2YoJ1snKSAhPT0gLTEgfHwgbVNvdXJjZS5pbmRleE9mKCcoJykgIT09IC0xKSkge1xuICAgICAgdmFyIGZldGNoRGF0YSA9IGZ1bmN0aW9uIGZldGNoRGF0YShkYXRhLCB0eXBlLCBzcmMpIHtcbiAgICAgICAgdmFyIGFycmF5Tm90YXRpb24sIGZ1bmNOb3RhdGlvbiwgb3V0LCBpbm5lclNyYztcblxuICAgICAgICBpZiAoc3JjICE9PSBcIlwiKSB7XG4gICAgICAgICAgdmFyIGEgPSBfZm5TcGxpdE9iak5vdGF0aW9uKHNyYyk7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGEubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgICAgICBhcnJheU5vdGF0aW9uID0gYVtpXS5tYXRjaChfX3JlQXJyYXkpO1xuICAgICAgICAgICAgZnVuY05vdGF0aW9uID0gYVtpXS5tYXRjaChfX3JlRm4pO1xuXG4gICAgICAgICAgICBpZiAoYXJyYXlOb3RhdGlvbikge1xuICAgICAgICAgICAgICBhW2ldID0gYVtpXS5yZXBsYWNlKF9fcmVBcnJheSwgJycpO1xuXG4gICAgICAgICAgICAgIGlmIChhW2ldICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGFbYVtpXV07XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBvdXQgPSBbXTtcbiAgICAgICAgICAgICAgYS5zcGxpY2UoMCwgaSArIDEpO1xuICAgICAgICAgICAgICBpbm5lclNyYyA9IGEuam9pbignLicpO1xuXG4gICAgICAgICAgICAgIGlmICgkLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgakxlbiA9IGRhdGEubGVuZ3RoOyBqIDwgakxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICBvdXQucHVzaChmZXRjaERhdGEoZGF0YVtqXSwgdHlwZSwgaW5uZXJTcmMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgam9pbiA9IGFycmF5Tm90YXRpb25bMF0uc3Vic3RyaW5nKDEsIGFycmF5Tm90YXRpb25bMF0ubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgIGRhdGEgPSBqb2luID09PSBcIlwiID8gb3V0IDogb3V0LmpvaW4oam9pbik7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmdW5jTm90YXRpb24pIHtcbiAgICAgICAgICAgICAgYVtpXSA9IGFbaV0ucmVwbGFjZShfX3JlRm4sICcnKTtcbiAgICAgICAgICAgICAgZGF0YSA9IGRhdGFbYVtpXV0oKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkYXRhID09PSBudWxsIHx8IGRhdGFbYVtpXV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhID0gZGF0YVthW2ldXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSwgdHlwZSkge1xuICAgICAgICByZXR1cm4gZmV0Y2hEYXRhKGRhdGEsIHR5cGUsIG1Tb3VyY2UpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhLCB0eXBlKSB7XG4gICAgICAgIHJldHVybiBkYXRhW21Tb3VyY2VdO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5TZXRPYmplY3REYXRhRm4obVNvdXJjZSkge1xuICAgIGlmICgkLmlzUGxhaW5PYmplY3QobVNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBfZm5TZXRPYmplY3REYXRhRm4obVNvdXJjZS5fKTtcbiAgICB9IGVsc2UgaWYgKG1Tb3VyY2UgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7fTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtU291cmNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIHZhbCwgbWV0YSkge1xuICAgICAgICBtU291cmNlKGRhdGEsICdzZXQnLCB2YWwsIG1ldGEpO1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtU291cmNlID09PSAnc3RyaW5nJyAmJiAobVNvdXJjZS5pbmRleE9mKCcuJykgIT09IC0xIHx8IG1Tb3VyY2UuaW5kZXhPZignWycpICE9PSAtMSB8fCBtU291cmNlLmluZGV4T2YoJygnKSAhPT0gLTEpKSB7XG4gICAgICB2YXIgc2V0RGF0YSA9IGZ1bmN0aW9uIHNldERhdGEoZGF0YSwgdmFsLCBzcmMpIHtcbiAgICAgICAgdmFyIGEgPSBfZm5TcGxpdE9iak5vdGF0aW9uKHNyYyksXG4gICAgICAgICAgICBiO1xuXG4gICAgICAgIHZhciBhTGFzdCA9IGFbYS5sZW5ndGggLSAxXTtcbiAgICAgICAgdmFyIGFycmF5Tm90YXRpb24sIGZ1bmNOb3RhdGlvbiwgbywgaW5uZXJTcmM7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSBhLmxlbmd0aCAtIDE7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgICBhcnJheU5vdGF0aW9uID0gYVtpXS5tYXRjaChfX3JlQXJyYXkpO1xuICAgICAgICAgIGZ1bmNOb3RhdGlvbiA9IGFbaV0ubWF0Y2goX19yZUZuKTtcblxuICAgICAgICAgIGlmIChhcnJheU5vdGF0aW9uKSB7XG4gICAgICAgICAgICBhW2ldID0gYVtpXS5yZXBsYWNlKF9fcmVBcnJheSwgJycpO1xuICAgICAgICAgICAgZGF0YVthW2ldXSA9IFtdO1xuICAgICAgICAgICAgYiA9IGEuc2xpY2UoKTtcbiAgICAgICAgICAgIGIuc3BsaWNlKDAsIGkgKyAxKTtcbiAgICAgICAgICAgIGlubmVyU3JjID0gYi5qb2luKCcuJyk7XG5cbiAgICAgICAgICAgIGlmICgkLmlzQXJyYXkodmFsKSkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgakxlbiA9IHZhbC5sZW5ndGg7IGogPCBqTGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBvID0ge307XG4gICAgICAgICAgICAgICAgc2V0RGF0YShvLCB2YWxbal0sIGlubmVyU3JjKTtcbiAgICAgICAgICAgICAgICBkYXRhW2FbaV1dLnB1c2gobyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGRhdGFbYVtpXV0gPSB2YWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGZ1bmNOb3RhdGlvbikge1xuICAgICAgICAgICAgYVtpXSA9IGFbaV0ucmVwbGFjZShfX3JlRm4sICcnKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhW2FbaV1dKHZhbCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGRhdGFbYVtpXV0gPT09IG51bGwgfHwgZGF0YVthW2ldXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkYXRhW2FbaV1dID0ge307XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGF0YSA9IGRhdGFbYVtpXV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYUxhc3QubWF0Y2goX19yZUZuKSkge1xuICAgICAgICAgIGRhdGEgPSBkYXRhW2FMYXN0LnJlcGxhY2UoX19yZUZuLCAnJyldKHZhbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YVthTGFzdC5yZXBsYWNlKF9fcmVBcnJheSwgJycpXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhLCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIHNldERhdGEoZGF0YSwgdmFsLCBtU291cmNlKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSwgdmFsKSB7XG4gICAgICAgIGRhdGFbbVNvdXJjZV0gPSB2YWw7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkdldERhdGFNYXN0ZXIoc2V0dGluZ3MpIHtcbiAgICByZXR1cm4gX3BsdWNrKHNldHRpbmdzLmFvRGF0YSwgJ19hRGF0YScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQ2xlYXJUYWJsZShzZXR0aW5ncykge1xuICAgIHNldHRpbmdzLmFvRGF0YS5sZW5ndGggPSAwO1xuICAgIHNldHRpbmdzLmFpRGlzcGxheU1hc3Rlci5sZW5ndGggPSAwO1xuICAgIHNldHRpbmdzLmFpRGlzcGxheS5sZW5ndGggPSAwO1xuICAgIHNldHRpbmdzLmFJZHMgPSB7fTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkRlbGV0ZUluZGV4KGEsIGlUYXJnZXQsIHNwbGljZSkge1xuICAgIHZhciBpVGFyZ2V0SW5kZXggPSAtMTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gYS5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIGlmIChhW2ldID09IGlUYXJnZXQpIHtcbiAgICAgICAgaVRhcmdldEluZGV4ID0gaTtcbiAgICAgIH0gZWxzZSBpZiAoYVtpXSA+IGlUYXJnZXQpIHtcbiAgICAgICAgYVtpXS0tO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpVGFyZ2V0SW5kZXggIT0gLTEgJiYgc3BsaWNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGEuc3BsaWNlKGlUYXJnZXRJbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuSW52YWxpZGF0ZShzZXR0aW5ncywgcm93SWR4LCBzcmMsIGNvbElkeCkge1xuICAgIHZhciByb3cgPSBzZXR0aW5ncy5hb0RhdGFbcm93SWR4XTtcbiAgICB2YXIgaSwgaWVuO1xuXG4gICAgdmFyIGNlbGxXcml0ZSA9IGZ1bmN0aW9uIGNlbGxXcml0ZShjZWxsLCBjb2wpIHtcbiAgICAgIHdoaWxlIChjZWxsLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIGNlbGwucmVtb3ZlQ2hpbGQoY2VsbC5maXJzdENoaWxkKTtcbiAgICAgIH1cblxuICAgICAgY2VsbC5pbm5lckhUTUwgPSBfZm5HZXRDZWxsRGF0YShzZXR0aW5ncywgcm93SWR4LCBjb2wsICdkaXNwbGF5Jyk7XG4gICAgfTtcblxuICAgIGlmIChzcmMgPT09ICdkb20nIHx8ICghc3JjIHx8IHNyYyA9PT0gJ2F1dG8nKSAmJiByb3cuc3JjID09PSAnZG9tJykge1xuICAgICAgcm93Ll9hRGF0YSA9IF9mbkdldFJvd0VsZW1lbnRzKHNldHRpbmdzLCByb3csIGNvbElkeCwgY29sSWR4ID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiByb3cuX2FEYXRhKS5kYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgY2VsbHMgPSByb3cuYW5DZWxscztcblxuICAgICAgaWYgKGNlbGxzKSB7XG4gICAgICAgIGlmIChjb2xJZHggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNlbGxXcml0ZShjZWxsc1tjb2xJZHhdLCBjb2xJZHgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAoaSA9IDAsIGllbiA9IGNlbGxzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgICBjZWxsV3JpdGUoY2VsbHNbaV0sIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJvdy5fYVNvcnREYXRhID0gbnVsbDtcbiAgICByb3cuX2FGaWx0ZXJEYXRhID0gbnVsbDtcbiAgICB2YXIgY29scyA9IHNldHRpbmdzLmFvQ29sdW1ucztcblxuICAgIGlmIChjb2xJZHggIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29sc1tjb2xJZHhdLnNUeXBlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChpID0gMCwgaWVuID0gY29scy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBjb2xzW2ldLnNUeXBlID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgX2ZuUm93QXR0cmlidXRlcyhzZXR0aW5ncywgcm93KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5HZXRSb3dFbGVtZW50cyhzZXR0aW5ncywgcm93LCBjb2xJZHgsIGQpIHtcbiAgICB2YXIgdGRzID0gW10sXG4gICAgICAgIHRkID0gcm93LmZpcnN0Q2hpbGQsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIGNvbCxcbiAgICAgICAgbyxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIGNvbnRlbnRzLFxuICAgICAgICBjb2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zLFxuICAgICAgICBvYmplY3RSZWFkID0gc2V0dGluZ3MuX3Jvd1JlYWRPYmplY3Q7XG4gICAgZCA9IGQgIT09IHVuZGVmaW5lZCA/IGQgOiBvYmplY3RSZWFkID8ge30gOiBbXTtcblxuICAgIHZhciBhdHRyID0gZnVuY3Rpb24gYXR0cihzdHIsIHRkKSB7XG4gICAgICBpZiAodHlwZW9mIHN0ciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIGlkeCA9IHN0ci5pbmRleE9mKCdAJyk7XG5cbiAgICAgICAgaWYgKGlkeCAhPT0gLTEpIHtcbiAgICAgICAgICB2YXIgYXR0ciA9IHN0ci5zdWJzdHJpbmcoaWR4ICsgMSk7XG5cbiAgICAgICAgICB2YXIgc2V0dGVyID0gX2ZuU2V0T2JqZWN0RGF0YUZuKHN0cik7XG5cbiAgICAgICAgICBzZXR0ZXIoZCwgdGQuZ2V0QXR0cmlidXRlKGF0dHIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgY2VsbFByb2Nlc3MgPSBmdW5jdGlvbiBjZWxsUHJvY2VzcyhjZWxsKSB7XG4gICAgICBpZiAoY29sSWR4ID09PSB1bmRlZmluZWQgfHwgY29sSWR4ID09PSBpKSB7XG4gICAgICAgIGNvbCA9IGNvbHVtbnNbaV07XG4gICAgICAgIGNvbnRlbnRzID0gJC50cmltKGNlbGwuaW5uZXJIVE1MKTtcblxuICAgICAgICBpZiAoY29sICYmIGNvbC5fYkF0dHJTcmMpIHtcbiAgICAgICAgICB2YXIgc2V0dGVyID0gX2ZuU2V0T2JqZWN0RGF0YUZuKGNvbC5tRGF0YS5fKTtcblxuICAgICAgICAgIHNldHRlcihkLCBjb250ZW50cyk7XG4gICAgICAgICAgYXR0cihjb2wubURhdGEuc29ydCwgY2VsbCk7XG4gICAgICAgICAgYXR0cihjb2wubURhdGEudHlwZSwgY2VsbCk7XG4gICAgICAgICAgYXR0cihjb2wubURhdGEuZmlsdGVyLCBjZWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob2JqZWN0UmVhZCkge1xuICAgICAgICAgICAgaWYgKCFjb2wuX3NldHRlcikge1xuICAgICAgICAgICAgICBjb2wuX3NldHRlciA9IF9mblNldE9iamVjdERhdGFGbihjb2wubURhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb2wuX3NldHRlcihkLCBjb250ZW50cyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRbaV0gPSBjb250ZW50cztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaSsrO1xuICAgIH07XG5cbiAgICBpZiAodGQpIHtcbiAgICAgIHdoaWxlICh0ZCkge1xuICAgICAgICBuYW1lID0gdGQubm9kZU5hbWUudG9VcHBlckNhc2UoKTtcblxuICAgICAgICBpZiAobmFtZSA9PSBcIlREXCIgfHwgbmFtZSA9PSBcIlRIXCIpIHtcbiAgICAgICAgICBjZWxsUHJvY2Vzcyh0ZCk7XG4gICAgICAgICAgdGRzLnB1c2godGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGQgPSB0ZC5uZXh0U2libGluZztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGRzID0gcm93LmFuQ2VsbHM7XG5cbiAgICAgIGZvciAodmFyIGogPSAwLCBqZW4gPSB0ZHMubGVuZ3RoOyBqIDwgamVuOyBqKyspIHtcbiAgICAgICAgY2VsbFByb2Nlc3ModGRzW2pdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcm93Tm9kZSA9IHJvdy5maXJzdENoaWxkID8gcm93IDogcm93Lm5UcjtcblxuICAgIGlmIChyb3dOb2RlKSB7XG4gICAgICB2YXIgaWQgPSByb3dOb2RlLmdldEF0dHJpYnV0ZSgnaWQnKTtcblxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIF9mblNldE9iamVjdERhdGFGbihzZXR0aW5ncy5yb3dJZCkoZCwgaWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBkLFxuICAgICAgY2VsbHM6IHRkc1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBfZm5DcmVhdGVUcihvU2V0dGluZ3MsIGlSb3csIG5UckluLCBhblRkcykge1xuICAgIHZhciByb3cgPSBvU2V0dGluZ3MuYW9EYXRhW2lSb3ddLFxuICAgICAgICByb3dEYXRhID0gcm93Ll9hRGF0YSxcbiAgICAgICAgY2VsbHMgPSBbXSxcbiAgICAgICAgblRyLFxuICAgICAgICBuVGQsXG4gICAgICAgIG9Db2wsXG4gICAgICAgIGksXG4gICAgICAgIGlMZW47XG5cbiAgICBpZiAocm93Lm5UciA9PT0gbnVsbCkge1xuICAgICAgblRyID0gblRySW4gfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcbiAgICAgIHJvdy5uVHIgPSBuVHI7XG4gICAgICByb3cuYW5DZWxscyA9IGNlbGxzO1xuICAgICAgblRyLl9EVF9Sb3dJbmRleCA9IGlSb3c7XG5cbiAgICAgIF9mblJvd0F0dHJpYnV0ZXMob1NldHRpbmdzLCByb3cpO1xuXG4gICAgICBmb3IgKGkgPSAwLCBpTGVuID0gb1NldHRpbmdzLmFvQ29sdW1ucy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgb0NvbCA9IG9TZXR0aW5ncy5hb0NvbHVtbnNbaV07XG4gICAgICAgIG5UZCA9IG5UckluID8gYW5UZHNbaV0gOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG9Db2wuc0NlbGxUeXBlKTtcbiAgICAgICAgblRkLl9EVF9DZWxsSW5kZXggPSB7XG4gICAgICAgICAgcm93OiBpUm93LFxuICAgICAgICAgIGNvbHVtbjogaVxuICAgICAgICB9O1xuICAgICAgICBjZWxscy5wdXNoKG5UZCk7XG5cbiAgICAgICAgaWYgKCghblRySW4gfHwgb0NvbC5tUmVuZGVyIHx8IG9Db2wubURhdGEgIT09IGkpICYmICghJC5pc1BsYWluT2JqZWN0KG9Db2wubURhdGEpIHx8IG9Db2wubURhdGEuXyAhPT0gaSArICcuZGlzcGxheScpKSB7XG4gICAgICAgICAgblRkLmlubmVySFRNTCA9IF9mbkdldENlbGxEYXRhKG9TZXR0aW5ncywgaVJvdywgaSwgJ2Rpc3BsYXknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvQ29sLnNDbGFzcykge1xuICAgICAgICAgIG5UZC5jbGFzc05hbWUgKz0gJyAnICsgb0NvbC5zQ2xhc3M7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob0NvbC5iVmlzaWJsZSAmJiAhblRySW4pIHtcbiAgICAgICAgICBuVHIuYXBwZW5kQ2hpbGQoblRkKTtcbiAgICAgICAgfSBlbHNlIGlmICghb0NvbC5iVmlzaWJsZSAmJiBuVHJJbikge1xuICAgICAgICAgIG5UZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5UZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob0NvbC5mbkNyZWF0ZWRDZWxsKSB7XG4gICAgICAgICAgb0NvbC5mbkNyZWF0ZWRDZWxsLmNhbGwob1NldHRpbmdzLm9JbnN0YW5jZSwgblRkLCBfZm5HZXRDZWxsRGF0YShvU2V0dGluZ3MsIGlSb3csIGkpLCByb3dEYXRhLCBpUm93LCBpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCAnYW9Sb3dDcmVhdGVkQ2FsbGJhY2snLCBudWxsLCBbblRyLCByb3dEYXRhLCBpUm93LCBjZWxsc10pO1xuICAgIH1cblxuICAgIHJvdy5uVHIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3JvdycpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuUm93QXR0cmlidXRlcyhzZXR0aW5ncywgcm93KSB7XG4gICAgdmFyIHRyID0gcm93Lm5UcjtcbiAgICB2YXIgZGF0YSA9IHJvdy5fYURhdGE7XG5cbiAgICBpZiAodHIpIHtcbiAgICAgIHZhciBpZCA9IHNldHRpbmdzLnJvd0lkRm4oZGF0YSk7XG5cbiAgICAgIGlmIChpZCkge1xuICAgICAgICB0ci5pZCA9IGlkO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YS5EVF9Sb3dDbGFzcykge1xuICAgICAgICB2YXIgYSA9IGRhdGEuRFRfUm93Q2xhc3Muc3BsaXQoJyAnKTtcbiAgICAgICAgcm93Ll9fcm93YyA9IHJvdy5fX3Jvd2MgPyBfdW5pcXVlKHJvdy5fX3Jvd2MuY29uY2F0KGEpKSA6IGE7XG4gICAgICAgICQodHIpLnJlbW92ZUNsYXNzKHJvdy5fX3Jvd2Muam9pbignICcpKS5hZGRDbGFzcyhkYXRhLkRUX1Jvd0NsYXNzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEuRFRfUm93QXR0cikge1xuICAgICAgICAkKHRyKS5hdHRyKGRhdGEuRFRfUm93QXR0cik7XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhLkRUX1Jvd0RhdGEpIHtcbiAgICAgICAgJCh0cikuZGF0YShkYXRhLkRUX1Jvd0RhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkJ1aWxkSGVhZChvU2V0dGluZ3MpIHtcbiAgICB2YXIgaSwgaWVuLCBjZWxsLCByb3csIGNvbHVtbjtcbiAgICB2YXIgdGhlYWQgPSBvU2V0dGluZ3MublRIZWFkO1xuICAgIHZhciB0Zm9vdCA9IG9TZXR0aW5ncy5uVEZvb3Q7XG4gICAgdmFyIGNyZWF0ZUhlYWRlciA9ICQoJ3RoLCB0ZCcsIHRoZWFkKS5sZW5ndGggPT09IDA7XG4gICAgdmFyIGNsYXNzZXMgPSBvU2V0dGluZ3Mub0NsYXNzZXM7XG4gICAgdmFyIGNvbHVtbnMgPSBvU2V0dGluZ3MuYW9Db2x1bW5zO1xuXG4gICAgaWYgKGNyZWF0ZUhlYWRlcikge1xuICAgICAgcm93ID0gJCgnPHRyLz4nKS5hcHBlbmRUbyh0aGVhZCk7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMCwgaWVuID0gY29sdW1ucy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgY29sdW1uID0gY29sdW1uc1tpXTtcbiAgICAgIGNlbGwgPSAkKGNvbHVtbi5uVGgpLmFkZENsYXNzKGNvbHVtbi5zQ2xhc3MpO1xuXG4gICAgICBpZiAoY3JlYXRlSGVhZGVyKSB7XG4gICAgICAgIGNlbGwuYXBwZW5kVG8ocm93KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9TZXR0aW5ncy5vRmVhdHVyZXMuYlNvcnQpIHtcbiAgICAgICAgY2VsbC5hZGRDbGFzcyhjb2x1bW4uc1NvcnRpbmdDbGFzcyk7XG5cbiAgICAgICAgaWYgKGNvbHVtbi5iU29ydGFibGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgY2VsbC5hdHRyKCd0YWJpbmRleCcsIG9TZXR0aW5ncy5pVGFiSW5kZXgpLmF0dHIoJ2FyaWEtY29udHJvbHMnLCBvU2V0dGluZ3Muc1RhYmxlSWQpO1xuXG4gICAgICAgICAgX2ZuU29ydEF0dGFjaExpc3RlbmVyKG9TZXR0aW5ncywgY29sdW1uLm5UaCwgaSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNvbHVtbi5zVGl0bGUgIT0gY2VsbFswXS5pbm5lckhUTUwpIHtcbiAgICAgICAgY2VsbC5odG1sKGNvbHVtbi5zVGl0bGUpO1xuICAgICAgfVxuXG4gICAgICBfZm5SZW5kZXJlcihvU2V0dGluZ3MsICdoZWFkZXInKShvU2V0dGluZ3MsIGNlbGwsIGNvbHVtbiwgY2xhc3Nlcyk7XG4gICAgfVxuXG4gICAgaWYgKGNyZWF0ZUhlYWRlcikge1xuICAgICAgX2ZuRGV0ZWN0SGVhZGVyKG9TZXR0aW5ncy5hb0hlYWRlciwgdGhlYWQpO1xuICAgIH1cblxuICAgICQodGhlYWQpLmZpbmQoJz50cicpLmF0dHIoJ3JvbGUnLCAncm93Jyk7XG4gICAgJCh0aGVhZCkuZmluZCgnPnRyPnRoLCA+dHI+dGQnKS5hZGRDbGFzcyhjbGFzc2VzLnNIZWFkZXJUSCk7XG4gICAgJCh0Zm9vdCkuZmluZCgnPnRyPnRoLCA+dHI+dGQnKS5hZGRDbGFzcyhjbGFzc2VzLnNGb290ZXJUSCk7XG5cbiAgICBpZiAodGZvb3QgIT09IG51bGwpIHtcbiAgICAgIHZhciBjZWxscyA9IG9TZXR0aW5ncy5hb0Zvb3RlclswXTtcblxuICAgICAgZm9yIChpID0gMCwgaWVuID0gY2VsbHMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgY29sdW1uID0gY29sdW1uc1tpXTtcbiAgICAgICAgY29sdW1uLm5UZiA9IGNlbGxzW2ldLmNlbGw7XG5cbiAgICAgICAgaWYgKGNvbHVtbi5zQ2xhc3MpIHtcbiAgICAgICAgICAkKGNvbHVtbi5uVGYpLmFkZENsYXNzKGNvbHVtbi5zQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRHJhd0hlYWQob1NldHRpbmdzLCBhb1NvdXJjZSwgYkluY2x1ZGVIaWRkZW4pIHtcbiAgICB2YXIgaSwgaUxlbiwgaiwgakxlbiwgaywga0xlbiwgbiwgbkxvY2FsVHI7XG4gICAgdmFyIGFvTG9jYWwgPSBbXTtcbiAgICB2YXIgYUFwcGxpZWQgPSBbXTtcbiAgICB2YXIgaUNvbHVtbnMgPSBvU2V0dGluZ3MuYW9Db2x1bW5zLmxlbmd0aDtcbiAgICB2YXIgaVJvd3NwYW4sIGlDb2xzcGFuO1xuXG4gICAgaWYgKCFhb1NvdXJjZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChiSW5jbHVkZUhpZGRlbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBiSW5jbHVkZUhpZGRlbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhb1NvdXJjZS5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIGFvTG9jYWxbaV0gPSBhb1NvdXJjZVtpXS5zbGljZSgpO1xuICAgICAgYW9Mb2NhbFtpXS5uVHIgPSBhb1NvdXJjZVtpXS5uVHI7XG5cbiAgICAgIGZvciAoaiA9IGlDb2x1bW5zIC0gMTsgaiA+PSAwOyBqLS0pIHtcbiAgICAgICAgaWYgKCFvU2V0dGluZ3MuYW9Db2x1bW5zW2pdLmJWaXNpYmxlICYmICFiSW5jbHVkZUhpZGRlbikge1xuICAgICAgICAgIGFvTG9jYWxbaV0uc3BsaWNlKGosIDEpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGFBcHBsaWVkLnB1c2goW10pO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhb0xvY2FsLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgbkxvY2FsVHIgPSBhb0xvY2FsW2ldLm5UcjtcblxuICAgICAgaWYgKG5Mb2NhbFRyKSB7XG4gICAgICAgIHdoaWxlIChuID0gbkxvY2FsVHIuZmlyc3RDaGlsZCkge1xuICAgICAgICAgIG5Mb2NhbFRyLnJlbW92ZUNoaWxkKG4pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAoaiA9IDAsIGpMZW4gPSBhb0xvY2FsW2ldLmxlbmd0aDsgaiA8IGpMZW47IGorKykge1xuICAgICAgICBpUm93c3BhbiA9IDE7XG4gICAgICAgIGlDb2xzcGFuID0gMTtcblxuICAgICAgICBpZiAoYUFwcGxpZWRbaV1bal0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG5Mb2NhbFRyLmFwcGVuZENoaWxkKGFvTG9jYWxbaV1bal0uY2VsbCk7XG4gICAgICAgICAgYUFwcGxpZWRbaV1bal0gPSAxO1xuXG4gICAgICAgICAgd2hpbGUgKGFvTG9jYWxbaSArIGlSb3dzcGFuXSAhPT0gdW5kZWZpbmVkICYmIGFvTG9jYWxbaV1bal0uY2VsbCA9PSBhb0xvY2FsW2kgKyBpUm93c3Bhbl1bal0uY2VsbCkge1xuICAgICAgICAgICAgYUFwcGxpZWRbaSArIGlSb3dzcGFuXVtqXSA9IDE7XG4gICAgICAgICAgICBpUm93c3BhbisrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHdoaWxlIChhb0xvY2FsW2ldW2ogKyBpQ29sc3Bhbl0gIT09IHVuZGVmaW5lZCAmJiBhb0xvY2FsW2ldW2pdLmNlbGwgPT0gYW9Mb2NhbFtpXVtqICsgaUNvbHNwYW5dLmNlbGwpIHtcbiAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBpUm93c3BhbjsgaysrKSB7XG4gICAgICAgICAgICAgIGFBcHBsaWVkW2kgKyBrXVtqICsgaUNvbHNwYW5dID0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaUNvbHNwYW4rKztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkKGFvTG9jYWxbaV1bal0uY2VsbCkuYXR0cigncm93c3BhbicsIGlSb3dzcGFuKS5hdHRyKCdjb2xzcGFuJywgaUNvbHNwYW4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRHJhdyhvU2V0dGluZ3MpIHtcbiAgICB2YXIgYVByZURyYXcgPSBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCAnYW9QcmVEcmF3Q2FsbGJhY2snLCAncHJlRHJhdycsIFtvU2V0dGluZ3NdKTtcblxuICAgIGlmICgkLmluQXJyYXkoZmFsc2UsIGFQcmVEcmF3KSAhPT0gLTEpIHtcbiAgICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KG9TZXR0aW5ncywgZmFsc2UpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGksIGlMZW4sIG47XG4gICAgdmFyIGFuUm93cyA9IFtdO1xuICAgIHZhciBpUm93Q291bnQgPSAwO1xuICAgIHZhciBhc1N0cmlwZUNsYXNzZXMgPSBvU2V0dGluZ3MuYXNTdHJpcGVDbGFzc2VzO1xuICAgIHZhciBpU3RyaXBlcyA9IGFzU3RyaXBlQ2xhc3Nlcy5sZW5ndGg7XG4gICAgdmFyIGlPcGVuUm93cyA9IG9TZXR0aW5ncy5hb09wZW5Sb3dzLmxlbmd0aDtcbiAgICB2YXIgb0xhbmcgPSBvU2V0dGluZ3Mub0xhbmd1YWdlO1xuICAgIHZhciBpSW5pdERpc3BsYXlTdGFydCA9IG9TZXR0aW5ncy5pSW5pdERpc3BsYXlTdGFydDtcbiAgICB2YXIgYlNlcnZlclNpZGUgPSBfZm5EYXRhU291cmNlKG9TZXR0aW5ncykgPT0gJ3NzcCc7XG4gICAgdmFyIGFpRGlzcGxheSA9IG9TZXR0aW5ncy5haURpc3BsYXk7XG4gICAgb1NldHRpbmdzLmJEcmF3aW5nID0gdHJ1ZTtcblxuICAgIGlmIChpSW5pdERpc3BsYXlTdGFydCAhPT0gdW5kZWZpbmVkICYmIGlJbml0RGlzcGxheVN0YXJ0ICE9PSAtMSkge1xuICAgICAgb1NldHRpbmdzLl9pRGlzcGxheVN0YXJ0ID0gYlNlcnZlclNpZGUgPyBpSW5pdERpc3BsYXlTdGFydCA6IGlJbml0RGlzcGxheVN0YXJ0ID49IG9TZXR0aW5ncy5mblJlY29yZHNEaXNwbGF5KCkgPyAwIDogaUluaXREaXNwbGF5U3RhcnQ7XG4gICAgICBvU2V0dGluZ3MuaUluaXREaXNwbGF5U3RhcnQgPSAtMTtcbiAgICB9XG5cbiAgICB2YXIgaURpc3BsYXlTdGFydCA9IG9TZXR0aW5ncy5faURpc3BsYXlTdGFydDtcbiAgICB2YXIgaURpc3BsYXlFbmQgPSBvU2V0dGluZ3MuZm5EaXNwbGF5RW5kKCk7XG5cbiAgICBpZiAob1NldHRpbmdzLmJEZWZlckxvYWRpbmcpIHtcbiAgICAgIG9TZXR0aW5ncy5iRGVmZXJMb2FkaW5nID0gZmFsc2U7XG4gICAgICBvU2V0dGluZ3MuaURyYXcrKztcblxuICAgICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkob1NldHRpbmdzLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmICghYlNlcnZlclNpZGUpIHtcbiAgICAgIG9TZXR0aW5ncy5pRHJhdysrO1xuICAgIH0gZWxzZSBpZiAoIW9TZXR0aW5ncy5iRGVzdHJveWluZyAmJiAhX2ZuQWpheFVwZGF0ZShvU2V0dGluZ3MpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGFpRGlzcGxheS5sZW5ndGggIT09IDApIHtcbiAgICAgIHZhciBpU3RhcnQgPSBiU2VydmVyU2lkZSA/IDAgOiBpRGlzcGxheVN0YXJ0O1xuICAgICAgdmFyIGlFbmQgPSBiU2VydmVyU2lkZSA/IG9TZXR0aW5ncy5hb0RhdGEubGVuZ3RoIDogaURpc3BsYXlFbmQ7XG5cbiAgICAgIGZvciAodmFyIGogPSBpU3RhcnQ7IGogPCBpRW5kOyBqKyspIHtcbiAgICAgICAgdmFyIGlEYXRhSW5kZXggPSBhaURpc3BsYXlbal07XG4gICAgICAgIHZhciBhb0RhdGEgPSBvU2V0dGluZ3MuYW9EYXRhW2lEYXRhSW5kZXhdO1xuXG4gICAgICAgIGlmIChhb0RhdGEublRyID09PSBudWxsKSB7XG4gICAgICAgICAgX2ZuQ3JlYXRlVHIob1NldHRpbmdzLCBpRGF0YUluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuUm93ID0gYW9EYXRhLm5UcjtcblxuICAgICAgICBpZiAoaVN0cmlwZXMgIT09IDApIHtcbiAgICAgICAgICB2YXIgc1N0cmlwZSA9IGFzU3RyaXBlQ2xhc3Nlc1tpUm93Q291bnQgJSBpU3RyaXBlc107XG5cbiAgICAgICAgICBpZiAoYW9EYXRhLl9zUm93U3RyaXBlICE9IHNTdHJpcGUpIHtcbiAgICAgICAgICAgICQoblJvdykucmVtb3ZlQ2xhc3MoYW9EYXRhLl9zUm93U3RyaXBlKS5hZGRDbGFzcyhzU3RyaXBlKTtcbiAgICAgICAgICAgIGFvRGF0YS5fc1Jvd1N0cmlwZSA9IHNTdHJpcGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgJ2FvUm93Q2FsbGJhY2snLCBudWxsLCBbblJvdywgYW9EYXRhLl9hRGF0YSwgaVJvd0NvdW50LCBqLCBpRGF0YUluZGV4XSk7XG5cbiAgICAgICAgYW5Sb3dzLnB1c2goblJvdyk7XG4gICAgICAgIGlSb3dDb3VudCsrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc1plcm8gPSBvTGFuZy5zWmVyb1JlY29yZHM7XG5cbiAgICAgIGlmIChvU2V0dGluZ3MuaURyYXcgPT0gMSAmJiBfZm5EYXRhU291cmNlKG9TZXR0aW5ncykgPT0gJ2FqYXgnKSB7XG4gICAgICAgIHNaZXJvID0gb0xhbmcuc0xvYWRpbmdSZWNvcmRzO1xuICAgICAgfSBlbHNlIGlmIChvTGFuZy5zRW1wdHlUYWJsZSAmJiBvU2V0dGluZ3MuZm5SZWNvcmRzVG90YWwoKSA9PT0gMCkge1xuICAgICAgICBzWmVybyA9IG9MYW5nLnNFbXB0eVRhYmxlO1xuICAgICAgfVxuXG4gICAgICBhblJvd3NbMF0gPSAkKCc8dHIvPicsIHtcbiAgICAgICAgJ2NsYXNzJzogaVN0cmlwZXMgPyBhc1N0cmlwZUNsYXNzZXNbMF0gOiAnJ1xuICAgICAgfSkuYXBwZW5kKCQoJzx0ZCAvPicsIHtcbiAgICAgICAgJ3ZhbGlnbic6ICd0b3AnLFxuICAgICAgICAnY29sU3Bhbic6IF9mblZpc2JsZUNvbHVtbnMob1NldHRpbmdzKSxcbiAgICAgICAgJ2NsYXNzJzogb1NldHRpbmdzLm9DbGFzc2VzLnNSb3dFbXB0eVxuICAgICAgfSkuaHRtbChzWmVybykpWzBdO1xuICAgIH1cblxuICAgIF9mbkNhbGxiYWNrRmlyZShvU2V0dGluZ3MsICdhb0hlYWRlckNhbGxiYWNrJywgJ2hlYWRlcicsIFskKG9TZXR0aW5ncy5uVEhlYWQpLmNoaWxkcmVuKCd0cicpWzBdLCBfZm5HZXREYXRhTWFzdGVyKG9TZXR0aW5ncyksIGlEaXNwbGF5U3RhcnQsIGlEaXNwbGF5RW5kLCBhaURpc3BsYXldKTtcblxuICAgIF9mbkNhbGxiYWNrRmlyZShvU2V0dGluZ3MsICdhb0Zvb3RlckNhbGxiYWNrJywgJ2Zvb3RlcicsIFskKG9TZXR0aW5ncy5uVEZvb3QpLmNoaWxkcmVuKCd0cicpWzBdLCBfZm5HZXREYXRhTWFzdGVyKG9TZXR0aW5ncyksIGlEaXNwbGF5U3RhcnQsIGlEaXNwbGF5RW5kLCBhaURpc3BsYXldKTtcblxuICAgIHZhciBib2R5ID0gJChvU2V0dGluZ3MublRCb2R5KTtcbiAgICBib2R5LmNoaWxkcmVuKCkuZGV0YWNoKCk7XG4gICAgYm9keS5hcHBlbmQoJChhblJvd3MpKTtcblxuICAgIF9mbkNhbGxiYWNrRmlyZShvU2V0dGluZ3MsICdhb0RyYXdDYWxsYmFjaycsICdkcmF3JywgW29TZXR0aW5nc10pO1xuXG4gICAgb1NldHRpbmdzLmJTb3J0ZWQgPSBmYWxzZTtcbiAgICBvU2V0dGluZ3MuYkZpbHRlcmVkID0gZmFsc2U7XG4gICAgb1NldHRpbmdzLmJEcmF3aW5nID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5SZURyYXcoc2V0dGluZ3MsIGhvbGRQb3NpdGlvbikge1xuICAgIHZhciBmZWF0dXJlcyA9IHNldHRpbmdzLm9GZWF0dXJlcyxcbiAgICAgICAgc29ydCA9IGZlYXR1cmVzLmJTb3J0LFxuICAgICAgICBmaWx0ZXIgPSBmZWF0dXJlcy5iRmlsdGVyO1xuXG4gICAgaWYgKHNvcnQpIHtcbiAgICAgIF9mblNvcnQoc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgIF9mbkZpbHRlckNvbXBsZXRlKHNldHRpbmdzLCBzZXR0aW5ncy5vUHJldmlvdXNTZWFyY2gpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXR0aW5ncy5haURpc3BsYXkgPSBzZXR0aW5ncy5haURpc3BsYXlNYXN0ZXIuc2xpY2UoKTtcbiAgICB9XG5cbiAgICBpZiAoaG9sZFBvc2l0aW9uICE9PSB0cnVlKSB7XG4gICAgICBzZXR0aW5ncy5faURpc3BsYXlTdGFydCA9IDA7XG4gICAgfVxuXG4gICAgc2V0dGluZ3MuX2RyYXdIb2xkID0gaG9sZFBvc2l0aW9uO1xuXG4gICAgX2ZuRHJhdyhzZXR0aW5ncyk7XG5cbiAgICBzZXR0aW5ncy5fZHJhd0hvbGQgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFkZE9wdGlvbnNIdG1sKG9TZXR0aW5ncykge1xuICAgIHZhciBjbGFzc2VzID0gb1NldHRpbmdzLm9DbGFzc2VzO1xuICAgIHZhciB0YWJsZSA9ICQob1NldHRpbmdzLm5UYWJsZSk7XG4gICAgdmFyIGhvbGRpbmcgPSAkKCc8ZGl2Lz4nKS5pbnNlcnRCZWZvcmUodGFibGUpO1xuICAgIHZhciBmZWF0dXJlcyA9IG9TZXR0aW5ncy5vRmVhdHVyZXM7XG4gICAgdmFyIGluc2VydCA9ICQoJzxkaXYvPicsIHtcbiAgICAgIGlkOiBvU2V0dGluZ3Muc1RhYmxlSWQgKyAnX3dyYXBwZXInLFxuICAgICAgJ2NsYXNzJzogY2xhc3Nlcy5zV3JhcHBlciArIChvU2V0dGluZ3MublRGb290ID8gJycgOiAnICcgKyBjbGFzc2VzLnNOb0Zvb3RlcilcbiAgICB9KTtcbiAgICBvU2V0dGluZ3MubkhvbGRpbmcgPSBob2xkaW5nWzBdO1xuICAgIG9TZXR0aW5ncy5uVGFibGVXcmFwcGVyID0gaW5zZXJ0WzBdO1xuICAgIG9TZXR0aW5ncy5uVGFibGVSZWluc2VydEJlZm9yZSA9IG9TZXR0aW5ncy5uVGFibGUubmV4dFNpYmxpbmc7XG4gICAgdmFyIGFEb20gPSBvU2V0dGluZ3Muc0RvbS5zcGxpdCgnJyk7XG4gICAgdmFyIGZlYXR1cmVOb2RlLCBjT3B0aW9uLCBuTmV3Tm9kZSwgY05leHQsIHNBdHRyLCBqO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhRG9tLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmZWF0dXJlTm9kZSA9IG51bGw7XG4gICAgICBjT3B0aW9uID0gYURvbVtpXTtcblxuICAgICAgaWYgKGNPcHRpb24gPT0gJzwnKSB7XG4gICAgICAgIG5OZXdOb2RlID0gJCgnPGRpdi8+JylbMF07XG4gICAgICAgIGNOZXh0ID0gYURvbVtpICsgMV07XG5cbiAgICAgICAgaWYgKGNOZXh0ID09IFwiJ1wiIHx8IGNOZXh0ID09ICdcIicpIHtcbiAgICAgICAgICBzQXR0ciA9IFwiXCI7XG4gICAgICAgICAgaiA9IDI7XG5cbiAgICAgICAgICB3aGlsZSAoYURvbVtpICsgal0gIT0gY05leHQpIHtcbiAgICAgICAgICAgIHNBdHRyICs9IGFEb21baSArIGpdO1xuICAgICAgICAgICAgaisrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzQXR0ciA9PSBcIkhcIikge1xuICAgICAgICAgICAgc0F0dHIgPSBjbGFzc2VzLnNKVUlIZWFkZXI7XG4gICAgICAgICAgfSBlbHNlIGlmIChzQXR0ciA9PSBcIkZcIikge1xuICAgICAgICAgICAgc0F0dHIgPSBjbGFzc2VzLnNKVUlGb290ZXI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNBdHRyLmluZGV4T2YoJy4nKSAhPSAtMSkge1xuICAgICAgICAgICAgdmFyIGFTcGxpdCA9IHNBdHRyLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICBuTmV3Tm9kZS5pZCA9IGFTcGxpdFswXS5zdWJzdHIoMSwgYVNwbGl0WzBdLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgbk5ld05vZGUuY2xhc3NOYW1lID0gYVNwbGl0WzFdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc0F0dHIuY2hhckF0KDApID09IFwiI1wiKSB7XG4gICAgICAgICAgICBuTmV3Tm9kZS5pZCA9IHNBdHRyLnN1YnN0cigxLCBzQXR0ci5sZW5ndGggLSAxKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbk5ld05vZGUuY2xhc3NOYW1lID0gc0F0dHI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaSArPSBqO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5zZXJ0LmFwcGVuZChuTmV3Tm9kZSk7XG4gICAgICAgIGluc2VydCA9ICQobk5ld05vZGUpO1xuICAgICAgfSBlbHNlIGlmIChjT3B0aW9uID09ICc+Jykge1xuICAgICAgICBpbnNlcnQgPSBpbnNlcnQucGFyZW50KCk7XG4gICAgICB9IGVsc2UgaWYgKGNPcHRpb24gPT0gJ2wnICYmIGZlYXR1cmVzLmJQYWdpbmF0ZSAmJiBmZWF0dXJlcy5iTGVuZ3RoQ2hhbmdlKSB7XG4gICAgICAgICAgZmVhdHVyZU5vZGUgPSBfZm5GZWF0dXJlSHRtbExlbmd0aChvU2V0dGluZ3MpO1xuICAgICAgICB9IGVsc2UgaWYgKGNPcHRpb24gPT0gJ2YnICYmIGZlYXR1cmVzLmJGaWx0ZXIpIHtcbiAgICAgICAgICBmZWF0dXJlTm9kZSA9IF9mbkZlYXR1cmVIdG1sRmlsdGVyKG9TZXR0aW5ncyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY09wdGlvbiA9PSAncicgJiYgZmVhdHVyZXMuYlByb2Nlc3NpbmcpIHtcbiAgICAgICAgICBmZWF0dXJlTm9kZSA9IF9mbkZlYXR1cmVIdG1sUHJvY2Vzc2luZyhvU2V0dGluZ3MpO1xuICAgICAgICB9IGVsc2UgaWYgKGNPcHRpb24gPT0gJ3QnKSB7XG4gICAgICAgICAgZmVhdHVyZU5vZGUgPSBfZm5GZWF0dXJlSHRtbFRhYmxlKG9TZXR0aW5ncyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY09wdGlvbiA9PSAnaScgJiYgZmVhdHVyZXMuYkluZm8pIHtcbiAgICAgICAgICBmZWF0dXJlTm9kZSA9IF9mbkZlYXR1cmVIdG1sSW5mbyhvU2V0dGluZ3MpO1xuICAgICAgICB9IGVsc2UgaWYgKGNPcHRpb24gPT0gJ3AnICYmIGZlYXR1cmVzLmJQYWdpbmF0ZSkge1xuICAgICAgICAgIGZlYXR1cmVOb2RlID0gX2ZuRmVhdHVyZUh0bWxQYWdpbmF0ZShvU2V0dGluZ3MpO1xuICAgICAgICB9IGVsc2UgaWYgKERhdGFUYWJsZS5leHQuZmVhdHVyZS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICB2YXIgYW9GZWF0dXJlcyA9IERhdGFUYWJsZS5leHQuZmVhdHVyZTtcblxuICAgICAgICAgIGZvciAodmFyIGsgPSAwLCBrTGVuID0gYW9GZWF0dXJlcy5sZW5ndGg7IGsgPCBrTGVuOyBrKyspIHtcbiAgICAgICAgICAgIGlmIChjT3B0aW9uID09IGFvRmVhdHVyZXNba10uY0ZlYXR1cmUpIHtcbiAgICAgICAgICAgICAgZmVhdHVyZU5vZGUgPSBhb0ZlYXR1cmVzW2tdLmZuSW5pdChvU2V0dGluZ3MpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgaWYgKGZlYXR1cmVOb2RlKSB7XG4gICAgICAgIHZhciBhYW5GZWF0dXJlcyA9IG9TZXR0aW5ncy5hYW5GZWF0dXJlcztcblxuICAgICAgICBpZiAoIWFhbkZlYXR1cmVzW2NPcHRpb25dKSB7XG4gICAgICAgICAgYWFuRmVhdHVyZXNbY09wdGlvbl0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFhbkZlYXR1cmVzW2NPcHRpb25dLnB1c2goZmVhdHVyZU5vZGUpO1xuICAgICAgICBpbnNlcnQuYXBwZW5kKGZlYXR1cmVOb2RlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBob2xkaW5nLnJlcGxhY2VXaXRoKGluc2VydCk7XG4gICAgb1NldHRpbmdzLm5Ib2xkaW5nID0gbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkRldGVjdEhlYWRlcihhTGF5b3V0LCBuVGhlYWQpIHtcbiAgICB2YXIgblRycyA9ICQoblRoZWFkKS5jaGlsZHJlbigndHInKTtcbiAgICB2YXIgblRyLCBuQ2VsbDtcbiAgICB2YXIgaSwgaywgbCwgaUxlbiwgakxlbiwgaUNvbFNoaWZ0ZWQsIGlDb2x1bW4sIGlDb2xzcGFuLCBpUm93c3BhbjtcbiAgICB2YXIgYlVuaXF1ZTtcblxuICAgIHZhciBmblNoaWZ0Q29sID0gZnVuY3Rpb24gZm5TaGlmdENvbChhLCBpLCBqKSB7XG4gICAgICB2YXIgayA9IGFbaV07XG5cbiAgICAgIHdoaWxlIChrW2pdKSB7XG4gICAgICAgIGorKztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGo7XG4gICAgfTtcblxuICAgIGFMYXlvdXQuc3BsaWNlKDAsIGFMYXlvdXQubGVuZ3RoKTtcblxuICAgIGZvciAoaSA9IDAsIGlMZW4gPSBuVHJzLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgYUxheW91dC5wdXNoKFtdKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBpTGVuID0gblRycy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIG5UciA9IG5UcnNbaV07XG4gICAgICBpQ29sdW1uID0gMDtcbiAgICAgIG5DZWxsID0gblRyLmZpcnN0Q2hpbGQ7XG5cbiAgICAgIHdoaWxlIChuQ2VsbCkge1xuICAgICAgICBpZiAobkNlbGwubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PSBcIlREXCIgfHwgbkNlbGwubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PSBcIlRIXCIpIHtcbiAgICAgICAgICBpQ29sc3BhbiA9IG5DZWxsLmdldEF0dHJpYnV0ZSgnY29sc3BhbicpICogMTtcbiAgICAgICAgICBpUm93c3BhbiA9IG5DZWxsLmdldEF0dHJpYnV0ZSgncm93c3BhbicpICogMTtcbiAgICAgICAgICBpQ29sc3BhbiA9ICFpQ29sc3BhbiB8fCBpQ29sc3BhbiA9PT0gMCB8fCBpQ29sc3BhbiA9PT0gMSA/IDEgOiBpQ29sc3BhbjtcbiAgICAgICAgICBpUm93c3BhbiA9ICFpUm93c3BhbiB8fCBpUm93c3BhbiA9PT0gMCB8fCBpUm93c3BhbiA9PT0gMSA/IDEgOiBpUm93c3BhbjtcbiAgICAgICAgICBpQ29sU2hpZnRlZCA9IGZuU2hpZnRDb2woYUxheW91dCwgaSwgaUNvbHVtbik7XG4gICAgICAgICAgYlVuaXF1ZSA9IGlDb2xzcGFuID09PSAxID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgICAgICAgZm9yIChsID0gMDsgbCA8IGlDb2xzcGFuOyBsKyspIHtcbiAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBpUm93c3BhbjsgaysrKSB7XG4gICAgICAgICAgICAgIGFMYXlvdXRbaSArIGtdW2lDb2xTaGlmdGVkICsgbF0gPSB7XG4gICAgICAgICAgICAgICAgXCJjZWxsXCI6IG5DZWxsLFxuICAgICAgICAgICAgICAgIFwidW5pcXVlXCI6IGJVbmlxdWVcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgYUxheW91dFtpICsga10ublRyID0gblRyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5DZWxsID0gbkNlbGwubmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuR2V0VW5pcXVlVGhzKG9TZXR0aW5ncywgbkhlYWRlciwgYUxheW91dCkge1xuICAgIHZhciBhUmV0dXJuID0gW107XG5cbiAgICBpZiAoIWFMYXlvdXQpIHtcbiAgICAgIGFMYXlvdXQgPSBvU2V0dGluZ3MuYW9IZWFkZXI7XG5cbiAgICAgIGlmIChuSGVhZGVyKSB7XG4gICAgICAgIGFMYXlvdXQgPSBbXTtcblxuICAgICAgICBfZm5EZXRlY3RIZWFkZXIoYUxheW91dCwgbkhlYWRlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSBhTGF5b3V0Lmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDAsIGpMZW4gPSBhTGF5b3V0W2ldLmxlbmd0aDsgaiA8IGpMZW47IGorKykge1xuICAgICAgICBpZiAoYUxheW91dFtpXVtqXS51bmlxdWUgJiYgKCFhUmV0dXJuW2pdIHx8ICFvU2V0dGluZ3MuYlNvcnRDZWxsc1RvcCkpIHtcbiAgICAgICAgICBhUmV0dXJuW2pdID0gYUxheW91dFtpXVtqXS5jZWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFSZXR1cm47XG4gIH1cblxuICBmdW5jdGlvbiBfZm5CdWlsZEFqYXgob1NldHRpbmdzLCBkYXRhLCBmbikge1xuICAgIF9mbkNhbGxiYWNrRmlyZShvU2V0dGluZ3MsICdhb1NlcnZlclBhcmFtcycsICdzZXJ2ZXJQYXJhbXMnLCBbZGF0YV0pO1xuXG4gICAgaWYgKGRhdGEgJiYgJC5pc0FycmF5KGRhdGEpKSB7XG4gICAgICB2YXIgdG1wID0ge307XG4gICAgICB2YXIgcmJyYWNrZXQgPSAvKC4qPylcXFtcXF0kLztcbiAgICAgICQuZWFjaChkYXRhLCBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gdmFsLm5hbWUubWF0Y2gocmJyYWNrZXQpO1xuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIHZhciBuYW1lID0gbWF0Y2hbMF07XG5cbiAgICAgICAgICBpZiAoIXRtcFtuYW1lXSkge1xuICAgICAgICAgICAgdG1wW25hbWVdID0gW107XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdG1wW25hbWVdLnB1c2godmFsLnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0bXBbdmFsLm5hbWVdID0gdmFsLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRhdGEgPSB0bXA7XG4gICAgfVxuXG4gICAgdmFyIGFqYXhEYXRhO1xuICAgIHZhciBhamF4ID0gb1NldHRpbmdzLmFqYXg7XG4gICAgdmFyIGluc3RhbmNlID0gb1NldHRpbmdzLm9JbnN0YW5jZTtcblxuICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uIGNhbGxiYWNrKGpzb24pIHtcbiAgICAgIF9mbkNhbGxiYWNrRmlyZShvU2V0dGluZ3MsIG51bGwsICd4aHInLCBbb1NldHRpbmdzLCBqc29uLCBvU2V0dGluZ3MuanFYSFJdKTtcblxuICAgICAgZm4oanNvbik7XG4gICAgfTtcblxuICAgIGlmICgkLmlzUGxhaW5PYmplY3QoYWpheCkgJiYgYWpheC5kYXRhKSB7XG4gICAgICBhamF4RGF0YSA9IGFqYXguZGF0YTtcbiAgICAgIHZhciBuZXdEYXRhID0gdHlwZW9mIGFqYXhEYXRhID09PSAnZnVuY3Rpb24nID8gYWpheERhdGEoZGF0YSwgb1NldHRpbmdzKSA6IGFqYXhEYXRhO1xuICAgICAgZGF0YSA9IHR5cGVvZiBhamF4RGF0YSA9PT0gJ2Z1bmN0aW9uJyAmJiBuZXdEYXRhID8gbmV3RGF0YSA6ICQuZXh0ZW5kKHRydWUsIGRhdGEsIG5ld0RhdGEpO1xuICAgICAgZGVsZXRlIGFqYXguZGF0YTtcbiAgICB9XG5cbiAgICB2YXIgYmFzZUFqYXggPSB7XG4gICAgICBcImRhdGFcIjogZGF0YSxcbiAgICAgIFwic3VjY2Vzc1wiOiBmdW5jdGlvbiBzdWNjZXNzKGpzb24pIHtcbiAgICAgICAgdmFyIGVycm9yID0ganNvbi5lcnJvciB8fCBqc29uLnNFcnJvcjtcblxuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBfZm5Mb2cob1NldHRpbmdzLCAwLCBlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICBvU2V0dGluZ3MuanNvbiA9IGpzb247XG4gICAgICAgIGNhbGxiYWNrKGpzb24pO1xuICAgICAgfSxcbiAgICAgIFwiZGF0YVR5cGVcIjogXCJqc29uXCIsXG4gICAgICBcImNhY2hlXCI6IGZhbHNlLFxuICAgICAgXCJ0eXBlXCI6IG9TZXR0aW5ncy5zU2VydmVyTWV0aG9kLFxuICAgICAgXCJlcnJvclwiOiBmdW5jdGlvbiBlcnJvcih4aHIsIF9lcnJvciwgdGhyb3duKSB7XG4gICAgICAgIHZhciByZXQgPSBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCBudWxsLCAneGhyJywgW29TZXR0aW5ncywgbnVsbCwgb1NldHRpbmdzLmpxWEhSXSk7XG5cbiAgICAgICAgaWYgKCQuaW5BcnJheSh0cnVlLCByZXQpID09PSAtMSkge1xuICAgICAgICAgIGlmIChfZXJyb3IgPT0gXCJwYXJzZXJlcnJvclwiKSB7XG4gICAgICAgICAgICBfZm5Mb2cob1NldHRpbmdzLCAwLCAnSW52YWxpZCBKU09OIHJlc3BvbnNlJywgMSk7XG4gICAgICAgICAgfSBlbHNlIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgX2ZuTG9nKG9TZXR0aW5ncywgMCwgJ0FqYXggZXJyb3InLCA3KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShvU2V0dGluZ3MsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIG9TZXR0aW5ncy5vQWpheERhdGEgPSBkYXRhO1xuXG4gICAgX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgbnVsbCwgJ3ByZVhocicsIFtvU2V0dGluZ3MsIGRhdGFdKTtcblxuICAgIGlmIChvU2V0dGluZ3MuZm5TZXJ2ZXJEYXRhKSB7XG4gICAgICBvU2V0dGluZ3MuZm5TZXJ2ZXJEYXRhLmNhbGwoaW5zdGFuY2UsIG9TZXR0aW5ncy5zQWpheFNvdXJjZSwgJC5tYXAoZGF0YSwgZnVuY3Rpb24gKHZhbCwga2V5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZToga2V5LFxuICAgICAgICAgIHZhbHVlOiB2YWxcbiAgICAgICAgfTtcbiAgICAgIH0pLCBjYWxsYmFjaywgb1NldHRpbmdzKTtcbiAgICB9IGVsc2UgaWYgKG9TZXR0aW5ncy5zQWpheFNvdXJjZSB8fCB0eXBlb2YgYWpheCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG9TZXR0aW5ncy5qcVhIUiA9ICQuYWpheCgkLmV4dGVuZChiYXNlQWpheCwge1xuICAgICAgICB1cmw6IGFqYXggfHwgb1NldHRpbmdzLnNBamF4U291cmNlXG4gICAgICB9KSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYWpheCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb1NldHRpbmdzLmpxWEhSID0gYWpheC5jYWxsKGluc3RhbmNlLCBkYXRhLCBjYWxsYmFjaywgb1NldHRpbmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb1NldHRpbmdzLmpxWEhSID0gJC5hamF4KCQuZXh0ZW5kKGJhc2VBamF4LCBhamF4KSk7XG4gICAgICBhamF4LmRhdGEgPSBhamF4RGF0YTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5BamF4VXBkYXRlKHNldHRpbmdzKSB7XG4gICAgaWYgKHNldHRpbmdzLmJBamF4RGF0YUdldCkge1xuICAgICAgc2V0dGluZ3MuaURyYXcrKztcblxuICAgICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkoc2V0dGluZ3MsIHRydWUpO1xuXG4gICAgICBfZm5CdWlsZEFqYXgoc2V0dGluZ3MsIF9mbkFqYXhQYXJhbWV0ZXJzKHNldHRpbmdzKSwgZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgX2ZuQWpheFVwZGF0ZURyYXcoc2V0dGluZ3MsIGpzb24pO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFqYXhQYXJhbWV0ZXJzKHNldHRpbmdzKSB7XG4gICAgdmFyIGNvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnMsXG4gICAgICAgIGNvbHVtbkNvdW50ID0gY29sdW1ucy5sZW5ndGgsXG4gICAgICAgIGZlYXR1cmVzID0gc2V0dGluZ3Mub0ZlYXR1cmVzLFxuICAgICAgICBwcmVTZWFyY2ggPSBzZXR0aW5ncy5vUHJldmlvdXNTZWFyY2gsXG4gICAgICAgIHByZUNvbFNlYXJjaCA9IHNldHRpbmdzLmFvUHJlU2VhcmNoQ29scyxcbiAgICAgICAgaSxcbiAgICAgICAgZGF0YSA9IFtdLFxuICAgICAgICBkYXRhUHJvcCxcbiAgICAgICAgY29sdW1uLFxuICAgICAgICBjb2x1bW5TZWFyY2gsXG4gICAgICAgIHNvcnQgPSBfZm5Tb3J0RmxhdHRlbihzZXR0aW5ncyksXG4gICAgICAgIGRpc3BsYXlTdGFydCA9IHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0LFxuICAgICAgICBkaXNwbGF5TGVuZ3RoID0gZmVhdHVyZXMuYlBhZ2luYXRlICE9PSBmYWxzZSA/IHNldHRpbmdzLl9pRGlzcGxheUxlbmd0aCA6IC0xO1xuXG4gICAgdmFyIHBhcmFtID0gZnVuY3Rpb24gcGFyYW0obmFtZSwgdmFsdWUpIHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgICduYW1lJzogbmFtZSxcbiAgICAgICAgJ3ZhbHVlJzogdmFsdWVcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwYXJhbSgnc0VjaG8nLCBzZXR0aW5ncy5pRHJhdyk7XG4gICAgcGFyYW0oJ2lDb2x1bW5zJywgY29sdW1uQ291bnQpO1xuICAgIHBhcmFtKCdzQ29sdW1ucycsIF9wbHVjayhjb2x1bW5zLCAnc05hbWUnKS5qb2luKCcsJykpO1xuICAgIHBhcmFtKCdpRGlzcGxheVN0YXJ0JywgZGlzcGxheVN0YXJ0KTtcbiAgICBwYXJhbSgnaURpc3BsYXlMZW5ndGgnLCBkaXNwbGF5TGVuZ3RoKTtcbiAgICB2YXIgZCA9IHtcbiAgICAgIGRyYXc6IHNldHRpbmdzLmlEcmF3LFxuICAgICAgY29sdW1uczogW10sXG4gICAgICBvcmRlcjogW10sXG4gICAgICBzdGFydDogZGlzcGxheVN0YXJ0LFxuICAgICAgbGVuZ3RoOiBkaXNwbGF5TGVuZ3RoLFxuICAgICAgc2VhcmNoOiB7XG4gICAgICAgIHZhbHVlOiBwcmVTZWFyY2guc1NlYXJjaCxcbiAgICAgICAgcmVnZXg6IHByZVNlYXJjaC5iUmVnZXhcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGNvbHVtbkNvdW50OyBpKyspIHtcbiAgICAgIGNvbHVtbiA9IGNvbHVtbnNbaV07XG4gICAgICBjb2x1bW5TZWFyY2ggPSBwcmVDb2xTZWFyY2hbaV07XG4gICAgICBkYXRhUHJvcCA9IHR5cGVvZiBjb2x1bW4ubURhdGEgPT0gXCJmdW5jdGlvblwiID8gJ2Z1bmN0aW9uJyA6IGNvbHVtbi5tRGF0YTtcbiAgICAgIGQuY29sdW1ucy5wdXNoKHtcbiAgICAgICAgZGF0YTogZGF0YVByb3AsXG4gICAgICAgIG5hbWU6IGNvbHVtbi5zTmFtZSxcbiAgICAgICAgc2VhcmNoYWJsZTogY29sdW1uLmJTZWFyY2hhYmxlLFxuICAgICAgICBvcmRlcmFibGU6IGNvbHVtbi5iU29ydGFibGUsXG4gICAgICAgIHNlYXJjaDoge1xuICAgICAgICAgIHZhbHVlOiBjb2x1bW5TZWFyY2guc1NlYXJjaCxcbiAgICAgICAgICByZWdleDogY29sdW1uU2VhcmNoLmJSZWdleFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHBhcmFtKFwibURhdGFQcm9wX1wiICsgaSwgZGF0YVByb3ApO1xuXG4gICAgICBpZiAoZmVhdHVyZXMuYkZpbHRlcikge1xuICAgICAgICBwYXJhbSgnc1NlYXJjaF8nICsgaSwgY29sdW1uU2VhcmNoLnNTZWFyY2gpO1xuICAgICAgICBwYXJhbSgnYlJlZ2V4XycgKyBpLCBjb2x1bW5TZWFyY2guYlJlZ2V4KTtcbiAgICAgICAgcGFyYW0oJ2JTZWFyY2hhYmxlXycgKyBpLCBjb2x1bW4uYlNlYXJjaGFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmVhdHVyZXMuYlNvcnQpIHtcbiAgICAgICAgcGFyYW0oJ2JTb3J0YWJsZV8nICsgaSwgY29sdW1uLmJTb3J0YWJsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZlYXR1cmVzLmJGaWx0ZXIpIHtcbiAgICAgIHBhcmFtKCdzU2VhcmNoJywgcHJlU2VhcmNoLnNTZWFyY2gpO1xuICAgICAgcGFyYW0oJ2JSZWdleCcsIHByZVNlYXJjaC5iUmVnZXgpO1xuICAgIH1cblxuICAgIGlmIChmZWF0dXJlcy5iU29ydCkge1xuICAgICAgJC5lYWNoKHNvcnQsIGZ1bmN0aW9uIChpLCB2YWwpIHtcbiAgICAgICAgZC5vcmRlci5wdXNoKHtcbiAgICAgICAgICBjb2x1bW46IHZhbC5jb2wsXG4gICAgICAgICAgZGlyOiB2YWwuZGlyXG4gICAgICAgIH0pO1xuICAgICAgICBwYXJhbSgnaVNvcnRDb2xfJyArIGksIHZhbC5jb2wpO1xuICAgICAgICBwYXJhbSgnc1NvcnREaXJfJyArIGksIHZhbC5kaXIpO1xuICAgICAgfSk7XG4gICAgICBwYXJhbSgnaVNvcnRpbmdDb2xzJywgc29ydC5sZW5ndGgpO1xuICAgIH1cblxuICAgIHZhciBsZWdhY3kgPSBEYXRhVGFibGUuZXh0LmxlZ2FjeS5hamF4O1xuXG4gICAgaWYgKGxlZ2FjeSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHNldHRpbmdzLnNBamF4U291cmNlID8gZGF0YSA6IGQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlZ2FjeSA/IGRhdGEgOiBkO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQWpheFVwZGF0ZURyYXcoc2V0dGluZ3MsIGpzb24pIHtcbiAgICB2YXIgY29tcGF0ID0gZnVuY3Rpb24gY29tcGF0KG9sZCwgbW9kZXJuKSB7XG4gICAgICByZXR1cm4ganNvbltvbGRdICE9PSB1bmRlZmluZWQgPyBqc29uW29sZF0gOiBqc29uW21vZGVybl07XG4gICAgfTtcblxuICAgIHZhciBkYXRhID0gX2ZuQWpheERhdGFTcmMoc2V0dGluZ3MsIGpzb24pO1xuXG4gICAgdmFyIGRyYXcgPSBjb21wYXQoJ3NFY2hvJywgJ2RyYXcnKTtcbiAgICB2YXIgcmVjb3Jkc1RvdGFsID0gY29tcGF0KCdpVG90YWxSZWNvcmRzJywgJ3JlY29yZHNUb3RhbCcpO1xuICAgIHZhciByZWNvcmRzRmlsdGVyZWQgPSBjb21wYXQoJ2lUb3RhbERpc3BsYXlSZWNvcmRzJywgJ3JlY29yZHNGaWx0ZXJlZCcpO1xuXG4gICAgaWYgKGRyYXcpIHtcbiAgICAgIGlmIChkcmF3ICogMSA8IHNldHRpbmdzLmlEcmF3KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2V0dGluZ3MuaURyYXcgPSBkcmF3ICogMTtcbiAgICB9XG5cbiAgICBfZm5DbGVhclRhYmxlKHNldHRpbmdzKTtcblxuICAgIHNldHRpbmdzLl9pUmVjb3Jkc1RvdGFsID0gcGFyc2VJbnQocmVjb3Jkc1RvdGFsLCAxMCk7XG4gICAgc2V0dGluZ3MuX2lSZWNvcmRzRGlzcGxheSA9IHBhcnNlSW50KHJlY29yZHNGaWx0ZXJlZCwgMTApO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGRhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIF9mbkFkZERhdGEoc2V0dGluZ3MsIGRhdGFbaV0pO1xuICAgIH1cblxuICAgIHNldHRpbmdzLmFpRGlzcGxheSA9IHNldHRpbmdzLmFpRGlzcGxheU1hc3Rlci5zbGljZSgpO1xuICAgIHNldHRpbmdzLmJBamF4RGF0YUdldCA9IGZhbHNlO1xuXG4gICAgX2ZuRHJhdyhzZXR0aW5ncyk7XG5cbiAgICBpZiAoIXNldHRpbmdzLl9iSW5pdENvbXBsZXRlKSB7XG4gICAgICBfZm5Jbml0Q29tcGxldGUoc2V0dGluZ3MsIGpzb24pO1xuICAgIH1cblxuICAgIHNldHRpbmdzLmJBamF4RGF0YUdldCA9IHRydWU7XG5cbiAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShzZXR0aW5ncywgZmFsc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQWpheERhdGFTcmMob1NldHRpbmdzLCBqc29uKSB7XG4gICAgdmFyIGRhdGFTcmMgPSAkLmlzUGxhaW5PYmplY3Qob1NldHRpbmdzLmFqYXgpICYmIG9TZXR0aW5ncy5hamF4LmRhdGFTcmMgIT09IHVuZGVmaW5lZCA/IG9TZXR0aW5ncy5hamF4LmRhdGFTcmMgOiBvU2V0dGluZ3Muc0FqYXhEYXRhUHJvcDtcblxuICAgIGlmIChkYXRhU3JjID09PSAnZGF0YScpIHtcbiAgICAgIHJldHVybiBqc29uLmFhRGF0YSB8fCBqc29uW2RhdGFTcmNdO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhU3JjICE9PSBcIlwiID8gX2ZuR2V0T2JqZWN0RGF0YUZuKGRhdGFTcmMpKGpzb24pIDoganNvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZlYXR1cmVIdG1sRmlsdGVyKHNldHRpbmdzKSB7XG4gICAgdmFyIGNsYXNzZXMgPSBzZXR0aW5ncy5vQ2xhc3NlcztcbiAgICB2YXIgdGFibGVJZCA9IHNldHRpbmdzLnNUYWJsZUlkO1xuICAgIHZhciBsYW5ndWFnZSA9IHNldHRpbmdzLm9MYW5ndWFnZTtcbiAgICB2YXIgcHJldmlvdXNTZWFyY2ggPSBzZXR0aW5ncy5vUHJldmlvdXNTZWFyY2g7XG4gICAgdmFyIGZlYXR1cmVzID0gc2V0dGluZ3MuYWFuRmVhdHVyZXM7XG4gICAgdmFyIGlucHV0ID0gJzxpbnB1dCB0eXBlPVwic2VhcmNoXCIgY2xhc3M9XCInICsgY2xhc3Nlcy5zRmlsdGVySW5wdXQgKyAnXCIvPic7XG4gICAgdmFyIHN0ciA9IGxhbmd1YWdlLnNTZWFyY2g7XG4gICAgc3RyID0gc3RyLm1hdGNoKC9fSU5QVVRfLykgPyBzdHIucmVwbGFjZSgnX0lOUFVUXycsIGlucHV0KSA6IHN0ciArIGlucHV0O1xuICAgIHZhciBmaWx0ZXIgPSAkKCc8ZGl2Lz4nLCB7XG4gICAgICAnaWQnOiAhZmVhdHVyZXMuZiA/IHRhYmxlSWQgKyAnX2ZpbHRlcicgOiBudWxsLFxuICAgICAgJ2NsYXNzJzogY2xhc3Nlcy5zRmlsdGVyXG4gICAgfSkuYXBwZW5kKCQoJzxsYWJlbC8+JykuYXBwZW5kKHN0cikpO1xuXG4gICAgdmFyIHNlYXJjaEZuID0gZnVuY3Rpb24gc2VhcmNoRm4oKSB7XG4gICAgICB2YXIgbiA9IGZlYXR1cmVzLmY7XG4gICAgICB2YXIgdmFsID0gIXRoaXMudmFsdWUgPyBcIlwiIDogdGhpcy52YWx1ZTtcblxuICAgICAgaWYgKHZhbCAhPSBwcmV2aW91c1NlYXJjaC5zU2VhcmNoKSB7XG4gICAgICAgIF9mbkZpbHRlckNvbXBsZXRlKHNldHRpbmdzLCB7XG4gICAgICAgICAgXCJzU2VhcmNoXCI6IHZhbCxcbiAgICAgICAgICBcImJSZWdleFwiOiBwcmV2aW91c1NlYXJjaC5iUmVnZXgsXG4gICAgICAgICAgXCJiU21hcnRcIjogcHJldmlvdXNTZWFyY2guYlNtYXJ0LFxuICAgICAgICAgIFwiYkNhc2VJbnNlbnNpdGl2ZVwiOiBwcmV2aW91c1NlYXJjaC5iQ2FzZUluc2Vuc2l0aXZlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0ID0gMDtcblxuICAgICAgICBfZm5EcmF3KHNldHRpbmdzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHNlYXJjaERlbGF5ID0gc2V0dGluZ3Muc2VhcmNoRGVsYXkgIT09IG51bGwgPyBzZXR0aW5ncy5zZWFyY2hEZWxheSA6IF9mbkRhdGFTb3VyY2Uoc2V0dGluZ3MpID09PSAnc3NwJyA/IDQwMCA6IDA7XG4gICAgdmFyIGpxRmlsdGVyID0gJCgnaW5wdXQnLCBmaWx0ZXIpLnZhbChwcmV2aW91c1NlYXJjaC5zU2VhcmNoKS5hdHRyKCdwbGFjZWhvbGRlcicsIGxhbmd1YWdlLnNTZWFyY2hQbGFjZWhvbGRlcikub24oJ2tleXVwLkRUIHNlYXJjaC5EVCBpbnB1dC5EVCBwYXN0ZS5EVCBjdXQuRFQnLCBzZWFyY2hEZWxheSA/IF9mblRocm90dGxlKHNlYXJjaEZuLCBzZWFyY2hEZWxheSkgOiBzZWFyY2hGbikub24oJ2tleXByZXNzLkRUJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pLmF0dHIoJ2FyaWEtY29udHJvbHMnLCB0YWJsZUlkKTtcbiAgICAkKHNldHRpbmdzLm5UYWJsZSkub24oJ3NlYXJjaC5kdC5EVCcsIGZ1bmN0aW9uIChldiwgcykge1xuICAgICAgaWYgKHNldHRpbmdzID09PSBzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKGpxRmlsdGVyWzBdICE9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICBqcUZpbHRlci52YWwocHJldmlvdXNTZWFyY2guc1NlYXJjaCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmaWx0ZXJbMF07XG4gIH1cblxuICBmdW5jdGlvbiBfZm5GaWx0ZXJDb21wbGV0ZShvU2V0dGluZ3MsIG9JbnB1dCwgaUZvcmNlKSB7XG4gICAgdmFyIG9QcmV2U2VhcmNoID0gb1NldHRpbmdzLm9QcmV2aW91c1NlYXJjaDtcbiAgICB2YXIgYW9QcmV2U2VhcmNoID0gb1NldHRpbmdzLmFvUHJlU2VhcmNoQ29scztcblxuICAgIHZhciBmblNhdmVGaWx0ZXIgPSBmdW5jdGlvbiBmblNhdmVGaWx0ZXIob0ZpbHRlcikge1xuICAgICAgb1ByZXZTZWFyY2guc1NlYXJjaCA9IG9GaWx0ZXIuc1NlYXJjaDtcbiAgICAgIG9QcmV2U2VhcmNoLmJSZWdleCA9IG9GaWx0ZXIuYlJlZ2V4O1xuICAgICAgb1ByZXZTZWFyY2guYlNtYXJ0ID0gb0ZpbHRlci5iU21hcnQ7XG4gICAgICBvUHJldlNlYXJjaC5iQ2FzZUluc2Vuc2l0aXZlID0gb0ZpbHRlci5iQ2FzZUluc2Vuc2l0aXZlO1xuICAgIH07XG5cbiAgICB2YXIgZm5SZWdleCA9IGZ1bmN0aW9uIGZuUmVnZXgobykge1xuICAgICAgcmV0dXJuIG8uYkVzY2FwZVJlZ2V4ICE9PSB1bmRlZmluZWQgPyAhby5iRXNjYXBlUmVnZXggOiBvLmJSZWdleDtcbiAgICB9O1xuXG4gICAgX2ZuQ29sdW1uVHlwZXMob1NldHRpbmdzKTtcblxuICAgIGlmIChfZm5EYXRhU291cmNlKG9TZXR0aW5ncykgIT0gJ3NzcCcpIHtcbiAgICAgIF9mbkZpbHRlcihvU2V0dGluZ3MsIG9JbnB1dC5zU2VhcmNoLCBpRm9yY2UsIGZuUmVnZXgob0lucHV0KSwgb0lucHV0LmJTbWFydCwgb0lucHV0LmJDYXNlSW5zZW5zaXRpdmUpO1xuXG4gICAgICBmblNhdmVGaWx0ZXIob0lucHV0KTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhb1ByZXZTZWFyY2gubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgX2ZuRmlsdGVyQ29sdW1uKG9TZXR0aW5ncywgYW9QcmV2U2VhcmNoW2ldLnNTZWFyY2gsIGksIGZuUmVnZXgoYW9QcmV2U2VhcmNoW2ldKSwgYW9QcmV2U2VhcmNoW2ldLmJTbWFydCwgYW9QcmV2U2VhcmNoW2ldLmJDYXNlSW5zZW5zaXRpdmUpO1xuICAgICAgfVxuXG4gICAgICBfZm5GaWx0ZXJDdXN0b20ob1NldHRpbmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm5TYXZlRmlsdGVyKG9JbnB1dCk7XG4gICAgfVxuXG4gICAgb1NldHRpbmdzLmJGaWx0ZXJlZCA9IHRydWU7XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCBudWxsLCAnc2VhcmNoJywgW29TZXR0aW5nc10pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmlsdGVyQ3VzdG9tKHNldHRpbmdzKSB7XG4gICAgdmFyIGZpbHRlcnMgPSBEYXRhVGFibGUuZXh0LnNlYXJjaDtcbiAgICB2YXIgZGlzcGxheVJvd3MgPSBzZXR0aW5ncy5haURpc3BsYXk7XG4gICAgdmFyIHJvdywgcm93SWR4O1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGZpbHRlcnMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIHZhciByb3dzID0gW107XG5cbiAgICAgIGZvciAodmFyIGogPSAwLCBqZW4gPSBkaXNwbGF5Um93cy5sZW5ndGg7IGogPCBqZW47IGorKykge1xuICAgICAgICByb3dJZHggPSBkaXNwbGF5Um93c1tqXTtcbiAgICAgICAgcm93ID0gc2V0dGluZ3MuYW9EYXRhW3Jvd0lkeF07XG5cbiAgICAgICAgaWYgKGZpbHRlcnNbaV0oc2V0dGluZ3MsIHJvdy5fYUZpbHRlckRhdGEsIHJvd0lkeCwgcm93Ll9hRGF0YSwgaikpIHtcbiAgICAgICAgICByb3dzLnB1c2gocm93SWR4KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBkaXNwbGF5Um93cy5sZW5ndGggPSAwO1xuICAgICAgJC5tZXJnZShkaXNwbGF5Um93cywgcm93cyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmlsdGVyQ29sdW1uKHNldHRpbmdzLCBzZWFyY2hTdHIsIGNvbElkeCwgcmVnZXgsIHNtYXJ0LCBjYXNlSW5zZW5zaXRpdmUpIHtcbiAgICBpZiAoc2VhcmNoU3RyID09PSAnJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBkYXRhO1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICB2YXIgZGlzcGxheSA9IHNldHRpbmdzLmFpRGlzcGxheTtcblxuICAgIHZhciBycFNlYXJjaCA9IF9mbkZpbHRlckNyZWF0ZVNlYXJjaChzZWFyY2hTdHIsIHJlZ2V4LCBzbWFydCwgY2FzZUluc2Vuc2l0aXZlKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlzcGxheS5sZW5ndGg7IGkrKykge1xuICAgICAgZGF0YSA9IHNldHRpbmdzLmFvRGF0YVtkaXNwbGF5W2ldXS5fYUZpbHRlckRhdGFbY29sSWR4XTtcblxuICAgICAgaWYgKHJwU2VhcmNoLnRlc3QoZGF0YSkpIHtcbiAgICAgICAgb3V0LnB1c2goZGlzcGxheVtpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0dGluZ3MuYWlEaXNwbGF5ID0gb3V0O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmlsdGVyKHNldHRpbmdzLCBpbnB1dCwgZm9yY2UsIHJlZ2V4LCBzbWFydCwgY2FzZUluc2Vuc2l0aXZlKSB7XG4gICAgdmFyIHJwU2VhcmNoID0gX2ZuRmlsdGVyQ3JlYXRlU2VhcmNoKGlucHV0LCByZWdleCwgc21hcnQsIGNhc2VJbnNlbnNpdGl2ZSk7XG5cbiAgICB2YXIgcHJldlNlYXJjaCA9IHNldHRpbmdzLm9QcmV2aW91c1NlYXJjaC5zU2VhcmNoO1xuICAgIHZhciBkaXNwbGF5TWFzdGVyID0gc2V0dGluZ3MuYWlEaXNwbGF5TWFzdGVyO1xuICAgIHZhciBkaXNwbGF5LCBpbnZhbGlkYXRlZCwgaTtcbiAgICB2YXIgZmlsdGVyZWQgPSBbXTtcblxuICAgIGlmIChEYXRhVGFibGUuZXh0LnNlYXJjaC5sZW5ndGggIT09IDApIHtcbiAgICAgIGZvcmNlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpbnZhbGlkYXRlZCA9IF9mbkZpbHRlckRhdGEoc2V0dGluZ3MpO1xuXG4gICAgaWYgKGlucHV0Lmxlbmd0aCA8PSAwKSB7XG4gICAgICBzZXR0aW5ncy5haURpc3BsYXkgPSBkaXNwbGF5TWFzdGVyLnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpbnZhbGlkYXRlZCB8fCBmb3JjZSB8fCBwcmV2U2VhcmNoLmxlbmd0aCA+IGlucHV0Lmxlbmd0aCB8fCBpbnB1dC5pbmRleE9mKHByZXZTZWFyY2gpICE9PSAwIHx8IHNldHRpbmdzLmJTb3J0ZWQpIHtcbiAgICAgICAgICBzZXR0aW5ncy5haURpc3BsYXkgPSBkaXNwbGF5TWFzdGVyLnNsaWNlKCk7XG4gICAgICAgIH1cblxuICAgICAgZGlzcGxheSA9IHNldHRpbmdzLmFpRGlzcGxheTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGRpc3BsYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHJwU2VhcmNoLnRlc3Qoc2V0dGluZ3MuYW9EYXRhW2Rpc3BsYXlbaV1dLl9zRmlsdGVyUm93KSkge1xuICAgICAgICAgIGZpbHRlcmVkLnB1c2goZGlzcGxheVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2V0dGluZ3MuYWlEaXNwbGF5ID0gZmlsdGVyZWQ7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmlsdGVyQ3JlYXRlU2VhcmNoKHNlYXJjaCwgcmVnZXgsIHNtYXJ0LCBjYXNlSW5zZW5zaXRpdmUpIHtcbiAgICBzZWFyY2ggPSByZWdleCA/IHNlYXJjaCA6IF9mbkVzY2FwZVJlZ2V4KHNlYXJjaCk7XG5cbiAgICBpZiAoc21hcnQpIHtcbiAgICAgIHZhciBhID0gJC5tYXAoc2VhcmNoLm1hdGNoKC9cIlteXCJdK1wifFteIF0rL2cpIHx8IFsnJ10sIGZ1bmN0aW9uICh3b3JkKSB7XG4gICAgICAgIGlmICh3b3JkLmNoYXJBdCgwKSA9PT0gJ1wiJykge1xuICAgICAgICAgIHZhciBtID0gd29yZC5tYXRjaCgvXlwiKC4qKVwiJC8pO1xuICAgICAgICAgIHdvcmQgPSBtID8gbVsxXSA6IHdvcmQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd29yZC5yZXBsYWNlKCdcIicsICcnKTtcbiAgICAgIH0pO1xuICAgICAgc2VhcmNoID0gJ14oPz0uKj8nICsgYS5qb2luKCcpKD89Lio/JykgKyAnKS4qJCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoc2VhcmNoLCBjYXNlSW5zZW5zaXRpdmUgPyAnaScgOiAnJyk7XG4gIH1cblxuICB2YXIgX2ZuRXNjYXBlUmVnZXggPSBEYXRhVGFibGUudXRpbC5lc2NhcGVSZWdleDtcbiAgdmFyIF9fZmlsdGVyX2RpdiA9ICQoJzxkaXY+JylbMF07XG5cbiAgdmFyIF9fZmlsdGVyX2Rpdl90ZXh0Q29udGVudCA9IF9fZmlsdGVyX2Rpdi50ZXh0Q29udGVudCAhPT0gdW5kZWZpbmVkO1xuXG4gIGZ1bmN0aW9uIF9mbkZpbHRlckRhdGEoc2V0dGluZ3MpIHtcbiAgICB2YXIgY29sdW1ucyA9IHNldHRpbmdzLmFvQ29sdW1ucztcbiAgICB2YXIgY29sdW1uO1xuICAgIHZhciBpLCBqLCBpZW4sIGplbiwgZmlsdGVyRGF0YSwgY2VsbERhdGEsIHJvdztcbiAgICB2YXIgZm9tYXR0ZXJzID0gRGF0YVRhYmxlLmV4dC50eXBlLnNlYXJjaDtcbiAgICB2YXIgd2FzSW52YWxpZGF0ZWQgPSBmYWxzZTtcblxuICAgIGZvciAoaSA9IDAsIGllbiA9IHNldHRpbmdzLmFvRGF0YS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgcm93ID0gc2V0dGluZ3MuYW9EYXRhW2ldO1xuXG4gICAgICBpZiAoIXJvdy5fYUZpbHRlckRhdGEpIHtcbiAgICAgICAgZmlsdGVyRGF0YSA9IFtdO1xuXG4gICAgICAgIGZvciAoaiA9IDAsIGplbiA9IGNvbHVtbnMubGVuZ3RoOyBqIDwgamVuOyBqKyspIHtcbiAgICAgICAgICBjb2x1bW4gPSBjb2x1bW5zW2pdO1xuXG4gICAgICAgICAgaWYgKGNvbHVtbi5iU2VhcmNoYWJsZSkge1xuICAgICAgICAgICAgY2VsbERhdGEgPSBfZm5HZXRDZWxsRGF0YShzZXR0aW5ncywgaSwgaiwgJ2ZpbHRlcicpO1xuXG4gICAgICAgICAgICBpZiAoZm9tYXR0ZXJzW2NvbHVtbi5zVHlwZV0pIHtcbiAgICAgICAgICAgICAgY2VsbERhdGEgPSBmb21hdHRlcnNbY29sdW1uLnNUeXBlXShjZWxsRGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjZWxsRGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICBjZWxsRGF0YSA9ICcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNlbGxEYXRhICE9PSAnc3RyaW5nJyAmJiBjZWxsRGF0YS50b1N0cmluZykge1xuICAgICAgICAgICAgICBjZWxsRGF0YSA9IGNlbGxEYXRhLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNlbGxEYXRhID0gJyc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNlbGxEYXRhLmluZGV4T2YgJiYgY2VsbERhdGEuaW5kZXhPZignJicpICE9PSAtMSkge1xuICAgICAgICAgICAgX19maWx0ZXJfZGl2LmlubmVySFRNTCA9IGNlbGxEYXRhO1xuICAgICAgICAgICAgY2VsbERhdGEgPSBfX2ZpbHRlcl9kaXZfdGV4dENvbnRlbnQgPyBfX2ZpbHRlcl9kaXYudGV4dENvbnRlbnQgOiBfX2ZpbHRlcl9kaXYuaW5uZXJUZXh0O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjZWxsRGF0YS5yZXBsYWNlKSB7XG4gICAgICAgICAgICBjZWxsRGF0YSA9IGNlbGxEYXRhLnJlcGxhY2UoL1tcXHJcXG5dL2csICcnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmaWx0ZXJEYXRhLnB1c2goY2VsbERhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcm93Ll9hRmlsdGVyRGF0YSA9IGZpbHRlckRhdGE7XG4gICAgICAgIHJvdy5fc0ZpbHRlclJvdyA9IGZpbHRlckRhdGEuam9pbignICAnKTtcbiAgICAgICAgd2FzSW52YWxpZGF0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB3YXNJbnZhbGlkYXRlZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNlYXJjaFRvQ2FtZWwob2JqKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNlYXJjaDogb2JqLnNTZWFyY2gsXG4gICAgICBzbWFydDogb2JqLmJTbWFydCxcbiAgICAgIHJlZ2V4OiBvYmouYlJlZ2V4LFxuICAgICAgY2FzZUluc2Vuc2l0aXZlOiBvYmouYkNhc2VJbnNlbnNpdGl2ZVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBfZm5TZWFyY2hUb0h1bmcob2JqKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNTZWFyY2g6IG9iai5zZWFyY2gsXG4gICAgICBiU21hcnQ6IG9iai5zbWFydCxcbiAgICAgIGJSZWdleDogb2JqLnJlZ2V4LFxuICAgICAgYkNhc2VJbnNlbnNpdGl2ZTogb2JqLmNhc2VJbnNlbnNpdGl2ZVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBfZm5GZWF0dXJlSHRtbEluZm8oc2V0dGluZ3MpIHtcbiAgICB2YXIgdGlkID0gc2V0dGluZ3Muc1RhYmxlSWQsXG4gICAgICAgIG5vZGVzID0gc2V0dGluZ3MuYWFuRmVhdHVyZXMuaSxcbiAgICAgICAgbiA9ICQoJzxkaXYvPicsIHtcbiAgICAgICdjbGFzcyc6IHNldHRpbmdzLm9DbGFzc2VzLnNJbmZvLFxuICAgICAgJ2lkJzogIW5vZGVzID8gdGlkICsgJ19pbmZvJyA6IG51bGxcbiAgICB9KTtcblxuICAgIGlmICghbm9kZXMpIHtcbiAgICAgIHNldHRpbmdzLmFvRHJhd0NhbGxiYWNrLnB1c2goe1xuICAgICAgICBcImZuXCI6IF9mblVwZGF0ZUluZm8sXG4gICAgICAgIFwic05hbWVcIjogXCJpbmZvcm1hdGlvblwiXG4gICAgICB9KTtcbiAgICAgIG4uYXR0cigncm9sZScsICdzdGF0dXMnKS5hdHRyKCdhcmlhLWxpdmUnLCAncG9saXRlJyk7XG4gICAgICAkKHNldHRpbmdzLm5UYWJsZSkuYXR0cignYXJpYS1kZXNjcmliZWRieScsIHRpZCArICdfaW5mbycpO1xuICAgIH1cblxuICAgIHJldHVybiBuWzBdO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuVXBkYXRlSW5mbyhzZXR0aW5ncykge1xuICAgIHZhciBub2RlcyA9IHNldHRpbmdzLmFhbkZlYXR1cmVzLmk7XG5cbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGxhbmcgPSBzZXR0aW5ncy5vTGFuZ3VhZ2UsXG4gICAgICAgIHN0YXJ0ID0gc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQgKyAxLFxuICAgICAgICBlbmQgPSBzZXR0aW5ncy5mbkRpc3BsYXlFbmQoKSxcbiAgICAgICAgbWF4ID0gc2V0dGluZ3MuZm5SZWNvcmRzVG90YWwoKSxcbiAgICAgICAgdG90YWwgPSBzZXR0aW5ncy5mblJlY29yZHNEaXNwbGF5KCksXG4gICAgICAgIG91dCA9IHRvdGFsID8gbGFuZy5zSW5mbyA6IGxhbmcuc0luZm9FbXB0eTtcblxuICAgIGlmICh0b3RhbCAhPT0gbWF4KSB7XG4gICAgICBvdXQgKz0gJyAnICsgbGFuZy5zSW5mb0ZpbHRlcmVkO1xuICAgIH1cblxuICAgIG91dCArPSBsYW5nLnNJbmZvUG9zdEZpeDtcbiAgICBvdXQgPSBfZm5JbmZvTWFjcm9zKHNldHRpbmdzLCBvdXQpO1xuICAgIHZhciBjYWxsYmFjayA9IGxhbmcuZm5JbmZvQ2FsbGJhY2s7XG5cbiAgICBpZiAoY2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgIG91dCA9IGNhbGxiYWNrLmNhbGwoc2V0dGluZ3Mub0luc3RhbmNlLCBzZXR0aW5ncywgc3RhcnQsIGVuZCwgbWF4LCB0b3RhbCwgb3V0KTtcbiAgICB9XG5cbiAgICAkKG5vZGVzKS5odG1sKG91dCk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5JbmZvTWFjcm9zKHNldHRpbmdzLCBzdHIpIHtcbiAgICB2YXIgZm9ybWF0dGVyID0gc2V0dGluZ3MuZm5Gb3JtYXROdW1iZXIsXG4gICAgICAgIHN0YXJ0ID0gc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQgKyAxLFxuICAgICAgICBsZW4gPSBzZXR0aW5ncy5faURpc3BsYXlMZW5ndGgsXG4gICAgICAgIHZpcyA9IHNldHRpbmdzLmZuUmVjb3Jkc0Rpc3BsYXkoKSxcbiAgICAgICAgYWxsID0gbGVuID09PSAtMTtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL19TVEFSVF8vZywgZm9ybWF0dGVyLmNhbGwoc2V0dGluZ3MsIHN0YXJ0KSkucmVwbGFjZSgvX0VORF8vZywgZm9ybWF0dGVyLmNhbGwoc2V0dGluZ3MsIHNldHRpbmdzLmZuRGlzcGxheUVuZCgpKSkucmVwbGFjZSgvX01BWF8vZywgZm9ybWF0dGVyLmNhbGwoc2V0dGluZ3MsIHNldHRpbmdzLmZuUmVjb3Jkc1RvdGFsKCkpKS5yZXBsYWNlKC9fVE9UQUxfL2csIGZvcm1hdHRlci5jYWxsKHNldHRpbmdzLCB2aXMpKS5yZXBsYWNlKC9fUEFHRV8vZywgZm9ybWF0dGVyLmNhbGwoc2V0dGluZ3MsIGFsbCA/IDEgOiBNYXRoLmNlaWwoc3RhcnQgLyBsZW4pKSkucmVwbGFjZSgvX1BBR0VTXy9nLCBmb3JtYXR0ZXIuY2FsbChzZXR0aW5ncywgYWxsID8gMSA6IE1hdGguY2VpbCh2aXMgLyBsZW4pKSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Jbml0aWFsaXNlKHNldHRpbmdzKSB7XG4gICAgdmFyIGksXG4gICAgICAgIGlMZW4sXG4gICAgICAgIGlBamF4U3RhcnQgPSBzZXR0aW5ncy5pSW5pdERpc3BsYXlTdGFydDtcbiAgICB2YXIgY29sdW1ucyA9IHNldHRpbmdzLmFvQ29sdW1ucyxcbiAgICAgICAgY29sdW1uO1xuICAgIHZhciBmZWF0dXJlcyA9IHNldHRpbmdzLm9GZWF0dXJlcztcbiAgICB2YXIgZGVmZXJMb2FkaW5nID0gc2V0dGluZ3MuYkRlZmVyTG9hZGluZztcblxuICAgIGlmICghc2V0dGluZ3MuYkluaXRpYWxpc2VkKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX2ZuSW5pdGlhbGlzZShzZXR0aW5ncyk7XG4gICAgICB9LCAyMDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIF9mbkFkZE9wdGlvbnNIdG1sKHNldHRpbmdzKTtcblxuICAgIF9mbkJ1aWxkSGVhZChzZXR0aW5ncyk7XG5cbiAgICBfZm5EcmF3SGVhZChzZXR0aW5ncywgc2V0dGluZ3MuYW9IZWFkZXIpO1xuXG4gICAgX2ZuRHJhd0hlYWQoc2V0dGluZ3MsIHNldHRpbmdzLmFvRm9vdGVyKTtcblxuICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KHNldHRpbmdzLCB0cnVlKTtcblxuICAgIGlmIChmZWF0dXJlcy5iQXV0b1dpZHRoKSB7XG4gICAgICBfZm5DYWxjdWxhdGVDb2x1bW5XaWR0aHMoc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGlMZW4gPSBjb2x1bW5zLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgY29sdW1uID0gY29sdW1uc1tpXTtcblxuICAgICAgaWYgKGNvbHVtbi5zV2lkdGgpIHtcbiAgICAgICAgY29sdW1uLm5UaC5zdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKGNvbHVtbi5zV2lkdGgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgbnVsbCwgJ3ByZUluaXQnLCBbc2V0dGluZ3NdKTtcblxuICAgIF9mblJlRHJhdyhzZXR0aW5ncyk7XG5cbiAgICB2YXIgZGF0YVNyYyA9IF9mbkRhdGFTb3VyY2Uoc2V0dGluZ3MpO1xuXG4gICAgaWYgKGRhdGFTcmMgIT0gJ3NzcCcgfHwgZGVmZXJMb2FkaW5nKSB7XG4gICAgICBpZiAoZGF0YVNyYyA9PSAnYWpheCcpIHtcbiAgICAgICAgX2ZuQnVpbGRBamF4KHNldHRpbmdzLCBbXSwgZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgICB2YXIgYURhdGEgPSBfZm5BamF4RGF0YVNyYyhzZXR0aW5ncywganNvbik7XG5cbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIF9mbkFkZERhdGEoc2V0dGluZ3MsIGFEYXRhW2ldKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZXR0aW5ncy5pSW5pdERpc3BsYXlTdGFydCA9IGlBamF4U3RhcnQ7XG5cbiAgICAgICAgICBfZm5SZURyYXcoc2V0dGluZ3MpO1xuXG4gICAgICAgICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkoc2V0dGluZ3MsIGZhbHNlKTtcblxuICAgICAgICAgIF9mbkluaXRDb21wbGV0ZShzZXR0aW5ncywganNvbik7XG4gICAgICAgIH0sIHNldHRpbmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KHNldHRpbmdzLCBmYWxzZSk7XG5cbiAgICAgICAgX2ZuSW5pdENvbXBsZXRlKHNldHRpbmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Jbml0Q29tcGxldGUoc2V0dGluZ3MsIGpzb24pIHtcbiAgICBzZXR0aW5ncy5fYkluaXRDb21wbGV0ZSA9IHRydWU7XG5cbiAgICBpZiAoanNvbiB8fCBzZXR0aW5ncy5vSW5pdC5hYURhdGEpIHtcbiAgICAgIF9mbkFkanVzdENvbHVtblNpemluZyhzZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCBudWxsLCAncGx1Z2luLWluaXQnLCBbc2V0dGluZ3MsIGpzb25dKTtcblxuICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgJ2FvSW5pdENvbXBsZXRlJywgJ2luaXQnLCBbc2V0dGluZ3MsIGpzb25dKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkxlbmd0aENoYW5nZShzZXR0aW5ncywgdmFsKSB7XG4gICAgdmFyIGxlbiA9IHBhcnNlSW50KHZhbCwgMTApO1xuICAgIHNldHRpbmdzLl9pRGlzcGxheUxlbmd0aCA9IGxlbjtcblxuICAgIF9mbkxlbmd0aE92ZXJmbG93KHNldHRpbmdzKTtcblxuICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgbnVsbCwgJ2xlbmd0aCcsIFtzZXR0aW5ncywgbGVuXSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5GZWF0dXJlSHRtbExlbmd0aChzZXR0aW5ncykge1xuICAgIHZhciBjbGFzc2VzID0gc2V0dGluZ3Mub0NsYXNzZXMsXG4gICAgICAgIHRhYmxlSWQgPSBzZXR0aW5ncy5zVGFibGVJZCxcbiAgICAgICAgbWVudSA9IHNldHRpbmdzLmFMZW5ndGhNZW51LFxuICAgICAgICBkMiA9ICQuaXNBcnJheShtZW51WzBdKSxcbiAgICAgICAgbGVuZ3RocyA9IGQyID8gbWVudVswXSA6IG1lbnUsXG4gICAgICAgIGxhbmd1YWdlID0gZDIgPyBtZW51WzFdIDogbWVudTtcbiAgICB2YXIgc2VsZWN0ID0gJCgnPHNlbGVjdC8+Jywge1xuICAgICAgJ25hbWUnOiB0YWJsZUlkICsgJ19sZW5ndGgnLFxuICAgICAgJ2FyaWEtY29udHJvbHMnOiB0YWJsZUlkLFxuICAgICAgJ2NsYXNzJzogY2xhc3Nlcy5zTGVuZ3RoU2VsZWN0XG4gICAgfSk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gbGVuZ3Rocy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgc2VsZWN0WzBdW2ldID0gbmV3IE9wdGlvbih0eXBlb2YgbGFuZ3VhZ2VbaV0gPT09ICdudW1iZXInID8gc2V0dGluZ3MuZm5Gb3JtYXROdW1iZXIobGFuZ3VhZ2VbaV0pIDogbGFuZ3VhZ2VbaV0sIGxlbmd0aHNbaV0pO1xuICAgIH1cblxuICAgIHZhciBkaXYgPSAkKCc8ZGl2PjxsYWJlbC8+PC9kaXY+JykuYWRkQ2xhc3MoY2xhc3Nlcy5zTGVuZ3RoKTtcblxuICAgIGlmICghc2V0dGluZ3MuYWFuRmVhdHVyZXMubCkge1xuICAgICAgZGl2WzBdLmlkID0gdGFibGVJZCArICdfbGVuZ3RoJztcbiAgICB9XG5cbiAgICBkaXYuY2hpbGRyZW4oKS5hcHBlbmQoc2V0dGluZ3Mub0xhbmd1YWdlLnNMZW5ndGhNZW51LnJlcGxhY2UoJ19NRU5VXycsIHNlbGVjdFswXS5vdXRlckhUTUwpKTtcbiAgICAkKCdzZWxlY3QnLCBkaXYpLnZhbChzZXR0aW5ncy5faURpc3BsYXlMZW5ndGgpLm9uKCdjaGFuZ2UuRFQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgX2ZuTGVuZ3RoQ2hhbmdlKHNldHRpbmdzLCAkKHRoaXMpLnZhbCgpKTtcblxuICAgICAgX2ZuRHJhdyhzZXR0aW5ncyk7XG4gICAgfSk7XG4gICAgJChzZXR0aW5ncy5uVGFibGUpLm9uKCdsZW5ndGguZHQuRFQnLCBmdW5jdGlvbiAoZSwgcywgbGVuKSB7XG4gICAgICBpZiAoc2V0dGluZ3MgPT09IHMpIHtcbiAgICAgICAgJCgnc2VsZWN0JywgZGl2KS52YWwobGVuKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGl2WzBdO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmVhdHVyZUh0bWxQYWdpbmF0ZShzZXR0aW5ncykge1xuICAgIHZhciB0eXBlID0gc2V0dGluZ3Muc1BhZ2luYXRpb25UeXBlLFxuICAgICAgICBwbHVnaW4gPSBEYXRhVGFibGUuZXh0LnBhZ2VyW3R5cGVdLFxuICAgICAgICBtb2Rlcm4gPSB0eXBlb2YgcGx1Z2luID09PSAnZnVuY3Rpb24nLFxuICAgICAgICByZWRyYXcgPSBmdW5jdGlvbiByZWRyYXcoc2V0dGluZ3MpIHtcbiAgICAgIF9mbkRyYXcoc2V0dGluZ3MpO1xuICAgIH0sXG4gICAgICAgIG5vZGUgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcyhzZXR0aW5ncy5vQ2xhc3Nlcy5zUGFnaW5nICsgdHlwZSlbMF0sXG4gICAgICAgIGZlYXR1cmVzID0gc2V0dGluZ3MuYWFuRmVhdHVyZXM7XG5cbiAgICBpZiAoIW1vZGVybikge1xuICAgICAgcGx1Z2luLmZuSW5pdChzZXR0aW5ncywgbm9kZSwgcmVkcmF3KTtcbiAgICB9XG5cbiAgICBpZiAoIWZlYXR1cmVzLnApIHtcbiAgICAgIG5vZGUuaWQgPSBzZXR0aW5ncy5zVGFibGVJZCArICdfcGFnaW5hdGUnO1xuICAgICAgc2V0dGluZ3MuYW9EcmF3Q2FsbGJhY2sucHVzaCh7XG4gICAgICAgIFwiZm5cIjogZnVuY3Rpb24gZm4oc2V0dGluZ3MpIHtcbiAgICAgICAgICBpZiAobW9kZXJuKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBzZXR0aW5ncy5faURpc3BsYXlTdGFydCxcbiAgICAgICAgICAgICAgICBsZW4gPSBzZXR0aW5ncy5faURpc3BsYXlMZW5ndGgsXG4gICAgICAgICAgICAgICAgdmlzUmVjb3JkcyA9IHNldHRpbmdzLmZuUmVjb3Jkc0Rpc3BsYXkoKSxcbiAgICAgICAgICAgICAgICBhbGwgPSBsZW4gPT09IC0xLFxuICAgICAgICAgICAgICAgIHBhZ2UgPSBhbGwgPyAwIDogTWF0aC5jZWlsKHN0YXJ0IC8gbGVuKSxcbiAgICAgICAgICAgICAgICBwYWdlcyA9IGFsbCA/IDEgOiBNYXRoLmNlaWwodmlzUmVjb3JkcyAvIGxlbiksXG4gICAgICAgICAgICAgICAgYnV0dG9ucyA9IHBsdWdpbihwYWdlLCBwYWdlcyksXG4gICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICBpZW47XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGllbiA9IGZlYXR1cmVzLnAubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICAgICAgX2ZuUmVuZGVyZXIoc2V0dGluZ3MsICdwYWdlQnV0dG9uJykoc2V0dGluZ3MsIGZlYXR1cmVzLnBbaV0sIGksIGJ1dHRvbnMsIHBhZ2UsIHBhZ2VzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGx1Z2luLmZuVXBkYXRlKHNldHRpbmdzLCByZWRyYXcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJzTmFtZVwiOiBcInBhZ2luYXRpb25cIlxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5QYWdlQ2hhbmdlKHNldHRpbmdzLCBhY3Rpb24sIHJlZHJhdykge1xuICAgIHZhciBzdGFydCA9IHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0LFxuICAgICAgICBsZW4gPSBzZXR0aW5ncy5faURpc3BsYXlMZW5ndGgsXG4gICAgICAgIHJlY29yZHMgPSBzZXR0aW5ncy5mblJlY29yZHNEaXNwbGF5KCk7XG5cbiAgICBpZiAocmVjb3JkcyA9PT0gMCB8fCBsZW4gPT09IC0xKSB7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0aW9uID09PSBcIm51bWJlclwiKSB7XG4gICAgICBzdGFydCA9IGFjdGlvbiAqIGxlbjtcblxuICAgICAgaWYgKHN0YXJ0ID4gcmVjb3Jkcykge1xuICAgICAgICBzdGFydCA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhY3Rpb24gPT0gXCJmaXJzdFwiKSB7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfSBlbHNlIGlmIChhY3Rpb24gPT0gXCJwcmV2aW91c1wiKSB7XG4gICAgICBzdGFydCA9IGxlbiA+PSAwID8gc3RhcnQgLSBsZW4gOiAwO1xuXG4gICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PSBcIm5leHRcIikge1xuICAgICAgaWYgKHN0YXJ0ICsgbGVuIDwgcmVjb3Jkcykge1xuICAgICAgICBzdGFydCArPSBsZW47XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhY3Rpb24gPT0gXCJsYXN0XCIpIHtcbiAgICAgIHN0YXJ0ID0gTWF0aC5mbG9vcigocmVjb3JkcyAtIDEpIC8gbGVuKSAqIGxlbjtcbiAgICB9IGVsc2Uge1xuICAgICAgX2ZuTG9nKHNldHRpbmdzLCAwLCBcIlVua25vd24gcGFnaW5nIGFjdGlvbjogXCIgKyBhY3Rpb24sIDUpO1xuICAgIH1cblxuICAgIHZhciBjaGFuZ2VkID0gc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQgIT09IHN0YXJ0O1xuICAgIHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0ID0gc3RhcnQ7XG5cbiAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCBudWxsLCAncGFnZScsIFtzZXR0aW5nc10pO1xuXG4gICAgICBpZiAocmVkcmF3KSB7XG4gICAgICAgIF9mbkRyYXcoc2V0dGluZ3MpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjaGFuZ2VkO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmVhdHVyZUh0bWxQcm9jZXNzaW5nKHNldHRpbmdzKSB7XG4gICAgcmV0dXJuICQoJzxkaXYvPicsIHtcbiAgICAgICdpZCc6ICFzZXR0aW5ncy5hYW5GZWF0dXJlcy5yID8gc2V0dGluZ3Muc1RhYmxlSWQgKyAnX3Byb2Nlc3NpbmcnIDogbnVsbCxcbiAgICAgICdjbGFzcyc6IHNldHRpbmdzLm9DbGFzc2VzLnNQcm9jZXNzaW5nXG4gICAgfSkuaHRtbChzZXR0aW5ncy5vTGFuZ3VhZ2Uuc1Byb2Nlc3NpbmcpLmluc2VydEJlZm9yZShzZXR0aW5ncy5uVGFibGUpWzBdO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkoc2V0dGluZ3MsIHNob3cpIHtcbiAgICBpZiAoc2V0dGluZ3Mub0ZlYXR1cmVzLmJQcm9jZXNzaW5nKSB7XG4gICAgICAkKHNldHRpbmdzLmFhbkZlYXR1cmVzLnIpLmNzcygnZGlzcGxheScsIHNob3cgPyAnYmxvY2snIDogJ25vbmUnKTtcbiAgICB9XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIG51bGwsICdwcm9jZXNzaW5nJywgW3NldHRpbmdzLCBzaG93XSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5GZWF0dXJlSHRtbFRhYmxlKHNldHRpbmdzKSB7XG4gICAgdmFyIHRhYmxlID0gJChzZXR0aW5ncy5uVGFibGUpO1xuICAgIHRhYmxlLmF0dHIoJ3JvbGUnLCAnZ3JpZCcpO1xuICAgIHZhciBzY3JvbGwgPSBzZXR0aW5ncy5vU2Nyb2xsO1xuXG4gICAgaWYgKHNjcm9sbC5zWCA9PT0gJycgJiYgc2Nyb2xsLnNZID09PSAnJykge1xuICAgICAgcmV0dXJuIHNldHRpbmdzLm5UYWJsZTtcbiAgICB9XG5cbiAgICB2YXIgc2Nyb2xsWCA9IHNjcm9sbC5zWDtcbiAgICB2YXIgc2Nyb2xsWSA9IHNjcm9sbC5zWTtcbiAgICB2YXIgY2xhc3NlcyA9IHNldHRpbmdzLm9DbGFzc2VzO1xuICAgIHZhciBjYXB0aW9uID0gdGFibGUuY2hpbGRyZW4oJ2NhcHRpb24nKTtcbiAgICB2YXIgY2FwdGlvblNpZGUgPSBjYXB0aW9uLmxlbmd0aCA/IGNhcHRpb25bMF0uX2NhcHRpb25TaWRlIDogbnVsbDtcbiAgICB2YXIgaGVhZGVyQ2xvbmUgPSAkKHRhYmxlWzBdLmNsb25lTm9kZShmYWxzZSkpO1xuICAgIHZhciBmb290ZXJDbG9uZSA9ICQodGFibGVbMF0uY2xvbmVOb2RlKGZhbHNlKSk7XG4gICAgdmFyIGZvb3RlciA9IHRhYmxlLmNoaWxkcmVuKCd0Zm9vdCcpO1xuICAgIHZhciBfZGl2ID0gJzxkaXYvPic7XG5cbiAgICB2YXIgc2l6ZSA9IGZ1bmN0aW9uIHNpemUocykge1xuICAgICAgcmV0dXJuICFzID8gbnVsbCA6IF9mblN0cmluZ1RvQ3NzKHMpO1xuICAgIH07XG5cbiAgICBpZiAoIWZvb3Rlci5sZW5ndGgpIHtcbiAgICAgIGZvb3RlciA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHNjcm9sbGVyID0gJChfZGl2LCB7XG4gICAgICAnY2xhc3MnOiBjbGFzc2VzLnNTY3JvbGxXcmFwcGVyXG4gICAgfSkuYXBwZW5kKCQoX2Rpdiwge1xuICAgICAgJ2NsYXNzJzogY2xhc3Nlcy5zU2Nyb2xsSGVhZFxuICAgIH0pLmNzcyh7XG4gICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgIGJvcmRlcjogMCxcbiAgICAgIHdpZHRoOiBzY3JvbGxYID8gc2l6ZShzY3JvbGxYKSA6ICcxMDAlJ1xuICAgIH0pLmFwcGVuZCgkKF9kaXYsIHtcbiAgICAgICdjbGFzcyc6IGNsYXNzZXMuc1Njcm9sbEhlYWRJbm5lclxuICAgIH0pLmNzcyh7XG4gICAgICAnYm94LXNpemluZyc6ICdjb250ZW50LWJveCcsXG4gICAgICB3aWR0aDogc2Nyb2xsLnNYSW5uZXIgfHwgJzEwMCUnXG4gICAgfSkuYXBwZW5kKGhlYWRlckNsb25lLnJlbW92ZUF0dHIoJ2lkJykuY3NzKCdtYXJnaW4tbGVmdCcsIDApLmFwcGVuZChjYXB0aW9uU2lkZSA9PT0gJ3RvcCcgPyBjYXB0aW9uIDogbnVsbCkuYXBwZW5kKHRhYmxlLmNoaWxkcmVuKCd0aGVhZCcpKSkpKS5hcHBlbmQoJChfZGl2LCB7XG4gICAgICAnY2xhc3MnOiBjbGFzc2VzLnNTY3JvbGxCb2R5XG4gICAgfSkuY3NzKHtcbiAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgb3ZlcmZsb3c6ICdhdXRvJyxcbiAgICAgIHdpZHRoOiBzaXplKHNjcm9sbFgpXG4gICAgfSkuYXBwZW5kKHRhYmxlKSk7XG5cbiAgICBpZiAoZm9vdGVyKSB7XG4gICAgICBzY3JvbGxlci5hcHBlbmQoJChfZGl2LCB7XG4gICAgICAgICdjbGFzcyc6IGNsYXNzZXMuc1Njcm9sbEZvb3RcbiAgICAgIH0pLmNzcyh7XG4gICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgYm9yZGVyOiAwLFxuICAgICAgICB3aWR0aDogc2Nyb2xsWCA/IHNpemUoc2Nyb2xsWCkgOiAnMTAwJSdcbiAgICAgIH0pLmFwcGVuZCgkKF9kaXYsIHtcbiAgICAgICAgJ2NsYXNzJzogY2xhc3Nlcy5zU2Nyb2xsRm9vdElubmVyXG4gICAgICB9KS5hcHBlbmQoZm9vdGVyQ2xvbmUucmVtb3ZlQXR0cignaWQnKS5jc3MoJ21hcmdpbi1sZWZ0JywgMCkuYXBwZW5kKGNhcHRpb25TaWRlID09PSAnYm90dG9tJyA/IGNhcHRpb24gOiBudWxsKS5hcHBlbmQodGFibGUuY2hpbGRyZW4oJ3Rmb290JykpKSkpO1xuICAgIH1cblxuICAgIHZhciBjaGlsZHJlbiA9IHNjcm9sbGVyLmNoaWxkcmVuKCk7XG4gICAgdmFyIHNjcm9sbEhlYWQgPSBjaGlsZHJlblswXTtcbiAgICB2YXIgc2Nyb2xsQm9keSA9IGNoaWxkcmVuWzFdO1xuICAgIHZhciBzY3JvbGxGb290ID0gZm9vdGVyID8gY2hpbGRyZW5bMl0gOiBudWxsO1xuXG4gICAgaWYgKHNjcm9sbFgpIHtcbiAgICAgICQoc2Nyb2xsQm9keSkub24oJ3Njcm9sbC5EVCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBzY3JvbGxMZWZ0ID0gdGhpcy5zY3JvbGxMZWZ0O1xuICAgICAgICBzY3JvbGxIZWFkLnNjcm9sbExlZnQgPSBzY3JvbGxMZWZ0O1xuXG4gICAgICAgIGlmIChmb290ZXIpIHtcbiAgICAgICAgICBzY3JvbGxGb290LnNjcm9sbExlZnQgPSBzY3JvbGxMZWZ0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkKHNjcm9sbEJvZHkpLmNzcyhzY3JvbGxZICYmIHNjcm9sbC5iQ29sbGFwc2UgPyAnbWF4LWhlaWdodCcgOiAnaGVpZ2h0Jywgc2Nyb2xsWSk7XG4gICAgc2V0dGluZ3MublNjcm9sbEhlYWQgPSBzY3JvbGxIZWFkO1xuICAgIHNldHRpbmdzLm5TY3JvbGxCb2R5ID0gc2Nyb2xsQm9keTtcbiAgICBzZXR0aW5ncy5uU2Nyb2xsRm9vdCA9IHNjcm9sbEZvb3Q7XG4gICAgc2V0dGluZ3MuYW9EcmF3Q2FsbGJhY2sucHVzaCh7XG4gICAgICBcImZuXCI6IF9mblNjcm9sbERyYXcsXG4gICAgICBcInNOYW1lXCI6IFwic2Nyb2xsaW5nXCJcbiAgICB9KTtcbiAgICByZXR1cm4gc2Nyb2xsZXJbMF07XG4gIH1cblxuICBmdW5jdGlvbiBfZm5TY3JvbGxEcmF3KHNldHRpbmdzKSB7XG4gICAgdmFyIHNjcm9sbCA9IHNldHRpbmdzLm9TY3JvbGwsXG4gICAgICAgIHNjcm9sbFggPSBzY3JvbGwuc1gsXG4gICAgICAgIHNjcm9sbFhJbm5lciA9IHNjcm9sbC5zWElubmVyLFxuICAgICAgICBzY3JvbGxZID0gc2Nyb2xsLnNZLFxuICAgICAgICBiYXJXaWR0aCA9IHNjcm9sbC5pQmFyV2lkdGgsXG4gICAgICAgIGRpdkhlYWRlciA9ICQoc2V0dGluZ3MublNjcm9sbEhlYWQpLFxuICAgICAgICBkaXZIZWFkZXJTdHlsZSA9IGRpdkhlYWRlclswXS5zdHlsZSxcbiAgICAgICAgZGl2SGVhZGVySW5uZXIgPSBkaXZIZWFkZXIuY2hpbGRyZW4oJ2RpdicpLFxuICAgICAgICBkaXZIZWFkZXJJbm5lclN0eWxlID0gZGl2SGVhZGVySW5uZXJbMF0uc3R5bGUsXG4gICAgICAgIGRpdkhlYWRlclRhYmxlID0gZGl2SGVhZGVySW5uZXIuY2hpbGRyZW4oJ3RhYmxlJyksXG4gICAgICAgIGRpdkJvZHlFbCA9IHNldHRpbmdzLm5TY3JvbGxCb2R5LFxuICAgICAgICBkaXZCb2R5ID0gJChkaXZCb2R5RWwpLFxuICAgICAgICBkaXZCb2R5U3R5bGUgPSBkaXZCb2R5RWwuc3R5bGUsXG4gICAgICAgIGRpdkZvb3RlciA9ICQoc2V0dGluZ3MublNjcm9sbEZvb3QpLFxuICAgICAgICBkaXZGb290ZXJJbm5lciA9IGRpdkZvb3Rlci5jaGlsZHJlbignZGl2JyksXG4gICAgICAgIGRpdkZvb3RlclRhYmxlID0gZGl2Rm9vdGVySW5uZXIuY2hpbGRyZW4oJ3RhYmxlJyksXG4gICAgICAgIGhlYWRlciA9ICQoc2V0dGluZ3MublRIZWFkKSxcbiAgICAgICAgdGFibGUgPSAkKHNldHRpbmdzLm5UYWJsZSksXG4gICAgICAgIHRhYmxlRWwgPSB0YWJsZVswXSxcbiAgICAgICAgdGFibGVTdHlsZSA9IHRhYmxlRWwuc3R5bGUsXG4gICAgICAgIGZvb3RlciA9IHNldHRpbmdzLm5URm9vdCA/ICQoc2V0dGluZ3MublRGb290KSA6IG51bGwsXG4gICAgICAgIGJyb3dzZXIgPSBzZXR0aW5ncy5vQnJvd3NlcixcbiAgICAgICAgaWU2NyA9IGJyb3dzZXIuYlNjcm9sbE92ZXJzaXplLFxuICAgICAgICBkdEhlYWRlckNlbGxzID0gX3BsdWNrKHNldHRpbmdzLmFvQ29sdW1ucywgJ25UaCcpLFxuICAgICAgICBoZWFkZXJUcmdFbHMsXG4gICAgICAgIGZvb3RlclRyZ0VscyxcbiAgICAgICAgaGVhZGVyU3JjRWxzLFxuICAgICAgICBmb290ZXJTcmNFbHMsXG4gICAgICAgIGhlYWRlckNvcHksXG4gICAgICAgIGZvb3RlckNvcHksXG4gICAgICAgIGhlYWRlcldpZHRocyA9IFtdLFxuICAgICAgICBmb290ZXJXaWR0aHMgPSBbXSxcbiAgICAgICAgaGVhZGVyQ29udGVudCA9IFtdLFxuICAgICAgICBmb290ZXJDb250ZW50ID0gW10sXG4gICAgICAgIGlkeCxcbiAgICAgICAgY29ycmVjdGlvbixcbiAgICAgICAgc2FuaXR5V2lkdGgsXG4gICAgICAgIHplcm9PdXQgPSBmdW5jdGlvbiB6ZXJvT3V0KG5TaXplcikge1xuICAgICAgdmFyIHN0eWxlID0gblNpemVyLnN0eWxlO1xuICAgICAgc3R5bGUucGFkZGluZ1RvcCA9IFwiMFwiO1xuICAgICAgc3R5bGUucGFkZGluZ0JvdHRvbSA9IFwiMFwiO1xuICAgICAgc3R5bGUuYm9yZGVyVG9wV2lkdGggPSBcIjBcIjtcbiAgICAgIHN0eWxlLmJvcmRlckJvdHRvbVdpZHRoID0gXCIwXCI7XG4gICAgICBzdHlsZS5oZWlnaHQgPSAwO1xuICAgIH07XG5cbiAgICB2YXIgc2Nyb2xsQmFyVmlzID0gZGl2Qm9keUVsLnNjcm9sbEhlaWdodCA+IGRpdkJvZHlFbC5jbGllbnRIZWlnaHQ7XG5cbiAgICBpZiAoc2V0dGluZ3Muc2Nyb2xsQmFyVmlzICE9PSBzY3JvbGxCYXJWaXMgJiYgc2V0dGluZ3Muc2Nyb2xsQmFyVmlzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHNldHRpbmdzLnNjcm9sbEJhclZpcyA9IHNjcm9sbEJhclZpcztcblxuICAgICAgX2ZuQWRqdXN0Q29sdW1uU2l6aW5nKHNldHRpbmdzKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXR0aW5ncy5zY3JvbGxCYXJWaXMgPSBzY3JvbGxCYXJWaXM7XG4gICAgfVxuXG4gICAgdGFibGUuY2hpbGRyZW4oJ3RoZWFkLCB0Zm9vdCcpLnJlbW92ZSgpO1xuXG4gICAgaWYgKGZvb3Rlcikge1xuICAgICAgZm9vdGVyQ29weSA9IGZvb3Rlci5jbG9uZSgpLnByZXBlbmRUbyh0YWJsZSk7XG4gICAgICBmb290ZXJUcmdFbHMgPSBmb290ZXIuZmluZCgndHInKTtcbiAgICAgIGZvb3RlclNyY0VscyA9IGZvb3RlckNvcHkuZmluZCgndHInKTtcbiAgICB9XG5cbiAgICBoZWFkZXJDb3B5ID0gaGVhZGVyLmNsb25lKCkucHJlcGVuZFRvKHRhYmxlKTtcbiAgICBoZWFkZXJUcmdFbHMgPSBoZWFkZXIuZmluZCgndHInKTtcbiAgICBoZWFkZXJTcmNFbHMgPSBoZWFkZXJDb3B5LmZpbmQoJ3RyJyk7XG4gICAgaGVhZGVyQ29weS5maW5kKCd0aCwgdGQnKS5yZW1vdmVBdHRyKCd0YWJpbmRleCcpO1xuXG4gICAgaWYgKCFzY3JvbGxYKSB7XG4gICAgICBkaXZCb2R5U3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICBkaXZIZWFkZXJbMF0uc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgfVxuXG4gICAgJC5lYWNoKF9mbkdldFVuaXF1ZVRocyhzZXR0aW5ncywgaGVhZGVyQ29weSksIGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgaWR4ID0gX2ZuVmlzaWJsZVRvQ29sdW1uSW5kZXgoc2V0dGluZ3MsIGkpO1xuICAgICAgZWwuc3R5bGUud2lkdGggPSBzZXR0aW5ncy5hb0NvbHVtbnNbaWR4XS5zV2lkdGg7XG4gICAgfSk7XG5cbiAgICBpZiAoZm9vdGVyKSB7XG4gICAgICBfZm5BcHBseVRvQ2hpbGRyZW4oZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgbi5zdHlsZS53aWR0aCA9IFwiXCI7XG4gICAgICB9LCBmb290ZXJTcmNFbHMpO1xuICAgIH1cblxuICAgIHNhbml0eVdpZHRoID0gdGFibGUub3V0ZXJXaWR0aCgpO1xuXG4gICAgaWYgKHNjcm9sbFggPT09IFwiXCIpIHtcbiAgICAgIHRhYmxlU3R5bGUud2lkdGggPSBcIjEwMCVcIjtcblxuICAgICAgaWYgKGllNjcgJiYgKHRhYmxlLmZpbmQoJ3Rib2R5JykuaGVpZ2h0KCkgPiBkaXZCb2R5RWwub2Zmc2V0SGVpZ2h0IHx8IGRpdkJvZHkuY3NzKCdvdmVyZmxvdy15JykgPT0gXCJzY3JvbGxcIikpIHtcbiAgICAgICAgdGFibGVTdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKHRhYmxlLm91dGVyV2lkdGgoKSAtIGJhcldpZHRoKTtcbiAgICAgIH1cblxuICAgICAgc2FuaXR5V2lkdGggPSB0YWJsZS5vdXRlcldpZHRoKCk7XG4gICAgfSBlbHNlIGlmIChzY3JvbGxYSW5uZXIgIT09IFwiXCIpIHtcbiAgICAgIHRhYmxlU3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0NzcyhzY3JvbGxYSW5uZXIpO1xuICAgICAgc2FuaXR5V2lkdGggPSB0YWJsZS5vdXRlcldpZHRoKCk7XG4gICAgfVxuXG4gICAgX2ZuQXBwbHlUb0NoaWxkcmVuKHplcm9PdXQsIGhlYWRlclNyY0Vscyk7XG5cbiAgICBfZm5BcHBseVRvQ2hpbGRyZW4oZnVuY3Rpb24gKG5TaXplcikge1xuICAgICAgaGVhZGVyQ29udGVudC5wdXNoKG5TaXplci5pbm5lckhUTUwpO1xuICAgICAgaGVhZGVyV2lkdGhzLnB1c2goX2ZuU3RyaW5nVG9Dc3MoJChuU2l6ZXIpLmNzcygnd2lkdGgnKSkpO1xuICAgIH0sIGhlYWRlclNyY0Vscyk7XG5cbiAgICBfZm5BcHBseVRvQ2hpbGRyZW4oZnVuY3Rpb24gKG5Ub1NpemUsIGkpIHtcbiAgICAgIGlmICgkLmluQXJyYXkoblRvU2l6ZSwgZHRIZWFkZXJDZWxscykgIT09IC0xKSB7XG4gICAgICAgIG5Ub1NpemUuc3R5bGUud2lkdGggPSBoZWFkZXJXaWR0aHNbaV07XG4gICAgICB9XG4gICAgfSwgaGVhZGVyVHJnRWxzKTtcblxuICAgICQoaGVhZGVyU3JjRWxzKS5oZWlnaHQoMCk7XG5cbiAgICBpZiAoZm9vdGVyKSB7XG4gICAgICBfZm5BcHBseVRvQ2hpbGRyZW4oemVyb091dCwgZm9vdGVyU3JjRWxzKTtcblxuICAgICAgX2ZuQXBwbHlUb0NoaWxkcmVuKGZ1bmN0aW9uIChuU2l6ZXIpIHtcbiAgICAgICAgZm9vdGVyQ29udGVudC5wdXNoKG5TaXplci5pbm5lckhUTUwpO1xuICAgICAgICBmb290ZXJXaWR0aHMucHVzaChfZm5TdHJpbmdUb0NzcygkKG5TaXplcikuY3NzKCd3aWR0aCcpKSk7XG4gICAgICB9LCBmb290ZXJTcmNFbHMpO1xuXG4gICAgICBfZm5BcHBseVRvQ2hpbGRyZW4oZnVuY3Rpb24gKG5Ub1NpemUsIGkpIHtcbiAgICAgICAgblRvU2l6ZS5zdHlsZS53aWR0aCA9IGZvb3RlcldpZHRoc1tpXTtcbiAgICAgIH0sIGZvb3RlclRyZ0Vscyk7XG5cbiAgICAgICQoZm9vdGVyU3JjRWxzKS5oZWlnaHQoMCk7XG4gICAgfVxuXG4gICAgX2ZuQXBwbHlUb0NoaWxkcmVuKGZ1bmN0aW9uIChuU2l6ZXIsIGkpIHtcbiAgICAgIG5TaXplci5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImRhdGFUYWJsZXNfc2l6aW5nXCI+JyArIGhlYWRlckNvbnRlbnRbaV0gKyAnPC9kaXY+JztcbiAgICAgIG5TaXplci5jaGlsZE5vZGVzWzBdLnN0eWxlLmhlaWdodCA9IFwiMFwiO1xuICAgICAgblNpemVyLmNoaWxkTm9kZXNbMF0uc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgblNpemVyLnN0eWxlLndpZHRoID0gaGVhZGVyV2lkdGhzW2ldO1xuICAgIH0sIGhlYWRlclNyY0Vscyk7XG5cbiAgICBpZiAoZm9vdGVyKSB7XG4gICAgICBfZm5BcHBseVRvQ2hpbGRyZW4oZnVuY3Rpb24gKG5TaXplciwgaSkge1xuICAgICAgICBuU2l6ZXIuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJkYXRhVGFibGVzX3NpemluZ1wiPicgKyBmb290ZXJDb250ZW50W2ldICsgJzwvZGl2Pic7XG4gICAgICAgIG5TaXplci5jaGlsZE5vZGVzWzBdLnN0eWxlLmhlaWdodCA9IFwiMFwiO1xuICAgICAgICBuU2l6ZXIuY2hpbGROb2Rlc1swXS5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgIG5TaXplci5zdHlsZS53aWR0aCA9IGZvb3RlcldpZHRoc1tpXTtcbiAgICAgIH0sIGZvb3RlclNyY0Vscyk7XG4gICAgfVxuXG4gICAgaWYgKHRhYmxlLm91dGVyV2lkdGgoKSA8IHNhbml0eVdpZHRoKSB7XG4gICAgICBjb3JyZWN0aW9uID0gZGl2Qm9keUVsLnNjcm9sbEhlaWdodCA+IGRpdkJvZHlFbC5vZmZzZXRIZWlnaHQgfHwgZGl2Qm9keS5jc3MoJ292ZXJmbG93LXknKSA9PSBcInNjcm9sbFwiID8gc2FuaXR5V2lkdGggKyBiYXJXaWR0aCA6IHNhbml0eVdpZHRoO1xuXG4gICAgICBpZiAoaWU2NyAmJiAoZGl2Qm9keUVsLnNjcm9sbEhlaWdodCA+IGRpdkJvZHlFbC5vZmZzZXRIZWlnaHQgfHwgZGl2Qm9keS5jc3MoJ292ZXJmbG93LXknKSA9PSBcInNjcm9sbFwiKSkge1xuICAgICAgICB0YWJsZVN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoY29ycmVjdGlvbiAtIGJhcldpZHRoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNjcm9sbFggPT09IFwiXCIgfHwgc2Nyb2xsWElubmVyICE9PSBcIlwiKSB7XG4gICAgICAgIF9mbkxvZyhzZXR0aW5ncywgMSwgJ1Bvc3NpYmxlIGNvbHVtbiBtaXNhbGlnbm1lbnQnLCA2KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29ycmVjdGlvbiA9ICcxMDAlJztcbiAgICB9XG5cbiAgICBkaXZCb2R5U3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0Nzcyhjb3JyZWN0aW9uKTtcbiAgICBkaXZIZWFkZXJTdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKGNvcnJlY3Rpb24pO1xuXG4gICAgaWYgKGZvb3Rlcikge1xuICAgICAgc2V0dGluZ3MublNjcm9sbEZvb3Quc3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0Nzcyhjb3JyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAoIXNjcm9sbFkpIHtcbiAgICAgIGlmIChpZTY3KSB7XG4gICAgICAgIGRpdkJvZHlTdHlsZS5oZWlnaHQgPSBfZm5TdHJpbmdUb0Nzcyh0YWJsZUVsLm9mZnNldEhlaWdodCArIGJhcldpZHRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaU91dGVyV2lkdGggPSB0YWJsZS5vdXRlcldpZHRoKCk7XG4gICAgZGl2SGVhZGVyVGFibGVbMF0uc3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0NzcyhpT3V0ZXJXaWR0aCk7XG4gICAgZGl2SGVhZGVySW5uZXJTdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKGlPdXRlcldpZHRoKTtcbiAgICB2YXIgYlNjcm9sbGluZyA9IHRhYmxlLmhlaWdodCgpID4gZGl2Qm9keUVsLmNsaWVudEhlaWdodCB8fCBkaXZCb2R5LmNzcygnb3ZlcmZsb3cteScpID09IFwic2Nyb2xsXCI7XG4gICAgdmFyIHBhZGRpbmcgPSAncGFkZGluZycgKyAoYnJvd3Nlci5iU2Nyb2xsYmFyTGVmdCA/ICdMZWZ0JyA6ICdSaWdodCcpO1xuICAgIGRpdkhlYWRlcklubmVyU3R5bGVbcGFkZGluZ10gPSBiU2Nyb2xsaW5nID8gYmFyV2lkdGggKyBcInB4XCIgOiBcIjBweFwiO1xuXG4gICAgaWYgKGZvb3Rlcikge1xuICAgICAgZGl2Rm9vdGVyVGFibGVbMF0uc3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0NzcyhpT3V0ZXJXaWR0aCk7XG4gICAgICBkaXZGb290ZXJJbm5lclswXS5zdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKGlPdXRlcldpZHRoKTtcbiAgICAgIGRpdkZvb3RlcklubmVyWzBdLnN0eWxlW3BhZGRpbmddID0gYlNjcm9sbGluZyA/IGJhcldpZHRoICsgXCJweFwiIDogXCIwcHhcIjtcbiAgICB9XG5cbiAgICB0YWJsZS5jaGlsZHJlbignY29sZ3JvdXAnKS5pbnNlcnRCZWZvcmUodGFibGUuY2hpbGRyZW4oJ3RoZWFkJykpO1xuICAgIGRpdkJvZHkuc2Nyb2xsKCk7XG5cbiAgICBpZiAoKHNldHRpbmdzLmJTb3J0ZWQgfHwgc2V0dGluZ3MuYkZpbHRlcmVkKSAmJiAhc2V0dGluZ3MuX2RyYXdIb2xkKSB7XG4gICAgICBkaXZCb2R5RWwuc2Nyb2xsVG9wID0gMDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5BcHBseVRvQ2hpbGRyZW4oZm4sIGFuMSwgYW4yKSB7XG4gICAgdmFyIGluZGV4ID0gMCxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIGlMZW4gPSBhbjEubGVuZ3RoO1xuICAgIHZhciBuTm9kZTEsIG5Ob2RlMjtcblxuICAgIHdoaWxlIChpIDwgaUxlbikge1xuICAgICAgbk5vZGUxID0gYW4xW2ldLmZpcnN0Q2hpbGQ7XG4gICAgICBuTm9kZTIgPSBhbjIgPyBhbjJbaV0uZmlyc3RDaGlsZCA6IG51bGw7XG5cbiAgICAgIHdoaWxlIChuTm9kZTEpIHtcbiAgICAgICAgaWYgKG5Ob2RlMS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgIGlmIChhbjIpIHtcbiAgICAgICAgICAgIGZuKG5Ob2RlMSwgbk5vZGUyLCBpbmRleCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZuKG5Ob2RlMSwgaW5kZXgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgIH1cblxuICAgICAgICBuTm9kZTEgPSBuTm9kZTEubmV4dFNpYmxpbmc7XG4gICAgICAgIG5Ob2RlMiA9IGFuMiA/IG5Ob2RlMi5uZXh0U2libGluZyA6IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGkrKztcbiAgICB9XG4gIH1cblxuICB2YXIgX19yZV9odG1sX3JlbW92ZSA9IC88Lio/Pi9nO1xuXG4gIGZ1bmN0aW9uIF9mbkNhbGN1bGF0ZUNvbHVtbldpZHRocyhvU2V0dGluZ3MpIHtcbiAgICB2YXIgdGFibGUgPSBvU2V0dGluZ3MublRhYmxlLFxuICAgICAgICBjb2x1bW5zID0gb1NldHRpbmdzLmFvQ29sdW1ucyxcbiAgICAgICAgc2Nyb2xsID0gb1NldHRpbmdzLm9TY3JvbGwsXG4gICAgICAgIHNjcm9sbFkgPSBzY3JvbGwuc1ksXG4gICAgICAgIHNjcm9sbFggPSBzY3JvbGwuc1gsXG4gICAgICAgIHNjcm9sbFhJbm5lciA9IHNjcm9sbC5zWElubmVyLFxuICAgICAgICBjb2x1bW5Db3VudCA9IGNvbHVtbnMubGVuZ3RoLFxuICAgICAgICB2aXNpYmxlQ29sdW1ucyA9IF9mbkdldENvbHVtbnMob1NldHRpbmdzLCAnYlZpc2libGUnKSxcbiAgICAgICAgaGVhZGVyQ2VsbHMgPSAkKCd0aCcsIG9TZXR0aW5ncy5uVEhlYWQpLFxuICAgICAgICB0YWJsZVdpZHRoQXR0ciA9IHRhYmxlLmdldEF0dHJpYnV0ZSgnd2lkdGgnKSxcbiAgICAgICAgdGFibGVDb250YWluZXIgPSB0YWJsZS5wYXJlbnROb2RlLFxuICAgICAgICB1c2VySW5wdXRzID0gZmFsc2UsXG4gICAgICAgIGksXG4gICAgICAgIGNvbHVtbixcbiAgICAgICAgY29sdW1uSWR4LFxuICAgICAgICB3aWR0aCxcbiAgICAgICAgb3V0ZXJXaWR0aCxcbiAgICAgICAgYnJvd3NlciA9IG9TZXR0aW5ncy5vQnJvd3NlcixcbiAgICAgICAgaWU2NyA9IGJyb3dzZXIuYlNjcm9sbE92ZXJzaXplO1xuXG4gICAgdmFyIHN0eWxlV2lkdGggPSB0YWJsZS5zdHlsZS53aWR0aDtcblxuICAgIGlmIChzdHlsZVdpZHRoICYmIHN0eWxlV2lkdGguaW5kZXhPZignJScpICE9PSAtMSkge1xuICAgICAgdGFibGVXaWR0aEF0dHIgPSBzdHlsZVdpZHRoO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCB2aXNpYmxlQ29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29sdW1uID0gY29sdW1uc1t2aXNpYmxlQ29sdW1uc1tpXV07XG5cbiAgICAgIGlmIChjb2x1bW4uc1dpZHRoICE9PSBudWxsKSB7XG4gICAgICAgIGNvbHVtbi5zV2lkdGggPSBfZm5Db252ZXJ0VG9XaWR0aChjb2x1bW4uc1dpZHRoT3JpZywgdGFibGVDb250YWluZXIpO1xuICAgICAgICB1c2VySW5wdXRzID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaWU2NyB8fCAhdXNlcklucHV0cyAmJiAhc2Nyb2xsWCAmJiAhc2Nyb2xsWSAmJiBjb2x1bW5Db3VudCA9PSBfZm5WaXNibGVDb2x1bW5zKG9TZXR0aW5ncykgJiYgY29sdW1uQ291bnQgPT0gaGVhZGVyQ2VsbHMubGVuZ3RoKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgY29sdW1uQ291bnQ7IGkrKykge1xuICAgICAgICB2YXIgY29sSWR4ID0gX2ZuVmlzaWJsZVRvQ29sdW1uSW5kZXgob1NldHRpbmdzLCBpKTtcblxuICAgICAgICBpZiAoY29sSWR4ICE9PSBudWxsKSB7XG4gICAgICAgICAgY29sdW1uc1tjb2xJZHhdLnNXaWR0aCA9IF9mblN0cmluZ1RvQ3NzKGhlYWRlckNlbGxzLmVxKGkpLndpZHRoKCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB0bXBUYWJsZSA9ICQodGFibGUpLmNsb25lKCkuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpLnJlbW92ZUF0dHIoJ2lkJyk7XG4gICAgICB0bXBUYWJsZS5maW5kKCd0Ym9keSB0cicpLnJlbW92ZSgpO1xuICAgICAgdmFyIHRyID0gJCgnPHRyLz4nKS5hcHBlbmRUbyh0bXBUYWJsZS5maW5kKCd0Ym9keScpKTtcbiAgICAgIHRtcFRhYmxlLmZpbmQoJ3RoZWFkLCB0Zm9vdCcpLnJlbW92ZSgpO1xuICAgICAgdG1wVGFibGUuYXBwZW5kKCQob1NldHRpbmdzLm5USGVhZCkuY2xvbmUoKSkuYXBwZW5kKCQob1NldHRpbmdzLm5URm9vdCkuY2xvbmUoKSk7XG4gICAgICB0bXBUYWJsZS5maW5kKCd0Zm9vdCB0aCwgdGZvb3QgdGQnKS5jc3MoJ3dpZHRoJywgJycpO1xuICAgICAgaGVhZGVyQ2VsbHMgPSBfZm5HZXRVbmlxdWVUaHMob1NldHRpbmdzLCB0bXBUYWJsZS5maW5kKCd0aGVhZCcpWzBdKTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IHZpc2libGVDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbHVtbiA9IGNvbHVtbnNbdmlzaWJsZUNvbHVtbnNbaV1dO1xuICAgICAgICBoZWFkZXJDZWxsc1tpXS5zdHlsZS53aWR0aCA9IGNvbHVtbi5zV2lkdGhPcmlnICE9PSBudWxsICYmIGNvbHVtbi5zV2lkdGhPcmlnICE9PSAnJyA/IF9mblN0cmluZ1RvQ3NzKGNvbHVtbi5zV2lkdGhPcmlnKSA6ICcnO1xuXG4gICAgICAgIGlmIChjb2x1bW4uc1dpZHRoT3JpZyAmJiBzY3JvbGxYKSB7XG4gICAgICAgICAgJChoZWFkZXJDZWxsc1tpXSkuYXBwZW5kKCQoJzxkaXYvPicpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogY29sdW1uLnNXaWR0aE9yaWcsXG4gICAgICAgICAgICBtYXJnaW46IDAsXG4gICAgICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAgICAgYm9yZGVyOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAxXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvU2V0dGluZ3MuYW9EYXRhLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdmlzaWJsZUNvbHVtbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb2x1bW5JZHggPSB2aXNpYmxlQ29sdW1uc1tpXTtcbiAgICAgICAgICBjb2x1bW4gPSBjb2x1bW5zW2NvbHVtbklkeF07XG4gICAgICAgICAgJChfZm5HZXRXaWRlc3ROb2RlKG9TZXR0aW5ncywgY29sdW1uSWR4KSkuY2xvbmUoZmFsc2UpLmFwcGVuZChjb2x1bW4uc0NvbnRlbnRQYWRkaW5nKS5hcHBlbmRUbyh0cik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJCgnW25hbWVdJywgdG1wVGFibGUpLnJlbW92ZUF0dHIoJ25hbWUnKTtcbiAgICAgIHZhciBob2xkZXIgPSAkKCc8ZGl2Lz4nKS5jc3Moc2Nyb2xsWCB8fCBzY3JvbGxZID8ge1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICBoZWlnaHQ6IDEsXG4gICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgICAgIH0gOiB7fSkuYXBwZW5kKHRtcFRhYmxlKS5hcHBlbmRUbyh0YWJsZUNvbnRhaW5lcik7XG5cbiAgICAgIGlmIChzY3JvbGxYICYmIHNjcm9sbFhJbm5lcikge1xuICAgICAgICB0bXBUYWJsZS53aWR0aChzY3JvbGxYSW5uZXIpO1xuICAgICAgfSBlbHNlIGlmIChzY3JvbGxYKSB7XG4gICAgICAgIHRtcFRhYmxlLmNzcygnd2lkdGgnLCAnYXV0bycpO1xuICAgICAgICB0bXBUYWJsZS5yZW1vdmVBdHRyKCd3aWR0aCcpO1xuXG4gICAgICAgIGlmICh0bXBUYWJsZS53aWR0aCgpIDwgdGFibGVDb250YWluZXIuY2xpZW50V2lkdGggJiYgdGFibGVXaWR0aEF0dHIpIHtcbiAgICAgICAgICB0bXBUYWJsZS53aWR0aCh0YWJsZUNvbnRhaW5lci5jbGllbnRXaWR0aCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsWSkge1xuICAgICAgICB0bXBUYWJsZS53aWR0aCh0YWJsZUNvbnRhaW5lci5jbGllbnRXaWR0aCk7XG4gICAgICB9IGVsc2UgaWYgKHRhYmxlV2lkdGhBdHRyKSB7XG4gICAgICAgIHRtcFRhYmxlLndpZHRoKHRhYmxlV2lkdGhBdHRyKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRvdGFsID0gMDtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IHZpc2libGVDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjZWxsID0gJChoZWFkZXJDZWxsc1tpXSk7XG4gICAgICAgIHZhciBib3JkZXIgPSBjZWxsLm91dGVyV2lkdGgoKSAtIGNlbGwud2lkdGgoKTtcbiAgICAgICAgdmFyIGJvdW5kaW5nID0gYnJvd3Nlci5iQm91bmRpbmcgPyBNYXRoLmNlaWwoaGVhZGVyQ2VsbHNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgpIDogY2VsbC5vdXRlcldpZHRoKCk7XG4gICAgICAgIHRvdGFsICs9IGJvdW5kaW5nO1xuICAgICAgICBjb2x1bW5zW3Zpc2libGVDb2x1bW5zW2ldXS5zV2lkdGggPSBfZm5TdHJpbmdUb0Nzcyhib3VuZGluZyAtIGJvcmRlcik7XG4gICAgICB9XG5cbiAgICAgIHRhYmxlLnN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3ModG90YWwpO1xuICAgICAgaG9sZGVyLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIGlmICh0YWJsZVdpZHRoQXR0cikge1xuICAgICAgdGFibGUuc3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0Nzcyh0YWJsZVdpZHRoQXR0cik7XG4gICAgfVxuXG4gICAgaWYgKCh0YWJsZVdpZHRoQXR0ciB8fCBzY3JvbGxYKSAmJiAhb1NldHRpbmdzLl9yZXN6RXZ0KSB7XG4gICAgICB2YXIgYmluZFJlc2l6ZSA9IGZ1bmN0aW9uIGJpbmRSZXNpemUoKSB7XG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplLkRULScgKyBvU2V0dGluZ3Muc0luc3RhbmNlLCBfZm5UaHJvdHRsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX2ZuQWRqdXN0Q29sdW1uU2l6aW5nKG9TZXR0aW5ncyk7XG4gICAgICAgIH0pKTtcbiAgICAgIH07XG5cbiAgICAgIGlmIChpZTY3KSB7XG4gICAgICAgIHNldFRpbWVvdXQoYmluZFJlc2l6ZSwgMTAwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiaW5kUmVzaXplKCk7XG4gICAgICB9XG5cbiAgICAgIG9TZXR0aW5ncy5fcmVzekV2dCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgdmFyIF9mblRocm90dGxlID0gRGF0YVRhYmxlLnV0aWwudGhyb3R0bGU7XG5cbiAgZnVuY3Rpb24gX2ZuQ29udmVydFRvV2lkdGgod2lkdGgsIHBhcmVudCkge1xuICAgIGlmICghd2lkdGgpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHZhciBuID0gJCgnPGRpdi8+JykuY3NzKCd3aWR0aCcsIF9mblN0cmluZ1RvQ3NzKHdpZHRoKSkuYXBwZW5kVG8ocGFyZW50IHx8IGRvY3VtZW50LmJvZHkpO1xuICAgIHZhciB2YWwgPSBuWzBdLm9mZnNldFdpZHRoO1xuICAgIG4ucmVtb3ZlKCk7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkdldFdpZGVzdE5vZGUoc2V0dGluZ3MsIGNvbElkeCkge1xuICAgIHZhciBpZHggPSBfZm5HZXRNYXhMZW5TdHJpbmcoc2V0dGluZ3MsIGNvbElkeCk7XG5cbiAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGRhdGEgPSBzZXR0aW5ncy5hb0RhdGFbaWR4XTtcbiAgICByZXR1cm4gIWRhdGEublRyID8gJCgnPHRkLz4nKS5odG1sKF9mbkdldENlbGxEYXRhKHNldHRpbmdzLCBpZHgsIGNvbElkeCwgJ2Rpc3BsYXknKSlbMF0gOiBkYXRhLmFuQ2VsbHNbY29sSWR4XTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkdldE1heExlblN0cmluZyhzZXR0aW5ncywgY29sSWR4KSB7XG4gICAgdmFyIHMsXG4gICAgICAgIG1heCA9IC0xLFxuICAgICAgICBtYXhJZHggPSAtMTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBzZXR0aW5ncy5hb0RhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIHMgPSBfZm5HZXRDZWxsRGF0YShzZXR0aW5ncywgaSwgY29sSWR4LCAnZGlzcGxheScpICsgJyc7XG4gICAgICBzID0gcy5yZXBsYWNlKF9fcmVfaHRtbF9yZW1vdmUsICcnKTtcbiAgICAgIHMgPSBzLnJlcGxhY2UoLyZuYnNwOy9nLCAnICcpO1xuXG4gICAgICBpZiAocy5sZW5ndGggPiBtYXgpIHtcbiAgICAgICAgbWF4ID0gcy5sZW5ndGg7XG4gICAgICAgIG1heElkeCA9IGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1heElkeDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblN0cmluZ1RvQ3NzKHMpIHtcbiAgICBpZiAocyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuICcwcHgnO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcyA9PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHMgPCAwID8gJzBweCcgOiBzICsgJ3B4JztcbiAgICB9XG5cbiAgICByZXR1cm4gcy5tYXRjaCgvXFxkJC8pID8gcyArICdweCcgOiBzO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU29ydEZsYXR0ZW4oc2V0dGluZ3MpIHtcbiAgICB2YXIgaSxcbiAgICAgICAgaUxlbixcbiAgICAgICAgayxcbiAgICAgICAga0xlbixcbiAgICAgICAgYVNvcnQgPSBbXSxcbiAgICAgICAgYWlPcmlnID0gW10sXG4gICAgICAgIGFvQ29sdW1ucyA9IHNldHRpbmdzLmFvQ29sdW1ucyxcbiAgICAgICAgYURhdGFTb3J0LFxuICAgICAgICBpQ29sLFxuICAgICAgICBzVHlwZSxcbiAgICAgICAgc3JjQ29sLFxuICAgICAgICBmaXhlZCA9IHNldHRpbmdzLmFhU29ydGluZ0ZpeGVkLFxuICAgICAgICBmaXhlZE9iaiA9ICQuaXNQbGFpbk9iamVjdChmaXhlZCksXG4gICAgICAgIG5lc3RlZFNvcnQgPSBbXSxcbiAgICAgICAgYWRkID0gZnVuY3Rpb24gYWRkKGEpIHtcbiAgICAgIGlmIChhLmxlbmd0aCAmJiAhJC5pc0FycmF5KGFbMF0pKSB7XG4gICAgICAgIG5lc3RlZFNvcnQucHVzaChhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQubWVyZ2UobmVzdGVkU29ydCwgYSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICgkLmlzQXJyYXkoZml4ZWQpKSB7XG4gICAgICBhZGQoZml4ZWQpO1xuICAgIH1cblxuICAgIGlmIChmaXhlZE9iaiAmJiBmaXhlZC5wcmUpIHtcbiAgICAgIGFkZChmaXhlZC5wcmUpO1xuICAgIH1cblxuICAgIGFkZChzZXR0aW5ncy5hYVNvcnRpbmcpO1xuXG4gICAgaWYgKGZpeGVkT2JqICYmIGZpeGVkLnBvc3QpIHtcbiAgICAgIGFkZChmaXhlZC5wb3N0KTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbmVzdGVkU29ydC5sZW5ndGg7IGkrKykge1xuICAgICAgc3JjQ29sID0gbmVzdGVkU29ydFtpXVswXTtcbiAgICAgIGFEYXRhU29ydCA9IGFvQ29sdW1uc1tzcmNDb2xdLmFEYXRhU29ydDtcblxuICAgICAgZm9yIChrID0gMCwga0xlbiA9IGFEYXRhU29ydC5sZW5ndGg7IGsgPCBrTGVuOyBrKyspIHtcbiAgICAgICAgaUNvbCA9IGFEYXRhU29ydFtrXTtcbiAgICAgICAgc1R5cGUgPSBhb0NvbHVtbnNbaUNvbF0uc1R5cGUgfHwgJ3N0cmluZyc7XG5cbiAgICAgICAgaWYgKG5lc3RlZFNvcnRbaV0uX2lkeCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbmVzdGVkU29ydFtpXS5faWR4ID0gJC5pbkFycmF5KG5lc3RlZFNvcnRbaV1bMV0sIGFvQ29sdW1uc1tpQ29sXS5hc1NvcnRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgYVNvcnQucHVzaCh7XG4gICAgICAgICAgc3JjOiBzcmNDb2wsXG4gICAgICAgICAgY29sOiBpQ29sLFxuICAgICAgICAgIGRpcjogbmVzdGVkU29ydFtpXVsxXSxcbiAgICAgICAgICBpbmRleDogbmVzdGVkU29ydFtpXS5faWR4LFxuICAgICAgICAgIHR5cGU6IHNUeXBlLFxuICAgICAgICAgIGZvcm1hdHRlcjogRGF0YVRhYmxlLmV4dC50eXBlLm9yZGVyW3NUeXBlICsgXCItcHJlXCJdXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhU29ydDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNvcnQob1NldHRpbmdzKSB7XG4gICAgdmFyIGksXG4gICAgICAgIGllbixcbiAgICAgICAgaUxlbixcbiAgICAgICAgaixcbiAgICAgICAgakxlbixcbiAgICAgICAgayxcbiAgICAgICAga0xlbixcbiAgICAgICAgc0RhdGFUeXBlLFxuICAgICAgICBuVGgsXG4gICAgICAgIGFpT3JpZyA9IFtdLFxuICAgICAgICBvRXh0U29ydCA9IERhdGFUYWJsZS5leHQudHlwZS5vcmRlcixcbiAgICAgICAgYW9EYXRhID0gb1NldHRpbmdzLmFvRGF0YSxcbiAgICAgICAgYW9Db2x1bW5zID0gb1NldHRpbmdzLmFvQ29sdW1ucyxcbiAgICAgICAgYURhdGFTb3J0LFxuICAgICAgICBkYXRhLFxuICAgICAgICBpQ29sLFxuICAgICAgICBzVHlwZSxcbiAgICAgICAgb1NvcnQsXG4gICAgICAgIGZvcm1hdHRlcnMgPSAwLFxuICAgICAgICBzb3J0Q29sLFxuICAgICAgICBkaXNwbGF5TWFzdGVyID0gb1NldHRpbmdzLmFpRGlzcGxheU1hc3RlcixcbiAgICAgICAgYVNvcnQ7XG5cbiAgICBfZm5Db2x1bW5UeXBlcyhvU2V0dGluZ3MpO1xuXG4gICAgYVNvcnQgPSBfZm5Tb3J0RmxhdHRlbihvU2V0dGluZ3MpO1xuXG4gICAgZm9yIChpID0gMCwgaWVuID0gYVNvcnQubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIHNvcnRDb2wgPSBhU29ydFtpXTtcblxuICAgICAgaWYgKHNvcnRDb2wuZm9ybWF0dGVyKSB7XG4gICAgICAgIGZvcm1hdHRlcnMrKztcbiAgICAgIH1cblxuICAgICAgX2ZuU29ydERhdGEob1NldHRpbmdzLCBzb3J0Q29sLmNvbCk7XG4gICAgfVxuXG4gICAgaWYgKF9mbkRhdGFTb3VyY2Uob1NldHRpbmdzKSAhPSAnc3NwJyAmJiBhU29ydC5sZW5ndGggIT09IDApIHtcbiAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBkaXNwbGF5TWFzdGVyLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICBhaU9yaWdbZGlzcGxheU1hc3RlcltpXV0gPSBpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZm9ybWF0dGVycyA9PT0gYVNvcnQubGVuZ3RoKSB7XG4gICAgICAgIGRpc3BsYXlNYXN0ZXIuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgIHZhciB4LFxuICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICBrLFxuICAgICAgICAgICAgICB0ZXN0LFxuICAgICAgICAgICAgICBzb3J0LFxuICAgICAgICAgICAgICBsZW4gPSBhU29ydC5sZW5ndGgsXG4gICAgICAgICAgICAgIGRhdGFBID0gYW9EYXRhW2FdLl9hU29ydERhdGEsXG4gICAgICAgICAgICAgIGRhdGFCID0gYW9EYXRhW2JdLl9hU29ydERhdGE7XG5cbiAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgbGVuOyBrKyspIHtcbiAgICAgICAgICAgIHNvcnQgPSBhU29ydFtrXTtcbiAgICAgICAgICAgIHggPSBkYXRhQVtzb3J0LmNvbF07XG4gICAgICAgICAgICB5ID0gZGF0YUJbc29ydC5jb2xdO1xuICAgICAgICAgICAgdGVzdCA9IHggPCB5ID8gLTEgOiB4ID4geSA/IDEgOiAwO1xuXG4gICAgICAgICAgICBpZiAodGVzdCAhPT0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gc29ydC5kaXIgPT09ICdhc2MnID8gdGVzdCA6IC10ZXN0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHggPSBhaU9yaWdbYV07XG4gICAgICAgICAgeSA9IGFpT3JpZ1tiXTtcbiAgICAgICAgICByZXR1cm4geCA8IHkgPyAtMSA6IHggPiB5ID8gMSA6IDA7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzcGxheU1hc3Rlci5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgdmFyIHgsXG4gICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgIGssXG4gICAgICAgICAgICAgIGwsXG4gICAgICAgICAgICAgIHRlc3QsXG4gICAgICAgICAgICAgIHNvcnQsXG4gICAgICAgICAgICAgIGZuLFxuICAgICAgICAgICAgICBsZW4gPSBhU29ydC5sZW5ndGgsXG4gICAgICAgICAgICAgIGRhdGFBID0gYW9EYXRhW2FdLl9hU29ydERhdGEsXG4gICAgICAgICAgICAgIGRhdGFCID0gYW9EYXRhW2JdLl9hU29ydERhdGE7XG5cbiAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgbGVuOyBrKyspIHtcbiAgICAgICAgICAgIHNvcnQgPSBhU29ydFtrXTtcbiAgICAgICAgICAgIHggPSBkYXRhQVtzb3J0LmNvbF07XG4gICAgICAgICAgICB5ID0gZGF0YUJbc29ydC5jb2xdO1xuICAgICAgICAgICAgZm4gPSBvRXh0U29ydFtzb3J0LnR5cGUgKyBcIi1cIiArIHNvcnQuZGlyXSB8fCBvRXh0U29ydFtcInN0cmluZy1cIiArIHNvcnQuZGlyXTtcbiAgICAgICAgICAgIHRlc3QgPSBmbih4LCB5KTtcblxuICAgICAgICAgICAgaWYgKHRlc3QgIT09IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRlc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgeCA9IGFpT3JpZ1thXTtcbiAgICAgICAgICB5ID0gYWlPcmlnW2JdO1xuICAgICAgICAgIHJldHVybiB4IDwgeSA/IC0xIDogeCA+IHkgPyAxIDogMDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgb1NldHRpbmdzLmJTb3J0ZWQgPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU29ydEFyaWEoc2V0dGluZ3MpIHtcbiAgICB2YXIgbGFiZWw7XG4gICAgdmFyIG5leHRTb3J0O1xuICAgIHZhciBjb2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zO1xuXG4gICAgdmFyIGFTb3J0ID0gX2ZuU29ydEZsYXR0ZW4oc2V0dGluZ3MpO1xuXG4gICAgdmFyIG9BcmlhID0gc2V0dGluZ3Mub0xhbmd1YWdlLm9BcmlhO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSBjb2x1bW5zLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgdmFyIGNvbCA9IGNvbHVtbnNbaV07XG4gICAgICB2YXIgYXNTb3J0aW5nID0gY29sLmFzU29ydGluZztcbiAgICAgIHZhciBzVGl0bGUgPSBjb2wuc1RpdGxlLnJlcGxhY2UoLzwuKj8+L2csIFwiXCIpO1xuICAgICAgdmFyIHRoID0gY29sLm5UaDtcbiAgICAgIHRoLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1zb3J0Jyk7XG5cbiAgICAgIGlmIChjb2wuYlNvcnRhYmxlKSB7XG4gICAgICAgIGlmIChhU29ydC5sZW5ndGggPiAwICYmIGFTb3J0WzBdLmNvbCA9PSBpKSB7XG4gICAgICAgICAgdGguc2V0QXR0cmlidXRlKCdhcmlhLXNvcnQnLCBhU29ydFswXS5kaXIgPT0gXCJhc2NcIiA/IFwiYXNjZW5kaW5nXCIgOiBcImRlc2NlbmRpbmdcIik7XG4gICAgICAgICAgbmV4dFNvcnQgPSBhc1NvcnRpbmdbYVNvcnRbMF0uaW5kZXggKyAxXSB8fCBhc1NvcnRpbmdbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV4dFNvcnQgPSBhc1NvcnRpbmdbMF07XG4gICAgICAgIH1cblxuICAgICAgICBsYWJlbCA9IHNUaXRsZSArIChuZXh0U29ydCA9PT0gXCJhc2NcIiA/IG9BcmlhLnNTb3J0QXNjZW5kaW5nIDogb0FyaWEuc1NvcnREZXNjZW5kaW5nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxhYmVsID0gc1RpdGxlO1xuICAgICAgfVxuXG4gICAgICB0aC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBsYWJlbCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU29ydExpc3RlbmVyKHNldHRpbmdzLCBjb2xJZHgsIGFwcGVuZCwgY2FsbGJhY2spIHtcbiAgICB2YXIgY29sID0gc2V0dGluZ3MuYW9Db2x1bW5zW2NvbElkeF07XG4gICAgdmFyIHNvcnRpbmcgPSBzZXR0aW5ncy5hYVNvcnRpbmc7XG4gICAgdmFyIGFzU29ydGluZyA9IGNvbC5hc1NvcnRpbmc7XG4gICAgdmFyIG5leHRTb3J0SWR4O1xuXG4gICAgdmFyIG5leHQgPSBmdW5jdGlvbiBuZXh0KGEsIG92ZXJmbG93KSB7XG4gICAgICB2YXIgaWR4ID0gYS5faWR4O1xuXG4gICAgICBpZiAoaWR4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWR4ID0gJC5pbkFycmF5KGFbMV0sIGFzU29ydGluZyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpZHggKyAxIDwgYXNTb3J0aW5nLmxlbmd0aCA/IGlkeCArIDEgOiBvdmVyZmxvdyA/IG51bGwgOiAwO1xuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIHNvcnRpbmdbMF0gPT09ICdudW1iZXInKSB7XG4gICAgICBzb3J0aW5nID0gc2V0dGluZ3MuYWFTb3J0aW5nID0gW3NvcnRpbmddO1xuICAgIH1cblxuICAgIGlmIChhcHBlbmQgJiYgc2V0dGluZ3Mub0ZlYXR1cmVzLmJTb3J0TXVsdGkpIHtcbiAgICAgIHZhciBzb3J0SWR4ID0gJC5pbkFycmF5KGNvbElkeCwgX3BsdWNrKHNvcnRpbmcsICcwJykpO1xuXG4gICAgICBpZiAoc29ydElkeCAhPT0gLTEpIHtcbiAgICAgICAgbmV4dFNvcnRJZHggPSBuZXh0KHNvcnRpbmdbc29ydElkeF0sIHRydWUpO1xuXG4gICAgICAgIGlmIChuZXh0U29ydElkeCA9PT0gbnVsbCAmJiBzb3J0aW5nLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIG5leHRTb3J0SWR4ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXh0U29ydElkeCA9PT0gbnVsbCkge1xuICAgICAgICAgIHNvcnRpbmcuc3BsaWNlKHNvcnRJZHgsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNvcnRpbmdbc29ydElkeF1bMV0gPSBhc1NvcnRpbmdbbmV4dFNvcnRJZHhdO1xuICAgICAgICAgIHNvcnRpbmdbc29ydElkeF0uX2lkeCA9IG5leHRTb3J0SWR4O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzb3J0aW5nLnB1c2goW2NvbElkeCwgYXNTb3J0aW5nWzBdLCAwXSk7XG4gICAgICAgIHNvcnRpbmdbc29ydGluZy5sZW5ndGggLSAxXS5faWR4ID0gMDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNvcnRpbmcubGVuZ3RoICYmIHNvcnRpbmdbMF1bMF0gPT0gY29sSWR4KSB7XG4gICAgICBuZXh0U29ydElkeCA9IG5leHQoc29ydGluZ1swXSk7XG4gICAgICBzb3J0aW5nLmxlbmd0aCA9IDE7XG4gICAgICBzb3J0aW5nWzBdWzFdID0gYXNTb3J0aW5nW25leHRTb3J0SWR4XTtcbiAgICAgIHNvcnRpbmdbMF0uX2lkeCA9IG5leHRTb3J0SWR4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzb3J0aW5nLmxlbmd0aCA9IDA7XG4gICAgICBzb3J0aW5nLnB1c2goW2NvbElkeCwgYXNTb3J0aW5nWzBdXSk7XG4gICAgICBzb3J0aW5nWzBdLl9pZHggPSAwO1xuICAgIH1cblxuICAgIF9mblJlRHJhdyhzZXR0aW5ncyk7XG5cbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrKHNldHRpbmdzKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Tb3J0QXR0YWNoTGlzdGVuZXIoc2V0dGluZ3MsIGF0dGFjaFRvLCBjb2xJZHgsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGNvbCA9IHNldHRpbmdzLmFvQ29sdW1uc1tjb2xJZHhdO1xuXG4gICAgX2ZuQmluZEFjdGlvbihhdHRhY2hUbywge30sIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoY29sLmJTb3J0YWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0dGluZ3Mub0ZlYXR1cmVzLmJQcm9jZXNzaW5nKSB7XG4gICAgICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KHNldHRpbmdzLCB0cnVlKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfZm5Tb3J0TGlzdGVuZXIoc2V0dGluZ3MsIGNvbElkeCwgZS5zaGlmdEtleSwgY2FsbGJhY2spO1xuXG4gICAgICAgICAgaWYgKF9mbkRhdGFTb3VyY2Uoc2V0dGluZ3MpICE9PSAnc3NwJykge1xuICAgICAgICAgICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkoc2V0dGluZ3MsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2ZuU29ydExpc3RlbmVyKHNldHRpbmdzLCBjb2xJZHgsIGUuc2hpZnRLZXksIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNvcnRpbmdDbGFzc2VzKHNldHRpbmdzKSB7XG4gICAgdmFyIG9sZFNvcnQgPSBzZXR0aW5ncy5hTGFzdFNvcnQ7XG4gICAgdmFyIHNvcnRDbGFzcyA9IHNldHRpbmdzLm9DbGFzc2VzLnNTb3J0Q29sdW1uO1xuXG4gICAgdmFyIHNvcnQgPSBfZm5Tb3J0RmxhdHRlbihzZXR0aW5ncyk7XG5cbiAgICB2YXIgZmVhdHVyZXMgPSBzZXR0aW5ncy5vRmVhdHVyZXM7XG4gICAgdmFyIGksIGllbiwgY29sSWR4O1xuXG4gICAgaWYgKGZlYXR1cmVzLmJTb3J0ICYmIGZlYXR1cmVzLmJTb3J0Q2xhc3Nlcykge1xuICAgICAgZm9yIChpID0gMCwgaWVuID0gb2xkU29ydC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBjb2xJZHggPSBvbGRTb3J0W2ldLnNyYztcbiAgICAgICAgJChfcGx1Y2soc2V0dGluZ3MuYW9EYXRhLCAnYW5DZWxscycsIGNvbElkeCkpLnJlbW92ZUNsYXNzKHNvcnRDbGFzcyArIChpIDwgMiA/IGkgKyAxIDogMykpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAwLCBpZW4gPSBzb3J0Lmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGNvbElkeCA9IHNvcnRbaV0uc3JjO1xuICAgICAgICAkKF9wbHVjayhzZXR0aW5ncy5hb0RhdGEsICdhbkNlbGxzJywgY29sSWR4KSkuYWRkQ2xhc3Moc29ydENsYXNzICsgKGkgPCAyID8gaSArIDEgOiAzKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0dGluZ3MuYUxhc3RTb3J0ID0gc29ydDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNvcnREYXRhKHNldHRpbmdzLCBpZHgpIHtcbiAgICB2YXIgY29sdW1uID0gc2V0dGluZ3MuYW9Db2x1bW5zW2lkeF07XG4gICAgdmFyIGN1c3RvbVNvcnQgPSBEYXRhVGFibGUuZXh0Lm9yZGVyW2NvbHVtbi5zU29ydERhdGFUeXBlXTtcbiAgICB2YXIgY3VzdG9tRGF0YTtcblxuICAgIGlmIChjdXN0b21Tb3J0KSB7XG4gICAgICBjdXN0b21EYXRhID0gY3VzdG9tU29ydC5jYWxsKHNldHRpbmdzLm9JbnN0YW5jZSwgc2V0dGluZ3MsIGlkeCwgX2ZuQ29sdW1uSW5kZXhUb1Zpc2libGUoc2V0dGluZ3MsIGlkeCkpO1xuICAgIH1cblxuICAgIHZhciByb3csIGNlbGxEYXRhO1xuICAgIHZhciBmb3JtYXR0ZXIgPSBEYXRhVGFibGUuZXh0LnR5cGUub3JkZXJbY29sdW1uLnNUeXBlICsgXCItcHJlXCJdO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IHNldHRpbmdzLmFvRGF0YS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgcm93ID0gc2V0dGluZ3MuYW9EYXRhW2ldO1xuXG4gICAgICBpZiAoIXJvdy5fYVNvcnREYXRhKSB7XG4gICAgICAgIHJvdy5fYVNvcnREYXRhID0gW107XG4gICAgICB9XG5cbiAgICAgIGlmICghcm93Ll9hU29ydERhdGFbaWR4XSB8fCBjdXN0b21Tb3J0KSB7XG4gICAgICAgIGNlbGxEYXRhID0gY3VzdG9tU29ydCA/IGN1c3RvbURhdGFbaV0gOiBfZm5HZXRDZWxsRGF0YShzZXR0aW5ncywgaSwgaWR4LCAnc29ydCcpO1xuICAgICAgICByb3cuX2FTb3J0RGF0YVtpZHhdID0gZm9ybWF0dGVyID8gZm9ybWF0dGVyKGNlbGxEYXRhKSA6IGNlbGxEYXRhO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNhdmVTdGF0ZShzZXR0aW5ncykge1xuICAgIGlmICghc2V0dGluZ3Mub0ZlYXR1cmVzLmJTdGF0ZVNhdmUgfHwgc2V0dGluZ3MuYkRlc3Ryb3lpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgc3RhdGUgPSB7XG4gICAgICB0aW1lOiArbmV3IERhdGUoKSxcbiAgICAgIHN0YXJ0OiBzZXR0aW5ncy5faURpc3BsYXlTdGFydCxcbiAgICAgIGxlbmd0aDogc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoLFxuICAgICAgb3JkZXI6ICQuZXh0ZW5kKHRydWUsIFtdLCBzZXR0aW5ncy5hYVNvcnRpbmcpLFxuICAgICAgc2VhcmNoOiBfZm5TZWFyY2hUb0NhbWVsKHNldHRpbmdzLm9QcmV2aW91c1NlYXJjaCksXG4gICAgICBjb2x1bW5zOiAkLm1hcChzZXR0aW5ncy5hb0NvbHVtbnMsIGZ1bmN0aW9uIChjb2wsIGkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2aXNpYmxlOiBjb2wuYlZpc2libGUsXG4gICAgICAgICAgc2VhcmNoOiBfZm5TZWFyY2hUb0NhbWVsKHNldHRpbmdzLmFvUHJlU2VhcmNoQ29sc1tpXSlcbiAgICAgICAgfTtcbiAgICAgIH0pXG4gICAgfTtcblxuICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgXCJhb1N0YXRlU2F2ZVBhcmFtc1wiLCAnc3RhdGVTYXZlUGFyYW1zJywgW3NldHRpbmdzLCBzdGF0ZV0pO1xuXG4gICAgc2V0dGluZ3Mub1NhdmVkU3RhdGUgPSBzdGF0ZTtcbiAgICBzZXR0aW5ncy5mblN0YXRlU2F2ZUNhbGxiYWNrLmNhbGwoc2V0dGluZ3Mub0luc3RhbmNlLCBzZXR0aW5ncywgc3RhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuTG9hZFN0YXRlKHNldHRpbmdzLCBvSW5pdCwgY2FsbGJhY2spIHtcbiAgICB2YXIgaSwgaWVuO1xuICAgIHZhciBjb2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zO1xuXG4gICAgdmFyIGxvYWRlZCA9IGZ1bmN0aW9uIGxvYWRlZChzKSB7XG4gICAgICBpZiAoIXMgfHwgIXMudGltZSkge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBhYlN0YXRlTG9hZCA9IF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgJ2FvU3RhdGVMb2FkUGFyYW1zJywgJ3N0YXRlTG9hZFBhcmFtcycsIFtzZXR0aW5ncywgc10pO1xuXG4gICAgICBpZiAoJC5pbkFycmF5KGZhbHNlLCBhYlN0YXRlTG9hZCkgIT09IC0xKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGR1cmF0aW9uID0gc2V0dGluZ3MuaVN0YXRlRHVyYXRpb247XG5cbiAgICAgIGlmIChkdXJhdGlvbiA+IDAgJiYgcy50aW1lIDwgK25ldyBEYXRlKCkgLSBkdXJhdGlvbiAqIDEwMDApIHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocy5jb2x1bW5zICYmIGNvbHVtbnMubGVuZ3RoICE9PSBzLmNvbHVtbnMubGVuZ3RoKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2V0dGluZ3Mub0xvYWRlZFN0YXRlID0gJC5leHRlbmQodHJ1ZSwge30sIHMpO1xuXG4gICAgICBpZiAocy5zdGFydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0ID0gcy5zdGFydDtcbiAgICAgICAgc2V0dGluZ3MuaUluaXREaXNwbGF5U3RhcnQgPSBzLnN0YXJ0O1xuICAgICAgfVxuXG4gICAgICBpZiAocy5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzZXR0aW5ncy5faURpc3BsYXlMZW5ndGggPSBzLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgaWYgKHMub3JkZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzZXR0aW5ncy5hYVNvcnRpbmcgPSBbXTtcbiAgICAgICAgJC5lYWNoKHMub3JkZXIsIGZ1bmN0aW9uIChpLCBjb2wpIHtcbiAgICAgICAgICBzZXR0aW5ncy5hYVNvcnRpbmcucHVzaChjb2xbMF0gPj0gY29sdW1ucy5sZW5ndGggPyBbMCwgY29sWzFdXSA6IGNvbCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAocy5zZWFyY2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAkLmV4dGVuZChzZXR0aW5ncy5vUHJldmlvdXNTZWFyY2gsIF9mblNlYXJjaFRvSHVuZyhzLnNlYXJjaCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAocy5jb2x1bW5zKSB7XG4gICAgICAgIGZvciAoaSA9IDAsIGllbiA9IHMuY29sdW1ucy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgIHZhciBjb2wgPSBzLmNvbHVtbnNbaV07XG5cbiAgICAgICAgICBpZiAoY29sLnZpc2libGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29sdW1uc1tpXS5iVmlzaWJsZSA9IGNvbC52aXNpYmxlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb2wuc2VhcmNoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKHNldHRpbmdzLmFvUHJlU2VhcmNoQ29sc1tpXSwgX2ZuU2VhcmNoVG9IdW5nKGNvbC5zZWFyY2gpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCAnYW9TdGF0ZUxvYWRlZCcsICdzdGF0ZUxvYWRlZCcsIFtzZXR0aW5ncywgc10pO1xuXG4gICAgICBjYWxsYmFjaygpO1xuICAgIH07XG5cbiAgICBpZiAoIXNldHRpbmdzLm9GZWF0dXJlcy5iU3RhdGVTYXZlKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBzdGF0ZSA9IHNldHRpbmdzLmZuU3RhdGVMb2FkQ2FsbGJhY2suY2FsbChzZXR0aW5ncy5vSW5zdGFuY2UsIHNldHRpbmdzLCBsb2FkZWQpO1xuXG4gICAgaWYgKHN0YXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxvYWRlZChzdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU2V0dGluZ3NGcm9tTm9kZSh0YWJsZSkge1xuICAgIHZhciBzZXR0aW5ncyA9IERhdGFUYWJsZS5zZXR0aW5ncztcbiAgICB2YXIgaWR4ID0gJC5pbkFycmF5KHRhYmxlLCBfcGx1Y2soc2V0dGluZ3MsICduVGFibGUnKSk7XG4gICAgcmV0dXJuIGlkeCAhPT0gLTEgPyBzZXR0aW5nc1tpZHhdIDogbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkxvZyhzZXR0aW5ncywgbGV2ZWwsIG1zZywgdG4pIHtcbiAgICBtc2cgPSAnRGF0YVRhYmxlcyB3YXJuaW5nOiAnICsgKHNldHRpbmdzID8gJ3RhYmxlIGlkPScgKyBzZXR0aW5ncy5zVGFibGVJZCArICcgLSAnIDogJycpICsgbXNnO1xuXG4gICAgaWYgKHRuKSB7XG4gICAgICBtc2cgKz0gJy4gRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhpcyBlcnJvciwgcGxlYXNlIHNlZSAnICsgJ2h0dHA6Ly9kYXRhdGFibGVzLm5ldC90bi8nICsgdG47XG4gICAgfVxuXG4gICAgaWYgKCFsZXZlbCkge1xuICAgICAgdmFyIGV4dCA9IERhdGFUYWJsZS5leHQ7XG4gICAgICB2YXIgdHlwZSA9IGV4dC5zRXJyTW9kZSB8fCBleHQuZXJyTW9kZTtcblxuICAgICAgaWYgKHNldHRpbmdzKSB7XG4gICAgICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgbnVsbCwgJ2Vycm9yJywgW3NldHRpbmdzLCB0biwgbXNnXSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlID09ICdhbGVydCcpIHtcbiAgICAgICAgYWxlcnQobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAndGhyb3cnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdHlwZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHR5cGUoc2V0dGluZ3MsIHRuLCBtc2cpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAod2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5sb2cpIHtcbiAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuTWFwKHJldCwgc3JjLCBuYW1lLCBtYXBwZWROYW1lKSB7XG4gICAgaWYgKCQuaXNBcnJheShuYW1lKSkge1xuICAgICAgJC5lYWNoKG5hbWUsIGZ1bmN0aW9uIChpLCB2YWwpIHtcbiAgICAgICAgaWYgKCQuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgX2ZuTWFwKHJldCwgc3JjLCB2YWxbMF0sIHZhbFsxXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2ZuTWFwKHJldCwgc3JjLCB2YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobWFwcGVkTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBtYXBwZWROYW1lID0gbmFtZTtcbiAgICB9XG5cbiAgICBpZiAoc3JjW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldFttYXBwZWROYW1lXSA9IHNyY1tuYW1lXTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5FeHRlbmQob3V0LCBleHRlbmRlciwgYnJlYWtSZWZzKSB7XG4gICAgdmFyIHZhbDtcblxuICAgIGZvciAodmFyIHByb3AgaW4gZXh0ZW5kZXIpIHtcbiAgICAgIGlmIChleHRlbmRlci5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICB2YWwgPSBleHRlbmRlcltwcm9wXTtcblxuICAgICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgICAgICBpZiAoISQuaXNQbGFpbk9iamVjdChvdXRbcHJvcF0pKSB7XG4gICAgICAgICAgICBvdXRbcHJvcF0gPSB7fTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBvdXRbcHJvcF0sIHZhbCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYnJlYWtSZWZzICYmIHByb3AgIT09ICdkYXRhJyAmJiBwcm9wICE9PSAnYWFEYXRhJyAmJiAkLmlzQXJyYXkodmFsKSkge1xuICAgICAgICAgIG91dFtwcm9wXSA9IHZhbC5zbGljZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dFtwcm9wXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5CaW5kQWN0aW9uKG4sIG9EYXRhLCBmbikge1xuICAgICQobikub24oJ2NsaWNrLkRUJywgb0RhdGEsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKG4pLmJsdXIoKTtcbiAgICAgIGZuKGUpO1xuICAgIH0pLm9uKCdrZXlwcmVzcy5EVCcsIG9EYXRhLCBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKGUud2hpY2ggPT09IDEzKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZm4oZSk7XG4gICAgICB9XG4gICAgfSkub24oJ3NlbGVjdHN0YXJ0LkRUJywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCBzU3RvcmUsIGZuLCBzTmFtZSkge1xuICAgIGlmIChmbikge1xuICAgICAgb1NldHRpbmdzW3NTdG9yZV0ucHVzaCh7XG4gICAgICAgIFwiZm5cIjogZm4sXG4gICAgICAgIFwic05hbWVcIjogc05hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgY2FsbGJhY2tBcnIsIGV2ZW50TmFtZSwgYXJncykge1xuICAgIHZhciByZXQgPSBbXTtcblxuICAgIGlmIChjYWxsYmFja0Fycikge1xuICAgICAgcmV0ID0gJC5tYXAoc2V0dGluZ3NbY2FsbGJhY2tBcnJdLnNsaWNlKCkucmV2ZXJzZSgpLCBmdW5jdGlvbiAodmFsLCBpKSB7XG4gICAgICAgIHJldHVybiB2YWwuZm4uYXBwbHkoc2V0dGluZ3Mub0luc3RhbmNlLCBhcmdzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChldmVudE5hbWUgIT09IG51bGwpIHtcbiAgICAgIHZhciBlID0gJC5FdmVudChldmVudE5hbWUgKyAnLmR0Jyk7XG4gICAgICAkKHNldHRpbmdzLm5UYWJsZSkudHJpZ2dlcihlLCBhcmdzKTtcbiAgICAgIHJldC5wdXNoKGUucmVzdWx0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuTGVuZ3RoT3ZlcmZsb3coc2V0dGluZ3MpIHtcbiAgICB2YXIgc3RhcnQgPSBzZXR0aW5ncy5faURpc3BsYXlTdGFydCxcbiAgICAgICAgZW5kID0gc2V0dGluZ3MuZm5EaXNwbGF5RW5kKCksXG4gICAgICAgIGxlbiA9IHNldHRpbmdzLl9pRGlzcGxheUxlbmd0aDtcblxuICAgIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICAgIHN0YXJ0ID0gZW5kIC0gbGVuO1xuICAgIH1cblxuICAgIHN0YXJ0IC09IHN0YXJ0ICUgbGVuO1xuXG4gICAgaWYgKGxlbiA9PT0gLTEgfHwgc3RhcnQgPCAwKSB7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuXG4gICAgc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQgPSBzdGFydDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblJlbmRlcmVyKHNldHRpbmdzLCB0eXBlKSB7XG4gICAgdmFyIHJlbmRlcmVyID0gc2V0dGluZ3MucmVuZGVyZXI7XG4gICAgdmFyIGhvc3QgPSBEYXRhVGFibGUuZXh0LnJlbmRlcmVyW3R5cGVdO1xuXG4gICAgaWYgKCQuaXNQbGFpbk9iamVjdChyZW5kZXJlcikgJiYgcmVuZGVyZXJbdHlwZV0pIHtcbiAgICAgIHJldHVybiBob3N0W3JlbmRlcmVyW3R5cGVdXSB8fCBob3N0Ll87XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVuZGVyZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gaG9zdFtyZW5kZXJlcl0gfHwgaG9zdC5fO1xuICAgIH1cblxuICAgIHJldHVybiBob3N0Ll87XG4gIH1cblxuICBmdW5jdGlvbiBfZm5EYXRhU291cmNlKHNldHRpbmdzKSB7XG4gICAgaWYgKHNldHRpbmdzLm9GZWF0dXJlcy5iU2VydmVyU2lkZSkge1xuICAgICAgcmV0dXJuICdzc3AnO1xuICAgIH0gZWxzZSBpZiAoc2V0dGluZ3MuYWpheCB8fCBzZXR0aW5ncy5zQWpheFNvdXJjZSkge1xuICAgICAgcmV0dXJuICdhamF4JztcbiAgICB9XG5cbiAgICByZXR1cm4gJ2RvbSc7XG4gIH1cblxuICB2YXIgX19hcGlTdHJ1Y3QgPSBbXTtcbiAgdmFyIF9fYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxuICB2YXIgX3RvU2V0dGluZ3MgPSBmdW5jdGlvbiBfdG9TZXR0aW5ncyhtaXhlZCkge1xuICAgIHZhciBpZHgsIGpxO1xuICAgIHZhciBzZXR0aW5ncyA9IERhdGFUYWJsZS5zZXR0aW5ncztcbiAgICB2YXIgdGFibGVzID0gJC5tYXAoc2V0dGluZ3MsIGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgcmV0dXJuIGVsLm5UYWJsZTtcbiAgICB9KTtcblxuICAgIGlmICghbWl4ZWQpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2UgaWYgKG1peGVkLm5UYWJsZSAmJiBtaXhlZC5vQXBpKSB7XG4gICAgICByZXR1cm4gW21peGVkXTtcbiAgICB9IGVsc2UgaWYgKG1peGVkLm5vZGVOYW1lICYmIG1peGVkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICd0YWJsZScpIHtcbiAgICAgIGlkeCA9ICQuaW5BcnJheShtaXhlZCwgdGFibGVzKTtcbiAgICAgIHJldHVybiBpZHggIT09IC0xID8gW3NldHRpbmdzW2lkeF1dIDogbnVsbDtcbiAgICB9IGVsc2UgaWYgKG1peGVkICYmIHR5cGVvZiBtaXhlZC5zZXR0aW5ncyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIG1peGVkLnNldHRpbmdzKCkudG9BcnJheSgpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1peGVkID09PSAnc3RyaW5nJykge1xuICAgICAganEgPSAkKG1peGVkKTtcbiAgICB9IGVsc2UgaWYgKG1peGVkIGluc3RhbmNlb2YgJCkge1xuICAgICAganEgPSBtaXhlZDtcbiAgICB9XG5cbiAgICBpZiAoanEpIHtcbiAgICAgIHJldHVybiBqcS5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgaWR4ID0gJC5pbkFycmF5KHRoaXMsIHRhYmxlcyk7XG4gICAgICAgIHJldHVybiBpZHggIT09IC0xID8gc2V0dGluZ3NbaWR4XSA6IG51bGw7XG4gICAgICB9KS50b0FycmF5KCk7XG4gICAgfVxuICB9O1xuXG4gIF9BcGkyID0gZnVuY3Rpb24gX0FwaShjb250ZXh0LCBkYXRhKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIF9BcGkyKSkge1xuICAgICAgcmV0dXJuIG5ldyBfQXBpMihjb250ZXh0LCBkYXRhKTtcbiAgICB9XG5cbiAgICB2YXIgc2V0dGluZ3MgPSBbXTtcblxuICAgIHZhciBjdHhTZXR0aW5ncyA9IGZ1bmN0aW9uIGN0eFNldHRpbmdzKG8pIHtcbiAgICAgIHZhciBhID0gX3RvU2V0dGluZ3Mobyk7XG5cbiAgICAgIGlmIChhKSB7XG4gICAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MuY29uY2F0KGEpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoJC5pc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gY29udGV4dC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBjdHhTZXR0aW5ncyhjb250ZXh0W2ldKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY3R4U2V0dGluZ3MoY29udGV4dCk7XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZXh0ID0gX3VuaXF1ZShzZXR0aW5ncyk7XG5cbiAgICBpZiAoZGF0YSkge1xuICAgICAgJC5tZXJnZSh0aGlzLCBkYXRhKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdG9yID0ge1xuICAgICAgcm93czogbnVsbCxcbiAgICAgIGNvbHM6IG51bGwsXG4gICAgICBvcHRzOiBudWxsXG4gICAgfTtcblxuICAgIF9BcGkyLmV4dGVuZCh0aGlzLCB0aGlzLCBfX2FwaVN0cnVjdCk7XG4gIH07XG5cbiAgRGF0YVRhYmxlLkFwaSA9IF9BcGkyO1xuICAkLmV4dGVuZChfQXBpMi5wcm90b3R5cGUsIHtcbiAgICBhbnk6IGZ1bmN0aW9uIGFueSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvdW50KCkgIT09IDA7XG4gICAgfSxcbiAgICBjb25jYXQ6IF9fYXJyYXlQcm90by5jb25jYXQsXG4gICAgY29udGV4dDogW10sXG4gICAgY291bnQ6IGZ1bmN0aW9uIGNvdW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmxhdHRlbigpLmxlbmd0aDtcbiAgICB9LFxuICAgIGVhY2g6IGZ1bmN0aW9uIGVhY2goZm4pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGZuLmNhbGwodGhpcywgdGhpc1tpXSwgaSwgdGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZXE6IGZ1bmN0aW9uIGVxKGlkeCkge1xuICAgICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcbiAgICAgIHJldHVybiBjdHgubGVuZ3RoID4gaWR4ID8gbmV3IF9BcGkyKGN0eFtpZHhdLCB0aGlzW2lkeF0pIDogbnVsbDtcbiAgICB9LFxuICAgIGZpbHRlcjogZnVuY3Rpb24gZmlsdGVyKGZuKSB7XG4gICAgICB2YXIgYSA9IFtdO1xuXG4gICAgICBpZiAoX19hcnJheVByb3RvLmZpbHRlcikge1xuICAgICAgICBhID0gX19hcnJheVByb3RvLmZpbHRlci5jYWxsKHRoaXMsIGZuLCB0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgaWYgKGZuLmNhbGwodGhpcywgdGhpc1tpXSwgaSwgdGhpcykpIHtcbiAgICAgICAgICAgIGEucHVzaCh0aGlzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBfQXBpMih0aGlzLmNvbnRleHQsIGEpO1xuICAgIH0sXG4gICAgZmxhdHRlbjogZnVuY3Rpb24gZmxhdHRlbigpIHtcbiAgICAgIHZhciBhID0gW107XG4gICAgICByZXR1cm4gbmV3IF9BcGkyKHRoaXMuY29udGV4dCwgYS5jb25jYXQuYXBwbHkoYSwgdGhpcy50b0FycmF5KCkpKTtcbiAgICB9LFxuICAgIGpvaW46IF9fYXJyYXlQcm90by5qb2luLFxuICAgIGluZGV4T2Y6IF9fYXJyYXlQcm90by5pbmRleE9mIHx8IGZ1bmN0aW9uIChvYmosIHN0YXJ0KSB7XG4gICAgICBmb3IgKHZhciBpID0gc3RhcnQgfHwgMCwgaWVuID0gdGhpcy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBpZiAodGhpc1tpXSA9PT0gb2JqKSB7XG4gICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIC0xO1xuICAgIH0sXG4gICAgaXRlcmF0b3I6IGZ1bmN0aW9uIGl0ZXJhdG9yKGZsYXR0ZW4sIHR5cGUsIGZuLCBhbHdheXNOZXcpIHtcbiAgICAgIHZhciBhID0gW10sXG4gICAgICAgICAgcmV0LFxuICAgICAgICAgIGksXG4gICAgICAgICAgaWVuLFxuICAgICAgICAgIGosXG4gICAgICAgICAgamVuLFxuICAgICAgICAgIGNvbnRleHQgPSB0aGlzLmNvbnRleHQsXG4gICAgICAgICAgcm93cyxcbiAgICAgICAgICBpdGVtcyxcbiAgICAgICAgICBpdGVtLFxuICAgICAgICAgIHNlbGVjdG9yID0gdGhpcy5zZWxlY3RvcjtcblxuICAgICAgaWYgKHR5cGVvZiBmbGF0dGVuID09PSAnc3RyaW5nJykge1xuICAgICAgICBhbHdheXNOZXcgPSBmbjtcbiAgICAgICAgZm4gPSB0eXBlO1xuICAgICAgICB0eXBlID0gZmxhdHRlbjtcbiAgICAgICAgZmxhdHRlbiA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAwLCBpZW4gPSBjb250ZXh0Lmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIHZhciBhcGlJbnN0ID0gbmV3IF9BcGkyKGNvbnRleHRbaV0pO1xuXG4gICAgICAgIGlmICh0eXBlID09PSAndGFibGUnKSB7XG4gICAgICAgICAgcmV0ID0gZm4uY2FsbChhcGlJbnN0LCBjb250ZXh0W2ldLCBpKTtcblxuICAgICAgICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYS5wdXNoKHJldCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdjb2x1bW5zJyB8fCB0eXBlID09PSAncm93cycpIHtcbiAgICAgICAgICByZXQgPSBmbi5jYWxsKGFwaUluc3QsIGNvbnRleHRbaV0sIHRoaXNbaV0sIGkpO1xuXG4gICAgICAgICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhLnB1c2gocmV0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2NvbHVtbicgfHwgdHlwZSA9PT0gJ2NvbHVtbi1yb3dzJyB8fCB0eXBlID09PSAncm93JyB8fCB0eXBlID09PSAnY2VsbCcpIHtcbiAgICAgICAgICBpdGVtcyA9IHRoaXNbaV07XG5cbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ2NvbHVtbi1yb3dzJykge1xuICAgICAgICAgICAgcm93cyA9IF9zZWxlY3Rvcl9yb3dfaW5kZXhlcyhjb250ZXh0W2ldLCBzZWxlY3Rvci5vcHRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGogPSAwLCBqZW4gPSBpdGVtcy5sZW5ndGg7IGogPCBqZW47IGorKykge1xuICAgICAgICAgICAgaXRlbSA9IGl0ZW1zW2pdO1xuXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2NlbGwnKSB7XG4gICAgICAgICAgICAgIHJldCA9IGZuLmNhbGwoYXBpSW5zdCwgY29udGV4dFtpXSwgaXRlbS5yb3csIGl0ZW0uY29sdW1uLCBpLCBqKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldCA9IGZuLmNhbGwoYXBpSW5zdCwgY29udGV4dFtpXSwgaXRlbSwgaSwgaiwgcm93cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBhLnB1c2gocmV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGEubGVuZ3RoIHx8IGFsd2F5c05ldykge1xuICAgICAgICB2YXIgYXBpID0gbmV3IF9BcGkyKGNvbnRleHQsIGZsYXR0ZW4gPyBhLmNvbmNhdC5hcHBseShbXSwgYSkgOiBhKTtcbiAgICAgICAgdmFyIGFwaVNlbGVjdG9yID0gYXBpLnNlbGVjdG9yO1xuICAgICAgICBhcGlTZWxlY3Rvci5yb3dzID0gc2VsZWN0b3Iucm93cztcbiAgICAgICAgYXBpU2VsZWN0b3IuY29scyA9IHNlbGVjdG9yLmNvbHM7XG4gICAgICAgIGFwaVNlbGVjdG9yLm9wdHMgPSBzZWxlY3Rvci5vcHRzO1xuICAgICAgICByZXR1cm4gYXBpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGxhc3RJbmRleE9mOiBfX2FycmF5UHJvdG8ubGFzdEluZGV4T2YgfHwgZnVuY3Rpb24gKG9iaiwgc3RhcnQpIHtcbiAgICAgIHJldHVybiB0aGlzLmluZGV4T2YuYXBwbHkodGhpcy50b0FycmF5LnJldmVyc2UoKSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGxlbmd0aDogMCxcbiAgICBtYXA6IGZ1bmN0aW9uIG1hcChmbikge1xuICAgICAgdmFyIGEgPSBbXTtcblxuICAgICAgaWYgKF9fYXJyYXlQcm90by5tYXApIHtcbiAgICAgICAgYSA9IF9fYXJyYXlQcm90by5tYXAuY2FsbCh0aGlzLCBmbiwgdGhpcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gdGhpcy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgIGEucHVzaChmbi5jYWxsKHRoaXMsIHRoaXNbaV0sIGkpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IF9BcGkyKHRoaXMuY29udGV4dCwgYSk7XG4gICAgfSxcbiAgICBwbHVjazogZnVuY3Rpb24gcGx1Y2socHJvcCkge1xuICAgICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gZWxbcHJvcF07XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHBvcDogX19hcnJheVByb3RvLnBvcCxcbiAgICBwdXNoOiBfX2FycmF5UHJvdG8ucHVzaCxcbiAgICByZWR1Y2U6IF9fYXJyYXlQcm90by5yZWR1Y2UgfHwgZnVuY3Rpb24gKGZuLCBpbml0KSB7XG4gICAgICByZXR1cm4gX2ZuUmVkdWNlKHRoaXMsIGZuLCBpbml0LCAwLCB0aGlzLmxlbmd0aCwgMSk7XG4gICAgfSxcbiAgICByZWR1Y2VSaWdodDogX19hcnJheVByb3RvLnJlZHVjZVJpZ2h0IHx8IGZ1bmN0aW9uIChmbiwgaW5pdCkge1xuICAgICAgcmV0dXJuIF9mblJlZHVjZSh0aGlzLCBmbiwgaW5pdCwgdGhpcy5sZW5ndGggLSAxLCAtMSwgLTEpO1xuICAgIH0sXG4gICAgcmV2ZXJzZTogX19hcnJheVByb3RvLnJldmVyc2UsXG4gICAgc2VsZWN0b3I6IG51bGwsXG4gICAgc2hpZnQ6IF9fYXJyYXlQcm90by5zaGlmdCxcbiAgICBzbGljZTogZnVuY3Rpb24gc2xpY2UoKSB7XG4gICAgICByZXR1cm4gbmV3IF9BcGkyKHRoaXMuY29udGV4dCwgdGhpcyk7XG4gICAgfSxcbiAgICBzb3J0OiBfX2FycmF5UHJvdG8uc29ydCxcbiAgICBzcGxpY2U6IF9fYXJyYXlQcm90by5zcGxpY2UsXG4gICAgdG9BcnJheTogZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICAgIHJldHVybiBfX2FycmF5UHJvdG8uc2xpY2UuY2FsbCh0aGlzKTtcbiAgICB9LFxuICAgIHRvJDogZnVuY3Rpb24gdG8kKCkge1xuICAgICAgcmV0dXJuICQodGhpcyk7XG4gICAgfSxcbiAgICB0b0pRdWVyeTogZnVuY3Rpb24gdG9KUXVlcnkoKSB7XG4gICAgICByZXR1cm4gJCh0aGlzKTtcbiAgICB9LFxuICAgIHVuaXF1ZTogZnVuY3Rpb24gdW5pcXVlKCkge1xuICAgICAgcmV0dXJuIG5ldyBfQXBpMih0aGlzLmNvbnRleHQsIF91bmlxdWUodGhpcykpO1xuICAgIH0sXG4gICAgdW5zaGlmdDogX19hcnJheVByb3RvLnVuc2hpZnRcbiAgfSk7XG5cbiAgX0FwaTIuZXh0ZW5kID0gZnVuY3Rpb24gKHNjb3BlLCBvYmosIGV4dCkge1xuICAgIGlmICghZXh0Lmxlbmd0aCB8fCAhb2JqIHx8ICEob2JqIGluc3RhbmNlb2YgX0FwaTIpICYmICFvYmouX19kdF93cmFwcGVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGksXG4gICAgICAgIGllbixcbiAgICAgICAgaixcbiAgICAgICAgamVuLFxuICAgICAgICBzdHJ1Y3QsXG4gICAgICAgIGlubmVyLFxuICAgICAgICBtZXRob2RTY29waW5nID0gZnVuY3Rpb24gbWV0aG9kU2NvcGluZyhzY29wZSwgZm4sIHN0cnVjKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmV0ID0gZm4uYXBwbHkoc2NvcGUsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgX0FwaTIuZXh0ZW5kKHJldCwgcmV0LCBzdHJ1Yy5tZXRob2RFeHQpO1xuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBmb3IgKGkgPSAwLCBpZW4gPSBleHQubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIHN0cnVjdCA9IGV4dFtpXTtcbiAgICAgIG9ialtzdHJ1Y3QubmFtZV0gPSB0eXBlb2Ygc3RydWN0LnZhbCA9PT0gJ2Z1bmN0aW9uJyA/IG1ldGhvZFNjb3Bpbmcoc2NvcGUsIHN0cnVjdC52YWwsIHN0cnVjdCkgOiAkLmlzUGxhaW5PYmplY3Qoc3RydWN0LnZhbCkgPyB7fSA6IHN0cnVjdC52YWw7XG4gICAgICBvYmpbc3RydWN0Lm5hbWVdLl9fZHRfd3JhcHBlciA9IHRydWU7XG5cbiAgICAgIF9BcGkyLmV4dGVuZChzY29wZSwgb2JqW3N0cnVjdC5uYW1lXSwgc3RydWN0LnByb3BFeHQpO1xuICAgIH1cbiAgfTtcblxuICBfQXBpMi5yZWdpc3RlciA9IF9hcGlfcmVnaXN0ZXIgPSBmdW5jdGlvbiBfYXBpX3JlZ2lzdGVyKG5hbWUsIHZhbCkge1xuICAgIGlmICgkLmlzQXJyYXkobmFtZSkpIHtcbiAgICAgIGZvciAodmFyIGogPSAwLCBqZW4gPSBuYW1lLmxlbmd0aDsgaiA8IGplbjsgaisrKSB7XG4gICAgICAgIF9BcGkyLnJlZ2lzdGVyKG5hbWVbal0sIHZhbCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaSxcbiAgICAgICAgaWVuLFxuICAgICAgICBoZWlyID0gbmFtZS5zcGxpdCgnLicpLFxuICAgICAgICBzdHJ1Y3QgPSBfX2FwaVN0cnVjdCxcbiAgICAgICAga2V5LFxuICAgICAgICBtZXRob2Q7XG5cbiAgICB2YXIgZmluZCA9IGZ1bmN0aW9uIGZpbmQoc3JjLCBuYW1lKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gc3JjLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGlmIChzcmNbaV0ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgIHJldHVybiBzcmNbaV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIGZvciAoaSA9IDAsIGllbiA9IGhlaXIubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIG1ldGhvZCA9IGhlaXJbaV0uaW5kZXhPZignKCknKSAhPT0gLTE7XG4gICAgICBrZXkgPSBtZXRob2QgPyBoZWlyW2ldLnJlcGxhY2UoJygpJywgJycpIDogaGVpcltpXTtcbiAgICAgIHZhciBzcmMgPSBmaW5kKHN0cnVjdCwga2V5KTtcblxuICAgICAgaWYgKCFzcmMpIHtcbiAgICAgICAgc3JjID0ge1xuICAgICAgICAgIG5hbWU6IGtleSxcbiAgICAgICAgICB2YWw6IHt9LFxuICAgICAgICAgIG1ldGhvZEV4dDogW10sXG4gICAgICAgICAgcHJvcEV4dDogW11cbiAgICAgICAgfTtcbiAgICAgICAgc3RydWN0LnB1c2goc3JjKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGkgPT09IGllbiAtIDEpIHtcbiAgICAgICAgc3JjLnZhbCA9IHZhbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0cnVjdCA9IG1ldGhvZCA/IHNyYy5tZXRob2RFeHQgOiBzcmMucHJvcEV4dDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgX0FwaTIucmVnaXN0ZXJQbHVyYWwgPSBfYXBpX3JlZ2lzdGVyUGx1cmFsID0gZnVuY3Rpb24gX2FwaV9yZWdpc3RlclBsdXJhbChwbHVyYWxOYW1lLCBzaW5ndWxhck5hbWUsIHZhbCkge1xuICAgIF9BcGkyLnJlZ2lzdGVyKHBsdXJhbE5hbWUsIHZhbCk7XG5cbiAgICBfQXBpMi5yZWdpc3RlcihzaW5ndWxhck5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciByZXQgPSB2YWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgaWYgKHJldCA9PT0gdGhpcykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAocmV0IGluc3RhbmNlb2YgX0FwaTIpIHtcbiAgICAgICAgcmV0dXJuIHJldC5sZW5ndGggPyAkLmlzQXJyYXkocmV0WzBdKSA/IG5ldyBfQXBpMihyZXQuY29udGV4dCwgcmV0WzBdKSA6IHJldFswXSA6IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgX190YWJsZV9zZWxlY3RvciA9IGZ1bmN0aW9uIF9fdGFibGVfc2VsZWN0b3Ioc2VsZWN0b3IsIGEpIHtcbiAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIFthW3NlbGVjdG9yXV07XG4gICAgfVxuXG4gICAgdmFyIG5vZGVzID0gJC5tYXAoYSwgZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICByZXR1cm4gZWwublRhYmxlO1xuICAgIH0pO1xuICAgIHJldHVybiAkKG5vZGVzKS5maWx0ZXIoc2VsZWN0b3IpLm1hcChmdW5jdGlvbiAoaSkge1xuICAgICAgdmFyIGlkeCA9ICQuaW5BcnJheSh0aGlzLCBub2Rlcyk7XG4gICAgICByZXR1cm4gYVtpZHhdO1xuICAgIH0pLnRvQXJyYXkoKTtcbiAgfTtcblxuICBfYXBpX3JlZ2lzdGVyKCd0YWJsZXMoKScsIGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgIHJldHVybiBzZWxlY3RvciA/IG5ldyBfQXBpMihfX3RhYmxlX3NlbGVjdG9yKHNlbGVjdG9yLCB0aGlzLmNvbnRleHQpKSA6IHRoaXM7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3RhYmxlKCknLCBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICB2YXIgdGFibGVzID0gdGhpcy50YWJsZXMoc2VsZWN0b3IpO1xuICAgIHZhciBjdHggPSB0YWJsZXMuY29udGV4dDtcbiAgICByZXR1cm4gY3R4Lmxlbmd0aCA/IG5ldyBfQXBpMihjdHhbMF0pIDogdGFibGVzO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCd0YWJsZXMoKS5ub2RlcygpJywgJ3RhYmxlKCkubm9kZSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIHJldHVybiBjdHgublRhYmxlO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCd0YWJsZXMoKS5ib2R5KCknLCAndGFibGUoKS5ib2R5KCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgcmV0dXJuIGN0eC5uVEJvZHk7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ3RhYmxlcygpLmhlYWRlcigpJywgJ3RhYmxlKCkuaGVhZGVyKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgcmV0dXJuIGN0eC5uVEhlYWQ7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ3RhYmxlcygpLmZvb3RlcigpJywgJ3RhYmxlKCkuZm9vdGVyKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgcmV0dXJuIGN0eC5uVEZvb3Q7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ3RhYmxlcygpLmNvbnRhaW5lcnMoKScsICd0YWJsZSgpLmNvbnRhaW5lcigpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIHJldHVybiBjdHgublRhYmxlV3JhcHBlcjtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignZHJhdygpJywgZnVuY3Rpb24gKHBhZ2luZykge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgaWYgKHBhZ2luZyA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIF9mbkRyYXcoc2V0dGluZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYWdpbmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcGFnaW5nID0gcGFnaW5nID09PSAnZnVsbC1ob2xkJyA/IGZhbHNlIDogdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9mblJlRHJhdyhzZXR0aW5ncywgcGFnaW5nID09PSBmYWxzZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3BhZ2UoKScsIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICBpZiAoYWN0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhZ2UuaW5mbygpLnBhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBfZm5QYWdlQ2hhbmdlKHNldHRpbmdzLCBhY3Rpb24pO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdwYWdlLmluZm8oKScsIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICBpZiAodGhpcy5jb250ZXh0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgc2V0dGluZ3MgPSB0aGlzLmNvbnRleHRbMF0sXG4gICAgICAgIHN0YXJ0ID0gc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQsXG4gICAgICAgIGxlbiA9IHNldHRpbmdzLm9GZWF0dXJlcy5iUGFnaW5hdGUgPyBzZXR0aW5ncy5faURpc3BsYXlMZW5ndGggOiAtMSxcbiAgICAgICAgdmlzUmVjb3JkcyA9IHNldHRpbmdzLmZuUmVjb3Jkc0Rpc3BsYXkoKSxcbiAgICAgICAgYWxsID0gbGVuID09PSAtMTtcbiAgICByZXR1cm4ge1xuICAgICAgXCJwYWdlXCI6IGFsbCA/IDAgOiBNYXRoLmZsb29yKHN0YXJ0IC8gbGVuKSxcbiAgICAgIFwicGFnZXNcIjogYWxsID8gMSA6IE1hdGguY2VpbCh2aXNSZWNvcmRzIC8gbGVuKSxcbiAgICAgIFwic3RhcnRcIjogc3RhcnQsXG4gICAgICBcImVuZFwiOiBzZXR0aW5ncy5mbkRpc3BsYXlFbmQoKSxcbiAgICAgIFwibGVuZ3RoXCI6IGxlbixcbiAgICAgIFwicmVjb3Jkc1RvdGFsXCI6IHNldHRpbmdzLmZuUmVjb3Jkc1RvdGFsKCksXG4gICAgICBcInJlY29yZHNEaXNwbGF5XCI6IHZpc1JlY29yZHMsXG4gICAgICBcInNlcnZlclNpZGVcIjogX2ZuRGF0YVNvdXJjZShzZXR0aW5ncykgPT09ICdzc3AnXG4gICAgfTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcigncGFnZS5sZW4oKScsIGZ1bmN0aW9uIChsZW4pIHtcbiAgICBpZiAobGVuID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRleHQubGVuZ3RoICE9PSAwID8gdGhpcy5jb250ZXh0WzBdLl9pRGlzcGxheUxlbmd0aCA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIF9mbkxlbmd0aENoYW5nZShzZXR0aW5ncywgbGVuKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdmFyIF9fcmVsb2FkID0gZnVuY3Rpb24gX19yZWxvYWQoc2V0dGluZ3MsIGhvbGRQb3NpdGlvbiwgY2FsbGJhY2spIHtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHZhciBhcGkgPSBuZXcgX0FwaTIoc2V0dGluZ3MpO1xuICAgICAgYXBpLm9uZSgnZHJhdycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FsbGJhY2soYXBpLmFqYXguanNvbigpKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChfZm5EYXRhU291cmNlKHNldHRpbmdzKSA9PSAnc3NwJykge1xuICAgICAgX2ZuUmVEcmF3KHNldHRpbmdzLCBob2xkUG9zaXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShzZXR0aW5ncywgdHJ1ZSk7XG5cbiAgICAgIHZhciB4aHIgPSBzZXR0aW5ncy5qcVhIUjtcblxuICAgICAgaWYgKHhociAmJiB4aHIucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICB4aHIuYWJvcnQoKTtcbiAgICAgIH1cblxuICAgICAgX2ZuQnVpbGRBamF4KHNldHRpbmdzLCBbXSwgZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgX2ZuQ2xlYXJUYWJsZShzZXR0aW5ncyk7XG5cbiAgICAgICAgdmFyIGRhdGEgPSBfZm5BamF4RGF0YVNyYyhzZXR0aW5ncywganNvbik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGRhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICBfZm5BZGREYXRhKHNldHRpbmdzLCBkYXRhW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9mblJlRHJhdyhzZXR0aW5ncywgaG9sZFBvc2l0aW9uKTtcblxuICAgICAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShzZXR0aW5ncywgZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2FqYXguanNvbigpJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAoY3R4Lmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBjdHhbMF0uanNvbjtcbiAgICB9XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2FqYXgucGFyYW1zKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcblxuICAgIGlmIChjdHgubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGN0eFswXS5vQWpheERhdGE7XG4gICAgfVxuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdhamF4LnJlbG9hZCgpJywgZnVuY3Rpb24gKGNhbGxiYWNrLCByZXNldFBhZ2luZykge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgX19yZWxvYWQoc2V0dGluZ3MsIHJlc2V0UGFnaW5nID09PSBmYWxzZSwgY2FsbGJhY2spO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdhamF4LnVybCgpJywgZnVuY3Rpb24gKHVybCkge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAodXJsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChjdHgubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGN0eCA9IGN0eFswXTtcbiAgICAgIHJldHVybiBjdHguYWpheCA/ICQuaXNQbGFpbk9iamVjdChjdHguYWpheCkgPyBjdHguYWpheC51cmwgOiBjdHguYWpheCA6IGN0eC5zQWpheFNvdXJjZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIGlmICgkLmlzUGxhaW5PYmplY3Qoc2V0dGluZ3MuYWpheCkpIHtcbiAgICAgICAgc2V0dGluZ3MuYWpheC51cmwgPSB1cmw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXR0aW5ncy5hamF4ID0gdXJsO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdhamF4LnVybCgpLmxvYWQoKScsIGZ1bmN0aW9uIChjYWxsYmFjaywgcmVzZXRQYWdpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICBfX3JlbG9hZChjdHgsIHJlc2V0UGFnaW5nID09PSBmYWxzZSwgY2FsbGJhY2spO1xuICAgIH0pO1xuICB9KTtcblxuICB2YXIgX3NlbGVjdG9yX3J1biA9IGZ1bmN0aW9uIF9zZWxlY3Rvcl9ydW4odHlwZSwgc2VsZWN0b3IsIHNlbGVjdEZuLCBzZXR0aW5ncywgb3B0cykge1xuICAgIHZhciBvdXQgPSBbXSxcbiAgICAgICAgcmVzLFxuICAgICAgICBhLFxuICAgICAgICBpLFxuICAgICAgICBpZW4sXG4gICAgICAgIGosXG4gICAgICAgIGplbixcbiAgICAgICAgc2VsZWN0b3JUeXBlID0gX3R5cGVvZihzZWxlY3Rvcik7XG5cbiAgICBpZiAoIXNlbGVjdG9yIHx8IHNlbGVjdG9yVHlwZSA9PT0gJ3N0cmluZycgfHwgc2VsZWN0b3JUeXBlID09PSAnZnVuY3Rpb24nIHx8IHNlbGVjdG9yLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzZWxlY3RvciA9IFtzZWxlY3Rvcl07XG4gICAgfVxuXG4gICAgZm9yIChpID0gMCwgaWVuID0gc2VsZWN0b3IubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIGEgPSBzZWxlY3RvcltpXSAmJiBzZWxlY3RvcltpXS5zcGxpdCAmJiAhc2VsZWN0b3JbaV0ubWF0Y2goL1tcXFtcXCg6XS8pID8gc2VsZWN0b3JbaV0uc3BsaXQoJywnKSA6IFtzZWxlY3RvcltpXV07XG5cbiAgICAgIGZvciAoaiA9IDAsIGplbiA9IGEubGVuZ3RoOyBqIDwgamVuOyBqKyspIHtcbiAgICAgICAgcmVzID0gc2VsZWN0Rm4odHlwZW9mIGFbal0gPT09ICdzdHJpbmcnID8gJC50cmltKGFbal0pIDogYVtqXSk7XG5cbiAgICAgICAgaWYgKHJlcyAmJiByZXMubGVuZ3RoKSB7XG4gICAgICAgICAgb3V0ID0gb3V0LmNvbmNhdChyZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGV4dCA9IF9leHQuc2VsZWN0b3JbdHlwZV07XG5cbiAgICBpZiAoZXh0Lmxlbmd0aCkge1xuICAgICAgZm9yIChpID0gMCwgaWVuID0gZXh0Lmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIG91dCA9IGV4dFtpXShzZXR0aW5ncywgb3B0cywgb3V0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gX3VuaXF1ZShvdXQpO1xuICB9O1xuXG4gIHZhciBfc2VsZWN0b3Jfb3B0cyA9IGZ1bmN0aW9uIF9zZWxlY3Rvcl9vcHRzKG9wdHMpIHtcbiAgICBpZiAoIW9wdHMpIHtcbiAgICAgIG9wdHMgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5maWx0ZXIgJiYgb3B0cy5zZWFyY2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0cy5zZWFyY2ggPSBvcHRzLmZpbHRlcjtcbiAgICB9XG5cbiAgICByZXR1cm4gJC5leHRlbmQoe1xuICAgICAgc2VhcmNoOiAnbm9uZScsXG4gICAgICBvcmRlcjogJ2N1cnJlbnQnLFxuICAgICAgcGFnZTogJ2FsbCdcbiAgICB9LCBvcHRzKTtcbiAgfTtcblxuICB2YXIgX3NlbGVjdG9yX2ZpcnN0ID0gZnVuY3Rpb24gX3NlbGVjdG9yX2ZpcnN0KGluc3QpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gaW5zdC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgaWYgKGluc3RbaV0ubGVuZ3RoID4gMCkge1xuICAgICAgICBpbnN0WzBdID0gaW5zdFtpXTtcbiAgICAgICAgaW5zdFswXS5sZW5ndGggPSAxO1xuICAgICAgICBpbnN0Lmxlbmd0aCA9IDE7XG4gICAgICAgIGluc3QuY29udGV4dCA9IFtpbnN0LmNvbnRleHRbaV1dO1xuICAgICAgICByZXR1cm4gaW5zdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbnN0Lmxlbmd0aCA9IDA7XG4gICAgcmV0dXJuIGluc3Q7XG4gIH07XG5cbiAgdmFyIF9zZWxlY3Rvcl9yb3dfaW5kZXhlcyA9IGZ1bmN0aW9uIF9zZWxlY3Rvcl9yb3dfaW5kZXhlcyhzZXR0aW5ncywgb3B0cykge1xuICAgIHZhciBpLFxuICAgICAgICBpZW4sXG4gICAgICAgIHRtcCxcbiAgICAgICAgYSA9IFtdLFxuICAgICAgICBkaXNwbGF5RmlsdGVyZWQgPSBzZXR0aW5ncy5haURpc3BsYXksXG4gICAgICAgIGRpc3BsYXlNYXN0ZXIgPSBzZXR0aW5ncy5haURpc3BsYXlNYXN0ZXI7XG4gICAgdmFyIHNlYXJjaCA9IG9wdHMuc2VhcmNoLFxuICAgICAgICBvcmRlciA9IG9wdHMub3JkZXIsXG4gICAgICAgIHBhZ2UgPSBvcHRzLnBhZ2U7XG5cbiAgICBpZiAoX2ZuRGF0YVNvdXJjZShzZXR0aW5ncykgPT0gJ3NzcCcpIHtcbiAgICAgIHJldHVybiBzZWFyY2ggPT09ICdyZW1vdmVkJyA/IFtdIDogX3JhbmdlKDAsIGRpc3BsYXlNYXN0ZXIubGVuZ3RoKTtcbiAgICB9IGVsc2UgaWYgKHBhZ2UgPT0gJ2N1cnJlbnQnKSB7XG4gICAgICBmb3IgKGkgPSBzZXR0aW5ncy5faURpc3BsYXlTdGFydCwgaWVuID0gc2V0dGluZ3MuZm5EaXNwbGF5RW5kKCk7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBhLnB1c2goZGlzcGxheUZpbHRlcmVkW2ldKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yZGVyID09ICdjdXJyZW50JyB8fCBvcmRlciA9PSAnYXBwbGllZCcpIHtcbiAgICAgIGlmIChzZWFyY2ggPT0gJ25vbmUnKSB7XG4gICAgICAgIGEgPSBkaXNwbGF5TWFzdGVyLnNsaWNlKCk7XG4gICAgICB9IGVsc2UgaWYgKHNlYXJjaCA9PSAnYXBwbGllZCcpIHtcbiAgICAgICAgYSA9IGRpc3BsYXlGaWx0ZXJlZC5zbGljZSgpO1xuICAgICAgfSBlbHNlIGlmIChzZWFyY2ggPT0gJ3JlbW92ZWQnKSB7XG4gICAgICAgIHZhciBkaXNwbGF5RmlsdGVyZWRNYXAgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gZGlzcGxheUZpbHRlcmVkLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgZGlzcGxheUZpbHRlcmVkTWFwW2Rpc3BsYXlGaWx0ZXJlZFtpXV0gPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgYSA9ICQubWFwKGRpc3BsYXlNYXN0ZXIsIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIHJldHVybiAhZGlzcGxheUZpbHRlcmVkTWFwLmhhc093blByb3BlcnR5KGVsKSA/IGVsIDogbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmRlciA9PSAnaW5kZXgnIHx8IG9yZGVyID09ICdvcmlnaW5hbCcpIHtcbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IHNldHRpbmdzLmFvRGF0YS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBpZiAoc2VhcmNoID09ICdub25lJykge1xuICAgICAgICAgIGEucHVzaChpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0bXAgPSAkLmluQXJyYXkoaSwgZGlzcGxheUZpbHRlcmVkKTtcblxuICAgICAgICAgIGlmICh0bXAgPT09IC0xICYmIHNlYXJjaCA9PSAncmVtb3ZlZCcgfHwgdG1wID49IDAgJiYgc2VhcmNoID09ICdhcHBsaWVkJykge1xuICAgICAgICAgICAgYS5wdXNoKGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhO1xuICB9O1xuXG4gIHZhciBfX3Jvd19zZWxlY3RvciA9IGZ1bmN0aW9uIF9fcm93X3NlbGVjdG9yKHNldHRpbmdzLCBzZWxlY3Rvciwgb3B0cykge1xuICAgIHZhciByb3dzO1xuXG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uIHJ1bihzZWwpIHtcbiAgICAgIHZhciBzZWxJbnQgPSBfaW50VmFsKHNlbCk7XG5cbiAgICAgIHZhciBpLCBpZW47XG4gICAgICB2YXIgYW9EYXRhID0gc2V0dGluZ3MuYW9EYXRhO1xuXG4gICAgICBpZiAoc2VsSW50ICE9PSBudWxsICYmICFvcHRzKSB7XG4gICAgICAgIHJldHVybiBbc2VsSW50XTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyb3dzKSB7XG4gICAgICAgIHJvd3MgPSBfc2VsZWN0b3Jfcm93X2luZGV4ZXMoc2V0dGluZ3MsIG9wdHMpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsSW50ICE9PSBudWxsICYmICQuaW5BcnJheShzZWxJbnQsIHJvd3MpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gW3NlbEludF07XG4gICAgICB9IGVsc2UgaWYgKHNlbCA9PT0gbnVsbCB8fCBzZWwgPT09IHVuZGVmaW5lZCB8fCBzZWwgPT09ICcnKSB7XG4gICAgICAgIHJldHVybiByb3dzO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHNlbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gJC5tYXAocm93cywgZnVuY3Rpb24gKGlkeCkge1xuICAgICAgICAgIHZhciByb3cgPSBhb0RhdGFbaWR4XTtcbiAgICAgICAgICByZXR1cm4gc2VsKGlkeCwgcm93Ll9hRGF0YSwgcm93Lm5UcikgPyBpZHggOiBudWxsO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbC5ub2RlTmFtZSkge1xuICAgICAgICB2YXIgcm93SWR4ID0gc2VsLl9EVF9Sb3dJbmRleDtcbiAgICAgICAgdmFyIGNlbGxJZHggPSBzZWwuX0RUX0NlbGxJbmRleDtcblxuICAgICAgICBpZiAocm93SWR4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gYW9EYXRhW3Jvd0lkeF0gJiYgYW9EYXRhW3Jvd0lkeF0ublRyID09PSBzZWwgPyBbcm93SWR4XSA6IFtdO1xuICAgICAgICB9IGVsc2UgaWYgKGNlbGxJZHgpIHtcbiAgICAgICAgICByZXR1cm4gYW9EYXRhW2NlbGxJZHgucm93XSAmJiBhb0RhdGFbY2VsbElkeC5yb3ddLm5UciA9PT0gc2VsID8gW2NlbGxJZHgucm93XSA6IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBob3N0ID0gJChzZWwpLmNsb3Nlc3QoJypbZGF0YS1kdC1yb3ddJyk7XG4gICAgICAgICAgcmV0dXJuIGhvc3QubGVuZ3RoID8gW2hvc3QuZGF0YSgnZHQtcm93JyldIDogW107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBzZWwgPT09ICdzdHJpbmcnICYmIHNlbC5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgICB2YXIgcm93T2JqID0gc2V0dGluZ3MuYUlkc1tzZWwucmVwbGFjZSgvXiMvLCAnJyldO1xuXG4gICAgICAgIGlmIChyb3dPYmogIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiBbcm93T2JqLmlkeF07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIG5vZGVzID0gX3JlbW92ZUVtcHR5KF9wbHVja19vcmRlcihzZXR0aW5ncy5hb0RhdGEsIHJvd3MsICduVHInKSk7XG5cbiAgICAgIHJldHVybiAkKG5vZGVzKS5maWx0ZXIoc2VsKS5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fRFRfUm93SW5kZXg7XG4gICAgICB9KS50b0FycmF5KCk7XG4gICAgfTtcblxuICAgIHJldHVybiBfc2VsZWN0b3JfcnVuKCdyb3cnLCBzZWxlY3RvciwgcnVuLCBzZXR0aW5ncywgb3B0cyk7XG4gIH07XG5cbiAgX2FwaV9yZWdpc3Rlcigncm93cygpJywgZnVuY3Rpb24gKHNlbGVjdG9yLCBvcHRzKSB7XG4gICAgaWYgKHNlbGVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHNlbGVjdG9yID0gJyc7XG4gICAgfSBlbHNlIGlmICgkLmlzUGxhaW5PYmplY3Qoc2VsZWN0b3IpKSB7XG4gICAgICBvcHRzID0gc2VsZWN0b3I7XG4gICAgICBzZWxlY3RvciA9ICcnO1xuICAgIH1cblxuICAgIG9wdHMgPSBfc2VsZWN0b3Jfb3B0cyhvcHRzKTtcbiAgICB2YXIgaW5zdCA9IHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICByZXR1cm4gX19yb3dfc2VsZWN0b3Ioc2V0dGluZ3MsIHNlbGVjdG9yLCBvcHRzKTtcbiAgICB9LCAxKTtcbiAgICBpbnN0LnNlbGVjdG9yLnJvd3MgPSBzZWxlY3RvcjtcbiAgICBpbnN0LnNlbGVjdG9yLm9wdHMgPSBvcHRzO1xuICAgIHJldHVybiBpbnN0O1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdyb3dzKCkubm9kZXMoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigncm93JywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3cpIHtcbiAgICAgIHJldHVybiBzZXR0aW5ncy5hb0RhdGFbcm93XS5uVHIgfHwgdW5kZWZpbmVkO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdyb3dzKCkuZGF0YSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKHRydWUsICdyb3dzJywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3dzKSB7XG4gICAgICByZXR1cm4gX3BsdWNrX29yZGVyKHNldHRpbmdzLmFvRGF0YSwgcm93cywgJ19hRGF0YScpO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdyb3dzKCkuY2FjaGUoKScsICdyb3coKS5jYWNoZSgpJywgZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigncm93JywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3cpIHtcbiAgICAgIHZhciByID0gc2V0dGluZ3MuYW9EYXRhW3Jvd107XG4gICAgICByZXR1cm4gdHlwZSA9PT0gJ3NlYXJjaCcgPyByLl9hRmlsdGVyRGF0YSA6IHIuX2FTb3J0RGF0YTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgncm93cygpLmludmFsaWRhdGUoKScsICdyb3coKS5pbnZhbGlkYXRlKCknLCBmdW5jdGlvbiAoc3JjKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3JvdycsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93KSB7XG4gICAgICBfZm5JbnZhbGlkYXRlKHNldHRpbmdzLCByb3csIHNyYyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ3Jvd3MoKS5pbmRleGVzKCknLCAncm93KCkuaW5kZXgoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigncm93JywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3cpIHtcbiAgICAgIHJldHVybiByb3c7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ3Jvd3MoKS5pZHMoKScsICdyb3coKS5pZCgpJywgZnVuY3Rpb24gKGhhc2gpIHtcbiAgICB2YXIgYSA9IFtdO1xuICAgIHZhciBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGNvbnRleHQubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwLCBqZW4gPSB0aGlzW2ldLmxlbmd0aDsgaiA8IGplbjsgaisrKSB7XG4gICAgICAgIHZhciBpZCA9IGNvbnRleHRbaV0ucm93SWRGbihjb250ZXh0W2ldLmFvRGF0YVt0aGlzW2ldW2pdXS5fYURhdGEpO1xuICAgICAgICBhLnB1c2goKGhhc2ggPT09IHRydWUgPyAnIycgOiAnJykgKyBpZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBfQXBpMihjb250ZXh0LCBhKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgncm93cygpLnJlbW92ZSgpJywgJ3JvdygpLnJlbW92ZSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGlzLml0ZXJhdG9yKCdyb3cnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIHJvdywgdGhhdElkeCkge1xuICAgICAgdmFyIGRhdGEgPSBzZXR0aW5ncy5hb0RhdGE7XG4gICAgICB2YXIgcm93RGF0YSA9IGRhdGFbcm93XTtcbiAgICAgIHZhciBpLCBpZW4sIGosIGplbjtcbiAgICAgIHZhciBsb29wUm93LCBsb29wQ2VsbHM7XG4gICAgICBkYXRhLnNwbGljZShyb3csIDEpO1xuXG4gICAgICBmb3IgKGkgPSAwLCBpZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGxvb3BSb3cgPSBkYXRhW2ldO1xuICAgICAgICBsb29wQ2VsbHMgPSBsb29wUm93LmFuQ2VsbHM7XG5cbiAgICAgICAgaWYgKGxvb3BSb3cublRyICE9PSBudWxsKSB7XG4gICAgICAgICAgbG9vcFJvdy5uVHIuX0RUX1Jvd0luZGV4ID0gaTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsb29wQ2VsbHMgIT09IG51bGwpIHtcbiAgICAgICAgICBmb3IgKGogPSAwLCBqZW4gPSBsb29wQ2VsbHMubGVuZ3RoOyBqIDwgamVuOyBqKyspIHtcbiAgICAgICAgICAgIGxvb3BDZWxsc1tqXS5fRFRfQ2VsbEluZGV4LnJvdyA9IGk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9mbkRlbGV0ZUluZGV4KHNldHRpbmdzLmFpRGlzcGxheU1hc3Rlciwgcm93KTtcblxuICAgICAgX2ZuRGVsZXRlSW5kZXgoc2V0dGluZ3MuYWlEaXNwbGF5LCByb3cpO1xuXG4gICAgICBfZm5EZWxldGVJbmRleCh0aGF0W3RoYXRJZHhdLCByb3csIGZhbHNlKTtcblxuICAgICAgaWYgKHNldHRpbmdzLl9pUmVjb3Jkc0Rpc3BsYXkgPiAwKSB7XG4gICAgICAgIHNldHRpbmdzLl9pUmVjb3Jkc0Rpc3BsYXktLTtcbiAgICAgIH1cblxuICAgICAgX2ZuTGVuZ3RoT3ZlcmZsb3coc2V0dGluZ3MpO1xuXG4gICAgICB2YXIgaWQgPSBzZXR0aW5ncy5yb3dJZEZuKHJvd0RhdGEuX2FEYXRhKTtcblxuICAgICAgaWYgKGlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGVsZXRlIHNldHRpbmdzLmFJZHNbaWRdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gc2V0dGluZ3MuYW9EYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIHNldHRpbmdzLmFvRGF0YVtpXS5pZHggPSBpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdyb3dzLmFkZCgpJywgZnVuY3Rpb24gKHJvd3MpIHtcbiAgICB2YXIgbmV3Um93cyA9IHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICB2YXIgcm93LCBpLCBpZW47XG4gICAgICB2YXIgb3V0ID0gW107XG5cbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IHJvd3MubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgcm93ID0gcm93c1tpXTtcblxuICAgICAgICBpZiAocm93Lm5vZGVOYW1lICYmIHJvdy5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09PSAnVFInKSB7XG4gICAgICAgICAgb3V0LnB1c2goX2ZuQWRkVHIoc2V0dGluZ3MsIHJvdylbMF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dC5wdXNoKF9mbkFkZERhdGEoc2V0dGluZ3MsIHJvdykpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfSwgMSk7XG4gICAgdmFyIG1vZFJvd3MgPSB0aGlzLnJvd3MoLTEpO1xuICAgIG1vZFJvd3MucG9wKCk7XG4gICAgJC5tZXJnZShtb2RSb3dzLCBuZXdSb3dzKTtcbiAgICByZXR1cm4gbW9kUm93cztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcigncm93KCknLCBmdW5jdGlvbiAoc2VsZWN0b3IsIG9wdHMpIHtcbiAgICByZXR1cm4gX3NlbGVjdG9yX2ZpcnN0KHRoaXMucm93cyhzZWxlY3Rvciwgb3B0cykpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdyb3coKS5kYXRhKCknLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gY3R4Lmxlbmd0aCAmJiB0aGlzLmxlbmd0aCA/IGN0eFswXS5hb0RhdGFbdGhpc1swXV0uX2FEYXRhIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZhciByb3cgPSBjdHhbMF0uYW9EYXRhW3RoaXNbMF1dO1xuICAgIHJvdy5fYURhdGEgPSBkYXRhO1xuXG4gICAgaWYgKCQuaXNBcnJheShkYXRhKSAmJiByb3cublRyLmlkKSB7XG4gICAgICBfZm5TZXRPYmplY3REYXRhRm4oY3R4WzBdLnJvd0lkKShkYXRhLCByb3cublRyLmlkKTtcbiAgICB9XG5cbiAgICBfZm5JbnZhbGlkYXRlKGN0eFswXSwgdGhpc1swXSwgJ2RhdGEnKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdyb3coKS5ub2RlKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcbiAgICByZXR1cm4gY3R4Lmxlbmd0aCAmJiB0aGlzLmxlbmd0aCA/IGN0eFswXS5hb0RhdGFbdGhpc1swXV0ublRyIHx8IG51bGwgOiBudWxsO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdyb3cuYWRkKCknLCBmdW5jdGlvbiAocm93KSB7XG4gICAgaWYgKHJvdyBpbnN0YW5jZW9mICQgJiYgcm93Lmxlbmd0aCkge1xuICAgICAgcm93ID0gcm93WzBdO1xuICAgIH1cblxuICAgIHZhciByb3dzID0gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIGlmIChyb3cubm9kZU5hbWUgJiYgcm93Lm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdUUicpIHtcbiAgICAgICAgcmV0dXJuIF9mbkFkZFRyKHNldHRpbmdzLCByb3cpWzBdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX2ZuQWRkRGF0YShzZXR0aW5ncywgcm93KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5yb3cocm93c1swXSk7XG4gIH0pO1xuXG4gIHZhciBfX2RldGFpbHNfYWRkID0gZnVuY3Rpb24gX19kZXRhaWxzX2FkZChjdHgsIHJvdywgZGF0YSwga2xhc3MpIHtcbiAgICB2YXIgcm93cyA9IFtdO1xuXG4gICAgdmFyIGFkZFJvdyA9IGZ1bmN0aW9uIGFkZFJvdyhyLCBrKSB7XG4gICAgICBpZiAoJC5pc0FycmF5KHIpIHx8IHIgaW5zdGFuY2VvZiAkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSByLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgYWRkUm93KHJbaV0sIGspO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoci5ub2RlTmFtZSAmJiByLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICd0cicpIHtcbiAgICAgICAgcm93cy5wdXNoKHIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGNyZWF0ZWQgPSAkKCc8dHI+PHRkLz48L3RyPicpLmFkZENsYXNzKGspO1xuICAgICAgICAkKCd0ZCcsIGNyZWF0ZWQpLmFkZENsYXNzKGspLmh0bWwocilbMF0uY29sU3BhbiA9IF9mblZpc2JsZUNvbHVtbnMoY3R4KTtcbiAgICAgICAgcm93cy5wdXNoKGNyZWF0ZWRbMF0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBhZGRSb3coZGF0YSwga2xhc3MpO1xuXG4gICAgaWYgKHJvdy5fZGV0YWlscykge1xuICAgICAgcm93Ll9kZXRhaWxzLmRldGFjaCgpO1xuICAgIH1cblxuICAgIHJvdy5fZGV0YWlscyA9ICQocm93cyk7XG5cbiAgICBpZiAocm93Ll9kZXRhaWxzU2hvdykge1xuICAgICAgcm93Ll9kZXRhaWxzLmluc2VydEFmdGVyKHJvdy5uVHIpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX19kZXRhaWxzX3JlbW92ZSA9IGZ1bmN0aW9uIF9fZGV0YWlsc19yZW1vdmUoYXBpLCBpZHgpIHtcbiAgICB2YXIgY3R4ID0gYXBpLmNvbnRleHQ7XG5cbiAgICBpZiAoY3R4Lmxlbmd0aCkge1xuICAgICAgdmFyIHJvdyA9IGN0eFswXS5hb0RhdGFbaWR4ICE9PSB1bmRlZmluZWQgPyBpZHggOiBhcGlbMF1dO1xuXG4gICAgICBpZiAocm93ICYmIHJvdy5fZGV0YWlscykge1xuICAgICAgICByb3cuX2RldGFpbHMucmVtb3ZlKCk7XG5cbiAgICAgICAgcm93Ll9kZXRhaWxzU2hvdyA9IHVuZGVmaW5lZDtcbiAgICAgICAgcm93Ll9kZXRhaWxzID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YXIgX19kZXRhaWxzX2Rpc3BsYXkgPSBmdW5jdGlvbiBfX2RldGFpbHNfZGlzcGxheShhcGksIHNob3cpIHtcbiAgICB2YXIgY3R4ID0gYXBpLmNvbnRleHQ7XG5cbiAgICBpZiAoY3R4Lmxlbmd0aCAmJiBhcGkubGVuZ3RoKSB7XG4gICAgICB2YXIgcm93ID0gY3R4WzBdLmFvRGF0YVthcGlbMF1dO1xuXG4gICAgICBpZiAocm93Ll9kZXRhaWxzKSB7XG4gICAgICAgIHJvdy5fZGV0YWlsc1Nob3cgPSBzaG93O1xuXG4gICAgICAgIGlmIChzaG93KSB7XG4gICAgICAgICAgcm93Ll9kZXRhaWxzLmluc2VydEFmdGVyKHJvdy5uVHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJvdy5fZGV0YWlscy5kZXRhY2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9fZGV0YWlsc19ldmVudHMoY3R4WzBdKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIF9fZGV0YWlsc19ldmVudHMgPSBmdW5jdGlvbiBfX2RldGFpbHNfZXZlbnRzKHNldHRpbmdzKSB7XG4gICAgdmFyIGFwaSA9IG5ldyBfQXBpMihzZXR0aW5ncyk7XG4gICAgdmFyIG5hbWVzcGFjZSA9ICcuZHQuRFRfZGV0YWlscyc7XG4gICAgdmFyIGRyYXdFdmVudCA9ICdkcmF3JyArIG5hbWVzcGFjZTtcbiAgICB2YXIgY29sdmlzRXZlbnQgPSAnY29sdW1uLXZpc2liaWxpdHknICsgbmFtZXNwYWNlO1xuICAgIHZhciBkZXN0cm95RXZlbnQgPSAnZGVzdHJveScgKyBuYW1lc3BhY2U7XG4gICAgdmFyIGRhdGEgPSBzZXR0aW5ncy5hb0RhdGE7XG4gICAgYXBpLm9mZihkcmF3RXZlbnQgKyAnICcgKyBjb2x2aXNFdmVudCArICcgJyArIGRlc3Ryb3lFdmVudCk7XG5cbiAgICBpZiAoX3BsdWNrKGRhdGEsICdfZGV0YWlscycpLmxlbmd0aCA+IDApIHtcbiAgICAgIGFwaS5vbihkcmF3RXZlbnQsIGZ1bmN0aW9uIChlLCBjdHgpIHtcbiAgICAgICAgaWYgKHNldHRpbmdzICE9PSBjdHgpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBhcGkucm93cyh7XG4gICAgICAgICAgcGFnZTogJ2N1cnJlbnQnXG4gICAgICAgIH0pLmVxKDApLmVhY2goZnVuY3Rpb24gKGlkeCkge1xuICAgICAgICAgIHZhciByb3cgPSBkYXRhW2lkeF07XG5cbiAgICAgICAgICBpZiAocm93Ll9kZXRhaWxzU2hvdykge1xuICAgICAgICAgICAgcm93Ll9kZXRhaWxzLmluc2VydEFmdGVyKHJvdy5uVHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGFwaS5vbihjb2x2aXNFdmVudCwgZnVuY3Rpb24gKGUsIGN0eCwgaWR4LCB2aXMpIHtcbiAgICAgICAgaWYgKHNldHRpbmdzICE9PSBjdHgpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcm93LFxuICAgICAgICAgICAgdmlzaWJsZSA9IF9mblZpc2JsZUNvbHVtbnMoY3R4KTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gZGF0YS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgIHJvdyA9IGRhdGFbaV07XG5cbiAgICAgICAgICBpZiAocm93Ll9kZXRhaWxzKSB7XG4gICAgICAgICAgICByb3cuX2RldGFpbHMuY2hpbGRyZW4oJ3RkW2NvbHNwYW5dJykuYXR0cignY29sc3BhbicsIHZpc2libGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhcGkub24oZGVzdHJveUV2ZW50LCBmdW5jdGlvbiAoZSwgY3R4KSB7XG4gICAgICAgIGlmIChzZXR0aW5ncyAhPT0gY3R4KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGRhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICBpZiAoZGF0YVtpXS5fZGV0YWlscykge1xuICAgICAgICAgICAgX19kZXRhaWxzX3JlbW92ZShhcGksIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBfZW1wID0gJyc7XG5cbiAgdmFyIF9jaGlsZF9vYmogPSBfZW1wICsgJ3JvdygpLmNoaWxkJztcblxuICB2YXIgX2NoaWxkX210aCA9IF9jaGlsZF9vYmogKyAnKCknO1xuXG4gIF9hcGlfcmVnaXN0ZXIoX2NoaWxkX210aCwgZnVuY3Rpb24gKGRhdGEsIGtsYXNzKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcblxuICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBjdHgubGVuZ3RoICYmIHRoaXMubGVuZ3RoID8gY3R4WzBdLmFvRGF0YVt0aGlzWzBdXS5fZGV0YWlscyA6IHVuZGVmaW5lZDtcbiAgICB9IGVsc2UgaWYgKGRhdGEgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuY2hpbGQuc2hvdygpO1xuICAgIH0gZWxzZSBpZiAoZGF0YSA9PT0gZmFsc2UpIHtcbiAgICAgIF9fZGV0YWlsc19yZW1vdmUodGhpcyk7XG4gICAgfSBlbHNlIGlmIChjdHgubGVuZ3RoICYmIHRoaXMubGVuZ3RoKSB7XG4gICAgICBfX2RldGFpbHNfYWRkKGN0eFswXSwgY3R4WzBdLmFvRGF0YVt0aGlzWzBdXSwgZGF0YSwga2xhc3MpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKFtfY2hpbGRfb2JqICsgJy5zaG93KCknLCBfY2hpbGRfbXRoICsgJy5zaG93KCknXSwgZnVuY3Rpb24gKHNob3cpIHtcbiAgICBfX2RldGFpbHNfZGlzcGxheSh0aGlzLCB0cnVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKFtfY2hpbGRfb2JqICsgJy5oaWRlKCknLCBfY2hpbGRfbXRoICsgJy5oaWRlKCknXSwgZnVuY3Rpb24gKCkge1xuICAgIF9fZGV0YWlsc19kaXNwbGF5KHRoaXMsIGZhbHNlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKFtfY2hpbGRfb2JqICsgJy5yZW1vdmUoKScsIF9jaGlsZF9tdGggKyAnLnJlbW92ZSgpJ10sIGZ1bmN0aW9uICgpIHtcbiAgICBfX2RldGFpbHNfcmVtb3ZlKHRoaXMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoX2NoaWxkX29iaiArICcuaXNTaG93bigpJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAoY3R4Lmxlbmd0aCAmJiB0aGlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGN0eFswXS5hb0RhdGFbdGhpc1swXV0uX2RldGFpbHNTaG93IHx8IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgdmFyIF9fcmVfY29sdW1uX3NlbGVjdG9yID0gL14oW146XSspOihuYW1lfHZpc0lkeHx2aXNpYmxlKSQvO1xuXG4gIHZhciBfX2NvbHVtbkRhdGEgPSBmdW5jdGlvbiBfX2NvbHVtbkRhdGEoc2V0dGluZ3MsIGNvbHVtbiwgcjEsIHIyLCByb3dzKSB7XG4gICAgdmFyIGEgPSBbXTtcblxuICAgIGZvciAodmFyIHJvdyA9IDAsIGllbiA9IHJvd3MubGVuZ3RoOyByb3cgPCBpZW47IHJvdysrKSB7XG4gICAgICBhLnB1c2goX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIHJvd3Nbcm93XSwgY29sdW1uKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGE7XG4gIH07XG5cbiAgdmFyIF9fY29sdW1uX3NlbGVjdG9yID0gZnVuY3Rpb24gX19jb2x1bW5fc2VsZWN0b3Ioc2V0dGluZ3MsIHNlbGVjdG9yLCBvcHRzKSB7XG4gICAgdmFyIGNvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnMsXG4gICAgICAgIG5hbWVzID0gX3BsdWNrKGNvbHVtbnMsICdzTmFtZScpLFxuICAgICAgICBub2RlcyA9IF9wbHVjayhjb2x1bW5zLCAnblRoJyk7XG5cbiAgICB2YXIgcnVuID0gZnVuY3Rpb24gcnVuKHMpIHtcbiAgICAgIHZhciBzZWxJbnQgPSBfaW50VmFsKHMpO1xuXG4gICAgICBpZiAocyA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIF9yYW5nZShjb2x1bW5zLmxlbmd0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWxJbnQgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFtzZWxJbnQgPj0gMCA/IHNlbEludCA6IGNvbHVtbnMubGVuZ3RoICsgc2VsSW50XTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciByb3dzID0gX3NlbGVjdG9yX3Jvd19pbmRleGVzKHNldHRpbmdzLCBvcHRzKTtcblxuICAgICAgICByZXR1cm4gJC5tYXAoY29sdW1ucywgZnVuY3Rpb24gKGNvbCwgaWR4KSB7XG4gICAgICAgICAgcmV0dXJuIHMoaWR4LCBfX2NvbHVtbkRhdGEoc2V0dGluZ3MsIGlkeCwgMCwgMCwgcm93cyksIG5vZGVzW2lkeF0pID8gaWR4IDogbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBtYXRjaCA9IHR5cGVvZiBzID09PSAnc3RyaW5nJyA/IHMubWF0Y2goX19yZV9jb2x1bW5fc2VsZWN0b3IpIDogJyc7XG5cbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBzd2l0Y2ggKG1hdGNoWzJdKSB7XG4gICAgICAgICAgY2FzZSAndmlzSWR4JzpcbiAgICAgICAgICBjYXNlICd2aXNpYmxlJzpcbiAgICAgICAgICAgIHZhciBpZHggPSBwYXJzZUludChtYXRjaFsxXSwgMTApO1xuXG4gICAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgICB2YXIgdmlzQ29sdW1ucyA9ICQubWFwKGNvbHVtbnMsIGZ1bmN0aW9uIChjb2wsIGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sLmJWaXNpYmxlID8gaSA6IG51bGw7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gW3Zpc0NvbHVtbnNbdmlzQ29sdW1ucy5sZW5ndGggKyBpZHhdXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFtfZm5WaXNpYmxlVG9Db2x1bW5JbmRleChzZXR0aW5ncywgaWR4KV07XG5cbiAgICAgICAgICBjYXNlICduYW1lJzpcbiAgICAgICAgICAgIHJldHVybiAkLm1hcChuYW1lcywgZnVuY3Rpb24gKG5hbWUsIGkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG5hbWUgPT09IG1hdGNoWzFdID8gaSA6IG51bGw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHMubm9kZU5hbWUgJiYgcy5fRFRfQ2VsbEluZGV4KSB7XG4gICAgICAgIHJldHVybiBbcy5fRFRfQ2VsbEluZGV4LmNvbHVtbl07XG4gICAgICB9XG5cbiAgICAgIHZhciBqcVJlc3VsdCA9ICQobm9kZXMpLmZpbHRlcihzKS5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJC5pbkFycmF5KHRoaXMsIG5vZGVzKTtcbiAgICAgIH0pLnRvQXJyYXkoKTtcblxuICAgICAgaWYgKGpxUmVzdWx0Lmxlbmd0aCB8fCAhcy5ub2RlTmFtZSkge1xuICAgICAgICByZXR1cm4ganFSZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBob3N0ID0gJChzKS5jbG9zZXN0KCcqW2RhdGEtZHQtY29sdW1uXScpO1xuICAgICAgcmV0dXJuIGhvc3QubGVuZ3RoID8gW2hvc3QuZGF0YSgnZHQtY29sdW1uJyldIDogW107XG4gICAgfTtcblxuICAgIHJldHVybiBfc2VsZWN0b3JfcnVuKCdjb2x1bW4nLCBzZWxlY3RvciwgcnVuLCBzZXR0aW5ncywgb3B0cyk7XG4gIH07XG5cbiAgdmFyIF9fc2V0Q29sdW1uVmlzID0gZnVuY3Rpb24gX19zZXRDb2x1bW5WaXMoc2V0dGluZ3MsIGNvbHVtbiwgdmlzKSB7XG4gICAgdmFyIGNvbHMgPSBzZXR0aW5ncy5hb0NvbHVtbnMsXG4gICAgICAgIGNvbCA9IGNvbHNbY29sdW1uXSxcbiAgICAgICAgZGF0YSA9IHNldHRpbmdzLmFvRGF0YSxcbiAgICAgICAgcm93LFxuICAgICAgICBjZWxscyxcbiAgICAgICAgaSxcbiAgICAgICAgaWVuLFxuICAgICAgICB0cjtcblxuICAgIGlmICh2aXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGNvbC5iVmlzaWJsZTtcbiAgICB9XG5cbiAgICBpZiAoY29sLmJWaXNpYmxlID09PSB2aXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodmlzKSB7XG4gICAgICB2YXIgaW5zZXJ0QmVmb3JlID0gJC5pbkFycmF5KHRydWUsIF9wbHVjayhjb2xzLCAnYlZpc2libGUnKSwgY29sdW1uICsgMSk7XG5cbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IGRhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgdHIgPSBkYXRhW2ldLm5UcjtcbiAgICAgICAgY2VsbHMgPSBkYXRhW2ldLmFuQ2VsbHM7XG5cbiAgICAgICAgaWYgKHRyKSB7XG4gICAgICAgICAgdHIuaW5zZXJ0QmVmb3JlKGNlbGxzW2NvbHVtbl0sIGNlbGxzW2luc2VydEJlZm9yZV0gfHwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgJChfcGx1Y2soc2V0dGluZ3MuYW9EYXRhLCAnYW5DZWxscycsIGNvbHVtbikpLmRldGFjaCgpO1xuICAgIH1cblxuICAgIGNvbC5iVmlzaWJsZSA9IHZpcztcblxuICAgIF9mbkRyYXdIZWFkKHNldHRpbmdzLCBzZXR0aW5ncy5hb0hlYWRlcik7XG5cbiAgICBfZm5EcmF3SGVhZChzZXR0aW5ncywgc2V0dGluZ3MuYW9Gb290ZXIpO1xuXG4gICAgaWYgKCFzZXR0aW5ncy5haURpc3BsYXkubGVuZ3RoKSB7XG4gICAgICAkKHNldHRpbmdzLm5UQm9keSkuZmluZCgndGRbY29sc3Bhbl0nKS5hdHRyKCdjb2xzcGFuJywgX2ZuVmlzYmxlQ29sdW1ucyhzZXR0aW5ncykpO1xuICAgIH1cblxuICAgIF9mblNhdmVTdGF0ZShzZXR0aW5ncyk7XG4gIH07XG5cbiAgX2FwaV9yZWdpc3RlcignY29sdW1ucygpJywgZnVuY3Rpb24gKHNlbGVjdG9yLCBvcHRzKSB7XG4gICAgaWYgKHNlbGVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHNlbGVjdG9yID0gJyc7XG4gICAgfSBlbHNlIGlmICgkLmlzUGxhaW5PYmplY3Qoc2VsZWN0b3IpKSB7XG4gICAgICBvcHRzID0gc2VsZWN0b3I7XG4gICAgICBzZWxlY3RvciA9ICcnO1xuICAgIH1cblxuICAgIG9wdHMgPSBfc2VsZWN0b3Jfb3B0cyhvcHRzKTtcbiAgICB2YXIgaW5zdCA9IHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICByZXR1cm4gX19jb2x1bW5fc2VsZWN0b3Ioc2V0dGluZ3MsIHNlbGVjdG9yLCBvcHRzKTtcbiAgICB9LCAxKTtcbiAgICBpbnN0LnNlbGVjdG9yLmNvbHMgPSBzZWxlY3RvcjtcbiAgICBpbnN0LnNlbGVjdG9yLm9wdHMgPSBvcHRzO1xuICAgIHJldHVybiBpbnN0O1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjb2x1bW5zKCkuaGVhZGVyKCknLCAnY29sdW1uKCkuaGVhZGVyKCknLCBmdW5jdGlvbiAoc2VsZWN0b3IsIG9wdHMpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY29sdW1uJywgZnVuY3Rpb24gKHNldHRpbmdzLCBjb2x1bW4pIHtcbiAgICAgIHJldHVybiBzZXR0aW5ncy5hb0NvbHVtbnNbY29sdW1uXS5uVGg7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NvbHVtbnMoKS5mb290ZXIoKScsICdjb2x1bW4oKS5mb290ZXIoKScsIGZ1bmN0aW9uIChzZWxlY3Rvciwgb3B0cykge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjb2x1bW4nLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbHVtbikge1xuICAgICAgcmV0dXJuIHNldHRpbmdzLmFvQ29sdW1uc1tjb2x1bW5dLm5UZjtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY29sdW1ucygpLmRhdGEoKScsICdjb2x1bW4oKS5kYXRhKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NvbHVtbi1yb3dzJywgX19jb2x1bW5EYXRhLCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY29sdW1ucygpLmRhdGFTcmMoKScsICdjb2x1bW4oKS5kYXRhU3JjKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NvbHVtbicsIGZ1bmN0aW9uIChzZXR0aW5ncywgY29sdW1uKSB7XG4gICAgICByZXR1cm4gc2V0dGluZ3MuYW9Db2x1bW5zW2NvbHVtbl0ubURhdGE7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NvbHVtbnMoKS5jYWNoZSgpJywgJ2NvbHVtbigpLmNhY2hlKCknLCBmdW5jdGlvbiAodHlwZSkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjb2x1bW4tcm93cycsIGZ1bmN0aW9uIChzZXR0aW5ncywgY29sdW1uLCBpLCBqLCByb3dzKSB7XG4gICAgICByZXR1cm4gX3BsdWNrX29yZGVyKHNldHRpbmdzLmFvRGF0YSwgcm93cywgdHlwZSA9PT0gJ3NlYXJjaCcgPyAnX2FGaWx0ZXJEYXRhJyA6ICdfYVNvcnREYXRhJywgY29sdW1uKTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY29sdW1ucygpLm5vZGVzKCknLCAnY29sdW1uKCkubm9kZXMoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY29sdW1uLXJvd3MnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbHVtbiwgaSwgaiwgcm93cykge1xuICAgICAgcmV0dXJuIF9wbHVja19vcmRlcihzZXR0aW5ncy5hb0RhdGEsIHJvd3MsICdhbkNlbGxzJywgY29sdW1uKTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY29sdW1ucygpLnZpc2libGUoKScsICdjb2x1bW4oKS52aXNpYmxlKCknLCBmdW5jdGlvbiAodmlzLCBjYWxjKSB7XG4gICAgdmFyIHJldCA9IHRoaXMuaXRlcmF0b3IoJ2NvbHVtbicsIGZ1bmN0aW9uIChzZXR0aW5ncywgY29sdW1uKSB7XG4gICAgICBpZiAodmlzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHNldHRpbmdzLmFvQ29sdW1uc1tjb2x1bW5dLmJWaXNpYmxlO1xuICAgICAgfVxuXG4gICAgICBfX3NldENvbHVtblZpcyhzZXR0aW5ncywgY29sdW1uLCB2aXMpO1xuICAgIH0pO1xuXG4gICAgaWYgKHZpcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLml0ZXJhdG9yKCdjb2x1bW4nLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbHVtbikge1xuICAgICAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIG51bGwsICdjb2x1bW4tdmlzaWJpbGl0eScsIFtzZXR0aW5ncywgY29sdW1uLCB2aXMsIGNhbGNdKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoY2FsYyA9PT0gdW5kZWZpbmVkIHx8IGNhbGMpIHtcbiAgICAgICAgdGhpcy5jb2x1bW5zLmFkanVzdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NvbHVtbnMoKS5pbmRleGVzKCknLCAnY29sdW1uKCkuaW5kZXgoKScsIGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NvbHVtbicsIGZ1bmN0aW9uIChzZXR0aW5ncywgY29sdW1uKSB7XG4gICAgICByZXR1cm4gdHlwZSA9PT0gJ3Zpc2libGUnID8gX2ZuQ29sdW1uSW5kZXhUb1Zpc2libGUoc2V0dGluZ3MsIGNvbHVtbikgOiBjb2x1bW47XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2NvbHVtbnMuYWRqdXN0KCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBfZm5BZGp1c3RDb2x1bW5TaXppbmcoc2V0dGluZ3MpO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdjb2x1bW4uaW5kZXgoKScsIGZ1bmN0aW9uICh0eXBlLCBpZHgpIHtcbiAgICBpZiAodGhpcy5jb250ZXh0Lmxlbmd0aCAhPT0gMCkge1xuICAgICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dFswXTtcblxuICAgICAgaWYgKHR5cGUgPT09ICdmcm9tVmlzaWJsZScgfHwgdHlwZSA9PT0gJ3RvRGF0YScpIHtcbiAgICAgICAgcmV0dXJuIF9mblZpc2libGVUb0NvbHVtbkluZGV4KGN0eCwgaWR4KTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2Zyb21EYXRhJyB8fCB0eXBlID09PSAndG9WaXNpYmxlJykge1xuICAgICAgICByZXR1cm4gX2ZuQ29sdW1uSW5kZXhUb1Zpc2libGUoY3R4LCBpZHgpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignY29sdW1uKCknLCBmdW5jdGlvbiAoc2VsZWN0b3IsIG9wdHMpIHtcbiAgICByZXR1cm4gX3NlbGVjdG9yX2ZpcnN0KHRoaXMuY29sdW1ucyhzZWxlY3Rvciwgb3B0cykpO1xuICB9KTtcblxuICB2YXIgX19jZWxsX3NlbGVjdG9yID0gZnVuY3Rpb24gX19jZWxsX3NlbGVjdG9yKHNldHRpbmdzLCBzZWxlY3Rvciwgb3B0cykge1xuICAgIHZhciBkYXRhID0gc2V0dGluZ3MuYW9EYXRhO1xuXG4gICAgdmFyIHJvd3MgPSBfc2VsZWN0b3Jfcm93X2luZGV4ZXMoc2V0dGluZ3MsIG9wdHMpO1xuXG4gICAgdmFyIGNlbGxzID0gX3JlbW92ZUVtcHR5KF9wbHVja19vcmRlcihkYXRhLCByb3dzLCAnYW5DZWxscycpKTtcblxuICAgIHZhciBhbGxDZWxscyA9ICQoW10uY29uY2F0LmFwcGx5KFtdLCBjZWxscykpO1xuICAgIHZhciByb3c7XG4gICAgdmFyIGNvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnMubGVuZ3RoO1xuICAgIHZhciBhLCBpLCBpZW4sIGosIG8sIGhvc3Q7XG5cbiAgICB2YXIgcnVuID0gZnVuY3Rpb24gcnVuKHMpIHtcbiAgICAgIHZhciBmblNlbGVjdG9yID0gdHlwZW9mIHMgPT09ICdmdW5jdGlvbic7XG5cbiAgICAgIGlmIChzID09PSBudWxsIHx8IHMgPT09IHVuZGVmaW5lZCB8fCBmblNlbGVjdG9yKSB7XG4gICAgICAgIGEgPSBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBpZW4gPSByb3dzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgcm93ID0gcm93c1tpXTtcblxuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBjb2x1bW5zOyBqKyspIHtcbiAgICAgICAgICAgIG8gPSB7XG4gICAgICAgICAgICAgIHJvdzogcm93LFxuICAgICAgICAgICAgICBjb2x1bW46IGpcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChmblNlbGVjdG9yKSB7XG4gICAgICAgICAgICAgIGhvc3QgPSBkYXRhW3Jvd107XG5cbiAgICAgICAgICAgICAgaWYgKHMobywgX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIHJvdywgaiksIGhvc3QuYW5DZWxscyA/IGhvc3QuYW5DZWxsc1tqXSA6IG51bGwpKSB7XG4gICAgICAgICAgICAgICAgYS5wdXNoKG8pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhLnB1c2gobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgICB9XG5cbiAgICAgIGlmICgkLmlzUGxhaW5PYmplY3QocykpIHtcbiAgICAgICAgcmV0dXJuIHMuY29sdW1uICE9PSB1bmRlZmluZWQgJiYgcy5yb3cgIT09IHVuZGVmaW5lZCAmJiAkLmluQXJyYXkocy5yb3csIHJvd3MpICE9PSAtMSA/IFtzXSA6IFtdO1xuICAgICAgfVxuXG4gICAgICB2YXIganFSZXN1bHQgPSBhbGxDZWxscy5maWx0ZXIocykubWFwKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJvdzogZWwuX0RUX0NlbGxJbmRleC5yb3csXG4gICAgICAgICAgY29sdW1uOiBlbC5fRFRfQ2VsbEluZGV4LmNvbHVtblxuICAgICAgICB9O1xuICAgICAgfSkudG9BcnJheSgpO1xuXG4gICAgICBpZiAoanFSZXN1bHQubGVuZ3RoIHx8ICFzLm5vZGVOYW1lKSB7XG4gICAgICAgIHJldHVybiBqcVJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgaG9zdCA9ICQocykuY2xvc2VzdCgnKltkYXRhLWR0LXJvd10nKTtcbiAgICAgIHJldHVybiBob3N0Lmxlbmd0aCA/IFt7XG4gICAgICAgIHJvdzogaG9zdC5kYXRhKCdkdC1yb3cnKSxcbiAgICAgICAgY29sdW1uOiBob3N0LmRhdGEoJ2R0LWNvbHVtbicpXG4gICAgICB9XSA6IFtdO1xuICAgIH07XG5cbiAgICByZXR1cm4gX3NlbGVjdG9yX3J1bignY2VsbCcsIHNlbGVjdG9yLCBydW4sIHNldHRpbmdzLCBvcHRzKTtcbiAgfTtcblxuICBfYXBpX3JlZ2lzdGVyKCdjZWxscygpJywgZnVuY3Rpb24gKHJvd1NlbGVjdG9yLCBjb2x1bW5TZWxlY3Rvciwgb3B0cykge1xuICAgIGlmICgkLmlzUGxhaW5PYmplY3Qocm93U2VsZWN0b3IpKSB7XG4gICAgICBpZiAocm93U2VsZWN0b3Iucm93ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb3B0cyA9IHJvd1NlbGVjdG9yO1xuICAgICAgICByb3dTZWxlY3RvciA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRzID0gY29sdW1uU2VsZWN0b3I7XG4gICAgICAgIGNvbHVtblNlbGVjdG9yID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoJC5pc1BsYWluT2JqZWN0KGNvbHVtblNlbGVjdG9yKSkge1xuICAgICAgb3B0cyA9IGNvbHVtblNlbGVjdG9yO1xuICAgICAgY29sdW1uU2VsZWN0b3IgPSBudWxsO1xuICAgIH1cblxuICAgIGlmIChjb2x1bW5TZWxlY3RvciA9PT0gbnVsbCB8fCBjb2x1bW5TZWxlY3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgICAgcmV0dXJuIF9fY2VsbF9zZWxlY3RvcihzZXR0aW5ncywgcm93U2VsZWN0b3IsIF9zZWxlY3Rvcl9vcHRzKG9wdHMpKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBjb2x1bW5zID0gdGhpcy5jb2x1bW5zKGNvbHVtblNlbGVjdG9yKTtcbiAgICB2YXIgcm93cyA9IHRoaXMucm93cyhyb3dTZWxlY3Rvcik7XG4gICAgdmFyIGEsIGksIGllbiwgaiwgamVuO1xuICAgIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzLCBpZHgpIHtcbiAgICAgIGEgPSBbXTtcblxuICAgICAgZm9yIChpID0gMCwgaWVuID0gcm93c1tpZHhdLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGZvciAoaiA9IDAsIGplbiA9IGNvbHVtbnNbaWR4XS5sZW5ndGg7IGogPCBqZW47IGorKykge1xuICAgICAgICAgIGEucHVzaCh7XG4gICAgICAgICAgICByb3c6IHJvd3NbaWR4XVtpXSxcbiAgICAgICAgICAgIGNvbHVtbjogY29sdW1uc1tpZHhdW2pdXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCAxKTtcbiAgICB2YXIgY2VsbHMgPSB0aGlzLmNlbGxzKGEsIG9wdHMpO1xuICAgICQuZXh0ZW5kKGNlbGxzLnNlbGVjdG9yLCB7XG4gICAgICBjb2xzOiBjb2x1bW5TZWxlY3RvcixcbiAgICAgIHJvd3M6IHJvd1NlbGVjdG9yLFxuICAgICAgb3B0czogb3B0c1xuICAgIH0pO1xuICAgIHJldHVybiBjZWxscztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY2VsbHMoKS5ub2RlcygpJywgJ2NlbGwoKS5ub2RlKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NlbGwnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIHJvdywgY29sdW1uKSB7XG4gICAgICB2YXIgZGF0YSA9IHNldHRpbmdzLmFvRGF0YVtyb3ddO1xuICAgICAgcmV0dXJuIGRhdGEgJiYgZGF0YS5hbkNlbGxzID8gZGF0YS5hbkNlbGxzW2NvbHVtbl0gOiB1bmRlZmluZWQ7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2NlbGxzKCkuZGF0YSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjZWxsJywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3csIGNvbHVtbikge1xuICAgICAgcmV0dXJuIF9mbkdldENlbGxEYXRhKHNldHRpbmdzLCByb3csIGNvbHVtbik7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NlbGxzKCkuY2FjaGUoKScsICdjZWxsKCkuY2FjaGUoKScsIGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdHlwZSA9IHR5cGUgPT09ICdzZWFyY2gnID8gJ19hRmlsdGVyRGF0YScgOiAnX2FTb3J0RGF0YSc7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NlbGwnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIHJvdywgY29sdW1uKSB7XG4gICAgICByZXR1cm4gc2V0dGluZ3MuYW9EYXRhW3Jvd11bdHlwZV1bY29sdW1uXTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY2VsbHMoKS5yZW5kZXIoKScsICdjZWxsKCkucmVuZGVyKCknLCBmdW5jdGlvbiAodHlwZSkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjZWxsJywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3csIGNvbHVtbikge1xuICAgICAgcmV0dXJuIF9mbkdldENlbGxEYXRhKHNldHRpbmdzLCByb3csIGNvbHVtbiwgdHlwZSk7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NlbGxzKCkuaW5kZXhlcygpJywgJ2NlbGwoKS5pbmRleCgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjZWxsJywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3csIGNvbHVtbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcm93OiByb3csXG4gICAgICAgIGNvbHVtbjogY29sdW1uLFxuICAgICAgICBjb2x1bW5WaXNpYmxlOiBfZm5Db2x1bW5JbmRleFRvVmlzaWJsZShzZXR0aW5ncywgY29sdW1uKVxuICAgICAgfTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY2VsbHMoKS5pbnZhbGlkYXRlKCknLCAnY2VsbCgpLmludmFsaWRhdGUoKScsIGZ1bmN0aW9uIChzcmMpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY2VsbCcsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93LCBjb2x1bW4pIHtcbiAgICAgIF9mbkludmFsaWRhdGUoc2V0dGluZ3MsIHJvdywgc3JjLCBjb2x1bW4pO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdjZWxsKCknLCBmdW5jdGlvbiAocm93U2VsZWN0b3IsIGNvbHVtblNlbGVjdG9yLCBvcHRzKSB7XG4gICAgcmV0dXJuIF9zZWxlY3Rvcl9maXJzdCh0aGlzLmNlbGxzKHJvd1NlbGVjdG9yLCBjb2x1bW5TZWxlY3Rvciwgb3B0cykpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdjZWxsKCkuZGF0YSgpJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuICAgIHZhciBjZWxsID0gdGhpc1swXTtcblxuICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBjdHgubGVuZ3RoICYmIGNlbGwubGVuZ3RoID8gX2ZuR2V0Q2VsbERhdGEoY3R4WzBdLCBjZWxsWzBdLnJvdywgY2VsbFswXS5jb2x1bW4pIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIF9mblNldENlbGxEYXRhKGN0eFswXSwgY2VsbFswXS5yb3csIGNlbGxbMF0uY29sdW1uLCBkYXRhKTtcblxuICAgIF9mbkludmFsaWRhdGUoY3R4WzBdLCBjZWxsWzBdLnJvdywgJ2RhdGEnLCBjZWxsWzBdLmNvbHVtbik7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcignb3JkZXIoKScsIGZ1bmN0aW9uIChvcmRlciwgZGlyKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcblxuICAgIGlmIChvcmRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gY3R4Lmxlbmd0aCAhPT0gMCA/IGN0eFswXS5hYVNvcnRpbmcgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcmRlciA9PT0gJ251bWJlcicpIHtcbiAgICAgIG9yZGVyID0gW1tvcmRlciwgZGlyXV07XG4gICAgfSBlbHNlIGlmIChvcmRlci5sZW5ndGggJiYgISQuaXNBcnJheShvcmRlclswXSkpIHtcbiAgICAgIG9yZGVyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIHNldHRpbmdzLmFhU29ydGluZyA9IG9yZGVyLnNsaWNlKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ29yZGVyLmxpc3RlbmVyKCknLCBmdW5jdGlvbiAobm9kZSwgY29sdW1uLCBjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgX2ZuU29ydEF0dGFjaExpc3RlbmVyKHNldHRpbmdzLCBub2RlLCBjb2x1bW4sIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcignb3JkZXIuZml4ZWQoKScsIGZ1bmN0aW9uIChzZXQpIHtcbiAgICBpZiAoIXNldCkge1xuICAgICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcbiAgICAgIHZhciBmaXhlZCA9IGN0eC5sZW5ndGggPyBjdHhbMF0uYWFTb3J0aW5nRml4ZWQgOiB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4gJC5pc0FycmF5KGZpeGVkKSA/IHtcbiAgICAgICAgcHJlOiBmaXhlZFxuICAgICAgfSA6IGZpeGVkO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgc2V0dGluZ3MuYWFTb3J0aW5nRml4ZWQgPSAkLmV4dGVuZCh0cnVlLCB7fSwgc2V0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcihbJ2NvbHVtbnMoKS5vcmRlcigpJywgJ2NvbHVtbigpLm9yZGVyKCknXSwgZnVuY3Rpb24gKGRpcikge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGkpIHtcbiAgICAgIHZhciBzb3J0ID0gW107XG4gICAgICAkLmVhY2godGhhdFtpXSwgZnVuY3Rpb24gKGosIGNvbCkge1xuICAgICAgICBzb3J0LnB1c2goW2NvbCwgZGlyXSk7XG4gICAgICB9KTtcbiAgICAgIHNldHRpbmdzLmFhU29ydGluZyA9IHNvcnQ7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3NlYXJjaCgpJywgZnVuY3Rpb24gKGlucHV0LCByZWdleCwgc21hcnQsIGNhc2VJbnNlbikge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAoaW5wdXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGN0eC5sZW5ndGggIT09IDAgPyBjdHhbMF0ub1ByZXZpb3VzU2VhcmNoLnNTZWFyY2ggOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBpZiAoIXNldHRpbmdzLm9GZWF0dXJlcy5iRmlsdGVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgX2ZuRmlsdGVyQ29tcGxldGUoc2V0dGluZ3MsICQuZXh0ZW5kKHt9LCBzZXR0aW5ncy5vUHJldmlvdXNTZWFyY2gsIHtcbiAgICAgICAgXCJzU2VhcmNoXCI6IGlucHV0ICsgXCJcIixcbiAgICAgICAgXCJiUmVnZXhcIjogcmVnZXggPT09IG51bGwgPyBmYWxzZSA6IHJlZ2V4LFxuICAgICAgICBcImJTbWFydFwiOiBzbWFydCA9PT0gbnVsbCA/IHRydWUgOiBzbWFydCxcbiAgICAgICAgXCJiQ2FzZUluc2Vuc2l0aXZlXCI6IGNhc2VJbnNlbiA9PT0gbnVsbCA/IHRydWUgOiBjYXNlSW5zZW5cbiAgICAgIH0pLCAxKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY29sdW1ucygpLnNlYXJjaCgpJywgJ2NvbHVtbigpLnNlYXJjaCgpJywgZnVuY3Rpb24gKGlucHV0LCByZWdleCwgc21hcnQsIGNhc2VJbnNlbikge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjb2x1bW4nLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbHVtbikge1xuICAgICAgdmFyIHByZVNlYXJjaCA9IHNldHRpbmdzLmFvUHJlU2VhcmNoQ29scztcblxuICAgICAgaWYgKGlucHV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHByZVNlYXJjaFtjb2x1bW5dLnNTZWFyY2g7XG4gICAgICB9XG5cbiAgICAgIGlmICghc2V0dGluZ3Mub0ZlYXR1cmVzLmJGaWx0ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkLmV4dGVuZChwcmVTZWFyY2hbY29sdW1uXSwge1xuICAgICAgICBcInNTZWFyY2hcIjogaW5wdXQgKyBcIlwiLFxuICAgICAgICBcImJSZWdleFwiOiByZWdleCA9PT0gbnVsbCA/IGZhbHNlIDogcmVnZXgsXG4gICAgICAgIFwiYlNtYXJ0XCI6IHNtYXJ0ID09PSBudWxsID8gdHJ1ZSA6IHNtYXJ0LFxuICAgICAgICBcImJDYXNlSW5zZW5zaXRpdmVcIjogY2FzZUluc2VuID09PSBudWxsID8gdHJ1ZSA6IGNhc2VJbnNlblxuICAgICAgfSk7XG5cbiAgICAgIF9mbkZpbHRlckNvbXBsZXRlKHNldHRpbmdzLCBzZXR0aW5ncy5vUHJldmlvdXNTZWFyY2gsIDEpO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdzdGF0ZSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQubGVuZ3RoID8gdGhpcy5jb250ZXh0WzBdLm9TYXZlZFN0YXRlIDogbnVsbDtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcignc3RhdGUuY2xlYXIoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIHNldHRpbmdzLmZuU3RhdGVTYXZlQ2FsbGJhY2suY2FsbChzZXR0aW5ncy5vSW5zdGFuY2UsIHNldHRpbmdzLCB7fSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3N0YXRlLmxvYWRlZCgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQubGVuZ3RoID8gdGhpcy5jb250ZXh0WzBdLm9Mb2FkZWRTdGF0ZSA6IG51bGw7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3N0YXRlLnNhdmUoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIF9mblNhdmVTdGF0ZShzZXR0aW5ncyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIERhdGFUYWJsZS52ZXJzaW9uQ2hlY2sgPSBEYXRhVGFibGUuZm5WZXJzaW9uQ2hlY2sgPSBmdW5jdGlvbiAodmVyc2lvbikge1xuICAgIHZhciBhVGhpcyA9IERhdGFUYWJsZS52ZXJzaW9uLnNwbGl0KCcuJyk7XG4gICAgdmFyIGFUaGF0ID0gdmVyc2lvbi5zcGxpdCgnLicpO1xuICAgIHZhciBpVGhpcywgaVRoYXQ7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGFUaGF0Lmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgaVRoaXMgPSBwYXJzZUludChhVGhpc1tpXSwgMTApIHx8IDA7XG4gICAgICBpVGhhdCA9IHBhcnNlSW50KGFUaGF0W2ldLCAxMCkgfHwgMDtcblxuICAgICAgaWYgKGlUaGlzID09PSBpVGhhdCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlUaGlzID4gaVRoYXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgRGF0YVRhYmxlLmlzRGF0YVRhYmxlID0gRGF0YVRhYmxlLmZuSXNEYXRhVGFibGUgPSBmdW5jdGlvbiAodGFibGUpIHtcbiAgICB2YXIgdCA9ICQodGFibGUpLmdldCgwKTtcbiAgICB2YXIgaXMgPSBmYWxzZTtcblxuICAgIGlmICh0YWJsZSBpbnN0YW5jZW9mIERhdGFUYWJsZS5BcGkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgICQuZWFjaChEYXRhVGFibGUuc2V0dGluZ3MsIGZ1bmN0aW9uIChpLCBvKSB7XG4gICAgICB2YXIgaGVhZCA9IG8ublNjcm9sbEhlYWQgPyAkKCd0YWJsZScsIG8ublNjcm9sbEhlYWQpWzBdIDogbnVsbDtcbiAgICAgIHZhciBmb290ID0gby5uU2Nyb2xsRm9vdCA/ICQoJ3RhYmxlJywgby5uU2Nyb2xsRm9vdClbMF0gOiBudWxsO1xuXG4gICAgICBpZiAoby5uVGFibGUgPT09IHQgfHwgaGVhZCA9PT0gdCB8fCBmb290ID09PSB0KSB7XG4gICAgICAgIGlzID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaXM7XG4gIH07XG5cbiAgRGF0YVRhYmxlLnRhYmxlcyA9IERhdGFUYWJsZS5mblRhYmxlcyA9IGZ1bmN0aW9uICh2aXNpYmxlKSB7XG4gICAgdmFyIGFwaSA9IGZhbHNlO1xuXG4gICAgaWYgKCQuaXNQbGFpbk9iamVjdCh2aXNpYmxlKSkge1xuICAgICAgYXBpID0gdmlzaWJsZS5hcGk7XG4gICAgICB2aXNpYmxlID0gdmlzaWJsZS52aXNpYmxlO1xuICAgIH1cblxuICAgIHZhciBhID0gJC5tYXAoRGF0YVRhYmxlLnNldHRpbmdzLCBmdW5jdGlvbiAobykge1xuICAgICAgaWYgKCF2aXNpYmxlIHx8IHZpc2libGUgJiYgJChvLm5UYWJsZSkuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgcmV0dXJuIG8ublRhYmxlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBhcGkgPyBuZXcgX0FwaTIoYSkgOiBhO1xuICB9O1xuXG4gIERhdGFUYWJsZS5jYW1lbFRvSHVuZ2FyaWFuID0gX2ZuQ2FtZWxUb0h1bmdhcmlhbjtcblxuICBfYXBpX3JlZ2lzdGVyKCckKCknLCBmdW5jdGlvbiAoc2VsZWN0b3IsIG9wdHMpIHtcbiAgICB2YXIgcm93cyA9IHRoaXMucm93cyhvcHRzKS5ub2RlcygpLFxuICAgICAgICBqcVJvd3MgPSAkKHJvd3MpO1xuICAgIHJldHVybiAkKFtdLmNvbmNhdChqcVJvd3MuZmlsdGVyKHNlbGVjdG9yKS50b0FycmF5KCksIGpxUm93cy5maW5kKHNlbGVjdG9yKS50b0FycmF5KCkpKTtcbiAgfSk7XG5cbiAgJC5lYWNoKFsnb24nLCAnb25lJywgJ29mZiddLCBmdW5jdGlvbiAoaSwga2V5KSB7XG4gICAgX2FwaV9yZWdpc3RlcihrZXkgKyAnKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICBhcmdzWzBdID0gJC5tYXAoYXJnc1swXS5zcGxpdCgvXFxzLyksIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiAhZS5tYXRjaCgvXFwuZHRcXGIvKSA/IGUgKyAnLmR0JyA6IGU7XG4gICAgICB9KS5qb2luKCcgJyk7XG4gICAgICB2YXIgaW5zdCA9ICQodGhpcy50YWJsZXMoKS5ub2RlcygpKTtcbiAgICAgIGluc3Rba2V5XS5hcHBseShpbnN0LCBhcmdzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdjbGVhcigpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgX2ZuQ2xlYXJUYWJsZShzZXR0aW5ncyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3NldHRpbmdzKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBfQXBpMih0aGlzLmNvbnRleHQsIHRoaXMuY29udGV4dCk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2luaXQoKScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuICAgIHJldHVybiBjdHgubGVuZ3RoID8gY3R4WzBdLm9Jbml0IDogbnVsbDtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignZGF0YSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgcmV0dXJuIF9wbHVjayhzZXR0aW5ncy5hb0RhdGEsICdfYURhdGEnKTtcbiAgICB9KS5mbGF0dGVuKCk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2Rlc3Ryb3koKScsIGZ1bmN0aW9uIChyZW1vdmUpIHtcbiAgICByZW1vdmUgPSByZW1vdmUgfHwgZmFsc2U7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICB2YXIgb3JpZyA9IHNldHRpbmdzLm5UYWJsZVdyYXBwZXIucGFyZW50Tm9kZTtcbiAgICAgIHZhciBjbGFzc2VzID0gc2V0dGluZ3Mub0NsYXNzZXM7XG4gICAgICB2YXIgdGFibGUgPSBzZXR0aW5ncy5uVGFibGU7XG4gICAgICB2YXIgdGJvZHkgPSBzZXR0aW5ncy5uVEJvZHk7XG4gICAgICB2YXIgdGhlYWQgPSBzZXR0aW5ncy5uVEhlYWQ7XG4gICAgICB2YXIgdGZvb3QgPSBzZXR0aW5ncy5uVEZvb3Q7XG4gICAgICB2YXIganFUYWJsZSA9ICQodGFibGUpO1xuICAgICAgdmFyIGpxVGJvZHkgPSAkKHRib2R5KTtcbiAgICAgIHZhciBqcVdyYXBwZXIgPSAkKHNldHRpbmdzLm5UYWJsZVdyYXBwZXIpO1xuICAgICAgdmFyIHJvd3MgPSAkLm1hcChzZXR0aW5ncy5hb0RhdGEsIGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHJldHVybiByLm5UcjtcbiAgICAgIH0pO1xuICAgICAgdmFyIGksIGllbjtcbiAgICAgIHNldHRpbmdzLmJEZXN0cm95aW5nID0gdHJ1ZTtcblxuICAgICAgX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCBcImFvRGVzdHJveUNhbGxiYWNrXCIsIFwiZGVzdHJveVwiLCBbc2V0dGluZ3NdKTtcblxuICAgICAgaWYgKCFyZW1vdmUpIHtcbiAgICAgICAgbmV3IF9BcGkyKHNldHRpbmdzKS5jb2x1bW5zKCkudmlzaWJsZSh0cnVlKTtcbiAgICAgIH1cblxuICAgICAganFXcmFwcGVyLm9mZignLkRUJykuZmluZCgnOm5vdCh0Ym9keSAqKScpLm9mZignLkRUJyk7XG4gICAgICAkKHdpbmRvdykub2ZmKCcuRFQtJyArIHNldHRpbmdzLnNJbnN0YW5jZSk7XG5cbiAgICAgIGlmICh0YWJsZSAhPSB0aGVhZC5wYXJlbnROb2RlKSB7XG4gICAgICAgIGpxVGFibGUuY2hpbGRyZW4oJ3RoZWFkJykuZGV0YWNoKCk7XG4gICAgICAgIGpxVGFibGUuYXBwZW5kKHRoZWFkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRmb290ICYmIHRhYmxlICE9IHRmb290LnBhcmVudE5vZGUpIHtcbiAgICAgICAganFUYWJsZS5jaGlsZHJlbigndGZvb3QnKS5kZXRhY2goKTtcbiAgICAgICAganFUYWJsZS5hcHBlbmQodGZvb3QpO1xuICAgICAgfVxuXG4gICAgICBzZXR0aW5ncy5hYVNvcnRpbmcgPSBbXTtcbiAgICAgIHNldHRpbmdzLmFhU29ydGluZ0ZpeGVkID0gW107XG5cbiAgICAgIF9mblNvcnRpbmdDbGFzc2VzKHNldHRpbmdzKTtcblxuICAgICAgJChyb3dzKS5yZW1vdmVDbGFzcyhzZXR0aW5ncy5hc1N0cmlwZUNsYXNzZXMuam9pbignICcpKTtcbiAgICAgICQoJ3RoLCB0ZCcsIHRoZWFkKS5yZW1vdmVDbGFzcyhjbGFzc2VzLnNTb3J0YWJsZSArICcgJyArIGNsYXNzZXMuc1NvcnRhYmxlQXNjICsgJyAnICsgY2xhc3Nlcy5zU29ydGFibGVEZXNjICsgJyAnICsgY2xhc3Nlcy5zU29ydGFibGVOb25lKTtcbiAgICAgIGpxVGJvZHkuY2hpbGRyZW4oKS5kZXRhY2goKTtcbiAgICAgIGpxVGJvZHkuYXBwZW5kKHJvd3MpO1xuICAgICAgdmFyIHJlbW92ZWRNZXRob2QgPSByZW1vdmUgPyAncmVtb3ZlJyA6ICdkZXRhY2gnO1xuICAgICAganFUYWJsZVtyZW1vdmVkTWV0aG9kXSgpO1xuICAgICAganFXcmFwcGVyW3JlbW92ZWRNZXRob2RdKCk7XG5cbiAgICAgIGlmICghcmVtb3ZlICYmIG9yaWcpIHtcbiAgICAgICAgb3JpZy5pbnNlcnRCZWZvcmUodGFibGUsIHNldHRpbmdzLm5UYWJsZVJlaW5zZXJ0QmVmb3JlKTtcbiAgICAgICAganFUYWJsZS5jc3MoJ3dpZHRoJywgc2V0dGluZ3Muc0Rlc3Ryb3lXaWR0aCkucmVtb3ZlQ2xhc3MoY2xhc3Nlcy5zVGFibGUpO1xuICAgICAgICBpZW4gPSBzZXR0aW5ncy5hc0Rlc3Ryb3lTdHJpcGVzLmxlbmd0aDtcblxuICAgICAgICBpZiAoaWVuKSB7XG4gICAgICAgICAganFUYm9keS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3Moc2V0dGluZ3MuYXNEZXN0cm95U3RyaXBlc1tpICUgaWVuXSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGlkeCA9ICQuaW5BcnJheShzZXR0aW5ncywgRGF0YVRhYmxlLnNldHRpbmdzKTtcblxuICAgICAgaWYgKGlkeCAhPT0gLTEpIHtcbiAgICAgICAgRGF0YVRhYmxlLnNldHRpbmdzLnNwbGljZShpZHgsIDEpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICAkLmVhY2goWydjb2x1bW4nLCAncm93JywgJ2NlbGwnXSwgZnVuY3Rpb24gKGksIHR5cGUpIHtcbiAgICBfYXBpX3JlZ2lzdGVyKHR5cGUgKyAncygpLmV2ZXJ5KCknLCBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIHZhciBvcHRzID0gdGhpcy5zZWxlY3Rvci5vcHRzO1xuICAgICAgdmFyIGFwaSA9IHRoaXM7XG4gICAgICByZXR1cm4gdGhpcy5pdGVyYXRvcih0eXBlLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQpIHtcbiAgICAgICAgZm4uY2FsbChhcGlbdHlwZV0oYXJnMSwgdHlwZSA9PT0gJ2NlbGwnID8gYXJnMiA6IG9wdHMsIHR5cGUgPT09ICdjZWxsJyA/IG9wdHMgOiB1bmRlZmluZWQpLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdpMThuKCknLCBmdW5jdGlvbiAodG9rZW4sIGRlZiwgcGx1cmFsKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dFswXTtcblxuICAgIHZhciByZXNvbHZlZCA9IF9mbkdldE9iamVjdERhdGFGbih0b2tlbikoY3R4Lm9MYW5ndWFnZSk7XG5cbiAgICBpZiAocmVzb2x2ZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzb2x2ZWQgPSBkZWY7XG4gICAgfVxuXG4gICAgaWYgKHBsdXJhbCAhPT0gdW5kZWZpbmVkICYmICQuaXNQbGFpbk9iamVjdChyZXNvbHZlZCkpIHtcbiAgICAgIHJlc29sdmVkID0gcmVzb2x2ZWRbcGx1cmFsXSAhPT0gdW5kZWZpbmVkID8gcmVzb2x2ZWRbcGx1cmFsXSA6IHJlc29sdmVkLl87XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc29sdmVkLnJlcGxhY2UoJyVkJywgcGx1cmFsKTtcbiAgfSk7XG5cbiAgRGF0YVRhYmxlLnZlcnNpb24gPSBcIjEuMTAuMThcIjtcbiAgRGF0YVRhYmxlLnNldHRpbmdzID0gW107XG4gIERhdGFUYWJsZS5tb2RlbHMgPSB7fTtcbiAgRGF0YVRhYmxlLm1vZGVscy5vU2VhcmNoID0ge1xuICAgIFwiYkNhc2VJbnNlbnNpdGl2ZVwiOiB0cnVlLFxuICAgIFwic1NlYXJjaFwiOiBcIlwiLFxuICAgIFwiYlJlZ2V4XCI6IGZhbHNlLFxuICAgIFwiYlNtYXJ0XCI6IHRydWVcbiAgfTtcbiAgRGF0YVRhYmxlLm1vZGVscy5vUm93ID0ge1xuICAgIFwiblRyXCI6IG51bGwsXG4gICAgXCJhbkNlbGxzXCI6IG51bGwsXG4gICAgXCJfYURhdGFcIjogW10sXG4gICAgXCJfYVNvcnREYXRhXCI6IG51bGwsXG4gICAgXCJfYUZpbHRlckRhdGFcIjogbnVsbCxcbiAgICBcIl9zRmlsdGVyUm93XCI6IG51bGwsXG4gICAgXCJfc1Jvd1N0cmlwZVwiOiBcIlwiLFxuICAgIFwic3JjXCI6IG51bGwsXG4gICAgXCJpZHhcIjogLTFcbiAgfTtcbiAgRGF0YVRhYmxlLm1vZGVscy5vQ29sdW1uID0ge1xuICAgIFwiaWR4XCI6IG51bGwsXG4gICAgXCJhRGF0YVNvcnRcIjogbnVsbCxcbiAgICBcImFzU29ydGluZ1wiOiBudWxsLFxuICAgIFwiYlNlYXJjaGFibGVcIjogbnVsbCxcbiAgICBcImJTb3J0YWJsZVwiOiBudWxsLFxuICAgIFwiYlZpc2libGVcIjogbnVsbCxcbiAgICBcIl9zTWFudWFsVHlwZVwiOiBudWxsLFxuICAgIFwiX2JBdHRyU3JjXCI6IGZhbHNlLFxuICAgIFwiZm5DcmVhdGVkQ2VsbFwiOiBudWxsLFxuICAgIFwiZm5HZXREYXRhXCI6IG51bGwsXG4gICAgXCJmblNldERhdGFcIjogbnVsbCxcbiAgICBcIm1EYXRhXCI6IG51bGwsXG4gICAgXCJtUmVuZGVyXCI6IG51bGwsXG4gICAgXCJuVGhcIjogbnVsbCxcbiAgICBcIm5UZlwiOiBudWxsLFxuICAgIFwic0NsYXNzXCI6IG51bGwsXG4gICAgXCJzQ29udGVudFBhZGRpbmdcIjogbnVsbCxcbiAgICBcInNEZWZhdWx0Q29udGVudFwiOiBudWxsLFxuICAgIFwic05hbWVcIjogbnVsbCxcbiAgICBcInNTb3J0RGF0YVR5cGVcIjogJ3N0ZCcsXG4gICAgXCJzU29ydGluZ0NsYXNzXCI6IG51bGwsXG4gICAgXCJzU29ydGluZ0NsYXNzSlVJXCI6IG51bGwsXG4gICAgXCJzVGl0bGVcIjogbnVsbCxcbiAgICBcInNUeXBlXCI6IG51bGwsXG4gICAgXCJzV2lkdGhcIjogbnVsbCxcbiAgICBcInNXaWR0aE9yaWdcIjogbnVsbFxuICB9O1xuICBEYXRhVGFibGUuZGVmYXVsdHMgPSB7XG4gICAgXCJhYURhdGFcIjogbnVsbCxcbiAgICBcImFhU29ydGluZ1wiOiBbWzAsICdhc2MnXV0sXG4gICAgXCJhYVNvcnRpbmdGaXhlZFwiOiBbXSxcbiAgICBcImFqYXhcIjogbnVsbCxcbiAgICBcImFMZW5ndGhNZW51XCI6IFsxMCwgMjUsIDUwLCAxMDBdLFxuICAgIFwiYW9Db2x1bW5zXCI6IG51bGwsXG4gICAgXCJhb0NvbHVtbkRlZnNcIjogbnVsbCxcbiAgICBcImFvU2VhcmNoQ29sc1wiOiBbXSxcbiAgICBcImFzU3RyaXBlQ2xhc3Nlc1wiOiBudWxsLFxuICAgIFwiYkF1dG9XaWR0aFwiOiB0cnVlLFxuICAgIFwiYkRlZmVyUmVuZGVyXCI6IGZhbHNlLFxuICAgIFwiYkRlc3Ryb3lcIjogZmFsc2UsXG4gICAgXCJiRmlsdGVyXCI6IHRydWUsXG4gICAgXCJiSW5mb1wiOiB0cnVlLFxuICAgIFwiYkxlbmd0aENoYW5nZVwiOiB0cnVlLFxuICAgIFwiYlBhZ2luYXRlXCI6IHRydWUsXG4gICAgXCJiUHJvY2Vzc2luZ1wiOiBmYWxzZSxcbiAgICBcImJSZXRyaWV2ZVwiOiBmYWxzZSxcbiAgICBcImJTY3JvbGxDb2xsYXBzZVwiOiBmYWxzZSxcbiAgICBcImJTZXJ2ZXJTaWRlXCI6IGZhbHNlLFxuICAgIFwiYlNvcnRcIjogdHJ1ZSxcbiAgICBcImJTb3J0TXVsdGlcIjogdHJ1ZSxcbiAgICBcImJTb3J0Q2VsbHNUb3BcIjogZmFsc2UsXG4gICAgXCJiU29ydENsYXNzZXNcIjogdHJ1ZSxcbiAgICBcImJTdGF0ZVNhdmVcIjogZmFsc2UsXG4gICAgXCJmbkNyZWF0ZWRSb3dcIjogbnVsbCxcbiAgICBcImZuRHJhd0NhbGxiYWNrXCI6IG51bGwsXG4gICAgXCJmbkZvb3RlckNhbGxiYWNrXCI6IG51bGwsXG4gICAgXCJmbkZvcm1hdE51bWJlclwiOiBmdW5jdGlvbiBmbkZvcm1hdE51bWJlcih0b0Zvcm1hdCkge1xuICAgICAgcmV0dXJuIHRvRm9ybWF0LnRvU3RyaW5nKCkucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgdGhpcy5vTGFuZ3VhZ2Uuc1Rob3VzYW5kcyk7XG4gICAgfSxcbiAgICBcImZuSGVhZGVyQ2FsbGJhY2tcIjogbnVsbCxcbiAgICBcImZuSW5mb0NhbGxiYWNrXCI6IG51bGwsXG4gICAgXCJmbkluaXRDb21wbGV0ZVwiOiBudWxsLFxuICAgIFwiZm5QcmVEcmF3Q2FsbGJhY2tcIjogbnVsbCxcbiAgICBcImZuUm93Q2FsbGJhY2tcIjogbnVsbCxcbiAgICBcImZuU2VydmVyRGF0YVwiOiBudWxsLFxuICAgIFwiZm5TZXJ2ZXJQYXJhbXNcIjogbnVsbCxcbiAgICBcImZuU3RhdGVMb2FkQ2FsbGJhY2tcIjogZnVuY3Rpb24gZm5TdGF0ZUxvYWRDYWxsYmFjayhzZXR0aW5ncykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoKHNldHRpbmdzLmlTdGF0ZUR1cmF0aW9uID09PSAtMSA/IHNlc3Npb25TdG9yYWdlIDogbG9jYWxTdG9yYWdlKS5nZXRJdGVtKCdEYXRhVGFibGVzXycgKyBzZXR0aW5ncy5zSW5zdGFuY2UgKyAnXycgKyBsb2NhdGlvbi5wYXRobmFtZSkpO1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9LFxuICAgIFwiZm5TdGF0ZUxvYWRQYXJhbXNcIjogbnVsbCxcbiAgICBcImZuU3RhdGVMb2FkZWRcIjogbnVsbCxcbiAgICBcImZuU3RhdGVTYXZlQ2FsbGJhY2tcIjogZnVuY3Rpb24gZm5TdGF0ZVNhdmVDYWxsYmFjayhzZXR0aW5ncywgZGF0YSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgKHNldHRpbmdzLmlTdGF0ZUR1cmF0aW9uID09PSAtMSA/IHNlc3Npb25TdG9yYWdlIDogbG9jYWxTdG9yYWdlKS5zZXRJdGVtKCdEYXRhVGFibGVzXycgKyBzZXR0aW5ncy5zSW5zdGFuY2UgKyAnXycgKyBsb2NhdGlvbi5wYXRobmFtZSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9LFxuICAgIFwiZm5TdGF0ZVNhdmVQYXJhbXNcIjogbnVsbCxcbiAgICBcImlTdGF0ZUR1cmF0aW9uXCI6IDcyMDAsXG4gICAgXCJpRGVmZXJMb2FkaW5nXCI6IG51bGwsXG4gICAgXCJpRGlzcGxheUxlbmd0aFwiOiAxMCxcbiAgICBcImlEaXNwbGF5U3RhcnRcIjogMCxcbiAgICBcImlUYWJJbmRleFwiOiAwLFxuICAgIFwib0NsYXNzZXNcIjoge30sXG4gICAgXCJvTGFuZ3VhZ2VcIjoge1xuICAgICAgXCJvQXJpYVwiOiB7XG4gICAgICAgIFwic1NvcnRBc2NlbmRpbmdcIjogXCI6IGFjdGl2YXRlIHRvIHNvcnQgY29sdW1uIGFzY2VuZGluZ1wiLFxuICAgICAgICBcInNTb3J0RGVzY2VuZGluZ1wiOiBcIjogYWN0aXZhdGUgdG8gc29ydCBjb2x1bW4gZGVzY2VuZGluZ1wiXG4gICAgICB9LFxuICAgICAgXCJvUGFnaW5hdGVcIjoge1xuICAgICAgICBcInNGaXJzdFwiOiBcIkZpcnN0XCIsXG4gICAgICAgIFwic0xhc3RcIjogXCJMYXN0XCIsXG4gICAgICAgIFwic05leHRcIjogXCJOZXh0XCIsXG4gICAgICAgIFwic1ByZXZpb3VzXCI6IFwiUHJldmlvdXNcIlxuICAgICAgfSxcbiAgICAgIFwic0VtcHR5VGFibGVcIjogXCJObyBkYXRhIGF2YWlsYWJsZSBpbiB0YWJsZVwiLFxuICAgICAgXCJzSW5mb1wiOiBcIlNob3dpbmcgX1NUQVJUXyB0byBfRU5EXyBvZiBfVE9UQUxfIGVudHJpZXNcIixcbiAgICAgIFwic0luZm9FbXB0eVwiOiBcIlNob3dpbmcgMCB0byAwIG9mIDAgZW50cmllc1wiLFxuICAgICAgXCJzSW5mb0ZpbHRlcmVkXCI6IFwiKGZpbHRlcmVkIGZyb20gX01BWF8gdG90YWwgZW50cmllcylcIixcbiAgICAgIFwic0luZm9Qb3N0Rml4XCI6IFwiXCIsXG4gICAgICBcInNEZWNpbWFsXCI6IFwiXCIsXG4gICAgICBcInNUaG91c2FuZHNcIjogXCIsXCIsXG4gICAgICBcInNMZW5ndGhNZW51XCI6IFwiU2hvdyBfTUVOVV8gZW50cmllc1wiLFxuICAgICAgXCJzTG9hZGluZ1JlY29yZHNcIjogXCJMb2FkaW5nLi4uXCIsXG4gICAgICBcInNQcm9jZXNzaW5nXCI6IFwiUHJvY2Vzc2luZy4uLlwiLFxuICAgICAgXCJzU2VhcmNoXCI6IFwiU2VhcmNoOlwiLFxuICAgICAgXCJzU2VhcmNoUGxhY2Vob2xkZXJcIjogXCJcIixcbiAgICAgIFwic1VybFwiOiBcIlwiLFxuICAgICAgXCJzWmVyb1JlY29yZHNcIjogXCJObyBtYXRjaGluZyByZWNvcmRzIGZvdW5kXCJcbiAgICB9LFxuICAgIFwib1NlYXJjaFwiOiAkLmV4dGVuZCh7fSwgRGF0YVRhYmxlLm1vZGVscy5vU2VhcmNoKSxcbiAgICBcInNBamF4RGF0YVByb3BcIjogXCJkYXRhXCIsXG4gICAgXCJzQWpheFNvdXJjZVwiOiBudWxsLFxuICAgIFwic0RvbVwiOiBcImxmcnRpcFwiLFxuICAgIFwic2VhcmNoRGVsYXlcIjogbnVsbCxcbiAgICBcInNQYWdpbmF0aW9uVHlwZVwiOiBcInNpbXBsZV9udW1iZXJzXCIsXG4gICAgXCJzU2Nyb2xsWFwiOiBcIlwiLFxuICAgIFwic1Njcm9sbFhJbm5lclwiOiBcIlwiLFxuICAgIFwic1Njcm9sbFlcIjogXCJcIixcbiAgICBcInNTZXJ2ZXJNZXRob2RcIjogXCJHRVRcIixcbiAgICBcInJlbmRlcmVyXCI6IG51bGwsXG4gICAgXCJyb3dJZFwiOiBcIkRUX1Jvd0lkXCJcbiAgfTtcblxuICBfZm5IdW5nYXJpYW5NYXAoRGF0YVRhYmxlLmRlZmF1bHRzKTtcblxuICBEYXRhVGFibGUuZGVmYXVsdHMuY29sdW1uID0ge1xuICAgIFwiYURhdGFTb3J0XCI6IG51bGwsXG4gICAgXCJpRGF0YVNvcnRcIjogLTEsXG4gICAgXCJhc1NvcnRpbmdcIjogWydhc2MnLCAnZGVzYyddLFxuICAgIFwiYlNlYXJjaGFibGVcIjogdHJ1ZSxcbiAgICBcImJTb3J0YWJsZVwiOiB0cnVlLFxuICAgIFwiYlZpc2libGVcIjogdHJ1ZSxcbiAgICBcImZuQ3JlYXRlZENlbGxcIjogbnVsbCxcbiAgICBcIm1EYXRhXCI6IG51bGwsXG4gICAgXCJtUmVuZGVyXCI6IG51bGwsXG4gICAgXCJzQ2VsbFR5cGVcIjogXCJ0ZFwiLFxuICAgIFwic0NsYXNzXCI6IFwiXCIsXG4gICAgXCJzQ29udGVudFBhZGRpbmdcIjogXCJcIixcbiAgICBcInNEZWZhdWx0Q29udGVudFwiOiBudWxsLFxuICAgIFwic05hbWVcIjogXCJcIixcbiAgICBcInNTb3J0RGF0YVR5cGVcIjogXCJzdGRcIixcbiAgICBcInNUaXRsZVwiOiBudWxsLFxuICAgIFwic1R5cGVcIjogbnVsbCxcbiAgICBcInNXaWR0aFwiOiBudWxsXG4gIH07XG5cbiAgX2ZuSHVuZ2FyaWFuTWFwKERhdGFUYWJsZS5kZWZhdWx0cy5jb2x1bW4pO1xuXG4gIERhdGFUYWJsZS5tb2RlbHMub1NldHRpbmdzID0ge1xuICAgIFwib0ZlYXR1cmVzXCI6IHtcbiAgICAgIFwiYkF1dG9XaWR0aFwiOiBudWxsLFxuICAgICAgXCJiRGVmZXJSZW5kZXJcIjogbnVsbCxcbiAgICAgIFwiYkZpbHRlclwiOiBudWxsLFxuICAgICAgXCJiSW5mb1wiOiBudWxsLFxuICAgICAgXCJiTGVuZ3RoQ2hhbmdlXCI6IG51bGwsXG4gICAgICBcImJQYWdpbmF0ZVwiOiBudWxsLFxuICAgICAgXCJiUHJvY2Vzc2luZ1wiOiBudWxsLFxuICAgICAgXCJiU2VydmVyU2lkZVwiOiBudWxsLFxuICAgICAgXCJiU29ydFwiOiBudWxsLFxuICAgICAgXCJiU29ydE11bHRpXCI6IG51bGwsXG4gICAgICBcImJTb3J0Q2xhc3Nlc1wiOiBudWxsLFxuICAgICAgXCJiU3RhdGVTYXZlXCI6IG51bGxcbiAgICB9LFxuICAgIFwib1Njcm9sbFwiOiB7XG4gICAgICBcImJDb2xsYXBzZVwiOiBudWxsLFxuICAgICAgXCJpQmFyV2lkdGhcIjogMCxcbiAgICAgIFwic1hcIjogbnVsbCxcbiAgICAgIFwic1hJbm5lclwiOiBudWxsLFxuICAgICAgXCJzWVwiOiBudWxsXG4gICAgfSxcbiAgICBcIm9MYW5ndWFnZVwiOiB7XG4gICAgICBcImZuSW5mb0NhbGxiYWNrXCI6IG51bGxcbiAgICB9LFxuICAgIFwib0Jyb3dzZXJcIjoge1xuICAgICAgXCJiU2Nyb2xsT3ZlcnNpemVcIjogZmFsc2UsXG4gICAgICBcImJTY3JvbGxiYXJMZWZ0XCI6IGZhbHNlLFxuICAgICAgXCJiQm91bmRpbmdcIjogZmFsc2UsXG4gICAgICBcImJhcldpZHRoXCI6IDBcbiAgICB9LFxuICAgIFwiYWpheFwiOiBudWxsLFxuICAgIFwiYWFuRmVhdHVyZXNcIjogW10sXG4gICAgXCJhb0RhdGFcIjogW10sXG4gICAgXCJhaURpc3BsYXlcIjogW10sXG4gICAgXCJhaURpc3BsYXlNYXN0ZXJcIjogW10sXG4gICAgXCJhSWRzXCI6IHt9LFxuICAgIFwiYW9Db2x1bW5zXCI6IFtdLFxuICAgIFwiYW9IZWFkZXJcIjogW10sXG4gICAgXCJhb0Zvb3RlclwiOiBbXSxcbiAgICBcIm9QcmV2aW91c1NlYXJjaFwiOiB7fSxcbiAgICBcImFvUHJlU2VhcmNoQ29sc1wiOiBbXSxcbiAgICBcImFhU29ydGluZ1wiOiBudWxsLFxuICAgIFwiYWFTb3J0aW5nRml4ZWRcIjogW10sXG4gICAgXCJhc1N0cmlwZUNsYXNzZXNcIjogbnVsbCxcbiAgICBcImFzRGVzdHJveVN0cmlwZXNcIjogW10sXG4gICAgXCJzRGVzdHJveVdpZHRoXCI6IDAsXG4gICAgXCJhb1Jvd0NhbGxiYWNrXCI6IFtdLFxuICAgIFwiYW9IZWFkZXJDYWxsYmFja1wiOiBbXSxcbiAgICBcImFvRm9vdGVyQ2FsbGJhY2tcIjogW10sXG4gICAgXCJhb0RyYXdDYWxsYmFja1wiOiBbXSxcbiAgICBcImFvUm93Q3JlYXRlZENhbGxiYWNrXCI6IFtdLFxuICAgIFwiYW9QcmVEcmF3Q2FsbGJhY2tcIjogW10sXG4gICAgXCJhb0luaXRDb21wbGV0ZVwiOiBbXSxcbiAgICBcImFvU3RhdGVTYXZlUGFyYW1zXCI6IFtdLFxuICAgIFwiYW9TdGF0ZUxvYWRQYXJhbXNcIjogW10sXG4gICAgXCJhb1N0YXRlTG9hZGVkXCI6IFtdLFxuICAgIFwic1RhYmxlSWRcIjogXCJcIixcbiAgICBcIm5UYWJsZVwiOiBudWxsLFxuICAgIFwiblRIZWFkXCI6IG51bGwsXG4gICAgXCJuVEZvb3RcIjogbnVsbCxcbiAgICBcIm5UQm9keVwiOiBudWxsLFxuICAgIFwiblRhYmxlV3JhcHBlclwiOiBudWxsLFxuICAgIFwiYkRlZmVyTG9hZGluZ1wiOiBmYWxzZSxcbiAgICBcImJJbml0aWFsaXNlZFwiOiBmYWxzZSxcbiAgICBcImFvT3BlblJvd3NcIjogW10sXG4gICAgXCJzRG9tXCI6IG51bGwsXG4gICAgXCJzZWFyY2hEZWxheVwiOiBudWxsLFxuICAgIFwic1BhZ2luYXRpb25UeXBlXCI6IFwidHdvX2J1dHRvblwiLFxuICAgIFwiaVN0YXRlRHVyYXRpb25cIjogMCxcbiAgICBcImFvU3RhdGVTYXZlXCI6IFtdLFxuICAgIFwiYW9TdGF0ZUxvYWRcIjogW10sXG4gICAgXCJvU2F2ZWRTdGF0ZVwiOiBudWxsLFxuICAgIFwib0xvYWRlZFN0YXRlXCI6IG51bGwsXG4gICAgXCJzQWpheFNvdXJjZVwiOiBudWxsLFxuICAgIFwic0FqYXhEYXRhUHJvcFwiOiBudWxsLFxuICAgIFwiYkFqYXhEYXRhR2V0XCI6IHRydWUsXG4gICAgXCJqcVhIUlwiOiBudWxsLFxuICAgIFwianNvblwiOiB1bmRlZmluZWQsXG4gICAgXCJvQWpheERhdGFcIjogdW5kZWZpbmVkLFxuICAgIFwiZm5TZXJ2ZXJEYXRhXCI6IG51bGwsXG4gICAgXCJhb1NlcnZlclBhcmFtc1wiOiBbXSxcbiAgICBcInNTZXJ2ZXJNZXRob2RcIjogbnVsbCxcbiAgICBcImZuRm9ybWF0TnVtYmVyXCI6IG51bGwsXG4gICAgXCJhTGVuZ3RoTWVudVwiOiBudWxsLFxuICAgIFwiaURyYXdcIjogMCxcbiAgICBcImJEcmF3aW5nXCI6IGZhbHNlLFxuICAgIFwiaURyYXdFcnJvclwiOiAtMSxcbiAgICBcIl9pRGlzcGxheUxlbmd0aFwiOiAxMCxcbiAgICBcIl9pRGlzcGxheVN0YXJ0XCI6IDAsXG4gICAgXCJfaVJlY29yZHNUb3RhbFwiOiAwLFxuICAgIFwiX2lSZWNvcmRzRGlzcGxheVwiOiAwLFxuICAgIFwib0NsYXNzZXNcIjoge30sXG4gICAgXCJiRmlsdGVyZWRcIjogZmFsc2UsXG4gICAgXCJiU29ydGVkXCI6IGZhbHNlLFxuICAgIFwiYlNvcnRDZWxsc1RvcFwiOiBudWxsLFxuICAgIFwib0luaXRcIjogbnVsbCxcbiAgICBcImFvRGVzdHJveUNhbGxiYWNrXCI6IFtdLFxuICAgIFwiZm5SZWNvcmRzVG90YWxcIjogZnVuY3Rpb24gZm5SZWNvcmRzVG90YWwoKSB7XG4gICAgICByZXR1cm4gX2ZuRGF0YVNvdXJjZSh0aGlzKSA9PSAnc3NwJyA/IHRoaXMuX2lSZWNvcmRzVG90YWwgKiAxIDogdGhpcy5haURpc3BsYXlNYXN0ZXIubGVuZ3RoO1xuICAgIH0sXG4gICAgXCJmblJlY29yZHNEaXNwbGF5XCI6IGZ1bmN0aW9uIGZuUmVjb3Jkc0Rpc3BsYXkoKSB7XG4gICAgICByZXR1cm4gX2ZuRGF0YVNvdXJjZSh0aGlzKSA9PSAnc3NwJyA/IHRoaXMuX2lSZWNvcmRzRGlzcGxheSAqIDEgOiB0aGlzLmFpRGlzcGxheS5sZW5ndGg7XG4gICAgfSxcbiAgICBcImZuRGlzcGxheUVuZFwiOiBmdW5jdGlvbiBmbkRpc3BsYXlFbmQoKSB7XG4gICAgICB2YXIgbGVuID0gdGhpcy5faURpc3BsYXlMZW5ndGgsXG4gICAgICAgICAgc3RhcnQgPSB0aGlzLl9pRGlzcGxheVN0YXJ0LFxuICAgICAgICAgIGNhbGMgPSBzdGFydCArIGxlbixcbiAgICAgICAgICByZWNvcmRzID0gdGhpcy5haURpc3BsYXkubGVuZ3RoLFxuICAgICAgICAgIGZlYXR1cmVzID0gdGhpcy5vRmVhdHVyZXMsXG4gICAgICAgICAgcGFnaW5hdGUgPSBmZWF0dXJlcy5iUGFnaW5hdGU7XG5cbiAgICAgIGlmIChmZWF0dXJlcy5iU2VydmVyU2lkZSkge1xuICAgICAgICByZXR1cm4gcGFnaW5hdGUgPT09IGZhbHNlIHx8IGxlbiA9PT0gLTEgPyBzdGFydCArIHJlY29yZHMgOiBNYXRoLm1pbihzdGFydCArIGxlbiwgdGhpcy5faVJlY29yZHNEaXNwbGF5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAhcGFnaW5hdGUgfHwgY2FsYyA+IHJlY29yZHMgfHwgbGVuID09PSAtMSA/IHJlY29yZHMgOiBjYWxjO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJvSW5zdGFuY2VcIjogbnVsbCxcbiAgICBcInNJbnN0YW5jZVwiOiBudWxsLFxuICAgIFwiaVRhYkluZGV4XCI6IDAsXG4gICAgXCJuU2Nyb2xsSGVhZFwiOiBudWxsLFxuICAgIFwiblNjcm9sbEZvb3RcIjogbnVsbCxcbiAgICBcImFMYXN0U29ydFwiOiBbXSxcbiAgICBcIm9QbHVnaW5zXCI6IHt9LFxuICAgIFwicm93SWRGblwiOiBudWxsLFxuICAgIFwicm93SWRcIjogbnVsbFxuICB9O1xuICBEYXRhVGFibGUuZXh0ID0gX2V4dCA9IHtcbiAgICBidXR0b25zOiB7fSxcbiAgICBjbGFzc2VzOiB7fSxcbiAgICBidWlsZDogXCJkdC9kdC0xLjEwLjE4XCIsXG4gICAgZXJyTW9kZTogXCJhbGVydFwiLFxuICAgIGZlYXR1cmU6IFtdLFxuICAgIHNlYXJjaDogW10sXG4gICAgc2VsZWN0b3I6IHtcbiAgICAgIGNlbGw6IFtdLFxuICAgICAgY29sdW1uOiBbXSxcbiAgICAgIHJvdzogW11cbiAgICB9LFxuICAgIGludGVybmFsOiB7fSxcbiAgICBsZWdhY3k6IHtcbiAgICAgIGFqYXg6IG51bGxcbiAgICB9LFxuICAgIHBhZ2VyOiB7fSxcbiAgICByZW5kZXJlcjoge1xuICAgICAgcGFnZUJ1dHRvbjoge30sXG4gICAgICBoZWFkZXI6IHt9XG4gICAgfSxcbiAgICBvcmRlcjoge30sXG4gICAgdHlwZToge1xuICAgICAgZGV0ZWN0OiBbXSxcbiAgICAgIHNlYXJjaDoge30sXG4gICAgICBvcmRlcjoge31cbiAgICB9LFxuICAgIF91bmlxdWU6IDAsXG4gICAgZm5WZXJzaW9uQ2hlY2s6IERhdGFUYWJsZS5mblZlcnNpb25DaGVjayxcbiAgICBpQXBpSW5kZXg6IDAsXG4gICAgb0pVSUNsYXNzZXM6IHt9LFxuICAgIHNWZXJzaW9uOiBEYXRhVGFibGUudmVyc2lvblxuICB9O1xuICAkLmV4dGVuZChfZXh0LCB7XG4gICAgYWZuRmlsdGVyaW5nOiBfZXh0LnNlYXJjaCxcbiAgICBhVHlwZXM6IF9leHQudHlwZS5kZXRlY3QsXG4gICAgb2ZuU2VhcmNoOiBfZXh0LnR5cGUuc2VhcmNoLFxuICAgIG9Tb3J0OiBfZXh0LnR5cGUub3JkZXIsXG4gICAgYWZuU29ydERhdGE6IF9leHQub3JkZXIsXG4gICAgYW9GZWF0dXJlczogX2V4dC5mZWF0dXJlLFxuICAgIG9BcGk6IF9leHQuaW50ZXJuYWwsXG4gICAgb1N0ZENsYXNzZXM6IF9leHQuY2xhc3NlcyxcbiAgICBvUGFnaW5hdGlvbjogX2V4dC5wYWdlclxuICB9KTtcbiAgJC5leHRlbmQoRGF0YVRhYmxlLmV4dC5jbGFzc2VzLCB7XG4gICAgXCJzVGFibGVcIjogXCJkYXRhVGFibGVcIixcbiAgICBcInNOb0Zvb3RlclwiOiBcIm5vLWZvb3RlclwiLFxuICAgIFwic1BhZ2VCdXR0b25cIjogXCJwYWdpbmF0ZV9idXR0b25cIixcbiAgICBcInNQYWdlQnV0dG9uQWN0aXZlXCI6IFwiY3VycmVudFwiLFxuICAgIFwic1BhZ2VCdXR0b25EaXNhYmxlZFwiOiBcImRpc2FibGVkXCIsXG4gICAgXCJzU3RyaXBlT2RkXCI6IFwib2RkXCIsXG4gICAgXCJzU3RyaXBlRXZlblwiOiBcImV2ZW5cIixcbiAgICBcInNSb3dFbXB0eVwiOiBcImRhdGFUYWJsZXNfZW1wdHlcIixcbiAgICBcInNXcmFwcGVyXCI6IFwiZGF0YVRhYmxlc193cmFwcGVyXCIsXG4gICAgXCJzRmlsdGVyXCI6IFwiZGF0YVRhYmxlc19maWx0ZXJcIixcbiAgICBcInNJbmZvXCI6IFwiZGF0YVRhYmxlc19pbmZvXCIsXG4gICAgXCJzUGFnaW5nXCI6IFwiZGF0YVRhYmxlc19wYWdpbmF0ZSBwYWdpbmdfXCIsXG4gICAgXCJzTGVuZ3RoXCI6IFwiZGF0YVRhYmxlc19sZW5ndGhcIixcbiAgICBcInNQcm9jZXNzaW5nXCI6IFwiZGF0YVRhYmxlc19wcm9jZXNzaW5nXCIsXG4gICAgXCJzU29ydEFzY1wiOiBcInNvcnRpbmdfYXNjXCIsXG4gICAgXCJzU29ydERlc2NcIjogXCJzb3J0aW5nX2Rlc2NcIixcbiAgICBcInNTb3J0YWJsZVwiOiBcInNvcnRpbmdcIixcbiAgICBcInNTb3J0YWJsZUFzY1wiOiBcInNvcnRpbmdfYXNjX2Rpc2FibGVkXCIsXG4gICAgXCJzU29ydGFibGVEZXNjXCI6IFwic29ydGluZ19kZXNjX2Rpc2FibGVkXCIsXG4gICAgXCJzU29ydGFibGVOb25lXCI6IFwic29ydGluZ19kaXNhYmxlZFwiLFxuICAgIFwic1NvcnRDb2x1bW5cIjogXCJzb3J0aW5nX1wiLFxuICAgIFwic0ZpbHRlcklucHV0XCI6IFwiXCIsXG4gICAgXCJzTGVuZ3RoU2VsZWN0XCI6IFwiXCIsXG4gICAgXCJzU2Nyb2xsV3JhcHBlclwiOiBcImRhdGFUYWJsZXNfc2Nyb2xsXCIsXG4gICAgXCJzU2Nyb2xsSGVhZFwiOiBcImRhdGFUYWJsZXNfc2Nyb2xsSGVhZFwiLFxuICAgIFwic1Njcm9sbEhlYWRJbm5lclwiOiBcImRhdGFUYWJsZXNfc2Nyb2xsSGVhZElubmVyXCIsXG4gICAgXCJzU2Nyb2xsQm9keVwiOiBcImRhdGFUYWJsZXNfc2Nyb2xsQm9keVwiLFxuICAgIFwic1Njcm9sbEZvb3RcIjogXCJkYXRhVGFibGVzX3Njcm9sbEZvb3RcIixcbiAgICBcInNTY3JvbGxGb290SW5uZXJcIjogXCJkYXRhVGFibGVzX3Njcm9sbEZvb3RJbm5lclwiLFxuICAgIFwic0hlYWRlclRIXCI6IFwiXCIsXG4gICAgXCJzRm9vdGVyVEhcIjogXCJcIixcbiAgICBcInNTb3J0SlVJQXNjXCI6IFwiXCIsXG4gICAgXCJzU29ydEpVSURlc2NcIjogXCJcIixcbiAgICBcInNTb3J0SlVJXCI6IFwiXCIsXG4gICAgXCJzU29ydEpVSUFzY0FsbG93ZWRcIjogXCJcIixcbiAgICBcInNTb3J0SlVJRGVzY0FsbG93ZWRcIjogXCJcIixcbiAgICBcInNTb3J0SlVJV3JhcHBlclwiOiBcIlwiLFxuICAgIFwic1NvcnRJY29uXCI6IFwiXCIsXG4gICAgXCJzSlVJSGVhZGVyXCI6IFwiXCIsXG4gICAgXCJzSlVJRm9vdGVyXCI6IFwiXCJcbiAgfSk7XG4gIHZhciBleHRQYWdpbmF0aW9uID0gRGF0YVRhYmxlLmV4dC5wYWdlcjtcblxuICBmdW5jdGlvbiBfbnVtYmVycyhwYWdlLCBwYWdlcykge1xuICAgIHZhciBudW1iZXJzID0gW10sXG4gICAgICAgIGJ1dHRvbnMgPSBleHRQYWdpbmF0aW9uLm51bWJlcnNfbGVuZ3RoLFxuICAgICAgICBoYWxmID0gTWF0aC5mbG9vcihidXR0b25zIC8gMiksXG4gICAgICAgIGkgPSAxO1xuXG4gICAgaWYgKHBhZ2VzIDw9IGJ1dHRvbnMpIHtcbiAgICAgIG51bWJlcnMgPSBfcmFuZ2UoMCwgcGFnZXMpO1xuICAgIH0gZWxzZSBpZiAocGFnZSA8PSBoYWxmKSB7XG4gICAgICBudW1iZXJzID0gX3JhbmdlKDAsIGJ1dHRvbnMgLSAyKTtcbiAgICAgIG51bWJlcnMucHVzaCgnZWxsaXBzaXMnKTtcbiAgICAgIG51bWJlcnMucHVzaChwYWdlcyAtIDEpO1xuICAgIH0gZWxzZSBpZiAocGFnZSA+PSBwYWdlcyAtIDEgLSBoYWxmKSB7XG4gICAgICBudW1iZXJzID0gX3JhbmdlKHBhZ2VzIC0gKGJ1dHRvbnMgLSAyKSwgcGFnZXMpO1xuICAgICAgbnVtYmVycy5zcGxpY2UoMCwgMCwgJ2VsbGlwc2lzJyk7XG4gICAgICBudW1iZXJzLnNwbGljZSgwLCAwLCAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbnVtYmVycyA9IF9yYW5nZShwYWdlIC0gaGFsZiArIDIsIHBhZ2UgKyBoYWxmIC0gMSk7XG4gICAgICBudW1iZXJzLnB1c2goJ2VsbGlwc2lzJyk7XG4gICAgICBudW1iZXJzLnB1c2gocGFnZXMgLSAxKTtcbiAgICAgIG51bWJlcnMuc3BsaWNlKDAsIDAsICdlbGxpcHNpcycpO1xuICAgICAgbnVtYmVycy5zcGxpY2UoMCwgMCwgMCk7XG4gICAgfVxuXG4gICAgbnVtYmVycy5EVF9lbCA9ICdzcGFuJztcbiAgICByZXR1cm4gbnVtYmVycztcbiAgfVxuXG4gICQuZXh0ZW5kKGV4dFBhZ2luYXRpb24sIHtcbiAgICBzaW1wbGU6IGZ1bmN0aW9uIHNpbXBsZShwYWdlLCBwYWdlcykge1xuICAgICAgcmV0dXJuIFsncHJldmlvdXMnLCAnbmV4dCddO1xuICAgIH0sXG4gICAgZnVsbDogZnVuY3Rpb24gZnVsbChwYWdlLCBwYWdlcykge1xuICAgICAgcmV0dXJuIFsnZmlyc3QnLCAncHJldmlvdXMnLCAnbmV4dCcsICdsYXN0J107XG4gICAgfSxcbiAgICBudW1iZXJzOiBmdW5jdGlvbiBudW1iZXJzKHBhZ2UsIHBhZ2VzKSB7XG4gICAgICByZXR1cm4gW19udW1iZXJzKHBhZ2UsIHBhZ2VzKV07XG4gICAgfSxcbiAgICBzaW1wbGVfbnVtYmVyczogZnVuY3Rpb24gc2ltcGxlX251bWJlcnMocGFnZSwgcGFnZXMpIHtcbiAgICAgIHJldHVybiBbJ3ByZXZpb3VzJywgX251bWJlcnMocGFnZSwgcGFnZXMpLCAnbmV4dCddO1xuICAgIH0sXG4gICAgZnVsbF9udW1iZXJzOiBmdW5jdGlvbiBmdWxsX251bWJlcnMocGFnZSwgcGFnZXMpIHtcbiAgICAgIHJldHVybiBbJ2ZpcnN0JywgJ3ByZXZpb3VzJywgX251bWJlcnMocGFnZSwgcGFnZXMpLCAnbmV4dCcsICdsYXN0J107XG4gICAgfSxcbiAgICBmaXJzdF9sYXN0X251bWJlcnM6IGZ1bmN0aW9uIGZpcnN0X2xhc3RfbnVtYmVycyhwYWdlLCBwYWdlcykge1xuICAgICAgcmV0dXJuIFsnZmlyc3QnLCBfbnVtYmVycyhwYWdlLCBwYWdlcyksICdsYXN0J107XG4gICAgfSxcbiAgICBfbnVtYmVyczogX251bWJlcnMsXG4gICAgbnVtYmVyc19sZW5ndGg6IDdcbiAgfSk7XG4gICQuZXh0ZW5kKHRydWUsIERhdGFUYWJsZS5leHQucmVuZGVyZXIsIHtcbiAgICBwYWdlQnV0dG9uOiB7XG4gICAgICBfOiBmdW5jdGlvbiBfKHNldHRpbmdzLCBob3N0LCBpZHgsIGJ1dHRvbnMsIHBhZ2UsIHBhZ2VzKSB7XG4gICAgICAgIHZhciBjbGFzc2VzID0gc2V0dGluZ3Mub0NsYXNzZXM7XG4gICAgICAgIHZhciBsYW5nID0gc2V0dGluZ3Mub0xhbmd1YWdlLm9QYWdpbmF0ZTtcbiAgICAgICAgdmFyIGFyaWEgPSBzZXR0aW5ncy5vTGFuZ3VhZ2Uub0FyaWEucGFnaW5hdGUgfHwge307XG4gICAgICAgIHZhciBidG5EaXNwbGF5LFxuICAgICAgICAgICAgYnRuQ2xhc3MsXG4gICAgICAgICAgICBjb3VudGVyID0gMDtcblxuICAgICAgICB2YXIgYXR0YWNoID0gZnVuY3Rpb24gYXR0YWNoKGNvbnRhaW5lciwgYnV0dG9ucykge1xuICAgICAgICAgIHZhciBpLCBpZW4sIG5vZGUsIGJ1dHRvbjtcblxuICAgICAgICAgIHZhciBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbiBjbGlja0hhbmRsZXIoZSkge1xuICAgICAgICAgICAgX2ZuUGFnZUNoYW5nZShzZXR0aW5ncywgZS5kYXRhLmFjdGlvbiwgdHJ1ZSk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGZvciAoaSA9IDAsIGllbiA9IGJ1dHRvbnMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICAgIGJ1dHRvbiA9IGJ1dHRvbnNbaV07XG5cbiAgICAgICAgICAgIGlmICgkLmlzQXJyYXkoYnV0dG9uKSkge1xuICAgICAgICAgICAgICB2YXIgaW5uZXIgPSAkKCc8JyArIChidXR0b24uRFRfZWwgfHwgJ2RpdicpICsgJy8+JykuYXBwZW5kVG8oY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgYXR0YWNoKGlubmVyLCBidXR0b24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnRuRGlzcGxheSA9IG51bGw7XG4gICAgICAgICAgICAgIGJ0bkNsYXNzID0gJyc7XG5cbiAgICAgICAgICAgICAgc3dpdGNoIChidXR0b24pIHtcbiAgICAgICAgICAgICAgICBjYXNlICdlbGxpcHNpcyc6XG4gICAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kKCc8c3BhbiBjbGFzcz1cImVsbGlwc2lzXCI+JiN4MjAyNjs8L3NwYW4+Jyk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2ZpcnN0JzpcbiAgICAgICAgICAgICAgICAgIGJ0bkRpc3BsYXkgPSBsYW5nLnNGaXJzdDtcbiAgICAgICAgICAgICAgICAgIGJ0bkNsYXNzID0gYnV0dG9uICsgKHBhZ2UgPiAwID8gJycgOiAnICcgKyBjbGFzc2VzLnNQYWdlQnV0dG9uRGlzYWJsZWQpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdwcmV2aW91cyc6XG4gICAgICAgICAgICAgICAgICBidG5EaXNwbGF5ID0gbGFuZy5zUHJldmlvdXM7XG4gICAgICAgICAgICAgICAgICBidG5DbGFzcyA9IGJ1dHRvbiArIChwYWdlID4gMCA/ICcnIDogJyAnICsgY2xhc3Nlcy5zUGFnZUJ1dHRvbkRpc2FibGVkKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbmV4dCc6XG4gICAgICAgICAgICAgICAgICBidG5EaXNwbGF5ID0gbGFuZy5zTmV4dDtcbiAgICAgICAgICAgICAgICAgIGJ0bkNsYXNzID0gYnV0dG9uICsgKHBhZ2UgPCBwYWdlcyAtIDEgPyAnJyA6ICcgJyArIGNsYXNzZXMuc1BhZ2VCdXR0b25EaXNhYmxlZCk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2xhc3QnOlxuICAgICAgICAgICAgICAgICAgYnRuRGlzcGxheSA9IGxhbmcuc0xhc3Q7XG4gICAgICAgICAgICAgICAgICBidG5DbGFzcyA9IGJ1dHRvbiArIChwYWdlIDwgcGFnZXMgLSAxID8gJycgOiAnICcgKyBjbGFzc2VzLnNQYWdlQnV0dG9uRGlzYWJsZWQpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgYnRuRGlzcGxheSA9IGJ1dHRvbiArIDE7XG4gICAgICAgICAgICAgICAgICBidG5DbGFzcyA9IHBhZ2UgPT09IGJ1dHRvbiA/IGNsYXNzZXMuc1BhZ2VCdXR0b25BY3RpdmUgOiAnJztcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGJ0bkRpc3BsYXkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBub2RlID0gJCgnPGE+Jywge1xuICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogY2xhc3Nlcy5zUGFnZUJ1dHRvbiArICcgJyArIGJ0bkNsYXNzLFxuICAgICAgICAgICAgICAgICAgJ2FyaWEtY29udHJvbHMnOiBzZXR0aW5ncy5zVGFibGVJZCxcbiAgICAgICAgICAgICAgICAgICdhcmlhLWxhYmVsJzogYXJpYVtidXR0b25dLFxuICAgICAgICAgICAgICAgICAgJ2RhdGEtZHQtaWR4JzogY291bnRlcixcbiAgICAgICAgICAgICAgICAgICd0YWJpbmRleCc6IHNldHRpbmdzLmlUYWJJbmRleCxcbiAgICAgICAgICAgICAgICAgICdpZCc6IGlkeCA9PT0gMCAmJiB0eXBlb2YgYnV0dG9uID09PSAnc3RyaW5nJyA/IHNldHRpbmdzLnNUYWJsZUlkICsgJ18nICsgYnV0dG9uIDogbnVsbFxuICAgICAgICAgICAgICAgIH0pLmh0bWwoYnRuRGlzcGxheSkuYXBwZW5kVG8oY29udGFpbmVyKTtcblxuICAgICAgICAgICAgICAgIF9mbkJpbmRBY3Rpb24obm9kZSwge1xuICAgICAgICAgICAgICAgICAgYWN0aW9uOiBidXR0b25cbiAgICAgICAgICAgICAgICB9LCBjbGlja0hhbmRsZXIpO1xuXG4gICAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBhY3RpdmVFbDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGFjdGl2ZUVsID0gJChob3N0KS5maW5kKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLmRhdGEoJ2R0LWlkeCcpO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuXG4gICAgICAgIGF0dGFjaCgkKGhvc3QpLmVtcHR5KCksIGJ1dHRvbnMpO1xuXG4gICAgICAgIGlmIChhY3RpdmVFbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgJChob3N0KS5maW5kKCdbZGF0YS1kdC1pZHg9JyArIGFjdGl2ZUVsICsgJ10nKS5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgJC5leHRlbmQoRGF0YVRhYmxlLmV4dC50eXBlLmRldGVjdCwgW2Z1bmN0aW9uIChkLCBzZXR0aW5ncykge1xuICAgIHZhciBkZWNpbWFsID0gc2V0dGluZ3Mub0xhbmd1YWdlLnNEZWNpbWFsO1xuICAgIHJldHVybiBfaXNOdW1iZXIoZCwgZGVjaW1hbCkgPyAnbnVtJyArIGRlY2ltYWwgOiBudWxsO1xuICB9LCBmdW5jdGlvbiAoZCwgc2V0dGluZ3MpIHtcbiAgICBpZiAoZCAmJiAhKGQgaW5zdGFuY2VvZiBEYXRlKSAmJiAhX3JlX2RhdGUudGVzdChkKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHBhcnNlZCA9IERhdGUucGFyc2UoZCk7XG4gICAgcmV0dXJuIHBhcnNlZCAhPT0gbnVsbCAmJiAhaXNOYU4ocGFyc2VkKSB8fCBfZW1wdHkoZCkgPyAnZGF0ZScgOiBudWxsO1xuICB9LCBmdW5jdGlvbiAoZCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgZGVjaW1hbCA9IHNldHRpbmdzLm9MYW5ndWFnZS5zRGVjaW1hbDtcbiAgICByZXR1cm4gX2lzTnVtYmVyKGQsIGRlY2ltYWwsIHRydWUpID8gJ251bS1mbXQnICsgZGVjaW1hbCA6IG51bGw7XG4gIH0sIGZ1bmN0aW9uIChkLCBzZXR0aW5ncykge1xuICAgIHZhciBkZWNpbWFsID0gc2V0dGluZ3Mub0xhbmd1YWdlLnNEZWNpbWFsO1xuICAgIHJldHVybiBfaHRtbE51bWVyaWMoZCwgZGVjaW1hbCkgPyAnaHRtbC1udW0nICsgZGVjaW1hbCA6IG51bGw7XG4gIH0sIGZ1bmN0aW9uIChkLCBzZXR0aW5ncykge1xuICAgIHZhciBkZWNpbWFsID0gc2V0dGluZ3Mub0xhbmd1YWdlLnNEZWNpbWFsO1xuICAgIHJldHVybiBfaHRtbE51bWVyaWMoZCwgZGVjaW1hbCwgdHJ1ZSkgPyAnaHRtbC1udW0tZm10JyArIGRlY2ltYWwgOiBudWxsO1xuICB9LCBmdW5jdGlvbiAoZCwgc2V0dGluZ3MpIHtcbiAgICByZXR1cm4gX2VtcHR5KGQpIHx8IHR5cGVvZiBkID09PSAnc3RyaW5nJyAmJiBkLmluZGV4T2YoJzwnKSAhPT0gLTEgPyAnaHRtbCcgOiBudWxsO1xuICB9XSk7XG4gICQuZXh0ZW5kKERhdGFUYWJsZS5leHQudHlwZS5zZWFyY2gsIHtcbiAgICBodG1sOiBmdW5jdGlvbiBodG1sKGRhdGEpIHtcbiAgICAgIHJldHVybiBfZW1wdHkoZGF0YSkgPyBkYXRhIDogdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnID8gZGF0YS5yZXBsYWNlKF9yZV9uZXdfbGluZXMsIFwiIFwiKS5yZXBsYWNlKF9yZV9odG1sLCBcIlwiKSA6ICcnO1xuICAgIH0sXG4gICAgc3RyaW5nOiBmdW5jdGlvbiBzdHJpbmcoZGF0YSkge1xuICAgICAgcmV0dXJuIF9lbXB0eShkYXRhKSA/IGRhdGEgOiB0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgPyBkYXRhLnJlcGxhY2UoX3JlX25ld19saW5lcywgXCIgXCIpIDogZGF0YTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBfX251bWVyaWNSZXBsYWNlID0gZnVuY3Rpb24gX19udW1lcmljUmVwbGFjZShkLCBkZWNpbWFsUGxhY2UsIHJlMSwgcmUyKSB7XG4gICAgaWYgKGQgIT09IDAgJiYgKCFkIHx8IGQgPT09ICctJykpIHtcbiAgICAgIHJldHVybiAtSW5maW5pdHk7XG4gICAgfVxuXG4gICAgaWYgKGRlY2ltYWxQbGFjZSkge1xuICAgICAgZCA9IF9udW1Ub0RlY2ltYWwoZCwgZGVjaW1hbFBsYWNlKTtcbiAgICB9XG5cbiAgICBpZiAoZC5yZXBsYWNlKSB7XG4gICAgICBpZiAocmUxKSB7XG4gICAgICAgIGQgPSBkLnJlcGxhY2UocmUxLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZTIpIHtcbiAgICAgICAgZCA9IGQucmVwbGFjZShyZTIsICcnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZCAqIDE7XG4gIH07XG5cbiAgZnVuY3Rpb24gX2FkZE51bWVyaWNTb3J0KGRlY2ltYWxQbGFjZSkge1xuICAgICQuZWFjaCh7XG4gICAgICBcIm51bVwiOiBmdW5jdGlvbiBudW0oZCkge1xuICAgICAgICByZXR1cm4gX19udW1lcmljUmVwbGFjZShkLCBkZWNpbWFsUGxhY2UpO1xuICAgICAgfSxcbiAgICAgIFwibnVtLWZtdFwiOiBmdW5jdGlvbiBudW1GbXQoZCkge1xuICAgICAgICByZXR1cm4gX19udW1lcmljUmVwbGFjZShkLCBkZWNpbWFsUGxhY2UsIF9yZV9mb3JtYXR0ZWRfbnVtZXJpYyk7XG4gICAgICB9LFxuICAgICAgXCJodG1sLW51bVwiOiBmdW5jdGlvbiBodG1sTnVtKGQpIHtcbiAgICAgICAgcmV0dXJuIF9fbnVtZXJpY1JlcGxhY2UoZCwgZGVjaW1hbFBsYWNlLCBfcmVfaHRtbCk7XG4gICAgICB9LFxuICAgICAgXCJodG1sLW51bS1mbXRcIjogZnVuY3Rpb24gaHRtbE51bUZtdChkKSB7XG4gICAgICAgIHJldHVybiBfX251bWVyaWNSZXBsYWNlKGQsIGRlY2ltYWxQbGFjZSwgX3JlX2h0bWwsIF9yZV9mb3JtYXR0ZWRfbnVtZXJpYyk7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKGtleSwgZm4pIHtcbiAgICAgIF9leHQudHlwZS5vcmRlcltrZXkgKyBkZWNpbWFsUGxhY2UgKyAnLXByZSddID0gZm47XG5cbiAgICAgIGlmIChrZXkubWF0Y2goL15odG1sXFwtLykpIHtcbiAgICAgICAgX2V4dC50eXBlLnNlYXJjaFtrZXkgKyBkZWNpbWFsUGxhY2VdID0gX2V4dC50eXBlLnNlYXJjaC5odG1sO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgJC5leHRlbmQoX2V4dC50eXBlLm9yZGVyLCB7XG4gICAgXCJkYXRlLXByZVwiOiBmdW5jdGlvbiBkYXRlUHJlKGQpIHtcbiAgICAgIHZhciB0cyA9IERhdGUucGFyc2UoZCk7XG4gICAgICByZXR1cm4gaXNOYU4odHMpID8gLUluZmluaXR5IDogdHM7XG4gICAgfSxcbiAgICBcImh0bWwtcHJlXCI6IGZ1bmN0aW9uIGh0bWxQcmUoYSkge1xuICAgICAgcmV0dXJuIF9lbXB0eShhKSA/ICcnIDogYS5yZXBsYWNlID8gYS5yZXBsYWNlKC88Lio/Pi9nLCBcIlwiKS50b0xvd2VyQ2FzZSgpIDogYSArICcnO1xuICAgIH0sXG4gICAgXCJzdHJpbmctcHJlXCI6IGZ1bmN0aW9uIHN0cmluZ1ByZShhKSB7XG4gICAgICByZXR1cm4gX2VtcHR5KGEpID8gJycgOiB0eXBlb2YgYSA9PT0gJ3N0cmluZycgPyBhLnRvTG93ZXJDYXNlKCkgOiAhYS50b1N0cmluZyA/ICcnIDogYS50b1N0cmluZygpO1xuICAgIH0sXG4gICAgXCJzdHJpbmctYXNjXCI6IGZ1bmN0aW9uIHN0cmluZ0FzYyh4LCB5KSB7XG4gICAgICByZXR1cm4geCA8IHkgPyAtMSA6IHggPiB5ID8gMSA6IDA7XG4gICAgfSxcbiAgICBcInN0cmluZy1kZXNjXCI6IGZ1bmN0aW9uIHN0cmluZ0Rlc2MoeCwgeSkge1xuICAgICAgcmV0dXJuIHggPCB5ID8gMSA6IHggPiB5ID8gLTEgOiAwO1xuICAgIH1cbiAgfSk7XG5cbiAgX2FkZE51bWVyaWNTb3J0KCcnKTtcblxuICAkLmV4dGVuZCh0cnVlLCBEYXRhVGFibGUuZXh0LnJlbmRlcmVyLCB7XG4gICAgaGVhZGVyOiB7XG4gICAgICBfOiBmdW5jdGlvbiBfKHNldHRpbmdzLCBjZWxsLCBjb2x1bW4sIGNsYXNzZXMpIHtcbiAgICAgICAgJChzZXR0aW5ncy5uVGFibGUpLm9uKCdvcmRlci5kdC5EVCcsIGZ1bmN0aW9uIChlLCBjdHgsIHNvcnRpbmcsIGNvbHVtbnMpIHtcbiAgICAgICAgICBpZiAoc2V0dGluZ3MgIT09IGN0eCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBjb2xJZHggPSBjb2x1bW4uaWR4O1xuICAgICAgICAgIGNlbGwucmVtb3ZlQ2xhc3MoY29sdW1uLnNTb3J0aW5nQ2xhc3MgKyAnICcgKyBjbGFzc2VzLnNTb3J0QXNjICsgJyAnICsgY2xhc3Nlcy5zU29ydERlc2MpLmFkZENsYXNzKGNvbHVtbnNbY29sSWR4XSA9PSAnYXNjJyA/IGNsYXNzZXMuc1NvcnRBc2MgOiBjb2x1bW5zW2NvbElkeF0gPT0gJ2Rlc2MnID8gY2xhc3Nlcy5zU29ydERlc2MgOiBjb2x1bW4uc1NvcnRpbmdDbGFzcyk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGpxdWVyeXVpOiBmdW5jdGlvbiBqcXVlcnl1aShzZXR0aW5ncywgY2VsbCwgY29sdW1uLCBjbGFzc2VzKSB7XG4gICAgICAgICQoJzxkaXYvPicpLmFkZENsYXNzKGNsYXNzZXMuc1NvcnRKVUlXcmFwcGVyKS5hcHBlbmQoY2VsbC5jb250ZW50cygpKS5hcHBlbmQoJCgnPHNwYW4vPicpLmFkZENsYXNzKGNsYXNzZXMuc1NvcnRJY29uICsgJyAnICsgY29sdW1uLnNTb3J0aW5nQ2xhc3NKVUkpKS5hcHBlbmRUbyhjZWxsKTtcbiAgICAgICAgJChzZXR0aW5ncy5uVGFibGUpLm9uKCdvcmRlci5kdC5EVCcsIGZ1bmN0aW9uIChlLCBjdHgsIHNvcnRpbmcsIGNvbHVtbnMpIHtcbiAgICAgICAgICBpZiAoc2V0dGluZ3MgIT09IGN0eCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBjb2xJZHggPSBjb2x1bW4uaWR4O1xuICAgICAgICAgIGNlbGwucmVtb3ZlQ2xhc3MoY2xhc3Nlcy5zU29ydEFzYyArIFwiIFwiICsgY2xhc3Nlcy5zU29ydERlc2MpLmFkZENsYXNzKGNvbHVtbnNbY29sSWR4XSA9PSAnYXNjJyA/IGNsYXNzZXMuc1NvcnRBc2MgOiBjb2x1bW5zW2NvbElkeF0gPT0gJ2Rlc2MnID8gY2xhc3Nlcy5zU29ydERlc2MgOiBjb2x1bW4uc1NvcnRpbmdDbGFzcyk7XG4gICAgICAgICAgY2VsbC5maW5kKCdzcGFuLicgKyBjbGFzc2VzLnNTb3J0SWNvbikucmVtb3ZlQ2xhc3MoY2xhc3Nlcy5zU29ydEpVSUFzYyArIFwiIFwiICsgY2xhc3Nlcy5zU29ydEpVSURlc2MgKyBcIiBcIiArIGNsYXNzZXMuc1NvcnRKVUkgKyBcIiBcIiArIGNsYXNzZXMuc1NvcnRKVUlBc2NBbGxvd2VkICsgXCIgXCIgKyBjbGFzc2VzLnNTb3J0SlVJRGVzY0FsbG93ZWQpLmFkZENsYXNzKGNvbHVtbnNbY29sSWR4XSA9PSAnYXNjJyA/IGNsYXNzZXMuc1NvcnRKVUlBc2MgOiBjb2x1bW5zW2NvbElkeF0gPT0gJ2Rlc2MnID8gY2xhc3Nlcy5zU29ydEpVSURlc2MgOiBjb2x1bW4uc1NvcnRpbmdDbGFzc0pVSSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgdmFyIF9faHRtbEVzY2FwZUVudGl0aWVzID0gZnVuY3Rpb24gX19odG1sRXNjYXBlRW50aXRpZXMoZCkge1xuICAgIHJldHVybiB0eXBlb2YgZCA9PT0gJ3N0cmluZycgPyBkLnJlcGxhY2UoLzwvZywgJyZsdDsnKS5yZXBsYWNlKC8+L2csICcmZ3Q7JykucmVwbGFjZSgvXCIvZywgJyZxdW90OycpIDogZDtcbiAgfTtcblxuICBEYXRhVGFibGUucmVuZGVyID0ge1xuICAgIG51bWJlcjogZnVuY3Rpb24gbnVtYmVyKHRob3VzYW5kcywgZGVjaW1hbCwgcHJlY2lzaW9uLCBwcmVmaXgsIHBvc3RmaXgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRpc3BsYXk6IGZ1bmN0aW9uIGRpc3BsYXkoZCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgZCAhPT0gJ251bWJlcicgJiYgdHlwZW9mIGQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgbmVnYXRpdmUgPSBkIDwgMCA/ICctJyA6ICcnO1xuICAgICAgICAgIHZhciBmbG8gPSBwYXJzZUZsb2F0KGQpO1xuXG4gICAgICAgICAgaWYgKGlzTmFOKGZsbykpIHtcbiAgICAgICAgICAgIHJldHVybiBfX2h0bWxFc2NhcGVFbnRpdGllcyhkKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmbG8gPSBmbG8udG9GaXhlZChwcmVjaXNpb24pO1xuICAgICAgICAgIGQgPSBNYXRoLmFicyhmbG8pO1xuICAgICAgICAgIHZhciBpbnRQYXJ0ID0gcGFyc2VJbnQoZCwgMTApO1xuICAgICAgICAgIHZhciBmbG9hdFBhcnQgPSBwcmVjaXNpb24gPyBkZWNpbWFsICsgKGQgLSBpbnRQYXJ0KS50b0ZpeGVkKHByZWNpc2lvbikuc3Vic3RyaW5nKDIpIDogJyc7XG4gICAgICAgICAgcmV0dXJuIG5lZ2F0aXZlICsgKHByZWZpeCB8fCAnJykgKyBpbnRQYXJ0LnRvU3RyaW5nKCkucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgdGhvdXNhbmRzKSArIGZsb2F0UGFydCArIChwb3N0Zml4IHx8ICcnKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHRleHQ6IGZ1bmN0aW9uIHRleHQoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkaXNwbGF5OiBfX2h0bWxFc2NhcGVFbnRpdGllc1xuICAgICAgfTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gX2ZuRXh0ZXJuQXBpRnVuYyhmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXJncyA9IFtfZm5TZXR0aW5nc0Zyb21Ob2RlKHRoaXNbRGF0YVRhYmxlLmV4dC5pQXBpSW5kZXhdKV0uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgICAgcmV0dXJuIERhdGFUYWJsZS5leHQuaW50ZXJuYWxbZm5dLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gIH1cblxuICAkLmV4dGVuZChEYXRhVGFibGUuZXh0LmludGVybmFsLCB7XG4gICAgX2ZuRXh0ZXJuQXBpRnVuYzogX2ZuRXh0ZXJuQXBpRnVuYyxcbiAgICBfZm5CdWlsZEFqYXg6IF9mbkJ1aWxkQWpheCxcbiAgICBfZm5BamF4VXBkYXRlOiBfZm5BamF4VXBkYXRlLFxuICAgIF9mbkFqYXhQYXJhbWV0ZXJzOiBfZm5BamF4UGFyYW1ldGVycyxcbiAgICBfZm5BamF4VXBkYXRlRHJhdzogX2ZuQWpheFVwZGF0ZURyYXcsXG4gICAgX2ZuQWpheERhdGFTcmM6IF9mbkFqYXhEYXRhU3JjLFxuICAgIF9mbkFkZENvbHVtbjogX2ZuQWRkQ29sdW1uLFxuICAgIF9mbkNvbHVtbk9wdGlvbnM6IF9mbkNvbHVtbk9wdGlvbnMsXG4gICAgX2ZuQWRqdXN0Q29sdW1uU2l6aW5nOiBfZm5BZGp1c3RDb2x1bW5TaXppbmcsXG4gICAgX2ZuVmlzaWJsZVRvQ29sdW1uSW5kZXg6IF9mblZpc2libGVUb0NvbHVtbkluZGV4LFxuICAgIF9mbkNvbHVtbkluZGV4VG9WaXNpYmxlOiBfZm5Db2x1bW5JbmRleFRvVmlzaWJsZSxcbiAgICBfZm5WaXNibGVDb2x1bW5zOiBfZm5WaXNibGVDb2x1bW5zLFxuICAgIF9mbkdldENvbHVtbnM6IF9mbkdldENvbHVtbnMsXG4gICAgX2ZuQ29sdW1uVHlwZXM6IF9mbkNvbHVtblR5cGVzLFxuICAgIF9mbkFwcGx5Q29sdW1uRGVmczogX2ZuQXBwbHlDb2x1bW5EZWZzLFxuICAgIF9mbkh1bmdhcmlhbk1hcDogX2ZuSHVuZ2FyaWFuTWFwLFxuICAgIF9mbkNhbWVsVG9IdW5nYXJpYW46IF9mbkNhbWVsVG9IdW5nYXJpYW4sXG4gICAgX2ZuTGFuZ3VhZ2VDb21wYXQ6IF9mbkxhbmd1YWdlQ29tcGF0LFxuICAgIF9mbkJyb3dzZXJEZXRlY3Q6IF9mbkJyb3dzZXJEZXRlY3QsXG4gICAgX2ZuQWRkRGF0YTogX2ZuQWRkRGF0YSxcbiAgICBfZm5BZGRUcjogX2ZuQWRkVHIsXG4gICAgX2ZuTm9kZVRvRGF0YUluZGV4OiBfZm5Ob2RlVG9EYXRhSW5kZXgsXG4gICAgX2ZuTm9kZVRvQ29sdW1uSW5kZXg6IF9mbk5vZGVUb0NvbHVtbkluZGV4LFxuICAgIF9mbkdldENlbGxEYXRhOiBfZm5HZXRDZWxsRGF0YSxcbiAgICBfZm5TZXRDZWxsRGF0YTogX2ZuU2V0Q2VsbERhdGEsXG4gICAgX2ZuU3BsaXRPYmpOb3RhdGlvbjogX2ZuU3BsaXRPYmpOb3RhdGlvbixcbiAgICBfZm5HZXRPYmplY3REYXRhRm46IF9mbkdldE9iamVjdERhdGFGbixcbiAgICBfZm5TZXRPYmplY3REYXRhRm46IF9mblNldE9iamVjdERhdGFGbixcbiAgICBfZm5HZXREYXRhTWFzdGVyOiBfZm5HZXREYXRhTWFzdGVyLFxuICAgIF9mbkNsZWFyVGFibGU6IF9mbkNsZWFyVGFibGUsXG4gICAgX2ZuRGVsZXRlSW5kZXg6IF9mbkRlbGV0ZUluZGV4LFxuICAgIF9mbkludmFsaWRhdGU6IF9mbkludmFsaWRhdGUsXG4gICAgX2ZuR2V0Um93RWxlbWVudHM6IF9mbkdldFJvd0VsZW1lbnRzLFxuICAgIF9mbkNyZWF0ZVRyOiBfZm5DcmVhdGVUcixcbiAgICBfZm5CdWlsZEhlYWQ6IF9mbkJ1aWxkSGVhZCxcbiAgICBfZm5EcmF3SGVhZDogX2ZuRHJhd0hlYWQsXG4gICAgX2ZuRHJhdzogX2ZuRHJhdyxcbiAgICBfZm5SZURyYXc6IF9mblJlRHJhdyxcbiAgICBfZm5BZGRPcHRpb25zSHRtbDogX2ZuQWRkT3B0aW9uc0h0bWwsXG4gICAgX2ZuRGV0ZWN0SGVhZGVyOiBfZm5EZXRlY3RIZWFkZXIsXG4gICAgX2ZuR2V0VW5pcXVlVGhzOiBfZm5HZXRVbmlxdWVUaHMsXG4gICAgX2ZuRmVhdHVyZUh0bWxGaWx0ZXI6IF9mbkZlYXR1cmVIdG1sRmlsdGVyLFxuICAgIF9mbkZpbHRlckNvbXBsZXRlOiBfZm5GaWx0ZXJDb21wbGV0ZSxcbiAgICBfZm5GaWx0ZXJDdXN0b206IF9mbkZpbHRlckN1c3RvbSxcbiAgICBfZm5GaWx0ZXJDb2x1bW46IF9mbkZpbHRlckNvbHVtbixcbiAgICBfZm5GaWx0ZXI6IF9mbkZpbHRlcixcbiAgICBfZm5GaWx0ZXJDcmVhdGVTZWFyY2g6IF9mbkZpbHRlckNyZWF0ZVNlYXJjaCxcbiAgICBfZm5Fc2NhcGVSZWdleDogX2ZuRXNjYXBlUmVnZXgsXG4gICAgX2ZuRmlsdGVyRGF0YTogX2ZuRmlsdGVyRGF0YSxcbiAgICBfZm5GZWF0dXJlSHRtbEluZm86IF9mbkZlYXR1cmVIdG1sSW5mbyxcbiAgICBfZm5VcGRhdGVJbmZvOiBfZm5VcGRhdGVJbmZvLFxuICAgIF9mbkluZm9NYWNyb3M6IF9mbkluZm9NYWNyb3MsXG4gICAgX2ZuSW5pdGlhbGlzZTogX2ZuSW5pdGlhbGlzZSxcbiAgICBfZm5Jbml0Q29tcGxldGU6IF9mbkluaXRDb21wbGV0ZSxcbiAgICBfZm5MZW5ndGhDaGFuZ2U6IF9mbkxlbmd0aENoYW5nZSxcbiAgICBfZm5GZWF0dXJlSHRtbExlbmd0aDogX2ZuRmVhdHVyZUh0bWxMZW5ndGgsXG4gICAgX2ZuRmVhdHVyZUh0bWxQYWdpbmF0ZTogX2ZuRmVhdHVyZUh0bWxQYWdpbmF0ZSxcbiAgICBfZm5QYWdlQ2hhbmdlOiBfZm5QYWdlQ2hhbmdlLFxuICAgIF9mbkZlYXR1cmVIdG1sUHJvY2Vzc2luZzogX2ZuRmVhdHVyZUh0bWxQcm9jZXNzaW5nLFxuICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5OiBfZm5Qcm9jZXNzaW5nRGlzcGxheSxcbiAgICBfZm5GZWF0dXJlSHRtbFRhYmxlOiBfZm5GZWF0dXJlSHRtbFRhYmxlLFxuICAgIF9mblNjcm9sbERyYXc6IF9mblNjcm9sbERyYXcsXG4gICAgX2ZuQXBwbHlUb0NoaWxkcmVuOiBfZm5BcHBseVRvQ2hpbGRyZW4sXG4gICAgX2ZuQ2FsY3VsYXRlQ29sdW1uV2lkdGhzOiBfZm5DYWxjdWxhdGVDb2x1bW5XaWR0aHMsXG4gICAgX2ZuVGhyb3R0bGU6IF9mblRocm90dGxlLFxuICAgIF9mbkNvbnZlcnRUb1dpZHRoOiBfZm5Db252ZXJ0VG9XaWR0aCxcbiAgICBfZm5HZXRXaWRlc3ROb2RlOiBfZm5HZXRXaWRlc3ROb2RlLFxuICAgIF9mbkdldE1heExlblN0cmluZzogX2ZuR2V0TWF4TGVuU3RyaW5nLFxuICAgIF9mblN0cmluZ1RvQ3NzOiBfZm5TdHJpbmdUb0NzcyxcbiAgICBfZm5Tb3J0RmxhdHRlbjogX2ZuU29ydEZsYXR0ZW4sXG4gICAgX2ZuU29ydDogX2ZuU29ydCxcbiAgICBfZm5Tb3J0QXJpYTogX2ZuU29ydEFyaWEsXG4gICAgX2ZuU29ydExpc3RlbmVyOiBfZm5Tb3J0TGlzdGVuZXIsXG4gICAgX2ZuU29ydEF0dGFjaExpc3RlbmVyOiBfZm5Tb3J0QXR0YWNoTGlzdGVuZXIsXG4gICAgX2ZuU29ydGluZ0NsYXNzZXM6IF9mblNvcnRpbmdDbGFzc2VzLFxuICAgIF9mblNvcnREYXRhOiBfZm5Tb3J0RGF0YSxcbiAgICBfZm5TYXZlU3RhdGU6IF9mblNhdmVTdGF0ZSxcbiAgICBfZm5Mb2FkU3RhdGU6IF9mbkxvYWRTdGF0ZSxcbiAgICBfZm5TZXR0aW5nc0Zyb21Ob2RlOiBfZm5TZXR0aW5nc0Zyb21Ob2RlLFxuICAgIF9mbkxvZzogX2ZuTG9nLFxuICAgIF9mbk1hcDogX2ZuTWFwLFxuICAgIF9mbkJpbmRBY3Rpb246IF9mbkJpbmRBY3Rpb24sXG4gICAgX2ZuQ2FsbGJhY2tSZWc6IF9mbkNhbGxiYWNrUmVnLFxuICAgIF9mbkNhbGxiYWNrRmlyZTogX2ZuQ2FsbGJhY2tGaXJlLFxuICAgIF9mbkxlbmd0aE92ZXJmbG93OiBfZm5MZW5ndGhPdmVyZmxvdyxcbiAgICBfZm5SZW5kZXJlcjogX2ZuUmVuZGVyZXIsXG4gICAgX2ZuRGF0YVNvdXJjZTogX2ZuRGF0YVNvdXJjZSxcbiAgICBfZm5Sb3dBdHRyaWJ1dGVzOiBfZm5Sb3dBdHRyaWJ1dGVzLFxuICAgIF9mbkV4dGVuZDogX2ZuRXh0ZW5kLFxuICAgIF9mbkNhbGN1bGF0ZUVuZDogZnVuY3Rpb24gX2ZuQ2FsY3VsYXRlRW5kKCkge31cbiAgfSk7XG4gICQuZm4uZGF0YVRhYmxlID0gRGF0YVRhYmxlO1xuICBEYXRhVGFibGUuJCA9ICQ7XG4gICQuZm4uZGF0YVRhYmxlU2V0dGluZ3MgPSBEYXRhVGFibGUuc2V0dGluZ3M7XG4gICQuZm4uZGF0YVRhYmxlRXh0ID0gRGF0YVRhYmxlLmV4dDtcblxuICAkLmZuLkRhdGFUYWJsZSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgcmV0dXJuICQodGhpcykuZGF0YVRhYmxlKG9wdHMpLmFwaSgpO1xuICB9O1xuXG4gICQuZWFjaChEYXRhVGFibGUsIGZ1bmN0aW9uIChwcm9wLCB2YWwpIHtcbiAgICAkLmZuLkRhdGFUYWJsZVtwcm9wXSA9IHZhbDtcbiAgfSk7XG4gIHJldHVybiAkLmZuLmRhdGFUYWJsZTtcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0ZEQ1RfRHJvcERvd25TZWxlY3QgPSB7XG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge31cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXRkRDVF9UZXh0Qm94ID0ge1xuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKF9yZW5kZXJlckNoYWluUGFyYXMpIHt9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0ZEQ1RfVGV4dERhdGVUaW1lID0ge1xuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKF9yZW5kZXJlckNoYWluUGFyYXMpIHt9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfRm9ybUJ1dHRvbiA9IHtcbiAgX0xpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlOiBudWxsLFxuICBSZW5kZXJlckNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckNoYWluLFxuICBSZXNvbHZlU2VsZjogZnVuY3Rpb24gUmVzb2x2ZVNlbGYoX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB2YXIgY2FwdGlvbiA9ICRzaW5nbGVDb250cm9sRWxlbS5hdHRyKFwiYnV0dG9uY2FwdGlvblwiKTtcbiAgICB2YXIgJGJ1dHRvbiA9ICQoXCI8YnV0dG9uIGNsYXNzPSd3bGRjdC1saXN0LWJ1dHRvbic+XCIgKyBjYXB0aW9uICsgXCI8L2J1dHRvbj5cIik7XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSAkc2luZ2xlQ29udHJvbEVsZW0ucHJvcChcImF0dHJpYnV0ZXNcIik7XG4gICAgJC5lYWNoKGF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICRidXR0b24uYXR0cih0aGlzLm5hbWUsIHRoaXMudmFsdWUpO1xuICAgIH0pO1xuICAgICRidXR0b24uYmluZChcImNsaWNrXCIsIHtcbiAgICAgIFwiYnV0dG9uRWxlbVwiOiAkYnV0dG9uLFxuICAgICAgXCJzZWxmSW5zdGFuY2VcIjogdGhpc1xuICAgIH0sIHRoaXMuQ2xpY2tFdmVudCk7XG4gICAgcmV0dXJuICRidXR0b247XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbihfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdmFyICRXTERDVF9MaXN0QnV0dG9uQ29udGFpbmVyID0gJHNpbmdsZUNvbnRyb2xFbGVtLnBhcmVudHMoXCJbc2luZ2xlbmFtZT0nV0xEQ1RfTGlzdEJ1dHRvbkNvbnRhaW5lciddXCIpO1xuICAgIHZhciAkV0xEQ1RfTGlzdFRhYmxlQ29udGFpbmVyRWxlbSA9ICRXTERDVF9MaXN0QnV0dG9uQ29udGFpbmVyLm5leHRBbGwoXCJbY2xpZW50X3Jlc29sdmU9J1dMRENUX0xpc3RUYWJsZUNvbnRhaW5lciddXCIpO1xuICAgIHRoaXMuX0xpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlID0gSFRNTENvbnRyb2wuR2V0Q29udHJvbEluc3RhbmNlQnlFbGVtKCRXTERDVF9MaXN0VGFibGVDb250YWluZXJFbGVtKTtcbiAgfSxcbiAgQ2xpY2tFdmVudDogZnVuY3Rpb24gQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICB2YXIgJGJ1dHRvbiA9IHNlbmRlci5kYXRhLmJ1dHRvbkVsZW07XG4gICAgdmFyIF9zZWxmID0gc2VuZGVyLmRhdGEuc2VsZkluc3RhbmNlO1xuICAgIGNvbnNvbGUubG9nKCRidXR0b24pO1xuICAgIHZhciBiaW5kYXV0aG9yaXR5ID0gJGJ1dHRvbi5hdHRyKFwiYmluZGF1dGhvcml0eVwiKTtcbiAgICB2YXIgYnV0dG9uY2FwdGlvbiA9ICRidXR0b24uYXR0cihcImJ1dHRvbmNhcHRpb25cIik7XG4gICAgdmFyIGJ1dHRvbnR5cGUgPSAkYnV0dG9uLmF0dHIoXCJidXR0b250eXBlXCIpO1xuICAgIHZhciBjdXN0Y2xpZW50Y2xpY2tiZWZvcmVtZXRob2QgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50Y2xpY2tiZWZvcmVtZXRob2RcIik7XG4gICAgdmFyIGN1c3RjbGllbnRjbGlja2JlZm9yZW1ldGhvZHBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50Y2xpY2tiZWZvcmVtZXRob2RwYXJhXCIpO1xuICAgIHZhciBjdXN0Y2xpZW50cmVuZGVyZXJhZnRlcm1ldGhvZHBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50cmVuZGVyZXJhZnRlcm1ldGhvZHBhcmFcIik7XG4gICAgdmFyIGN1c3RjbGllbnRyZW5kZXJlcmFmdGVybWV0aG9kcGFyYXBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50cmVuZGVyZXJhZnRlcm1ldGhvZHBhcmFwYXJhXCIpO1xuICAgIHZhciBjdXN0Y2xpZW50cmVuZGVyZXJtZXRob2QgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50cmVuZGVyZXJtZXRob2RcIik7XG4gICAgdmFyIGN1c3RjbGllbnRyZW5kZXJlcm1ldGhvZHBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0Y2xpZW50cmVuZGVyZXJtZXRob2RwYXJhXCIpO1xuICAgIHZhciBjdXN0c2VydmVycmVzb2x2ZW1ldGhvZCA9ICRidXR0b24uYXR0cihcImN1c3RzZXJ2ZXJyZXNvbHZlbWV0aG9kXCIpO1xuICAgIHZhciBjdXN0c2VydmVycmVzb2x2ZW1ldGhvZHBhcmEgPSAkYnV0dG9uLmF0dHIoXCJjdXN0c2VydmVycmVzb2x2ZW1ldGhvZHBhcmFcIik7XG4gICAgdmFyIGZvcm1jb2RlID0gJGJ1dHRvbi5hdHRyKFwiZm9ybWNvZGVcIik7XG4gICAgdmFyIGZvcm1pZCA9ICRidXR0b24uYXR0cihcImZvcm1pZFwiKTtcbiAgICB2YXIgZm9ybW1vZHVsZWlkID0gJGJ1dHRvbi5hdHRyKFwiZm9ybW1vZHVsZWlkXCIpO1xuICAgIHZhciBmb3JtbW9kdWxlbmFtZSA9ICRidXR0b24uYXR0cihcImZvcm1tb2R1bGVuYW1lXCIpO1xuICAgIHZhciBmb3JtbmFtZSA9ICRidXR0b24uYXR0cihcImZvcm1uYW1lXCIpO1xuICAgIHZhciBlbGVtaWQgPSAkYnV0dG9uLmF0dHIoXCJpZFwiKTtcbiAgICB2YXIgYnV0dG9uaWQgPSAkYnV0dG9uLmF0dHIoXCJidXR0b25pZFwiKTtcbiAgICB2YXIgaW5uZXJidXR0b25qc29uc3RyaW5nID0gJGJ1dHRvbi5hdHRyKFwiaW5uZXJidXR0b25qc29uc3RyaW5nXCIpO1xuICAgIHZhciBvcGVudHlwZSA9ICRidXR0b24uYXR0cihcIm9wZW50eXBlXCIpO1xuICAgIHZhciBvcGVyYXRpb24gPSAkYnV0dG9uLmF0dHIoXCJvcGVyYXRpb25cIik7XG4gICAgdmFyIHNpbmdsZW5hbWUgPSAkYnV0dG9uLmF0dHIoXCJzaW5nbGVuYW1lXCIpO1xuICAgIHZhciB3aW5kb3djYXB0aW9uID0gJGJ1dHRvbi5hdHRyKFwid2luZG93Y2FwdGlvblwiKTtcbiAgICB2YXIgd2luZG93aGVpZ2h0ID0gJGJ1dHRvbi5hdHRyKFwid2luZG93aGVpZ2h0XCIpO1xuICAgIHZhciB3aW5kb3d3aWR0aCA9ICRidXR0b24uYXR0cihcIndpbmRvd3dpZHRoXCIpO1xuICAgIHZhciBjbGllbnRfcmVzb2x2ZSA9ICRidXR0b24uYXR0cihcImNsaWVudF9yZXNvbHZlXCIpO1xuICAgIHZhciByZWNvcmRJZCA9IFwiXCI7XG5cbiAgICBpZiAob3BlcmF0aW9uID09IFwidXBkYXRlXCIgfHwgb3BlcmF0aW9uID09IFwidmlld1wiKSB7XG4gICAgICB2YXIgY2hlY2tlZFJlY29yZE9ianMgPSBfc2VsZi5fTGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UuR2V0Q2hlY2tlZFJlY29yZCgpO1xuXG4gICAgICBpZiAoY2hlY2tlZFJlY29yZE9ianMubGVuZ3RoID09IDApIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7fpgInmi6npnIDopoHov5vooYzmk43kvZznmoTorrDlvZUhXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKGNoZWNrZWRSZWNvcmRPYmpzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLkuIDmrKHlj6rog73mk43kvZzkuIDmnaHorrDlvZUhXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWNvcmRJZCA9IGNoZWNrZWRSZWNvcmRPYmpzWzBdLklkO1xuICAgICAgfVxuICAgIH1cblxuICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIEJhc2VVdGlsaXR5LkJ1aWxkVmlldyhcIi9IVE1ML0J1aWxkZXIvUnVudGltZS9XZWJGb3JtUnVudGltZS5odG1sXCIsIHtcbiAgICAgIGZvcm1JZDogZm9ybWlkLFxuICAgICAgYnV0dG9uSWQ6IGJ1dHRvbmlkLFxuICAgICAgZWxlbUlkOiBlbGVtaWQsXG4gICAgICByZWNvcmRJZDogcmVjb3JkSWRcbiAgICB9KSwge1xuICAgICAgd2lkdGg6IHdpbmRvd3dpZHRoLFxuICAgICAgaGVpZ2h0OiB3aW5kb3doZWlnaHQsXG4gICAgICB0aXRsZTogd2luZG93Y2FwdGlvblxuICAgIH0sIDEsIHRydWUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdEJ1dHRvbkNvbnRhaW5lciA9IHtcbiAgUmVuZGVyZXJDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJDaGFpbihfcmVuZGVyZXJDaGFpblBhcmFzKSB7XG4gICAgdmFyICRzaW5nbGVDb250cm9sRWxlbSA9IF9yZW5kZXJlckNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtO1xuICAgIHZhciAkYnV0dG9uRGl2RWxlbUxpc3QgPSAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcImRpdlwiICsgSFRNTENvbnRyb2xBdHRycy5TRUxFQ1RFRF9KQlVJTEQ0RENfQ1VTVE9NKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcIltpcy1vcC1idXR0b24td3JhcC10YWJsZT0ndHJ1ZSddXCIpLmhpZGUoKTtcbiAgICB2YXIgaW5uZXJXcmFwID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCIud2xkY3QtbGlzdC1idXR0b24taW5uZXItd3JhcFwiKTtcbiAgICB2YXIgaW5uZXJJbnNpZGVXcmFwRGl2ID0gJChcIjxkaXYgY2xhc3M9J3dsZGN0LWxpc3QtYnV0dG9uLWlubmVyLWluc2lkZS13cmFwJyAvPlwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJGJ1dHRvbkRpdkVsZW1MaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJGJ1dHRvbkVsZW0gPSAkKCRidXR0b25EaXZFbGVtTGlzdFtpXSk7XG4gICAgICB2YXIgY2xpZW50UmVzb2x2ZU5hbWUgPSAkYnV0dG9uRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuQ0xJRU5UX1JFU09MVkUpO1xuICAgICAgdmFyIGNsaWVudFJlc29sdmVPYmplY3QgPSBPYmplY3QuY3JlYXRlKGV2YWwoY2xpZW50UmVzb2x2ZU5hbWUpKTtcbiAgICAgIHZhciAkcmVzb2x2ZWRFbGVtID0gY2xpZW50UmVzb2x2ZU9iamVjdC5SZXNvbHZlU2VsZih7XG4gICAgICAgIHNvdXJjZUhUTUw6IF9yZW5kZXJlckNoYWluUGFyYXMuc291cmNlSFRNTCxcbiAgICAgICAgJHJvb3RFbGVtOiBfcmVuZGVyZXJDaGFpblBhcmFzLiRyb290RWxlbSxcbiAgICAgICAgJHBhcmVudENvbnRyb2xFbGVtOiAkc2luZ2xlQ29udHJvbEVsZW0sXG4gICAgICAgICRzaW5nbGVDb250cm9sRWxlbTogJGJ1dHRvbkVsZW0sXG4gICAgICAgIGFsbERhdGE6IF9yZW5kZXJlckNoYWluUGFyYXMuYWxsRGF0YVxuICAgICAgfSk7XG4gICAgICBpbm5lckluc2lkZVdyYXBEaXYuYXBwZW5kKCRyZXNvbHZlZEVsZW0pO1xuICAgIH1cblxuICAgIGlubmVyV3JhcC5hcHBlbmQoaW5uZXJJbnNpZGVXcmFwRGl2KTtcbiAgICBpbm5lcldyYXAuYXBwZW5kKFwiPGRpdiBzdHlsZT1cXFwiY2xlYXI6IGJvdGg7XFxcIj48L2Rpdj5cIik7XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckRhdGFDaGFpblxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RDb21wbGV4U2VhcmNoQ29udGFpbmVyID0ge1xuICBfJFNpbmdsZUNvbnRyb2xFbGVtOiBudWxsLFxuICBfJENvbXBsZXhTZWFyY2hCdXR0b246IG51bGwsXG4gIF8kQ2xlYXJCdXR0b246IG51bGwsXG4gIF8kQ2xvc2VCdXR0b246IG51bGwsXG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0gPSAkc2luZ2xlQ29udHJvbEVsZW07XG4gICAgSFRNTENvbnRyb2wuU2F2ZUNvbnRyb2xOZXdJbnN0YW5jZVRvUG9vbCgkc2luZ2xlQ29udHJvbEVsZW0sIHRoaXMpO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5oaWRlKCk7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCIud2xkY3QtbGlzdC1jb21wbGV4LXNlYXJjaC1pbm5lci13cmFwXCIpLmhlaWdodChcIjMwNXB4XCIpO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwiLndsZGN0LWxpc3QtY29tcGxleC1zZWFyY2gtaW5uZXItd3JhcFwiKS5jc3MoXCJvdmVyZmxvd1wiLCBcImF1dG9cIik7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCIud2xkY3QtbGlzdC1jb21wbGV4LXNlYXJjaC1pbm5lci13cmFwXCIpLmFkZENsYXNzKFwiZGl2LWN1c3RvbS1zY3JvbGxcIik7XG4gICAgdmFyICRzZWFyY2hCdXR0b25zV3JhcCA9ICQoXCI8ZGl2IGNsYXNzPSd3bGRjdC1saXN0LWNvbXBsZXgtc2VhcmNoLWJ1dHRvbi1pbm5lci13cmFwJz48ZGl2IGNsYXNzPSdidXR0b24taW5uZXItd3JhcCc+PC9kaXY+PC9kaXY+XCIpO1xuICAgIHRoaXMuXyRDb21wbGV4U2VhcmNoQnV0dG9uID0gJChcIjxidXR0b24+5p+l6K+iPC9idXR0b24+XCIpO1xuICAgIHRoaXMuXyRDbGVhckJ1dHRvbiA9ICQoXCI8YnV0dG9uPua4heepujwvYnV0dG9uPlwiKTtcbiAgICB0aGlzLl8kQ2xvc2VCdXR0b24gPSAkKFwiPGJ1dHRvbj7lhbPpl608L2J1dHRvbj5cIik7XG4gICAgJHNlYXJjaEJ1dHRvbnNXcmFwLmZpbmQoXCIuYnV0dG9uLWlubmVyLXdyYXBcIikuYXBwZW5kKHRoaXMuXyRDb21wbGV4U2VhcmNoQnV0dG9uKS5hcHBlbmQodGhpcy5fJENsZWFyQnV0dG9uKS5hcHBlbmQodGhpcy5fJENsb3NlQnV0dG9uKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uYXBwZW5kKCRzZWFyY2hCdXR0b25zV3JhcCk7XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckRhdGFDaGFpbixcbiAgQnVpbGRlclNlYXJjaENvbmRpdGlvbjogZnVuY3Rpb24gQnVpbGRlclNlYXJjaENvbmRpdGlvbigpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICB2YXIgYWxsQ29udHJvbHMgPSB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0uZmluZChIVE1MQ29udHJvbEF0dHJzLlNFTEVDVEVEX0pCVUlMRDREQ19DVVNUT00pO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxDb250cm9scy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyICRlbGVtID0gJChhbGxDb250cm9sc1tpXSk7XG4gICAgICB2YXIgaW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sSW5zdGFuY2VCeUVsZW0oJGVsZW0pO1xuICAgICAgdmFyIHZhbE9iaiA9IGluc3RhbmNlLkdldFZhbHVlKCRlbGVtLCB7fSk7XG4gICAgICB2YXIgdmFsdWUgPSB2YWxPYmoudmFsdWU7XG5cbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgb3BlcmF0b3I6ICRlbGVtLmF0dHIoXCJjb2x1bW5vcGVyYXRvclwiKSxcbiAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgdGFibGVOYW1lOiAkZWxlbS5hdHRyKFwiY29sdW1udGFibGVuYW1lXCIpLFxuICAgICAgICAgIGZpZWxkTmFtZTogJGVsZW0uYXR0cihcImNvbHVtbm5hbWVcIilcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgR2V0U3RhdHVzOiBmdW5jdGlvbiBHZXRTdGF0dXMoKSB7XG4gICAgdmFyIHN0YXR1cyA9IHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbS5hdHRyKFwic3RhdHVzXCIpO1xuXG4gICAgaWYgKHN0YXR1cyA9PSBcIlwiKSB7XG4gICAgICBzdGF0dXMgPSBcImVuYWJsZVwiO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0dXM7XG4gIH0sXG4gIEhpZGU6IGZ1bmN0aW9uIEhpZGUoKSB7XG4gICAgdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtLmhpZGUoKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RTaW1wbGVTZWFyY2hDb250YWluZXIgPSB7XG4gIF8kU2ltcGxlU2VhcmNoQnV0dG9uOiBudWxsLFxuICBfJFNob3dDb21wbGV4U2VhcmNoQnV0dG9uOiBudWxsLFxuICBfJFNpbmdsZUNvbnRyb2xFbGVtOiBudWxsLFxuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKF9yZW5kZXJlckNoYWluUGFyYXMpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gX3JlbmRlcmVyQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtID0gJHNpbmdsZUNvbnRyb2xFbGVtO1xuICAgIHZhciBwYWdlV2lkdGggPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VXaWR0aCgpO1xuICAgIHZhciBidXR0b25XcmFwV2lkdGggPSAyMDA7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZTpmaXJzdFwiKS53aWR0aChwYWdlV2lkdGggLSBidXR0b25XcmFwV2lkdGgpO1xuICAgIEhUTUxDb250cm9sLlNhdmVDb250cm9sTmV3SW5zdGFuY2VUb1Bvb2woJHNpbmdsZUNvbnRyb2xFbGVtLCB0aGlzKTtcbiAgICB2YXIgJHNlYXJjaEJ1dHRvbnNXcmFwID0gJChcIjxkaXYgY2xhc3M9J3dsZGN0LWxpc3Qtc2ltcGxlLXNlYXJjaC1idXR0b24taW5uZXItd3JhcCcgLz5cIik7XG4gICAgJHNlYXJjaEJ1dHRvbnNXcmFwLndpZHRoKGJ1dHRvbldyYXBXaWR0aCAtIDQwKTtcbiAgICB0aGlzLl8kU2ltcGxlU2VhcmNoQnV0dG9uID0gJChcIjxidXR0b24+5p+l6K+iPC9idXR0b24+XCIpO1xuICAgIHRoaXMuXyRTaG93Q29tcGxleFNlYXJjaEJ1dHRvbiA9ICQoXCI8YnV0dG9uPumrmOe6p+afpeivojwvYnV0dG9uPlwiKTtcbiAgICAkc2VhcmNoQnV0dG9uc1dyYXAuYXBwZW5kKHRoaXMuXyRTaW1wbGVTZWFyY2hCdXR0b24pO1xuICAgICRzZWFyY2hCdXR0b25zV3JhcC5hcHBlbmQodGhpcy5fJFNob3dDb21wbGV4U2VhcmNoQnV0dG9uKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uYXBwZW5kKCRzZWFyY2hCdXR0b25zV3JhcCk7XG4gICAgSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpbihfcmVuZGVyZXJDaGFpblBhcmFzKTtcbiAgfSxcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyRGF0YUNoYWluLFxuICBCdWlsZGVyU2VhcmNoQ29uZGl0aW9uOiBmdW5jdGlvbiBCdWlsZGVyU2VhcmNoQ29uZGl0aW9uKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgIHZhciBhbGxDb250cm9scyA9IHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbS5maW5kKEhUTUxDb250cm9sQXR0cnMuU0VMRUNURURfSkJVSUxENERDX0NVU1RPTSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbENvbnRyb2xzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJGVsZW0gPSAkKGFsbENvbnRyb2xzW2ldKTtcbiAgICAgIHZhciBpbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbSgkZWxlbSk7XG4gICAgICB2YXIgdmFsT2JqID0gaW5zdGFuY2UuR2V0VmFsdWUoJGVsZW0sIHt9KTtcbiAgICAgIHZhciB2YWx1ZSA9IHZhbE9iai52YWx1ZTtcblxuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBvcGVyYXRvcjogJGVsZW0uYXR0cihcImNvbHVtbm9wZXJhdG9yXCIpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICB0YWJsZU5hbWU6ICRlbGVtLmF0dHIoXCJjb2x1bW50YWJsZW5hbWVcIiksXG4gICAgICAgICAgZmllbGROYW1lOiAkZWxlbS5hdHRyKFwiY29sdW1ubmFtZVwiKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBHZXRTdGF0dXM6IGZ1bmN0aW9uIEdldFN0YXR1cygpIHtcbiAgICB2YXIgc3RhdHVzID0gdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtLmF0dHIoXCJzdGF0dXNcIik7XG5cbiAgICBpZiAoc3RhdHVzID09IFwiXCIpIHtcbiAgICAgIHN0YXR1cyA9IFwiZW5hYmxlXCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfSxcbiAgSGlkZTogZnVuY3Rpb24gSGlkZSgpIHtcbiAgICB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0uaGlkZSgpO1xuICB9LFxuICBIaWRlQ29tcGxleEJ1dHRvbjogZnVuY3Rpb24gSGlkZUNvbXBsZXhCdXR0b24oKSB7XG4gICAgdGhpcy5fJFNob3dDb21wbGV4U2VhcmNoQnV0dG9uLnJlbW92ZSgpO1xuXG4gICAgdGhpcy5fJFNpbXBsZVNlYXJjaEJ1dHRvbi5wYXJlbnQoKS53aWR0aChcIjgwcHhcIik7XG5cbiAgICB2YXIgcGFnZVdpZHRoID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKTtcblxuICAgIHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGU6Zmlyc3RcIikud2lkdGgocGFnZVdpZHRoIC0gMTIwKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RUYWJsZUNoZWNrQm94ID0ge1xuICBSZW5kZXJlckNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckNoYWluLFxuICBSZW5kZXJlckRhdGFDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJEYXRhQ2hhaW4oX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMpIHtcbiAgICB2YXIgdmFsdWUgPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy52YWw7XG4gICAgdmFyICR0ZCA9IF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLiR0ZDtcbiAgICAkdGQuY3NzKFwidGV4dEFsaWduXCIsIFwiY2VudGVyXCIpO1xuICAgIHZhciAkY2hlY2tib3ggPSAkKFwiPGlucHV0IGlzcm93X2NoZWNrYm94PVxcXCJ0cnVlXFxcIiB0eXBlPVxcXCJjaGVja2JveFxcXCIgY2xhc3M9XFxcImxpc3QtY2hlY2tib3gtY1xcXCIgdmFsdWU9XFxcIlwiICsgdmFsdWUgKyBcIlxcXCIgcm93X2NoZWNrYm94X3JlY29yZF9pZD1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIj5cIik7XG4gICAgJGNoZWNrYm94LmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBcInNlbGZJbnN0YW5jZVwiOiB0aGlzLFxuICAgICAgXCIkZWxlbVwiOiAkY2hlY2tib3hcbiAgICB9LCB0aGlzLkNsaWNrRXZlbnQpO1xuICAgICR0ZC5odG1sKFwiXCIpO1xuICAgICR0ZC5hcHBlbmQoJGNoZWNrYm94KTtcbiAgfSxcbiAgQ2xpY2tFdmVudDogZnVuY3Rpb24gQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICB2YXIgJGVsZW0gPSBzZW5kZXIuZGF0YS4kZWxlbTtcblxuICAgIHZhciBsaXN0VGFibGVDb250YWluZXJJbnN0YW5jZSA9IFdMRENUX0xpc3RUYWJsZUNvbnRhaW5lci5fX0lubmVyRWxlbUdldEluc3RhbmNlKCRlbGVtKTtcblxuICAgIGlmICgkZWxlbS5wcm9wKFwiY2hlY2tlZFwiKSkge1xuICAgICAgbGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UuU2F2ZUNoZWNrZWRSb3dEYXRhKCRlbGVtLnZhbCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UuRGVsZXRlQ2hlY2tlZFJvd0RhdGEoJGVsZW0udmFsKCkpO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RUYWJsZUNvbnRhaW5lciA9IHtcbiAgR2V0SFRNTDogZnVuY3Rpb24gR2V0SFRNTCgpIHtcbiAgICByZXR1cm4gXCI8dGFibGUgaWQ9XFxcImV4YW1wbGVcXFwiIGNsYXNzPVxcXCJzdHJpcGUgcm93LWJvcmRlciBvcmRlci1jb2x1bW5cXFwiIHN0eWxlPVxcXCJ3aWR0aDoxMDAlXFxcIj5cXG5cIiArIFwiICAgICAgICA8dGhlYWQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aCBjb2xzcGFuPScyJz5GaXJzdCBuYW1lPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5Qb3NpdGlvbjwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+T2ZmaWNlPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aCBjb2xzcGFuPScyJz5BZ2U8L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPlNhbGFyeTwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+RXh0bi48L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPkUtbWFpbDwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5GaXJzdCBuYW1lPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5MYXN0IG5hbWU8L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPlBvc2l0aW9uPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5PZmZpY2U8L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPkFnZTwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+U3RhcnQgZGF0ZTwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+U2FsYXJ5PC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5FeHRuLjwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+RS1tYWlsPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICA8L3RoZWFkPlxcblwiICsgXCIgICAgICAgIDx0Ym9keT5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjxhIG9uY2xpY2s9J2FsZXJ0KDEpJz5UaWdlcjwvYT48L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPk5peG9uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TeXN0ZW0gQXJjaGl0ZWN0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5FZGluYnVyZ2g8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjYxPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDExLzA0LzI1PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMzIwLDgwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NTQyMTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+dC5uaXhvbkBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5HYXJyZXR0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5XaW50ZXJzPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5BY2NvdW50YW50PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Ub2t5bzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NjM8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTEvMDcvMjU8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQxNzAsNzUwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD44NDIyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5nLndpbnRlcnNAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+QXNodG9uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Db3g8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkp1bmlvciBUZWNobmljYWwgQXV0aG9yPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TYW4gRnJhbmNpc2NvPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD42NjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAwOS8wMS8xMjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDg2LDAwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MTU2MjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+YS5jb3hAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Q2VkcmljPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5LZWxseTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2VuaW9yIEphdmFzY3JpcHQgRGV2ZWxvcGVyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5FZGluYnVyZ2g8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDEyLzAzLzI5PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kNDMzLDA2MDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NjIyNDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Yy5rZWxseUBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5BaXJpPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TYXRvdTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+QWNjb3VudGFudDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+VG9reW88L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjMzPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDA4LzExLzI4PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMTYyLDcwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NTQwNzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+YS5zYXRvdUBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5CcmllbGxlPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5XaWxsaWFtc29uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5JbnRlZ3JhdGlvbiBTcGVjaWFsaXN0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5OZXcgWW9yazwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NjE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTIvMTIvMDI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQzNzIsMDAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD40ODA0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5iLndpbGxpYW1zb25AZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+SGVycm9kPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5DaGFuZGxlcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2FsZXMgQXNzaXN0YW50PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TYW4gRnJhbmNpc2NvPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD41OTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMi8wOC8wNjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDEzNyw1MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjk2MDg8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmguY2hhbmRsZXJAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+UmhvbmE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkRhdmlkc29uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5JbnRlZ3JhdGlvbiBTcGVjaWFsaXN0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Ub2t5bzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NTU8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTAvMTAvMTQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQzMjcsOTAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD42MjAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5yLmRhdmlkc29uQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkNvbGxlZW48L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkh1cnN0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5KYXZhc2NyaXB0IERldmVsb3BlcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2FuIEZyYW5jaXNjbzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Mzk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMDkvMDkvMTU8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQyMDUsNTAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMzYwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5jLmh1cnN0QGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNvbnlhPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Gcm9zdDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U29mdHdhcmUgRW5naW5lZXI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkVkaW5idXJnaDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjM8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMDgvMTIvMTM8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQxMDMsNjAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4xNjY3PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5zLmZyb3N0QGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkplbmE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkdhaW5lczwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+T2ZmaWNlIE1hbmFnZXI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkxvbmRvbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MzA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMDgvMTIvMTk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQ5MCw1NjA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjM4MTQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmouZ2FpbmVzQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlF1aW5uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5GbHlubjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U3VwcG9ydCBMZWFkPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5FZGluYnVyZ2g8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDEzLzAzLzAzPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMzQyLDAwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+OTQ5NzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+cS5mbHlubkBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5DaGFyZGU8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPk1hcnNoYWxsPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5SZWdpb25hbCBEaXJlY3RvcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2FuIEZyYW5jaXNjbzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MzY8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMDgvMTAvMTY8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQ0NzAsNjAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD42NzQxPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5jLm1hcnNoYWxsQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkhhbGV5PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5LZW5uZWR5PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TZW5pb3IgTWFya2V0aW5nIERlc2lnbmVyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Mb25kb248L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjQzPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDEyLzEyLzE4PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMzEzLDUwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MzU5NzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+aC5rZW5uZWR5QGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlRhdHlhbmE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkZpdHpwYXRyaWNrPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5SZWdpb25hbCBEaXJlY3RvcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TG9uZG9uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4xOTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMC8wMy8xNzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDM4NSw3NTA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjE5NjU8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPnQuZml0enBhdHJpY2tAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TWljaGFlbDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2lsdmE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPk1hcmtldGluZyBEZXNpZ25lcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TG9uZG9uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD42NjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMi8xMS8yNzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDE5OCw1MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjE1ODE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPm0uc2lsdmFAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Q2hhcmRlPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5NYXJzaGFsbDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+UmVnaW9uYWwgRGlyZWN0b3I8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNhbiBGcmFuY2lzY288L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjM2PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDA4LzEwLzE2PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kNDcwLDYwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Njc0MTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Yy5tYXJzaGFsbEBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5IYWxleTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+S2VubmVkeTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2VuaW9yIE1hcmtldGluZyBEZXNpZ25lcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TG9uZG9uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD40MzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMi8xMi8xODwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDMxMyw1MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjM1OTc8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmgua2VubmVkeUBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5UYXR5YW5hPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5GaXR6cGF0cmljazwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+UmVnaW9uYWwgRGlyZWN0b3I8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkxvbmRvbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MTk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTAvMDMvMTc8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQzODUsNzUwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4xOTY1PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD50LmZpdHpwYXRyaWNrQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPk1pY2hhZWw8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNpbHZhPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5NYXJrZXRpbmcgRGVzaWduZXI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkxvbmRvbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NjY8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTIvMTEvMjc8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQxOTgsNTAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4xNTgxPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5tLnNpbHZhQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICA8L3Rib2R5PlxcblwiICsgXCIgICAgPC90YWJsZT5cIjtcbiAgfSxcbiAgX0luc3RhbmNlTWFwOiB7fSxcbiAgX0N1cnJlbnRQYWdlTnVtOiAxLFxuICBfRGF0YVNldDogbnVsbCxcbiAgX0RhdGFTZXRSdW50aW1lSW5zdGFuY2U6IG51bGwsXG4gIF9DYWNoZSRTaW5nbGVDb250cm9sRWxlbTogbnVsbCxcbiAgX0NhY2hlUmVuZGVyZXJEYXRhQ2hhaW5QYXJhczogbnVsbCxcbiAgX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlOiBudWxsLFxuICBfQ29tcGxleFNlYXJjaENvbnRhaW5lckluc3RhbmNlOiBudWxsLFxuICBfUXVlcnlQT0xpc3Q6IFtdLFxuICBfQ2hlY2tlZFJlY29yZEFycmF5OiBbXSxcbiAgXyRFbGVtOiBudWxsLFxuICBHZXRJbnN0YW5jZTogZnVuY3Rpb24gR2V0SW5zdGFuY2UobmFtZSkge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9JbnN0YW5jZU1hcCkge1xuICAgICAgaWYgKGtleSA9PSBuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9JbnN0YW5jZU1hcFtrZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBpbnN0YW5jZSA9IGV2YWwobmFtZSk7XG4gICAgdGhpcy5fSW5zdGFuY2VNYXBbbmFtZV0gPSBpbnN0YW5jZTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0sXG4gIEluaXRpYWxpemU6IGZ1bmN0aW9uIEluaXRpYWxpemUoKSB7XG4gICAgdGhpcy5fRGF0YVNldFJ1bnRpbWVJbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoRGF0YVNldFJ1bnRpbWUpO1xuICB9LFxuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKF9yZW5kZXJlckNoYWluUGFyYXMpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gX3JlbmRlcmVyQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdGhpcy5fJEVsZW0gPSAkc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdmFyICRzaW1wbGVTZWFyY2hDb250YWluZXJFbGVtID0gJHNpbmdsZUNvbnRyb2xFbGVtLnByZXZBbGwoXCJbY2xpZW50X3Jlc29sdmU9J1dMRENUX0xpc3RTaW1wbGVTZWFyY2hDb250YWluZXInXVwiKTtcbiAgICB2YXIgJGNvbXBsZXhTZWFyY2hDb250YWluZXJFbGVtID0gJHNpbmdsZUNvbnRyb2xFbGVtLnByZXZBbGwoXCJbY2xpZW50X3Jlc29sdmU9J1dMRENUX0xpc3RDb21wbGV4U2VhcmNoQ29udGFpbmVyJ11cIik7XG4gICAgdGhpcy5fU2ltcGxlU2VhcmNoQ29udGFpbmVySW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sSW5zdGFuY2VCeUVsZW0oJHNpbXBsZVNlYXJjaENvbnRhaW5lckVsZW0pO1xuICAgIHRoaXMuX0NvbXBsZXhTZWFyY2hDb250YWluZXJJbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbSgkY29tcGxleFNlYXJjaENvbnRhaW5lckVsZW0pO1xuICAgIEhUTUxDb250cm9sLlNhdmVDb250cm9sTmV3SW5zdGFuY2VUb1Bvb2woJHNpbmdsZUNvbnRyb2xFbGVtLCB0aGlzKTtcblxuICAgIHRoaXMuX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlLl8kU2ltcGxlU2VhcmNoQnV0dG9uLmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBcImxpc3RJbnN0YW5jZVwiOiB0aGlzXG4gICAgfSwgdGhpcy5TaW1wbGVTZWFyY2hDbGlja0V2ZW50KTtcblxuICAgIHRoaXMuX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlLl8kU2hvd0NvbXBsZXhTZWFyY2hCdXR0b24uYmluZChcImNsaWNrXCIsIHtcbiAgICAgIFwibGlzdEluc3RhbmNlXCI6IHRoaXNcbiAgICB9LCB0aGlzLlNob3dDb21wbGV4U2VhcmNoQ2xpY2tFdmVudCk7XG5cbiAgICB0aGlzLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UuXyRDb21wbGV4U2VhcmNoQnV0dG9uLmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBcImxpc3RJbnN0YW5jZVwiOiB0aGlzXG4gICAgfSwgdGhpcy5Db21wbGV4U2VhcmNoQ2xpY2tFdmVudCk7XG5cbiAgICB0aGlzLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UuXyRDbGVhckJ1dHRvbi5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgXCJsaXN0SW5zdGFuY2VcIjogdGhpc1xuICAgIH0sIHRoaXMuQ29tcGxleFNlYXJjaENsZWFyQ2xpY2tFdmVudCk7XG5cbiAgICB0aGlzLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UuXyRDbG9zZUJ1dHRvbi5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgXCJsaXN0SW5zdGFuY2VcIjogdGhpc1xuICAgIH0sIHRoaXMuQ29tcGxleFNlYXJjaENsb3NlQ2xpY2tFdmVudCk7XG5cbiAgICBpZiAodGhpcy5fU2ltcGxlU2VhcmNoQ29udGFpbmVySW5zdGFuY2UuR2V0U3RhdHVzKCkgPT0gXCJkaXNhYmxlXCIpIHtcbiAgICAgIHRoaXMuX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlLkhpZGUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fQ29tcGxleFNlYXJjaENvbnRhaW5lckluc3RhbmNlLkdldFN0YXR1cygpID09IFwiZGlzYWJsZVwiKSB7XG4gICAgICB0aGlzLl9TaW1wbGVTZWFyY2hDb250YWluZXJJbnN0YW5jZS5IaWRlQ29tcGxleEJ1dHRvbigpO1xuICAgIH1cblxuICAgIHZhciAkdGVtcGxhdGVUYWJsZSA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGVcIik7XG4gICAgdmFyICR0ZW1wbGF0ZVRhYmxlUm93ID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZSB0Ym9keSB0clwiKTtcbiAgICB2YXIgJHRlbXBsYXRlVGFibGVIZWFkZXJSb3dzID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZSB0aGVhZCB0clwiKTtcbiAgICB0aGlzLkFwcGVuZENoZWNrQm94Q29sdW1uVGVtcGxhdGUoJHRlbXBsYXRlVGFibGUsICR0ZW1wbGF0ZVRhYmxlSGVhZGVyUm93cywgJHRlbXBsYXRlVGFibGVSb3cpO1xuICAgIEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcyk7XG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbihfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcywgaXNSZVJlbmRlcmVyKSB7XG4gICAgdmFyIHVzZWRUb3BEYXRhU2V0ID0gdHJ1ZTtcbiAgICB2YXIgZGF0YVNldElkO1xuICAgIHZhciBwYWdlU2l6ZTtcblxuICAgIGlmICh1c2VkVG9wRGF0YVNldCkge1xuICAgICAgZGF0YVNldElkID0gX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMudG9wRGF0YVNldElkO1xuICAgICAgcGFnZVNpemUgPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy5saXN0RW50aXR5Lmxpc3REYXRhc2V0UGFnZVNpemU7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9DYWNoZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMpIHtcbiAgICAgIHRoaXMuX0NhY2hlUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcyA9IF9yZW5kZXJlckRhdGFDaGFpblBhcmFzO1xuICAgICAgdGhpcy5fQ2FjaGUkU2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW0uY2xvbmUoKTtcbiAgICB9XG5cbiAgICBpZiAoaXNSZVJlbmRlcmVyKSB7XG4gICAgICBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW0uaHRtbCh0aGlzLl9DYWNoZSRTaW5nbGVDb250cm9sRWxlbS5odG1sKCkpO1xuICAgIH1cblxuICAgIGlmIChfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy5saXN0UnVudGltZUluc3RhbmNlLklzUHJldmlldygpKSB7XG4gICAgICB2YXIgbW9ja0RhdGFTZXQgPSB7XG4gICAgICAgIFwidG90YWxcIjogMTAwMCxcbiAgICAgICAgXCJsaXN0XCI6IFtdLFxuICAgICAgICBcInBhZ2VOdW1cIjogMSxcbiAgICAgICAgXCJwYWdlU2l6ZVwiOiA1LFxuICAgICAgICBcInNpemVcIjogNSxcbiAgICAgICAgXCJzdGFydFJvd1wiOiAxLFxuICAgICAgICBcImVuZFJvd1wiOiA1LFxuICAgICAgICBcInBhZ2VzXCI6IDIwMCxcbiAgICAgICAgXCJwcmVQYWdlXCI6IDAsXG4gICAgICAgIFwibmV4dFBhZ2VcIjogMixcbiAgICAgICAgXCJpc0ZpcnN0UGFnZVwiOiB0cnVlLFxuICAgICAgICBcImlzTGFzdFBhZ2VcIjogZmFsc2UsXG4gICAgICAgIFwiaGFzUHJldmlvdXNQYWdlXCI6IGZhbHNlLFxuICAgICAgICBcImhhc05leHRQYWdlXCI6IHRydWUsXG4gICAgICAgIFwibmF2aWdhdGVQYWdlc1wiOiA4LFxuICAgICAgICBcIm5hdmlnYXRlcGFnZU51bXNcIjogWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdLFxuICAgICAgICBcIm5hdmlnYXRlRmlyc3RQYWdlXCI6IDEsXG4gICAgICAgIFwibmF2aWdhdGVMYXN0UGFnZVwiOiA4LFxuICAgICAgICBcImZpcnN0UGFnZVwiOiAxLFxuICAgICAgICBcImxhc3RQYWdlXCI6IDhcbiAgICAgIH07XG4gICAgICB0aGlzLl9EYXRhU2V0ID0gbW9ja0RhdGFTZXQ7XG4gICAgICB0aGlzLkNyZWF0ZVRhYmxlKF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbSwgbW9ja0RhdGFTZXQsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0TG9hZGluZyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkLCB7XG4gICAgICAgIHRpdGxlOiBcIuezu+e7n+aPkOekulwiLFxuICAgICAgICBoaWRlOiB7XG4gICAgICAgICAgZWZmZWN0OiBcImZhZGVcIixcbiAgICAgICAgICBkdXJhdGlvbjogNTAwXG4gICAgICAgIH1cbiAgICAgIH0sIFwi5pWw5o2u5Yqg6L295LitLOivt+eojeWAmS4uLi5cIik7XG5cbiAgICAgIHRoaXMuX0RhdGFTZXRSdW50aW1lSW5zdGFuY2UuR2V0RGF0YVNldERhdGEoe1xuICAgICAgICBkYXRhU2V0SWQ6IGRhdGFTZXRJZCxcbiAgICAgICAgcGFnZVNpemU6IHBhZ2VTaXplLFxuICAgICAgICBwYWdlTnVtOiB0aGlzLl9DdXJyZW50UGFnZU51bSxcbiAgICAgICAgbGlzdFF1ZXJ5UE9MaXN0OiB0aGlzLl9RdWVyeVBPTGlzdCxcbiAgICAgICAgZXhWYWx1ZTE6IFwiXCIsXG4gICAgICAgIGV4VmFsdWUyOiBcIlwiLFxuICAgICAgICBleFZhbHVlMzogXCJcIlxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy5kYXRhU2V0ID0gcmVzdWx0LmRhdGE7XG4gICAgICAgIHRoaXMuX0RhdGFTZXQgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgdGhpcy5DcmVhdGVUYWJsZShfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW0sIHRoaXMuX0RhdGFTZXQsIGZhbHNlKTtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQpO1xuICAgICAgICB9LCA1MDApO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9LFxuICBDcmVhdGVUYWJsZTogZnVuY3Rpb24gQ3JlYXRlVGFibGUoJHNpbmdsZUNvbnRyb2xFbGVtLCBkYXRhU2V0LCBpc1ByZXZpZXcpIHtcbiAgICB2YXIgJHRlbXBsYXRlVGFibGUgPSAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcInRhYmxlXCIpO1xuICAgIHZhciAkdGVtcGxhdGVUYWJsZVJvdyA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGUgdGJvZHkgdHJcIik7XG4gICAgdmFyICR0ZW1wbGF0ZVRhYmxlSGVhZGVyUm93cyA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGUgdGhlYWQgdHJcIik7XG5cbiAgICBpZiAoJHRlbXBsYXRlVGFibGVSb3cubGVuZ3RoID4gMCkge1xuICAgICAgdmFyICR0ZW1wbGF0ZVRhYmxlQm9keSA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGUgdGJvZHlcIik7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YVNldC5saXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICR0ZW1wbGF0ZVRhYmxlQm9keS5hcHBlbmQodGhpcy5SZW5kZXJlclNpbmdsZVJvdygkdGVtcGxhdGVUYWJsZSwgJHRlbXBsYXRlVGFibGVSb3csIGRhdGFTZXQsIGRhdGFTZXQubGlzdFtpXSkpO1xuICAgICAgfVxuXG4gICAgICAkdGVtcGxhdGVUYWJsZVJvdy5yZW1vdmUoKTtcblxuICAgICAgaWYgKGlzUHJldmlldykge1xuICAgICAgICAkdGVtcGxhdGVUYWJsZS5maW5kKFwiW3NpbmdsZW5hbWU9J1dMRENUX0xpc3RUYWJsZUlubmVyQnV0dG9uQ29udGFpbmVyJ11cIikucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCIud2xkY3QtbGlzdC10YWJsZS1pbm5lci13cmFwXCIpLmFwcGVuZCh0aGlzLkNyZWF0ZVBhZ2luZygpKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcIi53bGRjdC1saXN0LXRhYmxlLWlubmVyLXdyYXBcIikud2lkdGgoUGFnZVN0eWxlVXRpbGl0eS5HZXRXaW5kb3dXaWR0aCgpIC0gMjApO1xuICAgICR0ZW1wbGF0ZVRhYmxlLmFkZENsYXNzKFwic3RyaXBlIHJvdy1ib3JkZXIgb3JkZXItY29sdW1uXCIpO1xuICAgICR0ZW1wbGF0ZVRhYmxlLndpZHRoKFwiMTAwJVwiKTtcbiAgICB2YXIgc2Nyb2xsWSA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0V2luZG93SGVpZ2h0KCkgLSAkKFwiLndsZGN0LWxpc3Qtc2ltcGxlLXNlYXJjaC1vdXRlci13cmFwXCIpLmhlaWdodCgpIC0gJChcIi53bGRjdC1saXN0LWJ1dHRvbi1vdXRlci13cmFwXCIpLmhlaWdodCgpIC0gMTYwO1xuICAgIHZhciB0YWJsZSA9ICR0ZW1wbGF0ZVRhYmxlLkRhdGFUYWJsZSh7XG4gICAgICBzY3JvbGxZOiBzY3JvbGxZLFxuICAgICAgc2Nyb2xsWDogdHJ1ZSxcbiAgICAgIHBhZ2luZzogZmFsc2UsXG4gICAgICBcIm9yZGVyaW5nXCI6IGZhbHNlLFxuICAgICAgXCJzZWFyY2hpbmdcIjogZmFsc2UsXG4gICAgICBcImluZm9cIjogZmFsc2VcbiAgICB9KTtcbiAgfSxcbiAgQXBwZW5kQ2hlY2tCb3hDb2x1bW5UZW1wbGF0ZTogZnVuY3Rpb24gQXBwZW5kQ2hlY2tCb3hDb2x1bW5UZW1wbGF0ZSgkdGVtcGxhdGVUYWJsZSwgJHRlbXBsYXRlVGFibGVIZWFkZXJSb3dzLCAkdGVtcGxhdGVUYWJsZVJvdykge1xuICAgIHZhciAkdGggPSAkKFwiPHRoIHN0eWxlPSd3aWR0aDogNTBweCc+6YCJ5oupPC90aD5cIik7XG5cbiAgICBpZiAoJHRlbXBsYXRlVGFibGVIZWFkZXJSb3dzLmxlbmd0aCA+IDEpIHtcbiAgICAgICR0aC5hdHRyKFwicm93c3BhblwiLCAkdGVtcGxhdGVUYWJsZUhlYWRlclJvd3MubGVuZ3RoKTtcbiAgICB9XG5cbiAgICAkKCR0ZW1wbGF0ZVRhYmxlSGVhZGVyUm93c1swXSkucHJlcGVuZCgkdGgpO1xuICAgICQoJHRlbXBsYXRlVGFibGVSb3cuZXEoMCkpLnByZXBlbmQoXCI8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5hbGlnbj1cXFwiXFx1NUM0NVxcdTRFMkRcXHU1QkY5XFx1OUY1MFxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uY2FwdGlvbj1cXFwiSURcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbmRhdGF0eXBlbmFtZT1cXFwiXFx1NUI1N1xcdTdCMjZcXHU0RTMyXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5uYW1lPVxcXCJJRFxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1udGFibGVuYW1lPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xfY2F0ZWdvcnk9XFxcIklucHV0Q29udHJvbFxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdGNsaWVudHJlbmRlcmVybWV0aG9kPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RjbGllbnRyZW5kZXJlcm1ldGhvZHBhcmE9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdHNlcnZlcnJlc29sdmVtZXRob2Q9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdHNlcnZlcnJlc29sdmVtZXRob2RwYXJhPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHR0ZXh0PVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHR0eXBlPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHR2YWx1ZT1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVxcXCJjaGVja19ib3hfdGVtcGxhdGVcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzX2pidWlsZDRkY19kYXRhPVxcXCJ0cnVlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqYnVpbGQ0ZGNfY3VzdG9tPVxcXCJ0cnVlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPVxcXCJjaGVja19ib3hfdGVtcGxhdGVcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmlhbGl6ZT1cXFwidHJ1ZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd19yZW1vdmVfYnV0dG9uPVxcXCJ0cnVlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW5nbGVuYW1lPVxcXCJXTERDVF9MaXN0VGFibGVDaGVja0JveFxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0YnV0dG9uaWQ9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50X3Jlc29sdmU9XFxcIldMRENUX0xpc3RUYWJsZUNoZWNrQm94XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSURcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cIik7XG4gIH0sXG4gIFJlbmRlcmVyU2luZ2xlUm93OiBmdW5jdGlvbiBSZW5kZXJlclNpbmdsZVJvdygkdGVtcGxhdGVUYWJsZSwgJHRlbXBsYXRlVGFibGVSb3csIGRhdGFTZXQsIHJvd0RhdGEpIHtcbiAgICB2YXIgJGNsb25lUm93ID0gJHRlbXBsYXRlVGFibGVSb3cuY2xvbmUoKTtcbiAgICB2YXIgJHRkcyA9ICRjbG9uZVJvdy5maW5kKFwidGRcIik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8ICR0ZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciAkdGQgPSAkKCR0ZHNbaV0pO1xuICAgICAgdmFyICRkaXZDVEVsZW0gPSAkdGQuZmluZChcImRpdlwiICsgSFRNTENvbnRyb2xBdHRycy5TRUxFQ1RFRF9KQlVJTEQ0RENfQ1VTVE9NKTtcblxuICAgICAgaWYgKCRkaXZDVEVsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgYmluZFRvRmllbGQgPSAkZGl2Q1RFbGVtLmF0dHIoXCJjb2x1bW5uYW1lXCIpO1xuICAgICAgICB2YXIgdmFsID0gcm93RGF0YVtiaW5kVG9GaWVsZF07XG4gICAgICAgIHZhciBjbGllbnRSZXNvbHZlSW5zdGFuY2VOYW1lID0gJGRpdkNURWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuQ0xJRU5UX1JFU09MVkUpO1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBXTERDVF9MaXN0VGFibGVDb250YWluZXIuR2V0SW5zdGFuY2UoY2xpZW50UmVzb2x2ZUluc3RhbmNlTmFtZSk7XG4gICAgICAgIGluc3RhbmNlLlJlbmRlcmVyRGF0YUNoYWluKHtcbiAgICAgICAgICAkdGVtcGxhdGVUYWJsZTogJHRlbXBsYXRlVGFibGUsXG4gICAgICAgICAgJHRlbXBsYXRlVGFibGVSb3c6ICR0ZW1wbGF0ZVRhYmxlUm93LFxuICAgICAgICAgICRzaW5nbGVDb250cm9sRWxlbTogJGRpdkNURWxlbSxcbiAgICAgICAgICBkYXRhU2V0OiBkYXRhU2V0LFxuICAgICAgICAgIHJvd0RhdGE6IHJvd0RhdGEsXG4gICAgICAgICAgJGNsb25lUm93OiAkY2xvbmVSb3csXG4gICAgICAgICAgJHRkOiAkdGQsXG4gICAgICAgICAgdmFsOiB2YWxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICRjbG9uZVJvdztcbiAgfSxcbiAgQ3JlYXRlUGFnaW5nOiBmdW5jdGlvbiBDcmVhdGVQYWdpbmcoJHRlbXBsYXRlVGFibGUsICR0ZW1wbGF0ZVRhYmxlUm93LCBkYXRhU2V0LCByb3dEYXRhLCAkcm93LCAkdGQsIHZhbHVlKSB7XG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHZhciBwYWdpbmdPdXRlckVsZW0gPSAkKFwiPGRpdiBjbGFzcz0ndGFibGUtcGFnaW5nLW91dGVyJz48ZGl2IGNsYXNzPSd0YWJsZS1wYWdpbmctaW5uZXInPjwvZGl2PjwvZGl2PlwiKTtcbiAgICB2YXIgcGFnaW5nSW5uZXJFbGVtID0gcGFnaW5nT3V0ZXJFbGVtLmZpbmQoXCJkaXZcIik7XG4gICAgdmFyIGZpcnN0UGFnZSA9ICQoXCI8ZGl2IGNsYXNzPSd0YWJsZS1wYWdpbmctYnV0dG9uJz7nrKzkuIDpobU8L2Rpdj5cIik7XG4gICAgZmlyc3RQYWdlLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIF9zZWxmLkNoYW5nZVBhZ2VOdW0oMSk7XG4gICAgfSk7XG4gICAgdmFyIHByZVBhZ2UgPSAkKFwiPGRpdiBjbGFzcz0ndGFibGUtcGFnaW5nLWJ1dHRvbic+5LiK5LiA6aG1PC9kaXY+XCIpO1xuICAgIHByZVBhZ2UuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKF9zZWxmLl9DdXJyZW50UGFnZU51bSA+IDEpIHtcbiAgICAgICAgX3NlbGYuQ2hhbmdlUGFnZU51bShfc2VsZi5fQ3VycmVudFBhZ2VOdW0gLSAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5bey57uP5Yiw6L6+56ys5LiA6aG1IVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgbGFzdFBhZ2UgPSAkKFwiPGRpdiBjbGFzcz0ndGFibGUtcGFnaW5nLWJ1dHRvbic+5pyr6aG1PC9kaXY+XCIpO1xuICAgIGxhc3RQYWdlLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIF9zZWxmLkNoYW5nZVBhZ2VOdW0oX3NlbGYuX0RhdGFTZXQucGFnZXMpO1xuICAgIH0pO1xuICAgIHZhciBuZXh0UGFnZSA9ICQoXCI8ZGl2IGNsYXNzPSd0YWJsZS1wYWdpbmctYnV0dG9uJz7kuIvkuIDpobU8L2Rpdj5cIik7XG4gICAgbmV4dFBhZ2UuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKF9zZWxmLl9DdXJyZW50UGFnZU51bSA8IF9zZWxmLl9EYXRhU2V0LnBhZ2VzKSB7XG4gICAgICAgIF9zZWxmLkNoYW5nZVBhZ2VOdW0oX3NlbGYuX0N1cnJlbnRQYWdlTnVtICsgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuW3sue7j+WIsOi+vuacgOacq+mhtSFcIik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGluZm8gPSAkKFwiPGRpdiBjbGFzcz0ndGFibGUtcGFnaW5nLWluZm8nPuaAu+adoeaVsOOAkFwiICsgX3NlbGYuX0RhdGFTZXQudG90YWwgKyBcIuOAkSZuYnNwOyZuYnNwO+mhteaVsOOAkFwiICsgX3NlbGYuX0N1cnJlbnRQYWdlTnVtICsgXCIvXCIgKyBfc2VsZi5fRGF0YVNldC5wYWdlcyArIFwi44CRPC9kaXY+XCIpO1xuICAgIHBhZ2luZ0lubmVyRWxlbS5hcHBlbmQoZmlyc3RQYWdlKS5hcHBlbmQocHJlUGFnZSkuYXBwZW5kKG5leHRQYWdlKS5hcHBlbmQobGFzdFBhZ2UpLmFwcGVuZChpbmZvKTtcbiAgICByZXR1cm4gcGFnaW5nT3V0ZXJFbGVtO1xuICB9LFxuICBDaGFuZ2VQYWdlTnVtOiBmdW5jdGlvbiBDaGFuZ2VQYWdlTnVtKHBhZ2VOdW0pIHtcbiAgICB0aGlzLl9DdXJyZW50UGFnZU51bSA9IHBhZ2VOdW07XG4gICAgdGhpcy5SZW5kZXJlckRhdGFDaGFpbih0aGlzLl9DYWNoZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMsIHRydWUpO1xuICB9LFxuICBTaW1wbGVTZWFyY2hDbGlja0V2ZW50OiBmdW5jdGlvbiBTaW1wbGVTZWFyY2hDbGlja0V2ZW50KHNlbmRlcikge1xuICAgIHZhciBfc2VsZiA9IHNlbmRlci5kYXRhLmxpc3RJbnN0YW5jZTtcblxuICAgIHZhciBjb25kaXRpb25zID0gX3NlbGYuX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlLkJ1aWxkZXJTZWFyY2hDb25kaXRpb24oKTtcblxuICAgIF9zZWxmLl9RdWVyeVBPTGlzdCA9IGNvbmRpdGlvbnM7XG5cbiAgICBfc2VsZi5SZW5kZXJlckRhdGFDaGFpbihfc2VsZi5fQ2FjaGVSZW5kZXJlckRhdGFDaGFpblBhcmFzLCB0cnVlKTtcbiAgfSxcbiAgU2hvd0NvbXBsZXhTZWFyY2hDbGlja0V2ZW50OiBmdW5jdGlvbiBTaG93Q29tcGxleFNlYXJjaENsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgdmFyIF9zZWxmID0gc2VuZGVyLmRhdGEubGlzdEluc3RhbmNlO1xuICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihfc2VsZi5fQ29tcGxleFNlYXJjaENvbnRhaW5lckluc3RhbmNlLl8kU2luZ2xlQ29udHJvbEVsZW0sIHtcbiAgICAgIHRpdGxlOiBcIumrmOe6p+afpeivolwiLFxuICAgICAgaGVpZ2h0OiA0MTAsXG4gICAgICB3aWR0aDogODAwLFxuICAgICAgbW9kYWw6IHRydWVcbiAgICB9KTtcbiAgfSxcbiAgQ29tcGxleFNlYXJjaENsaWNrRXZlbnQ6IGZ1bmN0aW9uIENvbXBsZXhTZWFyY2hDbGlja0V2ZW50KHNlbmRlcikge1xuICAgIGNvbnNvbGUubG9nKFwi6auY57qn5p+l6K+iLlwiKTtcbiAgICB2YXIgX3NlbGYgPSBzZW5kZXIuZGF0YS5saXN0SW5zdGFuY2U7XG5cbiAgICB2YXIgc2ltcGxlQ29uZGl0aW9ucyA9IF9zZWxmLl9TaW1wbGVTZWFyY2hDb250YWluZXJJbnN0YW5jZS5CdWlsZGVyU2VhcmNoQ29uZGl0aW9uKCk7XG5cbiAgICB2YXIgY29tcGxleENvbmRpdGlvbnMgPSBfc2VsZi5fQ29tcGxleFNlYXJjaENvbnRhaW5lckluc3RhbmNlLkJ1aWxkZXJTZWFyY2hDb25kaXRpb24oKTtcblxuICAgIF9zZWxmLl9RdWVyeVBPTGlzdCA9IGNvbXBsZXhDb25kaXRpb25zLmNvbmNhdChzaW1wbGVDb25kaXRpb25zKTtcblxuICAgIF9zZWxmLlJlbmRlcmVyRGF0YUNoYWluKF9zZWxmLl9DYWNoZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMsIHRydWUpO1xuXG4gICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0oX3NlbGYuX0NvbXBsZXhTZWFyY2hDb250YWluZXJJbnN0YW5jZS5fJFNpbmdsZUNvbnRyb2xFbGVtKTtcbiAgfSxcbiAgQ29tcGxleFNlYXJjaENsb3NlQ2xpY2tFdmVudDogZnVuY3Rpb24gQ29tcGxleFNlYXJjaENsb3NlQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICB2YXIgX3NlbGYgPSBzZW5kZXIuZGF0YS5saXN0SW5zdGFuY2U7XG4gICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0oX3NlbGYuX0NvbXBsZXhTZWFyY2hDb250YWluZXJJbnN0YW5jZS5fJFNpbmdsZUNvbnRyb2xFbGVtKTtcbiAgfSxcbiAgQ29tcGxleFNlYXJjaENsZWFyQ2xpY2tFdmVudDogZnVuY3Rpb24gQ29tcGxleFNlYXJjaENsZWFyQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICB2YXIgX3NlbGYgPSBzZW5kZXIuZGF0YS5saXN0SW5zdGFuY2U7XG4gICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLmnKrlrp7njrAhXCIpO1xuICB9LFxuICBHZXRSZWNvcmREYXRhOiBmdW5jdGlvbiBHZXRSZWNvcmREYXRhKGlkKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5fRGF0YVNldCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX0RhdGFTZXQubGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJlY29yZERhdGEgPSB0aGlzLl9EYXRhU2V0Lmxpc3RbaV07XG5cbiAgICAgIGlmIChyZWNvcmREYXRhLklEID09IGlkKSB7XG4gICAgICAgIHJldHVybiByZWNvcmREYXRhO1xuICAgICAgfVxuICAgIH1cblxuICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5om+5LiN5YiwSUTkuLo6XCIgKyBpZCArIFwi55qE6K6w5b2VIVwiKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgU2F2ZUNoZWNrZWRSb3dEYXRhOiBmdW5jdGlvbiBTYXZlQ2hlY2tlZFJvd0RhdGEoaWQpIHtcbiAgICB2YXIgcmVjb3JkID0gdGhpcy5HZXRSZWNvcmREYXRhKGlkKTtcblxuICAgIGlmIChyZWNvcmQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fQ2hlY2tlZFJlY29yZEFycmF5LnB1c2goe1xuICAgICAgICBcIklkXCI6IGlkLFxuICAgICAgICBcIlJlY29yZFwiOiByZWNvcmRcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgRGVsZXRlQ2hlY2tlZFJvd0RhdGE6IGZ1bmN0aW9uIERlbGV0ZUNoZWNrZWRSb3dEYXRhKGlkKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9DaGVja2VkUmVjb3JkQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLl9DaGVja2VkUmVjb3JkQXJyYXlbaV0uSWQgPT0gaWQpIHtcbiAgICAgICAgQXJyYXlVdGlsaXR5LkRlbGV0ZSh0aGlzLl9DaGVja2VkUmVjb3JkQXJyYXksIGkpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgR2V0Q2hlY2tlZFJlY29yZDogZnVuY3Rpb24gR2V0Q2hlY2tlZFJlY29yZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fQ2hlY2tlZFJlY29yZEFycmF5O1xuICB9LFxuICBHZXRMYXN0Q2hlY2tlZFJlY29yZDogZnVuY3Rpb24gR2V0TGFzdENoZWNrZWRSZWNvcmQoKSB7XG4gICAgaWYgKHRoaXMuX0NoZWNrZWRSZWNvcmRBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5fQ2hlY2tlZFJlY29yZEFycmF5W3RoaXMuX0NoZWNrZWRSZWNvcmRBcnJheS5sZW5ndGggLSAxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgQ2xlYXJBbGxDaGVja0JveDogZnVuY3Rpb24gQ2xlYXJBbGxDaGVja0JveCgpIHtcbiAgICB0aGlzLl8kRWxlbS5maW5kKFwiOmNoZWNrYm94XCIpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG5cbiAgICB0aGlzLl9DaGVja2VkUmVjb3JkQXJyYXkgPSBbXTtcbiAgfSxcbiAgU2V0Q2hlY2tCb3hUb0NoZWNrZWRTdGF0dXM6IGZ1bmN0aW9uIFNldENoZWNrQm94VG9DaGVja2VkU3RhdHVzKGlkKSB7XG4gICAgdGhpcy5fJEVsZW0uZmluZChcIltyb3dfY2hlY2tib3hfcmVjb3JkX2lkPSdcIiArIGlkICsgXCInXTpjaGVja2JveFwiKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG5cbiAgICB0aGlzLlNhdmVDaGVja2VkUm93RGF0YShpZCk7XG4gIH0sXG4gIF9fSW5uZXJFbGVtR2V0SW5zdGFuY2U6IGZ1bmN0aW9uIF9fSW5uZXJFbGVtR2V0SW5zdGFuY2UoJGlubmVyRWxlbSkge1xuICAgIHZhciAkV0xEQ1RfTGlzdFRhYmxlQ29udGFpbmVyID0gJGlubmVyRWxlbS5wYXJlbnRzKFwiW3NpbmdsZW5hbWU9J1dMRENUX0xpc3RUYWJsZUNvbnRhaW5lciddXCIpO1xuICAgIHZhciBsaXN0VGFibGVDb250YWluZXJJbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbSgkV0xEQ1RfTGlzdFRhYmxlQ29udGFpbmVyKTtcbiAgICByZXR1cm4gbGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2U7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXTERDVF9MaXN0VGFibGVJbm5lckJ1dHRvbkNvbnRhaW5lciA9IHtcbiAgUmVuZGVyZXJDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJDaGFpbihfcmVuZGVyZXJDaGFpblBhcmFzKSB7XG4gICAgdmFyICRzaW5nbGVDb250cm9sRWxlbSA9IF9yZW5kZXJlckNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtO1xuICAgIHZhciAkZGl2Q1RFbGVtID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJkaXZcIiArIEhUTUxDb250cm9sQXR0cnMuU0VMRUNURURfSkJVSUxENERDX0NVU1RPTSk7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmh0bWwoXCJcIik7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmFwcGVuZCgkZGl2Q1RFbGVtKTtcbiAgfSxcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyRGF0YUNoYWluXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdFRhYmxlSW5uZXJCdXR0b25TaW5nbGUgPSB7XG4gIFJlbmRlcmVyQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbihfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBcInNlbGZJbnN0YW5jZVwiOiB0aGlzLFxuICAgICAgXCIkZWxlbVwiOiAkc2luZ2xlQ29udHJvbEVsZW0sXG4gICAgICByb3dEYXRhOiBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy5yb3dEYXRhXG4gICAgfSwgdGhpcy5DbGlja0V2ZW50KTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uaHRtbChcIlwiKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uYXR0cihcInRpdGxlXCIsICRzaW5nbGVDb250cm9sRWxlbS5hdHRyKFwiY2FwdGlvblwiKSk7XG4gIH0sXG4gIENsaWNrRXZlbnQ6IGZ1bmN0aW9uIENsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgY29uc29sZS5sb2coc2VuZGVyLmRhdGEucm93RGF0YS5JRCk7XG4gICAgdmFyICRlbGVtID0gc2VuZGVyLmRhdGEuJGVsZW07XG4gICAgY29uc29sZS5sb2coJGVsZW0pO1xuICAgIHZhciB0YXJnZXRidXR0b25pZCA9ICRlbGVtLmF0dHIoXCJ0YXJnZXRidXR0b25pZFwiKTtcblxuICAgIHZhciBsaXN0VGFibGVDb250YWluZXJJbnN0YW5jZSA9IFdMRENUX0xpc3RUYWJsZUNvbnRhaW5lci5fX0lubmVyRWxlbUdldEluc3RhbmNlKCRlbGVtKTtcblxuICAgIGxpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlLkNsZWFyQWxsQ2hlY2tCb3goKTtcbiAgICBsaXN0VGFibGVDb250YWluZXJJbnN0YW5jZS5TZXRDaGVja0JveFRvQ2hlY2tlZFN0YXR1cyhzZW5kZXIuZGF0YS5yb3dEYXRhLklEKTtcbiAgICBjb25zb2xlLmxvZyh0YXJnZXRidXR0b25pZCk7XG4gICAgJChcImJ1dHRvbiNcIiArIHRhcmdldGJ1dHRvbmlkKS50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgY29uc29sZS5sb2cobGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdFRhYmxlTGFiZWwgPSB7XG4gIFJlbmRlcmVyQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbihfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcykge1xuICAgIHZhciB2YWx1ZSA9IF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLnZhbDtcbiAgICB2YXIgJHRkID0gX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMuJHRkO1xuICAgICR0ZC5jc3MoXCJ0ZXh0QWxpZ25cIiwgXCJjZW50ZXJcIik7XG4gICAgJHRkLmh0bWwodmFsdWUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfU2VhcmNoX1RleHRCb3ggPSB7XG4gIFJlbmRlcmVyQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckRhdGFDaGFpbixcbiAgR2V0VmFsdWU6IEhUTUxDb250cm9sLkdldFZhbHVlXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ2pxdWVyeScsICdkYXRhdGFibGVzLm5ldCddLCBmdW5jdGlvbiAoJCkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoJCwgd2luZG93LCBkb2N1bWVudCk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoKHR5cGVvZiBleHBvcnRzID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YoZXhwb3J0cykpID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvb3QsICQpIHtcbiAgICAgIGlmICghcm9vdCkge1xuICAgICAgICByb290ID0gd2luZG93O1xuICAgICAgfVxuXG4gICAgICBpZiAoISQgfHwgISQuZm4uZGF0YVRhYmxlKSB7XG4gICAgICAgICQgPSByZXF1aXJlKCdkYXRhdGFibGVzLm5ldCcpKHJvb3QsICQpLiQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWN0b3J5KCQsIHJvb3QsIHJvb3QuZG9jdW1lbnQpO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgZmFjdG9yeShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuICB9XG59KShmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgRGF0YVRhYmxlID0gJC5mbi5kYXRhVGFibGU7XG5cbiAgdmFyIF9maXJlZm94U2Nyb2xsO1xuXG4gIHZhciBGaXhlZENvbHVtbnMgPSBmdW5jdGlvbiBGaXhlZENvbHVtbnMoZHQsIGluaXQpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRml4ZWRDb2x1bW5zKSkge1xuICAgICAgYWxlcnQoXCJGaXhlZENvbHVtbnMgd2FybmluZzogRml4ZWRDb2x1bW5zIG11c3QgYmUgaW5pdGlhbGlzZWQgd2l0aCB0aGUgJ25ldycga2V5d29yZC5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGluaXQgPT09IHVuZGVmaW5lZCB8fCBpbml0ID09PSB0cnVlKSB7XG4gICAgICBpbml0ID0ge307XG4gICAgfVxuXG4gICAgdmFyIGNhbWVsVG9IdW5nYXJpYW4gPSAkLmZuLmRhdGFUYWJsZS5jYW1lbFRvSHVuZ2FyaWFuO1xuXG4gICAgaWYgKGNhbWVsVG9IdW5nYXJpYW4pIHtcbiAgICAgIGNhbWVsVG9IdW5nYXJpYW4oRml4ZWRDb2x1bW5zLmRlZmF1bHRzLCBGaXhlZENvbHVtbnMuZGVmYXVsdHMsIHRydWUpO1xuICAgICAgY2FtZWxUb0h1bmdhcmlhbihGaXhlZENvbHVtbnMuZGVmYXVsdHMsIGluaXQpO1xuICAgIH1cblxuICAgIHZhciBkdFNldHRpbmdzID0gbmV3ICQuZm4uZGF0YVRhYmxlLkFwaShkdCkuc2V0dGluZ3MoKVswXTtcbiAgICB0aGlzLnMgPSB7XG4gICAgICBcImR0XCI6IGR0U2V0dGluZ3MsXG4gICAgICBcImlUYWJsZUNvbHVtbnNcIjogZHRTZXR0aW5ncy5hb0NvbHVtbnMubGVuZ3RoLFxuICAgICAgXCJhaU91dGVyV2lkdGhzXCI6IFtdLFxuICAgICAgXCJhaUlubmVyV2lkdGhzXCI6IFtdLFxuICAgICAgcnRsOiAkKGR0U2V0dGluZ3MublRhYmxlKS5jc3MoJ2RpcmVjdGlvbicpID09PSAncnRsJ1xuICAgIH07XG4gICAgdGhpcy5kb20gPSB7XG4gICAgICBcInNjcm9sbGVyXCI6IG51bGwsXG4gICAgICBcImhlYWRlclwiOiBudWxsLFxuICAgICAgXCJib2R5XCI6IG51bGwsXG4gICAgICBcImZvb3RlclwiOiBudWxsLFxuICAgICAgXCJncmlkXCI6IHtcbiAgICAgICAgXCJ3cmFwcGVyXCI6IG51bGwsXG4gICAgICAgIFwiZHRcIjogbnVsbCxcbiAgICAgICAgXCJsZWZ0XCI6IHtcbiAgICAgICAgICBcIndyYXBwZXJcIjogbnVsbCxcbiAgICAgICAgICBcImhlYWRcIjogbnVsbCxcbiAgICAgICAgICBcImJvZHlcIjogbnVsbCxcbiAgICAgICAgICBcImZvb3RcIjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBcInJpZ2h0XCI6IHtcbiAgICAgICAgICBcIndyYXBwZXJcIjogbnVsbCxcbiAgICAgICAgICBcImhlYWRcIjogbnVsbCxcbiAgICAgICAgICBcImJvZHlcIjogbnVsbCxcbiAgICAgICAgICBcImZvb3RcIjogbnVsbFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJjbG9uZVwiOiB7XG4gICAgICAgIFwibGVmdFwiOiB7XG4gICAgICAgICAgXCJoZWFkZXJcIjogbnVsbCxcbiAgICAgICAgICBcImJvZHlcIjogbnVsbCxcbiAgICAgICAgICBcImZvb3RlclwiOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIFwicmlnaHRcIjoge1xuICAgICAgICAgIFwiaGVhZGVyXCI6IG51bGwsXG4gICAgICAgICAgXCJib2R5XCI6IG51bGwsXG4gICAgICAgICAgXCJmb290ZXJcIjogbnVsbFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChkdFNldHRpbmdzLl9vRml4ZWRDb2x1bW5zKSB7XG4gICAgICB0aHJvdyAnRml4ZWRDb2x1bW5zIGFscmVhZHkgaW5pdGlhbGlzZWQgb24gdGhpcyB0YWJsZSc7XG4gICAgfVxuXG4gICAgZHRTZXR0aW5ncy5fb0ZpeGVkQ29sdW1ucyA9IHRoaXM7XG5cbiAgICBpZiAoIWR0U2V0dGluZ3MuX2JJbml0Q29tcGxldGUpIHtcbiAgICAgIGR0U2V0dGluZ3Mub0FwaS5fZm5DYWxsYmFja1JlZyhkdFNldHRpbmdzLCAnYW9Jbml0Q29tcGxldGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQuX2ZuQ29uc3RydWN0KGluaXQpO1xuICAgICAgfSwgJ0ZpeGVkQ29sdW1ucycpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9mbkNvbnN0cnVjdChpbml0KTtcbiAgICB9XG4gIH07XG5cbiAgJC5leHRlbmQoRml4ZWRDb2x1bW5zLnByb3RvdHlwZSwge1xuICAgIFwiZm5VcGRhdGVcIjogZnVuY3Rpb24gZm5VcGRhdGUoKSB7XG4gICAgICB0aGlzLl9mbkRyYXcodHJ1ZSk7XG4gICAgfSxcbiAgICBcImZuUmVkcmF3TGF5b3V0XCI6IGZ1bmN0aW9uIGZuUmVkcmF3TGF5b3V0KCkge1xuICAgICAgdGhpcy5fZm5Db2xDYWxjKCk7XG5cbiAgICAgIHRoaXMuX2ZuR3JpZExheW91dCgpO1xuXG4gICAgICB0aGlzLmZuVXBkYXRlKCk7XG4gICAgfSxcbiAgICBcImZuUmVjYWxjdWxhdGVIZWlnaHRcIjogZnVuY3Rpb24gZm5SZWNhbGN1bGF0ZUhlaWdodChuVHIpIHtcbiAgICAgIGRlbGV0ZSBuVHIuX0RUVENfaUhlaWdodDtcbiAgICAgIG5Uci5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgfSxcbiAgICBcImZuU2V0Um93SGVpZ2h0XCI6IGZ1bmN0aW9uIGZuU2V0Um93SGVpZ2h0KG5UYXJnZXQsIGlIZWlnaHQpIHtcbiAgICAgIG5UYXJnZXQuc3R5bGUuaGVpZ2h0ID0gaUhlaWdodCArIFwicHhcIjtcbiAgICB9LFxuICAgIFwiZm5HZXRQb3NpdGlvblwiOiBmdW5jdGlvbiBmbkdldFBvc2l0aW9uKG5vZGUpIHtcbiAgICAgIHZhciBpZHg7XG4gICAgICB2YXIgaW5zdCA9IHRoaXMucy5kdC5vSW5zdGFuY2U7XG5cbiAgICAgIGlmICghJChub2RlKS5wYXJlbnRzKCcuRFRGQ19DbG9uZWQnKS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGluc3QuZm5HZXRQb3NpdGlvbihub2RlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICd0cicpIHtcbiAgICAgICAgICBpZHggPSAkKG5vZGUpLmluZGV4KCk7XG4gICAgICAgICAgcmV0dXJuIGluc3QuZm5HZXRQb3NpdGlvbigkKCd0cicsIHRoaXMucy5kdC5uVEJvZHkpW2lkeF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBjb2xJZHggPSAkKG5vZGUpLmluZGV4KCk7XG4gICAgICAgICAgaWR4ID0gJChub2RlLnBhcmVudE5vZGUpLmluZGV4KCk7XG4gICAgICAgICAgdmFyIHJvdyA9IGluc3QuZm5HZXRQb3NpdGlvbigkKCd0cicsIHRoaXMucy5kdC5uVEJvZHkpW2lkeF0pO1xuICAgICAgICAgIHJldHVybiBbcm93LCBjb2xJZHgsIGluc3Qub0FwaS5fZm5WaXNpYmxlVG9Db2x1bW5JbmRleCh0aGlzLnMuZHQsIGNvbElkeCldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcIl9mbkNvbnN0cnVjdFwiOiBmdW5jdGlvbiBfZm5Db25zdHJ1Y3Qob0luaXQpIHtcbiAgICAgIHZhciBpLFxuICAgICAgICAgIGlMZW4sXG4gICAgICAgICAgaVdpZHRoLFxuICAgICAgICAgIHRoYXQgPSB0aGlzO1xuXG4gICAgICBpZiAodHlwZW9mIHRoaXMucy5kdC5vSW5zdGFuY2UuZm5WZXJzaW9uQ2hlY2sgIT0gJ2Z1bmN0aW9uJyB8fCB0aGlzLnMuZHQub0luc3RhbmNlLmZuVmVyc2lvbkNoZWNrKCcxLjguMCcpICE9PSB0cnVlKSB7XG4gICAgICAgIGFsZXJ0KFwiRml4ZWRDb2x1bW5zIFwiICsgRml4ZWRDb2x1bW5zLlZFUlNJT04gKyBcIiByZXF1aXJlZCBEYXRhVGFibGVzIDEuOC4wIG9yIGxhdGVyLiBcIiArIFwiUGxlYXNlIHVwZ3JhZGUgeW91ciBEYXRhVGFibGVzIGluc3RhbGxhdGlvblwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zLmR0Lm9TY3JvbGwuc1ggPT09IFwiXCIpIHtcbiAgICAgICAgdGhpcy5zLmR0Lm9JbnN0YW5jZS5vQXBpLl9mbkxvZyh0aGlzLnMuZHQsIDEsIFwiRml4ZWRDb2x1bW5zIGlzIG5vdCBuZWVkZWQgKG5vIFwiICsgXCJ4LXNjcm9sbGluZyBpbiBEYXRhVGFibGVzIGVuYWJsZWQpLCBzbyBubyBhY3Rpb24gd2lsbCBiZSB0YWtlbi4gVXNlICdGaXhlZEhlYWRlcicgZm9yIFwiICsgXCJjb2x1bW4gZml4aW5nIHdoZW4gc2Nyb2xsaW5nIGlzIG5vdCBlbmFibGVkXCIpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zID0gJC5leHRlbmQodHJ1ZSwgdGhpcy5zLCBGaXhlZENvbHVtbnMuZGVmYXVsdHMsIG9Jbml0KTtcbiAgICAgIHZhciBjbGFzc2VzID0gdGhpcy5zLmR0Lm9DbGFzc2VzO1xuICAgICAgdGhpcy5kb20uZ3JpZC5kdCA9ICQodGhpcy5zLmR0Lm5UYWJsZSkucGFyZW50cygnZGl2LicgKyBjbGFzc2VzLnNTY3JvbGxXcmFwcGVyKVswXTtcbiAgICAgIHRoaXMuZG9tLnNjcm9sbGVyID0gJCgnZGl2LicgKyBjbGFzc2VzLnNTY3JvbGxCb2R5LCB0aGlzLmRvbS5ncmlkLmR0KVswXTtcblxuICAgICAgdGhpcy5fZm5Db2xDYWxjKCk7XG5cbiAgICAgIHRoaXMuX2ZuR3JpZFNldHVwKCk7XG5cbiAgICAgIHZhciBtb3VzZUNvbnRyb2xsZXI7XG4gICAgICB2YXIgbW91c2VEb3duID0gZmFsc2U7XG4gICAgICAkKHRoaXMucy5kdC5uVGFibGVXcmFwcGVyKS5vbignbW91c2Vkb3duLkRURkMnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZS5idXR0b24gPT09IDApIHtcbiAgICAgICAgICBtb3VzZURvd24gPSB0cnVlO1xuICAgICAgICAgICQoZG9jdW1lbnQpLm9uZSgnbW91c2V1cCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgICQodGhpcy5kb20uc2Nyb2xsZXIpLm9uKCdtb3VzZW92ZXIuRFRGQyB0b3VjaHN0YXJ0LkRURkMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghbW91c2VEb3duKSB7XG4gICAgICAgICAgbW91c2VDb250cm9sbGVyID0gJ21haW4nO1xuICAgICAgICB9XG4gICAgICB9KS5vbignc2Nyb2xsLkRURkMnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoIW1vdXNlQ29udHJvbGxlciAmJiBlLm9yaWdpbmFsRXZlbnQpIHtcbiAgICAgICAgICBtb3VzZUNvbnRyb2xsZXIgPSAnbWFpbic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW91c2VDb250cm9sbGVyID09PSAnbWFpbicpIHtcbiAgICAgICAgICBpZiAodGhhdC5zLmlMZWZ0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgICAgIHRoYXQuZG9tLmdyaWQubGVmdC5saW5lci5zY3JvbGxUb3AgPSB0aGF0LmRvbS5zY3JvbGxlci5zY3JvbGxUb3A7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoYXQucy5pUmlnaHRDb2x1bW5zID4gMCkge1xuICAgICAgICAgICAgdGhhdC5kb20uZ3JpZC5yaWdodC5saW5lci5zY3JvbGxUb3AgPSB0aGF0LmRvbS5zY3JvbGxlci5zY3JvbGxUb3A7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHZhciB3aGVlbFR5cGUgPSAnb253aGVlbCcgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykgPyAnd2hlZWwuRFRGQycgOiAnbW91c2V3aGVlbC5EVEZDJztcblxuICAgICAgaWYgKHRoYXQucy5pTGVmdENvbHVtbnMgPiAwKSB7XG4gICAgICAgICQodGhhdC5kb20uZ3JpZC5sZWZ0LmxpbmVyKS5vbignbW91c2VvdmVyLkRURkMgdG91Y2hzdGFydC5EVEZDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghbW91c2VEb3duKSB7XG4gICAgICAgICAgICBtb3VzZUNvbnRyb2xsZXIgPSAnbGVmdCc7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5vbignc2Nyb2xsLkRURkMnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmICghbW91c2VDb250cm9sbGVyICYmIGUub3JpZ2luYWxFdmVudCkge1xuICAgICAgICAgICAgbW91c2VDb250cm9sbGVyID0gJ2xlZnQnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChtb3VzZUNvbnRyb2xsZXIgPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgdGhhdC5kb20uc2Nyb2xsZXIuc2Nyb2xsVG9wID0gdGhhdC5kb20uZ3JpZC5sZWZ0LmxpbmVyLnNjcm9sbFRvcDtcblxuICAgICAgICAgICAgaWYgKHRoYXQucy5pUmlnaHRDb2x1bW5zID4gMCkge1xuICAgICAgICAgICAgICB0aGF0LmRvbS5ncmlkLnJpZ2h0LmxpbmVyLnNjcm9sbFRvcCA9IHRoYXQuZG9tLmdyaWQubGVmdC5saW5lci5zY3JvbGxUb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS5vbih3aGVlbFR5cGUsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyIHhEZWx0YSA9IGUudHlwZSA9PT0gJ3doZWVsJyA/IC1lLm9yaWdpbmFsRXZlbnQuZGVsdGFYIDogZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGFYO1xuICAgICAgICAgIHRoYXQuZG9tLnNjcm9sbGVyLnNjcm9sbExlZnQgLT0geERlbHRhO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoYXQucy5pUmlnaHRDb2x1bW5zID4gMCkge1xuICAgICAgICAkKHRoYXQuZG9tLmdyaWQucmlnaHQubGluZXIpLm9uKCdtb3VzZW92ZXIuRFRGQyB0b3VjaHN0YXJ0LkRURkMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFtb3VzZURvd24pIHtcbiAgICAgICAgICAgIG1vdXNlQ29udHJvbGxlciA9ICdyaWdodCc7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5vbignc2Nyb2xsLkRURkMnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmICghbW91c2VDb250cm9sbGVyICYmIGUub3JpZ2luYWxFdmVudCkge1xuICAgICAgICAgICAgbW91c2VDb250cm9sbGVyID0gJ3JpZ2h0JztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobW91c2VDb250cm9sbGVyID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICB0aGF0LmRvbS5zY3JvbGxlci5zY3JvbGxUb3AgPSB0aGF0LmRvbS5ncmlkLnJpZ2h0LmxpbmVyLnNjcm9sbFRvcDtcblxuICAgICAgICAgICAgaWYgKHRoYXQucy5pTGVmdENvbHVtbnMgPiAwKSB7XG4gICAgICAgICAgICAgIHRoYXQuZG9tLmdyaWQubGVmdC5saW5lci5zY3JvbGxUb3AgPSB0aGF0LmRvbS5ncmlkLnJpZ2h0LmxpbmVyLnNjcm9sbFRvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pLm9uKHdoZWVsVHlwZSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgeERlbHRhID0gZS50eXBlID09PSAnd2hlZWwnID8gLWUub3JpZ2luYWxFdmVudC5kZWx0YVggOiBlLm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YVg7XG4gICAgICAgICAgdGhhdC5kb20uc2Nyb2xsZXIuc2Nyb2xsTGVmdCAtPSB4RGVsdGE7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS5EVEZDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0Ll9mbkdyaWRMYXlvdXQuY2FsbCh0aGF0KTtcbiAgICAgIH0pO1xuICAgICAgdmFyIGJGaXJzdERyYXcgPSB0cnVlO1xuICAgICAgdmFyIGpxVGFibGUgPSAkKHRoaXMucy5kdC5uVGFibGUpO1xuICAgICAganFUYWJsZS5vbignZHJhdy5kdC5EVEZDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0Ll9mbkNvbENhbGMoKTtcblxuICAgICAgICB0aGF0Ll9mbkRyYXcuY2FsbCh0aGF0LCBiRmlyc3REcmF3KTtcblxuICAgICAgICBiRmlyc3REcmF3ID0gZmFsc2U7XG4gICAgICB9KS5vbignY29sdW1uLXNpemluZy5kdC5EVEZDJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0Ll9mbkNvbENhbGMoKTtcblxuICAgICAgICB0aGF0Ll9mbkdyaWRMYXlvdXQodGhhdCk7XG4gICAgICB9KS5vbignY29sdW1uLXZpc2liaWxpdHkuZHQuRFRGQycsIGZ1bmN0aW9uIChlLCBzZXR0aW5ncywgY29sdW1uLCB2aXMsIHJlY2FsYykge1xuICAgICAgICBpZiAocmVjYWxjID09PSB1bmRlZmluZWQgfHwgcmVjYWxjKSB7XG4gICAgICAgICAgdGhhdC5fZm5Db2xDYWxjKCk7XG5cbiAgICAgICAgICB0aGF0Ll9mbkdyaWRMYXlvdXQodGhhdCk7XG5cbiAgICAgICAgICB0aGF0Ll9mbkRyYXcodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLm9uKCdzZWxlY3QuZHQuRFRGQyBkZXNlbGVjdC5kdC5EVEZDJywgZnVuY3Rpb24gKGUsIGR0LCB0eXBlLCBpbmRleGVzKSB7XG4gICAgICAgIGlmIChlLm5hbWVzcGFjZSA9PT0gJ2R0Jykge1xuICAgICAgICAgIHRoYXQuX2ZuRHJhdyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLm9uKCdkZXN0cm95LmR0LkRURkMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGpxVGFibGUub2ZmKCcuRFRGQycpO1xuICAgICAgICAkKHRoYXQuZG9tLnNjcm9sbGVyKS5vZmYoJy5EVEZDJyk7XG4gICAgICAgICQod2luZG93KS5vZmYoJy5EVEZDJyk7XG4gICAgICAgICQodGhhdC5zLmR0Lm5UYWJsZVdyYXBwZXIpLm9mZignLkRURkMnKTtcbiAgICAgICAgJCh0aGF0LmRvbS5ncmlkLmxlZnQubGluZXIpLm9mZignLkRURkMgJyArIHdoZWVsVHlwZSk7XG4gICAgICAgICQodGhhdC5kb20uZ3JpZC5sZWZ0LndyYXBwZXIpLnJlbW92ZSgpO1xuICAgICAgICAkKHRoYXQuZG9tLmdyaWQucmlnaHQubGluZXIpLm9mZignLkRURkMgJyArIHdoZWVsVHlwZSk7XG4gICAgICAgICQodGhhdC5kb20uZ3JpZC5yaWdodC53cmFwcGVyKS5yZW1vdmUoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9mbkdyaWRMYXlvdXQoKTtcblxuICAgICAgdGhpcy5zLmR0Lm9JbnN0YW5jZS5mbkRyYXcoZmFsc2UpO1xuICAgIH0sXG4gICAgXCJfZm5Db2xDYWxjXCI6IGZ1bmN0aW9uIF9mbkNvbENhbGMoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICB2YXIgaUxlZnRXaWR0aCA9IDA7XG4gICAgICB2YXIgaVJpZ2h0V2lkdGggPSAwO1xuICAgICAgdGhpcy5zLmFpSW5uZXJXaWR0aHMgPSBbXTtcbiAgICAgIHRoaXMucy5haU91dGVyV2lkdGhzID0gW107XG4gICAgICAkLmVhY2godGhpcy5zLmR0LmFvQ29sdW1ucywgZnVuY3Rpb24gKGksIGNvbCkge1xuICAgICAgICB2YXIgdGggPSAkKGNvbC5uVGgpO1xuICAgICAgICB2YXIgYm9yZGVyO1xuXG4gICAgICAgIGlmICghdGguZmlsdGVyKCc6dmlzaWJsZScpLmxlbmd0aCkge1xuICAgICAgICAgIHRoYXQucy5haUlubmVyV2lkdGhzLnB1c2goMCk7XG4gICAgICAgICAgdGhhdC5zLmFpT3V0ZXJXaWR0aHMucHVzaCgwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgaVdpZHRoID0gdGgub3V0ZXJXaWR0aCgpO1xuXG4gICAgICAgICAgaWYgKHRoYXQucy5haU91dGVyV2lkdGhzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgYm9yZGVyID0gJCh0aGF0LnMuZHQublRhYmxlKS5jc3MoJ2JvcmRlci1sZWZ0LXdpZHRoJyk7XG4gICAgICAgICAgICBpV2lkdGggKz0gdHlwZW9mIGJvcmRlciA9PT0gJ3N0cmluZycgJiYgYm9yZGVyLmluZGV4T2YoJ3B4JykgPT09IC0xID8gMSA6IHBhcnNlSW50KGJvcmRlciwgMTApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGF0LnMuYWlPdXRlcldpZHRocy5sZW5ndGggPT09IHRoYXQucy5kdC5hb0NvbHVtbnMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgYm9yZGVyID0gJCh0aGF0LnMuZHQublRhYmxlKS5jc3MoJ2JvcmRlci1yaWdodC13aWR0aCcpO1xuICAgICAgICAgICAgaVdpZHRoICs9IHR5cGVvZiBib3JkZXIgPT09ICdzdHJpbmcnICYmIGJvcmRlci5pbmRleE9mKCdweCcpID09PSAtMSA/IDEgOiBwYXJzZUludChib3JkZXIsIDEwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGF0LnMuYWlPdXRlcldpZHRocy5wdXNoKGlXaWR0aCk7XG4gICAgICAgICAgdGhhdC5zLmFpSW5uZXJXaWR0aHMucHVzaCh0aC53aWR0aCgpKTtcblxuICAgICAgICAgIGlmIChpIDwgdGhhdC5zLmlMZWZ0Q29sdW1ucykge1xuICAgICAgICAgICAgaUxlZnRXaWR0aCArPSBpV2lkdGg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoYXQucy5pVGFibGVDb2x1bW5zIC0gdGhhdC5zLmlSaWdodENvbHVtbnMgPD0gaSkge1xuICAgICAgICAgICAgaVJpZ2h0V2lkdGggKz0gaVdpZHRoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnMuaUxlZnRXaWR0aCA9IGlMZWZ0V2lkdGg7XG4gICAgICB0aGlzLnMuaVJpZ2h0V2lkdGggPSBpUmlnaHRXaWR0aDtcbiAgICB9LFxuICAgIFwiX2ZuR3JpZFNldHVwXCI6IGZ1bmN0aW9uIF9mbkdyaWRTZXR1cCgpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgdmFyIG9PdmVyZmxvdyA9IHRoaXMuX2ZuRFRPdmVyZmxvdygpO1xuXG4gICAgICB2YXIgYmxvY2s7XG4gICAgICB0aGlzLmRvbS5ib2R5ID0gdGhpcy5zLmR0Lm5UYWJsZTtcbiAgICAgIHRoaXMuZG9tLmhlYWRlciA9IHRoaXMucy5kdC5uVEhlYWQucGFyZW50Tm9kZTtcbiAgICAgIHRoaXMuZG9tLmhlYWRlci5wYXJlbnROb2RlLnBhcmVudE5vZGUuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG4gICAgICB2YXIgblNXcmFwcGVyID0gJCgnPGRpdiBjbGFzcz1cIkRURkNfU2Nyb2xsV3JhcHBlclwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7IGNsZWFyOmJvdGg7XCI+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19MZWZ0V3JhcHBlclwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHRvcDowOyBsZWZ0OjA7XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19MZWZ0SGVhZFdyYXBwZXJcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlOyB0b3A6MDsgbGVmdDowOyBvdmVyZmxvdzpoaWRkZW47XCI+PC9kaXY+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19MZWZ0Qm9keVdyYXBwZXJcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlOyB0b3A6MDsgbGVmdDowOyBvdmVyZmxvdzpoaWRkZW47XCI+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19MZWZ0Qm9keUxpbmVyXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTsgdG9wOjA7IGxlZnQ6MDsgb3ZlcmZsb3cteTpzY3JvbGw7XCI+PC9kaXY+JyArICc8L2Rpdj4nICsgJzxkaXYgY2xhc3M9XCJEVEZDX0xlZnRGb290V3JhcHBlclwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7IHRvcDowOyBsZWZ0OjA7IG92ZXJmbG93OmhpZGRlbjtcIj48L2Rpdj4nICsgJzwvZGl2PicgKyAnPGRpdiBjbGFzcz1cIkRURkNfUmlnaHRXcmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTsgdG9wOjA7IHJpZ2h0OjA7XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19SaWdodEhlYWRXcmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTsgdG9wOjA7IGxlZnQ6MDtcIj4nICsgJzxkaXYgY2xhc3M9XCJEVEZDX1JpZ2h0SGVhZEJsb2NrZXIgRFRGQ19CbG9ja2VyXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTsgdG9wOjA7IGJvdHRvbTowO1wiPjwvZGl2PicgKyAnPC9kaXY+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19SaWdodEJvZHlXcmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTsgdG9wOjA7IGxlZnQ6MDsgb3ZlcmZsb3c6aGlkZGVuO1wiPicgKyAnPGRpdiBjbGFzcz1cIkRURkNfUmlnaHRCb2R5TGluZXJcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlOyB0b3A6MDsgbGVmdDowOyBvdmVyZmxvdy15OnNjcm9sbDtcIj48L2Rpdj4nICsgJzwvZGl2PicgKyAnPGRpdiBjbGFzcz1cIkRURkNfUmlnaHRGb290V3JhcHBlclwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7IHRvcDowOyBsZWZ0OjA7XCI+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19SaWdodEZvb3RCbG9ja2VyIERURkNfQmxvY2tlclwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHRvcDowOyBib3R0b206MDtcIj48L2Rpdj4nICsgJzwvZGl2PicgKyAnPC9kaXY+JyArICc8L2Rpdj4nKVswXTtcbiAgICAgIHZhciBuTGVmdCA9IG5TV3JhcHBlci5jaGlsZE5vZGVzWzBdO1xuICAgICAgdmFyIG5SaWdodCA9IG5TV3JhcHBlci5jaGlsZE5vZGVzWzFdO1xuICAgICAgdGhpcy5kb20uZ3JpZC5kdC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuU1dyYXBwZXIsIHRoaXMuZG9tLmdyaWQuZHQpO1xuICAgICAgblNXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZG9tLmdyaWQuZHQpO1xuICAgICAgdGhpcy5kb20uZ3JpZC53cmFwcGVyID0gblNXcmFwcGVyO1xuXG4gICAgICBpZiAodGhpcy5zLmlMZWZ0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgdGhpcy5kb20uZ3JpZC5sZWZ0LndyYXBwZXIgPSBuTGVmdDtcbiAgICAgICAgdGhpcy5kb20uZ3JpZC5sZWZ0LmhlYWQgPSBuTGVmdC5jaGlsZE5vZGVzWzBdO1xuICAgICAgICB0aGlzLmRvbS5ncmlkLmxlZnQuYm9keSA9IG5MZWZ0LmNoaWxkTm9kZXNbMV07XG4gICAgICAgIHRoaXMuZG9tLmdyaWQubGVmdC5saW5lciA9ICQoJ2Rpdi5EVEZDX0xlZnRCb2R5TGluZXInLCBuU1dyYXBwZXIpWzBdO1xuICAgICAgICBuU1dyYXBwZXIuYXBwZW5kQ2hpbGQobkxlZnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zLmlSaWdodENvbHVtbnMgPiAwKSB7XG4gICAgICAgIHRoaXMuZG9tLmdyaWQucmlnaHQud3JhcHBlciA9IG5SaWdodDtcbiAgICAgICAgdGhpcy5kb20uZ3JpZC5yaWdodC5oZWFkID0gblJpZ2h0LmNoaWxkTm9kZXNbMF07XG4gICAgICAgIHRoaXMuZG9tLmdyaWQucmlnaHQuYm9keSA9IG5SaWdodC5jaGlsZE5vZGVzWzFdO1xuICAgICAgICB0aGlzLmRvbS5ncmlkLnJpZ2h0LmxpbmVyID0gJCgnZGl2LkRURkNfUmlnaHRCb2R5TGluZXInLCBuU1dyYXBwZXIpWzBdO1xuICAgICAgICBuUmlnaHQuc3R5bGUucmlnaHQgPSBvT3ZlcmZsb3cuYmFyICsgXCJweFwiO1xuICAgICAgICBibG9jayA9ICQoJ2Rpdi5EVEZDX1JpZ2h0SGVhZEJsb2NrZXInLCBuU1dyYXBwZXIpWzBdO1xuICAgICAgICBibG9jay5zdHlsZS53aWR0aCA9IG9PdmVyZmxvdy5iYXIgKyBcInB4XCI7XG4gICAgICAgIGJsb2NrLnN0eWxlLnJpZ2h0ID0gLW9PdmVyZmxvdy5iYXIgKyBcInB4XCI7XG4gICAgICAgIHRoaXMuZG9tLmdyaWQucmlnaHQuaGVhZEJsb2NrID0gYmxvY2s7XG4gICAgICAgIGJsb2NrID0gJCgnZGl2LkRURkNfUmlnaHRGb290QmxvY2tlcicsIG5TV3JhcHBlcilbMF07XG4gICAgICAgIGJsb2NrLnN0eWxlLndpZHRoID0gb092ZXJmbG93LmJhciArIFwicHhcIjtcbiAgICAgICAgYmxvY2suc3R5bGUucmlnaHQgPSAtb092ZXJmbG93LmJhciArIFwicHhcIjtcbiAgICAgICAgdGhpcy5kb20uZ3JpZC5yaWdodC5mb290QmxvY2sgPSBibG9jaztcbiAgICAgICAgblNXcmFwcGVyLmFwcGVuZENoaWxkKG5SaWdodCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnMuZHQublRGb290KSB7XG4gICAgICAgIHRoaXMuZG9tLmZvb3RlciA9IHRoaXMucy5kdC5uVEZvb3QucGFyZW50Tm9kZTtcblxuICAgICAgICBpZiAodGhpcy5zLmlMZWZ0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgICB0aGlzLmRvbS5ncmlkLmxlZnQuZm9vdCA9IG5MZWZ0LmNoaWxkTm9kZXNbMl07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zLmlSaWdodENvbHVtbnMgPiAwKSB7XG4gICAgICAgICAgdGhpcy5kb20uZ3JpZC5yaWdodC5mb290ID0gblJpZ2h0LmNoaWxkTm9kZXNbMl07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucy5ydGwpIHtcbiAgICAgICAgJCgnZGl2LkRURkNfUmlnaHRIZWFkQmxvY2tlcicsIG5TV3JhcHBlcikuY3NzKHtcbiAgICAgICAgICBsZWZ0OiAtb092ZXJmbG93LmJhciArICdweCcsXG4gICAgICAgICAgcmlnaHQ6ICcnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJfZm5HcmlkTGF5b3V0XCI6IGZ1bmN0aW9uIF9mbkdyaWRMYXlvdXQoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICB2YXIgb0dyaWQgPSB0aGlzLmRvbS5ncmlkO1xuICAgICAgdmFyIGlXaWR0aCA9ICQob0dyaWQud3JhcHBlcikud2lkdGgoKTtcbiAgICAgIHZhciBpQm9keUhlaWdodCA9IHRoaXMucy5kdC5uVGFibGUucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQ7XG4gICAgICB2YXIgaUZ1bGxIZWlnaHQgPSB0aGlzLnMuZHQublRhYmxlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIHZhciBvT3ZlcmZsb3cgPSB0aGlzLl9mbkRUT3ZlcmZsb3coKTtcblxuICAgICAgdmFyIGlMZWZ0V2lkdGggPSB0aGlzLnMuaUxlZnRXaWR0aDtcbiAgICAgIHZhciBpUmlnaHRXaWR0aCA9IHRoaXMucy5pUmlnaHRXaWR0aDtcbiAgICAgIHZhciBydGwgPSAkKHRoaXMuZG9tLmJvZHkpLmNzcygnZGlyZWN0aW9uJykgPT09ICdydGwnO1xuICAgICAgdmFyIHdyYXBwZXI7XG5cbiAgICAgIHZhciBzY3JvbGxiYXJBZGp1c3QgPSBmdW5jdGlvbiBzY3JvbGxiYXJBZGp1c3Qobm9kZSwgd2lkdGgpIHtcbiAgICAgICAgaWYgKCFvT3ZlcmZsb3cuYmFyKSB7XG4gICAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoICsgMjAgKyBcInB4XCI7XG4gICAgICAgICAgbm9kZS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIjIwcHhcIjtcbiAgICAgICAgICBub2RlLnN0eWxlLmJveFNpemluZyA9IFwiYm9yZGVyLWJveFwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoYXQuX2ZpcmVmb3hTY3JvbGxFcnJvcigpKSB7XG4gICAgICAgICAgaWYgKCQobm9kZSkuaGVpZ2h0KCkgPiAzNCkge1xuICAgICAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoICsgb092ZXJmbG93LmJhciArIFwicHhcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoICsgb092ZXJmbG93LmJhciArIFwicHhcIjtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKG9PdmVyZmxvdy54KSB7XG4gICAgICAgIGlCb2R5SGVpZ2h0IC09IG9PdmVyZmxvdy5iYXI7XG4gICAgICB9XG5cbiAgICAgIG9HcmlkLndyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gaUZ1bGxIZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgIGlmICh0aGlzLnMuaUxlZnRDb2x1bW5zID4gMCkge1xuICAgICAgICB3cmFwcGVyID0gb0dyaWQubGVmdC53cmFwcGVyO1xuICAgICAgICB3cmFwcGVyLnN0eWxlLndpZHRoID0gaUxlZnRXaWR0aCArICdweCc7XG4gICAgICAgIHdyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gJzFweCc7XG5cbiAgICAgICAgaWYgKHJ0bCkge1xuICAgICAgICAgIHdyYXBwZXIuc3R5bGUubGVmdCA9ICcnO1xuICAgICAgICAgIHdyYXBwZXIuc3R5bGUucmlnaHQgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdyYXBwZXIuc3R5bGUubGVmdCA9IDA7XG4gICAgICAgICAgd3JhcHBlci5zdHlsZS5yaWdodCA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgb0dyaWQubGVmdC5ib2R5LnN0eWxlLmhlaWdodCA9IGlCb2R5SGVpZ2h0ICsgXCJweFwiO1xuXG4gICAgICAgIGlmIChvR3JpZC5sZWZ0LmZvb3QpIHtcbiAgICAgICAgICBvR3JpZC5sZWZ0LmZvb3Quc3R5bGUudG9wID0gKG9PdmVyZmxvdy54ID8gb092ZXJmbG93LmJhciA6IDApICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgc2Nyb2xsYmFyQWRqdXN0KG9HcmlkLmxlZnQubGluZXIsIGlMZWZ0V2lkdGgpO1xuICAgICAgICBvR3JpZC5sZWZ0LmxpbmVyLnN0eWxlLmhlaWdodCA9IGlCb2R5SGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICBvR3JpZC5sZWZ0LmxpbmVyLnN0eWxlLm1heEhlaWdodCA9IGlCb2R5SGVpZ2h0ICsgXCJweFwiO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zLmlSaWdodENvbHVtbnMgPiAwKSB7XG4gICAgICAgIHdyYXBwZXIgPSBvR3JpZC5yaWdodC53cmFwcGVyO1xuICAgICAgICB3cmFwcGVyLnN0eWxlLndpZHRoID0gaVJpZ2h0V2lkdGggKyAncHgnO1xuICAgICAgICB3cmFwcGVyLnN0eWxlLmhlaWdodCA9ICcxcHgnO1xuXG4gICAgICAgIGlmICh0aGlzLnMucnRsKSB7XG4gICAgICAgICAgd3JhcHBlci5zdHlsZS5sZWZ0ID0gb092ZXJmbG93LnkgPyBvT3ZlcmZsb3cuYmFyICsgJ3B4JyA6IDA7XG4gICAgICAgICAgd3JhcHBlci5zdHlsZS5yaWdodCA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdyYXBwZXIuc3R5bGUubGVmdCA9ICcnO1xuICAgICAgICAgIHdyYXBwZXIuc3R5bGUucmlnaHQgPSBvT3ZlcmZsb3cueSA/IG9PdmVyZmxvdy5iYXIgKyAncHgnIDogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIG9HcmlkLnJpZ2h0LmJvZHkuc3R5bGUuaGVpZ2h0ID0gaUJvZHlIZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgICAgaWYgKG9HcmlkLnJpZ2h0LmZvb3QpIHtcbiAgICAgICAgICBvR3JpZC5yaWdodC5mb290LnN0eWxlLnRvcCA9IChvT3ZlcmZsb3cueCA/IG9PdmVyZmxvdy5iYXIgOiAwKSArIFwicHhcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjcm9sbGJhckFkanVzdChvR3JpZC5yaWdodC5saW5lciwgaVJpZ2h0V2lkdGgpO1xuICAgICAgICBvR3JpZC5yaWdodC5saW5lci5zdHlsZS5oZWlnaHQgPSBpQm9keUhlaWdodCArIFwicHhcIjtcbiAgICAgICAgb0dyaWQucmlnaHQubGluZXIuc3R5bGUubWF4SGVpZ2h0ID0gaUJvZHlIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIG9HcmlkLnJpZ2h0LmhlYWRCbG9jay5zdHlsZS5kaXNwbGF5ID0gb092ZXJmbG93LnkgPyAnYmxvY2snIDogJ25vbmUnO1xuICAgICAgICBvR3JpZC5yaWdodC5mb290QmxvY2suc3R5bGUuZGlzcGxheSA9IG9PdmVyZmxvdy55ID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiX2ZuRFRPdmVyZmxvd1wiOiBmdW5jdGlvbiBfZm5EVE92ZXJmbG93KCkge1xuICAgICAgdmFyIG5UYWJsZSA9IHRoaXMucy5kdC5uVGFibGU7XG4gICAgICB2YXIgblRhYmxlU2Nyb2xsQm9keSA9IG5UYWJsZS5wYXJlbnROb2RlO1xuICAgICAgdmFyIG91dCA9IHtcbiAgICAgICAgXCJ4XCI6IGZhbHNlLFxuICAgICAgICBcInlcIjogZmFsc2UsXG4gICAgICAgIFwiYmFyXCI6IHRoaXMucy5kdC5vU2Nyb2xsLmlCYXJXaWR0aFxuICAgICAgfTtcblxuICAgICAgaWYgKG5UYWJsZS5vZmZzZXRXaWR0aCA+IG5UYWJsZVNjcm9sbEJvZHkuY2xpZW50V2lkdGgpIHtcbiAgICAgICAgb3V0LnggPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoblRhYmxlLm9mZnNldEhlaWdodCA+IG5UYWJsZVNjcm9sbEJvZHkuY2xpZW50SGVpZ2h0KSB7XG4gICAgICAgIG91dC55ID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9LFxuICAgIFwiX2ZuRHJhd1wiOiBmdW5jdGlvbiBfZm5EcmF3KGJBbGwpIHtcbiAgICAgIHRoaXMuX2ZuR3JpZExheW91dCgpO1xuXG4gICAgICB0aGlzLl9mbkNsb25lTGVmdChiQWxsKTtcblxuICAgICAgdGhpcy5fZm5DbG9uZVJpZ2h0KGJBbGwpO1xuXG4gICAgICBpZiAodGhpcy5zLmZuRHJhd0NhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMucy5mbkRyYXdDYWxsYmFjay5jYWxsKHRoaXMsIHRoaXMuZG9tLmNsb25lLmxlZnQsIHRoaXMuZG9tLmNsb25lLnJpZ2h0KTtcbiAgICAgIH1cblxuICAgICAgJCh0aGlzKS50cmlnZ2VyKCdkcmF3LmR0ZmMnLCB7XG4gICAgICAgIFwibGVmdENsb25lXCI6IHRoaXMuZG9tLmNsb25lLmxlZnQsXG4gICAgICAgIFwicmlnaHRDbG9uZVwiOiB0aGlzLmRvbS5jbG9uZS5yaWdodFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBcIl9mbkNsb25lUmlnaHRcIjogZnVuY3Rpb24gX2ZuQ2xvbmVSaWdodChiQWxsKSB7XG4gICAgICBpZiAodGhpcy5zLmlSaWdodENvbHVtbnMgPD0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICBpLFxuICAgICAgICAgIGpxLFxuICAgICAgICAgIGFpQ29sdW1ucyA9IFtdO1xuXG4gICAgICBmb3IgKGkgPSB0aGlzLnMuaVRhYmxlQ29sdW1ucyAtIHRoaXMucy5pUmlnaHRDb2x1bW5zOyBpIDwgdGhpcy5zLmlUYWJsZUNvbHVtbnM7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5zLmR0LmFvQ29sdW1uc1tpXS5iVmlzaWJsZSkge1xuICAgICAgICAgIGFpQ29sdW1ucy5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2ZuQ2xvbmUodGhpcy5kb20uY2xvbmUucmlnaHQsIHRoaXMuZG9tLmdyaWQucmlnaHQsIGFpQ29sdW1ucywgYkFsbCk7XG4gICAgfSxcbiAgICBcIl9mbkNsb25lTGVmdFwiOiBmdW5jdGlvbiBfZm5DbG9uZUxlZnQoYkFsbCkge1xuICAgICAgaWYgKHRoaXMucy5pTGVmdENvbHVtbnMgPD0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICBpLFxuICAgICAgICAgIGpxLFxuICAgICAgICAgIGFpQ29sdW1ucyA9IFtdO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5zLmlMZWZ0Q29sdW1uczsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLnMuZHQuYW9Db2x1bW5zW2ldLmJWaXNpYmxlKSB7XG4gICAgICAgICAgYWlDb2x1bW5zLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fZm5DbG9uZSh0aGlzLmRvbS5jbG9uZS5sZWZ0LCB0aGlzLmRvbS5ncmlkLmxlZnQsIGFpQ29sdW1ucywgYkFsbCk7XG4gICAgfSxcbiAgICBcIl9mbkNvcHlMYXlvdXRcIjogZnVuY3Rpb24gX2ZuQ29weUxheW91dChhb09yaWdpbmFsLCBhaUNvbHVtbnMsIGV2ZW50cykge1xuICAgICAgdmFyIGFSZXR1cm4gPSBbXTtcbiAgICAgIHZhciBhQ2xvbmVzID0gW107XG4gICAgICB2YXIgYUNsb25lZCA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGFvT3JpZ2luYWwubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgIHZhciBhUm93ID0gW107XG4gICAgICAgIGFSb3cublRyID0gJChhb09yaWdpbmFsW2ldLm5UcikuY2xvbmUoZXZlbnRzLCBmYWxzZSlbMF07XG5cbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpMZW4gPSB0aGlzLnMuaVRhYmxlQ29sdW1uczsgaiA8IGpMZW47IGorKykge1xuICAgICAgICAgIGlmICgkLmluQXJyYXkoaiwgYWlDb2x1bW5zKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBpQ2xvbmVkID0gJC5pbkFycmF5KGFvT3JpZ2luYWxbaV1bal0uY2VsbCwgYUNsb25lZCk7XG5cbiAgICAgICAgICBpZiAoaUNsb25lZCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHZhciBuQ2xvbmUgPSAkKGFvT3JpZ2luYWxbaV1bal0uY2VsbCkuY2xvbmUoZXZlbnRzLCBmYWxzZSlbMF07XG4gICAgICAgICAgICBhQ2xvbmVzLnB1c2gobkNsb25lKTtcbiAgICAgICAgICAgIGFDbG9uZWQucHVzaChhb09yaWdpbmFsW2ldW2pdLmNlbGwpO1xuICAgICAgICAgICAgYVJvdy5wdXNoKHtcbiAgICAgICAgICAgICAgXCJjZWxsXCI6IG5DbG9uZSxcbiAgICAgICAgICAgICAgXCJ1bmlxdWVcIjogYW9PcmlnaW5hbFtpXVtqXS51bmlxdWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhUm93LnB1c2goe1xuICAgICAgICAgICAgICBcImNlbGxcIjogYUNsb25lc1tpQ2xvbmVkXSxcbiAgICAgICAgICAgICAgXCJ1bmlxdWVcIjogYW9PcmlnaW5hbFtpXVtqXS51bmlxdWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFSZXR1cm4ucHVzaChhUm93KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFSZXR1cm47XG4gICAgfSxcbiAgICBcIl9mbkNsb25lXCI6IGZ1bmN0aW9uIF9mbkNsb25lKG9DbG9uZSwgb0dyaWQsIGFpQ29sdW1ucywgYkFsbCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgIGksXG4gICAgICAgICAgaUxlbixcbiAgICAgICAgICBqLFxuICAgICAgICAgIGpMZW4sXG4gICAgICAgICAganEsXG4gICAgICAgICAgblRhcmdldCxcbiAgICAgICAgICBpQ29sdW1uLFxuICAgICAgICAgIG5DbG9uZSxcbiAgICAgICAgICBpSW5kZXgsXG4gICAgICAgICAgYW9DbG9uZUxheW91dCxcbiAgICAgICAgICBqcUNsb25lVGhlYWQsXG4gICAgICAgICAgYW9GaXhlZEhlYWRlcixcbiAgICAgICAgICBkdCA9IHRoaXMucy5kdDtcblxuICAgICAgaWYgKGJBbGwpIHtcbiAgICAgICAgJChvQ2xvbmUuaGVhZGVyKS5yZW1vdmUoKTtcbiAgICAgICAgb0Nsb25lLmhlYWRlciA9ICQodGhpcy5kb20uaGVhZGVyKS5jbG9uZSh0cnVlLCBmYWxzZSlbMF07XG4gICAgICAgIG9DbG9uZS5oZWFkZXIuY2xhc3NOYW1lICs9IFwiIERURkNfQ2xvbmVkXCI7XG4gICAgICAgIG9DbG9uZS5oZWFkZXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgICAgb0dyaWQuaGVhZC5hcHBlbmRDaGlsZChvQ2xvbmUuaGVhZGVyKTtcbiAgICAgICAgYW9DbG9uZUxheW91dCA9IHRoaXMuX2ZuQ29weUxheW91dChkdC5hb0hlYWRlciwgYWlDb2x1bW5zLCB0cnVlKTtcbiAgICAgICAganFDbG9uZVRoZWFkID0gJCgnPnRoZWFkJywgb0Nsb25lLmhlYWRlcik7XG4gICAgICAgIGpxQ2xvbmVUaGVhZC5lbXB0eSgpO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhb0Nsb25lTGF5b3V0Lmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICAgIGpxQ2xvbmVUaGVhZFswXS5hcHBlbmRDaGlsZChhb0Nsb25lTGF5b3V0W2ldLm5Ucik7XG4gICAgICAgIH1cblxuICAgICAgICBkdC5vQXBpLl9mbkRyYXdIZWFkKGR0LCBhb0Nsb25lTGF5b3V0LCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFvQ2xvbmVMYXlvdXQgPSB0aGlzLl9mbkNvcHlMYXlvdXQoZHQuYW9IZWFkZXIsIGFpQ29sdW1ucywgZmFsc2UpO1xuICAgICAgICBhb0ZpeGVkSGVhZGVyID0gW107XG5cbiAgICAgICAgZHQub0FwaS5fZm5EZXRlY3RIZWFkZXIoYW9GaXhlZEhlYWRlciwgJCgnPnRoZWFkJywgb0Nsb25lLmhlYWRlcilbMF0pO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhb0Nsb25lTGF5b3V0Lmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICAgIGZvciAoaiA9IDAsIGpMZW4gPSBhb0Nsb25lTGF5b3V0W2ldLmxlbmd0aDsgaiA8IGpMZW47IGorKykge1xuICAgICAgICAgICAgYW9GaXhlZEhlYWRlcltpXVtqXS5jZWxsLmNsYXNzTmFtZSA9IGFvQ2xvbmVMYXlvdXRbaV1bal0uY2VsbC5jbGFzc05hbWU7XG4gICAgICAgICAgICAkKCdzcGFuLkRhdGFUYWJsZXNfc29ydF9pY29uJywgYW9GaXhlZEhlYWRlcltpXVtqXS5jZWxsKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSAkKCdzcGFuLkRhdGFUYWJsZXNfc29ydF9pY29uJywgYW9DbG9uZUxheW91dFtpXVtqXS5jZWxsKVswXS5jbGFzc05hbWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fZm5FcXVhbGlzZUhlaWdodHMoJ3RoZWFkJywgdGhpcy5kb20uaGVhZGVyLCBvQ2xvbmUuaGVhZGVyKTtcblxuICAgICAgaWYgKHRoaXMucy5zSGVpZ2h0TWF0Y2ggPT0gJ2F1dG8nKSB7XG4gICAgICAgICQoJz50Ym9keT50cicsIHRoYXQuZG9tLmJvZHkpLmNzcygnaGVpZ2h0JywgJ2F1dG8nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9DbG9uZS5ib2R5ICE9PSBudWxsKSB7XG4gICAgICAgICQob0Nsb25lLmJvZHkpLnJlbW92ZSgpO1xuICAgICAgICBvQ2xvbmUuYm9keSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIG9DbG9uZS5ib2R5ID0gJCh0aGlzLmRvbS5ib2R5KS5jbG9uZSh0cnVlKVswXTtcbiAgICAgIG9DbG9uZS5ib2R5LmNsYXNzTmFtZSArPSBcIiBEVEZDX0Nsb25lZFwiO1xuICAgICAgb0Nsb25lLmJvZHkuc3R5bGUucGFkZGluZ0JvdHRvbSA9IGR0Lm9TY3JvbGwuaUJhcldpZHRoICsgXCJweFwiO1xuICAgICAgb0Nsb25lLmJvZHkuc3R5bGUubWFyZ2luQm90dG9tID0gZHQub1Njcm9sbC5pQmFyV2lkdGggKiAyICsgXCJweFwiO1xuXG4gICAgICBpZiAob0Nsb25lLmJvZHkuZ2V0QXR0cmlidXRlKCdpZCcpICE9PSBudWxsKSB7XG4gICAgICAgIG9DbG9uZS5ib2R5LnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgIH1cblxuICAgICAgJCgnPnRoZWFkPnRyJywgb0Nsb25lLmJvZHkpLmVtcHR5KCk7XG4gICAgICAkKCc+dGZvb3QnLCBvQ2xvbmUuYm9keSkucmVtb3ZlKCk7XG4gICAgICB2YXIgbkJvZHkgPSAkKCd0Ym9keScsIG9DbG9uZS5ib2R5KVswXTtcbiAgICAgICQobkJvZHkpLmVtcHR5KCk7XG5cbiAgICAgIGlmIChkdC5haURpc3BsYXkubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgbklubmVyVGhlYWQgPSAkKCc+dGhlYWQ+dHInLCBvQ2xvbmUuYm9keSlbMF07XG5cbiAgICAgICAgZm9yIChpSW5kZXggPSAwOyBpSW5kZXggPCBhaUNvbHVtbnMubGVuZ3RoOyBpSW5kZXgrKykge1xuICAgICAgICAgIGlDb2x1bW4gPSBhaUNvbHVtbnNbaUluZGV4XTtcbiAgICAgICAgICBuQ2xvbmUgPSAkKGR0LmFvQ29sdW1uc1tpQ29sdW1uXS5uVGgpLmNsb25lKHRydWUpWzBdO1xuICAgICAgICAgIG5DbG9uZS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgIHZhciBvU3R5bGUgPSBuQ2xvbmUuc3R5bGU7XG4gICAgICAgICAgb1N0eWxlLnBhZGRpbmdUb3AgPSBcIjBcIjtcbiAgICAgICAgICBvU3R5bGUucGFkZGluZ0JvdHRvbSA9IFwiMFwiO1xuICAgICAgICAgIG9TdHlsZS5ib3JkZXJUb3BXaWR0aCA9IFwiMFwiO1xuICAgICAgICAgIG9TdHlsZS5ib3JkZXJCb3R0b21XaWR0aCA9IFwiMFwiO1xuICAgICAgICAgIG9TdHlsZS5oZWlnaHQgPSAwO1xuICAgICAgICAgIG9TdHlsZS53aWR0aCA9IHRoYXQucy5haUlubmVyV2lkdGhzW2lDb2x1bW5dICsgXCJweFwiO1xuICAgICAgICAgIG5Jbm5lclRoZWFkLmFwcGVuZENoaWxkKG5DbG9uZSk7XG4gICAgICAgIH1cblxuICAgICAgICAkKCc+dGJvZHk+dHInLCB0aGF0LmRvbS5ib2R5KS5lYWNoKGZ1bmN0aW9uICh6KSB7XG4gICAgICAgICAgdmFyIGkgPSB0aGF0LnMuZHQub0ZlYXR1cmVzLmJTZXJ2ZXJTaWRlID09PSBmYWxzZSA/IHRoYXQucy5kdC5haURpc3BsYXlbdGhhdC5zLmR0Ll9pRGlzcGxheVN0YXJ0ICsgel0gOiB6O1xuICAgICAgICAgIHZhciBhVGRzID0gdGhhdC5zLmR0LmFvRGF0YVtpXS5hbkNlbGxzIHx8ICQodGhpcykuY2hpbGRyZW4oJ3RkLCB0aCcpO1xuICAgICAgICAgIHZhciBuID0gdGhpcy5jbG9uZU5vZGUoZmFsc2UpO1xuICAgICAgICAgIG4ucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuICAgICAgICAgIG4uc2V0QXR0cmlidXRlKCdkYXRhLWR0LXJvdycsIGkpO1xuXG4gICAgICAgICAgZm9yIChpSW5kZXggPSAwOyBpSW5kZXggPCBhaUNvbHVtbnMubGVuZ3RoOyBpSW5kZXgrKykge1xuICAgICAgICAgICAgaUNvbHVtbiA9IGFpQ29sdW1uc1tpSW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAoYVRkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIG5DbG9uZSA9ICQoYVRkc1tpQ29sdW1uXSkuY2xvbmUodHJ1ZSwgdHJ1ZSlbMF07XG4gICAgICAgICAgICAgIG5DbG9uZS5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgICAgICAgIG5DbG9uZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZHQtcm93JywgaSk7XG4gICAgICAgICAgICAgIG5DbG9uZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZHQtY29sdW1uJywgaUNvbHVtbik7XG4gICAgICAgICAgICAgIG4uYXBwZW5kQ2hpbGQobkNsb25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuQm9keS5hcHBlbmRDaGlsZChuKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCc+dGJvZHk+dHInLCB0aGF0LmRvbS5ib2R5KS5lYWNoKGZ1bmN0aW9uICh6KSB7XG4gICAgICAgICAgbkNsb25lID0gdGhpcy5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgbkNsb25lLmNsYXNzTmFtZSArPSAnIERURkNfTm9EYXRhJztcbiAgICAgICAgICAkKCd0ZCcsIG5DbG9uZSkuaHRtbCgnJyk7XG4gICAgICAgICAgbkJvZHkuYXBwZW5kQ2hpbGQobkNsb25lKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIG9DbG9uZS5ib2R5LnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICBvQ2xvbmUuYm9keS5zdHlsZS5tYXJnaW4gPSBcIjBcIjtcbiAgICAgIG9DbG9uZS5ib2R5LnN0eWxlLnBhZGRpbmcgPSBcIjBcIjtcblxuICAgICAgaWYgKGR0Lm9TY3JvbGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciBzY3JvbGxlckZvcmNlciA9IGR0Lm9TY3JvbGxlci5kb20uZm9yY2U7XG5cbiAgICAgICAgaWYgKCFvR3JpZC5mb3JjZXIpIHtcbiAgICAgICAgICBvR3JpZC5mb3JjZXIgPSBzY3JvbGxlckZvcmNlci5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgb0dyaWQubGluZXIuYXBwZW5kQ2hpbGQob0dyaWQuZm9yY2VyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvR3JpZC5mb3JjZXIuc3R5bGUuaGVpZ2h0ID0gc2Nyb2xsZXJGb3JjZXIuc3R5bGUuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG9HcmlkLmxpbmVyLmFwcGVuZENoaWxkKG9DbG9uZS5ib2R5KTtcblxuICAgICAgdGhpcy5fZm5FcXVhbGlzZUhlaWdodHMoJ3Rib2R5JywgdGhhdC5kb20uYm9keSwgb0Nsb25lLmJvZHkpO1xuXG4gICAgICBpZiAoZHQublRGb290ICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChiQWxsKSB7XG4gICAgICAgICAgaWYgKG9DbG9uZS5mb290ZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIG9DbG9uZS5mb290ZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvQ2xvbmUuZm9vdGVyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvQ2xvbmUuZm9vdGVyID0gJCh0aGlzLmRvbS5mb290ZXIpLmNsb25lKHRydWUsIHRydWUpWzBdO1xuICAgICAgICAgIG9DbG9uZS5mb290ZXIuY2xhc3NOYW1lICs9IFwiIERURkNfQ2xvbmVkXCI7XG4gICAgICAgICAgb0Nsb25lLmZvb3Rlci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICAgIG9HcmlkLmZvb3QuYXBwZW5kQ2hpbGQob0Nsb25lLmZvb3Rlcik7XG4gICAgICAgICAgYW9DbG9uZUxheW91dCA9IHRoaXMuX2ZuQ29weUxheW91dChkdC5hb0Zvb3RlciwgYWlDb2x1bW5zLCB0cnVlKTtcbiAgICAgICAgICB2YXIganFDbG9uZVRmb290ID0gJCgnPnRmb290Jywgb0Nsb25lLmZvb3Rlcik7XG4gICAgICAgICAganFDbG9uZVRmb290LmVtcHR5KCk7XG5cbiAgICAgICAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW9DbG9uZUxheW91dC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgICAgIGpxQ2xvbmVUZm9vdFswXS5hcHBlbmRDaGlsZChhb0Nsb25lTGF5b3V0W2ldLm5Ucik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZHQub0FwaS5fZm5EcmF3SGVhZChkdCwgYW9DbG9uZUxheW91dCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYW9DbG9uZUxheW91dCA9IHRoaXMuX2ZuQ29weUxheW91dChkdC5hb0Zvb3RlciwgYWlDb2x1bW5zLCBmYWxzZSk7XG4gICAgICAgICAgdmFyIGFvQ3VyckZvb3RlciA9IFtdO1xuXG4gICAgICAgICAgZHQub0FwaS5fZm5EZXRlY3RIZWFkZXIoYW9DdXJyRm9vdGVyLCAkKCc+dGZvb3QnLCBvQ2xvbmUuZm9vdGVyKVswXSk7XG5cbiAgICAgICAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW9DbG9uZUxheW91dC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpMZW4gPSBhb0Nsb25lTGF5b3V0W2ldLmxlbmd0aDsgaiA8IGpMZW47IGorKykge1xuICAgICAgICAgICAgICBhb0N1cnJGb290ZXJbaV1bal0uY2VsbC5jbGFzc05hbWUgPSBhb0Nsb25lTGF5b3V0W2ldW2pdLmNlbGwuY2xhc3NOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2ZuRXF1YWxpc2VIZWlnaHRzKCd0Zm9vdCcsIHRoaXMuZG9tLmZvb3Rlciwgb0Nsb25lLmZvb3Rlcik7XG4gICAgICB9XG5cbiAgICAgIHZhciBhblVuaXF1ZSA9IGR0Lm9BcGkuX2ZuR2V0VW5pcXVlVGhzKGR0LCAkKCc+dGhlYWQnLCBvQ2xvbmUuaGVhZGVyKVswXSk7XG5cbiAgICAgICQoYW5VbmlxdWUpLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgaUNvbHVtbiA9IGFpQ29sdW1uc1tpXTtcbiAgICAgICAgdGhpcy5zdHlsZS53aWR0aCA9IHRoYXQucy5haUlubmVyV2lkdGhzW2lDb2x1bW5dICsgXCJweFwiO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGF0LnMuZHQublRGb290ICE9PSBudWxsKSB7XG4gICAgICAgIGFuVW5pcXVlID0gZHQub0FwaS5fZm5HZXRVbmlxdWVUaHMoZHQsICQoJz50Zm9vdCcsIG9DbG9uZS5mb290ZXIpWzBdKTtcbiAgICAgICAgJChhblVuaXF1ZSkuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAgIGlDb2x1bW4gPSBhaUNvbHVtbnNbaV07XG4gICAgICAgICAgdGhpcy5zdHlsZS53aWR0aCA9IHRoYXQucy5haUlubmVyV2lkdGhzW2lDb2x1bW5dICsgXCJweFwiO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiX2ZuR2V0VHJOb2Rlc1wiOiBmdW5jdGlvbiBfZm5HZXRUck5vZGVzKG5Jbikge1xuICAgICAgdmFyIGFPdXQgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSBuSW4uY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgaWYgKG5Jbi5jaGlsZE5vZGVzW2ldLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT0gXCJUUlwiKSB7XG4gICAgICAgICAgYU91dC5wdXNoKG5Jbi5jaGlsZE5vZGVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYU91dDtcbiAgICB9LFxuICAgIFwiX2ZuRXF1YWxpc2VIZWlnaHRzXCI6IGZ1bmN0aW9uIF9mbkVxdWFsaXNlSGVpZ2h0cyhub2RlTmFtZSwgb3JpZ2luYWwsIGNsb25lKSB7XG4gICAgICBpZiAodGhpcy5zLnNIZWlnaHRNYXRjaCA9PSAnbm9uZScgJiYgbm9kZU5hbWUgIT09ICd0aGVhZCcgJiYgbm9kZU5hbWUgIT09ICd0Zm9vdCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgaSxcbiAgICAgICAgICBpTGVuLFxuICAgICAgICAgIGlIZWlnaHQsXG4gICAgICAgICAgaUhlaWdodDIsXG4gICAgICAgICAgaUhlaWdodE9yaWdpbmFsLFxuICAgICAgICAgIGlIZWlnaHRDbG9uZSxcbiAgICAgICAgICByb290T3JpZ2luYWwgPSBvcmlnaW5hbC5nZXRFbGVtZW50c0J5VGFnTmFtZShub2RlTmFtZSlbMF0sXG4gICAgICAgICAgcm9vdENsb25lID0gY2xvbmUuZ2V0RWxlbWVudHNCeVRhZ05hbWUobm9kZU5hbWUpWzBdLFxuICAgICAgICAgIGpxQm94SGFjayA9ICQoJz4nICsgbm9kZU5hbWUgKyAnPnRyOmVxKDApJywgb3JpZ2luYWwpLmNoaWxkcmVuKCc6Zmlyc3QnKSxcbiAgICAgICAgICBpQm94SGFjayA9IGpxQm94SGFjay5vdXRlckhlaWdodCgpIC0ganFCb3hIYWNrLmhlaWdodCgpLFxuICAgICAgICAgIGFuT3JpZ2luYWwgPSB0aGlzLl9mbkdldFRyTm9kZXMocm9vdE9yaWdpbmFsKSxcbiAgICAgICAgICBhbkNsb25lID0gdGhpcy5fZm5HZXRUck5vZGVzKHJvb3RDbG9uZSksXG4gICAgICAgICAgaGVpZ2h0cyA9IFtdO1xuXG4gICAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW5DbG9uZS5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgaUhlaWdodE9yaWdpbmFsID0gYW5PcmlnaW5hbFtpXS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGlIZWlnaHRDbG9uZSA9IGFuQ2xvbmVbaV0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBpSGVpZ2h0ID0gaUhlaWdodENsb25lID4gaUhlaWdodE9yaWdpbmFsID8gaUhlaWdodENsb25lIDogaUhlaWdodE9yaWdpbmFsO1xuXG4gICAgICAgIGlmICh0aGlzLnMuc0hlaWdodE1hdGNoID09ICdzZW1pYXV0bycpIHtcbiAgICAgICAgICBhbk9yaWdpbmFsW2ldLl9EVFRDX2lIZWlnaHQgPSBpSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgaGVpZ2h0cy5wdXNoKGlIZWlnaHQpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW5DbG9uZS5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgYW5DbG9uZVtpXS5zdHlsZS5oZWlnaHQgPSBoZWlnaHRzW2ldICsgXCJweFwiO1xuICAgICAgICBhbk9yaWdpbmFsW2ldLnN0eWxlLmhlaWdodCA9IGhlaWdodHNbaV0gKyBcInB4XCI7XG4gICAgICB9XG4gICAgfSxcbiAgICBfZmlyZWZveFNjcm9sbEVycm9yOiBmdW5jdGlvbiBfZmlyZWZveFNjcm9sbEVycm9yKCkge1xuICAgICAgaWYgKF9maXJlZm94U2Nyb2xsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIHRlc3QgPSAkKCc8ZGl2Lz4nKS5jc3Moe1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIGhlaWdodDogMTAsXG4gICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgIG92ZXJmbG93OiAnc2Nyb2xsJ1xuICAgICAgICB9KS5hcHBlbmRUbygnYm9keScpO1xuICAgICAgICBfZmlyZWZveFNjcm9sbCA9IHRlc3RbMF0uY2xpZW50V2lkdGggPT09IHRlc3RbMF0ub2Zmc2V0V2lkdGggJiYgdGhpcy5fZm5EVE92ZXJmbG93KCkuYmFyICE9PSAwO1xuICAgICAgICB0ZXN0LnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX2ZpcmVmb3hTY3JvbGw7XG4gICAgfVxuICB9KTtcbiAgRml4ZWRDb2x1bW5zLmRlZmF1bHRzID0ge1xuICAgIFwiaUxlZnRDb2x1bW5zXCI6IDEsXG4gICAgXCJpUmlnaHRDb2x1bW5zXCI6IDAsXG4gICAgXCJmbkRyYXdDYWxsYmFja1wiOiBudWxsLFxuICAgIFwic0hlaWdodE1hdGNoXCI6IFwic2VtaWF1dG9cIlxuICB9O1xuICBGaXhlZENvbHVtbnMudmVyc2lvbiA9IFwiMy4yLjVcIjtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRDb2x1bW5zKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuICBEYXRhVGFibGUuQXBpLnJlZ2lzdGVyKCdmaXhlZENvbHVtbnMoKS51cGRhdGUoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICBpZiAoY3R4Ll9vRml4ZWRDb2x1bW5zKSB7XG4gICAgICAgIGN0eC5fb0ZpeGVkQ29sdW1ucy5mblVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRDb2x1bW5zKCkucmVsYXlvdXQoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICBpZiAoY3R4Ll9vRml4ZWRDb2x1bW5zKSB7XG4gICAgICAgIGN0eC5fb0ZpeGVkQ29sdW1ucy5mblJlZHJhd0xheW91dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3Rlcigncm93cygpLnJlY2FsY0hlaWdodCgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdyb3cnLCBmdW5jdGlvbiAoY3R4LCBpZHgpIHtcbiAgICAgIGlmIChjdHguX29GaXhlZENvbHVtbnMpIHtcbiAgICAgICAgY3R4Ll9vRml4ZWRDb2x1bW5zLmZuUmVjYWxjdWxhdGVIZWlnaHQodGhpcy5yb3coaWR4KS5ub2RlKCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRDb2x1bW5zKCkucm93SW5kZXgoKScsIGZ1bmN0aW9uIChyb3cpIHtcbiAgICByb3cgPSAkKHJvdyk7XG4gICAgcmV0dXJuIHJvdy5wYXJlbnRzKCcuRFRGQ19DbG9uZWQnKS5sZW5ndGggPyB0aGlzLnJvd3Moe1xuICAgICAgcGFnZTogJ2N1cnJlbnQnXG4gICAgfSkuaW5kZXhlcygpW3Jvdy5pbmRleCgpXSA6IHRoaXMucm93KHJvdykuaW5kZXgoKTtcbiAgfSk7XG4gIERhdGFUYWJsZS5BcGkucmVnaXN0ZXIoJ2ZpeGVkQ29sdW1ucygpLmNlbGxJbmRleCgpJywgZnVuY3Rpb24gKGNlbGwpIHtcbiAgICBjZWxsID0gJChjZWxsKTtcblxuICAgIGlmIChjZWxsLnBhcmVudHMoJy5EVEZDX0Nsb25lZCcpLmxlbmd0aCkge1xuICAgICAgdmFyIHJvd0Nsb25lZElkeCA9IGNlbGwucGFyZW50KCkuaW5kZXgoKTtcbiAgICAgIHZhciByb3dJZHggPSB0aGlzLnJvd3Moe1xuICAgICAgICBwYWdlOiAnY3VycmVudCdcbiAgICAgIH0pLmluZGV4ZXMoKVtyb3dDbG9uZWRJZHhdO1xuICAgICAgdmFyIGNvbHVtbklkeDtcblxuICAgICAgaWYgKGNlbGwucGFyZW50cygnLkRURkNfTGVmdFdyYXBwZXInKS5sZW5ndGgpIHtcbiAgICAgICAgY29sdW1uSWR4ID0gY2VsbC5pbmRleCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGNvbHVtbnMgPSB0aGlzLmNvbHVtbnMoKS5mbGF0dGVuKCkubGVuZ3RoO1xuICAgICAgICBjb2x1bW5JZHggPSBjb2x1bW5zIC0gdGhpcy5jb250ZXh0WzBdLl9vRml4ZWRDb2x1bW5zLnMuaVJpZ2h0Q29sdW1ucyArIGNlbGwuaW5kZXgoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcm93OiByb3dJZHgsXG4gICAgICAgIGNvbHVtbjogdGhpcy5jb2x1bW4uaW5kZXgoJ3RvRGF0YScsIGNvbHVtbklkeCksXG4gICAgICAgIGNvbHVtblZpc2libGU6IGNvbHVtbklkeFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY2VsbChjZWxsKS5pbmRleCgpO1xuICAgIH1cbiAgfSk7XG4gICQoZG9jdW1lbnQpLm9uKCdpbml0LmR0LmZpeGVkQ29sdW1ucycsIGZ1bmN0aW9uIChlLCBzZXR0aW5ncykge1xuICAgIGlmIChlLm5hbWVzcGFjZSAhPT0gJ2R0Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBpbml0ID0gc2V0dGluZ3Mub0luaXQuZml4ZWRDb2x1bW5zO1xuICAgIHZhciBkZWZhdWx0cyA9IERhdGFUYWJsZS5kZWZhdWx0cy5maXhlZENvbHVtbnM7XG5cbiAgICBpZiAoaW5pdCB8fCBkZWZhdWx0cykge1xuICAgICAgdmFyIG9wdHMgPSAkLmV4dGVuZCh7fSwgaW5pdCwgZGVmYXVsdHMpO1xuXG4gICAgICBpZiAoaW5pdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgbmV3IEZpeGVkQ29sdW1ucyhzZXR0aW5ncywgb3B0cyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgJC5mbi5kYXRhVGFibGUuRml4ZWRDb2x1bW5zID0gRml4ZWRDb2x1bW5zO1xuICAkLmZuLkRhdGFUYWJsZS5GaXhlZENvbHVtbnMgPSBGaXhlZENvbHVtbnM7XG4gIHJldHVybiBGaXhlZENvbHVtbnM7XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydqcXVlcnknLCAnZGF0YXRhYmxlcy5uZXQnXSwgZnVuY3Rpb24gKCQpIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KCQsIHdpbmRvdywgZG9jdW1lbnQpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCh0eXBlb2YgZXhwb3J0cyA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKGV4cG9ydHMpKSA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb290LCAkKSB7XG4gICAgICBpZiAoIXJvb3QpIHtcbiAgICAgICAgcm9vdCA9IHdpbmRvdztcbiAgICAgIH1cblxuICAgICAgaWYgKCEkIHx8ICEkLmZuLmRhdGFUYWJsZSkge1xuICAgICAgICAkID0gcmVxdWlyZSgnZGF0YXRhYmxlcy5uZXQnKShyb290LCAkKS4kO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFjdG9yeSgkLCByb290LCByb290LmRvY3VtZW50KTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGZhY3RvcnkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcbiAgfVxufSkoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIERhdGFUYWJsZSA9ICQuZm4uZGF0YVRhYmxlO1xuICB2YXIgX2luc3RDb3VudGVyID0gMDtcblxuICB2YXIgRml4ZWRIZWFkZXIgPSBmdW5jdGlvbiBGaXhlZEhlYWRlcihkdCwgY29uZmlnKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEZpeGVkSGVhZGVyKSkge1xuICAgICAgdGhyb3cgXCJGaXhlZEhlYWRlciBtdXN0IGJlIGluaXRpYWxpc2VkIHdpdGggdGhlICduZXcnIGtleXdvcmQuXCI7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZyA9PT0gdHJ1ZSkge1xuICAgICAgY29uZmlnID0ge307XG4gICAgfVxuXG4gICAgZHQgPSBuZXcgRGF0YVRhYmxlLkFwaShkdCk7XG4gICAgdGhpcy5jID0gJC5leHRlbmQodHJ1ZSwge30sIEZpeGVkSGVhZGVyLmRlZmF1bHRzLCBjb25maWcpO1xuICAgIHRoaXMucyA9IHtcbiAgICAgIGR0OiBkdCxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHRoZWFkVG9wOiAwLFxuICAgICAgICB0Ym9keVRvcDogMCxcbiAgICAgICAgdGZvb3RUb3A6IDAsXG4gICAgICAgIHRmb290Qm90dG9tOiAwLFxuICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdGZvb3RIZWlnaHQ6IDAsXG4gICAgICAgIHRoZWFkSGVpZ2h0OiAwLFxuICAgICAgICB3aW5kb3dIZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSxcbiAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGhlYWRlck1vZGU6IG51bGwsXG4gICAgICBmb290ZXJNb2RlOiBudWxsLFxuICAgICAgYXV0b1dpZHRoOiBkdC5zZXR0aW5ncygpWzBdLm9GZWF0dXJlcy5iQXV0b1dpZHRoLFxuICAgICAgbmFtZXNwYWNlOiAnLmR0ZmMnICsgX2luc3RDb3VudGVyKyssXG4gICAgICBzY3JvbGxMZWZ0OiB7XG4gICAgICAgIGhlYWRlcjogLTEsXG4gICAgICAgIGZvb3RlcjogLTFcbiAgICAgIH0sXG4gICAgICBlbmFibGU6IHRydWVcbiAgICB9O1xuICAgIHRoaXMuZG9tID0ge1xuICAgICAgZmxvYXRpbmdIZWFkZXI6IG51bGwsXG4gICAgICB0aGVhZDogJChkdC50YWJsZSgpLmhlYWRlcigpKSxcbiAgICAgIHRib2R5OiAkKGR0LnRhYmxlKCkuYm9keSgpKSxcbiAgICAgIHRmb290OiAkKGR0LnRhYmxlKCkuZm9vdGVyKCkpLFxuICAgICAgaGVhZGVyOiB7XG4gICAgICAgIGhvc3Q6IG51bGwsXG4gICAgICAgIGZsb2F0aW5nOiBudWxsLFxuICAgICAgICBwbGFjZWhvbGRlcjogbnVsbFxuICAgICAgfSxcbiAgICAgIGZvb3Rlcjoge1xuICAgICAgICBob3N0OiBudWxsLFxuICAgICAgICBmbG9hdGluZzogbnVsbCxcbiAgICAgICAgcGxhY2Vob2xkZXI6IG51bGxcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuZG9tLmhlYWRlci5ob3N0ID0gdGhpcy5kb20udGhlYWQucGFyZW50KCk7XG4gICAgdGhpcy5kb20uZm9vdGVyLmhvc3QgPSB0aGlzLmRvbS50Zm9vdC5wYXJlbnQoKTtcbiAgICB2YXIgZHRTZXR0aW5ncyA9IGR0LnNldHRpbmdzKClbMF07XG5cbiAgICBpZiAoZHRTZXR0aW5ncy5fZml4ZWRIZWFkZXIpIHtcbiAgICAgIHRocm93IFwiRml4ZWRIZWFkZXIgYWxyZWFkeSBpbml0aWFsaXNlZCBvbiB0YWJsZSBcIiArIGR0U2V0dGluZ3MublRhYmxlLmlkO1xuICAgIH1cblxuICAgIGR0U2V0dGluZ3MuX2ZpeGVkSGVhZGVyID0gdGhpcztcblxuICAgIHRoaXMuX2NvbnN0cnVjdG9yKCk7XG4gIH07XG5cbiAgJC5leHRlbmQoRml4ZWRIZWFkZXIucHJvdG90eXBlLCB7XG4gICAgZW5hYmxlOiBmdW5jdGlvbiBlbmFibGUoX2VuYWJsZSkge1xuICAgICAgdGhpcy5zLmVuYWJsZSA9IF9lbmFibGU7XG5cbiAgICAgIGlmICh0aGlzLmMuaGVhZGVyKSB7XG4gICAgICAgIHRoaXMuX21vZGVDaGFuZ2UoJ2luLXBsYWNlJywgJ2hlYWRlcicsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jLmZvb3RlciAmJiB0aGlzLmRvbS50Zm9vdC5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fbW9kZUNoYW5nZSgnaW4tcGxhY2UnLCAnZm9vdGVyJywgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfSxcbiAgICBoZWFkZXJPZmZzZXQ6IGZ1bmN0aW9uIGhlYWRlck9mZnNldChvZmZzZXQpIHtcbiAgICAgIGlmIChvZmZzZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmMuaGVhZGVyT2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jLmhlYWRlck9mZnNldDtcbiAgICB9LFxuICAgIGZvb3Rlck9mZnNldDogZnVuY3Rpb24gZm9vdGVyT2Zmc2V0KG9mZnNldCkge1xuICAgICAgaWYgKG9mZnNldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuYy5mb290ZXJPZmZzZXQgPSBvZmZzZXQ7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmMuZm9vdGVyT2Zmc2V0O1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbnMoKTtcblxuICAgICAgdGhpcy5fc2Nyb2xsKHRydWUpO1xuICAgIH0sXG4gICAgX2NvbnN0cnVjdG9yOiBmdW5jdGlvbiBfY29uc3RydWN0b3IoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICB2YXIgZHQgPSB0aGlzLnMuZHQ7XG4gICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcgKyB0aGlzLnMubmFtZXNwYWNlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQuX3Njcm9sbCgpO1xuICAgICAgfSkub24oJ3Jlc2l6ZScgKyB0aGlzLnMubmFtZXNwYWNlLCBEYXRhVGFibGUudXRpbC50aHJvdHRsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQucy5wb3NpdGlvbi53aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgICAgIHRoYXQudXBkYXRlKCk7XG4gICAgICB9LCA1MCkpO1xuICAgICAgdmFyIGF1dG9IZWFkZXIgPSAkKCcuZmgtZml4ZWRIZWFkZXInKTtcblxuICAgICAgaWYgKCF0aGlzLmMuaGVhZGVyT2Zmc2V0ICYmIGF1dG9IZWFkZXIubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuYy5oZWFkZXJPZmZzZXQgPSBhdXRvSGVhZGVyLm91dGVySGVpZ2h0KCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBhdXRvRm9vdGVyID0gJCgnLmZoLWZpeGVkRm9vdGVyJyk7XG5cbiAgICAgIGlmICghdGhpcy5jLmZvb3Rlck9mZnNldCAmJiBhdXRvRm9vdGVyLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmMuZm9vdGVyT2Zmc2V0ID0gYXV0b0Zvb3Rlci5vdXRlckhlaWdodCgpO1xuICAgICAgfVxuXG4gICAgICBkdC5vbignY29sdW1uLXJlb3JkZXIuZHQuZHRmYyBjb2x1bW4tdmlzaWJpbGl0eS5kdC5kdGZjIGRyYXcuZHQuZHRmYyBjb2x1bW4tc2l6aW5nLmR0LmR0ZmMgcmVzcG9uc2l2ZS1kaXNwbGF5LmR0LmR0ZmMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQudXBkYXRlKCk7XG4gICAgICB9KTtcbiAgICAgIGR0Lm9uKCdkZXN0cm95LmR0ZmMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGF0LmMuaGVhZGVyKSB7XG4gICAgICAgICAgdGhhdC5fbW9kZUNoYW5nZSgnaW4tcGxhY2UnLCAnaGVhZGVyJywgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhhdC5jLmZvb3RlciAmJiB0aGF0LmRvbS50Zm9vdC5sZW5ndGgpIHtcbiAgICAgICAgICB0aGF0Ll9tb2RlQ2hhbmdlKCdpbi1wbGFjZScsICdmb290ZXInLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGR0Lm9mZignLmR0ZmMnKTtcbiAgICAgICAgJCh3aW5kb3cpLm9mZih0aGF0LnMubmFtZXNwYWNlKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9wb3NpdGlvbnMoKTtcblxuICAgICAgdGhpcy5fc2Nyb2xsKCk7XG4gICAgfSxcbiAgICBfY2xvbmU6IGZ1bmN0aW9uIF9jbG9uZShpdGVtLCBmb3JjZSkge1xuICAgICAgdmFyIGR0ID0gdGhpcy5zLmR0O1xuICAgICAgdmFyIGl0ZW1Eb20gPSB0aGlzLmRvbVtpdGVtXTtcbiAgICAgIHZhciBpdGVtRWxlbWVudCA9IGl0ZW0gPT09ICdoZWFkZXInID8gdGhpcy5kb20udGhlYWQgOiB0aGlzLmRvbS50Zm9vdDtcblxuICAgICAgaWYgKCFmb3JjZSAmJiBpdGVtRG9tLmZsb2F0aW5nKSB7XG4gICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcucmVtb3ZlQ2xhc3MoJ2ZpeGVkSGVhZGVyLWZsb2F0aW5nIGZpeGVkSGVhZGVyLWxvY2tlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGl0ZW1Eb20uZmxvYXRpbmcpIHtcbiAgICAgICAgICBpdGVtRG9tLnBsYWNlaG9sZGVyLnJlbW92ZSgpO1xuXG4gICAgICAgICAgdGhpcy5fdW5zaXplKGl0ZW0pO1xuXG4gICAgICAgICAgaXRlbURvbS5mbG9hdGluZy5jaGlsZHJlbigpLmRldGFjaCgpO1xuICAgICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpdGVtRG9tLmZsb2F0aW5nID0gJChkdC50YWJsZSgpLm5vZGUoKS5jbG9uZU5vZGUoZmFsc2UpKS5jc3MoJ3RhYmxlLWxheW91dCcsICdmaXhlZCcpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKS5yZW1vdmVBdHRyKCdpZCcpLmFwcGVuZChpdGVtRWxlbWVudCkuYXBwZW5kVG8oJ2JvZHknKTtcbiAgICAgICAgaXRlbURvbS5wbGFjZWhvbGRlciA9IGl0ZW1FbGVtZW50LmNsb25lKGZhbHNlKTtcbiAgICAgICAgaXRlbURvbS5wbGFjZWhvbGRlci5maW5kKCcqW2lkXScpLnJlbW92ZUF0dHIoJ2lkJyk7XG4gICAgICAgIGl0ZW1Eb20uaG9zdC5wcmVwZW5kKGl0ZW1Eb20ucGxhY2Vob2xkZXIpO1xuXG4gICAgICAgIHRoaXMuX21hdGNoV2lkdGhzKGl0ZW1Eb20ucGxhY2Vob2xkZXIsIGl0ZW1Eb20uZmxvYXRpbmcpO1xuICAgICAgfVxuICAgIH0sXG4gICAgX21hdGNoV2lkdGhzOiBmdW5jdGlvbiBfbWF0Y2hXaWR0aHMoZnJvbSwgdG8pIHtcbiAgICAgIHZhciBnZXQgPSBmdW5jdGlvbiBnZXQobmFtZSkge1xuICAgICAgICByZXR1cm4gJChuYW1lLCBmcm9tKS5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAkKHRoaXMpLndpZHRoKCk7XG4gICAgICAgIH0pLnRvQXJyYXkoKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBzZXQgPSBmdW5jdGlvbiBzZXQobmFtZSwgdG9XaWR0aHMpIHtcbiAgICAgICAgJChuYW1lLCB0bykuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICQodGhpcykuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0b1dpZHRoc1tpXSxcbiAgICAgICAgICAgIG1pbldpZHRoOiB0b1dpZHRoc1tpXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHZhciB0aFdpZHRocyA9IGdldCgndGgnKTtcbiAgICAgIHZhciB0ZFdpZHRocyA9IGdldCgndGQnKTtcbiAgICAgIHNldCgndGgnLCB0aFdpZHRocyk7XG4gICAgICBzZXQoJ3RkJywgdGRXaWR0aHMpO1xuICAgIH0sXG4gICAgX3Vuc2l6ZTogZnVuY3Rpb24gX3Vuc2l6ZShpdGVtKSB7XG4gICAgICB2YXIgZWwgPSB0aGlzLmRvbVtpdGVtXS5mbG9hdGluZztcblxuICAgICAgaWYgKGVsICYmIChpdGVtID09PSAnZm9vdGVyJyB8fCBpdGVtID09PSAnaGVhZGVyJyAmJiAhdGhpcy5zLmF1dG9XaWR0aCkpIHtcbiAgICAgICAgJCgndGgsIHRkJywgZWwpLmNzcyh7XG4gICAgICAgICAgd2lkdGg6ICcnLFxuICAgICAgICAgIG1pbldpZHRoOiAnJ1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoZWwgJiYgaXRlbSA9PT0gJ2hlYWRlcicpIHtcbiAgICAgICAgJCgndGgsIHRkJywgZWwpLmNzcygnbWluLXdpZHRoJywgJycpO1xuICAgICAgfVxuICAgIH0sXG4gICAgX2hvcml6b250YWw6IGZ1bmN0aW9uIF9ob3Jpem9udGFsKGl0ZW0sIHNjcm9sbExlZnQpIHtcbiAgICAgIHZhciBpdGVtRG9tID0gdGhpcy5kb21baXRlbV07XG4gICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLnMucG9zaXRpb247XG4gICAgICB2YXIgbGFzdFNjcm9sbExlZnQgPSB0aGlzLnMuc2Nyb2xsTGVmdDtcblxuICAgICAgaWYgKGl0ZW1Eb20uZmxvYXRpbmcgJiYgbGFzdFNjcm9sbExlZnRbaXRlbV0gIT09IHNjcm9sbExlZnQpIHtcbiAgICAgICAgaXRlbURvbS5mbG9hdGluZy5jc3MoJ2xlZnQnLCBwb3NpdGlvbi5sZWZ0IC0gc2Nyb2xsTGVmdCk7XG4gICAgICAgIGxhc3RTY3JvbGxMZWZ0W2l0ZW1dID0gc2Nyb2xsTGVmdDtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9tb2RlQ2hhbmdlOiBmdW5jdGlvbiBfbW9kZUNoYW5nZShtb2RlLCBpdGVtLCBmb3JjZUNoYW5nZSkge1xuICAgICAgdmFyIGR0ID0gdGhpcy5zLmR0O1xuICAgICAgdmFyIGl0ZW1Eb20gPSB0aGlzLmRvbVtpdGVtXTtcbiAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMucy5wb3NpdGlvbjtcbiAgICAgIHZhciB0YWJsZVBhcnQgPSB0aGlzLmRvbVtpdGVtID09PSAnZm9vdGVyJyA/ICd0Zm9vdCcgOiAndGhlYWQnXTtcbiAgICAgIHZhciBmb2N1cyA9ICQuY29udGFpbnModGFibGVQYXJ0WzBdLCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSA/IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgOiBudWxsO1xuXG4gICAgICBpZiAoZm9jdXMpIHtcbiAgICAgICAgZm9jdXMuYmx1cigpO1xuICAgICAgfVxuXG4gICAgICBpZiAobW9kZSA9PT0gJ2luLXBsYWNlJykge1xuICAgICAgICBpZiAoaXRlbURvbS5wbGFjZWhvbGRlcikge1xuICAgICAgICAgIGl0ZW1Eb20ucGxhY2Vob2xkZXIucmVtb3ZlKCk7XG4gICAgICAgICAgaXRlbURvbS5wbGFjZWhvbGRlciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91bnNpemUoaXRlbSk7XG5cbiAgICAgICAgaWYgKGl0ZW0gPT09ICdoZWFkZXInKSB7XG4gICAgICAgICAgaXRlbURvbS5ob3N0LnByZXBlbmQodGFibGVQYXJ0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtRG9tLmhvc3QuYXBwZW5kKHRhYmxlUGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbURvbS5mbG9hdGluZykge1xuICAgICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcucmVtb3ZlKCk7XG4gICAgICAgICAgaXRlbURvbS5mbG9hdGluZyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ2luJykge1xuICAgICAgICB0aGlzLl9jbG9uZShpdGVtLCBmb3JjZUNoYW5nZSk7XG5cbiAgICAgICAgaXRlbURvbS5mbG9hdGluZy5hZGRDbGFzcygnZml4ZWRIZWFkZXItZmxvYXRpbmcnKS5jc3MoaXRlbSA9PT0gJ2hlYWRlcicgPyAndG9wJyA6ICdib3R0b20nLCB0aGlzLmNbaXRlbSArICdPZmZzZXQnXSkuY3NzKCdsZWZ0JywgcG9zaXRpb24ubGVmdCArICdweCcpLmNzcygnd2lkdGgnLCBwb3NpdGlvbi53aWR0aCArICdweCcpO1xuXG4gICAgICAgIGlmIChpdGVtID09PSAnZm9vdGVyJykge1xuICAgICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcuY3NzKCd0b3AnLCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ2JlbG93Jykge1xuICAgICAgICB0aGlzLl9jbG9uZShpdGVtLCBmb3JjZUNoYW5nZSk7XG5cbiAgICAgICAgaXRlbURvbS5mbG9hdGluZy5hZGRDbGFzcygnZml4ZWRIZWFkZXItbG9ja2VkJykuY3NzKCd0b3AnLCBwb3NpdGlvbi50Zm9vdFRvcCAtIHBvc2l0aW9uLnRoZWFkSGVpZ2h0KS5jc3MoJ2xlZnQnLCBwb3NpdGlvbi5sZWZ0ICsgJ3B4JykuY3NzKCd3aWR0aCcsIHBvc2l0aW9uLndpZHRoICsgJ3B4Jyk7XG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT09ICdhYm92ZScpIHtcbiAgICAgICAgdGhpcy5fY2xvbmUoaXRlbSwgZm9yY2VDaGFuZ2UpO1xuXG4gICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcuYWRkQ2xhc3MoJ2ZpeGVkSGVhZGVyLWxvY2tlZCcpLmNzcygndG9wJywgcG9zaXRpb24udGJvZHlUb3ApLmNzcygnbGVmdCcsIHBvc2l0aW9uLmxlZnQgKyAncHgnKS5jc3MoJ3dpZHRoJywgcG9zaXRpb24ud2lkdGggKyAncHgnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZvY3VzICYmIGZvY3VzICE9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZvY3VzLmZvY3VzKCk7XG4gICAgICAgIH0sIDEwKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zLnNjcm9sbExlZnQuaGVhZGVyID0gLTE7XG4gICAgICB0aGlzLnMuc2Nyb2xsTGVmdC5mb290ZXIgPSAtMTtcbiAgICAgIHRoaXMuc1tpdGVtICsgJ01vZGUnXSA9IG1vZGU7XG4gICAgfSxcbiAgICBfcG9zaXRpb25zOiBmdW5jdGlvbiBfcG9zaXRpb25zKCkge1xuICAgICAgdmFyIGR0ID0gdGhpcy5zLmR0O1xuICAgICAgdmFyIHRhYmxlID0gZHQudGFibGUoKTtcbiAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMucy5wb3NpdGlvbjtcbiAgICAgIHZhciBkb20gPSB0aGlzLmRvbTtcbiAgICAgIHZhciB0YWJsZU5vZGUgPSAkKHRhYmxlLm5vZGUoKSk7XG4gICAgICB2YXIgdGhlYWQgPSB0YWJsZU5vZGUuY2hpbGRyZW4oJ3RoZWFkJyk7XG4gICAgICB2YXIgdGZvb3QgPSB0YWJsZU5vZGUuY2hpbGRyZW4oJ3Rmb290Jyk7XG4gICAgICB2YXIgdGJvZHkgPSBkb20udGJvZHk7XG4gICAgICBwb3NpdGlvbi52aXNpYmxlID0gdGFibGVOb2RlLmlzKCc6dmlzaWJsZScpO1xuICAgICAgcG9zaXRpb24ud2lkdGggPSB0YWJsZU5vZGUub3V0ZXJXaWR0aCgpO1xuICAgICAgcG9zaXRpb24ubGVmdCA9IHRhYmxlTm9kZS5vZmZzZXQoKS5sZWZ0O1xuICAgICAgcG9zaXRpb24udGhlYWRUb3AgPSB0aGVhZC5vZmZzZXQoKS50b3A7XG4gICAgICBwb3NpdGlvbi50Ym9keVRvcCA9IHRib2R5Lm9mZnNldCgpLnRvcDtcbiAgICAgIHBvc2l0aW9uLnRoZWFkSGVpZ2h0ID0gcG9zaXRpb24udGJvZHlUb3AgLSBwb3NpdGlvbi50aGVhZFRvcDtcblxuICAgICAgaWYgKHRmb290Lmxlbmd0aCkge1xuICAgICAgICBwb3NpdGlvbi50Zm9vdFRvcCA9IHRmb290Lm9mZnNldCgpLnRvcDtcbiAgICAgICAgcG9zaXRpb24udGZvb3RCb3R0b20gPSBwb3NpdGlvbi50Zm9vdFRvcCArIHRmb290Lm91dGVySGVpZ2h0KCk7XG4gICAgICAgIHBvc2l0aW9uLnRmb290SGVpZ2h0ID0gcG9zaXRpb24udGZvb3RCb3R0b20gLSBwb3NpdGlvbi50Zm9vdFRvcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvc2l0aW9uLnRmb290VG9wID0gcG9zaXRpb24udGJvZHlUb3AgKyB0Ym9keS5vdXRlckhlaWdodCgpO1xuICAgICAgICBwb3NpdGlvbi50Zm9vdEJvdHRvbSA9IHBvc2l0aW9uLnRmb290VG9wO1xuICAgICAgICBwb3NpdGlvbi50Zm9vdEhlaWdodCA9IHBvc2l0aW9uLnRmb290VG9wO1xuICAgICAgfVxuICAgIH0sXG4gICAgX3Njcm9sbDogZnVuY3Rpb24gX3Njcm9sbChmb3JjZUNoYW5nZSkge1xuICAgICAgdmFyIHdpbmRvd1RvcCA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpO1xuICAgICAgdmFyIHdpbmRvd0xlZnQgPSAkKGRvY3VtZW50KS5zY3JvbGxMZWZ0KCk7XG4gICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLnMucG9zaXRpb247XG4gICAgICB2YXIgaGVhZGVyTW9kZSwgZm9vdGVyTW9kZTtcblxuICAgICAgaWYgKCF0aGlzLnMuZW5hYmxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYy5oZWFkZXIpIHtcbiAgICAgICAgaWYgKCFwb3NpdGlvbi52aXNpYmxlIHx8IHdpbmRvd1RvcCA8PSBwb3NpdGlvbi50aGVhZFRvcCAtIHRoaXMuYy5oZWFkZXJPZmZzZXQpIHtcbiAgICAgICAgICBoZWFkZXJNb2RlID0gJ2luLXBsYWNlJztcbiAgICAgICAgfSBlbHNlIGlmICh3aW5kb3dUb3AgPD0gcG9zaXRpb24udGZvb3RUb3AgLSBwb3NpdGlvbi50aGVhZEhlaWdodCAtIHRoaXMuYy5oZWFkZXJPZmZzZXQpIHtcbiAgICAgICAgICBoZWFkZXJNb2RlID0gJ2luJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoZWFkZXJNb2RlID0gJ2JlbG93JztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmb3JjZUNoYW5nZSB8fCBoZWFkZXJNb2RlICE9PSB0aGlzLnMuaGVhZGVyTW9kZSkge1xuICAgICAgICAgIHRoaXMuX21vZGVDaGFuZ2UoaGVhZGVyTW9kZSwgJ2hlYWRlcicsIGZvcmNlQ2hhbmdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2hvcml6b250YWwoJ2hlYWRlcicsIHdpbmRvd0xlZnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jLmZvb3RlciAmJiB0aGlzLmRvbS50Zm9vdC5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFwb3NpdGlvbi52aXNpYmxlIHx8IHdpbmRvd1RvcCArIHBvc2l0aW9uLndpbmRvd0hlaWdodCA+PSBwb3NpdGlvbi50Zm9vdEJvdHRvbSArIHRoaXMuYy5mb290ZXJPZmZzZXQpIHtcbiAgICAgICAgICBmb290ZXJNb2RlID0gJ2luLXBsYWNlJztcbiAgICAgICAgfSBlbHNlIGlmIChwb3NpdGlvbi53aW5kb3dIZWlnaHQgKyB3aW5kb3dUb3AgPiBwb3NpdGlvbi50Ym9keVRvcCArIHBvc2l0aW9uLnRmb290SGVpZ2h0ICsgdGhpcy5jLmZvb3Rlck9mZnNldCkge1xuICAgICAgICAgIGZvb3Rlck1vZGUgPSAnaW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvb3Rlck1vZGUgPSAnYWJvdmUnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZvcmNlQ2hhbmdlIHx8IGZvb3Rlck1vZGUgIT09IHRoaXMucy5mb290ZXJNb2RlKSB7XG4gICAgICAgICAgdGhpcy5fbW9kZUNoYW5nZShmb290ZXJNb2RlLCAnZm9vdGVyJywgZm9yY2VDaGFuZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faG9yaXpvbnRhbCgnZm9vdGVyJywgd2luZG93TGVmdCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgRml4ZWRIZWFkZXIudmVyc2lvbiA9IFwiMy4xLjRcIjtcbiAgRml4ZWRIZWFkZXIuZGVmYXVsdHMgPSB7XG4gICAgaGVhZGVyOiB0cnVlLFxuICAgIGZvb3RlcjogZmFsc2UsXG4gICAgaGVhZGVyT2Zmc2V0OiAwLFxuICAgIGZvb3Rlck9mZnNldDogMFxuICB9O1xuICAkLmZuLmRhdGFUYWJsZS5GaXhlZEhlYWRlciA9IEZpeGVkSGVhZGVyO1xuICAkLmZuLkRhdGFUYWJsZS5GaXhlZEhlYWRlciA9IEZpeGVkSGVhZGVyO1xuICAkKGRvY3VtZW50KS5vbignaW5pdC5kdC5kdGZoJywgZnVuY3Rpb24gKGUsIHNldHRpbmdzLCBqc29uKSB7XG4gICAgaWYgKGUubmFtZXNwYWNlICE9PSAnZHQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGluaXQgPSBzZXR0aW5ncy5vSW5pdC5maXhlZEhlYWRlcjtcbiAgICB2YXIgZGVmYXVsdHMgPSBEYXRhVGFibGUuZGVmYXVsdHMuZml4ZWRIZWFkZXI7XG5cbiAgICBpZiAoKGluaXQgfHwgZGVmYXVsdHMpICYmICFzZXR0aW5ncy5fZml4ZWRIZWFkZXIpIHtcbiAgICAgIHZhciBvcHRzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBpbml0KTtcblxuICAgICAgaWYgKGluaXQgIT09IGZhbHNlKSB7XG4gICAgICAgIG5ldyBGaXhlZEhlYWRlcihzZXR0aW5ncywgb3B0cyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRIZWFkZXIoKScsIGZ1bmN0aW9uICgpIHt9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRIZWFkZXIuYWRqdXN0KCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgdmFyIGZoID0gY3R4Ll9maXhlZEhlYWRlcjtcblxuICAgICAgaWYgKGZoKSB7XG4gICAgICAgIGZoLnVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRIZWFkZXIuZW5hYmxlKCknLCBmdW5jdGlvbiAoZmxhZykge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIHZhciBmaCA9IGN0eC5fZml4ZWRIZWFkZXI7XG4gICAgICBmbGFnID0gZmxhZyAhPT0gdW5kZWZpbmVkID8gZmxhZyA6IHRydWU7XG5cbiAgICAgIGlmIChmaCAmJiBmbGFnICE9PSBmaC5zLmVuYWJsZSkge1xuICAgICAgICBmaC5lbmFibGUoZmxhZyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBEYXRhVGFibGUuQXBpLnJlZ2lzdGVyKCdmaXhlZEhlYWRlci5kaXNhYmxlKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgdmFyIGZoID0gY3R4Ll9maXhlZEhlYWRlcjtcblxuICAgICAgaWYgKGZoICYmIGZoLnMuZW5hYmxlKSB7XG4gICAgICAgIGZoLmVuYWJsZShmYWxzZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICAkLmVhY2goWydoZWFkZXInLCAnZm9vdGVyJ10sIGZ1bmN0aW9uIChpLCBlbCkge1xuICAgIERhdGFUYWJsZS5BcGkucmVnaXN0ZXIoJ2ZpeGVkSGVhZGVyLicgKyBlbCArICdPZmZzZXQoKScsIGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICAgIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gY3R4Lmxlbmd0aCAmJiBjdHhbMF0uX2ZpeGVkSGVhZGVyID8gY3R4WzBdLl9maXhlZEhlYWRlcltlbCArICdPZmZzZXQnXSgpIDogdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICAgIHZhciBmaCA9IGN0eC5fZml4ZWRIZWFkZXI7XG5cbiAgICAgICAgaWYgKGZoKSB7XG4gICAgICAgICAgZmhbZWwgKyAnT2Zmc2V0J10ob2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gRml4ZWRIZWFkZXI7XG59KTsiXX0=
