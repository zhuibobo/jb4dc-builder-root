package com.jb4dc.builder.webpackage.rest.builder.datastorage.database;

import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.exenum.TableFieldTypeEnum;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.service.datastorage.ITableFieldService;
import com.jb4dc.builder.service.datastorage.ITableService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.list.IListWhereCondition;
import com.jb4dc.core.base.list.ListUtility;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.DateUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/1
 * To change this template use File | Settings | File Templates.
 */
public class TableRestTest extends TableGroupRestTest {

    @Autowired
    private ITableService tableService;

    @Autowired
    private ITableFieldService tableFieldService;

    @Autowired
    private ISQLBuilderService sqlBuilderService;

    @Test
    public void saveTableEdit() throws Exception {

        //sqlBuilderService.execute("delete TDEV_TEST_3");
        //sqlBuilderService.execute("delete TDEV_TEST_4");

        CreateTestTableGroup();

        saveTableEdit_Add("TDEV_TEST_1","开发测试表1",null,devMockTableGroupId1);

        List<TableFieldPO> appendTableFieldPO =new ArrayList<>();
        TableFieldPO ntextField1 = newFiled(getSession(), "TDEV_TEST_2", "F_TABLE1_ID", "F_TABLE1_ID",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType, 50, 0,
                "", "", "", "");
        appendTableFieldPO.add(ntextField1);

        saveTableEdit_Add("TDEV_TEST_2","开发测试表2", appendTableFieldPO,devMockTableGroupId1);

        saveTableEdit_Update(devMockTableGroupId1);

        saveTableEdit_Add("TDEV_TEST_3","开发测试表3",null,builderDevTableGroupId);

        List<TableFieldPO> appendTableFieldPO1 =new ArrayList<>();
        TableFieldPO ntextField2 = newFiled(getSession(), "TDEV_TEST_4", "F_TABLE3_ID", "F_TABLE3_ID",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType, 50, 0,
                "", "", "", "");
        appendTableFieldPO1.add(ntextField2);

        saveTableEdit_Add("TDEV_TEST_4","开发测试表4", appendTableFieldPO1,builderDevTableGroupId);

        createTableData();
    }

    private void createTableData() {
        for(int i=0;i<1000;i++) {
            String id = "ID" + i;
            String datetime = DateUtility.getDate_yyyy_MM_dd_HH_mm_ss();
            String sql = "INSERT INTO [dbo].[TDEV_TEST_3]\n" +
                    "           ([ID]\n" +
                    "           ,[F_CREATE_TIME]\n" +
                    "           ,[F_ORDER_NUM]\n" +
                    "           ,[F_ORGAN_ID]\n" +
                    "           ,[F_ORGAN_NAME]\n" +
                    "           ,[F_USER_ID]\n" +
                    "           ,[F_USER_NAME]\n" +
                    "           ,[F_MAIN_IMG_ID]\n" +
                    "           ,[F_TITLE]\n" +
                    "           ,[F_CONTENT]\n" +
                    "           ,[F_PUBLIC_TIME]\n" +
                    "           ,[F_PUBLIC_STATUS]\n" +
                    "           ,[F_KEY_WORDS]\n" +
                    "           ,[F_COLUMN_ID]\n" +
                    "           ,[F_AUTHOR]\n" +
                    "           ,[F_NTEXT_1]\n" +
                    "           ,[F_NTEXT_2]\n" +
                    "           ,[F_NTEXT_3])\n" +
                    "     VALUES\n" +
                    "           ('" + id + "'\n" +
                    "           ,'" + datetime + "'\n" +
                    "           ,'" + i + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getOrganId() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getOrganName() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserId() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,'1'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,'" + datetime + "'\n" +
                    "           ,'启用'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,null)";
            sqlBuilderService.execute(sql);

            sql = "INSERT INTO [dbo].[TDEV_TEST_4]\n" +
                    "           ([ID]\n" +
                    "           ,[F_CREATE_TIME]\n" +
                    "           ,[F_ORDER_NUM]\n" +
                    "           ,[F_ORGAN_ID]\n" +
                    "           ,[F_ORGAN_NAME]\n" +
                    "           ,[F_USER_ID]\n" +
                    "           ,[F_USER_NAME]\n" +
                    "           ,[F_MAIN_IMG_ID]\n" +
                    "           ,[F_TITLE]\n" +
                    "           ,[F_CONTENT]\n" +
                    "           ,[F_PUBLIC_TIME]\n" +
                    "           ,[F_PUBLIC_STATUS]\n" +
                    "           ,[F_KEY_WORDS]\n" +
                    "           ,[F_COLUMN_ID]\n" +
                    "           ,[F_AUTHOR]\n" +
                    "           ,[F_NTEXT_1]\n" +
                    "           ,[F_NTEXT_2]\n" +
                    "           ,[F_NTEXT_3],[F_TABLE3_ID])\n" +
                    "     VALUES\n" +
                    "           ('" + id + "_OUTER1" + "'\n" +
                    "           ,'" + datetime + "'\n" +
                    "           ,'" + i + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getOrganId() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getOrganName() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserId() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,'1'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,'" + datetime + "'\n" +
                    "           ,'启用'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,'" + JB4DCSessionUtility.getInitSystemSession().getUserName() + "'\n" +
                    "           ,null,'" + id + "')";
            sqlBuilderService.execute(sql);
        }
    }


