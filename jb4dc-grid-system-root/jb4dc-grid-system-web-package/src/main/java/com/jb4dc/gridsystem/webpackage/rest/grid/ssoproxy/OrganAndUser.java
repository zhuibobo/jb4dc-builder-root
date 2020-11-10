package com.jb4dc.gridsystem.webpackage.rest.grid.ssoproxy;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.proxy.IOrganRuntimeProxy;
import com.jb4dc.sso.client.proxy.IUserRuntimeProxy;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import com.jb4dc.sso.dbentities.user.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/10
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Grid/SSOProxy/OrganAndUser")
public class OrganAndUser {
    @Autowired
    IOrganRuntimeProxy organRuntimeProxy;

    @Autowired
    IUserRuntimeProxy userRuntimeProxy;

    @RequestMapping(value = "/GetOrganAndUserData", method = RequestMethod.POST)
    public JBuild4DCResponseVo getOrganAndUserData() throws JBuild4DCGenerallyException {
        JBuild4DCResponseVo<List<OrganEntity>> jBuild4DCResponseVoOrganEntity=organRuntimeProxy.getEnableOrganMinPropRT();
        JBuild4DCResponseVo<List<UserEntity>> jBuild4DCResponseVoUserEntity=userRuntimeProxy.getEnableUserMinPropRT();
        Map<String,Object> organAndUserMap=new HashMap<>();
        organAndUserMap.put("ALLOrganMinProp",jBuild4DCResponseVoOrganEntity.getData());
        organAndUserMap.put("ALLUserMinProp",jBuild4DCResponseVoUserEntity.getData());

        return JBuild4DCResponseVo.getDataSuccess(organAndUserMap);
    }
}
