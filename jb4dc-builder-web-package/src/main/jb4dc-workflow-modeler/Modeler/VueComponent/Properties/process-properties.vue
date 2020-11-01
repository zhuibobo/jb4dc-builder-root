<template>
    <div>
        <tabs name="process-properties-tabs">
            <tab-pane tab="process-properties-tabs" label="CMA-General">
                <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                    <colgroup>
                        <col style="width: 14%" />
                        <col style="width: 36%" />
                        <col style="width: 15%" />
                        <col style="width: 35%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td style="color: red">启动键：</td>
                            <td>
                                <input type="text" placeholder="ID (Start Key) 必须唯一" v-model="bpmn.id" style="width:240px" />
                                <Button type="primary" @click="randomId">随机生成</Button>
                            </td>
                            <td>可执行/IsExecutable：</td>
                            <td style="text-align: left">
                                <radio-group type="button" style="margin: auto" v-model="bpmn.isExecutable">
                                    <radio label="true">是</radio>
                                    <radio label="false">否</radio>
                                </radio-group>
                            </td>
                        </tr>
                        <tr>
                            <td>名称：</td>
                            <td>
                                <input placeholder="Name" type="text" v-model="bpmn.name" />
                            </td>
                            <td>版本：</td>
                            <td>
                                <input placeholder="Version Tag" type="text" v-model="camunda.versionTag" />
                            </td>
                        </tr>
                        <tr>
                            <td>任务优先级：</td>
                            <td>
                                <input placeholder="Task Priority" type="text" v-model="camunda.taskPriority" disabled="disabled" />
                            </td>
                            <td>工作优先级：</td>
                            <td>
                                <input placeholder="Job Priority" type="text" v-model="camunda.jobPriority" disabled="disabled" />
                            </td>
                        </tr>
                        <tr>
                            <td>启动分组：</td>
                            <td>
                                <input type="text" placeholder="Candidate Starter Groups" v-model="camunda.candidateStarterGroups" style="width:262px" />
                                <Button type="primary" @click="beginSelectRole">选择</Button>
                            </td>
                            <td colspan="2">
                                {{jb4dc.jb4dcProcessCandidateStarterGroupsDesc}}
                            </td>
                        </tr>
                        <tr>
                            <td>启动用户：</td>
                            <td>
                                <input type="text" placeholder="Candidate Starter Users" v-model="camunda.candidateStarterUsers" style="width:262px" />
                                <Button type="primary">选择</Button>
                            </td>
                            <td colspan="2">

                            </td>
                        </tr>
                        <tr>
                            <td>历史记录存活时间：</td>
                            <td>
                                <input type="text" placeholder="History Time To Live" v-model="camunda.historyTimeToLive" disabled="disabled" />
                            </td>
                            <td>
                            </td>
                            <td>

                            </td>
                        </tr>
                        <tr>
                            <td>备注：</td>
                            <td colspan="3">
                                <textarea rows="8" placeholder="Element Documentation" v-model="bpmn.documentation"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="基础设置">
                <jb4dcGeneralProperties ref="jb4dcGeneralProperties" :prop-jb4dc-general-data="jb4dc"></jb4dcGeneralProperties>
            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="通知设置">

            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="管理设置">

            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="CMA-Execution-Listeners">
                <listenersProperties ref="listenersProperties" :prop-listener-data="camunda.executionListener"></listenersProperties>
            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="CMA-Extensions">
                <extensionsProperties ref="extensionsProperties" :prop-extensions-properties-data="camunda.extensionProperties"></extensionsProperties>
            </tab-pane>
        </tabs>
        <selectRoleDialog ref="selectRoleDialog"></selectRoleDialog>
    </div>
</template>

<script>
    import listenersProperties from "./PropertiesComponent/listeners-properties.vue";
    import extensionsProperties from "./PropertiesComponent/extensions-properties.vue";
    import jb4dcGeneralProperties from "./PropertiesComponent/jb4dc-general-properties.vue";
    import { PODefinition } from "../BpmnJsExtend/PODefinition.js";
    import selectRoleDialog from "./Dialog/select-role-dialog.vue";

    export default {
        name: "process-properties",
        components: {
            listenersProperties,
            extensionsProperties,
            jb4dcGeneralProperties,
            selectRoleDialog
        },
        props:["propElemProperties"],
        data:function () {
            return {
                bpmn:PODefinition.GetDialogPropertiesPO().bpmn,
                camunda:PODefinition.GetDialogPropertiesPO().camunda,
                jb4dc:PODefinition.GetDialogPropertiesPO().jb4dc
            }
        },
        created(){
            this.bpmn=this.propElemProperties.bpmn;
            this.camunda=this.propElemProperties.camunda;
            this.jb4dc=this.propElemProperties.jb4dc;
            if(!this.jb4dc.jb4dcTenantId){
                this.jb4dc.jb4dcTenantId="JBuild4DC-Tenant";
            }
            if(!this.jb4dc.jb4dcFlowCategory){
                this.jb4dc.jb4dcFlowCategory="通用流程";
            }
        },
        mounted(){

        },
        methods:{
            randomId(){
                this.bpmn.id="Flow_Model_"+StringUtility.Timestamp();
            },
            beginSelectRole(){
                this.$refs.selectRoleDialog.beginSelectRole("选择角色","",(result)=>{
                    //console.log(result);
                    //EditTable_SelectDefaultValue.SetSelectEnvVariableResultValue(result);
                    //_self.innerDetailInfo.actionDisplayCondition=result;
                    this.camunda.candidateStarterGroups=result.Value;
                    this.jb4dc.jb4dcProcessCandidateStarterGroupsDesc=result.Text;
                });
            },
            getValue(){
                var result= {
                    bpmn:this.bpmn,
                    camunda:this.camunda,
                    jb4dc:this.jb4dc
                };
                //console.log(this.camunda.executionListener);
                //var executionListener=this.$refs.listenersProperties.getHostResultProperties();
                //result.camunda.executionListener=executionListener;
                return result;
            }
        }
    }
</script>

<style scoped>

</style>