package com.jb4dc.builder.webpackage.beanconfig.service;

import com.jb4dc.base.service.IOperationLogService;
import com.jb4dc.sso.client.remote.OperationLogRemoteServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/1
 * To change this template use File | Settings | File Templates.
 */
@Configuration
public class BuilderServiceBeansConfig {
    @Bean
    public IOperationLogService operationLogService(){
        return new OperationLogRemoteServiceImpl();
    }
}
