package com.jb4dc.builder.client.remote;

import com.jb4dc.sso.client.remote.FeignSSORequestInterceptor;
import feign.Logger;
import feign.codec.Encoder;
import feign.form.spring.SpringFormEncoder;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.cloud.openfeign.support.SpringEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/24
 * To change this template use File | Settings | File Templates.
 */
@Configuration
public class BuilderClientFeignClientConfig {
    @Bean(name = "BuilderFeignRequestInterceptor")
    FeignSSORequestInterceptor feignRequestInterceptor() {
        return new FeignSSORequestInterceptor();
    }
}
