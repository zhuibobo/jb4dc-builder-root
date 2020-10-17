package com.jb4dc.builder.client.service.api;

import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.po.button.InnerFormButtonConfig;
import com.jb4dc.builder.po.button.InnerFormButtonConfigAPI;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/1
 * To change this template use File | Settings | File Templates.
 */
public class ApiRunPara {
    InnerFormButtonConfigAPI innerFormButtonConfigAPI;
    ApiItemEntity apiItemEntity;
    FormRecordComplexPO formRecordComplexPO;
    ListButtonEntity listButtonEntity;
    List<InnerFormButtonConfig> innerFormButtonConfigList;
    InnerFormButtonConfig innerFormButtonConfig;
    String recordId;
    JB4DCSession jb4DCSession;

    public JB4DCSession getJb4DCSession() {
        return jb4DCSession;
    }

    public void setJb4DCSession(JB4DCSession jb4DCSession) {
        this.jb4DCSession = jb4DCSession;
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public InnerFormButtonConfigAPI getInnerFormButtonConfigAPI() {
        return innerFormButtonConfigAPI;
    }

    public void setInnerFormButtonConfigAPI(InnerFormButtonConfigAPI innerFormButtonConfigAPI) {
        this.innerFormButtonConfigAPI = innerFormButtonConfigAPI;
    }

    public ApiItemEntity getApiItemEntity() {
        return apiItemEntity;
    }

    public void setApiItemEntity(ApiItemEntity apiItemEntity) {
        this.apiItemEntity = apiItemEntity;
    }

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

    public List<InnerFormButtonConfig> getInnerFormButtonConfigList() {
        return innerFormButtonConfigList;
    }

    public void setInnerFormButtonConfigList(List<InnerFormButtonConfig> innerFormButtonConfigList) {
        this.innerFormButtonConfigList = innerFormButtonConfigList;
    }

    public InnerFormButtonConfig getInnerFormButtonConfig() {
        return innerFormButtonConfig;
    }

    public void setInnerFormButtonConfig(InnerFormButtonConfig innerFormButtonConfig) {
        this.innerFormButtonConfig = innerFormButtonConfig;
    }
}
