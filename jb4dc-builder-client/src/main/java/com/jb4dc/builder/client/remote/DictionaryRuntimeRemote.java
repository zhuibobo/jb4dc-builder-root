package com.jb4dc.builder.client.remote;

import com.jb4dc.base.service.aspect.ClientCallRemoteCache;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/25
 * To change this template use File | Settings | File Templates.
 */
@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "DictionaryRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },path = "${jb4dc.builder.server.context-path}/Rest/SystemSetting/Dict/Dictionary")
public interface DictionaryRuntimeRemote {

    @RequestMapping(value = "/GetDDByGroupId",method = RequestMethod.GET)
    @ClientCallRemoteCache
    JBuild4DCResponseVo<List<DictionaryEntity>> getDDByGroupId(@RequestParam("groupId") String groupId);

    @RequestMapping(value = "/GetAllDictionary",method = RequestMethod.GET)
    @ClientCallRemoteCache
    JBuild4DCResponseVo<List<DictionaryEntity>> getAllDictionary();

    @RequestMapping(value = "/GetDictionaryByGroup3Level",method = RequestMethod.GET)
    @ClientCallRemoteCache
    JBuild4DCResponseVo<List<DictionaryEntity>> getDictionaryByGroup3Level(@RequestParam("groupId") String groupId);

    @RequestMapping(value = "/GetAllDictionaryMinMapJsonProp",method = RequestMethod.GET)
    @ClientCallRemoteCache
    JBuild4DCResponseVo<Map<String, Map<String,Object>>> getAllDictionaryMinMapJsonProp();
}
