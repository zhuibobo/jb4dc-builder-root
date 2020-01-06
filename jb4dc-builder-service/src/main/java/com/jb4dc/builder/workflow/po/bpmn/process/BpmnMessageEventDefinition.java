package com.jb4dc.builder.workflow.po.bpmn.process;

import com.jb4dc.builder.workflow.po.bpmn.BpmnNs;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/26
 * To change this template use File | Settings | File Templates.
 */
@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "messageEventDefinition",namespace = BpmnNs.BPMN_URI)
public class BpmnMessageEventDefinition {
    @XmlAttribute(name = "messageRef")
    String messageRef;

    public String getMessageRef() {
        return messageRef;
    }

    public void setMessageRef(String messageRef) {
        this.messageRef = messageRef;
    }
}
