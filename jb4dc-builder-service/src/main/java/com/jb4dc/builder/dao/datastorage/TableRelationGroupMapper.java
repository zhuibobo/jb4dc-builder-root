package com.jb4dc.builder.dao.datastorage;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.datastorage.TableRelationGroupEntity;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/1
 * To change this template use File | Settings | File Templates.
 */
public interface TableRelationGroupMapper extends BaseMapper<TableRelationGroupEntity> {
    List<TableRelationGroupEntity> selectChilds(String id);
}

