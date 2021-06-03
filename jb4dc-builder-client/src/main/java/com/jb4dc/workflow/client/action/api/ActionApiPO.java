package com.jb4dc.workflow.client.action.api;

import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.remote.ApiItemRuntimeRemote;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.core.base.tools.StringUtility;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ActionApiPO {

    public static String BeforeName="before";
    public static String AfterName="after";

    private String apiId;
    private String apiName;
    private String runAt;
    private ApiItemEntity apiItemEntity;

    public String getApiId() {
        return apiId;
    }

    public void setApiId(String apiId) {
        this.apiId = apiId;
    }

    public String getApiName() {
        return apiName;
    }

    public void setApiName(String apiName) {
        this.apiName = apiName;
    }

    public String getRunAt() {
        return runAt;
    }

    public void setRunAt(String runAt) {
        this.runAt = runAt;
    }

    public ApiItemEntity getApiItemEntity() {
        return apiItemEntity;
    }

    public void setApiItemEntity(ApiItemEntity apiItemEntity) {
        this.apiItemEntity = apiItemEntity;
    }

    public static List<ActionApiPO> parseToPoListAndLoadApiEntity(ApiItemRuntimeRemote apiItemRuntimeRemote, String apiStr) throws IOException {
        if(StringUtility.isNotEmpty(apiStr)) {
            List<ActionApiPO> actionApiPOList=JsonUtility.toObjectList(apiStr, ActionApiPO.class);
            for (ActionApiPO actionApiPO : actionApiPOList) {
                actionApiPO.setApiItemEntity(apiItemRuntimeRemote.getApiPOById(actionApiPO.apiId).getData());
            }
        }
        return new ArrayList<>();
    }
}
