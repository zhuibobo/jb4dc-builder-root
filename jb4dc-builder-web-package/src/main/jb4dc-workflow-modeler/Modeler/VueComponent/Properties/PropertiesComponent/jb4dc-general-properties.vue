<template>
    <div>
        <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
            <colgroup>
                <col style="width: 9%" />
                <col style="width: 41%" />
                <col style="width: 9%" />
                <col style="width: 35%" />
                <col style="width: 6%" />
            </colgroup>
            <tbody>
                <tr v-if="trIsProcess">
                    <td>流程类别：</td>
                    <td>
                        <Select v-model="jb4dc.jb4dcFlowCategory" style="width:200px">
                            <Option value="通用流程">通用流程</Option>
                            <Option value="公文收文流程">公文收文流程</Option>
                            <Option value="公文发文流程">公文发文流程</Option>
                            <Option value="行政审批流程">行政审批流程</Option>
                            <Option value="行政许可流程">行政许可流程</Option>
                            <Option value="社区服务流程">社区服务流程</Option>
                        </Select>
                    </td>
                    <td>
                        Tenant Id：
                    </td>
                    <td colspan="2">
                        <input type="text" v-model="jb4dc.jb4dcTenantId" />
                    </td>
                </tr>
                <tr>
                    <td>绑定表单：</td>
                    <td>
                        <Select v-model="jb4dc.jb4dcFormId" style="width:250px" @on-change="changeBindForm" :clearable="true">
                            <Option v-for="item in formResourcePOList" :value="item.formId" :key="item.formId">【{{ item.formCode }}】{{ item.formName }}</Option>
                        </Select>
                        <Button type="primary" disabled>编辑表单</Button>
                    </td>
                    <td>流程编号：</td>
                    <td colspan="2">
                        <input type="text" v-model="jb4dc.jb4dcCode" />
                    </td>
                </tr>
                <tr>
                    <td rowspan="2">流程标题：</td>
                    <td colspan="3">
                        <textarea v-model="jb4dc.jb4dcProcessTitleEditText" rows="2" disabled="disabled"></textarea>
                    </td>
                    <td rowspan="2">
                        <Button type="primary" @click="beginEditContextJuelForFlowProcessTitle">编辑</Button>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="background-color: #fff">
                        <textarea v-model="jb4dc.jb4dcProcessTitleEditValue" rows="2" disabled="disabled"></textarea>
                    </td>
                </tr>
                <tr>
                    <td rowspan="2">流程备注：</td>
                    <td colspan="3">
                        <textarea v-model="jb4dc.jb4dcProcessDescriptionEditText" rows="4" disabled="disabled"></textarea>
                    </td>
                    <td rowspan="2">
                        <Button type="primary" @click="beginEditContextJuelForFlowProcessDescription">编辑</Button>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="background-color: #fff">
                        <textarea v-model="jb4dc.jb4dcProcessDescriptionEditValue" rows="4" disabled="disabled"></textarea>
                    </td>
                </tr>
            </tbody>
        </table>
        <contextVarJuelEditDialog ref="contextVarJuelEditDialog"></contextVarJuelEditDialog>
    </div>
</template>

<script>

    import {RemoteUtility} from '../../../Remote/RemoteUtility';
    import contextVarJuelEditDialog from "../Dialog/context-var-juel-edit-dialog.vue";
    import { FlowBpmnJsIntegrated } from '../../BpmnJsExtend/FlowBpmnJsIntegrated.js';

    var flowBpmnJsIntegrated=null;
    export default {
        name: "jb4dc-general-properties",
        components: {
            contextVarJuelEditDialog
        },
        props:["propJb4dcGeneralData","propIsProcess"],
        data(){
            return {
                jb4dc:{},
                trIsProcess:true,
                formResourcePOList:null
            }
        },
        mounted() {
            /*RemoteUtility.GetModuleById("").then(function (result) {
                console.log(result);
            })*/
            if(this.propIsProcess==false){
                this.trIsProcess=false;
            }
            //console.log(this.propIsProcess);
            this.jb4dc=this.propJb4dcGeneralData;

            RemoteUtility.GetFormResourcePOList().then((formResourcePOList) => {
                //console.log(formResourcePOList);
                this.formResourcePOList = formResourcePOList;
            });

            if(this.jb4dc.jb4dcFormId){
                this.changeBindForm(this.jb4dc.jb4dcFormId);
            }
            flowBpmnJsIntegrated=FlowBpmnJsIntegrated.GetInstance();
        },
        methods:{
            beginEditContextJuelForFlowProcessTitle(){
                //var
                var _self=this;
                var formId=flowBpmnJsIntegrated.TryGetFormId(this.jb4dc.jb4dcFormId);
                this.$refs.contextVarJuelEditDialog.beginEditContextJuel("编辑实例标题",this.jb4dc.jb4dcProcessTitleEditValue,formId,function(result){
                    _self.jb4dc.jb4dcProcessTitleEditText=result.editText;
                    _self.jb4dc.jb4dcProcessTitleEditValue=result.editValue;
                });
            },
            beginEditContextJuelForFlowProcessDescription(){
                var _self=this;
                var formId=flowBpmnJsIntegrated.TryGetFormId(this.jb4dc.jb4dcFormId);
                this.$refs.contextVarJuelEditDialog.beginEditContextJuel("编辑实例备注",this.jb4dc.jb4dcProcessDescriptionEditValue,formId,function(result){
                    _self.jb4dc.jb4dcProcessDescriptionEditText=result.editText;
                    _self.jb4dc.jb4dcProcessDescriptionEditValue=result.editValue;
                });
            },
            /**/
            changeBindForm(formId){
                //console.log(formId);
                /**/
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