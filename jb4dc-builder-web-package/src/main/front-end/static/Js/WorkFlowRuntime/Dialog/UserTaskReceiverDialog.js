var userTaskReceiverDialogOuterVue;
var UserTaskReceiverDialogUtility={
    ShowDialog:function (sender,nextFlowNodeEntities,selectReceiverCompletedFunc){
        if(!userTaskReceiverDialogOuterVue) {
            $(document.body).append("<div id='userTaskReceiverDialog'><user-task-receiver-dialog ref='userTaskReceiverDialog'></user-task-receiver-dialog></div>");
            userTaskReceiverDialogOuterVue = new Vue({
                el: "#userTaskReceiverDialog",
                data: {
                    acInterface: {
                        getRuntimeModelWithStart: "/Rest/Workflow/RunTime/ModelRuntime/GetRuntimeModelWithStart",
                    }
                },
                mounted: function () {

                },
                methods: {

                }
            });
        }
        userTaskReceiverDialogOuterVue.$refs.userTaskReceiverDialog.beginSelectReceiver(sender,nextFlowNodeEntities,selectReceiverCompletedFunc);
    },
    CloseDialog:function(){
        DialogUtility.CloseDialogElem(userTaskReceiverDialogOuterVue.$refs.userTaskReceiverDialog.$refs.userTaskReceiverDialogWrap);
        userTaskReceiverDialogOuterVue=null;
        $("#userTaskReceiverDialog").remove();
    }
}

