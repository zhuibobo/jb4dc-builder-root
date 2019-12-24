<template>
    <div>
        <div id="list-button-wrap" class="wf-list-button-outer-wrap">
            <div class="list-button-inner-wrap">
                <button-group>
                    <i-button type="success" @click="showAddActionDialog" icon="md-add"> </i-button>
                    <i-button type="primary" @click="move('up')" icon="md-arrow-up" disabled>  </i-button>
                    <i-button type="primary" @click="move('down')" icon="md-arrow-down" disabled>  </i-button>
                </button-group>
            </div>
            <div style="clear: both"></div>
        </div>
        <i-table border :columns="addedActionConfig" :data="addedActionData"
                 class="iv-list-table" size="small" no-data-text="add listeners" height="420">
            <template slot-scope="{ row, index }" slot="action">
                <div class="wf-list-font-icon-button-class" @click="deleteAction(index,row)">
                    <Icon type="md-close" />
                </div>
            </template>
        </i-table>
        <div ref="addActionDialog" style="display: none">
            <div>
                <tabs name="addAction-dialog-tabs">
                    <tab-pane tab="addAction-dialog-tabs" label="动作设置">
                        <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                            <colgroup>
                                <col style="width: 12%" />
                                <col style="width: 38%" />
                                <col style="width: 12%" />
                                <col style="width: 32%" />
                                <col style="width: 6%" />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <td>类型：</td>
                                    <td>
                                        <Select v-model="innerDetailInfo.actionType" style="width:300px">
                                            <Option value="send">发送</Option>
                                            <Option value="temporaryStorage">暂存</Option>
                                        </Select>
                                    </td>
                                    <td>编号：</td>
                                    <td colspan="2">
                                        <input type="text" v-model="innerDetailInfo.actionCode" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>标题：</td>
                                    <td>
                                        <input type="text" v-model="innerDetailInfo.actionCaption" />
                                    </td>
                                    <td>弹出意见框：</td>
                                    <td colspan="2">
                                        <radio-group type="button" style="margin: auto" v-model="innerDetailInfo.showOpinionDialog">
                                            <radio label="true">是</radio>
                                            <radio label="false">否</radio>
                                        </radio-group>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="5">备注：</td>
                                </tr>
                                <tr>
                                    <td colspan="5" style="background-color: #ffffff">
                                        <textarea rows="6" v-model="innerDetailInfo.actionDescription"></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="5">显示条件：</td>
                                </tr>
                                <tr>
                                    <td colspan="4" style="background-color: #ffffff">
                                        <textarea rows="4" v-model="innerDetailInfo.actionDisplayCondition"></textarea>
                                    </td>
                                    <td style="background-color: #f8f8f8">
                                        <Button type="primary" @click="beginEditContextJuelForActionDisplayCondition">编辑</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </tab-pane>
                    <tab-pane tab="addAction-dialog-tabs" label="数据设置">
                        <div style="float: right;margin: 10px;">
                            <button-group>
                                <i-button type="success" icon="md-add" @click="addUpdateField"></i-button>
                                <i-button type="primary" icon="md-close" @click="removeUpdateField"></i-button>
                            </button-group>
                        </div>
                        <div id="fieldContainer" class="edit-table-wrap" style="height: 320px;overflow: auto;width: 98%;margin: auto"></div>
                    </tab-pane>
                    <tab-pane tab="addAction-dialog-tabs" label="API设置">

                    </tab-pane>
                    <tab-pane tab="addAction-dialog-tabs" label="备注">

                    </tab-pane>
                </tabs>

            </div>
        </div>
        <contextVarJuelEditDialog ref="contextVarJuelEditDialog"></contextVarJuelEditDialog>
        <selectDefaultValueDialog ref="selectDefaultValueDialog"></selectDefaultValueDialog>
    </div>
</template>

