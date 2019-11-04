package com.jb4dc.builder.client.service.datastorage.proxy;

import com.jb4dc.builder.client.remote.TableRuntimeRemote;
import com.jb4dc.builder.client.service.datastorage.ITableFieldService;
import com.jb4dc.builder.client.service.datastorage.proxy.ITableRuntimeProxy;
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
public class TableRuntimeProxyImpl implements ITableRuntimeProxy {

    @Autowired(required = false)
    ITableFieldService tableFieldService;

    @Autowired
    TableRuntimeRemote tableRuntimeRemote;

    @Override
    public List<TableFieldPO> getTableFieldsByTableId(String tableId) throws JBuild4DCGenerallyException {
        try {
            if (tableFieldService != null) {
                return tableFieldService.getTableFieldsByTableId(tableId);
            } else {
                //envVariableEntity=new EnvVariableEntity();
                //则通过rest接口远程获取.
                return tableRuntimeRemote.getTableFieldsByTableId(tableId).getData();
            }
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage(),ex.getCause());
        }
    }

}
