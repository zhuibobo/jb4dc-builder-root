package com.jb4dc.builder.client.proxy.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.cache.ClientBuilderCacheManager;
import com.jb4dc.builder.client.proxy.IDictionaryRuntimeProxy;
import com.jb4dc.builder.client.remote.DictionaryRuntimeRemote;
import com.jb4dc.builder.client.proxy.RuntimeProxyBase;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.cache.SSOCacheManager;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/25
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DictionaryRuntimeProxyImpl extends RuntimeProxyBase implements IDictionaryRuntimeProxy {
    Logger logger= LoggerFactory.getLogger(this.getClass());
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

    @Override
    public Map<String, Map<String,Object>> getAllDictionaryMinMapJsonPropRT() throws JBuild4DCGenerallyException, IOException {
        /*String cacheKey =builderCacheKey(this.getClass(),"getAllDictionaryMinMapJsonPropRT");

        //String cacheKey=this.builderCacheKey(aClass,classInnerSingleValue);
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
        return JsonUtility.toObjectList(cacheValue,valueType);*/

        Map<String, Map<String,Object>> mapJsonPropRT = autoGetFromCache(this.getClass(), "getAllDictionaryMinMapJsonPropRT", () -> {
            List<DictionaryEntity> allDD = dictionaryRuntimeRemote.getAllDictionary().getData();

            Map<String,Map<String,Object>> resultMap=new HashMap<>();
            for (DictionaryEntity dictionaryEntity : allDD) {
                Map<String,Object> ddMap=new HashMap<>();
                ddMap.put("ID",dictionaryEntity.getDictId());
                ddMap.put("VALUE",dictionaryEntity.getDictValue());
                ddMap.put("TEXT",dictionaryEntity.getDictText());
                resultMap.put(dictionaryEntity.getDictGroupId()+"_"+dictionaryEntity.getDictValue(),ddMap);
            }
            return resultMap;
        },Map.class);

        return mapJsonPropRT;
    }
}
