package com.jb4dc.workflow.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_model_group_ref
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ModelGroupRefEntity {
    //GREF_ID:
    @DBKeyField
    private String grefId;

    //GREF_MODEL_ID:模型ID
    private String grefModelId;

    //GREF_MODEL_KEY:模型KEY
    private String grefModelKey;

    //GREF_GROUP_ID:分组ID
    private String grefGroupId;

    /**
     * 构造函数
     * @param grefId
     * @param grefModelId 模型ID
     * @param grefModelKey 模型KEY
     * @param grefGroupId 分组ID
     **/
    public ModelGroupRefEntity(String grefId, String grefModelId, String grefModelKey, String grefGroupId) {
        this.grefId = grefId;
        this.grefModelId = grefModelId;
        this.grefModelKey = grefModelKey;
        this.grefGroupId = grefGroupId;
    }

    public ModelGroupRefEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getGrefId() {
        return grefId;
    }

    /**
     *
     * @param grefId
     **/
    public void setGrefId(String grefId) {
        this.grefId = grefId == null ? null : grefId.trim();
    }

    /**
     * 模型ID
     * @return java.lang.String
     **/
    public String getGrefModelId() {
        return grefModelId;
    }

    /**
     * 模型ID
     * @param grefModelId 模型ID
     **/
    public void setGrefModelId(String grefModelId) {
        this.grefModelId = grefModelId == null ? null : grefModelId.trim();
    }

    /**
     * 模型KEY
     * @return java.lang.String
     **/
    public String getGrefModelKey() {
        return grefModelKey;
    }

    /**
     * 模型KEY
     * @param grefModelKey 模型KEY
     **/
    public void setGrefModelKey(String grefModelKey) {
        this.grefModelKey = grefModelKey == null ? null : grefModelKey.trim();
    }

    /**
     * 分组ID
     * @return java.lang.String
     **/
    public String getGrefGroupId() {
        return grefGroupId;
    }

    /**
     * 分组ID
     * @param grefGroupId 分组ID
     **/
    public void setGrefGroupId(String grefGroupId) {
        this.grefGroupId = grefGroupId == null ? null : grefGroupId.trim();
    }
}