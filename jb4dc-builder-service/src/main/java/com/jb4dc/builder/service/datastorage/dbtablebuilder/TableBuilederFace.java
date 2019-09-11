package com.jb4dc.builder.service.datastorage.dbtablebuilder;



import com.jb4dc.base.ymls.DBYaml;
import com.jb4dc.builder.dbentities.datastorage.DbLinkEntity;
import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.dbentities.datastorage.TableGroupEntity;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCPhysicalTableException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.tools.SQLKeyWordUtility;

import java.beans.PropertyVetoException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/1
 * To change this template use File | Settings | File Templates.
 */
public class TableBuilederFace {

    protected TableBuidler dbBuidler;

    private TableBuilederFace(){

    }

    public static TableBuilederFace getInstance() throws JBuild4DCGenerallyException {
        TableBuilederFace instance=new TableBuilederFace();
        if(DBYaml.isSqlServer()){
            instance.dbBuidler=new MSSQLTableBuilder();
            //instance.dbBuidler.setSqlBuilderService(sqlBuilderService);
        }
        else if(DBYaml.isMySql()){
            instance.dbBuidler=new MYSQLTableBuilder();
            //instance.dbBuidler.setSqlBuilderService(sqlBuilderService);
            //throw new JBuild4DGenerallyException("暂不支持MYSQL");
        }
        else if(DBYaml.isOracle()){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"暂不支持Oracle");
        }
        return instance;
    }

    private boolean validateTableEntity(TableEntity tableEntity) throws JBuild4DCSQLKeyWordException {
        return SQLKeyWordUtility.singleWord(tableEntity.getTableName());
    }

    private boolean validateTableField(TableFieldPO fieldVo) throws JBuild4DCSQLKeyWordException {
        return SQLKeyWordUtility.singleWord(fieldVo.getFieldName()) &&
                SQLKeyWordUtility.singleWord(fieldVo.getOldFieldName()) &&
                SQLKeyWordUtility.singleWord(fieldVo.getFieldDataType()) &&
                SQLKeyWordUtility.singleWord(fieldVo.getFieldAllowNull()) &&
                SQLKeyWordUtility.singleWord(fieldVo.getFieldIsPk());
    }

    private boolean validateTableFields(List<TableFieldPO> fieldVos) throws JBuild4DCSQLKeyWordException {
        boolean result=true;
        for (TableFieldPO fieldVo : fieldVos) {
            validateTableField(fieldVo);
        }
        return result;
    }

    public boolean newTable(TableEntity tableEntity, List<TableFieldPO> fieldVos, TableGroupEntity tableGroupEntity, DbLinkEntity dbLinkEntity) throws JBuild4DCSQLKeyWordException, JBuild4DCPhysicalTableException, PropertyVetoException {
        this.validateTableEntity(tableEntity);
        this.validateTableFields(fieldVos);
        return dbBuidler.newTable(tableEntity,fieldVos,tableGroupEntity,dbLinkEntity);
    }

    public boolean isExistTable(String tableName, DbLinkEntity dbLinkEntity) throws PropertyVetoException {
        TableEntity tableEntity=new TableEntity();
        tableEntity.setTableName(tableName);
        return dbBuidler.isExistTable(tableEntity,dbLinkEntity);
    }

    public boolean updateTable(TableEntity tableEntity, List<TableFieldPO> newFields, List<TableFieldPO> updateFields, List<TableFieldPO> deleteFields, TableGroupEntity tableGroupEntity, DbLinkEntity dbLinkEntity) throws JBuild4DCSQLKeyWordException, JBuild4DCPhysicalTableException {
        this.validateTableEntity(tableEntity);
        this.validateTableFields(newFields);
        this.validateTableFields(updateFields);
        this.validateTableFields(deleteFields);
        return dbBuidler.updateTable(tableEntity,newFields,updateFields,deleteFields,tableGroupEntity,dbLinkEntity);
    }

    public boolean deleteTable(String tableName, DbLinkEntity dbLinkEntity,boolean validateDeleteEnable) throws JBuild4DCSQLKeyWordException, JBuild4DCPhysicalTableException, PropertyVetoException {
        TableEntity tableEntity=new TableEntity();
        tableEntity.setTableName(tableName);
        return dbBuidler.deleteTable(tableEntity,dbLinkEntity,validateDeleteEnable);
    }

    public boolean deleteTable(TableEntity tableEntity, DbLinkEntity dbLinkEntity) throws JBuild4DCSQLKeyWordException, JBuild4DCPhysicalTableException, PropertyVetoException {
        this.validateTableEntity(tableEntity);
        return dbBuidler.deleteTable(tableEntity,dbLinkEntity,true);
    }

    public int recordCount(TableEntity oldTableEntity, DbLinkEntity dbLinkEntity) throws PropertyVetoException {
        return dbBuidler.recordCount(oldTableEntity,dbLinkEntity);
    }
}
