package com.jb4dc.workflow.po;

import com.jb4dc.workflow.dbentities.ExecutionTaskEntity;
import com.jb4dc.workflow.dbentities.InstanceEntity;

import java.util.Date;

public class ExecutionTaskPO extends ExecutionTaskEntity {
    private InstanceEntity instanceEntity;

    public ExecutionTaskPO(
            String extaskId, String extaskInstId, String extaskModelId, String extaskRuTaskId, String extaskRuExecutionId, String extaskRuProcInstId, String extaskRuProcDefId,
            String extaskPreNodeKey, String extaskPreNodeName, String extaskCurNodeKey, String extaskCurNodeName, String extaskType, String extaskStatus, String extaskSenderId,
            String extaskSenderName, Date extaskSendTime, String extaskReceiverId, String extaskReceiverName,
            String extaskViewEd, Date extaskViewTime, Date extaskStartTime, Date extaskEndTime, String extaskHandleEd,
            String extaskHandleActionKey, String extaskHandleActionName, Integer extaskOrderNum, String extaskFromTaskId, String extaskFromExecutionId, Integer extaskIndex, String extaskMultiTask,
            String extaskHandlerId, String extaskHandlerName, String extaskHandlerType, String extaskCreateBy,
            String instId, String instTitle, String instDesc, String instCustDesc, Date instCreateTime, String instCreator, String instCreatorId, String instOrganName,
            String instOrganId, String instStatus, Date instEndTime, String instRuExecutionId, String instRuProcInstId, String instRuBusinessKey, String instRuProcDefId,
            Integer instOrderNum, String instModId, String instModCategory, String instModModuleId, String instModTenantId
    ) {
        super(extaskId, extaskInstId, extaskModelId, extaskRuTaskId, extaskRuExecutionId, extaskRuProcInstId, extaskRuProcDefId, extaskPreNodeKey, extaskPreNodeName, extaskCurNodeKey, extaskCurNodeName, extaskType, extaskStatus, extaskSenderId, extaskSenderName, extaskSendTime, extaskReceiverId, extaskReceiverName, extaskViewEd, extaskViewTime, extaskStartTime, extaskEndTime, extaskHandleEd, extaskHandleActionKey, extaskHandleActionName, extaskOrderNum, extaskFromTaskId, extaskFromExecutionId, extaskIndex, extaskMultiTask,
                extaskHandlerId,  extaskHandlerName,  extaskHandlerType,extaskCreateBy);
        InstanceEntity instanceEntity = new InstanceEntity(instId, instTitle, instDesc, instCustDesc, instCreateTime, instCreator, instCreatorId, instOrganName, instOrganId, instStatus, instEndTime, instRuExecutionId, instRuProcInstId, instRuBusinessKey, instRuProcDefId, instOrderNum, instModId, instModCategory, instModModuleId, instModTenantId);
        this.instanceEntity=instanceEntity;
    }

    public ExecutionTaskPO() {
    }

    public InstanceEntity getInstanceEntity() {
        return instanceEntity;
    }
}
