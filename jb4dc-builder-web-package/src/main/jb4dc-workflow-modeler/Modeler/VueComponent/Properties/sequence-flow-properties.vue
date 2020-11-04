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
                            <textarea ref="txtSequenceFlowConditionEditValue" rows="1"></textarea>
                        </td>
                        <td rowspan="2">
                            <Button type="primary" @click="beginEditContextJuelForSequenceFlowCondition">编辑</Button>
                            <Button type="success" @click="clearEditContextJuelForSequenceFlowCondition" style="margin-top: 8px">清空</Button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="background-color: #ffffff">
                            <textarea v-model="bpmn.conditionExpression" disabled row="2" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" style="background-color: #ffffff">
                            <div style="height: 190px;width: 100%;overflow-y: auto;overflow-x: hidden;margin: auto">
                                <div class="sfp-task-action-group">
                                    <div class="sfp-tag-task-name" style="border-bottom: #1dc116 1px solid;background-color: #f3f3f3;border-radius:0px">前置环节</div>
                                    <div class="sfp-tag-task-action-inner-group" style="border-bottom: #1dc116 1px solid;padding: 4px;text-align: center;background-color: #f3f3f3">环节动作</div>
                                </div>
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
        <contextVarJuelEditDialog ref="contextVarJuelEditDialog"></contextVarJuelEditDialog>
    </div>
</template>

