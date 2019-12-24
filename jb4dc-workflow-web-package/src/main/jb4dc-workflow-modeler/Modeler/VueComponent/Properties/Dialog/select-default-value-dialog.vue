<template>
    <div ref="selectDefaultValueDialogWrap" style="display: none">
        <tabs :value="selectType" v-model="selectType">
            <tab-pane label="常量" name="Const" >
                <i-form :label-width="80" style="width: 80%;margin: 50px auto auto;">
                    <form-item label="常量：">
                        <i-input v-model="constValue"></i-input>
                    </form-item>
                </i-form>
            </tab-pane>
            <tab-pane label="环境变量" name="EnvVar">
                <div style="height: 45px;border-bottom: dotted 1px #8a8a8a;margin-bottom: 10px;margin-top: 10px">
                    <div style="float: right;padding: 8px;border-radius: 8px;color:orangered;border: solid 1px #adbed8;">已经选择：{{selectText}}</div>
                </div>
                <div>
                    <div style="width: 30%;float: left;height: 350px">
                        <div class="inner-wrap">
                            <div>
                                <ul ref="envGroupZTreeUL" class="ztree"></ul>
                            </div>
                        </div>
                    </div>
                    <div style="width: 68%;float: left;height: 350px" class="iv-list-page-wrap">
                        <i-table :height="340" stripe border :columns="envVarColumnsConfig" :data="envVarTableData"
                                 class="iv-list-table" :highlight-row="true">
                            <template slot-scope="{ row, index }" slot="action">
                                <div class="wf-list-font-icon-button-class" @click="selectedEnvVar(row)">
                                    <Icon type="ios-checkmark-circle" />
                                </div>
                            </template>
                        </i-table>
                    </div>
                </div>
            </tab-pane>
        </tabs>
    </div>
</template>

<script>
    import {RemoteUtility} from '../../../Remote/RemoteUtility';

    export default {
        name: "select-default-value-dialog.vue",
        data(){
            return {
                selectType:"Const",
                selectValue:"",
                selectText:"",
                constValue:"",
                tree:{
                    treeIdFieldName:"envGroupId",
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
                callBackFunc:null
            }
        },
        mounted() {
            var _self=this;
            DialogUtility.DialogElemObj(this.$refs.selectDefaultValueDialogWrap,{
                title:"",
                width:850,
                height:560,
                modal:true,
                buttons: {
                    "确认": function () {
                        var result={};
                        if(_self.selectType=="Const"){
                            if(_self.constValue==""){
                                DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请设置常量默认值！",null);
                                return;
                            }

                            result.Type="Const";
                            result.Value=_self.constValue;
                            result.Text=_self.constValue;
                        }
                        else {
                            result.Type = "EnvVar";
                            result.Value = _self.selectValue;
                            result.Text = _self.selectText;
                        };
                        if(typeof (_self.callBackFunc=="function")) {
                            _self.callBackFunc(result);
                        }
                        DialogUtility.CloseDialogElem(_self.$refs.selectDefaultValueDialogWrap);
                    },
                    "清空": function () {
                        _self.editData="";
                        if(typeof (_self.callBackFunc=="function")) {
                            _self.callBackFunc(_self.editData);
                        }
                        DialogUtility.CloseDialogElem(_self.$refs.selectDefaultValueDialogWrap);
                    },
                    "取消": function () {
                        DialogUtility.CloseDialogElem(_self.$refs.selectDefaultValueDialogWrap);
                    }
                }
            });
            $(this.$refs.selectDefaultValueDialogWrap).dialog("close");
        },
        methods:{
            beginSelectDefaultValue(dialogTitle,oldData,callBackFunc) {
                //console.log("...........1...");
                //console.log(formId);
                $(this.$refs.selectDefaultValueDialogWrap).dialog("open");
                $(this.$refs.selectDefaultValueDialogWrap).dialog("option", "title", dialogTitle );
                this.editData=oldData;
                this.callBackFunc=callBackFunc;

                RemoteUtility.GetEnvGroupPOList().then((envGroupPOList) => {
                    this.tree.envGroupTreeObj = $.fn.zTree.init($(this.$refs.envGroupZTreeUL), this.tree.envGroupTreeSetting, envGroupPOList);
                    this.tree.envGroupTreeObj.expandAll(true);
                    this.tree.envGroupTreeObj._host = this;
                });
            },
            envGroupTreeNodeSelected(event, treeId, treeNode) {
                // 根节点不触发任何事件1
                RemoteUtility.GetEnvVariablePOListByGroupId(treeNode.envGroupId).then((envVariablePOList) => {
                    this.envVarTableData = envVariablePOList;
                });
            },
            selectedEnvVar:function (row) {
                this.selectType="EnvVar";
                this.selectValue=row.envVarValue;
                this.selectText=row.envVarText;
            }
        }
    }
</script>

<style scoped>

</style>