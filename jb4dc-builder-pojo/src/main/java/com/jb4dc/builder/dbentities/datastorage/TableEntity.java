package com.jb4dc.builder.dbentities.datastorage;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_TABLE
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class TableEntity {
    //TABLE_ID:主键:UUID
    @DBKeyField
    private String tableId;

    //TABLE_CODE:表编号:无特殊作用,序列生成,便于查找,禁止用于开发
    private String tableCode;

    //TABLE_CAPTION:表标题
    private String tableCaption;

    //TABLE_NAME:表名称:在数据库中的名称
    private String tableName;

    //TABLE_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date tableCreateTime;

    //TABLE_CREATOR:创建人
    private String tableCreator;

    //TABLE_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date tableUpdateTime;

    //TABLE_UPDATER:更新人
    private String tableUpdater;

    //TABLE_SERVICE_VALUE:连接服务值
    private String tableServiceValue;

    //TABLE_TYPE:表类型:DBDesign=直接在数据库中设计的,Builder=通过表设计器设计
    private String tableType;

    //TABLE_IS_SYSTEM:是否系统表:系统表不允许修改
    private String tableIsSystem;

    //TABLE_ORDER_NUM:排序号
    private Integer tableOrderNum;

    //TABLE_DESC:备注
    private String tableDesc;

    //TABLE_GROUP_ID:所属分组ID
    private String tableGroupId;

    //TABLE_STATUS:状态
    private String tableStatus;

    //TABLE_ORGAN_ID:组织ID
    private String tableOrganId;

    //TABLE_ORGAN_NAME:组织名称
    private String tableOrganName;

    /**
     * 构造函数
     * @param tableId 主键
     * @param tableCode 表编号
     * @param tableCaption 表标题
     * @param tableName 表名称
     * @param tableCreateTime 创建时间
     * @param tableCreator 创建人
     * @param tableUpdateTime 更新时间
     * @param tableUpdater 更新人
     * @param tableServiceValue 连接服务值
     * @param tableType 表类型
     * @param tableIsSystem 是否系统表
     * @param tableOrderNum 排序号
     * @param tableDesc 备注
     * @param tableGroupId 所属分组ID
     * @param tableStatus 状态
     * @param tableOrganId 组织ID
     * @param tableOrganName 组织名称
     **/
    public TableEntity(String tableId, String tableCode, String tableCaption, String tableName, Date tableCreateTime, String tableCreator, Date tableUpdateTime, String tableUpdater, String tableServiceValue, String tableType, String tableIsSystem, Integer tableOrderNum, String tableDesc, String tableGroupId, String tableStatus, String tableOrganId, String tableOrganName) {
        this.tableId = tableId;
        this.tableCode = tableCode;
        this.tableCaption = tableCaption;
        this.tableName = tableName;
        this.tableCreateTime = tableCreateTime;
        this.tableCreator = tableCreator;
        this.tableUpdateTime = tableUpdateTime;
        this.tableUpdater = tableUpdater;
        this.tableServiceValue = tableServiceValue;
        this.tableType = tableType;
        this.tableIsSystem = tableIsSystem;
        this.tableOrderNum = tableOrderNum;
        this.tableDesc = tableDesc;
        this.tableGroupId = tableGroupId;
        this.tableStatus = tableStatus;
        this.tableOrganId = tableOrganId;
        this.tableOrganName = tableOrganName;
    }

    public TableEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getTableId() {
        return tableId;
    }

    /**
     * 主键:UUID
     * @param tableId 主键
     **/
    public void setTableId(String tableId) {
        this.tableId = tableId == null ? null : tableId.trim();
    }

    /**
     * 表编号:无特殊作用,序列生成,便于查找,禁止用于开发
     * @return java.lang.String
     **/
    public String getTableCode() {
        return tableCode;
    }

    /**
     * 表编号:无特殊作用,序列生成,便于查找,禁止用于开发
     * @param tableCode 表编号
     **/
    public void setTableCode(String tableCode) {
        this.tableCode = tableCode == null ? null : tableCode.trim();
    }

    /**
     * 表标题
     * @return java.lang.String
     **/
    public String getTableCaption() {
        return tableCaption;
    }

    /**
     * 表标题
     * @param tableCaption 表标题
     **/
    public void setTableCaption(String tableCaption) {
        this.tableCaption = tableCaption == null ? null : tableCaption.trim();
    }

    /**
     * 表名称:在数据库中的名称
     * @return java.lang.String
     **/
    public String getTableName() {
        return tableName;
    }

    /**
     * 表名称:在数据库中的名称
     * @param tableName 表名称
     **/
    public void setTableName(String tableName) {
        this.tableName = tableName == null ? null : tableName.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getTableCreateTime() {
        return tableCreateTime;
    }

    /**
     * 创建时间
     * @param tableCreateTime 创建时间
     **/
    public void setTableCreateTime(Date tableCreateTime) {
        this.tableCreateTime = tableCreateTime;
    }

    /**
     * 创建人
     * @return java.lang.String
     **/
    public String getTableCreator() {
        return tableCreator;
    }

    /**
     * 创建人
     * @param tableCreator 创建人
     **/
    public void setTableCreator(String tableCreator) {
        this.tableCreator = tableCreator == null ? null : tableCreator.trim();
    }

    /**
     * 更新时间
     * @return java.util.Date
     **/
    public Date getTableUpdateTime() {
        return tableUpdateTime;
    }

    /**
     * 更新时间
     * @param tableUpdateTime 更新时间
     **/
    public void setTableUpdateTime(Date tableUpdateTime) {
        this.tableUpdateTime = tableUpdateTime;
    }

    /**
     * 更新人
     * @return java.lang.String
     **/
    public String getTableUpdater() {
        return tableUpdater;
    }

    /**
     * 更新人
     * @param tableUpdater 更新人
     **/
    public void setTableUpdater(String tableUpdater) {
        this.tableUpdater = tableUpdater == null ? null : tableUpdater.trim();
    }

    /**
     * 连接服务值
     * @return java.lang.String
     **/
    public String getTableServiceValue() {
        return tableServiceValue;
    }

    /**
     * 连接服务值
     * @param tableServiceValue 连接服务值
     **/
    public void setTableServiceValue(String tableServiceValue) {
        this.tableServiceValue = tableServiceValue == null ? null : tableServiceValue.trim();
    }

    /**
     * 表类型:DBDesign=直接在数据库中设计的,Builder=通过表设计器设计
     * @return java.lang.String
     **/
    public String getTableType() {
        return tableType;
    }

    /**
     * 表类型:DBDesign=直接在数据库中设计的,Builder=通过表设计器设计
     * @param tableType 表类型
     **/
    public void setTableType(String tableType) {
        this.tableType = tableType == null ? null : tableType.trim();
    }

    /**
     * 是否系统表:系统表不允许修改
     * @return java.lang.String
     **/
    public String getTableIsSystem() {
        return tableIsSystem;
    }

    /**
     * 是否系统表:系统表不允许修改
     * @param tableIsSystem 是否系统表
     **/
    public void setTableIsSystem(String tableIsSystem) {
        this.tableIsSystem = tableIsSystem == null ? null : tableIsSystem.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getTableOrderNum() {
        return tableOrderNum;
    }

    /**
     * 排序号
     * @param tableOrderNum 排序号
     **/
    public void setTableOrderNum(Integer tableOrderNum) {
        this.tableOrderNum = tableOrderNum;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getTableDesc() {
        return tableDesc;
    }

    /**
     * 备注
     * @param tableDesc 备注
     **/
    public void setTableDesc(String tableDesc) {
        this.tableDesc = tableDesc == null ? null : tableDesc.trim();
    }

    /**
     * 所属分组ID
     * @return java.lang.String
     **/
    public String getTableGroupId() {
        return tableGroupId;
    }

    /**
     * 所属分组ID
     * @param tableGroupId 所属分组ID
     **/
    public void setTableGroupId(String tableGroupId) {
        this.tableGroupId = tableGroupId == null ? null : tableGroupId.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getTableStatus() {
        return tableStatus;
    }

    /**
     * 状态
     * @param tableStatus 状态
     **/
    public void setTableStatus(String tableStatus) {
        this.tableStatus = tableStatus == null ? null : tableStatus.trim();
    }

    /**
     * 组织ID
     * @return java.lang.String
     **/
    public String getTableOrganId() {
        return tableOrganId;
    }

    /**
     * 组织ID
     * @param tableOrganId 组织ID
     **/
    public void setTableOrganId(String tableOrganId) {
        this.tableOrganId = tableOrganId == null ? null : tableOrganId.trim();
    }

    /**
     * 组织名称
     * @return java.lang.String
     **/
    public String getTableOrganName() {
        return tableOrganName;
    }

    /**
     * 组织名称
     * @param tableOrganName 组织名称
     **/
    public void setTableOrganName(String tableOrganName) {
        this.tableOrganName = tableOrganName == null ? null : tableOrganName.trim();
    }
}