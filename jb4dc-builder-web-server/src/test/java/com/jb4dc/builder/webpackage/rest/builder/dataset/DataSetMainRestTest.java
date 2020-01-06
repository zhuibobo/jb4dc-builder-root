package com.jb4dc.builder.webpackage.rest.builder.dataset;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dbentities.dataset.DatasetEntity;
import com.jb4dc.builder.exenum.DataSetTypeEnum;
import com.jb4dc.builder.po.DataSetColumnPO;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.builder.po.DataSetRelatedTablePO;
import com.jb4dc.builder.po.SQLResolveToDataSetPO;
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

    public static String devMockDataSetId="UnitTestDataSet001";
    public static String builderDataSetId="BuilderUnitTestDataSet001";
    //private String dataSetGroupId= DataSetGroupRestTest.devMockGroupId;

    @Test
    public void addSQLDataSet() throws Exception {
        createDataSet("select TDEV_TEST_1.*,TDEV_TEST_2.F_TABLE1_ID,'ADDRESS' ADDRESS,'SEX' SEX from TDEV_TEST_1 join TDEV_TEST_2 on TDEV_TEST_1.ID=TDEV_TEST_2.F_TABLE1_ID where TDEV_TEST_1.F_ORGAN_ID='#{EnvVar.当前用户所在组织ID}' order by TDEV_TEST_1.F_ORDER_NUM",
                devMockGroupId,devMockDataSetId);

        //createDataSet("select TDEV_TEST_3.*,TDEV_TEST_4.F_TABLE3_ID,'ADDRESS' ADDRESS,'SEX' SEX from TDEV_TEST_3 join TDEV_TEST_4 on TDEV_TEST_3.ID=TDEV_TEST_4.F_TABLE3_ID where 2=2 order by TDEV_TEST_3.F_ORDER_NUM",
        //        builderGroupId,builderDataSetId);
    }

    public void createDataSet(String sql,String dataSetGroupId,String dataSetId) throws Exception {
        validateSQLEnable();
        DatasetEntity existDataSet=datasetService.getVoByPrimaryKey(getSession(),dataSetId);
        if(existDataSet!=null){
            datasetService.deleteByKeyNotValidate(getSession(),dataSetId, JBuild4DCYaml.getWarningOperationCode());
        }
        //if(existDataSet==null) {
            //DataSetSQLDesignerRestTest dataSetSQLDesignerControllerTest = new DataSetSQLDesignerRestTest();
            JBuild4DCResponseVo jBuild4DResponseVo = this.validateSQLEnable(sql);
            SQLResolveToDataSetPO resolveToDataSetVo = (SQLResolveToDataSetPO) jBuild4DResponseVo.getData();
            JB4DCSession jb4DCSession=getSession();
            DataSetPO dataSetPO = new DataSetPO();
            dataSetPO.setDsId(dataSetId);
            dataSetPO.setDsCaption("单元测试数据集");
            dataSetPO.setDsName("单元测试数据集");
            dataSetPO.setDsOrganId("0");
            dataSetPO.setDsCreateTime(new Date());
            dataSetPO.setDsCreator(jb4DCSession.getUserName());
            dataSetPO.setDsUpdateTime(new Date());
            dataSetPO.setDsUpdater(jb4DCSession.getUserName());
            dataSetPO.setDsType(DataSetTypeEnum.SQLDataSet.getText());
            dataSetPO.setDsIsSystem(TrueFalseEnum.False.getDisplayName());
            dataSetPO.setDsGroupId(dataSetGroupId);
            dataSetPO.setDsStatus(EnableTypeEnum.enable.getDisplayName());
            dataSetPO.setDsSqlSelectText(resolveToDataSetVo.getSqlWithEnvText());
            dataSetPO.setDsSqlSelectValue(resolveToDataSetVo.getSqlWithEnvValue());
            dataSetPO.setDsClassName("");
            dataSetPO.setDsRestStructureUrl("");
            dataSetPO.setDsRestDataUrl("");

            for (DataSetColumnPO dataSetColumnVo : resolveToDataSetVo.getDataSetPO().getColumnVoList()) {
                dataSetColumnVo.setColumnId(UUIDUtility.getUUID());
            }

            for (DataSetRelatedTablePO dataSetRelatedTablePO : resolveToDataSetVo.getDataSetPO().getRelatedTableVoList()) {
                dataSetRelatedTablePO.setRtId(UUIDUtility.getUUID());
            }

            dataSetPO.setColumnVoList(resolveToDataSetVo.getDataSetPO().getColumnVoList());
            dataSetPO.setRelatedTableVoList(resolveToDataSetVo.getDataSetPO().getRelatedTableVoList());

            MockHttpServletRequestBuilder requestBuilder = post("/Rest/Builder/DataSet/DataSetMain/SaveDataSetEdit");
            requestBuilder.sessionAttr(JB4DCSessionUtility.UserLoginSessionKey, getSession());
            requestBuilder.param("op","add");
            requestBuilder.param("dataSetVoJson", JsonUtility.toObjectString(dataSetPO));
            requestBuilder.param("dataSetId",dataSetId);
            MvcResult result = mockMvc.perform(requestBuilder).andReturn();
            String json = result.getResponse().getContentAsString();
            System.out.printf(json);
            JBuild4DCResponseVo responseVo = JsonUtility.toObject(json, JBuild4DCResponseVo.class);
            Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());
        //}
    }

    /*@Test
    public void deleteSQLDataSet(String dataSetId) throws Exception{
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
    }*/
}
