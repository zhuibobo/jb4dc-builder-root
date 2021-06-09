package com.jb4dc.workflow.client.remote;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.aspect.ClientCallRemoteCache;
import com.jb4dc.builder.client.remote.BuilderClientFeignClientConfig;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.po.ExecutionTaskPO;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import com.jb4dc.workflow.po.ResolveNextPossibleFlowNodePO;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@Primary
@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "FlowInstanceIntegratedRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },
        path = "${jb4dc.builder.server.context-path}/Rest/Workflow/RunTime/FlowInstanceIntegratedRuntime")
public interface FlowInstanceIntegratedRuntimeRemote {

    @RequestMapping(value = "/GetRuntimeModelWithStart",method = RequestMethod.GET)
    @ClientCallRemoteCache
    JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithStart(@RequestParam("userId") String userId,@RequestParam("organId") String organId, @RequestParam("modelKey") String modelKey);

    @RequestMapping(value = "/GetRuntimeModelWithProcess",method = RequestMethod.GET)
    JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithProcess(@RequestParam("userId") String userId,@RequestParam("organId")  String organId, @RequestParam("extaskId") String extaskId);

    @RequestMapping(value = "/GetMyProcessTaskList",method = RequestMethod.GET)
    JBuild4DCResponseVo<PageInfo<ExecutionTaskPO>> getMyProcessTaskList(@RequestParam("pageNum") int pageNum, @RequestParam("pageSize") int pageSize, @RequestParam("userId") String userId, @RequestParam("organId")  String organId, @RequestParam("linkId") String linkId, @RequestParam("modelCategory") String modelCategory, @RequestParam("extaskType") String extaskType);

    @PostMapping(value = "/ResolveNextPossibleFlowNode",consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    JBuild4DCResponseVo<ResolveNextPossibleFlowNodePO> resolveNextPossibleFlowNode(Map<String, ?> formParams);

    @PostMapping(value = "/CompleteTask",consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    JBuild4DCResponseVo<String> completeTask(Map<String, ?> formParams);

    @PostMapping(value = "/CompleteTaskEnable",consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    JBuild4DCResponseVo<String> completeTaskEnable(Map<String, ?> formParams);
}
