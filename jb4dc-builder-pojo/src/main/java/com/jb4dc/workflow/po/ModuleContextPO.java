package com.jb4dc.workflow.po;

import com.jb4dc.base.service.po.ZTreeNodePO;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.dbentities.api.ApiGroupEntity;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.dbentities.envvar.EnvGroupEntity;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import com.jb4dc.sso.dbentities.role.RoleEntity;
import com.jb4dc.sso.dbentities.role.RoleGroupEntity;
import com.jb4dc.sso.dbentities.user.UserEntity;
import com.jb4dc.workflow.dbentities.ModelGroupEntity;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/12/8
 * To change this template use File | Settings | File Templates.
 */
public class ModuleContextPO extends ModuleEntity {
    List<FormResourcePO> formResourcePOList;
    List<ListResourcePO> listResourcePOList;
    List<TableFieldPO> tableFieldPOList;
    /*List<TablePO> tablePOList;表信息存放在表实体中*/
    List<EnvGroupEntity> envGroupPOList;
    List<EnvVariableEntity> envVariablePOList;

    List<OrganEntity> organEntityList;
    List<UserEntity> userEntityList;
    List<RoleGroupEntity> roleGroupEntityList;
    List<RoleEntity> roleEntityList;

    List<ZTreeNodePO> apisForZTreeNodeList;

    List<ModelGroupEntity> modelGroupEntityList;

    public List<FormResourcePO> getFormResourcePOList() {
        return formResourcePOList;
    }

    public void setFormResourcePOList(List<FormResourcePO> formResourcePOList) {
        this.formResourcePOList = formResourcePOList;
    }

    public List<ListResourcePO> getListResourcePOList() {
        return listResourcePOList;
    }

    public void setListResourcePOList(List<ListResourcePO> listResourcePOList) {
        this.listResourcePOList = listResourcePOList;
    }

    /*public List<TablePO> getTablePOList() {
        return tablePOList;
    }

    public void setTablePOList(List<TablePO> tablePOList) {
        this.tablePOList = tablePOList;
    }*/

    public List<EnvGroupEntity> getEnvGroupPOList() {
        return envGroupPOList;
    }

    public void setEnvGroupPOList(List<EnvGroupEntity> envGroupPOList) {
        this.envGroupPOList = envGroupPOList;
    }

    public List<EnvVariableEntity> getEnvVariablePOList() {
        return envVariablePOList;
    }

    public void setEnvVariablePOList(List<EnvVariableEntity> envVariablePOList) {
        this.envVariablePOList = envVariablePOList;
    }

    public List<OrganEntity> getOrganEntityList() {
        return organEntityList;
    }

    public void setOrganEntityList(List<OrganEntity> organEntityList) {
        this.organEntityList = organEntityList;
    }

    public List<UserEntity> getUserEntityList() {
        return userEntityList;
    }

    public void setUserEntityList(List<UserEntity> userEntityList) {
        this.userEntityList = userEntityList;
    }

    public List<RoleGroupEntity> getRoleGroupEntityList() {
        return roleGroupEntityList;
    }

    public void setRoleGroupEntityList(List<RoleGroupEntity> roleGroupEntityList) {
        this.roleGroupEntityList = roleGroupEntityList;
    }

    public List<RoleEntity> getRoleEntityList() {
        return roleEntityList;
    }

    public void setRoleEntityList(List<RoleEntity> roleEntityList) {
        this.roleEntityList = roleEntityList;
    }

    public List<ZTreeNodePO> getApisForZTreeNodeList() {
        return apisForZTreeNodeList;
    }

    public void setApisForZTreeNodeList(List<ZTreeNodePO> apisForZTreeNodeList) {
        this.apisForZTreeNodeList = apisForZTreeNodeList;
    }

    public List<ModelGroupEntity> getModelGroupEntityList() {
        return modelGroupEntityList;
    }

    public void setModelGroupEntityList(List<ModelGroupEntity> modelGroupEntityList) {
        this.modelGroupEntityList = modelGroupEntityList;
    }

    public List<TableFieldPO> getTableFieldPOList() {
        return tableFieldPOList;
    }

    public void setTableFieldPOList(List<TableFieldPO> tableFieldPOList) {
        this.tableFieldPOList = tableFieldPOList;
    }
}
