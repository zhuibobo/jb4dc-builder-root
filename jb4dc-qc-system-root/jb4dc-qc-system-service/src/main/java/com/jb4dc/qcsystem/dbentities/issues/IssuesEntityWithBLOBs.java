package com.jb4dc.qcsystem.dbentities.issues;

import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tqc_issues
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class IssuesEntityWithBLOBs extends IssuesEntity {
    //ISS_CONTENT:内容详情
    private String issContent;

    //ISS_SOLUTION:解决方案
    private String issSolution;

    public IssuesEntityWithBLOBs(String issId, String issNum, String issTitle, String issSimpleContent, String issProjectId, String issSysName, String issSysCategory, String issSysVersion, String issSysModuleName, String issSysPhase, String issType, String issLevel, String issPriority, String issIsRepeat, String issSource, String issCustomerUnit, String issCustomerName, String issCustomerMobile, String issAcceptFrom, Date issAcceptDate, String issAcceptName, String issCreatorName, String issCreatorId, Date issCreatorDate, String issHandlerName, String issHandlerId, Date issHandlerSendDate, Date issHandlerEndDate, String issStatus, String issCloserName, String issCloserId, Date issCloserDate, String issProcessingMessage, String issAboutToOut, Integer issOrderNum, String issContent, String issSolution) {
        super(issId, issNum, issTitle, issSimpleContent, issProjectId, issSysName, issSysCategory, issSysVersion, issSysModuleName, issSysPhase, issType, issLevel, issPriority, issIsRepeat, issSource, issCustomerUnit, issCustomerName, issCustomerMobile, issAcceptFrom, issAcceptDate, issAcceptName, issCreatorName, issCreatorId, issCreatorDate, issHandlerName, issHandlerId, issHandlerSendDate, issHandlerEndDate, issStatus, issCloserName, issCloserId, issCloserDate, issProcessingMessage, issAboutToOut, issOrderNum);
        this.issContent = issContent;
        this.issSolution = issSolution;
    }

    public IssuesEntityWithBLOBs() {
        super();
    }

    public String getIssContent() {
        return issContent;
    }

    public void setIssContent(String issContent) {
        this.issContent = issContent == null ? null : issContent.trim();
    }

    public String getIssSolution() {
        return issSolution;
    }

    public void setIssSolution(String issSolution) {
        this.issSolution = issSolution == null ? null : issSolution.trim();
    }
}