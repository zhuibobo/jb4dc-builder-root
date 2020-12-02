package com.jb4dc.gridsystem.service.setting;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.gridsystem.dbentities.setting.AppVersionEntity;

public interface IAppVersionService extends IBaseService<AppVersionEntity> {
    AppVersionEntity getByLastPublicVersion(String appName);

    AppVersionEntity getByLastPrePublicVersion(String appName);
}