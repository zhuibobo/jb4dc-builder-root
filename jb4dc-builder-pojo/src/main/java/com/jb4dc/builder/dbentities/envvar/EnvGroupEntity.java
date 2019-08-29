package com.jb4dc.builder.dbentities.envvar;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_ENV_GROUP
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class EnvGroupEntity {
    //ENV_GROUP_ID:主键:UUID
    @DBKeyField
    private String envGroupId;

    //ENV_GROUP_VALUE:分组值
    private String envGroupValue;

    //ENV_GROUP_TEXT:分组名称
    private String envGroupText;

    //ENV_GROUP_ORDER_NUM:排序号
    private Integer envGroupOrderNum;

    //ENV_GROUP_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date envGroupCreateTime;

    //ENV_GROUP_DESC:备注
    private String envGroupDesc;

    //ENV_GROUP_STATUS:状态
    private String envGroupStatus;

    //ENV_GROUP_PARENT_ID:父节点ID
    private String envGroupParentId;

    //ENV_GROUP_IS_SYSTEM:是否系统所有
    private String envGroupIsSystem;

    //ENV_GROUP_DEL_ENABLE:能否删除
    private String envGroupDelEnable;

    //ENV_GROUP_PID_LIST:父节点IDList
    private String envGroupPidList;

    //ENV_GROUP_CHILD_COUNT:子节点数量
    private Integer envGroupChildCount;

    //ENV_GROUP_ORGAN_ID:组织ID
    private String envGroupOrganId;

    //ENV_GROUP_ORGAN_NAME:组织名称
    private String envGroupOrganName;

    /**
     * 构造函数
     * @param envGroupId 主键
     * @param envGroupValue 分组值
     * @param envGroupText 分组名称
     * @param envGroupOrderNum 排序号
     * @param envGroupCreateTime 创建时间
     * @param envGroupDesc 备注
     * @param envGroupStatus 状态
     * @param envGroupParentId 父节点ID
     * @param envGroupIsSystem 是否系统所有
     * @param envGroupDelEnable 能否删除
     * @param envGroupPidList 父节点IDList
     * @param envGroupChildCount 子节点数量
     * @param envGroupOrganId 组织ID
     * @param envGroupOrganName 组织名称
     **/
    public EnvGroupEntity(String envGroupId, String envGroupValue, String envGroupText, Integer envGroupOrderNum, Date envGroupCreateTime, String envGroupDesc, String envGroupStatus, String envGroupParentId, String envGroupIsSystem, String envGroupDelEnable, String envGroupPidList, Integer envGroupChildCount, String envGroupOrganId, String envGroupOrganName) {
        this.envGroupId = envGroupId;
        this.envGroupValue = envGroupValue;
        this.envGroupText = envGroupText;
        this.envGroupOrderNum = envGroupOrderNum;
        this.envGroupCreateTime = envGroupCreateTime;
        this.envGroupDesc = envGroupDesc;
        this.envGroupStatus = envGroupStatus;
        this.envGroupParentId = envGroupParentId;
        this.envGroupIsSystem = envGroupIsSystem;
        this.envGroupDelEnable = envGroupDelEnable;
        this.envGroupPidList = envGroupPidList;
        this.envGroupChildCount = envGroupChildCount;
        this.envGroupOrganId = envGroupOrganId;
        this.envGroupOrganName = envGroupOrganName;
    }

    public EnvGroupEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getEnvGroupId() {
        return envGroupId;
    }

    /**
     * 主键:UUID
     * @param envGroupId 主键
     **/
    public void setEnvGroupId(String envGroupId) {
        this.envGroupId = envGroupId == null ? null : envGroupId.trim();
    }

    /**
     * 分组值
     * @return java.lang.String
     **/
    public String getEnvGroupValue() {
        return envGroupValue;
    }

    /**
     * 分组值
     * @param envGroupValue 分组值
     **/
    public void setEnvGroupValue(String envGroupValue) {
        this.envGroupValue = envGroupValue == null ? null : envGroupValue.trim();
    }

    /**
     * 分组名称
     * @return java.lang.String
     **/
    public String getEnvGroupText() {
        return envGroupText;
    }

    /**
     * 分组名称
     * @param envGroupText 分组名称
     **/
    public void setEnvGroupText(String envGroupText) {
        this.envGroupText = envGroupText == null ? null : envGroupText.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getEnvGroupOrderNum() {
        return envGroupOrderNum;
    }

    /**
     * 排序号
     * @param envGroupOrderNum 排序号
     **/
    public void setEnvGroupOrderNum(Integer envGroupOrderNum) {
        this.envGroupOrderNum = envGroupOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getEnvGroupCreateTime() {
        return envGroupCreateTime;
    }

    /**
     * 创建时间
     * @param envGroupCreateTime 创建时间
     **/
    public void setEnvGroupCreateTime(Date envGroupCreateTime) {
        this.envGroupCreateTime = envGroupCreateTime;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getEnvGroupDesc() {
        return envGroupDesc;
    }

    /**
     * 备注
     * @param envGroupDesc 备注
     **/
    public void setEnvGroupDesc(String envGroupDesc) {
        this.envGroupDesc = envGroupDesc == null ? null : envGroupDesc.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getEnvGroupStatus() {
        return envGroupStatus;
    }

    /**
     * 状态
     * @param envGroupStatus 状态
     **/
    public void setEnvGroupStatus(String envGroupStatus) {
        this.envGroupStatus = envGroupStatus == null ? null : envGroupStatus.trim();
    }

    /**
     * 父节点ID
     * @return java.lang.String
     **/
    public String getEnvGroupParentId() {
        return envGroupParentId;
    }

    /**
     * 父节点ID
     * @param envGroupParentId 父节点ID
     **/
    public void setEnvGroupParentId(String envGroupParentId) {
        this.envGroupParentId = envGroupParentId == null ? null : envGroupParentId.trim();
    }

    /**
     * 是否系统所有
     * @return java.lang.String
     **/
    public String getEnvGroupIsSystem() {
        return envGroupIsSystem;
    }

    /**
     * 是否系统所有
     * @param envGroupIsSystem 是否系统所有
     **/
    public void setEnvGroupIsSystem(String envGroupIsSystem) {
        this.envGroupIsSystem = envGroupIsSystem == null ? null : envGroupIsSystem.trim();
    }

    /**
     * 能否删除
     * @return java.lang.String
     **/
    public String getEnvGroupDelEnable() {
        return envGroupDelEnable;
    }

    /**
     * 能否删除
     * @param envGroupDelEnable 能否删除
     **/
    public void setEnvGroupDelEnable(String envGroupDelEnable) {
        this.envGroupDelEnable = envGroupDelEnable == null ? null : envGroupDelEnable.trim();
    }

    /**
     * 父节点IDList
     * @return java.lang.String
     **/
    public String getEnvGroupPidList() {
        return envGroupPidList;
    }

    /**
     * 父节点IDList
     * @param envGroupPidList 父节点IDList
     **/
    public void setEnvGroupPidList(String envGroupPidList) {
        this.envGroupPidList = envGroupPidList == null ? null : envGroupPidList.trim();
    }

    /**
     * 子节点数量
     * @return java.lang.Integer
     **/
    public Integer getEnvGroupChildCount() {
        return envGroupChildCount;
    }

    /**
     * 子节点数量
     * @param envGroupChildCount 子节点数量
     **/
    public void setEnvGroupChildCount(Integer envGroupChildCount) {
        this.envGroupChildCount = envGroupChildCount;
    }

    /**
     * 组织ID
     * @return java.lang.String
     **/
    public String getEnvGroupOrganId() {
        return envGroupOrganId;
    }

    /**
     * 组织ID
     * @param envGroupOrganId 组织ID
     **/
    public void setEnvGroupOrganId(String envGroupOrganId) {
        this.envGroupOrganId = envGroupOrganId == null ? null : envGroupOrganId.trim();
    }

    /**
     * 组织名称
     * @return java.lang.String
     **/
    public String getEnvGroupOrganName() {
        return envGroupOrganName;
    }

    /**
     * 组织名称
     * @param envGroupOrganName 组织名称
     **/
    public void setEnvGroupOrganName(String envGroupOrganName) {
        this.envGroupOrganName = envGroupOrganName == null ? null : envGroupOrganName.trim();
    }
}