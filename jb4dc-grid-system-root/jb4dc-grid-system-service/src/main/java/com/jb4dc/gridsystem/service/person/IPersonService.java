package com.jb4dc.gridsystem.service.person;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dbentities.person.PersonEntity;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

public interface IPersonService extends IBaseService<PersonEntity> {
    List<PersonEntity> getByFamilyId(String familyId);

    List<PersonEntity> getPersonByHouseId(JB4DCSession session, String houseId);

    void deletePersonWithFamily(JB4DCSession session, String personId) throws JBuild4DCGenerallyException;

    String getPersonHeaderBase64String(JB4DCSession session, String personId) throws JBuild4DCGenerallyException, IOException, URISyntaxException;
}
