package com.jb4dc.builder.client.service;

import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.builder.client.cache.ProxyBuilderCacheManager;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/5
 * To change this template use File | Settings | File Templates.
 */
public class RuntimeProxyBase {
    public String builderCacheKey(Class aClass,String classInnerSingleValue) {
        return aClass.getCanonicalName() + classInnerSingleValue;
    }

    public <T> T autoGetFromCache(Class aClass,String classInnerSingleValue, IBuildGeneralObj<T> builder) throws JBuild4DCGenerallyException {
        String cacheKey=this.builderCacheKey(aClass,classInnerSingleValue);
        if(ProxyBuilderCacheManager.exist(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey)){
            return ProxyBuilderCacheManager.getObject(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey);
        }
        else{
            Object obj=builder.BuildObj();
            ProxyBuilderCacheManager.put(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey,obj);
        }
        return ProxyBuilderCacheManager.getObject(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey);
    }
}
