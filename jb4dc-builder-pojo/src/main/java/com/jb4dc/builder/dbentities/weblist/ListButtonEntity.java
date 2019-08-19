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

    //BUTTON_CAPTION:按钮的标题
    private String buttonCaption;

    //BUTTON_CONTENT:按钮的配置内容
    private String buttonContent;

    //BUTTON_AUTH:按钮绑定的权限ID
    private String buttonAuth;

    //BUTTON_DESC:备注
    private String buttonDesc;

    /**
     * 构造函数
     * @param buttonId 主键
     * @param buttonListId 所属的列表ID
     * @param buttonListElemId 所属的列表ID
     * @param buttonCaption 按钮的标题
     * @param buttonContent 按钮的配置内容
     * @param buttonAuth 按钮绑定的权限ID
     * @param buttonDesc 备注
     **/
    public ListButtonEntity(String buttonId, String buttonListId, String buttonListElemId, String buttonCaption, String buttonContent, String buttonAuth, String buttonDesc) {
        this.buttonId = buttonId;
        this.buttonListId = buttonListId;
        this.buttonListElemId = buttonListElemId;
        this.buttonCaption = buttonCaption;
        this.buttonContent = buttonContent;
        this.buttonAuth = buttonAuth;
        this.buttonDesc = buttonDesc;
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
}