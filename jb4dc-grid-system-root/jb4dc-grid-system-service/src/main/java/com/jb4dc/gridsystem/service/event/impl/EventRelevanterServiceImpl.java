package com.jb4dc.gridsystem.service.event.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.event.EventRelevanterMapper;
import com.jb4dc.gridsystem.dbentities.event.EventRelevanterEntity;
import com.jb4dc.gridsystem.service.event.IEventRelevanterService;

public class EventRelevanterServiceImpl extends BaseServiceImpl<EventRelevanterEntity> implements IEventRelevanterService
{
    EventRelevanterMapper eventRelevanterMapper;
    public EventRelevanterServiceImpl(EventRelevanterMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        eventRelevanterMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, EventRelevanterEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<EventRelevanterEntity>() {
            @Override
            public EventRelevanterEntity run(JB4DCSession jb4DCSession,EventRelevanterEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}