/*
**Created by IntelliJ IDEA.
**User: zhuangrb
**Date: 2018/8/26
**To change this template use File | Settings | File Templates.
*/
Vue.component("select-default-value-dialog", {
    data:function () {
        var _self=this;

        return {
            acInterface:{
                getGroupTreeData:"/Rest/Builder/EnvVariableGroup/GetTreeData",
                reloadListData:"/Rest/Builder/EnvVariable/GetListData"
            },
            selectType:"Const",
            selectValue:"",
            selectText:"",
            listHeight: 470,
            tree:{
                treeIdFieldName:"envGroupId",
                treeObj:null,
                treeSelectedNode:null,
                treeSetting:{
                    async : {
                        enable : true,
                        // Ajax 获取数据的 URL 地址
                        url :""
                    },
                    // 必须使用data
                    data:{
                        key:{
                            name:"envGroupText"
                        },
                        simpleData : {
                            enable : true,
                            idKey : "envGroupId", // id编号命名
                            pIdKey : "envGroupParentId",  // 父id编号命名
                            rootId : 0
                        }
                    },
                    // 回调函数
                    callback : {
                        onClick : function(event, treeId, treeNode) {
                            var _self=this.getZTreeObj(treeId)._host;
                            _self.treeNodeSelected(event,treeId,treeNode);
                        },
                        //成功的回调函数
                        onAsyncSuccess : function(event, treeId, treeNode, msg){
                            appList.treeObj.expandAll(true);
                        }
                    }
                },
            },
            tableData:[],
            columnsConfig: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '变量名称',
                    key: 'envVarText',
                    align: "center"
                }, {
                    title: '变量值',
                    key: 'envVarValue',
                    align: "center"
                }, {
                    title: '操作',
                    key: 'envVarId',
                    width: 120,
                    align: "center",
                    render: function (h, params) {
                        return h('div',{class: "list-row-button-wrap"},[
                            ListPageUtility.IViewTableInnerButton.ViewButton(h,params,appList.idFieldName,appList),
                            ListPageUtility.IViewTableInnerButton.EditButton(h,params,appList.idFieldName,appList),
                            ListPageUtility.IViewTableInnerButton.DeleteButton(h,params,appList.idFieldName,appList)
                        ]);
                    }
                }
            ],
            searchCondition:{
                envVarGroupId:{
                    value:"",
                    type:SearchUtility.SearchFieldType.StringType
                }
            },
            pageTotal: 0,
            pageSize: 100,
            pageNum: 1
        }
    },
    mounted:function (){
        this.loadData();
    },
    methods:{
        beginSelect:function(oldData){
            var elem=this.$refs.selectDefaultValueDialogWrap;
            //debugger;
            //this.getTableDataInitTree();

            var height=450;
            /*if(PageStyleUtility.GetPageHeight()>550){
                height=600;
            }*/

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                height: 680,
                width: 980,
                title: "设置默认值"
            });

            $(window.document).find(".ui-widget-overlay").css("zIndex",10100);
            $(window.document).find(".ui-dialog").css("zIndex",10101);

            if(oldData==null){
                this.selectType="Const";
                this.selectValue="";
                this.selectText="";
            }
        },
        loadData:function(){
            //var _self=this;
            AjaxUtility.Post(this.acInterface.getGroupTreeData, {}, function (result) {
                console.log(result);
                if(result.success){
                    if(result.data!=null&&result.data.length>0){
                        for(var i=0;i<result.data.length;i++) {
                            /*if(result.data[i].envGroupChildCount==0) {
                                result.data[i].icon = "../../../Themes/Png16X16/app-view-columns.png";
                            }*/
                        }
                    }
                    this.tree.treeObj=$.fn.zTree.init($("#zTreeUL"), this.tree.treeSetting,result.data);
                    this.tree.treeObj.expandAll(true);
                    this.tree.treeObj._host=this;
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                }
            }, this);
        },
        getSelectInstanceName:function () {
            return BaseUtility.GetUrlParaValue("instanceName");
        },
        selectComplete:function () {
            var result={};
            if(this.selectType=="Const"){
                if(this.selectValue==""){
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请设置常量默认值！",null);
                    return;
                }

                result.Type="Const";
                result.Value=this.selectValue;
                result.Text=this.selectValue;
            }
            else if(this.selectType=="DateTime"){
                var selectNodes=this.tree.datetimeTreeObj.getSelectedNodes();
                if(selectNodes.length==0){
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择一种时间类型！",null);
                    return;
                }
                else {
                    result.Type = "DateTime";
                    result.Value = selectNodes[0].value;
                    result.Text = selectNodes[0].text;
                }
            }
            else if(this.selectType=="ApiVar"){
                //result.Type = "ApiVar";
                var selectNodes=this.tree.envVarTreeObj.getSelectedNodes();
                if(selectNodes.length==0){
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择一种API类型！",null);
                    return;
                }
                else {
                    if(selectNodes[0].group==true){
                        DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"不能选择分组！",null);
                        return
                    }
                    else {
                        result.Type = "ApiVar";
                        result.Value = selectNodes[0].value;
                        result.Text = selectNodes[0].text;
                    }
                }
            }
            else if(this.selectType=="NumberCode"){
                result.Type = "NumberCode";
            }

            this.$emit('on-selected-default-value', result);
            //window.OpenerWindowObj[this.getSelectInstanceName()].setSelectEnvVariableResultValue(result);
            this.handleClose();
        },
        clearComplete:function(){
            //window.OpenerWindowObj[this.getSelectInstanceName()].setSelectEnvVariableResultValue(null);
            this.$emit('on-selected-default-value', null);
            this.handleClose();
        },
        handleClose: function () {
            //DialogUtility.CloseOpenIframeWindow(window,DialogUtility.DialogId);
            /*if(window.IsOpenForFrame){
                DialogUtility.Frame_CloseDialog(window)
            }
            else {
                DialogUtility.CloseOpenIframeWindow(window, DialogUtility.DialogId);
            }*/
            DialogUtility.CloseDialogElem(this.$refs.selectDefaultValueDialogWrap);
        },
        selectionChange:function () {

        },
        clearSearchCondition:function () {
            for(var key in this.searchCondition){
                this.searchCondition[key].value="";
            }
        },
        treeNodeSelected:function (event, treeId, treeNode) {
            // 根节点不触发任何事件1
            //if(treeNode.level != 0) {
            this.pageNum=1;
            this.clearSearchCondition();
            this.searchCondition.envVarGroupId.value=treeNode[this.tree.treeIdFieldName];
            this.reloadData();
            //appList.reloadTreeTableData();
            //}
        },
        reloadData: function () {
            //ListPageUtility.IViewTableLoadDataSearch(this.acInterface.reloadListData,this.pageNum,this.pageSize,this.searchCondition,this,this.idFieldName,true,null,false);
            //this.selectionRows=null;
            ListPageUtility.IViewTableBindDataBySearch({
                url: this.acInterface.reloadListData,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                searchCondition: this.searchCondition,
                pageAppObj: this,
                tableList: this,
                idField: this.idFieldName,
                autoSelectedOldRows: true,
                successFunc: null,
                loadDict: false,
                custParas: {}
            });
        }
    },
    template: `<div  ref="selectDefaultValueDialogWrap" class="general-edit-page-wrap" style="display: none;margin-top: 0px">
                    <tabs :value="selectType" v-model="selectType">
                        <tab-pane label="常量" name="Const" >
                            <i-form :label-width="80" style="width: 80%;margin: 50px auto auto;">
                                <form-item label="常量：">
                                    <i-input v-model="selectValue"></i-input>
                                </form-item>
                            </i-form>
                        </tab-pane>
                        <tab-pane label="环境变量" name="EnvVar">
                            <div style="height: 45px;border-bottom: dotted 1px #8a8a8a;margin-bottom: 10px;">
                                <div style="float: right;padding: 8px;border-radius: 8px;color:orangered;border: solid 1px #adbed8;">已经选择：</div>
                            </div>
                            <div>
                                <div style="width: 30%;float: left;height: 514px">
                                    <div class="inner-wrap">
                                        <div>
                                            <ul id="zTreeUL" class="ztree"></ul>
                                        </div>
                                    </div>
                                </div>
                                <div style="width: 68%;float: left;height: 514px">
                                    <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"
                                             class="iv-list-table" :highlight-row="true"
                                             @on-selection-change="selectionChange"></i-table>
                                </div>
                            </div>
                        </tab-pane>
                    </tabs>
                    <div class="button-outer-wrap">
                        <div class="button-inner-wrap">
                            <button-group>
                                <i-button type="primary" @click="selectComplete()"> 确 认 </i-button>
                                <i-button type="primary" @click="clearComplete()"> 清 空 </i-button>
                                <i-button @click="handleClose()">关 闭</i-button>
                            </button-group>
                        </div>
                    </div>
                </div>`
});
