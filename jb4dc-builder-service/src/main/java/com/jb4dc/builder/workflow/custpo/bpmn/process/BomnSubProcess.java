package com.jb4dc.builder.workflow.custpo.bpmn.process;

import com.jb4dc.builder.workflow.custpo.bpmn.BpmnNs;

import javax.xml.bind.annotation.*;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/26
 * To change this template use File | Settings | File Templates.
 */
@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "subProcess",namespace = BpmnNs.BPMN_URI)
public class BomnSubProcess extends BpmnProcess {
    @XmlElement(name = "incoming",namespace = BpmnNs.BPMN_URI)
    List<BpmnIncoming> incomingList;

    @XmlElement(name = "outgoing",namespace = BpmnNs.BPMN_URI)
    List<BpmnOutgoing> outgoingList;

    public List<BpmnIncoming> getIncomingList() {
        return incomingList;
    }

    public void setIncomingList(List<BpmnIncoming> incomingList) {
        this.incomingList = incomingList;
    }

    public List<BpmnOutgoing> getOutgoingList() {
        return outgoingList;
    }

    public void setOutgoingList(List<BpmnOutgoing> outgoingList) {
        this.outgoingList = outgoingList;
    }
}
