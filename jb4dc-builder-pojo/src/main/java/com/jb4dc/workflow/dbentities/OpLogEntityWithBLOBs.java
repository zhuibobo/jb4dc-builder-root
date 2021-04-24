package com.jb4dc.workflow.dbentities;

import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_op_log
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class OpLogEntityWithBLOBs extends OpLogEntity {
    //OP_LOG_DATA1:日志数据1
    private String opLogData1;

    //OP_LOG_DATA2:日志数据2
    private String opLogData2;

    //OP_LOG_DATA3:日志数据3
    private String opLogData3;

    public OpLogEntityWithBLOBs(String opLogId, Date opLogCreateTime, String opLogUserName, String opLogUserId, String opLogType, String opLogRefId, String opLogRefType, String opLogText, String opLogData1, String opLogData2, String opLogData3) {
        super(opLogId, opLogCreateTime, opLogUserName, opLogUserId, opLogType, opLogRefId, opLogRefType, opLogText);
        this.opLogData1 = opLogData1;
        this.opLogData2 = opLogData2;
        this.opLogData3 = opLogData3;
    }

    public OpLogEntityWithBLOBs() {
        super();
    }

    public String getOpLogData1() {
        return opLogData1;
    }

    public void setOpLogData1(String opLogData1) {
        this.opLogData1 = opLogData1 == null ? null : opLogData1.trim();
    }

    public String getOpLogData2() {
        return opLogData2;
    }

    public void setOpLogData2(String opLogData2) {
        this.opLogData2 = opLogData2 == null ? null : opLogData2.trim();
    }

    public String getOpLogData3() {
        return opLogData3;
    }

    public void setOpLogData3(String opLogData3) {
        this.opLogData3 = opLogData3 == null ? null : opLogData3.trim();
    }
}