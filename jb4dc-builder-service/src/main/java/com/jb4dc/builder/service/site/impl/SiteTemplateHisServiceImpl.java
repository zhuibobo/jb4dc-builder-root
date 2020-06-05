package com.jb4dc.builder.service.site.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.site.SiteTemplateHisMapper;
import com.jb4dc.builder.dbentities.site.SiteTemplateHisEntity;
import com.jb4dc.builder.service.site.ISiteTemplateHisService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/6/5
 * To change this template use File | Settings | File Templates.
 */
public class SiteTemplateHisServiceImpl extends BaseServiceImpl<SiteTemplateHisEntity> implements ISiteTemplateHisService
{
    SiteTemplateHisMapper siteTemplateHisMapper;
    public SiteTemplateHisServiceImpl(SiteTemplateHisMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        siteTemplateHisMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, SiteTemplateHisEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<SiteTemplateHisEntity>() {
            @Override
            public SiteTemplateHisEntity run(JB4DCSession jb4DCSession,SiteTemplateHisEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
