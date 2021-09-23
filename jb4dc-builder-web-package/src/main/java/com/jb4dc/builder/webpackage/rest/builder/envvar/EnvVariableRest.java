package com.jb4dc.builder.webpackage.rest.builder.envvar;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.remote.EnvVariableRuntimeRemote;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.builder.client.service.envvar.IEnvVariableService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/29
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/EnvVariable")
public class EnvVariableRest extends GeneralRest<EnvVariableEntity> implements EnvVariableRuntimeRemote {
    @Autowired
    IEnvVariableService envVariableService;

    /*@Override
    public String getModuleName() {
        return "环境变量";
    }*/

    @Override
    protected IBaseService<EnvVariableEntity> getBaseService() {
        return envVariableService;
    }

    @Override
    public JBuild4DCResponseVo<EnvVariableEntity> getEnvVariableByEnvValue(String envValue) throws JBuild4DCGenerallyException {
        EnvVariableEntity envVariableEntity=envVariableService.getEntityByValue(JB4DCSessionUtility.getSession(),envValue);
        return JBuild4DCResponseVo.getDataSuccess(envVariableEntity);
    }

    @Override
    public JBuild4DCResponseVo<List<EnvVariableEntity>> getEnvVariableByGroupId(String groupId) throws JBuild4DCGenerallyException {
        List<EnvVariableEntity> envVariableEntities=envVariableService.getEntitiesByGroupId(JB4DCSessionUtility.getSession(),groupId);
        return JBuild4DCResponseVo.getDataSuccess(envVariableEntities);
    }
}
