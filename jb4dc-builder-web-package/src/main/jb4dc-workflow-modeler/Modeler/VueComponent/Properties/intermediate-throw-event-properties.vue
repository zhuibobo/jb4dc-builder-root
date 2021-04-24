<template>
    <tabs name="intermediate-throw-event-tabs">
        <tab-pane tab="intermediate-throw-event-tabs" label="基础设置">
            <generalEventProperties ref="generalEventProperties" :prop-bpmn-general-data="bpmn"></generalEventProperties>
        </tab-pane>
        <tab-pane tab="intermediate-throw-event-tabs" label="委托设置">
            <div v-if="showImplementationProperties">
                <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                    <colgroup>
                        <col style="width: 14%" />
                        <col style="width: 86%" />
                    </colgroup>
                    <tbody>
                    <tr>
                        <td>implementation：</td>
                        <td colspan="3">
                            <radio-group type="button" style="margin: auto" v-model="implementationType">
                                <radio label="java class">Java Class</radio>
                            </radio-group>
                        </td>
                    </tr>
                    <tr v-if="implementationType=='java class'">
                        <td>Java Class</td>
                        <td>
                            <input placeholder="" type="text" v-model="bpmn.messageEventDefinition.class" />
                            <div style="margin-top: 8px">
                                <tag type="border" color="success">继承接口org.camunda.bpm.engine.delegate.JavaDelegate</tag>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </tab-pane>
        <tab-pane tab="intermediate-throw-event-tabs" label="执行监听">
            <listenersProperties ref="listenersProperties" :prop-listener-data="camunda.executionListener"></listenersProperties>
        </tab-pane>
        <tab-pane tab="intermediate-throw-event-tabs" label="扩展属性">
            <extensionsProperties ref="extensionsProperties" :prop-extensions-properties-data="camunda.extensionProperties"></extensionsProperties>
        </tab-pane>
    </tabs>
</template>

<script>
import listenersProperties from "./PropertiesComponent/listeners-properties.vue";
import extensionsProperties from "./PropertiesComponent/extensions-properties.vue";
import implementationProperties from "./PropertiesComponent/implementation-properties.vue";
import generalEventProperties from "./PropertiesComponent/general-event-properties.vue";
import { PODefinition } from "../BpmnJsExtend/PODefinition.js"
export default {
    name: "intermediate-throw-event-properties",
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
            jb4dc:PODefinition.GetDialogPropertiesPO().jb4dc,
            showImplementationProperties:false,
            implementationType:"java class"
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
        if (this.bpmn.messageEventDefinition && this.bpmn.messageEventDefinition.id) {
            this.showImplementationProperties = true;
        }
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