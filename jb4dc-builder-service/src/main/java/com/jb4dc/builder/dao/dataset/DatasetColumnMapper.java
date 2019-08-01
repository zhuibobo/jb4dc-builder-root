package com.jb4dc.builder.dao.dataset;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.dataset.DatasetColumnEntity;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */
public interface DatasetColumnMapper extends BaseMapper<DatasetColumnEntity> {
    void deleteByDataSetId(String dataSetId);

    List<DatasetColumnEntity> selectByDataSetId(String dataSetId);
}
