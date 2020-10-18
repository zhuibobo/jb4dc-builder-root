/*窗体内按钮*/
Vue.component("fd-control-field-and-api", {
    props: ["formId"],
    data: function () {
        var _self = this;

        return {
            tableData: [
                /*{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                }*/
            ],
            api: {
                acInterface: {
                    getAPIData: "/Rest/Builder/ApiItem/GetAPISForZTreeNodeList"
                },
                apiTreeObj: null,
                apiTreeSetting: {
                    view: {
                        dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                        showLine: true,//是否显示节点之间的连线
                        fontCss: {'color': 'black', 'font-weight': 'normal'}
                    },
                    check: {
                        enable: false,
                        nocheckInherit: false,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    data: {
                        key: {
                            name: "text"
                        },
                        simpleData: {//简单数据模式
                            enable: true,
                            idKey: "id",
                            pIdKey: "parentId",
                            rootPId: "-1"// 1
                        }
                    },
                    callback: {
                        //点击树节点事件
                        onClick: function (event, treeId, treeNode) {
                            //if (treeNode.nodeTypeName == "DataSet") {
                            _self.api.apiSelectData = treeNode;
                            //}
                        }
                    }
                },
                apiData: null,
                apiSelectData: null,
                editTableObject: null,
                editTableConfig: {
                    Status: "Edit",
                    AddAfterRowEvent: null,
                    DataField: "fieldName",
                    Templates: [
                        {
                            Title: "API名称",
                            BindName: "value",
                            Renderer: "EditTable_Label",
                            TitleCellClassName: "TitleCell",
                            Formater: function (value) {
                                return _self.getAPIText(value);
                            }
                            /*ClientDataSource: _self.api.apiSelectData*/
                        }, {
                            Title: "调用顺序",
                            BindName: "runTime",
                            Renderer: "EditTable_Select",
                            ClientDataSource: [{"Text": "之前", "Value": "之前"}, {"Text": "之后", "Value": "之后"}],
                            Width: 100
                        }
                    ],
                    RowIdCreater: function () {
                    },
                    TableClass: "edit-table",
                    RendererTo: "apiContainer",
                    TableId: "apiContainerTable",
                    TableAttrs: {cellpadding: "1", cellspacing: "1", border: "1"}
                }
            },
            field: {
                acInterface: {
                    getDataSetMainTableFields: "/Rest/Builder/DataSet/DatasetRelatedTable/GetDataSetMainTableFields",
                },
                editTableObject: null,
                editTableConfig: {
                    Status: "Edit",
                    AddAfterRowEvent: null,
                    DataField: "fieldName",
                    Templates: [
                        {
                            Title: "表名标题",
                            BindName: "tableName",
                            Renderer: "EditTable_Label"
                        }, {
                            Title: "字段标题",
                            BindName: "fieldName",
                            Renderer: "EditTable_Select"
                        }, {
                            Title: "默认值",
                            BindName: "defaultValue",
                            Renderer: "EditTable_SelectDefaultValue",
                            Hidden: false
                        }
                    ],
                    RowIdCreater: function () {
                    },
                    TableClass: "edit-table",
                    RendererTo: "fieldContainer",
                    TableId: "fieldContainerTable",
                    TableAttrs: {cellpadding: "1", cellspacing: "1", border: "1"}
                }
            },
            oldFormId: ""
        }
    },
    mounted: function () {

    },
    methods: {
        ready: function (dataSetId,tableId) {
            //if (tableDataJson != null && tableDataJson != "") {
            //    this.tableData = JsonUtility.StringToJson(tableDataJson);
            //}
            //debugger;
            this.dataSetId=dataSetId;
            this.tableId=tableId;
            this.bindTableFields(null);
            this.bindAPITreeAndInitEditTable(null);
        },
        getJson: function () {
            var result={};
            this.api.editTableObject.CompletedEditingRow();
            result.apis=this.api.editTableObject.GetSerializeJson();
            this.field.editTableObject.CompletedEditingRow();
            result.fields=this.field.editTableObject.GetSerializeJson();
            return result;
        },
        setData:function (apiOldData,filedOldData) {
            /*if(tableDataJson!=null&&tableDataJson!=""){
                this.tableData=JsonUtility.StringToJson(tableDataJson);
            }*/
            if(apiOldData){
                this.api.editTableObject.LoadJsonData(apiOldData);
            }
            if(filedOldData){
                this.field.editTableObject.LoadJsonData(filedOldData);
            }
        },
        handleClose: function (dialogElem) {
            DialogUtility.CloseDialogElem(this.$refs[dialogElem]);
        },

        //region 字段列表
        bindTableFields: function (oldData) {

            AjaxUtility.Post(this.field.acInterface.getDataSetMainTableFields, {dataSetId: this.dataSetId}, function (result) {
                    console.log(result);
                    var fieldsData = [];

                    for (var i = 0; i < result.data.length; i++) {
                        fieldsData.push({
                            Value: result.data[i].fieldName,
                            Text: result.data[i].fieldCaption
                        });
                    }
                    this.field.editTableConfig.Templates[0].DefaultValue = {
                        Type: "Const",
                        Value: result.data[0].tableName
                    };

                    this.field.editTableConfig.Templates[1].ClientDataSource = fieldsData;

                    if (!this.field.editTableObject) {
                        this.field.editTableObject = Object.create(EditTable);
                        this.field.editTableObject.Initialization(this.field.editTableConfig);
                    }

                    this.oldFormId = this.formId;

                    if (oldData) {
                        this.field.editTableObject.LoadJsonData(oldData);
                    }

                }, this);

            if (this.field.editTableObject) {
                this.field.editTableObject.RemoveAllRow();
            }
            if (oldData && this.field.editTableObject) {
                this.field.editTableObject.LoadJsonData(oldData);
            }
        },
        addField: function () {
            this.field.editTableObject.AddEditingRowByTemplate();
        },
        removeField: function () {
            this.field.editTableObject.RemoveRow();
        },
        //endregion
        addInnerFormCloseButton: function () {
            var closeButtonData = {
                caption: "关闭",
                id: "inner_close_button_" + StringUtility.Timestamp(),
                buttonType: "关闭按钮"
            };
            this.tableData.push(closeButtonData);
        },
        //region api列表
        bindAPITreeAndInitEditTable: function (oldData) {
            //var _self = this;
            //debugger;
            if (!this.api.apiData) {
                AjaxUtility.Post(this.api.acInterface.getAPIData, {}, function (result) {
                    if (result.success) {
                        this.api.apiData = result.data;
                        if (result.data != null && result.data.length > 0) {
                            for (var i = 0; i < result.data.length; i++) {
                                if (result.data[i].nodeTypeName == "Group") {
                                    result.data[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/package.png";
                                } else {
                                    result.data[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/application_view_columns.png";
                                }
                            }
                        }

                        // _self.api.treeData = result.data;
                        this.api.apiTreeObj = $.fn.zTree.init($("#apiZTreeUL"), this.api.apiTreeSetting, result.data);
                        this.api.apiTreeObj.expandAll(true);
                        fuzzySearchTreeObj(this.api.apiTreeObj, this.$refs.txt_search_api_text.$refs.input, null, true);
                    } else {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                    }

                    this.api.editTableObject = Object.create(EditTable);
                    this.api.editTableObject.Initialization(this.api.editTableConfig);
                    this.api.editTableObject.RemoveAllRow();
                    if (oldData) {
                        this.api.editTableObject.LoadJsonData(oldData);
                    }
                }, this);
            }
        },
        getApiConfigAndBindToTable: function () {
            return;
            var _self = this;
            AjaxUtility.Post(this.api.acInterface.getButtonApiConfig, {}, function (result) {
                //console.log(result);
                //var apiSelectData
                var apiSelectData = [];

                for (var i = 0; i < result.data.length; i++) {
                    var group = {
                        Group: result.data[i].name
                    }
                    var options = [];
                    for (var j = 0; j < result.data[i].buttonAPIVoList.length; j++) {
                        options.push({
                            Value: result.data[i].buttonAPIVoList[j].id,
                            Text: result.data[i].buttonAPIVoList[j].name
                        });
                    }
                    group["Options"] = options;
                    apiSelectData.push(group);
                }

                /*configSource=[{
                    group:"name",
                    options:[{
                        value:"1",
                        text:"2"
                    },{
                        value:"",
                        text:""
                    }]
                },{
                    group:"name",
                    options:[{
                        value:"",
                        text:""
                    },{
                        value:"",
                        text:""
                    }]
                }]*/

                _self.api.editTableConfig.Templates[0].ClientDataSource = apiSelectData;
                _self.api.editTableObject = Object.create(EditTable);
                _self.api.editTableObject.Initialization(_self.api.editTableConfig);
            }, this);
        },
        addAPI: function () {
            //console.log(this.api.apiSelectData);
            if (this.api.apiSelectData.nodeTypeName == "API") {
                this.api.editTableObject.AddEditingRowByTemplate([], {
                    value: this.api.apiSelectData.value,
                    runTime: "之后"
                });
            } else {
                DialogUtility.AlertText("请选择需要添加的API!");
            }
        },
        removeAPI: function () {
            this.api.editTableObject.RemoveRow();
        },
        clearAPI: function () {
            this.api.editTableObject.RemoveAllRow();
        },
        getAPIText: function (value) {
            //console.log(value);
            for (var i = 0; i < this.api.apiData.length; i++) {
                //debugger;
                //console.log(this.api.apiData[i]);
                if (this.api.apiData[i].nodeTypeName == "API") {
                    if (this.api.apiData[i].value == value) {
                        return this.api.apiData[i].text;
                    }
                }
            }
            return "";
        }
        //endregion
    },
    template: `<div class="iv-list-page-wrap">
                    <div>
                          <div style="float: left;width: 94%">
                            <div id="fieldContainer" class="edit-table-wrap" style="height: 180px;overflow: auto;width: 98%;margin: auto"></div>
                          </div>
                          <div style="float: right;width: 5%">
                            <button-group vertical>
                                <i-button size="small" type="success" icon="md-add" @click="addField"></i-button>
                                <i-button size="small" type="primary" icon="md-close" @click="removeField"></i-button>
                            </button-group>
                          </div>
                    </div>
                    <div>
                          <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                            <colgroup>
                                <col style="width: 320px" />
                                <col style="width: 60px" />
                                <col />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <td style="background: #ffffff">
                                        <i-input search class="input_border_bottom" ref="txt_search_api_text" placeholder="请输入API名称"></i-input>
                                        <ul id="apiZTreeUL" class="ztree" style="height: 260px;overflow: auto"></ul>
                                    </td>
                                    <td style="text-align: center;background-color: #f8f8f8">
                                        <button-group vertical>
                                            <i-button size="small" type="success" icon="md-add" @click="addAPI"></i-button>
                                            <i-button size="small" type="primary" icon="md-close" @click="removeAPI"></i-button>
                                            <i-button size="small" type="primary" icon="ios-trash" @click="clearAPI"></i-button>
                                        </button-group>
                                    </td>
                                    <td style="background: #ffffff;" valign="top">
                                        <div id="apiContainer" class="edit-table-wrap" style="height: 260px;overflow: auto;width: 98%;margin: auto"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>`
});