package com.jb4dc.workflow.integrate.engine;

import com.jb4dc.workflow.exenum.ModelDesignSourceTypeEnum;
import com.jb4dc.workflow.exenum.ModelTenantIdEnum;
import com.jb4dc.core.base.session.JB4DCSession;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/1/6
 * To change this template use File | Settings | File Templates.
 */
public interface IFlowEngineModelIntegratedService {

    void deploymentCamundaModel(JB4DCSession jb4DSession, String name, ModelDesignSourceTypeEnum sourceTypeEnum, ModelTenantIdEnum modelTenantIdEnum, InputStream is) throws FileNotFoundException;

    BpmnModelInstance getDeployedCamundaBpmnModelByKey(JB4DCSession jb4DSession, String processDefinitionKey, ModelTenantIdEnum modelTenantIdEnum);

    BpmnModelInstance getDeployedCamundaBpmnModel(JB4DCSession jb4DSession, String processDefinitionId, ModelTenantIdEnum modelTenantIdEnum);

    List<ProcessDefinition> getDeployedCamundaModelLatestVersionList(JB4DCSession jb4DSession, ModelTenantIdEnum modelTenantIdEnum);

    List<ProcessDefinition> getDeployedCamundaModelList(JB4DCSession jb4DSession, String processDefinitionKey, ModelTenantIdEnum modelTenantIdEnum);

    ProcessDefinition getDeployedCamundaModelLastVersion(JB4DCSession jb4DSession, String processDefinitionKey, ModelTenantIdEnum modelTenantIdEnum);

    void clearAllDeployedModel(JB4DCSession jb4DSession);
}
