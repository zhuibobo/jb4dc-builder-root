package com.jb4dc.builder.client.service.datastorage;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.datastorage.TableFieldEntity;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public interface ITableFieldService extends IBaseService<TableFieldEntity> {
    List<String> getFieldTemplateName();

    List<TableFieldPO> getTemplateFieldsByName(String templateName) throws IOException;

    void createTableFieldTemplates(JB4DCSession jb4DCSession);

    List<TableFieldPO> getTableFieldsByTableId(String tableId) throws JBuild4DCGenerallyException;

    List<TableFieldPO> getTableFieldsByTableName(String rtTableId,String rtTableName,String rtTableCaption) throws IOException;

    void deleteByTableId(JB4DCSession session, String tableId);

    List<TableFieldEntity> getTablesFieldsByTableIds(JB4DCSession session, List<String> tableIds);

    TableFieldEntity getSimplePKFieldName(String tableName);

    List<TableFieldPO> getFormUsedTableFieldList(JB4DCSession jb4DCSession, List<FormResourcePO> formResourcePOList) throws JBuild4DCGenerallyException;
}