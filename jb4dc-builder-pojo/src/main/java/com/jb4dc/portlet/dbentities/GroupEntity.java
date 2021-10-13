package com.jb4dc.portlet.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :portlet_group
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class GroupEntity {
    //PORTLET_GROUP_ID:
    @DBKeyField
    private String portletGroupId;

    //PORTLET_GROUP_TYPE:分组类型:PageGroup;WidgetGroup
    private String portletGroupType;

    //PORTLET_GROUP_VALUE:分组的键值:必须唯一
    private String portletGroupValue;

    //PORTLET_GROUP_TEXT:分组的名称
    private String portletGroupText;

    //PORTLET_GROUP_ORDER_NUM:排序号
    private Integer portletGroupOrderNum;

    //PORTLET_GROUP_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date portletGroupCreateTime;

    //PORTLET_GROUP_DESC:备注
    private String portletGroupDesc;

    //PORTLET_GROUP_STATUS:状态:启用;禁用
    private String portletGroupStatus;

    //PORTLET_GROUP_PARENT_ID:父节点的ID
    private String portletGroupParentId;

    //PORTLET_GROUP_DEL_ENABLE:能否删除
    private String portletGroupDelEnable;

    /**
     * 构造函数
     * @param portletGroupId
     * @param portletGroupType 分组类型
     * @param portletGroupValue 分组的键值
     * @param portletGroupText 分组的名称
     * @param portletGroupOrderNum 排序号
     * @param portletGroupCreateTime 创建时间
     * @param portletGroupDesc 备注
     * @param portletGroupStatus 状态
     * @param portletGroupParentId 父节点的ID
     * @param portletGroupDelEnable 能否删除
     **/
    public GroupEntity(String portletGroupId, String portletGroupType, String portletGroupValue, String portletGroupText, Integer portletGroupOrderNum, Date portletGroupCreateTime, String portletGroupDesc, String portletGroupStatus, String portletGroupParentId, String portletGroupDelEnable) {
        this.portletGroupId = portletGroupId;
        this.portletGroupType = portletGroupType;
        this.portletGroupValue = portletGroupValue;
        this.portletGroupText = portletGroupText;
        this.portletGroupOrderNum = portletGroupOrderNum;
        this.portletGroupCreateTime = portletGroupCreateTime;
        this.portletGroupDesc = portletGroupDesc;
        this.portletGroupStatus = portletGroupStatus;
        this.portletGroupParentId = portletGroupParentId;
        this.portletGroupDelEnable = portletGroupDelEnable;
    }

    public GroupEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getPortletGroupId() {
        return portletGroupId;
    }

    /**
     *
     * @param portletGroupId
     **/
    public void setPortletGroupId(String portletGroupId) {
        this.portletGroupId = portletGroupId == null ? null : portletGroupId.trim();
    }

    /**
     * 分组类型:PageGroup;WidgetGroup
     * @return java.lang.String
     **/
    public String getPortletGroupType() {
        return portletGroupType;
    }

    /**
     * 分组类型:PageGroup;WidgetGroup
     * @param portletGroupType 分组类型
     **/
    public void setPortletGroupType(String portletGroupType) {
        this.portletGroupType = portletGroupType == null ? null : portletGroupType.trim();
    }

    /**
     * 分组的键值:必须唯一
     * @return java.lang.String
     **/
    public String getPortletGroupValue() {
        return portletGroupValue;
    }

    /**
     * 分组的键值:必须唯一
     * @param portletGroupValue 分组的键值
     **/
    public void setPortletGroupValue(String portletGroupValue) {
        this.portletGroupValue = portletGroupValue == null ? null : portletGroupValue.trim();
    }

    /**
     * 分组的名称
     * @return java.lang.String
     **/
    public String getPortletGroupText() {
        return portletGroupText;
    }

    /**
     * 分组的名称
     * @param portletGroupText 分组的名称
     **/
    public void setPortletGroupText(String portletGroupText) {
        this.portletGroupText = portletGroupText == null ? null : portletGroupText.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getPortletGroupOrderNum() {
        return portletGroupOrderNum;
    }

    /**
     * 排序号
     * @param portletGroupOrderNum 排序号
     **/
    public void setPortletGroupOrderNum(Integer portletGroupOrderNum) {
        this.portletGroupOrderNum = portletGroupOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getPortletGroupCreateTime() {
        return portletGroupCreateTime;
    }

    /**
     * 创建时间
     * @param portletGroupCreateTime 创建时间
     **/
    public void setPortletGroupCreateTime(Date portletGroupCreateTime) {
        this.portletGroupCreateTime = portletGroupCreateTime;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getPortletGroupDesc() {
        return portletGroupDesc;
    }

    /**
     * 备注
     * @param portletGroupDesc 备注
     **/
    public void setPortletGroupDesc(String portletGroupDesc) {
        this.portletGroupDesc = portletGroupDesc == null ? null : portletGroupDesc.trim();
    }

    /**
     * 状态:启用;禁用
     * @return java.lang.String
     **/
    public String getPortletGroupStatus() {
        return portletGroupStatus;
    }

    /**
     * 状态:启用;禁用
     * @param portletGroupStatus 状态
     **/
    public void setPortletGroupStatus(String portletGroupStatus) {
        this.portletGroupStatus = portletGroupStatus == null ? null : portletGroupStatus.trim();
    }

    /**
     * 父节点的ID
     * @return java.lang.String
     **/
    public String getPortletGroupParentId() {
        return portletGroupParentId;
    }

    /**
     * 父节点的ID
     * @param portletGroupParentId 父节点的ID
     **/
    public void setPortletGroupParentId(String portletGroupParentId) {
        this.portletGroupParentId = portletGroupParentId == null ? null : portletGroupParentId.trim();
    }

    /**
     * 能否删除
     * @return java.lang.String
     **/
    public String getPortletGroupDelEnable() {
        return portletGroupDelEnable;
    }

    /**
     * 能否删除
     * @param portletGroupDelEnable 能否删除
     **/
    public void setPortletGroupDelEnable(String portletGroupDelEnable) {
        this.portletGroupDelEnable = portletGroupDelEnable == null ? null : portletGroupDelEnable.trim();
    }
}