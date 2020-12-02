package com.jb4dc.gridsystem.webpackage.beanconfig.sys;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCBaseException;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.gridsystem.service.proxy.UserLocationProxy;
import com.jb4dc.sso.client.filter.ISSoWebFilterLocationPreCheck;
import org.springframework.stereotype.Service;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

@Service
public class AppClientWebFilterLocationPreCheck implements ISSoWebFilterLocationPreCheck {

    static UserLocationProxy userLocationProxy;
    public AppClientWebFilterLocationPreCheck(UserLocationProxy _userLocationProxy) {
        userLocationProxy=_userLocationProxy;
    }

    @Override
    public JB4DCSession preCheckSession(String absPath, ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException {
        //return null;
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        JB4DCSession jb4DSession= JB4DCSessionUtility.getSessionNotException();
        if(jb4DSession==null){
            String appClientToken=httpRequest.getHeader("AppClientToken");
            if(StringUtility.isEmpty(appClientToken)){
                appClientToken=httpRequest.getParameter("AppClientToken");
            }
            if(StringUtility.isNotEmpty(appClientToken)){
                JB4DCSession jb4DCSession=userLocationProxy.getAppClientSession(appClientToken);
                if(jb4DCSession!=null){
                    return jb4DCSession;
                }
            }
            //String appClientToken=request.
        }
        return null;
    }

    @Override
    public boolean customSelfCheck() {
        return true;
    }
}
