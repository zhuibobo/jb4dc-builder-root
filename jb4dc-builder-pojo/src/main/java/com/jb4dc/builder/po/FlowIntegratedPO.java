package com.jb4dc.builder.po;

import com.jb4dc.builder.dbentities.flow.FlowIntegratedEntity;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/1/6
 * To change this template use File | Settings | File Templates.
 */
public class FlowIntegratedPO extends FlowIntegratedEntity {

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
}
