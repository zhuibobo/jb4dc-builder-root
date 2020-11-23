package com.jb4dc.gridsystem.dbentities.enterprise;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.math.BigDecimal;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tgrid_enterprise_info
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class EnterpriseInfoEntity {
    //ENT_ID:
    @DBKeyField
    private String entId;

    //ENT_GRID_ID:所属网格Id
    private String entGridId;

    //ENT_HOUSE_ID:房屋ID
    private String entHouseId;

    //ENT_HOUSE_CODE:房屋编号
    private String entHouseCode;

    //ENT_NAME:企业（门店）名称
    private String entName;

    //ENT_BUSINESS_NUM:营业执照号
    private String entBusinessNum;

    //ENT_ORGAN_CODE:组织机构代码
    private String entOrganCode;

    //ENT_PLACE_PHONE:单位联系电话
    private String entPlacePhone;

    //ENT_PLACE_AREA:单位营业面积（平方米）
    private BigDecimal entPlaceArea;

    //ENT_PLACE_ADDRESS:单位详细地址
    private String entPlaceAddress;

    //ENT_IS_ANNUAL_INSPECTION:是否年检:是,否
    private String entIsAnnualInspection;

    //ENT_LEGAL_NAME:法定代表人（经营者）姓名
    private String entLegalName;

    //ENT_LEGAL_PHONE:法定代表人（经营者）联系电话
    private String entLegalPhone;

    //ENT_LEGAL_ADDRESS:法人住址
    private String entLegalAddress;

    //ENT_LEGAL_CERTIFICATE_TYPE:法人证件类型
    private String entLegalCertificateType;

    //ENT_LEGAL_CERTIFICATE_NUM:法人证件号码
    private String entLegalCertificateNum;

    //ENT_SCOPE_OF_BUSINESS:经营范围
    private String entScopeOfBusiness;

    //ENT_MODE_OF_OPERATION:经营方式
    private String entModeOfOperation;

    //ENT_SET_UP_DATE:成立日期
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date entSetUpDate;

    //ENT_CHECK_DATE:核准日期
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date entCheckDate;

    //ENT_INPUT_UNIT_NAME:填报单位
    private String entInputUnitName;

    //ENT_INPUT_UNIT_ID:填报单位
    private String entInputUnitId;

    //ENT_INPUT_DATE:登记时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date entInputDate;

    //ENT_INPUT_USER_NAME:登记人
    private String entInputUserName;

    //ENT_INPUT_USER_ID:登记人ID
    private String entInputUserId;

    //ENT_REMARK:备注
    private String entRemark;

    //ENT_ORDER_NUM:排序号
    private Integer entOrderNum;

    /**
     * 构造函数
     * @param entId
     * @param entGridId 所属网格Id
     * @param entHouseId 房屋ID
     * @param entHouseCode 房屋编号
     * @param entName 企业（门店）名称
     * @param entBusinessNum 营业执照号
     * @param entOrganCode 组织机构代码
     * @param entPlacePhone 单位联系电话
     * @param entPlaceArea 单位营业面积（平方米）
     * @param entPlaceAddress 单位详细地址
     * @param entIsAnnualInspection 是否年检
     * @param entLegalName 法定代表人（经营者）姓名
     * @param entLegalPhone 法定代表人（经营者）联系电话
     * @param entLegalAddress 法人住址
     * @param entLegalCertificateType 法人证件类型
     * @param entLegalCertificateNum 法人证件号码
     * @param entScopeOfBusiness 经营范围
     * @param entModeOfOperation 经营方式
     * @param entSetUpDate 成立日期
     * @param entCheckDate 核准日期
     * @param entInputUnitName 填报单位
     * @param entInputUnitId 填报单位
     * @param entInputDate 登记时间
     * @param entInputUserName 登记人
     * @param entInputUserId 登记人ID
     * @param entRemark 备注
     * @param entOrderNum 排序号
     **/
    public EnterpriseInfoEntity(String entId, String entGridId, String entHouseId, String entHouseCode, String entName, String entBusinessNum, String entOrganCode, String entPlacePhone, BigDecimal entPlaceArea, String entPlaceAddress, String entIsAnnualInspection, String entLegalName, String entLegalPhone, String entLegalAddress, String entLegalCertificateType, String entLegalCertificateNum, String entScopeOfBusiness, String entModeOfOperation, Date entSetUpDate, Date entCheckDate, String entInputUnitName, String entInputUnitId, Date entInputDate, String entInputUserName, String entInputUserId, String entRemark, Integer entOrderNum) {
        this.entId = entId;
        this.entGridId = entGridId;
        this.entHouseId = entHouseId;
        this.entHouseCode = entHouseCode;
        this.entName = entName;
        this.entBusinessNum = entBusinessNum;
        this.entOrganCode = entOrganCode;
        this.entPlacePhone = entPlacePhone;
        this.entPlaceArea = entPlaceArea;
        this.entPlaceAddress = entPlaceAddress;
        this.entIsAnnualInspection = entIsAnnualInspection;
        this.entLegalName = entLegalName;
        this.entLegalPhone = entLegalPhone;
        this.entLegalAddress = entLegalAddress;
        this.entLegalCertificateType = entLegalCertificateType;
        this.entLegalCertificateNum = entLegalCertificateNum;
        this.entScopeOfBusiness = entScopeOfBusiness;
        this.entModeOfOperation = entModeOfOperation;
        this.entSetUpDate = entSetUpDate;
        this.entCheckDate = entCheckDate;
        this.entInputUnitName = entInputUnitName;
        this.entInputUnitId = entInputUnitId;
        this.entInputDate = entInputDate;
        this.entInputUserName = entInputUserName;
        this.entInputUserId = entInputUserId;
        this.entRemark = entRemark;
        this.entOrderNum = entOrderNum;
    }

    public EnterpriseInfoEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getEntId() {
        return entId;
    }

    /**
     *
     * @param entId
     **/
    public void setEntId(String entId) {
        this.entId = entId == null ? null : entId.trim();
    }

    /**
     * 所属网格Id
     * @return java.lang.String
     **/
    public String getEntGridId() {
        return entGridId;
    }

    /**
     * 所属网格Id
     * @param entGridId 所属网格Id
     **/
    public void setEntGridId(String entGridId) {
        this.entGridId = entGridId == null ? null : entGridId.trim();
    }

    /**
     * 房屋ID
     * @return java.lang.String
     **/
    public String getEntHouseId() {
        return entHouseId;
    }

    /**
     * 房屋ID
     * @param entHouseId 房屋ID
     **/
    public void setEntHouseId(String entHouseId) {
        this.entHouseId = entHouseId == null ? null : entHouseId.trim();
    }

    /**
     * 房屋编号
     * @return java.lang.String
     **/
    public String getEntHouseCode() {
        return entHouseCode;
    }

    /**
     * 房屋编号
     * @param entHouseCode 房屋编号
     **/
    public void setEntHouseCode(String entHouseCode) {
        this.entHouseCode = entHouseCode == null ? null : entHouseCode.trim();
    }

    /**
     * 企业（门店）名称
     * @return java.lang.String
     **/
    public String getEntName() {
        return entName;
    }

    /**
     * 企业（门店）名称
     * @param entName 企业（门店）名称
     **/
    public void setEntName(String entName) {
        this.entName = entName == null ? null : entName.trim();
    }

    /**
     * 营业执照号
     * @return java.lang.String
     **/
    public String getEntBusinessNum() {
        return entBusinessNum;
    }

    /**
     * 营业执照号
     * @param entBusinessNum 营业执照号
     **/
    public void setEntBusinessNum(String entBusinessNum) {
        this.entBusinessNum = entBusinessNum == null ? null : entBusinessNum.trim();
    }

    /**
     * 组织机构代码
     * @return java.lang.String
     **/
    public String getEntOrganCode() {
        return entOrganCode;
    }

    /**
     * 组织机构代码
     * @param entOrganCode 组织机构代码
     **/
    public void setEntOrganCode(String entOrganCode) {
        this.entOrganCode = entOrganCode == null ? null : entOrganCode.trim();
    }

    /**
     * 单位联系电话
     * @return java.lang.String
     **/
    public String getEntPlacePhone() {
        return entPlacePhone;
    }

    /**
     * 单位联系电话
     * @param entPlacePhone 单位联系电话
     **/
    public void setEntPlacePhone(String entPlacePhone) {
        this.entPlacePhone = entPlacePhone == null ? null : entPlacePhone.trim();
    }

    /**
     * 单位营业面积（平方米）
     * @return java.math.BigDecimal
     **/
    public BigDecimal getEntPlaceArea() {
        return entPlaceArea;
    }

    /**
     * 单位营业面积（平方米）
     * @param entPlaceArea 单位营业面积（平方米）
     **/
    public void setEntPlaceArea(BigDecimal entPlaceArea) {
        this.entPlaceArea = entPlaceArea;
    }

    /**
     * 单位详细地址
     * @return java.lang.String
     **/
    public String getEntPlaceAddress() {
        return entPlaceAddress;
    }

    /**
     * 单位详细地址
     * @param entPlaceAddress 单位详细地址
     **/
    public void setEntPlaceAddress(String entPlaceAddress) {
        this.entPlaceAddress = entPlaceAddress == null ? null : entPlaceAddress.trim();
    }

    /**
     * 是否年检:是,否
     * @return java.lang.String
     **/
    public String getEntIsAnnualInspection() {
        return entIsAnnualInspection;
    }

    /**
     * 是否年检:是,否
     * @param entIsAnnualInspection 是否年检
     **/
    public void setEntIsAnnualInspection(String entIsAnnualInspection) {
        this.entIsAnnualInspection = entIsAnnualInspection == null ? null : entIsAnnualInspection.trim();
    }

    /**
     * 法定代表人（经营者）姓名
     * @return java.lang.String
     **/
    public String getEntLegalName() {
        return entLegalName;
    }

    /**
     * 法定代表人（经营者）姓名
     * @param entLegalName 法定代表人（经营者）姓名
     **/
    public void setEntLegalName(String entLegalName) {
        this.entLegalName = entLegalName == null ? null : entLegalName.trim();
    }

    /**
     * 法定代表人（经营者）联系电话
     * @return java.lang.String
     **/
    public String getEntLegalPhone() {
        return entLegalPhone;
    }

    /**
     * 法定代表人（经营者）联系电话
     * @param entLegalPhone 法定代表人（经营者）联系电话
     **/
    public void setEntLegalPhone(String entLegalPhone) {
        this.entLegalPhone = entLegalPhone == null ? null : entLegalPhone.trim();
    }

    /**
     * 法人住址
     * @return java.lang.String
     **/
    public String getEntLegalAddress() {
        return entLegalAddress;
    }

    /**
     * 法人住址
     * @param entLegalAddress 法人住址
     **/
    public void setEntLegalAddress(String entLegalAddress) {
        this.entLegalAddress = entLegalAddress == null ? null : entLegalAddress.trim();
    }

    /**
     * 法人证件类型
     * @return java.lang.String
     **/
    public String getEntLegalCertificateType() {
        return entLegalCertificateType;
    }

    /**
     * 法人证件类型
     * @param entLegalCertificateType 法人证件类型
     **/
    public void setEntLegalCertificateType(String entLegalCertificateType) {
        this.entLegalCertificateType = entLegalCertificateType == null ? null : entLegalCertificateType.trim();
    }

    /**
     * 法人证件号码
     * @return java.lang.String
     **/
    public String getEntLegalCertificateNum() {
        return entLegalCertificateNum;
    }

    /**
     * 法人证件号码
     * @param entLegalCertificateNum 法人证件号码
     **/
    public void setEntLegalCertificateNum(String entLegalCertificateNum) {
        this.entLegalCertificateNum = entLegalCertificateNum == null ? null : entLegalCertificateNum.trim();
    }

    /**
     * 经营范围
     * @return java.lang.String
     **/
    public String getEntScopeOfBusiness() {
        return entScopeOfBusiness;
    }

    /**
     * 经营范围
     * @param entScopeOfBusiness 经营范围
     **/
    public void setEntScopeOfBusiness(String entScopeOfBusiness) {
        this.entScopeOfBusiness = entScopeOfBusiness == null ? null : entScopeOfBusiness.trim();
    }

    /**
     * 经营方式
     * @return java.lang.String
     **/
    public String getEntModeOfOperation() {
        return entModeOfOperation;
    }

    /**
     * 经营方式
     * @param entModeOfOperation 经营方式
     **/
    public void setEntModeOfOperation(String entModeOfOperation) {
        this.entModeOfOperation = entModeOfOperation == null ? null : entModeOfOperation.trim();
    }

    /**
     * 成立日期
     * @return java.util.Date
     **/
    public Date getEntSetUpDate() {
        return entSetUpDate;
    }

    /**
     * 成立日期
     * @param entSetUpDate 成立日期
     **/
    public void setEntSetUpDate(Date entSetUpDate) {
        this.entSetUpDate = entSetUpDate;
    }

    /**
     * 核准日期
     * @return java.util.Date
     **/
    public Date getEntCheckDate() {
        return entCheckDate;
    }

    /**
     * 核准日期
     * @param entCheckDate 核准日期
     **/
    public void setEntCheckDate(Date entCheckDate) {
        this.entCheckDate = entCheckDate;
    }

    /**
     * 填报单位
     * @return java.lang.String
     **/
    public String getEntInputUnitName() {
        return entInputUnitName;
    }

    /**
     * 填报单位
     * @param entInputUnitName 填报单位
     **/
    public void setEntInputUnitName(String entInputUnitName) {
        this.entInputUnitName = entInputUnitName == null ? null : entInputUnitName.trim();
    }

    /**
     * 填报单位
     * @return java.lang.String
     **/
    public String getEntInputUnitId() {
        return entInputUnitId;
    }

    /**
     * 填报单位
     * @param entInputUnitId 填报单位
     **/
    public void setEntInputUnitId(String entInputUnitId) {
        this.entInputUnitId = entInputUnitId == null ? null : entInputUnitId.trim();
    }

    /**
     * 登记时间
     * @return java.util.Date
     **/
    public Date getEntInputDate() {
        return entInputDate;
    }

    /**
     * 登记时间
     * @param entInputDate 登记时间
     **/
    public void setEntInputDate(Date entInputDate) {
        this.entInputDate = entInputDate;
    }

    /**
     * 登记人
     * @return java.lang.String
     **/
    public String getEntInputUserName() {
        return entInputUserName;
    }

    /**
     * 登记人
     * @param entInputUserName 登记人
     **/
    public void setEntInputUserName(String entInputUserName) {
        this.entInputUserName = entInputUserName == null ? null : entInputUserName.trim();
    }

    /**
     * 登记人ID
     * @return java.lang.String
     **/
    public String getEntInputUserId() {
        return entInputUserId;
    }

    /**
     * 登记人ID
     * @param entInputUserId 登记人ID
     **/
    public void setEntInputUserId(String entInputUserId) {
        this.entInputUserId = entInputUserId == null ? null : entInputUserId.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getEntRemark() {
        return entRemark;
    }

    /**
     * 备注
     * @param entRemark 备注
     **/
    public void setEntRemark(String entRemark) {
        this.entRemark = entRemark == null ? null : entRemark.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getEntOrderNum() {
        return entOrderNum;
    }

    /**
     * 排序号
     * @param entOrderNum 排序号
     **/
    public void setEntOrderNum(Integer entOrderNum) {
        this.entOrderNum = entOrderNum;
    }
}