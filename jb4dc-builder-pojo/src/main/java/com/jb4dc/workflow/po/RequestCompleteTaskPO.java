package com.jb4dc.workflow.po;

public class RequestCompleteTaskPO extends PostRequestWorkFlowRestPO {
    boolean isStartInstanceStatus;
    String selectedReceiverVars;

    public boolean isStartInstanceStatus() {
        return isStartInstanceStatus;
    }

    public void setStartInstanceStatus(boolean startInstanceStatus) {
        isStartInstanceStatus = startInstanceStatus;
    }

    public String getSelectedReceiverVars() {
        return selectedReceiverVars;
    }

    public void setSelectedReceiverVars(String selectedReceiverVars) {
        this.selectedReceiverVars = selectedReceiverVars;
    }
}
