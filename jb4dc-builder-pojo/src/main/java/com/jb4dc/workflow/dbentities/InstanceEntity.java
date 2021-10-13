package com.jb4dc.workflow.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_instance
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class InstanceEntity {
    //INST_ID:
    @DBKeyField
    private String instId;

    //INST_TITLE:流程实例标题:根据模型的MODEL_PES_TITLE_VALUE生成
    private String instTitle;

    //INST_DESC:流程实例备注:根据模型的MODEL_PES_DESC_VALUE生成
    private String instDesc;

    //INST_CUST_DESC:流程实例备注:创建实例是手工输入备注
    private String instCustDesc;

    //INST_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date instCreateTime;

    //INST_CREATOR:创建者
    private String instCreator;

    //INST_CREATOR_ID:创建者
    private String instCreatorId;

    //INST_ORGAN_NAME:创建者所在组织
    private String instOrganName;

    //INST_ORGAN_ID:创建者所在组织ID
    private String instOrganId;

    //INST_STATUS:状态:Running;End;Draft;Suspended....
    private String instStatus;

    //INST_END_TIME:办结事件
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date instEndTime;

    //INST_RU_EXECUTION_ID:关联act_ru_execution的ID_
    private String instRuExecutionId;

    //INST_RU_PROC_INST_ID:关联act_ru_execution的PROC_INST_ID_
    private String instRuProcInstId;

    //INST_RU_BUSINESS_KEY:关联act_ru_execution的BUSINESS_KEY_
    private String instRuBusinessKey;

    //INST_RU_PROC_DEF_ID:关联act_ru_execution的PROC_DEF_ID_
    private String instRuProcDefId;

    //INST_ORDER_NUM:排序号
    private Integer instOrderNum;

    //INST_MOD_ID:所属模型ID
    private String instModId;

    //INST_MOD_CATEGORY:模型分类:GeneralProcess[通用流程];ReceiveDocumentProcess[公文收文流程];SendDocumentProcess[公文发文流程];AdministrativeApprovalProcess[行政审批流程];AdministrativeLicensingProcess[行政许可流程];CommunityServiceProcess[社区服务流程]
    private String instModCategory;

    //INST_MOD_MODULE_ID:所属的模块ID
    private String instModModuleId;

    //INST_MOD_TENANT_ID:租户ID
    private String instModTenantId;

    //INST_RU_BUSINESS_RELATION:业务关联信息:表关系等
    private String instRuBusinessRelation;

    //INST_RU_BUSINESS_REL_TYPE:业务关联信息类型:FormRecordDataRelationPO
    private String instRuBusinessRelType;

    /**
     * 构造函数
     * @param instId
     * @param instTitle 流程实例标题
     * @param instDesc 流程实例备注
     * @param instCustDesc 流程实例备注
     * @param instCreateTime 创建时间
     * @param instCreator 创建者
     * @param instCreatorId 创建者
     * @param instOrganName 创建者所在组织
     * @param instOrganId 创建者所在组织ID
     * @param instStatus 状态
     * @param instEndTime 办结事件
     * @param instRuExecutionId 关联act_ru_execution的ID_
     * @param instRuProcInstId 关联act_ru_execution的PROC_INST_ID_
     * @param instRuBusinessKey 关联act_ru_execution的BUSINESS_KEY_
     * @param instRuProcDefId 关联act_ru_execution的PROC_DEF_ID_
     * @param instOrderNum 排序号
     * @param instModId 所属模型ID
     * @param instModCategory 模型分类
     * @param instModModuleId 所属的模块ID
     * @param instModTenantId 租户ID
     * @param instRuBusinessRelation 业务关联信息
     * @param instRuBusinessRelType 业务关联信息类型
     **/
    public InstanceEntity(String instId, String instTitle, String instDesc, String instCustDesc, Date instCreateTime, String instCreator, String instCreatorId, String instOrganName, String instOrganId, String instStatus, Date instEndTime, String instRuExecutionId, String instRuProcInstId, String instRuBusinessKey, String instRuProcDefId, Integer instOrderNum, String instModId, String instModCategory, String instModModuleId, String instModTenantId, String instRuBusinessRelation, String instRuBusinessRelType) {
        this.instId = instId;
        this.instTitle = instTitle;
        this.instDesc = instDesc;
        this.instCustDesc = instCustDesc;
        this.instCreateTime = instCreateTime;
        this.instCreator = instCreator;
        this.instCreatorId = instCreatorId;
        this.instOrganName = instOrganName;
        this.instOrganId = instOrganId;
        this.instStatus = instStatus;
        this.instEndTime = instEndTime;
        this.instRuExecutionId = instRuExecutionId;
        this.instRuProcInstId = instRuProcInstId;
        this.instRuBusinessKey = instRuBusinessKey;
        this.instRuProcDefId = instRuProcDefId;
        this.instOrderNum = instOrderNum;
        this.instModId = instModId;
        this.instModCategory = instModCategory;
        this.instModModuleId = instModModuleId;
        this.instModTenantId = instModTenantId;
        this.instRuBusinessRelation = instRuBusinessRelation;
        this.instRuBusinessRelType = instRuBusinessRelType;
    }

    /**
     * 构造函数
     * @param instId
     * @param instTitle 流程实例标题
     * @param instDesc 流程实例备注
     * @param instCustDesc 流程实例备注
     * @param instCreateTime 创建时间
     * @param instCreator 创建者
     * @param instCreatorId 创建者
     * @param instOrganName 创建者所在组织
     * @param instOrganId 创建者所在组织ID
     * @param instStatus 状态
     * @param instEndTime 办结事件
     * @param instRuExecutionId 关联act_ru_execution的ID_
     * @param instRuProcInstId 关联act_ru_execution的PROC_INST_ID_
     * @param instRuBusinessKey 关联act_ru_execution的BUSINESS_KEY_
     * @param instRuProcDefId 关联act_ru_execution的PROC_DEF_ID_
     * @param instOrderNum 排序号
     * @param instModId 所属模型ID
     * @param instModCategory 模型分类
     * @param instModModuleId 所属的模块ID
     * @param instModTenantId 租户ID
     **/
    public InstanceEntity(String instId, String instTitle, String instDesc, String instCustDesc, Date instCreateTime, String instCreator, String instCreatorId, String instOrganName, String instOrganId, String instStatus, Date instEndTime, String instRuExecutionId, String instRuProcInstId, String instRuBusinessKey, String instRuProcDefId, Integer instOrderNum, String instModId, String instModCategory, String instModModuleId, String instModTenantId) {
        this.instId = instId;
        this.instTitle = instTitle;
        this.instDesc = instDesc;
        this.instCustDesc = instCustDesc;
        this.instCreateTime = instCreateTime;
        this.instCreator = instCreator;
        this.instCreatorId = instCreatorId;
        this.instOrganName = instOrganName;
        this.instOrganId = instOrganId;
        this.instStatus = instStatus;
        this.instEndTime = instEndTime;
        this.instRuExecutionId = instRuExecutionId;
        this.instRuProcInstId = instRuProcInstId;
        this.instRuBusinessKey = instRuBusinessKey;
        this.instRuProcDefId = instRuProcDefId;
        this.instOrderNum = instOrderNum;
        this.instModId = instModId;
        this.instModCategory = instModCategory;
        this.instModModuleId = instModModuleId;
        this.instModTenantId = instModTenantId;
    }

    public InstanceEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getInstId() {
        return instId;
    }

    /**
     *
     * @param instId
     **/
    public void setInstId(String instId) {
        this.instId = instId == null ? null : instId.trim();
    }

    /**
     * 流程实例标题:根据模型的MODEL_PES_TITLE_VALUE生成
     * @return java.lang.String
     **/
    public String getInstTitle() {
        return instTitle;
    }

    /**
     * 流程实例标题:根据模型的MODEL_PES_TITLE_VALUE生成
     * @param instTitle 流程实例标题
     **/
    public void setInstTitle(String instTitle) {
        this.instTitle = instTitle == null ? null : instTitle.trim();
    }

    /**
     * 流程实例备注:根据模型的MODEL_PES_DESC_VALUE生成
     * @return java.lang.String
     **/
    public String getInstDesc() {
        return instDesc;
    }

    /**
     * 流程实例备注:根据模型的MODEL_PES_DESC_VALUE生成
     * @param instDesc 流程实例备注
     **/
    public void setInstDesc(String instDesc) {
        this.instDesc = instDesc == null ? null : instDesc.trim();
    }

    /**
     * 流程实例备注:创建实例是手工输入备注
     * @return java.lang.String
     **/
    public String getInstCustDesc() {
        return instCustDesc;
    }

    /**
     * 流程实例备注:创建实例是手工输入备注
     * @param instCustDesc 流程实例备注
     **/
    public void setInstCustDesc(String instCustDesc) {
        this.instCustDesc = instCustDesc == null ? null : instCustDesc.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getInstCreateTime() {
        return instCreateTime;
    }

    /**
     * 创建时间
     * @param instCreateTime 创建时间
     **/
    public void setInstCreateTime(Date instCreateTime) {
        this.instCreateTime = instCreateTime;
    }

    /**
     * 创建者
     * @return java.lang.String
     **/
    public String getInstCreator() {
        return instCreator;
    }

    /**
     * 创建者
     * @param instCreator 创建者
     **/
    public void setInstCreator(String instCreator) {
        this.instCreator = instCreator == null ? null : instCreator.trim();
    }

    /**
     * 创建者
     * @return java.lang.String
     **/
    public String getInstCreatorId() {
        return instCreatorId;
    }

    /**
     * 创建者
     * @param instCreatorId 创建者
     **/
    public void setInstCreatorId(String instCreatorId) {
        this.instCreatorId = instCreatorId == null ? null : instCreatorId.trim();
    }

    /**
     * 创建者所在组织
     * @return java.lang.String
     **/
    public String getInstOrganName() {
        return instOrganName;
    }

    /**
     * 创建者所在组织
     * @param instOrganName 创建者所在组织
     **/
    public void setInstOrganName(String instOrganName) {
        this.instOrganName = instOrganName == null ? null : instOrganName.trim();
    }

    /**
     * 创建者所在组织ID
     * @return java.lang.String
     **/
    public String getInstOrganId() {
        return instOrganId;
    }

    /**
     * 创建者所在组织ID
     * @param instOrganId 创建者所在组织ID
     **/
    public void setInstOrganId(String instOrganId) {
        this.instOrganId = instOrganId == null ? null : instOrganId.trim();
    }

    /**
     * 状态:Running;End;Draft;Suspended....
     * @return java.lang.String
     **/
    public String getInstStatus() {
        return instStatus;
    }

    /**
     * 状态:Running;End;Draft;Suspended....
     * @param instStatus 状态
     **/
    public void setInstStatus(String instStatus) {
        this.instStatus = instStatus == null ? null : instStatus.trim();
    }

    /**
     * 办结事件
     * @return java.util.Date
     **/
    public Date getInstEndTime() {
        return instEndTime;
    }

    /**
     * 办结事件
     * @param instEndTime 办结事件
     **/
    public void setInstEndTime(Date instEndTime) {
        this.instEndTime = instEndTime;
    }

    /**
     * 关联act_ru_execution的ID_
     * @return java.lang.String
     **/
    public String getInstRuExecutionId() {
        return instRuExecutionId;
    }

    /**
     * 关联act_ru_execution的ID_
     * @param instRuExecutionId 关联act_ru_execution的ID_
     **/
    public void setInstRuExecutionId(String instRuExecutionId) {
        this.instRuExecutionId = instRuExecutionId == null ? null : instRuExecutionId.trim();
    }

    /**
     * 关联act_ru_execution的PROC_INST_ID_
     * @return java.lang.String
     **/
    public String getInstRuProcInstId() {
        return instRuProcInstId;
    }

    /**
     * 关联act_ru_execution的PROC_INST_ID_
     * @param instRuProcInstId 关联act_ru_execution的PROC_INST_ID_
     **/
    public void setInstRuProcInstId(String instRuProcInstId) {
        this.instRuProcInstId = instRuProcInstId == null ? null : instRuProcInstId.trim();
    }

    /**
     * 关联act_ru_execution的BUSINESS_KEY_
     * @return java.lang.String
     **/
    public String getInstRuBusinessKey() {
        return instRuBusinessKey;
    }

    /**
     * 关联act_ru_execution的BUSINESS_KEY_
     * @param instRuBusinessKey 关联act_ru_execution的BUSINESS_KEY_
     **/
    public void setInstRuBusinessKey(String instRuBusinessKey) {
        this.instRuBusinessKey = instRuBusinessKey == null ? null : instRuBusinessKey.trim();
    }

    /**
     * 关联act_ru_execution的PROC_DEF_ID_
     * @return java.lang.String
     **/
    public String getInstRuProcDefId() {
        return instRuProcDefId;
    }

    /**
     * 关联act_ru_execution的PROC_DEF_ID_
     * @param instRuProcDefId 关联act_ru_execution的PROC_DEF_ID_
     **/
    public void setInstRuProcDefId(String instRuProcDefId) {
        this.instRuProcDefId = instRuProcDefId == null ? null : instRuProcDefId.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getInstOrderNum() {
        return instOrderNum;
    }

    /**
     * 排序号
     * @param instOrderNum 排序号
     **/
    public void setInstOrderNum(Integer instOrderNum) {
        this.instOrderNum = instOrderNum;
    }

    /**
     * 所属模型ID
     * @return java.lang.String
     **/
    public String getInstModId() {
        return instModId;
    }

    /**
     * 所属模型ID
     * @param instModId 所属模型ID
     **/
    public void setInstModId(String instModId) {
        this.instModId = instModId == null ? null : instModId.trim();
    }

    /**
     * 模型分类:GeneralProcess[通用流程];ReceiveDocumentProcess[公文收文流程];SendDocumentProcess[公文发文流程];AdministrativeApprovalProcess[行政审批流程];AdministrativeLicensingProcess[行政许可流程];CommunityServiceProcess[社区服务流程]
     * @return java.lang.String
     **/
    public String getInstModCategory() {
        return instModCategory;
    }

    /**
     * 模型分类:GeneralProcess[通用流程];ReceiveDocumentProcess[公文收文流程];SendDocumentProcess[公文发文流程];AdministrativeApprovalProcess[行政审批流程];AdministrativeLicensingProcess[行政许可流程];CommunityServiceProcess[社区服务流程]
     * @param instModCategory 模型分类
     **/
    public void setInstModCategory(String instModCategory) {
        this.instModCategory = instModCategory == null ? null : instModCategory.trim();
    }

    /**
     * 所属的模块ID
     * @return java.lang.String
     **/
    public String getInstModModuleId() {
        return instModModuleId;
    }

    /**
     * 所属的模块ID
     * @param instModModuleId 所属的模块ID
     **/
    public void setInstModModuleId(String instModModuleId) {
        this.instModModuleId = instModModuleId == null ? null : instModModuleId.trim();
    }

    /**
     * 租户ID
     * @return java.lang.String
     **/
    public String getInstModTenantId() {
        return instModTenantId;
    }

    /**
     * 租户ID
     * @param instModTenantId 租户ID
     **/
    public void setInstModTenantId(String instModTenantId) {
        this.instModTenantId = instModTenantId == null ? null : instModTenantId.trim();
    }

    /**
     * 业务关联信息:表关系等
     * @return java.lang.String
     **/
    public String getInstRuBusinessRelation() {
        return instRuBusinessRelation;
    }

    /**
     * 业务关联信息:表关系等
     * @param instRuBusinessRelation 业务关联信息
     **/
    public void setInstRuBusinessRelation(String instRuBusinessRelation) {
        this.instRuBusinessRelation = instRuBusinessRelation == null ? null : instRuBusinessRelation.trim();
    }

    /**
     * 业务关联信息类型:FormRecordDataRelationPO
     * @return java.lang.String
     **/
    public String getInstRuBusinessRelType() {
        return instRuBusinessRelType;
    }

    /**
     * 业务关联信息类型:FormRecordDataRelationPO
     * @param instRuBusinessRelType 业务关联信息类型
     **/
    public void setInstRuBusinessRelType(String instRuBusinessRelType) {
        this.instRuBusinessRelType = instRuBusinessRelType == null ? null : instRuBusinessRelType.trim();
    }
}