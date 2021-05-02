package com.jb4dc.builder.client.remote;

import com.jb4dc.base.service.aspect.ClientCallRemoteCache;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "ApiItemRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },path = "${jb4dc.builder.server.context-path}/Rest/Builder/RunTime/ApiRuntime")
public interface ApiItemRuntimeRemote {
    @RequestMapping(value = "/GetApiPOById",method = RequestMethod.POST)
    @ClientCallRemoteCache
    JBuild4DCResponseVo<ApiItemEntity> getApiPOById(@RequestParam("apiId") String apiId);

    @RequestMapping(value = "/GetApiPOByValue",method = RequestMethod.POST)
    @ClientCallRemoteCache
    JBuild4DCResponseVo<ApiItemEntity> getApiPOByValue(@RequestParam("apiValue") String apiValue);
}
