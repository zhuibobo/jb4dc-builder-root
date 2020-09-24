package com.jb4dc.builder.client.proxy;

import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.builder.po.DataSetRelatedTablePO;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/22
 * To change this template use File | Settings | File Templates.
 */
public interface IDataSetRuntimeProxy {
    DataSetPO getByDataSetId(JB4DCSession jb4DCSession, String dataSetId) throws JBuild4DCGenerallyException;

    DataSetRelatedTablePO getMainRTTable(JB4DCSession jb4DCSession, String dataSetId) throws JBuild4DCGenerallyException;

    List<TableFieldPO> getDataSetMainTableFields(JB4DCSession jb4DCSession, String dataSetId) throws JBuild4DCGenerallyException;
}
