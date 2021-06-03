package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.tools.URLUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.workflow.dao.InstanceMapper;
import com.jb4dc.workflow.dbentities.ExecutionTaskEntity;
import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.exenum.ModelTenantIdEnum;
import com.jb4dc.workflow.integrate.engine.IFlowEngineInstanceIntegratedService;
import com.jb4dc.workflow.integrate.engine.IFlowEngineModelIntegratedService;
import com.jb4dc.workflow.integrate.engine.IFlowEngineTaskIntegratedService;
import com.jb4dc.workflow.integrate.engine.utility.CamundaBpmnUtility;
import com.jb4dc.workflow.integrate.extend.IExecutionTaskExtendService;
import com.jb4dc.workflow.integrate.extend.IInstanceExtendService;
import com.jb4dc.workflow.integrate.extend.IModelIntegratedExtendService;
import com.jb4dc.workflow.integrate.extend.IReceiverRuntimeResolve;
import com.jb4dc.workflow.po.CompleteTaskResult;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import com.jb4dc.workflow.po.FlowModelIntegratedPO;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;
import com.jb4dc.workflow.po.bpmn.process.*;
import com.jb4dc.workflow.po.receive.ClientSelectedReceiver;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.model.bpmn.instance.Activity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InstanceExtendServiceImpl extends BaseServiceImpl<InstanceEntity> implements IInstanceExtendService
{
    @Autowired
    IFlowEngineModelIntegratedService flowEngineModelIntegratedService;

    @Autowired
    IFlowEngineInstanceIntegratedService flowEngineInstanceIntegratedService;

    @Autowired
    IModelIntegratedExtendService modelIntegratedExtendService;

    @Autowired
    IFlowEngineTaskIntegratedService flowEngineTaskIntegratedService;

    @Autowired
    IReceiverRuntimeResolve receiverRuntimeResolve;

    @Autowired
    IExecutionTaskExtendService executionTaskExtendService;

    InstanceMapper instanceMapper;
    public InstanceExtendServiceImpl(InstanceMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        instanceMapper=_defaultBaseMapper;
    }

    public static String Status_Name_Running="Running";
    public static String Status_Name_End="End";
    public static String Status_Name_Draft="Draft";
    public static String Status_Name_Suspended="Suspended";

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

    @Override
    public List<BpmnTask> resolveNextPossibleFlowNode(JB4DCSession jb4DCSession, String modelKey,String instanceId, String currentNodeKey, String actionCode, Map<String, Object> vars) throws IOException, JAXBException, XMLStreamException, JBuild4DCGenerallyException {

        //vars = appendFlowDefaultVar(vars, currentNodeKey, actionCode);
        List<Activity> userTaskFlowNodeList = CamundaBpmnUtility.getNextPossibleFlowNodeWithActionVars(modelKey,currentNodeKey, vars);

        if (userTaskFlowNodeList != null && userTaskFlowNodeList.size() > 0) {
            List<String> bpmnTaskFlowNodeIdList = userTaskFlowNodeList.stream().map(item -> item.getId()).collect(Collectors.toList());
            BpmnDefinitions bpmnDefinitions = modelIntegratedExtendService.getDeployedCamundaModelBpmnDefinitionsLastVersion(jb4DCSession, modelKey);
            List<BpmnTask> bpmnTaskFlowNodeList = modelIntegratedExtendService.getLastDeployedCamundaModelBpmnFlowNodeByIdList(jb4DCSession, modelKey, bpmnDefinitions, bpmnTaskFlowNodeIdList);

            Jb4dcAction jb4dcAction=BpmnDefinitions.findAction(bpmnDefinitions,currentNodeKey,actionCode);

            bpmnTaskFlowNodeList = receiverRuntimeResolve.resolveToActualUser(jb4DCSession,instanceId, bpmnDefinitions, bpmnTaskFlowNodeList, vars,jb4dcAction);

            return bpmnTaskFlowNodeList;
        }
        return new ArrayList<>();
    }

    @Override
    @Transactional(rollbackFor = {JBuild4DCGenerallyException.class})
    public CompleteTaskResult completeTask(JB4DCSession jb4DCSession, boolean isStartInstanceStatus,
                                           String modelId, String modelReKey, String currentTaskId,
                                           String currentNodeKey, String currentNodeName, String actionCode,
                                           Map<String, Object> vars, List<ClientSelectedReceiver> clientSelectedReceiverList, String businessKey,
                                           String instanceTitle,String instanceDesc) throws JBuild4DCGenerallyException {

        CompleteTaskResult completeTaskResult = new CompleteTaskResult();
        try {
            FlowModelIntegratedPO flowModelIntegratedPO = modelIntegratedExtendService.getPOByIntegratedId(jb4DCSession, modelId);


            BpmnDefinitions bpmnDefinitions = null;

            if (isStartInstanceStatus) {
                bpmnDefinitions = modelIntegratedExtendService.getDeployedCamundaModelBpmnDefinitionsLastVersion(jb4DCSession, flowModelIntegratedPO.getModelReKey());
            } else {

            }

            //处理主送人员
            Map<String, List<ClientSelectedReceiver>> clientSelectedMainReceiverGroupBy = clientSelectedReceiverList.stream().filter(item -> item.getReceiveType().equals(ClientSelectedReceiver.ReceiveType_Main)).collect(Collectors.groupingBy(item -> item.getNextNodeId()));
            for (Map.Entry<String, List<ClientSelectedReceiver>> stringListEntry : clientSelectedMainReceiverGroupBy.entrySet()) {
                BpmnUserTask bpmnUserTask = bpmnDefinitions.getBpmnProcess().getUserTaskList().stream().filter(item -> item.getId().equals(stringListEntry.getKey())).findFirst().get();
                if (bpmnUserTask.isMultiInstanceTask()) {
                    String assigneeVarKey = bpmnUserTask.getMultiInstanceLoopCharacteristics().getCollection().replace("${","").replace("}","");
                    List<String> assigneeList = stringListEntry.getValue().stream().map(item -> item.getReceiverId()).collect(Collectors.toList());
                    vars.put(assigneeVarKey, assigneeList);
                } else {
                    String assigneeVarKey = bpmnUserTask.getAssignee().replace("${","").replace("}","");
                    String assignee = stringListEntry.getValue().get(0).getReceiverId();
                    vars.put(assigneeVarKey, assignee);
                }
            }

            Jb4dcAction jb4dcAction = BpmnDefinitions.findAction(bpmnDefinitions, currentNodeKey, actionCode);

            //处理抄送人员
            Map<String, List<ClientSelectedReceiver>> clientSelectedCCReceiverGroupBy = clientSelectedReceiverList.stream().filter(item -> item.getReceiveType().equals(ClientSelectedReceiver.ReceiveType_CC)).collect(Collectors.groupingBy(item -> item.getNextNodeId()));

            InstanceEntity instanceEntity;
            ExecutionTaskEntity currentExecutionTaskEntity;

            if (isStartInstanceStatus) {
                ProcessInstance processInstance = flowEngineInstanceIntegratedService.startProcessInstanceByKey(flowModelIntegratedPO.getModelReKey(), businessKey, vars);
                //记录扩展的实例数据
                instanceEntity = createNewInstance(jb4DCSession, businessKey, instanceTitle, instanceDesc, flowModelIntegratedPO, processInstance);
                //生成一个初始任务,并设置为办结状态
                currentExecutionTaskEntity = executionTaskExtendService.createFirstExecutionTask(jb4DCSession, instanceEntity, currentNodeKey, currentNodeName, jb4dcAction);
                //currentExecutionTaskEntity;
            } else {
                instanceEntity = getByPrimaryKey(jb4DCSession, currentTaskId);
                currentExecutionTaskEntity = new ExecutionTaskEntity();
            }

            //获取当前任务,并记录到扩展任务中
            List<Task> engineTaskList = flowEngineTaskIntegratedService.getTasks(instanceEntity.getInstRuProcInstId());
            for (int i = 0; i < engineTaskList.size(); i++) {
                Task task = engineTaskList.get(i);
                if (executionTaskExtendService.getByPrimaryKey(jb4DCSession, task.getId()) == null) {
                    ExecutionTaskEntity executionTaskEntity = new ExecutionTaskEntity();
                    executionTaskEntity.setExtaskId(task.getId());
                    executionTaskEntity.setExtaskInstId(instanceEntity.getInstId());
                    executionTaskEntity.setExtaskModelId(instanceEntity.getInstModId());
                    executionTaskEntity.setExtaskRuTaskId(task.getId());
                    executionTaskEntity.setExtaskRuExecutionId(task.getExecutionId());
                    executionTaskEntity.setExtaskRuProcInstId(task.getProcessInstanceId());
                    executionTaskEntity.setExtaskRuProcDefId(task.getProcessDefinitionId());
                    executionTaskEntity.setExtaskPreNodeKey(currentNodeKey);
                    executionTaskEntity.setExtaskPreNodeName(currentNodeName);
                    executionTaskEntity.setExtaskCurNodeKey(task.getTaskDefinitionKey());
                    executionTaskEntity.setExtaskCurNodeName(task.getName());
                    executionTaskEntity.setExtaskType(ExecutionTaskExtendServiceImpl.ExTask_Type_Main);
                    executionTaskEntity.setExtaskStatus(ExecutionTaskExtendServiceImpl.ExTask_Status_Processing);
                    executionTaskEntity.setExtaskSenderId(jb4DCSession.getUserId());
                    executionTaskEntity.setExtaskSenderName(jb4DCSession.getUserName());
                    executionTaskEntity.setExtaskSendTime(new Date());
                    executionTaskEntity.setExtaskReceiverId(task.getAssignee());
                    String receiverName = clientSelectedReceiverList.stream().filter(item -> item.getNextNodeId().equals(task.getTaskDefinitionKey()) && item.getReceiverId().equals((task.getAssignee()))).findFirst().get().getReceiverName();
                    executionTaskEntity.setExtaskReceiverName(receiverName);
                    executionTaskEntity.setExtaskViewEd(TrueFalseEnum.False.getDisplayName());
                    executionTaskEntity.setExtaskStartTime(new Date());
                    executionTaskEntity.setExtaskHandleEd(TrueFalseEnum.False.getDisplayName());
                    executionTaskEntity.setExtaskOrderNum(executionTaskExtendService.getNextOrderNum(jb4DCSession));
                    executionTaskEntity.setExtaskFromTaskId(currentExecutionTaskEntity.getExtaskId());
                    executionTaskEntity.setExtaskFromExecutionId(currentExecutionTaskEntity.getExtaskRuExecutionId());

                    BpmnUserTask bpmnUserTask = bpmnDefinitions.getBpmnProcess().getUserTaskList().stream().filter(item -> item.getId().equals(executionTaskEntity.getExtaskCurNodeKey())).findFirst().get();
                    executionTaskEntity.setExtaskMultiTask(bpmnUserTask.getMultiInstanceType());
                    if (bpmnUserTask.isMultiInstanceTask()) {
                        //1001001,1001002
                        executionTaskEntity.setExtaskIndex(currentExecutionTaskEntity.getExtaskIndex() + 1000 + i);

                    } else {
                        //1002000,1003000
                        executionTaskEntity.setExtaskIndex(currentExecutionTaskEntity.getExtaskIndex() + 1000);
                    }
                    executionTaskExtendService.saveSimple(jb4DCSession, executionTaskEntity.getExtaskId(), executionTaskEntity);
                }
            }

            completeTaskResult.setSuccess(true);
            completeTaskResult.setMessage("操作成功!");
            return completeTaskResult;
        } catch (Exception ex) {

            ex.printStackTrace();
            String traceMsg=org.apache.commons.lang3.exception.ExceptionUtils.getStackTrace(ex);
            completeTaskResult.setSuccess(false);
            completeTaskResult.setMessage(traceMsg);
            return completeTaskResult;
        }
    }


    private InstanceEntity createNewInstance(JB4DCSession jb4DCSession, String businessKey, String instanceTitle, String instanceDesc, FlowModelIntegratedPO flowModelIntegratedPO, ProcessInstance processInstance) throws JBuild4DCGenerallyException {
        InstanceEntity instanceEntity = new InstanceEntity();
        instanceEntity.setInstId(UUIDUtility.getUUID().toString());
        instanceEntity.setInstTitle(instanceTitle);
        instanceEntity.setInstDesc(instanceDesc);
        instanceEntity.setInstCustDesc("无");
        instanceEntity.setInstCreateTime(new Date());
        instanceEntity.setInstCreator(jb4DCSession.getUserName());
        instanceEntity.setInstCreatorId(jb4DCSession.getUserId());
        instanceEntity.setInstOrganName(jb4DCSession.getOrganName());
        instanceEntity.setInstOrganId(jb4DCSession.getOrganId());
        instanceEntity.setInstStatus(Status_Name_Running);
        instanceEntity.setInstRuExecutionId(processInstance.getId());
        instanceEntity.setInstRuProcInstId(processInstance.getId());
        instanceEntity.setInstRuBusinessKey(businessKey);
        instanceEntity.setInstRuProcDefId(processInstance.getProcessDefinitionId());
        instanceEntity.setInstOrderNum(getNextOrderNum(jb4DCSession));
        instanceEntity.setInstModId(flowModelIntegratedPO.getModelId());
        instanceEntity.setInstModCategory(flowModelIntegratedPO.getModelFlowCategory());
        instanceEntity.setInstModModuleId(flowModelIntegratedPO.getModelModuleId());
        instanceEntity.setInstModTenantId(flowModelIntegratedPO.getModelTenantId());
        this.saveSimple(jb4DCSession, instanceEntity.getInstId(), instanceEntity);
        return instanceEntity;
    }

    private void buildFlowModelRuntimePOBaseInfo(JB4DCSession session, FlowInstanceRuntimePO flowInstanceRuntimePO, String modelReKey,
                                                 boolean isStart,String processDefId, String currentNodeKey,InstanceEntity instanceEntity,
                                                 ExecutionTaskEntity executionTaskEntity,ModelIntegratedEntity modelIntegratedEntity) throws JAXBException, XMLStreamException, IOException, JBuild4DCGenerallyException {
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

        if (isStart) {
            //#region
            BpmnStartEvent bpmnStartEvent = bpmnDefinitions.getBpmnProcess().getStartEvent();
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
            }

            //#endregion
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
            } else {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, "从模型中找不到Key为" + currentNodeKey + "的节点!");
            }
        }

        flowInstanceRuntimePO.setModelIntegratedEntity(modelIntegratedEntity);
        flowInstanceRuntimePO.setBpmnDefinitions(bpmnDefinitions);
        flowInstanceRuntimePO.setBpmnXmlContent(URLUtility.encode(modelXml));
    }

    @Override
    public FlowInstanceRuntimePO getRuntimeModelWithStart(JB4DCSession session, String modelKey) throws IOException, JAXBException, XMLStreamException, JBuild4DCGenerallyException {
        FlowInstanceRuntimePO result = new FlowInstanceRuntimePO();
        InstanceEntity instanceEntity=new InstanceEntity();
        instanceEntity.setInstCreateTime(new Date());
        instanceEntity.setInstCreator(session.getUserName());
        instanceEntity.setInstCreatorId(session.getUserId());
        instanceEntity.setInstOrganName(session.getOrganName());
        instanceEntity.setInstOrganId(session.getOrganId());
        ModelIntegratedEntity modelIntegratedEntity=modelIntegratedExtendService.getLastSaveModelIntegratedEntity(session, modelKey);
        buildFlowModelRuntimePOBaseInfo(session, result, modelKey, true, "","",instanceEntity,null,modelIntegratedEntity);
        return result;
    }

    @Override
    public FlowInstanceRuntimePO getRuntimeModelWithProcess(JB4DCSession jb4DCSession, String extaskId) throws JBuild4DCGenerallyException, JAXBException, IOException, XMLStreamException {
        FlowInstanceRuntimePO result = new FlowInstanceRuntimePO();
        ExecutionTaskEntity executionTaskEntity = executionTaskExtendService.getByPrimaryKey(jb4DCSession, extaskId);
        InstanceEntity instanceEntity = getByPrimaryKey(jb4DCSession, executionTaskEntity.getExtaskInstId());
        ModelIntegratedEntity modelIntegratedEntity=modelIntegratedExtendService.getByPrimaryKey(jb4DCSession,instanceEntity.getInstModId());
        buildFlowModelRuntimePOBaseInfo(jb4DCSession, result, instanceEntity.getInstModId(), false, instanceEntity.getInstRuProcDefId(), executionTaskEntity.getExtaskCurNodeKey(), instanceEntity, executionTaskEntity,modelIntegratedEntity);
        return result;
    }
}