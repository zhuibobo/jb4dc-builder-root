package com.jb4dc.workflow.integrate.extend;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dbentities.ModelGroupEntity;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;

public interface IModelGroupExtendService extends IBaseService<ModelGroupEntity> {

    void initSystemData(JB4DCSession JB4DCSession) throws JBuild4DCGenerallyException;
}
