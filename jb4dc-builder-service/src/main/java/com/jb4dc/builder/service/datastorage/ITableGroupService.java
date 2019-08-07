package com.jb4dc.builder.service.datastorage;



import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.datastorage.TableGroupEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public interface ITableGroupService extends IBaseService<TableGroupEntity> {
    String getRootId();

    TableGroupEntity createRootNode(JB4DCSession jb4DCSession, String dbLinkId, String text, String value) throws JBuild4DCGenerallyException;

    //TableGroupEntity createSystemTableGroupNode(JB4DCSession jb4DCSession, TableGroupEntity parentGroup) throws JBuild4DCGenerallyException;

    TableGroupEntity getByGroupText(JB4DCSession jb4DCSession, String groupText);

    TableGroupEntity getLocationTableGroupRoot(JB4DCSession jb4DCSession);

    List<TableGroupEntity> getByDBLinkId(JB4DCSession session, String dbLinkId);

    void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException;
}
