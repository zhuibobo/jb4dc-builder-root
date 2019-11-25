package com.jb4dc.workflow.po.bpmn;

import com.jb4dc.workflow.po.bpmn.diagram.BpmnDiagram;
import com.jb4dc.workflow.po.bpmn.process.BpmnProcess;

import javax.xml.bind.annotation.*;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/25
 * To change this template use File | Settings | File Templates.
 */
@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "definitions",namespace = BpmnNs.BPMN_URI)
//@XmlSchema(xmlns ={@XmlNs(prefix = "bpmn",namespaceURI = "http://www.omg.org/spec/BPMN/20100524/MODEL")},namespace = "http://www.omg.org/spec/BPMN/20100524/MODEL")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "bpmnProcess",
        "bpmnDiagram"
})
public class BpmnDefinitions {

    @XmlAttribute(name = "id")
    String id;

    @XmlAttribute(name = "targetNamespace")
    String targetNamespace;

    @XmlAttribute(name = "exporter")
    String exporter;

    @XmlAttribute(name = "exporterVersion")
    String exporterVersion;

    @XmlElement(name = "process",namespace = BpmnNs.BPMN_URI)
    private BpmnProcess bpmnProcess;

    @XmlElement(name = "BPMNDiagram",namespace = BpmnNs.BPMNDI_URI)
    private BpmnDiagram bpmnDiagram;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTargetNamespace() {
        return targetNamespace;
    }

    public void setTargetNamespace(String targetNamespace) {
        this.targetNamespace = targetNamespace;
    }

    public String getExporter() {
        return exporter;
    }

    public void setExporter(String exporter) {
        this.exporter = exporter;
    }

    public String getExporterVersion() {
        return exporterVersion;
    }

    public void setExporterVersion(String exporterVersion) {
        this.exporterVersion = exporterVersion;
    }

    public BpmnProcess getBpmnProcess() {
        return bpmnProcess;
    }

    public void setBpmnProcess(BpmnProcess bpmnProcess) {
        this.bpmnProcess = bpmnProcess;
    }

    public BpmnDiagram getBpmnDiagram() {
        return bpmnDiagram;
    }

    public void setBpmnDiagram(BpmnDiagram bpmnDiagram) {
        this.bpmnDiagram = bpmnDiagram;
    }


}
