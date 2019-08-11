package com.jb4dc.builder.po;

import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/9
 * To change this template use File | Settings | File Templates.
 */
public class QueryDataSetPO {
    String dataSetId;
    int pageSize;
    int pageNum;
    String queryValue;
    String exValue1;
    String exValue2;
    String exValue3;

    public String getDataSetId() {
        return dataSetId;
    }

    public void setDataSetId(String dataSetId) {
        this.dataSetId = dataSetId;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getPageNum() {
        return pageNum;
    }

    public void setPageNum(int pageNum) {
        this.pageNum = pageNum;
    }

    public String getQueryValue() {
        return queryValue;
    }

    public void setQueryValue(String queryValue) {
        this.queryValue = queryValue;
    }

    public String getExValue1() {
        return exValue1;
    }

    public void setExValue1(String exValue1) {
        this.exValue1 = exValue1;
    }

    public String getExValue2() {
        return exValue2;
    }

    public void setExValue2(String exValue2) {
        this.exValue2 = exValue2;
    }

    public String getExValue3() {
        return exValue3;
    }

    public void setExValue3(String exValue3) {
        this.exValue3 = exValue3;
    }
}
