<template>
    <div>
        <tabs name="process-properties-tabs">
            <tab-pane tab="process-properties-tabs" label="基础设置">
                <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                    <colgroup>
                        <col style="width: 14%" />
                        <col style="width: 36%" />
                        <col style="width: 15%" />
                        <col style="width: 35%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td style="color: red">启动键：</td>
                            <td>
                                <input type="text" placeholder="ID (Start Key) 必须唯一" v-model="bpmn.id" style="width:230px" />
                                <Button type="primary" @click="randomId">随机生成</Button>
                            </td>
                            <td>可执行/IsExecutable：</td>
                            <td style="text-align: left">
                                <radio-group type="button" style="margin: auto" v-model="bpmn.isExecutable">
                                    <radio label="true">是</radio>
                                    <radio label="false">否</radio>
                                </radio-group>
                            </td>
                        </tr>
                        <tr>
                            <td>名称：</td>
                            <td>
                                <input placeholder="Name" type="text" v-model="bpmn.name" />
                            </td>
                            <td>版本：</td>
                            <td>
                                <input placeholder="Version Tag" type="text" v-model="camunda.versionTag" />
                            </td>
                        </tr>
                        <tr>
                            <td>流程类别：</td>
                            <td>
                                <Select v-model="jb4dc.jb4dcFlowCategory">
                                    <Option value="通用流程">通用流程</Option>
                                    <Option value="公文收文流程">公文收文流程</Option>
                                    <Option value="公文发文流程">公文发文流程</Option>
                                    <Option value="行政审批流程">行政审批流程</Option>
                                    <Option value="行政许可流程">行政许可流程</Option>
                                    <Option value="社区服务流程">社区服务流程</Option>
                                </Select>
                            </td>
                            <td>
                                Tenant Id：
                            </td>
                            <td colspan="2">
                                <input type="text" v-model="jb4dc.jb4dcTenantId" />
                            </td>
                        </tr>
                        <tr>
                            <td>分组设置：</td>
                            <td>
                                <div style="float: left;width: 82%">
                                    <tag type="border" color="success" v-for="item in jb4dc.jb4dcProcessModelGroups">{{item.groupName}}</tag>
                                </div>
                                <div style="float: right;width: 17%">
                                    <Button type="primary" @click="beginSelectGroup">选择</Button>
                                </div>
                            </td>
                            <td>图标：</td>
                            <td>
                                <div style="float: left;width: 82%">
                                    <i :class="jb4dc.jb4dcProcessModelImageClass" style="width: 32px;height: 32px;font-size: 32px;"></i>
                                </div>
                                <div style="float: right;width: 17%">
                                    <Button type="primary" @click="beginSelectImageClass">选择</Button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>任务优先级：</td>
                            <td>
                                <input placeholder="Task Priority" type="text" v-model="camunda.taskPriority" disabled="disabled" />
                            </td>
                            <td>工作优先级：</td>
                            <td>
                                <input placeholder="Job Priority" type="text" v-model="camunda.jobPriority" disabled="disabled" />
                            </td>
                        </tr>
                        <tr>
                            <td>启动角色：</td>

                            <td colspan="3">
                                <div style="float: left;width: 92%">
                                    <tag type="border" color="success" v-for="item in jb4dc.jb4dcProcessCandidateStarterGroups">{{item.rolePath}}</tag>
                                </div>
                                <div style="float: right;width: 7%">
                                    <Button type="primary" @click="beginSelectRole('Starter')">选择</Button>
                                </div>

                            </td>
                        </tr>
                        <tr>
                            <td>启动用户：</td>
                            <td colspan="3">
                                <div style="float: left;width: 92%">
                                    <tag type="border" color="success" v-for="item in jb4dc.jb4dcProcessCandidateStarterUsers">{{item.userPath}}</tag>
                                </div>
                                <div style="float: right;width: 7%">
                                    <Button type="primary" @click="beginSelectUser('Starter')">选择</Button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>历史记录存活时间：</td>
                            <td>
                                <input type="text" placeholder="History Time To Live" v-model="camunda.historyTimeToLive" disabled="disabled" />
                            </td>
                            <td>
                                发送前确认：
                            </td>
                            <td>
                                <radio-group type="button" style="margin: auto" v-model="jb4dc.jb4dcProcessActionConfirm">
                                    <radio label="true">是</radio>
                                    <radio label="false">否</radio>
                                </radio-group>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="绑定设置">
                <jb4dcGeneralProperties ref="jb4dcGeneralProperties" :prop-jb4dc-general-data="jb4dc"></jb4dcGeneralProperties>
            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="通知设置">

            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="管理设置">
                <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                    <colgroup>
                        <col style="width: 14%" />
                        <col style="width: 36%" />
                        <col style="width: 15%" />
                        <col style="width: 35%" />
                    </colgroup>
                    <tbody>
                    <tr>
                        <td>允许重启</td>
                        <td>
                            <radio-group type="button" style="margin: auto" v-model="jb4dc.jb4dcProcessRestartEnable">
                                <radio label="true">是</radio>
                                <radio label="false">否</radio>
                            </radio-group>
                        </td>
                        <td>任意跳转</td>
                        <td>
                            <radio-group type="button" style="margin: auto" v-model="jb4dc.jb4dcProcessAnyJumpEnable">
                                <radio label="true">是</radio>
                                <radio label="false">否</radio>
                            </radio-group>
                        </td>
                    </tr>
                    <tr>
                        <td>管理角色：</td>
                        <td colspan="3">
                            <div style="float: left;width: 92%">
                                <tag type="border" color="success" v-for="item in jb4dc.jb4dcProcessModelManagerGroups">{{item}}</tag>
                            </div>
                            <div style="float: right;width: 7%">
                                <Button type="primary" @click="beginSelectRole('Manager')">选择</Button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>管理用户：</td>
                        <td colspan="3">
                            <div style="float: left;width: 92%">
                                <tag type="border" color="success" v-for="item in jb4dc.jb4dcProcessModelManagerUsers">{{item}}</tag>
                            </div>
                            <div style="float: right;width: 7%">
                                <Button type="primary" @click="beginSelectUser('Manager')">选择</Button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="流程备注">
                <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                    <colgroup>
                        <col style="width: 14%" />
                        <col style="width: 36%" />
                        <col style="width: 15%" />
                        <col style="width: 35%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>备注：</td>
                            <td colspan="3">
                                <textarea rows="23" placeholder="Element Documentation" v-model="bpmn.documentation"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="CMA-Execution-Listeners">
                <listenersProperties ref="listenersProperties" :prop-listener-data="camunda.executionListener"></listenersProperties>
            </tab-pane>
            <tab-pane tab="process-properties-tabs" label="CMA-Extensions">
                <extensionsProperties ref="extensionsProperties" :prop-extensions-properties-data="camunda.extensionProperties"></extensionsProperties>
            </tab-pane>
        </tabs>
        <selectRoleDialog ref="selectRoleDialog"></selectRoleDialog>
        <selectUserDialog ref="selectUserDialog"></selectUserDialog>
        <selectFlowGroupDialog ref="selectFlowGroupDialog"></selectFlowGroupDialog>
    </div>
