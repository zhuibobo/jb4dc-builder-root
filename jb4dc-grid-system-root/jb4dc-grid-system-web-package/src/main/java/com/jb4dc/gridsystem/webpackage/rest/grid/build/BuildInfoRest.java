package com.jb4dc.gridsystem.webpackage.rest.grid.build;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.proxy.IDictionaryRuntimeProxy;
import com.jb4dc.builder.dbentities.site.SiteFolderEntity;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.enterprise.EnterpriseInfoEntity;
import com.jb4dc.gridsystem.dbentities.gridinfo.GridInfoEntity;
import com.jb4dc.gridsystem.dbentities.gridinfo.GridInfoEntityWithBLOBs;
import com.jb4dc.gridsystem.po.BuildInfoPO;
import com.jb4dc.gridsystem.po.EnterpriseInfoPO;
import com.jb4dc.gridsystem.service.build.IBuildInfoService;
import com.jb4dc.gridsystem.service.gridinfo.IGridInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/15
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Grid/Build/BuildMain")
public class BuildInfoRest extends GeneralRest<BuildInfoEntity> {
    @Autowired
    IBuildInfoService buildInfoService;

    @Autowired
    IDictionaryRuntimeProxy dictionaryRuntimeProxy;

    @Autowired
    IGridInfoService gridInfoService;

    @RequestMapping(value = "/GetMyBuild", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<BuildInfoEntity>> getMyBuild(String includeGrid) throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession=JB4DCSessionUtility.getSession();
        List<BuildInfoEntity> buildInfoEntityList=buildInfoService.getMyBuild(JB4DCSessionUtility.getSession(),jb4DCSession.getUserId(),jb4DCSession.getOrganId(),includeGrid);
        return JBuild4DCResponseVo.getDataSuccess(buildInfoEntityList);
    }

    @RequestMapping(value = "/GetMyBuildIncludeDD", method = RequestMethod.GET)
    public JBuild4DCResponseVo getMyBuildIncludeDD(String includeGrid) throws JBuild4DCGenerallyException, IOException {
        JB4DCSession jb4DCSession=JB4DCSessionUtility.getSession();
        List<BuildInfoEntity> buildInfoEntityList=buildInfoService.getMyBuild(JB4DCSessionUtility.getSession(),jb4DCSession.getUserId(),jb4DCSession.getOrganId(),includeGrid);
        List<DictionaryEntity> dictionaryEntities=dictionaryRuntimeProxy.getDictionaryByGroup3Level("f476d653-0606-4cb7-8189-4e5beee1bf11");

        GridInfoEntity gridInfoEntity=gridInfoService.getByPrimaryKey(jb4DCSession,jb4DCSession.getOrganId());

        JBuild4DCResponseVo<List<BuildInfoEntity>> result=new JBuild4DCResponseVo<>();
        Map<String,Object> exData=new HashMap<>();
        exData.put("dictionaryEntities",dictionaryEntities);
        exData.put("gridInfoEntity",gridInfoEntity);
        result.setExKVData(exData);
        result.setData(buildInfoEntityList);
        return result;
    }

    @RequestMapping(value = "/SaveBuildData", method = RequestMethod.POST)
    public JBuild4DCResponseVo<BuildInfoPO> saveEnterpriseData(@RequestBody BuildInfoPO buildInfoPO) throws JBuild4DCGenerallyException {
        //JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        //List<EnterpriseInfoEntity> enterpriseInfoEntities=enterpriseInfoService.getEnterpriseByHouseId(JB4DCSessionUtility.getSession(),houseId);
        BuildInfoPO saveBuildData= buildInfoService.saveBuildData(JB4DCSessionUtility.getSession(),buildInfoPO);
        return JBuild4DCResponseVo.opSuccess(saveBuildData);
    }

    @RequestMapping(value = "/CodeAdd1", method = RequestMethod.POST)
    public JBuild4DCResponseVo codeAdd1(String buildId) throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession=JB4DCSessionUtility.getSession();
        buildInfoService.codeAdd1(buildId);
        return JBuild4DCResponseVo.opSuccess();
    }

    @RequestMapping(value = "/CodeSub1", method = RequestMethod.POST)
    public JBuild4DCResponseVo codeSub1(String buildId) throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession=JB4DCSessionUtility.getSession();
        buildInfoService.codeSub1(buildId);
        return JBuild4DCResponseVo.opSuccess();
    }

    @Override
    public String getModuleName() {
        return "网格化社会管理系统-建筑物管理";
    }

    @Override
    protected IBaseService<BuildInfoEntity> getBaseService() {
        return buildInfoService;
    }
}
