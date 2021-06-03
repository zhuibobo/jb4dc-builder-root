<template>
    <div>
        <div ref="editDialogWrap" style="display: none">
            <div>
                <textarea ref="txtContextVarJuelEdit" v-model="editData"></textarea>
            </div>
            <tabs name="flow-process-title-config-tabs">
                <tab-pane tab="flow-process-title-config-tabs" label="表" name="Tables">
                    <div>
                        <div style="margin: 8px">数据表：【<span style="color: red">{{tree.selectedTableName}}</span>】</div>
                        <i-table size="small" height="300" stripe border :columns="tableField.columnsConfig" :data="tableField.fieldData"
                                 class="iv-list-table" :highlight-row="true">
                            <template slot-scope="{ row, index }" slot="actionBoolean">
                                <div class="wf-list-font-icon-button-class" @click="insertTableFieldToCodeMirrorAsBoolean(row)">
                                    <Icon type="md-checkmark-circle-outline" />
                                </div>
                            </template>
                            <template slot-scope="{ row, index }" slot="actionString">
                                <div class="wf-list-font-icon-button-class" @click="insertTableFieldToCodeMirrorAsString(row)">
                                    <Icon type="md-checkmark-circle" />
                                </div>
                            </template>
                        </i-table>
                    </div>
                </tab-pane>
                <tab-pane tab="flow-process-title-config-tabs" label="环境变量" name="EnvVar">
                    <div>
                        <div style="width: 25%;float: left;height: 300px;overflow: auto">
                            <div class="inner-wrap">
                                <div style="margin-top: 8px">
                                    <ul id="envGroupZTreeUL" ref="envGroupZTreeUL" class="ztree"></ul>
                                </div>
                            </div>
                        </div>
                        <div style="width: 73%;float: right;" class="iv-list-page-wrap">
                            <i-table :height="320" stripe border :columns="envVarColumnsConfig" :data="envVarTableData"
                                     class="iv-list-table" :highlight-row="true">
                                <template slot-scope="{ row, index }" slot="actionBoolean">
                                    <div class="wf-list-font-icon-button-class" @click="insertEnvVarToEditorAsBoolean(row)">
                                        <Icon type="md-checkmark-circle-outline" />
                                    </div>
                                </template>
                                <template slot-scope="{ row, index }" slot="actionString">
                                    <div class="wf-list-font-icon-button-class" @click="insertEnvVarToEditorAsString(row)">
                                        <Icon type="md-checkmark-circle" />
                                    </div>
                                </template>
                            </i-table>
                        </div>
                    </div>
                </tab-pane>
                <tab-pane tab="flow-process-title-config-tabs" label="流程变量" name="FlowVar">
                    <div style="margin-top: 8px;padding: 8px">
                        <Row>
                            <Col span="12">
                                <ButtonGroup style="margin: 4px">
                                    <Button type="primary" ghost>模型名称</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsString('FlowVar$$ModelName')"><Icon type="md-checkmark-circle-outline" />字符串</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsBoolean('FlowVar$$ModelName')"><Icon type="md-checkmark-circle-outline" />布尔值</Button>
                                </ButtonGroup>
                            </Col>
                            <Col span="12">
                                <ButtonGroup style="margin: 4px">
                                    <Button type="primary" ghost>模型类别</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsString('FlowVar$$ModelCategory')"><Icon type="md-checkmark-circle-outline" />字符串</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsBoolean('FlowVar$$ModelCategory')"><Icon type="md-checkmark-circle-outline" />布尔值</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <ButtonGroup style="margin: 4px">
                                    <Button type="primary" ghost>环节名称</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsString('FlowVar$$NodeName')"><Icon type="md-checkmark-circle-outline" />字符串</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsBoolean('FlowVar$$NodeName')"><Icon type="md-checkmark-circle-outline" />布尔值</Button>
                                </ButtonGroup>
                            </Col>
                            <Col span="12">
                                <ButtonGroup style="margin: 4px">
                                    <Button type="primary" ghost>动作名称</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsString('FlowVar$$LastActionName')"><Icon type="md-checkmark-circle-outline" />字符串</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsBoolean('FlowVar$$LastActionName')"><Icon type="md-checkmark-circle-outline" />布尔值</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <ButtonGroup style="margin: 4px">
                                    <Button type="primary" ghost>发起时间(yyyy-MM-dd)</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsString('FlowVar$$InstanceCreatTime_yyyy_MM_dd')"><Icon type="md-checkmark-circle-outline" />字符串</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsBoolean('FlowVar$$InstanceCreatTime_yyyy_MM_dd')"><Icon type="md-checkmark-circle-outline" />布尔值</Button>
                                </ButtonGroup>
                            </Col>
                            <Col span="12">
                                <ButtonGroup style="margin: 4px">
                                    <Button type="primary" ghost>发起时间(yyyy-MM-dd HH:mm:ss)</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsString('FlowVar$$InstanceCreatTime_yyyy_MM_dd_HH_mm_ss')"><Icon type="md-checkmark-circle-outline" />字符串</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsBoolean('FlowVar$$InstanceCreatTime_yyyy_MM_dd_HH_mm_ss')"><Icon type="md-checkmark-circle-outline" />布尔值</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <ButtonGroup style="margin: 4px">
                                    <Button type="primary" ghost>发起人角色ID串</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsString('FlowVar$$CurrentUserRoleIdsString')"><Icon type="md-checkmark-circle-outline" />字符串</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsBooleanContains('FlowVar$$CurrentUserRoleIdsString')"><Icon type="md-checkmark-circle-outline" />布尔值</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsBooleanContainsOr2('FlowVar$$CurrentUserRoleIdsString')">Or2</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsBooleanContainsAnd2('FlowVar$$CurrentUserRoleIdsString')">And2</Button>
                                </ButtonGroup>
                            </Col>
                            <Col span="12">
                                <ButtonGroup style="margin: 4px">
                                    <Button type="primary" ghost>发起人角色名称串</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsString('FlowVar$$CurrentUserRoleNamesString')"><Icon type="md-checkmark-circle-outline" />字符串</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsBooleanContains('FlowVar$$CurrentUserRoleNamesString')"><Icon type="md-checkmark-circle-outline" />布尔值</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <ButtonGroup style="margin: 4px">
                                    <Button type="primary" ghost>发起人姓名</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsString('FlowVar$$InstanceCreator')"><Icon type="md-checkmark-circle-outline" />字符串</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsBoolean('FlowVar$$InstanceCreator')"><Icon type="md-checkmark-circle-outline" />布尔值</Button>
                                </ButtonGroup>
                            </Col>
                            <Col span="12">
                                <ButtonGroup style="margin: 4px">
                                    <Button type="primary" ghost>发起人ID</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsString('FlowVar$$InstanceCreatorId')"><Icon type="md-checkmark-circle-outline" />字符串</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsBoolean('FlowVar$$InstanceCreatorId')"><Icon type="md-checkmark-circle-outline" />布尔值</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <ButtonGroup style="margin: 4px">
                                    <Button type="primary" ghost>发起人所在组织</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsString('FlowVar$$InstanceCreatorOrganName')"><Icon type="md-checkmark-circle-outline" />字符串</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsBoolean('FlowVar$$InstanceCreatorOrganName')"><Icon type="md-checkmark-circle-outline" />布尔值</Button>
                                </ButtonGroup>
                            </Col>
                            <Col span="12">
                                <ButtonGroup style="margin: 4px">
                                    <Button type="primary" ghost>发起人所在组织ID</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsString('FlowVar$$InstanceCreatorOrganId')"><Icon type="md-checkmark-circle-outline" />字符串</Button>
                                    <Button type="success" @click="insertFlowVarToEditorAsBoolean('FlowVar$$InstanceCreatorOrganId')"><Icon type="md-checkmark-circle-outline" />布尔值</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="24">
                                <ButtonGroup style="margin: 4px">
                                    <Button type="primary" ghost>默认标题</Button>
                                    <Button type="success" @click="insertInstanceCaptionToEditor('template1')"><Icon type="md-checkmark-circle-outline" />模板1</Button>
                                    <Button type="success" @click="insertInstanceCaptionToEditor('template2')"><Icon type="md-checkmark-circle-outline" />模板2</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </div>
                </tab-pane>
            </tabs>
        </div>
    </div>
