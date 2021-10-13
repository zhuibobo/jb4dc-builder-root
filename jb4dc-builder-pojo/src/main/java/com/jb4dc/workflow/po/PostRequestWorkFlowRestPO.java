package com.jb4dc.workflow.po;

import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.builder.po.formdata.FormRecordDataRelationPO;
import com.jb4dc.workflow.dbentities.ExecutionTaskOpinionEntity;

import java.util.List;

public class PostRequestWorkFlowRestPO {
    private String userId;
    private String organId;
    private String modelReKey;
    private String modelId;
    private String currentNodeKey;
    private String currentNodeName;
    private String actionCode;
    private String currentTaskId;
    private String varsJsonString;
    private String instanceId;
    private String instanceTitle;
    private String instanceDesc;
    private String businessKey;

    FormRecordComplexPO formRecordComplexPO;
    List<ExecutionTaskOpinionEntity> newOpinionEntityList;

    public String getVarsJsonString() {
        return varsJsonString;
    }

    public void setVarsJsonString(String varsJsonString) {
        this.varsJsonString = varsJsonString;
    }

    public String getActionCode() {
        return actionCode;
    }

    public void setActionCode(String actionCode) {
        this.actionCode = actionCode;
    }

    public String getCurrentTaskId() {
        return currentTaskId;
    }

    public void setCurrentTaskId(String currentTaskId) {
        this.currentTaskId = currentTaskId;
    }

    public String getModelReKey() {
        return modelReKey;
    }

    public void setModelReKey(String modelReKey) {
        this.modelReKey = modelReKey;
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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getOrganId() {
        return organId;
    }

    public void setOrganId(String organId) {
        this.organId = organId;
    }

    public String getInstanceId() {
        return instanceId;
    }

    public void setInstanceId(String instanceId) {
        this.instanceId = instanceId;
    }

    public String getModelId() {
        return modelId;
    }

    public void setModelId(String modelId) {
        this.modelId = modelId;
    }

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }

    public String getInstanceTitle() {
        return instanceTitle;
    }

    public void setInstanceTitle(String instanceTitle) {
        this.instanceTitle = instanceTitle;
    }

    public String getInstanceDesc() {
        return instanceDesc;
    }

    public void setInstanceDesc(String instanceDesc) {
        this.instanceDesc = instanceDesc;
    }

    public FormRecordComplexPO getFormRecordComplexPO() {
        return formRecordComplexPO;
    }

    public void setFormRecordComplexPO(FormRecordComplexPO formRecordComplexPO) {
        this.formRecordComplexPO = formRecordComplexPO;
    }

    public List<ExecutionTaskOpinionEntity> getNewOpinionEntityList() {
        return newOpinionEntityList;
    }

    public void setNewOpinionEntityList(List<ExecutionTaskOpinionEntity> newOpinionEntityList) {
        this.newOpinionEntityList = newOpinionEntityList;
    }
}
