package com.jb4dc.builder.client.proxy.impl;

import com.jb4dc.base.service.cache.JB4DCCacheManagerV2;
import com.jb4dc.builder.client.proxy.DelRuntimeProxyBase;
import com.jb4dc.builder.client.remote.DictionaryRuntimeRemote;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
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
public class DelDictionaryDelRuntimeProxyImpl extends DelRuntimeProxyBase {
    Logger logger= LoggerFactory.getLogger(this.getClass());
    //@Autowired
    //IDictionaryService dictionaryService;

    @Autowired
    DictionaryRuntimeRemote dictionaryRuntimeRemote;

    //static List<DictionaryEntity> allDD=new ArrayList<>();

    public List<DictionaryEntity> loadAllDD() throws IOException, JBuild4DCGenerallyException {
        /*List<DictionaryEntity> allDD = autoGetFromCacheList(this.getClass(), "loadAllDD", () -> {
            List<DictionaryEntity> temp = dictionaryRuntimeRemote.getAllDictionary().getData();
            return temp;
        },DictionaryEntity.class);*/

        List<DictionaryEntity> allDD = jb4DCCacheManagerV2.autoGetFromCacheList(JB4DCCacheManagerV2.Jb4dPlatformBuilderClientCacheName,
                "Proxy",
                this.getClass(),
                "loadAllDD", () -> {
            List<DictionaryEntity> temp = dictionaryRuntimeRemote.getAllDictionary().getData();
            return temp;
        },DictionaryEntity.class,JB4DCCacheManagerV2.DefExpirationTimeSeconds);
        return allDD;
        //return dictionaryEntityList;
    }

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

    public List<DictionaryEntity> getDictionaryByGroup3Level(String groupId) throws JBuild4DCGenerallyException, IOException {
        /*List<DictionaryEntity> dictionaryByGroup3Level = autoGetFromCacheList(this.getClass(), "getDictionaryByGroup3Level", () -> {
            List<DictionaryEntity> temp = dictionaryRuntimeRemote.getDictionaryByGroup3Level(groupId).getData();
            return temp;
        },DictionaryEntity.class);*/
        List<DictionaryEntity> dictionaryByGroup3Level = jb4DCCacheManagerV2.autoGetFromCacheList(JB4DCCacheManagerV2.Jb4dPlatformBuilderClientCacheName,
                "Proxy",
                this.getClass(), "getDictionaryByGroup3Level"+groupId, () -> {
            List<DictionaryEntity> temp = dictionaryRuntimeRemote.getDictionaryByGroup3Level(groupId).getData();
            return temp;
        },DictionaryEntity.class,JB4DCCacheManagerV2.DefExpirationTimeSeconds);
        return dictionaryByGroup3Level;
    }

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

        Map<String, Map<String,Object>> mapJsonPropRT = jb4DCCacheManagerV2.autoGetFromCache(JB4DCCacheManagerV2.Jb4dPlatformBuilderClientCacheName,
                "Proxy",
                this.getClass(), "getAllDictionaryMinMapJsonPropRT", () -> {
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
        },Map.class,JB4DCCacheManagerV2.DefExpirationTimeSeconds);

        return mapJsonPropRT;
    }
}
