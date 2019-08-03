package com.jb4dc.builder.service.datastorage;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.datastorage.DbLinkEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

public interface IDbLinkService extends IBaseService<DbLinkEntity> {

    String JBUILD4DC_BUILDER_DB_LINK_ID="JBuild4DCBuilderDBLink";
    String JBUILD4DC_SSO_DB_LINK_ID="JBuild4DCSSODBLink";
    String JBUILD4DC_DEV_MOCK_DB_LINK_ID="JBuild4DCDevMockDBLink";
    String JBUILD4DC_BUSINESS_TEST_DB_LINK_ID="JBuild4DCBusinessTestDBLink";

    //String getLocationDBLinkId();

    DbLinkEntity getDBLinkEntity(JB4DCSession jb4DSession) throws JBuild4DCGenerallyException;

    DbLinkEntity getLocationDBByYML(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException;

    void initSystemData(JB4DCSession jb4DSession) throws JBuild4DCGenerallyException;
}
