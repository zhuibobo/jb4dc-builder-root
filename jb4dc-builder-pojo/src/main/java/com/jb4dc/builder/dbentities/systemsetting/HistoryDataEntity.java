package com.jb4dc.builder.dbentities.systemsetting;

import com.jb4dc.base.service.po.HistoryDataPO;

import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TSYS_HISTORY_DATA
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class HistoryDataEntity extends HistoryDataPO {
    public HistoryDataEntity(String historyId, String historySystemName, String historySystemId, String historyModuleName, String historyModuleId, String historyRecord, String historyOrganId, String historyOrganName, String historyUserId, String historyUserName, Date historyCreateTime, String historyTableName, String historyRecordId) {
        super(historyId, historySystemName, historySystemId, historyModuleName, historyModuleId, historyRecord, historyOrganId, historyOrganName, historyUserId, historyUserName, historyCreateTime, historyTableName, historyRecordId);
    }

    public HistoryDataEntity() {
    }
}