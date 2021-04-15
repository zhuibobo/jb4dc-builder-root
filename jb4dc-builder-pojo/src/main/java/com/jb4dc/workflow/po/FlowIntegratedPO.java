package com.jb4dc.workflow.po;

import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/1/6
 * To change this template use File | Settings | File Templates.
 */
public class FlowIntegratedPO extends ModelIntegratedEntity {

    private String bpmnXMLModeler;

    public String getBpmnXMLModeler() {
        return bpmnXMLModeler;
    }

    public void setBpmnXMLModeler(String bpmnXMLModeler) {
        this.bpmnXMLModeler = bpmnXMLModeler;
    }

    private boolean tryDeployment;

    public boolean isTryDeployment() {
        return tryDeployment;
    }

    public void setTryDeployment(boolean tryDeployment) {
        this.tryDeployment = tryDeployment;
    }

    public static ModelIntegratedEntity parseToEntity(FlowIntegratedPO po) throws IOException {
        String jsonStr= JsonUtility.toObjectString(po);
        return JsonUtility.toObject(jsonStr, FlowIntegratedPO.class);
    }

    public static FlowIntegratedPO parseToPO(ModelIntegratedEntity entity) throws IOException {
        String jsonStr= JsonUtility.toObjectString(entity);
        return JsonUtility.toObject(jsonStr, FlowIntegratedPO.class);
    }
}
