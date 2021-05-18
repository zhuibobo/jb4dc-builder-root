package com.jb4dc.workflow.po.receive;

import com.jb4dc.base.service.po.ZTreeNodePO;

import java.util.ArrayList;
import java.util.List;

public class RuntimeReceiverGroup extends ZTreeNodePO {
    protected String name;
    protected String id;
    protected String code;
    protected boolean isGroup;
    protected boolean isCustName;
    protected String typeName; //flowAboutUser,Users,Organs,Role,ExcludeUsers
    protected String desc;
    protected String status;
    protected String filter;
    protected int orderNum;


    protected List<RuntimeReceiverUser> runtimeReceiveUsers;

    public RuntimeReceiverGroup() {

    }

    public RuntimeReceiverGroup(String name, String id, String code, boolean isGroup, boolean isCustName, String typeName, String desc, String status, String filter, int orderNum) {
        this.name = name;
        this.id = id;
        this.code = code;
        this.isGroup = isGroup;
        this.isCustName = isCustName;
        this.typeName = typeName;
        this.desc = desc;
        this.status = status;
        this.filter = filter;
        this.orderNum = orderNum;
        this.isParent="false";
        this.open=true;
        runtimeReceiveUsers=new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public boolean isGroup() {
        return isGroup;
    }

    public void setGroup(boolean group) {
        isGroup = group;
    }

    public boolean isCustName() {
        return isCustName;
    }

    public void setCustName(boolean custName) {
        isCustName = custName;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFilter() {
        return filter;
    }

    public void setFilter(String filter) {
        this.filter = filter;
    }

    public int getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(int orderNum) {
        this.orderNum = orderNum;
    }

    public List<RuntimeReceiverUser> getRuntimeReceiveUsers() {
        return runtimeReceiveUsers;
    }

    public void setRuntimeReceiveUsers(List<RuntimeReceiverUser> runtimeReceiveUsers) {
        this.runtimeReceiveUsers = runtimeReceiveUsers;
    }
}