<script>
    import contextVarJuelEditDialog from "../Dialog/context-var-juel-edit-dialog.vue";
    import selectDefaultValueDialog from "../Dialog/select-default-value-dialog.vue";
    import { FlowBpmnJsIntegrated } from '../../BpmnJsExtend/FlowBpmnJsIntegrated.js';
    import {RemoteUtility} from '../../../Remote/RemoteUtility';
    //import EditTable_SelectDefaultValue from  '../../../EditTable/Renderers/EditTable_SelectDefaultValue.js';

    var flowBpmnJsIntegrated=null;
    export default {
        name: "jb4dc-actions-properties",
        components: {
            contextVarJuelEditDialog,
            selectDefaultValueDialog
        },
        props:["propActionData","propFromId"],
        data(){
            return {
                innerDetailInfo:{
                    actionType:"send",
                    actionCode:"action_"+StringUtility.Timestamp(),
                    actionCaption:"确认",
                    showOpinionDialog:"false",
                    actionDescription:"",
                    actionDisplayCondition:""
                },
                field:{
                    editTableObject:null,
                    editTableConfig:{
                        Status: "Edit",
                        AddAfterRowEvent: null,
                        DataField: "fieldName",
                        Templates: [
                            {
                                Title: "表名标题",
                                BindName: "tableName",
                                Renderer: "EditTable_Label"
                            }, {
                                Title: "字段标题",
                                BindName: "fieldName",
                                Renderer: "EditTable_Select"
                            },{
                                Title:"设置值",
                                BindName:"defaultValue",
                                Renderer:"EditTable_SelectDefaultValue",
                                Hidden:false
                            }
                        ],
                        RowIdCreater: function () {
                        },
                        TableClass: "edit-table",
                        RendererTo: "fieldContainer",
                        TableId: "fieldContainerTable",
                        TableAttrs: {cellpadding: "1", cellspacing: "1", border: "1"}
                    }
                },
                addedActionConfig:[
                    {
                        title: '编号',
                        key: 'actionCode',
                        align: "center",
                    },
                    {
                        title: '标题',
                        key: 'actionCaption',
                        align: "center",
                    },
                    {
                        title: '类型',
                        key: 'actionType',
                        align: "center"
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 120,
                        align: "center"
                    }
                ],
                addedActionData:[

                ]
            }
        },
        mounted(){
            //this.addedActionData=this.propActionData;
            //this.addActionDialogId="addActionDialogId_"+StringUtility.GuidSplit("");
            flowBpmnJsIntegrated=FlowBpmnJsIntegrated.GetInstance();

            var _self=this;
            EditTable_SelectDefaultValue.ClickSelectedButtonCB=function () {
                _self.beginSelectDefaultValue();
            }
        },
        methods:{
            beginSelectDefaultValue(){
                //console.log(this.propFromId);
                //var _self=this;
                this.$refs.selectDefaultValueDialog.beginSelectDefaultValue("设置默认值",this.innerDetailInfo.actionDisplayCondition,function(result){
                    console.log(result);
                    EditTable_SelectDefaultValue.SetSelectEnvVariableResultValue(result);
                    //_self.innerDetailInfo.actionDisplayCondition=result;
                });
            },
            addUpdateField(){
                this.field.editTableObject.AddEditingRowByTemplate();
            },
            removeUpdateField(){
                this.field.editTableObject.RemoveRow();
            },
            beginEditContextJuelForActionDisplayCondition(){
                //console.log(this.propFromId);
                var _self=this;
                var formId=flowBpmnJsIntegrated.TryGetFormId(this.propFromId);
                this.$refs.contextVarJuelEditDialog.beginEditContextJuel("编辑显示条件",this.innerDetailInfo.actionDisplayCondition,formId,function(result){
                    _self.innerDetailInfo.actionDisplayCondition=result;
                });
            },
            showAddActionDialog(){
                var _self=this;
                //var dialogElemId=this.addActionDialogId;
                this.innerDetailInfo.javaClass="";
                DialogUtility.DialogElemObj(this.$refs.addActionDialog,{
                    title:"新增动作",
                    width:850,
                    height:560,
                    modal:true,
                    buttons: {
                        "确认": function () {
                            _self.addedActionData.push({
                                eventName:_self.innerDetailInfo.eventType,
                                listenerType:_self.innerDetailInfo.listenerType,
                                value:_self.innerDetailInfo.value
                            });
                            DialogUtility.DestroyByElemId(dialogElemId);
                        },
                        "取消": function () {
                            DialogUtility.DestroyByElemId(dialogElemId);
                        }
                    }
                },null,{},this);

                //console.log(window.flowBpmnJsIntegrated);
                this.bindTableFields();
            },
            bindTableFields:function(oldData) {
                //if(this.oldFormId!=this.formId) {
                var formId=flowBpmnJsIntegrated.TryGetFormId(this.propFromId);
                RemoteUtility.GetFormResourceBindMainTable(formId).then((tablePO)=>{
                        //console.log(result);
                        var fieldsData = [];

                        if(tablePO) {
                            for (var i = 0; i < tablePO.tableFieldPOList.length; i++) {
                                fieldsData.push({
                                    Value: tablePO.tableFieldPOList[i].fieldName,
                                    Text: tablePO.tableFieldPOList[i].fieldCaption
                                });
                            }
                            this.field.editTableConfig.Templates[0].DefaultValue = {
                                Type: "Const",
                                Value: tablePO.tableName
                            };

                            this.field.editTableConfig.Templates[1].ClientDataSource = fieldsData;

                            if (!this.field.editTableObject) {
                                this.field.editTableObject = Object.create(EditTable);
                                this.field.editTableObject.Initialization(this.field.editTableConfig);
                            }
                        }
                        this.oldFormId = this.formId;
                        if(oldData){
                            this.field.editTableObject.LoadJsonData(oldData);
                        }
                });
                //}
                if(this.field.editTableObject){
                    this.field.editTableObject.RemoveAllRow();
                }
                if(oldData&&this.field.editTableObject){
                    this.field.editTableObject.LoadJsonData(oldData);
                }
            },
            deleteAction(index,row){
                this.addedActionData.splice(index, 1);
            },
            move(type){

            },
            getHostResultProperties(){
                return this.addedActionData;
            }
        }
    }
</script>

<style scoped>

</style>