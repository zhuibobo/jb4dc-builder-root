<template>
    <div>
        <tabs name="user-task-properties-tabs">
            <tab-pane tab="user-task-properties-tabs" label="CMA-General">
                <taskGeneralProperties :prop-bpmn-general-data="bpmn" :prop-camunda-general-data="camunda"></taskGeneralProperties>
            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="基础设置">
                <jb4dcGeneralProperties ref="jb4dcGeneralProperties" :prop-jb4dc-general-data="jb4dc" :propIsProcess="false"></jb4dcGeneralProperties>
            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="动作设置">
                <jb4dcActionsProperties ref="jb4dcActionsProperties"></jb4dcActionsProperties>
            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="人员设置">

            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="权限设置">

            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="CMA-Execution-Listeners">
                <listenersProperties ref="listenersProperties" :prop-listener-data="camunda.executionListener"></listenersProperties>
            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="CMA-Task-Listeners">
                <listenersProperties ref="listenersProperties" :prop-listener-data="camunda.taskListener"></listenersProperties>
            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="CMA-Extensions">
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

    export default {
        name: "user-task-properties",
        components: {
            taskGeneralProperties,
            listenersProperties,
            extensionsProperties,
            jb4dcGeneralProperties,
            jb4dcActionsProperties
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
        },
        mounted() {
            //alert("hello alex");
        },
        methods: {
            getValue() {
                var result = {
                    bpmn: this.bpmn,
                    camunda: this.camunda,
                    jb4dc: this.jb4dc
                };
                return result;
            }
        }
    }
</script>

<style scoped>

</style>