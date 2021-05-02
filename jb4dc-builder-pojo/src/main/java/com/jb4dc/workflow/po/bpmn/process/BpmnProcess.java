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
@XmlRootElement(name = "process",namespace = BpmnNs.BPMN_URI)
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "id",
        "name",
        "isExecutable",
        "candidateStarterGroups",
        "candidateStarterUsers",
        "versionTag",
        "jb4dcCode",
        "jb4dcFlowCategory",
        "jb4dcFormId",
        "jb4dcTenantId",
        "jb4dcProcessTitleEditText",
        "jb4dcProcessTitleEditValue",
        "jb4dcProcessDescriptionEditText",
        "jb4dcProcessDescriptionEditValue",
        "documentation",
        "extensionElements",
        "startEvent",
        "endEventList",
        "taskList",
        "userTaskList",
        "serviceTaskList",
        "sendTaskList",
        "receiveTaskList",
        "manualTaskList",
        "subProcessList",
        "callActivityList",
        "exclusiveGatewayList",
        "parallelGatewayList",
        "inclusiveGatewayList",
        "complexGatewayList",
        "sequenceFlow",
        "textAnnotationList",
        "associationList"
})
public class BpmnProcess {

    @XmlAttribute(name = "id")
    String id;

    @XmlAttribute(name = "name")
    String name;

    @XmlAttribute(name = "isExecutable")
    String isExecutable;

    @XmlAttribute(name = "candidateStarterGroups",namespace = BpmnNs.CAMUNDA_URI)
    String candidateStarterGroups;

    @XmlAttribute(name = "candidateStarterUsers",namespace = BpmnNs.CAMUNDA_URI)
    String candidateStarterUsers;

    @XmlAttribute(name = "versionTag",namespace = BpmnNs.CAMUNDA_URI)
    String versionTag;

    @XmlAttribute(name = "jb4dcCode",namespace = BpmnNs.JB4DC_URI)
    String jb4dcCode;

    @XmlAttribute(name = "jb4dcFlowCategory",namespace = BpmnNs.JB4DC_URI)
    String jb4dcFlowCategory;

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

    @XmlAttribute(name = "jb4dcUseContentDocument",namespace = BpmnNs.JB4DC_URI)
    String jb4dcUseContentDocument;

    @XmlAttribute(name = "jb4dcContentDocumentPlugin",namespace = BpmnNs.JB4DC_URI)
    String jb4dcContentDocumentPlugin;

    @XmlAttribute(name = "jb4dcContentDocumentRedHeadTemplate",namespace = BpmnNs.JB4DC_URI)
    String jb4dcContentDocumentRedHeadTemplate;

    @XmlAttribute(name = "jb4dcTenantId",namespace = BpmnNs.JB4DC_URI)
    String jb4dcTenantId;

