package com.jb4dc.devmock.webserver.beanconfig.sys;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.sso.client.conf.Conf;
import com.jb4dc.sso.client.extend.ICheckSessionSuccess;
import com.jb4dc.sso.client.filter.SsoWebFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.servlet.FilterChain;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/16
 * To change this template use File | Settings | File Templates.
 */

@Configuration
public class SsoFilter {

    @Value("${jb4dc.sso.server.address}")
    private String JB4DC_SSO_SERVER_ADDRESS;

    @Value("${jb4dc.sso.server.context-path}")
    private String JB4DC_SSO_SERVER_CONTEXT_PATH;

    @Value("${jb4dc.sso.server.view.login}")
    private String JB4DC_SSO_SERVER_VIEW_LOGIN;

    @Value("${jb4dc.sso.server.view.logout}")
    private String JB4DC_SSO_SERVER_VIEW_LOGOUT;

    @Value("${jb4dc.sso.server.excluded}")
    private String JB4DC_SSO_SERVER_EXCLUDED;

    @Bean
    public FilterRegistrationBean xxlSsoFilterRegistration() {
        // xxl-sso, filter init
        FilterRegistrationBean registration = new FilterRegistrationBean();

        registration.setName("XxlSsoWebFilter");
        registration.setOrder(1);
        registration.addUrlPatterns("/*");
        SsoWebFilter filter = new SsoWebFilter();
        filter.setCheckSessionSuccess(new ICheckSessionSuccess() {
            @Override
            public void run(ServletRequest request, ServletResponse response, FilterChain chain, JB4DCSession jb4DSession) {
                try {
                    System.out.println("重远程获取Session完成,用户:"+ JsonUtility.toObjectString(jb4DSession));
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }
        });
        registration.setFilter(filter);
        registration.addInitParameter(Conf.KEY_JB4DC_SSO_SERVER_ADDRESS, this.JB4DC_SSO_SERVER_ADDRESS);
        registration.addInitParameter(Conf.KEY_JB4DC_SSO_SERVER_CONTEXT_PATH,this.JB4DC_SSO_SERVER_CONTEXT_PATH);
        registration.addInitParameter(Conf.KEY_JB4DC_SSO_SERVER_VIEW_LOGIN, this.JB4DC_SSO_SERVER_VIEW_LOGIN);
        registration.addInitParameter(Conf.KEY_JB4DC_SSO_SERVER_VIEW_LOGOUT, this.JB4DC_SSO_SERVER_VIEW_LOGOUT);
        registration.addInitParameter(Conf.KEY_JB4DC_SSO_SERVER_EXCLUDED,this.JB4DC_SSO_SERVER_EXCLUDED);

        return registration;
    }
}
