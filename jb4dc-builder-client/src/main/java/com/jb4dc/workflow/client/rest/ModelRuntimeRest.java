package com.jb4dc.workflow.client.rest;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.client.service.IWorkFlowModelRuntimeService;
import com.jb4dc.workflow.po.FlowModelListIntegratedPO;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping(value = "/Rest/Workflow/RunTime/Client/ModelRuntime")
public class ModelRuntimeRest {

    @Autowired
    IWorkFlowModelRuntimeService workFlowModelRuntimeService;

    @RequestMapping(value = "/GetMyBootableModel",method = RequestMethod.GET)
    public JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModel() throws JBuild4DCGenerallyException {

       return workFlowModelRuntimeService.getMyBootableModel(JB4DCSessionUtility.getSession(),JB4DCSessionUtility.getSession().getUserId(),JB4DCSessionUtility.getSession().getOrganId());
    }

    @RequestMapping(value = "/GetMyBootableModelWithSSOMenu",method = RequestMethod.GET)
    public JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModelWithSSOMenu(String menuId) throws JBuild4DCGenerallyException, IOException {
        return workFlowModelRuntimeService.getMyBootableModel(JB4DCSessionUtility.getSession(),menuId,JB4DCSessionUtility.getSession().getUserId(),JB4DCSessionUtility.getSession().getOrganId());
    }
}
