package com.jb4dc.gridsystem.service.person.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.person.FamilyMapper;
import com.jb4dc.gridsystem.dbentities.person.FamilyEntity;
import com.jb4dc.gridsystem.service.person.IFamilyService;
import org.springframework.stereotype.Service;

@Service
public class FamilyServiceImpl extends BaseServiceImpl<FamilyEntity> implements IFamilyService
{
    FamilyMapper familyMapper;
    public FamilyServiceImpl(FamilyMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        familyMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, FamilyEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<FamilyEntity>() {
            @Override
            public FamilyEntity run(JB4DCSession jb4DCSession,FamilyEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}