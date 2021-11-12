package com.jb4dc.builder.webpackage.rest.workflow.model;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.portlet.dbentities.GroupEntity;
import com.jb4dc.workflow.dbentities.ModelGroupEntity;
import com.jb4dc.workflow.integrate.extend.IModelGroupExtendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/WorkFlow/Model/ModelGroup")
public class ModelGroupRest extends GeneralRest<ModelGroupEntity> {

    @Autowired
    IModelGroupExtendService modelGroupExtendService;

    /*@Override
    public String getModuleName() {
        return "流程模型分组";
    }*/

    @Override
    protected IBaseService<ModelGroupEntity> getBaseService() {
        return modelGroupExtendService;
    }

    @RequestMapping(value = "/GetTreeData",method = {RequestMethod.POST,RequestMethod.GET})
    public JBuild4DCResponseVo<List<ModelGroupEntity>> getTreeData() {
        List<ModelGroupEntity> groupEntityList=modelGroupExtendService.getALLASC(JB4DCSessionUtility.getSession());
        return JBuild4DCResponseVo.getDataSuccess(groupEntityList);
    }
}
