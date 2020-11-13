package com.jb4dc.builder.client.proxy.impl;

import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.builder.client.proxy.IDictionaryRuntimeProxy;
import com.jb4dc.builder.client.remote.DictionaryRuntimeRemote;
import com.jb4dc.builder.client.proxy.RuntimeProxyBase;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/25
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DictionaryRuntimeProxyImpl extends RuntimeProxyBase implements IDictionaryRuntimeProxy {

    //@Autowired
    //IDictionaryService dictionaryService;

    @Autowired
    DictionaryRuntimeRemote dictionaryRuntimeRemote;

    @Override
    public List<DictionaryEntity> getDDByGroupId(String groupId) throws JBuild4DCGenerallyException, IOException {
        List<DictionaryEntity> dictionaryEntityList;
        dictionaryEntityList = autoGetFromCacheList(this.getClass(), "getDDByGroupId_"+groupId, new IBuildGeneralObj<List<DictionaryEntity>>() {
            @Override
            public List<DictionaryEntity> BuildObj() throws JBuild4DCGenerallyException {
                List<DictionaryEntity> temp = dictionaryRuntimeRemote.getDDByGroupId(groupId).getData();
                return temp;
            }
        },DictionaryEntity.class);
        return dictionaryEntityList;
    }
}
