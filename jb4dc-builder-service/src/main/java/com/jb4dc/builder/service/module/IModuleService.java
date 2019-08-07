package com.jb4dc.builder.service.module;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

public interface IModuleService extends IBaseService<ModuleEntity> {
    String getRootId();

    ModuleEntity createRootNode(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException;

    String buildModuleItemCode(int num);
}
