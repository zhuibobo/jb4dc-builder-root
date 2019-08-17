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

    public static String ConvertSQLOperation(ListQueryPO listQueryPO) {
        if(listQueryPO.operator.equals("eq")){
            return " = ";
        }
        else if(listQueryPO.operator.equals("like")||listQueryPO.operator.equals("left_like")||listQueryPO.operator.equals("right_like")){
            return " like ";
        }
        else if(listQueryPO.operator.equals("not_eq")){
            return " <> ";
        }
        else if(listQueryPO.operator.equals("gt")){
            return " > ";
        }
        else if(listQueryPO.operator.equals("gt_eq")){
            return " >= ";
        }
        else if(listQueryPO.operator.equals("lt")){
            return " < ";
        }
        else if(listQueryPO.operator.equals("lt_eq")){
            return " <= ";
        }
        else if(listQueryPO.operator.equals("include")){
            return " in ";
        }
        return "=";
    }

    public static String ConvertSQLValue(ListQueryPO listQueryPO) {
        if(listQueryPO.operator.equals("like")){
            return "%"+listQueryPO.getValue()+"%";
        }
        else if(listQueryPO.operator.equals("left_like")){
            return "%"+listQueryPO.getValue();
        }
        else if(listQueryPO.operator.equals("right_like")){
            return listQueryPO.getValue()+"%";
        }
        else if(listQueryPO.operator.equals("include")){
            return " ("+listQueryPO.getValue()+") ";
        }
        return listQueryPO.getValue();
    }

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
