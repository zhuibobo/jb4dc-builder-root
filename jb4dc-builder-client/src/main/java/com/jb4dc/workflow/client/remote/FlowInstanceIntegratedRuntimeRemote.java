package com.jb4dc.workflow.client.remote;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.aspect.ClientCallRemoteCache;
import com.jb4dc.base.service.po.SimplePO;
import com.jb4dc.builder.client.remote.BuilderClientFeignClientConfig;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.po.*;
import com.jb4dc.workflow.searchmodel.ExecutionTaskSearchModel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Primary;
import org.springframework.web.bind.annotation.*;

@Primary
@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "FlowInstanceIntegratedRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },
        path = "${jb4dc.builder.server.context-path}/Rest/Workflow/RunTime/FlowInstanceIntegratedRuntime")
public interface FlowInstanceIntegratedRuntimeRemote {

    @RequestMapping(value = "/GetRuntimeModelWithStart",method = RequestMethod.GET)
    @ClientCallRemoteCache(expirationTimeSeconds = 10L)
    JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithStart(@RequestParam("userId") String userId,@RequestParam("organId") String organId, @RequestParam("modelKey") String modelKey) throws JBuild4DCGenerallyException;

    @RequestMapping(value = "/GetRuntimeModelWithProcess",method = RequestMethod.GET)
    JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithProcessTask(@RequestParam("userId") String userId, @RequestParam("organId")  String organId, @RequestParam("extaskId") String extaskId) throws JBuild4DCGenerallyException;

    @RequestMapping(value = "/ChangeTaskToView",method = RequestMethod.POST)
    JBuild4DCResponseVo changeTaskToView(@RequestParam("extaskId") String extaskId) throws JBuild4DCGenerallyException;

    @RequestMapping(value = "/GetRuntimeModelWithEndTask",method = RequestMethod.GET)
    JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithEndTask(@RequestParam("userId") String userId, @RequestParam("organId")  String organId, @RequestParam("extaskId") String extaskId) throws JBuild4DCGenerallyException;

    @RequestMapping(value = "/GetMyProcessTaskList",method = RequestMethod.GET)
    JBuild4DCResponseVo<PageInfo<ExecutionTaskPO>> getMyProcessTaskList(@RequestParam("pageNum") int pageNum, @RequestParam("pageSize") int pageSize, @RequestParam("userId") String userId, @RequestParam("organId")  String organId, @RequestParam("linkId") String linkId, @RequestParam("modelCategory") String modelCategory, @RequestParam("extaskType") String extaskType) throws JBuild4DCGenerallyException;

    @PostMapping(value = "/GetMyProcessEndTaskList")
    JBuild4DCResponseVo<PageInfo<ExecutionTaskPO>> getMyProcessEndTaskList(@RequestBody ExecutionTaskSearchModel executionTaskSearchModel) throws JBuild4DCGenerallyException;

    @PostMapping(value = "/GetMyInstanceCompletedList")
    JBuild4DCResponseVo<PageInfo<ExecutionTaskPO>> getMyInstanceCompletedList(@RequestBody ExecutionTaskSearchModel executionTaskSearchModel) throws JBuild4DCGenerallyException;

    @PostMapping(value = "/ResolveNextPossibleFlowNode")
    JBuild4DCResponseVo<ResolveNextPossibleFlowNodePO> resolveNextPossibleFlowNode(@RequestBody RequestResolveNextPossibleFlowNodePO resolveNextPossibleFlowNodePO) throws JBuild4DCGenerallyException ;

    /*@PostMapping(value = "/CompleteTask",consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    JBuild4DCResponseVo<String> completeTask(Map<String, ?> formParams) throws JBuild4DCGenerallyException;*/

    @PostMapping(value = "/CompleteTask")
    JBuild4DCResponseVo<String> completeTask(@RequestBody RequestCompleteTaskPO requestCompleteTaskPO) throws JBuild4DCGenerallyException;

    /*@PostMapping(value = "/CompleteTaskEnable",consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    JBuild4DCResponseVo<String> completeTaskEnable(@RequestBody RequestCompleteTaskPO requestCompleteTaskPO);*/

    @PostMapping(value = "/CompleteTaskEnable")
    JBuild4DCResponseVo<String> completeTaskEnable(@RequestBody RequestCompleteTaskPO requestCompleteTaskPO) throws JBuild4DCGenerallyException;

    /*@PostMapping(value = "/RecallMySendTaskEnable")
    JBuild4DCResponseVo<SimplePO> recallMySendTaskEnable(@RequestParam("userId") String userId, @RequestParam("organId")  String organId, @RequestParam("extaskId") String extaskId) throws JBuild4DCGenerallyException;*/

    @PostMapping(value = "/RecallMySendTaskEnable")
    JBuild4DCResponseVo recallMySendTask(@RequestParam("userId") String userId, @RequestParam("organId")  String organId, @RequestParam("extaskId") String extaskId) throws JBuild4DCGenerallyException ;


}
