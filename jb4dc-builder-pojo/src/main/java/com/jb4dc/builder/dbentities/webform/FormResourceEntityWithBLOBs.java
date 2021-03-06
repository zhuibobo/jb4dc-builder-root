package com.jb4dc.builder.dbentities.webform;

import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tbuild_form_resource
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class FormResourceEntityWithBLOBs extends FormResourceEntity {
    //FORM_HTML_SOURCE:原始的HTML
    private String formHtmlSource;

    //FORM_HTML_RESOLVE:解析后的HTML
    private String formHtmlResolve;

    //FORM_JS_CONTENT:JS编辑器中的内容
    private String formJsContent;

    //FORM_CSS_CONTENT:CSS编辑器中的内容
    private String formCssContent;

    //FORM_CONFIG_CONTENT:配置编辑器中的内容
    private String formConfigContent;

    //FORM_DESIGN_REMARK:设计详细说明
    private String formDesignRemark;

    public FormResourceEntityWithBLOBs(String formId, String formCode, String formName, String formSingleName, Date formCreateTime, String formCreator, Date formUpdateTime, String formUpdater, String formType, String formIsSystem, Integer formOrderNum, String formDesc, String formModuleId, String formStatus, String formOrganId, String formOrganName, String formMainTableName, String formMainTableCaption, String formDataRelation, String formIsTemplate, String formIsResolve, String formEveryTimeResolve, String formSource, String formContentUrl, String formTheme, String formCustServerRenderer, String formCustRefJs, String formCustClientRenderer, String formCustDesc, String formMainTableId, String formInnerButton, String formOperationType, String formJudgeApi, String formJudgeSql, String formHtmlSource, String formHtmlResolve, String formJsContent, String formCssContent, String formConfigContent, String formDesignRemark) {
        super(formId, formCode, formName, formSingleName, formCreateTime, formCreator, formUpdateTime, formUpdater, formType, formIsSystem, formOrderNum, formDesc, formModuleId, formStatus, formOrganId, formOrganName, formMainTableName, formMainTableCaption, formDataRelation, formIsTemplate, formIsResolve, formEveryTimeResolve, formSource, formContentUrl, formTheme, formCustServerRenderer, formCustRefJs, formCustClientRenderer, formCustDesc, formMainTableId, formInnerButton, formOperationType, formJudgeApi, formJudgeSql);
        this.formHtmlSource = formHtmlSource;
        this.formHtmlResolve = formHtmlResolve;
        this.formJsContent = formJsContent;
        this.formCssContent = formCssContent;
        this.formConfigContent = formConfigContent;
        this.formDesignRemark = formDesignRemark;
    }

    public FormResourceEntityWithBLOBs() {
        super();
    }

    public String getFormHtmlSource() {
        return formHtmlSource;
    }

    public void setFormHtmlSource(String formHtmlSource) {
        this.formHtmlSource = formHtmlSource == null ? null : formHtmlSource.trim();
    }

    public String getFormHtmlResolve() {
        return formHtmlResolve;
    }

    public void setFormHtmlResolve(String formHtmlResolve) {
        this.formHtmlResolve = formHtmlResolve == null ? null : formHtmlResolve.trim();
    }

    public String getFormJsContent() {
        return formJsContent;
    }

    public void setFormJsContent(String formJsContent) {
        this.formJsContent = formJsContent == null ? null : formJsContent.trim();
    }

    public String getFormCssContent() {
        return formCssContent;
    }

    public void setFormCssContent(String formCssContent) {
        this.formCssContent = formCssContent == null ? null : formCssContent.trim();
    }

    public String getFormConfigContent() {
        return formConfigContent;
    }

    public void setFormConfigContent(String formConfigContent) {
        this.formConfigContent = formConfigContent == null ? null : formConfigContent.trim();
    }

    public String getFormDesignRemark() {
        return formDesignRemark;
    }

    public void setFormDesignRemark(String formDesignRemark) {
        this.formDesignRemark = formDesignRemark == null ? null : formDesignRemark.trim();
    }
}