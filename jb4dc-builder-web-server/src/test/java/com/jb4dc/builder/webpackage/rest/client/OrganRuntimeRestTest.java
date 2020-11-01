package com.jb4dc.builder.webpackage.rest.client;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.webpackage.RestTestBase;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/1
 * To change this template use File | Settings | File Templates.
 */
public class OrganRuntimeRestTest extends RestTestBase {
    @Test
    public void getFullEnableOrgan() throws Exception {
        MockHttpServletRequestBuilder requestBuilder =post("/Rest/Builder/RunTime/OrganRuntime/GetFullEnableOrgan");

        requestBuilder.sessionAttr(JB4DCSessionUtility.UserLoginSessionKey,getSession());
        MvcResult result=mockMvc.perform(requestBuilder).andReturn();
        String json=result.getResponse().getContentAsString();
        System.out.println(json);

        JBuild4DCResponseVo responseVo = JsonUtility.toObject(json, JBuild4DCResponseVo.class);
        Assert.assertTrue(responseVo.isSuccess());

        requestBuilder =post("/Rest/Builder/RunTime/OrganRuntime/GetFullEnableOrgan");
        requestBuilder.sessionAttr(JB4DCSessionUtility.UserLoginSessionKey,getSession());
        result=mockMvc.perform(requestBuilder).andReturn();
        json=result.getResponse().getContentAsString();
        System.out.println(json);

        requestBuilder =post("/Rest/Builder/RunTime/OrganRuntime/GetFullEnableOrgan");
        requestBuilder.sessionAttr(JB4DCSessionUtility.UserLoginSessionKey,getSession());
        result=mockMvc.perform(requestBuilder).andReturn();
        json=result.getResponse().getContentAsString();
        System.out.println(json);
    }
}
