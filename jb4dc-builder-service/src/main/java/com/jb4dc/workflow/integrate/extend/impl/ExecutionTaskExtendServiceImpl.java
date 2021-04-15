package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dao.ExecutionTaskMapper;
import com.jb4dc.workflow.dbentities.ExecutionTaskEntity;
import com.jb4dc.workflow.integrate.engine.IFlowEngineTaskIntegratedService;
import com.jb4dc.workflow.integrate.extend.IExecutionTaskExtendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class ExecutionTaskExtendServiceImpl  extends BaseServiceImpl<ExecutionTaskEntity> implements IExecutionTaskExtendService {

    @Autowired
    IFlowEngineTaskIntegratedService flowEngineTaskIntegratedService;

    @Override
    @Transactional(rollbackFor= JBuild4DCGenerallyException.class)
    public void complete(JB4DCSession jb4DCSession, String taskId, Map<String, Object> vars) throws JBuild4DCGenerallyException{
        flowEngineTaskIntegratedService.complete(taskId,vars);
        //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"异常中断");
    }

    ExecutionTaskMapper executionTaskMapper;
    public ExecutionTaskExtendServiceImpl(ExecutionTaskMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        executionTaskMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ExecutionTaskEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<ExecutionTaskEntity>() {
            @Override
            public ExecutionTaskEntity run(JB4DCSession jb4DCSession,ExecutionTaskEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
