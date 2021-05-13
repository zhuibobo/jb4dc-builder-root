package com.jb4dc.workflow.po.bpmn.process;

import com.jb4dc.workflow.po.bpmn.BpmnNs;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "multiInstanceLoopCharacteristics",namespace = BpmnNs.BPMN_URI)
public class BpmnMultiInstanceLoopCharacteristics {

    @XmlAttribute(name = "collection",namespace = BpmnNs.CAMUNDA_URI)
    private String collection;

    @XmlAttribute(name = "elementVariable",namespace = BpmnNs.CAMUNDA_URI)
    private String elementVariable;

    @XmlAttribute(name = "isSequential",namespace = BpmnNs.BPMN_URI)
    private String isSequential;

    public String getCollection() {
        return collection;
    }

    public void setCollection(String collection) {
        this.collection = collection;
    }

    public String getElementVariable() {
        return elementVariable;
    }

    public void setElementVariable(String elementVariable) {
        this.elementVariable = elementVariable;
    }

    public String getIsSequential() {
        return isSequential;
    }

    public void setIsSequential(String isSequential) {
        this.isSequential = isSequential;
    }
}
