package com.jb4dc.builder.client.service.dataset;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.dataset.DatasetEntity;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.builder.po.QueryDataSetPO;
import com.jb4dc.builder.po.SQLResolveToDataSetPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.beans.PropertyVetoException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public interface IDatasetService extends IBaseService<DatasetEntity> {
    DatasetEntity getEntityByPrimaryKey(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException, IOException;

    DataSetPO getVoByPrimaryKey(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException, IOException;

    int saveDataSetPO(JB4DCSession jb4DCSession, String id, DataSetPO record) throws JBuild4DCGenerallyException, IOException;

    DataSetPO resolveSQLToDataSet(JB4DCSession jb4DCSession, String sql) throws JBuild4DCGenerallyException, SAXException, ParserConfigurationException, XPathExpressionException, IOException, PropertyVetoException, URISyntaxException;

    String sqlReplaceEnvTextToEnvValue(JB4DCSession jb4DCSession, String sqlText) throws JBuild4DCGenerallyException;

    String sqlReplaceEnvValueToRunningValue(JB4DCSession jb4DCSession, String sqlValue) throws JBuild4DCGenerallyException;

    String sqlReplaceRunningValueToEmptyFilter(JB4DCSession jb4DCSession, String sqlRunValue);

    SQLResolveToDataSetPO sqlResolveToDataSetVo(JB4DCSession jb4DCSession, String sqlWithEnvText) throws XPathExpressionException, JBuild4DCGenerallyException, IOException, SAXException, ParserConfigurationException, PropertyVetoException, URISyntaxException;

    PageInfo<DatasetEntity> getPageByGroupId(JB4DCSession jb4DCSession, Integer pageNum, Integer pageSize, String groupId);

    DataSetPO getApiDataSetVoStructure(JB4DCSession session, String recordId, String op, String groupId, String fullClassName) throws IllegalAccessException, InstantiationException;

    PageInfo<List<Map<String, Object>>> getDataSetData(JB4DCSession session, QueryDataSetPO queryDataSetPO) throws JBuild4DCGenerallyException, IOException;

    void copyDataSet(JB4DCSession jb4DCSession,String dataSetId) throws IOException, JBuild4DCGenerallyException;

    PageInfo<DataSetPO> getPageIncludeDSUseFor(JB4DCSession jb4DCSession, Integer pageNum, Integer pageSize, Map<String, Object> searchMap) throws IOException;

    List<String> getDataSetUseForDescList(String dsId);
}
