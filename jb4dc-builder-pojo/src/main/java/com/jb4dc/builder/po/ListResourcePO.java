package com.jb4dc.builder.po;

import com.jb4dc.builder.dbentities.weblist.ListResourceEntity;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/7
 * To change this template use File | Settings | File Templates.
 */
public class ListResourcePO extends ListResourceEntity {

    private String listHtmlRuntime;

    public String getListHtmlRuntime() {
        return listHtmlRuntime;
    }

    public void setListHtmlRuntime(String listHtmlRuntime) {
        this.listHtmlRuntime = listHtmlRuntime;
    }

    private String listJsRuntime;

    public String getListJsRuntime() {
        return listJsRuntime;
    }

    public void setListJsRuntime(String listJsRuntime) {
        this.listJsRuntime = listJsRuntime;
    }

    public ListResourcePO(ListResourceEntity source, String listHtmlRuntime,String listJsRuntime) {

        this.setListId(source.getListId());
        this.setListCode(source.getListCode());
        this.setListName(source.getListName());
        this.setListSingleName(source.getListSingleName());
        this.setListCreateTime(source.getListCreateTime());
        this.setListCreator(source.getListCreator());
        this.setListUpdateTime(source.getListUpdateTime());
        this.setListUpdater(source.getListUpdater());
        this.setListType(source.getListType());
        this.setListIsSystem(source.getListIsSystem());
        this.setListOrderNum(source.getListOrderNum());
        this.setListDesc(source.getListDesc());
        this.setListModuleId(source.getListModuleId());
        this.setListStatus(source.getListStatus());
        this.setListOrganId(source.getListOrganId());
        this.setListOrganName(source.getListOrganName());
        this.setListDatasetId(source.getListDatasetId());
        this.setListDatasetName(source.getListDatasetName());
        this.setListDatasetPageSize(source.getListDatasetPageSize());
        this.setListIsResolve(source.getListIsResolve());
        this.setListEveryTimeResolve(source.getListEveryTimeResolve());
        this.setListHtmlSource(source.getListHtmlSource());
        this.setListHtmlResolve(source.getListHtmlResolve());
        this.setListJsContent(source.getListJsContent());
        this.setListCssContent(source.getListCssContent());
        this.setListConfigContent(source.getListConfigContent());
        this.setListEnableSSear(source.getListEnableSSear());
        this.setListEnableCSear(source.getListEnableCSear());
        this.setListTheme(source.getListTheme());
        this.setListCustServerRenderer(source.getListCustServerRenderer());
        this.setListCustRefJs(source.getListCustRefJs());
        this.setListCustClientRenderer(source.getListCustClientRenderer());
        this.setListCustDesc(source.getListCustDesc());

        this.listHtmlRuntime = listHtmlRuntime;
        this.listJsRuntime=listJsRuntime;
    }
}
