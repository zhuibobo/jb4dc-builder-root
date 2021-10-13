package com.jb4dc.qcsystem.webpackage.beanconfig.sys;

import com.jb4dc.feb.dist.webserver.interceptor.JB4DCSessionInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /*@Autowired
    ISSOLoginStore issoLoginStore;*/

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new JB4DCSessionInterceptor()).excludePathPatterns("/Js/**","/Themes/**");
    }
}