package com.jb4dc.builder.po;

import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;

import java.util.List;

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

    public FormResourceComplexPO(FormResourceEntity source, String formHtmlRuntime, List<FormRecordDataRelationPO> _formRecordDataRelationPOList, ListButtonEntity _listButtonEntity) {
        super(source, formHtmlRuntime);
        this.formRecordDataRelationPOList = _formRecordDataRelationPOList;
        this.listButtonEntity = _listButtonEntity;
    }

    List<FormRecordDataRelationPO> formRecordDataRelationPOList;

    ListButtonEntity listButtonEntity;

    public List<FormRecordDataRelationPO> getFormRecordDataRelationPOList() {
        return formRecordDataRelationPOList;
    }

    public void setFormRecordDataRelationPOList(List<FormRecordDataRelationPO> formRecordDataRelationPOList) {
        this.formRecordDataRelationPOList = formRecordDataRelationPOList;
    }

    public ListButtonEntity getListButtonEntity() {
        return listButtonEntity;
    }

    public void setListButtonEntity(ListButtonEntity listButtonEntity) {
        this.listButtonEntity = listButtonEntity;
    }
}
