<template>
    <div ref="selectRoleDialogWrap" style="display: none">
        <div style="width: 100%;float: left;height: 40px"  name="ExConfig">
            <div style="float: right">
                <radio-group type="button" style="margin: auto" v-model="roleFilterConfig">
                    <radio label="全局">全局</radio>
                    <radio label="本组织下角色">本组织下角色</radio>
                </radio-group>
            </div>
        </div>
        <div v-bind:style="{ 'width': '30%', 'float': 'left','height':selectWrapHeight+'px','border':' #a9b7d1 1px solid','border-radius':'4px','margin-right': '10px'}">
            <div class="inner-wrap">
                <div>
                    <ul id="select-role-dialog-roleGroupZTreeUL" ref="roleGroupZTreeUL" class="ztree"></ul>
                </div>
            </div>
        </div>
        <div style="width: 40%;float: left;height: 412px" class="iv-list-page-wrap select-dialog-single-select-table">
            <i-table :height="412" stripe border :columns="roleColumnsConfig" :data="roleTableData"
                     :highlight-row="true" @on-row-click="selectedRole">
            </i-table>
        </div>
        <div style="width: 27%;float: right;height: 412px;border: #e8eaec 1px solid;border-radius: 4px;">
            <div style="border-bottom: #e8eaec 1px solid;background-color: #f8f8f9;height: 36px;line-height: 36px;padding-left: 10px;border-radius: 4px 4px 0px 0px">选定角色</div>
            <div style="margin-left: 10px;margin-top: 8px">
                <tag type="border" color="success" :closable="true" v-for="item in selectedRoleArray" :key="item.roleId" :name="item.roleId" @on-close="deleteSelectedRole">{{item.roleName}}</tag>
            </div>
        </div>
    </div>
</template>

<script>
    import {RemoteUtility} from "../../../Remote/RemoteUtility";

    export default {
        name: "select-role-dialog",
        data(){
            return {
                selectWrapHeight:412,
                roleFilterConfig:"全局",
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
                        title: '角色名称',
                        key: 'roleName',
                        align: "center"
                    }
                ],
                callBackFunc:null,
                selectedRoleArray:[]
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
                        if(typeof (_self.callBackFunc=="function")) {
                            var result=JsonUtility.CloneArraySimple(_self.selectedRoleArray);
                            _self.callBackFunc(result,_self.roleFilterConfig);
                        }
                        DialogUtility.CloseDialogElem(_self.$refs.selectRoleDialogWrap);
                    },
                    "清空": function () {
                        if(typeof (_self.callBackFunc=="function")) {
                            _self.callBackFunc([]);
                        }
                        DialogUtility.CloseDialogElem(_self.$refs.selectRoleDialogWrap);
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
                this.selectedRoleArray=[];
                $(this.$refs.selectRoleDialogWrap).dialog("open");
                $(this.$refs.selectRoleDialogWrap).dialog("option", "title", dialogTitle );
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
                    //console.log(roleTableData);
                    this.roleTableData = roleTableData;
                });
            },
            selectedRole(row) {
                //this.selectType="EnvVar";
                var rolePath = TreeUtility.BuildNodePathName(this.tree.roleGroupTreeSelectedNode, "roleGroupName", row.roleName, 1);
                var roleId = row.roleId;
                ArrayUtility.PushWhenNotExist(this.selectedRoleArray, {
                    roleId: roleId,
                    rolePath: rolePath,
                    roleName: row.roleName
                }, function (item) {
                    return item.roleId == roleId
                });
            },
            deleteSelectedRole(event, name){
                console.log(name);
                for (let i = 0; i < this.selectedRoleArray.length; i++) {
                    if(this.selectedRoleArray[i].roleId==name){
                        ArrayUtility.Delete(this.selectedRoleArray,i);
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>