package com.jb4dc.builder.client.remote;

import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/28
 * To change this template use File | Settings | File Templates.
 */
@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "DataSetRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },path = "${jb4dc.builder.server.context-path}/Rest/Builder/RunTime/DataSetRuntime")
public interface DataSetRuntimeRemote {

    @RequestMapping(value = "/GetByDataSetId",method = RequestMethod.POST)
    JBuild4DCResponseVo<DataSetPO> getByDataSetId(@RequestParam("dataSetId") String dataSetId);
}
