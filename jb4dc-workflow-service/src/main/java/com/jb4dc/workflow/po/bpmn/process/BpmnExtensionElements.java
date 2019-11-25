package com.jb4dc.workflow.po.bpmn.process;

import com.jb4dc.workflow.po.bpmn.BpmnNs;

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
@XmlRootElement(name = "extensionElements",namespace = BpmnNs.BPMN_URI)
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "executionListenerList",
        "camundaProperties"
})
public class BpmnExtensionElements {

    @XmlElement(name = "executionListener",namespace = BpmnNs.CAMUNDA_URI)
    List<CamundaExecutionListener> executionListenerList;

    @XmlElement(name = "properties",namespace = BpmnNs.CAMUNDA_URI)
    CamundaProperties camundaProperties;
}
