package com.jb4dc.builder.dbentities.webform;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_FORM_RESOURCE
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class FormResourceEntity {
    //FORM_ID:主键:UUID
    @DBKeyField
    private String formId;

    //FORM_CODE:窗体编号:无特殊作用,序列生成,便于查找,禁止用于开发
    private String formCode;

    //FORM_NAME:窗体名称
    private String formName;

    //FORM_SINGLE_NAME:唯一名称:可以为空,如果存在则必须唯一
    private String formSingleName;

    //FORM_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date formCreateTime;

    //FORM_CREATOR:创建人
    private String formCreator;

    //FORM_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date formUpdateTime;

    //FORM_UPDATER:更新人
    private String formUpdater;

    //FORM_TYPE:表单类型:业务表单.....
    private String formType;

    //FORM_IS_SYSTEM:是否系统
    private String formIsSystem;

    //FORM_ORDER_NUM:排序号
    private Integer formOrderNum;

    //FORM_DESC:备注
    private String formDesc;

    //FORM_MODULE_ID:所属模块ID
    private String formModuleId;

    //FORM_STATUS:状态
    private String formStatus;

    //FORM_ORGAN_ID:创建组织ID
    private String formOrganId;

    //FORM_ORGAN_NAME:创建组织名称
    private String formOrganName;

    //FORM_MAIN_TABLE_NAME:表单的主表名称:从数据关系字段FORM_DATA_RELATION提取
    private String formMainTableName;

    //FORM_MAIN_TABLE_CAPTION:表单的主表标题:从数据关系字段FORM_DATA_RELATION提取
    private String formMainTableCaption;

    //FORM_DATA_RELATION:数据关系的设置:根节点为主表
    private String formDataRelation;

    //FORM_IS_TEMPLATE:是否模版:未使用
    private String formIsTemplate;

    //FORM_IS_RESOLVE:是否进行了解析:解析过的表单将不再进行服务端的解析
    private String formIsResolve;

    //FORM_EVERY_TIME_RESOLVE:是否每次都进行服务端解析:默认为否,只解析一次
    private String formEveryTimeResolve;

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

    //FORM_SOURCE:表单的来源:Web设计器,URL引入...
    private String formSource;

    //FORM_CONTENT_URL:引入表单的URL地址
    private String formContentUrl;

    //FORM_THEME:风格主题:基于配置文件中的配置
    private String formTheme;

    //FORM_CUST_SERVER_RENDERER:服务端自定义的渲染方法:继承IFormSeverRenderer
    private String formCustServerRenderer;

    //FORM_CUST_REF_JS:引入的脚本:多个通过;分割
    private String formCustRefJs;

    //FORM_CUST_CLIENT_RENDERER:客户端自定义的渲染方法:需要指明具体的方法名称
    private String formCustClientRenderer;

    //FORM_CUST_DESC:自定义设置备注:使用了自定义设置相关方法的备注说明
    private String formCustDesc;

    /**
     * 构造函数
     * @param formId 主键
     * @param formCode 窗体编号
     * @param formName 窗体名称
     * @param formSingleName 唯一名称
     * @param formCreateTime 创建时间
     * @param formCreator 创建人
     * @param formUpdateTime 更新时间
     * @param formUpdater 更新人
     * @param formType 表单类型
     * @param formIsSystem 是否系统
     * @param formOrderNum 排序号
     * @param formDesc 备注
     * @param formModuleId 所属模块ID
     * @param formStatus 状态
     * @param formOrganId 创建组织ID
     * @param formOrganName 创建组织名称
     * @param formMainTableName 表单的主表名称
     * @param formMainTableCaption 表单的主表标题
     * @param formDataRelation 数据关系的设置
     * @param formIsTemplate 是否模版
     * @param formIsResolve 是否进行了解析
     * @param formEveryTimeResolve 是否每次都进行服务端解析
     * @param formHtmlSource 原始的HTML
     * @param formHtmlResolve 解析后的HTML
     * @param formJsContent JS编辑器中的内容
     * @param formCssContent CSS编辑器中的内容
     * @param formConfigContent 配置编辑器中的内容
     * @param formSource 表单的来源
     * @param formContentUrl 引入表单的URL地址
     * @param formTheme 风格主题
     * @param formCustServerRenderer 服务端自定义的渲染方法
     * @param formCustRefJs 引入的脚本
     * @param formCustClientRenderer 客户端自定义的渲染方法
     * @param formCustDesc 自定义设置备注
     **/
    public FormResourceEntity(String formId, String formCode, String formName, String formSingleName, Date formCreateTime, String formCreator, Date formUpdateTime, String formUpdater, String formType, String formIsSystem, Integer formOrderNum, String formDesc, String formModuleId, String formStatus, String formOrganId, String formOrganName, String formMainTableName, String formMainTableCaption, String formDataRelation, String formIsTemplate, String formIsResolve, String formEveryTimeResolve, String formHtmlSource, String formHtmlResolve, String formJsContent, String formCssContent, String formConfigContent, String formSource, String formContentUrl, String formTheme, String formCustServerRenderer, String formCustRefJs, String formCustClientRenderer, String formCustDesc) {
        this.formId = formId;
        this.formCode = formCode;
        this.formName = formName;
        this.formSingleName = formSingleName;
        this.formCreateTime = formCreateTime;
        this.formCreator = formCreator;
        this.formUpdateTime = formUpdateTime;
        this.formUpdater = formUpdater;
        this.formType = formType;
        this.formIsSystem = formIsSystem;
        this.formOrderNum = formOrderNum;
        this.formDesc = formDesc;
        this.formModuleId = formModuleId;
        this.formStatus = formStatus;
        this.formOrganId = formOrganId;
        this.formOrganName = formOrganName;
        this.formMainTableName = formMainTableName;
        this.formMainTableCaption = formMainTableCaption;
        this.formDataRelation = formDataRelation;
        this.formIsTemplate = formIsTemplate;
        this.formIsResolve = formIsResolve;
        this.formEveryTimeResolve = formEveryTimeResolve;
        this.formHtmlSource = formHtmlSource;
        this.formHtmlResolve = formHtmlResolve;
        this.formJsContent = formJsContent;
        this.formCssContent = formCssContent;
        this.formConfigContent = formConfigContent;
        this.formSource = formSource;
        this.formContentUrl = formContentUrl;
        this.formTheme = formTheme;
        this.formCustServerRenderer = formCustServerRenderer;
        this.formCustRefJs = formCustRefJs;
        this.formCustClientRenderer = formCustClientRenderer;
        this.formCustDesc = formCustDesc;
    }

    public FormResourceEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getFormId() {
        return formId;
    }

    /**
     * 主键:UUID
     * @param formId 主键
     **/
    public void setFormId(String formId) {
        this.formId = formId == null ? null : formId.trim();
    }

    /**
     * 窗体编号:无特殊作用,序列生成,便于查找,禁止用于开发
     * @return java.lang.String
     **/
    public String getFormCode() {
        return formCode;
    }

    /**
     * 窗体编号:无特殊作用,序列生成,便于查找,禁止用于开发
     * @param formCode 窗体编号
     **/
    public void setFormCode(String formCode) {
        this.formCode = formCode == null ? null : formCode.trim();
    }

    /**
     * 窗体名称
     * @return java.lang.String
     **/
    public String getFormName() {
        return formName;
    }

    /**
     * 窗体名称
     * @param formName 窗体名称
     **/
    public void setFormName(String formName) {
        this.formName = formName == null ? null : formName.trim();
    }

    /**
     * 唯一名称:可以为空,如果存在则必须唯一
     * @return java.lang.String
     **/
    public String getFormSingleName() {
        return formSingleName;
    }

    /**
     * 唯一名称:可以为空,如果存在则必须唯一
     * @param formSingleName 唯一名称
     **/
    public void setFormSingleName(String formSingleName) {
        this.formSingleName = formSingleName == null ? null : formSingleName.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getFormCreateTime() {
        return formCreateTime;
    }

    /**
     * 创建时间
     * @param formCreateTime 创建时间
     **/
    public void setFormCreateTime(Date formCreateTime) {
        this.formCreateTime = formCreateTime;
    }

    /**
     * 创建人
     * @return java.lang.String
     **/
    public String getFormCreator() {
        return formCreator;
    }

    /**
     * 创建人
     * @param formCreator 创建人
     **/
    public void setFormCreator(String formCreator) {
        this.formCreator = formCreator == null ? null : formCreator.trim();
    }

    /**
     * 更新时间
     * @return java.util.Date
     **/
    public Date getFormUpdateTime() {
        return formUpdateTime;
    }

    /**
     * 更新时间
     * @param formUpdateTime 更新时间
     **/
    public void setFormUpdateTime(Date formUpdateTime) {
        this.formUpdateTime = formUpdateTime;
    }

    /**
     * 更新人
     * @return java.lang.String
     **/
    public String getFormUpdater() {
        return formUpdater;
    }

    /**
     * 更新人
     * @param formUpdater 更新人
     **/
    public void setFormUpdater(String formUpdater) {
        this.formUpdater = formUpdater == null ? null : formUpdater.trim();
    }

    /**
     * 表单类型:业务表单.....
     * @return java.lang.String
     **/
    public String getFormType() {
        return formType;
    }

    /**
     * 表单类型:业务表单.....
     * @param formType 表单类型
     **/
    public void setFormType(String formType) {
        this.formType = formType == null ? null : formType.trim();
    }

    /**
     * 是否系统
     * @return java.lang.String
     **/
    public String getFormIsSystem() {
        return formIsSystem;
    }

    /**
     * 是否系统
     * @param formIsSystem 是否系统
     **/
    public void setFormIsSystem(String formIsSystem) {
        this.formIsSystem = formIsSystem == null ? null : formIsSystem.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getFormOrderNum() {
        return formOrderNum;
    }

    /**
     * 排序号
     * @param formOrderNum 排序号
     **/
    public void setFormOrderNum(Integer formOrderNum) {
        this.formOrderNum = formOrderNum;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getFormDesc() {
        return formDesc;
    }

    /**
     * 备注
     * @param formDesc 备注
     **/
    public void setFormDesc(String formDesc) {
        this.formDesc = formDesc == null ? null : formDesc.trim();
    }

    /**
     * 所属模块ID
     * @return java.lang.String
     **/
    public String getFormModuleId() {
        return formModuleId;
    }

    /**
     * 所属模块ID
     * @param formModuleId 所属模块ID
     **/
    public void setFormModuleId(String formModuleId) {
        this.formModuleId = formModuleId == null ? null : formModuleId.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getFormStatus() {
        return formStatus;
    }

    /**
     * 状态
     * @param formStatus 状态
     **/
    public void setFormStatus(String formStatus) {
        this.formStatus = formStatus == null ? null : formStatus.trim();
    }

    /**
     * 创建组织ID
     * @return java.lang.String
     **/
    public String getFormOrganId() {
        return formOrganId;
    }

    /**
     * 创建组织ID
     * @param formOrganId 创建组织ID
     **/
    public void setFormOrganId(String formOrganId) {
        this.formOrganId = formOrganId == null ? null : formOrganId.trim();
    }

    /**
     * 创建组织名称
     * @return java.lang.String
     **/
    public String getFormOrganName() {
        return formOrganName;
    }

    /**
     * 创建组织名称
     * @param formOrganName 创建组织名称
     **/
    public void setFormOrganName(String formOrganName) {
        this.formOrganName = formOrganName == null ? null : formOrganName.trim();
    }

    /**
     * 表单的主表名称:从数据关系字段FORM_DATA_RELATION提取
     * @return java.lang.String
     **/
    public String getFormMainTableName() {
        return formMainTableName;
    }

    /**
     * 表单的主表名称:从数据关系字段FORM_DATA_RELATION提取
     * @param formMainTableName 表单的主表名称
     **/
    public void setFormMainTableName(String formMainTableName) {
        this.formMainTableName = formMainTableName == null ? null : formMainTableName.trim();
    }

    /**
     * 表单的主表标题:从数据关系字段FORM_DATA_RELATION提取
     * @return java.lang.String
     **/
    public String getFormMainTableCaption() {
        return formMainTableCaption;
    }

    /**
     * 表单的主表标题:从数据关系字段FORM_DATA_RELATION提取
     * @param formMainTableCaption 表单的主表标题
     **/
    public void setFormMainTableCaption(String formMainTableCaption) {
        this.formMainTableCaption = formMainTableCaption == null ? null : formMainTableCaption.trim();
    }

    /**
     * 数据关系的设置:根节点为主表
     * @return java.lang.String
     **/
    public String getFormDataRelation() {
        return formDataRelation;
    }

    /**
     * 数据关系的设置:根节点为主表
     * @param formDataRelation 数据关系的设置
     **/
    public void setFormDataRelation(String formDataRelation) {
        this.formDataRelation = formDataRelation == null ? null : formDataRelation.trim();
    }

    /**
     * 是否模版:未使用
     * @return java.lang.String
     **/
    public String getFormIsTemplate() {
        return formIsTemplate;
    }

    /**
     * 是否模版:未使用
     * @param formIsTemplate 是否模版
     **/
    public void setFormIsTemplate(String formIsTemplate) {
        this.formIsTemplate = formIsTemplate == null ? null : formIsTemplate.trim();
    }

    /**
     * 是否进行了解析:解析过的表单将不再进行服务端的解析
     * @return java.lang.String
     **/
    public String getFormIsResolve() {
        return formIsResolve;
    }

    /**
     * 是否进行了解析:解析过的表单将不再进行服务端的解析
     * @param formIsResolve 是否进行了解析
     **/
    public void setFormIsResolve(String formIsResolve) {
        this.formIsResolve = formIsResolve == null ? null : formIsResolve.trim();
    }

    /**
     * 是否每次都进行服务端解析:默认为否,只解析一次
     * @return java.lang.String
     **/
    public String getFormEveryTimeResolve() {
        return formEveryTimeResolve;
    }

    /**
     * 是否每次都进行服务端解析:默认为否,只解析一次
     * @param formEveryTimeResolve 是否每次都进行服务端解析
     **/
    public void setFormEveryTimeResolve(String formEveryTimeResolve) {
        this.formEveryTimeResolve = formEveryTimeResolve == null ? null : formEveryTimeResolve.trim();
    }

    /**
     * 原始的HTML
     * @return java.lang.String
     **/
    public String getFormHtmlSource() {
        return formHtmlSource;
    }

    /**
     * 原始的HTML
     * @param formHtmlSource 原始的HTML
     **/
    public void setFormHtmlSource(String formHtmlSource) {
        this.formHtmlSource = formHtmlSource == null ? null : formHtmlSource.trim();
    }

    /**
     * 解析后的HTML
     * @return java.lang.String
     **/
    public String getFormHtmlResolve() {
        return formHtmlResolve;
    }

    /**
     * 解析后的HTML
     * @param formHtmlResolve 解析后的HTML
     **/
    public void setFormHtmlResolve(String formHtmlResolve) {
        this.formHtmlResolve = formHtmlResolve == null ? null : formHtmlResolve.trim();
    }

    /**
     * JS编辑器中的内容
     * @return java.lang.String
     **/
    public String getFormJsContent() {
        return formJsContent;
    }

    /**
     * JS编辑器中的内容
     * @param formJsContent JS编辑器中的内容
     **/
    public void setFormJsContent(String formJsContent) {
        this.formJsContent = formJsContent == null ? null : formJsContent.trim();
    }

    /**
     * CSS编辑器中的内容
     * @return java.lang.String
     **/
    public String getFormCssContent() {
        return formCssContent;
    }

    /**
     * CSS编辑器中的内容
     * @param formCssContent CSS编辑器中的内容
     **/
    public void setFormCssContent(String formCssContent) {
        this.formCssContent = formCssContent == null ? null : formCssContent.trim();
    }

    /**
     * 配置编辑器中的内容
     * @return java.lang.String
     **/
    public String getFormConfigContent() {
        return formConfigContent;
    }

    /**
     * 配置编辑器中的内容
     * @param formConfigContent 配置编辑器中的内容
     **/
    public void setFormConfigContent(String formConfigContent) {
        this.formConfigContent = formConfigContent == null ? null : formConfigContent.trim();
    }

    /**
     * 表单的来源:Web设计器,URL引入...
     * @return java.lang.String
     **/
    public String getFormSource() {
        return formSource;
    }

    /**
     * 表单的来源:Web设计器,URL引入...
     * @param formSource 表单的来源
     **/
    public void setFormSource(String formSource) {
        this.formSource = formSource == null ? null : formSource.trim();
    }

    /**
     * 引入表单的URL地址
     * @return java.lang.String
     **/
    public String getFormContentUrl() {
        return formContentUrl;
    }

    /**
     * 引入表单的URL地址
     * @param formContentUrl 引入表单的URL地址
     **/
    public void setFormContentUrl(String formContentUrl) {
        this.formContentUrl = formContentUrl == null ? null : formContentUrl.trim();
    }

    /**
     * 风格主题:基于配置文件中的配置
     * @return java.lang.String
     **/
    public String getFormTheme() {
        return formTheme;
    }

    /**
     * 风格主题:基于配置文件中的配置
     * @param formTheme 风格主题
     **/
    public void setFormTheme(String formTheme) {
        this.formTheme = formTheme == null ? null : formTheme.trim();
    }

    /**
     * 服务端自定义的渲染方法:继承IFormSeverRenderer
     * @return java.lang.String
     **/
    public String getFormCustServerRenderer() {
        return formCustServerRenderer;
    }

    /**
     * 服务端自定义的渲染方法:继承IFormSeverRenderer
     * @param formCustServerRenderer 服务端自定义的渲染方法
     **/
    public void setFormCustServerRenderer(String formCustServerRenderer) {
        this.formCustServerRenderer = formCustServerRenderer == null ? null : formCustServerRenderer.trim();
    }

    /**
     * 引入的脚本:多个通过;分割
     * @return java.lang.String
     **/
    public String getFormCustRefJs() {
        return formCustRefJs;
    }

    /**
     * 引入的脚本:多个通过;分割
     * @param formCustRefJs 引入的脚本
     **/
    public void setFormCustRefJs(String formCustRefJs) {
        this.formCustRefJs = formCustRefJs == null ? null : formCustRefJs.trim();
    }

    /**
     * 客户端自定义的渲染方法:需要指明具体的方法名称
     * @return java.lang.String
     **/
    public String getFormCustClientRenderer() {
        return formCustClientRenderer;
    }

    /**
     * 客户端自定义的渲染方法:需要指明具体的方法名称
     * @param formCustClientRenderer 客户端自定义的渲染方法
     **/
    public void setFormCustClientRenderer(String formCustClientRenderer) {
        this.formCustClientRenderer = formCustClientRenderer == null ? null : formCustClientRenderer.trim();
    }

    /**
     * 自定义设置备注:使用了自定义设置相关方法的备注说明
     * @return java.lang.String
     **/
    public String getFormCustDesc() {
        return formCustDesc;
    }

    /**
     * 自定义设置备注:使用了自定义设置相关方法的备注说明
     * @param formCustDesc 自定义设置备注
     **/
    public void setFormCustDesc(String formCustDesc) {
        this.formCustDesc = formCustDesc == null ? null : formCustDesc.trim();
    }
}