package com.jb4dc.gridsystem.service.person.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.person.PersonMapper;
import com.jb4dc.gridsystem.dbentities.person.FamilyEntity;
import com.jb4dc.gridsystem.dbentities.person.PersonEntity;
import com.jb4dc.gridsystem.service.person.IFamilyService;
import com.jb4dc.gridsystem.service.person.IPersonService;
import liquibase.pro.packaged.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonServiceImpl extends BaseServiceImpl<PersonEntity> implements IPersonService
{
    public static String HEAD_HOUSEHOLD_TYPE_VALUE="0";

    @Autowired
    IFamilyService familyService;

    PersonMapper personMapper;
    public PersonServiceImpl(PersonMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        personMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, PersonEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<PersonEntity>() {
            @Override
            public PersonEntity run(JB4DCSession jb4DCSession,PersonEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public List<PersonEntity> getByFamilyId(String familyId) {
        return personMapper.selectByFamilyId(familyId);
    }

    @Override
    public List<PersonEntity> getPersonByHouseId(JB4DCSession session, String houseId) {
        return personMapper.selectByHouseId(houseId);
    }

    @Override
    public void deletePersonWithFamily(JB4DCSession session, String personId) throws JBuild4DCGenerallyException {
        PersonEntity personEntity=getByPrimaryKey(session,personId);
        if(personEntity.getPersonRelationship().equals(HEAD_HOUSEHOLD_TYPE_VALUE)){
            List<PersonEntity> familyPersons=getByFamilyId(personEntity.getPersonFamilyId());
            if(familyPersons.size()>1){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"户中还存在其他成员,不允许删除户主!");
            }
            FamilyEntity familyEntity=familyService.getByPrimaryKey(session,personEntity.getPersonFamilyId());
            deleteByKey(session,personId);
            familyService.deleteByKey(session,familyEntity.getFamilyId());
        }
        else{
            deleteByKey(session,personId);
        }
    }
}