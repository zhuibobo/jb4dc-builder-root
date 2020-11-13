package com.jb4dc.qcsystem.webserver;

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

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/7
 * To change this template use File | Settings | File Templates.
 */

@SpringBootApplication(exclude= {DataSourceAutoConfiguration.class})
@EnableDiscoveryClient
@EnableFeignClients("com.jb4dc")
@ComponentScan("com.jb4dc")
public class ApplicationQCSystemWebServer {
    static Logger logger= LoggerFactory.getLogger(ApplicationQCSystemWebServer.class);
    public static void main(String[] args) {
        SpringApplication.run(ApplicationQCSystemWebServer.class, args);
        ApplicationHome home = new ApplicationHome(ApplicationQCSystemWebServer.class);
        logger.info("运行路径:"+home.getDir().getPath());
        logger.info("运行路径:"+home.getSource().getPath());
        FileUtility.setJarRootPath(home.getDir().getPath());
        FileUtility.setJarPath(home.getSource().getPath());
    }

}