    private void saveTableEdit_Add(String tableName, String tableCaption, List<TableFieldPO> appendTableFieldPO, String tableGroupId) throws Exception {
        TableEntity newTable = getTableEntity(getSession(), tableName, tableCaption, tableName,tableGroupId);

        //验证是否存在同名的表，存在则删除表
        MockHttpServletRequestBuilder requestBuilder = post("/Rest/Builder/DataStorage/DataBase/Table/ValidateTableIsNoExist");
        requestBuilder.sessionAttr(JB4DCSessionUtility.UserLoginSessionKey, getSession());
        requestBuilder.param("tableName", newTable.getTableName());
        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DCResponseVo responseVo = JsonUtility.toObject(json, JBuild4DCResponseVo.class);
        if (!responseVo.isSuccess()) {
            TableEntity tempTableEntity=tableService.getByTableName(getSession(),newTable.getTableName());
            tableService.deletePhysicsTable(getSession(),newTable.getTableName(),JBuild4DCYaml.getWarningOperationCode(), false);
            tableService.deleteByKeyNotValidate(getSession(),tempTableEntity.getTableId(), JBuild4DCYaml.getWarningOperationCode());
            tableFieldService.deleteByTableId(getSession(),tempTableEntity.getTableId());
        }
        requestBuilder = post("/Rest/Builder/DataStorage/DataBase/Table/SaveTableEdit");
        requestBuilder.sessionAttr(JB4DCSessionUtility.UserLoginSessionKey, getSession());

        String tableEntityJson = URLEncoder.encode(URLEncoder.encode(JsonUtility.toObjectString(newTable), "utf-8"), "utf-8");

        //调用接口，获取通用模版
        List<TableFieldPO> templateFieldVoList = getFieldVoListGeneralTemplate(tableGroupId);
        TableFieldPO ntextField1 = newFiled(getSession(), newTable.getTableId(), "F_NTEXT_1", "F_NTEXT_1",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.TextType, 0, 0,
                "", "", "", "");
        templateFieldVoList.add(ntextField1);

        TableFieldPO ntextField2 = newFiled(getSession(), newTable.getTableId(), "F_NTEXT_2", "F_NTEXT_2",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.TextType, 0, 0,
                "", "", "", "");
        templateFieldVoList.add(ntextField2);

        TableFieldPO ntextField3 = newFiled(getSession(), newTable.getTableId(), "F_NTEXT_3", "F_NTEXT_3",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.TextType, 0, 0,
                "", "", "", "");
        templateFieldVoList.add(ntextField3);

        if(appendTableFieldPO !=null) {
            templateFieldVoList.addAll(appendTableFieldPO);
        }

        String fieldVoListJson = URLEncoder.encode(URLEncoder.encode(JsonUtility.toObjectString(templateFieldVoList), "utf-8"), "utf-8");
        requestBuilder.param("op", "add");
        requestBuilder.param("tableEntityJson", tableEntityJson);
        requestBuilder.param("fieldVoListJson", fieldVoListJson);
        requestBuilder.param("groupId", tableGroupId);
        requestBuilder.param("ignorePhysicalError", "false");

        result = mockMvc.perform(requestBuilder).andReturn();
        json = result.getResponse().getContentAsString();
        responseVo = JsonUtility.toObject(json, JBuild4DCResponseVo.class);
        Assert.assertTrue(responseVo.isSuccess());
        System.out.println(json);
    }

