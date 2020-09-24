package com.jb4dc.builder.service.dataset.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.dataset.DatasetRelatedTableMapper;
import com.jb4dc.builder.dbentities.dataset.DatasetRelatedTableEntity;
import com.jb4dc.builder.po.DataSetRelatedTablePO;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.client.service.dataset.IDatasetRelatedTableService;
import com.jb4dc.builder.client.service.datastorage.ITableFieldService;
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

    @Override
    public DataSetRelatedTablePO getMainRTTable(JB4DCSession jb4DCSession, String dataSetId) throws IOException, JBuild4DCGenerallyException {
        List<DataSetRelatedTablePO> dataSetRelatedTablePOList=getByDataSetId(jb4DCSession,dataSetId);
        if(dataSetRelatedTablePOList.stream().filter(item->item.getRtTableIsMain().equals("是")).count()==1){
           return dataSetRelatedTablePOList.stream().filter(item->item.getRtTableIsMain().equals("是")).findFirst().get();
        }
        else if(dataSetRelatedTablePOList.stream().filter(item->item.getRtTableIsMain().equals("是")).count()==0){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"DataSet的关联表未设置主表!");
        }
        else{
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"DataSet的关联表存在一个以上的主表!");
        }
    }
}

