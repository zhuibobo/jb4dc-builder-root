<template>
    <tabs name="service-task-properties-tabs">
        <tab-pane tab="service-task-properties-tabs" label="基础设置">
            <generalEventProperties ref="generalEventProperties" :prop-bpmn-general-data="bpmn"></generalEventProperties>
        </tab-pane>
        <tab-pane tab="service-task-properties-tabs" label="执行监听">
            <listenersProperties ref="listenersProperties" :prop-listener-data="camunda.executionListener"></listenersProperties>
        </tab-pane>
        <tab-pane tab="service-task-properties-tabs" label="扩展属性">
            <extensionsProperties ref="extensionsProperties" :prop-extensions-properties-data="camunda.extensionProperties"></extensionsProperties>
        </tab-pane>
    </tabs>
</template>

<script>
import listenersProperties from "./PropertiesComponent/listeners-properties.vue";
import extensionsProperties from "./PropertiesComponent/extensions-properties.vue";
import generalEventProperties from "./PropertiesComponent/general-event-properties.vue";
import { PODefinition } from "../BpmnJsExtend/PODefinition.js"

export default {
    name: "boundary-event-properties",
    components: {
        listenersProperties,
        extensionsProperties,
        generalEventProperties
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
    },
    beforeDestroy(){
    },
    methods: {
        changeInnerTimeType(){},
        changeInnerEventType(){},
        getValue() {
            this.$refs.generalEventProperties.handleEventDefinition(this.bpmn);
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