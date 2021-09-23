package com.jb4dc.workflow.client.remote;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.aspect.ClientCallRemoteCache;
import com.jb4dc.builder.client.remote.BuilderClientFeignClientConfig;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.dbentities.InstanceFileEntity;
import com.jb4dc.workflow.po.ExecutionTaskPO;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import com.jb4dc.workflow.po.RequestResolveNextPossibleFlowNodePO;
import com.jb4dc.workflow.po.ResolveNextPossibleFlowNodePO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Primary
@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "FlowInstanceFileIntegratedRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },
        path = "${jb4dc.builder.server.context-path}/Rest/Workflow/RunTime/FlowInstanceFileIntegratedRuntime")
public interface FlowInstanceFileIntegratedRuntimeRemote {
    @PostMapping(value = "/AddInstanceFile")
    JBuild4DCResponseVo<String> addInstanceFile(@RequestBody InstanceFileEntity instanceFileEntity) throws JBuild4DCGenerallyException;

    @PostMapping(value = "/GetInstanceFileById")
    JBuild4DCResponseVo<InstanceFileEntity> getInstanceFileById(@RequestParam("instanceFileId") String instanceFileId) throws JBuild4DCGenerallyException;

    @RequestMapping(value = "/GetAttachmentFileListData",method = RequestMethod.GET)
    JBuild4DCResponseVo<List<InstanceFileEntity>> getAttachmentFileListData(@RequestParam("userId") String userId,@RequestParam("organId") String organId,@RequestParam("instanceId") String instanceId) throws JBuild4DCGenerallyException;

    @GetMapping(value = "/TryGetLastOnlineDocument")
    JBuild4DCResponseVo<InstanceFileEntity> tryGetLastOnlineDocument(@RequestParam("instanceId") String instanceId);
}
