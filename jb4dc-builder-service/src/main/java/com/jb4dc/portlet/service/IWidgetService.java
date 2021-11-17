package com.jb4dc.portlet.service;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.portlet.dbentities.WidgetEntity;

import java.util.List;

public interface IWidgetService extends IBaseService<WidgetEntity> {
    void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException;

    List<WidgetEntity> getALLWithBLOBs(JB4DCSession session);
}
