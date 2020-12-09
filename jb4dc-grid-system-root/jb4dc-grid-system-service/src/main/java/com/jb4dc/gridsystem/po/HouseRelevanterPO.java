package com.jb4dc.gridsystem.po;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.gridsystem.dbentities.build.HouseRelevanterEntity;
import java.util.Date;

public class HouseRelevanterPO extends HouseRelevanterEntity {

    public HouseRelevanterPO(HouseRelevanterEntity houseRelevanterEntity, String reterHeaderImageBase64) {
        super(houseRelevanterEntity.getReterId(), houseRelevanterEntity.getReterHouseId(),
                houseRelevanterEntity.getReterType(), houseRelevanterEntity.getReterName(),
                houseRelevanterEntity.getReterPhone(), houseRelevanterEntity.getReterCertCategory(),
                houseRelevanterEntity.getReterCertCode(), houseRelevanterEntity.getReterAddress(),
                houseRelevanterEntity.getReterPercent(), houseRelevanterEntity.getReterRemark(), houseRelevanterEntity.getReterOrderNum(),
                houseRelevanterEntity.getReterPhotoId(), houseRelevanterEntity.getReterIdCardUuid(), houseRelevanterEntity.getReterIdCardPublicForm(), houseRelevanterEntity.getReterIdCardEffDate(),
                houseRelevanterEntity.getReterIdCardAddress(), houseRelevanterEntity.getReterBirthday(), houseRelevanterEntity.getReterNation());
        this.reterHeaderImageBase64 = reterHeaderImageBase64;
    }

    public HouseRelevanterPO() {

    }

    //RETER_BIRTHDAY:出生日期
    @JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")
    private Date reterBirthday;

    private String reterHeaderImageBase64;

    public String getReterHeaderImageBase64() {
        return reterHeaderImageBase64;
    }

    public void setReterHeaderImageBase64(String reterHeaderImageBase64) {
        this.reterHeaderImageBase64 = reterHeaderImageBase64;
    }
}
