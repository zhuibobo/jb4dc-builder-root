package com.jb4dc.devmock.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.devmock.dbentities.DemoTlTreeListEntity;
import org.apache.ibatis.annotations.Param;

public interface DemoTlTreeListMapper extends BaseMapper<DemoTlTreeListEntity> {
    DemoTlTreeListEntity selectGreaterThanRecord(@Param("id") String id, @Param("groupId") String ddtlGroupId);

    DemoTlTreeListEntity selectLessThanRecord(@Param("id") String id, @Param("groupId") String ddtlGroupId);
}