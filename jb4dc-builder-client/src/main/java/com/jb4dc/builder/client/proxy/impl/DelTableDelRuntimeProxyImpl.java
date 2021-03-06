package com.jb4dc.builder.client.proxy.impl;

import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.base.service.cache.JB4DCCacheManagerV2;
import com.jb4dc.builder.client.remote.TableRuntimeRemote;
import com.jb4dc.builder.client.proxy.DelRuntimeProxyBase;
import com.jb4dc.builder.client.service.datastorage.ITableFieldService;
import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/4
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DelTableDelRuntimeProxyImpl extends DelRuntimeProxyBase {

    @Autowired(required = false)
    ITableFieldService tableFieldService;

    @Autowired
    TableRuntimeRemote tableRuntimeRemote;

    //@Override
    public List<TableFieldPO> getTableFieldsByTableId(String tableId) throws JBuild4DCGenerallyException {
        try {
            List<TableFieldPO> tableFieldPOList;
            if (tableFieldService != null) {
                tableFieldPOList = tableFieldService.getTableFieldsByTableId(tableId);
            } else {
                //envVariableEntity=new EnvVariableEntity();
                //则通过rest接口远程获取.
                //return tableRuntimeRemote.getTableFieldsByTableId(tableId).getData();

                tableFieldPOList=jb4DCCacheManagerV2.autoGetFromCacheList(JB4DCCacheManagerV2.Jb4dPlatformBuilderClientCacheName,
                        "Proxy",
                        this.getClass(), tableId+"_FIELDS", new IBuildGeneralObj<List<TableFieldPO>>() {
                    @Override
                    public List<TableFieldPO> BuildObj() throws JBuild4DCGenerallyException {
                        return tableRuntimeRemote.getTableFieldsByTableId(tableId).getData();
                    }
                },TableFieldPO.class,JB4DCCacheManagerV2.DefExpirationTimeSeconds);
            }
            return tableFieldPOList;
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage(),ex,ex.getStackTrace());
        }
    }

    //@Override
    public TableEntity getTableById(String tableId) throws JBuild4DCGenerallyException {
        try {
            TableEntity tableEntity;
            /*tableEntity = autoGetFromCache(this.getClass(), tableId+"_Table", new IBuildGeneralObj<TableEntity>() {
                @Override
                public TableEntity BuildObj() throws JBuild4DCGenerallyException {
                    return tableRuntimeRemote.getTableById(tableId).getData();
                }
            },TableEntity.class);*/
            tableEntity = jb4DCCacheManagerV2.autoGetFromCache(JB4DCCacheManagerV2.Jb4dPlatformBuilderClientCacheName,
                    "Proxy",
                    this.getClass(), "Table_"+tableId, new IBuildGeneralObj<TableEntity>() {
                @Override
                public TableEntity BuildObj() throws JBuild4DCGenerallyException {
                    return tableRuntimeRemote.getTableById(tableId).getData();
                }
            },TableEntity.class,JB4DCCacheManagerV2.DefExpirationTimeSeconds);
            return tableEntity;
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage(),ex,ex.getStackTrace());
        }
    }
}
