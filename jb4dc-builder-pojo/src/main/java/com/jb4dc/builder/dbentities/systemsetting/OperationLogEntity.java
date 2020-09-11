package com.jb4dc.builder.dbentities.systemsetting;

import com.jb4dc.base.service.po.OperationLogPO;

import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TSYS_OPERATION_LOG
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class OperationLogEntity extends OperationLogPO {
    public OperationLogEntity(String logId, String logText, Integer logOrderNum, Date logCreateTime, String logSystemId, String logSystemName, String logModuleId, String logModuleName, String logActionName, String logData, String logUserId, String logUserName, String logOrganId, String logOrganName, String logIp, String logType, String logClassName, String logStatus) {
        super(logId, logText, logOrderNum, logCreateTime, logSystemId, logSystemName, logModuleId, logModuleName, logActionName, logData, logUserId, logUserName, logOrganId, logOrganName, logIp, logType, logClassName, logStatus);
    }

    public OperationLogEntity() {
    }
}