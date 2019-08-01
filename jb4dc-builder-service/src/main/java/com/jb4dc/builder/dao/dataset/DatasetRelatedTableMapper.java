package com.jb4dc.builder.dao.dataset;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.dataset.DatasetRelatedTableEntity;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
public interface DatasetRelatedTableMapper extends BaseMapper<DatasetRelatedTableEntity> {
    void deleteByDataSetId(String dataSetId);

    List<DatasetRelatedTableEntity> selectByDataSetId(String dataSetId);
}
