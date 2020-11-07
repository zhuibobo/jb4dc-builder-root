package com.jb4dc.devmock.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.devmock.dbentities.DemoTreeTableEntity;
import org.apache.ibatis.annotations.Param;

public interface DemoTreeTableMapper extends BaseMapper<DemoTreeTableEntity> {
    DemoTreeTableEntity selectLessThanRecord(@Param("id") String id, @Param("parentId") String ddttParentId);

    DemoTreeTableEntity selectGreaterThanRecord(@Param("id") String id, @Param("parentId") String ddttParentId);
}