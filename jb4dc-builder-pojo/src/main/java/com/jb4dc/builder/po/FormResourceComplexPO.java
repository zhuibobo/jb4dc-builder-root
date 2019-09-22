package com.jb4dc.builder.po;

import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/21
 * To change this template use File | Settings | File Templates.
 */
public class FormResourceComplexPO extends FormResourcePO {
    public FormResourceComplexPO(FormResourceEntity source, String formHtmlRuntime) {
        super(source, formHtmlRuntime);
    }

    public FormResourceComplexPO(FormResourceEntity source, String formHtmlRuntime, String recordDataJsonString, ListButtonEntity listButtonEntity) {
        super(source, formHtmlRuntime);
        this.recordDataJsonString = recordDataJsonString;
        this.listButtonEntity = listButtonEntity;
    }

    String recordDataJsonString;

    ListButtonEntity listButtonEntity;

    public String getRecordDataJsonString() {
        return recordDataJsonString;
    }

    public void setRecordDataJsonString(String recordDataJsonString) {
        this.recordDataJsonString = recordDataJsonString;
    }

    public ListButtonEntity getListButtonEntity() {
        return listButtonEntity;
    }

    public void setListButtonEntity(ListButtonEntity listButtonEntity) {
        this.listButtonEntity = listButtonEntity;
    }
}
