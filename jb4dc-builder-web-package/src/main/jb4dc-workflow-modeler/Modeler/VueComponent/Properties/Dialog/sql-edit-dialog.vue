<template>
    <div>
        <div ref="editDialogWrap" style="display: none">
            <div>
                <textarea ref="txtContextVarSqlEdit" v-model="editData"></textarea>
            </div>
            <tabs name="flow-process-title-config-tabs">
                <tab-pane tab="flow-process-title-config-tabs" label="表" name="Tables">
                    <div>
                        <div style="margin: 8px">数据表：【<span style="color: red">{{tree.selectedTableName}}</span>】</div>
                        <i-table size="small" height="300" stripe border :columns="tableField.columnsConfig" :data="tableField.fieldData"
                                 class="iv-list-table" :highlight-row="true">
                            <template slot-scope="{ row, index }" slot="action">
                                <div class="wf-list-font-icon-button-class" @click="insertTableFieldToCodeMirror(row)">
                                    <Icon type="ios-checkmark-circle" />
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
                                <template slot-scope="{ row, index }" slot="action">
                                    <div class="wf-list-font-icon-button-class" @click="insertEnvVarToEditor(row)">
                                        <Icon type="ios-checkmark-circle" />
                                    </div>
                                </template>
                            </i-table>
                        </div>
                    </div>
                </tab-pane>
                <tab-pane tab="flow-process-title-config-tabs" label="流程变量" name="FlowVar">
                    <div style="margin-top: 8px">
                        <Button type="info">发起人</Button>
                        <Button type="info">环节名称</Button>
                        <Button type="info">动作名称</Button>
                        <Button type="info">.....</Button>
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
    name: "sql-edit-dialog",
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
                        title: '选择',
                        slot: 'action',
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
                    title: '操作',
                    slot: 'action',
                    key: 'envVarId',
                    width: 120,
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
                            editText:$(_self.$refs.txtContextVarSqlEdit).next().find(".CodeMirror-code").text(),
                            editValue:_self.selectedCodeMirror.getDoc().getValue()
                        };
                        _self.callBackFunc(result);
                    }
                    DialogUtility.CloseDialogElem(_self.$refs.editDialogWrap);
                },
                "清空": function () {
                    _self.editData="";
                    if(typeof (_self.callBackFunc=="function")) {
                        var result={
                            editText:"",
                            editValue:""
                        };
                        _self.callBackFunc(result);
                    }
                    DialogUtility.CloseDialogElem(_self.$refs.editDialogWrap);
                },
                "取消": function () {
                    DialogUtility.CloseDialogElem(_self.$refs.editDialogWrap);
                }
            }
        });
        $(this.$refs.editDialogWrap).dialog("close");
        this.selectedCodeMirror = CodeMirror.fromTextArea(this.$refs.txtContextVarSqlEdit, {
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
            CodeMirrorUtility.TryResolveCodeMirrorValueToMarkText(this.selectedCodeMirror,this.$refs.txtContextVarSqlEdit)
            //this.tryResolveCodeMirrorValueToMarkText(doc.getValue());
            /*var htmlNode = document.createElement("span");
            htmlNode.innerText=editText;
            htmlNode.className="code-mirror-mark-text";
            doc.markText({line: cursor.line,ch: cursor.ch}, {line: cursor.line,ch: cursor.ch + editValue.length}, {
                replacedWith: htmlNode
            });*/
        },
        insertTableFieldToCodeMirror:function (fieldJson) {
            console.log(fieldJson);
            var editText='${表字段.'+fieldJson.tableCaption+"."+fieldJson.fieldCaption+'}';
            var editValue='${TableField.'+fieldJson.fieldTableId+"."+fieldJson.fieldName+'}';
            this.insertCodeAtCursor(editText,editValue);
        },
        insertEnvVarToEditor:function(evnJson) {
            //console.log(evnJson);
            var editText='${环境变量.' + evnJson.envVarText + '}';
            var editValue='${EnvVar.' + evnJson.envVarValue + '}';
            this.insertCodeAtCursor(editText,editValue);
        },
        envGroupTreeNodeSelected(event, treeId, treeNode) {
            // 根节点不触发任何事件1
            RemoteUtility.GetEnvVariablePOListByGroupId(treeNode.envGroupId).then((envVariablePOList) => {
                this.envVarTableData = envVariablePOList;
            });
        },
        beginEditContextJuel(dialogTitle,oldData,formId,callBackFunc) {
            //console.log("...........1...");
            //console.log(formId);

        },
        showAddRunSqlDialog(dialogTitle,oldData,formId,callBackFunc) {
            $(this.$refs.editDialogWrap).dialog("open");
            $(this.$refs.editDialogWrap).dialog("option", "title", dialogTitle );
            this.editData=oldData;
            this.selectedCodeMirror.setValue(this.editData);
            this.callBackFunc=callBackFunc;
            //this.selectedCodeMirror = this.flowProcessTitleCodeMirror;
            //this.tryResolveCodeMirrorValueToMarkText(this.editData);
            CodeMirrorUtility.TryResolveCodeMirrorValueToMarkText(this.selectedCodeMirror,this.$refs.txtContextVarSqlEdit)
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