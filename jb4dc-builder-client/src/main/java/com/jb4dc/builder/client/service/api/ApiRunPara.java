package com.jb4dc.builder.client.service.api;

import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.po.button.InnerFormButtonConfig;
import com.jb4dc.builder.po.button.InnerFormButtonConfigAPI;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;

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
