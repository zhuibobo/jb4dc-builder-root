package com.jb4dc.builder.client.service.webform.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.aspect.CalculationRunTime;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.service.api.ApiRunPara;
import com.jb4dc.builder.client.service.api.ApiRunResult;
import com.jb4dc.builder.client.service.api.IApiForButton;
import com.jb4dc.builder.client.service.api.proxy.IApiRuntimeProxy;
import com.jb4dc.builder.client.service.datastorage.proxy.ITableRuntimeProxy;
import com.jb4dc.builder.client.service.envvar.proxy.IEnvVariableRuntimeResolveProxy;
import com.jb4dc.builder.client.service.webform.IWebFormDataSaveRuntimeService;
import com.jb4dc.builder.client.service.weblist.proxy.IWebListButtonRuntimeProxy;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.po.SubmitResultPO;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.po.button.InnerFormButtonConfig;
import com.jb4dc.builder.po.button.InnerFormButtonConfigAPI;
import com.jb4dc.builder.po.button.InnerFormButtonConfigField;
import com.jb4dc.builder.po.formdata.*;
import com.jb4dc.builder.tool.FormDataRelationPOUtility;
import com.jb4dc.builder.tool.FormRecordComplexPOUtility;
import com.jb4dc.builder.tool.FormRecordDataUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.BaseUtility;
import com.jb4dc.core.base.tools.ClassUtility;
import com.jb4dc.core.base.tools.SQLKeyWordUtility;
import com.jb4dc.core.base.tools.StringUtility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
@Service
public class WebFormDataSaveRuntimeServiceImpl implements IWebFormDataSaveRuntimeService {

    @Autowired
    private IWebListButtonRuntimeProxy webListButtonRuntimeResolveService;

    @Autowired
    private IApiRuntimeProxy apiRuntimeService;

    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;

    @Autowired
    private IEnvVariableRuntimeResolveProxy envVariableRuntimeResolveProxy;

    @Autowired
    private ResolvePendingSQL resolvePendingSQL;

    @Autowired
    private ISQLBuilderService sqlBuilderService;

    @Autowired
    private ITableRuntimeProxy tableRuntimeProxy;

    private Logger logger= LoggerFactory.getLogger(this.getClass());

    @Override
    @Transactional(rollbackFor= {JBuild4DCGenerallyException.class,JBuild4DCSQLKeyWordException.class})
    @CalculationRunTime(note = "执行保存数据的解析")
    public SubmitResultPO SaveFormRecordComplexPO(JB4DCSession jb4DCSession, String recordId, FormRecordComplexPO formRecordComplexPO, String listButtonId, String innerFormButtonId,String operationTypeName) throws JBuild4DCGenerallyException, IOException, JBuild4DCSQLKeyWordException {
        SubmitResultPO submitResultPO = new SubmitResultPO();

        ListButtonEntity listButtonEntity=null;
        List<InnerFormButtonConfig> innerFormButtonConfigList=null;
        InnerFormButtonConfig innerFormButtonConfig=null;
        if(StringUtility.isNotEmpty(listButtonId)) {
            listButtonEntity = webListButtonRuntimeResolveService.getButtonPO(listButtonId);
            innerFormButtonConfigList = JsonUtility.toObjectListIgnoreProp(listButtonEntity.getButtonInnerConfig(), InnerFormButtonConfig.class);
            innerFormButtonConfig = innerFormButtonConfigList.parallelStream().filter(item -> item.id.equals(innerFormButtonId)).findFirst().get();

            //执行前置API
            if (innerFormButtonConfig.getApis() != null && innerFormButtonConfig.getApis().size() > 0) {
                List<InnerFormButtonConfigAPI> beforeApiList = innerFormButtonConfig.getApis().parallelStream().filter(item -> item.getRunTime().equals("之前")).collect(Collectors.toList());
                for (InnerFormButtonConfigAPI innerFormButtonConfigAPI : beforeApiList) {
                    ApiRunResult apiRunResult = rubApi(innerFormButtonConfigAPI, formRecordComplexPO, listButtonEntity, innerFormButtonConfigList, innerFormButtonConfig);
                    if (!apiRunResult.isSuccess()) {
                        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "执行前置API" + innerFormButtonConfigAPI.getValue() + "失败!");
                    }
                }
            }
        }

