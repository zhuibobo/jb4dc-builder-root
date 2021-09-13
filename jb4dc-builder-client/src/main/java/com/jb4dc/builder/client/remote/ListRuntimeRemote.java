package com.jb4dc.builder.client.remote;

import com.jb4dc.base.service.aspect.ClientCallRemoteCache;
import com.jb4dc.base.service.po.DictionaryPO;
import com.jb4dc.builder.po.ListResourcePO;
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
 * Date: 2019/8/27
 * To change this template use File | Settings | File Templates.
 */

@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "ListRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },path = "${jb4dc.builder.server.context-path}/Rest/Builder/List")
public interface ListRuntimeRemote {

    @RequestMapping(value = "/LoadHTML", method = RequestMethod.POST)
    @ClientCallRemoteCache
    JBuild4DCResponseVo<ListResourcePO> loadHTML(@RequestParam("listId") String listId) throws JBuild4DCGenerallyException;
}
