package com.jb4dc.gridsystem.dbentities.terminal;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tgrid_gather_terminal_info
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class GatherTerminalInfoEntity {
    //TERMINAL_ID:
    @DBKeyField
    private String terminalId;

    //TERMINAL_USER_NAME:持有人姓名
    private String terminalUserName;

    //TERMINAL_USER_ID:持有人ID
    private String terminalUserId;

    //TERMINAL_STATUS:状态:正常,丢失,报废
    private String terminalStatus;

    //TERMINAL_CODE:唯一编码
    private String terminalCode;

    //TERMINAL_DESC:设备说明
    private String terminalDesc;

    //TERMINAL_REMARK:备注
    private String terminalRemark;

    //TERMINAL_MANAGE_UNIT_NAME:管理单位
    private String terminalManageUnitName;

    //TERMINAL_MANAGE_UNIT_ID:
    private String terminalManageUnitId;

    //TERMINAL_MANAGE_DATE:登记时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date terminalManageDate;

    //TERMINAL_MANAGE_USER_NAME:管理人
    private String terminalManageUserName;

    //TERMINAL_MANAGE_USER_ID:
    private String terminalManageUserId;

    //TERMINAL_ORDER_NUM:排序号
    private Integer terminalOrderNum;

    /**
     * 构造函数
     * @param terminalId
     * @param terminalUserName 持有人姓名
     * @param terminalUserId 持有人ID
     * @param terminalStatus 状态
     * @param terminalCode 唯一编码
     * @param terminalDesc 设备说明
     * @param terminalRemark 备注
     * @param terminalManageUnitName 管理单位
     * @param terminalManageUnitId
     * @param terminalManageDate 登记时间
     * @param terminalManageUserName 管理人
     * @param terminalManageUserId
     * @param terminalOrderNum 排序号
     **/
    public GatherTerminalInfoEntity(String terminalId, String terminalUserName, String terminalUserId, String terminalStatus, String terminalCode, String terminalDesc, String terminalRemark, String terminalManageUnitName, String terminalManageUnitId, Date terminalManageDate, String terminalManageUserName, String terminalManageUserId, Integer terminalOrderNum) {
        this.terminalId = terminalId;
        this.terminalUserName = terminalUserName;
        this.terminalUserId = terminalUserId;
        this.terminalStatus = terminalStatus;
        this.terminalCode = terminalCode;
        this.terminalDesc = terminalDesc;
        this.terminalRemark = terminalRemark;
        this.terminalManageUnitName = terminalManageUnitName;
        this.terminalManageUnitId = terminalManageUnitId;
        this.terminalManageDate = terminalManageDate;
        this.terminalManageUserName = terminalManageUserName;
        this.terminalManageUserId = terminalManageUserId;
        this.terminalOrderNum = terminalOrderNum;
    }

    public GatherTerminalInfoEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getTerminalId() {
        return terminalId;
    }

    /**
     *
     * @param terminalId
     **/
    public void setTerminalId(String terminalId) {
        this.terminalId = terminalId == null ? null : terminalId.trim();
    }

    /**
     * 持有人姓名
     * @return java.lang.String
     **/
    public String getTerminalUserName() {
        return terminalUserName;
    }

    /**
     * 持有人姓名
     * @param terminalUserName 持有人姓名
     **/
    public void setTerminalUserName(String terminalUserName) {
        this.terminalUserName = terminalUserName == null ? null : terminalUserName.trim();
    }

    /**
     * 持有人ID
     * @return java.lang.String
     **/
    public String getTerminalUserId() {
        return terminalUserId;
    }

    /**
     * 持有人ID
     * @param terminalUserId 持有人ID
     **/
    public void setTerminalUserId(String terminalUserId) {
        this.terminalUserId = terminalUserId == null ? null : terminalUserId.trim();
    }

    /**
     * 状态:正常,丢失,报废
     * @return java.lang.String
     **/
    public String getTerminalStatus() {
        return terminalStatus;
    }

    /**
     * 状态:正常,丢失,报废
     * @param terminalStatus 状态
     **/
    public void setTerminalStatus(String terminalStatus) {
        this.terminalStatus = terminalStatus == null ? null : terminalStatus.trim();
    }

    /**
     * 唯一编码
     * @return java.lang.String
     **/
    public String getTerminalCode() {
        return terminalCode;
    }

    /**
     * 唯一编码
     * @param terminalCode 唯一编码
     **/
    public void setTerminalCode(String terminalCode) {
        this.terminalCode = terminalCode == null ? null : terminalCode.trim();
    }

    /**
     * 设备说明
     * @return java.lang.String
     **/
    public String getTerminalDesc() {
        return terminalDesc;
    }

    /**
     * 设备说明
     * @param terminalDesc 设备说明
     **/
    public void setTerminalDesc(String terminalDesc) {
        this.terminalDesc = terminalDesc == null ? null : terminalDesc.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getTerminalRemark() {
        return terminalRemark;
    }

    /**
     * 备注
     * @param terminalRemark 备注
     **/
    public void setTerminalRemark(String terminalRemark) {
        this.terminalRemark = terminalRemark == null ? null : terminalRemark.trim();
    }

    /**
     * 管理单位
     * @return java.lang.String
     **/
    public String getTerminalManageUnitName() {
        return terminalManageUnitName;
    }

    /**
     * 管理单位
     * @param terminalManageUnitName 管理单位
     **/
    public void setTerminalManageUnitName(String terminalManageUnitName) {
        this.terminalManageUnitName = terminalManageUnitName == null ? null : terminalManageUnitName.trim();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getTerminalManageUnitId() {
        return terminalManageUnitId;
    }

    /**
     *
     * @param terminalManageUnitId
     **/
    public void setTerminalManageUnitId(String terminalManageUnitId) {
        this.terminalManageUnitId = terminalManageUnitId == null ? null : terminalManageUnitId.trim();
    }

    /**
     * 登记时间
     * @return java.util.Date
     **/
    public Date getTerminalManageDate() {
        return terminalManageDate;
    }

    /**
     * 登记时间
     * @param terminalManageDate 登记时间
     **/
    public void setTerminalManageDate(Date terminalManageDate) {
        this.terminalManageDate = terminalManageDate;
    }

    /**
     * 管理人
     * @return java.lang.String
     **/
    public String getTerminalManageUserName() {
        return terminalManageUserName;
    }

    /**
     * 管理人
     * @param terminalManageUserName 管理人
     **/
    public void setTerminalManageUserName(String terminalManageUserName) {
        this.terminalManageUserName = terminalManageUserName == null ? null : terminalManageUserName.trim();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getTerminalManageUserId() {
        return terminalManageUserId;
    }

    /**
     *
     * @param terminalManageUserId
     **/
    public void setTerminalManageUserId(String terminalManageUserId) {
        this.terminalManageUserId = terminalManageUserId == null ? null : terminalManageUserId.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getTerminalOrderNum() {
        return terminalOrderNum;
    }

    /**
     * 排序号
     * @param terminalOrderNum 排序号
     **/
    public void setTerminalOrderNum(Integer terminalOrderNum) {
        this.terminalOrderNum = terminalOrderNum;
    }
}