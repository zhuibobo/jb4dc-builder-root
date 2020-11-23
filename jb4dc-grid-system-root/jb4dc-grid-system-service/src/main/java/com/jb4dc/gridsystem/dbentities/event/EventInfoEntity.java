package com.jb4dc.gridsystem.dbentities.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.math.BigDecimal;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tgrid_event_info
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class EventInfoEntity {
    //EVENT_ID:
    @DBKeyField
    private String eventId;

    //EVENT_CODE:事件编号
    private String eventCode;

    //EVENT_ACCEPT_DATE:受理时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date eventAcceptDate;

    //EVENT_ACCEPT_UNIT_NAME:受理单位
    private String eventAcceptUnitName;

    //EVENT_ACCEPT_UNIT_ID:受理人单位ID
    private String eventAcceptUnitId;

    //EVENT_ACCEPT_USER_NAME:受理人
    private String eventAcceptUserName;

    //EVENT_ACCEPT_USER_ID:受理人ID
    private String eventAcceptUserId;

    //EVENT_ACCEPT_TIMES:受理次数
    private Long eventAcceptTimes;

    //EVENT_ACCEPT_GRID_ID:发生区域
    private String eventAcceptGridId;

    //EVENT_ACCEPT_MAP_LOCATION:事件的地理坐标
    private String eventAcceptMapLocation;

    //EVENT_SOURCE:事件来源:群众来访,群众来信,群众来电,领导批办,上级交办,部门转来,排查发现,媒体曝光,网络发现,其他途径
    private String eventSource;

    //EVENT_TYPE_1:事件类型第1级:矛盾纠纷,问题隐患
    private String eventType1;

    //EVENT_TYPE_2:事件类型第2级:[矛盾纠纷]家庭邻里,劳动社保,房屋租赁,房地产业,物业管理,行政管理,涉法涉诉,规划建设,村民股份,经济关系,特殊问题,其他矛盾,党纪政纪||[问题隐患]社会治安,市监食监,交通运输,城市管理,安全生产,消防隐患,环保生态,建设水务,计划生育,人口房屋,教育校园,药品监管,民政事务,其他隐患
    private String eventType2;

    //EVENT_LEVEL:事件级别:一级,二级,三级,四级,五级
    private String eventLevel;

    //EVENT_SEVERITY:严重程度:一般,中等,重大
    private String eventSeverity;

    //EVENT_ADDRESS:发生地点
    private String eventAddress;

    //EVENT_APPEAL_PURPOSE:诉求目的:反映建议,申诉,求决,投诉,其他
    private String eventAppealPurpose;

    //EVENT_APPEAL_PERSON_NUM:诉求人数
    private Long eventAppealPersonNum;

    //EVENT_APPEAL_QUESTION:诉求问题及要求
    private String eventAppealQuestion;

    //EVENT_ABOUT_PERSON_NUM:涉及人数
    private Long eventAboutPersonNum;

    //EVENT_IS_PETITION:是否信访件
    private String eventIsPetition;

    //EVENT_IS_RENTAL_HOUSING:是否出租屋事件
    private String eventIsRentalHousing;

    //EVENT_IS_GROUP:是否群体性事件
    private String eventIsGroup;

    //EVENT_FROM_CODE:转来文号
    private String eventFromCode;

    //EVENT_FROM_DATE:转来日期
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date eventFromDate;

    //EVENT_IS_EMERGENCY:是否紧急事件
    private String eventIsEmergency;

    //EVENT_ABOUT_MONEY:涉及金额
    private BigDecimal eventAboutMoney;

    //EVENT_IS_SP_DIFFICULT:是否特别疑难件
    private String eventIsSpDifficult;

    //EVENT_WARRING_LEVEL:预警级别
    private String eventWarringLevel;

    //EVENT_PROCESS_NODE_NAME:办理状况名称
    private String eventProcessNodeName;

    //EVENT_PROCESS_NODE_VALUE:办理状况值
    private String eventProcessNodeValue;

    //EVENT_REMARK:备注
    private String eventRemark;

    //EVENT_ORDER_NUM:排序号
    private Integer eventOrderNum;

    /**
     * 构造函数
     * @param eventId
     * @param eventCode 事件编号
     * @param eventAcceptDate 受理时间
     * @param eventAcceptUnitName 受理单位
     * @param eventAcceptUnitId 受理人单位ID
     * @param eventAcceptUserName 受理人
     * @param eventAcceptUserId 受理人ID
     * @param eventAcceptTimes 受理次数
     * @param eventAcceptGridId 发生区域
     * @param eventAcceptMapLocation 事件的地理坐标
     * @param eventSource 事件来源
     * @param eventType1 事件类型第1级
     * @param eventType2 事件类型第2级
     * @param eventLevel 事件级别
     * @param eventSeverity 严重程度
     * @param eventAddress 发生地点
     * @param eventAppealPurpose 诉求目的
     * @param eventAppealPersonNum 诉求人数
     * @param eventAppealQuestion 诉求问题及要求
     * @param eventAboutPersonNum 涉及人数
     * @param eventIsPetition 是否信访件
     * @param eventIsRentalHousing 是否出租屋事件
     * @param eventIsGroup 是否群体性事件
     * @param eventFromCode 转来文号
     * @param eventFromDate 转来日期
     * @param eventIsEmergency 是否紧急事件
     * @param eventAboutMoney 涉及金额
     * @param eventIsSpDifficult 是否特别疑难件
     * @param eventWarringLevel 预警级别
     * @param eventProcessNodeName 办理状况名称
     * @param eventProcessNodeValue 办理状况值
     * @param eventRemark 备注
     * @param eventOrderNum 排序号
     **/
    public EventInfoEntity(String eventId, String eventCode, Date eventAcceptDate, String eventAcceptUnitName, String eventAcceptUnitId, String eventAcceptUserName, String eventAcceptUserId, Long eventAcceptTimes, String eventAcceptGridId, String eventAcceptMapLocation, String eventSource, String eventType1, String eventType2, String eventLevel, String eventSeverity, String eventAddress, String eventAppealPurpose, Long eventAppealPersonNum, String eventAppealQuestion, Long eventAboutPersonNum, String eventIsPetition, String eventIsRentalHousing, String eventIsGroup, String eventFromCode, Date eventFromDate, String eventIsEmergency, BigDecimal eventAboutMoney, String eventIsSpDifficult, String eventWarringLevel, String eventProcessNodeName, String eventProcessNodeValue, String eventRemark, Integer eventOrderNum) {
        this.eventId = eventId;
        this.eventCode = eventCode;
        this.eventAcceptDate = eventAcceptDate;
        this.eventAcceptUnitName = eventAcceptUnitName;
        this.eventAcceptUnitId = eventAcceptUnitId;
        this.eventAcceptUserName = eventAcceptUserName;
        this.eventAcceptUserId = eventAcceptUserId;
        this.eventAcceptTimes = eventAcceptTimes;
        this.eventAcceptGridId = eventAcceptGridId;
        this.eventAcceptMapLocation = eventAcceptMapLocation;
        this.eventSource = eventSource;
        this.eventType1 = eventType1;
        this.eventType2 = eventType2;
        this.eventLevel = eventLevel;
        this.eventSeverity = eventSeverity;
        this.eventAddress = eventAddress;
        this.eventAppealPurpose = eventAppealPurpose;
        this.eventAppealPersonNum = eventAppealPersonNum;
        this.eventAppealQuestion = eventAppealQuestion;
        this.eventAboutPersonNum = eventAboutPersonNum;
        this.eventIsPetition = eventIsPetition;
        this.eventIsRentalHousing = eventIsRentalHousing;
        this.eventIsGroup = eventIsGroup;
        this.eventFromCode = eventFromCode;
        this.eventFromDate = eventFromDate;
        this.eventIsEmergency = eventIsEmergency;
        this.eventAboutMoney = eventAboutMoney;
        this.eventIsSpDifficult = eventIsSpDifficult;
        this.eventWarringLevel = eventWarringLevel;
        this.eventProcessNodeName = eventProcessNodeName;
        this.eventProcessNodeValue = eventProcessNodeValue;
        this.eventRemark = eventRemark;
        this.eventOrderNum = eventOrderNum;
    }

    public EventInfoEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getEventId() {
        return eventId;
    }

    /**
     *
     * @param eventId
     **/
    public void setEventId(String eventId) {
        this.eventId = eventId == null ? null : eventId.trim();
    }

    /**
     * 事件编号
     * @return java.lang.String
     **/
    public String getEventCode() {
        return eventCode;
    }

    /**
     * 事件编号
     * @param eventCode 事件编号
     **/
    public void setEventCode(String eventCode) {
        this.eventCode = eventCode == null ? null : eventCode.trim();
    }

    /**
     * 受理时间
     * @return java.util.Date
     **/
    public Date getEventAcceptDate() {
        return eventAcceptDate;
    }

    /**
     * 受理时间
     * @param eventAcceptDate 受理时间
     **/
    public void setEventAcceptDate(Date eventAcceptDate) {
        this.eventAcceptDate = eventAcceptDate;
    }

    /**
     * 受理单位
     * @return java.lang.String
     **/
    public String getEventAcceptUnitName() {
        return eventAcceptUnitName;
    }

    /**
     * 受理单位
     * @param eventAcceptUnitName 受理单位
     **/
    public void setEventAcceptUnitName(String eventAcceptUnitName) {
        this.eventAcceptUnitName = eventAcceptUnitName == null ? null : eventAcceptUnitName.trim();
    }

    /**
     * 受理人单位ID
     * @return java.lang.String
     **/
    public String getEventAcceptUnitId() {
        return eventAcceptUnitId;
    }

    /**
     * 受理人单位ID
     * @param eventAcceptUnitId 受理人单位ID
     **/
    public void setEventAcceptUnitId(String eventAcceptUnitId) {
        this.eventAcceptUnitId = eventAcceptUnitId == null ? null : eventAcceptUnitId.trim();
    }

    /**
     * 受理人
     * @return java.lang.String
     **/
    public String getEventAcceptUserName() {
        return eventAcceptUserName;
    }

    /**
     * 受理人
     * @param eventAcceptUserName 受理人
     **/
    public void setEventAcceptUserName(String eventAcceptUserName) {
        this.eventAcceptUserName = eventAcceptUserName == null ? null : eventAcceptUserName.trim();
    }

    /**
     * 受理人ID
     * @return java.lang.String
     **/
    public String getEventAcceptUserId() {
        return eventAcceptUserId;
    }

    /**
     * 受理人ID
     * @param eventAcceptUserId 受理人ID
     **/
    public void setEventAcceptUserId(String eventAcceptUserId) {
        this.eventAcceptUserId = eventAcceptUserId == null ? null : eventAcceptUserId.trim();
    }

    /**
     * 受理次数
     * @return java.lang.Long
     **/
    public Long getEventAcceptTimes() {
        return eventAcceptTimes;
    }

    /**
     * 受理次数
     * @param eventAcceptTimes 受理次数
     **/
    public void setEventAcceptTimes(Long eventAcceptTimes) {
        this.eventAcceptTimes = eventAcceptTimes;
    }

    /**
     * 发生区域
     * @return java.lang.String
     **/
    public String getEventAcceptGridId() {
        return eventAcceptGridId;
    }

    /**
     * 发生区域
     * @param eventAcceptGridId 发生区域
     **/
    public void setEventAcceptGridId(String eventAcceptGridId) {
        this.eventAcceptGridId = eventAcceptGridId == null ? null : eventAcceptGridId.trim();
    }

    /**
     * 事件的地理坐标
     * @return java.lang.String
     **/
    public String getEventAcceptMapLocation() {
        return eventAcceptMapLocation;
    }

    /**
     * 事件的地理坐标
     * @param eventAcceptMapLocation 事件的地理坐标
     **/
    public void setEventAcceptMapLocation(String eventAcceptMapLocation) {
        this.eventAcceptMapLocation = eventAcceptMapLocation == null ? null : eventAcceptMapLocation.trim();
    }

    /**
     * 事件来源:群众来访,群众来信,群众来电,领导批办,上级交办,部门转来,排查发现,媒体曝光,网络发现,其他途径
     * @return java.lang.String
     **/
    public String getEventSource() {
        return eventSource;
    }

    /**
     * 事件来源:群众来访,群众来信,群众来电,领导批办,上级交办,部门转来,排查发现,媒体曝光,网络发现,其他途径
     * @param eventSource 事件来源
     **/
    public void setEventSource(String eventSource) {
        this.eventSource = eventSource == null ? null : eventSource.trim();
    }

    /**
     * 事件类型第1级:矛盾纠纷,问题隐患
     * @return java.lang.String
     **/
    public String getEventType1() {
        return eventType1;
    }

    /**
     * 事件类型第1级:矛盾纠纷,问题隐患
     * @param eventType1 事件类型第1级
     **/
    public void setEventType1(String eventType1) {
        this.eventType1 = eventType1 == null ? null : eventType1.trim();
    }

    /**
     * 事件类型第2级:[矛盾纠纷]家庭邻里,劳动社保,房屋租赁,房地产业,物业管理,行政管理,涉法涉诉,规划建设,村民股份,经济关系,特殊问题,其他矛盾,党纪政纪||[问题隐患]社会治安,市监食监,交通运输,城市管理,安全生产,消防隐患,环保生态,建设水务,计划生育,人口房屋,教育校园,药品监管,民政事务,其他隐患
     * @return java.lang.String
     **/
    public String getEventType2() {
        return eventType2;
    }

    /**
     * 事件类型第2级:[矛盾纠纷]家庭邻里,劳动社保,房屋租赁,房地产业,物业管理,行政管理,涉法涉诉,规划建设,村民股份,经济关系,特殊问题,其他矛盾,党纪政纪||[问题隐患]社会治安,市监食监,交通运输,城市管理,安全生产,消防隐患,环保生态,建设水务,计划生育,人口房屋,教育校园,药品监管,民政事务,其他隐患
     * @param eventType2 事件类型第2级
     **/
    public void setEventType2(String eventType2) {
        this.eventType2 = eventType2 == null ? null : eventType2.trim();
    }

    /**
     * 事件级别:一级,二级,三级,四级,五级
     * @return java.lang.String
     **/
    public String getEventLevel() {
        return eventLevel;
    }

    /**
     * 事件级别:一级,二级,三级,四级,五级
     * @param eventLevel 事件级别
     **/
    public void setEventLevel(String eventLevel) {
        this.eventLevel = eventLevel == null ? null : eventLevel.trim();
    }

    /**
     * 严重程度:一般,中等,重大
     * @return java.lang.String
     **/
    public String getEventSeverity() {
        return eventSeverity;
    }

    /**
     * 严重程度:一般,中等,重大
     * @param eventSeverity 严重程度
     **/
    public void setEventSeverity(String eventSeverity) {
        this.eventSeverity = eventSeverity == null ? null : eventSeverity.trim();
    }

    /**
     * 发生地点
     * @return java.lang.String
     **/
    public String getEventAddress() {
        return eventAddress;
    }

    /**
     * 发生地点
     * @param eventAddress 发生地点
     **/
    public void setEventAddress(String eventAddress) {
        this.eventAddress = eventAddress == null ? null : eventAddress.trim();
    }

    /**
     * 诉求目的:反映建议,申诉,求决,投诉,其他
     * @return java.lang.String
     **/
    public String getEventAppealPurpose() {
        return eventAppealPurpose;
    }

    /**
     * 诉求目的:反映建议,申诉,求决,投诉,其他
     * @param eventAppealPurpose 诉求目的
     **/
    public void setEventAppealPurpose(String eventAppealPurpose) {
        this.eventAppealPurpose = eventAppealPurpose == null ? null : eventAppealPurpose.trim();
    }

    /**
     * 诉求人数
     * @return java.lang.Long
     **/
    public Long getEventAppealPersonNum() {
        return eventAppealPersonNum;
    }

    /**
     * 诉求人数
     * @param eventAppealPersonNum 诉求人数
     **/
    public void setEventAppealPersonNum(Long eventAppealPersonNum) {
        this.eventAppealPersonNum = eventAppealPersonNum;
    }

    /**
     * 诉求问题及要求
     * @return java.lang.String
     **/
    public String getEventAppealQuestion() {
        return eventAppealQuestion;
    }

    /**
     * 诉求问题及要求
     * @param eventAppealQuestion 诉求问题及要求
     **/
    public void setEventAppealQuestion(String eventAppealQuestion) {
        this.eventAppealQuestion = eventAppealQuestion == null ? null : eventAppealQuestion.trim();
    }

    /**
     * 涉及人数
     * @return java.lang.Long
     **/
    public Long getEventAboutPersonNum() {
        return eventAboutPersonNum;
    }

    /**
     * 涉及人数
     * @param eventAboutPersonNum 涉及人数
     **/
    public void setEventAboutPersonNum(Long eventAboutPersonNum) {
        this.eventAboutPersonNum = eventAboutPersonNum;
    }

    /**
     * 是否信访件
     * @return java.lang.String
     **/
    public String getEventIsPetition() {
        return eventIsPetition;
    }

    /**
     * 是否信访件
     * @param eventIsPetition 是否信访件
     **/
    public void setEventIsPetition(String eventIsPetition) {
        this.eventIsPetition = eventIsPetition == null ? null : eventIsPetition.trim();
    }

    /**
     * 是否出租屋事件
     * @return java.lang.String
     **/
    public String getEventIsRentalHousing() {
        return eventIsRentalHousing;
    }

    /**
     * 是否出租屋事件
     * @param eventIsRentalHousing 是否出租屋事件
     **/
    public void setEventIsRentalHousing(String eventIsRentalHousing) {
        this.eventIsRentalHousing = eventIsRentalHousing == null ? null : eventIsRentalHousing.trim();
    }

    /**
     * 是否群体性事件
     * @return java.lang.String
     **/
    public String getEventIsGroup() {
        return eventIsGroup;
    }

    /**
     * 是否群体性事件
     * @param eventIsGroup 是否群体性事件
     **/
    public void setEventIsGroup(String eventIsGroup) {
        this.eventIsGroup = eventIsGroup == null ? null : eventIsGroup.trim();
    }

    /**
     * 转来文号
     * @return java.lang.String
     **/
    public String getEventFromCode() {
        return eventFromCode;
    }

    /**
     * 转来文号
     * @param eventFromCode 转来文号
     **/
    public void setEventFromCode(String eventFromCode) {
        this.eventFromCode = eventFromCode == null ? null : eventFromCode.trim();
    }

    /**
     * 转来日期
     * @return java.util.Date
     **/
    public Date getEventFromDate() {
        return eventFromDate;
    }

    /**
     * 转来日期
     * @param eventFromDate 转来日期
     **/
    public void setEventFromDate(Date eventFromDate) {
        this.eventFromDate = eventFromDate;
    }

    /**
     * 是否紧急事件
     * @return java.lang.String
     **/
    public String getEventIsEmergency() {
        return eventIsEmergency;
    }

    /**
     * 是否紧急事件
     * @param eventIsEmergency 是否紧急事件
     **/
    public void setEventIsEmergency(String eventIsEmergency) {
        this.eventIsEmergency = eventIsEmergency == null ? null : eventIsEmergency.trim();
    }

    /**
     * 涉及金额
     * @return java.math.BigDecimal
     **/
    public BigDecimal getEventAboutMoney() {
        return eventAboutMoney;
    }

    /**
     * 涉及金额
     * @param eventAboutMoney 涉及金额
     **/
    public void setEventAboutMoney(BigDecimal eventAboutMoney) {
        this.eventAboutMoney = eventAboutMoney;
    }

    /**
     * 是否特别疑难件
     * @return java.lang.String
     **/
    public String getEventIsSpDifficult() {
        return eventIsSpDifficult;
    }

    /**
     * 是否特别疑难件
     * @param eventIsSpDifficult 是否特别疑难件
     **/
    public void setEventIsSpDifficult(String eventIsSpDifficult) {
        this.eventIsSpDifficult = eventIsSpDifficult == null ? null : eventIsSpDifficult.trim();
    }

    /**
     * 预警级别
     * @return java.lang.String
     **/
    public String getEventWarringLevel() {
        return eventWarringLevel;
    }

    /**
     * 预警级别
     * @param eventWarringLevel 预警级别
     **/
    public void setEventWarringLevel(String eventWarringLevel) {
        this.eventWarringLevel = eventWarringLevel == null ? null : eventWarringLevel.trim();
    }

    /**
     * 办理状况名称
     * @return java.lang.String
     **/
    public String getEventProcessNodeName() {
        return eventProcessNodeName;
    }

    /**
     * 办理状况名称
     * @param eventProcessNodeName 办理状况名称
     **/
    public void setEventProcessNodeName(String eventProcessNodeName) {
        this.eventProcessNodeName = eventProcessNodeName == null ? null : eventProcessNodeName.trim();
    }

    /**
     * 办理状况值
     * @return java.lang.String
     **/
    public String getEventProcessNodeValue() {
        return eventProcessNodeValue;
    }

    /**
     * 办理状况值
     * @param eventProcessNodeValue 办理状况值
     **/
    public void setEventProcessNodeValue(String eventProcessNodeValue) {
        this.eventProcessNodeValue = eventProcessNodeValue == null ? null : eventProcessNodeValue.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getEventRemark() {
        return eventRemark;
    }

    /**
     * 备注
     * @param eventRemark 备注
     **/
    public void setEventRemark(String eventRemark) {
        this.eventRemark = eventRemark == null ? null : eventRemark.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getEventOrderNum() {
        return eventOrderNum;
    }

    /**
     * 排序号
     * @param eventOrderNum 排序号
     **/
    public void setEventOrderNum(Integer eventOrderNum) {
        this.eventOrderNum = eventOrderNum;
    }
}