<template>
    <div>
        <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
            <colgroup>
                <col style="width: 14%" />
                <col style="width: 36%" />
                <col style="width: 15%" />
                <col style="width: 35%" />
            </colgroup>
            <tbody>
                <tr>
                    <td>环节ID：</td>
                    <td>
                        <input placeholder="bpmn.id" type="text" v-model="bpmn.id" disabled="disabled" />
                    </td>
                    <td>环节名称：</td>
                    <td>
                        <input placeholder="bpmn.name" type="text" v-model="bpmn.name" />
                    </td>
                </tr>
                <tr>
                    <td>处理类型：</td>
                    <td>
                        <radio-group type="button" style="margin: auto" v-model="innerMultiInstanceLoopCharacteristicsType" @on-change="changeMultiInstanceLoopCharacteristicsType">
                            <radio label="single">单人</radio>
                            <radio label="multiInstanceIsParallel">多人并行</radio>
                            <radio label="multiInstanceIsSequential">多人串行</radio>
                        </radio-group>
                    </td>
                    <td></td>
                    <td>
                    </td>
                </tr>
                <tr>
                    <td>接收用户：</td>
                    <td>
                        <input placeholder="camunda.assignee" type="text" v-model="camunda.assignee" />
                    </td>
                    <td>优先级：</td>
                    <td>
                        <input placeholder="camunda.priority" type="text" v-model="camunda.priority" />
                    </td>
                </tr>
                <tr>
                    <td>用户集合：</td>
                    <td>
                        <input placeholder="bpmn.multiInstanceLoopCharacteristics.camunda.collection" type="text" v-model="bpmn.multiInstanceLoopCharacteristics.collection" />
                    </td>
                    <td>用户变量名：</td>
                    <td>
                        <input placeholder="bpmn.multiInstanceLoopCharacteristics.camunda.elementVariable" type="text" v-model="bpmn.multiInstanceLoopCharacteristics.elementVariable" />
                    </td>
                </tr>
                <tr>
                    <td>候选用户：</td>
                    <td colspan="3">
                        <div style="float: left;width: 92%">
                            <tag type="border" color="success" v-for="(item,index) in jb4dc.jb4dcCandidateUsersDesc.split(',')" :key="index">{{item}}</tag>
                        </div>
                        <div style="float: right;width: 7%">
                            <Button type="primary" @click="beginSelectUser">选择</Button>
                        </div>
                        <!--<input placeholder="camunda.candidateUser" type="text" v-model="camunda.candidateUsers" />-->
                    </td>
                </tr>
                <tr>
                    <td>候选分组：</td>
                    <td colspan="3">
                        <div style="float: left;width: 92%">
                            <tag type="border" color="success" v-for="(item,index) in jb4dc.jb4dcCandidateGroupsDesc.split(',')" :key="index">{{item}}</tag>
                        </div>
                        <div style="float: right;width: 7%">
                            <Button type="primary" @click="beginSelectRole">选择</Button>
                        </div>
                        <!--<input placeholder="camunda.candidateGroups" type="text" v-model="camunda.candidateGroups" />
                        <Button type="primary" @click="randomId">选择</Button>-->
                    </td>
                </tr>
                <tr>
                    <td>到期日期：</td>
                    <td>
                        <input placeholder="camunda.dueDate" type="text" v-model="camunda.dueDate" />
                    </td>
                    <td>跟进日期：</td>
                    <td>
                        <input placeholder="camunda.followUpDate" type="text" v-model="camunda.followUpDate" />
                    </td>
                </tr>
                <tr>
                    <td>说明：</td>
                    <td colspan="3">
                        <textarea placeholder="bpmn.documentation" rows="3" v-model="bpmn.documentation"></textarea>
                    </td>
                </tr>
            </tbody>
        </table>
        <selectRoleDialog ref="selectRoleDialog"></selectRoleDialog>
        <selectUserDialog ref="selectUserDialog"></selectUserDialog>
    </div>
</template>

