package com.jb4dc.workflow.integrate.engine.impl;

import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.workflow.integrate.engine.IFlowEngineHistoryIntegratedService;
import com.jb4dc.workflow.po.HistoricActivityInstancePO;
import org.camunda.bpm.engine.history.HistoricActivityInstance;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class FlowEngineHistoryIntegratedServiceImpl extends FlowEngineCamundaIntegrateAbstractService implements IFlowEngineHistoryIntegratedService {

    @Override
    public List<HistoricActivityInstancePO> getHistoricActivityInstancePOByProcessInstanceId(String processInstanceId) throws IOException {
        if(StringUtility.isNotEmpty(processInstanceId)) {
            List<HistoricActivityInstance> historicActivityInstanceEntityList = getHistoryService().createHistoricActivityInstanceQuery().processInstanceId(processInstanceId).list();
            if (historicActivityInstanceEntityList != null) {
                List<HistoricActivityInstancePO> historicActivityInstancePOList = JsonUtility.parseEntityListToPOList(historicActivityInstanceEntityList, HistoricActivityInstancePO.class);
                return historicActivityInstancePOList;
            }
        }
        return new ArrayList<>();
    }
}
