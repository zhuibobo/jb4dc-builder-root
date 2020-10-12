package com.jb4dc.builder.client.rest;

import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.remote.OrganRuntimeRemote;
import com.jb4dc.sso.client.remote.UserRuntimeRemote;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import com.jb4dc.sso.dbentities.user.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/10/9
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/UserRuntime")
public class UserRuntimeRest {
    @Autowired
    UserRuntimeRemote userRuntimeRemote;

    @RequestMapping(value = "/GetUserByOrganId", method = RequestMethod.POST)
    JBuild4DCResponseVo<List<UserEntity>> getUserByOrganId(String organId){
        return userRuntimeRemote.getUserByOrganIdRT(organId);
    }
}
