package com.jb4dc.builder.client.proxy;

import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/4
 * To change this template use File | Settings | File Templates.
 */
public interface ITableRuntimeProxy {
    List<TableFieldPO> getTableFieldsByTableId(String tableId) throws JBuild4DCGenerallyException;

    TableEntity getTableById(String tableId) throws JBuild4DCGenerallyException;
}
