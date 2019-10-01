package com.jb4dc.builder.po;

import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;

import java.util.List;
import java.util.Map;

public class DynamicBindHTMLControlContextPO {

    String recordId;
    FormResourcePO remoteSourcePO;
    ListButtonEntity listButtonEntity;
    List<FormRecordDataRelationPO> formRecordDataRelationPOList;
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

    public List<FormRecordDataRelationPO> getFormRecordDataRelationPOList() {
        return formRecordDataRelationPOList;
    }

    public void setFormRecordDataRelationPOList(List<FormRecordDataRelationPO> formRecordDataRelationPOList) {
        this.formRecordDataRelationPOList = formRecordDataRelationPOList;
    }

    public Map getMainRecordData() {
        return mainRecordData;
    }

    public void setMainRecordData(Map mainRecordData) {
        this.mainRecordData = mainRecordData;
    }
}
