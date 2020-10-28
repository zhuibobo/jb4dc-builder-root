/*窗体内按钮*/
Vue.component("inner-form-button-list-comp", {
    props:["formId"],
    data: function () {
        var _self=this;

        return {
            columnsConfig: [
                {
                    title: '标题',
                    key: 'caption',
                    align: "center"
                }, {
                    title: '类型',
                    key: 'buttonType',
                    align: "center"
                }, {
                    title: '操作',
                    key: 'id',
                    width: 200,
                    align: "center",
                    render: function (h, params) {
                        var buttons=[];
                        if(params.row.buttonType!="关闭按钮"){
                            buttons.push(ListPageUtility.IViewTableInnerButton.EditButton(h,params,"id",_self));
                        }
                        buttons.push(ListPageUtility.IViewTableInnerButton.DeleteButton(h,params,"id",_self));
                        buttons.push(ListPageUtility.IViewTableInnerButton.MoveUpButton(h,params,"id",_self));
                        buttons.push(ListPageUtility.IViewTableInnerButton.MoveDownButton(h,params,"id",_self));
                        return h('div',{class: "list-row-button-wrap"},buttons);
                    }
                }
            ],
            tableData: [
                /*{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                }*/
            ],
            innerSaveButtonEditData:{
                caption:"",
                saveAndClose:"true",
                apis:[],
                fields:[],
                //开发扩展
                id:"",
                buttonType:"保存按钮",
                custServerResolveMethod:"",
                custServerResolveMethodPara:"",
                custClientRendererMethod:"",
                custClientRendererMethodPara:"",
                custClientRendererAfterMethod:"",
                custClientRendererAfterMethodPara:"",
                custClientClickBeforeMethod:"",
                custClientClickBeforeMethodPara:"",
            },
            api:{
                acInterface: {
                    getAPIData: "/Rest/Builder/ApiItem/GetAPISForZTreeNodeList"
                },
                apiTreeObj: null,
                apiTreeSetting: {
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
                            pIdKey: "parentId",
                            rootPId: "-1"// 1
                        }
                    },
                    callback: {
                        //点击树节点事件
                        onClick: function (event, treeId, treeNode) {
                            //if (treeNode.nodeTypeName == "DataSet") {
                                _self.api.apiSelectData=treeNode;
                            //}
                        }
                    }
                },
                apiData:null,
                apiSelectData: null,
                editTableObject: null,
                editTableConfig: {
                    Status: "Edit",
                    AddAfterRowEvent: null,
                    DataField: "fieldName",
                    Templates: [
                        {
                            Title: "API名称",
                            BindName: "value",
                            Renderer: "EditTable_Label",
                            TitleCellClassName: "TitleCell",
                            Formater:function (value) {
                                return _self.getAPIText(value);
                            }
                            /*ClientDataSource: _self.api.apiSelectData*/
                        }, {
                            Title: "调用顺序",
                            BindName: "runTime",
                            Renderer: "EditTable_Select",
                            ClientDataSource: [{"Text": "之前", "Value": "之前"}, {"Text": "之后", "Value": "之后"}],
                            Width: 100
                        }
                    ],
                    RowIdCreater: function () {
                    },
                    TableClass: "edit-table",
                    RendererTo: "apiContainer",
                    TableId: "apiContainerTable",
                    TableAttrs: {cellpadding: "1", cellspacing: "1", border: "1"}
                }
            },
            field:{
                acInterface: {
                    getFormMainTableFields: "/Rest/Builder/Form/GetFormMainTableFields",
                },
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
                            Title:"默认值",
                            BindName:"defaultValue",
                            Renderer:"EditTable_SelectDefaultValue",
                            Hidden:false
                        },{
                            Title: "表ID",
                            BindName: "tableId",
                            Renderer: "EditTable_Label"
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
            oldFormId:"",
            innerJsClientButtonEditData:{
                caption:"",
                execAndClose:"true",
                //开发扩展
                id:"",
                buttonType:"脚本按钮",
                actionType:"reloadData",
                callJsMethod:"",
                custServerResolveMethod:"",
                custServerResolveMethodPara:"",
                custClientRendererMethod:"",
                custClientRendererMethodPara:"",
                custClientRendererAfterMethod:"",
                custClientRendererAfterMethodPara:"",
                custClientClickBeforeMethod:"",
                custClientClickBeforeMethodPara:"",
            }
        }
    },
    mounted:function(){

    },
    methods:{
        ready:function(tableDataJson){
            if(tableDataJson!=null&&tableDataJson!=""){
                this.tableData=JsonUtility.StringToJson(tableDataJson);
            }

            //由于切换绑定窗体时,绑定的主表可能不一样,所以不在页面初始化时绑定字段选择的表.
            //this.bindTableFields(null);

            this.bindAPITreeAndInitEditTable(null);
        },
        getJson:function () {
            //debugger;
            return JsonUtility.JsonToString(this.tableData);
        },
        /*setJson:function (tableDataJson) {
            if(tableDataJson!=null&&tableDataJson!=""){
                this.tableData=JsonUtility.StringToJson(tableDataJson);
            }
        },*/
        //region 列表按钮相关方法
        edit:function(id,params){
            //console.log(params);
            if(params.row["buttonType"]=="保存按钮"){
                this.editInnerFormSaveButton(params);
            }
            else if(params.row["buttonType"]=="脚本按钮"){
                this.editInnerFormJsClientButton(params);
            }
        },
        del:function(id,params){
            for(var i=0;i<this.tableData.length;i++) {
                if(this.tableData[i].id==id) {
                    ArrayUtility.Delete(this.tableData,i);
                }
            }
        },
        moveUp:function(id,params){
            for(var i=0;i<this.tableData.length;i++) {
                if(this.tableData[i].id==id) {
                    ArrayUtility.MoveUp(this.tableData,i);
                    return;
                    //console.log(id);
                }
            }
        },
        moveDown:function(id,params){
            //console.log(this.tableData);
            for(var i=0;i<this.tableData.length;i++) {
                if(this.tableData[i].id==id) {
                    ArrayUtility.MoveDown(this.tableData,i);
                    return
                    //console.log(id);
                }
            }
        },
        //endregion

        //region 保存按钮
        addInnerFormSaveButton:function(){
            //debugger;
            if(this.formId!=null&&this.formId!="") {
                this.editSaveButtonStatuc="add";
                //重置编辑表单
                this.resetInnerSaveButtonData();

                var elem = this.$refs.innerFormSaveButtonWrap;

                DialogUtility.DialogElemObj(elem, {
                    modal: true,
                    height: 520,
                    width: 720,
                    title: "窗体内保存按钮"
                });

                $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
                $(window.document).find(".ui-dialog").css("zIndex", 10101);

                this.innerSaveButtonEditData.id = "inner_form_save_button_" + StringUtility.Timestamp();

                this.bindTableFields(null);
                this.clearAPI();
            }
            else{
                DialogUtility.AlertText("请先设置绑定的窗体!");
            }
        },
        handleClose:function(dialogElem){
            DialogUtility.CloseDialogElem(this.$refs[dialogElem]);
        },
        editInnerFormSaveButton:function(params){
            this.addInnerFormSaveButton();
            this.innerSaveButtonEditData=JsonUtility.CloneStringify(params.row);
            this.editSaveButtonStatuc="edit";

            //if(this.isLoadTableField){
            //    this.field.editTableObject.RemoveAllRow();
            //    this.field.editTableObject.LoadJsonData(this.innerSaveButtonEditData.fields);
            //}
            this.bindAPITreeAndInitEditTable(this.innerSaveButtonEditData.apis);
            this.bindTableFields(this.innerSaveButtonEditData.fields);
        },
        resetInnerSaveButtonData:function(){
            this.innerSaveButtonEditData={
                    caption:"",
                    saveAndClose:"true",
                    apis:[],
                    fields:[],
                    id:"",
                    buttonType:"保存按钮",
                    custServerResolveMethod:"",
                    custServerResolveMethodPara:"",
                    custClientRendererMethod:"",
                    custClientRendererMethodPara:"",
                    custClientRendererAfterMethod:"",
                    custClientRendererAfterMethodPara:"",
                    custClientClickBeforeMethod:"",
                    custClientClickBeforeMethodPara:"",
            };
            //this.api.editTableObject.RemoveAllRow();
            //if(this.field.editTableObject) {
            //    this.field.editTableObject.RemoveAllRow();
            //}
        },
        saveInnerSaveButtonToList:function(){
            //保存到列表
            var singleInnerFormButtonData=JsonUtility.CloneSimple(this.innerSaveButtonEditData);
            this.api.editTableObject.CompletedEditingRow();
            singleInnerFormButtonData.apis=this.api.editTableObject.GetSerializeJson();
            this.field.editTableObject.CompletedEditingRow();
            singleInnerFormButtonData.fields=this.field.editTableObject.GetSerializeJson();
            //debugger;
            if(this.editSaveButtonStatuc=="add") {
                //存储到列表数据中
                this.tableData.push(singleInnerFormButtonData);
            }
            else{
                for(var i=0;i<this.tableData.length;i++){
                    if(this.tableData[i].id==singleInnerFormButtonData.id) {
                        //this.tableData[i]=singleInnerFormButtonData;
                        Vue.set(this.tableData, i, singleInnerFormButtonData);
                    }
                }
            }

            //console.log(singleInnerFormButtonData);

            this.handleClose("addInnerFormSaveButton");
        },
        //region 字段列表
        bindTableFields:function(oldData) {

            if(this.oldFormId!=this.formId) {
                AjaxUtility.Post(this.field.acInterface.getFormMainTableFields, {formId: this.formId}, function (result) {
                    console.log(result);
                    var fieldsData = [];

                    for (var i = 0; i < result.data.length; i++) {
                        fieldsData.push({
                            Value: result.data[i].fieldName,
                            Text: result.data[i].fieldCaption
                        });
                    }
                    this.field.editTableConfig.Templates[0].DefaultValue = {
                        Type: "Const",
                        Value: result.data[0].tableName
                    };
                    this.field.editTableConfig.Templates[3].DefaultValue = {
                        Type: "Const",
                        Value: result.data[0].tableId
                    };
                    this.field.editTableConfig.Templates[1].ClientDataSource = fieldsData;

                    if(!this.field.editTableObject) {
                        this.field.editTableObject = Object.create(EditTable);
                        this.field.editTableObject.Initialization(this.field.editTableConfig);
                    }

                    this.oldFormId = this.formId;

                    if(oldData){
                        this.field.editTableObject.LoadJsonData(oldData);
                    }

                }, this);
            }
            if(this.field.editTableObject){
                this.field.editTableObject.RemoveAllRow();
            }
            if(oldData&&this.field.editTableObject){
                this.field.editTableObject.LoadJsonData(oldData);
            }
        },
        addField:function(){
            this.field.editTableObject.AddEditingRowByTemplate();
        },
        removeField:function(){
            this.field.editTableObject.RemoveRow();
        },
        //endregion

        //region api列表
        bindAPITreeAndInitEditTable: function (oldData) {
            //var _self = this;
            if(!this.api.apiData) {
                AjaxUtility.Post(this.api.acInterface.getAPIData, {}, function (result) {
                    if (result.success) {
                        this.api.apiData = result.data;
                        if (result.data != null && result.data.length > 0) {
                            for (var i = 0; i < result.data.length; i++) {
                                if (result.data[i].nodeTypeName == "Group") {
                                    result.data[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/package.png";
                                } else {
                                    result.data[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/application_view_columns.png";
                                }
                            }
                        }

                        // _self.api.treeData = result.data;
                        this.api.apiTreeObj = $.fn.zTree.init($("#apiZTreeUL"), this.api.apiTreeSetting, result.data);
                        this.api.apiTreeObj.expandAll(true);
                        fuzzySearchTreeObj(this.api.apiTreeObj, this.$refs.txt_search_api_text.$refs.input, null, true);
                    } else {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                    }
                }, this);
                this.api.editTableObject = Object.create(EditTable);
                this.api.editTableObject.Initialization(this.api.editTableConfig);
            }
            this.api.editTableObject.RemoveAllRow();
            if(oldData) {
                this.api.editTableObject.LoadJsonData(oldData);
            }
        },
        getApiConfigAndBindToTable:function(){
            return;
            var _self=this;
            AjaxUtility.Post(this.api.acInterface.getButtonApiConfig,{},function (result) {
                //console.log(result);
                //var apiSelectData
                var apiSelectData=[];

                for(var i=0;i<result.data.length;i++){
                    var group={
                        Group:result.data[i].name
                    }
                    var options=[];
                    for(var j=0;j<result.data[i].buttonAPIVoList.length;j++){
                        options.push({
                            Value:result.data[i].buttonAPIVoList[j].id,
                            Text:result.data[i].buttonAPIVoList[j].name
                        });
                    }
                    group["Options"]=options;
                    apiSelectData.push(group);
                }

                /*configSource=[{
                    group:"name",
                    options:[{
                        value:"1",
                        text:"2"
                    },{
                        value:"",
                        text:""
                    }]
                },{
                    group:"name",
                    options:[{
                        value:"",
                        text:""
                    },{
                        value:"",
                        text:""
                    }]
                }]*/

                _self.api.editTableConfig.Templates[0].ClientDataSource=apiSelectData;
                _self.api.editTableObject = Object.create(EditTable);
                _self.api.editTableObject.Initialization(_self.api.editTableConfig);
            },this);
        },
        addAPI:function () {
            //console.log(this.api.apiSelectData);
            if(this.api.apiSelectData.nodeTypeName=="API") {
                this.api.editTableObject.AddEditingRowByTemplate([], {
                    value: this.api.apiSelectData.value,
                    runTime: "之后"
                });
            }
            else {
                DialogUtility.AlertText("请选择需要添加的API!");
            }
        },
        removeAPI:function () {
            this.api.editTableObject.RemoveRow();
        },
        clearAPI:function(){
            this.api.editTableObject.RemoveAllRow();
        },
        getAPIText:function (value) {
            //console.log(value);
            for (var i = 0; i < this.api.apiData.length; i++) {
                //debugger;
                //console.log(this.api.apiData[i]);
                if(this.api.apiData[i].nodeTypeName=="API"){
                    if(this.api.apiData[i].value==value){
                        return this.api.apiData[i].text;
                    }
                }
            }
            return "";
        },
        //endregion
        //endregion

        //region 关闭按钮
        addInnerFormCloseButton:function () {
            var closeButtonData={
                caption:"关闭",
                id:"inner_close_button_"+StringUtility.Timestamp(),
                buttonType:"关闭按钮"
            };
            this.tableData.push(closeButtonData);
        },
        //endregion

        //region 脚本按钮
        addInnerFormJsClientButton:function () {
            this.editJsClientButtonStatuc="add";
            //重置编辑表单
            this.resetInnerJsClientButtonData();

            var elem = this.$refs.innerFormJsClientButtonWrap;

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                height: 520,
                width: 720,
                title: "窗体内脚本按钮"
            });

            $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
            $(window.document).find(".ui-dialog").css("zIndex", 10101);

            this.innerJsClientButtonEditData.id = "inner_form_js_client_button_" + StringUtility.Timestamp();
        },
        editInnerFormJsClientButton:function(params){
            this.addInnerFormJsClientButton();
            this.innerJsClientButtonEditData=JsonUtility.CloneStringify(params.row);
            this.editJsClientButtonStatuc="edit";
        },
        resetInnerJsClientButtonData:function(){
            this.innerJsClientButtonEditData={
                caption:"",
                execAndClose:"true",
                id:"",
                buttonType:"脚本按钮",
                actionType:"reloadData",
                callJsMethod:"",
                custServerResolveMethod:"",
                custServerResolveMethodPara:"",
                custClientRendererMethod:"",
                custClientRendererMethodPara:"",
                custClientRendererAfterMethod:"",
                custClientRendererAfterMethodPara:"",
                custClientClickBeforeMethod:"",
                custClientClickBeforeMethodPara:"",
            };
        },
        saveInnerJsClientButtonToList:function () {
            //debugger;
            var singleInnerFormButtonData=JsonUtility.CloneSimple(this.innerJsClientButtonEditData);
            if(this.editJsClientButtonStatuc=="add") {
                //存储到列表数据中
                this.tableData.push(singleInnerFormButtonData);
            }
            else{
                for(var i=0;i<this.tableData.length;i++){
                    if(this.tableData[i].id==singleInnerFormButtonData.id) {
                        //this.tableData[i]=singleInnerFormButtonData;
                        Vue.set(this.tableData, i, singleInnerFormButtonData);
                    }
                }
            }

            //console.log(singleInnerFormButtonData);

            this.handleClose("innerFormJsClientButtonWrap");
        }
        //endregion
    },
    template: `<div style="height: 210px" class="iv-list-page-wrap">
                    <div ref="innerFormSaveButtonWrap" class="html-design-plugin-dialog-wraper general-edit-page-wrap" style="display: none;margin-top: 0px">
                        <tabs size="small" name="inner-form-save-button-edit-tabs">
                            <tab-pane tab="inner-form-save-button-edit-tabs" label="绑定信息">
                                <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                                    <colgroup>
                                        <col style="width: 60px" />
                                        <col style="width: 220px" />
                                        <col style="width: 100px" />
                                        <col />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>标题：</td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.caption" />
                                            </td>
                                            <td>保存并关闭：</td>
                                            <td>
                                                <radio-group type="button" style="margin: auto" v-model="innerSaveButtonEditData.saveAndClose">
                                                    <radio label="true">是</radio>
                                                    <radio label="false">否</radio>
                                                </radio-group>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>字段：</td>
                                            <td colspan="3">
                                                <div style="height: 140px">
                                                    <div style="float: left;width: 94%">
                                                        <div id="fieldContainer" class="edit-table-wrap" style="height: 310px;overflow: auto;width: 98%;margin: auto"></div>
                                                    </div>
                                                    <div style="float: right;width: 5%">
                                                        <button-group vertical>
                                                            <i-button size="small" type="success" icon="md-add" @click="addField"></i-button>
                                                            <i-button size="small" type="primary" icon="md-close" @click="removeField"></i-button>
                                                        </button-group>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </tab-pane>
                            <tab-pane tab="inner-form-save-button-edit-tabs" label="API设置">
                                <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                                    <colgroup>
                                        <col style="width: 320px" />
                                        <col style="width: 60px" />
                                        <col />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td style="background: #ffffff">
                                                <i-input search class="input_border_bottom" ref="txt_search_api_text" placeholder="请输入API名称"></i-input>
                                                <ul id="apiZTreeUL" class="ztree" style="height: 320px;overflow: auto"></ul>
                                            </td>
                                            <td style="text-align: center;background-color: #f8f8f8">
                                                <button-group vertical>
                                                    <i-button size="small" type="success" icon="md-add" @click="addAPI"></i-button>
                                                    <i-button size="small" type="primary" icon="md-close" @click="removeAPI"></i-button>
                                                    <i-button size="small" type="primary" icon="ios-trash" @click="clearAPI"></i-button>
                                                </button-group>
                                            </td>
                                            <td style="background: #ffffff;" valign="top">
                                                <div id="apiContainer" class="edit-table-wrap" style="height: 340px;overflow: auto;width: 98%;margin: auto"></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </tab-pane>
                            <tab-pane tab="inner-form-save-button-edit-tabs" label="开发扩展">
                                <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                                    <colgroup>
                                        <col style="width: 150px" />
                                        <col />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>ID：</td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.id" size="small" placeholder="" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>服务端解析类：</td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custServerResolveMethod" size="small" placeholder="按钮进行服务端解析时,类全称,将调用该类,需要实现接口IFormButtonCustResolve" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>参数：</td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custServerResolveMethodPara" size="small" placeholder="服务端解析类的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>客户端渲染方法：</td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custClientRendererMethod" size="small" placeholder="客户端渲染方法,按钮将经由该方法渲染,最终形成页面元素,需要返回最终元素的HTML对象" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>参数：</td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custClientRendererMethodPara" size="small" placeholder="客户端渲染方法的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>客户端渲染后方法：</td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custClientRendererAfterMethod" size="small" placeholder="客户端渲染后调用方法,经过默认的渲染,无返回值" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>参数：</td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custClientRendererAfterMethodPara" size="small" placeholder="客户端渲染后方法的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>客户端点击前方法：</td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custClientClickBeforeMethod" size="small" placeholder="客户端点击该按钮时的前置方法,如果返回false将阻止默认调用" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>参数：</td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custClientClickBeforeMethodPara" size="small" placeholder="客户端点击前方法的参数" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </tab-pane>
                        </tabs>
                        <div class="button-outer-wrap" style="padding-top:4px">
                            <div class="button-inner-wrap" style="margin-right: 4px">
                                <button-group>
                                    <i-button type="primary" @click="saveInnerSaveButtonToList()"> 保 存</i-button>
                                    <i-button @click="handleClose('innerFormSaveButtonWrap')">关 闭</i-button>
                                </button-group>
                            </div>
                        </div>
                    </div>
                    <div ref="innerFormJsClientButtonWrap" class="html-design-plugin-dialog-wraper general-edit-page-wrap" style="display: none;margin-top: 0px">
                        <tabs size="small" name="inner-form-js-client-button-edit-tabs">
                            <tab-pane tab="inner-form-js-client-button-edit-tabs" label="绑定信息">
                                <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                                    <colgroup>
                                        <col style="width: 80px" />
                                        <col style="width: 220px" />
                                        <col style="width: 100px" />
                                        <col />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>标题：</td>
                                            <td>
                                                <i-input v-model="innerJsClientButtonEditData.caption" />
                                            </td>
                                            <td>保存并关闭：</td>
                                            <td>
                                                <radio-group type="button" style="margin: auto" v-model="innerJsClientButtonEditData.execAndClose">
                                                    <radio label="true">是</radio>
                                                    <radio label="false">否</radio>
                                                </radio-group>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>动作：</td>
                                            <td colspan="3">
                                                <radio-group type="button" style="margin: auto" v-model="innerJsClientButtonEditData.actionType">
                                                    <radio label="reloadData">重新加载</radio>
                                                    <radio label="callJsMethod">调用JS方法</radio>
                                                </radio-group>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>执行方法：</td>
                                            <td colspan="3">
                                                <i-input v-model="innerJsClientButtonEditData.callJsMethod" placeholder="调用JS方法" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </tab-pane>
                            <tab-pane tab="inner-form-js-client-button-edit-tabs" label="开发扩展">
                                <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                                    <colgroup>
                                        <col style="width: 150px" />
                                        <col />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>ID：</td>
                                            <td>
                                                <i-input v-model="innerJsClientButtonEditData.id" size="small" placeholder="" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>服务端解析类：</td>
                                            <td>
                                                <i-input v-model="innerJsClientButtonEditData.custServerResolveMethod" size="small" placeholder="按钮进行服务端解析时,类全称,将调用该类,需要实现接口IFormButtonCustResolve" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>参数：</td>
                                            <td>
                                                <i-input v-model="innerJsClientButtonEditData.custServerResolveMethodPara" size="small" placeholder="服务端解析类的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>客户端渲染方法：</td>
                                            <td>
                                                <i-input v-model="innerJsClientButtonEditData.custClientRendererMethod" size="small" placeholder="客户端渲染方法,按钮将经由该方法渲染,最终形成页面元素,需要返回最终元素的HTML对象" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>参数：</td>
                                            <td>
                                                <i-input v-model="innerJsClientButtonEditData.custClientRendererMethodPara" size="small" placeholder="客户端渲染方法的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>客户端渲染后方法：</td>
                                            <td>
                                                <i-input v-model="innerJsClientButtonEditData.custClientRendererAfterMethod" size="small" placeholder="客户端渲染后调用方法,经过默认的渲染,无返回值" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>参数：</td>
                                            <td>
                                                <i-input v-model="innerJsClientButtonEditData.custClientRendererAfterMethodPara" size="small" placeholder="客户端渲染后方法的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>客户端点击前方法：</td>
                                            <td>
                                                <i-input v-model="innerJsClientButtonEditData.custClientClickBeforeMethod" size="small" placeholder="客户端点击该按钮时的前置方法,如果返回false将阻止默认调用" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>参数：</td>
                                            <td>
                                                <i-input v-model="innerJsClientButtonEditData.custClientClickBeforeMethodPara" size="small" placeholder="客户端点击前方法的参数" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </tab-pane>
                        </tabs>
                        <div class="button-outer-wrap" style="padding-top:4px">
                            <div class="button-inner-wrap" style="margin-right: 4px">
                                <button-group>
                                    <i-button type="primary" @click="saveInnerJsClientButtonToList()"> 保 存</i-button>
                                    <i-button @click="handleClose('innerFormJsClientButtonWrap')">关 闭</i-button>
                                </button-group>
                            </div>
                        </div>
                    </div>
                    <div style="height: 210px;width: 100%">
                        <div style="float: left;width: 82%">
                            <i-table :height="210" width="100%" stripe border :columns="columnsConfig" :data="tableData"
                                                     class="iv-list-table" :highlight-row="true"
                                                     size="small"></i-table>
                        </div>
                        <div style="float: left;width: 15%;margin-left: 8px">
                            <button-group vertical>
                                <i-button type="success" @click="addInnerFormSaveButton()" icon="md-add">保存按钮</i-button>
                                <i-button type="primary" @click="addInnerFormCloseButton()" icon="md-add">关闭按钮</i-button>
                                <i-button type="primary" @click="addInnerFormJsClientButton()" icon="md-add">脚本按钮</i-button>
                                <i-button size="small" icon="md-add" disabled>意见按钮</i-button>
                                <i-button size="small" icon="md-add" disabled>流程按钮</i-button>
                                <i-button size="small" disabled icon="md-add">拷贝Json</i-button>
                                <i-button size="small" disabled icon="md-add">黏贴Json</i-button>
                            </button-group>
                        </div>
                    </div>
                </div>`
});