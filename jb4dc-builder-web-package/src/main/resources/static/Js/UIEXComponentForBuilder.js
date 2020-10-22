"use strict";

var Column_RTTableIsMain = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var configSource = [{
      "Value": "是",
      "Text": "是"
    }, {
      "Value": "否",
      "Text": "否"
    }];
    var val = "";
    var txt = "";
    var bindname = template.BindName;

    if (template.DefaultValue != undefined && template.DefaultValue != null) {
      var val = EditTableDefauleValue.GetValue(template);
    }

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.attr("Value");
    }

    var $elem = $("<select style='width: 100%' />");

    for (var i = 0; i < configSource.length; i++) {
      var item = configSource[i];
      $elem.append("<option value='" + item.Value + "' text='" + item.Text + "'>" + item.Text + "</option>");
    }

    $elem.val(val);

    if (typeof template.ChangeEvent == "function") {
      $elem.change(function () {
        template.ChangeEvent(this, _config, template, hostCell, hostRow, hostTable, viewStausHtmlElem);
      });
    }

    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.find("option:selected").attr("Value");
    var text = editStausHtmlElem.find("option:selected").attr("Text");

    if (!val) {
      val = "";
    }

    if (!text) {
      text = "";
    }

    var $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' Value='" + val + "' Text='" + text + "'>" + text + "</label>");
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
    var $inputTxt = $("<input type='text' style='width: 82%' readonly />");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlbmRlcmVycy9EYXRhU2V0L0NvbHVtbl9SVFRhYmxlSXNNYWluLmpzIiwiUmVuZGVyZXJzL0RhdGFTZXQvQ29sdW1uX1NlbGVjdERlZmF1bHRWYWx1ZS5qcyIsIlJlbmRlcmVycy9EYXRhU2V0L0NvbHVtbl9TZWxlY3RGaWVsZFR5cGUuanMiLCJSZW5kZXJlcnMvVGFibGVEZXNpZ24vRWRpdFRhYmxlX0ZpZWxkTmFtZS5qcyIsIlJlbmRlcmVycy9UYWJsZURlc2lnbi9FZGl0VGFibGVfU2VsZWN0RGVmYXVsdFZhbHVlLmpzIiwiUmVuZGVyZXJzL1RhYmxlRGVzaWduL0VkaXRUYWJsZV9TZWxlY3RGaWVsZFR5cGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiVUlFWENvbXBvbmVudEZvckJ1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIENvbHVtbl9SVFRhYmxlSXNNYWluID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIGNvbmZpZ1NvdXJjZSA9IFt7XG4gICAgICBcIlZhbHVlXCI6IFwi5pivXCIsXG4gICAgICBcIlRleHRcIjogXCLmmK9cIlxuICAgIH0sIHtcbiAgICAgIFwiVmFsdWVcIjogXCLlkKZcIixcbiAgICAgIFwiVGV4dFwiOiBcIuWQplwiXG4gICAgfV07XG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyIHR4dCA9IFwiXCI7XG4gICAgdmFyIGJpbmRuYW1lID0gdGVtcGxhdGUuQmluZE5hbWU7XG5cbiAgICBpZiAodGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gbnVsbCkge1xuICAgICAgdmFyIHZhbCA9IEVkaXRUYWJsZURlZmF1bGVWYWx1ZS5HZXRWYWx1ZSh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtiaW5kbmFtZV07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5hdHRyKFwiVmFsdWVcIik7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gJChcIjxzZWxlY3Qgc3R5bGU9J3dpZHRoOiAxMDAlJyAvPlwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29uZmlnU291cmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGNvbmZpZ1NvdXJjZVtpXTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9J1wiICsgaXRlbS5WYWx1ZSArIFwiJyB0ZXh0PSdcIiArIGl0ZW0uVGV4dCArIFwiJz5cIiArIGl0ZW0uVGV4dCArIFwiPC9vcHRpb24+XCIpO1xuICAgIH1cblxuICAgICRlbGVtLnZhbCh2YWwpO1xuXG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5DaGFuZ2VFdmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICRlbGVtLmNoYW5nZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRlbXBsYXRlLkNoYW5nZUV2ZW50KHRoaXMsIF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikuYXR0cihcIlZhbHVlXCIpO1xuICAgIHZhciB0ZXh0ID0gZWRpdFN0YXVzSHRtbEVsZW0uZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS5hdHRyKFwiVGV4dFwiKTtcblxuICAgIGlmICghdmFsKSB7XG4gICAgICB2YWwgPSBcIlwiO1xuICAgIH1cblxuICAgIGlmICghdGV4dCkge1xuICAgICAgdGV4dCA9IFwiXCI7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9J1wiICsgdmFsICsgXCInIFRleHQ9J1wiICsgdGV4dCArIFwiJz5cIiArIHRleHQgKyBcIjwvbGFiZWw+XCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ29sdW1uX1NlbGVjdERlZmF1bHRWYWx1ZSA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciBkZWZhdWx0VHlwZSA9IFwiXCI7XG4gICAgdmFyIGRlZmF1bHRWYWx1ZSA9IFwiXCI7XG4gICAgdmFyIGRlZmF1bHRUZXh0ID0gXCJcIjtcblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgZGVmYXVsdFR5cGUgPSBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRlZmF1bHRUeXBlXCJdID8ganNvbkRhdGFTaW5nbGVbXCJjb2x1bW5EZWZhdWx0VHlwZVwiXSA6IFwiXCI7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRlZmF1bHRWYWx1ZVwiXSA/IGpzb25EYXRhU2luZ2xlW1wiY29sdW1uRGVmYXVsdFZhbHVlXCJdIDogXCJcIjtcbiAgICAgIGRlZmF1bHRUZXh0ID0ganNvbkRhdGFTaW5nbGVbXCJjb2x1bW5EZWZhdWx0VGV4dFwiXSA/IGpzb25EYXRhU2luZ2xlW1wiY29sdW1uRGVmYXVsdFRleHRcIl0gOiBcIlwiO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmlld1N0YXVzSHRtbEVsZW0uZmluZChcImxhYmVsXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiQmluZE5hbWVcIikgPT0gXCJjb2x1bW5EZWZhdWx0VHlwZVwiKSB7XG4gICAgICAgICAgZGVmYXVsdFR5cGUgPSAkKHRoaXMpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgICAgfSBlbHNlIGlmICgkKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKSA9PSBcImNvbHVtbkRlZmF1bHRUZXh0XCIpIHtcbiAgICAgICAgICBkZWZhdWx0VGV4dCA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiY29sdW1uRGVmYXVsdFZhbHVlXCIpIHtcbiAgICAgICAgICBkZWZhdWx0VmFsdWUgPSAkKHRoaXMpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gJChcIjxkaXY+PC9kaXY+XCIpO1xuICAgIHZhciAkaW5wdXRUeHQgPSAkKFwiPGlucHV0IHR5cGU9J3RleHQnIHN0eWxlPSd3aWR0aDogODIlJyByZWFkb25seSAvPlwiKTtcbiAgICAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRUeXBlXCIsIGRlZmF1bHRUeXBlKTtcbiAgICAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRWYWx1ZVwiLCBkZWZhdWx0VmFsdWUpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFRleHRcIiwgZGVmYXVsdFRleHQpO1xuICAgICRpbnB1dFR4dC52YWwoRGVmYXVsdFZhbHVlVXRpbGl0eS5mb3JtYXRUZXh0KGRlZmF1bHRUeXBlLCBkZWZhdWx0VGV4dCkpO1xuICAgIHZhciAkaW5wdXRCdG4gPSAkKFwiPGlucHV0IGNsYXNzPSdub3JtYWxidXR0b24tdjEnIHN0eWxlPSdtYXJnaW4tbGVmdDogNHB4OycgdHlwZT0nYnV0dG9uJyB2YWx1ZT0nLi4uJy8+XCIpO1xuICAgICRlbGVtLmFwcGVuZCgkaW5wdXRUeHQpLmFwcGVuZCgkaW5wdXRCdG4pO1xuICAgIHdpbmRvdy4kVGVtcCRJbnB1dHR4dCA9ICRpbnB1dFR4dDtcbiAgICAkaW5wdXRCdG4uY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgSkJ1aWxkNERTZWxlY3RWaWV3LlNlbGVjdEVudlZhcmlhYmxlLmJlZ2luU2VsZWN0KFwiQ29sdW1uX1NlbGVjdERlZmF1bHRWYWx1ZVwiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyICRpbnB1dFR4dCA9IGVkaXRTdGF1c0h0bWxFbGVtLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIik7XG5cbiAgICBpZiAoJGlucHV0VHh0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBkZWZhdWx0VHlwZSA9ICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFR5cGVcIik7XG4gICAgICB2YXIgZGVmYXVsdFZhbHVlID0gJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VmFsdWVcIik7XG4gICAgICB2YXIgZGVmYXVsdFRleHQgPSAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRUZXh0XCIpO1xuICAgICAgdmFyICRlbGVtID0gJChcIjxkaXY+PC9kaXY+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsPlwiICsgRGVmYXVsdFZhbHVlVXRpbGl0eS5mb3JtYXRUZXh0KGRlZmF1bHRUeXBlLCBkZWZhdWx0VGV4dCkgKyBcIjwvbGFiZWw+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nY29sdW1uRGVmYXVsdFR5cGUnIFZhbHVlPSdcIiArIGRlZmF1bHRUeXBlICsgXCInIHN0eWxlPSdkaXNwbGF5Om5vbmUnLz5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdjb2x1bW5EZWZhdWx0VGV4dCcgVmFsdWU9J1wiICsgZGVmYXVsdFRleHQgKyBcIicgc3R5bGU9J2Rpc3BsYXk6bm9uZScvPlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J2NvbHVtbkRlZmF1bHRWYWx1ZScgVmFsdWU9J1wiICsgZGVmYXVsdFZhbHVlICsgXCInIHN0eWxlPSdkaXNwbGF5Om5vbmUnLz5cIik7XG4gICAgICByZXR1cm4gJGVsZW07XG4gICAgfVxuXG4gICAgcmV0dXJuICQoXCI8bGFiZWw+PC9sYWJlbD5cIik7XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfSxcbiAgc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZTogZnVuY3Rpb24gc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZShkZWZhdWx0RGF0YSkge1xuICAgIHZhciAkaW5wdXRUeHQgPSB3aW5kb3cuJFRlbXAkSW5wdXR0eHQ7XG5cbiAgICBpZiAobnVsbCAhPSBkZWZhdWx0RGF0YSkge1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VHlwZVwiLCBkZWZhdWx0RGF0YS5UeXBlKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFZhbHVlXCIsIGRlZmF1bHREYXRhLlZhbHVlKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFRleHRcIiwgZGVmYXVsdERhdGEuVGV4dCk7XG4gICAgICAkaW5wdXRUeHQudmFsKERlZmF1bHRWYWx1ZVV0aWxpdHkuZm9ybWF0VGV4dChkZWZhdWx0RGF0YS5UeXBlLCBkZWZhdWx0RGF0YS5UZXh0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFR5cGVcIiwgXCJcIik7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRWYWx1ZVwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFRleHRcIiwgXCJcIik7XG4gICAgICAkaW5wdXRUeHQudmFsKFwiXCIpO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIENvbHVtbl9TZWxlY3RGaWVsZFR5cGVEYXRhTG9hZGVyID0ge1xuICBfZmllbGREYXRhVHlwZUFycmF5OiBudWxsLFxuICBHZXRGaWVsZERhdGFUeXBlQXJyYXk6IGZ1bmN0aW9uIEdldEZpZWxkRGF0YVR5cGVBcnJheSgpIHtcbiAgICBpZiAodGhpcy5fZmllbGREYXRhVHlwZUFycmF5ID09IG51bGwpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3RTeW5jKFwiL1Jlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZUZpZWxkVHlwZVwiLCB7fSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIGxpc3QgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24oZGF0YS5kYXRhKTtcblxuICAgICAgICAgIGlmIChsaXN0ICE9IG51bGwgJiYgbGlzdCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIF9zZWxmLl9maWVsZERhdGFUeXBlQXJyYXkgPSBsaXN0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgXCJBbGVydExvYWRpbmdRdWVyeUVycm9yXCIsIHt9LCBcIuWKoOi9veWtl+auteexu+Wei+Wksei0pe+8gVwiLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2ZpZWxkRGF0YVR5cGVBcnJheTtcbiAgfSxcbiAgR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VmFsdWU6IGZ1bmN0aW9uIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVZhbHVlKFZhbHVlKSB7XG4gICAgdmFyIGFycmF5RGF0YSA9IHRoaXMuR2V0RmllbGREYXRhVHlwZUFycmF5KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9iaiA9IGFycmF5RGF0YVtpXTtcblxuICAgICAgaWYgKG9iai5WYWx1ZSA9PSBWYWx1ZSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFsZXJ0KFwi5om+5LiN5Yiw5oyH5a6a55qE5pWw5o2u57G75Z6L77yM6K+356Gu6K6k5piv5ZCm5pSv5oyB6K+l57G75Z6L77yBXCIpO1xuICB9LFxuICBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlUZXh0OiBmdW5jdGlvbiBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlUZXh0KHRleHQpIHtcbiAgICB2YXIgYXJyYXlEYXRhID0gdGhpcy5HZXRGaWVsZERhdGFUeXBlQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2JqID0gYXJyYXlEYXRhW2ldO1xuXG4gICAgICBpZiAob2JqLlRleHQgPT0gdGV4dCkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFsZXJ0KFwi5om+5LiN5Yiw5oyH5a6a55qE5pWw5o2u57G75Z6L77yM6K+356Gu6K6k5piv5ZCm5pSv5oyB6K+l57G75Z6L77yBXCIpO1xuICB9XG59O1xudmFyIENvbHVtbl9TZWxlY3RGaWVsZFR5cGUgPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPHNlbGVjdCAvPlwiKTtcblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbXCJjb2x1bW5EYXRhVHlwZU5hbWVcIl07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5hdHRyKFwiVmFsdWVcIik7XG4gICAgfVxuXG4gICAgdmFyIF9maWVsZERhdGFUeXBlQXJyYXkgPSBDb2x1bW5fU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX2ZpZWxkRGF0YVR5cGVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gX2ZpZWxkRGF0YVR5cGVBcnJheVtpXS5WYWx1ZTtcbiAgICAgIHZhciB0ZXh0ID0gX2ZpZWxkRGF0YVR5cGVBcnJheVtpXS5UZXh0O1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nXCIgKyB2YWx1ZSArIFwiJz5cIiArIHRleHQgKyBcIjwvb3B0aW9uPlwiKTtcbiAgICB9XG5cbiAgICBpZiAodmFsICE9IFwiXCIpIHtcbiAgICAgICRlbGVtLnZhbCh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkZWxlbS52YWwoQ29sdW1uX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIuR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VGV4dChcIuWtl+espuS4slwiKS5WYWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWx1ZSA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHZhciB0ZXh0ID0gQ29sdW1uX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIuR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VmFsdWUodmFsdWUpLlRleHQ7XG4gICAgdmFyICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9J1wiICsgdmFsdWUgKyBcIic+XCIgKyB0ZXh0ICsgXCI8L2xhYmVsPlwiKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9GaWVsZE5hbWUgPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgYmluZG5hbWUgPSB0ZW1wbGF0ZS5CaW5kTmFtZTtcblxuICAgIGlmICh0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSBudWxsKSB7XG4gICAgICB2YXIgdmFsID0gRWRpdFRhYmxlRGVmYXVsZVZhbHVlLkdldFZhbHVlKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW2JpbmRuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmh0bWwoKTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J3RleHQnIHN0eWxlPSd3aWR0aDogOTglJyAvPlwiKTtcbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICAkZWxlbS5hdHRyKFwiQmluZE5hbWVcIiwgdGVtcGxhdGUuQmluZE5hbWUpO1xuICAgICRlbGVtLmF0dHIoXCJWYWxcIiwgdmFsKTtcbiAgICAkZWxlbS5hdHRyKFwiSXNTZXJpYWxpemVcIiwgXCJ0cnVlXCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCkudG9VcHBlckNhc2UoKTtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWwgKyBcIic+XCIgKyB2YWwgKyBcIjwvbGFiZWw+XCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgdmFyIHJlc3VsdCA9IEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuXG4gICAgaWYgKHJlc3VsdC5TdWNjZXNzKSB7XG4gICAgICBob3N0VGFibGUuZmluZChcIltyZW5kZXJlcj1FZGl0VGFibGVfRmllbGROYW1lXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNlcml0ZW0gPSAkKHRoaXMpO1xuICAgICAgICBzZXJpdGVtLmZpbmQoXCJsYWJlbFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgbGFiZWxpdGVtID0gJCh0aGlzKTtcblxuICAgICAgICAgIGlmIChsYWJlbGl0ZW0udGV4dCgpID09IHZhbCB8fCBsYWJlbGl0ZW0udGV4dCgpID09IHZhbC50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgIFN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICBNc2c6IFwiW+Wtl+auteWQjeensF3kuI3og73ph43lpI0hXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfU2VsZWN0RGVmYXVsdFZhbHVlID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIGZpZWxkRGVmYXVsdFR5cGUgPSBcIlwiO1xuICAgIHZhciBmaWVsZERlZmF1bHRWYWx1ZSA9IFwiXCI7XG4gICAgdmFyIGZpZWxkRGVmYXVsdFRleHQgPSBcIlwiO1xuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBmaWVsZERlZmF1bHRUeXBlID0ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRUeXBlXCJdID8ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRUeXBlXCJdIDogXCJcIjtcbiAgICAgIGZpZWxkRGVmYXVsdFZhbHVlID0ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRWYWx1ZVwiXSA/IGpzb25EYXRhU2luZ2xlW1wiZmllbGREZWZhdWx0VmFsdWVcIl0gOiBcIlwiO1xuICAgICAgZmllbGREZWZhdWx0VGV4dCA9IGpzb25EYXRhU2luZ2xlW1wiZmllbGREZWZhdWx0VGV4dFwiXSA/IGpzb25EYXRhU2luZ2xlW1wiZmllbGREZWZhdWx0VGV4dFwiXSA6IFwiXCI7XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2aWV3U3RhdXNIdG1sRWxlbS5maW5kKFwibGFiZWxcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKSA9PSBcImZpZWxkRGVmYXVsdFR5cGVcIikge1xuICAgICAgICAgIGZpZWxkRGVmYXVsdFR5cGUgPSAkKHRoaXMpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgICAgfSBlbHNlIGlmICgkKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKSA9PSBcImZpZWxkRGVmYXVsdFRleHRcIikge1xuICAgICAgICAgIGZpZWxkRGVmYXVsdFRleHQgPSAkKHRoaXMpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgICAgfSBlbHNlIGlmICgkKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKSA9PSBcImZpZWxkRGVmYXVsdFZhbHVlXCIpIHtcbiAgICAgICAgICBmaWVsZERlZmF1bHRWYWx1ZSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgdmFyICRpbnB1dFR4dCA9ICQoXCI8aW5wdXQgdHlwZT0ndGV4dCcgc3R5bGU9J3dpZHRoOiA4MCUnIHJlYWRvbmx5IC8+XCIpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VHlwZVwiLCBmaWVsZERlZmF1bHRUeXBlKTtcbiAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFZhbHVlXCIsIGZpZWxkRGVmYXVsdFZhbHVlKTtcbiAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFRleHRcIiwgZmllbGREZWZhdWx0VGV4dCk7XG4gICAgJGlucHV0VHh0LnZhbChEZWZhdWx0VmFsdWVVdGlsaXR5LmZvcm1hdFRleHQoZmllbGREZWZhdWx0VHlwZSwgZmllbGREZWZhdWx0VGV4dCkpO1xuICAgIHZhciAkaW5wdXRCdG4gPSAkKFwiPGlucHV0IGNsYXNzPSdub3JtYWxidXR0b24tdjEnIHN0eWxlPSdtYXJnaW4tbGVmdDogNHB4OycgdHlwZT0nYnV0dG9uJyB2YWx1ZT0nLi4uJy8+XCIpO1xuICAgICRlbGVtLmFwcGVuZCgkaW5wdXRUeHQpLmFwcGVuZCgkaW5wdXRCdG4pO1xuICAgIHdpbmRvdy4kVGVtcCRJbnB1dHR4dCA9ICRpbnB1dFR4dDtcbiAgICAkaW5wdXRCdG4uY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHdpbmRvdy50YWJsZURlc2lvbikge1xuICAgICAgICB0YWJsZURlc2lvbi5zZWxlY3REZWZhdWx0VmFsdWVEaWFsb2dCZWdpbihFZGl0VGFibGVfU2VsZWN0RGVmYXVsdFZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5wYXJlbnQubGlzdERlc2lnbi5zZWxlY3REZWZhdWx0VmFsdWVEaWFsb2dCZWdpbih3aW5kb3csIG51bGwpO1xuICAgICAgICB3aW5kb3cuX1NlbGVjdEJpbmRPYmogPSB7XG4gICAgICAgICAgc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZTogZnVuY3Rpb24gc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZShyZXN1bHQpIHtcbiAgICAgICAgICAgIEVkaXRUYWJsZV9TZWxlY3REZWZhdWx0VmFsdWUuc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZShyZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyICRpbnB1dFR4dCA9IGVkaXRTdGF1c0h0bWxFbGVtLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIik7XG5cbiAgICBpZiAoJGlucHV0VHh0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBkZWZhdWx0VHlwZSA9ICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VHlwZVwiKTtcbiAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFZhbHVlXCIpO1xuICAgICAgdmFyIGRlZmF1bHRUZXh0ID0gJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUZXh0XCIpO1xuICAgICAgdmFyICRlbGVtID0gJChcIjxkaXY+PC9kaXY+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsPlwiICsgRGVmYXVsdFZhbHVlVXRpbGl0eS5mb3JtYXRUZXh0KGRlZmF1bHRUeXBlLCBkZWZhdWx0VGV4dCkgKyBcIjwvbGFiZWw+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nZmllbGREZWZhdWx0VHlwZScgVmFsdWU9J1wiICsgZGVmYXVsdFR5cGUgKyBcIicgc3R5bGU9J2Rpc3BsYXk6bm9uZScvPlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J2ZpZWxkRGVmYXVsdFRleHQnIFZhbHVlPSdcIiArIGRlZmF1bHRUZXh0ICsgXCInIHN0eWxlPSdkaXNwbGF5Om5vbmUnLz5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdmaWVsZERlZmF1bHRWYWx1ZScgVmFsdWU9J1wiICsgZGVmYXVsdFZhbHVlICsgXCInIHN0eWxlPSdkaXNwbGF5Om5vbmUnLz5cIik7XG4gICAgICByZXR1cm4gJGVsZW07XG4gICAgfVxuXG4gICAgcmV0dXJuICQoXCI8bGFiZWw+PC9sYWJlbD5cIik7XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfSxcbiAgc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZTogZnVuY3Rpb24gc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZShkZWZhdWx0RGF0YSkge1xuICAgIHZhciAkaW5wdXRUeHQgPSB3aW5kb3cuJFRlbXAkSW5wdXR0eHQ7XG5cbiAgICBpZiAobnVsbCAhPSBkZWZhdWx0RGF0YSkge1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUeXBlXCIsIGRlZmF1bHREYXRhLlR5cGUpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRWYWx1ZVwiLCBkZWZhdWx0RGF0YS5WYWx1ZSk7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFRleHRcIiwgZGVmYXVsdERhdGEuVGV4dCk7XG4gICAgICAkaW5wdXRUeHQudmFsKERlZmF1bHRWYWx1ZVV0aWxpdHkuZm9ybWF0VGV4dChkZWZhdWx0RGF0YS5UeXBlLCBkZWZhdWx0RGF0YS5UZXh0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VHlwZVwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VmFsdWVcIiwgXCJcIik7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFRleHRcIiwgXCJcIik7XG4gICAgICAkaW5wdXRUeHQudmFsKFwiXCIpO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9TZWxlY3RGaWVsZFR5cGVEYXRhTG9hZGVyID0ge1xuICBfZmllbGREYXRhVHlwZUFycmF5OiBudWxsLFxuICBHZXRGaWVsZERhdGFUeXBlQXJyYXk6IGZ1bmN0aW9uIEdldEZpZWxkRGF0YVR5cGVBcnJheSgpIHtcbiAgICBpZiAodGhpcy5fZmllbGREYXRhVHlwZUFycmF5ID09IG51bGwpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3RTeW5jKFwiL1Jlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZUZpZWxkVHlwZVwiLCB7fSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIGxpc3QgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24oZGF0YS5kYXRhKTtcblxuICAgICAgICAgIGlmIChsaXN0ICE9IG51bGwgJiYgbGlzdCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIF9zZWxmLl9maWVsZERhdGFUeXBlQXJyYXkgPSBsaXN0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgXCJBbGVydExvYWRpbmdRdWVyeUVycm9yXCIsIHt9LCBcIuWKoOi9veWtl+auteexu+Wei+Wksei0pe+8gVwiLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2ZpZWxkRGF0YVR5cGVBcnJheTtcbiAgfSxcbiAgR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VmFsdWU6IGZ1bmN0aW9uIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVZhbHVlKFZhbHVlKSB7XG4gICAgdmFyIGFycmF5RGF0YSA9IHRoaXMuR2V0RmllbGREYXRhVHlwZUFycmF5KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9iaiA9IGFycmF5RGF0YVtpXTtcblxuICAgICAgaWYgKG9iai5WYWx1ZSA9PSBWYWx1ZSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFsZXJ0KFwi5om+5LiN5Yiw5oyH5a6a55qE5pWw5o2u57G75Z6L77yM6K+356Gu6K6k5piv5ZCm5pSv5oyB6K+l57G75Z6L77yBXCIpO1xuICB9LFxuICBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlUZXh0OiBmdW5jdGlvbiBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlUZXh0KHRleHQpIHtcbiAgICB2YXIgYXJyYXlEYXRhID0gdGhpcy5HZXRGaWVsZERhdGFUeXBlQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2JqID0gYXJyYXlEYXRhW2ldO1xuXG4gICAgICBpZiAob2JqLlRleHQgPT0gdGV4dCkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFsZXJ0KFwi5om+5LiN5Yiw5oyH5a6a55qE5pWw5o2u57G75Z6L77yM6K+356Gu6K6k5piv5ZCm5pSv5oyB6K+l57G75Z6L77yBXCIpO1xuICB9XG59O1xudmFyIEVkaXRUYWJsZV9TZWxlY3RGaWVsZFR5cGUgPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPHNlbGVjdCAvPlwiKTtcblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERhdGFUeXBlXCJdO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0uYXR0cihcIlZhbHVlXCIpO1xuICAgIH1cblxuICAgIHZhciBfZmllbGREYXRhVHlwZUFycmF5ID0gRWRpdFRhYmxlX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIuR2V0RmllbGREYXRhVHlwZUFycmF5KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9maWVsZERhdGFUeXBlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IF9maWVsZERhdGFUeXBlQXJyYXlbaV0uVmFsdWU7XG4gICAgICB2YXIgdGV4dCA9IF9maWVsZERhdGFUeXBlQXJyYXlbaV0uVGV4dDtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9J1wiICsgdmFsdWUgKyBcIic+XCIgKyB0ZXh0ICsgXCI8L29wdGlvbj5cIik7XG4gICAgfVxuXG4gICAgaWYgKHZhbCAhPSBcIlwiKSB7XG4gICAgICAkZWxlbS52YWwodmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGVsZW0udmFsKEVkaXRUYWJsZV9TZWxlY3RGaWVsZFR5cGVEYXRhTG9hZGVyLkdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVRleHQoXCLlrZfnrKbkuLJcIikuVmFsdWUpO1xuICAgIH1cblxuICAgICRlbGVtLmNoYW5nZShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsID0gJCh0aGlzKS52YWwoKTtcblxuICAgICAgaWYgKHZhbCA9PSBcIuaVtOaVsFwiKSB7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgwKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMCk7XG4gICAgICB9IGVsc2UgaWYgKHZhbCA9PSBcIuWwj+aVsFwiKSB7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIGZhbHNlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMTApO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMik7XG4gICAgICB9IGVsc2UgaWYgKHZhbCA9PSBcIuaXpeacn+aXtumXtFwiKSB7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgyMCk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDApO1xuICAgICAgfSBlbHNlIGlmICh2YWwgPT0gXCLlrZfnrKbkuLJcIikge1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDUwKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMCk7XG4gICAgICB9IGVsc2UgaWYgKHZhbCA9PSBcIumVv+Wtl+espuS4slwiKSB7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgwKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWx1ZSA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHZhciB0ZXh0ID0gRWRpdFRhYmxlX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIuR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VmFsdWUodmFsdWUpLlRleHQ7XG4gICAgdmFyICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9J1wiICsgdmFsdWUgKyBcIic+XCIgKyB0ZXh0ICsgXCI8L2xhYmVsPlwiKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfVxufTsiXX0=
