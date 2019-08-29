package com.jb4dc.builder.dbentities.envvar;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_ENV_VARIABLE
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class EnvVariableEntity {
    //ENV_VAR_ID:主键:UUID
    @DBKeyField
    private String envVarId;

    //ENV_VAR_VALUE:环境变量的Value:必须唯一
    private String envVarValue;

    //ENV_VAR_TEXT:环境变量的显示文本
    private String envVarText;

    //ENV_VAR_CLASS_NAME:处理类名称
    private String envVarClassName;

    //ENV_VAR_CLASS_PARA:处理方法参数
    private String envVarClassPara;

    //ENV_VAR_GROUP_ID:分组ID:环境变量所属的分组的ID
    private String envVarGroupId;

    //ENV_VAR_ORDER_NUM:排序号
    private Integer envVarOrderNum;

    //ENV_VAR_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date envVarCreateTime;

    //ENV_VAR_IS_SYSTEM:是否是系统环境变量
    private String envVarIsSystem;

    //ENV_VAR_DEL_ENABLE:能否删除
    private String envVarDelEnable;

    //ENV_VAR_STATUS:状态:启用,禁用
    private String envVarStatus;

    //ENV_VAR_DESC:备注
    private String envVarDesc;

    //ENV_VAR_EX_ATTR1:扩展属性1:用于开发
    private String envVarExAttr1;

    //ENV_VAR_EX_ATTR2:扩展属性2:用于开发
    private String envVarExAttr2;

    //ENV_VAR_EX_ATTR3:扩展属性3:用于开发
    private String envVarExAttr3;

    //ENV_VAR_EX_ATTR4:扩展属性4:用于开发
    private String envVarExAttr4;

    //ENV_VAR_USER_ID:创建用户ID
    private String envVarUserId;

    //ENV_VAR_USER_NAME:创建用户名称
    private String envVarUserName;

    //ENV_VAR_ORGAN_ID:创建组织ID
    private String envVarOrganId;

    //ENV_VAR_ORGAN_NAME:创建组织名称
    private String envVarOrganName;

    /**
     * 构造函数
     * @param envVarId 主键
     * @param envVarValue 环境变量的Value
     * @param envVarText 环境变量的显示文本
     * @param envVarClassName 处理类名称
     * @param envVarClassPara 处理方法参数
     * @param envVarGroupId 分组ID
     * @param envVarOrderNum 排序号
     * @param envVarCreateTime 创建时间
     * @param envVarIsSystem 是否是系统环境变量
     * @param envVarDelEnable 能否删除
     * @param envVarStatus 状态
     * @param envVarDesc 备注
     * @param envVarExAttr1 扩展属性1
     * @param envVarExAttr2 扩展属性2
     * @param envVarExAttr3 扩展属性3
     * @param envVarExAttr4 扩展属性4
     * @param envVarUserId 创建用户ID
     * @param envVarUserName 创建用户名称
     * @param envVarOrganId 创建组织ID
     * @param envVarOrganName 创建组织名称
     **/
    public EnvVariableEntity(String envVarId, String envVarValue, String envVarText, String envVarClassName, String envVarClassPara, String envVarGroupId, Integer envVarOrderNum, Date envVarCreateTime, String envVarIsSystem, String envVarDelEnable, String envVarStatus, String envVarDesc, String envVarExAttr1, String envVarExAttr2, String envVarExAttr3, String envVarExAttr4, String envVarUserId, String envVarUserName, String envVarOrganId, String envVarOrganName) {
        this.envVarId = envVarId;
        this.envVarValue = envVarValue;
        this.envVarText = envVarText;
        this.envVarClassName = envVarClassName;
        this.envVarClassPara = envVarClassPara;
        this.envVarGroupId = envVarGroupId;
        this.envVarOrderNum = envVarOrderNum;
        this.envVarCreateTime = envVarCreateTime;
        this.envVarIsSystem = envVarIsSystem;
        this.envVarDelEnable = envVarDelEnable;
        this.envVarStatus = envVarStatus;
        this.envVarDesc = envVarDesc;
        this.envVarExAttr1 = envVarExAttr1;
        this.envVarExAttr2 = envVarExAttr2;
        this.envVarExAttr3 = envVarExAttr3;
        this.envVarExAttr4 = envVarExAttr4;
        this.envVarUserId = envVarUserId;
        this.envVarUserName = envVarUserName;
        this.envVarOrganId = envVarOrganId;
        this.envVarOrganName = envVarOrganName;
    }

    public EnvVariableEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getEnvVarId() {
        return envVarId;
    }

    /**
     * 主键:UUID
     * @param envVarId 主键
     **/
    public void setEnvVarId(String envVarId) {
        this.envVarId = envVarId == null ? null : envVarId.trim();
    }

    /**
     * 环境变量的Value:必须唯一
     * @return java.lang.String
     **/
    public String getEnvVarValue() {
        return envVarValue;
    }

    /**
     * 环境变量的Value:必须唯一
     * @param envVarValue 环境变量的Value
     **/
    public void setEnvVarValue(String envVarValue) {
        this.envVarValue = envVarValue == null ? null : envVarValue.trim();
    }

    /**
     * 环境变量的显示文本
     * @return java.lang.String
     **/
    public String getEnvVarText() {
        return envVarText;
    }

    /**
     * 环境变量的显示文本
     * @param envVarText 环境变量的显示文本
     **/
    public void setEnvVarText(String envVarText) {
        this.envVarText = envVarText == null ? null : envVarText.trim();
    }

    /**
     * 处理类名称
     * @return java.lang.String
     **/
    public String getEnvVarClassName() {
        return envVarClassName;
    }

    /**
     * 处理类名称
     * @param envVarClassName 处理类名称
     **/
    public void setEnvVarClassName(String envVarClassName) {
        this.envVarClassName = envVarClassName == null ? null : envVarClassName.trim();
    }

    /**
     * 处理方法参数
     * @return java.lang.String
     **/
    public String getEnvVarClassPara() {
        return envVarClassPara;
    }

    /**
     * 处理方法参数
     * @param envVarClassPara 处理方法参数
     **/
    public void setEnvVarClassPara(String envVarClassPara) {
        this.envVarClassPara = envVarClassPara == null ? null : envVarClassPara.trim();
    }

    /**
     * 分组ID:环境变量所属的分组的ID
     * @return java.lang.String
     **/
    public String getEnvVarGroupId() {
        return envVarGroupId;
    }

    /**
     * 分组ID:环境变量所属的分组的ID
     * @param envVarGroupId 分组ID
     **/
    public void setEnvVarGroupId(String envVarGroupId) {
        this.envVarGroupId = envVarGroupId == null ? null : envVarGroupId.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getEnvVarOrderNum() {
        return envVarOrderNum;
    }

    /**
     * 排序号
     * @param envVarOrderNum 排序号
     **/
    public void setEnvVarOrderNum(Integer envVarOrderNum) {
        this.envVarOrderNum = envVarOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getEnvVarCreateTime() {
        return envVarCreateTime;
    }

    /**
     * 创建时间
     * @param envVarCreateTime 创建时间
     **/
    public void setEnvVarCreateTime(Date envVarCreateTime) {
        this.envVarCreateTime = envVarCreateTime;
    }

    /**
     * 是否是系统环境变量
     * @return java.lang.String
     **/
    public String getEnvVarIsSystem() {
        return envVarIsSystem;
    }

    /**
     * 是否是系统环境变量
     * @param envVarIsSystem 是否是系统环境变量
     **/
    public void setEnvVarIsSystem(String envVarIsSystem) {
        this.envVarIsSystem = envVarIsSystem == null ? null : envVarIsSystem.trim();
    }

    /**
     * 能否删除
     * @return java.lang.String
     **/
    public String getEnvVarDelEnable() {
        return envVarDelEnable;
    }

    /**
     * 能否删除
     * @param envVarDelEnable 能否删除
     **/
    public void setEnvVarDelEnable(String envVarDelEnable) {
        this.envVarDelEnable = envVarDelEnable == null ? null : envVarDelEnable.trim();
    }

    /**
     * 状态:启用,禁用
     * @return java.lang.String
     **/
    public String getEnvVarStatus() {
        return envVarStatus;
    }

    /**
     * 状态:启用,禁用
     * @param envVarStatus 状态
     **/
    public void setEnvVarStatus(String envVarStatus) {
        this.envVarStatus = envVarStatus == null ? null : envVarStatus.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getEnvVarDesc() {
        return envVarDesc;
    }

    /**
     * 备注
     * @param envVarDesc 备注
     **/
    public void setEnvVarDesc(String envVarDesc) {
        this.envVarDesc = envVarDesc == null ? null : envVarDesc.trim();
    }

    /**
     * 扩展属性1:用于开发
     * @return java.lang.String
     **/
    public String getEnvVarExAttr1() {
        return envVarExAttr1;
    }

    /**
     * 扩展属性1:用于开发
     * @param envVarExAttr1 扩展属性1
     **/
    public void setEnvVarExAttr1(String envVarExAttr1) {
        this.envVarExAttr1 = envVarExAttr1 == null ? null : envVarExAttr1.trim();
    }

    /**
     * 扩展属性2:用于开发
     * @return java.lang.String
     **/
    public String getEnvVarExAttr2() {
        return envVarExAttr2;
    }

    /**
     * 扩展属性2:用于开发
     * @param envVarExAttr2 扩展属性2
     **/
    public void setEnvVarExAttr2(String envVarExAttr2) {
        this.envVarExAttr2 = envVarExAttr2 == null ? null : envVarExAttr2.trim();
    }

    /**
     * 扩展属性3:用于开发
     * @return java.lang.String
     **/
    public String getEnvVarExAttr3() {
        return envVarExAttr3;
    }

    /**
     * 扩展属性3:用于开发
     * @param envVarExAttr3 扩展属性3
     **/
    public void setEnvVarExAttr3(String envVarExAttr3) {
        this.envVarExAttr3 = envVarExAttr3 == null ? null : envVarExAttr3.trim();
    }

    /**
     * 扩展属性4:用于开发
     * @return java.lang.String
     **/
    public String getEnvVarExAttr4() {
        return envVarExAttr4;
    }

    /**
     * 扩展属性4:用于开发
     * @param envVarExAttr4 扩展属性4
     **/
    public void setEnvVarExAttr4(String envVarExAttr4) {
        this.envVarExAttr4 = envVarExAttr4 == null ? null : envVarExAttr4.trim();
    }

    /**
     * 创建用户ID
     * @return java.lang.String
     **/
    public String getEnvVarUserId() {
        return envVarUserId;
    }

    /**
     * 创建用户ID
     * @param envVarUserId 创建用户ID
     **/
    public void setEnvVarUserId(String envVarUserId) {
        this.envVarUserId = envVarUserId == null ? null : envVarUserId.trim();
    }

    /**
     * 创建用户名称
     * @return java.lang.String
     **/
    public String getEnvVarUserName() {
        return envVarUserName;
    }

    /**
     * 创建用户名称
     * @param envVarUserName 创建用户名称
     **/
    public void setEnvVarUserName(String envVarUserName) {
        this.envVarUserName = envVarUserName == null ? null : envVarUserName.trim();
    }

    /**
     * 创建组织ID
     * @return java.lang.String
     **/
    public String getEnvVarOrganId() {
        return envVarOrganId;
    }

    /**
     * 创建组织ID
     * @param envVarOrganId 创建组织ID
     **/
    public void setEnvVarOrganId(String envVarOrganId) {
        this.envVarOrganId = envVarOrganId == null ? null : envVarOrganId.trim();
    }

    /**
     * 创建组织名称
     * @return java.lang.String
     **/
    public String getEnvVarOrganName() {
        return envVarOrganName;
    }

    /**
     * 创建组织名称
     * @param envVarOrganName 创建组织名称
     **/
    public void setEnvVarOrganName(String envVarOrganName) {
        this.envVarOrganName = envVarOrganName == null ? null : envVarOrganName.trim();
    }
}