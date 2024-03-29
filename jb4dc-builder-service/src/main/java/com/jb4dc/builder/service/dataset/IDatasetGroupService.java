package com.jb4dc.builder.service.dataset;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.dataset.DatasetGroupEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public interface IDatasetGroupService extends IBaseService<DatasetGroupEntity> {

    //DatasetGroupEntity initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException;

    String getRootId();

    void createRootNode(JB4DCSession jb4DCSession, String id, String dbLinkName, String dbLinkValue) throws JBuild4DCGenerallyException;

    List<DatasetGroupEntity> getByDBLinkId(JB4DCSession session, String dbLinkId);
}
