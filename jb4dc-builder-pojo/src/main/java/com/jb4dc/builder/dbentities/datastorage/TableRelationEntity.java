package com.jb4dc.builder.dbentities.datastorage;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_TABLE_RELATION
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class TableRelationEntity {
    //RELATION_ID:表关联ID:主键
    @DBKeyField
    private String relationId;

    //RELATION_GROUP_ID:所属分组ID
    private String relationGroupId;

    //RELATION_NAME:表关联名称
    private String relationName;

    //RELATION_USER_ID:创建人ID
    private String relationUserId;

    //RELATION_USER_NAME:创建人
    private String relationUserName;

    //RELATION_ORDER_NUM:排序号
    private Integer relationOrderNum;

    //RELATION_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date relationCreateTime;

    //RELATION_DESC:描述
    private String relationDesc;

    //RELATION_STATUS:状态
    private String relationStatus;

    //RELATION_CONTENT:表关系的Json描述:抽取元素的组要属性进行存储
    private String relationContent;

    //RELATION_DIAGRAM_JSON:画布的原始Json:用于生成图片
    private String relationDiagramJson;

    /**
     * 构造函数
     * @param relationId 表关联ID
     * @param relationGroupId 所属分组ID
     * @param relationName 表关联名称
     * @param relationUserId 创建人ID
     * @param relationUserName 创建人
     * @param relationOrderNum 排序号
     * @param relationCreateTime 创建时间
     * @param relationDesc 描述
     * @param relationStatus 状态
     * @param relationContent 表关系的Json描述
     * @param relationDiagramJson 画布的原始Json
     **/
    public TableRelationEntity(String relationId, String relationGroupId, String relationName, String relationUserId, String relationUserName, Integer relationOrderNum, Date relationCreateTime, String relationDesc, String relationStatus, String relationContent, String relationDiagramJson) {
        this.relationId = relationId;
        this.relationGroupId = relationGroupId;
        this.relationName = relationName;
        this.relationUserId = relationUserId;
        this.relationUserName = relationUserName;
        this.relationOrderNum = relationOrderNum;
        this.relationCreateTime = relationCreateTime;
        this.relationDesc = relationDesc;
        this.relationStatus = relationStatus;
        this.relationContent = relationContent;
        this.relationDiagramJson = relationDiagramJson;
    }

    public TableRelationEntity() {
        super();
    }

    /**
     * 表关联ID:主键
     * @return java.lang.String
     **/
    public String getRelationId() {
        return relationId;
    }

    /**
     * 表关联ID:主键
     * @param relationId 表关联ID
     **/
    public void setRelationId(String relationId) {
        this.relationId = relationId == null ? null : relationId.trim();
    }

    /**
     * 所属分组ID
     * @return java.lang.String
     **/
    public String getRelationGroupId() {
        return relationGroupId;
    }

    /**
     * 所属分组ID
     * @param relationGroupId 所属分组ID
     **/
    public void setRelationGroupId(String relationGroupId) {
        this.relationGroupId = relationGroupId == null ? null : relationGroupId.trim();
    }

    /**
     * 表关联名称
     * @return java.lang.String
     **/
    public String getRelationName() {
        return relationName;
    }

    /**
     * 表关联名称
     * @param relationName 表关联名称
     **/
    public void setRelationName(String relationName) {
        this.relationName = relationName == null ? null : relationName.trim();
    }

    /**
     * 创建人ID
     * @return java.lang.String
     **/
    public String getRelationUserId() {
        return relationUserId;
    }

    /**
     * 创建人ID
     * @param relationUserId 创建人ID
     **/
    public void setRelationUserId(String relationUserId) {
        this.relationUserId = relationUserId == null ? null : relationUserId.trim();
    }

    /**
     * 创建人
     * @return java.lang.String
     **/
    public String getRelationUserName() {
        return relationUserName;
    }

    /**
     * 创建人
     * @param relationUserName 创建人
     **/
    public void setRelationUserName(String relationUserName) {
        this.relationUserName = relationUserName == null ? null : relationUserName.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getRelationOrderNum() {
        return relationOrderNum;
    }

    /**
     * 排序号
     * @param relationOrderNum 排序号
     **/
    public void setRelationOrderNum(Integer relationOrderNum) {
        this.relationOrderNum = relationOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getRelationCreateTime() {
        return relationCreateTime;
    }

    /**
     * 创建时间
     * @param relationCreateTime 创建时间
     **/
    public void setRelationCreateTime(Date relationCreateTime) {
        this.relationCreateTime = relationCreateTime;
    }

    /**
     * 描述
     * @return java.lang.String
     **/
    public String getRelationDesc() {
        return relationDesc;
    }

    /**
     * 描述
     * @param relationDesc 描述
     **/
    public void setRelationDesc(String relationDesc) {
        this.relationDesc = relationDesc == null ? null : relationDesc.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getRelationStatus() {
        return relationStatus;
    }

    /**
     * 状态
     * @param relationStatus 状态
     **/
    public void setRelationStatus(String relationStatus) {
        this.relationStatus = relationStatus == null ? null : relationStatus.trim();
    }

    /**
     * 表关系的Json描述:抽取元素的组要属性进行存储
     * @return java.lang.String
     **/
    public String getRelationContent() {
        return relationContent;
    }

    /**
     * 表关系的Json描述:抽取元素的组要属性进行存储
     * @param relationContent 表关系的Json描述
     **/
    public void setRelationContent(String relationContent) {
        this.relationContent = relationContent == null ? null : relationContent.trim();
    }

    /**
     * 画布的原始Json:用于生成图片
     * @return java.lang.String
     **/
    public String getRelationDiagramJson() {
        return relationDiagramJson;
    }

    /**
     * 画布的原始Json:用于生成图片
     * @param relationDiagramJson 画布的原始Json
     **/
    public void setRelationDiagramJson(String relationDiagramJson) {
        this.relationDiagramJson = relationDiagramJson == null ? null : relationDiagramJson.trim();
    }
}