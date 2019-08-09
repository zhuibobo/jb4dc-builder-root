package com.jb4dc.builder.po;

import com.jb4dc.builder.dbentities.datastorage.TableEntity;

import java.util.List;

public class UpdateTableResolvePO {
    private TableEntity oldTableEntity;
    private TableEntity newTableEntity;

    List<TableFieldPO> deleteFields;
    List<TableFieldPO> newFields;
    List<TableFieldPO> updateFields;

    List<TableFieldPO> newTableFieldPOList;
    List<TableFieldPO> oldTableFieldPOList;

    public TableEntity getOldTableEntity() {
        return oldTableEntity;
    }

    public void setOldTableEntity(TableEntity oldTableEntity) {
        this.oldTableEntity = oldTableEntity;
    }

    public TableEntity getNewTableEntity() {
        return newTableEntity;
    }

    public void setNewTableEntity(TableEntity newTableEntity) {
        this.newTableEntity = newTableEntity;
    }

    public List<TableFieldPO> getDeleteFields() {
        return deleteFields;
    }

    public void setDeleteFields(List<TableFieldPO> deleteFields) {
        this.deleteFields = deleteFields;
    }

    public List<TableFieldPO> getNewFields() {
        return newFields;
    }

    public void setNewFields(List<TableFieldPO> newFields) {
        this.newFields = newFields;
    }

    public List<TableFieldPO> getUpdateFields() {
        return updateFields;
    }

    public void setUpdateFields(List<TableFieldPO> updateFields) {
        this.updateFields = updateFields;
    }

    public List<TableFieldPO> getNewTableFieldPOList() {
        return newTableFieldPOList;
    }

    public void setNewTableFieldPOList(List<TableFieldPO> newTableFieldPOList) {
        this.newTableFieldPOList = newTableFieldPOList;
    }

    public List<TableFieldPO> getOldTableFieldPOList() {
        return oldTableFieldPOList;
    }

    public void setOldTableFieldPOList(List<TableFieldPO> oldTableFieldPOList) {
        this.oldTableFieldPOList = oldTableFieldPOList;
    }
}
