package com.jb4dc.builder.webpackage.ssoclient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.general.JB4DCUnitSessionSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.webpackage.RestTestBase;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.remote.OrganRuntimeRemote;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

public class OrganRuntimeRemoteTest  extends RestTestBase {
    //@Autowired
    //AppRuntimeProxy appRuntimeProxy;

    @Autowired
    OrganRuntimeRemote organRuntimeRemote;

    //@Autowired
    //IOrganRuntimeProxy organRuntimeProxy;

    @Test
    public void getEnableOrganMinMapJsonPropRT() throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCUnitSessionSessionUtility.mockLogin(getAlex4DSession());
        JBuild4DCResponseVo<Map<String, Map<String,String>>> result1 = organRuntimeRemote.getEnableOrganMinMapJsonPropRT();
        //Map<String, Map<String,String>> result2 = organRuntimeProxy.getEnableOrganMinMapJsonPropRT();

        String json1 = JsonUtility.toObjectString(result1.getData());
        //String json2 = JsonUtility.toObjectString(result2);

        //Assert.assertEquals(json1,json2);

        System.out.println(json1);
    }
}