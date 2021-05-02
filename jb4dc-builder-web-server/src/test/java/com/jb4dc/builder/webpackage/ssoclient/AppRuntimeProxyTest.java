package com.jb4dc.builder.webpackage.ssoclient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.general.JB4DCUnitSessionSessionUtility;
import com.jb4dc.base.service.po.SsoAppPO;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.webpackage.RestTestBase;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.remote.AppRuntimeRemote;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

public class AppRuntimeProxyTest extends RestTestBase {
    //@Autowired
    //AppRuntimeProxy appRuntimeProxy;

    @Autowired
    AppRuntimeRemote appRuntimeRemote;

    @Test
    public void getHasAuthorityAppSSO() throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCUnitSessionSessionUtility.mockLogin(getAlex4DSession());
        JBuild4DCResponseVo<List<SsoAppPO>> result = appRuntimeRemote.getHasAuthorityAppSSO("Alex4D");
        for (SsoAppPO datum : result.getData()) {
            System.out.println(datum.getAppCode());
        }

        String json = JsonUtility.toObjectString(result);
        System.out.println(json);
    }
}
