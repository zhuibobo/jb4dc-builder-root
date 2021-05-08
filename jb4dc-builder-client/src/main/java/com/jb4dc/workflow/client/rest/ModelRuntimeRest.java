package com.jb4dc.workflow.client.rest;

import com.jb4dc.base.service.aspect.ClientCallRemoteCache;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.client.remote.FlowModelIntegratedRuntimeRemote;
import com.jb4dc.workflow.client.service.IWorkFlowModelRuntimeService;
import com.jb4dc.workflow.po.FlowModelListIntegratedPO;
import com.jb4dc.workflow.po.FlowModelRuntimePO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping(value = "/Rest/Workflow/RunTime/ModelRuntime")
public class ModelRuntimeRest {

    @Autowired
    IWorkFlowModelRuntimeService workFlowModelRuntimeService;

    @RequestMapping(value = "/GetMyBootableModel",method = RequestMethod.GET)
    public JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModel(){
       return workFlowModelRuntimeService.getMyBootableModel(JB4DCSessionUtility.getSession().getUserId());
    }

    @RequestMapping(value = "/GetRuntimeModelWithStart",method = RequestMethod.GET)
    public JBuild4DCResponseVo<FlowModelRuntimePO> getRuntimeModelWithStart(String modelKey) throws IOException, JBuild4DCGenerallyException {
        return workFlowModelRuntimeService.getRuntimeModelWithStart(JB4DCSessionUtility.getSession().getUserId(),modelKey);
    }
}
