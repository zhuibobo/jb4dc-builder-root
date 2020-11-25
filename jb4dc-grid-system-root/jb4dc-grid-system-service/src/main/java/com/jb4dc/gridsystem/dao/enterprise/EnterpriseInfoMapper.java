package com.jb4dc.gridsystem.dao.enterprise;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.enterprise.EnterpriseInfoEntity;

import java.util.List;

public interface EnterpriseInfoMapper extends BaseMapper<EnterpriseInfoEntity>{
    List<EnterpriseInfoEntity> selectByHouseId(String houseId);
}
