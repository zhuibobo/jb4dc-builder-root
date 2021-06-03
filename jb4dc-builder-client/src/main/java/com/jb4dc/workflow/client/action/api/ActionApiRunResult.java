package com.jb4dc.workflow.client.action.api;

import java.util.HashMap;
import java.util.Map;

public class ActionApiRunResult {
    private boolean success = true;
    private String message = "";
    private Map<String,Object> appendRunParas;

    public static ActionApiRunResult getSuccessResult(){
        return new ActionApiRunResult(true,"执行成功!",new HashMap<>());
    }

    public static ActionApiRunResult getErrorResult(){
        return new ActionApiRunResult(false,"执行失败!",new HashMap<>());
    }

    public ActionApiRunResult() {
    }

    public ActionApiRunResult(boolean success, String message, Map<String, Object> appendRunParas) {
        this.success = success;
        this.message = message;
        this.appendRunParas = appendRunParas;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, Object> getAppendRunParas() {
        return appendRunParas;
    }

    public void setAppendRunParas(Map<String, Object> appendRunParas) {
        this.appendRunParas = appendRunParas;
    }
}
