package com.jb4dc.devmock.webserver.beanconfig.service;

import com.jb4dc.base.service.IOperationLogService;
import com.jb4dc.sso.client.remote.OperationLogRemoteServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/31
 * To change this template use File | Settings | File Templates.
 */
@Configuration
public class DevMockServiceBeansConfig {
    @Bean
    public IOperationLogService operationLogService(){
        return new OperationLogRemoteServiceImpl();
    }
}
