package com.jb4dc.builder.webpackage.rest.workflow.runtime;

import com.jb4dc.base.service.general.JB4DCSessionCenter;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.webpackage.rest.workflow.FlowModelIntegratedRest;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.dbentities.ModelGroupEntity;
import com.jb4dc.workflow.dbentities.ModelGroupRefEntity;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.integrate.extend.IInstanceExtendService;
import com.jb4dc.workflow.integrate.extend.IModelGroupExtendService;
import com.jb4dc.workflow.integrate.extend.IModelGroupRefExtendService;
import com.jb4dc.workflow.integrate.extend.IModelIntegratedExtendService;
import com.jb4dc.workflow.po.FlowModelListIntegratedPO;
import com.jb4dc.workflow.po.FlowModelRuntimePO;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import com.jb4dc.workflow.po.bpmn.process.BpmnUserTask;
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
import java.util.stream.Collectors;


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

    @RequestMapping(value = "/ResolveNextPossibleUseTaskWithStartNode",method = RequestMethod.POST)
    public JBuild4DCResponseVo<List<BpmnTask>> resolveNextPossibleUseTaskWithStartNode(String userId, String modelKey, String currentNodeKey, String actionCode, String varsJsonString) throws IOException, JAXBException, XMLStreamException, JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession = JB4DCSessionCenter.getUserSessionByUserId(userId);
        Map<String,Object> vars= JsonUtility.toObject(varsJsonString,Map.class);
        List<BpmnTask> bpmnTaskList=instanceExtendService.resolveNextPossibleUseTaskWithStartNode(jb4DCSession,modelKey,currentNodeKey,actionCode,vars);
        return JBuild4DCResponseVo.getDataSuccess(bpmnTaskList);
    }
}
