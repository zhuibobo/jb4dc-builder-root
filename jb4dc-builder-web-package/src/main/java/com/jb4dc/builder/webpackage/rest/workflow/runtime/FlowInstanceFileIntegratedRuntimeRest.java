package com.jb4dc.builder.webpackage.rest.workflow.runtime;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.session.SSOSessionUtility;
import com.jb4dc.workflow.dbentities.InstanceFileEntity;
import com.jb4dc.workflow.integrate.extend.IInstanceFileExtendService;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Workflow/RunTime/FlowInstanceFileIntegratedRuntime")
public class FlowInstanceFileIntegratedRuntimeRest {

    @Autowired
    IInstanceFileExtendService instanceFileExtendService;

    @RequestMapping(
            value = {"/AddInstanceFile"},
            method = {RequestMethod.POST}
    )
    public JBuild4DCResponseVo<String> addInstanceFile(@RequestBody InstanceFileEntity instanceFileEntity) throws IOException, ParseException, JBuild4DCGenerallyException, JAXBException, XMLStreamException {
        JB4DCSession jb4DCSession = SSOSessionUtility.buildJB4DCSessionFromRemote(instanceFileEntity.getFileCreatorId(), instanceFileEntity.getFileOrganId());
        instanceFileExtendService.saveSimple(jb4DCSession,instanceFileEntity.getFileId(),instanceFileEntity);
        return JBuild4DCResponseVo.opSuccess();
    }

    @RequestMapping(
            value = {"/GetAttachmentFileListData"},
            method = {RequestMethod.GET}
    )
    public JBuild4DCResponseVo<List<InstanceFileEntity>> getAttachmentFileListData(String userId, String organId, String instanceId) throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession = SSOSessionUtility.buildJB4DCSessionFromRemote(userId, organId);
        List<InstanceFileEntity> instanceFileEntityList=instanceFileExtendService.getAttachmentFileListData(jb4DCSession,instanceId);
        return JBuild4DCResponseVo.getDataSuccess(instanceFileEntityList);
    }
}
