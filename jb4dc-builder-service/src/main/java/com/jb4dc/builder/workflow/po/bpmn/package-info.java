@XmlSchema(
        elementFormDefault = XmlNsForm.QUALIFIED,
        xmlns={
                @XmlNs(prefix=BpmnNs.BPMN_PREFIX, namespaceURI=BpmnNs.BPMN_URI),
                @XmlNs(prefix=BpmnNs.BPMNDI_PREFIX, namespaceURI=BpmnNs.BPMNDI_URI),
                @XmlNs(prefix=BpmnNs.DC_PREFIX, namespaceURI=BpmnNs.DC_URI),
                @XmlNs(prefix=BpmnNs.DI_PREFIX, namespaceURI=BpmnNs.DI_URI),
                @XmlNs(prefix=BpmnNs.CAMUNDA_PREFIX, namespaceURI=BpmnNs.CAMUNDA_URI),
                @XmlNs(prefix=BpmnNs.XSI_PREFIX, namespaceURI=BpmnNs.XSI_URI),
                @XmlNs(prefix=BpmnNs.JB4DC_PREFIX, namespaceURI=BpmnNs.JB4DC_URI),
        }
)
/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/25
 * To change this template use File | Settings | File Templates.
 */
package com.jb4dc.builder.workflow.po.bpmn;

import javax.xml.bind.annotation.XmlNs;
import javax.xml.bind.annotation.XmlNsForm;
import javax.xml.bind.annotation.XmlSchema;