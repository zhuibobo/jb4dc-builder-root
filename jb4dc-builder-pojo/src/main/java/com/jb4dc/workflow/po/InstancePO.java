package com.jb4dc.workflow.po;

import com.jb4dc.workflow.dbentities.ExecutionTaskEntity;
import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;

import java.util.List;

public class InstancePO extends InstanceEntity {
    private ModelIntegratedEntity modelIntegratedEntity;

    private List<ExecutionTaskEntity> activeExecutionTaskEntityList;

    public ModelIntegratedEntity getModelIntegratedEntity() {
        return modelIntegratedEntity;
    }

    public void setModelIntegratedEntity(ModelIntegratedEntity modelIntegratedEntity) {
        this.modelIntegratedEntity = modelIntegratedEntity;
    }

    public List<ExecutionTaskEntity> getActiveExecutionTaskEntityList() {
        return activeExecutionTaskEntityList;
    }

    public void setActiveExecutionTaskEntityList(List<ExecutionTaskEntity> activeExecutionTaskEntityList) {
        this.activeExecutionTaskEntityList = activeExecutionTaskEntityList;
    }
}
