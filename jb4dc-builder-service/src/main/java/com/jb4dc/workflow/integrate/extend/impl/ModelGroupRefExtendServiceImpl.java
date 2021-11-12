package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dao.ModelGroupRefMapper;
import com.jb4dc.workflow.dbentities.ModelGroupRefEntity;
import com.jb4dc.workflow.integrate.extend.IModelGroupRefExtendService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ModelGroupRefExtendServiceImpl extends BaseServiceImpl<ModelGroupRefEntity> implements IModelGroupRefExtendService
{
    ModelGroupRefMapper modelGroupRefMapper;
    public ModelGroupRefExtendServiceImpl(ModelGroupRefMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        modelGroupRefMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ModelGroupRefEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<ModelGroupRefEntity>() {
            @Override
            public ModelGroupRefEntity run(JB4DCSession jb4DCSession,ModelGroupRefEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public void deleteRefByModelKey(JB4DCSession jb4DSession, String key) {
        modelGroupRefMapper.deleteRefByModelKey(key);
    }

    @Override
    public List<ModelGroupRefEntity> getByModelKeyList(List<String> modelIdList) {
        if(modelIdList!=null&&modelIdList.size()>0) {
            return modelGroupRefMapper.selectByModelKeyList(modelIdList);
        }
        return new ArrayList<>();
    }
}