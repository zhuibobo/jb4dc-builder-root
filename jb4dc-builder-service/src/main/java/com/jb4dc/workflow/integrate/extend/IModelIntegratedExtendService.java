package com.jb4dc.workflow.integrate.extend;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.po.FlowModelIntegratedPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.po.FlowModelRuntimePO;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

public interface IModelIntegratedExtendService extends IBaseService<ModelIntegratedEntity> {

    BpmnDefinitions parseToPO(String xml) throws JAXBException, XMLStreamException;

    BpmnDefinitions parseToPO(InputStream is) throws JAXBException, XMLStreamException;

    FlowModelIntegratedPO getPOByIntegratedId(JB4DCSession jb4DSession, String recordId) throws JBuild4DCGenerallyException, IOException;

    PageInfo<ModelIntegratedEntity> getPageByModule(JB4DCSession jb4DCSession, int pageNum, int pageSize, Map<String, Object> searchItemMap);

    FlowModelIntegratedPO saveFlowModel(JB4DCSession jb4DSession, FlowModelIntegratedPO flowModelIntegratedPO) throws JBuild4DCGenerallyException;

    boolean modelMustReDeployment(JB4DCSession jb4DCSession, String sourceModelXML, String newModelXML);

    String getBpmnTemplateModelByName(String templateName) throws IOException, URISyntaxException;

    List<ModelIntegratedEntity> getMyStartEnableModel(JB4DCSession session);

    FlowModelRuntimePO getRuntimeModelWithStart(JB4DCSession session, String modelKey) throws IOException, JAXBException, XMLStreamException, JBuild4DCGenerallyException;

    FlowModelIntegratedPO getLastPOByModelReKey(JB4DCSession jb4DSession, String modelReKey) throws IOException;
}
