package com.jb4dc.builder.webpackage.rest.workflow.instance;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.service.search.GeneralSearchUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.integrate.engine.IFlowEngineInstanceIntegratedService;
import com.jb4dc.workflow.integrate.extend.IInstanceExtendService;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import com.jb4dc.workflow.po.InstancePO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2021/4/23
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Workflow/Instance/FlowInstance")
public class FlowInstanceRest extends GeneralRest<InstanceEntity> {

    @Autowired
    IInstanceExtendService instanceExtendService;

    @Autowired
    IFlowEngineInstanceIntegratedService flowEngineInstanceIntegratedService;
    /*@Override
    public String getModuleName() {
        return "工作流-流程实例";
    }*/

    @RequestMapping(
            value = {"/test1"},
            method = {RequestMethod.POST, RequestMethod.GET}
    )
    public JBuild4DCResponseVo test1() throws IOException, JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession=JB4DCSessionUtility.getTempSession("","","","");
        List<String> caIds=new ArrayList<>();
        caIds.add("Activity_05b1vov");
        flowEngineInstanceIntegratedService.jumpToUserTaskActivityNode(jb4DCSession,"ca88c554-0ef5-11ec-b376-005056c00001","StartEvent_N1",caIds,"Alex4D",null);
        return JBuild4DCResponseVo.getDataSuccess("");
    }

    @Override
    protected IBaseService<InstanceEntity> getBaseService() {
        return instanceExtendService;
    }

    @RequestMapping(
            value = {"/GetMyManageEnableInstance"},
            method = {RequestMethod.POST, RequestMethod.GET}
    )
    public JBuild4DCResponseVo getMyManageEnableInstance(Integer pageSize, Integer pageNum) throws IOException {
        JB4DCSession jb4DSession = JB4DCSessionUtility.getSession();
        PageInfo<InstancePO> pageInfo=instanceExtendService.getMyManageEnableInstance(jb4DSession,pageNum,pageSize);
        return JBuild4DCResponseVo.getDataSuccess(pageInfo);
    }

    @RequestMapping(
            value = {"/GetInstanceRuntimePOByInstanceId"},
            method = {RequestMethod.POST, RequestMethod.GET}
    )
    public JBuild4DCResponseVo getInstanceRuntimePOByInstanceId(String instanceId) throws IOException, JBuild4DCGenerallyException, JAXBException, XMLStreamException {
        JB4DCSession jb4DSession = JB4DCSessionUtility.getSession();
        FlowInstanceRuntimePO flowInstanceRuntimePO=instanceExtendService.getInstanceRuntimePOByInstanceId(jb4DSession,instanceId);
        return JBuild4DCResponseVo.getDataSuccess(flowInstanceRuntimePO);
    }

    @RequestMapping(
            value = {"/UpdateInstanceToVersion"},
            method = {RequestMethod.POST, RequestMethod.GET}
    )
    public JBuild4DCResponseVo updateInstanceToVersion(String instanceId,String processDefinitionId) throws IOException, JBuild4DCGenerallyException, JAXBException, XMLStreamException {
        JB4DCSession jb4DSession = JB4DCSessionUtility.getSession();
        FlowInstanceRuntimePO flowInstanceRuntimePO=instanceExtendService.updateInstanceToVersion(jb4DSession,instanceId,processDefinitionId);
        return JBuild4DCResponseVo.opSuccess(flowInstanceRuntimePO);
        //return null;
    }
}
