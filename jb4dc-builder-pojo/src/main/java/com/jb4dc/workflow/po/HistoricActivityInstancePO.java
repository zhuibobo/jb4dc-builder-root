package com.jb4dc.workflow.po;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class HistoricActivityInstancePO {

    String id;

    /** return the id of the parent activity instance */
    String parentActivityInstanceId;

    /** The unique identifier of the activity in the process */
    String activityId;

    /** The display name for the activity */
    String activityName;

    /**
     * The activity type of the activity.
     * Typically the activity type correspond to the XML tag used in the BPMN 2.0 process definition file.
     *
     * All activity types are available in {@link org.camunda.bpm.engine.ActivityTypes}
     *
     * @see org.camunda.bpm.engine.ActivityTypes
     */
    String activityType;

    /** Process definition key reference */
    String processDefinitionKey;

    /** Process definition reference */
    String processDefinitionId;

    /** Root process instance reference */
    String rootProcessInstanceId;

    /** Process instance reference */
    String processInstanceId;

    /** Execution reference */
    String executionId;

    /** The corresponding task in case of task activity */
    String taskId;

    /** The called process instance in case of call activity */
    String calledProcessInstanceId;

    /** The called case instance in case of (case) call activity */
    String calledCaseInstanceId;

    /** Assignee in case of user task activity */
    String assignee;

    /** Time when the activity instance started */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    Date startTime;

    /** Time when the activity instance ended */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    Date endTime;

    /** Difference between {@link #getEndTime()} and {@link #getStartTime()}.  */
    Long durationInMillis;

    /** Did this activity instance complete a BPMN 2.0 scope */
    boolean completeScope;

    /** Was this activity instance canceled */
    boolean canceled;

    /**
     * The id of the tenant this historic activity instance belongs to. Can be <code>null</code>
     * if the historic activity instance belongs to no single tenant.
     */
    String tenantId;

    /** The time the historic activity instance will be removed. */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    Date removalTime;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getParentActivityInstanceId() {
        return parentActivityInstanceId;
    }

    public void setParentActivityInstanceId(String parentActivityInstanceId) {
        this.parentActivityInstanceId = parentActivityInstanceId;
    }

    public String getActivityId() {
        return activityId;
    }

    public void setActivityId(String activityId) {
        this.activityId = activityId;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getProcessDefinitionKey() {
        return processDefinitionKey;
    }

    public void setProcessDefinitionKey(String processDefinitionKey) {
        this.processDefinitionKey = processDefinitionKey;
    }

    public String getProcessDefinitionId() {
        return processDefinitionId;
    }

    public void setProcessDefinitionId(String processDefinitionId) {
        this.processDefinitionId = processDefinitionId;
    }

    public String getRootProcessInstanceId() {
        return rootProcessInstanceId;
    }

    public void setRootProcessInstanceId(String rootProcessInstanceId) {
        this.rootProcessInstanceId = rootProcessInstanceId;
    }

    public String getProcessInstanceId() {
        return processInstanceId;
    }

    public void setProcessInstanceId(String processInstanceId) {
        this.processInstanceId = processInstanceId;
    }

    public String getExecutionId() {
        return executionId;
    }

    public void setExecutionId(String executionId) {
        this.executionId = executionId;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getCalledProcessInstanceId() {
        return calledProcessInstanceId;
    }

    public void setCalledProcessInstanceId(String calledProcessInstanceId) {
        this.calledProcessInstanceId = calledProcessInstanceId;
    }

    public String getCalledCaseInstanceId() {
        return calledCaseInstanceId;
    }

    public void setCalledCaseInstanceId(String calledCaseInstanceId) {
        this.calledCaseInstanceId = calledCaseInstanceId;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Long getDurationInMillis() {
        return durationInMillis;
    }

    public void setDurationInMillis(Long durationInMillis) {
        this.durationInMillis = durationInMillis;
    }

    public boolean isCompleteScope() {
        return completeScope;
    }

    public void setCompleteScope(boolean completeScope) {
        this.completeScope = completeScope;
    }

    public boolean isCanceled() {
        return canceled;
    }

    public void setCanceled(boolean canceled) {
        this.canceled = canceled;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public Date getRemovalTime() {
        return removalTime;
    }

    public void setRemovalTime(Date removalTime) {
        this.removalTime = removalTime;
    }
}
