package com.jb4dc.workflow.exenum;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.core.base.exenum.BaseEnum;

import java.util.HashMap;
import java.util.Map;

public enum ModelDesignSourceTypeEnum implements BaseEnum<EnableTypeEnum, Integer> {
    builderWebDesign(1,"BuilderWebDesign");

    private Integer value;
    private String displayName;

    static Map<Integer,EnableTypeEnum> enumMap=new HashMap<Integer, EnableTypeEnum>();
    static{
        for(EnableTypeEnum type: EnableTypeEnum.values()){
            enumMap.put(type.getValue(), type);
        }
    }

    private ModelDesignSourceTypeEnum(int value,String displayName) {
        this.value=value;
        this.displayName=displayName;
    }

    public Integer getValue() {
        return value;
    }
    public void setValue(int value) {
        this.value = value;
    }
    public String getDisplayName() {
        return displayName;
    }
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public static EnableTypeEnum getEnum(Integer value) {
        return enumMap.get(value);
    }
}