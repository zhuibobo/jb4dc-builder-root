package com.jb4dc.workflow.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_execution_task
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ExecutionTaskEntity {
    //EXTASK_ID:
    @DBKeyField
    private String extaskId;

    //EXTASK_INST_ID:流程实例ID
    private String extaskInstId;

    //EXTASK_MODEL_ID:模型ID:关联TFLOW_MODEL_INTEGRATED的MODEL_ID
    private String extaskModelId;

    //EXTASK_RU_TASK_ID:关联act_ru_task的ID_
    private String extaskRuTaskId;

    //EXTASK_RU_EXECUTION_ID:关联act_ru_task的EXECUTION_ID_
    private String extaskRuExecutionId;

    //EXTASK_RU_PROC_INST_ID:关联act_ru_task的PROC_INST_ID_
    private String extaskRuProcInstId;

    //EXTASK_RU_PROC_DEF_ID:关联act_ru_task的PROC_DEF_ID_
    private String extaskRuProcDefId;

    //EXTASK_PRE_NODE_KEY:前一个流程节点ID
    private String extaskPreNodeKey;

    //EXTASK_PRE_NODE_NAME:前一个流程节点名称
    private String extaskPreNodeName;

    //EXTASK_CUR_NODE_KEY:当前流程节点ID:关联act_ru_task的TASK_DEF_KEY_
    private String extaskCurNodeKey;

    //EXTASK_CUR_NODE_NAME:当前流程节点名称:关联act_ru_task的NAME_
    private String extaskCurNodeName;

    //EXTASK_TYPE:任务类型:主送任务,抄送任务
    private String extaskType;

    //EXTASK_STATUS:状态:End;Processing;Cancel
    private String extaskStatus;

    //EXTASK_SENDER_ID:发送者ID
    private String extaskSenderId;

    //EXTASK_SENDER_NAME:发送者名称
    private String extaskSenderName;

    //EXTASK_SEND_TIME:发送时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date extaskSendTime;

    //EXTASK_RECEIVER_ID:接收者ID
    private String extaskReceiverId;

    //EXTASK_RECEIVER_NAME:接收者名称
    private String extaskReceiverName;

    //EXTASK_VIEW_ED:是否已查看
    private String extaskViewEd;

    //EXTASK_VIEW_TIME:查看时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date extaskViewTime;

    //EXTASK_START_TIME:处理开始时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date extaskStartTime;

    //EXTASK_END_TIME:处理结束时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date extaskEndTime;

    //EXTASK_HANDLE_ED:是否已处理
    private String extaskHandleEd;

    //EXTASK_HANDLE_ACTION_KEY:处理动作Key
    private String extaskHandleActionKey;

    //EXTASK_HANDLE_ACTION_NAME:处理动作名称
    private String extaskHandleActionName;

    //EXTASK_ORDER_NUM:排序号
    private Integer extaskOrderNum;

    //EXTASK_FROM_TASK_ID:源自任务ID:TFLOW_EXECUTION_TASK的EXTASK_ID
    private String extaskFromTaskId;

    //EXTASK_FROM_EXECUTION_ID:源自执行ID:ACT_RU_EXECUTION的ID,例如由服务节点驱动而生成的本表信息
    private String extaskFromExecutionId;

    //EXTASK_INDEX:任务索引号:从小到大增加,多实例任务相同,主要用于生成顺序流程图
    private String extaskIndex;

    /**
     * 构造函数
     * @param extaskId
     * @param extaskInstId 流程实例ID
     * @param extaskModelId 模型ID
     * @param extaskRuTaskId 关联act_ru_task的ID_
     * @param extaskRuExecutionId 关联act_ru_task的EXECUTION_ID_
     * @param extaskRuProcInstId 关联act_ru_task的PROC_INST_ID_
     * @param extaskRuProcDefId 关联act_ru_task的PROC_DEF_ID_
     * @param extaskPreNodeKey 前一个流程节点ID
     * @param extaskPreNodeName 前一个流程节点名称
     * @param extaskCurNodeKey 当前流程节点ID
     * @param extaskCurNodeName 当前流程节点名称
     * @param extaskType 任务类型
     * @param extaskStatus 状态
     * @param extaskSenderId 发送者ID
     * @param extaskSenderName 发送者名称
     * @param extaskSendTime 发送时间
     * @param extaskReceiverId 接收者ID
     * @param extaskReceiverName 接收者名称
     * @param extaskViewEd 是否已查看
     * @param extaskViewTime 查看时间
     * @param extaskStartTime 处理开始时间
     * @param extaskEndTime 处理结束时间
     * @param extaskHandleEd 是否已处理
     * @param extaskHandleActionKey 处理动作Key
     * @param extaskHandleActionName 处理动作名称
     * @param extaskOrderNum 排序号
     * @param extaskFromTaskId 源自任务ID
     * @param extaskFromExecutionId 源自执行ID
     * @param extaskIndex 任务索引号
     **/
    public ExecutionTaskEntity(String extaskId, String extaskInstId, String extaskModelId, String extaskRuTaskId, String extaskRuExecutionId, String extaskRuProcInstId, String extaskRuProcDefId, String extaskPreNodeKey, String extaskPreNodeName, String extaskCurNodeKey, String extaskCurNodeName, String extaskType, String extaskStatus, String extaskSenderId, String extaskSenderName, Date extaskSendTime, String extaskReceiverId, String extaskReceiverName, String extaskViewEd, Date extaskViewTime, Date extaskStartTime, Date extaskEndTime, String extaskHandleEd, String extaskHandleActionKey, String extaskHandleActionName, Integer extaskOrderNum, String extaskFromTaskId, String extaskFromExecutionId, String extaskIndex) {
        this.extaskId = extaskId;
        this.extaskInstId = extaskInstId;
        this.extaskModelId = extaskModelId;
        this.extaskRuTaskId = extaskRuTaskId;
        this.extaskRuExecutionId = extaskRuExecutionId;
        this.extaskRuProcInstId = extaskRuProcInstId;
        this.extaskRuProcDefId = extaskRuProcDefId;
        this.extaskPreNodeKey = extaskPreNodeKey;
        this.extaskPreNodeName = extaskPreNodeName;
        this.extaskCurNodeKey = extaskCurNodeKey;
        this.extaskCurNodeName = extaskCurNodeName;
        this.extaskType = extaskType;
        this.extaskStatus = extaskStatus;
        this.extaskSenderId = extaskSenderId;
        this.extaskSenderName = extaskSenderName;
        this.extaskSendTime = extaskSendTime;
        this.extaskReceiverId = extaskReceiverId;
        this.extaskReceiverName = extaskReceiverName;
        this.extaskViewEd = extaskViewEd;
        this.extaskViewTime = extaskViewTime;
        this.extaskStartTime = extaskStartTime;
        this.extaskEndTime = extaskEndTime;
        this.extaskHandleEd = extaskHandleEd;
        this.extaskHandleActionKey = extaskHandleActionKey;
        this.extaskHandleActionName = extaskHandleActionName;
        this.extaskOrderNum = extaskOrderNum;
        this.extaskFromTaskId = extaskFromTaskId;
        this.extaskFromExecutionId = extaskFromExecutionId;
        this.extaskIndex = extaskIndex;
    }

    public ExecutionTaskEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getExtaskId() {
        return extaskId;
    }

    /**
     *
     * @param extaskId
     **/
    public void setExtaskId(String extaskId) {
        this.extaskId = extaskId == null ? null : extaskId.trim();
    }

    /**
     * 流程实例ID
     * @return java.lang.String
     **/
    public String getExtaskInstId() {
        return extaskInstId;
    }

    /**
     * 流程实例ID
     * @param extaskInstId 流程实例ID
     **/
    public void setExtaskInstId(String extaskInstId) {
        this.extaskInstId = extaskInstId == null ? null : extaskInstId.trim();
    }

    /**
     * 模型ID:关联TFLOW_MODEL_INTEGRATED的MODEL_ID
     * @return java.lang.String
     **/
    public String getExtaskModelId() {
        return extaskModelId;
    }

    /**
     * 模型ID:关联TFLOW_MODEL_INTEGRATED的MODEL_ID
     * @param extaskModelId 模型ID
     **/
    public void setExtaskModelId(String extaskModelId) {
        this.extaskModelId = extaskModelId == null ? null : extaskModelId.trim();
    }

    /**
     * 关联act_ru_task的ID_
     * @return java.lang.String
     **/
    public String getExtaskRuTaskId() {
        return extaskRuTaskId;
    }

    /**
     * 关联act_ru_task的ID_
     * @param extaskRuTaskId 关联act_ru_task的ID_
     **/
    public void setExtaskRuTaskId(String extaskRuTaskId) {
        this.extaskRuTaskId = extaskRuTaskId == null ? null : extaskRuTaskId.trim();
    }

    /**
     * 关联act_ru_task的EXECUTION_ID_
     * @return java.lang.String
     **/
    public String getExtaskRuExecutionId() {
        return extaskRuExecutionId;
    }

    /**
     * 关联act_ru_task的EXECUTION_ID_
     * @param extaskRuExecutionId 关联act_ru_task的EXECUTION_ID_
     **/
    public void setExtaskRuExecutionId(String extaskRuExecutionId) {
        this.extaskRuExecutionId = extaskRuExecutionId == null ? null : extaskRuExecutionId.trim();
    }

    /**
     * 关联act_ru_task的PROC_INST_ID_
     * @return java.lang.String
     **/
    public String getExtaskRuProcInstId() {
        return extaskRuProcInstId;
    }

    /**
     * 关联act_ru_task的PROC_INST_ID_
     * @param extaskRuProcInstId 关联act_ru_task的PROC_INST_ID_
     **/
    public void setExtaskRuProcInstId(String extaskRuProcInstId) {
        this.extaskRuProcInstId = extaskRuProcInstId == null ? null : extaskRuProcInstId.trim();
    }

    /**
     * 关联act_ru_task的PROC_DEF_ID_
     * @return java.lang.String
     **/
    public String getExtaskRuProcDefId() {
        return extaskRuProcDefId;
    }

    /**
     * 关联act_ru_task的PROC_DEF_ID_
     * @param extaskRuProcDefId 关联act_ru_task的PROC_DEF_ID_
     **/
    public void setExtaskRuProcDefId(String extaskRuProcDefId) {
        this.extaskRuProcDefId = extaskRuProcDefId == null ? null : extaskRuProcDefId.trim();
    }

    /**
     * 前一个流程节点ID
     * @return java.lang.String
     **/
    public String getExtaskPreNodeKey() {
        return extaskPreNodeKey;
    }

    /**
     * 前一个流程节点ID
     * @param extaskPreNodeKey 前一个流程节点ID
     **/
    public void setExtaskPreNodeKey(String extaskPreNodeKey) {
        this.extaskPreNodeKey = extaskPreNodeKey == null ? null : extaskPreNodeKey.trim();
    }

    /**
     * 前一个流程节点名称
     * @return java.lang.String
     **/
    public String getExtaskPreNodeName() {
        return extaskPreNodeName;
    }

    /**
     * 前一个流程节点名称
     * @param extaskPreNodeName 前一个流程节点名称
     **/
    public void setExtaskPreNodeName(String extaskPreNodeName) {
        this.extaskPreNodeName = extaskPreNodeName == null ? null : extaskPreNodeName.trim();
    }

    /**
     * 当前流程节点ID:关联act_ru_task的TASK_DEF_KEY_
     * @return java.lang.String
     **/
    public String getExtaskCurNodeKey() {
        return extaskCurNodeKey;
    }

    /**
     * 当前流程节点ID:关联act_ru_task的TASK_DEF_KEY_
     * @param extaskCurNodeKey 当前流程节点ID
     **/
    public void setExtaskCurNodeKey(String extaskCurNodeKey) {
        this.extaskCurNodeKey = extaskCurNodeKey == null ? null : extaskCurNodeKey.trim();
    }

    /**
     * 当前流程节点名称:关联act_ru_task的NAME_
     * @return java.lang.String
     **/
    public String getExtaskCurNodeName() {
        return extaskCurNodeName;
    }

    /**
     * 当前流程节点名称:关联act_ru_task的NAME_
     * @param extaskCurNodeName 当前流程节点名称
     **/
    public void setExtaskCurNodeName(String extaskCurNodeName) {
        this.extaskCurNodeName = extaskCurNodeName == null ? null : extaskCurNodeName.trim();
    }

    /**
     * 任务类型:主送任务,抄送任务
     * @return java.lang.String
     **/
    public String getExtaskType() {
        return extaskType;
    }

    /**
     * 任务类型:主送任务,抄送任务
     * @param extaskType 任务类型
     **/
    public void setExtaskType(String extaskType) {
        this.extaskType = extaskType == null ? null : extaskType.trim();
    }

    /**
     * 状态:End;Processing;Cancel
     * @return java.lang.String
     **/
    public String getExtaskStatus() {
        return extaskStatus;
    }

    /**
     * 状态:End;Processing;Cancel
     * @param extaskStatus 状态
     **/
    public void setExtaskStatus(String extaskStatus) {
        this.extaskStatus = extaskStatus == null ? null : extaskStatus.trim();
    }

    /**
     * 发送者ID
     * @return java.lang.String
     **/
    public String getExtaskSenderId() {
        return extaskSenderId;
    }

    /**
     * 发送者ID
     * @param extaskSenderId 发送者ID
     **/
    public void setExtaskSenderId(String extaskSenderId) {
        this.extaskSenderId = extaskSenderId == null ? null : extaskSenderId.trim();
    }

    /**
     * 发送者名称
     * @return java.lang.String
     **/
    public String getExtaskSenderName() {
        return extaskSenderName;
    }

    /**
     * 发送者名称
     * @param extaskSenderName 发送者名称
     **/
    public void setExtaskSenderName(String extaskSenderName) {
        this.extaskSenderName = extaskSenderName == null ? null : extaskSenderName.trim();
    }

    /**
     * 发送时间
     * @return java.util.Date
     **/
    public Date getExtaskSendTime() {
        return extaskSendTime;
    }

    /**
     * 发送时间
     * @param extaskSendTime 发送时间
     **/
    public void setExtaskSendTime(Date extaskSendTime) {
        this.extaskSendTime = extaskSendTime;
    }

    /**
     * 接收者ID
     * @return java.lang.String
     **/
    public String getExtaskReceiverId() {
        return extaskReceiverId;
    }

    /**
     * 接收者ID
     * @param extaskReceiverId 接收者ID
     **/
    public void setExtaskReceiverId(String extaskReceiverId) {
        this.extaskReceiverId = extaskReceiverId == null ? null : extaskReceiverId.trim();
    }

    /**
     * 接收者名称
     * @return java.lang.String
     **/
    public String getExtaskReceiverName() {
        return extaskReceiverName;
    }

    /**
     * 接收者名称
     * @param extaskReceiverName 接收者名称
     **/
    public void setExtaskReceiverName(String extaskReceiverName) {
        this.extaskReceiverName = extaskReceiverName == null ? null : extaskReceiverName.trim();
    }

    /**
     * 是否已查看
     * @return java.lang.String
     **/
    public String getExtaskViewEd() {
        return extaskViewEd;
    }

    /**
     * 是否已查看
     * @param extaskViewEd 是否已查看
     **/
    public void setExtaskViewEd(String extaskViewEd) {
        this.extaskViewEd = extaskViewEd == null ? null : extaskViewEd.trim();
    }

    /**
     * 查看时间
     * @return java.util.Date
     **/
    public Date getExtaskViewTime() {
        return extaskViewTime;
    }

    /**
     * 查看时间
     * @param extaskViewTime 查看时间
     **/
    public void setExtaskViewTime(Date extaskViewTime) {
        this.extaskViewTime = extaskViewTime;
    }

    /**
     * 处理开始时间
     * @return java.util.Date
     **/
    public Date getExtaskStartTime() {
        return extaskStartTime;
    }

    /**
     * 处理开始时间
     * @param extaskStartTime 处理开始时间
     **/
    public void setExtaskStartTime(Date extaskStartTime) {
        this.extaskStartTime = extaskStartTime;
    }

    /**
     * 处理结束时间
     * @return java.util.Date
     **/
    public Date getExtaskEndTime() {
        return extaskEndTime;
    }

    /**
     * 处理结束时间
     * @param extaskEndTime 处理结束时间
     **/
    public void setExtaskEndTime(Date extaskEndTime) {
        this.extaskEndTime = extaskEndTime;
    }

    /**
     * 是否已处理
     * @return java.lang.String
     **/
    public String getExtaskHandleEd() {
        return extaskHandleEd;
    }

    /**
     * 是否已处理
     * @param extaskHandleEd 是否已处理
     **/
    public void setExtaskHandleEd(String extaskHandleEd) {
        this.extaskHandleEd = extaskHandleEd == null ? null : extaskHandleEd.trim();
    }

    /**
     * 处理动作Key
     * @return java.lang.String
     **/
    public String getExtaskHandleActionKey() {
        return extaskHandleActionKey;
    }

    /**
     * 处理动作Key
     * @param extaskHandleActionKey 处理动作Key
     **/
    public void setExtaskHandleActionKey(String extaskHandleActionKey) {
        this.extaskHandleActionKey = extaskHandleActionKey == null ? null : extaskHandleActionKey.trim();
    }

    /**
     * 处理动作名称
     * @return java.lang.String
     **/
    public String getExtaskHandleActionName() {
        return extaskHandleActionName;
    }

    /**
     * 处理动作名称
     * @param extaskHandleActionName 处理动作名称
     **/
    public void setExtaskHandleActionName(String extaskHandleActionName) {
        this.extaskHandleActionName = extaskHandleActionName == null ? null : extaskHandleActionName.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getExtaskOrderNum() {
        return extaskOrderNum;
    }

    /**
     * 排序号
     * @param extaskOrderNum 排序号
     **/
    public void setExtaskOrderNum(Integer extaskOrderNum) {
        this.extaskOrderNum = extaskOrderNum;
    }

    /**
     * 源自任务ID:TFLOW_EXECUTION_TASK的EXTASK_ID
     * @return java.lang.String
     **/
    public String getExtaskFromTaskId() {
        return extaskFromTaskId;
    }

    /**
     * 源自任务ID:TFLOW_EXECUTION_TASK的EXTASK_ID
     * @param extaskFromTaskId 源自任务ID
     **/
    public void setExtaskFromTaskId(String extaskFromTaskId) {
        this.extaskFromTaskId = extaskFromTaskId == null ? null : extaskFromTaskId.trim();
    }

    /**
     * 源自执行ID:ACT_RU_EXECUTION的ID,例如由服务节点驱动而生成的本表信息
     * @return java.lang.String
     **/
    public String getExtaskFromExecutionId() {
        return extaskFromExecutionId;
    }

    /**
     * 源自执行ID:ACT_RU_EXECUTION的ID,例如由服务节点驱动而生成的本表信息
     * @param extaskFromExecutionId 源自执行ID
     **/
    public void setExtaskFromExecutionId(String extaskFromExecutionId) {
        this.extaskFromExecutionId = extaskFromExecutionId == null ? null : extaskFromExecutionId.trim();
    }

    /**
     * 任务索引号:从小到大增加,多实例任务相同,主要用于生成顺序流程图
     * @return java.lang.String
     **/
    public String getExtaskIndex() {
        return extaskIndex;
    }

    /**
     * 任务索引号:从小到大增加,多实例任务相同,主要用于生成顺序流程图
     * @param extaskIndex 任务索引号
     **/
    public void setExtaskIndex(String extaskIndex) {
        this.extaskIndex = extaskIndex == null ? null : extaskIndex.trim();
    }
}