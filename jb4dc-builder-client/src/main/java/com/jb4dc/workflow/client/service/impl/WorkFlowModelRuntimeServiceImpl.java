package com.jb4dc.workflow.client.service.impl;

import com.jb4dc.base.service.po.MenuPO;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.remote.MenuRuntimeRemote;
import com.jb4dc.workflow.client.remote.FlowModelIntegratedRuntimeRemote;
import com.jb4dc.workflow.client.service.IWorkFlowModelRuntimeService;
import com.jb4dc.workflow.po.FlowModelListIntegratedPO;
import com.jb4dc.workflow.po.ModelFilterPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class WorkFlowModelRuntimeServiceImpl extends WorkFlowRuntimeServiceImpl implements IWorkFlowModelRuntimeService {

    @Autowired
    FlowModelIntegratedRuntimeRemote flowModelIntegratedRuntimeRemote;

    @Autowired
    MenuRuntimeRemote menuRuntimeRemote;

    @Override
    public JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModel(JB4DCSession jb4DCSession, String userId,String organId) throws JBuild4DCGenerallyException {
        String linkId=JBuild4DCYaml.getLinkId();
        return flowModelIntegratedRuntimeRemote.getMyBootableModel(userId,organId,linkId);
    }

    @Override
    public JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModel(JB4DCSession session, String menuId, String userId, String organId) throws JBuild4DCGenerallyException, IOException {
        MenuPO menuPO = menuRuntimeRemote.getMenuById(menuId).getData();
        String menuOuterObjectStr = menuPO.getMenuOuterObject();
        if (StringUtility.isEmpty(menuOuterObjectStr)) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, "未配置加载模型的分类和分组!");
        }
        ModelFilterPO modelFilterPO = JsonUtility.toObject(menuOuterObjectStr, ModelFilterPO.class);
        modelFilterPO.setOrganId(organId);
        modelFilterPO.setUserId(userId);
        String linkId=JBuild4DCYaml.getLinkId();
        modelFilterPO.setLinkId(linkId);
        JBuild4DCResponseVo<FlowModelListIntegratedPO> result=flowModelIntegratedRuntimeRemote.getMyBootableModelWithModelFilterPO(modelFilterPO);
        return result;
    }
}
