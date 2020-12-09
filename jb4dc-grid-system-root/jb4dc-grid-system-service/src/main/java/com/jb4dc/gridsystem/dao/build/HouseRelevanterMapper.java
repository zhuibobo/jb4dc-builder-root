package com.jb4dc.gridsystem.dao.build;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseRelevanterEntity;

import java.util.List;

public interface HouseRelevanterMapper extends BaseMapper<HouseRelevanterEntity> {
    List<HouseRelevanterEntity> selectByHouseId(String houseId);
}
