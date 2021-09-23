package com.jb4dc.devmock.webserver.rest.devdemo;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.devmock.dbentities.DemoGenListEntity;
import com.jb4dc.devmock.service.IDemoGenListService;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/Rest/DevDemo/DevDemoGenListBindDictionary")
public class DevDemoGenListBindDictionaryRest extends GeneralRest<DemoGenListEntity> {

    @Autowired
    IDemoGenListService devDemoGenListService;

    /*@Override
    public String getModuleName() {
        return "绑定数据字典列表";
    }*/

    @Override
    protected IBaseService<DemoGenListEntity> getBaseService() {
        return devDemoGenListService;
    }

    @Override
    public List<String> bindDictionaryToPage() {
        List<String> groupValueList=new ArrayList<>();
        groupValueList.add("DevDemoDictionaryGroupBindSelect");
        groupValueList.add("DevDemoDictionaryGroupBindRadio");
        groupValueList.add("DevDemoDictionaryGroupBindCheckbox");
        return groupValueList;
    }
}
