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
    var $inputTxt = $("<input type='text' style='width: 80%' readonly />");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlbmRlcmVycy9EYXRhU2V0L0NvbHVtbl9TZWxlY3REZWZhdWx0VmFsdWUuanMiLCJSZW5kZXJlcnMvRGF0YVNldC9Db2x1bW5fU2VsZWN0RmllbGRUeXBlLmpzIiwiUmVuZGVyZXJzL1RhYmxlRGVzaWduL0VkaXRUYWJsZV9GaWVsZE5hbWUuanMiLCJSZW5kZXJlcnMvVGFibGVEZXNpZ24vRWRpdFRhYmxlX1NlbGVjdERlZmF1bHRWYWx1ZS5qcyIsIlJlbmRlcmVycy9UYWJsZURlc2lnbi9FZGl0VGFibGVfU2VsZWN0RmllbGRUeXBlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IlVJRVhDb21wb25lbnRGb3JCdWlsZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDb2x1bW5fU2VsZWN0RGVmYXVsdFZhbHVlID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIGRlZmF1bHRUeXBlID0gXCJcIjtcbiAgICB2YXIgZGVmYXVsdFZhbHVlID0gXCJcIjtcbiAgICB2YXIgZGVmYXVsdFRleHQgPSBcIlwiO1xuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWZhdWx0VHlwZSA9IGpzb25EYXRhU2luZ2xlW1wiY29sdW1uRGVmYXVsdFR5cGVcIl0gPyBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRlZmF1bHRUeXBlXCJdIDogXCJcIjtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGpzb25EYXRhU2luZ2xlW1wiY29sdW1uRGVmYXVsdFZhbHVlXCJdID8ganNvbkRhdGFTaW5nbGVbXCJjb2x1bW5EZWZhdWx0VmFsdWVcIl0gOiBcIlwiO1xuICAgICAgZGVmYXVsdFRleHQgPSBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRlZmF1bHRUZXh0XCJdID8ganNvbkRhdGFTaW5nbGVbXCJjb2x1bW5EZWZhdWx0VGV4dFwiXSA6IFwiXCI7XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2aWV3U3RhdXNIdG1sRWxlbS5maW5kKFwibGFiZWxcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKSA9PSBcImNvbHVtbkRlZmF1bHRUeXBlXCIpIHtcbiAgICAgICAgICBkZWZhdWx0VHlwZSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiY29sdW1uRGVmYXVsdFRleHRcIikge1xuICAgICAgICAgIGRlZmF1bHRUZXh0ID0gJCh0aGlzKS5hdHRyKFwiVmFsdWVcIik7XG4gICAgICAgIH0gZWxzZSBpZiAoJCh0aGlzKS5hdHRyKFwiQmluZE5hbWVcIikgPT0gXCJjb2x1bW5EZWZhdWx0VmFsdWVcIikge1xuICAgICAgICAgIGRlZmF1bHRWYWx1ZSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgdmFyICRpbnB1dFR4dCA9ICQoXCI8aW5wdXQgdHlwZT0ndGV4dCcgc3R5bGU9J3dpZHRoOiA5MCUnIHJlYWRvbmx5IC8+XCIpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFR5cGVcIiwgZGVmYXVsdFR5cGUpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFZhbHVlXCIsIGRlZmF1bHRWYWx1ZSk7XG4gICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VGV4dFwiLCBkZWZhdWx0VGV4dCk7XG4gICAgJGlucHV0VHh0LnZhbChEZWZhdWx0VmFsdWVVdGlsaXR5LmZvcm1hdFRleHQoZGVmYXVsdFR5cGUsIGRlZmF1bHRUZXh0KSk7XG4gICAgdmFyICRpbnB1dEJ0biA9ICQoXCI8aW5wdXQgY2xhc3M9J25vcm1hbGJ1dHRvbi12MScgc3R5bGU9J21hcmdpbi1sZWZ0OiA0cHg7JyB0eXBlPSdidXR0b24nIHZhbHVlPScuLi4nLz5cIik7XG4gICAgJGVsZW0uYXBwZW5kKCRpbnB1dFR4dCkuYXBwZW5kKCRpbnB1dEJ0bik7XG4gICAgd2luZG93LiRUZW1wJElucHV0dHh0ID0gJGlucHV0VHh0O1xuICAgICRpbnB1dEJ0bi5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBKQnVpbGQ0RFNlbGVjdFZpZXcuU2VsZWN0RW52VmFyaWFibGUuYmVnaW5TZWxlY3QoXCJDb2x1bW5fU2VsZWN0RGVmYXVsdFZhbHVlXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgJGlucHV0VHh0ID0gZWRpdFN0YXVzSHRtbEVsZW0uZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKTtcblxuICAgIGlmICgkaW5wdXRUeHQubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGRlZmF1bHRUeXBlID0gJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VHlwZVwiKTtcbiAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRWYWx1ZVwiKTtcbiAgICAgIHZhciBkZWZhdWx0VGV4dCA9ICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFRleHRcIik7XG4gICAgICB2YXIgJGVsZW0gPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWw+XCIgKyBEZWZhdWx0VmFsdWVVdGlsaXR5LmZvcm1hdFRleHQoZGVmYXVsdFR5cGUsIGRlZmF1bHRUZXh0KSArIFwiPC9sYWJlbD5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdjb2x1bW5EZWZhdWx0VHlwZScgVmFsdWU9J1wiICsgZGVmYXVsdFR5cGUgKyBcIicgc3R5bGU9J2Rpc3BsYXk6bm9uZScvPlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J2NvbHVtbkRlZmF1bHRUZXh0JyBWYWx1ZT0nXCIgKyBkZWZhdWx0VGV4dCArIFwiJyBzdHlsZT0nZGlzcGxheTpub25lJy8+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nY29sdW1uRGVmYXVsdFZhbHVlJyBWYWx1ZT0nXCIgKyBkZWZhdWx0VmFsdWUgKyBcIicgc3R5bGU9J2Rpc3BsYXk6bm9uZScvPlwiKTtcbiAgICAgIHJldHVybiAkZWxlbTtcbiAgICB9XG5cbiAgICByZXR1cm4gJChcIjxsYWJlbD48L2xhYmVsPlwiKTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9LFxuICBzZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlOiBmdW5jdGlvbiBzZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlKGRlZmF1bHREYXRhKSB7XG4gICAgdmFyICRpbnB1dFR4dCA9IHdpbmRvdy4kVGVtcCRJbnB1dHR4dDtcblxuICAgIGlmIChudWxsICE9IGRlZmF1bHREYXRhKSB7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRUeXBlXCIsIGRlZmF1bHREYXRhLlR5cGUpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VmFsdWVcIiwgZGVmYXVsdERhdGEuVmFsdWUpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VGV4dFwiLCBkZWZhdWx0RGF0YS5UZXh0KTtcbiAgICAgICRpbnB1dFR4dC52YWwoRGVmYXVsdFZhbHVlVXRpbGl0eS5mb3JtYXRUZXh0KGRlZmF1bHREYXRhLlR5cGUsIGRlZmF1bHREYXRhLlRleHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VHlwZVwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFZhbHVlXCIsIFwiXCIpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VGV4dFwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC52YWwoXCJcIik7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ29sdW1uX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIgPSB7XG4gIF9maWVsZERhdGFUeXBlQXJyYXk6IG51bGwsXG4gIEdldEZpZWxkRGF0YVR5cGVBcnJheTogZnVuY3Rpb24gR2V0RmllbGREYXRhVHlwZUFycmF5KCkge1xuICAgIGlmICh0aGlzLl9maWVsZERhdGFUeXBlQXJyYXkgPT0gbnVsbCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdFN5bmMoXCIvUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlRmllbGRUeXBlXCIsIHt9LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YS5zdWNjZXNzID09IHRydWUpIHtcbiAgICAgICAgICB2YXIgbGlzdCA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbihkYXRhLmRhdGEpO1xuXG4gICAgICAgICAgaWYgKGxpc3QgIT0gbnVsbCAmJiBsaXN0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgX3NlbGYuX2ZpZWxkRGF0YVR5cGVBcnJheSA9IGxpc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBcIkFsZXJ0TG9hZGluZ1F1ZXJ5RXJyb3JcIiwge30sIFwi5Yqg6L295a2X5q6157G75Z6L5aSx6LSl77yBXCIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZmllbGREYXRhVHlwZUFycmF5O1xuICB9LFxuICBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlWYWx1ZTogZnVuY3Rpb24gR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VmFsdWUoVmFsdWUpIHtcbiAgICB2YXIgYXJyYXlEYXRhID0gdGhpcy5HZXRGaWVsZERhdGFUeXBlQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2JqID0gYXJyYXlEYXRhW2ldO1xuXG4gICAgICBpZiAob2JqLlZhbHVlID09IFZhbHVlKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWxlcnQoXCLmib7kuI3liLDmjIflrprnmoTmlbDmja7nsbvlnovvvIzor7fnoa7orqTmmK/lkKbmlK/mjIHor6XnsbvlnovvvIFcIik7XG4gIH0sXG4gIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVRleHQ6IGZ1bmN0aW9uIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVRleHQodGV4dCkge1xuICAgIHZhciBhcnJheURhdGEgPSB0aGlzLkdldEZpZWxkRGF0YVR5cGVBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvYmogPSBhcnJheURhdGFbaV07XG5cbiAgICAgIGlmIChvYmouVGV4dCA9PSB0ZXh0KSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWxlcnQoXCLmib7kuI3liLDmjIflrprnmoTmlbDmja7nsbvlnovvvIzor7fnoa7orqTmmK/lkKbmlK/mjIHor6XnsbvlnovvvIFcIik7XG4gIH1cbn07XG52YXIgQ29sdW1uX1NlbGVjdEZpZWxkVHlwZSA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciAkZWxlbSA9ICQoXCI8c2VsZWN0IC8+XCIpO1xuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRhdGFUeXBlTmFtZVwiXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB9XG5cbiAgICB2YXIgX2ZpZWxkRGF0YVR5cGVBcnJheSA9IENvbHVtbl9TZWxlY3RGaWVsZFR5cGVEYXRhTG9hZGVyLkdldEZpZWxkRGF0YVR5cGVBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfZmllbGREYXRhVHlwZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBfZmllbGREYXRhVHlwZUFycmF5W2ldLlZhbHVlO1xuICAgICAgdmFyIHRleHQgPSBfZmllbGREYXRhVHlwZUFycmF5W2ldLlRleHQ7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIHZhbHVlICsgXCInPlwiICsgdGV4dCArIFwiPC9vcHRpb24+XCIpO1xuICAgIH1cblxuICAgIGlmICh2YWwgIT0gXCJcIikge1xuICAgICAgJGVsZW0udmFsKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRlbGVtLnZhbChDb2x1bW5fU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlUZXh0KFwi5a2X56ym5LiyXCIpLlZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbHVlID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgdmFyIHRleHQgPSBDb2x1bW5fU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlWYWx1ZSh2YWx1ZSkuVGV4dDtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWx1ZSArIFwiJz5cIiArIHRleHQgKyBcIjwvbGFiZWw+XCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX0ZpZWxkTmFtZSA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciBiaW5kbmFtZSA9IHRlbXBsYXRlLkJpbmROYW1lO1xuXG4gICAgaWYgKHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHZhciB2YWwgPSBFZGl0VGFibGVEZWZhdWxlVmFsdWUuR2V0VmFsdWUodGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbYmluZG5hbWVdO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0uaHRtbCgpO1xuICAgIH1cblxuICAgIHZhciAkZWxlbSA9ICQoXCI8aW5wdXQgdHlwZT0ndGV4dCcgc3R5bGU9J3dpZHRoOiA5OCUnIC8+XCIpO1xuICAgICRlbGVtLnZhbCh2YWwpO1xuICAgICRlbGVtLmF0dHIoXCJCaW5kTmFtZVwiLCB0ZW1wbGF0ZS5CaW5kTmFtZSk7XG4gICAgJGVsZW0uYXR0cihcIlZhbFwiLCB2YWwpO1xuICAgICRlbGVtLmF0dHIoXCJJc1NlcmlhbGl6ZVwiLCBcInRydWVcIik7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKS50b1VwcGVyQ2FzZSgpO1xuICAgIHZhciAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPSdcIiArIHZhbCArIFwiJz5cIiArIHZhbCArIFwiPC9sYWJlbD5cIik7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICB2YXIgcmVzdWx0ID0gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG5cbiAgICBpZiAocmVzdWx0LlN1Y2Nlc3MpIHtcbiAgICAgIGhvc3RUYWJsZS5maW5kKFwiW3JlbmRlcmVyPUVkaXRUYWJsZV9GaWVsZE5hbWVdXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2VyaXRlbSA9ICQodGhpcyk7XG4gICAgICAgIHNlcml0ZW0uZmluZChcImxhYmVsXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBsYWJlbGl0ZW0gPSAkKHRoaXMpO1xuXG4gICAgICAgICAgaWYgKGxhYmVsaXRlbS50ZXh0KCkgPT0gdmFsIHx8IGxhYmVsaXRlbS50ZXh0KCkgPT0gdmFsLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgU3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgIE1zZzogXCJb5a2X5q615ZCN56ewXeS4jeiDvemHjeWkjSFcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9TZWxlY3REZWZhdWx0VmFsdWUgPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgZmllbGREZWZhdWx0VHlwZSA9IFwiXCI7XG4gICAgdmFyIGZpZWxkRGVmYXVsdFZhbHVlID0gXCJcIjtcbiAgICB2YXIgZmllbGREZWZhdWx0VGV4dCA9IFwiXCI7XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGZpZWxkRGVmYXVsdFR5cGUgPSBqc29uRGF0YVNpbmdsZVtcImZpZWxkRGVmYXVsdFR5cGVcIl0gPyBqc29uRGF0YVNpbmdsZVtcImZpZWxkRGVmYXVsdFR5cGVcIl0gOiBcIlwiO1xuICAgICAgZmllbGREZWZhdWx0VmFsdWUgPSBqc29uRGF0YVNpbmdsZVtcImZpZWxkRGVmYXVsdFZhbHVlXCJdID8ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRWYWx1ZVwiXSA6IFwiXCI7XG4gICAgICBmaWVsZERlZmF1bHRUZXh0ID0ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRUZXh0XCJdID8ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRUZXh0XCJdIDogXCJcIjtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZpZXdTdGF1c0h0bWxFbGVtLmZpbmQoXCJsYWJlbFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiZmllbGREZWZhdWx0VHlwZVwiKSB7XG4gICAgICAgICAgZmllbGREZWZhdWx0VHlwZSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiZmllbGREZWZhdWx0VGV4dFwiKSB7XG4gICAgICAgICAgZmllbGREZWZhdWx0VGV4dCA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiZmllbGREZWZhdWx0VmFsdWVcIikge1xuICAgICAgICAgIGZpZWxkRGVmYXVsdFZhbHVlID0gJCh0aGlzKS5hdHRyKFwiVmFsdWVcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciAkZWxlbSA9ICQoXCI8ZGl2PjwvZGl2PlwiKTtcbiAgICB2YXIgJGlucHV0VHh0ID0gJChcIjxpbnB1dCB0eXBlPSd0ZXh0JyBzdHlsZT0nd2lkdGg6IDgwJScgcmVhZG9ubHkgLz5cIik7XG4gICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUeXBlXCIsIGZpZWxkRGVmYXVsdFR5cGUpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VmFsdWVcIiwgZmllbGREZWZhdWx0VmFsdWUpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VGV4dFwiLCBmaWVsZERlZmF1bHRUZXh0KTtcbiAgICAkaW5wdXRUeHQudmFsKERlZmF1bHRWYWx1ZVV0aWxpdHkuZm9ybWF0VGV4dChmaWVsZERlZmF1bHRUeXBlLCBmaWVsZERlZmF1bHRUZXh0KSk7XG4gICAgdmFyICRpbnB1dEJ0biA9ICQoXCI8aW5wdXQgY2xhc3M9J25vcm1hbGJ1dHRvbi12MScgc3R5bGU9J21hcmdpbi1sZWZ0OiA0cHg7JyB0eXBlPSdidXR0b24nIHZhbHVlPScuLi4nLz5cIik7XG4gICAgJGVsZW0uYXBwZW5kKCRpbnB1dFR4dCkuYXBwZW5kKCRpbnB1dEJ0bik7XG4gICAgd2luZG93LiRUZW1wJElucHV0dHh0ID0gJGlucHV0VHh0O1xuICAgICRpbnB1dEJ0bi5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAod2luZG93LnRhYmxlRGVzaW9uKSB7XG4gICAgICAgIHRhYmxlRGVzaW9uLnNlbGVjdERlZmF1bHRWYWx1ZURpYWxvZ0JlZ2luKEVkaXRUYWJsZV9TZWxlY3REZWZhdWx0VmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LnBhcmVudC5saXN0RGVzaWduLnNlbGVjdERlZmF1bHRWYWx1ZURpYWxvZ0JlZ2luKHdpbmRvdywgbnVsbCk7XG4gICAgICAgIHdpbmRvdy5fU2VsZWN0QmluZE9iaiA9IHtcbiAgICAgICAgICBzZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlOiBmdW5jdGlvbiBzZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlKHJlc3VsdCkge1xuICAgICAgICAgICAgRWRpdFRhYmxlX1NlbGVjdERlZmF1bHRWYWx1ZS5zZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlKHJlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgJGlucHV0VHh0ID0gZWRpdFN0YXVzSHRtbEVsZW0uZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKTtcblxuICAgIGlmICgkaW5wdXRUeHQubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGRlZmF1bHRUeXBlID0gJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUeXBlXCIpO1xuICAgICAgdmFyIGRlZmF1bHRWYWx1ZSA9ICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VmFsdWVcIik7XG4gICAgICB2YXIgZGVmYXVsdFRleHQgPSAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFRleHRcIik7XG4gICAgICB2YXIgJGVsZW0gPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWw+XCIgKyBEZWZhdWx0VmFsdWVVdGlsaXR5LmZvcm1hdFRleHQoZGVmYXVsdFR5cGUsIGRlZmF1bHRUZXh0KSArIFwiPC9sYWJlbD5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdmaWVsZERlZmF1bHRUeXBlJyBWYWx1ZT0nXCIgKyBkZWZhdWx0VHlwZSArIFwiJyBzdHlsZT0nZGlzcGxheTpub25lJy8+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nZmllbGREZWZhdWx0VGV4dCcgVmFsdWU9J1wiICsgZGVmYXVsdFRleHQgKyBcIicgc3R5bGU9J2Rpc3BsYXk6bm9uZScvPlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J2ZpZWxkRGVmYXVsdFZhbHVlJyBWYWx1ZT0nXCIgKyBkZWZhdWx0VmFsdWUgKyBcIicgc3R5bGU9J2Rpc3BsYXk6bm9uZScvPlwiKTtcbiAgICAgIHJldHVybiAkZWxlbTtcbiAgICB9XG5cbiAgICByZXR1cm4gJChcIjxsYWJlbD48L2xhYmVsPlwiKTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9LFxuICBzZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlOiBmdW5jdGlvbiBzZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlKGRlZmF1bHREYXRhKSB7XG4gICAgdmFyICRpbnB1dFR4dCA9IHdpbmRvdy4kVGVtcCRJbnB1dHR4dDtcblxuICAgIGlmIChudWxsICE9IGRlZmF1bHREYXRhKSB7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFR5cGVcIiwgZGVmYXVsdERhdGEuVHlwZSk7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFZhbHVlXCIsIGRlZmF1bHREYXRhLlZhbHVlKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VGV4dFwiLCBkZWZhdWx0RGF0YS5UZXh0KTtcbiAgICAgICRpbnB1dFR4dC52YWwoRGVmYXVsdFZhbHVlVXRpbGl0eS5mb3JtYXRUZXh0KGRlZmF1bHREYXRhLlR5cGUsIGRlZmF1bHREYXRhLlRleHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUeXBlXCIsIFwiXCIpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRWYWx1ZVwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VGV4dFwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC52YWwoXCJcIik7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIgPSB7XG4gIF9maWVsZERhdGFUeXBlQXJyYXk6IG51bGwsXG4gIEdldEZpZWxkRGF0YVR5cGVBcnJheTogZnVuY3Rpb24gR2V0RmllbGREYXRhVHlwZUFycmF5KCkge1xuICAgIGlmICh0aGlzLl9maWVsZERhdGFUeXBlQXJyYXkgPT0gbnVsbCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdFN5bmMoXCIvUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlRmllbGRUeXBlXCIsIHt9LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YS5zdWNjZXNzID09IHRydWUpIHtcbiAgICAgICAgICB2YXIgbGlzdCA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbihkYXRhLmRhdGEpO1xuXG4gICAgICAgICAgaWYgKGxpc3QgIT0gbnVsbCAmJiBsaXN0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgX3NlbGYuX2ZpZWxkRGF0YVR5cGVBcnJheSA9IGxpc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBcIkFsZXJ0TG9hZGluZ1F1ZXJ5RXJyb3JcIiwge30sIFwi5Yqg6L295a2X5q6157G75Z6L5aSx6LSl77yBXCIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZmllbGREYXRhVHlwZUFycmF5O1xuICB9LFxuICBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlWYWx1ZTogZnVuY3Rpb24gR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VmFsdWUoVmFsdWUpIHtcbiAgICB2YXIgYXJyYXlEYXRhID0gdGhpcy5HZXRGaWVsZERhdGFUeXBlQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2JqID0gYXJyYXlEYXRhW2ldO1xuXG4gICAgICBpZiAob2JqLlZhbHVlID09IFZhbHVlKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWxlcnQoXCLmib7kuI3liLDmjIflrprnmoTmlbDmja7nsbvlnovvvIzor7fnoa7orqTmmK/lkKbmlK/mjIHor6XnsbvlnovvvIFcIik7XG4gIH0sXG4gIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVRleHQ6IGZ1bmN0aW9uIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVRleHQodGV4dCkge1xuICAgIHZhciBhcnJheURhdGEgPSB0aGlzLkdldEZpZWxkRGF0YVR5cGVBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvYmogPSBhcnJheURhdGFbaV07XG5cbiAgICAgIGlmIChvYmouVGV4dCA9PSB0ZXh0KSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWxlcnQoXCLmib7kuI3liLDmjIflrprnmoTmlbDmja7nsbvlnovvvIzor7fnoa7orqTmmK/lkKbmlK/mjIHor6XnsbvlnovvvIFcIik7XG4gIH1cbn07XG52YXIgRWRpdFRhYmxlX1NlbGVjdEZpZWxkVHlwZSA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciAkZWxlbSA9ICQoXCI8c2VsZWN0IC8+XCIpO1xuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtcImZpZWxkRGF0YVR5cGVcIl07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5hdHRyKFwiVmFsdWVcIik7XG4gICAgfVxuXG4gICAgdmFyIF9maWVsZERhdGFUeXBlQXJyYXkgPSBFZGl0VGFibGVfU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX2ZpZWxkRGF0YVR5cGVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gX2ZpZWxkRGF0YVR5cGVBcnJheVtpXS5WYWx1ZTtcbiAgICAgIHZhciB0ZXh0ID0gX2ZpZWxkRGF0YVR5cGVBcnJheVtpXS5UZXh0O1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nXCIgKyB2YWx1ZSArIFwiJz5cIiArIHRleHQgKyBcIjwvb3B0aW9uPlwiKTtcbiAgICB9XG5cbiAgICBpZiAodmFsICE9IFwiXCIpIHtcbiAgICAgICRlbGVtLnZhbCh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkZWxlbS52YWwoRWRpdFRhYmxlX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIuR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VGV4dChcIuWtl+espuS4slwiKS5WYWx1ZSk7XG4gICAgfVxuXG4gICAgJGVsZW0uY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB2YWwgPSAkKHRoaXMpLnZhbCgpO1xuXG4gICAgICBpZiAodmFsID09IFwi5pW05pWwXCIpIHtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDApO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgwKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsID09IFwi5bCP5pWwXCIpIHtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgxMCk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgyKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsID09IFwi5pel5pyf5pe26Ze0XCIpIHtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDIwKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMCk7XG4gICAgICB9IGVsc2UgaWYgKHZhbCA9PSBcIuWtl+espuS4slwiKSB7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIGZhbHNlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoNTApO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgwKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsID09IFwi6ZW/5a2X56ym5LiyXCIpIHtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDApO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbHVlID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgdmFyIHRleHQgPSBFZGl0VGFibGVfU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlWYWx1ZSh2YWx1ZSkuVGV4dDtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWx1ZSArIFwiJz5cIiArIHRleHQgKyBcIjwvbGFiZWw+XCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyJdfQ==
