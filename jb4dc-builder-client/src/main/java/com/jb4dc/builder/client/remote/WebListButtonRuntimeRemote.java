package com.jb4dc.builder.client.remote;

import com.jb4dc.base.service.aspect.ClientCallRemoteCache;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/22
 * To change this template use File | Settings | File Templates.
 */

@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "ListButtonRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },path = "${jb4dc.builder.server.context-path}/Rest/Builder/ListButton")
public interface WebListButtonRuntimeRemote {

    @RequestMapping(value = "/GetButtonPO",method = RequestMethod.POST)
    @ClientCallRemoteCache
    JBuild4DCResponseVo<ListButtonEntity> getButtonPO(@RequestParam("buttonId") String buttonId) throws JBuild4DCGenerallyException;
}
