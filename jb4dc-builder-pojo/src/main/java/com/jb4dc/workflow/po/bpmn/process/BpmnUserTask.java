package com.jb4dc.workflow.po.bpmn.process;

import com.jb4dc.workflow.po.bpmn.BpmnNs;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/25
 * To change this template use File | Settings | File Templates.
 */
@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "userTask",namespace = BpmnNs.BPMN_URI)
public class BpmnUserTask extends BpmnTask {

    @XmlAttribute(name = "assignee",namespace = BpmnNs.CAMUNDA_URI)
    String assignee;

    @XmlAttribute(name = "candidateUsers",namespace = BpmnNs.CAMUNDA_URI)
    String candidateUsers;

    @XmlAttribute(name = "candidateGroups",namespace = BpmnNs.CAMUNDA_URI)
    String candidateGroups;

    @XmlAttribute(name = "dueDate",namespace = BpmnNs.CAMUNDA_URI)
    String dueDate;

    @XmlAttribute(name = "followUpDate",namespace = BpmnNs.CAMUNDA_URI)
    String followUpDate;

    @XmlAttribute(name = "priority",namespace = BpmnNs.CAMUNDA_URI)
    String priority;

    //@XmlAttribute(name = "jb4dcCode",namespace = BpmnNs.JB4DC_URI)
    String jb4dcCode;

    //@XmlAttribute(name = "jb4dcFormId",namespace = BpmnNs.JB4DC_URI)
    String jb4dcFormId;

    @XmlAttribute(name = "jb4dcFormEx1Id",namespace = BpmnNs.JB4DC_URI)
    String jb4dcFormEx1Id;

    @XmlAttribute(name = "jb4dcOuterFormUrl",namespace = BpmnNs.JB4DC_URI)
    String jb4dcOuterFormUrl;

    @XmlAttribute(name = "jb4dcOuterFormEx1Url",namespace = BpmnNs.JB4DC_URI)
    String jb4dcOuterFormEx1Url;

