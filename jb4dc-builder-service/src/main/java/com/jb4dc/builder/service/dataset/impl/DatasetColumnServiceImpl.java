package com.jb4dc.builder.service.dataset.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.dataset.DatasetColumnMapper;
import com.jb4dc.builder.dbentities.dataset.DatasetColumnEntity;
import com.jb4dc.builder.po.DataSetColumnVo;
import com.jb4dc.builder.service.dataset.IDatasetColumnService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.mybatis.spring.SqlSessionTemplate;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */
public class DatasetColumnServiceImpl extends BaseServiceImpl<DatasetColumnEntity> implements IDatasetColumnService
{
    DatasetColumnMapper datasetColumnMapper;
    public DatasetColumnServiceImpl(DatasetColumnMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        datasetColumnMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DSession, String id, DatasetColumnEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<DatasetColumnEntity>() {
            @Override
            public DatasetColumnEntity run(JB4DCSession jb4DSession, DatasetColumnEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public void deleteByDataSetId(JB4DCSession jb4DSession, String dataSetId) {
        datasetColumnMapper.deleteByDataSetId(dataSetId);
    }

    @Override
    public List<DataSetColumnVo> getByDataSetId(JB4DCSession jb4DSession, String dataSetId) throws IOException {
        List<DatasetColumnEntity> datasetColumnEntities=datasetColumnMapper.selectByDataSetId(dataSetId);
        return DataSetColumnVo.EntityListToVoList(datasetColumnEntities);
    }
}
