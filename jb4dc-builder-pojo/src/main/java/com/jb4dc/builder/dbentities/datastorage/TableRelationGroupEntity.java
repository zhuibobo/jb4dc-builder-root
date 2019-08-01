package com.jb4dc.builder.dbentities.datastorage;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_TABLE_RELATION_GROUP
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class TableRelationGroupEntity {
    //REL_GROUP_ID:主键:UUID
    @DBKeyField
    private String relGroupId;

    //REL_GROUP_VALUE:关联分组值
    private String relGroupValue;

    //REL_GROUP_TEXT:关联分组标题
    private String relGroupText;

    //REL_GROUP_ORDER_NUM:排序号
    private Integer relGroupOrderNum;

    //REL_GROUP_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date relGroupCreateTime;

    //REL_GROUP_DESC:描述
    private String relGroupDesc;

    //REL_GROUP_STATUS:状态
    private String relGroupStatus;

    //REL_GROUP_PARENT_ID:父节点ID
    private String relGroupParentId;

    //REL_GROUP_IS_SYSTEM:是否系统
    private String relGroupIsSystem;

    //REL_GROUP_DEL_ENABLE:是否允许删除
    private String relGroupDelEnable;

    //REL_GROUP_PID_LIST:父节点列表
    private String relGroupPidList;

    //REL_GROUP_CHILD_COUNT:子节点数量
    private Integer relGroupChildCount;

    //REL_GROUP_USER_ID:创建人ID
    private String relGroupUserId;

    //REL_GROUP_USER_NAME:创建人
    private String relGroupUserName;

    /**
     * 构造函数
     * @param relGroupId 主键
     * @param relGroupValue 关联分组值
     * @param relGroupText 关联分组标题
     * @param relGroupOrderNum 排序号
     * @param relGroupCreateTime 创建时间
     * @param relGroupDesc 描述
     * @param relGroupStatus 状态
     * @param relGroupParentId 父节点ID
     * @param relGroupIsSystem 是否系统
     * @param relGroupDelEnable 是否允许删除
     * @param relGroupPidList 父节点列表
     * @param relGroupChildCount 子节点数量
     * @param relGroupUserId 创建人ID
     * @param relGroupUserName 创建人
     **/
    public TableRelationGroupEntity(String relGroupId, String relGroupValue, String relGroupText, Integer relGroupOrderNum, Date relGroupCreateTime, String relGroupDesc, String relGroupStatus, String relGroupParentId, String relGroupIsSystem, String relGroupDelEnable, String relGroupPidList, Integer relGroupChildCount, String relGroupUserId, String relGroupUserName) {
        this.relGroupId = relGroupId;
        this.relGroupValue = relGroupValue;
        this.relGroupText = relGroupText;
        this.relGroupOrderNum = relGroupOrderNum;
        this.relGroupCreateTime = relGroupCreateTime;
        this.relGroupDesc = relGroupDesc;
        this.relGroupStatus = relGroupStatus;
        this.relGroupParentId = relGroupParentId;
        this.relGroupIsSystem = relGroupIsSystem;
        this.relGroupDelEnable = relGroupDelEnable;
        this.relGroupPidList = relGroupPidList;
        this.relGroupChildCount = relGroupChildCount;
        this.relGroupUserId = relGroupUserId;
        this.relGroupUserName = relGroupUserName;
    }

    public TableRelationGroupEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getRelGroupId() {
        return relGroupId;
    }

    /**
     * 主键:UUID
     * @param relGroupId 主键
     **/
    public void setRelGroupId(String relGroupId) {
        this.relGroupId = relGroupId == null ? null : relGroupId.trim();
    }

    /**
     * 关联分组值
     * @return java.lang.String
     **/
    public String getRelGroupValue() {
        return relGroupValue;
    }

    /**
     * 关联分组值
     * @param relGroupValue 关联分组值
     **/
    public void setRelGroupValue(String relGroupValue) {
        this.relGroupValue = relGroupValue == null ? null : relGroupValue.trim();
    }

    /**
     * 关联分组标题
     * @return java.lang.String
     **/
    public String getRelGroupText() {
        return relGroupText;
    }

    /**
     * 关联分组标题
     * @param relGroupText 关联分组标题
     **/
    public void setRelGroupText(String relGroupText) {
        this.relGroupText = relGroupText == null ? null : relGroupText.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getRelGroupOrderNum() {
        return relGroupOrderNum;
    }

    /**
     * 排序号
     * @param relGroupOrderNum 排序号
     **/
    public void setRelGroupOrderNum(Integer relGroupOrderNum) {
        this.relGroupOrderNum = relGroupOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getRelGroupCreateTime() {
        return relGroupCreateTime;
    }

    /**
     * 创建时间
     * @param relGroupCreateTime 创建时间
     **/
    public void setRelGroupCreateTime(Date relGroupCreateTime) {
        this.relGroupCreateTime = relGroupCreateTime;
    }

    /**
     * 描述
     * @return java.lang.String
     **/
    public String getRelGroupDesc() {
        return relGroupDesc;
    }

    /**
     * 描述
     * @param relGroupDesc 描述
     **/
    public void setRelGroupDesc(String relGroupDesc) {
        this.relGroupDesc = relGroupDesc == null ? null : relGroupDesc.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getRelGroupStatus() {
        return relGroupStatus;
    }

    /**
     * 状态
     * @param relGroupStatus 状态
     **/
    public void setRelGroupStatus(String relGroupStatus) {
        this.relGroupStatus = relGroupStatus == null ? null : relGroupStatus.trim();
    }

    /**
     * 父节点ID
     * @return java.lang.String
     **/
    public String getRelGroupParentId() {
        return relGroupParentId;
    }

    /**
     * 父节点ID
     * @param relGroupParentId 父节点ID
     **/
    public void setRelGroupParentId(String relGroupParentId) {
        this.relGroupParentId = relGroupParentId == null ? null : relGroupParentId.trim();
    }

    /**
     * 是否系统
     * @return java.lang.String
     **/
    public String getRelGroupIsSystem() {
        return relGroupIsSystem;
    }

    /**
     * 是否系统
     * @param relGroupIsSystem 是否系统
     **/
    public void setRelGroupIsSystem(String relGroupIsSystem) {
        this.relGroupIsSystem = relGroupIsSystem == null ? null : relGroupIsSystem.trim();
    }

    /**
     * 是否允许删除
     * @return java.lang.String
     **/
    public String getRelGroupDelEnable() {
        return relGroupDelEnable;
    }

    /**
     * 是否允许删除
     * @param relGroupDelEnable 是否允许删除
     **/
    public void setRelGroupDelEnable(String relGroupDelEnable) {
        this.relGroupDelEnable = relGroupDelEnable == null ? null : relGroupDelEnable.trim();
    }

    /**
     * 父节点列表
     * @return java.lang.String
     **/
    public String getRelGroupPidList() {
        return relGroupPidList;
    }

    /**
     * 父节点列表
     * @param relGroupPidList 父节点列表
     **/
    public void setRelGroupPidList(String relGroupPidList) {
        this.relGroupPidList = relGroupPidList == null ? null : relGroupPidList.trim();
    }

    /**
     * 子节点数量
     * @return java.lang.Integer
     **/
    public Integer getRelGroupChildCount() {
        return relGroupChildCount;
    }

    /**
     * 子节点数量
     * @param relGroupChildCount 子节点数量
     **/
    public void setRelGroupChildCount(Integer relGroupChildCount) {
        this.relGroupChildCount = relGroupChildCount;
    }

    /**
     * 创建人ID
     * @return java.lang.String
     **/
    public String getRelGroupUserId() {
        return relGroupUserId;
    }

    /**
     * 创建人ID
     * @param relGroupUserId 创建人ID
     **/
    public void setRelGroupUserId(String relGroupUserId) {
        this.relGroupUserId = relGroupUserId == null ? null : relGroupUserId.trim();
    }

    /**
     * 创建人
     * @return java.lang.String
     **/
    public String getRelGroupUserName() {
        return relGroupUserName;
    }

    /**
     * 创建人
     * @param relGroupUserName 创建人
     **/
    public void setRelGroupUserName(String relGroupUserName) {
        this.relGroupUserName = relGroupUserName == null ? null : relGroupUserName.trim();
    }
}