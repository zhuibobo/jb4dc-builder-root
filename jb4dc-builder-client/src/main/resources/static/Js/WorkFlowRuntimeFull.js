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
  pageReadyForStartStatus: function pageReadyForStartStatus(isStartInstanceStatus, flowInstanceRuntimePO, flowInstanceRuntimePOCacheKey, pageHostInstance) {
    this._formRuntimeInst = Object.create(FormRuntime);
    FlowRuntimePageObject._flowInstanceRuntimePO = flowInstanceRuntimePO;
    var recordId = StringUtility.Guid();
    var pageReadyInnerParas = this.buildPageReadyInnerParas(isStartInstanceStatus, recordId, flowInstanceRuntimePO, flowInstanceRuntimePOCacheKey);
    console.log(pageReadyInnerParas);

    this._formRuntimeInst.Initialization({
      "InstanceId": flowInstanceRuntimePO.instanceEntity.instId,
      "RendererToId": "htmlDesignRuntimeWrap",
      "FormId": pageReadyInnerParas.formId,
      "RecordId": recordId,
      "ButtonId": "",
      "OperationType": BaseUtility.GetAddOperationName(),
      "IsPreview": false,
      "RendererChainCompletedFunc": FlowRuntimePageObject.formRendererChainCompletedFunc,
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
  pageReadyForProcessStatus: function pageReadyForProcessStatus(isStartInstanceStatus, flowInstanceRuntimePO, flowInstanceRuntimePOCacheKey, pageHostInstance) {
    this._formRuntimeInst = Object.create(FormRuntime);
    FlowRuntimePageObject._flowInstanceRuntimePO = flowInstanceRuntimePO;
    var recordId = flowInstanceRuntimePO.instanceEntity.instRuBusinessKey;
    var pageReadyInnerParas = this.buildPageReadyInnerParas(isStartInstanceStatus, recordId, flowInstanceRuntimePO, flowInstanceRuntimePOCacheKey);
    console.log(pageReadyInnerParas);

    this._formRuntimeInst.Initialization({
      "InstanceId": flowInstanceRuntimePO.instanceEntity.instId,
      "RendererToId": "htmlDesignRuntimeWrap",
      "FormId": pageReadyInnerParas.formId,
      "RecordId": recordId,
      "ButtonId": "",
      "OperationType": BaseUtility.GetUpdateOperationName(),
      "IsPreview": false,
      "RendererChainCompletedFunc": FlowRuntimePageObject.formRendererChainCompletedFunc,
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
  rendererFlowModelerForTabOnActivity: function rendererFlowModelerForTabOnActivity(event, ui) {
    if (!FlowRuntimePageObject._isCreatedModelerView) {
      CreateModelerView(FlowRuntimePageObject._flowInstanceRuntimePO);
      FlowRuntimePageObject._isCreatedModelerView = true;
    }
  },
  rendererFlowFileContainer: function rendererFlowFileContainer(flowInstanceRuntimePO) {
    FlowFilesListSinglePlugin.Renderer();
  },
  formRendererChainCompletedFunc: function formRendererChainCompletedFunc(senderConfig) {
    var flowInstanceRuntimePO = senderConfig.flowInstanceRuntimePO;
    FlowRuntimePageObject.rendererFlowFileContainer(flowInstanceRuntimePO);
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

    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_files_999\">附件</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_files_999\">" + FlowFilesListSinglePlugin.getHtmlElem(propConfig) + "</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_modeler_999\">流程图</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_modeler_999\" style='height: calc(100% - 50px);' onActivity=\"FlowRuntimePageObject.rendererFlowModelerForTabOnActivity\"><div id=\"flow-canvas\" style=\"height:100%;\"></div></div>");
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
      "currentTaskId": pageReadyInnerParas.currentTaskId,
      "instanceId": pageReadyInnerParas.flowInstanceRuntimePO.instanceEntity.instId
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
      console.log(sendData);

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
        "currentTaskId": _prop.currentTaskId,
        "instanceId": _prop.instanceId
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
  getHtmlElem: function getHtmlElem(propConfig) {
    return "<div \n                    control_category=\"InputControl\" \n                    id=\"document_content_upload_convert_to_pdf_plugin\" \n                    is_jbuild4dc_data=\"true\" \n                    jbuild4dc_custom=\"true\" \n                    name=\"document_content_upload_convert_to_pdf_plugin\" \n                    serialize=\"false\" \n                    singlename=\"WFDCT_DocumentContentUploadConvertToPDFContainer\" \n                    status=\"enable\" \n                    style=\"\" \n                    >\n                    \u672A\u5F00\u53D1!\n                </div>";
  }
};
"use strict";

var FlowFilesListSinglePlugin = {
  _prop: {},
  _flowInstanceRuntimePO: null,
  _currentNode: null,
  _authoritiesFileAuthority: null,
  _authoritiesOnlySendBackCanEdit: "false",
  getHtmlElem: function getHtmlElem(propConfig) {
    FlowFilesListSinglePlugin._prop = propConfig;
    FlowFilesListSinglePlugin._flowInstanceRuntimePO = propConfig.FlowInstanceRuntimePO;
    FlowFilesListSinglePlugin._currentNode = ArrayUtility.Where(FlowFilesListSinglePlugin._flowInstanceRuntimePO.bpmnDefinitions.bpmnProcess.userTaskList, function (item) {
      return item.id == FlowFilesListSinglePlugin._flowInstanceRuntimePO.currentNodeKey;
    });

    if (FlowFilesListSinglePlugin._currentNode.length == 0) {
      FlowFilesListSinglePlugin._currentNode = FlowFilesListSinglePlugin._flowInstanceRuntimePO.bpmnDefinitions.bpmnProcess.startEvent;
    } else {
      FlowFilesListSinglePlugin._currentNode = FlowFilesListSinglePlugin._currentNode[0];
    }

    FlowFilesListSinglePlugin._authoritiesFileAuthority = JsonUtility.StringToJson(FlowFilesListSinglePlugin._currentNode.extensionElements.jb4dcAuthorities.authoritiesFileAuthority);
    return "<div id=\"FlowFilesListPluginContainer\">\n                </div>";
  },
  acInterface: {
    getFileListData: "/Rest/Workflow/RunTime/Client/InstanceFileRuntime/GetAttachmentFileListData",
    uploadFile: "/Rest/Workflow/RunTime/Client/InstanceFileRuntime/UploadFile",
    downloadFile: "/Rest/Builder/RunTime/FileRuntime/DownLoadFileByFileId",
    deleteFile: "/Rest/Builder/RunTime/FileRuntime/DeleteFileByFileId"
  },
  Renderer: function Renderer() {
    console.log(this._prop);
    this.BuildUploadContainer();
    this.BuildFileList();
  },
  ToViewStatus: function ToViewStatus($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    $("#" + this._prop.uploadWarpId).hide();
    $("#" + this._prop.elemId).find(".delete-button-elem").hide();
    $("#" + this._prop.elemId).find(".move-up-button-elem").hide();
    $("#" + this._prop.elemId).find(".move-down-button-elem").hide();
  },
  GetThisRecordId: function GetThisRecordId() {
    var objId = "";

    if (formRuntimeInst && formRuntimeInst.GetWebFormRTParas() && formRuntimeInst.GetWebFormRTParas().RecordId) {
      objId = formRuntimeInst.GetWebFormRTParas().RecordId;
    } else {
      DialogUtility.AlertText("查找不到绑定的记录ID");
    }

    return objId;
  },
  GetThisRecordType: function GetThisRecordType() {
    return this._prop.objType;
  },
  GetUploadEndPointRequest: function GetUploadEndPointRequest() {
    var endPoint = BaseUtility.GetRootPath() + this.acInterface.uploadFile;
    var paras = {
      fileType: "Attachment",
      instanceId: this._prop.FlowInstanceRuntimePO.instanceEntity.instId,
      businessKey: this._prop.RecordId
    };
    return {
      endpoint: endPoint,
      params: paras
    };
  },
  CreateDefaultTemplate: function CreateDefaultTemplate(templateId) {
    $(window.document.body).append("<script type=\"text/template\" id=\"" + templateId + "\">\n        <div class=\"qq-uploader-selector qq-uploader qq-gallery\" qq-drop-area-text=\"\u62D6\u653E\u6587\u4EF6\u5230\u8FD9\u91CC\u8FDB\u884C\u4E0A\u4F20\u3002\" style=\"min-height: 78px;\">\n            <div class=\"qq-total-progress-bar-container-selector qq-total-progress-bar-container\">\n                <div role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" class=\"qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar\"></div>\n            </div>\n            <div class=\"qq-upload-drop-area-selector qq-upload-drop-area\" qq-hide-dropzone>\n                <span class=\"qq-upload-drop-area-text-selector\"></span>\n            </div>\n            <div class=\"qq-upload-button-selector qq-upload-button\" style=\"float: right\">\n                <div>\u9009\u62E9\u6587\u4EF6</div>\n            </div>\n            <span class=\"qq-drop-processing-selector qq-drop-processing\">\n                <span>Processing dropped files...</span>\n                <span class=\"qq-drop-processing-spinner-selector qq-drop-processing-spinner\"></span>\n            </span>\n            <ul class=\"qq-upload-list-selector qq-upload-list\" role=\"region\" aria-live=\"polite\" aria-relevant=\"additions removals\" style=\"display: none\">\n                <li>\n                    <span role=\"status\" class=\"qq-upload-status-text-selector qq-upload-status-text\"></span>\n                    <div class=\"qq-progress-bar-container-selector qq-progress-bar-container\">\n                        <div role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" class=\"qq-progress-bar-selector qq-progress-bar\"></div>\n                    </div>\n                    <span class=\"qq-upload-spinner-selector qq-upload-spinner\"></span>\n                    <div class=\"qq-thumbnail-wrapper\">\n                        <img class=\"qq-thumbnail-selector\" qq-max-size=\"120\" qq-server-scale>\n                    </div>\n                    <button type=\"button\" class=\"qq-upload-cancel-selector qq-upload-cancel\">X</button>\n                    <button type=\"button\" class=\"qq-upload-retry-selector qq-upload-retry\">\n                        <span class=\"qq-btn qq-retry-icon\" aria-label=\"Retry\"></span>\n                        Retry\n                    </button>\n\n                    <div class=\"qq-file-info\">\n                        <div class=\"qq-file-name\">\n                            <span class=\"qq-upload-file-selector qq-upload-file\"></span>\n                            <span class=\"qq-edit-filename-icon-selector qq-btn qq-edit-filename-icon\" aria-label=\"Edit filename\"></span>\n                        </div>\n                        <input class=\"qq-edit-filename-selector qq-edit-filename\" tabindex=\"0\" type=\"text\">\n                        <span class=\"qq-upload-size-selector qq-upload-size\"></span>\n                        <button type=\"button\" class=\"qq-btn qq-upload-delete-selector qq-upload-delete\">\n                            <span class=\"qq-btn qq-delete-icon\" aria-label=\"Delete\"></span>\n                        </button>\n                        <button type=\"button\" class=\"qq-btn qq-upload-pause-selector qq-upload-pause\">\n                            <span class=\"qq-btn qq-pause-icon\" aria-label=\"Pause\"></span>\n                        </button>\n                        <button type=\"button\" class=\"qq-btn qq-upload-continue-selector qq-upload-continue\">\n                            <span class=\"qq-btn qq-continue-icon\" aria-label=\"Continue\"></span>\n                        </button>\n                    </div>\n                </li>\n            </ul>\n\n            <dialog class=\"qq-alert-dialog-selector\">\n                <div class=\"qq-dialog-message-selector\"></div>\n                <div class=\"qq-dialog-buttons\">\n                    <button type=\"button\" class=\"qq-cancel-button-selector\">Close</button>\n                </div>\n            </dialog>\n\n            <dialog class=\"qq-confirm-dialog-selector\">\n                <div class=\"qq-dialog-message-selector\"></div>\n                <div class=\"qq-dialog-buttons\">\n                    <button type=\"button\" class=\"qq-cancel-button-selector\">No</button>\n                    <button type=\"button\" class=\"qq-ok-button-selector\">Yes</button>\n                </div>\n            </dialog>\n\n            <dialog class=\"qq-prompt-dialog-selector\">\n                <div class=\"qq-dialog-message-selector\"></div>\n                <input type=\"text\">\n                <div class=\"qq-dialog-buttons\">\n                    <button type=\"button\" class=\"qq-cancel-button-selector\">Cancel</button>\n                    <button type=\"button\" class=\"qq-ok-button-selector\">Ok</button>\n                </div>\n            </dialog>\n        </div>\n    </script>");
  },
  BuildUploadContainer: function BuildUploadContainer() {
    if (this._authoritiesFileAuthority.addFile == "true") {
      var $singleControlElem = $("#FlowFilesListPluginContainer");
      var uploadWarpId = 'uploadWarp_' + StringUtility.Timestamp();
      this._prop.uploadWarpId = uploadWarpId;
      var $uploadWarp = $("<div id='" + uploadWarpId + "'></div>");
      $singleControlElem.append($uploadWarp);
      var templateId = "qq-template_" + this._prop.elemId;
      this.CreateDefaultTemplate(templateId);

      var _this = this;

      var galleryUploader = new qq.FineUploader({
        element: $uploadWarp[0],
        template: templateId,
        multiple: false,
        request: this.GetUploadEndPointRequest(),
        callbacks: {
          onComplete: function onComplete(id, name, responseJSON, xhr) {
            if (responseJSON.success) {
              _this.BuildFileList();
            } else {
              DialogUtility.AlertText(responseJSON.message);
            }
          }
        }
      });
    }
  },
  BuildFileList: function BuildFileList() {
    var $singleControlElem = $("#FlowFilesListPluginContainer");
    var upload_file_list_wrap_id = "upload_file_list_warp_" + StringUtility.Timestamp();
    $("#" + upload_file_list_wrap_id).remove();
    var $divWarp = $("<div class='upload_file_list_wrap' id='" + upload_file_list_wrap_id + "'><table class='file_list_table'><thead><tr><th>文件名称</th><th style='width: 140px'>上传时间</th><th style='width: 140px'>上传人</th><th style='width: 140px'>文件大小</th><th style='width: 140px'>操作</th></tr></thead><tbody></tbody></table></div>");
    var $tbody = $divWarp.find("tbody");
    var instanceId = this._prop.FlowInstanceRuntimePO.instanceEntity.instId;
    AjaxUtility.Post(this.acInterface.getFileListData, {
      instanceId: instanceId
    }, function (result) {
      console.log(result);

      if (result.success) {
        for (var i = 0; i < result.data.length; i++) {
          var fileInfo = result.data[i];
          $tbody.append(this.BuildFileInfoTableRow(result, fileInfo));
        }
      }
    }, this);
    $($singleControlElem.append($divWarp));
  },
  BuildFileInfoTableRow: function BuildFileInfoTableRow(responseJSON, fileInfo) {
    var fileName = StringUtility.EncodeHtml(fileInfo.fileName);
    var fileCreateTime = DateUtility.DataFormatByTimeStamp(fileInfo.fileCreateTime, "yyyy-MM-dd");
    var fileSize = HardDiskUtility.ByteConvert(fileInfo.fileSize);
    var fileCreatorName = StringUtility.EncodeHtml(fileInfo.fileCreator);
    var $trObj = $("<tr><td>".concat(fileName, "</td><td style=\"text-align: center\">").concat(fileCreateTime, "</td><td style=\"text-align: center\">").concat(fileCreatorName, "</td><td style=\"text-align: center\">").concat(fileSize, "</td><td style=\"text-align: center\"></td></tr>"));
    this.BuildFileInfoTableRowInnerButtons(responseJSON, fileInfo, $trObj);
    return $trObj;
  },
  BuildFileInfoTableRowInnerButtons: function BuildFileInfoTableRowInnerButtons(responseJSON, fileInfo, $tr) {
    if (!this._prop.downloadEnable && !this._prop.deleteEnable && this._prop.previewEnable && this._prop.moveOrderEnable) {}

    var $trLastTd = $tr.find("td:last");

    var _this = this;

    if (this._prop.deleteEnable) {
      var $deleteElem = $("<div class='file-list-inner-button delete-button-elem' title='点击删除'></div>");
      $deleteElem.click(function () {
        DialogUtility.Confirm(window, "确认删除附件【" + fileInfo.fileName + "】吗?", function () {
          AjaxUtility.Post(_this.acInterface.deleteFile, {
            fileId: fileInfo.fileId
          }, function (result) {
            if (result.success) {
              $deleteElem.parent().parent().remove();
            }
          }, _this);
        });
      });
      $trLastTd.append($deleteElem);
    }

    if (this._prop.moveOrderEnable || true) {
      var $moveUpElem = $("<div class='file-list-inner-button move-up-button-elem' title='点击上移'></div>");
      $moveUpElem.click(function () {
        DialogUtility.AlertText("暂不支持!");
      });
      var $moveDownElem = $("<div class='file-list-inner-button move-down-button-elem' title='点击下移'></div>");
      $moveDownElem.click(function () {
        DialogUtility.AlertText("暂不支持!");
      });
      $trLastTd.append($moveUpElem);
      $trLastTd.append($moveDownElem);
    }

    if (this._prop.downloadEnable) {
      var $downloadElem = $("<div class='file-list-inner-button download-button-elem' title='点击下载'></div>");
      $downloadElem.click(function () {
        var url = BaseUtility.GetRootPath() + _this.acInterface.downloadFile + "?fileId=" + fileInfo.fileId;
        window.open(url);
      });
      $trLastTd.append($downloadElem);
    }

    if (this._prop.previewEnable || true) {
      var $previewElem = $("<div class='file-list-inner-button preview-button-elem' title='点击预览'></div>");
      $previewElem.click(function () {
        DialogUtility.AlertText("暂不支持!");
      });
      $trLastTd.append($previewElem);
    }
  },
  TestFilePreviewEnable: function TestFilePreviewEnable(fileInfo) {
    return true;
  }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGlvbnNSdW50aW1lT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVQYWdlT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVWYXJCdWlsZGVyLmpzIiwiQWN0aW9ucy9DYWxsQmFja0FjdGlvbi5qcyIsIkFjdGlvbnMvSnVtcFRvQW55Tm9kZUFjdGlvbi5qcyIsIkFjdGlvbnMvUmVCb290SW5zdGFuY2VBY3Rpb24uanMiLCJBY3Rpb25zL1RlbXBTYXZlQWN0aW9uLmpzIiwiQWN0aW9ucy9Xb3JrRmxvd1NlbmRBY3Rpb24uanMiLCJEaWFsb2cvVXNlclRhc2tSZWNlaXZlckRpYWxvZy5qcyIsIlBsdWdpbnMvRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luLmpzIiwiUGx1Z2lucy9GbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQ0FBO0FDQUE7QUNBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJXb3JrRmxvd1J1bnRpbWVGdWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBBY3Rpb25zUnVudGltZU9iamVjdCA9IHtcbiAgQ3JlYXRlQUxMQWN0aW9uQnV0dG9uOiBmdW5jdGlvbiBDcmVhdGVBTExBY3Rpb25CdXR0b24oaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMpIHtcbiAgICBpZiAocGFnZVJlYWR5SW5uZXJQYXJhcy5qYjRkY0FjdGlvbnMgJiYgcGFnZVJlYWR5SW5uZXJQYXJhcy5qYjRkY0FjdGlvbnMuamI0ZGNBY3Rpb25MaXN0KSB7XG4gICAgICB2YXIgYnV0dG9uRWxlbTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlUmVhZHlJbm5lclBhcmFzLmpiNGRjQWN0aW9ucy5qYjRkY0FjdGlvbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGFjdGlvbk9iaiA9IHBhZ2VSZWFkeUlubmVyUGFyYXMuamI0ZGNBY3Rpb25zLmpiNGRjQWN0aW9uTGlzdFtpXTtcblxuICAgICAgICBpZiAoYWN0aW9uT2JqLmp1ZWxSdW5SZXN1bHRQTy5ib29sZWFuUmVzdWx0KSB7XG4gICAgICAgICAgaWYgKGFjdGlvbk9iai5hY3Rpb25UeXBlID09IFwic2VuZFwiKSB7XG4gICAgICAgICAgICB2YXIgc2VuZEFjdGlvbk9iamVjdCA9IE9iamVjdC5jcmVhdGUoV29ya0Zsb3dTZW5kQWN0aW9uKTtcbiAgICAgICAgICAgIGJ1dHRvbkVsZW0gPSBzZW5kQWN0aW9uT2JqZWN0Lkluc3RhbmNlKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZm9ybVJ1bnRpbWVJbnN0LCBwYWdlSG9zdEluc3RhbmNlLCBwYWdlUmVhZHlJbm5lclBhcmFzLCBhY3Rpb25PYmopO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQoXCIjZmxvd1dvcmtBY3Rpb25CdXR0b25XcmFwT3V0ZXJcIikuYXBwZW5kKGJ1dHRvbkVsZW0uZWxlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIEdldEFjdGlvbk9iajogZnVuY3Rpb24gR2V0QWN0aW9uT2JqKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY3Rpb25BdXRvU2VuZDogXCJmYWxzZVwiLFxuICAgICAgYWN0aW9uQ0NSZWNlaXZlT2JqZWN0czogXCJbXVwiLFxuICAgICAgYWN0aW9uQ2FsbEFwaXM6IFwiW11cIixcbiAgICAgIGFjdGlvbkNhbGxDb21wbGV0ZTogXCJ0cnVlXCIsXG4gICAgICBhY3Rpb25DYWxsSnNNZXRob2Q6IG51bGwsXG4gICAgICBhY3Rpb25DYXB0aW9uOiBcIuiNieeov1wiLFxuICAgICAgYWN0aW9uQ29kZTogXCJhY3Rpb25fNTE2MDA5Nzc1XCIsXG4gICAgICBhY3Rpb25Db25maXJtOiBcImZhbHNlXCIsXG4gICAgICBhY3Rpb25EaXNwbGF5Q29uZGl0aW9uRWRpdFRleHQ6IG51bGwsXG4gICAgICBhY3Rpb25EaXNwbGF5Q29uZGl0aW9uRWRpdFZhbHVlOiBudWxsLFxuICAgICAgYWN0aW9uRXhlY3V0ZVZhcmlhYmxlczogXCJbXVwiLFxuICAgICAgYWN0aW9uSFRNTENsYXNzOiBudWxsLFxuICAgICAgYWN0aW9uSFRNTElkOiBudWxsLFxuICAgICAgYWN0aW9uTWFpblJlY2VpdmVPYmplY3RzOiBcIltdXCIsXG4gICAgICBhY3Rpb25SdW5TcWxzOiBcIltdXCIsXG4gICAgICBhY3Rpb25TZW5kTWVzc2FnZUlkOiBudWxsLFxuICAgICAgYWN0aW9uU2VuZFNpZ25hbElkOiBudWxsLFxuICAgICAgYWN0aW9uU2hvd09waW5pb25EaWFsb2c6IFwiZmFsc2VcIixcbiAgICAgIGFjdGlvblR5cGU6IFwic2VuZFwiLFxuICAgICAgYWN0aW9uVXBkYXRlRmllbGRzOiBcIltdXCIsXG4gICAgICBhY3Rpb25WYWxpZGF0ZTogXCLml6BcIixcbiAgICAgIGFjdGlvbnNPcGluaW9uQmluZFRvRWxlbUlkOiBudWxsLFxuICAgICAgYWN0aW9uc09waW5pb25CaW5kVG9GaWVsZDogbnVsbCxcbiAgICAgIGp1ZWxSdW5SZXN1bHRQTzoge1xuICAgICAgICBib29sZWFuUmVzdWx0OiB0cnVlLFxuICAgICAgICBtZXNzYWdlOiBcIlwiLFxuICAgICAgICBzdHJpbmdSZXN1bHQ6IFwiXCIsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH1cbiAgICB9O1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRmxvd1J1bnRpbWVQYWdlT2JqZWN0ID0ge1xuICBfd2ViRm9ybVJUUGFyYXM6IG51bGwsXG4gIF9mb3JtUnVudGltZUluc3Q6IG51bGwsXG4gIEZPUk1fUlVOVElNRV9DQVRFR09SWV9GTE9XOiBcIklzRGVwZW5kZW5jZUZsb3dcIixcbiAgX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTzogbnVsbCxcbiAgX2lzQ3JlYXRlZE1vZGVsZXJWaWV3OiBmYWxzZSxcbiAgYnVpbGRQYWdlUmVhZHlJbm5lclBhcmFzOiBmdW5jdGlvbiBidWlsZFBhZ2VSZWFkeUlubmVyUGFyYXMoaXNTdGFydEluc3RhbmNlU3RhdHVzLCByZWNvcmRJZCwgZmxvd0luc3RhbmNlUnVudGltZVBPLCBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSkge1xuICAgIHJldHVybiB7XG4gICAgICByZWNvcmRJZDogcmVjb3JkSWQsXG4gICAgICBmb3JtSWQ6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5qYjRkY0Zvcm1JZCxcbiAgICAgIGN1cnJlbnROb2RlS2V5OiBmbG93SW5zdGFuY2VSdW50aW1lUE8uY3VycmVudE5vZGVLZXksXG4gICAgICBjdXJyZW50Tm9kZU5hbWU6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5jdXJyZW50Tm9kZU5hbWUsXG4gICAgICBtb2RlbElkOiBmbG93SW5zdGFuY2VSdW50aW1lUE8ubW9kZWxJbnRlZ3JhdGVkRW50aXR5Lm1vZGVsSWQsXG4gICAgICBtb2RlbFJlS2V5OiBmbG93SW5zdGFuY2VSdW50aW1lUE8ubW9kZWxJbnRlZ3JhdGVkRW50aXR5Lm1vZGVsUmVLZXksXG4gICAgICBjdXJyZW50VGFza0lkOiBmbG93SW5zdGFuY2VSdW50aW1lUE8uZXhlY3V0aW9uVGFza0VudGl0eSA/IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5leGVjdXRpb25UYXNrRW50aXR5LmV4dGFza0lkIDogXCJcIixcbiAgICAgIGZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5OiBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSxcbiAgICAgIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTzogZmxvd0luc3RhbmNlUnVudGltZVBPLFxuICAgICAgaXNTdGFydEluc3RhbmNlU3RhdHVzOiBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsXG4gICAgICBqYjRkY0FjdGlvbnM6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5qYjRkY0FjdGlvbnNcbiAgICB9O1xuICB9LFxuICBwYWdlUmVhZHlGb3JTdGFydFN0YXR1czogZnVuY3Rpb24gcGFnZVJlYWR5Rm9yU3RhcnRTdGF0dXMoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmbG93SW5zdGFuY2VSdW50aW1lUE8sIGZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LCBwYWdlSG9zdEluc3RhbmNlKSB7XG4gICAgdGhpcy5fZm9ybVJ1bnRpbWVJbnN0ID0gT2JqZWN0LmNyZWF0ZShGb3JtUnVudGltZSk7XG4gICAgRmxvd1J1bnRpbWVQYWdlT2JqZWN0Ll9mbG93SW5zdGFuY2VSdW50aW1lUE8gPSBmbG93SW5zdGFuY2VSdW50aW1lUE87XG4gICAgdmFyIHJlY29yZElkID0gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgdmFyIHBhZ2VSZWFkeUlubmVyUGFyYXMgPSB0aGlzLmJ1aWxkUGFnZVJlYWR5SW5uZXJQYXJhcyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHJlY29yZElkLCBmbG93SW5zdGFuY2VSdW50aW1lUE8sIGZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5KTtcbiAgICBjb25zb2xlLmxvZyhwYWdlUmVhZHlJbm5lclBhcmFzKTtcblxuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdC5Jbml0aWFsaXphdGlvbih7XG4gICAgICBcIkluc3RhbmNlSWRcIjogZmxvd0luc3RhbmNlUnVudGltZVBPLmluc3RhbmNlRW50aXR5Lmluc3RJZCxcbiAgICAgIFwiUmVuZGVyZXJUb0lkXCI6IFwiaHRtbERlc2lnblJ1bnRpbWVXcmFwXCIsXG4gICAgICBcIkZvcm1JZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZvcm1JZCxcbiAgICAgIFwiUmVjb3JkSWRcIjogcmVjb3JkSWQsXG4gICAgICBcIkJ1dHRvbklkXCI6IFwiXCIsXG4gICAgICBcIk9wZXJhdGlvblR5cGVcIjogQmFzZVV0aWxpdHkuR2V0QWRkT3BlcmF0aW9uTmFtZSgpLFxuICAgICAgXCJJc1ByZXZpZXdcIjogZmFsc2UsXG4gICAgICBcIlJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jXCI6IEZsb3dSdW50aW1lUGFnZU9iamVjdC5mb3JtUmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmMsXG4gICAgICBcIkxpc3RGb3JtQnV0dG9uRWxlbUlkXCI6IFwiXCIsXG4gICAgICBcIldlYkZvcm1SVFBhcmFzXCI6IHt9LFxuICAgICAgXCJGb3JtUnVudGltZUNhdGVnb3J5XCI6IEZsb3dSdW50aW1lUGFnZU9iamVjdC5GT1JNX1JVTlRJTUVfQ0FURUdPUllfRkxPVyxcbiAgICAgIFwiUHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuY1wiOiB0aGlzLnByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmMsXG4gICAgICBcIkZsb3dJbnN0YW5jZVJ1bnRpbWVQT1wiOiBmbG93SW5zdGFuY2VSdW50aW1lUE8sXG4gICAgICBcIkZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXksXG4gICAgICBcIklzU3RhcnRJbnN0YW5jZVN0YXR1c1wiOiBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsXG4gICAgICBcIkN1cnJlbnROb2RlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudE5vZGVLZXksXG4gICAgICBcIkN1cnJlbnROb2RlTmFtZVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnROb2RlTmFtZSxcbiAgICAgIFwiTW9kZWxJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLm1vZGVsSWQsXG4gICAgICBcIk1vZGVsUmVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5tb2RlbFJlS2V5LFxuICAgICAgXCJDdXJyZW50VGFza0lkXCI6IFwiXCJcbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyZXJBY3Rpb25CdXR0b25zKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgdGhpcy5fZm9ybVJ1bnRpbWVJbnN0LCBwYWdlSG9zdEluc3RhbmNlLCBwYWdlUmVhZHlJbm5lclBhcmFzKTtcbiAgICByZXR1cm4gdGhpcy5fZm9ybVJ1bnRpbWVJbnN0O1xuICB9LFxuICBwYWdlUmVhZHlGb3JQcm9jZXNzU3RhdHVzOiBmdW5jdGlvbiBwYWdlUmVhZHlGb3JQcm9jZXNzU3RhdHVzKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZmxvd0luc3RhbmNlUnVudGltZVBPLCBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSwgcGFnZUhvc3RJbnN0YW5jZSkge1xuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdCA9IE9iamVjdC5jcmVhdGUoRm9ybVJ1bnRpbWUpO1xuICAgIEZsb3dSdW50aW1lUGFnZU9iamVjdC5fZmxvd0luc3RhbmNlUnVudGltZVBPID0gZmxvd0luc3RhbmNlUnVudGltZVBPO1xuICAgIHZhciByZWNvcmRJZCA9IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5pbnN0YW5jZUVudGl0eS5pbnN0UnVCdXNpbmVzc0tleTtcbiAgICB2YXIgcGFnZVJlYWR5SW5uZXJQYXJhcyA9IHRoaXMuYnVpbGRQYWdlUmVhZHlJbm5lclBhcmFzKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgcmVjb3JkSWQsIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTywgZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXkpO1xuICAgIGNvbnNvbGUubG9nKHBhZ2VSZWFkeUlubmVyUGFyYXMpO1xuXG4gICAgdGhpcy5fZm9ybVJ1bnRpbWVJbnN0LkluaXRpYWxpemF0aW9uKHtcbiAgICAgIFwiSW5zdGFuY2VJZFwiOiBmbG93SW5zdGFuY2VSdW50aW1lUE8uaW5zdGFuY2VFbnRpdHkuaW5zdElkLFxuICAgICAgXCJSZW5kZXJlclRvSWRcIjogXCJodG1sRGVzaWduUnVudGltZVdyYXBcIixcbiAgICAgIFwiRm9ybUlkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuZm9ybUlkLFxuICAgICAgXCJSZWNvcmRJZFwiOiByZWNvcmRJZCxcbiAgICAgIFwiQnV0dG9uSWRcIjogXCJcIixcbiAgICAgIFwiT3BlcmF0aW9uVHlwZVwiOiBCYXNlVXRpbGl0eS5HZXRVcGRhdGVPcGVyYXRpb25OYW1lKCksXG4gICAgICBcIklzUHJldmlld1wiOiBmYWxzZSxcbiAgICAgIFwiUmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmNcIjogRmxvd1J1bnRpbWVQYWdlT2JqZWN0LmZvcm1SZW5kZXJlckNoYWluQ29tcGxldGVkRnVuYyxcbiAgICAgIFwiTGlzdEZvcm1CdXR0b25FbGVtSWRcIjogXCJcIixcbiAgICAgIFwiV2ViRm9ybVJUUGFyYXNcIjoge30sXG4gICAgICBcIkZvcm1SdW50aW1lQ2F0ZWdvcnlcIjogRmxvd1J1bnRpbWVQYWdlT2JqZWN0LkZPUk1fUlVOVElNRV9DQVRFR09SWV9GTE9XLFxuICAgICAgXCJQcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jXCI6IHRoaXMucHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuYyxcbiAgICAgIFwiRmxvd0luc3RhbmNlUnVudGltZVBPXCI6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTyxcbiAgICAgIFwiRmxvd01vZGVsUnVudGltZVBPQ2FjaGVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5mbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSxcbiAgICAgIFwiSXNTdGFydEluc3RhbmNlU3RhdHVzXCI6IGlzU3RhcnRJbnN0YW5jZVN0YXR1cyxcbiAgICAgIFwiQ3VycmVudE5vZGVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZUtleSxcbiAgICAgIFwiQ3VycmVudE5vZGVOYW1lXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudE5vZGVOYW1lLFxuICAgICAgXCJNb2RlbElkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxJZCxcbiAgICAgIFwiTW9kZWxSZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLm1vZGVsUmVLZXksXG4gICAgICBcIkN1cnJlbnRUYXNrSWRcIjogXCJcIlxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXJlckFjdGlvbkJ1dHRvbnMoaXNTdGFydEluc3RhbmNlU3RhdHVzLCB0aGlzLl9mb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMpO1xuICAgIHJldHVybiB0aGlzLl9mb3JtUnVudGltZUluc3Q7XG4gIH0sXG4gIHJlbmRlcmVyQWN0aW9uQnV0dG9uczogZnVuY3Rpb24gcmVuZGVyZXJBY3Rpb25CdXR0b25zKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZm9ybVJ1bnRpbWVJbnN0LCBwYWdlSG9zdEluc3RhbmNlLCBwYWdlUmVhZHlJbm5lclBhcmFzKSB7XG4gICAgQWN0aW9uc1J1bnRpbWVPYmplY3QuQ3JlYXRlQUxMQWN0aW9uQnV0dG9uKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZm9ybVJ1bnRpbWVJbnN0LCBwYWdlSG9zdEluc3RhbmNlLCBwYWdlUmVhZHlJbm5lclBhcmFzKTtcbiAgfSxcbiAgcmVuZGVyZXJGbG93TW9kZWxlckZvclRhYk9uQWN0aXZpdHk6IGZ1bmN0aW9uIHJlbmRlcmVyRmxvd01vZGVsZXJGb3JUYWJPbkFjdGl2aXR5KGV2ZW50LCB1aSkge1xuICAgIGlmICghRmxvd1J1bnRpbWVQYWdlT2JqZWN0Ll9pc0NyZWF0ZWRNb2RlbGVyVmlldykge1xuICAgICAgQ3JlYXRlTW9kZWxlclZpZXcoRmxvd1J1bnRpbWVQYWdlT2JqZWN0Ll9mbG93SW5zdGFuY2VSdW50aW1lUE8pO1xuICAgICAgRmxvd1J1bnRpbWVQYWdlT2JqZWN0Ll9pc0NyZWF0ZWRNb2RlbGVyVmlldyA9IHRydWU7XG4gICAgfVxuICB9LFxuICByZW5kZXJlckZsb3dGaWxlQ29udGFpbmVyOiBmdW5jdGlvbiByZW5kZXJlckZsb3dGaWxlQ29udGFpbmVyKGZsb3dJbnN0YW5jZVJ1bnRpbWVQTykge1xuICAgIEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uUmVuZGVyZXIoKTtcbiAgfSxcbiAgZm9ybVJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jOiBmdW5jdGlvbiBmb3JtUmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmMoc2VuZGVyQ29uZmlnKSB7XG4gICAgdmFyIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTyA9IHNlbmRlckNvbmZpZy5mbG93SW5zdGFuY2VSdW50aW1lUE87XG4gICAgRmxvd1J1bnRpbWVQYWdlT2JqZWN0LnJlbmRlcmVyRmxvd0ZpbGVDb250YWluZXIoZmxvd0luc3RhbmNlUnVudGltZVBPKTtcbiAgfSxcbiAgcHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuYzogZnVuY3Rpb24gcHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuYyhzb3VyY2VSdW50aW1lSHRtbCwgZm9ybVJ1bnRpbWVJbnN0LCBwcm9wQ29uZmlnKSB7XG4gICAgdmFyIGZsb3dQYWdlQ29udGFpbmVyID0gJChcIjxkaXY+XCIgKyBzb3VyY2VSdW50aW1lSHRtbCArIFwiPGRpdj5cIik7XG4gICAgdmFyIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTyA9IHByb3BDb25maWcuRmxvd0luc3RhbmNlUnVudGltZVBPO1xuXG4gICAgaWYgKGZsb3dQYWdlQ29udGFpbmVyLmNoaWxkcmVuKFwiW3NpbmdsZW5hbWU9J1dGRENUX1RhYkNvbnRhaW5lciddXCIpLmxlbmd0aCA9PSAwKSB7XG4gICAgICBmbG93UGFnZUNvbnRhaW5lciA9ICQoXCI8ZGl2PjxkaXYgY2xhc3M9XFxcIndmZGN0LXRhYnMtb3V0ZXItd3JhcC1ydW50aW1lIGh0bWwtZGVzaWduLXRoZW1lLWRlZmF1bHQtcm9vdC1lbGVtLWNsYXNzXFxcIiBjb250cm9sX2NhdGVnb3J5PVxcXCJDb250YWluZXJDb250cm9sXFxcIiBkZXNjPVxcXCJcXFwiIGdyb3VwbmFtZT1cXFwiXFxcIiBpZD1cXFwidGFic193cmFwXzUxODYyNzYxNlxcXCIgaXNfamJ1aWxkNGRjX2RhdGE9XFxcImZhbHNlXFxcIiBqYnVpbGQ0ZGNfY3VzdG9tPVxcXCJ0cnVlXFxcIiBuYW1lPVxcXCJ0YWJzX3dyYXBfNTE4NjI3NjE2XFxcIiBwbGFjZWhvbGRlcj1cXFwiXFxcIiBzZXJpYWxpemU9XFxcImZhbHNlXFxcIiBzaG93X3JlbW92ZV9idXR0b249XFxcImZhbHNlXFxcIiBzaW5nbGVuYW1lPVxcXCJXRkRDVF9UYWJDb250YWluZXJcXFwiIHN0YXR1cz1cXFwiZW5hYmxlXFxcIiBzdHlsZT1cXFwiXFxcIiBjbGllbnRfcmVzb2x2ZT1cXFwiV0ZEQ1RfVGFiQ29udGFpbmVyXFxcIj48ZGl2PlwiKTtcbiAgICAgIGZsb3dQYWdlQ29udGFpbmVyLmNoaWxkcmVuKFwiW3NpbmdsZW5hbWU9J1dGRENUX1RhYkNvbnRhaW5lciddXCIpLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfZmxvd19mb3JtXzk5OVxcXCI+XCIgKyBmbG93SW5zdGFuY2VSdW50aW1lUE8ubW9kZWxOYW1lICsgXCI8L2Rpdj5cIik7XG4gICAgICBmbG93UGFnZUNvbnRhaW5lci5jaGlsZHJlbihcIltzaW5nbGVuYW1lPSdXRkRDVF9UYWJDb250YWluZXInXVwiKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfZm9ybV85OTlcXFwiPlwiICsgc291cmNlUnVudGltZUh0bWwgKyBcIjwvZGl2PlwiKTtcbiAgICB9XG5cbiAgICB2YXIgdGFiQ29udGFpbmVyID0gZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIik7XG5cbiAgICBpZiAoZmxvd0luc3RhbmNlUnVudGltZVBPLmpiNGRjQ29udGVudERvY3VtZW50UGx1Z2luID09IFwidXBsb2FkQ29udmVydFRvUERGUGx1Z2luXCIpIHtcbiAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X3VwbG9hZENvbnZlcnRUb1BERlBsdWdpbl85OTlcXFwiPuato+aWhzwvZGl2PlwiKTtcbiAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X3VwbG9hZENvbnZlcnRUb1BERlBsdWdpbl85OTlcXFwiPlwiICsgRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luLmdldEh0bWxFbGVtKCkgKyBcIjwvZGl2PlwiKTtcbiAgICB9IGVsc2UgaWYgKGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5qYjRkY0NvbnRlbnREb2N1bWVudFBsdWdpbiA9PSBcIndwc09ubGluZURvY3VtZW50UGx1Z2luXCIpIHtcbiAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X3dwc09ubGluZURvY3VtZW50UGx1Z2luXzk5OVxcXCI+5q2j5paHPC9kaXY+XCIpO1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfd3BzT25saW5lRG9jdW1lbnRQbHVnaW5fOTk5XFxcIj7mnKrlrp7njrA8L2Rpdj5cIik7XG4gICAgfVxuXG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfZmxvd19maWxlc185OTlcXFwiPumZhOS7tjwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF9mbG93X2ZpbGVzXzk5OVxcXCI+XCIgKyBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLmdldEh0bWxFbGVtKHByb3BDb25maWcpICsgXCI8L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfZmxvd19tb2RlbGVyXzk5OVxcXCI+5rWB56iL5Zu+PC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfbW9kZWxlcl85OTlcXFwiIHN0eWxlPSdoZWlnaHQ6IGNhbGMoMTAwJSAtIDUwcHgpOycgb25BY3Rpdml0eT1cXFwiRmxvd1J1bnRpbWVQYWdlT2JqZWN0LnJlbmRlcmVyRmxvd01vZGVsZXJGb3JUYWJPbkFjdGl2aXR5XFxcIj48ZGl2IGlkPVxcXCJmbG93LWNhbnZhc1xcXCIgc3R5bGU9XFxcImhlaWdodDoxMDAlO1xcXCI+PC9kaXY+PC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfc2VxdWVuY2VfOTk5XFxcIj7pobrluo/lm748L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd19zZXF1ZW5jZV85OTlcXFwiPjwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X3Rhc2tfOTk5XFxcIj7mtYHovazkv6Hmga88L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd190YXNrXzk5OVxcXCI+PC9kaXY+XCIpO1xuICAgIHZhciBuZXdSdW50aW1lSHRtbCA9IGZsb3dQYWdlQ29udGFpbmVyLmh0bWwoKTtcbiAgICByZXR1cm4gbmV3UnVudGltZUh0bWw7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBGbG93UnVudGltZVZhckJ1aWxkZXIgPSB7XG4gIEJ1aWxkZXJTZWxlY3RlZFJlY2VpdmVyVG9JbnN0YW5jZVZhcjogZnVuY3Rpb24gQnVpbGRlclNlbGVjdGVkUmVjZWl2ZXJUb0luc3RhbmNlVmFyKG5leHRGbG93Tm9kZUVudGl0aWVzLCBzZWxlY3RlZFJlY2VpdmVyRGF0YSkge1xuICAgIHZhciByZXN1bHREYXRhID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGVkUmVjZWl2ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcmVjZWl2ZXIgPSBzZWxlY3RlZFJlY2VpdmVyRGF0YVtpXTtcbiAgICAgIHJlc3VsdERhdGEucHVzaCh7XG4gICAgICAgIG5leHROb2RlSWQ6IHJlY2VpdmVyLmZsb3dOb2RlRW50aXR5LmlkLFxuICAgICAgICByZWNlaXZlcklkOiByZWNlaXZlci5pZCxcbiAgICAgICAgcmVjZWl2ZXJOYW1lOiByZWNlaXZlci5uYW1lLFxuICAgICAgICByZWNlaXZlclR5cGVOYW1lOiByZWNlaXZlci50eXBlTmFtZSxcbiAgICAgICAgcmVjZWl2ZVR5cGU6IHJlY2VpdmVyLnJlY2VpdmVUeXBlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0RGF0YTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdvcmtGbG93U2VuZEFjdGlvbiA9IHtcbiAgYWNJbnRlcmZhY2U6IHtcbiAgICByZXNvbHZlTmV4dFBvc3NpYmxlRmxvd05vZGU6IFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvSW5zdGFuY2VSdW50aW1lL1Jlc29sdmVOZXh0UG9zc2libGVGbG93Tm9kZVwiLFxuICAgIGNvbXBsZXRlVGFzazogXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9JbnN0YW5jZVJ1bnRpbWUvQ29tcGxldGVUYXNrXCJcbiAgfSxcbiAgX1Byb3A6IHt9LFxuICBJbnN0YW5jZTogZnVuY3Rpb24gSW5zdGFuY2UoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMsIGFjdGlvbk9iaikge1xuICAgIGNvbnNvbGUubG9nKGFjdGlvbk9iaik7XG4gICAgdmFyIGh0bWxJZCA9IGFjdGlvbk9iai5hY3Rpb25IVE1MSWQgPyBhY3Rpb25PYmouYWN0aW9uSFRNTElkIDogYWN0aW9uT2JqLmFjdGlvbkNvZGU7XG4gICAgdmFyIGVsZW0gPSAkKCc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm9wZXJhdGlvbi1idXR0b24gb3BlcmF0aW9uLWJ1dHRvbi1wcmltYXJ5XCIgaWQ9XCInICsgaHRtbElkICsgJ1wiPjxzcGFuPicgKyBhY3Rpb25PYmouYWN0aW9uQ2FwdGlvbiArICc8L3NwYW4+PC9idXR0b24+Jyk7XG4gICAgdGhpcy5fUHJvcCA9IHtcbiAgICAgIFwic2VuZGVyXCI6IHRoaXMsXG4gICAgICBcImZsb3dJbnN0YW5jZVJ1bnRpbWVQT1wiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQTyxcbiAgICAgIFwiZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5mbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSxcbiAgICAgIFwiamI0ZGNBY3Rpb25zXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuamI0ZGNBY3Rpb25zLFxuICAgICAgXCJmb3JtUnVudGltZUluc3RcIjogZm9ybVJ1bnRpbWVJbnN0LFxuICAgICAgXCJhY3Rpb25PYmpcIjogYWN0aW9uT2JqLFxuICAgICAgXCJpc1N0YXJ0SW5zdGFuY2VTdGF0dXNcIjogaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgXCJwYWdlSG9zdEluc3RhbmNlXCI6IHBhZ2VIb3N0SW5zdGFuY2UsXG4gICAgICBcImN1cnJlbnROb2RlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudE5vZGVLZXksXG4gICAgICBcImN1cnJlbnROb2RlTmFtZVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnROb2RlTmFtZSxcbiAgICAgIFwicmVjb3JkSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5yZWNvcmRJZCxcbiAgICAgIFwibW9kZWxJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLm1vZGVsSWQsXG4gICAgICBcIm1vZGVsUmVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5tb2RlbFJlS2V5LFxuICAgICAgXCJjdXJyZW50VGFza0lkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudFRhc2tJZCxcbiAgICAgIFwiaW5zdGFuY2VJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5pbnN0YW5jZUVudGl0eS5pbnN0SWRcbiAgICB9O1xuICAgIGVsZW0uYmluZChcImNsaWNrXCIsIHRoaXMuX1Byb3AsIHRoaXMuQnV0dG9uQ2xpY2tFdmVudCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVsZW06IGVsZW1cbiAgICB9O1xuICB9LFxuICBCdXR0b25DbGlja0V2ZW50OiBmdW5jdGlvbiBCdXR0b25DbGlja0V2ZW50KHNlbmRlcikge1xuICAgIHZhciB2YWxpZGF0ZVJlc3VsdCA9IFZhbGlkYXRlUnVsZXNSdW50aW1lLlZhbGlkYXRlU3VibWl0RW5hYmxlKCk7XG5cbiAgICBpZiAoVmFsaWRhdGVSdWxlc1J1bnRpbWUuQWxlcnRWYWxpZGF0ZUVycm9ycyh2YWxpZGF0ZVJlc3VsdCkpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRMb2FkaW5nKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQsIHt9LCBcIlwiKTtcbiAgICAgIHZhciBfcHJvcCA9IHNlbmRlci5kYXRhO1xuICAgICAgdmFyIF90aGlzID0gX3Byb3Auc2VuZGVyO1xuXG4gICAgICB2YXIgc2VuZERhdGEgPSBfdGhpcy5CdWlsZFNlbmRUb1NlcnZlckRhdGEoX3Byb3AsIG51bGwpO1xuXG4gICAgICBpZiAoc2VuZERhdGEuc3VjY2Vzcykge1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KF90aGlzLmFjSW50ZXJmYWNlLnJlc29sdmVOZXh0UG9zc2libGVGbG93Tm9kZSwgc2VuZERhdGEuZGF0YSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cbiAgICAgICAgICBpZiAocmVzdWx0LmRhdGEubmV4dFRhc2tJc0VuZEV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdFJlY2VpdmVyQ29tcGxldGVkKHJlc3VsdC5kYXRhLmJwbW5UYXNrTGlzdCwgW10pO1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LmRhdGEuY3VycmVudFRhc2tJc011bHRpSW5zdGFuY2UgJiYgcmVzdWx0LmRhdGEuY3VycmVudFRhc2tNdWx0aUNvbXBsZXRlZEluc3RhbmNlcyArIDEgPCByZXN1bHQuZGF0YS5jdXJyZW50VGFza011bHRpQ291bnRFbmdJbnN0YW5jZXMpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWQocmVzdWx0LmRhdGEuYnBtblRhc2tMaXN0LCBbXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dVdGlsaXR5LlNob3dEaWFsb2coX3Byb3Auc2VuZGVyLCByZXN1bHQuZGF0YS5icG1uVGFza0xpc3QsIF9wcm9wLnNlbmRlci5TZWxlY3RSZWNlaXZlckNvbXBsZXRlZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfcHJvcC5zZW5kZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgU2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWQ6IGZ1bmN0aW9uIFNlbGVjdFJlY2VpdmVyQ29tcGxldGVkKG5leHRUYXNrRW50aXR5TGlzdCwgc2VsZWN0ZWRSZWNlaXZlckRhdGEpIHtcbiAgICBjb25zb2xlLmxvZyhzZWxlY3RlZFJlY2VpdmVyRGF0YSk7XG4gICAgY29uc29sZS5sb2codGhpcy5fUHJvcC5hY3Rpb25PYmouYWN0aW9uQ2FwdGlvbik7XG4gICAgRGlhbG9nVXRpbGl0eS5Db25maXJtKHdpbmRvdywgXCLnoa7orqTmiafooYzlj5HpgIE/XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxlY3RlZFJlY2VpdmVyVmFycyA9IEZsb3dSdW50aW1lVmFyQnVpbGRlci5CdWlsZGVyU2VsZWN0ZWRSZWNlaXZlclRvSW5zdGFuY2VWYXIobmV4dFRhc2tFbnRpdHlMaXN0LCBzZWxlY3RlZFJlY2VpdmVyRGF0YSk7XG4gICAgICB2YXIgc2VuZERhdGEgPSB0aGlzLkJ1aWxkU2VuZFRvU2VydmVyRGF0YSh0aGlzLl9Qcm9wLCB7XG4gICAgICAgIHNlbGVjdGVkUmVjZWl2ZXJWYXJzOiBlbmNvZGVVUklDb21wb25lbnQoSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHNlbGVjdGVkUmVjZWl2ZXJWYXJzKSlcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coc2VuZERhdGEpO1xuXG4gICAgICBpZiAoc2VuZERhdGEuc3VjY2Vzcykge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0TG9hZGluZyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkLCB7fSwgXCLns7vnu5/lpITnkIbkuK0s6K+356iN5YCZIVwiKTtcbiAgICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmNvbXBsZXRlVGFzaywgc2VuZERhdGEuZGF0YSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQpO1xuXG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICB3aW5kb3cuT3BlbmVyV2luZG93T2JqLmluc3RhbmNlTWFpblRhc2tQcm9jZXNzTGlzdC5yZWxvYWREYXRhKCk7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9DbG9zZURpYWxvZyh3aW5kb3cpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRFcnJvcih3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRFcnJvcklkLCB7fSwgcmVzdWx0LmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLl9Qcm9wLnNlbmRlcik7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIEJ1aWxkU2VuZFRvU2VydmVyRGF0YTogZnVuY3Rpb24gQnVpbGRTZW5kVG9TZXJ2ZXJEYXRhKF9wcm9wLCBhcHBlbmRTZW5kTWFwKSB7XG4gICAgdmFyIGZvcm1EYXRhQ29tcGxleFBPID0gX3Byb3AuZm9ybVJ1bnRpbWVJbnN0LlNlcmlhbGl6YXRpb25Gb3JtRGF0YSgpO1xuXG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGlzU3RhcnRJbnN0YW5jZVN0YXR1czogX3Byb3AuaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgICBhY3Rpb25Db2RlOiBfcHJvcC5hY3Rpb25PYmouYWN0aW9uQ29kZSxcbiAgICAgICAgZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXk6IF9wcm9wLmZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgICBcImZvcm1SZWNvcmRDb21wbGV4UE9TdHJpbmdcIjogZW5jb2RlVVJJQ29tcG9uZW50KEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyhmb3JtRGF0YUNvbXBsZXhQTykpLFxuICAgICAgICBcImN1cnJlbnROb2RlS2V5XCI6IF9wcm9wLmN1cnJlbnROb2RlS2V5LFxuICAgICAgICBcImN1cnJlbnROb2RlTmFtZVwiOiBfcHJvcC5jdXJyZW50Tm9kZU5hbWUsXG4gICAgICAgIFwicmVjb3JkSWRcIjogX3Byb3AucmVjb3JkSWQsXG4gICAgICAgIFwibW9kZWxJZFwiOiBfcHJvcC5tb2RlbElkLFxuICAgICAgICBcIm1vZGVsUmVLZXlcIjogX3Byb3AubW9kZWxSZUtleSxcbiAgICAgICAgXCJjdXJyZW50VGFza0lkXCI6IF9wcm9wLmN1cnJlbnRUYXNrSWQsXG4gICAgICAgIFwiaW5zdGFuY2VJZFwiOiBfcHJvcC5pbnN0YW5jZUlkXG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChhcHBlbmRTZW5kTWFwKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gYXBwZW5kU2VuZE1hcCkge1xuICAgICAgICByZXN1bHQuZGF0YVtrZXldID0gYXBwZW5kU2VuZE1hcFtrZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWU7XG52YXIgVXNlclRhc2tSZWNlaXZlckRpYWxvZ1V0aWxpdHkgPSB7XG4gIFNob3dEaWFsb2c6IGZ1bmN0aW9uIFNob3dEaWFsb2coc2VuZGVyLCBuZXh0Rmxvd05vZGVFbnRpdGllcywgc2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWRGdW5jKSB7XG4gICAgaWYgKCF1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUpIHtcbiAgICAgICQoZG9jdW1lbnQuYm9keSkuYXBwZW5kKFwiPGRpdiBpZD0ndXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyJz48dXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZyByZWY9J3VzZXJUYXNrUmVjZWl2ZXJEaWFsb2cnPjwvdXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZz48L2Rpdj5cIik7XG4gICAgICB1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6IFwiI3VzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgICAgIGdldFJ1bnRpbWVNb2RlbFdpdGhTdGFydDogXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9Nb2RlbFJ1bnRpbWUvR2V0UnVudGltZU1vZGVsV2l0aFN0YXJ0XCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgICAgICAgbWV0aG9kczoge31cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZS4kcmVmcy51c2VyVGFza1JlY2VpdmVyRGlhbG9nLmJlZ2luU2VsZWN0UmVjZWl2ZXIoc2VuZGVyLCBuZXh0Rmxvd05vZGVFbnRpdGllcywgc2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWRGdW5jKTtcbiAgfSxcbiAgQ2xvc2VEaWFsb2c6IGZ1bmN0aW9uIENsb3NlRGlhbG9nKCkge1xuICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKHVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZS4kcmVmcy51c2VyVGFza1JlY2VpdmVyRGlhbG9nLiRyZWZzLnVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dXcmFwKTtcbiAgICB1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUgPSBudWxsO1xuICAgICQoXCIjdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyXCIpLnJlbW92ZSgpO1xuICAgIERpYWxvZ1V0aWxpdHkuUmVtb3ZlRGlhbG9nUmVtYWluaW5nRWxlbShcInVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dJbm5lclwiKTtcbiAgfVxufTtcblZ1ZS5jb21wb25lbnQoXCJ1c2VyLXRhc2stcmVjZWl2ZXItZGlhbG9nXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHt9LFxuICAgICAgbmV4dEZsb3dOb2RlRW50aXRpZXM6IFtdLFxuICAgICAgcmVjZWl2ZXJUcmVlOiB7XG4gICAgICAgIHRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vY2hlY2tJbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgYXN5bmM6IHtcbiAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLFxuICAgICAgICAgICAgdXJsOiBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbihcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L1JlY2VpdmVyUnVudGltZS9HZXRBc3luY1JlY2VpdmVyc1wiKSxcbiAgICAgICAgICAgIGF1dG9QYXJhbTogW1wiaWRcIiwgXCJ0eXBlTmFtZVwiLCBcIm5hbWVcIl1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcIm5hbWVcIixcbiAgICAgICAgICAgICAgY2hpbGRyZW46IFwicnVudGltZVJlY2VpdmVVc2Vyc1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge30sXG4gICAgICAgICAgICBvbkRibENsaWNrOiBmdW5jdGlvbiBvbkRibENsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5faG9zdDtcblxuICAgICAgICAgICAgICB2YXIgZmxvd05vZGVFbnRpdHkgPSB0aGlzLmdldFpUcmVlT2JqKHRyZWVJZCkuZmxvd05vZGVFbnRpdHk7XG4gICAgICAgICAgICAgIHZhciByZWNlaXZlVHlwZSA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5yZWNlaXZlVHlwZTtcblxuICAgICAgICAgICAgICBfdGhpcy5hZGRSZWNlaXZlclRvU2VsZWN0ZWQodHJlZU5vZGUsIGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmVmb3JlQXN5bmM6IGZ1bmN0aW9uIGJlZm9yZUFzeW5jKHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2codHJlZUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRyZWVPYmpNYXA6IHt9XG4gICAgICB9LFxuICAgICAgc2VsZWN0ZWRSZWNlaXZlcjoge1xuICAgICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICAgIHRpdGxlOiAn5bey6YCJ55So5oi3JyxcbiAgICAgICAgICBrZXk6ICduYW1lJyxcbiAgICAgICAgICB3aWR0aDogMTg4LFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgICAgc2xvdDogJ2FjdGlvbicsXG4gICAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH1dLFxuICAgICAgICByZWNlaXZlckRhdGE6IFtdXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBmaWx0ZXJzOiB7XG4gICAgZmlsdGVyUmVjZWl2ZXJEYXRhOiBmdW5jdGlvbiBmaWx0ZXJSZWNlaXZlckRhdGEocmVjZWl2ZXJEYXRhLCBmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpIHtcbiAgICAgIHJldHVybiByZWNlaXZlckRhdGEuZmlsdGVyKGZ1bmN0aW9uIChyZWNlaXZlcikge1xuICAgICAgICByZXR1cm4gcmVjZWl2ZXIuZmxvd05vZGVFbnRpdHkuaWQgPT0gZmxvd05vZGVFbnRpdHkuaWQgJiYgcmVjZWl2ZXIucmVjZWl2ZVR5cGUgPT0gcmVjZWl2ZVR5cGU7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBiZWdpblNlbGVjdFJlY2VpdmVyOiBmdW5jdGlvbiBiZWdpblNlbGVjdFJlY2VpdmVyKHNlbmRlciwgbmV4dEZsb3dOb2RlRW50aXRpZXMsIHNlbGVjdFJlY2VpdmVyQ29tcGxldGVkRnVuYykge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLnVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dXcmFwO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHdpZHRoOiA2NTAsXG4gICAgICAgIGhlaWdodDogNjAwLFxuICAgICAgICB0aXRsZTogXCLpgInmi6nmjqXmlLbkurrlkZhcIixcbiAgICAgICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgIFwi56Gu6K6kXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMudmFsaWRhdGVDb21wbGV0ZUVuYWJsZSgpLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgc2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWRGdW5jLmNhbGwoc2VuZGVyLCBfdGhpcy5uZXh0Rmxvd05vZGVFbnRpdGllcywgX3RoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCLlj5bmtohcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAgIFVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvcGVuOiBmdW5jdGlvbiBvcGVuKGV2ZW50LCB1aSkge1xuICAgICAgICAgICQoXCIudWktZGlhbG9nLXRpdGxlYmFyLWNsb3NlXCIsICQodGhpcykucGFyZW50KCkpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzID0gbmV4dEZsb3dOb2RlRW50aXRpZXM7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCh0aGlzLmluaXRUcmVlLCA1MDApO1xuICAgIH0sXG4gICAgaW5pdFRyZWU6IGZ1bmN0aW9uIGluaXRUcmVlKCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBmbG93Tm9kZUVudGl0eSA9IHRoaXMubmV4dEZsb3dOb2RlRW50aXRpZXNbaV07XG5cbiAgICAgICAgaWYgKGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzICYmIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjTWFpblJlY2VpdmVPYmplY3RzICYmIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjTWFpblJlY2VpdmVPYmplY3RzLnJ1bnRpbWVSZWNlaXZlR3JvdXBzKSB7XG4gICAgICAgICAgdmFyIHRyZWVPYmpLZXkgPSB0aGlzLmJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIFwibWFpblwiKTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldID0gJC5mbi56VHJlZS5pbml0KCQoXCIjXCIgKyB0cmVlT2JqS2V5KSwgdGhpcy5yZWNlaXZlclRyZWUudHJlZVNldHRpbmcsIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjTWFpblJlY2VpdmVPYmplY3RzLnJ1bnRpbWVSZWNlaXZlR3JvdXBzKTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldLl9ob3N0ID0gdGhpcztcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldLmZsb3dOb2RlRW50aXR5ID0gZmxvd05vZGVFbnRpdHk7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XS5yZWNlaXZlVHlwZSA9IFwibWFpblwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzICYmIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjQ0NSZWNlaXZlT2JqZWN0cyAmJiBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY0NDUmVjZWl2ZU9iamVjdHMucnVudGltZVJlY2VpdmVHcm91cHMpIHtcbiAgICAgICAgICB2YXIgdHJlZU9iaktleSA9IHRoaXMuYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwgXCJjY1wiKTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldID0gJC5mbi56VHJlZS5pbml0KCQoXCIjXCIgKyB0cmVlT2JqS2V5KSwgdGhpcy5yZWNlaXZlclRyZWUudHJlZVNldHRpbmcsIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjQ0NSZWNlaXZlT2JqZWN0cy5ydW50aW1lUmVjZWl2ZUdyb3Vwcyk7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XS5faG9zdCA9IHRoaXM7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XS5mbG93Tm9kZUVudGl0eSA9IGZsb3dOb2RlRW50aXR5O1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0ucmVjZWl2ZVR5cGUgPSBcImNjXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1aWxkVWxUcmVlSWQ6IGZ1bmN0aW9uIGJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICByZXR1cm4gJ3VsVHJlZV8nICsgcmVjZWl2ZVR5cGUgKyBcIl9cIiArIGZsb3dOb2RlRW50aXR5LmlkO1xuICAgIH0sXG4gICAgYWRkVHJlZVNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkOiBmdW5jdGlvbiBhZGRUcmVlU2VsZWN0ZWRSZWNlaXZlclRvU2VsZWN0ZWQoZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICB2YXIgdHJlZUtleSA9IHRoaXMuYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpO1xuICAgICAgdmFyIHRyZWVPYmplY3QgPSB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVLZXldO1xuXG4gICAgICBpZiAodHJlZU9iamVjdCkge1xuICAgICAgICB2YXIgc2VsZWN0Tm9kZXMgPSB0cmVlT2JqZWN0LmdldFNlbGVjdGVkTm9kZXMoKTtcblxuICAgICAgICBpZiAoc2VsZWN0Tm9kZXMgJiYgc2VsZWN0Tm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuYWRkUmVjZWl2ZXJUb1NlbGVjdGVkKHNlbGVjdE5vZGVzWzBdLCBmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRSZWNlaXZlclRvU2VsZWN0ZWQ6IGZ1bmN0aW9uIGFkZFJlY2VpdmVyVG9TZWxlY3RlZChzZWxlY3ROb2RlLCBmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpIHtcbiAgICAgIHZhciBpc011bHRpSW5zdGFuY2VUYXNrID0gdGhpcy5pc011bHRpSW5zdGFuY2VUYXNrKGZsb3dOb2RlRW50aXR5KTtcbiAgICAgIHZhciBpbm5lclNpbmdsZUlkID0gZmxvd05vZGVFbnRpdHkuaWQgKyBcIl9cIiArIHJlY2VpdmVUeXBlICsgXCJfXCIgKyBzZWxlY3ROb2RlLmlkO1xuXG4gICAgICBpZiAoc2VsZWN0Tm9kZS50eXBlTmFtZSA9PSBcIlNpbmdsZVVzZXJcIikge1xuICAgICAgICBzZWxlY3ROb2RlLmlubmVyU2luZ2xlSWQgPSBpbm5lclNpbmdsZUlkO1xuICAgICAgICBzZWxlY3ROb2RlLmZsb3dOb2RlRW50aXR5ID0gZmxvd05vZGVFbnRpdHk7XG4gICAgICAgIHNlbGVjdE5vZGUucmVjZWl2ZVR5cGUgPSByZWNlaXZlVHlwZTtcblxuICAgICAgICBpZiAoKHJlY2VpdmVUeXBlID09IFwiY2NcIiB8fCBpc011bHRpSW5zdGFuY2VUYXNrKSAmJiAhQXJyYXlVdGlsaXR5LkV4aXN0KHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0uaW5uZXJTaW5nbGVJZCA9PSBpbm5lclNpbmdsZUlkO1xuICAgICAgICB9KSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEucHVzaChzZWxlY3ROb2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChyZWNlaXZlVHlwZSA9PSBcIm1haW5cIiAmJiAhaXNNdWx0aUluc3RhbmNlVGFzaykge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGFbaV0uZmxvd05vZGVFbnRpdHkuaWQgPT0gZmxvd05vZGVFbnRpdHkuaWQgJiYgdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YVtpXS5yZWNlaXZlVHlwZSA9PSByZWNlaXZlVHlwZSkge1xuICAgICAgICAgICAgICBBcnJheVV0aWxpdHkuRGVsZXRlKHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEsIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEucHVzaChzZWxlY3ROb2RlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpc011bHRpSW5zdGFuY2VUYXNrICYmIChzZWxlY3ROb2RlLnR5cGVOYW1lID09IFwiVXNlcnNcIiB8fCBzZWxlY3ROb2RlLnR5cGVOYW1lID09IFwiUm9sZVwiIHx8IHNlbGVjdE5vZGUudHlwZU5hbWUgPT0gXCJPcmdhbnNcIikpIHtcbiAgICAgICAgaWYgKHNlbGVjdE5vZGUucnVudGltZVJlY2VpdmVVc2VycyAhPSBudWxsICYmIHNlbGVjdE5vZGUucnVudGltZVJlY2VpdmVVc2Vycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHNlbGVjdE5vZGUucnVudGltZVJlY2VpdmVVc2Vycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBjaGlsZE5vZGUgPSBzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnNbX2ldO1xuXG4gICAgICAgICAgICBpZiAoY2hpbGROb2RlLnR5cGVOYW1lID09IFwiU2luZ2xlVXNlclwiKSB7XG4gICAgICAgICAgICAgIHRoaXMuYWRkUmVjZWl2ZXJUb1NlbGVjdGVkKGNoaWxkTm9kZSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyU2VsZWN0ZWRSZWNlaXZlclRvU2VsZWN0ZWQ6IGZ1bmN0aW9uIGNsZWFyU2VsZWN0ZWRSZWNlaXZlclRvU2VsZWN0ZWQoZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB2YXIgcmVjZWl2ZXIgPSB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhW2ldO1xuXG4gICAgICAgIGlmIChyZWNlaXZlci5mbG93Tm9kZUVudGl0eS5pZCA9PSBmbG93Tm9kZUVudGl0eS5pZCAmJiByZWNlaXZlci5yZWNlaXZlVHlwZSA9PSByZWNlaXZlVHlwZSkge1xuICAgICAgICAgIEFycmF5VXRpbGl0eS5EZWxldGUodGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSwgaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGRlbGV0ZVNlbGVjdGVkUmVjZWl2ZXI6IGZ1bmN0aW9uIGRlbGV0ZVNlbGVjdGVkUmVjZWl2ZXIoaW5kZXgsIHJvdykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhW2ldLmlubmVyU2luZ2xlSWQgPT0gcm93LmlubmVyU2luZ2xlSWQpIHtcbiAgICAgICAgICBBcnJheVV0aWxpdHkuRGVsZXRlKHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEsIGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBpc011bHRpSW5zdGFuY2VUYXNrOiBmdW5jdGlvbiBpc011bHRpSW5zdGFuY2VUYXNrKGZsb3dOb2RlRW50aXR5KSB7XG4gICAgICByZXR1cm4gZmxvd05vZGVFbnRpdHkubXVsdGlJbnN0YW5jZVRhc2s7XG4gICAgfSxcbiAgICBidWlsZFRhYkxhYmVsOiBmdW5jdGlvbiBidWlsZFRhYkxhYmVsKGZsb3dOb2RlRW50aXR5KSB7XG4gICAgICByZXR1cm4gZmxvd05vZGVFbnRpdHkubmFtZSArIFwiIFtcIiArICh0aGlzLmlzTXVsdGlJbnN0YW5jZVRhc2soZmxvd05vZGVFbnRpdHkpID8gXCLlpJrkurpcIiA6IFwi5Y2V5Lq6XCIpICsgXCJdXCI7XG4gICAgfSxcbiAgICB2YWxpZGF0ZUNvbXBsZXRlRW5hYmxlOiBmdW5jdGlvbiB2YWxpZGF0ZUNvbXBsZXRlRW5hYmxlKCkge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHZhciBlcnJvck1lc3NhZ2VzID0gW107XG4gICAgICB2YXIgc3VjY2VzcyA9IHRydWU7XG5cbiAgICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKGkpIHtcbiAgICAgICAgaWYgKF90aGlzMi5uZXh0Rmxvd05vZGVFbnRpdGllc1tpXS50YXNrVHlwZU5hbWUgPT0gXCJjb20uamI0ZGMud29ya2Zsb3cucG8uYnBtbi5wcm9jZXNzLkJwbW5Vc2VyVGFza1wiKSB7XG4gICAgICAgICAgaWYgKCFBcnJheVV0aWxpdHkuRXhpc3QoX3RoaXMyLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZmxvd05vZGVFbnRpdHkuaWQgPT0gX3RoaXMyLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldLmlkICYmIGl0ZW0ucmVjZWl2ZVR5cGUgPT0gXCJtYWluXCI7XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgICAgIHRhc2tOYW1lOiBfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0ubmFtZSxcbiAgICAgICAgICAgICAgZmxvd05vZGVFbnRpdHk6IF90aGlzMi5uZXh0Rmxvd05vZGVFbnRpdGllc1tpXSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogXCLnjq/oioJbXCIgKyBfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0ubmFtZSArIFwiXeiHs+WwkemcgOimgeiuvue9ruS4gOS4quaOpeaUtueUqOaItyFcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubmV4dEZsb3dOb2RlRW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgX2xvb3AoaSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvck1lc3NhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGVycm9yVGV4dEFyeSA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JNZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGVycm9yVGV4dEFyeS5wdXNoKGVycm9yTWVzc2FnZXNbaV0ubWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChlcnJvclRleHRBcnkuam9pbihcIjxiciAvPlwiKSwgdGhpcyk7XG4gICAgICAgIHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2Vzczogc3VjY2Vzc1xuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgaWQ9XFxcInVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dJbm5lclxcXCIgcmVmPVxcXCJ1c2VyVGFza1JlY2VpdmVyRGlhbG9nV3JhcFxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICA8dGFicyBuYW1lPVxcXCJ1c2VyVGFza1JlY2VpdmVyRGlhbG9nVGFic1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8dGFiLXBhbmUgOmxhYmVsPVxcXCJidWlsZFRhYkxhYmVsKGZsb3dOb2RlRW50aXR5KVxcXCIgdGFiPVxcXCJ1c2VyVGFza1JlY2VpdmVyRGlhbG9nVGFic1xcXCIgdi1mb3I9XFxcImZsb3dOb2RlRW50aXR5IGluIG5leHRGbG93Tm9kZUVudGl0aWVzXFxcIiA6a2V5PVxcXCJmbG93Tm9kZUVudGl0eS5pZFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbGxhcHNlIGFjY29yZGlvbiB2YWx1ZT1cXFwibWFpblJlY2VpdmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhbmVsIG5hbWU9XFxcIm1haW5SZWNlaXZlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU0RTNCXFx1OTAwMVxcdTRFQkFcXHU1NDU4XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHNsb3Q9XFxcImNvbnRlbnRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInVzZXItdGFzay1yZWNlaXZlci1kaWFsb2ctb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdEVuYWJsZVVzZXJMaXN0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCA6aWQ9XFxcImJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksJ21haW4nKVxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIiBzdHlsZT1cXFwid2lkdGg6IDIwMHB4XFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0T3BCdXR0b25Db250YWluZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2luZ2xlLW9wLWJ1dHRvblxcXCIgdGl0bGU9XFxcIlxcdTZERkJcXHU1MkEwXFx1NEVCQVxcdTU0NThcXFwiIEBjbGljaz1cXFwiYWRkVHJlZVNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCdtYWluJylcXFwiPjxJY29uIHR5cGU9XFxcIm1kLWFycm93LXJvdW5kLWZvcndhcmRcXFwiIC8+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzaW5nbGUtb3AtYnV0dG9uXFxcIiB0aXRsZT1cXFwiXFx1NkUwNVxcdTdBN0FcXHU1REYyXFx1OTAwOVxcdTRFQkFcXHU1NDU4XFxcIiBAY2xpY2s9XFxcImNsZWFyU2VsZWN0ZWRSZWNlaXZlclRvU2VsZWN0ZWQoZmxvd05vZGVFbnRpdHksJ21haW4nKVxcXCI+PEljb24gdHlwZT1cXFwibWQtYmFja3NwYWNlXFxcIiAvPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0ZWRVc2VyTGlzdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSBoZWlnaHQ9XFxcIjMyN1xcXCIgd2lkdGg9XFxcIjI2MFxcXCIgc3RyaXBlIDpjb2x1bW5zPVxcXCJzZWxlY3RlZFJlY2VpdmVyLmNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJzZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSB8IGZpbHRlclJlY2VpdmVyRGF0YShmbG93Tm9kZUVudGl0eSwgJ21haW4nKVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIml2LWxpc3QtdGFibGVcXFwiIHNpemU9XFxcInNtYWxsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Qtc2NvcGU9XFxcInsgcm93LCBpbmRleCB9XFxcIiBzbG90PVxcXCJhY3Rpb25cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LWZvbnQtaWNvbi1idXR0b24tY2xhc3NcXFwiIEBjbGljaz1cXFwiZGVsZXRlU2VsZWN0ZWRSZWNlaXZlcihpbmRleCxyb3cpXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJY29uIHR5cGU9XFxcIm1kLWNsb3NlXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPiAgICAgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktdGFibGU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcGFuZWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYW5lbCBuYW1lPVxcXCJjY1JlY2VpdmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTYyODRcXHU5MDAxXFx1NEVCQVxcdTU0NThcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc2xvdD1cXFwiY29udGVudFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZy1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0RW5hYmxlVXNlckxpc3RcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIDppZD1cXFwiYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwnY2MnKVxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIiBzdHlsZT1cXFwid2lkdGg6IDIwMHB4XFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0T3BCdXR0b25Db250YWluZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2luZ2xlLW9wLWJ1dHRvblxcXCIgdGl0bGU9XFxcIlxcdTZERkJcXHU1MkEwXFx1NEVCQVxcdTU0NThcXFwiIEBjbGljaz1cXFwiYWRkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCdjYycpXFxcIj48SWNvbiB0eXBlPVxcXCJtZC1hcnJvdy1yb3VuZC1mb3J3YXJkXFxcIiAvPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2luZ2xlLW9wLWJ1dHRvblxcXCIgdGl0bGU9XFxcIlxcdTZFMDVcXHU3QTdBXFx1NURGMlxcdTkwMDlcXHU0RUJBXFx1NTQ1OFxcXCI+PEljb24gdHlwZT1cXFwibWQtYmFja3NwYWNlXFxcIiAvPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0ZWRVc2VyTGlzdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSBoZWlnaHQ9XFxcIjMyN1xcXCIgd2lkdGg9XFxcIjI2MFxcXCIgc3RyaXBlIDpjb2x1bW5zPVxcXCJzZWxlY3RlZFJlY2VpdmVyLmNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJzZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSB8IGZpbHRlclJlY2VpdmVyRGF0YShmbG93Tm9kZUVudGl0eSwgJ2NjJylcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90LXNjb3BlPVxcXCJ7IHJvdywgaW5kZXggfVxcXCIgc2xvdD1cXFwiYWN0aW9uXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlzdC1mb250LWljb24tYnV0dG9uLWNsYXNzXFxcIiBAY2xpY2s9XFxcImRlbGV0ZVNlbGVjdGVkUmVjZWl2ZXIoaW5kZXgscm93KVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiB0eXBlPVxcXCJtZC1jbG9zZVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT4gICAgIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3BhbmVsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvY29sbGFwc2U+XFxuICAgICAgICAgICAgICAgICAgICA8L3RhYi1wYW5lPlxcbiAgICAgICAgICAgICAgICA8L3RhYnM+XFxuICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luID0ge1xuICBnZXRIdG1sRWxlbTogZnVuY3Rpb24gZ2V0SHRtbEVsZW0ocHJvcENvbmZpZykge1xuICAgIHJldHVybiBcIjxkaXYgXFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sX2NhdGVnb3J5PVxcXCJJbnB1dENvbnRyb2xcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgaWQ9XFxcImRvY3VtZW50X2NvbnRlbnRfdXBsb2FkX2NvbnZlcnRfdG9fcGRmX3BsdWdpblxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBpc19qYnVpbGQ0ZGNfZGF0YT1cXFwidHJ1ZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBqYnVpbGQ0ZGNfY3VzdG9tPVxcXCJ0cnVlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XFxcImRvY3VtZW50X2NvbnRlbnRfdXBsb2FkX2NvbnZlcnRfdG9fcGRmX3BsdWdpblxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemU9XFxcImZhbHNlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIHNpbmdsZW5hbWU9XFxcIldGRENUX0RvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERkNvbnRhaW5lclxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM9XFxcImVuYWJsZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBzdHlsZT1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgID5cXG4gICAgICAgICAgICAgICAgICAgIFxcdTY3MkFcXHU1RjAwXFx1NTNEMSFcXG4gICAgICAgICAgICAgICAgPC9kaXY+XCI7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luID0ge1xuICBfcHJvcDoge30sXG4gIF9mbG93SW5zdGFuY2VSdW50aW1lUE86IG51bGwsXG4gIF9jdXJyZW50Tm9kZTogbnVsbCxcbiAgX2F1dGhvcml0aWVzRmlsZUF1dGhvcml0eTogbnVsbCxcbiAgX2F1dGhvcml0aWVzT25seVNlbmRCYWNrQ2FuRWRpdDogXCJmYWxzZVwiLFxuICBnZXRIdG1sRWxlbTogZnVuY3Rpb24gZ2V0SHRtbEVsZW0ocHJvcENvbmZpZykge1xuICAgIEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX3Byb3AgPSBwcm9wQ29uZmlnO1xuICAgIEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTyA9IHByb3BDb25maWcuRmxvd0luc3RhbmNlUnVudGltZVBPO1xuICAgIEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2N1cnJlbnROb2RlID0gQXJyYXlVdGlsaXR5LldoZXJlKEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTy5icG1uRGVmaW5pdGlvbnMuYnBtblByb2Nlc3MudXNlclRhc2tMaXN0LCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0uaWQgPT0gRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fZmxvd0luc3RhbmNlUnVudGltZVBPLmN1cnJlbnROb2RlS2V5O1xuICAgIH0pO1xuXG4gICAgaWYgKEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2N1cnJlbnROb2RlLmxlbmd0aCA9PSAwKSB7XG4gICAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9jdXJyZW50Tm9kZSA9IEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTy5icG1uRGVmaW5pdGlvbnMuYnBtblByb2Nlc3Muc3RhcnRFdmVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fY3VycmVudE5vZGUgPSBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9jdXJyZW50Tm9kZVswXTtcbiAgICB9XG5cbiAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9hdXRob3JpdGllc0ZpbGVBdXRob3JpdHkgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24oRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fY3VycmVudE5vZGUuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNBdXRob3JpdGllcy5hdXRob3JpdGllc0ZpbGVBdXRob3JpdHkpO1xuICAgIHJldHVybiBcIjxkaXYgaWQ9XFxcIkZsb3dGaWxlc0xpc3RQbHVnaW5Db250YWluZXJcXFwiPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIjtcbiAgfSxcbiAgYWNJbnRlcmZhY2U6IHtcbiAgICBnZXRGaWxlTGlzdERhdGE6IFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvSW5zdGFuY2VGaWxlUnVudGltZS9HZXRBdHRhY2htZW50RmlsZUxpc3REYXRhXCIsXG4gICAgdXBsb2FkRmlsZTogXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9JbnN0YW5jZUZpbGVSdW50aW1lL1VwbG9hZEZpbGVcIixcbiAgICBkb3dubG9hZEZpbGU6IFwiL1Jlc3QvQnVpbGRlci9SdW5UaW1lL0ZpbGVSdW50aW1lL0Rvd25Mb2FkRmlsZUJ5RmlsZUlkXCIsXG4gICAgZGVsZXRlRmlsZTogXCIvUmVzdC9CdWlsZGVyL1J1blRpbWUvRmlsZVJ1bnRpbWUvRGVsZXRlRmlsZUJ5RmlsZUlkXCJcbiAgfSxcbiAgUmVuZGVyZXI6IGZ1bmN0aW9uIFJlbmRlcmVyKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMuX3Byb3ApO1xuICAgIHRoaXMuQnVpbGRVcGxvYWRDb250YWluZXIoKTtcbiAgICB0aGlzLkJ1aWxkRmlsZUxpc3QoKTtcbiAgfSxcbiAgVG9WaWV3U3RhdHVzOiBmdW5jdGlvbiBUb1ZpZXdTdGF0dXMoJGVsZW0sIGZpZWxkUE8sIHJlbGF0aW9uRm9ybVJlY29yZENvbXBsZXhQbywgX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMpIHtcbiAgICAkKFwiI1wiICsgdGhpcy5fcHJvcC51cGxvYWRXYXJwSWQpLmhpZGUoKTtcbiAgICAkKFwiI1wiICsgdGhpcy5fcHJvcC5lbGVtSWQpLmZpbmQoXCIuZGVsZXRlLWJ1dHRvbi1lbGVtXCIpLmhpZGUoKTtcbiAgICAkKFwiI1wiICsgdGhpcy5fcHJvcC5lbGVtSWQpLmZpbmQoXCIubW92ZS11cC1idXR0b24tZWxlbVwiKS5oaWRlKCk7XG4gICAgJChcIiNcIiArIHRoaXMuX3Byb3AuZWxlbUlkKS5maW5kKFwiLm1vdmUtZG93bi1idXR0b24tZWxlbVwiKS5oaWRlKCk7XG4gIH0sXG4gIEdldFRoaXNSZWNvcmRJZDogZnVuY3Rpb24gR2V0VGhpc1JlY29yZElkKCkge1xuICAgIHZhciBvYmpJZCA9IFwiXCI7XG5cbiAgICBpZiAoZm9ybVJ1bnRpbWVJbnN0ICYmIGZvcm1SdW50aW1lSW5zdC5HZXRXZWJGb3JtUlRQYXJhcygpICYmIGZvcm1SdW50aW1lSW5zdC5HZXRXZWJGb3JtUlRQYXJhcygpLlJlY29yZElkKSB7XG4gICAgICBvYmpJZCA9IGZvcm1SdW50aW1lSW5zdC5HZXRXZWJGb3JtUlRQYXJhcygpLlJlY29yZElkO1xuICAgIH0gZWxzZSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuafpeaJvuS4jeWIsOe7keWumueahOiusOW9lUlEXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBvYmpJZDtcbiAgfSxcbiAgR2V0VGhpc1JlY29yZFR5cGU6IGZ1bmN0aW9uIEdldFRoaXNSZWNvcmRUeXBlKCkge1xuICAgIHJldHVybiB0aGlzLl9wcm9wLm9ialR5cGU7XG4gIH0sXG4gIEdldFVwbG9hZEVuZFBvaW50UmVxdWVzdDogZnVuY3Rpb24gR2V0VXBsb2FkRW5kUG9pbnRSZXF1ZXN0KCkge1xuICAgIHZhciBlbmRQb2ludCA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyB0aGlzLmFjSW50ZXJmYWNlLnVwbG9hZEZpbGU7XG4gICAgdmFyIHBhcmFzID0ge1xuICAgICAgZmlsZVR5cGU6IFwiQXR0YWNobWVudFwiLFxuICAgICAgaW5zdGFuY2VJZDogdGhpcy5fcHJvcC5GbG93SW5zdGFuY2VSdW50aW1lUE8uaW5zdGFuY2VFbnRpdHkuaW5zdElkLFxuICAgICAgYnVzaW5lc3NLZXk6IHRoaXMuX3Byb3AuUmVjb3JkSWRcbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICBlbmRwb2ludDogZW5kUG9pbnQsXG4gICAgICBwYXJhbXM6IHBhcmFzXG4gICAgfTtcbiAgfSxcbiAgQ3JlYXRlRGVmYXVsdFRlbXBsYXRlOiBmdW5jdGlvbiBDcmVhdGVEZWZhdWx0VGVtcGxhdGUodGVtcGxhdGVJZCkge1xuICAgICQod2luZG93LmRvY3VtZW50LmJvZHkpLmFwcGVuZChcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC90ZW1wbGF0ZVxcXCIgaWQ9XFxcIlwiICsgdGVtcGxhdGVJZCArIFwiXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLXVwbG9hZGVyLXNlbGVjdG9yIHFxLXVwbG9hZGVyIHFxLWdhbGxlcnlcXFwiIHFxLWRyb3AtYXJlYS10ZXh0PVxcXCJcXHU2MkQ2XFx1NjUzRVxcdTY1ODdcXHU0RUY2XFx1NTIzMFxcdThGRDlcXHU5MUNDXFx1OEZEQlxcdTg4NENcXHU0RTBBXFx1NEYyMFxcdTMwMDJcXFwiIHN0eWxlPVxcXCJtaW4taGVpZ2h0OiA3OHB4O1xcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtdG90YWwtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lci1zZWxlY3RvciBxcS10b3RhbC1wcm9ncmVzcy1iYXItY29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiByb2xlPVxcXCJwcm9ncmVzc2JhclxcXCIgYXJpYS12YWx1ZW5vdz1cXFwiMFxcXCIgYXJpYS12YWx1ZW1pbj1cXFwiMFxcXCIgYXJpYS12YWx1ZW1heD1cXFwiMTAwXFxcIiBjbGFzcz1cXFwicXEtdG90YWwtcHJvZ3Jlc3MtYmFyLXNlbGVjdG9yIHFxLXByb2dyZXNzLWJhciBxcS10b3RhbC1wcm9ncmVzcy1iYXJcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLXVwbG9hZC1kcm9wLWFyZWEtc2VsZWN0b3IgcXEtdXBsb2FkLWRyb3AtYXJlYVxcXCIgcXEtaGlkZS1kcm9wem9uZT5cXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLXVwbG9hZC1kcm9wLWFyZWEtdGV4dC1zZWxlY3RvclxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLXVwbG9hZC1idXR0b24tc2VsZWN0b3IgcXEtdXBsb2FkLWJ1dHRvblxcXCIgc3R5bGU9XFxcImZsb2F0OiByaWdodFxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXY+XFx1OTAwOVxcdTYyRTlcXHU2NTg3XFx1NEVGNjwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS1kcm9wLXByb2Nlc3Npbmctc2VsZWN0b3IgcXEtZHJvcC1wcm9jZXNzaW5nXFxcIj5cXG4gICAgICAgICAgICAgICAgPHNwYW4+UHJvY2Vzc2luZyBkcm9wcGVkIGZpbGVzLi4uPC9zcGFuPlxcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXItc2VsZWN0b3IgcXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXJcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICA8L3NwYW4+XFxuICAgICAgICAgICAgPHVsIGNsYXNzPVxcXCJxcS11cGxvYWQtbGlzdC1zZWxlY3RvciBxcS11cGxvYWQtbGlzdFxcXCIgcm9sZT1cXFwicmVnaW9uXFxcIiBhcmlhLWxpdmU9XFxcInBvbGl0ZVxcXCIgYXJpYS1yZWxldmFudD1cXFwiYWRkaXRpb25zIHJlbW92YWxzXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+XFxuICAgICAgICAgICAgICAgIDxsaT5cXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHJvbGU9XFxcInN0YXR1c1xcXCIgY2xhc3M9XFxcInFxLXVwbG9hZC1zdGF0dXMtdGV4dC1zZWxlY3RvciBxcS11cGxvYWQtc3RhdHVzLXRleHRcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLXByb2dyZXNzLWJhci1jb250YWluZXItc2VsZWN0b3IgcXEtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiByb2xlPVxcXCJwcm9ncmVzc2JhclxcXCIgYXJpYS12YWx1ZW5vdz1cXFwiMFxcXCIgYXJpYS12YWx1ZW1pbj1cXFwiMFxcXCIgYXJpYS12YWx1ZW1heD1cXFwiMTAwXFxcIiBjbGFzcz1cXFwicXEtcHJvZ3Jlc3MtYmFyLXNlbGVjdG9yIHFxLXByb2dyZXNzLWJhclxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS11cGxvYWQtc3Bpbm5lci1zZWxlY3RvciBxcS11cGxvYWQtc3Bpbm5lclxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtdGh1bWJuYWlsLXdyYXBwZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XFxcInFxLXRodW1ibmFpbC1zZWxlY3RvclxcXCIgcXEtbWF4LXNpemU9XFxcIjEyMFxcXCIgcXEtc2VydmVyLXNjYWxlPlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLXVwbG9hZC1jYW5jZWwtc2VsZWN0b3IgcXEtdXBsb2FkLWNhbmNlbFxcXCI+WDwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS11cGxvYWQtcmV0cnktc2VsZWN0b3IgcXEtdXBsb2FkLXJldHJ5XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtYnRuIHFxLXJldHJ5LWljb25cXFwiIGFyaWEtbGFiZWw9XFxcIlJldHJ5XFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgUmV0cnlcXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcblxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZmlsZS1pbmZvXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS1maWxlLW5hbWVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtdXBsb2FkLWZpbGUtc2VsZWN0b3IgcXEtdXBsb2FkLWZpbGVcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLWVkaXQtZmlsZW5hbWUtaWNvbi1zZWxlY3RvciBxcS1idG4gcXEtZWRpdC1maWxlbmFtZS1pY29uXFxcIiBhcmlhLWxhYmVsPVxcXCJFZGl0IGZpbGVuYW1lXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJxcS1lZGl0LWZpbGVuYW1lLXNlbGVjdG9yIHFxLWVkaXQtZmlsZW5hbWVcXFwiIHRhYmluZGV4PVxcXCIwXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtdXBsb2FkLXNpemUtc2VsZWN0b3IgcXEtdXBsb2FkLXNpemVcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLWJ0biBxcS11cGxvYWQtZGVsZXRlLXNlbGVjdG9yIHFxLXVwbG9hZC1kZWxldGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtYnRuIHFxLWRlbGV0ZS1pY29uXFxcIiBhcmlhLWxhYmVsPVxcXCJEZWxldGVcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLWJ0biBxcS11cGxvYWQtcGF1c2Utc2VsZWN0b3IgcXEtdXBsb2FkLXBhdXNlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLWJ0biBxcS1wYXVzZS1pY29uXFxcIiBhcmlhLWxhYmVsPVxcXCJQYXVzZVxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwicXEtYnRuIHFxLXVwbG9hZC1jb250aW51ZS1zZWxlY3RvciBxcS11cGxvYWQtY29udGludWVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtYnRuIHFxLWNvbnRpbnVlLWljb25cXFwiIGFyaWEtbGFiZWw9XFxcIkNvbnRpbnVlXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9saT5cXG4gICAgICAgICAgICA8L3VsPlxcblxcbiAgICAgICAgICAgIDxkaWFsb2cgY2xhc3M9XFxcInFxLWFsZXJ0LWRpYWxvZy1zZWxlY3RvclxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZGlhbG9nLWJ1dHRvbnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXFxcIj5DbG9zZTwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2RpYWxvZz5cXG5cXG4gICAgICAgICAgICA8ZGlhbG9nIGNsYXNzPVxcXCJxcS1jb25maXJtLWRpYWxvZy1zZWxlY3RvclxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZGlhbG9nLWJ1dHRvbnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXFxcIj5ObzwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS1vay1idXR0b24tc2VsZWN0b3JcXFwiPlllczwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2RpYWxvZz5cXG5cXG4gICAgICAgICAgICA8ZGlhbG9nIGNsYXNzPVxcXCJxcS1wcm9tcHQtZGlhbG9nLXNlbGVjdG9yXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3JcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLWRpYWxvZy1idXR0b25zXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwicXEtY2FuY2VsLWJ1dHRvbi1zZWxlY3RvclxcXCI+Q2FuY2VsPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLW9rLWJ1dHRvbi1zZWxlY3RvclxcXCI+T2s8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9kaWFsb2c+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9zY3JpcHQ+XCIpO1xuICB9LFxuICBCdWlsZFVwbG9hZENvbnRhaW5lcjogZnVuY3Rpb24gQnVpbGRVcGxvYWRDb250YWluZXIoKSB7XG4gICAgaWYgKHRoaXMuX2F1dGhvcml0aWVzRmlsZUF1dGhvcml0eS5hZGRGaWxlID09IFwidHJ1ZVwiKSB7XG4gICAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gJChcIiNGbG93RmlsZXNMaXN0UGx1Z2luQ29udGFpbmVyXCIpO1xuICAgICAgdmFyIHVwbG9hZFdhcnBJZCA9ICd1cGxvYWRXYXJwXycgKyBTdHJpbmdVdGlsaXR5LlRpbWVzdGFtcCgpO1xuICAgICAgdGhpcy5fcHJvcC51cGxvYWRXYXJwSWQgPSB1cGxvYWRXYXJwSWQ7XG4gICAgICB2YXIgJHVwbG9hZFdhcnAgPSAkKFwiPGRpdiBpZD0nXCIgKyB1cGxvYWRXYXJwSWQgKyBcIic+PC9kaXY+XCIpO1xuICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtLmFwcGVuZCgkdXBsb2FkV2FycCk7XG4gICAgICB2YXIgdGVtcGxhdGVJZCA9IFwicXEtdGVtcGxhdGVfXCIgKyB0aGlzLl9wcm9wLmVsZW1JZDtcbiAgICAgIHRoaXMuQ3JlYXRlRGVmYXVsdFRlbXBsYXRlKHRlbXBsYXRlSWQpO1xuXG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgZ2FsbGVyeVVwbG9hZGVyID0gbmV3IHFxLkZpbmVVcGxvYWRlcih7XG4gICAgICAgIGVsZW1lbnQ6ICR1cGxvYWRXYXJwWzBdLFxuICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVJZCxcbiAgICAgICAgbXVsdGlwbGU6IGZhbHNlLFxuICAgICAgICByZXF1ZXN0OiB0aGlzLkdldFVwbG9hZEVuZFBvaW50UmVxdWVzdCgpLFxuICAgICAgICBjYWxsYmFja3M6IHtcbiAgICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbiBvbkNvbXBsZXRlKGlkLCBuYW1lLCByZXNwb25zZUpTT04sIHhocikge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlSlNPTi5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgIF90aGlzLkJ1aWxkRmlsZUxpc3QoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KHJlc3BvbnNlSlNPTi5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgQnVpbGRGaWxlTGlzdDogZnVuY3Rpb24gQnVpbGRGaWxlTGlzdCgpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gJChcIiNGbG93RmlsZXNMaXN0UGx1Z2luQ29udGFpbmVyXCIpO1xuICAgIHZhciB1cGxvYWRfZmlsZV9saXN0X3dyYXBfaWQgPSBcInVwbG9hZF9maWxlX2xpc3Rfd2FycF9cIiArIFN0cmluZ1V0aWxpdHkuVGltZXN0YW1wKCk7XG4gICAgJChcIiNcIiArIHVwbG9hZF9maWxlX2xpc3Rfd3JhcF9pZCkucmVtb3ZlKCk7XG4gICAgdmFyICRkaXZXYXJwID0gJChcIjxkaXYgY2xhc3M9J3VwbG9hZF9maWxlX2xpc3Rfd3JhcCcgaWQ9J1wiICsgdXBsb2FkX2ZpbGVfbGlzdF93cmFwX2lkICsgXCInPjx0YWJsZSBjbGFzcz0nZmlsZV9saXN0X3RhYmxlJz48dGhlYWQ+PHRyPjx0aD7mlofku7blkI3np7A8L3RoPjx0aCBzdHlsZT0nd2lkdGg6IDE0MHB4Jz7kuIrkvKDml7bpl7Q8L3RoPjx0aCBzdHlsZT0nd2lkdGg6IDE0MHB4Jz7kuIrkvKDkuro8L3RoPjx0aCBzdHlsZT0nd2lkdGg6IDE0MHB4Jz7mlofku7blpKflsI88L3RoPjx0aCBzdHlsZT0nd2lkdGg6IDE0MHB4Jz7mk43kvZw8L3RoPjwvdHI+PC90aGVhZD48dGJvZHk+PC90Ym9keT48L3RhYmxlPjwvZGl2PlwiKTtcbiAgICB2YXIgJHRib2R5ID0gJGRpdldhcnAuZmluZChcInRib2R5XCIpO1xuICAgIHZhciBpbnN0YW5jZUlkID0gdGhpcy5fcHJvcC5GbG93SW5zdGFuY2VSdW50aW1lUE8uaW5zdGFuY2VFbnRpdHkuaW5zdElkO1xuICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRGaWxlTGlzdERhdGEsIHtcbiAgICAgIGluc3RhbmNlSWQ6IGluc3RhbmNlSWRcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBmaWxlSW5mbyA9IHJlc3VsdC5kYXRhW2ldO1xuICAgICAgICAgICR0Ym9keS5hcHBlbmQodGhpcy5CdWlsZEZpbGVJbmZvVGFibGVSb3cocmVzdWx0LCBmaWxlSW5mbykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgJCgkc2luZ2xlQ29udHJvbEVsZW0uYXBwZW5kKCRkaXZXYXJwKSk7XG4gIH0sXG4gIEJ1aWxkRmlsZUluZm9UYWJsZVJvdzogZnVuY3Rpb24gQnVpbGRGaWxlSW5mb1RhYmxlUm93KHJlc3BvbnNlSlNPTiwgZmlsZUluZm8pIHtcbiAgICB2YXIgZmlsZU5hbWUgPSBTdHJpbmdVdGlsaXR5LkVuY29kZUh0bWwoZmlsZUluZm8uZmlsZU5hbWUpO1xuICAgIHZhciBmaWxlQ3JlYXRlVGltZSA9IERhdGVVdGlsaXR5LkRhdGFGb3JtYXRCeVRpbWVTdGFtcChmaWxlSW5mby5maWxlQ3JlYXRlVGltZSwgXCJ5eXl5LU1NLWRkXCIpO1xuICAgIHZhciBmaWxlU2l6ZSA9IEhhcmREaXNrVXRpbGl0eS5CeXRlQ29udmVydChmaWxlSW5mby5maWxlU2l6ZSk7XG4gICAgdmFyIGZpbGVDcmVhdG9yTmFtZSA9IFN0cmluZ1V0aWxpdHkuRW5jb2RlSHRtbChmaWxlSW5mby5maWxlQ3JlYXRvcik7XG4gICAgdmFyICR0ck9iaiA9ICQoXCI8dHI+PHRkPlwiLmNvbmNhdChmaWxlTmFtZSwgXCI8L3RkPjx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyXFxcIj5cIikuY29uY2F0KGZpbGVDcmVhdGVUaW1lLCBcIjwvdGQ+PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlwiKS5jb25jYXQoZmlsZUNyZWF0b3JOYW1lLCBcIjwvdGQ+PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlwiKS5jb25jYXQoZmlsZVNpemUsIFwiPC90ZD48dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+PC90ZD48L3RyPlwiKSk7XG4gICAgdGhpcy5CdWlsZEZpbGVJbmZvVGFibGVSb3dJbm5lckJ1dHRvbnMocmVzcG9uc2VKU09OLCBmaWxlSW5mbywgJHRyT2JqKTtcbiAgICByZXR1cm4gJHRyT2JqO1xuICB9LFxuICBCdWlsZEZpbGVJbmZvVGFibGVSb3dJbm5lckJ1dHRvbnM6IGZ1bmN0aW9uIEJ1aWxkRmlsZUluZm9UYWJsZVJvd0lubmVyQnV0dG9ucyhyZXNwb25zZUpTT04sIGZpbGVJbmZvLCAkdHIpIHtcbiAgICBpZiAoIXRoaXMuX3Byb3AuZG93bmxvYWRFbmFibGUgJiYgIXRoaXMuX3Byb3AuZGVsZXRlRW5hYmxlICYmIHRoaXMuX3Byb3AucHJldmlld0VuYWJsZSAmJiB0aGlzLl9wcm9wLm1vdmVPcmRlckVuYWJsZSkge31cblxuICAgIHZhciAkdHJMYXN0VGQgPSAkdHIuZmluZChcInRkOmxhc3RcIik7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX3Byb3AuZGVsZXRlRW5hYmxlKSB7XG4gICAgICB2YXIgJGRlbGV0ZUVsZW0gPSAkKFwiPGRpdiBjbGFzcz0nZmlsZS1saXN0LWlubmVyLWJ1dHRvbiBkZWxldGUtYnV0dG9uLWVsZW0nIHRpdGxlPSfngrnlh7vliKDpmaQnPjwvZGl2PlwiKTtcbiAgICAgICRkZWxldGVFbGVtLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5Db25maXJtKHdpbmRvdywgXCLnoa7orqTliKDpmaTpmYTku7bjgJBcIiArIGZpbGVJbmZvLmZpbGVOYW1lICsgXCLjgJHlkJc/XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KF90aGlzLmFjSW50ZXJmYWNlLmRlbGV0ZUZpbGUsIHtcbiAgICAgICAgICAgIGZpbGVJZDogZmlsZUluZm8uZmlsZUlkXG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICRkZWxldGVFbGVtLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIF90aGlzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgICR0ckxhc3RUZC5hcHBlbmQoJGRlbGV0ZUVsZW0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcm9wLm1vdmVPcmRlckVuYWJsZSB8fCB0cnVlKSB7XG4gICAgICB2YXIgJG1vdmVVcEVsZW0gPSAkKFwiPGRpdiBjbGFzcz0nZmlsZS1saXN0LWlubmVyLWJ1dHRvbiBtb3ZlLXVwLWJ1dHRvbi1lbGVtJyB0aXRsZT0n54K55Ye75LiK56e7Jz48L2Rpdj5cIik7XG4gICAgICAkbW92ZVVwRWxlbS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5pqC5LiN5pSv5oyBIVwiKTtcbiAgICAgIH0pO1xuICAgICAgdmFyICRtb3ZlRG93bkVsZW0gPSAkKFwiPGRpdiBjbGFzcz0nZmlsZS1saXN0LWlubmVyLWJ1dHRvbiBtb3ZlLWRvd24tYnV0dG9uLWVsZW0nIHRpdGxlPSfngrnlh7vkuIvnp7snPjwvZGl2PlwiKTtcbiAgICAgICRtb3ZlRG93bkVsZW0uY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuaaguS4jeaUr+aMgSFcIik7XG4gICAgICB9KTtcbiAgICAgICR0ckxhc3RUZC5hcHBlbmQoJG1vdmVVcEVsZW0pO1xuICAgICAgJHRyTGFzdFRkLmFwcGVuZCgkbW92ZURvd25FbGVtKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcHJvcC5kb3dubG9hZEVuYWJsZSkge1xuICAgICAgdmFyICRkb3dubG9hZEVsZW0gPSAkKFwiPGRpdiBjbGFzcz0nZmlsZS1saXN0LWlubmVyLWJ1dHRvbiBkb3dubG9hZC1idXR0b24tZWxlbScgdGl0bGU9J+eCueWHu+S4i+i9vSc+PC9kaXY+XCIpO1xuICAgICAgJGRvd25sb2FkRWxlbS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgX3RoaXMuYWNJbnRlcmZhY2UuZG93bmxvYWRGaWxlICsgXCI/ZmlsZUlkPVwiICsgZmlsZUluZm8uZmlsZUlkO1xuICAgICAgICB3aW5kb3cub3Blbih1cmwpO1xuICAgICAgfSk7XG4gICAgICAkdHJMYXN0VGQuYXBwZW5kKCRkb3dubG9hZEVsZW0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcm9wLnByZXZpZXdFbmFibGUgfHwgdHJ1ZSkge1xuICAgICAgdmFyICRwcmV2aWV3RWxlbSA9ICQoXCI8ZGl2IGNsYXNzPSdmaWxlLWxpc3QtaW5uZXItYnV0dG9uIHByZXZpZXctYnV0dG9uLWVsZW0nIHRpdGxlPSfngrnlh7vpooTop4gnPjwvZGl2PlwiKTtcbiAgICAgICRwcmV2aWV3RWxlbS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5pqC5LiN5pSv5oyBIVwiKTtcbiAgICAgIH0pO1xuICAgICAgJHRyTGFzdFRkLmFwcGVuZCgkcHJldmlld0VsZW0pO1xuICAgIH1cbiAgfSxcbiAgVGVzdEZpbGVQcmV2aWV3RW5hYmxlOiBmdW5jdGlvbiBUZXN0RmlsZVByZXZpZXdFbmFibGUoZmlsZUluZm8pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiXX0=
