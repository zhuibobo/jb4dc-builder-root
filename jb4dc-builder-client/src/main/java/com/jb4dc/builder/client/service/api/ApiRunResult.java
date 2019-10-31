package com.jb4dc.builder.client.service.api;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/1
 * To change this template use File | Settings | File Templates.
 */
public class ApiRunResult {
    private boolean success = true;
    private String message = "";

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

    public static ApiRunResult successResult(){
        ApiRunResult apiRunResult=new ApiRunResult();
        apiRunResult.setSuccess(true);
        apiRunResult.setMessage("");
        return apiRunResult;
    }
}
