package com.jb4dc.workflow.custpo.bpmn.process;

import com.jb4dc.workflow.custpo.bpmn.BpmnNs;

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
@XmlRootElement(name = "executionListener",namespace = BpmnNs.CAMUNDA_URI)
@XmlType(propOrder = {
        "className",
        "event",
        "camundaFieldList"
})
public class CamundaExecutionListener {

    @XmlAttribute(name = "class")
    String className;

    @XmlAttribute(name = "event")
    String event;

    @XmlElement(name = "field",namespace = BpmnNs.CAMUNDA_URI)
    List<CamundaField> camundaFieldList;

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }
}
