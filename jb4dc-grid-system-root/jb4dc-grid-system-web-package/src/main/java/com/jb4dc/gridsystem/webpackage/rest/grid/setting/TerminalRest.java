package com.jb4dc.gridsystem.webpackage.rest.grid.setting;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gridsystem.dbentities.setting.AppVersionEntity;
import com.jb4dc.gridsystem.service.terminal.IGatherTerminalInfoService;
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

@Api(tags = "采集终端接口")
@RestController
@RequestMapping(value = "/Rest/Grid/Setting/Terminal")
public class TerminalRest {

    @Autowired
    IGatherTerminalInfoService terminalInfoService;

    @ApiOperation(value = "更新终端编码", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name="sourceCode",value="设备旧编码",required=true,example = "2222222222222222222222222"),
            @ApiImplicitParam(name="newCode",value="设备新编码",required=true,example = "3b871e59f79941f9801499cdbd9be3d3")
    })
    @RequestMapping(value = "/UpdateTerminalCode", method = RequestMethod.POST)
    public JBuild4DCResponseVo updateTerminalCode(String sourceCode,String newCode) throws JBuild4DCGenerallyException, JsonProcessingException {
        terminalInfoService.updateTerminalCode(sourceCode,newCode);
        return JBuild4DCResponseVo.opSuccess();
        /*AppVersionEntity appVersionEntity=appVersionService.getByLastPublicVersion(appName);
        if(appVersionEntity!=null) {
            Map<String, Object> exData = new HashMap<>();
            exData.put("downUrl", "static/" + appVersionEntity.getAppVersionFilePath().replaceAll("\\\\", "/"));
            JBuild4DCResponseVo<AppVersionEntity> jBuild4DCResponseVo = JBuild4DCResponseVo.getDataSuccess(appVersionEntity);
            jBuild4DCResponseVo.setExKVData(exData);
            return jBuild4DCResponseVo;
        }
        else{
            return JBuild4DCResponseVo.getDataSuccess(null);
        }*/
    }
}
