package com.jb4dc.workflow.client.service;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.files.dbentities.FileInfoEntity;
import com.jb4dc.workflow.dbentities.InstanceFileEntity;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

public interface IWorkFlowInstanceFileRuntimeService extends IWorkFlowRuntimeService {

    InstanceFileEntity addInstanceFile(JB4DCSession session, String fileName, byte[] fileByte, String fileType, String instanceId, String businessKey) throws JBuild4DCGenerallyException, IOException, URISyntaxException;

    JBuild4DCResponseVo<List<InstanceFileEntity>> getAttachmentFileListData(JB4DCSession session, String instanceId);
}
