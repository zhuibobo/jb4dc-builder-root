package com.jb4dc.builder.client.proxy;

import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
public interface IApiItemRuntimeProxy {
    ApiItemEntity getApiPOByValue(String apiValue) throws JBuild4DCGenerallyException, IOException;
}
