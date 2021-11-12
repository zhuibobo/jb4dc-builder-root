package com.jb4dc.workflow.integrate.engine;

import com.jb4dc.core.base.session.JB4DCSession;
import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;
import org.camunda.bpm.engine.runtime.Execution;

import java.util.List;

public interface IFlowEngineExecutionIntegratedService {
    Execution getExecutionById(JB4DCSession jb4DCSession, String executionId);

    //Execution getSingleScopeExecutionByProcessInstanceId(String processInstanceId);

    //List<Execution> getExecutionByProcessInstanceId(String processInstanceId);

    List<ExecutionEntity> getIsActivityNodeExecution(JB4DCSession jb4DCSession, String processInstanceId);

    List<ExecutionEntity> getNodeExecution(JB4DCSession jb4DCSession, String processInstanceId);

    //List<String> getCurrentActivityNodeIds(JB4DCSession jb4DCSession, String processInstanceId);

    List<String> getCurrentActivityNodeIds(JB4DCSession jb4DCSession, String processInstanceId,boolean includeNotActive);

    boolean isProcessInstanceExecution(JB4DCSession jb4DCSession, Execution execution);

    boolean isScopeExecution(JB4DCSession jb4DCSession, Execution execution);

    boolean isMultiInstance(JB4DCSession jb4DCSession, String executionId);

    int multiCountEngInstances(JB4DCSession jb4DCSession, String executionId);

    int multiCompletedInstances(JB4DCSession jb4DCSession, String executionId);

    int multiActiveInstances(JB4DCSession jb4DCSession, String executionId);
}
