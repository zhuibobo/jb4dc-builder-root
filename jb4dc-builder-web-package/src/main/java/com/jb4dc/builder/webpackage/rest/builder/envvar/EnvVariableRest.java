package com.jb4dc.builder.webpackage.rest.builder.envvar;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.envvar.EnvGroupEntity;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.builder.service.envvar.IEnvVariableService;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/29
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/EnvVariable")
public class EnvVariableRest extends GeneralRest<EnvVariableEntity> {
    @Autowired
    IEnvVariableService envVariableService;

    @Override
    public String getModuleName() {
        return "环境变量";
    }

    @Override
    protected IBaseService<EnvVariableEntity> getBaseService() {
        return envVariableService;
    }
}
