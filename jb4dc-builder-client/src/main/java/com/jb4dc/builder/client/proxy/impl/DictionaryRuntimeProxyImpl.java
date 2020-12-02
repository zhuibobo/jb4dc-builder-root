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
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    //static List<DictionaryEntity> allDD=new ArrayList<>();

    @Override
    public List<DictionaryEntity> loadAllDD() throws IOException, JBuild4DCGenerallyException {
        List<DictionaryEntity> allDD = autoGetFromCacheList(this.getClass(), "loadAllDD", () -> {
            List<DictionaryEntity> temp = dictionaryRuntimeRemote.getAllDictionary().getData();
            return temp;
        },DictionaryEntity.class);
        return allDD;
        //return dictionaryEntityList;
    }

    @Override
    public List<DictionaryEntity> getDDByGroupId(String groupId) throws JBuild4DCGenerallyException, IOException {
        /*List<DictionaryEntity> dictionaryEntityList;
        dictionaryEntityList = autoGetFromCacheList(this.getClass(), "getDDByGroupId_"+groupId, () -> {
            List<DictionaryEntity> temp = dictionaryRuntimeRemote.getDDByGroupId(groupId).getData();
            return temp;
        },DictionaryEntity.class);
        return dictionaryEntityList;*/
        List<DictionaryEntity> allDD = loadAllDD();
        List<DictionaryEntity> dictionaryEntityList=allDD.stream().filter(item->item.getDictGroupId().equals(groupId)).collect(Collectors.toList());
        return dictionaryEntityList;
    }

    @Override
    public List<DictionaryEntity> getDictionaryByGroup3Level(String groupId) throws JBuild4DCGenerallyException, IOException {
        List<DictionaryEntity> dictionaryByGroup3Level = autoGetFromCacheList(this.getClass(), "getDictionaryByGroup3Level", () -> {
            List<DictionaryEntity> temp = dictionaryRuntimeRemote.getDictionaryByGroup3Level(groupId).getData();
            return temp;
        },DictionaryEntity.class);
        return dictionaryByGroup3Level;
    }
}
