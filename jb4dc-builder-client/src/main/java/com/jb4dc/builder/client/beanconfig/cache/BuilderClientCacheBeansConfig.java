package com.jb4dc.builder.client.beanconfig.cache;

import com.jb4dc.base.service.spring.SpringContextHolder;
import com.jb4dc.builder.client.cache.BuilderCacheManager;
import com.jb4dc.builder.client.cache.ClientBuilderCacheManager;
import org.ehcache.CacheManager;
import org.ehcache.config.builders.CacheManagerBuilder;
import org.ehcache.xml.XmlConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

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
    public ClientBuilderCacheManager buildClientCacheManager(SpringContextHolder springContextHolder) {
        URL myUrl = getClass().getResource("/builder-client-ehcache.xml");
        if(springContextHolder.getActiveProfile().equals("dev")){
            myUrl = getClass().getResource("/builder-client-ehcache-dev.xml");
        }
        //2、实例化一个XmlConfiguration，将XML文件URL传递给它
        XmlConfiguration xmlConfig = new XmlConfiguration(myUrl);
        //3、使用静态的org.ehcache.config.builders.CacheManagerBuilder.newCacheManager(org.ehcache.config.Configuration)
        //使用XmlConfiguration的Configuration创建你的CacheManager实例。
        CacheManager myCacheManager = CacheManagerBuilder.newCacheManager(xmlConfig);
        myCacheManager.init();
        ClientBuilderCacheManager clientBuilderCacheManager =new ClientBuilderCacheManager(myCacheManager);
        return clientBuilderCacheManager;
    }

    @Bean
    public BuilderCacheManager cacheManager() {
        URL myUrl = getClass().getResource("/builder-ehcache.xml");
        //2、实例化一个XmlConfiguration，将XML文件URL传递给它
        XmlConfiguration xmlConfig = new XmlConfiguration(myUrl);
        //3、使用静态的org.ehcache.config.builders.CacheManagerBuilder.newCacheManager(org.ehcache.config.Configuration)
        //使用XmlConfiguration的Configuration创建你的CacheManager实例。
        CacheManager myCacheManager = CacheManagerBuilder.newCacheManager(xmlConfig);
        myCacheManager.init();
        BuilderCacheManager builderCacheManager=new BuilderCacheManager(myCacheManager);
        return builderCacheManager;
    }
}
