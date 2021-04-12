package com.jb4dc.workflow.integrate.extend;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.flow.FlowIntegratedEntity;
import com.jb4dc.builder.po.FlowIntegratedPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.custpo.bpmn.BpmnDefinitions;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.io.InputStream;

public interface IFlowExtendModelService  extends IBaseService<FlowIntegratedEntity> {

    BpmnDefinitions parseToPO(String xml) throws JAXBException, XMLStreamException;

    BpmnDefinitions parseToPO(InputStream is) throws JAXBException, XMLStreamException;

    FlowIntegratedPO getPOByIntegratedId(JB4DCSession jb4DSession, String recordId);

    FlowIntegratedPO saveFlowModel(JB4DCSession jb4DSession, String recordID, FlowIntegratedPO flowIntegratedPO) throws JBuild4DCGenerallyException, IOException, JAXBException, XMLStreamException;
}
