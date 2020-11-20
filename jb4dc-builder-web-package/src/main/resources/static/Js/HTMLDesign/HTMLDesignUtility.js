"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CKEditorPluginUtility = function () {
  function CKEditorPluginUtility() {
    _classCallCheck(this, CKEditorPluginUtility);
  }

  _createClass(CKEditorPluginUtility, null, [{
    key: "AddPluginsServerConfig",
    value: function AddPluginsServerConfig(singleName, toolbarLocation, text, clientResolve, serverResolve, clientResolveJs, dialogWidth, dialogHeight, isJBuild4DCData, controlCategory, serverDynamicBind, showRemoveButton, showInEditorToolbar, enableChildControls) {
      this.PluginsServerConfig[singleName] = {
        SingleName: singleName,
        ToolbarLocation: toolbarLocation,
        ToolbarLabel: text,
        ClientResolve: clientResolve,
        ServerResolve: serverResolve,
        ClientResolveJs: clientResolveJs,
        DialogWidth: dialogWidth,
        DialogHeight: dialogHeight,
        IsJBuild4DCData: isJBuild4DCData,
        ControlCategory: controlCategory,
        ServerDynamicBind: serverDynamicBind,
        ShowRemoveButton: showRemoveButton,
        ShowInEditorToolbar: showInEditorToolbar,
        EnableChildControls: enableChildControls
      };
    }
  }, {
    key: "_UseServerConfigCoverEmptyPluginProp",
    value: function _UseServerConfigCoverEmptyPluginProp(obj) {
      var coverObj = this.PluginsServerConfig[obj.SingleName];

      if (coverObj) {
        for (var prop in obj) {
          if (typeof obj[prop] != "function") {
            if (obj[prop] == "" || obj[prop] == null) {
              if (coverObj[prop]) {
                obj[prop] = coverObj[prop];
              }
            }
          }
        }

        return obj;
      }

      return null;
    }
  }, {
    key: "GetGeneralPluginInstance",
    value: function GetGeneralPluginInstance(pluginSingleName, exConfig) {
      var defaultSetting = {
        SingleName: pluginSingleName,
        DialogName: '',
        DialogWidth: null,
        DialogHeight: null,
        DialogPageUrl: BaseUtility.AppendTimeStampUrl('Dialog.html'),
        DialogTitle: "DIV",
        ToolbarCommand: '',
        ToolbarIcon: 'Icon.png',
        ToolbarLabel: "",
        ToolbarLocation: '',
        IFrameWindow: null,
        IFrameExecuteActionName: "Insert",
        DesignModalInputCss: "",
        ClientResolve: "",
        ServerResolve: "",
        IsJBuild4DCData: "",
        ControlCategory: "",
        ServerDynamicBind: "",
        ShowRemoveButton: "",
        ShowInEditorToolbar: "",
        EnableChildControls: ""
      };
      defaultSetting = $.extend(true, {}, defaultSetting, exConfig);
      defaultSetting = CKEditorPluginUtility._UseServerConfigCoverEmptyPluginProp(defaultSetting);

      if (defaultSetting != null) {
        defaultSetting.DialogName = defaultSetting.SingleName;
        defaultSetting.ToolbarCommand = "JBuild4DC.FormDesign.Plugins." + defaultSetting.SingleName;
        defaultSetting.DialogSettingTitle = defaultSetting.ToolbarLabel + "Web控件";
        return {
          Setting: defaultSetting
        };
      }

      return {};
    }
  }, {
    key: "GetEnableChildControls",
    value: function GetEnableChildControls(singleName) {
      return this.Plugins[singleName].Setting.EnableChildControls;
    }
  }, {
    key: "GetPlugins",
    value: function GetPlugins() {
      return this.Plugins;
    }
  }, {
    key: "RegGeneralPluginToEditor",
    value: function RegGeneralPluginToEditor(ckEditor, path, pluginSetting, okFunc) {
      CKEDITOR.dialog.addIframe(pluginSetting.DialogName, pluginSetting.DialogSettingTitle, path + pluginSetting.DialogPageUrl, pluginSetting.DialogWidth, pluginSetting.DialogHeight, function () {
        var iframe = document.getElementById(this._.frameId);
        pluginSetting.IFrameWindow = iframe;
        CKEditorPluginUtility.SetElemPropsInEditDialog(pluginSetting.IFrameWindow, pluginSetting.IFrameExecuteActionName);
      }, {
        onOk: function onOk() {
          var props = pluginSetting.IFrameWindow.contentWindow.DialogApp.getControlProps();

          if (props.success == false) {
            return false;
          }

          okFunc(ckEditor, pluginSetting, props, pluginSetting.IFrameWindow.contentWindow);
          pluginSetting.IFrameExecuteActionName = CKEditorPluginUtility.DialogExecuteInsertActionName;
        },
        onCancel: function onCancel() {
          pluginSetting.IFrameExecuteActionName = CKEditorPluginUtility.DialogExecuteInsertActionName;
        }
      });
      ckEditor.addCommand(pluginSetting.ToolbarCommand, new CKEDITOR.dialogCommand(pluginSetting.DialogName));

      if (pluginSetting.ShowInEditorToolbar == "true") {
        ckEditor.ui.addButton(pluginSetting.SingleName, {
          label: pluginSetting.ToolbarLabel,
          icon: path + pluginSetting.ToolbarIcon,
          command: pluginSetting.ToolbarCommand,
          toolbar: pluginSetting.ToolbarLocation
        });
      }

      ckEditor.on('doubleclick', function (event) {
        CKEditorPluginUtility.OnCKWysiwygElemDBClickEvent(event, pluginSetting);
      });
    }
  }, {
    key: "OnCKWysiwygElemDBClickEvent",
    value: function OnCKWysiwygElemDBClickEvent(event, controlSetting) {
      var element = event.data.element;

      if (element.getAttribute("runtime_auto_remove") == "true") {
        element = event.data.element.getParent();
      }

      var singleName = element.getAttribute("singleName");

      if (singleName == controlSetting.SingleName) {
        CKEditorUtility.SetSelectedElem(element.getOuterHtml());
        event.data.dialog = controlSetting.DialogName;
        controlSetting.IFrameExecuteActionName = CKEditorPluginUtility.DialogExecuteEditActionName;
      }
    }
  }, {
    key: "SerializePropsToElem",
    value: function SerializePropsToElem(elem, props, controlSetting) {
      elem.setAttribute("jbuild4dc_custom", "true");
      elem.setAttribute("singlename", controlSetting.SingleName);
      elem.setAttribute("is_jbuild4dc_data", controlSetting.IsJBuild4DCData);
      elem.setAttribute("control_category", controlSetting.ControlCategory);
      elem.setAttribute("show_remove_button", controlSetting.ShowRemoveButton);

      if (props["baseInfo"]) {
        for (var key in props["baseInfo"]) {
          if (key == "readonly") {
            if (props["baseInfo"][key] == "readonly") {
              elem.setAttribute(key.toLocaleLowerCase(), props["baseInfo"][key]);
            } else {
              elem.removeAttribute("readonly");
            }
          } else if (key == "disabled") {
            if (props["baseInfo"][key] == "disabled") {
              elem.setAttribute(key.toLocaleLowerCase(), props["baseInfo"][key]);
            } else {
              elem.removeAttribute("disabled");
            }
          } else {
            elem.setAttribute(key.toLocaleLowerCase(), props["baseInfo"][key]);
          }
        }
      }

      if (props["bindToField"]) {
        for (var key in props["bindToField"]) {
          elem.setAttribute(key.toLocaleLowerCase(), props["bindToField"][key]);
        }
      }

      if (props["defaultValue"]) {
        for (var key in props["defaultValue"]) {
          elem.setAttribute(key.toLocaleLowerCase(), props["defaultValue"][key]);
        }
      }

      if (props["validateRules"]) {
        if (props["validateRules"].rules) {
          if (props["validateRules"].rules.length > 0) {
            elem.setAttribute("validaterules", encodeURIComponent(JsonUtility.JsonToString(props["validateRules"])));
          }
        }
      }

      if (props["normalProps"]) {
        for (var key in props["normalProps"]) {
          elem.setAttribute(key.toLocaleLowerCase(), props["normalProps"][key]);
        }
      }

      if (props["bindToSearchField"]) {
        for (var key in props["bindToSearchField"]) {
          elem.setAttribute(key.toLocaleLowerCase(), props["bindToSearchField"][key]);
        }
      }

      if (props["normalDataSource"]) {
        for (var key in props["normalDataSource"]) {
          elem.setAttribute(key.toLocaleLowerCase(), props["normalDataSource"][key]);
        }
      }

      return elem;
    }
  }, {
    key: "DeserializePropsFromElem",
    value: function DeserializePropsFromElem(elem) {
      var props = {};
      var $elem = $(elem);

      function attrToProp(props, groupName) {
        var groupProp = {};

        for (var key in this.DefaultProps[groupName]) {
          if ($elem.attr(key)) {
            groupProp[key] = $elem.attr(key);
          } else {
            groupProp[key] = this.DefaultProps[groupName][key];
          }
        }

        props[groupName] = groupProp;
        return props;
      }

      props = attrToProp.call(this, props, "baseInfo");
      props = attrToProp.call(this, props, "bindToField");
      props = attrToProp.call(this, props, "defaultValue");
      props = attrToProp.call(this, props, "bindToSearchField");
      props = attrToProp.call(this, props, "normalDataSource");

      if ($elem.attr("validateRules")) {
        props.validateRules = JsonUtility.StringToJson(decodeURIComponent($elem.attr("validateRules")));
      }

      return props;
    }
  }, {
    key: "BuildGeneralElemToCKWysiwyg",
    value: function BuildGeneralElemToCKWysiwyg(html, controlSetting, controlProps, _iframe) {
      if (this.ValidateBuildEnable(html, controlSetting, controlProps, _iframe)) {
        console.log("IFrameExecuteActionName:" + controlSetting.IFrameExecuteActionName);

        if (controlSetting.IFrameExecuteActionName == CKEditorPluginUtility.DialogExecuteInsertActionName) {
          var elem = CKEDITOR.dom.element.createFromHtml(html);
          this.SerializePropsToElem(elem, controlProps, controlSetting);
          CKEditorUtility.GetCKEditorInst().insertElement(elem);
          CKEditorUtility.SingleElemBindDefaultEvent(elem);
        } else {
          var selectedElem = CKEditorUtility.GetSelectedCKEditorElem();

          if (selectedElem) {
            var reFreshElem = new CKEDITOR.dom.element.createFromHtml(selectedElem.getOuterHtml());

            if (reFreshElem.getAttribute("control_category") == "InputControl") {
              var newText = $(html).html();
              reFreshElem.setHtml(newText);
            }

            selectedElem.copyAttributes(reFreshElem, {
              temp: "temp"
            });
            this.SerializePropsToElem(reFreshElem, controlProps, controlSetting);
            reFreshElem.replace(selectedElem);
            CKEditorUtility.SingleElemBindDefaultEvent(reFreshElem);
          }
        }
      }
    }
  }, {
    key: "ValidateBuildEnable",
    value: function ValidateBuildEnable(html, controlSetting, controlProps, _iframe) {
      return true;
    }
  }, {
    key: "ValidateSerializeControlDialogCompletedEnable",
    value: function ValidateSerializeControlDialogCompletedEnable(returnResult) {
      if (returnResult.baseInfo.serialize == "true" && returnResult.bindToField.fieldName == "") {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "序列化的控件必须绑定字段!", null);
        return {
          success: false
        };
      }

      return returnResult;
    }
  }, {
    key: "SetElemPropsInEditDialog",
    value: function SetElemPropsInEditDialog(iframeObj, actionName) {
      var sel = CKEditorUtility.GetCKEditorInst().getSelection().getStartElement();
      var parents = null;

      if (sel) {
        parents = sel.getParents();
      }

      iframeObj.contentWindow.DialogApp.ready(actionName, sel, parents);

      if (actionName == this.DialogExecuteEditActionName) {
        var elem = CKEditorUtility.GetSelectedElem().outerHTML();
        var props = this.DeserializePropsFromElem(elem);
        iframeObj.contentWindow.DialogApp.setControlProps($(elem), props);
      }
    }
  }, {
    key: "GetControlDescText",
    value: function GetControlDescText(pluginSetting, props) {
      console.log(props);
      var result = "类型:【" + pluginSetting.ToolbarLabel + "】<br />绑定:【" + props.bindToField.tableCaption + "-" + props.bindToField.fieldCaption + "】";

      if (props.defaultValue) {
        if (props.defaultValue.defaultText) {
          result += "<br />默认:【" + props.defaultValue.defaultType + ":" + props.defaultValue.defaultText + "】";
        }
      }

      if (props.validateRules) {
        if (props.validateRules.rules) {
          if (props.validateRules.rules.length > 0) {
            result += "<br />验证:【";

            for (var i = 0; i < props.validateRules.rules.length; i++) {
              result += props.validateRules.rules[i].validateType + ";";
            }

            result = StringUtility.RemoveLastChar(result);
            result += "】";
          }
        }
      }

      return result;
    }
  }, {
    key: "GetSearchControlDescText",
    value: function GetSearchControlDescText(pluginSetting, props) {
      return "[" + pluginSetting.ToolbarLabel + "] 绑定:[" + props.bindToSearchField.columnCaption + "](" + props.bindToSearchField.columnOperator + ")";
    }
  }, {
    key: "GetAutoRemoveTipLabel",
    value: function GetAutoRemoveTipLabel(tipMsg) {
      if (!tipMsg) {
        tipMsg = "双击编辑该部件";
      }

      return '<div runtime_auto_remove="true" class="wysiwyg-auto-remove-tip">' + tipMsg + '</div>';
    }
  }, {
    key: "TryGetListButtonsInPluginPage",
    value: function TryGetListButtonsInPluginPage() {
      var buttons = [];
      var html = CKEditorUtility.GetCKEditorHTMLInPluginPage();
      var $buttons = $(html).find("[buttoncaption]");
      $buttons.each(function () {
        var buttonCaption = $(this).attr("buttoncaption");
        var buttonId = $(this).attr("id");
        buttons.push({
          buttonCaption: buttonCaption,
          buttonId: buttonId
        });
      });
      return buttons;
    }
  }, {
    key: "TryGetDataSetId",
    value: function TryGetDataSetId(sel, parents) {
      if (sel) {
        for (var i = parents.length - 1; i--; i >= 0) {
          if (parents[i].getAttribute("datasetid") != null && parents[i].getAttribute("datasetid") != "") {
            return parents[i].getAttribute("datasetid");
          }
        }
      }

      if (!this.dataSetId) {
        return window.parent.listDesign.listResourceEntity.listDatasetId;
      }

      return null;
    }
  }, {
    key: "TemplateAddDefProp",
    value: function TemplateAddDefProp($templateElem, id, show_remove_button, singleName, status) {
      $templateElem.attr("classname", "");
      $templateElem.attr("control_category", "ContainerControl");
      $templateElem.attr("custdisabled", "nodisabled");
      $templateElem.attr("custreadonly", "noreadonly");
      $templateElem.attr("desc", "");
      $templateElem.attr("id", id);
      $templateElem.attr("is_jbuild4dc_data", "false");
      $templateElem.attr("jbuild4dc_custom", "true");
      $templateElem.attr("name", id);
      $templateElem.attr("placeholder", "");
      $templateElem.attr("serialize", "false");
      $templateElem.attr("show_remove_button", show_remove_button);
      $templateElem.attr("singlename", singleName);
      $templateElem.attr("style", "");
      $templateElem.attr("status", status);
    }
  }]);

  return CKEditorPluginUtility;
}();

