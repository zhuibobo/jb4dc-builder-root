package com.jb4dc.builder.service.module;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import com.jb4dc.builder.po.ModuleContextPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IModuleService extends IBaseService<ModuleEntity> {
    //String getRootId();

    ModuleEntity createRootNode(JB4DCSession jb4DCSession, String id, String dbLinkName, String dbLinkValue) throws JBuild4DCGenerallyException;

    String buildModuleItemCode(int num);

    ModuleContextPO getModuleContextPO(JB4DCSession jb4DCSession, String moduleId) throws JBuild4DCGenerallyException, IOException;

    List<ModuleEntity> getByDBLinkId(JB4DCSession session, String dbLinkId);

    List<Map<String, Object>> getModuleItems(JB4DCSession session, String selectModuleId, String selectModuleObjectType) throws JBuild4DCGenerallyException;
}