        //保存数据
        List<PendingSQLPO> pendingSQLPOList = resolvePendingSQL.resolveFormRecordComplexPOTOPendingSQL(jb4DCSession, recordId, formRecordComplexPO, operationTypeName);
        for (PendingSQLPO pendingSQLPO : pendingSQLPOList) {
            logger.debug(BaseUtility.wrapDevLog("保存表单数据:待执行SQL"+pendingSQLPO.getSql()));
            logger.debug(BaseUtility.wrapDevLog("保存表单数据:待执行SQL参数"+JsonUtility.toObjectString(pendingSQLPO.getSqlPara())));

            if(pendingSQLPO.getExecType().equals(PendingSQLPO.EXEC_TYPE_INSERT)){
                sqlBuilderService.insert(pendingSQLPO.getSql(),pendingSQLPO.getSqlPara());
            }
            else if(pendingSQLPO.getExecType().equals(PendingSQLPO.EXEC_TYPE_UPDATE)){
                sqlBuilderService.update(pendingSQLPO.getSql(),pendingSQLPO.getSqlPara());
            }
        }

        if(StringUtility.isNotEmpty(listButtonId)) {
            //修改字段
            for (InnerFormButtonConfigField field : innerFormButtonConfig.getFields()) {
                this.updateField(jb4DCSession, field, formRecordComplexPO);
            }

            //执行后置API
            if (innerFormButtonConfig.getApis() != null && innerFormButtonConfig.getApis().size() > 0) {
                List<InnerFormButtonConfigAPI> afterApiList = innerFormButtonConfig.getApis().parallelStream().filter(item -> item.getRunTime().equals("之后")).collect(Collectors.toList());
                for (InnerFormButtonConfigAPI innerFormButtonConfigAPI : afterApiList) {
                    ApiRunResult apiRunResult = rubApi(innerFormButtonConfigAPI, formRecordComplexPO, listButtonEntity, innerFormButtonConfigList, innerFormButtonConfig);
                    if (!apiRunResult.isSuccess()) {
                        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "执行后置API" + innerFormButtonConfigAPI.getValue() + "失败!");
                    }
                }
            }
        }

        return submitResultPO;
    }

    @Override
    public List<FormRecordDataRelationPO> getFormRecordComplexPO(JB4DCSession session, String recordId, List<FormRecordDataRelationPO> formRecordDataRelationPOList) throws JBuild4DCSQLKeyWordException, JBuild4DCGenerallyException, JsonProcessingException {

        FormRecordDataRelationPO mainDataPO = FormDataRelationPOUtility.getMainPO(formRecordDataRelationPOList);
        if(SQLKeyWordUtility.singleWord(mainDataPO.getTableName())) {
            String sql = "select * from " + mainDataPO.getTableName() + " where ID=#{ID}";
            List<TableFieldPO> tableFieldPOList=tableRuntimeProxy.getTableFieldsByTableId(mainDataPO.getTableId());
            Map mainRecord = sqlBuilderService.selectOne(sql, recordId);
            FormRecordDataPO formRecordDataPO= FormRecordDataUtility.buildFormRecordDataPO(mainDataPO,mainRecord,tableFieldPOList);
            mainDataPO.setOneDataRecord(formRecordDataPO);

            Map<String,List<Map<String,Object>>> dataPool=new HashMap<>();
            addToDataToPool(dataPool,mainDataPO.getTableName(),mainRecord);

            for (FormRecordDataRelationPO formRecordDataRelationPO : formRecordDataRelationPOList) {
                if (FormDataRelationPOUtility.isNotMain(formRecordDataRelationPO)) {

                    String selfKeyFieldName = formRecordDataRelationPO.getSelfKeyFieldName();
                    String outerKeyFieldName = formRecordDataRelationPO.getOuterKeyFieldName();
                    String tableName = formRecordDataRelationPO.getTableName();

                    FormRecordDataRelationPO parentPO=FormDataRelationPOUtility.getParentPO(formRecordDataRelationPOList,formRecordDataRelationPO);

                    List<String> outerKeyFieldValues=getValuesFromDataPool(dataPool,parentPO.getTableName(),outerKeyFieldName);
                    if(outerKeyFieldValues.size()==0){
                        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"在父记录中查找不到所需的字段!");
                    }
                    String innerSql="select * from "+formRecordDataRelationPO.getTableName()+" where "+selfKeyFieldName+" in (";
                    for (String outerKeyFieldValue : outerKeyFieldValues) {
                        innerSql+=SQLKeyWordUtility.stringWrap(outerKeyFieldValue)+",";
                    }
                    innerSql=StringUtility.removeLastChar(innerSql)+")";
                    List<Map<String, Object>> recordList=sqlBuilderService.selectList(innerSql);
                    this.addToDataToPool(dataPool,formRecordDataRelationPO.getTableName(),recordList);

                    if(formRecordDataRelationPO.getRelationType().equals(FormRecordDataRelationPO.RELATION_TYPE_1_T_1)){
                        if(recordList.size()>0){
                            List<TableFieldPO> tempTableFieldPOList=tableRuntimeProxy.getTableFieldsByTableId(formRecordDataRelationPO.getTableId());
                            FormRecordDataPO tempFormRecordDataPO= FormRecordDataUtility.buildFormRecordDataPO(formRecordDataRelationPO,recordList.get(0),tempTableFieldPOList);
                            formRecordDataRelationPO.setOneDataRecord(tempFormRecordDataPO);
                        }
                    }
                    else{
                        if(recordList.size()>0){
                            List<TableFieldPO> tempTableFieldPOList=tableRuntimeProxy.getTableFieldsByTableId(formRecordDataRelationPO.getTableId());
                            List<FormRecordDataPO> tempFormRecordDataPOList= FormRecordDataUtility.buildFormRecordDataPOList(formRecordDataRelationPO,recordList,tempTableFieldPOList);
                            formRecordDataRelationPO.setListDataRecord(tempFormRecordDataPOList);
                        }
                    }
                }
            }
            String json=JsonUtility.toObjectString(formRecordDataRelationPOList);
            logger.debug(BaseUtility.wrapDevLog(json));
            return formRecordDataRelationPOList;
        }
        return null;
    }

    private void addToDataToPool(Map<String,List<Map<String,Object>>> dataPool,String tableName,Map mainRecord){
        List<Map<String,Object>> recordList=new ArrayList<>();
        if(dataPool.containsKey(tableName)){
            recordList=dataPool.get(tableName);
        }
        recordList.add(mainRecord);
    }

    private void addToDataToPool(Map<String,List<Map<String,Object>>> dataPool,String tableName, List<Map<String, Object>> recordList){
        if(dataPool.containsKey(tableName)){
            List<Map<String, Object>> oldRecordList=dataPool.get(tableName);
            oldRecordList.addAll(recordList);
            dataPool.remove(tableName);
            dataPool.put(tableName,oldRecordList);
        }
        else{
            dataPool.put(tableName,recordList);
        }
    }

    private List<String> getValuesFromDataPool(Map<String,List<Map<String,Object>>> dataPool,String tableName,String fieldName){
        List<Map<String,Object>> recordList=dataPool.get(tableName);
        List<String> result=new ArrayList<>();
        for (Map recordMap : recordList) {
            result.add(recordMap.get(fieldName).toString());
        }
        return result;
    }

    protected void updateField(JB4DCSession jb4DCSession,InnerFormButtonConfigField field, FormRecordComplexPO formRecordComplexPO) throws JBuild4DCGenerallyException {
        try {
            String tableName = field.getTableName();
            String fieldName = field.getFieldName();
            String fieldDefaultType = field.getFieldDefaultType();
            String fieldDefaultText = field.getFieldDefaultText();
            String fieldDefaultValue = field.getFieldDefaultValue();
            String value = envVariableRuntimeResolveProxy.execDefaultValueResult(jb4DCSession, fieldDefaultType, fieldDefaultValue);
            //value = "123";
            String sql = String.format("update %s set %s=#{%s} where id=#{id}", tableName, fieldName, fieldName);
            Map paraMap = new HashMap();
            paraMap.put(fieldName, value);
            paraMap.put("id", formRecordComplexPO.getRecordId());
            //paraMap.put("id","57d35380-844f-c403-29e4-3d3e88a87b3c");
            sqlBuilderService.update(sql, paraMap);
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage(),ex,ex.getStackTrace());
        }
    }

    protected ApiRunResult rubApi(InnerFormButtonConfigAPI innerFormButtonConfigAPI, FormRecordComplexPO formRecordComplexPO, ListButtonEntity listButtonEntity,List<InnerFormButtonConfig> innerFormButtonConfigList,InnerFormButtonConfig innerFormButtonConfig) throws JBuild4DCGenerallyException {
        try {
            ApiItemEntity apiItemEntity = apiRuntimeService.getApiPOByValue(innerFormButtonConfigAPI.getValue());
            ApiRunPara apiRunPara = new ApiRunPara();
            apiRunPara.setInnerFormButtonConfigAPI(innerFormButtonConfigAPI);
            apiRunPara.setApiItemEntity(apiItemEntity);
            apiRunPara.setFormRecordComplexPO(formRecordComplexPO);
            apiRunPara.setListButtonEntity(listButtonEntity);
            apiRunPara.setInnerFormButtonConfigList(innerFormButtonConfigList);
            apiRunPara.setInnerFormButtonConfig(innerFormButtonConfig);

            String className = apiItemEntity.getApiItemClassName();
            IApiForButton apiForButton = (IApiForButton) ClassUtility.loadClass(className).newInstance();
            autowireCapableBeanFactory.autowireBean(apiForButton);
            return apiForButton.runApi(apiRunPara);
        } catch (IllegalAccessException e) {
            throw new JBuild4DCGenerallyException(e.hashCode(),e.getMessage(),e,e.getStackTrace());
        } catch (InstantiationException e) {
            throw new JBuild4DCGenerallyException(e.hashCode(),e.getMessage(),e,e.getStackTrace());
        }
    }
}
