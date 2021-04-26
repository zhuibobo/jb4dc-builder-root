package com.jb4dc.workflow.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_model_integrated
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ModelIntegratedEntity {
    //MODEL_ID:
    @DBKeyField
    private String modelId;

    //MODEL_RE_ED:是否已经部署
    private String modelReEd;

    //MODEL_RE_ID:act_de_model表的ID
    private String modelReId;

    //MODEL_RE_SUCCESS:部署是否成功
    private String modelReSuccess;

    //MODEL_RE_KEY:启动键:act_de_model表的KEY_,充当ROOT_ID使用
    private String modelReKey;

    //MODEL_MODULE_ID:所属的模块ID
    private String modelModuleId;

    //MODEL_CODE:模型编码
    private String modelCode;

    //MODEL_FLOW_CATEGORY:模型分类:GeneralProcess[通用流程];ReceiveDocumentProcess[公文收文流程];SendDocumentProcess[公文发文流程];AdministrativeApprovalProcess[行政审批流程];AdministrativeLicensingProcess[行政许可流程];CommunityServiceProcess[社区服务流程]
    private String modelFlowCategory;

    //MODEL_IMAGE_CLASS:模型图标
    private String modelImageClass;

    //MODEL_PES_TITLE_TEXT:实例标题表达式
    private String modelPesTitleText;

    //MODEL_PES_TITLE_VALUE:实例标题表达式值
    private String modelPesTitleValue;

    //MODEL_PES_DESC_TEXT:实例备注表达式
    private String modelPesDescText;

    //MODEL_PES_DESC_VALUE:实例备注表达式值
    private String modelPesDescValue;

    //MODEL_PES_RESTART_ENB:已经结束的实例能否重启
    private String modelPesRestartEnb;

    //MODEL_PES_ANY_JUMP_ENB:能否跳转到任意节点
    private String modelPesAnyJumpEnb;

    //MODEL_NAME:模型名称
    private String modelName;

    //MODEL_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date modelCreateTime;

    //MODEL_CREATOR:创建者
    private String modelCreator;

    //MODEL_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date modelUpdateTime;

    //MODEL_UPDATER:更新人
    private String modelUpdater;

    //MODEL_DESC:备注
    private String modelDesc;

    //MODEL_STATUS:状态
    private String modelStatus;

    //MODEL_ORDER_NUM:排序号
    private Integer modelOrderNum;

    //MODEL_DEPLOYMENT_ID:部署ID
    private String modelDeploymentId;

    //MODEL_RESOURCE_NAME:资源名称
    private String modelResourceName;

    //MODEL_FROM_TYPE:流程模型来自上传或者页面设计
    private String modelFromType;

    //MODEL_SAVE_VERSION:保存版本号:每次保存都+1
    private Integer modelSaveVersion;

    //MODEL_LAST_VERSION:是否最后版本
    private String modelLastVersion;

    //MODEL_TENANT_ID:租户ID
    private String modelTenantId;

    //MODEL_LAST_RE_ED:是否最后部署版本
    private String modelLastReEd;

    //MODEL_CONTENT:模型定义XML内容
    private String modelContent;

    /**
     * 构造函数
     * @param modelId
     * @param modelReEd 是否已经部署
     * @param modelReId act_de_model表的ID
     * @param modelReSuccess 部署是否成功
     * @param modelReKey 启动键
     * @param modelModuleId 所属的模块ID
     * @param modelCode 模型编码
     * @param modelFlowCategory 模型分类
     * @param modelImageClass 模型图标
     * @param modelPesTitleText 实例标题表达式
     * @param modelPesTitleValue 实例标题表达式值
     * @param modelPesDescText 实例备注表达式
     * @param modelPesDescValue 实例备注表达式值
     * @param modelPesRestartEnb 已经结束的实例能否重启
     * @param modelPesAnyJumpEnb 能否跳转到任意节点
     * @param modelName 模型名称
     * @param modelCreateTime 创建时间
     * @param modelCreator 创建者
     * @param modelUpdateTime 更新时间
     * @param modelUpdater 更新人
     * @param modelDesc 备注
     * @param modelStatus 状态
     * @param modelOrderNum 排序号
     * @param modelDeploymentId 部署ID
     * @param modelResourceName 资源名称
     * @param modelFromType 流程模型来自上传或者页面设计
     * @param modelSaveVersion 保存版本号
     * @param modelLastVersion 是否最后版本
     * @param modelTenantId 租户ID
     * @param modelLastReEd 是否最后部署版本
     **/
    public ModelIntegratedEntity(String modelId, String modelReEd, String modelReId, String modelReSuccess, String modelReKey, String modelModuleId, String modelCode, String modelFlowCategory, String modelImageClass, String modelPesTitleText, String modelPesTitleValue, String modelPesDescText, String modelPesDescValue, String modelPesRestartEnb, String modelPesAnyJumpEnb, String modelName, Date modelCreateTime, String modelCreator, Date modelUpdateTime, String modelUpdater, String modelDesc, String modelStatus, Integer modelOrderNum, String modelDeploymentId, String modelResourceName, String modelFromType, Integer modelSaveVersion, String modelLastVersion, String modelTenantId, String modelLastReEd) {
        this.modelId = modelId;
        this.modelReEd = modelReEd;
        this.modelReId = modelReId;
        this.modelReSuccess = modelReSuccess;
        this.modelReKey = modelReKey;
        this.modelModuleId = modelModuleId;
        this.modelCode = modelCode;
        this.modelFlowCategory = modelFlowCategory;
        this.modelImageClass = modelImageClass;
        this.modelPesTitleText = modelPesTitleText;
        this.modelPesTitleValue = modelPesTitleValue;
        this.modelPesDescText = modelPesDescText;
        this.modelPesDescValue = modelPesDescValue;
        this.modelPesRestartEnb = modelPesRestartEnb;
        this.modelPesAnyJumpEnb = modelPesAnyJumpEnb;
        this.modelName = modelName;
        this.modelCreateTime = modelCreateTime;
        this.modelCreator = modelCreator;
        this.modelUpdateTime = modelUpdateTime;
        this.modelUpdater = modelUpdater;
        this.modelDesc = modelDesc;
        this.modelStatus = modelStatus;
        this.modelOrderNum = modelOrderNum;
        this.modelDeploymentId = modelDeploymentId;
        this.modelResourceName = modelResourceName;
        this.modelFromType = modelFromType;
        this.modelSaveVersion = modelSaveVersion;
        this.modelLastVersion = modelLastVersion;
        this.modelTenantId = modelTenantId;
        this.modelLastReEd = modelLastReEd;
    }

    /**
     * 构造函数
     * @param modelId
     * @param modelReEd 是否已经部署
     * @param modelReId act_de_model表的ID
     * @param modelReSuccess 部署是否成功
     * @param modelReKey 启动键
     * @param modelModuleId 所属的模块ID
     * @param modelCode 模型编码
     * @param modelFlowCategory 模型分类
     * @param modelImageClass 模型图标
     * @param modelPesTitleText 实例标题表达式
     * @param modelPesTitleValue 实例标题表达式值
     * @param modelPesDescText 实例备注表达式
     * @param modelPesDescValue 实例备注表达式值
     * @param modelPesRestartEnb 已经结束的实例能否重启
     * @param modelPesAnyJumpEnb 能否跳转到任意节点
     * @param modelName 模型名称
     * @param modelCreateTime 创建时间
     * @param modelCreator 创建者
     * @param modelUpdateTime 更新时间
     * @param modelUpdater 更新人
     * @param modelDesc 备注
     * @param modelStatus 状态
     * @param modelOrderNum 排序号
     * @param modelDeploymentId 部署ID
     * @param modelResourceName 资源名称
     * @param modelFromType 流程模型来自上传或者页面设计
     * @param modelSaveVersion 保存版本号
     * @param modelLastVersion 是否最后版本
     * @param modelTenantId 租户ID
     * @param modelLastReEd 是否最后部署版本
     * @param modelContent 模型定义XML内容
     **/
    public ModelIntegratedEntity(String modelId, String modelReEd, String modelReId, String modelReSuccess, String modelReKey, String modelModuleId, String modelCode, String modelFlowCategory, String modelImageClass, String modelPesTitleText, String modelPesTitleValue, String modelPesDescText, String modelPesDescValue, String modelPesRestartEnb, String modelPesAnyJumpEnb, String modelName, Date modelCreateTime, String modelCreator, Date modelUpdateTime, String modelUpdater, String modelDesc, String modelStatus, Integer modelOrderNum, String modelDeploymentId, String modelResourceName, String modelFromType, Integer modelSaveVersion, String modelLastVersion, String modelTenantId, String modelLastReEd, String modelContent) {
        this.modelId = modelId;
        this.modelReEd = modelReEd;
        this.modelReId = modelReId;
        this.modelReSuccess = modelReSuccess;
        this.modelReKey = modelReKey;
        this.modelModuleId = modelModuleId;
        this.modelCode = modelCode;
        this.modelFlowCategory = modelFlowCategory;
        this.modelImageClass = modelImageClass;
        this.modelPesTitleText = modelPesTitleText;
        this.modelPesTitleValue = modelPesTitleValue;
        this.modelPesDescText = modelPesDescText;
        this.modelPesDescValue = modelPesDescValue;
        this.modelPesRestartEnb = modelPesRestartEnb;
        this.modelPesAnyJumpEnb = modelPesAnyJumpEnb;
        this.modelName = modelName;
        this.modelCreateTime = modelCreateTime;
        this.modelCreator = modelCreator;
        this.modelUpdateTime = modelUpdateTime;
        this.modelUpdater = modelUpdater;
        this.modelDesc = modelDesc;
        this.modelStatus = modelStatus;
        this.modelOrderNum = modelOrderNum;
        this.modelDeploymentId = modelDeploymentId;
        this.modelResourceName = modelResourceName;
        this.modelFromType = modelFromType;
        this.modelSaveVersion = modelSaveVersion;
        this.modelLastVersion = modelLastVersion;
        this.modelTenantId = modelTenantId;
        this.modelLastReEd = modelLastReEd;
        this.modelContent = modelContent;
    }

    public ModelIntegratedEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getModelId() {
        return modelId;
    }

    /**
     *
     * @param modelId
     **/
    public void setModelId(String modelId) {
        this.modelId = modelId == null ? null : modelId.trim();
    }

    /**
     * 是否已经部署
     * @return java.lang.String
     **/
    public String getModelReEd() {
        return modelReEd;
    }

    /**
     * 是否已经部署
     * @param modelReEd 是否已经部署
     **/
    public void setModelReEd(String modelReEd) {
        this.modelReEd = modelReEd == null ? null : modelReEd.trim();
    }

    /**
     * act_de_model表的ID
     * @return java.lang.String
     **/
    public String getModelReId() {
        return modelReId;
    }

    /**
     * act_de_model表的ID
     * @param modelReId act_de_model表的ID
     **/
    public void setModelReId(String modelReId) {
        this.modelReId = modelReId == null ? null : modelReId.trim();
    }

    /**
     * 部署是否成功
     * @return java.lang.String
     **/
    public String getModelReSuccess() {
        return modelReSuccess;
    }

    /**
     * 部署是否成功
     * @param modelReSuccess 部署是否成功
     **/
    public void setModelReSuccess(String modelReSuccess) {
        this.modelReSuccess = modelReSuccess == null ? null : modelReSuccess.trim();
    }

    /**
     * 启动键:act_de_model表的KEY_,充当ROOT_ID使用
     * @return java.lang.String
     **/
    public String getModelReKey() {
        return modelReKey;
    }

    /**
     * 启动键:act_de_model表的KEY_,充当ROOT_ID使用
     * @param modelReKey 启动键
     **/
    public void setModelReKey(String modelReKey) {
        this.modelReKey = modelReKey == null ? null : modelReKey.trim();
    }

    /**
     * 所属的模块ID
     * @return java.lang.String
     **/
    public String getModelModuleId() {
        return modelModuleId;
    }

    /**
     * 所属的模块ID
     * @param modelModuleId 所属的模块ID
     **/
    public void setModelModuleId(String modelModuleId) {
        this.modelModuleId = modelModuleId == null ? null : modelModuleId.trim();
    }

    /**
     * 模型编码
     * @return java.lang.String
     **/
    public String getModelCode() {
        return modelCode;
    }

    /**
     * 模型编码
     * @param modelCode 模型编码
     **/
    public void setModelCode(String modelCode) {
        this.modelCode = modelCode == null ? null : modelCode.trim();
    }

    /**
     * 模型分类:GeneralProcess[通用流程];ReceiveDocumentProcess[公文收文流程];SendDocumentProcess[公文发文流程];AdministrativeApprovalProcess[行政审批流程];AdministrativeLicensingProcess[行政许可流程];CommunityServiceProcess[社区服务流程]
     * @return java.lang.String
     **/
    public String getModelFlowCategory() {
        return modelFlowCategory;
    }

    /**
     * 模型分类:GeneralProcess[通用流程];ReceiveDocumentProcess[公文收文流程];SendDocumentProcess[公文发文流程];AdministrativeApprovalProcess[行政审批流程];AdministrativeLicensingProcess[行政许可流程];CommunityServiceProcess[社区服务流程]
     * @param modelFlowCategory 模型分类
     **/
    public void setModelFlowCategory(String modelFlowCategory) {
        this.modelFlowCategory = modelFlowCategory == null ? null : modelFlowCategory.trim();
    }

    /**
     * 模型图标
     * @return java.lang.String
     **/
    public String getModelImageClass() {
        return modelImageClass;
    }

    /**
     * 模型图标
     * @param modelImageClass 模型图标
     **/
    public void setModelImageClass(String modelImageClass) {
        this.modelImageClass = modelImageClass == null ? null : modelImageClass.trim();
    }

    /**
     * 实例标题表达式
     * @return java.lang.String
     **/
    public String getModelPesTitleText() {
        return modelPesTitleText;
    }

    /**
     * 实例标题表达式
     * @param modelPesTitleText 实例标题表达式
     **/
    public void setModelPesTitleText(String modelPesTitleText) {
        this.modelPesTitleText = modelPesTitleText == null ? null : modelPesTitleText.trim();
    }

    /**
     * 实例标题表达式值
     * @return java.lang.String
     **/
    public String getModelPesTitleValue() {
        return modelPesTitleValue;
    }

    /**
     * 实例标题表达式值
     * @param modelPesTitleValue 实例标题表达式值
     **/
    public void setModelPesTitleValue(String modelPesTitleValue) {
        this.modelPesTitleValue = modelPesTitleValue == null ? null : modelPesTitleValue.trim();
    }

    /**
     * 实例备注表达式
     * @return java.lang.String
     **/
    public String getModelPesDescText() {
        return modelPesDescText;
    }

    /**
     * 实例备注表达式
     * @param modelPesDescText 实例备注表达式
     **/
    public void setModelPesDescText(String modelPesDescText) {
        this.modelPesDescText = modelPesDescText == null ? null : modelPesDescText.trim();
    }

    /**
     * 实例备注表达式值
     * @return java.lang.String
     **/
    public String getModelPesDescValue() {
        return modelPesDescValue;
    }

    /**
     * 实例备注表达式值
     * @param modelPesDescValue 实例备注表达式值
     **/
    public void setModelPesDescValue(String modelPesDescValue) {
        this.modelPesDescValue = modelPesDescValue == null ? null : modelPesDescValue.trim();
    }

    /**
     * 已经结束的实例能否重启
     * @return java.lang.String
     **/
    public String getModelPesRestartEnb() {
        return modelPesRestartEnb;
    }

    /**
     * 已经结束的实例能否重启
     * @param modelPesRestartEnb 已经结束的实例能否重启
     **/
    public void setModelPesRestartEnb(String modelPesRestartEnb) {
        this.modelPesRestartEnb = modelPesRestartEnb == null ? null : modelPesRestartEnb.trim();
    }

    /**
     * 能否跳转到任意节点
     * @return java.lang.String
     **/
    public String getModelPesAnyJumpEnb() {
        return modelPesAnyJumpEnb;
    }

    /**
     * 能否跳转到任意节点
     * @param modelPesAnyJumpEnb 能否跳转到任意节点
     **/
    public void setModelPesAnyJumpEnb(String modelPesAnyJumpEnb) {
        this.modelPesAnyJumpEnb = modelPesAnyJumpEnb == null ? null : modelPesAnyJumpEnb.trim();
    }

    /**
     * 模型名称
     * @return java.lang.String
     **/
    public String getModelName() {
        return modelName;
    }

    /**
     * 模型名称
     * @param modelName 模型名称
     **/
    public void setModelName(String modelName) {
        this.modelName = modelName == null ? null : modelName.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getModelCreateTime() {
        return modelCreateTime;
    }

    /**
     * 创建时间
     * @param modelCreateTime 创建时间
     **/
    public void setModelCreateTime(Date modelCreateTime) {
        this.modelCreateTime = modelCreateTime;
    }

    /**
     * 创建者
     * @return java.lang.String
     **/
    public String getModelCreator() {
        return modelCreator;
    }

    /**
     * 创建者
     * @param modelCreator 创建者
     **/
    public void setModelCreator(String modelCreator) {
        this.modelCreator = modelCreator == null ? null : modelCreator.trim();
    }

    /**
     * 更新时间
     * @return java.util.Date
     **/
    public Date getModelUpdateTime() {
        return modelUpdateTime;
    }

    /**
     * 更新时间
     * @param modelUpdateTime 更新时间
     **/
    public void setModelUpdateTime(Date modelUpdateTime) {
        this.modelUpdateTime = modelUpdateTime;
    }

    /**
     * 更新人
     * @return java.lang.String
     **/
    public String getModelUpdater() {
        return modelUpdater;
    }

    /**
     * 更新人
     * @param modelUpdater 更新人
     **/
    public void setModelUpdater(String modelUpdater) {
        this.modelUpdater = modelUpdater == null ? null : modelUpdater.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getModelDesc() {
        return modelDesc;
    }

    /**
     * 备注
     * @param modelDesc 备注
     **/
    public void setModelDesc(String modelDesc) {
        this.modelDesc = modelDesc == null ? null : modelDesc.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getModelStatus() {
        return modelStatus;
    }

    /**
     * 状态
     * @param modelStatus 状态
     **/
    public void setModelStatus(String modelStatus) {
        this.modelStatus = modelStatus == null ? null : modelStatus.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getModelOrderNum() {
        return modelOrderNum;
    }

    /**
     * 排序号
     * @param modelOrderNum 排序号
     **/
    public void setModelOrderNum(Integer modelOrderNum) {
        this.modelOrderNum = modelOrderNum;
    }

    /**
     * 部署ID
     * @return java.lang.String
     **/
    public String getModelDeploymentId() {
        return modelDeploymentId;
    }

    /**
     * 部署ID
     * @param modelDeploymentId 部署ID
     **/
    public void setModelDeploymentId(String modelDeploymentId) {
        this.modelDeploymentId = modelDeploymentId == null ? null : modelDeploymentId.trim();
    }

    /**
     * 资源名称
     * @return java.lang.String
     **/
    public String getModelResourceName() {
        return modelResourceName;
    }

    /**
     * 资源名称
     * @param modelResourceName 资源名称
     **/
    public void setModelResourceName(String modelResourceName) {
        this.modelResourceName = modelResourceName == null ? null : modelResourceName.trim();
    }

    /**
     * 流程模型来自上传或者页面设计
     * @return java.lang.String
     **/
    public String getModelFromType() {
        return modelFromType;
    }

    /**
     * 流程模型来自上传或者页面设计
     * @param modelFromType 流程模型来自上传或者页面设计
     **/
    public void setModelFromType(String modelFromType) {
        this.modelFromType = modelFromType == null ? null : modelFromType.trim();
    }

    /**
     * 保存版本号:每次保存都+1
     * @return java.lang.Integer
     **/
    public Integer getModelSaveVersion() {
        return modelSaveVersion;
    }

    /**
     * 保存版本号:每次保存都+1
     * @param modelSaveVersion 保存版本号
     **/
    public void setModelSaveVersion(Integer modelSaveVersion) {
        this.modelSaveVersion = modelSaveVersion;
    }

    /**
     * 是否最后版本
     * @return java.lang.String
     **/
    public String getModelLastVersion() {
        return modelLastVersion;
    }

    /**
     * 是否最后版本
     * @param modelLastVersion 是否最后版本
     **/
    public void setModelLastVersion(String modelLastVersion) {
        this.modelLastVersion = modelLastVersion == null ? null : modelLastVersion.trim();
    }

    /**
     * 租户ID
     * @return java.lang.String
     **/
    public String getModelTenantId() {
        return modelTenantId;
    }

    /**
     * 租户ID
     * @param modelTenantId 租户ID
     **/
    public void setModelTenantId(String modelTenantId) {
        this.modelTenantId = modelTenantId == null ? null : modelTenantId.trim();
    }

    /**
     * 是否最后部署版本
     * @return java.lang.String
     **/
    public String getModelLastReEd() {
        return modelLastReEd;
    }

    /**
     * 是否最后部署版本
     * @param modelLastReEd 是否最后部署版本
     **/
    public void setModelLastReEd(String modelLastReEd) {
        this.modelLastReEd = modelLastReEd == null ? null : modelLastReEd.trim();
    }

    /**
     * 模型定义XML内容
     * @return java.lang.String
     **/
    public String getModelContent() {
        return modelContent;
    }

    /**
     * 模型定义XML内容
     * @param modelContent 模型定义XML内容
     **/
    public void setModelContent(String modelContent) {
        this.modelContent = modelContent == null ? null : modelContent.trim();
    }
}