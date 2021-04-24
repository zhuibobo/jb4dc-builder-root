package com.jb4dc.builder.webpackage.rest.workflow.model;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.workflow.dbentities.ModelGroupEntity;
import com.jb4dc.workflow.integrate.extend.IModelGroupExtendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/Rest/WorkFlow/Model/ModelGroup")
public class ModeGroupRest extends GeneralRest<ModelGroupEntity> {

    @Autowired
    IModelGroupExtendService modelGroupExtendService;

    @Override
    public String getModuleName() {
        return "流程模型分组";
    }

    @Override
    protected IBaseService<ModelGroupEntity> getBaseService() {
        return modelGroupExtendService;
    }
}
