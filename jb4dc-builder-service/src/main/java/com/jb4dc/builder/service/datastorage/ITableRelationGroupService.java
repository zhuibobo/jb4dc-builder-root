package com.jb4dc.builder.service.datastorage;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.datastorage.TableRelationGroupEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

public interface ITableRelationGroupService extends IBaseService<TableRelationGroupEntity> {
    String getRootId();

    TableRelationGroupEntity createRootNode(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException;

    TableRelationGroupEntity createSystemTableRelationGroupNode(JB4DCSession jb4DCSession, TableRelationGroupEntity parentGroup) throws JBuild4DCGenerallyException;
}