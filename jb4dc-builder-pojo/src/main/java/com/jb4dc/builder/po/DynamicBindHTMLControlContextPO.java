package com.jb4dc.builder.po;

import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;

import java.util.List;
import java.util.Map;

public class DynamicBindHTMLControlContextPO {

    String recordId;
    FormResourcePO remoteSourcePO;
    ListButtonEntity listButtonEntity;
    List<FormDataRelationPO> formDataRelationPOList;
    Map mainRecordData;

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public FormResourcePO getRemoteSourcePO() {
        return remoteSourcePO;
    }

    public void setRemoteSourcePO(FormResourcePO remoteSourcePO) {
        this.remoteSourcePO = remoteSourcePO;
    }

    public ListButtonEntity getListButtonEntity() {
        return listButtonEntity;
    }

    public void setListButtonEntity(ListButtonEntity listButtonEntity) {
        this.listButtonEntity = listButtonEntity;
    }

    public List<FormDataRelationPO> getFormDataRelationPOList() {
        return formDataRelationPOList;
    }

    public void setFormDataRelationPOList(List<FormDataRelationPO> formDataRelationPOList) {
        this.formDataRelationPOList = formDataRelationPOList;
    }

    public Map getMainRecordData() {
        return mainRecordData;
    }

    public void setMainRecordData(Map mainRecordData) {
        this.mainRecordData = mainRecordData;
    }
}
