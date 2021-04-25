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

    @XmlElement(name = "jb4dcActions",namespace = BpmnNs.JB4DC_URI)
    List<Jb4dcReceiveObject> jb4dcActions;

    public List<Jb4dcReceiveObject> getJb4dcActions() {
        return jb4dcActions;
    }

    public void setJb4dcActions(List<Jb4dcReceiveObject> jb4dcActions) {
        this.jb4dcActions = jb4dcActions;
    }
}
