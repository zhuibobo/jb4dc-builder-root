"use strict";

var ActionsRuntimeObject = {
  CreateALLActionButton: function CreateALLActionButton(flowModelRuntimePO, flowModelRuntimePOCacheKey, jb4dcActions, formRuntimeInst, isStartInstanceStatus, pageHostInstance, currentNodeKey, currentNodeName, recordId, modelId, modelReKey, currentTaskId) {
    if (jb4dcActions && jb4dcActions.jb4dcActionList) {
      var buttonElem;

      for (var i = 0; i < jb4dcActions.jb4dcActionList.length; i++) {
        var actionObj = jb4dcActions.jb4dcActionList[i];

        if (actionObj.juelRunResultPO.booleanResult) {
          if (actionObj.actionType == "send") {
            var sendActionObject = Object.create(WorkFlowSendAction);
            buttonElem = sendActionObject.Instance(flowModelRuntimePO, flowModelRuntimePOCacheKey, jb4dcActions, formRuntimeInst, actionObj, isStartInstanceStatus, pageHostInstance, currentNodeKey, currentNodeName, recordId, modelId, modelReKey, currentTaskId);
          }

          $("#flowWorkActionButtonWrapOuter").append(buttonElem.elem);
        }
      }
    }
  },
  GetActionObj: function GetActionObj() {
    return {
      actionAutoSend: "false",
      actionCCReceiveObjects: "[]",
      actionCallApis: "[]",
      actionCallComplete: "true",
      actionCallJsMethod: null,
      actionCaption: "草稿",
      actionCode: "action_516009775",
      actionConfirm: "false",
      actionDisplayConditionEditText: null,
      actionDisplayConditionEditValue: null,
      actionExecuteVariables: "[]",
      actionHTMLClass: null,
      actionHTMLId: null,
      actionMainReceiveObjects: "[]",
      actionRunSqls: "[]",
      actionSendMessageId: null,
      actionSendSignalId: null,
      actionShowOpinionDialog: "false",
      actionType: "send",
      actionUpdateFields: "[]",
      actionValidate: "无",
      actionsOpinionBindToElemId: null,
      actionsOpinionBindToField: null,
      juelRunResultPO: {
        booleanResult: true,
        message: "",
        stringResult: "",
        success: true
      }
    };
  }
};
"use strict";

var FlowRuntimePageObject = {
  _webFormRTParas: null,
  _formRuntimeInst: null,
  FORM_RUNTIME_CATEGORY_FLOW: "IsDependenceFlow",
  pageReadyForStartStatus: function pageReadyForStartStatus(isStartInstanceStatus, rendererChainCompletedFunc, flowModelRuntimePO, flowModelRuntimePOCacheKey, pageHostInstance, currentNodeKey, currentNodeName, modelId, modelReKey, currentTaskId) {
    this._formRuntimeInst = Object.create(FormRuntime);
    var recordId = StringUtility.Guid();

    this._formRuntimeInst.Initialization({
      "RendererToId": "htmlDesignRuntimeWrap",
      "FormId": flowModelRuntimePO.jb4dcFormId,
      "RecordId": recordId,
      "ButtonId": "",
      "OperationType": BaseUtility.GetAddOperationName(),
      "IsPreview": false,
      "RendererChainCompletedFunc": rendererChainCompletedFunc,
      "ListFormButtonElemId": "",
      "WebFormRTParas": {},
      "FormRuntimeCategory": FlowRuntimePageObject.FORM_RUNTIME_CATEGORY_FLOW,
      "PreHandleFormHtmlRuntimeFunc": this.preHandleFormHtmlRuntimeFunc,
      "flowModelRuntimePO": flowModelRuntimePO,
      "flowModelRuntimePOCacheKey": flowModelRuntimePOCacheKey,
      "isStartInstanceStatus": isStartInstanceStatus,
      "currentNodeKey": currentNodeKey,
      "currentNodeName": currentNodeName,
      "modelId": modelId,
      "modelReKey": modelReKey,
      "currentTaskId": currentTaskId
    });

    this.rendererActionButtons(flowModelRuntimePO, flowModelRuntimePOCacheKey, this._formRuntimeInst, isStartInstanceStatus, pageHostInstance, currentNodeKey, currentNodeName, recordId, modelId, modelReKey, currentTaskId);
    return this._formRuntimeInst;
  },
  rendererActionButtons: function rendererActionButtons(flowModelRuntimePO, flowModelRuntimePOCacheKey, formRuntimeInst, isStartInstanceStatus, pageHostInstance, currentNodeKey, currentNodeName, recordId, modelId, modelReKey, currentTaskId) {
    ActionsRuntimeObject.CreateALLActionButton(flowModelRuntimePO, flowModelRuntimePOCacheKey, flowModelRuntimePO.jb4dcActions, formRuntimeInst, isStartInstanceStatus, pageHostInstance, currentNodeKey, currentNodeName, recordId, modelId, modelReKey, currentTaskId);
  },
  preHandleFormHtmlRuntimeFunc: function preHandleFormHtmlRuntimeFunc(sourceRuntimeHtml, formRuntimeInst, propConfig) {
    var flowPageContainer = $("<div>" + sourceRuntimeHtml + "<div>");
    var flowModelRuntimePO = propConfig.flowModelRuntimePO;

    if (flowPageContainer.children("[singlename='WFDCT_TabContainer']").length == 0) {
      flowPageContainer = $("<div><div class=\"wfdct-tabs-outer-wrap-runtime html-design-theme-default-root-elem-class\" control_category=\"ContainerControl\" desc=\"\" groupname=\"\" id=\"tabs_wrap_518627616\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" name=\"tabs_wrap_518627616\" placeholder=\"\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WFDCT_TabContainer\" status=\"enable\" style=\"\" client_resolve=\"WFDCT_TabContainer\"><div>");
      flowPageContainer.children("[singlename='WFDCT_TabContainer']").append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_form_999\">" + flowModelRuntimePO.modelName + "</div>");
      flowPageContainer.children("[singlename='WFDCT_TabContainer']").append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_form_999\">" + sourceRuntimeHtml + "</div>");
    }

    var tabContainer = flowPageContainer.children("[singlename='WFDCT_TabContainer']");

    if (flowModelRuntimePO.jb4dcContentDocumentPlugin == "uploadConvertToPDFPlugin") {
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_uploadConvertToPDFPlugin_999\">正文</div>");
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_uploadConvertToPDFPlugin_999\">" + DocumentContentUploadConvertToPDFPlugin.getHtmlElem() + "</div>");
    } else if (flowModelRuntimePO.jb4dcContentDocumentPlugin == "wpsOnlineDocumentPlugin") {
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_wpsOnlineDocumentPlugin_999\">正文</div>");
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_wpsOnlineDocumentPlugin_999\">未实现</div>");
    }

    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_modeler_999\">流程图</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_modeler_999\"></div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_sequence_999\">顺序图</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_sequence_999\"></div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_task_999\">流转信息</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_task_999\"></div>");
    var newRuntimeHtml = flowPageContainer.html();
    return newRuntimeHtml;
  }
};
"use strict";

var FlowRuntimeVarBuilder = {
  BuilderSelectedReceiverToInstanceVar: function BuilderSelectedReceiverToInstanceVar(nextFlowNodeEntities, selectedReceiverData) {
    var resultData = [];

    for (var i = 0; i < selectedReceiverData.length; i++) {
      var receiver = selectedReceiverData[i];
      resultData.push({
        nodeId: receiver.flowNodeEntity.id,
        receiverId: receiver.id,
        receiverName: receiver.name,
        receiverTypeName: receiver.typeName,
        receiveType: receiver.receiveType
      });
    }

    return resultData;
  }
};
"use strict";
"use strict";
"use strict";
"use strict";
"use strict";

var WorkFlowSendAction = {
  acInterface: {
    resolveNextPossibleFlowNode: "/Rest/Workflow/RunTime/Client/InstanceRuntime/ResolveNextPossibleFlowNode",
    completeTask: "/Rest/Workflow/RunTime/Client/InstanceRuntime/CompleteTask"
  },
  _Prop: {},
  Instance: function Instance(flowModelRuntimePO, flowModelRuntimePOCacheKey, jb4dcActions, formRuntimeInst, actionObj, isStartInstanceStatus, pageHostInstance, currentNodeKey, currentNodeName, recordId, modelId, modelReKey, currentTaskId) {
    console.log(actionObj);
    var htmlId = actionObj.actionHTMLId ? actionObj.actionHTMLId : actionObj.actionCode;
    var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');
    this._Prop = {
      "sender": this,
      "flowModelRuntimePO": flowModelRuntimePO,
      "flowModelRuntimePOCacheKey": flowModelRuntimePOCacheKey,
      "jb4dcActions": jb4dcActions,
      "formRuntimeInst": formRuntimeInst,
      "actionObj": actionObj,
      "isStartInstanceStatus": isStartInstanceStatus,
      "pageHostInstance": pageHostInstance,
      "currentNodeKey": currentNodeKey,
      "currentNodeName": currentNodeName,
      "recordId": recordId,
      "modelId": modelId,
      "modelReKey": modelReKey,
      "currentTaskId": currentTaskId
    };
    elem.bind("click", this._Prop, this.ButtonClickEvent);
    return {
      elem: elem
    };
  },
  ButtonClickEvent: function ButtonClickEvent(sender) {
    var validateResult = ValidateRulesRuntime.ValidateSubmitEnable();

    if (ValidateRulesRuntime.AlertValidateErrors(validateResult)) {
      DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "");
      var _prop = sender.data;
      var _this = _prop.sender;

      var sendData = _this.BuildSendToServerData(_prop, null);

      if (sendData.success) {
        AjaxUtility.Post(_this.acInterface.resolveNextPossibleFlowNode, sendData.data, function (result) {
          DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
          console.log(result);
          UserTaskReceiverDialogUtility.ShowDialog(_prop.sender, result.data, _prop.sender.SelectReceiverCompleted);
        }, _prop.sender);
      }
    }
  },
  SelectReceiverCompleted: function SelectReceiverCompleted(nextTaskEntityList, selectedReceiverData) {
    console.log(selectedReceiverData);
    console.log(this._Prop.actionObj.actionCaption);
    DialogUtility.Confirm(window, "确认执行发送?", function () {
      var selectedReceiverVars = FlowRuntimeVarBuilder.BuilderSelectedReceiverToInstanceVar(nextTaskEntityList, selectedReceiverData);
      var sendData = this.BuildSendToServerData(this._Prop, {
        selectedReceiverVars: encodeURIComponent(JsonUtility.JsonToString(selectedReceiverVars))
      });

      if (sendData.success) {
        DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "系统处理中,请稍候!");
        AjaxUtility.Post(this.acInterface.completeTask, sendData.data, function (result) {
          DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);

          if (result.success) {
            DialogUtility.Confirm(window, result.message, function () {}, this);
          } else {
            DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, result.data.message);
          }
        }, this._Prop.sender);
      }
    }, this);
  },
  BuildSendToServerData: function BuildSendToServerData(_prop, appendSendMap) {
    var formDataComplexPO = _prop.formRuntimeInst.SerializationFormData();

    var result = {
      success: true,
      data: {
        isStartInstanceStatus: _prop.isStartInstanceStatus,
        actionCode: _prop.actionObj.actionCode,
        flowModelRuntimePOCacheKey: _prop.flowModelRuntimePOCacheKey,
        "formRecordComplexPOString": encodeURIComponent(JsonUtility.JsonToString(formDataComplexPO)),
        "currentNodeKey": _prop.currentNodeKey,
        "currentNodeName": _prop.currentNodeName,
        "recordId": _prop.recordId,
        "modelId": _prop.modelId,
        "modelReKey": _prop.modelReKey,
        "currentTaskId": _prop.currentTaskId
      }
    };

    if (appendSendMap) {
      for (var key in appendSendMap) {
        result.data[key] = appendSendMap[key];
      }
    }

    return result;
  }
};
"use strict";