_defineProperty(CKEditorPluginUtility, "PluginsServerConfig", {});

_defineProperty(CKEditorPluginUtility, "Plugins", {});

_defineProperty(CKEditorPluginUtility, "DefaultProps", {
  bindToField: {
    relationId: "",
    tableId: "",
    tableName: "",
    tableCaption: "",
    fieldName: "",
    fieldCaption: "",
    fieldDataType: "",
    fieldLength: ""
  },
  defaultValue: {
    defaultType: "",
    defaultValue: "",
    defaultText: ""
  },
  validateRules: {
    msg: "",
    rules: []
  },
  baseInfo: {
    id: "",
    serialize: "true",
    name: "",
    className: "",
    placeholder: "",
    custReadonly: "noreadonly",
    custDisabled: "nodisabled",
    style: "",
    desc: "",
    status: "enable",
    groupName: ""
  },
  bindToSearchField: {
    columnTitle: "",
    columnTableName: "",
    columnName: "",
    columnCaption: "",
    columnDataTypeName: "",
    columnOperator: "匹配"
  },
  normalDataSource: {
    defaultIsNull: "true",
    sqlDataSource: "",
    dictionaryGroupDataSourceId: "",
    dictionaryGroupDataSourceText: "",
    restDataSource: "",
    interfaceDataSource: "",
    staticDataSource: "",
    defaultSelected: "",
    layoutDirection: "vertical",
    rowNum: "0",
    displayValueInText: "false"
  }
});

_defineProperty(CKEditorPluginUtility, "DialogExecuteEditActionName", "Edit");

_defineProperty(CKEditorPluginUtility, "DialogExecuteInsertActionName", "Insert");
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CKEditorUtility = function () {
  function CKEditorUtility() {
    _classCallCheck(this, CKEditorUtility);
  }

  _createClass(CKEditorUtility, null, [{
    key: "SetSelectedElem",
    value: function SetSelectedElem(elemHtml) {
      this._$CKEditorSelectElem = $(elemHtml);
    }
  }, {
    key: "GetSelectedElem",
    value: function GetSelectedElem() {
      if (this._$CKEditorSelectElem) {
        if (this._$CKEditorSelectElem.length > 0) {
          return this._$CKEditorSelectElem;
        }
      }

      return null;
    }
  }, {
    key: "GetSelectedCKEditorElem",
    value: function GetSelectedCKEditorElem() {
      if (this.GetSelectedElem()) {
        var id = this.GetSelectedElem().attr("id");
        var element = this.GetCKEditorInst().document.getById(id);
        return element;
      }

      return null;
    }
  }, {
    key: "SetLastSelectedTempHTML",
    value: function SetLastSelectedTempHTML(html) {
      this._LastSelectedTempHTML = html;
    }
  }, {
    key: "GetLastSelectedTempHTML",
    value: function GetLastSelectedTempHTML() {
      return this._LastSelectedTempHTML;
    }
  }, {
    key: "TryGetIdFromLastSelectedTempHTML",
    value: function TryGetIdFromLastSelectedTempHTML(newHTML) {
      if (!this._LastSelectedTempHTML) {
        return "";
      } else {
        var name = $(newHTML).attr("name");
        var lastHtmlName = $(this.GetLastSelectedTempHTML()).attr("name");

        if (name == lastHtmlName) {
          return $(this.GetLastSelectedTempHTML()).attr("id");
        }
      }

      return "";
    }
  }, {
    key: "GetCKEditorInst",
    value: function GetCKEditorInst() {
      return this._CKEditorInst;
    }
  }, {
    key: "SetCKEditorInst",
    value: function SetCKEditorInst(inst) {
      this._CKEditorInst = inst;
    }
  }, {
    key: "GetCKEditorHTML",
    value: function GetCKEditorHTML() {
      this.ClearALLForDivElemButton();
      this.ClearALLPluginInnerPanel();
      return this.GetCKEditorInst().getData();
    }
  }, {
    key: "SetCKEditorHTML",
    value: function SetCKEditorHTML(html) {
      this.GetCKEditorInst().setData(html);
      window.setTimeout(function () {
        CKEditorUtility.ALLElemBindDefaultEvent();
      }, 500);
    }
  }, {
    key: "GetCKEditorHTMLInPluginPage",
    value: function GetCKEditorHTMLInPluginPage() {
      return window.parent.CKEditorUtility.GetCKEditorHTML();
    }
  }, {
    key: "InitializeCKEditor",
    value: function InitializeCKEditor(textAreaElemId, pluginsConfig, loadCompletedFunc, ckeditorConfigFullPath, pluginBasePath, themeVo) {
      var extraPlugins = new Array();

      for (var i = 0; i < pluginsConfig.length; i++) {
        var singlePluginConfig = pluginsConfig[i];
        var singleName = singlePluginConfig.singleName;
        var toolbarLocation = singlePluginConfig.toolbarLocation;
        var text = singlePluginConfig.text;
        var serverResolve = singlePluginConfig.serverResolve;
        var clientResolve = singlePluginConfig.clientResolve;
        var clientResolveJs = singlePluginConfig.clientResolveJs;
        var dialogWidth = singlePluginConfig.dialogWidth;
        var dialogHeight = singlePluginConfig.dialogHeight;
        var isJBuild4DCData = singlePluginConfig.isJBuild4DCData;
        var controlCategory = singlePluginConfig.controlCategory;
        var serverDynamicBind = singlePluginConfig.serverDynamicBind;
        var showRemoveButton = singlePluginConfig.showRemoveButton;
        var showInEditorToolbar = singlePluginConfig.showInEditorToolbar;
        var enableChildControls = singlePluginConfig.enableChildControls;
        var pluginFileName = singleName + "Plugin.js";
        var pluginFolderName = pluginBasePath + singleName + "/";
        CKEDITOR.plugins.addExternal(singleName, pluginFolderName, pluginFileName);
        extraPlugins.push(singleName);
        CKEditorPluginUtility.AddPluginsServerConfig(singleName, toolbarLocation, text, clientResolve, serverResolve, clientResolveJs, dialogWidth, dialogHeight, isJBuild4DCData, controlCategory, serverDynamicBind, showRemoveButton, showInEditorToolbar, enableChildControls);
      }

      this.SetThemeVo(themeVo);
      var editorConfigUrl = BaseUtility.AppendTimeStampUrl(ckeditorConfigFullPath);
      CKEDITOR.replace(textAreaElemId, {
        customConfig: editorConfigUrl,
        extraPlugins: extraPlugins.join(",")
      });
      CKEDITOR.instances.html_design.on("beforePaste", function (event) {});
      CKEDITOR.instances.html_design.on("paste", function (event) {
        var sourceHTML = event.data.dataValue;
        console.log(sourceHTML);

        try {
          var $sourceHTML = $(sourceHTML);
          $sourceHTML.find(".pluginInnerPanelWrap").remove();

          if ($sourceHTML.find("div").length == 1) {
            var $innerElem = $($sourceHTML.find("div").eq(0));
            var id = CKEditorUtility.TryGetIdFromLastSelectedTempHTML($innerElem);
            console.log(id);

            if (id) {
              var oldElem = CKEditorUtility.GetCKEditorInst().document.getById(id);

              if (oldElem) {
                id = "ct_copy_" + StringUtility.Timestamp();
              }
            } else {
              id = "ct_copy_" + StringUtility.Timestamp();
            }

            event.data.dataValue = $innerElem.attr("id", id).outerHTML();
          }
        } catch (e) {
          console.log("黏贴异常,还原HTML");
          event.data.dataValue = sourceHTML;
        }
      });
      CKEDITOR.instances.html_design.on("afterPaste", function (event) {});
      CKEDITOR.instances.html_design.on('insertElement', function (event) {});
      CKEDITOR.instances.html_design.on('insertHtml', function (event) {});
      CKEDITOR.instances.html_design.on('selectionChange', function (event) {
        var elem = event.data.selection.getSelectedElement();
        var lastCustSingleName = "";

        for (var i = 0; i < event.data.path.elements.length; i++) {
          var elem = event.data.path.elements[i];
          var singleName = elem.getAttribute("singlename");
          var elemInnerHTML = elem.getHtml();

          if (singleName) {
            lastCustSingleName = singleName;
            CKEditorUtility.SetSelectedElem(elem.getOuterHtml());
            CKEditorUtility.SetLastSelectedTempHTML(elem.getOuterHtml());
            var innerHtml = elem.getHtml();
            innerHtml = innerHtml.replace(/<br \/>/g, "").replace(/<br>/g, "");

            if (innerHtml.indexOf("<") < 0) {
              console.log(elem);
              CKEditorUtility.GetCKEditorInst().getSelection().selectElement(elem);
            }

            if (lastCustSingleName != "WFDCT_Template") {
              CKEditorUtility.CreatePluginInnerPanel(elem);
            }

            break;
          }

          if (elem.getName() == "td" && elemInnerHTML == "&nbsp;") {
            CKEditorUtility.GetCKEditorInst().getSelection().selectElement(elem.getChild(0));
            break;
          }
        }

        if (lastCustSingleName) {
          CKEditorUtility.DisplayPluginControls(CKEditorPluginUtility.GetEnableChildControls(lastCustSingleName));
        }
      });
      this.SetCKEditorInst(CKEDITOR.instances.html_design);
      CKEDITOR.on('instanceReady', function (e) {
        if (typeof loadCompletedFunc == "function") {
          loadCompletedFunc();
          ;
        }
      });
    }
  }, {
    key: "DisplayPluginControls",
    value: function DisplayPluginControls(enableChildControls) {
      $(".cke_button").show();

      if (enableChildControls == "*") {
        return;
      }

      var plugins = CKEditorPluginUtility.GetPlugins();

      for (var key in plugins) {
        var plugin = plugins[key];
        var singleName = plugin.Setting.SingleName;
        $(".cke_button__" + StringUtility.ToLowerCase(singleName)).hide();
      }

      var enablePlugins = enableChildControls.split(";");

      for (var i = 0; i < enablePlugins.length; i++) {
        var singleName = enablePlugins[i];
        $(".cke_button__" + StringUtility.ToLowerCase(singleName)).show();
      }
    }
  }, {
    key: "GetThemeVo",
    value: function GetThemeVo() {
      return this._ThemeVo;
    }
  }, {
    key: "SetThemeVo",
    value: function SetThemeVo(_themeVo) {
      this._ThemeVo = _themeVo;
      this.ResetRootElemTheme(_themeVo);
    }
  }, {
    key: "ResetRootElemTheme",
    value: function ResetRootElemTheme(_themeVo) {
      if (this.GetCKEditorInst()) {
        var sourceHTML = this.GetCKEditorHTML();

        if (sourceHTML != null && sourceHTML != "") {
          var rootElem = $(sourceHTML);

          if (rootElem.length > 0) {
            var classList = rootElem.attr('class').split(/\s+/);
            var classary = [];
            $.each(classList, function (index, item) {
              if (item.indexOf('html-design-theme-') >= 0) {
                rootElem.removeClass(item);
              }
            });
            rootElem.addClass(_themeVo.rootElemClass);
            this.SetCKEditorHTML(rootElem.outerHTML());
          }
        }
      }
    }
  }, {
    key: "ClearALLForDivElemButton",
    value: function ClearALLForDivElemButton() {
      var oldDelButtons = CKEditorUtility.GetCKEditorInst().document.find(".del-button");

      for (var i = 0; i < oldDelButtons.count(); i++) {
        oldDelButtons.getItem(i).remove();
      }
    }
  }, {
    key: "CreatePluginInnerPanel",
    value: function CreatePluginInnerPanel(elem) {
      CKEditorUtility.ClearALLPluginInnerPanel();
      var pluginInnerPanel = new CKEDITOR.dom.element('div');
      pluginInnerPanel.addClass("pluginInnerPanelWrap");
      elem.append(pluginInnerPanel);
      var selectAllButton = new CKEDITOR.dom.element('div');
      selectAllButton.addClass("button");
      selectAllButton.addClass("select-img");
      selectAllButton.setAttribute('title', '选中');
      pluginInnerPanel.append(selectAllButton);
      selectAllButton.on('click', function (ev) {
        alert("暂不支持!");
        var domEvent = ev.data;
        domEvent.preventDefault();
        domEvent.stopPropagation();
      });
      var delButton = new CKEDITOR.dom.element('div');
      delButton.addClass("button");
      delButton.addClass("del-img");
      delButton.setAttribute('title', '删除');
      pluginInnerPanel.append(delButton);
      delButton.on('click', function (ev) {
        elem.remove();
        var domEvent = ev.data;
        domEvent.preventDefault();
        domEvent.stopPropagation();
      });
      var copyIdButton = new CKEDITOR.dom.element('div');
      copyIdButton.addClass("button");
      copyIdButton.addClass("copy-id-img");
      copyIdButton.setAttribute('title', '复制ID');
      pluginInnerPanel.append(copyIdButton);
      copyIdButton.on('click', function (ev) {
        var id = elem.getAttribute("id");
        BaseUtility.CopyValueClipboard(id);
        var domEvent = ev.data;
        domEvent.preventDefault();
        domEvent.stopPropagation();
      });
    }
  }, {
    key: "ClearALLPluginInnerPanel",
    value: function ClearALLPluginInnerPanel() {
      var oldDelButtons = CKEditorUtility.GetCKEditorInst().document.find(".pluginInnerPanelWrap");

      for (var i = 0; i < oldDelButtons.count(); i++) {
        oldDelButtons.getItem(i).remove();
      }
    }
  }, {
    key: "SingleElemBindDefaultEvent",
    value: function SingleElemBindDefaultEvent(elem) {
      var singleName = elem.getAttribute("singlename");
      var innerHtml = elem.getHtml();
      innerHtml = innerHtml.replace(/<br \/>/g, "");

      if (innerHtml.indexOf("<") < 0) {
        if (singleName) {
          elem.on('click', function (ev) {
            console.log(this);
            CKEditorUtility.GetCKEditorInst().getSelection().selectElement(this);
            CKEditorUtility.SetSelectedElem(this.getOuterHtml());
            var domEvent = ev.data;
            domEvent.preventDefault();
            domEvent.stopPropagation();
          });
        }
      }
    }
  }, {
    key: "ALLElemBindDefaultEvent",
    value: function ALLElemBindDefaultEvent() {
      console.log("取消使用点击进行元素选择和删除的功能,迁移为selectionChange事件进行!");
    }
  }]);

  return CKEditorUtility;
}();

