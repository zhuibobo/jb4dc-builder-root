package com.jb4dc.gridsystem.service.build;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dbentities.build.HouseRelevanterEntity;
import com.jb4dc.gridsystem.po.HouseRelevanterPO;

import java.util.List;

public interface IHouseRelevanterService extends IBaseService<HouseRelevanterEntity> {
    List<HouseRelevanterEntity> getRelevanterByHouseId(JB4DCSession session, String houseId);
}