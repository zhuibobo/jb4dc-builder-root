package com.jb4dc.gridsystem.service.setting.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.setting.AppVersionMapper;
import com.jb4dc.gridsystem.dbentities.setting.AppVersionEntity;
import com.jb4dc.gridsystem.service.setting.IAppVersionService;
import org.springframework.stereotype.Service;

@Service
public class AppVersionServiceImpl extends BaseServiceImpl<AppVersionEntity> implements IAppVersionService
{
    AppVersionMapper appVersionMapper;
    public AppVersionServiceImpl(AppVersionMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        appVersionMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, AppVersionEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<AppVersionEntity>() {
            @Override
            public AppVersionEntity run(JB4DCSession jb4DCSession,AppVersionEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public AppVersionEntity getByLastPublicVersion(String appName) {
        return appVersionMapper.selectByLastPublicVersion(appName);
    }

    @Override
    public AppVersionEntity getByLastPrePublicVersion(String appName) {
        return appVersionMapper.selectByLastPrePublicVersion(appName);
    }
}