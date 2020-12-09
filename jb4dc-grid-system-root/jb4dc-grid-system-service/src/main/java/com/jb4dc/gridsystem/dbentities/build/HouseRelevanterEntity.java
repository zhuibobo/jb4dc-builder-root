package com.jb4dc.gridsystem.dbentities.build;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.math.BigDecimal;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tgrid_house_relevanter
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class HouseRelevanterEntity {
    //RETER_ID:
    @DBKeyField
    private String reterId;

    //RETER_HOUSE_ID:房屋ID
    private String reterHouseId;

    //RETER_TYPE:相关人员类型:产权人,代理人
    private String reterType;

    //RETER_NAME:相关人员姓名
    private String reterName;

    //RETER_PHONE:相关人员电话号码
    private String reterPhone;

    //RETER_CERT_CATEGORY:相关人员证件类别
    private String reterCertCategory;

    //RETER_CERT_CODE:证件号码
    private String reterCertCode;

    //RETER_ADDRESS:地址
    private String reterAddress;

    //RETER_PERCENT:产权比例
    private BigDecimal reterPercent;

    //RETER_REMARK:备注
    private String reterRemark;

    //RETER_ORDER_NUM:排序号
    private Integer reterOrderNum;

    //RETER_PHOTO_ID:照片ID
    private String reterPhotoId;

    //RETER_ID_CARD_UUID:身份证UUID
    private String reterIdCardUuid;

    //RETER_ID_CARD_PUBLIC_FORM:身份证签发机关
    private String reterIdCardPublicForm;

    //RETER_ID_CARD_EFF_DATE:身份证有效日期
    private String reterIdCardEffDate;

    //RETER_ID_CARD_ADDRESS:居住地址
    private String reterIdCardAddress;

    //RETER_BIRTHDAY:出生日期
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date reterBirthday;

    //RETER_NATION:民族
    private String reterNation;

    /**
     * 构造函数
     * @param reterId
     * @param reterHouseId 房屋ID
     * @param reterType 相关人员类型
     * @param reterName 相关人员姓名
     * @param reterPhone 相关人员电话号码
     * @param reterCertCategory 相关人员证件类别
     * @param reterCertCode 证件号码
     * @param reterAddress 地址
     * @param reterPercent 产权比例
     * @param reterRemark 备注
     * @param reterOrderNum 排序号
     * @param reterPhotoId 照片ID
     * @param reterIdCardUuid 身份证UUID
     * @param reterIdCardPublicForm 身份证签发机关
     * @param reterIdCardEffDate 身份证有效日期
     * @param reterIdCardAddress 居住地址
     * @param reterBirthday 出生日期
     * @param reterNation 民族
     **/
    public HouseRelevanterEntity(String reterId, String reterHouseId, String reterType, String reterName, String reterPhone, String reterCertCategory, String reterCertCode, String reterAddress, BigDecimal reterPercent, String reterRemark, Integer reterOrderNum, String reterPhotoId, String reterIdCardUuid, String reterIdCardPublicForm, String reterIdCardEffDate, String reterIdCardAddress, Date reterBirthday, String reterNation) {
        this.reterId = reterId;
        this.reterHouseId = reterHouseId;
        this.reterType = reterType;
        this.reterName = reterName;
        this.reterPhone = reterPhone;
        this.reterCertCategory = reterCertCategory;
        this.reterCertCode = reterCertCode;
        this.reterAddress = reterAddress;
        this.reterPercent = reterPercent;
        this.reterRemark = reterRemark;
        this.reterOrderNum = reterOrderNum;
        this.reterPhotoId = reterPhotoId;
        this.reterIdCardUuid = reterIdCardUuid;
        this.reterIdCardPublicForm = reterIdCardPublicForm;
        this.reterIdCardEffDate = reterIdCardEffDate;
        this.reterIdCardAddress = reterIdCardAddress;
        this.reterBirthday = reterBirthday;
        this.reterNation = reterNation;
    }

    public HouseRelevanterEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getReterId() {
        return reterId;
    }

    /**
     *
     * @param reterId
     **/
    public void setReterId(String reterId) {
        this.reterId = reterId == null ? null : reterId.trim();
    }

    /**
     * 房屋ID
     * @return java.lang.String
     **/
    public String getReterHouseId() {
        return reterHouseId;
    }

    /**
     * 房屋ID
     * @param reterHouseId 房屋ID
     **/
    public void setReterHouseId(String reterHouseId) {
        this.reterHouseId = reterHouseId == null ? null : reterHouseId.trim();
    }

    /**
     * 相关人员类型:产权人,代理人
     * @return java.lang.String
     **/
    public String getReterType() {
        return reterType;
    }

    /**
     * 相关人员类型:产权人,代理人
     * @param reterType 相关人员类型
     **/
    public void setReterType(String reterType) {
        this.reterType = reterType == null ? null : reterType.trim();
    }

    /**
     * 相关人员姓名
     * @return java.lang.String
     **/
    public String getReterName() {
        return reterName;
    }

    /**
     * 相关人员姓名
     * @param reterName 相关人员姓名
     **/
    public void setReterName(String reterName) {
        this.reterName = reterName == null ? null : reterName.trim();
    }

    /**
     * 相关人员电话号码
     * @return java.lang.String
     **/
    public String getReterPhone() {
        return reterPhone;
    }

    /**
     * 相关人员电话号码
     * @param reterPhone 相关人员电话号码
     **/
    public void setReterPhone(String reterPhone) {
        this.reterPhone = reterPhone == null ? null : reterPhone.trim();
    }

    /**
     * 相关人员证件类别
     * @return java.lang.String
     **/
    public String getReterCertCategory() {
        return reterCertCategory;
    }

    /**
     * 相关人员证件类别
     * @param reterCertCategory 相关人员证件类别
     **/
    public void setReterCertCategory(String reterCertCategory) {
        this.reterCertCategory = reterCertCategory == null ? null : reterCertCategory.trim();
    }

    /**
     * 证件号码
     * @return java.lang.String
     **/
    public String getReterCertCode() {
        return reterCertCode;
    }

    /**
     * 证件号码
     * @param reterCertCode 证件号码
     **/
    public void setReterCertCode(String reterCertCode) {
        this.reterCertCode = reterCertCode == null ? null : reterCertCode.trim();
    }

    /**
     * 地址
     * @return java.lang.String
     **/
    public String getReterAddress() {
        return reterAddress;
    }

    /**
     * 地址
     * @param reterAddress 地址
     **/
    public void setReterAddress(String reterAddress) {
        this.reterAddress = reterAddress == null ? null : reterAddress.trim();
    }

    /**
     * 产权比例
     * @return java.math.BigDecimal
     **/
    public BigDecimal getReterPercent() {
        return reterPercent;
    }

    /**
     * 产权比例
     * @param reterPercent 产权比例
     **/
    public void setReterPercent(BigDecimal reterPercent) {
        this.reterPercent = reterPercent;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getReterRemark() {
        return reterRemark;
    }

    /**
     * 备注
     * @param reterRemark 备注
     **/
    public void setReterRemark(String reterRemark) {
        this.reterRemark = reterRemark == null ? null : reterRemark.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getReterOrderNum() {
        return reterOrderNum;
    }

    /**
     * 排序号
     * @param reterOrderNum 排序号
     **/
    public void setReterOrderNum(Integer reterOrderNum) {
        this.reterOrderNum = reterOrderNum;
    }

    /**
     * 照片ID
     * @return java.lang.String
     **/
    public String getReterPhotoId() {
        return reterPhotoId;
    }

    /**
     * 照片ID
     * @param reterPhotoId 照片ID
     **/
    public void setReterPhotoId(String reterPhotoId) {
        this.reterPhotoId = reterPhotoId == null ? null : reterPhotoId.trim();
    }

    /**
     * 身份证UUID
     * @return java.lang.String
     **/
    public String getReterIdCardUuid() {
        return reterIdCardUuid;
    }

    /**
     * 身份证UUID
     * @param reterIdCardUuid 身份证UUID
     **/
    public void setReterIdCardUuid(String reterIdCardUuid) {
        this.reterIdCardUuid = reterIdCardUuid == null ? null : reterIdCardUuid.trim();
    }

    /**
     * 身份证签发机关
     * @return java.lang.String
     **/
    public String getReterIdCardPublicForm() {
        return reterIdCardPublicForm;
    }

    /**
     * 身份证签发机关
     * @param reterIdCardPublicForm 身份证签发机关
     **/
    public void setReterIdCardPublicForm(String reterIdCardPublicForm) {
        this.reterIdCardPublicForm = reterIdCardPublicForm == null ? null : reterIdCardPublicForm.trim();
    }

    /**
     * 身份证有效日期
     * @return java.lang.String
     **/
    public String getReterIdCardEffDate() {
        return reterIdCardEffDate;
    }

    /**
     * 身份证有效日期
     * @param reterIdCardEffDate 身份证有效日期
     **/
    public void setReterIdCardEffDate(String reterIdCardEffDate) {
        this.reterIdCardEffDate = reterIdCardEffDate == null ? null : reterIdCardEffDate.trim();
    }

    /**
     * 居住地址
     * @return java.lang.String
     **/
    public String getReterIdCardAddress() {
        return reterIdCardAddress;
    }

    /**
     * 居住地址
     * @param reterIdCardAddress 居住地址
     **/
    public void setReterIdCardAddress(String reterIdCardAddress) {
        this.reterIdCardAddress = reterIdCardAddress == null ? null : reterIdCardAddress.trim();
    }

    /**
     * 出生日期
     * @return java.util.Date
     **/
    public Date getReterBirthday() {
        return reterBirthday;
    }

    /**
     * 出生日期
     * @param reterBirthday 出生日期
     **/
    public void setReterBirthday(Date reterBirthday) {
        this.reterBirthday = reterBirthday;
    }

    /**
     * 民族
     * @return java.lang.String
     **/
    public String getReterNation() {
        return reterNation;
    }

    /**
     * 民族
     * @param reterNation 民族
     **/
    public void setReterNation(String reterNation) {
        this.reterNation = reterNation == null ? null : reterNation.trim();
    }
}