package com.jb4dc.devmock;

import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.tools.DateUtility;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/1
 * To change this template use File | Settings | File Templates.
 */
public class MockDataTest extends RestTestBase {


    @Autowired
    private ISQLBuilderService sqlBuilderService;

    @Test
    public void createTableData() throws Exception {

        createTableData1();
    }

    private void createTableData1() {
        sqlBuilderService.execute("delete TDEV_TEST_1");
        sqlBuilderService.execute("delete TDEV_TEST_2");
        for(int i=0;i<1000;i++) {
            String id = "ID" + i;
            String datetime = DateUtility.getDate_yyyy_MM_dd_HH_mm_ss();
            String sql = "INSERT INTO [dbo].[TDEV_TEST_1]\n" +
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
                    "           ,[F_NTEXT_2]\n" +
                    "           ,[F_NTEXT_3])\n" +
                    "     VALUES\n" +
                    "           ('" + id + "'\n" +
                    "           ,'" + datetime + "'\n" +
                    "           ,'" + i + "'\n" +
                    "           ,'10001'\n" +
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
                    "           ,null)";
            sqlBuilderService.execute(sql);

            sql = "INSERT INTO [dbo].[TDEV_TEST_2]\n" +
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
                    "           ,[F_NTEXT_3],[F_TABLE1_ID])\n" +
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

}
