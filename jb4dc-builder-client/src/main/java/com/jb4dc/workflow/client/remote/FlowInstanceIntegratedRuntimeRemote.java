package com.jb4dc.workflow.client.remote;

import com.jb4dc.builder.client.remote.BuilderClientFeignClientConfig;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.Map;

@Primary
@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "FlowInstanceIntegratedRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },
        path = "${jb4dc.builder.server.context-path}/Rest/Workflow/RunTime/FlowInstanceIntegratedRuntime")
public interface FlowInstanceIntegratedRuntimeRemote {

    @PostMapping(value = "/ResolveNextPossibleFlowNodeWithStartNode",consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    JBuild4DCResponseVo<List<BpmnTask>> resolveNextPossibleFlowNodeWithStartNode(Map<String, ?> formParams);

}
