package com.jb4dc.builder.dbentities.systemsetting;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;

import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TSYS_SETTING
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class SettingEntity {
    //SETTING_ID:配置的ID:随机的UUID,主键
    @DBKeyField
    private String settingId;

    //SETTING_SYSTEM_NAME:系统名称
    private String settingSystemName;

    //SETTING_SYSTEM_ID:所属系统ID
    private String settingSystemId;

    //SETTING_MODULE_NAME:模块名称
    private String settingModuleName;

    //SETTING_MODULE_ID:模块ID
    private String settingModuleId;

    //SETTING_KEY:配置的Key:必须唯一
    private String settingKey;

    //SETTING_NAME:配置的名称
    private String settingName;

    //SETTING_VALUE:配置的值
    private String settingValue;

    //SETTING_STATUS:配置的状态
    private String settingStatus;

    //SETTING_DESC:配置的描述
    private String settingDesc;

    //SETTING_CREATE_TIME:配置的时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date settingCreateTime;

    //SETTING_USER_ID:用户的ID
    private String settingUserId;

    //SETTING_USER_NAME:用户的名称
    private String settingUserName;

    //SETTING_ORGAN_ID:组织ID
    private String settingOrganId;

    //SETTING_ORGAN_NAME:组织名称
    private String settingOrganName;

    //SETTING_API:API方法的全名称:主要用于动态配置的扩展
    private String settingApi;

    //SETTING_IS_SYSTEM:是否系统所有
    private String settingIsSystem;

    //SETTING_ORDER_NUM:排序号
    private Integer settingOrderNum;

    /**
     * 构造函数
     * @param settingId 配置的ID
     * @param settingSystemName 系统名称
     * @param settingSystemId 所属系统ID
     * @param settingModuleName 模块名称
     * @param settingModuleId 模块ID
     * @param settingKey 配置的Key
     * @param settingName 配置的名称
     * @param settingValue 配置的值
     * @param settingStatus 配置的状态
     * @param settingDesc 配置的描述
     * @param settingCreateTime 配置的时间
     * @param settingUserId 用户的ID
     * @param settingUserName 用户的名称
     * @param settingOrganId 组织ID
     * @param settingOrganName 组织名称
     * @param settingApi API方法的全名称
     * @param settingIsSystem 是否系统所有
     * @param settingOrderNum 排序号
     **/
    public SettingEntity(String settingId, String settingSystemName, String settingSystemId, String settingModuleName, String settingModuleId, String settingKey, String settingName, String settingValue, String settingStatus, String settingDesc, Date settingCreateTime, String settingUserId, String settingUserName, String settingOrganId, String settingOrganName, String settingApi, String settingIsSystem, Integer settingOrderNum) {
        this.settingId = settingId;
        this.settingSystemName = settingSystemName;
        this.settingSystemId = settingSystemId;
        this.settingModuleName = settingModuleName;
        this.settingModuleId = settingModuleId;
        this.settingKey = settingKey;
        this.settingName = settingName;
        this.settingValue = settingValue;
        this.settingStatus = settingStatus;
        this.settingDesc = settingDesc;
        this.settingCreateTime = settingCreateTime;
        this.settingUserId = settingUserId;
        this.settingUserName = settingUserName;
        this.settingOrganId = settingOrganId;
        this.settingOrganName = settingOrganName;
        this.settingApi = settingApi;
        this.settingIsSystem = settingIsSystem;
        this.settingOrderNum = settingOrderNum;
    }

    public SettingEntity() {
        super();
    }

    /**
     * 配置的ID:随机的UUID,主键
     * @return java.lang.String
     **/
    public String getSettingId() {
        return settingId;
    }

    /**
     * 配置的ID:随机的UUID,主键
     * @param settingId 配置的ID
     **/
    public void setSettingId(String settingId) {
        this.settingId = settingId == null ? null : settingId.trim();
    }

    /**
     * 系统名称
     * @return java.lang.String
     **/
    public String getSettingSystemName() {
        return settingSystemName;
    }

    /**
     * 系统名称
     * @param settingSystemName 系统名称
     **/
    public void setSettingSystemName(String settingSystemName) {
        this.settingSystemName = settingSystemName == null ? null : settingSystemName.trim();
    }

    /**
     * 所属系统ID
     * @return java.lang.String
     **/
    public String getSettingSystemId() {
        return settingSystemId;
    }

    /**
     * 所属系统ID
     * @param settingSystemId 所属系统ID
     **/
    public void setSettingSystemId(String settingSystemId) {
        this.settingSystemId = settingSystemId == null ? null : settingSystemId.trim();
    }

    /**
     * 模块名称
     * @return java.lang.String
     **/
    public String getSettingModuleName() {
        return settingModuleName;
    }

    /**
     * 模块名称
     * @param settingModuleName 模块名称
     **/
    public void setSettingModuleName(String settingModuleName) {
        this.settingModuleName = settingModuleName == null ? null : settingModuleName.trim();
    }

    /**
     * 模块ID
     * @return java.lang.String
     **/
    public String getSettingModuleId() {
        return settingModuleId;
    }

    /**
     * 模块ID
     * @param settingModuleId 模块ID
     **/
    public void setSettingModuleId(String settingModuleId) {
        this.settingModuleId = settingModuleId == null ? null : settingModuleId.trim();
    }

    /**
     * 配置的Key:必须唯一
     * @return java.lang.String
     **/
    public String getSettingKey() {
        return settingKey;
    }

    /**
     * 配置的Key:必须唯一
     * @param settingKey 配置的Key
     **/
    public void setSettingKey(String settingKey) {
        this.settingKey = settingKey == null ? null : settingKey.trim();
    }

    /**
     * 配置的名称
     * @return java.lang.String
     **/
    public String getSettingName() {
        return settingName;
    }

    /**
     * 配置的名称
     * @param settingName 配置的名称
     **/
    public void setSettingName(String settingName) {
        this.settingName = settingName == null ? null : settingName.trim();
    }

    /**
     * 配置的值
     * @return java.lang.String
     **/
    public String getSettingValue() {
        return settingValue;
    }

    /**
     * 配置的值
     * @param settingValue 配置的值
     **/
    public void setSettingValue(String settingValue) {
        this.settingValue = settingValue == null ? null : settingValue.trim();
    }

    /**
     * 配置的状态
     * @return java.lang.String
     **/
    public String getSettingStatus() {
        return settingStatus;
    }

    /**
     * 配置的状态
     * @param settingStatus 配置的状态
     **/
    public void setSettingStatus(String settingStatus) {
        this.settingStatus = settingStatus == null ? null : settingStatus.trim();
    }

    /**
     * 配置的描述
     * @return java.lang.String
     **/
    public String getSettingDesc() {
        return settingDesc;
    }

    /**
     * 配置的描述
     * @param settingDesc 配置的描述
     **/
    public void setSettingDesc(String settingDesc) {
        this.settingDesc = settingDesc == null ? null : settingDesc.trim();
    }

    /**
     * 配置的时间
     * @return java.util.Date
     **/
    public Date getSettingCreateTime() {
        return settingCreateTime;
    }

    /**
     * 配置的时间
     * @param settingCreateTime 配置的时间
     **/
    public void setSettingCreateTime(Date settingCreateTime) {
        this.settingCreateTime = settingCreateTime;
    }

    /**
     * 用户的ID
     * @return java.lang.String
     **/
    public String getSettingUserId() {
        return settingUserId;
    }

    /**
     * 用户的ID
     * @param settingUserId 用户的ID
     **/
    public void setSettingUserId(String settingUserId) {
        this.settingUserId = settingUserId == null ? null : settingUserId.trim();
    }

    /**
     * 用户的名称
     * @return java.lang.String
     **/
    public String getSettingUserName() {
        return settingUserName;
    }

    /**
     * 用户的名称
     * @param settingUserName 用户的名称
     **/
    public void setSettingUserName(String settingUserName) {
        this.settingUserName = settingUserName == null ? null : settingUserName.trim();
    }

    /**
     * 组织ID
     * @return java.lang.String
     **/
    public String getSettingOrganId() {
        return settingOrganId;
    }

    /**
     * 组织ID
     * @param settingOrganId 组织ID
     **/
    public void setSettingOrganId(String settingOrganId) {
        this.settingOrganId = settingOrganId == null ? null : settingOrganId.trim();
    }

    /**
     * 组织名称
     * @return java.lang.String
     **/
    public String getSettingOrganName() {
        return settingOrganName;
    }

    /**
     * 组织名称
     * @param settingOrganName 组织名称
     **/
    public void setSettingOrganName(String settingOrganName) {
        this.settingOrganName = settingOrganName == null ? null : settingOrganName.trim();
    }

    /**
     * API方法的全名称:主要用于动态配置的扩展
     * @return java.lang.String
     **/
    public String getSettingApi() {
        return settingApi;
    }

    /**
     * API方法的全名称:主要用于动态配置的扩展
     * @param settingApi API方法的全名称
     **/
    public void setSettingApi(String settingApi) {
        this.settingApi = settingApi == null ? null : settingApi.trim();
    }

    /**
     * 是否系统所有
     * @return java.lang.String
     **/
    public String getSettingIsSystem() {
        return settingIsSystem;
    }

    /**
     * 是否系统所有
     * @param settingIsSystem 是否系统所有
     **/
    public void setSettingIsSystem(String settingIsSystem) {
        this.settingIsSystem = settingIsSystem == null ? null : settingIsSystem.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getSettingOrderNum() {
        return settingOrderNum;
    }

    /**
     * 排序号
     * @param settingOrderNum 排序号
     **/
    public void setSettingOrderNum(Integer settingOrderNum) {
        this.settingOrderNum = settingOrderNum;
    }
}