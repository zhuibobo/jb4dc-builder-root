package com.jb4dc.builder.client.remote;

import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/25
 * To change this template use File | Settings | File Templates.
 */
@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "DictionaryRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },path = "${jb4dc.builder.server.context-path}/Rest/Builder/RunTime/DictionaryRuntime")
public interface DictionaryRuntimeRemote {

    @RequestMapping(value = "/GetDDByGroupId",method = RequestMethod.POST)
    JBuild4DCResponseVo<List<DictionaryEntity>> getDDByGroupId(@RequestParam("groupId") String groupId);
}
