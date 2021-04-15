package com.jb4dc.workflow.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_model_group
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ModelGroupEntity {
    //MODEL_GROUP_ID:
    @DBKeyField
    private String modelGroupId;

    //MODEL_GROUP_VALUE:分组的键值:必须唯一
    private String modelGroupValue;

    //MODEL_GROUP_TEXT:分组的名称
    private String modelGroupText;

    //MODEL_GROUP_ORDER_NUM:排序号
    private Integer modelGroupOrderNum;

    //MODEL_GROUP_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date modelGroupCreateTime;

    //MODEL_GROUP_DESC:备注
    private String modelGroupDesc;

    //MODEL_GROUP_STATUS:状态:启用,禁用
    private String modelGroupStatus;

    //MODEL_GROUP_PARENT_ID:父节点的ID
    private String modelGroupParentId;

    //MODEL_GROUP_IS_SYSTEM:是否是系统分组
    private String modelGroupIsSystem;

    //MODEL_GROUP_DEL_ENABLE:能否删除
    private String modelGroupDelEnable;

    //MODEL_GROUP_CLASS_NAME:样式类名
    private String modelGroupClassName;

    /**
     * 构造函数
     * @param modelGroupId
     * @param modelGroupValue 分组的键值
     * @param modelGroupText 分组的名称
     * @param modelGroupOrderNum 排序号
     * @param modelGroupCreateTime 创建时间
     * @param modelGroupDesc 备注
     * @param modelGroupStatus 状态
     * @param modelGroupParentId 父节点的ID
     * @param modelGroupIsSystem 是否是系统分组
     * @param modelGroupDelEnable 能否删除
     * @param modelGroupClassName 样式类名
     **/
    public ModelGroupEntity(String modelGroupId, String modelGroupValue, String modelGroupText, Integer modelGroupOrderNum, Date modelGroupCreateTime, String modelGroupDesc, String modelGroupStatus, String modelGroupParentId, String modelGroupIsSystem, String modelGroupDelEnable, String modelGroupClassName) {
        this.modelGroupId = modelGroupId;
        this.modelGroupValue = modelGroupValue;
        this.modelGroupText = modelGroupText;
        this.modelGroupOrderNum = modelGroupOrderNum;
        this.modelGroupCreateTime = modelGroupCreateTime;
        this.modelGroupDesc = modelGroupDesc;
        this.modelGroupStatus = modelGroupStatus;
        this.modelGroupParentId = modelGroupParentId;
        this.modelGroupIsSystem = modelGroupIsSystem;
        this.modelGroupDelEnable = modelGroupDelEnable;
        this.modelGroupClassName = modelGroupClassName;
    }

    public ModelGroupEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getModelGroupId() {
        return modelGroupId;
    }

    /**
     *
     * @param modelGroupId
     **/
    public void setModelGroupId(String modelGroupId) {
        this.modelGroupId = modelGroupId == null ? null : modelGroupId.trim();
    }

    /**
     * 分组的键值:必须唯一
     * @return java.lang.String
     **/
    public String getModelGroupValue() {
        return modelGroupValue;
    }

    /**
     * 分组的键值:必须唯一
     * @param modelGroupValue 分组的键值
     **/
    public void setModelGroupValue(String modelGroupValue) {
        this.modelGroupValue = modelGroupValue == null ? null : modelGroupValue.trim();
    }

    /**
     * 分组的名称
     * @return java.lang.String
     **/
    public String getModelGroupText() {
        return modelGroupText;
    }

    /**
     * 分组的名称
     * @param modelGroupText 分组的名称
     **/
    public void setModelGroupText(String modelGroupText) {
        this.modelGroupText = modelGroupText == null ? null : modelGroupText.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getModelGroupOrderNum() {
        return modelGroupOrderNum;
    }

    /**
     * 排序号
     * @param modelGroupOrderNum 排序号
     **/
    public void setModelGroupOrderNum(Integer modelGroupOrderNum) {
        this.modelGroupOrderNum = modelGroupOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getModelGroupCreateTime() {
        return modelGroupCreateTime;
    }

    /**
     * 创建时间
     * @param modelGroupCreateTime 创建时间
     **/
    public void setModelGroupCreateTime(Date modelGroupCreateTime) {
        this.modelGroupCreateTime = modelGroupCreateTime;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getModelGroupDesc() {
        return modelGroupDesc;
    }

    /**
     * 备注
     * @param modelGroupDesc 备注
     **/
    public void setModelGroupDesc(String modelGroupDesc) {
        this.modelGroupDesc = modelGroupDesc == null ? null : modelGroupDesc.trim();
    }

    /**
     * 状态:启用,禁用
     * @return java.lang.String
     **/
    public String getModelGroupStatus() {
        return modelGroupStatus;
    }

    /**
     * 状态:启用,禁用
     * @param modelGroupStatus 状态
     **/
    public void setModelGroupStatus(String modelGroupStatus) {
        this.modelGroupStatus = modelGroupStatus == null ? null : modelGroupStatus.trim();
    }

    /**
     * 父节点的ID
     * @return java.lang.String
     **/
    public String getModelGroupParentId() {
        return modelGroupParentId;
    }

    /**
     * 父节点的ID
     * @param modelGroupParentId 父节点的ID
     **/
    public void setModelGroupParentId(String modelGroupParentId) {
        this.modelGroupParentId = modelGroupParentId == null ? null : modelGroupParentId.trim();
    }

    /**
     * 是否是系统分组
     * @return java.lang.String
     **/
    public String getModelGroupIsSystem() {
        return modelGroupIsSystem;
    }

    /**
     * 是否是系统分组
     * @param modelGroupIsSystem 是否是系统分组
     **/
    public void setModelGroupIsSystem(String modelGroupIsSystem) {
        this.modelGroupIsSystem = modelGroupIsSystem == null ? null : modelGroupIsSystem.trim();
    }

    /**
     * 能否删除
     * @return java.lang.String
     **/
    public String getModelGroupDelEnable() {
        return modelGroupDelEnable;
    }

    /**
     * 能否删除
     * @param modelGroupDelEnable 能否删除
     **/
    public void setModelGroupDelEnable(String modelGroupDelEnable) {
        this.modelGroupDelEnable = modelGroupDelEnable == null ? null : modelGroupDelEnable.trim();
    }

    /**
     * 样式类名
     * @return java.lang.String
     **/
    public String getModelGroupClassName() {
        return modelGroupClassName;
    }

    /**
     * 样式类名
     * @param modelGroupClassName 样式类名
     **/
    public void setModelGroupClassName(String modelGroupClassName) {
        this.modelGroupClassName = modelGroupClassName == null ? null : modelGroupClassName.trim();
    }
}