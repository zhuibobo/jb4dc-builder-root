package com.jb4dc.workflow.integrate.extend.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.service.po.SimplePO;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.base.tools.URLUtility;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.builder.po.formdata.FormRecordDataRelationPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.workflow.dao.InstanceMapper;
import com.jb4dc.workflow.dbentities.ExecutionTaskEntity;
import com.jb4dc.workflow.dbentities.ExecutionTaskOpinionEntity;
import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.exenum.ModelTenantIdEnum;
import com.jb4dc.workflow.exenum.WorkFlowEnum;
import com.jb4dc.workflow.integrate.engine.*;
import com.jb4dc.workflow.integrate.engine.utility.CamundaBpmnUtility;
import com.jb4dc.workflow.integrate.extend.*;
import com.jb4dc.workflow.po.*;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;
import com.jb4dc.workflow.po.bpmn.process.*;
import com.jb4dc.workflow.po.receive.ClientSelectedReceiver;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.model.bpmn.instance.FlowNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import springfox.documentation.spring.web.json.Json;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InstanceExtendServiceImpl extends BaseServiceImpl<InstanceEntity> implements IInstanceExtendService
{
    Logger logger= LoggerFactory.getLogger(this.getClass());

    @Autowired
    IFlowEngineModelIntegratedService flowEngineModelIntegratedService;

    @Autowired
    IFlowEngineInstanceIntegratedService flowEngineInstanceIntegratedService;

    @Autowired
    IFlowEngineTaskIntegratedService flowEngineTaskIntegratedService;

    @Autowired
    IFlowEngineHistoryIntegratedService flowEngineHistoryIntegratedService;

    @Autowired
    IFlowEngineExecutionIntegratedService flowEngineExecutionIntegratedService;

    @Autowired
    IModelIntegratedExtendService modelIntegratedExtendService;

    @Autowired
    IReceiverRuntimeResolve receiverRuntimeResolve;

    @Autowired
    IExecutionTaskExtendService executionTaskExtendService;

    @Autowired
    IExecutionTaskLogExtendService executionTaskLogExtendService;

    @Autowired
    IExecutionTaskOpinionExtendService executionTaskOpinionExtendService;

    @Autowired
    InstanceFileExtendServiceImpl instanceFileExtendService;

    InstanceMapper instanceMapper;
    public InstanceExtendServiceImpl(InstanceMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        instanceMapper=_defaultBaseMapper;
    }

    /*public static String Status_Name_Running="Running";
    public static String Status_Name_End="End";
    public static String Status_Name_Draft="Draft";
    public static String Status_Name_Suspended="Suspended";*/

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, InstanceEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<InstanceEntity>() {
            @Override
            public InstanceEntity run(JB4DCSession jb4DCSession,InstanceEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    private List<InstancePO> convertToPOAndLoadModelData(JB4DCSession jb4DCSession,List<InstanceEntity> instanceEntityList) throws IOException {
        List<String> modelIds = instanceEntityList.stream().map(item -> item.getInstModId()).collect(Collectors.toList());
        List<ModelIntegratedEntity> modelIntegratedEntityList = new ArrayList<>();
        if (modelIds.size() > 0) {
            modelIntegratedEntityList = modelIntegratedExtendService.getListByPrimaryKey(jb4DCSession, modelIds);
        }
        List<InstancePO> instancePOList = JsonUtility.parseEntityListToPOList(instanceEntityList, InstancePO.class);

        for (InstancePO instancePO : instancePOList) {
            instancePO.setModelIntegratedEntity(modelIntegratedEntityList.stream().filter(item -> item.getModelId().equals(instancePO.getInstModId())).findFirst().orElse(null));
        }

        return instancePOList;
    }

    @Override
    public PageInfo<InstancePO> getMyManageEnableInstance(JB4DCSession jb4DCSession, int pageNum, int pageSize) throws IOException {
        if(jb4DCSession.isFullAuthority()){
            PageHelper.startPage(pageNum, pageSize);
            List<InstanceEntity> listEntity = instanceMapper.selectAll();
            List<InstancePO> listPO=convertToPOAndLoadModelData(jb4DCSession,listEntity);

            List<ExecutionTaskEntity> activeTasks=executionTaskExtendService.getActiveTaskByInstanceIds(jb4DCSession,listEntity);

            for (InstancePO instancePO : listPO) {
                List<ExecutionTaskEntity> thisInstanceActiveTasks=activeTasks.stream().filter(item->item.getExtaskInstId().equals(instancePO.getInstId())).collect(Collectors.toList());
                instancePO.setActiveExecutionTaskEntityList(thisInstanceActiveTasks);
            }

            PageInfo<InstancePO> pageInfo = new PageInfo(listPO);
            return pageInfo;
            //List<InstanceEntity> instanceEntityList=instanceMapper.selectAll();
        }
        return new PageInfo<>();
    }

    @Override
    public ResolveNextPossibleFlowNodePO resolveNextPossibleFlowNode(JB4DCSession jb4DCSession, String modelReKey,String currentTaskId, String currentNodeKey, String actionCode, Map<String, Object> vars) throws IOException, JAXBException, XMLStreamException, JBuild4DCGenerallyException {

        //vars = appendFlowDefaultVar(vars, currentNodeKey, actionCode);
        ResolveNextPossibleFlowNodePO resolveNextPossibleFlowNodePO=new ResolveNextPossibleFlowNodePO();

        ProcessDefinition processDefinition;
        BpmnDefinitions bpmnDefinitions;
        ExecutionTaskEntity executionTaskEntity;
        InstanceEntity instanceEntity=null;
        if(StringUtility.isNotEmpty(currentTaskId)) {
            executionTaskEntity = executionTaskExtendService.getByPrimaryKey(jb4DCSession, currentTaskId);
            instanceEntity = this.getByPrimaryKey(jb4DCSession, executionTaskEntity.getExtaskInstId());
            processDefinition = flowEngineModelIntegratedService.getDeployedCamundaModel(jb4DCSession, instanceEntity.getInstRuProcDefId());
            bpmnDefinitions = modelIntegratedExtendService.getDeployedCamundaModelBpmnDefinitions(jb4DCSession, instanceEntity.getInstRuProcDefId());

            //resolveNextPossibleFlowNodePO.setCurrentTaskIsMultiInstance();
            //resolveNextPossibleFlowNodePO.setCurrentTaskIsParallel(false);

            FlowNode flowNode = CamundaBpmnUtility.getFlowNodeById(instanceEntity.getInstRuProcDefId(), currentNodeKey);
            resolveNextPossibleFlowNodePO.setCurrentTaskIsMultiInstance(flowEngineExecutionIntegratedService.isMultiInstance(jb4DCSession, executionTaskEntity.getExtaskRuExecutionId()));

            resolveNextPossibleFlowNodePO.setCurrentTaskIsSequential(CamundaBpmnUtility.isSequential(flowNode));
            resolveNextPossibleFlowNodePO.setCurrentTaskIsParallel(CamundaBpmnUtility.isParallel(flowNode));
            if (resolveNextPossibleFlowNodePO.isCurrentTaskIsMultiInstance()) {
                resolveNextPossibleFlowNodePO.setCurrentTaskMultiCountEngInstances(flowEngineExecutionIntegratedService.multiCountEngInstances(jb4DCSession, executionTaskEntity.getExtaskRuExecutionId()));
                resolveNextPossibleFlowNodePO.setCurrentTaskMultiCompletedInstances(flowEngineExecutionIntegratedService.multiCompletedInstances(jb4DCSession, executionTaskEntity.getExtaskRuExecutionId()));
                resolveNextPossibleFlowNodePO.setCurrentTaskMultiActiveInstances(flowEngineExecutionIntegratedService.multiActiveInstances(jb4DCSession, executionTaskEntity.getExtaskRuExecutionId()));
                if (resolveNextPossibleFlowNodePO.getCurrentTaskMultiCountEngInstances() == (resolveNextPossibleFlowNodePO.getCurrentTaskMultiCompletedInstances() + 1)) {
                    resolveNextPossibleFlowNodePO.setCurrentTaskActionIsLast(true);
                } else {
                    resolveNextPossibleFlowNodePO.setCurrentTaskActionIsLast(false);
                }
            }

        }
        else{
            processDefinition=flowEngineModelIntegratedService.getDeployedCamundaModelLastVersion(jb4DCSession,modelReKey,ModelTenantIdEnum.builderGeneralTenant);
            bpmnDefinitions = modelIntegratedExtendService.getLastDeployedCamundaModelBpmnDefinitions(jb4DCSession, modelReKey);
        }

        List<FlowNode> nextPossibleFlowNodeList = CamundaBpmnUtility.getNextPossibleFlowNodeWithActionVars(processDefinition, currentNodeKey, vars);

        if(nextPossibleFlowNodeList!=null&&nextPossibleFlowNodeList.size()==1&&CamundaBpmnUtility.isEndEventFlowNode(nextPossibleFlowNodeList.get(0))){
            resolveNextPossibleFlowNodePO.setBpmnTaskList(new ArrayList<>());
            resolveNextPossibleFlowNodePO.setNextTaskIsEndEvent(true);
        }
        else if (nextPossibleFlowNodeList != null && nextPossibleFlowNodeList.size() > 0) {
            List<String> bpmnTaskFlowNodeIdList = nextPossibleFlowNodeList.stream().map(item -> item.getId()).collect(Collectors.toList());
            //BpmnDefinitions bpmnDefinitions = modelIntegratedExtendService.getDeployedCamundaModelBpmnDefinitionsLastVersion(jb4DCSession, modelReKey);
            List<BpmnTask> bpmnTaskFlowNodeList = modelIntegratedExtendService.getDeployedCamundaModelBpmnFlowNodeByIdList(jb4DCSession, modelReKey, bpmnDefinitions, bpmnTaskFlowNodeIdList);

            Jb4dcAction jb4dcAction = BpmnDefinitions.findAction(bpmnDefinitions, currentNodeKey, actionCode);

            bpmnTaskFlowNodeList = receiverRuntimeResolve.resolveToActualUser(jb4DCSession, instanceEntity!=null?instanceEntity.getInstId():"",currentTaskId,currentNodeKey,actionCode, bpmnDefinitions, bpmnTaskFlowNodeList, vars, jb4dcAction);

            //return bpmnTaskFlowNodeList;
            resolveNextPossibleFlowNodePO.setBpmnTaskList(bpmnTaskFlowNodeList);
        }

        return resolveNextPossibleFlowNodePO;
    }

    @Override
    @Transactional(rollbackFor = {JBuild4DCGenerallyException.class})
    public TaskActionResult completeTask(JB4DCSession jb4DCSession, boolean isStartInstanceStatus, String instanceId,
                                         String modelId, String modelReKey, String currentTaskId,
                                         String currentNodeKey, String currentNodeName, String actionCode,
                                         Map<String, Object> vars, List<ClientSelectedReceiver> clientSelectedReceiverList, String businessKey,
                                         String instanceTitle, String instanceDesc, String businessRelationJson, String businessDataJson, String businessRelationType,List<ExecutionTaskOpinionEntity> newOpinionEntityList) throws JBuild4DCGenerallyException {

        TaskActionResult completeTaskResult = new TaskActionResult();
        try {
            TaskActionResult completeTaskEnable = this.completeTaskEnable(jb4DCSession, isStartInstanceStatus, modelId, modelReKey, currentTaskId,
                    currentNodeKey, currentNodeName, actionCode,
                    vars, clientSelectedReceiverList, businessKey,
                    instanceTitle, instanceDesc);

            if (completeTaskEnable.isSuccess()) {

                FlowModelIntegratedPO flowModelIntegratedPO = modelIntegratedExtendService.getPOByIntegratedId(jb4DCSession, modelId);

                BpmnDefinitions bpmnDefinitions = null;
                ExecutionTaskEntity currentExecutionTaskEntity = null;

                BpmnStartEvent bpmnStartEvent = null;

                if (isStartInstanceStatus) {
                    bpmnDefinitions = modelIntegratedExtendService.getLastDeployedCamundaModelBpmnDefinitions(jb4DCSession, flowModelIntegratedPO.getModelReKey());
                    bpmnStartEvent = bpmnDefinitions.getBpmnProcess().getStartEvent();
                } else {
                    currentExecutionTaskEntity = executionTaskExtendService.getByPrimaryKey(jb4DCSession, currentTaskId);
                    bpmnDefinitions = modelIntegratedExtendService.getDeployedCamundaModelBpmnDefinitions(jb4DCSession, currentExecutionTaskEntity.getExtaskRuProcDefId());
                }

                Jb4dcAction jb4dcAction = BpmnDefinitions.findAction(bpmnDefinitions, currentNodeKey, actionCode);

                //region 处理主送人员
                Map<String, List<ClientSelectedReceiver>> clientSelectedMainReceiverGroupBy = clientSelectedReceiverList.stream().filter(item -> item.getReceiveType().equals(ClientSelectedReceiver.ReceiveType_Main))
                        .collect(Collectors.groupingBy(item -> item.getNextNodeId()));
                for (Map.Entry<String, List<ClientSelectedReceiver>> stringListEntry : clientSelectedMainReceiverGroupBy.entrySet()) {
                    BpmnUserTask bpmnUserTask = bpmnDefinitions.getBpmnProcess().getUserTaskList().stream().filter(item -> item.getId().equals(stringListEntry.getKey())).findFirst().get();
                    if (bpmnUserTask.isMultiInstanceTask()) {
                        String assigneeVarKey = bpmnUserTask.getMultiInstanceLoopCharacteristics().getCollection().replace("${", "").replace("}", "");
                        List<String> assigneeList = stringListEntry.getValue().stream().map(item -> item.getReceiverId()).collect(Collectors.toList());
                        vars.put(assigneeVarKey, assigneeList);
                    } else {
                        String assigneeVarKey = bpmnUserTask.getAssignee().replace("${", "").replace("}", "");
                        String assignee = stringListEntry.getValue().get(0).getReceiverId();
                        vars.put(assigneeVarKey, assignee);
                    }
                }
                //endregion

                //region处理抄送人员
                Map<String, List<ClientSelectedReceiver>> clientSelectedCCReceiverGroupBy = clientSelectedReceiverList.stream().filter(item -> item.getReceiveType().equals(ClientSelectedReceiver.ReceiveType_CC))
                        .collect(Collectors.groupingBy(item -> item.getNextNodeId()));
                //endregion

                InstanceEntity instanceEntity;
                BpmnUserTask bpmnStartUserTask = null;

                if (isStartInstanceStatus) {
                    //如果是启动流程时,重新设定当前节点,主要是修订起草环节作为启动事件替代的问题.
                    currentNodeKey = bpmnStartEvent.getId();
                    currentNodeName = bpmnStartEvent.getName();

                    //构建起始事件发送到起草节点的变量
                    bpmnStartUserTask = bpmnDefinitions.getBpmnProcess().getUserTaskList().stream().filter(item -> item.getId().equals(WorkFlowEnum.UserTask_Start_Node_Id)).findFirst().get();


                    String assignee_var_name = bpmnStartUserTask.getAssignee().replace("${", "").replace("}", "");
                    vars.put(assignee_var_name, jb4DCSession.getUserId());

                    ProcessInstance processInstance = flowEngineInstanceIntegratedService.startProcessInstanceByKey(flowModelIntegratedPO.getModelReKey(), businessKey, vars);
                    //记录扩展的实例数据
                    instanceEntity = createNewInstance(jb4DCSession, instanceId, businessKey, instanceTitle, instanceDesc, flowModelIntegratedPO, processInstance, businessRelationJson,businessDataJson, businessRelationType);
                    //生成一个初始任务,并设置为办结状态
                    currentExecutionTaskEntity = executionTaskExtendService.createStartEventExecutionTask(jb4DCSession, instanceEntity, currentNodeKey, currentNodeName, jb4dcAction);
                    //currentExecutionTaskEntity;
                } else {

                    //instanceEntity = getByPrimaryKey(jb4DCSession, currentExecutionTaskEntity.getExtaskInstId());
                    instanceEntity = updateInstanceBusinessData(jb4DCSession,currentExecutionTaskEntity.getExtaskInstId(), businessRelationJson,  businessDataJson,  businessRelationType);
                    //办结当前任务
                    flowEngineTaskIntegratedService.complete(currentExecutionTaskEntity.getExtaskRuTaskId(), vars);

                    currentExecutionTaskEntity.setExtaskStatus(WorkFlowEnum.ExTask_Status_End);
                    currentExecutionTaskEntity.setExtaskEndTime(new Date());
                    currentExecutionTaskEntity.setExtaskHandleEd(TrueFalseEnum.True.getDisplayName());
                    currentExecutionTaskEntity.setExtaskHandleActionKey(actionCode);
                    currentExecutionTaskEntity.setExtaskHandleActionName(jb4dcAction.getActionCaption());
                    currentExecutionTaskEntity.setExtaskHandlerId(jb4DCSession.getUserId());
                    currentExecutionTaskEntity.setExtaskHandlerName(jb4DCSession.getUserName());
                    currentExecutionTaskEntity.setExtaskHandlerType(WorkFlowEnum.ExTask_Handler_Type_Self);

                    executionTaskExtendService.updateByKeySelective(jb4DCSession, currentExecutionTaskEntity);

                    //保存办理意见
                    saveNewExTaskOpinion(jb4DCSession, newOpinionEntityList, currentExecutionTaskEntity);
                }

                //保存办理日志
                taskNewLog(jb4DCSession, isStartInstanceStatus, instanceId,
                        modelId, modelReKey, currentTaskId,
                        currentNodeKey, currentNodeName, actionCode,
                        vars, clientSelectedReceiverList, businessKey,
                        instanceTitle, instanceDesc, businessRelationJson, businessRelationType, newOpinionEntityList);

                //获取当前任务,并记录到扩展任务中
                List<Task> engineTaskList = flowEngineTaskIntegratedService.getTasks(instanceEntity.getInstRuProcInstId());
                for (int i = 0; i < engineTaskList.size(); i++) {
                    Task task = engineTaskList.get(i);
                    if (executionTaskExtendService.getByPrimaryKey(jb4DCSession, task.getId()) == null) {
                        String receiverName = "";
                        if (task.getAssignee().equals(jb4DCSession.getUserId())) {
                            receiverName = jb4DCSession.getUserName();
                        } else {
                            receiverName = clientSelectedReceiverList.stream().filter(item -> item.getNextNodeId().equals(task.getTaskDefinitionKey()) && item.getReceiverId().equals((task.getAssignee()))).findFirst().get().getReceiverName();
                        }
                        if (StringUtility.isEmpty(receiverName)) {
                            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, "无法确认用户ID对应的用户名!");
                        }

                        BpmnUserTask bpmnUserTask = bpmnDefinitions.getBpmnProcess().getUserTaskList().stream().filter(item -> item.getId().equals(task.getTaskDefinitionKey())).findFirst().get();
                        int extaskIndex = 0;
                        //executionTaskEntity.setExtaskMultiTask(bpmnUserTask.getMultiInstanceType());
                        if (bpmnUserTask.isMultiInstanceTask()) {
                            //1001001,1001002
                            //executionTaskEntity.setExtaskIndex(currentExecutionTaskEntity.getExtaskIndex() + 1000 + i);
                            extaskIndex = executionTaskExtendService.getNextExtaskIndexByInstanceId(jb4DCSession, instanceEntity.getInstId()) + i + 1;

                        } else {
                            //1002000,1003000
                            //executionTaskEntity.setExtaskIndex(currentExecutionTaskEntity.getExtaskIndex() + 1000);
                            extaskIndex = executionTaskExtendService.getNextExtaskIndexByInstanceId(jb4DCSession, instanceEntity.getInstId());
                        }

                        ExecutionTaskEntity executionTaskEntity = transformEngineTaskToExTask(jb4DCSession, jb4DCSession.getUserId(), jb4DCSession.getUserName(), new Date(), task, instanceEntity, currentNodeKey, currentNodeName, receiverName,
                                currentExecutionTaskEntity.getExtaskId(), currentExecutionTaskEntity.getExtaskRuExecutionId(), bpmnUserTask.getMultiInstanceType(), extaskIndex, WorkFlowEnum.ExTask_Create_By_Send, "");

                        executionTaskExtendService.saveSimple(jb4DCSession, executionTaskEntity.getExtaskId(), executionTaskEntity);
                    }
                }

                //获取流程引擎中的流程实例是否办结
                if (flowEngineInstanceIntegratedService.instanceIsComplete(jb4DCSession, instanceEntity.getInstRuProcInstId())) {
                    instanceEntity.setInstStatus(WorkFlowEnum.Instance_Status_Name_End);
                    instanceEntity.setInstEndTime(new Date());
                    this.updateByKeySelective(jb4DCSession, instanceEntity);
                }

                //办结起草节点推动流程到下一环节
                if (isStartInstanceStatus) {
                    ExecutionTaskEntity draftTask = executionTaskExtendService.getByInstanceId(jb4DCSession, instanceId).stream().
                            filter(item ->
                                    item.getExtaskStatus().equals(WorkFlowEnum.ExTask_Status_Processing) && item.getExtaskReceiverId().equals(jb4DCSession.getUserId())
                            ).findFirst().get();

                    TaskActionResult innerCompleteTaskResult = this.completeTask(jb4DCSession, false, instanceId, modelId, modelReKey, draftTask.getExtaskId(), bpmnStartUserTask.getId(), bpmnStartUserTask.getName(), actionCode, vars, clientSelectedReceiverList, businessKey, instanceTitle, instanceDesc, businessRelationJson,businessDataJson, businessRelationType, newOpinionEntityList);
                    if (!innerCompleteTaskResult.isSuccess()) {
                        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, innerCompleteTaskResult.getMessage());
                    } else {
                        draftTask = executionTaskExtendService.getByPrimaryKey(jb4DCSession, draftTask.getExtaskId());
                        draftTask.setExtaskViewEd("是");
                        draftTask.setExtaskViewTime(draftTask.getExtaskStartTime());
                        draftTask.setExtaskCreateBy(WorkFlowEnum.ExTask_Create_By_Initial);
                        executionTaskExtendService.updateByKeySelective(jb4DCSession, draftTask);
                    }
                }

                completeTaskResult.setSuccess(true);
                completeTaskResult.setMessage("操作成功!");
                return completeTaskResult;
            } else {
                return completeTaskEnable;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            logger.error("办结任务异常!", ex);
            String traceMsg = org.apache.commons.lang3.exception.ExceptionUtils.getStackTrace(ex);
            completeTaskResult.setSuccess(false);
            completeTaskResult.setMessage(traceMsg);
            return completeTaskResult;
        }
    }



    public void taskNewLog(JB4DCSession jb4DCSession, boolean isStartInstanceStatus, String instanceId,
                                         String modelId, String modelReKey, String currentTaskId,
                                         String currentNodeKey, String currentNodeName, String actionCode,
                                         Map<String, Object> vars, List<ClientSelectedReceiver> clientSelectedReceiverList, String businessKey,
                                         String instanceTitle, String instanceDesc, String businessRelationJson, String businessRelationType,List<ExecutionTaskOpinionEntity> newOpinionEntityList) throws JBuild4DCGenerallyException {


    }

    private void saveNewExTaskOpinion(JB4DCSession jb4DCSession, List<ExecutionTaskOpinionEntity> newOpinionEntityList, ExecutionTaskEntity currentExecutionTaskEntity) throws JBuild4DCGenerallyException {
        if(newOpinionEntityList !=null) {
            for (int i = 0, newOpinionEntityListSize = newOpinionEntityList.size(); i < newOpinionEntityListSize; i++) {
                ExecutionTaskOpinionEntity executionTaskOpinionEntity = newOpinionEntityList.get(i);
                executionTaskOpinionEntity.setOpinionId(UUIDUtility.getUUID());
                executionTaskOpinionEntity.setOpinionExtaskId(currentExecutionTaskEntity.getExtaskId());
                int taskNextOpinionNum = executionTaskOpinionExtendService.getTaskNextOpinionNum(jb4DCSession, currentExecutionTaskEntity.getExtaskId())+i;
                executionTaskOpinionEntity.setOpinionOrderNum(taskNextOpinionNum);
                executionTaskOpinionExtendService.saveSimple(jb4DCSession, executionTaskOpinionEntity.getOpinionId(), executionTaskOpinionEntity);
            }
        }
    }

    private ExecutionTaskEntity transformEngineTaskToExTask(JB4DCSession jb4DCSession,String senderId,String senderName,Date sendTime,Task engineTask,InstanceEntity instanceEntity,String preNodeKey,String PreNodeName,String receiverName,
                                                            String fromTaskId,String fromExecutionId,String multiInstanceType,int extaskIndex,String createBy,String fromRecallTaskId){
        //Date date=new Date();
        //Calendar calendar = Calendar.getInstance();
        //calendar.add(Calendar.SECOND,1);
        //date.
        ExecutionTaskEntity executionTaskEntity = new ExecutionTaskEntity();
        executionTaskEntity.setExtaskId(engineTask.getId());
        executionTaskEntity.setExtaskInstId(instanceEntity.getInstId());
        executionTaskEntity.setExtaskModelId(instanceEntity.getInstModId());
        executionTaskEntity.setExtaskRuTaskId(engineTask.getId());
        executionTaskEntity.setExtaskRuExecutionId(engineTask.getExecutionId());
        executionTaskEntity.setExtaskRuProcInstId(engineTask.getProcessInstanceId());
        executionTaskEntity.setExtaskRuProcDefId(engineTask.getProcessDefinitionId());
        executionTaskEntity.setExtaskPreNodeKey(preNodeKey);
        executionTaskEntity.setExtaskPreNodeName(PreNodeName);
        executionTaskEntity.setExtaskCurNodeKey(engineTask.getTaskDefinitionKey());
        executionTaskEntity.setExtaskCurNodeName(engineTask.getName());
        executionTaskEntity.setExtaskType(WorkFlowEnum.ExTask_Type_Main);
        executionTaskEntity.setExtaskStatus(WorkFlowEnum.ExTask_Status_Processing);
        executionTaskEntity.setExtaskSenderId(senderId);
        executionTaskEntity.setExtaskSenderName(senderName);
        executionTaskEntity.setExtaskSendTime(sendTime);
        executionTaskEntity.setExtaskReceiverId(engineTask.getAssignee());

        executionTaskEntity.setExtaskReceiverName(receiverName);
        executionTaskEntity.setExtaskViewEd(TrueFalseEnum.False.getDisplayName());
        executionTaskEntity.setExtaskStartTime(sendTime);
        executionTaskEntity.setExtaskHandleEd(TrueFalseEnum.False.getDisplayName());
        executionTaskEntity.setExtaskOrderNum(executionTaskExtendService.getNextOrderNum(jb4DCSession));
        executionTaskEntity.setExtaskFromTaskId(fromTaskId);
        executionTaskEntity.setExtaskFromRecallTaskId(fromRecallTaskId);
        executionTaskEntity.setExtaskFromExecutionId(fromExecutionId);

        executionTaskEntity.setExtaskMultiTask(multiInstanceType);
        executionTaskEntity.setExtaskIndex(extaskIndex);

        executionTaskEntity.setExtaskCreateBy(createBy);

        return executionTaskEntity;
    }

    private InstanceEntity createNewInstance(JB4DCSession jb4DCSession,String newInstanceId, String businessKey,
                                             String instanceTitle, String instanceDesc, FlowModelIntegratedPO flowModelIntegratedPO,
                                             ProcessInstance processInstance, String businessRelationJson, String businessDataJson, String businessRelationType) throws JBuild4DCGenerallyException {
        InstanceEntity instanceEntity = new InstanceEntity();
        instanceEntity.setInstId(newInstanceId);
        instanceEntity.setInstTitle(instanceTitle);
        instanceEntity.setInstDesc(instanceDesc);
        instanceEntity.setInstCustDesc("无");
        instanceEntity.setInstCreateTime(new Date());
        instanceEntity.setInstCreator(jb4DCSession.getUserName());
        instanceEntity.setInstCreatorId(jb4DCSession.getUserId());
        instanceEntity.setInstOrganName(jb4DCSession.getOrganName());
        instanceEntity.setInstOrganId(jb4DCSession.getOrganId());
        instanceEntity.setInstStatus(WorkFlowEnum.Instance_Status_Name_Running);
        instanceEntity.setInstRuExecutionId(processInstance.getId());
        instanceEntity.setInstRuProcInstId(processInstance.getId());
        instanceEntity.setInstRuBusinessKey(businessKey);
        instanceEntity.setInstRuProcDefId(processInstance.getProcessDefinitionId());
        instanceEntity.setInstOrderNum(getNextOrderNum(jb4DCSession));
        instanceEntity.setInstModId(flowModelIntegratedPO.getModelId());
        instanceEntity.setInstModCategory(flowModelIntegratedPO.getModelFlowCategory());
        instanceEntity.setInstModModuleId(flowModelIntegratedPO.getModelModuleId());
        instanceEntity.setInstModTenantId(flowModelIntegratedPO.getModelTenantId());
        instanceEntity.setInstRuBusinessRelation(businessRelationJson);
        instanceEntity.setInstRuBusinessData(businessDataJson);
        instanceEntity.setInstRuBusinessRelType(businessRelationType);
        this.saveSimple(jb4DCSession, instanceEntity.getInstId(), instanceEntity);
        return instanceEntity;
    }

    private InstanceEntity updateInstanceBusinessData(JB4DCSession jb4DCSession,String instanceId, String businessRelationJson, String businessDataJson, String businessRelationType) throws JBuild4DCGenerallyException {
        InstanceEntity instanceEntity = getByPrimaryKey(jb4DCSession, instanceId);
        instanceEntity.setInstRuBusinessRelation(businessRelationJson);
        instanceEntity.setInstRuBusinessData(businessDataJson);
        instanceEntity.setInstRuBusinessRelType(businessRelationType);
        this.updateByKeySelective(jb4DCSession, instanceEntity);
        return instanceEntity;
    }

    private void buildFlowModelRuntimePOBaseInfo(JB4DCSession session, FlowInstanceRuntimePO flowInstanceRuntimePO, String modelReKey,
                                                 boolean isStart, String processDefId, String currentNodeKey, InstanceEntity instanceEntity,
                                                 ExecutionTaskEntity executionTaskEntity, List<ExecutionTaskEntity> historyExecutionTaskEntityList, ModelIntegratedEntity modelIntegratedEntity) throws JAXBException, XMLStreamException, IOException, JBuild4DCGenerallyException {
        //FlowModelRuntimePO flowModelRuntimePO = new FlowModelRuntimePO();

        String modelXml;
        if(isStart){
            modelXml = flowEngineModelIntegratedService.getDeployedCamundaModelContentLastVersion(session, modelReKey, ModelTenantIdEnum.builderGeneralTenant);
        }
        else{
            modelXml = flowEngineModelIntegratedService.getDeployedCamundaModelContent(session, processDefId);
        }

        BpmnDefinitions bpmnDefinitions = modelIntegratedExtendService.parseToPO(modelXml);
        BpmnProcess bpmnProcess = bpmnDefinitions.getBpmnProcess();

        flowInstanceRuntimePO.setStartEvent(isStart);
        flowInstanceRuntimePO.setJb4dcFormId(bpmnProcess.getJb4dcFormId());
        flowInstanceRuntimePO.setJb4dcFormPlugin(bpmnProcess.getJb4dcFormPlugin());
        flowInstanceRuntimePO.setJb4dcFormParas(bpmnProcess.getJb4dcFormParas());

        flowInstanceRuntimePO.setJb4dcFormEx1Id(bpmnProcess.getJb4dcFormEx1Id());
        flowInstanceRuntimePO.setJb4dcFormEx1Plugin(bpmnProcess.getJb4dcFormEx1Plugin());
        flowInstanceRuntimePO.setJb4dcFormEx1Paras(bpmnProcess.getJb4dcFormEx1Paras());

        flowInstanceRuntimePO.setModelName(bpmnProcess.getName());
        flowInstanceRuntimePO.setModelReKey(bpmnProcess.getId());
        flowInstanceRuntimePO.setModelCategory(bpmnProcess.getJb4dcFlowCategory());

        flowInstanceRuntimePO.setInstanceEntity(instanceEntity);
        flowInstanceRuntimePO.setExecutionTaskEntity(executionTaskEntity);
        flowInstanceRuntimePO.setHistoryExecutionTaskEntityList(historyExecutionTaskEntityList);
        flowInstanceRuntimePO.setHistoricActivityInstancePOList(flowEngineHistoryIntegratedService.getHistoricActivityInstancePOByProcessInstanceId(instanceEntity.getInstRuProcInstId()));

        if (isStart) {
            //#region
            /*BpmnStartEvent bpmnStartEvent = bpmnDefinitions.getBpmnProcess().getStartEvent();
            flowInstanceRuntimePO.setCurrentNodeKey(bpmnStartEvent.getId());
            flowInstanceRuntimePO.setCurrentNodeName(bpmnStartEvent.getName());

            if(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcFormId())){
                flowInstanceRuntimePO.setJb4dcFormId(bpmnStartEvent.getJb4dcFormId());
                flowInstanceRuntimePO.setJb4dcFormPlugin(bpmnStartEvent.getJb4dcFormPlugin());
                flowInstanceRuntimePO.setJb4dcFormParas(bpmnStartEvent.getJb4dcFormParas());
            }
            if(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcFormEx1Id())){
                flowInstanceRuntimePO.setJb4dcFormEx1Id(bpmnStartEvent.getJb4dcFormEx1Id());
                flowInstanceRuntimePO.setJb4dcFormEx1Plugin(bpmnStartEvent.getJb4dcFormEx1Plugin());
                flowInstanceRuntimePO.setJb4dcFormEx1Paras(bpmnStartEvent.getJb4dcFormEx1Paras());
            }

            flowInstanceRuntimePO.setJb4dcOuterFormUrl(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcOuterFormUrl()) ? bpmnStartEvent.getJb4dcOuterFormUrl() : bpmnProcess.getJb4dcOuterFormUrl());
            flowInstanceRuntimePO.setJb4dcOuterFormEx1Url(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcOuterFormEx1Url()) ? bpmnStartEvent.getJb4dcOuterFormEx1Url() : bpmnProcess.getJb4dcOuterFormEx1Url());
            flowInstanceRuntimePO.setJb4dcProcessTitleEditText(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcProcessTitleEditText()) ? bpmnStartEvent.getJb4dcProcessTitleEditText() : bpmnProcess.getJb4dcProcessTitleEditText());
            flowInstanceRuntimePO.setJb4dcProcessTitleEditValue(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcProcessTitleEditValue()) ? bpmnStartEvent.getJb4dcProcessTitleEditValue() : bpmnProcess.getJb4dcProcessTitleEditValue());
            flowInstanceRuntimePO.setJb4dcProcessDescriptionEditText(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcProcessDescriptionEditText()) ? bpmnStartEvent.getJb4dcProcessDescriptionEditText() : bpmnProcess.getJb4dcProcessDescriptionEditText());
            flowInstanceRuntimePO.setJb4dcProcessDescriptionEditValue(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcProcessDescriptionEditValue()) ? bpmnStartEvent.getJb4dcProcessDescriptionEditValue() : bpmnProcess.getJb4dcProcessDescriptionEditValue());
            flowInstanceRuntimePO.setJb4dcProcessActionConfirm(bpmnProcess.getJb4dcProcessActionConfirm());
            if (bpmnStartEvent.getJb4dcUseContentDocument()!=null&&(bpmnStartEvent.getJb4dcUseContentDocument().equals("byNodeConfig") || bpmnStartEvent.getJb4dcUseContentDocument().equals("notUse"))) {
                flowInstanceRuntimePO.setJb4dcUseContentDocument(bpmnStartEvent.getJb4dcUseContentDocument());
                flowInstanceRuntimePO.setJb4dcContentDocumentPlugin(bpmnStartEvent.getJb4dcContentDocumentPlugin());
                flowInstanceRuntimePO.setJb4dcContentDocumentRedHeadTemplate(bpmnStartEvent.getJb4dcContentDocumentRedHeadTemplate());
            } else {
                flowInstanceRuntimePO.setJb4dcUseContentDocument(bpmnProcess.getJb4dcUseContentDocument());
                flowInstanceRuntimePO.setJb4dcContentDocumentPlugin(bpmnProcess.getJb4dcContentDocumentPlugin());
                flowInstanceRuntimePO.setJb4dcContentDocumentRedHeadTemplate(bpmnProcess.getJb4dcContentDocumentRedHeadTemplate());
            }*/
            //#endregion
            BpmnUserTask bpmnStartUserTask = bpmnDefinitions.getBpmnProcess().getUserTaskList().stream().filter(item->item.getId().equals(WorkFlowEnum.UserTask_Start_Node_Id)).findFirst().get();
            flowInstanceRuntimePO.setCurrentNodeKey(bpmnStartUserTask.getId());
            flowInstanceRuntimePO.setCurrentNodeName(bpmnStartUserTask.getName());

            if(StringUtility.isNotEmpty(bpmnStartUserTask.getJb4dcFormId())){
                flowInstanceRuntimePO.setJb4dcFormId(bpmnStartUserTask.getJb4dcFormId());
                flowInstanceRuntimePO.setJb4dcFormPlugin(bpmnStartUserTask.getJb4dcFormPlugin());
                flowInstanceRuntimePO.setJb4dcFormParas(bpmnStartUserTask.getJb4dcFormParas());
            }
            if(StringUtility.isNotEmpty(bpmnStartUserTask.getJb4dcFormEx1Id())){
                flowInstanceRuntimePO.setJb4dcFormEx1Id(bpmnStartUserTask.getJb4dcFormEx1Id());
                flowInstanceRuntimePO.setJb4dcFormEx1Plugin(bpmnStartUserTask.getJb4dcFormEx1Plugin());
                flowInstanceRuntimePO.setJb4dcFormEx1Paras(bpmnStartUserTask.getJb4dcFormEx1Paras());
            }

            flowInstanceRuntimePO.setJb4dcOuterFormUrl(StringUtility.isNotEmpty(bpmnStartUserTask.getJb4dcOuterFormUrl()) ? bpmnStartUserTask.getJb4dcOuterFormUrl() : bpmnProcess.getJb4dcOuterFormUrl());
            flowInstanceRuntimePO.setJb4dcOuterFormEx1Url(StringUtility.isNotEmpty(bpmnStartUserTask.getJb4dcOuterFormEx1Url()) ? bpmnStartUserTask.getJb4dcOuterFormEx1Url() : bpmnProcess.getJb4dcOuterFormEx1Url());
            flowInstanceRuntimePO.setJb4dcProcessTitleEditText(StringUtility.isNotEmpty(bpmnStartUserTask.getJb4dcProcessTitleEditText()) ? bpmnStartUserTask.getJb4dcProcessTitleEditText() : bpmnProcess.getJb4dcProcessTitleEditText());
            flowInstanceRuntimePO.setJb4dcProcessTitleEditValue(StringUtility.isNotEmpty(bpmnStartUserTask.getJb4dcProcessTitleEditValue()) ? bpmnStartUserTask.getJb4dcProcessTitleEditValue() : bpmnProcess.getJb4dcProcessTitleEditValue());
            flowInstanceRuntimePO.setJb4dcProcessDescriptionEditText(StringUtility.isNotEmpty(bpmnStartUserTask.getJb4dcProcessDescriptionEditText()) ? bpmnStartUserTask.getJb4dcProcessDescriptionEditText() : bpmnProcess.getJb4dcProcessDescriptionEditText());
            flowInstanceRuntimePO.setJb4dcProcessDescriptionEditValue(StringUtility.isNotEmpty(bpmnStartUserTask.getJb4dcProcessDescriptionEditValue()) ? bpmnStartUserTask.getJb4dcProcessDescriptionEditValue() : bpmnProcess.getJb4dcProcessDescriptionEditValue());
            flowInstanceRuntimePO.setJb4dcProcessActionConfirm(bpmnProcess.getJb4dcProcessActionConfirm());
            if (bpmnStartUserTask.getJb4dcUseContentDocument()!=null&&(bpmnStartUserTask.getJb4dcUseContentDocument().equals("byNodeConfig") || bpmnStartUserTask.getJb4dcUseContentDocument().equals("notUse"))) {
                flowInstanceRuntimePO.setJb4dcUseContentDocument(bpmnStartUserTask.getJb4dcUseContentDocument());
                flowInstanceRuntimePO.setJb4dcContentDocumentPlugin(bpmnStartUserTask.getJb4dcContentDocumentPlugin());
                flowInstanceRuntimePO.setJb4dcContentDocumentRedHeadTemplate(bpmnStartUserTask.getJb4dcContentDocumentRedHeadTemplate());
            } else {
                flowInstanceRuntimePO.setJb4dcUseContentDocument(bpmnProcess.getJb4dcUseContentDocument());
                flowInstanceRuntimePO.setJb4dcContentDocumentPlugin(bpmnProcess.getJb4dcContentDocumentPlugin());
                flowInstanceRuntimePO.setJb4dcContentDocumentRedHeadTemplate(bpmnProcess.getJb4dcContentDocumentRedHeadTemplate());
            }
        } else {
            BpmnUserTask userTask = bpmnProcess.getUserTaskList().stream().filter(item -> item.getId().equals(currentNodeKey)).findFirst().orElse(null);
            if (userTask != null) {
                flowInstanceRuntimePO.setCurrentNodeKey(userTask.getId());
                flowInstanceRuntimePO.setCurrentNodeName(userTask.getName());

                if(StringUtility.isNotEmpty(userTask.getJb4dcFormId())){
                    flowInstanceRuntimePO.setJb4dcFormId(userTask.getJb4dcFormId());
                    flowInstanceRuntimePO.setJb4dcFormPlugin(userTask.getJb4dcFormPlugin());
                    flowInstanceRuntimePO.setJb4dcFormParas(userTask.getJb4dcFormParas());
                }
                if(StringUtility.isNotEmpty(userTask.getJb4dcFormEx1Id())){
                    flowInstanceRuntimePO.setJb4dcFormEx1Id(userTask.getJb4dcFormEx1Id());
                    flowInstanceRuntimePO.setJb4dcFormEx1Plugin(userTask.getJb4dcFormEx1Plugin());
                    flowInstanceRuntimePO.setJb4dcFormEx1Paras(userTask.getJb4dcFormEx1Paras());
                }

                flowInstanceRuntimePO.setJb4dcOuterFormUrl(StringUtility.isNotEmpty(userTask.getJb4dcOuterFormUrl()) ? userTask.getJb4dcOuterFormUrl() : bpmnProcess.getJb4dcOuterFormUrl());
                flowInstanceRuntimePO.setJb4dcOuterFormEx1Url(StringUtility.isNotEmpty(userTask.getJb4dcOuterFormEx1Url()) ? userTask.getJb4dcOuterFormEx1Url() : bpmnProcess.getJb4dcOuterFormEx1Url());
                flowInstanceRuntimePO.setJb4dcProcessTitleEditText(StringUtility.isNotEmpty(userTask.getJb4dcProcessTitleEditText()) ? userTask.getJb4dcProcessTitleEditText() : bpmnProcess.getJb4dcProcessTitleEditText());
                flowInstanceRuntimePO.setJb4dcProcessTitleEditValue(StringUtility.isNotEmpty(userTask.getJb4dcProcessTitleEditValue()) ? userTask.getJb4dcProcessTitleEditValue() : bpmnProcess.getJb4dcProcessTitleEditValue());
                flowInstanceRuntimePO.setJb4dcProcessDescriptionEditText(StringUtility.isNotEmpty(userTask.getJb4dcProcessDescriptionEditText()) ? userTask.getJb4dcProcessDescriptionEditText() : bpmnProcess.getJb4dcProcessDescriptionEditText());
                flowInstanceRuntimePO.setJb4dcProcessDescriptionEditValue(StringUtility.isNotEmpty(userTask.getJb4dcProcessDescriptionEditValue()) ? userTask.getJb4dcProcessDescriptionEditValue() : bpmnProcess.getJb4dcProcessDescriptionEditValue());
                flowInstanceRuntimePO.setJb4dcProcessActionConfirm(bpmnProcess.getJb4dcProcessActionConfirm());
                if (userTask.getJb4dcUseContentDocument().equals("byNodeConfig") || userTask.getJb4dcUseContentDocument().equals("notUse")) {
                    flowInstanceRuntimePO.setJb4dcUseContentDocument(userTask.getJb4dcUseContentDocument());
                    flowInstanceRuntimePO.setJb4dcContentDocumentPlugin(userTask.getJb4dcContentDocumentPlugin());
                    flowInstanceRuntimePO.setJb4dcContentDocumentRedHeadTemplate(userTask.getJb4dcContentDocumentRedHeadTemplate());
                } else {
                    flowInstanceRuntimePO.setJb4dcUseContentDocument(bpmnProcess.getJb4dcUseContentDocument());
                    flowInstanceRuntimePO.setJb4dcContentDocumentPlugin(bpmnProcess.getJb4dcContentDocumentPlugin());
                    flowInstanceRuntimePO.setJb4dcContentDocumentRedHeadTemplate(bpmnProcess.getJb4dcContentDocumentRedHeadTemplate());
                }
            }
        }

        flowInstanceRuntimePO.setModelIntegratedEntity(modelIntegratedEntity);
        flowInstanceRuntimePO.setBpmnDefinitions(bpmnDefinitions);
        flowInstanceRuntimePO.setBpmnXmlContent(URLUtility.encode(modelXml));
    }

    @Override
    public FlowInstanceRuntimePO getInstanceRuntimePOWithStart(JB4DCSession session, String modelKey) throws IOException, JAXBException, XMLStreamException, JBuild4DCGenerallyException {
        FlowInstanceRuntimePO result = new FlowInstanceRuntimePO();
        InstanceEntity instanceEntity=new InstanceEntity();
        instanceEntity.setInstId(UUIDUtility.getUUID());
        instanceEntity.setInstCreateTime(new Date());
        instanceEntity.setInstCreator(session.getUserName());
        instanceEntity.setInstCreatorId(session.getUserId());
        instanceEntity.setInstOrganName(session.getOrganName());
        instanceEntity.setInstOrganId(session.getOrganId());
        ModelIntegratedEntity modelIntegratedEntity=modelIntegratedExtendService.getLastSaveModelIntegratedEntity(session, modelKey);
        buildFlowModelRuntimePOBaseInfo(session, result, modelKey, true, "","",instanceEntity,null,null,modelIntegratedEntity);
        return result;
    }

    @Override
    public FlowInstanceRuntimePO getInstanceRuntimePOWithProcessTask(JB4DCSession jb4DCSession, String extaskId) throws JBuild4DCGenerallyException, JAXBException, IOException, XMLStreamException {
        FlowInstanceRuntimePO result = new FlowInstanceRuntimePO();
        ExecutionTaskEntity executionTaskEntity = executionTaskExtendService.getByPrimaryKey(jb4DCSession, extaskId);
        InstanceEntity instanceEntity = getByPrimaryKey(jb4DCSession, executionTaskEntity.getExtaskInstId());
        ModelIntegratedEntity modelIntegratedEntity=modelIntegratedExtendService.getByPrimaryKey(jb4DCSession,instanceEntity.getInstModId());
        List<ExecutionTaskEntity> executionTaskEntityList=executionTaskExtendService.getByInstanceId(jb4DCSession,instanceEntity.getInstId());
        buildFlowModelRuntimePOBaseInfo(jb4DCSession, result, instanceEntity.getInstModId(), false, instanceEntity.getInstRuProcDefId(), executionTaskEntity.getExtaskCurNodeKey(), instanceEntity, executionTaskEntity,executionTaskEntityList,modelIntegratedEntity);
        return result;
    }

    @Override
    public FlowInstanceRuntimePO getInstanceRuntimePOWithEndTask(JB4DCSession jb4DCSession, String extaskId) throws XMLStreamException, JAXBException, IOException, JBuild4DCGenerallyException {
        FlowInstanceRuntimePO flowInstanceRuntimePO=getInstanceRuntimePOWithProcessTask(jb4DCSession,extaskId);
        Jb4dcActions jb4dcActions = getMyEndTaskEnableActions(jb4DCSession, jb4DCSession.getUserId(), jb4DCSession.getOrganId(), extaskId,flowInstanceRuntimePO);
        flowInstanceRuntimePO.setMyEndTaskActions(jb4dcActions);
        return flowInstanceRuntimePO;
    }

    private Jb4dcActions getMyEndTaskEnableActions(JB4DCSession session, String userId, String organId, String extaskId, FlowInstanceRuntimePO flowInstanceRuntimePO) throws JBuild4DCGenerallyException, XMLStreamException, JAXBException, IOException {
        Jb4dcActions actions=new Jb4dcActions();
        actions.setJb4dcActionList(new ArrayList<>());
        //删除按钮
        Jb4dcAction deleteAction= getDeleteInstanceAction(session, userId, organId, extaskId,flowInstanceRuntimePO);
        if (deleteAction!=null){
            actions.getJb4dcActionList().add(deleteAction);
        }
        //撤回按钮
        Jb4dcAction callBackAction= getRecallTaskAction(session, userId, organId, extaskId,flowInstanceRuntimePO);
        if (callBackAction!=null){
            actions.getJb4dcActionList().add(callBackAction);
        }
        return actions;
    }

    private Jb4dcAction getRecallTaskAction(JB4DCSession session, String userId, String organId, String extaskId, FlowInstanceRuntimePO flowInstanceRuntimePO) throws JBuild4DCGenerallyException, XMLStreamException, JAXBException, IOException {
        SimplePO disable = recallTaskActionEnable(session, userId, organId, extaskId, flowInstanceRuntimePO);
        Jb4dcAction action = new Jb4dcAction();
        action.setActionCaption("撤回");
        action.setJuelRunResultPO(new JuelRunResultPO(true, "", "true", true));
        action.setActionType("recall");
        action.setActionDisable(disable.getStringValue());
        action.setActionHTMLId("CallBackTaskActionButton");
        if(disable.equals("enable")){

        }
        else{
            action.setActionRemark("不允许执行撤回动作!");
        }
        return action;
    }

    private SimplePO deleteInstanceActionEnable(JB4DCSession jb4DCSession, String userId, String organId, String extaskId, FlowInstanceRuntimePO flowInstanceRuntimePO) {
        SimplePO simplePO=new SimplePO();
        try {
            simplePO.setSuccess(true);
            simplePO.setStringValue("enable");
            simplePO.setMessage("");

            String instRuProcInstId=flowInstanceRuntimePO.getInstanceEntity().getInstRuProcInstId();
            ExecutionTaskEntity recallFromExecutionTaskEntity=flowInstanceRuntimePO.getExecutionTaskEntity();
            if(flowEngineInstanceIntegratedService.instanceIsComplete(jb4DCSession,instRuProcInstId)){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"该流程实例已经办结,无法撤回!");
            }

            return simplePO;
        }
        catch (Exception ex){
            simplePO.setSuccess(false);
            simplePO.setStringValue("disable");
            simplePO.setMessage(ex.getMessage());
            return simplePO;
        }
    }

    private Jb4dcAction getDeleteInstanceAction(JB4DCSession session, String userId, String organId, String extaskId, FlowInstanceRuntimePO flowInstanceRuntimePO) {
        SimplePO disable = deleteInstanceActionEnable(session, userId, organId, extaskId, flowInstanceRuntimePO);
        Jb4dcAction action = new Jb4dcAction();
        action.setActionCaption("删除流程实例");
        action.setJuelRunResultPO(new JuelRunResultPO(true, "", "true", true));
        action.setActionType("deleteInstance");
        action.setActionDisable(disable.getStringValue());
        action.setActionHTMLId("DeleteInstanceButton");
        if(disable.equals("enable")){

        }
        else{
            action.setActionRemark("不允许执行删除动作!");
        }
        return action;
    }

    /*@Override
    public SimplePO recallMySendTaskEnable(JB4DCSession jb4DCSession, String userId, String organId, String extaskId) throws JBuild4DCGenerallyException, XMLStreamException, JAXBException, IOException {

        return recallTaskActionEnable(jb4DCSession,userId,organId,extaskId,flowInstanceRuntimePO);
    }*/

    @Override
    @Transactional(rollbackFor = {JBuild4DCGenerallyException.class})
    public TaskActionResult recallMySendTask(JB4DCSession jb4DCSession, String userId, String organId, String extaskId) throws JBuild4DCGenerallyException {
        TaskActionResult recallTaskResult = new TaskActionResult();
        try{
            FlowInstanceRuntimePO flowInstanceRuntimePO=getInstanceRuntimePOWithProcessTask(jb4DCSession,extaskId);
            InstanceEntity instanceEntity=flowInstanceRuntimePO.getInstanceEntity();
            ExecutionTaskEntity recallFromExecutionTaskEntity=flowInstanceRuntimePO.getExecutionTaskEntity();
            SimplePO simplePO=recallTaskActionEnable(jb4DCSession,userId,organId,extaskId,flowInstanceRuntimePO);
            BpmnUserTask bpmnUserTask = flowInstanceRuntimePO.getBpmnDefinitions().getBpmnProcess().getUserTaskList().stream().filter(item -> item.getId().equals(recallFromExecutionTaskEntity.getExtaskCurNodeKey())).findFirst().get();
            simplePO.setSuccess(true);
            if(simplePO.isSuccess()){

                String engineRecallResult=flowEngineInstanceIntegratedService.recallProcessForUserTask(jb4DCSession,instanceEntity.getInstRuProcInstId(),
                        recallFromExecutionTaskEntity.getExtaskRuTaskId(),recallFromExecutionTaskEntity.getExtaskCurNodeKey(),jb4DCSession.getUserId(),null);
                //boolean reValidateIdentical=false;
                if(engineRecallResult.equals("recallByMultiInstanceAllIsNotEnd")){
                    recallTaskResult=recallByMultiInstanceAllIsNotEnd(jb4DCSession, instanceEntity, recallFromExecutionTaskEntity, bpmnUserTask);
                }
                else if(engineRecallResult.equals("recallByMultiInstanceAllIsEnd")){
                    //如果撤回环节是多人环节,并且其他人办理完成.
                    List<ExecutionTaskEntity> allProcessingTaskList=executionTaskExtendService.getByInstanceIdAndStatus(jb4DCSession,instanceEntity.getInstId(),WorkFlowEnum.ExTask_Status_Processing);
                    String myTaskNodeKey=recallFromExecutionTaskEntity.getExtaskCurNodeKey();
                    for (ExecutionTaskEntity processingTaskEntity : allProcessingTaskList) {
                        if(!processingTaskEntity.getExtaskPreNodeKey().equals(myTaskNodeKey)){
                            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"[如果撤回环节是多人环节，并且其他人办理完成],状态再次验证失败。");
                        }
                    }

                    recallTaskResult = recallBySingle(jb4DCSession, instanceEntity, recallFromExecutionTaskEntity, bpmnUserTask);
                }
                else if(engineRecallResult.equals("recallBySingle")){
                    //region 如果撤回环节是单人环节.
                    if(recallFromExecutionTaskEntity.getExtaskMultiTask().equals(WorkFlowEnum.ExTask_Multi_Task_Single)) {
                        recallTaskResult = recallBySingle(jb4DCSession, instanceEntity, recallFromExecutionTaskEntity, bpmnUserTask);
                    }
                    else {
                        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"[如果撤回环节是单人环节]，状态再次验证失败。");
                    }
                    //endregion
                }
            }
            else {
                recallTaskResult.setMessage(simplePO.getMessage());
                recallTaskResult.setSuccess(false);
            }
            //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"开发中断!");
            return recallTaskResult;
        }
        catch (Exception ex) {
            ex.printStackTrace();
            logger.error("办结任务异常!",ex);
            String traceMsg = org.apache.commons.lang3.exception.ExceptionUtils.getStackTrace(ex);
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,traceMsg);
            //String traceMsg = org.apache.commons.lang3.exception.ExceptionUtils.getStackTrace(ex);
            //recallTaskResult.setSuccess(false);
            //recallTaskResult.setMessage(traceMsg);
            //return recallTaskResult;
        }
    }

    @Override
    public void clearData(JB4DCSession jb4DCSession, ClearDataPO clearDataPO) throws JBuild4DCGenerallyException {
        if(clearDataPO.getClearAllOpCode().equals("13927425407")){
            if(clearDataPO.getClearAllModel().equals("是")){
                flowEngineModelIntegratedService.clearAllDeployedModel(jb4DCSession);
                modelIntegratedExtendService.deleteAll(jb4DCSession, JBuild4DCYaml.getWarningOperationCode());
            }
            if(clearDataPO.getClearAllInstance().equals("是")){
                flowEngineInstanceIntegratedService.deleteAllInstance(jb4DCSession,"清空数据");
                this.deleteAll(jb4DCSession,JBuild4DCYaml.getWarningOperationCode());
                executionTaskExtendService.deleteAll(jb4DCSession,JBuild4DCYaml.getWarningOperationCode());
                executionTaskLogExtendService.deleteAll(jb4DCSession,JBuild4DCYaml.getWarningOperationCode());
                executionTaskOpinionExtendService.deleteAll(jb4DCSession,JBuild4DCYaml.getWarningOperationCode());
            }
            if(clearDataPO.getClearAllInstanceFile().equals("是")){
                instanceFileExtendService.deleteAll(jb4DCSession,JBuild4DCYaml.getWarningOperationCode());
            }
        }
        else{
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"验证码错误!");
        }
    }

    @Override
    public String formRecordComplexPOToBusinessRelationJson(JB4DCSession jb4DCSession, FormRecordComplexPO formRecordComplexPO) throws IOException {
        FormRecordComplexPO innerFormRecordComplexPO= JsonUtility.clone(formRecordComplexPO);
        List<FormRecordDataRelationPO> formRecordDataRelationPOList=innerFormRecordComplexPO.getFormRecordDataRelationPOList();
        for (FormRecordDataRelationPO formRecordDataRelationPO : formRecordDataRelationPOList) {
            formRecordDataRelationPO.setListDataRecord(null);
            formRecordDataRelationPO.setOneDataRecord(null);
            formRecordDataRelationPO.setIcon("");
        }
        return JsonUtility.toObjectString(formRecordDataRelationPOList);
    }

    private TaskActionResult recallBySingle(JB4DCSession jb4DCSession, InstanceEntity instanceEntity, ExecutionTaskEntity recallFromExecutionTaskEntity, BpmnUserTask bpmnUserTask) throws JBuild4DCGenerallyException {
        //executionTaskExtendService.cancelProcessingExTask(jb4DCSession, instanceEntity.getInstId());
        List<ExecutionTaskEntity> beCancelExecutionTaskEntityList=executionTaskExtendService.getProcessingTaskByInstanceIdAndFromTaskNodeKey(jb4DCSession, instanceEntity.getInstId(), recallFromExecutionTaskEntity.getExtaskCurNodeKey());
        ExecutionTaskEntity singleBeCancelExecutionTaskEntityList=null;
        if(beCancelExecutionTaskEntityList==null) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"[撤回单人环节]，找不到需要取消的任务！");
        }
        else{
            singleBeCancelExecutionTaskEntityList=beCancelExecutionTaskEntityList.get(0);

            for (ExecutionTaskEntity executionTaskEntity : beCancelExecutionTaskEntityList) {
                executionTaskEntity.setExtaskStatus(WorkFlowEnum.ExTask_Status_Cancel);
                executionTaskExtendService.updateByKeySelective(jb4DCSession,executionTaskEntity);
            }
        }
        List<Task> engineTaskList = flowEngineTaskIntegratedService.getTasks(instanceEntity.getInstRuProcInstId());
        Task engineTask = engineTaskList.stream().filter(item -> item.getTaskDefinitionKey().equals(recallFromExecutionTaskEntity.getExtaskCurNodeKey())).findFirst().get();
        int recallNewExtaskIndex=executionTaskExtendService.getNextExtaskIndexByInstanceId(jb4DCSession, instanceEntity.getInstId());

        //生成新的待办任务
        ExecutionTaskEntity recallNewExecutionTaskEntity=transformEngineTaskToExTask(jb4DCSession,
                recallFromExecutionTaskEntity.getExtaskSenderId(), recallFromExecutionTaskEntity.getExtaskSenderName(), recallFromExecutionTaskEntity.getExtaskSendTime(),engineTask, instanceEntity,
                singleBeCancelExecutionTaskEntityList.getExtaskCurNodeKey(),singleBeCancelExecutionTaskEntityList.getExtaskCurNodeName(),
                recallFromExecutionTaskEntity.getExtaskReceiverName(),
                recallFromExecutionTaskEntity.getExtaskFromTaskId(), recallFromExecutionTaskEntity.getExtaskFromExecutionId(), bpmnUserTask.getMultiInstanceType(),recallNewExtaskIndex,WorkFlowEnum.ExTask_Create_By_Cancel,
                recallFromExecutionTaskEntity.getExtaskId());

        executionTaskExtendService.saveSimple(jb4DCSession, recallNewExecutionTaskEntity.getExtaskId(), recallNewExecutionTaskEntity);

        //将撤销的来源任务从End修改为CancelEnd
        recallFromExecutionTaskEntity.setExtaskStatus(WorkFlowEnum.ExTask_Status_CancelEnd);
        executionTaskExtendService.updateByKeySelective(jb4DCSession, recallFromExecutionTaskEntity);

        TaskActionResult recallTaskResult=new TaskActionResult();
        recallTaskResult.setSuccess(true);
        recallTaskResult.setMessage("撤回成功，请到待办中进行办理操作。");
        recallTaskResult.setData(recallNewExecutionTaskEntity);
        return recallTaskResult;
    }

    private TaskActionResult recallByMultiInstanceAllIsNotEnd(JB4DCSession jb4DCSession, InstanceEntity instanceEntity, ExecutionTaskEntity recallFromExecutionTaskEntity, BpmnUserTask bpmnUserTask) throws JBuild4DCGenerallyException {
        //如果撤回环节是多人环节,并且其他人都没有办理完成.
        List<ExecutionTaskEntity> allProcessingTaskList=executionTaskExtendService.getByInstanceIdAndStatus(jb4DCSession, instanceEntity.getInstId(),WorkFlowEnum.ExTask_Status_Processing);
        String myTaskNodeKey= recallFromExecutionTaskEntity.getExtaskCurNodeKey();
        if(allProcessingTaskList!=null&&allProcessingTaskList.size()>0&&
                allProcessingTaskList.stream().anyMatch(item->item.getExtaskCurNodeKey().equals(myTaskNodeKey))){

            List<Task> engineTaskList = flowEngineTaskIntegratedService.getTasks(instanceEntity.getInstRuProcInstId());
            ExecutionTaskEntity recallNewExecutionTaskEntity=null;
            //需要排除掉已有的ExTask;
            for (Task engineTask : engineTaskList) {
                if(allProcessingTaskList.stream().noneMatch(item->item.getExtaskRuTaskId().equals(engineTask.getId()))){

                    int recallNewExtaskIndex=executionTaskExtendService.getNextExtaskIndexByInstanceId(jb4DCSession, instanceEntity.getInstId());
                    recallNewExecutionTaskEntity=transformEngineTaskToExTask(jb4DCSession,
                            recallFromExecutionTaskEntity.getExtaskSenderId(), recallFromExecutionTaskEntity.getExtaskSenderName(), recallFromExecutionTaskEntity.getExtaskSendTime(),
                            engineTask, instanceEntity,
                            recallFromExecutionTaskEntity.getExtaskPreNodeKey(), recallFromExecutionTaskEntity.getExtaskPreNodeName(),
                            recallFromExecutionTaskEntity.getExtaskReceiverName(),
                            recallFromExecutionTaskEntity.getExtaskFromTaskId(), recallFromExecutionTaskEntity.getExtaskFromExecutionId(), bpmnUserTask.getMultiInstanceType(),recallNewExtaskIndex,WorkFlowEnum.ExTask_Create_By_Cancel,
                            recallFromExecutionTaskEntity.getExtaskId());

                    executionTaskExtendService.saveSimple(jb4DCSession, recallNewExecutionTaskEntity.getExtaskId(), recallNewExecutionTaskEntity);
                }
            }
            //将撤销的来源任务从End修改为CancelEnd
            recallFromExecutionTaskEntity.setExtaskStatus(WorkFlowEnum.ExTask_Status_CancelEnd);
            executionTaskExtendService.updateByKeySelective(jb4DCSession, recallFromExecutionTaskEntity);

            TaskActionResult recallTaskResult=new TaskActionResult();
            recallTaskResult.setSuccess(true);
            recallTaskResult.setMessage("撤回成功，请到待办中进行办理操作。");
            recallTaskResult.setData(recallNewExecutionTaskEntity);
            return recallTaskResult;
            //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"[如果撤回环节是多人环节,并且其他人都没有办理完成],暂不支持!");
        }
        else {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"[如果撤回环节是多人环节,并且其他人都没有办理完成],状态再次验证失败.");
        }
    }

    private SimplePO recallTaskActionEnable(JB4DCSession jb4DCSession, String userId, String organId, String extaskId, FlowInstanceRuntimePO flowInstanceRuntimePO) throws JBuild4DCGenerallyException, XMLStreamException, JAXBException, IOException {
        SimplePO simplePO = new SimplePO();
        try {
            simplePO.setSuccess(true);
            simplePO.setStringValue("enable");
            simplePO.setMessage("");

            String instRuProcInstId = flowInstanceRuntimePO.getInstanceEntity().getInstRuProcInstId();
            ExecutionTaskEntity recallFromExecutionTaskEntity = flowInstanceRuntimePO.getExecutionTaskEntity();
            if (flowEngineInstanceIntegratedService.instanceIsComplete(jb4DCSession, instRuProcInstId)) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, "该流程实例已经办结,无法撤回!");
            }

            //撤销任务所在的环节Key
            String recallFromExecutionTaskAtNodeKey = recallFromExecutionTaskEntity.getExtaskCurNodeKey();

            BpmnDefinitions bpmnDefinitions = flowInstanceRuntimePO.getBpmnDefinitions();
            BpmnUserTask bpmnUserTask = bpmnDefinitions.getBpmnProcess().getUserTaskList().stream().filter(item -> item.getId().equals(recallFromExecutionTaskAtNodeKey)).findFirst().get();
            //在流程设计中被设置为不可撤回
            if(StringUtility.isNotEmpty(bpmnUserTask.getJb4dcRecallEnable())&&bpmnUserTask.getJb4dcRecallEnable().equals("false")){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, "当前环节被设置为不可撤回!");
            }

            //如果当前流程所处的环节与撤销任务的环节相同或者为下一个连线环节,则允许撤销.
            //BpmnDefinitions bpmnDefinitions = modelIntegratedExtendService.getDeployedCamundaModelBpmnDefinitions(jb4DCSession, recallFromExecutionTaskEntity.getExtaskRuProcDefId());
            List<String> currentActivityNodeIds = flowEngineExecutionIntegratedService.getCurrentActivityNodeIds(jb4DCSession, recallFromExecutionTaskEntity.getExtaskRuProcInstId(),true);
            //BpmnUserTask bpmnUserTask=bpmnDefinitions.getBpmnProcess().getUserTaskList().stream().filter(item->item.getId().equals(recallFromExecutionTaskAtNodeKey)).findFirst().get();

            if (currentActivityNodeIds.stream().anyMatch(item -> item.equals(recallFromExecutionTaskAtNodeKey))) {
                //如果当前流程所处的环节与撤销任务的环节相同,则允许撤销.
                return simplePO;
            }

            //如果当前流程所处的环节不是撤销环节的下一个环节,则不允许撤销.
            List<ExecutionTaskEntity> processingTaskList = executionTaskExtendService.getByInstanceIdAndStatus(jb4DCSession, recallFromExecutionTaskEntity.getExtaskInstId(), WorkFlowEnum.ExTask_Status_Processing);
            //boolean innerRecallEnable=true;
            for (ExecutionTaskEntity executionTaskEntity : processingTaskList) {
                if (!recallFromExecutionTaskAtNodeKey.equals(executionTaskEntity.getExtaskPreNodeKey())) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, "接收人已经办理了该件,无法撤回!");
                }
            }

            //boolean nextTaskIsSendFromMe=executionTaskExtendService.instanceProcessingTaskIsSendFromMe(jb4DCSession,extaskId);
            //if(nextTaskIsSendFromMe){

            //}

            /*if(executionTaskExtendService.instanceProcessingTaskIsSendFromMe(jb4DCSession,extaskId)){
                simplePO.setSuccess(true);
                simplePO.setStringValue("enable");
                simplePO.setMessage("");
            }
            else{
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"接收人已经办理了该件,无法撤回!");
            }*/
            if (recallFromExecutionTaskEntity.getExtaskRuTaskId().equals("Start")) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, "无法执行撤回!");
            }
            //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"未知情况,无法执行撤回!");
            return simplePO;
        } catch (Exception ex) {
            simplePO.setSuccess(false);
            simplePO.setStringValue("disable");
            simplePO.setMessage(ex.getMessage());
            return simplePO;
        }
    }


    @Override
    public FlowInstanceRuntimePO getInstanceRuntimePOByInstanceId(JB4DCSession jb4DCSession, String instanceId) throws JBuild4DCGenerallyException, JAXBException, IOException, XMLStreamException {
        FlowInstanceRuntimePO result = new FlowInstanceRuntimePO();
        InstanceEntity instanceEntity = getByPrimaryKey(jb4DCSession, instanceId);
        ModelIntegratedEntity modelIntegratedEntity=modelIntegratedExtendService.getByPrimaryKey(jb4DCSession,instanceEntity.getInstModId());
        List<ExecutionTaskEntity> executionTaskEntityList=executionTaskExtendService.getByInstanceId(jb4DCSession,instanceEntity.getInstId());
        buildFlowModelRuntimePOBaseInfo(jb4DCSession, result, instanceEntity.getInstModId(), false, instanceEntity.getInstRuProcDefId(), "", instanceEntity, null,executionTaskEntityList,modelIntegratedEntity);
        return result;
    }

    @Override
    @Transactional(rollbackFor = {JBuild4DCGenerallyException.class})
    public FlowInstanceRuntimePO updateInstanceToVersion(JB4DCSession jb4DCSession, String instanceId, String processDefinitionId) throws JBuild4DCGenerallyException {
        try {
            InstanceEntity instanceEntity = getByPrimaryKey(jb4DCSession, instanceId);
            ModelIntegratedEntity modelIntegratedEntity=modelIntegratedExtendService.getLastDeployedPOByDefinitionId(jb4DCSession,processDefinitionId);
            flowEngineInstanceIntegratedService.updateToVersion(instanceEntity.getInstRuProcDefId(), processDefinitionId, instanceEntity.getInstRuProcInstId());

            instanceEntity.setInstModId(modelIntegratedEntity.getModelId());
            instanceEntity.setInstRuProcDefId(processDefinitionId);
            this.updateByKeySelective(jb4DCSession,instanceEntity);

            List<ExecutionTaskEntity> executionTaskEntityList=executionTaskExtendService.getByInstanceId(jb4DCSession,instanceId);
            for (ExecutionTaskEntity executionTaskEntity : executionTaskEntityList) {
                executionTaskEntity.setExtaskModelId(modelIntegratedEntity.getModelId());
                executionTaskEntity.setExtaskRuProcDefId(processDefinitionId);
                executionTaskExtendService.updateByKeySelective(jb4DCSession,executionTaskEntity);
            }
            return getInstanceRuntimePOByInstanceId(jb4DCSession, instanceId);
        } catch (Exception ex) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, ex);
        }
    }

    @Override
    public TaskActionResult completeTaskEnable(JB4DCSession jb4DCSession, boolean isStartInstanceStatus, String modelId, String modelReKey, String currentTaskId, String currentNodeKey, String currentNodeName, String actionCode, Map<String, Object> vars, List<ClientSelectedReceiver> clientSelectedReceiverList, String businessKey, String instanceTitle, String instanceDesc) {
        TaskActionResult completeTaskResult = new TaskActionResult();
        completeTaskResult.setSuccess(true);
        completeTaskResult.setMessage("允许该操作");
        try {

            if(isStartInstanceStatus){

            }
            else{
                ExecutionTaskEntity currentExecutionTaskEntity = executionTaskExtendService.getByPrimaryKey(jb4DCSession, currentTaskId);
                //BpmnDefinitions bpmnDefinitions = modelIntegratedExtendService.getDeployedCamundaModelBpmnDefinitions(jb4DCSession,currentExecutionTaskEntity.getExtaskRuProcDefId());
                InstanceEntity instanceEntity = getByPrimaryKey(jb4DCSession, currentExecutionTaskEntity.getExtaskInstId());
                ProcessDefinition processDefinition = flowEngineModelIntegratedService.getDeployedCamundaModel(jb4DCSession, instanceEntity.getInstRuProcDefId());
                List<FlowNode> nextPossibleFlowNodeList = CamundaBpmnUtility.getNextPossibleFlowNodeWithActionVars(processDefinition, currentNodeKey, vars);

                if(nextPossibleFlowNodeList!=null&&nextPossibleFlowNodeList.size()==1&&CamundaBpmnUtility.isEndEventFlowNode(nextPossibleFlowNodeList.get(0))){
                    //resolveNextPossibleFlowNodePO.setNextTaskIsEndEvent(true);
                }
                else {
                    //ExecutionTaskEntity currentExecutionTaskEntity = executionTaskExtendService.getByPrimaryKey(jb4DCSession, currentTaskId);
                    //BpmnDefinitions bpmnDefinitions = modelIntegratedExtendService.getDeployedCamundaModelBpmnDefinitions(jb4DCSession,currentExecutionTaskEntity.getExtaskRuProcDefId());
                    FlowNode flowNode=CamundaBpmnUtility.getFlowNodeById(instanceEntity.getInstRuProcDefId(),currentNodeKey);

                    //多实例环节的最后一人必须设置接收用户
                    if(flowEngineExecutionIntegratedService.isMultiInstance(jb4DCSession,currentExecutionTaskEntity.getExtaskRuExecutionId())){
                        int multiCountEngInstances=flowEngineExecutionIntegratedService.multiCountEngInstances(jb4DCSession,currentExecutionTaskEntity.getExtaskRuExecutionId());
                        int multiCompletedInstances=flowEngineExecutionIntegratedService.multiCompletedInstances(jb4DCSession,currentExecutionTaskEntity.getExtaskRuExecutionId());
                        if(((multiCompletedInstances+1)==multiCountEngInstances)&&(clientSelectedReceiverList==null||clientSelectedReceiverList.size()==0)) {
                            completeTaskResult.setSuccess(false);
                            completeTaskResult.setMessage("必须设置接收用户!");
                        }
                    }
                    else{
                        if (clientSelectedReceiverList.size()==0){
                            completeTaskResult.setSuccess(false);
                            completeTaskResult.setMessage("至少需要设置一个接收用户!");
                        }
                    }
                }
            }

            return completeTaskResult;
        }
        catch (Exception ex){
            completeTaskResult.setSuccess(false);
            completeTaskResult.setMessage(ex.getMessage());
            return completeTaskResult;
        }
    }


}