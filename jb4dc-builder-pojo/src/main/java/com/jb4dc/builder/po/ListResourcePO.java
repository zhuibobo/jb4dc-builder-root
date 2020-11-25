package com.jb4dc.builder.po;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntity;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntityWithBLOBs;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/7
 * To change this template use File | Settings | File Templates.
 */

public class ListResourcePO extends ListResourceEntityWithBLOBs implements Serializable {

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

    public ListResourcePO() {
    }

    public ListResourcePO(ListResourceEntityWithBLOBs source, String listHtmlRuntime, String listJsRuntime ) {

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
        this.setListDatasetPrimaryKey(source.getListDatasetPrimaryKey());

        this.listHtmlRuntime = listHtmlRuntime;
        this.listJsRuntime=listJsRuntime;
    }

    private Map<String,Object> exData=new HashMap<>();

    public Map<String, Object> getExData() {
        return exData;
    }

    public void addNewExData(String key, Object value){
        exData.put(key,value);
    }

    /*public static ListResourcePO parseToPO(ListResourceEntity entity) throws IOException, JsonProcessingException {
        String jsonStr= JsonUtility.toObjectString(entity);
        return JsonUtility.toObject(jsonStr, ListResourcePO.class);
    }

    public static List<ListResourcePO> parseToPOList(List<ListResourceEntity> entityList) throws IOException, JsonProcessingException {
        if(entityList==null){
            return new ArrayList<>();
        }
        String jsonStr= JsonUtility.toObjectString(entityList);
        return JsonUtility.toObjectListIgnoreProp(jsonStr, ListResourcePO.class);
    }*/
}
