package com.jb4dc.workflow.po;

import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;

public class FlowModelRuntimePO {
    ModelIntegratedEntity modelIntegratedEntity;
    BpmnDefinitions bpmnDefinitions;
    String bpmnXmlContent;
    boolean isStartEvent;

    String currentNodeKey;
    String currentNodeName;

    String jb4dcFormId;
    String jb4dcFormEx1Id;
    String jb4dcOuterFormUrl;
    String jb4dcOuterFormEx1Url;
    String jb4dcUseContentDocument;
    String jb4dcContentDocumentPlugin;
    String jb4dcContentDocumentRedHeadTemplate;
    String jb4dcProcessTitleEditText;
    String jb4dcProcessTitleEditValue;
    String jb4dcProcessDescriptionEditText;
    String jb4dcProcessDescriptionEditValue;
    String jb4dcProcessActionConfirm;

    public String getBpmnXmlContent() {
        return bpmnXmlContent;
    }

    public void setBpmnXmlContent(String bpmnXmlContent) {
        this.bpmnXmlContent = bpmnXmlContent;
    }

    public ModelIntegratedEntity getModelIntegratedEntity() {
        return modelIntegratedEntity;
    }

    public void setModelIntegratedEntity(ModelIntegratedEntity modelIntegratedEntity) {
        this.modelIntegratedEntity = modelIntegratedEntity;
    }

    public BpmnDefinitions getBpmnDefinitions() {
        return bpmnDefinitions;
    }

    public void setBpmnDefinitions(BpmnDefinitions bpmnDefinitions) {
        this.bpmnDefinitions = bpmnDefinitions;
    }

    public boolean isStartEvent() {
        return isStartEvent;
    }

    public void setStartEvent(boolean startEvent) {
        isStartEvent = startEvent;
    }

    public String getCurrentNodeKey() {
        return currentNodeKey;
    }

    public void setCurrentNodeKey(String currentNodeKey) {
        this.currentNodeKey = currentNodeKey;
    }

    public String getCurrentNodeName() {
        return currentNodeName;
    }

    public void setCurrentNodeName(String currentNodeName) {
        this.currentNodeName = currentNodeName;
    }

    public String getJb4dcFormId() {
        return jb4dcFormId;
    }

    public void setJb4dcFormId(String jb4dcFormId) {
        this.jb4dcFormId = jb4dcFormId;
    }

    public String getJb4dcFormEx1Id() {
        return jb4dcFormEx1Id;
    }

    public void setJb4dcFormEx1Id(String jb4dcFormEx1Id) {
        this.jb4dcFormEx1Id = jb4dcFormEx1Id;
    }

    public String getJb4dcOuterFormUrl() {
        return jb4dcOuterFormUrl;
    }

    public void setJb4dcOuterFormUrl(String jb4dcOuterFormUrl) {
        this.jb4dcOuterFormUrl = jb4dcOuterFormUrl;
    }

    public String getJb4dcOuterFormEx1Url() {
        return jb4dcOuterFormEx1Url;
    }

    public void setJb4dcOuterFormEx1Url(String jb4dcOuterFormEx1Url) {
        this.jb4dcOuterFormEx1Url = jb4dcOuterFormEx1Url;
    }

    public String getJb4dcUseContentDocument() {
        return jb4dcUseContentDocument;
    }

    public void setJb4dcUseContentDocument(String jb4dcUseContentDocument) {
        this.jb4dcUseContentDocument = jb4dcUseContentDocument;
    }

    public String getJb4dcContentDocumentPlugin() {
        return jb4dcContentDocumentPlugin;
    }

    public void setJb4dcContentDocumentPlugin(String jb4dcContentDocumentPlugin) {
        this.jb4dcContentDocumentPlugin = jb4dcContentDocumentPlugin;
    }

    public String getJb4dcContentDocumentRedHeadTemplate() {
        return jb4dcContentDocumentRedHeadTemplate;
    }

    public void setJb4dcContentDocumentRedHeadTemplate(String jb4dcContentDocumentRedHeadTemplate) {
        this.jb4dcContentDocumentRedHeadTemplate = jb4dcContentDocumentRedHeadTemplate;
    }

    public String getJb4dcProcessTitleEditText() {
        return jb4dcProcessTitleEditText;
    }

    public void setJb4dcProcessTitleEditText(String jb4dcProcessTitleEditText) {
        this.jb4dcProcessTitleEditText = jb4dcProcessTitleEditText;
    }

    public String getJb4dcProcessTitleEditValue() {
        return jb4dcProcessTitleEditValue;
    }

    public void setJb4dcProcessTitleEditValue(String jb4dcProcessTitleEditValue) {
        this.jb4dcProcessTitleEditValue = jb4dcProcessTitleEditValue;
    }

    public String getJb4dcProcessDescriptionEditText() {
        return jb4dcProcessDescriptionEditText;
    }

    public void setJb4dcProcessDescriptionEditText(String jb4dcProcessDescriptionEditText) {
        this.jb4dcProcessDescriptionEditText = jb4dcProcessDescriptionEditText;
    }

    public String getJb4dcProcessDescriptionEditValue() {
        return jb4dcProcessDescriptionEditValue;
    }

    public void setJb4dcProcessDescriptionEditValue(String jb4dcProcessDescriptionEditValue) {
        this.jb4dcProcessDescriptionEditValue = jb4dcProcessDescriptionEditValue;
    }

    public String getJb4dcProcessActionConfirm() {
        return jb4dcProcessActionConfirm;
    }

    public void setJb4dcProcessActionConfirm(String jb4dcProcessActionConfirm) {
        this.jb4dcProcessActionConfirm = jb4dcProcessActionConfirm;
    }
}
