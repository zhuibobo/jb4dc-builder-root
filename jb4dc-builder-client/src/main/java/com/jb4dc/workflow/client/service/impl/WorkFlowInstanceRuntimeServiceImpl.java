package com.jb4dc.workflow.client.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.client.remote.FlowInstanceIntegratedRuntimeRemote;
import com.jb4dc.workflow.client.service.IWorkFlowInstanceRuntimeService;
import com.jb4dc.workflow.po.FlowModelRuntimePO;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import com.jb4dc.workflow.po.bpmn.process.BpmnUserTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WorkFlowInstanceRuntimeServiceImpl extends WorkFlowRuntimeServiceImpl implements IWorkFlowInstanceRuntimeService {

    @Autowired
    FlowInstanceIntegratedRuntimeRemote flowInstanceIntegratedRuntimeRemote;

    @Override
    public JBuild4DCResponseVo<List<BpmnTask>> resolveNextPossibleUseTaskWithStartNode(JB4DCSession jb4DCSession,
                                                                                           String actionCode,
                                                                                           String flowModelRuntimePOCacheKey,
                                                                                           FormRecordComplexPO formRecordComplexPO,
                                                                                           Map<String, Object> exVars) throws IOException, JBuild4DCGenerallyException {

        FlowModelRuntimePO flowModelRuntimePO=getLoadingStatusFlowModelRuntimePOFromCache(flowModelRuntimePOCacheKey);

        Map<String,Object> formParams=new HashMap<>();
        formParams.put("userId",jb4DCSession.getUserId());
        formParams.put("modelKey",flowModelRuntimePO.getModelRuKey());
        formParams.put("currentNodeKey",flowModelRuntimePO.getCurrentNodeKey());
        formParams.put("actionCode",actionCode);

        Map<String,Object> vars=parseDefaultFlowModelRuntimePOToJuelVars(jb4DCSession,flowModelRuntimePO,formRecordComplexPO);
        if(exVars!=null&&exVars.size()>0) {
            vars.putAll(exVars);
        }
        formParams.put("varsJsonString", JsonUtility.toObjectString(vars));

        JBuild4DCResponseVo<List<BpmnTask>> result = flowInstanceIntegratedRuntimeRemote.resolveNextPossibleUseTaskWithStartNode(formParams);
        return result;
    }
}
