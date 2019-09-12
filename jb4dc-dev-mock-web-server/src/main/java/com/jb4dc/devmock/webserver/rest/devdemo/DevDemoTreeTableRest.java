package com.jb4dc.devmock.webserver.rest.devdemo;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.devmock.dbentities.DemoTreeTableEntity;
import com.jb4dc.devmock.service.IDemoTreeTableService;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/Rest/DevDemo/DevDemoTreeTable")
public class DevDemoTreeTableRest extends GeneralRest<DemoTreeTableEntity> {

    @Autowired
    IDemoTreeTableService devDemoTreeTableService;

    @Override
    public String getModuleName() {
        return "树形列表";
    }

    @Override
    protected IBaseService<DemoTreeTableEntity> getBaseService() {
        return devDemoTreeTableService;
    }

}
