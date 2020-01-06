package com.jb4dc.builder.dbentities.flow;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_FLOW_INTEGRATED
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class FlowIntegratedEntity {
    //INTEGRATED_ID:主键:UUID
    @DBKeyField
    private String integratedId;

    //INTEGRATED_DE_ID:act_de_model表的ID
    private String integratedDeId;

    //INTEGRATED_MODULE_ID:所属的模块ID
    private String integratedModuleId;

    //INTEGRATED_CODE:模型编码
    private String integratedCode;

    //INTEGRATED_NAME:模型名称
    private String integratedName;

    //INTEGRATED_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date integratedCreateTime;

    //INTEGRATED_CREATOR:创建者
    private String integratedCreator;

    //INTEGRATED_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date integratedUpdateTime;

    //INTEGRATED_UPDATER:更新人
    private String integratedUpdater;

    //INTEGRATED_DESC:备注
    private String integratedDesc;

    //INTEGRATED_STATUS:状态
    private String integratedStatus;

    //INTEGRATED_ORDER_NUM:排序号
    private Integer integratedOrderNum;

    //INTEGRATED_DEPLOYMENT_ID:部署ID
    private String integratedDeploymentId;

    //INTEGRATED_START_KEY:启动键
    private String integratedStartKey;

    //INTEGRATED_RESOURCE_NAME:资源名称
    private String integratedResourceName;

    //INTEGRATED_FROM_TYPE:流程模型来自上传或者页面设计
    private String integratedFromType;

    //INTEGRATED_MAIN_IMAGE_ID:关联到TFS_FILE_INFO表的FILE_ID
    private String integratedMainImageId;

    /**
     * 构造函数
     * @param integratedId 主键
     * @param integratedDeId act_de_model表的ID
     * @param integratedModuleId 所属的模块ID
     * @param integratedCode 模型编码
     * @param integratedName 模型名称
     * @param integratedCreateTime 创建时间
     * @param integratedCreator 创建者
     * @param integratedUpdateTime 更新时间
     * @param integratedUpdater 更新人
     * @param integratedDesc 备注
     * @param integratedStatus 状态
     * @param integratedOrderNum 排序号
     * @param integratedDeploymentId 部署ID
     * @param integratedStartKey 启动键
     * @param integratedResourceName 资源名称
     * @param integratedFromType 流程模型来自上传或者页面设计
     * @param integratedMainImageId 关联到TFS_FILE_INFO表的FILE_ID
     **/
    public FlowIntegratedEntity(String integratedId, String integratedDeId, String integratedModuleId, String integratedCode, String integratedName, Date integratedCreateTime, String integratedCreator, Date integratedUpdateTime, String integratedUpdater, String integratedDesc, String integratedStatus, Integer integratedOrderNum, String integratedDeploymentId, String integratedStartKey, String integratedResourceName, String integratedFromType, String integratedMainImageId) {
        this.integratedId = integratedId;
        this.integratedDeId = integratedDeId;
        this.integratedModuleId = integratedModuleId;
        this.integratedCode = integratedCode;
        this.integratedName = integratedName;
        this.integratedCreateTime = integratedCreateTime;
        this.integratedCreator = integratedCreator;
        this.integratedUpdateTime = integratedUpdateTime;
        this.integratedUpdater = integratedUpdater;
        this.integratedDesc = integratedDesc;
        this.integratedStatus = integratedStatus;
        this.integratedOrderNum = integratedOrderNum;
        this.integratedDeploymentId = integratedDeploymentId;
        this.integratedStartKey = integratedStartKey;
        this.integratedResourceName = integratedResourceName;
        this.integratedFromType = integratedFromType;
        this.integratedMainImageId = integratedMainImageId;
    }

    public FlowIntegratedEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getIntegratedId() {
        return integratedId;
    }

    /**
     * 主键:UUID
     * @param integratedId 主键
     **/
    public void setIntegratedId(String integratedId) {
        this.integratedId = integratedId == null ? null : integratedId.trim();
    }

    /**
     * act_de_model表的ID
     * @return java.lang.String
     **/
    public String getIntegratedDeId() {
        return integratedDeId;
    }

    /**
     * act_de_model表的ID
     * @param integratedDeId act_de_model表的ID
     **/
    public void setIntegratedDeId(String integratedDeId) {
        this.integratedDeId = integratedDeId == null ? null : integratedDeId.trim();
    }

    /**
     * 所属的模块ID
     * @return java.lang.String
     **/
    public String getIntegratedModuleId() {
        return integratedModuleId;
    }

    /**
     * 所属的模块ID
     * @param integratedModuleId 所属的模块ID
     **/
    public void setIntegratedModuleId(String integratedModuleId) {
        this.integratedModuleId = integratedModuleId == null ? null : integratedModuleId.trim();
    }

    /**
     * 模型编码
     * @return java.lang.String
     **/
    public String getIntegratedCode() {
        return integratedCode;
    }

    /**
     * 模型编码
     * @param integratedCode 模型编码
     **/
    public void setIntegratedCode(String integratedCode) {
        this.integratedCode = integratedCode == null ? null : integratedCode.trim();
    }

    /**
     * 模型名称
     * @return java.lang.String
     **/
    public String getIntegratedName() {
        return integratedName;
    }

    /**
     * 模型名称
     * @param integratedName 模型名称
     **/
    public void setIntegratedName(String integratedName) {
        this.integratedName = integratedName == null ? null : integratedName.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getIntegratedCreateTime() {
        return integratedCreateTime;
    }

    /**
     * 创建时间
     * @param integratedCreateTime 创建时间
     **/
    public void setIntegratedCreateTime(Date integratedCreateTime) {
        this.integratedCreateTime = integratedCreateTime;
    }

    /**
     * 创建者
     * @return java.lang.String
     **/
    public String getIntegratedCreator() {
        return integratedCreator;
    }

    /**
     * 创建者
     * @param integratedCreator 创建者
     **/
    public void setIntegratedCreator(String integratedCreator) {
        this.integratedCreator = integratedCreator == null ? null : integratedCreator.trim();
    }

    /**
     * 更新时间
     * @return java.util.Date
     **/
    public Date getIntegratedUpdateTime() {
        return integratedUpdateTime;
    }

    /**
     * 更新时间
     * @param integratedUpdateTime 更新时间
     **/
    public void setIntegratedUpdateTime(Date integratedUpdateTime) {
        this.integratedUpdateTime = integratedUpdateTime;
    }

    /**
     * 更新人
     * @return java.lang.String
     **/
    public String getIntegratedUpdater() {
        return integratedUpdater;
    }

    /**
     * 更新人
     * @param integratedUpdater 更新人
     **/
    public void setIntegratedUpdater(String integratedUpdater) {
        this.integratedUpdater = integratedUpdater == null ? null : integratedUpdater.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getIntegratedDesc() {
        return integratedDesc;
    }

    /**
     * 备注
     * @param integratedDesc 备注
     **/
    public void setIntegratedDesc(String integratedDesc) {
        this.integratedDesc = integratedDesc == null ? null : integratedDesc.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getIntegratedStatus() {
        return integratedStatus;
    }

    /**
     * 状态
     * @param integratedStatus 状态
     **/
    public void setIntegratedStatus(String integratedStatus) {
        this.integratedStatus = integratedStatus == null ? null : integratedStatus.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getIntegratedOrderNum() {
        return integratedOrderNum;
    }

    /**
     * 排序号
     * @param integratedOrderNum 排序号
     **/
    public void setIntegratedOrderNum(Integer integratedOrderNum) {
        this.integratedOrderNum = integratedOrderNum;
    }

    /**
     * 部署ID
     * @return java.lang.String
     **/
    public String getIntegratedDeploymentId() {
        return integratedDeploymentId;
    }

    /**
     * 部署ID
     * @param integratedDeploymentId 部署ID
     **/
    public void setIntegratedDeploymentId(String integratedDeploymentId) {
        this.integratedDeploymentId = integratedDeploymentId == null ? null : integratedDeploymentId.trim();
    }

    /**
     * 启动键
     * @return java.lang.String
     **/
    public String getIntegratedStartKey() {
        return integratedStartKey;
    }

    /**
     * 启动键
     * @param integratedStartKey 启动键
     **/
    public void setIntegratedStartKey(String integratedStartKey) {
        this.integratedStartKey = integratedStartKey == null ? null : integratedStartKey.trim();
    }

    /**
     * 资源名称
     * @return java.lang.String
     **/
    public String getIntegratedResourceName() {
        return integratedResourceName;
    }

    /**
     * 资源名称
     * @param integratedResourceName 资源名称
     **/
    public void setIntegratedResourceName(String integratedResourceName) {
        this.integratedResourceName = integratedResourceName == null ? null : integratedResourceName.trim();
    }

    /**
     * 流程模型来自上传或者页面设计
     * @return java.lang.String
     **/
    public String getIntegratedFromType() {
        return integratedFromType;
    }

    /**
     * 流程模型来自上传或者页面设计
     * @param integratedFromType 流程模型来自上传或者页面设计
     **/
    public void setIntegratedFromType(String integratedFromType) {
        this.integratedFromType = integratedFromType == null ? null : integratedFromType.trim();
    }

    /**
     * 关联到TFS_FILE_INFO表的FILE_ID
     * @return java.lang.String
     **/
    public String getIntegratedMainImageId() {
        return integratedMainImageId;
    }

    /**
     * 关联到TFS_FILE_INFO表的FILE_ID
     * @param integratedMainImageId 关联到TFS_FILE_INFO表的FILE_ID
     **/
    public void setIntegratedMainImageId(String integratedMainImageId) {
        this.integratedMainImageId = integratedMainImageId == null ? null : integratedMainImageId.trim();
    }
}