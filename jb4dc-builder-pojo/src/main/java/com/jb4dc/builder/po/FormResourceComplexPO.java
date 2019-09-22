package com.jb4dc.builder.po;

import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;

import java.util.List;
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

    public FormResourceComplexPO(FormResourceEntity source, String formHtmlRuntime, List<FormDataRelationPO> _formDataRelationPOList, ListButtonEntity _listButtonEntity) {
        super(source, formHtmlRuntime);
        this.formDataRelationPOList = _formDataRelationPOList;
        this.listButtonEntity = _listButtonEntity;
    }

    List<FormDataRelationPO> formDataRelationPOList;

    ListButtonEntity listButtonEntity;

    public List<FormDataRelationPO> getFormDataRelationPOList() {
        return formDataRelationPOList;
    }

    public void setFormDataRelationPOList(List<FormDataRelationPO> formDataRelationPOList) {
        this.formDataRelationPOList = formDataRelationPOList;
    }

    public ListButtonEntity getListButtonEntity() {
        return listButtonEntity;
    }

    public void setListButtonEntity(ListButtonEntity listButtonEntity) {
        this.listButtonEntity = listButtonEntity;
    }
}
