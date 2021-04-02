<template>
    <div>
        <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
            <colgroup>
                <col style="width: 14%" />
                <col style="width: 86%" />
            </colgroup>
            <tbody>
                <tr>
                    <td>implementation：</td>
                    <td colspan="3">
                        <radio-group type="button" style="margin: auto" v-model="implementationType" @on-change="changeImplementationType">
                            <radio label="java class">Java Class</radio>
                            <radio label="expression" disabled>Expression</radio>
                            <radio label="delegate expression" disabled>Delegate Expression</radio>
                            <radio label="external">External</radio>
                            <radio label="connector" disabled>Connector</radio>
                        </radio-group>
                    </td>
                </tr>
                <tr v-if="implementationType=='java class'">
                    <td>Java Class</td>
                    <td>
                        <input placeholder="camunda.class" type="text" v-model="camunda.class" />
                        <div style="margin-top: 8px">
                            <tag type="border" color="success">继承接口org.camunda.bpm.engine.delegate.JavaDelegate</tag>
                        </div>
                    </td>
                </tr>
                <tr v-if="implementationType=='external'">
                    <td>Topic</td>
                    <td>
                        <input placeholder="camunda.topic" type="text" v-model="camunda.topic" />
                        <div style="margin-top: 8px">
                            <tag type="border" color="success">通过外部服务获取该主题并锁定任务进行处理驱动,请使用英文,意义明确,唯一的主题</tag>
                            <br />
                            <pre>
List&lt;LockedExternalTask&gt; lockTasks = processEngine.getExternalTaskService().fetchAndLock(10, "externalWorkerId1")
.topic("AddressValidation", 2L * 1000L)
.execute();
LockedExternalTask lockedExternalTask=lockTasks.get(0);
processEngine.getExternalTaskService().complete(lockedExternalTask.getId(),"externalWorkerId2",vars);
                            </pre>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>说明：</td>
                    <td colspan="3">
                        <textarea placeholder="bpmn.documentation" rows="10" v-model="bpmn.documentation"></textarea>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: "implementation-properties",
    props:["propBpmnGeneralData","propCamundaGeneralData","propJb4dcGeneralData"],
    data(){
        return {
            implementationType:"java class",
            bpmn:{},
            camunda:{},
            jb4dc:{}
        }
    },
    mounted() {
        this.bpmn = this.propBpmnGeneralData;
        this.camunda = this.propCamundaGeneralData;
        this.jb4dc = this.propJb4dcGeneralData

        //console.log(this.camunda);
        this.implementationType=this.camunda.type;
        if(this.camunda.type==""){
            this.implementationType="java class";
        }
    },
    methods:{
        changeImplementationType(){
            if(this.implementationType=="external"){
                this.camunda.type="external";
            }
        }
    }
}
</script>

<style scoped>

</style>