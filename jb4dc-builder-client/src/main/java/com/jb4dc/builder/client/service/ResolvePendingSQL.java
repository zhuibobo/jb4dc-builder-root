package com.jb4dc.builder.client.service;

import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.builder.client.exenum.TableFieldTypeEnum;
import com.jb4dc.builder.client.proxy.ITableRuntimeProxy;
import com.jb4dc.builder.client.proxy.IEnvVariableRuntimeProxy;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.po.formdata.*;
import com.jb4dc.builder.tool.FormRecordComplexPOUtility;
import com.jb4dc.builder.tool.FormRecordDataUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.BaseUtility;
import com.jb4dc.core.base.tools.SQLKeyWordUtility;
import com.jb4dc.core.base.tools.StringUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/9
 * To change this template use File | Settings | File Templates.
 */
@Service
public class ResolvePendingSQL {

    @Autowired
    private ITableRuntimeProxy tableRuntimeProxy;

    @Autowired
    private ISQLBuilderService sqlBuilderService;

    @Autowired
    private IEnvVariableRuntimeProxy envVariableRuntimeResolveProxy;

    protected static int ORDER_SPACE=5;
    protected int getNextDBOrderNum(String tableName,List<TableFieldPO> tableFieldPOList) throws JBuild4DCSQLKeyWordException {
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

    protected String getOrderNumFieldName(String tableName,List<TableFieldPO> tableFieldPOList){
        String ORDER_NUM_FIELD_NAME="F_ORDER_NUM";
        if(tableFieldPOList.parallelStream().anyMatch(item->item.getFieldName().equals(ORDER_NUM_FIELD_NAME))){
            return ORDER_NUM_FIELD_NAME;
        }
        else if (tableFieldPOList.stream().filter(item->item.getFieldName().indexOf("_ORDER_NUM")>0).count()==1)
        {
            return tableFieldPOList.stream().filter(item->item.getFieldName().indexOf("_ORDER_NUM")>0).findFirst().get().getFieldName();
        }
        return null;
    }

    protected void validateFormRecordComplexPO(JB4DCSession jb4DCSession, String recordId, FormRecordComplexPO formRecordComplexPO,String operationTypeName,List<TableFieldPO> tableFieldPOList) throws JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException {
        //System.out.println("11111");
        FormRecordDataRelationPO mainFormRecordDataRelationPO = FormRecordComplexPOUtility.findMainFormRecordDataRelationPO(formRecordComplexPO);
        //为新增操作时,判断ID是否已经存在.
        if(BaseUtility.isAddOperation(operationTypeName)){
            if(this.formRecordDataPOIsExist(mainFormRecordDataRelationPO.getOneDataRecord(),mainFormRecordDataRelationPO.getTableName(),tableFieldPOList)){
                String idValue = FormRecordDataUtility.findIdInFormRecordFieldDataPO(mainFormRecordDataRelationPO.getOneDataRecord(),tableFieldPOList);
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"操作类型:"+operationTypeName+",已经存在ID为:"+idValue+"的记录!");
            }
        }
    }

