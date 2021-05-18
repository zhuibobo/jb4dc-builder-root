package com.jb4dc.workflow.integrate.extend;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dbentities.ModelAssObjectEntity;

import java.util.List;

public interface IModelAssObjectExtendService extends IBaseService<ModelAssObjectEntity> {
    void deleteRefByModelKey(JB4DCSession jb4DSession, String id);

    List<ModelAssObjectEntity> getManagerByModelReKey(JB4DCSession jb4DCSession, String modelReKey);
}

