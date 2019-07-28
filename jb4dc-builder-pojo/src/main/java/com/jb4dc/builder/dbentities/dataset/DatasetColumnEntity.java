package com.jb4dc.builder.dbentities.dataset;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_DATASET_COLUMN
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class DatasetColumnEntity {
    //COLUMN_ID:主键:UUID
    @DBKeyField
    private String columnId;

    //COLUMN_DS_ID:所属数据集ID
    private String columnDsId;

    //COLUMN_CAPTION:列标题
    private String columnCaption;

    //COLUMN_NAME:列名
    private String columnName;

    //COLUMN_DATA_TYPE_NAME:数据类型
    private String columnDataTypeName;

    //COLUMN_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date columnCreateTime;

    //COLUMN_CREATOR:创建人
    private String columnCreator;

    //COLUMN_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date columnUpdateTime;

    //COLUMN_UPDATER:更新人
    private String columnUpdater;

    //COLUMN_DESC:备注
    private String columnDesc;

    //COLUMN_DEFAULT_TYPE:默认值类型
    private String columnDefaultType;

    //COLUMN_DEFAULT_VALUE:默认值
    private String columnDefaultValue;

    //COLUMN_DEFAULT_TEXT:默认值描述
    private String columnDefaultText;

    //COLUMN_ORDER_NUM:排序号
    private Integer columnOrderNum;

    //COLUMN_TABLE_NAME:所属表名
    private String columnTableName;

    //COLUMN_IS_CUSTOM:是否自定义
    private String columnIsCustom;

    //COLUMN_FORMATTER:格式化方法
    private String columnFormatter;

    /**
     * 构造函数
     * @param columnId 主键
     * @param columnDsId 所属数据集ID
     * @param columnCaption 列标题
     * @param columnName 列名
     * @param columnDataTypeName 数据类型
     * @param columnCreateTime 创建时间
     * @param columnCreator 创建人
     * @param columnUpdateTime 更新时间
     * @param columnUpdater 更新人
     * @param columnDesc 备注
     * @param columnDefaultType 默认值类型
     * @param columnDefaultValue 默认值
     * @param columnDefaultText 默认值描述
     * @param columnOrderNum 排序号
     * @param columnTableName 所属表名
     * @param columnIsCustom 是否自定义
     * @param columnFormatter 格式化方法
     **/
    public DatasetColumnEntity(String columnId, String columnDsId, String columnCaption, String columnName, String columnDataTypeName, Date columnCreateTime, String columnCreator, Date columnUpdateTime, String columnUpdater, String columnDesc, String columnDefaultType, String columnDefaultValue, String columnDefaultText, Integer columnOrderNum, String columnTableName, String columnIsCustom, String columnFormatter) {
        this.columnId = columnId;
        this.columnDsId = columnDsId;
        this.columnCaption = columnCaption;
        this.columnName = columnName;
        this.columnDataTypeName = columnDataTypeName;
        this.columnCreateTime = columnCreateTime;
        this.columnCreator = columnCreator;
        this.columnUpdateTime = columnUpdateTime;
        this.columnUpdater = columnUpdater;
        this.columnDesc = columnDesc;
        this.columnDefaultType = columnDefaultType;
        this.columnDefaultValue = columnDefaultValue;
        this.columnDefaultText = columnDefaultText;
        this.columnOrderNum = columnOrderNum;
        this.columnTableName = columnTableName;
        this.columnIsCustom = columnIsCustom;
        this.columnFormatter = columnFormatter;
    }

    public DatasetColumnEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getColumnId() {
        return columnId;
    }

    /**
     * 主键:UUID
     * @param columnId 主键
     **/
    public void setColumnId(String columnId) {
        this.columnId = columnId == null ? null : columnId.trim();
    }

    /**
     * 所属数据集ID
     * @return java.lang.String
     **/
    public String getColumnDsId() {
        return columnDsId;
    }

    /**
     * 所属数据集ID
     * @param columnDsId 所属数据集ID
     **/
    public void setColumnDsId(String columnDsId) {
        this.columnDsId = columnDsId == null ? null : columnDsId.trim();
    }

    /**
     * 列标题
     * @return java.lang.String
     **/
    public String getColumnCaption() {
        return columnCaption;
    }

    /**
     * 列标题
     * @param columnCaption 列标题
     **/
    public void setColumnCaption(String columnCaption) {
        this.columnCaption = columnCaption == null ? null : columnCaption.trim();
    }

    /**
     * 列名
     * @return java.lang.String
     **/
    public String getColumnName() {
        return columnName;
    }

    /**
     * 列名
     * @param columnName 列名
     **/
    public void setColumnName(String columnName) {
        this.columnName = columnName == null ? null : columnName.trim();
    }

    /**
     * 数据类型
     * @return java.lang.String
     **/
    public String getColumnDataTypeName() {
        return columnDataTypeName;
    }

    /**
     * 数据类型
     * @param columnDataTypeName 数据类型
     **/
    public void setColumnDataTypeName(String columnDataTypeName) {
        this.columnDataTypeName = columnDataTypeName == null ? null : columnDataTypeName.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getColumnCreateTime() {
        return columnCreateTime;
    }

    /**
     * 创建时间
     * @param columnCreateTime 创建时间
     **/
    public void setColumnCreateTime(Date columnCreateTime) {
        this.columnCreateTime = columnCreateTime;
    }

    /**
     * 创建人
     * @return java.lang.String
     **/
    public String getColumnCreator() {
        return columnCreator;
    }

    /**
     * 创建人
     * @param columnCreator 创建人
     **/
    public void setColumnCreator(String columnCreator) {
        this.columnCreator = columnCreator == null ? null : columnCreator.trim();
    }

    /**
     * 更新时间
     * @return java.util.Date
     **/
    public Date getColumnUpdateTime() {
        return columnUpdateTime;
    }

    /**
     * 更新时间
     * @param columnUpdateTime 更新时间
     **/
    public void setColumnUpdateTime(Date columnUpdateTime) {
        this.columnUpdateTime = columnUpdateTime;
    }

    /**
     * 更新人
     * @return java.lang.String
     **/
    public String getColumnUpdater() {
        return columnUpdater;
    }

    /**
     * 更新人
     * @param columnUpdater 更新人
     **/
    public void setColumnUpdater(String columnUpdater) {
        this.columnUpdater = columnUpdater == null ? null : columnUpdater.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getColumnDesc() {
        return columnDesc;
    }

    /**
     * 备注
     * @param columnDesc 备注
     **/
    public void setColumnDesc(String columnDesc) {
        this.columnDesc = columnDesc == null ? null : columnDesc.trim();
    }

    /**
     * 默认值类型
     * @return java.lang.String
     **/
    public String getColumnDefaultType() {
        return columnDefaultType;
    }

    /**
     * 默认值类型
     * @param columnDefaultType 默认值类型
     **/
    public void setColumnDefaultType(String columnDefaultType) {
        this.columnDefaultType = columnDefaultType == null ? null : columnDefaultType.trim();
    }

    /**
     * 默认值
     * @return java.lang.String
     **/
    public String getColumnDefaultValue() {
        return columnDefaultValue;
    }

    /**
     * 默认值
     * @param columnDefaultValue 默认值
     **/
    public void setColumnDefaultValue(String columnDefaultValue) {
        this.columnDefaultValue = columnDefaultValue == null ? null : columnDefaultValue.trim();
    }

    /**
     * 默认值描述
     * @return java.lang.String
     **/
    public String getColumnDefaultText() {
        return columnDefaultText;
    }

    /**
     * 默认值描述
     * @param columnDefaultText 默认值描述
     **/
    public void setColumnDefaultText(String columnDefaultText) {
        this.columnDefaultText = columnDefaultText == null ? null : columnDefaultText.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getColumnOrderNum() {
        return columnOrderNum;
    }

    /**
     * 排序号
     * @param columnOrderNum 排序号
     **/
    public void setColumnOrderNum(Integer columnOrderNum) {
        this.columnOrderNum = columnOrderNum;
    }

    /**
     * 所属表名
     * @return java.lang.String
     **/
    public String getColumnTableName() {
        return columnTableName;
    }

    /**
     * 所属表名
     * @param columnTableName 所属表名
     **/
    public void setColumnTableName(String columnTableName) {
        this.columnTableName = columnTableName == null ? null : columnTableName.trim();
    }

    /**
     * 是否自定义
     * @return java.lang.String
     **/
    public String getColumnIsCustom() {
        return columnIsCustom;
    }

    /**
     * 是否自定义
     * @param columnIsCustom 是否自定义
     **/
    public void setColumnIsCustom(String columnIsCustom) {
        this.columnIsCustom = columnIsCustom == null ? null : columnIsCustom.trim();
    }

    /**
     * 格式化方法
     * @return java.lang.String
     **/
    public String getColumnFormatter() {
        return columnFormatter;
    }

    /**
     * 格式化方法
     * @param columnFormatter 格式化方法
     **/
    public void setColumnFormatter(String columnFormatter) {
        this.columnFormatter = columnFormatter == null ? null : columnFormatter.trim();
    }
}