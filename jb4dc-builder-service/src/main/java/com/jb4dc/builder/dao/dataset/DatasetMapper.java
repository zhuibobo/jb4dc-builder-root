package com.jb4dc.builder.dao.dataset;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.dataset.DatasetEntity;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public interface DatasetMapper extends BaseMapper<DatasetEntity> {
    List<DatasetEntity> selectByGroupId(String groupId);
}