    @XmlAttribute(name = "jb4dcProcessTitleEditText",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessTitleEditText;

    @XmlAttribute(name = "jb4dcProcessTitleEditValue",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessTitleEditValue;

    @XmlAttribute(name = "jb4dcProcessDescriptionEditText",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessDescriptionEditText;

    @XmlAttribute(name = "jb4dcProcessDescriptionEditValue",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessDescriptionEditValue;

    @XmlAttribute(name = "jb4dcCandidateUsersDesc",namespace = BpmnNs.JB4DC_URI)
    String jb4dcCandidateUsersDesc;

    @XmlAttribute(name = "jb4dcCandidateGroupsDesc",namespace = BpmnNs.JB4DC_URI)
    String jb4dcCandidateGroupsDesc;

    @XmlAttribute(name = "jb4dcUseContentDocument",namespace = BpmnNs.JB4DC_URI)
    String jb4dcUseContentDocument;

    @XmlAttribute(name = "jb4dcContentDocumentPlugin",namespace = BpmnNs.JB4DC_URI)
    String jb4dcContentDocumentPlugin;

    @XmlAttribute(name = "jb4dcContentDocumentRedHeadTemplate",namespace = BpmnNs.JB4DC_URI)
    String jb4dcContentDocumentRedHeadTemplate;

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getCandidateUsers() {
        return candidateUsers;
    }

    public void setCandidateUsers(String candidateUsers) {
        this.candidateUsers = candidateUsers;
    }

    public String getCandidateGroups() {
        return candidateGroups;
    }

    public void setCandidateGroups(String candidateGroups) {
        this.candidateGroups = candidateGroups;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getFollowUpDate() {
        return followUpDate;
    }

    public void setFollowUpDate(String followUpDate) {
        this.followUpDate = followUpDate;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getJb4dcCode() {
        return jb4dcCode;
    }

    public void setJb4dcCode(String jb4dcCode) {
        this.jb4dcCode = jb4dcCode;
    }

    public String getJb4dcFormId() {
        return jb4dcFormId;
    }

    public void setJb4dcFormId(String jb4dcFormId) {
        this.jb4dcFormId = jb4dcFormId;
    }

    public String getJb4dcFormEx1Id() {
        return jb4dcFormEx1Id;
    }

    public void setJb4dcFormEx1Id(String jb4dcFormEx1Id) {
        this.jb4dcFormEx1Id = jb4dcFormEx1Id;
    }

    public String getJb4dcOuterFormUrl() {
        return jb4dcOuterFormUrl;
    }

    public void setJb4dcOuterFormUrl(String jb4dcOuterFormUrl) {
        this.jb4dcOuterFormUrl = jb4dcOuterFormUrl;
    }

    public String getJb4dcOuterFormEx1Url() {
        return jb4dcOuterFormEx1Url;
    }

    public void setJb4dcOuterFormEx1Url(String jb4dcOuterFormEx1Url) {
        this.jb4dcOuterFormEx1Url = jb4dcOuterFormEx1Url;
    }

    public String getJb4dcProcessTitleEditText() {
        return jb4dcProcessTitleEditText;
    }

    public void setJb4dcProcessTitleEditText(String jb4dcProcessTitleEditText) {
        this.jb4dcProcessTitleEditText = jb4dcProcessTitleEditText;
    }

    public String getJb4dcProcessTitleEditValue() {
        return jb4dcProcessTitleEditValue;
    }

    public void setJb4dcProcessTitleEditValue(String jb4dcProcessTitleEditValue) {
        this.jb4dcProcessTitleEditValue = jb4dcProcessTitleEditValue;
    }

    public String getJb4dcProcessDescriptionEditText() {
        return jb4dcProcessDescriptionEditText;
    }

    public void setJb4dcProcessDescriptionEditText(String jb4dcProcessDescriptionEditText) {
        this.jb4dcProcessDescriptionEditText = jb4dcProcessDescriptionEditText;
    }

    public String getJb4dcProcessDescriptionEditValue() {
        return jb4dcProcessDescriptionEditValue;
    }

    public void setJb4dcProcessDescriptionEditValue(String jb4dcProcessDescriptionEditValue) {
        this.jb4dcProcessDescriptionEditValue = jb4dcProcessDescriptionEditValue;
    }

    public String getJb4dcCandidateUsersDesc() {
        return jb4dcCandidateUsersDesc;
    }

    public void setJb4dcCandidateUsersDesc(String jb4dcCandidateUsersDesc) {
        this.jb4dcCandidateUsersDesc = jb4dcCandidateUsersDesc;
    }

    public String getJb4dcCandidateGroupsDesc() {
        return jb4dcCandidateGroupsDesc;
    }

    public void setJb4dcCandidateGroupsDesc(String jb4dcCandidateGroupsDesc) {
        this.jb4dcCandidateGroupsDesc = jb4dcCandidateGroupsDesc;
    }

    public String getJb4dcUseContentDocument() {
        return jb4dcUseContentDocument;
    }

    public void setJb4dcUseContentDocument(String jb4dcUseContentDocument) {
        this.jb4dcUseContentDocument = jb4dcUseContentDocument;
    }

    public String getJb4dcContentDocumentPlugin() {
        return jb4dcContentDocumentPlugin;
    }

    public void setJb4dcContentDocumentPlugin(String jb4dcContentDocumentPlugin) {
        this.jb4dcContentDocumentPlugin = jb4dcContentDocumentPlugin;
    }

    public String getJb4dcContentDocumentRedHeadTemplate() {
        return jb4dcContentDocumentRedHeadTemplate;
    }

    public void setJb4dcContentDocumentRedHeadTemplate(String jb4dcContentDocumentRedHeadTemplate) {
        this.jb4dcContentDocumentRedHeadTemplate = jb4dcContentDocumentRedHeadTemplate;
    }
}
