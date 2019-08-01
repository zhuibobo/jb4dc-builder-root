package com.jb4dc.builder.service.dataset.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.IUpdateBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.ymls.JBuild4DCYaml;
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
import com.jb4dc.builder.service.envvariable.IEnvVariableService;
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
    IEnvVariableService envVariableService;

    Logger logger = LoggerFactory.getLogger(DatasetServiceImpl.class);

    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;

    @Autowired
    public DatasetServiceImpl(DatasetMapper _defaultBaseMapper,
                              SqlSessionTemplate _sqlSessionTemplate, JdbcOperations _jdbcOperations,
                              IBuilderConfigService _builderConfigService, ITableService _tableService, ITableFieldService _tableFieldService,
                              IEnvVariableService _envVariableService, IDatasetRelatedTableService _datasetRelatedTableService, IDatasetColumnService _datasetColumnService){
        super(_defaultBaseMapper);
        datasetMapper=_defaultBaseMapper;
        jdbcOperations=_jdbcOperations;
        builderConfigService=_builderConfigService;
        tableService=_tableService;
        tableFieldService=_tableFieldService;
        envVariableService=_envVariableService;
        datasetRelatedTableService=_datasetRelatedTableService;
        datasetColumnService=_datasetColumnService;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DSession, String id, DatasetEntity record) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"请调用方法saveDataSetVo");
    }

    @Override
    public int save(JB4DCSession jb4DSession, String id, DatasetEntity entity, IAddBefore<DatasetEntity> addBefore) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"请调用方法saveDataSetVo");
    }

    @Override
    public int save(JB4DCSession jb4DSession, String id, DatasetEntity entity, IAddBefore<DatasetEntity> addBefore, IUpdateBefore<DatasetEntity> updateBefore) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"请调用方法saveDataSetVo");
    }

    @Override
    public DatasetEntity getByPrimaryKey(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"请调用方法getVoByPrimaryKey");
    }

    @Override
    public DataSetVo getVoByPrimaryKey(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException, IOException {

        DatasetEntity datasetEntity=super.getByPrimaryKey(jb4DSession, id);
        if(datasetEntity==null)
            return null;
        DataSetVo dataSetVo=DataSetVo.parseToVo(datasetEntity);
        List<DataSetColumnVo> dataSetColumnVos=datasetColumnService.getByDataSetId(jb4DSession,id);
        List<DataSetRelatedTableVo> dataSetRelatedTableVos=datasetRelatedTableService.getByDataSetId(jb4DSession,id);

        dataSetVo.setColumnVoList(dataSetColumnVos);
        dataSetVo.setRelatedTableVoList(dataSetRelatedTableVos);

        return dataSetVo;
    }

    @Override
    @Transactional(rollbackFor=JBuild4DCGenerallyException.class)
    public int saveDataSetVo(JB4DCSession jb4DSession, String id, DataSetVo record) throws JBuild4DCGenerallyException, IOException {
        //保存数据集的列
        if(record.getColumnVoList()!=null) {
            //DataSetVo oldDataSetVo=getVoByPrimaryKey(jb4DSession,id);

            //删除旧的列设置
            datasetColumnService.deleteByDataSetId(jb4DSession,id);

            List<DataSetColumnVo> columnVoList = record.getColumnVoList();
            for (int i = 0; i < columnVoList.size(); i++) {
                DataSetColumnVo dataSetColumnVo = columnVoList.get(i);
                dataSetColumnVo.setColumnOrderNum(i + 1);
                if (StringUtility.isEmpty(dataSetColumnVo.getColumnId())) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"DataSetColumnVo:请在客户端设置DataSetColumnVo的ColumnId");
                }
                datasetColumnService.save(jb4DSession, dataSetColumnVo.getColumnId(), dataSetColumnVo, (jb4DSession1, sourceEntity) -> {
                    sourceEntity.setColumnCreator(jb4DSession1.getUserName());
                    sourceEntity.setColumnCreateTime(new Date());
                    sourceEntity.setColumnDsId(record.getDsId());
                    sourceEntity.setColumnUpdater(jb4DSession1.getUserName());
                    sourceEntity.setColumnUpdateTime(new Date());
                    return sourceEntity;
                }, (jb4DSession12, sourceEntity) -> {
                    sourceEntity.setColumnDsId(record.getDsId());
                    sourceEntity.setColumnUpdater(jb4DSession12.getUserName());
                    sourceEntity.setColumnUpdateTime(new Date());
                    return sourceEntity;
                });
            }
        }

        //保存数据集的关联表
        List<DataSetRelatedTableVo> relatedTableVoList = record.getRelatedTableVoList();
        for (int i = 0; i < relatedTableVoList.size(); i++) {
            DataSetRelatedTableVo dataSetRelatedTableVo = relatedTableVoList.get(i);
            dataSetRelatedTableVo.setRtOrderNum(i+1);
            if(StringUtility.isEmpty(dataSetRelatedTableVo.getRtId())){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"DataSetRelatedTableVo:请在客户端设置DataSetRelatedTableVo的RTId");
            }
            datasetRelatedTableService.save(jb4DSession, dataSetRelatedTableVo.getRtId(), dataSetRelatedTableVo, (jb4DSession13, sourceEntity) -> {
                sourceEntity.setRtDsId(record.getDsId());
                return sourceEntity;
            });
        }

        //保存数据集的基本信息
        DatasetEntity datasetEntity=datasetMapper.selectByPrimaryKey(id);
        if(datasetEntity==null){
            record.setDsCode("DS_"+StringUtility.build1W5DCode(datasetMapper.nextOrderNum()));
            record.setDsOrganId(jb4DSession.getOrganId());
            record.setDsOrganName(jb4DSession.getOrganName());
            record.setDsOrderNum(datasetMapper.nextOrderNum());
            record.setDsCreator(jb4DSession.getUserName());
            record.setDsUpdater(jb4DSession.getUserName());
            record.setDsCreateTime(new Date());
            record.setDsUpdateTime(new Date());
            return datasetMapper.insertSelective(record);
        }
        else {
            record.setDsUpdater(jb4DSession.getUserName());
            record.setDsUpdateTime(new Date());
            return datasetMapper.updateByPrimaryKeySelective(record);
        }
    }

    @Override
    public DataSetVo resolveSQLToDataSet(JB4DCSession jb4DSession,String sql) throws JBuild4DCGenerallyException, SAXException, ParserConfigurationException, XPathExpressionException, IOException, PropertyVetoException {
        if(builderConfigService.getResolveSQLEnable()) {

            if(validateResolveSqlWithKeyWord(sql)) {
                SQLDataSetBuilder sqlDataSetBuilder = new SQLDataSetBuilder();
                autowireCapableBeanFactory.autowireBean(sqlDataSetBuilder);
                //sqlDataSetBuilder.setJdbcOperations(jdbcOperations);
                DataSetVo resultVo = sqlDataSetBuilder.resolveSQLToDataSet(jb4DSession, sql);
                //进行返回前的结果验证
                if (validateResolveResult(resultVo)) {
                    //尝试补充上字段标题
                    List<DataSetColumnVo> dataSetColumnVoList=resultVo.getColumnVoList();
                    //从dbo.TBUILD_TABLE和dbo.TBUILD_TABLE_FIELD中尝试查找
                    for (DataSetRelatedTableVo dataSetRelatedTableVo : resultVo.getRelatedTableVoList()) {
                        List<TableFieldVO> tableFieldEntityList=tableFieldService.getTableFieldsByTableName(dataSetRelatedTableVo.getRtTableName());
                        if(tableFieldEntityList!=null&&tableFieldEntityList.size()>0){
                            for (DataSetColumnVo columnVo : dataSetColumnVoList) {
                                TableFieldVO fieldVO= ListUtility.WhereSingle(tableFieldEntityList, new IListWhereCondition<TableFieldVO>() {
                                    @Override
                                    public boolean Condition(TableFieldVO item) {
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
                    for (DataSetColumnVo columnVo : dataSetColumnVoList) {
                        if(StringUtility.isEmpty(columnVo.getColumnCaption())){
                            columnVo.setColumnCaption(builderDataSetColumnCaptionConfigService.getCaption(columnVo.getColumnName()));
                        }
                    }

                    //无法确认列名,设置为未知,并输入日志
                    for (DataSetColumnVo columnVo : dataSetColumnVoList) {
                        if(StringUtility.isEmpty(columnVo.getColumnCaption())){
                            columnVo.setColumnCaption("无法解析出列的标题");
                            logger.warn("["+columnVo.getColumnName()+"]:无法解析出列的标题");
                        }
                    }

                    //尝试补充表的标题
                    List<DataSetRelatedTableVo> dataSetRelatedTableVoList=resultVo.getRelatedTableVoList();
                    for (DataSetRelatedTableVo dataSetRelatedTableVo : dataSetRelatedTableVoList) {
                        TableEntity tableEntity=tableService.getByTableName(jb4DSession,dataSetRelatedTableVo.getRtTableName());
                        if(tableEntity!=null){
                            dataSetRelatedTableVo.setRtTableCaption(tableEntity.getTableCaption());
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
    public String sqlReplaceEnvTextToEnvValue(JB4DCSession jb4DSession, String sqlText) throws JBuild4DCGenerallyException, XPathExpressionException, IOException, SAXException, ParserConfigurationException {
        String sqlValue=sqlText;
        //进行关键字校验
        if(validateResolveSqlWithKeyWord(sqlText)){
            Map<String,String> aboutTextParas=new HashMap<>();
            Map<String,String> aboutValueParas=new HashMap<>();
            //进行正则匹配，替换为Value。
            Pattern p=Pattern.compile("#\\{ApiVar.*?}|#\\{DateTime.*?}|#\\{NumberCode.*?}");
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
                String envValue=envVariableService.getValueByName(envName);
                if(envValue.equals("")){
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"将变量从"+envValue+"装换为Value时，找不到对应的数据！");
                }

                fullValue=fullValue+"."+envValue+"}";
                try {
                    aboutValueParas.put(fullValue,envVariableService.execEnvVarResult(jb4DSession,envValue));
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
    public String sqlReplaceEnvValueToRunningValue(JB4DCSession jb4DSession, String sqlValue) throws JBuild4DCGenerallyException {
        String sqlRunValue=sqlValue;
        if(validateResolveSqlWithKeyWord(sqlValue)) {
            //Map<String,String> aboutValueParas=new HashMap<>();
            //进行正则匹配，替换为Value。
            Pattern p=Pattern.compile("#\\{ApiVar.*?}|#\\{DateTime.*?}|#\\{NumberCode.*?}");
            Matcher m =p.matcher(sqlValue);
            while (m.find()){
                System.out.println("Found value: " + m.group());
                //将变量的Value转换为运行时的值
                String envValue = m.group().substring(m.group().indexOf(".")+1).replace("}","");
                try {
                    String runValue=envVariableService.execEnvVarResult(jb4DSession,envValue);
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

    @Override
    public String sqlReplaceRunningValueToEmptyFilter(JB4DCSession jb4DSession, String sqlRunValue) {
        if (sqlRunValue.indexOf("where") > 0) {
            return sqlRunValue.replaceAll("(?i)where", "where 1=2 and");
        } else {
            sqlRunValue = sqlRunValue + " where 1=2";
            return sqlRunValue;
        }
    }

    @Override
    public SQLResolveToDataSetVo sqlResolveToDataSetVo(JB4DCSession jb4DSession, String sqlWithEnvText) throws XPathExpressionException, JBuild4DCGenerallyException, IOException, SAXException, ParserConfigurationException, PropertyVetoException {
        SQLResolveToDataSetVo resolveToDataSetVo=new SQLResolveToDataSetVo();
        resolveToDataSetVo.setSqlWithEnvText(sqlWithEnvText);
        String sqlReplaceEnvTextToEnvValue=sqlReplaceEnvTextToEnvValue(jb4DSession,sqlWithEnvText);
        resolveToDataSetVo.setSqlWithEnvValue(sqlReplaceEnvTextToEnvValue);
        String setSqlWithEnvRunningValue=sqlReplaceEnvValueToRunningValue(jb4DSession,sqlReplaceEnvTextToEnvValue);
        resolveToDataSetVo.setSqlWithEnvRunningValue(setSqlWithEnvRunningValue);
        String sqlReplaceRunningValueToEmptyFilter=sqlReplaceRunningValueToEmptyFilter(jb4DSession,setSqlWithEnvRunningValue);
        resolveToDataSetVo.setSqlWithEmptyData(sqlReplaceRunningValueToEmptyFilter);
        DataSetVo dataSetVo=resolveSQLToDataSet(jb4DSession,sqlReplaceRunningValueToEmptyFilter);

        //验证字段中是否都是大写
        for (DataSetColumnVo dataSetColumnVo : dataSetVo.getColumnVoList()) {
            String columnName=dataSetColumnVo.getColumnName();
            Pattern p=Pattern.compile("[a-z]*");
            Matcher m=p.matcher(columnName);
            while (m.find()) {
                if(!m.group().equals("")){
                    throw new JBuild4DCGenerallyException(0,"请使用大写的字段名:"+columnName+"!");
                }
            }
        }

        resolveToDataSetVo.setDataSetVo(dataSetVo);
        return resolveToDataSetVo;
    }

    @Override
    public PageInfo<DatasetEntity> getPageByGroupId(JB4DCSession jb4DSession, Integer pageNum, Integer pageSize, String groupId) {
        //return null;
        PageHelper.startPage(pageNum, pageSize);
        //PageHelper.
        List<DatasetEntity> list=datasetMapper.selectByGroupId(groupId);
        PageInfo<DatasetEntity> pageInfo = new PageInfo<DatasetEntity>(list);
        return pageInfo;
    }

    @Override
    public DataSetVo getApiDataSetVoStructure(JB4DCSession session, String recordId, String op, String groupId, String fullClassName) throws IllegalAccessException, InstantiationException {
        IDataSetAPI dataSetAPI=(IDataSetAPI) ClassUtility.loadClass(fullClassName).newInstance();
        return dataSetAPI.getDataSetStructure(session,recordId,op,groupId,"");
    }

    private boolean validateResolveSqlWithKeyWord(String sql) throws JBuild4DCGenerallyException {
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

    private boolean validateResolveResult(DataSetVo resultVo) throws JBuild4DCGenerallyException {
        //列中不能存在多个同名列
        List<DataSetColumnVo> dataSetColumnVoList=resultVo.getColumnVoList();
        if(dataSetColumnVoList==null||dataSetColumnVoList.size()==0){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"解析结果中不存在列！");
        }
        for (DataSetColumnVo columnVo : dataSetColumnVoList) {
            if(ListUtility.Where(dataSetColumnVoList, new IListWhereCondition<DataSetColumnVo>() {
                @Override
                public boolean Condition(DataSetColumnVo item) {
                    return item.getColumnName().equals(columnVo.getColumnName());
                }
            }).size()>1){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"解析的结果中存在多个同名列："+columnVo.getColumnName());
            }
        }
        return true;
    }

    @Override
    public int deleteByKey(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException {
        return deleteByKeyNotValidate(jb4DSession, id, JBuild4DCYaml.getWarningOperationCode());
    }

    @Override
    public int deleteByKeyNotValidate(JB4DCSession jb4DSession, String id, String warningOperationCode) throws JBuild4DCGenerallyException {
        if(JBuild4DCYaml.getWarningOperationCode().equals(warningOperationCode)) {
            datasetMapper.deleteByPrimaryKey(id);
            datasetRelatedTableService.deleteByDataSetId(jb4DSession, id);
            datasetColumnService.deleteByDataSetId(jb4DSession, id);
            return 0;
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"删除失败WarningOperationCode错误");
        //return super.deleteByKeyNotValidate(jb4DSession, id);
    }
}
