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
                        <td rowspan="3">绑定条件：</td>
                        <td colspan="3">
                            <textarea ref="txtSequenceFlowConditionEditText" v-model="jb4dc.jb4dcProcessTitle" rows="1"></textarea>
                        </td>
                        <td rowspan="2">
                            <Button type="primary" @click="beginEditContextJuelForFlowProcessTitle">编辑</Button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="background-color: #ffffff">
                            <textarea v-model="bpmn.name" disabled row="2" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" style="background-color: #ffffff">
                            <div style="height: 190px;width: 100%;overflow-y: auto;overflow-x: hidden;margin: auto">
                                <div class="sfp-task-action-group" v-for="mayBeFromTask in mayBeFromTaskList">
                                    <div class="sfp-tag-task-name">{{mayBeFromTask.taskName}}</div>
                                    <div class="sfp-tag-task-action-inner-group">
                                        <div class="sfp-tag-task-action" v-for="action in mayBeFromTask.actionArray" @click="insertCodeAtCursor(mayBeFromTask,action)">{{action.actionCaption}}</div>
                                    </div>
                                </div>
                                <!--<div class="sfp-task-action-group">
                                    <div class="sfp-tag-task-name">TaskName</div>
                                    <div class="sfp-tag-task-action-inner-group">
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName age ok </div>
                                        <div class="sfp-tag-task-action">actionName data date</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName vue</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName age ok </div>
                                        <div class="sfp-tag-task-action">actionName data date</div>
                                        <div class="sfp-tag-task-action">actionName data date</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName vue</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName age ok </div>
                                    </div>
                                </div>
                                <div class="sfp-task-action-group">
                                    <div class="sfp-tag-task-name">TaskName</div>
                                    <div class="sfp-tag-task-action-inner-group">
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName age ok </div>
                                        <div class="sfp-tag-task-action">actionName data date</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName vue</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName age ok </div>
                                        <div class="sfp-tag-task-action">actionName data date</div>
                                        <div class="sfp-tag-task-action">actionName data date</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName vue</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName age ok </div>
                                    </div>
                                </div>
                                <div class="sfp-task-action-group">
                                    <div class="sfp-tag-task-name">TaskName</div>
                                    <div class="sfp-tag-task-action-inner-group">
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName age ok </div>
                                        <div class="sfp-tag-task-action">actionName data date</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName vue</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName age ok </div>
                                        <div class="sfp-tag-task-action">actionName data date</div>
                                        <div class="sfp-tag-task-action">actionName data date</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName vue</div>
                                        <div class="sfp-tag-task-action">actionName</div>
                                        <div class="sfp-tag-task-action">actionName age ok </div>
                                    </div>
                                </div>-->
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Documentation：</td>
                        <td colspan="4">
                            <textarea rows="2" v-model="bpmn.documentation"></textarea>
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
                mayBeFromTaskList:[],
                selectedCodeMirror:null
            }
        },
        mounted(){
            this.selectedCodeMirror = CodeMirror.fromTextArea(this.$refs.txtSequenceFlowConditionEditText, {
                mode: "text/x-sql",
                lineWrapping: true,
                foldGutter: true,
                theme: "monokai"
            });
            this.selectedCodeMirror.setSize("100%", 56);
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
            insertCodeAtCursor(mayBeFromTask,action){
                console.log(mayBeFromTask);
                console.log(action);
                var code="${FlowAction."+mayBeFromTask.taskId+"."+mayBeFromTask.taskName+"."+action.actionCode+"}";
                var doc = this.selectedCodeMirror.getDoc();
                var cursor = doc.getCursor();
                doc.replaceRange(code, cursor);
            },
            beginEditContextJuelForFlowProcessTitle(){
            }
        }
    }
</script>

<style scoped>
    .sfp-task-action-group{
        border-radius: 4px;
        /*border: #a3b0c9 solid 1px;*/
        float: left;
        padding: 4px;
        clear: left;
        width: 100%;
        margin-bottom: 8px;
        padding: 4px 4px 0px 4px;
    }

    .sfp-task-action-group .sfp-tag-task-name{
        float: left;
        border-radius: 4px;
        padding: 4px;
        width: 10%;
    }

    .sfp-task-action-group .sfp-tag-task-action-inner-group{
        float: left;
        width: 89%;
    }


    .sfp-task-action-group .sfp-tag-task-action{
        float: left;
        border-radius: 4px;
        border: #a3b0c9 solid 1px;
        padding: 4px;
        margin-left: 6px;
        margin-bottom: 4px;
        min-width: 134px;
        text-align: center;
    }

    .sfp-task-action-group .sfp-tag-task-action:hover{
        background-color: #2d8cf0;
        color: #fff;
        cursor: pointer;
    }
</style>