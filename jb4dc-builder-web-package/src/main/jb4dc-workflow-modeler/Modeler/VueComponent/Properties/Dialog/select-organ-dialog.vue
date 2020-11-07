<template>
    <div ref="selectOrganDialogWrap" style="display: none">
        <div style="width: 50%;float: left;height: 452px;border: #a9b7d1 1px solid;border-radius: 4px;margin-right: 10px">
            <div class="inner-wrap">
                <div>
                    <ul id="select-organ-dialog-organZTreeUL" ref="organZTreeUL" class="ztree"></ul>
                </div>
            </div>
        </div>
        <div style="width: 48%;float: right;height: 452px;border: #e8eaec 1px solid;border-radius: 4px;">
            <div style="border-bottom: #e8eaec 1px solid;background-color: #f8f8f9;height: 36px;line-height: 36px;padding-left: 10px;border-radius: 4px 4px 0px 0px">选定机构</div>
            <div style="margin-left: 10px;margin-top: 8px">
                <tag type="border" color="success" :closable="true" v-for="item in selectedOrganArray" :key="item.organId" :name="item.organId" @on-close="deleteSelectedOrgan">{{item.organName}}</tag>
            </div>
        </div>
    </div>
</template>

<script>
    import {RemoteUtility} from "../../../Remote/RemoteUtility";
    export default {
        name: "select-organ-dialog",
        data(){
            return {
                tree:{
                    organTreeObj:null,
                    treeIdFieldName:"organId",
                    organTreeSelectedNode:null,
                    organTreeSetting:{
                        async : {
                            enable : true,
                            // Ajax 获取数据的 URL 地址
                            url :""
                        },
                        // 必须使用data
                        data:{
                            key:{
                                name:"organName"
                            },
                            simpleData : {
                                enable : true,
                                idKey : "organId", // id编号命名
                                pIdKey : "organParentId",  // 父id编号命名
                                rootId : 0
                            }
                        },
                        // 回调函数
                        callback : {
                            onClick : function(event, treeId, treeNode) {
                                var _self=this.getZTreeObj(treeId)._host;
                                _self.organTreeNodeSelected(event,treeId,treeNode);
                            },
                            //成功的回调函数
                            onAsyncSuccess : function(event, treeId, treeNode, msg){
                                appList.treeObj.expandAll(true);
                            }
                        }
                    },
                    selectedTableName:"无"
                },
                callBackFunc:null,
                selectedOrganArray:[]
            }
        },
        mounted() {
            var _self=this;
            DialogUtility.DialogElemObj(this.$refs.selectOrganDialogWrap,{
                title:"",
                width:550,
                height:560,
                modal:true,
                buttons: {
                    "确认": function () {
                        if(typeof (_self.callBackFunc=="function")) {
                            var result=JsonUtility.CloneArraySimple(_self.selectedOrganArray);
                            _self.callBackFunc(result);
                        }
                        DialogUtility.CloseDialogElem(_self.$refs.selectOrganDialogWrap);
                    },
                    "清空": function () {
                        if(typeof (_self.callBackFunc=="function")) {
                            _self.callBackFunc([]);
                        }
                        DialogUtility.CloseDialogElem(_self.$refs.selectOrganDialogWrap);
                    },
                    "取消": function () {
                        DialogUtility.CloseDialogElem(_self.$refs.selectOrganDialogWrap);
                    }
                }
            });
            $(this.$refs.selectOrganDialogWrap).dialog("close");
        },
        methods:{
            beginSelectOrgan(dialogTitle,oldData,callBackFunc) {
                this.selectedOrganArray=[];
                $(this.$refs.selectOrganDialogWrap).dialog("open");
                $(this.$refs.selectOrganDialogWrap).dialog("option", "title", dialogTitle );
                this.callBackFunc=callBackFunc;
                RemoteUtility.GetOrganPOList().then((organPOList) => {
                    this.tree.organTreeObj = $.fn.zTree.init($(this.$refs.organZTreeUL), this.tree.organTreeSetting, organPOList);
                    this.tree.organTreeObj.expandAll(true);
                    this.tree.organTreeObj._host = this;
                });
            },
            organTreeNodeSelected(event, treeId, treeNode) {
                var organPath = TreeUtility.BuildNodePathName(treeNode, "organName", "",1);
                ArrayUtility.PushWhenNotExist(this.selectedOrganArray,{
                    organId:treeNode.organId,
                    organPath:organPath,
                    organName:treeNode.organName
                },function(item){return item.organId==treeNode.organId});
            },
            deleteSelectedOrgan(event, name){
                console.log(name);
                for (let i = 0; i < this.selectedUserArray.length; i++) {
                    if(this.selectedUserArray[i].userId==name){
                        ArrayUtility.Delete(this.selectedUserArray,i);
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>