    private void saveTableEdit_Update(String tableGroupId) throws Exception {
        TableEntity tableEntity=tableService.getByTableName(getSession(),"TDEV_TEST_1");
        JBuild4DCResponseVo responseVo=getEditTableData("update",tableEntity.getTableId(),tableGroupId);
        List<TableFieldPO> tableFieldPOList =new ArrayList<>();
        List<Map> mapList=(List<Map>)responseVo.getExKVData().get("tableFieldsData");
        for (Map mapVo : mapList) {
            String recordString=JsonUtility.toObjectString(mapVo);
            tableFieldPOList.add(JsonUtility.toObject(recordString, TableFieldPO.class));
        }

        //新增列
        TableFieldPO ntextField = newFiled(getSession(), tableEntity.getTableId(), "F_NTEXT_N_1", "F_NTEXT_N_1",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.TextType, 0, 0,
                "", "", "", "");
        tableFieldPOList.add(ntextField);

        //删除列
        tableFieldPOList.remove(ListUtility.WhereSingle(tableFieldPOList, new IListWhereCondition<TableFieldPO>() {
            @Override
            public boolean Condition(TableFieldPO item) {
                return item.getFieldName().equals("F_NTEXT_1");
            }
        }));

        //修改列
        TableFieldPO ntextField2= ListUtility.WhereSingle(tableFieldPOList, new IListWhereCondition<TableFieldPO>() {
            @Override
            public boolean Condition(TableFieldPO item) {
                return item.getFieldName().equals("F_NTEXT_2");
            }
        });
        ntextField2.setFieldDataType(TableFieldTypeEnum.NVarCharType.getText());
        ntextField2.setFieldDataLength(200);

        //调用方法

        MockHttpServletRequestBuilder requestBuilder = post("/Rest/Builder/DataStorage/DataBase/Table/SaveTableEdit");
        requestBuilder.sessionAttr(JB4DCSessionUtility.UserLoginSessionKey, getSession());
        String tableEntityJson = URLEncoder.encode(URLEncoder.encode(JsonUtility.toObjectString(tableEntity), "utf-8"), "utf-8");
        String fieldVoListJson =  URLEncoder.encode(URLEncoder.encode(JsonUtility.toObjectString(tableFieldPOList), "utf-8"), "utf-8");
        requestBuilder.param("op", "update");
        requestBuilder.param("tableEntityJson", tableEntityJson);
        requestBuilder.param("fieldVoListJson", fieldVoListJson);
        requestBuilder.param("ignorePhysicalError", "false");

        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        responseVo = JsonUtility.toObject(json, JBuild4DCResponseVo.class);
        System.out.println(json);
        Assert.assertTrue(responseVo.isSuccess());
    }

    private TableEntity getTableEntity(JB4DCSession jb4DCSession, String tableId, String tableCaption, String tableName,String tableGroupId) throws JBuild4DCGenerallyException {
        TableEntity tableEntity=new TableEntity();
        tableEntity.setTableId(tableId);
        tableEntity.setTableCaption(tableCaption);
        tableEntity.setTableName(tableName);
        //tableEntity.setTableDbName("");
        tableEntity.setTableOrganId(jb4DCSession.getOrganId());
        tableEntity.setTableCreateTime(new Date());
        tableEntity.setTableCreator(jb4DCSession.getUserName());
        tableEntity.setTableUpdateTime(new Date());
        tableEntity.setTableUpdater(jb4DCSession.getUserName());
        tableEntity.setTableServiceValue("");
        tableEntity.setTableType("");
        tableEntity.setTableIsSystem(TrueFalseEnum.False.getDisplayName());
        tableEntity.setTableOrderNum(0);
        tableEntity.setTableDesc("");
        tableEntity.setTableLinkId(testDBLinkId);

        /*TableGroupEntity tableGroupEntity=tableGroupService.getByGroupText(jb4DCSession,"开发测试");
        if(tableGroupEntity==null){
            tableGroupEntity=new TableGroupEntity();
            tableGroupEntity.setTableGroupId("DevGroup");
            tableGroupEntity.setTableGroupValue("开发测试");
            tableGroupEntity.setTableGroupText("开发测试");
            tableGroupEntity.setTableGroupOrderNum(0);
            tableGroupEntity.setTableGroupCreateTime(new Date());
            tableGroupEntity.setTableGroupDesc("");
            tableGroupEntity.setTableGroupStatus("");
            tableGroupEntity.setTableGroupParentId(tableGroupService.getRootId());
            tableGroupEntity.setTableGroupIsSystem(TrueFalseEnum.False.getDisplayName());
            tableGroupEntity.setTableGroupDelEnable(TrueFalseEnum.False.getDisplayName());
            tableGroupEntity.setTableGroupLinkId(testDBLinkId);
            tableGroupService.saveSimple(jb4DCSession,tableGroupEntity.getTableGroupId(),tableGroupEntity);
        }*/

        tableEntity.setTableGroupId(tableGroupId);
        tableEntity.setTableStatus("");
        tableEntity.setTableLinkId("");
        return tableEntity;
    }

