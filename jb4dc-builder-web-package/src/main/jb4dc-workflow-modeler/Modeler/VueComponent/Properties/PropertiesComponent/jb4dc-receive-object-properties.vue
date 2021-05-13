<template>
    <div>
        <div>
            <div style="float: left;width: 100%" class="wf-list-button-outer-wrap">
            <div style="float: right;margin-right: 10px;" class="list-button-inner-wrap">
                <i-menu mode="horizontal" active-name="1-1" class="list-button-inner-menu" @on-select="addReceiveObjectType">
                    <submenu name="1-1">
                        <template slot="title">添加接收人类型</template>
                        <menu-group title="设置接收人">
                            <menu-item name="addUser">添加用户</menu-item>
                            <menu-item name="addOrgan">添加组织</menu-item>
                            <menu-item name="addRole">添加角色</menu-item>
                            <menu-item name="addFlowAboutUser">流程相关人员</menu-item>
                            <menu-item name="addExcludeUser">排除指定用户</menu-item>
                            <menu-item name="addAPI">API</menu-item>
                        </menu-group>
                    </submenu>
                </i-menu>
            </div>
            <div style="float: right;height: 30px;line-height: 30px;margin-right: 10px">如果设置了候选人,则优先使用候选人设置</div>
        </div>
            <div style="float: left;width: 100%;margin-top: 4px">
            <i-table border :columns="receiveObjectTableConfig" :data="receiveObjectTableData"
                     class="iv-list-table" size="small" no-data-text="add listeners" height="400">
                <template slot-scope="{ row, index }" slot="receiveGroupName">
                    <Input v-model="receiveObjectTableData[index].receiveObjectGroupName" placeholder="使用默认值" style="width: 120px" size="small" />
                </template>
                <template slot-scope="{ row, index }" slot="receiveObjectText">
                    <div v-html="receiveObjectTextFormat(row)">
                    </div>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <div class="wf-list-font-icon-button-class" @click="deleteReceiveObject(index,row)">
                        <Icon type="md-close" />
                    </div>
                </template>
            </i-table>
        </div>
        </div>
        <selectRoleDialog ref="selectRoleDialog"></selectRoleDialog>
        <selectUserDialog ref="selectUserDialog"></selectUserDialog>
        <selectOrganDialog ref="selectOrganDialog"></selectOrganDialog>
        <selectFlowAboutUserDialog ref="selectFlowAboutUserDialog"></selectFlowAboutUserDialog>
    </div>
</template>

