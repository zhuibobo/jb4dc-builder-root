package com.jb4dc.builder.dao.datastorage;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.datastorage.TableRelationEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface TableRelationMapper extends BaseMapper<TableRelationEntity> {
    List<TableRelationEntity> selectByGroupId(String groupId);

    TableRelationEntity selectLessThanRecord(@Param("id") String id, @Param("groupId") String relationGroupId);

    TableRelationEntity selectGreaterThanRecord(@Param("id") String id, @Param("groupId") String relationGroupId);
}
