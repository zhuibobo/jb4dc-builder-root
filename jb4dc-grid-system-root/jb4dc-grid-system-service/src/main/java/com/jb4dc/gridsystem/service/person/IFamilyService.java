package com.jb4dc.gridsystem.service.person;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dbentities.person.FamilyEntity;
import com.jb4dc.gridsystem.po.FamilyPO;

import java.io.IOException;

public interface IFamilyService extends IBaseService<FamilyEntity> {
    FamilyPO saveFamilyData(JB4DCSession session, FamilyPO familyPO) throws JBuild4DCGenerallyException;

    FamilyPO getFamilyData(JB4DCSession session, String familyId) throws IOException;

}
