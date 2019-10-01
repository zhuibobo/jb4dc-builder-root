package com.jb4dc.builder.client.service.datastorage;

import com.jb4dc.builder.po.FormRecordDataRelationPO;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/22
 * To change this template use File | Settings | File Templates.
 */
public interface IDataStorageRuntimeService {
    List<FormRecordDataRelationPO> getStorageDate(JB4DCSession session, String recordId, List<FormRecordDataRelationPO> formRecordDataRelationPOList);
}
