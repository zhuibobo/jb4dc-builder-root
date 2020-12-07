package com.jb4dc.gridsystem.service.enterprise.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.gridsystem.dao.enterprise.EnterpriseInfoMapper;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.dbentities.enterprise.EnterpriseInfoEntity;
import com.jb4dc.gridsystem.service.build.IHouseInfoService;
import com.jb4dc.gridsystem.service.enterprise.IEnterpriseInfoService;
import liquibase.pro.packaged.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class EnterpriseInfoServiceImpl extends BaseServiceImpl<EnterpriseInfoEntity> implements IEnterpriseInfoService
{
    EnterpriseInfoMapper enterpriseInfoMapper;

    @Autowired
    IHouseInfoService houseInfoService;

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

                sourceEntity.setEntInputDate(new Date());
                sourceEntity.setEntInputUnitId(jb4DCSession.getOrganId());
                sourceEntity.setEntInputUnitName(jb4DCSession.getOrganName());
                sourceEntity.setEntInputUserId(jb4DCSession.getUserId());
                sourceEntity.setEntInputUserName(jb4DCSession.getUserName());
                sourceEntity.setEntOrderNum(enterpriseInfoMapper.nextOrderNum());
                return sourceEntity;
            }
        });
    }

    @Override
    public List<EnterpriseInfoEntity> getEnterpriseByHouseId(JB4DCSession session, String houseId) {
        return enterpriseInfoMapper.selectByHouseId(houseId);
    }

    @Override
    public EnterpriseInfoEntity saveEnterpriseData(JB4DCSession session, EnterpriseInfoEntity enterpriseInfoEntity) throws JBuild4DCGenerallyException {
        if(StringUtility.isEmpty(enterpriseInfoEntity.getEntHouseId())){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"无法确认房屋ID");
        }

        HouseInfoEntity houseInfoEntity=houseInfoService.getByPrimaryKey(session,enterpriseInfoEntity.getEntHouseId());
        if(houseInfoEntity==null){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"通过房屋ID无法查找到具体的房屋信息!");
        }

        enterpriseInfoEntity.setEntHouseCode(houseInfoEntity.getHouseCodeFull());
        enterpriseInfoEntity.setEntGridId(session.getOrganId());

        this.saveSimple(session,enterpriseInfoEntity.getEntId(),enterpriseInfoEntity);

        return enterpriseInfoEntity;
    }
}