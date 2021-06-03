package com.jb4dc.qcsystem.webserver.test.workflowclient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.general.JB4DCUnitSessionSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.qcsystem.webserver.test.RestTestBase;
import com.jb4dc.workflow.client.remote.FlowInstanceIntegratedRuntimeRemote;
import com.jb4dc.workflow.client.service.IWorkFlowInstanceRuntimeService;
import com.jb4dc.workflow.client.service.IWorkFlowModelRuntimeService;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.po.ExecutionTaskPO;
import com.jb4dc.workflow.po.FlowModelListIntegratedPO;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FlowModelIntegratedRuntimeRemoteTest  extends RestTestBase {

    @Autowired
    IWorkFlowModelRuntimeService workFlowModelRuntimeService;

    @Autowired
    IWorkFlowInstanceRuntimeService workFlowInstanceRuntimeService;

    @Autowired
    FlowInstanceIntegratedRuntimeRemote flowInstanceIntegratedRuntimeRemote;

    @Test
    public void getHasAuthorityAppSSO() throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCUnitSessionSessionUtility.mockLogin(getAlex4DSession());
        JBuild4DCResponseVo<FlowModelListIntegratedPO> result = workFlowModelRuntimeService.getMyBootableModel(getAlex4DSession(),"Alex4D",getAlex4DSession().getOrganId());
        for (ModelIntegratedEntity modelIntegratedEntity : result.getData().getModelIntegratedEntityList()) {
            System.out.println(modelIntegratedEntity.getModelName());
        }

        String json = JsonUtility.toObjectString(result);
        System.out.println(json);
    }

    @Test
    public void getMyProcessTask() throws JBuild4DCGenerallyException, IOException {
        JB4DCUnitSessionSessionUtility.mockLogin(getAlex4DSession());
        String modelCategory="GeneralProcess";
        String extaskType="主送任务";
        JBuild4DCResponseVo<PageInfo<ExecutionTaskPO>> result = workFlowInstanceRuntimeService.getMyProcessTaskList(getAlex4DSession(),1,20, modelCategory, extaskType);
        /*for (ModelIntegratedEntity modelIntegratedEntity : result.getData().getModelIntegratedEntityList()) {
            System.out.println(modelIntegratedEntity.getModelName());
        }*/

        String json = JsonUtility.toObjectString(result);
        System.out.println(json);
    }

    @Test
    public void getRuntimeModelWithStart() throws JBuild4DCGenerallyException, IOException {
        JB4DCUnitSessionSessionUtility.mockLogin(getAlex4DSession());
        JBuild4DCResponseVo<FlowInstanceRuntimePO> result = workFlowInstanceRuntimeService.getRuntimeModelWithStart(getAlex4DSession(),"Alex4D",getAlex4DSession().getOrganId(),"Flow_Model_1619519188394");
        /*for (ModelIntegratedEntity modelIntegratedEntity : result.getData().getModelIntegratedEntityList()) {
            System.out.println(modelIntegratedEntity.getModelName());
        }*/

        String json = JsonUtility.toObjectString(result);
        System.out.println(json);
    }

    @Test
    public void resolveNextPossibleTaskWithStartNode() throws JBuild4DCGenerallyException, IOException {
        JB4DCUnitSessionSessionUtility.mockLogin(getAlex4DSession());
        Map<String,Object> vars=new HashMap<>();
        //vars.put("LastActionKey","__$FlowAction$$StartEvent_N1$$action_526152327$");
        Map<String,Object> formParams=new HashMap<>();
        formParams.put("userId","Alex4D");
        formParams.put("modelKey","Flow_Model_1619519188394");
        formParams.put("currentNodeKey","StartEvent_N1");
        formParams.put("actionCode","action_955710861");
        formParams.put("varsJsonString",JsonUtility.toObjectString(vars));
        JBuild4DCResponseVo<List<BpmnTask>> result = flowInstanceIntegratedRuntimeRemote.resolveNextPossibleFlowNode(formParams);
        /*for (ModelIntegratedEntity modelIntegratedEntity : result.getData().getModelIntegratedEntityList()) {
            System.out.println(modelIntegratedEntity.getModelName());
        }*/

        String json = JsonUtility.toObjectString(result);
        System.out.println(json);
    }
}
