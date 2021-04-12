package com.jb4dc.workflow.integrate.engine;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.camunda.bpm.engine.runtime.ProcessInstance;

import java.util.List;
import java.util.Map;

public interface IFlowEngineInstanceIntegratedService {

    List<ProcessInstance> getActiveProcessInstanceBusinessKey(JB4DCSession jb4DCSession, String processInstanceBusinessKey);

    boolean instanceIsComplete(JB4DCSession jb4DCSession, String processInstanceId) throws JBuild4DCGenerallyException;

    void recallProcessForUserTask(JB4DCSession jb4DCSession, String processInstanceId, String taskId, String formActivityNodeId, String assigneeUserId, Map<String, Object> variables) throws JBuild4DCGenerallyException;

    void jumpToUserTaskActivityNode(JB4DCSession jb4DCSession, String processInstanceId, String jumpToActivityNodeId, List<String> cancelActivityNodeIds, String assigneeUserId, Map<String, Object> variables) throws JBuild4DCGenerallyException;

    void jumpToUserTaskActivityNode(JB4DCSession jb4DCSession, String processInstanceId, String jumpToActivityNodeId, List<String> cancelActivityNodeIds, List<String> assigneeUserIds, Map<String,Object> variables) throws JBuild4DCGenerallyException;

    void restartProcessAndJumpToActivityNode(JB4DCSession jb4DCSession, String processInstanceId, String jumpToActivityNodeId, String assigneeUserId, Map<String, Object> variables) throws JBuild4DCGenerallyException;

    void deleteAllInstance(JB4DCSession jb4DCSession, String deleteReason);
}
