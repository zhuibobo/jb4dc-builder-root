package com.jb4dc.builder.service.dataset.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.dataset.DatasetColumnMapper;
import com.jb4dc.builder.dbentities.dataset.DatasetColumnEntity;
import com.jb4dc.builder.po.DataSetColumnPO;
import com.jb4dc.builder.service.dataset.IDatasetColumnService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */

@Service
public class DatasetColumnServiceImpl extends BaseServiceImpl<DatasetColumnEntity> implements IDatasetColumnService
{
    DatasetColumnMapper datasetColumnMapper;

    @Autowired
    public DatasetColumnServiceImpl(DatasetColumnMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        datasetColumnMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, DatasetColumnEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<DatasetColumnEntity>() {
            @Override
            public DatasetColumnEntity run(JB4DCSession jb4DCSession, DatasetColumnEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public void deleteByDataSetId(JB4DCSession jb4DCSession, String dataSetId) {
        datasetColumnMapper.deleteByDataSetId(dataSetId);
    }

    @Override
    public List<DataSetColumnPO> getByDataSetId(JB4DCSession jb4DCSession, String dataSetId) throws IOException {
        List<DatasetColumnEntity> datasetColumnEntities=datasetColumnMapper.selectByDataSetId(dataSetId);
        return DataSetColumnPO.EntityListToVoList(datasetColumnEntities);
    }
}