<script>
    import taskGeneralProperties from "./PropertiesComponent/task-general-properties.vue";
    import listenersProperties from "./PropertiesComponent/listeners-properties.vue";
    import extensionsProperties from "./PropertiesComponent/extensions-properties.vue";
    import jb4dcGeneralProperties from "./PropertiesComponent/jb4dc-general-properties.vue";
    import jb4dcActionsProperties from "./PropertiesComponent/jb4dc-actions-properties.vue";
    import contextVarJuelEditDialog from "./Dialog/context-var-juel-edit-dialog.vue";
    import { PODefinition } from "../BpmnJsExtend/PODefinition.js"
    import { BpmnJsUtility } from '../BpmnJsExtend/BpmnJsUtility';
    import { FlowBpmnJsIntegrated } from '../BpmnJsExtend/FlowBpmnJsIntegrated';
    import { CodeMirrorUtility } from '../BpmnJsExtend/CodeMirrorUtility';
    var flowBpmnJsIntegrated=null;
    export default {
        name: "sequence-flow-properties",
        components: {
            taskGeneralProperties,
            listenersProperties,
            extensionsProperties,
            jb4dcGeneralProperties,
            jb4dcActionsProperties,
            contextVarJuelEditDialog
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
        mounted() {
            this.selectedCodeMirror = CodeMirror.fromTextArea(this.$refs.txtSequenceFlowConditionEditValue, {
                mode: "text/x-sql",
                lineWrapping: true,
                foldGutter: true,
                theme: "monokai"
            });
            this.selectedCodeMirror.setSize("100%", 56);
            var doc = this.selectedCodeMirror.getDoc();
            doc.setValue(this.bpmn.conditionExpression);
            var resolveMark = CodeMirrorUtility.TryResolveCodeMirrorValueToMarkText(this.selectedCodeMirror, this.$refs.txtSequenceFlowConditionEditValue,this.mayBeFromTaskList);
            this.jb4dc.jb4dcSequenceFlowConditionEditText=resolveMark.editText;
            flowBpmnJsIntegrated = FlowBpmnJsIntegrated.GetInstance();
        },
        created(){
            this.bpmn=this.propElemProperties.bpmn;
            this.camunda=this.propElemProperties.camunda;
            this.jb4dc=this.propElemProperties.jb4dc;
            this.mayBeFromTaskList=BpmnJsUtility.JB4DC_TryGetMayBeActionsBySequenceFlowId(FlowBpmnJsIntegrated.GetInstance().GetModeler(),this.bpmn.id);
            console.log(this.mayBeFromTaskList);
            //console.log(this.bpmn.id);
            //console.log();
        },
        methods:{
            insertCodeAtCursor(mayBeFromTask,action) {
                var editValue = "LastAction=${FlowAction." + mayBeFromTask.taskId + "." + action.actionCode + '}';
                var doc = this.selectedCodeMirror.getDoc();
                var cursor = doc.getCursor();
                doc.replaceRange(editValue, cursor);
                var editResult=CodeMirrorUtility.TryResolveCodeMirrorValueToMarkText(this.selectedCodeMirror,this.$refs.txtSequenceFlowConditionEditValue,this.mayBeFromTaskList);
                this.jb4dc.jb4dcSequenceFlowConditionEditText=editResult.editText;
                this.bpmn.conditionExpression=editResult.editValue;
                //#region
                /*var defaultValue="${FlowAction.Task_1uhc294.action_613177548}${FlowAction.UserTask_0wq4xdg.action_613177548}12${FlowAction.UserTask_0wq4xdg.action_612991045}3${FlowAction.UserTask_0nrtkgj.action_613177548}";
                this.selectedCodeMirror.getDoc().setValue(defaultValue);

                var reg = new RegExp("\\$\\{[^\\}]*\\}","g");
                var result="";
                var doc = this.selectedCodeMirror.getDoc();
                while ((result = reg.exec(defaultValue)) != null)  {
                    var text=result.toString();
                    console.log(text);
                    var cursor = this.selectedCodeMirror.getSearchCursor(text);
                    cursor.findNext();
                    var htmlNode = document.createElement("span");
                    htmlNode.innerText="hello";
                    htmlNode.className="hello";
                    doc.markText(cursor.from(), {line: cursor.to().line,ch: cursor.to().ch}, {
                        replacedWith: htmlNode
                    });
                }
                console.log(doc.getValue());
                var text = $(this.$refs.txtSequenceFlowConditionEditText).next().find(".CodeMirror-code").text();
                console.log(text);
                return;

                var doc = this.selectedCodeMirror.getDoc();
                var cursor = doc.getCursor();
                console.log(cursor);

                var code="${FlowAction."+mayBeFromTask.taskId+"."+action.actionCode+"}";
                doc.replaceRange(code, cursor);

                var htmlNode = document.createElement("span");
                htmlNode.innerText="hello";
                htmlNode.className="hello";
                doc.markText({line: cursor.line,ch: cursor.ch}, {line: cursor.line,ch: cursor.ch + code.length}, {
                    replacedWith: htmlNode
                });

                console.log(doc.getValue());
                return;

                var lineNumber = 0;
                var charNumber = 0;
                var snippet = "[[tag]]"
                this.selectedCodeMirror.doc.replaceRange(snippet, {line:lineNumber, from: charNumber});
                var htmlNode = document.createElement("span");
                htmlNode.innerText="hello";
                htmlNode.className="hello";

                this.selectedCodeMirror.doc.markText({line: lineNumber,ch: charNumber}, {line: lineNumber,ch: charNumber + snippet.length}, {
                    replacedWith: htmlNode
                });

                console.log(cursor);
                console.log(this.selectedCodeMirror.doc.getValue());
                return;
                var code="${FlowAction."+mayBeFromTask.taskId+"."+mayBeFromTask.taskName+"."+action.actionCode+"}";
                var doc = this.selectedCodeMirror.getDoc();
                var cursor = doc.getCursor();
                var object=doc.setBookmark(cursor);
                console.log(object);
                doc.replaceRange(code, cursor);
                console.log(doc.getSelection());*/
                //#endregion
            },
            tryResolveConditionTextToValue(conditionText){

            },
            clearEditContextJuelForSequenceFlowCondition(){
                this.bpmn.conditionExpression="";
                var doc = this.selectedCodeMirror.getDoc();
                doc.setValue("");
            },
            beginEditContextJuelForSequenceFlowCondition(){
                var _self=this;
                var formId=flowBpmnJsIntegrated.TryGetFormId("");
                this.$refs.contextVarJuelEditDialog.beginEditContextJuel("编辑执行条件",this.bpmn.conditionExpression,formId,function(result){
                    _self.jb4dc.jb4dcSequenceFlowConditionEditText=result.editText;
                    _self.bpmn.conditionExpression=result.editValue;
                    var doc = _self.selectedCodeMirror.getDoc();
                    doc.setValue(_self.bpmn.conditionExpression);
                    CodeMirrorUtility.TryResolveCodeMirrorValueToMarkText(_self.selectedCodeMirror,_self.$refs.txtSequenceFlowConditionEditValue);
                });
            },
            getValue(){
                var result= {
                    bpmn:this.bpmn,
                    camunda:this.camunda,
                    jb4dc:this.jb4dc
                };
                //result.bpmn.jb4dcSequenceFlowConditionEditText =
                return result;
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