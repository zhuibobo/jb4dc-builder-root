package com.jb4dc.builder.dbentities.site;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tbuild_site_info
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class SiteInfoEntity {
    //SITE_ID:
    @DBKeyField
    private String siteId;

    //SITE_NAME:站点名称
    private String siteName;

    //SITE_SINGLE_NAME:站点唯一名称
    private String siteSingleName;

    //SITE_PUBLIC_ROOT_PATH:文件发布基础路径
    private String sitePublicRootPath;

    //SITE_DOMAIN:站点域名
    private String siteDomain;

    //SITE_CONTEXT_PATH:站点根路径
    private String siteContextPath;

    //SITE_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date siteCreateTime;

    //SITE_CREATOR:创建者
    private String siteCreator;

    //SITE_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date siteUpdateTime;

    //SITE_UPDATER:更新人
    private String siteUpdater;

    //SITE_DESC:备注
    private String siteDesc;

    //SITE_STATUS:状态
    private String siteStatus;

    //SITE_ORDER_NUM:排序号
    private Integer siteOrderNum;

    /**
     * 构造函数
     * @param siteId
     * @param siteName 站点名称
     * @param siteSingleName 站点唯一名称
     * @param sitePublicRootPath 文件发布基础路径
     * @param siteDomain 站点域名
     * @param siteContextPath 站点根路径
     * @param siteCreateTime 创建时间
     * @param siteCreator 创建者
     * @param siteUpdateTime 更新时间
     * @param siteUpdater 更新人
     * @param siteDesc 备注
     * @param siteStatus 状态
     * @param siteOrderNum 排序号
     **/
    public SiteInfoEntity(String siteId, String siteName, String siteSingleName, String sitePublicRootPath, String siteDomain, String siteContextPath, Date siteCreateTime, String siteCreator, Date siteUpdateTime, String siteUpdater, String siteDesc, String siteStatus, Integer siteOrderNum) {
        this.siteId = siteId;
        this.siteName = siteName;
        this.siteSingleName = siteSingleName;
        this.sitePublicRootPath = sitePublicRootPath;
        this.siteDomain = siteDomain;
        this.siteContextPath = siteContextPath;
        this.siteCreateTime = siteCreateTime;
        this.siteCreator = siteCreator;
        this.siteUpdateTime = siteUpdateTime;
        this.siteUpdater = siteUpdater;
        this.siteDesc = siteDesc;
        this.siteStatus = siteStatus;
        this.siteOrderNum = siteOrderNum;
    }

    public SiteInfoEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getSiteId() {
        return siteId;
    }

    /**
     *
     * @param siteId
     **/
    public void setSiteId(String siteId) {
        this.siteId = siteId == null ? null : siteId.trim();
    }

    /**
     * 站点名称
     * @return java.lang.String
     **/
    public String getSiteName() {
        return siteName;
    }

    /**
     * 站点名称
     * @param siteName 站点名称
     **/
    public void setSiteName(String siteName) {
        this.siteName = siteName == null ? null : siteName.trim();
    }

    /**
     * 站点唯一名称
     * @return java.lang.String
     **/
    public String getSiteSingleName() {
        return siteSingleName;
    }

    /**
     * 站点唯一名称
     * @param siteSingleName 站点唯一名称
     **/
    public void setSiteSingleName(String siteSingleName) {
        this.siteSingleName = siteSingleName == null ? null : siteSingleName.trim();
    }

    /**
     * 文件发布基础路径
     * @return java.lang.String
     **/
    public String getSitePublicRootPath() {
        return sitePublicRootPath;
    }

    /**
     * 文件发布基础路径
     * @param sitePublicRootPath 文件发布基础路径
     **/
    public void setSitePublicRootPath(String sitePublicRootPath) {
        this.sitePublicRootPath = sitePublicRootPath == null ? null : sitePublicRootPath.trim();
    }

    /**
     * 站点域名
     * @return java.lang.String
     **/
    public String getSiteDomain() {
        return siteDomain;
    }

    /**
     * 站点域名
     * @param siteDomain 站点域名
     **/
    public void setSiteDomain(String siteDomain) {
        this.siteDomain = siteDomain == null ? null : siteDomain.trim();
    }

    /**
     * 站点根路径
     * @return java.lang.String
     **/
    public String getSiteContextPath() {
        return siteContextPath;
    }

    /**
     * 站点根路径
     * @param siteContextPath 站点根路径
     **/
    public void setSiteContextPath(String siteContextPath) {
        this.siteContextPath = siteContextPath == null ? null : siteContextPath.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getSiteCreateTime() {
        return siteCreateTime;
    }

    /**
     * 创建时间
     * @param siteCreateTime 创建时间
     **/
    public void setSiteCreateTime(Date siteCreateTime) {
        this.siteCreateTime = siteCreateTime;
    }

    /**
     * 创建者
     * @return java.lang.String
     **/
    public String getSiteCreator() {
        return siteCreator;
    }

    /**
     * 创建者
     * @param siteCreator 创建者
     **/
    public void setSiteCreator(String siteCreator) {
        this.siteCreator = siteCreator == null ? null : siteCreator.trim();
    }

    /**
     * 更新时间
     * @return java.util.Date
     **/
    public Date getSiteUpdateTime() {
        return siteUpdateTime;
    }

    /**
     * 更新时间
     * @param siteUpdateTime 更新时间
     **/
    public void setSiteUpdateTime(Date siteUpdateTime) {
        this.siteUpdateTime = siteUpdateTime;
    }

    /**
     * 更新人
     * @return java.lang.String
     **/
    public String getSiteUpdater() {
        return siteUpdater;
    }

    /**
     * 更新人
     * @param siteUpdater 更新人
     **/
    public void setSiteUpdater(String siteUpdater) {
        this.siteUpdater = siteUpdater == null ? null : siteUpdater.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getSiteDesc() {
        return siteDesc;
    }

    /**
     * 备注
     * @param siteDesc 备注
     **/
    public void setSiteDesc(String siteDesc) {
        this.siteDesc = siteDesc == null ? null : siteDesc.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getSiteStatus() {
        return siteStatus;
    }

    /**
     * 状态
     * @param siteStatus 状态
     **/
    public void setSiteStatus(String siteStatus) {
        this.siteStatus = siteStatus == null ? null : siteStatus.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getSiteOrderNum() {
        return siteOrderNum;
    }

    /**
     * 排序号
     * @param siteOrderNum 排序号
     **/
    public void setSiteOrderNum(Integer siteOrderNum) {
        this.siteOrderNum = siteOrderNum;
    }
}