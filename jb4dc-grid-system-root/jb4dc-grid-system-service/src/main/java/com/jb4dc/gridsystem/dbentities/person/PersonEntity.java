package com.jb4dc.gridsystem.dbentities.person;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tgrid_person
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class PersonEntity {
    //PERSON_ID:
    @DBKeyField
    private String personId;

    //PERSON_FAMILY_ID:家庭ID
    private String personFamilyId;

    //PERSON_HOUSE_ID:房屋ID
    private String personHouseId;

    //PERSON_NAME:姓名
    private String personName;

    //PERSON_RELATIONSHIP:与户主关系:户主;配偶;子女;父母;岳父母或公婆;祖父母;媳婿;孙子女;兄弟姐妹;其他
    private String personRelationship;

    //PERSON_ID_CARD:身份证号
    private String personIdCard;

    //PERSON_SEX:性别:男;女
    private String personSex;

    //PERSON_NATION:民族
    private String personNation;

    //PERSON_HR_LOCATION:户口登记地:本村(居)委会;本街道其他村(居)委会;本区其他街道;非本区;香港特别行政区、澳门特别行政区、台湾地区;国外;户口待定
    private String personHrLocation;

    //PERSON_HR_LEAVE:离开户口登记地时间:1 没有离开户口登记地;2 不满半年;3 半年以上,不满一年;4 一年以上,不满二年;5 二年以上,不满三年;6 三年以上,不满四年;7 四年以上,不满五年;8 五年以上,不满十年;9 十年以上
    private String personHrLeave;

    //PERSON_HR_LEAVE_FOR:离开户口登记地原因:0 工作就业;1 学习培训;2 随同离开/投亲靠友;3 拆迁/搬家;4 寄挂户口;5 婚姻嫁娶;6 照料孙子女;7 为子女就学;8 养老/康养;9 其他;
    private String personHrLeaveFor;

    //PERSON_EDUCATION:受教育程度:1 未上过学;2 学前教育;3 小学;4 初中;5 高中;6 大学专科;7 大学本科;8 硕士研究生;9 博士研究生
    private String personEducation;

    //PERSON_SP_TYPE:特殊群体
    private String personSpType;

    //PERSON_PHONE_ID:照片ID
    private String personPhoneId;

    //PERSON_PHONE:联系电话
    private String personPhone;

    //PERSON_INPUT_UNIT_NAME:填报单位
    private String personInputUnitName;

    //PERSON_INPUT_UNIT_ID:填报单位
    private String personInputUnitId;

    //PERSON_INPUT_DATE:登记时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date personInputDate;

    //PERSON_INPUT_USER_NAME:登记人
    private String personInputUserName;

    //PERSON_INPUT_USER_ID:登记人ID
    private String personInputUserId;

    //PERSON_CITY_ID:城市Id
    private String personCityId;

    //PERSON_AREA_ID:区Id
    private String personAreaId;

    //PERSON_STREET_ID:街道Id:街道,乡镇
    private String personStreetId;

    //PERSON_COMMUNITY_ID:社区Id:社区,村
    private String personCommunityId;

    //PERSON_GRID_ID:所属网格Id
    private String personGridId;

    //PERSON_CATEGORY:人口类别:中国居民,外国人
    private String personCategory;

    //PERSON_FORE_EN_NAME:外国人-外文姓名
    private String personForeEnName;

    //PERSON_FORE_NATIONALITY:外国人-国籍
    private String personForeNationality;

    //PERSON_FORE_CERTIFICATE_TYPE:证件类型
    private String personForeCertificateType;

    //PERSON_FORE_CERTIFICATE_NUM:证件号码
    private String personForeCertificateNum;

    //PERSON_REMARK:备注
    private String personRemark;

    //PERSON_ORDER_NUM:排序号
    private Integer personOrderNum;

    /**
     * 构造函数
     * @param personId
     * @param personFamilyId 家庭ID
     * @param personHouseId 房屋ID
     * @param personName 姓名
     * @param personRelationship 与户主关系
     * @param personIdCard 身份证号
     * @param personSex 性别
     * @param personNation 民族
     * @param personHrLocation 户口登记地
     * @param personHrLeave 离开户口登记地时间
     * @param personHrLeaveFor 离开户口登记地原因
     * @param personEducation 受教育程度
     * @param personSpType 特殊群体
     * @param personPhoneId 照片ID
     * @param personPhone 联系电话
     * @param personInputUnitName 填报单位
     * @param personInputUnitId 填报单位
     * @param personInputDate 登记时间
     * @param personInputUserName 登记人
     * @param personInputUserId 登记人ID
     * @param personCityId 城市Id
     * @param personAreaId 区Id
     * @param personStreetId 街道Id
     * @param personCommunityId 社区Id
     * @param personGridId 所属网格Id
     * @param personCategory 人口类别
     * @param personForeEnName 外国人-外文姓名
     * @param personForeNationality 外国人-国籍
     * @param personForeCertificateType 证件类型
     * @param personForeCertificateNum 证件号码
     * @param personRemark 备注
     * @param personOrderNum 排序号
     **/
    public PersonEntity(String personId, String personFamilyId, String personHouseId, String personName, String personRelationship, String personIdCard, String personSex, String personNation, String personHrLocation, String personHrLeave, String personHrLeaveFor, String personEducation, String personSpType, String personPhoneId, String personPhone, String personInputUnitName, String personInputUnitId, Date personInputDate, String personInputUserName, String personInputUserId, String personCityId, String personAreaId, String personStreetId, String personCommunityId, String personGridId, String personCategory, String personForeEnName, String personForeNationality, String personForeCertificateType, String personForeCertificateNum, String personRemark, Integer personOrderNum) {
        this.personId = personId;
        this.personFamilyId = personFamilyId;
        this.personHouseId = personHouseId;
        this.personName = personName;
        this.personRelationship = personRelationship;
        this.personIdCard = personIdCard;
        this.personSex = personSex;
        this.personNation = personNation;
        this.personHrLocation = personHrLocation;
        this.personHrLeave = personHrLeave;
        this.personHrLeaveFor = personHrLeaveFor;
        this.personEducation = personEducation;
        this.personSpType = personSpType;
        this.personPhoneId = personPhoneId;
        this.personPhone = personPhone;
        this.personInputUnitName = personInputUnitName;
        this.personInputUnitId = personInputUnitId;
        this.personInputDate = personInputDate;
        this.personInputUserName = personInputUserName;
        this.personInputUserId = personInputUserId;
        this.personCityId = personCityId;
        this.personAreaId = personAreaId;
        this.personStreetId = personStreetId;
        this.personCommunityId = personCommunityId;
        this.personGridId = personGridId;
        this.personCategory = personCategory;
        this.personForeEnName = personForeEnName;
        this.personForeNationality = personForeNationality;
        this.personForeCertificateType = personForeCertificateType;
        this.personForeCertificateNum = personForeCertificateNum;
        this.personRemark = personRemark;
        this.personOrderNum = personOrderNum;
    }

    public PersonEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getPersonId() {
        return personId;
    }

    /**
     *
     * @param personId
     **/
    public void setPersonId(String personId) {
        this.personId = personId == null ? null : personId.trim();
    }

    /**
     * 家庭ID
     * @return java.lang.String
     **/
    public String getPersonFamilyId() {
        return personFamilyId;
    }

    /**
     * 家庭ID
     * @param personFamilyId 家庭ID
     **/
    public void setPersonFamilyId(String personFamilyId) {
        this.personFamilyId = personFamilyId == null ? null : personFamilyId.trim();
    }

    /**
     * 房屋ID
     * @return java.lang.String
     **/
    public String getPersonHouseId() {
        return personHouseId;
    }

    /**
     * 房屋ID
     * @param personHouseId 房屋ID
     **/
    public void setPersonHouseId(String personHouseId) {
        this.personHouseId = personHouseId == null ? null : personHouseId.trim();
    }

    /**
     * 姓名
     * @return java.lang.String
     **/
    public String getPersonName() {
        return personName;
    }

    /**
     * 姓名
     * @param personName 姓名
     **/
    public void setPersonName(String personName) {
        this.personName = personName == null ? null : personName.trim();
    }

    /**
     * 与户主关系:户主;配偶;子女;父母;岳父母或公婆;祖父母;媳婿;孙子女;兄弟姐妹;其他
     * @return java.lang.String
     **/
    public String getPersonRelationship() {
        return personRelationship;
    }

    /**
     * 与户主关系:户主;配偶;子女;父母;岳父母或公婆;祖父母;媳婿;孙子女;兄弟姐妹;其他
     * @param personRelationship 与户主关系
     **/
    public void setPersonRelationship(String personRelationship) {
        this.personRelationship = personRelationship == null ? null : personRelationship.trim();
    }

    /**
     * 身份证号
     * @return java.lang.String
     **/
    public String getPersonIdCard() {
        return personIdCard;
    }

    /**
     * 身份证号
     * @param personIdCard 身份证号
     **/
    public void setPersonIdCard(String personIdCard) {
        this.personIdCard = personIdCard == null ? null : personIdCard.trim();
    }

    /**
     * 性别:男;女
     * @return java.lang.String
     **/
    public String getPersonSex() {
        return personSex;
    }

    /**
     * 性别:男;女
     * @param personSex 性别
     **/
    public void setPersonSex(String personSex) {
        this.personSex = personSex == null ? null : personSex.trim();
    }

    /**
     * 民族
     * @return java.lang.String
     **/
    public String getPersonNation() {
        return personNation;
    }

    /**
     * 民族
     * @param personNation 民族
     **/
    public void setPersonNation(String personNation) {
        this.personNation = personNation == null ? null : personNation.trim();
    }

    /**
     * 户口登记地:本村(居)委会;本街道其他村(居)委会;本区其他街道;非本区;香港特别行政区、澳门特别行政区、台湾地区;国外;户口待定
     * @return java.lang.String
     **/
    public String getPersonHrLocation() {
        return personHrLocation;
    }

    /**
     * 户口登记地:本村(居)委会;本街道其他村(居)委会;本区其他街道;非本区;香港特别行政区、澳门特别行政区、台湾地区;国外;户口待定
     * @param personHrLocation 户口登记地
     **/
    public void setPersonHrLocation(String personHrLocation) {
        this.personHrLocation = personHrLocation == null ? null : personHrLocation.trim();
    }

    /**
     * 离开户口登记地时间:1 没有离开户口登记地;2 不满半年;3 半年以上,不满一年;4 一年以上,不满二年;5 二年以上,不满三年;6 三年以上,不满四年;7 四年以上,不满五年;8 五年以上,不满十年;9 十年以上
     * @return java.lang.String
     **/
    public String getPersonHrLeave() {
        return personHrLeave;
    }

    /**
     * 离开户口登记地时间:1 没有离开户口登记地;2 不满半年;3 半年以上,不满一年;4 一年以上,不满二年;5 二年以上,不满三年;6 三年以上,不满四年;7 四年以上,不满五年;8 五年以上,不满十年;9 十年以上
     * @param personHrLeave 离开户口登记地时间
     **/
    public void setPersonHrLeave(String personHrLeave) {
        this.personHrLeave = personHrLeave == null ? null : personHrLeave.trim();
    }

    /**
     * 离开户口登记地原因:0 工作就业;1 学习培训;2 随同离开/投亲靠友;3 拆迁/搬家;4 寄挂户口;5 婚姻嫁娶;6 照料孙子女;7 为子女就学;8 养老/康养;9 其他;
     * @return java.lang.String
     **/
    public String getPersonHrLeaveFor() {
        return personHrLeaveFor;
    }

    /**
     * 离开户口登记地原因:0 工作就业;1 学习培训;2 随同离开/投亲靠友;3 拆迁/搬家;4 寄挂户口;5 婚姻嫁娶;6 照料孙子女;7 为子女就学;8 养老/康养;9 其他;
     * @param personHrLeaveFor 离开户口登记地原因
     **/
    public void setPersonHrLeaveFor(String personHrLeaveFor) {
        this.personHrLeaveFor = personHrLeaveFor == null ? null : personHrLeaveFor.trim();
    }

    /**
     * 受教育程度:1 未上过学;2 学前教育;3 小学;4 初中;5 高中;6 大学专科;7 大学本科;8 硕士研究生;9 博士研究生
     * @return java.lang.String
     **/
    public String getPersonEducation() {
        return personEducation;
    }

    /**
     * 受教育程度:1 未上过学;2 学前教育;3 小学;4 初中;5 高中;6 大学专科;7 大学本科;8 硕士研究生;9 博士研究生
     * @param personEducation 受教育程度
     **/
    public void setPersonEducation(String personEducation) {
        this.personEducation = personEducation == null ? null : personEducation.trim();
    }

    /**
     * 特殊群体
     * @return java.lang.String
     **/
    public String getPersonSpType() {
        return personSpType;
    }

    /**
     * 特殊群体
     * @param personSpType 特殊群体
     **/
    public void setPersonSpType(String personSpType) {
        this.personSpType = personSpType == null ? null : personSpType.trim();
    }

    /**
     * 照片ID
     * @return java.lang.String
     **/
    public String getPersonPhoneId() {
        return personPhoneId;
    }

    /**
     * 照片ID
     * @param personPhoneId 照片ID
     **/
    public void setPersonPhoneId(String personPhoneId) {
        this.personPhoneId = personPhoneId == null ? null : personPhoneId.trim();
    }

    /**
     * 联系电话
     * @return java.lang.String
     **/
    public String getPersonPhone() {
        return personPhone;
    }

    /**
     * 联系电话
     * @param personPhone 联系电话
     **/
    public void setPersonPhone(String personPhone) {
        this.personPhone = personPhone == null ? null : personPhone.trim();
    }

    /**
     * 填报单位
     * @return java.lang.String
     **/
    public String getPersonInputUnitName() {
        return personInputUnitName;
    }

    /**
     * 填报单位
     * @param personInputUnitName 填报单位
     **/
    public void setPersonInputUnitName(String personInputUnitName) {
        this.personInputUnitName = personInputUnitName == null ? null : personInputUnitName.trim();
    }

    /**
     * 填报单位
     * @return java.lang.String
     **/
    public String getPersonInputUnitId() {
        return personInputUnitId;
    }

    /**
     * 填报单位
     * @param personInputUnitId 填报单位
     **/
    public void setPersonInputUnitId(String personInputUnitId) {
        this.personInputUnitId = personInputUnitId == null ? null : personInputUnitId.trim();
    }

    /**
     * 登记时间
     * @return java.util.Date
     **/
    public Date getPersonInputDate() {
        return personInputDate;
    }

    /**
     * 登记时间
     * @param personInputDate 登记时间
     **/
    public void setPersonInputDate(Date personInputDate) {
        this.personInputDate = personInputDate;
    }

    /**
     * 登记人
     * @return java.lang.String
     **/
    public String getPersonInputUserName() {
        return personInputUserName;
    }

    /**
     * 登记人
     * @param personInputUserName 登记人
     **/
    public void setPersonInputUserName(String personInputUserName) {
        this.personInputUserName = personInputUserName == null ? null : personInputUserName.trim();
    }

    /**
     * 登记人ID
     * @return java.lang.String
     **/
    public String getPersonInputUserId() {
        return personInputUserId;
    }

    /**
     * 登记人ID
     * @param personInputUserId 登记人ID
     **/
    public void setPersonInputUserId(String personInputUserId) {
        this.personInputUserId = personInputUserId == null ? null : personInputUserId.trim();
    }

    /**
     * 城市Id
     * @return java.lang.String
     **/
    public String getPersonCityId() {
        return personCityId;
    }

    /**
     * 城市Id
     * @param personCityId 城市Id
     **/
    public void setPersonCityId(String personCityId) {
        this.personCityId = personCityId == null ? null : personCityId.trim();
    }

    /**
     * 区Id
     * @return java.lang.String
     **/
    public String getPersonAreaId() {
        return personAreaId;
    }

    /**
     * 区Id
     * @param personAreaId 区Id
     **/
    public void setPersonAreaId(String personAreaId) {
        this.personAreaId = personAreaId == null ? null : personAreaId.trim();
    }

    /**
     * 街道Id:街道,乡镇
     * @return java.lang.String
     **/
    public String getPersonStreetId() {
        return personStreetId;
    }

    /**
     * 街道Id:街道,乡镇
     * @param personStreetId 街道Id
     **/
    public void setPersonStreetId(String personStreetId) {
        this.personStreetId = personStreetId == null ? null : personStreetId.trim();
    }

    /**
     * 社区Id:社区,村
     * @return java.lang.String
     **/
    public String getPersonCommunityId() {
        return personCommunityId;
    }

    /**
     * 社区Id:社区,村
     * @param personCommunityId 社区Id
     **/
    public void setPersonCommunityId(String personCommunityId) {
        this.personCommunityId = personCommunityId == null ? null : personCommunityId.trim();
    }

    /**
     * 所属网格Id
     * @return java.lang.String
     **/
    public String getPersonGridId() {
        return personGridId;
    }

    /**
     * 所属网格Id
     * @param personGridId 所属网格Id
     **/
    public void setPersonGridId(String personGridId) {
        this.personGridId = personGridId == null ? null : personGridId.trim();
    }

    /**
     * 人口类别:中国居民,外国人
     * @return java.lang.String
     **/
    public String getPersonCategory() {
        return personCategory;
    }

    /**
     * 人口类别:中国居民,外国人
     * @param personCategory 人口类别
     **/
    public void setPersonCategory(String personCategory) {
        this.personCategory = personCategory == null ? null : personCategory.trim();
    }

    /**
     * 外国人-外文姓名
     * @return java.lang.String
     **/
    public String getPersonForeEnName() {
        return personForeEnName;
    }

    /**
     * 外国人-外文姓名
     * @param personForeEnName 外国人-外文姓名
     **/
    public void setPersonForeEnName(String personForeEnName) {
        this.personForeEnName = personForeEnName == null ? null : personForeEnName.trim();
    }

    /**
     * 外国人-国籍
     * @return java.lang.String
     **/
    public String getPersonForeNationality() {
        return personForeNationality;
    }

    /**
     * 外国人-国籍
     * @param personForeNationality 外国人-国籍
     **/
    public void setPersonForeNationality(String personForeNationality) {
        this.personForeNationality = personForeNationality == null ? null : personForeNationality.trim();
    }

    /**
     * 证件类型
     * @return java.lang.String
     **/
    public String getPersonForeCertificateType() {
        return personForeCertificateType;
    }

    /**
     * 证件类型
     * @param personForeCertificateType 证件类型
     **/
    public void setPersonForeCertificateType(String personForeCertificateType) {
        this.personForeCertificateType = personForeCertificateType == null ? null : personForeCertificateType.trim();
    }

    /**
     * 证件号码
     * @return java.lang.String
     **/
    public String getPersonForeCertificateNum() {
        return personForeCertificateNum;
    }

    /**
     * 证件号码
     * @param personForeCertificateNum 证件号码
     **/
    public void setPersonForeCertificateNum(String personForeCertificateNum) {
        this.personForeCertificateNum = personForeCertificateNum == null ? null : personForeCertificateNum.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getPersonRemark() {
        return personRemark;
    }

    /**
     * 备注
     * @param personRemark 备注
     **/
    public void setPersonRemark(String personRemark) {
        this.personRemark = personRemark == null ? null : personRemark.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getPersonOrderNum() {
        return personOrderNum;
    }

    /**
     * 排序号
     * @param personOrderNum 排序号
     **/
    public void setPersonOrderNum(Integer personOrderNum) {
        this.personOrderNum = personOrderNum;
    }
}