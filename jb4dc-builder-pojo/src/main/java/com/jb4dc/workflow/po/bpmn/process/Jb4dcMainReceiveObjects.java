package com.jb4dc.workflow.po.bpmn.process;

import com.jb4dc.workflow.po.bpmn.BpmnNs;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "jb4dcMainReceiveObjects",namespace = BpmnNs.JB4DC_URI)
public class Jb4dcMainReceiveObjects {
    @XmlElement(name = "jb4dcReceiveObject",namespace = BpmnNs.JB4DC_URI)
    List<Jb4dcReceiveObject> jb4dcReceiveObjectList;

    public List<Jb4dcReceiveObject> getJb4dcReceiveObjectList() {
        return jb4dcReceiveObjectList;
    }

    public void setJb4dcReceiveObjectList(List<Jb4dcReceiveObject> jb4dcReceiveObjectList) {
        this.jb4dcReceiveObjectList = jb4dcReceiveObjectList;
    }
}
