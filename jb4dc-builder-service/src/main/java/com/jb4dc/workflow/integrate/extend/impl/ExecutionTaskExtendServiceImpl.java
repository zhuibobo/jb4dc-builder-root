package com.jb4dc.workflow.integrate.extend.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.service.po.SimplePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dao.ExecutionTaskMapper;
import com.jb4dc.workflow.dbentities.ExecutionTaskEntity;
import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.exenum.WorkFlowEnum;
import com.jb4dc.workflow.integrate.engine.IFlowEngineTaskIntegratedService;
import com.jb4dc.workflow.integrate.extend.IExecutionTaskExtendService;
import com.jb4dc.workflow.po.ExecutionTaskPO;
import com.jb4dc.workflow.po.bpmn.process.Jb4dcAction;
import com.jb4dc.workflow.searchmodel.ExecutionTaskSearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.jb4dc.workflow.exenum.WorkFlowEnum.ExTask_Multi_Task_Single;

@Service
public class ExecutionTaskExtendServiceImpl  extends BaseServiceImpl<ExecutionTaskEntity> implements IExecutionTaskExtendService {

    @Autowired
    IFlowEngineTaskIntegratedService flowEngineTaskIntegratedService;

    //public static String Status_Name_Processing="Processing";
    //public static String Status_Name_End="End";

    @Override
    @Transactional(rollbackFor= JBuild4DCGenerallyException.class)
    public void complete(JB4DCSession jb4DCSession, String taskId, Map<String, Object> vars) throws JBuild4DCGenerallyException{
        flowEngineTaskIntegratedService.complete(taskId,vars);
        //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"异常中断");
    }

    @Override
    public List<ExecutionTaskEntity> getByInstanceId(JB4DCSession jb4DCSession, String instId) {
        return executionTaskMapper.selectByInstanceId(instId);
    }

    @Override
    public List<ExecutionTaskEntity> getByInstanceIdAndStatus(JB4DCSession jb4DCSession, String instId, String status) throws JBuild4DCGenerallyException {
        return executionTaskMapper.selectByInstanceIdAndStatus(instId,status);
    }

    @Override
    public ExecutionTaskEntity createStartEventExecutionTask(JB4DCSession jb4DCSession, InstanceEntity instanceEntity, String currentNodeKey, String currentNodeName, Jb4dcAction jb4dcAction) throws JBuild4DCGenerallyException {
        ExecutionTaskEntity firstExecutionTaskEntity = new ExecutionTaskEntity();
        firstExecutionTaskEntity.setExtaskId(instanceEntity.getInstId());
        firstExecutionTaskEntity.setExtaskInstId(instanceEntity.getInstId());
        firstExecutionTaskEntity.setExtaskModelId(instanceEntity.getInstModId());
        firstExecutionTaskEntity.setExtaskRuTaskId("Start");
        firstExecutionTaskEntity.setExtaskRuExecutionId(instanceEntity.getInstRuExecutionId());
        firstExecutionTaskEntity.setExtaskRuProcInstId(instanceEntity.getInstRuProcInstId());
        firstExecutionTaskEntity.setExtaskRuProcDefId(instanceEntity.getInstRuProcDefId());
        firstExecutionTaskEntity.setExtaskPreNodeKey("Start");
        firstExecutionTaskEntity.setExtaskPreNodeName("启动流程");
        firstExecutionTaskEntity.setExtaskCurNodeKey(currentNodeKey);
        firstExecutionTaskEntity.setExtaskCurNodeName(currentNodeName);
        firstExecutionTaskEntity.setExtaskType(WorkFlowEnum.ExTask_Type_Main);
        firstExecutionTaskEntity.setExtaskStatus(WorkFlowEnum.ExTask_Status_End);
        firstExecutionTaskEntity.setExtaskSenderId(jb4DCSession.getUserId());
        firstExecutionTaskEntity.setExtaskSenderName(jb4DCSession.getUserName());
        firstExecutionTaskEntity.setExtaskSendTime(new Date());
        firstExecutionTaskEntity.setExtaskReceiverId(jb4DCSession.getUserId());
        firstExecutionTaskEntity.setExtaskReceiverName(jb4DCSession.getUserName());
        firstExecutionTaskEntity.setExtaskViewEd(TrueFalseEnum.True.getDisplayName());
        firstExecutionTaskEntity.setExtaskViewTime(new Date());
        firstExecutionTaskEntity.setExtaskStartTime(new Date());
        firstExecutionTaskEntity.setExtaskEndTime(new Date());
        firstExecutionTaskEntity.setExtaskHandleEd(TrueFalseEnum.True.getDisplayName());
        firstExecutionTaskEntity.setExtaskHandleActionKey(jb4dcAction.getActionCode());
        firstExecutionTaskEntity.setExtaskHandleActionName(jb4dcAction.getActionCaption());
        firstExecutionTaskEntity.setExtaskOrderNum(executionTaskMapper.nextOrderNum());
        firstExecutionTaskEntity.setExtaskFromTaskId("Start");
        firstExecutionTaskEntity.setExtaskFromExecutionId("Start");
        firstExecutionTaskEntity.setExtaskIndex(getNextExtaskIndexByInstanceId(jb4DCSession,instanceEntity.getInstId()));
        firstExecutionTaskEntity.setExtaskMultiTask(ExTask_Multi_Task_Single);
        firstExecutionTaskEntity.setExtaskHandlerId(jb4DCSession.getUserId());
        firstExecutionTaskEntity.setExtaskHandlerName(jb4DCSession.getUserName());
        firstExecutionTaskEntity.setExtaskHandlerType(WorkFlowEnum.ExTask_Handler_Type_Self);
        firstExecutionTaskEntity.setExtaskCreateBy(WorkFlowEnum.ExTask_Create_By_Initial);
        saveSimple(jb4DCSession, firstExecutionTaskEntity.getExtaskId(), firstExecutionTaskEntity);
        return firstExecutionTaskEntity;
    }

