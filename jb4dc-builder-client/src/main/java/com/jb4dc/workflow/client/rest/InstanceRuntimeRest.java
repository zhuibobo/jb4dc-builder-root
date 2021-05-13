package com.jb4dc.workflow.client.rest;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.client.service.IWorkFlowInstanceRuntimeService;
import com.jb4dc.workflow.po.FlowModelListIntegratedPO;
import liquibase.pro.packaged.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Workflow/RunTime/InstanceRuntime")
public class InstanceRuntimeRest {

    @Autowired
    IWorkFlowInstanceRuntimeService workFlowInstanceRuntimeService;

    @RequestMapping(value = "/GetMyBootableModel",method = RequestMethod.GET)
    public JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModel(String modelRuKey, String currentNodeKey, String actionCode){
        //return workFlowInstanceRuntimeService.resolveNextPossibleUseTaskWithStartNode(JB4DCSessionUtility.getSession(),);
        return null;
    }
}
