package com.jb4dc.workflow.integrate.extend;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.po.FlowIntegratedPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.util.Map;

public interface IModelIntegratedExtendService extends IBaseService<ModelIntegratedEntity> {

    BpmnDefinitions parseToPO(String xml) throws JAXBException, XMLStreamException;

    BpmnDefinitions parseToPO(InputStream is) throws JAXBException, XMLStreamException;

    FlowIntegratedPO getPOByIntegratedId(JB4DCSession jb4DSession, String recordId) throws JBuild4DCGenerallyException, IOException;

    PageInfo<ModelIntegratedEntity> getPageByModule(JB4DCSession jb4DCSession, int pageNum, int pageSize, Map<String, Object> searchItemMap);

    FlowIntegratedPO saveFlowModel(JB4DCSession jb4DSession, FlowIntegratedPO flowIntegratedPO) throws JBuild4DCGenerallyException;

    boolean modelMustReDeployment(JB4DCSession jb4DCSession, String sourceModelXML, String newModelXML);

    String getBpmnTemplateModelByName(String templateName) throws IOException, URISyntaxException;
}
