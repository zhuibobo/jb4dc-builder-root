package com.jb4dc.gridsystem.dbentities.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tgrid_event_relevanter
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class EventRelevanterEntity {
    //EVT_REL_ID:
    @DBKeyField
    private String evtRelId;

    //EVT_REL_EVENT_ID:关联事件ID
    private String evtRelEventId;

    //EVT_REL_TYPE:关联人类型:主要诉求人,共同诉求人,被反映对象[个人,单位]
    private String evtRelType;

    //EVT_REL_NAME:姓名/单位名称
    private String evtRelName;

    //EVT_REL_SEX:性别
    private String evtRelSex;

    //EVT_REL_BIRTHDAY:出生日期
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date evtRelBirthday;

    //EVT_REL_ID_CARD:身份证号
    private String evtRelIdCard;

    //EVT_REL_PHONE:联系电话
    private String evtRelPhone;

    //EVT_REL_ADDRESS:单位或地址
    private String evtRelAddress;

    //EVT_REL_BUSINESS_NATURE:经营性质
    private String evtRelBusinessNature;

    //EVT_REL_CREATED_DATE:成立时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date evtRelCreatedDate;

    //EVT_REL_ORGAN_CODE:组织机构代码
    private String evtRelOrganCode;

    //EVT_REL_BUSINESS_NUMBER:营业执照号
    private String evtRelBusinessNumber;

    //EVT_REL_REMARK:备注
    private String evtRelRemark;

    //EVT_REL_ORDER_NUM:排序号
    private Integer evtRelOrderNum;

    /**
     * 构造函数
     * @param evtRelId
     * @param evtRelEventId 关联事件ID
     * @param evtRelType 关联人类型
     * @param evtRelName 姓名/单位名称
     * @param evtRelSex 性别
     * @param evtRelBirthday 出生日期
     * @param evtRelIdCard 身份证号
     * @param evtRelPhone 联系电话
     * @param evtRelAddress 单位或地址
     * @param evtRelBusinessNature 经营性质
     * @param evtRelCreatedDate 成立时间
     * @param evtRelOrganCode 组织机构代码
     * @param evtRelBusinessNumber 营业执照号
     * @param evtRelRemark 备注
     * @param evtRelOrderNum 排序号
     **/
    public EventRelevanterEntity(String evtRelId, String evtRelEventId, String evtRelType, String evtRelName, String evtRelSex, Date evtRelBirthday, String evtRelIdCard, String evtRelPhone, String evtRelAddress, String evtRelBusinessNature, Date evtRelCreatedDate, String evtRelOrganCode, String evtRelBusinessNumber, String evtRelRemark, Integer evtRelOrderNum) {
        this.evtRelId = evtRelId;
        this.evtRelEventId = evtRelEventId;
        this.evtRelType = evtRelType;
        this.evtRelName = evtRelName;
        this.evtRelSex = evtRelSex;
        this.evtRelBirthday = evtRelBirthday;
        this.evtRelIdCard = evtRelIdCard;
        this.evtRelPhone = evtRelPhone;
        this.evtRelAddress = evtRelAddress;
        this.evtRelBusinessNature = evtRelBusinessNature;
        this.evtRelCreatedDate = evtRelCreatedDate;
        this.evtRelOrganCode = evtRelOrganCode;
        this.evtRelBusinessNumber = evtRelBusinessNumber;
        this.evtRelRemark = evtRelRemark;
        this.evtRelOrderNum = evtRelOrderNum;
    }

    public EventRelevanterEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getEvtRelId() {
        return evtRelId;
    }

    /**
     *
     * @param evtRelId
     **/
    public void setEvtRelId(String evtRelId) {
        this.evtRelId = evtRelId == null ? null : evtRelId.trim();
    }

    /**
     * 关联事件ID
     * @return java.lang.String
     **/
    public String getEvtRelEventId() {
        return evtRelEventId;
    }

    /**
     * 关联事件ID
     * @param evtRelEventId 关联事件ID
     **/
    public void setEvtRelEventId(String evtRelEventId) {
        this.evtRelEventId = evtRelEventId == null ? null : evtRelEventId.trim();
    }

    /**
     * 关联人类型:主要诉求人,共同诉求人,被反映对象[个人,单位]
     * @return java.lang.String
     **/
    public String getEvtRelType() {
        return evtRelType;
    }

    /**
     * 关联人类型:主要诉求人,共同诉求人,被反映对象[个人,单位]
     * @param evtRelType 关联人类型
     **/
    public void setEvtRelType(String evtRelType) {
        this.evtRelType = evtRelType == null ? null : evtRelType.trim();
    }

    /**
     * 姓名/单位名称
     * @return java.lang.String
     **/
    public String getEvtRelName() {
        return evtRelName;
    }

    /**
     * 姓名/单位名称
     * @param evtRelName 姓名/单位名称
     **/
    public void setEvtRelName(String evtRelName) {
        this.evtRelName = evtRelName == null ? null : evtRelName.trim();
    }

    /**
     * 性别
     * @return java.lang.String
     **/
    public String getEvtRelSex() {
        return evtRelSex;
    }

    /**
     * 性别
     * @param evtRelSex 性别
     **/
    public void setEvtRelSex(String evtRelSex) {
        this.evtRelSex = evtRelSex == null ? null : evtRelSex.trim();
    }

    /**
     * 出生日期
     * @return java.util.Date
     **/
    public Date getEvtRelBirthday() {
        return evtRelBirthday;
    }

    /**
     * 出生日期
     * @param evtRelBirthday 出生日期
     **/
    public void setEvtRelBirthday(Date evtRelBirthday) {
        this.evtRelBirthday = evtRelBirthday;
    }

    /**
     * 身份证号
     * @return java.lang.String
     **/
    public String getEvtRelIdCard() {
        return evtRelIdCard;
    }

    /**
     * 身份证号
     * @param evtRelIdCard 身份证号
     **/
    public void setEvtRelIdCard(String evtRelIdCard) {
        this.evtRelIdCard = evtRelIdCard == null ? null : evtRelIdCard.trim();
    }

    /**
     * 联系电话
     * @return java.lang.String
     **/
    public String getEvtRelPhone() {
        return evtRelPhone;
    }

    /**
     * 联系电话
     * @param evtRelPhone 联系电话
     **/
    public void setEvtRelPhone(String evtRelPhone) {
        this.evtRelPhone = evtRelPhone == null ? null : evtRelPhone.trim();
    }

    /**
     * 单位或地址
     * @return java.lang.String
     **/
    public String getEvtRelAddress() {
        return evtRelAddress;
    }

    /**
     * 单位或地址
     * @param evtRelAddress 单位或地址
     **/
    public void setEvtRelAddress(String evtRelAddress) {
        this.evtRelAddress = evtRelAddress == null ? null : evtRelAddress.trim();
    }

    /**
     * 经营性质
     * @return java.lang.String
     **/
    public String getEvtRelBusinessNature() {
        return evtRelBusinessNature;
    }

    /**
     * 经营性质
     * @param evtRelBusinessNature 经营性质
     **/
    public void setEvtRelBusinessNature(String evtRelBusinessNature) {
        this.evtRelBusinessNature = evtRelBusinessNature == null ? null : evtRelBusinessNature.trim();
    }

    /**
     * 成立时间
     * @return java.util.Date
     **/
    public Date getEvtRelCreatedDate() {
        return evtRelCreatedDate;
    }

    /**
     * 成立时间
     * @param evtRelCreatedDate 成立时间
     **/
    public void setEvtRelCreatedDate(Date evtRelCreatedDate) {
        this.evtRelCreatedDate = evtRelCreatedDate;
    }

    /**
     * 组织机构代码
     * @return java.lang.String
     **/
    public String getEvtRelOrganCode() {
        return evtRelOrganCode;
    }

    /**
     * 组织机构代码
     * @param evtRelOrganCode 组织机构代码
     **/
    public void setEvtRelOrganCode(String evtRelOrganCode) {
        this.evtRelOrganCode = evtRelOrganCode == null ? null : evtRelOrganCode.trim();
    }

    /**
     * 营业执照号
     * @return java.lang.String
     **/
    public String getEvtRelBusinessNumber() {
        return evtRelBusinessNumber;
    }

    /**
     * 营业执照号
     * @param evtRelBusinessNumber 营业执照号
     **/
    public void setEvtRelBusinessNumber(String evtRelBusinessNumber) {
        this.evtRelBusinessNumber = evtRelBusinessNumber == null ? null : evtRelBusinessNumber.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getEvtRelRemark() {
        return evtRelRemark;
    }

    /**
     * 备注
     * @param evtRelRemark 备注
     **/
    public void setEvtRelRemark(String evtRelRemark) {
        this.evtRelRemark = evtRelRemark == null ? null : evtRelRemark.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getEvtRelOrderNum() {
        return evtRelOrderNum;
    }

    /**
     * 排序号
     * @param evtRelOrderNum 排序号
     **/
    public void setEvtRelOrderNum(Integer evtRelOrderNum) {
        this.evtRelOrderNum = evtRelOrderNum;
    }
}