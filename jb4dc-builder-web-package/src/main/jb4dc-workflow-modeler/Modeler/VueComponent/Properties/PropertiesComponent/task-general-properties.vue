<template>
    <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
        <colgroup>
            <col style="width: 18%" />
            <col style="width: 32%" />
            <col style="width: 18%" />
            <col style="width: 32%" />
        </colgroup>
        <tbody>
        <tr>
            <td>ID：</td>
            <td>
                <input type="text" v-model="bpmn.id" disabled="disabled" />
            </td>
            <td>Name：</td>
            <td>
                <input type="text" v-model="bpmn.name" />
            </td>
        </tr>
        <tr>
            <td>Assignee：</td>
            <td>
                <input type="text" v-model="camunda.assignee" />
            </td>
            <td>Priority：</td>
            <td>
                <input type="text" v-model="camunda.priority" />
            </td>
        </tr>
        <tr>
            <td>Candidate Users：</td>
            <td>
                <input type="text" v-model="camunda.candidateUsers" />
            </td>
            <td>Candidate Groups：</td>
            <td>
                <input type="text" v-model="camunda.candidateGroups" />
            </td>
        </tr>
        <tr>
            <td>Due Date：</td>
            <td>
                <input type="text" v-model="camunda.dueDate" />
            </td>
            <td>Follow Up Date：</td>
            <td>
                <input type="text" v-model="camunda.followUpDate" />
            </td>
        </tr>
        <tr>
            <td>Element Documentation：</td>
            <td colspan="3">
                <textarea rows="13" v-model="bpmn.documentation"></textarea>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    export default {
        name: "task-general-properties",
        props:["propBpmnGeneralData","propCamundaGeneralData"],
        data(){
            return {
                bpmn:{},
                camunda:{}
            }
        },
        mounted() {
            this.bpmn=this.propBpmnGeneralData;
            this.camunda=this.propCamundaGeneralData;
        }
    }
</script>

<style scoped>

</style>