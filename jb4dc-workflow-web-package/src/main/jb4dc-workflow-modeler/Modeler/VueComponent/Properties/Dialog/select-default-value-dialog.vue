<template>
    <div ref="selectDefaultValueDialogWrap" style="display: none">
        aaa
    </div>
</template>

<script>
    export default {
        name: "select-default-value-dialog.vue",
        data(){
            return {
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
                        if(typeof (_self.callBackFunc=="function")) {
                            _self.callBackFunc(_self.editData);
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

                RemoteUtility.GetFormResourceBindMainTable(formId).then((mainTablePO) => {
                    //console.log(formResourcePOList);
                    if(mainTablePO) {
                        this.tableField.fieldData = mainTablePO.tableFieldPOList;
                    }
                    else{
                        this.tableField.fieldData=[];
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>