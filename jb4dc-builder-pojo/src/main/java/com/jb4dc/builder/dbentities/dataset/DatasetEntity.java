package com.jb4dc.builder.dbentities.dataset;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_DATASET
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class DatasetEntity {
    //DS_ID:主键:UUID
    @DBKeyField
    private String dsId;

    //DS_CODE:数据集编号:无特殊作用,序列生成,便于查找,禁止用于开发
    private String dsCode;

    //DS_CAPTION:数据集标题
    private String dsCaption;

    //DS_NAME:数据集名称
    private String dsName;

    //DS_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date dsCreateTime;

    //DS_CREATOR:创建人
    private String dsCreator;

    //DS_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date dsUpdateTime;

    //DS_UPDATER:更新人
    private String dsUpdater;

    //DS_TYPE:类型
    private String dsType;

    //DS_IS_SYSTEM:是否系统所有
    private String dsIsSystem;

    //DS_ORDER_NUM:排序号
    private Integer dsOrderNum;

    //DS_DESC:备注
    private String dsDesc;

    //DS_GROUP_ID:所属分组ID
    private String dsGroupId;

    //DS_STATUS:状态
    private String dsStatus;

    //DS_SQL_SELECT_TEXT:查询的SQL原始文本
    private String dsSqlSelectText;

    //DS_SQL_SELECT_VALUE:实际用于查询的SQL
    private String dsSqlSelectValue;

    //DS_SQL_DB_LINK_ID:数据库连接ID:数据集为SQL形成时,目标库的ID
    private String dsSqlDbLinkId;

    //DS_CLASS_NAME:API类的名称
    private String dsClassName;

    //DS_REST_STRUCTURE_URL:REST数据集结构的接口地址
    private String dsRestStructureUrl;

    //DS_REST_DATA_URL:REST数据集的接口地址
    private String dsRestDataUrl;

    //DS_ORGAN_ID:组织ID
    private String dsOrganId;

    //DS_ORGAN_NAME:组织名称
    private String dsOrganName;

    /**
     * 构造函数
     * @param dsId 主键
     * @param dsCode 数据集编号
     * @param dsCaption 数据集标题
     * @param dsName 数据集名称
     * @param dsCreateTime 创建时间
     * @param dsCreator 创建人
     * @param dsUpdateTime 更新时间
     * @param dsUpdater 更新人
     * @param dsType 类型
     * @param dsIsSystem 是否系统所有
     * @param dsOrderNum 排序号
     * @param dsDesc 备注
     * @param dsGroupId 所属分组ID
     * @param dsStatus 状态
     * @param dsSqlSelectText 查询的SQL原始文本
     * @param dsSqlSelectValue 实际用于查询的SQL
     * @param dsSqlDbLinkId 数据库连接ID
     * @param dsClassName API类的名称
     * @param dsRestStructureUrl REST数据集结构的接口地址
     * @param dsRestDataUrl REST数据集的接口地址
     * @param dsOrganId 组织ID
     * @param dsOrganName 组织名称
     **/
    public DatasetEntity(String dsId, String dsCode, String dsCaption, String dsName, Date dsCreateTime, String dsCreator, Date dsUpdateTime, String dsUpdater, String dsType, String dsIsSystem, Integer dsOrderNum, String dsDesc, String dsGroupId, String dsStatus, String dsSqlSelectText, String dsSqlSelectValue, String dsSqlDbLinkId, String dsClassName, String dsRestStructureUrl, String dsRestDataUrl, String dsOrganId, String dsOrganName) {
        this.dsId = dsId;
        this.dsCode = dsCode;
        this.dsCaption = dsCaption;
        this.dsName = dsName;
        this.dsCreateTime = dsCreateTime;
        this.dsCreator = dsCreator;
        this.dsUpdateTime = dsUpdateTime;
        this.dsUpdater = dsUpdater;
        this.dsType = dsType;
        this.dsIsSystem = dsIsSystem;
        this.dsOrderNum = dsOrderNum;
        this.dsDesc = dsDesc;
        this.dsGroupId = dsGroupId;
        this.dsStatus = dsStatus;
        this.dsSqlSelectText = dsSqlSelectText;
        this.dsSqlSelectValue = dsSqlSelectValue;
        this.dsSqlDbLinkId = dsSqlDbLinkId;
        this.dsClassName = dsClassName;
        this.dsRestStructureUrl = dsRestStructureUrl;
        this.dsRestDataUrl = dsRestDataUrl;
        this.dsOrganId = dsOrganId;
        this.dsOrganName = dsOrganName;
    }

    public DatasetEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getDsId() {
        return dsId;
    }

    /**
     * 主键:UUID
     * @param dsId 主键
     **/
    public void setDsId(String dsId) {
        this.dsId = dsId == null ? null : dsId.trim();
    }

    /**
     * 数据集编号:无特殊作用,序列生成,便于查找,禁止用于开发
     * @return java.lang.String
     **/
    public String getDsCode() {
        return dsCode;
    }

    /**
     * 数据集编号:无特殊作用,序列生成,便于查找,禁止用于开发
     * @param dsCode 数据集编号
     **/
    public void setDsCode(String dsCode) {
        this.dsCode = dsCode == null ? null : dsCode.trim();
    }

    /**
     * 数据集标题
     * @return java.lang.String
     **/
    public String getDsCaption() {
        return dsCaption;
    }

    /**
     * 数据集标题
     * @param dsCaption 数据集标题
     **/
    public void setDsCaption(String dsCaption) {
        this.dsCaption = dsCaption == null ? null : dsCaption.trim();
    }

    /**
     * 数据集名称
     * @return java.lang.String
     **/
    public String getDsName() {
        return dsName;
    }

    /**
     * 数据集名称
     * @param dsName 数据集名称
     **/
    public void setDsName(String dsName) {
        this.dsName = dsName == null ? null : dsName.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getDsCreateTime() {
        return dsCreateTime;
    }

    /**
     * 创建时间
     * @param dsCreateTime 创建时间
     **/
    public void setDsCreateTime(Date dsCreateTime) {
        this.dsCreateTime = dsCreateTime;
    }

    /**
     * 创建人
     * @return java.lang.String
     **/
    public String getDsCreator() {
        return dsCreator;
    }

    /**
     * 创建人
     * @param dsCreator 创建人
     **/
    public void setDsCreator(String dsCreator) {
        this.dsCreator = dsCreator == null ? null : dsCreator.trim();
    }

    /**
     * 更新时间
     * @return java.util.Date
     **/
    public Date getDsUpdateTime() {
        return dsUpdateTime;
    }

    /**
     * 更新时间
     * @param dsUpdateTime 更新时间
     **/
    public void setDsUpdateTime(Date dsUpdateTime) {
        this.dsUpdateTime = dsUpdateTime;
    }

    /**
     * 更新人
     * @return java.lang.String
     **/
    public String getDsUpdater() {
        return dsUpdater;
    }

    /**
     * 更新人
     * @param dsUpdater 更新人
     **/
    public void setDsUpdater(String dsUpdater) {
        this.dsUpdater = dsUpdater == null ? null : dsUpdater.trim();
    }

    /**
     * 类型
     * @return java.lang.String
     **/
    public String getDsType() {
        return dsType;
    }

    /**
     * 类型
     * @param dsType 类型
     **/
    public void setDsType(String dsType) {
        this.dsType = dsType == null ? null : dsType.trim();
    }

    /**
     * 是否系统所有
     * @return java.lang.String
     **/
    public String getDsIsSystem() {
        return dsIsSystem;
    }

    /**
     * 是否系统所有
     * @param dsIsSystem 是否系统所有
     **/
    public void setDsIsSystem(String dsIsSystem) {
        this.dsIsSystem = dsIsSystem == null ? null : dsIsSystem.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getDsOrderNum() {
        return dsOrderNum;
    }

    /**
     * 排序号
     * @param dsOrderNum 排序号
     **/
    public void setDsOrderNum(Integer dsOrderNum) {
        this.dsOrderNum = dsOrderNum;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getDsDesc() {
        return dsDesc;
    }

    /**
     * 备注
     * @param dsDesc 备注
     **/
    public void setDsDesc(String dsDesc) {
        this.dsDesc = dsDesc == null ? null : dsDesc.trim();
    }

    /**
     * 所属分组ID
     * @return java.lang.String
     **/
    public String getDsGroupId() {
        return dsGroupId;
    }

    /**
     * 所属分组ID
     * @param dsGroupId 所属分组ID
     **/
    public void setDsGroupId(String dsGroupId) {
        this.dsGroupId = dsGroupId == null ? null : dsGroupId.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getDsStatus() {
        return dsStatus;
    }

    /**
     * 状态
     * @param dsStatus 状态
     **/
    public void setDsStatus(String dsStatus) {
        this.dsStatus = dsStatus == null ? null : dsStatus.trim();
    }

    /**
     * 查询的SQL原始文本
     * @return java.lang.String
     **/
    public String getDsSqlSelectText() {
        return dsSqlSelectText;
    }

    /**
     * 查询的SQL原始文本
     * @param dsSqlSelectText 查询的SQL原始文本
     **/
    public void setDsSqlSelectText(String dsSqlSelectText) {
        this.dsSqlSelectText = dsSqlSelectText == null ? null : dsSqlSelectText.trim();
    }

    /**
     * 实际用于查询的SQL
     * @return java.lang.String
     **/
    public String getDsSqlSelectValue() {
        return dsSqlSelectValue;
    }

    /**
     * 实际用于查询的SQL
     * @param dsSqlSelectValue 实际用于查询的SQL
     **/
    public void setDsSqlSelectValue(String dsSqlSelectValue) {
        this.dsSqlSelectValue = dsSqlSelectValue == null ? null : dsSqlSelectValue.trim();
    }

    /**
     * 数据库连接ID:数据集为SQL形成时,目标库的ID
     * @return java.lang.String
     **/
    public String getDsSqlDbLinkId() {
        return dsSqlDbLinkId;
    }

    /**
     * 数据库连接ID:数据集为SQL形成时,目标库的ID
     * @param dsSqlDbLinkId 数据库连接ID
     **/
    public void setDsSqlDbLinkId(String dsSqlDbLinkId) {
        this.dsSqlDbLinkId = dsSqlDbLinkId == null ? null : dsSqlDbLinkId.trim();
    }

    /**
     * API类的名称
     * @return java.lang.String
     **/
    public String getDsClassName() {
        return dsClassName;
    }

    /**
     * API类的名称
     * @param dsClassName API类的名称
     **/
    public void setDsClassName(String dsClassName) {
        this.dsClassName = dsClassName == null ? null : dsClassName.trim();
    }

    /**
     * REST数据集结构的接口地址
     * @return java.lang.String
     **/
    public String getDsRestStructureUrl() {
        return dsRestStructureUrl;
    }

    /**
     * REST数据集结构的接口地址
     * @param dsRestStructureUrl REST数据集结构的接口地址
     **/
    public void setDsRestStructureUrl(String dsRestStructureUrl) {
        this.dsRestStructureUrl = dsRestStructureUrl == null ? null : dsRestStructureUrl.trim();
    }

    /**
     * REST数据集的接口地址
     * @return java.lang.String
     **/
    public String getDsRestDataUrl() {
        return dsRestDataUrl;
    }

    /**
     * REST数据集的接口地址
     * @param dsRestDataUrl REST数据集的接口地址
     **/
    public void setDsRestDataUrl(String dsRestDataUrl) {
        this.dsRestDataUrl = dsRestDataUrl == null ? null : dsRestDataUrl.trim();
    }

    /**
     * 组织ID
     * @return java.lang.String
     **/
    public String getDsOrganId() {
        return dsOrganId;
    }

    /**
     * 组织ID
     * @param dsOrganId 组织ID
     **/
    public void setDsOrganId(String dsOrganId) {
        this.dsOrganId = dsOrganId == null ? null : dsOrganId.trim();
    }

    /**
     * 组织名称
     * @return java.lang.String
     **/
    public String getDsOrganName() {
        return dsOrganName;
    }

    /**
     * 组织名称
     * @param dsOrganName 组织名称
     **/
    public void setDsOrganName(String dsOrganName) {
        this.dsOrganName = dsOrganName == null ? null : dsOrganName.trim();
    }
}