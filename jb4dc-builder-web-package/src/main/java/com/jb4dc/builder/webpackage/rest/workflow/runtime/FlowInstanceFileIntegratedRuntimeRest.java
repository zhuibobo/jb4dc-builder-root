package com.jb4dc.builder.webpackage.rest.workflow.runtime;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.client.remote.FlowInstanceFileIntegratedRuntimeRemote;
import com.jb4dc.workflow.dbentities.InstanceFileEntity;
import com.jb4dc.workflow.integrate.extend.IInstanceFileExtendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Workflow/RunTime/FlowInstanceFileIntegratedRuntime")
public class FlowInstanceFileIntegratedRuntimeRest implements FlowInstanceFileIntegratedRuntimeRemote {

    @Autowired
    IInstanceFileExtendService instanceFileExtendService;

    @Override
    public JBuild4DCResponseVo<String> addInstanceFile(@RequestBody InstanceFileEntity instanceFileEntity) throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
        instanceFileExtendService.saveSimple(jb4DCSession,instanceFileEntity.getFileId(),instanceFileEntity);
        return JBuild4DCResponseVo.opSuccess();
    }

    @Override
    public JBuild4DCResponseVo<InstanceFileEntity> getInstanceFileById(String instanceFileId) throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
        InstanceFileEntity instanceFileEntity = instanceFileExtendService.getByPrimaryKey(jb4DCSession,instanceFileId);
        return JBuild4DCResponseVo.getDataSuccess(instanceFileEntity);
    }

    @Override
    public JBuild4DCResponseVo<List<InstanceFileEntity>> getAttachmentFileListData(String userId, String organId, String instanceId) throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
        List<InstanceFileEntity> instanceFileEntityList=instanceFileExtendService.getAttachmentFileListData(jb4DCSession,instanceId);
        return JBuild4DCResponseVo.getDataSuccess(instanceFileEntityList);
    }

    @Override
    public JBuild4DCResponseVo<InstanceFileEntity> tryGetLastOnlineDocument(String instanceId) {
        JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
        InstanceFileEntity instanceFileEntity = instanceFileExtendService.tryGetLastOnlineDocument(jb4DCSession,instanceId);
        return JBuild4DCResponseVo.getDataSuccess(instanceFileEntity);
    }
}
