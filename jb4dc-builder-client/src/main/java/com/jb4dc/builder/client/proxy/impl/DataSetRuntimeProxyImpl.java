package com.jb4dc.builder.client.proxy.impl;

import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.builder.client.proxy.IDataSetRuntimeProxy;
import com.jb4dc.builder.client.remote.DataSetRuntimeRemote;
import com.jb4dc.builder.client.proxy.RuntimeProxyBase;
import com.jb4dc.builder.client.service.dataset.IDatasetRelatedTableService;
import com.jb4dc.builder.client.service.dataset.IDatasetService;
import com.jb4dc.builder.client.service.datastorage.ITableFieldService;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.builder.po.DataSetRelatedTablePO;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/22
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DataSetRuntimeProxyImpl extends RuntimeProxyBase implements IDataSetRuntimeProxy {

    @Autowired(required = false)
    IDatasetService datasetService;

    @Autowired(required = false)
    IDatasetRelatedTableService datasetRelatedTableService;

    @Autowired(required = false)
    ITableFieldService tableFieldService;

    @Autowired
    DataSetRuntimeRemote dataSetRuntimeRemote;

    @Override
    public DataSetPO getByDataSetId(JB4DCSession jb4DCSession, String dataSetId) throws JBuild4DCGenerallyException {
        try {
            DataSetPO dataSetPO;
            if (datasetService != null) {
                dataSetPO = datasetService.getVoByPrimaryKey(jb4DCSession,dataSetId);
            } else {
                dataSetPO=autoGetFromCache(this.getClass(), dataSetId+"_getByDataSetId", new IBuildGeneralObj<DataSetPO>() {
                    @Override
                    public DataSetPO BuildObj() throws JBuild4DCGenerallyException {
                        return dataSetRuntimeRemote.getByDataSetId(dataSetId).getData();
                    }
                },DataSetPO.class);
            }
            return dataSetPO;
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage(),ex,ex.getStackTrace());
        }
    }

    @Override
    public DataSetRelatedTablePO getMainRTTable(JB4DCSession jb4DCSession, String dataSetId) throws JBuild4DCGenerallyException {
        try {
            DataSetRelatedTablePO dataSetRelatedTablePO;
            if (datasetRelatedTableService != null) {
                dataSetRelatedTablePO = datasetRelatedTableService.getMainRTTable(jb4DCSession,dataSetId);
            } else {
                dataSetRelatedTablePO=autoGetFromCache(this.getClass(), dataSetId+"_getMainRTTable", new IBuildGeneralObj<DataSetRelatedTablePO>() {
                    @Override
                    public DataSetRelatedTablePO BuildObj() throws JBuild4DCGenerallyException {
                        return dataSetRuntimeRemote.getMainRTTable(dataSetId).getData();
                    }
                },DataSetRelatedTablePO.class);
            }
            return dataSetRelatedTablePO;
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage(),ex,ex.getStackTrace());
        }
    }

    @Override
    public List<TableFieldPO> getDataSetMainTableFields(JB4DCSession jb4DCSession, String dataSetId) throws JBuild4DCGenerallyException {
        try {
            DataSetRelatedTablePO dataSetRelatedTablePO=getMainRTTable(jb4DCSession,dataSetId);
            List<TableFieldPO> tableFieldPOList;
            if (tableFieldService != null) {
                tableFieldPOList = tableFieldService.getTableFieldsByTableId(dataSetRelatedTablePO.getRtTableId());
            } else {
                tableFieldPOList=autoGetFromCacheList(this.getClass(), dataSetId+"_getDataSetMainTableFields", new IBuildGeneralObj<List<TableFieldPO>>() {
                    @Override
                    public List<TableFieldPO> BuildObj() throws JBuild4DCGenerallyException {
                        return dataSetRuntimeRemote.getDataSetMainTableFields(dataSetId).getData();
                    }
                },TableFieldPO.class);
            }
            return tableFieldPOList;
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage(),ex,ex.getStackTrace());
        }
    }
}
