package com.jb4dc.portlet.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :portlet_template_page
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class TemplatePageEntity {
    //PAGE_ID:
    @DBKeyField
    private String pageId;

    //PAGE_GROUP_ID:所属分组
    private String pageGroupId;

    //PAGE_TITLE:页面标题
    private String pageTitle;

    //PAGE_NAME:页面标题:任意值,开发使用
    private String pageName;

    //PAGE_DESC:页面备注
    private String pageDesc;

    //PAGE_UPDATE_TIME:页面更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date pageUpdateTime;

    //PAGE_UPDATER:页面更新人
    private String pageUpdater;

    //PAGE_REF_JS_CONFIG:引入的JS文件
    private String pageRefJsConfig;

    //PAGE_REF_CSS_CONFIG:引入的CSS文件
    private String pageRefCssConfig;

    //PAGE_BEF_RENDER:页面渲染前置方法
    private String pageBefRender;

    //PAGE_AFT_RENDER:页面渲染后置方法
    private String pageAftRender;

    //PAGE_WIDGET_BEF_RENDER:全部WIDGET渲染前置方法
    private String pageWidgetBefRender;

    //PAGE_WIDGET_AFT_RENDER:全部WIDGET渲染后置方法
    private String pageWidgetAftRender;

    //PAGE_STATUS:状态:启用;禁用
    private String pageStatus;

    //PAGE_ORDER_NUM:排序号
    private Integer pageOrderNum;

    /**
     * 构造函数
     * @param pageId
     * @param pageGroupId 所属分组
     * @param pageTitle 页面标题
     * @param pageName 页面标题
     * @param pageDesc 页面备注
     * @param pageUpdateTime 页面更新时间
     * @param pageUpdater 页面更新人
     * @param pageRefJsConfig 引入的JS文件
     * @param pageRefCssConfig 引入的CSS文件
     * @param pageBefRender 页面渲染前置方法
     * @param pageAftRender 页面渲染后置方法
     * @param pageWidgetBefRender 全部WIDGET渲染前置方法
     * @param pageWidgetAftRender 全部WIDGET渲染后置方法
     * @param pageStatus 状态
     * @param pageOrderNum 排序号
     **/
    public TemplatePageEntity(String pageId, String pageGroupId, String pageTitle, String pageName, String pageDesc, Date pageUpdateTime, String pageUpdater, String pageRefJsConfig, String pageRefCssConfig, String pageBefRender, String pageAftRender, String pageWidgetBefRender, String pageWidgetAftRender, String pageStatus, Integer pageOrderNum) {
        this.pageId = pageId;
        this.pageGroupId = pageGroupId;
        this.pageTitle = pageTitle;
        this.pageName = pageName;
        this.pageDesc = pageDesc;
        this.pageUpdateTime = pageUpdateTime;
        this.pageUpdater = pageUpdater;
        this.pageRefJsConfig = pageRefJsConfig;
        this.pageRefCssConfig = pageRefCssConfig;
        this.pageBefRender = pageBefRender;
        this.pageAftRender = pageAftRender;
        this.pageWidgetBefRender = pageWidgetBefRender;
        this.pageWidgetAftRender = pageWidgetAftRender;
        this.pageStatus = pageStatus;
        this.pageOrderNum = pageOrderNum;
    }

    public TemplatePageEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getPageId() {
        return pageId;
    }

    /**
     *
     * @param pageId
     **/
    public void setPageId(String pageId) {
        this.pageId = pageId == null ? null : pageId.trim();
    }

    /**
     * 所属分组
     * @return java.lang.String
     **/
    public String getPageGroupId() {
        return pageGroupId;
    }

    /**
     * 所属分组
     * @param pageGroupId 所属分组
     **/
    public void setPageGroupId(String pageGroupId) {
        this.pageGroupId = pageGroupId == null ? null : pageGroupId.trim();
    }

    /**
     * 页面标题
     * @return java.lang.String
     **/
    public String getPageTitle() {
        return pageTitle;
    }

    /**
     * 页面标题
     * @param pageTitle 页面标题
     **/
    public void setPageTitle(String pageTitle) {
        this.pageTitle = pageTitle == null ? null : pageTitle.trim();
    }

    /**
     * 页面标题:任意值,开发使用
     * @return java.lang.String
     **/
    public String getPageName() {
        return pageName;
    }

    /**
     * 页面标题:任意值,开发使用
     * @param pageName 页面标题
     **/
    public void setPageName(String pageName) {
        this.pageName = pageName == null ? null : pageName.trim();
    }

    /**
     * 页面备注
     * @return java.lang.String
     **/
    public String getPageDesc() {
        return pageDesc;
    }

    /**
     * 页面备注
     * @param pageDesc 页面备注
     **/
    public void setPageDesc(String pageDesc) {
        this.pageDesc = pageDesc == null ? null : pageDesc.trim();
    }

    /**
     * 页面更新时间
     * @return java.util.Date
     **/
    public Date getPageUpdateTime() {
        return pageUpdateTime;
    }

    /**
     * 页面更新时间
     * @param pageUpdateTime 页面更新时间
     **/
    public void setPageUpdateTime(Date pageUpdateTime) {
        this.pageUpdateTime = pageUpdateTime;
    }

    /**
     * 页面更新人
     * @return java.lang.String
     **/
    public String getPageUpdater() {
        return pageUpdater;
    }

    /**
     * 页面更新人
     * @param pageUpdater 页面更新人
     **/
    public void setPageUpdater(String pageUpdater) {
        this.pageUpdater = pageUpdater == null ? null : pageUpdater.trim();
    }

    /**
     * 引入的JS文件
     * @return java.lang.String
     **/
    public String getPageRefJsConfig() {
        return pageRefJsConfig;
    }

    /**
     * 引入的JS文件
     * @param pageRefJsConfig 引入的JS文件
     **/
    public void setPageRefJsConfig(String pageRefJsConfig) {
        this.pageRefJsConfig = pageRefJsConfig == null ? null : pageRefJsConfig.trim();
    }

    /**
     * 引入的CSS文件
     * @return java.lang.String
     **/
    public String getPageRefCssConfig() {
        return pageRefCssConfig;
    }

    /**
     * 引入的CSS文件
     * @param pageRefCssConfig 引入的CSS文件
     **/
    public void setPageRefCssConfig(String pageRefCssConfig) {
        this.pageRefCssConfig = pageRefCssConfig == null ? null : pageRefCssConfig.trim();
    }

    /**
     * 页面渲染前置方法
     * @return java.lang.String
     **/
    public String getPageBefRender() {
        return pageBefRender;
    }

    /**
     * 页面渲染前置方法
     * @param pageBefRender 页面渲染前置方法
     **/
    public void setPageBefRender(String pageBefRender) {
        this.pageBefRender = pageBefRender == null ? null : pageBefRender.trim();
    }

    /**
     * 页面渲染后置方法
     * @return java.lang.String
     **/
    public String getPageAftRender() {
        return pageAftRender;
    }

    /**
     * 页面渲染后置方法
     * @param pageAftRender 页面渲染后置方法
     **/
    public void setPageAftRender(String pageAftRender) {
        this.pageAftRender = pageAftRender == null ? null : pageAftRender.trim();
    }

    /**
     * 全部WIDGET渲染前置方法
     * @return java.lang.String
     **/
    public String getPageWidgetBefRender() {
        return pageWidgetBefRender;
    }

    /**
     * 全部WIDGET渲染前置方法
     * @param pageWidgetBefRender 全部WIDGET渲染前置方法
     **/
    public void setPageWidgetBefRender(String pageWidgetBefRender) {
        this.pageWidgetBefRender = pageWidgetBefRender == null ? null : pageWidgetBefRender.trim();
    }

    /**
     * 全部WIDGET渲染后置方法
     * @return java.lang.String
     **/
    public String getPageWidgetAftRender() {
        return pageWidgetAftRender;
    }

    /**
     * 全部WIDGET渲染后置方法
     * @param pageWidgetAftRender 全部WIDGET渲染后置方法
     **/
    public void setPageWidgetAftRender(String pageWidgetAftRender) {
        this.pageWidgetAftRender = pageWidgetAftRender == null ? null : pageWidgetAftRender.trim();
    }

    /**
     * 状态:启用;禁用
     * @return java.lang.String
     **/
    public String getPageStatus() {
        return pageStatus;
    }

    /**
     * 状态:启用;禁用
     * @param pageStatus 状态
     **/
    public void setPageStatus(String pageStatus) {
        this.pageStatus = pageStatus == null ? null : pageStatus.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getPageOrderNum() {
        return pageOrderNum;
    }

    /**
     * 排序号
     * @param pageOrderNum 排序号
     **/
    public void setPageOrderNum(Integer pageOrderNum) {
        this.pageOrderNum = pageOrderNum;
    }
}