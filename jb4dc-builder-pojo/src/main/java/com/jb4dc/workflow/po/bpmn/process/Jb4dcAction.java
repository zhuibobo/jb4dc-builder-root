package com.jb4dc.workflow.po.bpmn.process;

import com.jb4dc.workflow.po.bpmn.BpmnNs;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "jb4dcAction",namespace = BpmnNs.JB4DC_URI)
public class Jb4dcAction {
    @XmlAttribute(name = "actionType")
    String actionType;

    @XmlAttribute(name = "actionCode")
    String actionCode;

    @XmlAttribute(name = "actionCaption")
    String actionCaption;

    @XmlAttribute(name = "actionShowOpinionDialog")
    String actionShowOpinionDialog;

    @XmlAttribute(name = "actionUpdateFields")
    String actionUpdateFields;

    @XmlAttribute(name = "actionCallApis")
    String actionCallApis;

    @XmlAttribute(name = "actionExecuteVariables")
    String actionExecuteVariables;

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getActionCode() {
        return actionCode;
    }

    public void setActionCode(String actionCode) {
        this.actionCode = actionCode;
    }

    public String getActionCaption() {
        return actionCaption;
    }

    public void setActionCaption(String actionCaption) {
        this.actionCaption = actionCaption;
    }

    public String getActionShowOpinionDialog() {
        return actionShowOpinionDialog;
    }

    public void setActionShowOpinionDialog(String actionShowOpinionDialog) {
        this.actionShowOpinionDialog = actionShowOpinionDialog;
    }

    public String getActionUpdateFields() {
        return actionUpdateFields;
    }

    public void setActionUpdateFields(String actionUpdateFields) {
        this.actionUpdateFields = actionUpdateFields;
    }

    public String getActionCallApis() {
        return actionCallApis;
    }

    public void setActionCallApis(String actionCallApis) {
        this.actionCallApis = actionCallApis;
    }

    public String getActionExecuteVariables() {
        return actionExecuteVariables;
    }

    public void setActionExecuteVariables(String actionExecuteVariables) {
        this.actionExecuteVariables = actionExecuteVariables;
    }
}
