package com.jb4dc.qcsystem.dbentities.issues;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tqc_issues
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class IssuesEntity {
    //ISS_ID:
    @DBKeyField
    private String issId;

    //ISS_NUM:序号
    private String issNum;

    //ISS_TITLE:标题
    private String issTitle;

    //ISS_SIMPLE_CONTENT:内容简介
    private String issSimpleContent;

    //ISS_PROJECT_ID:所属项目ID
    private String issProjectId;

    //ISS_SYS_NAME:所属系统
    private String issSysName;

    //ISS_SYS_CATEGORY:所属系统类别:(Web后台,Web网站,后台服务,安卓APP,IOS,微信公众号)
    private String issSysCategory;

    //ISS_SYS_VERSION:所属系统版本号
    private String issSysVersion;

    //ISS_SYS_MODULE_NAME:所属模块
    private String issSysModuleName;

    //ISS_SYS_PHASE:系统状况:(开发中,运维中)
    private String issSysPhase;

    //ISS_TYPE:种类:(缺陷,需求变更,新需求,咨询,运维)
    private String issType;

    //ISS_LEVEL:严重程度:(高,中,低)
    private String issLevel;

    //ISS_PRIORITY:优先级:(高,中,低)
    private String issPriority;

    //ISS_IS_REPEAT:可重现:(是,否)
    private String issIsRepeat;

    //ISS_SOURCE:来源:(项目组,客户)
    private String issSource;

    //ISS_CUSTOMER_UNIT:客户-单位
    private String issCustomerUnit;

    //ISS_CUSTOMER_NAME:客户-姓名
    private String issCustomerName;

    //ISS_CUSTOMER_MOBILE:客户-电话
    private String issCustomerMobile;

    //ISS_ACCEPT_FROM:受理方式:(QQ群,QQ,电话,微信群,微信,邮件)
    private String issAcceptFrom;

    //ISS_ACCEPT_DATE:受理时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date issAcceptDate;

    //ISS_ACCEPT_NAME:受理人
    private String issAcceptName;

    //ISS_CREATOR_NAME:录入人姓名
    private String issCreatorName;

    //ISS_CREATOR_ID:录入人ID
    private String issCreatorId;

    //ISS_CREATOR_DATE:录入时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date issCreatorDate;

    //ISS_HANDLER_NAME:分配给-处理人名称
    private String issHandlerName;

    //ISS_HANDLER_ID:分配给-处理人ID
    private String issHandlerId;

    //ISS_HANDLER_SEND_DATE:分配给-分配时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date issHandlerSendDate;

    //ISS_HANDLER_END_DATE:分配给-处理时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date issHandlerEndDate;

    //ISS_STATUS:处理状态:(新建,重新打开,延期,建议拒绝,已解决,已发布[测试环境],已发布[生产环境],已关闭[测试环境],已关闭[生产环境])
    private String issStatus;

    //ISS_CLOSER_NAME:关闭人姓名
    private String issCloserName;

    //ISS_CLOSER_ID:关闭人ID
    private String issCloserId;

    //ISS_CLOSER_DATE:关闭时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date issCloserDate;

    //ISS_PROCESSING_MESSAGE:处理方案:内部
    private String issProcessingMessage;

    //ISS_ABOUT_TO_OUT:关联第三方:(XX,XX,XX)
    private String issAboutToOut;

    //ISS_ORDER_NUM:排序号
    private Integer issOrderNum;

    /**
     * 构造函数
     * @param issId
     * @param issNum 序号
     * @param issTitle 标题
     * @param issSimpleContent 内容简介
     * @param issProjectId 所属项目ID
     * @param issSysName 所属系统
     * @param issSysCategory 所属系统类别
     * @param issSysVersion 所属系统版本号
     * @param issSysModuleName 所属模块
     * @param issSysPhase 系统状况
     * @param issType 种类
     * @param issLevel 严重程度
     * @param issPriority 优先级
     * @param issIsRepeat 可重现
     * @param issSource 来源
     * @param issCustomerUnit 客户-单位
     * @param issCustomerName 客户-姓名
     * @param issCustomerMobile 客户-电话
     * @param issAcceptFrom 受理方式
     * @param issAcceptDate 受理时间
     * @param issAcceptName 受理人
     * @param issCreatorName 录入人姓名
     * @param issCreatorId 录入人ID
     * @param issCreatorDate 录入时间
     * @param issHandlerName 分配给-处理人名称
     * @param issHandlerId 分配给-处理人ID
     * @param issHandlerSendDate 分配给-分配时间
     * @param issHandlerEndDate 分配给-处理时间
     * @param issStatus 处理状态
     * @param issCloserName 关闭人姓名
     * @param issCloserId 关闭人ID
     * @param issCloserDate 关闭时间
     * @param issProcessingMessage 处理方案
     * @param issAboutToOut 关联第三方
     * @param issOrderNum 排序号
     **/
    public IssuesEntity(String issId, String issNum, String issTitle, String issSimpleContent, String issProjectId, String issSysName, String issSysCategory, String issSysVersion, String issSysModuleName, String issSysPhase, String issType, String issLevel, String issPriority, String issIsRepeat, String issSource, String issCustomerUnit, String issCustomerName, String issCustomerMobile, String issAcceptFrom, Date issAcceptDate, String issAcceptName, String issCreatorName, String issCreatorId, Date issCreatorDate, String issHandlerName, String issHandlerId, Date issHandlerSendDate, Date issHandlerEndDate, String issStatus, String issCloserName, String issCloserId, Date issCloserDate, String issProcessingMessage, String issAboutToOut, Integer issOrderNum) {
        this.issId = issId;
        this.issNum = issNum;
        this.issTitle = issTitle;
        this.issSimpleContent = issSimpleContent;
        this.issProjectId = issProjectId;
        this.issSysName = issSysName;
        this.issSysCategory = issSysCategory;
        this.issSysVersion = issSysVersion;
        this.issSysModuleName = issSysModuleName;
        this.issSysPhase = issSysPhase;
        this.issType = issType;
        this.issLevel = issLevel;
        this.issPriority = issPriority;
        this.issIsRepeat = issIsRepeat;
        this.issSource = issSource;
        this.issCustomerUnit = issCustomerUnit;
        this.issCustomerName = issCustomerName;
        this.issCustomerMobile = issCustomerMobile;
        this.issAcceptFrom = issAcceptFrom;
        this.issAcceptDate = issAcceptDate;
        this.issAcceptName = issAcceptName;
        this.issCreatorName = issCreatorName;
        this.issCreatorId = issCreatorId;
        this.issCreatorDate = issCreatorDate;
        this.issHandlerName = issHandlerName;
        this.issHandlerId = issHandlerId;
        this.issHandlerSendDate = issHandlerSendDate;
        this.issHandlerEndDate = issHandlerEndDate;
        this.issStatus = issStatus;
        this.issCloserName = issCloserName;
        this.issCloserId = issCloserId;
        this.issCloserDate = issCloserDate;
        this.issProcessingMessage = issProcessingMessage;
        this.issAboutToOut = issAboutToOut;
        this.issOrderNum = issOrderNum;
    }

    public IssuesEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getIssId() {
        return issId;
    }

    /**
     *
     * @param issId
     **/
    public void setIssId(String issId) {
        this.issId = issId == null ? null : issId.trim();
    }

    /**
     * 序号
     * @return java.lang.String
     **/
    public String getIssNum() {
        return issNum;
    }

    /**
     * 序号
     * @param issNum 序号
     **/
    public void setIssNum(String issNum) {
        this.issNum = issNum == null ? null : issNum.trim();
    }

    /**
     * 标题
     * @return java.lang.String
     **/
    public String getIssTitle() {
        return issTitle;
    }

    /**
     * 标题
     * @param issTitle 标题
     **/
    public void setIssTitle(String issTitle) {
        this.issTitle = issTitle == null ? null : issTitle.trim();
    }

    /**
     * 内容简介
     * @return java.lang.String
     **/
    public String getIssSimpleContent() {
        return issSimpleContent;
    }

    /**
     * 内容简介
     * @param issSimpleContent 内容简介
     **/
    public void setIssSimpleContent(String issSimpleContent) {
        this.issSimpleContent = issSimpleContent == null ? null : issSimpleContent.trim();
    }

    /**
     * 所属项目ID
     * @return java.lang.String
     **/
    public String getIssProjectId() {
        return issProjectId;
    }

    /**
     * 所属项目ID
     * @param issProjectId 所属项目ID
     **/
    public void setIssProjectId(String issProjectId) {
        this.issProjectId = issProjectId == null ? null : issProjectId.trim();
    }

    /**
     * 所属系统
     * @return java.lang.String
     **/
    public String getIssSysName() {
        return issSysName;
    }

    /**
     * 所属系统
     * @param issSysName 所属系统
     **/
    public void setIssSysName(String issSysName) {
        this.issSysName = issSysName == null ? null : issSysName.trim();
    }

    /**
     * 所属系统类别:(Web后台,Web网站,后台服务,安卓APP,IOS,微信公众号)
     * @return java.lang.String
     **/
    public String getIssSysCategory() {
        return issSysCategory;
    }

    /**
     * 所属系统类别:(Web后台,Web网站,后台服务,安卓APP,IOS,微信公众号)
     * @param issSysCategory 所属系统类别
     **/
    public void setIssSysCategory(String issSysCategory) {
        this.issSysCategory = issSysCategory == null ? null : issSysCategory.trim();
    }

    /**
     * 所属系统版本号
     * @return java.lang.String
     **/
    public String getIssSysVersion() {
        return issSysVersion;
    }

    /**
     * 所属系统版本号
     * @param issSysVersion 所属系统版本号
     **/
    public void setIssSysVersion(String issSysVersion) {
        this.issSysVersion = issSysVersion == null ? null : issSysVersion.trim();
    }

    /**
     * 所属模块
     * @return java.lang.String
     **/
    public String getIssSysModuleName() {
        return issSysModuleName;
    }

    /**
     * 所属模块
     * @param issSysModuleName 所属模块
     **/
    public void setIssSysModuleName(String issSysModuleName) {
        this.issSysModuleName = issSysModuleName == null ? null : issSysModuleName.trim();
    }

    /**
     * 系统状况:(开发中,运维中)
     * @return java.lang.String
     **/
    public String getIssSysPhase() {
        return issSysPhase;
    }

    /**
     * 系统状况:(开发中,运维中)
     * @param issSysPhase 系统状况
     **/
    public void setIssSysPhase(String issSysPhase) {
        this.issSysPhase = issSysPhase == null ? null : issSysPhase.trim();
    }

    /**
     * 种类:(缺陷,需求变更,新需求,咨询,运维)
     * @return java.lang.String
     **/
    public String getIssType() {
        return issType;
    }

    /**
     * 种类:(缺陷,需求变更,新需求,咨询,运维)
     * @param issType 种类
     **/
    public void setIssType(String issType) {
        this.issType = issType == null ? null : issType.trim();
    }

    /**
     * 严重程度:(高,中,低)
     * @return java.lang.String
     **/
    public String getIssLevel() {
        return issLevel;
    }

    /**
     * 严重程度:(高,中,低)
     * @param issLevel 严重程度
     **/
    public void setIssLevel(String issLevel) {
        this.issLevel = issLevel == null ? null : issLevel.trim();
    }

    /**
     * 优先级:(高,中,低)
     * @return java.lang.String
     **/
    public String getIssPriority() {
        return issPriority;
    }

    /**
     * 优先级:(高,中,低)
     * @param issPriority 优先级
     **/
    public void setIssPriority(String issPriority) {
        this.issPriority = issPriority == null ? null : issPriority.trim();
    }

    /**
     * 可重现:(是,否)
     * @return java.lang.String
     **/
    public String getIssIsRepeat() {
        return issIsRepeat;
    }

    /**
     * 可重现:(是,否)
     * @param issIsRepeat 可重现
     **/
    public void setIssIsRepeat(String issIsRepeat) {
        this.issIsRepeat = issIsRepeat == null ? null : issIsRepeat.trim();
    }

    /**
     * 来源:(项目组,客户)
     * @return java.lang.String
     **/
    public String getIssSource() {
        return issSource;
    }

    /**
     * 来源:(项目组,客户)
     * @param issSource 来源
     **/
    public void setIssSource(String issSource) {
        this.issSource = issSource == null ? null : issSource.trim();
    }

    /**
     * 客户-单位
     * @return java.lang.String
     **/
    public String getIssCustomerUnit() {
        return issCustomerUnit;
    }

    /**
     * 客户-单位
     * @param issCustomerUnit 客户-单位
     **/
    public void setIssCustomerUnit(String issCustomerUnit) {
        this.issCustomerUnit = issCustomerUnit == null ? null : issCustomerUnit.trim();
    }

    /**
     * 客户-姓名
     * @return java.lang.String
     **/
    public String getIssCustomerName() {
        return issCustomerName;
    }

    /**
     * 客户-姓名
     * @param issCustomerName 客户-姓名
     **/
    public void setIssCustomerName(String issCustomerName) {
        this.issCustomerName = issCustomerName == null ? null : issCustomerName.trim();
    }

    /**
     * 客户-电话
     * @return java.lang.String
     **/
    public String getIssCustomerMobile() {
        return issCustomerMobile;
    }

    /**
     * 客户-电话
     * @param issCustomerMobile 客户-电话
     **/
    public void setIssCustomerMobile(String issCustomerMobile) {
        this.issCustomerMobile = issCustomerMobile == null ? null : issCustomerMobile.trim();
    }

    /**
     * 受理方式:(QQ群,QQ,电话,微信群,微信,邮件)
     * @return java.lang.String
     **/
    public String getIssAcceptFrom() {
        return issAcceptFrom;
    }

    /**
     * 受理方式:(QQ群,QQ,电话,微信群,微信,邮件)
     * @param issAcceptFrom 受理方式
     **/
    public void setIssAcceptFrom(String issAcceptFrom) {
        this.issAcceptFrom = issAcceptFrom == null ? null : issAcceptFrom.trim();
    }

    /**
     * 受理时间
     * @return java.util.Date
     **/
    public Date getIssAcceptDate() {
        return issAcceptDate;
    }

    /**
     * 受理时间
     * @param issAcceptDate 受理时间
     **/
    public void setIssAcceptDate(Date issAcceptDate) {
        this.issAcceptDate = issAcceptDate;
    }

    /**
     * 受理人
     * @return java.lang.String
     **/
    public String getIssAcceptName() {
        return issAcceptName;
    }

    /**
     * 受理人
     * @param issAcceptName 受理人
     **/
    public void setIssAcceptName(String issAcceptName) {
        this.issAcceptName = issAcceptName == null ? null : issAcceptName.trim();
    }

    /**
     * 录入人姓名
     * @return java.lang.String
     **/
    public String getIssCreatorName() {
        return issCreatorName;
    }

    /**
     * 录入人姓名
     * @param issCreatorName 录入人姓名
     **/
    public void setIssCreatorName(String issCreatorName) {
        this.issCreatorName = issCreatorName == null ? null : issCreatorName.trim();
    }

    /**
     * 录入人ID
     * @return java.lang.String
     **/
    public String getIssCreatorId() {
        return issCreatorId;
    }

    /**
     * 录入人ID
     * @param issCreatorId 录入人ID
     **/
    public void setIssCreatorId(String issCreatorId) {
        this.issCreatorId = issCreatorId == null ? null : issCreatorId.trim();
    }

    /**
     * 录入时间
     * @return java.util.Date
     **/
    public Date getIssCreatorDate() {
        return issCreatorDate;
    }

    /**
     * 录入时间
     * @param issCreatorDate 录入时间
     **/
    public void setIssCreatorDate(Date issCreatorDate) {
        this.issCreatorDate = issCreatorDate;
    }

    /**
     * 分配给-处理人名称
     * @return java.lang.String
     **/
    public String getIssHandlerName() {
        return issHandlerName;
    }

    /**
     * 分配给-处理人名称
     * @param issHandlerName 分配给-处理人名称
     **/
    public void setIssHandlerName(String issHandlerName) {
        this.issHandlerName = issHandlerName == null ? null : issHandlerName.trim();
    }

    /**
     * 分配给-处理人ID
     * @return java.lang.String
     **/
    public String getIssHandlerId() {
        return issHandlerId;
    }

    /**
     * 分配给-处理人ID
     * @param issHandlerId 分配给-处理人ID
     **/
    public void setIssHandlerId(String issHandlerId) {
        this.issHandlerId = issHandlerId == null ? null : issHandlerId.trim();
    }

    /**
     * 分配给-分配时间
     * @return java.util.Date
     **/
    public Date getIssHandlerSendDate() {
        return issHandlerSendDate;
    }

    /**
     * 分配给-分配时间
     * @param issHandlerSendDate 分配给-分配时间
     **/
    public void setIssHandlerSendDate(Date issHandlerSendDate) {
        this.issHandlerSendDate = issHandlerSendDate;
    }

    /**
     * 分配给-处理时间
     * @return java.util.Date
     **/
    public Date getIssHandlerEndDate() {
        return issHandlerEndDate;
    }

    /**
     * 分配给-处理时间
     * @param issHandlerEndDate 分配给-处理时间
     **/
    public void setIssHandlerEndDate(Date issHandlerEndDate) {
        this.issHandlerEndDate = issHandlerEndDate;
    }

    /**
     * 处理状态:(新建,重新打开,延期,建议拒绝,已解决,已发布[测试环境],已发布[生产环境],已关闭[测试环境],已关闭[生产环境])
     * @return java.lang.String
     **/
    public String getIssStatus() {
        return issStatus;
    }

    /**
     * 处理状态:(新建,重新打开,延期,建议拒绝,已解决,已发布[测试环境],已发布[生产环境],已关闭[测试环境],已关闭[生产环境])
     * @param issStatus 处理状态
     **/
    public void setIssStatus(String issStatus) {
        this.issStatus = issStatus == null ? null : issStatus.trim();
    }

    /**
     * 关闭人姓名
     * @return java.lang.String
     **/
    public String getIssCloserName() {
        return issCloserName;
    }

    /**
     * 关闭人姓名
     * @param issCloserName 关闭人姓名
     **/
    public void setIssCloserName(String issCloserName) {
        this.issCloserName = issCloserName == null ? null : issCloserName.trim();
    }

    /**
     * 关闭人ID
     * @return java.lang.String
     **/
    public String getIssCloserId() {
        return issCloserId;
    }

    /**
     * 关闭人ID
     * @param issCloserId 关闭人ID
     **/
    public void setIssCloserId(String issCloserId) {
        this.issCloserId = issCloserId == null ? null : issCloserId.trim();
    }

    /**
     * 关闭时间
     * @return java.util.Date
     **/
    public Date getIssCloserDate() {
        return issCloserDate;
    }

    /**
     * 关闭时间
     * @param issCloserDate 关闭时间
     **/
    public void setIssCloserDate(Date issCloserDate) {
        this.issCloserDate = issCloserDate;
    }

    /**
     * 处理方案:内部
     * @return java.lang.String
     **/
    public String getIssProcessingMessage() {
        return issProcessingMessage;
    }

    /**
     * 处理方案:内部
     * @param issProcessingMessage 处理方案
     **/
    public void setIssProcessingMessage(String issProcessingMessage) {
        this.issProcessingMessage = issProcessingMessage == null ? null : issProcessingMessage.trim();
    }

    /**
     * 关联第三方:(XX,XX,XX)
     * @return java.lang.String
     **/
    public String getIssAboutToOut() {
        return issAboutToOut;
    }

    /**
     * 关联第三方:(XX,XX,XX)
     * @param issAboutToOut 关联第三方
     **/
    public void setIssAboutToOut(String issAboutToOut) {
        this.issAboutToOut = issAboutToOut == null ? null : issAboutToOut.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getIssOrderNum() {
        return issOrderNum;
    }

    /**
     * 排序号
     * @param issOrderNum 排序号
     **/
    public void setIssOrderNum(Integer issOrderNum) {
        this.issOrderNum = issOrderNum;
    }
}