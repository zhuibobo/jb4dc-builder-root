package com.jb4dc.builder.po;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/22
 * To change this template use File | Settings | File Templates.
 */
public class FormDataRelationPO {
    String id;
    String parentId;
    String singleName;
    String pkFieldName;
    String desc;
    String selfKeyFieldName;
    String outerKeyFieldName;
    String relationType;
    String isSave;
    String condition;
    String tableId;
    String tableName;
    String tableCaption;
    String tableCode;
    String displayText;
    String icon;

    List<Map> dataRecordList=new ArrayList<>();

    public void addDataRecord(Map record){
        this.dataRecordList.add(record);
    }

    public List<Map> getDataRecordList() {
        return dataRecordList;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getSingleName() {
        return singleName;
    }

    public void setSingleName(String singleName) {
        this.singleName = singleName;
    }

    public String getPkFieldName() {
        return pkFieldName;
    }

    public void setPkFieldName(String pkFieldName) {
        this.pkFieldName = pkFieldName;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getSelfKeyFieldName() {
        return selfKeyFieldName;
    }

    public void setSelfKeyFieldName(String selfKeyFieldName) {
        this.selfKeyFieldName = selfKeyFieldName;
    }

    public String getOuterKeyFieldName() {
        return outerKeyFieldName;
    }

    public void setOuterKeyFieldName(String outerKeyFieldName) {
        this.outerKeyFieldName = outerKeyFieldName;
    }

    public String getRelationType() {
        return relationType;
    }

    public void setRelationType(String relationType) {
        this.relationType = relationType;
    }

    public String getIsSave() {
        return isSave;
    }

    public void setIsSave(String isSave) {
        this.isSave = isSave;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getTableId() {
        return tableId;
    }

    public void setTableId(String tableId) {
        this.tableId = tableId;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getTableCaption() {
        return tableCaption;
    }

    public void setTableCaption(String tableCaption) {
        this.tableCaption = tableCaption;
    }

    public String getTableCode() {
        return tableCode;
    }

    public void setTableCode(String tableCode) {
        this.tableCode = tableCode;
    }

    public String getDisplayText() {
        return displayText;
    }

    public void setDisplayText(String displayText) {
        this.displayText = displayText;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
