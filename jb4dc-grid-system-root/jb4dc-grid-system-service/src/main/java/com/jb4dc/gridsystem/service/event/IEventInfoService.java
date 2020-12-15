package com.jb4dc.gridsystem.service.event;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dbentities.event.EventInfoEntity;

import java.util.List;

public interface IEventInfoService extends IBaseService<EventInfoEntity> {
    void saveEvent(JB4DCSession jb4DCSession, EventInfoEntity record) throws JBuild4DCGenerallyException;

    PageInfo<EventInfoEntity> getMyEvent(JB4DCSession jb4DCSession, int num, int size);

    void deleteEvent(JB4DCSession jb4DCSession,String eventId) throws JBuild4DCGenerallyException;
}