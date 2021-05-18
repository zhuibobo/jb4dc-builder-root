package com.jb4dc.workflow.integrate.engine.utility;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.workflow.integrate.engine.impl.CamundaIntegrate;
import com.jb4dc.workflow.integrate.engine.impl.FlowEngineTaskIntegratedServiceImpl;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.impl.javax.el.ExpressionFactory;
import org.camunda.bpm.engine.impl.javax.el.PropertyNotFoundException;
import org.camunda.bpm.engine.impl.javax.el.ValueExpression;
import org.camunda.bpm.engine.impl.juel.ExpressionFactoryImpl;
import org.camunda.bpm.engine.impl.juel.SimpleContext;
import org.camunda.bpm.engine.impl.juel.SimpleResolver;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.*;
import org.camunda.bpm.model.xml.instance.ModelElementInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public class CamundaBpmnUtility {

    private static Logger logger= LoggerFactory.getLogger(FlowEngineTaskIntegratedServiceImpl.class);

    public static StartEvent getSingleStartEventNode(String processDefinitionId) throws JBuild4DCGenerallyException {
        ProcessEngine processEngine= CamundaIntegrate.getProcessEngine();
        BpmnModelInstance modelInstance = processEngine.getRepositoryService().getBpmnModelInstance(processDefinitionId);
        Collection<StartEvent> startEventNodes=modelInstance.getModelElementsByType(StartEvent.class);
        if(startEventNodes.size()==1){
            return startEventNodes.iterator().next();
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, "StartEvent为0或>1!");
    }

    public static FlowNode getFlowNode(org.camunda.bpm.engine.task.Task task) {
        ProcessEngine processEngine= CamundaIntegrate.getProcessEngine();
        RepositoryService repositoryService=processEngine.getRepositoryService();
        BpmnModelInstance modelInstance = repositoryService.getBpmnModelInstance(task.getProcessDefinitionId());
        ModelElementInstance instance = modelInstance.getModelElementById(task.getTaskDefinitionKey());
        FlowNode flowNode = (FlowNode)instance;
        return flowNode;
    }

    public static FlowNode getFlowNodeById(String processDefinitionId,String nodeId) {
        ProcessEngine processEngine= CamundaIntegrate.getProcessEngine();
        RepositoryService repositoryService=processEngine.getRepositoryService();
        BpmnModelInstance modelInstance = repositoryService.getBpmnModelInstance(processDefinitionId);
        ModelElementInstance instance = modelInstance.getModelElementById(nodeId);
        FlowNode flowNode = (FlowNode)instance;
        return flowNode;
    }

    public static List<SequenceFlow> getOutgoingSequenceFlow(String processDefinitionId, String taskDefinitionKey) {
        ProcessEngine processEngine= CamundaIntegrate.getProcessEngine();
        RepositoryService repositoryService=processEngine.getRepositoryService();
        BpmnModelInstance modelInstance = repositoryService.getBpmnModelInstance(processDefinitionId);
        ModelElementInstance instance = modelInstance.getModelElementById(taskDefinitionKey);
        FlowNode flowNode = (FlowNode)instance;
        ArrayList<SequenceFlow> newList = new ArrayList<>(flowNode.getOutgoing());
        return newList;
    }

    public static List<org.camunda.bpm.model.bpmn.instance.Activity> getNextPossibleFlowNodeWithStartNode(String processDefinitionKey, Map<String, Object> vars){
        ProcessEngine processEngine= CamundaIntegrate.getProcessEngine();
        RepositoryService repositoryService=processEngine.getRepositoryService();
        ProcessDefinition processDefinition=repositoryService.createProcessDefinitionQuery().processDefinitionKey(processDefinitionKey).latestVersion().singleResult();
        BpmnModelInstance modelInstance = repositoryService.getBpmnModelInstance(processDefinition.getId());
        Collection<StartEvent> startEvents=modelInstance.getModelElementsByType(StartEvent.class);
        //List<org.camunda.bpm.model.bpmn.instance.Task> nextPossibleFlowNode=getOutgoingTask(startEvents.iterator().next(),vars);
        List<org.camunda.bpm.model.bpmn.instance.Activity> nextPossibleFlowNodes= getNextPossibleFlowNode(startEvents.iterator().next(),vars);
        return nextPossibleFlowNodes;
    }

    public static List<org.camunda.bpm.model.bpmn.instance.Activity> getNextPossibleFlowNode(String taskId, Map<String, Object> vars) {
        ProcessEngine processEngine = CamundaIntegrate.getProcessEngine();
        Task task = processEngine.getTaskService().createTaskQuery().taskId(taskId).singleResult();
        return getNextPossibleFlowNode(task,vars);
    }

    public static List<org.camunda.bpm.model.bpmn.instance.Activity> getNextPossibleFlowNode(Task task, Map<String, Object> vars) {
        ProcessEngine processEngine = CamundaIntegrate.getProcessEngine();
        //List<org.camunda.bpm.model.bpmn.instance.Task> allPossibleTasks = new ArrayList<>();
        List<SequenceFlow> outgoingSequenceFlow = getOutgoingSequenceFlow(task.getProcessDefinitionId(), task.getTaskDefinitionKey());
        RepositoryService repositoryService = processEngine.getRepositoryService();
        BpmnModelInstance modelInstance = repositoryService.getBpmnModelInstance(task.getProcessDefinitionId());
        FlowNode thisFlowNode = modelInstance.getModelElementById(task.getTaskDefinitionKey());
        /*for (SequenceFlow sequenceFlow : outgoingSequenceFlow) {
            if (CamundaBpmnUtility.isUserTaskFlowNode(sequenceFlow.getTarget())) {
                List<org.camunda.bpm.model.bpmn.instance.Task> possibleTasks = getOutgoingTask(thisFlowNode, vars);
                for (org.camunda.bpm.model.bpmn.instance.Task possibleTask : possibleTasks) {
                    if (!allPossibleTasks.stream().anyMatch(ut -> ut.getId().equals(possibleTask.getId()))) {
                        allPossibleTasks.add(possibleTask);
                    }
                }
            } else if (CamundaBpmnUtility.isExclusiveGatewayFlowNode(sequenceFlow.getTarget())) {
                List<org.camunda.bpm.model.bpmn.instance.Task> possibleTasks = getOutgoingTask(sequenceFlow.getTarget(), vars);
                allPossibleTasks.addAll(possibleTasks);
            }
        }
        String defaultSequenceFlowId = thisFlowNode.getDomElement().getAttribute("default");
        if (StringUtility.isNotEmpty(defaultSequenceFlowId)) {
            if (allPossibleTasks.size() > 1) {
                SequenceFlow defaultSequenceFlowNode = modelInstance.getModelElementById(defaultSequenceFlowId);
                for (org.camunda.bpm.model.bpmn.instance.Task possibleTask : allPossibleTasks) {
                    if (possibleTask.getId().equals(defaultSequenceFlowNode.getTarget().getId())) {
                        allPossibleTasks.remove(possibleTask);
                    }
                }
            }
        }*/
        //return allPossibleTasks;
        return getNextPossibleFlowNode(thisFlowNode,vars);
    }

    public static void _loopGetNextPossibleFlowNode(List<org.camunda.bpm.model.bpmn.instance.Activity> allPossibleTasks, FlowNode fromFlowNode, Map<String, Object> vars) {
        List<org.camunda.bpm.model.bpmn.instance.FlowNode> goToFlowNodeList = getOutgoingTask(fromFlowNode, vars);
        for (org.camunda.bpm.model.bpmn.instance.FlowNode goToFlowNode : goToFlowNodeList) {
            if (CamundaBpmnUtility.isUserTaskFlowNode(goToFlowNode)) {
                if (!allPossibleTasks.stream().anyMatch(ut -> ut.getId().equals(goToFlowNode.getId()))) {
                    allPossibleTasks.add((Activity)goToFlowNode);
                }
            }
            else if (CamundaBpmnUtility.isServiceFlowNode(goToFlowNode)) {
                if (!allPossibleTasks.stream().anyMatch(ut -> ut.getId().equals(goToFlowNode.getId()))) {
                    allPossibleTasks.add((Activity)goToFlowNode);
                }
            }
            else if (CamundaBpmnUtility.isEndEventFlowNode(goToFlowNode)) {
                if (!allPossibleTasks.stream().anyMatch(ut -> ut.getId().equals(goToFlowNode.getId()))) {
                    allPossibleTasks.add((Activity)goToFlowNode);
                }
            } else if (CamundaBpmnUtility.isExclusiveGatewayFlowNode(goToFlowNode) || CamundaBpmnUtility.isParallelGatewayFlowNode(goToFlowNode)) {
                //String a="1";
                _loopGetNextPossibleFlowNode(allPossibleTasks, goToFlowNode, vars);
            }
        }
    }

    public static List<org.camunda.bpm.model.bpmn.instance.Activity> getNextPossibleFlowNode(FlowNode thisFlowNode, Map<String, Object> vars){
        List<org.camunda.bpm.model.bpmn.instance.Activity> allPossibleFlowNode = new ArrayList<>();

        _loopGetNextPossibleFlowNode(allPossibleFlowNode,thisFlowNode,vars);

        return allPossibleFlowNode;

        //List<SequenceFlow> outgoingSequenceFlow = new ArrayList<>(thisFlowNode.getOutgoing());

        /*for (SequenceFlow sequenceFlow : outgoingSequenceFlow) {
            if (CamundaBpmnUtility.isUserTaskFlowNode(sequenceFlow.getTarget())) {
                List<org.camunda.bpm.model.bpmn.instance.Task> possibleTasks = getOutgoingTask(thisFlowNode, vars);
                for (org.camunda.bpm.model.bpmn.instance.Task possibleTask : possibleTasks) {
                    if (!allPossibleFlowNode.stream().anyMatch(ut -> ut.getId().equals(possibleTask.getId()))) {
                        allPossibleFlowNode.add(possibleTask);
                    }
                }
            } else if (CamundaBpmnUtility.isExclusiveGatewayFlowNode(sequenceFlow.getTarget())) {
                List<org.camunda.bpm.model.bpmn.instance.Task> possibleTasks = getOutgoingTask(sequenceFlow.getTarget(), vars);
                allPossibleFlowNode.addAll(possibleTasks);
            } else if(CamundaBpmnUtility.isParallelGatewayFlowNode(sequenceFlow.getTarget())){
                List<org.camunda.bpm.model.bpmn.instance.Task> possibleTasks = getOutgoingTask(thisFlowNode, vars);
                if(possibleTasks.size()>0){
                    List<org.camunda.bpm.model.bpmn.instance.Task> parallelGatewayGoToTasks = getOutgoingTask(sequenceFlow.getTarget(), vars);
                    allPossibleFlowNode.addAll(parallelGatewayGoToTasks);
                }
                //for (org.camunda.bpm.model.bpmn.instance.Task possibleTask : possibleTasks) {
                    //List<org.camunda.bpm.model.bpmn.instance.Task> possibleTasks = getOutgoingTask(sequenceFlow.getTarget(), vars);
                    //allPossibleFlowNode.addAll(possibleTasks);
                //}
            }
        }
        String defaultSequenceFlowId = thisFlowNode.getDomElement().getAttribute("default");
        if (StringUtility.isNotEmpty(defaultSequenceFlowId)) {
            if (allPossibleFlowNode.size() > 1) {
                SequenceFlow defaultSequenceFlowNode = thisFlowNode.getModelInstance().getModelElementById(defaultSequenceFlowId);
                for (org.camunda.bpm.model.bpmn.instance.Task possibleTask : allPossibleFlowNode) {
                    if (possibleTask.getId().equals(defaultSequenceFlowNode.getTarget().getId())) {
                        allPossibleFlowNode.remove(possibleTask);
                    }
                }
            }
        }*/
        //return allPossibleFlowNode;
    }

    private static List<org.camunda.bpm.model.bpmn.instance.FlowNode> getOutgoingTask(FlowNode node, Map<String, Object> vars) {
        List<org.camunda.bpm.model.bpmn.instance.FlowNode> possibleFlowNodes = new ArrayList<>();
        for(SequenceFlow sf: node.getOutgoing()) {
            if (sf.getName() != null) {
                logger.info("Entering flow node {}", sf.getName());
            }
            boolean next = true;
            if (sf.getConditionExpression() != null) {
                ExpressionFactory factory = new ExpressionFactoryImpl();
                SimpleContext context = new SimpleContext(new SimpleResolver());

                logger.info("Generating map vars {}", vars.toString());
                for (Map.Entry<String, Object> v : vars.entrySet()) {
                    if (v.getValue() instanceof Boolean) {
                        factory.createValueExpression(context, "${" + v.getKey() + "}", Boolean.class).setValue(context, v.getValue());
                    } else if (v.getValue() instanceof java.util.Date) {
                        factory.createValueExpression(context, "${" + v.getKey() + "}", java.util.Date.class).setValue(context, v.getValue());
                    } else {
                        factory.createValueExpression(context, "${" + v.getKey() + "}", String.class).setValue(context, v.getValue());
                    }
                }
                ValueExpression expr1 = factory.createValueExpression(context, sf.getConditionExpression().getTextContent(), boolean.class);

                try {
                    next = (Boolean) expr1.getValue(context);
                    logger.info("Evaluating expression {} to result {}", sf.getConditionExpression().getTextContent(), expr1.getValue(context));
                } catch (PropertyNotFoundException propertyNotFoundException) {
                    next = false;
                }
            }

            if (next && sf.getTarget() != null) {
                //if (sf.getTarget() instanceof UserTask || sf.getTarget() instanceof ServiceTask) {
                    logger.info("Found next user task {}", sf.getTarget().getName());
                    possibleFlowNodes.add(sf.getTarget());
                    //break;
                //}
                //possibleFlowNodes.addAll(getOutgoing(sf.getTarget(), vars));
            }

        }
        return possibleFlowNodes;
    }

    public static UserTask getUserTaskNode(String processDefinitionId,String flowNodeId) throws JBuild4DCGenerallyException {
        ProcessEngine processEngine=CamundaIntegrate.getProcessEngine();
        List<UserTask> allPossibleTasks=new ArrayList<>();
        RepositoryService repositoryService=processEngine.getRepositoryService();
        BpmnModelInstance modelInstance = repositoryService.getBpmnModelInstance(processDefinitionId);
        FlowNode thisTaskFlowNode = modelInstance.getModelElementById(flowNodeId);
        if(isUserTaskFlowNode(thisTaskFlowNode)){
            return (UserTask)thisTaskFlowNode;
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"该节点不是用户任务节点!");
    }

    public static Collection<MultiInstanceLoopCharacteristics> getMultiInstanceLoopCharacteristics(FlowNode flowNode){
        return flowNode.getChildElementsByType(MultiInstanceLoopCharacteristics.class);
    }

    public static boolean isMultiInstance(FlowNode flowNode){
        Collection<MultiInstanceLoopCharacteristics> miCharacteristics = getMultiInstanceLoopCharacteristics(flowNode);
        if (miCharacteristics.size()==0||miCharacteristics==null){
            return false;
        }
        return true;
    }

    public static boolean isSequential(FlowNode flowNode){
        Collection<MultiInstanceLoopCharacteristics> miCharacteristics = getMultiInstanceLoopCharacteristics(flowNode);
        if (miCharacteristics.size()==0||miCharacteristics==null){
            return false;
        }
        MultiInstanceLoopCharacteristics miCharacteristic = miCharacteristics.iterator().next();
        if(miCharacteristic.isSequential()){
            return true;
        }
        return false;
    }

    public static boolean isParallel(FlowNode flowNode){
        Collection<MultiInstanceLoopCharacteristics> miCharacteristics = getMultiInstanceLoopCharacteristics(flowNode);
        if (miCharacteristics.size()==0||miCharacteristics==null){
            return false;
        }
        MultiInstanceLoopCharacteristics miCharacteristic = miCharacteristics.iterator().next();
        if(miCharacteristic.isSequential()){
            return false;
        }
        return true;
    }

    public static boolean isServiceFlowNode(FlowNode node){
        if (node instanceof ServiceTask) {
            return true;
        }
        return false;
    }

    public static boolean isUserTaskFlowNode(FlowNode node){
        if (node instanceof UserTask) {
            return true;
        }
        return false;
    }

    public static boolean isExclusiveGatewayFlowNode(FlowNode node){
        if (node instanceof ExclusiveGateway) {
            return true;
        }
        return false;
    }

    public static boolean isStartEventFlowNode(FlowNode node){
        if (node instanceof StartEvent) {
            return true;
        }
        return false;
    }

    public static boolean isEndEventFlowNode(FlowNode node){
        if (node instanceof EndEvent) {
            return true;
        }
        return false;
    }

    public static boolean isParallelGatewayFlowNode(FlowNode node){
        if (node instanceof ParallelGateway) {
            return true;
        }
        return false;
    }
}
