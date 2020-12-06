package com.jb4dc.gridsystem.webpackage.beanconfig.sys;

import com.jb4dc.core.base.tools.FileUtility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.system.ApplicationHome;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.FileNotFoundException;
import java.net.URISyntaxException;

@Configuration
public class GridWebMvcConfig  implements WebMvcConfigurer {

    static Logger logger= LoggerFactory.getLogger(GridWebMvcConfig.class);

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 将/static/**访问映射到classpath:/production-files/
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/production-files/");

        ApplicationHome h = new ApplicationHome(this.getClass());
        // 本地获取的路径 D:\idea\springboot2.x\target  upload 跟 项目jar平级
        //String path = null;
        String path = h.getSource().getParent();
        String realPath = path + "/production-files/";
        logger.info("映射路径:"+realPath);
        registry.addResourceHandler("/static/**").addResourceLocations("file:" + realPath);
    }
}
