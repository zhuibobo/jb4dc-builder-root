package com.jb4dc.gridsystem.service.enterprise.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.enterprise.EnterpriseInfoMapper;
import com.jb4dc.gridsystem.dbentities.enterprise.EnterpriseInfoEntity;
import com.jb4dc.gridsystem.service.enterprise.IEnterpriseInfoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnterpriseInfoServiceImpl extends BaseServiceImpl<EnterpriseInfoEntity> implements IEnterpriseInfoService
{
    EnterpriseInfoMapper enterpriseInfoMapper;
    public EnterpriseInfoServiceImpl(EnterpriseInfoMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        enterpriseInfoMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, EnterpriseInfoEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<EnterpriseInfoEntity>() {
            @Override
            public EnterpriseInfoEntity run(JB4DCSession jb4DCSession,EnterpriseInfoEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public List<EnterpriseInfoEntity> getEnterpriseByHouseId(JB4DCSession session, String houseId) {
        return enterpriseInfoMapper.selectByHouseId(houseId);
    }
}