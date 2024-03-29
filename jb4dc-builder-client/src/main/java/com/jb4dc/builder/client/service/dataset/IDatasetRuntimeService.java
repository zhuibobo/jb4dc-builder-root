package com.jb4dc.builder.client.service.dataset;

import com.github.pagehelper.PageInfo;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.builder.po.QueryDataSetPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/28
 * To change this template use File | Settings | File Templates.
 */
public interface IDatasetRuntimeService {

    boolean validateResolveSqlWithKeyWord(String sql) throws JBuild4DCGenerallyException;

    String sqlReplaceEnvValueToRunningValue(JB4DCSession jb4DCSession, String sqlValue) throws JBuild4DCGenerallyException;

    PageInfo<List<Map<String, Object>>> getDataSetData(JB4DCSession jb4DCSession, QueryDataSetPO queryDataSetPO, DataSetPO dataSetPO) throws JBuild4DCGenerallyException ;

    void deleteDataSetRecord(JB4DCSession jb4DCSession, String dataSetId, String pkValue) throws JBuild4DCGenerallyException;

    void deleteTableRecord(JB4DCSession session, String tableId, String pkValue) throws JBuild4DCGenerallyException;
}
