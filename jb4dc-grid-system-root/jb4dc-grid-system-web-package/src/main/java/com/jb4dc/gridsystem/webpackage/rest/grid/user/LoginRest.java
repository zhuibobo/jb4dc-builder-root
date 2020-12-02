package com.jb4dc.gridsystem.webpackage.rest.grid.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.encryption.digitaldigest.MD5Utility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gridsystem.dbentities.terminal.GatherTerminalInfoEntity;
import com.jb4dc.gridsystem.service.proxy.UserLocationProxy;
import com.jb4dc.gridsystem.service.terminal.IGatherTerminalInfoService;
import com.jb4dc.sso.client.proxy.IUserRuntimeProxy;
import com.jb4dc.sso.client.proxy.impl.UserRuntimeProxyImpl;
import com.jb4dc.sso.dbentities.user.UserEntity;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import liquibase.pro.packaged.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@Api(tags = "用户登录")
@RestController
@RequestMapping(value = "/Rest/Grid/User/Login")
public class LoginRest {

    UserLocationProxy userLocationProxy;

    public LoginRest(UserLocationProxy userLocationProxy) {
        this.userLocationProxy = userLocationProxy;
    }

    @ApiOperation(value = "账号密码登录", notes = "登录前必须先将机器的唯一Token添加到系统中,登录成功后,将返回访问接口的Token凭证,该凭证可以访问系统4个小时,调用其它接口时,加入的请求的header中,或者url中,key:AppClientToken")
    @ApiImplicitParams({
            @ApiImplicitParam(name="accountName",value="登录账号",required=true,example = "nbzg5001"),
            @ApiImplicitParam(name="password",value="登录密码",required=true,example = "j4d123456"),
            @ApiImplicitParam(name="terminalToken",value="采集设备唯一标识",required=true,example = "11111111111111111111")
    })
    @RequestMapping(value = "/LoginByPassword", method = RequestMethod.POST)
    public JBuild4DCResponseVo loginByPassword(String accountName, String password, String terminalToken) throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCSession jb4DCSession=userLocationProxy.checkUser(accountName,password,terminalToken);
        return JBuild4DCResponseVo.opSuccess(jb4DCSession);
    }

    @ApiOperation(value = "测试登录后的模拟接口", notes = "将通过Token获取对应的用户信息,未登录前将调用失败!")
    @ApiImplicitParams({
            @ApiImplicitParam(name="recordData",value="登录账号",required=true,example = "没什么用的参数")
    })
    @RequestMapping(value = "/testLoginMockGetData", method = RequestMethod.POST)
    public JBuild4DCResponseVo testLoginMockGetData(String recordData) throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCSession jb4DCSession=JB4DCSessionUtility.getSession();
        jb4DCSession.setAccountName("模拟成功!"+recordData);
        return JBuild4DCResponseVo.opSuccess(jb4DCSession);
    }
}
