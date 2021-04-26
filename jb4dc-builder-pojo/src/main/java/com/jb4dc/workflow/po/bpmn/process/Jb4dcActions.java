package com.jb4dc.workflow.po.bpmn.process;

import com.jb4dc.workflow.po.bpmn.BpmnNs;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "jb4dcActions",namespace = BpmnNs.JB4DC_URI)
public class Jb4dcActions {

    @XmlElement(name = "jb4dcAction",namespace = BpmnNs.JB4DC_URI)
    List<Jb4dcAction> jb4dcActionList;

    public List<Jb4dcAction> getJb4dcActionList() {
        return jb4dcActionList;
    }

    public void setJb4dcActionList(List<Jb4dcAction> jb4dcActionList) {
        this.jb4dcActionList = jb4dcActionList;
    }
}
