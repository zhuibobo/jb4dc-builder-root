package com.jb4dc.gridsystem.webpackage.rest.grid.build;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.gridinfo.GridInfoEntityWithBLOBs;
import com.jb4dc.gridsystem.service.build.IBuildInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/15
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Grid/Build/BuildMain")
public class BuildInfoRest {
    @Autowired
    IBuildInfoService buildInfoService;

    @RequestMapping(value = "/GetMyBuild", method = RequestMethod.GET)
    public JBuild4DCResponseVo getMyBuild(String includeGrid) throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession=JB4DCSessionUtility.getSession();
        List<BuildInfoEntity> buildInfoEntityList=buildInfoService.getMyBuild(JB4DCSessionUtility.getSession(),jb4DCSession.getUserId(),jb4DCSession.getOrganId(),includeGrid);
        return JBuild4DCResponseVo.getDataSuccess(buildInfoEntityList);
    }
}
