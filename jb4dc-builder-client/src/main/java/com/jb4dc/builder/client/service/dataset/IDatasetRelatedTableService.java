package com.jb4dc.builder.client.service.dataset;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.dataset.DatasetRelatedTableEntity;
import com.jb4dc.builder.po.DataSetRelatedTablePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
public interface IDatasetRelatedTableService extends IBaseService<DatasetRelatedTableEntity> {
    void deleteByDataSetId(JB4DCSession jb4DCSession, String dataSetId);

    List<DataSetRelatedTablePO> getByDataSetId(JB4DCSession jb4DCSession, String dataSetId) throws IOException;

    DataSetRelatedTablePO getMainRTTable(JB4DCSession jb4DCSession, String dataSetId) throws IOException, JBuild4DCGenerallyException;
}
