/*绑定一般信息的Vue组件*/
Vue.component("fd-control-datasource", {
    data: function () {
        return {
            acInterface:{
                getDDGroupTreeData:"/Rest/SystemSetting/Dict/DictionaryGroup/GetTreeData"
            },
            ddGroupTreeObj:null,
            ddGroupTreeSetting:{
                async : {
                    enable : true,
                    // Ajax 获取数据的 URL 地址
                    url :""
                },
                // 必须使用data
                data:{
                    key:{
                        name:"dictGroupText"
                    },
                    simpleData : {
                        enable : true,
                        idKey : "dictGroupId", // id编号命名
                        pIdKey : "dictGroupParentId",  // 父id编号命名
                        rootId : 0
                    }
                },
                // 回调函数
                callback : {
                    onClick : function(event, treeId, treeNode) {
                        var _self = this.getZTreeObj(treeId)._host;
                        _self.selectedDictionaryGroup(treeNode.dictGroupId,treeNode.dictGroupText);
                        //alert(treeNode.dictGroupId);
                        //_self.envGroupTreeNodeSelected(event,treeId,treeNode);
                    },
                    //成功的回调函数
                    onAsyncSuccess : function(event, treeId, treeNode, msg){
                        appList.treeObj.expandAll(true);
                    }
                }
            },
            normalDataSource: {
                defaultIsNull:"true",
                sqlDataSource:"",
                dictionaryGroupDataSourceId:"",
                dictionaryGroupDataSourceText:"",
                restDataSource:"",
                interfaceDataSource:"",
                staticDataSource:"",
                defaultSelected:"",
                layoutDirection:"vertical",
                rowNum:"0",
                displayValueInText:"false"
            },
            showSelectDictionary:false,
            showEditStatic:false,
            showProp:true
        }
    },
    //新增result的watch，监听变更同步到openStatus
    //监听父组件对props属性result的修改，并同步到组件内的data属性1
    watch: {
    },
    mounted: function () {
        this.initDDGroupTree();
    },
    methods: {
        getValue:function () {
            this.normalDataSource.sqlDataSource=encodeURIComponent(this.normalDataSource.sqlDataSource);
            return this.normalDataSource;
        },
        setValue:function (oldValue) {
            this.normalDataSource=oldValue;
            this.normalDataSource.sqlDataSource=decodeURIComponent(oldValue.sqlDataSource);
            this.$refs.sqlGeneralDesignComp.setValue(this.normalDataSource.sqlDataSource);
        },
        beginSelectDictionaryGroup:function () {
            this.showSelectDictionary=true;
            this.showProp=false;
        },
        selectedDictionaryGroup:function(dictionaryGroupDataSourceId,dictionaryGroupDataSourceText){
            this.normalDataSource.dictionaryGroupDataSourceId=dictionaryGroupDataSourceId;
            this.normalDataSource.dictionaryGroupDataSourceText=dictionaryGroupDataSourceText;
            this.showSelectDictionary=false;
            this.showProp=true;
        },
        initDDGroupTree:function () {
            //this.treeSetting.async.url = BaseUtility.BuildAction(this.acInterface.getGroupTreeData, {});
            //this.treeObj = $.fn.zTree.init($("#zTreeUL"), this.treeSetting);
            //debugger;
            //var _self=this;
            AjaxUtility.Post(this.acInterface.getDDGroupTreeData, {}, function (result) {
                //console.log(result);
                if(result.success){
                    if(result.data!=null&&result.data.length>0){
                        for(var i=0;i<result.data.length;i++) {
                            /*if(result.data[i].dsGroupIssystem=="是"&&result.data[i].dsGroupChildCount==0) {
                                result.data[i].icon = "../../../Themes/Png16X16/table_key.png";
                            }
                            else if(result.data[i].dsGroupIssystem=="否"&&result.data[i].dsGroupChildCount==0) {
                                result.data[i].icon = "../../../Themes/Png16X16/note_edit.png";
                            }
                            else if(result.data[i].dsGroupParentId=="-1"){
                                result.data[i].icon = "../../../Themes/Png16X16/package.png";
                            }*/
                        }
                    }
                    this.ddGroupTreeObj=$.fn.zTree.init($("#zTreeUL"), this.ddGroupTreeSetting,result.data);
                    this.ddGroupTreeObj.expandAll(true);
                    this.ddGroupTreeObj._host=this;
                }
            }, this);
        }
    },
    template: `<div>
                    <div v-show="showProp">
                        <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                            <colgroup>
                                <col style="width: 100px" />
                                <col style="width: 280px" />
                                <col style="width: 100px" />
                                <col />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <td>
                                        默认空：
                                    </td>
                                    <td>
                                        <radio-group type="button" style="margin: auto" v-model="normalDataSource.defaultIsNull">
                                            <radio label="true">是</radio>
                                            <radio label="false">否</radio>
                                        </radio-group>
                                    </td>
                                    <td colspan="2">
                                        获取数据源优先级别->本地接口->Rest接口->数据字典->sql->静态值
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        REST数据源：
                                    </td>
                                    <td colspan="3">
                                        <input type="text" v-model="normalDataSource.restDataSource" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        本地接口：
                                    </td>
                                    <td colspan="3">
                                        <input type="text" v-model="normalDataSource.interfaceDataSource" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        数据字典：
                                    </td>
                                    <td colspan="3">
                                        <div class="fleft">绑定数据字典:【<span style="color: red">{{normalDataSource.dictionaryGroupDataSourceText}}</span>】</div><button class="btn-select fright" v-on:click="beginSelectDictionaryGroup">...</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td rowspan="2">
                                        SQL数据源：
                                    </td>
                                    <td colspan="3">
                                        <span style="color: red">[ITEXT与IVALUE请使用大写]</span>示例:【SELECT '1' ITEXT,'2' IVALUE】
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="background-color: #FFFFFF">
                                        <sql-general-design-comp ref="sqlGeneralDesignComp" :sql-designer-height="74"  v-model="normalDataSource.sqlDataSource"></sql-general-design-comp>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        静态值：
                                    </td>
                                    <td colspan="3">
                                        <button class="btn-select fright">...</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        默认选中：
                                    </td>
                                    <td>
                                        <input type="text" v-model="normalDataSource.defaultSelected" />
                                    </td>
                                    <td>
                                        显示Value：
                                    </td>
                                    <td>
                                        <radio-group type="button" style="margin: auto" v-model="normalDataSource.displayValueInText">
                                            <radio label="true">是</radio>
                                            <radio label="false">否</radio>
                                        </radio-group>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        方向：
                                    </td>
                                    <td>
                                        <radio-group type="button" style="margin: auto" v-model="normalDataSource.layoutDirection">
                                            <radio label="vertical">垂直</radio>
                                            <radio label="horizontal">水平</radio>
                                        </radio-group>
                                    </td>
                                    <td>
                                        单列个数：
                                    </td>
                                    <td>
                                        <input type="text" v-model="normalDataSource.rowNum" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div name="selectDictionary" v-show="showSelectDictionary" style="position:relative;height: 490px">
                        <div style="position:absolute;top: 0px;bottom: 10px;right: 0px;left: 0px;overflow-y: auto;overflow-x: hidden">
                            <ul id="zTreeUL" class="ztree"></ul>
                        </div>
                    </div>
                    <div name="selectDictionary" v-show="showEditStatic">编辑静态值</div>
                </div>`
});
