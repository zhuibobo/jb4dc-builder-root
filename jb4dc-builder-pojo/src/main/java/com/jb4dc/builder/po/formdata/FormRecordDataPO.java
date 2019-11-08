package com.jb4dc.builder.po.formdata;

import java.util.List;

public class FormRecordDataPO  {

    List<FormRecordFieldDataPO> recordFieldPOList;

    String recordId;
    String desc;
    String outerFieldName;
    String outerFieldValue;
    String selfFieldName;

    public List<FormRecordFieldDataPO> getRecordFieldPOList() {
        return recordFieldPOList;
    }

    public void setRecordFieldPOList(List<FormRecordFieldDataPO> recordFieldPOList) {
        this.recordFieldPOList = recordFieldPOList;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public String getOuterFieldName() {
        return outerFieldName;
    }

    public void setOuterFieldName(String outerFieldName) {
        this.outerFieldName = outerFieldName;
    }

    public String getOuterFieldValue() {
        return outerFieldValue;
    }

    public void setOuterFieldValue(String outerFieldValue) {
        this.outerFieldValue = outerFieldValue;
    }

    public String getSelfFieldName() {
        return selfFieldName;
    }

    public void setSelfFieldName(String selfFieldName) {
        this.selfFieldName = selfFieldName;
    }
}
