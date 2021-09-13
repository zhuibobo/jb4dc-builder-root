package com.jb4dc.builder.client.remote;

import com.jb4dc.base.service.aspect.ClientCallRemoteCache;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/12
 * To change this template use File | Settings | File Templates.
 */
@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "EnvVariableRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },path = "${jb4dc.builder.server.context-path}/Rest/Builder/EnvVariable")
public interface EnvVariableRuntimeRemote {
    @RequestMapping(value = "/GetEnvVariableByEnvValue",method = RequestMethod.POST)
    @ClientCallRemoteCache
    JBuild4DCResponseVo<EnvVariableEntity> getEnvVariableByEnvValue(@RequestParam("envValue") String envValue) throws JBuild4DCGenerallyException;

    @RequestMapping(value = "/GetEnvVariableByGroupId",method = RequestMethod.POST)
    @ClientCallRemoteCache
    JBuild4DCResponseVo<List<EnvVariableEntity>> getEnvVariableByGroupId(String groupId) throws JBuild4DCGenerallyException;
}
