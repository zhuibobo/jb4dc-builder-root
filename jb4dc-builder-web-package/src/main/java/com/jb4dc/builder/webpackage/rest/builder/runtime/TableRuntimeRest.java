/*
package com.jb4dc.builder.webpackage.rest.builder.runtime;

import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.client.service.datastorage.ITableFieldService;
import com.jb4dc.builder.service.datastorage.ITableService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

*/
/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/4
 * To change this template use File | Settings | File Templates.
 *//*

@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/TableRuntime")
public class TableRuntimeRest {

    @Autowired
    ITableFieldService tableFieldService;

    @Autowired
    ITableService tableService;

    @RequestMapping(value = "/GetTableFieldsByTableId")
    public JBuild4DCResponseVo<List<TableFieldPO>> getTableFieldsByTableId(String tableId) throws JBuild4DCGenerallyException {
        return JBuild4DCResponseVo.getDataSuccess(tableFieldService.getTableFieldsByTableId(tableId));
    }

    @RequestMapping(value = "/GetTableById")
    public JBuild4DCResponseVo<TableEntity> getTableById(String tableId) throws JBuild4DCGenerallyException {
        return JBuild4DCResponseVo.getDataSuccess(tableService.getByPrimaryKey(null,tableId));
    }
}
*/
