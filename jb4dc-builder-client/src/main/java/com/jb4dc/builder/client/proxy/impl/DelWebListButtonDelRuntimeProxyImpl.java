package com.jb4dc.builder.client.proxy.impl;

import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.base.service.cache.JB4DCCacheManagerV2;
import com.jb4dc.builder.client.remote.WebListButtonRuntimeRemote;
import com.jb4dc.builder.client.proxy.DelRuntimeProxyBase;
import com.jb4dc.builder.client.service.weblist.IWebListButtonService;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
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
public class DelWebListButtonDelRuntimeProxyImpl extends DelRuntimeProxyBase {

    @Autowired(required = false)
    IWebListButtonService webListButtonService;

    @Autowired
    WebListButtonRuntimeRemote listButtonRuntimeRemote;

    public ListButtonEntity getButtonPO(String buttonId) throws JBuild4DCGenerallyException, IOException {
        //通过本地bean获取环境变量实体,如果不存在业务bean,则通过rest接口远程获取.
        ListButtonEntity listButtonEntity;
        if(webListButtonService!=null) {
            listButtonEntity = webListButtonService.getByPrimaryKey(null, buttonId);
        }
        else{
            //envVariableEntity=new EnvVariableEntity();
            //则通过rest接口远程获取.
            //return listButtonRuntimeRemote.getButtonPO(buttonId).getData();
            listButtonEntity=jb4DCCacheManagerV2.autoGetFromCache(JB4DCCacheManagerV2.Jb4dPlatformBuilderClientCacheName,
                    "Proxy",
                    this.getClass(),"GetButtonPO"+ buttonId, new IBuildGeneralObj<ListButtonEntity>() {
                @Override
                public ListButtonEntity BuildObj() throws JBuild4DCGenerallyException {
                    ListButtonEntity temp=listButtonRuntimeRemote.getButtonPO(buttonId).getData();
                    return temp;
                }
            },ListButtonEntity.class,JB4DCCacheManagerV2.DefExpirationTimeSeconds);
        }
        return listButtonEntity;
    }
}
