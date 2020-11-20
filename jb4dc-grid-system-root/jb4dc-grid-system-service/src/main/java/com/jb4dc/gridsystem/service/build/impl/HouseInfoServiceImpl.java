package com.jb4dc.gridsystem.service.build.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.build.HouseInfoMapper;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.service.build.IHouseInfoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HouseInfoServiceImpl extends BaseServiceImpl<HouseInfoEntity> implements IHouseInfoService
{
    HouseInfoMapper houseInfoMapper;
    public HouseInfoServiceImpl(HouseInfoMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        houseInfoMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, HouseInfoEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<HouseInfoEntity>() {
            @Override
            public HouseInfoEntity run(JB4DCSession jb4DCSession,HouseInfoEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public List<HouseInfoEntity> getHouseByBuildId(JB4DCSession session, String buildId) {
        return houseInfoMapper.selectByBuildId(buildId);
    }
}