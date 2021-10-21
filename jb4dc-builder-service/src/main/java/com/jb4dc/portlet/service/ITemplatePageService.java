package com.jb4dc.portlet.service;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.portlet.dbentities.TemplatePageEntityWithBLOBs;

public interface ITemplatePageService extends IBaseService<TemplatePageEntityWithBLOBs> {
    void savePageWidgetConfig(JB4DCSession session, String recordId, String pageWidgetConfig) throws JBuild4DCGenerallyException;
}
