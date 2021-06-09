package com.jb4dc.workflow.po;

import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;

public class InstancePO extends InstanceEntity {
    private ModelIntegratedEntity modelIntegratedEntity;

    public ModelIntegratedEntity getModelIntegratedEntity() {
        return modelIntegratedEntity;
    }

    public void setModelIntegratedEntity(ModelIntegratedEntity modelIntegratedEntity) {
        this.modelIntegratedEntity = modelIntegratedEntity;
    }
}
