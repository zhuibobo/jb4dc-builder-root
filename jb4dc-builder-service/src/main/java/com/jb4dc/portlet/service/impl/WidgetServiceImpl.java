package com.jb4dc.portlet.service.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.portlet.dao.WidgetMapper;
import com.jb4dc.portlet.dbentities.WidgetEntity;
import com.jb4dc.portlet.service.IWidgetService;

public class WidgetServiceImpl extends BaseServiceImpl<WidgetEntity> implements IWidgetService
{
    WidgetMapper widgetMapper;
    public WidgetServiceImpl(WidgetMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        widgetMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, WidgetEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<WidgetEntity>() {
            @Override
            public WidgetEntity run(JB4DCSession jb4DCSession,WidgetEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
