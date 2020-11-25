package com.jb4dc.gridsystem.service.enterprise;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dbentities.enterprise.EnterpriseInfoEntity;

import java.util.List;

public interface IEnterpriseInfoService extends IBaseService<EnterpriseInfoEntity> {
    List<EnterpriseInfoEntity> getEnterpriseByHouseId(JB4DCSession session, String houseId);
}
