<template>
    <div ref="selectRoleDialogWrap" style="display: none">
        <div style="width: 30%;float: left;height: 350px">
            <div class="inner-wrap">
                <div>
                    <ul ref="roleGroupZTreeUL" class="ztree"></ul>
                </div>
            </div>
        </div>
        <div style="width: 68%;float: left;height: 350px" class="iv-list-page-wrap">
            <i-table :height="340" stripe border :columns="roleColumnsConfig" :data="roleTableData"
                     class="iv-list-table" :highlight-row="true">
                <template slot-scope="{ row, index }" slot="action">
                    <div class="wf-list-font-icon-button-class" @click="selectedRole(row)">
                        <Icon type="ios-checkmark-circle" />
                    </div>
                </template>
            </i-table>
        </div>
    </div>
</template>

<script>
    import {RemoteUtility} from "../../../Remote/RemoteUtility";

    export default {
        name: "select-role-dialog",
        data(){
            return {
                tree:{
                    roleGroupTreeObj:null,
                    treeIdFieldName:"roleGroupId",
                    roleGroupTreeSelectedNode:null,
                    roleGroupTreeSetting:{
                        async : {
                            enable : true,
                            // Ajax 获取数据的 URL 地址
                            url :""
                        },
                        // 必须使用data
                        data:{
                            key:{
                                name:"roleGroupName"
                            },
                            simpleData : {
                                enable : true,
                                idKey : "roleGroupId", // id编号命名
                                pIdKey : "roleGroupParentId",  // 父id编号命名
                                rootId : 0
                            }
                        },
                        // 回调函数
                        callback : {
                            onClick : function(event, treeId, treeNode) {
                                var _self=this.getZTreeObj(treeId)._host;
                                _self.roleGroupTreeNodeSelected(event,treeId,treeNode);
                            },
                            //成功的回调函数
                            onAsyncSuccess : function(event, treeId, treeNode, msg){
                                appList.treeObj.expandAll(true);
                            }
                        }
                    },
                    selectedTableName:"无"
                },
                roleTableData:[],
                roleColumnsConfig: [
                    {
                        title: '角色ID',
                        key: 'roleId',
                        align: "center"
                    }, {
                        title: '角色名称',
                        key: 'roleName',
                        align: "center"
                    }, {
                        title: '操作',
                        slot: 'action',
                        key: 'roleId',
                        width: 120,
                        align: "center"
                    }
                ],
                callBackFunc:null
            }
        },
        mounted() {
            var _self=this;
            DialogUtility.DialogElemObj(this.$refs.selectRoleDialogWrap,{
                title:"",
                width:850,
                height:560,
                modal:true,
                buttons: {
                    "确认": function () {
                        var result={};
                        result.Value = _self.selectValue;
                        result.Text = _self.selectText;
                        if(typeof (_self.callBackFunc=="function")) {
                            _self.callBackFunc(result);
                        }
                        DialogUtility.CloseDialogElem(_self.$refs.selectRoleDialogWrap);
                    },
                    "清空": function () {
                        _self.editData="";
                        if(typeof (_self.callBackFunc=="function")) {
                            _self.callBackFunc(_self.editData);
                        }
                        DialogUtility.CloseDialogElem(_self.$refs.selectDefaultValueDialogWrap);
                    },
                    "取消": function () {
                        DialogUtility.CloseDialogElem(_self.$refs.selectRoleDialogWrap);
                    }
                }
            });
            $(this.$refs.selectRoleDialogWrap).dialog("close");
        },
        methods:{
            beginSelectRole(dialogTitle,oldData,callBackFunc) {
                //console.log("...........1...");
                //console.log(formId);
                $(this.$refs.selectRoleDialogWrap).dialog("open");
                $(this.$refs.selectRoleDialogWrap).dialog("option", "title", dialogTitle );
                //this.selectValue="";
                this.callBackFunc=callBackFunc;

                RemoteUtility.GetRoleGroupPOList().then((roleGroupPOList) => {
                    this.tree.roleGroupTreeObj = $.fn.zTree.init($(this.$refs.roleGroupZTreeUL), this.tree.roleGroupTreeSetting, roleGroupPOList);
                    this.tree.roleGroupTreeObj.expandAll(true);
                    this.tree.roleGroupTreeObj._host = this;
                });

            },
            roleGroupTreeNodeSelected(event, treeId, treeNode) {
                this.tree.roleGroupTreeSelectedNode=treeNode;
                // 根节点不触发任何事件1
                RemoteUtility.GetRolePOListByGroupId(treeNode.roleGroupId).then((roleTableData) => {
                    console.log(roleTableData);
                    this.roleTableData = roleTableData;
                });
            },
            selectedRole:function (row) {
                //this.selectType="EnvVar";
                var selectText=TreeUtility.BuildNodePathName(this.tree.roleGroupTreeSelectedNode,"roleGroupName",row.roleName);
                this.selectValue=row.roleId;
                this.selectText=selectText;
            }
        }
    }
</script>

<style scoped>

</style>