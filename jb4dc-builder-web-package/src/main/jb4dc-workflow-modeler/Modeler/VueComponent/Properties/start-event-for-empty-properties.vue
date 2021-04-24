<template>
    <tabs name="start-event-for-empty-tabs" @on-click="changeTab">
        <tab-pane tab="start-event-for-empty-tabs" label="绑定设置">
            <jb4dcGeneralProperties ref="jb4dcGeneralProperties" :prop-jb4dc-general-data="jb4dc" :prop-is-process="false"></jb4dcGeneralProperties>
        </tab-pane>
        <tab-pane tab="start-event-for-empty-tabs" label="动作设置">
            <jb4dcActionsProperties ref="jb4dcActionsProperties" :prop-bpmn-general-data="bpmn" :prop-jb4dc-general-data="jb4dc" :prop-from-id="jb4dc.jb4dcFormId" :prop-action-data="jb4dc.jb4dcActions.actions"></jb4dcActionsProperties>
        </tab-pane>
        <tab-pane tab="start-event-for-empty-tabs" label="权限设置" name="authorityTabPane">
            <jb4dcAuthorityProperties ref="jb4dcAuthorityProperties" :prop-jb4dc-general-data="jb4dc"></jb4dcAuthorityProperties>
        </tab-pane>
        <tab-pane tab="start-event-for-empty-tabs" label="执行监听">
            <listenersProperties ref="listenersProperties" :prop-listener-data="camunda.executionListener"></listenersProperties>
        </tab-pane>
        <tab-pane tab="start-event-for-empty-tabs" label="扩展属性">
            <extensionsProperties ref="extensionsProperties" :prop-extensions-properties-data="camunda.extensionProperties"></extensionsProperties>
        </tab-pane>
    </tabs>
</template>

<script>

import jb4dcGeneralProperties from "./PropertiesComponent/jb4dc-general-properties.vue";
import jb4dcActionsProperties from "./PropertiesComponent/jb4dc-actions-properties.vue";
import jb4dcAuthorityProperties from "./PropertiesComponent/jb4dc-authority-properties.vue";

import listenersProperties from "./PropertiesComponent/listeners-properties.vue";
import extensionsProperties from "./PropertiesComponent/extensions-properties.vue";
import { PODefinition } from "../BpmnJsExtend/PODefinition.js"
import { FlowBpmnJsIntegrated } from "../BpmnJsExtend/FlowBpmnJsIntegrated";

var flowBpmnJsIntegrated=null;
export default {
    name: "start-event-for-empty-properties",
    components: {
        listenersProperties,
        extensionsProperties,
        jb4dcGeneralProperties,
        jb4dcActionsProperties,
        jb4dcAuthorityProperties
    },
    props: ["propElemProperties"],
    data: function () {
        return {
            bpmn: PODefinition.GetDialogPropertiesPO().bpmn,
            camunda: PODefinition.GetDialogPropertiesPO().camunda,
            jb4dc: PODefinition.GetDialogPropertiesPO().jb4dc
        }
    },
    created() {
        //debugger;
        this.bpmn = this.propElemProperties.bpmn;
        this.camunda = this.propElemProperties.camunda;
        this.jb4dc = this.propElemProperties.jb4dc;
        console.log(this.propElemProperties);
    },
    mounted() {
        flowBpmnJsIntegrated=FlowBpmnJsIntegrated.GetInstance();
    },
    beforeDestroy() {
    },
    methods: {
        changeInnerTimeType() {
        },
        changeInnerEventType() {
        },
        getValue() {
            this.$refs.jb4dcAuthorityProperties.rebuildJB4DData();
            var result = {
                bpmn: this.bpmn,
                camunda: this.camunda,
                jb4dc: this.jb4dc
            };
            return result;
        },
        changeTab: function (name) {
            if (name == "authorityTabPane") {
                var formId = flowBpmnJsIntegrated.TryGetFormId(this.jb4dc.jb4dcFormId);
                this.$refs.jb4dcAuthorityProperties.rebuildUIData(formId);
            }
            console.log(name);
        }
    }
}
</script>

<style scoped>

</style>