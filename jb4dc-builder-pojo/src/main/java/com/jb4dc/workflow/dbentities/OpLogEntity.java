package com.jb4dc.workflow.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_op_log
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class OpLogEntity {
    //OP_LOG_ID:
    @DBKeyField
    private String opLogId;

    //OP_LOG_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date opLogCreateTime;

    //OP_LOG_USER_NAME:创建者
    private String opLogUserName;

    //OP_LOG_USER_ID:创建者ID
    private String opLogUserId;

    //OP_LOG_TYPE:日志类型
    private String opLogType;

    //OP_LOG_REF_ID:关联记录ID
    private String opLogRefId;

    //OP_LOG_REF_TYPE:关联记录类型:模型;实例;任务;...
    private String opLogRefType;

    //OP_LOG_TEXT:日志内容
    private String opLogText;

    /**
     * 构造函数
     * @param opLogId
     * @param opLogCreateTime 创建时间
     * @param opLogUserName 创建者
     * @param opLogUserId 创建者ID
     * @param opLogType 日志类型
     * @param opLogRefId 关联记录ID
     * @param opLogRefType 关联记录类型
     * @param opLogText 日志内容
     **/
    public OpLogEntity(String opLogId, Date opLogCreateTime, String opLogUserName, String opLogUserId, String opLogType, String opLogRefId, String opLogRefType, String opLogText) {
        this.opLogId = opLogId;
        this.opLogCreateTime = opLogCreateTime;
        this.opLogUserName = opLogUserName;
        this.opLogUserId = opLogUserId;
        this.opLogType = opLogType;
        this.opLogRefId = opLogRefId;
        this.opLogRefType = opLogRefType;
        this.opLogText = opLogText;
    }

    public OpLogEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getOpLogId() {
        return opLogId;
    }

    /**
     *
     * @param opLogId
     **/
    public void setOpLogId(String opLogId) {
        this.opLogId = opLogId == null ? null : opLogId.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getOpLogCreateTime() {
        return opLogCreateTime;
    }

    /**
     * 创建时间
     * @param opLogCreateTime 创建时间
     **/
    public void setOpLogCreateTime(Date opLogCreateTime) {
        this.opLogCreateTime = opLogCreateTime;
    }

    /**
     * 创建者
     * @return java.lang.String
     **/
    public String getOpLogUserName() {
        return opLogUserName;
    }

    /**
     * 创建者
     * @param opLogUserName 创建者
     **/
    public void setOpLogUserName(String opLogUserName) {
        this.opLogUserName = opLogUserName == null ? null : opLogUserName.trim();
    }

    /**
     * 创建者ID
     * @return java.lang.String
     **/
    public String getOpLogUserId() {
        return opLogUserId;
    }

    /**
     * 创建者ID
     * @param opLogUserId 创建者ID
     **/
    public void setOpLogUserId(String opLogUserId) {
        this.opLogUserId = opLogUserId == null ? null : opLogUserId.trim();
    }

    /**
     * 日志类型
     * @return java.lang.String
     **/
    public String getOpLogType() {
        return opLogType;
    }

    /**
     * 日志类型
     * @param opLogType 日志类型
     **/
    public void setOpLogType(String opLogType) {
        this.opLogType = opLogType == null ? null : opLogType.trim();
    }

    /**
     * 关联记录ID
     * @return java.lang.String
     **/
    public String getOpLogRefId() {
        return opLogRefId;
    }

    /**
     * 关联记录ID
     * @param opLogRefId 关联记录ID
     **/
    public void setOpLogRefId(String opLogRefId) {
        this.opLogRefId = opLogRefId == null ? null : opLogRefId.trim();
    }

    /**
     * 关联记录类型:模型;实例;任务;...
     * @return java.lang.String
     **/
    public String getOpLogRefType() {
        return opLogRefType;
    }

    /**
     * 关联记录类型:模型;实例;任务;...
     * @param opLogRefType 关联记录类型
     **/
    public void setOpLogRefType(String opLogRefType) {
        this.opLogRefType = opLogRefType == null ? null : opLogRefType.trim();
    }

    /**
     * 日志内容
     * @return java.lang.String
     **/
    public String getOpLogText() {
        return opLogText;
    }

    /**
     * 日志内容
     * @param opLogText 日志内容
     **/
    public void setOpLogText(String opLogText) {
        this.opLogText = opLogText == null ? null : opLogText.trim();
    }
}