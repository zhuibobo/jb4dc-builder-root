package com.jb4dc.builder.webserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/28
 * To change this template use File | Settings | File Templates.
 */

@SpringBootApplication
@ComponentScan("com.jb4dc")
@EnableDiscoveryClient
public class ApplicationBuilderWebServer {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationBuilderWebServer.class, args);
    }
}
