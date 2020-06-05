package com.jb4dc.builder.service.site.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.site.SiteTemplateMapper;
import com.jb4dc.builder.dbentities.site.SiteTemplateEntity;
import com.jb4dc.builder.service.site.ISiteTemplateService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/6/5
 * To change this template use File | Settings | File Templates.
 */
public class SiteTemplateServiceImpl extends BaseServiceImpl<SiteTemplateEntity> implements ISiteTemplateService
{
    SiteTemplateMapper siteTemplateMapper;
    public SiteTemplateServiceImpl(SiteTemplateMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        siteTemplateMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, SiteTemplateEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<SiteTemplateEntity>() {
            @Override
            public SiteTemplateEntity run(JB4DCSession jb4DCSession,SiteTemplateEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}

