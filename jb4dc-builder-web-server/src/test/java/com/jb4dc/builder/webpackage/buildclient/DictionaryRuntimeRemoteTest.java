package com.jb4dc.builder.webpackage.buildclient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.general.JB4DCUnitSessionSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.remote.ApiItemRuntimeRemote;
import com.jb4dc.builder.client.remote.DictionaryRuntimeRemote;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.webpackage.RestTestBase;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
public class DictionaryRuntimeRemoteTest extends RestTestBase {
    //@Autowired
    //AppRuntimeProxy appRuntimeProxy;

    @Autowired
    DictionaryRuntimeRemote dictionaryRuntimeRemote;

    @Test
    public void getAllDictionaryMinMapJsonProp() throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCUnitSessionSessionUtility.mockLogin(getAlex4DSession());
        JBuild4DCResponseVo<Map<String, Map<String,Object>>> result = dictionaryRuntimeRemote.getAllDictionaryMinMapJsonProp();
        /*for (SsoAppPO datum : result.getData()) {
            System.out.println(datum.getAppCode());
        }*/

        String json = JsonUtility.toObjectString(result);
        System.out.println(json);
    }
}