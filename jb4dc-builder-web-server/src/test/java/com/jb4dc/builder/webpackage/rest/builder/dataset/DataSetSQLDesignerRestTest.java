package com.jb4dc.builder.webpackage.rest.builder.dataset;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.po.SQLResolveToDataSetPO;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

public class DataSetSQLDesignerRestTest extends DataSetGroupRestTest {
    @Test
    public void validateSQLEnable() throws Exception {
        addDevTestGroup();

        JBuild4DCResponseVo responseVo=validateSQLEnable("select TDEV_TEST_1.*,TDEV_TEST_2.F_TABLE1_ID,'address' ADDRESS,'sex' SEX from TDEV_TEST_1 join TDEV_TEST_2 on TDEV_TEST_1.ID=TDEV_TEST_2.F_TABLE1_ID where TDEV_TEST_1.ID='#{ApiVar.当前用户所在组织ID}'");
        Assert.assertTrue(responseVo.isSuccess());
    }

    public JBuild4DCResponseVo validateSQLEnable(String sqlText) throws Exception {
        MockHttpServletRequestBuilder requestBuilder = post("/Rest/Builder/DataSet/DataSetSQLDesigner/ValidateSQLEnable");
        requestBuilder.sessionAttr(JB4DCSessionUtility.UserLoginSessionKey, getSession());
        requestBuilder.param("sqlText", sqlText);
        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DCResponseVo responseVo = JsonUtility.toObject(json, JBuild4DCResponseVo.class);

        Object obj=responseVo.getData();
        String temp=JsonUtility.toObjectString(obj);
        SQLResolveToDataSetPO vo=JsonUtility.toObject(temp, SQLResolveToDataSetPO.class);

        responseVo.setData(vo);
        System.out.println(json);
        return responseVo;
    }
}
