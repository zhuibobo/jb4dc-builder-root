let FlowRuntimePageObject={
    _webFormRTParas:null,
    _formRuntimeInst:null,
    FORM_RUNTIME_CATEGORY_FLOW:"IsDependenceFlow",
    _flowInstanceRuntimePO:null,
    _isCreatedModelerView:false,
    buildPageReadyInnerParas:function (isStartInstanceStatus,recordId,flowInstanceRuntimePO,flowInstanceRuntimePOCacheKey){
        return {
            recordId:recordId,
            formId:flowInstanceRuntimePO.jb4dcFormId,
            currentNodeKey:flowInstanceRuntimePO.currentNodeKey,
            currentNodeName:flowInstanceRuntimePO.currentNodeName,
            modelId:flowInstanceRuntimePO.modelIntegratedEntity.modelId,
            modelReKey:flowInstanceRuntimePO.modelIntegratedEntity.modelReKey,
            currentTaskId:flowInstanceRuntimePO.executionTaskEntity?flowInstanceRuntimePO.executionTaskEntity.extaskId:"",
            flowInstanceRuntimePOCacheKey:flowInstanceRuntimePOCacheKey,
            flowInstanceRuntimePO:flowInstanceRuntimePO,
            isStartInstanceStatus:isStartInstanceStatus,
            jb4dcActions:flowInstanceRuntimePO.jb4dcActions
        }
    },
    pageReadyForStartStatus:function (isStartInstanceStatus,rendererChainCompletedFunc,flowInstanceRuntimePO,flowInstanceRuntimePOCacheKey,pageHostInstance) {
        //debugger;
        this._formRuntimeInst = Object.create(FormRuntime);
        var recordId=StringUtility.Guid();

        var pageReadyInnerParas=this.buildPageReadyInnerParas(isStartInstanceStatus,recordId,flowInstanceRuntimePO,flowInstanceRuntimePOCacheKey);
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
            "CurrentNodeKey":pageReadyInnerParas.currentNodeKey,
            "CurrentNodeName":pageReadyInnerParas.currentNodeName,
            "ModelId":pageReadyInnerParas.modelId,
            "ModelReKey":pageReadyInnerParas.modelReKey,
            "CurrentTaskId":""
        });
        //this._formRuntimeInst.webFormRTParas=webFormRTParas;
        this.rendererActionButtons(
            isStartInstanceStatus,this._formRuntimeInst,pageHostInstance,pageReadyInnerParas);
        return this._formRuntimeInst;
    },
    pageReadyForProcessStatus:function (isStartInstanceStatus,rendererChainCompletedFunc,flowInstanceRuntimePO,flowInstanceRuntimePOCacheKey,pageHostInstance){
        this._formRuntimeInst = Object.create(FormRuntime);
        FlowRuntimePageObject._flowInstanceRuntimePO=flowInstanceRuntimePO;
        var recordId=flowInstanceRuntimePO.instanceEntity.instRuBusinessKey;

        var pageReadyInnerParas=this.buildPageReadyInnerParas(isStartInstanceStatus,recordId,flowInstanceRuntimePO,flowInstanceRuntimePOCacheKey);
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
            "CurrentNodeKey":pageReadyInnerParas.currentNodeKey,
            "CurrentNodeName":pageReadyInnerParas.currentNodeName,
            "ModelId":pageReadyInnerParas.modelId,
            "ModelReKey":pageReadyInnerParas.modelReKey,
            "CurrentTaskId":""
        });
        //this._formRuntimeInst.webFormRTParas=webFormRTParas;1
        this.rendererActionButtons(
            isStartInstanceStatus,this._formRuntimeInst,pageHostInstance,pageReadyInnerParas);
        return this._formRuntimeInst;
    },
    rendererActionButtons:function (isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas) {
        ActionsRuntimeObject.CreateALLActionButton(isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas);
    },
    rendererFlowModeler:function (){

    },
    displayModelerView:function (event,ui) {
        if (!FlowRuntimePageObject._isCreatedModelerView) {
            CreateModelerView(FlowRuntimePageObject._flowInstanceRuntimePO);
            FlowRuntimePageObject._isCreatedModelerView=true;
        }
    },
    preHandleFormHtmlRuntimeFunc:function (sourceRuntimeHtml,formRuntimeInst,propConfig){
        //console.log(sourceRuntimeHtml);
        var flowPageContainer=$("<div>"+sourceRuntimeHtml+"<div>");
        var flowInstanceRuntimePO=propConfig.FlowInstanceRuntimePO;
        //debugger;
        if(flowPageContainer.children("[singlename='WFDCT_TabContainer']").length==0){
            flowPageContainer=$("<div><div class=\"wfdct-tabs-outer-wrap-runtime html-design-theme-default-root-elem-class\" control_category=\"ContainerControl\" desc=\"\" groupname=\"\" id=\"tabs_wrap_518627616\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" name=\"tabs_wrap_518627616\" placeholder=\"\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WFDCT_TabContainer\" status=\"enable\" style=\"\" client_resolve=\"WFDCT_TabContainer\"><div>");
            flowPageContainer.children("[singlename='WFDCT_TabContainer']").append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_form_999\">"+flowInstanceRuntimePO.modelName+"</div>");
            flowPageContainer.children("[singlename='WFDCT_TabContainer']").append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_form_999\">"+sourceRuntimeHtml+"</div>");
        }

        var tabContainer=flowPageContainer.children("[singlename='WFDCT_TabContainer']");

        if(flowInstanceRuntimePO.jb4dcContentDocumentPlugin=="uploadConvertToPDFPlugin"){
            tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_uploadConvertToPDFPlugin_999\">正文</div>");
            tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_uploadConvertToPDFPlugin_999\">" +
                DocumentContentUploadConvertToPDFPlugin.getHtmlElem()+
                "</div>");
        }
        else if(flowInstanceRuntimePO.jb4dcContentDocumentPlugin=="wpsOnlineDocumentPlugin"){
            tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_wpsOnlineDocumentPlugin_999\">正文</div>");
            tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_wpsOnlineDocumentPlugin_999\">未实现</div>");
        }

        tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_modeler_999\">流程图</div>");
        tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_modeler_999\" style='height: calc(100% - 50px);' onActivity=\"FlowRuntimePageObject.displayModelerView\"><div id=\"flow-canvas\" style=\"height:100%;\"></div></div>");
        tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_sequence_999\">顺序图</div>");
        tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_sequence_999\"></div>");
        tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_task_999\">流转信息</div>");
        tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_task_999\"></div>");
        var newRuntimeHtml=flowPageContainer.html();
        //console.log(newRuntimeHtml);
        return newRuntimeHtml;
    }
}