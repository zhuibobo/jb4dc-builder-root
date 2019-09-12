package com.jb4dc.devmock.webserver.rest.devdemo.treeandlist;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.devmock.dbentities.DemoTlTreeListEntity;
import com.jb4dc.devmock.service.IDemoTLTreeListService;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/Rest/DevDemo/TreeAndList/DevDemoTLList")
public class DevDemoTLTreeListRest extends GeneralRest<DemoTlTreeListEntity> {

    @Autowired
    IDemoTLTreeListService devDemoTLTreeListService;

    @Override
    public String getModuleName() {
        return "树与列表-列表";
    }

    @Override
    protected IBaseService<DemoTlTreeListEntity> getBaseService() {
        return devDemoTLTreeListService;
    }

}
