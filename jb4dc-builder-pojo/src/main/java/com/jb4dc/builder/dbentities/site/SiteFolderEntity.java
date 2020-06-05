package com.jb4dc.builder.dbentities.site;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tbuild_site_folder
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class SiteFolderEntity {
    //FOLDER_ID:
    @DBKeyField
    private String folderId;

    //FOLDER_SITE_ID:站点ID
    private String folderSiteId;

    //FOLDER_NAME:文件夹名称
    private String folderName;

    //FOLDER_PARENT_ID:父文件夹ID
    private String folderParentId;

    //FOLDER_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date folderCreateTime;

    //FOLDER_CREATOR:创建者
    private String folderCreator;

    //FOLDER_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date folderUpdateTime;

    //FOLDER_UPDATER:更新人
    private String folderUpdater;

    //FOLDER_DESC:备注
    private String folderDesc;

    //FOLDER_STATUS:状态
    private String folderStatus;

    //FOLDER_ORDER_NUM:排序号
    private Integer folderOrderNum;

    //FOLDER_TYPE:类型
    private String folderType;

    /**
     * 构造函数
     * @param folderId
     * @param folderSiteId 站点ID
     * @param folderName 文件夹名称
     * @param folderParentId 父文件夹ID
     * @param folderCreateTime 创建时间
     * @param folderCreator 创建者
     * @param folderUpdateTime 更新时间
     * @param folderUpdater 更新人
     * @param folderDesc 备注
     * @param folderStatus 状态
     * @param folderOrderNum 排序号
     * @param folderType 类型
     **/
    public SiteFolderEntity(String folderId, String folderSiteId, String folderName, String folderParentId, Date folderCreateTime, String folderCreator, Date folderUpdateTime, String folderUpdater, String folderDesc, String folderStatus, Integer folderOrderNum, String folderType) {
        this.folderId = folderId;
        this.folderSiteId = folderSiteId;
        this.folderName = folderName;
        this.folderParentId = folderParentId;
        this.folderCreateTime = folderCreateTime;
        this.folderCreator = folderCreator;
        this.folderUpdateTime = folderUpdateTime;
        this.folderUpdater = folderUpdater;
        this.folderDesc = folderDesc;
        this.folderStatus = folderStatus;
        this.folderOrderNum = folderOrderNum;
        this.folderType = folderType;
    }

    public SiteFolderEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getFolderId() {
        return folderId;
    }

    /**
     *
     * @param folderId
     **/
    public void setFolderId(String folderId) {
        this.folderId = folderId == null ? null : folderId.trim();
    }

    /**
     * 站点ID
     * @return java.lang.String
     **/
    public String getFolderSiteId() {
        return folderSiteId;
    }

    /**
     * 站点ID
     * @param folderSiteId 站点ID
     **/
    public void setFolderSiteId(String folderSiteId) {
        this.folderSiteId = folderSiteId == null ? null : folderSiteId.trim();
    }

    /**
     * 文件夹名称
     * @return java.lang.String
     **/
    public String getFolderName() {
        return folderName;
    }

    /**
     * 文件夹名称
     * @param folderName 文件夹名称
     **/
    public void setFolderName(String folderName) {
        this.folderName = folderName == null ? null : folderName.trim();
    }

    /**
     * 父文件夹ID
     * @return java.lang.String
     **/
    public String getFolderParentId() {
        return folderParentId;
    }

    /**
     * 父文件夹ID
     * @param folderParentId 父文件夹ID
     **/
    public void setFolderParentId(String folderParentId) {
        this.folderParentId = folderParentId == null ? null : folderParentId.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getFolderCreateTime() {
        return folderCreateTime;
    }

    /**
     * 创建时间
     * @param folderCreateTime 创建时间
     **/
    public void setFolderCreateTime(Date folderCreateTime) {
        this.folderCreateTime = folderCreateTime;
    }

    /**
     * 创建者
     * @return java.lang.String
     **/
    public String getFolderCreator() {
        return folderCreator;
    }

    /**
     * 创建者
     * @param folderCreator 创建者
     **/
    public void setFolderCreator(String folderCreator) {
        this.folderCreator = folderCreator == null ? null : folderCreator.trim();
    }

    /**
     * 更新时间
     * @return java.util.Date
     **/
    public Date getFolderUpdateTime() {
        return folderUpdateTime;
    }

    /**
     * 更新时间
     * @param folderUpdateTime 更新时间
     **/
    public void setFolderUpdateTime(Date folderUpdateTime) {
        this.folderUpdateTime = folderUpdateTime;
    }

    /**
     * 更新人
     * @return java.lang.String
     **/
    public String getFolderUpdater() {
        return folderUpdater;
    }

    /**
     * 更新人
     * @param folderUpdater 更新人
     **/
    public void setFolderUpdater(String folderUpdater) {
        this.folderUpdater = folderUpdater == null ? null : folderUpdater.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getFolderDesc() {
        return folderDesc;
    }

    /**
     * 备注
     * @param folderDesc 备注
     **/
    public void setFolderDesc(String folderDesc) {
        this.folderDesc = folderDesc == null ? null : folderDesc.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getFolderStatus() {
        return folderStatus;
    }

    /**
     * 状态
     * @param folderStatus 状态
     **/
    public void setFolderStatus(String folderStatus) {
        this.folderStatus = folderStatus == null ? null : folderStatus.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getFolderOrderNum() {
        return folderOrderNum;
    }

    /**
     * 排序号
     * @param folderOrderNum 排序号
     **/
    public void setFolderOrderNum(Integer folderOrderNum) {
        this.folderOrderNum = folderOrderNum;
    }

    /**
     * 类型
     * @return java.lang.String
     **/
    public String getFolderType() {
        return folderType;
    }

    /**
     * 类型
     * @param folderType 类型
     **/
    public void setFolderType(String folderType) {
        this.folderType = folderType == null ? null : folderType.trim();
    }
}