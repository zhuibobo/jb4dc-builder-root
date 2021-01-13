package com.jb4dc.gridsystem.service.build;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.dbentities.gridinfo.GridInfoEntityWithBLOBs;
import com.jb4dc.gridsystem.po.BuildInfoPO;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/15
 * To change this template use File | Settings | File Templates.
 */
public interface IBuildInfoService extends IBaseService<BuildInfoEntity> {
    List<BuildInfoEntity> getMyBuild(JB4DCSession session, String userId, String organId, String includeGrid);

    List<BuildInfoEntity> getByBuildCode(String buildCode);

    void codeAdd1(String buildId) throws JBuild4DCGenerallyException;

    void codeSub1(String buildId) throws JBuild4DCGenerallyException;

    boolean testCodeSingle(BuildInfoEntity buildInfoEntity) throws JBuild4DCGenerallyException;

    BuildInfoPO saveBuildData(JB4DCSession session, BuildInfoPO buildInfoPO) throws JBuild4DCGenerallyException;

    List<BuildInfoEntity> getBuildMapLocationByOrganId(JB4DCSession jb4DCSession, String organId, String buildCategory);
}
