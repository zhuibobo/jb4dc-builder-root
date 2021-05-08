package com.jb4dc.builder.po;

import java.util.Map;

public class SQLStringPlaceholderResultPO {
    String sql;
    Map<String,Object> sqlParas;

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    public Map<String, Object> getSqlParas() {
        return sqlParas;
    }

    public void setSqlParas(Map<String, Object> sqlParas) {
        this.sqlParas = sqlParas;
    }
}
