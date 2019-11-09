package com.jb4dc.builder.client.service.webform.impl;

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
import com.jb4dc.builder.tool.FormRecordComplexPOUtility;
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
    private ITableRuntimeProxy tableRuntimeProxy;

    @Autowired
    private ISQLBuilderService sqlBuilderService;

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

        //验证数据
        validateFormRecordComplexPO(jb4DCSession, recordId, formRecordComplexPO, operationTypeName);

        //保存数据
        List<PendingSQLPO> pendingSQLPOList = resolveFormRecordComplexPOTOPendingSQL(jb4DCSession, recordId, formRecordComplexPO, operationTypeName);
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

    private void validateFormRecordComplexPO(JB4DCSession jb4DCSession, String recordId, FormRecordComplexPO formRecordComplexPO,String operationTypeName) throws JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException {
        FormRecordDataRelationPO mainFormRecordDataRelationPO = FormRecordComplexPOUtility.findMainFormRecordDataRelationPO(formRecordComplexPO);
        //为新增操作时,判断ID是否已经存在.
        if(BaseUtility.isAddOperation(operationTypeName)){
            if(this.formRecordDataPOIsExist(mainFormRecordDataRelationPO.getOneDataRecord(),mainFormRecordDataRelationPO.getTableName())){
                String idValue = FormRecordComplexPOUtility.findIdInFormRecordFieldDataPO(mainFormRecordDataRelationPO.getOneDataRecord());
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"操作类型:"+operationTypeName+",已经存在ID为:"+idValue+"的记录!");
            }
        }
    }

    private void validateTableFieldDefaultValue(List<TableFieldPO> hasDefaultValueTableFieldPOList) throws JBuild4DCGenerallyException {
        for (TableFieldPO tableFieldPO : hasDefaultValueTableFieldPOList) {
            if(tableFieldPO.getFieldName().toUpperCase().equals("ID")&&StringUtility.isNotEmpty(tableFieldPO.getFieldDefaultValue())){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"表"+tableFieldPO.getTableName()+"字段ID不支持设置默认值");
            }
        }
    }

    private static int ORDER_SPACE=5;
    private int getNextDBOrderNum(String tableName,List<TableFieldPO> tableFieldPOList) throws JBuild4DCSQLKeyWordException {
        String orderFieldName = this.getOrderNumFieldName(tableName, tableFieldPOList);
        if (SQLKeyWordUtility.singleWord(tableName)) {
            String sql = "select max(" + orderFieldName + ") from " + tableName + "";
            Object maxNum=sqlBuilderService.selectOneScalar(sql);
            if(maxNum==null)
                return 1;
            return (int) maxNum+ORDER_SPACE;
        }
        return -1;
    }

    private String getOrderNumFieldName(String tableName,List<TableFieldPO> tableFieldPOList){
        String ORDER_NUM_FIELD_NAME="F_ORDER_NUM";
        if(tableFieldPOList.parallelStream().anyMatch(item->item.getFieldName().equals(ORDER_NUM_FIELD_NAME))){
            return ORDER_NUM_FIELD_NAME;
        }
        return null;
    }

    private List<PendingSQLPO> resolveFormRecordComplexPOTOPendingSQL(JB4DCSession jb4DCSession, String recordId, FormRecordComplexPO formRecordComplexPO,String operationTypeName) throws JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException {
        List<PendingSQLPO> pendingSQLPOList = new ArrayList<>();

        //将主记录转换为SQL语句
        FormRecordDataRelationPO mainFormRecordDataRelationPO = FormRecordComplexPOUtility.findMainFormRecordDataRelationPO(formRecordComplexPO);
        String idValue = FormRecordComplexPOUtility.findIdInFormRecordFieldDataPO(mainFormRecordDataRelationPO.getOneDataRecord());

        List<TableFieldPO> tableFieldPOList = tableRuntimeProxy.getTableFieldsByTableId(mainFormRecordDataRelationPO.getTableId());
        int nextDBOrderNum=this.getNextDBOrderNum(mainFormRecordDataRelationPO.getTableName(),tableFieldPOList);
        String orderFieldName=this.getOrderNumFieldName(mainFormRecordDataRelationPO.getTableName(),tableFieldPOList);
        PendingSQLPO pendingSQLPO=resolveFormRecordDataPOTOPendingSQL(
                jb4DCSession,
                recordId,
                idValue,
                mainFormRecordDataRelationPO.getTableName(),
                mainFormRecordDataRelationPO.getTableId(),
                mainFormRecordDataRelationPO.getOneDataRecord(),orderFieldName,nextDBOrderNum);
        pendingSQLPOList.add(pendingSQLPO);

        //转换从记录
        List<FormRecordDataRelationPO> notMainFormRecordDataRelationPOList=FormRecordComplexPOUtility.findNotMainFormRecordDataRelationPO(formRecordComplexPO);
        if(notMainFormRecordDataRelationPOList!=null&&notMainFormRecordDataRelationPOList.size()>0){
            for (FormRecordDataRelationPO formRecordDataRelationPO : notMainFormRecordDataRelationPOList) {
                if(formRecordDataRelationPO.getOneDataRecord()!=null){
                    int subODRNextDBOrderNum=this.getNextDBOrderNum(mainFormRecordDataRelationPO.getTableName(),tableFieldPOList);
                    String subODROrderFieldName=this.getOrderNumFieldName(mainFormRecordDataRelationPO.getTableName(),tableFieldPOList);
                    String subOneIdValue = FormRecordComplexPOUtility.findIdInFormRecordFieldDataPO(formRecordDataRelationPO.getOneDataRecord());

                    PendingSQLPO subOnePendingSQLPO=resolveFormRecordDataPOTOPendingSQL(
                            jb4DCSession,
                            recordId,
                            subOneIdValue,
                            formRecordDataRelationPO.getTableName(),
                            formRecordDataRelationPO.getTableId(),
                            formRecordDataRelationPO.getOneDataRecord(),
                            subODROrderFieldName,
                            subODRNextDBOrderNum
                    );
                    pendingSQLPOList.add(subOnePendingSQLPO);
                }
                if(formRecordDataRelationPO.getListDataRecord()!=null&&formRecordDataRelationPO.getListDataRecord().size()>0) {

                    int subLDRNextDBOrderNum=this.getNextDBOrderNum(mainFormRecordDataRelationPO.getTableName(),tableFieldPOList);
                    String subLDROrderFieldName=this.getOrderNumFieldName(mainFormRecordDataRelationPO.getTableName(),tableFieldPOList);

                    List<FormRecordDataPO> listDataRecord = formRecordDataRelationPO.getListDataRecord();
                    for (int i = 0; i < listDataRecord.size(); i++) {
                        FormRecordDataPO formRecordDataPO = listDataRecord.get(i);
                        String subListIdValue = FormRecordComplexPOUtility.findIdInFormRecordFieldDataPO(formRecordDataPO);
                        PendingSQLPO subListPendingSQLPO = resolveFormRecordDataPOTOPendingSQL(
                                jb4DCSession,
                                recordId,
                                subListIdValue,
                                formRecordDataRelationPO.getTableName(),
                                formRecordDataRelationPO.getTableId(),
                                formRecordDataPO,
                                subLDROrderFieldName,
                                subLDRNextDBOrderNum + ORDER_SPACE *(i)
                        );
                        pendingSQLPOList.add(subListPendingSQLPO);
                    }
                }
            }
        }

        return pendingSQLPOList;
    }

    private PendingSQLPO resolveFormRecordDataPOTOPendingSQL(JB4DCSession jb4DCSession, String recordId, String idValue,String tableName,String tableId,FormRecordDataPO formRecordDataPO,String orderFieldName,int orderNum) throws JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException {
        try {
            PendingSQLPO pendingSQLPO = new PendingSQLPO();
            if (!SQLKeyWordUtility.singleWord(tableName)) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "表名检测失败");
            }
            StringBuilder sqlBuilder = new StringBuilder();
            Map<String, Object> sqlMapPara = new HashMap<>();
            List<FormRecordFieldDataPO> recordFieldPOList = formRecordDataPO.getRecordFieldPOList();
            Map<String, FormRecordFieldDataPO> recordFieldPOListMap = FormRecordComplexPOUtility.converFormRecordFieldDataPOListToMap(recordFieldPOList);
            if (!this.formRecordDataPOIsExist(formRecordDataPO, tableName)) {
                pendingSQLPO.setExecType(PendingSQLPO.EXEC_TYPE_INSERT);
                //尝试补完表设计中的默认值
                List<TableFieldPO> tableFieldPOList = tableRuntimeProxy.getTableFieldsByTableId(tableId);
                List<TableFieldPO> hasDefaultValueTableFieldPOList = tableFieldPOList.parallelStream().filter(item -> StringUtility.isNotEmpty(item.getFieldDefaultValue())).collect(Collectors.toList());

                this.validateTableFieldDefaultValue(hasDefaultValueTableFieldPOList);
                //计算生成默认值
                for (TableFieldPO tableFieldPO : hasDefaultValueTableFieldPOList) {
                    String value = envVariableRuntimeResolveProxy.execDefaultValueResult(jb4DCSession, tableFieldPO.getFieldDefaultType(), tableFieldPO.getFieldDefaultValue());
                    tableFieldPO.setValue(value);
                }
                //如果存在空值的,则替换值,如果不存在的,则加入新字段
                for (TableFieldPO defaultTableFieldPO : hasDefaultValueTableFieldPOList) {
                    if (recordFieldPOListMap.containsKey(defaultTableFieldPO.getFieldName())) {
                        if (StringUtility.isEmpty(recordFieldPOListMap.get(defaultTableFieldPO.getFieldName()).getValue().toString())) {
                            recordFieldPOListMap.get(defaultTableFieldPO.getFieldName()).setValue(defaultTableFieldPO.getValue());
                        }
                    } else {
                        FormRecordFieldDataPO tempPO = FormRecordFieldDataPO.getTemplatePO(recordFieldPOList.get(0), defaultTableFieldPO);
                        recordFieldPOList.add(tempPO);
                        recordFieldPOListMap.put(tempPO.getFieldName(), tempPO);
                    }
                }
                //如果存在排序字段,则自动生成该字段与值
                if(StringUtility.isNotEmpty(orderFieldName)){
                    FormRecordFieldDataPO tempPO = FormRecordFieldDataPO.getTemplatePO(recordFieldPOList.get(0),orderFieldName);
                    tempPO.setValue(orderNum);
                    recordFieldPOList.add(tempPO);
                    recordFieldPOListMap.put(tempPO.getFieldName(), tempPO);
                }

                //构建SQL语句.
                StringBuilder fieldNames = new StringBuilder();
                StringBuilder fieldValues = new StringBuilder();

                //设置外键关联的相关字段
                if(!formRecordDataPO.getSelfFieldName().equals("NotOuterField")) {
                    fieldNames.append(formRecordDataPO.getSelfFieldName());
                    fieldNames.append(",");
                    fieldValues.append("#{"+formRecordDataPO.getSelfFieldName()+"}");
                    fieldValues.append(",");
                    sqlMapPara.put(formRecordDataPO.getSelfFieldName(), formRecordDataPO.getOuterFieldValue());
                }

                for (FormRecordFieldDataPO formRecordFieldDataPO : recordFieldPOList) {
                    fieldNames.append(formRecordFieldDataPO.getFieldName());
                    fieldNames.append(",");
                    fieldValues.append("#{" + formRecordFieldDataPO.getFieldName() + "}");
                    fieldValues.append(",");
                    sqlMapPara.put(formRecordFieldDataPO.getFieldName(), formRecordFieldDataPO.getValue());
                }
                //fieldNames = fieldNames.delete(fieldNames.length() - 2, 1);
                fieldNames =fieldNames.deleteCharAt(fieldNames.length() - 1);
                //fieldValues = fieldValues.delete(fieldValues.length() - 2, 1);
                fieldValues =fieldValues.deleteCharAt(fieldValues.length() - 1);
                sqlBuilder.append("insert into " + tableName + "(" + fieldNames + ") values(" + fieldValues + ")");
            }
            else {
                recordFieldPOList = FormRecordComplexPOUtility.findExcludeIdFormRecordFieldList(formRecordDataPO);
                recordFieldPOListMap = FormRecordComplexPOUtility.converFormRecordFieldDataPOListToMap(recordFieldPOList);

                pendingSQLPO.setExecType(PendingSQLPO.EXEC_TYPE_UPDATE);
                sqlBuilder.append("update " + tableName + " set ");

                for (FormRecordFieldDataPO fieldDataPO : recordFieldPOList) {
                    sqlBuilder.append(String.format("%s=#{%s},", fieldDataPO.getFieldName(), fieldDataPO.getFieldName()));
                    sqlMapPara.put(fieldDataPO.getFieldName(), fieldDataPO.getValue());
                }

                sqlBuilder.append("where ID=${ID}");
                sqlMapPara.put("ID", idValue);
            }

            pendingSQLPO.setSql(sqlBuilder.toString());
            pendingSQLPO.setSqlPara(sqlMapPara);

            return pendingSQLPO;
        }
        catch (Exception ex){
            //String traceMsg=org.apache.commons.lang3.exception.ExceptionUtils.getStackTrace(ex);
            //ex.setStackTrace();
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,ex.getMessage(),ex.getCause(),ex.getStackTrace());
        }
    }

    private boolean formRecordDataPOIsExist(FormRecordDataPO formRecordDataPO,String tableName) throws JBuild4DCSQLKeyWordException, JBuild4DCGenerallyException {
        String idValue = FormRecordComplexPOUtility.findIdInFormRecordFieldDataPO(formRecordDataPO);
        if (!SQLKeyWordUtility.singleWord(tableName)) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "表名检测失败");
        }
        String sql = "select count(1) from " + tableName + " where ID=#{ID}";
        Map paraMap = new HashMap();
        paraMap.put("ID", idValue);
        Object count = sqlBuilderService.selectOneScalar(sql, paraMap);
        return Integer.parseInt(count.toString()) > 0;
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
