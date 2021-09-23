package com.jb4dc.builder.webpackage.rest.builder.site;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.site.SiteInfoEntity;
import com.jb4dc.builder.service.site.ISiteInfoService;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/6/5
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/SiteInfo")
public class SiteInfoRest  extends GeneralRest<SiteInfoEntity> {
    @Autowired
    private ISiteInfoService siteInfoService;

    /*@Override
    public String getModuleName() {
        return "站点基础信息";
    }*/

    @Override
    protected IBaseService<SiteInfoEntity> getBaseService() {
        return siteInfoService;
    }

    @RequestMapping(value = "/GetFullSite", method = {RequestMethod.POST,RequestMethod.GET})
    public JBuild4DCResponseVo getFullSite() {
        List<SiteInfoEntity> dbLinkEntityList=siteInfoService.getALL(JB4DCSessionUtility.getSession());
        return JBuild4DCResponseVo.success(JBuild4DCResponseVo.GETDATASUCCESSMSG,dbLinkEntityList);
    }
}