    public List<PendingSQLPO> resolveFormRecordComplexPOTOPendingSQL(JB4DCSession jb4DCSession, String recordId, FormRecordComplexPO formRecordComplexPO, String operationTypeName) throws JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException {

        List<PendingSQLPO> pendingSQLPOList = new ArrayList<>();

        //将主记录转换为SQL语句
        FormRecordDataRelationPO mainFormRecordDataRelationPO = FormRecordComplexPOUtility.findMainFormRecordDataRelationPO(formRecordComplexPO);
        List<TableFieldPO> tableFieldPOList = tableRuntimeProxy.getTableFieldsByTableId(mainFormRecordDataRelationPO.getTableId());
        String idValue = FormRecordDataUtility.findIdInFormRecordFieldDataPO(mainFormRecordDataRelationPO.getOneDataRecord(),tableFieldPOList);

        //验证数据
        validateFormRecordComplexPO(jb4DCSession, recordId, formRecordComplexPO, operationTypeName,tableFieldPOList);

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
                if(formRecordDataRelationPO.getIsSave().equals("true")) {
                    if (formRecordDataRelationPO.getOneDataRecord() != null) {
                        int subODRNextDBOrderNum = this.getNextDBOrderNum(mainFormRecordDataRelationPO.getTableName(), tableFieldPOList);
                        String subODROrderFieldName = this.getOrderNumFieldName(mainFormRecordDataRelationPO.getTableName(), tableFieldPOList);
                        String subOneIdValue = FormRecordDataUtility.findIdInFormRecordFieldDataPO(formRecordDataRelationPO.getOneDataRecord(),null);

                        PendingSQLPO subOnePendingSQLPO = resolveFormRecordDataPOTOPendingSQL(
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
                    if (formRecordDataRelationPO.getListDataRecord() != null && formRecordDataRelationPO.getListDataRecord().size() > 0) {

                        List<TableFieldPO> subTableFieldPOList = tableRuntimeProxy.getTableFieldsByTableId(formRecordDataRelationPO.getTableId());
                        int subLDRNextDBOrderNum = this.getNextDBOrderNum(formRecordDataRelationPO.getTableName(), subTableFieldPOList);
                        String subLDROrderFieldName = this.getOrderNumFieldName(formRecordDataRelationPO.getTableName(), subTableFieldPOList);

                        List<FormRecordDataPO> listDataRecord = formRecordDataRelationPO.getListDataRecord();
                        for (int i = 0; i < listDataRecord.size(); i++) {
                            FormRecordDataPO formRecordDataPO = listDataRecord.get(i);

                            String subListIdValue = FormRecordDataUtility.findIdInFormRecordFieldDataPO(formRecordDataPO,subTableFieldPOList);
                            PendingSQLPO subListPendingSQLPO = resolveFormRecordDataPOTOPendingSQL(
                                    jb4DCSession,
                                    recordId,
                                    subListIdValue,
                                    formRecordDataRelationPO.getTableName(),
                                    formRecordDataRelationPO.getTableId(),
                                    formRecordDataPO,
                                    subLDROrderFieldName,
                                    subLDRNextDBOrderNum + ORDER_SPACE * (i)
                            );
                            pendingSQLPOList.add(subListPendingSQLPO);
                        }
                    }
                }
            }
        }

        return pendingSQLPOList;
    }

