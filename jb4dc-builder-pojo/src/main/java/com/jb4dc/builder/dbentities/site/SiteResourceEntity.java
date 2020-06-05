package com.jb4dc.builder.dbentities.site;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tbuild_site_resource
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class SiteResourceEntity {
    //RESOURCE_ID:
    @DBKeyField
    private String resourceId;

    //RESOURCE_FOLDER_ID:文件夹ID
    private String resourceFolderId;

    //RESOURCE_SITE_ID:站点ID
    private String resourceSiteId;

    //RESOURCE_NAME:资源名称
    private String resourceName;

    //RESOURCE_FILE_NAME:资源文件名称
    private String resourceFileName;

    //RESOURCE_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date resourceCreateTime;

    //RESOURCE_CREATOR:创建者
    private String resourceCreator;

    //RESOURCE_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date resourceUpdateTime;

    //RESOURCE_UPDATER:更新人
    private String resourceUpdater;

    //RESOURCE_DESC:备注
    private String resourceDesc;

    //RESOURCE_STATUS:状态
    private String resourceStatus;

    //RESOURCE_ORDER_NUM:排序号
    private Integer resourceOrderNum;

    //RESOURCE_TYPE:资源类型
    private String resourceType;

    //RESOURCE_CONTENT:资源的二进制内容
    private byte[] resourceContent;

    /**
     * 构造函数
     * @param resourceId
     * @param resourceFolderId 文件夹ID
     * @param resourceSiteId 站点ID
     * @param resourceName 资源名称
     * @param resourceFileName 资源文件名称
     * @param resourceCreateTime 创建时间
     * @param resourceCreator 创建者
     * @param resourceUpdateTime 更新时间
     * @param resourceUpdater 更新人
     * @param resourceDesc 备注
     * @param resourceStatus 状态
     * @param resourceOrderNum 排序号
     * @param resourceType 资源类型
     **/
    public SiteResourceEntity(String resourceId, String resourceFolderId, String resourceSiteId, String resourceName, String resourceFileName, Date resourceCreateTime, String resourceCreator, Date resourceUpdateTime, String resourceUpdater, String resourceDesc, String resourceStatus, Integer resourceOrderNum, String resourceType) {
        this.resourceId = resourceId;
        this.resourceFolderId = resourceFolderId;
        this.resourceSiteId = resourceSiteId;
        this.resourceName = resourceName;
        this.resourceFileName = resourceFileName;
        this.resourceCreateTime = resourceCreateTime;
        this.resourceCreator = resourceCreator;
        this.resourceUpdateTime = resourceUpdateTime;
        this.resourceUpdater = resourceUpdater;
        this.resourceDesc = resourceDesc;
        this.resourceStatus = resourceStatus;
        this.resourceOrderNum = resourceOrderNum;
        this.resourceType = resourceType;
    }

    /**
     * 构造函数
     * @param resourceId
     * @param resourceFolderId 文件夹ID
     * @param resourceSiteId 站点ID
     * @param resourceName 资源名称
     * @param resourceFileName 资源文件名称
     * @param resourceCreateTime 创建时间
     * @param resourceCreator 创建者
     * @param resourceUpdateTime 更新时间
     * @param resourceUpdater 更新人
     * @param resourceDesc 备注
     * @param resourceStatus 状态
     * @param resourceOrderNum 排序号
     * @param resourceType 资源类型
     * @param resourceContent 资源的二进制内容
     **/
    public SiteResourceEntity(String resourceId, String resourceFolderId, String resourceSiteId, String resourceName, String resourceFileName, Date resourceCreateTime, String resourceCreator, Date resourceUpdateTime, String resourceUpdater, String resourceDesc, String resourceStatus, Integer resourceOrderNum, String resourceType, byte[] resourceContent) {
        this.resourceId = resourceId;
        this.resourceFolderId = resourceFolderId;
        this.resourceSiteId = resourceSiteId;
        this.resourceName = resourceName;
        this.resourceFileName = resourceFileName;
        this.resourceCreateTime = resourceCreateTime;
        this.resourceCreator = resourceCreator;
        this.resourceUpdateTime = resourceUpdateTime;
        this.resourceUpdater = resourceUpdater;
        this.resourceDesc = resourceDesc;
        this.resourceStatus = resourceStatus;
        this.resourceOrderNum = resourceOrderNum;
        this.resourceType = resourceType;
        this.resourceContent = resourceContent;
    }

    public SiteResourceEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getResourceId() {
        return resourceId;
    }

    /**
     *
     * @param resourceId
     **/
    public void setResourceId(String resourceId) {
        this.resourceId = resourceId == null ? null : resourceId.trim();
    }

    /**
     * 文件夹ID
     * @return java.lang.String
     **/
    public String getResourceFolderId() {
        return resourceFolderId;
    }

    /**
     * 文件夹ID
     * @param resourceFolderId 文件夹ID
     **/
    public void setResourceFolderId(String resourceFolderId) {
        this.resourceFolderId = resourceFolderId == null ? null : resourceFolderId.trim();
    }

    /**
     * 站点ID
     * @return java.lang.String
     **/
    public String getResourceSiteId() {
        return resourceSiteId;
    }

    /**
     * 站点ID
     * @param resourceSiteId 站点ID
     **/
    public void setResourceSiteId(String resourceSiteId) {
        this.resourceSiteId = resourceSiteId == null ? null : resourceSiteId.trim();
    }

    /**
     * 资源名称
     * @return java.lang.String
     **/
    public String getResourceName() {
        return resourceName;
    }

    /**
     * 资源名称
     * @param resourceName 资源名称
     **/
    public void setResourceName(String resourceName) {
        this.resourceName = resourceName == null ? null : resourceName.trim();
    }

    /**
     * 资源文件名称
     * @return java.lang.String
     **/
    public String getResourceFileName() {
        return resourceFileName;
    }

    /**
     * 资源文件名称
     * @param resourceFileName 资源文件名称
     **/
    public void setResourceFileName(String resourceFileName) {
        this.resourceFileName = resourceFileName == null ? null : resourceFileName.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getResourceCreateTime() {
        return resourceCreateTime;
    }

    /**
     * 创建时间
     * @param resourceCreateTime 创建时间
     **/
    public void setResourceCreateTime(Date resourceCreateTime) {
        this.resourceCreateTime = resourceCreateTime;
    }

    /**
     * 创建者
     * @return java.lang.String
     **/
    public String getResourceCreator() {
        return resourceCreator;
    }

    /**
     * 创建者
     * @param resourceCreator 创建者
     **/
    public void setResourceCreator(String resourceCreator) {
        this.resourceCreator = resourceCreator == null ? null : resourceCreator.trim();
    }

    /**
     * 更新时间
     * @return java.util.Date
     **/
    public Date getResourceUpdateTime() {
        return resourceUpdateTime;
    }

    /**
     * 更新时间
     * @param resourceUpdateTime 更新时间
     **/
    public void setResourceUpdateTime(Date resourceUpdateTime) {
        this.resourceUpdateTime = resourceUpdateTime;
    }

    /**
     * 更新人
     * @return java.lang.String
     **/
    public String getResourceUpdater() {
        return resourceUpdater;
    }

    /**
     * 更新人
     * @param resourceUpdater 更新人
     **/
    public void setResourceUpdater(String resourceUpdater) {
        this.resourceUpdater = resourceUpdater == null ? null : resourceUpdater.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getResourceDesc() {
        return resourceDesc;
    }

    /**
     * 备注
     * @param resourceDesc 备注
     **/
    public void setResourceDesc(String resourceDesc) {
        this.resourceDesc = resourceDesc == null ? null : resourceDesc.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getResourceStatus() {
        return resourceStatus;
    }

    /**
     * 状态
     * @param resourceStatus 状态
     **/
    public void setResourceStatus(String resourceStatus) {
        this.resourceStatus = resourceStatus == null ? null : resourceStatus.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getResourceOrderNum() {
        return resourceOrderNum;
    }

    /**
     * 排序号
     * @param resourceOrderNum 排序号
     **/
    public void setResourceOrderNum(Integer resourceOrderNum) {
        this.resourceOrderNum = resourceOrderNum;
    }

    /**
     * 资源类型
     * @return java.lang.String
     **/
    public String getResourceType() {
        return resourceType;
    }

    /**
     * 资源类型
     * @param resourceType 资源类型
     **/
    public void setResourceType(String resourceType) {
        this.resourceType = resourceType == null ? null : resourceType.trim();
    }

    /**
     * 资源的二进制内容
     * @return byte[]
     **/
    public byte[] getResourceContent() {
        return resourceContent;
    }

    /**
     * 资源的二进制内容
     * @param resourceContent 资源的二进制内容
     **/
    public void setResourceContent(byte[] resourceContent) {
        this.resourceContent = resourceContent;
    }
}