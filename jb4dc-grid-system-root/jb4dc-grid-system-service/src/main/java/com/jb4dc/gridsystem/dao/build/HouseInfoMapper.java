package com.jb4dc.gridsystem.dao.build;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;

import java.util.List;

public interface HouseInfoMapper extends BaseMapper<HouseInfoEntity> {
    List<HouseInfoEntity> selectByBuildId(String buildId);
}
