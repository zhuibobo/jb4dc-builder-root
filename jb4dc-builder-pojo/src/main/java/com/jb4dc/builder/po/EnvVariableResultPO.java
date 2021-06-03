package com.jb4dc.builder.po;

public class EnvVariableResultPO {
    private String value;
    private boolean success;
    private String dataType;
    private String message;

    public EnvVariableResultPO(String value) {
        this.value = value;
        this.dataType="String";
        this.message="";
        this.success=true;
    }

    public EnvVariableResultPO(String value, boolean success, String dataType, String message) {
        this.value = value;
        this.success = success;
        this.dataType = dataType;
        this.message = message;
    }

    public String getValue() {
        return value;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getDataType() {
        return dataType;
    }

    public String getMessage() {
        return message;
    }
}
