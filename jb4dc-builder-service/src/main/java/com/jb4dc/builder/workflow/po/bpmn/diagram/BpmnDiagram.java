package com.jb4dc.builder.workflow.po.bpmn.diagram;

import javax.xml.bind.annotation.*;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/25
 * To change this template use File | Settings | File Templates.
 */
@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "BPMNDiagram",namespace = "http://www.omg.org/spec/BPMN/20100524/DI")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "id"
})
public class BpmnDiagram {
    @XmlAttribute(name = "id")
    String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
