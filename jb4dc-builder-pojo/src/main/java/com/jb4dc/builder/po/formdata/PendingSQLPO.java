package com.jb4dc.builder.po.formdata;

import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/1
 * To change this template use File | Settings | File Templates.
 */
public class PendingSQLPO {
    public static String EXEC_TYPE_INSERT="insert";
    public static String EXEC_TYPE_UPDATE="update";
    public static String EXEC_TYPE_SELECT="select";
    public static String EXEC_TYPE_DEL="delete";

    String execType;
    String sql;
    Map<String,Object> sqlPara;

    public String getExecType() {
        return execType;
    }

    public void setExecType(String execType) {
        this.execType = execType;
    }

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    public Map<String, Object> getSqlPara() {
        return sqlPara;
    }

    public void setSqlPara(Map<String, Object> sqlPara) {
        this.sqlPara = sqlPara;
    }
}
