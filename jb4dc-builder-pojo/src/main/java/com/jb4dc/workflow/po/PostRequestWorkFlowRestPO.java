package com.jb4dc.workflow.po;

public class PostRequestWorkFlowRestPO {
    private String userId;
    private String organId;
    private String modelReKey;
    private String currentNodeKey;
    private String currentNodeName;
    private String actionCode;
    private String currentTaskId;
    private String varsJsonString;

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
}
