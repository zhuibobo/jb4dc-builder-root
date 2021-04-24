<template>
    <div>
        <tabs name="user-task-properties-tabs" @on-click="changeTab">
            <tab-pane tab="user-task-properties-tabs" label="基础设置">
                <userTaskGeneralProperties :prop-bpmn-general-data="bpmn" :prop-camunda-general-data="camunda" :prop-jb4dc-general-data="jb4dc"></userTaskGeneralProperties>
            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="多实例完成条件">
                <multiInstanceCompletionConditionProperties ref="multiInstanceCompletionConditionProperties" :prop-bpmn-general-data="bpmn"></multiInstanceCompletionConditionProperties>
            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="绑定设置">
                <jb4dcGeneralProperties ref="jb4dcGeneralProperties" :prop-jb4dc-general-data="jb4dc" :prop-is-process="false"></jb4dcGeneralProperties>
            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="动作设置">
                <jb4dcActionsProperties ref="jb4dcActionsProperties" :prop-bpmn-general-data="bpmn" :prop-jb4dc-general-data="jb4dc" :prop-from-id="jb4dc.jb4dcFormId" :prop-action-data="jb4dc.jb4dcActions.actions"></jb4dcActionsProperties>
            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="主送">
                <jb4dcMainReceiveObjectProperties ref="jb4dcMainReceiveObjectProperties" :prop-receive-objects-data="jb4dc.jb4dcMainReceiveObjects"></jb4dcMainReceiveObjectProperties>
            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="抄送">
                <jb4dcCCReceiveObjectProperties ref="jb4dcCCReceiveObjectProperties" :prop-receive-objects-data="jb4dc.jb4dcCCReceiveObjects"></jb4dcCCReceiveObjectProperties>
            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="权限设置" name="authorityTabPane">
                <jb4dcAuthorityProperties ref="jb4dcAuthorityProperties" :prop-jb4dc-general-data="jb4dc"></jb4dcAuthorityProperties>
            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="执行监听">
                <listenersProperties ref="listenersProperties" :prop-listener-data="camunda.executionListener"></listenersProperties>
            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="任务监听">
                <listenersProperties ref="listenersProperties" :prop-listener-data="camunda.taskListener"></listenersProperties>
            </tab-pane>
            <tab-pane tab="user-task-properties-tabs" label="扩展属性">
                <extensionsProperties ref="extensionsProperties" :prop-extensions-properties-data="camunda.extensionProperties"></extensionsProperties>
            </tab-pane>
        </tabs>
    </div>
</template>

<script>
    import userTaskGeneralProperties from "./PropertiesComponent/user-task-general-properties.vue";
    import listenersProperties from "./PropertiesComponent/listeners-properties.vue";
    import extensionsProperties from "./PropertiesComponent/extensions-properties.vue";
    import jb4dcGeneralProperties from "./PropertiesComponent/jb4dc-general-properties.vue";
    import jb4dcActionsProperties from "./PropertiesComponent/jb4dc-actions-properties.vue";
    import jb4dcMainReceiveObjectProperties from "./PropertiesComponent/jb4dc-receive-object-properties.vue";
    import jb4dcCCReceiveObjectProperties from "./PropertiesComponent/jb4dc-receive-object-properties.vue";
    import jb4dcAuthorityProperties from "./PropertiesComponent/jb4dc-authority-properties.vue";
    import multiInstanceCompletionConditionProperties from "./PropertiesComponent/multi-instance-completion-condition-properties.vue";
    import { PODefinition } from "../BpmnJsExtend/PODefinition.js"
    import { FlowBpmnJsIntegrated } from '../BpmnJsExtend/FlowBpmnJsIntegrated.js';
    var flowBpmnJsIntegrated=null;

    export default {
        name: "user-task-properties",
        components: {
            userTaskGeneralProperties,
            listenersProperties,
            extensionsProperties,
            jb4dcGeneralProperties,
            jb4dcActionsProperties,
            jb4dcMainReceiveObjectProperties,
            jb4dcCCReceiveObjectProperties,
            jb4dcAuthorityProperties,
            multiInstanceCompletionConditionProperties
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
            flowBpmnJsIntegrated=FlowBpmnJsIntegrated.GetInstance();
        },
        beforeDestroy(){

        },
        methods: {
            getValue() {
                this.$refs.jb4dcAuthorityProperties.rebuildJB4DData();
                var result = {
                    bpmn: this.bpmn,
                    camunda: this.camunda,
                    jb4dc: this.jb4dc
                };
                return result;
            },
            changeTab:function (name){
                if(name=="authorityTabPane"){
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