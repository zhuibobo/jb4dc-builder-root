package com.jb4dc.builder.workflow.custpo.bpmn.process;

import com.jb4dc.builder.workflow.custpo.bpmn.BpmnNs;

import javax.xml.bind.annotation.*;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/26
 * To change this template use File | Settings | File Templates.
 */
@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "textAnnotation",namespace = BpmnNs.BPMN_URI)
public class BpmnTextAnnotation {
    @XmlAttribute(name = "id")
    String id;

    @XmlElement(name = "documentation",namespace = BpmnNs.BPMN_URI)
    BpmnDocumentation documentation;

    @XmlElement(name = "extensionElements",namespace = BpmnNs.BPMN_URI)
    BpmnExtensionElements extensionElements;

    @XmlElement(name = "text",namespace = BpmnNs.BPMN_URI)
    BpmnText text;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public BpmnText getText() {
        return text;
    }

    public void setText(BpmnText text) {
        this.text = text;
    }


}
