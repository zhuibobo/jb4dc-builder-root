if($("#viewHouseAndPersonWrap").length>0) {
    var ViewHouseAndPersonWrap = new Vue({
        el: "#viewHouseAndPersonWrap",
        mounted: function () {
            //this.initTree("false");12
            //BaiduMapUtility.LoadJsCompleted("gridManager.initBaiduMap");
            //$("#map-wrap-grid").height(PageStyleUtility.GetPageHeight()-80);
            var windowHeight = BaseUtility.GetUrlParaValue("windowHeight");
            var buildId = BaseUtility.GetUrlParaValue("recordId");
            $("#viewHouseAndPersonWrap").height(windowHeight - 200);
            this.listHeight = windowHeight - 260;
            this.loadHouseData(buildId);
        },
        data: {
            acInterface: {
                //House
                getHouseByBuildId: "/Rest/Grid/Build/HouseInfo/GetHouseByBuildId",
                editHouseView: "/HTML/Builder/Runtime/WebFormIndependenceRuntime.html",
                editHouseFormId: "ccfdac63-d9d7-4a67-ad9f-747e88a48f5d",
                deleteHouse: "/Rest/Grid/Build/HouseInfo/Delete",
                //Person
                editPersonView: "/HTML/Builder/Runtime/WebFormIndependenceRuntime.html",
                editFamilyFormId: "1488ee50-efb6-409a-afc7-eb0f9710713f",
                editPersonFormId: "5d6de388-ce1e-43c7-b592-c9e80b71435c",
                getPersonByHouseId: "/Rest/Grid/Person/PersonMain/GetPersonByHouseId",
                deletePerson: "/Rest/Grid/Person/PersonMain/DeletePersonWithFamily",
                //Enterprise
                editEnterpriseView: "/HTML/Builder/Runtime/WebFormIndependenceRuntime.html",
                editEnterpriseFormId: "9e0e258a-639a-4209-83bf-607000de0f77",
                getEnterpriseByHouseId: "/Rest/Grid/Enterprise/EnterpriseMain/GetEnterpriseByHouseId",
                deleteEnterprise: "/Rest/Grid/Enterprise/EnterpriseMain/Delete"
            },
            listHeight: 100,
            //House
            house: {
                selectedHouse: null,
                columnsConfig: [
                    {
                        title: '房屋编码',
                        key: 'houseCodeFull',
                        align: "left"
                    }, {
                        title: '房号',
                        key: 'houseNumName',
                        align: "center",
                        width: 120,
                    }, {
                        title: '使用情况',
                        key: 'houseUsedDesc',
                        align: "center"
                    }, {
                        title: '操作',
                        key: 'houseId',
                        width: 80,
                        align: "center",
                        render: function (h, params) {
                            var buttons = [];

                            buttons.push(h('Tooltip', {
                                props: {
                                    content: "查看"
                                }
                            }, [h('div', {
                                class: "list-row-button view",
                                on: {
                                    click: function click() {
                                        ViewHouseAndPersonWrap.viewHouse(params);
                                    }
                                }
                            })]));

                            var eh = h('div', {class: "list-row-button-wrap"}, buttons);
                            return eh;
                        }
                    }
                ],
                tableData: [],
                searchHouseText: ""
            },
            //person
            person: {
                columnsConfig: [
                    {
                        title: '人员',
                        key: 'displayText',
                        align: "left",
                        width: 120,
                    },{
                        title: '身份证号',
                        key: 'personIdCard',
                        align: "left"
                    },{
                        title: '联系电话',
                        key: 'personPhone',
                        align: "left",
                        width: 140,
                    }, {
                        title: '操作',
                        key: 'personId',
                        width: 140,
                        align: "center",
                        render: function (h, params) {
                            var buttons = [];

                            buttons.push(h('Tooltip', {
                                props: {
                                    content: "查看"
                                }
                            }, [h('div', {
                                class: "list-row-button view",
                                on: {
                                    click: function click() {
                                        ViewHouseAndPersonWrap.viewPerson(params);
                                    }
                                }
                            })]));

                            var eh = h('div', {class: "list-row-button-wrap"}, buttons);
                            return eh;
                        }
                    }
                ],
                tableData: []
            },
            //Enterprise
            enterprise: {
                columnsConfig: [
                    {
                        title: '企业(门店名称)',
                        key: 'entName',
                        align: "left"
                    }, {
                        title: '操作',
                        key: 'entId',
                        width: 140,
                        align: "center",
                        render: function (h, params) {
                            var buttons = [];

                            buttons.push(h('Tooltip', {
                                props: {
                                    content: "查看"
                                }
                            }, [h('div', {
                                class: "list-row-button view",
                                on: {
                                    click: function click() {
                                        gridManager.viewEnterprise(params);
                                    }
                                }
                            })]));

                            buttons.push(
                                h('Tooltip', {
                                    props: {
                                        content: "修改"
                                    }
                                }, [h('div', {
                                    class: "list-row-button edit",
                                    on: {
                                        click: function click() {
                                            gridManager.editEnterprise(params);
                                        }
                                    }
                                })]),
                            );

                            buttons.push(h('Tooltip', {
                                props: {
                                    content: "删除"
                                }
                            }, [h('div', {
                                class: "list-row-button del",
                                on: {
                                    click: function click() {
                                        gridManager.delEnterprise(params);
                                    }
                                }
                            })]));

                            var eh = h('div', {class: "list-row-button-wrap"}, buttons);
                            return eh;
                        }
                    }
                ],
                tableData: []
            }
        },
        methods: {
            getFormPara: function (formId, opName, recordId, menuRightUrlPara, endFunc) {
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
                }
                if (PageStyleUtility.GetPageHeight() < 500) {
                    para.windowHeight = 600;
                }
                return para;
            },
            getFormDialogPara: function (title) {
                //alert(PageStyleUtility.GetPageHeight());
                var para = {
                    "width": 1300,
                    "height": 880,
                    "title": title
                }
                if (PageStyleUtility.GetPageHeight() < 500) {
                    para.height = 600;
                }
                return para;
            },
            //region 房屋
            selectionHouseChange: function (row, index) {
                console.log(row);
                this.house.selectedHouse = row;
                this.loadPersonData();
                this.loadEnterpriseData();
            },
            loadHouseData: function (buildId) {
                AjaxUtility.Get(this.acInterface.getHouseByBuildId, {buildId: buildId}, function (result) {
                    console.log(result);
                    if (result.success) {
                        this.house.tableData = result.data;
                    }
                }, this);
            },
            searchHouse: function () {
                var text = this.house.searchHouseText;
                //debugger;
                if (this.house.sourceTableData) {
                    this.house.tableData = this.house.sourceTableData;
                }
                if (this.house.tableData.length > 0 && StringUtility.IsNotNullOrEmpty(text)) {
                    this.house.sourceTableData = this.house.tableData;
                    this.house.tableData = ArrayUtility.Where(this.house.tableData, function (item) {
                        if (item.houseCode.indexOf(text) >= 0 || item.houseNumName.indexOf(text) >= 0) {
                            return true;
                        }
                    })
                }
            },
            addHouse: function () {
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
            viewHouse: function (para) {
                var houseId = para.row.houseId;
                var formPara = this.getFormPara(this.acInterface.editHouseFormId, BaseUtility.GetViewOperationName(), houseId, "", "reLoadHouse");
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId03, BaseUtility.BuildView(this.acInterface.editHouseView, formPara), this.getFormDialogPara("房屋登记"), 1, true);
            },
            editHouse: function (para) {
                //debugger;
                var houseId = para.row.houseId;
                var formPara = this.getFormPara(this.acInterface.editHouseFormId, BaseUtility.GetUpdateOperationName(), houseId, "", "reLoadHouse");
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView(this.acInterface.editBuildView, formPara), this.getFormDialogPara("房屋登记"), 1, true);
            },
            delHouse: function (para) {
                var houseId = para.row.houseId;
                DialogUtility.Confirm(window, "确认要删除当前房屋吗？", function () {
                    AjaxUtility.Delete(this.acInterface.deleteHouse, {
                        recordId: houseId
                    }, function (result) {
                        if (result.success) {
                            //this.buildTree.treeSelectedNode = treeNode;
                            DialogUtility.AlertText(result.message);
                            this.loadHouseData(this.buildTree.treeSelectedNode.buildId);
                        }
                    }, this);
                }, this);
            },
            //endregion
            //region 人口
            selectionPersonChange: function () {

            },
            loadPersonData: function () {
                var houseId = this.house.selectedHouse.houseId;
                AjaxUtility.Get(this.acInterface.getPersonByHouseId, {houseId: houseId}, function (result) {
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
            addFamily: function () {
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
            delPerson: function (para) {
                var personId = para.row.personId;
                DialogUtility.Confirm(window, "确认要删除当前人员吗？<br />1:需要先删除户中的其他成员,才可以删除户主.<br />2删除户主时,将同时删除该户的信息.", function () {
                    AjaxUtility.Delete(this.acInterface.deletePerson, {
                        personId: personId
                    }, function (result) {
                        if (result.success) {
                            //this.buildTree.treeSelectedNode = treeNode;
                            DialogUtility.AlertText(result.message);
                            this.loadPersonData();
                        }
                    }, this);
                }, this);
            },
            editPerson: function (para) {
                var personId = para.row.personId;
                var formPara = this.getFormPara(this.acInterface.editPersonFormId, BaseUtility.GetUpdateOperationName(), personId, "", "reLoadPerson");
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView(this.acInterface.editBuildView, formPara), this.getFormDialogPara("人员信息维护"), 1, true);
            },
            editFamily: function (para) {
                var personFamilyId = para.row.personFamilyId;
                var formPara = this.getFormPara(this.acInterface.editFamilyFormId, BaseUtility.GetUpdateOperationName(), personFamilyId, "", "reLoadPerson");
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView(this.acInterface.editBuildView, formPara), this.getFormDialogPara("户登记"), 1, true);
            },
            viewPerson: function (para) {
                var personId = para.row.personId;
                var formPara = this.getFormPara(this.acInterface.editPersonFormId, BaseUtility.GetViewOperationName(), personId, "", "reLoadPerson");
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId03, BaseUtility.BuildView(this.acInterface.editPersonView, formPara), this.getFormDialogPara("人员信息查看"), 1, true);
            },
            //endregion
            //region 企业法人
            addEnterprise: function () {
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
            loadEnterpriseData: function () {
                var houseId = this.house.selectedHouse.houseId;
                AjaxUtility.Get(this.acInterface.getEnterpriseByHouseId, {houseId: houseId}, function (result) {
                    console.log(result);
                    if (result.success) {
                        this.enterprise.tableData = result.data;
                    }
                }, this);
            },
            viewEnterprise: function (para) {
                var entId = para.row.entId;
                var formPara = this.getFormPara(this.acInterface.editEnterpriseFormId, BaseUtility.GetViewOperationName(), entId, "", "reLoadEnterprise");
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView(this.acInterface.editBuildView, formPara), this.getFormDialogPara("企业法人查看"), 1, true);
            },
            editEnterprise: function (para) {
                var entId = para.row.entId;
                var formPara = this.getFormPara(this.acInterface.editEnterpriseFormId, BaseUtility.GetUpdateOperationName(), entId, "", "reLoadEnterprise");
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView(this.acInterface.editBuildView, formPara), this.getFormDialogPara("企业法人登记"), 1, true);
            },
            delEnterprise: function (para) {
                var entId = para.row.entId;
                DialogUtility.Confirm(window, "确认要删除当前企业吗？", function () {
                    AjaxUtility.Delete(this.acInterface.deleteEnterprise, {
                        recordId: entId
                    }, function (result) {
                        if (result.success) {
                            //this.buildTree.treeSelectedNode = treeNode;
                            DialogUtility.AlertText(result.message);
                            this.loadEnterpriseData();
                        }
                    }, this);
                }, this);
            }
            //endregion
        },
        template:`<div class="list-2column viewHouseAndPersonWrap" style="height: 704px">
                        <div class="left-outer-wrap iv-list-page-wrap" style="width: 650px">
                            <div class="title">建筑物中房屋
                            </div>
                            <i-table :columns="house.columnsConfig" :data="house.tableData" :height="listHeight" :highlight-row="true" border="" class="iv-list-table" @on-row-click="selectionHouseChange"> 
                            </i-table>
                          </div><div class="right-outer-wrap iv-list-page-wrap" style="padding: 10px;left: 660px;right: 0px;">
                            <div class="title">房屋中人口
                            </div>
                            <i-table :columns="person.columnsConfig" :data="person.tableData" :height="listHeight" :highlight-row="true" border="" class="iv-list-table" stripe=""> 
                            </i-table>
                          </div>
                    </div>`
    });
}