var userTaskReceiverDialogOuterVue;
var UserTaskReceiverDialogUtility = {
  ShowDialog: function ShowDialog(sender, nextFlowNodeEntities, selectReceiverCompletedFunc) {
    if (!userTaskReceiverDialogOuterVue) {
      $(document.body).append("<div id='userTaskReceiverDialog'><user-task-receiver-dialog ref='userTaskReceiverDialog'></user-task-receiver-dialog></div>");
      userTaskReceiverDialogOuterVue = new Vue({
        el: "#userTaskReceiverDialog",
        data: {
          acInterface: {
            getRuntimeModelWithStart: "/Rest/Workflow/RunTime/Client/ModelRuntime/GetRuntimeModelWithStart"
          }
        },
        mounted: function mounted() {},
        methods: {}
      });
    }

    userTaskReceiverDialogOuterVue.$refs.userTaskReceiverDialog.beginSelectReceiver(sender, nextFlowNodeEntities, selectReceiverCompletedFunc);
  },
  CloseDialog: function CloseDialog() {
    DialogUtility.CloseDialogElem(userTaskReceiverDialogOuterVue.$refs.userTaskReceiverDialog.$refs.userTaskReceiverDialogWrap);
    userTaskReceiverDialogOuterVue = null;
    $("#userTaskReceiverDialog").remove();
  }
};
Vue.component("user-task-receiver-dialog", {
  data: function data() {
    return {
      acInterface: {},
      nextFlowNodeEntities: [],
      receiverTree: {
        treeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: false,
            nocheckInherit: false,
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
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "parentId",
              rootPId: null
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {},
            onDblClick: function onDblClick(event, treeId, treeNode) {
              var _this = this.getZTreeObj(treeId)._host;

              var flowNodeEntity = this.getZTreeObj(treeId).flowNodeEntity;
              var receiveType = this.getZTreeObj(treeId).receiveType;

              _this.addReceiverToSelected(treeNode, flowNodeEntity, receiveType);
            },
            beforeAsync: function beforeAsync(treeId, treeNode) {
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
    };
  },
  mounted: function mounted() {},
  filters: {
    filterReceiverData: function filterReceiverData(receiverData, flowNodeEntity, receiveType) {
      return receiverData.filter(function (receiver) {
        return receiver.flowNodeEntity.id == flowNodeEntity.id && receiver.receiveType == receiveType;
      });
    }
  },
  methods: {
    beginSelectReceiver: function beginSelectReceiver(sender, nextFlowNodeEntities, selectReceiverCompletedFunc) {
      var _this = this;

      var elem = this.$refs.userTaskReceiverDialogWrap;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 650,
        height: 600,
        title: "选择接收人员",
        resizable: false,
        buttons: {
          "确认": function _() {
            if (_this.validateCompleteEnable().success) {
              selectReceiverCompletedFunc.call(sender, _this.nextFlowNodeEntities, _this.selectedReceiver.receiverData);
            }
          },
          "取消": function _() {
            UserTaskReceiverDialogUtility.CloseDialog();
          }
        },
        open: function open(event, ui) {
          $(".ui-dialog-titlebar-close", $(this).parent()).hide();
        }
      });
      this.nextFlowNodeEntities = nextFlowNodeEntities;
      window.setTimeout(this.initTree, 500);
    },
    initTree: function initTree() {
      for (var i = 0; i < this.nextFlowNodeEntities.length; i++) {
        var flowNodeEntity = this.nextFlowNodeEntities[i];

        if (flowNodeEntity.extensionElements && flowNodeEntity.extensionElements.jb4dcMainReceiveObjects && flowNodeEntity.extensionElements.jb4dcMainReceiveObjects.runtimeReceiveGroups) {
          var treeObjKey = this.buildUlTreeId(flowNodeEntity, "main");
          this.receiverTree.treeObjMap[treeObjKey] = $.fn.zTree.init($("#" + treeObjKey), this.receiverTree.treeSetting, flowNodeEntity.extensionElements.jb4dcMainReceiveObjects.runtimeReceiveGroups);
          this.receiverTree.treeObjMap[treeObjKey]._host = this;
          this.receiverTree.treeObjMap[treeObjKey].flowNodeEntity = flowNodeEntity;
          this.receiverTree.treeObjMap[treeObjKey].receiveType = "main";
        }

        if (flowNodeEntity.extensionElements && flowNodeEntity.extensionElements.jb4dcCCReceiveObjects && flowNodeEntity.extensionElements.jb4dcCCReceiveObjects.runtimeReceiveGroups) {
          var treeObjKey = this.buildUlTreeId(flowNodeEntity, "cc");
          this.receiverTree.treeObjMap[treeObjKey] = $.fn.zTree.init($("#" + treeObjKey), this.receiverTree.treeSetting, flowNodeEntity.extensionElements.jb4dcCCReceiveObjects.runtimeReceiveGroups);
          this.receiverTree.treeObjMap[treeObjKey]._host = this;
          this.receiverTree.treeObjMap[treeObjKey].flowNodeEntity = flowNodeEntity;
          this.receiverTree.treeObjMap[treeObjKey].receiveType = "cc";
        }
      }
    },
    buildUlTreeId: function buildUlTreeId(flowNodeEntity, receiveType) {
      return 'ulTree_' + receiveType + "_" + flowNodeEntity.id;
    },
    addTreeSelectedReceiverToSelected: function addTreeSelectedReceiverToSelected(flowNodeEntity, receiveType) {
      var treeKey = this.buildUlTreeId(flowNodeEntity, receiveType);
      var treeObject = this.receiverTree.treeObjMap[treeKey];

      if (treeObject) {
        var selectNodes = treeObject.getSelectedNodes();

        if (selectNodes && selectNodes.length > 0) {
          this.addReceiverToSelected(selectNodes[0], flowNodeEntity, receiveType);
        }
      }
    },
    addReceiverToSelected: function addReceiverToSelected(selectNode, flowNodeEntity, receiveType) {
      var isMultiInstanceTask = this.isMultiInstanceTask(flowNodeEntity);
      var innerSingleId = flowNodeEntity.id + "_" + receiveType + "_" + selectNode.id;

      if (selectNode.typeName == "SingleUser") {
        selectNode.innerSingleId = innerSingleId;
        selectNode.flowNodeEntity = flowNodeEntity;
        selectNode.receiveType = receiveType;

        if ((receiveType == "cc" || isMultiInstanceTask) && !ArrayUtility.Exist(this.selectedReceiver.receiverData, function (item) {
          return item.innerSingleId == innerSingleId;
        })) {
          this.selectedReceiver.receiverData.push(selectNode);
        } else if (receiveType == "main" && !isMultiInstanceTask) {
          for (var i = 0; i < this.selectedReceiver.receiverData.length; i++) {
            if (this.selectedReceiver.receiverData[i].flowNodeEntity.id == flowNodeEntity.id && this.selectedReceiver.receiverData[i].receiveType == receiveType) {
              ArrayUtility.Delete(this.selectedReceiver.receiverData, i);
            }
          }

          this.selectedReceiver.receiverData.push(selectNode);
        }
      } else if (isMultiInstanceTask && (selectNode.typeName == "Users" || selectNode.typeName == "Role" || selectNode.typeName == "Organs")) {
        if (selectNode.runtimeReceiveUsers != null && selectNode.runtimeReceiveUsers.length > 0) {
          for (var _i = 0; _i < selectNode.runtimeReceiveUsers.length; _i++) {
            var childNode = selectNode.runtimeReceiveUsers[_i];

            if (childNode.typeName == "SingleUser") {
              this.addReceiverToSelected(childNode, flowNodeEntity, receiveType);
            }
          }
        }
      }
    },
    clearSelectedReceiverToSelected: function clearSelectedReceiverToSelected(flowNodeEntity, receiveType) {
      for (var i = this.selectedReceiver.receiverData.length - 1; i >= 0; i--) {
        var receiver = this.selectedReceiver.receiverData[i];

        if (receiver.flowNodeEntity.id == flowNodeEntity.id && receiver.receiveType == receiveType) {
          ArrayUtility.Delete(this.selectedReceiver.receiverData, i);
        }
      }
    },
    deleteSelectedReceiver: function deleteSelectedReceiver(index, row) {
      for (var i = 0; i < this.selectedReceiver.receiverData.length; i++) {
        if (this.selectedReceiver.receiverData[i].innerSingleId == row.innerSingleId) {
          ArrayUtility.Delete(this.selectedReceiver.receiverData, i);
        }
      }
    },
    isMultiInstanceTask: function isMultiInstanceTask(flowNodeEntity) {
      return flowNodeEntity.multiInstanceTask;
    },
    buildTabLabel: function buildTabLabel(flowNodeEntity) {
      return flowNodeEntity.name + " [" + (this.isMultiInstanceTask(flowNodeEntity) ? "多人" : "单人") + "]";
    },
    validateCompleteEnable: function validateCompleteEnable() {
      var _this2 = this;

      var errorMessages = [];
      var success = true;

      var _loop = function _loop(i) {
        if (_this2.nextFlowNodeEntities[i].taskTypeName == "com.jb4dc.workflow.po.bpmn.process.BpmnUserTask") {
          if (!ArrayUtility.Exist(_this2.selectedReceiver.receiverData, function (item) {
            return item.flowNodeEntity.id == _this2.nextFlowNodeEntities[i].id && item.receiveType == "main";
          })) {
            errorMessages.push({
              taskName: _this2.nextFlowNodeEntities[i].name,
              flowNodeEntity: _this2.nextFlowNodeEntities[i],
              message: "环节[" + _this2.nextFlowNodeEntities[i].name + "]至少需要设置一个接收用户!"
            });
          }
        }
      };

      for (var i = 0; i < this.nextFlowNodeEntities.length; i++) {
        _loop(i);
      }

      if (errorMessages.length > 0) {
        var errorTextAry = [];

        for (var i = 0; i < errorMessages.length; i++) {
          errorTextAry.push(errorMessages[i].message);
        }

        DialogUtility.AlertText(errorTextAry.join("<br />"), this);
        success = false;
      }

      return {
        success: success
      };
    }
  },
  template: "<div ref=\"userTaskReceiverDialogWrap\" style=\"display: none\">\n                <tabs name=\"userTaskReceiverDialogTabs\">\n                    <tab-pane :label=\"buildTabLabel(flowNodeEntity)\" tab=\"userTaskReceiverDialogTabs\" v-for=\"flowNodeEntity in nextFlowNodeEntities\" :key=\"flowNodeEntity.id\">\n                        <collapse accordion value=\"mainReceiver\">\n                            <panel name=\"mainReceiver\">\n                                \u4E3B\u9001\u4EBA\u5458\n                                <div slot=\"content\">\n                                    <div class=\"user-task-receiver-dialog-outer-wrap\">\n                                        <div class=\"selectEnableUserList\">\n                                            <ul :id=\"buildUlTreeId(flowNodeEntity,'main')\" class=\"ztree\" style=\"width: 200px\"></ul>\n                                        </div>\n                                        <div class=\"selectOpButtonContainer\">\n                                            <div class=\"single-op-button\" title=\"\u6DFB\u52A0\u4EBA\u5458\" @click=\"addTreeSelectedReceiverToSelected(flowNodeEntity,'main')\"><Icon type=\"md-arrow-round-forward\" /></div>\n                                            <div class=\"single-op-button\" title=\"\u6E05\u7A7A\u5DF2\u9009\u4EBA\u5458\" @click=\"clearSelectedReceiverToSelected(flowNodeEntity,'main')\"><Icon type=\"md-backspace\" /></div>\n                                        </div>\n                                        <div class=\"selectedUserList\">\n                                            <i-table height=\"327\" width=\"260\" stripe :columns=\"selectedReceiver.columnsConfig\" :data=\"selectedReceiver.receiverData | filterReceiverData(flowNodeEntity, 'main')\"\n                                                 class=\"iv-list-table\" size=\"small\">\n                                                 <template slot-scope=\"{ row, index }\" slot=\"action\">\n                                                    <div class=\"list-font-icon-button-class\" @click=\"deleteSelectedReceiver(index,row)\">\n                                                        <Icon type=\"md-close\" />\n                                                    </div>\n                                                </template>     \n                                            </i-table>\n                                        </div>\n                                    </div>\n                                </div>\n                            </panel>\n                            <panel name=\"ccReceiver\">\n                                \u6284\u9001\u4EBA\u5458\n                                <div slot=\"content\">\n                                    <div class=\"user-task-receiver-dialog-outer-wrap\">\n                                        <div class=\"selectEnableUserList\">\n                                            <ul :id=\"buildUlTreeId(flowNodeEntity,'cc')\" class=\"ztree\" style=\"width: 200px\"></ul>\n                                        </div>\n                                        <div class=\"selectOpButtonContainer\">\n                                            <div class=\"single-op-button\" title=\"\u6DFB\u52A0\u4EBA\u5458\" @click=\"addReceiverToSelected(flowNodeEntity,'cc')\"><Icon type=\"md-arrow-round-forward\" /></div>\n                                            <div class=\"single-op-button\" title=\"\u6E05\u7A7A\u5DF2\u9009\u4EBA\u5458\"><Icon type=\"md-backspace\" /></div>\n                                        </div>\n                                        <div class=\"selectedUserList\">\n                                            <i-table height=\"327\" width=\"260\" stripe :columns=\"selectedReceiver.columnsConfig\" :data=\"selectedReceiver.receiverData | filterReceiverData(flowNodeEntity, 'cc')\"\n                                                 class=\"iv-list-table\" size=\"small\">\n                                                 <template slot-scope=\"{ row, index }\" slot=\"action\">\n                                                    <div class=\"list-font-icon-button-class\" @click=\"deleteSelectedReceiver(index,row)\">\n                                                        <Icon type=\"md-close\" />\n                                                    </div>\n                                                </template>     \n                                            </i-table>\n                                        </div>\n                                    </div>\n                                </div>\n                            </panel>\n                        </collapse>\n                    </tab-pane>\n                </tabs>\n            </div>"
});
"use strict";

