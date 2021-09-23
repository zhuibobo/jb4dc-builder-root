package com.jb4dc.workflow.integrate.extend;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dbentities.InstanceFileEntity;

import java.util.List;

public interface IInstanceFileExtendService extends IBaseService<InstanceFileEntity> {
    List<InstanceFileEntity> getAttachmentFileListData(JB4DCSession jb4DCSession, String instanceId);

    InstanceFileEntity tryGetLastOnlineDocument(JB4DCSession jb4DCSession, String instanceId);

    List<InstanceFileEntity> getDocumentFileListData(JB4DCSession jb4DCSession, String instanceId);
}
