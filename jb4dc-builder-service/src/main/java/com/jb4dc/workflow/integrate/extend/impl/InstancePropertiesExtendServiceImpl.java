package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dao.InstancePropertiesMapper;
import com.jb4dc.workflow.dbentities.InstancePropertiesEntity;
import com.jb4dc.workflow.integrate.extend.IInstancePropertiesExtendService;
import org.springframework.stereotype.Service;

@Service
public class InstancePropertiesExtendServiceImpl  extends BaseServiceImpl<InstancePropertiesEntity> implements IInstancePropertiesExtendService
{
    InstancePropertiesMapper instancePropertiesMapper;
    public InstancePropertiesExtendServiceImpl(InstancePropertiesMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        instancePropertiesMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, InstancePropertiesEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<InstancePropertiesEntity>() {
            @Override
            public InstancePropertiesEntity run(JB4DCSession jb4DCSession,InstancePropertiesEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}