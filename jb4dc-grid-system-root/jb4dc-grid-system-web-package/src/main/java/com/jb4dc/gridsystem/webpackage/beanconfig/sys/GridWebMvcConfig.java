package com.jb4dc.gridsystem.webpackage.beanconfig.sys;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class GridWebMvcConfig  implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 将/static/**访问映射到classpath:/production-files/
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/production-files/");
    }
}