var DocumentContentUploadConvertToPDFPlugin = {
  getHtmlElem: function getHtmlElem() {
    return "<div \n                    control_category=\"InputControl\" \n                    id=\"document_content_upload_convert_to_pdf_plugin\" \n                    is_jbuild4dc_data=\"true\" \n                    jbuild4dc_custom=\"true\" \n                    name=\"document_content_upload_convert_to_pdf_plugin\" \n                    serialize=\"false\" \n                    singlename=\"WFDCT_DocumentContentUploadConvertToPDFContainer\" \n                    status=\"enable\" \n                    style=\"\" \n                    >\n                    \u672A\u5F00\u53D1!\n                </div>";
  }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGlvbnNSdW50aW1lT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVQYWdlT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVWYXJCdWlsZGVyLmpzIiwiQWN0aW9ucy9DYWxsQmFja0FjdGlvbi5qcyIsIkFjdGlvbnMvSnVtcFRvQW55Tm9kZUFjdGlvbi5qcyIsIkFjdGlvbnMvUmVCb290SW5zdGFuY2VBY3Rpb24uanMiLCJBY3Rpb25zL1RlbXBTYXZlQWN0aW9uLmpzIiwiQWN0aW9ucy9Xb3JrRmxvd1NlbmRBY3Rpb24uanMiLCJEaWFsb2cvVXNlclRhc2tSZWNlaXZlckRpYWxvZy5qcyIsIlBsdWdpbnMvRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQ0FBO0FDQUE7QUNBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IldvcmtGbG93UnVudGltZUZ1bGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIEFjdGlvbnNSdW50aW1lT2JqZWN0ID0ge1xuICBDcmVhdGVBTExBY3Rpb25CdXR0b246IGZ1bmN0aW9uIENyZWF0ZUFMTEFjdGlvbkJ1dHRvbihmbG93TW9kZWxSdW50aW1lUE8sIGZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5LCBqYjRkY0FjdGlvbnMsIGZvcm1SdW50aW1lSW5zdCwgaXNTdGFydEluc3RhbmNlU3RhdHVzLCBwYWdlSG9zdEluc3RhbmNlLCBjdXJyZW50Tm9kZUtleSwgY3VycmVudE5vZGVOYW1lLCByZWNvcmRJZCwgbW9kZWxJZCwgbW9kZWxSZUtleSwgY3VycmVudFRhc2tJZCkge1xuICAgIGlmIChqYjRkY0FjdGlvbnMgJiYgamI0ZGNBY3Rpb25zLmpiNGRjQWN0aW9uTGlzdCkge1xuICAgICAgdmFyIGJ1dHRvbkVsZW07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgamI0ZGNBY3Rpb25zLmpiNGRjQWN0aW9uTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYWN0aW9uT2JqID0gamI0ZGNBY3Rpb25zLmpiNGRjQWN0aW9uTGlzdFtpXTtcblxuICAgICAgICBpZiAoYWN0aW9uT2JqLmp1ZWxSdW5SZXN1bHRQTy5ib29sZWFuUmVzdWx0KSB7XG4gICAgICAgICAgaWYgKGFjdGlvbk9iai5hY3Rpb25UeXBlID09IFwic2VuZFwiKSB7XG4gICAgICAgICAgICB2YXIgc2VuZEFjdGlvbk9iamVjdCA9IE9iamVjdC5jcmVhdGUoV29ya0Zsb3dTZW5kQWN0aW9uKTtcbiAgICAgICAgICAgIGJ1dHRvbkVsZW0gPSBzZW5kQWN0aW9uT2JqZWN0Lkluc3RhbmNlKGZsb3dNb2RlbFJ1bnRpbWVQTywgZmxvd01vZGVsUnVudGltZVBPQ2FjaGVLZXksIGpiNGRjQWN0aW9ucywgZm9ybVJ1bnRpbWVJbnN0LCBhY3Rpb25PYmosIGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgcGFnZUhvc3RJbnN0YW5jZSwgY3VycmVudE5vZGVLZXksIGN1cnJlbnROb2RlTmFtZSwgcmVjb3JkSWQsIG1vZGVsSWQsIG1vZGVsUmVLZXksIGN1cnJlbnRUYXNrSWQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQoXCIjZmxvd1dvcmtBY3Rpb25CdXR0b25XcmFwT3V0ZXJcIikuYXBwZW5kKGJ1dHRvbkVsZW0uZWxlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIEdldEFjdGlvbk9iajogZnVuY3Rpb24gR2V0QWN0aW9uT2JqKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY3Rpb25BdXRvU2VuZDogXCJmYWxzZVwiLFxuICAgICAgYWN0aW9uQ0NSZWNlaXZlT2JqZWN0czogXCJbXVwiLFxuICAgICAgYWN0aW9uQ2FsbEFwaXM6IFwiW11cIixcbiAgICAgIGFjdGlvbkNhbGxDb21wbGV0ZTogXCJ0cnVlXCIsXG4gICAgICBhY3Rpb25DYWxsSnNNZXRob2Q6IG51bGwsXG4gICAgICBhY3Rpb25DYXB0aW9uOiBcIuiNieeov1wiLFxuICAgICAgYWN0aW9uQ29kZTogXCJhY3Rpb25fNTE2MDA5Nzc1XCIsXG4gICAgICBhY3Rpb25Db25maXJtOiBcImZhbHNlXCIsXG4gICAgICBhY3Rpb25EaXNwbGF5Q29uZGl0aW9uRWRpdFRleHQ6IG51bGwsXG4gICAgICBhY3Rpb25EaXNwbGF5Q29uZGl0aW9uRWRpdFZhbHVlOiBudWxsLFxuICAgICAgYWN0aW9uRXhlY3V0ZVZhcmlhYmxlczogXCJbXVwiLFxuICAgICAgYWN0aW9uSFRNTENsYXNzOiBudWxsLFxuICAgICAgYWN0aW9uSFRNTElkOiBudWxsLFxuICAgICAgYWN0aW9uTWFpblJlY2VpdmVPYmplY3RzOiBcIltdXCIsXG4gICAgICBhY3Rpb25SdW5TcWxzOiBcIltdXCIsXG4gICAgICBhY3Rpb25TZW5kTWVzc2FnZUlkOiBudWxsLFxuICAgICAgYWN0aW9uU2VuZFNpZ25hbElkOiBudWxsLFxuICAgICAgYWN0aW9uU2hvd09waW5pb25EaWFsb2c6IFwiZmFsc2VcIixcbiAgICAgIGFjdGlvblR5cGU6IFwic2VuZFwiLFxuICAgICAgYWN0aW9uVXBkYXRlRmllbGRzOiBcIltdXCIsXG4gICAgICBhY3Rpb25WYWxpZGF0ZTogXCLml6BcIixcbiAgICAgIGFjdGlvbnNPcGluaW9uQmluZFRvRWxlbUlkOiBudWxsLFxuICAgICAgYWN0aW9uc09waW5pb25CaW5kVG9GaWVsZDogbnVsbCxcbiAgICAgIGp1ZWxSdW5SZXN1bHRQTzoge1xuICAgICAgICBib29sZWFuUmVzdWx0OiB0cnVlLFxuICAgICAgICBtZXNzYWdlOiBcIlwiLFxuICAgICAgICBzdHJpbmdSZXN1bHQ6IFwiXCIsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH1cbiAgICB9O1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRmxvd1J1bnRpbWVQYWdlT2JqZWN0ID0ge1xuICBfd2ViRm9ybVJUUGFyYXM6IG51bGwsXG4gIF9mb3JtUnVudGltZUluc3Q6IG51bGwsXG4gIEZPUk1fUlVOVElNRV9DQVRFR09SWV9GTE9XOiBcIklzRGVwZW5kZW5jZUZsb3dcIixcbiAgcGFnZVJlYWR5Rm9yU3RhcnRTdGF0dXM6IGZ1bmN0aW9uIHBhZ2VSZWFkeUZvclN0YXJ0U3RhdHVzKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgcmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmMsIGZsb3dNb2RlbFJ1bnRpbWVQTywgZmxvd01vZGVsUnVudGltZVBPQ2FjaGVLZXksIHBhZ2VIb3N0SW5zdGFuY2UsIGN1cnJlbnROb2RlS2V5LCBjdXJyZW50Tm9kZU5hbWUsIG1vZGVsSWQsIG1vZGVsUmVLZXksIGN1cnJlbnRUYXNrSWQpIHtcbiAgICB0aGlzLl9mb3JtUnVudGltZUluc3QgPSBPYmplY3QuY3JlYXRlKEZvcm1SdW50aW1lKTtcbiAgICB2YXIgcmVjb3JkSWQgPSBTdHJpbmdVdGlsaXR5Lkd1aWQoKTtcblxuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdC5Jbml0aWFsaXphdGlvbih7XG4gICAgICBcIlJlbmRlcmVyVG9JZFwiOiBcImh0bWxEZXNpZ25SdW50aW1lV3JhcFwiLFxuICAgICAgXCJGb3JtSWRcIjogZmxvd01vZGVsUnVudGltZVBPLmpiNGRjRm9ybUlkLFxuICAgICAgXCJSZWNvcmRJZFwiOiByZWNvcmRJZCxcbiAgICAgIFwiQnV0dG9uSWRcIjogXCJcIixcbiAgICAgIFwiT3BlcmF0aW9uVHlwZVwiOiBCYXNlVXRpbGl0eS5HZXRBZGRPcGVyYXRpb25OYW1lKCksXG4gICAgICBcIklzUHJldmlld1wiOiBmYWxzZSxcbiAgICAgIFwiUmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmNcIjogcmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmMsXG4gICAgICBcIkxpc3RGb3JtQnV0dG9uRWxlbUlkXCI6IFwiXCIsXG4gICAgICBcIldlYkZvcm1SVFBhcmFzXCI6IHt9LFxuICAgICAgXCJGb3JtUnVudGltZUNhdGVnb3J5XCI6IEZsb3dSdW50aW1lUGFnZU9iamVjdC5GT1JNX1JVTlRJTUVfQ0FURUdPUllfRkxPVyxcbiAgICAgIFwiUHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuY1wiOiB0aGlzLnByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmMsXG4gICAgICBcImZsb3dNb2RlbFJ1bnRpbWVQT1wiOiBmbG93TW9kZWxSdW50aW1lUE8sXG4gICAgICBcImZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5XCI6IGZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgXCJpc1N0YXJ0SW5zdGFuY2VTdGF0dXNcIjogaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgXCJjdXJyZW50Tm9kZUtleVwiOiBjdXJyZW50Tm9kZUtleSxcbiAgICAgIFwiY3VycmVudE5vZGVOYW1lXCI6IGN1cnJlbnROb2RlTmFtZSxcbiAgICAgIFwibW9kZWxJZFwiOiBtb2RlbElkLFxuICAgICAgXCJtb2RlbFJlS2V5XCI6IG1vZGVsUmVLZXksXG4gICAgICBcImN1cnJlbnRUYXNrSWRcIjogY3VycmVudFRhc2tJZFxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXJlckFjdGlvbkJ1dHRvbnMoZmxvd01vZGVsUnVudGltZVBPLCBmbG93TW9kZWxSdW50aW1lUE9DYWNoZUtleSwgdGhpcy5fZm9ybVJ1bnRpbWVJbnN0LCBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHBhZ2VIb3N0SW5zdGFuY2UsIGN1cnJlbnROb2RlS2V5LCBjdXJyZW50Tm9kZU5hbWUsIHJlY29yZElkLCBtb2RlbElkLCBtb2RlbFJlS2V5LCBjdXJyZW50VGFza0lkKTtcbiAgICByZXR1cm4gdGhpcy5fZm9ybVJ1bnRpbWVJbnN0O1xuICB9LFxuICByZW5kZXJlckFjdGlvbkJ1dHRvbnM6IGZ1bmN0aW9uIHJlbmRlcmVyQWN0aW9uQnV0dG9ucyhmbG93TW9kZWxSdW50aW1lUE8sIGZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5LCBmb3JtUnVudGltZUluc3QsIGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgcGFnZUhvc3RJbnN0YW5jZSwgY3VycmVudE5vZGVLZXksIGN1cnJlbnROb2RlTmFtZSwgcmVjb3JkSWQsIG1vZGVsSWQsIG1vZGVsUmVLZXksIGN1cnJlbnRUYXNrSWQpIHtcbiAgICBBY3Rpb25zUnVudGltZU9iamVjdC5DcmVhdGVBTExBY3Rpb25CdXR0b24oZmxvd01vZGVsUnVudGltZVBPLCBmbG93TW9kZWxSdW50aW1lUE9DYWNoZUtleSwgZmxvd01vZGVsUnVudGltZVBPLmpiNGRjQWN0aW9ucywgZm9ybVJ1bnRpbWVJbnN0LCBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHBhZ2VIb3N0SW5zdGFuY2UsIGN1cnJlbnROb2RlS2V5LCBjdXJyZW50Tm9kZU5hbWUsIHJlY29yZElkLCBtb2RlbElkLCBtb2RlbFJlS2V5LCBjdXJyZW50VGFza0lkKTtcbiAgfSxcbiAgcHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuYzogZnVuY3Rpb24gcHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuYyhzb3VyY2VSdW50aW1lSHRtbCwgZm9ybVJ1bnRpbWVJbnN0LCBwcm9wQ29uZmlnKSB7XG4gICAgdmFyIGZsb3dQYWdlQ29udGFpbmVyID0gJChcIjxkaXY+XCIgKyBzb3VyY2VSdW50aW1lSHRtbCArIFwiPGRpdj5cIik7XG4gICAgdmFyIGZsb3dNb2RlbFJ1bnRpbWVQTyA9IHByb3BDb25maWcuZmxvd01vZGVsUnVudGltZVBPO1xuXG4gICAgaWYgKGZsb3dQYWdlQ29udGFpbmVyLmNoaWxkcmVuKFwiW3NpbmdsZW5hbWU9J1dGRENUX1RhYkNvbnRhaW5lciddXCIpLmxlbmd0aCA9PSAwKSB7XG4gICAgICBmbG93UGFnZUNvbnRhaW5lciA9ICQoXCI8ZGl2PjxkaXYgY2xhc3M9XFxcIndmZGN0LXRhYnMtb3V0ZXItd3JhcC1ydW50aW1lIGh0bWwtZGVzaWduLXRoZW1lLWRlZmF1bHQtcm9vdC1lbGVtLWNsYXNzXFxcIiBjb250cm9sX2NhdGVnb3J5PVxcXCJDb250YWluZXJDb250cm9sXFxcIiBkZXNjPVxcXCJcXFwiIGdyb3VwbmFtZT1cXFwiXFxcIiBpZD1cXFwidGFic193cmFwXzUxODYyNzYxNlxcXCIgaXNfamJ1aWxkNGRjX2RhdGE9XFxcImZhbHNlXFxcIiBqYnVpbGQ0ZGNfY3VzdG9tPVxcXCJ0cnVlXFxcIiBuYW1lPVxcXCJ0YWJzX3dyYXBfNTE4NjI3NjE2XFxcIiBwbGFjZWhvbGRlcj1cXFwiXFxcIiBzZXJpYWxpemU9XFxcImZhbHNlXFxcIiBzaG93X3JlbW92ZV9idXR0b249XFxcImZhbHNlXFxcIiBzaW5nbGVuYW1lPVxcXCJXRkRDVF9UYWJDb250YWluZXJcXFwiIHN0YXR1cz1cXFwiZW5hYmxlXFxcIiBzdHlsZT1cXFwiXFxcIiBjbGllbnRfcmVzb2x2ZT1cXFwiV0ZEQ1RfVGFiQ29udGFpbmVyXFxcIj48ZGl2PlwiKTtcbiAgICAgIGZsb3dQYWdlQ29udGFpbmVyLmNoaWxkcmVuKFwiW3NpbmdsZW5hbWU9J1dGRENUX1RhYkNvbnRhaW5lciddXCIpLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfZmxvd19mb3JtXzk5OVxcXCI+XCIgKyBmbG93TW9kZWxSdW50aW1lUE8ubW9kZWxOYW1lICsgXCI8L2Rpdj5cIik7XG4gICAgICBmbG93UGFnZUNvbnRhaW5lci5jaGlsZHJlbihcIltzaW5nbGVuYW1lPSdXRkRDVF9UYWJDb250YWluZXInXVwiKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfZm9ybV85OTlcXFwiPlwiICsgc291cmNlUnVudGltZUh0bWwgKyBcIjwvZGl2PlwiKTtcbiAgICB9XG5cbiAgICB2YXIgdGFiQ29udGFpbmVyID0gZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIik7XG5cbiAgICBpZiAoZmxvd01vZGVsUnVudGltZVBPLmpiNGRjQ29udGVudERvY3VtZW50UGx1Z2luID09IFwidXBsb2FkQ29udmVydFRvUERGUGx1Z2luXCIpIHtcbiAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X3VwbG9hZENvbnZlcnRUb1BERlBsdWdpbl85OTlcXFwiPuato+aWhzwvZGl2PlwiKTtcbiAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X3VwbG9hZENvbnZlcnRUb1BERlBsdWdpbl85OTlcXFwiPlwiICsgRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luLmdldEh0bWxFbGVtKCkgKyBcIjwvZGl2PlwiKTtcbiAgICB9IGVsc2UgaWYgKGZsb3dNb2RlbFJ1bnRpbWVQTy5qYjRkY0NvbnRlbnREb2N1bWVudFBsdWdpbiA9PSBcIndwc09ubGluZURvY3VtZW50UGx1Z2luXCIpIHtcbiAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X3dwc09ubGluZURvY3VtZW50UGx1Z2luXzk5OVxcXCI+5q2j5paHPC9kaXY+XCIpO1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfd3BzT25saW5lRG9jdW1lbnRQbHVnaW5fOTk5XFxcIj7mnKrlrp7njrA8L2Rpdj5cIik7XG4gICAgfVxuXG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfZmxvd19tb2RlbGVyXzk5OVxcXCI+5rWB56iL5Zu+PC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfbW9kZWxlcl85OTlcXFwiPjwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X3NlcXVlbmNlXzk5OVxcXCI+6aG65bqP5Zu+PC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfc2VxdWVuY2VfOTk5XFxcIj48L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfZmxvd190YXNrXzk5OVxcXCI+5rWB6L2s5L+h5oGvPC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfdGFza185OTlcXFwiPjwvZGl2PlwiKTtcbiAgICB2YXIgbmV3UnVudGltZUh0bWwgPSBmbG93UGFnZUNvbnRhaW5lci5odG1sKCk7XG4gICAgcmV0dXJuIG5ld1J1bnRpbWVIdG1sO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRmxvd1J1bnRpbWVWYXJCdWlsZGVyID0ge1xuICBCdWlsZGVyU2VsZWN0ZWRSZWNlaXZlclRvSW5zdGFuY2VWYXI6IGZ1bmN0aW9uIEJ1aWxkZXJTZWxlY3RlZFJlY2VpdmVyVG9JbnN0YW5jZVZhcihuZXh0Rmxvd05vZGVFbnRpdGllcywgc2VsZWN0ZWRSZWNlaXZlckRhdGEpIHtcbiAgICB2YXIgcmVzdWx0RGF0YSA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3RlZFJlY2VpdmVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJlY2VpdmVyID0gc2VsZWN0ZWRSZWNlaXZlckRhdGFbaV07XG4gICAgICByZXN1bHREYXRhLnB1c2goe1xuICAgICAgICBub2RlSWQ6IHJlY2VpdmVyLmZsb3dOb2RlRW50aXR5LmlkLFxuICAgICAgICByZWNlaXZlcklkOiByZWNlaXZlci5pZCxcbiAgICAgICAgcmVjZWl2ZXJOYW1lOiByZWNlaXZlci5uYW1lLFxuICAgICAgICByZWNlaXZlclR5cGVOYW1lOiByZWNlaXZlci50eXBlTmFtZSxcbiAgICAgICAgcmVjZWl2ZVR5cGU6IHJlY2VpdmVyLnJlY2VpdmVUeXBlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0RGF0YTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdvcmtGbG93U2VuZEFjdGlvbiA9IHtcbiAgYWNJbnRlcmZhY2U6IHtcbiAgICByZXNvbHZlTmV4dFBvc3NpYmxlRmxvd05vZGU6IFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvSW5zdGFuY2VSdW50aW1lL1Jlc29sdmVOZXh0UG9zc2libGVGbG93Tm9kZVwiLFxuICAgIGNvbXBsZXRlVGFzazogXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9JbnN0YW5jZVJ1bnRpbWUvQ29tcGxldGVUYXNrXCJcbiAgfSxcbiAgX1Byb3A6IHt9LFxuICBJbnN0YW5jZTogZnVuY3Rpb24gSW5zdGFuY2UoZmxvd01vZGVsUnVudGltZVBPLCBmbG93TW9kZWxSdW50aW1lUE9DYWNoZUtleSwgamI0ZGNBY3Rpb25zLCBmb3JtUnVudGltZUluc3QsIGFjdGlvbk9iaiwgaXNTdGFydEluc3RhbmNlU3RhdHVzLCBwYWdlSG9zdEluc3RhbmNlLCBjdXJyZW50Tm9kZUtleSwgY3VycmVudE5vZGVOYW1lLCByZWNvcmRJZCwgbW9kZWxJZCwgbW9kZWxSZUtleSwgY3VycmVudFRhc2tJZCkge1xuICAgIGNvbnNvbGUubG9nKGFjdGlvbk9iaik7XG4gICAgdmFyIGh0bWxJZCA9IGFjdGlvbk9iai5hY3Rpb25IVE1MSWQgPyBhY3Rpb25PYmouYWN0aW9uSFRNTElkIDogYWN0aW9uT2JqLmFjdGlvbkNvZGU7XG4gICAgdmFyIGVsZW0gPSAkKCc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm9wZXJhdGlvbi1idXR0b24gb3BlcmF0aW9uLWJ1dHRvbi1wcmltYXJ5XCIgaWQ9XCInICsgaHRtbElkICsgJ1wiPjxzcGFuPicgKyBhY3Rpb25PYmouYWN0aW9uQ2FwdGlvbiArICc8L3NwYW4+PC9idXR0b24+Jyk7XG4gICAgdGhpcy5fUHJvcCA9IHtcbiAgICAgIFwic2VuZGVyXCI6IHRoaXMsXG4gICAgICBcImZsb3dNb2RlbFJ1bnRpbWVQT1wiOiBmbG93TW9kZWxSdW50aW1lUE8sXG4gICAgICBcImZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5XCI6IGZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgXCJqYjRkY0FjdGlvbnNcIjogamI0ZGNBY3Rpb25zLFxuICAgICAgXCJmb3JtUnVudGltZUluc3RcIjogZm9ybVJ1bnRpbWVJbnN0LFxuICAgICAgXCJhY3Rpb25PYmpcIjogYWN0aW9uT2JqLFxuICAgICAgXCJpc1N0YXJ0SW5zdGFuY2VTdGF0dXNcIjogaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgXCJwYWdlSG9zdEluc3RhbmNlXCI6IHBhZ2VIb3N0SW5zdGFuY2UsXG4gICAgICBcImN1cnJlbnROb2RlS2V5XCI6IGN1cnJlbnROb2RlS2V5LFxuICAgICAgXCJjdXJyZW50Tm9kZU5hbWVcIjogY3VycmVudE5vZGVOYW1lLFxuICAgICAgXCJyZWNvcmRJZFwiOiByZWNvcmRJZCxcbiAgICAgIFwibW9kZWxJZFwiOiBtb2RlbElkLFxuICAgICAgXCJtb2RlbFJlS2V5XCI6IG1vZGVsUmVLZXksXG4gICAgICBcImN1cnJlbnRUYXNrSWRcIjogY3VycmVudFRhc2tJZFxuICAgIH07XG4gICAgZWxlbS5iaW5kKFwiY2xpY2tcIiwgdGhpcy5fUHJvcCwgdGhpcy5CdXR0b25DbGlja0V2ZW50KTtcbiAgICByZXR1cm4ge1xuICAgICAgZWxlbTogZWxlbVxuICAgIH07XG4gIH0sXG4gIEJ1dHRvbkNsaWNrRXZlbnQ6IGZ1bmN0aW9uIEJ1dHRvbkNsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgdmFyIHZhbGlkYXRlUmVzdWx0ID0gVmFsaWRhdGVSdWxlc1J1bnRpbWUuVmFsaWRhdGVTdWJtaXRFbmFibGUoKTtcblxuICAgIGlmIChWYWxpZGF0ZVJ1bGVzUnVudGltZS5BbGVydFZhbGlkYXRlRXJyb3JzKHZhbGlkYXRlUmVzdWx0KSkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydExvYWRpbmcod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCwge30sIFwiXCIpO1xuICAgICAgdmFyIF9wcm9wID0gc2VuZGVyLmRhdGE7XG4gICAgICB2YXIgX3RoaXMgPSBfcHJvcC5zZW5kZXI7XG5cbiAgICAgIHZhciBzZW5kRGF0YSA9IF90aGlzLkJ1aWxkU2VuZFRvU2VydmVyRGF0YShfcHJvcCwgbnVsbCk7XG5cbiAgICAgIGlmIChzZW5kRGF0YS5zdWNjZXNzKSB7XG4gICAgICAgIEFqYXhVdGlsaXR5LlBvc3QoX3RoaXMuYWNJbnRlcmZhY2UucmVzb2x2ZU5leHRQb3NzaWJsZUZsb3dOb2RlLCBzZW5kRGF0YS5kYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgICBVc2VyVGFza1JlY2VpdmVyRGlhbG9nVXRpbGl0eS5TaG93RGlhbG9nKF9wcm9wLnNlbmRlciwgcmVzdWx0LmRhdGEsIF9wcm9wLnNlbmRlci5TZWxlY3RSZWNlaXZlckNvbXBsZXRlZCk7XG4gICAgICAgIH0sIF9wcm9wLnNlbmRlcik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBTZWxlY3RSZWNlaXZlckNvbXBsZXRlZDogZnVuY3Rpb24gU2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWQobmV4dFRhc2tFbnRpdHlMaXN0LCBzZWxlY3RlZFJlY2VpdmVyRGF0YSkge1xuICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkUmVjZWl2ZXJEYXRhKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLl9Qcm9wLmFjdGlvbk9iai5hY3Rpb25DYXB0aW9uKTtcbiAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOaJp+ihjOWPkemAgT9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGVjdGVkUmVjZWl2ZXJWYXJzID0gRmxvd1J1bnRpbWVWYXJCdWlsZGVyLkJ1aWxkZXJTZWxlY3RlZFJlY2VpdmVyVG9JbnN0YW5jZVZhcihuZXh0VGFza0VudGl0eUxpc3QsIHNlbGVjdGVkUmVjZWl2ZXJEYXRhKTtcbiAgICAgIHZhciBzZW5kRGF0YSA9IHRoaXMuQnVpbGRTZW5kVG9TZXJ2ZXJEYXRhKHRoaXMuX1Byb3AsIHtcbiAgICAgICAgc2VsZWN0ZWRSZWNlaXZlclZhcnM6IGVuY29kZVVSSUNvbXBvbmVudChKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcoc2VsZWN0ZWRSZWNlaXZlclZhcnMpKVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChzZW5kRGF0YS5zdWNjZXNzKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRMb2FkaW5nKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQsIHt9LCBcIuezu+e7n+WkhOeQhuS4rSzor7fnqI3lgJkhXCIpO1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuY29tcGxldGVUYXNrLCBzZW5kRGF0YS5kYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG5cbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQ29uZmlybSh3aW5kb3csIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSwgdGhpcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRFcnJvcih3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRFcnJvcklkLCB7fSwgcmVzdWx0LmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLl9Qcm9wLnNlbmRlcik7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIEJ1aWxkU2VuZFRvU2VydmVyRGF0YTogZnVuY3Rpb24gQnVpbGRTZW5kVG9TZXJ2ZXJEYXRhKF9wcm9wLCBhcHBlbmRTZW5kTWFwKSB7XG4gICAgdmFyIGZvcm1EYXRhQ29tcGxleFBPID0gX3Byb3AuZm9ybVJ1bnRpbWVJbnN0LlNlcmlhbGl6YXRpb25Gb3JtRGF0YSgpO1xuXG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGlzU3RhcnRJbnN0YW5jZVN0YXR1czogX3Byb3AuaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgICBhY3Rpb25Db2RlOiBfcHJvcC5hY3Rpb25PYmouYWN0aW9uQ29kZSxcbiAgICAgICAgZmxvd01vZGVsUnVudGltZVBPQ2FjaGVLZXk6IF9wcm9wLmZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgICBcImZvcm1SZWNvcmRDb21wbGV4UE9TdHJpbmdcIjogZW5jb2RlVVJJQ29tcG9uZW50KEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyhmb3JtRGF0YUNvbXBsZXhQTykpLFxuICAgICAgICBcImN1cnJlbnROb2RlS2V5XCI6IF9wcm9wLmN1cnJlbnROb2RlS2V5LFxuICAgICAgICBcImN1cnJlbnROb2RlTmFtZVwiOiBfcHJvcC5jdXJyZW50Tm9kZU5hbWUsXG4gICAgICAgIFwicmVjb3JkSWRcIjogX3Byb3AucmVjb3JkSWQsXG4gICAgICAgIFwibW9kZWxJZFwiOiBfcHJvcC5tb2RlbElkLFxuICAgICAgICBcIm1vZGVsUmVLZXlcIjogX3Byb3AubW9kZWxSZUtleSxcbiAgICAgICAgXCJjdXJyZW50VGFza0lkXCI6IF9wcm9wLmN1cnJlbnRUYXNrSWRcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGFwcGVuZFNlbmRNYXApIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhcHBlbmRTZW5kTWFwKSB7XG4gICAgICAgIHJlc3VsdC5kYXRhW2tleV0gPSBhcHBlbmRTZW5kTWFwW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZTtcbnZhciBVc2VyVGFza1JlY2VpdmVyRGlhbG9nVXRpbGl0eSA9IHtcbiAgU2hvd0RpYWxvZzogZnVuY3Rpb24gU2hvd0RpYWxvZyhzZW5kZXIsIG5leHRGbG93Tm9kZUVudGl0aWVzLCBzZWxlY3RSZWNlaXZlckNvbXBsZXRlZEZ1bmMpIHtcbiAgICBpZiAoIXVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZSkge1xuICAgICAgJChkb2N1bWVudC5ib2R5KS5hcHBlbmQoXCI8ZGl2IGlkPSd1c2VyVGFza1JlY2VpdmVyRGlhbG9nJz48dXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZyByZWY9J3VzZXJUYXNrUmVjZWl2ZXJEaWFsb2cnPjwvdXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZz48L2Rpdj5cIik7XG4gICAgICB1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6IFwiI3VzZXJUYXNrUmVjZWl2ZXJEaWFsb2dcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgICAgICBnZXRSdW50aW1lTW9kZWxXaXRoU3RhcnQ6IFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvTW9kZWxSdW50aW1lL0dldFJ1bnRpbWVNb2RlbFdpdGhTdGFydFwiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gICAgICAgIG1ldGhvZHM6IHt9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUuJHJlZnMudXNlclRhc2tSZWNlaXZlckRpYWxvZy5iZWdpblNlbGVjdFJlY2VpdmVyKHNlbmRlciwgbmV4dEZsb3dOb2RlRW50aXRpZXMsIHNlbGVjdFJlY2VpdmVyQ29tcGxldGVkRnVuYyk7XG4gIH0sXG4gIENsb3NlRGlhbG9nOiBmdW5jdGlvbiBDbG9zZURpYWxvZygpIHtcbiAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbSh1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUuJHJlZnMudXNlclRhc2tSZWNlaXZlckRpYWxvZy4kcmVmcy51c2VyVGFza1JlY2VpdmVyRGlhbG9nV3JhcCk7XG4gICAgdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyVnVlID0gbnVsbDtcbiAgICAkKFwiI3VzZXJUYXNrUmVjZWl2ZXJEaWFsb2dcIikucmVtb3ZlKCk7XG4gIH1cbn07XG5WdWUuY29tcG9uZW50KFwidXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7fSxcbiAgICAgIG5leHRGbG93Tm9kZUVudGl0aWVzOiBbXSxcbiAgICAgIHJlY2VpdmVyVHJlZToge1xuICAgICAgICB0cmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2s6IHtcbiAgICAgICAgICAgIGVuYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICByYWRpb1R5cGU6IFwiYWxsXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFzeW5jOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixcbiAgICAgICAgICAgIHVybDogQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24oXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL1JlY2VpdmVyUnVudGltZS9HZXRBc3luY1JlY2VpdmVyc1wiKSxcbiAgICAgICAgICAgIGF1dG9QYXJhbTogW1wiaWRcIiwgXCJ0eXBlTmFtZVwiLCBcIm5hbWVcIl1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcIm5hbWVcIixcbiAgICAgICAgICAgICAgY2hpbGRyZW46IFwicnVudGltZVJlY2VpdmVVc2Vyc1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge30sXG4gICAgICAgICAgICBvbkRibENsaWNrOiBmdW5jdGlvbiBvbkRibENsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5faG9zdDtcblxuICAgICAgICAgICAgICB2YXIgZmxvd05vZGVFbnRpdHkgPSB0aGlzLmdldFpUcmVlT2JqKHRyZWVJZCkuZmxvd05vZGVFbnRpdHk7XG4gICAgICAgICAgICAgIHZhciByZWNlaXZlVHlwZSA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5yZWNlaXZlVHlwZTtcblxuICAgICAgICAgICAgICBfdGhpcy5hZGRSZWNlaXZlclRvU2VsZWN0ZWQodHJlZU5vZGUsIGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmVmb3JlQXN5bmM6IGZ1bmN0aW9uIGJlZm9yZUFzeW5jKHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2codHJlZUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRyZWVPYmpNYXA6IHt9XG4gICAgICB9LFxuICAgICAgc2VsZWN0ZWRSZWNlaXZlcjoge1xuICAgICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICAgIHRpdGxlOiAn5bey6YCJ55So5oi3MScsXG4gICAgICAgICAga2V5OiAnbmFtZScsXG4gICAgICAgICAgd2lkdGg6IDE4OCxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICfmk43kvZwnLFxuICAgICAgICAgIHNsb3Q6ICdhY3Rpb24nLFxuICAgICAgICAgIHdpZHRoOiA3MCxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9XSxcbiAgICAgICAgcmVjZWl2ZXJEYXRhOiBbXVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgZmlsdGVyczoge1xuICAgIGZpbHRlclJlY2VpdmVyRGF0YTogZnVuY3Rpb24gZmlsdGVyUmVjZWl2ZXJEYXRhKHJlY2VpdmVyRGF0YSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICByZXR1cm4gcmVjZWl2ZXJEYXRhLmZpbHRlcihmdW5jdGlvbiAocmVjZWl2ZXIpIHtcbiAgICAgICAgcmV0dXJuIHJlY2VpdmVyLmZsb3dOb2RlRW50aXR5LmlkID09IGZsb3dOb2RlRW50aXR5LmlkICYmIHJlY2VpdmVyLnJlY2VpdmVUeXBlID09IHJlY2VpdmVUeXBlO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgYmVnaW5TZWxlY3RSZWNlaXZlcjogZnVuY3Rpb24gYmVnaW5TZWxlY3RSZWNlaXZlcihzZW5kZXIsIG5leHRGbG93Tm9kZUVudGl0aWVzLCBzZWxlY3RSZWNlaXZlckNvbXBsZXRlZEZ1bmMpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy51c2VyVGFza1JlY2VpdmVyRGlhbG9nV3JhcDtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogNjUwLFxuICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup5o6l5pS25Lq65ZGYXCIsXG4gICAgICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICBcIuehruiupFwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLnZhbGlkYXRlQ29tcGxldGVFbmFibGUoKS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgIHNlbGVjdFJlY2VpdmVyQ29tcGxldGVkRnVuYy5jYWxsKHNlbmRlciwgX3RoaXMubmV4dEZsb3dOb2RlRW50aXRpZXMsIF90aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwi5Y+W5raIXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgICBVc2VyVGFza1JlY2VpdmVyRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb3BlbjogZnVuY3Rpb24gb3BlbihldmVudCwgdWkpIHtcbiAgICAgICAgICAkKFwiLnVpLWRpYWxvZy10aXRsZWJhci1jbG9zZVwiLCAkKHRoaXMpLnBhcmVudCgpKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5uZXh0Rmxvd05vZGVFbnRpdGllcyA9IG5leHRGbG93Tm9kZUVudGl0aWVzO1xuICAgICAgd2luZG93LnNldFRpbWVvdXQodGhpcy5pbml0VHJlZSwgNTAwKTtcbiAgICB9LFxuICAgIGluaXRUcmVlOiBmdW5jdGlvbiBpbml0VHJlZSgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5uZXh0Rmxvd05vZGVFbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZmxvd05vZGVFbnRpdHkgPSB0aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldO1xuXG4gICAgICAgIGlmIChmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cyAmJiBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY01haW5SZWNlaXZlT2JqZWN0cyAmJiBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY01haW5SZWNlaXZlT2JqZWN0cy5ydW50aW1lUmVjZWl2ZUdyb3Vwcykge1xuICAgICAgICAgIHZhciB0cmVlT2JqS2V5ID0gdGhpcy5idWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCBcIm1haW5cIik7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XSA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI1wiICsgdHJlZU9iaktleSksIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVTZXR0aW5nLCBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY01haW5SZWNlaXZlT2JqZWN0cy5ydW50aW1lUmVjZWl2ZUdyb3Vwcyk7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XS5faG9zdCA9IHRoaXM7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XS5mbG93Tm9kZUVudGl0eSA9IGZsb3dOb2RlRW50aXR5O1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0ucmVjZWl2ZVR5cGUgPSBcIm1haW5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cyAmJiBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY0NDUmVjZWl2ZU9iamVjdHMgJiYgZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNDQ1JlY2VpdmVPYmplY3RzLnJ1bnRpbWVSZWNlaXZlR3JvdXBzKSB7XG4gICAgICAgICAgdmFyIHRyZWVPYmpLZXkgPSB0aGlzLmJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIFwiY2NcIik7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XSA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI1wiICsgdHJlZU9iaktleSksIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVTZXR0aW5nLCBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY0NDUmVjZWl2ZU9iamVjdHMucnVudGltZVJlY2VpdmVHcm91cHMpO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0uX2hvc3QgPSB0aGlzO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0uZmxvd05vZGVFbnRpdHkgPSBmbG93Tm9kZUVudGl0eTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldLnJlY2VpdmVUeXBlID0gXCJjY1wiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBidWlsZFVsVHJlZUlkOiBmdW5jdGlvbiBidWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgcmV0dXJuICd1bFRyZWVfJyArIHJlY2VpdmVUeXBlICsgXCJfXCIgKyBmbG93Tm9kZUVudGl0eS5pZDtcbiAgICB9LFxuICAgIGFkZFRyZWVTZWxlY3RlZFJlY2VpdmVyVG9TZWxlY3RlZDogZnVuY3Rpb24gYWRkVHJlZVNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgdmFyIHRyZWVLZXkgPSB0aGlzLmJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKTtcbiAgICAgIHZhciB0cmVlT2JqZWN0ID0gdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlS2V5XTtcblxuICAgICAgaWYgKHRyZWVPYmplY3QpIHtcbiAgICAgICAgdmFyIHNlbGVjdE5vZGVzID0gdHJlZU9iamVjdC5nZXRTZWxlY3RlZE5vZGVzKCk7XG5cbiAgICAgICAgaWYgKHNlbGVjdE5vZGVzICYmIHNlbGVjdE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLmFkZFJlY2VpdmVyVG9TZWxlY3RlZChzZWxlY3ROb2Rlc1swXSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgYWRkUmVjZWl2ZXJUb1NlbGVjdGVkOiBmdW5jdGlvbiBhZGRSZWNlaXZlclRvU2VsZWN0ZWQoc2VsZWN0Tm9kZSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICB2YXIgaXNNdWx0aUluc3RhbmNlVGFzayA9IHRoaXMuaXNNdWx0aUluc3RhbmNlVGFzayhmbG93Tm9kZUVudGl0eSk7XG4gICAgICB2YXIgaW5uZXJTaW5nbGVJZCA9IGZsb3dOb2RlRW50aXR5LmlkICsgXCJfXCIgKyByZWNlaXZlVHlwZSArIFwiX1wiICsgc2VsZWN0Tm9kZS5pZDtcblxuICAgICAgaWYgKHNlbGVjdE5vZGUudHlwZU5hbWUgPT0gXCJTaW5nbGVVc2VyXCIpIHtcbiAgICAgICAgc2VsZWN0Tm9kZS5pbm5lclNpbmdsZUlkID0gaW5uZXJTaW5nbGVJZDtcbiAgICAgICAgc2VsZWN0Tm9kZS5mbG93Tm9kZUVudGl0eSA9IGZsb3dOb2RlRW50aXR5O1xuICAgICAgICBzZWxlY3ROb2RlLnJlY2VpdmVUeXBlID0gcmVjZWl2ZVR5cGU7XG5cbiAgICAgICAgaWYgKChyZWNlaXZlVHlwZSA9PSBcImNjXCIgfHwgaXNNdWx0aUluc3RhbmNlVGFzaykgJiYgIUFycmF5VXRpbGl0eS5FeGlzdCh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLmlubmVyU2luZ2xlSWQgPT0gaW5uZXJTaW5nbGVJZDtcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLnB1c2goc2VsZWN0Tm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAocmVjZWl2ZVR5cGUgPT0gXCJtYWluXCIgJiYgIWlzTXVsdGlJbnN0YW5jZVRhc2spIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhW2ldLmZsb3dOb2RlRW50aXR5LmlkID09IGZsb3dOb2RlRW50aXR5LmlkICYmIHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGFbaV0ucmVjZWl2ZVR5cGUgPT0gcmVjZWl2ZVR5cGUpIHtcbiAgICAgICAgICAgICAgQXJyYXlVdGlsaXR5LkRlbGV0ZSh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLnB1c2goc2VsZWN0Tm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNNdWx0aUluc3RhbmNlVGFzayAmJiAoc2VsZWN0Tm9kZS50eXBlTmFtZSA9PSBcIlVzZXJzXCIgfHwgc2VsZWN0Tm9kZS50eXBlTmFtZSA9PSBcIlJvbGVcIiB8fCBzZWxlY3ROb2RlLnR5cGVOYW1lID09IFwiT3JnYW5zXCIpKSB7XG4gICAgICAgIGlmIChzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnMgIT0gbnVsbCAmJiBzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGROb2RlID0gc2VsZWN0Tm9kZS5ydW50aW1lUmVjZWl2ZVVzZXJzW19pXTtcblxuICAgICAgICAgICAgaWYgKGNoaWxkTm9kZS50eXBlTmFtZSA9PSBcIlNpbmdsZVVzZXJcIikge1xuICAgICAgICAgICAgICB0aGlzLmFkZFJlY2VpdmVyVG9TZWxlY3RlZChjaGlsZE5vZGUsIGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBjbGVhclNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkOiBmdW5jdGlvbiBjbGVhclNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdmFyIHJlY2VpdmVyID0gdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YVtpXTtcblxuICAgICAgICBpZiAocmVjZWl2ZXIuZmxvd05vZGVFbnRpdHkuaWQgPT0gZmxvd05vZGVFbnRpdHkuaWQgJiYgcmVjZWl2ZXIucmVjZWl2ZVR5cGUgPT0gcmVjZWl2ZVR5cGUpIHtcbiAgICAgICAgICBBcnJheVV0aWxpdHkuRGVsZXRlKHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEsIGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBkZWxldGVTZWxlY3RlZFJlY2VpdmVyOiBmdW5jdGlvbiBkZWxldGVTZWxlY3RlZFJlY2VpdmVyKGluZGV4LCByb3cpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YVtpXS5pbm5lclNpbmdsZUlkID09IHJvdy5pbm5lclNpbmdsZUlkKSB7XG4gICAgICAgICAgQXJyYXlVdGlsaXR5LkRlbGV0ZSh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgaXNNdWx0aUluc3RhbmNlVGFzazogZnVuY3Rpb24gaXNNdWx0aUluc3RhbmNlVGFzayhmbG93Tm9kZUVudGl0eSkge1xuICAgICAgcmV0dXJuIGZsb3dOb2RlRW50aXR5Lm11bHRpSW5zdGFuY2VUYXNrO1xuICAgIH0sXG4gICAgYnVpbGRUYWJMYWJlbDogZnVuY3Rpb24gYnVpbGRUYWJMYWJlbChmbG93Tm9kZUVudGl0eSkge1xuICAgICAgcmV0dXJuIGZsb3dOb2RlRW50aXR5Lm5hbWUgKyBcIiBbXCIgKyAodGhpcy5pc011bHRpSW5zdGFuY2VUYXNrKGZsb3dOb2RlRW50aXR5KSA/IFwi5aSa5Lq6XCIgOiBcIuWNleS6ulwiKSArIFwiXVwiO1xuICAgIH0sXG4gICAgdmFsaWRhdGVDb21wbGV0ZUVuYWJsZTogZnVuY3Rpb24gdmFsaWRhdGVDb21wbGV0ZUVuYWJsZSgpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgZXJyb3JNZXNzYWdlcyA9IFtdO1xuICAgICAgdmFyIHN1Y2Nlc3MgPSB0cnVlO1xuXG4gICAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XG4gICAgICAgIGlmIChfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0udGFza1R5cGVOYW1lID09IFwiY29tLmpiNGRjLndvcmtmbG93LnBvLmJwbW4ucHJvY2Vzcy5CcG1uVXNlclRhc2tcIikge1xuICAgICAgICAgIGlmICghQXJyYXlVdGlsaXR5LkV4aXN0KF90aGlzMi5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLmZsb3dOb2RlRW50aXR5LmlkID09IF90aGlzMi5uZXh0Rmxvd05vZGVFbnRpdGllc1tpXS5pZCAmJiBpdGVtLnJlY2VpdmVUeXBlID09IFwibWFpblwiO1xuICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgICB0YXNrTmFtZTogX3RoaXMyLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldLm5hbWUsXG4gICAgICAgICAgICAgIGZsb3dOb2RlRW50aXR5OiBfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0sXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IFwi546v6IqCW1wiICsgX3RoaXMyLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldLm5hbWUgKyBcIl3oh7PlsJHpnIDopoHorr7nva7kuIDkuKrmjqXmlLbnlKjmiLchXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIF9sb29wKGkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JNZXNzYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBlcnJvclRleHRBcnkgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9yTWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBlcnJvclRleHRBcnkucHVzaChlcnJvck1lc3NhZ2VzW2ldLm1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoZXJyb3JUZXh0QXJ5LmpvaW4oXCI8YnIgLz5cIiksIHRoaXMpO1xuICAgICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IHN1Y2Nlc3NcbiAgICAgIH07XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IHJlZj1cXFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ1dyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgPHRhYnMgbmFtZT1cXFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ1RhYnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPHRhYi1wYW5lIDpsYWJlbD1cXFwiYnVpbGRUYWJMYWJlbChmbG93Tm9kZUVudGl0eSlcXFwiIHRhYj1cXFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ1RhYnNcXFwiIHYtZm9yPVxcXCJmbG93Tm9kZUVudGl0eSBpbiBuZXh0Rmxvd05vZGVFbnRpdGllc1xcXCIgOmtleT1cXFwiZmxvd05vZGVFbnRpdHkuaWRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2xsYXBzZSBhY2NvcmRpb24gdmFsdWU9XFxcIm1haW5SZWNlaXZlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYW5lbCBuYW1lPVxcXCJtYWluUmVjZWl2ZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NEUzQlxcdTkwMDFcXHU0RUJBXFx1NTQ1OFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzbG90PVxcXCJjb250ZW50XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ1c2VyLXRhc2stcmVjZWl2ZXItZGlhbG9nLW91dGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3RFbmFibGVVc2VyTGlzdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgOmlkPVxcXCJidWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCdtYWluJylcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCIgc3R5bGU9XFxcIndpZHRoOiAyMDBweFxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdE9wQnV0dG9uQ29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNpbmdsZS1vcC1idXR0b25cXFwiIHRpdGxlPVxcXCJcXHU2REZCXFx1NTJBMFxcdTRFQkFcXHU1NDU4XFxcIiBAY2xpY2s9XFxcImFkZFRyZWVTZWxlY3RlZFJlY2VpdmVyVG9TZWxlY3RlZChmbG93Tm9kZUVudGl0eSwnbWFpbicpXFxcIj48SWNvbiB0eXBlPVxcXCJtZC1hcnJvdy1yb3VuZC1mb3J3YXJkXFxcIiAvPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2luZ2xlLW9wLWJ1dHRvblxcXCIgdGl0bGU9XFxcIlxcdTZFMDVcXHU3QTdBXFx1NURGMlxcdTkwMDlcXHU0RUJBXFx1NTQ1OFxcXCIgQGNsaWNrPVxcXCJjbGVhclNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCdtYWluJylcXFwiPjxJY29uIHR5cGU9XFxcIm1kLWJhY2tzcGFjZVxcXCIgLz48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdGVkVXNlckxpc3RcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgaGVpZ2h0PVxcXCIzMjdcXFwiIHdpZHRoPVxcXCIyNjBcXFwiIHN0cmlwZSA6Y29sdW1ucz1cXFwic2VsZWN0ZWRSZWNlaXZlci5jb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwic2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEgfCBmaWx0ZXJSZWNlaXZlckRhdGEoZmxvd05vZGVFbnRpdHksICdtYWluJylcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90LXNjb3BlPVxcXCJ7IHJvdywgaW5kZXggfVxcXCIgc2xvdD1cXFwiYWN0aW9uXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlzdC1mb250LWljb24tYnV0dG9uLWNsYXNzXFxcIiBAY2xpY2s9XFxcImRlbGV0ZVNlbGVjdGVkUmVjZWl2ZXIoaW5kZXgscm93KVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiB0eXBlPVxcXCJtZC1jbG9zZVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT4gICAgIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3BhbmVsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGFuZWwgbmFtZT1cXFwiY2NSZWNlaXZlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU2Mjg0XFx1OTAwMVxcdTRFQkFcXHU1NDU4XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHNsb3Q9XFxcImNvbnRlbnRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInVzZXItdGFzay1yZWNlaXZlci1kaWFsb2ctb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdEVuYWJsZVVzZXJMaXN0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCA6aWQ9XFxcImJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksJ2NjJylcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCIgc3R5bGU9XFxcIndpZHRoOiAyMDBweFxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdE9wQnV0dG9uQ29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNpbmdsZS1vcC1idXR0b25cXFwiIHRpdGxlPVxcXCJcXHU2REZCXFx1NTJBMFxcdTRFQkFcXHU1NDU4XFxcIiBAY2xpY2s9XFxcImFkZFJlY2VpdmVyVG9TZWxlY3RlZChmbG93Tm9kZUVudGl0eSwnY2MnKVxcXCI+PEljb24gdHlwZT1cXFwibWQtYXJyb3ctcm91bmQtZm9yd2FyZFxcXCIgLz48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNpbmdsZS1vcC1idXR0b25cXFwiIHRpdGxlPVxcXCJcXHU2RTA1XFx1N0E3QVxcdTVERjJcXHU5MDA5XFx1NEVCQVxcdTU0NThcXFwiPjxJY29uIHR5cGU9XFxcIm1kLWJhY2tzcGFjZVxcXCIgLz48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdGVkVXNlckxpc3RcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgaGVpZ2h0PVxcXCIzMjdcXFwiIHdpZHRoPVxcXCIyNjBcXFwiIHN0cmlwZSA6Y29sdW1ucz1cXFwic2VsZWN0ZWRSZWNlaXZlci5jb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwic2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEgfCBmaWx0ZXJSZWNlaXZlckRhdGEoZmxvd05vZGVFbnRpdHksICdjYycpXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGVtcGxhdGUgc2xvdC1zY29wZT1cXFwieyByb3csIGluZGV4IH1cXFwiIHNsb3Q9XFxcImFjdGlvblxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpc3QtZm9udC1pY29uLWJ1dHRvbi1jbGFzc1xcXCIgQGNsaWNrPVxcXCJkZWxldGVTZWxlY3RlZFJlY2VpdmVyKGluZGV4LHJvdylcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEljb24gdHlwZT1cXFwibWQtY2xvc2VcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGVtcGxhdGU+ICAgICBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wYW5lbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2NvbGxhcHNlPlxcbiAgICAgICAgICAgICAgICAgICAgPC90YWItcGFuZT5cXG4gICAgICAgICAgICAgICAgPC90YWJzPlxcbiAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERlBsdWdpbiA9IHtcbiAgZ2V0SHRtbEVsZW06IGZ1bmN0aW9uIGdldEh0bWxFbGVtKCkge1xuICAgIHJldHVybiBcIjxkaXYgXFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sX2NhdGVnb3J5PVxcXCJJbnB1dENvbnRyb2xcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgaWQ9XFxcImRvY3VtZW50X2NvbnRlbnRfdXBsb2FkX2NvbnZlcnRfdG9fcGRmX3BsdWdpblxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBpc19qYnVpbGQ0ZGNfZGF0YT1cXFwidHJ1ZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBqYnVpbGQ0ZGNfY3VzdG9tPVxcXCJ0cnVlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XFxcImRvY3VtZW50X2NvbnRlbnRfdXBsb2FkX2NvbnZlcnRfdG9fcGRmX3BsdWdpblxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemU9XFxcImZhbHNlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIHNpbmdsZW5hbWU9XFxcIldGRENUX0RvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERkNvbnRhaW5lclxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM9XFxcImVuYWJsZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBzdHlsZT1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgID5cXG4gICAgICAgICAgICAgICAgICAgIFxcdTY3MkFcXHU1RjAwXFx1NTNEMSFcXG4gICAgICAgICAgICAgICAgPC9kaXY+XCI7XG4gIH1cbn07Il19
