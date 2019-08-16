package com.jb4dc.builder.po;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/16
 * To change this template use File | Settings | File Templates.
 */
public class ListQueryPO {
    String operator;
    String value;
    String tableName;
    String fieldName;

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }
}