    @XmlAttribute(name = "jb4dcProcessTitleEditText",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessTitleEditText;

    @XmlAttribute(name = "jb4dcProcessTitleEditValue",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessTitleEditValue;

    @XmlAttribute(name = "jb4dcProcessDescriptionEditText",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessDescriptionEditText;

    @XmlAttribute(name = "jb4dcProcessDescriptionEditValue",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessDescriptionEditValue;

    @XmlAttribute(name = "jb4dcProcessModelImageClass",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessModelImageClass;

    @XmlAttribute(name = "jb4dcProcessModelManagerGroups",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessModelManagerGroups;

    @XmlAttribute(name = "jb4dcProcessModelManagerUsers",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessModelManagerUsers;

    @XmlAttribute(name = "jb4dcProcessCandidateStarterGroups",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessCandidateStarterGroups;

    @XmlAttribute(name = "jb4dcProcessCandidateStarterUsers",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessCandidateStarterUsers;

    @XmlAttribute(name = "jb4dcProcessActionConfirm",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessActionConfirm;

    @XmlAttribute(name = "jb4dcProcessRestartEnable",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessRestartEnable;

    @XmlAttribute(name = "jb4dcProcessModelGroups",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessModelGroups;

    @XmlAttribute(name = "jb4dcProcessAnyJumpEnable",namespace = BpmnNs.JB4DC_URI)
    String jb4dcProcessAnyJumpEnable;

    @XmlElement(name = "documentation",namespace = BpmnNs.BPMN_URI)
    BpmnDocumentation documentation;

    @XmlElement(name = "extensionElements",namespace = BpmnNs.BPMN_URI)
    BpmnExtensionElements extensionElements;

    @XmlElement(name = "startEvent",namespace = BpmnNs.BPMN_URI)
    BpmnStartEvent startEvent;

    @XmlElement(name = "endEvent",namespace = BpmnNs.BPMN_URI)
    List<BpmnEndEvent> endEventList;

    @XmlElement(name = "task",namespace = BpmnNs.BPMN_URI)
    List<BpmnTask> taskList;

    @XmlElement(name = "userTask",namespace = BpmnNs.BPMN_URI)
    List<BpmnUserTask> userTaskList;

    @XmlElement(name = "serviceTask",namespace = BpmnNs.BPMN_URI)
    List<BpmnServiceTask> serviceTaskList;

    @XmlElement(name = "sendTask",namespace = BpmnNs.BPMN_URI)
    List<BpmnSendTask> sendTaskList;

    @XmlElement(name = "receiveTask",namespace = BpmnNs.BPMN_URI)
    List<BpmnReceiveTask> receiveTaskList;

    @XmlElement(name = "manualTask",namespace = BpmnNs.BPMN_URI)
    List<BpmnManualTask> manualTaskList;

    @XmlElement(name = "sequenceFlow",namespace = BpmnNs.BPMN_URI)
    List<BpmnSequenceFlow> sequenceFlow;

    @XmlElement(name = "subProcess",namespace = BpmnNs.BPMN_URI)
    List<BpmnSubProcess> subProcessList;

    @XmlElement(name = "callActivity",namespace = BpmnNs.BPMN_URI)
    List<BpmnCallActivity> callActivityList;

    @XmlElement(name = "exclusiveGateway",namespace = BpmnNs.BPMN_URI)
    List<BpmnExclusiveGateway> exclusiveGatewayList;

    @XmlElement(name = "parallelGateway",namespace = BpmnNs.BPMN_URI)
    List<BpmnParallelGateway> parallelGatewayList;

    @XmlElement(name = "inclusiveGateway",namespace = BpmnNs.BPMN_URI)
    List<BpmnInclusiveGateway> inclusiveGatewayList;

    @XmlElement(name = "complexGateway",namespace = BpmnNs.BPMN_URI)
    List<BpmnComplexGateway> complexGatewayList;

    @XmlElement(name = "textAnnotation",namespace = BpmnNs.BPMN_URI)
    List<BpmnTextAnnotation> textAnnotationList;

    @XmlElement(name = "association",namespace = BpmnNs.BPMN_URI)
    List<BpmnAssociation> associationList;

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

    public String getIsExecutable() {
        return isExecutable;
    }

    public void setIsExecutable(String isExecutable) {
        this.isExecutable = isExecutable;
    }

    public String getVersionTag() {
        return versionTag;
    }

    public void setVersionTag(String versionTag) {
        this.versionTag = versionTag;
    }

    public String getJb4dcCode() {
        return jb4dcCode;
    }

    public void setJb4dcCode(String jb4dcCode) {
        this.jb4dcCode = jb4dcCode;
    }

    public String getJb4dcFlowCategory() {
        return jb4dcFlowCategory;
    }

    public void setJb4dcFlowCategory(String jb4dcFlowCategory) {
        this.jb4dcFlowCategory = jb4dcFlowCategory;
    }

    public String getJb4dcFormId() {
        return jb4dcFormId;
    }

    public void setJb4dcFormId(String jb4dcFormId) {
        this.jb4dcFormId = jb4dcFormId;
    }

    public String getJb4dcTenantId() {
        return jb4dcTenantId;
    }

    public void setJb4dcTenantId(String jb4dcTenantId) {
        this.jb4dcTenantId = jb4dcTenantId;
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

    public String getCandidateStarterGroups() {
        return candidateStarterGroups;
    }

    public void setCandidateStarterGroups(String candidateStarterGroups) {
        this.candidateStarterGroups = candidateStarterGroups;
    }

    public String getCandidateStarterUsers() {
        return candidateStarterUsers;
    }

    public void setCandidateStarterUsers(String candidateStarterUsers) {
        this.candidateStarterUsers = candidateStarterUsers;
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

    public BpmnStartEvent getStartEvent() {
        return startEvent;
    }

    public void setStartEvent(BpmnStartEvent startEvent) {
        this.startEvent = startEvent;
    }

    public List<BpmnSequenceFlow> getSequenceFlow() {
        return sequenceFlow;
    }

    public void setSequenceFlow(List<BpmnSequenceFlow> sequenceFlow) {
        this.sequenceFlow = sequenceFlow;
    }

    public List<BpmnTask> getTaskList() {
        return taskList;
    }

    public void setTaskList(List<BpmnTask> taskList) {
        this.taskList = taskList;
    }

    public List<BpmnUserTask> getUserTaskList() {
        return userTaskList;
    }

    public void setUserTaskList(List<BpmnUserTask> userTaskList) {
        this.userTaskList = userTaskList;
    }

    public List<BpmnServiceTask> getServiceTaskList() {
        return serviceTaskList;
    }

    public void setServiceTaskList(List<BpmnServiceTask> serviceTaskList) {
        this.serviceTaskList = serviceTaskList;
    }

    public List<BpmnSendTask> getSendTaskList() {
        return sendTaskList;
    }

    public void setSendTaskList(List<BpmnSendTask> sendTaskList) {
        this.sendTaskList = sendTaskList;
    }

    public List<BpmnReceiveTask> getReceiveTaskList() {
        return receiveTaskList;
    }

    public void setReceiveTaskList(List<BpmnReceiveTask> receiveTaskList) {
        this.receiveTaskList = receiveTaskList;
    }

    public List<BpmnManualTask> getManualTaskList() {
        return manualTaskList;
    }

    public void setManualTaskList(List<BpmnManualTask> manualTaskList) {
        this.manualTaskList = manualTaskList;
    }

    public List<BpmnSubProcess> getSubProcessList() {
        return subProcessList;
    }

    public void setSubProcessList(List<BpmnSubProcess> subProcessList) {
        this.subProcessList = subProcessList;
    }

    public List<BpmnCallActivity> getCallActivityList() {
        return callActivityList;
    }

    public void setCallActivityList(List<BpmnCallActivity> callActivityList) {
        this.callActivityList = callActivityList;
    }

    public List<BpmnExclusiveGateway> getExclusiveGatewayList() {
        return exclusiveGatewayList;
    }

    public void setExclusiveGatewayList(List<BpmnExclusiveGateway> exclusiveGatewayList) {
        this.exclusiveGatewayList = exclusiveGatewayList;
    }

    public List<BpmnParallelGateway> getParallelGatewayList() {
        return parallelGatewayList;
    }

    public void setParallelGatewayList(List<BpmnParallelGateway> parallelGatewayList) {
        this.parallelGatewayList = parallelGatewayList;
    }

    public List<BpmnInclusiveGateway> getInclusiveGatewayList() {
        return inclusiveGatewayList;
    }

    public void setInclusiveGatewayList(List<BpmnInclusiveGateway> inclusiveGatewayList) {
        this.inclusiveGatewayList = inclusiveGatewayList;
    }

    public List<BpmnComplexGateway> getComplexGatewayList() {
        return complexGatewayList;
    }

    public void setComplexGatewayList(List<BpmnComplexGateway> complexGatewayList) {
        this.complexGatewayList = complexGatewayList;
    }

    public List<BpmnTextAnnotation> getTextAnnotationList() {
        return textAnnotationList;
    }

    public void setTextAnnotationList(List<BpmnTextAnnotation> textAnnotationList) {
        this.textAnnotationList = textAnnotationList;
    }

    public List<BpmnEndEvent> getEndEventList() {
        return endEventList;
    }

    public void setEndEventList(List<BpmnEndEvent> endEventList) {
        this.endEventList = endEventList;
    }

    public List<BpmnAssociation> getAssociationList() {
        return associationList;
    }

    public void setAssociationList(List<BpmnAssociation> associationList) {
        this.associationList = associationList;
    }

    public String getJb4dcProcessModelImageClass() {
        return jb4dcProcessModelImageClass;
    }

    public void setJb4dcProcessModelImageClass(String jb4dcProcessModelImageClass) {
        this.jb4dcProcessModelImageClass = jb4dcProcessModelImageClass;
    }

    public String getJb4dcProcessModelManagerGroups() {
        return jb4dcProcessModelManagerGroups;
    }

    public void setJb4dcProcessModelManagerGroups(String jb4dcProcessModelManagerGroups) {
        this.jb4dcProcessModelManagerGroups = jb4dcProcessModelManagerGroups;
    }

    public String getJb4dcProcessModelManagerUsers() {
        return jb4dcProcessModelManagerUsers;
    }

    public void setJb4dcProcessModelManagerUsers(String jb4dcProcessModelManagerUsers) {
        this.jb4dcProcessModelManagerUsers = jb4dcProcessModelManagerUsers;
    }

    public String getJb4dcProcessRestartEnable() {
        return jb4dcProcessRestartEnable;
    }

    public void setJb4dcProcessRestartEnable(String jb4dcProcessRestartEnable) {
        this.jb4dcProcessRestartEnable = jb4dcProcessRestartEnable;
    }

    public String getJb4dcProcessAnyJumpEnable() {
        return jb4dcProcessAnyJumpEnable;
    }

    public void setJb4dcProcessAnyJumpEnable(String jb4dcProcessAnyJumpEnable) {
        this.jb4dcProcessAnyJumpEnable = jb4dcProcessAnyJumpEnable;
    }

    public String getJb4dcProcessModelGroups() {
        return jb4dcProcessModelGroups;
    }

    public void setJb4dcProcessModelGroups(String jb4dcProcessModelGroups) {
        this.jb4dcProcessModelGroups = jb4dcProcessModelGroups;
    }

    public String getJb4dcProcessCandidateStarterGroups() {
        return jb4dcProcessCandidateStarterGroups;
    }

    public void setJb4dcProcessCandidateStarterGroups(String jb4dcProcessCandidateStarterGroups) {
        this.jb4dcProcessCandidateStarterGroups = jb4dcProcessCandidateStarterGroups;
    }

    public String getJb4dcProcessCandidateStarterUsers() {
        return jb4dcProcessCandidateStarterUsers;
    }

    public void setJb4dcProcessCandidateStarterUsers(String jb4dcProcessCandidateStarterUsers) {
        this.jb4dcProcessCandidateStarterUsers = jb4dcProcessCandidateStarterUsers;
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

    public String getJb4dcProcessActionConfirm() {
        return jb4dcProcessActionConfirm;
    }

    public void setJb4dcProcessActionConfirm(String jb4dcProcessActionConfirm) {
        this.jb4dcProcessActionConfirm = jb4dcProcessActionConfirm;
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
}
