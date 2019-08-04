package com.jb4dc.builder.dbentities.module;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_MODULE
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ModuleEntity {
    //MODULE_ID:主键:UUID
    @DBKeyField
    private String moduleId;

    //MODULE_VALUE:模块值
    private String moduleValue;

    //MODULE_TEXT:模块标题
    private String moduleText;

    //MODULE_ORDER_NUM:排序号
    private Integer moduleOrderNum;

    //MODULE_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date moduleCreateTime;

    //MODULE_DESC:备注
    private String moduleDesc;

    //MODULE_STATUS:状态
    private String moduleStatus;

    //MODULE_PARENT_ID:父节点ID
    private String moduleParentId;

    //MODULE_IS_SYSTEM:是否系统所有
    private String moduleIsSystem;

    //MODULE_DEL_ENABLE:能否删除
    private String moduleDelEnable;

    //MODULE_PID_LIST:父节点ID列表
    private String modulePidList;

    //MODULE_CHILD_COUNT:子节点数量
    private Integer moduleChildCount;

    //MODULE_ORGAN_ID:组织ID
    private String moduleOrganId;

    //MODULE_ORGAN_NAME:组织名称
    private String moduleOrganName;

    /**
     * 构造函数
     * @param moduleId 主键
     * @param moduleValue 模块值
     * @param moduleText 模块标题
     * @param moduleOrderNum 排序号
     * @param moduleCreateTime 创建时间
     * @param moduleDesc 备注
     * @param moduleStatus 状态
     * @param moduleParentId 父节点ID
     * @param moduleIsSystem 是否系统所有
     * @param moduleDelEnable 能否删除
     * @param modulePidList 父节点ID列表
     * @param moduleChildCount 子节点数量
     * @param moduleOrganId 组织ID
     * @param moduleOrganName 组织名称
     **/
    public ModuleEntity(String moduleId, String moduleValue, String moduleText, Integer moduleOrderNum, Date moduleCreateTime, String moduleDesc, String moduleStatus, String moduleParentId, String moduleIsSystem, String moduleDelEnable, String modulePidList, Integer moduleChildCount, String moduleOrganId, String moduleOrganName) {
        this.moduleId = moduleId;
        this.moduleValue = moduleValue;
        this.moduleText = moduleText;
        this.moduleOrderNum = moduleOrderNum;
        this.moduleCreateTime = moduleCreateTime;
        this.moduleDesc = moduleDesc;
        this.moduleStatus = moduleStatus;
        this.moduleParentId = moduleParentId;
        this.moduleIsSystem = moduleIsSystem;
        this.moduleDelEnable = moduleDelEnable;
        this.modulePidList = modulePidList;
        this.moduleChildCount = moduleChildCount;
        this.moduleOrganId = moduleOrganId;
        this.moduleOrganName = moduleOrganName;
    }

    public ModuleEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getModuleId() {
        return moduleId;
    }

    /**
     * 主键:UUID
     * @param moduleId 主键
     **/
    public void setModuleId(String moduleId) {
        this.moduleId = moduleId == null ? null : moduleId.trim();
    }

    /**
     * 模块值
     * @return java.lang.String
     **/
    public String getModuleValue() {
        return moduleValue;
    }

    /**
     * 模块值
     * @param moduleValue 模块值
     **/
    public void setModuleValue(String moduleValue) {
        this.moduleValue = moduleValue == null ? null : moduleValue.trim();
    }

    /**
     * 模块标题
     * @return java.lang.String
     **/
    public String getModuleText() {
        return moduleText;
    }

    /**
     * 模块标题
     * @param moduleText 模块标题
     **/
    public void setModuleText(String moduleText) {
        this.moduleText = moduleText == null ? null : moduleText.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getModuleOrderNum() {
        return moduleOrderNum;
    }

    /**
     * 排序号
     * @param moduleOrderNum 排序号
     **/
    public void setModuleOrderNum(Integer moduleOrderNum) {
        this.moduleOrderNum = moduleOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getModuleCreateTime() {
        return moduleCreateTime;
    }

    /**
     * 创建时间
     * @param moduleCreateTime 创建时间
     **/
    public void setModuleCreateTime(Date moduleCreateTime) {
        this.moduleCreateTime = moduleCreateTime;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getModuleDesc() {
        return moduleDesc;
    }

    /**
     * 备注
     * @param moduleDesc 备注
     **/
    public void setModuleDesc(String moduleDesc) {
        this.moduleDesc = moduleDesc == null ? null : moduleDesc.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getModuleStatus() {
        return moduleStatus;
    }

    /**
     * 状态
     * @param moduleStatus 状态
     **/
    public void setModuleStatus(String moduleStatus) {
        this.moduleStatus = moduleStatus == null ? null : moduleStatus.trim();
    }

    /**
     * 父节点ID
     * @return java.lang.String
     **/
    public String getModuleParentId() {
        return moduleParentId;
    }

    /**
     * 父节点ID
     * @param moduleParentId 父节点ID
     **/
    public void setModuleParentId(String moduleParentId) {
        this.moduleParentId = moduleParentId == null ? null : moduleParentId.trim();
    }

    /**
     * 是否系统所有
     * @return java.lang.String
     **/
    public String getModuleIsSystem() {
        return moduleIsSystem;
    }

    /**
     * 是否系统所有
     * @param moduleIsSystem 是否系统所有
     **/
    public void setModuleIsSystem(String moduleIsSystem) {
        this.moduleIsSystem = moduleIsSystem == null ? null : moduleIsSystem.trim();
    }

    /**
     * 能否删除
     * @return java.lang.String
     **/
    public String getModuleDelEnable() {
        return moduleDelEnable;
    }

    /**
     * 能否删除
     * @param moduleDelEnable 能否删除
     **/
    public void setModuleDelEnable(String moduleDelEnable) {
        this.moduleDelEnable = moduleDelEnable == null ? null : moduleDelEnable.trim();
    }

    /**
     * 父节点ID列表
     * @return java.lang.String
     **/
    public String getModulePidList() {
        return modulePidList;
    }

    /**
     * 父节点ID列表
     * @param modulePidList 父节点ID列表
     **/
    public void setModulePidList(String modulePidList) {
        this.modulePidList = modulePidList == null ? null : modulePidList.trim();
    }

    /**
     * 子节点数量
     * @return java.lang.Integer
     **/
    public Integer getModuleChildCount() {
        return moduleChildCount;
    }

    /**
     * 子节点数量
     * @param moduleChildCount 子节点数量
     **/
    public void setModuleChildCount(Integer moduleChildCount) {
        this.moduleChildCount = moduleChildCount;
    }

    /**
     * 组织ID
     * @return java.lang.String
     **/
    public String getModuleOrganId() {
        return moduleOrganId;
    }

    /**
     * 组织ID
     * @param moduleOrganId 组织ID
     **/
    public void setModuleOrganId(String moduleOrganId) {
        this.moduleOrganId = moduleOrganId == null ? null : moduleOrganId.trim();
    }

    /**
     * 组织名称
     * @return java.lang.String
     **/
    public String getModuleOrganName() {
        return moduleOrganName;
    }

    /**
     * 组织名称
     * @param moduleOrganName 组织名称
     **/
    public void setModuleOrganName(String moduleOrganName) {
        this.moduleOrganName = moduleOrganName == null ? null : moduleOrganName.trim();
    }
}