package com.jb4dc.builder.client.beanconfig.cache;

import com.jb4dc.builder.client.cache.ProxyBuilderCacheManager;
import org.ehcache.CacheManager;
import org.ehcache.config.builders.CacheManagerBuilder;
import org.ehcache.xml.XmlConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.URL;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */

@Configuration
public class BuilderClientCacheBeansConfig {
    @Bean
    public ProxyBuilderCacheManager buildClientCacheManager() {
        URL myUrl = getClass().getResource("/builder-client-ehcache.xml");
        //2、实例化一个XmlConfiguration，将XML文件URL传递给它
        XmlConfiguration xmlConfig = new XmlConfiguration(myUrl);
        //3、使用静态的org.ehcache.config.builders.CacheManagerBuilder.newCacheManager(org.ehcache.config.Configuration)
        //使用XmlConfiguration的Configuration创建你的CacheManager实例。
        CacheManager myCacheManager = CacheManagerBuilder.newCacheManager(xmlConfig);
        myCacheManager.init();
        ProxyBuilderCacheManager proxyBuilderCacheManager=new ProxyBuilderCacheManager(myCacheManager);
        return proxyBuilderCacheManager;
    }
}