package com.jb4dc.builder.dbentities.api;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_API_ITEM
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ApiItemEntity {
    //API_ITEM_ID:主键:UUID
    @DBKeyField
    private String apiItemId;

    //API_ITEM_VALUE:API的Value:必须唯一
    private String apiItemValue;

    //API_ITEM_TEXT:API的显示文本
    private String apiItemText;

    //API_ITEM_CLASS_NAME:处理类名称
    private String apiItemClassName;

    //API_ITEM_CLASS_PARA:处理方法参数
    private String apiItemClassPara;

    //API_ITEM_REST:REST的API
    private String apiItemRest;

    //API_ITEM_REST_PARA:REST的API变量
    private String apiItemRestPara;

    //API_ITEM_GROUP_ID:分组ID:API所属的分组的ID
    private String apiItemGroupId;

    //API_ITEM_ORDER_NUM:排序号
    private Integer apiItemOrderNum;

    //API_ITEM_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date apiItemCreateTime;

    //API_ITEM_IS_SYSTEM:是否是系统环境变量
    private String apiItemIsSystem;

    //API_ITEM_DEL_ENABLE:能否删除
    private String apiItemDelEnable;

    //API_ITEM_STATUS:状态:启用,禁用
    private String apiItemStatus;

    //API_ITEM_DESC:备注
    private String apiItemDesc;

    //API_ITEM_EX_ATTR1:扩展属性1:用于开发
    private String apiItemExAttr1;

    //API_ITEM_EX_ATTR2:扩展属性2:用于开发
    private String apiItemExAttr2;

    //API_ITEM_EX_ATTR3:扩展属性3:用于开发
    private String apiItemExAttr3;

    //API_ITEM_EX_ATTR4:扩展属性4:用于开发
    private String apiItemExAttr4;

    //API_ITEM_USER_ID:创建用户ID
    private String apiItemUserId;

    //API_ITEM_USER_NAME:创建用户名称
    private String apiItemUserName;

    //API_ITEM_ORGAN_ID:创建组织ID
    private String apiItemOrganId;

    //API_ITEM_ORGAN_NAME:创建组织名称
    private String apiItemOrganName;

    /**
     * 构造函数
     * @param apiItemId 主键
     * @param apiItemValue API的Value
     * @param apiItemText API的显示文本
     * @param apiItemClassName 处理类名称
     * @param apiItemClassPara 处理方法参数
     * @param apiItemRest REST的API
     * @param apiItemRestPara REST的API变量
     * @param apiItemGroupId 分组ID
     * @param apiItemOrderNum 排序号
     * @param apiItemCreateTime 创建时间
     * @param apiItemIsSystem 是否是系统环境变量
     * @param apiItemDelEnable 能否删除
     * @param apiItemStatus 状态
     * @param apiItemDesc 备注
     * @param apiItemExAttr1 扩展属性1
     * @param apiItemExAttr2 扩展属性2
     * @param apiItemExAttr3 扩展属性3
     * @param apiItemExAttr4 扩展属性4
     * @param apiItemUserId 创建用户ID
     * @param apiItemUserName 创建用户名称
     * @param apiItemOrganId 创建组织ID
     * @param apiItemOrganName 创建组织名称
     **/
    public ApiItemEntity(String apiItemId, String apiItemValue, String apiItemText, String apiItemClassName, String apiItemClassPara, String apiItemRest, String apiItemRestPara, String apiItemGroupId, Integer apiItemOrderNum, Date apiItemCreateTime, String apiItemIsSystem, String apiItemDelEnable, String apiItemStatus, String apiItemDesc, String apiItemExAttr1, String apiItemExAttr2, String apiItemExAttr3, String apiItemExAttr4, String apiItemUserId, String apiItemUserName, String apiItemOrganId, String apiItemOrganName) {
        this.apiItemId = apiItemId;
        this.apiItemValue = apiItemValue;
        this.apiItemText = apiItemText;
        this.apiItemClassName = apiItemClassName;
        this.apiItemClassPara = apiItemClassPara;
        this.apiItemRest = apiItemRest;
        this.apiItemRestPara = apiItemRestPara;
        this.apiItemGroupId = apiItemGroupId;
        this.apiItemOrderNum = apiItemOrderNum;
        this.apiItemCreateTime = apiItemCreateTime;
        this.apiItemIsSystem = apiItemIsSystem;
        this.apiItemDelEnable = apiItemDelEnable;
        this.apiItemStatus = apiItemStatus;
        this.apiItemDesc = apiItemDesc;
        this.apiItemExAttr1 = apiItemExAttr1;
        this.apiItemExAttr2 = apiItemExAttr2;
        this.apiItemExAttr3 = apiItemExAttr3;
        this.apiItemExAttr4 = apiItemExAttr4;
        this.apiItemUserId = apiItemUserId;
        this.apiItemUserName = apiItemUserName;
        this.apiItemOrganId = apiItemOrganId;
        this.apiItemOrganName = apiItemOrganName;
    }

    public ApiItemEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getApiItemId() {
        return apiItemId;
    }

    /**
     * 主键:UUID
     * @param apiItemId 主键
     **/
    public void setApiItemId(String apiItemId) {
        this.apiItemId = apiItemId == null ? null : apiItemId.trim();
    }

    /**
     * API的Value:必须唯一
     * @return java.lang.String
     **/
    public String getApiItemValue() {
        return apiItemValue;
    }

    /**
     * API的Value:必须唯一
     * @param apiItemValue API的Value
     **/
    public void setApiItemValue(String apiItemValue) {
        this.apiItemValue = apiItemValue == null ? null : apiItemValue.trim();
    }

    /**
     * API的显示文本
     * @return java.lang.String
     **/
    public String getApiItemText() {
        return apiItemText;
    }

    /**
     * API的显示文本
     * @param apiItemText API的显示文本
     **/
    public void setApiItemText(String apiItemText) {
        this.apiItemText = apiItemText == null ? null : apiItemText.trim();
    }

    /**
     * 处理类名称
     * @return java.lang.String
     **/
    public String getApiItemClassName() {
        return apiItemClassName;
    }

    /**
     * 处理类名称
     * @param apiItemClassName 处理类名称
     **/
    public void setApiItemClassName(String apiItemClassName) {
        this.apiItemClassName = apiItemClassName == null ? null : apiItemClassName.trim();
    }

    /**
     * 处理方法参数
     * @return java.lang.String
     **/
    public String getApiItemClassPara() {
        return apiItemClassPara;
    }

    /**
     * 处理方法参数
     * @param apiItemClassPara 处理方法参数
     **/
    public void setApiItemClassPara(String apiItemClassPara) {
        this.apiItemClassPara = apiItemClassPara == null ? null : apiItemClassPara.trim();
    }

    /**
     * REST的API
     * @return java.lang.String
     **/
    public String getApiItemRest() {
        return apiItemRest;
    }

    /**
     * REST的API
     * @param apiItemRest REST的API
     **/
    public void setApiItemRest(String apiItemRest) {
        this.apiItemRest = apiItemRest == null ? null : apiItemRest.trim();
    }

    /**
     * REST的API变量
     * @return java.lang.String
     **/
    public String getApiItemRestPara() {
        return apiItemRestPara;
    }

    /**
     * REST的API变量
     * @param apiItemRestPara REST的API变量
     **/
    public void setApiItemRestPara(String apiItemRestPara) {
        this.apiItemRestPara = apiItemRestPara == null ? null : apiItemRestPara.trim();
    }

    /**
     * 分组ID:API所属的分组的ID
     * @return java.lang.String
     **/
    public String getApiItemGroupId() {
        return apiItemGroupId;
    }

    /**
     * 分组ID:API所属的分组的ID
     * @param apiItemGroupId 分组ID
     **/
    public void setApiItemGroupId(String apiItemGroupId) {
        this.apiItemGroupId = apiItemGroupId == null ? null : apiItemGroupId.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getApiItemOrderNum() {
        return apiItemOrderNum;
    }

    /**
     * 排序号
     * @param apiItemOrderNum 排序号
     **/
    public void setApiItemOrderNum(Integer apiItemOrderNum) {
        this.apiItemOrderNum = apiItemOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getApiItemCreateTime() {
        return apiItemCreateTime;
    }

    /**
     * 创建时间
     * @param apiItemCreateTime 创建时间
     **/
    public void setApiItemCreateTime(Date apiItemCreateTime) {
        this.apiItemCreateTime = apiItemCreateTime;
    }

    /**
     * 是否是系统环境变量
     * @return java.lang.String
     **/
    public String getApiItemIsSystem() {
        return apiItemIsSystem;
    }

    /**
     * 是否是系统环境变量
     * @param apiItemIsSystem 是否是系统环境变量
     **/
    public void setApiItemIsSystem(String apiItemIsSystem) {
        this.apiItemIsSystem = apiItemIsSystem == null ? null : apiItemIsSystem.trim();
    }

    /**
     * 能否删除
     * @return java.lang.String
     **/
    public String getApiItemDelEnable() {
        return apiItemDelEnable;
    }

    /**
     * 能否删除
     * @param apiItemDelEnable 能否删除
     **/
    public void setApiItemDelEnable(String apiItemDelEnable) {
        this.apiItemDelEnable = apiItemDelEnable == null ? null : apiItemDelEnable.trim();
    }

    /**
     * 状态:启用,禁用
     * @return java.lang.String
     **/
    public String getApiItemStatus() {
        return apiItemStatus;
    }

    /**
     * 状态:启用,禁用
     * @param apiItemStatus 状态
     **/
    public void setApiItemStatus(String apiItemStatus) {
        this.apiItemStatus = apiItemStatus == null ? null : apiItemStatus.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getApiItemDesc() {
        return apiItemDesc;
    }

    /**
     * 备注
     * @param apiItemDesc 备注
     **/
    public void setApiItemDesc(String apiItemDesc) {
        this.apiItemDesc = apiItemDesc == null ? null : apiItemDesc.trim();
    }

    /**
     * 扩展属性1:用于开发
     * @return java.lang.String
     **/
    public String getApiItemExAttr1() {
        return apiItemExAttr1;
    }

    /**
     * 扩展属性1:用于开发
     * @param apiItemExAttr1 扩展属性1
     **/
    public void setApiItemExAttr1(String apiItemExAttr1) {
        this.apiItemExAttr1 = apiItemExAttr1 == null ? null : apiItemExAttr1.trim();
    }

    /**
     * 扩展属性2:用于开发
     * @return java.lang.String
     **/
    public String getApiItemExAttr2() {
        return apiItemExAttr2;
    }

    /**
     * 扩展属性2:用于开发
     * @param apiItemExAttr2 扩展属性2
     **/
    public void setApiItemExAttr2(String apiItemExAttr2) {
        this.apiItemExAttr2 = apiItemExAttr2 == null ? null : apiItemExAttr2.trim();
    }

    /**
     * 扩展属性3:用于开发
     * @return java.lang.String
     **/
    public String getApiItemExAttr3() {
        return apiItemExAttr3;
    }

    /**
     * 扩展属性3:用于开发
     * @param apiItemExAttr3 扩展属性3
     **/
    public void setApiItemExAttr3(String apiItemExAttr3) {
        this.apiItemExAttr3 = apiItemExAttr3 == null ? null : apiItemExAttr3.trim();
    }

    /**
     * 扩展属性4:用于开发
     * @return java.lang.String
     **/
    public String getApiItemExAttr4() {
        return apiItemExAttr4;
    }

    /**
     * 扩展属性4:用于开发
     * @param apiItemExAttr4 扩展属性4
     **/
    public void setApiItemExAttr4(String apiItemExAttr4) {
        this.apiItemExAttr4 = apiItemExAttr4 == null ? null : apiItemExAttr4.trim();
    }

    /**
     * 创建用户ID
     * @return java.lang.String
     **/
    public String getApiItemUserId() {
        return apiItemUserId;
    }

    /**
     * 创建用户ID
     * @param apiItemUserId 创建用户ID
     **/
    public void setApiItemUserId(String apiItemUserId) {
        this.apiItemUserId = apiItemUserId == null ? null : apiItemUserId.trim();
    }

    /**
     * 创建用户名称
     * @return java.lang.String
     **/
    public String getApiItemUserName() {
        return apiItemUserName;
    }

    /**
     * 创建用户名称
     * @param apiItemUserName 创建用户名称
     **/
    public void setApiItemUserName(String apiItemUserName) {
        this.apiItemUserName = apiItemUserName == null ? null : apiItemUserName.trim();
    }

    /**
     * 创建组织ID
     * @return java.lang.String
     **/
    public String getApiItemOrganId() {
        return apiItemOrganId;
    }

    /**
     * 创建组织ID
     * @param apiItemOrganId 创建组织ID
     **/
    public void setApiItemOrganId(String apiItemOrganId) {
        this.apiItemOrganId = apiItemOrganId == null ? null : apiItemOrganId.trim();
    }

    /**
     * 创建组织名称
     * @return java.lang.String
     **/
    public String getApiItemOrganName() {
        return apiItemOrganName;
    }

    /**
     * 创建组织名称
     * @param apiItemOrganName 创建组织名称
     **/
    public void setApiItemOrganName(String apiItemOrganName) {
        this.apiItemOrganName = apiItemOrganName == null ? null : apiItemOrganName.trim();
    }
}