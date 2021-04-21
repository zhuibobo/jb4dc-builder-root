<template>
    <div>
        <Collapse value="1" accordion style="margin-top:8px ">
            <Panel name="1">
                基础绑定信息
                <div slot="content">
                    <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                        <colgroup>
                            <col style="width: 11%" />
                            <col style="width: 39%" />
                            <col style="width: 11%" />
                            <col style="width: 33%" />
                            <col style="width: 6%" />
                        </colgroup>
                        <tbody>
                        <tr>
                            <td>编号：</td>
                            <td colspan="4">
                                <input type="text" v-model="jb4dc.jb4dcCode" />
                            </td>
                        </tr>
                        <tr>
                            <td>绑定表单1：</td>
                            <td>
                                <Select v-model="jb4dc.jb4dcFormId" style="width:250px" @on-change="changeBindForm" :clearable="true">
                                    <Option v-for="item in formResourcePOList" :value="item.formId" :key="item.formId">【{{ item.formCode }}】{{ item.formName }}</Option>
                                </Select>
                                <Button type="primary" disabled>编辑表单</Button>
                            </td>
                            <td>绑定表单2：</td>
                            <td colspan="2">
                                <Select v-model="jb4dc.jb4dcFormEx1Id" style="width:250px" @on-change="changeBindForm" :clearable="true">
                                    <Option v-for="item in formResourcePOList" :value="item.formId" :key="item.formId">【{{ item.formCode }}】{{ item.formName }}</Option>
                                </Select>
                                <Button type="primary" disabled>编辑表单</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>外部表单1：</td>
                            <td>
                                <input type="text" v-model="jb4dc.jb4dcOuterFormUrl" />
                            </td>
                            <td>外部表单2：</td>
                            <td colspan="2">
                                <input type="text" v-model="jb4dc.jb4dcOuterFormEx1Url" />
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
                                <textarea v-model="jb4dc.jb4dcProcessTitleEditValue" rows="1" disabled="disabled"></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td>流程备注：</td>
                            <td colspan="3">
                                <textarea v-model="jb4dc.jb4dcProcessDescriptionEditText" rows="2" disabled="disabled"></textarea>
                            </td>
                            <td>
                                <Button type="primary" @click="beginEditContextJuelForFlowProcessDescription">编辑</Button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </Panel>
            <Panel name="2">
                正文绑定信息
                <div slot="content">
                    <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                        <colgroup>
                            <col style="width: 14%" />
                            <col style="width: 36%" />
                            <col style="width: 15%" />
                            <col style="width: 35%" />
                        </colgroup>
                        <tbody>
                        <tr>
                            <td>启用正文：</td>
                            <td>
                            </td>
                            <td>正文插件：</td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td>套红模板：</td>
                            <td>
                            </td>
                            <td></td>
                            <td>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </Panel>
        </Collapse>

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