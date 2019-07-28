package com.jb4dc.builder.dao.datastorage;


import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.datastorage.TableGroupEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public interface TableGroupMapper extends BaseMapper<TableGroupEntity> {
    List<TableGroupEntity> selectChilds(String id);

    TableGroupEntity selectLessThanRecord(@Param("id") String id, @Param("parentId") String tableGroupParentId);

    TableGroupEntity selectGreaterThanRecord(@Param("id") String id, @Param("parentId") String tableGroupParentId);

    TableGroupEntity selectByGroupText(String groupText);

    TableGroupEntity selectTableGroupRoot(String dbLinkId);

    List<TableGroupEntity> selectTableGroupsByDBLinkId(String dbLinkId);
}
