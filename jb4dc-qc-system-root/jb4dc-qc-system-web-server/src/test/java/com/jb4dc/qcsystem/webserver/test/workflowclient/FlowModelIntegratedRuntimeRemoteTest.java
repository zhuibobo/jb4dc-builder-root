package com.jb4dc.qcsystem.webserver.test.workflowclient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.general.JB4DCUnitSessionSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.qcsystem.webserver.test.RestTestBase;
import com.jb4dc.workflow.client.remote.FlowModelIntegratedRuntimeRemote;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.po.FlowModelListIntegratedPO;
import com.jb4dc.workflow.po.FlowModelRuntimePO;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class FlowModelIntegratedRuntimeRemoteTest  extends RestTestBase {

    @Autowired
    FlowModelIntegratedRuntimeRemote flowModelIntegratedRuntimeRemote;

    @Test
    public void getHasAuthorityAppSSO() throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCUnitSessionSessionUtility.mockLogin(getAlex4DSession());
        JBuild4DCResponseVo<FlowModelListIntegratedPO> result = flowModelIntegratedRuntimeRemote.getMyBootableModel("Alex4D");
        for (ModelIntegratedEntity modelIntegratedEntity : result.getData().getModelIntegratedEntityList()) {
            System.out.println(modelIntegratedEntity.getModelName());
        }

        String json = JsonUtility.toObjectString(result);
        System.out.println(json);
    }

    @Test
    public void getRuntimeModelWithStart() throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCUnitSessionSessionUtility.mockLogin(getAlex4DSession());
        JBuild4DCResponseVo<FlowModelRuntimePO> result = flowModelIntegratedRuntimeRemote.getRuntimeModelWithStart("Alex4D","Flow_Model_1619519188394");
        /*for (ModelIntegratedEntity modelIntegratedEntity : result.getData().getModelIntegratedEntityList()) {
            System.out.println(modelIntegratedEntity.getModelName());
        }*/

        String json = JsonUtility.toObjectString(result);
        System.out.println(json);
    }
}
