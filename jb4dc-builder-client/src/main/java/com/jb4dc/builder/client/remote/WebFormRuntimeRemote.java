package com.jb4dc.builder.client.remote;

import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/21
 * To change this template use File | Settings | File Templates.
 */

@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "FormRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },path = "${jb4dc.builder.server.context-path}/Rest/Builder/RunTime/FormRuntime")
public interface WebFormRuntimeRemote {

    @RequestMapping(value = "/LoadHTML", method = RequestMethod.POST)
    JBuild4DCResponseVo<FormResourcePO> loadHTML(@RequestParam("formId") String formId);

}
