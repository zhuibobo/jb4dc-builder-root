package com.jb4dc.builder.service.site;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.site.SiteInfoEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/6/5
 * To change this template use File | Settings | File Templates.
 */
public interface ISiteInfoService extends IBaseService<SiteInfoEntity> {

    void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException;
}
