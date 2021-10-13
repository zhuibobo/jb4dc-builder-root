package com.jb4dc.builder.po.formdata;

import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.po.TableFieldPO;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/2
 * To change this template use File | Settings | File Templates.
 */
public class FormRecordComplexPO {

    String recordId;
    String formId;
    String buttonId;
    String operation;
    List<FormRecordDataRelationPO> formRecordDataRelationPOList;

    Map<String,List<TableFieldPO>> allDataRelationTableFieldsMap;
    Map<String, TableEntity> allDataRelationTablesMap;

    Map<String,Object> exData;

    private String formRuntimeCategory;

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public String getFormId() {
        return formId;
    }

    public void setFormId(String formId) {
        this.formId = formId;
    }

    public String getButtonId() {
        return buttonId;
    }

    public void setButtonId(String buttonId) {
        this.buttonId = buttonId;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public List<FormRecordDataRelationPO> getFormRecordDataRelationPOList() {
        return formRecordDataRelationPOList;
    }

    public void setFormRecordDataRelationPOList(List<FormRecordDataRelationPO> formRecordDataRelationPOList) {
        this.formRecordDataRelationPOList = formRecordDataRelationPOList;
    }

    public Map<String, Object> getExData() {
        return exData;
    }

    public void setExData(Map<String, Object> exData) {
        this.exData = exData;
    }

    public Map<String, List<TableFieldPO>> getAllDataRelationTableFieldsMap() {
        return allDataRelationTableFieldsMap;
    }

    public void setAllDataRelationTableFieldsMap(Map<String, List<TableFieldPO>> allDataRelationTableFieldsMap) {
        this.allDataRelationTableFieldsMap = allDataRelationTableFieldsMap;
    }

    public Map<String, TableEntity> getAllDataRelationTablesMap() {
        return allDataRelationTablesMap;
    }

    public void setAllDataRelationTablesMap(Map<String, TableEntity> allDataRelationTablesMap) {
        this.allDataRelationTablesMap = allDataRelationTablesMap;
    }

    public String getFormRuntimeCategory() {
        return formRuntimeCategory;
    }

    public void setFormRuntimeCategory(String formRuntimeCategory) {
        this.formRuntimeCategory = formRuntimeCategory;
    }


}
