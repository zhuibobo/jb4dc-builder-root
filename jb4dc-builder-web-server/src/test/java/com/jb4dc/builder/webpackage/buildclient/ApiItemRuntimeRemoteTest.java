package com.jb4dc.builder.webpackage.buildclient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.general.JB4DCUnitSessionSessionUtility;
import com.jb4dc.base.service.po.SsoAppPO;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.remote.ApiItemRuntimeRemote;
import com.jb4dc.builder.client.remote.BuilderClientFeignClientConfig;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.webpackage.RestTestBase;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.remote.AppRuntimeRemote;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
public class ApiItemRuntimeRemoteTest  extends RestTestBase {
    //@Autowired
    //AppRuntimeProxy appRuntimeProxy;

    @Autowired
    ApiItemRuntimeRemote apiItemRuntimeRemote;

    @Test
    public void getApiPOByValue() throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCUnitSessionSessionUtility.mockLogin(getAlex4DSession());
        JBuild4DCResponseVo<ApiItemEntity> result = apiItemRuntimeRemote.getApiPOByValue("com.jb4dc.gridsystem.api.NewFamilyPersonSupplementFieldDataApi");
        /*for (SsoAppPO datum : result.getData()) {
            System.out.println(datum.getAppCode());
        }*/

        String json = JsonUtility.toObjectString(result);
        System.out.println(json);
    }

}