_defineProperty(CKEditorUtility, "_$CKEditorSelectElem", null);

_defineProperty(CKEditorUtility, "_LastSelectedTempHTML", null);

_defineProperty(CKEditorUtility, "_CKEditorInst", null);

_defineProperty(CKEditorUtility, "_ThemeVo", null);
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HTMLEditorUtility = function () {
  function HTMLEditorUtility() {
    _classCallCheck(this, HTMLEditorUtility);
  }

  _createClass(HTMLEditorUtility, null, [{
    key: "GetHTMLEditorInst",
    value: function GetHTMLEditorInst() {
      return this._HTMLEditorInst;
    }
  }, {
    key: "SetHTMLEditorHTML",
    value: function SetHTMLEditorHTML(html) {
      if (!StringUtility.IsNullOrEmpty(html)) {
        this.GetHTMLEditorInst().setValue(html);
        CodeMirror.commands["selectAll"](this.GetHTMLEditorInst());
        var range = {
          from: this.GetHTMLEditorInst().getCursor(true),
          to: this.GetHTMLEditorInst().getCursor(false)
        };
        ;
        this.GetHTMLEditorInst().autoFormatRange(range.from, range.to);
        var a1 = {
          line: 0,
          ch: 2
        };
        this.GetHTMLEditorInst().getDoc().eachLine(function (line) {});
        var selectedElem = CKEditorUtility.GetSelectedElem();
        var searchHTML = "";

        if (selectedElem) {
          searchHTML = selectedElem.outerHTML().split(">")[0];
        }

        var cursor = this.GetHTMLEditorInst().getSearchCursor(searchHTML);
        cursor.findNext();

        if (cursor.from() && cursor.to()) {
          this.GetHTMLEditorInst().getDoc().setSelection(cursor.from(), cursor.to());
        }
      }
    }
  }, {
    key: "GetHtmlEditorHTML",
    value: function GetHtmlEditorHTML() {
      return this.GetHTMLEditorInst().getValue();
    }
  }, {
    key: "InitializeHTMLCodeDesign",
    value: function InitializeHTMLCodeDesign() {
      var mixedMode = {
        name: "htmlmixed",
        scriptTypes: [{
          matches: /\/x-handlebars-template|\/x-mustache/i,
          mode: null
        }, {
          matches: /(text|application)\/(x-)?vb(a|script)/i,
          mode: "vbscript"
        }]
      };
      this._HTMLEditorInst = CodeMirror.fromTextArea(document.getElementById("TextAreaHTMLEditor"), {
        mode: mixedMode,
        selectionPointer: true,
        theme: "monokai",
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        lineNumbers: true,
        lineWrapping: true
      });

      this._HTMLEditorInst.setSize("100%", PageStyleUtility.GetPageHeight() - 85);
    }
  }]);

  return HTMLEditorUtility;
}();

_defineProperty(HTMLEditorUtility, "_HTMLEditorInst", null);
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var JsEditorUtility = function () {
  function JsEditorUtility() {
    _classCallCheck(this, JsEditorUtility);
  }

  _createClass(JsEditorUtility, null, [{
    key: "_GetNewFormJsString",
    value: function _GetNewFormJsString() {
      return "<script>var FormPageObjectInstance={" + "data:{" + "userEntity:{}," + "organEntity:{}," + "formPO:[]," + "formRecordComplexPO:[]," + "webFormRTParas:{}," + "config:[]" + "}," + "pageReady:function(){}," + "bindRecordDataReady:function(){}," + "validateEveryFromControl:function(validateResult){return validateResult;}" + "}</script>";
    }
  }, {
    key: "GetJsEditorInst",
    value: function GetJsEditorInst() {
      return this._JsEditorInst;
    }
  }, {
    key: "SetJsEditorJs",
    value: function SetJsEditorJs(js) {
      this.GetJsEditorInst().setValue(js);
    }
  }, {
    key: "GetJsEditorJs",
    value: function GetJsEditorJs() {
      return this.GetJsEditorInst().getValue();
    }
  }, {
    key: "InitializeJsCodeDesign",
    value: function InitializeJsCodeDesign(status) {
      this._JsEditorInst = CodeMirror.fromTextArea($("#TextAreaJsEditor")[0], {
        mode: "application/ld+json",
        lineNumbers: true,
        lineWrapping: true,
        extraKeys: {
          "Ctrl-Q": function CtrlQ(cm) {
            cm.foldCode(cm.getCursor());
          }
        },
        foldGutter: true,
        smartIndent: true,
        matchBrackets: true,
        theme: "monokai",
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
      });

      this._JsEditorInst.setSize("100%", PageStyleUtility.GetPageHeight() - 85);

      if (status == "add") {
        this.SetJsEditorJs(this._GetNewFormJsString());
        CodeMirror.commands["selectAll"](this.GetJsEditorInst());
        var range = {
          from: this.GetJsEditorInst().getCursor(true),
          to: this.GetJsEditorInst().getCursor(false)
        };
        this.GetJsEditorInst().autoFormatRange(range.from, range.to);
      }
    }
  }]);

  return JsEditorUtility;
}();

