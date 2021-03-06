package com.jb4dc.workflow.integrate.extend;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dbentities.ModelGroupRefEntity;

import java.util.List;

public interface IModelGroupRefExtendService extends IBaseService<ModelGroupRefEntity> {
    void deleteRefByModelKey(JB4DCSession jb4DSession, String id);

    List<ModelGroupRefEntity> getByModelKeyList(List<String> modelIdList);
}
