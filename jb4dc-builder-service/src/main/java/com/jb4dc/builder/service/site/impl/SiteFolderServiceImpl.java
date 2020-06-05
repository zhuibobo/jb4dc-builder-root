package com.jb4dc.builder.service.site.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.site.SiteFolderMapper;
import com.jb4dc.builder.dbentities.site.SiteFolderEntity;
import com.jb4dc.builder.service.site.ISiteFolderService;
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
public class SiteFolderServiceImpl extends BaseServiceImpl<SiteFolderEntity> implements ISiteFolderService
{
    SiteFolderMapper siteFolderMapper;
    public SiteFolderServiceImpl(SiteFolderMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        siteFolderMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, SiteFolderEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<SiteFolderEntity>() {
            @Override
            public SiteFolderEntity run(JB4DCSession jb4DCSession,SiteFolderEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
