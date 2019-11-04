package com.jb4dc.builder.client.service.datastorage;

import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/4
 * To change this template use File | Settings | File Templates.
 */
public interface ITableRuntimeService {
    List<TableFieldPO> getTableFieldsByTableId(String tableId) throws JBuild4DCGenerallyException;
}
