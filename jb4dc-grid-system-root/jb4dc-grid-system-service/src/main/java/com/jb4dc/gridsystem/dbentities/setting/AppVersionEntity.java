package com.jb4dc.gridsystem.dbentities.setting;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tgrid_app_version
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class AppVersionEntity {
    //APP_VERSION_ID:
    @DBKeyField
    private String appVersionId;

    //APP_VERSION_CODE:版本号:1.0.0.0
    private String appVersionCode;

    //APP_VERSION_NAME:版本名称
    private String appVersionName;

    //APP_VERSION_UPDATE_DESC:更新说明
    private String appVersionUpdateDesc;

    //APP_VERSION_DESC:备注
    private String appVersionDesc;

    //APP_VERSION_STATUS:状态:未发布,预发布,已发布
    private String appVersionStatus;

    //APP_VERSION_UPLOAD_DATE:上传时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date appVersionUploadDate;

    //APP_VERSION_FILE_PATH:APK文件路径
    private String appVersionFilePath;

    /**
     * 构造函数
     * @param appVersionId
     * @param appVersionCode 版本号
     * @param appVersionName 版本名称
     * @param appVersionUpdateDesc 更新说明
     * @param appVersionDesc 备注
     * @param appVersionStatus 状态
     * @param appVersionUploadDate 上传时间
     * @param appVersionFilePath APK文件路径
     **/
    public AppVersionEntity(String appVersionId, String appVersionCode, String appVersionName, String appVersionUpdateDesc, String appVersionDesc, String appVersionStatus, Date appVersionUploadDate, String appVersionFilePath) {
        this.appVersionId = appVersionId;
        this.appVersionCode = appVersionCode;
        this.appVersionName = appVersionName;
        this.appVersionUpdateDesc = appVersionUpdateDesc;
        this.appVersionDesc = appVersionDesc;
        this.appVersionStatus = appVersionStatus;
        this.appVersionUploadDate = appVersionUploadDate;
        this.appVersionFilePath = appVersionFilePath;
    }

    public AppVersionEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getAppVersionId() {
        return appVersionId;
    }

    /**
     *
     * @param appVersionId
     **/
    public void setAppVersionId(String appVersionId) {
        this.appVersionId = appVersionId == null ? null : appVersionId.trim();
    }

    /**
     * 版本号:1.0.0.0
     * @return java.lang.String
     **/
    public String getAppVersionCode() {
        return appVersionCode;
    }

    /**
     * 版本号:1.0.0.0
     * @param appVersionCode 版本号
     **/
    public void setAppVersionCode(String appVersionCode) {
        this.appVersionCode = appVersionCode == null ? null : appVersionCode.trim();
    }

    /**
     * 版本名称
     * @return java.lang.String
     **/
    public String getAppVersionName() {
        return appVersionName;
    }

    /**
     * 版本名称
     * @param appVersionName 版本名称
     **/
    public void setAppVersionName(String appVersionName) {
        this.appVersionName = appVersionName == null ? null : appVersionName.trim();
    }

    /**
     * 更新说明
     * @return java.lang.String
     **/
    public String getAppVersionUpdateDesc() {
        return appVersionUpdateDesc;
    }

    /**
     * 更新说明
     * @param appVersionUpdateDesc 更新说明
     **/
    public void setAppVersionUpdateDesc(String appVersionUpdateDesc) {
        this.appVersionUpdateDesc = appVersionUpdateDesc == null ? null : appVersionUpdateDesc.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getAppVersionDesc() {
        return appVersionDesc;
    }

    /**
     * 备注
     * @param appVersionDesc 备注
     **/
    public void setAppVersionDesc(String appVersionDesc) {
        this.appVersionDesc = appVersionDesc == null ? null : appVersionDesc.trim();
    }

    /**
     * 状态:未发布,预发布,已发布
     * @return java.lang.String
     **/
    public String getAppVersionStatus() {
        return appVersionStatus;
    }

    /**
     * 状态:未发布,预发布,已发布
     * @param appVersionStatus 状态
     **/
    public void setAppVersionStatus(String appVersionStatus) {
        this.appVersionStatus = appVersionStatus == null ? null : appVersionStatus.trim();
    }

    /**
     * 上传时间
     * @return java.util.Date
     **/
    public Date getAppVersionUploadDate() {
        return appVersionUploadDate;
    }

    /**
     * 上传时间
     * @param appVersionUploadDate 上传时间
     **/
    public void setAppVersionUploadDate(Date appVersionUploadDate) {
        this.appVersionUploadDate = appVersionUploadDate;
    }

    /**
     * APK文件路径
     * @return java.lang.String
     **/
    public String getAppVersionFilePath() {
        return appVersionFilePath;
    }

    /**
     * APK文件路径
     * @param appVersionFilePath APK文件路径
     **/
    public void setAppVersionFilePath(String appVersionFilePath) {
        this.appVersionFilePath = appVersionFilePath == null ? null : appVersionFilePath.trim();
    }
}