package com.jb4dc.portlet.client.remote;

import com.jb4dc.builder.client.remote.BuilderClientFeignClientConfig;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.portlet.dbentities.TemplatePageEntityWithBLOBs;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Primary;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Primary
@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "TemplatePageRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },
        path = "${jb4dc.builder.server.context-path}/Rest/Portlet/TemplatePage")
public interface TemplatePageRuntimeRemote {

    @RequestMapping(value = "/GetByPageId",method = RequestMethod.GET)
    JBuild4DCResponseVo<TemplatePageEntityWithBLOBs> getPageById(@RequestParam("pageId") String pageId) throws JBuild4DCGenerallyException;

}
