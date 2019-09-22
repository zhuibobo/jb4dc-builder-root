package com.jb4dc.builder.po;

import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;

import java.util.Map;

public class DynamicBindHTMLControlContextPO {

    String recordId;
    FormResourcePO remoteSourcePO;
    ListButtonEntity listButtonEntity;
    Map fullRecordData;
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

    public Map getFullRecordData() {
        return fullRecordData;
    }

    public void setFullRecordData(Map fullRecordData) {
        this.fullRecordData = fullRecordData;
    }

    public Map getMainRecordData() {
        return mainRecordData;
    }

    public void setMainRecordData(Map mainRecordData) {
        this.mainRecordData = mainRecordData;
    }
}
