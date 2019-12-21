<template>
    <div>
        <div ref="editDialogWrap" style="display: none">
            <div>
                <textarea id="txtContextVarJuelEdit" v-model="editData"></textarea>
            </div>
            <tabs name="flow-process-title-config-tabs">
                <tab-pane tab="flow-process-title-config-tabs" label="表" name="Tables">
                    <div>
                        <div style="margin: 8px">数据表：【<span style="color: red">{{tree.selectedTableName}}</span>】</div>
                        <i-table size="small" height="300" stripe border :columns="tableField.columnsConfig" :data="tableField.fieldData"
                                 class="iv-list-table" :highlight-row="true">
                            <template slot-scope="{ row, index }" slot="action">
                                <div class="wf-list-font-icon-button-class" @click="insertTableFieldToCodeMirror(row)">
                                    <Icon type="ios-checkmark-circle" />
                                </div>
                            </template>
                        </i-table>
                    </div>
                </tab-pane>
                <tab-pane tab="flow-process-title-config-tabs" label="环境变量" name="EnvVar">
                    <div>
                        <div style="width: 25%;float: left;height: 300px;overflow: auto">
                            <div class="inner-wrap">
                                <div style="margin-top: 8px">
                                    <ul id="envGroupZTreeUL" class="ztree"></ul>
                                </div>
                            </div>
                        </div>
                        <div style="width: 73%;float: right;" class="iv-list-page-wrap">
                            <i-table :height="320" stripe border :columns="envVarColumnsConfig" :data="envVarTableData"
                                     class="iv-list-table" :highlight-row="true">
                                <template slot-scope="{ row, index }" slot="action">
                                    <div class="wf-list-font-icon-button-class" @click="insertEnvVarToEditor(row)">
                                        <Icon type="ios-checkmark-circle" />
                                    </div>
                                </template>
                            </i-table>
                        </div>
                    </div>
                </tab-pane>
                <tab-pane tab="flow-process-title-config-tabs" label="流程变量" name="FlowVar">
                    <div style="margin-top: 8px">
                        <Button type="info">发起人</Button>
                        <Button type="info">环节名称</Button>
                        <Button type="info">动作名称</Button>
                        <Button type="info">.....</Button>
                    </div>
                </tab-pane>
            </tabs>
        </div>
    </div>
</template>

<script>
    import {RemoteUtility} from '../../../Remote/RemoteUtility';

    export default {
        name: "context-juel-edit-dialog",
        data(){
            return {
                tree:{
                    envGroupTreeObj:null,
                    envGroupTreeSelectedNode:null,
                    envGroupTreeSetting:{
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
                                _self.envGroupTreeNodeSelected(event,treeId,treeNode);
                            },
                            //成功的回调函数
                            onAsyncSuccess : function(event, treeId, treeNode, msg){
                                appList.treeObj.expandAll(true);
                            }
                        }
                    },
                    selectedTableName:"无"
                },
                tableField:{
                    fieldData:[],
                    columnsConfig: [
                        {
                            title: '字段名称',
                            key: 'fieldName',
                            align: "center"
                        }, {
                            title: '标题',
                            key: 'fieldCaption',
                            align: "center"
                        }, {
                            title: '选择',
                            slot: 'action',
                            width: 80,
                            align: 'center'
                        }
                    ]
                },
                sqlCodeMirrorTitle:null,
                envVarTableData:[],
                envVarColumnsConfig: [
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
                        slot: 'action',
                        key: 'envVarId',
                        width: 120,
                        align: "center"
                    }
                ],
                envVarSearchCondition:{
                    envVarGroupId:{
                        value:"",
                        type:SearchUtility.SearchFieldType.StringType
                    }
                },
                selectedCodeMirror:null,
                editData:"",
                callBackFunc:null
            }
        },
        mounted() {
            var _self=this;
            DialogUtility.DialogElemObj(this.$refs.editDialogWrap,{
                title:"",
                width:850,
                height:560,
                modal:true,
                buttons: {
                    "确认": function () {
                        if(typeof (_self.callBackFunc=="function")) {
                            _self.callBackFunc(_self.editData);
                        }
                        DialogUtility.CloseDialogElem(_self.$refs.editDialogWrap);
                    },
                    "清空": function () {
                        _self.editData="";
                        if(typeof (_self.callBackFunc=="function")) {
                            _self.callBackFunc(_self.editData);
                        }
                        DialogUtility.CloseDialogElem(_self.$refs.editDialogWrap);
                    },
                    "取消": function () {
                        DialogUtility.CloseDialogElem(_self.$refs.editDialogWrap);
                    }
                }
            });
            $(this.$refs.editDialogWrap).dialog("close");
            this.selectedCodeMirror = CodeMirror.fromTextArea($("#txtContextVarJuelEdit")[0], {
                mode: "text/x-sql",
                lineWrapping: true,
                foldGutter: true,
                theme: "monokai"
            });
            this.selectedCodeMirror.setSize("100%", 78);
            this.selectedCodeMirror.on("mousedown", (instance, e) => {
                this.selectedCodeMirror = instance;
            });
            this.selectedCodeMirror.on("change", (instance, e) => {
                //console.log(instance);
                //this.selectedCodeMirror=instance;
                this.editData = instance.getValue();
            });
        },
        methods: {
            insertCodeAtCursor(code) {
                //console.log(code);
                var doc = this.selectedCodeMirror.getDoc();
                var cursor = doc.getCursor();
                doc.replaceRange(code, cursor);
            },
            insertTableFieldToCodeMirror:function (fieldJson) {
                //console.log(fieldJson);
                this.insertCodeAtCursor('${'+fieldJson.tableName+"."+fieldJson.fieldName+'}');
            },
            insertEnvVarToEditor:function(evnJson) {
                //console.log(evnJson);
                this.insertCodeAtCursor('${EnvVar.' + evnJson.envVarText + '}');
            },
            envGroupTreeNodeSelected(event, treeId, treeNode) {
                // 根节点不触发任何事件1
                RemoteUtility.GetEnvVariablePOListByGroupId(treeNode.envGroupId).then((envVariablePOList) => {
                    this.envVarTableData = envVariablePOList;
                });

            },
            beginEditContextJuel(dialogTitle,oldData,formId,callBackFunc) {
                //console.log("...........1...");

                $(this.$refs.editDialogWrap).dialog("open");
                $(this.$refs.editDialogWrap).dialog("option", "title", dialogTitle );
                this.editData=oldData;
                this.selectedCodeMirror.setValue(this.editData);
                this.callBackFunc=callBackFunc;
                //this.selectedCodeMirror = this.flowProcessTitleCodeMirror;

                RemoteUtility.GetEnvGroupPOList().then((envGroupPOList) => {
                    this.tree.envGroupTreeObj = $.fn.zTree.init($("#envGroupZTreeUL"), this.tree.envGroupTreeSetting, envGroupPOList);
                    this.tree.envGroupTreeObj.expandAll(true);
                    this.tree.envGroupTreeObj._host = this;
                });

                RemoteUtility.GetFormResourceBindMainTable(formId).then((mainTablePO) => {
                    //console.log(formResourcePOList);
                    if(mainTablePO) {
                        this.tableField.fieldData = mainTablePO.tableFieldPOList;
                    }
                    else{
                        this.tableField.fieldData=[];
                    }
                });
            },
            endEditContextJuel() {

            }
        }
    }
</script>

<style scoped>

</style>