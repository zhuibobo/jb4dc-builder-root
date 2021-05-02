package com.jb4dc.gridsystem.webpackage.beanconfig.sys;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.exception.JBuild4DCBaseException;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.gridsystem.service.proxy.UserLocationProxy;
import com.jb4dc.gridsystem.webpackage.rest.grid.build.BuildInfoRest;
import com.jb4dc.sso.client.filter.ISSoWebFilterLocationPreCheck;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

@Service
public class AppClientWebFilterLocationPreCheck implements ISSoWebFilterLocationPreCheck {

    Logger logger= LoggerFactory.getLogger(AppClientWebFilterLocationPreCheck.class);

    static UserLocationProxy userLocationProxy;
    public AppClientWebFilterLocationPreCheck(UserLocationProxy _userLocationProxy) {
        userLocationProxy=_userLocationProxy;
    }

    @Override
    public JB4DCSession preCheckSession(String absPath, ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException {
        //return null;
        HttpServletRequest httpRequest = (HttpServletRequest) request;


        String appClientToken=httpRequest.getHeader("AppClientToken");
        if(StringUtility.isEmpty(appClientToken)){
            appClientToken=httpRequest.getParameter("AppClientToken");
        }
        if(StringUtility.isNotEmpty(appClientToken)){
            //JB4DCSession jb4DCSession=userLocationProxy.getAppClientSessionAndSaveToLocationServlet(appClientToken);
            JB4DCSession jb4DCSession=null;
            if(jb4DCSession!=null){
                try {
                    logger.info("--通过AppClientToken重新构建Session--"+JsonUtility.toObjectString(jb4DCSession));
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
                return jb4DCSession;
            }
        }

        return null;
    }

    @Override
    public boolean customSelfCheck() {
        return true;
    }
}
