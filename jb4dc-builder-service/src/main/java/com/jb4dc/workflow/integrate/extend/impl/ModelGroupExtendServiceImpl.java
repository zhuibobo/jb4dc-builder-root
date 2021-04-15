package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dao.ModelGroupMapper;
import com.jb4dc.workflow.dbentities.ModelGroupEntity;
import com.jb4dc.workflow.integrate.extend.IModelGroupExtendService;

public class ModelGroupExtendServiceImpl extends BaseServiceImpl<ModelGroupEntity> implements IModelGroupExtendService
{
    ModelGroupMapper modelGroupMapper;
    public ModelGroupExtendServiceImpl(ModelGroupMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        modelGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ModelGroupEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<ModelGroupEntity>() {
            @Override
            public ModelGroupEntity run(JB4DCSession jb4DCSession,ModelGroupEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}