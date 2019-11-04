package com.jb4dc.builder.po.formdata;

import com.jb4dc.builder.dbentities.datastorage.TableFieldEntity;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.core.base.tools.UUIDUtility;

public class FormRecordFieldDataPO {
    private String relationId;
    private String relationSingleName;
    private String relationType;
    private String singleName;
    private String tableName;
    private String tableCaption;
    private String tableId;
    private String fieldTableId;
    private String fieldName;
    private String fieldDataType;
    private String fieldDataLength;
    private String serialize;
    private String id;
    private String defaultType;
    private String defaultValue;
    private String value;
    private boolean success;
    private String msg;

    public static FormRecordFieldDataPO getTemplatePO(FormRecordFieldDataPO mockFormFieldPO, TableFieldPO mockFieldPO){
        FormRecordFieldDataPO formRecordFieldDataPO=new FormRecordFieldDataPO();
        formRecordFieldDataPO.setRelationId(mockFormFieldPO.getRelationId());
        formRecordFieldDataPO.setRelationSingleName(mockFormFieldPO.getRelationSingleName());
        formRecordFieldDataPO.setRelationType(mockFormFieldPO.getRelationType());
        formRecordFieldDataPO.setSingleName("WFDCT_TextBox");
        formRecordFieldDataPO.setTableName(mockFormFieldPO.getTableName());
        formRecordFieldDataPO.setTableCaption(mockFormFieldPO.getTableCaption());
        formRecordFieldDataPO.setTableId(mockFormFieldPO.getTableId());
        formRecordFieldDataPO.setFieldTableId(mockFormFieldPO.getFieldTableId());
        formRecordFieldDataPO.setFieldName(mockFieldPO.getFieldName());
        formRecordFieldDataPO.setFieldDataType(mockFieldPO.getFieldDataType());
        formRecordFieldDataPO.setFieldDataLength(mockFieldPO.getFieldDataLength().toString());
        formRecordFieldDataPO.setDefaultType(mockFieldPO.getFieldDataType());
        formRecordFieldDataPO.setDefaultValue(mockFieldPO.getFieldDefaultValue());
        formRecordFieldDataPO.setValue(mockFieldPO.getValue());
        formRecordFieldDataPO.setSerialize("true");
        formRecordFieldDataPO.setId(UUIDUtility.getUUID());
        formRecordFieldDataPO.setSuccess(true);
        formRecordFieldDataPO.setMsg("");
        return formRecordFieldDataPO;
    }

    public String getRelationId() {
        return relationId;
    }

    public void setRelationId(String relationId) {
        this.relationId = relationId;
    }

    public String getRelationSingleName() {
        return relationSingleName;
    }

    public void setRelationSingleName(String relationSingleName) {
        this.relationSingleName = relationSingleName;
    }

    public String getRelationType() {
        return relationType;
    }

    public void setRelationType(String relationType) {
        this.relationType = relationType;
    }

    public String getSingleName() {
        return singleName;
    }

    public void setSingleName(String singleName) {
        this.singleName = singleName;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getTableCaption() {
        return tableCaption;
    }

    public void setTableCaption(String tableCaption) {
        this.tableCaption = tableCaption;
    }

    public String getTableId() {
        return tableId;
    }

    public void setTableId(String tableId) {
        this.tableId = tableId;
    }

    public String getFieldTableId() {
        return fieldTableId;
    }

    public void setFieldTableId(String fieldTableId) {
        this.fieldTableId = fieldTableId;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldDataType() {
        return fieldDataType;
    }

    public void setFieldDataType(String fieldDataType) {
        this.fieldDataType = fieldDataType;
    }

    public String getFieldDataLength() {
        return fieldDataLength;
    }

    public void setFieldDataLength(String fieldDataLength) {
        this.fieldDataLength = fieldDataLength;
    }

    public String getSerialize() {
        return serialize;
    }

    public void setSerialize(String serialize) {
        this.serialize = serialize;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDefaultType() {
        return defaultType;
    }

    public void setDefaultType(String defaultType) {
        this.defaultType = defaultType;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
