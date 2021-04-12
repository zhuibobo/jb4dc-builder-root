package com.jb4dc.workflow.integrate.extend;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.Map;

public interface IFlowExtendTaskService {
     void complete(JB4DCSession jb4DCSession, String taskId, Map<String,Object> vars) throws JBuild4DCGenerallyException;
}
