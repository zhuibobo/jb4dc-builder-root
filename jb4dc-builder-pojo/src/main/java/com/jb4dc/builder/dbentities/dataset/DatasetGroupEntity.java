package com.jb4dc.builder.dbentities.dataset;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_DATASET_GROUP
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class DatasetGroupEntity {
    //DS_GROUP_ID:主键:UUID
    @DBKeyField
    private String dsGroupId;

    //DS_GROUP_VALUE:分组值
    private String dsGroupValue;

    //DS_GROUP_TEXT:分组名称
    private String dsGroupText;

    //DS_GROUP_ORDER_NUM:排序号
    private Integer dsGroupOrderNum;

    //DS_GROUP_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date dsGroupCreateTime;

    //DS_GROUP_DESC:备注
    private String dsGroupDesc;

    //DS_GROUP_STATUS:状态
    private String dsGroupStatus;

    //DS_GROUP_PARENT_ID:父节点ID
    private String dsGroupParentId;

    //DS_GROUP_IS_SYSTEM:是否系统所有
    private String dsGroupIsSystem;

    //DS_GROUP_DEL_ENABLE:内否进行删除
    private String dsGroupDelEnable;

    //DS_GROUP_PID_LIST:父节点ID列表
    private String dsGroupPidList;

    //DS_GROUP_CHILD_COUNT:子节点数量
    private Integer dsGroupChildCount;

    //DS_GROUP_ORGAN_ID:组织ID
    private String dsGroupOrganId;

    //DS_GROUP_ORGAN_NAME:组织ID名称
    private String dsGroupOrganName;

    /**
     * 构造函数
     * @param dsGroupId 主键
     * @param dsGroupValue 分组值
     * @param dsGroupText 分组名称
     * @param dsGroupOrderNum 排序号
     * @param dsGroupCreateTime 创建时间
     * @param dsGroupDesc 备注
     * @param dsGroupStatus 状态
     * @param dsGroupParentId 父节点ID
     * @param dsGroupIsSystem 是否系统所有
     * @param dsGroupDelEnable 内否进行删除
     * @param dsGroupPidList 父节点ID列表
     * @param dsGroupChildCount 子节点数量
     * @param dsGroupOrganId 组织ID
     * @param dsGroupOrganName 组织ID名称
     **/
    public DatasetGroupEntity(String dsGroupId, String dsGroupValue, String dsGroupText, Integer dsGroupOrderNum, Date dsGroupCreateTime, String dsGroupDesc, String dsGroupStatus, String dsGroupParentId, String dsGroupIsSystem, String dsGroupDelEnable, String dsGroupPidList, Integer dsGroupChildCount, String dsGroupOrganId, String dsGroupOrganName) {
        this.dsGroupId = dsGroupId;
        this.dsGroupValue = dsGroupValue;
        this.dsGroupText = dsGroupText;
        this.dsGroupOrderNum = dsGroupOrderNum;
        this.dsGroupCreateTime = dsGroupCreateTime;
        this.dsGroupDesc = dsGroupDesc;
        this.dsGroupStatus = dsGroupStatus;
        this.dsGroupParentId = dsGroupParentId;
        this.dsGroupIsSystem = dsGroupIsSystem;
        this.dsGroupDelEnable = dsGroupDelEnable;
        this.dsGroupPidList = dsGroupPidList;
        this.dsGroupChildCount = dsGroupChildCount;
        this.dsGroupOrganId = dsGroupOrganId;
        this.dsGroupOrganName = dsGroupOrganName;
    }

    public DatasetGroupEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getDsGroupId() {
        return dsGroupId;
    }

    /**
     * 主键:UUID
     * @param dsGroupId 主键
     **/
    public void setDsGroupId(String dsGroupId) {
        this.dsGroupId = dsGroupId == null ? null : dsGroupId.trim();
    }

    /**
     * 分组值
     * @return java.lang.String
     **/
    public String getDsGroupValue() {
        return dsGroupValue;
    }

    /**
     * 分组值
     * @param dsGroupValue 分组值
     **/
    public void setDsGroupValue(String dsGroupValue) {
        this.dsGroupValue = dsGroupValue == null ? null : dsGroupValue.trim();
    }

    /**
     * 分组名称
     * @return java.lang.String
     **/
    public String getDsGroupText() {
        return dsGroupText;
    }

    /**
     * 分组名称
     * @param dsGroupText 分组名称
     **/
    public void setDsGroupText(String dsGroupText) {
        this.dsGroupText = dsGroupText == null ? null : dsGroupText.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getDsGroupOrderNum() {
        return dsGroupOrderNum;
    }

    /**
     * 排序号
     * @param dsGroupOrderNum 排序号
     **/
    public void setDsGroupOrderNum(Integer dsGroupOrderNum) {
        this.dsGroupOrderNum = dsGroupOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getDsGroupCreateTime() {
        return dsGroupCreateTime;
    }

    /**
     * 创建时间
     * @param dsGroupCreateTime 创建时间
     **/
    public void setDsGroupCreateTime(Date dsGroupCreateTime) {
        this.dsGroupCreateTime = dsGroupCreateTime;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getDsGroupDesc() {
        return dsGroupDesc;
    }

    /**
     * 备注
     * @param dsGroupDesc 备注
     **/
    public void setDsGroupDesc(String dsGroupDesc) {
        this.dsGroupDesc = dsGroupDesc == null ? null : dsGroupDesc.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getDsGroupStatus() {
        return dsGroupStatus;
    }

    /**
     * 状态
     * @param dsGroupStatus 状态
     **/
    public void setDsGroupStatus(String dsGroupStatus) {
        this.dsGroupStatus = dsGroupStatus == null ? null : dsGroupStatus.trim();
    }

    /**
     * 父节点ID
     * @return java.lang.String
     **/
    public String getDsGroupParentId() {
        return dsGroupParentId;
    }

    /**
     * 父节点ID
     * @param dsGroupParentId 父节点ID
     **/
    public void setDsGroupParentId(String dsGroupParentId) {
        this.dsGroupParentId = dsGroupParentId == null ? null : dsGroupParentId.trim();
    }

    /**
     * 是否系统所有
     * @return java.lang.String
     **/
    public String getDsGroupIsSystem() {
        return dsGroupIsSystem;
    }

    /**
     * 是否系统所有
     * @param dsGroupIsSystem 是否系统所有
     **/
    public void setDsGroupIsSystem(String dsGroupIsSystem) {
        this.dsGroupIsSystem = dsGroupIsSystem == null ? null : dsGroupIsSystem.trim();
    }

    /**
     * 内否进行删除
     * @return java.lang.String
     **/
    public String getDsGroupDelEnable() {
        return dsGroupDelEnable;
    }

    /**
     * 内否进行删除
     * @param dsGroupDelEnable 内否进行删除
     **/
    public void setDsGroupDelEnable(String dsGroupDelEnable) {
        this.dsGroupDelEnable = dsGroupDelEnable == null ? null : dsGroupDelEnable.trim();
    }

    /**
     * 父节点ID列表
     * @return java.lang.String
     **/
    public String getDsGroupPidList() {
        return dsGroupPidList;
    }

    /**
     * 父节点ID列表
     * @param dsGroupPidList 父节点ID列表
     **/
    public void setDsGroupPidList(String dsGroupPidList) {
        this.dsGroupPidList = dsGroupPidList == null ? null : dsGroupPidList.trim();
    }

    /**
     * 子节点数量
     * @return java.lang.Integer
     **/
    public Integer getDsGroupChildCount() {
        return dsGroupChildCount;
    }

    /**
     * 子节点数量
     * @param dsGroupChildCount 子节点数量
     **/
    public void setDsGroupChildCount(Integer dsGroupChildCount) {
        this.dsGroupChildCount = dsGroupChildCount;
    }

    /**
     * 组织ID
     * @return java.lang.String
     **/
    public String getDsGroupOrganId() {
        return dsGroupOrganId;
    }

    /**
     * 组织ID
     * @param dsGroupOrganId 组织ID
     **/
    public void setDsGroupOrganId(String dsGroupOrganId) {
        this.dsGroupOrganId = dsGroupOrganId == null ? null : dsGroupOrganId.trim();
    }

    /**
     * 组织ID名称
     * @return java.lang.String
     **/
    public String getDsGroupOrganName() {
        return dsGroupOrganName;
    }

    /**
     * 组织ID名称
     * @param dsGroupOrganName 组织ID名称
     **/
    public void setDsGroupOrganName(String dsGroupOrganName) {
        this.dsGroupOrganName = dsGroupOrganName == null ? null : dsGroupOrganName.trim();
    }
}