</template>

<script>
    import listenersProperties from "./PropertiesComponent/listeners-properties.vue";
    import extensionsProperties from "./PropertiesComponent/extensions-properties.vue";
    import jb4dcGeneralProperties from "./PropertiesComponent/jb4dc-general-properties.vue";
    import { PODefinition } from "../BpmnJsExtend/PODefinition.js";
    import selectRoleDialog from "./Dialog/select-role-dialog.vue";
    import selectUserDialog from "./Dialog/select-user-dialog.vue";
    import selectFlowGroupDialog from "./Dialog/select-flow-group-dialog.vue";

    export default {
        name: "process-properties",
        components: {
            listenersProperties,
            extensionsProperties,
            jb4dcGeneralProperties,
            selectRoleDialog,
            selectUserDialog,
            selectFlowGroupDialog
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
            this.bpmn=this.propElemProperties.bpmn;
            this.camunda=this.propElemProperties.camunda;
            this.jb4dc=this.propElemProperties.jb4dc;
            if(!this.jb4dc.jb4dcTenantId){
                this.jb4dc.jb4dcTenantId="JBuild4DC-Tenant";
            }
            if(!this.jb4dc.jb4dcFlowCategory){
                this.jb4dc.jb4dcFlowCategory="通用流程";
            }
        },
        mounted(){

        },
        methods:{
            randomId(){
                this.bpmn.id="Flow_Model_"+StringUtility.Timestamp();
            },
            beginSelectRole(toType){
                this.$refs.selectRoleDialog.beginSelectRole("选择角色-只支持全局","",(selectedRoleArray)=>{
                    var roleIdS=[];
                    //var rolePaths=[];
                    for (let i = 0; i < selectedRoleArray.length; i++) {
                        roleIdS.push(selectedRoleArray[i].roleId);
                        //rolePaths.push(selectedRoleArray[i].rolePath);
                    }
                    if(toType=="Starter"){
                        this.camunda.candidateStarterGroups=roleIdS.join(",");
                        this.jb4dc.jb4dcProcessCandidateStarterGroups=JsonUtility.CloneStringify(selectedRoleArray);
                    }
                    else if(toType=="Manager"){
                        this.jb4dc.jb4dcProcessModelManagerGroups=JsonUtility.CloneStringify(selectedRoleArray);
                    }
                });
            },
            beginSelectUser(toType){
                this.$refs.selectUserDialog.beginSelectUser("选择用户","",(selectedUserArray)=>{
                    var userIdS=[];
                    //var userPaths=[];
                    for (let i = 0; i < selectedUserArray.length; i++) {
                        userIdS.push(selectedUserArray[i].userId);
                        //userPaths.push(selectedUserArray[i].userPath);
                    }
                    //this.startRoleArray=selectedRoleArray;
                    if(toType=="Starter") {
                        this.camunda.candidateStarterUsers = userIdS.join(",");
                        this.jb4dc.jb4dcProcessCandidateStarterUsers = JsonUtility.CloneStringify(selectedUserArray);
                    }
                    else if(toType=="Manager"){
                        this.jb4dc.jb4dcProcessModelManagerUsers=JsonUtility.CloneStringify(selectedUserArray);
                    }
                });
            },
            beginSelectGroup(){
                this.$refs.selectFlowGroupDialog.beginSelectGroup("选择流程分组","",(groupArray)=>{
                    this.jb4dc.jb4dcProcessModelGroups=JsonUtility.CloneStringify(groupArray);
                });
            },
            beginSelectImageClass(){
                if (!window["processPropertiesXXA"]) {
                    var _self = this;
                    window["processPropertiesXXA"] = {};
                    window["processPropertiesXXA"].selectImageClassEnd = function (className) {
                        //console.log(_self.jb4dc);
                        _self.jb4dc.jb4dcProcessModelImageClass=className;
                    };
                    window["processPropertiesXXA"].selectImageClassCancelEnd = function (className) {
                    };
                }
                DialogUtility.ShowSelectImageClassDialog({},"processPropertiesXXA.selectImageClassEnd","processPropertiesXXA.selectImageClassCancelEnd");
            },
            getValue(){
                var result= {
                    bpmn:this.bpmn,
                    camunda:this.camunda,
                    jb4dc:this.jb4dc
                };
                return result;
            }
        }
    }
</script>

<style scoped>

</style>