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
        "sequenceFlow",
        "taskList"
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

    @XmlElement(name = "task",namespace = BpmnNs.BPMN_URI)
    List<BpmnTask> taskList;

    @XmlElement(name = "sequenceFlow",namespace = BpmnNs.BPMN_URI)
    List<BpmnSequenceFlow> sequenceFlow;

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
}
