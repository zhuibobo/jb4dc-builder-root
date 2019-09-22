package com.jb4dc.builder.po;

import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;

import java.util.Map;

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

    public FormResourceComplexPO(FormResourceEntity source, String formHtmlRuntime, Map recordData, ListButtonEntity listButtonEntity) {
        super(source, formHtmlRuntime);
        this.recordData = recordData;
        this.listButtonEntity = listButtonEntity;
    }

    Map recordData;

    ListButtonEntity listButtonEntity;

    public Map getRecordData() {
        return recordData;
    }

    public void setRecordData(Map recordData) {
        this.recordData = recordData;
    }

    public ListButtonEntity getListButtonEntity() {
        return listButtonEntity;
    }

    public void setListButtonEntity(ListButtonEntity listButtonEntity) {
        this.listButtonEntity = listButtonEntity;
    }
}
