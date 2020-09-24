package com.jb4dc.builder.client.proxy.impl;

import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.builder.client.remote.ApiItemRuntimeRemote;
import com.jb4dc.builder.client.service.RuntimeProxyBase;
import com.jb4dc.builder.client.service.api.IApiItemService;
import com.jb4dc.builder.client.proxy.IApiItemRuntimeProxy;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
@Service
public class ApiItemRuntimeProxyImpl extends RuntimeProxyBase implements IApiItemRuntimeProxy {

    @Autowired(required = false)
    IApiItemService apiItemService;

    @Autowired
    ApiItemRuntimeRemote apiItemRuntimeRemote;

    @Override
    public ApiItemEntity getApiPOByValue(String apiValue) throws JBuild4DCGenerallyException {
        //通过本地bean获取环境变量实体,如果不存在业务bean,则通过rest接口远程获取.
        ApiItemEntity apiItemEntity;
        if(apiItemService!=null){
            apiItemEntity = apiItemService.getByValue(null,apiValue);
        }
        else{
            //envVariableEntity=new EnvVariableEntity();
            //则通过rest接口远程获取.
            apiItemEntity=this.autoGetFromCache(this.getClass(), apiValue, new IBuildGeneralObj<ApiItemEntity>() {
                @Override
                public ApiItemEntity BuildObj() throws JBuild4DCGenerallyException {
                    ApiItemEntity temp=apiItemRuntimeRemote.GetApiPOByValue(apiValue).getData();
                    return temp;
                }
            });
        }
        return  apiItemEntity;
    }
}
