"use strict";

var EditTable_FieldName = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var bindname = template.BindName;

    if (template.DefaultValue != undefined && template.DefaultValue != null) {
      var val = EditTableDefauleValue.GetValue(template);
    }

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.html();
    }

    var $elem = $("<input type='text' style='width: 98%' />");
    $elem.val(val);
    $elem.attr("BindName", template.BindName);
    $elem.attr("Val", val);
    $elem.attr("IsSerialize", "true");
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val().toUpperCase();
    var $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' Value='" + val + "'>" + val + "</label>");
    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    var result = EditTableValidate.Validate(val, template);

    if (result.Success) {
      hostTable.find("[renderer=EditTable_FieldName]").each(function () {
        var seritem = $(this);
        seritem.find("label").each(function () {
          var labelitem = $(this);

          if (labelitem.text() == val || labelitem.text() == val.toUpperCase()) {
            result = {
              Success: false,
              Msg: "[字段名称]不能重复!"
            };
            return;
          }
        });
      });
    }

    return result;
  }
};
"use strict";

var EditTable_SelectDefaultValue = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var fieldDefaultType = "";
    var fieldDefaultValue = "";
    var fieldDefaultText = "";

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      fieldDefaultType = jsonDataSingle["fieldDefaultType"] ? jsonDataSingle["fieldDefaultType"] : "";
      fieldDefaultValue = jsonDataSingle["fieldDefaultValue"] ? jsonDataSingle["fieldDefaultValue"] : "";
      fieldDefaultText = jsonDataSingle["fieldDefaultText"] ? jsonDataSingle["fieldDefaultText"] : "";
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      viewStausHtmlElem.find("label").each(function () {
        if ($(this).attr("BindName") == "fieldDefaultType") {
          fieldDefaultType = $(this).attr("Value");
        } else if ($(this).attr("BindName") == "fieldDefaultText") {
          fieldDefaultText = $(this).attr("Value");
        } else if ($(this).attr("BindName") == "fieldDefaultValue") {
          fieldDefaultValue = $(this).attr("Value");
        }
      });
    }

    var $elem = $("<div></div>");
    var $inputTxt = $("<input type='text' style='width: 90%' readonly />");
    $inputTxt.attr("fieldDefaultType", fieldDefaultType);
    $inputTxt.attr("fieldDefaultValue", fieldDefaultValue);
    $inputTxt.attr("fieldDefaultText", fieldDefaultText);
    $inputTxt.val(DefaultValueUtility.formatText(fieldDefaultType, fieldDefaultText));
    var $inputBtn = $("<input class='normalbutton-v1' style='margin-left: 4px;' type='button' value='...'/>");
    $elem.append($inputTxt).append($inputBtn);
    window.$Temp$Inputtxt = $inputTxt;
    $inputBtn.click(function () {
      if (window.tableDesion) {
        tableDesion.selectDefaultValueDialogBegin(EditTable_SelectDefaultValue, null);
      } else {
        window.parent.listDesign.selectDefaultValueDialogBegin(window, null);
        window._SelectBindObj = {
          setSelectEnvVariableResultValue: function setSelectEnvVariableResultValue(result) {
            EditTable_SelectDefaultValue.setSelectEnvVariableResultValue(result);
          }
        };
      }
    });
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var $inputTxt = editStausHtmlElem.find("input[type='text']");

    if ($inputTxt.length > 0) {
      var defaultType = $inputTxt.attr("fieldDefaultType");
      var defaultValue = $inputTxt.attr("fieldDefaultValue");
      var defaultText = $inputTxt.attr("fieldDefaultText");
      var $elem = $("<div></div>");
      $elem.append("<label>" + DefaultValueUtility.formatText(defaultType, defaultText) + "</label>");
      $elem.append("<label IsSerialize='true' BindName='fieldDefaultType' Value='" + defaultType + "' style='display:none'/>");
      $elem.append("<label IsSerialize='true' BindName='fieldDefaultText' Value='" + defaultText + "' style='display:none'/>");
      $elem.append("<label IsSerialize='true' BindName='fieldDefaultValue' Value='" + defaultValue + "' style='display:none'/>");
      return $elem;
    }

    return $("<label></label>");
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  },
  setSelectEnvVariableResultValue: function setSelectEnvVariableResultValue(defaultData) {
    var $inputTxt = window.$Temp$Inputtxt;

    if (null != defaultData) {
      $inputTxt.attr("fieldDefaultType", defaultData.Type);
      $inputTxt.attr("fieldDefaultValue", defaultData.Value);
      $inputTxt.attr("fieldDefaultText", defaultData.Text);
      $inputTxt.val(DefaultValueUtility.formatText(defaultData.Type, defaultData.Text));
    } else {
      $inputTxt.attr("fieldDefaultType", "");
      $inputTxt.attr("fieldDefaultValue", "");
      $inputTxt.attr("fieldDefaultText", "");
      $inputTxt.val("");
    }
  }
};
"use strict";

