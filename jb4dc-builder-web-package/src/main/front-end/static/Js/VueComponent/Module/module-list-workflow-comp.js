/*html编辑器中的元素辅助列表1*/
Vue.component("module-list-workflow-comp", {
    props:['listHeight','moduleData','activeTabName'],
    data: function () {
        var _self=this;

        return {
            acInterface:{
                editView: "/HTML/WorkFlow/Modeler/Index.html",
                reloadData: "/Rest/Workflow/FlowModelIntegrated/GetModuleFlowListData",
                delete: "/Rest/Workflow/FlowModelIntegrated/Delete",
                move: "/Rest/Builder/FlowIntegrated/Move",
            },
            idFieldName: "modelId",
            searchCondition: {
                modelModuleId: {
                    value: "",
                    type: SearchUtility.SearchFieldType.StringType
                }
            },
            columnsConfig: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '编号',
                    key: 'modelCode',
                    align: "center",
                    width: 80
                },
                {
                    title: '模型名称',
                    key: 'modelName',
                    align: "left",
                    width: 280
                }, {
                    title: '备注',
                    key: 'modelDesc',
                    align: "center"
                }, {
                    title: '编辑时间',
                    key: 'modelCreateTime',
                    width: 100,
                    align: "center",
                    render: function (h, params) {
                        return ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.modelCreateTime);
                    }
                }, {
                    title: '操作',
                    key: 'integratedId',
                    width: 120,
                    align: "center",
                    render: function (h, params) {
                        //console.log(params);
                        //console.log(this);
                        return h('div',{class: "list-row-button-wrap"},[
                            ListPageUtility.IViewTableInnerButton.EditButton(h,params,_self.idFieldName,_self),
                            ListPageUtility.IViewTableInnerButton.DeleteButton(h,params,_self.idFieldName,_self)
                        ]);
                    }
                }
            ],
            tableData: [],
            tableDataOriginal:[],
            selectionRows: null,
            pageTotal: 0,
            pageSize: 500,
            pageNum: 1,
            searchText:""
        }
    },
    mounted:function(){
        //this.reloadData();
        //将对象附加到window上,提供给后边进行操作
        window._modulelistworkflowlistcomp=this;
        //alert(this.activeTabName);
        //alert(this.listHeight);
        if(PageStyleUtility.GetPageWidth()>1200){
            /*this.columnsConfig.splice(2,0,{
                title: '启动Key',
                key: 'modelReKey',
                align: "center",
                width: 180
            });*/
            ArrayUtility.Insert(this.columnsConfig,3,{
                title: '启动Key',
                key: 'modelReKey',
                align: "center",
                width: 180
            });
            ArrayUtility.Insert(this.columnsConfig,5, {
                title: '编辑人',
                key: 'modelCreator',
                align: "center",
                width: 100
            });
        }
    },
    watch: {
        moduleData:function (newVal) {
            this.reloadData();
        },
        activeTabName:function (newVal) {
            //alert(this.activeTabName);
            this.reloadData();
        },
        searchText:function (newVal) {
            //console.log(this.searchText);
            if(newVal) {
                var filterTableData = [];
                for (var i = 0; i < this.tableData.length; i++) {
                    var row = this.tableData[i];
                    if (row.formCode.indexOf(newVal) >= 0) {
                        filterTableData.push(row);
                    }
                    else if (row.formName.indexOf(newVal) >= 0) {
                        filterTableData.push(row);
                    }
                }
                this.tableData = filterTableData;
            }
            else{
                this.tableData = this.tableDataOriginal ;
            }
        }
    },
    methods:{
        getModuleName: function () {
            return this.moduleData == null ? "请选中模块" : this.moduleData.moduleText;
        },
        selectionChange: function (selection) {
            this.selectionRows = selection;
        },
        reloadData: function () {
            //debugger;
            if(this.moduleData!=null&&this.activeTabName=="list-flow") {
                this.searchCondition.modelModuleId.value = this.moduleData.moduleId;
                /*ListPageUtility.IViewTableLoadDataSearch(this.acInterface.reloadData, this.pageNum, this.pageSize, this.searchCondition, this, this.idFieldName, true, function (result,pageAppObj) {
                    pageAppObj.tableDataOriginal=result.data.list;
                },false);*/
                ListPageUtility.IViewTableBindDataBySearch({
                    url: this.acInterface.reloadData,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    searchCondition: this.searchCondition,
                    pageAppObj: this,
                    tableList: this,
                    idField: this.idFieldName,
                    autoSelectedOldRows: true,
                    successFunc: function (result,pageAppObj) {
                        pageAppObj.tableDataOriginal=result.data.list;
                    },
                    loadDict: false,
                    custParas: {}
                });
            }
        },
        add: function () {
            this.addNewFromTemplate("addNewFromEmptyTemplate");
        },
        addNewFromTemplate:function (name) {
            if (this.moduleData != null) {
                var url = BaseUtility.BuildView(this.acInterface.editView, {
                    "op": "add",
                    "moduleId": this.moduleData.moduleId,
                    "templateName": name
                });
                //alert(url);
                //DialogUtility.OpenNewWindow(window, DialogUtility.DialogId, url, {width: 0, height: 0}, 2);
                DialogUtility.OpenNewTabWindow(url);
            } else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
            }
        },
        edit: function (recordId,params) {
            //debugger;
            var url = BaseUtility.BuildView(this.acInterface.editView, {
                "op": "update",
                "modelReKey": params.row.modelReKey,
                "moduleId": this.moduleData.moduleId
            });
            //DialogUtility.OpenNewWindow(window, DialogUtility.DialogId, url, {width: 0, height: 0}, 2);
            DialogUtility.OpenNewTabWindow(url);
        },
        del: function (recordId) {
            ListPageUtility.IViewTableDeleteRow(this.acInterface.delete, recordId, this);
        },
        statusEnable: function (statusName) {
            ListPageUtility.IViewChangeServerStatusFace(this.acInterface.statusChange, this.selectionRows, appList.idFieldName, statusName, appList);
        },
        move: function (type) {
            ListPageUtility.IViewMoveFace(this.acInterface.move, this.selectionRows, this.idFieldName, type, this);
        },
        copyText:function (name) {
            DialogUtility.ToastInfoMessage(this, "未实现");
        }
    },
    template: `<div class="module-list-wrap">
                    <div id="list-button-wrap" class="list-button-outer-wrap">
                        <div class="module-list-name"><Icon type="ios-arrow-dropright-circle" />&nbsp;模块【{{getModuleName()}}】</div>
                        <div class="list-button-inner-wrap">
                            <ButtonGroup>
                                <i-button  type="success" @click="add()" icon="md-add">新增空白流程</i-button>
                                <i-button type="error" icon="md-albums" disabled>复制</i-button>
                                <i-button type="error" icon="md-bookmarks" disabled>历史版本</i-button>
                                <i-button type="error" icon="md-arrow-up" disabled></i-button>
                                <i-button type="error" icon="md-arrow-down" disabled></i-button>
                            </ButtonGroup>
                        </div>
                        <div class="list-button-inner-wrap">
                            <i-menu mode="horizontal" active-name="1-1" class="list-button-inner-menu" @on-select="addNewFromTemplate">
                                <submenu name="1-1">
                                    <template slot="title">从模板新建</template>
                                    <menu-group title="基于模板新建流程">
                                        <menu-item name="addNewFromEmptyTemplate">空白模板</menu-item>
                                        <menu-item name="addNewFromAgentUserTemplate">经办人模式模板</menu-item>
                                        <menu-item name="addNewFromSequenceTemplate">顺序流转模板</menu-item>
                                        <menu-item name="addNewFromTestV1Template">测试流程模板V1</menu-item>
                                    </menu-group>
                                </submenu>
                            </i-menu>
                        </div>
                        <div class="list-button-inner-wrap">
                            <i-menu mode="horizontal" active-name="1-1" class="list-button-inner-menu" @on-select="copyText">
                                <submenu name="1-1">
                                    <template slot="title">复制内容</template>
                                    <menu-group title="复制到黏贴版">
                                        <menu-item name="copyId">复制ID</menu-item>
                                        <menu-item name="copyPath">复制路径</menu-item>
                                        <menu-item name="copyInfo">复制信息</menu-item>
                                    </menu-group>
                                </submenu>
                            </i-menu>
                        </div>
                        <div style="clear: both"></div>
                    </div>
                    <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"
                             class="iv-list-table" :highlight-row="true"
                             @on-selection-change="selectionChange"></i-table>
                </div>`
});