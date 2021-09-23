package com.jb4dc.builder.webpackage.rest.builder.site;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.datastorage.TableGroupEntity;
import com.jb4dc.builder.dbentities.site.SiteFolderEntity;
import com.jb4dc.builder.service.site.ISiteFolderService;
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
 * Date: 2020/6/6
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/SiteFolder")
public class SiteFolderRest   extends GeneralRest<SiteFolderEntity> {
    @Autowired
    private ISiteFolderService siteFolderService;

    /*@Override
    public String getModuleName() {
        return "站点文件夹";
    }*/

    @Override
    protected IBaseService<SiteFolderEntity> getBaseService() {
        return siteFolderService;
    }

    @RequestMapping(value = "/GetTreeData", method = RequestMethod.POST)
    public JBuild4DCResponseVo getTreeData(String siteId) {
        List<SiteFolderEntity> siteFolderEntityList=siteFolderService.getBySiteId(JB4DCSessionUtility.getSession(),siteId);
        return JBuild4DCResponseVo.getDataSuccess(siteFolderEntityList);
    }
}
