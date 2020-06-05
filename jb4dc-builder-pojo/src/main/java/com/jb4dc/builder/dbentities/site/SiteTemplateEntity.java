package com.jb4dc.builder.dbentities.site;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tbuild_site_template
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class SiteTemplateEntity {
    //TEMPLATE_ID:
    @DBKeyField
    private String templateId;

    //TEMPLATE_FOLDER_ID:文件夹ID
    private String templateFolderId;

    //TEMPLATE_SITE_ID:站点ID
    private String templateSiteId;

    //TEMPLATE_PARENT_ID:父模版ID
    private String templateParentId;

    //TEMPLATE_TYPE:模版类型
    private String templateType;

    //TEMPLATE_NAME:模版名称
    private String templateName;

    //TEMPLATE_FILE_NAME:模版文件名称
    private String templateFileName;

    //TEMPLATE_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date templateCreateTime;

    //TEMPLATE_CREATOR:创建者
    private String templateCreator;

    //TEMPLATE_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date templateUpdateTime;

    //TEMPLATE_UPDATER:更新人
    private String templateUpdater;

    //TEMPLATE_DESC:备注
    private String templateDesc;

    //TEMPLATE_STATUS:状态
    private String templateStatus;

    //TEMPLATE_ORDER_NUM:排序号
    private Integer templateOrderNum;

    /**
     * 构造函数
     * @param templateId
     * @param templateFolderId 文件夹ID
     * @param templateSiteId 站点ID
     * @param templateParentId 父模版ID
     * @param templateType 模版类型
     * @param templateName 模版名称
     * @param templateFileName 模版文件名称
     * @param templateCreateTime 创建时间
     * @param templateCreator 创建者
     * @param templateUpdateTime 更新时间
     * @param templateUpdater 更新人
     * @param templateDesc 备注
     * @param templateStatus 状态
     * @param templateOrderNum 排序号
     **/
    public SiteTemplateEntity(String templateId, String templateFolderId, String templateSiteId, String templateParentId, String templateType, String templateName, String templateFileName, Date templateCreateTime, String templateCreator, Date templateUpdateTime, String templateUpdater, String templateDesc, String templateStatus, Integer templateOrderNum) {
        this.templateId = templateId;
        this.templateFolderId = templateFolderId;
        this.templateSiteId = templateSiteId;
        this.templateParentId = templateParentId;
        this.templateType = templateType;
        this.templateName = templateName;
        this.templateFileName = templateFileName;
        this.templateCreateTime = templateCreateTime;
        this.templateCreator = templateCreator;
        this.templateUpdateTime = templateUpdateTime;
        this.templateUpdater = templateUpdater;
        this.templateDesc = templateDesc;
        this.templateStatus = templateStatus;
        this.templateOrderNum = templateOrderNum;
    }

    public SiteTemplateEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getTemplateId() {
        return templateId;
    }

    /**
     *
     * @param templateId
     **/
    public void setTemplateId(String templateId) {
        this.templateId = templateId == null ? null : templateId.trim();
    }

    /**
     * 文件夹ID
     * @return java.lang.String
     **/
    public String getTemplateFolderId() {
        return templateFolderId;
    }

    /**
     * 文件夹ID
     * @param templateFolderId 文件夹ID
     **/
    public void setTemplateFolderId(String templateFolderId) {
        this.templateFolderId = templateFolderId == null ? null : templateFolderId.trim();
    }

    /**
     * 站点ID
     * @return java.lang.String
     **/
    public String getTemplateSiteId() {
        return templateSiteId;
    }

    /**
     * 站点ID
     * @param templateSiteId 站点ID
     **/
    public void setTemplateSiteId(String templateSiteId) {
        this.templateSiteId = templateSiteId == null ? null : templateSiteId.trim();
    }

    /**
     * 父模版ID
     * @return java.lang.String
     **/
    public String getTemplateParentId() {
        return templateParentId;
    }

    /**
     * 父模版ID
     * @param templateParentId 父模版ID
     **/
    public void setTemplateParentId(String templateParentId) {
        this.templateParentId = templateParentId == null ? null : templateParentId.trim();
    }

    /**
     * 模版类型
     * @return java.lang.String
     **/
    public String getTemplateType() {
        return templateType;
    }

    /**
     * 模版类型
     * @param templateType 模版类型
     **/
    public void setTemplateType(String templateType) {
        this.templateType = templateType == null ? null : templateType.trim();
    }

    /**
     * 模版名称
     * @return java.lang.String
     **/
    public String getTemplateName() {
        return templateName;
    }

    /**
     * 模版名称
     * @param templateName 模版名称
     **/
    public void setTemplateName(String templateName) {
        this.templateName = templateName == null ? null : templateName.trim();
    }

    /**
     * 模版文件名称
     * @return java.lang.String
     **/
    public String getTemplateFileName() {
        return templateFileName;
    }

    /**
     * 模版文件名称
     * @param templateFileName 模版文件名称
     **/
    public void setTemplateFileName(String templateFileName) {
        this.templateFileName = templateFileName == null ? null : templateFileName.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getTemplateCreateTime() {
        return templateCreateTime;
    }

    /**
     * 创建时间
     * @param templateCreateTime 创建时间
     **/
    public void setTemplateCreateTime(Date templateCreateTime) {
        this.templateCreateTime = templateCreateTime;
    }

    /**
     * 创建者
     * @return java.lang.String
     **/
    public String getTemplateCreator() {
        return templateCreator;
    }

    /**
     * 创建者
     * @param templateCreator 创建者
     **/
    public void setTemplateCreator(String templateCreator) {
        this.templateCreator = templateCreator == null ? null : templateCreator.trim();
    }

    /**
     * 更新时间
     * @return java.util.Date
     **/
    public Date getTemplateUpdateTime() {
        return templateUpdateTime;
    }

    /**
     * 更新时间
     * @param templateUpdateTime 更新时间
     **/
    public void setTemplateUpdateTime(Date templateUpdateTime) {
        this.templateUpdateTime = templateUpdateTime;
    }

    /**
     * 更新人
     * @return java.lang.String
     **/
    public String getTemplateUpdater() {
        return templateUpdater;
    }

    /**
     * 更新人
     * @param templateUpdater 更新人
     **/
    public void setTemplateUpdater(String templateUpdater) {
        this.templateUpdater = templateUpdater == null ? null : templateUpdater.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getTemplateDesc() {
        return templateDesc;
    }

    /**
     * 备注
     * @param templateDesc 备注
     **/
    public void setTemplateDesc(String templateDesc) {
        this.templateDesc = templateDesc == null ? null : templateDesc.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getTemplateStatus() {
        return templateStatus;
    }

    /**
     * 状态
     * @param templateStatus 状态
     **/
    public void setTemplateStatus(String templateStatus) {
        this.templateStatus = templateStatus == null ? null : templateStatus.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getTemplateOrderNum() {
        return templateOrderNum;
    }

    /**
     * 排序号
     * @param templateOrderNum 排序号
     **/
    public void setTemplateOrderNum(Integer templateOrderNum) {
        this.templateOrderNum = templateOrderNum;
    }

    //TEMPLATE_CONTENT_HTML:模版HTML内容
    private String templateContentHtml;

    //TEMPLATE_CONTENT_JS:模版JS内容
    private String templateContentJs;

    //TEMPLATE_CONTENT_CSS:模版CSS内容
    private String templateContentCss;

    public String getTemplateContentHtml() {
        return templateContentHtml;
    }

    public void setTemplateContentHtml(String templateContentHtml) {
        this.templateContentHtml = templateContentHtml == null ? null : templateContentHtml.trim();
    }

    public String getTemplateContentJs() {
        return templateContentJs;
    }

    public void setTemplateContentJs(String templateContentJs) {
        this.templateContentJs = templateContentJs == null ? null : templateContentJs.trim();
    }

    public String getTemplateContentCss() {
        return templateContentCss;
    }

    public void setTemplateContentCss(String templateContentCss) {
        this.templateContentCss = templateContentCss == null ? null : templateContentCss.trim();
    }
}