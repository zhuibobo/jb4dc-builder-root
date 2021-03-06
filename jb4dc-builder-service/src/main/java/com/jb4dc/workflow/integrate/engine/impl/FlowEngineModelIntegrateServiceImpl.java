package com.jb4dc.workflow.integrate.engine.impl;
import java.io.FileNotFoundException;

import com.jb4dc.workflow.exenum.ModelDesignSourceTypeEnum;
import com.jb4dc.workflow.exenum.ModelTenantIdEnum;
import com.jb4dc.workflow.integrate.engine.IFlowEngineModelIntegratedService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.DateUtility;
import org.apache.commons.io.IOUtils;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.repository.Deployment;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
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
    public Deployment deploymentCamundaModel(JB4DCSession jb4DSession, String name, ModelDesignSourceTypeEnum sourceTypeEnum, ModelTenantIdEnum modelTenantIdEnum, InputStream is) throws FileNotFoundException {
        //通过模型的设计id,与租户确认唯一性
        RepositoryService repositoryService = getRepositoryService();
        return repositoryService.createDeployment()
                .name(name)
                .source(sourceTypeEnum.getDisplayName())
                .tenantId(modelTenantIdEnum.getDisplayName())
                .addInputStream(DateUtility.getDate_yyyyMMddHHmmssSSS()+".bpmn", is)
                .deploy();
    }

    @Override
    public Deployment deploymentCamundaModel(JB4DCSession jb4DSession, String name, ModelDesignSourceTypeEnum sourceTypeEnum, ModelTenantIdEnum modelTenantIdEnum, String modelContent) {
        //通过模型的设计id,与租户确认唯一性
        RepositoryService repositoryService = getRepositoryService();
        return repositoryService.createDeployment()
                .name(name)
                .source(sourceTypeEnum.getDisplayName())
                .tenantId(modelTenantIdEnum.getDisplayName())
                .addString(DateUtility.getDate_yyyyMMddHHmmssSSS()+".bpmn", modelContent)
                .deploy();
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
    public ProcessDefinition getProcessDefinitionByDeploymentId(JB4DCSession jb4DSession, String deploymentId){
        RepositoryService repositoryService = getRepositoryService();
        return repositoryService.createProcessDefinitionQuery().deploymentId(deploymentId).singleResult();
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
    public ProcessDefinition getDeployedCamundaModel(JB4DCSession jb4DSession, String processDefinitionId){
        RepositoryService repositoryService = getRepositoryService();
        return repositoryService.createProcessDefinitionQuery().processDefinitionId(processDefinitionId).singleResult();
    }

    @Override
    public String getDeployedCamundaModelContent(JB4DCSession jb4DSession, String processDefinitionId) throws IOException {
        ProcessDefinition processDefinition=getDeployedCamundaModel(jb4DSession,processDefinitionId);
        RepositoryService repositoryService=getRepositoryService();
        InputStream is=repositoryService.getResourceAsStream(processDefinition.getDeploymentId(),processDefinition.getResourceName());
        StringWriter writer = new StringWriter();
        IOUtils.copy(is, writer, StandardCharsets.UTF_8);
        String result = writer.toString();
        return result;
    }

    @Override
    public ProcessDefinition getDeployedCamundaModelLastVersion(JB4DCSession jb4DSession, String processDefinitionKey, ModelTenantIdEnum modelTenantIdEnum){
        RepositoryService repositoryService = getRepositoryService();
        return repositoryService.createProcessDefinitionQuery().tenantIdIn(modelTenantIdEnum.getDisplayName()).processDefinitionKey(processDefinitionKey).latestVersion().singleResult();
    }

    @Override
    public String getDeployedCamundaModelContentLastVersion(JB4DCSession jb4DSession, String processDefinitionKey, ModelTenantIdEnum modelTenantIdEnum) throws IOException {
        ProcessDefinition processDefinition=getDeployedCamundaModelLastVersion(jb4DSession,processDefinitionKey,modelTenantIdEnum);
        RepositoryService repositoryService=getRepositoryService();
        InputStream is=repositoryService.getResourceAsStream(processDefinition.getDeploymentId(),processDefinition.getResourceName());
        StringWriter writer = new StringWriter();
        IOUtils.copy(is, writer, StandardCharsets.UTF_8);
        String result = writer.toString();
        return result;
        //BpmnModelInstance bpmnModelInstance=getDeployedCamundaBpmnModelByKey(jb4DSession,processDefinitionKey,modelTenantIdEnum);
        //return bpmnModelInstance.toString();
        //processDefinition.
        //return "";
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
