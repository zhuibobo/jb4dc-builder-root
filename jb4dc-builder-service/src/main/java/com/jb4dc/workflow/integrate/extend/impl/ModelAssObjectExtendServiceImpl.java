package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dao.ModelAssObjectMapper;
import com.jb4dc.workflow.dbentities.ModelAssObjectEntity;
import com.jb4dc.workflow.integrate.extend.IModelAssObjectExtendService;

public class ModelAssObjectExtendServiceImpl extends BaseServiceImpl<ModelAssObjectEntity> implements IModelAssObjectExtendService
{
    ModelAssObjectMapper modelAssObjectMapper;
    public ModelAssObjectExtendServiceImpl(ModelAssObjectMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        modelAssObjectMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ModelAssObjectEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<ModelAssObjectEntity>() {
            @Override
            public ModelAssObjectEntity run(JB4DCSession jb4DCSession,ModelAssObjectEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}