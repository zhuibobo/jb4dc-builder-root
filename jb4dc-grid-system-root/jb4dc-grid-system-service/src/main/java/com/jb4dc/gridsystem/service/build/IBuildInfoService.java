package com.jb4dc.gridsystem.service.build;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.gridinfo.GridInfoEntityWithBLOBs;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/15
 * To change this template use File | Settings | File Templates.
 */
public interface IBuildInfoService extends IBaseService<BuildInfoEntity> {
    List<BuildInfoEntity> getMyBuild(JB4DCSession session, String userId, String organId, String includeGrid);
}
