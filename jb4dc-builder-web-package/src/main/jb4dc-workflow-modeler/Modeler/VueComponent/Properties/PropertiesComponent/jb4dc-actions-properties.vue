<template>
    <div>
        <div id="list-button-wrap" class="wf-list-button-outer-wrap">
            <div style="float: left;height: 32px;line-height: 32px">
                输入意见绑定到字段：
                <Select style="width:400px" v-model="jb4dc.jb4dcActionsOpinionBindToField">
                    <Option v-for="item in actionBindToEnableFields" :value="item.fieldName" :key="item.fieldName">【{{ item.fieldCaption }}】{{ item.fieldName }}</Option>
                </Select>
            </div>
            <div style="float: left;height: 32px;line-height: 32px;margin-left: 10px">
                <i-input placeholder="输入意见绑定到控件ID" v-model="jb4dc.jb4dcActionsOpinionBindToElemId" type="text" />
            </div>
            <div class="list-button-inner-wrap">
                <button-group>
                    <i-button type="success" @click="showAddActionDialog(null)" icon="md-add"> </i-button>
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
                <div class="wf-list-font-icon-button-class" @click="editAction(index,row)">
                    <Icon type="md-settings" />
                </div>
            </template>
        </i-table>
        <div ref="addActionDialog" style="display: none">
            <div>
                <tabs name="add-action-properties-inner-dialog-tabs">
                    <tab-pane tab="add-action-properties-inner-dialog-tabs" label="动作设置">
                        <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                            <colgroup>
                                <col style="width: 14%" />
                                <col style="width: 40%" />
                                <col style="width: 12%" />
                                <col style="width: 34%" />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <td><span style="color: red">*</span> 标题：</td>
                                    <td>
                                        <input type="text" v-model="actionInnerDetailInfo.actionCaption" />
                                    </td>
                                    <td>编号：</td>
                                    <td>
                                        <input type="text" v-model="actionInnerDetailInfo.actionCode" disabled />
                                    </td>
                                </tr>
                                <tr>
                                    <td>类型：</td>
                                    <td>
                                        <Select v-model="actionInnerDetailInfo.actionType" style="width:200px">
                                            <Option value="send">发送</Option>
                                            <Option value="temporaryStorage">暂存</Option>
                                        </Select>
                                    </td>
                                    <td>弹出意见框：</td>
                                    <td>
                                        <radio-group type="button" style="margin: auto" v-model="actionInnerDetailInfo.actionShowOpinionDialog">
                                            <radio label="true">是</radio>
                                            <radio label="false">否</radio>
                                        </radio-group>
                                    </td>
                                </tr>
                                <tr>
                                    <td>HTML ID：</td>
                                    <td>
                                        <input type="text" v-model="actionInnerDetailInfo.actionHTMLId" />
                                    </td>
                                    <td>HTML Class：</td>
                                    <td>
                                        <input type="text" v-model="actionInnerDetailInfo.actionHTMLClass" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>发送前确认：</td>
                                    <td>
                                        <radio-group type="button" style="margin: auto" v-model="actionInnerDetailInfo.actionConfirm">
                                            <radio label="true">是</radio>
                                            <radio label="false">否</radio>
                                        </radio-group>
                                    </td>
                                    <td>验证规则：</td>
                                    <td>
                                        <Select v-model="actionInnerDetailInfo.actionValidate" style="width:200px">
                                            <Option value="notValidate">无</Option>
                                            <Option value="inputOpinion">必须填写意见</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>输入意见<br />绑定到字段：</td>
                                    <td>
                                        <i-select v-model="actionInnerDetailInfo.actionsOpinionBindToField">
                                            <Option v-for="item in actionBindToEnableFields" :value="item.fieldName" :key="item.fieldName">【{{ item.fieldCaption }}】{{ item.fieldName }}</Option>
                                        </i-select>
                                    </td>
                                    <td>
                                        绑定到控件：
                                    </td>
                                    <td>
                                        <input placeholder="输入意见绑定到控件ID" type="text" v-model="actionInnerDetailInfo.actionsOpinionBindToElemId" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>执行变量：</td>
                                    <td colspan="3" style="background-color: #ffffff">
                                        <div class="wf-list-button-outer-wrap" style="margin-top: 0px">
                                            <div class="list-button-inner-wrap">
                                                <button-group>
                                                    <i-button type="success" @click="showAddActionExecuteVariableDialog(null)" icon="md-add"> </i-button>
                                                    <i-button type="primary" icon="md-arrow-up" disabled>  </i-button>
                                                    <i-button type="primary" icon="md-arrow-down" disabled>  </i-button>
                                                </button-group>
                                            </div>
                                            <div style="clear: both"></div>
                                        </div>
                                        <i-table border :columns="addedActionExecuteVariableTableConfig" :data="addedActionExecuteVariableTableData"
                                                 class="iv-list-table" size="small" no-data-text="添加执行变量,可以通过执行变量控制流程走向!" height="200">
                                            <template slot-scope="{ row, index }" slot="action">
                                                <div class="wf-list-font-icon-button-class" @click="deleteActionExecuteVariable(index,row)">
                                                    <Icon type="md-close" />
                                                </div>
                                                <div class="wf-list-font-icon-button-class" @click="editActionExecuteVariable(index,row)">
                                                    <Icon type="md-settings" />
                                                </div>
                                            </template>
                                        </i-table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </tab-pane>
                    <tab-pane tab="add-action-properties-inner-dialog-tabs" label="显示条件">
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
                                    <td rowspan="2">显示条件：</td>
                                    <td colspan="3" style="background-color: #ffffff">
                                        <textarea rows="8" v-model="actionInnerDetailInfo.actionDisplayConditionEditText" disabled></textarea>
                                    </td>
                                    <td style="background-color: #f8f8f8" rowspan="2">
                                        <Button type="primary" @click="beginEditContextJuelForActionDisplayCondition">编辑</Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="background-color: #ffffff">
                                        <textarea rows="8" v-model="actionInnerDetailInfo.actionDisplayConditionEditValue" disabled></textarea>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </tab-pane>
                    <tab-pane tab="add-action-properties-inner-dialog-tabs" label="数据更新设置">
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
                                    <textarea rows="6" v-model="actionInnerDetailInfo.actionCallJsMethod"></textarea>
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
                    <tab-pane tab="add-action-properties-inner-dialog-tabs" label="备注">
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
                                    <td>备注：</td>
                                    <td colspan="4" style="background-color: #ffffff">
                                        <textarea rows="21" v-model="actionInnerDetailInfo.actionDescription"></textarea>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </tab-pane>
                </tabs>
            </div>
        </div>
        <div ref="addedActionExecuteVariableDialog" style="display: none">
            <div>
                <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                    <colgroup>
                        <col style="width: 18%" />
                        <col style="width: 82%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>编号：</td>
                            <td>
                                <input type="text" v-model="executeVariableInnerDetailInfo.actionExecuteVariableCode" disabled />
                            </td>
                        </tr>
                        <tr>
                            <td>类型：</td>
                            <td>
                                <radio-group type="button" style="margin: auto" v-model="executeVariableInnerDetailInfo.actionExecuteVariableType">
                                    <radio label="静态变量">静态变量</radio>
                                    <radio label="AIP变量">API变量</radio>
                                </radio-group>
                            </td>
                        </tr>
                        <tr>
                            <td>键：</td>
                            <td>
                                <input type="text" v-model="executeVariableInnerDetailInfo.actionExecuteVariableKey" />
                            </td>
                        </tr>
                        <tr>
                            <td>值：</td>
                            <td>
                                <input type="text" v-model="executeVariableInnerDetailInfo.actionExecuteVariableValue" />
                            </td>
                        </tr>
                        <tr>
                            <td>备注：</td>
                            <td>
                                <textarea rows="6" v-model="executeVariableInnerDetailInfo.actionExecuteVariableDesc"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
    import { PODefinition } from "../../BpmnJsExtend/PODefinition.js"
    //import EditTable_SelectDefaultValue from  '../../../EditTable/Renderers/EditTable_SelectDefaultValue.js';

    var flowBpmnJsIntegrated=null;
    export default {
        name: "jb4dc-actions-properties",
        components: {
            contextVarJuelEditDialog,
            selectDefaultValueDialog
        },
        props:["propActionData","propFromId","propJb4dcGeneralData"],
        watch: {
            actionOpinionBindToField: function (newVal) {
                // 必须是input
                this.$emit('input', newVal)
            }
        },
        data(){
            return {
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
                //动作内部使用详情属性
                actionInnerDetailInfo:PODefinition.GetJB4DCActionPO(),
                addedActionConfig:[
                    {
                        title: '编号',
                        key: 'actionCode',
                        width: 150,
                        align: "center"
                    },
                    {
                        title: '标题',
                        key: 'actionCaption',
                        align: "center",
                    },
                    {
                        title: '类型',
                        key: 'actionType',
                        align: "center",
                        width: 120
                    },
                    {
                        title: '弹出意见',
                        key: 'actionShowOpinionDialog',
                        align: "center",
                        width: 120
                    },
                    {
                        title: 'HTML ID',
                        key: 'actionHTMLId',
                        align: "center",
                        width: 120
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 120,
                        align: "center"
                    }
                ],
                addedActionData:[

                ],
                jb4dc:{
                    jb4dcActionsOpinionBindToField:"",
                    jb4dcActionsOpinionBindToElemId:""
                },
                formId:"",
                //执行变量内部使用详情属性
                executeVariableInnerDetailInfo:PODefinition.GetJB4DCActionExecuteVariablePO(),
                addedActionExecuteVariableTableConfig:[
                    {
                        title: '类型',
                        key: 'actionExecuteVariableType',
                        align: "center",
                        width: 90
                    },
                    {
                        title: '键',
                        key: 'actionExecuteVariableKey',
                        align: "center",
                        width: 160
                    },
                    {
                        title: '值',
                        key: 'actionExecuteVariableValue',
                        align: "center"
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 100,
                        align: "center"
                    }
                ],
                addedActionExecuteVariableTableData:[],
                actionBindToEnableFields:[]
            }
        },
        mounted(){
            this.jb4dc=this.propJb4dcGeneralData;
            this.addedActionData = this.propActionData;
            //this.actionOpinionBindToField=this.propActionsOpinionBindToField;
            //this.actionOpinionBindToElemId=this.propActionsOpinionBindToElemId;
            flowBpmnJsIntegrated=FlowBpmnJsIntegrated.GetInstance();
            var _self=this;
            EditTable_SelectDefaultValue.ClickSelectedButtonCB=function () {
                _self.beginSelectDefaultValue();
            }
            this.initAddActionDialog();
            this.initAddActionExecuteVariableDialog();
            this.initActionBindToEnableFields();
        },
        beforeDestroy(){
            //console.log("beforeDestroy");
            $("#actionDialogFieldContainer").remove();
            $("#actionDialogAPISContainer").remove();
        },
        methods:{
            beginSelectDefaultValue(){
                //console.log(this.propFromId);
                //var _self=this;
                this.$refs.selectDefaultValueDialog.beginSelectDefaultValue("设置默认值","",function(result){
                    //console.log(result);
                    EditTable_SelectDefaultValue.SetSelectEnvVariableResultValue(result);
                });
            },
            beginEditContextJuelForActionDisplayCondition(){
                //console.log(this.propFromId);
                var _self=this;
                var formId=flowBpmnJsIntegrated.TryGetFormId(this.propFromId);
                this.$refs.contextVarJuelEditDialog.beginEditContextJuel("编辑显示条件",this.actionInnerDetailInfo.actionDisplayConditionEditText,formId,function(result){
                    _self.actionInnerDetailInfo.actionDisplayConditionEditText=result.editText;
                    _self.actionInnerDetailInfo.actionDisplayConditionEditValue=result.editValue;
                });
            },
            initAddActionDialog(){
                var _self=this;
                DialogUtility.DialogElemObj(_self.$refs.addActionDialog,{
                    title:"新增动作",
                    width:850,
                    height:660,
                    modal:true,
                    buttons: {
                        "确认": function () {

                            if(_self.field.editTableObject) {
                                _self.actionInnerDetailInfo.actionUpdateFields = _self.field.editTableObject.GetAllRowDataExUndefinedTextProp();
                            }
                            else{
                                _self.actionInnerDetailInfo.actionUpdateFields =[];
                            }
                            _self.actionInnerDetailInfo.actionCallApis=_self.api.editTableObject.GetAllRowDataExUndefinedTextProp();
                            _self.actionInnerDetailInfo.actionExecuteVariables=_self.addedActionExecuteVariableTableData;
                            var cloneInnerDetailInfo=JsonUtility.CloneObjectProp(_self.actionInnerDetailInfo,function (key,sourcePropValue) {
                                if(key=="actionUpdateFields"||key=="actionCallApis"||key=="actionExecuteVariables"){
                                    return JsonUtility.JsonToString(sourcePropValue);
                                }
                            });
                            console.log(cloneInnerDetailInfo);
                            if(ArrayUtility.ExistReplaceItem(_self.addedActionData,cloneInnerDetailInfo,function (item) {
                                return item.actionCode==cloneInnerDetailInfo.actionCode
                            })){

                            }
                            else {
                                _self.addedActionData.push(cloneInnerDetailInfo);
                            }
                            DialogUtility.CloseDialogElem(_self.$refs.addActionDialog);
                        },
                        "取消": function () {
                            DialogUtility.CloseDialogElem(_self.$refs.addActionDialog);
                        }
                    }
                },null,{},this);
                $(this.$refs.addActionDialog).dialog("close");
            },
            showAddActionDialog(oldInnerDetailInfo){
                if(!oldInnerDetailInfo){
                    this.actionInnerDetailInfo=PODefinition.GetJB4DCActionPO();
                }
                else{
                    this.actionInnerDetailInfo=oldInnerDetailInfo;
                }
                //var _self=this;
                $(this.$refs.addActionDialog).dialog("open");
                //$(this.$refs.addActionDialog).dialog("option", "title", dialogTitle );

                this.bindEditTable_TableFields(this.actionInnerDetailInfo.actionUpdateFields);
                this.bindEditTable_APIs(this.actionInnerDetailInfo.actionCallApis);
                this.addedActionExecuteVariableTableData=this.actionInnerDetailInfo.actionExecuteVariables;
            },
            deleteAction(index,row){
                this.addedActionData.splice(index, 1);
            },
            editAction(index,row){
                console.log(row);
                var cloneInnerDetailInfo=JsonUtility.CloneObjectProp(row,function (key,sourcePropValue) {
                    if(key=="actionUpdateFields"||key=="actionCallApis"||key=="actionExecuteVariables"){
                        return JsonUtility.StringToJson(sourcePropValue);
                    }
                });
                console.log(cloneInnerDetailInfo);
                this.showAddActionDialog(cloneInnerDetailInfo);
            },
            move(type){

            },
            getHostResultProperties(){
                return this.addedActionData;
            },
            initActionBindToEnableFields(){
                //debugger;
                var formId=flowBpmnJsIntegrated.TryGetFormId(this.propFromId);
                if(formId) {
                    //var result
                    RemoteUtility.GetFormResourceBindMainTable(formId).then((tablePO)=>{
                        if(tablePO&&tablePO.tableFieldPOList){
                            //console.log(tablePO&&tablePO.tableFieldPOList);
                            this.actionBindToEnableFields=tablePO&&tablePO.tableFieldPOList;
                        }
                    });
                }
                else{
                    this.actionBindToEnableFields=[];
                }
            },
            //region 动作执行变量设置
            initAddActionExecuteVariableDialog(){
                var _self=this;
                //console.log("新增动作执行变量");
                DialogUtility.DialogElemObj(_self.$refs.addedActionExecuteVariableDialog,{
                    title:"新增动作执行变量",
                    width:650,
                    height:460,
                    modal:true,
                    buttons: {
                        "确认": function () {

                            var cloneExecuteVariableInnerDetailInfo=JsonUtility.CloneStringify(_self.executeVariableInnerDetailInfo);
                            //debugger;
                            //console.log(cloneExecuteVariableInnerDetailInfo);
                            if(ArrayUtility.ExistReplaceItem(_self.addedActionExecuteVariableTableData,cloneExecuteVariableInnerDetailInfo,function (item) {
                                return item.actionExecuteVariableCode==cloneExecuteVariableInnerDetailInfo.actionExecuteVariableCode
                            })){

                            }
                            else {
                                _self.addedActionExecuteVariableTableData.push(cloneExecuteVariableInnerDetailInfo);
                            }
                            DialogUtility.CloseDialogElem(_self.$refs.addedActionExecuteVariableDialog);
                        },
                        "取消": function () {
                            DialogUtility.CloseDialogElem(_self.$refs.addedActionExecuteVariableDialog);
                        }
                    }
                },null,{},this);
                $(this.$refs.addedActionExecuteVariableDialog).dialog("close");
            },
            showAddActionExecuteVariableDialog(oldExecuteVariableInnerDetailInfo){
                //debugger;
                if(!oldExecuteVariableInnerDetailInfo){
                    this.executeVariableInnerDetailInfo=PODefinition.GetJB4DCActionExecuteVariablePO();
                }
                else{
                    this.executeVariableInnerDetailInfo=oldExecuteVariableInnerDetailInfo;
                }
                $(this.$refs.addedActionExecuteVariableDialog).dialog("open");
            },
            deleteActionExecuteVariable(index,row){
                this.addedActionExecuteVariableTableData.splice(index, 1);
            },
            editActionExecuteVariable(index,row){
                var cloneExecuteVariableInnerDetailInfo=JsonUtility.CloneStringify(row);
                this.showAddActionExecuteVariableDialog(cloneExecuteVariableInnerDetailInfo);
            },
            //endregion
            //region API设置
            bindEditTable_APIs(oldData){
                if (!this.api.editTableObject) {
                    this.api.editTableObject = Object.create(EditTable);
                    this.api.editTableObject.Initialization(this.api.editTableConfig);
                }

                if(this.api.editTableObject){
                    this.api.editTableObject.RemoveAllRow();
                }
                if(oldData&&this.api.editTableObject){
                    this.api.editTableObject.LoadJsonData(oldData);
                }
            },
            addAPI(){
                this.api.editTableObject.AddEditingRowByTemplate();
            },
            removeAPI(){
                this.api.editTableObject.RemoveRow();
            },
            //endregion API设置
            //region 表字段设置
            bindEditTable_TableFields(oldData) {
                //debugger;
                var formId = flowBpmnJsIntegrated.TryGetFormId(this.propFromId);
                this.formId = formId;
                RemoteUtility.GetFormResourceBindMainTable(formId).then((tablePO) => {
                    var fieldsData = [];

                    if (tablePO) {
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

                        //this.oldFormId = this.formId;
                        if (oldData) {
                            this.field.editTableObject.LoadJsonData(oldData);
                        }
                    }
                });

                if (this.field.editTableObject) {
                    this.field.editTableObject.RemoveAllRow();
                }
                if (oldData && this.field.editTableObject) {
                    this.field.editTableObject.LoadJsonData(oldData);
                }
            },
            addUpdateField(){
                if(this.formId) {
                    this.field.editTableObject.AddEditingRowByTemplate();
                }
                else {
                    //this.$Message.info('请先设置绑定的窗体,需要根据绑定的窗体确定数据源表!');
                    DialogUtility.ToastMessage(this,'请先设置绑定的窗体,需要根据绑定的窗体确定数据源表!');
                }
            },
            removeUpdateField(){
                if(this.formId) {
                    this.field.editTableObject.RemoveRow();
                }
                else {
                    //this.$Message.info('请先设置绑定的窗体,需要根据绑定的窗体确定数据源表!');
                    DialogUtility.ToastMessage(this,'请先设置绑定的窗体,需要根据绑定的窗体确定数据源表!');
                }
            }
            //endregion 表字段设置
        }
    }
    function ReplaceItem(source, newItem, condition) {
        for(var i=0;i<source.length;i++){
            if(condition(source[i])){
                source.splice(i, 1,newItem);
            }
        }
    }
</script>

<style scoped>

</style>