package com.jb4dc.workflow.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_execution_task_opinion
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ExecutionTaskOpinionEntity {
    //OPINION_ID:
    @DBKeyField
    private String opinionId;

    //OPINION_EXTASK_ID:关联TFLOW_EXECUTION_TASK的EXTASK_ID
    private String opinionExtaskId;

    //OPINION_TEXT:意见内容
    private String opinionText;

    //OPINION_TIME:提交时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date opinionTime;

    //OPINION_ORDER_NUM:排序号
    private Integer opinionOrderNum;

    /**
     * 构造函数
     * @param opinionId
     * @param opinionExtaskId 关联TFLOW_EXECUTION_TASK的EXTASK_ID
     * @param opinionText 意见内容
     * @param opinionTime 提交时间
     * @param opinionOrderNum 排序号
     **/
    public ExecutionTaskOpinionEntity(String opinionId, String opinionExtaskId, String opinionText, Date opinionTime, Integer opinionOrderNum) {
        this.opinionId = opinionId;
        this.opinionExtaskId = opinionExtaskId;
        this.opinionText = opinionText;
        this.opinionTime = opinionTime;
        this.opinionOrderNum = opinionOrderNum;
    }

    public ExecutionTaskOpinionEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getOpinionId() {
        return opinionId;
    }

    /**
     *
     * @param opinionId
     **/
    public void setOpinionId(String opinionId) {
        this.opinionId = opinionId == null ? null : opinionId.trim();
    }

    /**
     * 关联TFLOW_EXECUTION_TASK的EXTASK_ID
     * @return java.lang.String
     **/
    public String getOpinionExtaskId() {
        return opinionExtaskId;
    }

    /**
     * 关联TFLOW_EXECUTION_TASK的EXTASK_ID
     * @param opinionExtaskId 关联TFLOW_EXECUTION_TASK的EXTASK_ID
     **/
    public void setOpinionExtaskId(String opinionExtaskId) {
        this.opinionExtaskId = opinionExtaskId == null ? null : opinionExtaskId.trim();
    }

    /**
     * 意见内容
     * @return java.lang.String
     **/
    public String getOpinionText() {
        return opinionText;
    }

    /**
     * 意见内容
     * @param opinionText 意见内容
     **/
    public void setOpinionText(String opinionText) {
        this.opinionText = opinionText == null ? null : opinionText.trim();
    }

    /**
     * 提交时间
     * @return java.util.Date
     **/
    public Date getOpinionTime() {
        return opinionTime;
    }

    /**
     * 提交时间
     * @param opinionTime 提交时间
     **/
    public void setOpinionTime(Date opinionTime) {
        this.opinionTime = opinionTime;
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getOpinionOrderNum() {
        return opinionOrderNum;
    }

    /**
     * 排序号
     * @param opinionOrderNum 排序号
     **/
    public void setOpinionOrderNum(Integer opinionOrderNum) {
        this.opinionOrderNum = opinionOrderNum;
    }
}