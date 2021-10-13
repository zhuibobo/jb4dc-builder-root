package com.jb4dc.portlet.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :portlet_widget
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class WidgetEntity {
    //WIDGET_ID:
    @DBKeyField
    private String widgetId;

    //WIDGET_GROUP_ID:所属分组
    private String widgetGroupId;

    //WIDGET_TITLE:WIDGET标题:作为页面显示时的标题
    private String widgetTitle;

    //WIDGET_NAME:WIDGET名称:任意值,开发使用
    private String widgetName;

    //WIDGET_DESC:WIDGET备注
    private String widgetDesc;

    //WIDGET_CLIENT_RENDER:WIDGET的客户端对象名称:将通过实例化创建
    private String widgetClientRender;

    //WIDGET_BEF_RENDER:WIDGET渲染前置方法
    private String widgetBefRender;

    //WIDGET_AFT_RENDER:WIDGET渲染后置方法
    private String widgetAftRender;

    //WIDGET_UPDATE_TIME:WIDGET更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date widgetUpdateTime;

    //WIDGET_UPDATER:WIDGET更新人
    private String widgetUpdater;

    //WIDGET_STATUS:状态:启用;禁用
    private String widgetStatus;

    //WIDGET_ORDER_NUM:排序号
    private Integer widgetOrderNum;

    //WIDGET_PROPERTIES:WIDGET相关配置属性
    private String widgetProperties;

    /**
     * 构造函数
     * @param widgetId
     * @param widgetGroupId 所属分组
     * @param widgetTitle WIDGET标题
     * @param widgetName WIDGET名称
     * @param widgetDesc WIDGET备注
     * @param widgetClientRender WIDGET的客户端对象名称
     * @param widgetBefRender WIDGET渲染前置方法
     * @param widgetAftRender WIDGET渲染后置方法
     * @param widgetUpdateTime WIDGET更新时间
     * @param widgetUpdater WIDGET更新人
     * @param widgetStatus 状态
     * @param widgetOrderNum 排序号
     **/
    public WidgetEntity(String widgetId, String widgetGroupId, String widgetTitle, String widgetName, String widgetDesc, String widgetClientRender, String widgetBefRender, String widgetAftRender, Date widgetUpdateTime, String widgetUpdater, String widgetStatus, Integer widgetOrderNum) {
        this.widgetId = widgetId;
        this.widgetGroupId = widgetGroupId;
        this.widgetTitle = widgetTitle;
        this.widgetName = widgetName;
        this.widgetDesc = widgetDesc;
        this.widgetClientRender = widgetClientRender;
        this.widgetBefRender = widgetBefRender;
        this.widgetAftRender = widgetAftRender;
        this.widgetUpdateTime = widgetUpdateTime;
        this.widgetUpdater = widgetUpdater;
        this.widgetStatus = widgetStatus;
        this.widgetOrderNum = widgetOrderNum;
    }

    /**
     * 构造函数
     * @param widgetId
     * @param widgetGroupId 所属分组
     * @param widgetTitle WIDGET标题
     * @param widgetName WIDGET名称
     * @param widgetDesc WIDGET备注
     * @param widgetClientRender WIDGET的客户端对象名称
     * @param widgetBefRender WIDGET渲染前置方法
     * @param widgetAftRender WIDGET渲染后置方法
     * @param widgetUpdateTime WIDGET更新时间
     * @param widgetUpdater WIDGET更新人
     * @param widgetStatus 状态
     * @param widgetOrderNum 排序号
     * @param widgetProperties WIDGET相关配置属性
     **/
    public WidgetEntity(String widgetId, String widgetGroupId, String widgetTitle, String widgetName, String widgetDesc, String widgetClientRender, String widgetBefRender, String widgetAftRender, Date widgetUpdateTime, String widgetUpdater, String widgetStatus, Integer widgetOrderNum, String widgetProperties) {
        this.widgetId = widgetId;
        this.widgetGroupId = widgetGroupId;
        this.widgetTitle = widgetTitle;
        this.widgetName = widgetName;
        this.widgetDesc = widgetDesc;
        this.widgetClientRender = widgetClientRender;
        this.widgetBefRender = widgetBefRender;
        this.widgetAftRender = widgetAftRender;
        this.widgetUpdateTime = widgetUpdateTime;
        this.widgetUpdater = widgetUpdater;
        this.widgetStatus = widgetStatus;
        this.widgetOrderNum = widgetOrderNum;
        this.widgetProperties = widgetProperties;
    }

    public WidgetEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getWidgetId() {
        return widgetId;
    }

    /**
     *
     * @param widgetId
     **/
    public void setWidgetId(String widgetId) {
        this.widgetId = widgetId == null ? null : widgetId.trim();
    }

    /**
     * 所属分组
     * @return java.lang.String
     **/
    public String getWidgetGroupId() {
        return widgetGroupId;
    }

    /**
     * 所属分组
     * @param widgetGroupId 所属分组
     **/
    public void setWidgetGroupId(String widgetGroupId) {
        this.widgetGroupId = widgetGroupId == null ? null : widgetGroupId.trim();
    }

    /**
     * WIDGET标题:作为页面显示时的标题
     * @return java.lang.String
     **/
    public String getWidgetTitle() {
        return widgetTitle;
    }

    /**
     * WIDGET标题:作为页面显示时的标题
     * @param widgetTitle WIDGET标题
     **/
    public void setWidgetTitle(String widgetTitle) {
        this.widgetTitle = widgetTitle == null ? null : widgetTitle.trim();
    }

    /**
     * WIDGET名称:任意值,开发使用
     * @return java.lang.String
     **/
    public String getWidgetName() {
        return widgetName;
    }

    /**
     * WIDGET名称:任意值,开发使用
     * @param widgetName WIDGET名称
     **/
    public void setWidgetName(String widgetName) {
        this.widgetName = widgetName == null ? null : widgetName.trim();
    }

    /**
     * WIDGET备注
     * @return java.lang.String
     **/
    public String getWidgetDesc() {
        return widgetDesc;
    }

    /**
     * WIDGET备注
     * @param widgetDesc WIDGET备注
     **/
    public void setWidgetDesc(String widgetDesc) {
        this.widgetDesc = widgetDesc == null ? null : widgetDesc.trim();
    }

    /**
     * WIDGET的客户端对象名称:将通过实例化创建
     * @return java.lang.String
     **/
    public String getWidgetClientRender() {
        return widgetClientRender;
    }

    /**
     * WIDGET的客户端对象名称:将通过实例化创建
     * @param widgetClientRender WIDGET的客户端对象名称
     **/
    public void setWidgetClientRender(String widgetClientRender) {
        this.widgetClientRender = widgetClientRender == null ? null : widgetClientRender.trim();
    }

    /**
     * WIDGET渲染前置方法
     * @return java.lang.String
     **/
    public String getWidgetBefRender() {
        return widgetBefRender;
    }

    /**
     * WIDGET渲染前置方法
     * @param widgetBefRender WIDGET渲染前置方法
     **/
    public void setWidgetBefRender(String widgetBefRender) {
        this.widgetBefRender = widgetBefRender == null ? null : widgetBefRender.trim();
    }

    /**
     * WIDGET渲染后置方法
     * @return java.lang.String
     **/
    public String getWidgetAftRender() {
        return widgetAftRender;
    }

    /**
     * WIDGET渲染后置方法
     * @param widgetAftRender WIDGET渲染后置方法
     **/
    public void setWidgetAftRender(String widgetAftRender) {
        this.widgetAftRender = widgetAftRender == null ? null : widgetAftRender.trim();
    }

    /**
     * WIDGET更新时间
     * @return java.util.Date
     **/
    public Date getWidgetUpdateTime() {
        return widgetUpdateTime;
    }

    /**
     * WIDGET更新时间
     * @param widgetUpdateTime WIDGET更新时间
     **/
    public void setWidgetUpdateTime(Date widgetUpdateTime) {
        this.widgetUpdateTime = widgetUpdateTime;
    }

    /**
     * WIDGET更新人
     * @return java.lang.String
     **/
    public String getWidgetUpdater() {
        return widgetUpdater;
    }

    /**
     * WIDGET更新人
     * @param widgetUpdater WIDGET更新人
     **/
    public void setWidgetUpdater(String widgetUpdater) {
        this.widgetUpdater = widgetUpdater == null ? null : widgetUpdater.trim();
    }

    /**
     * 状态:启用;禁用
     * @return java.lang.String
     **/
    public String getWidgetStatus() {
        return widgetStatus;
    }

    /**
     * 状态:启用;禁用
     * @param widgetStatus 状态
     **/
    public void setWidgetStatus(String widgetStatus) {
        this.widgetStatus = widgetStatus == null ? null : widgetStatus.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getWidgetOrderNum() {
        return widgetOrderNum;
    }

    /**
     * 排序号
     * @param widgetOrderNum 排序号
     **/
    public void setWidgetOrderNum(Integer widgetOrderNum) {
        this.widgetOrderNum = widgetOrderNum;
    }

    /**
     * WIDGET相关配置属性
     * @return java.lang.String
     **/
    public String getWidgetProperties() {
        return widgetProperties;
    }

    /**
     * WIDGET相关配置属性
     * @param widgetProperties WIDGET相关配置属性
     **/
    public void setWidgetProperties(String widgetProperties) {
        this.widgetProperties = widgetProperties == null ? null : widgetProperties.trim();
    }
}