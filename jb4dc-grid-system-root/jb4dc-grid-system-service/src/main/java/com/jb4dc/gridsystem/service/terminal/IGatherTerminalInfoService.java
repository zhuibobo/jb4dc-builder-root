package com.jb4dc.gridsystem.service.terminal;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.gridsystem.dbentities.terminal.GatherTerminalInfoEntity;

public interface IGatherTerminalInfoService extends IBaseService<GatherTerminalInfoEntity> {
    GatherTerminalInfoEntity getByCode(String code);
}