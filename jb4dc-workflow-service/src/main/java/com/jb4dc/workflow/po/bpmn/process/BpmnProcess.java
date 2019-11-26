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
    List<BomnSubProcess> subProcessList;

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

    public List<BomnSubProcess> getSubProcessList() {
        return subProcessList;
    }

    public void setSubProcessList(List<BomnSubProcess> subProcessList) {
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
}
