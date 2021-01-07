package com.jb4dc.gridsystem.service.terminal;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.gridsystem.dbentities.terminal.GatherTerminalInfoEntity;
import com.jb4dc.sso.dbentities.user.UserEntity;

public interface IGatherTerminalInfoService extends IBaseService<GatherTerminalInfoEntity> {
    GatherTerminalInfoEntity getByCode(String code);

    void newTerminalToken(UserEntity userEntity, String terminalToken) throws JBuild4DCGenerallyException;

    void updateTerminalCode(String sourceCode, String newCode);
}