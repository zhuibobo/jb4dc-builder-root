package com.jb4dc.workflow.integrate.engine.impl;

import com.jb4dc.builder.dao.flow.FlowIntegratedMapper;
import com.jb4dc.builder.dbentities.flow.FlowIntegratedEntity;
import com.jb4dc.workflow.integrate.engine.IFlowEngineExecutionIntegratedService;
import com.jb4dc.workflow.integrate.engine.IFlowEngineInstanceIntegratedService;
import com.jb4dc.workflow.utility.CamundaBpmnUtility;
import com.jb4dc.workflow.utility.VariableUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.history.HistoricProcessInstance;
import org.camunda.bpm.engine.history.HistoricTaskInstance;
import org.camunda.bpm.engine.runtime.*;
import org.camunda.bpm.model.bpmn.instance.StartEvent;
import org.camunda.bpm.model.bpmn.instance.UserTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FlowEngineInstanceIntegratedServiceImpl extends FlowEngineCamundaIntegrateAbstractService implements IFlowEngineInstanceIntegratedService {



    @Autowired
    IFlowEngineExecutionIntegratedService IFlowEngineExecutionIntegratedService;

    public FlowEngineInstanceIntegratedServiceImpl() {
        //super(_defaultBaseMapper);
    }

    @Override
    public List<ProcessInstance> getActiveProcessInstanceBusinessKey(JB4DCSession jb4DCSession, String processInstanceBusinessKey){
        ProcessEngine processEngine = CamundaIntegrate.getProcessEngine();
        List<ProcessInstance> processInstance=processEngine.getRuntimeService().createProcessInstanceQuery().active().processInstanceBusinessKey(processInstanceBusinessKey).list();
        return processInstance;
    }

    /*@Override
    public void addMultiInstanceExecution(String processInstanceId,String assigneeUserId, Map<String, Object> variables){

    }*/

    @Override
    public boolean instanceIsComplete(JB4DCSession jb4DCSession, String processInstanceId) throws JBuild4DCGenerallyException {
        ProcessInstance processInstance=getRuntimeService().createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
        if(processInstance!=null){
            return false;
        }
        HistoricProcessInstance historicProcessInstance=getHistoryService().createHistoricProcessInstanceQuery().completed().processInstanceId(processInstanceId).singleResult();
        if(historicProcessInstance!=null){
            if(historicProcessInstance.getEndTime()!=null){
                return true;
            }
            else{
                return false;
            }
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, "该流程实例Id不存在!");
    }

    private boolean isRecallProcessEnable(JB4DCSession jb4DCSession, String processInstanceId, String taskId, String formActivityNodeId){
        return true;
    }

    @Override
    public void recallProcessForUserTask(JB4DCSession jb4DCSession, String processInstanceId, String taskId, String formActivityNodeId, String assigneeUserId, Map<String, Object> variables) throws JBuild4DCGenerallyException {
        if(isRecallProcessEnable(jb4DCSession,processInstanceId,taskId,formActivityNodeId)){

            //ProcessEngine processEngine = CamundaIntegrate.getProcessEngine();
            //RuntimeService runtimeService=processEngine.getRuntimeService();
            HistoricTaskInstance historicTaskInstance = getHistoryService().createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
            String sendOperationActivityNodeId=historicTaskInstance.getTaskDefinitionKey();

            //当前操作人需要撤回的所在环节如果是多实例环节
            if (CamundaBpmnUtility.isMultiInstance(CamundaBpmnUtility.getUserTaskNode(historicTaskInstance.getProcessDefinitionId(),sendOperationActivityNodeId))){
                List<String> currentActivityNodeIds= IFlowEngineExecutionIntegratedService.getCurrentActivityNodeIds(jb4DCSession,processInstanceId);

                if(currentActivityNodeIds.contains(sendOperationActivityNodeId)){
                    //当前环节未完成
                    UserTask userTaskNode= CamundaBpmnUtility.getUserTaskNode(historicTaskInstance.getProcessDefinitionId(),sendOperationActivityNodeId);
                    String assVariableName=userTaskNode.getCamundaAssignee();
                    assVariableName= VariableUtility.getSingleVariableName(assVariableName);
                    ProcessInstanceModificationBuilder modificationBuilder =getRuntimeService().createProcessInstanceModification(processInstanceId);

                    ProcessInstanceModificationInstantiationBuilder processInstanceModificationInstantiationBuilder=modificationBuilder.startBeforeActivity(sendOperationActivityNodeId);
                    processInstanceModificationInstantiationBuilder.setVariable(assVariableName,assigneeUserId);

                    if(variables!=null){
                        processInstanceModificationInstantiationBuilder.setVariables(variables);
                    }

                    processInstanceModificationInstantiationBuilder.execute();
                }
                else{
                    //当前环节已经完成
                    jumpToUserTaskActivityNode(jb4DCSession,processInstanceId,sendOperationActivityNodeId,currentActivityNodeIds,assigneeUserId,variables);
                }

            }
            else{
                List<String> currentActivityNodeIds= IFlowEngineExecutionIntegratedService.getCurrentActivityNodeIds(jb4DCSession,processInstanceId);
                jumpToUserTaskActivityNode(jb4DCSession,processInstanceId,sendOperationActivityNodeId,currentActivityNodeIds,assigneeUserId,variables);
            }
        }
        else {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, "当前流程不允许撤回!");
        }
        /*ProcessEngine processEngine = CamundaIntegrate.getProcessEngine();
        RuntimeService runtimeService=processEngine.getRuntimeService();
        TaskService taskService=processEngine.getTaskService();
        HistoricTaskInstance historicTaskInstance = processEngine.getHistoryService().createHistoricTaskInstanceQuery().taskId(taskId).singleResult();

        List<Execution> executionList = processEngine.getRuntimeService().createExecutionQuery().active().processInstanceId(processInstanceId).list();
        List<String> acids=processEngine.getRuntimeService().getActiveActivityIds(executionList.get(0).getId());

        runtimeService.createModification(historicTaskInstance.getProcessDefinitionId()).processInstanceIds(processInstanceId).cancelAllForActivity(acids.get(0),true).startBeforeActivity(formActivityNodeId).execute();*/
    }

    @Override
    public void jumpToUserTaskActivityNode(JB4DCSession jb4DCSession, String processInstanceId, String jumpToActivityNodeId, List<String> cancelActivityNodeIds, String assigneeUserId, Map<String, Object> variables) throws JBuild4DCGenerallyException {
        List<String> assigneeUserIds=new ArrayList<>();
        assigneeUserIds.add(assigneeUserId);
        jumpToUserTaskActivityNode(jb4DCSession,processInstanceId,jumpToActivityNodeId,cancelActivityNodeIds,assigneeUserIds,variables);
    }

    @Override
    public void jumpToUserTaskActivityNode(JB4DCSession jb4DCSession, String processInstanceId, String jumpToActivityNodeId, List<String> cancelActivityNodeIds, List<String> assigneeUserIds, Map<String,Object> variables) throws JBuild4DCGenerallyException {
        RuntimeService runtimeService=getRuntimeService();
        ProcessInstance processInstance=getRuntimeService().createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();

        UserTask userTask= CamundaBpmnUtility.getUserTaskNode(processInstance.getProcessDefinitionId(),jumpToActivityNodeId);
        String ass=userTask.getCamundaAssignee();
        if(StringUtility.isEmpty(ass)){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"流程模型中的环节未设置接收人!");
        }
        //ass=ass.replace("#{","").replace("${","").replace("}","");
        ass= VariableUtility.getSingleVariableName(ass);
        if(CamundaBpmnUtility.isMultiInstance(userTask)){
            //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"不能跳转到多实例环节!");
            if (assigneeUserIds.size()==0){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"多实例环节至少设置一个接收人!");
            }
            //要跳转的环节不能包含在将要删除的环节中
            if(cancelActivityNodeIds.contains(jumpToActivityNodeId)){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"要跳转的环节不能包含在将要删除的环节中!");
            }
            //创建新的执行实例
            for (int i = 0; i < assigneeUserIds.size(); i++) {
                String assigneeUserId = assigneeUserIds.get(i);
                Map<String, Object> innVariables = new HashMap<>();
                if (variables == null) {
                    innVariables.put(ass, assigneeUserIds.get(0));
                }
                ProcessInstanceModificationInstantiationBuilder processInstanceModificationInstantiationBuilder = runtimeService.createProcessInstanceModification(processInstanceId).startBeforeActivity(jumpToActivityNodeId);
                processInstanceModificationInstantiationBuilder.setVariables(innVariables);
                if (variables != null&&i==(assigneeUserIds.size()-1)) {
                    processInstanceModificationInstantiationBuilder.setVariables(variables);
                }
                processInstanceModificationInstantiationBuilder.execute();
            }
            //删除现有执行实例
            ProcessInstanceModificationBuilder modificationBuilder =runtimeService.createProcessInstanceModification(processInstanceId);
            for (String cancelActivityNodeId : cancelActivityNodeIds) {
                modificationBuilder.cancelAllForActivity(cancelActivityNodeId);
            }
            modificationBuilder.execute();
        }
        else{
            if (assigneeUserIds.size()!=1){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"单实例环节只能设置一个接收人!");
            }
            Map<String,Object> innVariables=new HashMap<>();
            if(variables==null){
                innVariables.put(ass,assigneeUserIds.get(0));
            }
            //ModificationBuilder modificationBuilder = runtimeService.createModification(processInstance.getProcessDefinitionId()).startBeforeActivity(jumpToActivityNodeId).processInstanceIds(processInstanceId);
            ProcessInstanceModificationBuilder modificationBuilder =runtimeService.createProcessInstanceModification(processInstanceId);

            for (String cancelActivityNodeId : cancelActivityNodeIds) {
                modificationBuilder.cancelAllForActivity(cancelActivityNodeId);
                //modificationBuilder.cancelAllForActivity(cancelActivityNodeId,true);
            }

            ProcessInstanceModificationInstantiationBuilder processInstanceModificationInstantiationBuilder=modificationBuilder.startBeforeActivity(jumpToActivityNodeId);
            processInstanceModificationInstantiationBuilder.setVariables(innVariables);

            if(variables!=null){
                processInstanceModificationInstantiationBuilder.setVariables(variables);
            }

            processInstanceModificationInstantiationBuilder.execute();
        }
        //runtimeService.createModification(processInstance.getProcessDefinitionId()).processInstanceIds(processInstanceId).ccancelAllForActivity(acids.get(0),true).startBeforeActivity(formActivityNodeId).execute();
    }

    @Override
    public void restartProcessAndJumpToActivityNode(JB4DCSession jb4DCSession, String processInstanceId, String jumpToActivityNodeId, String assigneeUserId, Map<String, Object> variables) throws JBuild4DCGenerallyException {
        RuntimeService runtimeService=getRuntimeService();
        //getHistoryService().createHistoricActivityInstanceQuery().activityInstanceId();
        HistoricProcessInstance historicProcessInstance=getHistoryService().createHistoricProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();

        StartEvent startEvent=CamundaBpmnUtility.getSingleStartEventNode(historicProcessInstance.getProcessDefinitionId());
        RestartProcessInstanceBuilder restartProcessInstanceBuilder=runtimeService.restartProcessInstances(historicProcessInstance.getProcessDefinitionId()).startBeforeActivity(startEvent.getId());
        restartProcessInstanceBuilder.processInstanceIds(processInstanceId).execute();

        //不能跳转到多实例环节
        ProcessInstance newProcessInstance=getRuntimeService().createProcessInstanceQuery().processInstanceBusinessKey(historicProcessInstance.getBusinessKey()).singleResult();

        if(CamundaBpmnUtility.isMultiInstance(CamundaBpmnUtility.getFlowNodeById(newProcessInstance.getProcessDefinitionId(),jumpToActivityNodeId))){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, "跳转节点不能设置为多实例节点!");
        }
        List<String> currentActivityNodeIds= IFlowEngineExecutionIntegratedService.getCurrentActivityNodeIds(jb4DCSession,newProcessInstance.getProcessInstanceId());
        jumpToUserTaskActivityNode(jb4DCSession,newProcessInstance.getProcessInstanceId(),jumpToActivityNodeId,currentActivityNodeIds,assigneeUserId,variables);
        //.execute();
    }

    @Override
    public void deleteAllInstance(JB4DCSession jb4DCSession, String deleteReason){
        ProcessInstanceQuery processInstanceQuery =getRuntimeService().createProcessInstanceQuery();
        RuntimeService runtimeService=getRuntimeService();
        for (ProcessInstance processInstance : processInstanceQuery.list()) {
            runtimeService.deleteProcessInstance(processInstance.getId(),deleteReason);
        }
        //return processInstanceQuery;
    }
}
