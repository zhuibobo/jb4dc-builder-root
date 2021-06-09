"use strict";

var ActionsRuntimeObject = {
  CreateALLActionButton: function CreateALLActionButton(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas) {
    if (pageReadyInnerParas.jb4dcActions && pageReadyInnerParas.jb4dcActions.jb4dcActionList) {
      var buttonElem;

      for (var i = 0; i < pageReadyInnerParas.jb4dcActions.jb4dcActionList.length; i++) {
        var actionObj = pageReadyInnerParas.jb4dcActions.jb4dcActionList[i];

        if (actionObj.juelRunResultPO.booleanResult) {
          if (actionObj.actionType == "send") {
            var sendActionObject = Object.create(WorkFlowSendAction);
            buttonElem = sendActionObject.Instance(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj);
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
  _flowInstanceRuntimePO: null,
  _isCreatedModelerView: false,
  buildPageReadyInnerParas: function buildPageReadyInnerParas(isStartInstanceStatus, recordId, flowInstanceRuntimePO, flowInstanceRuntimePOCacheKey) {
    return {
      recordId: recordId,
      formId: flowInstanceRuntimePO.jb4dcFormId,
      currentNodeKey: flowInstanceRuntimePO.currentNodeKey,
      currentNodeName: flowInstanceRuntimePO.currentNodeName,
      modelId: flowInstanceRuntimePO.modelIntegratedEntity.modelId,
      modelReKey: flowInstanceRuntimePO.modelIntegratedEntity.modelReKey,
      currentTaskId: flowInstanceRuntimePO.executionTaskEntity ? flowInstanceRuntimePO.executionTaskEntity.extaskId : "",
      flowInstanceRuntimePOCacheKey: flowInstanceRuntimePOCacheKey,
      flowInstanceRuntimePO: flowInstanceRuntimePO,
      isStartInstanceStatus: isStartInstanceStatus,
      jb4dcActions: flowInstanceRuntimePO.jb4dcActions
    };
  },
  pageReadyForStartStatus: function pageReadyForStartStatus(isStartInstanceStatus, rendererChainCompletedFunc, flowInstanceRuntimePO, flowInstanceRuntimePOCacheKey, pageHostInstance) {
    this._formRuntimeInst = Object.create(FormRuntime);
    var recordId = StringUtility.Guid();
    var pageReadyInnerParas = this.buildPageReadyInnerParas(isStartInstanceStatus, recordId, flowInstanceRuntimePO, flowInstanceRuntimePOCacheKey);
    console.log(pageReadyInnerParas);

    this._formRuntimeInst.Initialization({
      "RendererToId": "htmlDesignRuntimeWrap",
      "FormId": pageReadyInnerParas.formId,
      "RecordId": recordId,
      "ButtonId": "",
      "OperationType": BaseUtility.GetAddOperationName(),
      "IsPreview": false,
      "RendererChainCompletedFunc": rendererChainCompletedFunc,
      "ListFormButtonElemId": "",
      "WebFormRTParas": {},
      "FormRuntimeCategory": FlowRuntimePageObject.FORM_RUNTIME_CATEGORY_FLOW,
      "PreHandleFormHtmlRuntimeFunc": this.preHandleFormHtmlRuntimeFunc,
      "FlowInstanceRuntimePO": flowInstanceRuntimePO,
      "FlowModelRuntimePOCacheKey": pageReadyInnerParas.flowInstanceRuntimePOCacheKey,
      "IsStartInstanceStatus": isStartInstanceStatus,
      "CurrentNodeKey": pageReadyInnerParas.currentNodeKey,
      "CurrentNodeName": pageReadyInnerParas.currentNodeName,
      "ModelId": pageReadyInnerParas.modelId,
      "ModelReKey": pageReadyInnerParas.modelReKey,
      "CurrentTaskId": ""
    });

    this.rendererActionButtons(isStartInstanceStatus, this._formRuntimeInst, pageHostInstance, pageReadyInnerParas);
    return this._formRuntimeInst;
  },
  pageReadyForProcessStatus: function pageReadyForProcessStatus(isStartInstanceStatus, rendererChainCompletedFunc, flowInstanceRuntimePO, flowInstanceRuntimePOCacheKey, pageHostInstance) {
    this._formRuntimeInst = Object.create(FormRuntime);
    FlowRuntimePageObject._flowInstanceRuntimePO = flowInstanceRuntimePO;
    var recordId = flowInstanceRuntimePO.instanceEntity.instRuBusinessKey;
    var pageReadyInnerParas = this.buildPageReadyInnerParas(isStartInstanceStatus, recordId, flowInstanceRuntimePO, flowInstanceRuntimePOCacheKey);
    console.log(pageReadyInnerParas);

    this._formRuntimeInst.Initialization({
      "RendererToId": "htmlDesignRuntimeWrap",
      "FormId": pageReadyInnerParas.formId,
      "RecordId": recordId,
      "ButtonId": "",
      "OperationType": BaseUtility.GetUpdateOperationName(),
      "IsPreview": false,
      "RendererChainCompletedFunc": rendererChainCompletedFunc,
      "ListFormButtonElemId": "",
      "WebFormRTParas": {},
      "FormRuntimeCategory": FlowRuntimePageObject.FORM_RUNTIME_CATEGORY_FLOW,
      "PreHandleFormHtmlRuntimeFunc": this.preHandleFormHtmlRuntimeFunc,
      "FlowInstanceRuntimePO": flowInstanceRuntimePO,
      "FlowModelRuntimePOCacheKey": pageReadyInnerParas.flowInstanceRuntimePOCacheKey,
      "IsStartInstanceStatus": isStartInstanceStatus,
      "CurrentNodeKey": pageReadyInnerParas.currentNodeKey,
      "CurrentNodeName": pageReadyInnerParas.currentNodeName,
      "ModelId": pageReadyInnerParas.modelId,
      "ModelReKey": pageReadyInnerParas.modelReKey,
      "CurrentTaskId": ""
    });

    this.rendererActionButtons(isStartInstanceStatus, this._formRuntimeInst, pageHostInstance, pageReadyInnerParas);
    return this._formRuntimeInst;
  },
  rendererActionButtons: function rendererActionButtons(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas) {
    ActionsRuntimeObject.CreateALLActionButton(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas);
  },
  rendererFlowModeler: function rendererFlowModeler() {},
  displayModelerView: function displayModelerView(event, ui) {
    if (!FlowRuntimePageObject._isCreatedModelerView) {
      CreateModelerView(FlowRuntimePageObject._flowInstanceRuntimePO);
      FlowRuntimePageObject._isCreatedModelerView = true;
    }
  },
  preHandleFormHtmlRuntimeFunc: function preHandleFormHtmlRuntimeFunc(sourceRuntimeHtml, formRuntimeInst, propConfig) {
    var flowPageContainer = $("<div>" + sourceRuntimeHtml + "<div>");
    var flowInstanceRuntimePO = propConfig.FlowInstanceRuntimePO;

    if (flowPageContainer.children("[singlename='WFDCT_TabContainer']").length == 0) {
      flowPageContainer = $("<div><div class=\"wfdct-tabs-outer-wrap-runtime html-design-theme-default-root-elem-class\" control_category=\"ContainerControl\" desc=\"\" groupname=\"\" id=\"tabs_wrap_518627616\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" name=\"tabs_wrap_518627616\" placeholder=\"\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WFDCT_TabContainer\" status=\"enable\" style=\"\" client_resolve=\"WFDCT_TabContainer\"><div>");
      flowPageContainer.children("[singlename='WFDCT_TabContainer']").append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_form_999\">" + flowInstanceRuntimePO.modelName + "</div>");
      flowPageContainer.children("[singlename='WFDCT_TabContainer']").append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_form_999\">" + sourceRuntimeHtml + "</div>");
    }

    var tabContainer = flowPageContainer.children("[singlename='WFDCT_TabContainer']");

    if (flowInstanceRuntimePO.jb4dcContentDocumentPlugin == "uploadConvertToPDFPlugin") {
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_uploadConvertToPDFPlugin_999\">正文</div>");
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_uploadConvertToPDFPlugin_999\">" + DocumentContentUploadConvertToPDFPlugin.getHtmlElem() + "</div>");
    } else if (flowInstanceRuntimePO.jb4dcContentDocumentPlugin == "wpsOnlineDocumentPlugin") {
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_wpsOnlineDocumentPlugin_999\">正文</div>");
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_wpsOnlineDocumentPlugin_999\">未实现</div>");
    }

    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_modeler_999\">流程图</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_modeler_999\" style='height: calc(100% - 50px);' onActivity=\"FlowRuntimePageObject.displayModelerView\"><div id=\"flow-canvas\" style=\"height:100%;\"></div></div>");
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
        nextNodeId: receiver.flowNodeEntity.id,
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
  Instance: function Instance(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj) {
    console.log(actionObj);
    var htmlId = actionObj.actionHTMLId ? actionObj.actionHTMLId : actionObj.actionCode;
    var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');
    this._Prop = {
      "sender": this,
      "flowInstanceRuntimePO": pageReadyInnerParas.flowInstanceRuntimePO,
      "flowInstanceRuntimePOCacheKey": pageReadyInnerParas.flowInstanceRuntimePOCacheKey,
      "jb4dcActions": pageReadyInnerParas.jb4dcActions,
      "formRuntimeInst": formRuntimeInst,
      "actionObj": actionObj,
      "isStartInstanceStatus": isStartInstanceStatus,
      "pageHostInstance": pageHostInstance,
      "currentNodeKey": pageReadyInnerParas.currentNodeKey,
      "currentNodeName": pageReadyInnerParas.currentNodeName,
      "recordId": pageReadyInnerParas.recordId,
      "modelId": pageReadyInnerParas.modelId,
      "modelReKey": pageReadyInnerParas.modelReKey,
      "currentTaskId": pageReadyInnerParas.currentTaskId
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

          if (result.data.nextTaskIsEndEvent) {
            this.SelectReceiverCompleted(result.data.bpmnTaskList, []);
          } else if (result.data.currentTaskIsMultiInstance && result.data.currentTaskMultiCompletedInstances + 1 < result.data.currentTaskMultiCountEngInstances) {
            this.SelectReceiverCompleted(result.data.bpmnTaskList, []);
          } else {
            UserTaskReceiverDialogUtility.ShowDialog(_prop.sender, result.data.bpmnTaskList, _prop.sender.SelectReceiverCompleted);
          }
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
            window.OpenerWindowObj.instanceMainTaskProcessList.reloadData();
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
              DialogUtility.Frame_CloseDialog(window);
            }, this);
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
        flowInstanceRuntimePOCacheKey: _prop.flowInstanceRuntimePOCacheKey,
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
      $(document.body).append("<div id='userTaskReceiverDialogOuter'><user-task-receiver-dialog ref='userTaskReceiverDialog'></user-task-receiver-dialog></div>");
      userTaskReceiverDialogOuterVue = new Vue({
        el: "#userTaskReceiverDialogOuter",
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
    $("#userTaskReceiverDialogOuter").remove();
    DialogUtility.RemoveDialogRemainingElem("userTaskReceiverDialogInner");
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
            url: BaseUtility.BuildAction("/Rest/Workflow/RunTime/Client/ReceiverRuntime/GetAsyncReceivers"),
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
          title: '已选用户',
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
  template: "<div id=\"userTaskReceiverDialogInner\" ref=\"userTaskReceiverDialogWrap\" style=\"display: none\">\n                <tabs name=\"userTaskReceiverDialogTabs\">\n                    <tab-pane :label=\"buildTabLabel(flowNodeEntity)\" tab=\"userTaskReceiverDialogTabs\" v-for=\"flowNodeEntity in nextFlowNodeEntities\" :key=\"flowNodeEntity.id\">\n                        <collapse accordion value=\"mainReceiver\">\n                            <panel name=\"mainReceiver\">\n                                \u4E3B\u9001\u4EBA\u5458\n                                <div slot=\"content\">\n                                    <div class=\"user-task-receiver-dialog-outer-wrap\">\n                                        <div class=\"selectEnableUserList\">\n                                            <ul :id=\"buildUlTreeId(flowNodeEntity,'main')\" class=\"ztree\" style=\"width: 200px\"></ul>\n                                        </div>\n                                        <div class=\"selectOpButtonContainer\">\n                                            <div class=\"single-op-button\" title=\"\u6DFB\u52A0\u4EBA\u5458\" @click=\"addTreeSelectedReceiverToSelected(flowNodeEntity,'main')\"><Icon type=\"md-arrow-round-forward\" /></div>\n                                            <div class=\"single-op-button\" title=\"\u6E05\u7A7A\u5DF2\u9009\u4EBA\u5458\" @click=\"clearSelectedReceiverToSelected(flowNodeEntity,'main')\"><Icon type=\"md-backspace\" /></div>\n                                        </div>\n                                        <div class=\"selectedUserList\">\n                                            <i-table height=\"327\" width=\"260\" stripe :columns=\"selectedReceiver.columnsConfig\" :data=\"selectedReceiver.receiverData | filterReceiverData(flowNodeEntity, 'main')\"\n                                                 class=\"iv-list-table\" size=\"small\">\n                                                 <template slot-scope=\"{ row, index }\" slot=\"action\">\n                                                    <div class=\"list-font-icon-button-class\" @click=\"deleteSelectedReceiver(index,row)\">\n                                                        <Icon type=\"md-close\" />\n                                                    </div>\n                                                </template>     \n                                            </i-table>\n                                        </div>\n                                    </div>\n                                </div>\n                            </panel>\n                            <panel name=\"ccReceiver\">\n                                \u6284\u9001\u4EBA\u5458\n                                <div slot=\"content\">\n                                    <div class=\"user-task-receiver-dialog-outer-wrap\">\n                                        <div class=\"selectEnableUserList\">\n                                            <ul :id=\"buildUlTreeId(flowNodeEntity,'cc')\" class=\"ztree\" style=\"width: 200px\"></ul>\n                                        </div>\n                                        <div class=\"selectOpButtonContainer\">\n                                            <div class=\"single-op-button\" title=\"\u6DFB\u52A0\u4EBA\u5458\" @click=\"addReceiverToSelected(flowNodeEntity,'cc')\"><Icon type=\"md-arrow-round-forward\" /></div>\n                                            <div class=\"single-op-button\" title=\"\u6E05\u7A7A\u5DF2\u9009\u4EBA\u5458\"><Icon type=\"md-backspace\" /></div>\n                                        </div>\n                                        <div class=\"selectedUserList\">\n                                            <i-table height=\"327\" width=\"260\" stripe :columns=\"selectedReceiver.columnsConfig\" :data=\"selectedReceiver.receiverData | filterReceiverData(flowNodeEntity, 'cc')\"\n                                                 class=\"iv-list-table\" size=\"small\">\n                                                 <template slot-scope=\"{ row, index }\" slot=\"action\">\n                                                    <div class=\"list-font-icon-button-class\" @click=\"deleteSelectedReceiver(index,row)\">\n                                                        <Icon type=\"md-close\" />\n                                                    </div>\n                                                </template>     \n                                            </i-table>\n                                        </div>\n                                    </div>\n                                </div>\n                            </panel>\n                        </collapse>\n                    </tab-pane>\n                </tabs>\n            </div>"
});
"use strict";

