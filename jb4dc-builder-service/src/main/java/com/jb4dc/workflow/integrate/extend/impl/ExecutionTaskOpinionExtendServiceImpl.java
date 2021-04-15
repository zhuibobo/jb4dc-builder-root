package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dao.ExecutionTaskOpinionMapper;
import com.jb4dc.workflow.dbentities.ExecutionTaskOpinionEntity;
import com.jb4dc.workflow.integrate.extend.IExecutionTaskOpinionExtendService;

public class ExecutionTaskOpinionExtendServiceImpl extends BaseServiceImpl<ExecutionTaskOpinionEntity> implements IExecutionTaskOpinionExtendService
{
    ExecutionTaskOpinionMapper executionTaskOpinionMapper;
    public ExecutionTaskOpinionExtendServiceImpl(ExecutionTaskOpinionMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        executionTaskOpinionMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ExecutionTaskOpinionEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<ExecutionTaskOpinionEntity>() {
            @Override
            public ExecutionTaskOpinionEntity run(JB4DCSession jb4DCSession, ExecutionTaskOpinionEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}