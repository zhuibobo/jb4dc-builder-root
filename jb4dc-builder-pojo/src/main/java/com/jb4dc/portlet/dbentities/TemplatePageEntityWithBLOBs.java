package com.jb4dc.portlet.dbentities;

import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :portlet_template_page
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class TemplatePageEntityWithBLOBs extends TemplatePageEntity {
    //PAGE_CONFIG:页面配置内容:主要包括页面布局等
    private String pageConfig;

    //PAGE_PROPERTIES:页面相关配置属性
    private String pageProperties;

    //PAGE_WIDGET_CONFIG:页面内Widget配置:主要包括Widget位置,相关参数等
    private String pageWidgetConfig;

    public TemplatePageEntityWithBLOBs(String pageId, String pageGroupId, String pageTitle, String pageName, String pageDesc, Date pageUpdateTime, String pageUpdater, String pageRefJsConfig, String pageRefCssConfig, String pageBefRender, String pageAftRender, String pageWidgetBefRender, String pageWidgetAftRender, String pageStatus, Integer pageOrderNum, String pageConfig, String pageProperties, String pageWidgetConfig) {
        super(pageId, pageGroupId, pageTitle, pageName, pageDesc, pageUpdateTime, pageUpdater, pageRefJsConfig, pageRefCssConfig, pageBefRender, pageAftRender, pageWidgetBefRender, pageWidgetAftRender, pageStatus, pageOrderNum);
        this.pageConfig = pageConfig;
        this.pageProperties = pageProperties;
        this.pageWidgetConfig = pageWidgetConfig;
    }

    public TemplatePageEntityWithBLOBs() {
        super();
    }

    public String getPageConfig() {
        return pageConfig;
    }

    public void setPageConfig(String pageConfig) {
        this.pageConfig = pageConfig == null ? null : pageConfig.trim();
    }

    public String getPageProperties() {
        return pageProperties;
    }

    public void setPageProperties(String pageProperties) {
        this.pageProperties = pageProperties == null ? null : pageProperties.trim();
    }

    public String getPageWidgetConfig() {
        return pageWidgetConfig;
    }

    public void setPageWidgetConfig(String pageWidgetConfig) {
        this.pageWidgetConfig = pageWidgetConfig == null ? null : pageWidgetConfig.trim();
    }
}