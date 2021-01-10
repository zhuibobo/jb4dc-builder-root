"use strict";

var ControlStatusUtility = {
  DisableAtUpdateStatus: function DisableAtUpdateStatus(webFormRTParas, controlId) {
    if (webFormRTParas.OperationType == BaseUtility.GetUpdateOperationName()) {
      $("#" + controlId).attr("disabled", "disabled");
    }
  }
};
"use strict";

var DataValidateUtility = {
  testBuildCodeError: function testBuildCodeError($elem) {
    var code = $elem.val();

    if (code.length != 18) {
      return {
        $elem: $elem,
        errors: ["建筑物编码长度必须为18位!"],
        labName: "编码错误"
      };
    }

    return null;
  },
  testHouseCodeError: function testHouseCodeError($elem) {
    var code = $elem.val();

    if (code.length != 5) {
      return {
        $elem: $elem,
        errors: ["房屋编码长度必须为5位!"],
        labName: "编码错误"
      };
    }

    return null;
  }
};
"use strict";

var EChartsUtility = {
  FetchDataOrganFilter: function FetchDataOrganFilter(url, streetValue, communityValue, gridValue, func, caller) {
    AjaxUtility.Get(url, {
      streetValue: streetValue,
      communityValue: communityValue,
      gridValue: gridValue
    }, function (result) {
      if (result.success) {
        func(result);
      }
    }, caller);
  },
  BuildNormalPieOption: function BuildNormalPieOption(dataList, seriesName, title, radius) {
    var legendConfig = {
      orient: 'vertical',
      left: 'left',
      data: []
    };
    var seriesDataConfig = [];
    var subTitle = "";
    var valueCount = 0;

    for (var i = 0; i < dataList.length; i++) {
      legendConfig.data.push(dataList[i].NAME);
      seriesDataConfig.push({
        value: dataList[i].VALUE,
        name: dataList[i].NAME
      });
      valueCount += parseFloat(dataList[i].VALUE);
    }

    subTitle = "总数:" + valueCount;

    if (!radius) {
      radius = '60%';
    }

    var seriesConfig = [{
      name: seriesName,
      type: 'pie',
      radius: radius,
      center: ['50%', '60%'],
      data: seriesDataConfig,
      label: {
        show: true,
        formatter: '{b}: {c}',
        alignTo: 'labelLine'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }];
    var option = {
      title: {
        text: title,
        subtext: subTitle,
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: legendConfig,
      series: seriesConfig
    };
    return option;
  },
  BuildNormalBarOption: function BuildNormalBarOption(dataList, seriesName, title) {
    var xAxisConfig = {
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true,
        interval: 0
      },
      axisLabel: {
        interval: 0
      }
    };
    var seriesDataConfig = [];
    var subTitle = "";
    var valueCount = 0;

    for (var i = 0; i < dataList.length; i++) {
      xAxisConfig.data.push(dataList[i].NAME);
      seriesDataConfig.push({
        value: dataList[i].VALUE,
        name: dataList[i].NAME
      });
      valueCount += parseFloat(dataList[i].VALUE);
    }

    subTitle = "总数:" + valueCount;
    var seriesConfig = [{
      name: seriesName,
      type: 'bar',
      data: seriesDataConfig,
      label: {
        show: true,
        formatter: '{c}',
        alignTo: 'labelLine'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }];
    var option = {
      title: {
        text: title,
        subtext: subTitle,
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'
      },
      grid: {
        left: "6%",
        right: "6%",
        bottom: 20
      },
      xAxis: [xAxisConfig],
      yAxis: [{
        type: 'value'
      }],
      series: seriesConfig
    };
    return option;
  }
};
"use strict";

var EventUtility = {
  EventTypeChangeEvent: function EventTypeChangeEvent() {
    var type1_1_2_group_key = "409a1bbf-9c53-4ec9-8d77-8f5df6b2e8fa";
    var type1_2_2_group_key = "7e36a208-2927-4ad0-892b-0403c6e1b3d8";
    var type1Value = $("#radio_group_event_type_1").val();

    if (type1Value == "矛盾纠纷") {} else if (type1Value == "问题隐患") {}

    $("#radio_group_event_type_1").change();
  }
};
"use strict";

var Organ3DDL = {
  _prop: {
    mySessionData: null,
    myGridData: null,
    myCommunityData: null,
    myStreetData: null,
    allOrganMinProp: null,
    operationName: "",
    ddlStreetControl: null,
    oldDDLStreetControlValue: "",
    ddlCommunityControl: null,
    oldDDLCommunityControlValue: "",
    ddlGridControl: null,
    oldDDLGridControlValue: "",
    changeEnable: true,
    initEndFunc: null
  },
  GetOrganData: function GetOrganData(endFunc) {
    AjaxUtility.Get("/Rest/Grid/SSOProxy/OrganAndUser/GetALLOrganMinPropData", {}, function (result) {
      if (result.success) {
        console.log(result);
        this._prop.mySessionData = result.data.MySessionData;
        var myOrganId = result.data.MySessionData.organId;
        this._prop.allOrganMinProp = result.data.ALLOrganMinProp;
        var myOrganData = ArrayUtility.WhereSingle(this._prop.allOrganMinProp, function (item) {
          return item.organId == myOrganId;
        });

        if (myOrganData.organTypeValue == "GridUnit") {
          this._prop.myGridData = myOrganData;
          var parentOrganId = myOrganData.organParentId;
          this._prop.myCommunityData = ArrayUtility.WhereSingle(this._prop.allOrganMinProp, function (item) {
            return item.organId == parentOrganId;
          });
          parentOrganId = this._prop.myCommunityData.organParentId;
          this._prop.myStreetData = ArrayUtility.WhereSingle(this._prop.allOrganMinProp, function (item) {
            return item.organId == parentOrganId;
          });
        } else if (myOrganData.organTypeValue == "Community") {
          this._prop.myCommunityData = myOrganData;
          var parentOrganId = this._prop.myCommunityData.organParentId;
          this._prop.myStreetData = ArrayUtility.WhereSingle(this._prop.allOrganMinProp, function (item) {
            return item.organId == parentOrganId;
          });
        } else if (myOrganData.organTypeValue == "Street") {
          this._prop.myStreetData = myOrganData;
        }

        endFunc.call(this, result.data);
      }
    }, this);
  },
  Init3DDL: function Init3DDL(ddlStreetControlId, ddlCommunityControlId, ddlGridControlId, operationName, changeEnable, initEndFunc) {
    this._prop.operationName = operationName;
    this._prop.ddlStreetControl = $("#" + ddlStreetControlId);
    this._prop.oldDDLStreetControlValue = this._prop.ddlStreetControl.attr("control_value");
    this._prop.ddlCommunityControl = $("#" + ddlCommunityControlId);
    this._prop.oldDDLCommunityControlValue = this._prop.ddlCommunityControl.attr("control_value");
    this._prop.ddlGridControl = $("#" + ddlGridControlId);
    this._prop.oldDDLGridControlValue = this._prop.ddlGridControl.attr("control_value");
    this._prop.changeEnable = changeEnable;
    this._prop.initEndFunc = initEndFunc;
    this.GetOrganData(function (result) {
      if (operationName == BaseUtility.GetViewOperationName()) {
        var _this = this;

        var streetData = ArrayUtility.WhereSingle(this._prop.allOrganMinProp, function (item) {
          return item.organId == _this._prop.oldDDLStreetControlValue;
        });
        var communityData = ArrayUtility.WhereSingle(this._prop.allOrganMinProp, function (item) {
          return item.organId == _this._prop.oldDDLCommunityControlValue;
        });
        var gridData = ArrayUtility.WhereSingle(this._prop.allOrganMinProp, function (item) {
          return item.organId == _this._prop.oldDDLGridControlValue;
        });

        this._prop.ddlStreetControl.text(streetData.organName);

        this._prop.ddlCommunityControl.text(communityData.organName);

        this._prop.ddlGridControl.text(gridData.organName);
      } else {
        this.Bind3DDL();
      }

      if (typeof this._prop.initEndFunc == "function") {
        this._prop.initEndFunc();
      }
    });

    if (!this._prop.changeEnable) {
      this._prop.ddlStreetControl.attr("disabled", "disabled");

      this._prop.ddlCommunityControl.attr("disabled", "disabled");

      this._prop.ddlGridControl.attr("disabled", "disabled");
    }
  },
  Bind3DDL: function Bind3DDL() {
    var _this = this;

    var streetDataList = ArrayUtility.Where(this._prop.allOrganMinProp, function (item) {
      return item.organTypeValue == "Street";
    });
    this.BindSingleDDL(this._prop.ddlStreetControl, streetDataList);
    var selectedStreetValue = this.TryAutoSetStreet();

    this._prop.ddlStreetControl.change(function () {
      var newSelectedStreetValue = $(this).val();

      _this.StreetControlChange(newSelectedStreetValue);
    });

    var communityDataList = ArrayUtility.Where(this._prop.allOrganMinProp, function (item) {
      return item.organParentId == selectedStreetValue;
    });
    this.BindSingleDDL(this._prop.ddlCommunityControl, communityDataList);
    var selectedCommunityValue = this.TryAutoSetCommunity();

    this._prop.ddlCommunityControl.change(function () {
      var newSelectedCommunityValue = $(this).val();

      _this.CommunityControlChange(newSelectedCommunityValue);
    });

    var gridDataList = ArrayUtility.Where(this._prop.allOrganMinProp, function (item) {
      return item.organParentId == selectedCommunityValue;
    });
    this.BindSingleDDL(this._prop.ddlGridControl, gridDataList);
    this.TryAutoSetGrid();
  },
  TryAutoSetStreet: function TryAutoSetStreet() {
    var selectedValue = this._prop.oldDDLStreetControlValue;

    if (!selectedValue && this._prop.myStreetData) {
      selectedValue = this._prop.myStreetData.organId;
    }

    if (selectedValue) {
      this._prop.ddlStreetControl.val(selectedValue);

      return selectedValue;
    }

    return this._prop.ddlStreetControl.val();
  },
  TryAutoSetCommunity: function TryAutoSetCommunity() {
    var selectedValue = this._prop.oldDDLCommunityControlValue;

    if (!selectedValue && this._prop.myCommunityData) {
      selectedValue = this._prop.myCommunityData.organId;
    }

    if (selectedValue) {
      this._prop.ddlCommunityControl.val(selectedValue);

      return selectedValue;
    }

    return this._prop.ddlCommunityControl.val();
  },
  TryAutoSetGrid: function TryAutoSetGrid() {
    var selectedValue = this._prop.oldDDLGridControlValue;

    if (!selectedValue && this._prop.myGridData) {
      selectedValue = this._prop.myGridData.organId;
    }

    if (selectedValue) {
      this._prop.ddlGridControl.val(selectedValue);

      return selectedValue;
    }

    return this._prop.ddlGridControl.val();
  },
  BindSingleDDL: function BindSingleDDL(ddlControl, organDataList) {
    ddlControl.html("");
    ddlControl.append("<option value=' '>--请选择--</option>");

    for (var i = 0; i < organDataList.length; i++) {
      var organData = organDataList[i];
      var sel = "<option value='" + organData.organId + "'>" + organData.organName + "</option>";
      ddlControl.append(sel);
    }
  },
  StreetControlChange: function StreetControlChange(newSelectedStreetValue) {
    var communityDataList = ArrayUtility.Where(this._prop.allOrganMinProp, function (item) {
      return item.organParentId == newSelectedStreetValue;
    });
    this.BindSingleDDL(this._prop.ddlCommunityControl, communityDataList);

    this._prop.ddlGridControl.html("");

    this._prop.ddlGridControl.append("<option value=' '>--请选择--</option>");
  },
  CommunityControlChange: function CommunityControlChange(newSelectedCommunityValue) {
    var gridDataList = ArrayUtility.Where(this._prop.allOrganMinProp, function (item) {
      return item.organParentId == newSelectedCommunityValue;
    });
    this.BindSingleDDL(this._prop.ddlGridControl, gridDataList);
  }
};
"use strict";

if ($("#viewHouseAndPersonWrap").length > 0) {
  var ViewHouseAndPersonWrap = new Vue({
    el: "#viewHouseAndPersonWrap",
    mounted: function mounted() {
      var windowHeight = BaseUtility.GetUrlParaValue("windowHeight");
      var buildId = BaseUtility.GetUrlParaValue("recordId");
      $("#viewHouseAndPersonWrap").height(windowHeight - 200);
      this.listHeight = windowHeight - 260;
      this.loadHouseData(buildId);
    },
    data: {
      acInterface: {
        getHouseByBuildId: "/Rest/Grid/Build/HouseInfo/GetHouseByBuildId",
        editHouseView: "/HTML/Builder/Runtime/WebFormIndependenceRuntime.html",
        editHouseFormId: "ccfdac63-d9d7-4a67-ad9f-747e88a48f5d",
        deleteHouse: "/Rest/Grid/Build/HouseInfo/Delete",
        editPersonView: "/HTML/Builder/Runtime/WebFormIndependenceRuntime.html",
        editFamilyFormId: "1488ee50-efb6-409a-afc7-eb0f9710713f",
        editPersonFormId: "5d6de388-ce1e-43c7-b592-c9e80b71435c",
        getPersonByHouseId: "/Rest/Grid/Person/PersonMain/GetPersonByHouseId",
        deletePerson: "/Rest/Grid/Person/PersonMain/DeletePersonWithFamily",
        editEnterpriseView: "/HTML/Builder/Runtime/WebFormIndependenceRuntime.html",
        editEnterpriseFormId: "9e0e258a-639a-4209-83bf-607000de0f77",
        getEnterpriseByHouseId: "/Rest/Grid/Enterprise/EnterpriseMain/GetEnterpriseByHouseId",
        deleteEnterprise: "/Rest/Grid/Enterprise/EnterpriseMain/Delete"
      },
      listHeight: 100,
      house: {
        selectedHouse: null,
        columnsConfig: [{
          title: '房屋编码',
          key: 'houseCodeFull',
          align: "left"
        }, {
          title: '房号',
          key: 'houseNumName',
          align: "center",
          width: 120
        }, {
          title: '使用情况',
          key: 'houseUsedDesc',
          align: "center"
        }, {
          title: '操作',
          key: 'houseId',
          width: 80,
          align: "center",
          render: function render(h, params) {
            var buttons = [];
            buttons.push(h('Tooltip', {
              props: {
                content: "查看"
              }
            }, [h('div', {
              "class": "list-row-button view",
              on: {
                click: function click() {
                  ViewHouseAndPersonWrap.viewHouse(params);
                }
              }
            })]));
            var eh = h('div', {
              "class": "list-row-button-wrap"
            }, buttons);
            return eh;
          }
        }],
        tableData: [],
        searchHouseText: ""
      },
      person: {
        columnsConfig: [{
          title: '人员',
          key: 'displayText',
          align: "left",
          width: 120
        }, {
          title: '身份证号',
          key: 'personIdCard',
          align: "left"
        }, {
          title: '联系电话',
          key: 'personPhone',
          align: "left",
          width: 140
        }, {
          title: '操作',
          key: 'personId',
          width: 140,
          align: "center",
          render: function render(h, params) {
            var buttons = [];
            buttons.push(h('Tooltip', {
              props: {
                content: "查看"
              }
            }, [h('div', {
              "class": "list-row-button view",
              on: {
                click: function click() {
                  ViewHouseAndPersonWrap.viewPerson(params);
                }
              }
            })]));
            var eh = h('div', {
              "class": "list-row-button-wrap"
            }, buttons);
            return eh;
          }
        }],
        tableData: []
      },
      enterprise: {
        columnsConfig: [{
          title: '企业(门店名称)',
          key: 'entName',
          align: "left"
        }, {
          title: '操作',
          key: 'entId',
          width: 140,
          align: "center",
          render: function render(h, params) {
            var buttons = [];
            buttons.push(h('Tooltip', {
              props: {
                content: "查看"
              }
            }, [h('div', {
              "class": "list-row-button view",
              on: {
                click: function click() {
                  gridManager.viewEnterprise(params);
                }
              }
            })]));
            buttons.push(h('Tooltip', {
              props: {
                content: "修改"
              }
            }, [h('div', {
              "class": "list-row-button edit",
              on: {
                click: function click() {
                  gridManager.editEnterprise(params);
                }
              }
            })]));
            buttons.push(h('Tooltip', {
              props: {
                content: "删除"
              }
            }, [h('div', {
              "class": "list-row-button del",
              on: {
                click: function click() {
                  gridManager.delEnterprise(params);
                }
              }
            })]));
            var eh = h('div', {
              "class": "list-row-button-wrap"
            }, buttons);
            return eh;
          }
        }],
        tableData: []
      }
    },
    methods: {
      getFormPara: function getFormPara(formId, opName, recordId, menuRightUrlPara, endFunc) {
        var para = {
          "formId": formId,
          "buttonId": "",
          "listFormButtonElemId": "",
          "recordId": recordId,
          "operationType": opName,
          "windowWidth": 1300,
          "windowHeight": 880,
          "menuRightUrlPara": menuRightUrlPara,
          "devOperationEndFunc": endFunc,
          "menuRightUrlParaJson": ""
        };

        if (PageStyleUtility.GetPageHeight() < 500) {
          para.windowHeight = 600;
        }

        return para;
      },
      getFormDialogPara: function getFormDialogPara(title) {
        var para = {
          "width": 1300,
          "height": 880,
          "title": title
        };

        if (PageStyleUtility.GetPageHeight() < 500) {
          para.height = 600;
        }

        return para;
      },
      selectionHouseChange: function selectionHouseChange(row, index) {
        console.log(row);
        this.house.selectedHouse = row;
        this.loadPersonData();
        this.loadEnterpriseData();
      },
      loadHouseData: function loadHouseData(buildId) {
        AjaxUtility.Get(this.acInterface.getHouseByBuildId, {
          buildId: buildId
        }, function (result) {
          console.log(result);

          if (result.success) {
            this.house.tableData = result.data;
          }
        }, this);
      },
      searchHouse: function searchHouse() {
        var text = this.house.searchHouseText;

        if (this.house.sourceTableData) {
          this.house.tableData = this.house.sourceTableData;
        }

        if (this.house.tableData.length > 0 && StringUtility.IsNotNullOrEmpty(text)) {
          this.house.sourceTableData = this.house.tableData;
          this.house.tableData = ArrayUtility.Where(this.house.tableData, function (item) {
            if (item.houseCode.indexOf(text) >= 0 || item.houseNumName.indexOf(text) >= 0) {
              return true;
            }
          });
        }
      },
      addHouse: function addHouse() {
        var selectedBuild = this.buildTree.treeSelectedNode;

        if (selectedBuild == null) {
          DialogUtility.AlertText("请先选择建筑物!");
          return;
        }

        var menuRightUrlPara = [{
          "ActionType": "BindToField",
          "FieldName": "HOUSE_BUILD_ID",
          "Value": selectedBuild.buildId
        }];
        var formPara = this.getFormPara(this.acInterface.editHouseFormId, BaseUtility.GetAddOperationName(), "", JsonUtility.JsonToString(menuRightUrlPara), "reLoadHouse");
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView(this.acInterface.editBuildView, formPara), this.getFormDialogPara("房屋登记"), 1, true);
      },
      viewHouse: function viewHouse(para) {
        var houseId = para.row.houseId;
        var formPara = this.getFormPara(this.acInterface.editHouseFormId, BaseUtility.GetViewOperationName(), houseId, "", "reLoadHouse");
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId03, BaseUtility.BuildView(this.acInterface.editHouseView, formPara), this.getFormDialogPara("房屋登记"), 1, true);
      },
      editHouse: function editHouse(para) {
        var houseId = para.row.houseId;
        var formPara = this.getFormPara(this.acInterface.editHouseFormId, BaseUtility.GetUpdateOperationName(), houseId, "", "reLoadHouse");
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView(this.acInterface.editBuildView, formPara), this.getFormDialogPara("房屋登记"), 1, true);
      },
      delHouse: function delHouse(para) {
        var houseId = para.row.houseId;
        DialogUtility.Confirm(window, "确认要删除当前房屋吗？", function () {
          AjaxUtility.Delete(this.acInterface.deleteHouse, {
            recordId: houseId
          }, function (result) {
            if (result.success) {
              DialogUtility.AlertText(result.message);
              this.loadHouseData(this.buildTree.treeSelectedNode.buildId);
            }
          }, this);
        }, this);
      },
      selectionPersonChange: function selectionPersonChange() {},
      loadPersonData: function loadPersonData() {
        var houseId = this.house.selectedHouse.houseId;
        AjaxUtility.Get(this.acInterface.getPersonByHouseId, {
          houseId: houseId
        }, function (result) {
          console.log(result);

          if (result.success) {
            for (var i = 0; i < result.data.length; i++) {
              result.data[i].displayText = result.data[i].personName;

              if (result.data[i].personRelationship == "0") {
                result.data[i].displayText = "[户主]" + result.data[i].displayText;
              } else {
                result.data[i].displayText = "[成员]" + result.data[i].displayText;
              }
            }

            this.person.tableData = result.data;
          }
        }, this);
      },
      addFamily: function addFamily() {
        var selectedHouse = this.house.selectedHouse;

        if (selectedHouse == null) {
          DialogUtility.AlertText("请先选择房屋!");
          return;
        }

        var menuRightUrlPara = [{
          "ActionType": "BindToField",
          "FieldName": "FAMILY_HOUSE_ID",
          "Value": selectedHouse.houseId
        }, {
          "ActionType": "BindToField",
          "FieldName": "FAMILY_HOUSE_CODE_FULL",
          "Value": selectedHouse.houseCodeFull
        }];
        var formPara = this.getFormPara(this.acInterface.editFamilyFormId, BaseUtility.GetAddOperationName(), "", JsonUtility.JsonToString(menuRightUrlPara), "reLoadPerson");
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView(this.acInterface.editBuildView, formPara), this.getFormDialogPara("户登记"), 1, true);
      },
      delPerson: function delPerson(para) {
        var personId = para.row.personId;
        DialogUtility.Confirm(window, "确认要删除当前人员吗？<br />1:需要先删除户中的其他成员,才可以删除户主.<br />2删除户主时,将同时删除该户的信息.", function () {
          AjaxUtility.Delete(this.acInterface.deletePerson, {
            personId: personId
          }, function (result) {
            if (result.success) {
              DialogUtility.AlertText(result.message);
              this.loadPersonData();
            }
          }, this);
        }, this);
      },
      editPerson: function editPerson(para) {
        var personId = para.row.personId;
        var formPara = this.getFormPara(this.acInterface.editPersonFormId, BaseUtility.GetUpdateOperationName(), personId, "", "reLoadPerson");
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView(this.acInterface.editBuildView, formPara), this.getFormDialogPara("人员信息维护"), 1, true);
      },
      editFamily: function editFamily(para) {
        var personFamilyId = para.row.personFamilyId;
        var formPara = this.getFormPara(this.acInterface.editFamilyFormId, BaseUtility.GetUpdateOperationName(), personFamilyId, "", "reLoadPerson");
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView(this.acInterface.editBuildView, formPara), this.getFormDialogPara("户登记"), 1, true);
      },
      viewPerson: function viewPerson(para) {
        var personId = para.row.personId;
        var formPara = this.getFormPara(this.acInterface.editPersonFormId, BaseUtility.GetViewOperationName(), personId, "", "reLoadPerson");
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId03, BaseUtility.BuildView(this.acInterface.editPersonView, formPara), this.getFormDialogPara("人员信息查看"), 1, true);
      },
      addEnterprise: function addEnterprise() {
        var selectedHouse = this.house.selectedHouse;

        if (selectedHouse == null) {
          DialogUtility.AlertText("请先选择房屋!");
          return;
        }

        var menuRightUrlPara = [{
          "ActionType": "BindToField",
          "FieldName": "ENT_HOUSE_ID",
          "Value": selectedHouse.houseId
        }, {
          "ActionType": "BindToField",
          "FieldName": "ENT_HOUSE_CODE",
          "Value": selectedHouse.houseCodeFull
        }];
        var formPara = this.getFormPara(this.acInterface.editEnterpriseFormId, BaseUtility.GetAddOperationName(), "", JsonUtility.JsonToString(menuRightUrlPara), "reLoadEnterprise");
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView(this.acInterface.editBuildView, formPara), this.getFormDialogPara("企业法人登记"), 1, true);
      },
      loadEnterpriseData: function loadEnterpriseData() {
        var houseId = this.house.selectedHouse.houseId;
        AjaxUtility.Get(this.acInterface.getEnterpriseByHouseId, {
          houseId: houseId
        }, function (result) {
          console.log(result);

          if (result.success) {
            this.enterprise.tableData = result.data;
          }
        }, this);
      },
      viewEnterprise: function viewEnterprise(para) {
        var entId = para.row.entId;
        var formPara = this.getFormPara(this.acInterface.editEnterpriseFormId, BaseUtility.GetViewOperationName(), entId, "", "reLoadEnterprise");
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView(this.acInterface.editBuildView, formPara), this.getFormDialogPara("企业法人查看"), 1, true);
      },
      editEnterprise: function editEnterprise(para) {
        var entId = para.row.entId;
        var formPara = this.getFormPara(this.acInterface.editEnterpriseFormId, BaseUtility.GetUpdateOperationName(), entId, "", "reLoadEnterprise");
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView(this.acInterface.editBuildView, formPara), this.getFormDialogPara("企业法人登记"), 1, true);
      },
      delEnterprise: function delEnterprise(para) {
        var entId = para.row.entId;
        DialogUtility.Confirm(window, "确认要删除当前企业吗？", function () {
          AjaxUtility.Delete(this.acInterface.deleteEnterprise, {
            recordId: entId
          }, function (result) {
            if (result.success) {
              DialogUtility.AlertText(result.message);
              this.loadEnterpriseData();
            }
          }, this);
        }, this);
      }
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRyb2xTdGF0dXNVdGlsaXR5LmpzIiwiRGF0YVZhbGlkYXRlVXRpbGl0eS5qcyIsIkVDaGFydHNVdGlsaXR5LmpzIiwiRXZlbnRVdGlsaXR5LmpzIiwiT3JnYW4zRERMLmpzIiwiVmlld0hvdXNlQW5kUGVyc29uV3JhcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IkdyaWRVdGlsaXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDb250cm9sU3RhdHVzVXRpbGl0eSA9IHtcbiAgRGlzYWJsZUF0VXBkYXRlU3RhdHVzOiBmdW5jdGlvbiBEaXNhYmxlQXRVcGRhdGVTdGF0dXMod2ViRm9ybVJUUGFyYXMsIGNvbnRyb2xJZCkge1xuICAgIGlmICh3ZWJGb3JtUlRQYXJhcy5PcGVyYXRpb25UeXBlID09IEJhc2VVdGlsaXR5LkdldFVwZGF0ZU9wZXJhdGlvbk5hbWUoKSkge1xuICAgICAgJChcIiNcIiArIGNvbnRyb2xJZCkuYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGF0YVZhbGlkYXRlVXRpbGl0eSA9IHtcbiAgdGVzdEJ1aWxkQ29kZUVycm9yOiBmdW5jdGlvbiB0ZXN0QnVpbGRDb2RlRXJyb3IoJGVsZW0pIHtcbiAgICB2YXIgY29kZSA9ICRlbGVtLnZhbCgpO1xuXG4gICAgaWYgKGNvZGUubGVuZ3RoICE9IDE4KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAkZWxlbTogJGVsZW0sXG4gICAgICAgIGVycm9yczogW1wi5bu6562R54mp57yW56CB6ZW/5bqm5b+F6aG75Li6MTjkvY0hXCJdLFxuICAgICAgICBsYWJOYW1lOiBcIue8lueggemUmeivr1wiXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9LFxuICB0ZXN0SG91c2VDb2RlRXJyb3I6IGZ1bmN0aW9uIHRlc3RIb3VzZUNvZGVFcnJvcigkZWxlbSkge1xuICAgIHZhciBjb2RlID0gJGVsZW0udmFsKCk7XG5cbiAgICBpZiAoY29kZS5sZW5ndGggIT0gNSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJGVsZW06ICRlbGVtLFxuICAgICAgICBlcnJvcnM6IFtcIuaIv+Wxi+e8lueggemVv+W6puW/hemhu+S4ujXkvY0hXCJdLFxuICAgICAgICBsYWJOYW1lOiBcIue8lueggemUmeivr1wiXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRUNoYXJ0c1V0aWxpdHkgPSB7XG4gIEZldGNoRGF0YU9yZ2FuRmlsdGVyOiBmdW5jdGlvbiBGZXRjaERhdGFPcmdhbkZpbHRlcih1cmwsIHN0cmVldFZhbHVlLCBjb21tdW5pdHlWYWx1ZSwgZ3JpZFZhbHVlLCBmdW5jLCBjYWxsZXIpIHtcbiAgICBBamF4VXRpbGl0eS5HZXQodXJsLCB7XG4gICAgICBzdHJlZXRWYWx1ZTogc3RyZWV0VmFsdWUsXG4gICAgICBjb21tdW5pdHlWYWx1ZTogY29tbXVuaXR5VmFsdWUsXG4gICAgICBncmlkVmFsdWU6IGdyaWRWYWx1ZVxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBmdW5jKHJlc3VsdCk7XG4gICAgICB9XG4gICAgfSwgY2FsbGVyKTtcbiAgfSxcbiAgQnVpbGROb3JtYWxQaWVPcHRpb246IGZ1bmN0aW9uIEJ1aWxkTm9ybWFsUGllT3B0aW9uKGRhdGFMaXN0LCBzZXJpZXNOYW1lLCB0aXRsZSwgcmFkaXVzKSB7XG4gICAgdmFyIGxlZ2VuZENvbmZpZyA9IHtcbiAgICAgIG9yaWVudDogJ3ZlcnRpY2FsJyxcbiAgICAgIGxlZnQ6ICdsZWZ0JyxcbiAgICAgIGRhdGE6IFtdXG4gICAgfTtcbiAgICB2YXIgc2VyaWVzRGF0YUNvbmZpZyA9IFtdO1xuICAgIHZhciBzdWJUaXRsZSA9IFwiXCI7XG4gICAgdmFyIHZhbHVlQ291bnQgPSAwO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgbGVnZW5kQ29uZmlnLmRhdGEucHVzaChkYXRhTGlzdFtpXS5OQU1FKTtcbiAgICAgIHNlcmllc0RhdGFDb25maWcucHVzaCh7XG4gICAgICAgIHZhbHVlOiBkYXRhTGlzdFtpXS5WQUxVRSxcbiAgICAgICAgbmFtZTogZGF0YUxpc3RbaV0uTkFNRVxuICAgICAgfSk7XG4gICAgICB2YWx1ZUNvdW50ICs9IHBhcnNlRmxvYXQoZGF0YUxpc3RbaV0uVkFMVUUpO1xuICAgIH1cblxuICAgIHN1YlRpdGxlID0gXCLmgLvmlbA6XCIgKyB2YWx1ZUNvdW50O1xuXG4gICAgaWYgKCFyYWRpdXMpIHtcbiAgICAgIHJhZGl1cyA9ICc2MCUnO1xuICAgIH1cblxuICAgIHZhciBzZXJpZXNDb25maWcgPSBbe1xuICAgICAgbmFtZTogc2VyaWVzTmFtZSxcbiAgICAgIHR5cGU6ICdwaWUnLFxuICAgICAgcmFkaXVzOiByYWRpdXMsXG4gICAgICBjZW50ZXI6IFsnNTAlJywgJzYwJSddLFxuICAgICAgZGF0YTogc2VyaWVzRGF0YUNvbmZpZyxcbiAgICAgIGxhYmVsOiB7XG4gICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgIGZvcm1hdHRlcjogJ3tifToge2N9JyxcbiAgICAgICAgYWxpZ25UbzogJ2xhYmVsTGluZSdcbiAgICAgIH0sXG4gICAgICBlbXBoYXNpczoge1xuICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICBzaGFkb3dCbHVyOiAxMCxcbiAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxuICAgICAgICAgIHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfV07XG4gICAgdmFyIG9wdGlvbiA9IHtcbiAgICAgIHRpdGxlOiB7XG4gICAgICAgIHRleHQ6IHRpdGxlLFxuICAgICAgICBzdWJ0ZXh0OiBzdWJUaXRsZSxcbiAgICAgICAgbGVmdDogJ2NlbnRlcidcbiAgICAgIH0sXG4gICAgICB0b29sdGlwOiB7XG4gICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcbiAgICAgICAgZm9ybWF0dGVyOiAne2F9IDxici8+e2J9IDoge2N9ICh7ZH0lKSdcbiAgICAgIH0sXG4gICAgICBsZWdlbmQ6IGxlZ2VuZENvbmZpZyxcbiAgICAgIHNlcmllczogc2VyaWVzQ29uZmlnXG4gICAgfTtcbiAgICByZXR1cm4gb3B0aW9uO1xuICB9LFxuICBCdWlsZE5vcm1hbEJhck9wdGlvbjogZnVuY3Rpb24gQnVpbGROb3JtYWxCYXJPcHRpb24oZGF0YUxpc3QsIHNlcmllc05hbWUsIHRpdGxlKSB7XG4gICAgdmFyIHhBeGlzQ29uZmlnID0ge1xuICAgICAgdHlwZTogJ2NhdGVnb3J5JyxcbiAgICAgIGRhdGE6IFtdLFxuICAgICAgYXhpc1RpY2s6IHtcbiAgICAgICAgYWxpZ25XaXRoTGFiZWw6IHRydWUsXG4gICAgICAgIGludGVydmFsOiAwXG4gICAgICB9LFxuICAgICAgYXhpc0xhYmVsOiB7XG4gICAgICAgIGludGVydmFsOiAwXG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgc2VyaWVzRGF0YUNvbmZpZyA9IFtdO1xuICAgIHZhciBzdWJUaXRsZSA9IFwiXCI7XG4gICAgdmFyIHZhbHVlQ291bnQgPSAwO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgeEF4aXNDb25maWcuZGF0YS5wdXNoKGRhdGFMaXN0W2ldLk5BTUUpO1xuICAgICAgc2VyaWVzRGF0YUNvbmZpZy5wdXNoKHtcbiAgICAgICAgdmFsdWU6IGRhdGFMaXN0W2ldLlZBTFVFLFxuICAgICAgICBuYW1lOiBkYXRhTGlzdFtpXS5OQU1FXG4gICAgICB9KTtcbiAgICAgIHZhbHVlQ291bnQgKz0gcGFyc2VGbG9hdChkYXRhTGlzdFtpXS5WQUxVRSk7XG4gICAgfVxuXG4gICAgc3ViVGl0bGUgPSBcIuaAu+aVsDpcIiArIHZhbHVlQ291bnQ7XG4gICAgdmFyIHNlcmllc0NvbmZpZyA9IFt7XG4gICAgICBuYW1lOiBzZXJpZXNOYW1lLFxuICAgICAgdHlwZTogJ2JhcicsXG4gICAgICBkYXRhOiBzZXJpZXNEYXRhQ29uZmlnLFxuICAgICAgbGFiZWw6IHtcbiAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgZm9ybWF0dGVyOiAne2N9JyxcbiAgICAgICAgYWxpZ25UbzogJ2xhYmVsTGluZSdcbiAgICAgIH0sXG4gICAgICBlbXBoYXNpczoge1xuICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICBzaGFkb3dCbHVyOiAxMCxcbiAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxuICAgICAgICAgIHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfV07XG4gICAgdmFyIG9wdGlvbiA9IHtcbiAgICAgIHRpdGxlOiB7XG4gICAgICAgIHRleHQ6IHRpdGxlLFxuICAgICAgICBzdWJ0ZXh0OiBzdWJUaXRsZSxcbiAgICAgICAgbGVmdDogJ2NlbnRlcidcbiAgICAgIH0sXG4gICAgICB0b29sdGlwOiB7XG4gICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcbiAgICAgICAgZm9ybWF0dGVyOiAne2F9IDxici8+e2J9IDoge2N9J1xuICAgICAgfSxcbiAgICAgIGdyaWQ6IHtcbiAgICAgICAgbGVmdDogXCI2JVwiLFxuICAgICAgICByaWdodDogXCI2JVwiLFxuICAgICAgICBib3R0b206IDIwXG4gICAgICB9LFxuICAgICAgeEF4aXM6IFt4QXhpc0NvbmZpZ10sXG4gICAgICB5QXhpczogW3tcbiAgICAgICAgdHlwZTogJ3ZhbHVlJ1xuICAgICAgfV0sXG4gICAgICBzZXJpZXM6IHNlcmllc0NvbmZpZ1xuICAgIH07XG4gICAgcmV0dXJuIG9wdGlvbjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEV2ZW50VXRpbGl0eSA9IHtcbiAgRXZlbnRUeXBlQ2hhbmdlRXZlbnQ6IGZ1bmN0aW9uIEV2ZW50VHlwZUNoYW5nZUV2ZW50KCkge1xuICAgIHZhciB0eXBlMV8xXzJfZ3JvdXBfa2V5ID0gXCI0MDlhMWJiZi05YzUzLTRlYzktOGQ3Ny04ZjVkZjZiMmU4ZmFcIjtcbiAgICB2YXIgdHlwZTFfMl8yX2dyb3VwX2tleSA9IFwiN2UzNmEyMDgtMjkyNy00YWQwLTg5MmItMDQwM2M2ZTFiM2Q4XCI7XG4gICAgdmFyIHR5cGUxVmFsdWUgPSAkKFwiI3JhZGlvX2dyb3VwX2V2ZW50X3R5cGVfMVwiKS52YWwoKTtcblxuICAgIGlmICh0eXBlMVZhbHVlID09IFwi55+b55u+57qg57q3XCIpIHt9IGVsc2UgaWYgKHR5cGUxVmFsdWUgPT0gXCLpl67popjpmpDmgqNcIikge31cblxuICAgICQoXCIjcmFkaW9fZ3JvdXBfZXZlbnRfdHlwZV8xXCIpLmNoYW5nZSgpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgT3JnYW4zRERMID0ge1xuICBfcHJvcDoge1xuICAgIG15U2Vzc2lvbkRhdGE6IG51bGwsXG4gICAgbXlHcmlkRGF0YTogbnVsbCxcbiAgICBteUNvbW11bml0eURhdGE6IG51bGwsXG4gICAgbXlTdHJlZXREYXRhOiBudWxsLFxuICAgIGFsbE9yZ2FuTWluUHJvcDogbnVsbCxcbiAgICBvcGVyYXRpb25OYW1lOiBcIlwiLFxuICAgIGRkbFN0cmVldENvbnRyb2w6IG51bGwsXG4gICAgb2xkRERMU3RyZWV0Q29udHJvbFZhbHVlOiBcIlwiLFxuICAgIGRkbENvbW11bml0eUNvbnRyb2w6IG51bGwsXG4gICAgb2xkRERMQ29tbXVuaXR5Q29udHJvbFZhbHVlOiBcIlwiLFxuICAgIGRkbEdyaWRDb250cm9sOiBudWxsLFxuICAgIG9sZERETEdyaWRDb250cm9sVmFsdWU6IFwiXCIsXG4gICAgY2hhbmdlRW5hYmxlOiB0cnVlLFxuICAgIGluaXRFbmRGdW5jOiBudWxsXG4gIH0sXG4gIEdldE9yZ2FuRGF0YTogZnVuY3Rpb24gR2V0T3JnYW5EYXRhKGVuZEZ1bmMpIHtcbiAgICBBamF4VXRpbGl0eS5HZXQoXCIvUmVzdC9HcmlkL1NTT1Byb3h5L09yZ2FuQW5kVXNlci9HZXRBTExPcmdhbk1pblByb3BEYXRhXCIsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgdGhpcy5fcHJvcC5teVNlc3Npb25EYXRhID0gcmVzdWx0LmRhdGEuTXlTZXNzaW9uRGF0YTtcbiAgICAgICAgdmFyIG15T3JnYW5JZCA9IHJlc3VsdC5kYXRhLk15U2Vzc2lvbkRhdGEub3JnYW5JZDtcbiAgICAgICAgdGhpcy5fcHJvcC5hbGxPcmdhbk1pblByb3AgPSByZXN1bHQuZGF0YS5BTExPcmdhbk1pblByb3A7XG4gICAgICAgIHZhciBteU9yZ2FuRGF0YSA9IEFycmF5VXRpbGl0eS5XaGVyZVNpbmdsZSh0aGlzLl9wcm9wLmFsbE9yZ2FuTWluUHJvcCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5vcmdhbklkID09IG15T3JnYW5JZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG15T3JnYW5EYXRhLm9yZ2FuVHlwZVZhbHVlID09IFwiR3JpZFVuaXRcIikge1xuICAgICAgICAgIHRoaXMuX3Byb3AubXlHcmlkRGF0YSA9IG15T3JnYW5EYXRhO1xuICAgICAgICAgIHZhciBwYXJlbnRPcmdhbklkID0gbXlPcmdhbkRhdGEub3JnYW5QYXJlbnRJZDtcbiAgICAgICAgICB0aGlzLl9wcm9wLm15Q29tbXVuaXR5RGF0YSA9IEFycmF5VXRpbGl0eS5XaGVyZVNpbmdsZSh0aGlzLl9wcm9wLmFsbE9yZ2FuTWluUHJvcCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm9yZ2FuSWQgPT0gcGFyZW50T3JnYW5JZDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwYXJlbnRPcmdhbklkID0gdGhpcy5fcHJvcC5teUNvbW11bml0eURhdGEub3JnYW5QYXJlbnRJZDtcbiAgICAgICAgICB0aGlzLl9wcm9wLm15U3RyZWV0RGF0YSA9IEFycmF5VXRpbGl0eS5XaGVyZVNpbmdsZSh0aGlzLl9wcm9wLmFsbE9yZ2FuTWluUHJvcCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm9yZ2FuSWQgPT0gcGFyZW50T3JnYW5JZDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChteU9yZ2FuRGF0YS5vcmdhblR5cGVWYWx1ZSA9PSBcIkNvbW11bml0eVwiKSB7XG4gICAgICAgICAgdGhpcy5fcHJvcC5teUNvbW11bml0eURhdGEgPSBteU9yZ2FuRGF0YTtcbiAgICAgICAgICB2YXIgcGFyZW50T3JnYW5JZCA9IHRoaXMuX3Byb3AubXlDb21tdW5pdHlEYXRhLm9yZ2FuUGFyZW50SWQ7XG4gICAgICAgICAgdGhpcy5fcHJvcC5teVN0cmVldERhdGEgPSBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUodGhpcy5fcHJvcC5hbGxPcmdhbk1pblByb3AsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5vcmdhbklkID09IHBhcmVudE9yZ2FuSWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAobXlPcmdhbkRhdGEub3JnYW5UeXBlVmFsdWUgPT0gXCJTdHJlZXRcIikge1xuICAgICAgICAgIHRoaXMuX3Byb3AubXlTdHJlZXREYXRhID0gbXlPcmdhbkRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBlbmRGdW5jLmNhbGwodGhpcywgcmVzdWx0LmRhdGEpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9LFxuICBJbml0M0RETDogZnVuY3Rpb24gSW5pdDNEREwoZGRsU3RyZWV0Q29udHJvbElkLCBkZGxDb21tdW5pdHlDb250cm9sSWQsIGRkbEdyaWRDb250cm9sSWQsIG9wZXJhdGlvbk5hbWUsIGNoYW5nZUVuYWJsZSwgaW5pdEVuZEZ1bmMpIHtcbiAgICB0aGlzLl9wcm9wLm9wZXJhdGlvbk5hbWUgPSBvcGVyYXRpb25OYW1lO1xuICAgIHRoaXMuX3Byb3AuZGRsU3RyZWV0Q29udHJvbCA9ICQoXCIjXCIgKyBkZGxTdHJlZXRDb250cm9sSWQpO1xuICAgIHRoaXMuX3Byb3Aub2xkRERMU3RyZWV0Q29udHJvbFZhbHVlID0gdGhpcy5fcHJvcC5kZGxTdHJlZXRDb250cm9sLmF0dHIoXCJjb250cm9sX3ZhbHVlXCIpO1xuICAgIHRoaXMuX3Byb3AuZGRsQ29tbXVuaXR5Q29udHJvbCA9ICQoXCIjXCIgKyBkZGxDb21tdW5pdHlDb250cm9sSWQpO1xuICAgIHRoaXMuX3Byb3Aub2xkRERMQ29tbXVuaXR5Q29udHJvbFZhbHVlID0gdGhpcy5fcHJvcC5kZGxDb21tdW5pdHlDb250cm9sLmF0dHIoXCJjb250cm9sX3ZhbHVlXCIpO1xuICAgIHRoaXMuX3Byb3AuZGRsR3JpZENvbnRyb2wgPSAkKFwiI1wiICsgZGRsR3JpZENvbnRyb2xJZCk7XG4gICAgdGhpcy5fcHJvcC5vbGRERExHcmlkQ29udHJvbFZhbHVlID0gdGhpcy5fcHJvcC5kZGxHcmlkQ29udHJvbC5hdHRyKFwiY29udHJvbF92YWx1ZVwiKTtcbiAgICB0aGlzLl9wcm9wLmNoYW5nZUVuYWJsZSA9IGNoYW5nZUVuYWJsZTtcbiAgICB0aGlzLl9wcm9wLmluaXRFbmRGdW5jID0gaW5pdEVuZEZ1bmM7XG4gICAgdGhpcy5HZXRPcmdhbkRhdGEoZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKG9wZXJhdGlvbk5hbWUgPT0gQmFzZVV0aWxpdHkuR2V0Vmlld09wZXJhdGlvbk5hbWUoKSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHZhciBzdHJlZXREYXRhID0gQXJyYXlVdGlsaXR5LldoZXJlU2luZ2xlKHRoaXMuX3Byb3AuYWxsT3JnYW5NaW5Qcm9wLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLm9yZ2FuSWQgPT0gX3RoaXMuX3Byb3Aub2xkRERMU3RyZWV0Q29udHJvbFZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGNvbW11bml0eURhdGEgPSBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUodGhpcy5fcHJvcC5hbGxPcmdhbk1pblByb3AsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ub3JnYW5JZCA9PSBfdGhpcy5fcHJvcC5vbGRERExDb21tdW5pdHlDb250cm9sVmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZ3JpZERhdGEgPSBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUodGhpcy5fcHJvcC5hbGxPcmdhbk1pblByb3AsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ub3JnYW5JZCA9PSBfdGhpcy5fcHJvcC5vbGRERExHcmlkQ29udHJvbFZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9wcm9wLmRkbFN0cmVldENvbnRyb2wudGV4dChzdHJlZXREYXRhLm9yZ2FuTmFtZSk7XG5cbiAgICAgICAgdGhpcy5fcHJvcC5kZGxDb21tdW5pdHlDb250cm9sLnRleHQoY29tbXVuaXR5RGF0YS5vcmdhbk5hbWUpO1xuXG4gICAgICAgIHRoaXMuX3Byb3AuZGRsR3JpZENvbnRyb2wudGV4dChncmlkRGF0YS5vcmdhbk5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5CaW5kM0RETCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRoaXMuX3Byb3AuaW5pdEVuZEZ1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRoaXMuX3Byb3AuaW5pdEVuZEZ1bmMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICghdGhpcy5fcHJvcC5jaGFuZ2VFbmFibGUpIHtcbiAgICAgIHRoaXMuX3Byb3AuZGRsU3RyZWV0Q29udHJvbC5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcblxuICAgICAgdGhpcy5fcHJvcC5kZGxDb21tdW5pdHlDb250cm9sLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuXG4gICAgICB0aGlzLl9wcm9wLmRkbEdyaWRDb250cm9sLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICAgIH1cbiAgfSxcbiAgQmluZDNEREw6IGZ1bmN0aW9uIEJpbmQzRERMKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgc3RyZWV0RGF0YUxpc3QgPSBBcnJheVV0aWxpdHkuV2hlcmUodGhpcy5fcHJvcC5hbGxPcmdhbk1pblByb3AsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5vcmdhblR5cGVWYWx1ZSA9PSBcIlN0cmVldFwiO1xuICAgIH0pO1xuICAgIHRoaXMuQmluZFNpbmdsZURETCh0aGlzLl9wcm9wLmRkbFN0cmVldENvbnRyb2wsIHN0cmVldERhdGFMaXN0KTtcbiAgICB2YXIgc2VsZWN0ZWRTdHJlZXRWYWx1ZSA9IHRoaXMuVHJ5QXV0b1NldFN0cmVldCgpO1xuXG4gICAgdGhpcy5fcHJvcC5kZGxTdHJlZXRDb250cm9sLmNoYW5nZShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbmV3U2VsZWN0ZWRTdHJlZXRWYWx1ZSA9ICQodGhpcykudmFsKCk7XG5cbiAgICAgIF90aGlzLlN0cmVldENvbnRyb2xDaGFuZ2UobmV3U2VsZWN0ZWRTdHJlZXRWYWx1ZSk7XG4gICAgfSk7XG5cbiAgICB2YXIgY29tbXVuaXR5RGF0YUxpc3QgPSBBcnJheVV0aWxpdHkuV2hlcmUodGhpcy5fcHJvcC5hbGxPcmdhbk1pblByb3AsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5vcmdhblBhcmVudElkID09IHNlbGVjdGVkU3RyZWV0VmFsdWU7XG4gICAgfSk7XG4gICAgdGhpcy5CaW5kU2luZ2xlRERMKHRoaXMuX3Byb3AuZGRsQ29tbXVuaXR5Q29udHJvbCwgY29tbXVuaXR5RGF0YUxpc3QpO1xuICAgIHZhciBzZWxlY3RlZENvbW11bml0eVZhbHVlID0gdGhpcy5UcnlBdXRvU2V0Q29tbXVuaXR5KCk7XG5cbiAgICB0aGlzLl9wcm9wLmRkbENvbW11bml0eUNvbnRyb2wuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBuZXdTZWxlY3RlZENvbW11bml0eVZhbHVlID0gJCh0aGlzKS52YWwoKTtcblxuICAgICAgX3RoaXMuQ29tbXVuaXR5Q29udHJvbENoYW5nZShuZXdTZWxlY3RlZENvbW11bml0eVZhbHVlKTtcbiAgICB9KTtcblxuICAgIHZhciBncmlkRGF0YUxpc3QgPSBBcnJheVV0aWxpdHkuV2hlcmUodGhpcy5fcHJvcC5hbGxPcmdhbk1pblByb3AsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5vcmdhblBhcmVudElkID09IHNlbGVjdGVkQ29tbXVuaXR5VmFsdWU7XG4gICAgfSk7XG4gICAgdGhpcy5CaW5kU2luZ2xlRERMKHRoaXMuX3Byb3AuZGRsR3JpZENvbnRyb2wsIGdyaWREYXRhTGlzdCk7XG4gICAgdGhpcy5UcnlBdXRvU2V0R3JpZCgpO1xuICB9LFxuICBUcnlBdXRvU2V0U3RyZWV0OiBmdW5jdGlvbiBUcnlBdXRvU2V0U3RyZWV0KCkge1xuICAgIHZhciBzZWxlY3RlZFZhbHVlID0gdGhpcy5fcHJvcC5vbGRERExTdHJlZXRDb250cm9sVmFsdWU7XG5cbiAgICBpZiAoIXNlbGVjdGVkVmFsdWUgJiYgdGhpcy5fcHJvcC5teVN0cmVldERhdGEpIHtcbiAgICAgIHNlbGVjdGVkVmFsdWUgPSB0aGlzLl9wcm9wLm15U3RyZWV0RGF0YS5vcmdhbklkO1xuICAgIH1cblxuICAgIGlmIChzZWxlY3RlZFZhbHVlKSB7XG4gICAgICB0aGlzLl9wcm9wLmRkbFN0cmVldENvbnRyb2wudmFsKHNlbGVjdGVkVmFsdWUpO1xuXG4gICAgICByZXR1cm4gc2VsZWN0ZWRWYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcHJvcC5kZGxTdHJlZXRDb250cm9sLnZhbCgpO1xuICB9LFxuICBUcnlBdXRvU2V0Q29tbXVuaXR5OiBmdW5jdGlvbiBUcnlBdXRvU2V0Q29tbXVuaXR5KCkge1xuICAgIHZhciBzZWxlY3RlZFZhbHVlID0gdGhpcy5fcHJvcC5vbGRERExDb21tdW5pdHlDb250cm9sVmFsdWU7XG5cbiAgICBpZiAoIXNlbGVjdGVkVmFsdWUgJiYgdGhpcy5fcHJvcC5teUNvbW11bml0eURhdGEpIHtcbiAgICAgIHNlbGVjdGVkVmFsdWUgPSB0aGlzLl9wcm9wLm15Q29tbXVuaXR5RGF0YS5vcmdhbklkO1xuICAgIH1cblxuICAgIGlmIChzZWxlY3RlZFZhbHVlKSB7XG4gICAgICB0aGlzLl9wcm9wLmRkbENvbW11bml0eUNvbnRyb2wudmFsKHNlbGVjdGVkVmFsdWUpO1xuXG4gICAgICByZXR1cm4gc2VsZWN0ZWRWYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcHJvcC5kZGxDb21tdW5pdHlDb250cm9sLnZhbCgpO1xuICB9LFxuICBUcnlBdXRvU2V0R3JpZDogZnVuY3Rpb24gVHJ5QXV0b1NldEdyaWQoKSB7XG4gICAgdmFyIHNlbGVjdGVkVmFsdWUgPSB0aGlzLl9wcm9wLm9sZERETEdyaWRDb250cm9sVmFsdWU7XG5cbiAgICBpZiAoIXNlbGVjdGVkVmFsdWUgJiYgdGhpcy5fcHJvcC5teUdyaWREYXRhKSB7XG4gICAgICBzZWxlY3RlZFZhbHVlID0gdGhpcy5fcHJvcC5teUdyaWREYXRhLm9yZ2FuSWQ7XG4gICAgfVxuXG4gICAgaWYgKHNlbGVjdGVkVmFsdWUpIHtcbiAgICAgIHRoaXMuX3Byb3AuZGRsR3JpZENvbnRyb2wudmFsKHNlbGVjdGVkVmFsdWUpO1xuXG4gICAgICByZXR1cm4gc2VsZWN0ZWRWYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcHJvcC5kZGxHcmlkQ29udHJvbC52YWwoKTtcbiAgfSxcbiAgQmluZFNpbmdsZURETDogZnVuY3Rpb24gQmluZFNpbmdsZURETChkZGxDb250cm9sLCBvcmdhbkRhdGFMaXN0KSB7XG4gICAgZGRsQ29udHJvbC5odG1sKFwiXCIpO1xuICAgIGRkbENvbnRyb2wuYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nICc+LS3or7fpgInmi6ktLTwvb3B0aW9uPlwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3JnYW5EYXRhTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9yZ2FuRGF0YSA9IG9yZ2FuRGF0YUxpc3RbaV07XG4gICAgICB2YXIgc2VsID0gXCI8b3B0aW9uIHZhbHVlPSdcIiArIG9yZ2FuRGF0YS5vcmdhbklkICsgXCInPlwiICsgb3JnYW5EYXRhLm9yZ2FuTmFtZSArIFwiPC9vcHRpb24+XCI7XG4gICAgICBkZGxDb250cm9sLmFwcGVuZChzZWwpO1xuICAgIH1cbiAgfSxcbiAgU3RyZWV0Q29udHJvbENoYW5nZTogZnVuY3Rpb24gU3RyZWV0Q29udHJvbENoYW5nZShuZXdTZWxlY3RlZFN0cmVldFZhbHVlKSB7XG4gICAgdmFyIGNvbW11bml0eURhdGFMaXN0ID0gQXJyYXlVdGlsaXR5LldoZXJlKHRoaXMuX3Byb3AuYWxsT3JnYW5NaW5Qcm9wLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0ub3JnYW5QYXJlbnRJZCA9PSBuZXdTZWxlY3RlZFN0cmVldFZhbHVlO1xuICAgIH0pO1xuICAgIHRoaXMuQmluZFNpbmdsZURETCh0aGlzLl9wcm9wLmRkbENvbW11bml0eUNvbnRyb2wsIGNvbW11bml0eURhdGFMaXN0KTtcblxuICAgIHRoaXMuX3Byb3AuZGRsR3JpZENvbnRyb2wuaHRtbChcIlwiKTtcblxuICAgIHRoaXMuX3Byb3AuZGRsR3JpZENvbnRyb2wuYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nICc+LS3or7fpgInmi6ktLTwvb3B0aW9uPlwiKTtcbiAgfSxcbiAgQ29tbXVuaXR5Q29udHJvbENoYW5nZTogZnVuY3Rpb24gQ29tbXVuaXR5Q29udHJvbENoYW5nZShuZXdTZWxlY3RlZENvbW11bml0eVZhbHVlKSB7XG4gICAgdmFyIGdyaWREYXRhTGlzdCA9IEFycmF5VXRpbGl0eS5XaGVyZSh0aGlzLl9wcm9wLmFsbE9yZ2FuTWluUHJvcCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLm9yZ2FuUGFyZW50SWQgPT0gbmV3U2VsZWN0ZWRDb21tdW5pdHlWYWx1ZTtcbiAgICB9KTtcbiAgICB0aGlzLkJpbmRTaW5nbGVEREwodGhpcy5fcHJvcC5kZGxHcmlkQ29udHJvbCwgZ3JpZERhdGFMaXN0KTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuaWYgKCQoXCIjdmlld0hvdXNlQW5kUGVyc29uV3JhcFwiKS5sZW5ndGggPiAwKSB7XG4gIHZhciBWaWV3SG91c2VBbmRQZXJzb25XcmFwID0gbmV3IFZ1ZSh7XG4gICAgZWw6IFwiI3ZpZXdIb3VzZUFuZFBlcnNvbldyYXBcIixcbiAgICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgICAgdmFyIHdpbmRvd0hlaWdodCA9IEJhc2VVdGlsaXR5LkdldFVybFBhcmFWYWx1ZShcIndpbmRvd0hlaWdodFwiKTtcbiAgICAgIHZhciBidWlsZElkID0gQmFzZVV0aWxpdHkuR2V0VXJsUGFyYVZhbHVlKFwicmVjb3JkSWRcIik7XG4gICAgICAkKFwiI3ZpZXdIb3VzZUFuZFBlcnNvbldyYXBcIikuaGVpZ2h0KHdpbmRvd0hlaWdodCAtIDIwMCk7XG4gICAgICB0aGlzLmxpc3RIZWlnaHQgPSB3aW5kb3dIZWlnaHQgLSAyNjA7XG4gICAgICB0aGlzLmxvYWRIb3VzZURhdGEoYnVpbGRJZCk7XG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXRIb3VzZUJ5QnVpbGRJZDogXCIvUmVzdC9HcmlkL0J1aWxkL0hvdXNlSW5mby9HZXRIb3VzZUJ5QnVpbGRJZFwiLFxuICAgICAgICBlZGl0SG91c2VWaWV3OiBcIi9IVE1ML0J1aWxkZXIvUnVudGltZS9XZWJGb3JtSW5kZXBlbmRlbmNlUnVudGltZS5odG1sXCIsXG4gICAgICAgIGVkaXRIb3VzZUZvcm1JZDogXCJjY2ZkYWM2My1kOWQ3LTRhNjctYWQ5Zi03NDdlODhhNDhmNWRcIixcbiAgICAgICAgZGVsZXRlSG91c2U6IFwiL1Jlc3QvR3JpZC9CdWlsZC9Ib3VzZUluZm8vRGVsZXRlXCIsXG4gICAgICAgIGVkaXRQZXJzb25WaWV3OiBcIi9IVE1ML0J1aWxkZXIvUnVudGltZS9XZWJGb3JtSW5kZXBlbmRlbmNlUnVudGltZS5odG1sXCIsXG4gICAgICAgIGVkaXRGYW1pbHlGb3JtSWQ6IFwiMTQ4OGVlNTAtZWZiNi00MDlhLWFmYzctZWIwZjk3MTA3MTNmXCIsXG4gICAgICAgIGVkaXRQZXJzb25Gb3JtSWQ6IFwiNWQ2ZGUzODgtY2UxZS00M2M3LWI1OTItYzllODBiNzE0MzVjXCIsXG4gICAgICAgIGdldFBlcnNvbkJ5SG91c2VJZDogXCIvUmVzdC9HcmlkL1BlcnNvbi9QZXJzb25NYWluL0dldFBlcnNvbkJ5SG91c2VJZFwiLFxuICAgICAgICBkZWxldGVQZXJzb246IFwiL1Jlc3QvR3JpZC9QZXJzb24vUGVyc29uTWFpbi9EZWxldGVQZXJzb25XaXRoRmFtaWx5XCIsXG4gICAgICAgIGVkaXRFbnRlcnByaXNlVmlldzogXCIvSFRNTC9CdWlsZGVyL1J1bnRpbWUvV2ViRm9ybUluZGVwZW5kZW5jZVJ1bnRpbWUuaHRtbFwiLFxuICAgICAgICBlZGl0RW50ZXJwcmlzZUZvcm1JZDogXCI5ZTBlMjU4YS02MzlhLTQyMDktODNiZi02MDcwMDBkZTBmNzdcIixcbiAgICAgICAgZ2V0RW50ZXJwcmlzZUJ5SG91c2VJZDogXCIvUmVzdC9HcmlkL0VudGVycHJpc2UvRW50ZXJwcmlzZU1haW4vR2V0RW50ZXJwcmlzZUJ5SG91c2VJZFwiLFxuICAgICAgICBkZWxldGVFbnRlcnByaXNlOiBcIi9SZXN0L0dyaWQvRW50ZXJwcmlzZS9FbnRlcnByaXNlTWFpbi9EZWxldGVcIlxuICAgICAgfSxcbiAgICAgIGxpc3RIZWlnaHQ6IDEwMCxcbiAgICAgIGhvdXNlOiB7XG4gICAgICAgIHNlbGVjdGVkSG91c2U6IG51bGwsXG4gICAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgICAgdGl0bGU6ICfmiL/lsYvnvJbnoIEnLFxuICAgICAgICAgIGtleTogJ2hvdXNlQ29kZUZ1bGwnLFxuICAgICAgICAgIGFsaWduOiBcImxlZnRcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICfmiL/lj7cnLFxuICAgICAgICAgIGtleTogJ2hvdXNlTnVtTmFtZScsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgd2lkdGg6IDEyMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICfkvb/nlKjmg4XlhrUnLFxuICAgICAgICAgIGtleTogJ2hvdXNlVXNlZERlc2MnLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgICAga2V5OiAnaG91c2VJZCcsXG4gICAgICAgICAgd2lkdGg6IDgwLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgICAgdmFyIGJ1dHRvbnMgPSBbXTtcbiAgICAgICAgICAgIGJ1dHRvbnMucHVzaChoKCdUb29sdGlwJywge1xuICAgICAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwi5p+l55yLXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3Qtcm93LWJ1dHRvbiB2aWV3XCIsXG4gICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgICAgICAgVmlld0hvdXNlQW5kUGVyc29uV3JhcC52aWV3SG91c2UocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXSkpO1xuICAgICAgICAgICAgdmFyIGVoID0gaCgnZGl2Jywge1xuICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgICAgfSwgYnV0dG9ucyk7XG4gICAgICAgICAgICByZXR1cm4gZWg7XG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgdGFibGVEYXRhOiBbXSxcbiAgICAgICAgc2VhcmNoSG91c2VUZXh0OiBcIlwiXG4gICAgICB9LFxuICAgICAgcGVyc29uOiB7XG4gICAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgICAgdGl0bGU6ICfkurrlkZgnLFxuICAgICAgICAgIGtleTogJ2Rpc3BsYXlUZXh0JyxcbiAgICAgICAgICBhbGlnbjogXCJsZWZ0XCIsXG4gICAgICAgICAgd2lkdGg6IDEyMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICfouqvku73or4Hlj7cnLFxuICAgICAgICAgIGtleTogJ3BlcnNvbklkQ2FyZCcsXG4gICAgICAgICAgYWxpZ246IFwibGVmdFwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+iBlOezu+eUteivnScsXG4gICAgICAgICAga2V5OiAncGVyc29uUGhvbmUnLFxuICAgICAgICAgIGFsaWduOiBcImxlZnRcIixcbiAgICAgICAgICB3aWR0aDogMTQwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgICAga2V5OiAncGVyc29uSWQnLFxuICAgICAgICAgIHdpZHRoOiAxNDAsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgYnV0dG9ucyA9IFtdO1xuICAgICAgICAgICAgYnV0dG9ucy5wdXNoKGgoJ1Rvb2x0aXAnLCB7XG4gICAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgY29udGVudDogXCLmn6XnnItcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uIHZpZXdcIixcbiAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICAgICAgICBWaWV3SG91c2VBbmRQZXJzb25XcmFwLnZpZXdQZXJzb24ocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXSkpO1xuICAgICAgICAgICAgdmFyIGVoID0gaCgnZGl2Jywge1xuICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgICAgfSwgYnV0dG9ucyk7XG4gICAgICAgICAgICByZXR1cm4gZWg7XG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgdGFibGVEYXRhOiBbXVxuICAgICAgfSxcbiAgICAgIGVudGVycHJpc2U6IHtcbiAgICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgICB0aXRsZTogJ+S8geS4mijpl6jlupflkI3np7ApJyxcbiAgICAgICAgICBrZXk6ICdlbnROYW1lJyxcbiAgICAgICAgICBhbGlnbjogXCJsZWZ0XCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAgICBrZXk6ICdlbnRJZCcsXG4gICAgICAgICAgd2lkdGg6IDE0MCxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBidXR0b25zID0gW107XG4gICAgICAgICAgICBidXR0b25zLnB1c2goaCgnVG9vbHRpcCcsIHtcbiAgICAgICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIuafpeeci1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0LXJvdy1idXR0b24gdmlld1wiLFxuICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgICAgICAgIGdyaWRNYW5hZ2VyLnZpZXdFbnRlcnByaXNlKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KV0pKTtcbiAgICAgICAgICAgIGJ1dHRvbnMucHVzaChoKCdUb29sdGlwJywge1xuICAgICAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwi5L+u5pS5XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3Qtcm93LWJ1dHRvbiBlZGl0XCIsXG4gICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgICAgICAgZ3JpZE1hbmFnZXIuZWRpdEVudGVycHJpc2UocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXSkpO1xuICAgICAgICAgICAgYnV0dG9ucy5wdXNoKGgoJ1Rvb2x0aXAnLCB7XG4gICAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgY29udGVudDogXCLliKDpmaRcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uIGRlbFwiLFxuICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgICAgICAgIGdyaWRNYW5hZ2VyLmRlbEVudGVycHJpc2UocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXSkpO1xuICAgICAgICAgICAgdmFyIGVoID0gaCgnZGl2Jywge1xuICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgICAgfSwgYnV0dG9ucyk7XG4gICAgICAgICAgICByZXR1cm4gZWg7XG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgdGFibGVEYXRhOiBbXVxuICAgICAgfVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgZ2V0Rm9ybVBhcmE6IGZ1bmN0aW9uIGdldEZvcm1QYXJhKGZvcm1JZCwgb3BOYW1lLCByZWNvcmRJZCwgbWVudVJpZ2h0VXJsUGFyYSwgZW5kRnVuYykge1xuICAgICAgICB2YXIgcGFyYSA9IHtcbiAgICAgICAgICBcImZvcm1JZFwiOiBmb3JtSWQsXG4gICAgICAgICAgXCJidXR0b25JZFwiOiBcIlwiLFxuICAgICAgICAgIFwibGlzdEZvcm1CdXR0b25FbGVtSWRcIjogXCJcIixcbiAgICAgICAgICBcInJlY29yZElkXCI6IHJlY29yZElkLFxuICAgICAgICAgIFwib3BlcmF0aW9uVHlwZVwiOiBvcE5hbWUsXG4gICAgICAgICAgXCJ3aW5kb3dXaWR0aFwiOiAxMzAwLFxuICAgICAgICAgIFwid2luZG93SGVpZ2h0XCI6IDg4MCxcbiAgICAgICAgICBcIm1lbnVSaWdodFVybFBhcmFcIjogbWVudVJpZ2h0VXJsUGFyYSxcbiAgICAgICAgICBcImRldk9wZXJhdGlvbkVuZEZ1bmNcIjogZW5kRnVuYyxcbiAgICAgICAgICBcIm1lbnVSaWdodFVybFBhcmFKc29uXCI6IFwiXCJcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgPCA1MDApIHtcbiAgICAgICAgICBwYXJhLndpbmRvd0hlaWdodCA9IDYwMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJhO1xuICAgICAgfSxcbiAgICAgIGdldEZvcm1EaWFsb2dQYXJhOiBmdW5jdGlvbiBnZXRGb3JtRGlhbG9nUGFyYSh0aXRsZSkge1xuICAgICAgICB2YXIgcGFyYSA9IHtcbiAgICAgICAgICBcIndpZHRoXCI6IDEzMDAsXG4gICAgICAgICAgXCJoZWlnaHRcIjogODgwLFxuICAgICAgICAgIFwidGl0bGVcIjogdGl0bGVcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgPCA1MDApIHtcbiAgICAgICAgICBwYXJhLmhlaWdodCA9IDYwMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJhO1xuICAgICAgfSxcbiAgICAgIHNlbGVjdGlvbkhvdXNlQ2hhbmdlOiBmdW5jdGlvbiBzZWxlY3Rpb25Ib3VzZUNoYW5nZShyb3csIGluZGV4KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJvdyk7XG4gICAgICAgIHRoaXMuaG91c2Uuc2VsZWN0ZWRIb3VzZSA9IHJvdztcbiAgICAgICAgdGhpcy5sb2FkUGVyc29uRGF0YSgpO1xuICAgICAgICB0aGlzLmxvYWRFbnRlcnByaXNlRGF0YSgpO1xuICAgICAgfSxcbiAgICAgIGxvYWRIb3VzZURhdGE6IGZ1bmN0aW9uIGxvYWRIb3VzZURhdGEoYnVpbGRJZCkge1xuICAgICAgICBBamF4VXRpbGl0eS5HZXQodGhpcy5hY0ludGVyZmFjZS5nZXRIb3VzZUJ5QnVpbGRJZCwge1xuICAgICAgICAgIGJ1aWxkSWQ6IGJ1aWxkSWRcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuaG91c2UudGFibGVEYXRhID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0sXG4gICAgICBzZWFyY2hIb3VzZTogZnVuY3Rpb24gc2VhcmNoSG91c2UoKSB7XG4gICAgICAgIHZhciB0ZXh0ID0gdGhpcy5ob3VzZS5zZWFyY2hIb3VzZVRleHQ7XG5cbiAgICAgICAgaWYgKHRoaXMuaG91c2Uuc291cmNlVGFibGVEYXRhKSB7XG4gICAgICAgICAgdGhpcy5ob3VzZS50YWJsZURhdGEgPSB0aGlzLmhvdXNlLnNvdXJjZVRhYmxlRGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhvdXNlLnRhYmxlRGF0YS5sZW5ndGggPiAwICYmIFN0cmluZ1V0aWxpdHkuSXNOb3ROdWxsT3JFbXB0eSh0ZXh0KSkge1xuICAgICAgICAgIHRoaXMuaG91c2Uuc291cmNlVGFibGVEYXRhID0gdGhpcy5ob3VzZS50YWJsZURhdGE7XG4gICAgICAgICAgdGhpcy5ob3VzZS50YWJsZURhdGEgPSBBcnJheVV0aWxpdHkuV2hlcmUodGhpcy5ob3VzZS50YWJsZURhdGEsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZiAoaXRlbS5ob3VzZUNvZGUuaW5kZXhPZih0ZXh0KSA+PSAwIHx8IGl0ZW0uaG91c2VOdW1OYW1lLmluZGV4T2YodGV4dCkgPj0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGFkZEhvdXNlOiBmdW5jdGlvbiBhZGRIb3VzZSgpIHtcbiAgICAgICAgdmFyIHNlbGVjdGVkQnVpbGQgPSB0aGlzLmJ1aWxkVHJlZS50cmVlU2VsZWN0ZWROb2RlO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZEJ1aWxkID09IG51bGwpIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuivt+WFiOmAieaLqeW7uuetkeeJqSFcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1lbnVSaWdodFVybFBhcmEgPSBbe1xuICAgICAgICAgIFwiQWN0aW9uVHlwZVwiOiBcIkJpbmRUb0ZpZWxkXCIsXG4gICAgICAgICAgXCJGaWVsZE5hbWVcIjogXCJIT1VTRV9CVUlMRF9JRFwiLFxuICAgICAgICAgIFwiVmFsdWVcIjogc2VsZWN0ZWRCdWlsZC5idWlsZElkXG4gICAgICAgIH1dO1xuICAgICAgICB2YXIgZm9ybVBhcmEgPSB0aGlzLmdldEZvcm1QYXJhKHRoaXMuYWNJbnRlcmZhY2UuZWRpdEhvdXNlRm9ybUlkLCBCYXNlVXRpbGl0eS5HZXRBZGRPcGVyYXRpb25OYW1lKCksIFwiXCIsIEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyhtZW51UmlnaHRVcmxQYXJhKSwgXCJyZUxvYWRIb3VzZVwiKTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdEJ1aWxkVmlldywgZm9ybVBhcmEpLCB0aGlzLmdldEZvcm1EaWFsb2dQYXJhKFwi5oi/5bGL55m76K6wXCIpLCAxLCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICB2aWV3SG91c2U6IGZ1bmN0aW9uIHZpZXdIb3VzZShwYXJhKSB7XG4gICAgICAgIHZhciBob3VzZUlkID0gcGFyYS5yb3cuaG91c2VJZDtcbiAgICAgICAgdmFyIGZvcm1QYXJhID0gdGhpcy5nZXRGb3JtUGFyYSh0aGlzLmFjSW50ZXJmYWNlLmVkaXRIb3VzZUZvcm1JZCwgQmFzZVV0aWxpdHkuR2V0Vmlld09wZXJhdGlvbk5hbWUoKSwgaG91c2VJZCwgXCJcIiwgXCJyZUxvYWRIb3VzZVwiKTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZDAzLCBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0SG91c2VWaWV3LCBmb3JtUGFyYSksIHRoaXMuZ2V0Rm9ybURpYWxvZ1BhcmEoXCLmiL/lsYvnmbvorrBcIiksIDEsIHRydWUpO1xuICAgICAgfSxcbiAgICAgIGVkaXRIb3VzZTogZnVuY3Rpb24gZWRpdEhvdXNlKHBhcmEpIHtcbiAgICAgICAgdmFyIGhvdXNlSWQgPSBwYXJhLnJvdy5ob3VzZUlkO1xuICAgICAgICB2YXIgZm9ybVBhcmEgPSB0aGlzLmdldEZvcm1QYXJhKHRoaXMuYWNJbnRlcmZhY2UuZWRpdEhvdXNlRm9ybUlkLCBCYXNlVXRpbGl0eS5HZXRVcGRhdGVPcGVyYXRpb25OYW1lKCksIGhvdXNlSWQsIFwiXCIsIFwicmVMb2FkSG91c2VcIik7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRCdWlsZFZpZXcsIGZvcm1QYXJhKSwgdGhpcy5nZXRGb3JtRGlhbG9nUGFyYShcIuaIv+Wxi+eZu+iusFwiKSwgMSwgdHJ1ZSk7XG4gICAgICB9LFxuICAgICAgZGVsSG91c2U6IGZ1bmN0aW9uIGRlbEhvdXNlKHBhcmEpIHtcbiAgICAgICAgdmFyIGhvdXNlSWQgPSBwYXJhLnJvdy5ob3VzZUlkO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOimgeWIoOmZpOW9k+WJjeaIv+Wxi+WQl++8n1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgQWpheFV0aWxpdHkuRGVsZXRlKHRoaXMuYWNJbnRlcmZhY2UuZGVsZXRlSG91c2UsIHtcbiAgICAgICAgICAgIHJlY29yZElkOiBob3VzZUlkXG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KHJlc3VsdC5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgdGhpcy5sb2FkSG91c2VEYXRhKHRoaXMuYnVpbGRUcmVlLnRyZWVTZWxlY3RlZE5vZGUuYnVpbGRJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSxcbiAgICAgIHNlbGVjdGlvblBlcnNvbkNoYW5nZTogZnVuY3Rpb24gc2VsZWN0aW9uUGVyc29uQ2hhbmdlKCkge30sXG4gICAgICBsb2FkUGVyc29uRGF0YTogZnVuY3Rpb24gbG9hZFBlcnNvbkRhdGEoKSB7XG4gICAgICAgIHZhciBob3VzZUlkID0gdGhpcy5ob3VzZS5zZWxlY3RlZEhvdXNlLmhvdXNlSWQ7XG4gICAgICAgIEFqYXhVdGlsaXR5LkdldCh0aGlzLmFjSW50ZXJmYWNlLmdldFBlcnNvbkJ5SG91c2VJZCwge1xuICAgICAgICAgIGhvdXNlSWQ6IGhvdXNlSWRcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgcmVzdWx0LmRhdGFbaV0uZGlzcGxheVRleHQgPSByZXN1bHQuZGF0YVtpXS5wZXJzb25OYW1lO1xuXG4gICAgICAgICAgICAgIGlmIChyZXN1bHQuZGF0YVtpXS5wZXJzb25SZWxhdGlvbnNoaXAgPT0gXCIwXCIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuZGF0YVtpXS5kaXNwbGF5VGV4dCA9IFwiW+aIt+S4u11cIiArIHJlc3VsdC5kYXRhW2ldLmRpc3BsYXlUZXh0O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5kYXRhW2ldLmRpc3BsYXlUZXh0ID0gXCJb5oiQ5ZGYXVwiICsgcmVzdWx0LmRhdGFbaV0uZGlzcGxheVRleHQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wZXJzb24udGFibGVEYXRhID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0sXG4gICAgICBhZGRGYW1pbHk6IGZ1bmN0aW9uIGFkZEZhbWlseSgpIHtcbiAgICAgICAgdmFyIHNlbGVjdGVkSG91c2UgPSB0aGlzLmhvdXNlLnNlbGVjdGVkSG91c2U7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkSG91c2UgPT0gbnVsbCkge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+35YWI6YCJ5oup5oi/5bGLIVwiKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbWVudVJpZ2h0VXJsUGFyYSA9IFt7XG4gICAgICAgICAgXCJBY3Rpb25UeXBlXCI6IFwiQmluZFRvRmllbGRcIixcbiAgICAgICAgICBcIkZpZWxkTmFtZVwiOiBcIkZBTUlMWV9IT1VTRV9JRFwiLFxuICAgICAgICAgIFwiVmFsdWVcIjogc2VsZWN0ZWRIb3VzZS5ob3VzZUlkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcIkFjdGlvblR5cGVcIjogXCJCaW5kVG9GaWVsZFwiLFxuICAgICAgICAgIFwiRmllbGROYW1lXCI6IFwiRkFNSUxZX0hPVVNFX0NPREVfRlVMTFwiLFxuICAgICAgICAgIFwiVmFsdWVcIjogc2VsZWN0ZWRIb3VzZS5ob3VzZUNvZGVGdWxsXG4gICAgICAgIH1dO1xuICAgICAgICB2YXIgZm9ybVBhcmEgPSB0aGlzLmdldEZvcm1QYXJhKHRoaXMuYWNJbnRlcmZhY2UuZWRpdEZhbWlseUZvcm1JZCwgQmFzZVV0aWxpdHkuR2V0QWRkT3BlcmF0aW9uTmFtZSgpLCBcIlwiLCBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcobWVudVJpZ2h0VXJsUGFyYSksIFwicmVMb2FkUGVyc29uXCIpO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0QnVpbGRWaWV3LCBmb3JtUGFyYSksIHRoaXMuZ2V0Rm9ybURpYWxvZ1BhcmEoXCLmiLfnmbvorrBcIiksIDEsIHRydWUpO1xuICAgICAgfSxcbiAgICAgIGRlbFBlcnNvbjogZnVuY3Rpb24gZGVsUGVyc29uKHBhcmEpIHtcbiAgICAgICAgdmFyIHBlcnNvbklkID0gcGFyYS5yb3cucGVyc29uSWQ7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQ29uZmlybSh3aW5kb3csIFwi56Gu6K6k6KaB5Yig6Zmk5b2T5YmN5Lq65ZGY5ZCX77yfPGJyIC8+MTrpnIDopoHlhYjliKDpmaTmiLfkuK3nmoTlhbbku5bmiJDlkZgs5omN5Y+v5Lul5Yig6Zmk5oi35Li7LjxiciAvPjLliKDpmaTmiLfkuLvml7Ys5bCG5ZCM5pe25Yig6Zmk6K+l5oi355qE5L+h5oGvLlwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgQWpheFV0aWxpdHkuRGVsZXRlKHRoaXMuYWNJbnRlcmZhY2UuZGVsZXRlUGVyc29uLCB7XG4gICAgICAgICAgICBwZXJzb25JZDogcGVyc29uSWRcbiAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQocmVzdWx0Lm1lc3NhZ2UpO1xuICAgICAgICAgICAgICB0aGlzLmxvYWRQZXJzb25EYXRhKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSxcbiAgICAgIGVkaXRQZXJzb246IGZ1bmN0aW9uIGVkaXRQZXJzb24ocGFyYSkge1xuICAgICAgICB2YXIgcGVyc29uSWQgPSBwYXJhLnJvdy5wZXJzb25JZDtcbiAgICAgICAgdmFyIGZvcm1QYXJhID0gdGhpcy5nZXRGb3JtUGFyYSh0aGlzLmFjSW50ZXJmYWNlLmVkaXRQZXJzb25Gb3JtSWQsIEJhc2VVdGlsaXR5LkdldFVwZGF0ZU9wZXJhdGlvbk5hbWUoKSwgcGVyc29uSWQsIFwiXCIsIFwicmVMb2FkUGVyc29uXCIpO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0QnVpbGRWaWV3LCBmb3JtUGFyYSksIHRoaXMuZ2V0Rm9ybURpYWxvZ1BhcmEoXCLkurrlkZjkv6Hmga/nu7TmiqRcIiksIDEsIHRydWUpO1xuICAgICAgfSxcbiAgICAgIGVkaXRGYW1pbHk6IGZ1bmN0aW9uIGVkaXRGYW1pbHkocGFyYSkge1xuICAgICAgICB2YXIgcGVyc29uRmFtaWx5SWQgPSBwYXJhLnJvdy5wZXJzb25GYW1pbHlJZDtcbiAgICAgICAgdmFyIGZvcm1QYXJhID0gdGhpcy5nZXRGb3JtUGFyYSh0aGlzLmFjSW50ZXJmYWNlLmVkaXRGYW1pbHlGb3JtSWQsIEJhc2VVdGlsaXR5LkdldFVwZGF0ZU9wZXJhdGlvbk5hbWUoKSwgcGVyc29uRmFtaWx5SWQsIFwiXCIsIFwicmVMb2FkUGVyc29uXCIpO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0QnVpbGRWaWV3LCBmb3JtUGFyYSksIHRoaXMuZ2V0Rm9ybURpYWxvZ1BhcmEoXCLmiLfnmbvorrBcIiksIDEsIHRydWUpO1xuICAgICAgfSxcbiAgICAgIHZpZXdQZXJzb246IGZ1bmN0aW9uIHZpZXdQZXJzb24ocGFyYSkge1xuICAgICAgICB2YXIgcGVyc29uSWQgPSBwYXJhLnJvdy5wZXJzb25JZDtcbiAgICAgICAgdmFyIGZvcm1QYXJhID0gdGhpcy5nZXRGb3JtUGFyYSh0aGlzLmFjSW50ZXJmYWNlLmVkaXRQZXJzb25Gb3JtSWQsIEJhc2VVdGlsaXR5LkdldFZpZXdPcGVyYXRpb25OYW1lKCksIHBlcnNvbklkLCBcIlwiLCBcInJlTG9hZFBlcnNvblwiKTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZDAzLCBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0UGVyc29uVmlldywgZm9ybVBhcmEpLCB0aGlzLmdldEZvcm1EaWFsb2dQYXJhKFwi5Lq65ZGY5L+h5oGv5p+l55yLXCIpLCAxLCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICBhZGRFbnRlcnByaXNlOiBmdW5jdGlvbiBhZGRFbnRlcnByaXNlKCkge1xuICAgICAgICB2YXIgc2VsZWN0ZWRIb3VzZSA9IHRoaXMuaG91c2Uuc2VsZWN0ZWRIb3VzZTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWRIb3VzZSA9PSBudWxsKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7flhYjpgInmi6nmiL/lsYshXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtZW51UmlnaHRVcmxQYXJhID0gW3tcbiAgICAgICAgICBcIkFjdGlvblR5cGVcIjogXCJCaW5kVG9GaWVsZFwiLFxuICAgICAgICAgIFwiRmllbGROYW1lXCI6IFwiRU5UX0hPVVNFX0lEXCIsXG4gICAgICAgICAgXCJWYWx1ZVwiOiBzZWxlY3RlZEhvdXNlLmhvdXNlSWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiQWN0aW9uVHlwZVwiOiBcIkJpbmRUb0ZpZWxkXCIsXG4gICAgICAgICAgXCJGaWVsZE5hbWVcIjogXCJFTlRfSE9VU0VfQ09ERVwiLFxuICAgICAgICAgIFwiVmFsdWVcIjogc2VsZWN0ZWRIb3VzZS5ob3VzZUNvZGVGdWxsXG4gICAgICAgIH1dO1xuICAgICAgICB2YXIgZm9ybVBhcmEgPSB0aGlzLmdldEZvcm1QYXJhKHRoaXMuYWNJbnRlcmZhY2UuZWRpdEVudGVycHJpc2VGb3JtSWQsIEJhc2VVdGlsaXR5LkdldEFkZE9wZXJhdGlvbk5hbWUoKSwgXCJcIiwgSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKG1lbnVSaWdodFVybFBhcmEpLCBcInJlTG9hZEVudGVycHJpc2VcIik7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRCdWlsZFZpZXcsIGZvcm1QYXJhKSwgdGhpcy5nZXRGb3JtRGlhbG9nUGFyYShcIuS8geS4muazleS6uueZu+iusFwiKSwgMSwgdHJ1ZSk7XG4gICAgICB9LFxuICAgICAgbG9hZEVudGVycHJpc2VEYXRhOiBmdW5jdGlvbiBsb2FkRW50ZXJwcmlzZURhdGEoKSB7XG4gICAgICAgIHZhciBob3VzZUlkID0gdGhpcy5ob3VzZS5zZWxlY3RlZEhvdXNlLmhvdXNlSWQ7XG4gICAgICAgIEFqYXhVdGlsaXR5LkdldCh0aGlzLmFjSW50ZXJmYWNlLmdldEVudGVycHJpc2VCeUhvdXNlSWQsIHtcbiAgICAgICAgICBob3VzZUlkOiBob3VzZUlkXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICB0aGlzLmVudGVycHJpc2UudGFibGVEYXRhID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0sXG4gICAgICB2aWV3RW50ZXJwcmlzZTogZnVuY3Rpb24gdmlld0VudGVycHJpc2UocGFyYSkge1xuICAgICAgICB2YXIgZW50SWQgPSBwYXJhLnJvdy5lbnRJZDtcbiAgICAgICAgdmFyIGZvcm1QYXJhID0gdGhpcy5nZXRGb3JtUGFyYSh0aGlzLmFjSW50ZXJmYWNlLmVkaXRFbnRlcnByaXNlRm9ybUlkLCBCYXNlVXRpbGl0eS5HZXRWaWV3T3BlcmF0aW9uTmFtZSgpLCBlbnRJZCwgXCJcIiwgXCJyZUxvYWRFbnRlcnByaXNlXCIpO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0QnVpbGRWaWV3LCBmb3JtUGFyYSksIHRoaXMuZ2V0Rm9ybURpYWxvZ1BhcmEoXCLkvIHkuJrms5Xkurrmn6XnnItcIiksIDEsIHRydWUpO1xuICAgICAgfSxcbiAgICAgIGVkaXRFbnRlcnByaXNlOiBmdW5jdGlvbiBlZGl0RW50ZXJwcmlzZShwYXJhKSB7XG4gICAgICAgIHZhciBlbnRJZCA9IHBhcmEucm93LmVudElkO1xuICAgICAgICB2YXIgZm9ybVBhcmEgPSB0aGlzLmdldEZvcm1QYXJhKHRoaXMuYWNJbnRlcmZhY2UuZWRpdEVudGVycHJpc2VGb3JtSWQsIEJhc2VVdGlsaXR5LkdldFVwZGF0ZU9wZXJhdGlvbk5hbWUoKSwgZW50SWQsIFwiXCIsIFwicmVMb2FkRW50ZXJwcmlzZVwiKTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdEJ1aWxkVmlldywgZm9ybVBhcmEpLCB0aGlzLmdldEZvcm1EaWFsb2dQYXJhKFwi5LyB5Lia5rOV5Lq655m76K6wXCIpLCAxLCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICBkZWxFbnRlcnByaXNlOiBmdW5jdGlvbiBkZWxFbnRlcnByaXNlKHBhcmEpIHtcbiAgICAgICAgdmFyIGVudElkID0gcGFyYS5yb3cuZW50SWQ7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQ29uZmlybSh3aW5kb3csIFwi56Gu6K6k6KaB5Yig6Zmk5b2T5YmN5LyB5Lia5ZCX77yfXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBBamF4VXRpbGl0eS5EZWxldGUodGhpcy5hY0ludGVyZmFjZS5kZWxldGVFbnRlcnByaXNlLCB7XG4gICAgICAgICAgICByZWNvcmRJZDogZW50SWRcbiAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQocmVzdWx0Lm1lc3NhZ2UpO1xuICAgICAgICAgICAgICB0aGlzLmxvYWRFbnRlcnByaXNlRGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufSJdfQ==
