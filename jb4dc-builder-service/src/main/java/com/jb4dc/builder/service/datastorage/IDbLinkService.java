package com.jb4dc.builder.service.datastorage;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.datastorage.DbLinkEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

public interface IDbLinkService extends IBaseService<DbLinkEntity> {
    String getLocationDBLinkId();

    DbLinkEntity getDBLinkEntity(JB4DCSession jb4DSession) throws JBuild4DCGenerallyException;

    void createLocationDBLink(JB4DCSession jb4DSession) throws JBuild4DCGenerallyException;
}
