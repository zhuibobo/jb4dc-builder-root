package com.jb4dc.builder.workflow.custpo.bpmn.process;

import com.jb4dc.builder.workflow.custpo.bpmn.BpmnNs;

import javax.xml.bind.annotation.*;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/25
 * To change this template use File | Settings | File Templates.
 */
@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "field",namespace = BpmnNs.CAMUNDA_URI)
public class CamundaField {

    @XmlAttribute(name = "name")
    String name;

    @XmlElement(name = "string",namespace = BpmnNs.CAMUNDA_URI)
    CamundaString camundaString;

    @XmlElement(name = "expression",namespace = BpmnNs.CAMUNDA_URI)
    CamundaExpression camundaExpression;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CamundaString getCamundaString() {
        return camundaString;
    }

    public void setCamundaString(CamundaString camundaString) {
        this.camundaString = camundaString;
    }

    public CamundaExpression getCamundaExpression() {
        return camundaExpression;
    }

    public void setCamundaExpression(CamundaExpression camundaExpression) {
        this.camundaExpression = camundaExpression;
    }
}
