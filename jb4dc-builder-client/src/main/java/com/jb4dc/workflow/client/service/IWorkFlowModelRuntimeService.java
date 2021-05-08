package com.jb4dc.workflow.client.service;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.po.FlowModelListIntegratedPO;
import com.jb4dc.workflow.po.FlowModelRuntimePO;

import java.io.IOException;

public interface IWorkFlowModelRuntimeService extends IWorkFlowRuntimeService {

    JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModel(String userId);

    JBuild4DCResponseVo<FlowModelRuntimePO> getRuntimeModelWithStart(String userId, String modelKey) throws IOException, JBuild4DCGenerallyException;
}
