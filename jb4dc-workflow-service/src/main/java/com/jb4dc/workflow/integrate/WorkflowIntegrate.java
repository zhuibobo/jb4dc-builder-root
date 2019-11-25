package com.jb4dc.workflow.integrate;

import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.builder.po.ButtonAPIConfigPO;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.InputStream;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/25
 * To change this template use File | Settings | File Templates.
 */
public class WorkflowIntegrate {

    public BpmnDefinitions parseToPO(String xml) throws JAXBException, XMLStreamException {
        return XMLUtility.toObject(xml, BpmnDefinitions.class);
    }

    public BpmnDefinitions parseToPO(InputStream is) throws JAXBException, XMLStreamException {
        return XMLUtility.toObject(is, BpmnDefinitions.class);
    }
}
