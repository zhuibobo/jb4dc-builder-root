package com.jb4dc.builder.client.proxy.impl;

import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.base.service.cache.JB4DCCacheManagerV2;

import com.jb4dc.builder.client.remote.WebFormRuntimeRemote;
import com.jb4dc.builder.client.proxy.DelRuntimeProxyBase;
import com.jb4dc.builder.client.service.webform.IFormResourceService;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/6
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DelWebFormDelRuntimeProxyImpl extends DelRuntimeProxyBase {

    @Autowired
    WebFormRuntimeRemote formRuntimeRemote;

    @Autowired(required = false)
    IFormResourceService formResourceService;

    //@Override
    public FormResourcePO getFormRuntimePageContentById(JB4DCSession jb4DCSession, String formId) throws JBuild4DCGenerallyException, IOException {
        FormResourcePO formResourcePO=new FormResourcePO();
        if(formResourceService!=null){
            formResourcePO = formResourceService.getFormRuntimePageContent(jb4DCSession,formId);
        }
        else{
            /*formResourcePO = this.autoGetFromCache(this.getClass(), formId, new IBuildGeneralObj<FormResourcePO>() {
                @Override
                public FormResourcePO BuildObj() throws JBuild4DCGenerallyException {
                    FormResourcePO temp = formRuntimeRemote.loadHTML(formId).getData();
                    return temp;
                }
            },FormResourcePO.class);*/
            formResourcePO = jb4DCCacheManagerV2.autoGetFromCache(JB4DCCacheManagerV2.Jb4dPlatformBuilderClientCacheName,
                    "Proxy",
                    this.getClass(), formId, new IBuildGeneralObj<FormResourcePO>() {
                @Override
                public FormResourcePO BuildObj() throws JBuild4DCGenerallyException {
                    FormResourcePO temp = formRuntimeRemote.loadHTML(formId).getData();
                    return temp;
                }
            },FormResourcePO.class,JB4DCCacheManagerV2.DefExpirationTimeSeconds);
        }
        return formResourcePO;
    }
}
