package com.jb4dc.builder.service.systemsetting.impl;

import com.jb4dc.base.service.IHistoryDataService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.builder.dao.systemsetting.HistoryDataMapper;
import com.jb4dc.builder.dbentities.systemsetting.HistoryDataEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/25
 * To change this template use File | Settings | File Templates.
 */

@Service
public class HistoryDataServiceImpl implements IHistoryDataService
{
    HistoryDataMapper historyDataMapper;

    @Autowired
    public HistoryDataServiceImpl(HistoryDataMapper _defaultBaseMapper){
        historyDataMapper=_defaultBaseMapper;
    }

    @Override
    public void keepRecordData(JB4DCSession JB4DCSession, Object record){
        HistoryDataEntity historyDataEntity=new HistoryDataEntity();
        historyDataEntity.setHistoryId("");
        historyDataEntity.setHistoryOrganId("");
        historyDataEntity.setHistoryOrganName("");
        historyDataEntity.setHistoryUserId("");
        historyDataEntity.setHistoryUserName("");
        historyDataEntity.setHistoryCreateTime(new Date());
        historyDataEntity.setHistoryTableName("");
        historyDataEntity.setHistoryRecordId("");
        historyDataEntity.setHistoryRecord("");

        historyDataMapper.insert(historyDataEntity);
    }

    @Override
    public void keepRecordData(JB4DCSession JB4DCSession, String tableName, String recordId, String recordData){
        HistoryDataEntity historyDataEntity=new HistoryDataEntity();
        historyDataEntity.setHistoryId(UUIDUtility.getUUID());
        historyDataEntity.setHistoryOrganId(JB4DCSession.getOrganId());
        historyDataEntity.setHistoryOrganName(JB4DCSession.getOrganName());
        historyDataEntity.setHistoryUserId(JB4DCSession.getUserId());
        historyDataEntity.setHistoryUserName(JB4DCSession.getUserName());
        historyDataEntity.setHistoryCreateTime(new Date());
        historyDataEntity.setHistoryTableName(tableName);
        historyDataEntity.setHistoryRecordId(recordId);
        historyDataEntity.setHistoryRecord(recordData);

        historyDataMapper.insert(historyDataEntity);
    }
}
