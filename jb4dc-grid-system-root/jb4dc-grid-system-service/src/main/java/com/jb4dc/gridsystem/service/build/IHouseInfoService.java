package com.jb4dc.gridsystem.service.build;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.po.HouseInfoPO;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

public interface IHouseInfoService extends IBaseService<HouseInfoEntity> {
    boolean testCodeSingle(HouseInfoEntity houseInfoEntity) throws JBuild4DCGenerallyException;

    List<HouseInfoEntity> getHouseByBuildId(JB4DCSession session, String buildId);

    List<HouseInfoEntity> getByHouseFullCode(String houseCodeFull);

    HouseInfoPO saveHouseData(JB4DCSession session, HouseInfoPO houseInfoPO) throws JBuild4DCGenerallyException;
}