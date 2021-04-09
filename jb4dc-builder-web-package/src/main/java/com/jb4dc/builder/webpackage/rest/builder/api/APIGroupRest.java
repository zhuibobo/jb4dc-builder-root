package com.jb4dc.builder.webpackage.rest.builder.api;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.api.ApiGroupEntity;
import com.jb4dc.builder.dbentities.envvar.EnvGroupEntity;
import com.jb4dc.builder.service.api.IApiGroupService;
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
 * Date: 2019/9/16
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/APIGroup")
public class APIGroupRest extends GeneralRest<ApiGroupEntity> {

    @Autowired
    IApiGroupService apiGroupService;

    @Override
    public String getModuleName() {
        return "API分组";
    }

    @Override
    protected IBaseService<ApiGroupEntity> getBaseService() {
        return apiGroupService;
    }

    @RequestMapping(value = "/GetTreeData", method = RequestMethod.POST)
    public JBuild4DCResponseVo<List<ApiGroupEntity>> getTreeData(String groupType) {
        //dictionaryGroupService.moveUp(recordId);
        //List<ApiGroupEntity> groupEntityList=apiGroupService.getALLASC(JB4DCSessionUtility.getSession());
        List<ApiGroupEntity> groupEntityList=apiGroupService.getByGroupTypeASC(groupType,JB4DCSessionUtility.getSession());
        return JBuild4DCResponseVo.getDataSuccess(groupEntityList);
    }
}
