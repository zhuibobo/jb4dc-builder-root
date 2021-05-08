package com.jb4dc.workflow.client.service.impl;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.client.remote.FlowModelIntegratedRuntimeRemote;
import com.jb4dc.workflow.client.service.IWorkFlowModelRuntimeService;
import com.jb4dc.workflow.po.FlowModelListIntegratedPO;
import com.jb4dc.workflow.po.FlowModelRuntimePO;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import com.jb4dc.workflow.po.bpmn.process.Jb4dcAction;
import com.jb4dc.workflow.po.bpmn.process.Jb4dcActions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class WorkFlowModelRuntimeServiceImpl extends WorkFlowRuntimeServiceImpl implements IWorkFlowModelRuntimeService {

    @Autowired
    FlowModelIntegratedRuntimeRemote flowModelIntegratedRuntimeRemote;

    @Override
    public JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModel(String userId) {
        return flowModelIntegratedRuntimeRemote.getMyBootableModel(userId);
    }


    @Override
    public JBuild4DCResponseVo<FlowModelRuntimePO> getRuntimeModelWithStart(String userId, String modelKey) throws IOException, JBuild4DCGenerallyException {
        FlowModelRuntimePO flowModelRuntimePO=flowModelIntegratedRuntimeRemote.getRuntimeModelWithStart(userId,modelKey).getData();
        Jb4dcActions jb4dcActions=buildFlowModelRuntimePOBindCurrentActions(JB4DCSessionUtility.getSession(),flowModelRuntimePO,null);
        flowModelRuntimePO.setJb4dcActions(jb4dcActions);
        return JBuild4DCResponseVo.getDataSuccess(flowModelRuntimePO);
        //return null;
    }
}
