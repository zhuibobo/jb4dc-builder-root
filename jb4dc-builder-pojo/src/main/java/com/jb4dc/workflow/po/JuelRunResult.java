package com.jb4dc.workflow.po;

public class JuelRunResult {
    private boolean success;
    private String message;
    private String stringResult;
    private boolean booleanResult;

    public JuelRunResult(boolean success, String message, String stringResult, boolean booleanResult) {
        this.success = success;
        this.message = message;
        this.stringResult = stringResult;
        this.booleanResult = booleanResult;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getStringResult() {
        return stringResult;
    }

    public boolean getBooleanResult() {
        return booleanResult;
    }
}
