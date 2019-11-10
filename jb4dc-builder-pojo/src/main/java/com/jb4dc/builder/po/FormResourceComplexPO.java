package com.jb4dc.builder.po;

import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.builder.po.formdata.FormRecordDataRelationPO;

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

    public FormResourceComplexPO(FormResourceEntity source, String formHtmlRuntime, FormRecordComplexPO formRecordComplexPO, ListButtonEntity _listButtonEntity) {
        super(source, formHtmlRuntime);
        this.formRecordComplexPO = formRecordComplexPO;
        this.listButtonEntity = _listButtonEntity;
    }

    FormRecordComplexPO formRecordComplexPO;

    ListButtonEntity listButtonEntity;

    public FormRecordComplexPO getFormRecordComplexPO() {
        return formRecordComplexPO;
    }

    public void setFormRecordComplexPO(FormRecordComplexPO formRecordComplexPO) {
        this.formRecordComplexPO = formRecordComplexPO;
    }

    public ListButtonEntity getListButtonEntity() {
        return listButtonEntity;
    }

    public void setListButtonEntity(ListButtonEntity listButtonEntity) {
        this.listButtonEntity = listButtonEntity;
    }
}
