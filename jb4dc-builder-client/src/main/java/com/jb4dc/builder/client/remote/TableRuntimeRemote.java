package com.jb4dc.builder.client.remote;

import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/4
 * To change this template use File | Settings | File Templates.
 */
@FeignClient(name= "${jb4dc.builder.server.name}",contextId = "TableRuntimeRemote",configuration = { BuilderClientFeignClientConfig.class },path = "${jb4dc.builder.server.context-path}/Rest/Builder/RunTime/TableRuntime")
public interface TableRuntimeRemote {

    @RequestMapping(value = "/GetTableFieldsByTableId", method = RequestMethod.POST)
    public JBuild4DCResponseVo<List<TableFieldPO>> getTableFieldsByTableId(@RequestParam("tableId") String tableId);
}
