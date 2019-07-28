package com.jb4dc.builder.service.datastorage;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.datastorage.TableFieldEntity;
import com.jb4dc.builder.po.TableFieldVO;
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

    List<TableFieldVO> getTemplateFieldsByName(String templateName) throws IOException;

    void createTableFieldTemplates(JB4DCSession jb4DSession);

    List<TableFieldVO> getTableFieldsByTableId(String tableId) throws IOException;

    List<TableFieldVO> getTableFieldsByTableName(String rtTableName) throws IOException;

    void deleteByTableId(JB4DCSession session, String tableId);

    List<TableFieldEntity> getTablesFieldsByTableIds(JB4DCSession session, List<String> tableIds);
}