package com.jb4dc.builder.service.site.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.site.SiteInfoMapper;
import com.jb4dc.builder.dbentities.site.SiteInfoEntity;
import com.jb4dc.builder.service.site.ISiteInfoService;
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
public class SiteInfoServiceImpl extends BaseServiceImpl<SiteInfoEntity> implements ISiteInfoService
{
    SiteInfoMapper siteInfoMapper;
    public SiteInfoServiceImpl(SiteInfoMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        siteInfoMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, SiteInfoEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<SiteInfoEntity>() {
            @Override
            public SiteInfoEntity run(JB4DCSession jb4DCSession,SiteInfoEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}

