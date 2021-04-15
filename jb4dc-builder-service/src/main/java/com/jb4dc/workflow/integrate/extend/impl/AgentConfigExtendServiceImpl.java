package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dao.AgentConfigMapper;
import com.jb4dc.workflow.dbentities.AgentConfigEntity;
import com.jb4dc.workflow.integrate.extend.IAgentConfigExtendService;

public class AgentConfigExtendServiceImpl extends BaseServiceImpl<AgentConfigEntity> implements IAgentConfigExtendService
{
    AgentConfigMapper agentConfigMapper;
    public AgentConfigExtendServiceImpl(AgentConfigMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        agentConfigMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, AgentConfigEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<AgentConfigEntity>() {
            @Override
            public AgentConfigEntity run(JB4DCSession jb4DCSession,AgentConfigEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}