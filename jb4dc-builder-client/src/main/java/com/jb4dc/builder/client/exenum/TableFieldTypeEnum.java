package com.jb4dc.builder.client.exenum;

import com.jb4dc.core.base.exception.JBuild4DCBaseException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/31
 * To change this template use File | Settings | File Templates.
 */
public enum TableFieldTypeEnum {
    IntType("整数"),
    NumberType("小数"),
    DataTimeType("日期时间"),
    NVarCharType("字符串"),
    TextType("长字符串");

    private String _nText;
    TableFieldTypeEnum(String _nText) {
        this._nText = _nText;
    }

    public String getText(){
        return this._nText;
    }

    /*public String getValue(){
        return this._nValue;
    }*/

    public static String getJsonString() {
        TableFieldTypeEnum[] fieldTypes = TableFieldTypeEnum.values();
        String result = "[";
        for (int i = 0; i < fieldTypes.length; i++) {
            TableFieldTypeEnum item = fieldTypes[i];
            result += "{Name:'" + item.toString() + "',Value:'" + item._nText + "',Text:'" + item._nText+"'},";
        }
        result=result.substring(0,result.length()-1);
        result += "]";
        return result;
    }

    public static JBuild4DCBaseException NotSupportException(String type) throws JBuild4DCBaseException {
        return new JBuild4DCBaseException(0,"TableFieldTypeEnum.ThrowNotSupportException 不支持当前数据类型！["+type+"]"){};
    }

    public static TableFieldTypeEnum parseText(String text) throws JBuild4DCBaseException {
        if(text.equals(TableFieldTypeEnum.IntType._nText)){
            return TableFieldTypeEnum.IntType;
        }
        else if(text.equals(TableFieldTypeEnum.NumberType._nText)){
            return TableFieldTypeEnum.NumberType;
        }
        else if(text.equals(TableFieldTypeEnum.DataTimeType._nText)){
            return TableFieldTypeEnum.DataTimeType;
        }
        else if(text.equals(TableFieldTypeEnum.NVarCharType._nText)){
            return TableFieldTypeEnum.NVarCharType;
        }
        else if(text.equals(TableFieldTypeEnum.TextType._nText)){
            return TableFieldTypeEnum.TextType;
        }
        throw NotSupportException(text);
    }

    public static TableFieldTypeEnum parseDBTypeTo(String text) throws JBuild4DCBaseException {
        if(text.toUpperCase().equals("NVARCHAR")||text.toUpperCase().equals("VARCHAR")){
            return TableFieldTypeEnum.NVarCharType;
        }
        else if(text.toUpperCase().equals("DATETIME")){
            return TableFieldTypeEnum.DataTimeType;
        }
        else if(text.toUpperCase().equals("INT")){
            return TableFieldTypeEnum.IntType;
        }
        else if(text.toUpperCase().equals("NTEXT")||text.toUpperCase().equals("LONGTEXT")){
            return TableFieldTypeEnum.TextType;
        }
        else if(text.toUpperCase().equals("DECIMAL")){
            return TableFieldTypeEnum.NumberType;
        }
        throw NotSupportException(text);
    }
    /*public static TableFieldTypeEnum parseCode(String _nValue) throws JBuild4DBaseException {
        if(_nValue==TableFieldTypeEnum.IntType._nValue){
            return TableFieldTypeEnum.IntType;
        }
        else if(_nValue==TableFieldTypeEnum.NumberType._nValue) {
            return TableFieldTypeEnum.NumberType;
        }
        else if(_nValue==TableFieldTypeEnum.DataTimeType._nValue) {
            return TableFieldTypeEnum.DataTimeType;
        }
        else if(_nValue==TableFieldTypeEnum.NVarCharType._nValue) {
            return TableFieldTypeEnum.NVarCharType;
        }
        else if(_nValue==TableFieldTypeEnum.TextType._nValue) {
            return TableFieldTypeEnum.TextType;
        }
        throw NotSupportException();
    }*/
}
