<template>
    <div>
        <tabs name="sequence-flow-properties-tabs">
            <tab-pane tab="sequence-flow-properties-tabs" label="CMA-General">
                <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                    <colgroup>
                        <col style="width: 9%" />
                        <col style="width: 41%" />
                        <col style="width: 9%" />
                        <col style="width: 35%" />
                        <col style="width: 6%" />
                    </colgroup>
                    <tbody>
                    <tr>
                        <td>ID：</td>
                        <td>
                            <input type="text" v-model="bpmn.id" disabled="disabled" />
                        </td>
                        <td>Name：</td>
                        <td colspan="2">
                            <input type="text" v-model="bpmn.name" />
                        </td>
                    </tr>

                    <tr>
                        <td rowspan="2">绑定条件：</td>
                        <td colspan="3">
                            <textarea id="txtFlowProcessTitle" v-model="jb4dc.jb4dcProcessTitle" rows="1"></textarea>
                        </td>
                        <td>
                            <Button type="primary" @click="beginEditContextJuelForFlowProcessTitle">编辑</Button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4">
                            <div style="height: 208px;width: 800px;overflow-y: auto;overflow-x: hidden;margin: auto">
                                <Carousel v-model="value1" loop>
                                    <CarouselItem v-for="fromTask in mayBeFromTaskList">
                                        <div class="demo-carousel">
                                            {{fromTask.taskElem.businessObject.name}}
                                        </div>
                                    </CarouselItem>
                                </Carousel>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Documentation：</td>
                        <td colspan="4">
                            <textarea rows="6" v-model="bpmn.documentation"></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </tab-pane>
            <tab-pane tab="sequence-flow-properties-tabs" label="CMA-Execution-Listeners">
                <listenersProperties ref="listenersProperties" :prop-listener-data="camunda.executionListener"></listenersProperties>
            </tab-pane>
            <tab-pane tab="sequence-flow-properties-tabs" label="CMA-Extensions">
                <extensionsProperties ref="extensionsProperties" :prop-extensions-properties-data="camunda.extensionProperties"></extensionsProperties>
            </tab-pane>
        </tabs>
    </div>
</template>

<script>
    import taskGeneralProperties from "./PropertiesComponent/task-general-properties.vue";
    import listenersProperties from "./PropertiesComponent/listeners-properties.vue";
    import extensionsProperties from "./PropertiesComponent/extensions-properties.vue";
    import jb4dcGeneralProperties from "./PropertiesComponent/jb4dc-general-properties.vue";
    import jb4dcActionsProperties from "./PropertiesComponent/jb4dc-actions-properties.vue";
    import { PODefinition } from "../BpmnJsExtend/PODefinition.js"
    import { BpmnJsUtility } from '../BpmnJsExtend/BpmnJsUtility';
    import { FlowBpmnJsIntegrated } from '../BpmnJsExtend/FlowBpmnJsIntegrated';
    export default {
        name: "sequence-flow-properties",
        components: {
            taskGeneralProperties,
            listenersProperties,
            extensionsProperties,
            jb4dcGeneralProperties,
            jb4dcActionsProperties
        },
        props:["propElemProperties"],
        data() {
            return {
                value1:0,
                bpmn: PODefinition.GetDialogPropertiesPO().bpmn,
                camunda: PODefinition.GetDialogPropertiesPO().camunda,
                jb4dc: PODefinition.GetDialogPropertiesPO().jb4dc,
                mayBeFromTaskList:[]
            }
        },
        created(){
            this.bpmn=this.propElemProperties.bpmn;
            this.camunda=this.propElemProperties.camunda;
            this.jb4dc=this.propElemProperties.jb4dc;
            this.mayBeFromTaskList=BpmnJsUtility.JB4DC_TryGetMayBeActionsBySequenceFlowId(FlowBpmnJsIntegrated.GetInstance().GetModeler(),this.bpmn.id);
            console.log(this.bpmn.id);
            console.log();
        },
        methods:{
            beginEditContextJuelForFlowProcessTitle(){
            }
        }
    }
</script>

<style scoped>
    .demo-carousel{
        height: 206px;
        background-color: #e6f6f9;
    }
</style>