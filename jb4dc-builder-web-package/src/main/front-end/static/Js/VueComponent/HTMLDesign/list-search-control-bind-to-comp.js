/*查询字段绑定的Vue组件*/
Vue.component("list-search-control-bind-to-comp", {
    props:["bindToSearchFieldProp","dataSetId"],
    data: function () {
        var _self=this;
        return {
            bindToSearchField:{
                columnTitle:"",
                columnTableName: "",
                columnName: "",
                columnCaption: "",
                columnDataTypeName: "",
                columnOperator: "匹配"
            },
            defaultValue: {
                defaultType: "",
                defaultValue: "",
                defaultText: ""
            },
            tree: {
                treeObj: null,
                treeSetting: {
                    view: {
                        dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                        showLine: true,//是否显示节点之间的连线
                        fontCss: {'color': 'black', 'font-weight': 'normal'}
                    },
                    check: {
                        enable: false,
                        nocheckInherit: false,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    data: {
                        key: {
                            name: "text"
                        },
                        simpleData: {//简单数据模式
                            enable: true,
                            idKey: "id",
                            pIdKey: "pid",
                            rootPId: "-1"// 1
                        }
                    },
                    callback: {
                        //点击树节点事件
                        onClick: function (event, treeId, treeNode) {
                            _self.selectColumn(treeNode);
                        },
                        onDblClick: function (event, treeId, treeNode) {

                        },
                        //成功的回调函数
                        onAsyncSuccess: function (event, treeId, treeNode, msg) {

                        }
                    }
                },
                treeData: null
            },
            tempData:{
                defaultDisplayText:""
            }
        }
    },
    //新增result的watch，监听变更同步到openStatus
    //监听父组件对props属性result的修改，并同步到组件内的data属性
    watch: {
        bindToSearchFieldProp :function(newValue) {
            console.log(newValue);
        },
        defaultValueProp:function (newValue) {
            this.defaultValue=newValue;
            if(!StringUtility.IsNullOrEmpty(this.defaultValue.defaultType)){
                this.tempData.defaultDisplayText=JBuild4DSelectView.SelectEnvVariable.formatText(this.defaultValue.defaultType,this.defaultValue.defaultText);
            }
        }
    },
    mounted:function(){
        this.bindToField=this.bindToFieldProp;
        //var dataset=window.parent.listDesign.getDataSet();
    },
    methods:{
        init:function(dataSetPO){
            console.log(dataSetPO);
            //return;
            var treeNodeArray=[];
            //处理column数据为树数据
            /*var treeNodeData=dataSetPO.columnVoList;
            for(var i=0;i<treeNodeData.length;i++) {
                var singleNode = treeNodeData[i];
                singleNode.pid = dataSetPO.dsId;
                singleNode.text = singleNode.columnCaption + "[" + singleNode.columnName + "]";
                singleNode.nodeType = "DataSetColumn";
                singleNode.id = singleNode.columnId;
                singleNode.icon = BaseUtility.GetRootPath()+"/Themes/Png16X16/page.png";
                treeNodeArray.push(singleNode);
            }*/

            //创建一个根节点
            var rootNode={
                pid:"-1",
                text:dataSetPO.dsName,
                id:dataSetPO.dsId,
                nodeType:"DataSet"
            };

            treeNodeArray.push(rootNode);

            for(var i=0;i<dataSetPO.relatedTableVoList.length;i++){
                treeNodeArray.push({
                    pid:dataSetPO.dsId,
                    text:dataSetPO.relatedTableVoList[i].rtTableCaption,
                    id:dataSetPO.relatedTableVoList[i].rtTableId,
                    nodeType:"Table"
                });

                for(var j=0;j<dataSetPO.relatedTableVoList[i].tableFieldPOList.length;j++) {
                    var singleNode = dataSetPO.relatedTableVoList[i].tableFieldPOList[j];
                    singleNode.pid = dataSetPO.relatedTableVoList[i].rtTableId;
                    singleNode.text = singleNode.fieldCaption + "[" + singleNode.fieldName + "]";
                    singleNode.nodeType = "TableField";
                    singleNode.id = singleNode.fieldId;
                    singleNode.icon = BaseUtility.GetRootPath()+"/Themes/Png16X16/page.png";
                    treeNodeArray.push(singleNode);
                }
            }

            this.tree.treeObj=$.fn.zTree.init($(this.$refs.zTreeUL), this.tree.treeSetting,treeNodeArray);
            this.tree.treeObj.expandAll(true);
            fuzzySearchTreeObj(this.tree.treeObj,this.$refs.txt_search_text.$refs.input,null,true);
        },
        selectColumn:function (fieldPO) {
            if(fieldPO.nodeType=="TableField"){
                this.bindToSearchField.columnTableName=fieldPO.tableName;
                this.bindToSearchField.columnName=fieldPO.fieldName;
                this.bindToSearchField.columnCaption=fieldPO.fieldCaption;
                this.bindToSearchField.columnDataTypeName=fieldPO.fieldDataType;
            }
        },
        getData:function(){
            console.log(this.bindToSearchField);
            return {
                bindToSearchField:this.bindToSearchField,
                defaultValue:this.defaultValue
            }
        },
        setData:function(bindToSearchField,defaultValue) {
            console.log(bindToSearchField);
            this.bindToSearchField = bindToSearchField;
            this.defaultValue = defaultValue;
            this.tempData.defaultDisplayText = JBuild4DSelectView.SelectEnvVariable.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
        },
        /*绑定默认值*/
        selectDefaultValueView:function () {
            window._SelectBindObj = this;
            window.parent.listDesign.selectDefaultValueDialogBegin(window,null);
        },
        setSelectEnvVariableResultValue:function(result){
            if(result!=null) {
                this.defaultValue.defaultType = result.Type;
                this.defaultValue.defaultValue = result.Value;
                this.defaultValue.defaultText = result.Text;
                this.tempData.defaultDisplayText = JBuild4DSelectView.SelectEnvVariable.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
            }
            else {
                this.defaultValue.defaultType = "";
                this.defaultValue.defaultValue = "";
                this.defaultValue.defaultText = "";
                this.tempData.defaultDisplayText = "";
            }
            //this.setCompleted();
        }
    },
    template: `<table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                    <colgroup>
                        <col style="width: 100px" />
                        <col style="width: 280px" />
                        <col />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>
                                标题：
                            </td>
                            <td>
                                <input type="text" v-model="bindToSearchField.columnTitle" />
                            </td>
                            <td rowspan="9" valign="top">
                                <i-input search class="input_border_bottom" ref="txt_search_text" placeholder="请输入列名或者标题"></i-input>\
                                <ul ref="zTreeUL" class="ztree div-custom-scroll" style="height: 430px;overflow-x:hidden;overflow-y: scroll"></ul>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                所属表：
                            </td>
                            <td>
                                {{bindToSearchField.columnTableName}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                绑定字段：
                            </td>
                            <td>
                                {{bindToSearchField.columnCaption}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                字段名称：
                            </td>
                            <td>
                                {{bindToSearchField.columnName}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                字段类型：
                            </td>
                            <td>
                                {{bindToSearchField.columnDataTypeName}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                运算符：
                            </td>
                            <td>
                                <i-select v-model="bindToSearchField.columnOperator" style="width:260px">
                                    <i-option value="eq">等于</i-option>
                                    <i-option value="like">匹配</i-option>
                                    <i-option value="not_eq">不等于</i-option>
                                    <i-option value="gt">大于</i-option>
                                    <i-option value="gt_eq">大于等于</i-option>
                                    <i-option value="lt">小于</i-option>
                                    <i-option value="lt_eq">小于等于</i-option>
                                    <i-option value="left_like">左匹配</i-option>
                                    <i-option value="right_like">右匹配</i-option>
                                    <i-option value="include">包含</i-option>
                                </i-select>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">默认值<button class="btn-select fright" v-on:click="selectDefaultValueView">...</button></td>
                        </tr>
                        <tr style="height: 35px">
                            <td colspan="2" style="background-color: #ffffff;">
                                {{tempData.defaultDisplayText}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                备注：
                            </td>
                            <td>
                                <textarea rows="8"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>`
});
