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
  AutoSetStatus: function AutoSetStatus(vueObject) {
    if (BaseUtility.GetUrlParaValue("streetValue")) {
      $("#sel_3l_street").attr("control_value", BaseUtility.GetUrlParaValue("streetValue"));
      vueObject.showStreetNormalBuildStatistics = false;
    }

    if (BaseUtility.GetUrlParaValue("communityValue")) {
      $("#sel_3l_community").attr("control_value", BaseUtility.GetUrlParaValue("communityValue"));
      vueObject.showStreetNormalBuildStatistics = false;
    }

    if (BaseUtility.GetUrlParaValue("gridValue")) {
      $("#sel_3l_grid").attr("control_value", BaseUtility.GetUrlParaValue("gridValue"));
      vueObject.showStreetNormalBuildStatistics = false;
    }
  },
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
    },
    template: "<div class=\"list-2column viewHouseAndPersonWrap\" style=\"height: 704px\">\n                        <div class=\"left-outer-wrap iv-list-page-wrap\" style=\"width: 650px\">\n                            <div class=\"title\">\u5EFA\u7B51\u7269\u4E2D\u623F\u5C4B\n                            </div>\n                            <i-table :columns=\"house.columnsConfig\" :data=\"house.tableData\" :height=\"listHeight\" :highlight-row=\"true\" border=\"\" class=\"iv-list-table\" @on-row-click=\"selectionHouseChange\"> \n                            </i-table>\n                          </div><div class=\"right-outer-wrap iv-list-page-wrap\" style=\"padding: 10px;left: 660px;right: 0px;\">\n                            <div class=\"title\">\u623F\u5C4B\u4E2D\u4EBA\u53E3\n                            </div>\n                            <i-table :columns=\"person.columnsConfig\" :data=\"person.tableData\" :height=\"listHeight\" :highlight-row=\"true\" border=\"\" class=\"iv-list-table\" stripe=\"\"> \n                            </i-table>\n                          </div>\n                    </div>"
  });
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRyb2xTdGF0dXNVdGlsaXR5LmpzIiwiRGF0YVZhbGlkYXRlVXRpbGl0eS5qcyIsIkVDaGFydHNVdGlsaXR5LmpzIiwiRXZlbnRVdGlsaXR5LmpzIiwiT3JnYW4zRERMLmpzIiwiVmlld0hvdXNlQW5kUGVyc29uV3JhcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJHcmlkVXRpbGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ29udHJvbFN0YXR1c1V0aWxpdHkgPSB7XG4gIERpc2FibGVBdFVwZGF0ZVN0YXR1czogZnVuY3Rpb24gRGlzYWJsZUF0VXBkYXRlU3RhdHVzKHdlYkZvcm1SVFBhcmFzLCBjb250cm9sSWQpIHtcbiAgICBpZiAod2ViRm9ybVJUUGFyYXMuT3BlcmF0aW9uVHlwZSA9PSBCYXNlVXRpbGl0eS5HZXRVcGRhdGVPcGVyYXRpb25OYW1lKCkpIHtcbiAgICAgICQoXCIjXCIgKyBjb250cm9sSWQpLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERhdGFWYWxpZGF0ZVV0aWxpdHkgPSB7XG4gIHRlc3RCdWlsZENvZGVFcnJvcjogZnVuY3Rpb24gdGVzdEJ1aWxkQ29kZUVycm9yKCRlbGVtKSB7XG4gICAgdmFyIGNvZGUgPSAkZWxlbS52YWwoKTtcblxuICAgIGlmIChjb2RlLmxlbmd0aCAhPSAxOCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJGVsZW06ICRlbGVtLFxuICAgICAgICBlcnJvcnM6IFtcIuW7uuetkeeJqee8lueggemVv+W6puW/hemhu+S4ujE45L2NIVwiXSxcbiAgICAgICAgbGFiTmFtZTogXCLnvJbnoIHplJnor69cIlxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgdGVzdEhvdXNlQ29kZUVycm9yOiBmdW5jdGlvbiB0ZXN0SG91c2VDb2RlRXJyb3IoJGVsZW0pIHtcbiAgICB2YXIgY29kZSA9ICRlbGVtLnZhbCgpO1xuXG4gICAgaWYgKGNvZGUubGVuZ3RoICE9IDUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICRlbGVtOiAkZWxlbSxcbiAgICAgICAgZXJyb3JzOiBbXCLmiL/lsYvnvJbnoIHplb/luqblv4XpobvkuLo15L2NIVwiXSxcbiAgICAgICAgbGFiTmFtZTogXCLnvJbnoIHplJnor69cIlxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVDaGFydHNVdGlsaXR5ID0ge1xuICBBdXRvU2V0U3RhdHVzOiBmdW5jdGlvbiBBdXRvU2V0U3RhdHVzKHZ1ZU9iamVjdCkge1xuICAgIGlmIChCYXNlVXRpbGl0eS5HZXRVcmxQYXJhVmFsdWUoXCJzdHJlZXRWYWx1ZVwiKSkge1xuICAgICAgJChcIiNzZWxfM2xfc3RyZWV0XCIpLmF0dHIoXCJjb250cm9sX3ZhbHVlXCIsIEJhc2VVdGlsaXR5LkdldFVybFBhcmFWYWx1ZShcInN0cmVldFZhbHVlXCIpKTtcbiAgICAgIHZ1ZU9iamVjdC5zaG93U3RyZWV0Tm9ybWFsQnVpbGRTdGF0aXN0aWNzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKEJhc2VVdGlsaXR5LkdldFVybFBhcmFWYWx1ZShcImNvbW11bml0eVZhbHVlXCIpKSB7XG4gICAgICAkKFwiI3NlbF8zbF9jb21tdW5pdHlcIikuYXR0cihcImNvbnRyb2xfdmFsdWVcIiwgQmFzZVV0aWxpdHkuR2V0VXJsUGFyYVZhbHVlKFwiY29tbXVuaXR5VmFsdWVcIikpO1xuICAgICAgdnVlT2JqZWN0LnNob3dTdHJlZXROb3JtYWxCdWlsZFN0YXRpc3RpY3MgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoQmFzZVV0aWxpdHkuR2V0VXJsUGFyYVZhbHVlKFwiZ3JpZFZhbHVlXCIpKSB7XG4gICAgICAkKFwiI3NlbF8zbF9ncmlkXCIpLmF0dHIoXCJjb250cm9sX3ZhbHVlXCIsIEJhc2VVdGlsaXR5LkdldFVybFBhcmFWYWx1ZShcImdyaWRWYWx1ZVwiKSk7XG4gICAgICB2dWVPYmplY3Quc2hvd1N0cmVldE5vcm1hbEJ1aWxkU3RhdGlzdGljcyA9IGZhbHNlO1xuICAgIH1cbiAgfSxcbiAgRmV0Y2hEYXRhT3JnYW5GaWx0ZXI6IGZ1bmN0aW9uIEZldGNoRGF0YU9yZ2FuRmlsdGVyKHVybCwgc3RyZWV0VmFsdWUsIGNvbW11bml0eVZhbHVlLCBncmlkVmFsdWUsIGZ1bmMsIGNhbGxlcikge1xuICAgIEFqYXhVdGlsaXR5LkdldCh1cmwsIHtcbiAgICAgIHN0cmVldFZhbHVlOiBzdHJlZXRWYWx1ZSxcbiAgICAgIGNvbW11bml0eVZhbHVlOiBjb21tdW5pdHlWYWx1ZSxcbiAgICAgIGdyaWRWYWx1ZTogZ3JpZFZhbHVlXG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIGZ1bmMocmVzdWx0KTtcbiAgICAgIH1cbiAgICB9LCBjYWxsZXIpO1xuICB9LFxuICBCdWlsZE5vcm1hbFBpZU9wdGlvbjogZnVuY3Rpb24gQnVpbGROb3JtYWxQaWVPcHRpb24oZGF0YUxpc3QsIHNlcmllc05hbWUsIHRpdGxlLCByYWRpdXMpIHtcbiAgICB2YXIgbGVnZW5kQ29uZmlnID0ge1xuICAgICAgb3JpZW50OiAndmVydGljYWwnLFxuICAgICAgbGVmdDogJ2xlZnQnLFxuICAgICAgZGF0YTogW11cbiAgICB9O1xuICAgIHZhciBzZXJpZXNEYXRhQ29uZmlnID0gW107XG4gICAgdmFyIHN1YlRpdGxlID0gXCJcIjtcbiAgICB2YXIgdmFsdWVDb3VudCA9IDA7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZWdlbmRDb25maWcuZGF0YS5wdXNoKGRhdGFMaXN0W2ldLk5BTUUpO1xuICAgICAgc2VyaWVzRGF0YUNvbmZpZy5wdXNoKHtcbiAgICAgICAgdmFsdWU6IGRhdGFMaXN0W2ldLlZBTFVFLFxuICAgICAgICBuYW1lOiBkYXRhTGlzdFtpXS5OQU1FXG4gICAgICB9KTtcbiAgICAgIHZhbHVlQ291bnQgKz0gcGFyc2VGbG9hdChkYXRhTGlzdFtpXS5WQUxVRSk7XG4gICAgfVxuXG4gICAgc3ViVGl0bGUgPSBcIuaAu+aVsDpcIiArIHZhbHVlQ291bnQ7XG5cbiAgICBpZiAoIXJhZGl1cykge1xuICAgICAgcmFkaXVzID0gJzYwJSc7XG4gICAgfVxuXG4gICAgdmFyIHNlcmllc0NvbmZpZyA9IFt7XG4gICAgICBuYW1lOiBzZXJpZXNOYW1lLFxuICAgICAgdHlwZTogJ3BpZScsXG4gICAgICByYWRpdXM6IHJhZGl1cyxcbiAgICAgIGNlbnRlcjogWyc1MCUnLCAnNjAlJ10sXG4gICAgICBkYXRhOiBzZXJpZXNEYXRhQ29uZmlnLFxuICAgICAgbGFiZWw6IHtcbiAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgZm9ybWF0dGVyOiAne2J9OiB7Y30nLFxuICAgICAgICBhbGlnblRvOiAnbGFiZWxMaW5lJ1xuICAgICAgfSxcbiAgICAgIGVtcGhhc2lzOiB7XG4gICAgICAgIGl0ZW1TdHlsZToge1xuICAgICAgICAgIHNoYWRvd0JsdXI6IDEwLFxuICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXG4gICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XTtcbiAgICB2YXIgb3B0aW9uID0ge1xuICAgICAgdGl0bGU6IHtcbiAgICAgICAgdGV4dDogdGl0bGUsXG4gICAgICAgIHN1YnRleHQ6IHN1YlRpdGxlLFxuICAgICAgICBsZWZ0OiAnY2VudGVyJ1xuICAgICAgfSxcbiAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxuICAgICAgICBmb3JtYXR0ZXI6ICd7YX0gPGJyLz57Yn0gOiB7Y30gKHtkfSUpJ1xuICAgICAgfSxcbiAgICAgIGxlZ2VuZDogbGVnZW5kQ29uZmlnLFxuICAgICAgc2VyaWVzOiBzZXJpZXNDb25maWdcbiAgICB9O1xuICAgIHJldHVybiBvcHRpb247XG4gIH0sXG4gIEJ1aWxkTm9ybWFsQmFyT3B0aW9uOiBmdW5jdGlvbiBCdWlsZE5vcm1hbEJhck9wdGlvbihkYXRhTGlzdCwgc2VyaWVzTmFtZSwgdGl0bGUpIHtcbiAgICB2YXIgeEF4aXNDb25maWcgPSB7XG4gICAgICB0eXBlOiAnY2F0ZWdvcnknLFxuICAgICAgZGF0YTogW10sXG4gICAgICBheGlzVGljazoge1xuICAgICAgICBhbGlnbldpdGhMYWJlbDogdHJ1ZSxcbiAgICAgICAgaW50ZXJ2YWw6IDBcbiAgICAgIH0sXG4gICAgICBheGlzTGFiZWw6IHtcbiAgICAgICAgaW50ZXJ2YWw6IDBcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBzZXJpZXNEYXRhQ29uZmlnID0gW107XG4gICAgdmFyIHN1YlRpdGxlID0gXCJcIjtcbiAgICB2YXIgdmFsdWVDb3VudCA9IDA7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB4QXhpc0NvbmZpZy5kYXRhLnB1c2goZGF0YUxpc3RbaV0uTkFNRSk7XG4gICAgICBzZXJpZXNEYXRhQ29uZmlnLnB1c2goe1xuICAgICAgICB2YWx1ZTogZGF0YUxpc3RbaV0uVkFMVUUsXG4gICAgICAgIG5hbWU6IGRhdGFMaXN0W2ldLk5BTUVcbiAgICAgIH0pO1xuICAgICAgdmFsdWVDb3VudCArPSBwYXJzZUZsb2F0KGRhdGFMaXN0W2ldLlZBTFVFKTtcbiAgICB9XG5cbiAgICBzdWJUaXRsZSA9IFwi5oC75pWwOlwiICsgdmFsdWVDb3VudDtcbiAgICB2YXIgc2VyaWVzQ29uZmlnID0gW3tcbiAgICAgIG5hbWU6IHNlcmllc05hbWUsXG4gICAgICB0eXBlOiAnYmFyJyxcbiAgICAgIGRhdGE6IHNlcmllc0RhdGFDb25maWcsXG4gICAgICBsYWJlbDoge1xuICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICBmb3JtYXR0ZXI6ICd7Y30nLFxuICAgICAgICBhbGlnblRvOiAnbGFiZWxMaW5lJ1xuICAgICAgfSxcbiAgICAgIGVtcGhhc2lzOiB7XG4gICAgICAgIGl0ZW1TdHlsZToge1xuICAgICAgICAgIHNoYWRvd0JsdXI6IDEwLFxuICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXG4gICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XTtcbiAgICB2YXIgb3B0aW9uID0ge1xuICAgICAgdGl0bGU6IHtcbiAgICAgICAgdGV4dDogdGl0bGUsXG4gICAgICAgIHN1YnRleHQ6IHN1YlRpdGxlLFxuICAgICAgICBsZWZ0OiAnY2VudGVyJ1xuICAgICAgfSxcbiAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxuICAgICAgICBmb3JtYXR0ZXI6ICd7YX0gPGJyLz57Yn0gOiB7Y30nXG4gICAgICB9LFxuICAgICAgZ3JpZDoge1xuICAgICAgICBsZWZ0OiBcIjYlXCIsXG4gICAgICAgIHJpZ2h0OiBcIjYlXCIsXG4gICAgICAgIGJvdHRvbTogMjBcbiAgICAgIH0sXG4gICAgICB4QXhpczogW3hBeGlzQ29uZmlnXSxcbiAgICAgIHlBeGlzOiBbe1xuICAgICAgICB0eXBlOiAndmFsdWUnXG4gICAgICB9XSxcbiAgICAgIHNlcmllczogc2VyaWVzQ29uZmlnXG4gICAgfTtcbiAgICByZXR1cm4gb3B0aW9uO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRXZlbnRVdGlsaXR5ID0ge1xuICBFdmVudFR5cGVDaGFuZ2VFdmVudDogZnVuY3Rpb24gRXZlbnRUeXBlQ2hhbmdlRXZlbnQoKSB7XG4gICAgdmFyIHR5cGUxXzFfMl9ncm91cF9rZXkgPSBcIjQwOWExYmJmLTljNTMtNGVjOS04ZDc3LThmNWRmNmIyZThmYVwiO1xuICAgIHZhciB0eXBlMV8yXzJfZ3JvdXBfa2V5ID0gXCI3ZTM2YTIwOC0yOTI3LTRhZDAtODkyYi0wNDAzYzZlMWIzZDhcIjtcbiAgICB2YXIgdHlwZTFWYWx1ZSA9ICQoXCIjcmFkaW9fZ3JvdXBfZXZlbnRfdHlwZV8xXCIpLnZhbCgpO1xuXG4gICAgaWYgKHR5cGUxVmFsdWUgPT0gXCLnn5vnm77nuqDnurdcIikge30gZWxzZSBpZiAodHlwZTFWYWx1ZSA9PSBcIumXrumimOmakOaCo1wiKSB7fVxuXG4gICAgJChcIiNyYWRpb19ncm91cF9ldmVudF90eXBlXzFcIikuY2hhbmdlKCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBPcmdhbjNEREwgPSB7XG4gIF9wcm9wOiB7XG4gICAgbXlTZXNzaW9uRGF0YTogbnVsbCxcbiAgICBteUdyaWREYXRhOiBudWxsLFxuICAgIG15Q29tbXVuaXR5RGF0YTogbnVsbCxcbiAgICBteVN0cmVldERhdGE6IG51bGwsXG4gICAgYWxsT3JnYW5NaW5Qcm9wOiBudWxsLFxuICAgIG9wZXJhdGlvbk5hbWU6IFwiXCIsXG4gICAgZGRsU3RyZWV0Q29udHJvbDogbnVsbCxcbiAgICBvbGRERExTdHJlZXRDb250cm9sVmFsdWU6IFwiXCIsXG4gICAgZGRsQ29tbXVuaXR5Q29udHJvbDogbnVsbCxcbiAgICBvbGRERExDb21tdW5pdHlDb250cm9sVmFsdWU6IFwiXCIsXG4gICAgZGRsR3JpZENvbnRyb2w6IG51bGwsXG4gICAgb2xkRERMR3JpZENvbnRyb2xWYWx1ZTogXCJcIixcbiAgICBjaGFuZ2VFbmFibGU6IHRydWUsXG4gICAgaW5pdEVuZEZ1bmM6IG51bGxcbiAgfSxcbiAgR2V0T3JnYW5EYXRhOiBmdW5jdGlvbiBHZXRPcmdhbkRhdGEoZW5kRnVuYykge1xuICAgIEFqYXhVdGlsaXR5LkdldChcIi9SZXN0L0dyaWQvU1NPUHJveHkvT3JnYW5BbmRVc2VyL0dldEFMTE9yZ2FuTWluUHJvcERhdGFcIiwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgICAgICB0aGlzLl9wcm9wLm15U2Vzc2lvbkRhdGEgPSByZXN1bHQuZGF0YS5NeVNlc3Npb25EYXRhO1xuICAgICAgICB2YXIgbXlPcmdhbklkID0gcmVzdWx0LmRhdGEuTXlTZXNzaW9uRGF0YS5vcmdhbklkO1xuICAgICAgICB0aGlzLl9wcm9wLmFsbE9yZ2FuTWluUHJvcCA9IHJlc3VsdC5kYXRhLkFMTE9yZ2FuTWluUHJvcDtcbiAgICAgICAgdmFyIG15T3JnYW5EYXRhID0gQXJyYXlVdGlsaXR5LldoZXJlU2luZ2xlKHRoaXMuX3Byb3AuYWxsT3JnYW5NaW5Qcm9wLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLm9yZ2FuSWQgPT0gbXlPcmdhbklkO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAobXlPcmdhbkRhdGEub3JnYW5UeXBlVmFsdWUgPT0gXCJHcmlkVW5pdFwiKSB7XG4gICAgICAgICAgdGhpcy5fcHJvcC5teUdyaWREYXRhID0gbXlPcmdhbkRhdGE7XG4gICAgICAgICAgdmFyIHBhcmVudE9yZ2FuSWQgPSBteU9yZ2FuRGF0YS5vcmdhblBhcmVudElkO1xuICAgICAgICAgIHRoaXMuX3Byb3AubXlDb21tdW5pdHlEYXRhID0gQXJyYXlVdGlsaXR5LldoZXJlU2luZ2xlKHRoaXMuX3Byb3AuYWxsT3JnYW5NaW5Qcm9wLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ub3JnYW5JZCA9PSBwYXJlbnRPcmdhbklkO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHBhcmVudE9yZ2FuSWQgPSB0aGlzLl9wcm9wLm15Q29tbXVuaXR5RGF0YS5vcmdhblBhcmVudElkO1xuICAgICAgICAgIHRoaXMuX3Byb3AubXlTdHJlZXREYXRhID0gQXJyYXlVdGlsaXR5LldoZXJlU2luZ2xlKHRoaXMuX3Byb3AuYWxsT3JnYW5NaW5Qcm9wLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ub3JnYW5JZCA9PSBwYXJlbnRPcmdhbklkO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKG15T3JnYW5EYXRhLm9yZ2FuVHlwZVZhbHVlID09IFwiQ29tbXVuaXR5XCIpIHtcbiAgICAgICAgICB0aGlzLl9wcm9wLm15Q29tbXVuaXR5RGF0YSA9IG15T3JnYW5EYXRhO1xuICAgICAgICAgIHZhciBwYXJlbnRPcmdhbklkID0gdGhpcy5fcHJvcC5teUNvbW11bml0eURhdGEub3JnYW5QYXJlbnRJZDtcbiAgICAgICAgICB0aGlzLl9wcm9wLm15U3RyZWV0RGF0YSA9IEFycmF5VXRpbGl0eS5XaGVyZVNpbmdsZSh0aGlzLl9wcm9wLmFsbE9yZ2FuTWluUHJvcCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm9yZ2FuSWQgPT0gcGFyZW50T3JnYW5JZDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChteU9yZ2FuRGF0YS5vcmdhblR5cGVWYWx1ZSA9PSBcIlN0cmVldFwiKSB7XG4gICAgICAgICAgdGhpcy5fcHJvcC5teVN0cmVldERhdGEgPSBteU9yZ2FuRGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVuZEZ1bmMuY2FsbCh0aGlzLCByZXN1bHQuZGF0YSk7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIEluaXQzRERMOiBmdW5jdGlvbiBJbml0M0RETChkZGxTdHJlZXRDb250cm9sSWQsIGRkbENvbW11bml0eUNvbnRyb2xJZCwgZGRsR3JpZENvbnRyb2xJZCwgb3BlcmF0aW9uTmFtZSwgY2hhbmdlRW5hYmxlLCBpbml0RW5kRnVuYykge1xuICAgIHRoaXMuX3Byb3Aub3BlcmF0aW9uTmFtZSA9IG9wZXJhdGlvbk5hbWU7XG4gICAgdGhpcy5fcHJvcC5kZGxTdHJlZXRDb250cm9sID0gJChcIiNcIiArIGRkbFN0cmVldENvbnRyb2xJZCk7XG4gICAgdGhpcy5fcHJvcC5vbGRERExTdHJlZXRDb250cm9sVmFsdWUgPSB0aGlzLl9wcm9wLmRkbFN0cmVldENvbnRyb2wuYXR0cihcImNvbnRyb2xfdmFsdWVcIik7XG4gICAgdGhpcy5fcHJvcC5kZGxDb21tdW5pdHlDb250cm9sID0gJChcIiNcIiArIGRkbENvbW11bml0eUNvbnRyb2xJZCk7XG4gICAgdGhpcy5fcHJvcC5vbGRERExDb21tdW5pdHlDb250cm9sVmFsdWUgPSB0aGlzLl9wcm9wLmRkbENvbW11bml0eUNvbnRyb2wuYXR0cihcImNvbnRyb2xfdmFsdWVcIik7XG4gICAgdGhpcy5fcHJvcC5kZGxHcmlkQ29udHJvbCA9ICQoXCIjXCIgKyBkZGxHcmlkQ29udHJvbElkKTtcbiAgICB0aGlzLl9wcm9wLm9sZERETEdyaWRDb250cm9sVmFsdWUgPSB0aGlzLl9wcm9wLmRkbEdyaWRDb250cm9sLmF0dHIoXCJjb250cm9sX3ZhbHVlXCIpO1xuICAgIHRoaXMuX3Byb3AuY2hhbmdlRW5hYmxlID0gY2hhbmdlRW5hYmxlO1xuICAgIHRoaXMuX3Byb3AuaW5pdEVuZEZ1bmMgPSBpbml0RW5kRnVuYztcbiAgICB0aGlzLkdldE9yZ2FuRGF0YShmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAob3BlcmF0aW9uTmFtZSA9PSBCYXNlVXRpbGl0eS5HZXRWaWV3T3BlcmF0aW9uTmFtZSgpKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHN0cmVldERhdGEgPSBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUodGhpcy5fcHJvcC5hbGxPcmdhbk1pblByb3AsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ub3JnYW5JZCA9PSBfdGhpcy5fcHJvcC5vbGRERExTdHJlZXRDb250cm9sVmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgY29tbXVuaXR5RGF0YSA9IEFycmF5VXRpbGl0eS5XaGVyZVNpbmdsZSh0aGlzLl9wcm9wLmFsbE9yZ2FuTWluUHJvcCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5vcmdhbklkID09IF90aGlzLl9wcm9wLm9sZERETENvbW11bml0eUNvbnRyb2xWYWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBncmlkRGF0YSA9IEFycmF5VXRpbGl0eS5XaGVyZVNpbmdsZSh0aGlzLl9wcm9wLmFsbE9yZ2FuTWluUHJvcCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5vcmdhbklkID09IF90aGlzLl9wcm9wLm9sZERETEdyaWRDb250cm9sVmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3Byb3AuZGRsU3RyZWV0Q29udHJvbC50ZXh0KHN0cmVldERhdGEub3JnYW5OYW1lKTtcblxuICAgICAgICB0aGlzLl9wcm9wLmRkbENvbW11bml0eUNvbnRyb2wudGV4dChjb21tdW5pdHlEYXRhLm9yZ2FuTmFtZSk7XG5cbiAgICAgICAgdGhpcy5fcHJvcC5kZGxHcmlkQ29udHJvbC50ZXh0KGdyaWREYXRhLm9yZ2FuTmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLkJpbmQzRERMKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5fcHJvcC5pbml0RW5kRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhpcy5fcHJvcC5pbml0RW5kRnVuYygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLl9wcm9wLmNoYW5nZUVuYWJsZSkge1xuICAgICAgdGhpcy5fcHJvcC5kZGxTdHJlZXRDb250cm9sLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuXG4gICAgICB0aGlzLl9wcm9wLmRkbENvbW11bml0eUNvbnRyb2wuYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG5cbiAgICAgIHRoaXMuX3Byb3AuZGRsR3JpZENvbnRyb2wuYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgfVxuICB9LFxuICBCaW5kM0RETDogZnVuY3Rpb24gQmluZDNEREwoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBzdHJlZXREYXRhTGlzdCA9IEFycmF5VXRpbGl0eS5XaGVyZSh0aGlzLl9wcm9wLmFsbE9yZ2FuTWluUHJvcCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLm9yZ2FuVHlwZVZhbHVlID09IFwiU3RyZWV0XCI7XG4gICAgfSk7XG4gICAgdGhpcy5CaW5kU2luZ2xlRERMKHRoaXMuX3Byb3AuZGRsU3RyZWV0Q29udHJvbCwgc3RyZWV0RGF0YUxpc3QpO1xuICAgIHZhciBzZWxlY3RlZFN0cmVldFZhbHVlID0gdGhpcy5UcnlBdXRvU2V0U3RyZWV0KCk7XG5cbiAgICB0aGlzLl9wcm9wLmRkbFN0cmVldENvbnRyb2wuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBuZXdTZWxlY3RlZFN0cmVldFZhbHVlID0gJCh0aGlzKS52YWwoKTtcblxuICAgICAgX3RoaXMuU3RyZWV0Q29udHJvbENoYW5nZShuZXdTZWxlY3RlZFN0cmVldFZhbHVlKTtcbiAgICB9KTtcblxuICAgIHZhciBjb21tdW5pdHlEYXRhTGlzdCA9IEFycmF5VXRpbGl0eS5XaGVyZSh0aGlzLl9wcm9wLmFsbE9yZ2FuTWluUHJvcCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLm9yZ2FuUGFyZW50SWQgPT0gc2VsZWN0ZWRTdHJlZXRWYWx1ZTtcbiAgICB9KTtcbiAgICB0aGlzLkJpbmRTaW5nbGVEREwodGhpcy5fcHJvcC5kZGxDb21tdW5pdHlDb250cm9sLCBjb21tdW5pdHlEYXRhTGlzdCk7XG4gICAgdmFyIHNlbGVjdGVkQ29tbXVuaXR5VmFsdWUgPSB0aGlzLlRyeUF1dG9TZXRDb21tdW5pdHkoKTtcblxuICAgIHRoaXMuX3Byb3AuZGRsQ29tbXVuaXR5Q29udHJvbC5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG5ld1NlbGVjdGVkQ29tbXVuaXR5VmFsdWUgPSAkKHRoaXMpLnZhbCgpO1xuXG4gICAgICBfdGhpcy5Db21tdW5pdHlDb250cm9sQ2hhbmdlKG5ld1NlbGVjdGVkQ29tbXVuaXR5VmFsdWUpO1xuICAgIH0pO1xuXG4gICAgdmFyIGdyaWREYXRhTGlzdCA9IEFycmF5VXRpbGl0eS5XaGVyZSh0aGlzLl9wcm9wLmFsbE9yZ2FuTWluUHJvcCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLm9yZ2FuUGFyZW50SWQgPT0gc2VsZWN0ZWRDb21tdW5pdHlWYWx1ZTtcbiAgICB9KTtcbiAgICB0aGlzLkJpbmRTaW5nbGVEREwodGhpcy5fcHJvcC5kZGxHcmlkQ29udHJvbCwgZ3JpZERhdGFMaXN0KTtcbiAgICB0aGlzLlRyeUF1dG9TZXRHcmlkKCk7XG4gIH0sXG4gIFRyeUF1dG9TZXRTdHJlZXQ6IGZ1bmN0aW9uIFRyeUF1dG9TZXRTdHJlZXQoKSB7XG4gICAgdmFyIHNlbGVjdGVkVmFsdWUgPSB0aGlzLl9wcm9wLm9sZERETFN0cmVldENvbnRyb2xWYWx1ZTtcblxuICAgIGlmICghc2VsZWN0ZWRWYWx1ZSAmJiB0aGlzLl9wcm9wLm15U3RyZWV0RGF0YSkge1xuICAgICAgc2VsZWN0ZWRWYWx1ZSA9IHRoaXMuX3Byb3AubXlTdHJlZXREYXRhLm9yZ2FuSWQ7XG4gICAgfVxuXG4gICAgaWYgKHNlbGVjdGVkVmFsdWUpIHtcbiAgICAgIHRoaXMuX3Byb3AuZGRsU3RyZWV0Q29udHJvbC52YWwoc2VsZWN0ZWRWYWx1ZSk7XG5cbiAgICAgIHJldHVybiBzZWxlY3RlZFZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wcm9wLmRkbFN0cmVldENvbnRyb2wudmFsKCk7XG4gIH0sXG4gIFRyeUF1dG9TZXRDb21tdW5pdHk6IGZ1bmN0aW9uIFRyeUF1dG9TZXRDb21tdW5pdHkoKSB7XG4gICAgdmFyIHNlbGVjdGVkVmFsdWUgPSB0aGlzLl9wcm9wLm9sZERETENvbW11bml0eUNvbnRyb2xWYWx1ZTtcblxuICAgIGlmICghc2VsZWN0ZWRWYWx1ZSAmJiB0aGlzLl9wcm9wLm15Q29tbXVuaXR5RGF0YSkge1xuICAgICAgc2VsZWN0ZWRWYWx1ZSA9IHRoaXMuX3Byb3AubXlDb21tdW5pdHlEYXRhLm9yZ2FuSWQ7XG4gICAgfVxuXG4gICAgaWYgKHNlbGVjdGVkVmFsdWUpIHtcbiAgICAgIHRoaXMuX3Byb3AuZGRsQ29tbXVuaXR5Q29udHJvbC52YWwoc2VsZWN0ZWRWYWx1ZSk7XG5cbiAgICAgIHJldHVybiBzZWxlY3RlZFZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wcm9wLmRkbENvbW11bml0eUNvbnRyb2wudmFsKCk7XG4gIH0sXG4gIFRyeUF1dG9TZXRHcmlkOiBmdW5jdGlvbiBUcnlBdXRvU2V0R3JpZCgpIHtcbiAgICB2YXIgc2VsZWN0ZWRWYWx1ZSA9IHRoaXMuX3Byb3Aub2xkRERMR3JpZENvbnRyb2xWYWx1ZTtcblxuICAgIGlmICghc2VsZWN0ZWRWYWx1ZSAmJiB0aGlzLl9wcm9wLm15R3JpZERhdGEpIHtcbiAgICAgIHNlbGVjdGVkVmFsdWUgPSB0aGlzLl9wcm9wLm15R3JpZERhdGEub3JnYW5JZDtcbiAgICB9XG5cbiAgICBpZiAoc2VsZWN0ZWRWYWx1ZSkge1xuICAgICAgdGhpcy5fcHJvcC5kZGxHcmlkQ29udHJvbC52YWwoc2VsZWN0ZWRWYWx1ZSk7XG5cbiAgICAgIHJldHVybiBzZWxlY3RlZFZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wcm9wLmRkbEdyaWRDb250cm9sLnZhbCgpO1xuICB9LFxuICBCaW5kU2luZ2xlRERMOiBmdW5jdGlvbiBCaW5kU2luZ2xlRERMKGRkbENvbnRyb2wsIG9yZ2FuRGF0YUxpc3QpIHtcbiAgICBkZGxDb250cm9sLmh0bWwoXCJcIik7XG4gICAgZGRsQ29udHJvbC5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPScgJz4tLeivt+mAieaLqS0tPC9vcHRpb24+XCIpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmdhbkRhdGFMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb3JnYW5EYXRhID0gb3JnYW5EYXRhTGlzdFtpXTtcbiAgICAgIHZhciBzZWwgPSBcIjxvcHRpb24gdmFsdWU9J1wiICsgb3JnYW5EYXRhLm9yZ2FuSWQgKyBcIic+XCIgKyBvcmdhbkRhdGEub3JnYW5OYW1lICsgXCI8L29wdGlvbj5cIjtcbiAgICAgIGRkbENvbnRyb2wuYXBwZW5kKHNlbCk7XG4gICAgfVxuICB9LFxuICBTdHJlZXRDb250cm9sQ2hhbmdlOiBmdW5jdGlvbiBTdHJlZXRDb250cm9sQ2hhbmdlKG5ld1NlbGVjdGVkU3RyZWV0VmFsdWUpIHtcbiAgICB2YXIgY29tbXVuaXR5RGF0YUxpc3QgPSBBcnJheVV0aWxpdHkuV2hlcmUodGhpcy5fcHJvcC5hbGxPcmdhbk1pblByb3AsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5vcmdhblBhcmVudElkID09IG5ld1NlbGVjdGVkU3RyZWV0VmFsdWU7XG4gICAgfSk7XG4gICAgdGhpcy5CaW5kU2luZ2xlRERMKHRoaXMuX3Byb3AuZGRsQ29tbXVuaXR5Q29udHJvbCwgY29tbXVuaXR5RGF0YUxpc3QpO1xuXG4gICAgdGhpcy5fcHJvcC5kZGxHcmlkQ29udHJvbC5odG1sKFwiXCIpO1xuXG4gICAgdGhpcy5fcHJvcC5kZGxHcmlkQ29udHJvbC5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPScgJz4tLeivt+mAieaLqS0tPC9vcHRpb24+XCIpO1xuICB9LFxuICBDb21tdW5pdHlDb250cm9sQ2hhbmdlOiBmdW5jdGlvbiBDb21tdW5pdHlDb250cm9sQ2hhbmdlKG5ld1NlbGVjdGVkQ29tbXVuaXR5VmFsdWUpIHtcbiAgICB2YXIgZ3JpZERhdGFMaXN0ID0gQXJyYXlVdGlsaXR5LldoZXJlKHRoaXMuX3Byb3AuYWxsT3JnYW5NaW5Qcm9wLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0ub3JnYW5QYXJlbnRJZCA9PSBuZXdTZWxlY3RlZENvbW11bml0eVZhbHVlO1xuICAgIH0pO1xuICAgIHRoaXMuQmluZFNpbmdsZURETCh0aGlzLl9wcm9wLmRkbEdyaWRDb250cm9sLCBncmlkRGF0YUxpc3QpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5pZiAoJChcIiN2aWV3SG91c2VBbmRQZXJzb25XcmFwXCIpLmxlbmd0aCA+IDApIHtcbiAgdmFyIFZpZXdIb3VzZUFuZFBlcnNvbldyYXAgPSBuZXcgVnVlKHtcbiAgICBlbDogXCIjdmlld0hvdXNlQW5kUGVyc29uV3JhcFwiLFxuICAgIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgICB2YXIgd2luZG93SGVpZ2h0ID0gQmFzZVV0aWxpdHkuR2V0VXJsUGFyYVZhbHVlKFwid2luZG93SGVpZ2h0XCIpO1xuICAgICAgdmFyIGJ1aWxkSWQgPSBCYXNlVXRpbGl0eS5HZXRVcmxQYXJhVmFsdWUoXCJyZWNvcmRJZFwiKTtcbiAgICAgICQoXCIjdmlld0hvdXNlQW5kUGVyc29uV3JhcFwiKS5oZWlnaHQod2luZG93SGVpZ2h0IC0gMjAwKTtcbiAgICAgIHRoaXMubGlzdEhlaWdodCA9IHdpbmRvd0hlaWdodCAtIDI2MDtcbiAgICAgIHRoaXMubG9hZEhvdXNlRGF0YShidWlsZElkKTtcbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldEhvdXNlQnlCdWlsZElkOiBcIi9SZXN0L0dyaWQvQnVpbGQvSG91c2VJbmZvL0dldEhvdXNlQnlCdWlsZElkXCIsXG4gICAgICAgIGVkaXRIb3VzZVZpZXc6IFwiL0hUTUwvQnVpbGRlci9SdW50aW1lL1dlYkZvcm1JbmRlcGVuZGVuY2VSdW50aW1lLmh0bWxcIixcbiAgICAgICAgZWRpdEhvdXNlRm9ybUlkOiBcImNjZmRhYzYzLWQ5ZDctNGE2Ny1hZDlmLTc0N2U4OGE0OGY1ZFwiLFxuICAgICAgICBkZWxldGVIb3VzZTogXCIvUmVzdC9HcmlkL0J1aWxkL0hvdXNlSW5mby9EZWxldGVcIixcbiAgICAgICAgZWRpdFBlcnNvblZpZXc6IFwiL0hUTUwvQnVpbGRlci9SdW50aW1lL1dlYkZvcm1JbmRlcGVuZGVuY2VSdW50aW1lLmh0bWxcIixcbiAgICAgICAgZWRpdEZhbWlseUZvcm1JZDogXCIxNDg4ZWU1MC1lZmI2LTQwOWEtYWZjNy1lYjBmOTcxMDcxM2ZcIixcbiAgICAgICAgZWRpdFBlcnNvbkZvcm1JZDogXCI1ZDZkZTM4OC1jZTFlLTQzYzctYjU5Mi1jOWU4MGI3MTQzNWNcIixcbiAgICAgICAgZ2V0UGVyc29uQnlIb3VzZUlkOiBcIi9SZXN0L0dyaWQvUGVyc29uL1BlcnNvbk1haW4vR2V0UGVyc29uQnlIb3VzZUlkXCIsXG4gICAgICAgIGRlbGV0ZVBlcnNvbjogXCIvUmVzdC9HcmlkL1BlcnNvbi9QZXJzb25NYWluL0RlbGV0ZVBlcnNvbldpdGhGYW1pbHlcIixcbiAgICAgICAgZWRpdEVudGVycHJpc2VWaWV3OiBcIi9IVE1ML0J1aWxkZXIvUnVudGltZS9XZWJGb3JtSW5kZXBlbmRlbmNlUnVudGltZS5odG1sXCIsXG4gICAgICAgIGVkaXRFbnRlcnByaXNlRm9ybUlkOiBcIjllMGUyNThhLTYzOWEtNDIwOS04M2JmLTYwNzAwMGRlMGY3N1wiLFxuICAgICAgICBnZXRFbnRlcnByaXNlQnlIb3VzZUlkOiBcIi9SZXN0L0dyaWQvRW50ZXJwcmlzZS9FbnRlcnByaXNlTWFpbi9HZXRFbnRlcnByaXNlQnlIb3VzZUlkXCIsXG4gICAgICAgIGRlbGV0ZUVudGVycHJpc2U6IFwiL1Jlc3QvR3JpZC9FbnRlcnByaXNlL0VudGVycHJpc2VNYWluL0RlbGV0ZVwiXG4gICAgICB9LFxuICAgICAgbGlzdEhlaWdodDogMTAwLFxuICAgICAgaG91c2U6IHtcbiAgICAgICAgc2VsZWN0ZWRIb3VzZTogbnVsbCxcbiAgICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgICB0aXRsZTogJ+aIv+Wxi+e8lueggScsXG4gICAgICAgICAga2V5OiAnaG91c2VDb2RlRnVsbCcsXG4gICAgICAgICAgYWxpZ246IFwibGVmdFwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+aIv+WPtycsXG4gICAgICAgICAga2V5OiAnaG91c2VOdW1OYW1lJyxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgICB3aWR0aDogMTIwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+S9v+eUqOaDheWGtScsXG4gICAgICAgICAga2V5OiAnaG91c2VVc2VkRGVzYycsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAgICBrZXk6ICdob3VzZUlkJyxcbiAgICAgICAgICB3aWR0aDogODAsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgYnV0dG9ucyA9IFtdO1xuICAgICAgICAgICAgYnV0dG9ucy5wdXNoKGgoJ1Rvb2x0aXAnLCB7XG4gICAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgY29udGVudDogXCLmn6XnnItcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uIHZpZXdcIixcbiAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICAgICAgICBWaWV3SG91c2VBbmRQZXJzb25XcmFwLnZpZXdIb3VzZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSldKSk7XG4gICAgICAgICAgICB2YXIgZWggPSBoKCdkaXYnLCB7XG4gICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0LXJvdy1idXR0b24td3JhcFwiXG4gICAgICAgICAgICB9LCBidXR0b25zKTtcbiAgICAgICAgICAgIHJldHVybiBlaDtcbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICB0YWJsZURhdGE6IFtdLFxuICAgICAgICBzZWFyY2hIb3VzZVRleHQ6IFwiXCJcbiAgICAgIH0sXG4gICAgICBwZXJzb246IHtcbiAgICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgICB0aXRsZTogJ+S6uuWRmCcsXG4gICAgICAgICAga2V5OiAnZGlzcGxheVRleHQnLFxuICAgICAgICAgIGFsaWduOiBcImxlZnRcIixcbiAgICAgICAgICB3aWR0aDogMTIwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+i6q+S7veivgeWPtycsXG4gICAgICAgICAga2V5OiAncGVyc29uSWRDYXJkJyxcbiAgICAgICAgICBhbGlnbjogXCJsZWZ0XCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn6IGU57O755S16K+dJyxcbiAgICAgICAgICBrZXk6ICdwZXJzb25QaG9uZScsXG4gICAgICAgICAgYWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgIHdpZHRoOiAxNDBcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAgICBrZXk6ICdwZXJzb25JZCcsXG4gICAgICAgICAgd2lkdGg6IDE0MCxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBidXR0b25zID0gW107XG4gICAgICAgICAgICBidXR0b25zLnB1c2goaCgnVG9vbHRpcCcsIHtcbiAgICAgICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIuafpeeci1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0LXJvdy1idXR0b24gdmlld1wiLFxuICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgICAgICAgIFZpZXdIb3VzZUFuZFBlcnNvbldyYXAudmlld1BlcnNvbihwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSldKSk7XG4gICAgICAgICAgICB2YXIgZWggPSBoKCdkaXYnLCB7XG4gICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0LXJvdy1idXR0b24td3JhcFwiXG4gICAgICAgICAgICB9LCBidXR0b25zKTtcbiAgICAgICAgICAgIHJldHVybiBlaDtcbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICB0YWJsZURhdGE6IFtdXG4gICAgICB9LFxuICAgICAgZW50ZXJwcmlzZToge1xuICAgICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICAgIHRpdGxlOiAn5LyB5LiaKOmXqOW6l+WQjeensCknLFxuICAgICAgICAgIGtleTogJ2VudE5hbWUnLFxuICAgICAgICAgIGFsaWduOiBcImxlZnRcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICfmk43kvZwnLFxuICAgICAgICAgIGtleTogJ2VudElkJyxcbiAgICAgICAgICB3aWR0aDogMTQwLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgICAgdmFyIGJ1dHRvbnMgPSBbXTtcbiAgICAgICAgICAgIGJ1dHRvbnMucHVzaChoKCdUb29sdGlwJywge1xuICAgICAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwi5p+l55yLXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3Qtcm93LWJ1dHRvbiB2aWV3XCIsXG4gICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgICAgICAgZ3JpZE1hbmFnZXIudmlld0VudGVycHJpc2UocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXSkpO1xuICAgICAgICAgICAgYnV0dG9ucy5wdXNoKGgoJ1Rvb2x0aXAnLCB7XG4gICAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgY29udGVudDogXCLkv67mlLlcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uIGVkaXRcIixcbiAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICAgICAgICBncmlkTWFuYWdlci5lZGl0RW50ZXJwcmlzZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSldKSk7XG4gICAgICAgICAgICBidXR0b25zLnB1c2goaCgnVG9vbHRpcCcsIHtcbiAgICAgICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIuWIoOmZpFwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0LXJvdy1idXR0b24gZGVsXCIsXG4gICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgICAgICAgZ3JpZE1hbmFnZXIuZGVsRW50ZXJwcmlzZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSldKSk7XG4gICAgICAgICAgICB2YXIgZWggPSBoKCdkaXYnLCB7XG4gICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0LXJvdy1idXR0b24td3JhcFwiXG4gICAgICAgICAgICB9LCBidXR0b25zKTtcbiAgICAgICAgICAgIHJldHVybiBlaDtcbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICB0YWJsZURhdGE6IFtdXG4gICAgICB9XG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICBnZXRGb3JtUGFyYTogZnVuY3Rpb24gZ2V0Rm9ybVBhcmEoZm9ybUlkLCBvcE5hbWUsIHJlY29yZElkLCBtZW51UmlnaHRVcmxQYXJhLCBlbmRGdW5jKSB7XG4gICAgICAgIHZhciBwYXJhID0ge1xuICAgICAgICAgIFwiZm9ybUlkXCI6IGZvcm1JZCxcbiAgICAgICAgICBcImJ1dHRvbklkXCI6IFwiXCIsXG4gICAgICAgICAgXCJsaXN0Rm9ybUJ1dHRvbkVsZW1JZFwiOiBcIlwiLFxuICAgICAgICAgIFwicmVjb3JkSWRcIjogcmVjb3JkSWQsXG4gICAgICAgICAgXCJvcGVyYXRpb25UeXBlXCI6IG9wTmFtZSxcbiAgICAgICAgICBcIndpbmRvd1dpZHRoXCI6IDEzMDAsXG4gICAgICAgICAgXCJ3aW5kb3dIZWlnaHRcIjogODgwLFxuICAgICAgICAgIFwibWVudVJpZ2h0VXJsUGFyYVwiOiBtZW51UmlnaHRVcmxQYXJhLFxuICAgICAgICAgIFwiZGV2T3BlcmF0aW9uRW5kRnVuY1wiOiBlbmRGdW5jLFxuICAgICAgICAgIFwibWVudVJpZ2h0VXJsUGFyYUpzb25cIjogXCJcIlxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSA8IDUwMCkge1xuICAgICAgICAgIHBhcmEud2luZG93SGVpZ2h0ID0gNjAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcmE7XG4gICAgICB9LFxuICAgICAgZ2V0Rm9ybURpYWxvZ1BhcmE6IGZ1bmN0aW9uIGdldEZvcm1EaWFsb2dQYXJhKHRpdGxlKSB7XG4gICAgICAgIHZhciBwYXJhID0ge1xuICAgICAgICAgIFwid2lkdGhcIjogMTMwMCxcbiAgICAgICAgICBcImhlaWdodFwiOiA4ODAsXG4gICAgICAgICAgXCJ0aXRsZVwiOiB0aXRsZVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSA8IDUwMCkge1xuICAgICAgICAgIHBhcmEuaGVpZ2h0ID0gNjAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcmE7XG4gICAgICB9LFxuICAgICAgc2VsZWN0aW9uSG91c2VDaGFuZ2U6IGZ1bmN0aW9uIHNlbGVjdGlvbkhvdXNlQ2hhbmdlKHJvdywgaW5kZXgpIHtcbiAgICAgICAgY29uc29sZS5sb2cocm93KTtcbiAgICAgICAgdGhpcy5ob3VzZS5zZWxlY3RlZEhvdXNlID0gcm93O1xuICAgICAgICB0aGlzLmxvYWRQZXJzb25EYXRhKCk7XG4gICAgICAgIHRoaXMubG9hZEVudGVycHJpc2VEYXRhKCk7XG4gICAgICB9LFxuICAgICAgbG9hZEhvdXNlRGF0YTogZnVuY3Rpb24gbG9hZEhvdXNlRGF0YShidWlsZElkKSB7XG4gICAgICAgIEFqYXhVdGlsaXR5LkdldCh0aGlzLmFjSW50ZXJmYWNlLmdldEhvdXNlQnlCdWlsZElkLCB7XG4gICAgICAgICAgYnVpbGRJZDogYnVpbGRJZFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgdGhpcy5ob3VzZS50YWJsZURhdGEgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSxcbiAgICAgIHNlYXJjaEhvdXNlOiBmdW5jdGlvbiBzZWFyY2hIb3VzZSgpIHtcbiAgICAgICAgdmFyIHRleHQgPSB0aGlzLmhvdXNlLnNlYXJjaEhvdXNlVGV4dDtcblxuICAgICAgICBpZiAodGhpcy5ob3VzZS5zb3VyY2VUYWJsZURhdGEpIHtcbiAgICAgICAgICB0aGlzLmhvdXNlLnRhYmxlRGF0YSA9IHRoaXMuaG91c2Uuc291cmNlVGFibGVEYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaG91c2UudGFibGVEYXRhLmxlbmd0aCA+IDAgJiYgU3RyaW5nVXRpbGl0eS5Jc05vdE51bGxPckVtcHR5KHRleHQpKSB7XG4gICAgICAgICAgdGhpcy5ob3VzZS5zb3VyY2VUYWJsZURhdGEgPSB0aGlzLmhvdXNlLnRhYmxlRGF0YTtcbiAgICAgICAgICB0aGlzLmhvdXNlLnRhYmxlRGF0YSA9IEFycmF5VXRpbGl0eS5XaGVyZSh0aGlzLmhvdXNlLnRhYmxlRGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChpdGVtLmhvdXNlQ29kZS5pbmRleE9mKHRleHQpID49IDAgfHwgaXRlbS5ob3VzZU51bU5hbWUuaW5kZXhPZih0ZXh0KSA+PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWRkSG91c2U6IGZ1bmN0aW9uIGFkZEhvdXNlKCkge1xuICAgICAgICB2YXIgc2VsZWN0ZWRCdWlsZCA9IHRoaXMuYnVpbGRUcmVlLnRyZWVTZWxlY3RlZE5vZGU7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkQnVpbGQgPT0gbnVsbCkge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+35YWI6YCJ5oup5bu6562R54mpIVwiKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbWVudVJpZ2h0VXJsUGFyYSA9IFt7XG4gICAgICAgICAgXCJBY3Rpb25UeXBlXCI6IFwiQmluZFRvRmllbGRcIixcbiAgICAgICAgICBcIkZpZWxkTmFtZVwiOiBcIkhPVVNFX0JVSUxEX0lEXCIsXG4gICAgICAgICAgXCJWYWx1ZVwiOiBzZWxlY3RlZEJ1aWxkLmJ1aWxkSWRcbiAgICAgICAgfV07XG4gICAgICAgIHZhciBmb3JtUGFyYSA9IHRoaXMuZ2V0Rm9ybVBhcmEodGhpcy5hY0ludGVyZmFjZS5lZGl0SG91c2VGb3JtSWQsIEJhc2VVdGlsaXR5LkdldEFkZE9wZXJhdGlvbk5hbWUoKSwgXCJcIiwgSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKG1lbnVSaWdodFVybFBhcmEpLCBcInJlTG9hZEhvdXNlXCIpO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0QnVpbGRWaWV3LCBmb3JtUGFyYSksIHRoaXMuZ2V0Rm9ybURpYWxvZ1BhcmEoXCLmiL/lsYvnmbvorrBcIiksIDEsIHRydWUpO1xuICAgICAgfSxcbiAgICAgIHZpZXdIb3VzZTogZnVuY3Rpb24gdmlld0hvdXNlKHBhcmEpIHtcbiAgICAgICAgdmFyIGhvdXNlSWQgPSBwYXJhLnJvdy5ob3VzZUlkO1xuICAgICAgICB2YXIgZm9ybVBhcmEgPSB0aGlzLmdldEZvcm1QYXJhKHRoaXMuYWNJbnRlcmZhY2UuZWRpdEhvdXNlRm9ybUlkLCBCYXNlVXRpbGl0eS5HZXRWaWV3T3BlcmF0aW9uTmFtZSgpLCBob3VzZUlkLCBcIlwiLCBcInJlTG9hZEhvdXNlXCIpO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkMDMsIEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRIb3VzZVZpZXcsIGZvcm1QYXJhKSwgdGhpcy5nZXRGb3JtRGlhbG9nUGFyYShcIuaIv+Wxi+eZu+iusFwiKSwgMSwgdHJ1ZSk7XG4gICAgICB9LFxuICAgICAgZWRpdEhvdXNlOiBmdW5jdGlvbiBlZGl0SG91c2UocGFyYSkge1xuICAgICAgICB2YXIgaG91c2VJZCA9IHBhcmEucm93LmhvdXNlSWQ7XG4gICAgICAgIHZhciBmb3JtUGFyYSA9IHRoaXMuZ2V0Rm9ybVBhcmEodGhpcy5hY0ludGVyZmFjZS5lZGl0SG91c2VGb3JtSWQsIEJhc2VVdGlsaXR5LkdldFVwZGF0ZU9wZXJhdGlvbk5hbWUoKSwgaG91c2VJZCwgXCJcIiwgXCJyZUxvYWRIb3VzZVwiKTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdEJ1aWxkVmlldywgZm9ybVBhcmEpLCB0aGlzLmdldEZvcm1EaWFsb2dQYXJhKFwi5oi/5bGL55m76K6wXCIpLCAxLCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICBkZWxIb3VzZTogZnVuY3Rpb24gZGVsSG91c2UocGFyYSkge1xuICAgICAgICB2YXIgaG91c2VJZCA9IHBhcmEucm93LmhvdXNlSWQ7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQ29uZmlybSh3aW5kb3csIFwi56Gu6K6k6KaB5Yig6Zmk5b2T5YmN5oi/5bGL5ZCX77yfXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBBamF4VXRpbGl0eS5EZWxldGUodGhpcy5hY0ludGVyZmFjZS5kZWxldGVIb3VzZSwge1xuICAgICAgICAgICAgcmVjb3JkSWQ6IGhvdXNlSWRcbiAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQocmVzdWx0Lm1lc3NhZ2UpO1xuICAgICAgICAgICAgICB0aGlzLmxvYWRIb3VzZURhdGEodGhpcy5idWlsZFRyZWUudHJlZVNlbGVjdGVkTm9kZS5idWlsZElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9LFxuICAgICAgc2VsZWN0aW9uUGVyc29uQ2hhbmdlOiBmdW5jdGlvbiBzZWxlY3Rpb25QZXJzb25DaGFuZ2UoKSB7fSxcbiAgICAgIGxvYWRQZXJzb25EYXRhOiBmdW5jdGlvbiBsb2FkUGVyc29uRGF0YSgpIHtcbiAgICAgICAgdmFyIGhvdXNlSWQgPSB0aGlzLmhvdXNlLnNlbGVjdGVkSG91c2UuaG91c2VJZDtcbiAgICAgICAgQWpheFV0aWxpdHkuR2V0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0UGVyc29uQnlIb3VzZUlkLCB7XG4gICAgICAgICAgaG91c2VJZDogaG91c2VJZFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICByZXN1bHQuZGF0YVtpXS5kaXNwbGF5VGV4dCA9IHJlc3VsdC5kYXRhW2ldLnBlcnNvbk5hbWU7XG5cbiAgICAgICAgICAgICAgaWYgKHJlc3VsdC5kYXRhW2ldLnBlcnNvblJlbGF0aW9uc2hpcCA9PSBcIjBcIikge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5kYXRhW2ldLmRpc3BsYXlUZXh0ID0gXCJb5oi35Li7XVwiICsgcmVzdWx0LmRhdGFbaV0uZGlzcGxheVRleHQ7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmRhdGFbaV0uZGlzcGxheVRleHQgPSBcIlvmiJDlkZhdXCIgKyByZXN1bHQuZGF0YVtpXS5kaXNwbGF5VGV4dDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnBlcnNvbi50YWJsZURhdGEgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSxcbiAgICAgIGFkZEZhbWlseTogZnVuY3Rpb24gYWRkRmFtaWx5KCkge1xuICAgICAgICB2YXIgc2VsZWN0ZWRIb3VzZSA9IHRoaXMuaG91c2Uuc2VsZWN0ZWRIb3VzZTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWRIb3VzZSA9PSBudWxsKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7flhYjpgInmi6nmiL/lsYshXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtZW51UmlnaHRVcmxQYXJhID0gW3tcbiAgICAgICAgICBcIkFjdGlvblR5cGVcIjogXCJCaW5kVG9GaWVsZFwiLFxuICAgICAgICAgIFwiRmllbGROYW1lXCI6IFwiRkFNSUxZX0hPVVNFX0lEXCIsXG4gICAgICAgICAgXCJWYWx1ZVwiOiBzZWxlY3RlZEhvdXNlLmhvdXNlSWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiQWN0aW9uVHlwZVwiOiBcIkJpbmRUb0ZpZWxkXCIsXG4gICAgICAgICAgXCJGaWVsZE5hbWVcIjogXCJGQU1JTFlfSE9VU0VfQ09ERV9GVUxMXCIsXG4gICAgICAgICAgXCJWYWx1ZVwiOiBzZWxlY3RlZEhvdXNlLmhvdXNlQ29kZUZ1bGxcbiAgICAgICAgfV07XG4gICAgICAgIHZhciBmb3JtUGFyYSA9IHRoaXMuZ2V0Rm9ybVBhcmEodGhpcy5hY0ludGVyZmFjZS5lZGl0RmFtaWx5Rm9ybUlkLCBCYXNlVXRpbGl0eS5HZXRBZGRPcGVyYXRpb25OYW1lKCksIFwiXCIsIEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyhtZW51UmlnaHRVcmxQYXJhKSwgXCJyZUxvYWRQZXJzb25cIik7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRCdWlsZFZpZXcsIGZvcm1QYXJhKSwgdGhpcy5nZXRGb3JtRGlhbG9nUGFyYShcIuaIt+eZu+iusFwiKSwgMSwgdHJ1ZSk7XG4gICAgICB9LFxuICAgICAgZGVsUGVyc29uOiBmdW5jdGlvbiBkZWxQZXJzb24ocGFyYSkge1xuICAgICAgICB2YXIgcGVyc29uSWQgPSBwYXJhLnJvdy5wZXJzb25JZDtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5Db25maXJtKHdpbmRvdywgXCLnoa7orqTopoHliKDpmaTlvZPliY3kurrlkZjlkJfvvJ88YnIgLz4xOumcgOimgeWFiOWIoOmZpOaIt+S4reeahOWFtuS7luaIkOWRmCzmiY3lj6/ku6XliKDpmaTmiLfkuLsuPGJyIC8+MuWIoOmZpOaIt+S4u+aXtizlsIblkIzml7bliKDpmaTor6XmiLfnmoTkv6Hmga8uXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBBamF4VXRpbGl0eS5EZWxldGUodGhpcy5hY0ludGVyZmFjZS5kZWxldGVQZXJzb24sIHtcbiAgICAgICAgICAgIHBlcnNvbklkOiBwZXJzb25JZFxuICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChyZXN1bHQubWVzc2FnZSk7XG4gICAgICAgICAgICAgIHRoaXMubG9hZFBlcnNvbkRhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9LFxuICAgICAgZWRpdFBlcnNvbjogZnVuY3Rpb24gZWRpdFBlcnNvbihwYXJhKSB7XG4gICAgICAgIHZhciBwZXJzb25JZCA9IHBhcmEucm93LnBlcnNvbklkO1xuICAgICAgICB2YXIgZm9ybVBhcmEgPSB0aGlzLmdldEZvcm1QYXJhKHRoaXMuYWNJbnRlcmZhY2UuZWRpdFBlcnNvbkZvcm1JZCwgQmFzZVV0aWxpdHkuR2V0VXBkYXRlT3BlcmF0aW9uTmFtZSgpLCBwZXJzb25JZCwgXCJcIiwgXCJyZUxvYWRQZXJzb25cIik7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRCdWlsZFZpZXcsIGZvcm1QYXJhKSwgdGhpcy5nZXRGb3JtRGlhbG9nUGFyYShcIuS6uuWRmOS/oeaBr+e7tOaKpFwiKSwgMSwgdHJ1ZSk7XG4gICAgICB9LFxuICAgICAgZWRpdEZhbWlseTogZnVuY3Rpb24gZWRpdEZhbWlseShwYXJhKSB7XG4gICAgICAgIHZhciBwZXJzb25GYW1pbHlJZCA9IHBhcmEucm93LnBlcnNvbkZhbWlseUlkO1xuICAgICAgICB2YXIgZm9ybVBhcmEgPSB0aGlzLmdldEZvcm1QYXJhKHRoaXMuYWNJbnRlcmZhY2UuZWRpdEZhbWlseUZvcm1JZCwgQmFzZVV0aWxpdHkuR2V0VXBkYXRlT3BlcmF0aW9uTmFtZSgpLCBwZXJzb25GYW1pbHlJZCwgXCJcIiwgXCJyZUxvYWRQZXJzb25cIik7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRCdWlsZFZpZXcsIGZvcm1QYXJhKSwgdGhpcy5nZXRGb3JtRGlhbG9nUGFyYShcIuaIt+eZu+iusFwiKSwgMSwgdHJ1ZSk7XG4gICAgICB9LFxuICAgICAgdmlld1BlcnNvbjogZnVuY3Rpb24gdmlld1BlcnNvbihwYXJhKSB7XG4gICAgICAgIHZhciBwZXJzb25JZCA9IHBhcmEucm93LnBlcnNvbklkO1xuICAgICAgICB2YXIgZm9ybVBhcmEgPSB0aGlzLmdldEZvcm1QYXJhKHRoaXMuYWNJbnRlcmZhY2UuZWRpdFBlcnNvbkZvcm1JZCwgQmFzZVV0aWxpdHkuR2V0Vmlld09wZXJhdGlvbk5hbWUoKSwgcGVyc29uSWQsIFwiXCIsIFwicmVMb2FkUGVyc29uXCIpO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkMDMsIEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRQZXJzb25WaWV3LCBmb3JtUGFyYSksIHRoaXMuZ2V0Rm9ybURpYWxvZ1BhcmEoXCLkurrlkZjkv6Hmga/mn6XnnItcIiksIDEsIHRydWUpO1xuICAgICAgfSxcbiAgICAgIGFkZEVudGVycHJpc2U6IGZ1bmN0aW9uIGFkZEVudGVycHJpc2UoKSB7XG4gICAgICAgIHZhciBzZWxlY3RlZEhvdXNlID0gdGhpcy5ob3VzZS5zZWxlY3RlZEhvdXNlO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZEhvdXNlID09IG51bGwpIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuivt+WFiOmAieaLqeaIv+WxiyFcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1lbnVSaWdodFVybFBhcmEgPSBbe1xuICAgICAgICAgIFwiQWN0aW9uVHlwZVwiOiBcIkJpbmRUb0ZpZWxkXCIsXG4gICAgICAgICAgXCJGaWVsZE5hbWVcIjogXCJFTlRfSE9VU0VfSURcIixcbiAgICAgICAgICBcIlZhbHVlXCI6IHNlbGVjdGVkSG91c2UuaG91c2VJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJBY3Rpb25UeXBlXCI6IFwiQmluZFRvRmllbGRcIixcbiAgICAgICAgICBcIkZpZWxkTmFtZVwiOiBcIkVOVF9IT1VTRV9DT0RFXCIsXG4gICAgICAgICAgXCJWYWx1ZVwiOiBzZWxlY3RlZEhvdXNlLmhvdXNlQ29kZUZ1bGxcbiAgICAgICAgfV07XG4gICAgICAgIHZhciBmb3JtUGFyYSA9IHRoaXMuZ2V0Rm9ybVBhcmEodGhpcy5hY0ludGVyZmFjZS5lZGl0RW50ZXJwcmlzZUZvcm1JZCwgQmFzZVV0aWxpdHkuR2V0QWRkT3BlcmF0aW9uTmFtZSgpLCBcIlwiLCBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcobWVudVJpZ2h0VXJsUGFyYSksIFwicmVMb2FkRW50ZXJwcmlzZVwiKTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdEJ1aWxkVmlldywgZm9ybVBhcmEpLCB0aGlzLmdldEZvcm1EaWFsb2dQYXJhKFwi5LyB5Lia5rOV5Lq655m76K6wXCIpLCAxLCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICBsb2FkRW50ZXJwcmlzZURhdGE6IGZ1bmN0aW9uIGxvYWRFbnRlcnByaXNlRGF0YSgpIHtcbiAgICAgICAgdmFyIGhvdXNlSWQgPSB0aGlzLmhvdXNlLnNlbGVjdGVkSG91c2UuaG91c2VJZDtcbiAgICAgICAgQWpheFV0aWxpdHkuR2V0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0RW50ZXJwcmlzZUJ5SG91c2VJZCwge1xuICAgICAgICAgIGhvdXNlSWQ6IGhvdXNlSWRcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuZW50ZXJwcmlzZS50YWJsZURhdGEgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSxcbiAgICAgIHZpZXdFbnRlcnByaXNlOiBmdW5jdGlvbiB2aWV3RW50ZXJwcmlzZShwYXJhKSB7XG4gICAgICAgIHZhciBlbnRJZCA9IHBhcmEucm93LmVudElkO1xuICAgICAgICB2YXIgZm9ybVBhcmEgPSB0aGlzLmdldEZvcm1QYXJhKHRoaXMuYWNJbnRlcmZhY2UuZWRpdEVudGVycHJpc2VGb3JtSWQsIEJhc2VVdGlsaXR5LkdldFZpZXdPcGVyYXRpb25OYW1lKCksIGVudElkLCBcIlwiLCBcInJlTG9hZEVudGVycHJpc2VcIik7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRCdWlsZFZpZXcsIGZvcm1QYXJhKSwgdGhpcy5nZXRGb3JtRGlhbG9nUGFyYShcIuS8geS4muazleS6uuafpeeci1wiKSwgMSwgdHJ1ZSk7XG4gICAgICB9LFxuICAgICAgZWRpdEVudGVycHJpc2U6IGZ1bmN0aW9uIGVkaXRFbnRlcnByaXNlKHBhcmEpIHtcbiAgICAgICAgdmFyIGVudElkID0gcGFyYS5yb3cuZW50SWQ7XG4gICAgICAgIHZhciBmb3JtUGFyYSA9IHRoaXMuZ2V0Rm9ybVBhcmEodGhpcy5hY0ludGVyZmFjZS5lZGl0RW50ZXJwcmlzZUZvcm1JZCwgQmFzZVV0aWxpdHkuR2V0VXBkYXRlT3BlcmF0aW9uTmFtZSgpLCBlbnRJZCwgXCJcIiwgXCJyZUxvYWRFbnRlcnByaXNlXCIpO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0QnVpbGRWaWV3LCBmb3JtUGFyYSksIHRoaXMuZ2V0Rm9ybURpYWxvZ1BhcmEoXCLkvIHkuJrms5XkurrnmbvorrBcIiksIDEsIHRydWUpO1xuICAgICAgfSxcbiAgICAgIGRlbEVudGVycHJpc2U6IGZ1bmN0aW9uIGRlbEVudGVycHJpc2UocGFyYSkge1xuICAgICAgICB2YXIgZW50SWQgPSBwYXJhLnJvdy5lbnRJZDtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5Db25maXJtKHdpbmRvdywgXCLnoa7orqTopoHliKDpmaTlvZPliY3kvIHkuJrlkJfvvJ9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIEFqYXhVdGlsaXR5LkRlbGV0ZSh0aGlzLmFjSW50ZXJmYWNlLmRlbGV0ZUVudGVycHJpc2UsIHtcbiAgICAgICAgICAgIHJlY29yZElkOiBlbnRJZFxuICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChyZXN1bHQubWVzc2FnZSk7XG4gICAgICAgICAgICAgIHRoaXMubG9hZEVudGVycHJpc2VEYXRhKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdGVtcGxhdGU6IFwiPGRpdiBjbGFzcz1cXFwibGlzdC0yY29sdW1uIHZpZXdIb3VzZUFuZFBlcnNvbldyYXBcXFwiIHN0eWxlPVxcXCJoZWlnaHQ6IDcwNHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsZWZ0LW91dGVyLXdyYXAgaXYtbGlzdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJ3aWR0aDogNjUwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0aXRsZVxcXCI+XFx1NUVGQVxcdTdCNTFcXHU3MjY5XFx1NEUyRFxcdTYyM0ZcXHU1QzRCXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSA6Y29sdW1ucz1cXFwiaG91c2UuY29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcImhvdXNlLnRhYmxlRGF0YVxcXCIgOmhlaWdodD1cXFwibGlzdEhlaWdodFxcXCIgOmhpZ2hsaWdodC1yb3c9XFxcInRydWVcXFwiIGJvcmRlcj1cXFwiXFxcIiBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgQG9uLXJvdy1jbGljaz1cXFwic2VsZWN0aW9uSG91c2VDaGFuZ2VcXFwiPiBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+PGRpdiBjbGFzcz1cXFwicmlnaHQtb3V0ZXItd3JhcCBpdi1saXN0LXBhZ2Utd3JhcFxcXCIgc3R5bGU9XFxcInBhZGRpbmc6IDEwcHg7bGVmdDogNjYwcHg7cmlnaHQ6IDBweDtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0aXRsZVxcXCI+XFx1NjIzRlxcdTVDNEJcXHU0RTJEXFx1NEVCQVxcdTUzRTNcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpjb2x1bW5zPVxcXCJwZXJzb24uY29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcInBlcnNvbi50YWJsZURhdGFcXFwiIDpoZWlnaHQ9XFxcImxpc3RIZWlnaHRcXFwiIDpoaWdobGlnaHQtcm93PVxcXCJ0cnVlXFxcIiBib3JkZXI9XFxcIlxcXCIgY2xhc3M9XFxcIml2LWxpc3QtdGFibGVcXFwiIHN0cmlwZT1cXFwiXFxcIj4gXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XCJcbiAgfSk7XG59Il19
