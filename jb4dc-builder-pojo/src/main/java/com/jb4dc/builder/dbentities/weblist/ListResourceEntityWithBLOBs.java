package com.jb4dc.builder.dbentities.weblist;

import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tbuild_list_resource
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ListResourceEntityWithBLOBs extends ListResourceEntity {
    //LIST_HTML_SOURCE:原始的HTML
    private String listHtmlSource;

    //LIST_HTML_RESOLVE:解析后的HTML
    private String listHtmlResolve;

    //LIST_JS_CONTENT:JS编辑器中的内容
    private String listJsContent;

    //LIST_CSS_CONTENT:CSS编辑器中的内容
    private String listCssContent;

    //LIST_CONFIG_CONTENT:配置编辑器中的内容
    private String listConfigContent;

    //LIST_DESIGN_REMARK:设计详细说明
    private String listDesignRemark;

    public ListResourceEntityWithBLOBs(String listId, String listCode, String listName, String listSingleName, Date listCreateTime, String listCreator, Date listUpdateTime, String listUpdater, String listType, String listIsSystem, Integer listOrderNum, String listDesc, String listModuleId, String listStatus, String listOrganId, String listOrganName, String listDatasetId, String listDatasetName, Integer listDatasetPageSize, String listIsResolve, String listEveryTimeResolve, String listEnableSSear, String listEnableCSear, String listTheme, String listCustServerRenderer, String listCustRefJs, String listCustClientRenderer, String listCustDesc, String listDatasetPrimaryKey, String listHtmlSource, String listHtmlResolve, String listJsContent, String listCssContent, String listConfigContent, String listDesignRemark) {
        super(listId, listCode, listName, listSingleName, listCreateTime, listCreator, listUpdateTime, listUpdater, listType, listIsSystem, listOrderNum, listDesc, listModuleId, listStatus, listOrganId, listOrganName, listDatasetId, listDatasetName, listDatasetPageSize, listIsResolve, listEveryTimeResolve, listEnableSSear, listEnableCSear, listTheme, listCustServerRenderer, listCustRefJs, listCustClientRenderer, listCustDesc, listDatasetPrimaryKey);
        this.listHtmlSource = listHtmlSource;
        this.listHtmlResolve = listHtmlResolve;
        this.listJsContent = listJsContent;
        this.listCssContent = listCssContent;
        this.listConfigContent = listConfigContent;
        this.listDesignRemark = listDesignRemark;
    }

    public ListResourceEntityWithBLOBs() {
        super();
    }

    public String getListHtmlSource() {
        return listHtmlSource;
    }

    public void setListHtmlSource(String listHtmlSource) {
        this.listHtmlSource = listHtmlSource == null ? null : listHtmlSource.trim();
    }

    public String getListHtmlResolve() {
        return listHtmlResolve;
    }

    public void setListHtmlResolve(String listHtmlResolve) {
        this.listHtmlResolve = listHtmlResolve == null ? null : listHtmlResolve.trim();
    }

    public String getListJsContent() {
        return listJsContent;
    }

    public void setListJsContent(String listJsContent) {
        this.listJsContent = listJsContent == null ? null : listJsContent.trim();
    }

    public String getListCssContent() {
        return listCssContent;
    }

    public void setListCssContent(String listCssContent) {
        this.listCssContent = listCssContent == null ? null : listCssContent.trim();
    }

    public String getListConfigContent() {
        return listConfigContent;
    }

    public void setListConfigContent(String listConfigContent) {
        this.listConfigContent = listConfigContent == null ? null : listConfigContent.trim();
    }

    public String getListDesignRemark() {
        return listDesignRemark;
    }

    public void setListDesignRemark(String listDesignRemark) {
        this.listDesignRemark = listDesignRemark == null ? null : listDesignRemark.trim();
    }
}