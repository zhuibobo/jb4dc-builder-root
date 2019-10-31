package com.jb4dc.builder.po.formdata;

import java.util.List;

public class FormRecordDataPO  {

    List<FormRecordFieldDataPO> recordFieldPOList;

    String desc;

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
}
