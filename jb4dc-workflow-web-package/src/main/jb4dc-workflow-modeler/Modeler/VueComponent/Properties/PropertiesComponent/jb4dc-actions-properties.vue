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
                <tabs name="add-action-properties-inner-dialog-tabs">
                    <tab-pane tab="add-action-properties-inner-dialog-tabs" label="动作设置">
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
                                        <radio-group type="button" style="margin: auto" v-model="innerDetailInfo.actionShowOpinionDialog">
                                            <radio label="true">是</radio>
                                            <radio label="false">否</radio>
                                        </radio-group>
                                    </td>
                                </tr>
                                <tr>
                                    <td>HTML ID：</td>
                                    <td>
                                        <input type="text" v-model="innerDetailInfo.actionHTMLId" />
                                    </td>
                                    <td>HTML Class：</td>
                                    <td colspan="2">
                                        <input type="text" v-model="innerDetailInfo.actionHTMLClass" />
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="5">备注：</td>
                                </tr>
                                <tr>
                                    <td colspan="5" style="background-color: #ffffff">
                                        <textarea rows="4" v-model="innerDetailInfo.actionDescription"></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="5">显示条件：</td>
                                </tr>
                                <tr>
                                    <td colspan="4" style="background-color: #ffffff">
                                        <textarea rows="3" v-model="innerDetailInfo.actionDisplayCondition"></textarea>
                                    </td>
                                    <td style="background-color: #f8f8f8">
                                        <Button type="primary" @click="beginEditContextJuelForActionDisplayCondition">编辑</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </tab-pane>
                    <tab-pane tab="add-action-properties-inner-dialog-tabs" label="数据设置">
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
                                    <td colspan="5" style="line-height: 23px">
                                        更改字段值：
                                        <div style="float: right;">
                                            <button-group>
                                                <i-button size="small" type="success" icon="md-add" @click="addUpdateField"></i-button>
                                                <i-button size="small" type="primary" icon="md-close" @click="removeUpdateField"></i-button>
                                            </button-group>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="5" style="background-color: #ffffff">
                                        <div id="actionDialogFieldContainer" class="edit-table-wrap" style="height: 350px;overflow: auto;width: 98%;margin: auto"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </tab-pane>
                    <tab-pane tab="add-action-properties-inner-dialog-tabs" label="JS/API设置">
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
                                <td colspan="5">调用JS方法：</td>
                            </tr>
                            <tr>
                                <td colspan="5" style="background-color: #ffffff">
                                    <textarea rows="6" v-model="innerDetailInfo.actionCallJsMethod"></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="5" style="line-height: 23px">
                                    调用API：
                                    <div style="float: right;">
                                        <button-group>
                                            <i-button size="small" type="success" icon="md-add" @click="addAPI"></i-button>
                                            <i-button size="small" type="primary" icon="md-close" @click="removeAPI"></i-button>
                                        </button-group>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="5" style="background-color: #ffffff">

                                    <div id="actionDialogAPISContainer" class="edit-table-wrap" style="height: 174px;overflow: auto;width: 98%;margin: auto"></div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
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
                    actionShowOpinionDialog:"false",
                    actionDescription:"",
                    actionDisplayCondition:"",
                    actionCallJsMethod:"",
                    actionHTMLId:"",
                    actionHTMLClass:"",
                    actionUpdateFields:"",
                    actionCallApis:""
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
                                Renderer:"EditTable_SelectDefaultValue"
                            }
                        ],
                        RowIdCreater: function () {
                        },
                        TableClass: "edit-table",
                        RendererTo: "actionDialogFieldContainer",
                        TableId: "fieldContainerTable",
                        TableAttrs: {cellpadding: "1", cellspacing: "1", border: "1"}
                    }
                },
                api:{
                    editTableObject:null,
                    editTableConfig:{
                        Status: "Edit",
                        AddAfterRowEvent: null,
                        DataField: "fieldName",
                        Templates: [
                            {
                                Title: "调用API",
                                BindName: "apiValue",
                                Renderer: "EditTable_Select",
                                ClientDataSource: [{"Text": "测试1", "Value": "test1"}, {"Text": "测试2", "Value": "test2"}],
                            }
                        ],
                        RowIdCreater: function () {
                        },
                        TableClass: "edit-table",
                        RendererTo: "actionDialogAPISContainer",
                        TableId: "apiContainerTable",
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
            flowBpmnJsIntegrated=FlowBpmnJsIntegrated.GetInstance();
            var _self=this;
            EditTable_SelectDefaultValue.ClickSelectedButtonCB=function () {
                _self.beginSelectDefaultValue();
            }
            DialogUtility.DialogElemObj(_self.$refs.addActionDialog,{
                title:"新增动作",
                width:850,
                height:560,
                modal:true,
                buttons: {
                    "确认": function () {
                        _self.field.editTableObject.CompletedEditingRow();
                        _self.api.editTableObject.CompletedEditingRow();
                        var actionUpdateFields=_self.field.editTableObject.GetAllRowData();
                        var actionCallApis=_self.api.editTableObject.GetAllRowData();
                        actionUpdateFields=EditTable.Delete___UndefinedTextProp(actionUpdateFields);
                        actionCallApis=EditTable.Delete___UndefinedTextProp(actionCallApis);
                        /*function a(allRowJson){
                            for (var i = 0; i < allRowJson.length; i++) {
                                for (var key in allRowJson[i]) {
                                    if(key.indexOf("___Text")>0){
                                        if(allRowJson[i][key]==undefined||allRowJson[i][key]=="undefined") {
                                            delete allRowJson[i][key];
                                        }
                                    }
                                }
                            }
                            return allRowJson;
                        }*/

                        console.log(actionUpdateFields);
                        console.log(actionCallApis);
                        _self.addedActionData.push({
                            actionType:_self.innerDetailInfo.actionType,
                            actionCode:_self.innerDetailInfo.actionCode,
                            actionCaption:_self.innerDetailInfo.actionCaption,
                            actionShowOpinionDialog:"false",
                            actionDescription:"",
                            actionDisplayCondition:"",
                            actionCallJsMethod:"",
                            actionHTMLId:"",
                            actionHTMLClass:"",
                            actionUpdateFields:"",
                            actionCallApis:""
                        });
                        DialogUtility.CloseDialogElem(_self.$refs.addActionDialog);
                    },
                    "取消": function () {
                        DialogUtility.CloseDialogElem(_self.$refs.addActionDialog);
                    }
                }
            },null,{},this);
            $(this.$refs.addActionDialog).dialog("close");
        },
        methods:{
            beginSelectDefaultValue(){
                //console.log(this.propFromId);
                //var _self=this;
                this.$refs.selectDefaultValueDialog.beginSelectDefaultValue("设置默认值",this.innerDetailInfo.actionDisplayCondition,function(result){
                    //console.log(result);
                    EditTable_SelectDefaultValue.SetSelectEnvVariableResultValue(result);
                    //_self.innerDetailInfo.actionDisplayCondition=result;
                });
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
                $(this.$refs.addActionDialog).dialog("open");
                //$(this.$refs.addActionDialog).dialog("option", "title", dialogTitle );

                //console.log(window.flowBpmnJsIntegrated);
                this.bindEditTable_TableFields();
                this.bindEditTable_APIs();
            },
            bindEditTable_APIs(oldData){
                if (!this.api.editTableObject) {
                    this.api.editTableObject = Object.create(EditTable);
                    this.api.editTableObject.Initialization(this.api.editTableConfig);
                }
            },
            addAPI(){
                this.api.editTableObject.AddEditingRowByTemplate();
            },
            removeAPI(){
                this.api.editTableObject.RemoveRow();
            },
            bindEditTable_TableFields(oldData) {
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
            addUpdateField(){
                this.field.editTableObject.AddEditingRowByTemplate();
            },
            removeUpdateField(){
                this.field.editTableObject.RemoveRow();
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