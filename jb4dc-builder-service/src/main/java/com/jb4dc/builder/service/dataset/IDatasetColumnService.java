package com.jb4dc.builder.service.dataset;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.dataset.DatasetColumnEntity;
import com.jb4dc.builder.po.DataSetColumnPO;
import com.jb4dc.core.base.session.JB4DCSession;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */
public interface IDatasetColumnService extends IBaseService<DatasetColumnEntity> {
    void deleteByDataSetId(JB4DCSession jb4DCSession, String dataSetId);

    List<DataSetColumnPO> getByDataSetId(JB4DCSession jb4DCSession, String dataSetId) throws IOException;
}
