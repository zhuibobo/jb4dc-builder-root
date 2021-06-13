package com.jb4dc.workflow.client.rest.client;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.client.service.IWorkFlowInstanceRuntimeService;
import com.jb4dc.workflow.po.CompleteTaskResult;
import com.jb4dc.workflow.po.ExecutionTaskPO;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import com.jb4dc.workflow.po.ResolveNextPossibleFlowNodePO;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import com.jb4dc.workflow.po.receive.ClientSelectedReceiver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Workflow/RunTime/Client/InstanceRuntime")
public class InstanceRuntimeRest {

    @Autowired
    IWorkFlowInstanceRuntimeService workFlowInstanceRuntimeService;

    @RequestMapping(value = "/GetRuntimeModelWithStart",method = RequestMethod.GET)
    public JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithStart(String modelKey) throws IOException, JBuild4DCGenerallyException {
        return workFlowInstanceRuntimeService.getRuntimeModelWithStart(JB4DCSessionUtility.getSession(),JB4DCSessionUtility.getSession().getUserId(),JB4DCSessionUtility.getSession().getOrganId(),modelKey);
    }

    @RequestMapping(value = "/GetRuntimeModelWithProcess",method = RequestMethod.GET)
    public JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithProcess(String extaskId) throws IOException, JBuild4DCGenerallyException {
        return workFlowInstanceRuntimeService.getRuntimeModelWithProcess(JB4DCSessionUtility.getSession(),JB4DCSessionUtility.getSession().getUserId(),JB4DCSessionUtility.getSession().getOrganId(),extaskId);
    }

    @RequestMapping(value = "/GetMyProcessTaskList",method = RequestMethod.POST)
    public JBuild4DCResponseVo<PageInfo<ExecutionTaskPO>> getMyProcessTask(int pageNum, int pageSize, String modelCategory, String extaskType) {
        return workFlowInstanceRuntimeService.getMyProcessTaskList(JB4DCSessionUtility.getSession(),pageNum, pageSize, modelCategory, extaskType);
    }

    @RequestMapping(value = "/ResolveNextPossibleFlowNode",method = RequestMethod.POST)
    public JBuild4DCResponseVo<ResolveNextPossibleFlowNodePO> resolveNextPossibleFlowNode(boolean isStartInstanceStatus, String currentTaskId, String currentNodeKey, String currentNodeName, String recordId, String actionCode, String flowInstanceRuntimePOCacheKey, String formRecordComplexPOString) throws IOException, JBuild4DCGenerallyException {

        formRecordComplexPOString = URLDecoder.decode(formRecordComplexPOString, "utf-8");
        FormRecordComplexPO formRecordComplexPO = JsonUtility.toObjectIgnoreProp(formRecordComplexPOString, FormRecordComplexPO.class);
        Map exVars = new HashMap();
        if (isStartInstanceStatus) {
            return workFlowInstanceRuntimeService.resolveNextPossibleFlowNode(JB4DCSessionUtility.getSession(), "", currentNodeKey, currentNodeName, actionCode, flowInstanceRuntimePOCacheKey, formRecordComplexPO, exVars);
        } else {
            return workFlowInstanceRuntimeService.resolveNextPossibleFlowNode(JB4DCSessionUtility.getSession(), currentTaskId, currentNodeKey, currentNodeName, actionCode, flowInstanceRuntimePOCacheKey, formRecordComplexPO, exVars);
        }
    }

    @RequestMapping(value = "/CompleteTask",method = RequestMethod.POST)
    public JBuild4DCResponseVo completeTask(boolean isStartInstanceStatus,String instanceId,
                                            String modelId,String modelReKey,
                                            String currentTaskId,String currentNodeKey,String currentNodeName,
                                            String recordId, String actionCode,
                                            String flowInstanceRuntimePOCacheKey,String formRecordComplexPOString,String selectedReceiverVars) throws IOException, JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException {
        formRecordComplexPOString= URLDecoder.decode(formRecordComplexPOString,"utf-8");
        FormRecordComplexPO formRecordComplexPO = JsonUtility.toObjectIgnoreProp(formRecordComplexPOString,FormRecordComplexPO.class);
        selectedReceiverVars= URLDecoder.decode(selectedReceiverVars,"utf-8");
        List<ClientSelectedReceiver> clientSelectedReceiverList= ClientSelectedReceiver.parse(selectedReceiverVars);
        CompleteTaskResult completeTaskResult=workFlowInstanceRuntimeService.completeTask(JB4DCSessionUtility.getSession(),isStartInstanceStatus,instanceId,modelId,modelReKey,currentTaskId,currentNodeKey,currentNodeName,actionCode,flowInstanceRuntimePOCacheKey,formRecordComplexPO,clientSelectedReceiverList,recordId,null);
        return completeTaskResult;
    }
}
