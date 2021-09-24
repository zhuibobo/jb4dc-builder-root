package com.jb4dc.builder.webpackage.rest.workflow.runtime;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.service.po.SimplePO;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.client.remote.FlowInstanceIntegratedRuntimeRemote;
import com.jb4dc.workflow.integrate.extend.IExecutionTaskExtendService;
import com.jb4dc.workflow.integrate.extend.IInstanceExtendService;
import com.jb4dc.workflow.po.*;
import com.jb4dc.workflow.po.receive.ClientSelectedReceiver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;


/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2021/4/23
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Workflow/RunTime/FlowInstanceIntegratedRuntime")
public class FlowInstanceIntegratedRuntimeRest implements FlowInstanceIntegratedRuntimeRemote {

    @Autowired
    IInstanceExtendService instanceExtendService;

    @Autowired
    IExecutionTaskExtendService executionTaskExtendService;

    @Override
    public JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithStart(String userId,String organId, String modelKey) throws JBuild4DCGenerallyException {
        try {
            JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
            FlowInstanceRuntimePO flowInstanceRuntimePO = instanceExtendService.getInstanceRuntimePOWithStart(jb4DCSession, modelKey);
            return JBuild4DCResponseVo.getDataSuccess(flowInstanceRuntimePO);
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,ex);
        }
    }

    @Override
    public JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithProcessTask(String userId, String organId, String extaskId) throws JBuild4DCGenerallyException {
        try {
            JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
            FlowInstanceRuntimePO flowInstanceRuntimePO = instanceExtendService.getInstanceRuntimePOWithProcessTask(jb4DCSession, extaskId);
            return JBuild4DCResponseVo.getDataSuccess(flowInstanceRuntimePO);
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,ex);
        }
    }

    @Override
    public JBuild4DCResponseVo changeTaskToView(String extaskId) throws JBuild4DCGenerallyException {
        try {
            JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
            executionTaskExtendService.changeTaskToView(jb4DCSession, extaskId);
            return JBuild4DCResponseVo.opSuccess();
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,ex);
        }
    }

    @Override
    public JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithEndTask(String userId, String organId, String extaskId) throws JBuild4DCGenerallyException {
        try {
            JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
            FlowInstanceRuntimePO flowInstanceRuntimePO = instanceExtendService.getInstanceRuntimePOWithEndTask(jb4DCSession, extaskId);
            return JBuild4DCResponseVo.getDataSuccess(flowInstanceRuntimePO);
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,ex);
        }
    }

    @Override
    public JBuild4DCResponseVo<PageInfo<ExecutionTaskPO>> getMyProcessTaskList(int pageNum,int pageSize,String userId, String organId, String linkId, String modelCategory, String extaskType) throws JBuild4DCGenerallyException {
        try {
            JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
            PageInfo<ExecutionTaskPO> executionTaskPOPageInfo = executionTaskExtendService.getMyProcessTaskList(jb4DCSession, pageNum, pageSize, userId, organId, linkId, modelCategory, extaskType);
            return JBuild4DCResponseVo.getDataSuccess(executionTaskPOPageInfo);
        } catch (Exception ex) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, ex);
        }
    }

    @Override
    public JBuild4DCResponseVo<PageInfo<ExecutionTaskPO>> getMyProcessEndTaskList(int pageNum,int pageSize,String userId, String organId, String linkId, String modelCategory, String extaskType) throws JBuild4DCGenerallyException{
        JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
        PageInfo<ExecutionTaskPO> executionTaskPOPageInfo = executionTaskExtendService.getMyProcessEndTaskList(jb4DCSession,pageNum,pageSize, userId,organId,linkId,modelCategory,extaskType);
        return JBuild4DCResponseVo.getDataSuccess(executionTaskPOPageInfo);
    }

    @Override
    public JBuild4DCResponseVo<ResolveNextPossibleFlowNodePO> resolveNextPossibleFlowNode(@RequestBody RequestResolveNextPossibleFlowNodePO reqPO) throws JBuild4DCGenerallyException {
        try {
            JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
            Map<String, Object> vars = JsonUtility.toObject(reqPO.getVarsJsonString(), Map.class);
            ResolveNextPossibleFlowNodePO resolveNextPossibleFlowNodePO = instanceExtendService.resolveNextPossibleFlowNode(jb4DCSession, reqPO.getModelReKey()
                    , reqPO.getCurrentTaskId(), reqPO.getCurrentNodeKey(), reqPO.getActionCode(), vars);
            return JBuild4DCResponseVo.getDataSuccess(resolveNextPossibleFlowNodePO);
        } catch (Exception ex) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, ex);
        }
    }

    @Override
    public JBuild4DCResponseVo<String> completeTask(@RequestBody RequestCompleteTaskPO requestCompleteTaskPO) throws JBuild4DCGenerallyException {
        try {
            JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
            Map<String, Object> vars = JsonUtility.toObject(requestCompleteTaskPO.getVarsJsonString(), Map.class);
            List<ClientSelectedReceiver> clientSelectedReceiverList = ClientSelectedReceiver.parse(requestCompleteTaskPO.getSelectedReceiverVars());
            TaskActionResult completeTaskResult = instanceExtendService.completeTask(jb4DCSession, requestCompleteTaskPO.isStartInstanceStatus(),
                    requestCompleteTaskPO.getInstanceId(), requestCompleteTaskPO.getModelId(), requestCompleteTaskPO.getModelReKey(), requestCompleteTaskPO.getCurrentTaskId(),
                    requestCompleteTaskPO.getCurrentNodeKey(), requestCompleteTaskPO.getCurrentNodeName(), requestCompleteTaskPO.getActionCode(), vars, clientSelectedReceiverList,
                    requestCompleteTaskPO.getBusinessKey(), requestCompleteTaskPO.getInstanceTitle(), requestCompleteTaskPO.getInstanceDesc());
            return completeTaskResult;
        } catch (Exception ex) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, ex);
        }
    }

    @Override
    public JBuild4DCResponseVo<String> completeTaskEnable(@RequestBody RequestCompleteTaskPO requestCompleteTaskPO) throws JBuild4DCGenerallyException {
        try {
            JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
            Map<String, Object> vars = JsonUtility.toObject(requestCompleteTaskPO.getVarsJsonString(), Map.class);
            List<ClientSelectedReceiver> clientSelectedReceiverList = ClientSelectedReceiver.parse(requestCompleteTaskPO.getSelectedReceiverVars());
            TaskActionResult completeTaskResult = instanceExtendService.completeTaskEnable(jb4DCSession, requestCompleteTaskPO.isStartInstanceStatus(),
                    requestCompleteTaskPO.getModelId(), requestCompleteTaskPO.getModelReKey(), requestCompleteTaskPO.getCurrentTaskId(),
                    requestCompleteTaskPO.getCurrentNodeKey(), requestCompleteTaskPO.getCurrentNodeName(), requestCompleteTaskPO.getActionCode(), vars, clientSelectedReceiverList,
                    requestCompleteTaskPO.getBusinessKey(), requestCompleteTaskPO.getInstanceTitle(), requestCompleteTaskPO.getInstanceDesc());
            return completeTaskResult;
        } catch (Exception ex) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, ex);
        }
    }

    /*@Override
    public JBuild4DCResponseVo<SimplePO> recallMySendTaskEnable(String userId, String organId, String extaskId) throws JBuild4DCGenerallyException {
        try {
            JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
            SimplePO simplePO = instanceExtendService.recallMySendTaskEnable(jb4DCSession, userId, organId, extaskId);
            return JBuild4DCResponseVo.getDataSuccess(simplePO);
        } catch (Exception ex) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, ex);
        }
    }*/

    @Override
    public JBuild4DCResponseVo recallMySendTask(String userId, String organId, String extaskId) throws JBuild4DCGenerallyException  {
        try {

            JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
            TaskActionResult taskActionResult=instanceExtendService.recallMySendTask(jb4DCSession, userId, organId, extaskId);
            return taskActionResult;
        } catch (Exception ex) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, ex);
        }
    }

    /*@Override
    public JBuild4DCResponseVo completeTask(String isStartInstanceStatus,String instanceId,
                                            String userId,String organId,
                                            String modelId,String modelReKey,String currentTaskId,
                                            String currentNodeKey,String currentNodeName, String actionCode,
                                            String varsJsonString,String selectedReceiverVars,String businessKey,
                                            String instanceTitle,String instanceDesc) throws JBuild4DCGenerallyException {
        try {
            JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
            Map<String, Object> vars = JsonUtility.toObject(varsJsonString, Map.class);
            List<ClientSelectedReceiver> clientSelectedReceiverList = ClientSelectedReceiver.parse(selectedReceiverVars);
            CompleteTaskResult completeTaskResult = instanceExtendService.completeTask(jb4DCSession, isStartInstanceStatus.equals("true") ? true : false, instanceId, modelId, modelReKey, currentTaskId, currentNodeKey, currentNodeName, actionCode, vars, clientSelectedReceiverList, businessKey, instanceTitle, instanceDesc);
            return completeTaskResult;
        } catch (Exception ex) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, ex);
        }
    }

    @RequestMapping(value = "/CompleteTaskEnable",method = RequestMethod.POST)
    public JBuild4DCResponseVo completeTaskEnable(String isStartInstanceStatus,
                                            String userId,String organId,
                                            String modelId,String modelReKey,String currentTaskId,
                                            String currentNodeKey,String currentNodeName, String actionCode,
                                            String varsJsonString,String selectedReceiverVars,String businessKey,
                                            String instanceTitle,String instanceDesc) throws IOException, JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException {
        JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
        Map<String, Object> vars = JsonUtility.toObject(varsJsonString, Map.class);
        List<ClientSelectedReceiver> clientSelectedReceiverList = ClientSelectedReceiver.parse(selectedReceiverVars);
        CompleteTaskResult completeTaskResult = instanceExtendService.completeTaskEnable(jb4DCSession, isStartInstanceStatus.equals("true") ? true : false, modelId, modelReKey, currentTaskId, currentNodeKey, currentNodeName, actionCode, vars, clientSelectedReceiverList, businessKey, instanceTitle, instanceDesc);
        return completeTaskResult;
    }*/
}
