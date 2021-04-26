package com.jb4dc.builder.webpackage;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.webserver.ApplicationBuilderWebServer;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.MockMvcBuilderCustomizer;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.web.context.WebApplicationContext;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/30
 * To change this template use File | Settings | File Templates.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration(value = "src/main/webapp")
/*@ContextHierarchy({
        @ContextConfiguration(name = "parent", classes = RootConfig.class),
        @ContextConfiguration(name = "child", classes = WebConfig.class)})*/
@SpringBootTest(classes = ApplicationBuilderWebServer.class)
public class RestTestBase {

    public MockMvc mockMvc;

    @Autowired
    public WebApplicationContext context;

    @Before
    public void setupMock() throws Exception {
        //context.
        mockMvc = webAppContextSetup(context).alwaysDo(result -> {
            result.getResponse().setCharacterEncoding("UTF-8");
        }).build();
    }

    @Bean
    MockMvcBuilderCustomizer responseCharacterEncodingCustomizer() {
        MockMvcBuilderCustomizer mockMvcBuilderCustomizer = builder -> builder.alwaysDo(result -> {
            result.getResponse().setCharacterEncoding("UTF-8");
        });
        return mockMvcBuilderCustomizer;
    }

    public JB4DCSession getSession(){
        return JB4DCSessionUtility.getInitSystemSession();
    }

    public JBuild4DCResponseVo simpleDelete(String url, String recordId, Map<String,String> paras) throws Exception {
        MockHttpServletRequestBuilder requestDeleteBuilder = delete(url);
        requestDeleteBuilder.contentType(MediaType.APPLICATION_JSON_UTF8);
        requestDeleteBuilder.sessionAttr("JB4DCSession", getSession());

        requestDeleteBuilder.param("recordId",recordId);
        if(paras!=null&&paras.size()>0){
            for (Map.Entry<String, String> stringStringEntry : paras.entrySet()) {
                requestDeleteBuilder.param(stringStringEntry.getKey(),stringStringEntry.getValue());
            }
        }
        MvcResult result = mockMvc.perform(requestDeleteBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DCResponseVo responseVo = JsonUtility.toObject(json, JBuild4DCResponseVo.class);
        return responseVo;
    }

    public JBuild4DCResponseVo simpleSaveEdit(String url, Object entity) throws Exception {
        MockHttpServletRequestBuilder requestPostBuilder = post(url);
        requestPostBuilder.contentType(MediaType.APPLICATION_JSON_UTF8);
        requestPostBuilder.sessionAttr("JB4DCSession", getSession());
        requestPostBuilder.content(JsonUtility.toObjectString(entity));
        MvcResult result = mockMvc.perform(requestPostBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DCResponseVo responseVo = JsonUtility.toObject(json, JBuild4DCResponseVo.class);
        return responseVo;
    }

    public JBuild4DCResponseVo simpleGetData(String url, Map<String,String> paras) throws Exception {
        MockHttpServletRequestBuilder requestDeleteBuilder = post(url);
        requestDeleteBuilder.contentType(MediaType.APPLICATION_JSON_UTF8);
        requestDeleteBuilder.sessionAttr("JB4DCSession", getSession());

        if(paras!=null&&paras.size()>0){
            for (Map.Entry<String, String> stringStringEntry : paras.entrySet()) {
                requestDeleteBuilder.param(stringStringEntry.getKey(),stringStringEntry.getValue());
            }
        }
        MvcResult result = mockMvc.perform(requestDeleteBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DCResponseVo responseVo = JsonUtility.toObject(json, JBuild4DCResponseVo.class);
        return responseVo;
    }
}
