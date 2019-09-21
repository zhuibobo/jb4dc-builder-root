package com.jb4dc.builder.webpackage.rest.builder.runtime;

import com.jb4dc.builder.client.service.envvar.IEnvVariableService;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/12
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/EnvVariableRuntime")
public class EnvVariableRuntimeRest {
    @Autowired
    IEnvVariableService envVariableService;

    @RequestMapping(value = "/GetEnvVariableByEnvValue",method = RequestMethod.POST)
    public JBuild4DCResponseVo<EnvVariableEntity> getEnvVariableByEnvValue(String envValue) throws JBuild4DCGenerallyException {
        EnvVariableEntity envVariableEntity=envVariableService.getEntityByValue(envValue);
        return JBuild4DCResponseVo.getDataSuccess(envVariableEntity);
    }
}
