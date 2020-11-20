package com.jb4dc.gridsystem.dbentities.build;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tgrid_house_info
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class HouseInfoEntity {
    //HOUSE_ID:
    @DBKeyField
    private String houseId;

    //HOUSE_BUILD_ID:所在建筑物ID
    private String houseBuildId;

    //HOUSE_CODE:房屋编码
    private String houseCode;

    //HOUSE_CODE_NUM:房号
    private String houseCodeNum;

    //HOUSE_CODE_FULL:完整编码
    private String houseCodeFull;

    //HOUSE_FLOOR_NUM:楼层
    private Short houseFloorNum;

    //HOUSE_USED_DESC:使用情况
    private String houseUsedDesc;

    //HOUSE_DESIGN_FOR:设计用途:商业,办公,住宅,厂房,仓库,其它
    private String houseDesignFor;

    //HOUSE_USE_FOR:使用用途:商业,办公,住宅,厂房,仓库,其它
    private String houseUseFor;

    //HOUSE_STRUCTURE:住宅房型
    private String houseStructure;

    //HOUSE_IS_RENTAL_HOUSING:是否出租屋:是,否
    private String houseIsRentalHousing;

    //HOUSE_REMARK:备注
    private String houseRemark;

    //HOUSE_ORDER_NUM:排序号
    private Integer houseOrderNum;

    //HOUSE_INPUT_UNIT_NAME:填报单位
    private String houseInputUnitName;

    //HOUSE_INPUT_UNIT_ID:填报单位
    private String houseInputUnitId;

    //HOUSE_INPUT_DATE:登记时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date houseInputDate;

    //HOUSE_INPUT_USER_NAME:登记人
    private String houseInputUserName;

    //HOUSE_INPUT_USER_ID:登记人ID
    private String houseInputUserId;

    /**
     * 构造函数
     * @param houseId
     * @param houseBuildId 所在建筑物ID
     * @param houseCode 房屋编码
     * @param houseCodeNum 房号
     * @param houseCodeFull 完整编码
     * @param houseFloorNum 楼层
     * @param houseUsedDesc 使用情况
     * @param houseDesignFor 设计用途
     * @param houseUseFor 使用用途
     * @param houseStructure 住宅房型
     * @param houseIsRentalHousing 是否出租屋
     * @param houseRemark 备注
     * @param houseOrderNum 排序号
     * @param houseInputUnitName 填报单位
     * @param houseInputUnitId 填报单位
     * @param houseInputDate 登记时间
     * @param houseInputUserName 登记人
     * @param houseInputUserId 登记人ID
     **/
    public HouseInfoEntity(String houseId, String houseBuildId, String houseCode, String houseCodeNum, String houseCodeFull, Short houseFloorNum, String houseUsedDesc, String houseDesignFor, String houseUseFor, String houseStructure, String houseIsRentalHousing, String houseRemark, Integer houseOrderNum, String houseInputUnitName, String houseInputUnitId, Date houseInputDate, String houseInputUserName, String houseInputUserId) {
        this.houseId = houseId;
        this.houseBuildId = houseBuildId;
        this.houseCode = houseCode;
        this.houseCodeNum = houseCodeNum;
        this.houseCodeFull = houseCodeFull;
        this.houseFloorNum = houseFloorNum;
        this.houseUsedDesc = houseUsedDesc;
        this.houseDesignFor = houseDesignFor;
        this.houseUseFor = houseUseFor;
        this.houseStructure = houseStructure;
        this.houseIsRentalHousing = houseIsRentalHousing;
        this.houseRemark = houseRemark;
        this.houseOrderNum = houseOrderNum;
        this.houseInputUnitName = houseInputUnitName;
        this.houseInputUnitId = houseInputUnitId;
        this.houseInputDate = houseInputDate;
        this.houseInputUserName = houseInputUserName;
        this.houseInputUserId = houseInputUserId;
    }

    public HouseInfoEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getHouseId() {
        return houseId;
    }

    /**
     *
     * @param houseId
     **/
    public void setHouseId(String houseId) {
        this.houseId = houseId == null ? null : houseId.trim();
    }

    /**
     * 所在建筑物ID
     * @return java.lang.String
     **/
    public String getHouseBuildId() {
        return houseBuildId;
    }

    /**
     * 所在建筑物ID
     * @param houseBuildId 所在建筑物ID
     **/
    public void setHouseBuildId(String houseBuildId) {
        this.houseBuildId = houseBuildId == null ? null : houseBuildId.trim();
    }

    /**
     * 房屋编码
     * @return java.lang.String
     **/
    public String getHouseCode() {
        return houseCode;
    }

    /**
     * 房屋编码
     * @param houseCode 房屋编码
     **/
    public void setHouseCode(String houseCode) {
        this.houseCode = houseCode == null ? null : houseCode.trim();
    }

    /**
     * 房号
     * @return java.lang.String
     **/
    public String getHouseCodeNum() {
        return houseCodeNum;
    }

    /**
     * 房号
     * @param houseCodeNum 房号
     **/
    public void setHouseCodeNum(String houseCodeNum) {
        this.houseCodeNum = houseCodeNum == null ? null : houseCodeNum.trim();
    }

    /**
     * 完整编码
     * @return java.lang.String
     **/
    public String getHouseCodeFull() {
        return houseCodeFull;
    }

    /**
     * 完整编码
     * @param houseCodeFull 完整编码
     **/
    public void setHouseCodeFull(String houseCodeFull) {
        this.houseCodeFull = houseCodeFull == null ? null : houseCodeFull.trim();
    }

    /**
     * 楼层
     * @return java.lang.Short
     **/
    public Short getHouseFloorNum() {
        return houseFloorNum;
    }

    /**
     * 楼层
     * @param houseFloorNum 楼层
     **/
    public void setHouseFloorNum(Short houseFloorNum) {
        this.houseFloorNum = houseFloorNum;
    }

    /**
     * 使用情况
     * @return java.lang.String
     **/
    public String getHouseUsedDesc() {
        return houseUsedDesc;
    }

    /**
     * 使用情况
     * @param houseUsedDesc 使用情况
     **/
    public void setHouseUsedDesc(String houseUsedDesc) {
        this.houseUsedDesc = houseUsedDesc == null ? null : houseUsedDesc.trim();
    }

    /**
     * 设计用途:商业,办公,住宅,厂房,仓库,其它
     * @return java.lang.String
     **/
    public String getHouseDesignFor() {
        return houseDesignFor;
    }

    /**
     * 设计用途:商业,办公,住宅,厂房,仓库,其它
     * @param houseDesignFor 设计用途
     **/
    public void setHouseDesignFor(String houseDesignFor) {
        this.houseDesignFor = houseDesignFor == null ? null : houseDesignFor.trim();
    }

    /**
     * 使用用途:商业,办公,住宅,厂房,仓库,其它
     * @return java.lang.String
     **/
    public String getHouseUseFor() {
        return houseUseFor;
    }

    /**
     * 使用用途:商业,办公,住宅,厂房,仓库,其它
     * @param houseUseFor 使用用途
     **/
    public void setHouseUseFor(String houseUseFor) {
        this.houseUseFor = houseUseFor == null ? null : houseUseFor.trim();
    }

    /**
     * 住宅房型
     * @return java.lang.String
     **/
    public String getHouseStructure() {
        return houseStructure;
    }

    /**
     * 住宅房型
     * @param houseStructure 住宅房型
     **/
    public void setHouseStructure(String houseStructure) {
        this.houseStructure = houseStructure == null ? null : houseStructure.trim();
    }

    /**
     * 是否出租屋:是,否
     * @return java.lang.String
     **/
    public String getHouseIsRentalHousing() {
        return houseIsRentalHousing;
    }

    /**
     * 是否出租屋:是,否
     * @param houseIsRentalHousing 是否出租屋
     **/
    public void setHouseIsRentalHousing(String houseIsRentalHousing) {
        this.houseIsRentalHousing = houseIsRentalHousing == null ? null : houseIsRentalHousing.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getHouseRemark() {
        return houseRemark;
    }

    /**
     * 备注
     * @param houseRemark 备注
     **/
    public void setHouseRemark(String houseRemark) {
        this.houseRemark = houseRemark == null ? null : houseRemark.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getHouseOrderNum() {
        return houseOrderNum;
    }

    /**
     * 排序号
     * @param houseOrderNum 排序号
     **/
    public void setHouseOrderNum(Integer houseOrderNum) {
        this.houseOrderNum = houseOrderNum;
    }

    /**
     * 填报单位
     * @return java.lang.String
     **/
    public String getHouseInputUnitName() {
        return houseInputUnitName;
    }

    /**
     * 填报单位
     * @param houseInputUnitName 填报单位
     **/
    public void setHouseInputUnitName(String houseInputUnitName) {
        this.houseInputUnitName = houseInputUnitName == null ? null : houseInputUnitName.trim();
    }

    /**
     * 填报单位
     * @return java.lang.String
     **/
    public String getHouseInputUnitId() {
        return houseInputUnitId;
    }

    /**
     * 填报单位
     * @param houseInputUnitId 填报单位
     **/
    public void setHouseInputUnitId(String houseInputUnitId) {
        this.houseInputUnitId = houseInputUnitId == null ? null : houseInputUnitId.trim();
    }

    /**
     * 登记时间
     * @return java.util.Date
     **/
    public Date getHouseInputDate() {
        return houseInputDate;
    }

    /**
     * 登记时间
     * @param houseInputDate 登记时间
     **/
    public void setHouseInputDate(Date houseInputDate) {
        this.houseInputDate = houseInputDate;
    }

    /**
     * 登记人
     * @return java.lang.String
     **/
    public String getHouseInputUserName() {
        return houseInputUserName;
    }

    /**
     * 登记人
     * @param houseInputUserName 登记人
     **/
    public void setHouseInputUserName(String houseInputUserName) {
        this.houseInputUserName = houseInputUserName == null ? null : houseInputUserName.trim();
    }

    /**
     * 登记人ID
     * @return java.lang.String
     **/
    public String getHouseInputUserId() {
        return houseInputUserId;
    }

    /**
     * 登记人ID
     * @param houseInputUserId 登记人ID
     **/
    public void setHouseInputUserId(String houseInputUserId) {
        this.houseInputUserId = houseInputUserId == null ? null : houseInputUserId.trim();
    }
}