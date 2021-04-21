<template>
    <div ref="selectFlowGroupDialogWrap" style="display: none">
        <div style="width: 50%;float: left;height: 452px;border: #a9b7d1 1px solid;border-radius: 4px;margin-right: 10px">
            <div class="inner-wrap">
                <div>
                    <ul id="select-model-group-dialog-treeUL" ref="modelGroupZTreeUL" class="ztree"></ul>
                </div>
            </div>
        </div>
        <div style="width: 48%;float: right;height: 452px;border: #e8eaec 1px solid;border-radius: 4px;">
            <div style="border-bottom: #e8eaec 1px solid;background-color: #f8f8f9;height: 36px;line-height: 36px;padding-left: 10px;border-radius: 4px 4px 0px 0px">选定分组</div>
            <div style="margin-left: 10px;margin-top: 8px">
                <tag type="border" color="success" :closable="true" v-for="item in selectedArray" :key="item.groupId" :name="item.groupId" @on-close="deleteSelected">{{item.groupName}}</tag>
            </div>
        </div>
    </div>
</template>

<script>
import {RemoteUtility} from "../../../Remote/RemoteUtility";
export default {
    name: "select-flow-group-dialog",
    data(){
        return {
            tree:{
                treeObj:null,
                treeIdFieldName:"modelGroupId",
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
                            name:"modelGroupText"
                        },
                        simpleData : {
                            enable : true,
                            idKey : "modelGroupId", // id编号命名12
                            pIdKey : "modelGroupParentId",  // 父id编号命名
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
                            //appList.treeObj.expandAll(true);
                        }
                    }
                },
                selectedTableName:"无"
            },
            selectedGroupArray:[{
                groupId:"1",
                groupName:"G1",
                parentId:"0"
            },{
                groupId:"2",
                groupName:"G2",
                parentId:"0"
            }],
            callBackFunc:null,
            selectedArray:[]
        }
    },
    mounted() {
        var _self=this;
        DialogUtility.DialogElemObj(this.$refs.selectFlowGroupDialogWrap,{
            title:"",
            width:550,
            height:560,
            modal:true,
            buttons: {
                "确认": function () {
                    if(typeof (_self.callBackFunc=="function")) {
                        var result=JsonUtility.CloneArraySimple(_self.selectedArray);
                        _self.callBackFunc(result);
                    }
                    DialogUtility.CloseDialogElem(_self.$refs.selectFlowGroupDialogWrap);
                },
                "清空": function () {
                    if(typeof (_self.callBackFunc=="function")) {
                        _self.callBackFunc([]);
                    }
                    DialogUtility.CloseDialogElem(_self.$refs.selectFlowGroupDialogWrap);
                },
                "取消": function () {
                    DialogUtility.CloseDialogElem(_self.$refs.selectFlowGroupDialogWrap);
                }
            }
        });
        $(this.$refs.selectFlowGroupDialogWrap).dialog("close");
    },
    methods:{
        beginSelectGroup(dialogTitle,oldData,callBackFunc) {
            //this.selectedOrganArray=[];
            $(this.$refs.selectFlowGroupDialogWrap).dialog("open");
            $(this.$refs.selectFlowGroupDialogWrap).dialog("option", "title", dialogTitle );
            this.callBackFunc=callBackFunc;
            RemoteUtility.GetModelGroupPOList().then((modelGroupEntityList) => {
                console.log(modelGroupEntityList);
                this.tree.treeObj = $.fn.zTree.init($(this.$refs.modelGroupZTreeUL), this.tree.treeSetting, modelGroupEntityList);
                this.tree.treeObj.expandAll(true);
                this.tree.treeObj._host = this;
            });
        },
        treeNodeSelected(event, treeId, treeNode){
            //var organPath = TreeUtility.BuildNodePathName(treeNode, "organName", "",1);
            ArrayUtility.PushWhenNotExist(this.selectedArray,{
                groupId:treeNode.modelGroupId,
                groupName:treeNode.modelGroupText,
                parentId:treeNode.modelGroupParentId
            },function(item){return item.groupId==treeNode.modelGroupId});
        },
        deleteSelected(event, key){
            console.log(key);
            for (let i = 0; i < this.selectedArray.length; i++) {
                if(this.selectedArray[i].groupId==key){
                    ArrayUtility.Delete(this.selectedArray,i);
                }
            }
        }
    }
}
</script>

<style scoped>

</style>