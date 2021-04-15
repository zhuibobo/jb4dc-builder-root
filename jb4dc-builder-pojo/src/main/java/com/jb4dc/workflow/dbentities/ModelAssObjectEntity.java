package com.jb4dc.workflow.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_model_ass_object
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ModelAssObjectEntity {
    //OBJECT_ID:
    @DBKeyField
    private String objectId;

    //OBJECT_MODEL_ID:关联模型ID
    private String objectModelId;

    //OBJECT_TYPE:关联对象类型:Starter[发起者];Manager[管理者]
    private String objectType;

    //OBJECT_RE_KEY:启动键:act_de_model表的KEY_,充当ROOT_ID使用
    private String objectReKey;

    //OBJECT_TEXT:关联对象的文本
    private String objectText;

    //OBJECT_VALUE:关联对象的值
    private String objectValue;

    //OBJECT_ORDER_NUM:排序号
    private Integer objectOrderNum;

    //OBJECT_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date objectCreateTime;

    //OBJECT_CREATOR:创建者
    private String objectCreator;

    //OBJECT_CREATOR_ID:创建者ID
    private String objectCreatorId;

    //OBJECT_DESC:备注
    private String objectDesc;

    /**
     * 构造函数
     * @param objectId
     * @param objectModelId 关联模型ID
     * @param objectType 关联对象类型
     * @param objectReKey 启动键
     * @param objectText 关联对象的文本
     * @param objectValue 关联对象的值
     * @param objectOrderNum 排序号
     * @param objectCreateTime 创建时间
     * @param objectCreator 创建者
     * @param objectCreatorId 创建者ID
     * @param objectDesc 备注
     **/
    public ModelAssObjectEntity(String objectId, String objectModelId, String objectType, String objectReKey, String objectText, String objectValue, Integer objectOrderNum, Date objectCreateTime, String objectCreator, String objectCreatorId, String objectDesc) {
        this.objectId = objectId;
        this.objectModelId = objectModelId;
        this.objectType = objectType;
        this.objectReKey = objectReKey;
        this.objectText = objectText;
        this.objectValue = objectValue;
        this.objectOrderNum = objectOrderNum;
        this.objectCreateTime = objectCreateTime;
        this.objectCreator = objectCreator;
        this.objectCreatorId = objectCreatorId;
        this.objectDesc = objectDesc;
    }

    public ModelAssObjectEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getObjectId() {
        return objectId;
    }

    /**
     *
     * @param objectId
     **/
    public void setObjectId(String objectId) {
        this.objectId = objectId == null ? null : objectId.trim();
    }

    /**
     * 关联模型ID
     * @return java.lang.String
     **/
    public String getObjectModelId() {
        return objectModelId;
    }

    /**
     * 关联模型ID
     * @param objectModelId 关联模型ID
     **/
    public void setObjectModelId(String objectModelId) {
        this.objectModelId = objectModelId == null ? null : objectModelId.trim();
    }

    /**
     * 关联对象类型:Starter[发起者];Manager[管理者]
     * @return java.lang.String
     **/
    public String getObjectType() {
        return objectType;
    }

    /**
     * 关联对象类型:Starter[发起者];Manager[管理者]
     * @param objectType 关联对象类型
     **/
    public void setObjectType(String objectType) {
        this.objectType = objectType == null ? null : objectType.trim();
    }

    /**
     * 启动键:act_de_model表的KEY_,充当ROOT_ID使用
     * @return java.lang.String
     **/
    public String getObjectReKey() {
        return objectReKey;
    }

    /**
     * 启动键:act_de_model表的KEY_,充当ROOT_ID使用
     * @param objectReKey 启动键
     **/
    public void setObjectReKey(String objectReKey) {
        this.objectReKey = objectReKey == null ? null : objectReKey.trim();
    }

    /**
     * 关联对象的文本
     * @return java.lang.String
     **/
    public String getObjectText() {
        return objectText;
    }

    /**
     * 关联对象的文本
     * @param objectText 关联对象的文本
     **/
    public void setObjectText(String objectText) {
        this.objectText = objectText == null ? null : objectText.trim();
    }

    /**
     * 关联对象的值
     * @return java.lang.String
     **/
    public String getObjectValue() {
        return objectValue;
    }

    /**
     * 关联对象的值
     * @param objectValue 关联对象的值
     **/
    public void setObjectValue(String objectValue) {
        this.objectValue = objectValue == null ? null : objectValue.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getObjectOrderNum() {
        return objectOrderNum;
    }

    /**
     * 排序号
     * @param objectOrderNum 排序号
     **/
    public void setObjectOrderNum(Integer objectOrderNum) {
        this.objectOrderNum = objectOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getObjectCreateTime() {
        return objectCreateTime;
    }

    /**
     * 创建时间
     * @param objectCreateTime 创建时间
     **/
    public void setObjectCreateTime(Date objectCreateTime) {
        this.objectCreateTime = objectCreateTime;
    }

    /**
     * 创建者
     * @return java.lang.String
     **/
    public String getObjectCreator() {
        return objectCreator;
    }

    /**
     * 创建者
     * @param objectCreator 创建者
     **/
    public void setObjectCreator(String objectCreator) {
        this.objectCreator = objectCreator == null ? null : objectCreator.trim();
    }

    /**
     * 创建者ID
     * @return java.lang.String
     **/
    public String getObjectCreatorId() {
        return objectCreatorId;
    }

    /**
     * 创建者ID
     * @param objectCreatorId 创建者ID
     **/
    public void setObjectCreatorId(String objectCreatorId) {
        this.objectCreatorId = objectCreatorId == null ? null : objectCreatorId.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getObjectDesc() {
        return objectDesc;
    }

    /**
     * 备注
     * @param objectDesc 备注
     **/
    public void setObjectDesc(String objectDesc) {
        this.objectDesc = objectDesc == null ? null : objectDesc.trim();
    }
}