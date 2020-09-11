package com.jb4dc.builder.dao.systemsetting;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.systemsetting.SettingEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingMapper extends BaseMapper<SettingEntity> {
    SettingEntity selectByKeyField(String key);
}