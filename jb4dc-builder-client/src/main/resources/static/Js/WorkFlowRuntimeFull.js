"use strict";

var ActionsRuntimeObject = {
  CreateALLActionButton: function CreateALLActionButton(flowModelRuntimePO, jb4dcActions, formRuntimeInst) {
    if (jb4dcActions && jb4dcActions.jb4dcActionList) {
      var buttonElem;

      for (var i = 0; i < jb4dcActions.jb4dcActionList.length; i++) {
        var actionObj = jb4dcActions.jb4dcActionList[i];

        if (actionObj.juelRunResultPO.booleanResult) {
          if (actionObj.actionType == "send") {
            var sendActionObject = Object.create(WorkFlowSendActionObject);
            buttonElem = sendActionObject.Instance(flowModelRuntimePO, jb4dcActions, formRuntimeInst, actionObj);
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
  pageReadyForStartStatus: function pageReadyForStartStatus(isPreview, rendererChainCompletedFunc, flowModelRuntimePO) {
    this._formRuntimeInst = Object.create(FormRuntime);

    this._formRuntimeInst.Initialization({
      "RendererToId": "htmlDesignRuntimeWrap",
      "FormId": flowModelRuntimePO.jb4dcFormId,
      "RecordId": "",
      "ButtonId": "",
      "OperationType": BaseUtility.GetAddOperationName(),
      "IsPreview": isPreview,
      "RendererChainCompletedFunc": rendererChainCompletedFunc,
      "ListFormButtonElemId": "",
      "WebFormRTParas": {},
      "FormRuntimeCategory": FlowRuntimePageObject.FORM_RUNTIME_CATEGORY_FLOW,
      "PreHandleFormHtmlRuntimeFunc": this.preHandleFormHtmlRuntimeFunc,
      "flowModelRuntimePO": flowModelRuntimePO
    });

    this.rendererActionButtons(flowModelRuntimePO, this._formRuntimeInst);
    return this._formRuntimeInst;
  },
  rendererActionButtons: function rendererActionButtons(flowModelRuntimePO, formRuntimeInst) {
    ActionsRuntimeObject.CreateALLActionButton(flowModelRuntimePO, flowModelRuntimePO.jb4dcActions, formRuntimeInst);
  },
  preHandleFormHtmlRuntimeFunc: function preHandleFormHtmlRuntimeFunc(sourceRuntimeHtml, formRuntimeInst, propConfig) {
    var flowPageContainer = $("<div>" + sourceRuntimeHtml + "/<div>");
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
"use strict";
"use strict";
"use strict";
"use strict";

var WorkFlowSendActionObject = {
  Instance: function Instance(flowModelRuntimePO, jb4dcActions, formRuntimeInst, actionObj) {
    console.log(actionObj);
    var htmlId = actionObj.actionHTMLId ? actionObj.actionHTMLId : actionObj.actionCode;
    var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');
    elem.bind("click", {
      "flowModelRuntimePO": flowModelRuntimePO,
      "jb4dcActions": jb4dcActions,
      "formRuntimeInst": formRuntimeInst,
      "actionObj": actionObj,
      "_this": this
    }, this.ButtonClickEvent);
    return {
      elem: elem
    };
  },
  ButtonClickEvent: function ButtonClickEvent(sender) {
    var _prop = sender.data;
    console.log(_prop);
  }
};
"use strict";

var DocumentContentUploadConvertToPDFPlugin = {
  getHtmlElem: function getHtmlElem() {
    return "<div \n                    control_category=\"InputControl\" \n                    id=\"document_content_upload_convert_to_pdf_plugin\" \n                    is_jbuild4dc_data=\"true\" \n                    jbuild4dc_custom=\"true\" \n                    name=\"document_content_upload_convert_to_pdf_plugin\" \n                    serialize=\"false\" \n                    singlename=\"WFDCT_DocumentContentUploadConvertToPDFContainer\" \n                    status=\"enable\" \n                    style=\"\" \n                    >\n                    \u672A\u5F00\u53D1!\n                </div>";
  }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGlvbnNSdW50aW1lT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVQYWdlT2JqZWN0LmpzIiwiQWN0aW9ucy9DYWxsQmFja0FjdGlvbi5qcyIsIkFjdGlvbnMvSnVtcFRvQW55Tm9kZUFjdGlvbi5qcyIsIkFjdGlvbnMvUmVCb290SW5zdGFuY2VBY3Rpb24uanMiLCJBY3Rpb25zL1RlbXBTYXZlQWN0aW9uLmpzIiwiQWN0aW9ucy9Xb3JrRmxvd1NlbmRBY3Rpb25PYmplY3QuanMiLCJQbHVnaW5zL0RvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERlBsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUNBQTtBQ0FBO0FDQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IldvcmtGbG93UnVudGltZUZ1bGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIEFjdGlvbnNSdW50aW1lT2JqZWN0ID0ge1xuICBDcmVhdGVBTExBY3Rpb25CdXR0b246IGZ1bmN0aW9uIENyZWF0ZUFMTEFjdGlvbkJ1dHRvbihmbG93TW9kZWxSdW50aW1lUE8sIGpiNGRjQWN0aW9ucywgZm9ybVJ1bnRpbWVJbnN0KSB7XG4gICAgaWYgKGpiNGRjQWN0aW9ucyAmJiBqYjRkY0FjdGlvbnMuamI0ZGNBY3Rpb25MaXN0KSB7XG4gICAgICB2YXIgYnV0dG9uRWxlbTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBqYjRkY0FjdGlvbnMuamI0ZGNBY3Rpb25MaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhY3Rpb25PYmogPSBqYjRkY0FjdGlvbnMuamI0ZGNBY3Rpb25MaXN0W2ldO1xuXG4gICAgICAgIGlmIChhY3Rpb25PYmouanVlbFJ1blJlc3VsdFBPLmJvb2xlYW5SZXN1bHQpIHtcbiAgICAgICAgICBpZiAoYWN0aW9uT2JqLmFjdGlvblR5cGUgPT0gXCJzZW5kXCIpIHtcbiAgICAgICAgICAgIHZhciBzZW5kQWN0aW9uT2JqZWN0ID0gT2JqZWN0LmNyZWF0ZShXb3JrRmxvd1NlbmRBY3Rpb25PYmplY3QpO1xuICAgICAgICAgICAgYnV0dG9uRWxlbSA9IHNlbmRBY3Rpb25PYmplY3QuSW5zdGFuY2UoZmxvd01vZGVsUnVudGltZVBPLCBqYjRkY0FjdGlvbnMsIGZvcm1SdW50aW1lSW5zdCwgYWN0aW9uT2JqKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkKFwiI2Zsb3dXb3JrQWN0aW9uQnV0dG9uV3JhcE91dGVyXCIpLmFwcGVuZChidXR0b25FbGVtLmVsZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBHZXRBY3Rpb25PYmo6IGZ1bmN0aW9uIEdldEFjdGlvbk9iaigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWN0aW9uQXV0b1NlbmQ6IFwiZmFsc2VcIixcbiAgICAgIGFjdGlvbkNDUmVjZWl2ZU9iamVjdHM6IFwiW11cIixcbiAgICAgIGFjdGlvbkNhbGxBcGlzOiBcIltdXCIsXG4gICAgICBhY3Rpb25DYWxsQ29tcGxldGU6IFwidHJ1ZVwiLFxuICAgICAgYWN0aW9uQ2FsbEpzTWV0aG9kOiBudWxsLFxuICAgICAgYWN0aW9uQ2FwdGlvbjogXCLojYnnqL9cIixcbiAgICAgIGFjdGlvbkNvZGU6IFwiYWN0aW9uXzUxNjAwOTc3NVwiLFxuICAgICAgYWN0aW9uQ29uZmlybTogXCJmYWxzZVwiLFxuICAgICAgYWN0aW9uRGlzcGxheUNvbmRpdGlvbkVkaXRUZXh0OiBudWxsLFxuICAgICAgYWN0aW9uRGlzcGxheUNvbmRpdGlvbkVkaXRWYWx1ZTogbnVsbCxcbiAgICAgIGFjdGlvbkV4ZWN1dGVWYXJpYWJsZXM6IFwiW11cIixcbiAgICAgIGFjdGlvbkhUTUxDbGFzczogbnVsbCxcbiAgICAgIGFjdGlvbkhUTUxJZDogbnVsbCxcbiAgICAgIGFjdGlvbk1haW5SZWNlaXZlT2JqZWN0czogXCJbXVwiLFxuICAgICAgYWN0aW9uUnVuU3FsczogXCJbXVwiLFxuICAgICAgYWN0aW9uU2VuZE1lc3NhZ2VJZDogbnVsbCxcbiAgICAgIGFjdGlvblNlbmRTaWduYWxJZDogbnVsbCxcbiAgICAgIGFjdGlvblNob3dPcGluaW9uRGlhbG9nOiBcImZhbHNlXCIsXG4gICAgICBhY3Rpb25UeXBlOiBcInNlbmRcIixcbiAgICAgIGFjdGlvblVwZGF0ZUZpZWxkczogXCJbXVwiLFxuICAgICAgYWN0aW9uVmFsaWRhdGU6IFwi5pegXCIsXG4gICAgICBhY3Rpb25zT3BpbmlvbkJpbmRUb0VsZW1JZDogbnVsbCxcbiAgICAgIGFjdGlvbnNPcGluaW9uQmluZFRvRmllbGQ6IG51bGwsXG4gICAgICBqdWVsUnVuUmVzdWx0UE86IHtcbiAgICAgICAgYm9vbGVhblJlc3VsdDogdHJ1ZSxcbiAgICAgICAgbWVzc2FnZTogXCJcIixcbiAgICAgICAgc3RyaW5nUmVzdWx0OiBcIlwiLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9XG4gICAgfTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEZsb3dSdW50aW1lUGFnZU9iamVjdCA9IHtcbiAgX3dlYkZvcm1SVFBhcmFzOiBudWxsLFxuICBfZm9ybVJ1bnRpbWVJbnN0OiBudWxsLFxuICBGT1JNX1JVTlRJTUVfQ0FURUdPUllfRkxPVzogXCJJc0RlcGVuZGVuY2VGbG93XCIsXG4gIHBhZ2VSZWFkeUZvclN0YXJ0U3RhdHVzOiBmdW5jdGlvbiBwYWdlUmVhZHlGb3JTdGFydFN0YXR1cyhpc1ByZXZpZXcsIHJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jLCBmbG93TW9kZWxSdW50aW1lUE8pIHtcbiAgICB0aGlzLl9mb3JtUnVudGltZUluc3QgPSBPYmplY3QuY3JlYXRlKEZvcm1SdW50aW1lKTtcblxuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdC5Jbml0aWFsaXphdGlvbih7XG4gICAgICBcIlJlbmRlcmVyVG9JZFwiOiBcImh0bWxEZXNpZ25SdW50aW1lV3JhcFwiLFxuICAgICAgXCJGb3JtSWRcIjogZmxvd01vZGVsUnVudGltZVBPLmpiNGRjRm9ybUlkLFxuICAgICAgXCJSZWNvcmRJZFwiOiBcIlwiLFxuICAgICAgXCJCdXR0b25JZFwiOiBcIlwiLFxuICAgICAgXCJPcGVyYXRpb25UeXBlXCI6IEJhc2VVdGlsaXR5LkdldEFkZE9wZXJhdGlvbk5hbWUoKSxcbiAgICAgIFwiSXNQcmV2aWV3XCI6IGlzUHJldmlldyxcbiAgICAgIFwiUmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmNcIjogcmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmMsXG4gICAgICBcIkxpc3RGb3JtQnV0dG9uRWxlbUlkXCI6IFwiXCIsXG4gICAgICBcIldlYkZvcm1SVFBhcmFzXCI6IHt9LFxuICAgICAgXCJGb3JtUnVudGltZUNhdGVnb3J5XCI6IEZsb3dSdW50aW1lUGFnZU9iamVjdC5GT1JNX1JVTlRJTUVfQ0FURUdPUllfRkxPVyxcbiAgICAgIFwiUHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuY1wiOiB0aGlzLnByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmMsXG4gICAgICBcImZsb3dNb2RlbFJ1bnRpbWVQT1wiOiBmbG93TW9kZWxSdW50aW1lUE9cbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyZXJBY3Rpb25CdXR0b25zKGZsb3dNb2RlbFJ1bnRpbWVQTywgdGhpcy5fZm9ybVJ1bnRpbWVJbnN0KTtcbiAgICByZXR1cm4gdGhpcy5fZm9ybVJ1bnRpbWVJbnN0O1xuICB9LFxuICByZW5kZXJlckFjdGlvbkJ1dHRvbnM6IGZ1bmN0aW9uIHJlbmRlcmVyQWN0aW9uQnV0dG9ucyhmbG93TW9kZWxSdW50aW1lUE8sIGZvcm1SdW50aW1lSW5zdCkge1xuICAgIEFjdGlvbnNSdW50aW1lT2JqZWN0LkNyZWF0ZUFMTEFjdGlvbkJ1dHRvbihmbG93TW9kZWxSdW50aW1lUE8sIGZsb3dNb2RlbFJ1bnRpbWVQTy5qYjRkY0FjdGlvbnMsIGZvcm1SdW50aW1lSW5zdCk7XG4gIH0sXG4gIHByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmM6IGZ1bmN0aW9uIHByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmMoc291cmNlUnVudGltZUh0bWwsIGZvcm1SdW50aW1lSW5zdCwgcHJvcENvbmZpZykge1xuICAgIHZhciBmbG93UGFnZUNvbnRhaW5lciA9ICQoXCI8ZGl2PlwiICsgc291cmNlUnVudGltZUh0bWwgKyBcIi88ZGl2PlwiKTtcbiAgICB2YXIgZmxvd01vZGVsUnVudGltZVBPID0gcHJvcENvbmZpZy5mbG93TW9kZWxSdW50aW1lUE87XG5cbiAgICBpZiAoZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIikubGVuZ3RoID09IDApIHtcbiAgICAgIGZsb3dQYWdlQ29udGFpbmVyID0gJChcIjxkaXY+PGRpdiBjbGFzcz1cXFwid2ZkY3QtdGFicy1vdXRlci13cmFwLXJ1bnRpbWUgaHRtbC1kZXNpZ24tdGhlbWUtZGVmYXVsdC1yb290LWVsZW0tY2xhc3NcXFwiIGNvbnRyb2xfY2F0ZWdvcnk9XFxcIkNvbnRhaW5lckNvbnRyb2xcXFwiIGRlc2M9XFxcIlxcXCIgZ3JvdXBuYW1lPVxcXCJcXFwiIGlkPVxcXCJ0YWJzX3dyYXBfNTE4NjI3NjE2XFxcIiBpc19qYnVpbGQ0ZGNfZGF0YT1cXFwiZmFsc2VcXFwiIGpidWlsZDRkY19jdXN0b209XFxcInRydWVcXFwiIG5hbWU9XFxcInRhYnNfd3JhcF81MTg2Mjc2MTZcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiIHNlcmlhbGl6ZT1cXFwiZmFsc2VcXFwiIHNob3dfcmVtb3ZlX2J1dHRvbj1cXFwiZmFsc2VcXFwiIHNpbmdsZW5hbWU9XFxcIldGRENUX1RhYkNvbnRhaW5lclxcXCIgc3RhdHVzPVxcXCJlbmFibGVcXFwiIHN0eWxlPVxcXCJcXFwiIGNsaWVudF9yZXNvbHZlPVxcXCJXRkRDVF9UYWJDb250YWluZXJcXFwiPjxkaXY+XCIpO1xuICAgICAgZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIikuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X2Zvcm1fOTk5XFxcIj5cIiArIGZsb3dNb2RlbFJ1bnRpbWVQTy5tb2RlbE5hbWUgKyBcIjwvZGl2PlwiKTtcbiAgICAgIGZsb3dQYWdlQ29udGFpbmVyLmNoaWxkcmVuKFwiW3NpbmdsZW5hbWU9J1dGRENUX1RhYkNvbnRhaW5lciddXCIpLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd19mb3JtXzk5OVxcXCI+XCIgKyBzb3VyY2VSdW50aW1lSHRtbCArIFwiPC9kaXY+XCIpO1xuICAgIH1cblxuICAgIHZhciB0YWJDb250YWluZXIgPSBmbG93UGFnZUNvbnRhaW5lci5jaGlsZHJlbihcIltzaW5nbGVuYW1lPSdXRkRDVF9UYWJDb250YWluZXInXVwiKTtcblxuICAgIGlmIChmbG93TW9kZWxSdW50aW1lUE8uamI0ZGNDb250ZW50RG9jdW1lbnRQbHVnaW4gPT0gXCJ1cGxvYWRDb252ZXJ0VG9QREZQbHVnaW5cIikge1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfdXBsb2FkQ29udmVydFRvUERGUGx1Z2luXzk5OVxcXCI+5q2j5paHPC9kaXY+XCIpO1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfdXBsb2FkQ29udmVydFRvUERGUGx1Z2luXzk5OVxcXCI+XCIgKyBEb2N1bWVudENvbnRlbnRVcGxvYWRDb252ZXJ0VG9QREZQbHVnaW4uZ2V0SHRtbEVsZW0oKSArIFwiPC9kaXY+XCIpO1xuICAgIH0gZWxzZSBpZiAoZmxvd01vZGVsUnVudGltZVBPLmpiNGRjQ29udGVudERvY3VtZW50UGx1Z2luID09IFwid3BzT25saW5lRG9jdW1lbnRQbHVnaW5cIikge1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfd3BzT25saW5lRG9jdW1lbnRQbHVnaW5fOTk5XFxcIj7mraPmloc8L2Rpdj5cIik7XG4gICAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF93cHNPbmxpbmVEb2N1bWVudFBsdWdpbl85OTlcXFwiPuacquWunueOsDwvZGl2PlwiKTtcbiAgICB9XG5cbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X21vZGVsZXJfOTk5XFxcIj7mtYHnqIvlm748L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd19tb2RlbGVyXzk5OVxcXCI+PC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfc2VxdWVuY2VfOTk5XFxcIj7pobrluo/lm748L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd19zZXF1ZW5jZV85OTlcXFwiPjwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X3Rhc2tfOTk5XFxcIj7mtYHovazkv6Hmga88L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd190YXNrXzk5OVxcXCI+PC9kaXY+XCIpO1xuICAgIHZhciBuZXdSdW50aW1lSHRtbCA9IGZsb3dQYWdlQ29udGFpbmVyLmh0bWwoKTtcbiAgICByZXR1cm4gbmV3UnVudGltZUh0bWw7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXb3JrRmxvd1NlbmRBY3Rpb25PYmplY3QgPSB7XG4gIEluc3RhbmNlOiBmdW5jdGlvbiBJbnN0YW5jZShmbG93TW9kZWxSdW50aW1lUE8sIGpiNGRjQWN0aW9ucywgZm9ybVJ1bnRpbWVJbnN0LCBhY3Rpb25PYmopIHtcbiAgICBjb25zb2xlLmxvZyhhY3Rpb25PYmopO1xuICAgIHZhciBodG1sSWQgPSBhY3Rpb25PYmouYWN0aW9uSFRNTElkID8gYWN0aW9uT2JqLmFjdGlvbkhUTUxJZCA6IGFjdGlvbk9iai5hY3Rpb25Db2RlO1xuICAgIHZhciBlbGVtID0gJCgnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJvcGVyYXRpb24tYnV0dG9uIG9wZXJhdGlvbi1idXR0b24tcHJpbWFyeVwiIGlkPVwiJyArIGh0bWxJZCArICdcIj48c3Bhbj4nICsgYWN0aW9uT2JqLmFjdGlvbkNhcHRpb24gKyAnPC9zcGFuPjwvYnV0dG9uPicpO1xuICAgIGVsZW0uYmluZChcImNsaWNrXCIsIHtcbiAgICAgIFwiZmxvd01vZGVsUnVudGltZVBPXCI6IGZsb3dNb2RlbFJ1bnRpbWVQTyxcbiAgICAgIFwiamI0ZGNBY3Rpb25zXCI6IGpiNGRjQWN0aW9ucyxcbiAgICAgIFwiZm9ybVJ1bnRpbWVJbnN0XCI6IGZvcm1SdW50aW1lSW5zdCxcbiAgICAgIFwiYWN0aW9uT2JqXCI6IGFjdGlvbk9iaixcbiAgICAgIFwiX3RoaXNcIjogdGhpc1xuICAgIH0sIHRoaXMuQnV0dG9uQ2xpY2tFdmVudCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVsZW06IGVsZW1cbiAgICB9O1xuICB9LFxuICBCdXR0b25DbGlja0V2ZW50OiBmdW5jdGlvbiBCdXR0b25DbGlja0V2ZW50KHNlbmRlcikge1xuICAgIHZhciBfcHJvcCA9IHNlbmRlci5kYXRhO1xuICAgIGNvbnNvbGUubG9nKF9wcm9wKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERlBsdWdpbiA9IHtcbiAgZ2V0SHRtbEVsZW06IGZ1bmN0aW9uIGdldEh0bWxFbGVtKCkge1xuICAgIHJldHVybiBcIjxkaXYgXFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sX2NhdGVnb3J5PVxcXCJJbnB1dENvbnRyb2xcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgaWQ9XFxcImRvY3VtZW50X2NvbnRlbnRfdXBsb2FkX2NvbnZlcnRfdG9fcGRmX3BsdWdpblxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBpc19qYnVpbGQ0ZGNfZGF0YT1cXFwidHJ1ZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBqYnVpbGQ0ZGNfY3VzdG9tPVxcXCJ0cnVlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XFxcImRvY3VtZW50X2NvbnRlbnRfdXBsb2FkX2NvbnZlcnRfdG9fcGRmX3BsdWdpblxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemU9XFxcImZhbHNlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIHNpbmdsZW5hbWU9XFxcIldGRENUX0RvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERkNvbnRhaW5lclxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM9XFxcImVuYWJsZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBzdHlsZT1cXFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgID5cXG4gICAgICAgICAgICAgICAgICAgIFxcdTY3MkFcXHU1RjAwXFx1NTNEMSFcXG4gICAgICAgICAgICAgICAgPC9kaXY+XCI7XG4gIH1cbn07Il19
