package com.jb4dc.builder.dbentities.datastorage;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_TABLE_FIELD
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class TableFieldEntity {
    //FIELD_ID:主键:UUID
    @DBKeyField
    private String fieldId;

    //FIELD_TABLE_ID:所属表ID
    private String fieldTableId;

    //FIELD_NAME:字段名
    private String fieldName;

    //FIELD_CAPTION:字段标题
    private String fieldCaption;

    //FIELD_IS_PK:是否主键
    private String fieldIsPk;

    //FIELD_ALLOW_NULL:是否允许为空
    private String fieldAllowNull;

    //FIELD_DATA_TYPE:数据类型:类型详见枚举TableFieldTypeEnum
    private String fieldDataType;

    //FIELD_DATA_LENGTH:字段长度
    private Integer fieldDataLength;

    //FIELD_DECIMAL_LENGTH:小数位数
    private Integer fieldDecimalLength;

    //FIELD_DEFAULT_TYPE:默认值类型
    private String fieldDefaultType;

    //FIELD_DEFAULT_VALUE:默认值
    private String fieldDefaultValue;

    //FIELD_DEFAULT_TEXT:默认值描述
    private String fieldDefaultText;

    //FIELD_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date fieldCreateTime;

    //FIELD_CREATOR:创建人
    private String fieldCreator;

    //FIELD_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date fieldUpdateTime;

    //FIELD_UPDATER:更新人
    private String fieldUpdater;

    //FIELD_DESC:备注
    private String fieldDesc;

    //FIELD_ORDER_NUM:排序号
    private Integer fieldOrderNum;

    //FIELD_TEMPLATE_NAME:模版名称
    private String fieldTemplateName;

    /**
     * 构造函数
     * @param fieldId 主键
     * @param fieldTableId 所属表ID
     * @param fieldName 字段名
     * @param fieldCaption 字段标题
     * @param fieldIsPk 是否主键
     * @param fieldAllowNull 是否允许为空
     * @param fieldDataType 数据类型
     * @param fieldDataLength 字段长度
     * @param fieldDecimalLength 小数位数
     * @param fieldDefaultType 默认值类型
     * @param fieldDefaultValue 默认值
     * @param fieldDefaultText 默认值描述
     * @param fieldCreateTime 创建时间
     * @param fieldCreator 创建人
     * @param fieldUpdateTime 更新时间
     * @param fieldUpdater 更新人
     * @param fieldDesc 备注
     * @param fieldOrderNum 排序号
     * @param fieldTemplateName 模版名称
     **/
    public TableFieldEntity(String fieldId, String fieldTableId, String fieldName, String fieldCaption, String fieldIsPk, String fieldAllowNull, String fieldDataType, Integer fieldDataLength, Integer fieldDecimalLength, String fieldDefaultType, String fieldDefaultValue, String fieldDefaultText, Date fieldCreateTime, String fieldCreator, Date fieldUpdateTime, String fieldUpdater, String fieldDesc, Integer fieldOrderNum, String fieldTemplateName) {
        this.fieldId = fieldId;
        this.fieldTableId = fieldTableId;
        this.fieldName = fieldName;
        this.fieldCaption = fieldCaption;
        this.fieldIsPk = fieldIsPk;
        this.fieldAllowNull = fieldAllowNull;
        this.fieldDataType = fieldDataType;
        this.fieldDataLength = fieldDataLength;
        this.fieldDecimalLength = fieldDecimalLength;
        this.fieldDefaultType = fieldDefaultType;
        this.fieldDefaultValue = fieldDefaultValue;
        this.fieldDefaultText = fieldDefaultText;
        this.fieldCreateTime = fieldCreateTime;
        this.fieldCreator = fieldCreator;
        this.fieldUpdateTime = fieldUpdateTime;
        this.fieldUpdater = fieldUpdater;
        this.fieldDesc = fieldDesc;
        this.fieldOrderNum = fieldOrderNum;
        this.fieldTemplateName = fieldTemplateName;
    }

    public TableFieldEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getFieldId() {
        return fieldId;
    }

    /**
     * 主键:UUID
     * @param fieldId 主键
     **/
    public void setFieldId(String fieldId) {
        this.fieldId = fieldId == null ? null : fieldId.trim();
    }

    /**
     * 所属表ID
     * @return java.lang.String
     **/
    public String getFieldTableId() {
        return fieldTableId;
    }

    /**
     * 所属表ID
     * @param fieldTableId 所属表ID
     **/
    public void setFieldTableId(String fieldTableId) {
        this.fieldTableId = fieldTableId == null ? null : fieldTableId.trim();
    }

    /**
     * 字段名
     * @return java.lang.String
     **/
    public String getFieldName() {
        return fieldName;
    }

    /**
     * 字段名
     * @param fieldName 字段名
     **/
    public void setFieldName(String fieldName) {
        this.fieldName = fieldName == null ? null : fieldName.trim();
    }

    /**
     * 字段标题
     * @return java.lang.String
     **/
    public String getFieldCaption() {
        return fieldCaption;
    }

    /**
     * 字段标题
     * @param fieldCaption 字段标题
     **/
    public void setFieldCaption(String fieldCaption) {
        this.fieldCaption = fieldCaption == null ? null : fieldCaption.trim();
    }

    /**
     * 是否主键
     * @return java.lang.String
     **/
    public String getFieldIsPk() {
        return fieldIsPk;
    }

    /**
     * 是否主键
     * @param fieldIsPk 是否主键
     **/
    public void setFieldIsPk(String fieldIsPk) {
        this.fieldIsPk = fieldIsPk == null ? null : fieldIsPk.trim();
    }

    /**
     * 是否允许为空
     * @return java.lang.String
     **/
    public String getFieldAllowNull() {
        return fieldAllowNull;
    }

    /**
     * 是否允许为空
     * @param fieldAllowNull 是否允许为空
     **/
    public void setFieldAllowNull(String fieldAllowNull) {
        this.fieldAllowNull = fieldAllowNull == null ? null : fieldAllowNull.trim();
    }

    /**
     * 数据类型:类型详见枚举TableFieldTypeEnum
     * @return java.lang.String
     **/
    public String getFieldDataType() {
        return fieldDataType;
    }

    /**
     * 数据类型:类型详见枚举TableFieldTypeEnum
     * @param fieldDataType 数据类型
     **/
    public void setFieldDataType(String fieldDataType) {
        this.fieldDataType = fieldDataType == null ? null : fieldDataType.trim();
    }

    /**
     * 字段长度
     * @return java.lang.Integer
     **/
    public Integer getFieldDataLength() {
        return fieldDataLength;
    }

    /**
     * 字段长度
     * @param fieldDataLength 字段长度
     **/
    public void setFieldDataLength(Integer fieldDataLength) {
        this.fieldDataLength = fieldDataLength;
    }

    /**
     * 小数位数
     * @return java.lang.Integer
     **/
    public Integer getFieldDecimalLength() {
        return fieldDecimalLength;
    }

    /**
     * 小数位数
     * @param fieldDecimalLength 小数位数
     **/
    public void setFieldDecimalLength(Integer fieldDecimalLength) {
        this.fieldDecimalLength = fieldDecimalLength;
    }

    /**
     * 默认值类型
     * @return java.lang.String
     **/
    public String getFieldDefaultType() {
        return fieldDefaultType;
    }

    /**
     * 默认值类型
     * @param fieldDefaultType 默认值类型
     **/
    public void setFieldDefaultType(String fieldDefaultType) {
        this.fieldDefaultType = fieldDefaultType == null ? null : fieldDefaultType.trim();
    }

    /**
     * 默认值
     * @return java.lang.String
     **/
    public String getFieldDefaultValue() {
        return fieldDefaultValue;
    }

    /**
     * 默认值
     * @param fieldDefaultValue 默认值
     **/
    public void setFieldDefaultValue(String fieldDefaultValue) {
        this.fieldDefaultValue = fieldDefaultValue == null ? null : fieldDefaultValue.trim();
    }

    /**
     * 默认值描述
     * @return java.lang.String
     **/
    public String getFieldDefaultText() {
        return fieldDefaultText;
    }

    /**
     * 默认值描述
     * @param fieldDefaultText 默认值描述
     **/
    public void setFieldDefaultText(String fieldDefaultText) {
        this.fieldDefaultText = fieldDefaultText == null ? null : fieldDefaultText.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getFieldCreateTime() {
        return fieldCreateTime;
    }

    /**
     * 创建时间
     * @param fieldCreateTime 创建时间
     **/
    public void setFieldCreateTime(Date fieldCreateTime) {
        this.fieldCreateTime = fieldCreateTime;
    }

    /**
     * 创建人
     * @return java.lang.String
     **/
    public String getFieldCreator() {
        return fieldCreator;
    }

    /**
     * 创建人
     * @param fieldCreator 创建人
     **/
    public void setFieldCreator(String fieldCreator) {
        this.fieldCreator = fieldCreator == null ? null : fieldCreator.trim();
    }

    /**
     * 更新时间
     * @return java.util.Date
     **/
    public Date getFieldUpdateTime() {
        return fieldUpdateTime;
    }

    /**
     * 更新时间
     * @param fieldUpdateTime 更新时间
     **/
    public void setFieldUpdateTime(Date fieldUpdateTime) {
        this.fieldUpdateTime = fieldUpdateTime;
    }

    /**
     * 更新人
     * @return java.lang.String
     **/
    public String getFieldUpdater() {
        return fieldUpdater;
    }

    /**
     * 更新人
     * @param fieldUpdater 更新人
     **/
    public void setFieldUpdater(String fieldUpdater) {
        this.fieldUpdater = fieldUpdater == null ? null : fieldUpdater.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getFieldDesc() {
        return fieldDesc;
    }

    /**
     * 备注
     * @param fieldDesc 备注
     **/
    public void setFieldDesc(String fieldDesc) {
        this.fieldDesc = fieldDesc == null ? null : fieldDesc.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getFieldOrderNum() {
        return fieldOrderNum;
    }

    /**
     * 排序号
     * @param fieldOrderNum 排序号
     **/
    public void setFieldOrderNum(Integer fieldOrderNum) {
        this.fieldOrderNum = fieldOrderNum;
    }

    /**
     * 模版名称
     * @return java.lang.String
     **/
    public String getFieldTemplateName() {
        return fieldTemplateName;
    }

    /**
     * 模版名称
     * @param fieldTemplateName 模版名称
     **/
    public void setFieldTemplateName(String fieldTemplateName) {
        this.fieldTemplateName = fieldTemplateName == null ? null : fieldTemplateName.trim();
    }
}