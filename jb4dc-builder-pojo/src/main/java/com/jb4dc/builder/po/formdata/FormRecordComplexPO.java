package com.jb4dc.builder.po.formdata;

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

    Map<String,Object> exData;

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
}