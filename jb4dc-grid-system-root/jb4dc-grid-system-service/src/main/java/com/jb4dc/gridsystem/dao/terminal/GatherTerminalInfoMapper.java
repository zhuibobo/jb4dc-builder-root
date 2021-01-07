package com.jb4dc.gridsystem.dao.terminal;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.gridsystem.dbentities.person.FamilyEntity;
import com.jb4dc.gridsystem.dbentities.terminal.GatherTerminalInfoEntity;
import org.apache.ibatis.annotations.Param;

public interface GatherTerminalInfoMapper extends BaseMapper<GatherTerminalInfoEntity> {
    GatherTerminalInfoEntity selectByCode(String code);

    void updateTerminalCode(@Param("sourceCode") String sourceCode,@Param("newCode") String newCode);
}
