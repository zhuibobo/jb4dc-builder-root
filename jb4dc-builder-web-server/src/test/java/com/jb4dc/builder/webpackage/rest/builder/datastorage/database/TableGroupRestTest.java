package com.jb4dc.builder.webpackage.rest.builder.datastorage.database;

import com.jb4dc.base.dbaccess.exenum.EnableTypeEnum;
import com.jb4dc.base.dbaccess.exenum.TrueFalseEnum;
import com.jb4dc.builder.dbentities.datastorage.TableGroupEntity;
import com.jb4dc.builder.service.datastorage.ITableGroupService;
import com.jb4dc.builder.webpackage.RestTestBase;
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

    public String tableGroupId="SQL_SERVER_DB_TABLE_GROUP_TEST_1";

    @Test
    public void CreateTestTableGroup() throws JBuild4DCGenerallyException {
        CreateTestDBLink();

        TableGroupEntity groupEntity=new TableGroupEntity();
        groupEntity.setTableGroupId(tableGroupId);
        groupEntity.setTableGroupValue(tableGroupId);
        groupEntity.setTableGroupText("单元测试表分组");
        groupEntity.setTableGroupDesc("");
        groupEntity.setTableGroupStatus(EnableTypeEnum.enable.getDisplayName());
        groupEntity.setTableGroupParentId(testDBLinkId);
        groupEntity.setTableGroupIsSystem(TrueFalseEnum.False.getDisplayName());
        groupEntity.setTableGroupDelEnable(TrueFalseEnum.True.getDisplayName());
        groupEntity.setTableGroupLinkId(testDBLinkId);

        tableGroupService.saveSimple(getSession(),tableGroupId,groupEntity);

        groupEntity=tableGroupService.getByPrimaryKey(getSession(),tableGroupId);
        Assert.assertEquals(tableGroupId,groupEntity.getTableGroupId());
    }
}
