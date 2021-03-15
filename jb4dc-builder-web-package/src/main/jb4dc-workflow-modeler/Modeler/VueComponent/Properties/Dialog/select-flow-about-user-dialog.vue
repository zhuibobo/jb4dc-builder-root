<template>
    <div ref="selectFlowAboutUserDialogWrap" style="display: none">
        <RadioGroup v-model="selectedData.value">
            <Radio label="instanceStarter" border><span>实例发起人</span></Radio>
            <Radio label="modelManager" border><span>模型管理人</span></Radio>
        </RadioGroup>
    </div>
</template>

<script>

export default {
    name: "select-flow-about-user-dialog",
    data(){
        return {
            selectedData:{
                type:"flowAboutUser",
                value:"instanceStarter",
                text:"",
                config:{}
            }
        }
    },
    mounted() {
        var _self = this;
        DialogUtility.DialogElemObj(this.$refs.selectFlowAboutUserDialogWrap, {
            title: "",
            width: 850,
            height: 560,
            modal: true,
            buttons: {
                "确认": function () {
                    if (typeof (_self.callBackFunc == "function")) {
                        if(_self.selectedData.value=="instanceStarter"){
                            _self.selectedData.text="流程实例发起人";
                        }
                        else if(_self.selectedData.value=="modelManager"){
                            _self.selectedData.text="模型管理人";
                        }
                        var result = JsonUtility.CloneStringify(_self.selectedData);

                        _self.callBackFunc(result);
                    }
                    DialogUtility.CloseDialogElem(_self.$refs.selectFlowAboutUserDialogWrap);
                },
                "取消": function () {
                    DialogUtility.CloseDialogElem(_self.$refs.selectFlowAboutUserDialogWrap);
                }
            }
        });
        $(this.$refs.selectFlowAboutUserDialogWrap).dialog("close");
    },
    methods:{
        beginSelectFlowAboutUser(dialogTitle, oldData, callBackFunc) {
            this.selectedUserArray = [];
            $(this.$refs.selectFlowAboutUserDialogWrap).dialog("open");
            $(this.$refs.selectFlowAboutUserDialogWrap).dialog("option", "title", dialogTitle);
            this.callBackFunc = callBackFunc;
            /*console.log("11111");
            RemoteUtility.GetOrganPOList().then((organPOList) => {
                console.log(organPOList);
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