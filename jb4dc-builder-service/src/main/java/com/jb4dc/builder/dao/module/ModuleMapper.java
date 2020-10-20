package com.jb4dc.builder.dao.module;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ModuleMapper extends BaseMapper<ModuleEntity> {
    ModuleEntity selectLessThanRecord(@Param("id") String id, @Param("parentId") String moduleParentId);

    ModuleEntity selectGreaterThanRecord(@Param("id") String id, @Param("parentId") String moduleParentId);

    List<ModuleEntity> selectModulesByDBLinkId(String dbLinkId);
}