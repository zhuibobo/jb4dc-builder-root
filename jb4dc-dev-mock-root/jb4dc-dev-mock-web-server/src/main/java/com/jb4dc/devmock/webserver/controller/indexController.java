package com.jb4dc.devmock.webserver.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.remote.SessionRuntimeRemote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/24
 * To change this template use File | Settings | File Templates.
 */
@RestController
public class indexController {

    @Autowired
    SessionRuntimeRemote sessionRemote;

    @RequestMapping("/hello")
    public String index(String name, HttpServletRequest request) throws JsonProcessingException {
        //FeignRequestInterceptor.SessionToken="hellow 123";
        request.getSession().getId();
        JBuild4DCResponseVo zhuibobo = sessionRemote.loginForRest("xxxxxxxx","zhuibobo", "1");
        return JsonUtility.toObjectString(zhuibobo);
    }
}
