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
@XmlRootElement(name = "task",namespace = BpmnNs.BPMN_URI)
public class BpmnTask {
    @XmlAttribute(name = "id")
    String id;

    @XmlAttribute(name = "name")
    String name;

    String taskTypeName;

    @XmlElement(name = "documentation",namespace = BpmnNs.BPMN_URI)
    BpmnDocumentation documentation;

    @XmlElement(name = "extensionElements",namespace = BpmnNs.BPMN_URI)
    BpmnExtensionElements extensionElements;

    @XmlElement(name = "incoming",namespace = BpmnNs.BPMN_URI)
    List<BpmnIncoming> incomingList;

    @XmlElement(name = "outgoing",namespace = BpmnNs.BPMN_URI)
    List<BpmnOutgoing> outgoingList;

    @XmlElement(name = "multiInstanceLoopCharacteristics",namespace = BpmnNs.BPMN_URI)
    BpmnMultiInstanceLoopCharacteristics multiInstanceLoopCharacteristics;

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

    @XmlAttribute(name = "jb4dcCode",namespace = BpmnNs.JB4DC_URI)
    String jb4dcCode;

    @XmlAttribute(name = "jb4dcFormId",namespace = BpmnNs.JB4DC_URI)
    String jb4dcFormId;

    @XmlAttribute(name = "jb4dcFormEx1Id",namespace = BpmnNs.JB4DC_URI)
    String jb4dcFormEx1Id;

    @XmlAttribute(name = "jb4dcOuterFormUrl",namespace = BpmnNs.JB4DC_URI)
    String jb4dcOuterFormUrl;

    @XmlAttribute(name = "jb4dcOuterFormEx1Url",namespace = BpmnNs.JB4DC_URI)
    String jb4dcOuterFormEx1Url;

    @XmlAttribute(name = "jb4dcFormPlugin",namespace = BpmnNs.JB4DC_URI)
    String jb4dcFormPlugin;

    @XmlAttribute(name = "jb4dcFormParas",namespace = BpmnNs.JB4DC_URI)
    String jb4dcFormParas;

    @XmlAttribute(name = "jb4dcFormEx1Plugin",namespace = BpmnNs.JB4DC_URI)
    String jb4dcFormEx1Plugin;

    @XmlAttribute(name = "jb4dcFormEx1Paras",namespace = BpmnNs.JB4DC_URI)
    String jb4dcFormEx1Paras;

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

    boolean isMultiInstanceTask;

    String multiInstanceType; //Sequential,Parallel,Single

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

    public String getJb4dcFormPlugin() {
        return jb4dcFormPlugin;
    }

    public void setJb4dcFormPlugin(String jb4dcFormPlugin) {
        this.jb4dcFormPlugin = jb4dcFormPlugin;
    }

    public String getJb4dcFormParas() {
        return jb4dcFormParas;
    }

    public void setJb4dcFormParas(String jb4dcFormParas) {
        this.jb4dcFormParas = jb4dcFormParas;
    }

    public String getJb4dcFormEx1Plugin() {
        return jb4dcFormEx1Plugin;
    }

    public void setJb4dcFormEx1Plugin(String jb4dcFormEx1Plugin) {
        this.jb4dcFormEx1Plugin = jb4dcFormEx1Plugin;
    }

    public String getJb4dcFormEx1Paras() {
        return jb4dcFormEx1Paras;
    }

    public void setJb4dcFormEx1Paras(String jb4dcFormEx1Paras) {
        this.jb4dcFormEx1Paras = jb4dcFormEx1Paras;
    }

    public boolean isMultiInstanceTask() {
        return isMultiInstanceTask;
    }

    public void setMultiInstanceTask(boolean multiInstanceTask) {
        isMultiInstanceTask = multiInstanceTask;
    }

    public String getMultiInstanceType() {
        return multiInstanceType;
    }

    public void setMultiInstanceType(String multiInstanceType) {
        this.multiInstanceType = multiInstanceType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<BpmnIncoming> getIncomingList() {
        return incomingList;
    }

    public void setIncomingList(List<BpmnIncoming> incomingList) {
        this.incomingList = incomingList;
    }

    public BpmnDocumentation getDocumentation() {
        return documentation;
    }

    public void setDocumentation(BpmnDocumentation documentation) {
        this.documentation = documentation;
    }

    public BpmnExtensionElements getExtensionElements() {
        return extensionElements;
    }

    public void setExtensionElements(BpmnExtensionElements extensionElements) {
        this.extensionElements = extensionElements;
    }

    public List<BpmnOutgoing> getOutgoingList() {
        return outgoingList;
    }

    public void setOutgoingList(List<BpmnOutgoing> outgoingList) {
        this.outgoingList = outgoingList;
    }

    public BpmnMultiInstanceLoopCharacteristics getMultiInstanceLoopCharacteristics() {
        return multiInstanceLoopCharacteristics;
    }

    public void setMultiInstanceLoopCharacteristics(BpmnMultiInstanceLoopCharacteristics multiInstanceLoopCharacteristics) {
        this.multiInstanceLoopCharacteristics = multiInstanceLoopCharacteristics;
    }

    public String getTaskTypeName() {
        return taskTypeName;
    }

    public void setTaskTypeName(String taskTypeName) {
        this.taskTypeName = taskTypeName;
    }
}
