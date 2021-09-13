package com.jb4dc.builder.webserver;

import com.jb4dc.builder.client.remote.ApiItemRuntimeRemote;
import com.jb4dc.builder.client.remote.TableRuntimeRemote;
import com.jb4dc.builder.client.rest.DataSetRuntimeRest;
import com.jb4dc.builder.client.rest.FormRuntimeRest;
import com.jb4dc.builder.client.rest.ListButtonRuntimeRest;
import com.jb4dc.builder.client.rest.ListRuntimeRest;
import com.jb4dc.core.base.tools.FileUtility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.system.ApplicationHome;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

import java.io.File;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/28
 * To change this template use File | Settings | File Templates.
 */

@SpringBootApplication(exclude= {DataSourceAutoConfiguration.class})
@EnableDiscoveryClient
@EnableFeignClients("com.jb4dc")
@ComponentScan(basePackages = "com.jb4dc",excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE,
        classes = {
                ListRuntimeRest.class,
                FormRuntimeRest.class,
                DataSetRuntimeRest.class,
                ListButtonRuntimeRest.class
        })
)
public class ApplicationBuilderWebServer {

    static Logger logger= LoggerFactory.getLogger(ApplicationBuilderWebServer.class);

    public static void main(String[] args) {
        SpringApplication.run(ApplicationBuilderWebServer.class, args);
        ApplicationHome home = new ApplicationHome(ApplicationBuilderWebServer.class);
        logger.info("运行路径:"+home.getDir().getPath());
        logger.info("运行路径:"+home.getSource().getPath());
        FileUtility.setJarRootPath(home.getDir().getPath());
        FileUtility.setJarPath(home.getSource().getPath());
    }
}