Vue.component("user-task-receiver-dialog", {
    data: function () {
        //var _self = this;
        return {
            acInterface: {
                //getAsyncReceivers:
            },
            nextFlowNodeEntities: [],
            receiverTree: {
                treeSetting: {
                    view: {
                        dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                        showLine: true,//是否显示节点之间的连线
                        fontCss: {'color': 'black', 'font-weight': 'normal'}
                    },
                    check: {
                        enable: false,
                        nocheckInherit: false,
                        /*chkStyle: "radio",*/
                        radioType: "all"
                    },
                    async: {
                        enable: true,
                        contentType: "application/x-www-form-urlencoded",
                        url: BaseUtility.BuildAction("/Rest/Workflow/RunTime/ReceiverRuntime/GetAsyncReceivers"),
                        autoParam: ["id", "typeName", "name"]
                    },
                    data: {
                        key: {
                            name: "name",
                            children: "runtimeReceiveUsers"
                        },
                        simpleData: { //简单数据模式
                            enable: true,
                            idKey: "id",
                            pIdKey: "parentId",
                            rootPId: null
                        }
                    },
                    callback: {
                        //点击树节点事件
                        onClick: function (event, treeId, treeNode) {
                            /*var _self=this.getZTreeObj(treeId)._host;
                            if (treeNode.nodeTypeName == "Table") {
                                _self.selectedTable(event,treeId,treeNode);
                            }
                            else{
                                _self.selectedTable(event,treeId,null);
                            }*/
                        },
                        onDblClick:function (event, treeId, treeNode){
                            var _this=this.getZTreeObj(treeId)._host;
                            var flowNodeEntity=this.getZTreeObj(treeId).flowNodeEntity;
                            var receiveType=this.getZTreeObj(treeId).receiveType;
                            _this.addReceiverToSelected(treeNode,flowNodeEntity,receiveType);
                        },
                        beforeAsync: function (treeId, treeNode) {
                            console.log(treeId);
                        }
                    }
                },
                treeObjMap: {}
            },
            selectedReceiver: {
                columnsConfig: [{
                    title: '已选用户1',
                    key: 'name',
                    width: 188,
                    align: "center"
                }, {
                    title: '操作',
                    slot: 'action',
                    width: 70,
                    align: "center"
                }],
                receiverData: []
            }
        }
    },
    mounted:function(){
    },
    filters:{
        filterReceiverData:function(receiverData,flowNodeEntity,receiveType) {
            return receiverData.filter(receiver=>receiver.flowNodeEntity.id==flowNodeEntity.id&&receiver.receiveType==receiveType);
            /*for (let i = 0; i < receiverData.length; i++) {

            }*/
        }
    },
    methods:{
        beginSelectReceiver:function (sender,nextFlowNodeEntities,selectReceiverCompletedFunc) {
            var _this=this;
            var elem=this.$refs.userTaskReceiverDialogWrap;

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 650,
                height: 600,
                title: "选择接收人员",
                resizable:false,
                buttons:{
                    "确认": function () {
                        if(_this.validateCompleteEnable().success) {
                            selectReceiverCompletedFunc.call(sender,_this.nextFlowNodeEntities,_this.selectedReceiver.receiverData);
                            //if (result.success) {
                            //   DialogUtility.CloseDialogElem(elem);
                            //}
                        }
                        /*if(typeof (_self.callBackFunc=="function")) {
                            var result={
                                editText:$(_self.$refs.txtContextVarJuelEdit).next().find(".CodeMirror-code").text(),
                                editValue:_self.selectedCodeMirror.getDoc().getValue()
                            };
                            _self.callBackFunc(result);
                        }
                        DialogUtility.CloseDialogElem(_self.$refs.editDialogWrap);*/
                    },
                    "取消": function () {
                        UserTaskReceiverDialogUtility.CloseDialog();
                    }
                },
                open: function (event, ui) {
                    $(".ui-dialog-titlebar-close", $(this).parent()).hide();
                }
            });

            this.nextFlowNodeEntities=nextFlowNodeEntities;

            window.setTimeout(this.initTree,500);
        },
        initTree:function (){
            for (let i = 0; i < this.nextFlowNodeEntities.length; i++) {
                var flowNodeEntity = this.nextFlowNodeEntities[i];
                if (flowNodeEntity.extensionElements && flowNodeEntity.extensionElements.jb4dcMainReceiveObjects && flowNodeEntity.extensionElements.jb4dcMainReceiveObjects.runtimeReceiveGroups) {
                    var treeObjKey = this.buildUlTreeId(flowNodeEntity, "main");
                    this.receiverTree.treeObjMap[treeObjKey] = $.fn.zTree.init($("#" + treeObjKey), this.receiverTree.treeSetting, flowNodeEntity.extensionElements.jb4dcMainReceiveObjects.runtimeReceiveGroups);
                    //this.receiverTree.treeObjMap[treeObjKey].expandAll(true);
                    this.receiverTree.treeObjMap[treeObjKey]._host = this;
                    this.receiverTree.treeObjMap[treeObjKey].flowNodeEntity = flowNodeEntity;
                    this.receiverTree.treeObjMap[treeObjKey].receiveType = "main";
                }
                if (flowNodeEntity.extensionElements && flowNodeEntity.extensionElements.jb4dcCCReceiveObjects && flowNodeEntity.extensionElements.jb4dcCCReceiveObjects.runtimeReceiveGroups) {
                    var treeObjKey = this.buildUlTreeId(flowNodeEntity, "cc");
                    this.receiverTree.treeObjMap[treeObjKey] = $.fn.zTree.init($("#" + treeObjKey), this.receiverTree.treeSetting, flowNodeEntity.extensionElements.jb4dcCCReceiveObjects.runtimeReceiveGroups);
                    //this.receiverTree.treeObjMap[treeObjKey].expandAll(true);
                    this.receiverTree.treeObjMap[treeObjKey]._host = this;
                    this.receiverTree.treeObjMap[treeObjKey].flowNodeEntity = flowNodeEntity;
                    this.receiverTree.treeObjMap[treeObjKey].receiveType = "cc";
                }
            }
        },
        buildUlTreeId:function (flowNodeEntity,receiveType) {
            return 'ulTree_' + receiveType + "_" + flowNodeEntity.id;
        },
        addTreeSelectedReceiverToSelected:function (flowNodeEntity,receiveType){
            var treeKey = this.buildUlTreeId(flowNodeEntity, receiveType);
            var treeObject=this.receiverTree.treeObjMap[treeKey];
            if(treeObject){
                var selectNodes=treeObject.getSelectedNodes();
                if(selectNodes&&selectNodes.length>0) {
                    this.addReceiverToSelected(selectNodes[0], flowNodeEntity, receiveType);
                    /*if(!ArrayUtility.Exist(this.selectedReceiver.receiverData,(tit)=>tit.id==selectNode[0].id)) {
                            selectNode[0].flowNodeEntity=flowNodeEntity;
                            selectNode[0].receiveType=receiveType;
                            this.selectedReceiver.receiverData.push(selectNode[0]);
                    }*/
                }
            }
        },
        addReceiverToSelected:function (selectNode,flowNodeEntity,receiveType) {
            var isMultiInstanceTask=this.isMultiInstanceTask(flowNodeEntity);
            var innerSingleId=flowNodeEntity.id + "_" + receiveType + "_" + selectNode.id;
            //debugger;
            if(selectNode.typeName=="SingleUser"){
                selectNode.innerSingleId = innerSingleId
                selectNode.flowNodeEntity = flowNodeEntity;
                selectNode.receiveType = receiveType;
                if((receiveType=="cc"||isMultiInstanceTask)&&
                    !ArrayUtility.Exist(this.selectedReceiver.receiverData,
                        (item) => {
                            return item.innerSingleId == innerSingleId}
                    )) {
                    this.selectedReceiver.receiverData.push(selectNode);
                }
                else if(receiveType=="main"&&!isMultiInstanceTask){
                    for (let i = 0; i < this.selectedReceiver.receiverData.length; i++) {
                        if(this.selectedReceiver.receiverData[i].flowNodeEntity.id==flowNodeEntity.id&&this.selectedReceiver.receiverData[i].receiveType==receiveType) {
                            ArrayUtility.Delete(this.selectedReceiver.receiverData, i);
                        }
                    }
                    this.selectedReceiver.receiverData.push(selectNode);
                }
            }
            else if(isMultiInstanceTask&&(selectNode.typeName=="Users"||selectNode.typeName=="Role"||selectNode.typeName=="Organs")) {
                if(selectNode.runtimeReceiveUsers!=null&&selectNode.runtimeReceiveUsers.length>0){
                    for (let i = 0; i < selectNode.runtimeReceiveUsers.length; i++) {
                        var childNode=selectNode.runtimeReceiveUsers[i];
                        if(childNode.typeName=="SingleUser") {
                            this.addReceiverToSelected(childNode, flowNodeEntity, receiveType);
                        }
                    }
                }
            }
        },
        clearSelectedReceiverToSelected:function (flowNodeEntity,receiveType){
            for (let i = this.selectedReceiver.receiverData.length-1; i >=0; i--) {
                var receiver = this.selectedReceiver.receiverData[i];
                if (receiver.flowNodeEntity.id == flowNodeEntity.id && receiver.receiveType == receiveType) {
                    ArrayUtility.Delete(this.selectedReceiver.receiverData, i);
                }
            }
        },
        deleteSelectedReceiver:function (index,row) {
            for (let i = 0; i < this.selectedReceiver.receiverData.length; i++) {
                if(this.selectedReceiver.receiverData[i].innerSingleId==row.innerSingleId){
                    ArrayUtility.Delete(this.selectedReceiver.receiverData,i);
                }
            }
        },
        isMultiInstanceTask:function (flowNodeEntity){
            return flowNodeEntity.multiInstanceTask;
            //return true;
        },
        buildTabLabel:function (flowNodeEntity) {
            return flowNodeEntity.name + " [" + (this.isMultiInstanceTask(flowNodeEntity) ? "多人" : "单人") + "]";
        },
        validateCompleteEnable:function (){
            var errorMessages=[];
            var success=true;
            for (let i = 0; i < this.nextFlowNodeEntities.length; i++) {
                if(this.nextFlowNodeEntities[i].taskTypeName=="com.jb4dc.workflow.po.bpmn.process.BpmnUserTask"){
                    if(!ArrayUtility.Exist(this.selectedReceiver.receiverData,item=>{return item.flowNodeEntity.id==this.nextFlowNodeEntities[i].id&&item.receiveType=="main" })){
                        errorMessages.push({
                            taskName:this.nextFlowNodeEntities[i].name,
                            flowNodeEntity:this.nextFlowNodeEntities[i],
                            message:"环节["+this.nextFlowNodeEntities[i].name+"]至少需要设置一个接收用户!"
                        })
                    }
                }
            }
            if(errorMessages.length>0) {
                var errorTextAry = [];
                for (let i = 0; i < errorMessages.length; i++) {
                    errorTextAry.push(errorMessages[i].message);
                }
                DialogUtility.AlertText(errorTextAry.join("<br />"), this);
                success = false;
            }
            return {
                success:success
            };
        }
    },
    template: `<div ref="userTaskReceiverDialogWrap" style="display: none">
                <tabs name="userTaskReceiverDialogTabs">
                    <tab-pane :label="buildTabLabel(flowNodeEntity)" tab="userTaskReceiverDialogTabs" v-for="flowNodeEntity in nextFlowNodeEntities" :key="flowNodeEntity.id">
                        <collapse accordion value="mainReceiver">
                            <panel name="mainReceiver">
                                主送人员
                                <div slot="content">
                                    <div class="user-task-receiver-dialog-outer-wrap">
                                        <div class="selectEnableUserList">
                                            <ul :id="buildUlTreeId(flowNodeEntity,'main')" class="ztree" style="width: 200px"></ul>
                                        </div>
                                        <div class="selectOpButtonContainer">
                                            <div class="single-op-button" title="添加人员" @click="addTreeSelectedReceiverToSelected(flowNodeEntity,'main')"><Icon type="md-arrow-round-forward" /></div>
                                            <div class="single-op-button" title="清空已选人员" @click="clearSelectedReceiverToSelected(flowNodeEntity,'main')"><Icon type="md-backspace" /></div>
                                        </div>
                                        <div class="selectedUserList">
                                            <i-table height="327" width="260" stripe :columns="selectedReceiver.columnsConfig" :data="selectedReceiver.receiverData | filterReceiverData(flowNodeEntity, 'main')"
                                                 class="iv-list-table" size="small">
                                                 <template slot-scope="{ row, index }" slot="action">
                                                    <div class="list-font-icon-button-class" @click="deleteSelectedReceiver(index,row)">
                                                        <Icon type="md-close" />
                                                    </div>
                                                </template>     
                                            </i-table>
                                        </div>
                                    </div>
                                </div>
                            </panel>
                            <panel name="ccReceiver">
                                抄送人员
                                <div slot="content">
                                    <div class="user-task-receiver-dialog-outer-wrap">
                                        <div class="selectEnableUserList">
                                            <ul :id="buildUlTreeId(flowNodeEntity,'cc')" class="ztree" style="width: 200px"></ul>
                                        </div>
                                        <div class="selectOpButtonContainer">
                                            <div class="single-op-button" title="添加人员" @click="addReceiverToSelected(flowNodeEntity,'cc')"><Icon type="md-arrow-round-forward" /></div>
                                            <div class="single-op-button" title="清空已选人员"><Icon type="md-backspace" /></div>
                                        </div>
                                        <div class="selectedUserList">
                                            <i-table height="327" width="260" stripe :columns="selectedReceiver.columnsConfig" :data="selectedReceiver.receiverData | filterReceiverData(flowNodeEntity, 'cc')"
                                                 class="iv-list-table" size="small">
                                                 <template slot-scope="{ row, index }" slot="action">
                                                    <div class="list-font-icon-button-class" @click="deleteSelectedReceiver(index,row)">
                                                        <Icon type="md-close" />
                                                    </div>
                                                </template>     
                                            </i-table>
                                        </div>
                                    </div>
                                </div>
                            </panel>
                        </collapse>
                    </tab-pane>
                </tabs>
            </div>`
});
