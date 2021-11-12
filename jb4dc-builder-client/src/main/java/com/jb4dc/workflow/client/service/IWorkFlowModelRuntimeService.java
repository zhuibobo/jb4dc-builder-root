package com.jb4dc.workflow.client.service;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.po.FlowModelListIntegratedPO;

import java.io.IOException;

public interface IWorkFlowModelRuntimeService extends IWorkFlowRuntimeService {

    JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModel(JB4DCSession jb4DCSession, String userId, String organId) throws JBuild4DCGenerallyException;

    JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModel(JB4DCSession session, String menuId, String userId, String organId) throws JBuild4DCGenerallyException, IOException;

    /*JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithStart(String userId, String modelKey) throws IOException, JBuild4DCGenerallyException;*/
}
