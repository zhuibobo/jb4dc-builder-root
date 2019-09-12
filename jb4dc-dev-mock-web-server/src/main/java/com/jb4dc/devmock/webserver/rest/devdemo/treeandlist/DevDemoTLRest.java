package com.jb4dc.devmock.webserver.rest.devdemo.treeandlist;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.devmock.dbentities.DemoTlTreeEntity;
import com.jb4dc.devmock.service.IDemoTLTreeService;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/DevDemo/TreeAndList/DevDemoTLTree")
public class DevDemoTLRest extends GeneralRest<DemoTlTreeEntity> {

    @Autowired
    IDemoTLTreeService devDemoTLTreeService;

    @Override
    public String getModuleName() {
        return "树与列表-树";
    }

    @Override
    protected IBaseService<DemoTlTreeEntity> getBaseService() {
        return devDemoTLTreeService;
    }

    @RequestMapping(value = "/GetTreeData", method = RequestMethod.POST)
    public JBuild4DCResponseVo getTreeData() {
        List<DemoTlTreeEntity> dictionaryGroupEntityList=devDemoTLTreeService.getALL(JB4DCSessionUtility.getSession());
        return JBuild4DCResponseVo.getDataSuccess(dictionaryGroupEntityList);
    }
}
