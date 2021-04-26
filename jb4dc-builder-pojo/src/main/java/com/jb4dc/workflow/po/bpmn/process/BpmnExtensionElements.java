package com.jb4dc.workflow.po.bpmn.process;

import com.jb4dc.workflow.po.bpmn.BpmnNs;

import javax.xml.bind.annotation.*;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/25
 * To change this template use File | Settings | File Templates.
 */
@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "extensionElements",namespace = BpmnNs.BPMN_URI)
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "camundaExecutionListenerList",
        "camundaProperties",
        "camundaInputOutput",
        "camundaTaskListenerList",
        "jb4dcMainReceiveObjects",
        "jb4dcCCReceiveObjects",
        "jb4dcActions",
        "jb4dcAuthorities"
})
public class BpmnExtensionElements {

    @XmlElement(name = "executionListener",namespace = BpmnNs.CAMUNDA_URI)
    List<CamundaExecutionListener> camundaExecutionListenerList;

    @XmlElement(name = "properties",namespace = BpmnNs.CAMUNDA_URI)
    CamundaProperties camundaProperties;

    @XmlElement(name = "jb4dcMainReceiveObjects",namespace = BpmnNs.JB4DC_URI)
    Jb4dcMainReceiveObjects jb4dcMainReceiveObjects;

    @XmlElement(name = "jb4dcCCReceiveObjects",namespace = BpmnNs.JB4DC_URI)
    Jb4dcMainReceiveObjects jb4dcCCReceiveObjects;

    @XmlElement(name = "jb4dcActions",namespace = BpmnNs.JB4DC_URI)
    Jb4dcActions jb4dcActions;

    @XmlElement(name = "jb4dcAuthorities",namespace = BpmnNs.JB4DC_URI)
    Jb4dcAuthorities jb4dcAuthorities;

    @XmlElement(name = "inputOutput",namespace = BpmnNs.CAMUNDA_URI)
    CamundaInputOutput camundaInputOutput;

    @XmlElement(name = "taskListener",namespace = BpmnNs.CAMUNDA_URI)
    List<CamundaTaskListener> camundaTaskListenerList;

    public List<CamundaExecutionListener> getCamundaExecutionListenerList() {
        return camundaExecutionListenerList;
    }

    public void setCamundaExecutionListenerList(List<CamundaExecutionListener> camundaExecutionListenerList) {
        this.camundaExecutionListenerList = camundaExecutionListenerList;
    }

    public CamundaProperties getCamundaProperties() {
        return camundaProperties;
    }

    public void setCamundaProperties(CamundaProperties camundaProperties) {
        this.camundaProperties = camundaProperties;
    }

    public CamundaInputOutput getCamundaInputOutput() {
        return camundaInputOutput;
    }

    public void setCamundaInputOutput(CamundaInputOutput camundaInputOutput) {
        this.camundaInputOutput = camundaInputOutput;
    }

    public List<CamundaTaskListener> getCamundaTaskListenerList() {
        return camundaTaskListenerList;
    }

    public void setCamundaTaskListenerList(List<CamundaTaskListener> camundaTaskListenerList) {
        this.camundaTaskListenerList = camundaTaskListenerList;
    }

    public Jb4dcMainReceiveObjects getJb4dcMainReceiveObjects() {
        return jb4dcMainReceiveObjects;
    }

    public void setJb4dcMainReceiveObjects(Jb4dcMainReceiveObjects jb4dcMainReceiveObjects) {
        this.jb4dcMainReceiveObjects = jb4dcMainReceiveObjects;
    }

    public Jb4dcMainReceiveObjects getJb4dcCCReceiveObjects() {
        return jb4dcCCReceiveObjects;
    }

    public void setJb4dcCCReceiveObjects(Jb4dcMainReceiveObjects jb4dcCCReceiveObjects) {
        this.jb4dcCCReceiveObjects = jb4dcCCReceiveObjects;
    }

    public Jb4dcActions getJb4dcActions() {
        return jb4dcActions;
    }

    public void setJb4dcActions(Jb4dcActions jb4dcActions) {
        this.jb4dcActions = jb4dcActions;
    }

    public Jb4dcAuthorities getJb4dcAuthorities() {
        return jb4dcAuthorities;
    }

    public void setJb4dcAuthorities(Jb4dcAuthorities jb4dcAuthorities) {
        this.jb4dcAuthorities = jb4dcAuthorities;
    }
}
