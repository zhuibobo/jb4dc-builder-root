package com.jb4dc.builder.po;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntity;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/12/8
 * To change this template use File | Settings | File Templates.
 */
public class TablePO extends TableEntity {
    List<TableFieldPO> tableFieldPOList;

    boolean isMain;

    public List<TableFieldPO> getTableFieldPOList() {
        return tableFieldPOList;
    }

    public void setTableFieldPOList(List<TableFieldPO> tableFieldPOList) {
        this.tableFieldPOList = tableFieldPOList;
    }

    public boolean isMain() {
        return isMain;
    }

    public void setMain(boolean main) {
        isMain = main;
    }

    /*public static TablePO parseToPO(TableEntity entity) throws IOException {
        String jsonStr= JsonUtility.toObjectString(entity);
        return JsonUtility.toObject(jsonStr, TablePO.class);
    }

    public static List<TablePO> parseToPOList(List<TableEntity> entityList) throws IOException {
        if(entityList==null){
            return new ArrayList<>();
        }
        String jsonStr= JsonUtility.toObjectString(entityList);
        return JsonUtility.toObjectListIgnoreProp(jsonStr, TablePO.class);
    }*/
}
