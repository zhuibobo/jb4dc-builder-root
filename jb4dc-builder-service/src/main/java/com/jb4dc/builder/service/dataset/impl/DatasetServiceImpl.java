package com.jb4dc.builder.service.dataset.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.dbaccess.dynamic.ISQLBuilderMapper;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.IUpdateBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.client.service.IDatasetClientService;
import com.jb4dc.builder.config.IBuilderConfigService;
import com.jb4dc.builder.config.IDataSetColumnCaptionConfigService;
import com.jb4dc.builder.config.impl.DataSetColumnCaptionConfigServiceImpl;
import com.jb4dc.builder.dao.dataset.DatasetMapper;
import com.jb4dc.builder.dbentities.dataset.DatasetEntity;
import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.extend.IDataSetAPI;
import com.jb4dc.builder.po.*;
import com.jb4dc.builder.service.dataset.IDatasetColumnService;
import com.jb4dc.builder.service.dataset.IDatasetRelatedTableService;
import com.jb4dc.builder.service.dataset.IDatasetService;
import com.jb4dc.builder.service.dataset.builder.SQLDataSetBuilder;
import com.jb4dc.builder.service.datastorage.ITableFieldService;
import com.jb4dc.builder.service.datastorage.ITableService;
import com.jb4dc.builder.client.service.IEnvVariableClientResolveService;
import com.jb4dc.builder.client.service.IEnvVariableService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.list.IListWhereCondition;
import com.jb4dc.core.base.list.ListUtility;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.ClassUtility;
import com.jb4dc.core.base.tools.StringUtility;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.beans.PropertyVetoException;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DatasetServiceImpl extends BaseServiceImpl<DatasetEntity> implements IDatasetService
{
    DatasetMapper datasetMapper;
    IDatasetRelatedTableService datasetRelatedTableService;
    IDatasetColumnService datasetColumnService;
    JdbcOperations jdbcOperations;
    IBuilderConfigService builderConfigService;
    ITableService tableService;
    ITableFieldService tableFieldService;
    IEnvVariableClientResolveService envVariableClientResolveService;
    ISQLBuilderMapper sqlBuilderMapper;
    IEnvVariableService envVariableService;
    IDatasetClientService datasetClientService;

    Logger logger = LoggerFactory.getLogger(DatasetServiceImpl.class);

    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;

    @Autowired
    public DatasetServiceImpl(DatasetMapper _defaultBaseMapper,
                              SqlSessionTemplate _sqlSessionTemplate, JdbcOperations _jdbcOperations,
                              IBuilderConfigService _builderConfigService, ITableService _tableService, ITableFieldService _tableFieldService,
                              IDatasetRelatedTableService _datasetRelatedTableService, IDatasetColumnService _datasetColumnService, ISQLBuilderMapper _sqlBuilderMapper,
                              IEnvVariableService _envVariableService, IEnvVariableClientResolveService _envVariableClientResolveService,IDatasetClientService _datasetClientService){
        super(_defaultBaseMapper);
        datasetMapper=_defaultBaseMapper;
        jdbcOperations=_jdbcOperations;
        builderConfigService=_builderConfigService;
        tableService=_tableService;
        tableFieldService=_tableFieldService;
        //envVariableService=_envVariableService;
        datasetRelatedTableService=_datasetRelatedTableService;
        datasetColumnService=_datasetColumnService;
        sqlBuilderMapper=_sqlBuilderMapper;
        envVariableClientResolveService=_envVariableClientResolveService;
        envVariableService=_envVariableService;
        datasetClientService=_datasetClientService;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, DatasetEntity record) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"请调用方法saveDataSetVo");
    }

    @Override
    public int save(JB4DCSession jb4DCSession, String id, DatasetEntity entity, IAddBefore<DatasetEntity> addBefore) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"请调用方法saveDataSetVo");
    }

    @Override
    public int save(JB4DCSession jb4DCSession, String id, DatasetEntity entity, IAddBefore<DatasetEntity> addBefore, IUpdateBefore<DatasetEntity> updateBefore) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"请调用方法saveDataSetVo");
    }

    @Override
    public DatasetEntity getByPrimaryKey(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"请调用方法getVoByPrimaryKey");
    }

    @Override
    public DataSetPO getVoByPrimaryKey(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException, IOException {

        DatasetEntity datasetEntity=super.getByPrimaryKey(jb4DCSession, id);
        if(datasetEntity==null)
            return null;
        DataSetPO dataSetPO = DataSetPO.parseToVo(datasetEntity);
        List<DataSetColumnPO> dataSetColumnVos=datasetColumnService.getByDataSetId(jb4DCSession,id);
        List<DataSetRelatedTablePO> dataSetRelatedTablePOS =datasetRelatedTableService.getByDataSetId(jb4DCSession,id);

        dataSetPO.setColumnVoList(dataSetColumnVos);
        dataSetPO.setRelatedTableVoList(dataSetRelatedTablePOS);

        return dataSetPO;
    }

    @Override
    @Transactional(rollbackFor=JBuild4DCGenerallyException.class)
    public int saveDataSetVo(JB4DCSession jb4DCSession, String id, DataSetPO record) throws JBuild4DCGenerallyException, IOException {
        //保存数据集的列
        if(record.getColumnVoList()!=null) {
            //DataSetVo oldDataSetVo=getVoByPrimaryKey(jb4DCSession,id);

            //删除旧的列设置
            datasetColumnService.deleteByDataSetId(jb4DCSession,id);

            List<DataSetColumnPO> columnVoList = record.getColumnVoList();
            for (int i = 0; i < columnVoList.size(); i++) {
                DataSetColumnPO dataSetColumnVo = columnVoList.get(i);
                dataSetColumnVo.setColumnOrderNum(i + 1);
                if (StringUtility.isEmpty(dataSetColumnVo.getColumnId())) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"DataSetColumnVo:请在客户端设置DataSetColumnVo的ColumnId");
                }
                datasetColumnService.save(jb4DCSession, dataSetColumnVo.getColumnId(), dataSetColumnVo, (jb4DCSession1, sourceEntity) -> {
                    sourceEntity.setColumnCreator(jb4DCSession1.getUserName());
                    sourceEntity.setColumnCreateTime(new Date());
                    sourceEntity.setColumnDsId(record.getDsId());
                    sourceEntity.setColumnUpdater(jb4DCSession1.getUserName());
                    sourceEntity.setColumnUpdateTime(new Date());
                    return sourceEntity;
                }, (jb4DCSession12, sourceEntity) -> {
                    sourceEntity.setColumnDsId(record.getDsId());
                    sourceEntity.setColumnUpdater(jb4DCSession12.getUserName());
                    sourceEntity.setColumnUpdateTime(new Date());
                    return sourceEntity;
                });
            }
        }

        //保存数据集的关联表
        List<DataSetRelatedTablePO> relatedTableVoList = record.getRelatedTableVoList();
        for (int i = 0; i < relatedTableVoList.size(); i++) {
            DataSetRelatedTablePO dataSetRelatedTablePO = relatedTableVoList.get(i);
            dataSetRelatedTablePO.setRtOrderNum(i+1);
            if(StringUtility.isEmpty(dataSetRelatedTablePO.getRtId())){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"DataSetRelatedTableVo:请在客户端设置DataSetRelatedTableVo的RTId");
            }
            datasetRelatedTableService.save(jb4DCSession, dataSetRelatedTablePO.getRtId(), dataSetRelatedTablePO, (jb4DCSession13, sourceEntity) -> {
                sourceEntity.setRtDsId(record.getDsId());
                return sourceEntity;
            });
        }

        //保存数据集的基本信息
        DatasetEntity datasetEntity=datasetMapper.selectByPrimaryKey(id);
        if(datasetEntity==null){
            record.setDsCode("DS_"+StringUtility.build1W5DCode(datasetMapper.nextOrderNum()));
            record.setDsOrganId(jb4DCSession.getOrganId());
            record.setDsOrganName(jb4DCSession.getOrganName());
            record.setDsOrderNum(datasetMapper.nextOrderNum());
            record.setDsCreator(jb4DCSession.getUserName());
            record.setDsUpdater(jb4DCSession.getUserName());
            record.setDsCreateTime(new Date());
            record.setDsUpdateTime(new Date());
            return datasetMapper.insertSelective(record);
        }
        else {
            record.setDsUpdater(jb4DCSession.getUserName());
            record.setDsUpdateTime(new Date());
            return datasetMapper.updateByPrimaryKeySelective(record);
        }
    }

    @Override
    public DataSetPO resolveSQLToDataSet(JB4DCSession jb4DCSession, String sql) throws JBuild4DCGenerallyException, SAXException, ParserConfigurationException, XPathExpressionException, IOException, PropertyVetoException {
        if(builderConfigService.getResolveSQLEnable()) {

            if(datasetClientService.validateResolveSqlWithKeyWord(sql)) {
                SQLDataSetBuilder sqlDataSetBuilder = new SQLDataSetBuilder();
                autowireCapableBeanFactory.autowireBean(sqlDataSetBuilder);
                //sqlDataSetBuilder.setJdbcOperations(jdbcOperations);
                DataSetPO resultVo = sqlDataSetBuilder.resolveSQLToDataSet(jb4DCSession, sql);
                //进行返回前的结果验证
                if (validateResolveResult(resultVo)) {
                    //尝试补充上字段标题
                    List<DataSetColumnPO> dataSetColumnVoList=resultVo.getColumnVoList();
                    //从dbo.TBUILD_TABLE和dbo.TBUILD_TABLE_FIELD中尝试查找
                    for (DataSetRelatedTablePO dataSetRelatedTablePO : resultVo.getRelatedTableVoList()) {
                        List<TableFieldPO> tableFieldEntityList=tableFieldService.getTableFieldsByTableName(dataSetRelatedTablePO.getRtTableName());
                        if(tableFieldEntityList!=null&&tableFieldEntityList.size()>0){
                            for (DataSetColumnPO columnVo : dataSetColumnVoList) {
                                TableFieldPO fieldVO= ListUtility.WhereSingle(tableFieldEntityList, new IListWhereCondition<TableFieldPO>() {
                                    @Override
                                    public boolean Condition(TableFieldPO item) {
                                        return item.getFieldName().toLowerCase().equals(columnVo.getColumnName().toLowerCase());
                                    }
                                });
                                if(fieldVO!=null){
                                    columnVo.setColumnCaption(fieldVO.getFieldCaption());
                                }
                                columnVo.setColumnIsCustom("否");
                            }
                        }
                    }

                    //从配置文件中尝试查找
                    IDataSetColumnCaptionConfigService builderDataSetColumnCaptionConfigService=new DataSetColumnCaptionConfigServiceImpl();
                    for (DataSetColumnPO columnVo : dataSetColumnVoList) {
                        if(StringUtility.isEmpty(columnVo.getColumnCaption())){
                            columnVo.setColumnCaption(builderDataSetColumnCaptionConfigService.getCaption(columnVo.getColumnName()));
                        }
                    }

                    //无法确认列名,设置为未知,并输入日志
                    for (DataSetColumnPO columnVo : dataSetColumnVoList) {
                        if(StringUtility.isEmpty(columnVo.getColumnCaption())){
                            columnVo.setColumnCaption("无法解析出列的标题");
                            logger.warn("["+columnVo.getColumnName()+"]:无法解析出列的标题");
                        }
                    }

                    //尝试补充表的标题
                    List<DataSetRelatedTablePO> dataSetRelatedTablePOList =resultVo.getRelatedTableVoList();
                    for (DataSetRelatedTablePO dataSetRelatedTablePO : dataSetRelatedTablePOList) {
                        TableEntity tableEntity=tableService.getByTableName(jb4DCSession, dataSetRelatedTablePO.getRtTableName());
                        if(tableEntity!=null){
                            dataSetRelatedTablePO.setRtTableCaption(tableEntity.getTableCaption());
                            dataSetRelatedTablePO.setRtTableId(tableEntity.getTableId());
                        }
                    }

                    return resultVo;
                } else {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"结果校验失败！");
                }
            }
            else{
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"SQL验证失败！");
            }
        }
        else
        {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"BuilderConfig.xml配置文件中已经禁用了DataSet相关的SQL解析的功能！");
        }
    }

    @Override
    public String sqlReplaceEnvTextToEnvValue(JB4DCSession jb4DCSession, String sqlText) throws JBuild4DCGenerallyException {
        String sqlValue=sqlText;
        //进行关键字校验
        if(datasetClientService.validateResolveSqlWithKeyWord(sqlText)){
            Map<String,String> aboutTextParas=new HashMap<>();
            Map<String,String> aboutValueParas=new HashMap<>();
            //进行正则匹配，替换为Value。
            Pattern p=Pattern.compile("#\\{EnvVar.*?}|#\\{DateTime.*?}|#\\{NumberCode.*?}");
            Matcher m =p.matcher(sqlText);
            while (m.find()){
                System.out.println("Found value: " + m.group());
                //将变量的Text转换为Value
                aboutTextParas.put(m.group(),"");
            }
            //将变量的Text转换为Value
            for (Map.Entry<String, String> textPara : aboutTextParas.entrySet()) {
                String fullValue=textPara.getKey().split("\\.")[0];
                String envName=textPara.getKey().substring(textPara.getKey().indexOf(".")+1).replace("}","");
                String envValue=envVariableService.getValueByText(envName);
                if(envValue.equals("")){
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"将变量从"+envValue+"装换为Value时，找不到对应的数据！");
                }

                fullValue=fullValue+"."+envValue+"}";
                try {
                    aboutValueParas.put(fullValue,envVariableClientResolveService.execEnvVarResult(jb4DCSession,envValue));
                    textPara.setValue(fullValue);
                }
                catch (Exception ex){
                    ex.printStackTrace();
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"获取变量："+envValue+"的运行时值失败！"+ex.getMessage());
                }

                String t1=textPara.getKey().replace("{","\\{");
                sqlValue=sqlValue.replaceAll(t1,fullValue);
            }
        }
        return sqlValue.replaceAll("\n"," ");
    }

    @Override
    public String sqlReplaceEnvValueToRunningValue(JB4DCSession jb4DCSession, String sqlValue) throws JBuild4DCGenerallyException {
        return datasetClientService.sqlReplaceEnvValueToRunningValue(jb4DCSession,sqlValue);
    }


    @Override
    public String sqlReplaceRunningValueToEmptyFilter(JB4DCSession jb4DCSession, String sqlRunValue) {
        sqlRunValue=sqlRunValue.toUpperCase();
        if (sqlRunValue.indexOf("WHERE") > 0) {
            return sqlRunValue.replaceAll("(?i)WHERE", "WHERE 1=2 AND");
        } else {
            if(sqlRunValue.indexOf(" ORDER BY ")>0){
                return sqlRunValue.replaceAll("(?i)ORDER BY", "WHERE 1=2 ORDER BY");
            }
            sqlRunValue = sqlRunValue + " WHERE 1=2";
            return sqlRunValue;
        }
    }

    @Override
    public SQLResolveToDataSetPO sqlResolveToDataSetVo(JB4DCSession jb4DCSession, String sqlWithEnvText) throws XPathExpressionException, JBuild4DCGenerallyException, IOException, SAXException, ParserConfigurationException, PropertyVetoException {
        SQLResolveToDataSetPO resolveToDataSetVo=new SQLResolveToDataSetPO();
        resolveToDataSetVo.setSqlWithEnvText(sqlWithEnvText);
        String sqlReplaceEnvTextToEnvValue=sqlReplaceEnvTextToEnvValue(jb4DCSession,sqlWithEnvText);
        resolveToDataSetVo.setSqlWithEnvValue(sqlReplaceEnvTextToEnvValue);
        //String setSqlWithEnvRunningValue=sqlReplaceEnvValueToRunningValue(jb4DCSession,sqlReplaceEnvTextToEnvValue);
        //resolveToDataSetVo.setSqlWithEnvRunningValue(setSqlWithEnvRunningValue);
        String sqlReplaceRunningValueToEmptyFilter=sqlReplaceRunningValueToEmptyFilter(jb4DCSession,sqlWithEnvText);
        resolveToDataSetVo.setSqlWithEmptyData(sqlReplaceRunningValueToEmptyFilter);
        DataSetPO dataSetPO =resolveSQLToDataSet(jb4DCSession,sqlReplaceRunningValueToEmptyFilter);

        //验证字段中是否都是大写
        for (DataSetColumnPO dataSetColumnVo : dataSetPO.getColumnVoList()) {
            String columnName=dataSetColumnVo.getColumnName();
            Pattern p=Pattern.compile("[a-z]*");
            Matcher m=p.matcher(columnName);
            while (m.find()) {
                if(!m.group().equals("")){
                    throw new JBuild4DCGenerallyException(0,"请使用大写的字段名:"+columnName+"!");
                }
            }
        }

        resolveToDataSetVo.setDataSetPO(dataSetPO);
        return resolveToDataSetVo;
    }

    @Override
    public PageInfo<DatasetEntity> getPageByGroupId(JB4DCSession jb4DCSession, Integer pageNum, Integer pageSize, String groupId) {
        //return null;
        PageHelper.startPage(pageNum, pageSize);
        //PageHelper.
        List<DatasetEntity> list=datasetMapper.selectByGroupId(groupId);
        PageInfo<DatasetEntity> pageInfo = new PageInfo<DatasetEntity>(list);
        return pageInfo;
    }

    @Override
    public DataSetPO getApiDataSetVoStructure(JB4DCSession session, String recordId, String op, String groupId, String fullClassName) throws IllegalAccessException, InstantiationException {
        IDataSetAPI dataSetAPI=(IDataSetAPI) ClassUtility.loadClass(fullClassName).newInstance();
        return dataSetAPI.getDataSetStructure(session,recordId,op,groupId,"");
    }

    @Override
    public PageInfo<List<Map<String, Object>>> getDataSetData(JB4DCSession jb4DCSession,QueryDataSetPO queryDataSetPO) throws JBuild4DCGenerallyException, IOException {
        DataSetPO dataSetPO=getVoByPrimaryKey(jb4DCSession,queryDataSetPO.getDataSetId());
        return datasetClientService.getDataSetData(jb4DCSession,queryDataSetPO,dataSetPO);
    }

    private boolean validateResolveResult(DataSetPO resultVo) throws JBuild4DCGenerallyException {
        //列中不能存在多个同名列
        List<DataSetColumnPO> dataSetColumnVoList=resultVo.getColumnVoList();
        if(dataSetColumnVoList==null||dataSetColumnVoList.size()==0){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"解析结果中不存在列！");
        }
        for (DataSetColumnPO columnVo : dataSetColumnVoList) {
            if(ListUtility.Where(dataSetColumnVoList, new IListWhereCondition<DataSetColumnPO>() {
                @Override
                public boolean Condition(DataSetColumnPO item) {
                    return item.getColumnName().equals(columnVo.getColumnName());
                }
            }).size()>1){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"解析的结果中存在多个同名列："+columnVo.getColumnName());
            }
        }
        return true;
    }

    @Override
    public int deleteByKey(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        return deleteByKeyNotValidate(jb4DCSession, id, JBuild4DCYaml.getWarningOperationCode());
    }

    @Override
    public int deleteByKeyNotValidate(JB4DCSession jb4DCSession, String id, String warningOperationCode) throws JBuild4DCGenerallyException {
        if(JBuild4DCYaml.getWarningOperationCode().equals(warningOperationCode)) {
            datasetMapper.deleteByPrimaryKey(id);
            datasetRelatedTableService.deleteByDataSetId(jb4DCSession, id);
            datasetColumnService.deleteByDataSetId(jb4DCSession, id);
            return 0;
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"删除失败WarningOperationCode错误");
        //return super.deleteByKeyNotValidate(jb4DCSession, id);
    }
}

