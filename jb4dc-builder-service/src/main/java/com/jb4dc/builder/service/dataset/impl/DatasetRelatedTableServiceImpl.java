package com.jb4dc.builder.service.dataset.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.dataset.DatasetRelatedTableMapper;
import com.jb4dc.builder.dbentities.dataset.DatasetRelatedTableEntity;
import com.jb4dc.builder.dbentities.datastorage.TableFieldEntity;
import com.jb4dc.builder.po.DataSetRelatedTablePO;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.service.dataset.IDatasetRelatedTableService;
import com.jb4dc.builder.service.datastorage.ITableFieldService;
import com.jb4dc.builder.service.datastorage.ITableService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DatasetRelatedTableServiceImpl extends BaseServiceImpl<DatasetRelatedTableEntity> implements IDatasetRelatedTableService
{
    DatasetRelatedTableMapper datasetRelatedTableMapper;

    @Autowired
    ITableService tableService;

    @Autowired
    ITableFieldService tableFieldService;

    @Autowired
    public DatasetRelatedTableServiceImpl(DatasetRelatedTableMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        datasetRelatedTableMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, DatasetRelatedTableEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<DatasetRelatedTableEntity>() {
            @Override
            public DatasetRelatedTableEntity run(JB4DCSession jb4DCSession, DatasetRelatedTableEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public void deleteByDataSetId(JB4DCSession jb4DCSession, String dataSetId) {
        datasetRelatedTableMapper.deleteByDataSetId(dataSetId);
    }

    @Override
    public List<DataSetRelatedTablePO> getByDataSetId(JB4DCSession jb4DCSession, String dataSetId) throws IOException {
        List<DatasetRelatedTableEntity> datasetRelatedTableEntities=datasetRelatedTableMapper.selectByDataSetId(dataSetId);
        List<DataSetRelatedTablePO> dataSetRelatedTablePOList=DataSetRelatedTablePO.EntityListToVoList(datasetRelatedTableEntities);
        //补充关联表的相关字段
        for (DataSetRelatedTablePO dataSetRelatedTablePO : dataSetRelatedTablePOList) {
            String tableId=dataSetRelatedTablePO.getRtTableId();
            List<TableFieldPO> tableFieldEntityList=tableFieldService.getTableFieldsByTableId(tableId);
            dataSetRelatedTablePO.setTableFieldPOList(tableFieldEntityList);
        }

        return dataSetRelatedTablePOList;
    }
}

