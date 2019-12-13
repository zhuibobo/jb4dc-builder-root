<template>
        <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
            <colgroup>
                <col style="width: 9%" />
                <col style="width: 41%" />
                <col style="width: 9%" />
                <col style="width: 41%" />
            </colgroup>
            <tbody>
                <tr>
                    <td>流程类别：</td>
                    <td>
                        <Select v-model="propPanelBindData.jb4dcFlowCategory" style="width:200px">
                            <Option value="通用流程">通用流程</Option>
                        </Select>
                    </td>
                    <td>流程编号：</td>
                    <td>
                        <input type="text" v-model="propPanelBindData.jb4dcCode" />
                    </td>
                </tr>
                <tr>
                    <td>绑定表单：</td>
                    <td colspan="3">
                        <Select v-model="propPanelBindData.jb4dcFormId" style="width:600px" @on-change="changeBindForm">
                            <Option v-for="item in formResourcePOList" :value="item.formId" :key="item.formId">{{ item.formName }}【{{ item.formCode }}】</Option>
                        </Select>
                        <Button type="primary" disabled>编辑表单</Button>
                    </td>
                </tr>
                <tr>
                    <td>流程标题：</td>
                    <td colspan="3">
                        <textarea id="txtFlowProcessTitle"></textarea>
                    </td>
                </tr>
                <tr>
                    <td>流程备注：</td>
                    <td colspan="3">
                        <textarea id="txtFlowProcessRemark"></textarea>
                    </td>
                </tr>
                <tr>
                    <td colspan="4" style="padding-top: 0px">
                        <div style="width: 930px">
                            <tabs name="flow-process-title-config-tabs">
                                <tab-pane tab="flow-process-title-config-tabs" label="表" name="Tables">
                                    <div>
                                        <div style="margin: 8px">数据表：【<span style="color: red">{{tree.selectedTableName}}</span>】</div>
                                        <i-table size="small" height="174" stripe border :columns="tableField.columnsConfig" :data="tableField.fieldData"
                                                 class="iv-list-table" :highlight-row="true">
                                            <template slot-scope="{ row, index }" slot="action">
                                                <div class="jb4dc-general-properties-icon-class1" @click="insertTableFieldToCodeMirror(row)">
                                                    <Icon type="ios-checkmark-circle" />
                                                </div>
                                            </template>
                                        </i-table>
                                    </div>
                                </tab-pane>
                                <tab-pane tab="flow-process-title-config-tabs" label="环境变量" name="EnvVar">
                                    <div>
                                        <div style="width: 25%;float: left;height: 190px;overflow: auto">
                                            <div class="inner-wrap">
                                                <div style="margin-top: 8px">
                                                    <ul id="envGroupZTreeUL" class="ztree"></ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="width: 73%;float: right;" class="iv-list-page-wrap">
                                            <i-table :height="184" stripe border :columns="envVarColumnsConfig" :data="envVarTableData"
                                                     class="iv-list-table" :highlight-row="true">
                                                <template slot-scope="{ row, index }" slot="action">
                                                    <div class="jb4dc-general-properties-icon-class1" @click="insertEnvVarToEditor(row)">
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
                    </td>
                </tr>
            </tbody>
        </table>

</template>

<script>

    import {RemoteUtility} from '../../../Remote/RemoteUtility';

    export default {
        name: "jb4dc-general-properties",
        data(){
            return {
                propPanelBindData:{
                    jb4dcFlowCategory:"通用流程",
                    jb4dcCode:"",
                    jb4dcFormId:""
                },
                formResourcePOList:null,
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
                flowProcessTitleCodeMirror:null,
                flowProcessRemarkCodeMirror:null,
                selectedCodeMirror:null
            }
        },
        mounted() {
            /*RemoteUtility.GetModuleById("").then(function (result) {
                console.log(result);
            })*/
            this.flowProcessTitleCodeMirror = CodeMirror.fromTextArea($("#txtFlowProcessTitle")[0], {
                mode: "text/x-sql",
                lineWrapping: true,
                foldGutter: true,
                theme: "monokai"
            });
            this.flowProcessTitleCodeMirror.setSize("100%", 26);
            this.flowProcessTitleCodeMirror.on("mousedown", (instance, e) => {
                //console.log(instance);
                this.selectedCodeMirror=instance;
            });
            this.selectedCodeMirror = this.flowProcessTitleCodeMirror;

            this.flowProcessRemarkCodeMirror = CodeMirror.fromTextArea($("#txtFlowProcessRemark")[0], {
                mode: "text/x-sql",
                lineWrapping: true,
                foldGutter: true,
                theme: "monokai"
            });
            this.flowProcessRemarkCodeMirror.setSize("100%", 52);
            this.flowProcessRemarkCodeMirror.on("mousedown", (instance, e) => {
                //console.log(instance);
                this.selectedCodeMirror=instance;
            });

            RemoteUtility.GetFormResourcePOList().then((formResourcePOList) => {
                //console.log(formResourcePOList);
                this.formResourcePOList=formResourcePOList;
            });
            RemoteUtility.GetEnvGroupPOList().then((envGroupPOList) => {
                this.tree.envGroupTreeObj=$.fn.zTree.init($("#envGroupZTreeUL"), this.tree.envGroupTreeSetting,envGroupPOList);
                this.tree.envGroupTreeObj.expandAll(true);
                this.tree.envGroupTreeObj._host=this;
            });
        },
        methods:{
            insertCodeAtCursor:function(code){
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
            changeBindForm(formId){
                //console.log(formId);
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
            envGroupTreeNodeSelected (event, treeId, treeNode) {
                // 根节点不触发任何事件1
                RemoteUtility.GetEnvVariablePOListByGroupId(treeNode.envGroupId).then( (envVariablePOList) => {
                    this.envVarTableData=envVariablePOList;
                });

            }
        }
    }
</script>

<style scoped>
    .jb4dc-general-properties-icon-class1{
        font-size: 20px;
        cursor: pointer;
    }
    .jb4dc-general-properties-icon-class1:hover{
        color: #348fcd;
    }
</style>