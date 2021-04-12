package com.jb4dc.workflow.integrate.engine;

import org.camunda.bpm.engine.task.Task;

import java.util.List;
import java.util.Map;

public interface IFlowEngineTaskIntegratedService {

    List<Task> getTasks(String processInstanceId);

    void complete(String taskId, Map<String, Object> vars);
}
