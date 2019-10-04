package com.jb4dc.builder.po;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/2
 * To change this template use File | Settings | File Templates.
 */
public class FormRecordComplexPO {
    List<FormRecordDataRelationPO> formRecordDataRelationPOList;
    String id;
    String operation;
    Map<String,Object> exData;

    public List<FormRecordDataRelationPO> getFormRecordDataRelationPOList() {
        return formRecordDataRelationPOList;
    }

    public void setFormRecordDataRelationPOList(List<FormRecordDataRelationPO> formRecordDataRelationPOList) {
        this.formRecordDataRelationPOList = formRecordDataRelationPOList;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public Map<String, Object> getExData() {
        return exData;
    }

    public void setExData(Map<String, Object> exData) {
        this.exData = exData;
    }
}
