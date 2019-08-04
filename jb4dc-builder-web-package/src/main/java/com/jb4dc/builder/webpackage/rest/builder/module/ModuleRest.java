package com.jb4dc.builder.webpackage.rest.builder.module;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Builder/Module")
public class ModuleRest extends GeneralRest<ModuleEntity> {
    @Autowired
    IModuleService moduleService;

    @Override
    protected IBaseService<ModuleEntity> getBaseService() {
        return moduleService;
    }

    @Override
    public String getModuleName() {
        return "模块设计";
    }

    @RequestMapping(value = "/GetTreeData", method = RequestMethod.POST)
    public JBuild4DCResponseVo getTreeData() {
        List<ModuleEntity> moduleEntityList=moduleService.getALL(JB4DCSessionUtility.getSession());
        return JBuild4DCResponseVo.getDataSuccess(moduleEntityList);
    }
}
