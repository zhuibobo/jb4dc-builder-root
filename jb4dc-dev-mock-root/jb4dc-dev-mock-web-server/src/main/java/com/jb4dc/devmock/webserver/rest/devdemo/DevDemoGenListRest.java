package com.jb4dc.devmock.webserver.rest.devdemo;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.devmock.dbentities.DemoGenListEntity;
import com.jb4dc.devmock.service.IDemoGenListService;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/Rest/DevDemo/DevDemoGenList")
public class DevDemoGenListRest extends GeneralRest<DemoGenListEntity> {

    @Autowired
    IDemoGenListService devDemoGenListService;

    /*@Override
    public String getModuleName() {
        return "一般列表";
    }*/

    @Override
    protected IBaseService<DemoGenListEntity> getBaseService() {
        return devDemoGenListService;
    }

}
