package com.jb4dc.workflow.dbentities;

import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_execution_task_log
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ExecutionTaskLogEntityWithBLOBs extends ExecutionTaskLogEntity {
    //LOG_CLIENT_SUBMIT_DATA:客户端提交数据
    private String logClientSubmitData;

    //LOG_SOURCE_TASK_JSON:起始状态的Task记录Json
    private String logSourceTaskJson;

    //LOG_TO_TASK_JSON:结束状态的Task记录Json
    private String logToTaskJson;

    //LOG_BUSINESS_SOURCE_DATA:开始状态的业务数据
    private String logBusinessSourceData;

    //LOG_BUSINESS_TO_DATA:结束状态的业务数据
    private String logBusinessToData;

    //LOG_FILE_DRAFT_TEXT:文件稿纸内容的文本抽取
    private String logFileDraftText;

    //LOG_FILE_DOC_TEXT:文件正文内容的文本抽取
    private String logFileDocText;

    //LOG_FILE_ATT_JSON:本次操作修改的附件ID
    private String logFileAttJson;

    //LOG_COMPLETE_ERROR:提交办结时的错误日志
    private String logCompleteError;

    public ExecutionTaskLogEntityWithBLOBs(String logId, String logExtaskId, String logType, Date logCreateTime, Integer logOrderNum, String logForUserId, String logForUserName, String logForOrganId, String logForOrganName, String logPreNodeKey, String logPreNodeName, String logCurNodeKey, String logCurNodeName, String logHandleActionKey, String logHandleActionName, String logClientType, String logClientVersion, String logBusinessKey, String logFileDraftSid, String logFileDraftNid, String logFileDraftCdbid, String logFileDocSid, String logFileDocNid, String logFileDocCdbid, String logTaskIsMulti, String logTaskIsParallel, String logStatus, String logClientSubmitData, String logSourceTaskJson, String logToTaskJson, String logBusinessSourceData, String logBusinessToData, String logFileDraftText, String logFileDocText, String logFileAttJson, String logCompleteError) {
        super(logId, logExtaskId, logType, logCreateTime, logOrderNum, logForUserId, logForUserName, logForOrganId, logForOrganName, logPreNodeKey, logPreNodeName, logCurNodeKey, logCurNodeName, logHandleActionKey, logHandleActionName, logClientType, logClientVersion, logBusinessKey, logFileDraftSid, logFileDraftNid, logFileDraftCdbid, logFileDocSid, logFileDocNid, logFileDocCdbid, logTaskIsMulti, logTaskIsParallel, logStatus);
        this.logClientSubmitData = logClientSubmitData;
        this.logSourceTaskJson = logSourceTaskJson;
        this.logToTaskJson = logToTaskJson;
        this.logBusinessSourceData = logBusinessSourceData;
        this.logBusinessToData = logBusinessToData;
        this.logFileDraftText = logFileDraftText;
        this.logFileDocText = logFileDocText;
        this.logFileAttJson = logFileAttJson;
        this.logCompleteError = logCompleteError;
    }

    public ExecutionTaskLogEntityWithBLOBs() {
        super();
    }

    public String getLogClientSubmitData() {
        return logClientSubmitData;
    }

    public void setLogClientSubmitData(String logClientSubmitData) {
        this.logClientSubmitData = logClientSubmitData == null ? null : logClientSubmitData.trim();
    }

    public String getLogSourceTaskJson() {
        return logSourceTaskJson;
    }

    public void setLogSourceTaskJson(String logSourceTaskJson) {
        this.logSourceTaskJson = logSourceTaskJson == null ? null : logSourceTaskJson.trim();
    }

    public String getLogToTaskJson() {
        return logToTaskJson;
    }

    public void setLogToTaskJson(String logToTaskJson) {
        this.logToTaskJson = logToTaskJson == null ? null : logToTaskJson.trim();
    }

    public String getLogBusinessSourceData() {
        return logBusinessSourceData;
    }

    public void setLogBusinessSourceData(String logBusinessSourceData) {
        this.logBusinessSourceData = logBusinessSourceData == null ? null : logBusinessSourceData.trim();
    }

    public String getLogBusinessToData() {
        return logBusinessToData;
    }

    public void setLogBusinessToData(String logBusinessToData) {
        this.logBusinessToData = logBusinessToData == null ? null : logBusinessToData.trim();
    }

    public String getLogFileDraftText() {
        return logFileDraftText;
    }

    public void setLogFileDraftText(String logFileDraftText) {
        this.logFileDraftText = logFileDraftText == null ? null : logFileDraftText.trim();
    }

    public String getLogFileDocText() {
        return logFileDocText;
    }

    public void setLogFileDocText(String logFileDocText) {
        this.logFileDocText = logFileDocText == null ? null : logFileDocText.trim();
    }

    public String getLogFileAttJson() {
        return logFileAttJson;
    }

    public void setLogFileAttJson(String logFileAttJson) {
        this.logFileAttJson = logFileAttJson == null ? null : logFileAttJson.trim();
    }

    public String getLogCompleteError() {
        return logCompleteError;
    }

    public void setLogCompleteError(String logCompleteError) {
        this.logCompleteError = logCompleteError == null ? null : logCompleteError.trim();
    }
}