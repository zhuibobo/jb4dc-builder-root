package com.jb4dc.workflow.integrate.engine;

import com.jb4dc.workflow.po.HistoricActivityInstancePO;
import org.camunda.bpm.engine.task.Task;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IFlowEngineHistoryIntegratedService {

    List<HistoricActivityInstancePO> getHistoricActivityInstancePOByProcessInstanceId(String processInstanceId) throws IOException;
}
