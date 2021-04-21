<template>
    <div>
        <Collapse value="1" accordion style="margin-top:8px ">
            <Panel name="1">
                表单通用权限设置
                <div slot="content">
                    <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                    <colgroup>
                        <col style="width: 14%" />
                        <col style="width: 36%" />
                        <col style="width: 15%" />
                        <col style="width: 35%" />
                    </colgroup>
                    <tbody>
                    <tr>
                        <td>
                            优先级:
                        </td>
                        <td colspan="3">
                            Js-API>Java-API>启用权限>必须退回才可改>单独字段权限>附件,正文,字段修改权限
                        </td>
                    </tr>
                    <tr>
                        <td>启用权限设置：</td>
                        <td>
                            <radio-group type="button" style="margin: auto" v-model="jb4dc.jb4dcAuthorities.authoritiesUsed">
                                <radio label="true">是</radio>
                                <radio label="false">否</radio>
                            </radio-group>
                        </td>
                        <td>
                            必须退回才可改：
                        </td>
                        <td>
                            <radio-group type="button" style="margin: auto" v-model="jb4dc.jb4dcAuthorities.authoritiesOnlySendBackCanEdit">
                                <radio label="true">是</radio>
                                <radio label="false">否</radio>
                            </radio-group>
                        </td>
                    </tr>
                    <tr>
                        <td>Js-API方法：</td>
                        <td colspan="3">
                            <input placeholder="" type="text" v-model="jb4dc.jb4dcAuthorities.authoritiesJsApi" />
                        </td>
                    </tr>
                    <tr>
                        <td>Java-API方法：</td>
                        <td colspan="3">
                            <input placeholder="" type="text" v-model="jb4dc.jb4dcAuthorities.authoritiesJavaApi" />
                        </td>
                    </tr>
                    <tr>
                        <td>附件权限：</td>
                        <td colspan="3">
                            <CheckboxGroup v-model="authoritiesFileAuthority">
                                <Checkbox label="addFile">
                                    <Icon type="md-pricetag" />
                                    <span>新增</span>
                                </Checkbox>
                                <Checkbox label="deleteFile">
                                    <Icon type="md-pricetag" />
                                    <span>删除</span>
                                </Checkbox>
                                <Checkbox label="viewFile">
                                    <Icon type="md-pricetag" />
                                    <span>查看</span>
                                </Checkbox>
                                <Checkbox label="packageDown">
                                    <Icon type="md-pricetag" />
                                    <span>打包下载</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </td>
                    </tr>
                    <tr>
                        <td>正文权限：</td>
                        <td colspan="3">
                            <CheckboxGroup v-model="authoritiesDocumentAuthority">
                                <Checkbox label="edit">
                                    <Icon type="md-pricetag" />
                                    <span>修改</span>
                                </Checkbox>
                                <Checkbox label="addComment">
                                    <Icon type="md-pricetag" />
                                    <span>批注</span>
                                </Checkbox>
                                <Checkbox label="view">
                                    <Icon type="md-pricetag" />
                                    <span>查看</span>
                                </Checkbox>
                                <Checkbox label="viewHistory">
                                    <Icon type="md-pricetag" />
                                    <span>查看历史版本</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </td>
                    </tr>
                    <tr>
                        <td>字段权限：</td>
                        <td colspan="3">
                            <CheckboxGroup v-model="authoritiesAllFieldAuthority">
                                <Checkbox label="editALL">
                                    <Icon type="md-pricetag" />
                                    <span>修改全部</span>
                                </Checkbox>
                                <Checkbox label="viewAll">
                                    <Icon type="md-pricetag" />
                                    <span>查看全部</span>
                                </Checkbox>
                                <Checkbox label="emptyEditAll">
                                    <Icon type="md-pricetag" />
                                    <span>为空时可修改</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </td>
                    </tr>
                    <tr>
                        <td>备注：</td>
                        <td colspan="3">
                            <input type="text" v-model="jb4dc.jb4dcAuthorities.authoritiesDesc" />
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </Panel>
            <Panel name="2">
                单独字段权限设置
                <div slot="content">
                    <i-table border :columns="tableFieldConfig" :data="tableFieldData"
                             class="iv-list-table" size="small" no-data-text="add listeners" height="350" width="958">
                        <template slot-scope="{ row, index }" slot="action">
                            <div class="wf-list-font-icon-button-class">
                                <CheckboxGroup v-model="row.auArray" @on-change="singleFieldAuChange(row)">
                                    <Checkbox label="viewEnable">
                                        <Icon type="md-pricetag" />
                                        <span>可查看</span>
                                    </Checkbox>
                                    <Checkbox label="editEnable">
                                        <Icon type="md-pricetag" />
                                        <span>可修改</span>
                                    </Checkbox>
                                    <Checkbox label="emptyEditEnable">
                                        <Icon type="md-pricetag" />
                                        <span>为空时可修改</span>
                                    </Checkbox>
                                </CheckboxGroup>
                            </div>
                        </template>
                    </i-table>
                </div>
            </Panel>
        </Collapse>
    </div>
