package com.jb4dc.workflow.po;

import java.util.List;

public class ModelFilterPO {
    String modelFlowCategory;
    boolean allModelGroup;
    List<ModelGroupFilterPO> selectedModelGroup;
    String userId;
    String organId;
    String linkId;

    public String getModelFlowCategory() {
        return modelFlowCategory;
    }

    public void setModelFlowCategory(String modelFlowCategory) {
        this.modelFlowCategory = modelFlowCategory;
    }

    public boolean isAllModelGroup() {
        return allModelGroup;
    }

    public void setAllModelGroup(boolean allModelGroup) {
        this.allModelGroup = allModelGroup;
    }

    public List<ModelGroupFilterPO> getSelectedModelGroup() {
        return selectedModelGroup;
    }

    public void setSelectedModelGroup(List<ModelGroupFilterPO> selectedModelGroup) {
        this.selectedModelGroup = selectedModelGroup;
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

    public String getLinkId() {
        return linkId;
    }

    public void setLinkId(String linkId) {
        this.linkId = linkId;
    }
}
