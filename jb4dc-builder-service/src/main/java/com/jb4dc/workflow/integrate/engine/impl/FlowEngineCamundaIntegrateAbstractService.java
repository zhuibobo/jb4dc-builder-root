package com.jb4dc.workflow.integrate.engine.impl;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import org.camunda.bpm.engine.*;

public abstract class FlowEngineCamundaIntegrateAbstractService {

    private ProcessEngine processEngine;
    //private TaskService taskService;
    //private RuntimeService runtimeService;
    //private HistoryService historyService;

    public ProcessEngine getProcessEngine() {
        if(processEngine==null){
            processEngine=CamundaIntegrate.getProcessEngine();
        }
        return processEngine;
    }

    public TaskService getTaskService() {
        return getProcessEngine().getTaskService();
    }

    public RuntimeService getRuntimeService() {
        return getProcessEngine().getRuntimeService();
    }

    public HistoryService getHistoryService(){
        return getProcessEngine().getHistoryService();
    }

    public RepositoryService getRepositoryService(){
        return getProcessEngine().getRepositoryService();
    }

    /*public FlowEngineCamundaIntegrateAbstractService(BaseMapper<T> _defaultBaseMapper) {
        super(_defaultBaseMapper);
    }*/

    //public WFCamundaIntegrateAbstractService() {
        /*processEngine=CamundaIntegrate.getProcessEngine();
        taskService=processEngine.getTaskService();
        runtimeService=processEngine.getRuntimeService();*/
    //}

}
