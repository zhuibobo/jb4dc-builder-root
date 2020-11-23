package com.jb4dc.gridsystem.dbentities.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tgrid_event_process
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class EventProcessEntity {
    //EVT_PROCESS_ID:
    @DBKeyField
    private String evtProcessId;

    //EVT_PROCESS_EVENT_ID:关联的时间ID
    private String evtProcessEventId;

    //EVT_PROCESS_UNIT_ID:处理单位ID
    private String evtProcessUnitId;

    //EVT_PROCESS_UNIT_NAME:处理单位名称
    private String evtProcessUnitName;

    //EVT_PROCESS_RECEIVE_DATE:接受时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date evtProcessReceiveDate;

    //EVT_PROCESS_HANDLE_USER_ID:处理人ID
    private String evtProcessHandleUserId;

    //EVT_PROCESS_HANDLE_USER_NAME:处理人姓名
    private String evtProcessHandleUserName;

    //EVT_PROCESS_HANDLE_DATE:处理时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date evtProcessHandleDate;

    //EVT_PROCESS_NODE_NAME:办理状况名称
    private String evtProcessNodeName;

    //EVT_PROCESS_NODE_VALUE:办理状况值
    private String evtProcessNodeValue;

    //EVT_PROCESS_ACTION:执行动作
    private String evtProcessAction;

    //EVT_PROCESS_OPINION:办理意见
    private String evtProcessOpinion;

    //EVT_PROCESS_REMARK:备注
    private String evtProcessRemark;

    //EVT_PROCESS_ORDER_NUM:排序号
    private Integer evtProcessOrderNum;

    /**
     * 构造函数
     * @param evtProcessId
     * @param evtProcessEventId 关联的时间ID
     * @param evtProcessUnitId 处理单位ID
     * @param evtProcessUnitName 处理单位名称
     * @param evtProcessReceiveDate 接受时间
     * @param evtProcessHandleUserId 处理人ID
     * @param evtProcessHandleUserName 处理人姓名
     * @param evtProcessHandleDate 处理时间
     * @param evtProcessNodeName 办理状况名称
     * @param evtProcessNodeValue 办理状况值
     * @param evtProcessAction 执行动作
     * @param evtProcessOpinion 办理意见
     * @param evtProcessRemark 备注
     * @param evtProcessOrderNum 排序号
     **/
    public EventProcessEntity(String evtProcessId, String evtProcessEventId, String evtProcessUnitId, String evtProcessUnitName, Date evtProcessReceiveDate, String evtProcessHandleUserId, String evtProcessHandleUserName, Date evtProcessHandleDate, String evtProcessNodeName, String evtProcessNodeValue, String evtProcessAction, String evtProcessOpinion, String evtProcessRemark, Integer evtProcessOrderNum) {
        this.evtProcessId = evtProcessId;
        this.evtProcessEventId = evtProcessEventId;
        this.evtProcessUnitId = evtProcessUnitId;
        this.evtProcessUnitName = evtProcessUnitName;
        this.evtProcessReceiveDate = evtProcessReceiveDate;
        this.evtProcessHandleUserId = evtProcessHandleUserId;
        this.evtProcessHandleUserName = evtProcessHandleUserName;
        this.evtProcessHandleDate = evtProcessHandleDate;
        this.evtProcessNodeName = evtProcessNodeName;
        this.evtProcessNodeValue = evtProcessNodeValue;
        this.evtProcessAction = evtProcessAction;
        this.evtProcessOpinion = evtProcessOpinion;
        this.evtProcessRemark = evtProcessRemark;
        this.evtProcessOrderNum = evtProcessOrderNum;
    }

    public EventProcessEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getEvtProcessId() {
        return evtProcessId;
    }

    /**
     *
     * @param evtProcessId
     **/
    public void setEvtProcessId(String evtProcessId) {
        this.evtProcessId = evtProcessId == null ? null : evtProcessId.trim();
    }

    /**
     * 关联的时间ID
     * @return java.lang.String
     **/
    public String getEvtProcessEventId() {
        return evtProcessEventId;
    }

    /**
     * 关联的时间ID
     * @param evtProcessEventId 关联的时间ID
     **/
    public void setEvtProcessEventId(String evtProcessEventId) {
        this.evtProcessEventId = evtProcessEventId == null ? null : evtProcessEventId.trim();
    }

    /**
     * 处理单位ID
     * @return java.lang.String
     **/
    public String getEvtProcessUnitId() {
        return evtProcessUnitId;
    }

    /**
     * 处理单位ID
     * @param evtProcessUnitId 处理单位ID
     **/
    public void setEvtProcessUnitId(String evtProcessUnitId) {
        this.evtProcessUnitId = evtProcessUnitId == null ? null : evtProcessUnitId.trim();
    }

    /**
     * 处理单位名称
     * @return java.lang.String
     **/
    public String getEvtProcessUnitName() {
        return evtProcessUnitName;
    }

    /**
     * 处理单位名称
     * @param evtProcessUnitName 处理单位名称
     **/
    public void setEvtProcessUnitName(String evtProcessUnitName) {
        this.evtProcessUnitName = evtProcessUnitName == null ? null : evtProcessUnitName.trim();
    }

    /**
     * 接受时间
     * @return java.util.Date
     **/
    public Date getEvtProcessReceiveDate() {
        return evtProcessReceiveDate;
    }

    /**
     * 接受时间
     * @param evtProcessReceiveDate 接受时间
     **/
    public void setEvtProcessReceiveDate(Date evtProcessReceiveDate) {
        this.evtProcessReceiveDate = evtProcessReceiveDate;
    }

    /**
     * 处理人ID
     * @return java.lang.String
     **/
    public String getEvtProcessHandleUserId() {
        return evtProcessHandleUserId;
    }

    /**
     * 处理人ID
     * @param evtProcessHandleUserId 处理人ID
     **/
    public void setEvtProcessHandleUserId(String evtProcessHandleUserId) {
        this.evtProcessHandleUserId = evtProcessHandleUserId == null ? null : evtProcessHandleUserId.trim();
    }

    /**
     * 处理人姓名
     * @return java.lang.String
     **/
    public String getEvtProcessHandleUserName() {
        return evtProcessHandleUserName;
    }

    /**
     * 处理人姓名
     * @param evtProcessHandleUserName 处理人姓名
     **/
    public void setEvtProcessHandleUserName(String evtProcessHandleUserName) {
        this.evtProcessHandleUserName = evtProcessHandleUserName == null ? null : evtProcessHandleUserName.trim();
    }

    /**
     * 处理时间
     * @return java.util.Date
     **/
    public Date getEvtProcessHandleDate() {
        return evtProcessHandleDate;
    }

    /**
     * 处理时间
     * @param evtProcessHandleDate 处理时间
     **/
    public void setEvtProcessHandleDate(Date evtProcessHandleDate) {
        this.evtProcessHandleDate = evtProcessHandleDate;
    }

    /**
     * 办理状况名称
     * @return java.lang.String
     **/
    public String getEvtProcessNodeName() {
        return evtProcessNodeName;
    }

    /**
     * 办理状况名称
     * @param evtProcessNodeName 办理状况名称
     **/
    public void setEvtProcessNodeName(String evtProcessNodeName) {
        this.evtProcessNodeName = evtProcessNodeName == null ? null : evtProcessNodeName.trim();
    }

    /**
     * 办理状况值
     * @return java.lang.String
     **/
    public String getEvtProcessNodeValue() {
        return evtProcessNodeValue;
    }

    /**
     * 办理状况值
     * @param evtProcessNodeValue 办理状况值
     **/
    public void setEvtProcessNodeValue(String evtProcessNodeValue) {
        this.evtProcessNodeValue = evtProcessNodeValue == null ? null : evtProcessNodeValue.trim();
    }

    /**
     * 执行动作
     * @return java.lang.String
     **/
    public String getEvtProcessAction() {
        return evtProcessAction;
    }

    /**
     * 执行动作
     * @param evtProcessAction 执行动作
     **/
    public void setEvtProcessAction(String evtProcessAction) {
        this.evtProcessAction = evtProcessAction == null ? null : evtProcessAction.trim();
    }

    /**
     * 办理意见
     * @return java.lang.String
     **/
    public String getEvtProcessOpinion() {
        return evtProcessOpinion;
    }

    /**
     * 办理意见
     * @param evtProcessOpinion 办理意见
     **/
    public void setEvtProcessOpinion(String evtProcessOpinion) {
        this.evtProcessOpinion = evtProcessOpinion == null ? null : evtProcessOpinion.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getEvtProcessRemark() {
        return evtProcessRemark;
    }

    /**
     * 备注
     * @param evtProcessRemark 备注
     **/
    public void setEvtProcessRemark(String evtProcessRemark) {
        this.evtProcessRemark = evtProcessRemark == null ? null : evtProcessRemark.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getEvtProcessOrderNum() {
        return evtProcessOrderNum;
    }

    /**
     * 排序号
     * @param evtProcessOrderNum 排序号
     **/
    public void setEvtProcessOrderNum(Integer evtProcessOrderNum) {
        this.evtProcessOrderNum = evtProcessOrderNum;
    }
}