    protected void validateTableFieldDefaultValue(List<TableFieldPO> hasDefaultValueTableFieldPOList) throws JBuild4DCGenerallyException {
        for (TableFieldPO tableFieldPO : hasDefaultValueTableFieldPOList) {
            if(tableFieldPO.getFieldName().toUpperCase().equals("ID")&&StringUtility.isNotEmpty(tableFieldPO.getFieldDefaultValue())){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"表"+tableFieldPO.getTableName()+"字段ID不支持设置默认值");
            }
        }
    }

    public TableFieldPO findPrimaryKey(String tableName,List<TableFieldPO> tableFieldPOList) throws JBuild4DCGenerallyException {
        if(tableFieldPOList.stream().filter(tableFieldPO -> tableFieldPO.getFieldIsPk().equals("是")).count()==0){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"表["+tableName+"]未定义主键!");
        }
        else if(tableFieldPOList.stream().filter(tableFieldPO -> tableFieldPO.getFieldIsPk().equals("是")).count()>1){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"表["+tableName+"]存在复合主键,系统暂不支持!");
        }
        TableFieldPO pkTableFieldPo=tableFieldPOList.stream().filter(tableFieldPO -> tableFieldPO.getFieldIsPk().equals("是")).findFirst().get();
        return pkTableFieldPo;
    }

    public String findPrimaryValue(Map recordData,String tableName,List<TableFieldPO> tableFieldPOList) throws JBuild4DCGenerallyException {
        TableFieldPO primaryKey=findPrimaryKey(tableName,tableFieldPOList);
        return recordData.get(primaryKey.getFieldName()).toString();
    }

    protected boolean formRecordDataPOIsExist(FormRecordDataPO formRecordDataPO,String tableName,List<TableFieldPO> tableFieldPOList) throws JBuild4DCSQLKeyWordException, JBuild4DCGenerallyException {
        String idValue = FormRecordDataUtility.findIdInFormRecordFieldDataPO(formRecordDataPO,tableFieldPOList);
        if (!SQLKeyWordUtility.singleWord(tableName)) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "表名检测失败");
        }

        /*if(tableFieldPOList.stream().filter(tableFieldPO -> tableFieldPO.getFieldIsPk().equals("是")).count()==0){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"表["+tableName+"]未定义主键!");
        }
        else if(tableFieldPOList.stream().filter(tableFieldPO -> tableFieldPO.getFieldIsPk().equals("是")).count()>1){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"表["+tableName+"]存在复合主键,系统暂不支持!");
        }*/
        TableFieldPO pkTableFieldPo=findPrimaryKey(tableName,tableFieldPOList);

        String sql = "select count(1) from " + tableName + " where "+pkTableFieldPo.getFieldName()+"=#{ID}";
        Map paraMap = new HashMap();
        paraMap.put("ID", idValue);
        Object count = sqlBuilderService.selectOneScalar(sql, paraMap);
        return Integer.parseInt(count.toString()) > 0;
    }

    protected PendingSQLPO resolveFormRecordDataPOTOPendingSQL(JB4DCSession jb4DCSession, String recordId, String idValue,String tableName,String tableId,FormRecordDataPO formRecordDataPO,String orderFieldName,int orderNum) throws JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException {
        try {
            PendingSQLPO pendingSQLPO = new PendingSQLPO();
            if (!SQLKeyWordUtility.singleWord(tableName)) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "表名检测失败");
            }
            StringBuilder sqlBuilder = new StringBuilder();
            Map<String, Object> sqlMapPara = new HashMap<>();
            List<FormRecordFieldDataPO> recordFieldPOList = formRecordDataPO.getRecordFieldPOList();
            Map<String, FormRecordFieldDataPO> recordFieldPOListMap = FormRecordDataUtility.convertFormRecordFieldDataPOListToMap(recordFieldPOList);

            List<TableFieldPO> tableFieldPOList = tableRuntimeProxy.getTableFieldsByTableId(tableId);

            if (!this.formRecordDataPOIsExist(formRecordDataPO, tableName,tableFieldPOList)) {
                pendingSQLPO.setExecType(PendingSQLPO.EXEC_TYPE_INSERT);
                //尝试补完表设计中的默认值
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
                    if(formRecordFieldDataPO.getValue()!=null&&!formRecordFieldDataPO.getValue().equals("")) {
                        fieldNames.append(formRecordFieldDataPO.getFieldName());
                        fieldNames.append(",");
                        fieldValues.append("#{" + formRecordFieldDataPO.getFieldName() + "}");
                        fieldValues.append(",");
                        sqlMapPara.put(formRecordFieldDataPO.getFieldName(), formRecordFieldDataPO.getValue().toString());
                    }
                }
                //fieldNames = fieldNames.delete(fieldNames.length() - 2, 1);
                fieldNames =StringUtility.removeLastChar(fieldNames);
                //fieldValues = fieldValues.delete(fieldValues.length() - 2, 1);
                fieldValues =StringUtility.removeLastChar(fieldValues);
                sqlBuilder.append("insert into " + tableName + "(" + fieldNames + ") values(" + fieldValues + ")");
            }
            else {
                recordFieldPOList = FormRecordDataUtility.findExcludeIdFormRecordFieldList(formRecordDataPO);
                recordFieldPOListMap = FormRecordDataUtility.convertFormRecordFieldDataPOListToMap(recordFieldPOList);

                pendingSQLPO.setExecType(PendingSQLPO.EXEC_TYPE_UPDATE);
                sqlBuilder.append("update " + tableName + " set ");

                for (FormRecordFieldDataPO fieldDataPO : recordFieldPOList) {
                    if(fieldDataPO.getValue()!=null) {
                        if (fieldDataPO.getFieldDataType().equals(TableFieldTypeEnum.DataTimeType.getText())&&StringUtility.isEmpty(fieldDataPO.getValue().toString())) {
                            sqlBuilder.append(String.format("%s=#{%s},", fieldDataPO.getFieldName(), fieldDataPO.getFieldName()));
                            sqlMapPara.put(fieldDataPO.getFieldName(),null);
                        }
                        else if (fieldDataPO.getFieldDataType().equals(TableFieldTypeEnum.IntType.getText())||fieldDataPO.getFieldDataType().equals(TableFieldTypeEnum.NumberType.getText())&&StringUtility.isEmpty(fieldDataPO.getValue().toString())) {
                            sqlBuilder.append(String.format("%s=#{%s},", fieldDataPO.getFieldName(), fieldDataPO.getFieldName()));
                            sqlMapPara.put(fieldDataPO.getFieldName(),null);
                        }
                        else {
                            sqlBuilder.append(String.format("%s=#{%s},", fieldDataPO.getFieldName(), fieldDataPO.getFieldName()));
                            sqlMapPara.put(fieldDataPO.getFieldName(), fieldDataPO.getValue().toString());
                        }
                    }
                }
                sqlBuilder=StringUtility.removeLastChar(sqlBuilder);

                TableFieldPO pkFieldPO=findPrimaryKey(tableName,tableFieldPOList);

                sqlBuilder.append(" where "+pkFieldPO.getFieldName()+"=#{ID}");
                sqlMapPara.put("ID", idValue);
            }

            pendingSQLPO.setSql(sqlBuilder.toString());
            pendingSQLPO.setSqlPara(sqlMapPara);

            return pendingSQLPO;
        }
        catch (Exception ex){
            //String traceMsg=org.apache.commons.lang3.exception.ExceptionUtils.getStackTrace(ex);
            //ex.setStackTrace();
            ex.printStackTrace();
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,ex.getMessage(),ex.getCause(),ex.getStackTrace());
        }
    }

}
