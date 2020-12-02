package com.jb4dc.gridsystem.webpackage.rest.grid.setting;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gridsystem.dbentities.setting.AppVersionEntity;
import com.jb4dc.gridsystem.service.setting.IAppVersionService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Api(tags = "APP版本接口")
@RestController
@RequestMapping(value = "/Rest/Grid/Setting/AppVersion")
public class AppVersionRest {

    @Autowired
    IAppVersionService appVersionService;

    @ApiOperation(value = "获取最新的已发布版本", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name="appName",value="app名称",required=true,example = "网格APP")
    })
    @RequestMapping(value = "/GetLastPrePublicVersion", method = RequestMethod.GET)
    public JBuild4DCResponseVo getLastPublicVersion(String appName) throws JBuild4DCGenerallyException, JsonProcessingException {
        AppVersionEntity appVersionEntity=appVersionService.getByLastPublicVersion(appName);
        if(appVersionEntity!=null) {
            Map<String, Object> exData = new HashMap<>();
            exData.put("downUrl", "static/" + appVersionEntity.getAppVersionFilePath().replaceAll("\\\\", "/"));
            JBuild4DCResponseVo<AppVersionEntity> jBuild4DCResponseVo = JBuild4DCResponseVo.getDataSuccess(appVersionEntity);
            jBuild4DCResponseVo.setExKVData(exData);
            return jBuild4DCResponseVo;
        }
        else{
            return JBuild4DCResponseVo.getDataSuccess(null);
        }
    }

    @ApiOperation(value = "获取最新的预发布版本", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name="appName",value="app名称",required=true,example = "网格APP")
    })
    @RequestMapping(value = "/GetLastPublicVersion", method = RequestMethod.GET)
    public JBuild4DCResponseVo getLastPrePublicVersion(String appName) throws JBuild4DCGenerallyException, JsonProcessingException {
        AppVersionEntity appVersionEntity=appVersionService.getByLastPrePublicVersion(appName);
        if(appVersionEntity!=null) {
            Map<String, Object> exData = new HashMap<>();
            exData.put("downUrl", "static/" + appVersionEntity.getAppVersionFilePath().replaceAll("\\\\", "/"));
            JBuild4DCResponseVo<AppVersionEntity> jBuild4DCResponseVo = JBuild4DCResponseVo.getDataSuccess(appVersionEntity);
            jBuild4DCResponseVo.setExKVData(exData);
            return jBuild4DCResponseVo;
        }
        else{
            return JBuild4DCResponseVo.getDataSuccess(null);
        }
    }
}
