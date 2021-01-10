package com.jb4dc.gridsystem.exenum;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.core.base.exenum.BaseEnum;

import java.util.HashMap;
import java.util.Map;

public enum StreetEnum {
    YTJDStreet("c510ab60-82a3-4b76-8331-a6bec626e303","澳头街道办"),
    XQJDStreet("09678663-62fc-49dc-942a-bf77eadf1740","西区街道办"),
    XYJDStreet("b97ebc3e-a1b2-4bdc-8860-ad65dcd82d8f","霞涌街道办");

    private String organId;
    private String displayName;

    static Map<Integer,EnableTypeEnum> enumMap=new HashMap<Integer, EnableTypeEnum>();
    static{
        for(EnableTypeEnum type: EnableTypeEnum.values()){
            enumMap.put(type.getValue(), type);
        }
    }

    private StreetEnum(String organId,String displayName) {
        this.organId=organId;
        this.displayName=displayName;
    }

    public String getOrganId() {
        return organId;
    }
    public void setOrganId(String value) {
        this.organId = value;
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
