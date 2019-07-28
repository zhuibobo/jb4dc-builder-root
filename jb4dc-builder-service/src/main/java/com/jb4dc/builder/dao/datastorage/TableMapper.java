package com.jb4dc.builder.dao.datastorage;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public interface TableMapper extends BaseMapper<TableEntity> {
    TableEntity selectByTableName(String tableName);

    List<TableEntity> selectByTableIds(@Param("tableIds") List<String> tableIds);
}
