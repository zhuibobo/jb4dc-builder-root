package com.jb4dc.gridsystem.po;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.gridsystem.dbentities.enterprise.EnterpriseInfoEntity;

import java.util.Date;

public class EnterpriseInfoPO extends EnterpriseInfoEntity {
    //ENT_SET_UP_DATE:成立日期
    @JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")
    private Date entSetUpDate;

    //ENT_CHECK_DATE:核准日期
    @JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")
    private Date entCheckDate;
}
