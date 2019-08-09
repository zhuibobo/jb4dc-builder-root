package com.jb4dc.builder.service.dataset;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.dataset.DatasetEntity;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.builder.po.SQLResolveToDataSetPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.beans.PropertyVetoException;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public interface IDatasetService extends IBaseService<DatasetEntity> {
    DataSetPO getVoByPrimaryKey(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException, IOException;

    int saveDataSetVo(JB4DCSession jb4DCSession, String id, DataSetPO record) throws JBuild4DCGenerallyException, IOException;

    DataSetPO resolveSQLToDataSet(JB4DCSession jb4DCSession, String sql) throws JBuild4DCGenerallyException, SAXException, ParserConfigurationException, XPathExpressionException, IOException, PropertyVetoException;

    String sqlReplaceEnvTextToEnvValue(JB4DCSession jb4DCSession, String sqlText) throws JBuild4DCGenerallyException, XPathExpressionException, IOException, SAXException, ParserConfigurationException;

    String sqlReplaceEnvValueToRunningValue(JB4DCSession jb4DCSession, String sqlValue) throws JBuild4DCGenerallyException;

    String sqlReplaceRunningValueToEmptyFilter(JB4DCSession jb4DCSession, String sqlRunValue);

    SQLResolveToDataSetPO sqlResolveToDataSetVo(JB4DCSession jb4DCSession, String sqlWithEnvText) throws XPathExpressionException, JBuild4DCGenerallyException, IOException, SAXException, ParserConfigurationException, PropertyVetoException;

    PageInfo<DatasetEntity> getPageByGroupId(JB4DCSession jb4DCSession, Integer pageNum, Integer pageSize, String groupId);

    DataSetPO getApiDataSetVoStructure(JB4DCSession session, String recordId, String op, String groupId, String fullClassName) throws IllegalAccessException, InstantiationException;
}
