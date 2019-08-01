package com.jb4dc.builder.service.dataset.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.dataset.DatasetRelatedTableMapper;
import com.jb4dc.builder.dbentities.dataset.DatasetRelatedTableEntity;
import com.jb4dc.builder.po.DataSetRelatedTableVo;
import com.jb4dc.builder.service.dataset.IDatasetRelatedTableService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.mybatis.spring.SqlSessionTemplate;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
public class DatasetRelatedTableServiceImpl extends BaseServiceImpl<DatasetRelatedTableEntity> implements IDatasetRelatedTableService
{
    DatasetRelatedTableMapper datasetRelatedTableMapper;
    public DatasetRelatedTableServiceImpl(DatasetRelatedTableMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        datasetRelatedTableMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DSession, String id, DatasetRelatedTableEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<DatasetRelatedTableEntity>() {
            @Override
            public DatasetRelatedTableEntity run(JB4DCSession jb4DSession, DatasetRelatedTableEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public void deleteByDataSetId(JB4DCSession jb4DSession, String dataSetId) {
        datasetRelatedTableMapper.deleteByDataSetId(dataSetId);
    }

    @Override
    public List<DataSetRelatedTableVo> getByDataSetId(JB4DCSession jb4DSession, String dataSetId) throws IOException {
        List<DatasetRelatedTableEntity> datasetRelatedTableEntities=datasetRelatedTableMapper.selectByDataSetId(dataSetId);
        return DataSetRelatedTableVo.EntityListToVoList(datasetRelatedTableEntities);
    }
}

