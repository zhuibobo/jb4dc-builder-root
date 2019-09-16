package com.jb4dc.builder.dbentities.api;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_API_GROUP
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ApiGroupEntity {
    //API_GROUP_ID:主键:UUID
    @DBKeyField
    private String apiGroupId;

    //API_GROUP_VALUE:分组值
    private String apiGroupValue;

    //API__GROUP_TEXT:分组名称
    private String apiGroupText;

    //API_GROUP_ORDER_NUM:排序号
    private Integer apiGroupOrderNum;

    //API_GROUP_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date apiGroupCreateTime;

    //API_GROUP_DESC:备注
    private String apiGroupDesc;

    //API_GROUP_STATUS:状态
    private String apiGroupStatus;

    //API_GROUP_PARENT_ID:父节点ID
    private String apiGroupParentId;

    //API_GROUP_IS_SYSTEM:是否系统所有
    private String apiGroupIsSystem;

    //API_GROUP_DEL_ENABLE:能否删除
    private String apiGroupDelEnable;

    //API_GROUP_PID_LIST:父节点IDList
    private String apiGroupPidList;

    //API_GROUP_CHILD_COUNT:子节点数量
    private Integer apiGroupChildCount;

    //API_GROUP_ORGAN_ID:组织ID
    private String apiGroupOrganId;

    //API_GROUP_ORGAN_NAME:组织名称
    private String apiGroupOrganName;

    /**
     * 构造函数
     * @param apiGroupId 主键
     * @param apiGroupValue 分组值
     * @param apiGroupText 分组名称
     * @param apiGroupOrderNum 排序号
     * @param apiGroupCreateTime 创建时间
     * @param apiGroupDesc 备注
     * @param apiGroupStatus 状态
     * @param apiGroupParentId 父节点ID
     * @param apiGroupIsSystem 是否系统所有
     * @param apiGroupDelEnable 能否删除
     * @param apiGroupPidList 父节点IDList
     * @param apiGroupChildCount 子节点数量
     * @param apiGroupOrganId 组织ID
     * @param apiGroupOrganName 组织名称
     **/
    public ApiGroupEntity(String apiGroupId, String apiGroupValue, String apiGroupText, Integer apiGroupOrderNum, Date apiGroupCreateTime, String apiGroupDesc, String apiGroupStatus, String apiGroupParentId, String apiGroupIsSystem, String apiGroupDelEnable, String apiGroupPidList, Integer apiGroupChildCount, String apiGroupOrganId, String apiGroupOrganName) {
        this.apiGroupId = apiGroupId;
        this.apiGroupValue = apiGroupValue;
        this.apiGroupText = apiGroupText;
        this.apiGroupOrderNum = apiGroupOrderNum;
        this.apiGroupCreateTime = apiGroupCreateTime;
        this.apiGroupDesc = apiGroupDesc;
        this.apiGroupStatus = apiGroupStatus;
        this.apiGroupParentId = apiGroupParentId;
        this.apiGroupIsSystem = apiGroupIsSystem;
        this.apiGroupDelEnable = apiGroupDelEnable;
        this.apiGroupPidList = apiGroupPidList;
        this.apiGroupChildCount = apiGroupChildCount;
        this.apiGroupOrganId = apiGroupOrganId;
        this.apiGroupOrganName = apiGroupOrganName;
    }

    public ApiGroupEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getApiGroupId() {
        return apiGroupId;
    }

    /**
     * 主键:UUID
     * @param apiGroupId 主键
     **/
    public void setApiGroupId(String apiGroupId) {
        this.apiGroupId = apiGroupId == null ? null : apiGroupId.trim();
    }

    /**
     * 分组值
     * @return java.lang.String
     **/
    public String getApiGroupValue() {
        return apiGroupValue;
    }

    /**
     * 分组值
     * @param apiGroupValue 分组值
     **/
    public void setApiGroupValue(String apiGroupValue) {
        this.apiGroupValue = apiGroupValue == null ? null : apiGroupValue.trim();
    }

    /**
     * 分组名称
     * @return java.lang.String
     **/
    public String getApiGroupText() {
        return apiGroupText;
    }

    /**
     * 分组名称
     * @param apiGroupText 分组名称
     **/
    public void setApiGroupText(String apiGroupText) {
        this.apiGroupText = apiGroupText == null ? null : apiGroupText.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getApiGroupOrderNum() {
        return apiGroupOrderNum;
    }

    /**
     * 排序号
     * @param apiGroupOrderNum 排序号
     **/
    public void setApiGroupOrderNum(Integer apiGroupOrderNum) {
        this.apiGroupOrderNum = apiGroupOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getApiGroupCreateTime() {
        return apiGroupCreateTime;
    }

    /**
     * 创建时间
     * @param apiGroupCreateTime 创建时间
     **/
    public void setApiGroupCreateTime(Date apiGroupCreateTime) {
        this.apiGroupCreateTime = apiGroupCreateTime;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getApiGroupDesc() {
        return apiGroupDesc;
    }

    /**
     * 备注
     * @param apiGroupDesc 备注
     **/
    public void setApiGroupDesc(String apiGroupDesc) {
        this.apiGroupDesc = apiGroupDesc == null ? null : apiGroupDesc.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getApiGroupStatus() {
        return apiGroupStatus;
    }

    /**
     * 状态
     * @param apiGroupStatus 状态
     **/
    public void setApiGroupStatus(String apiGroupStatus) {
        this.apiGroupStatus = apiGroupStatus == null ? null : apiGroupStatus.trim();
    }

    /**
     * 父节点ID
     * @return java.lang.String
     **/
    public String getApiGroupParentId() {
        return apiGroupParentId;
    }

    /**
     * 父节点ID
     * @param apiGroupParentId 父节点ID
     **/
    public void setApiGroupParentId(String apiGroupParentId) {
        this.apiGroupParentId = apiGroupParentId == null ? null : apiGroupParentId.trim();
    }

    /**
     * 是否系统所有
     * @return java.lang.String
     **/
    public String getApiGroupIsSystem() {
        return apiGroupIsSystem;
    }

    /**
     * 是否系统所有
     * @param apiGroupIsSystem 是否系统所有
     **/
    public void setApiGroupIsSystem(String apiGroupIsSystem) {
        this.apiGroupIsSystem = apiGroupIsSystem == null ? null : apiGroupIsSystem.trim();
    }

    /**
     * 能否删除
     * @return java.lang.String
     **/
    public String getApiGroupDelEnable() {
        return apiGroupDelEnable;
    }

    /**
     * 能否删除
     * @param apiGroupDelEnable 能否删除
     **/
    public void setApiGroupDelEnable(String apiGroupDelEnable) {
        this.apiGroupDelEnable = apiGroupDelEnable == null ? null : apiGroupDelEnable.trim();
    }

    /**
     * 父节点IDList
     * @return java.lang.String
     **/
    public String getApiGroupPidList() {
        return apiGroupPidList;
    }

    /**
     * 父节点IDList
     * @param apiGroupPidList 父节点IDList
     **/
    public void setApiGroupPidList(String apiGroupPidList) {
        this.apiGroupPidList = apiGroupPidList == null ? null : apiGroupPidList.trim();
    }

    /**
     * 子节点数量
     * @return java.lang.Integer
     **/
    public Integer getApiGroupChildCount() {
        return apiGroupChildCount;
    }

    /**
     * 子节点数量
     * @param apiGroupChildCount 子节点数量
     **/
    public void setApiGroupChildCount(Integer apiGroupChildCount) {
        this.apiGroupChildCount = apiGroupChildCount;
    }

    /**
     * 组织ID
     * @return java.lang.String
     **/
    public String getApiGroupOrganId() {
        return apiGroupOrganId;
    }

    /**
     * 组织ID
     * @param apiGroupOrganId 组织ID
     **/
    public void setApiGroupOrganId(String apiGroupOrganId) {
        this.apiGroupOrganId = apiGroupOrganId == null ? null : apiGroupOrganId.trim();
    }

    /**
     * 组织名称
     * @return java.lang.String
     **/
    public String getApiGroupOrganName() {
        return apiGroupOrganName;
    }

    /**
     * 组织名称
     * @param apiGroupOrganName 组织名称
     **/
    public void setApiGroupOrganName(String apiGroupOrganName) {
        this.apiGroupOrganName = apiGroupOrganName == null ? null : apiGroupOrganName.trim();
    }
}