package com.jb4dc.builder.dbentities.datastorage;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_TABLE_GROUP
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class TableGroupEntity {
    //TABLE_GROUP_ID:主键:UUID
    @DBKeyField
    private String tableGroupId;

    //TABLE_GROUP_VALUE:分组值
    private String tableGroupValue;

    //TABLE_GROUP_TEXT:分组名称
    private String tableGroupText;

    //TABLE_GROUP_ORDER_NUM:排序号
    private Integer tableGroupOrderNum;

    //TABLE_GROUP_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date tableGroupCreateTime;

    //TABLE_GROUP_DESC:备注
    private String tableGroupDesc;

    //TABLE_GROUP_STATUS:状态
    private String tableGroupStatus;

    //TABLE_GROUP_PARENT_ID:父节点ID
    private String tableGroupParentId;

    //TABLE_GROUP_IS_SYSTEM:是否系统所有
    private String tableGroupIsSystem;

    //TABLE_GROUP_DEL_ENABLE:能否删除
    private String tableGroupDelEnable;

    //TABLE_GROUP_PID_LIST:父节点IDList
    private String tableGroupPidList;

    //TABLE_GROUP_CHILD_COUNT:子节点数量
    private Integer tableGroupChildCount;

    //TABLE_GROUP_LINK_ID:所属连接ID:关联到表TBUILD_DB_LINK.DB_ID
    private String tableGroupLinkId;

    //TABLE_GROUP_ORGAN_ID:组织ID
    private String tableGroupOrganId;

    //TABLE_GROUP_ORGAN_NAME:组织名称
    private String tableGroupOrganName;

    /**
     * 构造函数
     * @param tableGroupId 主键
     * @param tableGroupValue 分组值
     * @param tableGroupText 分组名称
     * @param tableGroupOrderNum 排序号
     * @param tableGroupCreateTime 创建时间
     * @param tableGroupDesc 备注
     * @param tableGroupStatus 状态
     * @param tableGroupParentId 父节点ID
     * @param tableGroupIsSystem 是否系统所有
     * @param tableGroupDelEnable 能否删除
     * @param tableGroupPidList 父节点IDList
     * @param tableGroupChildCount 子节点数量
     * @param tableGroupLinkId 所属连接ID
     * @param tableGroupOrganId 组织ID
     * @param tableGroupOrganName 组织名称
     **/
    public TableGroupEntity(String tableGroupId, String tableGroupValue, String tableGroupText, Integer tableGroupOrderNum, Date tableGroupCreateTime, String tableGroupDesc, String tableGroupStatus, String tableGroupParentId, String tableGroupIsSystem, String tableGroupDelEnable, String tableGroupPidList, Integer tableGroupChildCount, String tableGroupLinkId, String tableGroupOrganId, String tableGroupOrganName) {
        this.tableGroupId = tableGroupId;
        this.tableGroupValue = tableGroupValue;
        this.tableGroupText = tableGroupText;
        this.tableGroupOrderNum = tableGroupOrderNum;
        this.tableGroupCreateTime = tableGroupCreateTime;
        this.tableGroupDesc = tableGroupDesc;
        this.tableGroupStatus = tableGroupStatus;
        this.tableGroupParentId = tableGroupParentId;
        this.tableGroupIsSystem = tableGroupIsSystem;
        this.tableGroupDelEnable = tableGroupDelEnable;
        this.tableGroupPidList = tableGroupPidList;
        this.tableGroupChildCount = tableGroupChildCount;
        this.tableGroupLinkId = tableGroupLinkId;
        this.tableGroupOrganId = tableGroupOrganId;
        this.tableGroupOrganName = tableGroupOrganName;
    }

    public TableGroupEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getTableGroupId() {
        return tableGroupId;
    }

    /**
     * 主键:UUID
     * @param tableGroupId 主键
     **/
    public void setTableGroupId(String tableGroupId) {
        this.tableGroupId = tableGroupId == null ? null : tableGroupId.trim();
    }

    /**
     * 分组值
     * @return java.lang.String
     **/
    public String getTableGroupValue() {
        return tableGroupValue;
    }

    /**
     * 分组值
     * @param tableGroupValue 分组值
     **/
    public void setTableGroupValue(String tableGroupValue) {
        this.tableGroupValue = tableGroupValue == null ? null : tableGroupValue.trim();
    }

    /**
     * 分组名称
     * @return java.lang.String
     **/
    public String getTableGroupText() {
        return tableGroupText;
    }

    /**
     * 分组名称
     * @param tableGroupText 分组名称
     **/
    public void setTableGroupText(String tableGroupText) {
        this.tableGroupText = tableGroupText == null ? null : tableGroupText.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getTableGroupOrderNum() {
        return tableGroupOrderNum;
    }

    /**
     * 排序号
     * @param tableGroupOrderNum 排序号
     **/
    public void setTableGroupOrderNum(Integer tableGroupOrderNum) {
        this.tableGroupOrderNum = tableGroupOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getTableGroupCreateTime() {
        return tableGroupCreateTime;
    }

    /**
     * 创建时间
     * @param tableGroupCreateTime 创建时间
     **/
    public void setTableGroupCreateTime(Date tableGroupCreateTime) {
        this.tableGroupCreateTime = tableGroupCreateTime;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getTableGroupDesc() {
        return tableGroupDesc;
    }

    /**
     * 备注
     * @param tableGroupDesc 备注
     **/
    public void setTableGroupDesc(String tableGroupDesc) {
        this.tableGroupDesc = tableGroupDesc == null ? null : tableGroupDesc.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getTableGroupStatus() {
        return tableGroupStatus;
    }

    /**
     * 状态
     * @param tableGroupStatus 状态
     **/
    public void setTableGroupStatus(String tableGroupStatus) {
        this.tableGroupStatus = tableGroupStatus == null ? null : tableGroupStatus.trim();
    }

    /**
     * 父节点ID
     * @return java.lang.String
     **/
    public String getTableGroupParentId() {
        return tableGroupParentId;
    }

    /**
     * 父节点ID
     * @param tableGroupParentId 父节点ID
     **/
    public void setTableGroupParentId(String tableGroupParentId) {
        this.tableGroupParentId = tableGroupParentId == null ? null : tableGroupParentId.trim();
    }

    /**
     * 是否系统所有
     * @return java.lang.String
     **/
    public String getTableGroupIsSystem() {
        return tableGroupIsSystem;
    }

    /**
     * 是否系统所有
     * @param tableGroupIsSystem 是否系统所有
     **/
    public void setTableGroupIsSystem(String tableGroupIsSystem) {
        this.tableGroupIsSystem = tableGroupIsSystem == null ? null : tableGroupIsSystem.trim();
    }

    /**
     * 能否删除
     * @return java.lang.String
     **/
    public String getTableGroupDelEnable() {
        return tableGroupDelEnable;
    }

    /**
     * 能否删除
     * @param tableGroupDelEnable 能否删除
     **/
    public void setTableGroupDelEnable(String tableGroupDelEnable) {
        this.tableGroupDelEnable = tableGroupDelEnable == null ? null : tableGroupDelEnable.trim();
    }

    /**
     * 父节点IDList
     * @return java.lang.String
     **/
    public String getTableGroupPidList() {
        return tableGroupPidList;
    }

    /**
     * 父节点IDList
     * @param tableGroupPidList 父节点IDList
     **/
    public void setTableGroupPidList(String tableGroupPidList) {
        this.tableGroupPidList = tableGroupPidList == null ? null : tableGroupPidList.trim();
    }

    /**
     * 子节点数量
     * @return java.lang.Integer
     **/
    public Integer getTableGroupChildCount() {
        return tableGroupChildCount;
    }

    /**
     * 子节点数量
     * @param tableGroupChildCount 子节点数量
     **/
    public void setTableGroupChildCount(Integer tableGroupChildCount) {
        this.tableGroupChildCount = tableGroupChildCount;
    }

    /**
     * 所属连接ID:关联到表TBUILD_DB_LINK.DB_ID
     * @return java.lang.String
     **/
    public String getTableGroupLinkId() {
        return tableGroupLinkId;
    }

    /**
     * 所属连接ID:关联到表TBUILD_DB_LINK.DB_ID
     * @param tableGroupLinkId 所属连接ID
     **/
    public void setTableGroupLinkId(String tableGroupLinkId) {
        this.tableGroupLinkId = tableGroupLinkId == null ? null : tableGroupLinkId.trim();
    }

    /**
     * 组织ID
     * @return java.lang.String
     **/
    public String getTableGroupOrganId() {
        return tableGroupOrganId;
    }

    /**
     * 组织ID
     * @param tableGroupOrganId 组织ID
     **/
    public void setTableGroupOrganId(String tableGroupOrganId) {
        this.tableGroupOrganId = tableGroupOrganId == null ? null : tableGroupOrganId.trim();
    }

    /**
     * 组织名称
     * @return java.lang.String
     **/
    public String getTableGroupOrganName() {
        return tableGroupOrganName;
    }

    /**
     * 组织名称
     * @param tableGroupOrganName 组织名称
     **/
    public void setTableGroupOrganName(String tableGroupOrganName) {
        this.tableGroupOrganName = tableGroupOrganName == null ? null : tableGroupOrganName.trim();
    }
}