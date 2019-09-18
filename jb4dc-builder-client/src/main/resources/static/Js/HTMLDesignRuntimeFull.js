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
    FormId: ""
  },
  _$RendererToElem: null,
  Initialization: function Initialization(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);
    this._$RendererToElem = $("#" + this._Prop_Config.RendererToId);

    this._LoadHTMLToEl();
  },
  _LoadHTMLToEl: function _LoadHTMLToEl() {
    RuntimeGeneralInstance.LoadHtmlDesignContent(BaseUtility.GetRootPath() + "/Rest/Builder/FormRuntime/FormPreview?formId=" + this._Prop_Config.FormId, this._Prop_Config.RendererTo, {}, function (result) {
      console.log("加载预览窗体成功!!");
      console.log(result.data.formHtmlRuntime);

      this._$RendererToElem.append(result.data.formHtmlRuntime);

      VirtualBodyControl.RendererChain(result.data.formHtmlRuntime, this._$RendererToElem, this._$RendererToElem);
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

var WFDCT_TextBox = {
  RendererChain: function RendererChain(sourceHTML, $rootElem, $singleControlElem, allData) {
    $singleControlElem.val("22222");
  }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhdGFTZXRSdW50aW1lLmpzIiwiRm9ybVJ1bnRpbWUuanMiLCJMaXN0UnVudGltZS5qcyIsIlJ1bnRpbWVHZW5lcmFsLmpzIiwiQ29udHJvbC9IVE1MQ29udHJvbC5qcyIsIkNvbnRyb2wvVmlydHVhbEJvZHlDb250cm9sLmpzIiwiRXh0ZXJuYWwvZGF0YXRhYmxlcy5qcyIsIkNvbnRyb2wvV2ViRm9ybUNvbnRyb2wvV0ZEQ1RfVGV4dEJveC5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfRm9ybUJ1dHRvbi5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdEJ1dHRvbkNvbnRhaW5lci5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdENvbXBsZXhTZWFyY2hDb250YWluZXIuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RTaW1wbGVTZWFyY2hDb250YWluZXIuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RUYWJsZUNoZWNrQm94LmpzIiwiQ29udHJvbC9XZWJMaXN0Q29udHJvbC9XTERDVF9MaXN0VGFibGVDb250YWluZXIuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RUYWJsZUlubmVyQnV0dG9uQ29udGFpbmVyLmpzIiwiQ29udHJvbC9XZWJMaXN0Q29udHJvbC9XTERDVF9MaXN0VGFibGVJbm5lckJ1dHRvblNpbmdsZS5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdFRhYmxlTGFiZWwuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX1NlYXJjaF9UZXh0Qm94LmpzIiwiRXh0ZXJuYWwvRml4ZWRDb2x1bW5zLTMuMi41L2RhdGFUYWJsZXMuZml4ZWRDb2x1bW5zLmpzIiwiRXh0ZXJuYWwvRml4ZWRIZWFkZXItMy4xLjQvZGF0YVRhYmxlcy5maXhlZEhlYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3o3TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcjVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IkhUTUxEZXNpZ25SdW50aW1lRnVsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGF0YVNldFJ1bnRpbWUgPSB7XG4gIEdldERhdGFTZXREYXRhOiBmdW5jdGlvbiBHZXREYXRhU2V0RGF0YShjb25maWcsIGZ1bmMsIHNlbmRlcikge1xuICAgIHZhciBzZW5kRGF0YSA9IEpTT04uc3RyaW5naWZ5KGNvbmZpZyk7XG4gICAgQWpheFV0aWxpdHkuUG9zdFJlcXVlc3RCb2R5KFwiL1Jlc3QvQnVpbGRlci9SdW5UaW1lL0RhdGFTZXRSdW50aW1lL0dldERhdGFTZXREYXRhXCIsIHNlbmREYXRhLCBmdW5jdGlvbiAoZ2V0RGF0YVNldFJlc3VsdCkge1xuICAgICAgZnVuYy5jYWxsKHNlbmRlciwgZ2V0RGF0YVNldFJlc3VsdCk7XG4gICAgfSwgc2VuZGVyKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEZvcm1SdW50aW1lID0ge1xuICBfUHJvcF9TdGF0dXM6IFwiRWRpdFwiLFxuICBfUHJvcF9Db25maWc6IHtcbiAgICBSZW5kZXJlclRvSWQ6IG51bGwsXG4gICAgRm9ybUlkOiBcIlwiXG4gIH0sXG4gIF8kUmVuZGVyZXJUb0VsZW06IG51bGwsXG4gIEluaXRpYWxpemF0aW9uOiBmdW5jdGlvbiBJbml0aWFsaXphdGlvbihfY29uZmlnKSB7XG4gICAgdGhpcy5fUHJvcF9Db25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5fUHJvcF9Db25maWcsIF9jb25maWcpO1xuICAgIHRoaXMuXyRSZW5kZXJlclRvRWxlbSA9ICQoXCIjXCIgKyB0aGlzLl9Qcm9wX0NvbmZpZy5SZW5kZXJlclRvSWQpO1xuXG4gICAgdGhpcy5fTG9hZEhUTUxUb0VsKCk7XG4gIH0sXG4gIF9Mb2FkSFRNTFRvRWw6IGZ1bmN0aW9uIF9Mb2FkSFRNTFRvRWwoKSB7XG4gICAgUnVudGltZUdlbmVyYWxJbnN0YW5jZS5Mb2FkSHRtbERlc2lnbkNvbnRlbnQoQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1Jlc3QvQnVpbGRlci9Gb3JtUnVudGltZS9Gb3JtUHJldmlldz9mb3JtSWQ9XCIgKyB0aGlzLl9Qcm9wX0NvbmZpZy5Gb3JtSWQsIHRoaXMuX1Byb3BfQ29uZmlnLlJlbmRlcmVyVG8sIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBjb25zb2xlLmxvZyhcIuWKoOi9vemihOiniOeql+S9k+aIkOWKnyEhXCIpO1xuICAgICAgY29uc29sZS5sb2cocmVzdWx0LmRhdGEuZm9ybUh0bWxSdW50aW1lKTtcblxuICAgICAgdGhpcy5fJFJlbmRlcmVyVG9FbGVtLmFwcGVuZChyZXN1bHQuZGF0YS5mb3JtSHRtbFJ1bnRpbWUpO1xuXG4gICAgICBWaXJ0dWFsQm9keUNvbnRyb2wuUmVuZGVyZXJDaGFpbihyZXN1bHQuZGF0YS5mb3JtSHRtbFJ1bnRpbWUsIHRoaXMuXyRSZW5kZXJlclRvRWxlbSwgdGhpcy5fJFJlbmRlcmVyVG9FbGVtKTtcbiAgICB9LCB0aGlzKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIExpc3RSdW50aW1lID0ge1xuICBfUHJvcF9TdGF0dXM6IFwiRWRpdFwiLFxuICBfUHJvcF9Db25maWc6IHtcbiAgICBSZW5kZXJlclRvSWQ6IG51bGwsXG4gICAgTGlzdElkOiBcIlwiLFxuICAgIElzUHJldmlldzogZmFsc2VcbiAgfSxcbiAgXyRSZW5kZXJlclRvRWxlbTogbnVsbCxcbiAgSW5pdGlhbGl6YXRpb246IGZ1bmN0aW9uIEluaXRpYWxpemF0aW9uKF9jb25maWcpIHtcbiAgICB0aGlzLl9Qcm9wX0NvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLl9Qcm9wX0NvbmZpZywgX2NvbmZpZyk7XG4gICAgdGhpcy5fJFJlbmRlcmVyVG9FbGVtID0gJChcIiNcIiArIHRoaXMuX1Byb3BfQ29uZmlnLlJlbmRlcmVyVG9JZCk7XG5cbiAgICB0aGlzLl9Mb2FkSFRNTFRvRWwoKTtcbiAgfSxcbiAgX1JlbmRlcmVyQ2hhaW5Jc0NvbXBsZXRlZDogdHJ1ZSxcbiAgX1JlbmRlcmVyRGF0YUNoYWluSXNDb21wbGV0ZWQ6IHRydWUsXG4gIF9Mb2FkSFRNTFRvRWw6IGZ1bmN0aW9uIF9Mb2FkSFRNTFRvRWwoKSB7XG4gICAgUnVudGltZUdlbmVyYWxJbnN0YW5jZS5Mb2FkSHRtbERlc2lnbkNvbnRlbnQoQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1Jlc3QvQnVpbGRlci9SdW5UaW1lL0xpc3RSdW50aW1lL0xvYWRIVE1MP2xpc3RJZD1cIiArIHRoaXMuX1Byb3BfQ29uZmlnLkxpc3RJZCwgdGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUbywge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIHRoaXMuXyRSZW5kZXJlclRvRWxlbS5hcHBlbmQocmVzdWx0LmRhdGEubGlzdEh0bWxSdW50aW1lKTtcblxuICAgICAgdGhpcy5fJFJlbmRlcmVyVG9FbGVtLmFwcGVuZChyZXN1bHQuZGF0YS5saXN0SnNSdW50aW1lKTtcblxuICAgICAgaWYgKHR5cGVvZiBCdWlsZGVyTGlzdFBhZ2VSdW50aW1lSW5zdGFuY2UuUGFnZVJlYWR5ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBCdWlsZGVyTGlzdFBhZ2VSdW50aW1lSW5zdGFuY2UuUGFnZVJlYWR5KCk7XG4gICAgICB9XG5cbiAgICAgIFZpcnR1YWxCb2R5Q29udHJvbC5SZW5kZXJlckNoYWluKHtcbiAgICAgICAgbGlzdEVudGl0eTogcmVzdWx0LmRhdGEsXG4gICAgICAgIHNvdXJjZUhUTUw6IHJlc3VsdC5kYXRhLmxpc3RIdG1sUnVudGltZSxcbiAgICAgICAgJHJvb3RFbGVtOiB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sXG4gICAgICAgICRwYXJlbnRDb250cm9sRWxlbTogdGhpcy5fJFJlbmRlcmVyVG9FbGVtLFxuICAgICAgICAkc2luZ2xlQ29udHJvbEVsZW06IHRoaXMuXyRSZW5kZXJlclRvRWxlbSxcbiAgICAgICAgbGlzdFJ1bnRpbWVJbnN0YW5jZTogdGhpc1xuICAgICAgfSk7XG4gICAgICB2YXIgUmVuZGVyZXJDaGFpbkNvbXBsZXRlT2JqID0gd2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKF9zZWxmLl9SZW5kZXJlckNoYWluSXNDb21wbGV0ZWQpIHtcbiAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbChSZW5kZXJlckNoYWluQ29tcGxldGVPYmopO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBCdWlsZGVyTGlzdFBhZ2VSdW50aW1lSW5zdGFuY2UuUmVuZGVyZXJDaGFpbkNvbXBsZXRlZCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIEJ1aWxkZXJMaXN0UGFnZVJ1bnRpbWVJbnN0YW5jZS5SZW5kZXJlckNoYWluQ29tcGxldGVkKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCA1MDApO1xuICAgICAgdmFyIHRvcERhdGFTZXRJZCA9IHJlc3VsdC5kYXRhLmxpc3REYXRhc2V0SWQ7XG4gICAgICBWaXJ0dWFsQm9keUNvbnRyb2wuUmVuZGVyZXJEYXRhQ2hhaW4oe1xuICAgICAgICBsaXN0RW50aXR5OiByZXN1bHQuZGF0YSxcbiAgICAgICAgc291cmNlSFRNTDogcmVzdWx0LmRhdGEubGlzdEh0bWxSdW50aW1lLFxuICAgICAgICAkcm9vdEVsZW06IHRoaXMuXyRSZW5kZXJlclRvRWxlbSxcbiAgICAgICAgJHBhcmVudENvbnRyb2xFbGVtOiB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sXG4gICAgICAgICRzaW5nbGVDb250cm9sRWxlbTogdGhpcy5fJFJlbmRlcmVyVG9FbGVtLFxuICAgICAgICB0b3BEYXRhU2V0SWQ6IHRvcERhdGFTZXRJZCxcbiAgICAgICAgbGlzdFJ1bnRpbWVJbnN0YW5jZTogdGhpc1xuICAgICAgfSk7XG4gICAgICB2YXIgUmVuZGVyZXJEYXRhQ2hhaW5Db21wbGV0ZU9iaiA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChfc2VsZi5fUmVuZGVyZXJEYXRhQ2hhaW5Jc0NvbXBsZXRlZCkge1xuICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKFJlbmRlcmVyRGF0YUNoYWluQ29tcGxldGVPYmopO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBCdWlsZGVyTGlzdFBhZ2VSdW50aW1lSW5zdGFuY2UuUmVuZGVyZXJEYXRhQ2hhaW5Db21wbGV0ZWQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBCdWlsZGVyTGlzdFBhZ2VSdW50aW1lSW5zdGFuY2UuUmVuZGVyZXJEYXRhQ2hhaW5Db21wbGV0ZWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIDcwMCk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIElzUHJldmlldzogZnVuY3Rpb24gSXNQcmV2aWV3KCkge1xuICAgIHJldHVybiB0aGlzLl9Qcm9wX0NvbmZpZy5Jc1ByZXZpZXc7XG4gIH1cbn07XG52YXIgQnVpbGRlckxpc3RQYWdlUnVudGltZUluc3RhbmNlID0ge1xuICBQYWdlUmVhZHk6IGZ1bmN0aW9uIFBhZ2VSZWFkeSgpIHtcbiAgICBjb25zb2xlLmxvZyhcIumhtemdouWKoOi9vWh0bWzlrozmiJAxXCIpO1xuICB9LFxuICBSZW5kZXJlckNoYWluQ29tcGxldGVkOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluQ29tcGxldGVkKCkge1xuICAgIGNvbnNvbGUubG9nKFwi5a6i5oi356uv5o6n5Lu25riy5p+T5a6M5oiQXCIpO1xuICB9LFxuICBSZW5kZXJlckRhdGFDaGFpbkNvbXBsZXRlZDogZnVuY3Rpb24gUmVuZGVyZXJEYXRhQ2hhaW5Db21wbGV0ZWQoKSB7XG4gICAgY29uc29sZS5sb2coXCLlrqLmiLfnq6/mjqfku7bmuLLmn5Plubbnu5HlrprlrozmlbDmja5cIik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBSdW50aW1lR2VuZXJhbEluc3RhbmNlID0ge1xuICBMb2FkSHRtbERlc2lnbkNvbnRlbnQ6IGZ1bmN0aW9uIExvYWRIdG1sRGVzaWduQ29udGVudCh1cmwsIGFwcGVuZFRvRWxlbUlkLCBwYXJhbXMsIGNhbGxiYWNrLCBzZW5kZXIpIHtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgZGF0YTogcGFyYW1zXG4gICAgfSkuZG9uZShmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBjYWxsYmFjay5jYWxsKHNlbmRlciwgcmVzdWx0KTtcbiAgICB9KS5hbHdheXMoY2FsbGJhY2sgJiYgZnVuY3Rpb24gKGpxWEhSLCBzdGF0dXMpIHt9KTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEhUTUxDb250cm9sQXR0cnMgPSB7XG4gIEpCVUlMRDREQ19DVVNUT006IFwiamJ1aWxkNGRjX2N1c3RvbVwiLFxuICBTRUxFQ1RFRF9KQlVJTEQ0RENfQ1VTVE9NOiBcIltqYnVpbGQ0ZGNfY3VzdG9tPXRydWVdXCIsXG4gIENMSUVOVF9SRVNPTFZFOiBcImNsaWVudF9yZXNvbHZlXCJcbn07XG52YXIgSFRNTENvbnRyb2wgPSB7XG4gIF9JbnN0YW5jZU1hcDoge30sXG4gIEdldEluc3RhbmNlOiBmdW5jdGlvbiBHZXRJbnN0YW5jZShuYW1lKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuX0luc3RhbmNlTWFwKSB7XG4gICAgICBpZiAoa2V5ID09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0luc3RhbmNlTWFwW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGluc3RhbmNlID0gZXZhbChuYW1lKTtcbiAgICB0aGlzLl9JbnN0YW5jZU1hcFtuYW1lXSA9IGluc3RhbmNlO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSxcbiAgU2F2ZUNvbnRyb2xOZXdJbnN0YW5jZVRvUG9vbDogZnVuY3Rpb24gU2F2ZUNvbnRyb2xOZXdJbnN0YW5jZVRvUG9vbCgkZWxlbSwgaW5zdGFuY2UpIHtcbiAgICB2YXIgaW5zdGFuY2VOYW1lID0gJGVsZW0uYXR0cihcImNsaWVudF9yZXNvbHZlXCIpICsgXCJfXCIgKyBTdHJpbmdVdGlsaXR5Lkd1aWRTcGxpdChcIlwiKTtcbiAgICAkZWxlbS5hdHRyKFwiY2xpZW50X2luc3RhbmNlX25hbWVcIiwgaW5zdGFuY2VOYW1lKTtcbiAgICB0aGlzLl9JbnN0YW5jZU1hcFtpbnN0YW5jZU5hbWVdID0gaW5zdGFuY2U7XG4gIH0sXG4gIEdldENvbnRyb2xJbnN0YW5jZTogZnVuY3Rpb24gR2V0Q29udHJvbEluc3RhbmNlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fSW5zdGFuY2VNYXBbbmFtZV07XG4gIH0sXG4gIEdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbTogZnVuY3Rpb24gR2V0Q29udHJvbEluc3RhbmNlQnlFbGVtKCRlbGVtKSB7XG4gICAgdmFyIGluc3RhbmNlTmFtZSA9IFwiXCI7XG5cbiAgICBpZiAoJGVsZW0uYXR0cihcImNsaWVudF9pbnN0YW5jZV9uYW1lXCIpICYmICRlbGVtLmF0dHIoXCJjbGllbnRfaW5zdGFuY2VfbmFtZVwiKS5sZW5ndGggPiAwKSB7XG4gICAgICBpbnN0YW5jZU5hbWUgPSAkZWxlbS5hdHRyKFwiY2xpZW50X2luc3RhbmNlX25hbWVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluc3RhbmNlTmFtZSA9ICRlbGVtLmF0dHIoXCJjbGllbnRfcmVzb2x2ZVwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fSW5zdGFuY2VNYXBbaW5zdGFuY2VOYW1lXTtcbiAgfSxcbiAgUmVuZGVyZXJDaGFpblBhcmFzOiB7XG4gICAgbGlzdEVudGl0eTogbnVsbCxcbiAgICBzb3VyY2VIVE1MOiBudWxsLFxuICAgICRyb290RWxlbTogbnVsbCxcbiAgICAkcGFyZW50Q29udHJvbEVsZW06IG51bGwsXG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtOiBudWxsXG4gIH0sXG4gIFJlbmRlcmVyRGF0YUNoYWluUGFyYXM6IHtcbiAgICBsaXN0RW50aXR5OiBudWxsLFxuICAgIHNvdXJjZUhUTUw6IG51bGwsXG4gICAgJHJvb3RFbGVtOiBudWxsLFxuICAgICRwYXJlbnRDb250cm9sRWxlbTogbnVsbCxcbiAgICAkc2luZ2xlQ29udHJvbEVsZW06IG51bGwsXG4gICAgdG9wRGF0YVNldDogbnVsbFxuICB9LFxuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKF9yZW5kZXJlckNoYWluUGFyYXMpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gX3JlbmRlcmVyQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzaW5nbGVDb250cm9sRWxlbS5jaGlsZHJlbigpLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJGNoaWxkU2luZ2xlRWxlbSA9ICQoJHNpbmdsZUNvbnRyb2xFbGVtLmNoaWxkcmVuKClbaV0pO1xuICAgICAgdmFyIF9jbG9uZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMgPSB7fTtcbiAgICAgIEpzb25VdGlsaXR5LlNpbXBsZUNsb25lQXR0cihfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzLCBfcmVuZGVyZXJDaGFpblBhcmFzKTtcbiAgICAgIF9jbG9uZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtID0gJGNoaWxkU2luZ2xlRWxlbTtcblxuICAgICAgaWYgKCRjaGlsZFNpbmdsZUVsZW0uYXR0cihIVE1MQ29udHJvbEF0dHJzLkpCVUlMRDREQ19DVVNUT00pID09IFwidHJ1ZVwiICYmICRjaGlsZFNpbmdsZUVsZW0uYXR0cihIVE1MQ29udHJvbEF0dHJzLkNMSUVOVF9SRVNPTFZFKSkge1xuICAgICAgICB2YXIgY2xpZW50UmVzb2x2ZU5hbWUgPSAkY2hpbGRTaW5nbGVFbGVtLmF0dHIoSFRNTENvbnRyb2xBdHRycy5DTElFTlRfUkVTT0xWRSk7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldEluc3RhbmNlKGNsaWVudFJlc29sdmVOYW1lKTtcblxuICAgICAgICBpZiAodHlwZW9mIGluc3RhbmNlLkluaXRpYWxpemUgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgaW5zdGFuY2UuSW5pdGlhbGl6ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5zdGFuY2UuUmVuZGVyZXJDaGFpbihfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4oX2Nsb25lUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcyk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBSZW5kZXJlckRhdGFDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJEYXRhQ2hhaW4oX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2luZ2xlQ29udHJvbEVsZW0uY2hpbGRyZW4oKS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyICRjaGlsZFNpbmdsZUVsZW0gPSAkKCRzaW5nbGVDb250cm9sRWxlbS5jaGlsZHJlbigpW2ldKTtcbiAgICAgIHZhciBfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzID0ge307XG4gICAgICBKc29uVXRpbGl0eS5TaW1wbGVDbG9uZUF0dHIoX2Nsb25lUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcywgX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMpO1xuICAgICAgX2Nsb25lUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW0gPSAkY2hpbGRTaW5nbGVFbGVtO1xuXG4gICAgICBpZiAoJGNoaWxkU2luZ2xlRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuSkJVSUxENERDX0NVU1RPTSkgPT0gXCJ0cnVlXCIgJiYgJGNoaWxkU2luZ2xlRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuQ0xJRU5UX1JFU09MVkUpKSB7XG4gICAgICAgIHZhciBjbGllbnRSZXNvbHZlSW5zdGFuY2VOYW1lID0gJGNoaWxkU2luZ2xlRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuQ0xJRU5UX1JFU09MVkUpO1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRJbnN0YW5jZShjbGllbnRSZXNvbHZlSW5zdGFuY2VOYW1lKTtcbiAgICAgICAgaW5zdGFuY2UuUmVuZGVyZXJEYXRhQ2hhaW4oX2Nsb25lUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBIVE1MQ29udHJvbC5SZW5kZXJlckRhdGFDaGFpbihfY2xvbmVSZW5kZXJlckRhdGFDaGFpblBhcmFzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIEdldFZhbHVlOiBmdW5jdGlvbiBHZXRWYWx1ZSgkZWxlbSwgcGFyYXMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgcmVzdWx0LnJlc3VsdCA9IHRydWU7XG4gICAgcmVzdWx0Lm1lc3NhZ2UgPSBcIlwiO1xuICAgIHJlc3VsdC52YWx1ZSA9ICRlbGVtLnZhbCgpO1xuICAgIHJlc3VsdC50ZXh0ID0gJGVsZW0udmFsKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFZpcnR1YWxCb2R5Q29udHJvbCA9IHtcbiAgUmVuZGVyZXJDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpbixcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyRGF0YUNoYWluXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ2pxdWVyeSddLCBmdW5jdGlvbiAoJCkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoJCwgd2luZG93LCBkb2N1bWVudCk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoKHR5cGVvZiBleHBvcnRzID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YoZXhwb3J0cykpID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvb3QsICQpIHtcbiAgICAgIGlmICghcm9vdCkge1xuICAgICAgICByb290ID0gd2luZG93O1xuICAgICAgfVxuXG4gICAgICBpZiAoISQpIHtcbiAgICAgICAgJCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gcmVxdWlyZSgnanF1ZXJ5JykgOiByZXF1aXJlKCdqcXVlcnknKShyb290KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhY3RvcnkoJCwgcm9vdCwgcm9vdC5kb2N1bWVudCk7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBmYWN0b3J5KGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG4gIH1cbn0pKGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIERhdGFUYWJsZSA9IGZ1bmN0aW9uIERhdGFUYWJsZShvcHRpb25zKSB7XG4gICAgdGhpcy4kID0gZnVuY3Rpb24gKHNTZWxlY3Rvciwgb09wdHMpIHtcbiAgICAgIHJldHVybiB0aGlzLmFwaSh0cnVlKS4kKHNTZWxlY3Rvciwgb09wdHMpO1xuICAgIH07XG5cbiAgICB0aGlzLl8gPSBmdW5jdGlvbiAoc1NlbGVjdG9yLCBvT3B0cykge1xuICAgICAgcmV0dXJuIHRoaXMuYXBpKHRydWUpLnJvd3Moc1NlbGVjdG9yLCBvT3B0cykuZGF0YSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmFwaSA9IGZ1bmN0aW9uICh0cmFkaXRpb25hbCkge1xuICAgICAgcmV0dXJuIHRyYWRpdGlvbmFsID8gbmV3IF9BcGkyKF9mblNldHRpbmdzRnJvbU5vZGUodGhpc1tfZXh0LmlBcGlJbmRleF0pKSA6IG5ldyBfQXBpMih0aGlzKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mbkFkZERhdGEgPSBmdW5jdGlvbiAoZGF0YSwgcmVkcmF3KSB7XG4gICAgICB2YXIgYXBpID0gdGhpcy5hcGkodHJ1ZSk7XG4gICAgICB2YXIgcm93cyA9ICQuaXNBcnJheShkYXRhKSAmJiAoJC5pc0FycmF5KGRhdGFbMF0pIHx8ICQuaXNQbGFpbk9iamVjdChkYXRhWzBdKSkgPyBhcGkucm93cy5hZGQoZGF0YSkgOiBhcGkucm93LmFkZChkYXRhKTtcblxuICAgICAgaWYgKHJlZHJhdyA9PT0gdW5kZWZpbmVkIHx8IHJlZHJhdykge1xuICAgICAgICBhcGkuZHJhdygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcm93cy5mbGF0dGVuKCkudG9BcnJheSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmZuQWRqdXN0Q29sdW1uU2l6aW5nID0gZnVuY3Rpb24gKGJSZWRyYXcpIHtcbiAgICAgIHZhciBhcGkgPSB0aGlzLmFwaSh0cnVlKS5jb2x1bW5zLmFkanVzdCgpO1xuICAgICAgdmFyIHNldHRpbmdzID0gYXBpLnNldHRpbmdzKClbMF07XG4gICAgICB2YXIgc2Nyb2xsID0gc2V0dGluZ3Mub1Njcm9sbDtcblxuICAgICAgaWYgKGJSZWRyYXcgPT09IHVuZGVmaW5lZCB8fCBiUmVkcmF3KSB7XG4gICAgICAgIGFwaS5kcmF3KGZhbHNlKTtcbiAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsLnNYICE9PSBcIlwiIHx8IHNjcm9sbC5zWSAhPT0gXCJcIikge1xuICAgICAgICBfZm5TY3JvbGxEcmF3KHNldHRpbmdzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5mbkNsZWFyVGFibGUgPSBmdW5jdGlvbiAoYlJlZHJhdykge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpLmNsZWFyKCk7XG5cbiAgICAgIGlmIChiUmVkcmF3ID09PSB1bmRlZmluZWQgfHwgYlJlZHJhdykge1xuICAgICAgICBhcGkuZHJhdygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmZuQ2xvc2UgPSBmdW5jdGlvbiAoblRyKSB7XG4gICAgICB0aGlzLmFwaSh0cnVlKS5yb3coblRyKS5jaGlsZC5oaWRlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuZm5EZWxldGVSb3cgPSBmdW5jdGlvbiAodGFyZ2V0LCBjYWxsYmFjaywgcmVkcmF3KSB7XG4gICAgICB2YXIgYXBpID0gdGhpcy5hcGkodHJ1ZSk7XG4gICAgICB2YXIgcm93cyA9IGFwaS5yb3dzKHRhcmdldCk7XG4gICAgICB2YXIgc2V0dGluZ3MgPSByb3dzLnNldHRpbmdzKClbMF07XG4gICAgICB2YXIgZGF0YSA9IHNldHRpbmdzLmFvRGF0YVtyb3dzWzBdWzBdXTtcbiAgICAgIHJvd3MucmVtb3ZlKCk7XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIHNldHRpbmdzLCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlZHJhdyA9PT0gdW5kZWZpbmVkIHx8IHJlZHJhdykge1xuICAgICAgICBhcGkuZHJhdygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9O1xuXG4gICAgdGhpcy5mbkRlc3Ryb3kgPSBmdW5jdGlvbiAocmVtb3ZlKSB7XG4gICAgICB0aGlzLmFwaSh0cnVlKS5kZXN0cm95KHJlbW92ZSk7XG4gICAgfTtcblxuICAgIHRoaXMuZm5EcmF3ID0gZnVuY3Rpb24gKGNvbXBsZXRlKSB7XG4gICAgICB0aGlzLmFwaSh0cnVlKS5kcmF3KGNvbXBsZXRlKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mbkZpbHRlciA9IGZ1bmN0aW9uIChzSW5wdXQsIGlDb2x1bW4sIGJSZWdleCwgYlNtYXJ0LCBiU2hvd0dsb2JhbCwgYkNhc2VJbnNlbnNpdGl2ZSkge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpO1xuXG4gICAgICBpZiAoaUNvbHVtbiA9PT0gbnVsbCB8fCBpQ29sdW1uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXBpLnNlYXJjaChzSW5wdXQsIGJSZWdleCwgYlNtYXJ0LCBiQ2FzZUluc2Vuc2l0aXZlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwaS5jb2x1bW4oaUNvbHVtbikuc2VhcmNoKHNJbnB1dCwgYlJlZ2V4LCBiU21hcnQsIGJDYXNlSW5zZW5zaXRpdmUpO1xuICAgICAgfVxuXG4gICAgICBhcGkuZHJhdygpO1xuICAgIH07XG5cbiAgICB0aGlzLmZuR2V0RGF0YSA9IGZ1bmN0aW9uIChzcmMsIGNvbCkge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpO1xuXG4gICAgICBpZiAoc3JjICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBzcmMubm9kZU5hbWUgPyBzcmMubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA6ICcnO1xuICAgICAgICByZXR1cm4gY29sICE9PSB1bmRlZmluZWQgfHwgdHlwZSA9PSAndGQnIHx8IHR5cGUgPT0gJ3RoJyA/IGFwaS5jZWxsKHNyYywgY29sKS5kYXRhKCkgOiBhcGkucm93KHNyYykuZGF0YSgpIHx8IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhcGkuZGF0YSgpLnRvQXJyYXkoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mbkdldE5vZGVzID0gZnVuY3Rpb24gKGlSb3cpIHtcbiAgICAgIHZhciBhcGkgPSB0aGlzLmFwaSh0cnVlKTtcbiAgICAgIHJldHVybiBpUm93ICE9PSB1bmRlZmluZWQgPyBhcGkucm93KGlSb3cpLm5vZGUoKSA6IGFwaS5yb3dzKCkubm9kZXMoKS5mbGF0dGVuKCkudG9BcnJheSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmZuR2V0UG9zaXRpb24gPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpO1xuICAgICAgdmFyIG5vZGVOYW1lID0gbm9kZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICBpZiAobm9kZU5hbWUgPT0gJ1RSJykge1xuICAgICAgICByZXR1cm4gYXBpLnJvdyhub2RlKS5pbmRleCgpO1xuICAgICAgfSBlbHNlIGlmIChub2RlTmFtZSA9PSAnVEQnIHx8IG5vZGVOYW1lID09ICdUSCcpIHtcbiAgICAgICAgdmFyIGNlbGwgPSBhcGkuY2VsbChub2RlKS5pbmRleCgpO1xuICAgICAgICByZXR1cm4gW2NlbGwucm93LCBjZWxsLmNvbHVtblZpc2libGUsIGNlbGwuY29sdW1uXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIHRoaXMuZm5Jc09wZW4gPSBmdW5jdGlvbiAoblRyKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcGkodHJ1ZSkucm93KG5UcikuY2hpbGQuaXNTaG93bigpO1xuICAgIH07XG5cbiAgICB0aGlzLmZuT3BlbiA9IGZ1bmN0aW9uIChuVHIsIG1IdG1sLCBzQ2xhc3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmFwaSh0cnVlKS5yb3coblRyKS5jaGlsZChtSHRtbCwgc0NsYXNzKS5zaG93KCkuY2hpbGQoKVswXTtcbiAgICB9O1xuXG4gICAgdGhpcy5mblBhZ2VDaGFuZ2UgPSBmdW5jdGlvbiAobUFjdGlvbiwgYlJlZHJhdykge1xuICAgICAgdmFyIGFwaSA9IHRoaXMuYXBpKHRydWUpLnBhZ2UobUFjdGlvbik7XG5cbiAgICAgIGlmIChiUmVkcmF3ID09PSB1bmRlZmluZWQgfHwgYlJlZHJhdykge1xuICAgICAgICBhcGkuZHJhdyhmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuZm5TZXRDb2x1bW5WaXMgPSBmdW5jdGlvbiAoaUNvbCwgYlNob3csIGJSZWRyYXcpIHtcbiAgICAgIHZhciBhcGkgPSB0aGlzLmFwaSh0cnVlKS5jb2x1bW4oaUNvbCkudmlzaWJsZShiU2hvdyk7XG5cbiAgICAgIGlmIChiUmVkcmF3ID09PSB1bmRlZmluZWQgfHwgYlJlZHJhdykge1xuICAgICAgICBhcGkuY29sdW1ucy5hZGp1c3QoKS5kcmF3KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuZm5TZXR0aW5ncyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBfZm5TZXR0aW5nc0Zyb21Ob2RlKHRoaXNbX2V4dC5pQXBpSW5kZXhdKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mblNvcnQgPSBmdW5jdGlvbiAoYWFTb3J0KSB7XG4gICAgICB0aGlzLmFwaSh0cnVlKS5vcmRlcihhYVNvcnQpLmRyYXcoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mblNvcnRMaXN0ZW5lciA9IGZ1bmN0aW9uIChuTm9kZSwgaUNvbHVtbiwgZm5DYWxsYmFjaykge1xuICAgICAgdGhpcy5hcGkodHJ1ZSkub3JkZXIubGlzdGVuZXIobk5vZGUsIGlDb2x1bW4sIGZuQ2FsbGJhY2spO1xuICAgIH07XG5cbiAgICB0aGlzLmZuVXBkYXRlID0gZnVuY3Rpb24gKG1EYXRhLCBtUm93LCBpQ29sdW1uLCBiUmVkcmF3LCBiQWN0aW9uKSB7XG4gICAgICB2YXIgYXBpID0gdGhpcy5hcGkodHJ1ZSk7XG5cbiAgICAgIGlmIChpQ29sdW1uID09PSB1bmRlZmluZWQgfHwgaUNvbHVtbiA9PT0gbnVsbCkge1xuICAgICAgICBhcGkucm93KG1Sb3cpLmRhdGEobURhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBpLmNlbGwobVJvdywgaUNvbHVtbikuZGF0YShtRGF0YSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChiQWN0aW9uID09PSB1bmRlZmluZWQgfHwgYkFjdGlvbikge1xuICAgICAgICBhcGkuY29sdW1ucy5hZGp1c3QoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGJSZWRyYXcgPT09IHVuZGVmaW5lZCB8fCBiUmVkcmF3KSB7XG4gICAgICAgIGFwaS5kcmF3KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAwO1xuICAgIH07XG5cbiAgICB0aGlzLmZuVmVyc2lvbkNoZWNrID0gX2V4dC5mblZlcnNpb25DaGVjaztcblxuICAgIHZhciBfdGhhdCA9IHRoaXM7XG5cbiAgICB2YXIgZW1wdHlJbml0ID0gb3B0aW9ucyA9PT0gdW5kZWZpbmVkO1xuICAgIHZhciBsZW4gPSB0aGlzLmxlbmd0aDtcblxuICAgIGlmIChlbXB0eUluaXQpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLm9BcGkgPSB0aGlzLmludGVybmFsID0gX2V4dC5pbnRlcm5hbDtcblxuICAgIGZvciAodmFyIGZuIGluIERhdGFUYWJsZS5leHQuaW50ZXJuYWwpIHtcbiAgICAgIGlmIChmbikge1xuICAgICAgICB0aGlzW2ZuXSA9IF9mbkV4dGVybkFwaUZ1bmMoZm4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbyA9IHt9O1xuICAgICAgdmFyIG9Jbml0ID0gbGVuID4gMSA/IF9mbkV4dGVuZChvLCBvcHRpb25zLCB0cnVlKSA6IG9wdGlvbnM7XG4gICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgaUxlbixcbiAgICAgICAgICBqLFxuICAgICAgICAgIGpMZW4sXG4gICAgICAgICAgayxcbiAgICAgICAgICBrTGVuO1xuICAgICAgdmFyIHNJZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgdmFyIGJJbml0SGFuZGVkT2ZmID0gZmFsc2U7XG4gICAgICB2YXIgZGVmYXVsdHMgPSBEYXRhVGFibGUuZGVmYXVsdHM7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICBpZiAodGhpcy5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9ICd0YWJsZScpIHtcbiAgICAgICAgX2ZuTG9nKG51bGwsIDAsICdOb24tdGFibGUgbm9kZSBpbml0aWFsaXNhdGlvbiAoJyArIHRoaXMubm9kZU5hbWUgKyAnKScsIDIpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgX2ZuQ29tcGF0T3B0cyhkZWZhdWx0cyk7XG5cbiAgICAgIF9mbkNvbXBhdENvbHMoZGVmYXVsdHMuY29sdW1uKTtcblxuICAgICAgX2ZuQ2FtZWxUb0h1bmdhcmlhbihkZWZhdWx0cywgZGVmYXVsdHMsIHRydWUpO1xuXG4gICAgICBfZm5DYW1lbFRvSHVuZ2FyaWFuKGRlZmF1bHRzLmNvbHVtbiwgZGVmYXVsdHMuY29sdW1uLCB0cnVlKTtcblxuICAgICAgX2ZuQ2FtZWxUb0h1bmdhcmlhbihkZWZhdWx0cywgJC5leHRlbmQob0luaXQsICR0aGlzLmRhdGEoKSkpO1xuXG4gICAgICB2YXIgYWxsU2V0dGluZ3MgPSBEYXRhVGFibGUuc2V0dGluZ3M7XG5cbiAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhbGxTZXR0aW5ncy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgdmFyIHMgPSBhbGxTZXR0aW5nc1tpXTtcblxuICAgICAgICBpZiAocy5uVGFibGUgPT0gdGhpcyB8fCBzLm5USGVhZCAmJiBzLm5USGVhZC5wYXJlbnROb2RlID09IHRoaXMgfHwgcy5uVEZvb3QgJiYgcy5uVEZvb3QucGFyZW50Tm9kZSA9PSB0aGlzKSB7XG4gICAgICAgICAgdmFyIGJSZXRyaWV2ZSA9IG9Jbml0LmJSZXRyaWV2ZSAhPT0gdW5kZWZpbmVkID8gb0luaXQuYlJldHJpZXZlIDogZGVmYXVsdHMuYlJldHJpZXZlO1xuICAgICAgICAgIHZhciBiRGVzdHJveSA9IG9Jbml0LmJEZXN0cm95ICE9PSB1bmRlZmluZWQgPyBvSW5pdC5iRGVzdHJveSA6IGRlZmF1bHRzLmJEZXN0cm95O1xuXG4gICAgICAgICAgaWYgKGVtcHR5SW5pdCB8fCBiUmV0cmlldmUpIHtcbiAgICAgICAgICAgIHJldHVybiBzLm9JbnN0YW5jZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGJEZXN0cm95KSB7XG4gICAgICAgICAgICBzLm9JbnN0YW5jZS5mbkRlc3Ryb3koKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfZm5Mb2cocywgMCwgJ0Nhbm5vdCByZWluaXRpYWxpc2UgRGF0YVRhYmxlJywgMyk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocy5zVGFibGVJZCA9PSB0aGlzLmlkKSB7XG4gICAgICAgICAgYWxsU2V0dGluZ3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzSWQgPT09IG51bGwgfHwgc0lkID09PSBcIlwiKSB7XG4gICAgICAgIHNJZCA9IFwiRGF0YVRhYmxlc19UYWJsZV9cIiArIERhdGFUYWJsZS5leHQuX3VuaXF1ZSsrO1xuICAgICAgICB0aGlzLmlkID0gc0lkO1xuICAgICAgfVxuXG4gICAgICB2YXIgb1NldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwge30sIERhdGFUYWJsZS5tb2RlbHMub1NldHRpbmdzLCB7XG4gICAgICAgIFwic0Rlc3Ryb3lXaWR0aFwiOiAkdGhpc1swXS5zdHlsZS53aWR0aCxcbiAgICAgICAgXCJzSW5zdGFuY2VcIjogc0lkLFxuICAgICAgICBcInNUYWJsZUlkXCI6IHNJZFxuICAgICAgfSk7XG4gICAgICBvU2V0dGluZ3MublRhYmxlID0gdGhpcztcbiAgICAgIG9TZXR0aW5ncy5vQXBpID0gX3RoYXQuaW50ZXJuYWw7XG4gICAgICBvU2V0dGluZ3Mub0luaXQgPSBvSW5pdDtcbiAgICAgIGFsbFNldHRpbmdzLnB1c2gob1NldHRpbmdzKTtcbiAgICAgIG9TZXR0aW5ncy5vSW5zdGFuY2UgPSBfdGhhdC5sZW5ndGggPT09IDEgPyBfdGhhdCA6ICR0aGlzLmRhdGFUYWJsZSgpO1xuXG4gICAgICBfZm5Db21wYXRPcHRzKG9Jbml0KTtcblxuICAgICAgX2ZuTGFuZ3VhZ2VDb21wYXQob0luaXQub0xhbmd1YWdlKTtcblxuICAgICAgaWYgKG9Jbml0LmFMZW5ndGhNZW51ICYmICFvSW5pdC5pRGlzcGxheUxlbmd0aCkge1xuICAgICAgICBvSW5pdC5pRGlzcGxheUxlbmd0aCA9ICQuaXNBcnJheShvSW5pdC5hTGVuZ3RoTWVudVswXSkgPyBvSW5pdC5hTGVuZ3RoTWVudVswXVswXSA6IG9Jbml0LmFMZW5ndGhNZW51WzBdO1xuICAgICAgfVxuXG4gICAgICBvSW5pdCA9IF9mbkV4dGVuZCgkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMpLCBvSW5pdCk7XG5cbiAgICAgIF9mbk1hcChvU2V0dGluZ3Mub0ZlYXR1cmVzLCBvSW5pdCwgW1wiYlBhZ2luYXRlXCIsIFwiYkxlbmd0aENoYW5nZVwiLCBcImJGaWx0ZXJcIiwgXCJiU29ydFwiLCBcImJTb3J0TXVsdGlcIiwgXCJiSW5mb1wiLCBcImJQcm9jZXNzaW5nXCIsIFwiYkF1dG9XaWR0aFwiLCBcImJTb3J0Q2xhc3Nlc1wiLCBcImJTZXJ2ZXJTaWRlXCIsIFwiYkRlZmVyUmVuZGVyXCJdKTtcblxuICAgICAgX2ZuTWFwKG9TZXR0aW5ncywgb0luaXQsIFtcImFzU3RyaXBlQ2xhc3Nlc1wiLCBcImFqYXhcIiwgXCJmblNlcnZlckRhdGFcIiwgXCJmbkZvcm1hdE51bWJlclwiLCBcInNTZXJ2ZXJNZXRob2RcIiwgXCJhYVNvcnRpbmdcIiwgXCJhYVNvcnRpbmdGaXhlZFwiLCBcImFMZW5ndGhNZW51XCIsIFwic1BhZ2luYXRpb25UeXBlXCIsIFwic0FqYXhTb3VyY2VcIiwgXCJzQWpheERhdGFQcm9wXCIsIFwiaVN0YXRlRHVyYXRpb25cIiwgXCJzRG9tXCIsIFwiYlNvcnRDZWxsc1RvcFwiLCBcImlUYWJJbmRleFwiLCBcImZuU3RhdGVMb2FkQ2FsbGJhY2tcIiwgXCJmblN0YXRlU2F2ZUNhbGxiYWNrXCIsIFwicmVuZGVyZXJcIiwgXCJzZWFyY2hEZWxheVwiLCBcInJvd0lkXCIsIFtcImlDb29raWVEdXJhdGlvblwiLCBcImlTdGF0ZUR1cmF0aW9uXCJdLCBbXCJvU2VhcmNoXCIsIFwib1ByZXZpb3VzU2VhcmNoXCJdLCBbXCJhb1NlYXJjaENvbHNcIiwgXCJhb1ByZVNlYXJjaENvbHNcIl0sIFtcImlEaXNwbGF5TGVuZ3RoXCIsIFwiX2lEaXNwbGF5TGVuZ3RoXCJdXSk7XG5cbiAgICAgIF9mbk1hcChvU2V0dGluZ3Mub1Njcm9sbCwgb0luaXQsIFtbXCJzU2Nyb2xsWFwiLCBcInNYXCJdLCBbXCJzU2Nyb2xsWElubmVyXCIsIFwic1hJbm5lclwiXSwgW1wic1Njcm9sbFlcIiwgXCJzWVwiXSwgW1wiYlNjcm9sbENvbGxhcHNlXCIsIFwiYkNvbGxhcHNlXCJdXSk7XG5cbiAgICAgIF9mbk1hcChvU2V0dGluZ3Mub0xhbmd1YWdlLCBvSW5pdCwgXCJmbkluZm9DYWxsYmFja1wiKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9EcmF3Q2FsbGJhY2snLCBvSW5pdC5mbkRyYXdDYWxsYmFjaywgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9TZXJ2ZXJQYXJhbXMnLCBvSW5pdC5mblNlcnZlclBhcmFtcywgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9TdGF0ZVNhdmVQYXJhbXMnLCBvSW5pdC5mblN0YXRlU2F2ZVBhcmFtcywgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9TdGF0ZUxvYWRQYXJhbXMnLCBvSW5pdC5mblN0YXRlTG9hZFBhcmFtcywgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9TdGF0ZUxvYWRlZCcsIG9Jbml0LmZuU3RhdGVMb2FkZWQsICd1c2VyJyk7XG5cbiAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvUm93Q2FsbGJhY2snLCBvSW5pdC5mblJvd0NhbGxiYWNrLCAndXNlcicpO1xuXG4gICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb1Jvd0NyZWF0ZWRDYWxsYmFjaycsIG9Jbml0LmZuQ3JlYXRlZFJvdywgJ3VzZXInKTtcblxuICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9IZWFkZXJDYWxsYmFjaycsIG9Jbml0LmZuSGVhZGVyQ2FsbGJhY2ssICd1c2VyJyk7XG5cbiAgICAgIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgJ2FvRm9vdGVyQ2FsbGJhY2snLCBvSW5pdC5mbkZvb3RlckNhbGxiYWNrLCAndXNlcicpO1xuXG4gICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb0luaXRDb21wbGV0ZScsIG9Jbml0LmZuSW5pdENvbXBsZXRlLCAndXNlcicpO1xuXG4gICAgICBfZm5DYWxsYmFja1JlZyhvU2V0dGluZ3MsICdhb1ByZURyYXdDYWxsYmFjaycsIG9Jbml0LmZuUHJlRHJhd0NhbGxiYWNrLCAndXNlcicpO1xuXG4gICAgICBvU2V0dGluZ3Mucm93SWRGbiA9IF9mbkdldE9iamVjdERhdGFGbihvSW5pdC5yb3dJZCk7XG5cbiAgICAgIF9mbkJyb3dzZXJEZXRlY3Qob1NldHRpbmdzKTtcblxuICAgICAgdmFyIG9DbGFzc2VzID0gb1NldHRpbmdzLm9DbGFzc2VzO1xuICAgICAgJC5leHRlbmQob0NsYXNzZXMsIERhdGFUYWJsZS5leHQuY2xhc3Nlcywgb0luaXQub0NsYXNzZXMpO1xuICAgICAgJHRoaXMuYWRkQ2xhc3Mob0NsYXNzZXMuc1RhYmxlKTtcblxuICAgICAgaWYgKG9TZXR0aW5ncy5pSW5pdERpc3BsYXlTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9TZXR0aW5ncy5pSW5pdERpc3BsYXlTdGFydCA9IG9Jbml0LmlEaXNwbGF5U3RhcnQ7XG4gICAgICAgIG9TZXR0aW5ncy5faURpc3BsYXlTdGFydCA9IG9Jbml0LmlEaXNwbGF5U3RhcnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChvSW5pdC5pRGVmZXJMb2FkaW5nICE9PSBudWxsKSB7XG4gICAgICAgIG9TZXR0aW5ncy5iRGVmZXJMb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgdmFyIHRtcCA9ICQuaXNBcnJheShvSW5pdC5pRGVmZXJMb2FkaW5nKTtcbiAgICAgICAgb1NldHRpbmdzLl9pUmVjb3Jkc0Rpc3BsYXkgPSB0bXAgPyBvSW5pdC5pRGVmZXJMb2FkaW5nWzBdIDogb0luaXQuaURlZmVyTG9hZGluZztcbiAgICAgICAgb1NldHRpbmdzLl9pUmVjb3Jkc1RvdGFsID0gdG1wID8gb0luaXQuaURlZmVyTG9hZGluZ1sxXSA6IG9Jbml0LmlEZWZlckxvYWRpbmc7XG4gICAgICB9XG5cbiAgICAgIHZhciBvTGFuZ3VhZ2UgPSBvU2V0dGluZ3Mub0xhbmd1YWdlO1xuICAgICAgJC5leHRlbmQodHJ1ZSwgb0xhbmd1YWdlLCBvSW5pdC5vTGFuZ3VhZ2UpO1xuXG4gICAgICBpZiAob0xhbmd1YWdlLnNVcmwpIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgIHVybDogb0xhbmd1YWdlLnNVcmwsXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2Vzcyhqc29uKSB7XG4gICAgICAgICAgICBfZm5MYW5ndWFnZUNvbXBhdChqc29uKTtcblxuICAgICAgICAgICAgX2ZuQ2FtZWxUb0h1bmdhcmlhbihkZWZhdWx0cy5vTGFuZ3VhZ2UsIGpzb24pO1xuXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBvTGFuZ3VhZ2UsIGpzb24pO1xuXG4gICAgICAgICAgICBfZm5Jbml0aWFsaXNlKG9TZXR0aW5ncyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgICAgICAgICBfZm5Jbml0aWFsaXNlKG9TZXR0aW5ncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYkluaXRIYW5kZWRPZmYgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAob0luaXQuYXNTdHJpcGVDbGFzc2VzID09PSBudWxsKSB7XG4gICAgICAgIG9TZXR0aW5ncy5hc1N0cmlwZUNsYXNzZXMgPSBbb0NsYXNzZXMuc1N0cmlwZU9kZCwgb0NsYXNzZXMuc1N0cmlwZUV2ZW5dO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3RyaXBlQ2xhc3NlcyA9IG9TZXR0aW5ncy5hc1N0cmlwZUNsYXNzZXM7XG4gICAgICB2YXIgcm93T25lID0gJHRoaXMuY2hpbGRyZW4oJ3Rib2R5JykuZmluZCgndHInKS5lcSgwKTtcblxuICAgICAgaWYgKCQuaW5BcnJheSh0cnVlLCAkLm1hcChzdHJpcGVDbGFzc2VzLCBmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgcmV0dXJuIHJvd09uZS5oYXNDbGFzcyhlbCk7XG4gICAgICB9KSkgIT09IC0xKSB7XG4gICAgICAgICQoJ3Rib2R5IHRyJywgdGhpcykucmVtb3ZlQ2xhc3Moc3RyaXBlQ2xhc3Nlcy5qb2luKCcgJykpO1xuICAgICAgICBvU2V0dGluZ3MuYXNEZXN0cm95U3RyaXBlcyA9IHN0cmlwZUNsYXNzZXMuc2xpY2UoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGFuVGhzID0gW107XG4gICAgICB2YXIgYW9Db2x1bW5zSW5pdDtcbiAgICAgIHZhciBuVGhlYWQgPSB0aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aGVhZCcpO1xuXG4gICAgICBpZiAoblRoZWFkLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICBfZm5EZXRlY3RIZWFkZXIob1NldHRpbmdzLmFvSGVhZGVyLCBuVGhlYWRbMF0pO1xuXG4gICAgICAgIGFuVGhzID0gX2ZuR2V0VW5pcXVlVGhzKG9TZXR0aW5ncyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvSW5pdC5hb0NvbHVtbnMgPT09IG51bGwpIHtcbiAgICAgICAgYW9Db2x1bW5zSW5pdCA9IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhblRocy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgICBhb0NvbHVtbnNJbml0LnB1c2gobnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFvQ29sdW1uc0luaXQgPSBvSW5pdC5hb0NvbHVtbnM7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhb0NvbHVtbnNJbml0Lmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICBfZm5BZGRDb2x1bW4ob1NldHRpbmdzLCBhblRocyA/IGFuVGhzW2ldIDogbnVsbCk7XG4gICAgICB9XG5cbiAgICAgIF9mbkFwcGx5Q29sdW1uRGVmcyhvU2V0dGluZ3MsIG9Jbml0LmFvQ29sdW1uRGVmcywgYW9Db2x1bW5zSW5pdCwgZnVuY3Rpb24gKGlDb2wsIG9EZWYpIHtcbiAgICAgICAgX2ZuQ29sdW1uT3B0aW9ucyhvU2V0dGluZ3MsIGlDb2wsIG9EZWYpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChyb3dPbmUubGVuZ3RoKSB7XG4gICAgICAgIHZhciBhID0gZnVuY3Rpb24gYShjZWxsLCBuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLScgKyBuYW1lKSAhPT0gbnVsbCA/IG5hbWUgOiBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgICQocm93T25lWzBdKS5jaGlsZHJlbigndGgsIHRkJykuZWFjaChmdW5jdGlvbiAoaSwgY2VsbCkge1xuICAgICAgICAgIHZhciBjb2wgPSBvU2V0dGluZ3MuYW9Db2x1bW5zW2ldO1xuXG4gICAgICAgICAgaWYgKGNvbC5tRGF0YSA9PT0gaSkge1xuICAgICAgICAgICAgdmFyIHNvcnQgPSBhKGNlbGwsICdzb3J0JykgfHwgYShjZWxsLCAnb3JkZXInKTtcbiAgICAgICAgICAgIHZhciBmaWx0ZXIgPSBhKGNlbGwsICdmaWx0ZXInKSB8fCBhKGNlbGwsICdzZWFyY2gnKTtcblxuICAgICAgICAgICAgaWYgKHNvcnQgIT09IG51bGwgfHwgZmlsdGVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIGNvbC5tRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBfOiBpICsgJy5kaXNwbGF5JyxcbiAgICAgICAgICAgICAgICBzb3J0OiBzb3J0ICE9PSBudWxsID8gaSArICcuQGRhdGEtJyArIHNvcnQgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHlwZTogc29ydCAhPT0gbnVsbCA/IGkgKyAnLkBkYXRhLScgKyBzb3J0IDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogZmlsdGVyICE9PSBudWxsID8gaSArICcuQGRhdGEtJyArIGZpbHRlciA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIF9mbkNvbHVtbk9wdGlvbnMob1NldHRpbmdzLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmVhdHVyZXMgPSBvU2V0dGluZ3Mub0ZlYXR1cmVzO1xuXG4gICAgICB2YXIgbG9hZGVkSW5pdCA9IGZ1bmN0aW9uIGxvYWRlZEluaXQoKSB7XG4gICAgICAgIGlmIChvSW5pdC5hYVNvcnRpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBzb3J0aW5nID0gb1NldHRpbmdzLmFhU29ydGluZztcblxuICAgICAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBzb3J0aW5nLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICAgICAgc29ydGluZ1tpXVsxXSA9IG9TZXR0aW5ncy5hb0NvbHVtbnNbaV0uYXNTb3J0aW5nWzBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9mblNvcnRpbmdDbGFzc2VzKG9TZXR0aW5ncyk7XG5cbiAgICAgICAgaWYgKGZlYXR1cmVzLmJTb3J0KSB7XG4gICAgICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9EcmF3Q2FsbGJhY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAob1NldHRpbmdzLmJTb3J0ZWQpIHtcbiAgICAgICAgICAgICAgdmFyIGFTb3J0ID0gX2ZuU29ydEZsYXR0ZW4ob1NldHRpbmdzKTtcblxuICAgICAgICAgICAgICB2YXIgc29ydGVkQ29sdW1ucyA9IHt9O1xuICAgICAgICAgICAgICAkLmVhY2goYVNvcnQsIGZ1bmN0aW9uIChpLCB2YWwpIHtcbiAgICAgICAgICAgICAgICBzb3J0ZWRDb2x1bW5zW3ZhbC5zcmNdID0gdmFsLmRpcjtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgbnVsbCwgJ29yZGVyJywgW29TZXR0aW5ncywgYVNvcnQsIHNvcnRlZENvbHVtbnNdKTtcblxuICAgICAgICAgICAgICBfZm5Tb3J0QXJpYShvU2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9EcmF3Q2FsbGJhY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKG9TZXR0aW5ncy5iU29ydGVkIHx8IF9mbkRhdGFTb3VyY2Uob1NldHRpbmdzKSA9PT0gJ3NzcCcgfHwgZmVhdHVyZXMuYkRlZmVyUmVuZGVyKSB7XG4gICAgICAgICAgICBfZm5Tb3J0aW5nQ2xhc3NlcyhvU2V0dGluZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgJ3NjJyk7XG5cbiAgICAgICAgdmFyIGNhcHRpb25zID0gJHRoaXMuY2hpbGRyZW4oJ2NhcHRpb24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLl9jYXB0aW9uU2lkZSA9ICQodGhpcykuY3NzKCdjYXB0aW9uLXNpZGUnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciB0aGVhZCA9ICR0aGlzLmNoaWxkcmVuKCd0aGVhZCcpO1xuXG4gICAgICAgIGlmICh0aGVhZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGVhZCA9ICQoJzx0aGVhZC8+JykuYXBwZW5kVG8oJHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgb1NldHRpbmdzLm5USGVhZCA9IHRoZWFkWzBdO1xuICAgICAgICB2YXIgdGJvZHkgPSAkdGhpcy5jaGlsZHJlbigndGJvZHknKTtcblxuICAgICAgICBpZiAodGJvZHkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGJvZHkgPSAkKCc8dGJvZHkvPicpLmFwcGVuZFRvKCR0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9TZXR0aW5ncy5uVEJvZHkgPSB0Ym9keVswXTtcbiAgICAgICAgdmFyIHRmb290ID0gJHRoaXMuY2hpbGRyZW4oJ3Rmb290Jyk7XG5cbiAgICAgICAgaWYgKHRmb290Lmxlbmd0aCA9PT0gMCAmJiBjYXB0aW9ucy5sZW5ndGggPiAwICYmIChvU2V0dGluZ3Mub1Njcm9sbC5zWCAhPT0gXCJcIiB8fCBvU2V0dGluZ3Mub1Njcm9sbC5zWSAhPT0gXCJcIikpIHtcbiAgICAgICAgICB0Zm9vdCA9ICQoJzx0Zm9vdC8+JykuYXBwZW5kVG8oJHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRmb290Lmxlbmd0aCA9PT0gMCB8fCB0Zm9vdC5jaGlsZHJlbigpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICR0aGlzLmFkZENsYXNzKG9DbGFzc2VzLnNOb0Zvb3Rlcik7XG4gICAgICAgIH0gZWxzZSBpZiAodGZvb3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgIG9TZXR0aW5ncy5uVEZvb3QgPSB0Zm9vdFswXTtcblxuICAgICAgICAgIF9mbkRldGVjdEhlYWRlcihvU2V0dGluZ3MuYW9Gb290ZXIsIG9TZXR0aW5ncy5uVEZvb3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9Jbml0LmFhRGF0YSkge1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvSW5pdC5hYURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIF9mbkFkZERhdGEob1NldHRpbmdzLCBvSW5pdC5hYURhdGFbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvU2V0dGluZ3MuYkRlZmVyTG9hZGluZyB8fCBfZm5EYXRhU291cmNlKG9TZXR0aW5ncykgPT0gJ2RvbScpIHtcbiAgICAgICAgICBfZm5BZGRUcihvU2V0dGluZ3MsICQob1NldHRpbmdzLm5UQm9keSkuY2hpbGRyZW4oJ3RyJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgb1NldHRpbmdzLmFpRGlzcGxheSA9IG9TZXR0aW5ncy5haURpc3BsYXlNYXN0ZXIuc2xpY2UoKTtcbiAgICAgICAgb1NldHRpbmdzLmJJbml0aWFsaXNlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGJJbml0SGFuZGVkT2ZmID09PSBmYWxzZSkge1xuICAgICAgICAgIF9mbkluaXRpYWxpc2Uob1NldHRpbmdzKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKG9Jbml0LmJTdGF0ZVNhdmUpIHtcbiAgICAgICAgZmVhdHVyZXMuYlN0YXRlU2F2ZSA9IHRydWU7XG5cbiAgICAgICAgX2ZuQ2FsbGJhY2tSZWcob1NldHRpbmdzLCAnYW9EcmF3Q2FsbGJhY2snLCBfZm5TYXZlU3RhdGUsICdzdGF0ZV9zYXZlJyk7XG5cbiAgICAgICAgX2ZuTG9hZFN0YXRlKG9TZXR0aW5ncywgb0luaXQsIGxvYWRlZEluaXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9hZGVkSW5pdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIF90aGF0ID0gbnVsbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgX2V4dDtcblxuICB2YXIgX0FwaTI7XG5cbiAgdmFyIF9hcGlfcmVnaXN0ZXI7XG5cbiAgdmFyIF9hcGlfcmVnaXN0ZXJQbHVyYWw7XG5cbiAgdmFyIF9yZV9kaWMgPSB7fTtcbiAgdmFyIF9yZV9uZXdfbGluZXMgPSAvW1xcclxcbl0vZztcbiAgdmFyIF9yZV9odG1sID0gLzwuKj8+L2c7XG4gIHZhciBfcmVfZGF0ZSA9IC9eXFxkezIsNH1bXFwuXFwvXFwtXVxcZHsxLDJ9W1xcLlxcL1xcLV1cXGR7MSwyfShbVCBdezF9XFxkezEsMn1bOlxcLl1cXGR7Mn0oW1xcLjpdXFxkezJ9KT8pPyQvO1xuXG4gIHZhciBfcmVfZXNjYXBlX3JlZ2V4ID0gbmV3IFJlZ0V4cCgnKFxcXFwnICsgWycvJywgJy4nLCAnKicsICcrJywgJz8nLCAnfCcsICcoJywgJyknLCAnWycsICddJywgJ3snLCAnfScsICdcXFxcJywgJyQnLCAnXicsICctJ10uam9pbignfFxcXFwnKSArICcpJywgJ2cnKTtcblxuICB2YXIgX3JlX2Zvcm1hdHRlZF9udW1lcmljID0gL1snLCTCo+KCrMKlJVxcdTIwMDlcXHUyMDJGXFx1MjBCRFxcdTIwYTlcXHUyMEJBcmZryYPOnl0vZ2k7XG5cbiAgdmFyIF9lbXB0eSA9IGZ1bmN0aW9uIF9lbXB0eShkKSB7XG4gICAgcmV0dXJuICFkIHx8IGQgPT09IHRydWUgfHwgZCA9PT0gJy0nID8gdHJ1ZSA6IGZhbHNlO1xuICB9O1xuXG4gIHZhciBfaW50VmFsID0gZnVuY3Rpb24gX2ludFZhbChzKSB7XG4gICAgdmFyIGludGVnZXIgPSBwYXJzZUludChzLCAxMCk7XG4gICAgcmV0dXJuICFpc05hTihpbnRlZ2VyKSAmJiBpc0Zpbml0ZShzKSA/IGludGVnZXIgOiBudWxsO1xuICB9O1xuXG4gIHZhciBfbnVtVG9EZWNpbWFsID0gZnVuY3Rpb24gX251bVRvRGVjaW1hbChudW0sIGRlY2ltYWxQb2ludCkge1xuICAgIGlmICghX3JlX2RpY1tkZWNpbWFsUG9pbnRdKSB7XG4gICAgICBfcmVfZGljW2RlY2ltYWxQb2ludF0gPSBuZXcgUmVnRXhwKF9mbkVzY2FwZVJlZ2V4KGRlY2ltYWxQb2ludCksICdnJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHR5cGVvZiBudW0gPT09ICdzdHJpbmcnICYmIGRlY2ltYWxQb2ludCAhPT0gJy4nID8gbnVtLnJlcGxhY2UoL1xcLi9nLCAnJykucmVwbGFjZShfcmVfZGljW2RlY2ltYWxQb2ludF0sICcuJykgOiBudW07XG4gIH07XG5cbiAgdmFyIF9pc051bWJlciA9IGZ1bmN0aW9uIF9pc051bWJlcihkLCBkZWNpbWFsUG9pbnQsIGZvcm1hdHRlZCkge1xuICAgIHZhciBzdHJUeXBlID0gdHlwZW9mIGQgPT09ICdzdHJpbmcnO1xuXG4gICAgaWYgKF9lbXB0eShkKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRlY2ltYWxQb2ludCAmJiBzdHJUeXBlKSB7XG4gICAgICBkID0gX251bVRvRGVjaW1hbChkLCBkZWNpbWFsUG9pbnQpO1xuICAgIH1cblxuICAgIGlmIChmb3JtYXR0ZWQgJiYgc3RyVHlwZSkge1xuICAgICAgZCA9IGQucmVwbGFjZShfcmVfZm9ybWF0dGVkX251bWVyaWMsICcnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQoZCkpICYmIGlzRmluaXRlKGQpO1xuICB9O1xuXG4gIHZhciBfaXNIdG1sID0gZnVuY3Rpb24gX2lzSHRtbChkKSB7XG4gICAgcmV0dXJuIF9lbXB0eShkKSB8fCB0eXBlb2YgZCA9PT0gJ3N0cmluZyc7XG4gIH07XG5cbiAgdmFyIF9odG1sTnVtZXJpYyA9IGZ1bmN0aW9uIF9odG1sTnVtZXJpYyhkLCBkZWNpbWFsUG9pbnQsIGZvcm1hdHRlZCkge1xuICAgIGlmIChfZW1wdHkoZCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciBodG1sID0gX2lzSHRtbChkKTtcblxuICAgIHJldHVybiAhaHRtbCA/IG51bGwgOiBfaXNOdW1iZXIoX3N0cmlwSHRtbChkKSwgZGVjaW1hbFBvaW50LCBmb3JtYXR0ZWQpID8gdHJ1ZSA6IG51bGw7XG4gIH07XG5cbiAgdmFyIF9wbHVjayA9IGZ1bmN0aW9uIF9wbHVjayhhLCBwcm9wLCBwcm9wMikge1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGllbiA9IGEubGVuZ3RoO1xuXG4gICAgaWYgKHByb3AyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgaWYgKGFbaV0gJiYgYVtpXVtwcm9wXSkge1xuICAgICAgICAgIG91dC5wdXNoKGFbaV1bcHJvcF1bcHJvcDJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGlmIChhW2ldKSB7XG4gICAgICAgICAgb3V0LnB1c2goYVtpXVtwcm9wXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIHZhciBfcGx1Y2tfb3JkZXIgPSBmdW5jdGlvbiBfcGx1Y2tfb3JkZXIoYSwgb3JkZXIsIHByb3AsIHByb3AyKSB7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgaWVuID0gb3JkZXIubGVuZ3RoO1xuXG4gICAgaWYgKHByb3AyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgaWYgKGFbb3JkZXJbaV1dW3Byb3BdKSB7XG4gICAgICAgICAgb3V0LnB1c2goYVtvcmRlcltpXV1bcHJvcF1bcHJvcDJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIG91dC5wdXNoKGFbb3JkZXJbaV1dW3Byb3BdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIHZhciBfcmFuZ2UgPSBmdW5jdGlvbiBfcmFuZ2UobGVuLCBzdGFydCkge1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICB2YXIgZW5kO1xuXG4gICAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICAgIGVuZCA9IGxlbjtcbiAgICB9IGVsc2Uge1xuICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICBzdGFydCA9IGxlbjtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgb3V0LnB1c2goaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICB2YXIgX3JlbW92ZUVtcHR5ID0gZnVuY3Rpb24gX3JlbW92ZUVtcHR5KGEpIHtcbiAgICB2YXIgb3V0ID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gYS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgaWYgKGFbaV0pIHtcbiAgICAgICAgb3V0LnB1c2goYVtpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICB2YXIgX3N0cmlwSHRtbCA9IGZ1bmN0aW9uIF9zdHJpcEh0bWwoZCkge1xuICAgIHJldHVybiBkLnJlcGxhY2UoX3JlX2h0bWwsICcnKTtcbiAgfTtcblxuICB2YXIgX2FyZUFsbFVuaXF1ZSA9IGZ1bmN0aW9uIF9hcmVBbGxVbmlxdWUoc3JjKSB7XG4gICAgaWYgKHNyYy5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgc29ydGVkID0gc3JjLnNsaWNlKCkuc29ydCgpO1xuICAgIHZhciBsYXN0ID0gc29ydGVkWzBdO1xuXG4gICAgZm9yICh2YXIgaSA9IDEsIGllbiA9IHNvcnRlZC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgaWYgKHNvcnRlZFtpXSA9PT0gbGFzdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGxhc3QgPSBzb3J0ZWRbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgdmFyIF91bmlxdWUgPSBmdW5jdGlvbiBfdW5pcXVlKHNyYykge1xuICAgIGlmIChfYXJlQWxsVW5pcXVlKHNyYykpIHtcbiAgICAgIHJldHVybiBzcmMuc2xpY2UoKTtcbiAgICB9XG5cbiAgICB2YXIgb3V0ID0gW10sXG4gICAgICAgIHZhbCxcbiAgICAgICAgaSxcbiAgICAgICAgaWVuID0gc3JjLmxlbmd0aCxcbiAgICAgICAgaixcbiAgICAgICAgayA9IDA7XG5cbiAgICBhZ2FpbjogZm9yIChpID0gMDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICB2YWwgPSBzcmNbaV07XG5cbiAgICAgIGZvciAoaiA9IDA7IGogPCBrOyBqKyspIHtcbiAgICAgICAgaWYgKG91dFtqXSA9PT0gdmFsKSB7XG4gICAgICAgICAgY29udGludWUgYWdhaW47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgb3V0LnB1c2godmFsKTtcbiAgICAgIGsrKztcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIERhdGFUYWJsZS51dGlsID0ge1xuICAgIHRocm90dGxlOiBmdW5jdGlvbiB0aHJvdHRsZShmbiwgZnJlcSkge1xuICAgICAgdmFyIGZyZXF1ZW5jeSA9IGZyZXEgIT09IHVuZGVmaW5lZCA/IGZyZXEgOiAyMDAsXG4gICAgICAgICAgbGFzdCxcbiAgICAgICAgICB0aW1lcjtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIG5vdyA9ICtuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBpZiAobGFzdCAmJiBub3cgPCBsYXN0ICsgZnJlcXVlbmN5KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGFzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICAgICAgICAgIH0sIGZyZXF1ZW5jeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGFzdCA9IG5vdztcbiAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGVzY2FwZVJlZ2V4OiBmdW5jdGlvbiBlc2NhcGVSZWdleCh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwucmVwbGFjZShfcmVfZXNjYXBlX3JlZ2V4LCAnXFxcXCQxJyk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIF9mbkh1bmdhcmlhbk1hcChvKSB7XG4gICAgdmFyIGh1bmdhcmlhbiA9ICdhIGFhIGFpIGFvIGFzIGIgZm4gaSBtIG8gcyAnLFxuICAgICAgICBtYXRjaCxcbiAgICAgICAgbmV3S2V5LFxuICAgICAgICBtYXAgPSB7fTtcbiAgICAkLmVhY2gobywgZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgICBtYXRjaCA9IGtleS5tYXRjaCgvXihbXkEtWl0rPykoW0EtWl0pLyk7XG5cbiAgICAgIGlmIChtYXRjaCAmJiBodW5nYXJpYW4uaW5kZXhPZihtYXRjaFsxXSArICcgJykgIT09IC0xKSB7XG4gICAgICAgIG5ld0tleSA9IGtleS5yZXBsYWNlKG1hdGNoWzBdLCBtYXRjaFsyXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgbWFwW25ld0tleV0gPSBrZXk7XG5cbiAgICAgICAgaWYgKG1hdGNoWzFdID09PSAnbycpIHtcbiAgICAgICAgICBfZm5IdW5nYXJpYW5NYXAob1trZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIG8uX2h1bmdhcmlhbk1hcCA9IG1hcDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNhbWVsVG9IdW5nYXJpYW4oc3JjLCB1c2VyLCBmb3JjZSkge1xuICAgIGlmICghc3JjLl9odW5nYXJpYW5NYXApIHtcbiAgICAgIF9mbkh1bmdhcmlhbk1hcChzcmMpO1xuICAgIH1cblxuICAgIHZhciBodW5nYXJpYW5LZXk7XG4gICAgJC5lYWNoKHVzZXIsIGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgICAgaHVuZ2FyaWFuS2V5ID0gc3JjLl9odW5nYXJpYW5NYXBba2V5XTtcblxuICAgICAgaWYgKGh1bmdhcmlhbktleSAhPT0gdW5kZWZpbmVkICYmIChmb3JjZSB8fCB1c2VyW2h1bmdhcmlhbktleV0gPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgaWYgKGh1bmdhcmlhbktleS5jaGFyQXQoMCkgPT09ICdvJykge1xuICAgICAgICAgIGlmICghdXNlcltodW5nYXJpYW5LZXldKSB7XG4gICAgICAgICAgICB1c2VyW2h1bmdhcmlhbktleV0gPSB7fTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkLmV4dGVuZCh0cnVlLCB1c2VyW2h1bmdhcmlhbktleV0sIHVzZXJba2V5XSk7XG5cbiAgICAgICAgICBfZm5DYW1lbFRvSHVuZ2FyaWFuKHNyY1todW5nYXJpYW5LZXldLCB1c2VyW2h1bmdhcmlhbktleV0sIGZvcmNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1c2VyW2h1bmdhcmlhbktleV0gPSB1c2VyW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkxhbmd1YWdlQ29tcGF0KGxhbmcpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSBEYXRhVGFibGUuZGVmYXVsdHMub0xhbmd1YWdlO1xuICAgIHZhciBkZWZhdWx0RGVjaW1hbCA9IGRlZmF1bHRzLnNEZWNpbWFsO1xuXG4gICAgaWYgKGRlZmF1bHREZWNpbWFsKSB7XG4gICAgICBfYWRkTnVtZXJpY1NvcnQoZGVmYXVsdERlY2ltYWwpO1xuICAgIH1cblxuICAgIGlmIChsYW5nKSB7XG4gICAgICB2YXIgemVyb1JlY29yZHMgPSBsYW5nLnNaZXJvUmVjb3JkcztcblxuICAgICAgaWYgKCFsYW5nLnNFbXB0eVRhYmxlICYmIHplcm9SZWNvcmRzICYmIGRlZmF1bHRzLnNFbXB0eVRhYmxlID09PSBcIk5vIGRhdGEgYXZhaWxhYmxlIGluIHRhYmxlXCIpIHtcbiAgICAgICAgX2ZuTWFwKGxhbmcsIGxhbmcsICdzWmVyb1JlY29yZHMnLCAnc0VtcHR5VGFibGUnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFsYW5nLnNMb2FkaW5nUmVjb3JkcyAmJiB6ZXJvUmVjb3JkcyAmJiBkZWZhdWx0cy5zTG9hZGluZ1JlY29yZHMgPT09IFwiTG9hZGluZy4uLlwiKSB7XG4gICAgICAgIF9mbk1hcChsYW5nLCBsYW5nLCAnc1plcm9SZWNvcmRzJywgJ3NMb2FkaW5nUmVjb3JkcycpO1xuICAgICAgfVxuXG4gICAgICBpZiAobGFuZy5zSW5mb1Rob3VzYW5kcykge1xuICAgICAgICBsYW5nLnNUaG91c2FuZHMgPSBsYW5nLnNJbmZvVGhvdXNhbmRzO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGVjaW1hbCA9IGxhbmcuc0RlY2ltYWw7XG5cbiAgICAgIGlmIChkZWNpbWFsICYmIGRlZmF1bHREZWNpbWFsICE9PSBkZWNpbWFsKSB7XG4gICAgICAgIF9hZGROdW1lcmljU29ydChkZWNpbWFsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgX2ZuQ29tcGF0TWFwID0gZnVuY3Rpb24gX2ZuQ29tcGF0TWFwKG8sIGtuZXcsIG9sZCkge1xuICAgIGlmIChvW2tuZXddICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG9bb2xkXSA9IG9ba25ld107XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIF9mbkNvbXBhdE9wdHMoaW5pdCkge1xuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnb3JkZXJpbmcnLCAnYlNvcnQnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnb3JkZXJNdWx0aScsICdiU29ydE11bHRpJyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ29yZGVyQ2xhc3NlcycsICdiU29ydENsYXNzZXMnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnb3JkZXJDZWxsc1RvcCcsICdiU29ydENlbGxzVG9wJyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ29yZGVyJywgJ2FhU29ydGluZycpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdvcmRlckZpeGVkJywgJ2FhU29ydGluZ0ZpeGVkJyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ3BhZ2luZycsICdiUGFnaW5hdGUnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAncGFnaW5nVHlwZScsICdzUGFnaW5hdGlvblR5cGUnKTtcblxuICAgIF9mbkNvbXBhdE1hcChpbml0LCAncGFnZUxlbmd0aCcsICdpRGlzcGxheUxlbmd0aCcpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdzZWFyY2hpbmcnLCAnYkZpbHRlcicpO1xuXG4gICAgaWYgKHR5cGVvZiBpbml0LnNTY3JvbGxYID09PSAnYm9vbGVhbicpIHtcbiAgICAgIGluaXQuc1Njcm9sbFggPSBpbml0LnNTY3JvbGxYID8gJzEwMCUnIDogJyc7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBpbml0LnNjcm9sbFggPT09ICdib29sZWFuJykge1xuICAgICAgaW5pdC5zY3JvbGxYID0gaW5pdC5zY3JvbGxYID8gJzEwMCUnIDogJyc7XG4gICAgfVxuXG4gICAgdmFyIHNlYXJjaENvbHMgPSBpbml0LmFvU2VhcmNoQ29scztcblxuICAgIGlmIChzZWFyY2hDb2xzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gc2VhcmNoQ29scy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBpZiAoc2VhcmNoQ29sc1tpXSkge1xuICAgICAgICAgIF9mbkNhbWVsVG9IdW5nYXJpYW4oRGF0YVRhYmxlLm1vZGVscy5vU2VhcmNoLCBzZWFyY2hDb2xzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNvbXBhdENvbHMoaW5pdCkge1xuICAgIF9mbkNvbXBhdE1hcChpbml0LCAnb3JkZXJhYmxlJywgJ2JTb3J0YWJsZScpO1xuXG4gICAgX2ZuQ29tcGF0TWFwKGluaXQsICdvcmRlckRhdGEnLCAnYURhdGFTb3J0Jyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ29yZGVyU2VxdWVuY2UnLCAnYXNTb3J0aW5nJyk7XG5cbiAgICBfZm5Db21wYXRNYXAoaW5pdCwgJ29yZGVyRGF0YVR5cGUnLCAnc29ydERhdGFUeXBlJyk7XG5cbiAgICB2YXIgZGF0YVNvcnQgPSBpbml0LmFEYXRhU29ydDtcblxuICAgIGlmICh0eXBlb2YgZGF0YVNvcnQgPT09ICdudW1iZXInICYmICEkLmlzQXJyYXkoZGF0YVNvcnQpKSB7XG4gICAgICBpbml0LmFEYXRhU29ydCA9IFtkYXRhU29ydF07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQnJvd3NlckRldGVjdChzZXR0aW5ncykge1xuICAgIGlmICghRGF0YVRhYmxlLl9fYnJvd3Nlcikge1xuICAgICAgdmFyIGJyb3dzZXIgPSB7fTtcbiAgICAgIERhdGFUYWJsZS5fX2Jyb3dzZXIgPSBicm93c2VyO1xuICAgICAgdmFyIG4gPSAkKCc8ZGl2Lz4nKS5jc3Moe1xuICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBsZWZ0OiAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpICogLTEsXG4gICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICAgICAgfSkuYXBwZW5kKCQoJzxkaXYvPicpLmNzcyh7XG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICB0b3A6IDEsXG4gICAgICAgIGxlZnQ6IDEsXG4gICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgIG92ZXJmbG93OiAnc2Nyb2xsJ1xuICAgICAgfSkuYXBwZW5kKCQoJzxkaXYvPicpLmNzcyh7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGhlaWdodDogMTBcbiAgICAgIH0pKSkuYXBwZW5kVG8oJ2JvZHknKTtcbiAgICAgIHZhciBvdXRlciA9IG4uY2hpbGRyZW4oKTtcbiAgICAgIHZhciBpbm5lciA9IG91dGVyLmNoaWxkcmVuKCk7XG4gICAgICBicm93c2VyLmJhcldpZHRoID0gb3V0ZXJbMF0ub2Zmc2V0V2lkdGggLSBvdXRlclswXS5jbGllbnRXaWR0aDtcbiAgICAgIGJyb3dzZXIuYlNjcm9sbE92ZXJzaXplID0gaW5uZXJbMF0ub2Zmc2V0V2lkdGggPT09IDEwMCAmJiBvdXRlclswXS5jbGllbnRXaWR0aCAhPT0gMTAwO1xuICAgICAgYnJvd3Nlci5iU2Nyb2xsYmFyTGVmdCA9IE1hdGgucm91bmQoaW5uZXIub2Zmc2V0KCkubGVmdCkgIT09IDE7XG4gICAgICBicm93c2VyLmJCb3VuZGluZyA9IG5bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggPyB0cnVlIDogZmFsc2U7XG4gICAgICBuLnJlbW92ZSgpO1xuICAgIH1cblxuICAgICQuZXh0ZW5kKHNldHRpbmdzLm9Ccm93c2VyLCBEYXRhVGFibGUuX19icm93c2VyKTtcbiAgICBzZXR0aW5ncy5vU2Nyb2xsLmlCYXJXaWR0aCA9IERhdGFUYWJsZS5fX2Jyb3dzZXIuYmFyV2lkdGg7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5SZWR1Y2UodGhhdCwgZm4sIGluaXQsIHN0YXJ0LCBlbmQsIGluYykge1xuICAgIHZhciBpID0gc3RhcnQsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBpc1NldCA9IGZhbHNlO1xuXG4gICAgaWYgKGluaXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBpbml0O1xuICAgICAgaXNTZXQgPSB0cnVlO1xuICAgIH1cblxuICAgIHdoaWxlIChpICE9PSBlbmQpIHtcbiAgICAgIGlmICghdGhhdC5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFsdWUgPSBpc1NldCA/IGZuKHZhbHVlLCB0aGF0W2ldLCBpLCB0aGF0KSA6IHRoYXRbaV07XG4gICAgICBpc1NldCA9IHRydWU7XG4gICAgICBpICs9IGluYztcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5BZGRDb2x1bW4ob1NldHRpbmdzLCBuVGgpIHtcbiAgICB2YXIgb0RlZmF1bHRzID0gRGF0YVRhYmxlLmRlZmF1bHRzLmNvbHVtbjtcbiAgICB2YXIgaUNvbCA9IG9TZXR0aW5ncy5hb0NvbHVtbnMubGVuZ3RoO1xuICAgIHZhciBvQ29sID0gJC5leHRlbmQoe30sIERhdGFUYWJsZS5tb2RlbHMub0NvbHVtbiwgb0RlZmF1bHRzLCB7XG4gICAgICBcIm5UaFwiOiBuVGggPyBuVGggOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0aCcpLFxuICAgICAgXCJzVGl0bGVcIjogb0RlZmF1bHRzLnNUaXRsZSA/IG9EZWZhdWx0cy5zVGl0bGUgOiBuVGggPyBuVGguaW5uZXJIVE1MIDogJycsXG4gICAgICBcImFEYXRhU29ydFwiOiBvRGVmYXVsdHMuYURhdGFTb3J0ID8gb0RlZmF1bHRzLmFEYXRhU29ydCA6IFtpQ29sXSxcbiAgICAgIFwibURhdGFcIjogb0RlZmF1bHRzLm1EYXRhID8gb0RlZmF1bHRzLm1EYXRhIDogaUNvbCxcbiAgICAgIGlkeDogaUNvbFxuICAgIH0pO1xuICAgIG9TZXR0aW5ncy5hb0NvbHVtbnMucHVzaChvQ29sKTtcbiAgICB2YXIgc2VhcmNoQ29scyA9IG9TZXR0aW5ncy5hb1ByZVNlYXJjaENvbHM7XG4gICAgc2VhcmNoQ29sc1tpQ29sXSA9ICQuZXh0ZW5kKHt9LCBEYXRhVGFibGUubW9kZWxzLm9TZWFyY2gsIHNlYXJjaENvbHNbaUNvbF0pO1xuXG4gICAgX2ZuQ29sdW1uT3B0aW9ucyhvU2V0dGluZ3MsIGlDb2wsICQoblRoKS5kYXRhKCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQ29sdW1uT3B0aW9ucyhvU2V0dGluZ3MsIGlDb2wsIG9PcHRpb25zKSB7XG4gICAgdmFyIG9Db2wgPSBvU2V0dGluZ3MuYW9Db2x1bW5zW2lDb2xdO1xuICAgIHZhciBvQ2xhc3NlcyA9IG9TZXR0aW5ncy5vQ2xhc3NlcztcbiAgICB2YXIgdGggPSAkKG9Db2wublRoKTtcblxuICAgIGlmICghb0NvbC5zV2lkdGhPcmlnKSB7XG4gICAgICBvQ29sLnNXaWR0aE9yaWcgPSB0aC5hdHRyKCd3aWR0aCcpIHx8IG51bGw7XG4gICAgICB2YXIgdCA9ICh0aC5hdHRyKCdzdHlsZScpIHx8ICcnKS5tYXRjaCgvd2lkdGg6XFxzKihcXGQrW3B4ZW0lXSspLyk7XG5cbiAgICAgIGlmICh0KSB7XG4gICAgICAgIG9Db2wuc1dpZHRoT3JpZyA9IHRbMV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9PcHRpb25zICE9PSB1bmRlZmluZWQgJiYgb09wdGlvbnMgIT09IG51bGwpIHtcbiAgICAgIF9mbkNvbXBhdENvbHMob09wdGlvbnMpO1xuXG4gICAgICBfZm5DYW1lbFRvSHVuZ2FyaWFuKERhdGFUYWJsZS5kZWZhdWx0cy5jb2x1bW4sIG9PcHRpb25zKTtcblxuICAgICAgaWYgKG9PcHRpb25zLm1EYXRhUHJvcCAhPT0gdW5kZWZpbmVkICYmICFvT3B0aW9ucy5tRGF0YSkge1xuICAgICAgICBvT3B0aW9ucy5tRGF0YSA9IG9PcHRpb25zLm1EYXRhUHJvcDtcbiAgICAgIH1cblxuICAgICAgaWYgKG9PcHRpb25zLnNUeXBlKSB7XG4gICAgICAgIG9Db2wuX3NNYW51YWxUeXBlID0gb09wdGlvbnMuc1R5cGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChvT3B0aW9ucy5jbGFzc05hbWUgJiYgIW9PcHRpb25zLnNDbGFzcykge1xuICAgICAgICBvT3B0aW9ucy5zQ2xhc3MgPSBvT3B0aW9ucy5jbGFzc05hbWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChvT3B0aW9ucy5zQ2xhc3MpIHtcbiAgICAgICAgdGguYWRkQ2xhc3Mob09wdGlvbnMuc0NsYXNzKTtcbiAgICAgIH1cblxuICAgICAgJC5leHRlbmQob0NvbCwgb09wdGlvbnMpO1xuXG4gICAgICBfZm5NYXAob0NvbCwgb09wdGlvbnMsIFwic1dpZHRoXCIsIFwic1dpZHRoT3JpZ1wiKTtcblxuICAgICAgaWYgKG9PcHRpb25zLmlEYXRhU29ydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9Db2wuYURhdGFTb3J0ID0gW29PcHRpb25zLmlEYXRhU29ydF07XG4gICAgICB9XG5cbiAgICAgIF9mbk1hcChvQ29sLCBvT3B0aW9ucywgXCJhRGF0YVNvcnRcIik7XG4gICAgfVxuXG4gICAgdmFyIG1EYXRhU3JjID0gb0NvbC5tRGF0YTtcblxuICAgIHZhciBtRGF0YSA9IF9mbkdldE9iamVjdERhdGFGbihtRGF0YVNyYyk7XG5cbiAgICB2YXIgbVJlbmRlciA9IG9Db2wubVJlbmRlciA/IF9mbkdldE9iamVjdERhdGFGbihvQ29sLm1SZW5kZXIpIDogbnVsbDtcblxuICAgIHZhciBhdHRyVGVzdCA9IGZ1bmN0aW9uIGF0dHJUZXN0KHNyYykge1xuICAgICAgcmV0dXJuIHR5cGVvZiBzcmMgPT09ICdzdHJpbmcnICYmIHNyYy5pbmRleE9mKCdAJykgIT09IC0xO1xuICAgIH07XG5cbiAgICBvQ29sLl9iQXR0clNyYyA9ICQuaXNQbGFpbk9iamVjdChtRGF0YVNyYykgJiYgKGF0dHJUZXN0KG1EYXRhU3JjLnNvcnQpIHx8IGF0dHJUZXN0KG1EYXRhU3JjLnR5cGUpIHx8IGF0dHJUZXN0KG1EYXRhU3JjLmZpbHRlcikpO1xuICAgIG9Db2wuX3NldHRlciA9IG51bGw7XG5cbiAgICBvQ29sLmZuR2V0RGF0YSA9IGZ1bmN0aW9uIChyb3dEYXRhLCB0eXBlLCBtZXRhKSB7XG4gICAgICB2YXIgaW5uZXJEYXRhID0gbURhdGEocm93RGF0YSwgdHlwZSwgdW5kZWZpbmVkLCBtZXRhKTtcbiAgICAgIHJldHVybiBtUmVuZGVyICYmIHR5cGUgPyBtUmVuZGVyKGlubmVyRGF0YSwgdHlwZSwgcm93RGF0YSwgbWV0YSkgOiBpbm5lckRhdGE7XG4gICAgfTtcblxuICAgIG9Db2wuZm5TZXREYXRhID0gZnVuY3Rpb24gKHJvd0RhdGEsIHZhbCwgbWV0YSkge1xuICAgICAgcmV0dXJuIF9mblNldE9iamVjdERhdGFGbihtRGF0YVNyYykocm93RGF0YSwgdmFsLCBtZXRhKTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBtRGF0YVNyYyAhPT0gJ251bWJlcicpIHtcbiAgICAgIG9TZXR0aW5ncy5fcm93UmVhZE9iamVjdCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFvU2V0dGluZ3Mub0ZlYXR1cmVzLmJTb3J0KSB7XG4gICAgICBvQ29sLmJTb3J0YWJsZSA9IGZhbHNlO1xuICAgICAgdGguYWRkQ2xhc3Mob0NsYXNzZXMuc1NvcnRhYmxlTm9uZSk7XG4gICAgfVxuXG4gICAgdmFyIGJBc2MgPSAkLmluQXJyYXkoJ2FzYycsIG9Db2wuYXNTb3J0aW5nKSAhPT0gLTE7XG4gICAgdmFyIGJEZXNjID0gJC5pbkFycmF5KCdkZXNjJywgb0NvbC5hc1NvcnRpbmcpICE9PSAtMTtcblxuICAgIGlmICghb0NvbC5iU29ydGFibGUgfHwgIWJBc2MgJiYgIWJEZXNjKSB7XG4gICAgICBvQ29sLnNTb3J0aW5nQ2xhc3MgPSBvQ2xhc3Nlcy5zU29ydGFibGVOb25lO1xuICAgICAgb0NvbC5zU29ydGluZ0NsYXNzSlVJID0gXCJcIjtcbiAgICB9IGVsc2UgaWYgKGJBc2MgJiYgIWJEZXNjKSB7XG4gICAgICBvQ29sLnNTb3J0aW5nQ2xhc3MgPSBvQ2xhc3Nlcy5zU29ydGFibGVBc2M7XG4gICAgICBvQ29sLnNTb3J0aW5nQ2xhc3NKVUkgPSBvQ2xhc3Nlcy5zU29ydEpVSUFzY0FsbG93ZWQ7XG4gICAgfSBlbHNlIGlmICghYkFzYyAmJiBiRGVzYykge1xuICAgICAgb0NvbC5zU29ydGluZ0NsYXNzID0gb0NsYXNzZXMuc1NvcnRhYmxlRGVzYztcbiAgICAgIG9Db2wuc1NvcnRpbmdDbGFzc0pVSSA9IG9DbGFzc2VzLnNTb3J0SlVJRGVzY0FsbG93ZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9Db2wuc1NvcnRpbmdDbGFzcyA9IG9DbGFzc2VzLnNTb3J0YWJsZTtcbiAgICAgIG9Db2wuc1NvcnRpbmdDbGFzc0pVSSA9IG9DbGFzc2VzLnNTb3J0SlVJO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFkanVzdENvbHVtblNpemluZyhzZXR0aW5ncykge1xuICAgIGlmIChzZXR0aW5ncy5vRmVhdHVyZXMuYkF1dG9XaWR0aCAhPT0gZmFsc2UpIHtcbiAgICAgIHZhciBjb2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zO1xuXG4gICAgICBfZm5DYWxjdWxhdGVDb2x1bW5XaWR0aHMoc2V0dGluZ3MpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGNvbHVtbnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgIGNvbHVtbnNbaV0ublRoLnN0eWxlLndpZHRoID0gY29sdW1uc1tpXS5zV2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHNjcm9sbCA9IHNldHRpbmdzLm9TY3JvbGw7XG5cbiAgICBpZiAoc2Nyb2xsLnNZICE9PSAnJyB8fCBzY3JvbGwuc1ggIT09ICcnKSB7XG4gICAgICBfZm5TY3JvbGxEcmF3KHNldHRpbmdzKTtcbiAgICB9XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIG51bGwsICdjb2x1bW4tc2l6aW5nJywgW3NldHRpbmdzXSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5WaXNpYmxlVG9Db2x1bW5JbmRleChvU2V0dGluZ3MsIGlNYXRjaCkge1xuICAgIHZhciBhaVZpcyA9IF9mbkdldENvbHVtbnMob1NldHRpbmdzLCAnYlZpc2libGUnKTtcblxuICAgIHJldHVybiB0eXBlb2YgYWlWaXNbaU1hdGNoXSA9PT0gJ251bWJlcicgPyBhaVZpc1tpTWF0Y2hdIDogbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNvbHVtbkluZGV4VG9WaXNpYmxlKG9TZXR0aW5ncywgaU1hdGNoKSB7XG4gICAgdmFyIGFpVmlzID0gX2ZuR2V0Q29sdW1ucyhvU2V0dGluZ3MsICdiVmlzaWJsZScpO1xuXG4gICAgdmFyIGlQb3MgPSAkLmluQXJyYXkoaU1hdGNoLCBhaVZpcyk7XG4gICAgcmV0dXJuIGlQb3MgIT09IC0xID8gaVBvcyA6IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5WaXNibGVDb2x1bW5zKG9TZXR0aW5ncykge1xuICAgIHZhciB2aXMgPSAwO1xuICAgICQuZWFjaChvU2V0dGluZ3MuYW9Db2x1bW5zLCBmdW5jdGlvbiAoaSwgY29sKSB7XG4gICAgICBpZiAoY29sLmJWaXNpYmxlICYmICQoY29sLm5UaCkuY3NzKCdkaXNwbGF5JykgIT09ICdub25lJykge1xuICAgICAgICB2aXMrKztcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdmlzO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuR2V0Q29sdW1ucyhvU2V0dGluZ3MsIHNQYXJhbSkge1xuICAgIHZhciBhID0gW107XG4gICAgJC5tYXAob1NldHRpbmdzLmFvQ29sdW1ucywgZnVuY3Rpb24gKHZhbCwgaSkge1xuICAgICAgaWYgKHZhbFtzUGFyYW1dKSB7XG4gICAgICAgIGEucHVzaChpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNvbHVtblR5cGVzKHNldHRpbmdzKSB7XG4gICAgdmFyIGNvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnM7XG4gICAgdmFyIGRhdGEgPSBzZXR0aW5ncy5hb0RhdGE7XG4gICAgdmFyIHR5cGVzID0gRGF0YVRhYmxlLmV4dC50eXBlLmRldGVjdDtcbiAgICB2YXIgaSwgaWVuLCBqLCBqZW4sIGssIGtlbjtcbiAgICB2YXIgY29sLCBjZWxsLCBkZXRlY3RlZFR5cGUsIGNhY2hlO1xuXG4gICAgZm9yIChpID0gMCwgaWVuID0gY29sdW1ucy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgY29sID0gY29sdW1uc1tpXTtcbiAgICAgIGNhY2hlID0gW107XG5cbiAgICAgIGlmICghY29sLnNUeXBlICYmIGNvbC5fc01hbnVhbFR5cGUpIHtcbiAgICAgICAgY29sLnNUeXBlID0gY29sLl9zTWFudWFsVHlwZTtcbiAgICAgIH0gZWxzZSBpZiAoIWNvbC5zVHlwZSkge1xuICAgICAgICBmb3IgKGogPSAwLCBqZW4gPSB0eXBlcy5sZW5ndGg7IGogPCBqZW47IGorKykge1xuICAgICAgICAgIGZvciAoayA9IDAsIGtlbiA9IGRhdGEubGVuZ3RoOyBrIDwga2VuOyBrKyspIHtcbiAgICAgICAgICAgIGlmIChjYWNoZVtrXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGNhY2hlW2tdID0gX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIGssIGksICd0eXBlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRldGVjdGVkVHlwZSA9IHR5cGVzW2pdKGNhY2hlW2tdLCBzZXR0aW5ncyk7XG5cbiAgICAgICAgICAgIGlmICghZGV0ZWN0ZWRUeXBlICYmIGogIT09IHR5cGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkZXRlY3RlZFR5cGUgPT09ICdodG1sJykge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZGV0ZWN0ZWRUeXBlKSB7XG4gICAgICAgICAgICBjb2wuc1R5cGUgPSBkZXRlY3RlZFR5cGU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNvbC5zVHlwZSkge1xuICAgICAgICAgIGNvbC5zVHlwZSA9ICdzdHJpbmcnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQXBwbHlDb2x1bW5EZWZzKG9TZXR0aW5ncywgYW9Db2xEZWZzLCBhb0NvbHMsIGZuKSB7XG4gICAgdmFyIGksIGlMZW4sIGosIGpMZW4sIGssIGtMZW4sIGRlZjtcbiAgICB2YXIgY29sdW1ucyA9IG9TZXR0aW5ncy5hb0NvbHVtbnM7XG5cbiAgICBpZiAoYW9Db2xEZWZzKSB7XG4gICAgICBmb3IgKGkgPSBhb0NvbERlZnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgZGVmID0gYW9Db2xEZWZzW2ldO1xuICAgICAgICB2YXIgYVRhcmdldHMgPSBkZWYudGFyZ2V0cyAhPT0gdW5kZWZpbmVkID8gZGVmLnRhcmdldHMgOiBkZWYuYVRhcmdldHM7XG5cbiAgICAgICAgaWYgKCEkLmlzQXJyYXkoYVRhcmdldHMpKSB7XG4gICAgICAgICAgYVRhcmdldHMgPSBbYVRhcmdldHNdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChqID0gMCwgakxlbiA9IGFUYXJnZXRzLmxlbmd0aDsgaiA8IGpMZW47IGorKykge1xuICAgICAgICAgIGlmICh0eXBlb2YgYVRhcmdldHNbal0gPT09ICdudW1iZXInICYmIGFUYXJnZXRzW2pdID49IDApIHtcbiAgICAgICAgICAgIHdoaWxlIChjb2x1bW5zLmxlbmd0aCA8PSBhVGFyZ2V0c1tqXSkge1xuICAgICAgICAgICAgICBfZm5BZGRDb2x1bW4ob1NldHRpbmdzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm4oYVRhcmdldHNbal0sIGRlZik7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYVRhcmdldHNbal0gPT09ICdudW1iZXInICYmIGFUYXJnZXRzW2pdIDwgMCkge1xuICAgICAgICAgICAgZm4oY29sdW1ucy5sZW5ndGggKyBhVGFyZ2V0c1tqXSwgZGVmKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhVGFyZ2V0c1tqXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGZvciAoayA9IDAsIGtMZW4gPSBjb2x1bW5zLmxlbmd0aDsgayA8IGtMZW47IGsrKykge1xuICAgICAgICAgICAgICBpZiAoYVRhcmdldHNbal0gPT0gXCJfYWxsXCIgfHwgJChjb2x1bW5zW2tdLm5UaCkuaGFzQ2xhc3MoYVRhcmdldHNbal0pKSB7XG4gICAgICAgICAgICAgICAgZm4oaywgZGVmKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhb0NvbHMpIHtcbiAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhb0NvbHMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgIGZuKGksIGFvQ29sc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQWRkRGF0YShvU2V0dGluZ3MsIGFEYXRhSW4sIG5UciwgYW5UZHMpIHtcbiAgICB2YXIgaVJvdyA9IG9TZXR0aW5ncy5hb0RhdGEubGVuZ3RoO1xuICAgIHZhciBvRGF0YSA9ICQuZXh0ZW5kKHRydWUsIHt9LCBEYXRhVGFibGUubW9kZWxzLm9Sb3csIHtcbiAgICAgIHNyYzogblRyID8gJ2RvbScgOiAnZGF0YScsXG4gICAgICBpZHg6IGlSb3dcbiAgICB9KTtcbiAgICBvRGF0YS5fYURhdGEgPSBhRGF0YUluO1xuICAgIG9TZXR0aW5ncy5hb0RhdGEucHVzaChvRGF0YSk7XG4gICAgdmFyIG5UZCwgc1RoaXNUeXBlO1xuICAgIHZhciBjb2x1bW5zID0gb1NldHRpbmdzLmFvQ29sdW1ucztcblxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gY29sdW1ucy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIGNvbHVtbnNbaV0uc1R5cGUgPSBudWxsO1xuICAgIH1cblxuICAgIG9TZXR0aW5ncy5haURpc3BsYXlNYXN0ZXIucHVzaChpUm93KTtcbiAgICB2YXIgaWQgPSBvU2V0dGluZ3Mucm93SWRGbihhRGF0YUluKTtcblxuICAgIGlmIChpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvU2V0dGluZ3MuYUlkc1tpZF0gPSBvRGF0YTtcbiAgICB9XG5cbiAgICBpZiAoblRyIHx8ICFvU2V0dGluZ3Mub0ZlYXR1cmVzLmJEZWZlclJlbmRlcikge1xuICAgICAgX2ZuQ3JlYXRlVHIob1NldHRpbmdzLCBpUm93LCBuVHIsIGFuVGRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaVJvdztcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFkZFRyKHNldHRpbmdzLCB0cnMpIHtcbiAgICB2YXIgcm93O1xuXG4gICAgaWYgKCEodHJzIGluc3RhbmNlb2YgJCkpIHtcbiAgICAgIHRycyA9ICQodHJzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJzLm1hcChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgIHJvdyA9IF9mbkdldFJvd0VsZW1lbnRzKHNldHRpbmdzLCBlbCk7XG4gICAgICByZXR1cm4gX2ZuQWRkRGF0YShzZXR0aW5ncywgcm93LmRhdGEsIGVsLCByb3cuY2VsbHMpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuTm9kZVRvRGF0YUluZGV4KG9TZXR0aW5ncywgbikge1xuICAgIHJldHVybiBuLl9EVF9Sb3dJbmRleCAhPT0gdW5kZWZpbmVkID8gbi5fRFRfUm93SW5kZXggOiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuTm9kZVRvQ29sdW1uSW5kZXgob1NldHRpbmdzLCBpUm93LCBuKSB7XG4gICAgcmV0dXJuICQuaW5BcnJheShuLCBvU2V0dGluZ3MuYW9EYXRhW2lSb3ddLmFuQ2VsbHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIHJvd0lkeCwgY29sSWR4LCB0eXBlKSB7XG4gICAgdmFyIGRyYXcgPSBzZXR0aW5ncy5pRHJhdztcbiAgICB2YXIgY29sID0gc2V0dGluZ3MuYW9Db2x1bW5zW2NvbElkeF07XG4gICAgdmFyIHJvd0RhdGEgPSBzZXR0aW5ncy5hb0RhdGFbcm93SWR4XS5fYURhdGE7XG4gICAgdmFyIGRlZmF1bHRDb250ZW50ID0gY29sLnNEZWZhdWx0Q29udGVudDtcbiAgICB2YXIgY2VsbERhdGEgPSBjb2wuZm5HZXREYXRhKHJvd0RhdGEsIHR5cGUsIHtcbiAgICAgIHNldHRpbmdzOiBzZXR0aW5ncyxcbiAgICAgIHJvdzogcm93SWR4LFxuICAgICAgY29sOiBjb2xJZHhcbiAgICB9KTtcblxuICAgIGlmIChjZWxsRGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoc2V0dGluZ3MuaURyYXdFcnJvciAhPSBkcmF3ICYmIGRlZmF1bHRDb250ZW50ID09PSBudWxsKSB7XG4gICAgICAgIF9mbkxvZyhzZXR0aW5ncywgMCwgXCJSZXF1ZXN0ZWQgdW5rbm93biBwYXJhbWV0ZXIgXCIgKyAodHlwZW9mIGNvbC5tRGF0YSA9PSAnZnVuY3Rpb24nID8gJ3tmdW5jdGlvbn0nIDogXCInXCIgKyBjb2wubURhdGEgKyBcIidcIikgKyBcIiBmb3Igcm93IFwiICsgcm93SWR4ICsgXCIsIGNvbHVtbiBcIiArIGNvbElkeCwgNCk7XG5cbiAgICAgICAgc2V0dGluZ3MuaURyYXdFcnJvciA9IGRyYXc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZWZhdWx0Q29udGVudDtcbiAgICB9XG5cbiAgICBpZiAoKGNlbGxEYXRhID09PSByb3dEYXRhIHx8IGNlbGxEYXRhID09PSBudWxsKSAmJiBkZWZhdWx0Q29udGVudCAhPT0gbnVsbCAmJiB0eXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNlbGxEYXRhID0gZGVmYXVsdENvbnRlbnQ7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY2VsbERhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBjZWxsRGF0YS5jYWxsKHJvd0RhdGEpO1xuICAgIH1cblxuICAgIGlmIChjZWxsRGF0YSA9PT0gbnVsbCAmJiB0eXBlID09ICdkaXNwbGF5Jykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiBjZWxsRGF0YTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNldENlbGxEYXRhKHNldHRpbmdzLCByb3dJZHgsIGNvbElkeCwgdmFsKSB7XG4gICAgdmFyIGNvbCA9IHNldHRpbmdzLmFvQ29sdW1uc1tjb2xJZHhdO1xuICAgIHZhciByb3dEYXRhID0gc2V0dGluZ3MuYW9EYXRhW3Jvd0lkeF0uX2FEYXRhO1xuICAgIGNvbC5mblNldERhdGEocm93RGF0YSwgdmFsLCB7XG4gICAgICBzZXR0aW5nczogc2V0dGluZ3MsXG4gICAgICByb3c6IHJvd0lkeCxcbiAgICAgIGNvbDogY29sSWR4XG4gICAgfSk7XG4gIH1cblxuICB2YXIgX19yZUFycmF5ID0gL1xcWy4qP1xcXSQvO1xuICB2YXIgX19yZUZuID0gL1xcKFxcKSQvO1xuXG4gIGZ1bmN0aW9uIF9mblNwbGl0T2JqTm90YXRpb24oc3RyKSB7XG4gICAgcmV0dXJuICQubWFwKHN0ci5tYXRjaCgvKFxcXFwufFteXFwuXSkrL2cpIHx8IFsnJ10sIGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gcy5yZXBsYWNlKC9cXFxcXFwuL2csICcuJyk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5HZXRPYmplY3REYXRhRm4obVNvdXJjZSkge1xuICAgIGlmICgkLmlzUGxhaW5PYmplY3QobVNvdXJjZSkpIHtcbiAgICAgIHZhciBvID0ge307XG4gICAgICAkLmVhY2gobVNvdXJjZSwgZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICBvW2tleV0gPSBfZm5HZXRPYmplY3REYXRhRm4odmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIHR5cGUsIHJvdywgbWV0YSkge1xuICAgICAgICB2YXIgdCA9IG9bdHlwZV0gfHwgby5fO1xuICAgICAgICByZXR1cm4gdCAhPT0gdW5kZWZpbmVkID8gdChkYXRhLCB0eXBlLCByb3csIG1ldGEpIDogZGF0YTtcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtU291cmNlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1Tb3VyY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSwgdHlwZSwgcm93LCBtZXRhKSB7XG4gICAgICAgIHJldHVybiBtU291cmNlKGRhdGEsIHR5cGUsIHJvdywgbWV0YSk7XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1Tb3VyY2UgPT09ICdzdHJpbmcnICYmIChtU291cmNlLmluZGV4T2YoJy4nKSAhPT0gLTEgfHwgbVNvdXJjZS5pbmRleE9mKCdbJykgIT09IC0xIHx8IG1Tb3VyY2UuaW5kZXhPZignKCcpICE9PSAtMSkpIHtcbiAgICAgIHZhciBmZXRjaERhdGEgPSBmdW5jdGlvbiBmZXRjaERhdGEoZGF0YSwgdHlwZSwgc3JjKSB7XG4gICAgICAgIHZhciBhcnJheU5vdGF0aW9uLCBmdW5jTm90YXRpb24sIG91dCwgaW5uZXJTcmM7XG5cbiAgICAgICAgaWYgKHNyYyAhPT0gXCJcIikge1xuICAgICAgICAgIHZhciBhID0gX2ZuU3BsaXRPYmpOb3RhdGlvbihzcmMpO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSBhLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICAgICAgYXJyYXlOb3RhdGlvbiA9IGFbaV0ubWF0Y2goX19yZUFycmF5KTtcbiAgICAgICAgICAgIGZ1bmNOb3RhdGlvbiA9IGFbaV0ubWF0Y2goX19yZUZuKTtcblxuICAgICAgICAgICAgaWYgKGFycmF5Tm90YXRpb24pIHtcbiAgICAgICAgICAgICAgYVtpXSA9IGFbaV0ucmVwbGFjZShfX3JlQXJyYXksICcnKTtcblxuICAgICAgICAgICAgICBpZiAoYVtpXSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhW2FbaV1dO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgb3V0ID0gW107XG4gICAgICAgICAgICAgIGEuc3BsaWNlKDAsIGkgKyAxKTtcbiAgICAgICAgICAgICAgaW5uZXJTcmMgPSBhLmpvaW4oJy4nKTtcblxuICAgICAgICAgICAgICBpZiAoJC5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpMZW4gPSBkYXRhLmxlbmd0aDsgaiA8IGpMZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgb3V0LnB1c2goZmV0Y2hEYXRhKGRhdGFbal0sIHR5cGUsIGlubmVyU3JjKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIGpvaW4gPSBhcnJheU5vdGF0aW9uWzBdLnN1YnN0cmluZygxLCBhcnJheU5vdGF0aW9uWzBdLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICBkYXRhID0gam9pbiA9PT0gXCJcIiA/IG91dCA6IG91dC5qb2luKGpvaW4pO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZnVuY05vdGF0aW9uKSB7XG4gICAgICAgICAgICAgIGFbaV0gPSBhW2ldLnJlcGxhY2UoX19yZUZuLCAnJyk7XG4gICAgICAgICAgICAgIGRhdGEgPSBkYXRhW2FbaV1dKCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCB8fCBkYXRhW2FbaV1dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0YSA9IGRhdGFbYVtpXV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoRGF0YShkYXRhLCB0eXBlLCBtU291cmNlKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSwgdHlwZSkge1xuICAgICAgICByZXR1cm4gZGF0YVttU291cmNlXTtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU2V0T2JqZWN0RGF0YUZuKG1Tb3VyY2UpIHtcbiAgICBpZiAoJC5pc1BsYWluT2JqZWN0KG1Tb3VyY2UpKSB7XG4gICAgICByZXR1cm4gX2ZuU2V0T2JqZWN0RGF0YUZuKG1Tb3VyY2UuXyk7XG4gICAgfSBlbHNlIGlmIChtU291cmNlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge307XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbVNvdXJjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhLCB2YWwsIG1ldGEpIHtcbiAgICAgICAgbVNvdXJjZShkYXRhLCAnc2V0JywgdmFsLCBtZXRhKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbVNvdXJjZSA9PT0gJ3N0cmluZycgJiYgKG1Tb3VyY2UuaW5kZXhPZignLicpICE9PSAtMSB8fCBtU291cmNlLmluZGV4T2YoJ1snKSAhPT0gLTEgfHwgbVNvdXJjZS5pbmRleE9mKCcoJykgIT09IC0xKSkge1xuICAgICAgdmFyIHNldERhdGEgPSBmdW5jdGlvbiBzZXREYXRhKGRhdGEsIHZhbCwgc3JjKSB7XG4gICAgICAgIHZhciBhID0gX2ZuU3BsaXRPYmpOb3RhdGlvbihzcmMpLFxuICAgICAgICAgICAgYjtcblxuICAgICAgICB2YXIgYUxhc3QgPSBhW2EubGVuZ3RoIC0gMV07XG4gICAgICAgIHZhciBhcnJheU5vdGF0aW9uLCBmdW5jTm90YXRpb24sIG8sIGlubmVyU3JjO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gYS5sZW5ndGggLSAxOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgICAgYXJyYXlOb3RhdGlvbiA9IGFbaV0ubWF0Y2goX19yZUFycmF5KTtcbiAgICAgICAgICBmdW5jTm90YXRpb24gPSBhW2ldLm1hdGNoKF9fcmVGbik7XG5cbiAgICAgICAgICBpZiAoYXJyYXlOb3RhdGlvbikge1xuICAgICAgICAgICAgYVtpXSA9IGFbaV0ucmVwbGFjZShfX3JlQXJyYXksICcnKTtcbiAgICAgICAgICAgIGRhdGFbYVtpXV0gPSBbXTtcbiAgICAgICAgICAgIGIgPSBhLnNsaWNlKCk7XG4gICAgICAgICAgICBiLnNwbGljZSgwLCBpICsgMSk7XG4gICAgICAgICAgICBpbm5lclNyYyA9IGIuam9pbignLicpO1xuXG4gICAgICAgICAgICBpZiAoJC5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpMZW4gPSB2YWwubGVuZ3RoOyBqIDwgakxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgbyA9IHt9O1xuICAgICAgICAgICAgICAgIHNldERhdGEobywgdmFsW2pdLCBpbm5lclNyYyk7XG4gICAgICAgICAgICAgICAgZGF0YVthW2ldXS5wdXNoKG8pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBkYXRhW2FbaV1dID0gdmFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIGlmIChmdW5jTm90YXRpb24pIHtcbiAgICAgICAgICAgIGFbaV0gPSBhW2ldLnJlcGxhY2UoX19yZUZuLCAnJyk7XG4gICAgICAgICAgICBkYXRhID0gZGF0YVthW2ldXSh2YWwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkYXRhW2FbaV1dID09PSBudWxsIHx8IGRhdGFbYVtpXV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGF0YVthW2ldXSA9IHt9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRhdGEgPSBkYXRhW2FbaV1dO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFMYXN0Lm1hdGNoKF9fcmVGbikpIHtcbiAgICAgICAgICBkYXRhID0gZGF0YVthTGFzdC5yZXBsYWNlKF9fcmVGbiwgJycpXSh2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGFbYUxhc3QucmVwbGFjZShfX3JlQXJyYXksICcnKV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSwgdmFsKSB7XG4gICAgICAgIHJldHVybiBzZXREYXRhKGRhdGEsIHZhbCwgbVNvdXJjZSk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIHZhbCkge1xuICAgICAgICBkYXRhW21Tb3VyY2VdID0gdmFsO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5HZXREYXRhTWFzdGVyKHNldHRpbmdzKSB7XG4gICAgcmV0dXJuIF9wbHVjayhzZXR0aW5ncy5hb0RhdGEsICdfYURhdGEnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNsZWFyVGFibGUoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncy5hb0RhdGEubGVuZ3RoID0gMDtcbiAgICBzZXR0aW5ncy5haURpc3BsYXlNYXN0ZXIubGVuZ3RoID0gMDtcbiAgICBzZXR0aW5ncy5haURpc3BsYXkubGVuZ3RoID0gMDtcbiAgICBzZXR0aW5ncy5hSWRzID0ge307XG4gIH1cblxuICBmdW5jdGlvbiBfZm5EZWxldGVJbmRleChhLCBpVGFyZ2V0LCBzcGxpY2UpIHtcbiAgICB2YXIgaVRhcmdldEluZGV4ID0gLTE7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGEubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICBpZiAoYVtpXSA9PSBpVGFyZ2V0KSB7XG4gICAgICAgIGlUYXJnZXRJbmRleCA9IGk7XG4gICAgICB9IGVsc2UgaWYgKGFbaV0gPiBpVGFyZ2V0KSB7XG4gICAgICAgIGFbaV0tLTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaVRhcmdldEluZGV4ICE9IC0xICYmIHNwbGljZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhLnNwbGljZShpVGFyZ2V0SW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkludmFsaWRhdGUoc2V0dGluZ3MsIHJvd0lkeCwgc3JjLCBjb2xJZHgpIHtcbiAgICB2YXIgcm93ID0gc2V0dGluZ3MuYW9EYXRhW3Jvd0lkeF07XG4gICAgdmFyIGksIGllbjtcblxuICAgIHZhciBjZWxsV3JpdGUgPSBmdW5jdGlvbiBjZWxsV3JpdGUoY2VsbCwgY29sKSB7XG4gICAgICB3aGlsZSAoY2VsbC5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBjZWxsLnJlbW92ZUNoaWxkKGNlbGwuZmlyc3RDaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIGNlbGwuaW5uZXJIVE1MID0gX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIHJvd0lkeCwgY29sLCAnZGlzcGxheScpO1xuICAgIH07XG5cbiAgICBpZiAoc3JjID09PSAnZG9tJyB8fCAoIXNyYyB8fCBzcmMgPT09ICdhdXRvJykgJiYgcm93LnNyYyA9PT0gJ2RvbScpIHtcbiAgICAgIHJvdy5fYURhdGEgPSBfZm5HZXRSb3dFbGVtZW50cyhzZXR0aW5ncywgcm93LCBjb2xJZHgsIGNvbElkeCA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogcm93Ll9hRGF0YSkuZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNlbGxzID0gcm93LmFuQ2VsbHM7XG5cbiAgICAgIGlmIChjZWxscykge1xuICAgICAgICBpZiAoY29sSWR4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjZWxsV3JpdGUoY2VsbHNbY29sSWR4XSwgY29sSWR4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGkgPSAwLCBpZW4gPSBjZWxscy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgICAgY2VsbFdyaXRlKGNlbGxzW2ldLCBpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByb3cuX2FTb3J0RGF0YSA9IG51bGw7XG4gICAgcm93Ll9hRmlsdGVyRGF0YSA9IG51bGw7XG4gICAgdmFyIGNvbHMgPSBzZXR0aW5ncy5hb0NvbHVtbnM7XG5cbiAgICBpZiAoY29sSWR4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbHNbY29sSWR4XS5zVHlwZSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IGNvbHMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgY29sc1tpXS5zVHlwZSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIF9mblJvd0F0dHJpYnV0ZXMoc2V0dGluZ3MsIHJvdyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuR2V0Um93RWxlbWVudHMoc2V0dGluZ3MsIHJvdywgY29sSWR4LCBkKSB7XG4gICAgdmFyIHRkcyA9IFtdLFxuICAgICAgICB0ZCA9IHJvdy5maXJzdENoaWxkLFxuICAgICAgICBuYW1lLFxuICAgICAgICBjb2wsXG4gICAgICAgIG8sXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBjb250ZW50cyxcbiAgICAgICAgY29sdW1ucyA9IHNldHRpbmdzLmFvQ29sdW1ucyxcbiAgICAgICAgb2JqZWN0UmVhZCA9IHNldHRpbmdzLl9yb3dSZWFkT2JqZWN0O1xuICAgIGQgPSBkICE9PSB1bmRlZmluZWQgPyBkIDogb2JqZWN0UmVhZCA/IHt9IDogW107XG5cbiAgICB2YXIgYXR0ciA9IGZ1bmN0aW9uIGF0dHIoc3RyLCB0ZCkge1xuICAgICAgaWYgKHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhciBpZHggPSBzdHIuaW5kZXhPZignQCcpO1xuXG4gICAgICAgIGlmIChpZHggIT09IC0xKSB7XG4gICAgICAgICAgdmFyIGF0dHIgPSBzdHIuc3Vic3RyaW5nKGlkeCArIDEpO1xuXG4gICAgICAgICAgdmFyIHNldHRlciA9IF9mblNldE9iamVjdERhdGFGbihzdHIpO1xuXG4gICAgICAgICAgc2V0dGVyKGQsIHRkLmdldEF0dHJpYnV0ZShhdHRyKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGNlbGxQcm9jZXNzID0gZnVuY3Rpb24gY2VsbFByb2Nlc3MoY2VsbCkge1xuICAgICAgaWYgKGNvbElkeCA9PT0gdW5kZWZpbmVkIHx8IGNvbElkeCA9PT0gaSkge1xuICAgICAgICBjb2wgPSBjb2x1bW5zW2ldO1xuICAgICAgICBjb250ZW50cyA9ICQudHJpbShjZWxsLmlubmVySFRNTCk7XG5cbiAgICAgICAgaWYgKGNvbCAmJiBjb2wuX2JBdHRyU3JjKSB7XG4gICAgICAgICAgdmFyIHNldHRlciA9IF9mblNldE9iamVjdERhdGFGbihjb2wubURhdGEuXyk7XG5cbiAgICAgICAgICBzZXR0ZXIoZCwgY29udGVudHMpO1xuICAgICAgICAgIGF0dHIoY29sLm1EYXRhLnNvcnQsIGNlbGwpO1xuICAgICAgICAgIGF0dHIoY29sLm1EYXRhLnR5cGUsIGNlbGwpO1xuICAgICAgICAgIGF0dHIoY29sLm1EYXRhLmZpbHRlciwgY2VsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9iamVjdFJlYWQpIHtcbiAgICAgICAgICAgIGlmICghY29sLl9zZXR0ZXIpIHtcbiAgICAgICAgICAgICAgY29sLl9zZXR0ZXIgPSBfZm5TZXRPYmplY3REYXRhRm4oY29sLm1EYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sLl9zZXR0ZXIoZCwgY29udGVudHMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkW2ldID0gY29udGVudHM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGkrKztcbiAgICB9O1xuXG4gICAgaWYgKHRkKSB7XG4gICAgICB3aGlsZSAodGQpIHtcbiAgICAgICAgbmFtZSA9IHRkLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgaWYgKG5hbWUgPT0gXCJURFwiIHx8IG5hbWUgPT0gXCJUSFwiKSB7XG4gICAgICAgICAgY2VsbFByb2Nlc3ModGQpO1xuICAgICAgICAgIHRkcy5wdXNoKHRkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRkID0gdGQubmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRkcyA9IHJvdy5hbkNlbGxzO1xuXG4gICAgICBmb3IgKHZhciBqID0gMCwgamVuID0gdGRzLmxlbmd0aDsgaiA8IGplbjsgaisrKSB7XG4gICAgICAgIGNlbGxQcm9jZXNzKHRkc1tqXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHJvd05vZGUgPSByb3cuZmlyc3RDaGlsZCA/IHJvdyA6IHJvdy5uVHI7XG5cbiAgICBpZiAocm93Tm9kZSkge1xuICAgICAgdmFyIGlkID0gcm93Tm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgICAgIGlmIChpZCkge1xuICAgICAgICBfZm5TZXRPYmplY3REYXRhRm4oc2V0dGluZ3Mucm93SWQpKGQsIGlkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogZCxcbiAgICAgIGNlbGxzOiB0ZHNcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQ3JlYXRlVHIob1NldHRpbmdzLCBpUm93LCBuVHJJbiwgYW5UZHMpIHtcbiAgICB2YXIgcm93ID0gb1NldHRpbmdzLmFvRGF0YVtpUm93XSxcbiAgICAgICAgcm93RGF0YSA9IHJvdy5fYURhdGEsXG4gICAgICAgIGNlbGxzID0gW10sXG4gICAgICAgIG5UcixcbiAgICAgICAgblRkLFxuICAgICAgICBvQ29sLFxuICAgICAgICBpLFxuICAgICAgICBpTGVuO1xuXG4gICAgaWYgKHJvdy5uVHIgPT09IG51bGwpIHtcbiAgICAgIG5UciA9IG5UckluIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICByb3cublRyID0gblRyO1xuICAgICAgcm93LmFuQ2VsbHMgPSBjZWxscztcbiAgICAgIG5Uci5fRFRfUm93SW5kZXggPSBpUm93O1xuXG4gICAgICBfZm5Sb3dBdHRyaWJ1dGVzKG9TZXR0aW5ncywgcm93KTtcblxuICAgICAgZm9yIChpID0gMCwgaUxlbiA9IG9TZXR0aW5ncy5hb0NvbHVtbnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgIG9Db2wgPSBvU2V0dGluZ3MuYW9Db2x1bW5zW2ldO1xuICAgICAgICBuVGQgPSBuVHJJbiA/IGFuVGRzW2ldIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChvQ29sLnNDZWxsVHlwZSk7XG4gICAgICAgIG5UZC5fRFRfQ2VsbEluZGV4ID0ge1xuICAgICAgICAgIHJvdzogaVJvdyxcbiAgICAgICAgICBjb2x1bW46IGlcbiAgICAgICAgfTtcbiAgICAgICAgY2VsbHMucHVzaChuVGQpO1xuXG4gICAgICAgIGlmICgoIW5UckluIHx8IG9Db2wubVJlbmRlciB8fCBvQ29sLm1EYXRhICE9PSBpKSAmJiAoISQuaXNQbGFpbk9iamVjdChvQ29sLm1EYXRhKSB8fCBvQ29sLm1EYXRhLl8gIT09IGkgKyAnLmRpc3BsYXknKSkge1xuICAgICAgICAgIG5UZC5pbm5lckhUTUwgPSBfZm5HZXRDZWxsRGF0YShvU2V0dGluZ3MsIGlSb3csIGksICdkaXNwbGF5Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob0NvbC5zQ2xhc3MpIHtcbiAgICAgICAgICBuVGQuY2xhc3NOYW1lICs9ICcgJyArIG9Db2wuc0NsYXNzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9Db2wuYlZpc2libGUgJiYgIW5UckluKSB7XG4gICAgICAgICAgblRyLmFwcGVuZENoaWxkKG5UZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIW9Db2wuYlZpc2libGUgJiYgblRySW4pIHtcbiAgICAgICAgICBuVGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChuVGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9Db2wuZm5DcmVhdGVkQ2VsbCkge1xuICAgICAgICAgIG9Db2wuZm5DcmVhdGVkQ2VsbC5jYWxsKG9TZXR0aW5ncy5vSW5zdGFuY2UsIG5UZCwgX2ZuR2V0Q2VsbERhdGEob1NldHRpbmdzLCBpUm93LCBpKSwgcm93RGF0YSwgaVJvdywgaSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgJ2FvUm93Q3JlYXRlZENhbGxiYWNrJywgbnVsbCwgW25Uciwgcm93RGF0YSwgaVJvdywgY2VsbHNdKTtcbiAgICB9XG5cbiAgICByb3cublRyLnNldEF0dHJpYnV0ZSgncm9sZScsICdyb3cnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblJvd0F0dHJpYnV0ZXMoc2V0dGluZ3MsIHJvdykge1xuICAgIHZhciB0ciA9IHJvdy5uVHI7XG4gICAgdmFyIGRhdGEgPSByb3cuX2FEYXRhO1xuXG4gICAgaWYgKHRyKSB7XG4gICAgICB2YXIgaWQgPSBzZXR0aW5ncy5yb3dJZEZuKGRhdGEpO1xuXG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgdHIuaWQgPSBpZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEuRFRfUm93Q2xhc3MpIHtcbiAgICAgICAgdmFyIGEgPSBkYXRhLkRUX1Jvd0NsYXNzLnNwbGl0KCcgJyk7XG4gICAgICAgIHJvdy5fX3Jvd2MgPSByb3cuX19yb3djID8gX3VuaXF1ZShyb3cuX19yb3djLmNvbmNhdChhKSkgOiBhO1xuICAgICAgICAkKHRyKS5yZW1vdmVDbGFzcyhyb3cuX19yb3djLmpvaW4oJyAnKSkuYWRkQ2xhc3MoZGF0YS5EVF9Sb3dDbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhLkRUX1Jvd0F0dHIpIHtcbiAgICAgICAgJCh0cikuYXR0cihkYXRhLkRUX1Jvd0F0dHIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YS5EVF9Sb3dEYXRhKSB7XG4gICAgICAgICQodHIpLmRhdGEoZGF0YS5EVF9Sb3dEYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5CdWlsZEhlYWQob1NldHRpbmdzKSB7XG4gICAgdmFyIGksIGllbiwgY2VsbCwgcm93LCBjb2x1bW47XG4gICAgdmFyIHRoZWFkID0gb1NldHRpbmdzLm5USGVhZDtcbiAgICB2YXIgdGZvb3QgPSBvU2V0dGluZ3MublRGb290O1xuICAgIHZhciBjcmVhdGVIZWFkZXIgPSAkKCd0aCwgdGQnLCB0aGVhZCkubGVuZ3RoID09PSAwO1xuICAgIHZhciBjbGFzc2VzID0gb1NldHRpbmdzLm9DbGFzc2VzO1xuICAgIHZhciBjb2x1bW5zID0gb1NldHRpbmdzLmFvQ29sdW1ucztcblxuICAgIGlmIChjcmVhdGVIZWFkZXIpIHtcbiAgICAgIHJvdyA9ICQoJzx0ci8+JykuYXBwZW5kVG8odGhlYWQpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGllbiA9IGNvbHVtbnMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIGNvbHVtbiA9IGNvbHVtbnNbaV07XG4gICAgICBjZWxsID0gJChjb2x1bW4ublRoKS5hZGRDbGFzcyhjb2x1bW4uc0NsYXNzKTtcblxuICAgICAgaWYgKGNyZWF0ZUhlYWRlcikge1xuICAgICAgICBjZWxsLmFwcGVuZFRvKHJvdyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvU2V0dGluZ3Mub0ZlYXR1cmVzLmJTb3J0KSB7XG4gICAgICAgIGNlbGwuYWRkQ2xhc3MoY29sdW1uLnNTb3J0aW5nQ2xhc3MpO1xuXG4gICAgICAgIGlmIChjb2x1bW4uYlNvcnRhYmxlICE9PSBmYWxzZSkge1xuICAgICAgICAgIGNlbGwuYXR0cigndGFiaW5kZXgnLCBvU2V0dGluZ3MuaVRhYkluZGV4KS5hdHRyKCdhcmlhLWNvbnRyb2xzJywgb1NldHRpbmdzLnNUYWJsZUlkKTtcblxuICAgICAgICAgIF9mblNvcnRBdHRhY2hMaXN0ZW5lcihvU2V0dGluZ3MsIGNvbHVtbi5uVGgsIGkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjb2x1bW4uc1RpdGxlICE9IGNlbGxbMF0uaW5uZXJIVE1MKSB7XG4gICAgICAgIGNlbGwuaHRtbChjb2x1bW4uc1RpdGxlKTtcbiAgICAgIH1cblxuICAgICAgX2ZuUmVuZGVyZXIob1NldHRpbmdzLCAnaGVhZGVyJykob1NldHRpbmdzLCBjZWxsLCBjb2x1bW4sIGNsYXNzZXMpO1xuICAgIH1cblxuICAgIGlmIChjcmVhdGVIZWFkZXIpIHtcbiAgICAgIF9mbkRldGVjdEhlYWRlcihvU2V0dGluZ3MuYW9IZWFkZXIsIHRoZWFkKTtcbiAgICB9XG5cbiAgICAkKHRoZWFkKS5maW5kKCc+dHInKS5hdHRyKCdyb2xlJywgJ3JvdycpO1xuICAgICQodGhlYWQpLmZpbmQoJz50cj50aCwgPnRyPnRkJykuYWRkQ2xhc3MoY2xhc3Nlcy5zSGVhZGVyVEgpO1xuICAgICQodGZvb3QpLmZpbmQoJz50cj50aCwgPnRyPnRkJykuYWRkQ2xhc3MoY2xhc3Nlcy5zRm9vdGVyVEgpO1xuXG4gICAgaWYgKHRmb290ICE9PSBudWxsKSB7XG4gICAgICB2YXIgY2VsbHMgPSBvU2V0dGluZ3MuYW9Gb290ZXJbMF07XG5cbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IGNlbGxzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIGNvbHVtbiA9IGNvbHVtbnNbaV07XG4gICAgICAgIGNvbHVtbi5uVGYgPSBjZWxsc1tpXS5jZWxsO1xuXG4gICAgICAgIGlmIChjb2x1bW4uc0NsYXNzKSB7XG4gICAgICAgICAgJChjb2x1bW4ublRmKS5hZGRDbGFzcyhjb2x1bW4uc0NsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkRyYXdIZWFkKG9TZXR0aW5ncywgYW9Tb3VyY2UsIGJJbmNsdWRlSGlkZGVuKSB7XG4gICAgdmFyIGksIGlMZW4sIGosIGpMZW4sIGssIGtMZW4sIG4sIG5Mb2NhbFRyO1xuICAgIHZhciBhb0xvY2FsID0gW107XG4gICAgdmFyIGFBcHBsaWVkID0gW107XG4gICAgdmFyIGlDb2x1bW5zID0gb1NldHRpbmdzLmFvQ29sdW1ucy5sZW5ndGg7XG4gICAgdmFyIGlSb3dzcGFuLCBpQ29sc3BhbjtcblxuICAgIGlmICghYW9Tb3VyY2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoYkluY2x1ZGVIaWRkZW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgYkluY2x1ZGVIaWRkZW4gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW9Tb3VyY2UubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICBhb0xvY2FsW2ldID0gYW9Tb3VyY2VbaV0uc2xpY2UoKTtcbiAgICAgIGFvTG9jYWxbaV0ublRyID0gYW9Tb3VyY2VbaV0ublRyO1xuXG4gICAgICBmb3IgKGogPSBpQ29sdW1ucyAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICAgIGlmICghb1NldHRpbmdzLmFvQ29sdW1uc1tqXS5iVmlzaWJsZSAmJiAhYkluY2x1ZGVIaWRkZW4pIHtcbiAgICAgICAgICBhb0xvY2FsW2ldLnNwbGljZShqLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhQXBwbGllZC5wdXNoKFtdKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBpTGVuID0gYW9Mb2NhbC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIG5Mb2NhbFRyID0gYW9Mb2NhbFtpXS5uVHI7XG5cbiAgICAgIGlmIChuTG9jYWxUcikge1xuICAgICAgICB3aGlsZSAobiA9IG5Mb2NhbFRyLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICBuTG9jYWxUci5yZW1vdmVDaGlsZChuKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGogPSAwLCBqTGVuID0gYW9Mb2NhbFtpXS5sZW5ndGg7IGogPCBqTGVuOyBqKyspIHtcbiAgICAgICAgaVJvd3NwYW4gPSAxO1xuICAgICAgICBpQ29sc3BhbiA9IDE7XG5cbiAgICAgICAgaWYgKGFBcHBsaWVkW2ldW2pdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBuTG9jYWxUci5hcHBlbmRDaGlsZChhb0xvY2FsW2ldW2pdLmNlbGwpO1xuICAgICAgICAgIGFBcHBsaWVkW2ldW2pdID0gMTtcblxuICAgICAgICAgIHdoaWxlIChhb0xvY2FsW2kgKyBpUm93c3Bhbl0gIT09IHVuZGVmaW5lZCAmJiBhb0xvY2FsW2ldW2pdLmNlbGwgPT0gYW9Mb2NhbFtpICsgaVJvd3NwYW5dW2pdLmNlbGwpIHtcbiAgICAgICAgICAgIGFBcHBsaWVkW2kgKyBpUm93c3Bhbl1bal0gPSAxO1xuICAgICAgICAgICAgaVJvd3NwYW4rKztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB3aGlsZSAoYW9Mb2NhbFtpXVtqICsgaUNvbHNwYW5dICE9PSB1bmRlZmluZWQgJiYgYW9Mb2NhbFtpXVtqXS5jZWxsID09IGFvTG9jYWxbaV1baiArIGlDb2xzcGFuXS5jZWxsKSB7XG4gICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgaVJvd3NwYW47IGsrKykge1xuICAgICAgICAgICAgICBhQXBwbGllZFtpICsga11baiArIGlDb2xzcGFuXSA9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlDb2xzcGFuKys7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJChhb0xvY2FsW2ldW2pdLmNlbGwpLmF0dHIoJ3Jvd3NwYW4nLCBpUm93c3BhbikuYXR0cignY29sc3BhbicsIGlDb2xzcGFuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkRyYXcob1NldHRpbmdzKSB7XG4gICAgdmFyIGFQcmVEcmF3ID0gX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgJ2FvUHJlRHJhd0NhbGxiYWNrJywgJ3ByZURyYXcnLCBbb1NldHRpbmdzXSk7XG5cbiAgICBpZiAoJC5pbkFycmF5KGZhbHNlLCBhUHJlRHJhdykgIT09IC0xKSB7XG4gICAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShvU2V0dGluZ3MsIGZhbHNlKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBpLCBpTGVuLCBuO1xuICAgIHZhciBhblJvd3MgPSBbXTtcbiAgICB2YXIgaVJvd0NvdW50ID0gMDtcbiAgICB2YXIgYXNTdHJpcGVDbGFzc2VzID0gb1NldHRpbmdzLmFzU3RyaXBlQ2xhc3NlcztcbiAgICB2YXIgaVN0cmlwZXMgPSBhc1N0cmlwZUNsYXNzZXMubGVuZ3RoO1xuICAgIHZhciBpT3BlblJvd3MgPSBvU2V0dGluZ3MuYW9PcGVuUm93cy5sZW5ndGg7XG4gICAgdmFyIG9MYW5nID0gb1NldHRpbmdzLm9MYW5ndWFnZTtcbiAgICB2YXIgaUluaXREaXNwbGF5U3RhcnQgPSBvU2V0dGluZ3MuaUluaXREaXNwbGF5U3RhcnQ7XG4gICAgdmFyIGJTZXJ2ZXJTaWRlID0gX2ZuRGF0YVNvdXJjZShvU2V0dGluZ3MpID09ICdzc3AnO1xuICAgIHZhciBhaURpc3BsYXkgPSBvU2V0dGluZ3MuYWlEaXNwbGF5O1xuICAgIG9TZXR0aW5ncy5iRHJhd2luZyA9IHRydWU7XG5cbiAgICBpZiAoaUluaXREaXNwbGF5U3RhcnQgIT09IHVuZGVmaW5lZCAmJiBpSW5pdERpc3BsYXlTdGFydCAhPT0gLTEpIHtcbiAgICAgIG9TZXR0aW5ncy5faURpc3BsYXlTdGFydCA9IGJTZXJ2ZXJTaWRlID8gaUluaXREaXNwbGF5U3RhcnQgOiBpSW5pdERpc3BsYXlTdGFydCA+PSBvU2V0dGluZ3MuZm5SZWNvcmRzRGlzcGxheSgpID8gMCA6IGlJbml0RGlzcGxheVN0YXJ0O1xuICAgICAgb1NldHRpbmdzLmlJbml0RGlzcGxheVN0YXJ0ID0gLTE7XG4gICAgfVxuXG4gICAgdmFyIGlEaXNwbGF5U3RhcnQgPSBvU2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQ7XG4gICAgdmFyIGlEaXNwbGF5RW5kID0gb1NldHRpbmdzLmZuRGlzcGxheUVuZCgpO1xuXG4gICAgaWYgKG9TZXR0aW5ncy5iRGVmZXJMb2FkaW5nKSB7XG4gICAgICBvU2V0dGluZ3MuYkRlZmVyTG9hZGluZyA9IGZhbHNlO1xuICAgICAgb1NldHRpbmdzLmlEcmF3Kys7XG5cbiAgICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KG9TZXR0aW5ncywgZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAoIWJTZXJ2ZXJTaWRlKSB7XG4gICAgICBvU2V0dGluZ3MuaURyYXcrKztcbiAgICB9IGVsc2UgaWYgKCFvU2V0dGluZ3MuYkRlc3Ryb3lpbmcgJiYgIV9mbkFqYXhVcGRhdGUob1NldHRpbmdzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChhaURpc3BsYXkubGVuZ3RoICE9PSAwKSB7XG4gICAgICB2YXIgaVN0YXJ0ID0gYlNlcnZlclNpZGUgPyAwIDogaURpc3BsYXlTdGFydDtcbiAgICAgIHZhciBpRW5kID0gYlNlcnZlclNpZGUgPyBvU2V0dGluZ3MuYW9EYXRhLmxlbmd0aCA6IGlEaXNwbGF5RW5kO1xuXG4gICAgICBmb3IgKHZhciBqID0gaVN0YXJ0OyBqIDwgaUVuZDsgaisrKSB7XG4gICAgICAgIHZhciBpRGF0YUluZGV4ID0gYWlEaXNwbGF5W2pdO1xuICAgICAgICB2YXIgYW9EYXRhID0gb1NldHRpbmdzLmFvRGF0YVtpRGF0YUluZGV4XTtcblxuICAgICAgICBpZiAoYW9EYXRhLm5UciA9PT0gbnVsbCkge1xuICAgICAgICAgIF9mbkNyZWF0ZVRyKG9TZXR0aW5ncywgaURhdGFJbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgblJvdyA9IGFvRGF0YS5uVHI7XG5cbiAgICAgICAgaWYgKGlTdHJpcGVzICE9PSAwKSB7XG4gICAgICAgICAgdmFyIHNTdHJpcGUgPSBhc1N0cmlwZUNsYXNzZXNbaVJvd0NvdW50ICUgaVN0cmlwZXNdO1xuXG4gICAgICAgICAgaWYgKGFvRGF0YS5fc1Jvd1N0cmlwZSAhPSBzU3RyaXBlKSB7XG4gICAgICAgICAgICAkKG5Sb3cpLnJlbW92ZUNsYXNzKGFvRGF0YS5fc1Jvd1N0cmlwZSkuYWRkQ2xhc3Moc1N0cmlwZSk7XG4gICAgICAgICAgICBhb0RhdGEuX3NSb3dTdHJpcGUgPSBzU3RyaXBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9mbkNhbGxiYWNrRmlyZShvU2V0dGluZ3MsICdhb1Jvd0NhbGxiYWNrJywgbnVsbCwgW25Sb3csIGFvRGF0YS5fYURhdGEsIGlSb3dDb3VudCwgaiwgaURhdGFJbmRleF0pO1xuXG4gICAgICAgIGFuUm93cy5wdXNoKG5Sb3cpO1xuICAgICAgICBpUm93Q291bnQrKztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHNaZXJvID0gb0xhbmcuc1plcm9SZWNvcmRzO1xuXG4gICAgICBpZiAob1NldHRpbmdzLmlEcmF3ID09IDEgJiYgX2ZuRGF0YVNvdXJjZShvU2V0dGluZ3MpID09ICdhamF4Jykge1xuICAgICAgICBzWmVybyA9IG9MYW5nLnNMb2FkaW5nUmVjb3JkcztcbiAgICAgIH0gZWxzZSBpZiAob0xhbmcuc0VtcHR5VGFibGUgJiYgb1NldHRpbmdzLmZuUmVjb3Jkc1RvdGFsKCkgPT09IDApIHtcbiAgICAgICAgc1plcm8gPSBvTGFuZy5zRW1wdHlUYWJsZTtcbiAgICAgIH1cblxuICAgICAgYW5Sb3dzWzBdID0gJCgnPHRyLz4nLCB7XG4gICAgICAgICdjbGFzcyc6IGlTdHJpcGVzID8gYXNTdHJpcGVDbGFzc2VzWzBdIDogJydcbiAgICAgIH0pLmFwcGVuZCgkKCc8dGQgLz4nLCB7XG4gICAgICAgICd2YWxpZ24nOiAndG9wJyxcbiAgICAgICAgJ2NvbFNwYW4nOiBfZm5WaXNibGVDb2x1bW5zKG9TZXR0aW5ncyksXG4gICAgICAgICdjbGFzcyc6IG9TZXR0aW5ncy5vQ2xhc3Nlcy5zUm93RW1wdHlcbiAgICAgIH0pLmh0bWwoc1plcm8pKVswXTtcbiAgICB9XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCAnYW9IZWFkZXJDYWxsYmFjaycsICdoZWFkZXInLCBbJChvU2V0dGluZ3MublRIZWFkKS5jaGlsZHJlbigndHInKVswXSwgX2ZuR2V0RGF0YU1hc3RlcihvU2V0dGluZ3MpLCBpRGlzcGxheVN0YXJ0LCBpRGlzcGxheUVuZCwgYWlEaXNwbGF5XSk7XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCAnYW9Gb290ZXJDYWxsYmFjaycsICdmb290ZXInLCBbJChvU2V0dGluZ3MublRGb290KS5jaGlsZHJlbigndHInKVswXSwgX2ZuR2V0RGF0YU1hc3RlcihvU2V0dGluZ3MpLCBpRGlzcGxheVN0YXJ0LCBpRGlzcGxheUVuZCwgYWlEaXNwbGF5XSk7XG5cbiAgICB2YXIgYm9keSA9ICQob1NldHRpbmdzLm5UQm9keSk7XG4gICAgYm9keS5jaGlsZHJlbigpLmRldGFjaCgpO1xuICAgIGJvZHkuYXBwZW5kKCQoYW5Sb3dzKSk7XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCAnYW9EcmF3Q2FsbGJhY2snLCAnZHJhdycsIFtvU2V0dGluZ3NdKTtcblxuICAgIG9TZXR0aW5ncy5iU29ydGVkID0gZmFsc2U7XG4gICAgb1NldHRpbmdzLmJGaWx0ZXJlZCA9IGZhbHNlO1xuICAgIG9TZXR0aW5ncy5iRHJhd2luZyA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuUmVEcmF3KHNldHRpbmdzLCBob2xkUG9zaXRpb24pIHtcbiAgICB2YXIgZmVhdHVyZXMgPSBzZXR0aW5ncy5vRmVhdHVyZXMsXG4gICAgICAgIHNvcnQgPSBmZWF0dXJlcy5iU29ydCxcbiAgICAgICAgZmlsdGVyID0gZmVhdHVyZXMuYkZpbHRlcjtcblxuICAgIGlmIChzb3J0KSB7XG4gICAgICBfZm5Tb3J0KHNldHRpbmdzKTtcbiAgICB9XG5cbiAgICBpZiAoZmlsdGVyKSB7XG4gICAgICBfZm5GaWx0ZXJDb21wbGV0ZShzZXR0aW5ncywgc2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0dGluZ3MuYWlEaXNwbGF5ID0gc2V0dGluZ3MuYWlEaXNwbGF5TWFzdGVyLnNsaWNlKCk7XG4gICAgfVxuXG4gICAgaWYgKGhvbGRQb3NpdGlvbiAhPT0gdHJ1ZSkge1xuICAgICAgc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQgPSAwO1xuICAgIH1cblxuICAgIHNldHRpbmdzLl9kcmF3SG9sZCA9IGhvbGRQb3NpdGlvbjtcblxuICAgIF9mbkRyYXcoc2V0dGluZ3MpO1xuXG4gICAgc2V0dGluZ3MuX2RyYXdIb2xkID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5BZGRPcHRpb25zSHRtbChvU2V0dGluZ3MpIHtcbiAgICB2YXIgY2xhc3NlcyA9IG9TZXR0aW5ncy5vQ2xhc3NlcztcbiAgICB2YXIgdGFibGUgPSAkKG9TZXR0aW5ncy5uVGFibGUpO1xuICAgIHZhciBob2xkaW5nID0gJCgnPGRpdi8+JykuaW5zZXJ0QmVmb3JlKHRhYmxlKTtcbiAgICB2YXIgZmVhdHVyZXMgPSBvU2V0dGluZ3Mub0ZlYXR1cmVzO1xuICAgIHZhciBpbnNlcnQgPSAkKCc8ZGl2Lz4nLCB7XG4gICAgICBpZDogb1NldHRpbmdzLnNUYWJsZUlkICsgJ193cmFwcGVyJyxcbiAgICAgICdjbGFzcyc6IGNsYXNzZXMuc1dyYXBwZXIgKyAob1NldHRpbmdzLm5URm9vdCA/ICcnIDogJyAnICsgY2xhc3Nlcy5zTm9Gb290ZXIpXG4gICAgfSk7XG4gICAgb1NldHRpbmdzLm5Ib2xkaW5nID0gaG9sZGluZ1swXTtcbiAgICBvU2V0dGluZ3MublRhYmxlV3JhcHBlciA9IGluc2VydFswXTtcbiAgICBvU2V0dGluZ3MublRhYmxlUmVpbnNlcnRCZWZvcmUgPSBvU2V0dGluZ3MublRhYmxlLm5leHRTaWJsaW5nO1xuICAgIHZhciBhRG9tID0gb1NldHRpbmdzLnNEb20uc3BsaXQoJycpO1xuICAgIHZhciBmZWF0dXJlTm9kZSwgY09wdGlvbiwgbk5ld05vZGUsIGNOZXh0LCBzQXR0ciwgajtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYURvbS5sZW5ndGg7IGkrKykge1xuICAgICAgZmVhdHVyZU5vZGUgPSBudWxsO1xuICAgICAgY09wdGlvbiA9IGFEb21baV07XG5cbiAgICAgIGlmIChjT3B0aW9uID09ICc8Jykge1xuICAgICAgICBuTmV3Tm9kZSA9ICQoJzxkaXYvPicpWzBdO1xuICAgICAgICBjTmV4dCA9IGFEb21baSArIDFdO1xuXG4gICAgICAgIGlmIChjTmV4dCA9PSBcIidcIiB8fCBjTmV4dCA9PSAnXCInKSB7XG4gICAgICAgICAgc0F0dHIgPSBcIlwiO1xuICAgICAgICAgIGogPSAyO1xuXG4gICAgICAgICAgd2hpbGUgKGFEb21baSArIGpdICE9IGNOZXh0KSB7XG4gICAgICAgICAgICBzQXR0ciArPSBhRG9tW2kgKyBqXTtcbiAgICAgICAgICAgIGorKztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc0F0dHIgPT0gXCJIXCIpIHtcbiAgICAgICAgICAgIHNBdHRyID0gY2xhc3Nlcy5zSlVJSGVhZGVyO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc0F0dHIgPT0gXCJGXCIpIHtcbiAgICAgICAgICAgIHNBdHRyID0gY2xhc3Nlcy5zSlVJRm9vdGVyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzQXR0ci5pbmRleE9mKCcuJykgIT0gLTEpIHtcbiAgICAgICAgICAgIHZhciBhU3BsaXQgPSBzQXR0ci5zcGxpdCgnLicpO1xuICAgICAgICAgICAgbk5ld05vZGUuaWQgPSBhU3BsaXRbMF0uc3Vic3RyKDEsIGFTcGxpdFswXS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIG5OZXdOb2RlLmNsYXNzTmFtZSA9IGFTcGxpdFsxXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNBdHRyLmNoYXJBdCgwKSA9PSBcIiNcIikge1xuICAgICAgICAgICAgbk5ld05vZGUuaWQgPSBzQXR0ci5zdWJzdHIoMSwgc0F0dHIubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5OZXdOb2RlLmNsYXNzTmFtZSA9IHNBdHRyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGkgKz0gajtcbiAgICAgICAgfVxuXG4gICAgICAgIGluc2VydC5hcHBlbmQobk5ld05vZGUpO1xuICAgICAgICBpbnNlcnQgPSAkKG5OZXdOb2RlKTtcbiAgICAgIH0gZWxzZSBpZiAoY09wdGlvbiA9PSAnPicpIHtcbiAgICAgICAgaW5zZXJ0ID0gaW5zZXJ0LnBhcmVudCgpO1xuICAgICAgfSBlbHNlIGlmIChjT3B0aW9uID09ICdsJyAmJiBmZWF0dXJlcy5iUGFnaW5hdGUgJiYgZmVhdHVyZXMuYkxlbmd0aENoYW5nZSkge1xuICAgICAgICAgIGZlYXR1cmVOb2RlID0gX2ZuRmVhdHVyZUh0bWxMZW5ndGgob1NldHRpbmdzKTtcbiAgICAgICAgfSBlbHNlIGlmIChjT3B0aW9uID09ICdmJyAmJiBmZWF0dXJlcy5iRmlsdGVyKSB7XG4gICAgICAgICAgZmVhdHVyZU5vZGUgPSBfZm5GZWF0dXJlSHRtbEZpbHRlcihvU2V0dGluZ3MpO1xuICAgICAgICB9IGVsc2UgaWYgKGNPcHRpb24gPT0gJ3InICYmIGZlYXR1cmVzLmJQcm9jZXNzaW5nKSB7XG4gICAgICAgICAgZmVhdHVyZU5vZGUgPSBfZm5GZWF0dXJlSHRtbFByb2Nlc3Npbmcob1NldHRpbmdzKTtcbiAgICAgICAgfSBlbHNlIGlmIChjT3B0aW9uID09ICd0Jykge1xuICAgICAgICAgIGZlYXR1cmVOb2RlID0gX2ZuRmVhdHVyZUh0bWxUYWJsZShvU2V0dGluZ3MpO1xuICAgICAgICB9IGVsc2UgaWYgKGNPcHRpb24gPT0gJ2knICYmIGZlYXR1cmVzLmJJbmZvKSB7XG4gICAgICAgICAgZmVhdHVyZU5vZGUgPSBfZm5GZWF0dXJlSHRtbEluZm8ob1NldHRpbmdzKTtcbiAgICAgICAgfSBlbHNlIGlmIChjT3B0aW9uID09ICdwJyAmJiBmZWF0dXJlcy5iUGFnaW5hdGUpIHtcbiAgICAgICAgICBmZWF0dXJlTm9kZSA9IF9mbkZlYXR1cmVIdG1sUGFnaW5hdGUob1NldHRpbmdzKTtcbiAgICAgICAgfSBlbHNlIGlmIChEYXRhVGFibGUuZXh0LmZlYXR1cmUubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgdmFyIGFvRmVhdHVyZXMgPSBEYXRhVGFibGUuZXh0LmZlYXR1cmU7XG5cbiAgICAgICAgICBmb3IgKHZhciBrID0gMCwga0xlbiA9IGFvRmVhdHVyZXMubGVuZ3RoOyBrIDwga0xlbjsgaysrKSB7XG4gICAgICAgICAgICBpZiAoY09wdGlvbiA9PSBhb0ZlYXR1cmVzW2tdLmNGZWF0dXJlKSB7XG4gICAgICAgICAgICAgIGZlYXR1cmVOb2RlID0gYW9GZWF0dXJlc1trXS5mbkluaXQob1NldHRpbmdzKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIGlmIChmZWF0dXJlTm9kZSkge1xuICAgICAgICB2YXIgYWFuRmVhdHVyZXMgPSBvU2V0dGluZ3MuYWFuRmVhdHVyZXM7XG5cbiAgICAgICAgaWYgKCFhYW5GZWF0dXJlc1tjT3B0aW9uXSkge1xuICAgICAgICAgIGFhbkZlYXR1cmVzW2NPcHRpb25dID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBhYW5GZWF0dXJlc1tjT3B0aW9uXS5wdXNoKGZlYXR1cmVOb2RlKTtcbiAgICAgICAgaW5zZXJ0LmFwcGVuZChmZWF0dXJlTm9kZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaG9sZGluZy5yZXBsYWNlV2l0aChpbnNlcnQpO1xuICAgIG9TZXR0aW5ncy5uSG9sZGluZyA9IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5EZXRlY3RIZWFkZXIoYUxheW91dCwgblRoZWFkKSB7XG4gICAgdmFyIG5UcnMgPSAkKG5UaGVhZCkuY2hpbGRyZW4oJ3RyJyk7XG4gICAgdmFyIG5UciwgbkNlbGw7XG4gICAgdmFyIGksIGssIGwsIGlMZW4sIGpMZW4sIGlDb2xTaGlmdGVkLCBpQ29sdW1uLCBpQ29sc3BhbiwgaVJvd3NwYW47XG4gICAgdmFyIGJVbmlxdWU7XG5cbiAgICB2YXIgZm5TaGlmdENvbCA9IGZ1bmN0aW9uIGZuU2hpZnRDb2woYSwgaSwgaikge1xuICAgICAgdmFyIGsgPSBhW2ldO1xuXG4gICAgICB3aGlsZSAoa1tqXSkge1xuICAgICAgICBqKys7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBqO1xuICAgIH07XG5cbiAgICBhTGF5b3V0LnNwbGljZSgwLCBhTGF5b3V0Lmxlbmd0aCk7XG5cbiAgICBmb3IgKGkgPSAwLCBpTGVuID0gblRycy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIGFMYXlvdXQucHVzaChbXSk7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMCwgaUxlbiA9IG5UcnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICBuVHIgPSBuVHJzW2ldO1xuICAgICAgaUNvbHVtbiA9IDA7XG4gICAgICBuQ2VsbCA9IG5Uci5maXJzdENoaWxkO1xuXG4gICAgICB3aGlsZSAobkNlbGwpIHtcbiAgICAgICAgaWYgKG5DZWxsLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT0gXCJURFwiIHx8IG5DZWxsLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT0gXCJUSFwiKSB7XG4gICAgICAgICAgaUNvbHNwYW4gPSBuQ2VsbC5nZXRBdHRyaWJ1dGUoJ2NvbHNwYW4nKSAqIDE7XG4gICAgICAgICAgaVJvd3NwYW4gPSBuQ2VsbC5nZXRBdHRyaWJ1dGUoJ3Jvd3NwYW4nKSAqIDE7XG4gICAgICAgICAgaUNvbHNwYW4gPSAhaUNvbHNwYW4gfHwgaUNvbHNwYW4gPT09IDAgfHwgaUNvbHNwYW4gPT09IDEgPyAxIDogaUNvbHNwYW47XG4gICAgICAgICAgaVJvd3NwYW4gPSAhaVJvd3NwYW4gfHwgaVJvd3NwYW4gPT09IDAgfHwgaVJvd3NwYW4gPT09IDEgPyAxIDogaVJvd3NwYW47XG4gICAgICAgICAgaUNvbFNoaWZ0ZWQgPSBmblNoaWZ0Q29sKGFMYXlvdXQsIGksIGlDb2x1bW4pO1xuICAgICAgICAgIGJVbmlxdWUgPSBpQ29sc3BhbiA9PT0gMSA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgICAgIGZvciAobCA9IDA7IGwgPCBpQ29sc3BhbjsgbCsrKSB7XG4gICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgaVJvd3NwYW47IGsrKykge1xuICAgICAgICAgICAgICBhTGF5b3V0W2kgKyBrXVtpQ29sU2hpZnRlZCArIGxdID0ge1xuICAgICAgICAgICAgICAgIFwiY2VsbFwiOiBuQ2VsbCxcbiAgICAgICAgICAgICAgICBcInVuaXF1ZVwiOiBiVW5pcXVlXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGFMYXlvdXRbaSArIGtdLm5UciA9IG5UcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBuQ2VsbCA9IG5DZWxsLm5leHRTaWJsaW5nO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkdldFVuaXF1ZVRocyhvU2V0dGluZ3MsIG5IZWFkZXIsIGFMYXlvdXQpIHtcbiAgICB2YXIgYVJldHVybiA9IFtdO1xuXG4gICAgaWYgKCFhTGF5b3V0KSB7XG4gICAgICBhTGF5b3V0ID0gb1NldHRpbmdzLmFvSGVhZGVyO1xuXG4gICAgICBpZiAobkhlYWRlcikge1xuICAgICAgICBhTGF5b3V0ID0gW107XG5cbiAgICAgICAgX2ZuRGV0ZWN0SGVhZGVyKGFMYXlvdXQsIG5IZWFkZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gYUxheW91dC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwLCBqTGVuID0gYUxheW91dFtpXS5sZW5ndGg7IGogPCBqTGVuOyBqKyspIHtcbiAgICAgICAgaWYgKGFMYXlvdXRbaV1bal0udW5pcXVlICYmICghYVJldHVybltqXSB8fCAhb1NldHRpbmdzLmJTb3J0Q2VsbHNUb3ApKSB7XG4gICAgICAgICAgYVJldHVybltqXSA9IGFMYXlvdXRbaV1bal0uY2VsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhUmV0dXJuO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQnVpbGRBamF4KG9TZXR0aW5ncywgZGF0YSwgZm4pIHtcbiAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCAnYW9TZXJ2ZXJQYXJhbXMnLCAnc2VydmVyUGFyYW1zJywgW2RhdGFdKTtcblxuICAgIGlmIChkYXRhICYmICQuaXNBcnJheShkYXRhKSkge1xuICAgICAgdmFyIHRtcCA9IHt9O1xuICAgICAgdmFyIHJicmFja2V0ID0gLyguKj8pXFxbXFxdJC87XG4gICAgICAkLmVhY2goZGF0YSwgZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHZhbC5uYW1lLm1hdGNoKHJicmFja2V0KTtcblxuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICB2YXIgbmFtZSA9IG1hdGNoWzBdO1xuXG4gICAgICAgICAgaWYgKCF0bXBbbmFtZV0pIHtcbiAgICAgICAgICAgIHRtcFtuYW1lXSA9IFtdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRtcFtuYW1lXS5wdXNoKHZhbC52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG1wW3ZhbC5uYW1lXSA9IHZhbC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYXRhID0gdG1wO1xuICAgIH1cblxuICAgIHZhciBhamF4RGF0YTtcbiAgICB2YXIgYWpheCA9IG9TZXR0aW5ncy5hamF4O1xuICAgIHZhciBpbnN0YW5jZSA9IG9TZXR0aW5ncy5vSW5zdGFuY2U7XG5cbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiBjYWxsYmFjayhqc29uKSB7XG4gICAgICBfZm5DYWxsYmFja0ZpcmUob1NldHRpbmdzLCBudWxsLCAneGhyJywgW29TZXR0aW5ncywganNvbiwgb1NldHRpbmdzLmpxWEhSXSk7XG5cbiAgICAgIGZuKGpzb24pO1xuICAgIH07XG5cbiAgICBpZiAoJC5pc1BsYWluT2JqZWN0KGFqYXgpICYmIGFqYXguZGF0YSkge1xuICAgICAgYWpheERhdGEgPSBhamF4LmRhdGE7XG4gICAgICB2YXIgbmV3RGF0YSA9IHR5cGVvZiBhamF4RGF0YSA9PT0gJ2Z1bmN0aW9uJyA/IGFqYXhEYXRhKGRhdGEsIG9TZXR0aW5ncykgOiBhamF4RGF0YTtcbiAgICAgIGRhdGEgPSB0eXBlb2YgYWpheERhdGEgPT09ICdmdW5jdGlvbicgJiYgbmV3RGF0YSA/IG5ld0RhdGEgOiAkLmV4dGVuZCh0cnVlLCBkYXRhLCBuZXdEYXRhKTtcbiAgICAgIGRlbGV0ZSBhamF4LmRhdGE7XG4gICAgfVxuXG4gICAgdmFyIGJhc2VBamF4ID0ge1xuICAgICAgXCJkYXRhXCI6IGRhdGEsXG4gICAgICBcInN1Y2Nlc3NcIjogZnVuY3Rpb24gc3VjY2Vzcyhqc29uKSB7XG4gICAgICAgIHZhciBlcnJvciA9IGpzb24uZXJyb3IgfHwganNvbi5zRXJyb3I7XG5cbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgX2ZuTG9nKG9TZXR0aW5ncywgMCwgZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgb1NldHRpbmdzLmpzb24gPSBqc29uO1xuICAgICAgICBjYWxsYmFjayhqc29uKTtcbiAgICAgIH0sXG4gICAgICBcImRhdGFUeXBlXCI6IFwianNvblwiLFxuICAgICAgXCJjYWNoZVwiOiBmYWxzZSxcbiAgICAgIFwidHlwZVwiOiBvU2V0dGluZ3Muc1NlcnZlck1ldGhvZCxcbiAgICAgIFwiZXJyb3JcIjogZnVuY3Rpb24gZXJyb3IoeGhyLCBfZXJyb3IsIHRocm93bikge1xuICAgICAgICB2YXIgcmV0ID0gX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgbnVsbCwgJ3hocicsIFtvU2V0dGluZ3MsIG51bGwsIG9TZXR0aW5ncy5qcVhIUl0pO1xuXG4gICAgICAgIGlmICgkLmluQXJyYXkodHJ1ZSwgcmV0KSA9PT0gLTEpIHtcbiAgICAgICAgICBpZiAoX2Vycm9yID09IFwicGFyc2VyZXJyb3JcIikge1xuICAgICAgICAgICAgX2ZuTG9nKG9TZXR0aW5ncywgMCwgJ0ludmFsaWQgSlNPTiByZXNwb25zZScsIDEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgIF9mbkxvZyhvU2V0dGluZ3MsIDAsICdBamF4IGVycm9yJywgNyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkob1NldHRpbmdzLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBvU2V0dGluZ3Mub0FqYXhEYXRhID0gZGF0YTtcblxuICAgIF9mbkNhbGxiYWNrRmlyZShvU2V0dGluZ3MsIG51bGwsICdwcmVYaHInLCBbb1NldHRpbmdzLCBkYXRhXSk7XG5cbiAgICBpZiAob1NldHRpbmdzLmZuU2VydmVyRGF0YSkge1xuICAgICAgb1NldHRpbmdzLmZuU2VydmVyRGF0YS5jYWxsKGluc3RhbmNlLCBvU2V0dGluZ3Muc0FqYXhTb3VyY2UsICQubWFwKGRhdGEsIGZ1bmN0aW9uICh2YWwsIGtleSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdmFsXG4gICAgICAgIH07XG4gICAgICB9KSwgY2FsbGJhY2ssIG9TZXR0aW5ncyk7XG4gICAgfSBlbHNlIGlmIChvU2V0dGluZ3Muc0FqYXhTb3VyY2UgfHwgdHlwZW9mIGFqYXggPT09ICdzdHJpbmcnKSB7XG4gICAgICBvU2V0dGluZ3MuanFYSFIgPSAkLmFqYXgoJC5leHRlbmQoYmFzZUFqYXgsIHtcbiAgICAgICAgdXJsOiBhamF4IHx8IG9TZXR0aW5ncy5zQWpheFNvdXJjZVxuICAgICAgfSkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFqYXggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG9TZXR0aW5ncy5qcVhIUiA9IGFqYXguY2FsbChpbnN0YW5jZSwgZGF0YSwgY2FsbGJhY2ssIG9TZXR0aW5ncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9TZXR0aW5ncy5qcVhIUiA9ICQuYWpheCgkLmV4dGVuZChiYXNlQWpheCwgYWpheCkpO1xuICAgICAgYWpheC5kYXRhID0gYWpheERhdGE7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQWpheFVwZGF0ZShzZXR0aW5ncykge1xuICAgIGlmIChzZXR0aW5ncy5iQWpheERhdGFHZXQpIHtcbiAgICAgIHNldHRpbmdzLmlEcmF3Kys7XG5cbiAgICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KHNldHRpbmdzLCB0cnVlKTtcblxuICAgICAgX2ZuQnVpbGRBamF4KHNldHRpbmdzLCBfZm5BamF4UGFyYW1ldGVycyhzZXR0aW5ncyksIGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgIF9mbkFqYXhVcGRhdGVEcmF3KHNldHRpbmdzLCBqc29uKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5BamF4UGFyYW1ldGVycyhzZXR0aW5ncykge1xuICAgIHZhciBjb2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zLFxuICAgICAgICBjb2x1bW5Db3VudCA9IGNvbHVtbnMubGVuZ3RoLFxuICAgICAgICBmZWF0dXJlcyA9IHNldHRpbmdzLm9GZWF0dXJlcyxcbiAgICAgICAgcHJlU2VhcmNoID0gc2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoLFxuICAgICAgICBwcmVDb2xTZWFyY2ggPSBzZXR0aW5ncy5hb1ByZVNlYXJjaENvbHMsXG4gICAgICAgIGksXG4gICAgICAgIGRhdGEgPSBbXSxcbiAgICAgICAgZGF0YVByb3AsXG4gICAgICAgIGNvbHVtbixcbiAgICAgICAgY29sdW1uU2VhcmNoLFxuICAgICAgICBzb3J0ID0gX2ZuU29ydEZsYXR0ZW4oc2V0dGluZ3MpLFxuICAgICAgICBkaXNwbGF5U3RhcnQgPSBzZXR0aW5ncy5faURpc3BsYXlTdGFydCxcbiAgICAgICAgZGlzcGxheUxlbmd0aCA9IGZlYXR1cmVzLmJQYWdpbmF0ZSAhPT0gZmFsc2UgPyBzZXR0aW5ncy5faURpc3BsYXlMZW5ndGggOiAtMTtcblxuICAgIHZhciBwYXJhbSA9IGZ1bmN0aW9uIHBhcmFtKG5hbWUsIHZhbHVlKSB7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICAnbmFtZSc6IG5hbWUsXG4gICAgICAgICd2YWx1ZSc6IHZhbHVlXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcGFyYW0oJ3NFY2hvJywgc2V0dGluZ3MuaURyYXcpO1xuICAgIHBhcmFtKCdpQ29sdW1ucycsIGNvbHVtbkNvdW50KTtcbiAgICBwYXJhbSgnc0NvbHVtbnMnLCBfcGx1Y2soY29sdW1ucywgJ3NOYW1lJykuam9pbignLCcpKTtcbiAgICBwYXJhbSgnaURpc3BsYXlTdGFydCcsIGRpc3BsYXlTdGFydCk7XG4gICAgcGFyYW0oJ2lEaXNwbGF5TGVuZ3RoJywgZGlzcGxheUxlbmd0aCk7XG4gICAgdmFyIGQgPSB7XG4gICAgICBkcmF3OiBzZXR0aW5ncy5pRHJhdyxcbiAgICAgIGNvbHVtbnM6IFtdLFxuICAgICAgb3JkZXI6IFtdLFxuICAgICAgc3RhcnQ6IGRpc3BsYXlTdGFydCxcbiAgICAgIGxlbmd0aDogZGlzcGxheUxlbmd0aCxcbiAgICAgIHNlYXJjaDoge1xuICAgICAgICB2YWx1ZTogcHJlU2VhcmNoLnNTZWFyY2gsXG4gICAgICAgIHJlZ2V4OiBwcmVTZWFyY2guYlJlZ2V4XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBjb2x1bW5Db3VudDsgaSsrKSB7XG4gICAgICBjb2x1bW4gPSBjb2x1bW5zW2ldO1xuICAgICAgY29sdW1uU2VhcmNoID0gcHJlQ29sU2VhcmNoW2ldO1xuICAgICAgZGF0YVByb3AgPSB0eXBlb2YgY29sdW1uLm1EYXRhID09IFwiZnVuY3Rpb25cIiA/ICdmdW5jdGlvbicgOiBjb2x1bW4ubURhdGE7XG4gICAgICBkLmNvbHVtbnMucHVzaCh7XG4gICAgICAgIGRhdGE6IGRhdGFQcm9wLFxuICAgICAgICBuYW1lOiBjb2x1bW4uc05hbWUsXG4gICAgICAgIHNlYXJjaGFibGU6IGNvbHVtbi5iU2VhcmNoYWJsZSxcbiAgICAgICAgb3JkZXJhYmxlOiBjb2x1bW4uYlNvcnRhYmxlLFxuICAgICAgICBzZWFyY2g6IHtcbiAgICAgICAgICB2YWx1ZTogY29sdW1uU2VhcmNoLnNTZWFyY2gsXG4gICAgICAgICAgcmVnZXg6IGNvbHVtblNlYXJjaC5iUmVnZXhcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBwYXJhbShcIm1EYXRhUHJvcF9cIiArIGksIGRhdGFQcm9wKTtcblxuICAgICAgaWYgKGZlYXR1cmVzLmJGaWx0ZXIpIHtcbiAgICAgICAgcGFyYW0oJ3NTZWFyY2hfJyArIGksIGNvbHVtblNlYXJjaC5zU2VhcmNoKTtcbiAgICAgICAgcGFyYW0oJ2JSZWdleF8nICsgaSwgY29sdW1uU2VhcmNoLmJSZWdleCk7XG4gICAgICAgIHBhcmFtKCdiU2VhcmNoYWJsZV8nICsgaSwgY29sdW1uLmJTZWFyY2hhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZlYXR1cmVzLmJTb3J0KSB7XG4gICAgICAgIHBhcmFtKCdiU29ydGFibGVfJyArIGksIGNvbHVtbi5iU29ydGFibGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmZWF0dXJlcy5iRmlsdGVyKSB7XG4gICAgICBwYXJhbSgnc1NlYXJjaCcsIHByZVNlYXJjaC5zU2VhcmNoKTtcbiAgICAgIHBhcmFtKCdiUmVnZXgnLCBwcmVTZWFyY2guYlJlZ2V4KTtcbiAgICB9XG5cbiAgICBpZiAoZmVhdHVyZXMuYlNvcnQpIHtcbiAgICAgICQuZWFjaChzb3J0LCBmdW5jdGlvbiAoaSwgdmFsKSB7XG4gICAgICAgIGQub3JkZXIucHVzaCh7XG4gICAgICAgICAgY29sdW1uOiB2YWwuY29sLFxuICAgICAgICAgIGRpcjogdmFsLmRpclxuICAgICAgICB9KTtcbiAgICAgICAgcGFyYW0oJ2lTb3J0Q29sXycgKyBpLCB2YWwuY29sKTtcbiAgICAgICAgcGFyYW0oJ3NTb3J0RGlyXycgKyBpLCB2YWwuZGlyKTtcbiAgICAgIH0pO1xuICAgICAgcGFyYW0oJ2lTb3J0aW5nQ29scycsIHNvcnQubGVuZ3RoKTtcbiAgICB9XG5cbiAgICB2YXIgbGVnYWN5ID0gRGF0YVRhYmxlLmV4dC5sZWdhY3kuYWpheDtcblxuICAgIGlmIChsZWdhY3kgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBzZXR0aW5ncy5zQWpheFNvdXJjZSA/IGRhdGEgOiBkO1xuICAgIH1cblxuICAgIHJldHVybiBsZWdhY3kgPyBkYXRhIDogZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFqYXhVcGRhdGVEcmF3KHNldHRpbmdzLCBqc29uKSB7XG4gICAgdmFyIGNvbXBhdCA9IGZ1bmN0aW9uIGNvbXBhdChvbGQsIG1vZGVybikge1xuICAgICAgcmV0dXJuIGpzb25bb2xkXSAhPT0gdW5kZWZpbmVkID8ganNvbltvbGRdIDoganNvblttb2Rlcm5dO1xuICAgIH07XG5cbiAgICB2YXIgZGF0YSA9IF9mbkFqYXhEYXRhU3JjKHNldHRpbmdzLCBqc29uKTtcblxuICAgIHZhciBkcmF3ID0gY29tcGF0KCdzRWNobycsICdkcmF3Jyk7XG4gICAgdmFyIHJlY29yZHNUb3RhbCA9IGNvbXBhdCgnaVRvdGFsUmVjb3JkcycsICdyZWNvcmRzVG90YWwnKTtcbiAgICB2YXIgcmVjb3Jkc0ZpbHRlcmVkID0gY29tcGF0KCdpVG90YWxEaXNwbGF5UmVjb3JkcycsICdyZWNvcmRzRmlsdGVyZWQnKTtcblxuICAgIGlmIChkcmF3KSB7XG4gICAgICBpZiAoZHJhdyAqIDEgPCBzZXR0aW5ncy5pRHJhdykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNldHRpbmdzLmlEcmF3ID0gZHJhdyAqIDE7XG4gICAgfVxuXG4gICAgX2ZuQ2xlYXJUYWJsZShzZXR0aW5ncyk7XG5cbiAgICBzZXR0aW5ncy5faVJlY29yZHNUb3RhbCA9IHBhcnNlSW50KHJlY29yZHNUb3RhbCwgMTApO1xuICAgIHNldHRpbmdzLl9pUmVjb3Jkc0Rpc3BsYXkgPSBwYXJzZUludChyZWNvcmRzRmlsdGVyZWQsIDEwKTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBfZm5BZGREYXRhKHNldHRpbmdzLCBkYXRhW2ldKTtcbiAgICB9XG5cbiAgICBzZXR0aW5ncy5haURpc3BsYXkgPSBzZXR0aW5ncy5haURpc3BsYXlNYXN0ZXIuc2xpY2UoKTtcbiAgICBzZXR0aW5ncy5iQWpheERhdGFHZXQgPSBmYWxzZTtcblxuICAgIF9mbkRyYXcoc2V0dGluZ3MpO1xuXG4gICAgaWYgKCFzZXR0aW5ncy5fYkluaXRDb21wbGV0ZSkge1xuICAgICAgX2ZuSW5pdENvbXBsZXRlKHNldHRpbmdzLCBqc29uKTtcbiAgICB9XG5cbiAgICBzZXR0aW5ncy5iQWpheERhdGFHZXQgPSB0cnVlO1xuXG4gICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkoc2V0dGluZ3MsIGZhbHNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkFqYXhEYXRhU3JjKG9TZXR0aW5ncywganNvbikge1xuICAgIHZhciBkYXRhU3JjID0gJC5pc1BsYWluT2JqZWN0KG9TZXR0aW5ncy5hamF4KSAmJiBvU2V0dGluZ3MuYWpheC5kYXRhU3JjICE9PSB1bmRlZmluZWQgPyBvU2V0dGluZ3MuYWpheC5kYXRhU3JjIDogb1NldHRpbmdzLnNBamF4RGF0YVByb3A7XG5cbiAgICBpZiAoZGF0YVNyYyA9PT0gJ2RhdGEnKSB7XG4gICAgICByZXR1cm4ganNvbi5hYURhdGEgfHwganNvbltkYXRhU3JjXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YVNyYyAhPT0gXCJcIiA/IF9mbkdldE9iamVjdERhdGFGbihkYXRhU3JjKShqc29uKSA6IGpzb247XG4gIH1cblxuICBmdW5jdGlvbiBfZm5GZWF0dXJlSHRtbEZpbHRlcihzZXR0aW5ncykge1xuICAgIHZhciBjbGFzc2VzID0gc2V0dGluZ3Mub0NsYXNzZXM7XG4gICAgdmFyIHRhYmxlSWQgPSBzZXR0aW5ncy5zVGFibGVJZDtcbiAgICB2YXIgbGFuZ3VhZ2UgPSBzZXR0aW5ncy5vTGFuZ3VhZ2U7XG4gICAgdmFyIHByZXZpb3VzU2VhcmNoID0gc2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoO1xuICAgIHZhciBmZWF0dXJlcyA9IHNldHRpbmdzLmFhbkZlYXR1cmVzO1xuICAgIHZhciBpbnB1dCA9ICc8aW5wdXQgdHlwZT1cInNlYXJjaFwiIGNsYXNzPVwiJyArIGNsYXNzZXMuc0ZpbHRlcklucHV0ICsgJ1wiLz4nO1xuICAgIHZhciBzdHIgPSBsYW5ndWFnZS5zU2VhcmNoO1xuICAgIHN0ciA9IHN0ci5tYXRjaCgvX0lOUFVUXy8pID8gc3RyLnJlcGxhY2UoJ19JTlBVVF8nLCBpbnB1dCkgOiBzdHIgKyBpbnB1dDtcbiAgICB2YXIgZmlsdGVyID0gJCgnPGRpdi8+Jywge1xuICAgICAgJ2lkJzogIWZlYXR1cmVzLmYgPyB0YWJsZUlkICsgJ19maWx0ZXInIDogbnVsbCxcbiAgICAgICdjbGFzcyc6IGNsYXNzZXMuc0ZpbHRlclxuICAgIH0pLmFwcGVuZCgkKCc8bGFiZWwvPicpLmFwcGVuZChzdHIpKTtcblxuICAgIHZhciBzZWFyY2hGbiA9IGZ1bmN0aW9uIHNlYXJjaEZuKCkge1xuICAgICAgdmFyIG4gPSBmZWF0dXJlcy5mO1xuICAgICAgdmFyIHZhbCA9ICF0aGlzLnZhbHVlID8gXCJcIiA6IHRoaXMudmFsdWU7XG5cbiAgICAgIGlmICh2YWwgIT0gcHJldmlvdXNTZWFyY2guc1NlYXJjaCkge1xuICAgICAgICBfZm5GaWx0ZXJDb21wbGV0ZShzZXR0aW5ncywge1xuICAgICAgICAgIFwic1NlYXJjaFwiOiB2YWwsXG4gICAgICAgICAgXCJiUmVnZXhcIjogcHJldmlvdXNTZWFyY2guYlJlZ2V4LFxuICAgICAgICAgIFwiYlNtYXJ0XCI6IHByZXZpb3VzU2VhcmNoLmJTbWFydCxcbiAgICAgICAgICBcImJDYXNlSW5zZW5zaXRpdmVcIjogcHJldmlvdXNTZWFyY2guYkNhc2VJbnNlbnNpdGl2ZVxuICAgICAgICB9KTtcblxuICAgICAgICBzZXR0aW5ncy5faURpc3BsYXlTdGFydCA9IDA7XG5cbiAgICAgICAgX2ZuRHJhdyhzZXR0aW5ncyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBzZWFyY2hEZWxheSA9IHNldHRpbmdzLnNlYXJjaERlbGF5ICE9PSBudWxsID8gc2V0dGluZ3Muc2VhcmNoRGVsYXkgOiBfZm5EYXRhU291cmNlKHNldHRpbmdzKSA9PT0gJ3NzcCcgPyA0MDAgOiAwO1xuICAgIHZhciBqcUZpbHRlciA9ICQoJ2lucHV0JywgZmlsdGVyKS52YWwocHJldmlvdXNTZWFyY2guc1NlYXJjaCkuYXR0cigncGxhY2Vob2xkZXInLCBsYW5ndWFnZS5zU2VhcmNoUGxhY2Vob2xkZXIpLm9uKCdrZXl1cC5EVCBzZWFyY2guRFQgaW5wdXQuRFQgcGFzdGUuRFQgY3V0LkRUJywgc2VhcmNoRGVsYXkgPyBfZm5UaHJvdHRsZShzZWFyY2hGbiwgc2VhcmNoRGVsYXkpIDogc2VhcmNoRm4pLm9uKCdrZXlwcmVzcy5EVCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KS5hdHRyKCdhcmlhLWNvbnRyb2xzJywgdGFibGVJZCk7XG4gICAgJChzZXR0aW5ncy5uVGFibGUpLm9uKCdzZWFyY2guZHQuRFQnLCBmdW5jdGlvbiAoZXYsIHMpIHtcbiAgICAgIGlmIChzZXR0aW5ncyA9PT0gcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChqcUZpbHRlclswXSAhPT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAganFGaWx0ZXIudmFsKHByZXZpb3VzU2VhcmNoLnNTZWFyY2gpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZmlsdGVyWzBdO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmlsdGVyQ29tcGxldGUob1NldHRpbmdzLCBvSW5wdXQsIGlGb3JjZSkge1xuICAgIHZhciBvUHJldlNlYXJjaCA9IG9TZXR0aW5ncy5vUHJldmlvdXNTZWFyY2g7XG4gICAgdmFyIGFvUHJldlNlYXJjaCA9IG9TZXR0aW5ncy5hb1ByZVNlYXJjaENvbHM7XG5cbiAgICB2YXIgZm5TYXZlRmlsdGVyID0gZnVuY3Rpb24gZm5TYXZlRmlsdGVyKG9GaWx0ZXIpIHtcbiAgICAgIG9QcmV2U2VhcmNoLnNTZWFyY2ggPSBvRmlsdGVyLnNTZWFyY2g7XG4gICAgICBvUHJldlNlYXJjaC5iUmVnZXggPSBvRmlsdGVyLmJSZWdleDtcbiAgICAgIG9QcmV2U2VhcmNoLmJTbWFydCA9IG9GaWx0ZXIuYlNtYXJ0O1xuICAgICAgb1ByZXZTZWFyY2guYkNhc2VJbnNlbnNpdGl2ZSA9IG9GaWx0ZXIuYkNhc2VJbnNlbnNpdGl2ZTtcbiAgICB9O1xuXG4gICAgdmFyIGZuUmVnZXggPSBmdW5jdGlvbiBmblJlZ2V4KG8pIHtcbiAgICAgIHJldHVybiBvLmJFc2NhcGVSZWdleCAhPT0gdW5kZWZpbmVkID8gIW8uYkVzY2FwZVJlZ2V4IDogby5iUmVnZXg7XG4gICAgfTtcblxuICAgIF9mbkNvbHVtblR5cGVzKG9TZXR0aW5ncyk7XG5cbiAgICBpZiAoX2ZuRGF0YVNvdXJjZShvU2V0dGluZ3MpICE9ICdzc3AnKSB7XG4gICAgICBfZm5GaWx0ZXIob1NldHRpbmdzLCBvSW5wdXQuc1NlYXJjaCwgaUZvcmNlLCBmblJlZ2V4KG9JbnB1dCksIG9JbnB1dC5iU21hcnQsIG9JbnB1dC5iQ2FzZUluc2Vuc2l0aXZlKTtcblxuICAgICAgZm5TYXZlRmlsdGVyKG9JbnB1dCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW9QcmV2U2VhcmNoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIF9mbkZpbHRlckNvbHVtbihvU2V0dGluZ3MsIGFvUHJldlNlYXJjaFtpXS5zU2VhcmNoLCBpLCBmblJlZ2V4KGFvUHJldlNlYXJjaFtpXSksIGFvUHJldlNlYXJjaFtpXS5iU21hcnQsIGFvUHJldlNlYXJjaFtpXS5iQ2FzZUluc2Vuc2l0aXZlKTtcbiAgICAgIH1cblxuICAgICAgX2ZuRmlsdGVyQ3VzdG9tKG9TZXR0aW5ncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZuU2F2ZUZpbHRlcihvSW5wdXQpO1xuICAgIH1cblxuICAgIG9TZXR0aW5ncy5iRmlsdGVyZWQgPSB0cnVlO1xuXG4gICAgX2ZuQ2FsbGJhY2tGaXJlKG9TZXR0aW5ncywgbnVsbCwgJ3NlYXJjaCcsIFtvU2V0dGluZ3NdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZpbHRlckN1c3RvbShzZXR0aW5ncykge1xuICAgIHZhciBmaWx0ZXJzID0gRGF0YVRhYmxlLmV4dC5zZWFyY2g7XG4gICAgdmFyIGRpc3BsYXlSb3dzID0gc2V0dGluZ3MuYWlEaXNwbGF5O1xuICAgIHZhciByb3csIHJvd0lkeDtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICB2YXIgcm93cyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBqID0gMCwgamVuID0gZGlzcGxheVJvd3MubGVuZ3RoOyBqIDwgamVuOyBqKyspIHtcbiAgICAgICAgcm93SWR4ID0gZGlzcGxheVJvd3Nbal07XG4gICAgICAgIHJvdyA9IHNldHRpbmdzLmFvRGF0YVtyb3dJZHhdO1xuXG4gICAgICAgIGlmIChmaWx0ZXJzW2ldKHNldHRpbmdzLCByb3cuX2FGaWx0ZXJEYXRhLCByb3dJZHgsIHJvdy5fYURhdGEsIGopKSB7XG4gICAgICAgICAgcm93cy5wdXNoKHJvd0lkeCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZGlzcGxheVJvd3MubGVuZ3RoID0gMDtcbiAgICAgICQubWVyZ2UoZGlzcGxheVJvd3MsIHJvd3MpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZpbHRlckNvbHVtbihzZXR0aW5ncywgc2VhcmNoU3RyLCBjb2xJZHgsIHJlZ2V4LCBzbWFydCwgY2FzZUluc2Vuc2l0aXZlKSB7XG4gICAgaWYgKHNlYXJjaFN0ciA9PT0gJycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZGF0YTtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIGRpc3BsYXkgPSBzZXR0aW5ncy5haURpc3BsYXk7XG5cbiAgICB2YXIgcnBTZWFyY2ggPSBfZm5GaWx0ZXJDcmVhdGVTZWFyY2goc2VhcmNoU3RyLCByZWdleCwgc21hcnQsIGNhc2VJbnNlbnNpdGl2ZSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpc3BsYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGRhdGEgPSBzZXR0aW5ncy5hb0RhdGFbZGlzcGxheVtpXV0uX2FGaWx0ZXJEYXRhW2NvbElkeF07XG5cbiAgICAgIGlmIChycFNlYXJjaC50ZXN0KGRhdGEpKSB7XG4gICAgICAgIG91dC5wdXNoKGRpc3BsYXlbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldHRpbmdzLmFpRGlzcGxheSA9IG91dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZpbHRlcihzZXR0aW5ncywgaW5wdXQsIGZvcmNlLCByZWdleCwgc21hcnQsIGNhc2VJbnNlbnNpdGl2ZSkge1xuICAgIHZhciBycFNlYXJjaCA9IF9mbkZpbHRlckNyZWF0ZVNlYXJjaChpbnB1dCwgcmVnZXgsIHNtYXJ0LCBjYXNlSW5zZW5zaXRpdmUpO1xuXG4gICAgdmFyIHByZXZTZWFyY2ggPSBzZXR0aW5ncy5vUHJldmlvdXNTZWFyY2guc1NlYXJjaDtcbiAgICB2YXIgZGlzcGxheU1hc3RlciA9IHNldHRpbmdzLmFpRGlzcGxheU1hc3RlcjtcbiAgICB2YXIgZGlzcGxheSwgaW52YWxpZGF0ZWQsIGk7XG4gICAgdmFyIGZpbHRlcmVkID0gW107XG5cbiAgICBpZiAoRGF0YVRhYmxlLmV4dC5zZWFyY2gubGVuZ3RoICE9PSAwKSB7XG4gICAgICBmb3JjZSA9IHRydWU7XG4gICAgfVxuXG4gICAgaW52YWxpZGF0ZWQgPSBfZm5GaWx0ZXJEYXRhKHNldHRpbmdzKTtcblxuICAgIGlmIChpbnB1dC5sZW5ndGggPD0gMCkge1xuICAgICAgc2V0dGluZ3MuYWlEaXNwbGF5ID0gZGlzcGxheU1hc3Rlci5zbGljZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW52YWxpZGF0ZWQgfHwgZm9yY2UgfHwgcHJldlNlYXJjaC5sZW5ndGggPiBpbnB1dC5sZW5ndGggfHwgaW5wdXQuaW5kZXhPZihwcmV2U2VhcmNoKSAhPT0gMCB8fCBzZXR0aW5ncy5iU29ydGVkKSB7XG4gICAgICAgICAgc2V0dGluZ3MuYWlEaXNwbGF5ID0gZGlzcGxheU1hc3Rlci5zbGljZSgpO1xuICAgICAgICB9XG5cbiAgICAgIGRpc3BsYXkgPSBzZXR0aW5ncy5haURpc3BsYXk7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBkaXNwbGF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChycFNlYXJjaC50ZXN0KHNldHRpbmdzLmFvRGF0YVtkaXNwbGF5W2ldXS5fc0ZpbHRlclJvdykpIHtcbiAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGRpc3BsYXlbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNldHRpbmdzLmFpRGlzcGxheSA9IGZpbHRlcmVkO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZpbHRlckNyZWF0ZVNlYXJjaChzZWFyY2gsIHJlZ2V4LCBzbWFydCwgY2FzZUluc2Vuc2l0aXZlKSB7XG4gICAgc2VhcmNoID0gcmVnZXggPyBzZWFyY2ggOiBfZm5Fc2NhcGVSZWdleChzZWFyY2gpO1xuXG4gICAgaWYgKHNtYXJ0KSB7XG4gICAgICB2YXIgYSA9ICQubWFwKHNlYXJjaC5tYXRjaCgvXCJbXlwiXStcInxbXiBdKy9nKSB8fCBbJyddLCBmdW5jdGlvbiAod29yZCkge1xuICAgICAgICBpZiAod29yZC5jaGFyQXQoMCkgPT09ICdcIicpIHtcbiAgICAgICAgICB2YXIgbSA9IHdvcmQubWF0Y2goL15cIiguKilcIiQvKTtcbiAgICAgICAgICB3b3JkID0gbSA/IG1bMV0gOiB3b3JkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdvcmQucmVwbGFjZSgnXCInLCAnJyk7XG4gICAgICB9KTtcbiAgICAgIHNlYXJjaCA9ICdeKD89Lio/JyArIGEuam9pbignKSg/PS4qPycpICsgJykuKiQnO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVnRXhwKHNlYXJjaCwgY2FzZUluc2Vuc2l0aXZlID8gJ2knIDogJycpO1xuICB9XG5cbiAgdmFyIF9mbkVzY2FwZVJlZ2V4ID0gRGF0YVRhYmxlLnV0aWwuZXNjYXBlUmVnZXg7XG4gIHZhciBfX2ZpbHRlcl9kaXYgPSAkKCc8ZGl2PicpWzBdO1xuXG4gIHZhciBfX2ZpbHRlcl9kaXZfdGV4dENvbnRlbnQgPSBfX2ZpbHRlcl9kaXYudGV4dENvbnRlbnQgIT09IHVuZGVmaW5lZDtcblxuICBmdW5jdGlvbiBfZm5GaWx0ZXJEYXRhKHNldHRpbmdzKSB7XG4gICAgdmFyIGNvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnM7XG4gICAgdmFyIGNvbHVtbjtcbiAgICB2YXIgaSwgaiwgaWVuLCBqZW4sIGZpbHRlckRhdGEsIGNlbGxEYXRhLCByb3c7XG4gICAgdmFyIGZvbWF0dGVycyA9IERhdGFUYWJsZS5leHQudHlwZS5zZWFyY2g7XG4gICAgdmFyIHdhc0ludmFsaWRhdGVkID0gZmFsc2U7XG5cbiAgICBmb3IgKGkgPSAwLCBpZW4gPSBzZXR0aW5ncy5hb0RhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIHJvdyA9IHNldHRpbmdzLmFvRGF0YVtpXTtcblxuICAgICAgaWYgKCFyb3cuX2FGaWx0ZXJEYXRhKSB7XG4gICAgICAgIGZpbHRlckRhdGEgPSBbXTtcblxuICAgICAgICBmb3IgKGogPSAwLCBqZW4gPSBjb2x1bW5zLmxlbmd0aDsgaiA8IGplbjsgaisrKSB7XG4gICAgICAgICAgY29sdW1uID0gY29sdW1uc1tqXTtcblxuICAgICAgICAgIGlmIChjb2x1bW4uYlNlYXJjaGFibGUpIHtcbiAgICAgICAgICAgIGNlbGxEYXRhID0gX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIGksIGosICdmaWx0ZXInKTtcblxuICAgICAgICAgICAgaWYgKGZvbWF0dGVyc1tjb2x1bW4uc1R5cGVdKSB7XG4gICAgICAgICAgICAgIGNlbGxEYXRhID0gZm9tYXR0ZXJzW2NvbHVtbi5zVHlwZV0oY2VsbERhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2VsbERhdGEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgY2VsbERhdGEgPSAnJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjZWxsRGF0YSAhPT0gJ3N0cmluZycgJiYgY2VsbERhdGEudG9TdHJpbmcpIHtcbiAgICAgICAgICAgICAgY2VsbERhdGEgPSBjZWxsRGF0YS50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjZWxsRGF0YSA9ICcnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjZWxsRGF0YS5pbmRleE9mICYmIGNlbGxEYXRhLmluZGV4T2YoJyYnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIF9fZmlsdGVyX2Rpdi5pbm5lckhUTUwgPSBjZWxsRGF0YTtcbiAgICAgICAgICAgIGNlbGxEYXRhID0gX19maWx0ZXJfZGl2X3RleHRDb250ZW50ID8gX19maWx0ZXJfZGl2LnRleHRDb250ZW50IDogX19maWx0ZXJfZGl2LmlubmVyVGV4dDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY2VsbERhdGEucmVwbGFjZSkge1xuICAgICAgICAgICAgY2VsbERhdGEgPSBjZWxsRGF0YS5yZXBsYWNlKC9bXFxyXFxuXS9nLCAnJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZmlsdGVyRGF0YS5wdXNoKGNlbGxEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdy5fYUZpbHRlckRhdGEgPSBmaWx0ZXJEYXRhO1xuICAgICAgICByb3cuX3NGaWx0ZXJSb3cgPSBmaWx0ZXJEYXRhLmpvaW4oJyAgJyk7XG4gICAgICAgIHdhc0ludmFsaWRhdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gd2FzSW52YWxpZGF0ZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5TZWFyY2hUb0NhbWVsKG9iaikge1xuICAgIHJldHVybiB7XG4gICAgICBzZWFyY2g6IG9iai5zU2VhcmNoLFxuICAgICAgc21hcnQ6IG9iai5iU21hcnQsXG4gICAgICByZWdleDogb2JqLmJSZWdleCxcbiAgICAgIGNhc2VJbnNlbnNpdGl2ZTogb2JqLmJDYXNlSW5zZW5zaXRpdmVcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU2VhcmNoVG9IdW5nKG9iaikge1xuICAgIHJldHVybiB7XG4gICAgICBzU2VhcmNoOiBvYmouc2VhcmNoLFxuICAgICAgYlNtYXJ0OiBvYmouc21hcnQsXG4gICAgICBiUmVnZXg6IG9iai5yZWdleCxcbiAgICAgIGJDYXNlSW5zZW5zaXRpdmU6IG9iai5jYXNlSW5zZW5zaXRpdmVcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmVhdHVyZUh0bWxJbmZvKHNldHRpbmdzKSB7XG4gICAgdmFyIHRpZCA9IHNldHRpbmdzLnNUYWJsZUlkLFxuICAgICAgICBub2RlcyA9IHNldHRpbmdzLmFhbkZlYXR1cmVzLmksXG4gICAgICAgIG4gPSAkKCc8ZGl2Lz4nLCB7XG4gICAgICAnY2xhc3MnOiBzZXR0aW5ncy5vQ2xhc3Nlcy5zSW5mbyxcbiAgICAgICdpZCc6ICFub2RlcyA/IHRpZCArICdfaW5mbycgOiBudWxsXG4gICAgfSk7XG5cbiAgICBpZiAoIW5vZGVzKSB7XG4gICAgICBzZXR0aW5ncy5hb0RyYXdDYWxsYmFjay5wdXNoKHtcbiAgICAgICAgXCJmblwiOiBfZm5VcGRhdGVJbmZvLFxuICAgICAgICBcInNOYW1lXCI6IFwiaW5mb3JtYXRpb25cIlxuICAgICAgfSk7XG4gICAgICBuLmF0dHIoJ3JvbGUnLCAnc3RhdHVzJykuYXR0cignYXJpYS1saXZlJywgJ3BvbGl0ZScpO1xuICAgICAgJChzZXR0aW5ncy5uVGFibGUpLmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCB0aWQgKyAnX2luZm8nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gblswXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblVwZGF0ZUluZm8oc2V0dGluZ3MpIHtcbiAgICB2YXIgbm9kZXMgPSBzZXR0aW5ncy5hYW5GZWF0dXJlcy5pO1xuXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBsYW5nID0gc2V0dGluZ3Mub0xhbmd1YWdlLFxuICAgICAgICBzdGFydCA9IHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0ICsgMSxcbiAgICAgICAgZW5kID0gc2V0dGluZ3MuZm5EaXNwbGF5RW5kKCksXG4gICAgICAgIG1heCA9IHNldHRpbmdzLmZuUmVjb3Jkc1RvdGFsKCksXG4gICAgICAgIHRvdGFsID0gc2V0dGluZ3MuZm5SZWNvcmRzRGlzcGxheSgpLFxuICAgICAgICBvdXQgPSB0b3RhbCA/IGxhbmcuc0luZm8gOiBsYW5nLnNJbmZvRW1wdHk7XG5cbiAgICBpZiAodG90YWwgIT09IG1heCkge1xuICAgICAgb3V0ICs9ICcgJyArIGxhbmcuc0luZm9GaWx0ZXJlZDtcbiAgICB9XG5cbiAgICBvdXQgKz0gbGFuZy5zSW5mb1Bvc3RGaXg7XG4gICAgb3V0ID0gX2ZuSW5mb01hY3JvcyhzZXR0aW5ncywgb3V0KTtcbiAgICB2YXIgY2FsbGJhY2sgPSBsYW5nLmZuSW5mb0NhbGxiYWNrO1xuXG4gICAgaWYgKGNhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICBvdXQgPSBjYWxsYmFjay5jYWxsKHNldHRpbmdzLm9JbnN0YW5jZSwgc2V0dGluZ3MsIHN0YXJ0LCBlbmQsIG1heCwgdG90YWwsIG91dCk7XG4gICAgfVxuXG4gICAgJChub2RlcykuaHRtbChvdXQpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuSW5mb01hY3JvcyhzZXR0aW5ncywgc3RyKSB7XG4gICAgdmFyIGZvcm1hdHRlciA9IHNldHRpbmdzLmZuRm9ybWF0TnVtYmVyLFxuICAgICAgICBzdGFydCA9IHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0ICsgMSxcbiAgICAgICAgbGVuID0gc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoLFxuICAgICAgICB2aXMgPSBzZXR0aW5ncy5mblJlY29yZHNEaXNwbGF5KCksXG4gICAgICAgIGFsbCA9IGxlbiA9PT0gLTE7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9fU1RBUlRfL2csIGZvcm1hdHRlci5jYWxsKHNldHRpbmdzLCBzdGFydCkpLnJlcGxhY2UoL19FTkRfL2csIGZvcm1hdHRlci5jYWxsKHNldHRpbmdzLCBzZXR0aW5ncy5mbkRpc3BsYXlFbmQoKSkpLnJlcGxhY2UoL19NQVhfL2csIGZvcm1hdHRlci5jYWxsKHNldHRpbmdzLCBzZXR0aW5ncy5mblJlY29yZHNUb3RhbCgpKSkucmVwbGFjZSgvX1RPVEFMXy9nLCBmb3JtYXR0ZXIuY2FsbChzZXR0aW5ncywgdmlzKSkucmVwbGFjZSgvX1BBR0VfL2csIGZvcm1hdHRlci5jYWxsKHNldHRpbmdzLCBhbGwgPyAxIDogTWF0aC5jZWlsKHN0YXJ0IC8gbGVuKSkpLnJlcGxhY2UoL19QQUdFU18vZywgZm9ybWF0dGVyLmNhbGwoc2V0dGluZ3MsIGFsbCA/IDEgOiBNYXRoLmNlaWwodmlzIC8gbGVuKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuSW5pdGlhbGlzZShzZXR0aW5ncykge1xuICAgIHZhciBpLFxuICAgICAgICBpTGVuLFxuICAgICAgICBpQWpheFN0YXJ0ID0gc2V0dGluZ3MuaUluaXREaXNwbGF5U3RhcnQ7XG4gICAgdmFyIGNvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnMsXG4gICAgICAgIGNvbHVtbjtcbiAgICB2YXIgZmVhdHVyZXMgPSBzZXR0aW5ncy5vRmVhdHVyZXM7XG4gICAgdmFyIGRlZmVyTG9hZGluZyA9IHNldHRpbmdzLmJEZWZlckxvYWRpbmc7XG5cbiAgICBpZiAoIXNldHRpbmdzLmJJbml0aWFsaXNlZCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIF9mbkluaXRpYWxpc2Uoc2V0dGluZ3MpO1xuICAgICAgfSwgMjAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBfZm5BZGRPcHRpb25zSHRtbChzZXR0aW5ncyk7XG5cbiAgICBfZm5CdWlsZEhlYWQoc2V0dGluZ3MpO1xuXG4gICAgX2ZuRHJhd0hlYWQoc2V0dGluZ3MsIHNldHRpbmdzLmFvSGVhZGVyKTtcblxuICAgIF9mbkRyYXdIZWFkKHNldHRpbmdzLCBzZXR0aW5ncy5hb0Zvb3Rlcik7XG5cbiAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShzZXR0aW5ncywgdHJ1ZSk7XG5cbiAgICBpZiAoZmVhdHVyZXMuYkF1dG9XaWR0aCkge1xuICAgICAgX2ZuQ2FsY3VsYXRlQ29sdW1uV2lkdGhzKHNldHRpbmdzKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBpTGVuID0gY29sdW1ucy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIGNvbHVtbiA9IGNvbHVtbnNbaV07XG5cbiAgICAgIGlmIChjb2x1bW4uc1dpZHRoKSB7XG4gICAgICAgIGNvbHVtbi5uVGguc3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0Nzcyhjb2x1bW4uc1dpZHRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIG51bGwsICdwcmVJbml0JywgW3NldHRpbmdzXSk7XG5cbiAgICBfZm5SZURyYXcoc2V0dGluZ3MpO1xuXG4gICAgdmFyIGRhdGFTcmMgPSBfZm5EYXRhU291cmNlKHNldHRpbmdzKTtcblxuICAgIGlmIChkYXRhU3JjICE9ICdzc3AnIHx8IGRlZmVyTG9hZGluZykge1xuICAgICAgaWYgKGRhdGFTcmMgPT0gJ2FqYXgnKSB7XG4gICAgICAgIF9mbkJ1aWxkQWpheChzZXR0aW5ncywgW10sIGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgdmFyIGFEYXRhID0gX2ZuQWpheERhdGFTcmMoc2V0dGluZ3MsIGpzb24pO1xuXG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGFEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBfZm5BZGREYXRhKHNldHRpbmdzLCBhRGF0YVtpXSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2V0dGluZ3MuaUluaXREaXNwbGF5U3RhcnQgPSBpQWpheFN0YXJ0O1xuXG4gICAgICAgICAgX2ZuUmVEcmF3KHNldHRpbmdzKTtcblxuICAgICAgICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KHNldHRpbmdzLCBmYWxzZSk7XG5cbiAgICAgICAgICBfZm5Jbml0Q29tcGxldGUoc2V0dGluZ3MsIGpzb24pO1xuICAgICAgICB9LCBzZXR0aW5ncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShzZXR0aW5ncywgZmFsc2UpO1xuXG4gICAgICAgIF9mbkluaXRDb21wbGV0ZShzZXR0aW5ncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuSW5pdENvbXBsZXRlKHNldHRpbmdzLCBqc29uKSB7XG4gICAgc2V0dGluZ3MuX2JJbml0Q29tcGxldGUgPSB0cnVlO1xuXG4gICAgaWYgKGpzb24gfHwgc2V0dGluZ3Mub0luaXQuYWFEYXRhKSB7XG4gICAgICBfZm5BZGp1c3RDb2x1bW5TaXppbmcoc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgbnVsbCwgJ3BsdWdpbi1pbml0JywgW3NldHRpbmdzLCBqc29uXSk7XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsICdhb0luaXRDb21wbGV0ZScsICdpbml0JywgW3NldHRpbmdzLCBqc29uXSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5MZW5ndGhDaGFuZ2Uoc2V0dGluZ3MsIHZhbCkge1xuICAgIHZhciBsZW4gPSBwYXJzZUludCh2YWwsIDEwKTtcbiAgICBzZXR0aW5ncy5faURpc3BsYXlMZW5ndGggPSBsZW47XG5cbiAgICBfZm5MZW5ndGhPdmVyZmxvdyhzZXR0aW5ncyk7XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIG51bGwsICdsZW5ndGgnLCBbc2V0dGluZ3MsIGxlbl0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmVhdHVyZUh0bWxMZW5ndGgoc2V0dGluZ3MpIHtcbiAgICB2YXIgY2xhc3NlcyA9IHNldHRpbmdzLm9DbGFzc2VzLFxuICAgICAgICB0YWJsZUlkID0gc2V0dGluZ3Muc1RhYmxlSWQsXG4gICAgICAgIG1lbnUgPSBzZXR0aW5ncy5hTGVuZ3RoTWVudSxcbiAgICAgICAgZDIgPSAkLmlzQXJyYXkobWVudVswXSksXG4gICAgICAgIGxlbmd0aHMgPSBkMiA/IG1lbnVbMF0gOiBtZW51LFxuICAgICAgICBsYW5ndWFnZSA9IGQyID8gbWVudVsxXSA6IG1lbnU7XG4gICAgdmFyIHNlbGVjdCA9ICQoJzxzZWxlY3QvPicsIHtcbiAgICAgICduYW1lJzogdGFibGVJZCArICdfbGVuZ3RoJyxcbiAgICAgICdhcmlhLWNvbnRyb2xzJzogdGFibGVJZCxcbiAgICAgICdjbGFzcyc6IGNsYXNzZXMuc0xlbmd0aFNlbGVjdFxuICAgIH0pO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGxlbmd0aHMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIHNlbGVjdFswXVtpXSA9IG5ldyBPcHRpb24odHlwZW9mIGxhbmd1YWdlW2ldID09PSAnbnVtYmVyJyA/IHNldHRpbmdzLmZuRm9ybWF0TnVtYmVyKGxhbmd1YWdlW2ldKSA6IGxhbmd1YWdlW2ldLCBsZW5ndGhzW2ldKTtcbiAgICB9XG5cbiAgICB2YXIgZGl2ID0gJCgnPGRpdj48bGFiZWwvPjwvZGl2PicpLmFkZENsYXNzKGNsYXNzZXMuc0xlbmd0aCk7XG5cbiAgICBpZiAoIXNldHRpbmdzLmFhbkZlYXR1cmVzLmwpIHtcbiAgICAgIGRpdlswXS5pZCA9IHRhYmxlSWQgKyAnX2xlbmd0aCc7XG4gICAgfVxuXG4gICAgZGl2LmNoaWxkcmVuKCkuYXBwZW5kKHNldHRpbmdzLm9MYW5ndWFnZS5zTGVuZ3RoTWVudS5yZXBsYWNlKCdfTUVOVV8nLCBzZWxlY3RbMF0ub3V0ZXJIVE1MKSk7XG4gICAgJCgnc2VsZWN0JywgZGl2KS52YWwoc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoKS5vbignY2hhbmdlLkRUJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIF9mbkxlbmd0aENoYW5nZShzZXR0aW5ncywgJCh0aGlzKS52YWwoKSk7XG5cbiAgICAgIF9mbkRyYXcoc2V0dGluZ3MpO1xuICAgIH0pO1xuICAgICQoc2V0dGluZ3MublRhYmxlKS5vbignbGVuZ3RoLmR0LkRUJywgZnVuY3Rpb24gKGUsIHMsIGxlbikge1xuICAgICAgaWYgKHNldHRpbmdzID09PSBzKSB7XG4gICAgICAgICQoJ3NlbGVjdCcsIGRpdikudmFsKGxlbik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRpdlswXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZlYXR1cmVIdG1sUGFnaW5hdGUoc2V0dGluZ3MpIHtcbiAgICB2YXIgdHlwZSA9IHNldHRpbmdzLnNQYWdpbmF0aW9uVHlwZSxcbiAgICAgICAgcGx1Z2luID0gRGF0YVRhYmxlLmV4dC5wYWdlclt0eXBlXSxcbiAgICAgICAgbW9kZXJuID0gdHlwZW9mIHBsdWdpbiA9PT0gJ2Z1bmN0aW9uJyxcbiAgICAgICAgcmVkcmF3ID0gZnVuY3Rpb24gcmVkcmF3KHNldHRpbmdzKSB7XG4gICAgICBfZm5EcmF3KHNldHRpbmdzKTtcbiAgICB9LFxuICAgICAgICBub2RlID0gJCgnPGRpdi8+JykuYWRkQ2xhc3Moc2V0dGluZ3Mub0NsYXNzZXMuc1BhZ2luZyArIHR5cGUpWzBdLFxuICAgICAgICBmZWF0dXJlcyA9IHNldHRpbmdzLmFhbkZlYXR1cmVzO1xuXG4gICAgaWYgKCFtb2Rlcm4pIHtcbiAgICAgIHBsdWdpbi5mbkluaXQoc2V0dGluZ3MsIG5vZGUsIHJlZHJhdyk7XG4gICAgfVxuXG4gICAgaWYgKCFmZWF0dXJlcy5wKSB7XG4gICAgICBub2RlLmlkID0gc2V0dGluZ3Muc1RhYmxlSWQgKyAnX3BhZ2luYXRlJztcbiAgICAgIHNldHRpbmdzLmFvRHJhd0NhbGxiYWNrLnB1c2goe1xuICAgICAgICBcImZuXCI6IGZ1bmN0aW9uIGZuKHNldHRpbmdzKSB7XG4gICAgICAgICAgaWYgKG1vZGVybikge1xuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQsXG4gICAgICAgICAgICAgICAgbGVuID0gc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoLFxuICAgICAgICAgICAgICAgIHZpc1JlY29yZHMgPSBzZXR0aW5ncy5mblJlY29yZHNEaXNwbGF5KCksXG4gICAgICAgICAgICAgICAgYWxsID0gbGVuID09PSAtMSxcbiAgICAgICAgICAgICAgICBwYWdlID0gYWxsID8gMCA6IE1hdGguY2VpbChzdGFydCAvIGxlbiksXG4gICAgICAgICAgICAgICAgcGFnZXMgPSBhbGwgPyAxIDogTWF0aC5jZWlsKHZpc1JlY29yZHMgLyBsZW4pLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnMgPSBwbHVnaW4ocGFnZSwgcGFnZXMpLFxuICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgaWVuO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBpZW4gPSBmZWF0dXJlcy5wLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgICAgIF9mblJlbmRlcmVyKHNldHRpbmdzLCAncGFnZUJ1dHRvbicpKHNldHRpbmdzLCBmZWF0dXJlcy5wW2ldLCBpLCBidXR0b25zLCBwYWdlLCBwYWdlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsdWdpbi5mblVwZGF0ZShzZXR0aW5ncywgcmVkcmF3KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic05hbWVcIjogXCJwYWdpbmF0aW9uXCJcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuUGFnZUNoYW5nZShzZXR0aW5ncywgYWN0aW9uLCByZWRyYXcpIHtcbiAgICB2YXIgc3RhcnQgPSBzZXR0aW5ncy5faURpc3BsYXlTdGFydCxcbiAgICAgICAgbGVuID0gc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoLFxuICAgICAgICByZWNvcmRzID0gc2V0dGluZ3MuZm5SZWNvcmRzRGlzcGxheSgpO1xuXG4gICAgaWYgKHJlY29yZHMgPT09IDAgfHwgbGVuID09PSAtMSkge1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbiA9PT0gXCJudW1iZXJcIikge1xuICAgICAgc3RhcnQgPSBhY3Rpb24gKiBsZW47XG5cbiAgICAgIGlmIChzdGFydCA+IHJlY29yZHMpIHtcbiAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYWN0aW9uID09IFwiZmlyc3RcIikge1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH0gZWxzZSBpZiAoYWN0aW9uID09IFwicHJldmlvdXNcIikge1xuICAgICAgc3RhcnQgPSBsZW4gPj0gMCA/IHN0YXJ0IC0gbGVuIDogMDtcblxuICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICBzdGFydCA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhY3Rpb24gPT0gXCJuZXh0XCIpIHtcbiAgICAgIGlmIChzdGFydCArIGxlbiA8IHJlY29yZHMpIHtcbiAgICAgICAgc3RhcnQgKz0gbGVuO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYWN0aW9uID09IFwibGFzdFwiKSB7XG4gICAgICBzdGFydCA9IE1hdGguZmxvb3IoKHJlY29yZHMgLSAxKSAvIGxlbikgKiBsZW47XG4gICAgfSBlbHNlIHtcbiAgICAgIF9mbkxvZyhzZXR0aW5ncywgMCwgXCJVbmtub3duIHBhZ2luZyBhY3Rpb246IFwiICsgYWN0aW9uLCA1KTtcbiAgICB9XG5cbiAgICB2YXIgY2hhbmdlZCA9IHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0ICE9PSBzdGFydDtcbiAgICBzZXR0aW5ncy5faURpc3BsYXlTdGFydCA9IHN0YXJ0O1xuXG4gICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgbnVsbCwgJ3BhZ2UnLCBbc2V0dGluZ3NdKTtcblxuICAgICAgaWYgKHJlZHJhdykge1xuICAgICAgICBfZm5EcmF3KHNldHRpbmdzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hhbmdlZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkZlYXR1cmVIdG1sUHJvY2Vzc2luZyhzZXR0aW5ncykge1xuICAgIHJldHVybiAkKCc8ZGl2Lz4nLCB7XG4gICAgICAnaWQnOiAhc2V0dGluZ3MuYWFuRmVhdHVyZXMuciA/IHNldHRpbmdzLnNUYWJsZUlkICsgJ19wcm9jZXNzaW5nJyA6IG51bGwsXG4gICAgICAnY2xhc3MnOiBzZXR0aW5ncy5vQ2xhc3Nlcy5zUHJvY2Vzc2luZ1xuICAgIH0pLmh0bWwoc2V0dGluZ3Mub0xhbmd1YWdlLnNQcm9jZXNzaW5nKS5pbnNlcnRCZWZvcmUoc2V0dGluZ3MublRhYmxlKVswXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblByb2Nlc3NpbmdEaXNwbGF5KHNldHRpbmdzLCBzaG93KSB7XG4gICAgaWYgKHNldHRpbmdzLm9GZWF0dXJlcy5iUHJvY2Vzc2luZykge1xuICAgICAgJChzZXR0aW5ncy5hYW5GZWF0dXJlcy5yKS5jc3MoJ2Rpc3BsYXknLCBzaG93ID8gJ2Jsb2NrJyA6ICdub25lJyk7XG4gICAgfVxuXG4gICAgX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCBudWxsLCAncHJvY2Vzc2luZycsIFtzZXR0aW5ncywgc2hvd10pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRmVhdHVyZUh0bWxUYWJsZShzZXR0aW5ncykge1xuICAgIHZhciB0YWJsZSA9ICQoc2V0dGluZ3MublRhYmxlKTtcbiAgICB0YWJsZS5hdHRyKCdyb2xlJywgJ2dyaWQnKTtcbiAgICB2YXIgc2Nyb2xsID0gc2V0dGluZ3Mub1Njcm9sbDtcblxuICAgIGlmIChzY3JvbGwuc1ggPT09ICcnICYmIHNjcm9sbC5zWSA9PT0gJycpIHtcbiAgICAgIHJldHVybiBzZXR0aW5ncy5uVGFibGU7XG4gICAgfVxuXG4gICAgdmFyIHNjcm9sbFggPSBzY3JvbGwuc1g7XG4gICAgdmFyIHNjcm9sbFkgPSBzY3JvbGwuc1k7XG4gICAgdmFyIGNsYXNzZXMgPSBzZXR0aW5ncy5vQ2xhc3NlcztcbiAgICB2YXIgY2FwdGlvbiA9IHRhYmxlLmNoaWxkcmVuKCdjYXB0aW9uJyk7XG4gICAgdmFyIGNhcHRpb25TaWRlID0gY2FwdGlvbi5sZW5ndGggPyBjYXB0aW9uWzBdLl9jYXB0aW9uU2lkZSA6IG51bGw7XG4gICAgdmFyIGhlYWRlckNsb25lID0gJCh0YWJsZVswXS5jbG9uZU5vZGUoZmFsc2UpKTtcbiAgICB2YXIgZm9vdGVyQ2xvbmUgPSAkKHRhYmxlWzBdLmNsb25lTm9kZShmYWxzZSkpO1xuICAgIHZhciBmb290ZXIgPSB0YWJsZS5jaGlsZHJlbigndGZvb3QnKTtcbiAgICB2YXIgX2RpdiA9ICc8ZGl2Lz4nO1xuXG4gICAgdmFyIHNpemUgPSBmdW5jdGlvbiBzaXplKHMpIHtcbiAgICAgIHJldHVybiAhcyA/IG51bGwgOiBfZm5TdHJpbmdUb0NzcyhzKTtcbiAgICB9O1xuXG4gICAgaWYgKCFmb290ZXIubGVuZ3RoKSB7XG4gICAgICBmb290ZXIgPSBudWxsO1xuICAgIH1cblxuICAgIHZhciBzY3JvbGxlciA9ICQoX2Rpdiwge1xuICAgICAgJ2NsYXNzJzogY2xhc3Nlcy5zU2Nyb2xsV3JhcHBlclxuICAgIH0pLmFwcGVuZCgkKF9kaXYsIHtcbiAgICAgICdjbGFzcyc6IGNsYXNzZXMuc1Njcm9sbEhlYWRcbiAgICB9KS5jc3Moe1xuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICBib3JkZXI6IDAsXG4gICAgICB3aWR0aDogc2Nyb2xsWCA/IHNpemUoc2Nyb2xsWCkgOiAnMTAwJSdcbiAgICB9KS5hcHBlbmQoJChfZGl2LCB7XG4gICAgICAnY2xhc3MnOiBjbGFzc2VzLnNTY3JvbGxIZWFkSW5uZXJcbiAgICB9KS5jc3Moe1xuICAgICAgJ2JveC1zaXppbmcnOiAnY29udGVudC1ib3gnLFxuICAgICAgd2lkdGg6IHNjcm9sbC5zWElubmVyIHx8ICcxMDAlJ1xuICAgIH0pLmFwcGVuZChoZWFkZXJDbG9uZS5yZW1vdmVBdHRyKCdpZCcpLmNzcygnbWFyZ2luLWxlZnQnLCAwKS5hcHBlbmQoY2FwdGlvblNpZGUgPT09ICd0b3AnID8gY2FwdGlvbiA6IG51bGwpLmFwcGVuZCh0YWJsZS5jaGlsZHJlbigndGhlYWQnKSkpKSkuYXBwZW5kKCQoX2Rpdiwge1xuICAgICAgJ2NsYXNzJzogY2xhc3Nlcy5zU2Nyb2xsQm9keVxuICAgIH0pLmNzcyh7XG4gICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgIG92ZXJmbG93OiAnYXV0bycsXG4gICAgICB3aWR0aDogc2l6ZShzY3JvbGxYKVxuICAgIH0pLmFwcGVuZCh0YWJsZSkpO1xuXG4gICAgaWYgKGZvb3Rlcikge1xuICAgICAgc2Nyb2xsZXIuYXBwZW5kKCQoX2Rpdiwge1xuICAgICAgICAnY2xhc3MnOiBjbGFzc2VzLnNTY3JvbGxGb290XG4gICAgICB9KS5jc3Moe1xuICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgd2lkdGg6IHNjcm9sbFggPyBzaXplKHNjcm9sbFgpIDogJzEwMCUnXG4gICAgICB9KS5hcHBlbmQoJChfZGl2LCB7XG4gICAgICAgICdjbGFzcyc6IGNsYXNzZXMuc1Njcm9sbEZvb3RJbm5lclxuICAgICAgfSkuYXBwZW5kKGZvb3RlckNsb25lLnJlbW92ZUF0dHIoJ2lkJykuY3NzKCdtYXJnaW4tbGVmdCcsIDApLmFwcGVuZChjYXB0aW9uU2lkZSA9PT0gJ2JvdHRvbScgPyBjYXB0aW9uIDogbnVsbCkuYXBwZW5kKHRhYmxlLmNoaWxkcmVuKCd0Zm9vdCcpKSkpKTtcbiAgICB9XG5cbiAgICB2YXIgY2hpbGRyZW4gPSBzY3JvbGxlci5jaGlsZHJlbigpO1xuICAgIHZhciBzY3JvbGxIZWFkID0gY2hpbGRyZW5bMF07XG4gICAgdmFyIHNjcm9sbEJvZHkgPSBjaGlsZHJlblsxXTtcbiAgICB2YXIgc2Nyb2xsRm9vdCA9IGZvb3RlciA/IGNoaWxkcmVuWzJdIDogbnVsbDtcblxuICAgIGlmIChzY3JvbGxYKSB7XG4gICAgICAkKHNjcm9sbEJvZHkpLm9uKCdzY3JvbGwuRFQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgc2Nyb2xsTGVmdCA9IHRoaXMuc2Nyb2xsTGVmdDtcbiAgICAgICAgc2Nyb2xsSGVhZC5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcblxuICAgICAgICBpZiAoZm9vdGVyKSB7XG4gICAgICAgICAgc2Nyb2xsRm9vdC5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgJChzY3JvbGxCb2R5KS5jc3Moc2Nyb2xsWSAmJiBzY3JvbGwuYkNvbGxhcHNlID8gJ21heC1oZWlnaHQnIDogJ2hlaWdodCcsIHNjcm9sbFkpO1xuICAgIHNldHRpbmdzLm5TY3JvbGxIZWFkID0gc2Nyb2xsSGVhZDtcbiAgICBzZXR0aW5ncy5uU2Nyb2xsQm9keSA9IHNjcm9sbEJvZHk7XG4gICAgc2V0dGluZ3MublNjcm9sbEZvb3QgPSBzY3JvbGxGb290O1xuICAgIHNldHRpbmdzLmFvRHJhd0NhbGxiYWNrLnB1c2goe1xuICAgICAgXCJmblwiOiBfZm5TY3JvbGxEcmF3LFxuICAgICAgXCJzTmFtZVwiOiBcInNjcm9sbGluZ1wiXG4gICAgfSk7XG4gICAgcmV0dXJuIHNjcm9sbGVyWzBdO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU2Nyb2xsRHJhdyhzZXR0aW5ncykge1xuICAgIHZhciBzY3JvbGwgPSBzZXR0aW5ncy5vU2Nyb2xsLFxuICAgICAgICBzY3JvbGxYID0gc2Nyb2xsLnNYLFxuICAgICAgICBzY3JvbGxYSW5uZXIgPSBzY3JvbGwuc1hJbm5lcixcbiAgICAgICAgc2Nyb2xsWSA9IHNjcm9sbC5zWSxcbiAgICAgICAgYmFyV2lkdGggPSBzY3JvbGwuaUJhcldpZHRoLFxuICAgICAgICBkaXZIZWFkZXIgPSAkKHNldHRpbmdzLm5TY3JvbGxIZWFkKSxcbiAgICAgICAgZGl2SGVhZGVyU3R5bGUgPSBkaXZIZWFkZXJbMF0uc3R5bGUsXG4gICAgICAgIGRpdkhlYWRlcklubmVyID0gZGl2SGVhZGVyLmNoaWxkcmVuKCdkaXYnKSxcbiAgICAgICAgZGl2SGVhZGVySW5uZXJTdHlsZSA9IGRpdkhlYWRlcklubmVyWzBdLnN0eWxlLFxuICAgICAgICBkaXZIZWFkZXJUYWJsZSA9IGRpdkhlYWRlcklubmVyLmNoaWxkcmVuKCd0YWJsZScpLFxuICAgICAgICBkaXZCb2R5RWwgPSBzZXR0aW5ncy5uU2Nyb2xsQm9keSxcbiAgICAgICAgZGl2Qm9keSA9ICQoZGl2Qm9keUVsKSxcbiAgICAgICAgZGl2Qm9keVN0eWxlID0gZGl2Qm9keUVsLnN0eWxlLFxuICAgICAgICBkaXZGb290ZXIgPSAkKHNldHRpbmdzLm5TY3JvbGxGb290KSxcbiAgICAgICAgZGl2Rm9vdGVySW5uZXIgPSBkaXZGb290ZXIuY2hpbGRyZW4oJ2RpdicpLFxuICAgICAgICBkaXZGb290ZXJUYWJsZSA9IGRpdkZvb3RlcklubmVyLmNoaWxkcmVuKCd0YWJsZScpLFxuICAgICAgICBoZWFkZXIgPSAkKHNldHRpbmdzLm5USGVhZCksXG4gICAgICAgIHRhYmxlID0gJChzZXR0aW5ncy5uVGFibGUpLFxuICAgICAgICB0YWJsZUVsID0gdGFibGVbMF0sXG4gICAgICAgIHRhYmxlU3R5bGUgPSB0YWJsZUVsLnN0eWxlLFxuICAgICAgICBmb290ZXIgPSBzZXR0aW5ncy5uVEZvb3QgPyAkKHNldHRpbmdzLm5URm9vdCkgOiBudWxsLFxuICAgICAgICBicm93c2VyID0gc2V0dGluZ3Mub0Jyb3dzZXIsXG4gICAgICAgIGllNjcgPSBicm93c2VyLmJTY3JvbGxPdmVyc2l6ZSxcbiAgICAgICAgZHRIZWFkZXJDZWxscyA9IF9wbHVjayhzZXR0aW5ncy5hb0NvbHVtbnMsICduVGgnKSxcbiAgICAgICAgaGVhZGVyVHJnRWxzLFxuICAgICAgICBmb290ZXJUcmdFbHMsXG4gICAgICAgIGhlYWRlclNyY0VscyxcbiAgICAgICAgZm9vdGVyU3JjRWxzLFxuICAgICAgICBoZWFkZXJDb3B5LFxuICAgICAgICBmb290ZXJDb3B5LFxuICAgICAgICBoZWFkZXJXaWR0aHMgPSBbXSxcbiAgICAgICAgZm9vdGVyV2lkdGhzID0gW10sXG4gICAgICAgIGhlYWRlckNvbnRlbnQgPSBbXSxcbiAgICAgICAgZm9vdGVyQ29udGVudCA9IFtdLFxuICAgICAgICBpZHgsXG4gICAgICAgIGNvcnJlY3Rpb24sXG4gICAgICAgIHNhbml0eVdpZHRoLFxuICAgICAgICB6ZXJvT3V0ID0gZnVuY3Rpb24gemVyb091dChuU2l6ZXIpIHtcbiAgICAgIHZhciBzdHlsZSA9IG5TaXplci5zdHlsZTtcbiAgICAgIHN0eWxlLnBhZGRpbmdUb3AgPSBcIjBcIjtcbiAgICAgIHN0eWxlLnBhZGRpbmdCb3R0b20gPSBcIjBcIjtcbiAgICAgIHN0eWxlLmJvcmRlclRvcFdpZHRoID0gXCIwXCI7XG4gICAgICBzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCA9IFwiMFwiO1xuICAgICAgc3R5bGUuaGVpZ2h0ID0gMDtcbiAgICB9O1xuXG4gICAgdmFyIHNjcm9sbEJhclZpcyA9IGRpdkJvZHlFbC5zY3JvbGxIZWlnaHQgPiBkaXZCb2R5RWwuY2xpZW50SGVpZ2h0O1xuXG4gICAgaWYgKHNldHRpbmdzLnNjcm9sbEJhclZpcyAhPT0gc2Nyb2xsQmFyVmlzICYmIHNldHRpbmdzLnNjcm9sbEJhclZpcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzZXR0aW5ncy5zY3JvbGxCYXJWaXMgPSBzY3JvbGxCYXJWaXM7XG5cbiAgICAgIF9mbkFkanVzdENvbHVtblNpemluZyhzZXR0aW5ncyk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0dGluZ3Muc2Nyb2xsQmFyVmlzID0gc2Nyb2xsQmFyVmlzO1xuICAgIH1cblxuICAgIHRhYmxlLmNoaWxkcmVuKCd0aGVhZCwgdGZvb3QnKS5yZW1vdmUoKTtcblxuICAgIGlmIChmb290ZXIpIHtcbiAgICAgIGZvb3RlckNvcHkgPSBmb290ZXIuY2xvbmUoKS5wcmVwZW5kVG8odGFibGUpO1xuICAgICAgZm9vdGVyVHJnRWxzID0gZm9vdGVyLmZpbmQoJ3RyJyk7XG4gICAgICBmb290ZXJTcmNFbHMgPSBmb290ZXJDb3B5LmZpbmQoJ3RyJyk7XG4gICAgfVxuXG4gICAgaGVhZGVyQ29weSA9IGhlYWRlci5jbG9uZSgpLnByZXBlbmRUbyh0YWJsZSk7XG4gICAgaGVhZGVyVHJnRWxzID0gaGVhZGVyLmZpbmQoJ3RyJyk7XG4gICAgaGVhZGVyU3JjRWxzID0gaGVhZGVyQ29weS5maW5kKCd0cicpO1xuICAgIGhlYWRlckNvcHkuZmluZCgndGgsIHRkJykucmVtb3ZlQXR0cigndGFiaW5kZXgnKTtcblxuICAgIGlmICghc2Nyb2xsWCkge1xuICAgICAgZGl2Qm9keVN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgZGl2SGVhZGVyWzBdLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIH1cblxuICAgICQuZWFjaChfZm5HZXRVbmlxdWVUaHMoc2V0dGluZ3MsIGhlYWRlckNvcHkpLCBmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgIGlkeCA9IF9mblZpc2libGVUb0NvbHVtbkluZGV4KHNldHRpbmdzLCBpKTtcbiAgICAgIGVsLnN0eWxlLndpZHRoID0gc2V0dGluZ3MuYW9Db2x1bW5zW2lkeF0uc1dpZHRoO1xuICAgIH0pO1xuXG4gICAgaWYgKGZvb3Rlcikge1xuICAgICAgX2ZuQXBwbHlUb0NoaWxkcmVuKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIG4uc3R5bGUud2lkdGggPSBcIlwiO1xuICAgICAgfSwgZm9vdGVyU3JjRWxzKTtcbiAgICB9XG5cbiAgICBzYW5pdHlXaWR0aCA9IHRhYmxlLm91dGVyV2lkdGgoKTtcblxuICAgIGlmIChzY3JvbGxYID09PSBcIlwiKSB7XG4gICAgICB0YWJsZVN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG5cbiAgICAgIGlmIChpZTY3ICYmICh0YWJsZS5maW5kKCd0Ym9keScpLmhlaWdodCgpID4gZGl2Qm9keUVsLm9mZnNldEhlaWdodCB8fCBkaXZCb2R5LmNzcygnb3ZlcmZsb3cteScpID09IFwic2Nyb2xsXCIpKSB7XG4gICAgICAgIHRhYmxlU3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0Nzcyh0YWJsZS5vdXRlcldpZHRoKCkgLSBiYXJXaWR0aCk7XG4gICAgICB9XG5cbiAgICAgIHNhbml0eVdpZHRoID0gdGFibGUub3V0ZXJXaWR0aCgpO1xuICAgIH0gZWxzZSBpZiAoc2Nyb2xsWElubmVyICE9PSBcIlwiKSB7XG4gICAgICB0YWJsZVN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3Moc2Nyb2xsWElubmVyKTtcbiAgICAgIHNhbml0eVdpZHRoID0gdGFibGUub3V0ZXJXaWR0aCgpO1xuICAgIH1cblxuICAgIF9mbkFwcGx5VG9DaGlsZHJlbih6ZXJvT3V0LCBoZWFkZXJTcmNFbHMpO1xuXG4gICAgX2ZuQXBwbHlUb0NoaWxkcmVuKGZ1bmN0aW9uIChuU2l6ZXIpIHtcbiAgICAgIGhlYWRlckNvbnRlbnQucHVzaChuU2l6ZXIuaW5uZXJIVE1MKTtcbiAgICAgIGhlYWRlcldpZHRocy5wdXNoKF9mblN0cmluZ1RvQ3NzKCQoblNpemVyKS5jc3MoJ3dpZHRoJykpKTtcbiAgICB9LCBoZWFkZXJTcmNFbHMpO1xuXG4gICAgX2ZuQXBwbHlUb0NoaWxkcmVuKGZ1bmN0aW9uIChuVG9TaXplLCBpKSB7XG4gICAgICBpZiAoJC5pbkFycmF5KG5Ub1NpemUsIGR0SGVhZGVyQ2VsbHMpICE9PSAtMSkge1xuICAgICAgICBuVG9TaXplLnN0eWxlLndpZHRoID0gaGVhZGVyV2lkdGhzW2ldO1xuICAgICAgfVxuICAgIH0sIGhlYWRlclRyZ0Vscyk7XG5cbiAgICAkKGhlYWRlclNyY0VscykuaGVpZ2h0KDApO1xuXG4gICAgaWYgKGZvb3Rlcikge1xuICAgICAgX2ZuQXBwbHlUb0NoaWxkcmVuKHplcm9PdXQsIGZvb3RlclNyY0Vscyk7XG5cbiAgICAgIF9mbkFwcGx5VG9DaGlsZHJlbihmdW5jdGlvbiAoblNpemVyKSB7XG4gICAgICAgIGZvb3RlckNvbnRlbnQucHVzaChuU2l6ZXIuaW5uZXJIVE1MKTtcbiAgICAgICAgZm9vdGVyV2lkdGhzLnB1c2goX2ZuU3RyaW5nVG9Dc3MoJChuU2l6ZXIpLmNzcygnd2lkdGgnKSkpO1xuICAgICAgfSwgZm9vdGVyU3JjRWxzKTtcblxuICAgICAgX2ZuQXBwbHlUb0NoaWxkcmVuKGZ1bmN0aW9uIChuVG9TaXplLCBpKSB7XG4gICAgICAgIG5Ub1NpemUuc3R5bGUud2lkdGggPSBmb290ZXJXaWR0aHNbaV07XG4gICAgICB9LCBmb290ZXJUcmdFbHMpO1xuXG4gICAgICAkKGZvb3RlclNyY0VscykuaGVpZ2h0KDApO1xuICAgIH1cblxuICAgIF9mbkFwcGx5VG9DaGlsZHJlbihmdW5jdGlvbiAoblNpemVyLCBpKSB7XG4gICAgICBuU2l6ZXIuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJkYXRhVGFibGVzX3NpemluZ1wiPicgKyBoZWFkZXJDb250ZW50W2ldICsgJzwvZGl2Pic7XG4gICAgICBuU2l6ZXIuY2hpbGROb2Rlc1swXS5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcbiAgICAgIG5TaXplci5jaGlsZE5vZGVzWzBdLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgIG5TaXplci5zdHlsZS53aWR0aCA9IGhlYWRlcldpZHRoc1tpXTtcbiAgICB9LCBoZWFkZXJTcmNFbHMpO1xuXG4gICAgaWYgKGZvb3Rlcikge1xuICAgICAgX2ZuQXBwbHlUb0NoaWxkcmVuKGZ1bmN0aW9uIChuU2l6ZXIsIGkpIHtcbiAgICAgICAgblNpemVyLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiZGF0YVRhYmxlc19zaXppbmdcIj4nICsgZm9vdGVyQ29udGVudFtpXSArICc8L2Rpdj4nO1xuICAgICAgICBuU2l6ZXIuY2hpbGROb2Rlc1swXS5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcbiAgICAgICAgblNpemVyLmNoaWxkTm9kZXNbMF0uc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICBuU2l6ZXIuc3R5bGUud2lkdGggPSBmb290ZXJXaWR0aHNbaV07XG4gICAgICB9LCBmb290ZXJTcmNFbHMpO1xuICAgIH1cblxuICAgIGlmICh0YWJsZS5vdXRlcldpZHRoKCkgPCBzYW5pdHlXaWR0aCkge1xuICAgICAgY29ycmVjdGlvbiA9IGRpdkJvZHlFbC5zY3JvbGxIZWlnaHQgPiBkaXZCb2R5RWwub2Zmc2V0SGVpZ2h0IHx8IGRpdkJvZHkuY3NzKCdvdmVyZmxvdy15JykgPT0gXCJzY3JvbGxcIiA/IHNhbml0eVdpZHRoICsgYmFyV2lkdGggOiBzYW5pdHlXaWR0aDtcblxuICAgICAgaWYgKGllNjcgJiYgKGRpdkJvZHlFbC5zY3JvbGxIZWlnaHQgPiBkaXZCb2R5RWwub2Zmc2V0SGVpZ2h0IHx8IGRpdkJvZHkuY3NzKCdvdmVyZmxvdy15JykgPT0gXCJzY3JvbGxcIikpIHtcbiAgICAgICAgdGFibGVTdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKGNvcnJlY3Rpb24gLSBiYXJXaWR0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzY3JvbGxYID09PSBcIlwiIHx8IHNjcm9sbFhJbm5lciAhPT0gXCJcIikge1xuICAgICAgICBfZm5Mb2coc2V0dGluZ3MsIDEsICdQb3NzaWJsZSBjb2x1bW4gbWlzYWxpZ25tZW50JywgNik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvcnJlY3Rpb24gPSAnMTAwJSc7XG4gICAgfVxuXG4gICAgZGl2Qm9keVN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoY29ycmVjdGlvbik7XG4gICAgZGl2SGVhZGVyU3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0Nzcyhjb3JyZWN0aW9uKTtcblxuICAgIGlmIChmb290ZXIpIHtcbiAgICAgIHNldHRpbmdzLm5TY3JvbGxGb290LnN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoY29ycmVjdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKCFzY3JvbGxZKSB7XG4gICAgICBpZiAoaWU2Nykge1xuICAgICAgICBkaXZCb2R5U3R5bGUuaGVpZ2h0ID0gX2ZuU3RyaW5nVG9Dc3ModGFibGVFbC5vZmZzZXRIZWlnaHQgKyBiYXJXaWR0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGlPdXRlcldpZHRoID0gdGFibGUub3V0ZXJXaWR0aCgpO1xuICAgIGRpdkhlYWRlclRhYmxlWzBdLnN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoaU91dGVyV2lkdGgpO1xuICAgIGRpdkhlYWRlcklubmVyU3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0NzcyhpT3V0ZXJXaWR0aCk7XG4gICAgdmFyIGJTY3JvbGxpbmcgPSB0YWJsZS5oZWlnaHQoKSA+IGRpdkJvZHlFbC5jbGllbnRIZWlnaHQgfHwgZGl2Qm9keS5jc3MoJ292ZXJmbG93LXknKSA9PSBcInNjcm9sbFwiO1xuICAgIHZhciBwYWRkaW5nID0gJ3BhZGRpbmcnICsgKGJyb3dzZXIuYlNjcm9sbGJhckxlZnQgPyAnTGVmdCcgOiAnUmlnaHQnKTtcbiAgICBkaXZIZWFkZXJJbm5lclN0eWxlW3BhZGRpbmddID0gYlNjcm9sbGluZyA/IGJhcldpZHRoICsgXCJweFwiIDogXCIwcHhcIjtcblxuICAgIGlmIChmb290ZXIpIHtcbiAgICAgIGRpdkZvb3RlclRhYmxlWzBdLnN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoaU91dGVyV2lkdGgpO1xuICAgICAgZGl2Rm9vdGVySW5uZXJbMF0uc3R5bGUud2lkdGggPSBfZm5TdHJpbmdUb0NzcyhpT3V0ZXJXaWR0aCk7XG4gICAgICBkaXZGb290ZXJJbm5lclswXS5zdHlsZVtwYWRkaW5nXSA9IGJTY3JvbGxpbmcgPyBiYXJXaWR0aCArIFwicHhcIiA6IFwiMHB4XCI7XG4gICAgfVxuXG4gICAgdGFibGUuY2hpbGRyZW4oJ2NvbGdyb3VwJykuaW5zZXJ0QmVmb3JlKHRhYmxlLmNoaWxkcmVuKCd0aGVhZCcpKTtcbiAgICBkaXZCb2R5LnNjcm9sbCgpO1xuXG4gICAgaWYgKChzZXR0aW5ncy5iU29ydGVkIHx8IHNldHRpbmdzLmJGaWx0ZXJlZCkgJiYgIXNldHRpbmdzLl9kcmF3SG9sZCkge1xuICAgICAgZGl2Qm9keUVsLnNjcm9sbFRvcCA9IDA7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQXBwbHlUb0NoaWxkcmVuKGZuLCBhbjEsIGFuMikge1xuICAgIHZhciBpbmRleCA9IDAsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBpTGVuID0gYW4xLmxlbmd0aDtcbiAgICB2YXIgbk5vZGUxLCBuTm9kZTI7XG5cbiAgICB3aGlsZSAoaSA8IGlMZW4pIHtcbiAgICAgIG5Ob2RlMSA9IGFuMVtpXS5maXJzdENoaWxkO1xuICAgICAgbk5vZGUyID0gYW4yID8gYW4yW2ldLmZpcnN0Q2hpbGQgOiBudWxsO1xuXG4gICAgICB3aGlsZSAobk5vZGUxKSB7XG4gICAgICAgIGlmIChuTm9kZTEubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICBpZiAoYW4yKSB7XG4gICAgICAgICAgICBmbihuTm9kZTEsIG5Ob2RlMiwgaW5kZXgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmbihuTm9kZTEsIGluZGV4KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgbk5vZGUxID0gbk5vZGUxLm5leHRTaWJsaW5nO1xuICAgICAgICBuTm9kZTIgPSBhbjIgPyBuTm9kZTIubmV4dFNpYmxpbmcgOiBudWxsO1xuICAgICAgfVxuXG4gICAgICBpKys7XG4gICAgfVxuICB9XG5cbiAgdmFyIF9fcmVfaHRtbF9yZW1vdmUgPSAvPC4qPz4vZztcblxuICBmdW5jdGlvbiBfZm5DYWxjdWxhdGVDb2x1bW5XaWR0aHMob1NldHRpbmdzKSB7XG4gICAgdmFyIHRhYmxlID0gb1NldHRpbmdzLm5UYWJsZSxcbiAgICAgICAgY29sdW1ucyA9IG9TZXR0aW5ncy5hb0NvbHVtbnMsXG4gICAgICAgIHNjcm9sbCA9IG9TZXR0aW5ncy5vU2Nyb2xsLFxuICAgICAgICBzY3JvbGxZID0gc2Nyb2xsLnNZLFxuICAgICAgICBzY3JvbGxYID0gc2Nyb2xsLnNYLFxuICAgICAgICBzY3JvbGxYSW5uZXIgPSBzY3JvbGwuc1hJbm5lcixcbiAgICAgICAgY29sdW1uQ291bnQgPSBjb2x1bW5zLmxlbmd0aCxcbiAgICAgICAgdmlzaWJsZUNvbHVtbnMgPSBfZm5HZXRDb2x1bW5zKG9TZXR0aW5ncywgJ2JWaXNpYmxlJyksXG4gICAgICAgIGhlYWRlckNlbGxzID0gJCgndGgnLCBvU2V0dGluZ3MublRIZWFkKSxcbiAgICAgICAgdGFibGVXaWR0aEF0dHIgPSB0YWJsZS5nZXRBdHRyaWJ1dGUoJ3dpZHRoJyksXG4gICAgICAgIHRhYmxlQ29udGFpbmVyID0gdGFibGUucGFyZW50Tm9kZSxcbiAgICAgICAgdXNlcklucHV0cyA9IGZhbHNlLFxuICAgICAgICBpLFxuICAgICAgICBjb2x1bW4sXG4gICAgICAgIGNvbHVtbklkeCxcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIG91dGVyV2lkdGgsXG4gICAgICAgIGJyb3dzZXIgPSBvU2V0dGluZ3Mub0Jyb3dzZXIsXG4gICAgICAgIGllNjcgPSBicm93c2VyLmJTY3JvbGxPdmVyc2l6ZTtcblxuICAgIHZhciBzdHlsZVdpZHRoID0gdGFibGUuc3R5bGUud2lkdGg7XG5cbiAgICBpZiAoc3R5bGVXaWR0aCAmJiBzdHlsZVdpZHRoLmluZGV4T2YoJyUnKSAhPT0gLTEpIHtcbiAgICAgIHRhYmxlV2lkdGhBdHRyID0gc3R5bGVXaWR0aDtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgdmlzaWJsZUNvbHVtbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbHVtbiA9IGNvbHVtbnNbdmlzaWJsZUNvbHVtbnNbaV1dO1xuXG4gICAgICBpZiAoY29sdW1uLnNXaWR0aCAhPT0gbnVsbCkge1xuICAgICAgICBjb2x1bW4uc1dpZHRoID0gX2ZuQ29udmVydFRvV2lkdGgoY29sdW1uLnNXaWR0aE9yaWcsIHRhYmxlQ29udGFpbmVyKTtcbiAgICAgICAgdXNlcklucHV0cyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGllNjcgfHwgIXVzZXJJbnB1dHMgJiYgIXNjcm9sbFggJiYgIXNjcm9sbFkgJiYgY29sdW1uQ291bnQgPT0gX2ZuVmlzYmxlQ29sdW1ucyhvU2V0dGluZ3MpICYmIGNvbHVtbkNvdW50ID09IGhlYWRlckNlbGxzLmxlbmd0aCkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGNvbHVtbkNvdW50OyBpKyspIHtcbiAgICAgICAgdmFyIGNvbElkeCA9IF9mblZpc2libGVUb0NvbHVtbkluZGV4KG9TZXR0aW5ncywgaSk7XG5cbiAgICAgICAgaWYgKGNvbElkeCAhPT0gbnVsbCkge1xuICAgICAgICAgIGNvbHVtbnNbY29sSWR4XS5zV2lkdGggPSBfZm5TdHJpbmdUb0NzcyhoZWFkZXJDZWxscy5lcShpKS53aWR0aCgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdG1wVGFibGUgPSAkKHRhYmxlKS5jbG9uZSgpLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKS5yZW1vdmVBdHRyKCdpZCcpO1xuICAgICAgdG1wVGFibGUuZmluZCgndGJvZHkgdHInKS5yZW1vdmUoKTtcbiAgICAgIHZhciB0ciA9ICQoJzx0ci8+JykuYXBwZW5kVG8odG1wVGFibGUuZmluZCgndGJvZHknKSk7XG4gICAgICB0bXBUYWJsZS5maW5kKCd0aGVhZCwgdGZvb3QnKS5yZW1vdmUoKTtcbiAgICAgIHRtcFRhYmxlLmFwcGVuZCgkKG9TZXR0aW5ncy5uVEhlYWQpLmNsb25lKCkpLmFwcGVuZCgkKG9TZXR0aW5ncy5uVEZvb3QpLmNsb25lKCkpO1xuICAgICAgdG1wVGFibGUuZmluZCgndGZvb3QgdGgsIHRmb290IHRkJykuY3NzKCd3aWR0aCcsICcnKTtcbiAgICAgIGhlYWRlckNlbGxzID0gX2ZuR2V0VW5pcXVlVGhzKG9TZXR0aW5ncywgdG1wVGFibGUuZmluZCgndGhlYWQnKVswXSk7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCB2aXNpYmxlQ29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb2x1bW4gPSBjb2x1bW5zW3Zpc2libGVDb2x1bW5zW2ldXTtcbiAgICAgICAgaGVhZGVyQ2VsbHNbaV0uc3R5bGUud2lkdGggPSBjb2x1bW4uc1dpZHRoT3JpZyAhPT0gbnVsbCAmJiBjb2x1bW4uc1dpZHRoT3JpZyAhPT0gJycgPyBfZm5TdHJpbmdUb0Nzcyhjb2x1bW4uc1dpZHRoT3JpZykgOiAnJztcblxuICAgICAgICBpZiAoY29sdW1uLnNXaWR0aE9yaWcgJiYgc2Nyb2xsWCkge1xuICAgICAgICAgICQoaGVhZGVyQ2VsbHNbaV0pLmFwcGVuZCgkKCc8ZGl2Lz4nKS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IGNvbHVtbi5zV2lkdGhPcmlnLFxuICAgICAgICAgICAgbWFyZ2luOiAwLFxuICAgICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgICAgIGhlaWdodDogMVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob1NldHRpbmdzLmFvRGF0YS5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHZpc2libGVDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29sdW1uSWR4ID0gdmlzaWJsZUNvbHVtbnNbaV07XG4gICAgICAgICAgY29sdW1uID0gY29sdW1uc1tjb2x1bW5JZHhdO1xuICAgICAgICAgICQoX2ZuR2V0V2lkZXN0Tm9kZShvU2V0dGluZ3MsIGNvbHVtbklkeCkpLmNsb25lKGZhbHNlKS5hcHBlbmQoY29sdW1uLnNDb250ZW50UGFkZGluZykuYXBwZW5kVG8odHIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICQoJ1tuYW1lXScsIHRtcFRhYmxlKS5yZW1vdmVBdHRyKCduYW1lJyk7XG4gICAgICB2YXIgaG9sZGVyID0gJCgnPGRpdi8+JykuY3NzKHNjcm9sbFggfHwgc2Nyb2xsWSA/IHtcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gICAgICB9IDoge30pLmFwcGVuZCh0bXBUYWJsZSkuYXBwZW5kVG8odGFibGVDb250YWluZXIpO1xuXG4gICAgICBpZiAoc2Nyb2xsWCAmJiBzY3JvbGxYSW5uZXIpIHtcbiAgICAgICAgdG1wVGFibGUud2lkdGgoc2Nyb2xsWElubmVyKTtcbiAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsWCkge1xuICAgICAgICB0bXBUYWJsZS5jc3MoJ3dpZHRoJywgJ2F1dG8nKTtcbiAgICAgICAgdG1wVGFibGUucmVtb3ZlQXR0cignd2lkdGgnKTtcblxuICAgICAgICBpZiAodG1wVGFibGUud2lkdGgoKSA8IHRhYmxlQ29udGFpbmVyLmNsaWVudFdpZHRoICYmIHRhYmxlV2lkdGhBdHRyKSB7XG4gICAgICAgICAgdG1wVGFibGUud2lkdGgodGFibGVDb250YWluZXIuY2xpZW50V2lkdGgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHNjcm9sbFkpIHtcbiAgICAgICAgdG1wVGFibGUud2lkdGgodGFibGVDb250YWluZXIuY2xpZW50V2lkdGgpO1xuICAgICAgfSBlbHNlIGlmICh0YWJsZVdpZHRoQXR0cikge1xuICAgICAgICB0bXBUYWJsZS53aWR0aCh0YWJsZVdpZHRoQXR0cik7XG4gICAgICB9XG5cbiAgICAgIHZhciB0b3RhbCA9IDA7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCB2aXNpYmxlQ29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2VsbCA9ICQoaGVhZGVyQ2VsbHNbaV0pO1xuICAgICAgICB2YXIgYm9yZGVyID0gY2VsbC5vdXRlcldpZHRoKCkgLSBjZWxsLndpZHRoKCk7XG4gICAgICAgIHZhciBib3VuZGluZyA9IGJyb3dzZXIuYkJvdW5kaW5nID8gTWF0aC5jZWlsKGhlYWRlckNlbGxzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoKSA6IGNlbGwub3V0ZXJXaWR0aCgpO1xuICAgICAgICB0b3RhbCArPSBib3VuZGluZztcbiAgICAgICAgY29sdW1uc1t2aXNpYmxlQ29sdW1uc1tpXV0uc1dpZHRoID0gX2ZuU3RyaW5nVG9Dc3MoYm91bmRpbmcgLSBib3JkZXIpO1xuICAgICAgfVxuXG4gICAgICB0YWJsZS5zdHlsZS53aWR0aCA9IF9mblN0cmluZ1RvQ3NzKHRvdGFsKTtcbiAgICAgIGhvbGRlci5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBpZiAodGFibGVXaWR0aEF0dHIpIHtcbiAgICAgIHRhYmxlLnN0eWxlLndpZHRoID0gX2ZuU3RyaW5nVG9Dc3ModGFibGVXaWR0aEF0dHIpO1xuICAgIH1cblxuICAgIGlmICgodGFibGVXaWR0aEF0dHIgfHwgc2Nyb2xsWCkgJiYgIW9TZXR0aW5ncy5fcmVzekV2dCkge1xuICAgICAgdmFyIGJpbmRSZXNpemUgPSBmdW5jdGlvbiBiaW5kUmVzaXplKCkge1xuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS5EVC0nICsgb1NldHRpbmdzLnNJbnN0YW5jZSwgX2ZuVGhyb3R0bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF9mbkFkanVzdENvbHVtblNpemluZyhvU2V0dGluZ3MpO1xuICAgICAgICB9KSk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoaWU2Nykge1xuICAgICAgICBzZXRUaW1lb3V0KGJpbmRSZXNpemUsIDEwMDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmluZFJlc2l6ZSgpO1xuICAgICAgfVxuXG4gICAgICBvU2V0dGluZ3MuX3Jlc3pFdnQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHZhciBfZm5UaHJvdHRsZSA9IERhdGFUYWJsZS51dGlsLnRocm90dGxlO1xuXG4gIGZ1bmN0aW9uIF9mbkNvbnZlcnRUb1dpZHRoKHdpZHRoLCBwYXJlbnQpIHtcbiAgICBpZiAoIXdpZHRoKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICB2YXIgbiA9ICQoJzxkaXYvPicpLmNzcygnd2lkdGgnLCBfZm5TdHJpbmdUb0Nzcyh3aWR0aCkpLmFwcGVuZFRvKHBhcmVudCB8fCBkb2N1bWVudC5ib2R5KTtcbiAgICB2YXIgdmFsID0gblswXS5vZmZzZXRXaWR0aDtcbiAgICBuLnJlbW92ZSgpO1xuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5HZXRXaWRlc3ROb2RlKHNldHRpbmdzLCBjb2xJZHgpIHtcbiAgICB2YXIgaWR4ID0gX2ZuR2V0TWF4TGVuU3RyaW5nKHNldHRpbmdzLCBjb2xJZHgpO1xuXG4gICAgaWYgKGlkeCA8IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBkYXRhID0gc2V0dGluZ3MuYW9EYXRhW2lkeF07XG4gICAgcmV0dXJuICFkYXRhLm5UciA/ICQoJzx0ZC8+JykuaHRtbChfZm5HZXRDZWxsRGF0YShzZXR0aW5ncywgaWR4LCBjb2xJZHgsICdkaXNwbGF5JykpWzBdIDogZGF0YS5hbkNlbGxzW2NvbElkeF07XG4gIH1cblxuICBmdW5jdGlvbiBfZm5HZXRNYXhMZW5TdHJpbmcoc2V0dGluZ3MsIGNvbElkeCkge1xuICAgIHZhciBzLFxuICAgICAgICBtYXggPSAtMSxcbiAgICAgICAgbWF4SWR4ID0gLTE7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gc2V0dGluZ3MuYW9EYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBzID0gX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIGksIGNvbElkeCwgJ2Rpc3BsYXknKSArICcnO1xuICAgICAgcyA9IHMucmVwbGFjZShfX3JlX2h0bWxfcmVtb3ZlLCAnJyk7XG4gICAgICBzID0gcy5yZXBsYWNlKC8mbmJzcDsvZywgJyAnKTtcblxuICAgICAgaWYgKHMubGVuZ3RoID4gbWF4KSB7XG4gICAgICAgIG1heCA9IHMubGVuZ3RoO1xuICAgICAgICBtYXhJZHggPSBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtYXhJZHg7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5TdHJpbmdUb0NzcyhzKSB7XG4gICAgaWYgKHMgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnMHB4JztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHMgPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBzIDwgMCA/ICcwcHgnIDogcyArICdweCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHMubWF0Y2goL1xcZCQvKSA/IHMgKyAncHgnIDogcztcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNvcnRGbGF0dGVuKHNldHRpbmdzKSB7XG4gICAgdmFyIGksXG4gICAgICAgIGlMZW4sXG4gICAgICAgIGssXG4gICAgICAgIGtMZW4sXG4gICAgICAgIGFTb3J0ID0gW10sXG4gICAgICAgIGFpT3JpZyA9IFtdLFxuICAgICAgICBhb0NvbHVtbnMgPSBzZXR0aW5ncy5hb0NvbHVtbnMsXG4gICAgICAgIGFEYXRhU29ydCxcbiAgICAgICAgaUNvbCxcbiAgICAgICAgc1R5cGUsXG4gICAgICAgIHNyY0NvbCxcbiAgICAgICAgZml4ZWQgPSBzZXR0aW5ncy5hYVNvcnRpbmdGaXhlZCxcbiAgICAgICAgZml4ZWRPYmogPSAkLmlzUGxhaW5PYmplY3QoZml4ZWQpLFxuICAgICAgICBuZXN0ZWRTb3J0ID0gW10sXG4gICAgICAgIGFkZCA9IGZ1bmN0aW9uIGFkZChhKSB7XG4gICAgICBpZiAoYS5sZW5ndGggJiYgISQuaXNBcnJheShhWzBdKSkge1xuICAgICAgICBuZXN0ZWRTb3J0LnB1c2goYSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkLm1lcmdlKG5lc3RlZFNvcnQsIGEpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoJC5pc0FycmF5KGZpeGVkKSkge1xuICAgICAgYWRkKGZpeGVkKTtcbiAgICB9XG5cbiAgICBpZiAoZml4ZWRPYmogJiYgZml4ZWQucHJlKSB7XG4gICAgICBhZGQoZml4ZWQucHJlKTtcbiAgICB9XG5cbiAgICBhZGQoc2V0dGluZ3MuYWFTb3J0aW5nKTtcblxuICAgIGlmIChmaXhlZE9iaiAmJiBmaXhlZC5wb3N0KSB7XG4gICAgICBhZGQoZml4ZWQucG9zdCk7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IG5lc3RlZFNvcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHNyY0NvbCA9IG5lc3RlZFNvcnRbaV1bMF07XG4gICAgICBhRGF0YVNvcnQgPSBhb0NvbHVtbnNbc3JjQ29sXS5hRGF0YVNvcnQ7XG5cbiAgICAgIGZvciAoayA9IDAsIGtMZW4gPSBhRGF0YVNvcnQubGVuZ3RoOyBrIDwga0xlbjsgaysrKSB7XG4gICAgICAgIGlDb2wgPSBhRGF0YVNvcnRba107XG4gICAgICAgIHNUeXBlID0gYW9Db2x1bW5zW2lDb2xdLnNUeXBlIHx8ICdzdHJpbmcnO1xuXG4gICAgICAgIGlmIChuZXN0ZWRTb3J0W2ldLl9pZHggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG5lc3RlZFNvcnRbaV0uX2lkeCA9ICQuaW5BcnJheShuZXN0ZWRTb3J0W2ldWzFdLCBhb0NvbHVtbnNbaUNvbF0uYXNTb3J0aW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFTb3J0LnB1c2goe1xuICAgICAgICAgIHNyYzogc3JjQ29sLFxuICAgICAgICAgIGNvbDogaUNvbCxcbiAgICAgICAgICBkaXI6IG5lc3RlZFNvcnRbaV1bMV0sXG4gICAgICAgICAgaW5kZXg6IG5lc3RlZFNvcnRbaV0uX2lkeCxcbiAgICAgICAgICB0eXBlOiBzVHlwZSxcbiAgICAgICAgICBmb3JtYXR0ZXI6IERhdGFUYWJsZS5leHQudHlwZS5vcmRlcltzVHlwZSArIFwiLXByZVwiXVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYVNvcnQ7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Tb3J0KG9TZXR0aW5ncykge1xuICAgIHZhciBpLFxuICAgICAgICBpZW4sXG4gICAgICAgIGlMZW4sXG4gICAgICAgIGosXG4gICAgICAgIGpMZW4sXG4gICAgICAgIGssXG4gICAgICAgIGtMZW4sXG4gICAgICAgIHNEYXRhVHlwZSxcbiAgICAgICAgblRoLFxuICAgICAgICBhaU9yaWcgPSBbXSxcbiAgICAgICAgb0V4dFNvcnQgPSBEYXRhVGFibGUuZXh0LnR5cGUub3JkZXIsXG4gICAgICAgIGFvRGF0YSA9IG9TZXR0aW5ncy5hb0RhdGEsXG4gICAgICAgIGFvQ29sdW1ucyA9IG9TZXR0aW5ncy5hb0NvbHVtbnMsXG4gICAgICAgIGFEYXRhU29ydCxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgaUNvbCxcbiAgICAgICAgc1R5cGUsXG4gICAgICAgIG9Tb3J0LFxuICAgICAgICBmb3JtYXR0ZXJzID0gMCxcbiAgICAgICAgc29ydENvbCxcbiAgICAgICAgZGlzcGxheU1hc3RlciA9IG9TZXR0aW5ncy5haURpc3BsYXlNYXN0ZXIsXG4gICAgICAgIGFTb3J0O1xuXG4gICAgX2ZuQ29sdW1uVHlwZXMob1NldHRpbmdzKTtcblxuICAgIGFTb3J0ID0gX2ZuU29ydEZsYXR0ZW4ob1NldHRpbmdzKTtcblxuICAgIGZvciAoaSA9IDAsIGllbiA9IGFTb3J0Lmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBzb3J0Q29sID0gYVNvcnRbaV07XG5cbiAgICAgIGlmIChzb3J0Q29sLmZvcm1hdHRlcikge1xuICAgICAgICBmb3JtYXR0ZXJzKys7XG4gICAgICB9XG5cbiAgICAgIF9mblNvcnREYXRhKG9TZXR0aW5ncywgc29ydENvbC5jb2wpO1xuICAgIH1cblxuICAgIGlmIChfZm5EYXRhU291cmNlKG9TZXR0aW5ncykgIT0gJ3NzcCcgJiYgYVNvcnQubGVuZ3RoICE9PSAwKSB7XG4gICAgICBmb3IgKGkgPSAwLCBpTGVuID0gZGlzcGxheU1hc3Rlci5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgYWlPcmlnW2Rpc3BsYXlNYXN0ZXJbaV1dID0gaTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZvcm1hdHRlcnMgPT09IGFTb3J0Lmxlbmd0aCkge1xuICAgICAgICBkaXNwbGF5TWFzdGVyLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICB2YXIgeCxcbiAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgayxcbiAgICAgICAgICAgICAgdGVzdCxcbiAgICAgICAgICAgICAgc29ydCxcbiAgICAgICAgICAgICAgbGVuID0gYVNvcnQubGVuZ3RoLFxuICAgICAgICAgICAgICBkYXRhQSA9IGFvRGF0YVthXS5fYVNvcnREYXRhLFxuICAgICAgICAgICAgICBkYXRhQiA9IGFvRGF0YVtiXS5fYVNvcnREYXRhO1xuXG4gICAgICAgICAgZm9yIChrID0gMDsgayA8IGxlbjsgaysrKSB7XG4gICAgICAgICAgICBzb3J0ID0gYVNvcnRba107XG4gICAgICAgICAgICB4ID0gZGF0YUFbc29ydC5jb2xdO1xuICAgICAgICAgICAgeSA9IGRhdGFCW3NvcnQuY29sXTtcbiAgICAgICAgICAgIHRlc3QgPSB4IDwgeSA/IC0xIDogeCA+IHkgPyAxIDogMDtcblxuICAgICAgICAgICAgaWYgKHRlc3QgIT09IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNvcnQuZGlyID09PSAnYXNjJyA/IHRlc3QgOiAtdGVzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB4ID0gYWlPcmlnW2FdO1xuICAgICAgICAgIHkgPSBhaU9yaWdbYl07XG4gICAgICAgICAgcmV0dXJuIHggPCB5ID8gLTEgOiB4ID4geSA/IDEgOiAwO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3BsYXlNYXN0ZXIuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgIHZhciB4LFxuICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICBrLFxuICAgICAgICAgICAgICBsLFxuICAgICAgICAgICAgICB0ZXN0LFxuICAgICAgICAgICAgICBzb3J0LFxuICAgICAgICAgICAgICBmbixcbiAgICAgICAgICAgICAgbGVuID0gYVNvcnQubGVuZ3RoLFxuICAgICAgICAgICAgICBkYXRhQSA9IGFvRGF0YVthXS5fYVNvcnREYXRhLFxuICAgICAgICAgICAgICBkYXRhQiA9IGFvRGF0YVtiXS5fYVNvcnREYXRhO1xuXG4gICAgICAgICAgZm9yIChrID0gMDsgayA8IGxlbjsgaysrKSB7XG4gICAgICAgICAgICBzb3J0ID0gYVNvcnRba107XG4gICAgICAgICAgICB4ID0gZGF0YUFbc29ydC5jb2xdO1xuICAgICAgICAgICAgeSA9IGRhdGFCW3NvcnQuY29sXTtcbiAgICAgICAgICAgIGZuID0gb0V4dFNvcnRbc29ydC50eXBlICsgXCItXCIgKyBzb3J0LmRpcl0gfHwgb0V4dFNvcnRbXCJzdHJpbmctXCIgKyBzb3J0LmRpcl07XG4gICAgICAgICAgICB0ZXN0ID0gZm4oeCwgeSk7XG5cbiAgICAgICAgICAgIGlmICh0ZXN0ICE9PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0ZXN0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHggPSBhaU9yaWdbYV07XG4gICAgICAgICAgeSA9IGFpT3JpZ1tiXTtcbiAgICAgICAgICByZXR1cm4geCA8IHkgPyAtMSA6IHggPiB5ID8gMSA6IDA7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIG9TZXR0aW5ncy5iU29ydGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNvcnRBcmlhKHNldHRpbmdzKSB7XG4gICAgdmFyIGxhYmVsO1xuICAgIHZhciBuZXh0U29ydDtcbiAgICB2YXIgY29sdW1ucyA9IHNldHRpbmdzLmFvQ29sdW1ucztcblxuICAgIHZhciBhU29ydCA9IF9mblNvcnRGbGF0dGVuKHNldHRpbmdzKTtcblxuICAgIHZhciBvQXJpYSA9IHNldHRpbmdzLm9MYW5ndWFnZS5vQXJpYTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gY29sdW1ucy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIHZhciBjb2wgPSBjb2x1bW5zW2ldO1xuICAgICAgdmFyIGFzU29ydGluZyA9IGNvbC5hc1NvcnRpbmc7XG4gICAgICB2YXIgc1RpdGxlID0gY29sLnNUaXRsZS5yZXBsYWNlKC88Lio/Pi9nLCBcIlwiKTtcbiAgICAgIHZhciB0aCA9IGNvbC5uVGg7XG4gICAgICB0aC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtc29ydCcpO1xuXG4gICAgICBpZiAoY29sLmJTb3J0YWJsZSkge1xuICAgICAgICBpZiAoYVNvcnQubGVuZ3RoID4gMCAmJiBhU29ydFswXS5jb2wgPT0gaSkge1xuICAgICAgICAgIHRoLnNldEF0dHJpYnV0ZSgnYXJpYS1zb3J0JywgYVNvcnRbMF0uZGlyID09IFwiYXNjXCIgPyBcImFzY2VuZGluZ1wiIDogXCJkZXNjZW5kaW5nXCIpO1xuICAgICAgICAgIG5leHRTb3J0ID0gYXNTb3J0aW5nW2FTb3J0WzBdLmluZGV4ICsgMV0gfHwgYXNTb3J0aW5nWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5leHRTb3J0ID0gYXNTb3J0aW5nWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFiZWwgPSBzVGl0bGUgKyAobmV4dFNvcnQgPT09IFwiYXNjXCIgPyBvQXJpYS5zU29ydEFzY2VuZGluZyA6IG9BcmlhLnNTb3J0RGVzY2VuZGluZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYWJlbCA9IHNUaXRsZTtcbiAgICAgIH1cblxuICAgICAgdGguc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgbGFiZWwpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNvcnRMaXN0ZW5lcihzZXR0aW5ncywgY29sSWR4LCBhcHBlbmQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGNvbCA9IHNldHRpbmdzLmFvQ29sdW1uc1tjb2xJZHhdO1xuICAgIHZhciBzb3J0aW5nID0gc2V0dGluZ3MuYWFTb3J0aW5nO1xuICAgIHZhciBhc1NvcnRpbmcgPSBjb2wuYXNTb3J0aW5nO1xuICAgIHZhciBuZXh0U29ydElkeDtcblxuICAgIHZhciBuZXh0ID0gZnVuY3Rpb24gbmV4dChhLCBvdmVyZmxvdykge1xuICAgICAgdmFyIGlkeCA9IGEuX2lkeDtcblxuICAgICAgaWYgKGlkeCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlkeCA9ICQuaW5BcnJheShhWzFdLCBhc1NvcnRpbmcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaWR4ICsgMSA8IGFzU29ydGluZy5sZW5ndGggPyBpZHggKyAxIDogb3ZlcmZsb3cgPyBudWxsIDogMDtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBzb3J0aW5nWzBdID09PSAnbnVtYmVyJykge1xuICAgICAgc29ydGluZyA9IHNldHRpbmdzLmFhU29ydGluZyA9IFtzb3J0aW5nXTtcbiAgICB9XG5cbiAgICBpZiAoYXBwZW5kICYmIHNldHRpbmdzLm9GZWF0dXJlcy5iU29ydE11bHRpKSB7XG4gICAgICB2YXIgc29ydElkeCA9ICQuaW5BcnJheShjb2xJZHgsIF9wbHVjayhzb3J0aW5nLCAnMCcpKTtcblxuICAgICAgaWYgKHNvcnRJZHggIT09IC0xKSB7XG4gICAgICAgIG5leHRTb3J0SWR4ID0gbmV4dChzb3J0aW5nW3NvcnRJZHhdLCB0cnVlKTtcblxuICAgICAgICBpZiAobmV4dFNvcnRJZHggPT09IG51bGwgJiYgc29ydGluZy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBuZXh0U29ydElkeCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV4dFNvcnRJZHggPT09IG51bGwpIHtcbiAgICAgICAgICBzb3J0aW5nLnNwbGljZShzb3J0SWR4LCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzb3J0aW5nW3NvcnRJZHhdWzFdID0gYXNTb3J0aW5nW25leHRTb3J0SWR4XTtcbiAgICAgICAgICBzb3J0aW5nW3NvcnRJZHhdLl9pZHggPSBuZXh0U29ydElkeDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc29ydGluZy5wdXNoKFtjb2xJZHgsIGFzU29ydGluZ1swXSwgMF0pO1xuICAgICAgICBzb3J0aW5nW3NvcnRpbmcubGVuZ3RoIC0gMV0uX2lkeCA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzb3J0aW5nLmxlbmd0aCAmJiBzb3J0aW5nWzBdWzBdID09IGNvbElkeCkge1xuICAgICAgbmV4dFNvcnRJZHggPSBuZXh0KHNvcnRpbmdbMF0pO1xuICAgICAgc29ydGluZy5sZW5ndGggPSAxO1xuICAgICAgc29ydGluZ1swXVsxXSA9IGFzU29ydGluZ1tuZXh0U29ydElkeF07XG4gICAgICBzb3J0aW5nWzBdLl9pZHggPSBuZXh0U29ydElkeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc29ydGluZy5sZW5ndGggPSAwO1xuICAgICAgc29ydGluZy5wdXNoKFtjb2xJZHgsIGFzU29ydGluZ1swXV0pO1xuICAgICAgc29ydGluZ1swXS5faWR4ID0gMDtcbiAgICB9XG5cbiAgICBfZm5SZURyYXcoc2V0dGluZ3MpO1xuXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayhzZXR0aW5ncyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuU29ydEF0dGFjaExpc3RlbmVyKHNldHRpbmdzLCBhdHRhY2hUbywgY29sSWR4LCBjYWxsYmFjaykge1xuICAgIHZhciBjb2wgPSBzZXR0aW5ncy5hb0NvbHVtbnNbY29sSWR4XTtcblxuICAgIF9mbkJpbmRBY3Rpb24oYXR0YWNoVG8sIHt9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKGNvbC5iU29ydGFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHNldHRpbmdzLm9GZWF0dXJlcy5iUHJvY2Vzc2luZykge1xuICAgICAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheShzZXR0aW5ncywgdHJ1ZSk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX2ZuU29ydExpc3RlbmVyKHNldHRpbmdzLCBjb2xJZHgsIGUuc2hpZnRLZXksIGNhbGxiYWNrKTtcblxuICAgICAgICAgIGlmIChfZm5EYXRhU291cmNlKHNldHRpbmdzKSAhPT0gJ3NzcCcpIHtcbiAgICAgICAgICAgIF9mblByb2Nlc3NpbmdEaXNwbGF5KHNldHRpbmdzLCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9mblNvcnRMaXN0ZW5lcihzZXR0aW5ncywgY29sSWR4LCBlLnNoaWZ0S2V5LCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Tb3J0aW5nQ2xhc3NlcyhzZXR0aW5ncykge1xuICAgIHZhciBvbGRTb3J0ID0gc2V0dGluZ3MuYUxhc3RTb3J0O1xuICAgIHZhciBzb3J0Q2xhc3MgPSBzZXR0aW5ncy5vQ2xhc3Nlcy5zU29ydENvbHVtbjtcblxuICAgIHZhciBzb3J0ID0gX2ZuU29ydEZsYXR0ZW4oc2V0dGluZ3MpO1xuXG4gICAgdmFyIGZlYXR1cmVzID0gc2V0dGluZ3Mub0ZlYXR1cmVzO1xuICAgIHZhciBpLCBpZW4sIGNvbElkeDtcblxuICAgIGlmIChmZWF0dXJlcy5iU29ydCAmJiBmZWF0dXJlcy5iU29ydENsYXNzZXMpIHtcbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IG9sZFNvcnQubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgY29sSWR4ID0gb2xkU29ydFtpXS5zcmM7XG4gICAgICAgICQoX3BsdWNrKHNldHRpbmdzLmFvRGF0YSwgJ2FuQ2VsbHMnLCBjb2xJZHgpKS5yZW1vdmVDbGFzcyhzb3J0Q2xhc3MgKyAoaSA8IDIgPyBpICsgMSA6IDMpKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMCwgaWVuID0gc29ydC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBjb2xJZHggPSBzb3J0W2ldLnNyYztcbiAgICAgICAgJChfcGx1Y2soc2V0dGluZ3MuYW9EYXRhLCAnYW5DZWxscycsIGNvbElkeCkpLmFkZENsYXNzKHNvcnRDbGFzcyArIChpIDwgMiA/IGkgKyAxIDogMykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldHRpbmdzLmFMYXN0U29ydCA9IHNvcnQ7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Tb3J0RGF0YShzZXR0aW5ncywgaWR4KSB7XG4gICAgdmFyIGNvbHVtbiA9IHNldHRpbmdzLmFvQ29sdW1uc1tpZHhdO1xuICAgIHZhciBjdXN0b21Tb3J0ID0gRGF0YVRhYmxlLmV4dC5vcmRlcltjb2x1bW4uc1NvcnREYXRhVHlwZV07XG4gICAgdmFyIGN1c3RvbURhdGE7XG5cbiAgICBpZiAoY3VzdG9tU29ydCkge1xuICAgICAgY3VzdG9tRGF0YSA9IGN1c3RvbVNvcnQuY2FsbChzZXR0aW5ncy5vSW5zdGFuY2UsIHNldHRpbmdzLCBpZHgsIF9mbkNvbHVtbkluZGV4VG9WaXNpYmxlKHNldHRpbmdzLCBpZHgpKTtcbiAgICB9XG5cbiAgICB2YXIgcm93LCBjZWxsRGF0YTtcbiAgICB2YXIgZm9ybWF0dGVyID0gRGF0YVRhYmxlLmV4dC50eXBlLm9yZGVyW2NvbHVtbi5zVHlwZSArIFwiLXByZVwiXTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBzZXR0aW5ncy5hb0RhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIHJvdyA9IHNldHRpbmdzLmFvRGF0YVtpXTtcblxuICAgICAgaWYgKCFyb3cuX2FTb3J0RGF0YSkge1xuICAgICAgICByb3cuX2FTb3J0RGF0YSA9IFtdO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJvdy5fYVNvcnREYXRhW2lkeF0gfHwgY3VzdG9tU29ydCkge1xuICAgICAgICBjZWxsRGF0YSA9IGN1c3RvbVNvcnQgPyBjdXN0b21EYXRhW2ldIDogX2ZuR2V0Q2VsbERhdGEoc2V0dGluZ3MsIGksIGlkeCwgJ3NvcnQnKTtcbiAgICAgICAgcm93Ll9hU29ydERhdGFbaWR4XSA9IGZvcm1hdHRlciA/IGZvcm1hdHRlcihjZWxsRGF0YSkgOiBjZWxsRGF0YTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5TYXZlU3RhdGUoc2V0dGluZ3MpIHtcbiAgICBpZiAoIXNldHRpbmdzLm9GZWF0dXJlcy5iU3RhdGVTYXZlIHx8IHNldHRpbmdzLmJEZXN0cm95aW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlID0ge1xuICAgICAgdGltZTogK25ldyBEYXRlKCksXG4gICAgICBzdGFydDogc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQsXG4gICAgICBsZW5ndGg6IHNldHRpbmdzLl9pRGlzcGxheUxlbmd0aCxcbiAgICAgIG9yZGVyOiAkLmV4dGVuZCh0cnVlLCBbXSwgc2V0dGluZ3MuYWFTb3J0aW5nKSxcbiAgICAgIHNlYXJjaDogX2ZuU2VhcmNoVG9DYW1lbChzZXR0aW5ncy5vUHJldmlvdXNTZWFyY2gpLFxuICAgICAgY29sdW1uczogJC5tYXAoc2V0dGluZ3MuYW9Db2x1bW5zLCBmdW5jdGlvbiAoY29sLCBpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmlzaWJsZTogY29sLmJWaXNpYmxlLFxuICAgICAgICAgIHNlYXJjaDogX2ZuU2VhcmNoVG9DYW1lbChzZXR0aW5ncy5hb1ByZVNlYXJjaENvbHNbaV0pXG4gICAgICAgIH07XG4gICAgICB9KVxuICAgIH07XG5cbiAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIFwiYW9TdGF0ZVNhdmVQYXJhbXNcIiwgJ3N0YXRlU2F2ZVBhcmFtcycsIFtzZXR0aW5ncywgc3RhdGVdKTtcblxuICAgIHNldHRpbmdzLm9TYXZlZFN0YXRlID0gc3RhdGU7XG4gICAgc2V0dGluZ3MuZm5TdGF0ZVNhdmVDYWxsYmFjay5jYWxsKHNldHRpbmdzLm9JbnN0YW5jZSwgc2V0dGluZ3MsIHN0YXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkxvYWRTdGF0ZShzZXR0aW5ncywgb0luaXQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGksIGllbjtcbiAgICB2YXIgY29sdW1ucyA9IHNldHRpbmdzLmFvQ29sdW1ucztcblxuICAgIHZhciBsb2FkZWQgPSBmdW5jdGlvbiBsb2FkZWQocykge1xuICAgICAgaWYgKCFzIHx8ICFzLnRpbWUpIHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgYWJTdGF0ZUxvYWQgPSBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsICdhb1N0YXRlTG9hZFBhcmFtcycsICdzdGF0ZUxvYWRQYXJhbXMnLCBbc2V0dGluZ3MsIHNdKTtcblxuICAgICAgaWYgKCQuaW5BcnJheShmYWxzZSwgYWJTdGF0ZUxvYWQpICE9PSAtMSkge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBkdXJhdGlvbiA9IHNldHRpbmdzLmlTdGF0ZUR1cmF0aW9uO1xuXG4gICAgICBpZiAoZHVyYXRpb24gPiAwICYmIHMudGltZSA8ICtuZXcgRGF0ZSgpIC0gZHVyYXRpb24gKiAxMDAwKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHMuY29sdW1ucyAmJiBjb2x1bW5zLmxlbmd0aCAhPT0gcy5jb2x1bW5zLmxlbmd0aCkge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNldHRpbmdzLm9Mb2FkZWRTdGF0ZSA9ICQuZXh0ZW5kKHRydWUsIHt9LCBzKTtcblxuICAgICAgaWYgKHMuc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzZXR0aW5ncy5faURpc3BsYXlTdGFydCA9IHMuc3RhcnQ7XG4gICAgICAgIHNldHRpbmdzLmlJbml0RGlzcGxheVN0YXJ0ID0gcy5zdGFydDtcbiAgICAgIH1cblxuICAgICAgaWYgKHMubGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoID0gcy5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIGlmIChzLm9yZGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2V0dGluZ3MuYWFTb3J0aW5nID0gW107XG4gICAgICAgICQuZWFjaChzLm9yZGVyLCBmdW5jdGlvbiAoaSwgY29sKSB7XG4gICAgICAgICAgc2V0dGluZ3MuYWFTb3J0aW5nLnB1c2goY29sWzBdID49IGNvbHVtbnMubGVuZ3RoID8gWzAsIGNvbFsxXV0gOiBjb2wpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHMuc2VhcmNoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgJC5leHRlbmQoc2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoLCBfZm5TZWFyY2hUb0h1bmcocy5zZWFyY2gpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHMuY29sdW1ucykge1xuICAgICAgICBmb3IgKGkgPSAwLCBpZW4gPSBzLmNvbHVtbnMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICB2YXIgY29sID0gcy5jb2x1bW5zW2ldO1xuXG4gICAgICAgICAgaWYgKGNvbC52aXNpYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbHVtbnNbaV0uYlZpc2libGUgPSBjb2wudmlzaWJsZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY29sLnNlYXJjaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChzZXR0aW5ncy5hb1ByZVNlYXJjaENvbHNbaV0sIF9mblNlYXJjaFRvSHVuZyhjb2wuc2VhcmNoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgJ2FvU3RhdGVMb2FkZWQnLCAnc3RhdGVMb2FkZWQnLCBbc2V0dGluZ3MsIHNdKTtcblxuICAgICAgY2FsbGJhY2soKTtcbiAgICB9O1xuXG4gICAgaWYgKCFzZXR0aW5ncy5vRmVhdHVyZXMuYlN0YXRlU2F2ZSkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgc3RhdGUgPSBzZXR0aW5ncy5mblN0YXRlTG9hZENhbGxiYWNrLmNhbGwoc2V0dGluZ3Mub0luc3RhbmNlLCBzZXR0aW5ncywgbG9hZGVkKTtcblxuICAgIGlmIChzdGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBsb2FkZWQoc3RhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mblNldHRpbmdzRnJvbU5vZGUodGFibGUpIHtcbiAgICB2YXIgc2V0dGluZ3MgPSBEYXRhVGFibGUuc2V0dGluZ3M7XG4gICAgdmFyIGlkeCA9ICQuaW5BcnJheSh0YWJsZSwgX3BsdWNrKHNldHRpbmdzLCAnblRhYmxlJykpO1xuICAgIHJldHVybiBpZHggIT09IC0xID8gc2V0dGluZ3NbaWR4XSA6IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5Mb2coc2V0dGluZ3MsIGxldmVsLCBtc2csIHRuKSB7XG4gICAgbXNnID0gJ0RhdGFUYWJsZXMgd2FybmluZzogJyArIChzZXR0aW5ncyA/ICd0YWJsZSBpZD0nICsgc2V0dGluZ3Muc1RhYmxlSWQgKyAnIC0gJyA6ICcnKSArIG1zZztcblxuICAgIGlmICh0bikge1xuICAgICAgbXNnICs9ICcuIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoaXMgZXJyb3IsIHBsZWFzZSBzZWUgJyArICdodHRwOi8vZGF0YXRhYmxlcy5uZXQvdG4vJyArIHRuO1xuICAgIH1cblxuICAgIGlmICghbGV2ZWwpIHtcbiAgICAgIHZhciBleHQgPSBEYXRhVGFibGUuZXh0O1xuICAgICAgdmFyIHR5cGUgPSBleHQuc0Vyck1vZGUgfHwgZXh0LmVyck1vZGU7XG5cbiAgICAgIGlmIChzZXR0aW5ncykge1xuICAgICAgICBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIG51bGwsICdlcnJvcicsIFtzZXR0aW5ncywgdG4sIG1zZ10pO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZSA9PSAnYWxlcnQnKSB7XG4gICAgICAgIGFsZXJ0KG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ3Rocm93Jykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHR5cGUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0eXBlKHNldHRpbmdzLCB0biwgbXNnKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUubG9nKSB7XG4gICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbk1hcChyZXQsIHNyYywgbmFtZSwgbWFwcGVkTmFtZSkge1xuICAgIGlmICgkLmlzQXJyYXkobmFtZSkpIHtcbiAgICAgICQuZWFjaChuYW1lLCBmdW5jdGlvbiAoaSwgdmFsKSB7XG4gICAgICAgIGlmICgkLmlzQXJyYXkodmFsKSkge1xuICAgICAgICAgIF9mbk1hcChyZXQsIHNyYywgdmFsWzBdLCB2YWxbMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9mbk1hcChyZXQsIHNyYywgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG1hcHBlZE5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbWFwcGVkTmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgaWYgKHNyY1tuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXRbbWFwcGVkTmFtZV0gPSBzcmNbbmFtZV07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRXh0ZW5kKG91dCwgZXh0ZW5kZXIsIGJyZWFrUmVmcykge1xuICAgIHZhciB2YWw7XG5cbiAgICBmb3IgKHZhciBwcm9wIGluIGV4dGVuZGVyKSB7XG4gICAgICBpZiAoZXh0ZW5kZXIuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgdmFsID0gZXh0ZW5kZXJbcHJvcF07XG5cbiAgICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICAgICAgaWYgKCEkLmlzUGxhaW5PYmplY3Qob3V0W3Byb3BdKSkge1xuICAgICAgICAgICAgb3V0W3Byb3BdID0ge307XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJC5leHRlbmQodHJ1ZSwgb3V0W3Byb3BdLCB2YWwpO1xuICAgICAgICB9IGVsc2UgaWYgKGJyZWFrUmVmcyAmJiBwcm9wICE9PSAnZGF0YScgJiYgcHJvcCAhPT0gJ2FhRGF0YScgJiYgJC5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICBvdXRbcHJvcF0gPSB2YWwuc2xpY2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXRbcHJvcF0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuQmluZEFjdGlvbihuLCBvRGF0YSwgZm4pIHtcbiAgICAkKG4pLm9uKCdjbGljay5EVCcsIG9EYXRhLCBmdW5jdGlvbiAoZSkge1xuICAgICAgJChuKS5ibHVyKCk7XG4gICAgICBmbihlKTtcbiAgICB9KS5vbigna2V5cHJlc3MuRFQnLCBvRGF0YSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChlLndoaWNoID09PSAxMykge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGZuKGUpO1xuICAgICAgfVxuICAgIH0pLm9uKCdzZWxlY3RzdGFydC5EVCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkNhbGxiYWNrUmVnKG9TZXR0aW5ncywgc1N0b3JlLCBmbiwgc05hbWUpIHtcbiAgICBpZiAoZm4pIHtcbiAgICAgIG9TZXR0aW5nc1tzU3RvcmVdLnB1c2goe1xuICAgICAgICBcImZuXCI6IGZuLFxuICAgICAgICBcInNOYW1lXCI6IHNOYW1lXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZm5DYWxsYmFja0ZpcmUoc2V0dGluZ3MsIGNhbGxiYWNrQXJyLCBldmVudE5hbWUsIGFyZ3MpIHtcbiAgICB2YXIgcmV0ID0gW107XG5cbiAgICBpZiAoY2FsbGJhY2tBcnIpIHtcbiAgICAgIHJldCA9ICQubWFwKHNldHRpbmdzW2NhbGxiYWNrQXJyXS5zbGljZSgpLnJldmVyc2UoKSwgZnVuY3Rpb24gKHZhbCwgaSkge1xuICAgICAgICByZXR1cm4gdmFsLmZuLmFwcGx5KHNldHRpbmdzLm9JbnN0YW5jZSwgYXJncyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnROYW1lICE9PSBudWxsKSB7XG4gICAgICB2YXIgZSA9ICQuRXZlbnQoZXZlbnROYW1lICsgJy5kdCcpO1xuICAgICAgJChzZXR0aW5ncy5uVGFibGUpLnRyaWdnZXIoZSwgYXJncyk7XG4gICAgICByZXQucHVzaChlLnJlc3VsdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mbkxlbmd0aE92ZXJmbG93KHNldHRpbmdzKSB7XG4gICAgdmFyIHN0YXJ0ID0gc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQsXG4gICAgICAgIGVuZCA9IHNldHRpbmdzLmZuRGlzcGxheUVuZCgpLFxuICAgICAgICBsZW4gPSBzZXR0aW5ncy5faURpc3BsYXlMZW5ndGg7XG5cbiAgICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgICBzdGFydCA9IGVuZCAtIGxlbjtcbiAgICB9XG5cbiAgICBzdGFydCAtPSBzdGFydCAlIGxlbjtcblxuICAgIGlmIChsZW4gPT09IC0xIHx8IHN0YXJ0IDwgMCkge1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cblxuICAgIHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0ID0gc3RhcnQ7XG4gIH1cblxuICBmdW5jdGlvbiBfZm5SZW5kZXJlcihzZXR0aW5ncywgdHlwZSkge1xuICAgIHZhciByZW5kZXJlciA9IHNldHRpbmdzLnJlbmRlcmVyO1xuICAgIHZhciBob3N0ID0gRGF0YVRhYmxlLmV4dC5yZW5kZXJlclt0eXBlXTtcblxuICAgIGlmICgkLmlzUGxhaW5PYmplY3QocmVuZGVyZXIpICYmIHJlbmRlcmVyW3R5cGVdKSB7XG4gICAgICByZXR1cm4gaG9zdFtyZW5kZXJlclt0eXBlXV0gfHwgaG9zdC5fO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlbmRlcmVyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGhvc3RbcmVuZGVyZXJdIHx8IGhvc3QuXztcbiAgICB9XG5cbiAgICByZXR1cm4gaG9zdC5fO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZuRGF0YVNvdXJjZShzZXR0aW5ncykge1xuICAgIGlmIChzZXR0aW5ncy5vRmVhdHVyZXMuYlNlcnZlclNpZGUpIHtcbiAgICAgIHJldHVybiAnc3NwJztcbiAgICB9IGVsc2UgaWYgKHNldHRpbmdzLmFqYXggfHwgc2V0dGluZ3Muc0FqYXhTb3VyY2UpIHtcbiAgICAgIHJldHVybiAnYWpheCc7XG4gICAgfVxuXG4gICAgcmV0dXJuICdkb20nO1xuICB9XG5cbiAgdmFyIF9fYXBpU3RydWN0ID0gW107XG4gIHZhciBfX2FycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbiAgdmFyIF90b1NldHRpbmdzID0gZnVuY3Rpb24gX3RvU2V0dGluZ3MobWl4ZWQpIHtcbiAgICB2YXIgaWR4LCBqcTtcbiAgICB2YXIgc2V0dGluZ3MgPSBEYXRhVGFibGUuc2V0dGluZ3M7XG4gICAgdmFyIHRhYmxlcyA9ICQubWFwKHNldHRpbmdzLCBmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgIHJldHVybiBlbC5uVGFibGU7XG4gICAgfSk7XG5cbiAgICBpZiAoIW1peGVkKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIGlmIChtaXhlZC5uVGFibGUgJiYgbWl4ZWQub0FwaSkge1xuICAgICAgcmV0dXJuIFttaXhlZF07XG4gICAgfSBlbHNlIGlmIChtaXhlZC5ub2RlTmFtZSAmJiBtaXhlZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAndGFibGUnKSB7XG4gICAgICBpZHggPSAkLmluQXJyYXkobWl4ZWQsIHRhYmxlcyk7XG4gICAgICByZXR1cm4gaWR4ICE9PSAtMSA/IFtzZXR0aW5nc1tpZHhdXSA6IG51bGw7XG4gICAgfSBlbHNlIGlmIChtaXhlZCAmJiB0eXBlb2YgbWl4ZWQuc2V0dGluZ3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBtaXhlZC5zZXR0aW5ncygpLnRvQXJyYXkoKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtaXhlZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGpxID0gJChtaXhlZCk7XG4gICAgfSBlbHNlIGlmIChtaXhlZCBpbnN0YW5jZW9mICQpIHtcbiAgICAgIGpxID0gbWl4ZWQ7XG4gICAgfVxuXG4gICAgaWYgKGpxKSB7XG4gICAgICByZXR1cm4ganEubWFwKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIGlkeCA9ICQuaW5BcnJheSh0aGlzLCB0YWJsZXMpO1xuICAgICAgICByZXR1cm4gaWR4ICE9PSAtMSA/IHNldHRpbmdzW2lkeF0gOiBudWxsO1xuICAgICAgfSkudG9BcnJheSgpO1xuICAgIH1cbiAgfTtcblxuICBfQXBpMiA9IGZ1bmN0aW9uIF9BcGkoY29udGV4dCwgZGF0YSkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfQXBpMikpIHtcbiAgICAgIHJldHVybiBuZXcgX0FwaTIoY29udGV4dCwgZGF0YSk7XG4gICAgfVxuXG4gICAgdmFyIHNldHRpbmdzID0gW107XG5cbiAgICB2YXIgY3R4U2V0dGluZ3MgPSBmdW5jdGlvbiBjdHhTZXR0aW5ncyhvKSB7XG4gICAgICB2YXIgYSA9IF90b1NldHRpbmdzKG8pO1xuXG4gICAgICBpZiAoYSkge1xuICAgICAgICBzZXR0aW5ncyA9IHNldHRpbmdzLmNvbmNhdChhKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCQuaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGNvbnRleHQubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgY3R4U2V0dGluZ3MoY29udGV4dFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eFNldHRpbmdzKGNvbnRleHQpO1xuICAgIH1cblxuICAgIHRoaXMuY29udGV4dCA9IF91bmlxdWUoc2V0dGluZ3MpO1xuXG4gICAgaWYgKGRhdGEpIHtcbiAgICAgICQubWVyZ2UodGhpcywgZGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RvciA9IHtcbiAgICAgIHJvd3M6IG51bGwsXG4gICAgICBjb2xzOiBudWxsLFxuICAgICAgb3B0czogbnVsbFxuICAgIH07XG5cbiAgICBfQXBpMi5leHRlbmQodGhpcywgdGhpcywgX19hcGlTdHJ1Y3QpO1xuICB9O1xuXG4gIERhdGFUYWJsZS5BcGkgPSBfQXBpMjtcbiAgJC5leHRlbmQoX0FwaTIucHJvdG90eXBlLCB7XG4gICAgYW55OiBmdW5jdGlvbiBhbnkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb3VudCgpICE9PSAwO1xuICAgIH0sXG4gICAgY29uY2F0OiBfX2FycmF5UHJvdG8uY29uY2F0LFxuICAgIGNvbnRleHQ6IFtdLFxuICAgIGNvdW50OiBmdW5jdGlvbiBjb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZsYXR0ZW4oKS5sZW5ndGg7XG4gICAgfSxcbiAgICBlYWNoOiBmdW5jdGlvbiBlYWNoKGZuKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gdGhpcy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBmbi5jYWxsKHRoaXMsIHRoaXNbaV0sIGksIHRoaXMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGVxOiBmdW5jdGlvbiBlcShpZHgpIHtcbiAgICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG4gICAgICByZXR1cm4gY3R4Lmxlbmd0aCA+IGlkeCA/IG5ldyBfQXBpMihjdHhbaWR4XSwgdGhpc1tpZHhdKSA6IG51bGw7XG4gICAgfSxcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uIGZpbHRlcihmbikge1xuICAgICAgdmFyIGEgPSBbXTtcblxuICAgICAgaWYgKF9fYXJyYXlQcm90by5maWx0ZXIpIHtcbiAgICAgICAgYSA9IF9fYXJyYXlQcm90by5maWx0ZXIuY2FsbCh0aGlzLCBmbiwgdGhpcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gdGhpcy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgIGlmIChmbi5jYWxsKHRoaXMsIHRoaXNbaV0sIGksIHRoaXMpKSB7XG4gICAgICAgICAgICBhLnB1c2godGhpc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgX0FwaTIodGhpcy5jb250ZXh0LCBhKTtcbiAgICB9LFxuICAgIGZsYXR0ZW46IGZ1bmN0aW9uIGZsYXR0ZW4oKSB7XG4gICAgICB2YXIgYSA9IFtdO1xuICAgICAgcmV0dXJuIG5ldyBfQXBpMih0aGlzLmNvbnRleHQsIGEuY29uY2F0LmFwcGx5KGEsIHRoaXMudG9BcnJheSgpKSk7XG4gICAgfSxcbiAgICBqb2luOiBfX2FycmF5UHJvdG8uam9pbixcbiAgICBpbmRleE9mOiBfX2FycmF5UHJvdG8uaW5kZXhPZiB8fCBmdW5jdGlvbiAob2JqLCBzdGFydCkge1xuICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0IHx8IDAsIGllbiA9IHRoaXMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXNbaV0gPT09IG9iaikge1xuICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAtMTtcbiAgICB9LFxuICAgIGl0ZXJhdG9yOiBmdW5jdGlvbiBpdGVyYXRvcihmbGF0dGVuLCB0eXBlLCBmbiwgYWx3YXlzTmV3KSB7XG4gICAgICB2YXIgYSA9IFtdLFxuICAgICAgICAgIHJldCxcbiAgICAgICAgICBpLFxuICAgICAgICAgIGllbixcbiAgICAgICAgICBqLFxuICAgICAgICAgIGplbixcbiAgICAgICAgICBjb250ZXh0ID0gdGhpcy5jb250ZXh0LFxuICAgICAgICAgIHJvd3MsXG4gICAgICAgICAgaXRlbXMsXG4gICAgICAgICAgaXRlbSxcbiAgICAgICAgICBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3I7XG5cbiAgICAgIGlmICh0eXBlb2YgZmxhdHRlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgYWx3YXlzTmV3ID0gZm47XG4gICAgICAgIGZuID0gdHlwZTtcbiAgICAgICAgdHlwZSA9IGZsYXR0ZW47XG4gICAgICAgIGZsYXR0ZW4gPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMCwgaWVuID0gY29udGV4dC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICB2YXIgYXBpSW5zdCA9IG5ldyBfQXBpMihjb250ZXh0W2ldKTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ3RhYmxlJykge1xuICAgICAgICAgIHJldCA9IGZuLmNhbGwoYXBpSW5zdCwgY29udGV4dFtpXSwgaSk7XG5cbiAgICAgICAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGEucHVzaChyZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnY29sdW1ucycgfHwgdHlwZSA9PT0gJ3Jvd3MnKSB7XG4gICAgICAgICAgcmV0ID0gZm4uY2FsbChhcGlJbnN0LCBjb250ZXh0W2ldLCB0aGlzW2ldLCBpKTtcblxuICAgICAgICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYS5wdXNoKHJldCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdjb2x1bW4nIHx8IHR5cGUgPT09ICdjb2x1bW4tcm93cycgfHwgdHlwZSA9PT0gJ3JvdycgfHwgdHlwZSA9PT0gJ2NlbGwnKSB7XG4gICAgICAgICAgaXRlbXMgPSB0aGlzW2ldO1xuXG4gICAgICAgICAgaWYgKHR5cGUgPT09ICdjb2x1bW4tcm93cycpIHtcbiAgICAgICAgICAgIHJvd3MgPSBfc2VsZWN0b3Jfcm93X2luZGV4ZXMoY29udGV4dFtpXSwgc2VsZWN0b3Iub3B0cyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChqID0gMCwgamVuID0gaXRlbXMubGVuZ3RoOyBqIDwgamVuOyBqKyspIHtcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtc1tqXTtcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdjZWxsJykge1xuICAgICAgICAgICAgICByZXQgPSBmbi5jYWxsKGFwaUluc3QsIGNvbnRleHRbaV0sIGl0ZW0ucm93LCBpdGVtLmNvbHVtbiwgaSwgaik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXQgPSBmbi5jYWxsKGFwaUluc3QsIGNvbnRleHRbaV0sIGl0ZW0sIGksIGosIHJvd3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgYS5wdXNoKHJldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChhLmxlbmd0aCB8fCBhbHdheXNOZXcpIHtcbiAgICAgICAgdmFyIGFwaSA9IG5ldyBfQXBpMihjb250ZXh0LCBmbGF0dGVuID8gYS5jb25jYXQuYXBwbHkoW10sIGEpIDogYSk7XG4gICAgICAgIHZhciBhcGlTZWxlY3RvciA9IGFwaS5zZWxlY3RvcjtcbiAgICAgICAgYXBpU2VsZWN0b3Iucm93cyA9IHNlbGVjdG9yLnJvd3M7XG4gICAgICAgIGFwaVNlbGVjdG9yLmNvbHMgPSBzZWxlY3Rvci5jb2xzO1xuICAgICAgICBhcGlTZWxlY3Rvci5vcHRzID0gc2VsZWN0b3Iub3B0cztcbiAgICAgICAgcmV0dXJuIGFwaTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBsYXN0SW5kZXhPZjogX19hcnJheVByb3RvLmxhc3RJbmRleE9mIHx8IGZ1bmN0aW9uIChvYmosIHN0YXJ0KSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmRleE9mLmFwcGx5KHRoaXMudG9BcnJheS5yZXZlcnNlKCksIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBsZW5ndGg6IDAsXG4gICAgbWFwOiBmdW5jdGlvbiBtYXAoZm4pIHtcbiAgICAgIHZhciBhID0gW107XG5cbiAgICAgIGlmIChfX2FycmF5UHJvdG8ubWFwKSB7XG4gICAgICAgIGEgPSBfX2FycmF5UHJvdG8ubWFwLmNhbGwodGhpcywgZm4sIHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IHRoaXMubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICBhLnB1c2goZm4uY2FsbCh0aGlzLCB0aGlzW2ldLCBpKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBfQXBpMih0aGlzLmNvbnRleHQsIGEpO1xuICAgIH0sXG4gICAgcGx1Y2s6IGZ1bmN0aW9uIHBsdWNrKHByb3ApIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIGVsW3Byb3BdO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBwb3A6IF9fYXJyYXlQcm90by5wb3AsXG4gICAgcHVzaDogX19hcnJheVByb3RvLnB1c2gsXG4gICAgcmVkdWNlOiBfX2FycmF5UHJvdG8ucmVkdWNlIHx8IGZ1bmN0aW9uIChmbiwgaW5pdCkge1xuICAgICAgcmV0dXJuIF9mblJlZHVjZSh0aGlzLCBmbiwgaW5pdCwgMCwgdGhpcy5sZW5ndGgsIDEpO1xuICAgIH0sXG4gICAgcmVkdWNlUmlnaHQ6IF9fYXJyYXlQcm90by5yZWR1Y2VSaWdodCB8fCBmdW5jdGlvbiAoZm4sIGluaXQpIHtcbiAgICAgIHJldHVybiBfZm5SZWR1Y2UodGhpcywgZm4sIGluaXQsIHRoaXMubGVuZ3RoIC0gMSwgLTEsIC0xKTtcbiAgICB9LFxuICAgIHJldmVyc2U6IF9fYXJyYXlQcm90by5yZXZlcnNlLFxuICAgIHNlbGVjdG9yOiBudWxsLFxuICAgIHNoaWZ0OiBfX2FycmF5UHJvdG8uc2hpZnQsXG4gICAgc2xpY2U6IGZ1bmN0aW9uIHNsaWNlKCkge1xuICAgICAgcmV0dXJuIG5ldyBfQXBpMih0aGlzLmNvbnRleHQsIHRoaXMpO1xuICAgIH0sXG4gICAgc29ydDogX19hcnJheVByb3RvLnNvcnQsXG4gICAgc3BsaWNlOiBfX2FycmF5UHJvdG8uc3BsaWNlLFxuICAgIHRvQXJyYXk6IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgICByZXR1cm4gX19hcnJheVByb3RvLnNsaWNlLmNhbGwodGhpcyk7XG4gICAgfSxcbiAgICB0byQ6IGZ1bmN0aW9uIHRvJCgpIHtcbiAgICAgIHJldHVybiAkKHRoaXMpO1xuICAgIH0sXG4gICAgdG9KUXVlcnk6IGZ1bmN0aW9uIHRvSlF1ZXJ5KCkge1xuICAgICAgcmV0dXJuICQodGhpcyk7XG4gICAgfSxcbiAgICB1bmlxdWU6IGZ1bmN0aW9uIHVuaXF1ZSgpIHtcbiAgICAgIHJldHVybiBuZXcgX0FwaTIodGhpcy5jb250ZXh0LCBfdW5pcXVlKHRoaXMpKTtcbiAgICB9LFxuICAgIHVuc2hpZnQ6IF9fYXJyYXlQcm90by51bnNoaWZ0XG4gIH0pO1xuXG4gIF9BcGkyLmV4dGVuZCA9IGZ1bmN0aW9uIChzY29wZSwgb2JqLCBleHQpIHtcbiAgICBpZiAoIWV4dC5sZW5ndGggfHwgIW9iaiB8fCAhKG9iaiBpbnN0YW5jZW9mIF9BcGkyKSAmJiAhb2JqLl9fZHRfd3JhcHBlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBpLFxuICAgICAgICBpZW4sXG4gICAgICAgIGosXG4gICAgICAgIGplbixcbiAgICAgICAgc3RydWN0LFxuICAgICAgICBpbm5lcixcbiAgICAgICAgbWV0aG9kU2NvcGluZyA9IGZ1bmN0aW9uIG1ldGhvZFNjb3Bpbmcoc2NvcGUsIGZuLCBzdHJ1Yykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJldCA9IGZuLmFwcGx5KHNjb3BlLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIF9BcGkyLmV4dGVuZChyZXQsIHJldCwgc3RydWMubWV0aG9kRXh0KTtcblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZm9yIChpID0gMCwgaWVuID0gZXh0Lmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBzdHJ1Y3QgPSBleHRbaV07XG4gICAgICBvYmpbc3RydWN0Lm5hbWVdID0gdHlwZW9mIHN0cnVjdC52YWwgPT09ICdmdW5jdGlvbicgPyBtZXRob2RTY29waW5nKHNjb3BlLCBzdHJ1Y3QudmFsLCBzdHJ1Y3QpIDogJC5pc1BsYWluT2JqZWN0KHN0cnVjdC52YWwpID8ge30gOiBzdHJ1Y3QudmFsO1xuICAgICAgb2JqW3N0cnVjdC5uYW1lXS5fX2R0X3dyYXBwZXIgPSB0cnVlO1xuXG4gICAgICBfQXBpMi5leHRlbmQoc2NvcGUsIG9ialtzdHJ1Y3QubmFtZV0sIHN0cnVjdC5wcm9wRXh0KTtcbiAgICB9XG4gIH07XG5cbiAgX0FwaTIucmVnaXN0ZXIgPSBfYXBpX3JlZ2lzdGVyID0gZnVuY3Rpb24gX2FwaV9yZWdpc3RlcihuYW1lLCB2YWwpIHtcbiAgICBpZiAoJC5pc0FycmF5KG5hbWUpKSB7XG4gICAgICBmb3IgKHZhciBqID0gMCwgamVuID0gbmFtZS5sZW5ndGg7IGogPCBqZW47IGorKykge1xuICAgICAgICBfQXBpMi5yZWdpc3RlcihuYW1lW2pdLCB2YWwpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGksXG4gICAgICAgIGllbixcbiAgICAgICAgaGVpciA9IG5hbWUuc3BsaXQoJy4nKSxcbiAgICAgICAgc3RydWN0ID0gX19hcGlTdHJ1Y3QsXG4gICAgICAgIGtleSxcbiAgICAgICAgbWV0aG9kO1xuXG4gICAgdmFyIGZpbmQgPSBmdW5jdGlvbiBmaW5kKHNyYywgbmFtZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IHNyYy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBpZiAoc3JjW2ldLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gc3JjW2ldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBmb3IgKGkgPSAwLCBpZW4gPSBoZWlyLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBtZXRob2QgPSBoZWlyW2ldLmluZGV4T2YoJygpJykgIT09IC0xO1xuICAgICAga2V5ID0gbWV0aG9kID8gaGVpcltpXS5yZXBsYWNlKCcoKScsICcnKSA6IGhlaXJbaV07XG4gICAgICB2YXIgc3JjID0gZmluZChzdHJ1Y3QsIGtleSk7XG5cbiAgICAgIGlmICghc3JjKSB7XG4gICAgICAgIHNyYyA9IHtcbiAgICAgICAgICBuYW1lOiBrZXksXG4gICAgICAgICAgdmFsOiB7fSxcbiAgICAgICAgICBtZXRob2RFeHQ6IFtdLFxuICAgICAgICAgIHByb3BFeHQ6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHN0cnVjdC5wdXNoKHNyYyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpID09PSBpZW4gLSAxKSB7XG4gICAgICAgIHNyYy52YWwgPSB2YWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHJ1Y3QgPSBtZXRob2QgPyBzcmMubWV0aG9kRXh0IDogc3JjLnByb3BFeHQ7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIF9BcGkyLnJlZ2lzdGVyUGx1cmFsID0gX2FwaV9yZWdpc3RlclBsdXJhbCA9IGZ1bmN0aW9uIF9hcGlfcmVnaXN0ZXJQbHVyYWwocGx1cmFsTmFtZSwgc2luZ3VsYXJOYW1lLCB2YWwpIHtcbiAgICBfQXBpMi5yZWdpc3RlcihwbHVyYWxOYW1lLCB2YWwpO1xuXG4gICAgX0FwaTIucmVnaXN0ZXIoc2luZ3VsYXJOYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmV0ID0gdmFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgIGlmIChyZXQgPT09IHRoaXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2UgaWYgKHJldCBpbnN0YW5jZW9mIF9BcGkyKSB7XG4gICAgICAgIHJldHVybiByZXQubGVuZ3RoID8gJC5pc0FycmF5KHJldFswXSkgPyBuZXcgX0FwaTIocmV0LmNvbnRleHQsIHJldFswXSkgOiByZXRbMF0gOiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIF9fdGFibGVfc2VsZWN0b3IgPSBmdW5jdGlvbiBfX3RhYmxlX3NlbGVjdG9yKHNlbGVjdG9yLCBhKSB7XG4gICAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBbYVtzZWxlY3Rvcl1dO1xuICAgIH1cblxuICAgIHZhciBub2RlcyA9ICQubWFwKGEsIGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgcmV0dXJuIGVsLm5UYWJsZTtcbiAgICB9KTtcbiAgICByZXR1cm4gJChub2RlcykuZmlsdGVyKHNlbGVjdG9yKS5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICAgIHZhciBpZHggPSAkLmluQXJyYXkodGhpcywgbm9kZXMpO1xuICAgICAgcmV0dXJuIGFbaWR4XTtcbiAgICB9KS50b0FycmF5KCk7XG4gIH07XG5cbiAgX2FwaV9yZWdpc3RlcigndGFibGVzKCknLCBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gc2VsZWN0b3IgPyBuZXcgX0FwaTIoX190YWJsZV9zZWxlY3RvcihzZWxlY3RvciwgdGhpcy5jb250ZXh0KSkgOiB0aGlzO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCd0YWJsZSgpJywgZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gICAgdmFyIHRhYmxlcyA9IHRoaXMudGFibGVzKHNlbGVjdG9yKTtcbiAgICB2YXIgY3R4ID0gdGFibGVzLmNvbnRleHQ7XG4gICAgcmV0dXJuIGN0eC5sZW5ndGggPyBuZXcgX0FwaTIoY3R4WzBdKSA6IHRhYmxlcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgndGFibGVzKCkubm9kZXMoKScsICd0YWJsZSgpLm5vZGUoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICByZXR1cm4gY3R4Lm5UYWJsZTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgndGFibGVzKCkuYm9keSgpJywgJ3RhYmxlKCkuYm9keSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIHJldHVybiBjdHgublRCb2R5O1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCd0YWJsZXMoKS5oZWFkZXIoKScsICd0YWJsZSgpLmhlYWRlcigpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIHJldHVybiBjdHgublRIZWFkO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCd0YWJsZXMoKS5mb290ZXIoKScsICd0YWJsZSgpLmZvb3RlcigpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIHJldHVybiBjdHgublRGb290O1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCd0YWJsZXMoKS5jb250YWluZXJzKCknLCAndGFibGUoKS5jb250YWluZXIoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICByZXR1cm4gY3R4Lm5UYWJsZVdyYXBwZXI7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2RyYXcoKScsIGZ1bmN0aW9uIChwYWdpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIGlmIChwYWdpbmcgPT09ICdwYWdlJykge1xuICAgICAgICBfZm5EcmF3KHNldHRpbmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGFnaW5nID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHBhZ2luZyA9IHBhZ2luZyA9PT0gJ2Z1bGwtaG9sZCcgPyBmYWxzZSA6IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBfZm5SZURyYXcoc2V0dGluZ3MsIHBhZ2luZyA9PT0gZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdwYWdlKCknLCBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgaWYgKGFjdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWdlLmluZm8oKS5wYWdlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgX2ZuUGFnZUNoYW5nZShzZXR0aW5ncywgYWN0aW9uKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcigncGFnZS5pbmZvKCknLCBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgaWYgKHRoaXMuY29udGV4dC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIHNldHRpbmdzID0gdGhpcy5jb250ZXh0WzBdLFxuICAgICAgICBzdGFydCA9IHNldHRpbmdzLl9pRGlzcGxheVN0YXJ0LFxuICAgICAgICBsZW4gPSBzZXR0aW5ncy5vRmVhdHVyZXMuYlBhZ2luYXRlID8gc2V0dGluZ3MuX2lEaXNwbGF5TGVuZ3RoIDogLTEsXG4gICAgICAgIHZpc1JlY29yZHMgPSBzZXR0aW5ncy5mblJlY29yZHNEaXNwbGF5KCksXG4gICAgICAgIGFsbCA9IGxlbiA9PT0gLTE7XG4gICAgcmV0dXJuIHtcbiAgICAgIFwicGFnZVwiOiBhbGwgPyAwIDogTWF0aC5mbG9vcihzdGFydCAvIGxlbiksXG4gICAgICBcInBhZ2VzXCI6IGFsbCA/IDEgOiBNYXRoLmNlaWwodmlzUmVjb3JkcyAvIGxlbiksXG4gICAgICBcInN0YXJ0XCI6IHN0YXJ0LFxuICAgICAgXCJlbmRcIjogc2V0dGluZ3MuZm5EaXNwbGF5RW5kKCksXG4gICAgICBcImxlbmd0aFwiOiBsZW4sXG4gICAgICBcInJlY29yZHNUb3RhbFwiOiBzZXR0aW5ncy5mblJlY29yZHNUb3RhbCgpLFxuICAgICAgXCJyZWNvcmRzRGlzcGxheVwiOiB2aXNSZWNvcmRzLFxuICAgICAgXCJzZXJ2ZXJTaWRlXCI6IF9mbkRhdGFTb3VyY2Uoc2V0dGluZ3MpID09PSAnc3NwJ1xuICAgIH07XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3BhZ2UubGVuKCknLCBmdW5jdGlvbiAobGVuKSB7XG4gICAgaWYgKGxlbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0Lmxlbmd0aCAhPT0gMCA/IHRoaXMuY29udGV4dFswXS5faURpc3BsYXlMZW5ndGggOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBfZm5MZW5ndGhDaGFuZ2Uoc2V0dGluZ3MsIGxlbik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHZhciBfX3JlbG9hZCA9IGZ1bmN0aW9uIF9fcmVsb2FkKHNldHRpbmdzLCBob2xkUG9zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgYXBpID0gbmV3IF9BcGkyKHNldHRpbmdzKTtcbiAgICAgIGFwaS5vbmUoJ2RyYXcnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhbGxiYWNrKGFwaS5hamF4Lmpzb24oKSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoX2ZuRGF0YVNvdXJjZShzZXR0aW5ncykgPT0gJ3NzcCcpIHtcbiAgICAgIF9mblJlRHJhdyhzZXR0aW5ncywgaG9sZFBvc2l0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkoc2V0dGluZ3MsIHRydWUpO1xuXG4gICAgICB2YXIgeGhyID0gc2V0dGluZ3MuanFYSFI7XG5cbiAgICAgIGlmICh4aHIgJiYgeGhyLnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICB9XG5cbiAgICAgIF9mbkJ1aWxkQWpheChzZXR0aW5ncywgW10sIGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgIF9mbkNsZWFyVGFibGUoc2V0dGluZ3MpO1xuXG4gICAgICAgIHZhciBkYXRhID0gX2ZuQWpheERhdGFTcmMoc2V0dGluZ3MsIGpzb24pO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgX2ZuQWRkRGF0YShzZXR0aW5ncywgZGF0YVtpXSk7XG4gICAgICAgIH1cblxuICAgICAgICBfZm5SZURyYXcoc2V0dGluZ3MsIGhvbGRQb3NpdGlvbik7XG5cbiAgICAgICAgX2ZuUHJvY2Vzc2luZ0Rpc3BsYXkoc2V0dGluZ3MsIGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBfYXBpX3JlZ2lzdGVyKCdhamF4Lmpzb24oKScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKGN0eC5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gY3R4WzBdLmpzb247XG4gICAgfVxuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdhamF4LnBhcmFtcygpJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAoY3R4Lmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBjdHhbMF0ub0FqYXhEYXRhO1xuICAgIH1cbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignYWpheC5yZWxvYWQoKScsIGZ1bmN0aW9uIChjYWxsYmFjaywgcmVzZXRQYWdpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIF9fcmVsb2FkKHNldHRpbmdzLCByZXNldFBhZ2luZyA9PT0gZmFsc2UsIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignYWpheC51cmwoKScsIGZ1bmN0aW9uICh1cmwpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKHVybCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoY3R4Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBjdHggPSBjdHhbMF07XG4gICAgICByZXR1cm4gY3R4LmFqYXggPyAkLmlzUGxhaW5PYmplY3QoY3R4LmFqYXgpID8gY3R4LmFqYXgudXJsIDogY3R4LmFqYXggOiBjdHguc0FqYXhTb3VyY2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHNldHRpbmdzLmFqYXgpKSB7XG4gICAgICAgIHNldHRpbmdzLmFqYXgudXJsID0gdXJsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0dGluZ3MuYWpheCA9IHVybDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignYWpheC51cmwoKS5sb2FkKCknLCBmdW5jdGlvbiAoY2FsbGJhY2ssIHJlc2V0UGFnaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgX19yZWxvYWQoY3R4LCByZXNldFBhZ2luZyA9PT0gZmFsc2UsIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdmFyIF9zZWxlY3Rvcl9ydW4gPSBmdW5jdGlvbiBfc2VsZWN0b3JfcnVuKHR5cGUsIHNlbGVjdG9yLCBzZWxlY3RGbiwgc2V0dGluZ3MsIG9wdHMpIHtcbiAgICB2YXIgb3V0ID0gW10sXG4gICAgICAgIHJlcyxcbiAgICAgICAgYSxcbiAgICAgICAgaSxcbiAgICAgICAgaWVuLFxuICAgICAgICBqLFxuICAgICAgICBqZW4sXG4gICAgICAgIHNlbGVjdG9yVHlwZSA9IF90eXBlb2Yoc2VsZWN0b3IpO1xuXG4gICAgaWYgKCFzZWxlY3RvciB8fCBzZWxlY3RvclR5cGUgPT09ICdzdHJpbmcnIHx8IHNlbGVjdG9yVHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCBzZWxlY3Rvci5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgc2VsZWN0b3IgPSBbc2VsZWN0b3JdO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGllbiA9IHNlbGVjdG9yLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBhID0gc2VsZWN0b3JbaV0gJiYgc2VsZWN0b3JbaV0uc3BsaXQgJiYgIXNlbGVjdG9yW2ldLm1hdGNoKC9bXFxbXFwoOl0vKSA/IHNlbGVjdG9yW2ldLnNwbGl0KCcsJykgOiBbc2VsZWN0b3JbaV1dO1xuXG4gICAgICBmb3IgKGogPSAwLCBqZW4gPSBhLmxlbmd0aDsgaiA8IGplbjsgaisrKSB7XG4gICAgICAgIHJlcyA9IHNlbGVjdEZuKHR5cGVvZiBhW2pdID09PSAnc3RyaW5nJyA/ICQudHJpbShhW2pdKSA6IGFbal0pO1xuXG4gICAgICAgIGlmIChyZXMgJiYgcmVzLmxlbmd0aCkge1xuICAgICAgICAgIG91dCA9IG91dC5jb25jYXQocmVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBleHQgPSBfZXh0LnNlbGVjdG9yW3R5cGVdO1xuXG4gICAgaWYgKGV4dC5sZW5ndGgpIHtcbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IGV4dC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBvdXQgPSBleHRbaV0oc2V0dGluZ3MsIG9wdHMsIG91dCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF91bmlxdWUob3V0KTtcbiAgfTtcblxuICB2YXIgX3NlbGVjdG9yX29wdHMgPSBmdW5jdGlvbiBfc2VsZWN0b3Jfb3B0cyhvcHRzKSB7XG4gICAgaWYgKCFvcHRzKSB7XG4gICAgICBvcHRzID0ge307XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuZmlsdGVyICYmIG9wdHMuc2VhcmNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdHMuc2VhcmNoID0gb3B0cy5maWx0ZXI7XG4gICAgfVxuXG4gICAgcmV0dXJuICQuZXh0ZW5kKHtcbiAgICAgIHNlYXJjaDogJ25vbmUnLFxuICAgICAgb3JkZXI6ICdjdXJyZW50JyxcbiAgICAgIHBhZ2U6ICdhbGwnXG4gICAgfSwgb3B0cyk7XG4gIH07XG5cbiAgdmFyIF9zZWxlY3Rvcl9maXJzdCA9IGZ1bmN0aW9uIF9zZWxlY3Rvcl9maXJzdChpbnN0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGluc3QubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgIGlmIChpbnN0W2ldLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5zdFswXSA9IGluc3RbaV07XG4gICAgICAgIGluc3RbMF0ubGVuZ3RoID0gMTtcbiAgICAgICAgaW5zdC5sZW5ndGggPSAxO1xuICAgICAgICBpbnN0LmNvbnRleHQgPSBbaW5zdC5jb250ZXh0W2ldXTtcbiAgICAgICAgcmV0dXJuIGluc3Q7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5zdC5sZW5ndGggPSAwO1xuICAgIHJldHVybiBpbnN0O1xuICB9O1xuXG4gIHZhciBfc2VsZWN0b3Jfcm93X2luZGV4ZXMgPSBmdW5jdGlvbiBfc2VsZWN0b3Jfcm93X2luZGV4ZXMoc2V0dGluZ3MsIG9wdHMpIHtcbiAgICB2YXIgaSxcbiAgICAgICAgaWVuLFxuICAgICAgICB0bXAsXG4gICAgICAgIGEgPSBbXSxcbiAgICAgICAgZGlzcGxheUZpbHRlcmVkID0gc2V0dGluZ3MuYWlEaXNwbGF5LFxuICAgICAgICBkaXNwbGF5TWFzdGVyID0gc2V0dGluZ3MuYWlEaXNwbGF5TWFzdGVyO1xuICAgIHZhciBzZWFyY2ggPSBvcHRzLnNlYXJjaCxcbiAgICAgICAgb3JkZXIgPSBvcHRzLm9yZGVyLFxuICAgICAgICBwYWdlID0gb3B0cy5wYWdlO1xuXG4gICAgaWYgKF9mbkRhdGFTb3VyY2Uoc2V0dGluZ3MpID09ICdzc3AnKSB7XG4gICAgICByZXR1cm4gc2VhcmNoID09PSAncmVtb3ZlZCcgPyBbXSA6IF9yYW5nZSgwLCBkaXNwbGF5TWFzdGVyLmxlbmd0aCk7XG4gICAgfSBlbHNlIGlmIChwYWdlID09ICdjdXJyZW50Jykge1xuICAgICAgZm9yIChpID0gc2V0dGluZ3MuX2lEaXNwbGF5U3RhcnQsIGllbiA9IHNldHRpbmdzLmZuRGlzcGxheUVuZCgpOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgYS5wdXNoKGRpc3BsYXlGaWx0ZXJlZFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmRlciA9PSAnY3VycmVudCcgfHwgb3JkZXIgPT0gJ2FwcGxpZWQnKSB7XG4gICAgICBpZiAoc2VhcmNoID09ICdub25lJykge1xuICAgICAgICBhID0gZGlzcGxheU1hc3Rlci5zbGljZSgpO1xuICAgICAgfSBlbHNlIGlmIChzZWFyY2ggPT0gJ2FwcGxpZWQnKSB7XG4gICAgICAgIGEgPSBkaXNwbGF5RmlsdGVyZWQuc2xpY2UoKTtcbiAgICAgIH0gZWxzZSBpZiAoc2VhcmNoID09ICdyZW1vdmVkJykge1xuICAgICAgICB2YXIgZGlzcGxheUZpbHRlcmVkTWFwID0ge307XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGRpc3BsYXlGaWx0ZXJlZC5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgIGRpc3BsYXlGaWx0ZXJlZE1hcFtkaXNwbGF5RmlsdGVyZWRbaV1dID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGEgPSAkLm1hcChkaXNwbGF5TWFzdGVyLCBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICByZXR1cm4gIWRpc3BsYXlGaWx0ZXJlZE1hcC5oYXNPd25Qcm9wZXJ0eShlbCkgPyBlbCA6IG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3JkZXIgPT0gJ2luZGV4JyB8fCBvcmRlciA9PSAnb3JpZ2luYWwnKSB7XG4gICAgICBmb3IgKGkgPSAwLCBpZW4gPSBzZXR0aW5ncy5hb0RhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgaWYgKHNlYXJjaCA9PSAnbm9uZScpIHtcbiAgICAgICAgICBhLnB1c2goaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG1wID0gJC5pbkFycmF5KGksIGRpc3BsYXlGaWx0ZXJlZCk7XG5cbiAgICAgICAgICBpZiAodG1wID09PSAtMSAmJiBzZWFyY2ggPT0gJ3JlbW92ZWQnIHx8IHRtcCA+PSAwICYmIHNlYXJjaCA9PSAnYXBwbGllZCcpIHtcbiAgICAgICAgICAgIGEucHVzaChpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYTtcbiAgfTtcblxuICB2YXIgX19yb3dfc2VsZWN0b3IgPSBmdW5jdGlvbiBfX3Jvd19zZWxlY3RvcihzZXR0aW5ncywgc2VsZWN0b3IsIG9wdHMpIHtcbiAgICB2YXIgcm93cztcblxuICAgIHZhciBydW4gPSBmdW5jdGlvbiBydW4oc2VsKSB7XG4gICAgICB2YXIgc2VsSW50ID0gX2ludFZhbChzZWwpO1xuXG4gICAgICB2YXIgaSwgaWVuO1xuICAgICAgdmFyIGFvRGF0YSA9IHNldHRpbmdzLmFvRGF0YTtcblxuICAgICAgaWYgKHNlbEludCAhPT0gbnVsbCAmJiAhb3B0cykge1xuICAgICAgICByZXR1cm4gW3NlbEludF07XG4gICAgICB9XG5cbiAgICAgIGlmICghcm93cykge1xuICAgICAgICByb3dzID0gX3NlbGVjdG9yX3Jvd19pbmRleGVzKHNldHRpbmdzLCBvcHRzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbEludCAhPT0gbnVsbCAmJiAkLmluQXJyYXkoc2VsSW50LCByb3dzKSAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIFtzZWxJbnRdO1xuICAgICAgfSBlbHNlIGlmIChzZWwgPT09IG51bGwgfHwgc2VsID09PSB1bmRlZmluZWQgfHwgc2VsID09PSAnJykge1xuICAgICAgICByZXR1cm4gcm93cztcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBzZWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuICQubWFwKHJvd3MsIGZ1bmN0aW9uIChpZHgpIHtcbiAgICAgICAgICB2YXIgcm93ID0gYW9EYXRhW2lkeF07XG4gICAgICAgICAgcmV0dXJuIHNlbChpZHgsIHJvdy5fYURhdGEsIHJvdy5uVHIpID8gaWR4IDogbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWwubm9kZU5hbWUpIHtcbiAgICAgICAgdmFyIHJvd0lkeCA9IHNlbC5fRFRfUm93SW5kZXg7XG4gICAgICAgIHZhciBjZWxsSWR4ID0gc2VsLl9EVF9DZWxsSW5kZXg7XG5cbiAgICAgICAgaWYgKHJvd0lkeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIGFvRGF0YVtyb3dJZHhdICYmIGFvRGF0YVtyb3dJZHhdLm5UciA9PT0gc2VsID8gW3Jvd0lkeF0gOiBbXTtcbiAgICAgICAgfSBlbHNlIGlmIChjZWxsSWR4KSB7XG4gICAgICAgICAgcmV0dXJuIGFvRGF0YVtjZWxsSWR4LnJvd10gJiYgYW9EYXRhW2NlbGxJZHgucm93XS5uVHIgPT09IHNlbCA/IFtjZWxsSWR4LnJvd10gOiBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgaG9zdCA9ICQoc2VsKS5jbG9zZXN0KCcqW2RhdGEtZHQtcm93XScpO1xuICAgICAgICAgIHJldHVybiBob3N0Lmxlbmd0aCA/IFtob3N0LmRhdGEoJ2R0LXJvdycpXSA6IFtdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygc2VsID09PSAnc3RyaW5nJyAmJiBzZWwuY2hhckF0KDApID09PSAnIycpIHtcbiAgICAgICAgdmFyIHJvd09iaiA9IHNldHRpbmdzLmFJZHNbc2VsLnJlcGxhY2UoL14jLywgJycpXTtcblxuICAgICAgICBpZiAocm93T2JqICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gW3Jvd09iai5pZHhdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBub2RlcyA9IF9yZW1vdmVFbXB0eShfcGx1Y2tfb3JkZXIoc2V0dGluZ3MuYW9EYXRhLCByb3dzLCAnblRyJykpO1xuXG4gICAgICByZXR1cm4gJChub2RlcykuZmlsdGVyKHNlbCkubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0RUX1Jvd0luZGV4O1xuICAgICAgfSkudG9BcnJheSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gX3NlbGVjdG9yX3J1bigncm93Jywgc2VsZWN0b3IsIHJ1biwgc2V0dGluZ3MsIG9wdHMpO1xuICB9O1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3Jvd3MoKScsIGZ1bmN0aW9uIChzZWxlY3Rvciwgb3B0cykge1xuICAgIGlmIChzZWxlY3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzZWxlY3RvciA9ICcnO1xuICAgIH0gZWxzZSBpZiAoJC5pc1BsYWluT2JqZWN0KHNlbGVjdG9yKSkge1xuICAgICAgb3B0cyA9IHNlbGVjdG9yO1xuICAgICAgc2VsZWN0b3IgPSAnJztcbiAgICB9XG5cbiAgICBvcHRzID0gX3NlbGVjdG9yX29wdHMob3B0cyk7XG4gICAgdmFyIGluc3QgPSB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgcmV0dXJuIF9fcm93X3NlbGVjdG9yKHNldHRpbmdzLCBzZWxlY3Rvciwgb3B0cyk7XG4gICAgfSwgMSk7XG4gICAgaW5zdC5zZWxlY3Rvci5yb3dzID0gc2VsZWN0b3I7XG4gICAgaW5zdC5zZWxlY3Rvci5vcHRzID0gb3B0cztcbiAgICByZXR1cm4gaW5zdDtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcigncm93cygpLm5vZGVzKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3JvdycsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93KSB7XG4gICAgICByZXR1cm4gc2V0dGluZ3MuYW9EYXRhW3Jvd10ublRyIHx8IHVuZGVmaW5lZDtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcigncm93cygpLmRhdGEoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcih0cnVlLCAncm93cycsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93cykge1xuICAgICAgcmV0dXJuIF9wbHVja19vcmRlcihzZXR0aW5ncy5hb0RhdGEsIHJvd3MsICdfYURhdGEnKTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgncm93cygpLmNhY2hlKCknLCAncm93KCkuY2FjaGUoKScsIGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3JvdycsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93KSB7XG4gICAgICB2YXIgciA9IHNldHRpbmdzLmFvRGF0YVtyb3ddO1xuICAgICAgcmV0dXJuIHR5cGUgPT09ICdzZWFyY2gnID8gci5fYUZpbHRlckRhdGEgOiByLl9hU29ydERhdGE7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ3Jvd3MoKS5pbnZhbGlkYXRlKCknLCAncm93KCkuaW52YWxpZGF0ZSgpJywgZnVuY3Rpb24gKHNyYykge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdyb3cnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIHJvdykge1xuICAgICAgX2ZuSW52YWxpZGF0ZShzZXR0aW5ncywgcm93LCBzcmMpO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdyb3dzKCkuaW5kZXhlcygpJywgJ3JvdygpLmluZGV4KCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3JvdycsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93KSB7XG4gICAgICByZXR1cm4gcm93O1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdyb3dzKCkuaWRzKCknLCAncm93KCkuaWQoKScsIGZ1bmN0aW9uIChoYXNoKSB7XG4gICAgdmFyIGEgPSBbXTtcbiAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udGV4dDtcblxuICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBjb250ZXh0Lmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMCwgamVuID0gdGhpc1tpXS5sZW5ndGg7IGogPCBqZW47IGorKykge1xuICAgICAgICB2YXIgaWQgPSBjb250ZXh0W2ldLnJvd0lkRm4oY29udGV4dFtpXS5hb0RhdGFbdGhpc1tpXVtqXV0uX2FEYXRhKTtcbiAgICAgICAgYS5wdXNoKChoYXNoID09PSB0cnVlID8gJyMnIDogJycpICsgaWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgX0FwaTIoY29udGV4dCwgYSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ3Jvd3MoKS5yZW1vdmUoKScsICdyb3coKS5yZW1vdmUoKScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5pdGVyYXRvcigncm93JywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3csIHRoYXRJZHgpIHtcbiAgICAgIHZhciBkYXRhID0gc2V0dGluZ3MuYW9EYXRhO1xuICAgICAgdmFyIHJvd0RhdGEgPSBkYXRhW3Jvd107XG4gICAgICB2YXIgaSwgaWVuLCBqLCBqZW47XG4gICAgICB2YXIgbG9vcFJvdywgbG9vcENlbGxzO1xuICAgICAgZGF0YS5zcGxpY2Uocm93LCAxKTtcblxuICAgICAgZm9yIChpID0gMCwgaWVuID0gZGF0YS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBsb29wUm93ID0gZGF0YVtpXTtcbiAgICAgICAgbG9vcENlbGxzID0gbG9vcFJvdy5hbkNlbGxzO1xuXG4gICAgICAgIGlmIChsb29wUm93Lm5UciAhPT0gbnVsbCkge1xuICAgICAgICAgIGxvb3BSb3cublRyLl9EVF9Sb3dJbmRleCA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobG9vcENlbGxzICE9PSBudWxsKSB7XG4gICAgICAgICAgZm9yIChqID0gMCwgamVuID0gbG9vcENlbGxzLmxlbmd0aDsgaiA8IGplbjsgaisrKSB7XG4gICAgICAgICAgICBsb29wQ2VsbHNbal0uX0RUX0NlbGxJbmRleC5yb3cgPSBpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfZm5EZWxldGVJbmRleChzZXR0aW5ncy5haURpc3BsYXlNYXN0ZXIsIHJvdyk7XG5cbiAgICAgIF9mbkRlbGV0ZUluZGV4KHNldHRpbmdzLmFpRGlzcGxheSwgcm93KTtcblxuICAgICAgX2ZuRGVsZXRlSW5kZXgodGhhdFt0aGF0SWR4XSwgcm93LCBmYWxzZSk7XG5cbiAgICAgIGlmIChzZXR0aW5ncy5faVJlY29yZHNEaXNwbGF5ID4gMCkge1xuICAgICAgICBzZXR0aW5ncy5faVJlY29yZHNEaXNwbGF5LS07XG4gICAgICB9XG5cbiAgICAgIF9mbkxlbmd0aE92ZXJmbG93KHNldHRpbmdzKTtcblxuICAgICAgdmFyIGlkID0gc2V0dGluZ3Mucm93SWRGbihyb3dEYXRhLl9hRGF0YSk7XG5cbiAgICAgIGlmIChpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRlbGV0ZSBzZXR0aW5ncy5hSWRzW2lkXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IHNldHRpbmdzLmFvRGF0YS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBzZXR0aW5ncy5hb0RhdGFbaV0uaWR4ID0gaTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcigncm93cy5hZGQoKScsIGZ1bmN0aW9uIChyb3dzKSB7XG4gICAgdmFyIG5ld1Jvd3MgPSB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgdmFyIHJvdywgaSwgaWVuO1xuICAgICAgdmFyIG91dCA9IFtdO1xuXG4gICAgICBmb3IgKGkgPSAwLCBpZW4gPSByb3dzLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIHJvdyA9IHJvd3NbaV07XG5cbiAgICAgICAgaWYgKHJvdy5ub2RlTmFtZSAmJiByb3cubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1RSJykge1xuICAgICAgICAgIG91dC5wdXNoKF9mbkFkZFRyKHNldHRpbmdzLCByb3cpWzBdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQucHVzaChfZm5BZGREYXRhKHNldHRpbmdzLCByb3cpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0O1xuICAgIH0sIDEpO1xuICAgIHZhciBtb2RSb3dzID0gdGhpcy5yb3dzKC0xKTtcbiAgICBtb2RSb3dzLnBvcCgpO1xuICAgICQubWVyZ2UobW9kUm93cywgbmV3Um93cyk7XG4gICAgcmV0dXJuIG1vZFJvd3M7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3JvdygpJywgZnVuY3Rpb24gKHNlbGVjdG9yLCBvcHRzKSB7XG4gICAgcmV0dXJuIF9zZWxlY3Rvcl9maXJzdCh0aGlzLnJvd3Moc2VsZWN0b3IsIG9wdHMpKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcigncm93KCkuZGF0YSgpJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGN0eC5sZW5ndGggJiYgdGhpcy5sZW5ndGggPyBjdHhbMF0uYW9EYXRhW3RoaXNbMF1dLl9hRGF0YSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgcm93ID0gY3R4WzBdLmFvRGF0YVt0aGlzWzBdXTtcbiAgICByb3cuX2FEYXRhID0gZGF0YTtcblxuICAgIGlmICgkLmlzQXJyYXkoZGF0YSkgJiYgcm93Lm5Uci5pZCkge1xuICAgICAgX2ZuU2V0T2JqZWN0RGF0YUZuKGN0eFswXS5yb3dJZCkoZGF0YSwgcm93Lm5Uci5pZCk7XG4gICAgfVxuXG4gICAgX2ZuSW52YWxpZGF0ZShjdHhbMF0sIHRoaXNbMF0sICdkYXRhJyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcigncm93KCkubm9kZSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG4gICAgcmV0dXJuIGN0eC5sZW5ndGggJiYgdGhpcy5sZW5ndGggPyBjdHhbMF0uYW9EYXRhW3RoaXNbMF1dLm5UciB8fCBudWxsIDogbnVsbDtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcigncm93LmFkZCgpJywgZnVuY3Rpb24gKHJvdykge1xuICAgIGlmIChyb3cgaW5zdGFuY2VvZiAkICYmIHJvdy5sZW5ndGgpIHtcbiAgICAgIHJvdyA9IHJvd1swXTtcbiAgICB9XG5cbiAgICB2YXIgcm93cyA9IHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBpZiAocm93Lm5vZGVOYW1lICYmIHJvdy5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09PSAnVFInKSB7XG4gICAgICAgIHJldHVybiBfZm5BZGRUcihzZXR0aW5ncywgcm93KVswXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9mbkFkZERhdGEoc2V0dGluZ3MsIHJvdyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMucm93KHJvd3NbMF0pO1xuICB9KTtcblxuICB2YXIgX19kZXRhaWxzX2FkZCA9IGZ1bmN0aW9uIF9fZGV0YWlsc19hZGQoY3R4LCByb3csIGRhdGEsIGtsYXNzKSB7XG4gICAgdmFyIHJvd3MgPSBbXTtcblxuICAgIHZhciBhZGRSb3cgPSBmdW5jdGlvbiBhZGRSb3cociwgaykge1xuICAgICAgaWYgKCQuaXNBcnJheShyKSB8fCByIGluc3RhbmNlb2YgJCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWVuID0gci5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgIGFkZFJvdyhyW2ldLCBrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHIubm9kZU5hbWUgJiYgci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAndHInKSB7XG4gICAgICAgIHJvd3MucHVzaChyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjcmVhdGVkID0gJCgnPHRyPjx0ZC8+PC90cj4nKS5hZGRDbGFzcyhrKTtcbiAgICAgICAgJCgndGQnLCBjcmVhdGVkKS5hZGRDbGFzcyhrKS5odG1sKHIpWzBdLmNvbFNwYW4gPSBfZm5WaXNibGVDb2x1bW5zKGN0eCk7XG4gICAgICAgIHJvd3MucHVzaChjcmVhdGVkWzBdKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYWRkUm93KGRhdGEsIGtsYXNzKTtcblxuICAgIGlmIChyb3cuX2RldGFpbHMpIHtcbiAgICAgIHJvdy5fZGV0YWlscy5kZXRhY2goKTtcbiAgICB9XG5cbiAgICByb3cuX2RldGFpbHMgPSAkKHJvd3MpO1xuXG4gICAgaWYgKHJvdy5fZGV0YWlsc1Nob3cpIHtcbiAgICAgIHJvdy5fZGV0YWlscy5pbnNlcnRBZnRlcihyb3cublRyKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9fZGV0YWlsc19yZW1vdmUgPSBmdW5jdGlvbiBfX2RldGFpbHNfcmVtb3ZlKGFwaSwgaWR4KSB7XG4gICAgdmFyIGN0eCA9IGFwaS5jb250ZXh0O1xuXG4gICAgaWYgKGN0eC5sZW5ndGgpIHtcbiAgICAgIHZhciByb3cgPSBjdHhbMF0uYW9EYXRhW2lkeCAhPT0gdW5kZWZpbmVkID8gaWR4IDogYXBpWzBdXTtcblxuICAgICAgaWYgKHJvdyAmJiByb3cuX2RldGFpbHMpIHtcbiAgICAgICAgcm93Ll9kZXRhaWxzLnJlbW92ZSgpO1xuXG4gICAgICAgIHJvdy5fZGV0YWlsc1Nob3cgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJvdy5fZGV0YWlscyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIF9fZGV0YWlsc19kaXNwbGF5ID0gZnVuY3Rpb24gX19kZXRhaWxzX2Rpc3BsYXkoYXBpLCBzaG93KSB7XG4gICAgdmFyIGN0eCA9IGFwaS5jb250ZXh0O1xuXG4gICAgaWYgKGN0eC5sZW5ndGggJiYgYXBpLmxlbmd0aCkge1xuICAgICAgdmFyIHJvdyA9IGN0eFswXS5hb0RhdGFbYXBpWzBdXTtcblxuICAgICAgaWYgKHJvdy5fZGV0YWlscykge1xuICAgICAgICByb3cuX2RldGFpbHNTaG93ID0gc2hvdztcblxuICAgICAgICBpZiAoc2hvdykge1xuICAgICAgICAgIHJvdy5fZGV0YWlscy5pbnNlcnRBZnRlcihyb3cublRyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByb3cuX2RldGFpbHMuZGV0YWNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBfX2RldGFpbHNfZXZlbnRzKGN0eFswXSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHZhciBfX2RldGFpbHNfZXZlbnRzID0gZnVuY3Rpb24gX19kZXRhaWxzX2V2ZW50cyhzZXR0aW5ncykge1xuICAgIHZhciBhcGkgPSBuZXcgX0FwaTIoc2V0dGluZ3MpO1xuICAgIHZhciBuYW1lc3BhY2UgPSAnLmR0LkRUX2RldGFpbHMnO1xuICAgIHZhciBkcmF3RXZlbnQgPSAnZHJhdycgKyBuYW1lc3BhY2U7XG4gICAgdmFyIGNvbHZpc0V2ZW50ID0gJ2NvbHVtbi12aXNpYmlsaXR5JyArIG5hbWVzcGFjZTtcbiAgICB2YXIgZGVzdHJveUV2ZW50ID0gJ2Rlc3Ryb3knICsgbmFtZXNwYWNlO1xuICAgIHZhciBkYXRhID0gc2V0dGluZ3MuYW9EYXRhO1xuICAgIGFwaS5vZmYoZHJhd0V2ZW50ICsgJyAnICsgY29sdmlzRXZlbnQgKyAnICcgKyBkZXN0cm95RXZlbnQpO1xuXG4gICAgaWYgKF9wbHVjayhkYXRhLCAnX2RldGFpbHMnKS5sZW5ndGggPiAwKSB7XG4gICAgICBhcGkub24oZHJhd0V2ZW50LCBmdW5jdGlvbiAoZSwgY3R4KSB7XG4gICAgICAgIGlmIChzZXR0aW5ncyAhPT0gY3R4KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBpLnJvd3Moe1xuICAgICAgICAgIHBhZ2U6ICdjdXJyZW50J1xuICAgICAgICB9KS5lcSgwKS5lYWNoKGZ1bmN0aW9uIChpZHgpIHtcbiAgICAgICAgICB2YXIgcm93ID0gZGF0YVtpZHhdO1xuXG4gICAgICAgICAgaWYgKHJvdy5fZGV0YWlsc1Nob3cpIHtcbiAgICAgICAgICAgIHJvdy5fZGV0YWlscy5pbnNlcnRBZnRlcihyb3cublRyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBhcGkub24oY29sdmlzRXZlbnQsIGZ1bmN0aW9uIChlLCBjdHgsIGlkeCwgdmlzKSB7XG4gICAgICAgIGlmIChzZXR0aW5ncyAhPT0gY3R4KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJvdyxcbiAgICAgICAgICAgIHZpc2libGUgPSBfZm5WaXNibGVDb2x1bW5zKGN0eCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGllbiA9IGRhdGEubGVuZ3RoOyBpIDwgaWVuOyBpKyspIHtcbiAgICAgICAgICByb3cgPSBkYXRhW2ldO1xuXG4gICAgICAgICAgaWYgKHJvdy5fZGV0YWlscykge1xuICAgICAgICAgICAgcm93Ll9kZXRhaWxzLmNoaWxkcmVuKCd0ZFtjb2xzcGFuXScpLmF0dHIoJ2NvbHNwYW4nLCB2aXNpYmxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXBpLm9uKGRlc3Ryb3lFdmVudCwgZnVuY3Rpb24gKGUsIGN0eCkge1xuICAgICAgICBpZiAoc2V0dGluZ3MgIT09IGN0eCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRhdGFbaV0uX2RldGFpbHMpIHtcbiAgICAgICAgICAgIF9fZGV0YWlsc19yZW1vdmUoYXBpLCBpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX2VtcCA9ICcnO1xuXG4gIHZhciBfY2hpbGRfb2JqID0gX2VtcCArICdyb3coKS5jaGlsZCc7XG5cbiAgdmFyIF9jaGlsZF9tdGggPSBfY2hpbGRfb2JqICsgJygpJztcblxuICBfYXBpX3JlZ2lzdGVyKF9jaGlsZF9tdGgsIGZ1bmN0aW9uIChkYXRhLCBrbGFzcykge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gY3R4Lmxlbmd0aCAmJiB0aGlzLmxlbmd0aCA/IGN0eFswXS5hb0RhdGFbdGhpc1swXV0uX2RldGFpbHMgOiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmIChkYXRhID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmNoaWxkLnNob3coKTtcbiAgICB9IGVsc2UgaWYgKGRhdGEgPT09IGZhbHNlKSB7XG4gICAgICBfX2RldGFpbHNfcmVtb3ZlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoY3R4Lmxlbmd0aCAmJiB0aGlzLmxlbmd0aCkge1xuICAgICAgX19kZXRhaWxzX2FkZChjdHhbMF0sIGN0eFswXS5hb0RhdGFbdGhpc1swXV0sIGRhdGEsIGtsYXNzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcihbX2NoaWxkX29iaiArICcuc2hvdygpJywgX2NoaWxkX210aCArICcuc2hvdygpJ10sIGZ1bmN0aW9uIChzaG93KSB7XG4gICAgX19kZXRhaWxzX2Rpc3BsYXkodGhpcywgdHJ1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcihbX2NoaWxkX29iaiArICcuaGlkZSgpJywgX2NoaWxkX210aCArICcuaGlkZSgpJ10sIGZ1bmN0aW9uICgpIHtcbiAgICBfX2RldGFpbHNfZGlzcGxheSh0aGlzLCBmYWxzZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcihbX2NoaWxkX29iaiArICcucmVtb3ZlKCknLCBfY2hpbGRfbXRoICsgJy5yZW1vdmUoKSddLCBmdW5jdGlvbiAoKSB7XG4gICAgX19kZXRhaWxzX3JlbW92ZSh0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKF9jaGlsZF9vYmogKyAnLmlzU2hvd24oKScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKGN0eC5sZW5ndGggJiYgdGhpcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBjdHhbMF0uYW9EYXRhW3RoaXNbMF1dLl9kZXRhaWxzU2hvdyB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gIHZhciBfX3JlX2NvbHVtbl9zZWxlY3RvciA9IC9eKFteOl0rKToobmFtZXx2aXNJZHh8dmlzaWJsZSkkLztcblxuICB2YXIgX19jb2x1bW5EYXRhID0gZnVuY3Rpb24gX19jb2x1bW5EYXRhKHNldHRpbmdzLCBjb2x1bW4sIHIxLCByMiwgcm93cykge1xuICAgIHZhciBhID0gW107XG5cbiAgICBmb3IgKHZhciByb3cgPSAwLCBpZW4gPSByb3dzLmxlbmd0aDsgcm93IDwgaWVuOyByb3crKykge1xuICAgICAgYS5wdXNoKF9mbkdldENlbGxEYXRhKHNldHRpbmdzLCByb3dzW3Jvd10sIGNvbHVtbikpO1xuICAgIH1cblxuICAgIHJldHVybiBhO1xuICB9O1xuXG4gIHZhciBfX2NvbHVtbl9zZWxlY3RvciA9IGZ1bmN0aW9uIF9fY29sdW1uX3NlbGVjdG9yKHNldHRpbmdzLCBzZWxlY3Rvciwgb3B0cykge1xuICAgIHZhciBjb2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zLFxuICAgICAgICBuYW1lcyA9IF9wbHVjayhjb2x1bW5zLCAnc05hbWUnKSxcbiAgICAgICAgbm9kZXMgPSBfcGx1Y2soY29sdW1ucywgJ25UaCcpO1xuXG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uIHJ1bihzKSB7XG4gICAgICB2YXIgc2VsSW50ID0gX2ludFZhbChzKTtcblxuICAgICAgaWYgKHMgPT09ICcnKSB7XG4gICAgICAgIHJldHVybiBfcmFuZ2UoY29sdW1ucy5sZW5ndGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsSW50ICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbc2VsSW50ID49IDAgPyBzZWxJbnQgOiBjb2x1bW5zLmxlbmd0aCArIHNlbEludF07XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgcm93cyA9IF9zZWxlY3Rvcl9yb3dfaW5kZXhlcyhzZXR0aW5ncywgb3B0cyk7XG5cbiAgICAgICAgcmV0dXJuICQubWFwKGNvbHVtbnMsIGZ1bmN0aW9uIChjb2wsIGlkeCkge1xuICAgICAgICAgIHJldHVybiBzKGlkeCwgX19jb2x1bW5EYXRhKHNldHRpbmdzLCBpZHgsIDAsIDAsIHJvd3MpLCBub2Rlc1tpZHhdKSA/IGlkeCA6IG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWF0Y2ggPSB0eXBlb2YgcyA9PT0gJ3N0cmluZycgPyBzLm1hdGNoKF9fcmVfY29sdW1uX3NlbGVjdG9yKSA6ICcnO1xuXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgc3dpdGNoIChtYXRjaFsyXSkge1xuICAgICAgICAgIGNhc2UgJ3Zpc0lkeCc6XG4gICAgICAgICAgY2FzZSAndmlzaWJsZSc6XG4gICAgICAgICAgICB2YXIgaWR4ID0gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKTtcblxuICAgICAgICAgICAgaWYgKGlkeCA8IDApIHtcbiAgICAgICAgICAgICAgdmFyIHZpc0NvbHVtbnMgPSAkLm1hcChjb2x1bW5zLCBmdW5jdGlvbiAoY29sLCBpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbC5iVmlzaWJsZSA/IGkgOiBudWxsO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIFt2aXNDb2x1bW5zW3Zpc0NvbHVtbnMubGVuZ3RoICsgaWR4XV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBbX2ZuVmlzaWJsZVRvQ29sdW1uSW5kZXgoc2V0dGluZ3MsIGlkeCldO1xuXG4gICAgICAgICAgY2FzZSAnbmFtZSc6XG4gICAgICAgICAgICByZXR1cm4gJC5tYXAobmFtZXMsIGZ1bmN0aW9uIChuYW1lLCBpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBuYW1lID09PSBtYXRjaFsxXSA/IGkgOiBudWxsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzLm5vZGVOYW1lICYmIHMuX0RUX0NlbGxJbmRleCkge1xuICAgICAgICByZXR1cm4gW3MuX0RUX0NlbGxJbmRleC5jb2x1bW5dO1xuICAgICAgfVxuXG4gICAgICB2YXIganFSZXN1bHQgPSAkKG5vZGVzKS5maWx0ZXIocykubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICQuaW5BcnJheSh0aGlzLCBub2Rlcyk7XG4gICAgICB9KS50b0FycmF5KCk7XG5cbiAgICAgIGlmIChqcVJlc3VsdC5sZW5ndGggfHwgIXMubm9kZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGpxUmVzdWx0O1xuICAgICAgfVxuXG4gICAgICB2YXIgaG9zdCA9ICQocykuY2xvc2VzdCgnKltkYXRhLWR0LWNvbHVtbl0nKTtcbiAgICAgIHJldHVybiBob3N0Lmxlbmd0aCA/IFtob3N0LmRhdGEoJ2R0LWNvbHVtbicpXSA6IFtdO1xuICAgIH07XG5cbiAgICByZXR1cm4gX3NlbGVjdG9yX3J1bignY29sdW1uJywgc2VsZWN0b3IsIHJ1biwgc2V0dGluZ3MsIG9wdHMpO1xuICB9O1xuXG4gIHZhciBfX3NldENvbHVtblZpcyA9IGZ1bmN0aW9uIF9fc2V0Q29sdW1uVmlzKHNldHRpbmdzLCBjb2x1bW4sIHZpcykge1xuICAgIHZhciBjb2xzID0gc2V0dGluZ3MuYW9Db2x1bW5zLFxuICAgICAgICBjb2wgPSBjb2xzW2NvbHVtbl0sXG4gICAgICAgIGRhdGEgPSBzZXR0aW5ncy5hb0RhdGEsXG4gICAgICAgIHJvdyxcbiAgICAgICAgY2VsbHMsXG4gICAgICAgIGksXG4gICAgICAgIGllbixcbiAgICAgICAgdHI7XG5cbiAgICBpZiAodmlzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBjb2wuYlZpc2libGU7XG4gICAgfVxuXG4gICAgaWYgKGNvbC5iVmlzaWJsZSA9PT0gdmlzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHZpcykge1xuICAgICAgdmFyIGluc2VydEJlZm9yZSA9ICQuaW5BcnJheSh0cnVlLCBfcGx1Y2soY29scywgJ2JWaXNpYmxlJyksIGNvbHVtbiArIDEpO1xuXG4gICAgICBmb3IgKGkgPSAwLCBpZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgIHRyID0gZGF0YVtpXS5uVHI7XG4gICAgICAgIGNlbGxzID0gZGF0YVtpXS5hbkNlbGxzO1xuXG4gICAgICAgIGlmICh0cikge1xuICAgICAgICAgIHRyLmluc2VydEJlZm9yZShjZWxsc1tjb2x1bW5dLCBjZWxsc1tpbnNlcnRCZWZvcmVdIHx8IG51bGwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICQoX3BsdWNrKHNldHRpbmdzLmFvRGF0YSwgJ2FuQ2VsbHMnLCBjb2x1bW4pKS5kZXRhY2goKTtcbiAgICB9XG5cbiAgICBjb2wuYlZpc2libGUgPSB2aXM7XG5cbiAgICBfZm5EcmF3SGVhZChzZXR0aW5ncywgc2V0dGluZ3MuYW9IZWFkZXIpO1xuXG4gICAgX2ZuRHJhd0hlYWQoc2V0dGluZ3MsIHNldHRpbmdzLmFvRm9vdGVyKTtcblxuICAgIGlmICghc2V0dGluZ3MuYWlEaXNwbGF5Lmxlbmd0aCkge1xuICAgICAgJChzZXR0aW5ncy5uVEJvZHkpLmZpbmQoJ3RkW2NvbHNwYW5dJykuYXR0cignY29sc3BhbicsIF9mblZpc2JsZUNvbHVtbnMoc2V0dGluZ3MpKTtcbiAgICB9XG5cbiAgICBfZm5TYXZlU3RhdGUoc2V0dGluZ3MpO1xuICB9O1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2NvbHVtbnMoKScsIGZ1bmN0aW9uIChzZWxlY3Rvciwgb3B0cykge1xuICAgIGlmIChzZWxlY3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzZWxlY3RvciA9ICcnO1xuICAgIH0gZWxzZSBpZiAoJC5pc1BsYWluT2JqZWN0KHNlbGVjdG9yKSkge1xuICAgICAgb3B0cyA9IHNlbGVjdG9yO1xuICAgICAgc2VsZWN0b3IgPSAnJztcbiAgICB9XG5cbiAgICBvcHRzID0gX3NlbGVjdG9yX29wdHMob3B0cyk7XG4gICAgdmFyIGluc3QgPSB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgcmV0dXJuIF9fY29sdW1uX3NlbGVjdG9yKHNldHRpbmdzLCBzZWxlY3Rvciwgb3B0cyk7XG4gICAgfSwgMSk7XG4gICAgaW5zdC5zZWxlY3Rvci5jb2xzID0gc2VsZWN0b3I7XG4gICAgaW5zdC5zZWxlY3Rvci5vcHRzID0gb3B0cztcbiAgICByZXR1cm4gaW5zdDtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlclBsdXJhbCgnY29sdW1ucygpLmhlYWRlcigpJywgJ2NvbHVtbigpLmhlYWRlcigpJywgZnVuY3Rpb24gKHNlbGVjdG9yLCBvcHRzKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NvbHVtbicsIGZ1bmN0aW9uIChzZXR0aW5ncywgY29sdW1uKSB7XG4gICAgICByZXR1cm4gc2V0dGluZ3MuYW9Db2x1bW5zW2NvbHVtbl0ublRoO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjb2x1bW5zKCkuZm9vdGVyKCknLCAnY29sdW1uKCkuZm9vdGVyKCknLCBmdW5jdGlvbiAoc2VsZWN0b3IsIG9wdHMpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY29sdW1uJywgZnVuY3Rpb24gKHNldHRpbmdzLCBjb2x1bW4pIHtcbiAgICAgIHJldHVybiBzZXR0aW5ncy5hb0NvbHVtbnNbY29sdW1uXS5uVGY7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NvbHVtbnMoKS5kYXRhKCknLCAnY29sdW1uKCkuZGF0YSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjb2x1bW4tcm93cycsIF9fY29sdW1uRGF0YSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NvbHVtbnMoKS5kYXRhU3JjKCknLCAnY29sdW1uKCkuZGF0YVNyYygpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjb2x1bW4nLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbHVtbikge1xuICAgICAgcmV0dXJuIHNldHRpbmdzLmFvQ29sdW1uc1tjb2x1bW5dLm1EYXRhO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjb2x1bW5zKCkuY2FjaGUoKScsICdjb2x1bW4oKS5jYWNoZSgpJywgZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY29sdW1uLXJvd3MnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbHVtbiwgaSwgaiwgcm93cykge1xuICAgICAgcmV0dXJuIF9wbHVja19vcmRlcihzZXR0aW5ncy5hb0RhdGEsIHJvd3MsIHR5cGUgPT09ICdzZWFyY2gnID8gJ19hRmlsdGVyRGF0YScgOiAnX2FTb3J0RGF0YScsIGNvbHVtbik7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NvbHVtbnMoKS5ub2RlcygpJywgJ2NvbHVtbigpLm5vZGVzKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NvbHVtbi1yb3dzJywgZnVuY3Rpb24gKHNldHRpbmdzLCBjb2x1bW4sIGksIGosIHJvd3MpIHtcbiAgICAgIHJldHVybiBfcGx1Y2tfb3JkZXIoc2V0dGluZ3MuYW9EYXRhLCByb3dzLCAnYW5DZWxscycsIGNvbHVtbik7XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NvbHVtbnMoKS52aXNpYmxlKCknLCAnY29sdW1uKCkudmlzaWJsZSgpJywgZnVuY3Rpb24gKHZpcywgY2FsYykge1xuICAgIHZhciByZXQgPSB0aGlzLml0ZXJhdG9yKCdjb2x1bW4nLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbHVtbikge1xuICAgICAgaWYgKHZpcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBzZXR0aW5ncy5hb0NvbHVtbnNbY29sdW1uXS5iVmlzaWJsZTtcbiAgICAgIH1cblxuICAgICAgX19zZXRDb2x1bW5WaXMoc2V0dGluZ3MsIGNvbHVtbiwgdmlzKTtcbiAgICB9KTtcblxuICAgIGlmICh2aXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5pdGVyYXRvcignY29sdW1uJywgZnVuY3Rpb24gKHNldHRpbmdzLCBjb2x1bW4pIHtcbiAgICAgICAgX2ZuQ2FsbGJhY2tGaXJlKHNldHRpbmdzLCBudWxsLCAnY29sdW1uLXZpc2liaWxpdHknLCBbc2V0dGluZ3MsIGNvbHVtbiwgdmlzLCBjYWxjXSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGNhbGMgPT09IHVuZGVmaW5lZCB8fCBjYWxjKSB7XG4gICAgICAgIHRoaXMuY29sdW1ucy5hZGp1c3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjb2x1bW5zKCkuaW5kZXhlcygpJywgJ2NvbHVtbigpLmluZGV4KCknLCBmdW5jdGlvbiAodHlwZSkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjb2x1bW4nLCBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbHVtbikge1xuICAgICAgcmV0dXJuIHR5cGUgPT09ICd2aXNpYmxlJyA/IF9mbkNvbHVtbkluZGV4VG9WaXNpYmxlKHNldHRpbmdzLCBjb2x1bW4pIDogY29sdW1uO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdjb2x1bW5zLmFkanVzdCgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgX2ZuQWRqdXN0Q29sdW1uU2l6aW5nKHNldHRpbmdzKTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignY29sdW1uLmluZGV4KCknLCBmdW5jdGlvbiAodHlwZSwgaWR4KSB7XG4gICAgaWYgKHRoaXMuY29udGV4dC5sZW5ndGggIT09IDApIHtcbiAgICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHRbMF07XG5cbiAgICAgIGlmICh0eXBlID09PSAnZnJvbVZpc2libGUnIHx8IHR5cGUgPT09ICd0b0RhdGEnKSB7XG4gICAgICAgIHJldHVybiBfZm5WaXNpYmxlVG9Db2x1bW5JbmRleChjdHgsIGlkeCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdmcm9tRGF0YScgfHwgdHlwZSA9PT0gJ3RvVmlzaWJsZScpIHtcbiAgICAgICAgcmV0dXJuIF9mbkNvbHVtbkluZGV4VG9WaXNpYmxlKGN0eCwgaWR4KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2NvbHVtbigpJywgZnVuY3Rpb24gKHNlbGVjdG9yLCBvcHRzKSB7XG4gICAgcmV0dXJuIF9zZWxlY3Rvcl9maXJzdCh0aGlzLmNvbHVtbnMoc2VsZWN0b3IsIG9wdHMpKTtcbiAgfSk7XG5cbiAgdmFyIF9fY2VsbF9zZWxlY3RvciA9IGZ1bmN0aW9uIF9fY2VsbF9zZWxlY3RvcihzZXR0aW5ncywgc2VsZWN0b3IsIG9wdHMpIHtcbiAgICB2YXIgZGF0YSA9IHNldHRpbmdzLmFvRGF0YTtcblxuICAgIHZhciByb3dzID0gX3NlbGVjdG9yX3Jvd19pbmRleGVzKHNldHRpbmdzLCBvcHRzKTtcblxuICAgIHZhciBjZWxscyA9IF9yZW1vdmVFbXB0eShfcGx1Y2tfb3JkZXIoZGF0YSwgcm93cywgJ2FuQ2VsbHMnKSk7XG5cbiAgICB2YXIgYWxsQ2VsbHMgPSAkKFtdLmNvbmNhdC5hcHBseShbXSwgY2VsbHMpKTtcbiAgICB2YXIgcm93O1xuICAgIHZhciBjb2x1bW5zID0gc2V0dGluZ3MuYW9Db2x1bW5zLmxlbmd0aDtcbiAgICB2YXIgYSwgaSwgaWVuLCBqLCBvLCBob3N0O1xuXG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uIHJ1bihzKSB7XG4gICAgICB2YXIgZm5TZWxlY3RvciA9IHR5cGVvZiBzID09PSAnZnVuY3Rpb24nO1xuXG4gICAgICBpZiAocyA9PT0gbnVsbCB8fCBzID09PSB1bmRlZmluZWQgfHwgZm5TZWxlY3Rvcikge1xuICAgICAgICBhID0gW107XG5cbiAgICAgICAgZm9yIChpID0gMCwgaWVuID0gcm93cy5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICAgIHJvdyA9IHJvd3NbaV07XG5cbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgY29sdW1uczsgaisrKSB7XG4gICAgICAgICAgICBvID0ge1xuICAgICAgICAgICAgICByb3c6IHJvdyxcbiAgICAgICAgICAgICAgY29sdW1uOiBqXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoZm5TZWxlY3Rvcikge1xuICAgICAgICAgICAgICBob3N0ID0gZGF0YVtyb3ddO1xuXG4gICAgICAgICAgICAgIGlmIChzKG8sIF9mbkdldENlbGxEYXRhKHNldHRpbmdzLCByb3csIGopLCBob3N0LmFuQ2VsbHMgPyBob3N0LmFuQ2VsbHNbal0gOiBudWxsKSkge1xuICAgICAgICAgICAgICAgIGEucHVzaChvKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYS5wdXNoKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgICAgfVxuXG4gICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHMpKSB7XG4gICAgICAgIHJldHVybiBzLmNvbHVtbiAhPT0gdW5kZWZpbmVkICYmIHMucm93ICE9PSB1bmRlZmluZWQgJiYgJC5pbkFycmF5KHMucm93LCByb3dzKSAhPT0gLTEgPyBbc10gOiBbXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGpxUmVzdWx0ID0gYWxsQ2VsbHMuZmlsdGVyKHMpLm1hcChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByb3c6IGVsLl9EVF9DZWxsSW5kZXgucm93LFxuICAgICAgICAgIGNvbHVtbjogZWwuX0RUX0NlbGxJbmRleC5jb2x1bW5cbiAgICAgICAgfTtcbiAgICAgIH0pLnRvQXJyYXkoKTtcblxuICAgICAgaWYgKGpxUmVzdWx0Lmxlbmd0aCB8fCAhcy5ub2RlTmFtZSkge1xuICAgICAgICByZXR1cm4ganFSZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGhvc3QgPSAkKHMpLmNsb3Nlc3QoJypbZGF0YS1kdC1yb3ddJyk7XG4gICAgICByZXR1cm4gaG9zdC5sZW5ndGggPyBbe1xuICAgICAgICByb3c6IGhvc3QuZGF0YSgnZHQtcm93JyksXG4gICAgICAgIGNvbHVtbjogaG9zdC5kYXRhKCdkdC1jb2x1bW4nKVxuICAgICAgfV0gOiBbXTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF9zZWxlY3Rvcl9ydW4oJ2NlbGwnLCBzZWxlY3RvciwgcnVuLCBzZXR0aW5ncywgb3B0cyk7XG4gIH07XG5cbiAgX2FwaV9yZWdpc3RlcignY2VsbHMoKScsIGZ1bmN0aW9uIChyb3dTZWxlY3RvciwgY29sdW1uU2VsZWN0b3IsIG9wdHMpIHtcbiAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHJvd1NlbGVjdG9yKSkge1xuICAgICAgaWYgKHJvd1NlbGVjdG9yLnJvdyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9wdHMgPSByb3dTZWxlY3RvcjtcbiAgICAgICAgcm93U2VsZWN0b3IgPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0cyA9IGNvbHVtblNlbGVjdG9yO1xuICAgICAgICBjb2x1bW5TZWxlY3RvciA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCQuaXNQbGFpbk9iamVjdChjb2x1bW5TZWxlY3RvcikpIHtcbiAgICAgIG9wdHMgPSBjb2x1bW5TZWxlY3RvcjtcbiAgICAgIGNvbHVtblNlbGVjdG9yID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoY29sdW1uU2VsZWN0b3IgPT09IG51bGwgfHwgY29sdW1uU2VsZWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICAgIHJldHVybiBfX2NlbGxfc2VsZWN0b3Ioc2V0dGluZ3MsIHJvd1NlbGVjdG9yLCBfc2VsZWN0b3Jfb3B0cyhvcHRzKSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgY29sdW1ucyA9IHRoaXMuY29sdW1ucyhjb2x1bW5TZWxlY3Rvcik7XG4gICAgdmFyIHJvd3MgPSB0aGlzLnJvd3Mocm93U2VsZWN0b3IpO1xuICAgIHZhciBhLCBpLCBpZW4sIGosIGplbjtcbiAgICB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncywgaWR4KSB7XG4gICAgICBhID0gW107XG5cbiAgICAgIGZvciAoaSA9IDAsIGllbiA9IHJvd3NbaWR4XS5sZW5ndGg7IGkgPCBpZW47IGkrKykge1xuICAgICAgICBmb3IgKGogPSAwLCBqZW4gPSBjb2x1bW5zW2lkeF0ubGVuZ3RoOyBqIDwgamVuOyBqKyspIHtcbiAgICAgICAgICBhLnB1c2goe1xuICAgICAgICAgICAgcm93OiByb3dzW2lkeF1baV0sXG4gICAgICAgICAgICBjb2x1bW46IGNvbHVtbnNbaWR4XVtqXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgMSk7XG4gICAgdmFyIGNlbGxzID0gdGhpcy5jZWxscyhhLCBvcHRzKTtcbiAgICAkLmV4dGVuZChjZWxscy5zZWxlY3Rvciwge1xuICAgICAgY29sczogY29sdW1uU2VsZWN0b3IsXG4gICAgICByb3dzOiByb3dTZWxlY3RvcixcbiAgICAgIG9wdHM6IG9wdHNcbiAgICB9KTtcbiAgICByZXR1cm4gY2VsbHM7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NlbGxzKCkubm9kZXMoKScsICdjZWxsKCkubm9kZSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjZWxsJywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3csIGNvbHVtbikge1xuICAgICAgdmFyIGRhdGEgPSBzZXR0aW5ncy5hb0RhdGFbcm93XTtcbiAgICAgIHJldHVybiBkYXRhICYmIGRhdGEuYW5DZWxscyA/IGRhdGEuYW5DZWxsc1tjb2x1bW5dIDogdW5kZWZpbmVkO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdjZWxscygpLmRhdGEoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY2VsbCcsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93LCBjb2x1bW4pIHtcbiAgICAgIHJldHVybiBfZm5HZXRDZWxsRGF0YShzZXR0aW5ncywgcm93LCBjb2x1bW4pO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjZWxscygpLmNhY2hlKCknLCAnY2VsbCgpLmNhY2hlKCknLCBmdW5jdGlvbiAodHlwZSkge1xuICAgIHR5cGUgPSB0eXBlID09PSAnc2VhcmNoJyA/ICdfYUZpbHRlckRhdGEnIDogJ19hU29ydERhdGEnO1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCdjZWxsJywgZnVuY3Rpb24gKHNldHRpbmdzLCByb3csIGNvbHVtbikge1xuICAgICAgcmV0dXJuIHNldHRpbmdzLmFvRGF0YVtyb3ddW3R5cGVdW2NvbHVtbl07XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NlbGxzKCkucmVuZGVyKCknLCAnY2VsbCgpLnJlbmRlcigpJywgZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY2VsbCcsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93LCBjb2x1bW4pIHtcbiAgICAgIHJldHVybiBfZm5HZXRDZWxsRGF0YShzZXR0aW5ncywgcm93LCBjb2x1bW4sIHR5cGUpO1xuICAgIH0sIDEpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyUGx1cmFsKCdjZWxscygpLmluZGV4ZXMoKScsICdjZWxsKCkuaW5kZXgoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY2VsbCcsIGZ1bmN0aW9uIChzZXR0aW5ncywgcm93LCBjb2x1bW4pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJvdzogcm93LFxuICAgICAgICBjb2x1bW46IGNvbHVtbixcbiAgICAgICAgY29sdW1uVmlzaWJsZTogX2ZuQ29sdW1uSW5kZXhUb1Zpc2libGUoc2V0dGluZ3MsIGNvbHVtbilcbiAgICAgIH07XG4gICAgfSwgMSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NlbGxzKCkuaW52YWxpZGF0ZSgpJywgJ2NlbGwoKS5pbnZhbGlkYXRlKCknLCBmdW5jdGlvbiAoc3JjKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ2NlbGwnLCBmdW5jdGlvbiAoc2V0dGluZ3MsIHJvdywgY29sdW1uKSB7XG4gICAgICBfZm5JbnZhbGlkYXRlKHNldHRpbmdzLCByb3csIHNyYywgY29sdW1uKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignY2VsbCgpJywgZnVuY3Rpb24gKHJvd1NlbGVjdG9yLCBjb2x1bW5TZWxlY3Rvciwgb3B0cykge1xuICAgIHJldHVybiBfc2VsZWN0b3JfZmlyc3QodGhpcy5jZWxscyhyb3dTZWxlY3RvciwgY29sdW1uU2VsZWN0b3IsIG9wdHMpKTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignY2VsbCgpLmRhdGEoKScsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcbiAgICB2YXIgY2VsbCA9IHRoaXNbMF07XG5cbiAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gY3R4Lmxlbmd0aCAmJiBjZWxsLmxlbmd0aCA/IF9mbkdldENlbGxEYXRhKGN0eFswXSwgY2VsbFswXS5yb3csIGNlbGxbMF0uY29sdW1uKSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBfZm5TZXRDZWxsRGF0YShjdHhbMF0sIGNlbGxbMF0ucm93LCBjZWxsWzBdLmNvbHVtbiwgZGF0YSk7XG5cbiAgICBfZm5JbnZhbGlkYXRlKGN0eFswXSwgY2VsbFswXS5yb3csICdkYXRhJywgY2VsbFswXS5jb2x1bW4pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ29yZGVyKCknLCBmdW5jdGlvbiAob3JkZXIsIGRpcikge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAob3JkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGN0eC5sZW5ndGggIT09IDAgPyBjdHhbMF0uYWFTb3J0aW5nIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3JkZXIgPT09ICdudW1iZXInKSB7XG4gICAgICBvcmRlciA9IFtbb3JkZXIsIGRpcl1dO1xuICAgIH0gZWxzZSBpZiAob3JkZXIubGVuZ3RoICYmICEkLmlzQXJyYXkob3JkZXJbMF0pKSB7XG4gICAgICBvcmRlciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBzZXR0aW5ncy5hYVNvcnRpbmcgPSBvcmRlci5zbGljZSgpO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdvcmRlci5saXN0ZW5lcigpJywgZnVuY3Rpb24gKG5vZGUsIGNvbHVtbiwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIF9mblNvcnRBdHRhY2hMaXN0ZW5lcihzZXR0aW5ncywgbm9kZSwgY29sdW1uLCBjYWxsYmFjayk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ29yZGVyLmZpeGVkKCknLCBmdW5jdGlvbiAoc2V0KSB7XG4gICAgaWYgKCFzZXQpIHtcbiAgICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG4gICAgICB2YXIgZml4ZWQgPSBjdHgubGVuZ3RoID8gY3R4WzBdLmFhU29ydGluZ0ZpeGVkIDogdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuICQuaXNBcnJheShmaXhlZCkgPyB7XG4gICAgICAgIHByZTogZml4ZWRcbiAgICAgIH0gOiBmaXhlZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIHNldHRpbmdzLmFhU29ydGluZ0ZpeGVkID0gJC5leHRlbmQodHJ1ZSwge30sIHNldCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoWydjb2x1bW5zKCkub3JkZXIoKScsICdjb2x1bW4oKS5vcmRlcigpJ10sIGZ1bmN0aW9uIChkaXIpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzLCBpKSB7XG4gICAgICB2YXIgc29ydCA9IFtdO1xuICAgICAgJC5lYWNoKHRoYXRbaV0sIGZ1bmN0aW9uIChqLCBjb2wpIHtcbiAgICAgICAgc29ydC5wdXNoKFtjb2wsIGRpcl0pO1xuICAgICAgfSk7XG4gICAgICBzZXR0aW5ncy5hYVNvcnRpbmcgPSBzb3J0O1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdzZWFyY2goKScsIGZ1bmN0aW9uIChpbnB1dCwgcmVnZXgsIHNtYXJ0LCBjYXNlSW5zZW4pIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKGlucHV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBjdHgubGVuZ3RoICE9PSAwID8gY3R4WzBdLm9QcmV2aW91c1NlYXJjaC5zU2VhcmNoIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgaWYgKCFzZXR0aW5ncy5vRmVhdHVyZXMuYkZpbHRlcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF9mbkZpbHRlckNvbXBsZXRlKHNldHRpbmdzLCAkLmV4dGVuZCh7fSwgc2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoLCB7XG4gICAgICAgIFwic1NlYXJjaFwiOiBpbnB1dCArIFwiXCIsXG4gICAgICAgIFwiYlJlZ2V4XCI6IHJlZ2V4ID09PSBudWxsID8gZmFsc2UgOiByZWdleCxcbiAgICAgICAgXCJiU21hcnRcIjogc21hcnQgPT09IG51bGwgPyB0cnVlIDogc21hcnQsXG4gICAgICAgIFwiYkNhc2VJbnNlbnNpdGl2ZVwiOiBjYXNlSW5zZW4gPT09IG51bGwgPyB0cnVlIDogY2FzZUluc2VuXG4gICAgICB9KSwgMSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXJQbHVyYWwoJ2NvbHVtbnMoKS5zZWFyY2goKScsICdjb2x1bW4oKS5zZWFyY2goKScsIGZ1bmN0aW9uIChpbnB1dCwgcmVnZXgsIHNtYXJ0LCBjYXNlSW5zZW4pIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcignY29sdW1uJywgZnVuY3Rpb24gKHNldHRpbmdzLCBjb2x1bW4pIHtcbiAgICAgIHZhciBwcmVTZWFyY2ggPSBzZXR0aW5ncy5hb1ByZVNlYXJjaENvbHM7XG5cbiAgICAgIGlmIChpbnB1dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBwcmVTZWFyY2hbY29sdW1uXS5zU2VhcmNoO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXNldHRpbmdzLm9GZWF0dXJlcy5iRmlsdGVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJC5leHRlbmQocHJlU2VhcmNoW2NvbHVtbl0sIHtcbiAgICAgICAgXCJzU2VhcmNoXCI6IGlucHV0ICsgXCJcIixcbiAgICAgICAgXCJiUmVnZXhcIjogcmVnZXggPT09IG51bGwgPyBmYWxzZSA6IHJlZ2V4LFxuICAgICAgICBcImJTbWFydFwiOiBzbWFydCA9PT0gbnVsbCA/IHRydWUgOiBzbWFydCxcbiAgICAgICAgXCJiQ2FzZUluc2Vuc2l0aXZlXCI6IGNhc2VJbnNlbiA9PT0gbnVsbCA/IHRydWUgOiBjYXNlSW5zZW5cbiAgICAgIH0pO1xuXG4gICAgICBfZm5GaWx0ZXJDb21wbGV0ZShzZXR0aW5ncywgc2V0dGluZ3Mub1ByZXZpb3VzU2VhcmNoLCAxKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3Rlcignc3RhdGUoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0Lmxlbmd0aCA/IHRoaXMuY29udGV4dFswXS5vU2F2ZWRTdGF0ZSA6IG51bGw7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ3N0YXRlLmNsZWFyKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBzZXR0aW5ncy5mblN0YXRlU2F2ZUNhbGxiYWNrLmNhbGwoc2V0dGluZ3Mub0luc3RhbmNlLCBzZXR0aW5ncywge30pO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdzdGF0ZS5sb2FkZWQoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0Lmxlbmd0aCA/IHRoaXMuY29udGV4dFswXS5vTG9hZGVkU3RhdGUgOiBudWxsO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdzdGF0ZS5zYXZlKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgICBfZm5TYXZlU3RhdGUoc2V0dGluZ3MpO1xuICAgIH0pO1xuICB9KTtcblxuICBEYXRhVGFibGUudmVyc2lvbkNoZWNrID0gRGF0YVRhYmxlLmZuVmVyc2lvbkNoZWNrID0gZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgICB2YXIgYVRoaXMgPSBEYXRhVGFibGUudmVyc2lvbi5zcGxpdCgnLicpO1xuICAgIHZhciBhVGhhdCA9IHZlcnNpb24uc3BsaXQoJy4nKTtcbiAgICB2YXIgaVRoaXMsIGlUaGF0O1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSBhVGhhdC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgIGlUaGlzID0gcGFyc2VJbnQoYVRoaXNbaV0sIDEwKSB8fCAwO1xuICAgICAgaVRoYXQgPSBwYXJzZUludChhVGhhdFtpXSwgMTApIHx8IDA7XG5cbiAgICAgIGlmIChpVGhpcyA9PT0gaVRoYXQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpVGhpcyA+IGlUaGF0O1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIERhdGFUYWJsZS5pc0RhdGFUYWJsZSA9IERhdGFUYWJsZS5mbklzRGF0YVRhYmxlID0gZnVuY3Rpb24gKHRhYmxlKSB7XG4gICAgdmFyIHQgPSAkKHRhYmxlKS5nZXQoMCk7XG4gICAgdmFyIGlzID0gZmFsc2U7XG5cbiAgICBpZiAodGFibGUgaW5zdGFuY2VvZiBEYXRhVGFibGUuQXBpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAkLmVhY2goRGF0YVRhYmxlLnNldHRpbmdzLCBmdW5jdGlvbiAoaSwgbykge1xuICAgICAgdmFyIGhlYWQgPSBvLm5TY3JvbGxIZWFkID8gJCgndGFibGUnLCBvLm5TY3JvbGxIZWFkKVswXSA6IG51bGw7XG4gICAgICB2YXIgZm9vdCA9IG8ublNjcm9sbEZvb3QgPyAkKCd0YWJsZScsIG8ublNjcm9sbEZvb3QpWzBdIDogbnVsbDtcblxuICAgICAgaWYgKG8ublRhYmxlID09PSB0IHx8IGhlYWQgPT09IHQgfHwgZm9vdCA9PT0gdCkge1xuICAgICAgICBpcyA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGlzO1xuICB9O1xuXG4gIERhdGFUYWJsZS50YWJsZXMgPSBEYXRhVGFibGUuZm5UYWJsZXMgPSBmdW5jdGlvbiAodmlzaWJsZSkge1xuICAgIHZhciBhcGkgPSBmYWxzZTtcblxuICAgIGlmICgkLmlzUGxhaW5PYmplY3QodmlzaWJsZSkpIHtcbiAgICAgIGFwaSA9IHZpc2libGUuYXBpO1xuICAgICAgdmlzaWJsZSA9IHZpc2libGUudmlzaWJsZTtcbiAgICB9XG5cbiAgICB2YXIgYSA9ICQubWFwKERhdGFUYWJsZS5zZXR0aW5ncywgZnVuY3Rpb24gKG8pIHtcbiAgICAgIGlmICghdmlzaWJsZSB8fCB2aXNpYmxlICYmICQoby5uVGFibGUpLmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgIHJldHVybiBvLm5UYWJsZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYXBpID8gbmV3IF9BcGkyKGEpIDogYTtcbiAgfTtcblxuICBEYXRhVGFibGUuY2FtZWxUb0h1bmdhcmlhbiA9IF9mbkNhbWVsVG9IdW5nYXJpYW47XG5cbiAgX2FwaV9yZWdpc3RlcignJCgpJywgZnVuY3Rpb24gKHNlbGVjdG9yLCBvcHRzKSB7XG4gICAgdmFyIHJvd3MgPSB0aGlzLnJvd3Mob3B0cykubm9kZXMoKSxcbiAgICAgICAganFSb3dzID0gJChyb3dzKTtcbiAgICByZXR1cm4gJChbXS5jb25jYXQoanFSb3dzLmZpbHRlcihzZWxlY3RvcikudG9BcnJheSgpLCBqcVJvd3MuZmluZChzZWxlY3RvcikudG9BcnJheSgpKSk7XG4gIH0pO1xuXG4gICQuZWFjaChbJ29uJywgJ29uZScsICdvZmYnXSwgZnVuY3Rpb24gKGksIGtleSkge1xuICAgIF9hcGlfcmVnaXN0ZXIoa2V5ICsgJygpJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgYXJnc1swXSA9ICQubWFwKGFyZ3NbMF0uc3BsaXQoL1xccy8pLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICByZXR1cm4gIWUubWF0Y2goL1xcLmR0XFxiLykgPyBlICsgJy5kdCcgOiBlO1xuICAgICAgfSkuam9pbignICcpO1xuICAgICAgdmFyIGluc3QgPSAkKHRoaXMudGFibGVzKCkubm9kZXMoKSk7XG4gICAgICBpbnN0W2tleV0uYXBwbHkoaW5zdCwgYXJncyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignY2xlYXIoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIF9mbkNsZWFyVGFibGUoc2V0dGluZ3MpO1xuICAgIH0pO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdzZXR0aW5ncygpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgX0FwaTIodGhpcy5jb250ZXh0LCB0aGlzLmNvbnRleHQpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdpbml0KCknLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcbiAgICByZXR1cm4gY3R4Lmxlbmd0aCA/IGN0eFswXS5vSW5pdCA6IG51bGw7XG4gIH0pO1xuXG4gIF9hcGlfcmVnaXN0ZXIoJ2RhdGEoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgIHJldHVybiBfcGx1Y2soc2V0dGluZ3MuYW9EYXRhLCAnX2FEYXRhJyk7XG4gICAgfSkuZmxhdHRlbigpO1xuICB9KTtcblxuICBfYXBpX3JlZ2lzdGVyKCdkZXN0cm95KCknLCBmdW5jdGlvbiAocmVtb3ZlKSB7XG4gICAgcmVtb3ZlID0gcmVtb3ZlIHx8IGZhbHNlO1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgdmFyIG9yaWcgPSBzZXR0aW5ncy5uVGFibGVXcmFwcGVyLnBhcmVudE5vZGU7XG4gICAgICB2YXIgY2xhc3NlcyA9IHNldHRpbmdzLm9DbGFzc2VzO1xuICAgICAgdmFyIHRhYmxlID0gc2V0dGluZ3MublRhYmxlO1xuICAgICAgdmFyIHRib2R5ID0gc2V0dGluZ3MublRCb2R5O1xuICAgICAgdmFyIHRoZWFkID0gc2V0dGluZ3MublRIZWFkO1xuICAgICAgdmFyIHRmb290ID0gc2V0dGluZ3MublRGb290O1xuICAgICAgdmFyIGpxVGFibGUgPSAkKHRhYmxlKTtcbiAgICAgIHZhciBqcVRib2R5ID0gJCh0Ym9keSk7XG4gICAgICB2YXIganFXcmFwcGVyID0gJChzZXR0aW5ncy5uVGFibGVXcmFwcGVyKTtcbiAgICAgIHZhciByb3dzID0gJC5tYXAoc2V0dGluZ3MuYW9EYXRhLCBmdW5jdGlvbiAocikge1xuICAgICAgICByZXR1cm4gci5uVHI7XG4gICAgICB9KTtcbiAgICAgIHZhciBpLCBpZW47XG4gICAgICBzZXR0aW5ncy5iRGVzdHJveWluZyA9IHRydWU7XG5cbiAgICAgIF9mbkNhbGxiYWNrRmlyZShzZXR0aW5ncywgXCJhb0Rlc3Ryb3lDYWxsYmFja1wiLCBcImRlc3Ryb3lcIiwgW3NldHRpbmdzXSk7XG5cbiAgICAgIGlmICghcmVtb3ZlKSB7XG4gICAgICAgIG5ldyBfQXBpMihzZXR0aW5ncykuY29sdW1ucygpLnZpc2libGUodHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGpxV3JhcHBlci5vZmYoJy5EVCcpLmZpbmQoJzpub3QodGJvZHkgKiknKS5vZmYoJy5EVCcpO1xuICAgICAgJCh3aW5kb3cpLm9mZignLkRULScgKyBzZXR0aW5ncy5zSW5zdGFuY2UpO1xuXG4gICAgICBpZiAodGFibGUgIT0gdGhlYWQucGFyZW50Tm9kZSkge1xuICAgICAgICBqcVRhYmxlLmNoaWxkcmVuKCd0aGVhZCcpLmRldGFjaCgpO1xuICAgICAgICBqcVRhYmxlLmFwcGVuZCh0aGVhZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0Zm9vdCAmJiB0YWJsZSAhPSB0Zm9vdC5wYXJlbnROb2RlKSB7XG4gICAgICAgIGpxVGFibGUuY2hpbGRyZW4oJ3Rmb290JykuZGV0YWNoKCk7XG4gICAgICAgIGpxVGFibGUuYXBwZW5kKHRmb290KTtcbiAgICAgIH1cblxuICAgICAgc2V0dGluZ3MuYWFTb3J0aW5nID0gW107XG4gICAgICBzZXR0aW5ncy5hYVNvcnRpbmdGaXhlZCA9IFtdO1xuXG4gICAgICBfZm5Tb3J0aW5nQ2xhc3NlcyhzZXR0aW5ncyk7XG5cbiAgICAgICQocm93cykucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYXNTdHJpcGVDbGFzc2VzLmpvaW4oJyAnKSk7XG4gICAgICAkKCd0aCwgdGQnLCB0aGVhZCkucmVtb3ZlQ2xhc3MoY2xhc3Nlcy5zU29ydGFibGUgKyAnICcgKyBjbGFzc2VzLnNTb3J0YWJsZUFzYyArICcgJyArIGNsYXNzZXMuc1NvcnRhYmxlRGVzYyArICcgJyArIGNsYXNzZXMuc1NvcnRhYmxlTm9uZSk7XG4gICAgICBqcVRib2R5LmNoaWxkcmVuKCkuZGV0YWNoKCk7XG4gICAgICBqcVRib2R5LmFwcGVuZChyb3dzKTtcbiAgICAgIHZhciByZW1vdmVkTWV0aG9kID0gcmVtb3ZlID8gJ3JlbW92ZScgOiAnZGV0YWNoJztcbiAgICAgIGpxVGFibGVbcmVtb3ZlZE1ldGhvZF0oKTtcbiAgICAgIGpxV3JhcHBlcltyZW1vdmVkTWV0aG9kXSgpO1xuXG4gICAgICBpZiAoIXJlbW92ZSAmJiBvcmlnKSB7XG4gICAgICAgIG9yaWcuaW5zZXJ0QmVmb3JlKHRhYmxlLCBzZXR0aW5ncy5uVGFibGVSZWluc2VydEJlZm9yZSk7XG4gICAgICAgIGpxVGFibGUuY3NzKCd3aWR0aCcsIHNldHRpbmdzLnNEZXN0cm95V2lkdGgpLnJlbW92ZUNsYXNzKGNsYXNzZXMuc1RhYmxlKTtcbiAgICAgICAgaWVuID0gc2V0dGluZ3MuYXNEZXN0cm95U3RyaXBlcy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGllbikge1xuICAgICAgICAgIGpxVGJvZHkuY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKHNldHRpbmdzLmFzRGVzdHJveVN0cmlwZXNbaSAlIGllbl0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBpZHggPSAkLmluQXJyYXkoc2V0dGluZ3MsIERhdGFUYWJsZS5zZXR0aW5ncyk7XG5cbiAgICAgIGlmIChpZHggIT09IC0xKSB7XG4gICAgICAgIERhdGFUYWJsZS5zZXR0aW5ncy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgJC5lYWNoKFsnY29sdW1uJywgJ3JvdycsICdjZWxsJ10sIGZ1bmN0aW9uIChpLCB0eXBlKSB7XG4gICAgX2FwaV9yZWdpc3Rlcih0eXBlICsgJ3MoKS5ldmVyeSgpJywgZnVuY3Rpb24gKGZuKSB7XG4gICAgICB2YXIgb3B0cyA9IHRoaXMuc2VsZWN0b3Iub3B0cztcbiAgICAgIHZhciBhcGkgPSB0aGlzO1xuICAgICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IodHlwZSwgZnVuY3Rpb24gKHNldHRpbmdzLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0KSB7XG4gICAgICAgIGZuLmNhbGwoYXBpW3R5cGVdKGFyZzEsIHR5cGUgPT09ICdjZWxsJyA/IGFyZzIgOiBvcHRzLCB0eXBlID09PSAnY2VsbCcgPyBvcHRzIDogdW5kZWZpbmVkKSwgYXJnMSwgYXJnMiwgYXJnMywgYXJnNCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgX2FwaV9yZWdpc3RlcignaTE4bigpJywgZnVuY3Rpb24gKHRva2VuLCBkZWYsIHBsdXJhbCkge1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHRbMF07XG5cbiAgICB2YXIgcmVzb2x2ZWQgPSBfZm5HZXRPYmplY3REYXRhRm4odG9rZW4pKGN0eC5vTGFuZ3VhZ2UpO1xuXG4gICAgaWYgKHJlc29sdmVkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc29sdmVkID0gZGVmO1xuICAgIH1cblxuICAgIGlmIChwbHVyYWwgIT09IHVuZGVmaW5lZCAmJiAkLmlzUGxhaW5PYmplY3QocmVzb2x2ZWQpKSB7XG4gICAgICByZXNvbHZlZCA9IHJlc29sdmVkW3BsdXJhbF0gIT09IHVuZGVmaW5lZCA/IHJlc29sdmVkW3BsdXJhbF0gOiByZXNvbHZlZC5fO1xuICAgIH1cblxuICAgIHJldHVybiByZXNvbHZlZC5yZXBsYWNlKCclZCcsIHBsdXJhbCk7XG4gIH0pO1xuXG4gIERhdGFUYWJsZS52ZXJzaW9uID0gXCIxLjEwLjE4XCI7XG4gIERhdGFUYWJsZS5zZXR0aW5ncyA9IFtdO1xuICBEYXRhVGFibGUubW9kZWxzID0ge307XG4gIERhdGFUYWJsZS5tb2RlbHMub1NlYXJjaCA9IHtcbiAgICBcImJDYXNlSW5zZW5zaXRpdmVcIjogdHJ1ZSxcbiAgICBcInNTZWFyY2hcIjogXCJcIixcbiAgICBcImJSZWdleFwiOiBmYWxzZSxcbiAgICBcImJTbWFydFwiOiB0cnVlXG4gIH07XG4gIERhdGFUYWJsZS5tb2RlbHMub1JvdyA9IHtcbiAgICBcIm5UclwiOiBudWxsLFxuICAgIFwiYW5DZWxsc1wiOiBudWxsLFxuICAgIFwiX2FEYXRhXCI6IFtdLFxuICAgIFwiX2FTb3J0RGF0YVwiOiBudWxsLFxuICAgIFwiX2FGaWx0ZXJEYXRhXCI6IG51bGwsXG4gICAgXCJfc0ZpbHRlclJvd1wiOiBudWxsLFxuICAgIFwiX3NSb3dTdHJpcGVcIjogXCJcIixcbiAgICBcInNyY1wiOiBudWxsLFxuICAgIFwiaWR4XCI6IC0xXG4gIH07XG4gIERhdGFUYWJsZS5tb2RlbHMub0NvbHVtbiA9IHtcbiAgICBcImlkeFwiOiBudWxsLFxuICAgIFwiYURhdGFTb3J0XCI6IG51bGwsXG4gICAgXCJhc1NvcnRpbmdcIjogbnVsbCxcbiAgICBcImJTZWFyY2hhYmxlXCI6IG51bGwsXG4gICAgXCJiU29ydGFibGVcIjogbnVsbCxcbiAgICBcImJWaXNpYmxlXCI6IG51bGwsXG4gICAgXCJfc01hbnVhbFR5cGVcIjogbnVsbCxcbiAgICBcIl9iQXR0clNyY1wiOiBmYWxzZSxcbiAgICBcImZuQ3JlYXRlZENlbGxcIjogbnVsbCxcbiAgICBcImZuR2V0RGF0YVwiOiBudWxsLFxuICAgIFwiZm5TZXREYXRhXCI6IG51bGwsXG4gICAgXCJtRGF0YVwiOiBudWxsLFxuICAgIFwibVJlbmRlclwiOiBudWxsLFxuICAgIFwiblRoXCI6IG51bGwsXG4gICAgXCJuVGZcIjogbnVsbCxcbiAgICBcInNDbGFzc1wiOiBudWxsLFxuICAgIFwic0NvbnRlbnRQYWRkaW5nXCI6IG51bGwsXG4gICAgXCJzRGVmYXVsdENvbnRlbnRcIjogbnVsbCxcbiAgICBcInNOYW1lXCI6IG51bGwsXG4gICAgXCJzU29ydERhdGFUeXBlXCI6ICdzdGQnLFxuICAgIFwic1NvcnRpbmdDbGFzc1wiOiBudWxsLFxuICAgIFwic1NvcnRpbmdDbGFzc0pVSVwiOiBudWxsLFxuICAgIFwic1RpdGxlXCI6IG51bGwsXG4gICAgXCJzVHlwZVwiOiBudWxsLFxuICAgIFwic1dpZHRoXCI6IG51bGwsXG4gICAgXCJzV2lkdGhPcmlnXCI6IG51bGxcbiAgfTtcbiAgRGF0YVRhYmxlLmRlZmF1bHRzID0ge1xuICAgIFwiYWFEYXRhXCI6IG51bGwsXG4gICAgXCJhYVNvcnRpbmdcIjogW1swLCAnYXNjJ11dLFxuICAgIFwiYWFTb3J0aW5nRml4ZWRcIjogW10sXG4gICAgXCJhamF4XCI6IG51bGwsXG4gICAgXCJhTGVuZ3RoTWVudVwiOiBbMTAsIDI1LCA1MCwgMTAwXSxcbiAgICBcImFvQ29sdW1uc1wiOiBudWxsLFxuICAgIFwiYW9Db2x1bW5EZWZzXCI6IG51bGwsXG4gICAgXCJhb1NlYXJjaENvbHNcIjogW10sXG4gICAgXCJhc1N0cmlwZUNsYXNzZXNcIjogbnVsbCxcbiAgICBcImJBdXRvV2lkdGhcIjogdHJ1ZSxcbiAgICBcImJEZWZlclJlbmRlclwiOiBmYWxzZSxcbiAgICBcImJEZXN0cm95XCI6IGZhbHNlLFxuICAgIFwiYkZpbHRlclwiOiB0cnVlLFxuICAgIFwiYkluZm9cIjogdHJ1ZSxcbiAgICBcImJMZW5ndGhDaGFuZ2VcIjogdHJ1ZSxcbiAgICBcImJQYWdpbmF0ZVwiOiB0cnVlLFxuICAgIFwiYlByb2Nlc3NpbmdcIjogZmFsc2UsXG4gICAgXCJiUmV0cmlldmVcIjogZmFsc2UsXG4gICAgXCJiU2Nyb2xsQ29sbGFwc2VcIjogZmFsc2UsXG4gICAgXCJiU2VydmVyU2lkZVwiOiBmYWxzZSxcbiAgICBcImJTb3J0XCI6IHRydWUsXG4gICAgXCJiU29ydE11bHRpXCI6IHRydWUsXG4gICAgXCJiU29ydENlbGxzVG9wXCI6IGZhbHNlLFxuICAgIFwiYlNvcnRDbGFzc2VzXCI6IHRydWUsXG4gICAgXCJiU3RhdGVTYXZlXCI6IGZhbHNlLFxuICAgIFwiZm5DcmVhdGVkUm93XCI6IG51bGwsXG4gICAgXCJmbkRyYXdDYWxsYmFja1wiOiBudWxsLFxuICAgIFwiZm5Gb290ZXJDYWxsYmFja1wiOiBudWxsLFxuICAgIFwiZm5Gb3JtYXROdW1iZXJcIjogZnVuY3Rpb24gZm5Gb3JtYXROdW1iZXIodG9Gb3JtYXQpIHtcbiAgICAgIHJldHVybiB0b0Zvcm1hdC50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIHRoaXMub0xhbmd1YWdlLnNUaG91c2FuZHMpO1xuICAgIH0sXG4gICAgXCJmbkhlYWRlckNhbGxiYWNrXCI6IG51bGwsXG4gICAgXCJmbkluZm9DYWxsYmFja1wiOiBudWxsLFxuICAgIFwiZm5Jbml0Q29tcGxldGVcIjogbnVsbCxcbiAgICBcImZuUHJlRHJhd0NhbGxiYWNrXCI6IG51bGwsXG4gICAgXCJmblJvd0NhbGxiYWNrXCI6IG51bGwsXG4gICAgXCJmblNlcnZlckRhdGFcIjogbnVsbCxcbiAgICBcImZuU2VydmVyUGFyYW1zXCI6IG51bGwsXG4gICAgXCJmblN0YXRlTG9hZENhbGxiYWNrXCI6IGZ1bmN0aW9uIGZuU3RhdGVMb2FkQ2FsbGJhY2soc2V0dGluZ3MpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKChzZXR0aW5ncy5pU3RhdGVEdXJhdGlvbiA9PT0gLTEgPyBzZXNzaW9uU3RvcmFnZSA6IGxvY2FsU3RvcmFnZSkuZ2V0SXRlbSgnRGF0YVRhYmxlc18nICsgc2V0dGluZ3Muc0luc3RhbmNlICsgJ18nICsgbG9jYXRpb24ucGF0aG5hbWUpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfSxcbiAgICBcImZuU3RhdGVMb2FkUGFyYW1zXCI6IG51bGwsXG4gICAgXCJmblN0YXRlTG9hZGVkXCI6IG51bGwsXG4gICAgXCJmblN0YXRlU2F2ZUNhbGxiYWNrXCI6IGZ1bmN0aW9uIGZuU3RhdGVTYXZlQ2FsbGJhY2soc2V0dGluZ3MsIGRhdGEpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIChzZXR0aW5ncy5pU3RhdGVEdXJhdGlvbiA9PT0gLTEgPyBzZXNzaW9uU3RvcmFnZSA6IGxvY2FsU3RvcmFnZSkuc2V0SXRlbSgnRGF0YVRhYmxlc18nICsgc2V0dGluZ3Muc0luc3RhbmNlICsgJ18nICsgbG9jYXRpb24ucGF0aG5hbWUsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfSxcbiAgICBcImZuU3RhdGVTYXZlUGFyYW1zXCI6IG51bGwsXG4gICAgXCJpU3RhdGVEdXJhdGlvblwiOiA3MjAwLFxuICAgIFwiaURlZmVyTG9hZGluZ1wiOiBudWxsLFxuICAgIFwiaURpc3BsYXlMZW5ndGhcIjogMTAsXG4gICAgXCJpRGlzcGxheVN0YXJ0XCI6IDAsXG4gICAgXCJpVGFiSW5kZXhcIjogMCxcbiAgICBcIm9DbGFzc2VzXCI6IHt9LFxuICAgIFwib0xhbmd1YWdlXCI6IHtcbiAgICAgIFwib0FyaWFcIjoge1xuICAgICAgICBcInNTb3J0QXNjZW5kaW5nXCI6IFwiOiBhY3RpdmF0ZSB0byBzb3J0IGNvbHVtbiBhc2NlbmRpbmdcIixcbiAgICAgICAgXCJzU29ydERlc2NlbmRpbmdcIjogXCI6IGFjdGl2YXRlIHRvIHNvcnQgY29sdW1uIGRlc2NlbmRpbmdcIlxuICAgICAgfSxcbiAgICAgIFwib1BhZ2luYXRlXCI6IHtcbiAgICAgICAgXCJzRmlyc3RcIjogXCJGaXJzdFwiLFxuICAgICAgICBcInNMYXN0XCI6IFwiTGFzdFwiLFxuICAgICAgICBcInNOZXh0XCI6IFwiTmV4dFwiLFxuICAgICAgICBcInNQcmV2aW91c1wiOiBcIlByZXZpb3VzXCJcbiAgICAgIH0sXG4gICAgICBcInNFbXB0eVRhYmxlXCI6IFwiTm8gZGF0YSBhdmFpbGFibGUgaW4gdGFibGVcIixcbiAgICAgIFwic0luZm9cIjogXCJTaG93aW5nIF9TVEFSVF8gdG8gX0VORF8gb2YgX1RPVEFMXyBlbnRyaWVzXCIsXG4gICAgICBcInNJbmZvRW1wdHlcIjogXCJTaG93aW5nIDAgdG8gMCBvZiAwIGVudHJpZXNcIixcbiAgICAgIFwic0luZm9GaWx0ZXJlZFwiOiBcIihmaWx0ZXJlZCBmcm9tIF9NQVhfIHRvdGFsIGVudHJpZXMpXCIsXG4gICAgICBcInNJbmZvUG9zdEZpeFwiOiBcIlwiLFxuICAgICAgXCJzRGVjaW1hbFwiOiBcIlwiLFxuICAgICAgXCJzVGhvdXNhbmRzXCI6IFwiLFwiLFxuICAgICAgXCJzTGVuZ3RoTWVudVwiOiBcIlNob3cgX01FTlVfIGVudHJpZXNcIixcbiAgICAgIFwic0xvYWRpbmdSZWNvcmRzXCI6IFwiTG9hZGluZy4uLlwiLFxuICAgICAgXCJzUHJvY2Vzc2luZ1wiOiBcIlByb2Nlc3NpbmcuLi5cIixcbiAgICAgIFwic1NlYXJjaFwiOiBcIlNlYXJjaDpcIixcbiAgICAgIFwic1NlYXJjaFBsYWNlaG9sZGVyXCI6IFwiXCIsXG4gICAgICBcInNVcmxcIjogXCJcIixcbiAgICAgIFwic1plcm9SZWNvcmRzXCI6IFwiTm8gbWF0Y2hpbmcgcmVjb3JkcyBmb3VuZFwiXG4gICAgfSxcbiAgICBcIm9TZWFyY2hcIjogJC5leHRlbmQoe30sIERhdGFUYWJsZS5tb2RlbHMub1NlYXJjaCksXG4gICAgXCJzQWpheERhdGFQcm9wXCI6IFwiZGF0YVwiLFxuICAgIFwic0FqYXhTb3VyY2VcIjogbnVsbCxcbiAgICBcInNEb21cIjogXCJsZnJ0aXBcIixcbiAgICBcInNlYXJjaERlbGF5XCI6IG51bGwsXG4gICAgXCJzUGFnaW5hdGlvblR5cGVcIjogXCJzaW1wbGVfbnVtYmVyc1wiLFxuICAgIFwic1Njcm9sbFhcIjogXCJcIixcbiAgICBcInNTY3JvbGxYSW5uZXJcIjogXCJcIixcbiAgICBcInNTY3JvbGxZXCI6IFwiXCIsXG4gICAgXCJzU2VydmVyTWV0aG9kXCI6IFwiR0VUXCIsXG4gICAgXCJyZW5kZXJlclwiOiBudWxsLFxuICAgIFwicm93SWRcIjogXCJEVF9Sb3dJZFwiXG4gIH07XG5cbiAgX2ZuSHVuZ2FyaWFuTWFwKERhdGFUYWJsZS5kZWZhdWx0cyk7XG5cbiAgRGF0YVRhYmxlLmRlZmF1bHRzLmNvbHVtbiA9IHtcbiAgICBcImFEYXRhU29ydFwiOiBudWxsLFxuICAgIFwiaURhdGFTb3J0XCI6IC0xLFxuICAgIFwiYXNTb3J0aW5nXCI6IFsnYXNjJywgJ2Rlc2MnXSxcbiAgICBcImJTZWFyY2hhYmxlXCI6IHRydWUsXG4gICAgXCJiU29ydGFibGVcIjogdHJ1ZSxcbiAgICBcImJWaXNpYmxlXCI6IHRydWUsXG4gICAgXCJmbkNyZWF0ZWRDZWxsXCI6IG51bGwsXG4gICAgXCJtRGF0YVwiOiBudWxsLFxuICAgIFwibVJlbmRlclwiOiBudWxsLFxuICAgIFwic0NlbGxUeXBlXCI6IFwidGRcIixcbiAgICBcInNDbGFzc1wiOiBcIlwiLFxuICAgIFwic0NvbnRlbnRQYWRkaW5nXCI6IFwiXCIsXG4gICAgXCJzRGVmYXVsdENvbnRlbnRcIjogbnVsbCxcbiAgICBcInNOYW1lXCI6IFwiXCIsXG4gICAgXCJzU29ydERhdGFUeXBlXCI6IFwic3RkXCIsXG4gICAgXCJzVGl0bGVcIjogbnVsbCxcbiAgICBcInNUeXBlXCI6IG51bGwsXG4gICAgXCJzV2lkdGhcIjogbnVsbFxuICB9O1xuXG4gIF9mbkh1bmdhcmlhbk1hcChEYXRhVGFibGUuZGVmYXVsdHMuY29sdW1uKTtcblxuICBEYXRhVGFibGUubW9kZWxzLm9TZXR0aW5ncyA9IHtcbiAgICBcIm9GZWF0dXJlc1wiOiB7XG4gICAgICBcImJBdXRvV2lkdGhcIjogbnVsbCxcbiAgICAgIFwiYkRlZmVyUmVuZGVyXCI6IG51bGwsXG4gICAgICBcImJGaWx0ZXJcIjogbnVsbCxcbiAgICAgIFwiYkluZm9cIjogbnVsbCxcbiAgICAgIFwiYkxlbmd0aENoYW5nZVwiOiBudWxsLFxuICAgICAgXCJiUGFnaW5hdGVcIjogbnVsbCxcbiAgICAgIFwiYlByb2Nlc3NpbmdcIjogbnVsbCxcbiAgICAgIFwiYlNlcnZlclNpZGVcIjogbnVsbCxcbiAgICAgIFwiYlNvcnRcIjogbnVsbCxcbiAgICAgIFwiYlNvcnRNdWx0aVwiOiBudWxsLFxuICAgICAgXCJiU29ydENsYXNzZXNcIjogbnVsbCxcbiAgICAgIFwiYlN0YXRlU2F2ZVwiOiBudWxsXG4gICAgfSxcbiAgICBcIm9TY3JvbGxcIjoge1xuICAgICAgXCJiQ29sbGFwc2VcIjogbnVsbCxcbiAgICAgIFwiaUJhcldpZHRoXCI6IDAsXG4gICAgICBcInNYXCI6IG51bGwsXG4gICAgICBcInNYSW5uZXJcIjogbnVsbCxcbiAgICAgIFwic1lcIjogbnVsbFxuICAgIH0sXG4gICAgXCJvTGFuZ3VhZ2VcIjoge1xuICAgICAgXCJmbkluZm9DYWxsYmFja1wiOiBudWxsXG4gICAgfSxcbiAgICBcIm9Ccm93c2VyXCI6IHtcbiAgICAgIFwiYlNjcm9sbE92ZXJzaXplXCI6IGZhbHNlLFxuICAgICAgXCJiU2Nyb2xsYmFyTGVmdFwiOiBmYWxzZSxcbiAgICAgIFwiYkJvdW5kaW5nXCI6IGZhbHNlLFxuICAgICAgXCJiYXJXaWR0aFwiOiAwXG4gICAgfSxcbiAgICBcImFqYXhcIjogbnVsbCxcbiAgICBcImFhbkZlYXR1cmVzXCI6IFtdLFxuICAgIFwiYW9EYXRhXCI6IFtdLFxuICAgIFwiYWlEaXNwbGF5XCI6IFtdLFxuICAgIFwiYWlEaXNwbGF5TWFzdGVyXCI6IFtdLFxuICAgIFwiYUlkc1wiOiB7fSxcbiAgICBcImFvQ29sdW1uc1wiOiBbXSxcbiAgICBcImFvSGVhZGVyXCI6IFtdLFxuICAgIFwiYW9Gb290ZXJcIjogW10sXG4gICAgXCJvUHJldmlvdXNTZWFyY2hcIjoge30sXG4gICAgXCJhb1ByZVNlYXJjaENvbHNcIjogW10sXG4gICAgXCJhYVNvcnRpbmdcIjogbnVsbCxcbiAgICBcImFhU29ydGluZ0ZpeGVkXCI6IFtdLFxuICAgIFwiYXNTdHJpcGVDbGFzc2VzXCI6IG51bGwsXG4gICAgXCJhc0Rlc3Ryb3lTdHJpcGVzXCI6IFtdLFxuICAgIFwic0Rlc3Ryb3lXaWR0aFwiOiAwLFxuICAgIFwiYW9Sb3dDYWxsYmFja1wiOiBbXSxcbiAgICBcImFvSGVhZGVyQ2FsbGJhY2tcIjogW10sXG4gICAgXCJhb0Zvb3RlckNhbGxiYWNrXCI6IFtdLFxuICAgIFwiYW9EcmF3Q2FsbGJhY2tcIjogW10sXG4gICAgXCJhb1Jvd0NyZWF0ZWRDYWxsYmFja1wiOiBbXSxcbiAgICBcImFvUHJlRHJhd0NhbGxiYWNrXCI6IFtdLFxuICAgIFwiYW9Jbml0Q29tcGxldGVcIjogW10sXG4gICAgXCJhb1N0YXRlU2F2ZVBhcmFtc1wiOiBbXSxcbiAgICBcImFvU3RhdGVMb2FkUGFyYW1zXCI6IFtdLFxuICAgIFwiYW9TdGF0ZUxvYWRlZFwiOiBbXSxcbiAgICBcInNUYWJsZUlkXCI6IFwiXCIsXG4gICAgXCJuVGFibGVcIjogbnVsbCxcbiAgICBcIm5USGVhZFwiOiBudWxsLFxuICAgIFwiblRGb290XCI6IG51bGwsXG4gICAgXCJuVEJvZHlcIjogbnVsbCxcbiAgICBcIm5UYWJsZVdyYXBwZXJcIjogbnVsbCxcbiAgICBcImJEZWZlckxvYWRpbmdcIjogZmFsc2UsXG4gICAgXCJiSW5pdGlhbGlzZWRcIjogZmFsc2UsXG4gICAgXCJhb09wZW5Sb3dzXCI6IFtdLFxuICAgIFwic0RvbVwiOiBudWxsLFxuICAgIFwic2VhcmNoRGVsYXlcIjogbnVsbCxcbiAgICBcInNQYWdpbmF0aW9uVHlwZVwiOiBcInR3b19idXR0b25cIixcbiAgICBcImlTdGF0ZUR1cmF0aW9uXCI6IDAsXG4gICAgXCJhb1N0YXRlU2F2ZVwiOiBbXSxcbiAgICBcImFvU3RhdGVMb2FkXCI6IFtdLFxuICAgIFwib1NhdmVkU3RhdGVcIjogbnVsbCxcbiAgICBcIm9Mb2FkZWRTdGF0ZVwiOiBudWxsLFxuICAgIFwic0FqYXhTb3VyY2VcIjogbnVsbCxcbiAgICBcInNBamF4RGF0YVByb3BcIjogbnVsbCxcbiAgICBcImJBamF4RGF0YUdldFwiOiB0cnVlLFxuICAgIFwianFYSFJcIjogbnVsbCxcbiAgICBcImpzb25cIjogdW5kZWZpbmVkLFxuICAgIFwib0FqYXhEYXRhXCI6IHVuZGVmaW5lZCxcbiAgICBcImZuU2VydmVyRGF0YVwiOiBudWxsLFxuICAgIFwiYW9TZXJ2ZXJQYXJhbXNcIjogW10sXG4gICAgXCJzU2VydmVyTWV0aG9kXCI6IG51bGwsXG4gICAgXCJmbkZvcm1hdE51bWJlclwiOiBudWxsLFxuICAgIFwiYUxlbmd0aE1lbnVcIjogbnVsbCxcbiAgICBcImlEcmF3XCI6IDAsXG4gICAgXCJiRHJhd2luZ1wiOiBmYWxzZSxcbiAgICBcImlEcmF3RXJyb3JcIjogLTEsXG4gICAgXCJfaURpc3BsYXlMZW5ndGhcIjogMTAsXG4gICAgXCJfaURpc3BsYXlTdGFydFwiOiAwLFxuICAgIFwiX2lSZWNvcmRzVG90YWxcIjogMCxcbiAgICBcIl9pUmVjb3Jkc0Rpc3BsYXlcIjogMCxcbiAgICBcIm9DbGFzc2VzXCI6IHt9LFxuICAgIFwiYkZpbHRlcmVkXCI6IGZhbHNlLFxuICAgIFwiYlNvcnRlZFwiOiBmYWxzZSxcbiAgICBcImJTb3J0Q2VsbHNUb3BcIjogbnVsbCxcbiAgICBcIm9Jbml0XCI6IG51bGwsXG4gICAgXCJhb0Rlc3Ryb3lDYWxsYmFja1wiOiBbXSxcbiAgICBcImZuUmVjb3Jkc1RvdGFsXCI6IGZ1bmN0aW9uIGZuUmVjb3Jkc1RvdGFsKCkge1xuICAgICAgcmV0dXJuIF9mbkRhdGFTb3VyY2UodGhpcykgPT0gJ3NzcCcgPyB0aGlzLl9pUmVjb3Jkc1RvdGFsICogMSA6IHRoaXMuYWlEaXNwbGF5TWFzdGVyLmxlbmd0aDtcbiAgICB9LFxuICAgIFwiZm5SZWNvcmRzRGlzcGxheVwiOiBmdW5jdGlvbiBmblJlY29yZHNEaXNwbGF5KCkge1xuICAgICAgcmV0dXJuIF9mbkRhdGFTb3VyY2UodGhpcykgPT0gJ3NzcCcgPyB0aGlzLl9pUmVjb3Jkc0Rpc3BsYXkgKiAxIDogdGhpcy5haURpc3BsYXkubGVuZ3RoO1xuICAgIH0sXG4gICAgXCJmbkRpc3BsYXlFbmRcIjogZnVuY3Rpb24gZm5EaXNwbGF5RW5kKCkge1xuICAgICAgdmFyIGxlbiA9IHRoaXMuX2lEaXNwbGF5TGVuZ3RoLFxuICAgICAgICAgIHN0YXJ0ID0gdGhpcy5faURpc3BsYXlTdGFydCxcbiAgICAgICAgICBjYWxjID0gc3RhcnQgKyBsZW4sXG4gICAgICAgICAgcmVjb3JkcyA9IHRoaXMuYWlEaXNwbGF5Lmxlbmd0aCxcbiAgICAgICAgICBmZWF0dXJlcyA9IHRoaXMub0ZlYXR1cmVzLFxuICAgICAgICAgIHBhZ2luYXRlID0gZmVhdHVyZXMuYlBhZ2luYXRlO1xuXG4gICAgICBpZiAoZmVhdHVyZXMuYlNlcnZlclNpZGUpIHtcbiAgICAgICAgcmV0dXJuIHBhZ2luYXRlID09PSBmYWxzZSB8fCBsZW4gPT09IC0xID8gc3RhcnQgKyByZWNvcmRzIDogTWF0aC5taW4oc3RhcnQgKyBsZW4sIHRoaXMuX2lSZWNvcmRzRGlzcGxheSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gIXBhZ2luYXRlIHx8IGNhbGMgPiByZWNvcmRzIHx8IGxlbiA9PT0gLTEgPyByZWNvcmRzIDogY2FsYztcbiAgICAgIH1cbiAgICB9LFxuICAgIFwib0luc3RhbmNlXCI6IG51bGwsXG4gICAgXCJzSW5zdGFuY2VcIjogbnVsbCxcbiAgICBcImlUYWJJbmRleFwiOiAwLFxuICAgIFwiblNjcm9sbEhlYWRcIjogbnVsbCxcbiAgICBcIm5TY3JvbGxGb290XCI6IG51bGwsXG4gICAgXCJhTGFzdFNvcnRcIjogW10sXG4gICAgXCJvUGx1Z2luc1wiOiB7fSxcbiAgICBcInJvd0lkRm5cIjogbnVsbCxcbiAgICBcInJvd0lkXCI6IG51bGxcbiAgfTtcbiAgRGF0YVRhYmxlLmV4dCA9IF9leHQgPSB7XG4gICAgYnV0dG9uczoge30sXG4gICAgY2xhc3Nlczoge30sXG4gICAgYnVpbGQ6IFwiZHQvZHQtMS4xMC4xOFwiLFxuICAgIGVyck1vZGU6IFwiYWxlcnRcIixcbiAgICBmZWF0dXJlOiBbXSxcbiAgICBzZWFyY2g6IFtdLFxuICAgIHNlbGVjdG9yOiB7XG4gICAgICBjZWxsOiBbXSxcbiAgICAgIGNvbHVtbjogW10sXG4gICAgICByb3c6IFtdXG4gICAgfSxcbiAgICBpbnRlcm5hbDoge30sXG4gICAgbGVnYWN5OiB7XG4gICAgICBhamF4OiBudWxsXG4gICAgfSxcbiAgICBwYWdlcjoge30sXG4gICAgcmVuZGVyZXI6IHtcbiAgICAgIHBhZ2VCdXR0b246IHt9LFxuICAgICAgaGVhZGVyOiB7fVxuICAgIH0sXG4gICAgb3JkZXI6IHt9LFxuICAgIHR5cGU6IHtcbiAgICAgIGRldGVjdDogW10sXG4gICAgICBzZWFyY2g6IHt9LFxuICAgICAgb3JkZXI6IHt9XG4gICAgfSxcbiAgICBfdW5pcXVlOiAwLFxuICAgIGZuVmVyc2lvbkNoZWNrOiBEYXRhVGFibGUuZm5WZXJzaW9uQ2hlY2ssXG4gICAgaUFwaUluZGV4OiAwLFxuICAgIG9KVUlDbGFzc2VzOiB7fSxcbiAgICBzVmVyc2lvbjogRGF0YVRhYmxlLnZlcnNpb25cbiAgfTtcbiAgJC5leHRlbmQoX2V4dCwge1xuICAgIGFmbkZpbHRlcmluZzogX2V4dC5zZWFyY2gsXG4gICAgYVR5cGVzOiBfZXh0LnR5cGUuZGV0ZWN0LFxuICAgIG9mblNlYXJjaDogX2V4dC50eXBlLnNlYXJjaCxcbiAgICBvU29ydDogX2V4dC50eXBlLm9yZGVyLFxuICAgIGFmblNvcnREYXRhOiBfZXh0Lm9yZGVyLFxuICAgIGFvRmVhdHVyZXM6IF9leHQuZmVhdHVyZSxcbiAgICBvQXBpOiBfZXh0LmludGVybmFsLFxuICAgIG9TdGRDbGFzc2VzOiBfZXh0LmNsYXNzZXMsXG4gICAgb1BhZ2luYXRpb246IF9leHQucGFnZXJcbiAgfSk7XG4gICQuZXh0ZW5kKERhdGFUYWJsZS5leHQuY2xhc3Nlcywge1xuICAgIFwic1RhYmxlXCI6IFwiZGF0YVRhYmxlXCIsXG4gICAgXCJzTm9Gb290ZXJcIjogXCJuby1mb290ZXJcIixcbiAgICBcInNQYWdlQnV0dG9uXCI6IFwicGFnaW5hdGVfYnV0dG9uXCIsXG4gICAgXCJzUGFnZUJ1dHRvbkFjdGl2ZVwiOiBcImN1cnJlbnRcIixcbiAgICBcInNQYWdlQnV0dG9uRGlzYWJsZWRcIjogXCJkaXNhYmxlZFwiLFxuICAgIFwic1N0cmlwZU9kZFwiOiBcIm9kZFwiLFxuICAgIFwic1N0cmlwZUV2ZW5cIjogXCJldmVuXCIsXG4gICAgXCJzUm93RW1wdHlcIjogXCJkYXRhVGFibGVzX2VtcHR5XCIsXG4gICAgXCJzV3JhcHBlclwiOiBcImRhdGFUYWJsZXNfd3JhcHBlclwiLFxuICAgIFwic0ZpbHRlclwiOiBcImRhdGFUYWJsZXNfZmlsdGVyXCIsXG4gICAgXCJzSW5mb1wiOiBcImRhdGFUYWJsZXNfaW5mb1wiLFxuICAgIFwic1BhZ2luZ1wiOiBcImRhdGFUYWJsZXNfcGFnaW5hdGUgcGFnaW5nX1wiLFxuICAgIFwic0xlbmd0aFwiOiBcImRhdGFUYWJsZXNfbGVuZ3RoXCIsXG4gICAgXCJzUHJvY2Vzc2luZ1wiOiBcImRhdGFUYWJsZXNfcHJvY2Vzc2luZ1wiLFxuICAgIFwic1NvcnRBc2NcIjogXCJzb3J0aW5nX2FzY1wiLFxuICAgIFwic1NvcnREZXNjXCI6IFwic29ydGluZ19kZXNjXCIsXG4gICAgXCJzU29ydGFibGVcIjogXCJzb3J0aW5nXCIsXG4gICAgXCJzU29ydGFibGVBc2NcIjogXCJzb3J0aW5nX2FzY19kaXNhYmxlZFwiLFxuICAgIFwic1NvcnRhYmxlRGVzY1wiOiBcInNvcnRpbmdfZGVzY19kaXNhYmxlZFwiLFxuICAgIFwic1NvcnRhYmxlTm9uZVwiOiBcInNvcnRpbmdfZGlzYWJsZWRcIixcbiAgICBcInNTb3J0Q29sdW1uXCI6IFwic29ydGluZ19cIixcbiAgICBcInNGaWx0ZXJJbnB1dFwiOiBcIlwiLFxuICAgIFwic0xlbmd0aFNlbGVjdFwiOiBcIlwiLFxuICAgIFwic1Njcm9sbFdyYXBwZXJcIjogXCJkYXRhVGFibGVzX3Njcm9sbFwiLFxuICAgIFwic1Njcm9sbEhlYWRcIjogXCJkYXRhVGFibGVzX3Njcm9sbEhlYWRcIixcbiAgICBcInNTY3JvbGxIZWFkSW5uZXJcIjogXCJkYXRhVGFibGVzX3Njcm9sbEhlYWRJbm5lclwiLFxuICAgIFwic1Njcm9sbEJvZHlcIjogXCJkYXRhVGFibGVzX3Njcm9sbEJvZHlcIixcbiAgICBcInNTY3JvbGxGb290XCI6IFwiZGF0YVRhYmxlc19zY3JvbGxGb290XCIsXG4gICAgXCJzU2Nyb2xsRm9vdElubmVyXCI6IFwiZGF0YVRhYmxlc19zY3JvbGxGb290SW5uZXJcIixcbiAgICBcInNIZWFkZXJUSFwiOiBcIlwiLFxuICAgIFwic0Zvb3RlclRIXCI6IFwiXCIsXG4gICAgXCJzU29ydEpVSUFzY1wiOiBcIlwiLFxuICAgIFwic1NvcnRKVUlEZXNjXCI6IFwiXCIsXG4gICAgXCJzU29ydEpVSVwiOiBcIlwiLFxuICAgIFwic1NvcnRKVUlBc2NBbGxvd2VkXCI6IFwiXCIsXG4gICAgXCJzU29ydEpVSURlc2NBbGxvd2VkXCI6IFwiXCIsXG4gICAgXCJzU29ydEpVSVdyYXBwZXJcIjogXCJcIixcbiAgICBcInNTb3J0SWNvblwiOiBcIlwiLFxuICAgIFwic0pVSUhlYWRlclwiOiBcIlwiLFxuICAgIFwic0pVSUZvb3RlclwiOiBcIlwiXG4gIH0pO1xuICB2YXIgZXh0UGFnaW5hdGlvbiA9IERhdGFUYWJsZS5leHQucGFnZXI7XG5cbiAgZnVuY3Rpb24gX251bWJlcnMocGFnZSwgcGFnZXMpIHtcbiAgICB2YXIgbnVtYmVycyA9IFtdLFxuICAgICAgICBidXR0b25zID0gZXh0UGFnaW5hdGlvbi5udW1iZXJzX2xlbmd0aCxcbiAgICAgICAgaGFsZiA9IE1hdGguZmxvb3IoYnV0dG9ucyAvIDIpLFxuICAgICAgICBpID0gMTtcblxuICAgIGlmIChwYWdlcyA8PSBidXR0b25zKSB7XG4gICAgICBudW1iZXJzID0gX3JhbmdlKDAsIHBhZ2VzKTtcbiAgICB9IGVsc2UgaWYgKHBhZ2UgPD0gaGFsZikge1xuICAgICAgbnVtYmVycyA9IF9yYW5nZSgwLCBidXR0b25zIC0gMik7XG4gICAgICBudW1iZXJzLnB1c2goJ2VsbGlwc2lzJyk7XG4gICAgICBudW1iZXJzLnB1c2gocGFnZXMgLSAxKTtcbiAgICB9IGVsc2UgaWYgKHBhZ2UgPj0gcGFnZXMgLSAxIC0gaGFsZikge1xuICAgICAgbnVtYmVycyA9IF9yYW5nZShwYWdlcyAtIChidXR0b25zIC0gMiksIHBhZ2VzKTtcbiAgICAgIG51bWJlcnMuc3BsaWNlKDAsIDAsICdlbGxpcHNpcycpO1xuICAgICAgbnVtYmVycy5zcGxpY2UoMCwgMCwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG51bWJlcnMgPSBfcmFuZ2UocGFnZSAtIGhhbGYgKyAyLCBwYWdlICsgaGFsZiAtIDEpO1xuICAgICAgbnVtYmVycy5wdXNoKCdlbGxpcHNpcycpO1xuICAgICAgbnVtYmVycy5wdXNoKHBhZ2VzIC0gMSk7XG4gICAgICBudW1iZXJzLnNwbGljZSgwLCAwLCAnZWxsaXBzaXMnKTtcbiAgICAgIG51bWJlcnMuc3BsaWNlKDAsIDAsIDApO1xuICAgIH1cblxuICAgIG51bWJlcnMuRFRfZWwgPSAnc3Bhbic7XG4gICAgcmV0dXJuIG51bWJlcnM7XG4gIH1cblxuICAkLmV4dGVuZChleHRQYWdpbmF0aW9uLCB7XG4gICAgc2ltcGxlOiBmdW5jdGlvbiBzaW1wbGUocGFnZSwgcGFnZXMpIHtcbiAgICAgIHJldHVybiBbJ3ByZXZpb3VzJywgJ25leHQnXTtcbiAgICB9LFxuICAgIGZ1bGw6IGZ1bmN0aW9uIGZ1bGwocGFnZSwgcGFnZXMpIHtcbiAgICAgIHJldHVybiBbJ2ZpcnN0JywgJ3ByZXZpb3VzJywgJ25leHQnLCAnbGFzdCddO1xuICAgIH0sXG4gICAgbnVtYmVyczogZnVuY3Rpb24gbnVtYmVycyhwYWdlLCBwYWdlcykge1xuICAgICAgcmV0dXJuIFtfbnVtYmVycyhwYWdlLCBwYWdlcyldO1xuICAgIH0sXG4gICAgc2ltcGxlX251bWJlcnM6IGZ1bmN0aW9uIHNpbXBsZV9udW1iZXJzKHBhZ2UsIHBhZ2VzKSB7XG4gICAgICByZXR1cm4gWydwcmV2aW91cycsIF9udW1iZXJzKHBhZ2UsIHBhZ2VzKSwgJ25leHQnXTtcbiAgICB9LFxuICAgIGZ1bGxfbnVtYmVyczogZnVuY3Rpb24gZnVsbF9udW1iZXJzKHBhZ2UsIHBhZ2VzKSB7XG4gICAgICByZXR1cm4gWydmaXJzdCcsICdwcmV2aW91cycsIF9udW1iZXJzKHBhZ2UsIHBhZ2VzKSwgJ25leHQnLCAnbGFzdCddO1xuICAgIH0sXG4gICAgZmlyc3RfbGFzdF9udW1iZXJzOiBmdW5jdGlvbiBmaXJzdF9sYXN0X251bWJlcnMocGFnZSwgcGFnZXMpIHtcbiAgICAgIHJldHVybiBbJ2ZpcnN0JywgX251bWJlcnMocGFnZSwgcGFnZXMpLCAnbGFzdCddO1xuICAgIH0sXG4gICAgX251bWJlcnM6IF9udW1iZXJzLFxuICAgIG51bWJlcnNfbGVuZ3RoOiA3XG4gIH0pO1xuICAkLmV4dGVuZCh0cnVlLCBEYXRhVGFibGUuZXh0LnJlbmRlcmVyLCB7XG4gICAgcGFnZUJ1dHRvbjoge1xuICAgICAgXzogZnVuY3Rpb24gXyhzZXR0aW5ncywgaG9zdCwgaWR4LCBidXR0b25zLCBwYWdlLCBwYWdlcykge1xuICAgICAgICB2YXIgY2xhc3NlcyA9IHNldHRpbmdzLm9DbGFzc2VzO1xuICAgICAgICB2YXIgbGFuZyA9IHNldHRpbmdzLm9MYW5ndWFnZS5vUGFnaW5hdGU7XG4gICAgICAgIHZhciBhcmlhID0gc2V0dGluZ3Mub0xhbmd1YWdlLm9BcmlhLnBhZ2luYXRlIHx8IHt9O1xuICAgICAgICB2YXIgYnRuRGlzcGxheSxcbiAgICAgICAgICAgIGJ0bkNsYXNzLFxuICAgICAgICAgICAgY291bnRlciA9IDA7XG5cbiAgICAgICAgdmFyIGF0dGFjaCA9IGZ1bmN0aW9uIGF0dGFjaChjb250YWluZXIsIGJ1dHRvbnMpIHtcbiAgICAgICAgICB2YXIgaSwgaWVuLCBub2RlLCBidXR0b247XG5cbiAgICAgICAgICB2YXIgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gY2xpY2tIYW5kbGVyKGUpIHtcbiAgICAgICAgICAgIF9mblBhZ2VDaGFuZ2Uoc2V0dGluZ3MsIGUuZGF0YS5hY3Rpb24sIHRydWUpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBmb3IgKGkgPSAwLCBpZW4gPSBidXR0b25zLmxlbmd0aDsgaSA8IGllbjsgaSsrKSB7XG4gICAgICAgICAgICBidXR0b24gPSBidXR0b25zW2ldO1xuXG4gICAgICAgICAgICBpZiAoJC5pc0FycmF5KGJ1dHRvbikpIHtcbiAgICAgICAgICAgICAgdmFyIGlubmVyID0gJCgnPCcgKyAoYnV0dG9uLkRUX2VsIHx8ICdkaXYnKSArICcvPicpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gICAgICAgICAgICAgIGF0dGFjaChpbm5lciwgYnV0dG9uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJ0bkRpc3BsYXkgPSBudWxsO1xuICAgICAgICAgICAgICBidG5DbGFzcyA9ICcnO1xuXG4gICAgICAgICAgICAgIHN3aXRjaCAoYnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZWxsaXBzaXMnOlxuICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJlbGxpcHNpc1wiPiYjeDIwMjY7PC9zcGFuPicpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdmaXJzdCc6XG4gICAgICAgICAgICAgICAgICBidG5EaXNwbGF5ID0gbGFuZy5zRmlyc3Q7XG4gICAgICAgICAgICAgICAgICBidG5DbGFzcyA9IGJ1dHRvbiArIChwYWdlID4gMCA/ICcnIDogJyAnICsgY2xhc3Nlcy5zUGFnZUJ1dHRvbkRpc2FibGVkKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAncHJldmlvdXMnOlxuICAgICAgICAgICAgICAgICAgYnRuRGlzcGxheSA9IGxhbmcuc1ByZXZpb3VzO1xuICAgICAgICAgICAgICAgICAgYnRuQ2xhc3MgPSBidXR0b24gKyAocGFnZSA+IDAgPyAnJyA6ICcgJyArIGNsYXNzZXMuc1BhZ2VCdXR0b25EaXNhYmxlZCk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ25leHQnOlxuICAgICAgICAgICAgICAgICAgYnRuRGlzcGxheSA9IGxhbmcuc05leHQ7XG4gICAgICAgICAgICAgICAgICBidG5DbGFzcyA9IGJ1dHRvbiArIChwYWdlIDwgcGFnZXMgLSAxID8gJycgOiAnICcgKyBjbGFzc2VzLnNQYWdlQnV0dG9uRGlzYWJsZWQpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdsYXN0JzpcbiAgICAgICAgICAgICAgICAgIGJ0bkRpc3BsYXkgPSBsYW5nLnNMYXN0O1xuICAgICAgICAgICAgICAgICAgYnRuQ2xhc3MgPSBidXR0b24gKyAocGFnZSA8IHBhZ2VzIC0gMSA/ICcnIDogJyAnICsgY2xhc3Nlcy5zUGFnZUJ1dHRvbkRpc2FibGVkKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgIGJ0bkRpc3BsYXkgPSBidXR0b24gKyAxO1xuICAgICAgICAgICAgICAgICAgYnRuQ2xhc3MgPSBwYWdlID09PSBidXR0b24gPyBjbGFzc2VzLnNQYWdlQnV0dG9uQWN0aXZlIDogJyc7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChidG5EaXNwbGF5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9ICQoJzxhPicsIHtcbiAgICAgICAgICAgICAgICAgICdjbGFzcyc6IGNsYXNzZXMuc1BhZ2VCdXR0b24gKyAnICcgKyBidG5DbGFzcyxcbiAgICAgICAgICAgICAgICAgICdhcmlhLWNvbnRyb2xzJzogc2V0dGluZ3Muc1RhYmxlSWQsXG4gICAgICAgICAgICAgICAgICAnYXJpYS1sYWJlbCc6IGFyaWFbYnV0dG9uXSxcbiAgICAgICAgICAgICAgICAgICdkYXRhLWR0LWlkeCc6IGNvdW50ZXIsXG4gICAgICAgICAgICAgICAgICAndGFiaW5kZXgnOiBzZXR0aW5ncy5pVGFiSW5kZXgsXG4gICAgICAgICAgICAgICAgICAnaWQnOiBpZHggPT09IDAgJiYgdHlwZW9mIGJ1dHRvbiA9PT0gJ3N0cmluZycgPyBzZXR0aW5ncy5zVGFibGVJZCArICdfJyArIGJ1dHRvbiA6IG51bGxcbiAgICAgICAgICAgICAgICB9KS5odG1sKGJ0bkRpc3BsYXkpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgICAgICBfZm5CaW5kQWN0aW9uKG5vZGUsIHtcbiAgICAgICAgICAgICAgICAgIGFjdGlvbjogYnV0dG9uXG4gICAgICAgICAgICAgICAgfSwgY2xpY2tIYW5kbGVyKTtcblxuICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgYWN0aXZlRWw7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhY3RpdmVFbCA9ICQoaG9zdCkuZmluZChkb2N1bWVudC5hY3RpdmVFbGVtZW50KS5kYXRhKCdkdC1pZHgnKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cblxuICAgICAgICBhdHRhY2goJChob3N0KS5lbXB0eSgpLCBidXR0b25zKTtcblxuICAgICAgICBpZiAoYWN0aXZlRWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICQoaG9zdCkuZmluZCgnW2RhdGEtZHQtaWR4PScgKyBhY3RpdmVFbCArICddJykuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gICQuZXh0ZW5kKERhdGFUYWJsZS5leHQudHlwZS5kZXRlY3QsIFtmdW5jdGlvbiAoZCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgZGVjaW1hbCA9IHNldHRpbmdzLm9MYW5ndWFnZS5zRGVjaW1hbDtcbiAgICByZXR1cm4gX2lzTnVtYmVyKGQsIGRlY2ltYWwpID8gJ251bScgKyBkZWNpbWFsIDogbnVsbDtcbiAgfSwgZnVuY3Rpb24gKGQsIHNldHRpbmdzKSB7XG4gICAgaWYgKGQgJiYgIShkIGluc3RhbmNlb2YgRGF0ZSkgJiYgIV9yZV9kYXRlLnRlc3QoZCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBwYXJzZWQgPSBEYXRlLnBhcnNlKGQpO1xuICAgIHJldHVybiBwYXJzZWQgIT09IG51bGwgJiYgIWlzTmFOKHBhcnNlZCkgfHwgX2VtcHR5KGQpID8gJ2RhdGUnIDogbnVsbDtcbiAgfSwgZnVuY3Rpb24gKGQsIHNldHRpbmdzKSB7XG4gICAgdmFyIGRlY2ltYWwgPSBzZXR0aW5ncy5vTGFuZ3VhZ2Uuc0RlY2ltYWw7XG4gICAgcmV0dXJuIF9pc051bWJlcihkLCBkZWNpbWFsLCB0cnVlKSA/ICdudW0tZm10JyArIGRlY2ltYWwgOiBudWxsO1xuICB9LCBmdW5jdGlvbiAoZCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgZGVjaW1hbCA9IHNldHRpbmdzLm9MYW5ndWFnZS5zRGVjaW1hbDtcbiAgICByZXR1cm4gX2h0bWxOdW1lcmljKGQsIGRlY2ltYWwpID8gJ2h0bWwtbnVtJyArIGRlY2ltYWwgOiBudWxsO1xuICB9LCBmdW5jdGlvbiAoZCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgZGVjaW1hbCA9IHNldHRpbmdzLm9MYW5ndWFnZS5zRGVjaW1hbDtcbiAgICByZXR1cm4gX2h0bWxOdW1lcmljKGQsIGRlY2ltYWwsIHRydWUpID8gJ2h0bWwtbnVtLWZtdCcgKyBkZWNpbWFsIDogbnVsbDtcbiAgfSwgZnVuY3Rpb24gKGQsIHNldHRpbmdzKSB7XG4gICAgcmV0dXJuIF9lbXB0eShkKSB8fCB0eXBlb2YgZCA9PT0gJ3N0cmluZycgJiYgZC5pbmRleE9mKCc8JykgIT09IC0xID8gJ2h0bWwnIDogbnVsbDtcbiAgfV0pO1xuICAkLmV4dGVuZChEYXRhVGFibGUuZXh0LnR5cGUuc2VhcmNoLCB7XG4gICAgaHRtbDogZnVuY3Rpb24gaHRtbChkYXRhKSB7XG4gICAgICByZXR1cm4gX2VtcHR5KGRhdGEpID8gZGF0YSA6IHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyA/IGRhdGEucmVwbGFjZShfcmVfbmV3X2xpbmVzLCBcIiBcIikucmVwbGFjZShfcmVfaHRtbCwgXCJcIikgOiAnJztcbiAgICB9LFxuICAgIHN0cmluZzogZnVuY3Rpb24gc3RyaW5nKGRhdGEpIHtcbiAgICAgIHJldHVybiBfZW1wdHkoZGF0YSkgPyBkYXRhIDogdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnID8gZGF0YS5yZXBsYWNlKF9yZV9uZXdfbGluZXMsIFwiIFwiKSA6IGRhdGE7XG4gICAgfVxuICB9KTtcblxuICB2YXIgX19udW1lcmljUmVwbGFjZSA9IGZ1bmN0aW9uIF9fbnVtZXJpY1JlcGxhY2UoZCwgZGVjaW1hbFBsYWNlLCByZTEsIHJlMikge1xuICAgIGlmIChkICE9PSAwICYmICghZCB8fCBkID09PSAnLScpKSB7XG4gICAgICByZXR1cm4gLUluZmluaXR5O1xuICAgIH1cblxuICAgIGlmIChkZWNpbWFsUGxhY2UpIHtcbiAgICAgIGQgPSBfbnVtVG9EZWNpbWFsKGQsIGRlY2ltYWxQbGFjZSk7XG4gICAgfVxuXG4gICAgaWYgKGQucmVwbGFjZSkge1xuICAgICAgaWYgKHJlMSkge1xuICAgICAgICBkID0gZC5yZXBsYWNlKHJlMSwgJycpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmUyKSB7XG4gICAgICAgIGQgPSBkLnJlcGxhY2UocmUyLCAnJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGQgKiAxO1xuICB9O1xuXG4gIGZ1bmN0aW9uIF9hZGROdW1lcmljU29ydChkZWNpbWFsUGxhY2UpIHtcbiAgICAkLmVhY2goe1xuICAgICAgXCJudW1cIjogZnVuY3Rpb24gbnVtKGQpIHtcbiAgICAgICAgcmV0dXJuIF9fbnVtZXJpY1JlcGxhY2UoZCwgZGVjaW1hbFBsYWNlKTtcbiAgICAgIH0sXG4gICAgICBcIm51bS1mbXRcIjogZnVuY3Rpb24gbnVtRm10KGQpIHtcbiAgICAgICAgcmV0dXJuIF9fbnVtZXJpY1JlcGxhY2UoZCwgZGVjaW1hbFBsYWNlLCBfcmVfZm9ybWF0dGVkX251bWVyaWMpO1xuICAgICAgfSxcbiAgICAgIFwiaHRtbC1udW1cIjogZnVuY3Rpb24gaHRtbE51bShkKSB7XG4gICAgICAgIHJldHVybiBfX251bWVyaWNSZXBsYWNlKGQsIGRlY2ltYWxQbGFjZSwgX3JlX2h0bWwpO1xuICAgICAgfSxcbiAgICAgIFwiaHRtbC1udW0tZm10XCI6IGZ1bmN0aW9uIGh0bWxOdW1GbXQoZCkge1xuICAgICAgICByZXR1cm4gX19udW1lcmljUmVwbGFjZShkLCBkZWNpbWFsUGxhY2UsIF9yZV9odG1sLCBfcmVfZm9ybWF0dGVkX251bWVyaWMpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChrZXksIGZuKSB7XG4gICAgICBfZXh0LnR5cGUub3JkZXJba2V5ICsgZGVjaW1hbFBsYWNlICsgJy1wcmUnXSA9IGZuO1xuXG4gICAgICBpZiAoa2V5Lm1hdGNoKC9eaHRtbFxcLS8pKSB7XG4gICAgICAgIF9leHQudHlwZS5zZWFyY2hba2V5ICsgZGVjaW1hbFBsYWNlXSA9IF9leHQudHlwZS5zZWFyY2guaHRtbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gICQuZXh0ZW5kKF9leHQudHlwZS5vcmRlciwge1xuICAgIFwiZGF0ZS1wcmVcIjogZnVuY3Rpb24gZGF0ZVByZShkKSB7XG4gICAgICB2YXIgdHMgPSBEYXRlLnBhcnNlKGQpO1xuICAgICAgcmV0dXJuIGlzTmFOKHRzKSA/IC1JbmZpbml0eSA6IHRzO1xuICAgIH0sXG4gICAgXCJodG1sLXByZVwiOiBmdW5jdGlvbiBodG1sUHJlKGEpIHtcbiAgICAgIHJldHVybiBfZW1wdHkoYSkgPyAnJyA6IGEucmVwbGFjZSA/IGEucmVwbGFjZSgvPC4qPz4vZywgXCJcIikudG9Mb3dlckNhc2UoKSA6IGEgKyAnJztcbiAgICB9LFxuICAgIFwic3RyaW5nLXByZVwiOiBmdW5jdGlvbiBzdHJpbmdQcmUoYSkge1xuICAgICAgcmV0dXJuIF9lbXB0eShhKSA/ICcnIDogdHlwZW9mIGEgPT09ICdzdHJpbmcnID8gYS50b0xvd2VyQ2FzZSgpIDogIWEudG9TdHJpbmcgPyAnJyA6IGEudG9TdHJpbmcoKTtcbiAgICB9LFxuICAgIFwic3RyaW5nLWFzY1wiOiBmdW5jdGlvbiBzdHJpbmdBc2MoeCwgeSkge1xuICAgICAgcmV0dXJuIHggPCB5ID8gLTEgOiB4ID4geSA/IDEgOiAwO1xuICAgIH0sXG4gICAgXCJzdHJpbmctZGVzY1wiOiBmdW5jdGlvbiBzdHJpbmdEZXNjKHgsIHkpIHtcbiAgICAgIHJldHVybiB4IDwgeSA/IDEgOiB4ID4geSA/IC0xIDogMDtcbiAgICB9XG4gIH0pO1xuXG4gIF9hZGROdW1lcmljU29ydCgnJyk7XG5cbiAgJC5leHRlbmQodHJ1ZSwgRGF0YVRhYmxlLmV4dC5yZW5kZXJlciwge1xuICAgIGhlYWRlcjoge1xuICAgICAgXzogZnVuY3Rpb24gXyhzZXR0aW5ncywgY2VsbCwgY29sdW1uLCBjbGFzc2VzKSB7XG4gICAgICAgICQoc2V0dGluZ3MublRhYmxlKS5vbignb3JkZXIuZHQuRFQnLCBmdW5jdGlvbiAoZSwgY3R4LCBzb3J0aW5nLCBjb2x1bW5zKSB7XG4gICAgICAgICAgaWYgKHNldHRpbmdzICE9PSBjdHgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgY29sSWR4ID0gY29sdW1uLmlkeDtcbiAgICAgICAgICBjZWxsLnJlbW92ZUNsYXNzKGNvbHVtbi5zU29ydGluZ0NsYXNzICsgJyAnICsgY2xhc3Nlcy5zU29ydEFzYyArICcgJyArIGNsYXNzZXMuc1NvcnREZXNjKS5hZGRDbGFzcyhjb2x1bW5zW2NvbElkeF0gPT0gJ2FzYycgPyBjbGFzc2VzLnNTb3J0QXNjIDogY29sdW1uc1tjb2xJZHhdID09ICdkZXNjJyA/IGNsYXNzZXMuc1NvcnREZXNjIDogY29sdW1uLnNTb3J0aW5nQ2xhc3MpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBqcXVlcnl1aTogZnVuY3Rpb24ganF1ZXJ5dWkoc2V0dGluZ3MsIGNlbGwsIGNvbHVtbiwgY2xhc3Nlcykge1xuICAgICAgICAkKCc8ZGl2Lz4nKS5hZGRDbGFzcyhjbGFzc2VzLnNTb3J0SlVJV3JhcHBlcikuYXBwZW5kKGNlbGwuY29udGVudHMoKSkuYXBwZW5kKCQoJzxzcGFuLz4nKS5hZGRDbGFzcyhjbGFzc2VzLnNTb3J0SWNvbiArICcgJyArIGNvbHVtbi5zU29ydGluZ0NsYXNzSlVJKSkuYXBwZW5kVG8oY2VsbCk7XG4gICAgICAgICQoc2V0dGluZ3MublRhYmxlKS5vbignb3JkZXIuZHQuRFQnLCBmdW5jdGlvbiAoZSwgY3R4LCBzb3J0aW5nLCBjb2x1bW5zKSB7XG4gICAgICAgICAgaWYgKHNldHRpbmdzICE9PSBjdHgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgY29sSWR4ID0gY29sdW1uLmlkeDtcbiAgICAgICAgICBjZWxsLnJlbW92ZUNsYXNzKGNsYXNzZXMuc1NvcnRBc2MgKyBcIiBcIiArIGNsYXNzZXMuc1NvcnREZXNjKS5hZGRDbGFzcyhjb2x1bW5zW2NvbElkeF0gPT0gJ2FzYycgPyBjbGFzc2VzLnNTb3J0QXNjIDogY29sdW1uc1tjb2xJZHhdID09ICdkZXNjJyA/IGNsYXNzZXMuc1NvcnREZXNjIDogY29sdW1uLnNTb3J0aW5nQ2xhc3MpO1xuICAgICAgICAgIGNlbGwuZmluZCgnc3Bhbi4nICsgY2xhc3Nlcy5zU29ydEljb24pLnJlbW92ZUNsYXNzKGNsYXNzZXMuc1NvcnRKVUlBc2MgKyBcIiBcIiArIGNsYXNzZXMuc1NvcnRKVUlEZXNjICsgXCIgXCIgKyBjbGFzc2VzLnNTb3J0SlVJICsgXCIgXCIgKyBjbGFzc2VzLnNTb3J0SlVJQXNjQWxsb3dlZCArIFwiIFwiICsgY2xhc3Nlcy5zU29ydEpVSURlc2NBbGxvd2VkKS5hZGRDbGFzcyhjb2x1bW5zW2NvbElkeF0gPT0gJ2FzYycgPyBjbGFzc2VzLnNTb3J0SlVJQXNjIDogY29sdW1uc1tjb2xJZHhdID09ICdkZXNjJyA/IGNsYXNzZXMuc1NvcnRKVUlEZXNjIDogY29sdW1uLnNTb3J0aW5nQ2xhc3NKVUkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHZhciBfX2h0bWxFc2NhcGVFbnRpdGllcyA9IGZ1bmN0aW9uIF9faHRtbEVzY2FwZUVudGl0aWVzKGQpIHtcbiAgICByZXR1cm4gdHlwZW9mIGQgPT09ICdzdHJpbmcnID8gZC5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKSA6IGQ7XG4gIH07XG5cbiAgRGF0YVRhYmxlLnJlbmRlciA9IHtcbiAgICBudW1iZXI6IGZ1bmN0aW9uIG51bWJlcih0aG91c2FuZHMsIGRlY2ltYWwsIHByZWNpc2lvbiwgcHJlZml4LCBwb3N0Zml4KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkaXNwbGF5OiBmdW5jdGlvbiBkaXNwbGF5KGQpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGQgIT09ICdudW1iZXInICYmIHR5cGVvZiBkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIGQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIG5lZ2F0aXZlID0gZCA8IDAgPyAnLScgOiAnJztcbiAgICAgICAgICB2YXIgZmxvID0gcGFyc2VGbG9hdChkKTtcblxuICAgICAgICAgIGlmIChpc05hTihmbG8pKSB7XG4gICAgICAgICAgICByZXR1cm4gX19odG1sRXNjYXBlRW50aXRpZXMoZCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZmxvID0gZmxvLnRvRml4ZWQocHJlY2lzaW9uKTtcbiAgICAgICAgICBkID0gTWF0aC5hYnMoZmxvKTtcbiAgICAgICAgICB2YXIgaW50UGFydCA9IHBhcnNlSW50KGQsIDEwKTtcbiAgICAgICAgICB2YXIgZmxvYXRQYXJ0ID0gcHJlY2lzaW9uID8gZGVjaW1hbCArIChkIC0gaW50UGFydCkudG9GaXhlZChwcmVjaXNpb24pLnN1YnN0cmluZygyKSA6ICcnO1xuICAgICAgICAgIHJldHVybiBuZWdhdGl2ZSArIChwcmVmaXggfHwgJycpICsgaW50UGFydC50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIHRob3VzYW5kcykgKyBmbG9hdFBhcnQgKyAocG9zdGZpeCB8fCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICB0ZXh0OiBmdW5jdGlvbiB0ZXh0KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGlzcGxheTogX19odG1sRXNjYXBlRW50aXRpZXNcbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIF9mbkV4dGVybkFwaUZ1bmMoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbX2ZuU2V0dGluZ3NGcm9tTm9kZSh0aGlzW0RhdGFUYWJsZS5leHQuaUFwaUluZGV4XSldLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICAgIHJldHVybiBEYXRhVGFibGUuZXh0LmludGVybmFsW2ZuXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9O1xuICB9XG5cbiAgJC5leHRlbmQoRGF0YVRhYmxlLmV4dC5pbnRlcm5hbCwge1xuICAgIF9mbkV4dGVybkFwaUZ1bmM6IF9mbkV4dGVybkFwaUZ1bmMsXG4gICAgX2ZuQnVpbGRBamF4OiBfZm5CdWlsZEFqYXgsXG4gICAgX2ZuQWpheFVwZGF0ZTogX2ZuQWpheFVwZGF0ZSxcbiAgICBfZm5BamF4UGFyYW1ldGVyczogX2ZuQWpheFBhcmFtZXRlcnMsXG4gICAgX2ZuQWpheFVwZGF0ZURyYXc6IF9mbkFqYXhVcGRhdGVEcmF3LFxuICAgIF9mbkFqYXhEYXRhU3JjOiBfZm5BamF4RGF0YVNyYyxcbiAgICBfZm5BZGRDb2x1bW46IF9mbkFkZENvbHVtbixcbiAgICBfZm5Db2x1bW5PcHRpb25zOiBfZm5Db2x1bW5PcHRpb25zLFxuICAgIF9mbkFkanVzdENvbHVtblNpemluZzogX2ZuQWRqdXN0Q29sdW1uU2l6aW5nLFxuICAgIF9mblZpc2libGVUb0NvbHVtbkluZGV4OiBfZm5WaXNpYmxlVG9Db2x1bW5JbmRleCxcbiAgICBfZm5Db2x1bW5JbmRleFRvVmlzaWJsZTogX2ZuQ29sdW1uSW5kZXhUb1Zpc2libGUsXG4gICAgX2ZuVmlzYmxlQ29sdW1uczogX2ZuVmlzYmxlQ29sdW1ucyxcbiAgICBfZm5HZXRDb2x1bW5zOiBfZm5HZXRDb2x1bW5zLFxuICAgIF9mbkNvbHVtblR5cGVzOiBfZm5Db2x1bW5UeXBlcyxcbiAgICBfZm5BcHBseUNvbHVtbkRlZnM6IF9mbkFwcGx5Q29sdW1uRGVmcyxcbiAgICBfZm5IdW5nYXJpYW5NYXA6IF9mbkh1bmdhcmlhbk1hcCxcbiAgICBfZm5DYW1lbFRvSHVuZ2FyaWFuOiBfZm5DYW1lbFRvSHVuZ2FyaWFuLFxuICAgIF9mbkxhbmd1YWdlQ29tcGF0OiBfZm5MYW5ndWFnZUNvbXBhdCxcbiAgICBfZm5Ccm93c2VyRGV0ZWN0OiBfZm5Ccm93c2VyRGV0ZWN0LFxuICAgIF9mbkFkZERhdGE6IF9mbkFkZERhdGEsXG4gICAgX2ZuQWRkVHI6IF9mbkFkZFRyLFxuICAgIF9mbk5vZGVUb0RhdGFJbmRleDogX2ZuTm9kZVRvRGF0YUluZGV4LFxuICAgIF9mbk5vZGVUb0NvbHVtbkluZGV4OiBfZm5Ob2RlVG9Db2x1bW5JbmRleCxcbiAgICBfZm5HZXRDZWxsRGF0YTogX2ZuR2V0Q2VsbERhdGEsXG4gICAgX2ZuU2V0Q2VsbERhdGE6IF9mblNldENlbGxEYXRhLFxuICAgIF9mblNwbGl0T2JqTm90YXRpb246IF9mblNwbGl0T2JqTm90YXRpb24sXG4gICAgX2ZuR2V0T2JqZWN0RGF0YUZuOiBfZm5HZXRPYmplY3REYXRhRm4sXG4gICAgX2ZuU2V0T2JqZWN0RGF0YUZuOiBfZm5TZXRPYmplY3REYXRhRm4sXG4gICAgX2ZuR2V0RGF0YU1hc3RlcjogX2ZuR2V0RGF0YU1hc3RlcixcbiAgICBfZm5DbGVhclRhYmxlOiBfZm5DbGVhclRhYmxlLFxuICAgIF9mbkRlbGV0ZUluZGV4OiBfZm5EZWxldGVJbmRleCxcbiAgICBfZm5JbnZhbGlkYXRlOiBfZm5JbnZhbGlkYXRlLFxuICAgIF9mbkdldFJvd0VsZW1lbnRzOiBfZm5HZXRSb3dFbGVtZW50cyxcbiAgICBfZm5DcmVhdGVUcjogX2ZuQ3JlYXRlVHIsXG4gICAgX2ZuQnVpbGRIZWFkOiBfZm5CdWlsZEhlYWQsXG4gICAgX2ZuRHJhd0hlYWQ6IF9mbkRyYXdIZWFkLFxuICAgIF9mbkRyYXc6IF9mbkRyYXcsXG4gICAgX2ZuUmVEcmF3OiBfZm5SZURyYXcsXG4gICAgX2ZuQWRkT3B0aW9uc0h0bWw6IF9mbkFkZE9wdGlvbnNIdG1sLFxuICAgIF9mbkRldGVjdEhlYWRlcjogX2ZuRGV0ZWN0SGVhZGVyLFxuICAgIF9mbkdldFVuaXF1ZVRoczogX2ZuR2V0VW5pcXVlVGhzLFxuICAgIF9mbkZlYXR1cmVIdG1sRmlsdGVyOiBfZm5GZWF0dXJlSHRtbEZpbHRlcixcbiAgICBfZm5GaWx0ZXJDb21wbGV0ZTogX2ZuRmlsdGVyQ29tcGxldGUsXG4gICAgX2ZuRmlsdGVyQ3VzdG9tOiBfZm5GaWx0ZXJDdXN0b20sXG4gICAgX2ZuRmlsdGVyQ29sdW1uOiBfZm5GaWx0ZXJDb2x1bW4sXG4gICAgX2ZuRmlsdGVyOiBfZm5GaWx0ZXIsXG4gICAgX2ZuRmlsdGVyQ3JlYXRlU2VhcmNoOiBfZm5GaWx0ZXJDcmVhdGVTZWFyY2gsXG4gICAgX2ZuRXNjYXBlUmVnZXg6IF9mbkVzY2FwZVJlZ2V4LFxuICAgIF9mbkZpbHRlckRhdGE6IF9mbkZpbHRlckRhdGEsXG4gICAgX2ZuRmVhdHVyZUh0bWxJbmZvOiBfZm5GZWF0dXJlSHRtbEluZm8sXG4gICAgX2ZuVXBkYXRlSW5mbzogX2ZuVXBkYXRlSW5mbyxcbiAgICBfZm5JbmZvTWFjcm9zOiBfZm5JbmZvTWFjcm9zLFxuICAgIF9mbkluaXRpYWxpc2U6IF9mbkluaXRpYWxpc2UsXG4gICAgX2ZuSW5pdENvbXBsZXRlOiBfZm5Jbml0Q29tcGxldGUsXG4gICAgX2ZuTGVuZ3RoQ2hhbmdlOiBfZm5MZW5ndGhDaGFuZ2UsXG4gICAgX2ZuRmVhdHVyZUh0bWxMZW5ndGg6IF9mbkZlYXR1cmVIdG1sTGVuZ3RoLFxuICAgIF9mbkZlYXR1cmVIdG1sUGFnaW5hdGU6IF9mbkZlYXR1cmVIdG1sUGFnaW5hdGUsXG4gICAgX2ZuUGFnZUNoYW5nZTogX2ZuUGFnZUNoYW5nZSxcbiAgICBfZm5GZWF0dXJlSHRtbFByb2Nlc3Npbmc6IF9mbkZlYXR1cmVIdG1sUHJvY2Vzc2luZyxcbiAgICBfZm5Qcm9jZXNzaW5nRGlzcGxheTogX2ZuUHJvY2Vzc2luZ0Rpc3BsYXksXG4gICAgX2ZuRmVhdHVyZUh0bWxUYWJsZTogX2ZuRmVhdHVyZUh0bWxUYWJsZSxcbiAgICBfZm5TY3JvbGxEcmF3OiBfZm5TY3JvbGxEcmF3LFxuICAgIF9mbkFwcGx5VG9DaGlsZHJlbjogX2ZuQXBwbHlUb0NoaWxkcmVuLFxuICAgIF9mbkNhbGN1bGF0ZUNvbHVtbldpZHRoczogX2ZuQ2FsY3VsYXRlQ29sdW1uV2lkdGhzLFxuICAgIF9mblRocm90dGxlOiBfZm5UaHJvdHRsZSxcbiAgICBfZm5Db252ZXJ0VG9XaWR0aDogX2ZuQ29udmVydFRvV2lkdGgsXG4gICAgX2ZuR2V0V2lkZXN0Tm9kZTogX2ZuR2V0V2lkZXN0Tm9kZSxcbiAgICBfZm5HZXRNYXhMZW5TdHJpbmc6IF9mbkdldE1heExlblN0cmluZyxcbiAgICBfZm5TdHJpbmdUb0NzczogX2ZuU3RyaW5nVG9Dc3MsXG4gICAgX2ZuU29ydEZsYXR0ZW46IF9mblNvcnRGbGF0dGVuLFxuICAgIF9mblNvcnQ6IF9mblNvcnQsXG4gICAgX2ZuU29ydEFyaWE6IF9mblNvcnRBcmlhLFxuICAgIF9mblNvcnRMaXN0ZW5lcjogX2ZuU29ydExpc3RlbmVyLFxuICAgIF9mblNvcnRBdHRhY2hMaXN0ZW5lcjogX2ZuU29ydEF0dGFjaExpc3RlbmVyLFxuICAgIF9mblNvcnRpbmdDbGFzc2VzOiBfZm5Tb3J0aW5nQ2xhc3NlcyxcbiAgICBfZm5Tb3J0RGF0YTogX2ZuU29ydERhdGEsXG4gICAgX2ZuU2F2ZVN0YXRlOiBfZm5TYXZlU3RhdGUsXG4gICAgX2ZuTG9hZFN0YXRlOiBfZm5Mb2FkU3RhdGUsXG4gICAgX2ZuU2V0dGluZ3NGcm9tTm9kZTogX2ZuU2V0dGluZ3NGcm9tTm9kZSxcbiAgICBfZm5Mb2c6IF9mbkxvZyxcbiAgICBfZm5NYXA6IF9mbk1hcCxcbiAgICBfZm5CaW5kQWN0aW9uOiBfZm5CaW5kQWN0aW9uLFxuICAgIF9mbkNhbGxiYWNrUmVnOiBfZm5DYWxsYmFja1JlZyxcbiAgICBfZm5DYWxsYmFja0ZpcmU6IF9mbkNhbGxiYWNrRmlyZSxcbiAgICBfZm5MZW5ndGhPdmVyZmxvdzogX2ZuTGVuZ3RoT3ZlcmZsb3csXG4gICAgX2ZuUmVuZGVyZXI6IF9mblJlbmRlcmVyLFxuICAgIF9mbkRhdGFTb3VyY2U6IF9mbkRhdGFTb3VyY2UsXG4gICAgX2ZuUm93QXR0cmlidXRlczogX2ZuUm93QXR0cmlidXRlcyxcbiAgICBfZm5FeHRlbmQ6IF9mbkV4dGVuZCxcbiAgICBfZm5DYWxjdWxhdGVFbmQ6IGZ1bmN0aW9uIF9mbkNhbGN1bGF0ZUVuZCgpIHt9XG4gIH0pO1xuICAkLmZuLmRhdGFUYWJsZSA9IERhdGFUYWJsZTtcbiAgRGF0YVRhYmxlLiQgPSAkO1xuICAkLmZuLmRhdGFUYWJsZVNldHRpbmdzID0gRGF0YVRhYmxlLnNldHRpbmdzO1xuICAkLmZuLmRhdGFUYWJsZUV4dCA9IERhdGFUYWJsZS5leHQ7XG5cbiAgJC5mbi5EYXRhVGFibGUgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiAkKHRoaXMpLmRhdGFUYWJsZShvcHRzKS5hcGkoKTtcbiAgfTtcblxuICAkLmVhY2goRGF0YVRhYmxlLCBmdW5jdGlvbiAocHJvcCwgdmFsKSB7XG4gICAgJC5mbi5EYXRhVGFibGVbcHJvcF0gPSB2YWw7XG4gIH0pO1xuICByZXR1cm4gJC5mbi5kYXRhVGFibGU7XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdGRENUX1RleHRCb3ggPSB7XG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oc291cmNlSFRNTCwgJHJvb3RFbGVtLCAkc2luZ2xlQ29udHJvbEVsZW0sIGFsbERhdGEpIHtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0udmFsKFwiMjIyMjJcIik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXTERDVF9Gb3JtQnV0dG9uID0ge1xuICBfTGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2U6IG51bGwsXG4gIFJlbmRlcmVyQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4sXG4gIFJlc29sdmVTZWxmOiBmdW5jdGlvbiBSZXNvbHZlU2VsZihfcmVuZGVyZXJDaGFpblBhcmFzKSB7XG4gICAgdmFyICRzaW5nbGVDb250cm9sRWxlbSA9IF9yZW5kZXJlckNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtO1xuICAgIHZhciBjYXB0aW9uID0gJHNpbmdsZUNvbnRyb2xFbGVtLmF0dHIoXCJidXR0b25jYXB0aW9uXCIpO1xuICAgIHZhciAkYnV0dG9uID0gJChcIjxidXR0b24gY2xhc3M9J3dsZGN0LWxpc3QtYnV0dG9uJz5cIiArIGNhcHRpb24gKyBcIjwvYnV0dG9uPlwiKTtcbiAgICB2YXIgYXR0cmlidXRlcyA9ICRzaW5nbGVDb250cm9sRWxlbS5wcm9wKFwiYXR0cmlidXRlc1wiKTtcbiAgICAkLmVhY2goYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgJGJ1dHRvbi5hdHRyKHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7XG4gICAgfSk7XG4gICAgJGJ1dHRvbi5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgXCJidXR0b25FbGVtXCI6ICRidXR0b24sXG4gICAgICBcInNlbGZJbnN0YW5jZVwiOiB0aGlzXG4gICAgfSwgdGhpcy5DbGlja0V2ZW50KTtcbiAgICByZXR1cm4gJGJ1dHRvbjtcbiAgfSxcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyRGF0YUNoYWluKF9yZW5kZXJlckRhdGFDaGFpblBhcmFzKSB7XG4gICAgdmFyICRzaW5nbGVDb250cm9sRWxlbSA9IF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB2YXIgJFdMRENUX0xpc3RCdXR0b25Db250YWluZXIgPSAkc2luZ2xlQ29udHJvbEVsZW0ucGFyZW50cyhcIltzaW5nbGVuYW1lPSdXTERDVF9MaXN0QnV0dG9uQ29udGFpbmVyJ11cIik7XG4gICAgdmFyICRXTERDVF9MaXN0VGFibGVDb250YWluZXJFbGVtID0gJFdMRENUX0xpc3RCdXR0b25Db250YWluZXIubmV4dEFsbChcIltjbGllbnRfcmVzb2x2ZT0nV0xEQ1RfTGlzdFRhYmxlQ29udGFpbmVyJ11cIik7XG4gICAgdGhpcy5fTGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRDb250cm9sSW5zdGFuY2VCeUVsZW0oJFdMRENUX0xpc3RUYWJsZUNvbnRhaW5lckVsZW0pO1xuICB9LFxuICBDbGlja0V2ZW50OiBmdW5jdGlvbiBDbGlja0V2ZW50KHNlbmRlcikge1xuICAgIHZhciAkYnV0dG9uID0gc2VuZGVyLmRhdGEuYnV0dG9uRWxlbTtcbiAgICB2YXIgX3NlbGYgPSBzZW5kZXIuZGF0YS5zZWxmSW5zdGFuY2U7XG4gICAgY29uc29sZS5sb2coJGJ1dHRvbik7XG4gICAgdmFyIGJpbmRhdXRob3JpdHkgPSAkYnV0dG9uLmF0dHIoXCJiaW5kYXV0aG9yaXR5XCIpO1xuICAgIHZhciBidXR0b25jYXB0aW9uID0gJGJ1dHRvbi5hdHRyKFwiYnV0dG9uY2FwdGlvblwiKTtcbiAgICB2YXIgYnV0dG9udHlwZSA9ICRidXR0b24uYXR0cihcImJ1dHRvbnR5cGVcIik7XG4gICAgdmFyIGN1c3RjbGllbnRjbGlja2JlZm9yZW1ldGhvZCA9ICRidXR0b24uYXR0cihcImN1c3RjbGllbnRjbGlja2JlZm9yZW1ldGhvZFwiKTtcbiAgICB2YXIgY3VzdGNsaWVudGNsaWNrYmVmb3JlbWV0aG9kcGFyYSA9ICRidXR0b24uYXR0cihcImN1c3RjbGllbnRjbGlja2JlZm9yZW1ldGhvZHBhcmFcIik7XG4gICAgdmFyIGN1c3RjbGllbnRyZW5kZXJlcmFmdGVybWV0aG9kcGFyYSA9ICRidXR0b24uYXR0cihcImN1c3RjbGllbnRyZW5kZXJlcmFmdGVybWV0aG9kcGFyYVwiKTtcbiAgICB2YXIgY3VzdGNsaWVudHJlbmRlcmVyYWZ0ZXJtZXRob2RwYXJhcGFyYSA9ICRidXR0b24uYXR0cihcImN1c3RjbGllbnRyZW5kZXJlcmFmdGVybWV0aG9kcGFyYXBhcmFcIik7XG4gICAgdmFyIGN1c3RjbGllbnRyZW5kZXJlcm1ldGhvZCA9ICRidXR0b24uYXR0cihcImN1c3RjbGllbnRyZW5kZXJlcm1ldGhvZFwiKTtcbiAgICB2YXIgY3VzdGNsaWVudHJlbmRlcmVybWV0aG9kcGFyYSA9ICRidXR0b24uYXR0cihcImN1c3RjbGllbnRyZW5kZXJlcm1ldGhvZHBhcmFcIik7XG4gICAgdmFyIGN1c3RzZXJ2ZXJyZXNvbHZlbWV0aG9kID0gJGJ1dHRvbi5hdHRyKFwiY3VzdHNlcnZlcnJlc29sdmVtZXRob2RcIik7XG4gICAgdmFyIGN1c3RzZXJ2ZXJyZXNvbHZlbWV0aG9kcGFyYSA9ICRidXR0b24uYXR0cihcImN1c3RzZXJ2ZXJyZXNvbHZlbWV0aG9kcGFyYVwiKTtcbiAgICB2YXIgZm9ybWNvZGUgPSAkYnV0dG9uLmF0dHIoXCJmb3JtY29kZVwiKTtcbiAgICB2YXIgZm9ybWlkID0gJGJ1dHRvbi5hdHRyKFwiZm9ybWlkXCIpO1xuICAgIHZhciBmb3JtbW9kdWxlaWQgPSAkYnV0dG9uLmF0dHIoXCJmb3JtbW9kdWxlaWRcIik7XG4gICAgdmFyIGZvcm1tb2R1bGVuYW1lID0gJGJ1dHRvbi5hdHRyKFwiZm9ybW1vZHVsZW5hbWVcIik7XG4gICAgdmFyIGZvcm1uYW1lID0gJGJ1dHRvbi5hdHRyKFwiZm9ybW5hbWVcIik7XG4gICAgdmFyIGVsZW1pZCA9ICRidXR0b24uYXR0cihcImlkXCIpO1xuICAgIHZhciBidXR0b25pZCA9ICRidXR0b24uYXR0cihcImJ1dHRvbmlkXCIpO1xuICAgIHZhciBpbm5lcmJ1dHRvbmpzb25zdHJpbmcgPSAkYnV0dG9uLmF0dHIoXCJpbm5lcmJ1dHRvbmpzb25zdHJpbmdcIik7XG4gICAgdmFyIG9wZW50eXBlID0gJGJ1dHRvbi5hdHRyKFwib3BlbnR5cGVcIik7XG4gICAgdmFyIG9wZXJhdGlvbiA9ICRidXR0b24uYXR0cihcIm9wZXJhdGlvblwiKTtcbiAgICB2YXIgc2luZ2xlbmFtZSA9ICRidXR0b24uYXR0cihcInNpbmdsZW5hbWVcIik7XG4gICAgdmFyIHdpbmRvd2NhcHRpb24gPSAkYnV0dG9uLmF0dHIoXCJ3aW5kb3djYXB0aW9uXCIpO1xuICAgIHZhciB3aW5kb3doZWlnaHQgPSAkYnV0dG9uLmF0dHIoXCJ3aW5kb3doZWlnaHRcIik7XG4gICAgdmFyIHdpbmRvd3dpZHRoID0gJGJ1dHRvbi5hdHRyKFwid2luZG93d2lkdGhcIik7XG4gICAgdmFyIGNsaWVudF9yZXNvbHZlID0gJGJ1dHRvbi5hdHRyKFwiY2xpZW50X3Jlc29sdmVcIik7XG4gICAgdmFyIHJlY29yZElkID0gXCJcIjtcblxuICAgIGlmIChvcGVyYXRpb24gPT0gXCJ1cGRhdGVcIiB8fCBvcGVyYXRpb24gPT0gXCJ2aWV3XCIpIHtcbiAgICAgIHZhciBjaGVja2VkUmVjb3JkT2JqcyA9IF9zZWxmLl9MaXN0VGFibGVDb250YWluZXJJbnN0YW5jZS5HZXRDaGVja2VkUmVjb3JkKCk7XG5cbiAgICAgIGlmIChjaGVja2VkUmVjb3JkT2Jqcy5sZW5ndGggPT0gMCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuivt+mAieaLqemcgOimgei/m+ihjOaTjeS9nOeahOiusOW9lSFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoY2hlY2tlZFJlY29yZE9ianMubGVuZ3RoID4gMSkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuS4gOasoeWPquiDveaTjeS9nOS4gOadoeiusOW9lSFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlY29yZElkID0gY2hlY2tlZFJlY29yZE9ianNbMF0uSWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgQmFzZVV0aWxpdHkuQnVpbGRWaWV3KFwiL0hUTUwvQnVpbGRlci9SdW50aW1lL1dlYkZvcm1SdW50aW1lLmh0bWxcIiwge1xuICAgICAgZm9ybUlkOiBmb3JtaWQsXG4gICAgICBidXR0b25JZDogYnV0dG9uaWQsXG4gICAgICBlbGVtSWQ6IGVsZW1pZCxcbiAgICAgIHJlY29yZElkOiByZWNvcmRJZFxuICAgIH0pLCB7XG4gICAgICB3aWR0aDogd2luZG93d2lkdGgsXG4gICAgICBoZWlnaHQ6IHdpbmRvd2hlaWdodCxcbiAgICAgIHRpdGxlOiB3aW5kb3djYXB0aW9uXG4gICAgfSwgMSwgdHJ1ZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXTERDVF9MaXN0QnV0dG9uQ29udGFpbmVyID0ge1xuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKF9yZW5kZXJlckNoYWluUGFyYXMpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gX3JlbmRlcmVyQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdmFyICRidXR0b25EaXZFbGVtTGlzdCA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwiZGl2XCIgKyBIVE1MQ29udHJvbEF0dHJzLlNFTEVDVEVEX0pCVUlMRDREQ19DVVNUT00pO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwiW2lzLW9wLWJ1dHRvbi13cmFwLXRhYmxlPSd0cnVlJ11cIikuaGlkZSgpO1xuICAgIHZhciBpbm5lcldyYXAgPSAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcIi53bGRjdC1saXN0LWJ1dHRvbi1pbm5lci13cmFwXCIpO1xuICAgIHZhciBpbm5lckluc2lkZVdyYXBEaXYgPSAkKFwiPGRpdiBjbGFzcz0nd2xkY3QtbGlzdC1idXR0b24taW5uZXItaW5zaWRlLXdyYXAnIC8+XCIpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkYnV0dG9uRGl2RWxlbUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciAkYnV0dG9uRWxlbSA9ICQoJGJ1dHRvbkRpdkVsZW1MaXN0W2ldKTtcbiAgICAgIHZhciBjbGllbnRSZXNvbHZlTmFtZSA9ICRidXR0b25FbGVtLmF0dHIoSFRNTENvbnRyb2xBdHRycy5DTElFTlRfUkVTT0xWRSk7XG4gICAgICB2YXIgY2xpZW50UmVzb2x2ZU9iamVjdCA9IE9iamVjdC5jcmVhdGUoZXZhbChjbGllbnRSZXNvbHZlTmFtZSkpO1xuICAgICAgdmFyICRyZXNvbHZlZEVsZW0gPSBjbGllbnRSZXNvbHZlT2JqZWN0LlJlc29sdmVTZWxmKHtcbiAgICAgICAgc291cmNlSFRNTDogX3JlbmRlcmVyQ2hhaW5QYXJhcy5zb3VyY2VIVE1MLFxuICAgICAgICAkcm9vdEVsZW06IF9yZW5kZXJlckNoYWluUGFyYXMuJHJvb3RFbGVtLFxuICAgICAgICAkcGFyZW50Q29udHJvbEVsZW06ICRzaW5nbGVDb250cm9sRWxlbSxcbiAgICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtOiAkYnV0dG9uRWxlbSxcbiAgICAgICAgYWxsRGF0YTogX3JlbmRlcmVyQ2hhaW5QYXJhcy5hbGxEYXRhXG4gICAgICB9KTtcbiAgICAgIGlubmVySW5zaWRlV3JhcERpdi5hcHBlbmQoJHJlc29sdmVkRWxlbSk7XG4gICAgfVxuXG4gICAgaW5uZXJXcmFwLmFwcGVuZChpbm5lckluc2lkZVdyYXBEaXYpO1xuICAgIGlubmVyV3JhcC5hcHBlbmQoXCI8ZGl2IHN0eWxlPVxcXCJjbGVhcjogYm90aDtcXFwiPjwvZGl2PlwiKTtcbiAgfSxcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyRGF0YUNoYWluXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdENvbXBsZXhTZWFyY2hDb250YWluZXIgPSB7XG4gIF8kU2luZ2xlQ29udHJvbEVsZW06IG51bGwsXG4gIF8kQ29tcGxleFNlYXJjaEJ1dHRvbjogbnVsbCxcbiAgXyRDbGVhckJ1dHRvbjogbnVsbCxcbiAgXyRDbG9zZUJ1dHRvbjogbnVsbCxcbiAgUmVuZGVyZXJDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJDaGFpbihfcmVuZGVyZXJDaGFpblBhcmFzKSB7XG4gICAgdmFyICRzaW5nbGVDb250cm9sRWxlbSA9IF9yZW5kZXJlckNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtO1xuICAgIHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbSA9ICRzaW5nbGVDb250cm9sRWxlbTtcbiAgICBIVE1MQ29udHJvbC5TYXZlQ29udHJvbE5ld0luc3RhbmNlVG9Qb29sKCRzaW5nbGVDb250cm9sRWxlbSwgdGhpcyk7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmhpZGUoKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcIi53bGRjdC1saXN0LWNvbXBsZXgtc2VhcmNoLWlubmVyLXdyYXBcIikuaGVpZ2h0KFwiMzA1cHhcIik7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCIud2xkY3QtbGlzdC1jb21wbGV4LXNlYXJjaC1pbm5lci13cmFwXCIpLmNzcyhcIm92ZXJmbG93XCIsIFwiYXV0b1wiKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcIi53bGRjdC1saXN0LWNvbXBsZXgtc2VhcmNoLWlubmVyLXdyYXBcIikuYWRkQ2xhc3MoXCJkaXYtY3VzdG9tLXNjcm9sbFwiKTtcbiAgICB2YXIgJHNlYXJjaEJ1dHRvbnNXcmFwID0gJChcIjxkaXYgY2xhc3M9J3dsZGN0LWxpc3QtY29tcGxleC1zZWFyY2gtYnV0dG9uLWlubmVyLXdyYXAnPjxkaXYgY2xhc3M9J2J1dHRvbi1pbm5lci13cmFwJz48L2Rpdj48L2Rpdj5cIik7XG4gICAgdGhpcy5fJENvbXBsZXhTZWFyY2hCdXR0b24gPSAkKFwiPGJ1dHRvbj7mn6Xor6I8L2J1dHRvbj5cIik7XG4gICAgdGhpcy5fJENsZWFyQnV0dG9uID0gJChcIjxidXR0b24+5riF56m6PC9idXR0b24+XCIpO1xuICAgIHRoaXMuXyRDbG9zZUJ1dHRvbiA9ICQoXCI8YnV0dG9uPuWFs+mXrTwvYnV0dG9uPlwiKTtcbiAgICAkc2VhcmNoQnV0dG9uc1dyYXAuZmluZChcIi5idXR0b24taW5uZXItd3JhcFwiKS5hcHBlbmQodGhpcy5fJENvbXBsZXhTZWFyY2hCdXR0b24pLmFwcGVuZCh0aGlzLl8kQ2xlYXJCdXR0b24pLmFwcGVuZCh0aGlzLl8kQ2xvc2VCdXR0b24pO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5hcHBlbmQoJHNlYXJjaEJ1dHRvbnNXcmFwKTtcbiAgfSxcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyRGF0YUNoYWluLFxuICBCdWlsZGVyU2VhcmNoQ29uZGl0aW9uOiBmdW5jdGlvbiBCdWlsZGVyU2VhcmNoQ29uZGl0aW9uKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgIHZhciBhbGxDb250cm9scyA9IHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbS5maW5kKEhUTUxDb250cm9sQXR0cnMuU0VMRUNURURfSkJVSUxENERDX0NVU1RPTSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbENvbnRyb2xzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJGVsZW0gPSAkKGFsbENvbnRyb2xzW2ldKTtcbiAgICAgIHZhciBpbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbSgkZWxlbSk7XG4gICAgICB2YXIgdmFsT2JqID0gaW5zdGFuY2UuR2V0VmFsdWUoJGVsZW0sIHt9KTtcbiAgICAgIHZhciB2YWx1ZSA9IHZhbE9iai52YWx1ZTtcblxuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBvcGVyYXRvcjogJGVsZW0uYXR0cihcImNvbHVtbm9wZXJhdG9yXCIpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICB0YWJsZU5hbWU6ICRlbGVtLmF0dHIoXCJjb2x1bW50YWJsZW5hbWVcIiksXG4gICAgICAgICAgZmllbGROYW1lOiAkZWxlbS5hdHRyKFwiY29sdW1ubmFtZVwiKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBHZXRTdGF0dXM6IGZ1bmN0aW9uIEdldFN0YXR1cygpIHtcbiAgICB2YXIgc3RhdHVzID0gdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtLmF0dHIoXCJzdGF0dXNcIik7XG5cbiAgICBpZiAoc3RhdHVzID09IFwiXCIpIHtcbiAgICAgIHN0YXR1cyA9IFwiZW5hYmxlXCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfSxcbiAgSGlkZTogZnVuY3Rpb24gSGlkZSgpIHtcbiAgICB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0uaGlkZSgpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdFNpbXBsZVNlYXJjaENvbnRhaW5lciA9IHtcbiAgXyRTaW1wbGVTZWFyY2hCdXR0b246IG51bGwsXG4gIF8kU2hvd0NvbXBsZXhTZWFyY2hCdXR0b246IG51bGwsXG4gIF8kU2luZ2xlQ29udHJvbEVsZW06IG51bGwsXG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0gPSAkc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdmFyIHBhZ2VXaWR0aCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZVdpZHRoKCk7XG4gICAgdmFyIGJ1dHRvbldyYXBXaWR0aCA9IDIwMDtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcInRhYmxlOmZpcnN0XCIpLndpZHRoKHBhZ2VXaWR0aCAtIGJ1dHRvbldyYXBXaWR0aCk7XG4gICAgSFRNTENvbnRyb2wuU2F2ZUNvbnRyb2xOZXdJbnN0YW5jZVRvUG9vbCgkc2luZ2xlQ29udHJvbEVsZW0sIHRoaXMpO1xuICAgIHZhciAkc2VhcmNoQnV0dG9uc1dyYXAgPSAkKFwiPGRpdiBjbGFzcz0nd2xkY3QtbGlzdC1zaW1wbGUtc2VhcmNoLWJ1dHRvbi1pbm5lci13cmFwJyAvPlwiKTtcbiAgICAkc2VhcmNoQnV0dG9uc1dyYXAud2lkdGgoYnV0dG9uV3JhcFdpZHRoIC0gNDApO1xuICAgIHRoaXMuXyRTaW1wbGVTZWFyY2hCdXR0b24gPSAkKFwiPGJ1dHRvbj7mn6Xor6I8L2J1dHRvbj5cIik7XG4gICAgdGhpcy5fJFNob3dDb21wbGV4U2VhcmNoQnV0dG9uID0gJChcIjxidXR0b24+6auY57qn5p+l6K+iPC9idXR0b24+XCIpO1xuICAgICRzZWFyY2hCdXR0b25zV3JhcC5hcHBlbmQodGhpcy5fJFNpbXBsZVNlYXJjaEJ1dHRvbik7XG4gICAgJHNlYXJjaEJ1dHRvbnNXcmFwLmFwcGVuZCh0aGlzLl8kU2hvd0NvbXBsZXhTZWFyY2hCdXR0b24pO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5hcHBlbmQoJHNlYXJjaEJ1dHRvbnNXcmFwKTtcbiAgICBIVE1MQ29udHJvbC5SZW5kZXJlckNoYWluKF9yZW5kZXJlckNoYWluUGFyYXMpO1xuICB9LFxuICBSZW5kZXJlckRhdGFDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJEYXRhQ2hhaW4sXG4gIEJ1aWxkZXJTZWFyY2hDb25kaXRpb246IGZ1bmN0aW9uIEJ1aWxkZXJTZWFyY2hDb25kaXRpb24oKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgdmFyIGFsbENvbnRyb2xzID0gdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoSFRNTENvbnRyb2xBdHRycy5TRUxFQ1RFRF9KQlVJTEQ0RENfQ1VTVE9NKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsQ29udHJvbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciAkZWxlbSA9ICQoYWxsQ29udHJvbHNbaV0pO1xuICAgICAgdmFyIGluc3RhbmNlID0gSFRNTENvbnRyb2wuR2V0Q29udHJvbEluc3RhbmNlQnlFbGVtKCRlbGVtKTtcbiAgICAgIHZhciB2YWxPYmogPSBpbnN0YW5jZS5HZXRWYWx1ZSgkZWxlbSwge30pO1xuICAgICAgdmFyIHZhbHVlID0gdmFsT2JqLnZhbHVlO1xuXG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgIG9wZXJhdG9yOiAkZWxlbS5hdHRyKFwiY29sdW1ub3BlcmF0b3JcIiksXG4gICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgIHRhYmxlTmFtZTogJGVsZW0uYXR0cihcImNvbHVtbnRhYmxlbmFtZVwiKSxcbiAgICAgICAgICBmaWVsZE5hbWU6ICRlbGVtLmF0dHIoXCJjb2x1bW5uYW1lXCIpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIEdldFN0YXR1czogZnVuY3Rpb24gR2V0U3RhdHVzKCkge1xuICAgIHZhciBzdGF0dXMgPSB0aGlzLl8kU2luZ2xlQ29udHJvbEVsZW0uYXR0cihcInN0YXR1c1wiKTtcblxuICAgIGlmIChzdGF0dXMgPT0gXCJcIikge1xuICAgICAgc3RhdHVzID0gXCJlbmFibGVcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdHVzO1xuICB9LFxuICBIaWRlOiBmdW5jdGlvbiBIaWRlKCkge1xuICAgIHRoaXMuXyRTaW5nbGVDb250cm9sRWxlbS5oaWRlKCk7XG4gIH0sXG4gIEhpZGVDb21wbGV4QnV0dG9uOiBmdW5jdGlvbiBIaWRlQ29tcGxleEJ1dHRvbigpIHtcbiAgICB0aGlzLl8kU2hvd0NvbXBsZXhTZWFyY2hCdXR0b24ucmVtb3ZlKCk7XG5cbiAgICB0aGlzLl8kU2ltcGxlU2VhcmNoQnV0dG9uLnBhcmVudCgpLndpZHRoKFwiODBweFwiKTtcblxuICAgIHZhciBwYWdlV2lkdGggPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VXaWR0aCgpO1xuXG4gICAgdGhpcy5fJFNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZTpmaXJzdFwiKS53aWR0aChwYWdlV2lkdGggLSAxMjApO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdFRhYmxlQ2hlY2tCb3ggPSB7XG4gIFJlbmRlcmVyQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4sXG4gIFJlbmRlcmVyRGF0YUNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckRhdGFDaGFpbihfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcykge1xuICAgIHZhciB2YWx1ZSA9IF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLnZhbDtcbiAgICB2YXIgJHRkID0gX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMuJHRkO1xuICAgICR0ZC5jc3MoXCJ0ZXh0QWxpZ25cIiwgXCJjZW50ZXJcIik7XG4gICAgdmFyICRjaGVja2JveCA9ICQoXCI8aW5wdXQgaXNyb3dfY2hlY2tib3g9XFxcInRydWVcXFwiIHR5cGU9XFxcImNoZWNrYm94XFxcIiBjbGFzcz1cXFwibGlzdC1jaGVja2JveC1jXFxcIiB2YWx1ZT1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIiByb3dfY2hlY2tib3hfcmVjb3JkX2lkPVxcXCJcIiArIHZhbHVlICsgXCJcXFwiPlwiKTtcbiAgICAkY2hlY2tib3guYmluZChcImNsaWNrXCIsIHtcbiAgICAgIFwic2VsZkluc3RhbmNlXCI6IHRoaXMsXG4gICAgICBcIiRlbGVtXCI6ICRjaGVja2JveFxuICAgIH0sIHRoaXMuQ2xpY2tFdmVudCk7XG4gICAgJHRkLmh0bWwoXCJcIik7XG4gICAgJHRkLmFwcGVuZCgkY2hlY2tib3gpO1xuICB9LFxuICBDbGlja0V2ZW50OiBmdW5jdGlvbiBDbGlja0V2ZW50KHNlbmRlcikge1xuICAgIHZhciAkZWxlbSA9IHNlbmRlci5kYXRhLiRlbGVtO1xuXG4gICAgdmFyIGxpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlID0gV0xEQ1RfTGlzdFRhYmxlQ29udGFpbmVyLl9fSW5uZXJFbGVtR2V0SW5zdGFuY2UoJGVsZW0pO1xuXG4gICAgaWYgKCRlbGVtLnByb3AoXCJjaGVja2VkXCIpKSB7XG4gICAgICBsaXN0VGFibGVDb250YWluZXJJbnN0YW5jZS5TYXZlQ2hlY2tlZFJvd0RhdGEoJGVsZW0udmFsKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0VGFibGVDb250YWluZXJJbnN0YW5jZS5EZWxldGVDaGVja2VkUm93RGF0YSgkZWxlbS52YWwoKSk7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdFRhYmxlQ29udGFpbmVyID0ge1xuICBHZXRIVE1MOiBmdW5jdGlvbiBHZXRIVE1MKCkge1xuICAgIHJldHVybiBcIjx0YWJsZSBpZD1cXFwiZXhhbXBsZVxcXCIgY2xhc3M9XFxcInN0cmlwZSByb3ctYm9yZGVyIG9yZGVyLWNvbHVtblxcXCIgc3R5bGU9XFxcIndpZHRoOjEwMCVcXFwiPlxcblwiICsgXCIgICAgICAgIDx0aGVhZD5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoIGNvbHNwYW49JzInPkZpcnN0IG5hbWU8L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPlBvc2l0aW9uPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5PZmZpY2U8L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoIGNvbHNwYW49JzInPkFnZTwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+U2FsYXJ5PC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5FeHRuLjwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+RS1tYWlsPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPkZpcnN0IG5hbWU8L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPkxhc3QgbmFtZTwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+UG9zaXRpb248L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPk9mZmljZTwvdGg+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGg+QWdlPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5TdGFydCBkYXRlPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5TYWxhcnk8L3RoPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRoPkV4dG4uPC90aD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0aD5FLW1haWw8L3RoPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgIDwvdGhlYWQ+XFxuXCIgKyBcIiAgICAgICAgPHRib2R5PlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+PGEgb25jbGljaz0nYWxlcnQoMSknPlRpZ2VyPC9hPjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Tml4b248L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlN5c3RlbSBBcmNoaXRlY3Q8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkVkaW5idXJnaDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NjE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTEvMDQvMjU8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQzMjAsODAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD41NDIxPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD50Lm5peG9uQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkdhcnJldHQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPldpbnRlcnM8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkFjY291bnRhbnQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlRva3lvPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD42MzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMS8wNy8yNTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDE3MCw3NTA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjg0MjI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmcud2ludGVyc0BkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Bc2h0b248L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkNveDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+SnVuaW9yIFRlY2huaWNhbCBBdXRob3I8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNhbiBGcmFuY2lzY288L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjY2PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDA5LzAxLzEyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kODYsMDAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4xNTYyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5hLmNveEBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5DZWRyaWM8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPktlbGx5PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TZW5pb3IgSmF2YXNjcmlwdCBEZXZlbG9wZXI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkVkaW5idXJnaDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTIvMDMvMjk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQ0MzMsMDYwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD42MjI0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5jLmtlbGx5QGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkFpcmk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNhdG91PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5BY2NvdW50YW50PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Ub2t5bzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MzM8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMDgvMTEvMjg8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQxNjIsNzAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD41NDA3PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5hLnNhdG91QGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkJyaWVsbGU8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPldpbGxpYW1zb248L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkludGVncmF0aW9uIFNwZWNpYWxpc3Q8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPk5ldyBZb3JrPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD42MTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMi8xMi8wMjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDM3MiwwMDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjQ4MDQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmIud2lsbGlhbXNvbkBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5IZXJyb2Q8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkNoYW5kbGVyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TYWxlcyBBc3Npc3RhbnQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNhbiBGcmFuY2lzY288L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjU5PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDEyLzA4LzA2PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMTM3LDUwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+OTYwODwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+aC5jaGFuZGxlckBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5SaG9uYTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+RGF2aWRzb248L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkludGVncmF0aW9uIFNwZWNpYWxpc3Q8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlRva3lvPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD41NTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMC8xMC8xNDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDMyNyw5MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjYyMDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPnIuZGF2aWRzb25AZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Q29sbGVlbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+SHVyc3Q8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkphdmFzY3JpcHQgRGV2ZWxvcGVyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TYW4gRnJhbmNpc2NvPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4zOTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAwOS8wOS8xNTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDIwNSw1MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIzNjA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmMuaHVyc3RAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U29ueWE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkZyb3N0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Tb2Z0d2FyZSBFbmdpbmVlcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+RWRpbmJ1cmdoPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAwOC8xMi8xMzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDEwMyw2MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjE2Njc8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPnMuZnJvc3RAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+SmVuYTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+R2FpbmVzPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5PZmZpY2UgTWFuYWdlcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TG9uZG9uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4zMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAwOC8xMi8xOTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDkwLDU2MDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MzgxNDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+ai5nYWluZXNAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+UXVpbm48L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkZseW5uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TdXBwb3J0IExlYWQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkVkaW5idXJnaDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTMvMDMvMDM8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQzNDIsMDAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD45NDk3PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5xLmZseW5uQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkNoYXJkZTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TWFyc2hhbGw8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlJlZ2lvbmFsIERpcmVjdG9yPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TYW4gRnJhbmNpc2NvPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4zNjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAwOC8xMC8xNjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDQ3MCw2MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjY3NDE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPmMubWFyc2hhbGxAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+SGFsZXk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPktlbm5lZHk8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlNlbmlvciBNYXJrZXRpbmcgRGVzaWduZXI8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkxvbmRvbjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+NDM8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMTIvMTIvMTg8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQzMTMsNTAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4zNTk3PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5oLmtlbm5lZHlAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+VGF0eWFuYTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+Rml0enBhdHJpY2s8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlJlZ2lvbmFsIERpcmVjdG9yPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Mb25kb248L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjE5PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDEwLzAzLzE3PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMzg1LDc1MDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MTk2NTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+dC5maXR6cGF0cmlja0BkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5NaWNoYWVsPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TaWx2YTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TWFya2V0aW5nIERlc2lnbmVyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Mb25kb248L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjY2PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDEyLzExLzI3PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMTk4LDUwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MTU4MTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+bS5zaWx2YUBkYXRhdGFibGVzLm5ldDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgKyBcIiAgICAgICAgICAgIDx0cj5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5DaGFyZGU8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPk1hcnNoYWxsPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5SZWdpb25hbCBEaXJlY3RvcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2FuIEZyYW5jaXNjbzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MzY8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjIwMDgvMTAvMTY8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPiQ0NzAsNjAwPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD42NzQxPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5jLm1hcnNoYWxsQGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkhhbGV5PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5LZW5uZWR5PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5TZW5pb3IgTWFya2V0aW5nIERlc2lnbmVyPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5Mb25kb248L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjQzPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4yMDEyLzEyLzE4PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4kMzEzLDUwMDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MzU5NzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+aC5rZW5uZWR5QGRhdGF0YWJsZXMubmV0PC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArIFwiICAgICAgICAgICAgPHRyPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPlRhdHlhbmE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPkZpdHpwYXRyaWNrPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD5SZWdpb25hbCBEaXJlY3RvcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TG9uZG9uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD4xOTwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMC8wMy8xNzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDM4NSw3NTA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjE5NjU8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPnQuZml0enBhdHJpY2tAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgICAgICA8dHI+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TWljaGFlbDwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+U2lsdmE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPk1hcmtldGluZyBEZXNpZ25lcjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+TG9uZG9uPC90ZD5cXG5cIiArIFwiICAgICAgICAgICAgICAgIDx0ZD42NjwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+MjAxMi8xMS8yNzwvdGQ+XFxuXCIgKyBcIiAgICAgICAgICAgICAgICA8dGQ+JDE5OCw1MDA8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPjE1ODE8L3RkPlxcblwiICsgXCIgICAgICAgICAgICAgICAgPHRkPm0uc2lsdmFAZGF0YXRhYmxlcy5uZXQ8L3RkPlxcblwiICsgXCIgICAgICAgICAgICA8L3RyPlxcblwiICsgXCIgICAgICAgIDwvdGJvZHk+XFxuXCIgKyBcIiAgICA8L3RhYmxlPlwiO1xuICB9LFxuICBfSW5zdGFuY2VNYXA6IHt9LFxuICBfQ3VycmVudFBhZ2VOdW06IDEsXG4gIF9EYXRhU2V0OiBudWxsLFxuICBfRGF0YVNldFJ1bnRpbWVJbnN0YW5jZTogbnVsbCxcbiAgX0NhY2hlJFNpbmdsZUNvbnRyb2xFbGVtOiBudWxsLFxuICBfQ2FjaGVSZW5kZXJlckRhdGFDaGFpblBhcmFzOiBudWxsLFxuICBfU2ltcGxlU2VhcmNoQ29udGFpbmVySW5zdGFuY2U6IG51bGwsXG4gIF9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2U6IG51bGwsXG4gIF9RdWVyeVBPTGlzdDogW10sXG4gIF9DaGVja2VkUmVjb3JkQXJyYXk6IFtdLFxuICBfJEVsZW06IG51bGwsXG4gIEdldEluc3RhbmNlOiBmdW5jdGlvbiBHZXRJbnN0YW5jZShuYW1lKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuX0luc3RhbmNlTWFwKSB7XG4gICAgICBpZiAoa2V5ID09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0luc3RhbmNlTWFwW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGluc3RhbmNlID0gZXZhbChuYW1lKTtcbiAgICB0aGlzLl9JbnN0YW5jZU1hcFtuYW1lXSA9IGluc3RhbmNlO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSxcbiAgSW5pdGlhbGl6ZTogZnVuY3Rpb24gSW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLl9EYXRhU2V0UnVudGltZUluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShEYXRhU2V0UnVudGltZSk7XG4gIH0sXG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB0aGlzLl8kRWxlbSA9ICRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB2YXIgJHNpbXBsZVNlYXJjaENvbnRhaW5lckVsZW0gPSAkc2luZ2xlQ29udHJvbEVsZW0ucHJldkFsbChcIltjbGllbnRfcmVzb2x2ZT0nV0xEQ1RfTGlzdFNpbXBsZVNlYXJjaENvbnRhaW5lciddXCIpO1xuICAgIHZhciAkY29tcGxleFNlYXJjaENvbnRhaW5lckVsZW0gPSAkc2luZ2xlQ29udHJvbEVsZW0ucHJldkFsbChcIltjbGllbnRfcmVzb2x2ZT0nV0xEQ1RfTGlzdENvbXBsZXhTZWFyY2hDb250YWluZXInXVwiKTtcbiAgICB0aGlzLl9TaW1wbGVTZWFyY2hDb250YWluZXJJbnN0YW5jZSA9IEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbSgkc2ltcGxlU2VhcmNoQ29udGFpbmVyRWxlbSk7XG4gICAgdGhpcy5fQ29tcGxleFNlYXJjaENvbnRhaW5lckluc3RhbmNlID0gSFRNTENvbnRyb2wuR2V0Q29udHJvbEluc3RhbmNlQnlFbGVtKCRjb21wbGV4U2VhcmNoQ29udGFpbmVyRWxlbSk7XG4gICAgSFRNTENvbnRyb2wuU2F2ZUNvbnRyb2xOZXdJbnN0YW5jZVRvUG9vbCgkc2luZ2xlQ29udHJvbEVsZW0sIHRoaXMpO1xuXG4gICAgdGhpcy5fU2ltcGxlU2VhcmNoQ29udGFpbmVySW5zdGFuY2UuXyRTaW1wbGVTZWFyY2hCdXR0b24uYmluZChcImNsaWNrXCIsIHtcbiAgICAgIFwibGlzdEluc3RhbmNlXCI6IHRoaXNcbiAgICB9LCB0aGlzLlNpbXBsZVNlYXJjaENsaWNrRXZlbnQpO1xuXG4gICAgdGhpcy5fU2ltcGxlU2VhcmNoQ29udGFpbmVySW5zdGFuY2UuXyRTaG93Q29tcGxleFNlYXJjaEJ1dHRvbi5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgXCJsaXN0SW5zdGFuY2VcIjogdGhpc1xuICAgIH0sIHRoaXMuU2hvd0NvbXBsZXhTZWFyY2hDbGlja0V2ZW50KTtcblxuICAgIHRoaXMuX0NvbXBsZXhTZWFyY2hDb250YWluZXJJbnN0YW5jZS5fJENvbXBsZXhTZWFyY2hCdXR0b24uYmluZChcImNsaWNrXCIsIHtcbiAgICAgIFwibGlzdEluc3RhbmNlXCI6IHRoaXNcbiAgICB9LCB0aGlzLkNvbXBsZXhTZWFyY2hDbGlja0V2ZW50KTtcblxuICAgIHRoaXMuX0NvbXBsZXhTZWFyY2hDb250YWluZXJJbnN0YW5jZS5fJENsZWFyQnV0dG9uLmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBcImxpc3RJbnN0YW5jZVwiOiB0aGlzXG4gICAgfSwgdGhpcy5Db21wbGV4U2VhcmNoQ2xlYXJDbGlja0V2ZW50KTtcblxuICAgIHRoaXMuX0NvbXBsZXhTZWFyY2hDb250YWluZXJJbnN0YW5jZS5fJENsb3NlQnV0dG9uLmJpbmQoXCJjbGlja1wiLCB7XG4gICAgICBcImxpc3RJbnN0YW5jZVwiOiB0aGlzXG4gICAgfSwgdGhpcy5Db21wbGV4U2VhcmNoQ2xvc2VDbGlja0V2ZW50KTtcblxuICAgIGlmICh0aGlzLl9TaW1wbGVTZWFyY2hDb250YWluZXJJbnN0YW5jZS5HZXRTdGF0dXMoKSA9PSBcImRpc2FibGVcIikge1xuICAgICAgdGhpcy5fU2ltcGxlU2VhcmNoQ29udGFpbmVySW5zdGFuY2UuSGlkZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UuR2V0U3RhdHVzKCkgPT0gXCJkaXNhYmxlXCIpIHtcbiAgICAgIHRoaXMuX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlLkhpZGVDb21wbGV4QnV0dG9uKCk7XG4gICAgfVxuXG4gICAgdmFyICR0ZW1wbGF0ZVRhYmxlID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZVwiKTtcbiAgICB2YXIgJHRlbXBsYXRlVGFibGVSb3cgPSAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcInRhYmxlIHRib2R5IHRyXCIpO1xuICAgIHZhciAkdGVtcGxhdGVUYWJsZUhlYWRlclJvd3MgPSAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcInRhYmxlIHRoZWFkIHRyXCIpO1xuICAgIHRoaXMuQXBwZW5kQ2hlY2tCb3hDb2x1bW5UZW1wbGF0ZSgkdGVtcGxhdGVUYWJsZSwgJHRlbXBsYXRlVGFibGVIZWFkZXJSb3dzLCAkdGVtcGxhdGVUYWJsZVJvdyk7XG4gICAgSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpbihfcmVuZGVyZXJDaGFpblBhcmFzKTtcbiAgfSxcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyRGF0YUNoYWluKF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLCBpc1JlUmVuZGVyZXIpIHtcbiAgICB2YXIgdXNlZFRvcERhdGFTZXQgPSB0cnVlO1xuICAgIHZhciBkYXRhU2V0SWQ7XG4gICAgdmFyIHBhZ2VTaXplO1xuXG4gICAgaWYgKHVzZWRUb3BEYXRhU2V0KSB7XG4gICAgICBkYXRhU2V0SWQgPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy50b3BEYXRhU2V0SWQ7XG4gICAgICBwYWdlU2l6ZSA9IF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLmxpc3RFbnRpdHkubGlzdERhdGFzZXRQYWdlU2l6ZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX0NhY2hlUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcykge1xuICAgICAgdGhpcy5fQ2FjaGVSZW5kZXJlckRhdGFDaGFpblBhcmFzID0gX3JlbmRlcmVyRGF0YUNoYWluUGFyYXM7XG4gICAgICB0aGlzLl9DYWNoZSRTaW5nbGVDb250cm9sRWxlbSA9IF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbS5jbG9uZSgpO1xuICAgIH1cblxuICAgIGlmIChpc1JlUmVuZGVyZXIpIHtcbiAgICAgIF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbS5odG1sKHRoaXMuX0NhY2hlJFNpbmdsZUNvbnRyb2xFbGVtLmh0bWwoKSk7XG4gICAgfVxuXG4gICAgaWYgKF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLmxpc3RSdW50aW1lSW5zdGFuY2UuSXNQcmV2aWV3KCkpIHtcbiAgICAgIHZhciBtb2NrRGF0YVNldCA9IHtcbiAgICAgICAgXCJ0b3RhbFwiOiAxMDAwLFxuICAgICAgICBcImxpc3RcIjogW10sXG4gICAgICAgIFwicGFnZU51bVwiOiAxLFxuICAgICAgICBcInBhZ2VTaXplXCI6IDUsXG4gICAgICAgIFwic2l6ZVwiOiA1LFxuICAgICAgICBcInN0YXJ0Um93XCI6IDEsXG4gICAgICAgIFwiZW5kUm93XCI6IDUsXG4gICAgICAgIFwicGFnZXNcIjogMjAwLFxuICAgICAgICBcInByZVBhZ2VcIjogMCxcbiAgICAgICAgXCJuZXh0UGFnZVwiOiAyLFxuICAgICAgICBcImlzRmlyc3RQYWdlXCI6IHRydWUsXG4gICAgICAgIFwiaXNMYXN0UGFnZVwiOiBmYWxzZSxcbiAgICAgICAgXCJoYXNQcmV2aW91c1BhZ2VcIjogZmFsc2UsXG4gICAgICAgIFwiaGFzTmV4dFBhZ2VcIjogdHJ1ZSxcbiAgICAgICAgXCJuYXZpZ2F0ZVBhZ2VzXCI6IDgsXG4gICAgICAgIFwibmF2aWdhdGVwYWdlTnVtc1wiOiBbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0sXG4gICAgICAgIFwibmF2aWdhdGVGaXJzdFBhZ2VcIjogMSxcbiAgICAgICAgXCJuYXZpZ2F0ZUxhc3RQYWdlXCI6IDgsXG4gICAgICAgIFwiZmlyc3RQYWdlXCI6IDEsXG4gICAgICAgIFwibGFzdFBhZ2VcIjogOFxuICAgICAgfTtcbiAgICAgIHRoaXMuX0RhdGFTZXQgPSBtb2NrRGF0YVNldDtcbiAgICAgIHRoaXMuQ3JlYXRlVGFibGUoX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtLCBtb2NrRGF0YVNldCwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRMb2FkaW5nKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQsIHtcbiAgICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICAgIGhpZGU6IHtcbiAgICAgICAgICBlZmZlY3Q6IFwiZmFkZVwiLFxuICAgICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgICAgfVxuICAgICAgfSwgXCLmlbDmja7liqDovb3kuK0s6K+356iN5YCZLi4uLlwiKTtcblxuICAgICAgdGhpcy5fRGF0YVNldFJ1bnRpbWVJbnN0YW5jZS5HZXREYXRhU2V0RGF0YSh7XG4gICAgICAgIGRhdGFTZXRJZDogZGF0YVNldElkLFxuICAgICAgICBwYWdlU2l6ZTogcGFnZVNpemUsXG4gICAgICAgIHBhZ2VOdW06IHRoaXMuX0N1cnJlbnRQYWdlTnVtLFxuICAgICAgICBsaXN0UXVlcnlQT0xpc3Q6IHRoaXMuX1F1ZXJ5UE9MaXN0LFxuICAgICAgICBleFZhbHVlMTogXCJcIixcbiAgICAgICAgZXhWYWx1ZTI6IFwiXCIsXG4gICAgICAgIGV4VmFsdWUzOiBcIlwiXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLmRhdGFTZXQgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgdGhpcy5fRGF0YVNldCA9IHJlc3VsdC5kYXRhO1xuICAgICAgICB0aGlzLkNyZWF0ZVRhYmxlKF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbSwgdGhpcy5fRGF0YVNldCwgZmFsc2UpO1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gIH0sXG4gIENyZWF0ZVRhYmxlOiBmdW5jdGlvbiBDcmVhdGVUYWJsZSgkc2luZ2xlQ29udHJvbEVsZW0sIGRhdGFTZXQsIGlzUHJldmlldykge1xuICAgIHZhciAkdGVtcGxhdGVUYWJsZSA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwidGFibGVcIik7XG4gICAgdmFyICR0ZW1wbGF0ZVRhYmxlUm93ID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZSB0Ym9keSB0clwiKTtcbiAgICB2YXIgJHRlbXBsYXRlVGFibGVIZWFkZXJSb3dzID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZSB0aGVhZCB0clwiKTtcblxuICAgIGlmICgkdGVtcGxhdGVUYWJsZVJvdy5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgJHRlbXBsYXRlVGFibGVCb2R5ID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJ0YWJsZSB0Ym9keVwiKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhU2V0Lmxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgJHRlbXBsYXRlVGFibGVCb2R5LmFwcGVuZCh0aGlzLlJlbmRlcmVyU2luZ2xlUm93KCR0ZW1wbGF0ZVRhYmxlLCAkdGVtcGxhdGVUYWJsZVJvdywgZGF0YVNldCwgZGF0YVNldC5saXN0W2ldKSk7XG4gICAgICB9XG5cbiAgICAgICR0ZW1wbGF0ZVRhYmxlUm93LnJlbW92ZSgpO1xuXG4gICAgICBpZiAoaXNQcmV2aWV3KSB7XG4gICAgICAgICR0ZW1wbGF0ZVRhYmxlLmZpbmQoXCJbc2luZ2xlbmFtZT0nV0xEQ1RfTGlzdFRhYmxlSW5uZXJCdXR0b25Db250YWluZXInXVwiKS5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcIi53bGRjdC1saXN0LXRhYmxlLWlubmVyLXdyYXBcIikuYXBwZW5kKHRoaXMuQ3JlYXRlUGFnaW5nKCkpO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwiLndsZGN0LWxpc3QtdGFibGUtaW5uZXItd3JhcFwiKS53aWR0aChQYWdlU3R5bGVVdGlsaXR5LkdldFdpbmRvd1dpZHRoKCkgLSAyMCk7XG4gICAgJHRlbXBsYXRlVGFibGUuYWRkQ2xhc3MoXCJzdHJpcGUgcm93LWJvcmRlciBvcmRlci1jb2x1bW5cIik7XG4gICAgJHRlbXBsYXRlVGFibGUud2lkdGgoXCIxMDAlXCIpO1xuICAgIHZhciBzY3JvbGxZID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRXaW5kb3dIZWlnaHQoKSAtICQoXCIud2xkY3QtbGlzdC1zaW1wbGUtc2VhcmNoLW91dGVyLXdyYXBcIikuaGVpZ2h0KCkgLSAkKFwiLndsZGN0LWxpc3QtYnV0dG9uLW91dGVyLXdyYXBcIikuaGVpZ2h0KCkgLSAxNjA7XG4gICAgdmFyIHRhYmxlID0gJHRlbXBsYXRlVGFibGUuRGF0YVRhYmxlKHtcbiAgICAgIHNjcm9sbFk6IHNjcm9sbFksXG4gICAgICBzY3JvbGxYOiB0cnVlLFxuICAgICAgcGFnaW5nOiBmYWxzZSxcbiAgICAgIFwib3JkZXJpbmdcIjogZmFsc2UsXG4gICAgICBcInNlYXJjaGluZ1wiOiBmYWxzZSxcbiAgICAgIFwiaW5mb1wiOiBmYWxzZVxuICAgIH0pO1xuICB9LFxuICBBcHBlbmRDaGVja0JveENvbHVtblRlbXBsYXRlOiBmdW5jdGlvbiBBcHBlbmRDaGVja0JveENvbHVtblRlbXBsYXRlKCR0ZW1wbGF0ZVRhYmxlLCAkdGVtcGxhdGVUYWJsZUhlYWRlclJvd3MsICR0ZW1wbGF0ZVRhYmxlUm93KSB7XG4gICAgdmFyICR0aCA9ICQoXCI8dGggc3R5bGU9J3dpZHRoOiA1MHB4Jz7pgInmi6k8L3RoPlwiKTtcblxuICAgIGlmICgkdGVtcGxhdGVUYWJsZUhlYWRlclJvd3MubGVuZ3RoID4gMSkge1xuICAgICAgJHRoLmF0dHIoXCJyb3dzcGFuXCIsICR0ZW1wbGF0ZVRhYmxlSGVhZGVyUm93cy5sZW5ndGgpO1xuICAgIH1cblxuICAgICQoJHRlbXBsYXRlVGFibGVIZWFkZXJSb3dzWzBdKS5wcmVwZW5kKCR0aCk7XG4gICAgJCgkdGVtcGxhdGVUYWJsZVJvdy5lcSgwKSkucHJlcGVuZChcIjx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbmFsaWduPVxcXCJcXHU1QzQ1XFx1NEUyRFxcdTVCRjlcXHU5RjUwXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5jYXB0aW9uPVxcXCJJRFxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uZGF0YXR5cGVuYW1lPVxcXCJcXHU1QjU3XFx1N0IyNlxcdTRFMzJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbm5hbWU9XFxcIklEXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW50YWJsZW5hbWU9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbF9jYXRlZ29yeT1cXFwiSW5wdXRDb250cm9sXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0Y2xpZW50cmVuZGVyZXJtZXRob2Q9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdGNsaWVudHJlbmRlcmVybWV0aG9kcGFyYT1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0c2VydmVycmVzb2x2ZW1ldGhvZD1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0c2VydmVycmVzb2x2ZW1ldGhvZHBhcmE9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdHRleHQ9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdHR5cGU9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdHZhbHVlPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2M9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XFxcImNoZWNrX2JveF90ZW1wbGF0ZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfamJ1aWxkNGRjX2RhdGE9XFxcInRydWVcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpidWlsZDRkY19jdXN0b209XFxcInRydWVcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XFxcImNoZWNrX2JveF90ZW1wbGF0ZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWFsaXplPVxcXCJ0cnVlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93X3JlbW92ZV9idXR0b249XFxcInRydWVcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpbmdsZW5hbWU9XFxcIldMRENUX0xpc3RUYWJsZUNoZWNrQm94XFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRidXR0b25pZD1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRfcmVzb2x2ZT1cXFwiV0xEQ1RfTGlzdFRhYmxlQ2hlY2tCb3hcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJRFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlwiKTtcbiAgfSxcbiAgUmVuZGVyZXJTaW5nbGVSb3c6IGZ1bmN0aW9uIFJlbmRlcmVyU2luZ2xlUm93KCR0ZW1wbGF0ZVRhYmxlLCAkdGVtcGxhdGVUYWJsZVJvdywgZGF0YVNldCwgcm93RGF0YSkge1xuICAgIHZhciAkY2xvbmVSb3cgPSAkdGVtcGxhdGVUYWJsZVJvdy5jbG9uZSgpO1xuICAgIHZhciAkdGRzID0gJGNsb25lUm93LmZpbmQoXCJ0ZFwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHRkcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyICR0ZCA9ICQoJHRkc1tpXSk7XG4gICAgICB2YXIgJGRpdkNURWxlbSA9ICR0ZC5maW5kKFwiZGl2XCIgKyBIVE1MQ29udHJvbEF0dHJzLlNFTEVDVEVEX0pCVUlMRDREQ19DVVNUT00pO1xuXG4gICAgICBpZiAoJGRpdkNURWxlbS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBiaW5kVG9GaWVsZCA9ICRkaXZDVEVsZW0uYXR0cihcImNvbHVtbm5hbWVcIik7XG4gICAgICAgIHZhciB2YWwgPSByb3dEYXRhW2JpbmRUb0ZpZWxkXTtcbiAgICAgICAgdmFyIGNsaWVudFJlc29sdmVJbnN0YW5jZU5hbWUgPSAkZGl2Q1RFbGVtLmF0dHIoSFRNTENvbnRyb2xBdHRycy5DTElFTlRfUkVTT0xWRSk7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IFdMRENUX0xpc3RUYWJsZUNvbnRhaW5lci5HZXRJbnN0YW5jZShjbGllbnRSZXNvbHZlSW5zdGFuY2VOYW1lKTtcbiAgICAgICAgaW5zdGFuY2UuUmVuZGVyZXJEYXRhQ2hhaW4oe1xuICAgICAgICAgICR0ZW1wbGF0ZVRhYmxlOiAkdGVtcGxhdGVUYWJsZSxcbiAgICAgICAgICAkdGVtcGxhdGVUYWJsZVJvdzogJHRlbXBsYXRlVGFibGVSb3csXG4gICAgICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtOiAkZGl2Q1RFbGVtLFxuICAgICAgICAgIGRhdGFTZXQ6IGRhdGFTZXQsXG4gICAgICAgICAgcm93RGF0YTogcm93RGF0YSxcbiAgICAgICAgICAkY2xvbmVSb3c6ICRjbG9uZVJvdyxcbiAgICAgICAgICAkdGQ6ICR0ZCxcbiAgICAgICAgICB2YWw6IHZhbFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gJGNsb25lUm93O1xuICB9LFxuICBDcmVhdGVQYWdpbmc6IGZ1bmN0aW9uIENyZWF0ZVBhZ2luZygkdGVtcGxhdGVUYWJsZSwgJHRlbXBsYXRlVGFibGVSb3csIGRhdGFTZXQsIHJvd0RhdGEsICRyb3csICR0ZCwgdmFsdWUpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgdmFyIHBhZ2luZ091dGVyRWxlbSA9ICQoXCI8ZGl2IGNsYXNzPSd0YWJsZS1wYWdpbmctb3V0ZXInPjxkaXYgY2xhc3M9J3RhYmxlLXBhZ2luZy1pbm5lcic+PC9kaXY+PC9kaXY+XCIpO1xuICAgIHZhciBwYWdpbmdJbm5lckVsZW0gPSBwYWdpbmdPdXRlckVsZW0uZmluZChcImRpdlwiKTtcbiAgICB2YXIgZmlyc3RQYWdlID0gJChcIjxkaXYgY2xhc3M9J3RhYmxlLXBhZ2luZy1idXR0b24nPuesrOS4gOmhtTwvZGl2PlwiKTtcbiAgICBmaXJzdFBhZ2UuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgX3NlbGYuQ2hhbmdlUGFnZU51bSgxKTtcbiAgICB9KTtcbiAgICB2YXIgcHJlUGFnZSA9ICQoXCI8ZGl2IGNsYXNzPSd0YWJsZS1wYWdpbmctYnV0dG9uJz7kuIrkuIDpobU8L2Rpdj5cIik7XG4gICAgcHJlUGFnZS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoX3NlbGYuX0N1cnJlbnRQYWdlTnVtID4gMSkge1xuICAgICAgICBfc2VsZi5DaGFuZ2VQYWdlTnVtKF9zZWxmLl9DdXJyZW50UGFnZU51bSAtIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLlt7Lnu4/liLDovr7nrKzkuIDpobUhXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBsYXN0UGFnZSA9ICQoXCI8ZGl2IGNsYXNzPSd0YWJsZS1wYWdpbmctYnV0dG9uJz7mnKvpobU8L2Rpdj5cIik7XG4gICAgbGFzdFBhZ2UuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgX3NlbGYuQ2hhbmdlUGFnZU51bShfc2VsZi5fRGF0YVNldC5wYWdlcyk7XG4gICAgfSk7XG4gICAgdmFyIG5leHRQYWdlID0gJChcIjxkaXYgY2xhc3M9J3RhYmxlLXBhZ2luZy1idXR0b24nPuS4i+S4gOmhtTwvZGl2PlwiKTtcbiAgICBuZXh0UGFnZS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoX3NlbGYuX0N1cnJlbnRQYWdlTnVtIDwgX3NlbGYuX0RhdGFTZXQucGFnZXMpIHtcbiAgICAgICAgX3NlbGYuQ2hhbmdlUGFnZU51bShfc2VsZi5fQ3VycmVudFBhZ2VOdW0gKyAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5bey57uP5Yiw6L6+5pyA5pyr6aG1IVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgaW5mbyA9ICQoXCI8ZGl2IGNsYXNzPSd0YWJsZS1wYWdpbmctaW5mbyc+5oC75p2h5pWw44CQXCIgKyBfc2VsZi5fRGF0YVNldC50b3RhbCArIFwi44CRJm5ic3A7Jm5ic3A76aG15pWw44CQXCIgKyBfc2VsZi5fQ3VycmVudFBhZ2VOdW0gKyBcIi9cIiArIF9zZWxmLl9EYXRhU2V0LnBhZ2VzICsgXCLjgJE8L2Rpdj5cIik7XG4gICAgcGFnaW5nSW5uZXJFbGVtLmFwcGVuZChmaXJzdFBhZ2UpLmFwcGVuZChwcmVQYWdlKS5hcHBlbmQobmV4dFBhZ2UpLmFwcGVuZChsYXN0UGFnZSkuYXBwZW5kKGluZm8pO1xuICAgIHJldHVybiBwYWdpbmdPdXRlckVsZW07XG4gIH0sXG4gIENoYW5nZVBhZ2VOdW06IGZ1bmN0aW9uIENoYW5nZVBhZ2VOdW0ocGFnZU51bSkge1xuICAgIHRoaXMuX0N1cnJlbnRQYWdlTnVtID0gcGFnZU51bTtcbiAgICB0aGlzLlJlbmRlcmVyRGF0YUNoYWluKHRoaXMuX0NhY2hlUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcywgdHJ1ZSk7XG4gIH0sXG4gIFNpbXBsZVNlYXJjaENsaWNrRXZlbnQ6IGZ1bmN0aW9uIFNpbXBsZVNlYXJjaENsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgdmFyIF9zZWxmID0gc2VuZGVyLmRhdGEubGlzdEluc3RhbmNlO1xuXG4gICAgdmFyIGNvbmRpdGlvbnMgPSBfc2VsZi5fU2ltcGxlU2VhcmNoQ29udGFpbmVySW5zdGFuY2UuQnVpbGRlclNlYXJjaENvbmRpdGlvbigpO1xuXG4gICAgX3NlbGYuX1F1ZXJ5UE9MaXN0ID0gY29uZGl0aW9ucztcblxuICAgIF9zZWxmLlJlbmRlcmVyRGF0YUNoYWluKF9zZWxmLl9DYWNoZVJlbmRlcmVyRGF0YUNoYWluUGFyYXMsIHRydWUpO1xuICB9LFxuICBTaG93Q29tcGxleFNlYXJjaENsaWNrRXZlbnQ6IGZ1bmN0aW9uIFNob3dDb21wbGV4U2VhcmNoQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICB2YXIgX3NlbGYgPSBzZW5kZXIuZGF0YS5saXN0SW5zdGFuY2U7XG4gICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKF9zZWxmLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UuXyRTaW5nbGVDb250cm9sRWxlbSwge1xuICAgICAgdGl0bGU6IFwi6auY57qn5p+l6K+iXCIsXG4gICAgICBoZWlnaHQ6IDQxMCxcbiAgICAgIHdpZHRoOiA4MDAsXG4gICAgICBtb2RhbDogdHJ1ZVxuICAgIH0pO1xuICB9LFxuICBDb21wbGV4U2VhcmNoQ2xpY2tFdmVudDogZnVuY3Rpb24gQ29tcGxleFNlYXJjaENsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgY29uc29sZS5sb2coXCLpq5jnuqfmn6Xor6IuXCIpO1xuICAgIHZhciBfc2VsZiA9IHNlbmRlci5kYXRhLmxpc3RJbnN0YW5jZTtcblxuICAgIHZhciBzaW1wbGVDb25kaXRpb25zID0gX3NlbGYuX1NpbXBsZVNlYXJjaENvbnRhaW5lckluc3RhbmNlLkJ1aWxkZXJTZWFyY2hDb25kaXRpb24oKTtcblxuICAgIHZhciBjb21wbGV4Q29uZGl0aW9ucyA9IF9zZWxmLl9Db21wbGV4U2VhcmNoQ29udGFpbmVySW5zdGFuY2UuQnVpbGRlclNlYXJjaENvbmRpdGlvbigpO1xuXG4gICAgX3NlbGYuX1F1ZXJ5UE9MaXN0ID0gY29tcGxleENvbmRpdGlvbnMuY29uY2F0KHNpbXBsZUNvbmRpdGlvbnMpO1xuXG4gICAgX3NlbGYuUmVuZGVyZXJEYXRhQ2hhaW4oX3NlbGYuX0NhY2hlUmVuZGVyZXJEYXRhQ2hhaW5QYXJhcywgdHJ1ZSk7XG5cbiAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbShfc2VsZi5fQ29tcGxleFNlYXJjaENvbnRhaW5lckluc3RhbmNlLl8kU2luZ2xlQ29udHJvbEVsZW0pO1xuICB9LFxuICBDb21wbGV4U2VhcmNoQ2xvc2VDbGlja0V2ZW50OiBmdW5jdGlvbiBDb21wbGV4U2VhcmNoQ2xvc2VDbGlja0V2ZW50KHNlbmRlcikge1xuICAgIHZhciBfc2VsZiA9IHNlbmRlci5kYXRhLmxpc3RJbnN0YW5jZTtcbiAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbShfc2VsZi5fQ29tcGxleFNlYXJjaENvbnRhaW5lckluc3RhbmNlLl8kU2luZ2xlQ29udHJvbEVsZW0pO1xuICB9LFxuICBDb21wbGV4U2VhcmNoQ2xlYXJDbGlja0V2ZW50OiBmdW5jdGlvbiBDb21wbGV4U2VhcmNoQ2xlYXJDbGlja0V2ZW50KHNlbmRlcikge1xuICAgIHZhciBfc2VsZiA9IHNlbmRlci5kYXRhLmxpc3RJbnN0YW5jZTtcbiAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuacquWunueOsCFcIik7XG4gIH0sXG4gIEdldFJlY29yZERhdGE6IGZ1bmN0aW9uIEdldFJlY29yZERhdGEoaWQpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLl9EYXRhU2V0KTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fRGF0YVNldC5saXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcmVjb3JkRGF0YSA9IHRoaXMuX0RhdGFTZXQubGlzdFtpXTtcblxuICAgICAgaWYgKHJlY29yZERhdGEuSUQgPT0gaWQpIHtcbiAgICAgICAgcmV0dXJuIHJlY29yZERhdGE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLmib7kuI3liLBJROS4ujpcIiArIGlkICsgXCLnmoTorrDlvZUhXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBTYXZlQ2hlY2tlZFJvd0RhdGE6IGZ1bmN0aW9uIFNhdmVDaGVja2VkUm93RGF0YShpZCkge1xuICAgIHZhciByZWNvcmQgPSB0aGlzLkdldFJlY29yZERhdGEoaWQpO1xuXG4gICAgaWYgKHJlY29yZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9DaGVja2VkUmVjb3JkQXJyYXkucHVzaCh7XG4gICAgICAgIFwiSWRcIjogaWQsXG4gICAgICAgIFwiUmVjb3JkXCI6IHJlY29yZFxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBEZWxldGVDaGVja2VkUm93RGF0YTogZnVuY3Rpb24gRGVsZXRlQ2hlY2tlZFJvd0RhdGEoaWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX0NoZWNrZWRSZWNvcmRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMuX0NoZWNrZWRSZWNvcmRBcnJheVtpXS5JZCA9PSBpZCkge1xuICAgICAgICBBcnJheVV0aWxpdHkuRGVsZXRlKHRoaXMuX0NoZWNrZWRSZWNvcmRBcnJheSwgaSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBHZXRDaGVja2VkUmVjb3JkOiBmdW5jdGlvbiBHZXRDaGVja2VkUmVjb3JkKCkge1xuICAgIHJldHVybiB0aGlzLl9DaGVja2VkUmVjb3JkQXJyYXk7XG4gIH0sXG4gIEdldExhc3RDaGVja2VkUmVjb3JkOiBmdW5jdGlvbiBHZXRMYXN0Q2hlY2tlZFJlY29yZCgpIHtcbiAgICBpZiAodGhpcy5fQ2hlY2tlZFJlY29yZEFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLl9DaGVja2VkUmVjb3JkQXJyYXlbdGhpcy5fQ2hlY2tlZFJlY29yZEFycmF5Lmxlbmd0aCAtIDFdO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBDbGVhckFsbENoZWNrQm94OiBmdW5jdGlvbiBDbGVhckFsbENoZWNrQm94KCkge1xuICAgIHRoaXMuXyRFbGVtLmZpbmQoXCI6Y2hlY2tib3hcIikucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcblxuICAgIHRoaXMuX0NoZWNrZWRSZWNvcmRBcnJheSA9IFtdO1xuICB9LFxuICBTZXRDaGVja0JveFRvQ2hlY2tlZFN0YXR1czogZnVuY3Rpb24gU2V0Q2hlY2tCb3hUb0NoZWNrZWRTdGF0dXMoaWQpIHtcbiAgICB0aGlzLl8kRWxlbS5maW5kKFwiW3Jvd19jaGVja2JveF9yZWNvcmRfaWQ9J1wiICsgaWQgKyBcIiddOmNoZWNrYm94XCIpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcblxuICAgIHRoaXMuU2F2ZUNoZWNrZWRSb3dEYXRhKGlkKTtcbiAgfSxcbiAgX19Jbm5lckVsZW1HZXRJbnN0YW5jZTogZnVuY3Rpb24gX19Jbm5lckVsZW1HZXRJbnN0YW5jZSgkaW5uZXJFbGVtKSB7XG4gICAgdmFyICRXTERDVF9MaXN0VGFibGVDb250YWluZXIgPSAkaW5uZXJFbGVtLnBhcmVudHMoXCJbc2luZ2xlbmFtZT0nV0xEQ1RfTGlzdFRhYmxlQ29udGFpbmVyJ11cIik7XG4gICAgdmFyIGxpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlID0gSFRNTENvbnRyb2wuR2V0Q29udHJvbEluc3RhbmNlQnlFbGVtKCRXTERDVF9MaXN0VGFibGVDb250YWluZXIpO1xuICAgIHJldHVybiBsaXN0VGFibGVDb250YWluZXJJbnN0YW5jZTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RUYWJsZUlubmVyQnV0dG9uQ29udGFpbmVyID0ge1xuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKF9yZW5kZXJlckNoYWluUGFyYXMpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gX3JlbmRlcmVyQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdmFyICRkaXZDVEVsZW0gPSAkc2luZ2xlQ29udHJvbEVsZW0uZmluZChcImRpdlwiICsgSFRNTENvbnRyb2xBdHRycy5TRUxFQ1RFRF9KQlVJTEQ0RENfQ1VTVE9NKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uaHRtbChcIlwiKTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uYXBwZW5kKCRkaXZDVEVsZW0pO1xuICB9LFxuICBSZW5kZXJlckRhdGFDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJEYXRhQ2hhaW5cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXTERDVF9MaXN0VGFibGVJbm5lckJ1dHRvblNpbmdsZSA9IHtcbiAgUmVuZGVyZXJDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpbixcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyRGF0YUNoYWluKF9yZW5kZXJlckRhdGFDaGFpblBhcmFzKSB7XG4gICAgdmFyICRzaW5nbGVDb250cm9sRWxlbSA9IF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uYmluZChcImNsaWNrXCIsIHtcbiAgICAgIFwic2VsZkluc3RhbmNlXCI6IHRoaXMsXG4gICAgICBcIiRlbGVtXCI6ICRzaW5nbGVDb250cm9sRWxlbSxcbiAgICAgIHJvd0RhdGE6IF9yZW5kZXJlckRhdGFDaGFpblBhcmFzLnJvd0RhdGFcbiAgICB9LCB0aGlzLkNsaWNrRXZlbnQpO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5odG1sKFwiXCIpO1xuICAgICRzaW5nbGVDb250cm9sRWxlbS5hdHRyKFwidGl0bGVcIiwgJHNpbmdsZUNvbnRyb2xFbGVtLmF0dHIoXCJjYXB0aW9uXCIpKTtcbiAgfSxcbiAgQ2xpY2tFdmVudDogZnVuY3Rpb24gQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICBjb25zb2xlLmxvZyhzZW5kZXIuZGF0YS5yb3dEYXRhLklEKTtcbiAgICB2YXIgJGVsZW0gPSBzZW5kZXIuZGF0YS4kZWxlbTtcbiAgICBjb25zb2xlLmxvZygkZWxlbSk7XG4gICAgdmFyIHRhcmdldGJ1dHRvbmlkID0gJGVsZW0uYXR0cihcInRhcmdldGJ1dHRvbmlkXCIpO1xuXG4gICAgdmFyIGxpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlID0gV0xEQ1RfTGlzdFRhYmxlQ29udGFpbmVyLl9fSW5uZXJFbGVtR2V0SW5zdGFuY2UoJGVsZW0pO1xuXG4gICAgbGlzdFRhYmxlQ29udGFpbmVySW5zdGFuY2UuQ2xlYXJBbGxDaGVja0JveCgpO1xuICAgIGxpc3RUYWJsZUNvbnRhaW5lckluc3RhbmNlLlNldENoZWNrQm94VG9DaGVja2VkU3RhdHVzKHNlbmRlci5kYXRhLnJvd0RhdGEuSUQpO1xuICAgIGNvbnNvbGUubG9nKHRhcmdldGJ1dHRvbmlkKTtcbiAgICAkKFwiYnV0dG9uI1wiICsgdGFyZ2V0YnV0dG9uaWQpLnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgICBjb25zb2xlLmxvZyhsaXN0VGFibGVDb250YWluZXJJbnN0YW5jZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXTERDVF9MaXN0VGFibGVMYWJlbCA9IHtcbiAgUmVuZGVyZXJDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpbixcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyRGF0YUNoYWluKF9yZW5kZXJlckRhdGFDaGFpblBhcmFzKSB7XG4gICAgdmFyIHZhbHVlID0gX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMudmFsO1xuICAgIHZhciAkdGQgPSBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcy4kdGQ7XG4gICAgJHRkLmNzcyhcInRleHRBbGlnblwiLCBcImNlbnRlclwiKTtcbiAgICAkdGQuaHRtbCh2YWx1ZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXTERDVF9TZWFyY2hfVGV4dEJveCA9IHtcbiAgUmVuZGVyZXJDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpbixcbiAgUmVuZGVyZXJEYXRhQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyRGF0YUNoYWluLFxuICBHZXRWYWx1ZTogSFRNTENvbnRyb2wuR2V0VmFsdWVcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFsnanF1ZXJ5JywgJ2RhdGF0YWJsZXMubmV0J10sIGZ1bmN0aW9uICgkKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeSgkLCB3aW5kb3csIGRvY3VtZW50KTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICgodHlwZW9mIGV4cG9ydHMgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihleHBvcnRzKSkgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm9vdCwgJCkge1xuICAgICAgaWYgKCFyb290KSB7XG4gICAgICAgIHJvb3QgPSB3aW5kb3c7XG4gICAgICB9XG5cbiAgICAgIGlmICghJCB8fCAhJC5mbi5kYXRhVGFibGUpIHtcbiAgICAgICAgJCA9IHJlcXVpcmUoJ2RhdGF0YWJsZXMubmV0Jykocm9vdCwgJCkuJDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhY3RvcnkoJCwgcm9vdCwgcm9vdC5kb2N1bWVudCk7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBmYWN0b3J5KGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG4gIH1cbn0pKGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBEYXRhVGFibGUgPSAkLmZuLmRhdGFUYWJsZTtcblxuICB2YXIgX2ZpcmVmb3hTY3JvbGw7XG5cbiAgdmFyIEZpeGVkQ29sdW1ucyA9IGZ1bmN0aW9uIEZpeGVkQ29sdW1ucyhkdCwgaW5pdCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBGaXhlZENvbHVtbnMpKSB7XG4gICAgICBhbGVydChcIkZpeGVkQ29sdW1ucyB3YXJuaW5nOiBGaXhlZENvbHVtbnMgbXVzdCBiZSBpbml0aWFsaXNlZCB3aXRoIHRoZSAnbmV3JyBrZXl3b3JkLlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaW5pdCA9PT0gdW5kZWZpbmVkIHx8IGluaXQgPT09IHRydWUpIHtcbiAgICAgIGluaXQgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgY2FtZWxUb0h1bmdhcmlhbiA9ICQuZm4uZGF0YVRhYmxlLmNhbWVsVG9IdW5nYXJpYW47XG5cbiAgICBpZiAoY2FtZWxUb0h1bmdhcmlhbikge1xuICAgICAgY2FtZWxUb0h1bmdhcmlhbihGaXhlZENvbHVtbnMuZGVmYXVsdHMsIEZpeGVkQ29sdW1ucy5kZWZhdWx0cywgdHJ1ZSk7XG4gICAgICBjYW1lbFRvSHVuZ2FyaWFuKEZpeGVkQ29sdW1ucy5kZWZhdWx0cywgaW5pdCk7XG4gICAgfVxuXG4gICAgdmFyIGR0U2V0dGluZ3MgPSBuZXcgJC5mbi5kYXRhVGFibGUuQXBpKGR0KS5zZXR0aW5ncygpWzBdO1xuICAgIHRoaXMucyA9IHtcbiAgICAgIFwiZHRcIjogZHRTZXR0aW5ncyxcbiAgICAgIFwiaVRhYmxlQ29sdW1uc1wiOiBkdFNldHRpbmdzLmFvQ29sdW1ucy5sZW5ndGgsXG4gICAgICBcImFpT3V0ZXJXaWR0aHNcIjogW10sXG4gICAgICBcImFpSW5uZXJXaWR0aHNcIjogW10sXG4gICAgICBydGw6ICQoZHRTZXR0aW5ncy5uVGFibGUpLmNzcygnZGlyZWN0aW9uJykgPT09ICdydGwnXG4gICAgfTtcbiAgICB0aGlzLmRvbSA9IHtcbiAgICAgIFwic2Nyb2xsZXJcIjogbnVsbCxcbiAgICAgIFwiaGVhZGVyXCI6IG51bGwsXG4gICAgICBcImJvZHlcIjogbnVsbCxcbiAgICAgIFwiZm9vdGVyXCI6IG51bGwsXG4gICAgICBcImdyaWRcIjoge1xuICAgICAgICBcIndyYXBwZXJcIjogbnVsbCxcbiAgICAgICAgXCJkdFwiOiBudWxsLFxuICAgICAgICBcImxlZnRcIjoge1xuICAgICAgICAgIFwid3JhcHBlclwiOiBudWxsLFxuICAgICAgICAgIFwiaGVhZFwiOiBudWxsLFxuICAgICAgICAgIFwiYm9keVwiOiBudWxsLFxuICAgICAgICAgIFwiZm9vdFwiOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIFwicmlnaHRcIjoge1xuICAgICAgICAgIFwid3JhcHBlclwiOiBudWxsLFxuICAgICAgICAgIFwiaGVhZFwiOiBudWxsLFxuICAgICAgICAgIFwiYm9keVwiOiBudWxsLFxuICAgICAgICAgIFwiZm9vdFwiOiBudWxsXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImNsb25lXCI6IHtcbiAgICAgICAgXCJsZWZ0XCI6IHtcbiAgICAgICAgICBcImhlYWRlclwiOiBudWxsLFxuICAgICAgICAgIFwiYm9keVwiOiBudWxsLFxuICAgICAgICAgIFwiZm9vdGVyXCI6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgXCJyaWdodFwiOiB7XG4gICAgICAgICAgXCJoZWFkZXJcIjogbnVsbCxcbiAgICAgICAgICBcImJvZHlcIjogbnVsbCxcbiAgICAgICAgICBcImZvb3RlclwiOiBudWxsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGR0U2V0dGluZ3MuX29GaXhlZENvbHVtbnMpIHtcbiAgICAgIHRocm93ICdGaXhlZENvbHVtbnMgYWxyZWFkeSBpbml0aWFsaXNlZCBvbiB0aGlzIHRhYmxlJztcbiAgICB9XG5cbiAgICBkdFNldHRpbmdzLl9vRml4ZWRDb2x1bW5zID0gdGhpcztcblxuICAgIGlmICghZHRTZXR0aW5ncy5fYkluaXRDb21wbGV0ZSkge1xuICAgICAgZHRTZXR0aW5ncy5vQXBpLl9mbkNhbGxiYWNrUmVnKGR0U2V0dGluZ3MsICdhb0luaXRDb21wbGV0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5fZm5Db25zdHJ1Y3QoaW5pdCk7XG4gICAgICB9LCAnRml4ZWRDb2x1bW5zJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2ZuQ29uc3RydWN0KGluaXQpO1xuICAgIH1cbiAgfTtcblxuICAkLmV4dGVuZChGaXhlZENvbHVtbnMucHJvdG90eXBlLCB7XG4gICAgXCJmblVwZGF0ZVwiOiBmdW5jdGlvbiBmblVwZGF0ZSgpIHtcbiAgICAgIHRoaXMuX2ZuRHJhdyh0cnVlKTtcbiAgICB9LFxuICAgIFwiZm5SZWRyYXdMYXlvdXRcIjogZnVuY3Rpb24gZm5SZWRyYXdMYXlvdXQoKSB7XG4gICAgICB0aGlzLl9mbkNvbENhbGMoKTtcblxuICAgICAgdGhpcy5fZm5HcmlkTGF5b3V0KCk7XG5cbiAgICAgIHRoaXMuZm5VcGRhdGUoKTtcbiAgICB9LFxuICAgIFwiZm5SZWNhbGN1bGF0ZUhlaWdodFwiOiBmdW5jdGlvbiBmblJlY2FsY3VsYXRlSGVpZ2h0KG5Ucikge1xuICAgICAgZGVsZXRlIG5Uci5fRFRUQ19pSGVpZ2h0O1xuICAgICAgblRyLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICB9LFxuICAgIFwiZm5TZXRSb3dIZWlnaHRcIjogZnVuY3Rpb24gZm5TZXRSb3dIZWlnaHQoblRhcmdldCwgaUhlaWdodCkge1xuICAgICAgblRhcmdldC5zdHlsZS5oZWlnaHQgPSBpSGVpZ2h0ICsgXCJweFwiO1xuICAgIH0sXG4gICAgXCJmbkdldFBvc2l0aW9uXCI6IGZ1bmN0aW9uIGZuR2V0UG9zaXRpb24obm9kZSkge1xuICAgICAgdmFyIGlkeDtcbiAgICAgIHZhciBpbnN0ID0gdGhpcy5zLmR0Lm9JbnN0YW5jZTtcblxuICAgICAgaWYgKCEkKG5vZGUpLnBhcmVudHMoJy5EVEZDX0Nsb25lZCcpLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gaW5zdC5mbkdldFBvc2l0aW9uKG5vZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RyJykge1xuICAgICAgICAgIGlkeCA9ICQobm9kZSkuaW5kZXgoKTtcbiAgICAgICAgICByZXR1cm4gaW5zdC5mbkdldFBvc2l0aW9uKCQoJ3RyJywgdGhpcy5zLmR0Lm5UQm9keSlbaWR4XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGNvbElkeCA9ICQobm9kZSkuaW5kZXgoKTtcbiAgICAgICAgICBpZHggPSAkKG5vZGUucGFyZW50Tm9kZSkuaW5kZXgoKTtcbiAgICAgICAgICB2YXIgcm93ID0gaW5zdC5mbkdldFBvc2l0aW9uKCQoJ3RyJywgdGhpcy5zLmR0Lm5UQm9keSlbaWR4XSk7XG4gICAgICAgICAgcmV0dXJuIFtyb3csIGNvbElkeCwgaW5zdC5vQXBpLl9mblZpc2libGVUb0NvbHVtbkluZGV4KHRoaXMucy5kdCwgY29sSWR4KV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIFwiX2ZuQ29uc3RydWN0XCI6IGZ1bmN0aW9uIF9mbkNvbnN0cnVjdChvSW5pdCkge1xuICAgICAgdmFyIGksXG4gICAgICAgICAgaUxlbixcbiAgICAgICAgICBpV2lkdGgsXG4gICAgICAgICAgdGhhdCA9IHRoaXM7XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5zLmR0Lm9JbnN0YW5jZS5mblZlcnNpb25DaGVjayAhPSAnZnVuY3Rpb24nIHx8IHRoaXMucy5kdC5vSW5zdGFuY2UuZm5WZXJzaW9uQ2hlY2soJzEuOC4wJykgIT09IHRydWUpIHtcbiAgICAgICAgYWxlcnQoXCJGaXhlZENvbHVtbnMgXCIgKyBGaXhlZENvbHVtbnMuVkVSU0lPTiArIFwiIHJlcXVpcmVkIERhdGFUYWJsZXMgMS44LjAgb3IgbGF0ZXIuIFwiICsgXCJQbGVhc2UgdXBncmFkZSB5b3VyIERhdGFUYWJsZXMgaW5zdGFsbGF0aW9uXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnMuZHQub1Njcm9sbC5zWCA9PT0gXCJcIikge1xuICAgICAgICB0aGlzLnMuZHQub0luc3RhbmNlLm9BcGkuX2ZuTG9nKHRoaXMucy5kdCwgMSwgXCJGaXhlZENvbHVtbnMgaXMgbm90IG5lZWRlZCAobm8gXCIgKyBcIngtc2Nyb2xsaW5nIGluIERhdGFUYWJsZXMgZW5hYmxlZCksIHNvIG5vIGFjdGlvbiB3aWxsIGJlIHRha2VuLiBVc2UgJ0ZpeGVkSGVhZGVyJyBmb3IgXCIgKyBcImNvbHVtbiBmaXhpbmcgd2hlbiBzY3JvbGxpbmcgaXMgbm90IGVuYWJsZWRcIik7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnMgPSAkLmV4dGVuZCh0cnVlLCB0aGlzLnMsIEZpeGVkQ29sdW1ucy5kZWZhdWx0cywgb0luaXQpO1xuICAgICAgdmFyIGNsYXNzZXMgPSB0aGlzLnMuZHQub0NsYXNzZXM7XG4gICAgICB0aGlzLmRvbS5ncmlkLmR0ID0gJCh0aGlzLnMuZHQublRhYmxlKS5wYXJlbnRzKCdkaXYuJyArIGNsYXNzZXMuc1Njcm9sbFdyYXBwZXIpWzBdO1xuICAgICAgdGhpcy5kb20uc2Nyb2xsZXIgPSAkKCdkaXYuJyArIGNsYXNzZXMuc1Njcm9sbEJvZHksIHRoaXMuZG9tLmdyaWQuZHQpWzBdO1xuXG4gICAgICB0aGlzLl9mbkNvbENhbGMoKTtcblxuICAgICAgdGhpcy5fZm5HcmlkU2V0dXAoKTtcblxuICAgICAgdmFyIG1vdXNlQ29udHJvbGxlcjtcbiAgICAgIHZhciBtb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICQodGhpcy5zLmR0Lm5UYWJsZVdyYXBwZXIpLm9uKCdtb3VzZWRvd24uRFRGQycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLmJ1dHRvbiA9PT0gMCkge1xuICAgICAgICAgIG1vdXNlRG93biA9IHRydWU7XG4gICAgICAgICAgJChkb2N1bWVudCkub25lKCdtb3VzZXVwJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgJCh0aGlzLmRvbS5zY3JvbGxlcikub24oJ21vdXNlb3Zlci5EVEZDIHRvdWNoc3RhcnQuRFRGQycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFtb3VzZURvd24pIHtcbiAgICAgICAgICBtb3VzZUNvbnRyb2xsZXIgPSAnbWFpbic7XG4gICAgICAgIH1cbiAgICAgIH0pLm9uKCdzY3JvbGwuRFRGQycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICghbW91c2VDb250cm9sbGVyICYmIGUub3JpZ2luYWxFdmVudCkge1xuICAgICAgICAgIG1vdXNlQ29udHJvbGxlciA9ICdtYWluJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb3VzZUNvbnRyb2xsZXIgPT09ICdtYWluJykge1xuICAgICAgICAgIGlmICh0aGF0LnMuaUxlZnRDb2x1bW5zID4gMCkge1xuICAgICAgICAgICAgdGhhdC5kb20uZ3JpZC5sZWZ0LmxpbmVyLnNjcm9sbFRvcCA9IHRoYXQuZG9tLnNjcm9sbGVyLnNjcm9sbFRvcDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhhdC5zLmlSaWdodENvbHVtbnMgPiAwKSB7XG4gICAgICAgICAgICB0aGF0LmRvbS5ncmlkLnJpZ2h0LmxpbmVyLnNjcm9sbFRvcCA9IHRoYXQuZG9tLnNjcm9sbGVyLnNjcm9sbFRvcDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdmFyIHdoZWVsVHlwZSA9ICdvbndoZWVsJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSA/ICd3aGVlbC5EVEZDJyA6ICdtb3VzZXdoZWVsLkRURkMnO1xuXG4gICAgICBpZiAodGhhdC5zLmlMZWZ0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgJCh0aGF0LmRvbS5ncmlkLmxlZnQubGluZXIpLm9uKCdtb3VzZW92ZXIuRFRGQyB0b3VjaHN0YXJ0LkRURkMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFtb3VzZURvd24pIHtcbiAgICAgICAgICAgIG1vdXNlQ29udHJvbGxlciA9ICdsZWZ0JztcbiAgICAgICAgICB9XG4gICAgICAgIH0pLm9uKCdzY3JvbGwuRFRGQycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgaWYgKCFtb3VzZUNvbnRyb2xsZXIgJiYgZS5vcmlnaW5hbEV2ZW50KSB7XG4gICAgICAgICAgICBtb3VzZUNvbnRyb2xsZXIgPSAnbGVmdCc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG1vdXNlQ29udHJvbGxlciA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICB0aGF0LmRvbS5zY3JvbGxlci5zY3JvbGxUb3AgPSB0aGF0LmRvbS5ncmlkLmxlZnQubGluZXIuc2Nyb2xsVG9wO1xuXG4gICAgICAgICAgICBpZiAodGhhdC5zLmlSaWdodENvbHVtbnMgPiAwKSB7XG4gICAgICAgICAgICAgIHRoYXQuZG9tLmdyaWQucmlnaHQubGluZXIuc2Nyb2xsVG9wID0gdGhhdC5kb20uZ3JpZC5sZWZ0LmxpbmVyLnNjcm9sbFRvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pLm9uKHdoZWVsVHlwZSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgeERlbHRhID0gZS50eXBlID09PSAnd2hlZWwnID8gLWUub3JpZ2luYWxFdmVudC5kZWx0YVggOiBlLm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YVg7XG4gICAgICAgICAgdGhhdC5kb20uc2Nyb2xsZXIuc2Nyb2xsTGVmdCAtPSB4RGVsdGE7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhhdC5zLmlSaWdodENvbHVtbnMgPiAwKSB7XG4gICAgICAgICQodGhhdC5kb20uZ3JpZC5yaWdodC5saW5lcikub24oJ21vdXNlb3Zlci5EVEZDIHRvdWNoc3RhcnQuRFRGQycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIW1vdXNlRG93bikge1xuICAgICAgICAgICAgbW91c2VDb250cm9sbGVyID0gJ3JpZ2h0JztcbiAgICAgICAgICB9XG4gICAgICAgIH0pLm9uKCdzY3JvbGwuRFRGQycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgaWYgKCFtb3VzZUNvbnRyb2xsZXIgJiYgZS5vcmlnaW5hbEV2ZW50KSB7XG4gICAgICAgICAgICBtb3VzZUNvbnRyb2xsZXIgPSAncmlnaHQnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChtb3VzZUNvbnRyb2xsZXIgPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgIHRoYXQuZG9tLnNjcm9sbGVyLnNjcm9sbFRvcCA9IHRoYXQuZG9tLmdyaWQucmlnaHQubGluZXIuc2Nyb2xsVG9wO1xuXG4gICAgICAgICAgICBpZiAodGhhdC5zLmlMZWZ0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgICAgICAgdGhhdC5kb20uZ3JpZC5sZWZ0LmxpbmVyLnNjcm9sbFRvcCA9IHRoYXQuZG9tLmdyaWQucmlnaHQubGluZXIuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkub24od2hlZWxUeXBlLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHZhciB4RGVsdGEgPSBlLnR5cGUgPT09ICd3aGVlbCcgPyAtZS5vcmlnaW5hbEV2ZW50LmRlbHRhWCA6IGUub3JpZ2luYWxFdmVudC53aGVlbERlbHRhWDtcbiAgICAgICAgICB0aGF0LmRvbS5zY3JvbGxlci5zY3JvbGxMZWZ0IC09IHhEZWx0YTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgICQod2luZG93KS5vbigncmVzaXplLkRURkMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQuX2ZuR3JpZExheW91dC5jYWxsKHRoYXQpO1xuICAgICAgfSk7XG4gICAgICB2YXIgYkZpcnN0RHJhdyA9IHRydWU7XG4gICAgICB2YXIganFUYWJsZSA9ICQodGhpcy5zLmR0Lm5UYWJsZSk7XG4gICAgICBqcVRhYmxlLm9uKCdkcmF3LmR0LkRURkMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQuX2ZuQ29sQ2FsYygpO1xuXG4gICAgICAgIHRoYXQuX2ZuRHJhdy5jYWxsKHRoYXQsIGJGaXJzdERyYXcpO1xuXG4gICAgICAgIGJGaXJzdERyYXcgPSBmYWxzZTtcbiAgICAgIH0pLm9uKCdjb2x1bW4tc2l6aW5nLmR0LkRURkMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQuX2ZuQ29sQ2FsYygpO1xuXG4gICAgICAgIHRoYXQuX2ZuR3JpZExheW91dCh0aGF0KTtcbiAgICAgIH0pLm9uKCdjb2x1bW4tdmlzaWJpbGl0eS5kdC5EVEZDJywgZnVuY3Rpb24gKGUsIHNldHRpbmdzLCBjb2x1bW4sIHZpcywgcmVjYWxjKSB7XG4gICAgICAgIGlmIChyZWNhbGMgPT09IHVuZGVmaW5lZCB8fCByZWNhbGMpIHtcbiAgICAgICAgICB0aGF0Ll9mbkNvbENhbGMoKTtcblxuICAgICAgICAgIHRoYXQuX2ZuR3JpZExheW91dCh0aGF0KTtcblxuICAgICAgICAgIHRoYXQuX2ZuRHJhdyh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSkub24oJ3NlbGVjdC5kdC5EVEZDIGRlc2VsZWN0LmR0LkRURkMnLCBmdW5jdGlvbiAoZSwgZHQsIHR5cGUsIGluZGV4ZXMpIHtcbiAgICAgICAgaWYgKGUubmFtZXNwYWNlID09PSAnZHQnKSB7XG4gICAgICAgICAgdGhhdC5fZm5EcmF3KGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSkub24oJ2Rlc3Ryb3kuZHQuRFRGQycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAganFUYWJsZS5vZmYoJy5EVEZDJyk7XG4gICAgICAgICQodGhhdC5kb20uc2Nyb2xsZXIpLm9mZignLkRURkMnKTtcbiAgICAgICAgJCh3aW5kb3cpLm9mZignLkRURkMnKTtcbiAgICAgICAgJCh0aGF0LnMuZHQublRhYmxlV3JhcHBlcikub2ZmKCcuRFRGQycpO1xuICAgICAgICAkKHRoYXQuZG9tLmdyaWQubGVmdC5saW5lcikub2ZmKCcuRFRGQyAnICsgd2hlZWxUeXBlKTtcbiAgICAgICAgJCh0aGF0LmRvbS5ncmlkLmxlZnQud3JhcHBlcikucmVtb3ZlKCk7XG4gICAgICAgICQodGhhdC5kb20uZ3JpZC5yaWdodC5saW5lcikub2ZmKCcuRFRGQyAnICsgd2hlZWxUeXBlKTtcbiAgICAgICAgJCh0aGF0LmRvbS5ncmlkLnJpZ2h0LndyYXBwZXIpLnJlbW92ZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX2ZuR3JpZExheW91dCgpO1xuXG4gICAgICB0aGlzLnMuZHQub0luc3RhbmNlLmZuRHJhdyhmYWxzZSk7XG4gICAgfSxcbiAgICBcIl9mbkNvbENhbGNcIjogZnVuY3Rpb24gX2ZuQ29sQ2FsYygpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgIHZhciBpTGVmdFdpZHRoID0gMDtcbiAgICAgIHZhciBpUmlnaHRXaWR0aCA9IDA7XG4gICAgICB0aGlzLnMuYWlJbm5lcldpZHRocyA9IFtdO1xuICAgICAgdGhpcy5zLmFpT3V0ZXJXaWR0aHMgPSBbXTtcbiAgICAgICQuZWFjaCh0aGlzLnMuZHQuYW9Db2x1bW5zLCBmdW5jdGlvbiAoaSwgY29sKSB7XG4gICAgICAgIHZhciB0aCA9ICQoY29sLm5UaCk7XG4gICAgICAgIHZhciBib3JkZXI7XG5cbiAgICAgICAgaWYgKCF0aC5maWx0ZXIoJzp2aXNpYmxlJykubGVuZ3RoKSB7XG4gICAgICAgICAgdGhhdC5zLmFpSW5uZXJXaWR0aHMucHVzaCgwKTtcbiAgICAgICAgICB0aGF0LnMuYWlPdXRlcldpZHRocy5wdXNoKDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBpV2lkdGggPSB0aC5vdXRlcldpZHRoKCk7XG5cbiAgICAgICAgICBpZiAodGhhdC5zLmFpT3V0ZXJXaWR0aHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBib3JkZXIgPSAkKHRoYXQucy5kdC5uVGFibGUpLmNzcygnYm9yZGVyLWxlZnQtd2lkdGgnKTtcbiAgICAgICAgICAgIGlXaWR0aCArPSB0eXBlb2YgYm9yZGVyID09PSAnc3RyaW5nJyAmJiBib3JkZXIuaW5kZXhPZigncHgnKSA9PT0gLTEgPyAxIDogcGFyc2VJbnQoYm9yZGVyLCAxMCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoYXQucy5haU91dGVyV2lkdGhzLmxlbmd0aCA9PT0gdGhhdC5zLmR0LmFvQ29sdW1ucy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBib3JkZXIgPSAkKHRoYXQucy5kdC5uVGFibGUpLmNzcygnYm9yZGVyLXJpZ2h0LXdpZHRoJyk7XG4gICAgICAgICAgICBpV2lkdGggKz0gdHlwZW9mIGJvcmRlciA9PT0gJ3N0cmluZycgJiYgYm9yZGVyLmluZGV4T2YoJ3B4JykgPT09IC0xID8gMSA6IHBhcnNlSW50KGJvcmRlciwgMTApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoYXQucy5haU91dGVyV2lkdGhzLnB1c2goaVdpZHRoKTtcbiAgICAgICAgICB0aGF0LnMuYWlJbm5lcldpZHRocy5wdXNoKHRoLndpZHRoKCkpO1xuXG4gICAgICAgICAgaWYgKGkgPCB0aGF0LnMuaUxlZnRDb2x1bW5zKSB7XG4gICAgICAgICAgICBpTGVmdFdpZHRoICs9IGlXaWR0aDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhhdC5zLmlUYWJsZUNvbHVtbnMgLSB0aGF0LnMuaVJpZ2h0Q29sdW1ucyA8PSBpKSB7XG4gICAgICAgICAgICBpUmlnaHRXaWR0aCArPSBpV2lkdGg7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMucy5pTGVmdFdpZHRoID0gaUxlZnRXaWR0aDtcbiAgICAgIHRoaXMucy5pUmlnaHRXaWR0aCA9IGlSaWdodFdpZHRoO1xuICAgIH0sXG4gICAgXCJfZm5HcmlkU2V0dXBcIjogZnVuY3Rpb24gX2ZuR3JpZFNldHVwKCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICB2YXIgb092ZXJmbG93ID0gdGhpcy5fZm5EVE92ZXJmbG93KCk7XG5cbiAgICAgIHZhciBibG9jaztcbiAgICAgIHRoaXMuZG9tLmJvZHkgPSB0aGlzLnMuZHQublRhYmxlO1xuICAgICAgdGhpcy5kb20uaGVhZGVyID0gdGhpcy5zLmR0Lm5USGVhZC5wYXJlbnROb2RlO1xuICAgICAgdGhpcy5kb20uaGVhZGVyLnBhcmVudE5vZGUucGFyZW50Tm9kZS5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcbiAgICAgIHZhciBuU1dyYXBwZXIgPSAkKCc8ZGl2IGNsYXNzPVwiRFRGQ19TY3JvbGxXcmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTsgY2xlYXI6Ym90aDtcIj4nICsgJzxkaXYgY2xhc3M9XCJEVEZDX0xlZnRXcmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTsgdG9wOjA7IGxlZnQ6MDtcIiBhcmlhLWhpZGRlbj1cInRydWVcIj4nICsgJzxkaXYgY2xhc3M9XCJEVEZDX0xlZnRIZWFkV3JhcHBlclwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7IHRvcDowOyBsZWZ0OjA7IG92ZXJmbG93OmhpZGRlbjtcIj48L2Rpdj4nICsgJzxkaXYgY2xhc3M9XCJEVEZDX0xlZnRCb2R5V3JhcHBlclwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7IHRvcDowOyBsZWZ0OjA7IG92ZXJmbG93OmhpZGRlbjtcIj4nICsgJzxkaXYgY2xhc3M9XCJEVEZDX0xlZnRCb2R5TGluZXJcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlOyB0b3A6MDsgbGVmdDowOyBvdmVyZmxvdy15OnNjcm9sbDtcIj48L2Rpdj4nICsgJzwvZGl2PicgKyAnPGRpdiBjbGFzcz1cIkRURkNfTGVmdEZvb3RXcmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTsgdG9wOjA7IGxlZnQ6MDsgb3ZlcmZsb3c6aGlkZGVuO1wiPjwvZGl2PicgKyAnPC9kaXY+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19SaWdodFdyYXBwZXJcIiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlOyB0b3A6MDsgcmlnaHQ6MDtcIiBhcmlhLWhpZGRlbj1cInRydWVcIj4nICsgJzxkaXYgY2xhc3M9XCJEVEZDX1JpZ2h0SGVhZFdyYXBwZXJcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlOyB0b3A6MDsgbGVmdDowO1wiPicgKyAnPGRpdiBjbGFzcz1cIkRURkNfUmlnaHRIZWFkQmxvY2tlciBEVEZDX0Jsb2NrZXJcIiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlOyB0b3A6MDsgYm90dG9tOjA7XCI+PC9kaXY+JyArICc8L2Rpdj4nICsgJzxkaXYgY2xhc3M9XCJEVEZDX1JpZ2h0Qm9keVdyYXBwZXJcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlOyB0b3A6MDsgbGVmdDowOyBvdmVyZmxvdzpoaWRkZW47XCI+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19SaWdodEJvZHlMaW5lclwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7IHRvcDowOyBsZWZ0OjA7IG92ZXJmbG93LXk6c2Nyb2xsO1wiPjwvZGl2PicgKyAnPC9kaXY+JyArICc8ZGl2IGNsYXNzPVwiRFRGQ19SaWdodEZvb3RXcmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTsgdG9wOjA7IGxlZnQ6MDtcIj4nICsgJzxkaXYgY2xhc3M9XCJEVEZDX1JpZ2h0Rm9vdEJsb2NrZXIgRFRGQ19CbG9ja2VyXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTsgdG9wOjA7IGJvdHRvbTowO1wiPjwvZGl2PicgKyAnPC9kaXY+JyArICc8L2Rpdj4nICsgJzwvZGl2PicpWzBdO1xuICAgICAgdmFyIG5MZWZ0ID0gblNXcmFwcGVyLmNoaWxkTm9kZXNbMF07XG4gICAgICB2YXIgblJpZ2h0ID0gblNXcmFwcGVyLmNoaWxkTm9kZXNbMV07XG4gICAgICB0aGlzLmRvbS5ncmlkLmR0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5TV3JhcHBlciwgdGhpcy5kb20uZ3JpZC5kdCk7XG4gICAgICBuU1dyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5kb20uZ3JpZC5kdCk7XG4gICAgICB0aGlzLmRvbS5ncmlkLndyYXBwZXIgPSBuU1dyYXBwZXI7XG5cbiAgICAgIGlmICh0aGlzLnMuaUxlZnRDb2x1bW5zID4gMCkge1xuICAgICAgICB0aGlzLmRvbS5ncmlkLmxlZnQud3JhcHBlciA9IG5MZWZ0O1xuICAgICAgICB0aGlzLmRvbS5ncmlkLmxlZnQuaGVhZCA9IG5MZWZ0LmNoaWxkTm9kZXNbMF07XG4gICAgICAgIHRoaXMuZG9tLmdyaWQubGVmdC5ib2R5ID0gbkxlZnQuY2hpbGROb2Rlc1sxXTtcbiAgICAgICAgdGhpcy5kb20uZ3JpZC5sZWZ0LmxpbmVyID0gJCgnZGl2LkRURkNfTGVmdEJvZHlMaW5lcicsIG5TV3JhcHBlcilbMF07XG4gICAgICAgIG5TV3JhcHBlci5hcHBlbmRDaGlsZChuTGVmdCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnMuaVJpZ2h0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgdGhpcy5kb20uZ3JpZC5yaWdodC53cmFwcGVyID0gblJpZ2h0O1xuICAgICAgICB0aGlzLmRvbS5ncmlkLnJpZ2h0LmhlYWQgPSBuUmlnaHQuY2hpbGROb2Rlc1swXTtcbiAgICAgICAgdGhpcy5kb20uZ3JpZC5yaWdodC5ib2R5ID0gblJpZ2h0LmNoaWxkTm9kZXNbMV07XG4gICAgICAgIHRoaXMuZG9tLmdyaWQucmlnaHQubGluZXIgPSAkKCdkaXYuRFRGQ19SaWdodEJvZHlMaW5lcicsIG5TV3JhcHBlcilbMF07XG4gICAgICAgIG5SaWdodC5zdHlsZS5yaWdodCA9IG9PdmVyZmxvdy5iYXIgKyBcInB4XCI7XG4gICAgICAgIGJsb2NrID0gJCgnZGl2LkRURkNfUmlnaHRIZWFkQmxvY2tlcicsIG5TV3JhcHBlcilbMF07XG4gICAgICAgIGJsb2NrLnN0eWxlLndpZHRoID0gb092ZXJmbG93LmJhciArIFwicHhcIjtcbiAgICAgICAgYmxvY2suc3R5bGUucmlnaHQgPSAtb092ZXJmbG93LmJhciArIFwicHhcIjtcbiAgICAgICAgdGhpcy5kb20uZ3JpZC5yaWdodC5oZWFkQmxvY2sgPSBibG9jaztcbiAgICAgICAgYmxvY2sgPSAkKCdkaXYuRFRGQ19SaWdodEZvb3RCbG9ja2VyJywgblNXcmFwcGVyKVswXTtcbiAgICAgICAgYmxvY2suc3R5bGUud2lkdGggPSBvT3ZlcmZsb3cuYmFyICsgXCJweFwiO1xuICAgICAgICBibG9jay5zdHlsZS5yaWdodCA9IC1vT3ZlcmZsb3cuYmFyICsgXCJweFwiO1xuICAgICAgICB0aGlzLmRvbS5ncmlkLnJpZ2h0LmZvb3RCbG9jayA9IGJsb2NrO1xuICAgICAgICBuU1dyYXBwZXIuYXBwZW5kQ2hpbGQoblJpZ2h0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucy5kdC5uVEZvb3QpIHtcbiAgICAgICAgdGhpcy5kb20uZm9vdGVyID0gdGhpcy5zLmR0Lm5URm9vdC5wYXJlbnROb2RlO1xuXG4gICAgICAgIGlmICh0aGlzLnMuaUxlZnRDb2x1bW5zID4gMCkge1xuICAgICAgICAgIHRoaXMuZG9tLmdyaWQubGVmdC5mb290ID0gbkxlZnQuY2hpbGROb2Rlc1syXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnMuaVJpZ2h0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgICB0aGlzLmRvbS5ncmlkLnJpZ2h0LmZvb3QgPSBuUmlnaHQuY2hpbGROb2Rlc1syXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zLnJ0bCkge1xuICAgICAgICAkKCdkaXYuRFRGQ19SaWdodEhlYWRCbG9ja2VyJywgblNXcmFwcGVyKS5jc3Moe1xuICAgICAgICAgIGxlZnQ6IC1vT3ZlcmZsb3cuYmFyICsgJ3B4JyxcbiAgICAgICAgICByaWdodDogJydcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcIl9mbkdyaWRMYXlvdXRcIjogZnVuY3Rpb24gX2ZuR3JpZExheW91dCgpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgIHZhciBvR3JpZCA9IHRoaXMuZG9tLmdyaWQ7XG4gICAgICB2YXIgaVdpZHRoID0gJChvR3JpZC53cmFwcGVyKS53aWR0aCgpO1xuICAgICAgdmFyIGlCb2R5SGVpZ2h0ID0gdGhpcy5zLmR0Lm5UYWJsZS5wYXJlbnROb2RlLm9mZnNldEhlaWdodDtcbiAgICAgIHZhciBpRnVsbEhlaWdodCA9IHRoaXMucy5kdC5uVGFibGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLm9mZnNldEhlaWdodDtcblxuICAgICAgdmFyIG9PdmVyZmxvdyA9IHRoaXMuX2ZuRFRPdmVyZmxvdygpO1xuXG4gICAgICB2YXIgaUxlZnRXaWR0aCA9IHRoaXMucy5pTGVmdFdpZHRoO1xuICAgICAgdmFyIGlSaWdodFdpZHRoID0gdGhpcy5zLmlSaWdodFdpZHRoO1xuICAgICAgdmFyIHJ0bCA9ICQodGhpcy5kb20uYm9keSkuY3NzKCdkaXJlY3Rpb24nKSA9PT0gJ3J0bCc7XG4gICAgICB2YXIgd3JhcHBlcjtcblxuICAgICAgdmFyIHNjcm9sbGJhckFkanVzdCA9IGZ1bmN0aW9uIHNjcm9sbGJhckFkanVzdChub2RlLCB3aWR0aCkge1xuICAgICAgICBpZiAoIW9PdmVyZmxvdy5iYXIpIHtcbiAgICAgICAgICBub2RlLnN0eWxlLndpZHRoID0gd2lkdGggKyAyMCArIFwicHhcIjtcbiAgICAgICAgICBub2RlLnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiMjBweFwiO1xuICAgICAgICAgIG5vZGUuc3R5bGUuYm94U2l6aW5nID0gXCJib3JkZXItYm94XCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhhdC5fZmlyZWZveFNjcm9sbEVycm9yKCkpIHtcbiAgICAgICAgICBpZiAoJChub2RlKS5oZWlnaHQoKSA+IDM0KSB7XG4gICAgICAgICAgICBub2RlLnN0eWxlLndpZHRoID0gd2lkdGggKyBvT3ZlcmZsb3cuYmFyICsgXCJweFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2RlLnN0eWxlLndpZHRoID0gd2lkdGggKyBvT3ZlcmZsb3cuYmFyICsgXCJweFwiO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBpZiAob092ZXJmbG93LngpIHtcbiAgICAgICAgaUJvZHlIZWlnaHQgLT0gb092ZXJmbG93LmJhcjtcbiAgICAgIH1cblxuICAgICAgb0dyaWQud3JhcHBlci5zdHlsZS5oZWlnaHQgPSBpRnVsbEhlaWdodCArIFwicHhcIjtcblxuICAgICAgaWYgKHRoaXMucy5pTGVmdENvbHVtbnMgPiAwKSB7XG4gICAgICAgIHdyYXBwZXIgPSBvR3JpZC5sZWZ0LndyYXBwZXI7XG4gICAgICAgIHdyYXBwZXIuc3R5bGUud2lkdGggPSBpTGVmdFdpZHRoICsgJ3B4JztcbiAgICAgICAgd3JhcHBlci5zdHlsZS5oZWlnaHQgPSAnMXB4JztcblxuICAgICAgICBpZiAocnRsKSB7XG4gICAgICAgICAgd3JhcHBlci5zdHlsZS5sZWZ0ID0gJyc7XG4gICAgICAgICAgd3JhcHBlci5zdHlsZS5yaWdodCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd3JhcHBlci5zdHlsZS5sZWZ0ID0gMDtcbiAgICAgICAgICB3cmFwcGVyLnN0eWxlLnJpZ2h0ID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICBvR3JpZC5sZWZ0LmJvZHkuc3R5bGUuaGVpZ2h0ID0gaUJvZHlIZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgICAgaWYgKG9HcmlkLmxlZnQuZm9vdCkge1xuICAgICAgICAgIG9HcmlkLmxlZnQuZm9vdC5zdHlsZS50b3AgPSAob092ZXJmbG93LnggPyBvT3ZlcmZsb3cuYmFyIDogMCkgKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgICAgICBzY3JvbGxiYXJBZGp1c3Qob0dyaWQubGVmdC5saW5lciwgaUxlZnRXaWR0aCk7XG4gICAgICAgIG9HcmlkLmxlZnQubGluZXIuc3R5bGUuaGVpZ2h0ID0gaUJvZHlIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIG9HcmlkLmxlZnQubGluZXIuc3R5bGUubWF4SGVpZ2h0ID0gaUJvZHlIZWlnaHQgKyBcInB4XCI7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnMuaVJpZ2h0Q29sdW1ucyA+IDApIHtcbiAgICAgICAgd3JhcHBlciA9IG9HcmlkLnJpZ2h0LndyYXBwZXI7XG4gICAgICAgIHdyYXBwZXIuc3R5bGUud2lkdGggPSBpUmlnaHRXaWR0aCArICdweCc7XG4gICAgICAgIHdyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gJzFweCc7XG5cbiAgICAgICAgaWYgKHRoaXMucy5ydGwpIHtcbiAgICAgICAgICB3cmFwcGVyLnN0eWxlLmxlZnQgPSBvT3ZlcmZsb3cueSA/IG9PdmVyZmxvdy5iYXIgKyAncHgnIDogMDtcbiAgICAgICAgICB3cmFwcGVyLnN0eWxlLnJpZ2h0ID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd3JhcHBlci5zdHlsZS5sZWZ0ID0gJyc7XG4gICAgICAgICAgd3JhcHBlci5zdHlsZS5yaWdodCA9IG9PdmVyZmxvdy55ID8gb092ZXJmbG93LmJhciArICdweCcgOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgb0dyaWQucmlnaHQuYm9keS5zdHlsZS5oZWlnaHQgPSBpQm9keUhlaWdodCArIFwicHhcIjtcblxuICAgICAgICBpZiAob0dyaWQucmlnaHQuZm9vdCkge1xuICAgICAgICAgIG9HcmlkLnJpZ2h0LmZvb3Quc3R5bGUudG9wID0gKG9PdmVyZmxvdy54ID8gb092ZXJmbG93LmJhciA6IDApICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgc2Nyb2xsYmFyQWRqdXN0KG9HcmlkLnJpZ2h0LmxpbmVyLCBpUmlnaHRXaWR0aCk7XG4gICAgICAgIG9HcmlkLnJpZ2h0LmxpbmVyLnN0eWxlLmhlaWdodCA9IGlCb2R5SGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICBvR3JpZC5yaWdodC5saW5lci5zdHlsZS5tYXhIZWlnaHQgPSBpQm9keUhlaWdodCArIFwicHhcIjtcbiAgICAgICAgb0dyaWQucmlnaHQuaGVhZEJsb2NrLnN0eWxlLmRpc3BsYXkgPSBvT3ZlcmZsb3cueSA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgICAgIG9HcmlkLnJpZ2h0LmZvb3RCbG9jay5zdHlsZS5kaXNwbGF5ID0gb092ZXJmbG93LnkgPyAnYmxvY2snIDogJ25vbmUnO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJfZm5EVE92ZXJmbG93XCI6IGZ1bmN0aW9uIF9mbkRUT3ZlcmZsb3coKSB7XG4gICAgICB2YXIgblRhYmxlID0gdGhpcy5zLmR0Lm5UYWJsZTtcbiAgICAgIHZhciBuVGFibGVTY3JvbGxCb2R5ID0gblRhYmxlLnBhcmVudE5vZGU7XG4gICAgICB2YXIgb3V0ID0ge1xuICAgICAgICBcInhcIjogZmFsc2UsXG4gICAgICAgIFwieVwiOiBmYWxzZSxcbiAgICAgICAgXCJiYXJcIjogdGhpcy5zLmR0Lm9TY3JvbGwuaUJhcldpZHRoXG4gICAgICB9O1xuXG4gICAgICBpZiAoblRhYmxlLm9mZnNldFdpZHRoID4gblRhYmxlU2Nyb2xsQm9keS5jbGllbnRXaWR0aCkge1xuICAgICAgICBvdXQueCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChuVGFibGUub2Zmc2V0SGVpZ2h0ID4gblRhYmxlU2Nyb2xsQm9keS5jbGllbnRIZWlnaHQpIHtcbiAgICAgICAgb3V0LnkgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG4gICAgXCJfZm5EcmF3XCI6IGZ1bmN0aW9uIF9mbkRyYXcoYkFsbCkge1xuICAgICAgdGhpcy5fZm5HcmlkTGF5b3V0KCk7XG5cbiAgICAgIHRoaXMuX2ZuQ2xvbmVMZWZ0KGJBbGwpO1xuXG4gICAgICB0aGlzLl9mbkNsb25lUmlnaHQoYkFsbCk7XG5cbiAgICAgIGlmICh0aGlzLnMuZm5EcmF3Q2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zLmZuRHJhd0NhbGxiYWNrLmNhbGwodGhpcywgdGhpcy5kb20uY2xvbmUubGVmdCwgdGhpcy5kb20uY2xvbmUucmlnaHQpO1xuICAgICAgfVxuXG4gICAgICAkKHRoaXMpLnRyaWdnZXIoJ2RyYXcuZHRmYycsIHtcbiAgICAgICAgXCJsZWZ0Q2xvbmVcIjogdGhpcy5kb20uY2xvbmUubGVmdCxcbiAgICAgICAgXCJyaWdodENsb25lXCI6IHRoaXMuZG9tLmNsb25lLnJpZ2h0XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFwiX2ZuQ2xvbmVSaWdodFwiOiBmdW5jdGlvbiBfZm5DbG9uZVJpZ2h0KGJBbGwpIHtcbiAgICAgIGlmICh0aGlzLnMuaVJpZ2h0Q29sdW1ucyA8PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgIGksXG4gICAgICAgICAganEsXG4gICAgICAgICAgYWlDb2x1bW5zID0gW107XG5cbiAgICAgIGZvciAoaSA9IHRoaXMucy5pVGFibGVDb2x1bW5zIC0gdGhpcy5zLmlSaWdodENvbHVtbnM7IGkgPCB0aGlzLnMuaVRhYmxlQ29sdW1uczsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLnMuZHQuYW9Db2x1bW5zW2ldLmJWaXNpYmxlKSB7XG4gICAgICAgICAgYWlDb2x1bW5zLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fZm5DbG9uZSh0aGlzLmRvbS5jbG9uZS5yaWdodCwgdGhpcy5kb20uZ3JpZC5yaWdodCwgYWlDb2x1bW5zLCBiQWxsKTtcbiAgICB9LFxuICAgIFwiX2ZuQ2xvbmVMZWZ0XCI6IGZ1bmN0aW9uIF9mbkNsb25lTGVmdChiQWxsKSB7XG4gICAgICBpZiAodGhpcy5zLmlMZWZ0Q29sdW1ucyA8PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgIGksXG4gICAgICAgICAganEsXG4gICAgICAgICAgYWlDb2x1bW5zID0gW107XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnMuaUxlZnRDb2x1bW5zOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMucy5kdC5hb0NvbHVtbnNbaV0uYlZpc2libGUpIHtcbiAgICAgICAgICBhaUNvbHVtbnMucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9mbkNsb25lKHRoaXMuZG9tLmNsb25lLmxlZnQsIHRoaXMuZG9tLmdyaWQubGVmdCwgYWlDb2x1bW5zLCBiQWxsKTtcbiAgICB9LFxuICAgIFwiX2ZuQ29weUxheW91dFwiOiBmdW5jdGlvbiBfZm5Db3B5TGF5b3V0KGFvT3JpZ2luYWwsIGFpQ29sdW1ucywgZXZlbnRzKSB7XG4gICAgICB2YXIgYVJldHVybiA9IFtdO1xuICAgICAgdmFyIGFDbG9uZXMgPSBbXTtcbiAgICAgIHZhciBhQ2xvbmVkID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gYW9PcmlnaW5hbC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcbiAgICAgICAgdmFyIGFSb3cgPSBbXTtcbiAgICAgICAgYVJvdy5uVHIgPSAkKGFvT3JpZ2luYWxbaV0ublRyKS5jbG9uZShldmVudHMsIGZhbHNlKVswXTtcblxuICAgICAgICBmb3IgKHZhciBqID0gMCwgakxlbiA9IHRoaXMucy5pVGFibGVDb2x1bW5zOyBqIDwgakxlbjsgaisrKSB7XG4gICAgICAgICAgaWYgKCQuaW5BcnJheShqLCBhaUNvbHVtbnMpID09PSAtMSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGlDbG9uZWQgPSAkLmluQXJyYXkoYW9PcmlnaW5hbFtpXVtqXS5jZWxsLCBhQ2xvbmVkKTtcblxuICAgICAgICAgIGlmIChpQ2xvbmVkID09PSAtMSkge1xuICAgICAgICAgICAgdmFyIG5DbG9uZSA9ICQoYW9PcmlnaW5hbFtpXVtqXS5jZWxsKS5jbG9uZShldmVudHMsIGZhbHNlKVswXTtcbiAgICAgICAgICAgIGFDbG9uZXMucHVzaChuQ2xvbmUpO1xuICAgICAgICAgICAgYUNsb25lZC5wdXNoKGFvT3JpZ2luYWxbaV1bal0uY2VsbCk7XG4gICAgICAgICAgICBhUm93LnB1c2goe1xuICAgICAgICAgICAgICBcImNlbGxcIjogbkNsb25lLFxuICAgICAgICAgICAgICBcInVuaXF1ZVwiOiBhb09yaWdpbmFsW2ldW2pdLnVuaXF1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFSb3cucHVzaCh7XG4gICAgICAgICAgICAgIFwiY2VsbFwiOiBhQ2xvbmVzW2lDbG9uZWRdLFxuICAgICAgICAgICAgICBcInVuaXF1ZVwiOiBhb09yaWdpbmFsW2ldW2pdLnVuaXF1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYVJldHVybi5wdXNoKGFSb3cpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYVJldHVybjtcbiAgICB9LFxuICAgIFwiX2ZuQ2xvbmVcIjogZnVuY3Rpb24gX2ZuQ2xvbmUob0Nsb25lLCBvR3JpZCwgYWlDb2x1bW5zLCBiQWxsKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgaSxcbiAgICAgICAgICBpTGVuLFxuICAgICAgICAgIGosXG4gICAgICAgICAgakxlbixcbiAgICAgICAgICBqcSxcbiAgICAgICAgICBuVGFyZ2V0LFxuICAgICAgICAgIGlDb2x1bW4sXG4gICAgICAgICAgbkNsb25lLFxuICAgICAgICAgIGlJbmRleCxcbiAgICAgICAgICBhb0Nsb25lTGF5b3V0LFxuICAgICAgICAgIGpxQ2xvbmVUaGVhZCxcbiAgICAgICAgICBhb0ZpeGVkSGVhZGVyLFxuICAgICAgICAgIGR0ID0gdGhpcy5zLmR0O1xuXG4gICAgICBpZiAoYkFsbCkge1xuICAgICAgICAkKG9DbG9uZS5oZWFkZXIpLnJlbW92ZSgpO1xuICAgICAgICBvQ2xvbmUuaGVhZGVyID0gJCh0aGlzLmRvbS5oZWFkZXIpLmNsb25lKHRydWUsIGZhbHNlKVswXTtcbiAgICAgICAgb0Nsb25lLmhlYWRlci5jbGFzc05hbWUgKz0gXCIgRFRGQ19DbG9uZWRcIjtcbiAgICAgICAgb0Nsb25lLmhlYWRlci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICBvR3JpZC5oZWFkLmFwcGVuZENoaWxkKG9DbG9uZS5oZWFkZXIpO1xuICAgICAgICBhb0Nsb25lTGF5b3V0ID0gdGhpcy5fZm5Db3B5TGF5b3V0KGR0LmFvSGVhZGVyLCBhaUNvbHVtbnMsIHRydWUpO1xuICAgICAgICBqcUNsb25lVGhlYWQgPSAkKCc+dGhlYWQnLCBvQ2xvbmUuaGVhZGVyKTtcbiAgICAgICAganFDbG9uZVRoZWFkLmVtcHR5KCk7XG5cbiAgICAgICAgZm9yIChpID0gMCwgaUxlbiA9IGFvQ2xvbmVMYXlvdXQubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgICAganFDbG9uZVRoZWFkWzBdLmFwcGVuZENoaWxkKGFvQ2xvbmVMYXlvdXRbaV0ublRyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGR0Lm9BcGkuX2ZuRHJhd0hlYWQoZHQsIGFvQ2xvbmVMYXlvdXQsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYW9DbG9uZUxheW91dCA9IHRoaXMuX2ZuQ29weUxheW91dChkdC5hb0hlYWRlciwgYWlDb2x1bW5zLCBmYWxzZSk7XG4gICAgICAgIGFvRml4ZWRIZWFkZXIgPSBbXTtcblxuICAgICAgICBkdC5vQXBpLl9mbkRldGVjdEhlYWRlcihhb0ZpeGVkSGVhZGVyLCAkKCc+dGhlYWQnLCBvQ2xvbmUuaGVhZGVyKVswXSk7XG5cbiAgICAgICAgZm9yIChpID0gMCwgaUxlbiA9IGFvQ2xvbmVMYXlvdXQubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgICAgZm9yIChqID0gMCwgakxlbiA9IGFvQ2xvbmVMYXlvdXRbaV0ubGVuZ3RoOyBqIDwgakxlbjsgaisrKSB7XG4gICAgICAgICAgICBhb0ZpeGVkSGVhZGVyW2ldW2pdLmNlbGwuY2xhc3NOYW1lID0gYW9DbG9uZUxheW91dFtpXVtqXS5jZWxsLmNsYXNzTmFtZTtcbiAgICAgICAgICAgICQoJ3NwYW4uRGF0YVRhYmxlc19zb3J0X2ljb24nLCBhb0ZpeGVkSGVhZGVyW2ldW2pdLmNlbGwpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9ICQoJ3NwYW4uRGF0YVRhYmxlc19zb3J0X2ljb24nLCBhb0Nsb25lTGF5b3V0W2ldW2pdLmNlbGwpWzBdLmNsYXNzTmFtZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9mbkVxdWFsaXNlSGVpZ2h0cygndGhlYWQnLCB0aGlzLmRvbS5oZWFkZXIsIG9DbG9uZS5oZWFkZXIpO1xuXG4gICAgICBpZiAodGhpcy5zLnNIZWlnaHRNYXRjaCA9PSAnYXV0bycpIHtcbiAgICAgICAgJCgnPnRib2R5PnRyJywgdGhhdC5kb20uYm9keSkuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuICAgICAgfVxuXG4gICAgICBpZiAob0Nsb25lLmJvZHkgIT09IG51bGwpIHtcbiAgICAgICAgJChvQ2xvbmUuYm9keSkucmVtb3ZlKCk7XG4gICAgICAgIG9DbG9uZS5ib2R5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgb0Nsb25lLmJvZHkgPSAkKHRoaXMuZG9tLmJvZHkpLmNsb25lKHRydWUpWzBdO1xuICAgICAgb0Nsb25lLmJvZHkuY2xhc3NOYW1lICs9IFwiIERURkNfQ2xvbmVkXCI7XG4gICAgICBvQ2xvbmUuYm9keS5zdHlsZS5wYWRkaW5nQm90dG9tID0gZHQub1Njcm9sbC5pQmFyV2lkdGggKyBcInB4XCI7XG4gICAgICBvQ2xvbmUuYm9keS5zdHlsZS5tYXJnaW5Cb3R0b20gPSBkdC5vU2Nyb2xsLmlCYXJXaWR0aCAqIDIgKyBcInB4XCI7XG5cbiAgICAgIGlmIChvQ2xvbmUuYm9keS5nZXRBdHRyaWJ1dGUoJ2lkJykgIT09IG51bGwpIHtcbiAgICAgICAgb0Nsb25lLmJvZHkucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuICAgICAgfVxuXG4gICAgICAkKCc+dGhlYWQ+dHInLCBvQ2xvbmUuYm9keSkuZW1wdHkoKTtcbiAgICAgICQoJz50Zm9vdCcsIG9DbG9uZS5ib2R5KS5yZW1vdmUoKTtcbiAgICAgIHZhciBuQm9keSA9ICQoJ3Rib2R5Jywgb0Nsb25lLmJvZHkpWzBdO1xuICAgICAgJChuQm9keSkuZW1wdHkoKTtcblxuICAgICAgaWYgKGR0LmFpRGlzcGxheS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBuSW5uZXJUaGVhZCA9ICQoJz50aGVhZD50cicsIG9DbG9uZS5ib2R5KVswXTtcblxuICAgICAgICBmb3IgKGlJbmRleCA9IDA7IGlJbmRleCA8IGFpQ29sdW1ucy5sZW5ndGg7IGlJbmRleCsrKSB7XG4gICAgICAgICAgaUNvbHVtbiA9IGFpQ29sdW1uc1tpSW5kZXhdO1xuICAgICAgICAgIG5DbG9uZSA9ICQoZHQuYW9Db2x1bW5zW2lDb2x1bW5dLm5UaCkuY2xvbmUodHJ1ZSlbMF07XG4gICAgICAgICAgbkNsb25lLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgdmFyIG9TdHlsZSA9IG5DbG9uZS5zdHlsZTtcbiAgICAgICAgICBvU3R5bGUucGFkZGluZ1RvcCA9IFwiMFwiO1xuICAgICAgICAgIG9TdHlsZS5wYWRkaW5nQm90dG9tID0gXCIwXCI7XG4gICAgICAgICAgb1N0eWxlLmJvcmRlclRvcFdpZHRoID0gXCIwXCI7XG4gICAgICAgICAgb1N0eWxlLmJvcmRlckJvdHRvbVdpZHRoID0gXCIwXCI7XG4gICAgICAgICAgb1N0eWxlLmhlaWdodCA9IDA7XG4gICAgICAgICAgb1N0eWxlLndpZHRoID0gdGhhdC5zLmFpSW5uZXJXaWR0aHNbaUNvbHVtbl0gKyBcInB4XCI7XG4gICAgICAgICAgbklubmVyVGhlYWQuYXBwZW5kQ2hpbGQobkNsb25lKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJz50Ym9keT50cicsIHRoYXQuZG9tLmJvZHkpLmVhY2goZnVuY3Rpb24gKHopIHtcbiAgICAgICAgICB2YXIgaSA9IHRoYXQucy5kdC5vRmVhdHVyZXMuYlNlcnZlclNpZGUgPT09IGZhbHNlID8gdGhhdC5zLmR0LmFpRGlzcGxheVt0aGF0LnMuZHQuX2lEaXNwbGF5U3RhcnQgKyB6XSA6IHo7XG4gICAgICAgICAgdmFyIGFUZHMgPSB0aGF0LnMuZHQuYW9EYXRhW2ldLmFuQ2VsbHMgfHwgJCh0aGlzKS5jaGlsZHJlbigndGQsIHRoJyk7XG4gICAgICAgICAgdmFyIG4gPSB0aGlzLmNsb25lTm9kZShmYWxzZSk7XG4gICAgICAgICAgbi5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgICAgbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtZHQtcm93JywgaSk7XG5cbiAgICAgICAgICBmb3IgKGlJbmRleCA9IDA7IGlJbmRleCA8IGFpQ29sdW1ucy5sZW5ndGg7IGlJbmRleCsrKSB7XG4gICAgICAgICAgICBpQ29sdW1uID0gYWlDb2x1bW5zW2lJbmRleF07XG5cbiAgICAgICAgICAgIGlmIChhVGRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgbkNsb25lID0gJChhVGRzW2lDb2x1bW5dKS5jbG9uZSh0cnVlLCB0cnVlKVswXTtcbiAgICAgICAgICAgICAgbkNsb25lLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgICAgICAgbkNsb25lLnNldEF0dHJpYnV0ZSgnZGF0YS1kdC1yb3cnLCBpKTtcbiAgICAgICAgICAgICAgbkNsb25lLnNldEF0dHJpYnV0ZSgnZGF0YS1kdC1jb2x1bW4nLCBpQ29sdW1uKTtcbiAgICAgICAgICAgICAgbi5hcHBlbmRDaGlsZChuQ2xvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5Cb2R5LmFwcGVuZENoaWxkKG4pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoJz50Ym9keT50cicsIHRoYXQuZG9tLmJvZHkpLmVhY2goZnVuY3Rpb24gKHopIHtcbiAgICAgICAgICBuQ2xvbmUgPSB0aGlzLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICBuQ2xvbmUuY2xhc3NOYW1lICs9ICcgRFRGQ19Ob0RhdGEnO1xuICAgICAgICAgICQoJ3RkJywgbkNsb25lKS5odG1sKCcnKTtcbiAgICAgICAgICBuQm9keS5hcHBlbmRDaGlsZChuQ2xvbmUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgb0Nsb25lLmJvZHkuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIG9DbG9uZS5ib2R5LnN0eWxlLm1hcmdpbiA9IFwiMFwiO1xuICAgICAgb0Nsb25lLmJvZHkuc3R5bGUucGFkZGluZyA9IFwiMFwiO1xuXG4gICAgICBpZiAoZHQub1Njcm9sbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIHNjcm9sbGVyRm9yY2VyID0gZHQub1Njcm9sbGVyLmRvbS5mb3JjZTtcblxuICAgICAgICBpZiAoIW9HcmlkLmZvcmNlcikge1xuICAgICAgICAgIG9HcmlkLmZvcmNlciA9IHNjcm9sbGVyRm9yY2VyLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICBvR3JpZC5saW5lci5hcHBlbmRDaGlsZChvR3JpZC5mb3JjZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9HcmlkLmZvcmNlci5zdHlsZS5oZWlnaHQgPSBzY3JvbGxlckZvcmNlci5zdHlsZS5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgb0dyaWQubGluZXIuYXBwZW5kQ2hpbGQob0Nsb25lLmJvZHkpO1xuXG4gICAgICB0aGlzLl9mbkVxdWFsaXNlSGVpZ2h0cygndGJvZHknLCB0aGF0LmRvbS5ib2R5LCBvQ2xvbmUuYm9keSk7XG5cbiAgICAgIGlmIChkdC5uVEZvb3QgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKGJBbGwpIHtcbiAgICAgICAgICBpZiAob0Nsb25lLmZvb3RlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgb0Nsb25lLmZvb3Rlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9DbG9uZS5mb290ZXIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9DbG9uZS5mb290ZXIgPSAkKHRoaXMuZG9tLmZvb3RlcikuY2xvbmUodHJ1ZSwgdHJ1ZSlbMF07XG4gICAgICAgICAgb0Nsb25lLmZvb3Rlci5jbGFzc05hbWUgKz0gXCIgRFRGQ19DbG9uZWRcIjtcbiAgICAgICAgICBvQ2xvbmUuZm9vdGVyLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgICAgb0dyaWQuZm9vdC5hcHBlbmRDaGlsZChvQ2xvbmUuZm9vdGVyKTtcbiAgICAgICAgICBhb0Nsb25lTGF5b3V0ID0gdGhpcy5fZm5Db3B5TGF5b3V0KGR0LmFvRm9vdGVyLCBhaUNvbHVtbnMsIHRydWUpO1xuICAgICAgICAgIHZhciBqcUNsb25lVGZvb3QgPSAkKCc+dGZvb3QnLCBvQ2xvbmUuZm9vdGVyKTtcbiAgICAgICAgICBqcUNsb25lVGZvb3QuZW1wdHkoKTtcblxuICAgICAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhb0Nsb25lTGF5b3V0Lmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICAgICAganFDbG9uZVRmb290WzBdLmFwcGVuZENoaWxkKGFvQ2xvbmVMYXlvdXRbaV0ublRyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkdC5vQXBpLl9mbkRyYXdIZWFkKGR0LCBhb0Nsb25lTGF5b3V0LCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhb0Nsb25lTGF5b3V0ID0gdGhpcy5fZm5Db3B5TGF5b3V0KGR0LmFvRm9vdGVyLCBhaUNvbHVtbnMsIGZhbHNlKTtcbiAgICAgICAgICB2YXIgYW9DdXJyRm9vdGVyID0gW107XG5cbiAgICAgICAgICBkdC5vQXBpLl9mbkRldGVjdEhlYWRlcihhb0N1cnJGb290ZXIsICQoJz50Zm9vdCcsIG9DbG9uZS5mb290ZXIpWzBdKTtcblxuICAgICAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhb0Nsb25lTGF5b3V0Lmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICAgICAgZm9yIChqID0gMCwgakxlbiA9IGFvQ2xvbmVMYXlvdXRbaV0ubGVuZ3RoOyBqIDwgakxlbjsgaisrKSB7XG4gICAgICAgICAgICAgIGFvQ3VyckZvb3RlcltpXVtqXS5jZWxsLmNsYXNzTmFtZSA9IGFvQ2xvbmVMYXlvdXRbaV1bal0uY2VsbC5jbGFzc05hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZm5FcXVhbGlzZUhlaWdodHMoJ3Rmb290JywgdGhpcy5kb20uZm9vdGVyLCBvQ2xvbmUuZm9vdGVyKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGFuVW5pcXVlID0gZHQub0FwaS5fZm5HZXRVbmlxdWVUaHMoZHQsICQoJz50aGVhZCcsIG9DbG9uZS5oZWFkZXIpWzBdKTtcblxuICAgICAgJChhblVuaXF1ZSkuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICBpQ29sdW1uID0gYWlDb2x1bW5zW2ldO1xuICAgICAgICB0aGlzLnN0eWxlLndpZHRoID0gdGhhdC5zLmFpSW5uZXJXaWR0aHNbaUNvbHVtbl0gKyBcInB4XCI7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoYXQucy5kdC5uVEZvb3QgIT09IG51bGwpIHtcbiAgICAgICAgYW5VbmlxdWUgPSBkdC5vQXBpLl9mbkdldFVuaXF1ZVRocyhkdCwgJCgnPnRmb290Jywgb0Nsb25lLmZvb3RlcilbMF0pO1xuICAgICAgICAkKGFuVW5pcXVlKS5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgaUNvbHVtbiA9IGFpQ29sdW1uc1tpXTtcbiAgICAgICAgICB0aGlzLnN0eWxlLndpZHRoID0gdGhhdC5zLmFpSW5uZXJXaWR0aHNbaUNvbHVtbl0gKyBcInB4XCI7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJfZm5HZXRUck5vZGVzXCI6IGZ1bmN0aW9uIF9mbkdldFRyTm9kZXMobkluKSB7XG4gICAgICB2YXIgYU91dCA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IG5Jbi5jaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICBpZiAobkluLmNoaWxkTm9kZXNbaV0ubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PSBcIlRSXCIpIHtcbiAgICAgICAgICBhT3V0LnB1c2gobkluLmNoaWxkTm9kZXNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhT3V0O1xuICAgIH0sXG4gICAgXCJfZm5FcXVhbGlzZUhlaWdodHNcIjogZnVuY3Rpb24gX2ZuRXF1YWxpc2VIZWlnaHRzKG5vZGVOYW1lLCBvcmlnaW5hbCwgY2xvbmUpIHtcbiAgICAgIGlmICh0aGlzLnMuc0hlaWdodE1hdGNoID09ICdub25lJyAmJiBub2RlTmFtZSAhPT0gJ3RoZWFkJyAmJiBub2RlTmFtZSAhPT0gJ3Rmb290Jykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICBpLFxuICAgICAgICAgIGlMZW4sXG4gICAgICAgICAgaUhlaWdodCxcbiAgICAgICAgICBpSGVpZ2h0MixcbiAgICAgICAgICBpSGVpZ2h0T3JpZ2luYWwsXG4gICAgICAgICAgaUhlaWdodENsb25lLFxuICAgICAgICAgIHJvb3RPcmlnaW5hbCA9IG9yaWdpbmFsLmdldEVsZW1lbnRzQnlUYWdOYW1lKG5vZGVOYW1lKVswXSxcbiAgICAgICAgICByb290Q2xvbmUgPSBjbG9uZS5nZXRFbGVtZW50c0J5VGFnTmFtZShub2RlTmFtZSlbMF0sXG4gICAgICAgICAganFCb3hIYWNrID0gJCgnPicgKyBub2RlTmFtZSArICc+dHI6ZXEoMCknLCBvcmlnaW5hbCkuY2hpbGRyZW4oJzpmaXJzdCcpLFxuICAgICAgICAgIGlCb3hIYWNrID0ganFCb3hIYWNrLm91dGVySGVpZ2h0KCkgLSBqcUJveEhhY2suaGVpZ2h0KCksXG4gICAgICAgICAgYW5PcmlnaW5hbCA9IHRoaXMuX2ZuR2V0VHJOb2Rlcyhyb290T3JpZ2luYWwpLFxuICAgICAgICAgIGFuQ2xvbmUgPSB0aGlzLl9mbkdldFRyTm9kZXMocm9vdENsb25lKSxcbiAgICAgICAgICBoZWlnaHRzID0gW107XG5cbiAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhbkNsb25lLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICBpSGVpZ2h0T3JpZ2luYWwgPSBhbk9yaWdpbmFsW2ldLm9mZnNldEhlaWdodDtcbiAgICAgICAgaUhlaWdodENsb25lID0gYW5DbG9uZVtpXS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGlIZWlnaHQgPSBpSGVpZ2h0Q2xvbmUgPiBpSGVpZ2h0T3JpZ2luYWwgPyBpSGVpZ2h0Q2xvbmUgOiBpSGVpZ2h0T3JpZ2luYWw7XG5cbiAgICAgICAgaWYgKHRoaXMucy5zSGVpZ2h0TWF0Y2ggPT0gJ3NlbWlhdXRvJykge1xuICAgICAgICAgIGFuT3JpZ2luYWxbaV0uX0RUVENfaUhlaWdodCA9IGlIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBoZWlnaHRzLnB1c2goaUhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDAsIGlMZW4gPSBhbkNsb25lLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xuICAgICAgICBhbkNsb25lW2ldLnN0eWxlLmhlaWdodCA9IGhlaWdodHNbaV0gKyBcInB4XCI7XG4gICAgICAgIGFuT3JpZ2luYWxbaV0uc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0c1tpXSArIFwicHhcIjtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9maXJlZm94U2Nyb2xsRXJyb3I6IGZ1bmN0aW9uIF9maXJlZm94U2Nyb2xsRXJyb3IoKSB7XG4gICAgICBpZiAoX2ZpcmVmb3hTY3JvbGwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgdGVzdCA9ICQoJzxkaXYvPicpLmNzcyh7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgaGVpZ2h0OiAxMCxcbiAgICAgICAgICB3aWR0aDogNTAsXG4gICAgICAgICAgb3ZlcmZsb3c6ICdzY3JvbGwnXG4gICAgICAgIH0pLmFwcGVuZFRvKCdib2R5Jyk7XG4gICAgICAgIF9maXJlZm94U2Nyb2xsID0gdGVzdFswXS5jbGllbnRXaWR0aCA9PT0gdGVzdFswXS5vZmZzZXRXaWR0aCAmJiB0aGlzLl9mbkRUT3ZlcmZsb3coKS5iYXIgIT09IDA7XG4gICAgICAgIHRlc3QucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfZmlyZWZveFNjcm9sbDtcbiAgICB9XG4gIH0pO1xuICBGaXhlZENvbHVtbnMuZGVmYXVsdHMgPSB7XG4gICAgXCJpTGVmdENvbHVtbnNcIjogMSxcbiAgICBcImlSaWdodENvbHVtbnNcIjogMCxcbiAgICBcImZuRHJhd0NhbGxiYWNrXCI6IG51bGwsXG4gICAgXCJzSGVpZ2h0TWF0Y2hcIjogXCJzZW1pYXV0b1wiXG4gIH07XG4gIEZpeGVkQ29sdW1ucy52ZXJzaW9uID0gXCIzLjIuNVwiO1xuICBEYXRhVGFibGUuQXBpLnJlZ2lzdGVyKCdmaXhlZENvbHVtbnMoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG4gIERhdGFUYWJsZS5BcGkucmVnaXN0ZXIoJ2ZpeGVkQ29sdW1ucygpLnVwZGF0ZSgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIGlmIChjdHguX29GaXhlZENvbHVtbnMpIHtcbiAgICAgICAgY3R4Ll9vRml4ZWRDb2x1bW5zLmZuVXBkYXRlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBEYXRhVGFibGUuQXBpLnJlZ2lzdGVyKCdmaXhlZENvbHVtbnMoKS5yZWxheW91dCgpJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgIGlmIChjdHguX29GaXhlZENvbHVtbnMpIHtcbiAgICAgICAgY3R4Ll9vRml4ZWRDb2x1bW5zLmZuUmVkcmF3TGF5b3V0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBEYXRhVGFibGUuQXBpLnJlZ2lzdGVyKCdyb3dzKCkucmVjYWxjSGVpZ2h0KCknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3JvdycsIGZ1bmN0aW9uIChjdHgsIGlkeCkge1xuICAgICAgaWYgKGN0eC5fb0ZpeGVkQ29sdW1ucykge1xuICAgICAgICBjdHguX29GaXhlZENvbHVtbnMuZm5SZWNhbGN1bGF0ZUhlaWdodCh0aGlzLnJvdyhpZHgpLm5vZGUoKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBEYXRhVGFibGUuQXBpLnJlZ2lzdGVyKCdmaXhlZENvbHVtbnMoKS5yb3dJbmRleCgpJywgZnVuY3Rpb24gKHJvdykge1xuICAgIHJvdyA9ICQocm93KTtcbiAgICByZXR1cm4gcm93LnBhcmVudHMoJy5EVEZDX0Nsb25lZCcpLmxlbmd0aCA/IHRoaXMucm93cyh7XG4gICAgICBwYWdlOiAnY3VycmVudCdcbiAgICB9KS5pbmRleGVzKClbcm93LmluZGV4KCldIDogdGhpcy5yb3cocm93KS5pbmRleCgpO1xuICB9KTtcbiAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRDb2x1bW5zKCkuY2VsbEluZGV4KCknLCBmdW5jdGlvbiAoY2VsbCkge1xuICAgIGNlbGwgPSAkKGNlbGwpO1xuXG4gICAgaWYgKGNlbGwucGFyZW50cygnLkRURkNfQ2xvbmVkJykubGVuZ3RoKSB7XG4gICAgICB2YXIgcm93Q2xvbmVkSWR4ID0gY2VsbC5wYXJlbnQoKS5pbmRleCgpO1xuICAgICAgdmFyIHJvd0lkeCA9IHRoaXMucm93cyh7XG4gICAgICAgIHBhZ2U6ICdjdXJyZW50J1xuICAgICAgfSkuaW5kZXhlcygpW3Jvd0Nsb25lZElkeF07XG4gICAgICB2YXIgY29sdW1uSWR4O1xuXG4gICAgICBpZiAoY2VsbC5wYXJlbnRzKCcuRFRGQ19MZWZ0V3JhcHBlcicpLmxlbmd0aCkge1xuICAgICAgICBjb2x1bW5JZHggPSBjZWxsLmluZGV4KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgY29sdW1ucyA9IHRoaXMuY29sdW1ucygpLmZsYXR0ZW4oKS5sZW5ndGg7XG4gICAgICAgIGNvbHVtbklkeCA9IGNvbHVtbnMgLSB0aGlzLmNvbnRleHRbMF0uX29GaXhlZENvbHVtbnMucy5pUmlnaHRDb2x1bW5zICsgY2VsbC5pbmRleCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByb3c6IHJvd0lkeCxcbiAgICAgICAgY29sdW1uOiB0aGlzLmNvbHVtbi5pbmRleCgndG9EYXRhJywgY29sdW1uSWR4KSxcbiAgICAgICAgY29sdW1uVmlzaWJsZTogY29sdW1uSWR4XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jZWxsKGNlbGwpLmluZGV4KCk7XG4gICAgfVxuICB9KTtcbiAgJChkb2N1bWVudCkub24oJ2luaXQuZHQuZml4ZWRDb2x1bW5zJywgZnVuY3Rpb24gKGUsIHNldHRpbmdzKSB7XG4gICAgaWYgKGUubmFtZXNwYWNlICE9PSAnZHQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGluaXQgPSBzZXR0aW5ncy5vSW5pdC5maXhlZENvbHVtbnM7XG4gICAgdmFyIGRlZmF1bHRzID0gRGF0YVRhYmxlLmRlZmF1bHRzLmZpeGVkQ29sdW1ucztcblxuICAgIGlmIChpbml0IHx8IGRlZmF1bHRzKSB7XG4gICAgICB2YXIgb3B0cyA9ICQuZXh0ZW5kKHt9LCBpbml0LCBkZWZhdWx0cyk7XG5cbiAgICAgIGlmIChpbml0ICE9PSBmYWxzZSkge1xuICAgICAgICBuZXcgRml4ZWRDb2x1bW5zKHNldHRpbmdzLCBvcHRzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICAkLmZuLmRhdGFUYWJsZS5GaXhlZENvbHVtbnMgPSBGaXhlZENvbHVtbnM7XG4gICQuZm4uRGF0YVRhYmxlLkZpeGVkQ29sdW1ucyA9IEZpeGVkQ29sdW1ucztcbiAgcmV0dXJuIEZpeGVkQ29sdW1ucztcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ2pxdWVyeScsICdkYXRhdGFibGVzLm5ldCddLCBmdW5jdGlvbiAoJCkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoJCwgd2luZG93LCBkb2N1bWVudCk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoKHR5cGVvZiBleHBvcnRzID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YoZXhwb3J0cykpID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvb3QsICQpIHtcbiAgICAgIGlmICghcm9vdCkge1xuICAgICAgICByb290ID0gd2luZG93O1xuICAgICAgfVxuXG4gICAgICBpZiAoISQgfHwgISQuZm4uZGF0YVRhYmxlKSB7XG4gICAgICAgICQgPSByZXF1aXJlKCdkYXRhdGFibGVzLm5ldCcpKHJvb3QsICQpLiQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWN0b3J5KCQsIHJvb3QsIHJvb3QuZG9jdW1lbnQpO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgZmFjdG9yeShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuICB9XG59KShmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgRGF0YVRhYmxlID0gJC5mbi5kYXRhVGFibGU7XG4gIHZhciBfaW5zdENvdW50ZXIgPSAwO1xuXG4gIHZhciBGaXhlZEhlYWRlciA9IGZ1bmN0aW9uIEZpeGVkSGVhZGVyKGR0LCBjb25maWcpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRml4ZWRIZWFkZXIpKSB7XG4gICAgICB0aHJvdyBcIkZpeGVkSGVhZGVyIG11c3QgYmUgaW5pdGlhbGlzZWQgd2l0aCB0aGUgJ25ldycga2V5d29yZC5cIjtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnID09PSB0cnVlKSB7XG4gICAgICBjb25maWcgPSB7fTtcbiAgICB9XG5cbiAgICBkdCA9IG5ldyBEYXRhVGFibGUuQXBpKGR0KTtcbiAgICB0aGlzLmMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgRml4ZWRIZWFkZXIuZGVmYXVsdHMsIGNvbmZpZyk7XG4gICAgdGhpcy5zID0ge1xuICAgICAgZHQ6IGR0LFxuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgdGhlYWRUb3A6IDAsXG4gICAgICAgIHRib2R5VG9wOiAwLFxuICAgICAgICB0Zm9vdFRvcDogMCxcbiAgICAgICAgdGZvb3RCb3R0b206IDAsXG4gICAgICAgIHdpZHRoOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICB0Zm9vdEhlaWdodDogMCxcbiAgICAgICAgdGhlYWRIZWlnaHQ6IDAsXG4gICAgICAgIHdpbmRvd0hlaWdodDogJCh3aW5kb3cpLmhlaWdodCgpLFxuICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICB9LFxuICAgICAgaGVhZGVyTW9kZTogbnVsbCxcbiAgICAgIGZvb3Rlck1vZGU6IG51bGwsXG4gICAgICBhdXRvV2lkdGg6IGR0LnNldHRpbmdzKClbMF0ub0ZlYXR1cmVzLmJBdXRvV2lkdGgsXG4gICAgICBuYW1lc3BhY2U6ICcuZHRmYycgKyBfaW5zdENvdW50ZXIrKyxcbiAgICAgIHNjcm9sbExlZnQ6IHtcbiAgICAgICAgaGVhZGVyOiAtMSxcbiAgICAgICAgZm9vdGVyOiAtMVxuICAgICAgfSxcbiAgICAgIGVuYWJsZTogdHJ1ZVxuICAgIH07XG4gICAgdGhpcy5kb20gPSB7XG4gICAgICBmbG9hdGluZ0hlYWRlcjogbnVsbCxcbiAgICAgIHRoZWFkOiAkKGR0LnRhYmxlKCkuaGVhZGVyKCkpLFxuICAgICAgdGJvZHk6ICQoZHQudGFibGUoKS5ib2R5KCkpLFxuICAgICAgdGZvb3Q6ICQoZHQudGFibGUoKS5mb290ZXIoKSksXG4gICAgICBoZWFkZXI6IHtcbiAgICAgICAgaG9zdDogbnVsbCxcbiAgICAgICAgZmxvYXRpbmc6IG51bGwsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBudWxsXG4gICAgICB9LFxuICAgICAgZm9vdGVyOiB7XG4gICAgICAgIGhvc3Q6IG51bGwsXG4gICAgICAgIGZsb2F0aW5nOiBudWxsLFxuICAgICAgICBwbGFjZWhvbGRlcjogbnVsbFxuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5kb20uaGVhZGVyLmhvc3QgPSB0aGlzLmRvbS50aGVhZC5wYXJlbnQoKTtcbiAgICB0aGlzLmRvbS5mb290ZXIuaG9zdCA9IHRoaXMuZG9tLnRmb290LnBhcmVudCgpO1xuICAgIHZhciBkdFNldHRpbmdzID0gZHQuc2V0dGluZ3MoKVswXTtcblxuICAgIGlmIChkdFNldHRpbmdzLl9maXhlZEhlYWRlcikge1xuICAgICAgdGhyb3cgXCJGaXhlZEhlYWRlciBhbHJlYWR5IGluaXRpYWxpc2VkIG9uIHRhYmxlIFwiICsgZHRTZXR0aW5ncy5uVGFibGUuaWQ7XG4gICAgfVxuXG4gICAgZHRTZXR0aW5ncy5fZml4ZWRIZWFkZXIgPSB0aGlzO1xuXG4gICAgdGhpcy5fY29uc3RydWN0b3IoKTtcbiAgfTtcblxuICAkLmV4dGVuZChGaXhlZEhlYWRlci5wcm90b3R5cGUsIHtcbiAgICBlbmFibGU6IGZ1bmN0aW9uIGVuYWJsZShfZW5hYmxlKSB7XG4gICAgICB0aGlzLnMuZW5hYmxlID0gX2VuYWJsZTtcblxuICAgICAgaWYgKHRoaXMuYy5oZWFkZXIpIHtcbiAgICAgICAgdGhpcy5fbW9kZUNoYW5nZSgnaW4tcGxhY2UnLCAnaGVhZGVyJywgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmMuZm9vdGVyICYmIHRoaXMuZG9tLnRmb290Lmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9tb2RlQ2hhbmdlKCdpbi1wbGFjZScsICdmb290ZXInLCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9LFxuICAgIGhlYWRlck9mZnNldDogZnVuY3Rpb24gaGVhZGVyT2Zmc2V0KG9mZnNldCkge1xuICAgICAgaWYgKG9mZnNldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuYy5oZWFkZXJPZmZzZXQgPSBvZmZzZXQ7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmMuaGVhZGVyT2Zmc2V0O1xuICAgIH0sXG4gICAgZm9vdGVyT2Zmc2V0OiBmdW5jdGlvbiBmb290ZXJPZmZzZXQob2Zmc2V0KSB7XG4gICAgICBpZiAob2Zmc2V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5jLmZvb3Rlck9mZnNldCA9IG9mZnNldDtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuYy5mb290ZXJPZmZzZXQ7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9ucygpO1xuXG4gICAgICB0aGlzLl9zY3JvbGwodHJ1ZSk7XG4gICAgfSxcbiAgICBfY29uc3RydWN0b3I6IGZ1bmN0aW9uIF9jb25zdHJ1Y3RvcigpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgIHZhciBkdCA9IHRoaXMucy5kdDtcbiAgICAgICQod2luZG93KS5vbignc2Nyb2xsJyArIHRoaXMucy5uYW1lc3BhY2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5fc2Nyb2xsKCk7XG4gICAgICB9KS5vbigncmVzaXplJyArIHRoaXMucy5uYW1lc3BhY2UsIERhdGFUYWJsZS51dGlsLnRocm90dGxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5zLnBvc2l0aW9uLndpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcbiAgICAgICAgdGhhdC51cGRhdGUoKTtcbiAgICAgIH0sIDUwKSk7XG4gICAgICB2YXIgYXV0b0hlYWRlciA9ICQoJy5maC1maXhlZEhlYWRlcicpO1xuXG4gICAgICBpZiAoIXRoaXMuYy5oZWFkZXJPZmZzZXQgJiYgYXV0b0hlYWRlci5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jLmhlYWRlck9mZnNldCA9IGF1dG9IZWFkZXIub3V0ZXJIZWlnaHQoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGF1dG9Gb290ZXIgPSAkKCcuZmgtZml4ZWRGb290ZXInKTtcblxuICAgICAgaWYgKCF0aGlzLmMuZm9vdGVyT2Zmc2V0ICYmIGF1dG9Gb290ZXIubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuYy5mb290ZXJPZmZzZXQgPSBhdXRvRm9vdGVyLm91dGVySGVpZ2h0KCk7XG4gICAgICB9XG5cbiAgICAgIGR0Lm9uKCdjb2x1bW4tcmVvcmRlci5kdC5kdGZjIGNvbHVtbi12aXNpYmlsaXR5LmR0LmR0ZmMgZHJhdy5kdC5kdGZjIGNvbHVtbi1zaXppbmcuZHQuZHRmYyByZXNwb25zaXZlLWRpc3BsYXkuZHQuZHRmYycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC51cGRhdGUoKTtcbiAgICAgIH0pO1xuICAgICAgZHQub24oJ2Rlc3Ryb3kuZHRmYycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoYXQuYy5oZWFkZXIpIHtcbiAgICAgICAgICB0aGF0Ll9tb2RlQ2hhbmdlKCdpbi1wbGFjZScsICdoZWFkZXInLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGF0LmMuZm9vdGVyICYmIHRoYXQuZG9tLnRmb290Lmxlbmd0aCkge1xuICAgICAgICAgIHRoYXQuX21vZGVDaGFuZ2UoJ2luLXBsYWNlJywgJ2Zvb3RlcicsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZHQub2ZmKCcuZHRmYycpO1xuICAgICAgICAkKHdpbmRvdykub2ZmKHRoYXQucy5uYW1lc3BhY2UpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3Bvc2l0aW9ucygpO1xuXG4gICAgICB0aGlzLl9zY3JvbGwoKTtcbiAgICB9LFxuICAgIF9jbG9uZTogZnVuY3Rpb24gX2Nsb25lKGl0ZW0sIGZvcmNlKSB7XG4gICAgICB2YXIgZHQgPSB0aGlzLnMuZHQ7XG4gICAgICB2YXIgaXRlbURvbSA9IHRoaXMuZG9tW2l0ZW1dO1xuICAgICAgdmFyIGl0ZW1FbGVtZW50ID0gaXRlbSA9PT0gJ2hlYWRlcicgPyB0aGlzLmRvbS50aGVhZCA6IHRoaXMuZG9tLnRmb290O1xuXG4gICAgICBpZiAoIWZvcmNlICYmIGl0ZW1Eb20uZmxvYXRpbmcpIHtcbiAgICAgICAgaXRlbURvbS5mbG9hdGluZy5yZW1vdmVDbGFzcygnZml4ZWRIZWFkZXItZmxvYXRpbmcgZml4ZWRIZWFkZXItbG9ja2VkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXRlbURvbS5mbG9hdGluZykge1xuICAgICAgICAgIGl0ZW1Eb20ucGxhY2Vob2xkZXIucmVtb3ZlKCk7XG5cbiAgICAgICAgICB0aGlzLl91bnNpemUoaXRlbSk7XG5cbiAgICAgICAgICBpdGVtRG9tLmZsb2F0aW5nLmNoaWxkcmVuKCkuZGV0YWNoKCk7XG4gICAgICAgICAgaXRlbURvbS5mbG9hdGluZy5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGl0ZW1Eb20uZmxvYXRpbmcgPSAkKGR0LnRhYmxlKCkubm9kZSgpLmNsb25lTm9kZShmYWxzZSkpLmNzcygndGFibGUtbGF5b3V0JywgJ2ZpeGVkJykuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpLnJlbW92ZUF0dHIoJ2lkJykuYXBwZW5kKGl0ZW1FbGVtZW50KS5hcHBlbmRUbygnYm9keScpO1xuICAgICAgICBpdGVtRG9tLnBsYWNlaG9sZGVyID0gaXRlbUVsZW1lbnQuY2xvbmUoZmFsc2UpO1xuICAgICAgICBpdGVtRG9tLnBsYWNlaG9sZGVyLmZpbmQoJypbaWRdJykucmVtb3ZlQXR0cignaWQnKTtcbiAgICAgICAgaXRlbURvbS5ob3N0LnByZXBlbmQoaXRlbURvbS5wbGFjZWhvbGRlcik7XG5cbiAgICAgICAgdGhpcy5fbWF0Y2hXaWR0aHMoaXRlbURvbS5wbGFjZWhvbGRlciwgaXRlbURvbS5mbG9hdGluZyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBfbWF0Y2hXaWR0aHM6IGZ1bmN0aW9uIF9tYXRjaFdpZHRocyhmcm9tLCB0bykge1xuICAgICAgdmFyIGdldCA9IGZ1bmN0aW9uIGdldChuYW1lKSB7XG4gICAgICAgIHJldHVybiAkKG5hbWUsIGZyb20pLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuICQodGhpcykud2lkdGgoKTtcbiAgICAgICAgfSkudG9BcnJheSgpO1xuICAgICAgfTtcblxuICAgICAgdmFyIHNldCA9IGZ1bmN0aW9uIHNldChuYW1lLCB0b1dpZHRocykge1xuICAgICAgICAkKG5hbWUsIHRvKS5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgJCh0aGlzKS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHRvV2lkdGhzW2ldLFxuICAgICAgICAgICAgbWluV2lkdGg6IHRvV2lkdGhzW2ldXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgdmFyIHRoV2lkdGhzID0gZ2V0KCd0aCcpO1xuICAgICAgdmFyIHRkV2lkdGhzID0gZ2V0KCd0ZCcpO1xuICAgICAgc2V0KCd0aCcsIHRoV2lkdGhzKTtcbiAgICAgIHNldCgndGQnLCB0ZFdpZHRocyk7XG4gICAgfSxcbiAgICBfdW5zaXplOiBmdW5jdGlvbiBfdW5zaXplKGl0ZW0pIHtcbiAgICAgIHZhciBlbCA9IHRoaXMuZG9tW2l0ZW1dLmZsb2F0aW5nO1xuXG4gICAgICBpZiAoZWwgJiYgKGl0ZW0gPT09ICdmb290ZXInIHx8IGl0ZW0gPT09ICdoZWFkZXInICYmICF0aGlzLnMuYXV0b1dpZHRoKSkge1xuICAgICAgICAkKCd0aCwgdGQnLCBlbCkuY3NzKHtcbiAgICAgICAgICB3aWR0aDogJycsXG4gICAgICAgICAgbWluV2lkdGg6ICcnXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChlbCAmJiBpdGVtID09PSAnaGVhZGVyJykge1xuICAgICAgICAkKCd0aCwgdGQnLCBlbCkuY3NzKCdtaW4td2lkdGgnLCAnJyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBfaG9yaXpvbnRhbDogZnVuY3Rpb24gX2hvcml6b250YWwoaXRlbSwgc2Nyb2xsTGVmdCkge1xuICAgICAgdmFyIGl0ZW1Eb20gPSB0aGlzLmRvbVtpdGVtXTtcbiAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMucy5wb3NpdGlvbjtcbiAgICAgIHZhciBsYXN0U2Nyb2xsTGVmdCA9IHRoaXMucy5zY3JvbGxMZWZ0O1xuXG4gICAgICBpZiAoaXRlbURvbS5mbG9hdGluZyAmJiBsYXN0U2Nyb2xsTGVmdFtpdGVtXSAhPT0gc2Nyb2xsTGVmdCkge1xuICAgICAgICBpdGVtRG9tLmZsb2F0aW5nLmNzcygnbGVmdCcsIHBvc2l0aW9uLmxlZnQgLSBzY3JvbGxMZWZ0KTtcbiAgICAgICAgbGFzdFNjcm9sbExlZnRbaXRlbV0gPSBzY3JvbGxMZWZ0O1xuICAgICAgfVxuICAgIH0sXG4gICAgX21vZGVDaGFuZ2U6IGZ1bmN0aW9uIF9tb2RlQ2hhbmdlKG1vZGUsIGl0ZW0sIGZvcmNlQ2hhbmdlKSB7XG4gICAgICB2YXIgZHQgPSB0aGlzLnMuZHQ7XG4gICAgICB2YXIgaXRlbURvbSA9IHRoaXMuZG9tW2l0ZW1dO1xuICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5zLnBvc2l0aW9uO1xuICAgICAgdmFyIHRhYmxlUGFydCA9IHRoaXMuZG9tW2l0ZW0gPT09ICdmb290ZXInID8gJ3Rmb290JyA6ICd0aGVhZCddO1xuICAgICAgdmFyIGZvY3VzID0gJC5jb250YWlucyh0YWJsZVBhcnRbMF0sIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpID8gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA6IG51bGw7XG5cbiAgICAgIGlmIChmb2N1cykge1xuICAgICAgICBmb2N1cy5ibHVyKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChtb2RlID09PSAnaW4tcGxhY2UnKSB7XG4gICAgICAgIGlmIChpdGVtRG9tLnBsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgaXRlbURvbS5wbGFjZWhvbGRlci5yZW1vdmUoKTtcbiAgICAgICAgICBpdGVtRG9tLnBsYWNlaG9sZGVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3Vuc2l6ZShpdGVtKTtcblxuICAgICAgICBpZiAoaXRlbSA9PT0gJ2hlYWRlcicpIHtcbiAgICAgICAgICBpdGVtRG9tLmhvc3QucHJlcGVuZCh0YWJsZVBhcnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1Eb20uaG9zdC5hcHBlbmQodGFibGVQYXJ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtRG9tLmZsb2F0aW5nKSB7XG4gICAgICAgICAgaXRlbURvbS5mbG9hdGluZy5yZW1vdmUoKTtcbiAgICAgICAgICBpdGVtRG9tLmZsb2F0aW5nID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChtb2RlID09PSAnaW4nKSB7XG4gICAgICAgIHRoaXMuX2Nsb25lKGl0ZW0sIGZvcmNlQ2hhbmdlKTtcblxuICAgICAgICBpdGVtRG9tLmZsb2F0aW5nLmFkZENsYXNzKCdmaXhlZEhlYWRlci1mbG9hdGluZycpLmNzcyhpdGVtID09PSAnaGVhZGVyJyA/ICd0b3AnIDogJ2JvdHRvbScsIHRoaXMuY1tpdGVtICsgJ09mZnNldCddKS5jc3MoJ2xlZnQnLCBwb3NpdGlvbi5sZWZ0ICsgJ3B4JykuY3NzKCd3aWR0aCcsIHBvc2l0aW9uLndpZHRoICsgJ3B4Jyk7XG5cbiAgICAgICAgaWYgKGl0ZW0gPT09ICdmb290ZXInKSB7XG4gICAgICAgICAgaXRlbURvbS5mbG9hdGluZy5jc3MoJ3RvcCcsICcnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChtb2RlID09PSAnYmVsb3cnKSB7XG4gICAgICAgIHRoaXMuX2Nsb25lKGl0ZW0sIGZvcmNlQ2hhbmdlKTtcblxuICAgICAgICBpdGVtRG9tLmZsb2F0aW5nLmFkZENsYXNzKCdmaXhlZEhlYWRlci1sb2NrZWQnKS5jc3MoJ3RvcCcsIHBvc2l0aW9uLnRmb290VG9wIC0gcG9zaXRpb24udGhlYWRIZWlnaHQpLmNzcygnbGVmdCcsIHBvc2l0aW9uLmxlZnQgKyAncHgnKS5jc3MoJ3dpZHRoJywgcG9zaXRpb24ud2lkdGggKyAncHgnKTtcbiAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ2Fib3ZlJykge1xuICAgICAgICB0aGlzLl9jbG9uZShpdGVtLCBmb3JjZUNoYW5nZSk7XG5cbiAgICAgICAgaXRlbURvbS5mbG9hdGluZy5hZGRDbGFzcygnZml4ZWRIZWFkZXItbG9ja2VkJykuY3NzKCd0b3AnLCBwb3NpdGlvbi50Ym9keVRvcCkuY3NzKCdsZWZ0JywgcG9zaXRpb24ubGVmdCArICdweCcpLmNzcygnd2lkdGgnLCBwb3NpdGlvbi53aWR0aCArICdweCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZm9jdXMgJiYgZm9jdXMgIT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZm9jdXMuZm9jdXMoKTtcbiAgICAgICAgfSwgMTApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnMuc2Nyb2xsTGVmdC5oZWFkZXIgPSAtMTtcbiAgICAgIHRoaXMucy5zY3JvbGxMZWZ0LmZvb3RlciA9IC0xO1xuICAgICAgdGhpcy5zW2l0ZW0gKyAnTW9kZSddID0gbW9kZTtcbiAgICB9LFxuICAgIF9wb3NpdGlvbnM6IGZ1bmN0aW9uIF9wb3NpdGlvbnMoKSB7XG4gICAgICB2YXIgZHQgPSB0aGlzLnMuZHQ7XG4gICAgICB2YXIgdGFibGUgPSBkdC50YWJsZSgpO1xuICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5zLnBvc2l0aW9uO1xuICAgICAgdmFyIGRvbSA9IHRoaXMuZG9tO1xuICAgICAgdmFyIHRhYmxlTm9kZSA9ICQodGFibGUubm9kZSgpKTtcbiAgICAgIHZhciB0aGVhZCA9IHRhYmxlTm9kZS5jaGlsZHJlbigndGhlYWQnKTtcbiAgICAgIHZhciB0Zm9vdCA9IHRhYmxlTm9kZS5jaGlsZHJlbigndGZvb3QnKTtcbiAgICAgIHZhciB0Ym9keSA9IGRvbS50Ym9keTtcbiAgICAgIHBvc2l0aW9uLnZpc2libGUgPSB0YWJsZU5vZGUuaXMoJzp2aXNpYmxlJyk7XG4gICAgICBwb3NpdGlvbi53aWR0aCA9IHRhYmxlTm9kZS5vdXRlcldpZHRoKCk7XG4gICAgICBwb3NpdGlvbi5sZWZ0ID0gdGFibGVOb2RlLm9mZnNldCgpLmxlZnQ7XG4gICAgICBwb3NpdGlvbi50aGVhZFRvcCA9IHRoZWFkLm9mZnNldCgpLnRvcDtcbiAgICAgIHBvc2l0aW9uLnRib2R5VG9wID0gdGJvZHkub2Zmc2V0KCkudG9wO1xuICAgICAgcG9zaXRpb24udGhlYWRIZWlnaHQgPSBwb3NpdGlvbi50Ym9keVRvcCAtIHBvc2l0aW9uLnRoZWFkVG9wO1xuXG4gICAgICBpZiAodGZvb3QubGVuZ3RoKSB7XG4gICAgICAgIHBvc2l0aW9uLnRmb290VG9wID0gdGZvb3Qub2Zmc2V0KCkudG9wO1xuICAgICAgICBwb3NpdGlvbi50Zm9vdEJvdHRvbSA9IHBvc2l0aW9uLnRmb290VG9wICsgdGZvb3Qub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgcG9zaXRpb24udGZvb3RIZWlnaHQgPSBwb3NpdGlvbi50Zm9vdEJvdHRvbSAtIHBvc2l0aW9uLnRmb290VG9wO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9zaXRpb24udGZvb3RUb3AgPSBwb3NpdGlvbi50Ym9keVRvcCArIHRib2R5Lm91dGVySGVpZ2h0KCk7XG4gICAgICAgIHBvc2l0aW9uLnRmb290Qm90dG9tID0gcG9zaXRpb24udGZvb3RUb3A7XG4gICAgICAgIHBvc2l0aW9uLnRmb290SGVpZ2h0ID0gcG9zaXRpb24udGZvb3RUb3A7XG4gICAgICB9XG4gICAgfSxcbiAgICBfc2Nyb2xsOiBmdW5jdGlvbiBfc2Nyb2xsKGZvcmNlQ2hhbmdlKSB7XG4gICAgICB2YXIgd2luZG93VG9wID0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCk7XG4gICAgICB2YXIgd2luZG93TGVmdCA9ICQoZG9jdW1lbnQpLnNjcm9sbExlZnQoKTtcbiAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMucy5wb3NpdGlvbjtcbiAgICAgIHZhciBoZWFkZXJNb2RlLCBmb290ZXJNb2RlO1xuXG4gICAgICBpZiAoIXRoaXMucy5lbmFibGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jLmhlYWRlcikge1xuICAgICAgICBpZiAoIXBvc2l0aW9uLnZpc2libGUgfHwgd2luZG93VG9wIDw9IHBvc2l0aW9uLnRoZWFkVG9wIC0gdGhpcy5jLmhlYWRlck9mZnNldCkge1xuICAgICAgICAgIGhlYWRlck1vZGUgPSAnaW4tcGxhY2UnO1xuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvd1RvcCA8PSBwb3NpdGlvbi50Zm9vdFRvcCAtIHBvc2l0aW9uLnRoZWFkSGVpZ2h0IC0gdGhpcy5jLmhlYWRlck9mZnNldCkge1xuICAgICAgICAgIGhlYWRlck1vZGUgPSAnaW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhlYWRlck1vZGUgPSAnYmVsb3cnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZvcmNlQ2hhbmdlIHx8IGhlYWRlck1vZGUgIT09IHRoaXMucy5oZWFkZXJNb2RlKSB7XG4gICAgICAgICAgdGhpcy5fbW9kZUNoYW5nZShoZWFkZXJNb2RlLCAnaGVhZGVyJywgZm9yY2VDaGFuZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faG9yaXpvbnRhbCgnaGVhZGVyJywgd2luZG93TGVmdCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmMuZm9vdGVyICYmIHRoaXMuZG9tLnRmb290Lmxlbmd0aCkge1xuICAgICAgICBpZiAoIXBvc2l0aW9uLnZpc2libGUgfHwgd2luZG93VG9wICsgcG9zaXRpb24ud2luZG93SGVpZ2h0ID49IHBvc2l0aW9uLnRmb290Qm90dG9tICsgdGhpcy5jLmZvb3Rlck9mZnNldCkge1xuICAgICAgICAgIGZvb3Rlck1vZGUgPSAnaW4tcGxhY2UnO1xuICAgICAgICB9IGVsc2UgaWYgKHBvc2l0aW9uLndpbmRvd0hlaWdodCArIHdpbmRvd1RvcCA+IHBvc2l0aW9uLnRib2R5VG9wICsgcG9zaXRpb24udGZvb3RIZWlnaHQgKyB0aGlzLmMuZm9vdGVyT2Zmc2V0KSB7XG4gICAgICAgICAgZm9vdGVyTW9kZSA9ICdpbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9vdGVyTW9kZSA9ICdhYm92ZSc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZm9yY2VDaGFuZ2UgfHwgZm9vdGVyTW9kZSAhPT0gdGhpcy5zLmZvb3Rlck1vZGUpIHtcbiAgICAgICAgICB0aGlzLl9tb2RlQ2hhbmdlKGZvb3Rlck1vZGUsICdmb290ZXInLCBmb3JjZUNoYW5nZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9ob3Jpem9udGFsKCdmb290ZXInLCB3aW5kb3dMZWZ0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBGaXhlZEhlYWRlci52ZXJzaW9uID0gXCIzLjEuNFwiO1xuICBGaXhlZEhlYWRlci5kZWZhdWx0cyA9IHtcbiAgICBoZWFkZXI6IHRydWUsXG4gICAgZm9vdGVyOiBmYWxzZSxcbiAgICBoZWFkZXJPZmZzZXQ6IDAsXG4gICAgZm9vdGVyT2Zmc2V0OiAwXG4gIH07XG4gICQuZm4uZGF0YVRhYmxlLkZpeGVkSGVhZGVyID0gRml4ZWRIZWFkZXI7XG4gICQuZm4uRGF0YVRhYmxlLkZpeGVkSGVhZGVyID0gRml4ZWRIZWFkZXI7XG4gICQoZG9jdW1lbnQpLm9uKCdpbml0LmR0LmR0ZmgnLCBmdW5jdGlvbiAoZSwgc2V0dGluZ3MsIGpzb24pIHtcbiAgICBpZiAoZS5uYW1lc3BhY2UgIT09ICdkdCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaW5pdCA9IHNldHRpbmdzLm9Jbml0LmZpeGVkSGVhZGVyO1xuICAgIHZhciBkZWZhdWx0cyA9IERhdGFUYWJsZS5kZWZhdWx0cy5maXhlZEhlYWRlcjtcblxuICAgIGlmICgoaW5pdCB8fCBkZWZhdWx0cykgJiYgIXNldHRpbmdzLl9maXhlZEhlYWRlcikge1xuICAgICAgdmFyIG9wdHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIGluaXQpO1xuXG4gICAgICBpZiAoaW5pdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgbmV3IEZpeGVkSGVhZGVyKHNldHRpbmdzLCBvcHRzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBEYXRhVGFibGUuQXBpLnJlZ2lzdGVyKCdmaXhlZEhlYWRlcigpJywgZnVuY3Rpb24gKCkge30pO1xuICBEYXRhVGFibGUuQXBpLnJlZ2lzdGVyKCdmaXhlZEhlYWRlci5hZGp1c3QoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICB2YXIgZmggPSBjdHguX2ZpeGVkSGVhZGVyO1xuXG4gICAgICBpZiAoZmgpIHtcbiAgICAgICAgZmgudXBkYXRlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBEYXRhVGFibGUuQXBpLnJlZ2lzdGVyKCdmaXhlZEhlYWRlci5lbmFibGUoKScsIGZ1bmN0aW9uIChmbGFnKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3IoJ3RhYmxlJywgZnVuY3Rpb24gKGN0eCkge1xuICAgICAgdmFyIGZoID0gY3R4Ll9maXhlZEhlYWRlcjtcbiAgICAgIGZsYWcgPSBmbGFnICE9PSB1bmRlZmluZWQgPyBmbGFnIDogdHJ1ZTtcblxuICAgICAgaWYgKGZoICYmIGZsYWcgIT09IGZoLnMuZW5hYmxlKSB7XG4gICAgICAgIGZoLmVuYWJsZShmbGFnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIERhdGFUYWJsZS5BcGkucmVnaXN0ZXIoJ2ZpeGVkSGVhZGVyLmRpc2FibGUoKScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVyYXRvcigndGFibGUnLCBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICB2YXIgZmggPSBjdHguX2ZpeGVkSGVhZGVyO1xuXG4gICAgICBpZiAoZmggJiYgZmgucy5lbmFibGUpIHtcbiAgICAgICAgZmguZW5hYmxlKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gICQuZWFjaChbJ2hlYWRlcicsICdmb290ZXInXSwgZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgRGF0YVRhYmxlLkFwaS5yZWdpc3RlcignZml4ZWRIZWFkZXIuJyArIGVsICsgJ09mZnNldCgpJywgZnVuY3Rpb24gKG9mZnNldCkge1xuICAgICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcblxuICAgICAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBjdHgubGVuZ3RoICYmIGN0eFswXS5fZml4ZWRIZWFkZXIgPyBjdHhbMF0uX2ZpeGVkSGVhZGVyW2VsICsgJ09mZnNldCddKCkgOiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLml0ZXJhdG9yKCd0YWJsZScsIGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgICAgdmFyIGZoID0gY3R4Ll9maXhlZEhlYWRlcjtcblxuICAgICAgICBpZiAoZmgpIHtcbiAgICAgICAgICBmaFtlbCArICdPZmZzZXQnXShvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBGaXhlZEhlYWRlcjtcbn0pOyJdfQ==
