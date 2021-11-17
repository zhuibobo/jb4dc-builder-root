package com.jb4dc.portlet.client.remote;

import com.jb4dc.builder.client.remote.BuilderClientFeignClientConfig;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.portlet.dbentities.WidgetEntity;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Primary;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@Primary
@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "WidgetRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },
        path = "${jb4dc.builder.server.context-path}/Rest/Portlet/Widget")
public interface WidgetRuntimeRemote {

    @RequestMapping(value = "/GetALLWidget",method = RequestMethod.GET)
    JBuild4DCResponseVo<List<WidgetEntity>> getALLWidget() throws JBuild4DCGenerallyException;
}
