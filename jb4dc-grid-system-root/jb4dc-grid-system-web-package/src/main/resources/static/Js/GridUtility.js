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
    changeEnable: true
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
  Init3DDL: function Init3DDL(ddlStreetControlId, ddlCommunityControlId, ddlGridControlId, operationName, changeEnable) {
    this._prop.operationName = operationName;
    this._prop.ddlStreetControl = $("#" + ddlStreetControlId);
    this._prop.oldDDLStreetControlValue = this._prop.ddlStreetControl.attr("control_value");
    this._prop.ddlCommunityControl = $("#" + ddlCommunityControlId);
    this._prop.oldDDLCommunityControlValue = this._prop.ddlCommunityControl.attr("control_value");
    this._prop.ddlGridControl = $("#" + ddlGridControlId);
    this._prop.oldDDLGridControlValue = this._prop.ddlGridControl.attr("control_value");
    this._prop.changeEnable = changeEnable;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRyb2xTdGF0dXNVdGlsaXR5LmpzIiwiRGF0YVZhbGlkYXRlVXRpbGl0eS5qcyIsIkV2ZW50VXRpbGl0eS5qcyIsIk9yZ2FuM0RETC5qcyIsIlZpZXdIb3VzZUFuZFBlcnNvbldyYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiR3JpZFV0aWxpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIENvbnRyb2xTdGF0dXNVdGlsaXR5ID0ge1xuICBEaXNhYmxlQXRVcGRhdGVTdGF0dXM6IGZ1bmN0aW9uIERpc2FibGVBdFVwZGF0ZVN0YXR1cyh3ZWJGb3JtUlRQYXJhcywgY29udHJvbElkKSB7XG4gICAgaWYgKHdlYkZvcm1SVFBhcmFzLk9wZXJhdGlvblR5cGUgPT0gQmFzZVV0aWxpdHkuR2V0VXBkYXRlT3BlcmF0aW9uTmFtZSgpKSB7XG4gICAgICAkKFwiI1wiICsgY29udHJvbElkKS5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEYXRhVmFsaWRhdGVVdGlsaXR5ID0ge1xuICB0ZXN0QnVpbGRDb2RlRXJyb3I6IGZ1bmN0aW9uIHRlc3RCdWlsZENvZGVFcnJvcigkZWxlbSkge1xuICAgIHZhciBjb2RlID0gJGVsZW0udmFsKCk7XG5cbiAgICBpZiAoY29kZS5sZW5ndGggIT0gMTgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICRlbGVtOiAkZWxlbSxcbiAgICAgICAgZXJyb3JzOiBbXCLlu7rnrZHniannvJbnoIHplb/luqblv4XpobvkuLoxOOS9jSFcIl0sXG4gICAgICAgIGxhYk5hbWU6IFwi57yW56CB6ZSZ6K+vXCJcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIHRlc3RIb3VzZUNvZGVFcnJvcjogZnVuY3Rpb24gdGVzdEhvdXNlQ29kZUVycm9yKCRlbGVtKSB7XG4gICAgdmFyIGNvZGUgPSAkZWxlbS52YWwoKTtcblxuICAgIGlmIChjb2RlLmxlbmd0aCAhPSA1KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAkZWxlbTogJGVsZW0sXG4gICAgICAgIGVycm9yczogW1wi5oi/5bGL57yW56CB6ZW/5bqm5b+F6aG75Li6NeS9jSFcIl0sXG4gICAgICAgIGxhYk5hbWU6IFwi57yW56CB6ZSZ6K+vXCJcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFdmVudFV0aWxpdHkgPSB7XG4gIEV2ZW50VHlwZUNoYW5nZUV2ZW50OiBmdW5jdGlvbiBFdmVudFR5cGVDaGFuZ2VFdmVudCgpIHtcbiAgICB2YXIgdHlwZTFfMV8yX2dyb3VwX2tleSA9IFwiNDA5YTFiYmYtOWM1My00ZWM5LThkNzctOGY1ZGY2YjJlOGZhXCI7XG4gICAgdmFyIHR5cGUxXzJfMl9ncm91cF9rZXkgPSBcIjdlMzZhMjA4LTI5MjctNGFkMC04OTJiLTA0MDNjNmUxYjNkOFwiO1xuICAgIHZhciB0eXBlMVZhbHVlID0gJChcIiNyYWRpb19ncm91cF9ldmVudF90eXBlXzFcIikudmFsKCk7XG5cbiAgICBpZiAodHlwZTFWYWx1ZSA9PSBcIuefm+ebvue6oOe6t1wiKSB7fSBlbHNlIGlmICh0eXBlMVZhbHVlID09IFwi6Zeu6aKY6ZqQ5oKjXCIpIHt9XG5cbiAgICAkKFwiI3JhZGlvX2dyb3VwX2V2ZW50X3R5cGVfMVwiKS5jaGFuZ2UoKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIE9yZ2FuM0RETCA9IHtcbiAgX3Byb3A6IHtcbiAgICBteVNlc3Npb25EYXRhOiBudWxsLFxuICAgIG15R3JpZERhdGE6IG51bGwsXG4gICAgbXlDb21tdW5pdHlEYXRhOiBudWxsLFxuICAgIG15U3RyZWV0RGF0YTogbnVsbCxcbiAgICBhbGxPcmdhbk1pblByb3A6IG51bGwsXG4gICAgb3BlcmF0aW9uTmFtZTogXCJcIixcbiAgICBkZGxTdHJlZXRDb250cm9sOiBudWxsLFxuICAgIG9sZERETFN0cmVldENvbnRyb2xWYWx1ZTogXCJcIixcbiAgICBkZGxDb21tdW5pdHlDb250cm9sOiBudWxsLFxuICAgIG9sZERETENvbW11bml0eUNvbnRyb2xWYWx1ZTogXCJcIixcbiAgICBkZGxHcmlkQ29udHJvbDogbnVsbCxcbiAgICBvbGRERExHcmlkQ29udHJvbFZhbHVlOiBcIlwiLFxuICAgIGNoYW5nZUVuYWJsZTogdHJ1ZVxuICB9LFxuICBHZXRPcmdhbkRhdGE6IGZ1bmN0aW9uIEdldE9yZ2FuRGF0YShlbmRGdW5jKSB7XG4gICAgQWpheFV0aWxpdHkuR2V0KFwiL1Jlc3QvR3JpZC9TU09Qcm94eS9PcmdhbkFuZFVzZXIvR2V0QUxMT3JnYW5NaW5Qcm9wRGF0YVwiLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgIHRoaXMuX3Byb3AubXlTZXNzaW9uRGF0YSA9IHJlc3VsdC5kYXRhLk15U2Vzc2lvbkRhdGE7XG4gICAgICAgIHZhciBteU9yZ2FuSWQgPSByZXN1bHQuZGF0YS5NeVNlc3Npb25EYXRhLm9yZ2FuSWQ7XG4gICAgICAgIHRoaXMuX3Byb3AuYWxsT3JnYW5NaW5Qcm9wID0gcmVzdWx0LmRhdGEuQUxMT3JnYW5NaW5Qcm9wO1xuICAgICAgICB2YXIgbXlPcmdhbkRhdGEgPSBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUodGhpcy5fcHJvcC5hbGxPcmdhbk1pblByb3AsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ub3JnYW5JZCA9PSBteU9yZ2FuSWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChteU9yZ2FuRGF0YS5vcmdhblR5cGVWYWx1ZSA9PSBcIkdyaWRVbml0XCIpIHtcbiAgICAgICAgICB0aGlzLl9wcm9wLm15R3JpZERhdGEgPSBteU9yZ2FuRGF0YTtcbiAgICAgICAgICB2YXIgcGFyZW50T3JnYW5JZCA9IG15T3JnYW5EYXRhLm9yZ2FuUGFyZW50SWQ7XG4gICAgICAgICAgdGhpcy5fcHJvcC5teUNvbW11bml0eURhdGEgPSBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUodGhpcy5fcHJvcC5hbGxPcmdhbk1pblByb3AsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5vcmdhbklkID09IHBhcmVudE9yZ2FuSWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcGFyZW50T3JnYW5JZCA9IHRoaXMuX3Byb3AubXlDb21tdW5pdHlEYXRhLm9yZ2FuUGFyZW50SWQ7XG4gICAgICAgICAgdGhpcy5fcHJvcC5teVN0cmVldERhdGEgPSBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUodGhpcy5fcHJvcC5hbGxPcmdhbk1pblByb3AsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5vcmdhbklkID09IHBhcmVudE9yZ2FuSWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAobXlPcmdhbkRhdGEub3JnYW5UeXBlVmFsdWUgPT0gXCJDb21tdW5pdHlcIikge1xuICAgICAgICAgIHRoaXMuX3Byb3AubXlDb21tdW5pdHlEYXRhID0gbXlPcmdhbkRhdGE7XG4gICAgICAgICAgdmFyIHBhcmVudE9yZ2FuSWQgPSB0aGlzLl9wcm9wLm15Q29tbXVuaXR5RGF0YS5vcmdhblBhcmVudElkO1xuICAgICAgICAgIHRoaXMuX3Byb3AubXlTdHJlZXREYXRhID0gQXJyYXlVdGlsaXR5LldoZXJlU2luZ2xlKHRoaXMuX3Byb3AuYWxsT3JnYW5NaW5Qcm9wLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ub3JnYW5JZCA9PSBwYXJlbnRPcmdhbklkO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKG15T3JnYW5EYXRhLm9yZ2FuVHlwZVZhbHVlID09IFwiU3RyZWV0XCIpIHtcbiAgICAgICAgICB0aGlzLl9wcm9wLm15U3RyZWV0RGF0YSA9IG15T3JnYW5EYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgZW5kRnVuYy5jYWxsKHRoaXMsIHJlc3VsdC5kYXRhKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgSW5pdDNEREw6IGZ1bmN0aW9uIEluaXQzRERMKGRkbFN0cmVldENvbnRyb2xJZCwgZGRsQ29tbXVuaXR5Q29udHJvbElkLCBkZGxHcmlkQ29udHJvbElkLCBvcGVyYXRpb25OYW1lLCBjaGFuZ2VFbmFibGUpIHtcbiAgICB0aGlzLl9wcm9wLm9wZXJhdGlvbk5hbWUgPSBvcGVyYXRpb25OYW1lO1xuICAgIHRoaXMuX3Byb3AuZGRsU3RyZWV0Q29udHJvbCA9ICQoXCIjXCIgKyBkZGxTdHJlZXRDb250cm9sSWQpO1xuICAgIHRoaXMuX3Byb3Aub2xkRERMU3RyZWV0Q29udHJvbFZhbHVlID0gdGhpcy5fcHJvcC5kZGxTdHJlZXRDb250cm9sLmF0dHIoXCJjb250cm9sX3ZhbHVlXCIpO1xuICAgIHRoaXMuX3Byb3AuZGRsQ29tbXVuaXR5Q29udHJvbCA9ICQoXCIjXCIgKyBkZGxDb21tdW5pdHlDb250cm9sSWQpO1xuICAgIHRoaXMuX3Byb3Aub2xkRERMQ29tbXVuaXR5Q29udHJvbFZhbHVlID0gdGhpcy5fcHJvcC5kZGxDb21tdW5pdHlDb250cm9sLmF0dHIoXCJjb250cm9sX3ZhbHVlXCIpO1xuICAgIHRoaXMuX3Byb3AuZGRsR3JpZENvbnRyb2wgPSAkKFwiI1wiICsgZGRsR3JpZENvbnRyb2xJZCk7XG4gICAgdGhpcy5fcHJvcC5vbGRERExHcmlkQ29udHJvbFZhbHVlID0gdGhpcy5fcHJvcC5kZGxHcmlkQ29udHJvbC5hdHRyKFwiY29udHJvbF92YWx1ZVwiKTtcbiAgICB0aGlzLl9wcm9wLmNoYW5nZUVuYWJsZSA9IGNoYW5nZUVuYWJsZTtcbiAgICB0aGlzLkdldE9yZ2FuRGF0YShmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAob3BlcmF0aW9uTmFtZSA9PSBCYXNlVXRpbGl0eS5HZXRWaWV3T3BlcmF0aW9uTmFtZSgpKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHN0cmVldERhdGEgPSBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUodGhpcy5fcHJvcC5hbGxPcmdhbk1pblByb3AsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ub3JnYW5JZCA9PSBfdGhpcy5fcHJvcC5vbGRERExTdHJlZXRDb250cm9sVmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgY29tbXVuaXR5RGF0YSA9IEFycmF5VXRpbGl0eS5XaGVyZVNpbmdsZSh0aGlzLl9wcm9wLmFsbE9yZ2FuTWluUHJvcCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5vcmdhbklkID09IF90aGlzLl9wcm9wLm9sZERETENvbW11bml0eUNvbnRyb2xWYWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBncmlkRGF0YSA9IEFycmF5VXRpbGl0eS5XaGVyZVNpbmdsZSh0aGlzLl9wcm9wLmFsbE9yZ2FuTWluUHJvcCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5vcmdhbklkID09IF90aGlzLl9wcm9wLm9sZERETEdyaWRDb250cm9sVmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3Byb3AuZGRsU3RyZWV0Q29udHJvbC50ZXh0KHN0cmVldERhdGEub3JnYW5OYW1lKTtcblxuICAgICAgICB0aGlzLl9wcm9wLmRkbENvbW11bml0eUNvbnRyb2wudGV4dChjb21tdW5pdHlEYXRhLm9yZ2FuTmFtZSk7XG5cbiAgICAgICAgdGhpcy5fcHJvcC5kZGxHcmlkQ29udHJvbC50ZXh0KGdyaWREYXRhLm9yZ2FuTmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLkJpbmQzRERMKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoIXRoaXMuX3Byb3AuY2hhbmdlRW5hYmxlKSB7XG4gICAgICB0aGlzLl9wcm9wLmRkbFN0cmVldENvbnRyb2wuYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG5cbiAgICAgIHRoaXMuX3Byb3AuZGRsQ29tbXVuaXR5Q29udHJvbC5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcblxuICAgICAgdGhpcy5fcHJvcC5kZGxHcmlkQ29udHJvbC5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICB9XG4gIH0sXG4gIEJpbmQzRERMOiBmdW5jdGlvbiBCaW5kM0RETCgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIHN0cmVldERhdGFMaXN0ID0gQXJyYXlVdGlsaXR5LldoZXJlKHRoaXMuX3Byb3AuYWxsT3JnYW5NaW5Qcm9wLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0ub3JnYW5UeXBlVmFsdWUgPT0gXCJTdHJlZXRcIjtcbiAgICB9KTtcbiAgICB0aGlzLkJpbmRTaW5nbGVEREwodGhpcy5fcHJvcC5kZGxTdHJlZXRDb250cm9sLCBzdHJlZXREYXRhTGlzdCk7XG4gICAgdmFyIHNlbGVjdGVkU3RyZWV0VmFsdWUgPSB0aGlzLlRyeUF1dG9TZXRTdHJlZXQoKTtcblxuICAgIHRoaXMuX3Byb3AuZGRsU3RyZWV0Q29udHJvbC5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG5ld1NlbGVjdGVkU3RyZWV0VmFsdWUgPSAkKHRoaXMpLnZhbCgpO1xuXG4gICAgICBfdGhpcy5TdHJlZXRDb250cm9sQ2hhbmdlKG5ld1NlbGVjdGVkU3RyZWV0VmFsdWUpO1xuICAgIH0pO1xuXG4gICAgdmFyIGNvbW11bml0eURhdGFMaXN0ID0gQXJyYXlVdGlsaXR5LldoZXJlKHRoaXMuX3Byb3AuYWxsT3JnYW5NaW5Qcm9wLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0ub3JnYW5QYXJlbnRJZCA9PSBzZWxlY3RlZFN0cmVldFZhbHVlO1xuICAgIH0pO1xuICAgIHRoaXMuQmluZFNpbmdsZURETCh0aGlzLl9wcm9wLmRkbENvbW11bml0eUNvbnRyb2wsIGNvbW11bml0eURhdGFMaXN0KTtcbiAgICB2YXIgc2VsZWN0ZWRDb21tdW5pdHlWYWx1ZSA9IHRoaXMuVHJ5QXV0b1NldENvbW11bml0eSgpO1xuXG4gICAgdGhpcy5fcHJvcC5kZGxDb21tdW5pdHlDb250cm9sLmNoYW5nZShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbmV3U2VsZWN0ZWRDb21tdW5pdHlWYWx1ZSA9ICQodGhpcykudmFsKCk7XG5cbiAgICAgIF90aGlzLkNvbW11bml0eUNvbnRyb2xDaGFuZ2UobmV3U2VsZWN0ZWRDb21tdW5pdHlWYWx1ZSk7XG4gICAgfSk7XG5cbiAgICB2YXIgZ3JpZERhdGFMaXN0ID0gQXJyYXlVdGlsaXR5LldoZXJlKHRoaXMuX3Byb3AuYWxsT3JnYW5NaW5Qcm9wLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0ub3JnYW5QYXJlbnRJZCA9PSBzZWxlY3RlZENvbW11bml0eVZhbHVlO1xuICAgIH0pO1xuICAgIHRoaXMuQmluZFNpbmdsZURETCh0aGlzLl9wcm9wLmRkbEdyaWRDb250cm9sLCBncmlkRGF0YUxpc3QpO1xuICAgIHRoaXMuVHJ5QXV0b1NldEdyaWQoKTtcbiAgfSxcbiAgVHJ5QXV0b1NldFN0cmVldDogZnVuY3Rpb24gVHJ5QXV0b1NldFN0cmVldCgpIHtcbiAgICB2YXIgc2VsZWN0ZWRWYWx1ZSA9IHRoaXMuX3Byb3Aub2xkRERMU3RyZWV0Q29udHJvbFZhbHVlO1xuXG4gICAgaWYgKCFzZWxlY3RlZFZhbHVlICYmIHRoaXMuX3Byb3AubXlTdHJlZXREYXRhKSB7XG4gICAgICBzZWxlY3RlZFZhbHVlID0gdGhpcy5fcHJvcC5teVN0cmVldERhdGEub3JnYW5JZDtcbiAgICB9XG5cbiAgICBpZiAoc2VsZWN0ZWRWYWx1ZSkge1xuICAgICAgdGhpcy5fcHJvcC5kZGxTdHJlZXRDb250cm9sLnZhbChzZWxlY3RlZFZhbHVlKTtcblxuICAgICAgcmV0dXJuIHNlbGVjdGVkVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3Byb3AuZGRsU3RyZWV0Q29udHJvbC52YWwoKTtcbiAgfSxcbiAgVHJ5QXV0b1NldENvbW11bml0eTogZnVuY3Rpb24gVHJ5QXV0b1NldENvbW11bml0eSgpIHtcbiAgICB2YXIgc2VsZWN0ZWRWYWx1ZSA9IHRoaXMuX3Byb3Aub2xkRERMQ29tbXVuaXR5Q29udHJvbFZhbHVlO1xuXG4gICAgaWYgKCFzZWxlY3RlZFZhbHVlICYmIHRoaXMuX3Byb3AubXlDb21tdW5pdHlEYXRhKSB7XG4gICAgICBzZWxlY3RlZFZhbHVlID0gdGhpcy5fcHJvcC5teUNvbW11bml0eURhdGEub3JnYW5JZDtcbiAgICB9XG5cbiAgICBpZiAoc2VsZWN0ZWRWYWx1ZSkge1xuICAgICAgdGhpcy5fcHJvcC5kZGxDb21tdW5pdHlDb250cm9sLnZhbChzZWxlY3RlZFZhbHVlKTtcblxuICAgICAgcmV0dXJuIHNlbGVjdGVkVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3Byb3AuZGRsQ29tbXVuaXR5Q29udHJvbC52YWwoKTtcbiAgfSxcbiAgVHJ5QXV0b1NldEdyaWQ6IGZ1bmN0aW9uIFRyeUF1dG9TZXRHcmlkKCkge1xuICAgIHZhciBzZWxlY3RlZFZhbHVlID0gdGhpcy5fcHJvcC5vbGRERExHcmlkQ29udHJvbFZhbHVlO1xuXG4gICAgaWYgKCFzZWxlY3RlZFZhbHVlICYmIHRoaXMuX3Byb3AubXlHcmlkRGF0YSkge1xuICAgICAgc2VsZWN0ZWRWYWx1ZSA9IHRoaXMuX3Byb3AubXlHcmlkRGF0YS5vcmdhbklkO1xuICAgIH1cblxuICAgIGlmIChzZWxlY3RlZFZhbHVlKSB7XG4gICAgICB0aGlzLl9wcm9wLmRkbEdyaWRDb250cm9sLnZhbChzZWxlY3RlZFZhbHVlKTtcblxuICAgICAgcmV0dXJuIHNlbGVjdGVkVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3Byb3AuZGRsR3JpZENvbnRyb2wudmFsKCk7XG4gIH0sXG4gIEJpbmRTaW5nbGVEREw6IGZ1bmN0aW9uIEJpbmRTaW5nbGVEREwoZGRsQ29udHJvbCwgb3JnYW5EYXRhTGlzdCkge1xuICAgIGRkbENvbnRyb2wuaHRtbChcIlwiKTtcbiAgICBkZGxDb250cm9sLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9JyAnPi0t6K+36YCJ5oupLS08L29wdGlvbj5cIik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9yZ2FuRGF0YUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvcmdhbkRhdGEgPSBvcmdhbkRhdGFMaXN0W2ldO1xuICAgICAgdmFyIHNlbCA9IFwiPG9wdGlvbiB2YWx1ZT0nXCIgKyBvcmdhbkRhdGEub3JnYW5JZCArIFwiJz5cIiArIG9yZ2FuRGF0YS5vcmdhbk5hbWUgKyBcIjwvb3B0aW9uPlwiO1xuICAgICAgZGRsQ29udHJvbC5hcHBlbmQoc2VsKTtcbiAgICB9XG4gIH0sXG4gIFN0cmVldENvbnRyb2xDaGFuZ2U6IGZ1bmN0aW9uIFN0cmVldENvbnRyb2xDaGFuZ2UobmV3U2VsZWN0ZWRTdHJlZXRWYWx1ZSkge1xuICAgIHZhciBjb21tdW5pdHlEYXRhTGlzdCA9IEFycmF5VXRpbGl0eS5XaGVyZSh0aGlzLl9wcm9wLmFsbE9yZ2FuTWluUHJvcCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLm9yZ2FuUGFyZW50SWQgPT0gbmV3U2VsZWN0ZWRTdHJlZXRWYWx1ZTtcbiAgICB9KTtcbiAgICB0aGlzLkJpbmRTaW5nbGVEREwodGhpcy5fcHJvcC5kZGxDb21tdW5pdHlDb250cm9sLCBjb21tdW5pdHlEYXRhTGlzdCk7XG5cbiAgICB0aGlzLl9wcm9wLmRkbEdyaWRDb250cm9sLmh0bWwoXCJcIik7XG5cbiAgICB0aGlzLl9wcm9wLmRkbEdyaWRDb250cm9sLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9JyAnPi0t6K+36YCJ5oupLS08L29wdGlvbj5cIik7XG4gIH0sXG4gIENvbW11bml0eUNvbnRyb2xDaGFuZ2U6IGZ1bmN0aW9uIENvbW11bml0eUNvbnRyb2xDaGFuZ2UobmV3U2VsZWN0ZWRDb21tdW5pdHlWYWx1ZSkge1xuICAgIHZhciBncmlkRGF0YUxpc3QgPSBBcnJheVV0aWxpdHkuV2hlcmUodGhpcy5fcHJvcC5hbGxPcmdhbk1pblByb3AsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5vcmdhblBhcmVudElkID09IG5ld1NlbGVjdGVkQ29tbXVuaXR5VmFsdWU7XG4gICAgfSk7XG4gICAgdGhpcy5CaW5kU2luZ2xlRERMKHRoaXMuX3Byb3AuZGRsR3JpZENvbnRyb2wsIGdyaWREYXRhTGlzdCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmlmICgkKFwiI3ZpZXdIb3VzZUFuZFBlcnNvbldyYXBcIikubGVuZ3RoID4gMCkge1xuICB2YXIgVmlld0hvdXNlQW5kUGVyc29uV3JhcCA9IG5ldyBWdWUoe1xuICAgIGVsOiBcIiN2aWV3SG91c2VBbmRQZXJzb25XcmFwXCIsXG4gICAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICAgIHZhciB3aW5kb3dIZWlnaHQgPSBCYXNlVXRpbGl0eS5HZXRVcmxQYXJhVmFsdWUoXCJ3aW5kb3dIZWlnaHRcIik7XG4gICAgICB2YXIgYnVpbGRJZCA9IEJhc2VVdGlsaXR5LkdldFVybFBhcmFWYWx1ZShcInJlY29yZElkXCIpO1xuICAgICAgJChcIiN2aWV3SG91c2VBbmRQZXJzb25XcmFwXCIpLmhlaWdodCh3aW5kb3dIZWlnaHQgLSAyMDApO1xuICAgICAgdGhpcy5saXN0SGVpZ2h0ID0gd2luZG93SGVpZ2h0IC0gMjYwO1xuICAgICAgdGhpcy5sb2FkSG91c2VEYXRhKGJ1aWxkSWQpO1xuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0SG91c2VCeUJ1aWxkSWQ6IFwiL1Jlc3QvR3JpZC9CdWlsZC9Ib3VzZUluZm8vR2V0SG91c2VCeUJ1aWxkSWRcIixcbiAgICAgICAgZWRpdEhvdXNlVmlldzogXCIvSFRNTC9CdWlsZGVyL1J1bnRpbWUvV2ViRm9ybUluZGVwZW5kZW5jZVJ1bnRpbWUuaHRtbFwiLFxuICAgICAgICBlZGl0SG91c2VGb3JtSWQ6IFwiY2NmZGFjNjMtZDlkNy00YTY3LWFkOWYtNzQ3ZTg4YTQ4ZjVkXCIsXG4gICAgICAgIGRlbGV0ZUhvdXNlOiBcIi9SZXN0L0dyaWQvQnVpbGQvSG91c2VJbmZvL0RlbGV0ZVwiLFxuICAgICAgICBlZGl0UGVyc29uVmlldzogXCIvSFRNTC9CdWlsZGVyL1J1bnRpbWUvV2ViRm9ybUluZGVwZW5kZW5jZVJ1bnRpbWUuaHRtbFwiLFxuICAgICAgICBlZGl0RmFtaWx5Rm9ybUlkOiBcIjE0ODhlZTUwLWVmYjYtNDA5YS1hZmM3LWViMGY5NzEwNzEzZlwiLFxuICAgICAgICBlZGl0UGVyc29uRm9ybUlkOiBcIjVkNmRlMzg4LWNlMWUtNDNjNy1iNTkyLWM5ZTgwYjcxNDM1Y1wiLFxuICAgICAgICBnZXRQZXJzb25CeUhvdXNlSWQ6IFwiL1Jlc3QvR3JpZC9QZXJzb24vUGVyc29uTWFpbi9HZXRQZXJzb25CeUhvdXNlSWRcIixcbiAgICAgICAgZGVsZXRlUGVyc29uOiBcIi9SZXN0L0dyaWQvUGVyc29uL1BlcnNvbk1haW4vRGVsZXRlUGVyc29uV2l0aEZhbWlseVwiLFxuICAgICAgICBlZGl0RW50ZXJwcmlzZVZpZXc6IFwiL0hUTUwvQnVpbGRlci9SdW50aW1lL1dlYkZvcm1JbmRlcGVuZGVuY2VSdW50aW1lLmh0bWxcIixcbiAgICAgICAgZWRpdEVudGVycHJpc2VGb3JtSWQ6IFwiOWUwZTI1OGEtNjM5YS00MjA5LTgzYmYtNjA3MDAwZGUwZjc3XCIsXG4gICAgICAgIGdldEVudGVycHJpc2VCeUhvdXNlSWQ6IFwiL1Jlc3QvR3JpZC9FbnRlcnByaXNlL0VudGVycHJpc2VNYWluL0dldEVudGVycHJpc2VCeUhvdXNlSWRcIixcbiAgICAgICAgZGVsZXRlRW50ZXJwcmlzZTogXCIvUmVzdC9HcmlkL0VudGVycHJpc2UvRW50ZXJwcmlzZU1haW4vRGVsZXRlXCJcbiAgICAgIH0sXG4gICAgICBsaXN0SGVpZ2h0OiAxMDAsXG4gICAgICBob3VzZToge1xuICAgICAgICBzZWxlY3RlZEhvdXNlOiBudWxsLFxuICAgICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICAgIHRpdGxlOiAn5oi/5bGL57yW56CBJyxcbiAgICAgICAgICBrZXk6ICdob3VzZUNvZGVGdWxsJyxcbiAgICAgICAgICBhbGlnbjogXCJsZWZ0XCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5oi/5Y+3JyxcbiAgICAgICAgICBrZXk6ICdob3VzZU51bU5hbWUnLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgIHdpZHRoOiAxMjBcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5L2/55So5oOF5Ya1JyxcbiAgICAgICAgICBrZXk6ICdob3VzZVVzZWREZXNjJyxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICfmk43kvZwnLFxuICAgICAgICAgIGtleTogJ2hvdXNlSWQnLFxuICAgICAgICAgIHdpZHRoOiA4MCxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBidXR0b25zID0gW107XG4gICAgICAgICAgICBidXR0b25zLnB1c2goaCgnVG9vbHRpcCcsIHtcbiAgICAgICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIuafpeeci1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0LXJvdy1idXR0b24gdmlld1wiLFxuICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgICAgICAgIFZpZXdIb3VzZUFuZFBlcnNvbldyYXAudmlld0hvdXNlKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KV0pKTtcbiAgICAgICAgICAgIHZhciBlaCA9IGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICAgIH0sIGJ1dHRvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIGVoO1xuICAgICAgICAgIH1cbiAgICAgICAgfV0sXG4gICAgICAgIHRhYmxlRGF0YTogW10sXG4gICAgICAgIHNlYXJjaEhvdXNlVGV4dDogXCJcIlxuICAgICAgfSxcbiAgICAgIHBlcnNvbjoge1xuICAgICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICAgIHRpdGxlOiAn5Lq65ZGYJyxcbiAgICAgICAgICBrZXk6ICdkaXNwbGF5VGV4dCcsXG4gICAgICAgICAgYWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgIHdpZHRoOiAxMjBcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn6Lqr5Lu96K+B5Y+3JyxcbiAgICAgICAgICBrZXk6ICdwZXJzb25JZENhcmQnLFxuICAgICAgICAgIGFsaWduOiBcImxlZnRcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICfogZTns7vnlLXor50nLFxuICAgICAgICAgIGtleTogJ3BlcnNvblBob25lJyxcbiAgICAgICAgICBhbGlnbjogXCJsZWZ0XCIsXG4gICAgICAgICAgd2lkdGg6IDE0MFxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICfmk43kvZwnLFxuICAgICAgICAgIGtleTogJ3BlcnNvbklkJyxcbiAgICAgICAgICB3aWR0aDogMTQwLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgICAgdmFyIGJ1dHRvbnMgPSBbXTtcbiAgICAgICAgICAgIGJ1dHRvbnMucHVzaChoKCdUb29sdGlwJywge1xuICAgICAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwi5p+l55yLXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3Qtcm93LWJ1dHRvbiB2aWV3XCIsXG4gICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgICAgICAgVmlld0hvdXNlQW5kUGVyc29uV3JhcC52aWV3UGVyc29uKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KV0pKTtcbiAgICAgICAgICAgIHZhciBlaCA9IGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICAgIH0sIGJ1dHRvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIGVoO1xuICAgICAgICAgIH1cbiAgICAgICAgfV0sXG4gICAgICAgIHRhYmxlRGF0YTogW11cbiAgICAgIH0sXG4gICAgICBlbnRlcnByaXNlOiB7XG4gICAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgICAgdGl0bGU6ICfkvIHkuJoo6Zeo5bqX5ZCN56ewKScsXG4gICAgICAgICAga2V5OiAnZW50TmFtZScsXG4gICAgICAgICAgYWxpZ246IFwibGVmdFwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgICAga2V5OiAnZW50SWQnLFxuICAgICAgICAgIHdpZHRoOiAxNDAsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgYnV0dG9ucyA9IFtdO1xuICAgICAgICAgICAgYnV0dG9ucy5wdXNoKGgoJ1Rvb2x0aXAnLCB7XG4gICAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgY29udGVudDogXCLmn6XnnItcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uIHZpZXdcIixcbiAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICAgICAgICBncmlkTWFuYWdlci52aWV3RW50ZXJwcmlzZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSldKSk7XG4gICAgICAgICAgICBidXR0b25zLnB1c2goaCgnVG9vbHRpcCcsIHtcbiAgICAgICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIuS/ruaUuVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0LXJvdy1idXR0b24gZWRpdFwiLFxuICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgICAgICAgIGdyaWRNYW5hZ2VyLmVkaXRFbnRlcnByaXNlKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KV0pKTtcbiAgICAgICAgICAgIGJ1dHRvbnMucHVzaChoKCdUb29sdGlwJywge1xuICAgICAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwi5Yig6ZmkXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3Qtcm93LWJ1dHRvbiBkZWxcIixcbiAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICAgICAgICBncmlkTWFuYWdlci5kZWxFbnRlcnByaXNlKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KV0pKTtcbiAgICAgICAgICAgIHZhciBlaCA9IGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICAgIH0sIGJ1dHRvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIGVoO1xuICAgICAgICAgIH1cbiAgICAgICAgfV0sXG4gICAgICAgIHRhYmxlRGF0YTogW11cbiAgICAgIH1cbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgIGdldEZvcm1QYXJhOiBmdW5jdGlvbiBnZXRGb3JtUGFyYShmb3JtSWQsIG9wTmFtZSwgcmVjb3JkSWQsIG1lbnVSaWdodFVybFBhcmEsIGVuZEZ1bmMpIHtcbiAgICAgICAgdmFyIHBhcmEgPSB7XG4gICAgICAgICAgXCJmb3JtSWRcIjogZm9ybUlkLFxuICAgICAgICAgIFwiYnV0dG9uSWRcIjogXCJcIixcbiAgICAgICAgICBcImxpc3RGb3JtQnV0dG9uRWxlbUlkXCI6IFwiXCIsXG4gICAgICAgICAgXCJyZWNvcmRJZFwiOiByZWNvcmRJZCxcbiAgICAgICAgICBcIm9wZXJhdGlvblR5cGVcIjogb3BOYW1lLFxuICAgICAgICAgIFwid2luZG93V2lkdGhcIjogMTMwMCxcbiAgICAgICAgICBcIndpbmRvd0hlaWdodFwiOiA4ODAsXG4gICAgICAgICAgXCJtZW51UmlnaHRVcmxQYXJhXCI6IG1lbnVSaWdodFVybFBhcmEsXG4gICAgICAgICAgXCJkZXZPcGVyYXRpb25FbmRGdW5jXCI6IGVuZEZ1bmMsXG4gICAgICAgICAgXCJtZW51UmlnaHRVcmxQYXJhSnNvblwiOiBcIlwiXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIDwgNTAwKSB7XG4gICAgICAgICAgcGFyYS53aW5kb3dIZWlnaHQgPSA2MDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyYTtcbiAgICAgIH0sXG4gICAgICBnZXRGb3JtRGlhbG9nUGFyYTogZnVuY3Rpb24gZ2V0Rm9ybURpYWxvZ1BhcmEodGl0bGUpIHtcbiAgICAgICAgdmFyIHBhcmEgPSB7XG4gICAgICAgICAgXCJ3aWR0aFwiOiAxMzAwLFxuICAgICAgICAgIFwiaGVpZ2h0XCI6IDg4MCxcbiAgICAgICAgICBcInRpdGxlXCI6IHRpdGxlXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIDwgNTAwKSB7XG4gICAgICAgICAgcGFyYS5oZWlnaHQgPSA2MDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyYTtcbiAgICAgIH0sXG4gICAgICBzZWxlY3Rpb25Ib3VzZUNoYW5nZTogZnVuY3Rpb24gc2VsZWN0aW9uSG91c2VDaGFuZ2Uocm93LCBpbmRleCkge1xuICAgICAgICBjb25zb2xlLmxvZyhyb3cpO1xuICAgICAgICB0aGlzLmhvdXNlLnNlbGVjdGVkSG91c2UgPSByb3c7XG4gICAgICAgIHRoaXMubG9hZFBlcnNvbkRhdGEoKTtcbiAgICAgICAgdGhpcy5sb2FkRW50ZXJwcmlzZURhdGEoKTtcbiAgICAgIH0sXG4gICAgICBsb2FkSG91c2VEYXRhOiBmdW5jdGlvbiBsb2FkSG91c2VEYXRhKGJ1aWxkSWQpIHtcbiAgICAgICAgQWpheFV0aWxpdHkuR2V0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0SG91c2VCeUJ1aWxkSWQsIHtcbiAgICAgICAgICBidWlsZElkOiBidWlsZElkXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICB0aGlzLmhvdXNlLnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9LFxuICAgICAgc2VhcmNoSG91c2U6IGZ1bmN0aW9uIHNlYXJjaEhvdXNlKCkge1xuICAgICAgICB2YXIgdGV4dCA9IHRoaXMuaG91c2Uuc2VhcmNoSG91c2VUZXh0O1xuXG4gICAgICAgIGlmICh0aGlzLmhvdXNlLnNvdXJjZVRhYmxlRGF0YSkge1xuICAgICAgICAgIHRoaXMuaG91c2UudGFibGVEYXRhID0gdGhpcy5ob3VzZS5zb3VyY2VUYWJsZURhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ob3VzZS50YWJsZURhdGEubGVuZ3RoID4gMCAmJiBTdHJpbmdVdGlsaXR5LklzTm90TnVsbE9yRW1wdHkodGV4dCkpIHtcbiAgICAgICAgICB0aGlzLmhvdXNlLnNvdXJjZVRhYmxlRGF0YSA9IHRoaXMuaG91c2UudGFibGVEYXRhO1xuICAgICAgICAgIHRoaXMuaG91c2UudGFibGVEYXRhID0gQXJyYXlVdGlsaXR5LldoZXJlKHRoaXMuaG91c2UudGFibGVEYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgaWYgKGl0ZW0uaG91c2VDb2RlLmluZGV4T2YodGV4dCkgPj0gMCB8fCBpdGVtLmhvdXNlTnVtTmFtZS5pbmRleE9mKHRleHQpID49IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhZGRIb3VzZTogZnVuY3Rpb24gYWRkSG91c2UoKSB7XG4gICAgICAgIHZhciBzZWxlY3RlZEJ1aWxkID0gdGhpcy5idWlsZFRyZWUudHJlZVNlbGVjdGVkTm9kZTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWRCdWlsZCA9PSBudWxsKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7flhYjpgInmi6nlu7rnrZHniakhXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtZW51UmlnaHRVcmxQYXJhID0gW3tcbiAgICAgICAgICBcIkFjdGlvblR5cGVcIjogXCJCaW5kVG9GaWVsZFwiLFxuICAgICAgICAgIFwiRmllbGROYW1lXCI6IFwiSE9VU0VfQlVJTERfSURcIixcbiAgICAgICAgICBcIlZhbHVlXCI6IHNlbGVjdGVkQnVpbGQuYnVpbGRJZFxuICAgICAgICB9XTtcbiAgICAgICAgdmFyIGZvcm1QYXJhID0gdGhpcy5nZXRGb3JtUGFyYSh0aGlzLmFjSW50ZXJmYWNlLmVkaXRIb3VzZUZvcm1JZCwgQmFzZVV0aWxpdHkuR2V0QWRkT3BlcmF0aW9uTmFtZSgpLCBcIlwiLCBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcobWVudVJpZ2h0VXJsUGFyYSksIFwicmVMb2FkSG91c2VcIik7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRCdWlsZFZpZXcsIGZvcm1QYXJhKSwgdGhpcy5nZXRGb3JtRGlhbG9nUGFyYShcIuaIv+Wxi+eZu+iusFwiKSwgMSwgdHJ1ZSk7XG4gICAgICB9LFxuICAgICAgdmlld0hvdXNlOiBmdW5jdGlvbiB2aWV3SG91c2UocGFyYSkge1xuICAgICAgICB2YXIgaG91c2VJZCA9IHBhcmEucm93LmhvdXNlSWQ7XG4gICAgICAgIHZhciBmb3JtUGFyYSA9IHRoaXMuZ2V0Rm9ybVBhcmEodGhpcy5hY0ludGVyZmFjZS5lZGl0SG91c2VGb3JtSWQsIEJhc2VVdGlsaXR5LkdldFZpZXdPcGVyYXRpb25OYW1lKCksIGhvdXNlSWQsIFwiXCIsIFwicmVMb2FkSG91c2VcIik7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQwMywgQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdEhvdXNlVmlldywgZm9ybVBhcmEpLCB0aGlzLmdldEZvcm1EaWFsb2dQYXJhKFwi5oi/5bGL55m76K6wXCIpLCAxLCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICBlZGl0SG91c2U6IGZ1bmN0aW9uIGVkaXRIb3VzZShwYXJhKSB7XG4gICAgICAgIHZhciBob3VzZUlkID0gcGFyYS5yb3cuaG91c2VJZDtcbiAgICAgICAgdmFyIGZvcm1QYXJhID0gdGhpcy5nZXRGb3JtUGFyYSh0aGlzLmFjSW50ZXJmYWNlLmVkaXRIb3VzZUZvcm1JZCwgQmFzZVV0aWxpdHkuR2V0VXBkYXRlT3BlcmF0aW9uTmFtZSgpLCBob3VzZUlkLCBcIlwiLCBcInJlTG9hZEhvdXNlXCIpO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0QnVpbGRWaWV3LCBmb3JtUGFyYSksIHRoaXMuZ2V0Rm9ybURpYWxvZ1BhcmEoXCLmiL/lsYvnmbvorrBcIiksIDEsIHRydWUpO1xuICAgICAgfSxcbiAgICAgIGRlbEhvdXNlOiBmdW5jdGlvbiBkZWxIb3VzZShwYXJhKSB7XG4gICAgICAgIHZhciBob3VzZUlkID0gcGFyYS5yb3cuaG91c2VJZDtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5Db25maXJtKHdpbmRvdywgXCLnoa7orqTopoHliKDpmaTlvZPliY3miL/lsYvlkJfvvJ9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIEFqYXhVdGlsaXR5LkRlbGV0ZSh0aGlzLmFjSW50ZXJmYWNlLmRlbGV0ZUhvdXNlLCB7XG4gICAgICAgICAgICByZWNvcmRJZDogaG91c2VJZFxuICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChyZXN1bHQubWVzc2FnZSk7XG4gICAgICAgICAgICAgIHRoaXMubG9hZEhvdXNlRGF0YSh0aGlzLmJ1aWxkVHJlZS50cmVlU2VsZWN0ZWROb2RlLmJ1aWxkSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0sXG4gICAgICBzZWxlY3Rpb25QZXJzb25DaGFuZ2U6IGZ1bmN0aW9uIHNlbGVjdGlvblBlcnNvbkNoYW5nZSgpIHt9LFxuICAgICAgbG9hZFBlcnNvbkRhdGE6IGZ1bmN0aW9uIGxvYWRQZXJzb25EYXRhKCkge1xuICAgICAgICB2YXIgaG91c2VJZCA9IHRoaXMuaG91c2Uuc2VsZWN0ZWRIb3VzZS5ob3VzZUlkO1xuICAgICAgICBBamF4VXRpbGl0eS5HZXQodGhpcy5hY0ludGVyZmFjZS5nZXRQZXJzb25CeUhvdXNlSWQsIHtcbiAgICAgICAgICBob3VzZUlkOiBob3VzZUlkXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIHJlc3VsdC5kYXRhW2ldLmRpc3BsYXlUZXh0ID0gcmVzdWx0LmRhdGFbaV0ucGVyc29uTmFtZTtcblxuICAgICAgICAgICAgICBpZiAocmVzdWx0LmRhdGFbaV0ucGVyc29uUmVsYXRpb25zaGlwID09IFwiMFwiKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmRhdGFbaV0uZGlzcGxheVRleHQgPSBcIlvmiLfkuLtdXCIgKyByZXN1bHQuZGF0YVtpXS5kaXNwbGF5VGV4dDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuZGF0YVtpXS5kaXNwbGF5VGV4dCA9IFwiW+aIkOWRmF1cIiArIHJlc3VsdC5kYXRhW2ldLmRpc3BsYXlUZXh0O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucGVyc29uLnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9LFxuICAgICAgYWRkRmFtaWx5OiBmdW5jdGlvbiBhZGRGYW1pbHkoKSB7XG4gICAgICAgIHZhciBzZWxlY3RlZEhvdXNlID0gdGhpcy5ob3VzZS5zZWxlY3RlZEhvdXNlO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZEhvdXNlID09IG51bGwpIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuivt+WFiOmAieaLqeaIv+WxiyFcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1lbnVSaWdodFVybFBhcmEgPSBbe1xuICAgICAgICAgIFwiQWN0aW9uVHlwZVwiOiBcIkJpbmRUb0ZpZWxkXCIsXG4gICAgICAgICAgXCJGaWVsZE5hbWVcIjogXCJGQU1JTFlfSE9VU0VfSURcIixcbiAgICAgICAgICBcIlZhbHVlXCI6IHNlbGVjdGVkSG91c2UuaG91c2VJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJBY3Rpb25UeXBlXCI6IFwiQmluZFRvRmllbGRcIixcbiAgICAgICAgICBcIkZpZWxkTmFtZVwiOiBcIkZBTUlMWV9IT1VTRV9DT0RFX0ZVTExcIixcbiAgICAgICAgICBcIlZhbHVlXCI6IHNlbGVjdGVkSG91c2UuaG91c2VDb2RlRnVsbFxuICAgICAgICB9XTtcbiAgICAgICAgdmFyIGZvcm1QYXJhID0gdGhpcy5nZXRGb3JtUGFyYSh0aGlzLmFjSW50ZXJmYWNlLmVkaXRGYW1pbHlGb3JtSWQsIEJhc2VVdGlsaXR5LkdldEFkZE9wZXJhdGlvbk5hbWUoKSwgXCJcIiwgSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKG1lbnVSaWdodFVybFBhcmEpLCBcInJlTG9hZFBlcnNvblwiKTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdEJ1aWxkVmlldywgZm9ybVBhcmEpLCB0aGlzLmdldEZvcm1EaWFsb2dQYXJhKFwi5oi355m76K6wXCIpLCAxLCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICBkZWxQZXJzb246IGZ1bmN0aW9uIGRlbFBlcnNvbihwYXJhKSB7XG4gICAgICAgIHZhciBwZXJzb25JZCA9IHBhcmEucm93LnBlcnNvbklkO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOimgeWIoOmZpOW9k+WJjeS6uuWRmOWQl++8nzxiciAvPjE66ZyA6KaB5YWI5Yig6Zmk5oi35Lit55qE5YW25LuW5oiQ5ZGYLOaJjeWPr+S7peWIoOmZpOaIt+S4uy48YnIgLz4y5Yig6Zmk5oi35Li75pe2LOWwhuWQjOaXtuWIoOmZpOivpeaIt+eahOS/oeaBry5cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIEFqYXhVdGlsaXR5LkRlbGV0ZSh0aGlzLmFjSW50ZXJmYWNlLmRlbGV0ZVBlcnNvbiwge1xuICAgICAgICAgICAgcGVyc29uSWQ6IHBlcnNvbklkXG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KHJlc3VsdC5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgdGhpcy5sb2FkUGVyc29uRGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0sXG4gICAgICBlZGl0UGVyc29uOiBmdW5jdGlvbiBlZGl0UGVyc29uKHBhcmEpIHtcbiAgICAgICAgdmFyIHBlcnNvbklkID0gcGFyYS5yb3cucGVyc29uSWQ7XG4gICAgICAgIHZhciBmb3JtUGFyYSA9IHRoaXMuZ2V0Rm9ybVBhcmEodGhpcy5hY0ludGVyZmFjZS5lZGl0UGVyc29uRm9ybUlkLCBCYXNlVXRpbGl0eS5HZXRVcGRhdGVPcGVyYXRpb25OYW1lKCksIHBlcnNvbklkLCBcIlwiLCBcInJlTG9hZFBlcnNvblwiKTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdEJ1aWxkVmlldywgZm9ybVBhcmEpLCB0aGlzLmdldEZvcm1EaWFsb2dQYXJhKFwi5Lq65ZGY5L+h5oGv57u05oqkXCIpLCAxLCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICBlZGl0RmFtaWx5OiBmdW5jdGlvbiBlZGl0RmFtaWx5KHBhcmEpIHtcbiAgICAgICAgdmFyIHBlcnNvbkZhbWlseUlkID0gcGFyYS5yb3cucGVyc29uRmFtaWx5SWQ7XG4gICAgICAgIHZhciBmb3JtUGFyYSA9IHRoaXMuZ2V0Rm9ybVBhcmEodGhpcy5hY0ludGVyZmFjZS5lZGl0RmFtaWx5Rm9ybUlkLCBCYXNlVXRpbGl0eS5HZXRVcGRhdGVPcGVyYXRpb25OYW1lKCksIHBlcnNvbkZhbWlseUlkLCBcIlwiLCBcInJlTG9hZFBlcnNvblwiKTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdEJ1aWxkVmlldywgZm9ybVBhcmEpLCB0aGlzLmdldEZvcm1EaWFsb2dQYXJhKFwi5oi355m76K6wXCIpLCAxLCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICB2aWV3UGVyc29uOiBmdW5jdGlvbiB2aWV3UGVyc29uKHBhcmEpIHtcbiAgICAgICAgdmFyIHBlcnNvbklkID0gcGFyYS5yb3cucGVyc29uSWQ7XG4gICAgICAgIHZhciBmb3JtUGFyYSA9IHRoaXMuZ2V0Rm9ybVBhcmEodGhpcy5hY0ludGVyZmFjZS5lZGl0UGVyc29uRm9ybUlkLCBCYXNlVXRpbGl0eS5HZXRWaWV3T3BlcmF0aW9uTmFtZSgpLCBwZXJzb25JZCwgXCJcIiwgXCJyZUxvYWRQZXJzb25cIik7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQwMywgQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdFBlcnNvblZpZXcsIGZvcm1QYXJhKSwgdGhpcy5nZXRGb3JtRGlhbG9nUGFyYShcIuS6uuWRmOS/oeaBr+afpeeci1wiKSwgMSwgdHJ1ZSk7XG4gICAgICB9LFxuICAgICAgYWRkRW50ZXJwcmlzZTogZnVuY3Rpb24gYWRkRW50ZXJwcmlzZSgpIHtcbiAgICAgICAgdmFyIHNlbGVjdGVkSG91c2UgPSB0aGlzLmhvdXNlLnNlbGVjdGVkSG91c2U7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkSG91c2UgPT0gbnVsbCkge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+35YWI6YCJ5oup5oi/5bGLIVwiKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbWVudVJpZ2h0VXJsUGFyYSA9IFt7XG4gICAgICAgICAgXCJBY3Rpb25UeXBlXCI6IFwiQmluZFRvRmllbGRcIixcbiAgICAgICAgICBcIkZpZWxkTmFtZVwiOiBcIkVOVF9IT1VTRV9JRFwiLFxuICAgICAgICAgIFwiVmFsdWVcIjogc2VsZWN0ZWRIb3VzZS5ob3VzZUlkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcIkFjdGlvblR5cGVcIjogXCJCaW5kVG9GaWVsZFwiLFxuICAgICAgICAgIFwiRmllbGROYW1lXCI6IFwiRU5UX0hPVVNFX0NPREVcIixcbiAgICAgICAgICBcIlZhbHVlXCI6IHNlbGVjdGVkSG91c2UuaG91c2VDb2RlRnVsbFxuICAgICAgICB9XTtcbiAgICAgICAgdmFyIGZvcm1QYXJhID0gdGhpcy5nZXRGb3JtUGFyYSh0aGlzLmFjSW50ZXJmYWNlLmVkaXRFbnRlcnByaXNlRm9ybUlkLCBCYXNlVXRpbGl0eS5HZXRBZGRPcGVyYXRpb25OYW1lKCksIFwiXCIsIEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyhtZW51UmlnaHRVcmxQYXJhKSwgXCJyZUxvYWRFbnRlcnByaXNlXCIpO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0QnVpbGRWaWV3LCBmb3JtUGFyYSksIHRoaXMuZ2V0Rm9ybURpYWxvZ1BhcmEoXCLkvIHkuJrms5XkurrnmbvorrBcIiksIDEsIHRydWUpO1xuICAgICAgfSxcbiAgICAgIGxvYWRFbnRlcnByaXNlRGF0YTogZnVuY3Rpb24gbG9hZEVudGVycHJpc2VEYXRhKCkge1xuICAgICAgICB2YXIgaG91c2VJZCA9IHRoaXMuaG91c2Uuc2VsZWN0ZWRIb3VzZS5ob3VzZUlkO1xuICAgICAgICBBamF4VXRpbGl0eS5HZXQodGhpcy5hY0ludGVyZmFjZS5nZXRFbnRlcnByaXNlQnlIb3VzZUlkLCB7XG4gICAgICAgICAgaG91c2VJZDogaG91c2VJZFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgdGhpcy5lbnRlcnByaXNlLnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9LFxuICAgICAgdmlld0VudGVycHJpc2U6IGZ1bmN0aW9uIHZpZXdFbnRlcnByaXNlKHBhcmEpIHtcbiAgICAgICAgdmFyIGVudElkID0gcGFyYS5yb3cuZW50SWQ7XG4gICAgICAgIHZhciBmb3JtUGFyYSA9IHRoaXMuZ2V0Rm9ybVBhcmEodGhpcy5hY0ludGVyZmFjZS5lZGl0RW50ZXJwcmlzZUZvcm1JZCwgQmFzZVV0aWxpdHkuR2V0Vmlld09wZXJhdGlvbk5hbWUoKSwgZW50SWQsIFwiXCIsIFwicmVMb2FkRW50ZXJwcmlzZVwiKTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdEJ1aWxkVmlldywgZm9ybVBhcmEpLCB0aGlzLmdldEZvcm1EaWFsb2dQYXJhKFwi5LyB5Lia5rOV5Lq65p+l55yLXCIpLCAxLCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICBlZGl0RW50ZXJwcmlzZTogZnVuY3Rpb24gZWRpdEVudGVycHJpc2UocGFyYSkge1xuICAgICAgICB2YXIgZW50SWQgPSBwYXJhLnJvdy5lbnRJZDtcbiAgICAgICAgdmFyIGZvcm1QYXJhID0gdGhpcy5nZXRGb3JtUGFyYSh0aGlzLmFjSW50ZXJmYWNlLmVkaXRFbnRlcnByaXNlRm9ybUlkLCBCYXNlVXRpbGl0eS5HZXRVcGRhdGVPcGVyYXRpb25OYW1lKCksIGVudElkLCBcIlwiLCBcInJlTG9hZEVudGVycHJpc2VcIik7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRCdWlsZFZpZXcsIGZvcm1QYXJhKSwgdGhpcy5nZXRGb3JtRGlhbG9nUGFyYShcIuS8geS4muazleS6uueZu+iusFwiKSwgMSwgdHJ1ZSk7XG4gICAgICB9LFxuICAgICAgZGVsRW50ZXJwcmlzZTogZnVuY3Rpb24gZGVsRW50ZXJwcmlzZShwYXJhKSB7XG4gICAgICAgIHZhciBlbnRJZCA9IHBhcmEucm93LmVudElkO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOimgeWIoOmZpOW9k+WJjeS8geS4muWQl++8n1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgQWpheFV0aWxpdHkuRGVsZXRlKHRoaXMuYWNJbnRlcmZhY2UuZGVsZXRlRW50ZXJwcmlzZSwge1xuICAgICAgICAgICAgcmVjb3JkSWQ6IGVudElkXG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KHJlc3VsdC5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgdGhpcy5sb2FkRW50ZXJwcmlzZURhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0iXX0=
