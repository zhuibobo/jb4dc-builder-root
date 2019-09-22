package com.jb4dc.builder.webserver;

import com.jb4dc.builder.client.rest.DataSetRuntimeRest;
import com.jb4dc.builder.client.rest.FormRuntimeRest;
import com.jb4dc.builder.client.rest.ListRuntimeRest;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/28
 * To change this template use File | Settings | File Templates.
 */

@SpringBootApplication(exclude= {DataSourceAutoConfiguration.class})
@EnableDiscoveryClient
@EnableFeignClients("com.jb4dc")
@ComponentScan(basePackages = "com.jb4dc",excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {ListRuntimeRest.class, FormRuntimeRest.class, DataSetRuntimeRest.class}) )
public class ApplicationBuilderWebServer {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationBuilderWebServer.class, args);
    }
}
