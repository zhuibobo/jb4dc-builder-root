package com.jb4dc.gridsystem.dao.setting;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.gridsystem.dbentities.setting.AppVersionEntity;

public interface AppVersionMapper extends BaseMapper<AppVersionEntity> {
    AppVersionEntity selectByLastPublicVersion(String appName);

    AppVersionEntity selectByLastPrePublicVersion(String appName);
}