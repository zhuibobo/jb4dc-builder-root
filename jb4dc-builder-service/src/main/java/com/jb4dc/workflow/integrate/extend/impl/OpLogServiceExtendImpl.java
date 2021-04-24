package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dao.OpLogMapper;
import com.jb4dc.workflow.dbentities.OpLogEntityWithBLOBs;
import com.jb4dc.workflow.integrate.extend.IOpLogExtendService;

public class OpLogServiceExtendImpl extends BaseServiceImpl<OpLogEntityWithBLOBs> implements IOpLogExtendService
{
    OpLogMapper opLogMapper;
    public OpLogServiceExtendImpl(OpLogMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        opLogMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, OpLogEntityWithBLOBs record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<OpLogEntityWithBLOBs>() {
            @Override
            public OpLogEntityWithBLOBs run(JB4DCSession jb4DCSession,OpLogEntityWithBLOBs sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}