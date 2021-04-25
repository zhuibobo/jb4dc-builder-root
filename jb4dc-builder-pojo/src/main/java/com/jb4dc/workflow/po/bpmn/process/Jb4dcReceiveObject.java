package com.jb4dc.workflow.po.bpmn.process;

import com.jb4dc.workflow.po.bpmn.BpmnNs;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "jb4dcReceiveObject",namespace = BpmnNs.JB4DC_URI)
public class Jb4dcReceiveObject {
    @XmlAttribute(name = "receiveObjectCode")
    String receiveObjectCode;

    @XmlAttribute(name = "receiveObjectType")
    String receiveObjectType;

    @XmlAttribute(name = "receiveObjectValue")
    String receiveObjectValue;

    @XmlAttribute(name = "receiveObjectText")
    String receiveObjectText;

    public String getReceiveObjectCode() {
        return receiveObjectCode;
    }

    public void setReceiveObjectCode(String receiveObjectCode) {
        this.receiveObjectCode = receiveObjectCode;
    }

    public String getReceiveObjectType() {
        return receiveObjectType;
    }

    public void setReceiveObjectType(String receiveObjectType) {
        this.receiveObjectType = receiveObjectType;
    }

    public String getReceiveObjectValue() {
        return receiveObjectValue;
    }

    public void setReceiveObjectValue(String receiveObjectValue) {
        this.receiveObjectValue = receiveObjectValue;
    }

    public String getReceiveObjectText() {
        return receiveObjectText;
    }

    public void setReceiveObjectText(String receiveObjectText) {
        this.receiveObjectText = receiveObjectText;
    }
}
