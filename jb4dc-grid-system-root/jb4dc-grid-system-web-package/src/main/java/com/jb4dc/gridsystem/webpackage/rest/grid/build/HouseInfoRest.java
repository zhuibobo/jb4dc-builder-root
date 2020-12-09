package com.jb4dc.gridsystem.webpackage.rest.grid.build;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseRelevanterEntity;
import com.jb4dc.gridsystem.po.FamilyPO;
import com.jb4dc.gridsystem.po.HouseInfoPO;
import com.jb4dc.gridsystem.po.HouseRelevanterPO;
import com.jb4dc.gridsystem.service.build.IHouseInfoService;
import com.jb4dc.gridsystem.service.build.IHouseRelevanterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Grid/Build/HouseInfo")
public class HouseInfoRest extends GeneralRest<HouseInfoEntity> {

    @Autowired
    IHouseInfoService houseInfoService;

    @Autowired
    IHouseRelevanterService houseRelevanterService;

    @Override
    public String getModuleName() {
        return "网格化社会管理系统-房屋管理";
    }

    @Override
    protected IBaseService<HouseInfoEntity> getBaseService() {
        return houseInfoService;
    }

    @RequestMapping(value = "/GetHouseByBuildId", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<HouseInfoEntity>> getHouseByBuildId(String buildId) throws JBuild4DCGenerallyException {
        //JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        List<HouseInfoEntity> houseInfoEntities=houseInfoService.getHouseByBuildId(JB4DCSessionUtility.getSession(),buildId);
        return JBuild4DCResponseVo.getDataSuccess(houseInfoEntities);
    }

    @RequestMapping(value = "/GetRelevanterByHouseId", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<HouseRelevanterEntity>> getRelevanterByHouseId(String houseId) throws JBuild4DCGenerallyException {
        //JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        List<HouseRelevanterEntity> houseRelevanterPOS=houseRelevanterService.getRelevanterByHouseId(JB4DCSessionUtility.getSession(),houseId);
        return JBuild4DCResponseVo.getDataSuccess(houseRelevanterPOS);
    }

    @RequestMapping(value = "/DeleteRelevanter", method = RequestMethod.DELETE)
    public JBuild4DCResponseVo deleteRelevanter(String relevanterId) throws JBuild4DCGenerallyException {
        //JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        String houseId=houseRelevanterService.getByPrimaryKey(JB4DCSessionUtility.getSession(),relevanterId).getReterHouseId();
        houseRelevanterService.deleteByKey(JB4DCSessionUtility.getSession(),relevanterId);
        List<HouseRelevanterEntity> houseRelevanterPOS=houseRelevanterService.getRelevanterByHouseId(JB4DCSessionUtility.getSession(),houseId);
        return JBuild4DCResponseVo.opSuccess(houseRelevanterPOS);
    }

    @RequestMapping(value = "/SaveHouseData", method = RequestMethod.POST)
    public JBuild4DCResponseVo<HouseInfoPO> saveHouseData(@RequestBody HouseInfoPO houseInfoPO) throws JBuild4DCGenerallyException, IOException, URISyntaxException {
        //JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        houseInfoPO=houseInfoService.saveHouseData(JB4DCSessionUtility.getSession(),houseInfoPO);
        return JBuild4DCResponseVo.opSuccess(houseInfoPO);
    }


}
