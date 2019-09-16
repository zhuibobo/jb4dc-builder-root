package com.jb4dc.builder.webpackage.rest.builder.api;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.service.api.IApiItemService;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/16
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/ApiItem")
public class APIItemRest  extends GeneralRest<ApiItemEntity> {
    @Autowired
    IApiItemService apiItemService;

    @Override
    public String getModuleName() {
        return "API";
    }

    @Override
    protected IBaseService<ApiItemEntity> getBaseService() {
        return apiItemService;
    }
}
