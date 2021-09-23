package com.jb4dc.builder.webpackage.rest.builder.envvar;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.envvar.EnvGroupEntity;
import com.jb4dc.builder.service.envvar.IEnvGroupService;
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
 * Date: 2019/8/29
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/EnvVariableGroup")
public class EnvVariableGroupRest extends GeneralRest<EnvGroupEntity> {

    @Autowired
    IEnvGroupService envGroupService;

    /*@Override
    public String getModuleName() {
        return "环境变量";
    }*/

    @Override
    protected IBaseService<EnvGroupEntity> getBaseService() {
        return envGroupService;
    }

    @RequestMapping(value = "/GetTreeData", method = RequestMethod.POST)
    public JBuild4DCResponseVo<List<EnvGroupEntity>> getTreeData() {
        //dictionaryGroupService.moveUp(recordId);
        List<EnvGroupEntity> groupEntityList=envGroupService.getALLASC(JB4DCSessionUtility.getSession());
        return JBuild4DCResponseVo.getDataSuccess(groupEntityList);
    }
}
