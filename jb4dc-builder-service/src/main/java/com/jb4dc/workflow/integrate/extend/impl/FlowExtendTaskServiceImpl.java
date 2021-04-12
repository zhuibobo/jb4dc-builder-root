package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.integrate.engine.IFlowEngineTaskIntegratedService;
import com.jb4dc.workflow.integrate.extend.IFlowExtendTaskService;
import liquibase.pro.packaged.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class FlowExtendTaskServiceImpl implements IFlowExtendTaskService {

    @Autowired
    IFlowEngineTaskIntegratedService flowEngineTaskIntegratedService;

    @Override
    @Transactional(rollbackFor= JBuild4DCGenerallyException.class)
    public void complete(JB4DCSession jb4DCSession, String taskId, Map<String, Object> vars) throws JBuild4DCGenerallyException{
        flowEngineTaskIntegratedService.complete(taskId,vars);
        //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"异常中断");
    }
}
