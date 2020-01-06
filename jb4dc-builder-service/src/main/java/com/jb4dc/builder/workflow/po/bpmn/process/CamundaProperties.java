package com.jb4dc.builder.workflow.po.bpmn.process;

import com.jb4dc.builder.workflow.po.bpmn.BpmnNs;

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
@XmlRootElement(name = "properties",namespace = BpmnNs.CAMUNDA_URI)
public class CamundaProperties {

    @XmlElement(name = "property",namespace = BpmnNs.CAMUNDA_URI)
    List<CamundaProperty> propertyList;

    public List<CamundaProperty> getPropertyList() {
        return propertyList;
    }

    public void setPropertyList(List<CamundaProperty> propertyList) {
        this.propertyList = propertyList;
    }
}
