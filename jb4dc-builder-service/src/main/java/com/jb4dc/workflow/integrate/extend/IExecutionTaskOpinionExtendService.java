package com.jb4dc.workflow.integrate.extend;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dbentities.ExecutionTaskOpinionEntity;

public interface IExecutionTaskOpinionExtendService extends IBaseService<ExecutionTaskOpinionEntity> {
    int getTaskNextOpinionNum(JB4DCSession jb4DCSession, String extaskId);
}

