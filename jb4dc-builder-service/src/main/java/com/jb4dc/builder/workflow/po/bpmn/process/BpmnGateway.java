package com.jb4dc.builder.workflow.po.bpmn.process;

import com.jb4dc.builder.workflow.po.bpmn.BpmnNs;

import javax.xml.bind.annotation.*;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/26
 * To change this template use File | Settings | File Templates.
 */
@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "gateway",namespace = BpmnNs.BPMN_URI)
public class BpmnGateway {
    @XmlAttribute(name = "id")
    String id;

    @XmlAttribute(name = "name")
    String name;

    @XmlElement(name = "documentation",namespace = BpmnNs.BPMN_URI)
    BpmnDocumentation documentation;

    @XmlElement(name = "extensionElements",namespace = BpmnNs.BPMN_URI)
    BpmnExtensionElements extensionElements;

    @XmlElement(name = "incoming",namespace = BpmnNs.BPMN_URI)
    List<BpmnIncoming> incomingList;

    @XmlElement(name = "outgoing",namespace = BpmnNs.BPMN_URI)
    List<BpmnOutgoing> outgoingList;

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
}
