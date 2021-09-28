package com.jb4dc.workflow.po.bpmn.process;

import com.jb4dc.workflow.po.JuelRunResultPO;
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

    @XmlAttribute(name = "actionDisplayConditionEditText")
    String actionDisplayConditionEditText;

    @XmlAttribute(name = "actionDisplayConditionEditValue")
    String actionDisplayConditionEditValue;

    @XmlAttribute(name = "actionCallJsMethod")
    String actionCallJsMethod;

    @XmlAttribute(name = "actionHTMLId")
    String actionHTMLId;

    @XmlAttribute(name = "actionHTMLClass")
    String actionHTMLClass;

    @XmlAttribute(name = "actionRunSqls")
    String actionRunSqls;

    @XmlAttribute(name = "actionUpdateFields")
    String actionUpdateFields;

    @XmlAttribute(name = "actionCallApis")
    String actionCallApis;

    @XmlAttribute(name = "actionExecuteVariables")
    String actionExecuteVariables;

    @XmlAttribute(name = "actionConfirm")
    String actionConfirm;

    @XmlAttribute(name = "actionValidate")
    String actionValidate;

    @XmlAttribute(name = "actionOpinionBindToField")
    String actionOpinionBindToField;

    @XmlAttribute(name = "actionOpinionBindToElemId")
    String actionOpinionBindToElemId;

    @XmlAttribute(name = "actionMainReceiveObjects")
    String actionMainReceiveObjects;

    @XmlAttribute(name = "actionCCReceiveObjects")
    String actionCCReceiveObjects;

    @XmlAttribute(name = "actionAutoSend")
    String actionAutoSend;

    @XmlAttribute(name = "actionSendMessageId")
    String actionSendMessageId;

    @XmlAttribute(name = "actionSendSignalId")
    String actionSendSignalId;

    @XmlAttribute(name = "actionCallComplete")
    String actionCallComplete;

    @XmlAttribute(name = "actionDisable")
    String actionDisable;

    @XmlAttribute(name = "actionRemark")
    String actionRemark;

    @XmlAttribute(name = "actionAtStatus")
    String actionAtStatus;

    JuelRunResultPO juelRunResultPO;

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

    public String getActionDisplayConditionEditText() {
        return actionDisplayConditionEditText;
    }

    public void setActionDisplayConditionEditText(String actionDisplayConditionEditText) {
        this.actionDisplayConditionEditText = actionDisplayConditionEditText;
    }

    public String getActionDisplayConditionEditValue() {
        return actionDisplayConditionEditValue;
    }

    public void setActionDisplayConditionEditValue(String actionDisplayConditionEditValue) {
        this.actionDisplayConditionEditValue = actionDisplayConditionEditValue;
    }

    public String getActionConfirm() {
        return actionConfirm;
    }

    public void setActionConfirm(String actionConfirm) {
        this.actionConfirm = actionConfirm;
    }

    public String getActionValidate() {
        return actionValidate;
    }

    public void setActionValidate(String actionValidate) {
        this.actionValidate = actionValidate;
    }

    public String getActionMainReceiveObjects() {
        return actionMainReceiveObjects;
    }

    public void setActionMainReceiveObjects(String actionMainReceiveObjects) {
        this.actionMainReceiveObjects = actionMainReceiveObjects;
    }

    public String getActionCCReceiveObjects() {
        return actionCCReceiveObjects;
    }

    public void setActionCCReceiveObjects(String actionCCReceiveObjects) {
        this.actionCCReceiveObjects = actionCCReceiveObjects;
    }

    public String getActionAutoSend() {
        return actionAutoSend;
    }

    public void setActionAutoSend(String actionAutoSend) {
        this.actionAutoSend = actionAutoSend;
    }

    public String getActionCallComplete() {
        return actionCallComplete;
    }

    public void setActionCallComplete(String actionCallComplete) {
        this.actionCallComplete = actionCallComplete;
    }

    public JuelRunResultPO getJuelRunResultPO() {
        return juelRunResultPO;
    }

    public void setJuelRunResultPO(JuelRunResultPO juelRunResultPO) {
        this.juelRunResultPO = juelRunResultPO;
    }

    public String getActionCallJsMethod() {
        return actionCallJsMethod;
    }

    public void setActionCallJsMethod(String actionCallJsMethod) {
        this.actionCallJsMethod = actionCallJsMethod;
    }

    public String getActionHTMLId() {
        return actionHTMLId;
    }

    public void setActionHTMLId(String actionHTMLId) {
        this.actionHTMLId = actionHTMLId;
    }

    public String getActionHTMLClass() {
        return actionHTMLClass;
    }

    public void setActionHTMLClass(String actionHTMLClass) {
        this.actionHTMLClass = actionHTMLClass;
    }

    public String getActionRunSqls() {
        return actionRunSqls;
    }

    public void setActionRunSqls(String actionRunSqls) {
        this.actionRunSqls = actionRunSqls;
    }

    public String getActionOpinionBindToField() {
        return actionOpinionBindToField;
    }

    public void setActionOpinionBindToField(String actionOpinionBindToField) {
        this.actionOpinionBindToField = actionOpinionBindToField;
    }

    public String getActionOpinionBindToElemId() {
        return actionOpinionBindToElemId;
    }

    public void setActionOpinionBindToElemId(String actionOpinionBindToElemId) {
        this.actionOpinionBindToElemId = actionOpinionBindToElemId;
    }

    public String getActionSendMessageId() {
        return actionSendMessageId;
    }

    public void setActionSendMessageId(String actionSendMessageId) {
        this.actionSendMessageId = actionSendMessageId;
    }

    public String getActionSendSignalId() {
        return actionSendSignalId;
    }

    public void setActionSendSignalId(String actionSendSignalId) {
        this.actionSendSignalId = actionSendSignalId;
    }

    public String getActionDisable() {
        return actionDisable;
    }

    public void setActionDisable(String actionDisable) {
        this.actionDisable = actionDisable;
    }

    public String getActionRemark() {
        return actionRemark;
    }

    public void setActionRemark(String actionRemark) {
        this.actionRemark = actionRemark;
    }

    public String getActionAtStatus() {
        return actionAtStatus;
    }

    public void setActionAtStatus(String actionAtStatus) {
        this.actionAtStatus = actionAtStatus;
    }
}