    private TableFieldPO newFiled(JB4DCSession jb4DCSession, String tableId, String fieldName, String fieldCaption,
                                  TrueFalseEnum pk, TrueFalseEnum allowNull,
                                  TableFieldTypeEnum fieldDataType, int dataLength, int decimalLength,
                                  String fieldDefaultValue, String fieldDefaultText, String fieldDesc, String templateName
    ){
        TableFieldPO fieldVO=new TableFieldPO();
        fieldVO.setFieldId(UUIDUtility.getUUIDNotSplit());
        fieldVO.setFieldTableId(tableId);
        fieldVO.setFieldName(fieldName);
        fieldVO.setFieldCaption(fieldCaption);
        fieldVO.setFieldIsPk(pk.getDisplayName());
        fieldVO.setFieldAllowNull(allowNull.getDisplayName());
        fieldVO.setFieldDataType(fieldDataType.getText());
        fieldVO.setFieldDataLength(dataLength);
        fieldVO.setFieldDecimalLength(decimalLength);
        fieldVO.setFieldDefaultValue(fieldDefaultValue);
        fieldVO.setFieldDefaultText(fieldDefaultText);
        fieldVO.setFieldCreateTime(new Date());
        fieldVO.setFieldCreator(jb4DCSession.getUserName());
        fieldVO.setFieldUpdateTime(new Date());
        fieldVO.setFieldUpdater(jb4DCSession.getUserName());
        fieldVO.setFieldDesc(fieldDesc);
        fieldVO.setFieldTemplateName(templateName);
        return fieldVO;
    }

    private List<TableFieldPO> getFieldVoListGeneralTemplate(String tableGroupId) throws Exception {
        JBuild4DCResponseVo responseVo = getEditTableData("add","Empty",tableGroupId);
        System.out.println(responseVo);
        //JBuild4DResponseVo responseVo= tableController.GetEditTableData("xxx","add","DevGroup");

        List<TableFieldPO> tableFieldPOList =new ArrayList<>();
        List<Map> mapList=((Map<String,List<Map>>)responseVo.getExKVData().get("templateFieldGroup")).get("新闻类模版");
        for (Map mapVo : mapList) {
            String recordString=JsonUtility.toObjectString(mapVo);
            tableFieldPOList.add(JsonUtility.toObject(recordString, TableFieldPO.class));
        }
        return tableFieldPOList;
    }

    private JBuild4DCResponseVo getEditTableData(String op,String recordId,String tableGroupId) throws Exception {
        MockHttpServletRequestBuilder requestBuilder =post("/Rest/Builder/DataStorage/DataBase/Table/GetEditTableData");
        requestBuilder.sessionAttr(JB4DCSessionUtility.UserLoginSessionKey,getSession());
        requestBuilder.param("op",op);
        requestBuilder.param("groupId", tableGroupId);
        requestBuilder.param("recordId",recordId);
        MvcResult result=mockMvc.perform(requestBuilder).andReturn();
        String json=result.getResponse().getContentAsString();
        return JsonUtility.toObject(json, JBuild4DCResponseVo.class);
    }
}