var DocumentContentUploadConvertToPDFPlugin = {
  getHtmlElem: function getHtmlElem() {
    return "<div \n                    control_category=\"InputControl\" \n                    id=\"document_content_upload_convert_to_pdf_plugin\" \n                    is_jbuild4dc_data=\"true\" \n                    jbuild4dc_custom=\"true\" \n                    name=\"document_content_upload_convert_to_pdf_plugin\" \n                    serialize=\"false\" \n                    singlename=\"WFDCT_DocumentContentUploadConvertToPDFContainer\" \n                    status=\"enable\" \n                    style=\"\" \n                    >\n                    \u672A\u5F00\u53D1!\n                </div>";
  }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGlvbnNSdW50aW1lT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVQYWdlT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVWYXJCdWlsZGVyLmpzIiwiQWN0aW9ucy9DYWxsQmFja0FjdGlvbi5qcyIsIkFjdGlvbnMvSnVtcFRvQW55Tm9kZUFjdGlvbi5qcyIsIkFjdGlvbnMvUmVCb290SW5zdGFuY2VBY3Rpb24uanMiLCJBY3Rpb25zL1RlbXBTYXZlQWN0aW9uLmpzIiwiQWN0aW9ucy9Xb3JrRmxvd1NlbmRBY3Rpb24uanMiLCJEaWFsb2cvVXNlclRhc2tSZWNlaXZlckRpYWxvZy5qcyIsIlBsdWdpbnMvRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FDQUE7QUNBQTtBQ0FBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IldvcmtGbG93UnVudGltZUZ1bGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIEFjdGlvbnNSdW50aW1lT2JqZWN0ID0ge1xuICBDcmVhdGVBTExBY3Rpb25CdXR0b246IGZ1bmN0aW9uIENyZWF0ZUFMTEFjdGlvbkJ1dHRvbihpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcykge1xuICAgIGlmIChwYWdlUmVhZHlJbm5lclBhcmFzLmpiNGRjQWN0aW9ucyAmJiBwYWdlUmVhZHlJbm5lclBhcmFzLmpiNGRjQWN0aW9ucy5qYjRkY0FjdGlvbkxpc3QpIHtcbiAgICAgIHZhciBidXR0b25FbGVtO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VSZWFkeUlubmVyUGFyYXMuamI0ZGNBY3Rpb25zLmpiNGRjQWN0aW9uTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYWN0aW9uT2JqID0gcGFnZVJlYWR5SW5uZXJQYXJhcy5qYjRkY0FjdGlvbnMuamI0ZGNBY3Rpb25MaXN0W2ldO1xuXG4gICAgICAgIGlmIChhY3Rpb25PYmouanVlbFJ1blJlc3VsdFBPLmJvb2xlYW5SZXN1bHQpIHtcbiAgICAgICAgICBpZiAoYWN0aW9uT2JqLmFjdGlvblR5cGUgPT0gXCJzZW5kXCIpIHtcbiAgICAgICAgICAgIHZhciBzZW5kQWN0aW9uT2JqZWN0ID0gT2JqZWN0LmNyZWF0ZShXb3JrRmxvd1NlbmRBY3Rpb24pO1xuICAgICAgICAgICAgYnV0dG9uRWxlbSA9IHNlbmRBY3Rpb25PYmplY3QuSW5zdGFuY2UoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMsIGFjdGlvbk9iaik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJChcIiNmbG93V29ya0FjdGlvbkJ1dHRvbldyYXBPdXRlclwiKS5hcHBlbmQoYnV0dG9uRWxlbS5lbGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgR2V0QWN0aW9uT2JqOiBmdW5jdGlvbiBHZXRBY3Rpb25PYmooKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGlvbkF1dG9TZW5kOiBcImZhbHNlXCIsXG4gICAgICBhY3Rpb25DQ1JlY2VpdmVPYmplY3RzOiBcIltdXCIsXG4gICAgICBhY3Rpb25DYWxsQXBpczogXCJbXVwiLFxuICAgICAgYWN0aW9uQ2FsbENvbXBsZXRlOiBcInRydWVcIixcbiAgICAgIGFjdGlvbkNhbGxKc01ldGhvZDogbnVsbCxcbiAgICAgIGFjdGlvbkNhcHRpb246IFwi6I2J56i/XCIsXG4gICAgICBhY3Rpb25Db2RlOiBcImFjdGlvbl81MTYwMDk3NzVcIixcbiAgICAgIGFjdGlvbkNvbmZpcm06IFwiZmFsc2VcIixcbiAgICAgIGFjdGlvbkRpc3BsYXlDb25kaXRpb25FZGl0VGV4dDogbnVsbCxcbiAgICAgIGFjdGlvbkRpc3BsYXlDb25kaXRpb25FZGl0VmFsdWU6IG51bGwsXG4gICAgICBhY3Rpb25FeGVjdXRlVmFyaWFibGVzOiBcIltdXCIsXG4gICAgICBhY3Rpb25IVE1MQ2xhc3M6IG51bGwsXG4gICAgICBhY3Rpb25IVE1MSWQ6IG51bGwsXG4gICAgICBhY3Rpb25NYWluUmVjZWl2ZU9iamVjdHM6IFwiW11cIixcbiAgICAgIGFjdGlvblJ1blNxbHM6IFwiW11cIixcbiAgICAgIGFjdGlvblNlbmRNZXNzYWdlSWQ6IG51bGwsXG4gICAgICBhY3Rpb25TZW5kU2lnbmFsSWQ6IG51bGwsXG4gICAgICBhY3Rpb25TaG93T3BpbmlvbkRpYWxvZzogXCJmYWxzZVwiLFxuICAgICAgYWN0aW9uVHlwZTogXCJzZW5kXCIsXG4gICAgICBhY3Rpb25VcGRhdGVGaWVsZHM6IFwiW11cIixcbiAgICAgIGFjdGlvblZhbGlkYXRlOiBcIuaXoFwiLFxuICAgICAgYWN0aW9uc09waW5pb25CaW5kVG9FbGVtSWQ6IG51bGwsXG4gICAgICBhY3Rpb25zT3BpbmlvbkJpbmRUb0ZpZWxkOiBudWxsLFxuICAgICAganVlbFJ1blJlc3VsdFBPOiB7XG4gICAgICAgIGJvb2xlYW5SZXN1bHQ6IHRydWUsXG4gICAgICAgIG1lc3NhZ2U6IFwiXCIsXG4gICAgICAgIHN0cmluZ1Jlc3VsdDogXCJcIixcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfVxuICAgIH07XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBGbG93UnVudGltZVBhZ2VPYmplY3QgPSB7XG4gIF93ZWJGb3JtUlRQYXJhczogbnVsbCxcbiAgX2Zvcm1SdW50aW1lSW5zdDogbnVsbCxcbiAgRk9STV9SVU5USU1FX0NBVEVHT1JZX0ZMT1c6IFwiSXNEZXBlbmRlbmNlRmxvd1wiLFxuICBfZmxvd0luc3RhbmNlUnVudGltZVBPOiBudWxsLFxuICBfaXNDcmVhdGVkTW9kZWxlclZpZXc6IGZhbHNlLFxuICBidWlsZFBhZ2VSZWFkeUlubmVyUGFyYXM6IGZ1bmN0aW9uIGJ1aWxkUGFnZVJlYWR5SW5uZXJQYXJhcyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHJlY29yZElkLCBmbG93SW5zdGFuY2VSdW50aW1lUE8sIGZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlY29yZElkOiByZWNvcmRJZCxcbiAgICAgIGZvcm1JZDogZmxvd0luc3RhbmNlUnVudGltZVBPLmpiNGRjRm9ybUlkLFxuICAgICAgY3VycmVudE5vZGVLZXk6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5jdXJyZW50Tm9kZUtleSxcbiAgICAgIGN1cnJlbnROb2RlTmFtZTogZmxvd0luc3RhbmNlUnVudGltZVBPLmN1cnJlbnROb2RlTmFtZSxcbiAgICAgIG1vZGVsSWQ6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5tb2RlbEludGVncmF0ZWRFbnRpdHkubW9kZWxJZCxcbiAgICAgIG1vZGVsUmVLZXk6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5tb2RlbEludGVncmF0ZWRFbnRpdHkubW9kZWxSZUtleSxcbiAgICAgIGN1cnJlbnRUYXNrSWQ6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5leGVjdXRpb25UYXNrRW50aXR5ID8gZmxvd0luc3RhbmNlUnVudGltZVBPLmV4ZWN1dGlvblRhc2tFbnRpdHkuZXh0YXNrSWQgOiBcIlwiLFxuICAgICAgZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXk6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgZmxvd0luc3RhbmNlUnVudGltZVBPOiBmbG93SW5zdGFuY2VSdW50aW1lUE8sXG4gICAgICBpc1N0YXJ0SW5zdGFuY2VTdGF0dXM6IGlzU3RhcnRJbnN0YW5jZVN0YXR1cyxcbiAgICAgIGpiNGRjQWN0aW9uczogZmxvd0luc3RhbmNlUnVudGltZVBPLmpiNGRjQWN0aW9uc1xuICAgIH07XG4gIH0sXG4gIHBhZ2VSZWFkeUZvclN0YXJ0U3RhdHVzOiBmdW5jdGlvbiBwYWdlUmVhZHlGb3JTdGFydFN0YXR1cyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jLCBmbG93SW5zdGFuY2VSdW50aW1lUE8sIGZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LCBwYWdlSG9zdEluc3RhbmNlKSB7XG4gICAgdGhpcy5fZm9ybVJ1bnRpbWVJbnN0ID0gT2JqZWN0LmNyZWF0ZShGb3JtUnVudGltZSk7XG4gICAgdmFyIHJlY29yZElkID0gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgdmFyIHBhZ2VSZWFkeUlubmVyUGFyYXMgPSB0aGlzLmJ1aWxkUGFnZVJlYWR5SW5uZXJQYXJhcyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHJlY29yZElkLCBmbG93SW5zdGFuY2VSdW50aW1lUE8sIGZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5KTtcbiAgICBjb25zb2xlLmxvZyhwYWdlUmVhZHlJbm5lclBhcmFzKTtcblxuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdC5Jbml0aWFsaXphdGlvbih7XG4gICAgICBcIlJlbmRlcmVyVG9JZFwiOiBcImh0bWxEZXNpZ25SdW50aW1lV3JhcFwiLFxuICAgICAgXCJGb3JtSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5mb3JtSWQsXG4gICAgICBcIlJlY29yZElkXCI6IHJlY29yZElkLFxuICAgICAgXCJCdXR0b25JZFwiOiBcIlwiLFxuICAgICAgXCJPcGVyYXRpb25UeXBlXCI6IEJhc2VVdGlsaXR5LkdldEFkZE9wZXJhdGlvbk5hbWUoKSxcbiAgICAgIFwiSXNQcmV2aWV3XCI6IGZhbHNlLFxuICAgICAgXCJSZW5kZXJlckNoYWluQ29tcGxldGVkRnVuY1wiOiByZW5kZXJlckNoYWluQ29tcGxldGVkRnVuYyxcbiAgICAgIFwiTGlzdEZvcm1CdXR0b25FbGVtSWRcIjogXCJcIixcbiAgICAgIFwiV2ViRm9ybVJUUGFyYXNcIjoge30sXG4gICAgICBcIkZvcm1SdW50aW1lQ2F0ZWdvcnlcIjogRmxvd1J1bnRpbWVQYWdlT2JqZWN0LkZPUk1fUlVOVElNRV9DQVRFR09SWV9GTE9XLFxuICAgICAgXCJQcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jXCI6IHRoaXMucHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuYyxcbiAgICAgIFwiRmxvd0luc3RhbmNlUnVudGltZVBPXCI6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTyxcbiAgICAgIFwiRmxvd01vZGVsUnVudGltZVBPQ2FjaGVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5mbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSxcbiAgICAgIFwiSXNTdGFydEluc3RhbmNlU3RhdHVzXCI6IGlzU3RhcnRJbnN0YW5jZVN0YXR1cyxcbiAgICAgIFwiQ3VycmVudE5vZGVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZUtleSxcbiAgICAgIFwiQ3VycmVudE5vZGVOYW1lXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudE5vZGVOYW1lLFxuICAgICAgXCJNb2RlbElkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxJZCxcbiAgICAgIFwiTW9kZWxSZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLm1vZGVsUmVLZXksXG4gICAgICBcIkN1cnJlbnRUYXNrSWRcIjogXCJcIlxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXJlckFjdGlvbkJ1dHRvbnMoaXNTdGFydEluc3RhbmNlU3RhdHVzLCB0aGlzLl9mb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMpO1xuICAgIHJldHVybiB0aGlzLl9mb3JtUnVudGltZUluc3Q7XG4gIH0sXG4gIHBhZ2VSZWFkeUZvclByb2Nlc3NTdGF0dXM6IGZ1bmN0aW9uIHBhZ2VSZWFkeUZvclByb2Nlc3NTdGF0dXMoaXNTdGFydEluc3RhbmNlU3RhdHVzLCByZW5kZXJlckNoYWluQ29tcGxldGVkRnVuYywgZmxvd0luc3RhbmNlUnVudGltZVBPLCBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSwgcGFnZUhvc3RJbnN0YW5jZSkge1xuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdCA9IE9iamVjdC5jcmVhdGUoRm9ybVJ1bnRpbWUpO1xuICAgIEZsb3dSdW50aW1lUGFnZU9iamVjdC5fZmxvd0luc3RhbmNlUnVudGltZVBPID0gZmxvd0luc3RhbmNlUnVudGltZVBPO1xuICAgIHZhciByZWNvcmRJZCA9IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5pbnN0YW5jZUVudGl0eS5pbnN0UnVCdXNpbmVzc0tleTtcbiAgICB2YXIgcGFnZVJlYWR5SW5uZXJQYXJhcyA9IHRoaXMuYnVpbGRQYWdlUmVhZHlJbm5lclBhcmFzKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgcmVjb3JkSWQsIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTywgZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXkpO1xuICAgIGNvbnNvbGUubG9nKHBhZ2VSZWFkeUlubmVyUGFyYXMpO1xuXG4gICAgdGhpcy5fZm9ybVJ1bnRpbWVJbnN0LkluaXRpYWxpemF0aW9uKHtcbiAgICAgIFwiUmVuZGVyZXJUb0lkXCI6IFwiaHRtbERlc2lnblJ1bnRpbWVXcmFwXCIsXG4gICAgICBcIkZvcm1JZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZvcm1JZCxcbiAgICAgIFwiUmVjb3JkSWRcIjogcmVjb3JkSWQsXG4gICAgICBcIkJ1dHRvbklkXCI6IFwiXCIsXG4gICAgICBcIk9wZXJhdGlvblR5cGVcIjogQmFzZVV0aWxpdHkuR2V0VXBkYXRlT3BlcmF0aW9uTmFtZSgpLFxuICAgICAgXCJJc1ByZXZpZXdcIjogZmFsc2UsXG4gICAgICBcIlJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jXCI6IHJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jLFxuICAgICAgXCJMaXN0Rm9ybUJ1dHRvbkVsZW1JZFwiOiBcIlwiLFxuICAgICAgXCJXZWJGb3JtUlRQYXJhc1wiOiB7fSxcbiAgICAgIFwiRm9ybVJ1bnRpbWVDYXRlZ29yeVwiOiBGbG93UnVudGltZVBhZ2VPYmplY3QuRk9STV9SVU5USU1FX0NBVEVHT1JZX0ZMT1csXG4gICAgICBcIlByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmNcIjogdGhpcy5wcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jLFxuICAgICAgXCJGbG93SW5zdGFuY2VSdW50aW1lUE9cIjogZmxvd0luc3RhbmNlUnVudGltZVBPLFxuICAgICAgXCJGbG93TW9kZWxSdW50aW1lUE9DYWNoZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgXCJJc1N0YXJ0SW5zdGFuY2VTdGF0dXNcIjogaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgXCJDdXJyZW50Tm9kZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnROb2RlS2V5LFxuICAgICAgXCJDdXJyZW50Tm9kZU5hbWVcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZU5hbWUsXG4gICAgICBcIk1vZGVsSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5tb2RlbElkLFxuICAgICAgXCJNb2RlbFJlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxSZUtleSxcbiAgICAgIFwiQ3VycmVudFRhc2tJZFwiOiBcIlwiXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlbmRlcmVyQWN0aW9uQnV0dG9ucyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHRoaXMuX2Zvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcyk7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1SdW50aW1lSW5zdDtcbiAgfSxcbiAgcmVuZGVyZXJBY3Rpb25CdXR0b25zOiBmdW5jdGlvbiByZW5kZXJlckFjdGlvbkJ1dHRvbnMoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMpIHtcbiAgICBBY3Rpb25zUnVudGltZU9iamVjdC5DcmVhdGVBTExBY3Rpb25CdXR0b24oaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMpO1xuICB9LFxuICByZW5kZXJlckZsb3dNb2RlbGVyOiBmdW5jdGlvbiByZW5kZXJlckZsb3dNb2RlbGVyKCkge30sXG4gIGRpc3BsYXlNb2RlbGVyVmlldzogZnVuY3Rpb24gZGlzcGxheU1vZGVsZXJWaWV3KGV2ZW50LCB1aSkge1xuICAgIGlmICghRmxvd1J1bnRpbWVQYWdlT2JqZWN0Ll9pc0NyZWF0ZWRNb2RlbGVyVmlldykge1xuICAgICAgQ3JlYXRlTW9kZWxlclZpZXcoRmxvd1J1bnRpbWVQYWdlT2JqZWN0Ll9mbG93SW5zdGFuY2VSdW50aW1lUE8pO1xuICAgICAgRmxvd1J1bnRpbWVQYWdlT2JqZWN0Ll9pc0NyZWF0ZWRNb2RlbGVyVmlldyA9IHRydWU7XG4gICAgfVxuICB9LFxuICBwcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jOiBmdW5jdGlvbiBwcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jKHNvdXJjZVJ1bnRpbWVIdG1sLCBmb3JtUnVudGltZUluc3QsIHByb3BDb25maWcpIHtcbiAgICB2YXIgZmxvd1BhZ2VDb250YWluZXIgPSAkKFwiPGRpdj5cIiArIHNvdXJjZVJ1bnRpbWVIdG1sICsgXCI8ZGl2PlwiKTtcbiAgICB2YXIgZmxvd0luc3RhbmNlUnVudGltZVBPID0gcHJvcENvbmZpZy5GbG93SW5zdGFuY2VSdW50aW1lUE87XG5cbiAgICBpZiAoZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIikubGVuZ3RoID09IDApIHtcbiAgICAgIGZsb3dQYWdlQ29udGFpbmVyID0gJChcIjxkaXY+PGRpdiBjbGFzcz1cXFwid2ZkY3QtdGFicy1vdXRlci13cmFwLXJ1bnRpbWUgaHRtbC1kZXNpZ24tdGhlbWUtZGVmYXVsdC1yb290LWVsZW0tY2xhc3NcXFwiIGNvbnRyb2xfY2F0ZWdvcnk9XFxcIkNvbnRhaW5lckNvbnRyb2xcXFwiIGRlc2M9XFxcIlxcXCIgZ3JvdXBuYW1lPVxcXCJcXFwiIGlkPVxcXCJ0YWJzX3dyYXBfNTE4NjI3NjE2XFxcIiBpc19qYnVpbGQ0ZGNfZGF0YT1cXFwiZmFsc2VcXFwiIGpidWlsZDRkY19jdXN0b209XFxcInRydWVcXFwiIG5hbWU9XFxcInRhYnNfd3JhcF81MTg2Mjc2MTZcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiIHNlcmlhbGl6ZT1cXFwiZmFsc2VcXFwiIHNob3dfcmVtb3ZlX2J1dHRvbj1cXFwiZmFsc2VcXFwiIHNpbmdsZW5hbWU9XFxcIldGRENUX1RhYkNvbnRhaW5lclxcXCIgc3RhdHVzPVxcXCJlbmFibGVcXFwiIHN0eWxlPVxcXCJcXFwiIGNsaWVudF9yZXNvbHZlPVxcXCJXRkRDVF9UYWJDb250YWluZXJcXFwiPjxkaXY+XCIpO1xuICAgICAgZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIikuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X2Zvcm1fOTk5XFxcIj5cIiArIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5tb2RlbE5hbWUgKyBcIjwvZGl2PlwiKTtcbiAgICAgIGZsb3dQYWdlQ29udGFpbmVyLmNoaWxkcmVuKFwiW3NpbmdsZW5hbWU9J1dGRENUX1RhYkNvbnRhaW5lciddXCIpLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd19mb3JtXzk5OVxcXCI+XCIgKyBzb3VyY2VSdW50aW1lSHRtbCArIFwiPC9kaXY+XCIpO1xuICAgIH1cblxuICAgIHZhciB0YWJDb250YWluZXIgPSBmbG93UGFnZUNvbnRhaW5lci5jaGlsZHJlbihcIltzaW5nbGVuYW1lPSdXRkRDVF9UYWJDb250YWluZXInXVwiKTtcblxuICAgIGlmIChmbG93SW5zdGFuY2VSdW50aW1lUE8uamI0ZGNDb250ZW50RG9jdW1lbnRQbHVnaW4gPT0gXCJ1cGxvYWRDb252ZXJ0VG9QREZQbHVnaW5cIikge1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfdXBsb2FkQ29udmVydFRvUERGUGx1Z2luXzk5OVxcXCI+5q2j5paHPC9kaXY+XCIpO1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfdXBsb2FkQ29udmVydFRvUERGUGx1Z2luXzk5OVxcXCI+XCIgKyBEb2N1bWVudENvbnRlbnRVcGxvYWRDb252ZXJ0VG9QREZQbHVnaW4uZ2V0SHRtbEVsZW0oKSArIFwiPC9kaXY+XCIpO1xuICAgIH0gZWxzZSBpZiAoZmxvd0luc3RhbmNlUnVudGltZVBPLmpiNGRjQ29udGVudERvY3VtZW50UGx1Z2luID09IFwid3BzT25saW5lRG9jdW1lbnRQbHVnaW5cIikge1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfd3BzT25saW5lRG9jdW1lbnRQbHVnaW5fOTk5XFxcIj7mraPmloc8L2Rpdj5cIik7XG4gICAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF93cHNPbmxpbmVEb2N1bWVudFBsdWdpbl85OTlcXFwiPuacquWunueOsDwvZGl2PlwiKTtcbiAgICB9XG5cbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X21vZGVsZXJfOTk5XFxcIj7mtYHnqIvlm748L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd19tb2RlbGVyXzk5OVxcXCIgc3R5bGU9J2hlaWdodDogY2FsYygxMDAlIC0gNTBweCk7JyBvbkFjdGl2aXR5PVxcXCJGbG93UnVudGltZVBhZ2VPYmplY3QuZGlzcGxheU1vZGVsZXJWaWV3XFxcIj48ZGl2IGlkPVxcXCJmbG93LWNhbnZhc1xcXCIgc3R5bGU9XFxcImhlaWdodDoxMDAlO1xcXCI+PC9kaXY+PC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfc2VxdWVuY2VfOTk5XFxcIj7pobrluo/lm748L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd19zZXF1ZW5jZV85OTlcXFwiPjwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X3Rhc2tfOTk5XFxcIj7mtYHovazkv6Hmga88L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd190YXNrXzk5OVxcXCI+PC9kaXY+XCIpO1xuICAgIHZhciBuZXdSdW50aW1lSHRtbCA9IGZsb3dQYWdlQ29udGFpbmVyLmh0bWwoKTtcbiAgICByZXR1cm4gbmV3UnVudGltZUh0bWw7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBGbG93UnVudGltZVZhckJ1aWxkZXIgPSB7XG4gIEJ1aWxkZXJTZWxlY3RlZFJlY2VpdmVyVG9JbnN0YW5jZVZhcjogZnVuY3Rpb24gQnVpbGRlclNlbGVjdGVkUmVjZWl2ZXJUb0luc3RhbmNlVmFyKG5leHRGbG93Tm9kZUVudGl0aWVzLCBzZWxlY3RlZFJlY2VpdmVyRGF0YSkge1xuICAgIHZhciByZXN1bHREYXRhID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGVkUmVjZWl2ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcmVjZWl2ZXIgPSBzZWxlY3RlZFJlY2VpdmVyRGF0YVtpXTtcbiAgICAgIHJlc3VsdERhdGEucHVzaCh7XG4gICAgICAgIG5leHROb2RlSWQ6IHJlY2VpdmVyLmZsb3dOb2RlRW50aXR5LmlkLFxuICAgICAgICByZWNlaXZlcklkOiByZWNlaXZlci5pZCxcbiAgICAgICAgcmVjZWl2ZXJOYW1lOiByZWNlaXZlci5uYW1lLFxuICAgICAgICByZWNlaXZlclR5cGVOYW1lOiByZWNlaXZlci50eXBlTmFtZSxcbiAgICAgICAgcmVjZWl2ZVR5cGU6IHJlY2VpdmVyLnJlY2VpdmVUeXBlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0RGF0YTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdvcmtGbG93U2VuZEFjdGlvbiA9IHtcbiAgYWNJbnRlcmZhY2U6IHtcbiAgICByZXNvbHZlTmV4dFBvc3NpYmxlRmxvd05vZGU6IFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvSW5zdGFuY2VSdW50aW1lL1Jlc29sdmVOZXh0UG9zc2libGVGbG93Tm9kZVwiLFxuICAgIGNvbXBsZXRlVGFzazogXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9JbnN0YW5jZVJ1bnRpbWUvQ29tcGxldGVUYXNrXCJcbiAgfSxcbiAgX1Byb3A6IHt9LFxuICBJbnN0YW5jZTogZnVuY3Rpb24gSW5zdGFuY2UoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMsIGFjdGlvbk9iaikge1xuICAgIGNvbnNvbGUubG9nKGFjdGlvbk9iaik7XG4gICAgdmFyIGh0bWxJZCA9IGFjdGlvbk9iai5hY3Rpb25IVE1MSWQgPyBhY3Rpb25PYmouYWN0aW9uSFRNTElkIDogYWN0aW9uT2JqLmFjdGlvbkNvZGU7XG4gICAgdmFyIGVsZW0gPSAkKCc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm9wZXJhdGlvbi1idXR0b24gb3BlcmF0aW9uLWJ1dHRvbi1wcmltYXJ5XCIgaWQ9XCInICsgaHRtbElkICsgJ1wiPjxzcGFuPicgKyBhY3Rpb25PYmouYWN0aW9uQ2FwdGlvbiArICc8L3NwYW4+PC9idXR0b24+Jyk7XG4gICAgdGhpcy5fUHJvcCA9IHtcbiAgICAgIFwic2VuZGVyXCI6IHRoaXMsXG4gICAgICBcImZsb3dJbnN0YW5jZVJ1bnRpbWVQT1wiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQTyxcbiAgICAgIFwiZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5mbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSxcbiAgICAgIFwiamI0ZGNBY3Rpb25zXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuamI0ZGNBY3Rpb25zLFxuICAgICAgXCJmb3JtUnVudGltZUluc3RcIjogZm9ybVJ1bnRpbWVJbnN0LFxuICAgICAgXCJhY3Rpb25PYmpcIjogYWN0aW9uT2JqLFxuICAgICAgXCJpc1N0YXJ0SW5zdGFuY2VTdGF0dXNcIjogaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgXCJwYWdlSG9zdEluc3RhbmNlXCI6IHBhZ2VIb3N0SW5zdGFuY2UsXG4gICAgICBcImN1cnJlbnROb2RlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudE5vZGVLZXksXG4gICAgICBcImN1cnJlbnROb2RlTmFtZVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnROb2RlTmFtZSxcbiAgICAgIFwicmVjb3JkSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5yZWNvcmRJZCxcbiAgICAgIFwibW9kZWxJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLm1vZGVsSWQsXG4gICAgICBcIm1vZGVsUmVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5tb2RlbFJlS2V5LFxuICAgICAgXCJjdXJyZW50VGFza0lkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudFRhc2tJZFxuICAgIH07XG4gICAgZWxlbS5iaW5kKFwiY2xpY2tcIiwgdGhpcy5fUHJvcCwgdGhpcy5CdXR0b25DbGlja0V2ZW50KTtcbiAgICByZXR1cm4ge1xuICAgICAgZWxlbTogZWxlbVxuICAgIH07XG4gIH0sXG4gIEJ1dHRvbkNsaWNrRXZlbnQ6IGZ1bmN0aW9uIEJ1dHRvbkNsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgdmFyIHZhbGlkYXRlUmVzdWx0ID0gVmFsaWRhdGVSdWxlc1J1bnRpbWUuVmFsaWRhdGVTdWJtaXRFbmFibGUoKTtcblxuICAgIGlmIChWYWxpZGF0ZVJ1bGVzUnVudGltZS5BbGVydFZhbGlkYXRlRXJyb3JzKHZhbGlkYXRlUmVzdWx0KSkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydExvYWRpbmcod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCwge30sIFwiXCIpO1xuICAgICAgdmFyIF9wcm9wID0gc2VuZGVyLmRhdGE7XG4gICAgICB2YXIgX3RoaXMgPSBfcHJvcC5zZW5kZXI7XG5cbiAgICAgIHZhciBzZW5kRGF0YSA9IF90aGlzLkJ1aWxkU2VuZFRvU2VydmVyRGF0YShfcHJvcCwgbnVsbCk7XG5cbiAgICAgIGlmIChzZW5kRGF0YS5zdWNjZXNzKSB7XG4gICAgICAgIEFqYXhVdGlsaXR5LlBvc3QoX3RoaXMuYWNJbnRlcmZhY2UucmVzb2x2ZU5leHRQb3NzaWJsZUZsb3dOb2RlLCBzZW5kRGF0YS5kYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgICAgIGlmIChyZXN1bHQuZGF0YS5uZXh0VGFza0lzRW5kRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWQocmVzdWx0LmRhdGEuYnBtblRhc2tMaXN0LCBbXSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQuZGF0YS5jdXJyZW50VGFza0lzTXVsdGlJbnN0YW5jZSAmJiByZXN1bHQuZGF0YS5jdXJyZW50VGFza011bHRpQ29tcGxldGVkSW5zdGFuY2VzICsgMSA8IHJlc3VsdC5kYXRhLmN1cnJlbnRUYXNrTXVsdGlDb3VudEVuZ0luc3RhbmNlcykge1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RSZWNlaXZlckNvbXBsZXRlZChyZXN1bHQuZGF0YS5icG1uVGFza0xpc3QsIFtdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgVXNlclRhc2tSZWNlaXZlckRpYWxvZ1V0aWxpdHkuU2hvd0RpYWxvZyhfcHJvcC5zZW5kZXIsIHJlc3VsdC5kYXRhLmJwbW5UYXNrTGlzdCwgX3Byb3Auc2VuZGVyLlNlbGVjdFJlY2VpdmVyQ29tcGxldGVkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIF9wcm9wLnNlbmRlcik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBTZWxlY3RSZWNlaXZlckNvbXBsZXRlZDogZnVuY3Rpb24gU2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWQobmV4dFRhc2tFbnRpdHlMaXN0LCBzZWxlY3RlZFJlY2VpdmVyRGF0YSkge1xuICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkUmVjZWl2ZXJEYXRhKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLl9Qcm9wLmFjdGlvbk9iai5hY3Rpb25DYXB0aW9uKTtcbiAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOaJp+ihjOWPkemAgT9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGVjdGVkUmVjZWl2ZXJWYXJzID0gRmxvd1J1bnRpbWVWYXJCdWlsZGVyLkJ1aWxkZXJTZWxlY3RlZFJlY2VpdmVyVG9JbnN0YW5jZVZhcihuZXh0VGFza0VudGl0eUxpc3QsIHNlbGVjdGVkUmVjZWl2ZXJEYXRhKTtcbiAgICAgIHZhciBzZW5kRGF0YSA9IHRoaXMuQnVpbGRTZW5kVG9TZXJ2ZXJEYXRhKHRoaXMuX1Byb3AsIHtcbiAgICAgICAgc2VsZWN0ZWRSZWNlaXZlclZhcnM6IGVuY29kZVVSSUNvbXBvbmVudChKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcoc2VsZWN0ZWRSZWNlaXZlclZhcnMpKVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChzZW5kRGF0YS5zdWNjZXNzKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRMb2FkaW5nKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQsIHt9LCBcIuezu+e7n+WkhOeQhuS4rSzor7fnqI3lgJkhXCIpO1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuY29tcGxldGVUYXNrLCBzZW5kRGF0YS5kYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG5cbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIHdpbmRvdy5PcGVuZXJXaW5kb3dPYmouaW5zdGFuY2VNYWluVGFza1Byb2Nlc3NMaXN0LnJlbG9hZERhdGEoKTtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX0Nsb3NlRGlhbG9nKHdpbmRvdyk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEVycm9yKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydEVycm9ySWQsIHt9LCByZXN1bHQuZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMuX1Byb3Auc2VuZGVyKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgQnVpbGRTZW5kVG9TZXJ2ZXJEYXRhOiBmdW5jdGlvbiBCdWlsZFNlbmRUb1NlcnZlckRhdGEoX3Byb3AsIGFwcGVuZFNlbmRNYXApIHtcbiAgICB2YXIgZm9ybURhdGFDb21wbGV4UE8gPSBfcHJvcC5mb3JtUnVudGltZUluc3QuU2VyaWFsaXphdGlvbkZvcm1EYXRhKCk7XG5cbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgaXNTdGFydEluc3RhbmNlU3RhdHVzOiBfcHJvcC5pc1N0YXJ0SW5zdGFuY2VTdGF0dXMsXG4gICAgICAgIGFjdGlvbkNvZGU6IF9wcm9wLmFjdGlvbk9iai5hY3Rpb25Db2RlLFxuICAgICAgICBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleTogX3Byb3AuZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXksXG4gICAgICAgIFwiZm9ybVJlY29yZENvbXBsZXhQT1N0cmluZ1wiOiBlbmNvZGVVUklDb21wb25lbnQoSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKGZvcm1EYXRhQ29tcGxleFBPKSksXG4gICAgICAgIFwiY3VycmVudE5vZGVLZXlcIjogX3Byb3AuY3VycmVudE5vZGVLZXksXG4gICAgICAgIFwiY3VycmVudE5vZGVOYW1lXCI6IF9wcm9wLmN1cnJlbnROb2RlTmFtZSxcbiAgICAgICAgXCJyZWNvcmRJZFwiOiBfcHJvcC5yZWNvcmRJZCxcbiAgICAgICAgXCJtb2RlbElkXCI6IF9wcm9wLm1vZGVsSWQsXG4gICAgICAgIFwibW9kZWxSZUtleVwiOiBfcHJvcC5tb2RlbFJlS2V5LFxuICAgICAgICBcImN1cnJlbnRUYXNrSWRcIjogX3Byb3AuY3VycmVudFRhc2tJZFxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoYXBwZW5kU2VuZE1hcCkge1xuICAgICAgZm9yICh2YXIga2V5IGluIGFwcGVuZFNlbmRNYXApIHtcbiAgICAgICAgcmVzdWx0LmRhdGFba2V5XSA9IGFwcGVuZFNlbmRNYXBba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyVnVlO1xudmFyIFVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dVdGlsaXR5ID0ge1xuICBTaG93RGlhbG9nOiBmdW5jdGlvbiBTaG93RGlhbG9nKHNlbmRlciwgbmV4dEZsb3dOb2RlRW50aXRpZXMsIHNlbGVjdFJlY2VpdmVyQ29tcGxldGVkRnVuYykge1xuICAgIGlmICghdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyVnVlKSB7XG4gICAgICAkKGRvY3VtZW50LmJvZHkpLmFwcGVuZChcIjxkaXYgaWQ9J3VzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlcic+PHVzZXItdGFzay1yZWNlaXZlci1kaWFsb2cgcmVmPSd1c2VyVGFza1JlY2VpdmVyRGlhbG9nJz48L3VzZXItdGFzay1yZWNlaXZlci1kaWFsb2c+PC9kaXY+XCIpO1xuICAgICAgdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyVnVlID0gbmV3IFZ1ZSh7XG4gICAgICAgIGVsOiBcIiN1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgICAgICBnZXRSdW50aW1lTW9kZWxXaXRoU3RhcnQ6IFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvTW9kZWxSdW50aW1lL0dldFJ1bnRpbWVNb2RlbFdpdGhTdGFydFwiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gICAgICAgIG1ldGhvZHM6IHt9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUuJHJlZnMudXNlclRhc2tSZWNlaXZlckRpYWxvZy5iZWdpblNlbGVjdFJlY2VpdmVyKHNlbmRlciwgbmV4dEZsb3dOb2RlRW50aXRpZXMsIHNlbGVjdFJlY2VpdmVyQ29tcGxldGVkRnVuYyk7XG4gIH0sXG4gIENsb3NlRGlhbG9nOiBmdW5jdGlvbiBDbG9zZURpYWxvZygpIHtcbiAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbSh1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUuJHJlZnMudXNlclRhc2tSZWNlaXZlckRpYWxvZy4kcmVmcy51c2VyVGFza1JlY2VpdmVyRGlhbG9nV3JhcCk7XG4gICAgdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyVnVlID0gbnVsbDtcbiAgICAkKFwiI3VzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclwiKS5yZW1vdmUoKTtcbiAgICBEaWFsb2dVdGlsaXR5LlJlbW92ZURpYWxvZ1JlbWFpbmluZ0VsZW0oXCJ1c2VyVGFza1JlY2VpdmVyRGlhbG9nSW5uZXJcIik7XG4gIH1cbn07XG5WdWUuY29tcG9uZW50KFwidXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7fSxcbiAgICAgIG5leHRGbG93Tm9kZUVudGl0aWVzOiBbXSxcbiAgICAgIHJlY2VpdmVyVHJlZToge1xuICAgICAgICB0cmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2s6IHtcbiAgICAgICAgICAgIGVuYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICByYWRpb1R5cGU6IFwiYWxsXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFzeW5jOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixcbiAgICAgICAgICAgIHVybDogQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24oXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9SZWNlaXZlclJ1bnRpbWUvR2V0QXN5bmNSZWNlaXZlcnNcIiksXG4gICAgICAgICAgICBhdXRvUGFyYW06IFtcImlkXCIsIFwidHlwZU5hbWVcIiwgXCJuYW1lXCJdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJuYW1lXCIsXG4gICAgICAgICAgICAgIGNoaWxkcmVuOiBcInJ1bnRpbWVSZWNlaXZlVXNlcnNcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJpZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwicGFyZW50SWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHt9LFxuICAgICAgICAgICAgb25EYmxDbGljazogZnVuY3Rpb24gb25EYmxDbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLmdldFpUcmVlT2JqKHRyZWVJZCkuX2hvc3Q7XG5cbiAgICAgICAgICAgICAgdmFyIGZsb3dOb2RlRW50aXR5ID0gdGhpcy5nZXRaVHJlZU9iaih0cmVlSWQpLmZsb3dOb2RlRW50aXR5O1xuICAgICAgICAgICAgICB2YXIgcmVjZWl2ZVR5cGUgPSB0aGlzLmdldFpUcmVlT2JqKHRyZWVJZCkucmVjZWl2ZVR5cGU7XG5cbiAgICAgICAgICAgICAgX3RoaXMuYWRkUmVjZWl2ZXJUb1NlbGVjdGVkKHRyZWVOb2RlLCBmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJlZm9yZUFzeW5jOiBmdW5jdGlvbiBiZWZvcmVBc3luYyh0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRyZWVJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0cmVlT2JqTWFwOiB7fVxuICAgICAgfSxcbiAgICAgIHNlbGVjdGVkUmVjZWl2ZXI6IHtcbiAgICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgICB0aXRsZTogJ+W3sumAieeUqOaItycsXG4gICAgICAgICAga2V5OiAnbmFtZScsXG4gICAgICAgICAgd2lkdGg6IDE4OCxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICfmk43kvZwnLFxuICAgICAgICAgIHNsb3Q6ICdhY3Rpb24nLFxuICAgICAgICAgIHdpZHRoOiA3MCxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9XSxcbiAgICAgICAgcmVjZWl2ZXJEYXRhOiBbXVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgZmlsdGVyczoge1xuICAgIGZpbHRlclJlY2VpdmVyRGF0YTogZnVuY3Rpb24gZmlsdGVyUmVjZWl2ZXJEYXRhKHJlY2VpdmVyRGF0YSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICByZXR1cm4gcmVjZWl2ZXJEYXRhLmZpbHRlcihmdW5jdGlvbiAocmVjZWl2ZXIpIHtcbiAgICAgICAgcmV0dXJuIHJlY2VpdmVyLmZsb3dOb2RlRW50aXR5LmlkID09IGZsb3dOb2RlRW50aXR5LmlkICYmIHJlY2VpdmVyLnJlY2VpdmVUeXBlID09IHJlY2VpdmVUeXBlO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgYmVnaW5TZWxlY3RSZWNlaXZlcjogZnVuY3Rpb24gYmVnaW5TZWxlY3RSZWNlaXZlcihzZW5kZXIsIG5leHRGbG93Tm9kZUVudGl0aWVzLCBzZWxlY3RSZWNlaXZlckNvbXBsZXRlZEZ1bmMpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy51c2VyVGFza1JlY2VpdmVyRGlhbG9nV3JhcDtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogNjUwLFxuICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup5o6l5pS25Lq65ZGYXCIsXG4gICAgICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICBcIuehruiupFwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLnZhbGlkYXRlQ29tcGxldGVFbmFibGUoKS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgIHNlbGVjdFJlY2VpdmVyQ29tcGxldGVkRnVuYy5jYWxsKHNlbmRlciwgX3RoaXMubmV4dEZsb3dOb2RlRW50aXRpZXMsIF90aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwi5Y+W5raIXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgICBVc2VyVGFza1JlY2VpdmVyRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb3BlbjogZnVuY3Rpb24gb3BlbihldmVudCwgdWkpIHtcbiAgICAgICAgICAkKFwiLnVpLWRpYWxvZy10aXRsZWJhci1jbG9zZVwiLCAkKHRoaXMpLnBhcmVudCgpKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5uZXh0Rmxvd05vZGVFbnRpdGllcyA9IG5leHRGbG93Tm9kZUVudGl0aWVzO1xuICAgICAgd2luZG93LnNldFRpbWVvdXQodGhpcy5pbml0VHJlZSwgNTAwKTtcbiAgICB9LFxuICAgIGluaXRUcmVlOiBmdW5jdGlvbiBpbml0VHJlZSgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5uZXh0Rmxvd05vZGVFbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZmxvd05vZGVFbnRpdHkgPSB0aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldO1xuXG4gICAgICAgIGlmIChmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cyAmJiBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY01haW5SZWNlaXZlT2JqZWN0cyAmJiBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY01haW5SZWNlaXZlT2JqZWN0cy5ydW50aW1lUmVjZWl2ZUdyb3Vwcykge1xuICAgICAgICAgIHZhciB0cmVlT2JqS2V5ID0gdGhpcy5idWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCBcIm1haW5cIik7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XSA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI1wiICsgdHJlZU9iaktleSksIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVTZXR0aW5nLCBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY01haW5SZWNlaXZlT2JqZWN0cy5ydW50aW1lUmVjZWl2ZUdyb3Vwcyk7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XS5faG9zdCA9IHRoaXM7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XS5mbG93Tm9kZUVudGl0eSA9IGZsb3dOb2RlRW50aXR5O1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0ucmVjZWl2ZVR5cGUgPSBcIm1haW5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cyAmJiBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY0NDUmVjZWl2ZU9iamVjdHMgJiYgZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNDQ1JlY2VpdmVPYmplY3RzLnJ1bnRpbWVSZWNlaXZlR3JvdXBzKSB7XG4gICAgICAgICAgdmFyIHRyZWVPYmpLZXkgPSB0aGlzLmJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIFwiY2NcIik7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XSA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI1wiICsgdHJlZU9iaktleSksIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVTZXR0aW5nLCBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY0NDUmVjZWl2ZU9iamVjdHMucnVudGltZVJlY2VpdmVHcm91cHMpO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0uX2hvc3QgPSB0aGlzO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0uZmxvd05vZGVFbnRpdHkgPSBmbG93Tm9kZUVudGl0eTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldLnJlY2VpdmVUeXBlID0gXCJjY1wiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBidWlsZFVsVHJlZUlkOiBmdW5jdGlvbiBidWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgcmV0dXJuICd1bFRyZWVfJyArIHJlY2VpdmVUeXBlICsgXCJfXCIgKyBmbG93Tm9kZUVudGl0eS5pZDtcbiAgICB9LFxuICAgIGFkZFRyZWVTZWxlY3RlZFJlY2VpdmVyVG9TZWxlY3RlZDogZnVuY3Rpb24gYWRkVHJlZVNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgdmFyIHRyZWVLZXkgPSB0aGlzLmJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKTtcbiAgICAgIHZhciB0cmVlT2JqZWN0ID0gdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlS2V5XTtcblxuICAgICAgaWYgKHRyZWVPYmplY3QpIHtcbiAgICAgICAgdmFyIHNlbGVjdE5vZGVzID0gdHJlZU9iamVjdC5nZXRTZWxlY3RlZE5vZGVzKCk7XG5cbiAgICAgICAgaWYgKHNlbGVjdE5vZGVzICYmIHNlbGVjdE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLmFkZFJlY2VpdmVyVG9TZWxlY3RlZChzZWxlY3ROb2Rlc1swXSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgYWRkUmVjZWl2ZXJUb1NlbGVjdGVkOiBmdW5jdGlvbiBhZGRSZWNlaXZlclRvU2VsZWN0ZWQoc2VsZWN0Tm9kZSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICB2YXIgaXNNdWx0aUluc3RhbmNlVGFzayA9IHRoaXMuaXNNdWx0aUluc3RhbmNlVGFzayhmbG93Tm9kZUVudGl0eSk7XG4gICAgICB2YXIgaW5uZXJTaW5nbGVJZCA9IGZsb3dOb2RlRW50aXR5LmlkICsgXCJfXCIgKyByZWNlaXZlVHlwZSArIFwiX1wiICsgc2VsZWN0Tm9kZS5pZDtcblxuICAgICAgaWYgKHNlbGVjdE5vZGUudHlwZU5hbWUgPT0gXCJTaW5nbGVVc2VyXCIpIHtcbiAgICAgICAgc2VsZWN0Tm9kZS5pbm5lclNpbmdsZUlkID0gaW5uZXJTaW5nbGVJZDtcbiAgICAgICAgc2VsZWN0Tm9kZS5mbG93Tm9kZUVudGl0eSA9IGZsb3dOb2RlRW50aXR5O1xuICAgICAgICBzZWxlY3ROb2RlLnJlY2VpdmVUeXBlID0gcmVjZWl2ZVR5cGU7XG5cbiAgICAgICAgaWYgKChyZWNlaXZlVHlwZSA9PSBcImNjXCIgfHwgaXNNdWx0aUluc3RhbmNlVGFzaykgJiYgIUFycmF5VXRpbGl0eS5FeGlzdCh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLmlubmVyU2luZ2xlSWQgPT0gaW5uZXJTaW5nbGVJZDtcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLnB1c2goc2VsZWN0Tm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAocmVjZWl2ZVR5cGUgPT0gXCJtYWluXCIgJiYgIWlzTXVsdGlJbnN0YW5jZVRhc2spIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhW2ldLmZsb3dOb2RlRW50aXR5LmlkID09IGZsb3dOb2RlRW50aXR5LmlkICYmIHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGFbaV0ucmVjZWl2ZVR5cGUgPT0gcmVjZWl2ZVR5cGUpIHtcbiAgICAgICAgICAgICAgQXJyYXlVdGlsaXR5LkRlbGV0ZSh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLnB1c2goc2VsZWN0Tm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNNdWx0aUluc3RhbmNlVGFzayAmJiAoc2VsZWN0Tm9kZS50eXBlTmFtZSA9PSBcIlVzZXJzXCIgfHwgc2VsZWN0Tm9kZS50eXBlTmFtZSA9PSBcIlJvbGVcIiB8fCBzZWxlY3ROb2RlLnR5cGVOYW1lID09IFwiT3JnYW5zXCIpKSB7XG4gICAgICAgIGlmIChzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnMgIT0gbnVsbCAmJiBzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGROb2RlID0gc2VsZWN0Tm9kZS5ydW50aW1lUmVjZWl2ZVVzZXJzW19pXTtcblxuICAgICAgICAgICAgaWYgKGNoaWxkTm9kZS50eXBlTmFtZSA9PSBcIlNpbmdsZVVzZXJcIikge1xuICAgICAgICAgICAgICB0aGlzLmFkZFJlY2VpdmVyVG9TZWxlY3RlZChjaGlsZE5vZGUsIGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBjbGVhclNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkOiBmdW5jdGlvbiBjbGVhclNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdmFyIHJlY2VpdmVyID0gdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YVtpXTtcblxuICAgICAgICBpZiAocmVjZWl2ZXIuZmxvd05vZGVFbnRpdHkuaWQgPT0gZmxvd05vZGVFbnRpdHkuaWQgJiYgcmVjZWl2ZXIucmVjZWl2ZVR5cGUgPT0gcmVjZWl2ZVR5cGUpIHtcbiAgICAgICAgICBBcnJheVV0aWxpdHkuRGVsZXRlKHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEsIGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBkZWxldGVTZWxlY3RlZFJlY2VpdmVyOiBmdW5jdGlvbiBkZWxldGVTZWxlY3RlZFJlY2VpdmVyKGluZGV4LCByb3cpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YVtpXS5pbm5lclNpbmdsZUlkID09IHJvdy5pbm5lclNpbmdsZUlkKSB7XG4gICAgICAgICAgQXJyYXlVdGlsaXR5LkRlbGV0ZSh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgaXNNdWx0aUluc3RhbmNlVGFzazogZnVuY3Rpb24gaXNNdWx0aUluc3RhbmNlVGFzayhmbG93Tm9kZUVudGl0eSkge1xuICAgICAgcmV0dXJuIGZsb3dOb2RlRW50aXR5Lm11bHRpSW5zdGFuY2VUYXNrO1xuICAgIH0sXG4gICAgYnVpbGRUYWJMYWJlbDogZnVuY3Rpb24gYnVpbGRUYWJMYWJlbChmbG93Tm9kZUVudGl0eSkge1xuICAgICAgcmV0dXJuIGZsb3dOb2RlRW50aXR5Lm5hbWUgKyBcIiBbXCIgKyAodGhpcy5pc011bHRpSW5zdGFuY2VUYXNrKGZsb3dOb2RlRW50aXR5KSA/IFwi5aSa5Lq6XCIgOiBcIuWNleS6ulwiKSArIFwiXVwiO1xuICAgIH0sXG4gICAgdmFsaWRhdGVDb21wbGV0ZUVuYWJsZTogZnVuY3Rpb24gdmFsaWRhdGVDb21wbGV0ZUVuYWJsZSgpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgZXJyb3JNZXNzYWdlcyA9IFtdO1xuICAgICAgdmFyIHN1Y2Nlc3MgPSB0cnVlO1xuXG4gICAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XG4gICAgICAgIGlmIChfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0udGFza1R5cGVOYW1lID09IFwiY29tLmpiNGRjLndvcmtmbG93LnBvLmJwbW4ucHJvY2Vzcy5CcG1uVXNlclRhc2tcIikge1xuICAgICAgICAgIGlmICghQXJyYXlVdGlsaXR5LkV4aXN0KF90aGlzMi5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLmZsb3dOb2RlRW50aXR5LmlkID09IF90aGlzMi5uZXh0Rmxvd05vZGVFbnRpdGllc1tpXS5pZCAmJiBpdGVtLnJlY2VpdmVUeXBlID09IFwibWFpblwiO1xuICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgICB0YXNrTmFtZTogX3RoaXMyLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldLm5hbWUsXG4gICAgICAgICAgICAgIGZsb3dOb2RlRW50aXR5OiBfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0sXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IFwi546v6IqCW1wiICsgX3RoaXMyLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldLm5hbWUgKyBcIl3oh7PlsJHpnIDopoHorr7nva7kuIDkuKrmjqXmlLbnlKjmiLchXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIF9sb29wKGkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JNZXNzYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBlcnJvclRleHRBcnkgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9yTWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBlcnJvclRleHRBcnkucHVzaChlcnJvck1lc3NhZ2VzW2ldLm1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoZXJyb3JUZXh0QXJ5LmpvaW4oXCI8YnIgLz5cIiksIHRoaXMpO1xuICAgICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IHN1Y2Nlc3NcbiAgICAgIH07XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IGlkPVxcXCJ1c2VyVGFza1JlY2VpdmVyRGlhbG9nSW5uZXJcXFwiIHJlZj1cXFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ1dyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgPHRhYnMgbmFtZT1cXFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ1RhYnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPHRhYi1wYW5lIDpsYWJlbD1cXFwiYnVpbGRUYWJMYWJlbChmbG93Tm9kZUVudGl0eSlcXFwiIHRhYj1cXFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ1RhYnNcXFwiIHYtZm9yPVxcXCJmbG93Tm9kZUVudGl0eSBpbiBuZXh0Rmxvd05vZGVFbnRpdGllc1xcXCIgOmtleT1cXFwiZmxvd05vZGVFbnRpdHkuaWRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2xsYXBzZSBhY2NvcmRpb24gdmFsdWU9XFxcIm1haW5SZWNlaXZlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYW5lbCBuYW1lPVxcXCJtYWluUmVjZWl2ZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NEUzQlxcdTkwMDFcXHU0RUJBXFx1NTQ1OFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzbG90PVxcXCJjb250ZW50XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ1c2VyLXRhc2stcmVjZWl2ZXItZGlhbG9nLW91dGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3RFbmFibGVVc2VyTGlzdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgOmlkPVxcXCJidWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCdtYWluJylcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCIgc3R5bGU9XFxcIndpZHRoOiAyMDBweFxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdE9wQnV0dG9uQ29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNpbmdsZS1vcC1idXR0b25cXFwiIHRpdGxlPVxcXCJcXHU2REZCXFx1NTJBMFxcdTRFQkFcXHU1NDU4XFxcIiBAY2xpY2s9XFxcImFkZFRyZWVTZWxlY3RlZFJlY2VpdmVyVG9TZWxlY3RlZChmbG93Tm9kZUVudGl0eSwnbWFpbicpXFxcIj48SWNvbiB0eXBlPVxcXCJtZC1hcnJvdy1yb3VuZC1mb3J3YXJkXFxcIiAvPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2luZ2xlLW9wLWJ1dHRvblxcXCIgdGl0bGU9XFxcIlxcdTZFMDVcXHU3QTdBXFx1NURGMlxcdTkwMDlcXHU0RUJBXFx1NTQ1OFxcXCIgQGNsaWNrPVxcXCJjbGVhclNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCdtYWluJylcXFwiPjxJY29uIHR5cGU9XFxcIm1kLWJhY2tzcGFjZVxcXCIgLz48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdGVkVXNlckxpc3RcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgaGVpZ2h0PVxcXCIzMjdcXFwiIHdpZHRoPVxcXCIyNjBcXFwiIHN0cmlwZSA6Y29sdW1ucz1cXFwic2VsZWN0ZWRSZWNlaXZlci5jb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwic2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEgfCBmaWx0ZXJSZWNlaXZlckRhdGEoZmxvd05vZGVFbnRpdHksICdtYWluJylcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90LXNjb3BlPVxcXCJ7IHJvdywgaW5kZXggfVxcXCIgc2xvdD1cXFwiYWN0aW9uXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlzdC1mb250LWljb24tYnV0dG9uLWNsYXNzXFxcIiBAY2xpY2s9XFxcImRlbGV0ZVNlbGVjdGVkUmVjZWl2ZXIoaW5kZXgscm93KVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiB0eXBlPVxcXCJtZC1jbG9zZVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT4gICAgIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3BhbmVsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGFuZWwgbmFtZT1cXFwiY2NSZWNlaXZlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU2Mjg0XFx1OTAwMVxcdTRFQkFcXHU1NDU4XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHNsb3Q9XFxcImNvbnRlbnRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInVzZXItdGFzay1yZWNlaXZlci1kaWFsb2ctb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdEVuYWJsZVVzZXJMaXN0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCA6aWQ9XFxcImJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksJ2NjJylcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCIgc3R5bGU9XFxcIndpZHRoOiAyMDBweFxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdE9wQnV0dG9uQ29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNpbmdsZS1vcC1idXR0b25cXFwiIHRpdGxlPVxcXCJcXHU2REZCXFx1NTJBMFxcdTRFQkFcXHU1NDU4XFxcIiBAY2xpY2s9XFxcImFkZFJlY2VpdmVyVG9TZWxlY3RlZChmbG93Tm9kZUVudGl0eSwnY2MnKVxcXCI+PEljb24gdHlwZT1cXFwibWQtYXJyb3ctcm91bmQtZm9yd2FyZFxcXCIgLz48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNpbmdsZS1vcC1idXR0b25cXFwiIHRpdGxlPVxcXCJcXHU2RTA1XFx1N0E3QVxcdTVERjJcXHU5MDA5XFx1NEVCQVxcdTU0NThcXFwiPjxJY29uIHR5cGU9XFxcIm1kLWJhY2tzcGFjZVxcXCIgLz48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdGVkVXNlckxpc3RcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgaGVpZ2h0PVxcXCIzMjdcXFwiIHdpZHRoPVxcXCIyNjBcXFwiIHN0cmlwZSA6Y29sdW1ucz1cXFwic2VsZWN0ZWRSZWNlaXZlci5jb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwic2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEgfCBmaWx0ZXJSZWNlaXZlckRhdGEoZmxvd05vZGVFbnRpdHksICdjYycpXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGVtcGxhdGUgc2xvdC1zY29wZT1cXFwieyByb3csIGluZGV4IH1cXFwiIHNsb3Q9XFxcImFjdGlvblxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpc3QtZm9udC1pY29uLWJ1dHRvbi1jbGFzc1xcXCIgQGNsaWNrPVxcXCJkZWxldGVTZWxlY3RlZFJlY2VpdmVyKGluZGV4LHJvdylcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEljb24gdHlwZT1cXFwibWQtY2xvc2VcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGVtcGxhdGU+ICAgICBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wYW5lbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2NvbGxhcHNlPlxcbiAgICAgICAgICAgICAgICAgICAgPC90YWItcGFuZT5cXG4gICAgICAgICAgICAgICAgPC90YWJzPlxcbiAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERlBsdWdpbiA9IHtcbiAgZ2V0SHRtbEVsZW06IGZ1bmN0aW9uIGdldEh0bWxFbGVtKCkge1xuICAgIHJldHVybiBcIjxkaXYgXFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sX2NhdGVnb3J5PVxcXCJJbnB1dENvbnRyb2xcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgaWQ9XFxcImRvY3VtZW50X2NvbnRlbnRfdXBsb2FkX2NvbnZlcnRfdG9fcGRmX3BsdWdpblxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBpc19qYnVpbGQ0ZGNfZGF0YT1cXFwidHJ1ZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBqYnVpbGQ0ZGNfY3VzdG9tPVxcXCJ0cnVlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XFxcImRvY3VtZW50X2NvbnRlbnRfdXBsb2FkX2NvbnZlcnRfdG9fcGRmX3BsdWdpblxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemU9XFxcImZhbHNlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIHNpbmdsZW5hbWU9XFxcIldGRENUX0RvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERkNvbnRhaW5lclxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM9XFxcImVuYWJsZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBzdHlsZT1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgID5cXG4gICAgICAgICAgICAgICAgICAgIFxcdTY3MkFcXHU1RjAwXFx1NTNEMSFcXG4gICAgICAgICAgICAgICAgPC9kaXY+XCI7XG4gIH1cbn07Il19
