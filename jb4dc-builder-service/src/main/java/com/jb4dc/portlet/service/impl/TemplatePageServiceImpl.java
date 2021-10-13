package com.jb4dc.portlet.service.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.portlet.dao.TemplatePageMapper;
import com.jb4dc.portlet.dbentities.TemplatePageEntityWithBLOBs;
import com.jb4dc.portlet.service.ITemplatePageService;

public class TemplatePageServiceImpl extends BaseServiceImpl<TemplatePageEntityWithBLOBs> implements ITemplatePageService
{
    TemplatePageMapper templatePageMapper;
    public TemplatePageServiceImpl(TemplatePageMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        templatePageMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, TemplatePageEntityWithBLOBs record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<TemplatePageEntityWithBLOBs>() {
            @Override
            public TemplatePageEntityWithBLOBs run(JB4DCSession jb4DCSession,TemplatePageEntityWithBLOBs sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}