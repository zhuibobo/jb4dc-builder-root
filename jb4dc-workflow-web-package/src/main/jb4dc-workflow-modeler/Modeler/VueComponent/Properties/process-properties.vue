<template>
    <div>
        <tabs name="process-properties-tabs">
            <tab-pane tab="process-properties-tabs" label="CMA-General">
                <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                    <colgroup>
                        <col style="width: 18%" />
                        <col style="width: 32%" />
                        <col style="width: 18%" />
                        <col style="width: 32%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>ID：</td>
                            <td>
                                <input type="text" v-model="bpmn.id" disabled="disabled" />
                            </td>
                            <td>IsExecutable：</td>
                            <td style="text-align: left">
                                <radio-group type="button" style="margin: auto" v-model="bpmn.isExecutable">
                                    <radio label="true">是</radio>
                                    <radio label="false">否</radio>
                                </radio-group>
                            </td>
                        </tr>
                        <tr>
                            <td>Name：</td>
                            <td>
                                <input type="text" v-model="bpmn.name" />
                            </td>
                            <td>Version Tag：</td>
                            <td>
                                <input type="text" v-model="camunda.versionTag" />
                            </td>
                        </tr>
                        <tr>
                            <td>Task Priority：</td>
                            <td>
                                <input type="text" v-model="camunda.taskPriority" disabled="disabled" />
                            </td>
                            <td>Job Priority：</td>
                            <td>
                                <input type="text" v-model="camunda.jobPriority" disabled="disabled" />
                            </td>
                        </tr>
                        <tr>
                            <td>Candidate Starter Groups：</td>
                            <td>
                                <input type="text" v-model="camunda.candidateStarterGroups" />
                            </td>
                            <td>Candidate Starter Users：</td>
                            <td>
                                <input type="text" v-model="camunda.candidateStarterUsers" />
                            </td>
                        </tr>
                        <tr>
                            <td>History Time To Live：</td>
                            <td>
                                <input type="text" v-model="camunda.historyTimeToLive" disabled="disabled" />
                            </td>
                            <td>
                            </td>
                            <td>

                            </td>
                        </tr>
                        <tr>
                            <td>Element Documentation：</td>
                            <td colspan="3">
                                <textarea rows="11" v-model="bpmn.documentation"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="CMA-Listeners">
                <listenersProperties ref="listenersProperties" :prop-listener-data="camunda.executionListener"></listenersProperties>
            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="CMA-Extensions">
                <extensionsProperties ref="extensionsProperties" :prop-extensions-properties-data="camunda.extensionProperties"></extensionsProperties>
            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="JB4DC-General">
                <jb4dcGeneralProperties ref="jb4dcGeneralProperties"></jb4dcGeneralProperties>
            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="JB4DC-Notice">

            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="JB4DC-Manager">

            </tab-pane>
        </tabs>
    </div>
</template>

<script>
    import listenersProperties from "./PropertiesComponent/listeners-properties.vue";
    import extensionsProperties from "./PropertiesComponent/extensions-properties.vue";
    import jb4dcGeneralProperties from "./PropertiesComponent/jb4dc-general-properties.vue";
    import { PODefinition } from "../BpmnJsExtend/PODefinition.js"

    export default {
        name: "process-properties",
        components: {
            listenersProperties,
            extensionsProperties,
            jb4dcGeneralProperties
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
            if(!this.jb4dc.tenantId){
                this.jb4dc.tenantId="JBuild4DC-Tenant";
            }
        },
        mounted(){

        },
        methods:{
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
            },
            setValue(props){
                console.log(props);
            }
        }
    }
</script>

<style scoped>

</style>