var EditTable_SelectFieldTypeDataLoader = {
  _fieldDataTypeArray: null,
  GetFieldDataTypeArray: function GetFieldDataTypeArray() {
    if (this._fieldDataTypeArray == null) {
      var _self = this;

      AjaxUtility.PostSync("/Rest/Builder/DataStorage/DataBase/Table/GetTableFieldType", {}, function (data) {
        if (data.success == true) {
          var list = JsonUtility.StringToJson(data.data);

          if (list != null && list != undefined) {
            _self._fieldDataTypeArray = list;
          }
        } else {
          DialogUtility.Alert(window, "AlertLoadingQueryError", {}, "加载字段类型失败！", null);
        }
      }, this);
    }

    return this._fieldDataTypeArray;
  },
  GetFieldDataTypeObjectByValue: function GetFieldDataTypeObjectByValue(Value) {
    var arrayData = this.GetFieldDataTypeArray();

    for (var i = 0; i < arrayData.length; i++) {
      var obj = arrayData[i];

      if (obj.Value == Value) {
        return obj;
      }
    }

    alert("找不到指定的数据类型，请确认是否支持该类型！");
  },
  GetFieldDataTypeObjectByText: function GetFieldDataTypeObjectByText(text) {
    var arrayData = this.GetFieldDataTypeArray();

    for (var i = 0; i < arrayData.length; i++) {
      var obj = arrayData[i];

      if (obj.Text == text) {
        return obj;
      }
    }

    alert("找不到指定的数据类型，请确认是否支持该类型！");
  }
};
var EditTable_SelectFieldType = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var $elem = $("<select />");

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle["fieldDataType"];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.attr("Value");
    }

    var _fieldDataTypeArray = EditTable_SelectFieldTypeDataLoader.GetFieldDataTypeArray();

    for (var i = 0; i < _fieldDataTypeArray.length; i++) {
      var value = _fieldDataTypeArray[i].Value;
      var text = _fieldDataTypeArray[i].Text;
      $elem.append("<option value='" + value + "'>" + text + "</option>");
    }

    if (val != "") {
      $elem.val(val);
    } else {
      $elem.val(EditTable_SelectFieldTypeDataLoader.GetFieldDataTypeObjectByText("字符串").Value);
    }

    $elem.change(function () {
      var val = $(this).val();

      if (val == "整数") {
        $(hostCell).next().find("input").attr("disabled", true);
        $(hostCell).next().find("input").val(0);
        $(hostCell).next().next().find("input").attr("disabled", true);
        $(hostCell).next().next().find("input").val(0);
      } else if (val == "小数") {
        $(hostCell).next().find("input").attr("disabled", false);
        $(hostCell).next().find("input").val(10);
        $(hostCell).next().next().find("input").attr("disabled", false);
        $(hostCell).next().next().find("input").val(2);
      } else if (val == "日期时间") {
        $(hostCell).next().find("input").attr("disabled", true);
        $(hostCell).next().find("input").val(20);
        $(hostCell).next().next().find("input").attr("disabled", true);
        $(hostCell).next().next().find("input").val(0);
      } else if (val == "字符串") {
        $(hostCell).next().find("input").attr("disabled", false);
        $(hostCell).next().find("input").val(50);
        $(hostCell).next().next().find("input").attr("disabled", true);
        $(hostCell).next().next().find("input").val(0);
      } else if (val == "长字符串") {
        $(hostCell).next().find("input").attr("disabled", true);
        $(hostCell).next().find("input").val(0);
        $(hostCell).next().next().find("input").attr("disabled", true);
        $(hostCell).next().next().find("input").val(0);
      }
    });
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var value = editStausHtmlElem.val();
    var text = EditTable_SelectFieldTypeDataLoader.GetFieldDataTypeObjectByValue(value).Text;
    var $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' Value='" + value + "'>" + text + "</label>");
    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var Column_SelectDefaultValue = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var defaultType = "";
    var defaultValue = "";
    var defaultText = "";

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      defaultType = jsonDataSingle["columnDefaultType"] ? jsonDataSingle["columnDefaultType"] : "";
      defaultValue = jsonDataSingle["columnDefaultValue"] ? jsonDataSingle["columnDefaultValue"] : "";
      defaultText = jsonDataSingle["columnDefaultText"] ? jsonDataSingle["columnDefaultText"] : "";
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      viewStausHtmlElem.find("label").each(function () {
        if ($(this).attr("BindName") == "columnDefaultType") {
          defaultType = $(this).attr("Value");
        } else if ($(this).attr("BindName") == "columnDefaultText") {
          defaultText = $(this).attr("Value");
        } else if ($(this).attr("BindName") == "columnDefaultValue") {
          defaultValue = $(this).attr("Value");
        }
      });
    }

    var $elem = $("<div></div>");
    var $inputTxt = $("<input type='text' style='width: 90%' readonly />");
    $inputTxt.attr("columnDefaultType", defaultType);
    $inputTxt.attr("columnDefaultValue", defaultValue);
    $inputTxt.attr("columnDefaultText", defaultText);
    $inputTxt.val(DefaultValueUtility.formatText(defaultType, defaultText));
    var $inputBtn = $("<input class='normalbutton-v1' style='margin-left: 4px;' type='button' value='...'/>");
    $elem.append($inputTxt).append($inputBtn);
    window.$Temp$Inputtxt = $inputTxt;
    $inputBtn.click(function () {
      JBuild4DSelectView.SelectEnvVariable.beginSelect("Column_SelectDefaultValue");
    });
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var $inputTxt = editStausHtmlElem.find("input[type='text']");

    if ($inputTxt.length > 0) {
      var defaultType = $inputTxt.attr("columnDefaultType");
      var defaultValue = $inputTxt.attr("columnDefaultValue");
      var defaultText = $inputTxt.attr("columnDefaultText");
      var $elem = $("<div></div>");
      $elem.append("<label>" + DefaultValueUtility.formatText(defaultType, defaultText) + "</label>");
      $elem.append("<label IsSerialize='true' BindName='columnDefaultType' Value='" + defaultType + "' style='display:none'/>");
      $elem.append("<label IsSerialize='true' BindName='columnDefaultText' Value='" + defaultText + "' style='display:none'/>");
      $elem.append("<label IsSerialize='true' BindName='columnDefaultValue' Value='" + defaultValue + "' style='display:none'/>");
      return $elem;
    }

    return $("<label></label>");
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  },
  setSelectEnvVariableResultValue: function setSelectEnvVariableResultValue(defaultData) {
    var $inputTxt = window.$Temp$Inputtxt;

    if (null != defaultData) {
      $inputTxt.attr("columnDefaultType", defaultData.Type);
      $inputTxt.attr("columnDefaultValue", defaultData.Value);
      $inputTxt.attr("columnDefaultText", defaultData.Text);
      $inputTxt.val(DefaultValueUtility.formatText(defaultData.Type, defaultData.Text));
    } else {
      $inputTxt.attr("columnDefaultType", "");
      $inputTxt.attr("columnDefaultValue", "");
      $inputTxt.attr("columnDefaultText", "");
      $inputTxt.val("");
    }
  }
};
"use strict";

