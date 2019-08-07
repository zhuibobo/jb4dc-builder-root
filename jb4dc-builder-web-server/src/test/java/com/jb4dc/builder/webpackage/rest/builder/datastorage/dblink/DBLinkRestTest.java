package com.jb4dc.builder.webpackage.rest.builder.datastorage.dblink;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.builder.dbentities.datastorage.DbLinkEntity;
import com.jb4dc.builder.service.datastorage.IDbLinkService;
import com.jb4dc.builder.webpackage.RestTestBase;
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
public class DBLinkRestTest extends RestTestBase {
    @Autowired
    IDbLinkService dbLinkService;

    public String testDBLinkId="JBuild4DCDevMockDBLink";

    @Test
    public void CreateTestDBLink() throws JBuild4DCGenerallyException {
        DbLinkEntity dbLinkEntity=new DbLinkEntity();
        dbLinkEntity.setDbId(testDBLinkId);
        dbLinkEntity.setDbLinkValue(testDBLinkId);
        dbLinkEntity.setDbLinkName("开发样例库连接");
        dbLinkEntity.setDbType("sqlserver");
        dbLinkEntity.setDbDriverName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        dbLinkEntity.setDbDatabaseName("JB4DC_DEV_MOCK_V01");
        dbLinkEntity.setDbUrl("jdbc:sqlserver://127.0.0.1:1433; DatabaseName=JB4DC_DEV_MOCK_V01");
        dbLinkEntity.setDbUser("sa");
        dbLinkEntity.setDbPassword("sql");
        dbLinkEntity.setDbDesc("单元测试修改");
        dbLinkEntity.setDbIsLocation(TrueFalseEnum.False.getDisplayName());
        dbLinkEntity.setDbStatus(EnableTypeEnum.enable.getDisplayName());

        dbLinkService.saveSimple(getSession(),testDBLinkId,dbLinkEntity);

        dbLinkEntity=dbLinkService.getByPrimaryKey(getSession(),testDBLinkId);
        Assert.assertEquals(testDBLinkId,dbLinkEntity.getDbId());
    }
}
