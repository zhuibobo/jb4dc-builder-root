package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dao.ExecutionTaskLogMapper;
import com.jb4dc.workflow.dbentities.ExecutionTaskLogEntityWithBLOBs;
import com.jb4dc.workflow.integrate.extend.IExecutionTaskLogExtendService;

public class ExecutionTaskLogExtendServiceImpl  extends BaseServiceImpl<ExecutionTaskLogEntityWithBLOBs> implements IExecutionTaskLogExtendService
{
    ExecutionTaskLogMapper executionTaskLogMapper;
    public ExecutionTaskLogExtendServiceImpl(ExecutionTaskLogMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        executionTaskLogMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ExecutionTaskLogEntityWithBLOBs record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<ExecutionTaskLogEntityWithBLOBs>() {
            @Override
            public ExecutionTaskLogEntityWithBLOBs run(JB4DCSession jb4DCSession,ExecutionTaskLogEntityWithBLOBs sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}