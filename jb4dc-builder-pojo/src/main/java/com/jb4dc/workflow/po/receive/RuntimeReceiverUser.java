package com.jb4dc.workflow.po.receive;

import com.jb4dc.base.service.po.ZTreeNodePO;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import com.jb4dc.sso.dbentities.user.UserEntity;

import java.security.PublicKey;
import java.util.ArrayList;
import java.util.List;

public class RuntimeReceiverUser extends RuntimeReceiverGroup {

    private boolean autoSelected;

    public RuntimeReceiverUser() {
    }

    public RuntimeReceiverUser(String name, String id, String code, boolean isGroup, boolean isCustName, String typeName, String desc, String status, String filter, int orderNum) {
        super(name, id, code, isGroup, isCustName, typeName, desc, status, filter, orderNum);
        this.setIcon("../../../"+ ZTreeNodePO.Icon_Person);
        //this.autoSelected = autoSelected;
    }

    public boolean isAutoSelected() {
        return autoSelected;
    }

    public void setAutoSelected(boolean autoSelected) {
        this.autoSelected = autoSelected;
    }

    public static List<RuntimeReceiverUser> parseUserEntityListToReceiverList(List<UserEntity> userEntityList,String desc) {
        List<RuntimeReceiverUser> result = new ArrayList<>();
        if (userEntityList != null) {
            for (UserEntity userEntity : userEntityList) {
                result.add(parseUserEntityToReceiver(userEntity, desc));
            }
        }
        return result;
    }

    public static RuntimeReceiverUser parseUserEntityToReceiver(UserEntity userEntity,String desc){
        RuntimeReceiverUser runtimeReceiverUser=new RuntimeReceiverUser();
        runtimeReceiverUser.setName(userEntity.getUserName());
        runtimeReceiverUser.setId(userEntity.getUserId());
        runtimeReceiverUser.setDesc(desc);
        runtimeReceiverUser.setStatus("");
        runtimeReceiverUser.setOrderNum(userEntity.getUserOrderNum());
        runtimeReceiverUser.setTypeName("SingleUser");
        runtimeReceiverUser.setIcon("../../../"+ ZTreeNodePO.Icon_Person);
        runtimeReceiverUser.setAutoSelected(false);
        return runtimeReceiverUser;
    }

    public static List<RuntimeReceiverUser> parseOrganEntityListToReceiverList(List<OrganEntity> organEntityList,String desc){
        List<RuntimeReceiverUser> result=new ArrayList<>();
        if (organEntityList!=null) {
            for (OrganEntity organEntity : organEntityList) {
                result.add(parseOrganEntityToReceiver(organEntity, desc));
            }
        }
        return result;
    }

    public static RuntimeReceiverUser parseOrganEntityToReceiver(OrganEntity organEntity,String desc){
        RuntimeReceiverUser runtimeReceiverUser=new RuntimeReceiverUser();
        runtimeReceiverUser.setName(organEntity.getOrganName());
        runtimeReceiverUser.setId(organEntity.getOrganId());
        runtimeReceiverUser.setDesc(desc);
        runtimeReceiverUser.setStatus("");
        runtimeReceiverUser.setOrderNum(organEntity.getOrganOrderNum());
        runtimeReceiverUser.setTypeName("Organs");
        runtimeReceiverUser.setAutoSelected(false);
        runtimeReceiverUser.setRuntimeReceiveUsers(null);
        return runtimeReceiverUser;
    }

    @Override
    public String toString() {
        return "RuntimeReceiverUser{" +
                "name='" + name + '\'' +
                ", id='" + id + '\'' +
                ", typeName='" + typeName + '\'' +
                '}';
    }
}
