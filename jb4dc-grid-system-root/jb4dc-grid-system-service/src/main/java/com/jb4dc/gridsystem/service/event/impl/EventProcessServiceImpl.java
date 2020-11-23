package com.jb4dc.gridsystem.service.event.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.event.EventProcessMapper;
import com.jb4dc.gridsystem.dbentities.event.EventProcessEntity;
import com.jb4dc.gridsystem.service.event.IEventProcessService;

public class EventProcessServiceImpl extends BaseServiceImpl<EventProcessEntity> implements IEventProcessService
{
    EventProcessMapper eventProcessMapper;
    public EventProcessServiceImpl(EventProcessMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        eventProcessMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, EventProcessEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<EventProcessEntity>() {
            @Override
            public EventProcessEntity run(JB4DCSession jb4DCSession,EventProcessEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
