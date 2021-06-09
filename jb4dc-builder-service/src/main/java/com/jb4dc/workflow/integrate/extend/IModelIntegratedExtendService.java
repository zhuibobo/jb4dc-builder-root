package com.jb4dc.workflow.integrate.extend;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.po.FlowModelIntegratedPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

public interface IModelIntegratedExtendService extends IBaseService<ModelIntegratedEntity> {

    BpmnDefinitions parseToPO(String xml) throws JAXBException, XMLStreamException;

    BpmnDefinitions parseToPO(InputStream is) throws JAXBException, XMLStreamException, IOException;

    FlowModelIntegratedPO getPOByIntegratedId(JB4DCSession jb4DSession, String recordId) throws JBuild4DCGenerallyException, IOException;

    PageInfo<ModelIntegratedEntity> getPageByModule(JB4DCSession jb4DCSession, int pageNum, int pageSize, Map<String, Object> searchItemMap);

    FlowModelIntegratedPO saveFlowModel(JB4DCSession jb4DSession, FlowModelIntegratedPO flowModelIntegratedPO) throws JBuild4DCGenerallyException;

    ModelIntegratedEntity getLastSaveModelIntegratedEntity(JB4DCSession jb4DCSession, String modelReKey);

    boolean modelMustReDeployment(JB4DCSession jb4DCSession, String sourceModelXML, String newModelXML);

    String getBpmnTemplateModelByName(String templateName) throws IOException, URISyntaxException;

    List<ModelIntegratedEntity> getMyStartEnableModel(JB4DCSession session);

    FlowModelIntegratedPO getLastSavePOByModelReKey(JB4DCSession jb4DSession, String modelReKey) throws IOException;

    ModelIntegratedEntity getLastDeployedPOByModelReKey(JB4DCSession jb4DSession, String modelReKey);

    ModelIntegratedEntity getLastDeployedPOByDefinitionId(JB4DCSession jb4DSession, String processDefinitionId);

    BpmnDefinitions getLastDeployedCamundaModelBpmnDefinitions(JB4DCSession jb4DCSession, String modelReKey) throws IOException, JAXBException, XMLStreamException;

    BpmnDefinitions getDeployedCamundaModelBpmnDefinitions(JB4DCSession jb4DCSession, String processDefinitionId) throws IOException, JAXBException, XMLStreamException;

    List<BpmnTask> getDeployedCamundaModelBpmnFlowNodeByIdList(JB4DCSession jb4DCSession, String modelReKey, BpmnDefinitions bpmnDefinitions, List<String> bpmnTaskIdList) throws JAXBException, XMLStreamException, IOException;

    List<ModelIntegratedEntity> getListByPrimaryKey(JB4DCSession jb4DCSession,List<String> modelIds);
}
