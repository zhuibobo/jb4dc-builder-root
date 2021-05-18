package com.jb4dc.workflow.client.rest;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.client.service.IWorkFlowInstanceRuntimeService;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
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
@RequestMapping(value = "/Rest/Workflow/RunTime/InstanceRuntime")
public class InstanceRuntimeRest {

    @Autowired
    IWorkFlowInstanceRuntimeService workFlowInstanceRuntimeService;

    @RequestMapping(value = "/ResolveNextPossibleFlowNode",method = RequestMethod.POST)
    public JBuild4DCResponseVo<List<BpmnTask>> resolveNextPossibleFlowNode(boolean isStartInstanceStatus, String actionCode,String flowModelRuntimePOCacheKey,String formRecordComplexPOString) throws IOException, JBuild4DCGenerallyException {

        formRecordComplexPOString= URLDecoder.decode(formRecordComplexPOString,"utf-8");
        FormRecordComplexPO formRecordComplexPO = JsonUtility.toObjectIgnoreProp(formRecordComplexPOString,FormRecordComplexPO.class);
        Map exVars=new HashMap();
        if(isStartInstanceStatus) {
            return workFlowInstanceRuntimeService.resolveNextPossibleFlowNodeWithStartNode(JB4DCSessionUtility.getSession(), actionCode, flowModelRuntimePOCacheKey, formRecordComplexPO, exVars);
        }
        return null;
        //return null;
    }

    @RequestMapping(value = "/CompleteTask",method = RequestMethod.POST)
    public JBuild4DCResponseVo completeTask(boolean isStartInstanceStatus, String actionCode,String flowModelRuntimePOCacheKey,String formRecordComplexPOString,String selectedReceiverVars) throws IOException, JBuild4DCGenerallyException {
        return null;
    }
}