<script>
    import {PODefinition} from "../../BpmnJsExtend/PODefinition";
    import selectRoleDialog from "../Dialog/select-role-dialog.vue";
    import selectUserDialog from "../Dialog/select-user-dialog.vue";
    import selectOrganDialog from "../Dialog/select-organ-dialog.vue";
    import selectFlowAboutUserDialog from "../Dialog/select-flow-about-user-dialog.vue";

    export default {
        name: "jb4dc-receive-object-properties",
        props:["propElemProperties","propReceiveObjectsData"],
        components: {
            selectRoleDialog,
            selectUserDialog,
            selectOrganDialog,
            selectFlowAboutUserDialog
        },
        data:function () {
            return {
                receiveObjectTableConfig:[
                    {
                        title: '类型',
                        key: 'receiveObjectType',
                        align: "center",
                        width: 130
                    },
                    {
                        title: '分组名称',
                        slot: 'receiveGroupName',
                        align: "center",
                        key: 'receiveObjectGroupName',
                        width: 160
                    },
                    {
                        title: '接收对象',
                        slot: 'receiveObjectText',
                        key: 'receiveObjectText',
                        align: "left"
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 70,
                        align: "center"
                    }
                ],
                receiveObjectTableData:[]
            }
        },
        created(){
        },
        mounted() {
            for (let i = 0; i < this.propReceiveObjectsData.length; i++) {
                if(!this.propReceiveObjectsData[i].receiveObjectGroupName){
                    this.propReceiveObjectsData[i].receiveObjectGroupName = "";
                }
            }
            this.receiveObjectTableData = this.propReceiveObjectsData;
            /*console.log("555555555");
            window.setInterval( ()=>{
                console.log(this.receiveObjectTableData);
            },2000);*/
        },
        beforeDestroy(){

        },
        methods: {
            receiveObjectTextFormat:function (row){
                return row.receiveObjectText.split(",").join("<br />");
            },
            newReceiverObjectRow(type,value,text,config) {
                var receiveObject = JsonUtility.CloneStringify(PODefinition.GetJB4DCReceiveObjectPO());
                receiveObject.receiveObjectType = type;
                receiveObject.receiveObjectValue = value;
                receiveObject.receiveObjectText = text;
                receiveObject.receiveObjectConfig = config;
                receiveObject.receiveObjectGroupName="";
                return receiveObject;
            },
            addToReceiveObjectTableData:function(receiverObjectRow){
                this.receiveObjectTableData.push(receiverObjectRow);
            },
            addReceiveObjectType(name) {
                if(name=="addUser"){
                    this.addUser();
                }
                else if(name=="addOrgan"){
                    this.addOrgan();
                }
                else if(name=="addRole"){
                    this.addRole();
                }
                else if(name=="addFlowAboutUser"){
                    this.addFlowAboutUser();
                }
                else if(name=="addExcludeUser"){
                    this.addExcludeUser();
                }
                else if(name=="addAPI"){
                    this.addAPI();
                }
            },
            addUser(){
                this.$refs.selectUserDialog.beginSelectUser("选择用户","",(selectedUserArray)=>{
                    var userIdS=[];
                    var userPaths=[];
                    for (let i = 0; i < selectedUserArray.length; i++) {
                        userIdS.push(selectedUserArray[i].userId);
                        userPaths.push(selectedUserArray[i].userPath);
                    }
                    this.addToReceiveObjectTableData(this.newReceiverObjectRow("Users",userIdS.join(","),userPaths.join(","),""));
                });
            },
            addOrgan(){
                this.$refs.selectOrganDialog.beginSelectOrgan("选择组织","",(selectedOrganArray)=>{
                    var organIdS=[];
                    var organPaths=[];
                    for (let i = 0; i < selectedOrganArray.length; i++) {
                        organIdS.push(selectedOrganArray[i].organId);
                        organPaths.push(selectedOrganArray[i].organPath);
                    }
                    this.addToReceiveObjectTableData(this.newReceiverObjectRow("Organs",organIdS.join(","),organPaths.join(","),""));
                });
            },
            addRole(){
                this.$refs.selectRoleDialog.beginSelectRole("选择角色","",(selectedRoleArray,roleFilterConfig)=>{
                    var roleIdS=[];
                    var rolePaths=[];
                    for (let i = 0; i < selectedRoleArray.length; i++) {
                        roleIdS.push(selectedRoleArray[i].roleId);
                        rolePaths.push(selectedRoleArray[i].rolePath);
                    }
                    //console.log(roleFilterConfig);
                    this.addToReceiveObjectTableData(this.newReceiverObjectRow("Role",roleIdS.join(","),rolePaths.join(","),roleFilterConfig));
                });
            },
            addFlowAboutUser(){
                this.$refs.selectFlowAboutUserDialog.beginSelectFlowAboutUser("选择流程相关人员","",(selectData)=>{
                    //console.log(selectData);
                    this.addToReceiveObjectTableData(this.newReceiverObjectRow(selectData.type,selectData.value,selectData.text,selectData.config));
                });
                //DialogUtility.ToastMessage(this,"未实现!");
            },
            addExcludeUser(){
                this.$refs.selectUserDialog.beginSelectUser("选择排除用户","",(selectedUserArray)=>{
                    var userIdS=[];
                    var userPaths=[];
                    for (let i = 0; i < selectedUserArray.length; i++) {
                        userIdS.push(selectedUserArray[i].userId);
                        userPaths.push(selectedUserArray[i].userPath);
                    }
                    this.addToReceiveObjectTableData(this.newReceiverObjectRow("ExcludeUsers",userIdS.join(","),userPaths.join(","),""));
                });
            },
            addAPI(){
                DialogUtility.ToastMessage(this,"未实现!");
            },
            deleteReceiveObject(index,row){
                this.receiveObjectTableData.splice(index, 1);
            },
            setReceiveObjectTableData(receiveObjectTableData){
                this.receiveObjectTableData=receiveObjectTableData;
            },
            getReceiveObjectTableData(){
                return this.receiveObjectTableData;
            }
        }
    }
</script>

<style scoped>

</style>