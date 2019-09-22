package com.jb4dc.builder.dbentities.weblist;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_LIST_BUTTON
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ListButtonEntity {
    //BUTTON_ID:主键:使用列表ID与元素的ID合并形成
    @DBKeyField
    private String buttonId;

    //BUTTON_LIST_ID:所属的列表ID
    private String buttonListId;

    //BUTTON_LIST_ELEM_ID:所属的列表ID
    private String buttonListElemId;

    //BUTTON_SINGLE_NAME:控件定义的唯一名称
    private String buttonSingleName;

    //BUTTON_CAPTION:按钮的标题
    private String buttonCaption;

    //BUTTON_CONTENT:按钮的配置内容
    private String buttonContent;

    //BUTTON_AUTH:按钮绑定的权限ID
    private String buttonAuth;

    //BUTTON_RT_CONTENT_RENDERER:运行时的内容解析方法:继承IListButtonRTSeverRenderer
    private String buttonRtContentRenderer;

    //BUTTON_OUTER_ID:按钮外部关联对象的ID:例如窗体
    private String buttonOuterId;

    //BUTTON_CUST_SINGLE_NAME:用户自定义的按钮唯一名称
    private String buttonCustSingleName;

    //BUTTON_CUST_PROP1:用户自定义属性1
    private String buttonCustProp1;

    //BUTTON_CUST_PROP2:用户自定义属性2
    private String buttonCustProp2;

    //BUTTON_CUST_PROP3:用户自定义属性3
    private String buttonCustProp3;

    //BUTTON_CUST_PROP4:用户自定义属性4
    private String buttonCustProp4;

    //BUTTON_DESC:备注
    private String buttonDesc;

    //BUTTON_INNER_CONFIG:按钮的内部配置:例如窗体按钮的innerbuttonjsonstring属性
    private String buttonInnerConfig;

    //BUTTON_OPERATION_TYPE:操作类型:add,update,view
    private String buttonOperationType;

    /**
     * 构造函数
     * @param buttonId 主键
     * @param buttonListId 所属的列表ID
     * @param buttonListElemId 所属的列表ID
     * @param buttonSingleName 控件定义的唯一名称
     * @param buttonCaption 按钮的标题
     * @param buttonContent 按钮的配置内容
     * @param buttonAuth 按钮绑定的权限ID
     * @param buttonRtContentRenderer 运行时的内容解析方法
     * @param buttonOuterId 按钮外部关联对象的ID
     * @param buttonCustSingleName 用户自定义的按钮唯一名称
     * @param buttonCustProp1 用户自定义属性1
     * @param buttonCustProp2 用户自定义属性2
     * @param buttonCustProp3 用户自定义属性3
     * @param buttonCustProp4 用户自定义属性4
     * @param buttonDesc 备注
     * @param buttonInnerConfig 按钮的内部配置
     * @param buttonOperationType 操作类型
     **/
    public ListButtonEntity(String buttonId, String buttonListId, String buttonListElemId, String buttonSingleName, String buttonCaption, String buttonContent, String buttonAuth, String buttonRtContentRenderer, String buttonOuterId, String buttonCustSingleName, String buttonCustProp1, String buttonCustProp2, String buttonCustProp3, String buttonCustProp4, String buttonDesc, String buttonInnerConfig, String buttonOperationType) {
        this.buttonId = buttonId;
        this.buttonListId = buttonListId;
        this.buttonListElemId = buttonListElemId;
        this.buttonSingleName = buttonSingleName;
        this.buttonCaption = buttonCaption;
        this.buttonContent = buttonContent;
        this.buttonAuth = buttonAuth;
        this.buttonRtContentRenderer = buttonRtContentRenderer;
        this.buttonOuterId = buttonOuterId;
        this.buttonCustSingleName = buttonCustSingleName;
        this.buttonCustProp1 = buttonCustProp1;
        this.buttonCustProp2 = buttonCustProp2;
        this.buttonCustProp3 = buttonCustProp3;
        this.buttonCustProp4 = buttonCustProp4;
        this.buttonDesc = buttonDesc;
        this.buttonInnerConfig = buttonInnerConfig;
        this.buttonOperationType = buttonOperationType;
    }

    public ListButtonEntity() {
        super();
    }

    /**
     * 主键:使用列表ID与元素的ID合并形成
     * @return java.lang.String
     **/
    public String getButtonId() {
        return buttonId;
    }

    /**
     * 主键:使用列表ID与元素的ID合并形成
     * @param buttonId 主键
     **/
    public void setButtonId(String buttonId) {
        this.buttonId = buttonId == null ? null : buttonId.trim();
    }

    /**
     * 所属的列表ID
     * @return java.lang.String
     **/
    public String getButtonListId() {
        return buttonListId;
    }

    /**
     * 所属的列表ID
     * @param buttonListId 所属的列表ID
     **/
    public void setButtonListId(String buttonListId) {
        this.buttonListId = buttonListId == null ? null : buttonListId.trim();
    }

    /**
     * 所属的列表ID
     * @return java.lang.String
     **/
    public String getButtonListElemId() {
        return buttonListElemId;
    }

    /**
     * 所属的列表ID
     * @param buttonListElemId 所属的列表ID
     **/
    public void setButtonListElemId(String buttonListElemId) {
        this.buttonListElemId = buttonListElemId == null ? null : buttonListElemId.trim();
    }

    /**
     * 控件定义的唯一名称
     * @return java.lang.String
     **/
    public String getButtonSingleName() {
        return buttonSingleName;
    }

    /**
     * 控件定义的唯一名称
     * @param buttonSingleName 控件定义的唯一名称
     **/
    public void setButtonSingleName(String buttonSingleName) {
        this.buttonSingleName = buttonSingleName == null ? null : buttonSingleName.trim();
    }

    /**
     * 按钮的标题
     * @return java.lang.String
     **/
    public String getButtonCaption() {
        return buttonCaption;
    }

    /**
     * 按钮的标题
     * @param buttonCaption 按钮的标题
     **/
    public void setButtonCaption(String buttonCaption) {
        this.buttonCaption = buttonCaption == null ? null : buttonCaption.trim();
    }

    /**
     * 按钮的配置内容
     * @return java.lang.String
     **/
    public String getButtonContent() {
        return buttonContent;
    }

    /**
     * 按钮的配置内容
     * @param buttonContent 按钮的配置内容
     **/
    public void setButtonContent(String buttonContent) {
        this.buttonContent = buttonContent == null ? null : buttonContent.trim();
    }

    /**
     * 按钮绑定的权限ID
     * @return java.lang.String
     **/
    public String getButtonAuth() {
        return buttonAuth;
    }

    /**
     * 按钮绑定的权限ID
     * @param buttonAuth 按钮绑定的权限ID
     **/
    public void setButtonAuth(String buttonAuth) {
        this.buttonAuth = buttonAuth == null ? null : buttonAuth.trim();
    }

    /**
     * 运行时的内容解析方法:继承IListButtonRTSeverRenderer
     * @return java.lang.String
     **/
    public String getButtonRtContentRenderer() {
        return buttonRtContentRenderer;
    }

    /**
     * 运行时的内容解析方法:继承IListButtonRTSeverRenderer
     * @param buttonRtContentRenderer 运行时的内容解析方法
     **/
    public void setButtonRtContentRenderer(String buttonRtContentRenderer) {
        this.buttonRtContentRenderer = buttonRtContentRenderer == null ? null : buttonRtContentRenderer.trim();
    }

    /**
     * 按钮外部关联对象的ID:例如窗体
     * @return java.lang.String
     **/
    public String getButtonOuterId() {
        return buttonOuterId;
    }

    /**
     * 按钮外部关联对象的ID:例如窗体
     * @param buttonOuterId 按钮外部关联对象的ID
     **/
    public void setButtonOuterId(String buttonOuterId) {
        this.buttonOuterId = buttonOuterId == null ? null : buttonOuterId.trim();
    }

    /**
     * 用户自定义的按钮唯一名称
     * @return java.lang.String
     **/
    public String getButtonCustSingleName() {
        return buttonCustSingleName;
    }

    /**
     * 用户自定义的按钮唯一名称
     * @param buttonCustSingleName 用户自定义的按钮唯一名称
     **/
    public void setButtonCustSingleName(String buttonCustSingleName) {
        this.buttonCustSingleName = buttonCustSingleName == null ? null : buttonCustSingleName.trim();
    }

    /**
     * 用户自定义属性1
     * @return java.lang.String
     **/
    public String getButtonCustProp1() {
        return buttonCustProp1;
    }

    /**
     * 用户自定义属性1
     * @param buttonCustProp1 用户自定义属性1
     **/
    public void setButtonCustProp1(String buttonCustProp1) {
        this.buttonCustProp1 = buttonCustProp1 == null ? null : buttonCustProp1.trim();
    }

    /**
     * 用户自定义属性2
     * @return java.lang.String
     **/
    public String getButtonCustProp2() {
        return buttonCustProp2;
    }

    /**
     * 用户自定义属性2
     * @param buttonCustProp2 用户自定义属性2
     **/
    public void setButtonCustProp2(String buttonCustProp2) {
        this.buttonCustProp2 = buttonCustProp2 == null ? null : buttonCustProp2.trim();
    }

    /**
     * 用户自定义属性3
     * @return java.lang.String
     **/
    public String getButtonCustProp3() {
        return buttonCustProp3;
    }

    /**
     * 用户自定义属性3
     * @param buttonCustProp3 用户自定义属性3
     **/
    public void setButtonCustProp3(String buttonCustProp3) {
        this.buttonCustProp3 = buttonCustProp3 == null ? null : buttonCustProp3.trim();
    }

    /**
     * 用户自定义属性4
     * @return java.lang.String
     **/
    public String getButtonCustProp4() {
        return buttonCustProp4;
    }

    /**
     * 用户自定义属性4
     * @param buttonCustProp4 用户自定义属性4
     **/
    public void setButtonCustProp4(String buttonCustProp4) {
        this.buttonCustProp4 = buttonCustProp4 == null ? null : buttonCustProp4.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getButtonDesc() {
        return buttonDesc;
    }

    /**
     * 备注
     * @param buttonDesc 备注
     **/
    public void setButtonDesc(String buttonDesc) {
        this.buttonDesc = buttonDesc == null ? null : buttonDesc.trim();
    }

    /**
     * 按钮的内部配置:例如窗体按钮的innerbuttonjsonstring属性
     * @return java.lang.String
     **/
    public String getButtonInnerConfig() {
        return buttonInnerConfig;
    }

    /**
     * 按钮的内部配置:例如窗体按钮的innerbuttonjsonstring属性
     * @param buttonInnerConfig 按钮的内部配置
     **/
    public void setButtonInnerConfig(String buttonInnerConfig) {
        this.buttonInnerConfig = buttonInnerConfig == null ? null : buttonInnerConfig.trim();
    }

    /**
     * 操作类型:add,update,view
     * @return java.lang.String
     **/
    public String getButtonOperationType() {
        return buttonOperationType;
    }

    /**
     * 操作类型:add,update,view
     * @param buttonOperationType 操作类型
     **/
    public void setButtonOperationType(String buttonOperationType) {
        this.buttonOperationType = buttonOperationType == null ? null : buttonOperationType.trim();
    }
}