    @Override
    public PageInfo<ExecutionTaskPO> getMyProcessTaskList(JB4DCSession jb4DCSession, int pageNum, int pageSize, String userId, String organId, String linkId, String modelCategory, String extaskType) {
        PageHelper.startPage(pageNum, pageSize);
        List<ExecutionTaskPO> list = executionTaskMapper.selectMyProcessTask(userId,linkId,modelCategory,extaskType);
        PageInfo<ExecutionTaskPO> pageInfo = new PageInfo(list);
        return pageInfo;
    }

    @Override
    public PageInfo<ExecutionTaskPO> getMyProcessEndTaskList(JB4DCSession jb4DCSession, ExecutionTaskSearchModel executionTaskSearchModel) {
        PageHelper.startPage(executionTaskSearchModel.getPageNum(), executionTaskSearchModel.getPageSize());
        executionTaskSearchModel.setJb4DCSession(jb4DCSession);
        List<ExecutionTaskPO> list = executionTaskMapper.selectMyProcessEndTask(executionTaskSearchModel);
        PageInfo<ExecutionTaskPO> pageInfo = new PageInfo(list);
        return pageInfo;
    }

    @Override
    public List<ExecutionTaskEntity> getActiveTaskByInstanceIds(JB4DCSession jb4DCSession, List<InstanceEntity> listEntity) {
        List<String> instanceIds=listEntity.stream().map(item->item.getInstId()).collect(Collectors.toList());
        List<ExecutionTaskEntity> executionTaskEntityList=new ArrayList<>();
        if(instanceIds.size()>0) {
            executionTaskEntityList = executionTaskMapper.selectListByInstanceAndStatus(instanceIds, IExecutionTaskExtendService.exTaskStatus_Processing);
        }
        return executionTaskEntityList;
    }

    @Override
    public boolean instanceProcessingTaskIsSendFromMe(JB4DCSession session, String extaskId) throws JBuild4DCGenerallyException {
        ExecutionTaskEntity executionTaskEntity=getByPrimaryKey(session,extaskId);
        List<ExecutionTaskEntity> executionTaskEntityList=getByInstanceId(session,executionTaskEntity.getExtaskInstId()).stream().filter(item->item.getExtaskStatus().equals(WorkFlowEnum.ExTask_Status_Processing)).collect(Collectors.toList());
        if(executionTaskEntityList!=null&&executionTaskEntityList.size()>0){
            if(executionTaskEntityList.stream().anyMatch(item->item.getExtaskSenderId().equals(session.getUserId()))){
                return true;
            }
        }
        return false;
    }

    @Override
    public void cancelProcessingExTask(JB4DCSession jb4DCSession, String instId) throws JBuild4DCGenerallyException {
        executionTaskMapper.updateProcessingToCancelStatus(instId);
    }

    @Override
    public int getNextExtaskIndexByInstanceId(JB4DCSession jb4DCSession, String instId) {
        return executionTaskMapper.selectNextExtaskIndexByInstanceId(instId);
    }

    @Override
    public List<ExecutionTaskEntity> getProcessingTaskByInstanceIdAndFromTaskId(JB4DCSession jb4DCSession, String instId, String extaskFromTaskId) {
        return executionTaskMapper.selectProcessingTaskByInstanceIdAndFromTaskId(instId,extaskFromTaskId);
    }

    @Override
    public List<ExecutionTaskEntity> getProcessingTaskByInstanceIdAndFromTaskNodeKey(JB4DCSession jb4DCSession, String instId, String extaskPreNodeKey) {
        return executionTaskMapper.selectProcessingTaskByInstanceIdAndFromTaskNodeKey(instId,extaskPreNodeKey);
    }

    @Override
    public void changeTaskToView(JB4DCSession jb4DCSession, String extaskId) throws JBuild4DCGenerallyException {
        ExecutionTaskEntity executionTaskEntity=getByPrimaryKey(jb4DCSession,extaskId);
        if(executionTaskEntity.getExtaskViewTime()==null){
           executionTaskEntity.setExtaskViewEd("是");
           executionTaskEntity.setExtaskViewTime(new Date());
           updateByKeySelective(jb4DCSession,executionTaskEntity);
        }
    }


    ExecutionTaskMapper executionTaskMapper;
    public ExecutionTaskExtendServiceImpl(ExecutionTaskMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        executionTaskMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ExecutionTaskEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<ExecutionTaskEntity>() {
            @Override
            public ExecutionTaskEntity run(JB4DCSession jb4DCSession,ExecutionTaskEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
