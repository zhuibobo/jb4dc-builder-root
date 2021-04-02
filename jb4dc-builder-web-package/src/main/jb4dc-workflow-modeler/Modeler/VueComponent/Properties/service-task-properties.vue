<template>
    <div>
        <tabs name="service-task-properties-tabs">
            <tab-pane tab="service-task-properties-tabs" label="基础设置">
                <implementationProperties :prop-bpmn-general-data="bpmn" :prop-camunda-general-data="camunda" :prop-jb4dc-general-data="jb4dc"></implementationProperties>
            </tab-pane>
            <tab-pane tab="service-task-properties-tabs" label="执行监听">
                <listenersProperties ref="listenersProperties" :prop-listener-data="camunda.executionListener"></listenersProperties>
            </tab-pane>
            <tab-pane tab="service-task-properties-tabs" label="扩展属性">
                <extensionsProperties ref="extensionsProperties" :prop-extensions-properties-data="camunda.extensionProperties"></extensionsProperties>
            </tab-pane>
        </tabs>
    </div>
</template>

<script>
import implementationProperties from "./PropertiesComponent/implementation-properties.vue";
import listenersProperties from "./PropertiesComponent/listeners-properties.vue";
import extensionsProperties from "./PropertiesComponent/extensions-properties.vue";
import { PODefinition } from "../BpmnJsExtend/PODefinition.js"

export default {
    name: "service-task-properties",
    components: {
        implementationProperties,
        listenersProperties,
        extensionsProperties
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
        //debugger;
        this.bpmn=this.propElemProperties.bpmn;
        this.camunda=this.propElemProperties.camunda;
        this.jb4dc=this.propElemProperties.jb4dc;
        console.log(this.propElemProperties);
    },
    mounted() {
        //alert("hello alex");
        console.log(this.jb4dc.jb4dcActions);
    },
    beforeDestroy(){

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