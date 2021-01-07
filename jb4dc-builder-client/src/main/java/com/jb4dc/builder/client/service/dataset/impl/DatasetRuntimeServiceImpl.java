package com.jb4dc.builder.client.service.dataset.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.dbaccess.dynamic.ISQLBuilderMapper;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.builder.client.proxy.IDataSetRuntimeProxy;
import com.jb4dc.builder.client.proxy.ITableRuntimeProxy;
import com.jb4dc.builder.client.service.ResolvePendingSQL;
import com.jb4dc.builder.client.service.dataset.IDatasetRuntimeService;
import com.jb4dc.builder.client.proxy.IEnvVariableRuntimeProxy;
import com.jb4dc.builder.client.tools.SQLStringPlaceholderResultPO;
import com.jb4dc.builder.client.tools.SQLStringPlaceholderUtility;
import com.jb4dc.builder.po.*;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.list.IListWhereCondition;
import com.jb4dc.core.base.list.ListUtility;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/28
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DatasetRuntimeServiceImpl implements IDatasetRuntimeService {

    @Autowired
    IEnvVariableRuntimeProxy envVariableClientResolveService;

    @Autowired
    private ISQLBuilderService sqlBuilderService;

    ISQLBuilderMapper sqlBuilderMapper;

    @Autowired
    IDataSetRuntimeProxy dataSetRuntimeProxy;

    @Autowired
    ResolvePendingSQL resolvePendingSQL;

    @Autowired
    ITableRuntimeProxy tableRuntimeProxy;

    @Autowired
    SQLStringPlaceholderUtility sqlStringPlaceholderUtility;

    @Autowired
    public DatasetRuntimeServiceImpl(ISQLBuilderMapper _sqlBuilderMapper) {
        sqlBuilderMapper=_sqlBuilderMapper;
    }

    @Override
    public boolean validateResolveSqlWithKeyWord(String sql) throws JBuild4DCGenerallyException {
        if(sql.indexOf(";")>0){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"SQL语句【"+sql+"】中不能存在符号【;】");
        }

        List<String> singleKeyWord=new ArrayList<>();
        singleKeyWord.add("delete");
        singleKeyWord.add("drop");
        singleKeyWord.add("alter");
        singleKeyWord.add("truncate");
        singleKeyWord.add("insert");
        singleKeyWord.add("update");
        singleKeyWord.add("exec");

        List<String> sqlSingleWord= Arrays.asList(sql.split(" "));
        for (String s : sqlSingleWord) {
            if(ListUtility.Where(singleKeyWord, new IListWhereCondition<String>() {
                @Override
                public boolean Condition(String item) {
                    return item.toLowerCase().equals(s);
                }
            }).size()>0){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"SQL语句【"+sql+"】中不能存在符号【"+s+"】");
            }
        }
        return true;
    }

    @Override
    public String sqlReplaceEnvValueToRunningValue(JB4DCSession jb4DCSession, String sqlValue) throws JBuild4DCGenerallyException {
        String sqlRunValue=sqlValue;
        if(validateResolveSqlWithKeyWord(sqlValue)) {
            //Map<String,String> aboutValueParas=new HashMap<>();
            //进行正则匹配，替换为Value。
            Pattern p=Pattern.compile("#\\{ENVVAR.*?}|#\\{DATETIME.*?}|#\\{NUMBERCODE.*?}");
            Matcher m =p.matcher(sqlValue);
            while (m.find()){
                System.out.println("Found value: " + m.group());
                //将变量的Value转换为运行时的值
                String envValue = m.group().substring(m.group().indexOf(".")+1).replace("}","");
                try {
                    String runValue=envVariableClientResolveService.execEnvVarResult(jb4DCSession,envValue);
                    String t1=m.group().replace("{","\\{");
                    sqlRunValue=sqlRunValue.replaceAll(t1,runValue);
                } catch (Exception ex) {
                    ex.printStackTrace();
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"获取变量：" + envValue + "的运行时值失败！" + ex.getMessage());
                }
            }

        }
        return sqlRunValue;
    }

    private ResolvedQueryStringPO resolveQueryString(QueryDataSetPO queryDataSetPO){
        ResolvedQueryStringPO resolvedQueryStringPO=new ResolvedQueryStringPO();

        StringBuilder sql=new StringBuilder();
        Map<String,Object> paras=new HashMap<>();
        resolvedQueryStringPO.setQueryMap(paras);
        if(queryDataSetPO.getListQueryPOList()!=null&&queryDataSetPO.getListQueryPOList().size()>0){
            sql.append("(");
            List<ListQueryPO> listQueryPOList = queryDataSetPO.getListQueryPOList();
            for (int i = 0; i < listQueryPOList.size(); i++) {
                ListQueryPO listQueryPO = listQueryPOList.get(i);
                if(StringUtility.isNotEmpty(listQueryPO.getValue())) {
                    String tableName = listQueryPO.getTableName();
                    String fieldName = listQueryPO.getFieldName();
                    String value = listQueryPO.getValue();
                    String operation = listQueryPO.getOperator();
                    sql.append(tableName + "." + fieldName);
                    sql.append(ListQueryPO.ConvertSQLOperation(listQueryPO));
                    String paraName = "P" + i;
                    sql.append("#{" + paraName + "}");
                    paras.put(paraName, ListQueryPO.ConvertSQLValue(listQueryPO));
                    sql.append(" AND ");
                }
            }
            sql=sql.delete(sql.length()-4,sql.length());
            sql.append(")");
            resolvedQueryStringPO.setWhereString(sql.toString());
        }

        return resolvedQueryStringPO;
    }

    @Override
    public PageInfo<List<Map<String, Object>>> getDataSetData(JB4DCSession jb4DCSession, QueryDataSetPO queryDataSetPO, DataSetPO dataSetPO) throws JBuild4DCGenerallyException {
        //DatasetEntity datasetEntity = datasetMapper.selectByPrimaryKey(queryDataSetPO.getDataSetId());

        PageHelper.startPage(queryDataSetPO.getPageNum(), queryDataSetPO.getPageSize());
        ResolvedQueryStringPO resolvedQueryStringPO = resolveQueryString(queryDataSetPO);

        String sql = dataSetPO.getDsSqlSelectValue();
        sql = sql.toUpperCase();

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO= sqlStringPlaceholderUtility.generalPlaceholderHandler(jb4DCSession,sql);
        sql=sqlStringPlaceholderResultPO.getSql();

        sql = sqlReplaceEnvValueToRunningValue(jb4DCSession, sql);
        /*sql="select TDEV_TEST_3.*,TDEV_TEST_4.F_TABLE3_ID,'ADDRESS' ADDRESS,'SEX' SEX from TDEV_TEST_3 join TDEV_TEST_4 on TDEV_TEST_3.ID=TDEV_TEST_4.F_TABLE3_ID where TDEV_TEST_3.ID like #{q1} or TDEV_TEST_3.ID like #{q3} order by TDEV_TEST_3.F_ORDER_NUM;";

        Map<String,Object> queryMap=new HashMap<>();
        queryMap.put("q1","%ID10%");
        queryMap.put("q2","%ID20%");
        queryMap.put("q3","%ID20%");*/

        if (StringUtility.isNotEmpty(resolvedQueryStringPO.getWhereString())) {
            if (sql.indexOf("WHERE") > 0) {
                sql = sql.replaceAll("(?i)WHERE", "WHERE " + resolvedQueryStringPO.getWhereString() + " AND ");
            } else {
                if (sql.indexOf(" ORDER BY ") > 0) {
                    sql = sql.replaceAll("(?i)ORDER BY", "WHERE " + resolvedQueryStringPO.getWhereString() + " ORDER BY");
                }
                sql = sql + " WHERE " + resolvedQueryStringPO.getWhereString();
            }
        }

        List<Map<String, Object>> list;
        if (StringUtility.isNotEmpty(resolvedQueryStringPO.getWhereString())) {
            Map<String, Object> queryPara=resolvedQueryStringPO.getQueryMap();
            if(!sqlStringPlaceholderResultPO.getSqlParas().isEmpty()){
                queryPara.putAll(sqlStringPlaceholderResultPO.getSqlParas());
            }
            list = sqlBuilderMapper.selectList(sql, queryPara);
        } else {
            list = sqlBuilderMapper.selectList(sql,sqlStringPlaceholderResultPO.getSqlParas());
        }

        PageInfo<List<Map<String, Object>>> pageInfo = new PageInfo(list);
        return pageInfo;
    }

    @Override
    public void deleteDataSetRecord(JB4DCSession jb4DCSession, String dataSetId, String pkValue) throws JBuild4DCGenerallyException {
        DataSetRelatedTablePO dataSetRelatedTablePO = dataSetRuntimeProxy.getMainRTTable(jb4DCSession, dataSetId);
        List<TableFieldPO> tableFieldPOList = dataSetRuntimeProxy.getDataSetMainTableFields(jb4DCSession, dataSetId);
        TableFieldPO pkFieldPO = resolvePendingSQL.findPrimaryKey(dataSetRelatedTablePO.getRtTableName(), tableFieldPOList);
        String sql="delete from "+dataSetRelatedTablePO.getRtTableName()+" where "+pkFieldPO.getFieldName()+"=#{ID}";
        Map paraMap = new HashMap();
        paraMap.put("ID", pkValue);
        //System.out.println(sql);
        Object count = sqlBuilderService.delete(sql,paraMap);
    }

    @Override
    public void deleteTableRecord(JB4DCSession session, String tableId, String pkValue) throws JBuild4DCGenerallyException {
        List<TableFieldPO> tableFieldPOS=tableRuntimeProxy.getTableFieldsByTableId(tableId);
        TableFieldPO pkField=resolvePendingSQL.findPrimaryKey(tableFieldPOS.get(0).getTableName(),tableFieldPOS);
        String sql="delete from "+pkField.getTableName()+" where "+pkField.getFieldName()+"=#{ID}";
        Map paraMap = new HashMap();
        paraMap.put("ID", pkValue);
        System.out.println(sql);
        Object count = sqlBuilderService.delete(sql,paraMap);
    }
}
