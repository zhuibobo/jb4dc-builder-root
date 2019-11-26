package com.jb4dc.workflow.po.bpmn.process;

import com.jb4dc.workflow.po.bpmn.BpmnNs;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/26
 * To change this template use File | Settings | File Templates.
 */
@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "inputOutput",namespace = BpmnNs.CAMUNDA_URI)
public class CamundaInputOutput {

    @XmlElement(name = "inputParameter",namespace = BpmnNs.CAMUNDA_URI)
    List<CamundaInputParameter> inputParameterList;

    @XmlElement(name = "outputParameter",namespace = BpmnNs.CAMUNDA_URI)
    List<CamundaOutputParameter> outputParameterList;

    public List<CamundaInputParameter> getInputParameterList() {
        return inputParameterList;
    }

    public void setInputParameterList(List<CamundaInputParameter> inputParameterList) {
        this.inputParameterList = inputParameterList;
    }

    public List<CamundaOutputParameter> getOutputParameterList() {
        return outputParameterList;
    }

    public void setOutputParameterList(List<CamundaOutputParameter> outputParameterList) {
        this.outputParameterList = outputParameterList;
    }
}
