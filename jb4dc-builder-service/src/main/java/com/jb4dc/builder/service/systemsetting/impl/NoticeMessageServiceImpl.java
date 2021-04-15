package com.jb4dc.builder.service.systemsetting.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.systemsetting.NoticeMessageMapper;
import com.jb4dc.builder.dbentities.systemsetting.NoticeMessageEntity;
import com.jb4dc.builder.service.systemsetting.INoticeMessageService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

public class NoticeMessageServiceImpl extends BaseServiceImpl<NoticeMessageEntity> implements INoticeMessageService
{
    NoticeMessageMapper noticeMessageMapper;
    public NoticeMessageServiceImpl(NoticeMessageMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        noticeMessageMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, NoticeMessageEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<NoticeMessageEntity>() {
            @Override
            public NoticeMessageEntity run(JB4DCSession jb4DCSession,NoticeMessageEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
