package com.jb4dc.builder.webpackage.rest.builder.dataset;

import com.jb4dc.base.dbaccess.exenum.EnableTypeEnum;
import com.jb4dc.base.dbaccess.exenum.TrueFalseEnum;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dbentities.dataset.DatasetEntity;
import com.jb4dc.builder.exenum.DataSetTypeEnum;
import com.jb4dc.builder.po.DataSetColumnVo;
import com.jb4dc.builder.po.DataSetRelatedTableVo;
import com.jb4dc.builder.po.DataSetVo;
import com.jb4dc.builder.po.SQLResolveToDataSetVo;
import com.jb4dc.builder.service.dataset.IDatasetService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
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
public class DataSetMainRestTest extends DataSetSQLDesignerRestTest {

    @Autowired
    IDatasetService datasetService;

    private String dataSetId="UnitTestDataSet001";
    private String dataSetGroupId= DataSetGroupRestTest.devGroupId;

    @Test
    public void addSQLDataSet() throws Exception {
        validateSQLEnable();
        DatasetEntity existDataSet=datasetService.getVoByPrimaryKey(getSession(),dataSetId);
        if(existDataSet!=null){
            datasetService.deleteByKeyNotValidate(getSession(),dataSetId, JBuild4DCYaml.getWarningOperationCode());
        }
        if(existDataSet==null) {
            //DataSetSQLDesignerRestTest dataSetSQLDesignerControllerTest = new DataSetSQLDesignerRestTest();
            JBuild4DCResponseVo jBuild4DResponseVo = this.validateSQLEnable("select TDEV_TEST_1.*,TDEV_TEST_2.F_TABLE1_ID,'ADDRESS' ADDRESS,'SEX' SEX from TDEV_TEST_1 join TDEV_TEST_2 on TDEV_TEST_1.ID=TDEV_TEST_2.F_TABLE1_ID where TDEV_TEST_1.ID='#{ApiVar.当前用户所在组织ID}'");
            SQLResolveToDataSetVo resolveToDataSetVo = (SQLResolveToDataSetVo) jBuild4DResponseVo.getData();
            JB4DCSession jb4DCSession=getSession();
            DataSetVo dataSetVo = new DataSetVo();
            dataSetVo.setDsId(dataSetId);
            dataSetVo.setDsCaption("单元测试数据集");
            dataSetVo.setDsName("单元测试数据集");
            dataSetVo.setDsOrganId("0");
            dataSetVo.setDsCreateTime(new Date());
            dataSetVo.setDsCreator(jb4DCSession.getUserName());
            dataSetVo.setDsUpdateTime(new Date());
            dataSetVo.setDsUpdater(jb4DCSession.getUserName());
            dataSetVo.setDsType(DataSetTypeEnum.SQLDataSet.getText());
            dataSetVo.setDsIsSystem(TrueFalseEnum.False.getDisplayName());
            dataSetVo.setDsGroupId(dataSetGroupId);
            dataSetVo.setDsStatus(EnableTypeEnum.enable.getDisplayName());
            dataSetVo.setDsSqlSelectText(resolveToDataSetVo.getSqlWithEnvText());
            dataSetVo.setDsSqlSelectValue(resolveToDataSetVo.getSqlWithEnvValue());
            dataSetVo.setDsClassName("");
            dataSetVo.setDsRestStructureUrl("");
            dataSetVo.setDsRestDataUrl("");

            for (DataSetColumnVo dataSetColumnVo : resolveToDataSetVo.getDataSetVo().getColumnVoList()) {
                dataSetColumnVo.setColumnId(UUIDUtility.getUUID());
            }

            for (DataSetRelatedTableVo dataSetRelatedTableVo : resolveToDataSetVo.getDataSetVo().getRelatedTableVoList()) {
                dataSetRelatedTableVo.setRtId(UUIDUtility.getUUID());
            }

            dataSetVo.setColumnVoList(resolveToDataSetVo.getDataSetVo().getColumnVoList());
            dataSetVo.setRelatedTableVoList(resolveToDataSetVo.getDataSetVo().getRelatedTableVoList());

            MockHttpServletRequestBuilder requestBuilder = post("/Rest/Builder/DataSet/DataSetMain/SaveDataSetEdit");
            requestBuilder.sessionAttr(JB4DCSessionUtility.UserLoginSessionKey, getSession());
            requestBuilder.param("op","add");
            requestBuilder.param("dataSetVoJson", JsonUtility.toObjectString(dataSetVo));
            requestBuilder.param("dataSetId",dataSetId);
            MvcResult result = mockMvc.perform(requestBuilder).andReturn();
            String json = result.getResponse().getContentAsString();
            System.out.printf(json);
            JBuild4DCResponseVo responseVo = JsonUtility.toObject(json, JBuild4DCResponseVo.class);
            Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());
        }
    }

    @Test
    public void deleteSQLDataSet() throws Exception{
        addSQLDataSet();
        MockHttpServletRequestBuilder requestBuilder = post("/PlatForm/Builder/DataSet/DataSetMain/DeleteDataSet.do");
        requestBuilder.sessionAttr(JB4DCSessionUtility.UserLoginSessionKey, getSession());
        requestBuilder.param("dataSetId",dataSetId);
        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        System.out.printf(json);
        JBuild4DCResponseVo responseVo = JsonUtility.toObject(json, JBuild4DCResponseVo.class);
        Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());
        //做到这里
    }
}
