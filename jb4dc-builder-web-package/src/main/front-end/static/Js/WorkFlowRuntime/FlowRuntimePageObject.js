let FlowRuntimePageObject={
    _webFormRTParas:null,
    _formRuntimeInst:null,
    FORM_RUNTIME_CATEGORY_FLOW:"IsDependenceFlow",
    pageReadyForStartStatus:function (isPreview,rendererChainCompletedFunc,flowModelRuntimePO) {
        //debugger;
        this._formRuntimeInst = Object.create(FormRuntime);
        //var webFormRTParas=this.getWebFormRTParas();
        //var webFormRTParas=getWebFormRTParasFunc.call(this);
        this._formRuntimeInst.Initialization({
            "RendererToId": "htmlDesignRuntimeWrap",
            "FormId":flowModelRuntimePO.jb4dcFormId,
            "RecordId":"",
            "ButtonId":"",
            "OperationType":BaseUtility.GetAddOperationName(),
            "IsPreview":isPreview,
            "RendererChainCompletedFunc":rendererChainCompletedFunc,
            "ListFormButtonElemId":"",
            "WebFormRTParas": {},
            "FormRuntimeCategory":FlowRuntimePageObject.FORM_RUNTIME_CATEGORY_FLOW,
            "PreHandleFormHtmlRuntimeFunc":this.preHandleFormHtmlRuntimeFunc,
            "flowModelRuntimePO":flowModelRuntimePO
        });
        //this._formRuntimeInst.webFormRTParas=webFormRTParas;
        return this._formRuntimeInst;
    },
    preHandleFormHtmlRuntimeFunc:function (sourceRuntimeHtml,formRuntimeInst,propConfig){
        console.log(sourceRuntimeHtml);
        var flowPageContainer=$("<div>"+sourceRuntimeHtml+"/<div>");
        var flowModelRuntimePO=propConfig.flowModelRuntimePO;
        //debugger;
        if(flowPageContainer.children("[singlename='WFDCT_TabContainer']").length==0){
            flowPageContainer=$("<div><div class=\"wfdct-tabs-outer-wrap-runtime html-design-theme-default-root-elem-class\" control_category=\"ContainerControl\" desc=\"\" groupname=\"\" id=\"tabs_wrap_518627616\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" name=\"tabs_wrap_518627616\" placeholder=\"\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WFDCT_TabContainer\" status=\"enable\" style=\"\" client_resolve=\"WFDCT_TabContainer\"><div>");
            flowPageContainer.children("[singlename='WFDCT_TabContainer']").append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_form_999\">"+flowModelRuntimePO.modelName+"</div>");
            flowPageContainer.children("[singlename='WFDCT_TabContainer']").append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_form_999\">"+sourceRuntimeHtml+"</div>");
        }

        var tabContainer=flowPageContainer.children("[singlename='WFDCT_TabContainer']");

        if(flowModelRuntimePO.jb4dcContentDocumentPlugin=="uploadConvertToPDFPlugin"){
            tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_uploadConvertToPDFPlugin_999\">正文</div>");
            tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_uploadConvertToPDFPlugin_999\">" +
                DocumentContentUploadConvertToPDFPlugin.getHtmlElem()+
                "</div>");
        }
        else if(flowModelRuntimePO.jb4dcContentDocumentPlugin=="wpsOnlineDocumentPlugin"){
            tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_wpsOnlineDocumentPlugin_999\">正文</div>");
            tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_wpsOnlineDocumentPlugin_999\">未实现</div>");
        }

        tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_modeler_999\">流程图</div>");
        tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_modeler_999\"></div>");
        tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_sequence_999\">顺序图</div>");
        tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_sequence_999\"></div>");
        tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_task_999\">流转信息</div>");
        tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_task_999\"></div>");
        var newRuntimeHtml=flowPageContainer.html();
        console.log(newRuntimeHtml);
        return newRuntimeHtml;
    }
}