package com.jb4dc.builder.po;

import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/17
 * To change this template use File | Settings | File Templates.
 */
public class ResolvedQueryStringPO {
    String whereString;
    Map<String,Object> queryMap;

    public String getWhereString() {
        return whereString;
    }

    public void setWhereString(String whereString) {
        this.whereString = whereString;
    }

    public Map<String, Object> getQueryMap() {
        return queryMap;
    }

    public void setQueryMap(Map<String, Object> queryMap) {
        this.queryMap = queryMap;
    }
}
