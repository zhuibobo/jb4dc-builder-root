package com.jb4dc.builder.client.proxy.impl;

import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.base.service.cache.JB4DCCacheManagerV2;
import com.jb4dc.builder.client.remote.ApiItemRuntimeRemote;
import com.jb4dc.builder.client.proxy.DelRuntimeProxyBase;
import com.jb4dc.builder.client.service.api.IApiItemService;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DelApiItemDelRuntimeProxyImpl extends DelRuntimeProxyBase {

    @Autowired(required = false)
    IApiItemService apiItemService;

    @Autowired
    ApiItemRuntimeRemote apiItemRuntimeRemote;

    public ApiItemEntity getApiPOByValue(String apiValue) throws JBuild4DCGenerallyException, IOException {
        //通过本地bean获取环境变量实体,如果不存在业务bean,则通过rest接口远程获取.
        ApiItemEntity apiItemEntity;
        if(apiItemService!=null){
            apiItemEntity = apiItemService.getByValue(null,apiValue);
        }
        else{
            //envVariableEntity=new EnvVariableEntity();
            //则通过rest接口远程获取.
            apiItemEntity=jb4DCCacheManagerV2.autoGetFromCache(JB4DCCacheManagerV2.Jb4dPlatformBuilderClientCacheName,
                    "Proxy",
                    this.getClass(), apiValue, new IBuildGeneralObj<ApiItemEntity>() {
                @Override
                public ApiItemEntity BuildObj() throws JBuild4DCGenerallyException {
                    ApiItemEntity temp=apiItemRuntimeRemote.getApiPOByValue(apiValue).getData();
                    return temp;
                }
            },ApiItemEntity.class,JB4DCCacheManagerV2.DefExpirationTimeSeconds);
        }
        return  apiItemEntity;
    }
}