</template>

<script>
    import { RemoteUtility } from '../../../Remote/RemoteUtility';
    import { PODefinition } from "../../BpmnJsExtend/PODefinition.js"

    export default {
        name: "jb4dc-authority-properties",
        props:["propBpmnGeneralData","propCamundaGeneralData","propJb4dcGeneralData"],
        watch:{
            /*innerMultiInstanceLoopCharacteristicsType: function (newValue, oldValue) {
                if(newValue==""){

                }
            }*/
        },
        data(){
            return {
                allFieldAuthority:[],
                fileAuthority:[],
                documentAuthority:[],
                jb4dc:{
                    jb4dcAuthorities:{}
                },
                tableFieldConfig:[
                    {
                        title: '表',
                        key: 'tableCaption',
                        align: "center",
                        width: 180
                    },
                    {
                        title: '字段',
                        key: 'fieldCaption',
                        width: 180,
                        align: "center"
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        align: "center"
                    }
                ],
                tableFieldData:[],
                authoritiesFileAuthority:["addFile","deleteFile","viewFile","packageDown"],
                authoritiesDocumentAuthority:["edit","addComment","view","viewHistory"],
                authoritiesAllFieldAuthority:["editALL","viewAll","emptyEditAll"],
                //oldTableFieldData:[],
                mustRebuildAllCBData:true
            }
        },
        mounted() {
            //this.mustRebuildOldTableFieldData=false;
            this.jb4dc = this.propJb4dcGeneralData
        },
        methods: {
            jsonToArray(ary,json){
                for(let key in json) {
                    if (json[key] == "true") {
                        ary.push(key);
                    }
                }
            },
            rebuildUIData(formId) {
                //this.mustRebuildOldTableFieldData=true;
                console.log(this.jb4dc);
                if(this.mustRebuildAllCBData) {
                    var authoritiesAllFieldAuthority = this.jb4dc.jb4dcAuthorities.authoritiesAllFieldAuthority ? JsonUtility.StringToJson(this.jb4dc.jb4dcAuthorities.authoritiesAllFieldAuthority) : {};
                    var authoritiesDocumentAuthority = this.jb4dc.jb4dcAuthorities.authoritiesDocumentAuthority ? JsonUtility.StringToJson(this.jb4dc.jb4dcAuthorities.authoritiesDocumentAuthority) : {};
                    var authoritiesFileAuthority = this.jb4dc.jb4dcAuthorities.authoritiesFileAuthority ? JsonUtility.StringToJson(this.jb4dc.jb4dcAuthorities.authoritiesFileAuthority) : {};
                    var singleFieldJb4dcAuthorities = this.jb4dc.jb4dcAuthorities.authorities;
                    if (this.jb4dc.jb4dcAuthorities.authoritiesAllFieldAuthority) {
                        this.authoritiesAllFieldAuthority = [];
                        this.jsonToArray(this.authoritiesAllFieldAuthority, authoritiesAllFieldAuthority);
                    }
                    if (this.jb4dc.jb4dcAuthorities.authoritiesDocumentAuthority) {
                        this.authoritiesDocumentAuthority = [];
                        this.jsonToArray(this.authoritiesDocumentAuthority, authoritiesDocumentAuthority);
                    }
                    if (this.jb4dc.jb4dcAuthorities.authoritiesFileAuthority) {
                        this.authoritiesFileAuthority = [];
                        this.jsonToArray(this.authoritiesFileAuthority, authoritiesFileAuthority);
                    }
                    this.mustRebuildAllCBData=false;
                }
                //debugger;
                //if(jb4dcAuthorities.)
                var oldSingleFieldAuthObj = {};
                for (let i = 0; i < singleFieldJb4dcAuthorities.length; i++) {
                    var key = singleFieldJb4dcAuthorities[i].authorityTableName + "_" + singleFieldJb4dcAuthorities[i].authorityFieldName;
                    var ary = [];
                    if (singleFieldJb4dcAuthorities[i].authorityViewEnable == "true") {
                        ary.push("viewEnable");
                    }
                    if (singleFieldJb4dcAuthorities[i].authorityEditEnable == "true") {
                        ary.push("editEnable");
                    }
                    if (singleFieldJb4dcAuthorities[i].authorityEmptyEditEnable == "true") {
                        ary.push("emptyEditEnable");
                    }
                    oldSingleFieldAuthObj[key] = ary;
                }

                RemoteUtility.GetFormResourceBindMainTable(formId).then((mainTablePO) => {
                    var fieldData = mainTablePO.tableFieldPOList;
                    //console.log(formId);
                    for (var i = 0; i < fieldData.length; i++) {
                        var key = fieldData[i].tableName + "_" + fieldData[i].fieldName;
                        this.tableFieldData.push({
                            tableId: fieldData[i].tableId,
                            tableName: fieldData[i].tableName,
                            tableCaption: fieldData[i].tableCaption,
                            fieldName: fieldData[i].fieldName,
                            fieldCaption: fieldData[i].fieldCaption,
                            auArray: oldSingleFieldAuthObj[key]
                        });
                    }
                });
            },
            singleFieldAuChange(row){
                //console.log(auArray);
                console.log(row);
                if(row.auArray.length==0){
                    //移除
                    for (let i = 0; i < this.jb4dc.jb4dcAuthorities.authorities.length; i++) {
                        if(row.tableName==this.jb4dc.jb4dcAuthorities.authorities[i].authorityTableName&&row.fieldName==this.jb4dc.jb4dcAuthorities.authorities[i].authorityFieldName){
                            ArrayUtility.Delete(this.jb4dc.jb4dcAuthorities.authorities,i);
                        }
                    }
                }
                else {

                    var newAuthority = PODefinition.GetJB4DCAuthorityPO();
                    newAuthority.authorityType="tableField";
                    newAuthority.authorityTableName=row.tableName;
                    newAuthority.authorityFieldName=row.fieldName;
                    newAuthority.authorityViewEnable=row.auArray.indexOf("viewEnable") >= 0 ? "true" : "false";
                    newAuthority.authorityEditEnable=row.auArray.indexOf("editEnable") >= 0 ? "true" : "false";
                    newAuthority.authorityEmptyEditEnable=row.auArray.indexOf("emptyEditEnable") >= 0 ? "true" : "false";
                    newAuthority.authorityDesc="";

                    if (ArrayUtility.Exist(this.jb4dc.jb4dcAuthorities.authorities, (item) => {
                        return row.tableName == item.authorityTableName && row.fieldName == item.authorityFieldName
                    })) {
                        //更新
                        ArrayUtility.ReplaceItem(this.jb4dc.jb4dcAuthorities.authorities,newAuthority,(item) => {
                            return row.tableName == item.authorityTableName && row.fieldName == item.authorityFieldName
                        });
                    } else {
                        //新增1
                        this.jb4dc.jb4dcAuthorities.authorities.push(newAuthority);
                    }
                }
                console.log(this.jb4dc.jb4dcAuthorities);
            },
            rebuildJB4DData() {
                var authoritiesFileAuthorityJson = {
                    "addFile": this.authoritiesFileAuthority.indexOf("addFile") >= 0 ? "true" : "false",
                    "deleteFile": this.authoritiesFileAuthority.indexOf("deleteFile") >= 0 ? "true" : "false",
                    "viewFile": this.authoritiesFileAuthority.indexOf("viewFile") >= 0 ? "true" : "false",
                    "packageDown": this.authoritiesFileAuthority.indexOf("packageDown") >= 0 ? "true" : "false"
                };
                var authoritiesDocumentAuthorityJson = {
                    "edit": this.authoritiesDocumentAuthority.indexOf("edit") >= 0 ? "true" : "false",
                    "addComment": this.authoritiesDocumentAuthority.indexOf("addComment") >= 0 ? "true" : "false",
                    "view": this.authoritiesDocumentAuthority.indexOf("view") >= 0 ? "true" : "false",
                    "viewHistory": this.authoritiesDocumentAuthority.indexOf("viewHistory") >= 0 ? "true" : "false"
                };
                var authoritiesAllFieldAuthorityJson = {
                    "editALL": this.authoritiesAllFieldAuthority.indexOf("editALL") >= 0 ? "true" : "false",
                    "viewAll": this.authoritiesAllFieldAuthority.indexOf("viewAll") >= 0 ? "true" : "false",
                    "emptyEditAll": this.authoritiesAllFieldAuthority.indexOf("emptyEditAll") >= 0 ? "true" : "false"
                };
                this.jb4dc.jb4dcAuthorities.authoritiesFileAuthority = JsonUtility.JsonToString(authoritiesFileAuthorityJson);
                this.jb4dc.jb4dcAuthorities.authoritiesDocumentAuthority = JsonUtility.JsonToString(authoritiesDocumentAuthorityJson);
                this.jb4dc.jb4dcAuthorities.authoritiesAllFieldAuthority = JsonUtility.JsonToString(authoritiesAllFieldAuthorityJson);
            }
        }
    }
</script>

<style scoped>

</style>