<template>
    <div>
        <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
            <colgroup>
                <col style="width: 9%" />
                <col style="width: 91%" />
            </colgroup>
            <tbody>
            <tr>
                <td rowspan="2">完成条件：</td>
                <td>
                    <textarea ref="txtCompletionConditionCodeMirror" rows="1"></textarea>
                </td>
            </tr>
            <tr>
                <td>
                    <Button type="info" @click="insertCodeAtCursor('${nrOfCompletedInstances/nrOfInstances >= 0.99 }')">完成率99%</Button>
                    <Button type="info" @click="insertCodeAtCursor('${nrOfCompletedInstances/nrOfInstances >= 0.01 }')">完成率1%</Button>
                    <Button type="info" @click="clearCode()">清空</Button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import {CodeMirrorUtility} from "../../BpmnJsExtend/CodeMirrorUtility";

export default {
    name: "multi-instance-completion-condition-properties",
    props:["propBpmnGeneralData"],
    data(){
        return {
            bpmn:{},
            completionConditionCodeMirror:null
        }
    },
    mounted() {
        this.bpmn = this.propBpmnGeneralData;
        this.completionConditionCodeMirror = CodeMirror.fromTextArea(this.$refs.txtCompletionConditionCodeMirror, {
            mode: "text/x-sql",
            lineWrapping: true,
            foldGutter: true,
            theme: "monokai"
        });
        this.completionConditionCodeMirror.setSize("100%", 100);
        this.completionConditionCodeMirror.setValue(this.bpmn.multiInstanceLoopCharacteristics.completionCondition);

        this.completionConditionCodeMirror.on("change", (instance, e) => {
            //console.log(instance);
            //this.selectedCodeMirror=instance;
            this.bpmn.multiInstanceLoopCharacteristics.completionCondition = instance.getValue();
        });
        //this.insertCodeAtCursor("");
    },
    methods:{
        insertCodeAtCursor(editValue) {
            var doc = this.completionConditionCodeMirror.getDoc();

            var cursor = doc.getCursor();
            doc.replaceRange(editValue, cursor);

            //this.propBpmnGeneralData.multiInstanceLoopCharacteristics.completionCondition=this.completionConditionCodeMirror.setValue("");
            //CodeMirrorUtility.TryResolveCodeMirrorValueToMarkText(this.selectedCodeMirror,this.$refs.txtContextVarJuelEdit)
        },
        clearCode(){
            this.completionConditionCodeMirror.setValue("");
        }
        /*,
        getValue(){
            //debugger;
            return this.completionConditionCodeMirror.getValue();
        }*/
    }
}
</script>

<style scoped>

</style>