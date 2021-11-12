package com.jb4dc.builder.webpackage.rest.portlet;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.api.ApiGroupEntity;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryGroupEntity;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.portlet.dbentities.GroupEntity;
import com.jb4dc.portlet.service.IGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Portlet/Group")
public class GroupRest extends GeneralRest<GroupEntity> {
    @Autowired
    IGroupService groupService;

    @Override
    protected IBaseService<GroupEntity> getBaseService() {
        return groupService;
    }

    @RequestMapping(value = "/GetTreeData", method = {RequestMethod.POST,RequestMethod.GET})
    public JBuild4DCResponseVo<List<GroupEntity>> getTreeData(String groupType) {
        List<GroupEntity> groupEntityList=groupService.getByGroupTypeASC( JB4DCSessionUtility.getSession(),groupType);
        return JBuild4DCResponseVo.getDataSuccess(groupEntityList);
    }
}
