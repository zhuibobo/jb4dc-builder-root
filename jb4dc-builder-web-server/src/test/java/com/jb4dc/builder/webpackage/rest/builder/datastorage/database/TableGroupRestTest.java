package com.jb4dc.builder.webpackage.rest.builder.datastorage.database;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.builder.dbentities.datastorage.TableGroupEntity;
import com.jb4dc.builder.service.datastorage.IDbLinkService;
import com.jb4dc.builder.service.datastorage.ITableGroupService;
import com.jb4dc.builder.service.datastorage.ITableService;
import com.jb4dc.builder.webpackage.rest.builder.datastorage.dblink.DBLinkRestTest;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/1
 * To change this template use File | Settings | File Templates.
 */
public class TableGroupRestTest extends DBLinkRestTest {
    //@Autowired
    //DBLinkRestTest dbLinkRestTest;

    @Autowired
    public ITableGroupService tableGroupService;

    @Autowired
    public ITableService tableService;

    public String devMockTableGroupId1 ="SQL_SERVER_DB_TABLE_GROUP_TEST_1";

    public String builderDevTableGroupId="SQL_SERVER_DB_TABLE_BUILDER_GROUP_TEST_1";


    @Test
    public void regTable() throws JBuild4DCGenerallyException {
        //网格事件相关信息
        TableGroupEntity eventGroupEnt=tableGroupService.getByPrimaryKey(getSession(),"TABLE_GROUP_GRID_SYSTEM_EVENT_GROUP_ID");
        tableService.registerSystemTableToBuilderToModule(getSession(),"TGRID_EVENT_INFO",eventGroupEnt);
        //tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TGRID_EVENT_RELEVANTER",eventGroupEnt);
        //tableService.registerSystemTableToBuilderToModule(getSession(),"TGRID_EVENT_PROCESS",eventGroupEnt);
    }

    @Test
    public void CreateTestTableGroup() throws JBuild4DCGenerallyException {
        CreateTestDBLink();

        createTableGroup(devMockTableGroupId1,"单元测试表分组",testDBLinkId);

        createTableGroup(builderDevTableGroupId,"开发测试表分组",testBuilderDBLinkId);
    }

    private void createTableGroup(String tableGroupId,String text,String dbLinkId) throws JBuild4DCGenerallyException {
        TableGroupEntity groupEntity=new TableGroupEntity();
        groupEntity.setTableGroupId(tableGroupId);
        groupEntity.setTableGroupValue(tableGroupId);
        groupEntity.setTableGroupText(text);
        groupEntity.setTableGroupDesc("");
        groupEntity.setTableGroupStatus(EnableTypeEnum.enable.getDisplayName());
        groupEntity.setTableGroupParentId(dbLinkId);
        groupEntity.setTableGroupIsSystem(TrueFalseEnum.False.getDisplayName());
        groupEntity.setTableGroupDelEnable(TrueFalseEnum.True.getDisplayName());
        groupEntity.setTableGroupLinkId(dbLinkId);

        tableGroupService.saveSimple(getSession(), tableGroupId,groupEntity);

        groupEntity=tableGroupService.getByPrimaryKey(getSession(), tableGroupId);
        Assert.assertEquals(tableGroupId,groupEntity.getTableGroupId());
    }
}
