package com.jb4dc.builder.webpackage.rest.builder.datastorage.dblink;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.datastorage.DbLinkEntity;
import com.jb4dc.builder.service.datastorage.IDbLinkService;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Builder/DataStorage/DBLink")
public class DBLinkRest extends GeneralRest<DbLinkEntity> {

    @Autowired
    private IDbLinkService dbLinkService;

    @Override
    public String getModuleName() {
        return "数据库连接";
    }

    @Override
    protected IBaseService<DbLinkEntity> getBaseService() {
        return dbLinkService;
    }

    @RequestMapping(value = "/GetFullDBLink", method = RequestMethod.POST)
    public JBuild4DCResponseVo getFullDBLink() {
        List<DbLinkEntity> dbLinkEntityList=dbLinkService.getALL(JB4DCSessionUtility.getSession());
        return JBuild4DCResponseVo.success(JBuild4DCResponseVo.GETDATASUCCESSMSG,dbLinkEntityList);
    }
}
