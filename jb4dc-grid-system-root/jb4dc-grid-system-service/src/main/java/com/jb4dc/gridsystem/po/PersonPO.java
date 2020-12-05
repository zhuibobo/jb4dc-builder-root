package com.jb4dc.gridsystem.po;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.gridsystem.dbentities.person.PersonEntity;

import java.util.Date;

public class PersonPO extends PersonEntity {

    //PERSON_BIRTHDAY:出生日期
    @JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")
    private Date personBirthday;

    private String personHeaderImageBase64;

    public String getPersonHeaderImageBase64() {
        return personHeaderImageBase64;
    }

    public void setPersonHeaderImageBase64(String personHeaderImageBase64) {
        this.personHeaderImageBase64 = personHeaderImageBase64;
    }
}
