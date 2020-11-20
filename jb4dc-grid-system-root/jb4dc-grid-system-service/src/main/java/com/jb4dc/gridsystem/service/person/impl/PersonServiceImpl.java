package com.jb4dc.gridsystem.service.person.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.person.PersonMapper;
import com.jb4dc.gridsystem.dbentities.person.PersonEntity;
import com.jb4dc.gridsystem.service.person.IPersonService;
import org.springframework.stereotype.Service;

@Service
public class PersonServiceImpl extends BaseServiceImpl<PersonEntity> implements IPersonService
{
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
}