package com.jb4dc.workflow.integrate.engine.impl;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.builder.dao.flow.FlowIntegratedMapper;
import com.jb4dc.builder.dbentities.flow.FlowIntegratedEntity;
import com.jb4dc.builder.po.FlowIntegratedPO;
import com.jb4dc.workflow.exenum.ModelDesignSourceTypeEnum;
import com.jb4dc.workflow.exenum.ModelTenantIdEnum;
import com.jb4dc.workflow.integrate.engine.IFlowEngineModelIntegratedService;
import com.jb4dc.workflow.custpo.bpmn.BpmnDefinitions;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.BaseUtility;
import com.jb4dc.core.base.tools.DateUtility;
import com.jb4dc.core.base.tools.IMustBeUnique;
import com.jb4dc.core.base.tools.ValidateUtility;
import com.jb4dc.files.dbentities.FileInfoEntity;
import com.jb4dc.files.service.IFileInfoService;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.repository.Deployment;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/25
 * To change this template use File | Settings | File Templates.
 */
@Service
@Lazy
public class FlowEngineModelIntegrateServiceImpl extends FlowEngineCamundaIntegrateAbstractService implements IFlowEngineModelIntegratedService
{
    @Override
    public void deploymentCamundaModel(JB4DCSession jb4DSession, String name, ModelDesignSourceTypeEnum sourceTypeEnum, ModelTenantIdEnum modelTenantIdEnum, InputStream is) throws FileNotFoundException {
        //通过模型的设计id,与租户确认唯一性
        RepositoryService repositoryService = getRepositoryService();
        repositoryService.createDeployment()
                .name(name)
                .source(sourceTypeEnum.getDisplayName())
                .tenantId(modelTenantIdEnum.getDisplayName())
                .addInputStream(DateUtility.getDate_yyyyMMddHHmmssSSS()+".bpmn", is)
                .deploy();

        //getProcessEngine().getRepositoryService().crea
    }

    @Override
    public BpmnModelInstance getDeployedCamundaBpmnModelByKey(JB4DCSession jb4DSession, String processDefinitionKey, ModelTenantIdEnum modelTenantIdEnum){
        ProcessDefinition processDefinition= getDeployedCamundaModelLastVersion(jb4DSession,processDefinitionKey,modelTenantIdEnum);
        return getDeployedCamundaBpmnModel(jb4DSession,processDefinition.getId(),modelTenantIdEnum);
    }

    @Override
    public BpmnModelInstance getDeployedCamundaBpmnModel(JB4DCSession jb4DSession, String processDefinitionId, ModelTenantIdEnum modelTenantIdEnum){
        RepositoryService repositoryService=getRepositoryService();
        return repositoryService.getBpmnModelInstance(processDefinitionId);
    }

    @Override
    public List<ProcessDefinition> getDeployedCamundaModelLatestVersionList(JB4DCSession jb4DSession, ModelTenantIdEnum modelTenantIdEnum){
        RepositoryService repositoryService = getRepositoryService();
        return repositoryService.createProcessDefinitionQuery().tenantIdIn(modelTenantIdEnum.getDisplayName()).latestVersion().list();
    }

    @Override
    public List<ProcessDefinition> getDeployedCamundaModelList(JB4DCSession jb4DSession, String processDefinitionKey, ModelTenantIdEnum modelTenantIdEnum){
        RepositoryService repositoryService = getRepositoryService();
        return repositoryService.createProcessDefinitionQuery().tenantIdIn(modelTenantIdEnum.getDisplayName()).processDefinitionKey(processDefinitionKey).list();
    }

    @Override
    public ProcessDefinition getDeployedCamundaModelLastVersion(JB4DCSession jb4DSession, String processDefinitionKey, ModelTenantIdEnum modelTenantIdEnum){
        RepositoryService repositoryService = getRepositoryService();
        return repositoryService.createProcessDefinitionQuery().tenantIdIn(modelTenantIdEnum.getDisplayName()).processDefinitionKey(processDefinitionKey).latestVersion().singleResult();
    }

    @Override
    public void clearAllDeployedModel(JB4DCSession jb4DSession){
        RepositoryService repositoryService=getRepositoryService();
        List<ProcessDefinition> processDefinitionList=repositoryService.createProcessDefinitionQuery().list();
        List<String> idList=processDefinitionList.stream().map(pd->pd.getId()).collect(Collectors.toList());
        String[] ids= idList.stream().toArray(String[]::new);
        repositoryService.deleteProcessDefinitions().byIds(ids).delete();

        List<Deployment> deploymentList=repositoryService.createDeploymentQuery().list();
        idList=deploymentList.stream().map(pd->pd.getId()).collect(Collectors.toList());
        ids= idList.stream().toArray(String[]::new);
        for (String id : ids) {
            repositoryService.deleteDeployment(id);
        }
        //for (ProcessDefinition processDefinition : processDefinitionList) {
            //repositoryService.deleteProcessDefinitions().byIds(processDefinitionList.stream().collect(pd->pd.)).delete();
        //}
    }
}
