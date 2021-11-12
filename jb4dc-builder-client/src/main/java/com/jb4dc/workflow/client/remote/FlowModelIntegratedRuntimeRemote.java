package com.jb4dc.workflow.client.remote;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.aspect.ClientCallRemoteCache;
import com.jb4dc.builder.client.remote.BuilderClientFeignClientConfig;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.po.ExecutionTaskPO;
import com.jb4dc.workflow.po.FlowModelListIntegratedPO;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import com.jb4dc.workflow.po.ModelFilterPO;
import com.jb4dc.workflow.searchmodel.ExecutionTaskSearchModel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Primary;
import org.springframework.web.bind.annotation.*;


/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2021/4/23
 * To change this template use File | Settings | File Templates.
 */
@Primary
@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "FlowModelIntegratedRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },
        path = "${jb4dc.builder.server.context-path}/Rest/Workflow/RunTime/FlowModelIntegratedRuntime")
public interface FlowModelIntegratedRuntimeRemote {

    @RequestMapping(value = "/GetMyBootableModel",method = RequestMethod.GET)
    @ClientCallRemoteCache
    JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModel(@RequestParam("userId") String userId,@RequestParam("organId") String organId,@RequestParam("linkId") String linkId) throws JBuild4DCGenerallyException;

    @PostMapping(value = "/GetMyBootableModelWithSSOMenu")
    JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModelWithModelFilterPO(@RequestBody ModelFilterPO modelFilterPO) throws JBuild4DCGenerallyException;
}