_defineProperty(JsEditorUtility, "_JsEditorInst", null);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNLRWRpdG9yUGx1Z2luVXRpbGl0eS5qcyIsIkNLRWRpdG9yVXRpbGl0eS5qcyIsIkhUTUxFZGl0b3JVdGlsaXR5LmpzIiwiSnNFZGl0b3JVdGlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiSFRNTERlc2lnblV0aWxpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgQ0tFZGl0b3JQbHVnaW5VdGlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDS0VkaXRvclBsdWdpblV0aWxpdHkoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENLRWRpdG9yUGx1Z2luVXRpbGl0eSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LCBudWxsLCBbe1xuICAgIGtleTogXCJBZGRQbHVnaW5zU2VydmVyQ29uZmlnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEFkZFBsdWdpbnNTZXJ2ZXJDb25maWcoc2luZ2xlTmFtZSwgdG9vbGJhckxvY2F0aW9uLCB0ZXh0LCBjbGllbnRSZXNvbHZlLCBzZXJ2ZXJSZXNvbHZlLCBjbGllbnRSZXNvbHZlSnMsIGRpYWxvZ1dpZHRoLCBkaWFsb2dIZWlnaHQsIGlzSkJ1aWxkNERDRGF0YSwgY29udHJvbENhdGVnb3J5LCBzZXJ2ZXJEeW5hbWljQmluZCwgc2hvd1JlbW92ZUJ1dHRvbiwgc2hvd0luRWRpdG9yVG9vbGJhciwgZW5hYmxlQ2hpbGRDb250cm9scykge1xuICAgICAgdGhpcy5QbHVnaW5zU2VydmVyQ29uZmlnW3NpbmdsZU5hbWVdID0ge1xuICAgICAgICBTaW5nbGVOYW1lOiBzaW5nbGVOYW1lLFxuICAgICAgICBUb29sYmFyTG9jYXRpb246IHRvb2xiYXJMb2NhdGlvbixcbiAgICAgICAgVG9vbGJhckxhYmVsOiB0ZXh0LFxuICAgICAgICBDbGllbnRSZXNvbHZlOiBjbGllbnRSZXNvbHZlLFxuICAgICAgICBTZXJ2ZXJSZXNvbHZlOiBzZXJ2ZXJSZXNvbHZlLFxuICAgICAgICBDbGllbnRSZXNvbHZlSnM6IGNsaWVudFJlc29sdmVKcyxcbiAgICAgICAgRGlhbG9nV2lkdGg6IGRpYWxvZ1dpZHRoLFxuICAgICAgICBEaWFsb2dIZWlnaHQ6IGRpYWxvZ0hlaWdodCxcbiAgICAgICAgSXNKQnVpbGQ0RENEYXRhOiBpc0pCdWlsZDREQ0RhdGEsXG4gICAgICAgIENvbnRyb2xDYXRlZ29yeTogY29udHJvbENhdGVnb3J5LFxuICAgICAgICBTZXJ2ZXJEeW5hbWljQmluZDogc2VydmVyRHluYW1pY0JpbmQsXG4gICAgICAgIFNob3dSZW1vdmVCdXR0b246IHNob3dSZW1vdmVCdXR0b24sXG4gICAgICAgIFNob3dJbkVkaXRvclRvb2xiYXI6IHNob3dJbkVkaXRvclRvb2xiYXIsXG4gICAgICAgIEVuYWJsZUNoaWxkQ29udHJvbHM6IGVuYWJsZUNoaWxkQ29udHJvbHNcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9Vc2VTZXJ2ZXJDb25maWdDb3ZlckVtcHR5UGx1Z2luUHJvcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfVXNlU2VydmVyQ29uZmlnQ292ZXJFbXB0eVBsdWdpblByb3Aob2JqKSB7XG4gICAgICB2YXIgY292ZXJPYmogPSB0aGlzLlBsdWdpbnNTZXJ2ZXJDb25maWdbb2JqLlNpbmdsZU5hbWVdO1xuXG4gICAgICBpZiAoY292ZXJPYmopIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgICBpZiAodHlwZW9mIG9ialtwcm9wXSAhPSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGlmIChvYmpbcHJvcF0gPT0gXCJcIiB8fCBvYmpbcHJvcF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICBpZiAoY292ZXJPYmpbcHJvcF0pIHtcbiAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBjb3Zlck9ialtwcm9wXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRHZW5lcmFsUGx1Z2luSW5zdGFuY2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0R2VuZXJhbFBsdWdpbkluc3RhbmNlKHBsdWdpblNpbmdsZU5hbWUsIGV4Q29uZmlnKSB7XG4gICAgICB2YXIgZGVmYXVsdFNldHRpbmcgPSB7XG4gICAgICAgIFNpbmdsZU5hbWU6IHBsdWdpblNpbmdsZU5hbWUsXG4gICAgICAgIERpYWxvZ05hbWU6ICcnLFxuICAgICAgICBEaWFsb2dXaWR0aDogbnVsbCxcbiAgICAgICAgRGlhbG9nSGVpZ2h0OiBudWxsLFxuICAgICAgICBEaWFsb2dQYWdlVXJsOiBCYXNlVXRpbGl0eS5BcHBlbmRUaW1lU3RhbXBVcmwoJ0RpYWxvZy5odG1sJyksXG4gICAgICAgIERpYWxvZ1RpdGxlOiBcIkRJVlwiLFxuICAgICAgICBUb29sYmFyQ29tbWFuZDogJycsXG4gICAgICAgIFRvb2xiYXJJY29uOiAnSWNvbi5wbmcnLFxuICAgICAgICBUb29sYmFyTGFiZWw6IFwiXCIsXG4gICAgICAgIFRvb2xiYXJMb2NhdGlvbjogJycsXG4gICAgICAgIElGcmFtZVdpbmRvdzogbnVsbCxcbiAgICAgICAgSUZyYW1lRXhlY3V0ZUFjdGlvbk5hbWU6IFwiSW5zZXJ0XCIsXG4gICAgICAgIERlc2lnbk1vZGFsSW5wdXRDc3M6IFwiXCIsXG4gICAgICAgIENsaWVudFJlc29sdmU6IFwiXCIsXG4gICAgICAgIFNlcnZlclJlc29sdmU6IFwiXCIsXG4gICAgICAgIElzSkJ1aWxkNERDRGF0YTogXCJcIixcbiAgICAgICAgQ29udHJvbENhdGVnb3J5OiBcIlwiLFxuICAgICAgICBTZXJ2ZXJEeW5hbWljQmluZDogXCJcIixcbiAgICAgICAgU2hvd1JlbW92ZUJ1dHRvbjogXCJcIixcbiAgICAgICAgU2hvd0luRWRpdG9yVG9vbGJhcjogXCJcIixcbiAgICAgICAgRW5hYmxlQ2hpbGRDb250cm9sczogXCJcIlxuICAgICAgfTtcbiAgICAgIGRlZmF1bHRTZXR0aW5nID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRTZXR0aW5nLCBleENvbmZpZyk7XG4gICAgICBkZWZhdWx0U2V0dGluZyA9IENLRWRpdG9yUGx1Z2luVXRpbGl0eS5fVXNlU2VydmVyQ29uZmlnQ292ZXJFbXB0eVBsdWdpblByb3AoZGVmYXVsdFNldHRpbmcpO1xuXG4gICAgICBpZiAoZGVmYXVsdFNldHRpbmcgIT0gbnVsbCkge1xuICAgICAgICBkZWZhdWx0U2V0dGluZy5EaWFsb2dOYW1lID0gZGVmYXVsdFNldHRpbmcuU2luZ2xlTmFtZTtcbiAgICAgICAgZGVmYXVsdFNldHRpbmcuVG9vbGJhckNvbW1hbmQgPSBcIkpCdWlsZDREQy5Gb3JtRGVzaWduLlBsdWdpbnMuXCIgKyBkZWZhdWx0U2V0dGluZy5TaW5nbGVOYW1lO1xuICAgICAgICBkZWZhdWx0U2V0dGluZy5EaWFsb2dTZXR0aW5nVGl0bGUgPSBkZWZhdWx0U2V0dGluZy5Ub29sYmFyTGFiZWwgKyBcIldlYuaOp+S7tlwiO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFNldHRpbmc6IGRlZmF1bHRTZXR0aW5nXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0RW5hYmxlQ2hpbGRDb250cm9sc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRFbmFibGVDaGlsZENvbnRyb2xzKHNpbmdsZU5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLlBsdWdpbnNbc2luZ2xlTmFtZV0uU2V0dGluZy5FbmFibGVDaGlsZENvbnRyb2xzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRQbHVnaW5zXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldFBsdWdpbnMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5QbHVnaW5zO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJSZWdHZW5lcmFsUGx1Z2luVG9FZGl0b3JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gUmVnR2VuZXJhbFBsdWdpblRvRWRpdG9yKGNrRWRpdG9yLCBwYXRoLCBwbHVnaW5TZXR0aW5nLCBva0Z1bmMpIHtcbiAgICAgIENLRURJVE9SLmRpYWxvZy5hZGRJZnJhbWUocGx1Z2luU2V0dGluZy5EaWFsb2dOYW1lLCBwbHVnaW5TZXR0aW5nLkRpYWxvZ1NldHRpbmdUaXRsZSwgcGF0aCArIHBsdWdpblNldHRpbmcuRGlhbG9nUGFnZVVybCwgcGx1Z2luU2V0dGluZy5EaWFsb2dXaWR0aCwgcGx1Z2luU2V0dGluZy5EaWFsb2dIZWlnaHQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuXy5mcmFtZUlkKTtcbiAgICAgICAgcGx1Z2luU2V0dGluZy5JRnJhbWVXaW5kb3cgPSBpZnJhbWU7XG4gICAgICAgIENLRWRpdG9yUGx1Z2luVXRpbGl0eS5TZXRFbGVtUHJvcHNJbkVkaXREaWFsb2cocGx1Z2luU2V0dGluZy5JRnJhbWVXaW5kb3csIHBsdWdpblNldHRpbmcuSUZyYW1lRXhlY3V0ZUFjdGlvbk5hbWUpO1xuICAgICAgfSwge1xuICAgICAgICBvbk9rOiBmdW5jdGlvbiBvbk9rKCkge1xuICAgICAgICAgIHZhciBwcm9wcyA9IHBsdWdpblNldHRpbmcuSUZyYW1lV2luZG93LmNvbnRlbnRXaW5kb3cuRGlhbG9nQXBwLmdldENvbnRyb2xQcm9wcygpO1xuXG4gICAgICAgICAgaWYgKHByb3BzLnN1Y2Nlc3MgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBva0Z1bmMoY2tFZGl0b3IsIHBsdWdpblNldHRpbmcsIHByb3BzLCBwbHVnaW5TZXR0aW5nLklGcmFtZVdpbmRvdy5jb250ZW50V2luZG93KTtcbiAgICAgICAgICBwbHVnaW5TZXR0aW5nLklGcmFtZUV4ZWN1dGVBY3Rpb25OYW1lID0gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LkRpYWxvZ0V4ZWN1dGVJbnNlcnRBY3Rpb25OYW1lO1xuICAgICAgICB9LFxuICAgICAgICBvbkNhbmNlbDogZnVuY3Rpb24gb25DYW5jZWwoKSB7XG4gICAgICAgICAgcGx1Z2luU2V0dGluZy5JRnJhbWVFeGVjdXRlQWN0aW9uTmFtZSA9IENLRWRpdG9yUGx1Z2luVXRpbGl0eS5EaWFsb2dFeGVjdXRlSW5zZXJ0QWN0aW9uTmFtZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBja0VkaXRvci5hZGRDb21tYW5kKHBsdWdpblNldHRpbmcuVG9vbGJhckNvbW1hbmQsIG5ldyBDS0VESVRPUi5kaWFsb2dDb21tYW5kKHBsdWdpblNldHRpbmcuRGlhbG9nTmFtZSkpO1xuXG4gICAgICBpZiAocGx1Z2luU2V0dGluZy5TaG93SW5FZGl0b3JUb29sYmFyID09IFwidHJ1ZVwiKSB7XG4gICAgICAgIGNrRWRpdG9yLnVpLmFkZEJ1dHRvbihwbHVnaW5TZXR0aW5nLlNpbmdsZU5hbWUsIHtcbiAgICAgICAgICBsYWJlbDogcGx1Z2luU2V0dGluZy5Ub29sYmFyTGFiZWwsXG4gICAgICAgICAgaWNvbjogcGF0aCArIHBsdWdpblNldHRpbmcuVG9vbGJhckljb24sXG4gICAgICAgICAgY29tbWFuZDogcGx1Z2luU2V0dGluZy5Ub29sYmFyQ29tbWFuZCxcbiAgICAgICAgICB0b29sYmFyOiBwbHVnaW5TZXR0aW5nLlRvb2xiYXJMb2NhdGlvblxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY2tFZGl0b3Iub24oJ2RvdWJsZWNsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIENLRWRpdG9yUGx1Z2luVXRpbGl0eS5PbkNLV3lzaXd5Z0VsZW1EQkNsaWNrRXZlbnQoZXZlbnQsIHBsdWdpblNldHRpbmcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIk9uQ0tXeXNpd3lnRWxlbURCQ2xpY2tFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBPbkNLV3lzaXd5Z0VsZW1EQkNsaWNrRXZlbnQoZXZlbnQsIGNvbnRyb2xTZXR0aW5nKSB7XG4gICAgICB2YXIgZWxlbWVudCA9IGV2ZW50LmRhdGEuZWxlbWVudDtcblxuICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwicnVudGltZV9hdXRvX3JlbW92ZVwiKSA9PSBcInRydWVcIikge1xuICAgICAgICBlbGVtZW50ID0gZXZlbnQuZGF0YS5lbGVtZW50LmdldFBhcmVudCgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2luZ2xlTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwic2luZ2xlTmFtZVwiKTtcblxuICAgICAgaWYgKHNpbmdsZU5hbWUgPT0gY29udHJvbFNldHRpbmcuU2luZ2xlTmFtZSkge1xuICAgICAgICBDS0VkaXRvclV0aWxpdHkuU2V0U2VsZWN0ZWRFbGVtKGVsZW1lbnQuZ2V0T3V0ZXJIdG1sKCkpO1xuICAgICAgICBldmVudC5kYXRhLmRpYWxvZyA9IGNvbnRyb2xTZXR0aW5nLkRpYWxvZ05hbWU7XG4gICAgICAgIGNvbnRyb2xTZXR0aW5nLklGcmFtZUV4ZWN1dGVBY3Rpb25OYW1lID0gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LkRpYWxvZ0V4ZWN1dGVFZGl0QWN0aW9uTmFtZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2VyaWFsaXplUHJvcHNUb0VsZW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2VyaWFsaXplUHJvcHNUb0VsZW0oZWxlbSwgcHJvcHMsIGNvbnRyb2xTZXR0aW5nKSB7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcImpidWlsZDRkY19jdXN0b21cIiwgXCJ0cnVlXCIpO1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJzaW5nbGVuYW1lXCIsIGNvbnRyb2xTZXR0aW5nLlNpbmdsZU5hbWUpO1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJpc19qYnVpbGQ0ZGNfZGF0YVwiLCBjb250cm9sU2V0dGluZy5Jc0pCdWlsZDREQ0RhdGEpO1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJjb250cm9sX2NhdGVnb3J5XCIsIGNvbnRyb2xTZXR0aW5nLkNvbnRyb2xDYXRlZ29yeSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcInNob3dfcmVtb3ZlX2J1dHRvblwiLCBjb250cm9sU2V0dGluZy5TaG93UmVtb3ZlQnV0dG9uKTtcblxuICAgICAgaWYgKHByb3BzW1wiYmFzZUluZm9cIl0pIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3BzW1wiYmFzZUluZm9cIl0pIHtcbiAgICAgICAgICBpZiAoa2V5ID09IFwicmVhZG9ubHlcIikge1xuICAgICAgICAgICAgaWYgKHByb3BzW1wiYmFzZUluZm9cIl1ba2V5XSA9PSBcInJlYWRvbmx5XCIpIHtcbiAgICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiYmFzZUluZm9cIl1ba2V5XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZShcInJlYWRvbmx5XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09IFwiZGlzYWJsZWRcIikge1xuICAgICAgICAgICAgaWYgKHByb3BzW1wiYmFzZUluZm9cIl1ba2V5XSA9PSBcImRpc2FibGVkXCIpIHtcbiAgICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiYmFzZUluZm9cIl1ba2V5XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShrZXkudG9Mb2NhbGVMb3dlckNhc2UoKSwgcHJvcHNbXCJiYXNlSW5mb1wiXVtrZXldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzW1wiYmluZFRvRmllbGRcIl0pIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3BzW1wiYmluZFRvRmllbGRcIl0pIHtcbiAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShrZXkudG9Mb2NhbGVMb3dlckNhc2UoKSwgcHJvcHNbXCJiaW5kVG9GaWVsZFwiXVtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHNbXCJkZWZhdWx0VmFsdWVcIl0pIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3BzW1wiZGVmYXVsdFZhbHVlXCJdKSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiZGVmYXVsdFZhbHVlXCJdW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wc1tcInZhbGlkYXRlUnVsZXNcIl0pIHtcbiAgICAgICAgaWYgKHByb3BzW1widmFsaWRhdGVSdWxlc1wiXS5ydWxlcykge1xuICAgICAgICAgIGlmIChwcm9wc1tcInZhbGlkYXRlUnVsZXNcIl0ucnVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJ2YWxpZGF0ZXJ1bGVzXCIsIGVuY29kZVVSSUNvbXBvbmVudChKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcocHJvcHNbXCJ2YWxpZGF0ZVJ1bGVzXCJdKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHNbXCJub3JtYWxQcm9wc1wiXSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHNbXCJub3JtYWxQcm9wc1wiXSkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcIm5vcm1hbFByb3BzXCJdW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wc1tcImJpbmRUb1NlYXJjaEZpZWxkXCJdKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1tcImJpbmRUb1NlYXJjaEZpZWxkXCJdKSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiYmluZFRvU2VhcmNoRmllbGRcIl1ba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzW1wibm9ybWFsRGF0YVNvdXJjZVwiXSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHNbXCJub3JtYWxEYXRhU291cmNlXCJdKSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wibm9ybWFsRGF0YVNvdXJjZVwiXVtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZWxlbTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiRGVzZXJpYWxpemVQcm9wc0Zyb21FbGVtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIERlc2VyaWFsaXplUHJvcHNGcm9tRWxlbShlbGVtKSB7XG4gICAgICB2YXIgcHJvcHMgPSB7fTtcbiAgICAgIHZhciAkZWxlbSA9ICQoZWxlbSk7XG5cbiAgICAgIGZ1bmN0aW9uIGF0dHJUb1Byb3AocHJvcHMsIGdyb3VwTmFtZSkge1xuICAgICAgICB2YXIgZ3JvdXBQcm9wID0ge307XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuRGVmYXVsdFByb3BzW2dyb3VwTmFtZV0pIHtcbiAgICAgICAgICBpZiAoJGVsZW0uYXR0cihrZXkpKSB7XG4gICAgICAgICAgICBncm91cFByb3Bba2V5XSA9ICRlbGVtLmF0dHIoa2V5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ3JvdXBQcm9wW2tleV0gPSB0aGlzLkRlZmF1bHRQcm9wc1tncm91cE5hbWVdW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJvcHNbZ3JvdXBOYW1lXSA9IGdyb3VwUHJvcDtcbiAgICAgICAgcmV0dXJuIHByb3BzO1xuICAgICAgfVxuXG4gICAgICBwcm9wcyA9IGF0dHJUb1Byb3AuY2FsbCh0aGlzLCBwcm9wcywgXCJiYXNlSW5mb1wiKTtcbiAgICAgIHByb3BzID0gYXR0clRvUHJvcC5jYWxsKHRoaXMsIHByb3BzLCBcImJpbmRUb0ZpZWxkXCIpO1xuICAgICAgcHJvcHMgPSBhdHRyVG9Qcm9wLmNhbGwodGhpcywgcHJvcHMsIFwiZGVmYXVsdFZhbHVlXCIpO1xuICAgICAgcHJvcHMgPSBhdHRyVG9Qcm9wLmNhbGwodGhpcywgcHJvcHMsIFwiYmluZFRvU2VhcmNoRmllbGRcIik7XG4gICAgICBwcm9wcyA9IGF0dHJUb1Byb3AuY2FsbCh0aGlzLCBwcm9wcywgXCJub3JtYWxEYXRhU291cmNlXCIpO1xuXG4gICAgICBpZiAoJGVsZW0uYXR0cihcInZhbGlkYXRlUnVsZXNcIikpIHtcbiAgICAgICAgcHJvcHMudmFsaWRhdGVSdWxlcyA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbihkZWNvZGVVUklDb21wb25lbnQoJGVsZW0uYXR0cihcInZhbGlkYXRlUnVsZXNcIikpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3BzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJCdWlsZEdlbmVyYWxFbGVtVG9DS1d5c2l3eWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gQnVpbGRHZW5lcmFsRWxlbVRvQ0tXeXNpd3lnKGh0bWwsIGNvbnRyb2xTZXR0aW5nLCBjb250cm9sUHJvcHMsIF9pZnJhbWUpIHtcbiAgICAgIGlmICh0aGlzLlZhbGlkYXRlQnVpbGRFbmFibGUoaHRtbCwgY29udHJvbFNldHRpbmcsIGNvbnRyb2xQcm9wcywgX2lmcmFtZSkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJJRnJhbWVFeGVjdXRlQWN0aW9uTmFtZTpcIiArIGNvbnRyb2xTZXR0aW5nLklGcmFtZUV4ZWN1dGVBY3Rpb25OYW1lKTtcblxuICAgICAgICBpZiAoY29udHJvbFNldHRpbmcuSUZyYW1lRXhlY3V0ZUFjdGlvbk5hbWUgPT0gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LkRpYWxvZ0V4ZWN1dGVJbnNlcnRBY3Rpb25OYW1lKSB7XG4gICAgICAgICAgdmFyIGVsZW0gPSBDS0VESVRPUi5kb20uZWxlbWVudC5jcmVhdGVGcm9tSHRtbChodG1sKTtcbiAgICAgICAgICB0aGlzLlNlcmlhbGl6ZVByb3BzVG9FbGVtKGVsZW0sIGNvbnRyb2xQcm9wcywgY29udHJvbFNldHRpbmcpO1xuICAgICAgICAgIENLRWRpdG9yVXRpbGl0eS5HZXRDS0VkaXRvckluc3QoKS5pbnNlcnRFbGVtZW50KGVsZW0pO1xuICAgICAgICAgIENLRWRpdG9yVXRpbGl0eS5TaW5nbGVFbGVtQmluZERlZmF1bHRFdmVudChlbGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc2VsZWN0ZWRFbGVtID0gQ0tFZGl0b3JVdGlsaXR5LkdldFNlbGVjdGVkQ0tFZGl0b3JFbGVtKCk7XG5cbiAgICAgICAgICBpZiAoc2VsZWN0ZWRFbGVtKSB7XG4gICAgICAgICAgICB2YXIgcmVGcmVzaEVsZW0gPSBuZXcgQ0tFRElUT1IuZG9tLmVsZW1lbnQuY3JlYXRlRnJvbUh0bWwoc2VsZWN0ZWRFbGVtLmdldE91dGVySHRtbCgpKTtcblxuICAgICAgICAgICAgaWYgKHJlRnJlc2hFbGVtLmdldEF0dHJpYnV0ZShcImNvbnRyb2xfY2F0ZWdvcnlcIikgPT0gXCJJbnB1dENvbnRyb2xcIikge1xuICAgICAgICAgICAgICB2YXIgbmV3VGV4dCA9ICQoaHRtbCkuaHRtbCgpO1xuICAgICAgICAgICAgICByZUZyZXNoRWxlbS5zZXRIdG1sKG5ld1RleHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxlY3RlZEVsZW0uY29weUF0dHJpYnV0ZXMocmVGcmVzaEVsZW0sIHtcbiAgICAgICAgICAgICAgdGVtcDogXCJ0ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5TZXJpYWxpemVQcm9wc1RvRWxlbShyZUZyZXNoRWxlbSwgY29udHJvbFByb3BzLCBjb250cm9sU2V0dGluZyk7XG4gICAgICAgICAgICByZUZyZXNoRWxlbS5yZXBsYWNlKHNlbGVjdGVkRWxlbSk7XG4gICAgICAgICAgICBDS0VkaXRvclV0aWxpdHkuU2luZ2xlRWxlbUJpbmREZWZhdWx0RXZlbnQocmVGcmVzaEVsZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJWYWxpZGF0ZUJ1aWxkRW5hYmxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFZhbGlkYXRlQnVpbGRFbmFibGUoaHRtbCwgY29udHJvbFNldHRpbmcsIGNvbnRyb2xQcm9wcywgX2lmcmFtZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlZhbGlkYXRlU2VyaWFsaXplQ29udHJvbERpYWxvZ0NvbXBsZXRlZEVuYWJsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBWYWxpZGF0ZVNlcmlhbGl6ZUNvbnRyb2xEaWFsb2dDb21wbGV0ZWRFbmFibGUocmV0dXJuUmVzdWx0KSB7XG4gICAgICBpZiAocmV0dXJuUmVzdWx0LmJhc2VJbmZvLnNlcmlhbGl6ZSA9PSBcInRydWVcIiAmJiByZXR1cm5SZXN1bHQuYmluZFRvRmllbGQuZmllbGROYW1lID09IFwiXCIpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi5bqP5YiX5YyW55qE5o6n5Lu25b+F6aG757uR5a6a5a2X5q61IVwiLCBudWxsKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmV0dXJuUmVzdWx0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJTZXRFbGVtUHJvcHNJbkVkaXREaWFsb2dcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2V0RWxlbVByb3BzSW5FZGl0RGlhbG9nKGlmcmFtZU9iaiwgYWN0aW9uTmFtZSkge1xuICAgICAgdmFyIHNlbCA9IENLRWRpdG9yVXRpbGl0eS5HZXRDS0VkaXRvckluc3QoKS5nZXRTZWxlY3Rpb24oKS5nZXRTdGFydEVsZW1lbnQoKTtcbiAgICAgIHZhciBwYXJlbnRzID0gbnVsbDtcblxuICAgICAgaWYgKHNlbCkge1xuICAgICAgICBwYXJlbnRzID0gc2VsLmdldFBhcmVudHMoKTtcbiAgICAgIH1cblxuICAgICAgaWZyYW1lT2JqLmNvbnRlbnRXaW5kb3cuRGlhbG9nQXBwLnJlYWR5KGFjdGlvbk5hbWUsIHNlbCwgcGFyZW50cyk7XG5cbiAgICAgIGlmIChhY3Rpb25OYW1lID09IHRoaXMuRGlhbG9nRXhlY3V0ZUVkaXRBY3Rpb25OYW1lKSB7XG4gICAgICAgIHZhciBlbGVtID0gQ0tFZGl0b3JVdGlsaXR5LkdldFNlbGVjdGVkRWxlbSgpLm91dGVySFRNTCgpO1xuICAgICAgICB2YXIgcHJvcHMgPSB0aGlzLkRlc2VyaWFsaXplUHJvcHNGcm9tRWxlbShlbGVtKTtcbiAgICAgICAgaWZyYW1lT2JqLmNvbnRlbnRXaW5kb3cuRGlhbG9nQXBwLnNldENvbnRyb2xQcm9wcygkKGVsZW0pLCBwcm9wcyk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldENvbnRyb2xEZXNjVGV4dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRDb250cm9sRGVzY1RleHQocGx1Z2luU2V0dGluZywgcHJvcHMpIHtcbiAgICAgIGNvbnNvbGUubG9nKHByb3BzKTtcbiAgICAgIHZhciByZXN1bHQgPSBcIuexu+WeizrjgJBcIiArIHBsdWdpblNldHRpbmcuVG9vbGJhckxhYmVsICsgXCLjgJE8YnIgLz7nu5Hlrpo644CQXCIgKyBwcm9wcy5iaW5kVG9GaWVsZC50YWJsZUNhcHRpb24gKyBcIi1cIiArIHByb3BzLmJpbmRUb0ZpZWxkLmZpZWxkQ2FwdGlvbiArIFwi44CRXCI7XG5cbiAgICAgIGlmIChwcm9wcy5kZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgaWYgKHByb3BzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCkge1xuICAgICAgICAgIHJlc3VsdCArPSBcIjxiciAvPum7mOiupDrjgJBcIiArIHByb3BzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSArIFwiOlwiICsgcHJvcHMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUZXh0ICsgXCLjgJFcIjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHMudmFsaWRhdGVSdWxlcykge1xuICAgICAgICBpZiAocHJvcHMudmFsaWRhdGVSdWxlcy5ydWxlcykge1xuICAgICAgICAgIGlmIChwcm9wcy52YWxpZGF0ZVJ1bGVzLnJ1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBcIjxiciAvPumqjOivgTrjgJBcIjtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy52YWxpZGF0ZVJ1bGVzLnJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCArPSBwcm9wcy52YWxpZGF0ZVJ1bGVzLnJ1bGVzW2ldLnZhbGlkYXRlVHlwZSArIFwiO1wiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXN1bHQgPSBTdHJpbmdVdGlsaXR5LlJlbW92ZUxhc3RDaGFyKHJlc3VsdCk7XG4gICAgICAgICAgICByZXN1bHQgKz0gXCLjgJFcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0U2VhcmNoQ29udHJvbERlc2NUZXh0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldFNlYXJjaENvbnRyb2xEZXNjVGV4dChwbHVnaW5TZXR0aW5nLCBwcm9wcykge1xuICAgICAgcmV0dXJuIFwiW1wiICsgcGx1Z2luU2V0dGluZy5Ub29sYmFyTGFiZWwgKyBcIl0g57uR5a6aOltcIiArIHByb3BzLmJpbmRUb1NlYXJjaEZpZWxkLmNvbHVtbkNhcHRpb24gKyBcIl0oXCIgKyBwcm9wcy5iaW5kVG9TZWFyY2hGaWVsZC5jb2x1bW5PcGVyYXRvciArIFwiKVwiO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRBdXRvUmVtb3ZlVGlwTGFiZWxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0QXV0b1JlbW92ZVRpcExhYmVsKHRpcE1zZykge1xuICAgICAgaWYgKCF0aXBNc2cpIHtcbiAgICAgICAgdGlwTXNnID0gXCLlj4zlh7vnvJbovpHor6Xpg6jku7ZcIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc8ZGl2IHJ1bnRpbWVfYXV0b19yZW1vdmU9XCJ0cnVlXCIgY2xhc3M9XCJ3eXNpd3lnLWF1dG8tcmVtb3ZlLXRpcFwiPicgKyB0aXBNc2cgKyAnPC9kaXY+JztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiVHJ5R2V0TGlzdEJ1dHRvbnNJblBsdWdpblBhZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gVHJ5R2V0TGlzdEJ1dHRvbnNJblBsdWdpblBhZ2UoKSB7XG4gICAgICB2YXIgYnV0dG9ucyA9IFtdO1xuICAgICAgdmFyIGh0bWwgPSBDS0VkaXRvclV0aWxpdHkuR2V0Q0tFZGl0b3JIVE1MSW5QbHVnaW5QYWdlKCk7XG4gICAgICB2YXIgJGJ1dHRvbnMgPSAkKGh0bWwpLmZpbmQoXCJbYnV0dG9uY2FwdGlvbl1cIik7XG4gICAgICAkYnV0dG9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGJ1dHRvbkNhcHRpb24gPSAkKHRoaXMpLmF0dHIoXCJidXR0b25jYXB0aW9uXCIpO1xuICAgICAgICB2YXIgYnV0dG9uSWQgPSAkKHRoaXMpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgYnV0dG9ucy5wdXNoKHtcbiAgICAgICAgICBidXR0b25DYXB0aW9uOiBidXR0b25DYXB0aW9uLFxuICAgICAgICAgIGJ1dHRvbklkOiBidXR0b25JZFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGJ1dHRvbnM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlRyeUdldERhdGFTZXRJZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBUcnlHZXREYXRhU2V0SWQoc2VsLCBwYXJlbnRzKSB7XG4gICAgICBpZiAoc2VsKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBwYXJlbnRzLmxlbmd0aCAtIDE7IGktLTsgaSA+PSAwKSB7XG4gICAgICAgICAgaWYgKHBhcmVudHNbaV0uZ2V0QXR0cmlidXRlKFwiZGF0YXNldGlkXCIpICE9IG51bGwgJiYgcGFyZW50c1tpXS5nZXRBdHRyaWJ1dGUoXCJkYXRhc2V0aWRcIikgIT0gXCJcIikge1xuICAgICAgICAgICAgcmV0dXJuIHBhcmVudHNbaV0uZ2V0QXR0cmlidXRlKFwiZGF0YXNldGlkXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuZGF0YVNldElkKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cucGFyZW50Lmxpc3REZXNpZ24ubGlzdFJlc291cmNlRW50aXR5Lmxpc3REYXRhc2V0SWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJUZW1wbGF0ZUFkZERlZlByb3BcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gVGVtcGxhdGVBZGREZWZQcm9wKCR0ZW1wbGF0ZUVsZW0sIGlkLCBzaG93X3JlbW92ZV9idXR0b24sIHNpbmdsZU5hbWUsIHN0YXR1cykge1xuICAgICAgJHRlbXBsYXRlRWxlbS5hdHRyKFwiY2xhc3NuYW1lXCIsIFwiXCIpO1xuICAgICAgJHRlbXBsYXRlRWxlbS5hdHRyKFwiY29udHJvbF9jYXRlZ29yeVwiLCBcIkNvbnRhaW5lckNvbnRyb2xcIik7XG4gICAgICAkdGVtcGxhdGVFbGVtLmF0dHIoXCJjdXN0ZGlzYWJsZWRcIiwgXCJub2Rpc2FibGVkXCIpO1xuICAgICAgJHRlbXBsYXRlRWxlbS5hdHRyKFwiY3VzdHJlYWRvbmx5XCIsIFwibm9yZWFkb25seVwiKTtcbiAgICAgICR0ZW1wbGF0ZUVsZW0uYXR0cihcImRlc2NcIiwgXCJcIik7XG4gICAgICAkdGVtcGxhdGVFbGVtLmF0dHIoXCJpZFwiLCBpZCk7XG4gICAgICAkdGVtcGxhdGVFbGVtLmF0dHIoXCJpc19qYnVpbGQ0ZGNfZGF0YVwiLCBcImZhbHNlXCIpO1xuICAgICAgJHRlbXBsYXRlRWxlbS5hdHRyKFwiamJ1aWxkNGRjX2N1c3RvbVwiLCBcInRydWVcIik7XG4gICAgICAkdGVtcGxhdGVFbGVtLmF0dHIoXCJuYW1lXCIsIGlkKTtcbiAgICAgICR0ZW1wbGF0ZUVsZW0uYXR0cihcInBsYWNlaG9sZGVyXCIsIFwiXCIpO1xuICAgICAgJHRlbXBsYXRlRWxlbS5hdHRyKFwic2VyaWFsaXplXCIsIFwiZmFsc2VcIik7XG4gICAgICAkdGVtcGxhdGVFbGVtLmF0dHIoXCJzaG93X3JlbW92ZV9idXR0b25cIiwgc2hvd19yZW1vdmVfYnV0dG9uKTtcbiAgICAgICR0ZW1wbGF0ZUVsZW0uYXR0cihcInNpbmdsZW5hbWVcIiwgc2luZ2xlTmFtZSk7XG4gICAgICAkdGVtcGxhdGVFbGVtLmF0dHIoXCJzdHlsZVwiLCBcIlwiKTtcbiAgICAgICR0ZW1wbGF0ZUVsZW0uYXR0cihcInN0YXR1c1wiLCBzdGF0dXMpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDS0VkaXRvclBsdWdpblV0aWxpdHk7XG59KCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiUGx1Z2luc1NlcnZlckNvbmZpZ1wiLCB7fSk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiUGx1Z2luc1wiLCB7fSk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiRGVmYXVsdFByb3BzXCIsIHtcbiAgYmluZFRvRmllbGQ6IHtcbiAgICByZWxhdGlvbklkOiBcIlwiLFxuICAgIHRhYmxlSWQ6IFwiXCIsXG4gICAgdGFibGVOYW1lOiBcIlwiLFxuICAgIHRhYmxlQ2FwdGlvbjogXCJcIixcbiAgICBmaWVsZE5hbWU6IFwiXCIsXG4gICAgZmllbGRDYXB0aW9uOiBcIlwiLFxuICAgIGZpZWxkRGF0YVR5cGU6IFwiXCIsXG4gICAgZmllbGRMZW5ndGg6IFwiXCJcbiAgfSxcbiAgZGVmYXVsdFZhbHVlOiB7XG4gICAgZGVmYXVsdFR5cGU6IFwiXCIsXG4gICAgZGVmYXVsdFZhbHVlOiBcIlwiLFxuICAgIGRlZmF1bHRUZXh0OiBcIlwiXG4gIH0sXG4gIHZhbGlkYXRlUnVsZXM6IHtcbiAgICBtc2c6IFwiXCIsXG4gICAgcnVsZXM6IFtdXG4gIH0sXG4gIGJhc2VJbmZvOiB7XG4gICAgaWQ6IFwiXCIsXG4gICAgc2VyaWFsaXplOiBcInRydWVcIixcbiAgICBuYW1lOiBcIlwiLFxuICAgIGNsYXNzTmFtZTogXCJcIixcbiAgICBwbGFjZWhvbGRlcjogXCJcIixcbiAgICBjdXN0UmVhZG9ubHk6IFwibm9yZWFkb25seVwiLFxuICAgIGN1c3REaXNhYmxlZDogXCJub2Rpc2FibGVkXCIsXG4gICAgc3R5bGU6IFwiXCIsXG4gICAgZGVzYzogXCJcIixcbiAgICBzdGF0dXM6IFwiZW5hYmxlXCIsXG4gICAgZ3JvdXBOYW1lOiBcIlwiXG4gIH0sXG4gIGJpbmRUb1NlYXJjaEZpZWxkOiB7XG4gICAgY29sdW1uVGl0bGU6IFwiXCIsXG4gICAgY29sdW1uVGFibGVOYW1lOiBcIlwiLFxuICAgIGNvbHVtbk5hbWU6IFwiXCIsXG4gICAgY29sdW1uQ2FwdGlvbjogXCJcIixcbiAgICBjb2x1bW5EYXRhVHlwZU5hbWU6IFwiXCIsXG4gICAgY29sdW1uT3BlcmF0b3I6IFwi5Yy56YWNXCJcbiAgfSxcbiAgbm9ybWFsRGF0YVNvdXJjZToge1xuICAgIGRlZmF1bHRJc051bGw6IFwidHJ1ZVwiLFxuICAgIHNxbERhdGFTb3VyY2U6IFwiXCIsXG4gICAgZGljdGlvbmFyeUdyb3VwRGF0YVNvdXJjZUlkOiBcIlwiLFxuICAgIGRpY3Rpb25hcnlHcm91cERhdGFTb3VyY2VUZXh0OiBcIlwiLFxuICAgIHJlc3REYXRhU291cmNlOiBcIlwiLFxuICAgIGludGVyZmFjZURhdGFTb3VyY2U6IFwiXCIsXG4gICAgc3RhdGljRGF0YVNvdXJjZTogXCJcIixcbiAgICBkZWZhdWx0U2VsZWN0ZWQ6IFwiXCIsXG4gICAgbGF5b3V0RGlyZWN0aW9uOiBcInZlcnRpY2FsXCIsXG4gICAgcm93TnVtOiBcIjBcIixcbiAgICBkaXNwbGF5VmFsdWVJblRleHQ6IFwiZmFsc2VcIlxuICB9XG59KTtcblxuX2RlZmluZVByb3BlcnR5KENLRWRpdG9yUGx1Z2luVXRpbGl0eSwgXCJEaWFsb2dFeGVjdXRlRWRpdEFjdGlvbk5hbWVcIiwgXCJFZGl0XCIpO1xuXG5fZGVmaW5lUHJvcGVydHkoQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LCBcIkRpYWxvZ0V4ZWN1dGVJbnNlcnRBY3Rpb25OYW1lXCIsIFwiSW5zZXJ0XCIpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBDS0VkaXRvclV0aWxpdHkgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENLRWRpdG9yVXRpbGl0eSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ0tFZGl0b3JVdGlsaXR5KTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhDS0VkaXRvclV0aWxpdHksIG51bGwsIFt7XG4gICAga2V5OiBcIlNldFNlbGVjdGVkRWxlbVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRTZWxlY3RlZEVsZW0oZWxlbUh0bWwpIHtcbiAgICAgIHRoaXMuXyRDS0VkaXRvclNlbGVjdEVsZW0gPSAkKGVsZW1IdG1sKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0U2VsZWN0ZWRFbGVtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldFNlbGVjdGVkRWxlbSgpIHtcbiAgICAgIGlmICh0aGlzLl8kQ0tFZGl0b3JTZWxlY3RFbGVtKSB7XG4gICAgICAgIGlmICh0aGlzLl8kQ0tFZGl0b3JTZWxlY3RFbGVtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fJENLRWRpdG9yU2VsZWN0RWxlbTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0U2VsZWN0ZWRDS0VkaXRvckVsZW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0U2VsZWN0ZWRDS0VkaXRvckVsZW0oKSB7XG4gICAgICBpZiAodGhpcy5HZXRTZWxlY3RlZEVsZW0oKSkge1xuICAgICAgICB2YXIgaWQgPSB0aGlzLkdldFNlbGVjdGVkRWxlbSgpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLkdldENLRWRpdG9ySW5zdCgpLmRvY3VtZW50LmdldEJ5SWQoaWQpO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNldExhc3RTZWxlY3RlZFRlbXBIVE1MXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldExhc3RTZWxlY3RlZFRlbXBIVE1MKGh0bWwpIHtcbiAgICAgIHRoaXMuX0xhc3RTZWxlY3RlZFRlbXBIVE1MID0gaHRtbDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0TGFzdFNlbGVjdGVkVGVtcEhUTUxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0TGFzdFNlbGVjdGVkVGVtcEhUTUwoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fTGFzdFNlbGVjdGVkVGVtcEhUTUw7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlRyeUdldElkRnJvbUxhc3RTZWxlY3RlZFRlbXBIVE1MXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFRyeUdldElkRnJvbUxhc3RTZWxlY3RlZFRlbXBIVE1MKG5ld0hUTUwpIHtcbiAgICAgIGlmICghdGhpcy5fTGFzdFNlbGVjdGVkVGVtcEhUTUwpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmFtZSA9ICQobmV3SFRNTCkuYXR0cihcIm5hbWVcIik7XG4gICAgICAgIHZhciBsYXN0SHRtbE5hbWUgPSAkKHRoaXMuR2V0TGFzdFNlbGVjdGVkVGVtcEhUTUwoKSkuYXR0cihcIm5hbWVcIik7XG5cbiAgICAgICAgaWYgKG5hbWUgPT0gbGFzdEh0bWxOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuICQodGhpcy5HZXRMYXN0U2VsZWN0ZWRUZW1wSFRNTCgpKS5hdHRyKFwiaWRcIik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldENLRWRpdG9ySW5zdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRDS0VkaXRvckluc3QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fQ0tFZGl0b3JJbnN0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJTZXRDS0VkaXRvckluc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2V0Q0tFZGl0b3JJbnN0KGluc3QpIHtcbiAgICAgIHRoaXMuX0NLRWRpdG9ySW5zdCA9IGluc3Q7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldENLRWRpdG9ySFRNTFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRDS0VkaXRvckhUTUwoKSB7XG4gICAgICB0aGlzLkNsZWFyQUxMRm9yRGl2RWxlbUJ1dHRvbigpO1xuICAgICAgdGhpcy5DbGVhckFMTFBsdWdpbklubmVyUGFuZWwoKTtcbiAgICAgIHJldHVybiB0aGlzLkdldENLRWRpdG9ySW5zdCgpLmdldERhdGEoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0Q0tFZGl0b3JIVE1MXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldENLRWRpdG9ySFRNTChodG1sKSB7XG4gICAgICB0aGlzLkdldENLRWRpdG9ySW5zdCgpLnNldERhdGEoaHRtbCk7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIENLRWRpdG9yVXRpbGl0eS5BTExFbGVtQmluZERlZmF1bHRFdmVudCgpO1xuICAgICAgfSwgNTAwKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0Q0tFZGl0b3JIVE1MSW5QbHVnaW5QYWdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldENLRWRpdG9ySFRNTEluUGx1Z2luUGFnZSgpIHtcbiAgICAgIHJldHVybiB3aW5kb3cucGFyZW50LkNLRWRpdG9yVXRpbGl0eS5HZXRDS0VkaXRvckhUTUwoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiSW5pdGlhbGl6ZUNLRWRpdG9yXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEluaXRpYWxpemVDS0VkaXRvcih0ZXh0QXJlYUVsZW1JZCwgcGx1Z2luc0NvbmZpZywgbG9hZENvbXBsZXRlZEZ1bmMsIGNrZWRpdG9yQ29uZmlnRnVsbFBhdGgsIHBsdWdpbkJhc2VQYXRoLCB0aGVtZVZvKSB7XG4gICAgICB2YXIgZXh0cmFQbHVnaW5zID0gbmV3IEFycmF5KCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGx1Z2luc0NvbmZpZy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc2luZ2xlUGx1Z2luQ29uZmlnID0gcGx1Z2luc0NvbmZpZ1tpXTtcbiAgICAgICAgdmFyIHNpbmdsZU5hbWUgPSBzaW5nbGVQbHVnaW5Db25maWcuc2luZ2xlTmFtZTtcbiAgICAgICAgdmFyIHRvb2xiYXJMb2NhdGlvbiA9IHNpbmdsZVBsdWdpbkNvbmZpZy50b29sYmFyTG9jYXRpb247XG4gICAgICAgIHZhciB0ZXh0ID0gc2luZ2xlUGx1Z2luQ29uZmlnLnRleHQ7XG4gICAgICAgIHZhciBzZXJ2ZXJSZXNvbHZlID0gc2luZ2xlUGx1Z2luQ29uZmlnLnNlcnZlclJlc29sdmU7XG4gICAgICAgIHZhciBjbGllbnRSZXNvbHZlID0gc2luZ2xlUGx1Z2luQ29uZmlnLmNsaWVudFJlc29sdmU7XG4gICAgICAgIHZhciBjbGllbnRSZXNvbHZlSnMgPSBzaW5nbGVQbHVnaW5Db25maWcuY2xpZW50UmVzb2x2ZUpzO1xuICAgICAgICB2YXIgZGlhbG9nV2lkdGggPSBzaW5nbGVQbHVnaW5Db25maWcuZGlhbG9nV2lkdGg7XG4gICAgICAgIHZhciBkaWFsb2dIZWlnaHQgPSBzaW5nbGVQbHVnaW5Db25maWcuZGlhbG9nSGVpZ2h0O1xuICAgICAgICB2YXIgaXNKQnVpbGQ0RENEYXRhID0gc2luZ2xlUGx1Z2luQ29uZmlnLmlzSkJ1aWxkNERDRGF0YTtcbiAgICAgICAgdmFyIGNvbnRyb2xDYXRlZ29yeSA9IHNpbmdsZVBsdWdpbkNvbmZpZy5jb250cm9sQ2F0ZWdvcnk7XG4gICAgICAgIHZhciBzZXJ2ZXJEeW5hbWljQmluZCA9IHNpbmdsZVBsdWdpbkNvbmZpZy5zZXJ2ZXJEeW5hbWljQmluZDtcbiAgICAgICAgdmFyIHNob3dSZW1vdmVCdXR0b24gPSBzaW5nbGVQbHVnaW5Db25maWcuc2hvd1JlbW92ZUJ1dHRvbjtcbiAgICAgICAgdmFyIHNob3dJbkVkaXRvclRvb2xiYXIgPSBzaW5nbGVQbHVnaW5Db25maWcuc2hvd0luRWRpdG9yVG9vbGJhcjtcbiAgICAgICAgdmFyIGVuYWJsZUNoaWxkQ29udHJvbHMgPSBzaW5nbGVQbHVnaW5Db25maWcuZW5hYmxlQ2hpbGRDb250cm9scztcbiAgICAgICAgdmFyIHBsdWdpbkZpbGVOYW1lID0gc2luZ2xlTmFtZSArIFwiUGx1Z2luLmpzXCI7XG4gICAgICAgIHZhciBwbHVnaW5Gb2xkZXJOYW1lID0gcGx1Z2luQmFzZVBhdGggKyBzaW5nbGVOYW1lICsgXCIvXCI7XG4gICAgICAgIENLRURJVE9SLnBsdWdpbnMuYWRkRXh0ZXJuYWwoc2luZ2xlTmFtZSwgcGx1Z2luRm9sZGVyTmFtZSwgcGx1Z2luRmlsZU5hbWUpO1xuICAgICAgICBleHRyYVBsdWdpbnMucHVzaChzaW5nbGVOYW1lKTtcbiAgICAgICAgQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LkFkZFBsdWdpbnNTZXJ2ZXJDb25maWcoc2luZ2xlTmFtZSwgdG9vbGJhckxvY2F0aW9uLCB0ZXh0LCBjbGllbnRSZXNvbHZlLCBzZXJ2ZXJSZXNvbHZlLCBjbGllbnRSZXNvbHZlSnMsIGRpYWxvZ1dpZHRoLCBkaWFsb2dIZWlnaHQsIGlzSkJ1aWxkNERDRGF0YSwgY29udHJvbENhdGVnb3J5LCBzZXJ2ZXJEeW5hbWljQmluZCwgc2hvd1JlbW92ZUJ1dHRvbiwgc2hvd0luRWRpdG9yVG9vbGJhciwgZW5hYmxlQ2hpbGRDb250cm9scyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuU2V0VGhlbWVWbyh0aGVtZVZvKTtcbiAgICAgIHZhciBlZGl0b3JDb25maWdVcmwgPSBCYXNlVXRpbGl0eS5BcHBlbmRUaW1lU3RhbXBVcmwoY2tlZGl0b3JDb25maWdGdWxsUGF0aCk7XG4gICAgICBDS0VESVRPUi5yZXBsYWNlKHRleHRBcmVhRWxlbUlkLCB7XG4gICAgICAgIGN1c3RvbUNvbmZpZzogZWRpdG9yQ29uZmlnVXJsLFxuICAgICAgICBleHRyYVBsdWdpbnM6IGV4dHJhUGx1Z2lucy5qb2luKFwiLFwiKVxuICAgICAgfSk7XG4gICAgICBDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24ub24oXCJiZWZvcmVQYXN0ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHt9KTtcbiAgICAgIENLRURJVE9SLmluc3RhbmNlcy5odG1sX2Rlc2lnbi5vbihcInBhc3RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgc291cmNlSFRNTCA9IGV2ZW50LmRhdGEuZGF0YVZhbHVlO1xuICAgICAgICBjb25zb2xlLmxvZyhzb3VyY2VIVE1MKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciAkc291cmNlSFRNTCA9ICQoc291cmNlSFRNTCk7XG4gICAgICAgICAgJHNvdXJjZUhUTUwuZmluZChcIi5wbHVnaW5Jbm5lclBhbmVsV3JhcFwiKS5yZW1vdmUoKTtcblxuICAgICAgICAgIGlmICgkc291cmNlSFRNTC5maW5kKFwiZGl2XCIpLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICB2YXIgJGlubmVyRWxlbSA9ICQoJHNvdXJjZUhUTUwuZmluZChcImRpdlwiKS5lcSgwKSk7XG4gICAgICAgICAgICB2YXIgaWQgPSBDS0VkaXRvclV0aWxpdHkuVHJ5R2V0SWRGcm9tTGFzdFNlbGVjdGVkVGVtcEhUTUwoJGlubmVyRWxlbSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpZCk7XG5cbiAgICAgICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgICB2YXIgb2xkRWxlbSA9IENLRWRpdG9yVXRpbGl0eS5HZXRDS0VkaXRvckluc3QoKS5kb2N1bWVudC5nZXRCeUlkKGlkKTtcblxuICAgICAgICAgICAgICBpZiAob2xkRWxlbSkge1xuICAgICAgICAgICAgICAgIGlkID0gXCJjdF9jb3B5X1wiICsgU3RyaW5nVXRpbGl0eS5UaW1lc3RhbXAoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWQgPSBcImN0X2NvcHlfXCIgKyBTdHJpbmdVdGlsaXR5LlRpbWVzdGFtcCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudC5kYXRhLmRhdGFWYWx1ZSA9ICRpbm5lckVsZW0uYXR0cihcImlkXCIsIGlkKS5vdXRlckhUTUwoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIum7j+i0tOW8guW4uCzov5jljp9IVE1MXCIpO1xuICAgICAgICAgIGV2ZW50LmRhdGEuZGF0YVZhbHVlID0gc291cmNlSFRNTDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24ub24oXCJhZnRlclBhc3RlXCIsIGZ1bmN0aW9uIChldmVudCkge30pO1xuICAgICAgQ0tFRElUT1IuaW5zdGFuY2VzLmh0bWxfZGVzaWduLm9uKCdpbnNlcnRFbGVtZW50JywgZnVuY3Rpb24gKGV2ZW50KSB7fSk7XG4gICAgICBDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24ub24oJ2luc2VydEh0bWwnLCBmdW5jdGlvbiAoZXZlbnQpIHt9KTtcbiAgICAgIENLRURJVE9SLmluc3RhbmNlcy5odG1sX2Rlc2lnbi5vbignc2VsZWN0aW9uQ2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBlbGVtID0gZXZlbnQuZGF0YS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRFbGVtZW50KCk7XG4gICAgICAgIHZhciBsYXN0Q3VzdFNpbmdsZU5hbWUgPSBcIlwiO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnQuZGF0YS5wYXRoLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGVsZW0gPSBldmVudC5kYXRhLnBhdGguZWxlbWVudHNbaV07XG4gICAgICAgICAgdmFyIHNpbmdsZU5hbWUgPSBlbGVtLmdldEF0dHJpYnV0ZShcInNpbmdsZW5hbWVcIik7XG4gICAgICAgICAgdmFyIGVsZW1Jbm5lckhUTUwgPSBlbGVtLmdldEh0bWwoKTtcblxuICAgICAgICAgIGlmIChzaW5nbGVOYW1lKSB7XG4gICAgICAgICAgICBsYXN0Q3VzdFNpbmdsZU5hbWUgPSBzaW5nbGVOYW1lO1xuICAgICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LlNldFNlbGVjdGVkRWxlbShlbGVtLmdldE91dGVySHRtbCgpKTtcbiAgICAgICAgICAgIENLRWRpdG9yVXRpbGl0eS5TZXRMYXN0U2VsZWN0ZWRUZW1wSFRNTChlbGVtLmdldE91dGVySHRtbCgpKTtcbiAgICAgICAgICAgIHZhciBpbm5lckh0bWwgPSBlbGVtLmdldEh0bWwoKTtcbiAgICAgICAgICAgIGlubmVySHRtbCA9IGlubmVySHRtbC5yZXBsYWNlKC88YnIgXFwvPi9nLCBcIlwiKS5yZXBsYWNlKC88YnI+L2csIFwiXCIpO1xuXG4gICAgICAgICAgICBpZiAoaW5uZXJIdG1sLmluZGV4T2YoXCI8XCIpIDwgMCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlbGVtKTtcbiAgICAgICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LkdldENLRWRpdG9ySW5zdCgpLmdldFNlbGVjdGlvbigpLnNlbGVjdEVsZW1lbnQoZWxlbSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsYXN0Q3VzdFNpbmdsZU5hbWUgIT0gXCJXRkRDVF9UZW1wbGF0ZVwiKSB7XG4gICAgICAgICAgICAgIENLRWRpdG9yVXRpbGl0eS5DcmVhdGVQbHVnaW5Jbm5lclBhbmVsKGVsZW0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZWxlbS5nZXROYW1lKCkgPT0gXCJ0ZFwiICYmIGVsZW1Jbm5lckhUTUwgPT0gXCImbmJzcDtcIikge1xuICAgICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LkdldENLRWRpdG9ySW5zdCgpLmdldFNlbGVjdGlvbigpLnNlbGVjdEVsZW1lbnQoZWxlbS5nZXRDaGlsZCgwKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGFzdEN1c3RTaW5nbGVOYW1lKSB7XG4gICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LkRpc3BsYXlQbHVnaW5Db250cm9scyhDS0VkaXRvclBsdWdpblV0aWxpdHkuR2V0RW5hYmxlQ2hpbGRDb250cm9scyhsYXN0Q3VzdFNpbmdsZU5hbWUpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLlNldENLRWRpdG9ySW5zdChDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24pO1xuICAgICAgQ0tFRElUT1Iub24oJ2luc3RhbmNlUmVhZHknLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodHlwZW9mIGxvYWRDb21wbGV0ZWRGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGxvYWRDb21wbGV0ZWRGdW5jKCk7XG4gICAgICAgICAgO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiRGlzcGxheVBsdWdpbkNvbnRyb2xzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIERpc3BsYXlQbHVnaW5Db250cm9scyhlbmFibGVDaGlsZENvbnRyb2xzKSB7XG4gICAgICAkKFwiLmNrZV9idXR0b25cIikuc2hvdygpO1xuXG4gICAgICBpZiAoZW5hYmxlQ2hpbGRDb250cm9scyA9PSBcIipcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBwbHVnaW5zID0gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LkdldFBsdWdpbnMoKTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHBsdWdpbnMpIHtcbiAgICAgICAgdmFyIHBsdWdpbiA9IHBsdWdpbnNba2V5XTtcbiAgICAgICAgdmFyIHNpbmdsZU5hbWUgPSBwbHVnaW4uU2V0dGluZy5TaW5nbGVOYW1lO1xuICAgICAgICAkKFwiLmNrZV9idXR0b25fX1wiICsgU3RyaW5nVXRpbGl0eS5Ub0xvd2VyQ2FzZShzaW5nbGVOYW1lKSkuaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZW5hYmxlUGx1Z2lucyA9IGVuYWJsZUNoaWxkQ29udHJvbHMuc3BsaXQoXCI7XCIpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVuYWJsZVBsdWdpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHNpbmdsZU5hbWUgPSBlbmFibGVQbHVnaW5zW2ldO1xuICAgICAgICAkKFwiLmNrZV9idXR0b25fX1wiICsgU3RyaW5nVXRpbGl0eS5Ub0xvd2VyQ2FzZShzaW5nbGVOYW1lKSkuc2hvdygpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRUaGVtZVZvXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldFRoZW1lVm8oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fVGhlbWVWbztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0VGhlbWVWb1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRUaGVtZVZvKF90aGVtZVZvKSB7XG4gICAgICB0aGlzLl9UaGVtZVZvID0gX3RoZW1lVm87XG4gICAgICB0aGlzLlJlc2V0Um9vdEVsZW1UaGVtZShfdGhlbWVWbyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlJlc2V0Um9vdEVsZW1UaGVtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBSZXNldFJvb3RFbGVtVGhlbWUoX3RoZW1lVm8pIHtcbiAgICAgIGlmICh0aGlzLkdldENLRWRpdG9ySW5zdCgpKSB7XG4gICAgICAgIHZhciBzb3VyY2VIVE1MID0gdGhpcy5HZXRDS0VkaXRvckhUTUwoKTtcblxuICAgICAgICBpZiAoc291cmNlSFRNTCAhPSBudWxsICYmIHNvdXJjZUhUTUwgIT0gXCJcIikge1xuICAgICAgICAgIHZhciByb290RWxlbSA9ICQoc291cmNlSFRNTCk7XG5cbiAgICAgICAgICBpZiAocm9vdEVsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIGNsYXNzTGlzdCA9IHJvb3RFbGVtLmF0dHIoJ2NsYXNzJykuc3BsaXQoL1xccysvKTtcbiAgICAgICAgICAgIHZhciBjbGFzc2FyeSA9IFtdO1xuICAgICAgICAgICAgJC5lYWNoKGNsYXNzTGlzdCwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XG4gICAgICAgICAgICAgIGlmIChpdGVtLmluZGV4T2YoJ2h0bWwtZGVzaWduLXRoZW1lLScpID49IDApIHtcbiAgICAgICAgICAgICAgICByb290RWxlbS5yZW1vdmVDbGFzcyhpdGVtKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByb290RWxlbS5hZGRDbGFzcyhfdGhlbWVWby5yb290RWxlbUNsYXNzKTtcbiAgICAgICAgICAgIHRoaXMuU2V0Q0tFZGl0b3JIVE1MKHJvb3RFbGVtLm91dGVySFRNTCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiQ2xlYXJBTExGb3JEaXZFbGVtQnV0dG9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIENsZWFyQUxMRm9yRGl2RWxlbUJ1dHRvbigpIHtcbiAgICAgIHZhciBvbGREZWxCdXR0b25zID0gQ0tFZGl0b3JVdGlsaXR5LkdldENLRWRpdG9ySW5zdCgpLmRvY3VtZW50LmZpbmQoXCIuZGVsLWJ1dHRvblwiKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvbGREZWxCdXR0b25zLmNvdW50KCk7IGkrKykge1xuICAgICAgICBvbGREZWxCdXR0b25zLmdldEl0ZW0oaSkucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkNyZWF0ZVBsdWdpbklubmVyUGFuZWxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gQ3JlYXRlUGx1Z2luSW5uZXJQYW5lbChlbGVtKSB7XG4gICAgICBDS0VkaXRvclV0aWxpdHkuQ2xlYXJBTExQbHVnaW5Jbm5lclBhbmVsKCk7XG4gICAgICB2YXIgcGx1Z2luSW5uZXJQYW5lbCA9IG5ldyBDS0VESVRPUi5kb20uZWxlbWVudCgnZGl2Jyk7XG4gICAgICBwbHVnaW5Jbm5lclBhbmVsLmFkZENsYXNzKFwicGx1Z2luSW5uZXJQYW5lbFdyYXBcIik7XG4gICAgICBlbGVtLmFwcGVuZChwbHVnaW5Jbm5lclBhbmVsKTtcbiAgICAgIHZhciBzZWxlY3RBbGxCdXR0b24gPSBuZXcgQ0tFRElUT1IuZG9tLmVsZW1lbnQoJ2RpdicpO1xuICAgICAgc2VsZWN0QWxsQnV0dG9uLmFkZENsYXNzKFwiYnV0dG9uXCIpO1xuICAgICAgc2VsZWN0QWxsQnV0dG9uLmFkZENsYXNzKFwic2VsZWN0LWltZ1wiKTtcbiAgICAgIHNlbGVjdEFsbEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJ+mAieS4rScpO1xuICAgICAgcGx1Z2luSW5uZXJQYW5lbC5hcHBlbmQoc2VsZWN0QWxsQnV0dG9uKTtcbiAgICAgIHNlbGVjdEFsbEJ1dHRvbi5vbignY2xpY2snLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgYWxlcnQoXCLmmoLkuI3mlK/mjIEhXCIpO1xuICAgICAgICB2YXIgZG9tRXZlbnQgPSBldi5kYXRhO1xuICAgICAgICBkb21FdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkb21FdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH0pO1xuICAgICAgdmFyIGRlbEJ1dHRvbiA9IG5ldyBDS0VESVRPUi5kb20uZWxlbWVudCgnZGl2Jyk7XG4gICAgICBkZWxCdXR0b24uYWRkQ2xhc3MoXCJidXR0b25cIik7XG4gICAgICBkZWxCdXR0b24uYWRkQ2xhc3MoXCJkZWwtaW1nXCIpO1xuICAgICAgZGVsQnV0dG9uLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAn5Yig6ZmkJyk7XG4gICAgICBwbHVnaW5Jbm5lclBhbmVsLmFwcGVuZChkZWxCdXR0b24pO1xuICAgICAgZGVsQnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldikge1xuICAgICAgICBlbGVtLnJlbW92ZSgpO1xuICAgICAgICB2YXIgZG9tRXZlbnQgPSBldi5kYXRhO1xuICAgICAgICBkb21FdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkb21FdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH0pO1xuICAgICAgdmFyIGNvcHlJZEJ1dHRvbiA9IG5ldyBDS0VESVRPUi5kb20uZWxlbWVudCgnZGl2Jyk7XG4gICAgICBjb3B5SWRCdXR0b24uYWRkQ2xhc3MoXCJidXR0b25cIik7XG4gICAgICBjb3B5SWRCdXR0b24uYWRkQ2xhc3MoXCJjb3B5LWlkLWltZ1wiKTtcbiAgICAgIGNvcHlJZEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJ+WkjeWItklEJyk7XG4gICAgICBwbHVnaW5Jbm5lclBhbmVsLmFwcGVuZChjb3B5SWRCdXR0b24pO1xuICAgICAgY29weUlkQnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldikge1xuICAgICAgICB2YXIgaWQgPSBlbGVtLmdldEF0dHJpYnV0ZShcImlkXCIpO1xuICAgICAgICBCYXNlVXRpbGl0eS5Db3B5VmFsdWVDbGlwYm9hcmQoaWQpO1xuICAgICAgICB2YXIgZG9tRXZlbnQgPSBldi5kYXRhO1xuICAgICAgICBkb21FdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkb21FdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJDbGVhckFMTFBsdWdpbklubmVyUGFuZWxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gQ2xlYXJBTExQbHVnaW5Jbm5lclBhbmVsKCkge1xuICAgICAgdmFyIG9sZERlbEJ1dHRvbnMgPSBDS0VkaXRvclV0aWxpdHkuR2V0Q0tFZGl0b3JJbnN0KCkuZG9jdW1lbnQuZmluZChcIi5wbHVnaW5Jbm5lclBhbmVsV3JhcFwiKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvbGREZWxCdXR0b25zLmNvdW50KCk7IGkrKykge1xuICAgICAgICBvbGREZWxCdXR0b25zLmdldEl0ZW0oaSkucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNpbmdsZUVsZW1CaW5kRGVmYXVsdEV2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNpbmdsZUVsZW1CaW5kRGVmYXVsdEV2ZW50KGVsZW0pIHtcbiAgICAgIHZhciBzaW5nbGVOYW1lID0gZWxlbS5nZXRBdHRyaWJ1dGUoXCJzaW5nbGVuYW1lXCIpO1xuICAgICAgdmFyIGlubmVySHRtbCA9IGVsZW0uZ2V0SHRtbCgpO1xuICAgICAgaW5uZXJIdG1sID0gaW5uZXJIdG1sLnJlcGxhY2UoLzxiciBcXC8+L2csIFwiXCIpO1xuXG4gICAgICBpZiAoaW5uZXJIdG1sLmluZGV4T2YoXCI8XCIpIDwgMCkge1xuICAgICAgICBpZiAoc2luZ2xlTmFtZSkge1xuICAgICAgICAgIGVsZW0ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcbiAgICAgICAgICAgIENLRWRpdG9yVXRpbGl0eS5HZXRDS0VkaXRvckluc3QoKS5nZXRTZWxlY3Rpb24oKS5zZWxlY3RFbGVtZW50KHRoaXMpO1xuICAgICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LlNldFNlbGVjdGVkRWxlbSh0aGlzLmdldE91dGVySHRtbCgpKTtcbiAgICAgICAgICAgIHZhciBkb21FdmVudCA9IGV2LmRhdGE7XG4gICAgICAgICAgICBkb21FdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZG9tRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiQUxMRWxlbUJpbmREZWZhdWx0RXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gQUxMRWxlbUJpbmREZWZhdWx0RXZlbnQoKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIuWPlua2iOS9v+eUqOeCueWHu+i/m+ihjOWFg+e0oOmAieaLqeWSjOWIoOmZpOeahOWKn+iDvSzov4Hnp7vkuLpzZWxlY3Rpb25DaGFuZ2Xkuovku7bov5vooYwhXCIpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDS0VkaXRvclV0aWxpdHk7XG59KCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclV0aWxpdHksIFwiXyRDS0VkaXRvclNlbGVjdEVsZW1cIiwgbnVsbCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclV0aWxpdHksIFwiX0xhc3RTZWxlY3RlZFRlbXBIVE1MXCIsIG51bGwpO1xuXG5fZGVmaW5lUHJvcGVydHkoQ0tFZGl0b3JVdGlsaXR5LCBcIl9DS0VkaXRvckluc3RcIiwgbnVsbCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclV0aWxpdHksIFwiX1RoZW1lVm9cIiwgbnVsbCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIEhUTUxFZGl0b3JVdGlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBIVE1MRWRpdG9yVXRpbGl0eSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgSFRNTEVkaXRvclV0aWxpdHkpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEhUTUxFZGl0b3JVdGlsaXR5LCBudWxsLCBbe1xuICAgIGtleTogXCJHZXRIVE1MRWRpdG9ySW5zdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRIVE1MRWRpdG9ySW5zdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9IVE1MRWRpdG9ySW5zdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0SFRNTEVkaXRvckhUTUxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2V0SFRNTEVkaXRvckhUTUwoaHRtbCkge1xuICAgICAgaWYgKCFTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkoaHRtbCkpIHtcbiAgICAgICAgdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLnNldFZhbHVlKGh0bWwpO1xuICAgICAgICBDb2RlTWlycm9yLmNvbW1hbmRzW1wic2VsZWN0QWxsXCJdKHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKSk7XG4gICAgICAgIHZhciByYW5nZSA9IHtcbiAgICAgICAgICBmcm9tOiB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuZ2V0Q3Vyc29yKHRydWUpLFxuICAgICAgICAgIHRvOiB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuZ2V0Q3Vyc29yKGZhbHNlKVxuICAgICAgICB9O1xuICAgICAgICA7XG4gICAgICAgIHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5hdXRvRm9ybWF0UmFuZ2UocmFuZ2UuZnJvbSwgcmFuZ2UudG8pO1xuICAgICAgICB2YXIgYTEgPSB7XG4gICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICBjaDogMlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuZ2V0RG9jKCkuZWFjaExpbmUoZnVuY3Rpb24gKGxpbmUpIHt9KTtcbiAgICAgICAgdmFyIHNlbGVjdGVkRWxlbSA9IENLRWRpdG9yVXRpbGl0eS5HZXRTZWxlY3RlZEVsZW0oKTtcbiAgICAgICAgdmFyIHNlYXJjaEhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZEVsZW0pIHtcbiAgICAgICAgICBzZWFyY2hIVE1MID0gc2VsZWN0ZWRFbGVtLm91dGVySFRNTCgpLnNwbGl0KFwiPlwiKVswXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjdXJzb3IgPSB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuZ2V0U2VhcmNoQ3Vyc29yKHNlYXJjaEhUTUwpO1xuICAgICAgICBjdXJzb3IuZmluZE5leHQoKTtcblxuICAgICAgICBpZiAoY3Vyc29yLmZyb20oKSAmJiBjdXJzb3IudG8oKSkge1xuICAgICAgICAgIHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5nZXREb2MoKS5zZXRTZWxlY3Rpb24oY3Vyc29yLmZyb20oKSwgY3Vyc29yLnRvKCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldEh0bWxFZGl0b3JIVE1MXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldEh0bWxFZGl0b3JIVE1MKCkge1xuICAgICAgcmV0dXJuIHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5nZXRWYWx1ZSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJJbml0aWFsaXplSFRNTENvZGVEZXNpZ25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gSW5pdGlhbGl6ZUhUTUxDb2RlRGVzaWduKCkge1xuICAgICAgdmFyIG1peGVkTW9kZSA9IHtcbiAgICAgICAgbmFtZTogXCJodG1sbWl4ZWRcIixcbiAgICAgICAgc2NyaXB0VHlwZXM6IFt7XG4gICAgICAgICAgbWF0Y2hlczogL1xcL3gtaGFuZGxlYmFycy10ZW1wbGF0ZXxcXC94LW11c3RhY2hlL2ksXG4gICAgICAgICAgbW9kZTogbnVsbFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbWF0Y2hlczogLyh0ZXh0fGFwcGxpY2F0aW9uKVxcLyh4LSk/dmIoYXxzY3JpcHQpL2ksXG4gICAgICAgICAgbW9kZTogXCJ2YnNjcmlwdFwiXG4gICAgICAgIH1dXG4gICAgICB9O1xuICAgICAgdGhpcy5fSFRNTEVkaXRvckluc3QgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlRleHRBcmVhSFRNTEVkaXRvclwiKSwge1xuICAgICAgICBtb2RlOiBtaXhlZE1vZGUsXG4gICAgICAgIHNlbGVjdGlvblBvaW50ZXI6IHRydWUsXG4gICAgICAgIHRoZW1lOiBcIm1vbm9rYWlcIixcbiAgICAgICAgZm9sZEd1dHRlcjogdHJ1ZSxcbiAgICAgICAgZ3V0dGVyczogW1wiQ29kZU1pcnJvci1saW5lbnVtYmVyc1wiLCBcIkNvZGVNaXJyb3ItZm9sZGd1dHRlclwiXSxcbiAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX0hUTUxFZGl0b3JJbnN0LnNldFNpemUoXCIxMDAlXCIsIFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIC0gODUpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBIVE1MRWRpdG9yVXRpbGl0eTtcbn0oKTtcblxuX2RlZmluZVByb3BlcnR5KEhUTUxFZGl0b3JVdGlsaXR5LCBcIl9IVE1MRWRpdG9ySW5zdFwiLCBudWxsKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgSnNFZGl0b3JVdGlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBKc0VkaXRvclV0aWxpdHkoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEpzRWRpdG9yVXRpbGl0eSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoSnNFZGl0b3JVdGlsaXR5LCBudWxsLCBbe1xuICAgIGtleTogXCJfR2V0TmV3Rm9ybUpzU3RyaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9HZXROZXdGb3JtSnNTdHJpbmcoKSB7XG4gICAgICByZXR1cm4gXCI8c2NyaXB0PnZhciBGb3JtUGFnZU9iamVjdEluc3RhbmNlPXtcIiArIFwiZGF0YTp7XCIgKyBcInVzZXJFbnRpdHk6e30sXCIgKyBcIm9yZ2FuRW50aXR5Ont9LFwiICsgXCJmb3JtUE86W10sXCIgKyBcImZvcm1SZWNvcmRDb21wbGV4UE86W10sXCIgKyBcIndlYkZvcm1SVFBhcmFzOnt9LFwiICsgXCJjb25maWc6W11cIiArIFwifSxcIiArIFwicGFnZVJlYWR5OmZ1bmN0aW9uKCl7fSxcIiArIFwiYmluZFJlY29yZERhdGFSZWFkeTpmdW5jdGlvbigpe30sXCIgKyBcInZhbGlkYXRlRXZlcnlGcm9tQ29udHJvbDpmdW5jdGlvbih2YWxpZGF0ZVJlc3VsdCl7cmV0dXJuIHZhbGlkYXRlUmVzdWx0O31cIiArIFwifTwvc2NyaXB0PlwiO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRKc0VkaXRvckluc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0SnNFZGl0b3JJbnN0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX0pzRWRpdG9ySW5zdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0SnNFZGl0b3JKc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRKc0VkaXRvckpzKGpzKSB7XG4gICAgICB0aGlzLkdldEpzRWRpdG9ySW5zdCgpLnNldFZhbHVlKGpzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0SnNFZGl0b3JKc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRKc0VkaXRvckpzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkuZ2V0VmFsdWUoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiSW5pdGlhbGl6ZUpzQ29kZURlc2lnblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBJbml0aWFsaXplSnNDb2RlRGVzaWduKHN0YXR1cykge1xuICAgICAgdGhpcy5fSnNFZGl0b3JJbnN0ID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoJChcIiNUZXh0QXJlYUpzRWRpdG9yXCIpWzBdLCB7XG4gICAgICAgIG1vZGU6IFwiYXBwbGljYXRpb24vbGQranNvblwiLFxuICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxuICAgICAgICBleHRyYUtleXM6IHtcbiAgICAgICAgICBcIkN0cmwtUVwiOiBmdW5jdGlvbiBDdHJsUShjbSkge1xuICAgICAgICAgICAgY20uZm9sZENvZGUoY20uZ2V0Q3Vyc29yKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZm9sZEd1dHRlcjogdHJ1ZSxcbiAgICAgICAgc21hcnRJbmRlbnQ6IHRydWUsXG4gICAgICAgIG1hdGNoQnJhY2tldHM6IHRydWUsXG4gICAgICAgIHRoZW1lOiBcIm1vbm9rYWlcIixcbiAgICAgICAgZ3V0dGVyczogW1wiQ29kZU1pcnJvci1saW5lbnVtYmVyc1wiLCBcIkNvZGVNaXJyb3ItZm9sZGd1dHRlclwiXVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX0pzRWRpdG9ySW5zdC5zZXRTaXplKFwiMTAwJVwiLCBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSAtIDg1KTtcblxuICAgICAgaWYgKHN0YXR1cyA9PSBcImFkZFwiKSB7XG4gICAgICAgIHRoaXMuU2V0SnNFZGl0b3JKcyh0aGlzLl9HZXROZXdGb3JtSnNTdHJpbmcoKSk7XG4gICAgICAgIENvZGVNaXJyb3IuY29tbWFuZHNbXCJzZWxlY3RBbGxcIl0odGhpcy5HZXRKc0VkaXRvckluc3QoKSk7XG4gICAgICAgIHZhciByYW5nZSA9IHtcbiAgICAgICAgICBmcm9tOiB0aGlzLkdldEpzRWRpdG9ySW5zdCgpLmdldEN1cnNvcih0cnVlKSxcbiAgICAgICAgICB0bzogdGhpcy5HZXRKc0VkaXRvckluc3QoKS5nZXRDdXJzb3IoZmFsc2UpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkuYXV0b0Zvcm1hdFJhbmdlKHJhbmdlLmZyb20sIHJhbmdlLnRvKTtcbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gSnNFZGl0b3JVdGlsaXR5O1xufSgpO1xuXG5fZGVmaW5lUHJvcGVydHkoSnNFZGl0b3JVdGlsaXR5LCBcIl9Kc0VkaXRvckluc3RcIiwgbnVsbCk7Il19
