package com.jb4dc.builder.dbentities.dataset;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_DATASET_RELATED_TABLE
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class DatasetRelatedTableEntity {
    //RT_ID:主键:UUID
    @DBKeyField
    private String rtId;

    //RT_DS_ID:数据集ID
    private String rtDsId;

    //RT_TABLE_NAME:表名
    private String rtTableName;

    //RT_TABLE_CAPTION:表标题
    private String rtTableCaption;

    //RT_TABLE_ID:表ID
    private String rtTableId;

    //RT_TABLE_TYPE:表类型
    private String rtTableType;

    //RT_DESC:备注
    private String rtDesc;

    //RT_ORDER_NUM:排序号
    private Integer rtOrderNum;

    /**
     * 构造函数
     * @param rtId 主键
     * @param rtDsId 数据集ID
     * @param rtTableName 表名
     * @param rtTableCaption 表标题
     * @param rtTableId 表ID
     * @param rtTableType 表类型
     * @param rtDesc 备注
     * @param rtOrderNum 排序号
     **/
    public DatasetRelatedTableEntity(String rtId, String rtDsId, String rtTableName, String rtTableCaption, String rtTableId, String rtTableType, String rtDesc, Integer rtOrderNum) {
        this.rtId = rtId;
        this.rtDsId = rtDsId;
        this.rtTableName = rtTableName;
        this.rtTableCaption = rtTableCaption;
        this.rtTableId = rtTableId;
        this.rtTableType = rtTableType;
        this.rtDesc = rtDesc;
        this.rtOrderNum = rtOrderNum;
    }

    public DatasetRelatedTableEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getRtId() {
        return rtId;
    }

    /**
     * 主键:UUID
     * @param rtId 主键
     **/
    public void setRtId(String rtId) {
        this.rtId = rtId == null ? null : rtId.trim();
    }

    /**
     * 数据集ID
     * @return java.lang.String
     **/
    public String getRtDsId() {
        return rtDsId;
    }

    /**
     * 数据集ID
     * @param rtDsId 数据集ID
     **/
    public void setRtDsId(String rtDsId) {
        this.rtDsId = rtDsId == null ? null : rtDsId.trim();
    }

    /**
     * 表名
     * @return java.lang.String
     **/
    public String getRtTableName() {
        return rtTableName;
    }

    /**
     * 表名
     * @param rtTableName 表名
     **/
    public void setRtTableName(String rtTableName) {
        this.rtTableName = rtTableName == null ? null : rtTableName.trim();
    }

    /**
     * 表标题
     * @return java.lang.String
     **/
    public String getRtTableCaption() {
        return rtTableCaption;
    }

    /**
     * 表标题
     * @param rtTableCaption 表标题
     **/
    public void setRtTableCaption(String rtTableCaption) {
        this.rtTableCaption = rtTableCaption == null ? null : rtTableCaption.trim();
    }

    /**
     * 表ID
     * @return java.lang.String
     **/
    public String getRtTableId() {
        return rtTableId;
    }

    /**
     * 表ID
     * @param rtTableId 表ID
     **/
    public void setRtTableId(String rtTableId) {
        this.rtTableId = rtTableId == null ? null : rtTableId.trim();
    }

    /**
     * 表类型
     * @return java.lang.String
     **/
    public String getRtTableType() {
        return rtTableType;
    }

    /**
     * 表类型
     * @param rtTableType 表类型
     **/
    public void setRtTableType(String rtTableType) {
        this.rtTableType = rtTableType == null ? null : rtTableType.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getRtDesc() {
        return rtDesc;
    }

    /**
     * 备注
     * @param rtDesc 备注
     **/
    public void setRtDesc(String rtDesc) {
        this.rtDesc = rtDesc == null ? null : rtDesc.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getRtOrderNum() {
        return rtOrderNum;
    }

    /**
     * 排序号
     * @param rtOrderNum 排序号
     **/
    public void setRtOrderNum(Integer rtOrderNum) {
        this.rtOrderNum = rtOrderNum;
    }
}