</template>

<script>
    import {RemoteUtility} from '../../../Remote/RemoteUtility';
    import {CodeMirrorUtility} from '../../BpmnJsExtend/CodeMirrorUtility';

    export default {
        name: "context-juel-edit-dialog",
        data(){
            return {
                tree:{
                    envGroupTreeObj:null,
                    envGroupTreeSelectedNode:null,
                    envGroupTreeSetting:{
                        async : {
                            enable : true,
                            // Ajax 获取数据的 URL 地址
                            url :""
                        },
                        // 必须使用data
                        data:{
                            key:{
                                name:"envGroupText"
                            },
                            simpleData : {
                                enable : true,
                                idKey : "envGroupId", // id编号命名
                                pIdKey : "envGroupParentId",  // 父id编号命名
                                rootId : 0
                            }
                        },
                        // 回调函数
                        callback : {
                            onClick : function(event, treeId, treeNode) {
                                var _self=this.getZTreeObj(treeId)._host;
                                _self.envGroupTreeNodeSelected(event,treeId,treeNode);
                            },
                            //成功的回调函数
                            onAsyncSuccess : function(event, treeId, treeNode, msg){
                                appList.treeObj.expandAll(true);
                            }
                        }
                    },
                    selectedTableName:"无"
                },
                tableField:{
                    fieldData:[],
                    columnsConfig: [
                        {
                            title: '字段名称',
                            key: 'fieldName',
                            align: "center"
                        }, {
                            title: '标题',
                            key: 'fieldCaption',
                            align: "center"
                        }, {
                            title: '布尔值',
                            slot: 'actionBoolean',
                            width: 80,
                            align: 'center'
                        }, {
                            title: '字符串',
                            slot: 'actionString',
                            width: 80,
                            align: 'center'
                        }
                    ]
                },
                sqlCodeMirrorTitle:null,
                envVarTableData:[],
                envVarColumnsConfig: [
                    {
                        title: '变量名称',
                        key: 'envVarText',
                        align: "center"
                    }, {
                        title: '变量值',
                        key: 'envVarValue',
                        align: "center"
                    }, {
                        title: '布尔值',
                        slot: 'actionBoolean',
                        key: 'envVarId',
                        width: 80,
                        align: "center"
                    }, {
                        title: '字符串',
                        slot: 'actionString',
                        key: 'envVarId',
                        width: 80,
                        align: "center"
                    }
                ],
                envVarSearchCondition:{
                    envVarGroupId:{
                        value:"",
                        type:SearchUtility.SearchFieldType.StringType
                    }
                },
                selectedCodeMirror:null,
                editData:"",
                callBackFunc:null
            }
        },
        mounted() {
            var _self=this;
            DialogUtility.DialogElemObj(this.$refs.editDialogWrap,{
                title:"",
                width:850,
                height:560,
                modal:true,
                buttons: {
                    "确认": function () {
                        if(typeof (_self.callBackFunc=="function")) {
                            //var result=_self.tryResolveTextToValue(_self.editData);
                            var result={
                                editText:$(_self.$refs.txtContextVarJuelEdit).next().find(".CodeMirror-code").text(),
                                editValue:_self.selectedCodeMirror.getDoc().getValue()
                            };
                            _self.callBackFunc(result);
                        }
                        DialogUtility.CloseDialogElem(_self.$refs.editDialogWrap);
                    },
                    "清空": function () {
                        _self.selectedCodeMirror.setValue("");
                        //_self.editData="";
                        //if(typeof (_self.callBackFunc=="function")) {
                        //    var result={
                        //        editText:"",
                        //        editValue:""
                        //    };
                        //    _self.callBackFunc(result);
                        //}
                        //DialogUtility.CloseDialogElem(_self.$refs.editDialogWrap);
                    },
                    "取消": function () {
                        DialogUtility.CloseDialogElem(_self.$refs.editDialogWrap);
                    }
                }
            });
            $(this.$refs.editDialogWrap).dialog("close");
            this.selectedCodeMirror = CodeMirror.fromTextArea(this.$refs.txtContextVarJuelEdit, {
                mode: "text/x-sql",
                lineWrapping: true,
                foldGutter: true,
                theme: "monokai"
            });
            this.selectedCodeMirror.setSize("100%", 78);
            this.selectedCodeMirror.on("mousedown", (instance, e) => {
                this.selectedCodeMirror = instance;
            });
            this.selectedCodeMirror.on("change", (instance, e) => {
                //console.log(instance);
                //this.selectedCodeMirror=instance;
                this.editData = instance.getValue();
            });

            //this.tryResolveTextToValue();
        },
        methods: {
            tryResolveTextToValue(editText){
                //editText="${FlowAction.Task_1uhc294.起草.action_612991045}${FlowAction.UserTask_0wq4xdg.起草1.action_612991045}${表字段.TDEV_TEST_2.记录时间}${表字段.TDEV_TEST_2.组织名称}${表字段.TDEV_TEST_2.F_NTEXT_1}${环境变量.年年年年-月月-日日 时:分:秒}${环境变量.年年年年/月月/日日}${环境变量.静态值-否}${表字段.TDEV_TEST_2.F_TABLE1_ID}";
                //console.log(editText);
                var editValue=editText;
                var reg = new RegExp("\\$\\{[表字段|环境变量][^\\}]*\\}","g");
                //console.log(reg.exec(editText));
                var result="";

                var textItemFull;
                var valueItemFull;
                var itemTypeText;
                var itemTypeValue;
                var itemText;
                var itemValue;
                while ((result = reg.exec(editText)) != null)  {
                    textItemFull=result.toString();
                    itemTypeText=textItemFull.substring(2,textItemFull.indexOf("."));
                    itemText=textItemFull.substring(textItemFull.indexOf(".")+1,textItemFull.length-1);

                    switch (itemTypeText) {
                        case "环境变量":{
                            itemTypeValue="EnvVar";
                            itemValue=RemoteUtility.GetEnvVariableValueByEnvText(itemText);
                        }break;
                        case "表字段":{
                            itemTypeValue="TableField";
                            itemValue=itemText.split(".")[0]+"."+RemoteUtility.GetTableFieldNameByFieldCaption(itemText.split(".")[0],itemText.split(".")[1]);
                        }break;
                        default: break;
                    }
                    valueItemFull="${"+itemTypeValue+"."+itemValue+"}";
                    editValue = editValue.replace(textItemFull,valueItemFull);

                    //console.log(editText);
                    //console.log(editValue);
                    //console.log(result);
                    //console.log(result.toString());
                    //console.log(reg.lastIndex);
                }

                return {
                    editText:editText,
                    editValue:editValue
                }
            },
            del_tryResolveCodeMirrorValueToMarkText(value){
                this.selectedCodeMirror.getDoc().setValue(value);
                var reg = new RegExp("\\$\\{[TableField|EnvVar][^\\}]*\\}","g");
                var result="";
                var doc = this.selectedCodeMirror.getDoc();

                var itemTypeText;
                var itemTypeValue;
                var itemText;
                var itemValue;
                while ((result = reg.exec(value)) != null)  {
                    var valueItemFull=result.toString();
                    itemTypeValue=valueItemFull.substring(2,valueItemFull.indexOf("."));
                    itemValue=valueItemFull.substring(valueItemFull.indexOf(".")+1,valueItemFull.length-1);

                    console.log(valueItemFull);
                    var cursor = this.selectedCodeMirror.getSearchCursor(valueItemFull);
                    cursor.findNext();
                    while (cursor.atOccurrence) {
                        /*console.log(cursor);
                    cursor.findNext();
                    console.log(cursor);
                    cursor.findNext();
                    console.log(cursor);*/

                        switch (itemTypeValue) {
                            case "EnvVar": {
                                itemTypeText = "环境变量";
                                itemText = RemoteUtility.GetEnvVariableTextByEnvValue(itemValue);
                            }
                                break;
                            case "TableField": {
                                itemTypeText = "表字段";
                                var tempTableName = itemValue.split(".")[0];
                                var tempFieldName = itemValue.split(".")[1];
                                var tempPO = RemoteUtility.GetTableFieldPO(tempTableName, tempFieldName);
                                itemText = tempPO.tableCaption + "." + tempPO.fieldCaption;
                            }
                                break;
                            default:
                                break;
                        }

                        var htmlNode = document.createElement("span");
                        htmlNode.innerText = "${" + itemTypeText + "." + itemText + "}";
                        htmlNode.className = "code-mirror-mark-text";
                        doc.markText(cursor.from(), {line: cursor.to().line, ch: cursor.to().ch}, {
                            replacedWith: htmlNode
                        });
                        cursor.findNext();
                    }
                }
                //console.log(doc.getValue());
                //var text = $(this.$refs.txtSequenceFlowConditionEditText).next().find(".CodeMirror-code").text();
                //console.log(text);
            },
            insertCodeAtCursor(editText,editValue) {
                //console.log(code);
                var doc = this.selectedCodeMirror.getDoc();

                var cursor = doc.getCursor();
                doc.replaceRange(editValue, cursor);
                CodeMirrorUtility.TryResolveCodeMirrorValueToMarkText(this.selectedCodeMirror,this.$refs.txtContextVarJuelEdit)
                //this.tryResolveCodeMirrorValueToMarkText(doc.getValue());
                /*var htmlNode = document.createElement("span");
                htmlNode.innerText=editText;
                htmlNode.className="code-mirror-mark-text";
                doc.markText({line: cursor.line,ch: cursor.ch}, {line: cursor.line,ch: cursor.ch + editValue.length}, {
                    replacedWith: htmlNode
                });*/
            },
            insertInstanceCaptionToEditor:function (templateName){
                if(templateName=="template1"){
                    var editValue='${__$FlowVar$$ModelName$}-【${__$FlowVar$$InstanceCreator$}】-「${__$FlowVar$$InstanceCreatorOrganName$}」';
                }
                else if (templateName=="template2"){
                    var editValue='${__$FlowVar$$ModelName$}-【${__$FlowVar$$InstanceCreator$}】-「${__$FlowVar$$InstanceCreatTime_yyyy_MM_dd$}」';
                }
                var editText=editValue;
                this.insertCodeAtCursor(editText,editValue);
            },
            insertFlowVarToEditorAsString:function (value){
                var editText='${__$'+value+'$}';
                var editValue='${__$'+value+'$}';
                this.insertCodeAtCursor(editText,editValue);
            },
            insertFlowVarToEditorAsBoolean:function (value){
                var editText='${__$'+value+'$==\"请输入值\"}';
                var editValue='${__$'+value+'$==\"请输入值\"}';
                this.insertCodeAtCursor(editText,editValue);
            },
            insertFlowVarToEditorAsBooleanContains:function (value){
                var editText='${__$'+value+'$.contains(\"请输入值\")}';
                var editValue='${__$'+value+'$.contains(\"请输入值\")}';
                this.insertCodeAtCursor(editText,editValue);
            },
            insertFlowVarToEditorAsBooleanContainsOr2:function (value){
                var editText='${__$'+value+'$.contains(\"请输入值\") or __$'+value+'$.contains(\"请输入值\")}';
                var editValue='${__$'+value+'$.contains(\"请输入值\") or __$'+value+'$.contains(\"请输入值\")}';
                this.insertCodeAtCursor(editText,editValue);
            },
            insertFlowVarToEditorAsBooleanContainsAnd2:function (value){
                var editText='${__$'+value+'$.contains(\"请输入值\") and __$'+value+'$.contains(\"请输入值\")}';
                var editValue='${__$'+value+'$.contains(\"请输入值\") and __$'+value+'$.contains(\"请输入值\")}';
                this.insertCodeAtCursor(editText,editValue);
            },
            insertTableFieldToCodeMirrorAsString:function (fieldJson) {
                console.log(fieldJson);
                var editText='${__$业务数据$.__$表字段$$'+fieldJson.tableCaption+"$$"+fieldJson.fieldCaption+'$}';
                var editValue='${__$BusinessData$.__$TableField$$'+fieldJson.fieldTableId+"$$"+fieldJson.fieldName+'$}';
                this.insertCodeAtCursor(editText,editValue);
            },
            insertTableFieldToCodeMirrorAsBoolean:function (fieldJson){
                console.log(fieldJson);
                var editText='${__$业务数据$.__$表字段$$'+fieldJson.tableCaption+"$$"+fieldJson.fieldCaption+'$==\"请输入值\"}';
                var editValue='${__$BusinessData$.__$TableField$$'+fieldJson.fieldTableId+"$$"+fieldJson.fieldName+'$==\"请输入值\"}';
                this.insertCodeAtCursor(editText,editValue);
            },
            insertEnvVarToEditorAsString:function(evnJson) {
                //console.log(evnJson);
                var editText='${__$环境变量$$' + evnJson.envVarText + '$}';
                var editValue='${__$EnvVar$$' + evnJson.envVarValue + '$}';
                this.insertCodeAtCursor(editText,editValue);
            },
            insertEnvVarToEditorAsBoolean:function (evnJson){
                var editText='${__$环境变量$$' + evnJson.envVarText + '$==\"请输入值\"}';
                var editValue='${__$EnvVar$$' + evnJson.envVarValue + '$==\"请输入值\"}';
                this.insertCodeAtCursor(editText,editValue);
            },
            envGroupTreeNodeSelected(event, treeId, treeNode) {
                // 根节点不触发任何事件1
                RemoteUtility.GetEnvVariablePOListByGroupId(treeNode.envGroupId).then((envVariablePOList) => {
                    this.envVarTableData = envVariablePOList;
                });
            },
            beginEditContextJuel(dialogTitle,oldData,formId,callBackFunc,resolveSourceObject) {
                //console.log("...........1...");
                console.log(oldData);
                $(this.$refs.editDialogWrap).dialog("open");
                $(this.$refs.editDialogWrap).dialog("option", "title", dialogTitle );
                this.editData=oldData;
                this.selectedCodeMirror.setValue(this.editData);
                this.callBackFunc=callBackFunc;
                //this.selectedCodeMirror = this.flowProcessTitleCodeMirror;
                //this.tryResolveCodeMirrorValueToMarkText(this.editData);
                CodeMirrorUtility.TryResolveCodeMirrorValueToMarkText(this.selectedCodeMirror,this.$refs.txtContextVarJuelEdit,resolveSourceObject)
                RemoteUtility.GetEnvGroupPOList().then((envGroupPOList) => {
                    this.tree.envGroupTreeObj = $.fn.zTree.init($(this.$refs.envGroupZTreeUL), this.tree.envGroupTreeSetting, envGroupPOList);
                    this.tree.envGroupTreeObj.expandAll(true);
                    this.tree.envGroupTreeObj._host = this;
                });

                RemoteUtility.GetFormResourceBindMainTable(formId).then((mainTablePO) => {
                    //console.log(formResourcePOList);
                    if(mainTablePO) {
                        this.tableField.fieldData = mainTablePO.tableFieldPOList;
                    }
                    else{
                        this.tableField.fieldData=[];
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>