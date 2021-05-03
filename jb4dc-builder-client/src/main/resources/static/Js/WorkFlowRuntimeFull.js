"use strict";
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

    return this._formRuntimeInst;
  },
  preHandleFormHtmlRuntimeFunc: function preHandleFormHtmlRuntimeFunc(sourceRuntimeHtml, formRuntimeInst, propConfig) {
    console.log(sourceRuntimeHtml);
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
    console.log(newRuntimeHtml);
    return newRuntimeHtml;
  }
};
"use strict";
"use strict";
"use strict";
"use strict";
"use strict";
"use strict";

var DocumentContentUploadConvertToPDFPlugin = {
  getHtmlElem: function getHtmlElem() {
    return "<div \n                    control_category=\"InputControl\" \n                    id=\"document_content_upload_convert_to_pdf_plugin\" \n                    is_jbuild4dc_data=\"true\" \n                    jbuild4dc_custom=\"true\" \n                    name=\"document_content_upload_convert_to_pdf_plugin\" \n                    serialize=\"false\" \n                    singlename=\"WFDCT_DocumentContentUploadConvertToPDFContainer\" \n                    status=\"enable\" \n                    style=\"\" \n                    >\n                    \u672A\u5F00\u53D1!\n                </div>";
  }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGlvbnNSdW50aW1lT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVQYWdlT2JqZWN0LmpzIiwiQWN0aW9ucy9DYWxsQmFja0FjdGlvbi5qcyIsIkFjdGlvbnMvSnVtcFRvQW55Tm9kZUFjdGlvbi5qcyIsIkFjdGlvbnMvUmVCb290SW5zdGFuY2VBY3Rpb24uanMiLCJBY3Rpb25zL1NlbmRBY3Rpb24uanMiLCJBY3Rpb25zL1RlbXBTYXZlQWN0aW9uLmpzIiwiUGx1Z2lucy9Eb2N1bWVudENvbnRlbnRVcGxvYWRDb252ZXJ0VG9QREZQbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQ0FBO0FDQUE7QUNBQTtBQ0FBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiV29ya0Zsb3dSdW50aW1lRnVsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRmxvd1J1bnRpbWVQYWdlT2JqZWN0ID0ge1xuICBfd2ViRm9ybVJUUGFyYXM6IG51bGwsXG4gIF9mb3JtUnVudGltZUluc3Q6IG51bGwsXG4gIEZPUk1fUlVOVElNRV9DQVRFR09SWV9GTE9XOiBcIklzRGVwZW5kZW5jZUZsb3dcIixcbiAgcGFnZVJlYWR5Rm9yU3RhcnRTdGF0dXM6IGZ1bmN0aW9uIHBhZ2VSZWFkeUZvclN0YXJ0U3RhdHVzKGlzUHJldmlldywgcmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmMsIGZsb3dNb2RlbFJ1bnRpbWVQTykge1xuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdCA9IE9iamVjdC5jcmVhdGUoRm9ybVJ1bnRpbWUpO1xuXG4gICAgdGhpcy5fZm9ybVJ1bnRpbWVJbnN0LkluaXRpYWxpemF0aW9uKHtcbiAgICAgIFwiUmVuZGVyZXJUb0lkXCI6IFwiaHRtbERlc2lnblJ1bnRpbWVXcmFwXCIsXG4gICAgICBcIkZvcm1JZFwiOiBmbG93TW9kZWxSdW50aW1lUE8uamI0ZGNGb3JtSWQsXG4gICAgICBcIlJlY29yZElkXCI6IFwiXCIsXG4gICAgICBcIkJ1dHRvbklkXCI6IFwiXCIsXG4gICAgICBcIk9wZXJhdGlvblR5cGVcIjogQmFzZVV0aWxpdHkuR2V0QWRkT3BlcmF0aW9uTmFtZSgpLFxuICAgICAgXCJJc1ByZXZpZXdcIjogaXNQcmV2aWV3LFxuICAgICAgXCJSZW5kZXJlckNoYWluQ29tcGxldGVkRnVuY1wiOiByZW5kZXJlckNoYWluQ29tcGxldGVkRnVuYyxcbiAgICAgIFwiTGlzdEZvcm1CdXR0b25FbGVtSWRcIjogXCJcIixcbiAgICAgIFwiV2ViRm9ybVJUUGFyYXNcIjoge30sXG4gICAgICBcIkZvcm1SdW50aW1lQ2F0ZWdvcnlcIjogRmxvd1J1bnRpbWVQYWdlT2JqZWN0LkZPUk1fUlVOVElNRV9DQVRFR09SWV9GTE9XLFxuICAgICAgXCJQcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jXCI6IHRoaXMucHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuYyxcbiAgICAgIFwiZmxvd01vZGVsUnVudGltZVBPXCI6IGZsb3dNb2RlbFJ1bnRpbWVQT1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1SdW50aW1lSW5zdDtcbiAgfSxcbiAgcHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuYzogZnVuY3Rpb24gcHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuYyhzb3VyY2VSdW50aW1lSHRtbCwgZm9ybVJ1bnRpbWVJbnN0LCBwcm9wQ29uZmlnKSB7XG4gICAgY29uc29sZS5sb2coc291cmNlUnVudGltZUh0bWwpO1xuICAgIHZhciBmbG93UGFnZUNvbnRhaW5lciA9ICQoXCI8ZGl2PlwiICsgc291cmNlUnVudGltZUh0bWwgKyBcIi88ZGl2PlwiKTtcbiAgICB2YXIgZmxvd01vZGVsUnVudGltZVBPID0gcHJvcENvbmZpZy5mbG93TW9kZWxSdW50aW1lUE87XG5cbiAgICBpZiAoZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIikubGVuZ3RoID09IDApIHtcbiAgICAgIGZsb3dQYWdlQ29udGFpbmVyID0gJChcIjxkaXY+PGRpdiBjbGFzcz1cXFwid2ZkY3QtdGFicy1vdXRlci13cmFwLXJ1bnRpbWUgaHRtbC1kZXNpZ24tdGhlbWUtZGVmYXVsdC1yb290LWVsZW0tY2xhc3NcXFwiIGNvbnRyb2xfY2F0ZWdvcnk9XFxcIkNvbnRhaW5lckNvbnRyb2xcXFwiIGRlc2M9XFxcIlxcXCIgZ3JvdXBuYW1lPVxcXCJcXFwiIGlkPVxcXCJ0YWJzX3dyYXBfNTE4NjI3NjE2XFxcIiBpc19qYnVpbGQ0ZGNfZGF0YT1cXFwiZmFsc2VcXFwiIGpidWlsZDRkY19jdXN0b209XFxcInRydWVcXFwiIG5hbWU9XFxcInRhYnNfd3JhcF81MTg2Mjc2MTZcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiIHNlcmlhbGl6ZT1cXFwiZmFsc2VcXFwiIHNob3dfcmVtb3ZlX2J1dHRvbj1cXFwiZmFsc2VcXFwiIHNpbmdsZW5hbWU9XFxcIldGRENUX1RhYkNvbnRhaW5lclxcXCIgc3RhdHVzPVxcXCJlbmFibGVcXFwiIHN0eWxlPVxcXCJcXFwiIGNsaWVudF9yZXNvbHZlPVxcXCJXRkRDVF9UYWJDb250YWluZXJcXFwiPjxkaXY+XCIpO1xuICAgICAgZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIikuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X2Zvcm1fOTk5XFxcIj5cIiArIGZsb3dNb2RlbFJ1bnRpbWVQTy5tb2RlbE5hbWUgKyBcIjwvZGl2PlwiKTtcbiAgICAgIGZsb3dQYWdlQ29udGFpbmVyLmNoaWxkcmVuKFwiW3NpbmdsZW5hbWU9J1dGRENUX1RhYkNvbnRhaW5lciddXCIpLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd19mb3JtXzk5OVxcXCI+XCIgKyBzb3VyY2VSdW50aW1lSHRtbCArIFwiPC9kaXY+XCIpO1xuICAgIH1cblxuICAgIHZhciB0YWJDb250YWluZXIgPSBmbG93UGFnZUNvbnRhaW5lci5jaGlsZHJlbihcIltzaW5nbGVuYW1lPSdXRkRDVF9UYWJDb250YWluZXInXVwiKTtcblxuICAgIGlmIChmbG93TW9kZWxSdW50aW1lUE8uamI0ZGNDb250ZW50RG9jdW1lbnRQbHVnaW4gPT0gXCJ1cGxvYWRDb252ZXJ0VG9QREZQbHVnaW5cIikge1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfdXBsb2FkQ29udmVydFRvUERGUGx1Z2luXzk5OVxcXCI+5q2j5paHPC9kaXY+XCIpO1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfdXBsb2FkQ29udmVydFRvUERGUGx1Z2luXzk5OVxcXCI+XCIgKyBEb2N1bWVudENvbnRlbnRVcGxvYWRDb252ZXJ0VG9QREZQbHVnaW4uZ2V0SHRtbEVsZW0oKSArIFwiPC9kaXY+XCIpO1xuICAgIH0gZWxzZSBpZiAoZmxvd01vZGVsUnVudGltZVBPLmpiNGRjQ29udGVudERvY3VtZW50UGx1Z2luID09IFwid3BzT25saW5lRG9jdW1lbnRQbHVnaW5cIikge1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfd3BzT25saW5lRG9jdW1lbnRQbHVnaW5fOTk5XFxcIj7mraPmloc8L2Rpdj5cIik7XG4gICAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF93cHNPbmxpbmVEb2N1bWVudFBsdWdpbl85OTlcXFwiPuacquWunueOsDwvZGl2PlwiKTtcbiAgICB9XG5cbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X21vZGVsZXJfOTk5XFxcIj7mtYHnqIvlm748L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd19tb2RlbGVyXzk5OVxcXCI+PC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfc2VxdWVuY2VfOTk5XFxcIj7pobrluo/lm748L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd19zZXF1ZW5jZV85OTlcXFwiPjwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X3Rhc2tfOTk5XFxcIj7mtYHovazkv6Hmga88L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd190YXNrXzk5OVxcXCI+PC9kaXY+XCIpO1xuICAgIHZhciBuZXdSdW50aW1lSHRtbCA9IGZsb3dQYWdlQ29udGFpbmVyLmh0bWwoKTtcbiAgICBjb25zb2xlLmxvZyhuZXdSdW50aW1lSHRtbCk7XG4gICAgcmV0dXJuIG5ld1J1bnRpbWVIdG1sO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luID0ge1xuICBnZXRIdG1sRWxlbTogZnVuY3Rpb24gZ2V0SHRtbEVsZW0oKSB7XG4gICAgcmV0dXJuIFwiPGRpdiBcXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xfY2F0ZWdvcnk9XFxcIklucHV0Q29udHJvbFxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBpZD1cXFwiZG9jdW1lbnRfY29udGVudF91cGxvYWRfY29udmVydF90b19wZGZfcGx1Z2luXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIGlzX2pidWlsZDRkY19kYXRhPVxcXCJ0cnVlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIGpidWlsZDRkY19jdXN0b209XFxcInRydWVcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cXFwiZG9jdW1lbnRfY29udGVudF91cGxvYWRfY29udmVydF90b19wZGZfcGx1Z2luXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIHNlcmlhbGl6ZT1cXFwiZmFsc2VcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlbmFtZT1cXFwiV0ZEQ1RfRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGQ29udGFpbmVyXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cz1cXFwiZW5hYmxlXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPVxcXCJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgPlxcbiAgICAgICAgICAgICAgICAgICAgXFx1NjcyQVxcdTVGMDBcXHU1M0QxIVxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIjtcbiAgfVxufTsiXX0=
