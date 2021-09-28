package com.jb4dc.workflow.po;

import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.tools.BaseUtility;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/1/6
 * To change this template use File | Settings | File Templates.
 */
public class FlowModelIntegratedPO extends ModelIntegratedEntity {

    public FlowModelIntegratedPO(){

    }

    private boolean tryDeployment;

    private String operationName;

    private String modelerTemplateContent;

    public boolean isTryDeployment() {
        return tryDeployment;
    }

    public void setTryDeployment(boolean tryDeployment) {
        this.tryDeployment = tryDeployment;
    }

    public String getModelerTemplateContent() {
        return modelerTemplateContent;
    }

    public void setModelerTemplateContent(String modelerTemplateContent) {
        this.modelerTemplateContent = modelerTemplateContent;
    }

    public static ModelIntegratedEntity parseToEntity(FlowModelIntegratedPO po) throws IOException {
        String jsonStr= JsonUtility.toObjectString(po);
        return JsonUtility.toObject(jsonStr, FlowModelIntegratedPO.class);
    }

    public static FlowModelIntegratedPO parseToPO(ModelIntegratedEntity entity) throws IOException {
        String jsonStr= JsonUtility.toObjectString(entity);
        return JsonUtility.toObject(jsonStr, FlowModelIntegratedPO.class);
    }

    public String getOperationName() {
        return operationName;
    }

    public void setOperationName(String operationName) {
        this.operationName = operationName;
    }
}
