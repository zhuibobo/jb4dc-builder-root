package com.jb4dc.builder.po;

import com.jb4dc.builder.dbentities.webform.FormResourceEntity;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/6
 * To change this template use File | Settings | File Templates.
 */
public class FormResourcePO extends FormResourceEntity {

    public String getFormHtmlRuntime() {
        return formHtmlRuntime;
    }

    public void setFormHtmlRuntime(String formHtmlRuntime) {
        this.formHtmlRuntime = formHtmlRuntime;
    }

    private String formHtmlRuntime;


    public FormResourcePO(FormResourceEntity source,String formHtmlRuntime){
        this.setFormId(source.getFormId());
        this.setFormCode(source.getFormCode());
        this.setFormName(source.getFormName());
        this.setFormSingleName(source.getFormSingleName());
        this.setFormCreateTime(source.getFormCreateTime());
        this.setFormCreator(source.getFormCreator());
        this.setFormUpdateTime(source.getFormUpdateTime());
        this.setFormUpdater(source.getFormUpdater());
        this.setFormType(source.getFormType());
        this.setFormIsSystem(source.getFormIsSystem());
        this.setFormOrderNum(source.getFormOrderNum());
        this.setFormDesc(source.getFormDesc());
        this.setFormModuleId(source.getFormModuleId());
        this.setFormStatus(source.getFormStatus());
        this.setFormOrganId(source.getFormOrganId());
        this.setFormOrganName(source.getFormOrganName());
        this.setFormMainTableName(source.getFormMainTableName());
        this.setFormMainTableCaption(source.getFormMainTableCaption());
        this.setFormDataRelation(source.getFormDataRelation());
        this.setFormIsTemplate(source.getFormIsTemplate());
        this.setFormIsResolve(source.getFormIsResolve());
        this.setFormEveryTimeResolve(source.getFormEveryTimeResolve());
        this.setFormHtmlSource(source.getFormHtmlSource());
        this.setFormHtmlResolve(source.getFormHtmlResolve());
        this.setFormJsContent(source.getFormJsContent());
        this.setFormCssContent(source.getFormCssContent());
        this.setFormConfigContent(source.getFormConfigContent());
        this.setFormSource(source.getFormSource());
        this.setFormContentUrl(source.getFormContentUrl());
        this.setFormTheme(source.getFormTheme());
        this.setFormCustServerRenderer(source.getFormCustServerRenderer());
        this.setFormCustRefJs(source.getFormCustRefJs());
        this.setFormCustClientRenderer(source.getFormCustClientRenderer());
        this.setFormCustDesc(source.getFormCustDesc());
        this.formHtmlRuntime=formHtmlRuntime;
    }
}