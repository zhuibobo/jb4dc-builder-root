package com.jb4dc.builder.service.site.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.site.SiteResourceMapper;
import com.jb4dc.builder.dbentities.site.SiteResourceEntity;
import com.jb4dc.builder.service.site.ISiteResourceService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.stereotype.Service;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/6/5
 * To change this template use File | Settings | File Templates.
 */
@Service
public class SiteResourceServiceImpl extends BaseServiceImpl<SiteResourceEntity> implements ISiteResourceService
{
    SiteResourceMapper siteResourceMapper;
    public SiteResourceServiceImpl(SiteResourceMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        siteResourceMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, SiteResourceEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<SiteResourceEntity>() {
            @Override
            public SiteResourceEntity run(JB4DCSession jb4DCSession,SiteResourceEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}