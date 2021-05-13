package com.jb4dc.workflow.integrate.extend;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import com.jb4dc.workflow.po.bpmn.process.BpmnUserTask;

import java.util.List;
import java.util.Map;

public interface IReceiverRuntimeResolve {
    List<BpmnTask> resolveToActualUser(JB4DCSession jb4DCSession, String instanceId, BpmnDefinitions bpmnDefinitions, List<BpmnTask> bpmnTaskList, Map<String, Object> vars) throws JBuild4DCGenerallyException;
}
