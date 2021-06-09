package com.jb4dc.workflow.client.service;

import com.github.pagehelper.PageInfo;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.po.CompleteTaskResult;
import com.jb4dc.workflow.po.ExecutionTaskPO;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import com.jb4dc.workflow.po.ResolveNextPossibleFlowNodePO;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import com.jb4dc.workflow.po.bpmn.process.BpmnUserTask;
import com.jb4dc.workflow.po.receive.ClientSelectedReceiver;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IWorkFlowInstanceRuntimeService extends IWorkFlowRuntimeService {


    JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithStart(JB4DCSession jb4DCSession,String userId,String organId, String modelKey) throws IOException, JBuild4DCGenerallyException;

    JBuild4DCResponseVo<ResolveNextPossibleFlowNodePO> resolveNextPossibleFlowNode(JB4DCSession jb4DCSession,
                                                                                   String currentTaskId,
                                                                                   String currentNodeKey, String currentNodeName, String actionCode,
                                                                                   String flowInstanceRuntimePOCacheKey,
                                                                                   FormRecordComplexPO formRecordComplexPO, Map<String, Object> exVars) throws IOException, JBuild4DCGenerallyException;

    CompleteTaskResult completeTask(JB4DCSession jb4DCSession, boolean isStartInstanceStatus,String modelId,String modelReKey,String currentTaskId, String currentNodeKey, String currentNodeName, String actionCode, String flowInstanceRuntimePOCacheKey, FormRecordComplexPO formRecordComplexPO, List<ClientSelectedReceiver> clientSelectedReceiverList, String businessKey, Map<String, Object> exVars) throws IOException, JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException;

    JBuild4DCResponseVo<PageInfo<ExecutionTaskPO>> getMyProcessTaskList(JB4DCSession alex4DSession, int pageNum, int pageSize, String modelCategory, String extaskType);

    JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithProcess(JB4DCSession session, String userId, String organId, String extaskId) throws IOException, JBuild4DCGenerallyException;
}
