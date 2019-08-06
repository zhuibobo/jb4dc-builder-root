package com.jb4dc.builder.dbentities.weblist;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TBUILD_LIST_RESOURCE
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ListResourceEntity {
    //LIST_ID:主键:UUID
    @DBKeyField
    private String listId;

    //LIST_CODE:列表编号:无特殊作用,序列生成,便于查找,禁止用于开发
    private String listCode;

    //LIST_NAME:列表名称
    private String listName;

    //LIST_SINGLE_NAME:唯一名称:可以为空,如果存在则必须唯一
    private String listSingleName;

    //LIST_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date listCreateTime;

    //LIST_CREATOR:创建人
    private String listCreator;

    //LIST_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date listUpdateTime;

    //LIST_UPDATER:更新人
    private String listUpdater;

    //LIST_TYPE:列表类型:....
    private String listType;

    //LIST_IS_SYSTEM:是否系统所有
    private String listIsSystem;

    //LIST_ORDER_NUM:排序号
    private Integer listOrderNum;

    //LIST_DESC:备注
    private String listDesc;

    //LIST_MODULE_ID:所属模块ID
    private String listModuleId;

    //LIST_STATUS:列表状态
    private String listStatus;

    //LIST_ORGAN_ID:组织id
    private String listOrganId;

    //LIST_ORGAN_NAME:组织名称
    private String listOrganName;

    //LIST_DATASET_ID:使用的数据集ID:如果布局容器中没有设置自己的数据集,则使用该处的数据集
    private String listDatasetId;

    //LIST_DATASET_NAME:使用的数据集名称:如果布局容器中没有设置自己的数据集,则使用该处的数据集
    private String listDatasetName;

    //LIST_DATASET_PAGE_SIZE:使用的数据集的单页数量
    private Integer listDatasetPageSize;

    //LIST_IS_RESOLVE:是否进行了解析:解析过的列表将不再进行服务端的解析
    private String listIsResolve;

    //LIST_EVERY_TIME_RESOLVE:是否每次都进行服务端解析:默认为否,只解析一次
    private String listEveryTimeResolve;

    //LIST_HTML_SOURCE:原始的HTML
    private String listHtmlSource;

    //LIST_HTML_RESOLVE:解析后的HTML
    private String listHtmlResolve;

    //LIST_JS_CONTENT:JS编辑器中的内容
    private String listJsContent;

    //LIST_CSS_CONTENT:CSS编辑器中的内容
    private String listCssContent;

    //LIST_CONFIG_CONTENT:配置编辑器中的内容
    private String listConfigContent;

    //LIST_ENABLE_S_SEAR:是否启用简单查询
    private String listEnableSSear;

    //LIST_ENABLE_C_SEAR:是否启用复杂查询
    private String listEnableCSear;

    //LIST_THEME:风格主题:基于配置文件中的配置
    private String listTheme;

    //LIST_CUST_SERVER_RENDERER:服务端自定义的渲染方法:继承IFormSeverRenderer
    private String listCustServerRenderer;

    //LIST_CUST_REF_JS:引入的脚本:多个通过;分割
    private String listCustRefJs;

    //LIST_CUST_CLIENT_RENDERER:客户端自定义的渲染方法:需要指明具体的方法名称
    private String listCustClientRenderer;

    //LIST_CUST_DESC:自定义设置备注:使用了自定义设置相关方法的备注说明
    private String listCustDesc;

    /**
     * 构造函数
     * @param listId 主键
     * @param listCode 列表编号
     * @param listName 列表名称
     * @param listSingleName 唯一名称
     * @param listCreateTime 创建时间
     * @param listCreator 创建人
     * @param listUpdateTime 更新时间
     * @param listUpdater 更新人
     * @param listType 列表类型
     * @param listIsSystem 是否系统所有
     * @param listOrderNum 排序号
     * @param listDesc 备注
     * @param listModuleId 所属模块ID
     * @param listStatus 列表状态
     * @param listOrganId 组织id
     * @param listOrganName 组织名称
     * @param listDatasetId 使用的数据集ID
     * @param listDatasetName 使用的数据集名称
     * @param listDatasetPageSize 使用的数据集的单页数量
     * @param listIsResolve 是否进行了解析
     * @param listEveryTimeResolve 是否每次都进行服务端解析
     * @param listHtmlSource 原始的HTML
     * @param listHtmlResolve 解析后的HTML
     * @param listJsContent JS编辑器中的内容
     * @param listCssContent CSS编辑器中的内容
     * @param listConfigContent 配置编辑器中的内容
     * @param listEnableSSear 是否启用简单查询
     * @param listEnableCSear 是否启用复杂查询
     * @param listTheme 风格主题
     * @param listCustServerRenderer 服务端自定义的渲染方法
     * @param listCustRefJs 引入的脚本
     * @param listCustClientRenderer 客户端自定义的渲染方法
     * @param listCustDesc 自定义设置备注
     **/
    public ListResourceEntity(String listId, String listCode, String listName, String listSingleName, Date listCreateTime, String listCreator, Date listUpdateTime, String listUpdater, String listType, String listIsSystem, Integer listOrderNum, String listDesc, String listModuleId, String listStatus, String listOrganId, String listOrganName, String listDatasetId, String listDatasetName, Integer listDatasetPageSize, String listIsResolve, String listEveryTimeResolve, String listHtmlSource, String listHtmlResolve, String listJsContent, String listCssContent, String listConfigContent, String listEnableSSear, String listEnableCSear, String listTheme, String listCustServerRenderer, String listCustRefJs, String listCustClientRenderer, String listCustDesc) {
        this.listId = listId;
        this.listCode = listCode;
        this.listName = listName;
        this.listSingleName = listSingleName;
        this.listCreateTime = listCreateTime;
        this.listCreator = listCreator;
        this.listUpdateTime = listUpdateTime;
        this.listUpdater = listUpdater;
        this.listType = listType;
        this.listIsSystem = listIsSystem;
        this.listOrderNum = listOrderNum;
        this.listDesc = listDesc;
        this.listModuleId = listModuleId;
        this.listStatus = listStatus;
        this.listOrganId = listOrganId;
        this.listOrganName = listOrganName;
        this.listDatasetId = listDatasetId;
        this.listDatasetName = listDatasetName;
        this.listDatasetPageSize = listDatasetPageSize;
        this.listIsResolve = listIsResolve;
        this.listEveryTimeResolve = listEveryTimeResolve;
        this.listHtmlSource = listHtmlSource;
        this.listHtmlResolve = listHtmlResolve;
        this.listJsContent = listJsContent;
        this.listCssContent = listCssContent;
        this.listConfigContent = listConfigContent;
        this.listEnableSSear = listEnableSSear;
        this.listEnableCSear = listEnableCSear;
        this.listTheme = listTheme;
        this.listCustServerRenderer = listCustServerRenderer;
        this.listCustRefJs = listCustRefJs;
        this.listCustClientRenderer = listCustClientRenderer;
        this.listCustDesc = listCustDesc;
    }

    public ListResourceEntity() {
        super();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getListId() {
        return listId;
    }

    /**
     * 主键:UUID
     * @param listId 主键
     **/
    public void setListId(String listId) {
        this.listId = listId == null ? null : listId.trim();
    }

    /**
     * 列表编号:无特殊作用,序列生成,便于查找,禁止用于开发
     * @return java.lang.String
     **/
    public String getListCode() {
        return listCode;
    }

    /**
     * 列表编号:无特殊作用,序列生成,便于查找,禁止用于开发
     * @param listCode 列表编号
     **/
    public void setListCode(String listCode) {
        this.listCode = listCode == null ? null : listCode.trim();
    }

    /**
     * 列表名称
     * @return java.lang.String
     **/
    public String getListName() {
        return listName;
    }

    /**
     * 列表名称
     * @param listName 列表名称
     **/
    public void setListName(String listName) {
        this.listName = listName == null ? null : listName.trim();
    }

    /**
     * 唯一名称:可以为空,如果存在则必须唯一
     * @return java.lang.String
     **/
    public String getListSingleName() {
        return listSingleName;
    }

    /**
     * 唯一名称:可以为空,如果存在则必须唯一
     * @param listSingleName 唯一名称
     **/
    public void setListSingleName(String listSingleName) {
        this.listSingleName = listSingleName == null ? null : listSingleName.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getListCreateTime() {
        return listCreateTime;
    }

    /**
     * 创建时间
     * @param listCreateTime 创建时间
     **/
    public void setListCreateTime(Date listCreateTime) {
        this.listCreateTime = listCreateTime;
    }

    /**
     * 创建人
     * @return java.lang.String
     **/
    public String getListCreator() {
        return listCreator;
    }

    /**
     * 创建人
     * @param listCreator 创建人
     **/
    public void setListCreator(String listCreator) {
        this.listCreator = listCreator == null ? null : listCreator.trim();
    }

    /**
     * 更新时间
     * @return java.util.Date
     **/
    public Date getListUpdateTime() {
        return listUpdateTime;
    }

    /**
     * 更新时间
     * @param listUpdateTime 更新时间
     **/
    public void setListUpdateTime(Date listUpdateTime) {
        this.listUpdateTime = listUpdateTime;
    }

    /**
     * 更新人
     * @return java.lang.String
     **/
    public String getListUpdater() {
        return listUpdater;
    }

    /**
     * 更新人
     * @param listUpdater 更新人
     **/
    public void setListUpdater(String listUpdater) {
        this.listUpdater = listUpdater == null ? null : listUpdater.trim();
    }

    /**
     * 列表类型:....
     * @return java.lang.String
     **/
    public String getListType() {
        return listType;
    }

    /**
     * 列表类型:....
     * @param listType 列表类型
     **/
    public void setListType(String listType) {
        this.listType = listType == null ? null : listType.trim();
    }

    /**
     * 是否系统所有
     * @return java.lang.String
     **/
    public String getListIsSystem() {
        return listIsSystem;
    }

    /**
     * 是否系统所有
     * @param listIsSystem 是否系统所有
     **/
    public void setListIsSystem(String listIsSystem) {
        this.listIsSystem = listIsSystem == null ? null : listIsSystem.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getListOrderNum() {
        return listOrderNum;
    }

    /**
     * 排序号
     * @param listOrderNum 排序号
     **/
    public void setListOrderNum(Integer listOrderNum) {
        this.listOrderNum = listOrderNum;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getListDesc() {
        return listDesc;
    }

    /**
     * 备注
     * @param listDesc 备注
     **/
    public void setListDesc(String listDesc) {
        this.listDesc = listDesc == null ? null : listDesc.trim();
    }

    /**
     * 所属模块ID
     * @return java.lang.String
     **/
    public String getListModuleId() {
        return listModuleId;
    }

    /**
     * 所属模块ID
     * @param listModuleId 所属模块ID
     **/
    public void setListModuleId(String listModuleId) {
        this.listModuleId = listModuleId == null ? null : listModuleId.trim();
    }

    /**
     * 列表状态
     * @return java.lang.String
     **/
    public String getListStatus() {
        return listStatus;
    }

    /**
     * 列表状态
     * @param listStatus 列表状态
     **/
    public void setListStatus(String listStatus) {
        this.listStatus = listStatus == null ? null : listStatus.trim();
    }

    /**
     * 组织id
     * @return java.lang.String
     **/
    public String getListOrganId() {
        return listOrganId;
    }

    /**
     * 组织id
     * @param listOrganId 组织id
     **/
    public void setListOrganId(String listOrganId) {
        this.listOrganId = listOrganId == null ? null : listOrganId.trim();
    }

    /**
     * 组织名称
     * @return java.lang.String
     **/
    public String getListOrganName() {
        return listOrganName;
    }

    /**
     * 组织名称
     * @param listOrganName 组织名称
     **/
    public void setListOrganName(String listOrganName) {
        this.listOrganName = listOrganName == null ? null : listOrganName.trim();
    }

    /**
     * 使用的数据集ID:如果布局容器中没有设置自己的数据集,则使用该处的数据集
     * @return java.lang.String
     **/
    public String getListDatasetId() {
        return listDatasetId;
    }

    /**
     * 使用的数据集ID:如果布局容器中没有设置自己的数据集,则使用该处的数据集
     * @param listDatasetId 使用的数据集ID
     **/
    public void setListDatasetId(String listDatasetId) {
        this.listDatasetId = listDatasetId == null ? null : listDatasetId.trim();
    }

    /**
     * 使用的数据集名称:如果布局容器中没有设置自己的数据集,则使用该处的数据集
     * @return java.lang.String
     **/
    public String getListDatasetName() {
        return listDatasetName;
    }

    /**
     * 使用的数据集名称:如果布局容器中没有设置自己的数据集,则使用该处的数据集
     * @param listDatasetName 使用的数据集名称
     **/
    public void setListDatasetName(String listDatasetName) {
        this.listDatasetName = listDatasetName == null ? null : listDatasetName.trim();
    }

    /**
     * 使用的数据集的单页数量
     * @return java.lang.Integer
     **/
    public Integer getListDatasetPageSize() {
        return listDatasetPageSize;
    }

    /**
     * 使用的数据集的单页数量
     * @param listDatasetPageSize 使用的数据集的单页数量
     **/
    public void setListDatasetPageSize(Integer listDatasetPageSize) {
        this.listDatasetPageSize = listDatasetPageSize;
    }

    /**
     * 是否进行了解析:解析过的列表将不再进行服务端的解析
     * @return java.lang.String
     **/
    public String getListIsResolve() {
        return listIsResolve;
    }

    /**
     * 是否进行了解析:解析过的列表将不再进行服务端的解析
     * @param listIsResolve 是否进行了解析
     **/
    public void setListIsResolve(String listIsResolve) {
        this.listIsResolve = listIsResolve == null ? null : listIsResolve.trim();
    }

    /**
     * 是否每次都进行服务端解析:默认为否,只解析一次
     * @return java.lang.String
     **/
    public String getListEveryTimeResolve() {
        return listEveryTimeResolve;
    }

    /**
     * 是否每次都进行服务端解析:默认为否,只解析一次
     * @param listEveryTimeResolve 是否每次都进行服务端解析
     **/
    public void setListEveryTimeResolve(String listEveryTimeResolve) {
        this.listEveryTimeResolve = listEveryTimeResolve == null ? null : listEveryTimeResolve.trim();
    }

    /**
     * 原始的HTML
     * @return java.lang.String
     **/
    public String getListHtmlSource() {
        return listHtmlSource;
    }

    /**
     * 原始的HTML
     * @param listHtmlSource 原始的HTML
     **/
    public void setListHtmlSource(String listHtmlSource) {
        this.listHtmlSource = listHtmlSource == null ? null : listHtmlSource.trim();
    }

    /**
     * 解析后的HTML
     * @return java.lang.String
     **/
    public String getListHtmlResolve() {
        return listHtmlResolve;
    }

    /**
     * 解析后的HTML
     * @param listHtmlResolve 解析后的HTML
     **/
    public void setListHtmlResolve(String listHtmlResolve) {
        this.listHtmlResolve = listHtmlResolve == null ? null : listHtmlResolve.trim();
    }

    /**
     * JS编辑器中的内容
     * @return java.lang.String
     **/
    public String getListJsContent() {
        return listJsContent;
    }

    /**
     * JS编辑器中的内容
     * @param listJsContent JS编辑器中的内容
     **/
    public void setListJsContent(String listJsContent) {
        this.listJsContent = listJsContent == null ? null : listJsContent.trim();
    }

    /**
     * CSS编辑器中的内容
     * @return java.lang.String
     **/
    public String getListCssContent() {
        return listCssContent;
    }

    /**
     * CSS编辑器中的内容
     * @param listCssContent CSS编辑器中的内容
     **/
    public void setListCssContent(String listCssContent) {
        this.listCssContent = listCssContent == null ? null : listCssContent.trim();
    }

    /**
     * 配置编辑器中的内容
     * @return java.lang.String
     **/
    public String getListConfigContent() {
        return listConfigContent;
    }

    /**
     * 配置编辑器中的内容
     * @param listConfigContent 配置编辑器中的内容
     **/
    public void setListConfigContent(String listConfigContent) {
        this.listConfigContent = listConfigContent == null ? null : listConfigContent.trim();
    }

    /**
     * 是否启用简单查询
     * @return java.lang.String
     **/
    public String getListEnableSSear() {
        return listEnableSSear;
    }

    /**
     * 是否启用简单查询
     * @param listEnableSSear 是否启用简单查询
     **/
    public void setListEnableSSear(String listEnableSSear) {
        this.listEnableSSear = listEnableSSear == null ? null : listEnableSSear.trim();
    }

    /**
     * 是否启用复杂查询
     * @return java.lang.String
     **/
    public String getListEnableCSear() {
        return listEnableCSear;
    }

    /**
     * 是否启用复杂查询
     * @param listEnableCSear 是否启用复杂查询
     **/
    public void setListEnableCSear(String listEnableCSear) {
        this.listEnableCSear = listEnableCSear == null ? null : listEnableCSear.trim();
    }

    /**
     * 风格主题:基于配置文件中的配置
     * @return java.lang.String
     **/
    public String getListTheme() {
        return listTheme;
    }

    /**
     * 风格主题:基于配置文件中的配置
     * @param listTheme 风格主题
     **/
    public void setListTheme(String listTheme) {
        this.listTheme = listTheme == null ? null : listTheme.trim();
    }

    /**
     * 服务端自定义的渲染方法:继承IFormSeverRenderer
     * @return java.lang.String
     **/
    public String getListCustServerRenderer() {
        return listCustServerRenderer;
    }

    /**
     * 服务端自定义的渲染方法:继承IFormSeverRenderer
     * @param listCustServerRenderer 服务端自定义的渲染方法
     **/
    public void setListCustServerRenderer(String listCustServerRenderer) {
        this.listCustServerRenderer = listCustServerRenderer == null ? null : listCustServerRenderer.trim();
    }

    /**
     * 引入的脚本:多个通过;分割
     * @return java.lang.String
     **/
    public String getListCustRefJs() {
        return listCustRefJs;
    }

    /**
     * 引入的脚本:多个通过;分割
     * @param listCustRefJs 引入的脚本
     **/
    public void setListCustRefJs(String listCustRefJs) {
        this.listCustRefJs = listCustRefJs == null ? null : listCustRefJs.trim();
    }

    /**
     * 客户端自定义的渲染方法:需要指明具体的方法名称
     * @return java.lang.String
     **/
    public String getListCustClientRenderer() {
        return listCustClientRenderer;
    }

    /**
     * 客户端自定义的渲染方法:需要指明具体的方法名称
     * @param listCustClientRenderer 客户端自定义的渲染方法
     **/
    public void setListCustClientRenderer(String listCustClientRenderer) {
        this.listCustClientRenderer = listCustClientRenderer == null ? null : listCustClientRenderer.trim();
    }

    /**
     * 自定义设置备注:使用了自定义设置相关方法的备注说明
     * @return java.lang.String
     **/
    public String getListCustDesc() {
        return listCustDesc;
    }

    /**
     * 自定义设置备注:使用了自定义设置相关方法的备注说明
     * @param listCustDesc 自定义设置备注
     **/
    public void setListCustDesc(String listCustDesc) {
        this.listCustDesc = listCustDesc == null ? null : listCustDesc.trim();
    }
}