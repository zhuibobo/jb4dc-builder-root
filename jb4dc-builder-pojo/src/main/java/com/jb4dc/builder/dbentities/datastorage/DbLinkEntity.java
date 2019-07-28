package com.jb4dc.builder.dbentities.datastorage;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_DB_LINK
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class DbLinkEntity {
    //DB_ID:主键:UUID
    @DBKeyField
    private String dbId;

    //DB_LINK_VALUE:值,唯一
    private String dbLinkValue;

    //DB_LINK_NAME:数据库名称
    private String dbLinkName;

    //DB_TYPE:数据库类型
    private String dbType;

    //DB_DRIVER_NAME:驱动程序名称
    private String dbDriverName;

    //DB_DATABASE_NAME:数据库名称
    private String dbDatabaseName;

    //DB_URL:数据库URL地址
    private String dbUrl;

    //DB_USER:用户名
    private String dbUser;

    //DB_PASSWORD:密码
    private String dbPassword;

    //DB_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date dbCreateTime;

    //DB_ORDER_NUM:排序号
    private Integer dbOrderNum;

    //DB_DESC:备注
    private String dbDesc;

    //DB_IS_LOCATION:是否本地库,构建库与业务库一体
    private String dbIsLocation;

    //DB_STATUS:状态
    private String dbStatus;

    //DB_ORGAN_ID:组织ID
    private String dbOrganId;

    //DB_ORGAN_NAME:组织名称
    private String dbOrganName;

    /**
     * 构造函数
     * @param dbId 主键
     * @param dbLinkValue 值,唯一
     * @param dbLinkName 数据库名称
     * @param dbType 数据库类型
     * @param dbDriverName 驱动程序名称
     * @param dbDatabaseName 数据库名称
     * @param dbUrl 数据库URL地址
     * @param dbUser 用户名
     * @param dbPassword 密码
     * @param dbCreateTime 创建时间
     * @param dbOrderNum 排序号
     * @param dbDesc 备注
     * @param dbIsLocation 是否本地库,构建库与业务库一体
     * @param dbStatus 状态
     * @param dbOrganId 组织ID
     * @param dbOrganName 组织名称
     **/
    public DbLinkEntity(String dbId, String dbLinkValue, String dbLinkName, String dbType, String dbDriverName, String dbDatabaseName, String dbUrl, String dbUser, String dbPassword, Date dbCreateTime, Integer dbOrderNum, String dbDesc, String dbIsLocation, String dbStatus, String dbOrganId, String dbOrganName) {
        this.dbId = dbId;
        this.dbLinkValue = dbLinkValue;
        this.dbLinkName = dbLinkName;
        this.dbType = dbType;
        this.dbDriverName = dbDriverName;
        this.dbDatabaseName = dbDatabaseName;
        this.dbUrl = dbUrl;
        this.dbUser = dbUser;
        this.dbPassword = dbPassword;
        this.dbCreateTime = dbCreateTime;
        this.dbOrderNum = dbOrderNum;
        this.dbDesc = dbDesc;
        this.dbIsLocation = dbIsLocation;
        this.dbStatus = dbStatus;
        this.dbOrganId = dbOrganId;
        this.dbOrganName = dbOrganName;
    }

    public DbLinkEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getDbId() {
        return dbId;
    }

    /**
     * 主键:UUID
     * @param dbId 主键
     **/
    public void setDbId(String dbId) {
        this.dbId = dbId == null ? null : dbId.trim();
    }

    /**
     * 值,唯一
     * @return java.lang.String
     **/
    public String getDbLinkValue() {
        return dbLinkValue;
    }

    /**
     * 值,唯一
     * @param dbLinkValue 值,唯一
     **/
    public void setDbLinkValue(String dbLinkValue) {
        this.dbLinkValue = dbLinkValue == null ? null : dbLinkValue.trim();
    }

    /**
     * 数据库名称
     * @return java.lang.String
     **/
    public String getDbLinkName() {
        return dbLinkName;
    }

    /**
     * 数据库名称
     * @param dbLinkName 数据库名称
     **/
    public void setDbLinkName(String dbLinkName) {
        this.dbLinkName = dbLinkName == null ? null : dbLinkName.trim();
    }

    /**
     * 数据库类型
     * @return java.lang.String
     **/
    public String getDbType() {
        return dbType;
    }

    /**
     * 数据库类型
     * @param dbType 数据库类型
     **/
    public void setDbType(String dbType) {
        this.dbType = dbType == null ? null : dbType.trim();
    }

    /**
     * 驱动程序名称
     * @return java.lang.String
     **/
    public String getDbDriverName() {
        return dbDriverName;
    }

    /**
     * 驱动程序名称
     * @param dbDriverName 驱动程序名称
     **/
    public void setDbDriverName(String dbDriverName) {
        this.dbDriverName = dbDriverName == null ? null : dbDriverName.trim();
    }

    /**
     * 数据库名称
     * @return java.lang.String
     **/
    public String getDbDatabaseName() {
        return dbDatabaseName;
    }

    /**
     * 数据库名称
     * @param dbDatabaseName 数据库名称
     **/
    public void setDbDatabaseName(String dbDatabaseName) {
        this.dbDatabaseName = dbDatabaseName == null ? null : dbDatabaseName.trim();
    }

    /**
     * 数据库URL地址
     * @return java.lang.String
     **/
    public String getDbUrl() {
        return dbUrl;
    }

    /**
     * 数据库URL地址
     * @param dbUrl 数据库URL地址
     **/
    public void setDbUrl(String dbUrl) {
        this.dbUrl = dbUrl == null ? null : dbUrl.trim();
    }

    /**
     * 用户名
     * @return java.lang.String
     **/
    public String getDbUser() {
        return dbUser;
    }

    /**
     * 用户名
     * @param dbUser 用户名
     **/
    public void setDbUser(String dbUser) {
        this.dbUser = dbUser == null ? null : dbUser.trim();
    }

    /**
     * 密码
     * @return java.lang.String
     **/
    public String getDbPassword() {
        return dbPassword;
    }

    /**
     * 密码
     * @param dbPassword 密码
     **/
    public void setDbPassword(String dbPassword) {
        this.dbPassword = dbPassword == null ? null : dbPassword.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getDbCreateTime() {
        return dbCreateTime;
    }

    /**
     * 创建时间
     * @param dbCreateTime 创建时间
     **/
    public void setDbCreateTime(Date dbCreateTime) {
        this.dbCreateTime = dbCreateTime;
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getDbOrderNum() {
        return dbOrderNum;
    }

    /**
     * 排序号
     * @param dbOrderNum 排序号
     **/
    public void setDbOrderNum(Integer dbOrderNum) {
        this.dbOrderNum = dbOrderNum;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getDbDesc() {
        return dbDesc;
    }

    /**
     * 备注
     * @param dbDesc 备注
     **/
    public void setDbDesc(String dbDesc) {
        this.dbDesc = dbDesc == null ? null : dbDesc.trim();
    }

    /**
     * 是否本地库,构建库与业务库一体
     * @return java.lang.String
     **/
    public String getDbIsLocation() {
        return dbIsLocation;
    }

    /**
     * 是否本地库,构建库与业务库一体
     * @param dbIsLocation 是否本地库,构建库与业务库一体
     **/
    public void setDbIsLocation(String dbIsLocation) {
        this.dbIsLocation = dbIsLocation == null ? null : dbIsLocation.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getDbStatus() {
        return dbStatus;
    }

    /**
     * 状态
     * @param dbStatus 状态
     **/
    public void setDbStatus(String dbStatus) {
        this.dbStatus = dbStatus == null ? null : dbStatus.trim();
    }

    /**
     * 组织ID
     * @return java.lang.String
     **/
    public String getDbOrganId() {
        return dbOrganId;
    }

    /**
     * 组织ID
     * @param dbOrganId 组织ID
     **/
    public void setDbOrganId(String dbOrganId) {
        this.dbOrganId = dbOrganId == null ? null : dbOrganId.trim();
    }

    /**
     * 组织名称
     * @return java.lang.String
     **/
    public String getDbOrganName() {
        return dbOrganName;
    }

    /**
     * 组织名称
     * @param dbOrganName 组织名称
     **/
    public void setDbOrganName(String dbOrganName) {
        this.dbOrganName = dbOrganName == null ? null : dbOrganName.trim();
    }
}