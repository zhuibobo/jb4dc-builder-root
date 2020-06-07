package com.jb4dc.builder.service.site;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.site.SiteFolderEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/6/5
 * To change this template use File | Settings | File Templates.
 */
public interface ISiteFolderService extends IBaseService<SiteFolderEntity> {
    SiteFolderEntity createRootNode(JB4DCSession jb4DCSession, String id, String siteName) throws JBuild4DCGenerallyException;

    List<SiteFolderEntity> getBySiteId(JB4DCSession session, String siteId);
}