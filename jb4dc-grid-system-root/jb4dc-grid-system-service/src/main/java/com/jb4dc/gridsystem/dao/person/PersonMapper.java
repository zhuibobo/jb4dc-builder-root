package com.jb4dc.gridsystem.dao.person;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.gridsystem.dbentities.person.PersonEntity;

import java.util.List;

public interface PersonMapper  extends BaseMapper<PersonEntity> {
    List<PersonEntity> selectByFamilyId(String familyId);

    List<PersonEntity> selectByHouseId(String houseId);
}
