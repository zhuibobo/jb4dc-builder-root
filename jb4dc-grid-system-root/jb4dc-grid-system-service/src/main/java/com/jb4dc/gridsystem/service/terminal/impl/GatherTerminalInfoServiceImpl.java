package com.jb4dc.gridsystem.service.terminal.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.terminal.GatherTerminalInfoMapper;
import com.jb4dc.gridsystem.dbentities.terminal.GatherTerminalInfoEntity;
import com.jb4dc.gridsystem.service.terminal.IGatherTerminalInfoService;
import com.jb4dc.sso.client.proxy.IOrganRuntimeProxy;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import com.jb4dc.sso.dbentities.user.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class GatherTerminalInfoServiceImpl extends BaseServiceImpl<GatherTerminalInfoEntity> implements IGatherTerminalInfoService
{
    GatherTerminalInfoMapper gatherTerminalInfoMapper;

    @Autowired
    IOrganRuntimeProxy organRuntimeProxy;

    public GatherTerminalInfoServiceImpl(GatherTerminalInfoMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        gatherTerminalInfoMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, GatherTerminalInfoEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<GatherTerminalInfoEntity>() {
            @Override
            public GatherTerminalInfoEntity run(JB4DCSession jb4DCSession, GatherTerminalInfoEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public GatherTerminalInfoEntity getByCode(String code) {
        return gatherTerminalInfoMapper.selectByCode(code);
    }

    @Override
    public void newTerminalToken(UserEntity userEntity, String terminalToken) throws JBuild4DCGenerallyException {
        OrganEntity organEntity=organRuntimeProxy.getOrganById(userEntity.getUserOrganId()).getData();

        GatherTerminalInfoEntity gatherTerminalInfoEntity=new GatherTerminalInfoEntity();
        gatherTerminalInfoEntity.setTerminalId(terminalToken);
        gatherTerminalInfoEntity.setTerminalUserName(userEntity.getUserName());
        gatherTerminalInfoEntity.setTerminalUserId(userEntity.getUserId());
        gatherTerminalInfoEntity.setTerminalStatus("未授权");
        gatherTerminalInfoEntity.setTerminalCode(terminalToken);
        gatherTerminalInfoEntity.setTerminalDesc("新设备申请");
        gatherTerminalInfoEntity.setTerminalRemark("");
        gatherTerminalInfoEntity.setTerminalManageUnitName(organEntity.getOrganName());
        gatherTerminalInfoEntity.setTerminalManageUnitId(userEntity.getUserOrganId());
        gatherTerminalInfoEntity.setTerminalManageDate(new Date());
        gatherTerminalInfoEntity.setTerminalManageUserName(userEntity.getUserName());
        gatherTerminalInfoEntity.setTerminalManageUserId(userEntity.getUserId());
        gatherTerminalInfoEntity.setTerminalOrderNum(gatherTerminalInfoMapper.nextOrderNum()+5);

        this.saveSimple(null,gatherTerminalInfoEntity.getTerminalId(),gatherTerminalInfoEntity);
    }

    @Override
    public void updateTerminalCode(String sourceCode, String newCode) {
        gatherTerminalInfoMapper.updateTerminalCode(sourceCode,newCode);
    }
}