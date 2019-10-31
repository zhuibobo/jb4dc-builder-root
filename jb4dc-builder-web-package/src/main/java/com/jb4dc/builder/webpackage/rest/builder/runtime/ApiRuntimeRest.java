package com.jb4dc.builder.webpackage.rest.builder.runtime;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.client.service.api.IApiItemService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/ApiRuntime")
public class ApiRuntimeRest {

    @Autowired
    IApiItemService apiItemService;

    @RequestMapping(value = "/GetApiPOById",method = RequestMethod.POST)
    public JBuild4DCResponseVo<ApiItemEntity> getApiPOById(String apiId) throws JBuild4DCGenerallyException {
        ApiItemEntity apiItemEntity=apiItemService.getByPrimaryKey(JB4DCSessionUtility.getSession(),apiId);
        return JBuild4DCResponseVo.getDataSuccess(apiItemEntity);
    }

    @RequestMapping(value = "/GetApiPOByValue",method = RequestMethod.POST)
    public JBuild4DCResponseVo<ApiItemEntity> getApiPOByValue(String apiValue) throws JBuild4DCGenerallyException {
        ApiItemEntity apiItemEntity=apiItemService.getByValue(JB4DCSessionUtility.getSession(),apiValue);
        return JBuild4DCResponseVo.getDataSuccess(apiItemEntity);
    }
}
