package com.jb4dc.workflow.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_execution_task_log
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ExecutionTaskLogEntity {
    //LOG_ID:
    @DBKeyField
    private String logId;

    //LOG_EXTASK_ID:关联TFLOW_EXECUTION_TASK的EXTASK_ID
    private String logExtaskId;

    //LOG_TYPE:日志类型:START[初始日志],VIEW[查看日志],TEMPORARY[暂存日志],END[办结日志]
    private String logType;

    //LOG_CREATE_TIME:日志创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date logCreateTime;

    //LOG_ORDER_NUM:排序号
    private Integer logOrderNum;

    //LOG_FOR_USER_ID:关联用户ID
    private String logForUserId;

    //LOG_FOR_USER_NAME:关联用户名称
    private String logForUserName;

    //LOG_FOR_ORGAN_ID:关联用户组织ID
    private String logForOrganId;

    //LOG_FOR_ORGAN_NAME:关联用户组织名称
    private String logForOrganName;

    //LOG_PRE_NODE_KEY:前一个流程节点ID
    private String logPreNodeKey;

    //LOG_PRE_NODE_NAME:前一个流程节点名称
    private String logPreNodeName;

    //LOG_CUR_NODE_KEY:当前流程节点ID:关联act_ru_task的TASK_DEF_KEY_
    private String logCurNodeKey;

    //LOG_CUR_NODE_NAME:当前流程节点名称:关联act_ru_task的NAME_
    private String logCurNodeName;

    //LOG_HANDLE_ACTION_KEY:处理动作Key
    private String logHandleActionKey;

    //LOG_HANDLE_ACTION_NAME:处理动作名称
    private String logHandleActionName;

    //LOG_CLIENT_TYPE:客户端类型:Android;IOS;Web
    private String logClientType;

    //LOG_CLIENT_VERSION:客户端版本号
    private String logClientVersion;

    //LOG_BUSINESS_KEY:业务数据ID
    private String logBusinessKey;

    //LOG_FILE_DRAFT_SID:文件稿纸原始ID
    private String logFileDraftSid;

    //LOG_FILE_DRAFT_NID:文件稿纸新ID
    private String logFileDraftNid;

    //LOG_FILE_DRAFT_CDBID:文件稿纸提交时数据存储记录ID
    private String logFileDraftCdbid;

    //LOG_FILE_DOC_SID:文件正文原始ID
    private String logFileDocSid;

    //LOG_FILE_DOC_NID:文件正文新ID
    private String logFileDocNid;

    //LOG_FILE_DOC_CDBID:文件正文提交时数据存储记录ID
    private String logFileDocCdbid;

    //LOG_TASK_IS_MULTI:是否多实例任务
    private String logTaskIsMulti;

    //LOG_TASK_IS_PARALLEL:是否并行多实例任务
    private String logTaskIsParallel;

    //LOG_STATUS:状态
    private String logStatus;

    /**
     * 构造函数
     * @param logId
     * @param logExtaskId 关联TFLOW_EXECUTION_TASK的EXTASK_ID
     * @param logType 日志类型
     * @param logCreateTime 日志创建时间
     * @param logOrderNum 排序号
     * @param logForUserId 关联用户ID
     * @param logForUserName 关联用户名称
     * @param logForOrganId 关联用户组织ID
     * @param logForOrganName 关联用户组织名称
     * @param logPreNodeKey 前一个流程节点ID
     * @param logPreNodeName 前一个流程节点名称
     * @param logCurNodeKey 当前流程节点ID
     * @param logCurNodeName 当前流程节点名称
     * @param logHandleActionKey 处理动作Key
     * @param logHandleActionName 处理动作名称
     * @param logClientType 客户端类型
     * @param logClientVersion 客户端版本号
     * @param logBusinessKey 业务数据ID
     * @param logFileDraftSid 文件稿纸原始ID
     * @param logFileDraftNid 文件稿纸新ID
     * @param logFileDraftCdbid 文件稿纸提交时数据存储记录ID
     * @param logFileDocSid 文件正文原始ID
     * @param logFileDocNid 文件正文新ID
     * @param logFileDocCdbid 文件正文提交时数据存储记录ID
     * @param logTaskIsMulti 是否多实例任务
     * @param logTaskIsParallel 是否并行多实例任务
     * @param logStatus 状态
     **/
    public ExecutionTaskLogEntity(String logId, String logExtaskId, String logType, Date logCreateTime, Integer logOrderNum, String logForUserId, String logForUserName, String logForOrganId, String logForOrganName, String logPreNodeKey, String logPreNodeName, String logCurNodeKey, String logCurNodeName, String logHandleActionKey, String logHandleActionName, String logClientType, String logClientVersion, String logBusinessKey, String logFileDraftSid, String logFileDraftNid, String logFileDraftCdbid, String logFileDocSid, String logFileDocNid, String logFileDocCdbid, String logTaskIsMulti, String logTaskIsParallel, String logStatus) {
        this.logId = logId;
        this.logExtaskId = logExtaskId;
        this.logType = logType;
        this.logCreateTime = logCreateTime;
        this.logOrderNum = logOrderNum;
        this.logForUserId = logForUserId;
        this.logForUserName = logForUserName;
        this.logForOrganId = logForOrganId;
        this.logForOrganName = logForOrganName;
        this.logPreNodeKey = logPreNodeKey;
        this.logPreNodeName = logPreNodeName;
        this.logCurNodeKey = logCurNodeKey;
        this.logCurNodeName = logCurNodeName;
        this.logHandleActionKey = logHandleActionKey;
        this.logHandleActionName = logHandleActionName;
        this.logClientType = logClientType;
        this.logClientVersion = logClientVersion;
        this.logBusinessKey = logBusinessKey;
        this.logFileDraftSid = logFileDraftSid;
        this.logFileDraftNid = logFileDraftNid;
        this.logFileDraftCdbid = logFileDraftCdbid;
        this.logFileDocSid = logFileDocSid;
        this.logFileDocNid = logFileDocNid;
        this.logFileDocCdbid = logFileDocCdbid;
        this.logTaskIsMulti = logTaskIsMulti;
        this.logTaskIsParallel = logTaskIsParallel;
        this.logStatus = logStatus;
    }

    public ExecutionTaskLogEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getLogId() {
        return logId;
    }

    /**
     *
     * @param logId
     **/
    public void setLogId(String logId) {
        this.logId = logId == null ? null : logId.trim();
    }

    /**
     * 关联TFLOW_EXECUTION_TASK的EXTASK_ID
     * @return java.lang.String
     **/
    public String getLogExtaskId() {
        return logExtaskId;
    }

    /**
     * 关联TFLOW_EXECUTION_TASK的EXTASK_ID
     * @param logExtaskId 关联TFLOW_EXECUTION_TASK的EXTASK_ID
     **/
    public void setLogExtaskId(String logExtaskId) {
        this.logExtaskId = logExtaskId == null ? null : logExtaskId.trim();
    }

    /**
     * 日志类型:START[初始日志],VIEW[查看日志],TEMPORARY[暂存日志],END[办结日志]
     * @return java.lang.String
     **/
    public String getLogType() {
        return logType;
    }

    /**
     * 日志类型:START[初始日志],VIEW[查看日志],TEMPORARY[暂存日志],END[办结日志]
     * @param logType 日志类型
     **/
    public void setLogType(String logType) {
        this.logType = logType == null ? null : logType.trim();
    }

    /**
     * 日志创建时间
     * @return java.util.Date
     **/
    public Date getLogCreateTime() {
        return logCreateTime;
    }

    /**
     * 日志创建时间
     * @param logCreateTime 日志创建时间
     **/
    public void setLogCreateTime(Date logCreateTime) {
        this.logCreateTime = logCreateTime;
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getLogOrderNum() {
        return logOrderNum;
    }

    /**
     * 排序号
     * @param logOrderNum 排序号
     **/
    public void setLogOrderNum(Integer logOrderNum) {
        this.logOrderNum = logOrderNum;
    }

    /**
     * 关联用户ID
     * @return java.lang.String
     **/
    public String getLogForUserId() {
        return logForUserId;
    }

    /**
     * 关联用户ID
     * @param logForUserId 关联用户ID
     **/
    public void setLogForUserId(String logForUserId) {
        this.logForUserId = logForUserId == null ? null : logForUserId.trim();
    }

    /**
     * 关联用户名称
     * @return java.lang.String
     **/
    public String getLogForUserName() {
        return logForUserName;
    }

    /**
     * 关联用户名称
     * @param logForUserName 关联用户名称
     **/
    public void setLogForUserName(String logForUserName) {
        this.logForUserName = logForUserName == null ? null : logForUserName.trim();
    }

    /**
     * 关联用户组织ID
     * @return java.lang.String
     **/
    public String getLogForOrganId() {
        return logForOrganId;
    }

    /**
     * 关联用户组织ID
     * @param logForOrganId 关联用户组织ID
     **/
    public void setLogForOrganId(String logForOrganId) {
        this.logForOrganId = logForOrganId == null ? null : logForOrganId.trim();
    }

    /**
     * 关联用户组织名称
     * @return java.lang.String
     **/
    public String getLogForOrganName() {
        return logForOrganName;
    }

    /**
     * 关联用户组织名称
     * @param logForOrganName 关联用户组织名称
     **/
    public void setLogForOrganName(String logForOrganName) {
        this.logForOrganName = logForOrganName == null ? null : logForOrganName.trim();
    }

    /**
     * 前一个流程节点ID
     * @return java.lang.String
     **/
    public String getLogPreNodeKey() {
        return logPreNodeKey;
    }

    /**
     * 前一个流程节点ID
     * @param logPreNodeKey 前一个流程节点ID
     **/
    public void setLogPreNodeKey(String logPreNodeKey) {
        this.logPreNodeKey = logPreNodeKey == null ? null : logPreNodeKey.trim();
    }

    /**
     * 前一个流程节点名称
     * @return java.lang.String
     **/
    public String getLogPreNodeName() {
        return logPreNodeName;
    }

    /**
     * 前一个流程节点名称
     * @param logPreNodeName 前一个流程节点名称
     **/
    public void setLogPreNodeName(String logPreNodeName) {
        this.logPreNodeName = logPreNodeName == null ? null : logPreNodeName.trim();
    }

    /**
     * 当前流程节点ID:关联act_ru_task的TASK_DEF_KEY_
     * @return java.lang.String
     **/
    public String getLogCurNodeKey() {
        return logCurNodeKey;
    }

    /**
     * 当前流程节点ID:关联act_ru_task的TASK_DEF_KEY_
     * @param logCurNodeKey 当前流程节点ID
     **/
    public void setLogCurNodeKey(String logCurNodeKey) {
        this.logCurNodeKey = logCurNodeKey == null ? null : logCurNodeKey.trim();
    }

    /**
     * 当前流程节点名称:关联act_ru_task的NAME_
     * @return java.lang.String
     **/
    public String getLogCurNodeName() {
        return logCurNodeName;
    }

    /**
     * 当前流程节点名称:关联act_ru_task的NAME_
     * @param logCurNodeName 当前流程节点名称
     **/
    public void setLogCurNodeName(String logCurNodeName) {
        this.logCurNodeName = logCurNodeName == null ? null : logCurNodeName.trim();
    }

    /**
     * 处理动作Key
     * @return java.lang.String
     **/
    public String getLogHandleActionKey() {
        return logHandleActionKey;
    }

    /**
     * 处理动作Key
     * @param logHandleActionKey 处理动作Key
     **/
    public void setLogHandleActionKey(String logHandleActionKey) {
        this.logHandleActionKey = logHandleActionKey == null ? null : logHandleActionKey.trim();
    }

    /**
     * 处理动作名称
     * @return java.lang.String
     **/
    public String getLogHandleActionName() {
        return logHandleActionName;
    }

    /**
     * 处理动作名称
     * @param logHandleActionName 处理动作名称
     **/
    public void setLogHandleActionName(String logHandleActionName) {
        this.logHandleActionName = logHandleActionName == null ? null : logHandleActionName.trim();
    }

    /**
     * 客户端类型:Android;IOS;Web
     * @return java.lang.String
     **/
    public String getLogClientType() {
        return logClientType;
    }

    /**
     * 客户端类型:Android;IOS;Web
     * @param logClientType 客户端类型
     **/
    public void setLogClientType(String logClientType) {
        this.logClientType = logClientType == null ? null : logClientType.trim();
    }

    /**
     * 客户端版本号
     * @return java.lang.String
     **/
    public String getLogClientVersion() {
        return logClientVersion;
    }

    /**
     * 客户端版本号
     * @param logClientVersion 客户端版本号
     **/
    public void setLogClientVersion(String logClientVersion) {
        this.logClientVersion = logClientVersion == null ? null : logClientVersion.trim();
    }

    /**
     * 业务数据ID
     * @return java.lang.String
     **/
    public String getLogBusinessKey() {
        return logBusinessKey;
    }

    /**
     * 业务数据ID
     * @param logBusinessKey 业务数据ID
     **/
    public void setLogBusinessKey(String logBusinessKey) {
        this.logBusinessKey = logBusinessKey == null ? null : logBusinessKey.trim();
    }

    /**
     * 文件稿纸原始ID
     * @return java.lang.String
     **/
    public String getLogFileDraftSid() {
        return logFileDraftSid;
    }

    /**
     * 文件稿纸原始ID
     * @param logFileDraftSid 文件稿纸原始ID
     **/
    public void setLogFileDraftSid(String logFileDraftSid) {
        this.logFileDraftSid = logFileDraftSid == null ? null : logFileDraftSid.trim();
    }

    /**
     * 文件稿纸新ID
     * @return java.lang.String
     **/
    public String getLogFileDraftNid() {
        return logFileDraftNid;
    }

    /**
     * 文件稿纸新ID
     * @param logFileDraftNid 文件稿纸新ID
     **/
    public void setLogFileDraftNid(String logFileDraftNid) {
        this.logFileDraftNid = logFileDraftNid == null ? null : logFileDraftNid.trim();
    }

    /**
     * 文件稿纸提交时数据存储记录ID
     * @return java.lang.String
     **/
    public String getLogFileDraftCdbid() {
        return logFileDraftCdbid;
    }

    /**
     * 文件稿纸提交时数据存储记录ID
     * @param logFileDraftCdbid 文件稿纸提交时数据存储记录ID
     **/
    public void setLogFileDraftCdbid(String logFileDraftCdbid) {
        this.logFileDraftCdbid = logFileDraftCdbid == null ? null : logFileDraftCdbid.trim();
    }

    /**
     * 文件正文原始ID
     * @return java.lang.String
     **/
    public String getLogFileDocSid() {
        return logFileDocSid;
    }

    /**
     * 文件正文原始ID
     * @param logFileDocSid 文件正文原始ID
     **/
    public void setLogFileDocSid(String logFileDocSid) {
        this.logFileDocSid = logFileDocSid == null ? null : logFileDocSid.trim();
    }

    /**
     * 文件正文新ID
     * @return java.lang.String
     **/
    public String getLogFileDocNid() {
        return logFileDocNid;
    }

    /**
     * 文件正文新ID
     * @param logFileDocNid 文件正文新ID
     **/
    public void setLogFileDocNid(String logFileDocNid) {
        this.logFileDocNid = logFileDocNid == null ? null : logFileDocNid.trim();
    }

    /**
     * 文件正文提交时数据存储记录ID
     * @return java.lang.String
     **/
    public String getLogFileDocCdbid() {
        return logFileDocCdbid;
    }

    /**
     * 文件正文提交时数据存储记录ID
     * @param logFileDocCdbid 文件正文提交时数据存储记录ID
     **/
    public void setLogFileDocCdbid(String logFileDocCdbid) {
        this.logFileDocCdbid = logFileDocCdbid == null ? null : logFileDocCdbid.trim();
    }

    /**
     * 是否多实例任务
     * @return java.lang.String
     **/
    public String getLogTaskIsMulti() {
        return logTaskIsMulti;
    }

    /**
     * 是否多实例任务
     * @param logTaskIsMulti 是否多实例任务
     **/
    public void setLogTaskIsMulti(String logTaskIsMulti) {
        this.logTaskIsMulti = logTaskIsMulti == null ? null : logTaskIsMulti.trim();
    }

    /**
     * 是否并行多实例任务
     * @return java.lang.String
     **/
    public String getLogTaskIsParallel() {
        return logTaskIsParallel;
    }

    /**
     * 是否并行多实例任务
     * @param logTaskIsParallel 是否并行多实例任务
     **/
    public void setLogTaskIsParallel(String logTaskIsParallel) {
        this.logTaskIsParallel = logTaskIsParallel == null ? null : logTaskIsParallel.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getLogStatus() {
        return logStatus;
    }

    /**
     * 状态
     * @param logStatus 状态
     **/
    public void setLogStatus(String logStatus) {
        this.logStatus = logStatus == null ? null : logStatus.trim();
    }
}