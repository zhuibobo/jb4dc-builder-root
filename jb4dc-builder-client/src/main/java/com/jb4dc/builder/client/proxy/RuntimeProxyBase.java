package com.jb4dc.builder.client.proxy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.cache.ProxyBuilderCacheManager;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.tools.StringUtility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/5
 * To change this template use File | Settings | File Templates.
 */
public class RuntimeProxyBase {
    Logger logger= LoggerFactory.getLogger(this.getClass());

    @Autowired(required = false)
    ProxyBuilderCacheManager proxyBuilderCacheManager;

    public String builderCacheKey(Class aClass,String classInnerSingleValue) {
        return aClass.getCanonicalName() + classInnerSingleValue;
    }

    public <T> T autoGetFromCache(Class aClass,String classInnerSingleValue, IBuildGeneralObj<T> builder,Class<T> valueType) throws JBuild4DCGenerallyException, IOException {
        String cacheKey=this.builderCacheKey(aClass,classInnerSingleValue);
        if(proxyBuilderCacheManager.exist(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey)){
            logger.info("从缓存中获取数据"+cacheKey);
            String cacheValue = proxyBuilderCacheManager.getString(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey);
            return JsonUtility.toObject(cacheValue,valueType);
        }
        else{
            logger.info("不从缓存中获取数据"+cacheKey);
            T obj=builder.BuildObj();
            if(obj==null){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "不能将Null存入缓存,Key:"+cacheKey);
            }
            String json= JsonUtility.toObjectString(obj);
            proxyBuilderCacheManager.put(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey,json);
        }
        String cacheValue=proxyBuilderCacheManager.getString(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey);
        return JsonUtility.toObject(cacheValue,valueType);
    }

    public <T> List<T> autoGetFromCacheList(Class aClass, String classInnerSingleValue, IBuildGeneralObj<List<T>> builder, Class<T> valueType) throws JBuild4DCGenerallyException, IOException {
        String cacheKey=this.builderCacheKey(aClass,classInnerSingleValue);
        if(proxyBuilderCacheManager.exist(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey)){
            logger.info("从缓存中获取数据"+cacheKey);
            String cacheValue = proxyBuilderCacheManager.getString(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey);
            return JsonUtility.toObjectList(cacheValue,valueType);
        }
        else{
            logger.info("不从缓存中获取数据"+cacheKey);
             List<T> obj=builder.BuildObj();
            if(obj==null){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "不能将Null存入缓存,Key:"+cacheKey);
            }
            String json= JsonUtility.toObjectString(obj);
            proxyBuilderCacheManager.put(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey,json);
        }
        String cacheValue=proxyBuilderCacheManager.getString(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey);
        String cacheValue1=proxyBuilderCacheManager.getString(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey);
        String cacheValue2=proxyBuilderCacheManager.getString(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey);
        return JsonUtility.toObjectList(cacheValue,valueType);
    }
}