var Column_SelectFieldTypeDataLoader = {
  _fieldDataTypeArray: null,
  GetFieldDataTypeArray: function GetFieldDataTypeArray() {
    if (this._fieldDataTypeArray == null) {
      var _self = this;

      AjaxUtility.PostSync("/Rest/Builder/DataStorage/DataBase/Table/GetTableFieldType", {}, function (data) {
        if (data.success == true) {
          var list = JsonUtility.StringToJson(data.data);

          if (list != null && list != undefined) {
            _self._fieldDataTypeArray = list;
          }
        } else {
          DialogUtility.Alert(window, "AlertLoadingQueryError", {}, "加载字段类型失败！", null);
        }
      }, this);
    }

    return this._fieldDataTypeArray;
  },
  GetFieldDataTypeObjectByValue: function GetFieldDataTypeObjectByValue(Value) {
    var arrayData = this.GetFieldDataTypeArray();

    for (var i = 0; i < arrayData.length; i++) {
      var obj = arrayData[i];

      if (obj.Value == Value) {
        return obj;
      }
    }

    alert("找不到指定的数据类型，请确认是否支持该类型！");
  },
  GetFieldDataTypeObjectByText: function GetFieldDataTypeObjectByText(text) {
    var arrayData = this.GetFieldDataTypeArray();

    for (var i = 0; i < arrayData.length; i++) {
      var obj = arrayData[i];

      if (obj.Text == text) {
        return obj;
      }
    }

    alert("找不到指定的数据类型，请确认是否支持该类型！");
  }
};
var Column_SelectFieldType = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var $elem = $("<select />");

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle["columnDataTypeName"];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.attr("Value");
    }

    var _fieldDataTypeArray = Column_SelectFieldTypeDataLoader.GetFieldDataTypeArray();

    for (var i = 0; i < _fieldDataTypeArray.length; i++) {
      var value = _fieldDataTypeArray[i].Value;
      var text = _fieldDataTypeArray[i].Text;
      $elem.append("<option value='" + value + "'>" + text + "</option>");
    }

    if (val != "") {
      $elem.val(val);
    } else {
      $elem.val(Column_SelectFieldTypeDataLoader.GetFieldDataTypeObjectByText("字符串").Value);
    }

    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var value = editStausHtmlElem.val();
    var text = Column_SelectFieldTypeDataLoader.GetFieldDataTypeObjectByValue(value).Text;
    var $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' Value='" + value + "'>" + text + "</label>");
    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlbmRlcmVycy9UYWJsZURlc2lnbi9FZGl0VGFibGVfRmllbGROYW1lLmpzIiwiUmVuZGVyZXJzL1RhYmxlRGVzaWduL0VkaXRUYWJsZV9TZWxlY3REZWZhdWx0VmFsdWUuanMiLCJSZW5kZXJlcnMvVGFibGVEZXNpZ24vRWRpdFRhYmxlX1NlbGVjdEZpZWxkVHlwZS5qcyIsIlJlbmRlcmVycy9EYXRhU2V0L0NvbHVtbl9TZWxlY3REZWZhdWx0VmFsdWUuanMiLCJSZW5kZXJlcnMvRGF0YVNldC9Db2x1bW5fU2VsZWN0RmllbGRUeXBlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IlVJRVhDb21wb25lbnRGb3JCdWlsZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfRmllbGROYW1lID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyIGJpbmRuYW1lID0gdGVtcGxhdGUuQmluZE5hbWU7XG5cbiAgICBpZiAodGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gbnVsbCkge1xuICAgICAgdmFyIHZhbCA9IEVkaXRUYWJsZURlZmF1bGVWYWx1ZS5HZXRWYWx1ZSh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtiaW5kbmFtZV07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5odG1sKCk7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gJChcIjxpbnB1dCB0eXBlPSd0ZXh0JyBzdHlsZT0nd2lkdGg6IDk4JScgLz5cIik7XG4gICAgJGVsZW0udmFsKHZhbCk7XG4gICAgJGVsZW0uYXR0cihcIkJpbmROYW1lXCIsIHRlbXBsYXRlLkJpbmROYW1lKTtcbiAgICAkZWxlbS5hdHRyKFwiVmFsXCIsIHZhbCk7XG4gICAgJGVsZW0uYXR0cihcIklzU2VyaWFsaXplXCIsIFwidHJ1ZVwiKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpLnRvVXBwZXJDYXNlKCk7XG4gICAgdmFyICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9J1wiICsgdmFsICsgXCInPlwiICsgdmFsICsgXCI8L2xhYmVsPlwiKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHZhciByZXN1bHQgPSBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcblxuICAgIGlmIChyZXN1bHQuU3VjY2Vzcykge1xuICAgICAgaG9zdFRhYmxlLmZpbmQoXCJbcmVuZGVyZXI9RWRpdFRhYmxlX0ZpZWxkTmFtZV1cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZXJpdGVtID0gJCh0aGlzKTtcbiAgICAgICAgc2VyaXRlbS5maW5kKFwibGFiZWxcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGxhYmVsaXRlbSA9ICQodGhpcyk7XG5cbiAgICAgICAgICBpZiAobGFiZWxpdGVtLnRleHQoKSA9PSB2YWwgfHwgbGFiZWxpdGVtLnRleHQoKSA9PSB2YWwudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICBTdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgTXNnOiBcIlvlrZfmrrXlkI3np7Bd5LiN6IO96YeN5aSNIVwiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX1NlbGVjdERlZmF1bHRWYWx1ZSA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciBmaWVsZERlZmF1bHRUeXBlID0gXCJcIjtcbiAgICB2YXIgZmllbGREZWZhdWx0VmFsdWUgPSBcIlwiO1xuICAgIHZhciBmaWVsZERlZmF1bHRUZXh0ID0gXCJcIjtcblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgZmllbGREZWZhdWx0VHlwZSA9IGpzb25EYXRhU2luZ2xlW1wiZmllbGREZWZhdWx0VHlwZVwiXSA/IGpzb25EYXRhU2luZ2xlW1wiZmllbGREZWZhdWx0VHlwZVwiXSA6IFwiXCI7XG4gICAgICBmaWVsZERlZmF1bHRWYWx1ZSA9IGpzb25EYXRhU2luZ2xlW1wiZmllbGREZWZhdWx0VmFsdWVcIl0gPyBqc29uRGF0YVNpbmdsZVtcImZpZWxkRGVmYXVsdFZhbHVlXCJdIDogXCJcIjtcbiAgICAgIGZpZWxkRGVmYXVsdFRleHQgPSBqc29uRGF0YVNpbmdsZVtcImZpZWxkRGVmYXVsdFRleHRcIl0gPyBqc29uRGF0YVNpbmdsZVtcImZpZWxkRGVmYXVsdFRleHRcIl0gOiBcIlwiO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmlld1N0YXVzSHRtbEVsZW0uZmluZChcImxhYmVsXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiQmluZE5hbWVcIikgPT0gXCJmaWVsZERlZmF1bHRUeXBlXCIpIHtcbiAgICAgICAgICBmaWVsZERlZmF1bHRUeXBlID0gJCh0aGlzKS5hdHRyKFwiVmFsdWVcIik7XG4gICAgICAgIH0gZWxzZSBpZiAoJCh0aGlzKS5hdHRyKFwiQmluZE5hbWVcIikgPT0gXCJmaWVsZERlZmF1bHRUZXh0XCIpIHtcbiAgICAgICAgICBmaWVsZERlZmF1bHRUZXh0ID0gJCh0aGlzKS5hdHRyKFwiVmFsdWVcIik7XG4gICAgICAgIH0gZWxzZSBpZiAoJCh0aGlzKS5hdHRyKFwiQmluZE5hbWVcIikgPT0gXCJmaWVsZERlZmF1bHRWYWx1ZVwiKSB7XG4gICAgICAgICAgZmllbGREZWZhdWx0VmFsdWUgPSAkKHRoaXMpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gJChcIjxkaXY+PC9kaXY+XCIpO1xuICAgIHZhciAkaW5wdXRUeHQgPSAkKFwiPGlucHV0IHR5cGU9J3RleHQnIHN0eWxlPSd3aWR0aDogOTAlJyByZWFkb25seSAvPlwiKTtcbiAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFR5cGVcIiwgZmllbGREZWZhdWx0VHlwZSk7XG4gICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRWYWx1ZVwiLCBmaWVsZERlZmF1bHRWYWx1ZSk7XG4gICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUZXh0XCIsIGZpZWxkRGVmYXVsdFRleHQpO1xuICAgICRpbnB1dFR4dC52YWwoRGVmYXVsdFZhbHVlVXRpbGl0eS5mb3JtYXRUZXh0KGZpZWxkRGVmYXVsdFR5cGUsIGZpZWxkRGVmYXVsdFRleHQpKTtcbiAgICB2YXIgJGlucHV0QnRuID0gJChcIjxpbnB1dCBjbGFzcz0nbm9ybWFsYnV0dG9uLXYxJyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDRweDsnIHR5cGU9J2J1dHRvbicgdmFsdWU9Jy4uLicvPlwiKTtcbiAgICAkZWxlbS5hcHBlbmQoJGlucHV0VHh0KS5hcHBlbmQoJGlucHV0QnRuKTtcbiAgICB3aW5kb3cuJFRlbXAkSW5wdXR0eHQgPSAkaW5wdXRUeHQ7XG4gICAgJGlucHV0QnRuLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh3aW5kb3cudGFibGVEZXNpb24pIHtcbiAgICAgICAgdGFibGVEZXNpb24uc2VsZWN0RGVmYXVsdFZhbHVlRGlhbG9nQmVnaW4oRWRpdFRhYmxlX1NlbGVjdERlZmF1bHRWYWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cucGFyZW50Lmxpc3REZXNpZ24uc2VsZWN0RGVmYXVsdFZhbHVlRGlhbG9nQmVnaW4od2luZG93LCBudWxsKTtcbiAgICAgICAgd2luZG93Ll9TZWxlY3RCaW5kT2JqID0ge1xuICAgICAgICAgIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWUocmVzdWx0KSB7XG4gICAgICAgICAgICBFZGl0VGFibGVfU2VsZWN0RGVmYXVsdFZhbHVlLnNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWUocmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciAkaW5wdXRUeHQgPSBlZGl0U3RhdXNIdG1sRWxlbS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpO1xuXG4gICAgaWYgKCRpbnB1dFR4dC5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgZGVmYXVsdFR5cGUgPSAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFR5cGVcIik7XG4gICAgICB2YXIgZGVmYXVsdFZhbHVlID0gJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRWYWx1ZVwiKTtcbiAgICAgIHZhciBkZWZhdWx0VGV4dCA9ICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VGV4dFwiKTtcbiAgICAgIHZhciAkZWxlbSA9ICQoXCI8ZGl2PjwvZGl2PlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbD5cIiArIERlZmF1bHRWYWx1ZVV0aWxpdHkuZm9ybWF0VGV4dChkZWZhdWx0VHlwZSwgZGVmYXVsdFRleHQpICsgXCI8L2xhYmVsPlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J2ZpZWxkRGVmYXVsdFR5cGUnIFZhbHVlPSdcIiArIGRlZmF1bHRUeXBlICsgXCInIHN0eWxlPSdkaXNwbGF5Om5vbmUnLz5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdmaWVsZERlZmF1bHRUZXh0JyBWYWx1ZT0nXCIgKyBkZWZhdWx0VGV4dCArIFwiJyBzdHlsZT0nZGlzcGxheTpub25lJy8+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nZmllbGREZWZhdWx0VmFsdWUnIFZhbHVlPSdcIiArIGRlZmF1bHRWYWx1ZSArIFwiJyBzdHlsZT0nZGlzcGxheTpub25lJy8+XCIpO1xuICAgICAgcmV0dXJuICRlbGVtO1xuICAgIH1cblxuICAgIHJldHVybiAkKFwiPGxhYmVsPjwvbGFiZWw+XCIpO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gIH0sXG4gIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWUoZGVmYXVsdERhdGEpIHtcbiAgICB2YXIgJGlucHV0VHh0ID0gd2luZG93LiRUZW1wJElucHV0dHh0O1xuXG4gICAgaWYgKG51bGwgIT0gZGVmYXVsdERhdGEpIHtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VHlwZVwiLCBkZWZhdWx0RGF0YS5UeXBlKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VmFsdWVcIiwgZGVmYXVsdERhdGEuVmFsdWUpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUZXh0XCIsIGRlZmF1bHREYXRhLlRleHQpO1xuICAgICAgJGlucHV0VHh0LnZhbChEZWZhdWx0VmFsdWVVdGlsaXR5LmZvcm1hdFRleHQoZGVmYXVsdERhdGEuVHlwZSwgZGVmYXVsdERhdGEuVGV4dCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFR5cGVcIiwgXCJcIik7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFZhbHVlXCIsIFwiXCIpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUZXh0XCIsIFwiXCIpO1xuICAgICAgJGlucHV0VHh0LnZhbChcIlwiKTtcbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlciA9IHtcbiAgX2ZpZWxkRGF0YVR5cGVBcnJheTogbnVsbCxcbiAgR2V0RmllbGREYXRhVHlwZUFycmF5OiBmdW5jdGlvbiBHZXRGaWVsZERhdGFUeXBlQXJyYXkoKSB7XG4gICAgaWYgKHRoaXMuX2ZpZWxkRGF0YVR5cGVBcnJheSA9PSBudWxsKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0U3luYyhcIi9SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvRGF0YUJhc2UvVGFibGUvR2V0VGFibGVGaWVsZFR5cGVcIiwge30sIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBsaXN0ID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKGRhdGEuZGF0YSk7XG5cbiAgICAgICAgICBpZiAobGlzdCAhPSBudWxsICYmIGxpc3QgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBfc2VsZi5fZmllbGREYXRhVHlwZUFycmF5ID0gbGlzdDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIFwiQWxlcnRMb2FkaW5nUXVlcnlFcnJvclwiLCB7fSwgXCLliqDovb3lrZfmrrXnsbvlnovlpLHotKXvvIFcIiwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9maWVsZERhdGFUeXBlQXJyYXk7XG4gIH0sXG4gIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVZhbHVlOiBmdW5jdGlvbiBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlWYWx1ZShWYWx1ZSkge1xuICAgIHZhciBhcnJheURhdGEgPSB0aGlzLkdldEZpZWxkRGF0YVR5cGVBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvYmogPSBhcnJheURhdGFbaV07XG5cbiAgICAgIGlmIChvYmouVmFsdWUgPT0gVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhbGVydChcIuaJvuS4jeWIsOaMh+WumueahOaVsOaNruexu+Wei++8jOivt+ehruiupOaYr+WQpuaUr+aMgeivpeexu+Wei++8gVwiKTtcbiAgfSxcbiAgR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VGV4dDogZnVuY3Rpb24gR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VGV4dCh0ZXh0KSB7XG4gICAgdmFyIGFycmF5RGF0YSA9IHRoaXMuR2V0RmllbGREYXRhVHlwZUFycmF5KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9iaiA9IGFycmF5RGF0YVtpXTtcblxuICAgICAgaWYgKG9iai5UZXh0ID09IHRleHQpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhbGVydChcIuaJvuS4jeWIsOaMh+WumueahOaVsOaNruexu+Wei++8jOivt+ehruiupOaYr+WQpuaUr+aMgeivpeexu+Wei++8gVwiKTtcbiAgfVxufTtcbnZhciBFZGl0VGFibGVfU2VsZWN0RmllbGRUeXBlID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyICRlbGVtID0gJChcIjxzZWxlY3QgLz5cIik7XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW1wiZmllbGREYXRhVHlwZVwiXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB9XG5cbiAgICB2YXIgX2ZpZWxkRGF0YVR5cGVBcnJheSA9IEVkaXRUYWJsZV9TZWxlY3RGaWVsZFR5cGVEYXRhTG9hZGVyLkdldEZpZWxkRGF0YVR5cGVBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfZmllbGREYXRhVHlwZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBfZmllbGREYXRhVHlwZUFycmF5W2ldLlZhbHVlO1xuICAgICAgdmFyIHRleHQgPSBfZmllbGREYXRhVHlwZUFycmF5W2ldLlRleHQ7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIHZhbHVlICsgXCInPlwiICsgdGV4dCArIFwiPC9vcHRpb24+XCIpO1xuICAgIH1cblxuICAgIGlmICh2YWwgIT0gXCJcIikge1xuICAgICAgJGVsZW0udmFsKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRlbGVtLnZhbChFZGl0VGFibGVfU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlUZXh0KFwi5a2X56ym5LiyXCIpLlZhbHVlKTtcbiAgICB9XG5cbiAgICAkZWxlbS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbCA9ICQodGhpcykudmFsKCk7XG5cbiAgICAgIGlmICh2YWwgPT0gXCLmlbTmlbBcIikge1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMCk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDApO1xuICAgICAgfSBlbHNlIGlmICh2YWwgPT0gXCLlsI/mlbBcIikge1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDEwKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIGZhbHNlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDIpO1xuICAgICAgfSBlbHNlIGlmICh2YWwgPT0gXCLml6XmnJ/ml7bpl7RcIikge1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMjApO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgwKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsID09IFwi5a2X56ym5LiyXCIpIHtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCg1MCk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDApO1xuICAgICAgfSBlbHNlIGlmICh2YWwgPT0gXCLplb/lrZfnrKbkuLJcIikge1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMCk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsdWUgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICB2YXIgdGV4dCA9IEVkaXRUYWJsZV9TZWxlY3RGaWVsZFR5cGVEYXRhTG9hZGVyLkdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVZhbHVlKHZhbHVlKS5UZXh0O1xuICAgIHZhciAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPSdcIiArIHZhbHVlICsgXCInPlwiICsgdGV4dCArIFwiPC9sYWJlbD5cIik7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDb2x1bW5fU2VsZWN0RGVmYXVsdFZhbHVlID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIGRlZmF1bHRUeXBlID0gXCJcIjtcbiAgICB2YXIgZGVmYXVsdFZhbHVlID0gXCJcIjtcbiAgICB2YXIgZGVmYXVsdFRleHQgPSBcIlwiO1xuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWZhdWx0VHlwZSA9IGpzb25EYXRhU2luZ2xlW1wiY29sdW1uRGVmYXVsdFR5cGVcIl0gPyBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRlZmF1bHRUeXBlXCJdIDogXCJcIjtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGpzb25EYXRhU2luZ2xlW1wiY29sdW1uRGVmYXVsdFZhbHVlXCJdID8ganNvbkRhdGFTaW5nbGVbXCJjb2x1bW5EZWZhdWx0VmFsdWVcIl0gOiBcIlwiO1xuICAgICAgZGVmYXVsdFRleHQgPSBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRlZmF1bHRUZXh0XCJdID8ganNvbkRhdGFTaW5nbGVbXCJjb2x1bW5EZWZhdWx0VGV4dFwiXSA6IFwiXCI7XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2aWV3U3RhdXNIdG1sRWxlbS5maW5kKFwibGFiZWxcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKSA9PSBcImNvbHVtbkRlZmF1bHRUeXBlXCIpIHtcbiAgICAgICAgICBkZWZhdWx0VHlwZSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiY29sdW1uRGVmYXVsdFRleHRcIikge1xuICAgICAgICAgIGRlZmF1bHRUZXh0ID0gJCh0aGlzKS5hdHRyKFwiVmFsdWVcIik7XG4gICAgICAgIH0gZWxzZSBpZiAoJCh0aGlzKS5hdHRyKFwiQmluZE5hbWVcIikgPT0gXCJjb2x1bW5EZWZhdWx0VmFsdWVcIikge1xuICAgICAgICAgIGRlZmF1bHRWYWx1ZSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgdmFyICRpbnB1dFR4dCA9ICQoXCI8aW5wdXQgdHlwZT0ndGV4dCcgc3R5bGU9J3dpZHRoOiA5MCUnIHJlYWRvbmx5IC8+XCIpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFR5cGVcIiwgZGVmYXVsdFR5cGUpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFZhbHVlXCIsIGRlZmF1bHRWYWx1ZSk7XG4gICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VGV4dFwiLCBkZWZhdWx0VGV4dCk7XG4gICAgJGlucHV0VHh0LnZhbChEZWZhdWx0VmFsdWVVdGlsaXR5LmZvcm1hdFRleHQoZGVmYXVsdFR5cGUsIGRlZmF1bHRUZXh0KSk7XG4gICAgdmFyICRpbnB1dEJ0biA9ICQoXCI8aW5wdXQgY2xhc3M9J25vcm1hbGJ1dHRvbi12MScgc3R5bGU9J21hcmdpbi1sZWZ0OiA0cHg7JyB0eXBlPSdidXR0b24nIHZhbHVlPScuLi4nLz5cIik7XG4gICAgJGVsZW0uYXBwZW5kKCRpbnB1dFR4dCkuYXBwZW5kKCRpbnB1dEJ0bik7XG4gICAgd2luZG93LiRUZW1wJElucHV0dHh0ID0gJGlucHV0VHh0O1xuICAgICRpbnB1dEJ0bi5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBKQnVpbGQ0RFNlbGVjdFZpZXcuU2VsZWN0RW52VmFyaWFibGUuYmVnaW5TZWxlY3QoXCJDb2x1bW5fU2VsZWN0RGVmYXVsdFZhbHVlXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgJGlucHV0VHh0ID0gZWRpdFN0YXVzSHRtbEVsZW0uZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKTtcblxuICAgIGlmICgkaW5wdXRUeHQubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGRlZmF1bHRUeXBlID0gJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VHlwZVwiKTtcbiAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRWYWx1ZVwiKTtcbiAgICAgIHZhciBkZWZhdWx0VGV4dCA9ICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFRleHRcIik7XG4gICAgICB2YXIgJGVsZW0gPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWw+XCIgKyBEZWZhdWx0VmFsdWVVdGlsaXR5LmZvcm1hdFRleHQoZGVmYXVsdFR5cGUsIGRlZmF1bHRUZXh0KSArIFwiPC9sYWJlbD5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdjb2x1bW5EZWZhdWx0VHlwZScgVmFsdWU9J1wiICsgZGVmYXVsdFR5cGUgKyBcIicgc3R5bGU9J2Rpc3BsYXk6bm9uZScvPlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J2NvbHVtbkRlZmF1bHRUZXh0JyBWYWx1ZT0nXCIgKyBkZWZhdWx0VGV4dCArIFwiJyBzdHlsZT0nZGlzcGxheTpub25lJy8+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nY29sdW1uRGVmYXVsdFZhbHVlJyBWYWx1ZT0nXCIgKyBkZWZhdWx0VmFsdWUgKyBcIicgc3R5bGU9J2Rpc3BsYXk6bm9uZScvPlwiKTtcbiAgICAgIHJldHVybiAkZWxlbTtcbiAgICB9XG5cbiAgICByZXR1cm4gJChcIjxsYWJlbD48L2xhYmVsPlwiKTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9LFxuICBzZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlOiBmdW5jdGlvbiBzZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlKGRlZmF1bHREYXRhKSB7XG4gICAgdmFyICRpbnB1dFR4dCA9IHdpbmRvdy4kVGVtcCRJbnB1dHR4dDtcblxuICAgIGlmIChudWxsICE9IGRlZmF1bHREYXRhKSB7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRUeXBlXCIsIGRlZmF1bHREYXRhLlR5cGUpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VmFsdWVcIiwgZGVmYXVsdERhdGEuVmFsdWUpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VGV4dFwiLCBkZWZhdWx0RGF0YS5UZXh0KTtcbiAgICAgICRpbnB1dFR4dC52YWwoRGVmYXVsdFZhbHVlVXRpbGl0eS5mb3JtYXRUZXh0KGRlZmF1bHREYXRhLlR5cGUsIGRlZmF1bHREYXRhLlRleHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VHlwZVwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFZhbHVlXCIsIFwiXCIpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VGV4dFwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC52YWwoXCJcIik7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ29sdW1uX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIgPSB7XG4gIF9maWVsZERhdGFUeXBlQXJyYXk6IG51bGwsXG4gIEdldEZpZWxkRGF0YVR5cGVBcnJheTogZnVuY3Rpb24gR2V0RmllbGREYXRhVHlwZUFycmF5KCkge1xuICAgIGlmICh0aGlzLl9maWVsZERhdGFUeXBlQXJyYXkgPT0gbnVsbCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdFN5bmMoXCIvUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlRmllbGRUeXBlXCIsIHt9LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YS5zdWNjZXNzID09IHRydWUpIHtcbiAgICAgICAgICB2YXIgbGlzdCA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbihkYXRhLmRhdGEpO1xuXG4gICAgICAgICAgaWYgKGxpc3QgIT0gbnVsbCAmJiBsaXN0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgX3NlbGYuX2ZpZWxkRGF0YVR5cGVBcnJheSA9IGxpc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBcIkFsZXJ0TG9hZGluZ1F1ZXJ5RXJyb3JcIiwge30sIFwi5Yqg6L295a2X5q6157G75Z6L5aSx6LSl77yBXCIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZmllbGREYXRhVHlwZUFycmF5O1xuICB9LFxuICBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlWYWx1ZTogZnVuY3Rpb24gR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VmFsdWUoVmFsdWUpIHtcbiAgICB2YXIgYXJyYXlEYXRhID0gdGhpcy5HZXRGaWVsZERhdGFUeXBlQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2JqID0gYXJyYXlEYXRhW2ldO1xuXG4gICAgICBpZiAob2JqLlZhbHVlID09IFZhbHVlKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWxlcnQoXCLmib7kuI3liLDmjIflrprnmoTmlbDmja7nsbvlnovvvIzor7fnoa7orqTmmK/lkKbmlK/mjIHor6XnsbvlnovvvIFcIik7XG4gIH0sXG4gIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVRleHQ6IGZ1bmN0aW9uIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVRleHQodGV4dCkge1xuICAgIHZhciBhcnJheURhdGEgPSB0aGlzLkdldEZpZWxkRGF0YVR5cGVBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvYmogPSBhcnJheURhdGFbaV07XG5cbiAgICAgIGlmIChvYmouVGV4dCA9PSB0ZXh0KSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWxlcnQoXCLmib7kuI3liLDmjIflrprnmoTmlbDmja7nsbvlnovvvIzor7fnoa7orqTmmK/lkKbmlK/mjIHor6XnsbvlnovvvIFcIik7XG4gIH1cbn07XG52YXIgQ29sdW1uX1NlbGVjdEZpZWxkVHlwZSA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciAkZWxlbSA9ICQoXCI8c2VsZWN0IC8+XCIpO1xuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRhdGFUeXBlTmFtZVwiXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB9XG5cbiAgICB2YXIgX2ZpZWxkRGF0YVR5cGVBcnJheSA9IENvbHVtbl9TZWxlY3RGaWVsZFR5cGVEYXRhTG9hZGVyLkdldEZpZWxkRGF0YVR5cGVBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfZmllbGREYXRhVHlwZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBfZmllbGREYXRhVHlwZUFycmF5W2ldLlZhbHVlO1xuICAgICAgdmFyIHRleHQgPSBfZmllbGREYXRhVHlwZUFycmF5W2ldLlRleHQ7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIHZhbHVlICsgXCInPlwiICsgdGV4dCArIFwiPC9vcHRpb24+XCIpO1xuICAgIH1cblxuICAgIGlmICh2YWwgIT0gXCJcIikge1xuICAgICAgJGVsZW0udmFsKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRlbGVtLnZhbChDb2x1bW5fU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlUZXh0KFwi5a2X56ym5LiyXCIpLlZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbHVlID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgdmFyIHRleHQgPSBDb2x1bW5fU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlWYWx1ZSh2YWx1ZSkuVGV4dDtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWx1ZSArIFwiJz5cIiArIHRleHQgKyBcIjwvbGFiZWw+XCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyJdfQ==
