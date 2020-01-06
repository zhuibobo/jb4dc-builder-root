/*html编辑器中的元素辅助列表*/
Vue.component("module-list-workflow-comp", {
    props:['listHeight','moduleData','activeTabName'],
    data: function () {
        var _self=this;

        return {
            acInterface:{
                editView: "/HTML/WorkFlow/Modeler/Index.html",
                reloadData: "/Rest/Builder/FlowIntegrated/GetListData",
                delete: "/Rest/Builder/FlowIntegrated/Delete",
                move: "/Rest/Builder/FlowIntegrated/Move",
            },
            idFieldName: "integratedId",
            searchCondition: {
                integratedModuleId: {
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
                    key: 'integratedCode',
                    align: "center",
                    width: 80
                },
                {
                    title: '列表名称',
                    key: 'integratedName',
                    align: "center"
                }, {
                    title: '启动Key',
                    key: 'integratedStartKey',
                    align: "center"
                }, {
                    title: '备注',
                    key: 'integratedDesc',
                    align: "center"
                }, {
                    title: '编辑时间',
                    key: 'integratedUpdateTime',
                    width: 100,
                    align: "center",
                    render: function (h, params) {
                        return ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.integratedUpdateTime);
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
        window._modulelistweblistcomp=this;
        //alert(this.activeTabName);
        //alert(this.listHeight);
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
            if(this.moduleData!=null&&this.activeTabName=="list-weblist") {
                this.searchCondition.integratedModuleId.value = this.moduleData.moduleId;
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
            if(this.moduleData!=null) {
                var url = BaseUtility.BuildView(this.acInterface.editView, {
                    "op": "add",
                    "moduleId": this.moduleData.moduleId
                });
                //alert(url);
                DialogUtility.OpenNewWindow(window, DialogUtility.DialogId, url, {width: 0, height: 0}, 2);
            }
            else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
            }
        },
        edit: function (recordId) {
            //debugger;
            var url = BaseUtility.BuildView(this.acInterface.editView, {
                "op": "update",
                "recordId": recordId
            });
            DialogUtility.OpenNewWindow(window, DialogUtility.DialogId, url, {width: 0, height: 0}, 2);
        },
        del: function (recordId) {
            ListPageUtility.IViewTableDeleteRow(this.acInterface.delete, recordId, this);
        },
        statusEnable: function (statusName) {
            ListPageUtility.IViewChangeServerStatusFace(this.acInterface.statusChange, this.selectionRows, appList.idFieldName, statusName, appList);
        },
        move: function (type) {
            ListPageUtility.IViewMoveFace(this.acInterface.move, this.selectionRows, this.idFieldName, type, this);
        }
    },
    template: '<div class="module-list-wrap">\
                    <div id="list-button-wrap" class="list-button-outer-wrap">\
                        <div class="module-list-name"><Icon type="ios-arrow-dropright-circle" />&nbsp;模块【{{getModuleName()}}】</div>\
                        <div class="list-button-inner-wrap">\
                            <ButtonGroup>\
                                <i-button  type="success" @click="add()" icon="md-add">新增</i-button>\
                            </ButtonGroup>\
                        </div>\
                         <div style="float: right;width: 200px;margin-right: 10px;">\
                            <i-input search class="input_border_bottom" v-model="searchText">\
                            </i-input>\
                        </div>\
                        <div style="clear: both"></div>\
                    </div>\
                    <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"\
                             class="iv-list-table" :highlight-row="true"\
                             @on-selection-change="selectionChange"></i-table>\
                </div>'
});