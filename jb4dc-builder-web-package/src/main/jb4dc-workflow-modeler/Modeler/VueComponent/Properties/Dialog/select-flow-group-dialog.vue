<template>
    <div ref="selectFlowGroupDialogWrap" style="display: none">

    </div>
</template>

<script>
import {RemoteUtility} from "../../../Remote/RemoteUtility";
export default {
    name: "select-flow-group-dialog",
    data(){
        return {
            tree:{
            },
            selectedGroupArray:[{
                groupId:"1",
                groupName:"G1",
                parentId:"0"
            },{
                groupId:"2",
                groupName:"G2",
                parentId:"0"
            }]
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
                        var result=JsonUtility.CloneArraySimple(_self.selectedGroupArray);
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
            /*RemoteUtility.GetOrganPOList().then((organPOList) => {
                this.tree.organTreeObj = $.fn.zTree.init($(this.$refs.organZTreeUL), this.tree.organTreeSetting, organPOList);
                this.tree.organTreeObj.expandAll(true);
                this.tree.organTreeObj._host = this;
            });*/
        }
    }
}
</script>

<style scoped>

</style>