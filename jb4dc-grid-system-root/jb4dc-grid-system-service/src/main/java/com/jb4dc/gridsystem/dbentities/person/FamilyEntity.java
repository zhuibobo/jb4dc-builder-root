package com.jb4dc.gridsystem.dbentities.person;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.math.BigDecimal;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tgrid_family
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class FamilyEntity {
    //FAMILY_ID:
    @DBKeyField
    private String familyId;

    //FAMILY_HOUSE_ID:房屋ID
    private String familyHouseId;

    //FAMILY_HOUSE_CODE_FULL:房屋编号
    private String familyHouseCodeFull;

    //FAMILY_PER_COUNT:户口-应登记总数
    private Integer familyPerCount;

    //FAMILY_PER_IN:户口-在家人数
    private Integer familyPerIn;

    //FAMILY_PER_OUT:户口-不在家人数
    private Integer familyPerOut;

    //FAMILY_TYPE:户别:家庭户,集体户
    private String familyType;

    //FAMILY_PHONE:联系电话
    private String familyPhone;

    //FAMILY_HR_PROVINCE:户籍地址-省（直辖市、自治区）
    private String familyHrProvince;

    //FAMILY_HR_CITY:户籍地址-市（盟、州）
    private String familyHrCity;

    //FAMILY_HR_COUNTY:户籍地址-县（市、区、旗）
    private String familyHrCounty;

    //FAMILY_HOUSE_TYPE:住宅类型:普通住宅,集体住所,工作地住所,其他住房,无住房
    private String familyHouseType;

    //FAMILY_HOUSE_AREA:本户现住房建筑面积
    private BigDecimal familyHouseArea;

    //FAMILY_HOUSE_ROOM_NUM:本户现住房间数
    private Integer familyHouseRoomNum;

    //FAMILY_INPUT_UNIT_NAME:填报单位
    private String familyInputUnitName;

    //FAMILY_INPUT_UNIT_ID:填报单位
    private String familyInputUnitId;

    //FAMILY_INPUT_DATE:登记时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date familyInputDate;

    //FAMILY_INPUT_USER_NAME:登记人
    private String familyInputUserName;

    //FAMILY_INPUT_USER_ID:登记人ID
    private String familyInputUserId;

    //FAMILY_CITY_ID:城市Id
    private String familyCityId;

    //FAMILY_AREA_ID:区Id
    private String familyAreaId;

    //FAMILY_STREET_ID:街道Id:街道,乡镇
    private String familyStreetId;

    //FAMILY_COMMUNITY_ID:社区Id:社区,村
    private String familyCommunityId;

    //FAMILY_GRID_ID:所属网格Id
    private String familyGridId;

    //FAMILY_HEAD_HOUSEHOLD_NAME:户主姓名
    private String familyHeadHouseholdName;

    //FAMILY_HEAD_HOUSEHOLD_ID:户主ID
    private String familyHeadHouseholdId;

    /**
     * 构造函数
     * @param familyId
     * @param familyHouseId 房屋ID
     * @param familyHouseCodeFull 房屋编号
     * @param familyPerCount 户口-应登记总数
     * @param familyPerIn 户口-在家人数
     * @param familyPerOut 户口-不在家人数
     * @param familyType 户别
     * @param familyPhone 联系电话
     * @param familyHrProvince 户籍地址-省（直辖市、自治区）
     * @param familyHrCity 户籍地址-市（盟、州）
     * @param familyHrCounty 户籍地址-县（市、区、旗）
     * @param familyHouseType 住宅类型
     * @param familyHouseArea 本户现住房建筑面积
     * @param familyHouseRoomNum 本户现住房间数
     * @param familyInputUnitName 填报单位
     * @param familyInputUnitId 填报单位
     * @param familyInputDate 登记时间
     * @param familyInputUserName 登记人
     * @param familyInputUserId 登记人ID
     * @param familyCityId 城市Id
     * @param familyAreaId 区Id
     * @param familyStreetId 街道Id
     * @param familyCommunityId 社区Id
     * @param familyGridId 所属网格Id
     * @param familyHeadHouseholdName 户主姓名
     * @param familyHeadHouseholdId 户主ID
     **/
    public FamilyEntity(String familyId, String familyHouseId, String familyHouseCodeFull, Integer familyPerCount, Integer familyPerIn, Integer familyPerOut, String familyType, String familyPhone, String familyHrProvince, String familyHrCity, String familyHrCounty, String familyHouseType, BigDecimal familyHouseArea, Integer familyHouseRoomNum, String familyInputUnitName, String familyInputUnitId, Date familyInputDate, String familyInputUserName, String familyInputUserId, String familyCityId, String familyAreaId, String familyStreetId, String familyCommunityId, String familyGridId, String familyHeadHouseholdName, String familyHeadHouseholdId) {
        this.familyId = familyId;
        this.familyHouseId = familyHouseId;
        this.familyHouseCodeFull = familyHouseCodeFull;
        this.familyPerCount = familyPerCount;
        this.familyPerIn = familyPerIn;
        this.familyPerOut = familyPerOut;
        this.familyType = familyType;
        this.familyPhone = familyPhone;
        this.familyHrProvince = familyHrProvince;
        this.familyHrCity = familyHrCity;
        this.familyHrCounty = familyHrCounty;
        this.familyHouseType = familyHouseType;
        this.familyHouseArea = familyHouseArea;
        this.familyHouseRoomNum = familyHouseRoomNum;
        this.familyInputUnitName = familyInputUnitName;
        this.familyInputUnitId = familyInputUnitId;
        this.familyInputDate = familyInputDate;
        this.familyInputUserName = familyInputUserName;
        this.familyInputUserId = familyInputUserId;
        this.familyCityId = familyCityId;
        this.familyAreaId = familyAreaId;
        this.familyStreetId = familyStreetId;
        this.familyCommunityId = familyCommunityId;
        this.familyGridId = familyGridId;
        this.familyHeadHouseholdName = familyHeadHouseholdName;
        this.familyHeadHouseholdId = familyHeadHouseholdId;
    }

    public FamilyEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getFamilyId() {
        return familyId;
    }

    /**
     *
     * @param familyId
     **/
    public void setFamilyId(String familyId) {
        this.familyId = familyId == null ? null : familyId.trim();
    }

    /**
     * 房屋ID
     * @return java.lang.String
     **/
    public String getFamilyHouseId() {
        return familyHouseId;
    }

    /**
     * 房屋ID
     * @param familyHouseId 房屋ID
     **/
    public void setFamilyHouseId(String familyHouseId) {
        this.familyHouseId = familyHouseId == null ? null : familyHouseId.trim();
    }

    /**
     * 房屋编号
     * @return java.lang.String
     **/
    public String getFamilyHouseCodeFull() {
        return familyHouseCodeFull;
    }

    /**
     * 房屋编号
     * @param familyHouseCodeFull 房屋编号
     **/
    public void setFamilyHouseCodeFull(String familyHouseCodeFull) {
        this.familyHouseCodeFull = familyHouseCodeFull == null ? null : familyHouseCodeFull.trim();
    }

    /**
     * 户口-应登记总数
     * @return java.lang.Integer
     **/
    public Integer getFamilyPerCount() {
        return familyPerCount;
    }

    /**
     * 户口-应登记总数
     * @param familyPerCount 户口-应登记总数
     **/
    public void setFamilyPerCount(Integer familyPerCount) {
        this.familyPerCount = familyPerCount;
    }

    /**
     * 户口-在家人数
     * @return java.lang.Integer
     **/
    public Integer getFamilyPerIn() {
        return familyPerIn;
    }

    /**
     * 户口-在家人数
     * @param familyPerIn 户口-在家人数
     **/
    public void setFamilyPerIn(Integer familyPerIn) {
        this.familyPerIn = familyPerIn;
    }

    /**
     * 户口-不在家人数
     * @return java.lang.Integer
     **/
    public Integer getFamilyPerOut() {
        return familyPerOut;
    }

    /**
     * 户口-不在家人数
     * @param familyPerOut 户口-不在家人数
     **/
    public void setFamilyPerOut(Integer familyPerOut) {
        this.familyPerOut = familyPerOut;
    }

    /**
     * 户别:家庭户,集体户
     * @return java.lang.String
     **/
    public String getFamilyType() {
        return familyType;
    }

    /**
     * 户别:家庭户,集体户
     * @param familyType 户别
     **/
    public void setFamilyType(String familyType) {
        this.familyType = familyType == null ? null : familyType.trim();
    }

    /**
     * 联系电话
     * @return java.lang.String
     **/
    public String getFamilyPhone() {
        return familyPhone;
    }

    /**
     * 联系电话
     * @param familyPhone 联系电话
     **/
    public void setFamilyPhone(String familyPhone) {
        this.familyPhone = familyPhone == null ? null : familyPhone.trim();
    }

    /**
     * 户籍地址-省（直辖市、自治区）
     * @return java.lang.String
     **/
    public String getFamilyHrProvince() {
        return familyHrProvince;
    }

    /**
     * 户籍地址-省（直辖市、自治区）
     * @param familyHrProvince 户籍地址-省（直辖市、自治区）
     **/
    public void setFamilyHrProvince(String familyHrProvince) {
        this.familyHrProvince = familyHrProvince == null ? null : familyHrProvince.trim();
    }

    /**
     * 户籍地址-市（盟、州）
     * @return java.lang.String
     **/
    public String getFamilyHrCity() {
        return familyHrCity;
    }

    /**
     * 户籍地址-市（盟、州）
     * @param familyHrCity 户籍地址-市（盟、州）
     **/
    public void setFamilyHrCity(String familyHrCity) {
        this.familyHrCity = familyHrCity == null ? null : familyHrCity.trim();
    }

    /**
     * 户籍地址-县（市、区、旗）
     * @return java.lang.String
     **/
    public String getFamilyHrCounty() {
        return familyHrCounty;
    }

    /**
     * 户籍地址-县（市、区、旗）
     * @param familyHrCounty 户籍地址-县（市、区、旗）
     **/
    public void setFamilyHrCounty(String familyHrCounty) {
        this.familyHrCounty = familyHrCounty == null ? null : familyHrCounty.trim();
    }

    /**
     * 住宅类型:普通住宅,集体住所,工作地住所,其他住房,无住房
     * @return java.lang.String
     **/
    public String getFamilyHouseType() {
        return familyHouseType;
    }

    /**
     * 住宅类型:普通住宅,集体住所,工作地住所,其他住房,无住房
     * @param familyHouseType 住宅类型
     **/
    public void setFamilyHouseType(String familyHouseType) {
        this.familyHouseType = familyHouseType == null ? null : familyHouseType.trim();
    }

    /**
     * 本户现住房建筑面积
     * @return java.math.BigDecimal
     **/
    public BigDecimal getFamilyHouseArea() {
        return familyHouseArea;
    }

    /**
     * 本户现住房建筑面积
     * @param familyHouseArea 本户现住房建筑面积
     **/
    public void setFamilyHouseArea(BigDecimal familyHouseArea) {
        this.familyHouseArea = familyHouseArea;
    }

    /**
     * 本户现住房间数
     * @return java.lang.Integer
     **/
    public Integer getFamilyHouseRoomNum() {
        return familyHouseRoomNum;
    }

    /**
     * 本户现住房间数
     * @param familyHouseRoomNum 本户现住房间数
     **/
    public void setFamilyHouseRoomNum(Integer familyHouseRoomNum) {
        this.familyHouseRoomNum = familyHouseRoomNum;
    }

    /**
     * 填报单位
     * @return java.lang.String
     **/
    public String getFamilyInputUnitName() {
        return familyInputUnitName;
    }

    /**
     * 填报单位
     * @param familyInputUnitName 填报单位
     **/
    public void setFamilyInputUnitName(String familyInputUnitName) {
        this.familyInputUnitName = familyInputUnitName == null ? null : familyInputUnitName.trim();
    }

    /**
     * 填报单位
     * @return java.lang.String
     **/
    public String getFamilyInputUnitId() {
        return familyInputUnitId;
    }

    /**
     * 填报单位
     * @param familyInputUnitId 填报单位
     **/
    public void setFamilyInputUnitId(String familyInputUnitId) {
        this.familyInputUnitId = familyInputUnitId == null ? null : familyInputUnitId.trim();
    }

    /**
     * 登记时间
     * @return java.util.Date
     **/
    public Date getFamilyInputDate() {
        return familyInputDate;
    }

    /**
     * 登记时间
     * @param familyInputDate 登记时间
     **/
    public void setFamilyInputDate(Date familyInputDate) {
        this.familyInputDate = familyInputDate;
    }

    /**
     * 登记人
     * @return java.lang.String
     **/
    public String getFamilyInputUserName() {
        return familyInputUserName;
    }

    /**
     * 登记人
     * @param familyInputUserName 登记人
     **/
    public void setFamilyInputUserName(String familyInputUserName) {
        this.familyInputUserName = familyInputUserName == null ? null : familyInputUserName.trim();
    }

    /**
     * 登记人ID
     * @return java.lang.String
     **/
    public String getFamilyInputUserId() {
        return familyInputUserId;
    }

    /**
     * 登记人ID
     * @param familyInputUserId 登记人ID
     **/
    public void setFamilyInputUserId(String familyInputUserId) {
        this.familyInputUserId = familyInputUserId == null ? null : familyInputUserId.trim();
    }

    /**
     * 城市Id
     * @return java.lang.String
     **/
    public String getFamilyCityId() {
        return familyCityId;
    }

    /**
     * 城市Id
     * @param familyCityId 城市Id
     **/
    public void setFamilyCityId(String familyCityId) {
        this.familyCityId = familyCityId == null ? null : familyCityId.trim();
    }

    /**
     * 区Id
     * @return java.lang.String
     **/
    public String getFamilyAreaId() {
        return familyAreaId;
    }

    /**
     * 区Id
     * @param familyAreaId 区Id
     **/
    public void setFamilyAreaId(String familyAreaId) {
        this.familyAreaId = familyAreaId == null ? null : familyAreaId.trim();
    }

    /**
     * 街道Id:街道,乡镇
     * @return java.lang.String
     **/
    public String getFamilyStreetId() {
        return familyStreetId;
    }

    /**
     * 街道Id:街道,乡镇
     * @param familyStreetId 街道Id
     **/
    public void setFamilyStreetId(String familyStreetId) {
        this.familyStreetId = familyStreetId == null ? null : familyStreetId.trim();
    }

    /**
     * 社区Id:社区,村
     * @return java.lang.String
     **/
    public String getFamilyCommunityId() {
        return familyCommunityId;
    }

    /**
     * 社区Id:社区,村
     * @param familyCommunityId 社区Id
     **/
    public void setFamilyCommunityId(String familyCommunityId) {
        this.familyCommunityId = familyCommunityId == null ? null : familyCommunityId.trim();
    }

    /**
     * 所属网格Id
     * @return java.lang.String
     **/
    public String getFamilyGridId() {
        return familyGridId;
    }

    /**
     * 所属网格Id
     * @param familyGridId 所属网格Id
     **/
    public void setFamilyGridId(String familyGridId) {
        this.familyGridId = familyGridId == null ? null : familyGridId.trim();
    }

    /**
     * 户主姓名
     * @return java.lang.String
     **/
    public String getFamilyHeadHouseholdName() {
        return familyHeadHouseholdName;
    }

    /**
     * 户主姓名
     * @param familyHeadHouseholdName 户主姓名
     **/
    public void setFamilyHeadHouseholdName(String familyHeadHouseholdName) {
        this.familyHeadHouseholdName = familyHeadHouseholdName == null ? null : familyHeadHouseholdName.trim();
    }

    /**
     * 户主ID
     * @return java.lang.String
     **/
    public String getFamilyHeadHouseholdId() {
        return familyHeadHouseholdId;
    }

    /**
     * 户主ID
     * @param familyHeadHouseholdId 户主ID
     **/
    public void setFamilyHeadHouseholdId(String familyHeadHouseholdId) {
        this.familyHeadHouseholdId = familyHeadHouseholdId == null ? null : familyHeadHouseholdId.trim();
    }
}