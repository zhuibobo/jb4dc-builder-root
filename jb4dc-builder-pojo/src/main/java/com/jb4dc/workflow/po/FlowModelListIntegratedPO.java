package com.jb4dc.workflow.po;

import com.jb4dc.workflow.dbentities.ModelGroupEntity;
import com.jb4dc.workflow.dbentities.ModelGroupRefEntity;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;

import java.util.List;

public class FlowModelListIntegratedPO {
    List<ModelIntegratedEntity> modelIntegratedEntityList;
    List<ModelGroupEntity> modelGroupEntityList;
    List<ModelGroupRefEntity> modelGroupRefEntityList;

    public List<ModelIntegratedEntity> getModelIntegratedEntityList() {
        return modelIntegratedEntityList;
    }

    public void setModelIntegratedEntityList(List<ModelIntegratedEntity> modelIntegratedEntityList) {
        this.modelIntegratedEntityList = modelIntegratedEntityList;
    }

    public List<ModelGroupEntity> getModelGroupEntityList() {
        return modelGroupEntityList;
    }

    public void setModelGroupEntityList(List<ModelGroupEntity> modelGroupEntityList) {
        this.modelGroupEntityList = modelGroupEntityList;
    }

    public List<ModelGroupRefEntity> getModelGroupRefEntityList() {
        return modelGroupRefEntityList;
    }

    public void setModelGroupRefEntityList(List<ModelGroupRefEntity> modelGroupRefEntityList) {
        this.modelGroupRefEntityList = modelGroupRefEntityList;
    }
}
