"use strict";

var ActionsRuntimeObject = {
  CreateALLActionButton: function CreateALLActionButton(flowModelRuntimePO, flowModelRuntimePOCacheKey, jb4dcActions, formRuntimeInst, isStartInstanceStatus, pageHostInstance) {
    if (jb4dcActions && jb4dcActions.jb4dcActionList) {
      var buttonElem;

      for (var i = 0; i < jb4dcActions.jb4dcActionList.length; i++) {
        var actionObj = jb4dcActions.jb4dcActionList[i];

        if (actionObj.juelRunResultPO.booleanResult) {
          if (actionObj.actionType == "send") {
            var sendActionObject = Object.create(WorkFlowSendAction);
            buttonElem = sendActionObject.Instance(flowModelRuntimePO, flowModelRuntimePOCacheKey, jb4dcActions, formRuntimeInst, actionObj, isStartInstanceStatus, pageHostInstance);
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
  pageReadyForStartStatus: function pageReadyForStartStatus(isStartInstanceStatus, rendererChainCompletedFunc, flowModelRuntimePO, flowModelRuntimePOCacheKey, pageHostInstance) {
    this._formRuntimeInst = Object.create(FormRuntime);

    this._formRuntimeInst.Initialization({
      "RendererToId": "htmlDesignRuntimeWrap",
      "FormId": flowModelRuntimePO.jb4dcFormId,
      "RecordId": "",
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
      "isStartInstanceStatus": isStartInstanceStatus
    });

    this.rendererActionButtons(flowModelRuntimePO, flowModelRuntimePOCacheKey, this._formRuntimeInst, isStartInstanceStatus, pageHostInstance);
    return this._formRuntimeInst;
  },
  rendererActionButtons: function rendererActionButtons(flowModelRuntimePO, flowModelRuntimePOCacheKey, formRuntimeInst, isStartInstanceStatus, pageHostInstance) {
    ActionsRuntimeObject.CreateALLActionButton(flowModelRuntimePO, flowModelRuntimePOCacheKey, flowModelRuntimePO.jb4dcActions, formRuntimeInst, isStartInstanceStatus, pageHostInstance);
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
    resolveNextPossibleFlowNode: "/Rest/Workflow/RunTime/InstanceRuntime/ResolveNextPossibleFlowNode",
    completeTask: "/Rest/Workflow/RunTime/InstanceRuntime/CompleteTask"
  },
  _Prop: {},
  Instance: function Instance(flowModelRuntimePO, flowModelRuntimePOCacheKey, jb4dcActions, formRuntimeInst, actionObj, isStartInstanceStatus, pageHostInstance) {
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
      "pageHostInstance": pageHostInstance
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
    var selectedReceiverVars = FlowRuntimeVarBuilder.BuilderSelectedReceiverToInstanceVar(nextTaskEntityList, selectedReceiverData);
    var sendData = this.BuildSendToServerData(this._Prop, {
      selectedReceiverVars: encodeURIComponent(JsonUtility.JsonToString(selectedReceiverVars))
    });

    if (sendData.success) {
      AjaxUtility.Post(this.acInterface.completeTask, sendData.data, function (result) {
        DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
        console.log(result);
      }, this._Prop.sender);
    }
  },
  BuildSendToServerData: function BuildSendToServerData(_prop, appendSendMap) {
    var formDataComplexPO = _prop.formRuntimeInst.SerializationFormData();

    var result = {
      success: true,
      data: {
        isStartInstanceStatus: _prop.isStartInstanceStatus,
        actionCode: _prop.actionObj.actionCode,
        flowModelRuntimePOCacheKey: _prop.flowModelRuntimePOCacheKey,
        "formRecordComplexPOString": encodeURIComponent(JsonUtility.JsonToString(formDataComplexPO))
      }
    };

    if (!appendSendMap) {
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
            getRuntimeModelWithStart: "/Rest/Workflow/RunTime/ModelRuntime/GetRuntimeModelWithStart"
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGlvbnNSdW50aW1lT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVQYWdlT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVWYXJCdWlsZGVyLmpzIiwiQWN0aW9ucy9DYWxsQmFja0FjdGlvbi5qcyIsIkFjdGlvbnMvSnVtcFRvQW55Tm9kZUFjdGlvbi5qcyIsIkFjdGlvbnMvUmVCb290SW5zdGFuY2VBY3Rpb24uanMiLCJBY3Rpb25zL1RlbXBTYXZlQWN0aW9uLmpzIiwiQWN0aW9ucy9Xb3JrRmxvd1NlbmRBY3Rpb24uanMiLCJEaWFsb2cvVXNlclRhc2tSZWNlaXZlckRpYWxvZy5qcyIsIlBsdWdpbnMvRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQ0FBO0FDQUE7QUNBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiV29ya0Zsb3dSdW50aW1lRnVsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQWN0aW9uc1J1bnRpbWVPYmplY3QgPSB7XG4gIENyZWF0ZUFMTEFjdGlvbkJ1dHRvbjogZnVuY3Rpb24gQ3JlYXRlQUxMQWN0aW9uQnV0dG9uKGZsb3dNb2RlbFJ1bnRpbWVQTywgZmxvd01vZGVsUnVudGltZVBPQ2FjaGVLZXksIGpiNGRjQWN0aW9ucywgZm9ybVJ1bnRpbWVJbnN0LCBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHBhZ2VIb3N0SW5zdGFuY2UpIHtcbiAgICBpZiAoamI0ZGNBY3Rpb25zICYmIGpiNGRjQWN0aW9ucy5qYjRkY0FjdGlvbkxpc3QpIHtcbiAgICAgIHZhciBidXR0b25FbGVtO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGpiNGRjQWN0aW9ucy5qYjRkY0FjdGlvbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGFjdGlvbk9iaiA9IGpiNGRjQWN0aW9ucy5qYjRkY0FjdGlvbkxpc3RbaV07XG5cbiAgICAgICAgaWYgKGFjdGlvbk9iai5qdWVsUnVuUmVzdWx0UE8uYm9vbGVhblJlc3VsdCkge1xuICAgICAgICAgIGlmIChhY3Rpb25PYmouYWN0aW9uVHlwZSA9PSBcInNlbmRcIikge1xuICAgICAgICAgICAgdmFyIHNlbmRBY3Rpb25PYmplY3QgPSBPYmplY3QuY3JlYXRlKFdvcmtGbG93U2VuZEFjdGlvbik7XG4gICAgICAgICAgICBidXR0b25FbGVtID0gc2VuZEFjdGlvbk9iamVjdC5JbnN0YW5jZShmbG93TW9kZWxSdW50aW1lUE8sIGZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5LCBqYjRkY0FjdGlvbnMsIGZvcm1SdW50aW1lSW5zdCwgYWN0aW9uT2JqLCBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHBhZ2VIb3N0SW5zdGFuY2UpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQoXCIjZmxvd1dvcmtBY3Rpb25CdXR0b25XcmFwT3V0ZXJcIikuYXBwZW5kKGJ1dHRvbkVsZW0uZWxlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIEdldEFjdGlvbk9iajogZnVuY3Rpb24gR2V0QWN0aW9uT2JqKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY3Rpb25BdXRvU2VuZDogXCJmYWxzZVwiLFxuICAgICAgYWN0aW9uQ0NSZWNlaXZlT2JqZWN0czogXCJbXVwiLFxuICAgICAgYWN0aW9uQ2FsbEFwaXM6IFwiW11cIixcbiAgICAgIGFjdGlvbkNhbGxDb21wbGV0ZTogXCJ0cnVlXCIsXG4gICAgICBhY3Rpb25DYWxsSnNNZXRob2Q6IG51bGwsXG4gICAgICBhY3Rpb25DYXB0aW9uOiBcIuiNieeov1wiLFxuICAgICAgYWN0aW9uQ29kZTogXCJhY3Rpb25fNTE2MDA5Nzc1XCIsXG4gICAgICBhY3Rpb25Db25maXJtOiBcImZhbHNlXCIsXG4gICAgICBhY3Rpb25EaXNwbGF5Q29uZGl0aW9uRWRpdFRleHQ6IG51bGwsXG4gICAgICBhY3Rpb25EaXNwbGF5Q29uZGl0aW9uRWRpdFZhbHVlOiBudWxsLFxuICAgICAgYWN0aW9uRXhlY3V0ZVZhcmlhYmxlczogXCJbXVwiLFxuICAgICAgYWN0aW9uSFRNTENsYXNzOiBudWxsLFxuICAgICAgYWN0aW9uSFRNTElkOiBudWxsLFxuICAgICAgYWN0aW9uTWFpblJlY2VpdmVPYmplY3RzOiBcIltdXCIsXG4gICAgICBhY3Rpb25SdW5TcWxzOiBcIltdXCIsXG4gICAgICBhY3Rpb25TZW5kTWVzc2FnZUlkOiBudWxsLFxuICAgICAgYWN0aW9uU2VuZFNpZ25hbElkOiBudWxsLFxuICAgICAgYWN0aW9uU2hvd09waW5pb25EaWFsb2c6IFwiZmFsc2VcIixcbiAgICAgIGFjdGlvblR5cGU6IFwic2VuZFwiLFxuICAgICAgYWN0aW9uVXBkYXRlRmllbGRzOiBcIltdXCIsXG4gICAgICBhY3Rpb25WYWxpZGF0ZTogXCLml6BcIixcbiAgICAgIGFjdGlvbnNPcGluaW9uQmluZFRvRWxlbUlkOiBudWxsLFxuICAgICAgYWN0aW9uc09waW5pb25CaW5kVG9GaWVsZDogbnVsbCxcbiAgICAgIGp1ZWxSdW5SZXN1bHRQTzoge1xuICAgICAgICBib29sZWFuUmVzdWx0OiB0cnVlLFxuICAgICAgICBtZXNzYWdlOiBcIlwiLFxuICAgICAgICBzdHJpbmdSZXN1bHQ6IFwiXCIsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH1cbiAgICB9O1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRmxvd1J1bnRpbWVQYWdlT2JqZWN0ID0ge1xuICBfd2ViRm9ybVJUUGFyYXM6IG51bGwsXG4gIF9mb3JtUnVudGltZUluc3Q6IG51bGwsXG4gIEZPUk1fUlVOVElNRV9DQVRFR09SWV9GTE9XOiBcIklzRGVwZW5kZW5jZUZsb3dcIixcbiAgcGFnZVJlYWR5Rm9yU3RhcnRTdGF0dXM6IGZ1bmN0aW9uIHBhZ2VSZWFkeUZvclN0YXJ0U3RhdHVzKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgcmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmMsIGZsb3dNb2RlbFJ1bnRpbWVQTywgZmxvd01vZGVsUnVudGltZVBPQ2FjaGVLZXksIHBhZ2VIb3N0SW5zdGFuY2UpIHtcbiAgICB0aGlzLl9mb3JtUnVudGltZUluc3QgPSBPYmplY3QuY3JlYXRlKEZvcm1SdW50aW1lKTtcblxuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdC5Jbml0aWFsaXphdGlvbih7XG4gICAgICBcIlJlbmRlcmVyVG9JZFwiOiBcImh0bWxEZXNpZ25SdW50aW1lV3JhcFwiLFxuICAgICAgXCJGb3JtSWRcIjogZmxvd01vZGVsUnVudGltZVBPLmpiNGRjRm9ybUlkLFxuICAgICAgXCJSZWNvcmRJZFwiOiBcIlwiLFxuICAgICAgXCJCdXR0b25JZFwiOiBcIlwiLFxuICAgICAgXCJPcGVyYXRpb25UeXBlXCI6IEJhc2VVdGlsaXR5LkdldEFkZE9wZXJhdGlvbk5hbWUoKSxcbiAgICAgIFwiSXNQcmV2aWV3XCI6IGZhbHNlLFxuICAgICAgXCJSZW5kZXJlckNoYWluQ29tcGxldGVkRnVuY1wiOiByZW5kZXJlckNoYWluQ29tcGxldGVkRnVuYyxcbiAgICAgIFwiTGlzdEZvcm1CdXR0b25FbGVtSWRcIjogXCJcIixcbiAgICAgIFwiV2ViRm9ybVJUUGFyYXNcIjoge30sXG4gICAgICBcIkZvcm1SdW50aW1lQ2F0ZWdvcnlcIjogRmxvd1J1bnRpbWVQYWdlT2JqZWN0LkZPUk1fUlVOVElNRV9DQVRFR09SWV9GTE9XLFxuICAgICAgXCJQcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jXCI6IHRoaXMucHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuYyxcbiAgICAgIFwiZmxvd01vZGVsUnVudGltZVBPXCI6IGZsb3dNb2RlbFJ1bnRpbWVQTyxcbiAgICAgIFwiZmxvd01vZGVsUnVudGltZVBPQ2FjaGVLZXlcIjogZmxvd01vZGVsUnVudGltZVBPQ2FjaGVLZXksXG4gICAgICBcImlzU3RhcnRJbnN0YW5jZVN0YXR1c1wiOiBpc1N0YXJ0SW5zdGFuY2VTdGF0dXNcbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyZXJBY3Rpb25CdXR0b25zKGZsb3dNb2RlbFJ1bnRpbWVQTywgZmxvd01vZGVsUnVudGltZVBPQ2FjaGVLZXksIHRoaXMuX2Zvcm1SdW50aW1lSW5zdCwgaXNTdGFydEluc3RhbmNlU3RhdHVzLCBwYWdlSG9zdEluc3RhbmNlKTtcbiAgICByZXR1cm4gdGhpcy5fZm9ybVJ1bnRpbWVJbnN0O1xuICB9LFxuICByZW5kZXJlckFjdGlvbkJ1dHRvbnM6IGZ1bmN0aW9uIHJlbmRlcmVyQWN0aW9uQnV0dG9ucyhmbG93TW9kZWxSdW50aW1lUE8sIGZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5LCBmb3JtUnVudGltZUluc3QsIGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgcGFnZUhvc3RJbnN0YW5jZSkge1xuICAgIEFjdGlvbnNSdW50aW1lT2JqZWN0LkNyZWF0ZUFMTEFjdGlvbkJ1dHRvbihmbG93TW9kZWxSdW50aW1lUE8sIGZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5LCBmbG93TW9kZWxSdW50aW1lUE8uamI0ZGNBY3Rpb25zLCBmb3JtUnVudGltZUluc3QsIGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgcGFnZUhvc3RJbnN0YW5jZSk7XG4gIH0sXG4gIHByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmM6IGZ1bmN0aW9uIHByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmMoc291cmNlUnVudGltZUh0bWwsIGZvcm1SdW50aW1lSW5zdCwgcHJvcENvbmZpZykge1xuICAgIHZhciBmbG93UGFnZUNvbnRhaW5lciA9ICQoXCI8ZGl2PlwiICsgc291cmNlUnVudGltZUh0bWwgKyBcIjxkaXY+XCIpO1xuICAgIHZhciBmbG93TW9kZWxSdW50aW1lUE8gPSBwcm9wQ29uZmlnLmZsb3dNb2RlbFJ1bnRpbWVQTztcblxuICAgIGlmIChmbG93UGFnZUNvbnRhaW5lci5jaGlsZHJlbihcIltzaW5nbGVuYW1lPSdXRkRDVF9UYWJDb250YWluZXInXVwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgZmxvd1BhZ2VDb250YWluZXIgPSAkKFwiPGRpdj48ZGl2IGNsYXNzPVxcXCJ3ZmRjdC10YWJzLW91dGVyLXdyYXAtcnVudGltZSBodG1sLWRlc2lnbi10aGVtZS1kZWZhdWx0LXJvb3QtZWxlbS1jbGFzc1xcXCIgY29udHJvbF9jYXRlZ29yeT1cXFwiQ29udGFpbmVyQ29udHJvbFxcXCIgZGVzYz1cXFwiXFxcIiBncm91cG5hbWU9XFxcIlxcXCIgaWQ9XFxcInRhYnNfd3JhcF81MTg2Mjc2MTZcXFwiIGlzX2pidWlsZDRkY19kYXRhPVxcXCJmYWxzZVxcXCIgamJ1aWxkNGRjX2N1c3RvbT1cXFwidHJ1ZVxcXCIgbmFtZT1cXFwidGFic193cmFwXzUxODYyNzYxNlxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcXCIgc2VyaWFsaXplPVxcXCJmYWxzZVxcXCIgc2hvd19yZW1vdmVfYnV0dG9uPVxcXCJmYWxzZVxcXCIgc2luZ2xlbmFtZT1cXFwiV0ZEQ1RfVGFiQ29udGFpbmVyXFxcIiBzdGF0dXM9XFxcImVuYWJsZVxcXCIgc3R5bGU9XFxcIlxcXCIgY2xpZW50X3Jlc29sdmU9XFxcIldGRENUX1RhYkNvbnRhaW5lclxcXCI+PGRpdj5cIik7XG4gICAgICBmbG93UGFnZUNvbnRhaW5lci5jaGlsZHJlbihcIltzaW5nbGVuYW1lPSdXRkRDVF9UYWJDb250YWluZXInXVwiKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfZm9ybV85OTlcXFwiPlwiICsgZmxvd01vZGVsUnVudGltZVBPLm1vZGVsTmFtZSArIFwiPC9kaXY+XCIpO1xuICAgICAgZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIikuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF9mbG93X2Zvcm1fOTk5XFxcIj5cIiArIHNvdXJjZVJ1bnRpbWVIdG1sICsgXCI8L2Rpdj5cIik7XG4gICAgfVxuXG4gICAgdmFyIHRhYkNvbnRhaW5lciA9IGZsb3dQYWdlQ29udGFpbmVyLmNoaWxkcmVuKFwiW3NpbmdsZW5hbWU9J1dGRENUX1RhYkNvbnRhaW5lciddXCIpO1xuXG4gICAgaWYgKGZsb3dNb2RlbFJ1bnRpbWVQTy5qYjRkY0NvbnRlbnREb2N1bWVudFBsdWdpbiA9PSBcInVwbG9hZENvbnZlcnRUb1BERlBsdWdpblwiKSB7XG4gICAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF91cGxvYWRDb252ZXJ0VG9QREZQbHVnaW5fOTk5XFxcIj7mraPmloc8L2Rpdj5cIik7XG4gICAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF91cGxvYWRDb252ZXJ0VG9QREZQbHVnaW5fOTk5XFxcIj5cIiArIERvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERlBsdWdpbi5nZXRIdG1sRWxlbSgpICsgXCI8L2Rpdj5cIik7XG4gICAgfSBlbHNlIGlmIChmbG93TW9kZWxSdW50aW1lUE8uamI0ZGNDb250ZW50RG9jdW1lbnRQbHVnaW4gPT0gXCJ3cHNPbmxpbmVEb2N1bWVudFBsdWdpblwiKSB7XG4gICAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF93cHNPbmxpbmVEb2N1bWVudFBsdWdpbl85OTlcXFwiPuato+aWhzwvZGl2PlwiKTtcbiAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X3dwc09ubGluZURvY3VtZW50UGx1Z2luXzk5OVxcXCI+5pyq5a6e546wPC9kaXY+XCIpO1xuICAgIH1cblxuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfbW9kZWxlcl85OTlcXFwiPua1geeoi+WbvjwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF9mbG93X21vZGVsZXJfOTk5XFxcIj48L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfZmxvd19zZXF1ZW5jZV85OTlcXFwiPumhuuW6j+WbvjwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF9mbG93X3NlcXVlbmNlXzk5OVxcXCI+PC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfdGFza185OTlcXFwiPua1gei9rOS/oeaBrzwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF9mbG93X3Rhc2tfOTk5XFxcIj48L2Rpdj5cIik7XG4gICAgdmFyIG5ld1J1bnRpbWVIdG1sID0gZmxvd1BhZ2VDb250YWluZXIuaHRtbCgpO1xuICAgIHJldHVybiBuZXdSdW50aW1lSHRtbDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEZsb3dSdW50aW1lVmFyQnVpbGRlciA9IHtcbiAgQnVpbGRlclNlbGVjdGVkUmVjZWl2ZXJUb0luc3RhbmNlVmFyOiBmdW5jdGlvbiBCdWlsZGVyU2VsZWN0ZWRSZWNlaXZlclRvSW5zdGFuY2VWYXIobmV4dEZsb3dOb2RlRW50aXRpZXMsIHNlbGVjdGVkUmVjZWl2ZXJEYXRhKSB7XG4gICAgdmFyIHJlc3VsdERhdGEgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0ZWRSZWNlaXZlckRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciByZWNlaXZlciA9IHNlbGVjdGVkUmVjZWl2ZXJEYXRhW2ldO1xuICAgICAgcmVzdWx0RGF0YS5wdXNoKHtcbiAgICAgICAgbm9kZUlkOiByZWNlaXZlci5mbG93Tm9kZUVudGl0eS5pZCxcbiAgICAgICAgcmVjZWl2ZXJJZDogcmVjZWl2ZXIuaWQsXG4gICAgICAgIHJlY2VpdmVyTmFtZTogcmVjZWl2ZXIubmFtZSxcbiAgICAgICAgcmVjZWl2ZXJUeXBlTmFtZTogcmVjZWl2ZXIudHlwZU5hbWUsXG4gICAgICAgIHJlY2VpdmVUeXBlOiByZWNlaXZlci5yZWNlaXZlVHlwZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdERhdGE7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXb3JrRmxvd1NlbmRBY3Rpb24gPSB7XG4gIGFjSW50ZXJmYWNlOiB7XG4gICAgcmVzb2x2ZU5leHRQb3NzaWJsZUZsb3dOb2RlOiBcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvSW5zdGFuY2VSdW50aW1lL1Jlc29sdmVOZXh0UG9zc2libGVGbG93Tm9kZVwiLFxuICAgIGNvbXBsZXRlVGFzazogXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0luc3RhbmNlUnVudGltZS9Db21wbGV0ZVRhc2tcIlxuICB9LFxuICBfUHJvcDoge30sXG4gIEluc3RhbmNlOiBmdW5jdGlvbiBJbnN0YW5jZShmbG93TW9kZWxSdW50aW1lUE8sIGZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5LCBqYjRkY0FjdGlvbnMsIGZvcm1SdW50aW1lSW5zdCwgYWN0aW9uT2JqLCBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHBhZ2VIb3N0SW5zdGFuY2UpIHtcbiAgICBjb25zb2xlLmxvZyhhY3Rpb25PYmopO1xuICAgIHZhciBodG1sSWQgPSBhY3Rpb25PYmouYWN0aW9uSFRNTElkID8gYWN0aW9uT2JqLmFjdGlvbkhUTUxJZCA6IGFjdGlvbk9iai5hY3Rpb25Db2RlO1xuICAgIHZhciBlbGVtID0gJCgnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJvcGVyYXRpb24tYnV0dG9uIG9wZXJhdGlvbi1idXR0b24tcHJpbWFyeVwiIGlkPVwiJyArIGh0bWxJZCArICdcIj48c3Bhbj4nICsgYWN0aW9uT2JqLmFjdGlvbkNhcHRpb24gKyAnPC9zcGFuPjwvYnV0dG9uPicpO1xuICAgIHRoaXMuX1Byb3AgPSB7XG4gICAgICBcInNlbmRlclwiOiB0aGlzLFxuICAgICAgXCJmbG93TW9kZWxSdW50aW1lUE9cIjogZmxvd01vZGVsUnVudGltZVBPLFxuICAgICAgXCJmbG93TW9kZWxSdW50aW1lUE9DYWNoZUtleVwiOiBmbG93TW9kZWxSdW50aW1lUE9DYWNoZUtleSxcbiAgICAgIFwiamI0ZGNBY3Rpb25zXCI6IGpiNGRjQWN0aW9ucyxcbiAgICAgIFwiZm9ybVJ1bnRpbWVJbnN0XCI6IGZvcm1SdW50aW1lSW5zdCxcbiAgICAgIFwiYWN0aW9uT2JqXCI6IGFjdGlvbk9iaixcbiAgICAgIFwiaXNTdGFydEluc3RhbmNlU3RhdHVzXCI6IGlzU3RhcnRJbnN0YW5jZVN0YXR1cyxcbiAgICAgIFwicGFnZUhvc3RJbnN0YW5jZVwiOiBwYWdlSG9zdEluc3RhbmNlXG4gICAgfTtcbiAgICBlbGVtLmJpbmQoXCJjbGlja1wiLCB0aGlzLl9Qcm9wLCB0aGlzLkJ1dHRvbkNsaWNrRXZlbnQpO1xuICAgIHJldHVybiB7XG4gICAgICBlbGVtOiBlbGVtXG4gICAgfTtcbiAgfSxcbiAgQnV0dG9uQ2xpY2tFdmVudDogZnVuY3Rpb24gQnV0dG9uQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICB2YXIgdmFsaWRhdGVSZXN1bHQgPSBWYWxpZGF0ZVJ1bGVzUnVudGltZS5WYWxpZGF0ZVN1Ym1pdEVuYWJsZSgpO1xuXG4gICAgaWYgKFZhbGlkYXRlUnVsZXNSdW50aW1lLkFsZXJ0VmFsaWRhdGVFcnJvcnModmFsaWRhdGVSZXN1bHQpKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0TG9hZGluZyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkLCB7fSwgXCJcIik7XG4gICAgICB2YXIgX3Byb3AgPSBzZW5kZXIuZGF0YTtcbiAgICAgIHZhciBfdGhpcyA9IF9wcm9wLnNlbmRlcjtcblxuICAgICAgdmFyIHNlbmREYXRhID0gX3RoaXMuQnVpbGRTZW5kVG9TZXJ2ZXJEYXRhKF9wcm9wLCBudWxsKTtcblxuICAgICAgaWYgKHNlbmREYXRhLnN1Y2Nlc3MpIHtcbiAgICAgICAgQWpheFV0aWxpdHkuUG9zdChfdGhpcy5hY0ludGVyZmFjZS5yZXNvbHZlTmV4dFBvc3NpYmxlRmxvd05vZGUsIHNlbmREYXRhLmRhdGEsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgICAgICAgIFVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dVdGlsaXR5LlNob3dEaWFsb2coX3Byb3Auc2VuZGVyLCByZXN1bHQuZGF0YSwgX3Byb3Auc2VuZGVyLlNlbGVjdFJlY2VpdmVyQ29tcGxldGVkKTtcbiAgICAgICAgfSwgX3Byb3Auc2VuZGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIFNlbGVjdFJlY2VpdmVyQ29tcGxldGVkOiBmdW5jdGlvbiBTZWxlY3RSZWNlaXZlckNvbXBsZXRlZChuZXh0VGFza0VudGl0eUxpc3QsIHNlbGVjdGVkUmVjZWl2ZXJEYXRhKSB7XG4gICAgY29uc29sZS5sb2coc2VsZWN0ZWRSZWNlaXZlckRhdGEpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuX1Byb3AuYWN0aW9uT2JqLmFjdGlvbkNhcHRpb24pO1xuICAgIHZhciBzZWxlY3RlZFJlY2VpdmVyVmFycyA9IEZsb3dSdW50aW1lVmFyQnVpbGRlci5CdWlsZGVyU2VsZWN0ZWRSZWNlaXZlclRvSW5zdGFuY2VWYXIobmV4dFRhc2tFbnRpdHlMaXN0LCBzZWxlY3RlZFJlY2VpdmVyRGF0YSk7XG4gICAgdmFyIHNlbmREYXRhID0gdGhpcy5CdWlsZFNlbmRUb1NlcnZlckRhdGEodGhpcy5fUHJvcCwge1xuICAgICAgc2VsZWN0ZWRSZWNlaXZlclZhcnM6IGVuY29kZVVSSUNvbXBvbmVudChKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcoc2VsZWN0ZWRSZWNlaXZlclZhcnMpKVxuICAgIH0pO1xuXG4gICAgaWYgKHNlbmREYXRhLnN1Y2Nlc3MpIHtcbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5jb21wbGV0ZVRhc2ssIHNlbmREYXRhLmRhdGEsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICB9LCB0aGlzLl9Qcm9wLnNlbmRlcik7XG4gICAgfVxuICB9LFxuICBCdWlsZFNlbmRUb1NlcnZlckRhdGE6IGZ1bmN0aW9uIEJ1aWxkU2VuZFRvU2VydmVyRGF0YShfcHJvcCwgYXBwZW5kU2VuZE1hcCkge1xuICAgIHZhciBmb3JtRGF0YUNvbXBsZXhQTyA9IF9wcm9wLmZvcm1SdW50aW1lSW5zdC5TZXJpYWxpemF0aW9uRm9ybURhdGEoKTtcblxuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgZGF0YToge1xuICAgICAgICBpc1N0YXJ0SW5zdGFuY2VTdGF0dXM6IF9wcm9wLmlzU3RhcnRJbnN0YW5jZVN0YXR1cyxcbiAgICAgICAgYWN0aW9uQ29kZTogX3Byb3AuYWN0aW9uT2JqLmFjdGlvbkNvZGUsXG4gICAgICAgIGZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5OiBfcHJvcC5mbG93TW9kZWxSdW50aW1lUE9DYWNoZUtleSxcbiAgICAgICAgXCJmb3JtUmVjb3JkQ29tcGxleFBPU3RyaW5nXCI6IGVuY29kZVVSSUNvbXBvbmVudChKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcoZm9ybURhdGFDb21wbGV4UE8pKVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoIWFwcGVuZFNlbmRNYXApIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhcHBlbmRTZW5kTWFwKSB7XG4gICAgICAgIHJlc3VsdC5kYXRhW2tleV0gPSBhcHBlbmRTZW5kTWFwW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZTtcbnZhciBVc2VyVGFza1JlY2VpdmVyRGlhbG9nVXRpbGl0eSA9IHtcbiAgU2hvd0RpYWxvZzogZnVuY3Rpb24gU2hvd0RpYWxvZyhzZW5kZXIsIG5leHRGbG93Tm9kZUVudGl0aWVzLCBzZWxlY3RSZWNlaXZlckNvbXBsZXRlZEZ1bmMpIHtcbiAgICBpZiAoIXVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZSkge1xuICAgICAgJChkb2N1bWVudC5ib2R5KS5hcHBlbmQoXCI8ZGl2IGlkPSd1c2VyVGFza1JlY2VpdmVyRGlhbG9nJz48dXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZyByZWY9J3VzZXJUYXNrUmVjZWl2ZXJEaWFsb2cnPjwvdXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZz48L2Rpdj5cIik7XG4gICAgICB1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6IFwiI3VzZXJUYXNrUmVjZWl2ZXJEaWFsb2dcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgICAgICBnZXRSdW50aW1lTW9kZWxXaXRoU3RhcnQ6IFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9Nb2RlbFJ1bnRpbWUvR2V0UnVudGltZU1vZGVsV2l0aFN0YXJ0XCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgICAgICAgbWV0aG9kczoge31cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZS4kcmVmcy51c2VyVGFza1JlY2VpdmVyRGlhbG9nLmJlZ2luU2VsZWN0UmVjZWl2ZXIoc2VuZGVyLCBuZXh0Rmxvd05vZGVFbnRpdGllcywgc2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWRGdW5jKTtcbiAgfSxcbiAgQ2xvc2VEaWFsb2c6IGZ1bmN0aW9uIENsb3NlRGlhbG9nKCkge1xuICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKHVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZS4kcmVmcy51c2VyVGFza1JlY2VpdmVyRGlhbG9nLiRyZWZzLnVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dXcmFwKTtcbiAgICB1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUgPSBudWxsO1xuICAgICQoXCIjdXNlclRhc2tSZWNlaXZlckRpYWxvZ1wiKS5yZW1vdmUoKTtcbiAgfVxufTtcblZ1ZS5jb21wb25lbnQoXCJ1c2VyLXRhc2stcmVjZWl2ZXItZGlhbG9nXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHt9LFxuICAgICAgbmV4dEZsb3dOb2RlRW50aXRpZXM6IFtdLFxuICAgICAgcmVjZWl2ZXJUcmVlOiB7XG4gICAgICAgIHRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vY2hlY2tJbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgYXN5bmM6IHtcbiAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLFxuICAgICAgICAgICAgdXJsOiBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbihcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvUmVjZWl2ZXJSdW50aW1lL0dldEFzeW5jUmVjZWl2ZXJzXCIpLFxuICAgICAgICAgICAgYXV0b1BhcmFtOiBbXCJpZFwiLCBcInR5cGVOYW1lXCIsIFwibmFtZVwiXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwibmFtZVwiLFxuICAgICAgICAgICAgICBjaGlsZHJlbjogXCJydW50aW1lUmVjZWl2ZVVzZXJzXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiaWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcInBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7fSxcbiAgICAgICAgICAgIG9uRGJsQ2xpY2s6IGZ1bmN0aW9uIG9uRGJsQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcy5nZXRaVHJlZU9iaih0cmVlSWQpLl9ob3N0O1xuXG4gICAgICAgICAgICAgIHZhciBmbG93Tm9kZUVudGl0eSA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5mbG93Tm9kZUVudGl0eTtcbiAgICAgICAgICAgICAgdmFyIHJlY2VpdmVUeXBlID0gdGhpcy5nZXRaVHJlZU9iaih0cmVlSWQpLnJlY2VpdmVUeXBlO1xuXG4gICAgICAgICAgICAgIF90aGlzLmFkZFJlY2VpdmVyVG9TZWxlY3RlZCh0cmVlTm9kZSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiZWZvcmVBc3luYzogZnVuY3Rpb24gYmVmb3JlQXN5bmModHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0cmVlSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHJlZU9iak1hcDoge31cbiAgICAgIH0sXG4gICAgICBzZWxlY3RlZFJlY2VpdmVyOiB7XG4gICAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgICAgdGl0bGU6ICflt7LpgInnlKjmiLcxJyxcbiAgICAgICAgICBrZXk6ICduYW1lJyxcbiAgICAgICAgICB3aWR0aDogMTg4LFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgICAgc2xvdDogJ2FjdGlvbicsXG4gICAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH1dLFxuICAgICAgICByZWNlaXZlckRhdGE6IFtdXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBmaWx0ZXJzOiB7XG4gICAgZmlsdGVyUmVjZWl2ZXJEYXRhOiBmdW5jdGlvbiBmaWx0ZXJSZWNlaXZlckRhdGEocmVjZWl2ZXJEYXRhLCBmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpIHtcbiAgICAgIHJldHVybiByZWNlaXZlckRhdGEuZmlsdGVyKGZ1bmN0aW9uIChyZWNlaXZlcikge1xuICAgICAgICByZXR1cm4gcmVjZWl2ZXIuZmxvd05vZGVFbnRpdHkuaWQgPT0gZmxvd05vZGVFbnRpdHkuaWQgJiYgcmVjZWl2ZXIucmVjZWl2ZVR5cGUgPT0gcmVjZWl2ZVR5cGU7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBiZWdpblNlbGVjdFJlY2VpdmVyOiBmdW5jdGlvbiBiZWdpblNlbGVjdFJlY2VpdmVyKHNlbmRlciwgbmV4dEZsb3dOb2RlRW50aXRpZXMsIHNlbGVjdFJlY2VpdmVyQ29tcGxldGVkRnVuYykge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLnVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dXcmFwO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHdpZHRoOiA2NTAsXG4gICAgICAgIGhlaWdodDogNjAwLFxuICAgICAgICB0aXRsZTogXCLpgInmi6nmjqXmlLbkurrlkZhcIixcbiAgICAgICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgIFwi56Gu6K6kXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMudmFsaWRhdGVDb21wbGV0ZUVuYWJsZSgpLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgc2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWRGdW5jLmNhbGwoc2VuZGVyLCBfdGhpcy5uZXh0Rmxvd05vZGVFbnRpdGllcywgX3RoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCLlj5bmtohcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAgIFVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvcGVuOiBmdW5jdGlvbiBvcGVuKGV2ZW50LCB1aSkge1xuICAgICAgICAgICQoXCIudWktZGlhbG9nLXRpdGxlYmFyLWNsb3NlXCIsICQodGhpcykucGFyZW50KCkpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzID0gbmV4dEZsb3dOb2RlRW50aXRpZXM7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCh0aGlzLmluaXRUcmVlLCA1MDApO1xuICAgIH0sXG4gICAgaW5pdFRyZWU6IGZ1bmN0aW9uIGluaXRUcmVlKCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBmbG93Tm9kZUVudGl0eSA9IHRoaXMubmV4dEZsb3dOb2RlRW50aXRpZXNbaV07XG5cbiAgICAgICAgaWYgKGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzICYmIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjTWFpblJlY2VpdmVPYmplY3RzICYmIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjTWFpblJlY2VpdmVPYmplY3RzLnJ1bnRpbWVSZWNlaXZlR3JvdXBzKSB7XG4gICAgICAgICAgdmFyIHRyZWVPYmpLZXkgPSB0aGlzLmJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIFwibWFpblwiKTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldID0gJC5mbi56VHJlZS5pbml0KCQoXCIjXCIgKyB0cmVlT2JqS2V5KSwgdGhpcy5yZWNlaXZlclRyZWUudHJlZVNldHRpbmcsIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjTWFpblJlY2VpdmVPYmplY3RzLnJ1bnRpbWVSZWNlaXZlR3JvdXBzKTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldLl9ob3N0ID0gdGhpcztcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldLmZsb3dOb2RlRW50aXR5ID0gZmxvd05vZGVFbnRpdHk7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XS5yZWNlaXZlVHlwZSA9IFwibWFpblwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzICYmIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjQ0NSZWNlaXZlT2JqZWN0cyAmJiBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY0NDUmVjZWl2ZU9iamVjdHMucnVudGltZVJlY2VpdmVHcm91cHMpIHtcbiAgICAgICAgICB2YXIgdHJlZU9iaktleSA9IHRoaXMuYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwgXCJjY1wiKTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldID0gJC5mbi56VHJlZS5pbml0KCQoXCIjXCIgKyB0cmVlT2JqS2V5KSwgdGhpcy5yZWNlaXZlclRyZWUudHJlZVNldHRpbmcsIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjQ0NSZWNlaXZlT2JqZWN0cy5ydW50aW1lUmVjZWl2ZUdyb3Vwcyk7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XS5faG9zdCA9IHRoaXM7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XS5mbG93Tm9kZUVudGl0eSA9IGZsb3dOb2RlRW50aXR5O1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0ucmVjZWl2ZVR5cGUgPSBcImNjXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1aWxkVWxUcmVlSWQ6IGZ1bmN0aW9uIGJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICByZXR1cm4gJ3VsVHJlZV8nICsgcmVjZWl2ZVR5cGUgKyBcIl9cIiArIGZsb3dOb2RlRW50aXR5LmlkO1xuICAgIH0sXG4gICAgYWRkVHJlZVNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkOiBmdW5jdGlvbiBhZGRUcmVlU2VsZWN0ZWRSZWNlaXZlclRvU2VsZWN0ZWQoZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICB2YXIgdHJlZUtleSA9IHRoaXMuYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpO1xuICAgICAgdmFyIHRyZWVPYmplY3QgPSB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVLZXldO1xuXG4gICAgICBpZiAodHJlZU9iamVjdCkge1xuICAgICAgICB2YXIgc2VsZWN0Tm9kZXMgPSB0cmVlT2JqZWN0LmdldFNlbGVjdGVkTm9kZXMoKTtcblxuICAgICAgICBpZiAoc2VsZWN0Tm9kZXMgJiYgc2VsZWN0Tm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuYWRkUmVjZWl2ZXJUb1NlbGVjdGVkKHNlbGVjdE5vZGVzWzBdLCBmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRSZWNlaXZlclRvU2VsZWN0ZWQ6IGZ1bmN0aW9uIGFkZFJlY2VpdmVyVG9TZWxlY3RlZChzZWxlY3ROb2RlLCBmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpIHtcbiAgICAgIHZhciBpc011bHRpSW5zdGFuY2VUYXNrID0gdGhpcy5pc011bHRpSW5zdGFuY2VUYXNrKGZsb3dOb2RlRW50aXR5KTtcbiAgICAgIHZhciBpbm5lclNpbmdsZUlkID0gZmxvd05vZGVFbnRpdHkuaWQgKyBcIl9cIiArIHJlY2VpdmVUeXBlICsgXCJfXCIgKyBzZWxlY3ROb2RlLmlkO1xuXG4gICAgICBpZiAoc2VsZWN0Tm9kZS50eXBlTmFtZSA9PSBcIlNpbmdsZVVzZXJcIikge1xuICAgICAgICBzZWxlY3ROb2RlLmlubmVyU2luZ2xlSWQgPSBpbm5lclNpbmdsZUlkO1xuICAgICAgICBzZWxlY3ROb2RlLmZsb3dOb2RlRW50aXR5ID0gZmxvd05vZGVFbnRpdHk7XG4gICAgICAgIHNlbGVjdE5vZGUucmVjZWl2ZVR5cGUgPSByZWNlaXZlVHlwZTtcblxuICAgICAgICBpZiAoKHJlY2VpdmVUeXBlID09IFwiY2NcIiB8fCBpc011bHRpSW5zdGFuY2VUYXNrKSAmJiAhQXJyYXlVdGlsaXR5LkV4aXN0KHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0uaW5uZXJTaW5nbGVJZCA9PSBpbm5lclNpbmdsZUlkO1xuICAgICAgICB9KSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEucHVzaChzZWxlY3ROb2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChyZWNlaXZlVHlwZSA9PSBcIm1haW5cIiAmJiAhaXNNdWx0aUluc3RhbmNlVGFzaykge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGFbaV0uZmxvd05vZGVFbnRpdHkuaWQgPT0gZmxvd05vZGVFbnRpdHkuaWQgJiYgdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YVtpXS5yZWNlaXZlVHlwZSA9PSByZWNlaXZlVHlwZSkge1xuICAgICAgICAgICAgICBBcnJheVV0aWxpdHkuRGVsZXRlKHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEsIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEucHVzaChzZWxlY3ROb2RlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpc011bHRpSW5zdGFuY2VUYXNrICYmIChzZWxlY3ROb2RlLnR5cGVOYW1lID09IFwiVXNlcnNcIiB8fCBzZWxlY3ROb2RlLnR5cGVOYW1lID09IFwiUm9sZVwiIHx8IHNlbGVjdE5vZGUudHlwZU5hbWUgPT0gXCJPcmdhbnNcIikpIHtcbiAgICAgICAgaWYgKHNlbGVjdE5vZGUucnVudGltZVJlY2VpdmVVc2VycyAhPSBudWxsICYmIHNlbGVjdE5vZGUucnVudGltZVJlY2VpdmVVc2Vycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHNlbGVjdE5vZGUucnVudGltZVJlY2VpdmVVc2Vycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBjaGlsZE5vZGUgPSBzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnNbX2ldO1xuXG4gICAgICAgICAgICBpZiAoY2hpbGROb2RlLnR5cGVOYW1lID09IFwiU2luZ2xlVXNlclwiKSB7XG4gICAgICAgICAgICAgIHRoaXMuYWRkUmVjZWl2ZXJUb1NlbGVjdGVkKGNoaWxkTm9kZSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyU2VsZWN0ZWRSZWNlaXZlclRvU2VsZWN0ZWQ6IGZ1bmN0aW9uIGNsZWFyU2VsZWN0ZWRSZWNlaXZlclRvU2VsZWN0ZWQoZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB2YXIgcmVjZWl2ZXIgPSB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhW2ldO1xuXG4gICAgICAgIGlmIChyZWNlaXZlci5mbG93Tm9kZUVudGl0eS5pZCA9PSBmbG93Tm9kZUVudGl0eS5pZCAmJiByZWNlaXZlci5yZWNlaXZlVHlwZSA9PSByZWNlaXZlVHlwZSkge1xuICAgICAgICAgIEFycmF5VXRpbGl0eS5EZWxldGUodGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSwgaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGRlbGV0ZVNlbGVjdGVkUmVjZWl2ZXI6IGZ1bmN0aW9uIGRlbGV0ZVNlbGVjdGVkUmVjZWl2ZXIoaW5kZXgsIHJvdykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhW2ldLmlubmVyU2luZ2xlSWQgPT0gcm93LmlubmVyU2luZ2xlSWQpIHtcbiAgICAgICAgICBBcnJheVV0aWxpdHkuRGVsZXRlKHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEsIGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBpc011bHRpSW5zdGFuY2VUYXNrOiBmdW5jdGlvbiBpc011bHRpSW5zdGFuY2VUYXNrKGZsb3dOb2RlRW50aXR5KSB7XG4gICAgICByZXR1cm4gZmxvd05vZGVFbnRpdHkubXVsdGlJbnN0YW5jZVRhc2s7XG4gICAgfSxcbiAgICBidWlsZFRhYkxhYmVsOiBmdW5jdGlvbiBidWlsZFRhYkxhYmVsKGZsb3dOb2RlRW50aXR5KSB7XG4gICAgICByZXR1cm4gZmxvd05vZGVFbnRpdHkubmFtZSArIFwiIFtcIiArICh0aGlzLmlzTXVsdGlJbnN0YW5jZVRhc2soZmxvd05vZGVFbnRpdHkpID8gXCLlpJrkurpcIiA6IFwi5Y2V5Lq6XCIpICsgXCJdXCI7XG4gICAgfSxcbiAgICB2YWxpZGF0ZUNvbXBsZXRlRW5hYmxlOiBmdW5jdGlvbiB2YWxpZGF0ZUNvbXBsZXRlRW5hYmxlKCkge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHZhciBlcnJvck1lc3NhZ2VzID0gW107XG4gICAgICB2YXIgc3VjY2VzcyA9IHRydWU7XG5cbiAgICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKGkpIHtcbiAgICAgICAgaWYgKF90aGlzMi5uZXh0Rmxvd05vZGVFbnRpdGllc1tpXS50YXNrVHlwZU5hbWUgPT0gXCJjb20uamI0ZGMud29ya2Zsb3cucG8uYnBtbi5wcm9jZXNzLkJwbW5Vc2VyVGFza1wiKSB7XG4gICAgICAgICAgaWYgKCFBcnJheVV0aWxpdHkuRXhpc3QoX3RoaXMyLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZmxvd05vZGVFbnRpdHkuaWQgPT0gX3RoaXMyLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldLmlkICYmIGl0ZW0ucmVjZWl2ZVR5cGUgPT0gXCJtYWluXCI7XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgICAgIHRhc2tOYW1lOiBfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0ubmFtZSxcbiAgICAgICAgICAgICAgZmxvd05vZGVFbnRpdHk6IF90aGlzMi5uZXh0Rmxvd05vZGVFbnRpdGllc1tpXSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogXCLnjq/oioJbXCIgKyBfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0ubmFtZSArIFwiXeiHs+WwkemcgOimgeiuvue9ruS4gOS4quaOpeaUtueUqOaItyFcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubmV4dEZsb3dOb2RlRW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgX2xvb3AoaSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvck1lc3NhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGVycm9yVGV4dEFyeSA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JNZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGVycm9yVGV4dEFyeS5wdXNoKGVycm9yTWVzc2FnZXNbaV0ubWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChlcnJvclRleHRBcnkuam9pbihcIjxiciAvPlwiKSwgdGhpcyk7XG4gICAgICAgIHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2Vzczogc3VjY2Vzc1xuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgcmVmPVxcXCJ1c2VyVGFza1JlY2VpdmVyRGlhbG9nV3JhcFxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICA8dGFicyBuYW1lPVxcXCJ1c2VyVGFza1JlY2VpdmVyRGlhbG9nVGFic1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8dGFiLXBhbmUgOmxhYmVsPVxcXCJidWlsZFRhYkxhYmVsKGZsb3dOb2RlRW50aXR5KVxcXCIgdGFiPVxcXCJ1c2VyVGFza1JlY2VpdmVyRGlhbG9nVGFic1xcXCIgdi1mb3I9XFxcImZsb3dOb2RlRW50aXR5IGluIG5leHRGbG93Tm9kZUVudGl0aWVzXFxcIiA6a2V5PVxcXCJmbG93Tm9kZUVudGl0eS5pZFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbGxhcHNlIGFjY29yZGlvbiB2YWx1ZT1cXFwibWFpblJlY2VpdmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhbmVsIG5hbWU9XFxcIm1haW5SZWNlaXZlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU0RTNCXFx1OTAwMVxcdTRFQkFcXHU1NDU4XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHNsb3Q9XFxcImNvbnRlbnRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInVzZXItdGFzay1yZWNlaXZlci1kaWFsb2ctb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdEVuYWJsZVVzZXJMaXN0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCA6aWQ9XFxcImJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksJ21haW4nKVxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIiBzdHlsZT1cXFwid2lkdGg6IDIwMHB4XFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0T3BCdXR0b25Db250YWluZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2luZ2xlLW9wLWJ1dHRvblxcXCIgdGl0bGU9XFxcIlxcdTZERkJcXHU1MkEwXFx1NEVCQVxcdTU0NThcXFwiIEBjbGljaz1cXFwiYWRkVHJlZVNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCdtYWluJylcXFwiPjxJY29uIHR5cGU9XFxcIm1kLWFycm93LXJvdW5kLWZvcndhcmRcXFwiIC8+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzaW5nbGUtb3AtYnV0dG9uXFxcIiB0aXRsZT1cXFwiXFx1NkUwNVxcdTdBN0FcXHU1REYyXFx1OTAwOVxcdTRFQkFcXHU1NDU4XFxcIiBAY2xpY2s9XFxcImNsZWFyU2VsZWN0ZWRSZWNlaXZlclRvU2VsZWN0ZWQoZmxvd05vZGVFbnRpdHksJ21haW4nKVxcXCI+PEljb24gdHlwZT1cXFwibWQtYmFja3NwYWNlXFxcIiAvPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0ZWRVc2VyTGlzdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSBoZWlnaHQ9XFxcIjMyN1xcXCIgd2lkdGg9XFxcIjI2MFxcXCIgc3RyaXBlIDpjb2x1bW5zPVxcXCJzZWxlY3RlZFJlY2VpdmVyLmNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJzZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSB8IGZpbHRlclJlY2VpdmVyRGF0YShmbG93Tm9kZUVudGl0eSwgJ21haW4nKVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIml2LWxpc3QtdGFibGVcXFwiIHNpemU9XFxcInNtYWxsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Qtc2NvcGU9XFxcInsgcm93LCBpbmRleCB9XFxcIiBzbG90PVxcXCJhY3Rpb25cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LWZvbnQtaWNvbi1idXR0b24tY2xhc3NcXFwiIEBjbGljaz1cXFwiZGVsZXRlU2VsZWN0ZWRSZWNlaXZlcihpbmRleCxyb3cpXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJY29uIHR5cGU9XFxcIm1kLWNsb3NlXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPiAgICAgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktdGFibGU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcGFuZWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYW5lbCBuYW1lPVxcXCJjY1JlY2VpdmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTYyODRcXHU5MDAxXFx1NEVCQVxcdTU0NThcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc2xvdD1cXFwiY29udGVudFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZy1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0RW5hYmxlVXNlckxpc3RcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIDppZD1cXFwiYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwnY2MnKVxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIiBzdHlsZT1cXFwid2lkdGg6IDIwMHB4XFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0T3BCdXR0b25Db250YWluZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2luZ2xlLW9wLWJ1dHRvblxcXCIgdGl0bGU9XFxcIlxcdTZERkJcXHU1MkEwXFx1NEVCQVxcdTU0NThcXFwiIEBjbGljaz1cXFwiYWRkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCdjYycpXFxcIj48SWNvbiB0eXBlPVxcXCJtZC1hcnJvdy1yb3VuZC1mb3J3YXJkXFxcIiAvPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2luZ2xlLW9wLWJ1dHRvblxcXCIgdGl0bGU9XFxcIlxcdTZFMDVcXHU3QTdBXFx1NURGMlxcdTkwMDlcXHU0RUJBXFx1NTQ1OFxcXCI+PEljb24gdHlwZT1cXFwibWQtYmFja3NwYWNlXFxcIiAvPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0ZWRVc2VyTGlzdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSBoZWlnaHQ9XFxcIjMyN1xcXCIgd2lkdGg9XFxcIjI2MFxcXCIgc3RyaXBlIDpjb2x1bW5zPVxcXCJzZWxlY3RlZFJlY2VpdmVyLmNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJzZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSB8IGZpbHRlclJlY2VpdmVyRGF0YShmbG93Tm9kZUVudGl0eSwgJ2NjJylcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90LXNjb3BlPVxcXCJ7IHJvdywgaW5kZXggfVxcXCIgc2xvdD1cXFwiYWN0aW9uXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlzdC1mb250LWljb24tYnV0dG9uLWNsYXNzXFxcIiBAY2xpY2s9XFxcImRlbGV0ZVNlbGVjdGVkUmVjZWl2ZXIoaW5kZXgscm93KVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiB0eXBlPVxcXCJtZC1jbG9zZVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT4gICAgIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3BhbmVsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvY29sbGFwc2U+XFxuICAgICAgICAgICAgICAgICAgICA8L3RhYi1wYW5lPlxcbiAgICAgICAgICAgICAgICA8L3RhYnM+XFxuICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luID0ge1xuICBnZXRIdG1sRWxlbTogZnVuY3Rpb24gZ2V0SHRtbEVsZW0oKSB7XG4gICAgcmV0dXJuIFwiPGRpdiBcXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xfY2F0ZWdvcnk9XFxcIklucHV0Q29udHJvbFxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBpZD1cXFwiZG9jdW1lbnRfY29udGVudF91cGxvYWRfY29udmVydF90b19wZGZfcGx1Z2luXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIGlzX2pidWlsZDRkY19kYXRhPVxcXCJ0cnVlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIGpidWlsZDRkY19jdXN0b209XFxcInRydWVcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cXFwiZG9jdW1lbnRfY29udGVudF91cGxvYWRfY29udmVydF90b19wZGZfcGx1Z2luXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIHNlcmlhbGl6ZT1cXFwiZmFsc2VcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlbmFtZT1cXFwiV0ZEQ1RfRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGQ29udGFpbmVyXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cz1cXFwiZW5hYmxlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgPlxcbiAgICAgICAgICAgICAgICAgICAgXFx1NjcyQVxcdTVGMDBcXHU1M0QxIVxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIjtcbiAgfVxufTsiXX0=
