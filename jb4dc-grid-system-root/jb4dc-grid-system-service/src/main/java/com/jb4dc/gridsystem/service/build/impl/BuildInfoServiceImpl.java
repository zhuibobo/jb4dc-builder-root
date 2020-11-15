package com.jb4dc.gridsystem.service.build.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.build.BuildInfoMapper;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.service.build.IBuildInfoService;
import org.springframework.stereotype.Service;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/15
 * To change this template use File | Settings | File Templates.
 */
@Service
public class BuildInfoServiceImpl extends BaseServiceImpl<BuildInfoEntity> implements IBuildInfoService
{
    BuildInfoMapper buildInfoMapper;
    public BuildInfoServiceImpl(BuildInfoMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        buildInfoMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, BuildInfoEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<BuildInfoEntity>() {
            @Override
            public BuildInfoEntity run(JB4DCSession jb4DCSession,BuildInfoEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}