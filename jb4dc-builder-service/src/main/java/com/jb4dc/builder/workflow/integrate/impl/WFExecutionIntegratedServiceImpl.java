package com.jb4dc.builder.workflow.integrate.impl;

import com.jb4dc.builder.workflow.integrate.IWFExecutionIntegratedService;
import com.jb4dc.core.base.session.JB4DCSession;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;
import org.camunda.bpm.engine.runtime.Execution;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WFExecutionIntegratedServiceImpl implements IWFExecutionIntegratedService {

    @Override
    public Execution getExecutionById(JB4DCSession jb4DCSession, String executionId){
        ProcessEngine processEngine=CamundaIntegrate.getProcessEngine();
        Execution execution=processEngine.getRuntimeService().createExecutionQuery().executionId(executionId).singleResult();
        return execution;
    }

    @Override
    public List<ExecutionEntity> getIsActivityNodeExecution(JB4DCSession jb4DCSession,String processInstanceId){
        ProcessEngine processEngine=CamundaIntegrate.getProcessEngine();
        List<ExecutionEntity> result=new ArrayList<>();

        List<Execution> executionEntityList=processEngine.getRuntimeService().createExecutionQuery().processInstanceId(processInstanceId).list();
        for (Execution execution : executionEntityList) {
            if(((ExecutionEntity)execution).isActive()){
                result.add((ExecutionEntity)execution);
            }
        }
        return result;
    }

    @Override
    public List<String> getCurrentActivityNodeIds(JB4DCSession jb4DCSession,String processInstanceId){
        List<ExecutionEntity> executionEntityList=getIsActivityNodeExecution(jb4DCSession,processInstanceId);
        List<String> result=new ArrayList<>();
        for (ExecutionEntity executionEntity : executionEntityList) {
            if(!result.contains(executionEntity.getActivityId())){
                result.add(executionEntity.getActivityId());
            }
        }
        return result;
    }

    /*@Override
    public Execution getSingleScopeExecutionByProcessInstanceId(String processInstanceId){
        List<Execution> executionList=getExecutionByProcessInstanceId(processInstanceId);
        for (Execution execution : executionList) {
            if(isScopeExecution(execution)){
                return execution;
            }
        }
        return null;
    }

    @Override
    public List<Execution> getExecutionByProcessInstanceId(String processInstanceId){
        ProcessEngine processEngine=CamundaIntegrate.getProcessEngine();
        return processEngine.getRuntimeService().createExecutionQuery().active().processInstanceId(processInstanceId).list();
    }*/

    @Override
    public boolean isProcessInstanceExecution(JB4DCSession jb4DCSession,Execution execution){
        return ((ExecutionEntity)execution).isProcessInstanceExecution();
    }

    @Override
    public boolean isScopeExecution(JB4DCSession jb4DCSession,Execution execution){
        ExecutionEntity executionEntity=(ExecutionEntity)execution;
        if(!executionEntity.isProcessInstanceExecution()&&executionEntity.isScope()){
            return true;
        }
        return false;
        //if((isConcurrent ? "Concurrent" : "") + (isScope ? "Scope" : "") + "Execution[" + getToStringIdentity() + "]";)
    }

    @Override
    public boolean isMultiInstance(JB4DCSession jb4DCSession,String executionId){
        ProcessEngine processEngine=CamundaIntegrate.getProcessEngine();
        Object nrOfInstances = processEngine.getRuntimeService().getVariable(executionId, "nrOfInstances");
        if(nrOfInstances==null){
            return false;
        }
        return true;
    }

    @Override
    public int multiCountInstances(JB4DCSession jb4DCSession,String executionId){
        ProcessEngine processEngine=CamundaIntegrate.getProcessEngine();
        Object nrOfInstances = processEngine.getRuntimeService().getVariable(executionId, "nrOfInstances");
        return Integer.parseInt(String.valueOf(nrOfInstances));
    }

    @Override
    public int multiCompletedInstances(JB4DCSession jb4DCSession,String executionId){
        ProcessEngine processEngine=CamundaIntegrate.getProcessEngine();
        Object nrOfInstances = processEngine.getRuntimeService().getVariable(executionId, "nrOfCompletedInstances");
        return Integer.parseInt(String.valueOf(nrOfInstances));
    }

    @Override
    public int multiActiveInstances(JB4DCSession jb4DCSession,String executionId){
        ProcessEngine processEngine=CamundaIntegrate.getProcessEngine();
        Object nrOfInstances = processEngine.getRuntimeService().getVariable(executionId, "nrOfActiveInstances");
        return Integer.parseInt(String.valueOf(nrOfInstances));
    }
}
