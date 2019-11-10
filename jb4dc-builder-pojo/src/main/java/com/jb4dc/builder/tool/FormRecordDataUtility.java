package com.jb4dc.builder.tool;

import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.po.formdata.FormRecordDataPO;
import com.jb4dc.builder.po.formdata.FormRecordDataRelationPO;
import com.jb4dc.builder.po.formdata.FormRecordFieldDataPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/10
 * To change this template use File | Settings | File Templates.
 */
public class FormRecordDataUtility {
    public static String findIdInFormRecordFieldDataPO(FormRecordDataPO formRecordDataPO) throws JBuild4DCGenerallyException {
        FormRecordFieldDataPO formRecordFieldDataPO =  formRecordDataPO.getRecordFieldPOList().stream().filter(item -> item.getFieldName().toUpperCase().equals("ID")).findFirst().orElse(null);
        if(formRecordFieldDataPO==null) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"在formRecordDataPO中不存在ID字段!");
        }
        return formRecordFieldDataPO.getValue().toString();
    }

    public static List<FormRecordFieldDataPO> findExcludeIdFormRecordFieldList(FormRecordDataPO formRecordDataPO){
        List<FormRecordFieldDataPO> formRecordFieldDataPOList=formRecordDataPO.getRecordFieldPOList().stream().filter(item -> !item.getFieldName().toUpperCase().equals("ID")).collect(Collectors.toList());
        return formRecordFieldDataPOList;
    }

    public static Map<String,FormRecordFieldDataPO> convertFormRecordFieldDataPOListToMap(List<FormRecordFieldDataPO> recordFieldPOList) throws JBuild4DCGenerallyException {
        Map<String,FormRecordFieldDataPO> result=new HashMap<>();
        for (FormRecordFieldDataPO formRecordFieldDataPO : recordFieldPOList) {
            if(!result.containsKey(formRecordFieldDataPO.getFieldName())){
                result.put(formRecordFieldDataPO.getFieldName(),formRecordFieldDataPO);
            }
            else{
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"包含多个同名的字段:"+formRecordFieldDataPO.getFieldName()+",表:"+formRecordFieldDataPO.getTableCaption());
            }
        }
        return result;
    }

    public static Map<String,TableFieldPO> convertTableFieldPOListToMap(List<TableFieldPO> tableFieldPOList) throws JBuild4DCGenerallyException {
        Map<String,TableFieldPO> result=new HashMap<>();
        for (TableFieldPO tableFieldPO : tableFieldPOList) {
            if(!result.containsKey(tableFieldPO.getFieldName())){
                result.put(tableFieldPO.getFieldName(),tableFieldPO);
            }
            else{
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"包含多个同名的字段:"+tableFieldPO.getFieldName()+",表:"+tableFieldPO.getTableName());
            }
        }
        return result;
    }

    public static FormRecordDataPO buildFormRecordDataPO(FormRecordDataRelationPO mainDataPO, Map<String,Object> mainRecord,List<TableFieldPO> tableFieldPOList) throws JBuild4DCGenerallyException {
        String idValue=mainRecord.get("ID").toString();
        List<FormRecordFieldDataPO> formRecordFieldDataPOList=new ArrayList<>();
        Map<String,TableFieldPO> tableFieldPOMap=convertTableFieldPOListToMap(tableFieldPOList);

        for (Map.Entry<String, Object> stringObjectEntry : mainRecord.entrySet()) {
            TableFieldPO tableFieldPO=tableFieldPOMap.get(stringObjectEntry.getKey());
            FormRecordFieldDataPO singleFieldDataPO=buildFormRecordFieldDataPO(mainDataPO, stringObjectEntry, tableFieldPO);
            formRecordFieldDataPOList.add(singleFieldDataPO);
        }

        FormRecordDataPO result=new FormRecordDataPO();
        result.setRecordFieldPOList(null);
        result.setDesc("");
        result.setRecordId(idValue);
        result.setOuterFieldName(mainDataPO.getOuterKeyFieldName());
        result.setOuterFieldValue("");
        result.setSelfFieldName(mainDataPO.getSelfKeyFieldName());
        result.setRecordFieldPOList(formRecordFieldDataPOList);

        return result;
    }

    public static List<FormRecordDataPO> buildFormRecordDataPOList(FormRecordDataRelationPO mainDataPO, List<Map<String,Object>> mainRecordList,List<TableFieldPO> tableFieldPOList) throws JBuild4DCGenerallyException {
        List<FormRecordDataPO> result=new ArrayList<>();
        for (Map<String, Object> stringObjectMap : mainRecordList) {
            FormRecordDataPO singleFormRecordDataPO=buildFormRecordDataPO(mainDataPO,stringObjectMap,tableFieldPOList);
            result.add(singleFormRecordDataPO);
        }
        return result;
    }

    private static FormRecordFieldDataPO buildFormRecordFieldDataPO(FormRecordDataRelationPO mainDataPO, Map.Entry<String, Object> stringObjectEntry, TableFieldPO tableFieldPO) {
        FormRecordFieldDataPO singleFieldDataPO=new FormRecordFieldDataPO();
        singleFieldDataPO.setRelationId(mainDataPO.getId());
        singleFieldDataPO.setRelationSingleName(mainDataPO.getSingleName());
        singleFieldDataPO.setRelationType(mainDataPO.getRelationType());
        singleFieldDataPO.setSingleName("");
        singleFieldDataPO.setTableName(mainDataPO.getTableName());
        singleFieldDataPO.setTableCaption(mainDataPO.getTableCaption());
        singleFieldDataPO.setTableId(mainDataPO.getTableId());
        singleFieldDataPO.setFieldTableId(mainDataPO.getTableId());
        singleFieldDataPO.setFieldName(stringObjectEntry.getKey());
        singleFieldDataPO.setFieldDataType(tableFieldPO.getFieldDataType());
        singleFieldDataPO.setFieldDataLength(tableFieldPO.getFieldDataLength().toString());
        singleFieldDataPO.setSerialize("true");
        singleFieldDataPO.setId(UUIDUtility.getUUID());
        singleFieldDataPO.setDefaultType(tableFieldPO.getFieldDataType());
        singleFieldDataPO.setDefaultValue(tableFieldPO.getFieldDefaultValue());
        singleFieldDataPO.setValue(stringObjectEntry.getValue());
        singleFieldDataPO.setSuccess(true);
        singleFieldDataPO.setMsg("");
        return singleFieldDataPO;
    }
}
