package com.jb4dc.builder.webpackage.workflow.integrate;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.webpackage.RestTestBase;
import org.junit.Test;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;


public class WorkflowRuntimeTest extends RestTestBase {

    @Test
    public void flowModelIntegratedRuntimeRestGetMyStartEnableModel() throws Exception {
        MockHttpServletRequestBuilder requestBuilder =get("/Rest/Workflow/RunTime/FlowModelIntegrated/GetMyStartEnableModel");

        requestBuilder.sessionAttr(JB4DCSessionUtility.UserLoginSessionKey,getSession());
        requestBuilder.param("userId","Alex4D");

        MvcResult result=mockMvc.perform(requestBuilder).andReturn();
        //result.getResponse().setCharacterEncoding("UTF-8");
        String json=result.getResponse().getContentAsString();
        System.out.println(json);
    }

    @Test
    public void flowModelIntegratedRuntimeRestGetRuntimeModelWithStart() throws Exception {
        MockHttpServletRequestBuilder requestBuilder =get("/Rest/Workflow/RunTime/FlowModelIntegrated/GetRuntimeModelWithStart");

        requestBuilder.sessionAttr(JB4DCSessionUtility.UserLoginSessionKey,getSession());
        requestBuilder.param("userId","Alex4D");
        requestBuilder.param("modelKey","Flow_Model_097196106");

        MvcResult result=mockMvc.perform(requestBuilder).andReturn();
        //result.getResponse().setCharacterEncoding("UTF-8");
        String json=result.getResponse().getContentAsString();
        System.out.println(json);
    }
}
