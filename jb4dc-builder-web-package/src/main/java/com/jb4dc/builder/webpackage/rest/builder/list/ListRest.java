package com.jb4dc.builder.webpackage.rest.builder.list;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntityWithBLOBs;
import com.jb4dc.builder.client.service.weblist.IListResourceService;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/Rest/Builder/List")
public class ListRest extends GeneralRest<ListResourceEntityWithBLOBs> {

    @Autowired
    IListResourceService listResourceService;

    @Override
    protected IBaseService<ListResourceEntityWithBLOBs> getBaseService() {
        return listResourceService;
    }

    @Override
    public String getModuleName() {
        return "模块设计-列表设计";
    }
}