<script>
    import selectRoleDialog from "../Dialog/select-role-dialog.vue";
    import selectUserDialog from "../Dialog/select-user-dialog.vue";



    export default {
        name: "task-general-properties",
        props:["propBpmnGeneralData","propCamundaGeneralData","propJb4dcGeneralData"],
        components: {
            selectRoleDialog,
            selectUserDialog
        },
        watch:{
            /*innerMultiInstanceLoopCharacteristicsType: function (newValue, oldValue) {
                if(newValue==""){

                }
            }*/
        },
        data(){
            return {
                innerMultiInstanceLoopCharacteristicsType:"single",
                bpmn:{
                    multiInstanceLoopCharacteristics:{}
                },
                camunda:{},
                jb4dc:{
                    jb4dcCandidateUsersDesc:"",
                    jb4dcCandidateGroupsDesc:""
                }
            }
        },
        mounted() {
            this.bpmn = this.propBpmnGeneralData;
            this.camunda = this.propCamundaGeneralData;
            this.jb4dc = this.propJb4dcGeneralData

            //console.log(this.bpmn);
            if (this.bpmn.multiInstanceLoopCharacteristics.loopCharacteristics=="true" && this.bpmn.multiInstanceLoopCharacteristics.isSequential=="true") {
                this.innerMultiInstanceLoopCharacteristicsType = "multiInstanceIsSequential";
            } else if (this.bpmn.multiInstanceLoopCharacteristics.loopCharacteristics=="true") {
                this.innerMultiInstanceLoopCharacteristicsType = "multiInstanceIsParallel";
            }

            this.tryAutoSetAssignee();
        },
        methods:{
            tryAutoSetAssignee:function () {
                var assigneeVar = "${" + this.bpmn.id + "_Assignee_User}";
                //var assigneeExp="${"+assigneeVar+"}";

                if (this.camunda.assignee) {
                    assigneeVar = this.camunda.assignee;
                }

                var assigneeListExp = "${" + assigneeVar + "_List}";

                this.camunda.assignee = assigneeVar;
                if (this.bpmn.multiInstanceLoopCharacteristics.loopCharacteristics == "true") {
                    if (!this.bpmn.multiInstanceLoopCharacteristics.collection) {
                        this.bpmn.multiInstanceLoopCharacteristics.collection = assigneeListExp;
                    }
                    if (!this.bpmn.multiInstanceLoopCharacteristics.elementVariable) {
                        this.bpmn.multiInstanceLoopCharacteristics.elementVariable = assigneeVar.replace("${","").replace("}","");
                    }
                } else {
                    this.bpmn.multiInstanceLoopCharacteristics.collection = "";
                    this.bpmn.multiInstanceLoopCharacteristics.elementVariable = "";
                }
            },
            changeMultiInstanceLoopCharacteristicsType:function (type){
                //console.log(type);
                if(type=="single"){
                    this.bpmn.multiInstanceLoopCharacteristics.loopCharacteristics="false";
                }
                else if(type=="multiInstanceIsParallel"){
                    this.bpmn.multiInstanceLoopCharacteristics.loopCharacteristics="true";
                    this.bpmn.multiInstanceLoopCharacteristics.isSequential="false";
                }
                else if(type=="multiInstanceIsSequential"){
                    this.bpmn.multiInstanceLoopCharacteristics.loopCharacteristics="true";
                    this.bpmn.multiInstanceLoopCharacteristics.isSequential="true";
                }

                this.tryAutoSetAssignee();
            },
            beginSelectUser(){
                this.$refs.selectUserDialog.beginSelectUser("选择候选用户","",(selectedUserArray)=>{
                    var userIdS=[];
                    var userPaths=[];
                    for (let i = 0; i < selectedUserArray.length; i++) {
                        userIdS.push(selectedUserArray[i].userId);
                        userPaths.push(selectedUserArray[i].userPath);
                    }
                    //this.startRoleArray=selectedRoleArray;
                    this.camunda.candidateUsers=userIdS.join(",");
                    this.jb4dc.jb4dcCandidateUsersDesc=userPaths.join(",");
                });
            },
            beginSelectRole(){
                this.$refs.selectRoleDialog.beginSelectRole("选择候选角色-只支持全局","",(selectedRoleArray)=>{
                    var roleIdS=[];
                    var rolePaths=[];
                    for (let i = 0; i < selectedRoleArray.length; i++) {
                        roleIdS.push(selectedRoleArray[i].roleId);
                        rolePaths.push(selectedRoleArray[i].rolePath);
                    }
                    //this.startRoleArray=selectedRoleArray;
                    this.camunda.candidateGroups=roleIdS.join(",");
                    this.jb4dc.jb4dcCandidateGroupsDesc=rolePaths.join(",");
                });
            }
        }
    }
</script>

<style scoped>

</style>