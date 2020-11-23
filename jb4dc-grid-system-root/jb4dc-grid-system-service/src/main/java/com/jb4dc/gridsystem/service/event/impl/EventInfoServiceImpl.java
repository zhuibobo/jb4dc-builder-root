package com.jb4dc.gridsystem.service.event.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.event.EventInfoMapper;
import com.jb4dc.gridsystem.dbentities.event.EventInfoEntity;
import com.jb4dc.gridsystem.service.event.IEventInfoService;

public class EventInfoServiceImpl extends BaseServiceImpl<EventInfoEntity> implements IEventInfoService
{
    EventInfoMapper eventInfoMapper;
    public EventInfoServiceImpl(EventInfoMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        eventInfoMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, EventInfoEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<EventInfoEntity>() {
            @Override
            public EventInfoEntity run(JB4DCSession jb4DCSession,EventInfoEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
