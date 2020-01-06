package com.jb4dc.builder.webpackage.rest.builder.flow;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.flow.FlowIntegratedEntity;
import com.jb4dc.builder.service.flow.IFlowIntegratedService;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/1/6
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/FlowIntegrated")
public class flowIntegratedRest extends GeneralRest<FlowIntegratedEntity> {

    @Autowired
    IFlowIntegratedService flowIntegratedService;

    @Override
    protected IBaseService<FlowIntegratedEntity> getBaseService() {
        return flowIntegratedService;
    }

    @Override
    public String getModuleName() {
        return "模块设计-流程设计";
    }

}
