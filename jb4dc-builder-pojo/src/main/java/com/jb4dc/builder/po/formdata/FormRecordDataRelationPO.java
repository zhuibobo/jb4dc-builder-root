package com.jb4dc.builder.po.formdata;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/22
 * To change this template use File | Settings | File Templates.
 */
public class FormRecordDataRelationPO {
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
    String isMain;

    List<FormRecordDataPO> listDataRecord=new ArrayList<>();
    FormRecordDataPO oneDataRecord;

    public String getIsMain() {
        return isMain;
    }

    public void setIsMain(String isMain) {
        this.isMain = isMain;
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

    public FormRecordDataPO getOneDataRecord() {
        return oneDataRecord;
    }

    public void setOneDataRecord(FormRecordDataPO oneDataRecord) {
        this.oneDataRecord = oneDataRecord;
    }

    public void addListDataRecord(FormRecordDataPO record){
        this.listDataRecord.add(record);
    }

    public List<FormRecordDataPO> getListDataRecord() {
        return listDataRecord;
    }

    public void setListDataRecord(List<FormRecordDataPO> listDataRecord) {
        this.listDataRecord = listDataRecord;
    }
}
