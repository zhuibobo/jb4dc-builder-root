package com.jb4dc.workflow.client.service.impl;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.aspect.CalculationRunTime;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.client.remote.ApiItemRuntimeRemote;
import com.jb4dc.builder.client.service.webform.IWebFormDataSaveRuntimeService;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.BaseUtility;
import com.jb4dc.core.base.tools.ClassUtility;
import com.jb4dc.core.base.tools.DateUtility;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.client.action.api.ActionApiPO;
import com.jb4dc.workflow.client.action.api.ActionApiPara;
import com.jb4dc.workflow.client.action.api.ActionApiRunResult;
import com.jb4dc.workflow.client.action.api.IActionApi;
import com.jb4dc.workflow.client.remote.FlowInstanceIntegratedRuntimeRemote;
import com.jb4dc.workflow.client.service.IWorkFlowInstanceRuntimeService;
import com.jb4dc.workflow.dbentities.ExecutionTaskOpinionEntity;
import com.jb4dc.workflow.po.*;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;
import com.jb4dc.workflow.po.bpmn.process.Jb4dcAction;
import com.jb4dc.workflow.po.bpmn.process.Jb4dcActions;
import com.jb4dc.workflow.po.receive.ClientSelectedReceiver;
import com.jb4dc.workflow.searchmodel.ExecutionTaskSearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WorkFlowInstanceRuntimeServiceImpl extends WorkFlowRuntimeServiceImpl implements IWorkFlowInstanceRuntimeService {

    @Autowired
    FlowInstanceIntegratedRuntimeRemote flowInstanceIntegratedRuntimeRemote;

    @Qualifier("com.jb4dc.builder.client.remote.ApiItemRuntimeRemote")
    @Autowired
    ApiItemRuntimeRemote apiItemRuntimeRemote;

    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;

    @Autowired
    IWebFormDataSaveRuntimeService webFormDataSaveRuntimeService;

    //@Autowired
    //FlowInstanceIntegratedRuntimeRemote flowInstanceIntegratedRuntimeRemote;

    @Override
    public JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithStart(JB4DCSession jb4DCSession,String userId,String organId, String modelKey) throws IOException, JBuild4DCGenerallyException {
        FlowInstanceRuntimePO flowInstanceRuntimePO = flowInstanceIntegratedRuntimeRemote.getRuntimeModelWithStart(userId,organId, modelKey).getData();
        Jb4dcActions jb4dcActions = resolveFlowInstanceRuntimePOConfigToActions(JB4DCSessionUtility.getSession(), flowInstanceRuntimePO, null);
        flowInstanceRuntimePO.setJb4dcActions(jb4dcActions);
        String cacheKey = saveFlowInstanceRuntimePOToCache(flowInstanceRuntimePO);
        return JBuild4DCResponseVo.getDataSuccess(flowInstanceRuntimePO, cacheKey);
        //return null;
    }

    @Override
    public JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithProcess(JB4DCSession session, String userId, String organId, String extaskId) throws IOException, JBuild4DCGenerallyException {
        FlowInstanceRuntimePO flowInstanceRuntimePO = flowInstanceIntegratedRuntimeRemote.getRuntimeModelWithProcessTask(userId, organId, extaskId).getData();
        Jb4dcActions jb4dcActions = resolveFlowInstanceRuntimePOConfigToActions(JB4DCSessionUtility.getSession(), flowInstanceRuntimePO, null);
        flowInstanceRuntimePO.setJb4dcActions(jb4dcActions);
        String cacheKey = saveFlowInstanceRuntimePOToCache(flowInstanceRuntimePO);
        return JBuild4DCResponseVo.getDataSuccess(flowInstanceRuntimePO, cacheKey);
    }

    @Override
    public JBuild4DCResponseVo<FlowInstanceRuntimePO> getRuntimeModelWithMyEndProcess(JB4DCSession session, String userId, String organId, String extaskId) throws IOException, JBuild4DCGenerallyException {
        FlowInstanceRuntimePO flowInstanceRuntimePO = flowInstanceIntegratedRuntimeRemote.getRuntimeModelWithEndTask(userId, organId, extaskId).getData();
        flowInstanceRuntimePO.setJb4dcActions(flowInstanceRuntimePO.getMyEndTaskActions());
        String cacheKey = saveFlowInstanceRuntimePOToCache(flowInstanceRuntimePO);
        return JBuild4DCResponseVo.getDataSuccess(flowInstanceRuntimePO, cacheKey);
    }


    @Override
    public JBuild4DCResponseVo<ResolveNextPossibleFlowNodePO> resolveNextPossibleFlowNode(JB4DCSession jb4DCSession,
                                                                           String currentTaskId,String currentNodeKey,String currentNodeName,String actionCode,
                                                                           String flowInstanceRuntimePOCacheKey,
                                                                           FormRecordComplexPO formRecordComplexPO,
                                                                           Map<String, Object> exVars) throws IOException, JBuild4DCGenerallyException {

        FlowInstanceRuntimePO flowInstanceRuntimePO = getFlowInstanceRuntimePOFromCache(flowInstanceRuntimePOCacheKey);

        /*Map<String, Object> formParams = new HashMap<>();
        formParams.put("userId", jb4DCSession.getUserId());
        formParams.put("organId", jb4DCSession.getOrganId());
        formParams.put("modelKey", flowInstanceRuntimePO.getModelReKey());
        formParams.put("currentNodeKey", currentNodeKey);
        formParams.put("currentNodeName", currentNodeName);
        formParams.put("actionCode", actionCode);
        formParams.put("currentTaskId",currentTaskId);*/

        RequestResolveNextPossibleFlowNodePO resolveNextPossibleFlowNodePO=new RequestResolveNextPossibleFlowNodePO();
        resolveNextPossibleFlowNodePO.setActionCode(actionCode);
        resolveNextPossibleFlowNodePO.setCurrentTaskId(currentTaskId);
        resolveNextPossibleFlowNodePO.setModelReKey(flowInstanceRuntimePO.getModelReKey());
        resolveNextPossibleFlowNodePO.setCurrentNodeKey(currentNodeKey);
        resolveNextPossibleFlowNodePO.setCurrentNodeName(currentNodeName);
        resolveNextPossibleFlowNodePO.setUserId(jb4DCSession.getUserId());
        resolveNextPossibleFlowNodePO.setOrganId(jb4DCSession.getOrganId());


        Map<String, Object> vars = parseDefaultFlowInstanceRuntimePOToJuelVars(jb4DCSession, flowInstanceRuntimePO, formRecordComplexPO,flowInstanceRuntimePO.getCurrentNodeKey(),actionCode);
        if (exVars != null && exVars.size() > 0) {
            vars.putAll(exVars);
        }
        //formParams.put("varsJsonString", JsonUtility.toObjectString(vars));
        //formParams.put("varsJsonString", "11");

        resolveNextPossibleFlowNodePO.setVarsJsonString(JsonUtility.toObjectString(vars));

        JBuild4DCResponseVo<ResolveNextPossibleFlowNodePO> result = flowInstanceIntegratedRuntimeRemote.resolveNextPossibleFlowNode(resolveNextPossibleFlowNodePO);
        return result;
    }

    @Override
    @Transactional(rollbackFor = {JBuild4DCGenerallyException.class, JBuild4DCSQLKeyWordException.class, IOException.class})
    @CalculationRunTime(note = "执行保存数据的解析")
    public TaskActionResult completeTask(JB4DCSession jb4DCSession,
                                         boolean isStartInstanceStatus, String instanceId,
                                         String modelId, String modelReKey, String currentTaskId,
                                         String currentNodeKey,
                                         String currentNodeName,
                                         String actionCode,
                                         String flowInstanceRuntimePOCacheKey,
                                         FormRecordComplexPO formRecordComplexPO,
                                         List<ClientSelectedReceiver> clientSelectedReceiverList,
                                         String businessKey, Map<String, Object> exVars, List<ExecutionTaskOpinionEntity> newOpinionEntityList) throws IOException, JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException {


        TaskActionResult completeTaskResult = new TaskActionResult();
        FlowInstanceRuntimePO flowInstanceRuntimePO = getFlowInstanceRuntimePOFromCache(flowInstanceRuntimePOCacheKey);

        if (exVars == null) {
            exVars = new HashMap<>();
        }
        Map<String, Object> vars = parseDefaultFlowInstanceRuntimePOToJuelVars(jb4DCSession, flowInstanceRuntimePO, formRecordComplexPO, currentNodeKey, actionCode);
        if (exVars != null && exVars.size() > 0) {
            vars.putAll(exVars);
        }

        Jb4dcAction jb4dcAction = BpmnDefinitions.findAction(flowInstanceRuntimePO.getBpmnDefinitions(), currentNodeKey, actionCode);
        List<ActionApiPO> actionApiPOList = ActionApiPO.parseToPoListAndLoadApiEntity(apiItemRuntimeRemote, jb4dcAction.getActionCallApis());
        List<ActionApiPO> beforeApiList = actionApiPOList.stream().filter(item -> item.getRunAt().equals(ActionApiPO.BeforeName)).collect(Collectors.toList());
        List<ActionApiPO> afterApiList = actionApiPOList.stream().filter(item -> item.getRunAt().equals(ActionApiPO.AfterName)).collect(Collectors.toList());

        //生成流程实例标题
        String instanceTitle = buildJuelExpression(jb4DCSession, flowInstanceRuntimePO.getJb4dcProcessTitleEditValue(), vars);
        if(StringUtility.isEmpty(instanceTitle)){
            instanceTitle="【"+flowInstanceRuntimePO.getModelName()+"】-新建流程实例-"+ DateUtility.getDate_yyyy_MM_dd_HH_mm_ss()+" 操作人:"+jb4DCSession.getUserName();
        }
        String instanceDesc = buildJuelExpression(jb4DCSession, flowInstanceRuntimePO.getJb4dcProcessDescriptionEditValue(), vars);

        //构建驱动流程变量
        Map<String, String> formParams = new HashMap<>();
        formParams.put("isStartInstanceStatus", isStartInstanceStatus ? "true" : "false");
        formParams.put("instanceId",instanceId);
        formParams.put("userId", jb4DCSession.getUserId());
        formParams.put("organId", jb4DCSession.getOrganId());
        formParams.put("currentNodeKey", currentNodeKey);
        formParams.put("currentNodeName", currentNodeName);
        formParams.put("actionCode", actionCode);
        formParams.put("selectedReceiverVars", JsonUtility.toObjectString(clientSelectedReceiverList));
        formParams.put("businessKey", businessKey);
        formParams.put("modelId", modelId);
        formParams.put("modelReKey", modelReKey);
        formParams.put("currentTaskId", currentTaskId);
        formParams.put("instanceTitle", instanceTitle);
        formParams.put("instanceDesc", instanceDesc);

        formParams.put("varsJsonString", JsonUtility.toObjectString(vars));
        //构建驱动流程变量
        RequestCompleteTaskPO requestCompleteTaskPO=new RequestCompleteTaskPO();
        requestCompleteTaskPO.setStartInstanceStatus(isStartInstanceStatus);
        requestCompleteTaskPO.setSelectedReceiverVars(JsonUtility.toObjectString(clientSelectedReceiverList));
        requestCompleteTaskPO.setVarsJsonString(JsonUtility.toObjectString(vars));
        requestCompleteTaskPO.setActionCode(actionCode);
        requestCompleteTaskPO.setCurrentTaskId(currentTaskId);
        requestCompleteTaskPO.setModelReKey(modelReKey);
        requestCompleteTaskPO.setCurrentNodeKey(currentNodeKey);
        requestCompleteTaskPO.setCurrentNodeName(currentNodeName);
        requestCompleteTaskPO.setUserId(jb4DCSession.getUserId());
        requestCompleteTaskPO.setOrganId(jb4DCSession.getOrganId());
        requestCompleteTaskPO.setInstanceId(instanceId);
        requestCompleteTaskPO.setModelId(modelId);
        requestCompleteTaskPO.setBusinessKey(businessKey);
        requestCompleteTaskPO.setInstanceTitle(instanceTitle);
        requestCompleteTaskPO.setInstanceDesc(instanceDesc);
        requestCompleteTaskPO.setFormRecordComplexPO(formRecordComplexPO);
        requestCompleteTaskPO.setNewOpinionEntityList(newOpinionEntityList);

        //校验能否调用服务端completeTask方法
        JBuild4DCResponseVo<String> completeTaskEnableVo = flowInstanceIntegratedRuntimeRemote.completeTaskEnable(requestCompleteTaskPO);

        if (completeTaskEnableVo.isSuccess()) {
            //调用前置API
            for (ActionApiPO actionApiPO : beforeApiList) {
                ActionApiRunResult actionApiRunResult = this.rubApi(jb4DCSession, actionApiPO, isStartInstanceStatus, currentNodeKey, currentNodeName, actionCode, flowInstanceRuntimePOCacheKey, formRecordComplexPO, clientSelectedReceiverList, businessKey);
            }

            //执行数据保存
            webFormDataSaveRuntimeService.saveFormRecordComplexPO(jb4DCSession, businessKey, formRecordComplexPO, isStartInstanceStatus ? BaseUtility.getAddOperationName() : BaseUtility.getUpdateOperationName());

            //调用后置API
            for (ActionApiPO actionApiPO : afterApiList) {
                ActionApiRunResult actionApiRunResult = this.rubApi(jb4DCSession, actionApiPO, isStartInstanceStatus, currentNodeKey, currentNodeName, actionCode, flowInstanceRuntimePOCacheKey, formRecordComplexPO, clientSelectedReceiverList, businessKey);
            }

            //驱动流程变量
            JBuild4DCResponseVo<String> jBuild4DCResponseVo = flowInstanceIntegratedRuntimeRemote.completeTask(requestCompleteTaskPO);
            if (!jBuild4DCResponseVo.isSuccess()) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, jBuild4DCResponseVo.getMessage());
            }
            //移除缓存

            completeTaskResult.setSuccess(true);
            completeTaskResult.setMessage("操作成功");
            return completeTaskResult;
        } else {
            completeTaskResult.setMessage("completeTaskEnable验证失败:"+completeTaskEnableVo.getMessage());
            completeTaskResult.setSuccess(false);
            return completeTaskResult;
        }
    }

    @Override
    public JBuild4DCResponseVo<PageInfo<ExecutionTaskPO>> getMyProcessTaskList(JB4DCSession jb4DCSession, int pageNum, int pageSize, String modelCategory, String extaskType) throws JBuild4DCGenerallyException {
        return flowInstanceIntegratedRuntimeRemote.getMyProcessTaskList(pageNum,pageSize, jb4DCSession.getUserId(),jb4DCSession.getOrganId(), JBuild4DCYaml.getLinkId(),modelCategory,extaskType);
    }

    @Override
    public JBuild4DCResponseVo<PageInfo<ExecutionTaskPO>> getMyProcessEndTaskList(JB4DCSession jb4DCSession, ExecutionTaskSearchModel executionTaskSearchModel) throws JBuild4DCGenerallyException {
        executionTaskSearchModel.setLinkId(JBuild4DCYaml.getLinkId());
        return flowInstanceIntegratedRuntimeRemote.getMyProcessEndTaskList(executionTaskSearchModel);
    }

    @Override
    public JBuild4DCResponseVo<PageInfo<ExecutionTaskPO>> getMyInstanceCompletedList(JB4DCSession session, ExecutionTaskSearchModel executionTaskSearchModel) throws JBuild4DCGenerallyException {
        executionTaskSearchModel.setLinkId(JBuild4DCYaml.getLinkId());
        return flowInstanceIntegratedRuntimeRemote.getMyInstanceCompletedList(executionTaskSearchModel);
    }

    /*@Override
    public JBuild4DCResponseVo<SimplePO> recallMySendTaskEnable(JB4DCSession session, String userId, String organId, String extaskId) throws JBuild4DCGenerallyException {
        return flowInstanceIntegratedRuntimeRemote.recallMySendTaskEnable(userId,organId,extaskId);
    }*/

    @Override
    public JBuild4DCResponseVo recallMySendTask(JB4DCSession session, String userId, String organId, String extaskId) throws JBuild4DCGenerallyException {
        return flowInstanceIntegratedRuntimeRemote.recallMySendTask(userId,organId,extaskId);
    }

    @Override
    public JBuild4DCResponseVo changeTaskToView(String extaskId) throws JBuild4DCGenerallyException {
        return flowInstanceIntegratedRuntimeRemote.changeTaskToView(extaskId);
    }

    protected ActionApiRunResult rubApi(JB4DCSession jb4DCSession, ActionApiPO actionApiPO,
                                        boolean isStartInstanceStatus, String currentNodeKey,
                                        String currentNodeName, String actionCode,
                                        String flowInstanceRuntimePOCacheKey, FormRecordComplexPO formRecordComplexPO,
                                        List<ClientSelectedReceiver> clientSelectedReceiverList, String businessKey) throws JBuild4DCGenerallyException {
        try {
            ApiItemEntity apiItemEntity = actionApiPO.getApiItemEntity();

            ActionApiPara apiRunPara = new ActionApiPara();

            String className = apiItemEntity.getApiItemClassName();
            IActionApi actionApi = (IActionApi) ClassUtility.loadClass(className).newInstance();
            autowireCapableBeanFactory.autowireBean(actionApi);
            return actionApi.runApi(apiRunPara);
        } catch (IllegalAccessException e) {
            throw new JBuild4DCGenerallyException(e.hashCode(), e.getMessage(), e, e.getStackTrace());
        } catch (InstantiationException e) {
            throw new JBuild4DCGenerallyException(e.hashCode(), e.getMessage(), e, e.getStackTrace());
        }
    }
}
