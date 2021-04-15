package com.jb4dc.workflow.integrate.engine.impl;

import com.jb4dc.workflow.integrate.engine.IFlowEngineTaskIntegratedService;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class FlowEngineTaskIntegratedServiceImpl extends FlowEngineCamundaIntegrateAbstractService implements IFlowEngineTaskIntegratedService {

    private Logger logger= LoggerFactory.getLogger(FlowEngineTaskIntegratedServiceImpl.class);

    public FlowEngineTaskIntegratedServiceImpl() {
        //super(_defaultBaseMapper);
    }

    @Override
    public List<Task> getTasks(String processInstanceId){
        ProcessEngine processEngine=CamundaIntegrate.getProcessEngine();
        return processEngine.getTaskService().createTaskQuery().processInstanceId(processInstanceId).list();
    }

    @Override
    public void complete(String taskId, Map<String,Object> vars){
        TaskService taskService=getTaskService();
        taskService.complete(taskId,vars);
    }
}
