package com.jb4dc.builder.service.datastorage;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.datastorage.DbLinkEntity;
import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.dbentities.datastorage.TableGroupEntity;
import com.jb4dc.builder.po.TableFieldVO;
import com.jb4dc.builder.po.UpdateTableResolveVo;
import com.jb4dc.builder.po.ValidateTableUpdateResultVo;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCPhysicalTableException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.transaction.annotation.Transactional;

import java.beans.PropertyVetoException;
import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public interface ITableService extends IBaseService<TableEntity> {
    @Transactional(rollbackFor= JBuild4DCGenerallyException.class)
    void newTable(JB4DCSession jb4DSession, TableEntity tableEntity, List<TableFieldVO> tableFieldVOList, String groupId) throws JBuild4DCGenerallyException;

    UpdateTableResolveVo updateTableResolve(JB4DCSession jb4DSession, TableEntity newTableEntity, List<TableFieldVO> newTableFieldVOList) throws IOException, JBuild4DCGenerallyException;

    ValidateTableUpdateResultVo validateTableUpdateEnable(JB4DCSession jb4DSession, TableEntity newTableEntity, List<TableFieldVO> newTableFieldVOList) throws JBuild4DCGenerallyException, IOException, PropertyVetoException;

    ValidateTableUpdateResultVo validateTableUpdateEnable(JB4DCSession jb4DSession, UpdateTableResolveVo resolveVo) throws JBuild4DCGenerallyException, PropertyVetoException;

    @Transactional(rollbackFor=JBuild4DCGenerallyException.class)
    List<String> updateTable(JB4DCSession jb4DSession, TableEntity tableEntity, List<TableFieldVO> tableFieldVOList, boolean ignorePhysicalError) throws JBuild4DCGenerallyException, IOException, PropertyVetoException;

    boolean existLogicTableName(JB4DCSession jb4DSession, String tableName);

    //void deleteTable(TableEntity tableEntity);

    boolean existPhysicsTableName(JB4DCSession jb4DSession, String tableName) throws JBuild4DCGenerallyException, PropertyVetoException;

    boolean deletePhysicsTable(JB4DCSession jb4DSession, String tableName, String warningOperationCode) throws JBuild4DCSQLKeyWordException, JBuild4DCPhysicalTableException, JBuild4DCGenerallyException, PropertyVetoException;

    boolean deleteLogicTableAndFields(JB4DCSession jb4DSession, String tableName, String warningOperationCode) throws JBuild4DCGenerallyException;

    TableEntity getByTableName(JB4DCSession jb4DSession, String tableName);

    void registerSystemTableToBuilderToModule(JB4DCSession jb4DSession, String tableName, TableGroupEntity tableGroupEntity) throws JBuild4DCGenerallyException;

    List<TableEntity> getTablesByTableIds(JB4DCSession session, List<String> tableIds);

    boolean testTablesInTheSameDBLink(JB4DCSession jb4DSession, List tableList);

    DbLinkEntity getDBLinkByTableName(JB4DCSession jb4DSession, String toString) throws JBuild4DCGenerallyException;
}