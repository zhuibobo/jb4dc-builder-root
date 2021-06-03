package com.jb4dc.builder.webpackage.rest.workflow.runtime;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.session.SSOSessionUtility;
import com.jb4dc.workflow.integrate.extend.IExecutionTaskExtendService;
import com.jb4dc.workflow.integrate.extend.IInstanceExtendService;
import com.jb4dc.workflow.po.CompleteTaskResult;
import com.jb4dc.workflow.po.ExecutionTaskPO;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import com.jb4dc.workflow.po.receive.ClientSelectedReceiver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.text.ParseException;
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
public class FlowInstanceIntegratedRuntimeRest {

    @Autowired
    IInstanceExtendService instanceExtendService;

    @Autowired
    IExecutionTaskExtendService executionTaskExtendService;

    @RequestMapping(
            value = {"/GetRuntimeModelWithStart"},
            method = {RequestMethod.GET}
    )
    public JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithStart(String userId,String organId, String modelKey) throws IOException, ParseException, JBuild4DCGenerallyException, JAXBException, XMLStreamException {
        JB4DCSession jb4DCSession = SSOSessionUtility.buildJB4DCSessionFromRemote(userId, organId);
        FlowInstanceRuntimePO flowInstanceRuntimePO = instanceExtendService.getRuntimeModelWithStart(jb4DCSession, modelKey);
        return JBuild4DCResponseVo.getDataSuccess(flowInstanceRuntimePO);
    }

    @RequestMapping(
            value = {"/GetRuntimeModelWithProcess"},
            method = {RequestMethod.GET}
    )
    public JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithProcess(String userId,String organId, String extaskId) throws IOException, ParseException, JBuild4DCGenerallyException, JAXBException, XMLStreamException {
        JB4DCSession jb4DCSession = SSOSessionUtility.buildJB4DCSessionFromRemote(userId, organId);
        FlowInstanceRuntimePO flowInstanceRuntimePO = instanceExtendService.getRuntimeModelWithProcess(jb4DCSession, extaskId);
        return JBuild4DCResponseVo.getDataSuccess(flowInstanceRuntimePO);
    }

    @RequestMapping(
            value = {"/GetMyProcessTaskList"},
            method = {RequestMethod.GET}
    )
    public JBuild4DCResponseVo<PageInfo<ExecutionTaskPO>> getMyProcessTaskList(int pageNum,int pageSize,String userId, String organId, String linkId, String modelCategory, String extaskType) throws IOException, ParseException, JBuild4DCGenerallyException, JAXBException, XMLStreamException {
        JB4DCSession jb4DCSession = SSOSessionUtility.buildJB4DCSessionFromRemote(userId, organId);
        PageInfo<ExecutionTaskPO> executionTaskPOPageInfo = executionTaskExtendService.getMyProcessTaskList(jb4DCSession,pageNum,pageSize, userId,organId,linkId,modelCategory,extaskType);
        return JBuild4DCResponseVo.getDataSuccess(executionTaskPOPageInfo);
    }

    @RequestMapping(value = "/ResolveNextPossibleFlowNode",method = RequestMethod.POST)
    public JBuild4DCResponseVo<List<BpmnTask>> resolveNextPossibleFlowNode(String userId,String organId, String modelKey,String instanceId, String currentNodeKey,String currentNodeName, String actionCode, String varsJsonString) throws IOException, JAXBException, XMLStreamException, JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession = SSOSessionUtility.buildJB4DCSessionFromRemote(userId, organId);
        Map<String, Object> vars = JsonUtility.toObject(varsJsonString, Map.class);
        List<BpmnTask> bpmnTaskList = instanceExtendService.resolveNextPossibleFlowNode(jb4DCSession, modelKey, instanceId, currentNodeKey, actionCode, vars);
        return JBuild4DCResponseVo.getDataSuccess(bpmnTaskList);
    }

    @RequestMapping(value = "/CompleteTask",method = RequestMethod.POST)
    public JBuild4DCResponseVo completeTask(String isStartInstanceStatus,
                                            String userId,String organId,
                                            String modelId,String modelReKey,String currentTaskId,
                                            String currentNodeKey,String currentNodeName, String actionCode,
                                            String varsJsonString,String selectedReceiverVars,String businessKey,
                                            String instanceTitle,String instanceDesc) throws IOException, JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException {
        JB4DCSession jb4DCSession = SSOSessionUtility.buildJB4DCSessionFromRemote(userId, organId);
        Map<String, Object> vars = JsonUtility.toObject(varsJsonString, Map.class);
        List<ClientSelectedReceiver> clientSelectedReceiverList = ClientSelectedReceiver.parse(selectedReceiverVars);
        CompleteTaskResult completeTaskResult = instanceExtendService.completeTask(jb4DCSession, isStartInstanceStatus.equals("true") ? true : false, modelId, modelReKey, currentTaskId, currentNodeKey, currentNodeName, actionCode, vars, clientSelectedReceiverList, businessKey, instanceTitle, instanceDesc);
        return completeTaskResult;
    }
}
