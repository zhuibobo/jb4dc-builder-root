package com.jb4dc.builder.client.proxy;

import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.base.service.cache.JB4DCCacheManagerV2;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
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
public class DelRuntimeProxyBase {
    Logger logger= LoggerFactory.getLogger(this.getClass());

    @Autowired
    public JB4DCCacheManagerV2 jb4DCCacheManagerV2;

    /*@Autowired(required = false)
    protected ClientBuilderCacheManager clientBuilderCacheManager;

    public String builderCacheKey(Class aClass,String classInnerSingleValue) {
        return aClass.getCanonicalName() + classInnerSingleValue;
    }

    public <T> T autoGetFromCache(Class aClass,String classInnerSingleValue, IBuildGeneralObj<T> builder,Class<T> valueType) throws JBuild4DCGenerallyException, IOException {
        String cacheKey=this.builderCacheKey(aClass,classInnerSingleValue);
        if(clientBuilderCacheManager.exist(ClientBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey)){
            logger.info("从缓存中获取数据"+cacheKey);
            String cacheValue = clientBuilderCacheManager.getString(ClientBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey);
            return JsonUtility.toObject(cacheValue,valueType);
        }
        else{
            logger.info("不从缓存中获取数据"+cacheKey);
            T obj=builder.BuildObj();
            if(obj==null){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "不能将Null存入缓存,Key:"+cacheKey);
            }
            String json= JsonUtility.toObjectString(obj);
            clientBuilderCacheManager.put(ClientBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey,json);
        }
        String cacheValue= clientBuilderCacheManager.getString(ClientBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey);
        return JsonUtility.toObject(cacheValue,valueType);
    }

    public <T> List<T> autoGetFromCacheList(Class aClass, String classInnerSingleValue, IBuildGeneralObj<List<T>> builder, Class<T> valueType) throws JBuild4DCGenerallyException, IOException {
        String cacheKey=this.builderCacheKey(aClass,classInnerSingleValue);
        if(clientBuilderCacheManager.exist(ClientBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey)){
            logger.info("从缓存中获取数据"+cacheKey);
            String cacheValue = clientBuilderCacheManager.getString(ClientBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey);
            return JsonUtility.toObjectList(cacheValue,valueType);
        }
        else{
            logger.info("不从缓存中获取数据"+cacheKey);
             List<T> obj=builder.BuildObj();
            if(obj==null){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "不能将Null存入缓存,Key:"+cacheKey);
            }
            String json= JsonUtility.toObjectString(obj);
            clientBuilderCacheManager.put(ClientBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey,json);
        }
        String cacheValue= clientBuilderCacheManager.getString(ClientBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey);
        //String cacheValue1=proxyBuilderCacheManager.getString(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey);
        //String cacheValue2=proxyBuilderCacheManager.getString(ProxyBuilderCacheManager.PROXY_BUILDER_CACHE_NAME,cacheKey);
        return JsonUtility.toObjectList(cacheValue,valueType);
    }*/
}
