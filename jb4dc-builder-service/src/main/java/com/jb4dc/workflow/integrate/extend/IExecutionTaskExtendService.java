package com.jb4dc.workflow.integrate.extend;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.po.SimplePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dbentities.ExecutionTaskEntity;
import com.jb4dc.workflow.dbentities.ExecutionTaskLogEntityWithBLOBs;
import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.po.ExecutionTaskPO;
import com.jb4dc.workflow.po.bpmn.process.Jb4dcAction;

import java.util.List;
import java.util.Map;

public interface IExecutionTaskExtendService  extends IBaseService<ExecutionTaskEntity> {
    public static String exTaskStatus_End = "End";
    public static String exTaskStatus_Processing = "Processing";

    void complete(JB4DCSession jb4DCSession, String taskId, Map<String, Object> vars) throws JBuild4DCGenerallyException;

    List<ExecutionTaskEntity> getByInstanceId(JB4DCSession jb4DCSession, String instId);

    List<ExecutionTaskEntity> getByInstanceIdAndStatus(JB4DCSession jb4DCSession, String instId, String exTask_status_processing) throws JBuild4DCGenerallyException;

    ExecutionTaskEntity createStartEventExecutionTask(JB4DCSession jb4DCSession, InstanceEntity instanceEntity, String currentNodeKey, String currentNodeName, Jb4dcAction jb4dcAction) throws JBuild4DCGenerallyException;

    PageInfo<ExecutionTaskPO> getMyProcessTaskList(JB4DCSession jb4DCSession, int pageNum, int pageSize, String userId, String organId, String linkId, String modelCategory, String extaskType);

    PageInfo<ExecutionTaskPO> getMyProcessEndTaskList(JB4DCSession jb4DCSession, int pageNum, int pageSize, String userId, String organId, String linkId, String modelCategory, String extaskType);

    List<ExecutionTaskEntity> getActiveTaskByInstanceIds(JB4DCSession jb4DCSession, List<InstanceEntity> listEntity);

    boolean instanceProcessingTaskIsSendFromMe(JB4DCSession session, String extaskId) throws JBuild4DCGenerallyException;

    void cancelProcessingExTask(JB4DCSession jb4DCSession, String instId) throws JBuild4DCGenerallyException;

    int getNextExtaskIndexByInstanceId(JB4DCSession jb4DCSession, String instId);

    ExecutionTaskEntity getProcessingTaskByInstanceIdAndFromTaskId(JB4DCSession jb4DCSession, String instId, String extaskFromTaskId);
}
