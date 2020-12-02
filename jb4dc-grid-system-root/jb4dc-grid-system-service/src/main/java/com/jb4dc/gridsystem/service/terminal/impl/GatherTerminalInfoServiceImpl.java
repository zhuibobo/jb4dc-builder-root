package com.jb4dc.gridsystem.service.terminal.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.terminal.GatherTerminalInfoMapper;
import com.jb4dc.gridsystem.dbentities.terminal.GatherTerminalInfoEntity;
import com.jb4dc.gridsystem.service.terminal.IGatherTerminalInfoService;
import org.springframework.stereotype.Service;

@Service
public class GatherTerminalInfoServiceImpl extends BaseServiceImpl<GatherTerminalInfoEntity> implements IGatherTerminalInfoService
{
    GatherTerminalInfoMapper gatherTerminalInfoMapper;
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
}