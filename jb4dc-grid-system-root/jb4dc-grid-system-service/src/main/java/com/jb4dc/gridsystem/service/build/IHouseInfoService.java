package com.jb4dc.gridsystem.service.build;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;

import java.util.List;

public interface IHouseInfoService extends IBaseService<HouseInfoEntity> {
    List<HouseInfoEntity> getHouseByBuildId(JB4DCSession session, String buildId);
}