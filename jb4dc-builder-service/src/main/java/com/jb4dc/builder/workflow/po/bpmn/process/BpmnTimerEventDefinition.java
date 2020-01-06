package com.jb4dc.builder.workflow.po.bpmn.process;

import com.jb4dc.builder.workflow.po.bpmn.BpmnNs;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/26
 * To change this template use File | Settings | File Templates.
 */
@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "timerEventDefinition",namespace = BpmnNs.BPMN_URI)
public class BpmnTimerEventDefinition {

    @XmlElement(name = "timeDate",namespace = BpmnNs.BPMN_URI)
    BpmnTimeDate timeDate;

    @XmlElement(name = "timeDuration",namespace = BpmnNs.BPMN_URI)
    BpmnTimeDuration timeDuration;

    @XmlElement(name = "timeCycle",namespace = BpmnNs.BPMN_URI)
    BpmnTimeCycle bpmnTimeCycle;

    public BpmnTimeDate getTimeDate() {
        return timeDate;
    }

    public void setTimeDate(BpmnTimeDate timeDate) {
        this.timeDate = timeDate;
    }

    public BpmnTimeDuration getTimeDuration() {
        return timeDuration;
    }

    public void setTimeDuration(BpmnTimeDuration timeDuration) {
        this.timeDuration = timeDuration;
    }

    public BpmnTimeCycle getBpmnTimeCycle() {
        return bpmnTimeCycle;
    }

    public void setBpmnTimeCycle(BpmnTimeCycle bpmnTimeCycle) {
        this.bpmnTimeCycle = bpmnTimeCycle;
    }
}
