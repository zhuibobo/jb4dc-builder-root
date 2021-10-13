package com.jb4dc.workflow.searchmodel;

import com.jb4dc.base.service.search.SearchModel;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.Date;

public class ExecutionTaskSearchModel extends SearchModel {
    String instanceTitle;
    Date instanceStartDateBegin;
    Date instanceStartDateEnd;

    String modelCategory;
    String extaskType;

    String linkId;

    JB4DCSession jb4DCSession;

    public String getInstanceTitle() {
        return instanceTitle;
    }

    public void setInstanceTitle(String instanceTitle) {
        this.instanceTitle = instanceTitle;
    }

    public Date getInstanceStartDateBegin() {
        return instanceStartDateBegin;
    }

    public void setInstanceStartDateBegin(Date instanceStartDateBegin) {
        this.instanceStartDateBegin = instanceStartDateBegin;
    }

    public Date getInstanceStartDateEnd() {
        return instanceStartDateEnd;
    }

    public void setInstanceStartDateEnd(Date instanceStartDateEnd) {
        this.instanceStartDateEnd = instanceStartDateEnd;
    }

    public String getModelCategory() {
        return modelCategory;
    }

    public void setModelCategory(String modelCategory) {
        this.modelCategory = modelCategory;
    }

    public String getExtaskType() {
        return extaskType;
    }

    public void setExtaskType(String extaskType) {
        this.extaskType = extaskType;
    }

    public String getLinkId() {
        return linkId;
    }

    public void setLinkId(String linkId) {
        this.linkId = linkId;
    }

    public JB4DCSession getJb4DCSession() {
        return jb4DCSession;
    }

    public void setJb4DCSession(JB4DCSession jb4DCSession) {
        this.jb4DCSession = jb4DCSession;
    }
}
