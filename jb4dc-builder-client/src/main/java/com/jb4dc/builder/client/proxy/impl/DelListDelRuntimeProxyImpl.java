package com.jb4dc.builder.client.proxy.impl;

import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.base.service.cache.JB4DCCacheManagerV2;
import com.jb4dc.builder.client.remote.ListRuntimeRemote;
import com.jb4dc.builder.client.proxy.DelRuntimeProxyBase;
import com.jb4dc.builder.client.service.weblist.IListResourceService;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/22
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DelListDelRuntimeProxyImpl extends DelRuntimeProxyBase {


    @Autowired(required = false)
    IListResourceService listResourceService;

    @Autowired
    ListRuntimeRemote listRuntimeRemote;

    public ListResourcePO loadHTML(JB4DCSession jb4DCSession, String listId) throws JBuild4DCGenerallyException {
        try {
            ListResourcePO listResourcePO;
            if (listResourceService != null) {
                listResourcePO = listResourceService.getListRuntimeHTMLContent(jb4DCSession,listId);
            } else {
                listResourcePO=jb4DCCacheManagerV2.autoGetFromCache(JB4DCCacheManagerV2.Jb4dPlatformBuilderClientCacheName,
                        "Proxy",
                        this.getClass(), "LoadHTML_"+listId, new IBuildGeneralObj<ListResourcePO>() {
                    @Override
                    public ListResourcePO BuildObj() throws JBuild4DCGenerallyException {
                        return listRuntimeRemote.loadHTML(listId).getData();
                    }
                },ListResourcePO.class,JB4DCCacheManagerV2.DefExpirationTimeSeconds);
            }
            return listResourcePO;
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage(),ex,ex.getStackTrace());
        }
    }
}
