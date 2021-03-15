package com.jb4dc.builder.workflow.utility;

import com.jb4dc.builder.workflow.integrate.impl.CamundaIntegrate;
import com.jb4dc.builder.workflow.integrate.impl.WFTaskIntegratedServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.tools.StringUtility;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.impl.javax.el.ExpressionFactory;
import org.camunda.bpm.engine.impl.javax.el.PropertyNotFoundException;
import org.camunda.bpm.engine.impl.javax.el.ValueExpression;
import org.camunda.bpm.engine.impl.juel.ExpressionFactoryImpl;
import org.camunda.bpm.engine.impl.juel.SimpleContext;
import org.camunda.bpm.engine.impl.juel.SimpleResolver;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.*;
import org.camunda.bpm.model.xml.instance.ModelElementInstance;
import org.camunda.bpm.model.xml.type.ModelElementType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public class CamundaBpmnUtility {

    private static Logger logger= LoggerFactory.getLogger(WFTaskIntegratedServiceImpl.class);

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

    public static List<UserTask> getNextPossibleUseTask(Task task, Map<String, Object> vars){
        ProcessEngine processEngine=CamundaIntegrate.getProcessEngine();
        List<UserTask> allPossibleTasks=new ArrayList<>();
        List<SequenceFlow> outgoingSequenceFlow = getOutgoingSequenceFlow(task.getProcessDefinitionId(),task.getTaskDefinitionKey());
        RepositoryService repositoryService=processEngine.getRepositoryService();
        BpmnModelInstance modelInstance = repositoryService.getBpmnModelInstance(task.getProcessDefinitionId());
        FlowNode thisTaskFlowNode = modelInstance.getModelElementById(task.getTaskDefinitionKey());
        for (SequenceFlow sequenceFlow : outgoingSequenceFlow) {
            if(CamundaBpmnUtility.isUserTaskFlowNode(sequenceFlow.getTarget())){
                List<UserTask> possibleTasks=getOutgoingTask(thisTaskFlowNode,vars);
                for (UserTask possibleTask : possibleTasks) {
                    if(!allPossibleTasks.stream().anyMatch(ut->ut.getId().equals(possibleTask.getId()))){
                        allPossibleTasks.add(possibleTask);
                    }
                }
            }
            else if(CamundaBpmnUtility.isExclusiveGatewayFlowNode(sequenceFlow.getTarget())){
                List<UserTask> possibleTasks=getOutgoingTask(sequenceFlow.getTarget(),vars);
                allPossibleTasks.addAll(possibleTasks);
            }
        }
        String defaultSequenceFlowId=thisTaskFlowNode.getDomElement().getAttribute("default");
        if(StringUtility.isNotEmpty(defaultSequenceFlowId)){
            if(allPossibleTasks.size()>1){
                SequenceFlow defaultSequenceFlowNode = modelInstance.getModelElementById(defaultSequenceFlowId);
                for (UserTask possibleTask : allPossibleTasks) {
                    if(possibleTask.getId().equals(defaultSequenceFlowNode.getTarget().getId())){
                        allPossibleTasks.remove(possibleTask);
                    }
                }
                //allPossibleTasks.remove(allPossibleTasks.fi)
            }
        }
        //System.out.println(defaultSequenceFlow);
        return allPossibleTasks;
        //for(outgoingSequenceFlow)
    }

    private static List<UserTask> getOutgoingTask(FlowNode node, Map<String, Object> vars) {
        List<UserTask> possibleTasks = new ArrayList<>();
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
                if (sf.getTarget() instanceof UserTask) {
                    logger.info("Found next user task {}", sf.getTarget().getName());
                    possibleTasks.add((UserTask)sf.getTarget());
                    //break;
                }
                //possibleTasks.addAll(getOutgoing(sf.getTarget(), vars));
            }

        }
        return possibleTasks;
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
