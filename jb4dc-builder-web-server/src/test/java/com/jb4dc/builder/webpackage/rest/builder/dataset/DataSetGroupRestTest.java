package com.jb4dc.builder.webpackage.rest.builder.dataset;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.dbentities.dataset.DatasetGroupEntity;
import com.jb4dc.builder.service.dataset.IDatasetGroupService;
import com.jb4dc.builder.webpackage.RestTestBase;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.junit.Assert;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/9/3
 * To change this template use File | Settings | File Templates.
 */
@FixMethodOrder(MethodSorters.JVM)
public class DataSetGroupRestTest extends RestTestBase {

    @Autowired
    IDatasetGroupService datasetGroupService;

    public String devMockGroupId ="DevMockDataSetGroupId";

    public String builderGroupId="BuilderDataSetGroupId001";

    @Test
    public void addDevTestGroup() throws Exception {
        DatasetGroupEntity datasetGroupEntity=datasetGroupService.getByPrimaryKey(getSession(), devMockGroupId);
        if(datasetGroupEntity==null){
            createDataSetGroup(devMockGroupId,"开发样例分组","JBuild4DCDevMockDBLink");
        }
        datasetGroupEntity=datasetGroupService.getByPrimaryKey(getSession(),builderGroupId);
        if(datasetGroupEntity==null){
            createDataSetGroup(builderGroupId,"构建库-开发测试分组","JBuild4DCBuilderDBLink");
        }
    }

    private void createDataSetGroup(String groupId,String groupText,String parentId) throws Exception {
        MockHttpServletRequestBuilder requestBuilder = post("/Rest/Builder/DataSet/DataSetGroup/SaveEdit");
        requestBuilder.contentType(MediaType.APPLICATION_JSON);
        requestBuilder.sessionAttr(JB4DCSessionUtility.UserLoginSessionKey, getSession());
        DatasetGroupEntity groupEntity=new DatasetGroupEntity();
        groupEntity.setDsGroupId(groupId);
        groupEntity.setDsGroupValue(groupId);
        groupEntity.setDsGroupText(groupText);
        groupEntity.setDsGroupOrderNum(0);
        groupEntity.setDsGroupCreateTime(new Date());
        groupEntity.setDsGroupDesc("UnitTestDataSetGroup");
        groupEntity.setDsGroupStatus(EnableTypeEnum.enable.getDisplayName());
        groupEntity.setDsGroupParentId(parentId);
        groupEntity.setDsGroupIsSystem(TrueFalseEnum.False.getDisplayName());
        groupEntity.setDsGroupDelEnable(TrueFalseEnum.True.getDisplayName());

        requestBuilder.content(JsonUtility.toObjectString(groupEntity));
        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DCResponseVo responseVo = JsonUtility.toObject(json, JBuild4DCResponseVo.class);
        Assert.assertTrue(responseVo.isSuccess());
    }
}
