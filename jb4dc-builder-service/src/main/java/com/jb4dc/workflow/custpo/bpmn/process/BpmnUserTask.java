package com.jb4dc.workflow.custpo.bpmn.process;

import com.jb4dc.workflow.custpo.bpmn.BpmnNs;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/25
 * To change this template use File | Settings | File Templates.
 */
@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "userTask",namespace = BpmnNs.BPMN_URI)
public class BpmnUserTask extends BpmnTask {
}
