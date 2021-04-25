package com.jb4dc.workflow.po.bpmn.process;

import com.jb4dc.workflow.po.bpmn.BpmnNs;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "jb4dcCCReceiveObjects",namespace = BpmnNs.JB4DC_URI)
public class Jb4dcCCReceiveObjects {
    @XmlElement(name = "jb4dcReceiveObject",namespace = BpmnNs.JB4DC_URI)
    List<Jb4dcReceiveObject> jb4dcReceiveObject;

    public List<Jb4dcReceiveObject> getJb4dcReceiveObject() {
        return jb4dcReceiveObject;
    }

    public void setJb4dcReceiveObject(List<Jb4dcReceiveObject> jb4dcReceiveObject) {
        this.jb4dcReceiveObject = jb4dcReceiveObject;
    }
}
