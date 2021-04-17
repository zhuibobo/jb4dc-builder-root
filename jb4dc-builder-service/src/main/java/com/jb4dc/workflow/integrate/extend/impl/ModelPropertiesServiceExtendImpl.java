package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dao.ModelPropertiesMapper;
import com.jb4dc.workflow.dbentities.ModelPropertiesEntity;
import com.jb4dc.workflow.integrate.extend.IModelPropertiesExtendService;
import org.springframework.stereotype.Service;

@Service
public class ModelPropertiesServiceExtendImpl extends BaseServiceImpl<ModelPropertiesEntity> implements IModelPropertiesExtendService
{
    ModelPropertiesMapper modelPropertiesMapper;
    public ModelPropertiesServiceExtendImpl(ModelPropertiesMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        modelPropertiesMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ModelPropertiesEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<ModelPropertiesEntity>() {
            @Override
            public ModelPropertiesEntity run(JB4DCSession jb4DCSession,ModelPropertiesEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
